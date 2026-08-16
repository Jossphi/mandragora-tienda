export default function BrandStatement({ onNavigate }) {
  return (
    <section
      className="reveal"
      style={{
        margin: 0,
        background: '#ecc0d1',
        padding: '74px 40px',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '10.5px', letterSpacing: '0.4em', color: '#7d0f3f' }}>
        HECHO A MANO EN LIMA
      </div>
      <h2
        style={{
          fontFamily: 'var(--font-serif)',
          fontWeight: 400,
          fontSize: 52,
          margin: '16px 0 12px',
          letterSpacing: '0.02em',
        }}
      >
        Piezas que se quedan contigo
      </h2>
      <p
        style={{
          maxWidth: 560,
          margin: '0 auto 30px',
          fontSize: 14,
          lineHeight: 1.7,
          color: '#5a3444',
          fontWeight: 300,
        }}
      >
        Baño de oro 18k sobre bronce, perlas de río y cristales seleccionados pieza por pieza.
      </p>
      <button
        onClick={() => onNavigate('colecciones')}
        style={{
          display: 'inline-block',
          border: '1px solid #23161c',
          color: '#23161c',
          padding: '14px 40px',
          fontSize: 11,
          letterSpacing: '0.24em',
          background: 'transparent',
          cursor: 'pointer',
          fontFamily: 'var(--font-sans)',
          transition: 'background 300ms, color 300ms, transform 300ms',
        }}
        onMouseOver={e => { e.currentTarget.style.background = '#23161c'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
        onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#23161c'; e.currentTarget.style.transform = 'none'; }}
      >
        VER COLECCIONES
      </button>
    </section>
  );
}
