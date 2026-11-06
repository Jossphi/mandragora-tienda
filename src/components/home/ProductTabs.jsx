import { useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { TABS, TAB_FILTERS } from '../../data/products';
import ProductCard from '../shop/ProductCard';

export default function ProductTabs({ onNavigate, onAddToCart }) {
  const [tab, setTab] = useState(0);
  const { products: allProducts, loading } = useProducts();
  
  // Apply local filtering for tabs. "Nuevo in" mixes categories so the
  // first row isn't only earrings (products come sorted by name).
  const filtered = allProducts.filter(TAB_FILTERS[tab]);
  const products = tab === 0 ? interleaveByCategory(filtered) : filtered;

  return (
    <section style={{ maxWidth: 1440, margin: '0 auto', padding: '70px clamp(16px, 3vw, 40px) 0' }}>
      {/* Tab buttons */}
      <div style={{ display: 'flex', gap: 'clamp(16px, 4vw, 30px)', justifyContent: 'center', flexWrap: 'wrap', marginBottom: 44 }}>
        {TABS.map((label, i) => (
          <button
            key={label}
            onClick={() => setTab(i)}
            style={{
              fontSize: 12,
              letterSpacing: 'clamp(0.12em, 1vw, 0.24em)',
              whiteSpace: 'nowrap',
              paddingBottom: 8,
              color: i === tab ? '#aa2159' : '#23161c',
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
      {loading ? (
        <p style={{ textAlign: 'center', color: '#aa2159', fontSize: 14 }}>Cargando catálogo...</p>
      ) : (
        <div className="grid-cols-4">
          {products.slice(0, 8).map((p) => (
            <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} onNavigate={onNavigate} />
          ))}
        </div>
      )}

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

function interleaveByCategory(list) {
  const groups = new Map();
  list.forEach((p) => {
    if (!groups.has(p.cat)) groups.set(p.cat, []);
    groups.get(p.cat).push(p);
  });
  const queues = [...groups.values()];
  const out = [];
  while (queues.some((q) => q.length)) {
    queues.forEach((q) => { if (q.length) out.push(q.shift()); });
  }
  return out;
}
