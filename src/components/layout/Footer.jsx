import { FOOTER_COLS } from '../../data/collections';

export default function Footer({ onNavigate }) {
  return (
    <>
      {/* Newsletter */}
      <section
        style={{
          background: '#23161c',
          color: '#fff',
          marginTop: 96,
          padding: '74px 40px',
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 300,
            fontSize: 42,
            margin: '0 0 10px',
          }}
        >
          Únete al universo Mandrágora
        </h2>
        <p style={{ fontSize: '13.5px', color: '#c9b8c0', fontWeight: 300, margin: '0 0 30px' }}>
          10% en tu primera compra y acceso anticipado a cada colección.
        </p>
        <div style={{ display: 'flex', gap: 0, maxWidth: 460, margin: '0 auto' }}>
          <input
            type="email"
            placeholder="tu correo"
            style={{
              flex: 1,
              border: 0,
              borderBottom: '1px solid #6a5560',
              background: 'transparent',
              color: '#fff',
              padding: '14px 4px',
              fontFamily: 'var(--font-sans)',
              fontSize: '13.5px',
              outline: 'none',
            }}
          />
          <button
            style={{
              background: '#aa2159',
              color: '#fff',
              padding: '14px 30px',
              fontSize: 11,
              letterSpacing: '0.2em',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              transition: 'background 200ms',
            }}
            onMouseOver={e => { e.currentTarget.style.background = '#ecc0d1'; e.currentTarget.style.color = '#23161c'; }}
            onMouseOut={e => { e.currentTarget.style.background = '#aa2159'; e.currentTarget.style.color = '#fff'; }}
          >
            SUSCRIBIR
          </button>
        </div>
      </section>

      {/* Footer links */}
      <footer
        style={{
          background: '#fdf8fa',
          borderTop: '1px solid #f0dde5',
          padding: '66px 40px 34px',
        }}
      >
        <div
          style={{
            maxWidth: 1440,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
            gap: 46,
          }}
        >
          {/* Brand col */}
          <div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 24, letterSpacing: '0.3em' }}>
              MANDRÁGORA
            </div>
            <p style={{ fontSize: '12.5px', lineHeight: 1.9, color: '#6b5460', fontWeight: 300, margin: '14px 0 0', maxWidth: 260 }}>
              Bijouterie hecha a mano en Lima. Baño de oro 18k, perla de río y cristal.
            </p>
          </div>

          {/* Link columns */}
          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <div style={{ fontSize: 10, letterSpacing: '0.26em', color: '#aa2159', marginBottom: 16 }}>
                {col.title}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.links.map((link) => (
                  <a
                    key={link.label}
                    href="#"
                    onClick={(e) => { e.preventDefault(); onNavigate(link.page); }}
                    style={{ fontSize: '12.5px', color: '#4a3742', fontWeight: 300, transition: 'color 200ms' }}
                    onMouseOver={e => e.currentTarget.style.color = '#aa2159'}
                    onMouseOut={e => e.currentTarget.style.color = '#4a3742'}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            maxWidth: 1440,
            margin: '46px auto 0',
            paddingTop: 22,
            borderTop: '1px solid #f0dde5',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 11,
            letterSpacing: '0.14em',
            color: '#8a7280',
          }}
        >
          <span>MANDRÁGORA 2026 ©</span>
          <span style={{ display: 'flex', gap: 20 }}>
            <a href="#" style={{ color: '#8a7280' }}>INSTAGRAM</a>
            <a href="#" style={{ color: '#8a7280' }}>TIKTOK</a>
            <a href="#" style={{ color: '#8a7280' }}>WHATSAPP</a>
          </span>
        </div>
      </footer>
    </>
  );
}
