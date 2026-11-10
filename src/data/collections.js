export const COLLECTIONS = [
  {
    id: 'amanecer',
    label: 'Amanecer',
    desc: 'Aretes Aurora, Aretes Brisa y Collar Luz Suave. Colores personalizables.',
    image: '/images/collections/amanecer.webp',
    megaImage: '/images/collections/amanecer.webp',
    megaLabel: 'AMANECER',
    page: 'coleccion/Amanecer',
  },
  {
    id: 'plenitud',
    label: 'Plenitud',
    desc: 'Aretes Vital, Pulsera Sol de Verano y Collar Fulgor.',
    image: '/images/collections/plenitud.webp',
    megaImage: '/images/collections/plenitud.webp',
    megaLabel: 'PLENITUD',
    page: 'coleccion/Plenitud',
  },
  {
    id: 'ocaso',
    label: 'Ocaso',
    desc: 'Aretes Eterna, Gargantilla Misterio y Pulsera Origen.',
    image: '/images/collections/ocaso.webp',
    megaImage: '/images/collections/ocaso.webp',
    megaLabel: 'OCASO',
    page: 'coleccion/Ocaso',
  },
  {
    id: 'novias',
    label: 'Bride',
    desc: 'Tocados, peinetas, diademas y detalles para el cabello.',
    image: '/images/collections/novias.webp',
    megaImage: null,
    megaLabel: '',
    page: 'novios',
  },
];

// Mega menu nav items
export const MEGA_JOYERIA_A = ['ARETES', 'COLLARES', 'CHOKERS', 'PULSERAS', 'SETS', 'VER TODO'];
export const MEGA_JOYERIA_B = ['DIADEMAS', 'NIÑOS Y BEBÉS', 'HOMBRE', 'JOYEROS', 'REGALOS', 'SALE'];

export const MEGA_COLECCIONES_A = ['AMANECER', 'PLENITUD', 'OCASO', 'BRIDE', 'VER TODO'];
export const MEGA_COLECCIONES_B = ['CALENDARIO SORPRESA', 'SETS PARA PAREJAS', 'REGALOS', 'SALE'];

// Footer columns
export const FOOTER_COLS = [
  {
    title: 'TIENDA',
    links: [
      { label: 'Joyería',      page: 'joyeria' },
      { label: 'Colecciones',  page: 'colecciones' },
      { label: 'Bride',        page: 'novios' },
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
