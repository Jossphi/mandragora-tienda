export const COLLECTIONS = [
  {
    id: 'flor-de-sal',
    label: 'Flor de Sal',
    desc: 'Perla de río y baño de oro 18k.',
    image: '/images/collections/flor-de-sal.webp',
    megaImage: '/images/collections/flor-de-sal-mega.webp',
    megaLabel: 'FLOR DE SAL',
  },
  {
    id: 'noche-magenta',
    label: 'Noche Magenta',
    desc: 'Cristal facetado, 60 piezas.',
    image: '/images/collections/noche-magenta.webp',
    megaImage: '/images/collections/noche-magenta-mega.webp',
    megaLabel: 'NOCHE MAGENTA',
  },
  {
    id: 'camelia',
    label: 'Camelia',
    desc: 'Sets para regalar.',
    image: '/images/collections/camelia.webp',
    megaImage: '/images/collections/novios-mega.webp',
    megaLabel: 'NOVIOS',
  },
  {
    id: 'novios',
    label: 'Novios',
    desc: 'Línea nupcial en blanco y negro.',
    image: '/images/collections/novios.webp',
    megaImage: null,
    megaLabel: '',
  },
];

// Mega menu nav items
export const MEGA_JOYERIA_A = ['ARETES', 'COLLARES', 'PULSERAS', 'ANILLOS', 'SETS', 'VER TODO'];
export const MEGA_JOYERIA_B = ['NUEVO IN', 'MÁS VENDIDOS', 'ÚLTIMAS UNIDADES', 'NOVIOS', 'SALE'];

export const MEGA_COLECCIONES_A = ['FLOR DE SAL', 'NOCHE MAGENTA', 'CAMELIA', 'PERLA DE RÍO', 'VER TODO'];
export const MEGA_COLECCIONES_B = ['FIESTA', 'OFICINA', 'NOVIOS', 'REGALO', 'GIFT CARD'];

// Footer columns
export const FOOTER_COLS = [
  {
    title: 'TIENDA',
    links: [
      { label: 'Joyería',      page: 'joyeria' },
      { label: 'Colecciones',  page: 'colecciones' },
      { label: 'Novios',       page: 'novios' },
      { label: 'Sale',         page: 'sale' },
    ],
  },
  {
    title: 'AYUDA',
    links: [
      { label: 'Envíos y entregas',      page: 'contacto' },
      { label: 'Cambios y devoluciones', page: 'contacto' },
      { label: 'Cuidado de piezas',      page: 'contacto' },
      { label: 'Preguntas frecuentes',   page: 'contacto' },
    ],
  },
  {
    title: 'MANDRÁGORA',
    links: [
      { label: 'Sobre nosotros', page: 'nosotros' },
      { label: 'Atelier',        page: 'contacto' },
      { label: 'Contacto',       page: 'contacto' },
      { label: 'Términos',       page: 'contacto' },
    ],
  },
];
