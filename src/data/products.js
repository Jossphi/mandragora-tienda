// Product catalog
const makeProduct = (id, name, price, cat, tag, image, desc, stock) => ({
  id,
  name,
  price: `S/ ${price}`,
  priceNum: price,
  cat,
  tag,
  image: image || `/images/products/${id}.webp`,
  description: desc || 'Pieza elaborada artesanalmente en nuestro taller de Perú. Baño de oro 18k sobre bronce, resistente y diseñada para durar. Cada engaste es realizado a mano para asegurar la máxima calidad.',
  stock: stock ?? Math.floor(Math.random() * 8) + 2,
});

export const PRODUCTS = [
  makeProduct('arete-luna-perla',    'ARETE LUNA PERLA',    89,  'ARETES',   'NUEVO', '', 'Aretes asimétricos con perla de río cultivada. Un diseño que captura la luz y el movimiento, perfecto para iluminar el rostro.'),
  makeProduct('collar-mandragora',   'COLLAR MANDRÁGORA',   149, 'COLLARES', 'NUEVO', '', 'Nuestra pieza insignia. Una cadena delicada con un dije esculpido a mano que representa el renacer. Ideal para usar en capas.'),
  makeProduct('pulsera-venus',       'PULSERA VENUS',        79, 'PULSERAS', '', '', 'Eslabones clásicos atemporales. Esta pulsera es el complemento básico que nunca te quitarás. Cierre de mosquetón seguro.'),
  makeProduct('anillo-solsticio',    'ANILLO SOLSTICIO',     99, 'ANILLOS',  'NUEVO', '', 'Anillo texturizado inspirado en las mareas. Ajustable y cómodo, con un grosor perfecto para destacar sin incomodar.'),
  makeProduct('arete-flor-de-sal',   'ARETE FLOR DE SAL',   69, 'ARETES',   '', '', 'Inspirados en la brisa marina. Aretes de tamaño medio con un sutil martillado que refleja destellos de luz con cada paso.'),
  makeProduct('set-camelia',         'SET CAMELIA',         189, 'SETS',     'BEST', '', 'El set perfecto para regalar. Incluye collar ajustable y aretes a juego con engaste de mini cristales. Presentado en caja de lujo.'),
  makeProduct('collar-zircon',       'COLLAR ZIRCÓN',       139, 'COLLARES', '', '', 'Una gota de luz en tu escote. Circón corte brillante engastado en garra sobre una cadena súper fina de 45cm.'),
  makeProduct('pulsera-charms',      'PULSERA CHARMS',       95, 'PULSERAS', 'BEST', '', 'La historia de tus días contada en tu muñeca. Incluye 3 dijes fijos de la colección inicial. Sonido delicado al moverse.'),
  makeProduct('arete-gota',          'ARETE GOTA',           49, 'ARETES',   'SALE', '', 'Silueta minimalista y orgánica. Ligeros como el agua, ideales para quienes prefieren la sutileza en su día a día.'),
  makeProduct('collar-perla-doble',  'COLLAR PERLA DOBLE',  79, 'COLLARES', 'SALE', '', 'Dos perlas asimétricas en equilibrio. Un rediseño del clásico collar de perlas, modernizado para el uso diario.'),
  makeProduct('anillo-trenza',       'ANILLO TRENZA',        55, 'ANILLOS',  'SALE', '', 'Líneas entrelazadas que simbolizan la unión. Un diseño calado que deja respirar la piel, perfecto para usar en cualquier dedo.'),
  makeProduct('set-noche',           'SET NOCHE',           129, 'SETS',     'SALE', '', 'Prepárate para brillar. Un conjunto llamativo con cristales oscuros que capturan la esencia de las noches limeñas.'),
];

// Novios line
export const NOVIOS = [
  { id: 'tiara-aurora',    name: 'TIARA AURORA',    price: 'S/ 289', priceNum: 289, image: '/images/novios/tiara-aurora.webp', description: 'Tiara flexible tejida a mano con hilo de plata, cristales facetados y perlas. Se adapta a cualquier peinado nupcial.', stock: 2, isNovios: true },
  { id: 'arete-velo',      name: 'ARETE VELO',      price: 'S/ 129', priceNum: 129, image: '/images/novios/arete-velo.webp', description: 'Aretes largos diseñados para complementar vestidos con escote. Cristales en cascada que enmarcan el rostro con elegancia pura.', stock: 4, isNovios: true },
  { id: 'collar-nupcial',  name: 'COLLAR NUPCIAL',  price: 'S/ 199', priceNum: 199, image: '/images/novios/collar-nupcial.webp', description: 'Sutil pero inolvidable. Collar en Y que estiliza el cuello, con terminación en gota de cristal Swarovski transparente.', stock: 3, isNovios: true },
  { id: 'peineta-luz',     name: 'PEINETA LUZ',     price: 'S/ 149', priceNum: 149, image: '/images/novios/peineta-luz.webp', description: 'Tocado tipo peineta para recogidos bajos o velos. Diseño botánico que aporta textura y un brillo romántico al look.', stock: 5, isNovios: true },
  { id: 'set-damas',       name: 'SET DAMAS',       price: 'S/ 169', priceNum: 169, image: '/images/novios/set-damas.webp', description: 'El regalo ideal para tus damas de honor. Conjunto de collar de punto de luz y aretes discretos. Viene en empaque especial.', stock: 12, isNovios: true },
  { id: 'pulsera-eterna',  name: 'PULSERA ETERNA',  price: 'S/ 119', priceNum: 119, image: '/images/novios/pulsera-eterna.webp', description: 'Pulsera tipo tenis con engaste continuo de cristales blancos. Una pieza clásica que podrás usar mucho después del gran día.', stock: 6, isNovios: true },
];

export function getProductById(id) {
  const inProducts = PRODUCTS.find((p) => p.id === id);
  if (inProducts) return inProducts;
  return NOVIOS.find((p) => p.id === id);
}

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
