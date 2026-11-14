// Store settings shown to customers at checkout.
// Payment methods accepted: only Yape and Plin.
export const PAYMENT_METHODS = [
  {
    id: 'yape',
    label: 'Yape',
    color: '#742284',
    phone: '937 532 073',
    holder: 'Sofia Castillo',
  },
  {
    id: 'plin',
    label: 'Plin',
    color: '#00b2a9',
    phone: '937 532 073',
    holder: 'Sofia Castillo',
  },
];

export const getPaymentMethod = (id) => PAYMENT_METHODS.find((m) => m.id === id);

// Social networks.
export const SOCIAL = {
  instagram: { label: 'Instagram', handle: '@mandragora.peru', url: 'https://www.instagram.com/mandragora.peru/' },
  tiktok: { label: 'TikTok', handle: '@mandragoraperu', url: 'https://www.tiktok.com/@mandragoraperu' },
};
