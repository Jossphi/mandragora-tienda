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
