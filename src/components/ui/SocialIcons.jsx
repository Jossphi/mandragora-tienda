import { SOCIAL } from '../../config/store';

const ICONS = {
  instagram: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  tiktok: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.6 2.6 0 0 1 0-5.2c.27 0 .53.04.78.12V9.66a5.7 5.7 0 0 0-.78-.05 5.69 5.69 0 1 0 5.69 5.69V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3a4.3 4.3 0 0 1-3.25-1.48z" />
    </svg>
  ),
};

// Instagram + TikTok links. variant "text" shows names, "icons" shows icons.
export default function SocialIcons({ variant = 'icons', color = '#8a7280', gap = 18 }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap }}>
      {Object.entries(SOCIAL).map(([key, s]) => (
        <a
          key={key}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${s.label} ${s.handle}`}
          title={`${s.label} ${s.handle}`}
          style={{ color, display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'color 200ms' }}
          onMouseOver={(e) => { e.currentTarget.style.color = '#aa2159'; }}
          onMouseOut={(e) => { e.currentTarget.style.color = color; }}
        >
          {ICONS[key]}
          {variant === 'text' && <span>{s.label.toUpperCase()}</span>}
        </a>
      ))}
    </span>
  );
}
