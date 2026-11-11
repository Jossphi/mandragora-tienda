// Shared inline styles for forms and buttons in account/cart/checkout pages.
export const labelStyle = {
  display: 'block',
  fontSize: 11,
  letterSpacing: '0.12em',
  marginBottom: 6,
  color: '#4a3742',
};

export const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  border: '1px solid #e0c9d3',
  background: '#fff',
  fontSize: 14,
  fontFamily: 'var(--font-sans)',
  color: '#23161c',
  outline: 'none',
  boxSizing: 'border-box',
};

export const primaryButton = (disabled = false) => ({
  background: '#23161c',
  color: '#fff',
  padding: '16px 28px',
  border: 'none',
  cursor: disabled ? 'not-allowed' : 'pointer',
  letterSpacing: '0.2em',
  fontSize: 11.5,
  fontFamily: 'var(--font-sans)',
  opacity: disabled ? 0.6 : 1,
  transition: 'background 200ms',
});

export const secondaryButton = {
  background: 'transparent',
  color: '#23161c',
  padding: '14px 24px',
  border: '1px solid #23161c',
  cursor: 'pointer',
  letterSpacing: '0.18em',
  fontSize: 11,
  fontFamily: 'var(--font-sans)',
};

export const alertStyle = (type) => ({
  padding: '12px 14px',
  fontSize: 13,
  lineHeight: 1.5,
  background: type === 'error' ? '#fde8ee' : type === 'info' ? '#f6eef2' : '#e8f7ef',
  color: type === 'error' ? '#aa2159' : type === 'info' ? '#5a4450' : '#137a4b',
  border: `1px solid ${type === 'error' ? '#f3c2d3' : type === 'info' ? '#ead7e0' : '#bfe8d2'}`,
});

export const pageTitle = {
  fontFamily: 'var(--font-serif)',
  fontWeight: 400,
  fontSize: 'clamp(38px, 6vw, 56px)',
  margin: '0 0 8px',
};
