import { useState } from 'react';
import { COLLECTIONS } from '../../data/collections';
import ImageSlot from '../ui/ImageSlot';

export default function CollectionsGrid({ onNavigate }) {
  return (
    <section
      className="reveal"
      style={{ maxWidth: 1440, margin: '0 auto', padding: '96px 40px 0' }}
    >
      <h2
        style={{
          fontFamily: 'var(--font-serif)',
          fontWeight: 400,
          fontSize: 44,
          textAlign: 'center',
          margin: '0 0 46px',
        }}
      >
        Eterna Mandrágora
      </h2>

      <div className="grid-cols-3">
        {COLLECTIONS.slice(0, 3).map((col) => (
          <CollectionItem key={col.id} col={col} onNavigate={onNavigate} />
        ))}
      </div>
    </section>
  );
}

function CollectionItem({ col, onNavigate }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href="#"
      onClick={(e) => { e.preventDefault(); onNavigate(col.page); }}
      style={{ display: 'block', color: '#23161c' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          aspectRatio: '4/5',
          transform: hovered ? 'translateY(-8px)' : 'none',
          boxShadow: hovered ? '0 22px 44px rgba(170,33,89,0.16)' : 'none',
          transition: 'transform 400ms ease, box-shadow 400ms ease',
          overflow: 'hidden',
        }}
      >
        <ImageSlot src={col.image} alt={col.label} label={col.label} />
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginTop: 14,
        }}
      >
        <span>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: 26, display: 'block' }}>{col.label}</span>
          <span style={{ fontSize: 12.5, color: '#5a4450', fontWeight: 300 }}>{col.desc}</span>
        </span>
        <span style={{ fontSize: '10.5px', letterSpacing: '0.2em', color: '#aa2159' }}>VER →</span>
      </div>
    </a>
  );
}
