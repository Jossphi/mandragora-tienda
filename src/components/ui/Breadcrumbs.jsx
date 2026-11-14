import { pageToPath } from '../../lib/routes';

// items: [{ label, page? }]. The last item is the current page (no link).
export default function Breadcrumbs({ items, onNavigate, dark = false, style = {} }) {
  const color = dark ? '#9a9a9a' : '#8a5f73';
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.label,
      ...(it.page ? { item: origin + pageToPath(it.page) } : {}),
    })),
  };

  return (
    <nav aria-label="Migas de pan" style={{ fontSize: '10.5px', letterSpacing: '0.24em', color, lineHeight: 1.9, ...style }}>
      <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        {items.map((it, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${it.label}-${i}`} style={{ display: 'inline-flex', alignItems: 'center' }}>
              {it.page && !last ? (
                <a
                  href={pageToPath(it.page)}
                  onClick={(e) => {
                    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return; // new tab
                    e.preventDefault();
                    onNavigate(it.page);
                  }}
                  style={{ color: 'inherit', textDecoration: 'none', transition: 'color 200ms' }}
                  onMouseOver={(e) => { e.currentTarget.style.color = dark ? '#fff' : '#aa2159'; }}
                  onMouseOut={(e) => { e.currentTarget.style.color = 'inherit'; }}
                >
                  {it.label.toUpperCase()}
                </a>
              ) : (
                <span aria-current={last ? 'page' : undefined} style={{ color: last ? (dark ? '#d8d8d8' : '#4a3742') : 'inherit' }}>
                  {last ? it.label : it.label.toUpperCase()}
                </span>
              )}
              {!last && <span aria-hidden="true" style={{ margin: '0 10px', opacity: 0.6 }}>/</span>}
            </li>
          );
        })}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </nav>
  );
}
