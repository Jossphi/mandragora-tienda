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
        padding: '64px clamp(16px, 3vw, 40px) 10px',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 34 }}>
        <div style={{ fontSize: '10.5px', letterSpacing: '0.4em', color: '#aa2159' }}>EXPLORA</div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(30px, 4vw, 42px)', margin: '10px 0 0' }}>
          Compra por categoría
        </h2>
      </div>
      <div className="category-row">
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
      onClick={(e) => { e.preventDefault(); onNavigate(`joyeria/${cat.label}`); }}
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
