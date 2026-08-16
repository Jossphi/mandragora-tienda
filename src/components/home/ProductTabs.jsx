import { useState } from 'react';
import { PRODUCTS, TABS, TAB_FILTERS } from '../../data/products';
import ProductCard from '../shop/ProductCard';

export default function ProductTabs({ onNavigate, onAddToCart }) {
  const [tab, setTab] = useState(0);
  const products = PRODUCTS.filter(TAB_FILTERS[tab]);

  return (
    <section style={{ maxWidth: 1440, margin: '0 auto', padding: '70px 40px 0' }}>
      {/* Tab buttons */}
      <div style={{ display: 'flex', gap: 30, justifyContent: 'center', marginBottom: 44 }}>
        {TABS.map((label, i) => (
          <button
            key={label}
            onClick={() => setTab(i)}
            style={{
              fontSize: 12,
              letterSpacing: '0.24em',
              paddingBottom: 8,
              color: i === tab ? '#aa2159' : '#23161c',
              borderBottom: `1px solid ${i === tab ? '#aa2159' : 'transparent'}`,
              background: 'none',
              border: 'none',
              borderBottom: `1px solid ${i === tab ? '#aa2159' : 'transparent'}`,
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              transition: 'color 200ms',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Products grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 26 }}>
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} />
        ))}
      </div>

      {/* Ver todo link */}
      <div style={{ textAlign: 'center', marginTop: 44 }}>
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); onNavigate('joyeria'); }}
          style={{
            fontSize: 11,
            letterSpacing: '0.24em',
            borderBottom: '1px solid #aa2159',
            paddingBottom: 5,
            color: '#23161c',
            transition: 'color 200ms',
          }}
          onMouseOver={e => e.currentTarget.style.color = '#aa2159'}
          onMouseOut={e => e.currentTarget.style.color = '#23161c'}
        >
          VER TODO
        </a>
      </div>
    </section>
  );
}
