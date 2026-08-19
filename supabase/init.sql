-- ==============================================
-- MANDRÁGORA SUPABASE INIT SCRIPT
-- ==============================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ROLES
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT
);

INSERT INTO roles (name, description) VALUES 
('admin', 'Administrador de la tienda'),
('customer', 'Cliente regular');

-- 3. ORDER STATUSES
CREATE TABLE order_statuses (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    label VARCHAR(100) NOT NULL,
    color_hex VARCHAR(7)
);

INSERT INTO order_statuses (code, label, color_hex) VALUES 
('pending_payment', 'Esperando Pago', '#f59e0b'),
('payment_uploaded', 'Pago Subido (En Revisión)', '#3b82f6'),
('confirmed', 'Confirmado', '#10b981'),
('shipped', 'Enviado', '#8b5cf6'),
('delivered', 'Entregado', '#14b8a6'),
('cancelled', 'Cancelado', '#ef4444');

-- 4. DEPARTMENTS
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    shipping_cost DECIMAL(10, 2) NOT NULL DEFAULT 15.00,
    is_active BOOLEAN DEFAULT true
);

INSERT INTO departments (name, shipping_cost) VALUES 
('Amazonas', 20.00), ('Áncash', 15.00), ('Apurímac', 20.00), ('Arequipa', 18.00),
('Ayacucho', 20.00), ('Cajamarca', 20.00), ('Callao', 10.00), ('Cusco', 18.00),
('Huancavelica', 20.00), ('Huánuco', 20.00), ('Ica', 15.00), ('Junín', 18.00),
('La Libertad', 15.00), ('Lambayeque', 15.00), ('Lima', 10.00), ('Loreto', 25.00),
('Madre de Dios', 25.00), ('Moquegua', 18.00), ('Pasco', 20.00), ('Piura', 18.00),
('Puno', 20.00), ('San Martín', 22.00), ('Tacna', 18.00), ('Tumbes', 20.00), ('Ucayali', 22.00);

-- 5. USERS (Extends Supabase Auth Auth.users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id INTEGER REFERENCES roles(id) DEFAULT 2,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    department_id INTEGER REFERENCES departments(id),
    district VARCHAR(100),
    address TEXT,
    reference TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Automate profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role_id)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', 2);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 6. CATEGORIES
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO categories (name, slug) VALUES 
('Aretes', 'aretes'),
('Collares', 'collares'),
('Pulseras', 'pulseras'),
('Anillos', 'anillos'),
('Sets', 'sets'),
('Charms', 'charms');

-- 7. PRODUCTS
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id INTEGER REFERENCES categories(id),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    base_price DECIMAL(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    is_novios BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- 8. PRODUCT VARIANTS
CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    sku VARCHAR(100) UNIQUE,
    color VARCHAR(50),
    material VARCHAR(50),
    size VARCHAR(50),
    price_modifier DECIMAL(10, 2) DEFAULT 0.00,
    stock INTEGER DEFAULT 0 NOT NULL
);

-- 9. PRODUCT IMAGES
CREATE TABLE product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0
);

-- 10. DISCOUNTS
CREATE TABLE discounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(20) CHECK (type IN ('percentage', 'fixed')),
    value DECIMAL(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT true
);

-- 11. ORDERS
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id),
    discount_id UUID REFERENCES discounts(id),
    status_id INTEGER REFERENCES order_statuses(id) DEFAULT 1,
    payment_method VARCHAR(50) NOT NULL,
    payment_receipt_url TEXT,
    total_amount DECIMAL(10, 2) NOT NULL,
    shipping_address JSONB NOT NULL,
    tracking_number VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- 12. ORDER ITEMS
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL
);

-- 13. CART ITEMS
CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    UNIQUE(user_id, variant_id)
);

-- 14. STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public) VALUES 
('products', 'products', true),
('receipts', 'receipts', false);

-- Enable RLS on receipts (Only admins can view all, users can upload/view their own)
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Note: RLS policies for products, orders and cart items should be configured next.
