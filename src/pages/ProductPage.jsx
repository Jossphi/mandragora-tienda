import { useState } from 'react';
import { useProduct } from '../hooks/useProducts';
import ImageSlot from '../components/ui/ImageSlot';

export default function ProductPage({ productId, onAddToCart, onNavigate }) {
  const [qty, setQty] = useState(1);
  const { product, loading } = useProduct(productId);

  if (loading) {
    return (
      <main className="page-enter" style={{ padding: '100px 40px', textAlign: 'center' }}>
        <h2 style={{ color: '#888', fontWeight: 300 }}>Cargando detalles de la joya...</h2>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="page-enter" style={{ padding: '100px 40px', textAlign: 'center' }}>
        <h2>Producto no encontrado</h2>
        <button
          onClick={() => onNavigate('joyeria')}
          style={{
            marginTop: 20,
            background: '#aa2159',
            color: '#fff',
            padding: '12px 24px',
            border: 'none',
            cursor: 'pointer',
            letterSpacing: '0.1em'
          }}
        >
          VOLVER A LA TIENDA
        </button>
      </main>
    );
  }

  const dark = product.isNovios;

  const handleMinus = () => setQty((q) => Math.max(1, q - 1));
  const handlePlus = () => setQty((q) => Math.min(product.stock, q + 1));

  return (
    <main 
      className="page-enter" 
      style={{ 
        background: dark ? '#0c0c0c' : 'transparent',
        color: dark ? '#fff' : 'var(--text)',
        minHeight: '80vh'
      }}
    >
      <div 
        style={{ 
          maxWidth: 1200, 
          margin: '0 auto', 
          padding: '60px 40px 100px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 60,
          alignItems: 'start'
        }}
      >
        {/* Left: Image */}
        <div style={{ position: 'sticky', top: 120 }}>
          <div style={{ aspectRatio: '4/5', width: '100%' }}>
             <ImageSlot src={product.image} alt={product.name} label={product.name} dark={dark} />
          </div>
        </div>

        {/* Right: Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingTop: 20 }}>
          
          {/* Breadcrumbs */}
          <div style={{ fontSize: '10.5px', letterSpacing: '0.3em', color: dark ? '#888' : '#8a5f73' }}>
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('home'); }} style={{ color: 'inherit' }}>INICIO</a> / 
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate(dark ? 'novios' : 'joyeria'); }} style={{ color: 'inherit' }}> {dark ? 'NOVIOS' : 'JOYERÍA'}</a> / 
            <span> {product.name}</span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 46, margin: 0 }}>
            {product.name}
          </h1>

          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 26, color: dark ? '#e6e6e6' : '#aa2159' }}>
            {product.price}
          </div>

          <p style={{ fontSize: 14, lineHeight: 1.8, color: dark ? '#bbb' : '#5a4450', fontWeight: 300, margin: '10px 0' }}>
            {product.description}
          </p>

          <div style={{ borderTop: `1px solid ${dark ? '#333' : '#e6cdd8'}`, margin: '10px 0' }}></div>

          {/* Quantity & Stock */}
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.15em', marginBottom: 12, color: dark ? '#ccc' : '#4a3742' }}>
              CANTIDAD
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                border: `1px solid ${dark ? '#444' : '#ccc'}`,
                padding: '10px 16px',
                gap: 20
              }}>
                <button onClick={handleMinus} style={{ color: dark ? '#fff' : '#000', fontSize: 16 }}>-</button>
                <span style={{ minWidth: 20, textAlign: 'center', fontSize: 14 }}>{qty}</span>
                <button onClick={handlePlus} style={{ color: dark ? '#fff' : '#000', fontSize: 16 }}>+</button>
              </div>
              
              <div style={{ fontSize: 12, color: product.stock <= 3 ? '#aa2159' : (dark ? '#888' : '#8a7280') }}>
                {product.stock <= 3 ? `¡Solo quedan ${product.stock} unidades!` : `${product.stock} disponibles`}
              </div>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={() => {
              for (let i = 0; i < qty; i++) {
                onAddToCart();
              }
            }}
            style={{
              background: dark ? '#fff' : '#23161c',
              color: dark ? '#0c0c0c' : '#fff',
              padding: '18px 40px',
              fontSize: 12,
              letterSpacing: '0.24em',
              marginTop: 10,
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              transition: 'background 200ms',
              width: '100%'
            }}
            onMouseOver={e => e.currentTarget.style.background = dark ? '#ecc0d1' : '#aa2159'}
            onMouseOut={e => e.currentTarget.style.background = dark ? '#fff' : '#23161c'}
          >
            AÑADIR AL CARRITO
          </button>

          {/* Accordion mockup */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 30 }}>
            <Accordion title="Detalles y Materiales" dark={dark}>
              Baño de oro 18k de 3 micras sobre bronce libre de níquel. Perlas cultivadas de río y cristales facetados de alta calidad.
            </Accordion>
            <Accordion title="Envíos y Devoluciones" dark={dark}>
              Envíos a todo el Perú en 2-4 días hábiles. Tienes 7 días para cambios si la pieza no te convence.
            </Accordion>
          </div>
        </div>
      </div>
    </main>
  );
}

function Accordion({ title, children, dark }) {
  const [open, setOpen] = useState(false);
  
  return (
    <div style={{ borderBottom: `1px solid ${dark ? '#333' : '#f0dde5'}`, paddingBottom: 16 }}>
      <button 
        onClick={() => setOpen(!open)}
        style={{ 
          width: '100%', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          color: dark ? '#ddd' : '#23161c',
          fontSize: 13,
          letterSpacing: '0.1em'
        }}
      >
        {title.toUpperCase()}
        <span>{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div style={{ marginTop: 12, fontSize: 13, lineHeight: 1.7, color: dark ? '#aaa' : '#5a4450', fontWeight: 300, animation: 'mgFade 0.3s ease' }}>
          {children}
        </div>
      )}
    </div>
  );
}
