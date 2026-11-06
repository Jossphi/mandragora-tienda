export default function BrandStatement({ onNavigate }) {
  return (
    <section className="reveal" style={{ background: '#ecc0d1', padding: 'clamp(56px, 8vw, 96px) clamp(16px, 4vw, 40px)' }}>
      <div className="split-editorial" style={{ maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ position: 'relative' }}>
          <div style={{ aspectRatio: '4/5', overflow: 'hidden' }}>
            <img
              src="/images/editorial/hecho-a-mano.webp"
              alt="Aretes hechos a mano por Mandrágora"
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
          <div
            className="hide-on-mobile"
            style={{ position: 'absolute', right: -40, bottom: -40, width: '42%', aspectRatio: '4/5', overflow: 'hidden', border: '8px solid #ecc0d1' }}
          >
            <img
              src="/images/editorial/taller.webp"
              alt="Proceso en el taller"
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        </div>
        <div>
          <div style={{ fontSize: '10.5px', letterSpacing: '0.4em', color: '#7d0f3f' }}>
            HECHO A MANO EN PERÚ
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(36px, 5vw, 56px)', lineHeight: 1.05, margin: '16px 0 18px' }}>
            Piezas que se quedan contigo
          </h2>
          <p style={{ maxWidth: 480, fontSize: 15, lineHeight: 1.8, color: '#5a3444', fontWeight: 300, margin: '0 0 14px' }}>
            Perlas del río, muranos y cristales bordados uno por uno. Cada pieza se elabora a pedido y se personaliza en
            el color que elijas.
          </p>
          <p style={{ maxWidth: 480, fontSize: 15, lineHeight: 1.8, color: '#5a3444', fontWeight: 300, margin: '0 0 32px' }}>
            Entregas en 2 a 3 días hábiles, en estuche para proteger tus accesorios. ¿La quieres con postes de plata?
            También es posible.
          </p>
          <button
            onClick={() => onNavigate('joyeria')}
            style={{
              border: '1px solid #23161c',
              color: '#23161c',
              padding: '15px 42px',
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
            VER TODA LA JOYERÍA
          </button>
        </div>
      </div>
    </section>
  );
}
