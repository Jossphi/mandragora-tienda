import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

// Cart lives in the database (cart_items) for signed-in customers and in
// localStorage for guests. When a guest signs in, their cart is merged into
// their account.

const LOCAL_KEY = 'mg_cart_v1';
const MAX_QTY = 50;
const CartContext = createContext(null);

const readLocal = () => {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};
const writeLocal = (items) => {
  try { localStorage.setItem(LOCAL_KEY, JSON.stringify(items)); } catch { /* storage unavailable */ }
};

const CART_SELECT = `
  quantity,
  variant_id,
  product_variants (
    id, label, color, price_modifier, stock,
    products ( slug, name, base_price, is_active, product_images ( image_url, is_primary, display_order, variant_id ) )
  )
`;

function rowToItem(row) {
  const v = row.product_variants;
  const p = v?.products;
  if (!v || !p) return null;
  const imgs = [...(p.product_images || [])].sort(
    (a, b) => (b.is_primary - a.is_primary) || (a.display_order - b.display_order)
  );
  const variantImg = imgs.find((i) => i.variant_id === v.id);
  return {
    variantId: v.id,
    qty: row.quantity,
    slug: p.slug,
    name: p.name,
    label: v.label && v.label !== 'Estándar' ? v.label : '',
    image: (variantImg || imgs[0] || {}).image_url || '',
    unitPrice: Number(p.base_price) + Number(v.price_modifier || 0),
    stock: v.stock,
    available: p.is_active,
  };
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState(() => readLocal());
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  const userId = user?.id ?? null;

  const loadRemote = useCallback(async (uid) => {
    const { data, error } = await supabase.from('cart_items').select(CART_SELECT).eq('user_id', uid).order('created_at');
    if (error) throw error;
    setItems((data || []).map(rowToItem).filter(Boolean));
  }, []);

  // On sign-in: merge the guest cart into the account, then load it.
  useEffect(() => {
    let cancelled = false;
    async function sync() {
      if (!userId) {
        setItems(readLocal());
        return;
      }
      setLoading(true);
      try {
        const local = readLocal();
        if (local.length) {
          const { data: existing } = await supabase
            .from('cart_items').select('variant_id, quantity').eq('user_id', userId);
          const current = new Map((existing || []).map((r) => [r.variant_id, r.quantity]));
          const rows = local.map((it) => ({
            user_id: userId,
            variant_id: it.variantId,
            quantity: Math.min(MAX_QTY, (current.get(it.variantId) || 0) + it.qty),
          }));
          const { error } = await supabase.from('cart_items').upsert(rows, { onConflict: 'user_id,variant_id' });
          if (!error) writeLocal([]);
        }
        if (!cancelled) await loadRemote(userId);
      } catch (err) {
        console.error('Error syncing cart:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    sync();
    return () => { cancelled = true; };
  }, [userId, loadRemote]);

  const showToast = (message) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  };

  const setQty = useCallback(async (variantId, qty) => {
    const q = Math.max(0, Math.min(MAX_QTY, qty));
    setItems((prev) => {
      const next = q === 0
        ? prev.filter((i) => i.variantId !== variantId)
        : prev.map((i) => (i.variantId === variantId ? { ...i, qty: q } : i));
      if (!userId) writeLocal(next);
      return next;
    });
    if (userId) {
      const req = q === 0
        ? supabase.from('cart_items').delete().eq('user_id', userId).eq('variant_id', variantId)
        : supabase.from('cart_items').update({ quantity: q }).eq('user_id', userId).eq('variant_id', variantId);
      const { error } = await req;
      if (error) {
        console.error('Error updating cart:', error);
        loadRemote(userId);
      }
    }
  }, [userId, loadRemote]);

  // product: shape returned by formatProduct(); variant: one of product.variants
  const addToCart = useCallback(async (product, variant = null, qty = 1) => {
    const v = variant || product?.variants?.[0];
    if (!product || !v) return;
    const existing = items.find((i) => i.variantId === v.id);
    const newQty = Math.min(MAX_QTY, (existing?.qty || 0) + qty);
    const item = {
      variantId: v.id,
      qty: newQty,
      slug: product.id,
      name: product.name,
      label: v.label && v.label !== 'Estándar' ? v.label : '',
      image: v.image || product.image,
      unitPrice: product.priceNum + (v.priceModifier || 0),
      stock: v.stock,
      available: true,
    };
    setItems((prev) => {
      const next = existing ? prev.map((i) => (i.variantId === v.id ? item : i)) : [...prev, item];
      if (!userId) writeLocal(next);
      return next;
    });
    showToast(`${product.name}${item.label ? ` · ${item.label}` : ''} se añadió a tu carrito`);
    if (userId) {
      const { error } = await supabase
        .from('cart_items')
        .upsert({ user_id: userId, variant_id: v.id, quantity: newQty }, { onConflict: 'user_id,variant_id' });
      if (error) {
        console.error('Error adding to cart:', error);
        loadRemote(userId);
      }
    }
  }, [items, userId, loadRemote]);

  const removeItem = useCallback((variantId) => setQty(variantId, 0), [setQty]);

  const reload = useCallback(() => (userId ? loadRemote(userId) : setItems(readLocal())), [userId, loadRemote]);

  const count = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.qty * i.unitPrice, 0);

  return (
    <CartContext.Provider value={{ items, count, subtotal, loading, addToCart, setQty, removeItem, reload, toast, dismissToast: () => setToast(null) }}>
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  return useContext(CartContext);
}
