-- ==============================================
-- Cuentas, carrito y pedidos (Yape / Plin) + seguridad (RLS)
-- ==============================================

-- ---------- Helpers ----------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p JOIN roles r ON r.id = p.role_id
    WHERE p.id = auth.uid() AND r.name = 'admin'
  );
$$;

-- Signup trigger also stores the phone given at registration.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, role_id)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone',
    2
  );
  RETURN new;
END;
$$;

-- ---------- Orders: extra columns ----------
CREATE SEQUENCE IF NOT EXISTS public.order_number_seq START 1001;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_number INTEGER UNIQUE DEFAULT nextval('public.order_number_seq');
ALTER TABLE orders ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10, 2);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_cost DECIMAL(10, 2);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_payment_method_check;
ALTER TABLE orders ADD CONSTRAINT orders_payment_method_check CHECK (payment_method IN ('yape', 'plin'));

ALTER TABLE cart_items DROP CONSTRAINT IF EXISTS cart_items_quantity_check;
ALTER TABLE cart_items ADD CONSTRAINT cart_items_quantity_check CHECK (quantity > 0 AND quantity <= 50);

-- ---------- Row Level Security ----------
ALTER TABLE roles            ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_statuses   ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments      ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories       ENABLE ROW LEVEL SECURITY;
ALTER TABLE products         ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images   ENABLE ROW LEVEL SECURITY;
ALTER TABLE discounts        ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders           ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items      ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items       ENABLE ROW LEVEL SECURITY;

-- Old, too-open profile policies (anyone could read every customer's email).
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Public catalog: anyone can read, only admins write.
CREATE POLICY "catalog_read" ON categories       FOR SELECT USING (true);
CREATE POLICY "catalog_read" ON products         FOR SELECT USING (is_active OR public.is_admin());
CREATE POLICY "catalog_read" ON product_variants FOR SELECT USING (true);
CREATE POLICY "catalog_read" ON product_images   FOR SELECT USING (true);
CREATE POLICY "catalog_read" ON departments      FOR SELECT USING (true);
CREATE POLICY "catalog_read" ON order_statuses   FOR SELECT USING (true);
CREATE POLICY "roles_read"   ON roles            FOR SELECT TO authenticated USING (true);

CREATE POLICY "admin_write" ON categories       FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin_write" ON products         FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin_write" ON product_variants FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin_write" ON product_images   FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin_write" ON departments      FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin_all"   ON discounts        FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Profiles: each customer sees and edits only their own (role is not editable).
CREATE POLICY "profile_select_own" ON profiles FOR SELECT TO authenticated USING (id = auth.uid() OR public.is_admin());
CREATE POLICY "profile_update_own" ON profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
REVOKE INSERT, UPDATE, DELETE ON profiles FROM anon, authenticated;
GRANT UPDATE (full_name, phone, department_id, district, address, reference) ON profiles TO authenticated;

-- Cart: only the owner.
CREATE POLICY "cart_own" ON cart_items FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Orders: customers read their own; they are created only through place_order().
CREATE POLICY "orders_select_own" ON orders FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "orders_admin_update" ON orders FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "order_items_select_own" ON order_items FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM orders o WHERE o.id = order_id AND (o.user_id = auth.uid() OR public.is_admin())));
REVOKE INSERT, DELETE ON orders, order_items FROM anon, authenticated;

