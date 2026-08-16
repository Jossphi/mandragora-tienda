// Product catalog
const makeProduct = (id, name, price, cat, tag, image) => ({
  id,
  name,
  price: `S/ ${price}`,
  priceNum: price,
  cat,
  tag,
  image: image || `/images/products/${id}.webp`,
});

export const PRODUCTS = [
  makeProduct('arete-luna-perla',    'ARETE LUNA PERLA',    89,  'ARETES',   'NUEVO'),
  makeProduct('collar-mandragora',   'COLLAR MANDRÁGORA',   149, 'COLLARES', 'NUEVO'),
  makeProduct('pulsera-venus',       'PULSERA VENUS',        79, 'PULSERAS', ''),
  makeProduct('anillo-solsticio',    'ANILLO SOLSTICIO',     99, 'ANILLOS',  'NUEVO'),
  makeProduct('arete-flor-de-sal',   'ARETE FLOR DE SAL',   69, 'ARETES',   ''),
  makeProduct('set-camelia',         'SET CAMELIA',         189, 'SETS',     'BEST'),
  makeProduct('collar-zircon',       'COLLAR ZIRCÓN',       139, 'COLLARES', ''),
  makeProduct('pulsera-charms',      'PULSERA CHARMS',       95, 'PULSERAS', 'BEST'),
  makeProduct('arete-gota',          'ARETE GOTA',           49, 'ARETES',   'SALE'),
  makeProduct('collar-perla-doble',  'COLLAR PERLA DOBLE',  79, 'COLLARES', 'SALE'),
  makeProduct('anillo-trenza',       'ANILLO TRENZA',        55, 'ANILLOS',  'SALE'),
  makeProduct('set-noche',           'SET NOCHE',           129, 'SETS',     'SALE'),
];

// Novios line
export const NOVIOS = [
  { id: 'tiara-aurora',    name: 'TIARA AURORA',    price: 'S/ 289', image: '/images/novios/tiara-aurora.webp' },
  { id: 'arete-velo',      name: 'ARETE VELO',      price: 'S/ 129', image: '/images/novios/arete-velo.webp' },
  { id: 'collar-nupcial',  name: 'COLLAR NUPCIAL',  price: 'S/ 199', image: '/images/novios/collar-nupcial.webp' },
  { id: 'peineta-luz',     name: 'PEINETA LUZ',     price: 'S/ 149', image: '/images/novios/peineta-luz.webp' },
  { id: 'set-damas',       name: 'SET DAMAS',       price: 'S/ 169', image: '/images/novios/set-damas.webp' },
  { id: 'pulsera-eterna',  name: 'PULSERA ETERNA',  price: 'S/ 119', image: '/images/novios/pulsera-eterna.webp' },
];

// Categories for the circular grid
export const CATEGORIES = [
  { label: 'ARETES',    id: 'aretes',    image: '/images/categories/aretes.webp' },
  { label: 'COLLARES',  id: 'collares',  image: '/images/categories/collares.webp' },
  { label: 'PULSERAS',  id: 'pulseras',  image: '/images/categories/pulseras.webp' },
  { label: 'ANILLOS',   id: 'anillos',   image: '/images/categories/anillos.webp' },
  { label: 'SETS',      id: 'sets',      image: '/images/categories/sets.webp' },
  { label: 'CHARMS',    id: 'charms',    image: '/images/categories/charms.webp' },
];

// Tab labels mapped to product subsets
export const TABS = ['NUEVO IN', 'MÁS VENDIDOS', 'SALE'];
export const TAB_FILTERS = [
  (p) => p.tag === 'NUEVO',
  (p) => p.tag === 'BEST',
  (p) => p.tag === 'SALE',
];

// Shop filter labels
export const FILTROS = ['TODO', 'ARETES', 'COLLARES', 'PULSERAS', 'ANILLOS', 'SETS'];

// Instagram grid
export const INSTAGRAM = [1, 2, 3, 4, 5, 6].map((i) => ({
  id: `ig-${i}`,
  image: `/images/instagram/ig-0${i}.webp`,
  alt: `Mandrágora Instagram ${i}`,
}));

// Valores (about page)
export const VALORES = [
  {
    title: 'Hecho a mano',
    text: 'Cada pieza pasa por manos de artesanas peruanas antes de llegar a ti.',
  },
  {
    title: 'Series cortas',
    text: 'Producimos poco y bien: ediciones numeradas que no se repiten.',
  },
  {
    title: 'Garantía real',
    text: 'Un año de garantía sobre el baño y los engastes de toda la joyería.',
  },
];
