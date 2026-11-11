import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../hooks/useProducts';
import { primaryButton, secondaryButton, pageTitle } from '../components/ui/formStyles';

export default function CartPage({ onNavigate }) {
  const { items, subtotal, setQty, removeItem, loading } = useCart();
  const { user } = useAuth();

  const goCheckout = () => onNavigate(user ? 'checkout' : 'login?next=checkout');

  return (
    <main className="page-enter" style={{ maxWidth: 1180, margin: '0 auto', padding: '56px clamp(16px, 4vw, 40px) 40px' }}>
      <div style={{ fontSize: '10.5px', letterSpacing: '0.3em', color: '#8a5f73' }}>INICIO / CARRITO</div>
      <h1 style={{ ...pageTitle, margin: '14px 0 30px' }}>Tu carrito</h1>

      {loading && items.length === 0 ? (
        <p style={{ color: '#aa2159', fontSize: 14 }}>Cargando tu carrito...</p>
      ) : items.length === 0 ? (
        <div style={{ padding: '60px 0', textAlign: 'center', borderTop: '1px solid #f0dde5' }}>
          <p style={{ fontSize: 15, color: '#5a4450', fontWeight: 300, marginBottom: 26 }}>Tu carrito está vacío.</p>
          <button style={primaryButton()} onClick={() => onNavigate('joyeria')}>VER JOYERÍA</button>
        </div>
      ) : (
        <div className="cart-layout">
          <div>
            {items.map((it) => (
              <div key={it.variantId} className="cart-row">
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); onNavigate(`product/${it.slug}`); }}
                  style={{ width: 96, aspectRatio: '3/4', overflow: 'hidden', flexShrink: 0, background: '#f6eef2' }}
                >
                  {it.image && <img src={it.image} alt={it.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />}
                </a>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); onNavigate(`product/${it.slug}`); }}
                    style={{ fontSize: 13, letterSpacing: '0.1em', color: '#23161c' }}
                  >
                    {it.name}
                  </a>
                  {it.label && <div style={{ fontSize: 12, color: '#8a7280', marginTop: 4 }}>{it.label}</div>}
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: 18, color: '#aa2159', marginTop: 6 }}>{formatPrice(it.unitPrice)}</div>
                  {!it.available && <div style={{ fontSize: 12, color: '#aa2159', marginTop: 4 }}>Ya no está disponible</div>}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e0c9d3' }}>
                      <button aria-label="Quitar uno" onClick={() => setQty(it.variantId, it.qty - 1)} style={qtyBtn}>−</button>
                      <span style={{ minWidth: 28, textAlign: 'center', fontSize: 13 }}>{it.qty}</span>
                      <button
                        aria-label="Agregar uno"
                        onClick={() => setQty(it.variantId, it.qty + 1)}
                        disabled={it.stock != null && it.qty >= it.stock}
                        style={qtyBtn}
                      >
                        +
                      </button>
                    </div>
                    <button onClick={() => removeItem(it.variantId)} style={{ background: 'none', border: 'none', fontSize: 11, letterSpacing: '0.12em', color: '#8a5f73', cursor: 'pointer', textDecoration: 'underline' }}>
                      ELIMINAR
                    </button>
                  </div>
                </div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: 19, whiteSpace: 'nowrap' }}>{formatPrice(it.unitPrice * it.qty)}</div>
              </div>
            ))}
          </div>

          <aside className="cart-summary">
            <div style={{ fontSize: 11, letterSpacing: '0.2em', marginBottom: 18 }}>RESUMEN</div>
            <Row label="Subtotal" value={formatPrice(subtotal)} />
            <Row label="Envío" value="Se calcula según tu departamento" muted />
            <div style={{ borderTop: '1px solid #ead7e0', margin: '16px 0' }} />
            <p style={{ fontSize: 12.5, color: '#5a4450', lineHeight: 1.6, fontWeight: 300, margin: '0 0 20px' }}>
              Pagas con <strong>Yape</strong> o <strong>Plin</strong> al confirmar tu pedido.
            </p>
            <button onClick={goCheckout} style={{ ...primaryButton(), width: '100%' }}>
              {user ? 'CONTINUAR COMPRA' : 'INICIA SESIÓN PARA COMPRAR'}
            </button>
            <button onClick={() => onNavigate('joyeria')} style={{ ...secondaryButton, width: '100%', marginTop: 10 }}>
              SEGUIR COMPRANDO
            </button>
          </aside>
        </div>
      )}
    </main>
  );
}

const qtyBtn = { width: 34, height: 34, background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#23161c' };

function Row({ label, value, muted }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 13.5, marginBottom: 10 }}>
      <span style={{ color: '#5a4450' }}>{label}</span>
      <span style={{ color: muted ? '#8a7280' : '#23161c', fontSize: muted ? 12 : 13.5, textAlign: 'right' }}>{value}</span>
    </div>
  );
}
