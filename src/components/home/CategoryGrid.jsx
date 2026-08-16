import { useState } from 'react';
import { CATEGORIES } from '../../data/products';
import ImageSlot from '../ui/ImageSlot';

export default function CategoryGrid({ onNavigate }) {
  return (
    <section
      className="reveal"
      style={{
        maxWidth: 1440,
        margin: '0 auto',
        padding: '76px 40px 20px',
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 26 }}>
        {CATEGORIES.map((cat) => (
          <CategoryItem key={cat.id} cat={cat} onNavigate={onNavigate} />
        ))}
      </div>
    </section>
  );
}

function CategoryItem({ cat, onNavigate }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href="#"
      onClick={(e) => { e.preventDefault(); onNavigate('joyeria'); }}
      style={{ display: 'block', color: '#23161c', textAlign: 'center' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          aspectRatio: '1',
          borderRadius: '999px',
          overflow: 'hidden',
          transform: hovered ? 'scale(1.07) rotate(2deg)' : 'none',
          boxShadow: hovered ? '0 16px 34px rgba(170,33,89,0.22)' : 'none',
          transition: 'transform 400ms ease, box-shadow 400ms ease',
        }}
      >
        <ImageSlot src={cat.image} alt={cat.label} label={cat.label} />
      </div>
      <div style={{ fontSize: 11, letterSpacing: '0.2em', marginTop: 14 }}>
        {cat.label}
      </div>
    </a>
  );
}
