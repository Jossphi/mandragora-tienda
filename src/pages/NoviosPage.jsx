import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/shop/ProductCard';

// Shown while the Bride line has no products loaded in the store yet.
const BRIDE_GALLERY = [
  '/images/hero/novias-1.webp',
  '/images/editorial/novios-editorial.webp',
  '/images/collections/novias.webp',
  '/images/hero/novias-2.webp',
];

export default function NoviosPage({ onAddToCart, onNavigate }) {
  const { products: novios, loading } = useProducts({ isNovios: true });

  return (
    <main className="page-enter" style={{ background: '#0c0c0c', color: '#fff' }}>
      {/* Hero section */}
      <section
        style={{
          padding: '110px 40px 90px',
          textAlign: 'center',
          borderBottom: '1px solid #232323',
        }}
      >
        <div style={{ fontSize: '10.5px', letterSpacing: '0.44em', color: '#a8a8a8' }}>
          MANDRÁGORA BRIDE
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 300,
            fontSize: 'clamp(44px, 7vw, 88px)',
            lineHeight: 1,
            margin: '26px 0 20px',
            letterSpacing: '0.01em',
          }}
        >
          Piezas para el día que soñaste
        </h1>
        <p style={{ maxWidth: 540, margin: '0 auto', fontSize: 15, lineHeight: 1.8, color: '#b5b5b5', fontWeight: 300 }}>
          Diseños creados a mano para acompañarte en uno de los días más especiales de tu historia. Tocados, peinetas, diademas y detalles para el cabello, creados cuidadosamente para complementar tu esencia.
        </p>
      </section>

      {/* Products 3-column */}
      <section style={{ maxWidth: 1440, margin: '0 auto', padding: '80px 40px 0' }}>
        {loading ? (
          <p style={{ textAlign: 'center', color: '#888' }}>Cargando catálogo nupcial...</p>
        ) : novios.length > 0 ? (
          <div className="grid-cols-3">
            {novios.map((n) => (
              <ProductCard key={n.id} product={n} onAddToCart={onAddToCart} onNavigate={onNavigate} dark />
            ))}
          </div>
        ) : (
          <div className="grid-cols-4">
            {BRIDE_GALLERY.map((src) => (
              <div key={src} style={{ aspectRatio: '3/4', overflow: 'hidden' }}>
                <img src={src} alt="Mandrágora Bride" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Asesoría CTA */}
      <section
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '100px 40px 110px',
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 300,
            fontSize: 46,
            margin: '0 0 18px',
          }}
        >
          Asesoría nupcial privada
        </h2>
        <p
          style={{
            fontSize: '14.5px',
            lineHeight: 1.8,
            color: '#b5b5b5',
            fontWeight: 300,
            maxWidth: 520,
            margin: '0 auto 32px',
          }}
        >
          Reserva una cita en nuestro atelier y arma el set completo: novia, damas y detalles para invitadas.
        </p>
        <button
          onClick={() => onNavigate('contacto')}
          style={{
            display: 'inline-block',
            border: '1px solid #fff',
            color: '#fff',
            padding: '15px 44px',
            fontSize: 11,
            letterSpacing: '0.24em',
            background: 'transparent',
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
            transition: 'background 200ms, color 200ms',
          }}
          onMouseOver={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#0c0c0c'; }}
          onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#fff'; }}
        >
          AGENDAR CITA
        </button>
      </section>
    </main>
  );
}
