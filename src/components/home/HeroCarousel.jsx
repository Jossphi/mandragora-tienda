import { useState, useEffect } from 'react';
import { HEROS } from '../../data/heros';
import ImageSlot from '../ui/ImageSlot';

export default function HeroCarousel({ autoplay = true }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!autoplay) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % HEROS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [autoplay]);

  const hero = HEROS[current];
  const prev = () => setCurrent((c) => (c + HEROS.length - 1) % HEROS.length);
  const next = () => setCurrent((c) => (c + 1) % HEROS.length);

  return (
    <section style={{ position: 'relative', height: 640, overflow: 'hidden', background: hero.bg }}>
      {/* Background image with Ken Burns */}
      <div style={{ position: 'absolute', inset: 0, animation: 'mgKen 16s ease-in-out infinite alternate' }}>
        <ImageSlot src={hero.image} alt={hero.title} label="banner de campaña" />
      </div>

      {/* Color overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: hero.overlay,
          mixBlendMode: 'multiply',
          pointerEvents: 'none',
        }}
      />

      {/* Gradient overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.35) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Text box */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          pointerEvents: 'none',
          paddingBottom: 64,
        }}
      >
        <div
          style={{
            textAlign: 'center',
            padding: 'clamp(32px, 5vw, 72px) clamp(24px, 5vw, 56px)',
            animation: 'mgFade 0.7s ease both',
            pointerEvents: 'auto',
            background: 'rgba(10,6,8,0.94)',
            maxWidth: '90%',
          }}
          key={current}
        >
          <div style={{ fontSize: '10.5px', letterSpacing: '0.42em', color: hero.textColor, marginBottom: 18 }}>
            {hero.kicker}
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontWeight: 500,
              fontSize: 'clamp(42px, 8vw, 72px)',
              lineHeight: 0.9,
              margin: '0 0 18px',
              letterSpacing: '-0.01em',
              color: hero.titleColor,
              textTransform: 'uppercase',
            }}
          >
            {hero.title}
          </h1>
          <p style={{ maxWidth: 440, margin: '0 auto 26px', fontSize: '13.5px', lineHeight: 1.7, color: hero.textColor, fontWeight: 300 }}>
            {hero.text}
          </p>
          <a
            href="#joyeria"
            style={{
              display: 'inline-block',
              background: '#fff',
              color: '#0c0c0c',
              padding: '14px 40px',
              fontSize: 11,
              letterSpacing: '0.24em',
              transition: 'background 300ms ease, color 300ms ease, transform 300ms ease',
            }}
            onMouseOver={e => { e.currentTarget.style.background = '#aa2159'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseOut={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#0c0c0c'; e.currentTarget.style.transform = 'none'; }}
          >
            COMPRAR AHORA
          </a>
        </div>
      </div>

      {/* Arrows */}
      <button onClick={prev} style={{ position: 'absolute', left: 26, top: '50%', fontSize: 26, color: hero.textColor, background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1, transform: 'translateY(-50%)' }}>‹</button>
      <button onClick={next} style={{ position: 'absolute', right: 26, top: '50%', fontSize: 26, color: hero.textColor, background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1, transform: 'translateY(-50%)' }}>›</button>

      {/* Dots */}
      <div style={{ position: 'absolute', bottom: 26, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 10 }}>
        {HEROS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            style={{
              width: 34,
              height: 2,
              background: i === current ? '#23161c' : 'rgba(35,22,28,0.28)',
              border: 'none',
              cursor: 'pointer',
              transition: 'background 300ms',
              padding: 0,
            }}
          />
        ))}
      </div>
    </section>
  );
}
