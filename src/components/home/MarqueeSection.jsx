export default function MarqueeSection() {
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

    </section>
  );
}
