import { INSTAGRAM } from '../../data/products';
import ImageSlot from '../ui/ImageSlot';
import SocialIcons from '../ui/SocialIcons';
import { SOCIAL } from '../../config/store';

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
          margin: '14px 0 12px',
        }}
      >
        <a href={SOCIAL.instagram.url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
          {SOCIAL.instagram.handle}
        </a>
      </h2>
      <div style={{ marginBottom: 36, fontSize: 11, letterSpacing: '0.2em' }}>
        <SocialIcons variant="text" color="#5a4450" gap={26} />
      </div>

      <div className="insta-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 14 }}>
        {INSTAGRAM.map((ig) => (
          <a
            key={ig.id}
            href={SOCIAL.instagram.url}
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
