// Store settings shown to customers at checkout.
// Payment methods accepted: only Yape and Plin.
export const PAYMENT_METHODS = [
  {
    id: 'yape',
    label: 'Yape',
    color: '#742284',
    phone: '',   // TODO: número de Yape de la tienda (ej. '987 654 321')
    holder: '',  // TODO: nombre del titular tal como aparece en Yape
  },
  {
    id: 'plin',
    label: 'Plin',
    color: '#00b2a9',
    phone: '',   // TODO: número de Plin de la tienda
    holder: '',  // TODO: nombre del titular tal como aparece en Plin
  },
];

export const getPaymentMethod = (id) => PAYMENT_METHODS.find((m) => m.id === id);
