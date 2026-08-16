export default function AnnouncementBar() {
  const items = [
    '✦ TIENDA OFICIAL MANDRÁGORA ✦',
    'ENVÍOS GRATIS DESDE S/ 199',
    '3 CUOTAS SIN INTERESES',
    'NUEVA COLECCIÓN NOVIOS',
  ];
  // Duplicate for seamless loop
  const all = [...items, ...items];

  return (
    <div
      style={{
        background: '#aa2159',
        color: '#fff',
        overflow: 'hidden',
        height: 38,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: 60,
          whiteSpace: 'nowrap',
          animation: 'mgMarquee 28s linear infinite',
          paddingLeft: 60,
          fontSize: '11.5px',
          letterSpacing: '0.22em',
          fontWeight: 500,
        }}
      >
        {all.map((text, i) => (
          <span key={i}>{text}</span>
        ))}
      </div>
    </div>
  );
}
