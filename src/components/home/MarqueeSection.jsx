export default function MarqueeSection({ onNavigate }) {
  const items = [
    { type: 'title', text: 'Mandrágora' },
    { type: 'sub',   text: 'BIJOUTERIE · PERÚ' },
    { type: 'title', text: 'Joyas con alma' },
    { type: 'sub',   text: 'HECHO A MANO ✦' },
    { type: 'title', text: 'Mandrágora' },
    { type: 'sub',   text: 'BIJOUTERIE · PERÚ' },
    { type: 'title', text: 'Joyas con alma' },
    { type: 'sub',   text: 'HECHO A MANO ✦' },
  ];

  return (
    <section
      style={{
        margin: '90px 0 0',
        background: '#aa2159',
        overflow: 'hidden',
        padding: '30px 0',
        position: 'relative',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: 90,
          whiteSpace: 'nowrap',
          alignItems: 'baseline',
          animation: 'mgMarquee 24s linear infinite',
          width: 'max-content',
        }}
      >
        {items.map((item, i) =>
          item.type === 'title' ? (
            <span
              key={i}
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontWeight: 500,
                fontSize: 96,
                lineHeight: 1,
                color: '#fdf3ec',
              }}
            >
              {item.text}
            </span>
          ) : (
            <span key={i} style={{ fontSize: 13, letterSpacing: '0.44em', color: '#ecc0d1' }}>
              {item.text}
            </span>
          )
        )}
      </div>

      {/* CTA button */}
      <button
        onClick={() => onNavigate('joyeria')}
        style={{
          position: 'absolute',
          right: 40,
          top: '50%',
          transform: 'translateY(-50%)',
          background: '#0c0c0c',
          color: '#fff',
          padding: '13px 30px',
          fontSize: '10.5px',
          letterSpacing: '0.24em',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'var(--font-sans)',
          transition: 'background 300ms',
          zIndex: 1,
        }}
        onMouseOver={e => e.currentTarget.style.background = '#23161c'}
        onMouseOut={e => e.currentTarget.style.background = '#0c0c0c'}
      >
        COMPRAR AHORA
      </button>
    </section>
  );
}
