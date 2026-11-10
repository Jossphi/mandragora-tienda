import ImageSlot from '../ui/ImageSlot';

export default function NoviosEditorial({ onNavigate }) {
  return (
    <section style={{ background: '#0c0c0c', color: '#fff', padding: 'clamp(56px, 8vw, 96px) clamp(16px, 4vw, 40px)' }}>
      <div
        className="reveal split-editorial"
        style={{ maxWidth: 1240, margin: '0 auto' }}
      >
        {/* Image */}
        <div style={{ aspectRatio: '4/5', maxHeight: 640, overflow: 'hidden' }}>
          <ImageSlot
            src="/images/editorial/novios-editorial.webp"
            alt="Mandrágora Bride"
            label="Mandrágora Bride"
            dark
          />
        </div>

        {/* Text */}
        <div>
          <div style={{ fontSize: '10.5px', letterSpacing: '0.4em', color: '#cfcfcf' }}>
            MANDRÁGORA BRIDE
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontWeight: 300,
              fontSize: 'clamp(40px, 6vw, 68px)',
              lineHeight: 1.02,
              margin: '20px 0 22px',
              letterSpacing: '0.02em',
            }}
          >
            Piezas para el día que soñaste
          </h2>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.8,
              color: '#bdbdbd',
              fontWeight: 300,
              maxWidth: 460,
            }}
          >
            Diseños creados a mano para acompañarte en uno de los días más especiales de tu historia.
          </p>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.8,
              color: '#bdbdbd',
              fontWeight: 300,
              maxWidth: 460,
              marginTop: 14,
            }}
          >
            Tocados, peinetas, diademas y detalles para el cabello, creados cuidadosamente para complementar tu
            esencia y hacer de cada instante algo tuyo.
          </p>
          <button
            onClick={() => onNavigate('novios')}
            style={{
              display: 'inline-block',
              marginTop: 34,
              background: '#fff',
              color: '#0c0c0c',
              padding: '15px 44px',
              fontSize: 11,
              letterSpacing: '0.24em',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              transition: 'background 300ms, transform 300ms',
            }}
            onMouseOver={e => { e.currentTarget.style.background = '#ecc0d1'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseOut={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.transform = 'none'; }}
          >
            DESCUBRIR BRIDE
          </button>
        </div>
      </div>
    </section>
  );
}
