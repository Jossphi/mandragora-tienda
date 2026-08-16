import { INSTAGRAM } from '../../data/products';
import ImageSlot from '../ui/ImageSlot';

export default function InstagramGrid() {
  return (
    <section
      className="reveal"
      style={{ maxWidth: 1440, margin: '0 auto', padding: '96px 40px 0', textAlign: 'center' }}
    >
      <div style={{ fontSize: '10.5px', letterSpacing: '0.4em', color: '#aa2159' }}>SÍGUENOS</div>
      <h2
        style={{
          fontFamily: 'var(--font-serif)',
          fontWeight: 400,
          fontSize: 40,
          margin: '14px 0 40px',
        }}
      >
        @mandragora.bijou
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 14 }}>
        {INSTAGRAM.map((ig) => (
          <a
            key={ig.id}
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'block', aspectRatio: '1', overflow: 'hidden' }}
          >
            <ImageSlot src={ig.image} alt={ig.alt} label={ig.alt} />
          </a>
        ))}
      </div>
    </section>
  );
}
