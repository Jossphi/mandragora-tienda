import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import ImageSlot from '../ui/ImageSlot';
import { COLLECTIONS, MEGA_JOYERIA_A, MEGA_JOYERIA_B, MEGA_COLECCIONES_A, MEGA_COLECCIONES_B } from '../../data/collections';

export default function Header({ cartCount, onNavigate }) {
  const [megaMenu, setMegaMenu] = useState(null); // null | 'joyeria' | 'colecciones'
  const [mobileMenu, setMobileMenu] = useState(false);
  const { user } = useAuth();

  const navLink = (page, label, color = '#23161c') => (
    <a
      href="#"
      onClick={(e) => { e.preventDefault(); onNavigate(page); setMegaMenu(null); }}
      onMouseEnter={() => setMegaMenu(page === 'joyeria' || page === 'colecciones' ? page : null)}
      style={{
        color,
        padding: '8px 0',
        borderBottom: '1px solid transparent',
        fontSize: '11.5px',
        letterSpacing: '0.16em',
        fontWeight: 500,
        transition: 'color 200ms, border-color 200ms',
        whiteSpace: 'nowrap',
      }}
      onMouseOver={e => { e.currentTarget.style.color = '#aa2159'; e.currentTarget.style.borderBottomColor = '#aa2159'; }}
      onMouseOut={e => { e.currentTarget.style.color = color; e.currentTarget.style.borderBottomColor = 'transparent'; }}
    >
      {label}
    </a>
  );

  const isColMega = megaMenu === 'colecciones';
  const colA = isColMega ? MEGA_COLECCIONES_A : MEGA_JOYERIA_A;
  const colB = isColMega ? MEGA_COLECCIONES_B : MEGA_JOYERIA_B;
  const titleA = isColMega ? 'CÁPSULAS' : 'CATEGORÍAS';
  const titleB = isColMega ? 'POR OCASIÓN' : 'COLECCIONES';
  const megaCards = COLLECTIONS.slice(0, 3);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        background: 'rgba(253,248,250,0.94)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderBottom: '1px solid #f0dde5',
      }}
      onMouseLeave={() => setMegaMenu(null)}
    >
      <div
        style={{
          maxWidth: 1440,
          margin: '0 auto',
          padding: '0 clamp(16px, 2.6vw, 40px)',
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          height: 82,
          gap: 14,
        }}
      >
        {/* Left nav (Desktop) / Hamburger (Mobile) */}
        <nav className="hide-on-mobile" style={{ display: 'flex', gap: 'clamp(12px, 1.5vw, 26px)', alignItems: 'center', flexWrap: 'wrap' }}>
          {navLink('joyeria', 'JOYERÍA')}
          {navLink('colecciones', 'COLECCIONES')}
          {navLink('novios', 'NOVIOS')}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); onNavigate('sale'); setMegaMenu(null); }}
            onMouseEnter={() => setMegaMenu(null)}
            style={{ color: '#aa2159', padding: '8px 0', borderBottom: '1px solid transparent', fontSize: '11.5px', letterSpacing: '0.16em', fontWeight: 500 }}
          >
            SALE
          </a>
        </nav>
        <div className="show-on-mobile">
          <button 
            onClick={() => setMobileMenu(!mobileMenu)}
            style={{ fontSize: 24, background: 'none', border: 'none', color: '#23161c', padding: '0 8px' }}
          >
            ☰
          </button>
        </div>

        {/* Logo (center) */}
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); onNavigate('home'); setMegaMenu(null); }}
          onMouseEnter={() => setMegaMenu(null)}
          style={{ textAlign: 'center', color: '#23161c', display: 'block' }}
        >
          <div
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(20px, 2.2vw, 30px)',
              letterSpacing: 'clamp(0.14em, 0.9vw, 0.34em)',
              fontWeight: 500,
              lineHeight: 1,
              paddingLeft: '0.2em',
              whiteSpace: 'nowrap',
            }}
          >
            MANDRÁGORA
          </div>
          <div style={{ fontSize: '8.5px', letterSpacing: '0.42em', color: '#aa2159', marginTop: 5, paddingLeft: '0.42em' }}>
            BIJOUTERIE · PERÚ
          </div>
        </a>

        {/* Right nav */}
        <div style={{ display: 'flex', gap: 'clamp(10px, 1.4vw, 22px)', justifyContent: 'flex-end', alignItems: 'center', fontSize: '11.5px', letterSpacing: '0.14em', flexWrap: 'wrap' }}>
          <a
            href="#"
            className="hide-on-mobile"
            onClick={(e) => { e.preventDefault(); onNavigate('nosotros'); setMegaMenu(null); }}
            style={{ color: '#23161c', whiteSpace: 'nowrap', transition: 'color 200ms' }}
            onMouseOver={e => e.currentTarget.style.color = '#aa2159'}
            onMouseOut={e => e.currentTarget.style.color = '#23161c'}
          >
            NOSOTROS
          </a>
          
          <a
            href="#"
            className="hide-on-mobile"
            onClick={(e) => { e.preventDefault(); onNavigate(user ? 'account' : 'login'); setMegaMenu(null); }}
            style={{ color: '#23161c', whiteSpace: 'nowrap', transition: 'color 200ms' }}
            onMouseOver={e => e.currentTarget.style.color = '#aa2159'}
            onMouseOut={e => e.currentTarget.style.color = '#23161c'}
          >
            {user ? user.user_metadata?.full_name?.split(' ')[0].toUpperCase() || 'CUENTA' : 'LOGIN'}
          </a>

          <a
            href="#"
            onClick={(e) => { e.preventDefault(); }}
            style={{ color: '#23161c', display: 'inline-flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}
          >
            CARRITO
            <span
              style={{
                background: '#aa2159',
                color: '#fff',
                minWidth: 20,
                height: 20,
                borderRadius: 999,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 10,
              }}
            >
              {cartCount}
            </span>
          </a>
        </div>
      </div>

      {/* Mega menu */}
      {megaMenu && (
        <div
          style={{
            borderTop: '1px solid #f0dde5',
            background: '#fff',
            animation: 'mgFade 0.25s ease both',
          }}
        >
          <div
            style={{
              maxWidth: 1440,
              margin: '0 auto',
              padding: '34px 40px 40px',
              display: 'grid',
              gridTemplateColumns: '220px 220px 1fr',
              gap: 40,
            }}
          >
            {/* Column A */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: 10, letterSpacing: '0.24em', color: '#aa2159', marginBottom: 4 }}>{titleA}</div>
              {colA.map((label) => (
                <a
                  key={label}
                  href="#"
                  onClick={(e) => { e.preventDefault(); onNavigate(isColMega ? 'colecciones' : 'joyeria'); setMegaMenu(null); }}
                  style={{ color: '#23161c', fontSize: 13, letterSpacing: '0.06em', transition: 'color 200ms' }}
                  onMouseOver={e => e.currentTarget.style.color = '#aa2159'}
                  onMouseOut={e => e.currentTarget.style.color = '#23161c'}
                >
                  {label}
                </a>
              ))}
            </div>

            {/* Column B */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: 10, letterSpacing: '0.24em', color: '#aa2159', marginBottom: 4 }}>{titleB}</div>
              {colB.map((label) => (
                <a
                  key={label}
                  href="#"
                  onClick={(e) => { e.preventDefault(); onNavigate('colecciones'); setMegaMenu(null); }}
                  style={{ color: '#23161c', fontSize: 13, letterSpacing: '0.06em', transition: 'color 200ms' }}
                  onMouseOver={e => e.currentTarget.style.color = '#aa2159'}
                  onMouseOut={e => e.currentTarget.style.color = '#23161c'}
                >
                  {label}
                </a>
              ))}
            </div>

            {/* Image cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
              {megaCards.map((card) => (
                <a
                  key={card.id}
                  href="#"
                  onClick={(e) => { e.preventDefault(); onNavigate('colecciones'); setMegaMenu(null); }}
                  style={{ display: 'block', color: '#23161c' }}
                >
                  <div style={{ position: 'relative', aspectRatio: '4/3' }}>
                    <ImageSlot src={card.megaImage || card.image} alt={card.megaLabel} label={card.megaLabel} />
                  </div>
                  <div style={{ fontSize: 11, letterSpacing: '0.18em', marginTop: 10, textAlign: 'center' }}>
                    {card.megaLabel}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {mobileMenu && (
        <div className="show-on-mobile" style={{
          position: 'fixed', top: 82, left: 0, right: 0, bottom: 0, background: '#fff', zIndex: 50, padding: 40, animation: 'mgFade 0.2s ease both'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontSize: 16, letterSpacing: '0.1em' }}>
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('joyeria'); setMobileMenu(false); }}>JOYERÍA</a>
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('colecciones'); setMobileMenu(false); }}>COLECCIONES</a>
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('novios'); setMobileMenu(false); }}>NOVIOS</a>
            <a href="#" style={{ color: '#aa2159' }} onClick={(e) => { e.preventDefault(); onNavigate('sale'); setMobileMenu(false); }}>SALE</a>
            <hr style={{ border: 'none', borderTop: '1px solid #eee' }} />
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('nosotros'); setMobileMenu(false); }}>NOSOTROS</a>
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate(user ? 'account' : 'login'); setMobileMenu(false); }}>{user ? 'MI CUENTA' : 'LOGIN'}</a>
          </div>
        </div>
      )}
    </header>
  );
}
