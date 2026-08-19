import { VALORES } from '../data/products';
import ImageSlot from '../components/ui/ImageSlot';

export default function NosotrosPage() {
  return (
    <main className="page-enter" style={{ maxWidth: 1100, margin: '0 auto', padding: '76px 40px 0' }}>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 62, margin: '0 0 24px' }}>
        Sobre Mandrágora
      </h1>
      <p style={{ fontSize: 16, lineHeight: 1.9, color: '#4a3742', fontWeight: 300, maxWidth: 640 }}>
        Nacimos en un taller pequeño de Perú con una idea simple: bijouterie que no parezca bijouterie. Diseñamos series cortas, trabajamos con artesanas peruanas y cuidamos cada engaste como si fuera oro fino.
      </p>

      {/* Taller photo */}
      <div style={{ aspectRatio: '21/9', margin: '48px 0' }}>
        <ImageSlot
          src="/images/editorial/taller.webp"
          alt="El taller de Mandrágora"
          label="foto del taller"
        />
      </div>

      {/* Valores 3-col */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 34, paddingBottom: 20 }}>
        {VALORES.map((v) => (
          <div key={v.title}>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 30, color: '#aa2159' }}>
              {v.title}
            </div>
            <p style={{ fontSize: '13.5px', lineHeight: 1.75, color: '#5a4450', fontWeight: 300, margin: '10px 0 0' }}>
              {v.text}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
