import { useState } from 'react';
import ImageSlot from '../ui/ImageSlot';

export default function ProductCard({ product, onAddToCart, dark = false }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        transform: hovered ? 'translateY(-8px)' : 'none',
        transition: 'transform 350ms ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image wrapper */}
      <div
        style={{
          position: 'relative',
          aspectRatio: '3/4',
          overflow: 'hidden',
          boxShadow: hovered
            ? dark
              ? '0 22px 44px rgba(255,255,255,0.08)'
              : '0 22px 44px rgba(170,33,89,0.18)'
            : 'none',
          transition: 'box-shadow 350ms ease',
        }}
      >
        <ImageSlot src={product.image} alt={product.name} label={product.name} dark={dark} />

        {/* Badge */}
        {product.tag && (
          <span
            style={{
              position: 'absolute',
              top: 12,
              left: 12,
              background: '#aa2159',
              color: '#fff',
              fontSize: '9.5px',
              letterSpacing: '0.18em',
              padding: '5px 10px',
              pointerEvents: 'none',
              fontFamily: 'var(--font-sans)',
            }}
          >
            {product.tag}
          </span>
        )}

        {/* Add to cart overlay */}
        <button
          onClick={onAddToCart}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            background: hovered ? '#aa2159' : dark ? '#fff' : '#23161c',
            color: dark && hovered ? '#0c0c0c' : '#fff',
            textAlign: 'center',
            padding: 13,
            fontSize: '10.5px',
            letterSpacing: '0.2em',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 300ms ease, background 300ms ease',
            cursor: 'pointer',
            border: 'none',
            fontFamily: 'var(--font-sans)',
          }}
        >
          AÑADIR AL CARRITO
        </button>
      </div>

      {/* Name */}
      <div style={{ fontSize: 12, letterSpacing: '0.12em', color: dark ? '#e6e6e6' : 'var(--text)' }}>
        {product.name}
      </div>

      {/* Price */}
      <div
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 19,
          color: dark ? '#e6e6e6' : '#aa2159',
        }}
      >
        {product.price}
      </div>
    </div>
  );
}
