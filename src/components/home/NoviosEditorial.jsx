import ImageSlot from '../ui/ImageSlot';

export default function NoviosEditorial({ onNavigate }) {
  return (
    <section style={{ background: '#0c0c0c', color: '#fff', padding: '96px 40px' }}>
      <div
        className="reveal"
        style={{
          maxWidth: 1440,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.05fr 1fr',
          gap: 70,
          alignItems: 'center',
        }}
      >
        {/* Image */}
        <div style={{ aspectRatio: '4/3' }}>
          <ImageSlot
            src="/images/editorial/novios-editorial.webp"
            alt="Editorial novia"
            label="editorial novia · b/n"
            dark
          />
        </div>

        {/* Text */}
        <div>
          <div style={{ fontSize: '10.5px', letterSpacing: '0.4em', color: '#cfcfcf' }}>
            MANDRÁGORA NOVIOS
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontWeight: 300,
              fontSize: 68,
              lineHeight: 1.02,
              margin: '20px 0 22px',
              letterSpacing: '0.02em',
            }}
          >
            El día en blanco y negro
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
            Una línea nupcial sin color: perla, cristal y metal. Tiaras, peinetas, aretes de velo
            y piezas para las damas de honor.
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
            ENTRAR A NOVIOS
          </button>
        </div>
      </div>
    </section>
  );
}