-- ---------- Checkout ----------
-- Creates the order from the customer's cart. Prices and shipping are computed
-- here, never trusted from the browser.
CREATE OR REPLACE FUNCTION public.place_order(p_payment_method text, p_shipping jsonb)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_dept departments%ROWTYPE;
  v_subtotal numeric := 0;
  v_order_id uuid;
  v_order_number int;
  v_count int;
  v_bad text;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Debes iniciar sesión para comprar';
  END IF;
  IF p_payment_method NOT IN ('yape', 'plin') THEN
    RAISE EXCEPTION 'Método de pago no válido';
  END IF;
  IF coalesce(trim(p_shipping->>'full_name'), '') = ''
     OR coalesce(trim(p_shipping->>'phone'), '') = ''
     OR coalesce(trim(p_shipping->>'district'), '') = ''
     OR coalesce(trim(p_shipping->>'address'), '') = '' THEN
    RAISE EXCEPTION 'Completa tus datos de envío';
  END IF;

  SELECT * INTO v_dept FROM departments
   WHERE id = (p_shipping->>'department_id')::int AND is_active;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Selecciona un departamento válido';
  END IF;

  SELECT count(*) INTO v_count FROM cart_items WHERE user_id = v_uid;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'Tu carrito está vacío';
  END IF;

  -- Inactive products or not enough stock
  SELECT p.name INTO v_bad
    FROM cart_items c
    JOIN product_variants v ON v.id = c.variant_id
    JOIN products p ON p.id = v.product_id
   WHERE c.user_id = v_uid AND (NOT p.is_active OR v.stock < c.quantity)
   LIMIT 1;
  IF v_bad IS NOT NULL THEN
    RAISE EXCEPTION 'No hay stock suficiente de %', v_bad;
  END IF;

  SELECT sum((p.base_price + coalesce(v.price_modifier, 0)) * c.quantity) INTO v_subtotal
    FROM cart_items c
    JOIN product_variants v ON v.id = c.variant_id
    JOIN products p ON p.id = v.product_id
   WHERE c.user_id = v_uid;

  INSERT INTO orders (user_id, status_id, payment_method, subtotal, shipping_cost, total_amount, shipping_address)
  VALUES (
    v_uid,
    (SELECT id FROM order_statuses WHERE code = 'pending_payment'),
    p_payment_method,
    v_subtotal,
    v_dept.shipping_cost,
    v_subtotal + v_dept.shipping_cost,
    jsonb_build_object(
      'full_name', trim(p_shipping->>'full_name'),
      'phone', trim(p_shipping->>'phone'),
      'department_id', v_dept.id,
      'department', v_dept.name,
      'district', trim(p_shipping->>'district'),
      'address', trim(p_shipping->>'address'),
      'reference', coalesce(trim(p_shipping->>'reference'), '')
    )
  )
  RETURNING id, order_number INTO v_order_id, v_order_number;

  INSERT INTO order_items (order_id, variant_id, quantity, unit_price)
  SELECT v_order_id, c.variant_id, c.quantity, p.base_price + coalesce(v.price_modifier, 0)
    FROM cart_items c
    JOIN product_variants v ON v.id = c.variant_id
    JOIN products p ON p.id = v.product_id
   WHERE c.user_id = v_uid;

  UPDATE product_variants v SET stock = v.stock - c.quantity
    FROM cart_items c
   WHERE c.user_id = v_uid AND c.variant_id = v.id;

  DELETE FROM cart_items WHERE user_id = v_uid;

  -- Remember the shipping data for next time.
  UPDATE profiles SET
    full_name = trim(p_shipping->>'full_name'),
    phone = trim(p_shipping->>'phone'),
    department_id = v_dept.id,
    district = trim(p_shipping->>'district'),
    address = trim(p_shipping->>'address'),
    reference = coalesce(trim(p_shipping->>'reference'), '')
  WHERE id = v_uid;

  RETURN jsonb_build_object(
    'id', v_order_id,
    'order_number', v_order_number,
    'subtotal', v_subtotal,
    'shipping_cost', v_dept.shipping_cost,
    'total', v_subtotal + v_dept.shipping_cost
  );
END;
$$;

-- Saves the payment screenshot path and moves the order to "en revisión".
CREATE OR REPLACE FUNCTION public.attach_payment_receipt(p_order_id uuid, p_path text)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Debes iniciar sesión';
  END IF;
  IF split_part(p_path, '/', 1) <> auth.uid()::text THEN
    RAISE EXCEPTION 'Archivo no válido';
  END IF;
  UPDATE orders SET
    payment_receipt_url = p_path,
    status_id = (SELECT id FROM order_statuses WHERE code = 'payment_uploaded'),
    updated_at = timezone('utc', now())
  WHERE id = p_order_id
    AND user_id = auth.uid()
    AND status_id IN (SELECT id FROM order_statuses WHERE code IN ('pending_payment', 'payment_uploaded'));
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Pedido no encontrado';
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.place_order(text, jsonb) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.attach_payment_receipt(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.place_order(text, jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.attach_payment_receipt(uuid, text) TO authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- ---------- Storage: payment screenshots (private bucket "receipts") ----------
-- Files live under receipts/<user id>/...
CREATE POLICY "receipts_insert_own" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'receipts' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "receipts_select_own" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'receipts' AND ((storage.foldername(name))[1] = auth.uid()::text OR public.is_admin()));
CREATE POLICY "products_admin_write" ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'products' AND public.is_admin()) WITH CHECK (bucket_id = 'products' AND public.is_admin());
