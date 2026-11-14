import { useState, useEffect } from 'react';
import { useProduct, formatPrice } from '../hooks/useProducts';
import ImageSlot from '../components/ui/ImageSlot';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { pageUrl } from '../lib/routes';

export default function ProductPage({ productId, onAddToCart, onNavigate }) {
  const [qty, setQty] = useState(1);
  const [variantIdx, setVariantIdx] = useState(0);
  const [activeImage, setActiveImage] = useState(null);
  const [copied, setCopied] = useState(false);
  const { product, loading } = useProduct(productId);

  useEffect(() => {
    setQty(1);
    setVariantIdx(0);
    setActiveImage(null);
  }, [productId]);

  // Tab title and description of this product (also used when sharing).
  useEffect(() => {
    if (!product) return;
    document.title = `${product.name} · Mandrágora`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta && product.description) meta.setAttribute('content', product.description);
  }, [product]);

  const shareLink = async () => {
    const url = pageUrl(`product/${productId}`);
    // Phones: open the native share sheet (WhatsApp, Instagram...). Desktop: copy.
    if (navigator.share && window.matchMedia('(pointer: coarse)').matches) {
      try { await navigator.share({ title: product.name, url }); return; } catch { /* cancelled */ }
    }
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.prompt('Copia este enlace:', url);
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

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
  const variants = product.variants || [];
  const hasChoice = variants.length > 1;
  const variant = variants[variantIdx] || null;
  const stock = variant ? variant.stock : product.stock;
  const modifier = variant ? variant.priceModifier : 0;
  const price = formatPrice(product.priceNum + modifier);
  const compareAt = product.compareAtNum != null ? formatPrice(product.compareAtNum + modifier) : null;
  const mainImage = activeImage || (variant && variant.image) || product.image;
  const images = product.images || [];

  const selectVariant = (i) => {
    setVariantIdx(i);
    setActiveImage(variants[i].image || null);
    setQty(1);
  };

  const handleMinus = () => setQty((q) => Math.max(1, q - 1));
  const handlePlus = () => setQty((q) => Math.min(Math.max(stock, 1), q + 1));

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
        className="product-detail-grid"
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
             <ImageSlot src={mainImage} alt={product.name} label={product.name} dark={dark} />
          </div>
          {images.length > 1 && (
            <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
              {images.map((src) => (
                <button
                  key={src}
                  onClick={() => setActiveImage(src)}
                  aria-label={`Ver foto de ${product.name}`}
                  style={{
                    width: 64,
                    height: 80,
                    padding: 0,
                    cursor: 'pointer',
                    border: `1px solid ${src === mainImage ? '#aa2159' : (dark ? '#333' : '#e6cdd8')}`,
                    background: 'none',
                    overflow: 'hidden',
                  }}
                >
                  <img src={src} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingTop: 20 }}>
          
          <Breadcrumbs
            dark={dark}
            onNavigate={onNavigate}
            items={[
              { label: 'Inicio', page: 'home' },
              dark ? { label: 'Bride', page: 'novios' } : { label: 'Joyería', page: 'joyeria' },
              ...(!dark && product.cat ? [{ label: product.cat, page: `joyeria/${product.cat}` }] : []),
              ...(product.collection ? [{ label: `Colección ${product.collection}`, page: `coleccion/${product.collection}` }] : []),
              { label: product.name },
            ]}
          />

          <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 46, margin: 0 }}>
            {product.name}
          </h1>

          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 26, color: dark ? '#e6e6e6' : '#aa2159' }}>
            {price}
            {compareAt && (
              <span style={{ marginLeft: 14, fontSize: 18, color: dark ? '#888' : '#8a7280', textDecoration: 'line-through' }}>
                {compareAt}
              </span>
            )}
            {product.discountPct && (
              <span style={{ marginLeft: 12, fontSize: 12, letterSpacing: '0.12em', fontFamily: 'var(--font-sans)', background: '#aa2159', color: '#fff', padding: '4px 8px', verticalAlign: 'middle' }}>
                -{product.discountPct}%
              </span>
            )}
          </div>

          {product.collection && (
            <div style={{ fontSize: 11, letterSpacing: '0.2em', color: dark ? '#888' : '#8a5f73' }}>
              COLECCIÓN {product.collection.toUpperCase()}
            </div>
          )}

          <p style={{ fontSize: 14, lineHeight: 1.8, color: dark ? '#bbb' : '#5a4450', fontWeight: 300, margin: '10px 0' }}>
            {product.description}
          </p>

          <div style={{ borderTop: `1px solid ${dark ? '#333' : '#e6cdd8'}`, margin: '10px 0' }}></div>

          {hasChoice && (
            <div>
              <div style={{ fontSize: 11, letterSpacing: '0.15em', marginBottom: 12, color: dark ? '#ccc' : '#4a3742' }}>
                {variants.some((v) => v.color) ? 'COLOR' : 'VERSIÓN'}: <span style={{ fontWeight: 500 }}>{variant.label.toUpperCase()}</span>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {variants.map((v, i) => {
                  const active = i === variantIdx;
                  return (
                    <button
                      key={v.id}
                      onClick={() => selectVariant(i)}
                      style={{
                        padding: '9px 16px',
                        fontSize: 11,
                        letterSpacing: '0.12em',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-sans)',
                        border: `1px solid ${active ? '#aa2159' : (dark ? '#444' : '#e6cdd8')}`,
                        background: active ? '#aa2159' : 'transparent',
                        color: active ? '#fff' : (dark ? '#fff' : '#23161c'),
                      }}
                    >
                      {v.label.toUpperCase()}
                      {v.priceModifier > 0 ? ` (+${formatPrice(v.priceModifier)})` : ''}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

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
              
              <div style={{ fontSize: 12, color: stock <= 3 ? '#aa2159' : (dark ? '#888' : '#8a7280') }}>
                {stock <= 0 ? 'Disponible a pedido' : stock <= 3 ? `¡Solo quedan ${stock} unidades!` : `${stock} disponibles`}
              </div>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={() => onAddToCart(product, variant, qty)}
            disabled={stock <= 0}
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

          <button
            onClick={shareLink}
            style={{
              alignSelf: 'flex-start',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'none',
              border: 'none',
              padding: '4px 0',
              cursor: 'pointer',
              fontSize: 11,
              letterSpacing: '0.18em',
              color: copied ? '#137a4b' : (dark ? '#ccc' : '#8a5f73'),
              fontFamily: 'var(--font-sans)',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            {copied ? '¡ENLACE COPIADO!' : 'COPIAR ENLACE DEL PRODUCTO'}
          </button>

          {/* Accordion mockup */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 30 }}>
            <Accordion title="Hecho a mano y personalización" dark={dark}>
              Los accesorios hechos a mano son personalizables previa coordinación y se entregan entre dos a tres días hábiles. También puedes solicitar tus accesorios favoritos con postes de plata por un costo adicional.
            </Accordion>
            <Accordion title="Envíos y pagos" dark={dark}>
              El costo de envío dependerá de tu ubicación. Puedes abonar mediante transferencia bancaria, Yape o Plin. No realizamos reembolsos en accesorios elaborados a pedido o personalizados.
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
