/**
 * ImageSlot — shows a real <img> if src exists, 
 * otherwise shows a styled placeholder with the label.
 */
export default function ImageSlot({ src, alt, label, dark = false, style = {} }) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt || label || ''}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', ...style }}
        loading="lazy"
        onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling && (e.currentTarget.nextSibling.style.display = 'flex'); }}
      />
    );
  }

  return (
    <div className={`img-placeholder${dark ? ' dark' : ''}`} style={style}>
      <span style={{ fontSize: 22, opacity: 0.4 }}>◈</span>
      {label && <span>{label}</span>}
    </div>
  );
}
