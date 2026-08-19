import { useState } from 'react';
import { COLLECTIONS } from '../data/collections';
import ImageSlot from '../components/ui/ImageSlot';

export default function ColeccionesPage({ onNavigate }) {
  return (
    <main className="page-enter" style={{ maxWidth: 1440, margin: '0 auto', padding: '56px 40px 0' }}>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 62, margin: '0 0 10px' }}>
        Colecciones
      </h1>
      <p style={{ fontSize: 14, color: '#5a4450', fontWeight: 300, margin: '0 0 44px', maxWidth: 560 }}>
        Cada cápsula nace de una flor, una piedra o una noche de Perú. Ediciones cortas, numeradas y hechas a mano.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 30 }}>
        {COLLECTIONS.map((col) => (
          <CollectionCard key={col.id} col={col} onNavigate={onNavigate} />
        ))}
      </div>
    </main>
  );
}

function CollectionCard({ col, onNavigate }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href="#"
      onClick={(e) => { e.preventDefault(); onNavigate('joyeria'); }}
      style={{ display: 'block', color: '#23161c' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          aspectRatio: '4/3',
          opacity: hovered ? 0.85 : 1,
          transition: 'opacity 300ms ease',
          overflow: 'hidden',
        }}
      >
        <ImageSlot src={col.image} alt={col.label} label={col.label} />
      </div>
      <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 32, margin: '18px 0 6px' }}>
        {col.label}
      </h2>
      <p style={{ fontSize: 13, color: '#5a4450', fontWeight: 300, margin: 0 }}>{col.desc}</p>
    </a>
  );
}
