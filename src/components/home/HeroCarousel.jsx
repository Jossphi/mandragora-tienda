import { useState, useEffect } from 'react';
import { HEROS } from '../../data/heros';

export default function HeroCarousel({ onNavigate, autoplay = true }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!autoplay || paused) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % HEROS.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [autoplay, paused]);

  // Preload the next slide's photos so transitions don't flash.
  useEffect(() => {
    const nextHero = HEROS[(current + 1) % HEROS.length];
    nextHero.images.forEach((src) => { const img = new Image(); img.src = src; });
  }, [current]);

  const hero = HEROS[current];
  const prev = () => setCurrent((c) => (c + HEROS.length - 1) % HEROS.length);
  const next = () => setCurrent((c) => (c + 1) % HEROS.length);
  const textColor = hero.dark ? '#fff' : '#23161c';
  const subColor = hero.dark ? 'rgba(255,255,255,0.78)' : '#5a3444';

  return (
    <section
      className="hero-split"
      style={{ background: hero.panel, transition: 'background 600ms ease' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carrusel"
    >
      {/* Text panel */}
      <div className="hero-split__text" key={`t-${current}`}>
        <div className="hero-split__kicker" style={{ fontSize: '10.5px', letterSpacing: '0.38em', color: hero.accent, marginBottom: 20, animation: 'mgFade 0.7s ease both' }}>
          {hero.kicker}
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 400,
            fontSize: 'clamp(40px, 5.2vw, 76px)',
            lineHeight: 0.98,
            margin: '0 0 22px',
            color: textColor,
            animation: 'mgFade 0.8s ease both',
          }}
        >
          {hero.title}
        </h1>
        <p style={{ maxWidth: 420, margin: '0 0 34px', fontSize: 15, lineHeight: 1.75, color: subColor, fontWeight: 300, animation: 'mgFade 0.9s ease both' }}>
          {hero.text}
        </p>
        <button
          onClick={() => onNavigate && onNavigate(hero.cta.page)}
          className="hero-split__cta"
          style={{
            background: hero.dark ? '#fff' : '#23161c',
            color: hero.dark ? '#0c0c0c' : '#fff',
          }}
        >
          {hero.cta.label}
        </button>

        {/* Controls */}
        <div className="hero-split__controls">
          <button onClick={prev} aria-label="Anterior" style={{ color: textColor }}>‹</button>
          <span style={{ fontSize: 11, letterSpacing: '0.2em', color: subColor }}>
            {String(current + 1).padStart(2, '0')} / {String(HEROS.length).padStart(2, '0')}
          </span>
          <button onClick={next} aria-label="Siguiente" style={{ color: textColor }}>›</button>
          <div style={{ display: 'flex', gap: 8, marginLeft: 12 }}>
            {HEROS.map((h, i) => (
              <button
                key={h.id}
                onClick={() => setCurrent(i)}
                aria-label={`Ir a ${h.title}`}
                className={`hero-split__dot${i === current ? ' is-active' : ''}`}
                style={{
                  width: i === current ? 34 : 14,
                  height: 2,
                  padding: 0,
                  border: 'none',
                  cursor: 'pointer',
                  background: i === current ? hero.accent : (hero.dark ? 'rgba(255,255,255,0.3)' : 'rgba(35,22,28,0.25)'),
                  transition: 'all 400ms ease',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Photos */}
      <div className="hero-split__media">
        {hero.images.map((src, i) => (
          <div key={`${current}-${src}`} className={`hero-split__photo hero-split__photo--${i}`}>
            <img
              src={src}
              alt={`${hero.title} · Mandrágora`}
              loading={current === 0 ? 'eager' : 'lazy'}
              style={{ animation: `mgHeroIn 900ms ${i * 120}ms ease both` }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
