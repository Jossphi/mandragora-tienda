import { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import FilterBar from '../components/shop/FilterBar';
import ProductCard from '../components/shop/ProductCard';

export default function JoyeriaPage({ onAddToCart, onNavigate, isSale = false }) {
  const [filtro, setFiltro] = useState('TODO');
  const { products: visible, loading } = useProducts({ isSale, category: filtro });

  const title = isSale ? 'Sale' : 'Joyería';

  return (
    <main
      className="page-enter"
      style={{ maxWidth: 1440, margin: '0 auto', padding: '56px 40px 0' }}
    >
      {/* Breadcrumb */}
      <div style={{ fontSize: '10.5px', letterSpacing: '0.3em', color: '#8a5f73' }}>
        INICIO / {title.toUpperCase()}
      </div>

      {/* Title */}
      <h1
        style={{
          fontFamily: 'var(--font-serif)',
          fontWeight: 400,
          fontSize: 62,
          margin: '14px 0 8px',
        }}
      >
        {title}
      </h1>

      <p style={{ fontSize: 14, color: '#5a4450', fontWeight: 300, margin: '0 0 34px' }}>
        {visible.length} piezas · baño de oro 18k, perla y cristal
      </p>

      <FilterBar active={filtro} onChange={setFiltro} />

      {loading ? (
        <p style={{ textAlign: 'center', marginTop: 40, color: '#aa2159', fontSize: 14 }}>Cargando catálogo...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 26 }}>
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} onNavigate={onNavigate} />
          ))}
        </div>
      )}
    </main>
  );
}
