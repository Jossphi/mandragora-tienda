import { useCart } from '../../context/CartContext';

// Small confirmation shown after adding a product to the cart.
export default function CartToast({ onNavigate }) {
  const { toast, dismissToast } = useCart();
  if (!toast) return null;
  return (
    <div role="status" className="cart-toast">
      <span style={{ flex: 1 }}>{toast}</span>
      <button
        onClick={() => { dismissToast(); onNavigate('cart'); }}
        style={{ background: '#fff', color: '#23161c', border: 'none', padding: '10px 14px', fontSize: 10.5, letterSpacing: '0.16em', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'var(--font-sans)' }}
      >
        VER CARRITO
      </button>
      <button aria-label="Cerrar" onClick={dismissToast} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 18, cursor: 'pointer', lineHeight: 1 }}>×</button>
    </div>
  );
}
