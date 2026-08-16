import { FILTROS } from '../../data/products';

export default function FilterBar({ active, onChange }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 10,
        flexWrap: 'wrap',
        borderTop: '1px solid #f0dde5',
        borderBottom: '1px solid #f0dde5',
        padding: '18px 0',
        marginBottom: 40,
      }}
    >
      {FILTROS.map((label) => {
        const isActive = label === active;
        return (
          <button
            key={label}
            onClick={() => onChange(label)}
            style={{
              fontSize: 11,
              letterSpacing: '0.16em',
              padding: '9px 18px',
              border: `1px solid ${isActive ? '#aa2159' : '#e6cdd8'}`,
              color: isActive ? '#fff' : '#23161c',
              background: isActive ? '#aa2159' : 'transparent',
              cursor: 'pointer',
              transition: 'all 200ms ease',
              fontFamily: 'var(--font-sans)',
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
