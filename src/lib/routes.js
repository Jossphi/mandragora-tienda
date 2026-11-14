// Maps the app's internal page ids (e.g. "product/aretes-cataleya",
// "joyeria/ARETES") to real URLs (e.g. "/producto/aretes-cataleya",
// "/joyeria/aretes") and back, so every page can be shared and reloaded.
import { FILTROS } from '../data/products';
import { COLLECTIONS } from '../data/collections';

export const slugify = (s) =>
  String(s)
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const STATIC = {
  home: '/',
  joyeria: '/joyeria',
  sale: '/sale',
  colecciones: '/colecciones',
  novios: '/bride',
  nosotros: '/nosotros',
  contacto: '/contacto',
  login: '/login',
  cart: '/carrito',
  checkout: '/checkout',
  account: '/cuenta',
};
const STATIC_BY_PATH = Object.fromEntries(Object.entries(STATIC).map(([k, v]) => [v, k]));

export function pageToPath(page) {
  if (!page) return '/';
  if (STATIC[page]) return STATIC[page];
  if (page.startsWith('product/')) return `/producto/${page.slice(8)}`;
  if (page.startsWith('order/')) return `/pedido/${page.slice(6)}`;
  if (page.startsWith('joyeria/')) return `/joyeria/${slugify(page.slice(8))}`;
  if (page.startsWith('coleccion/')) return `/coleccion/${slugify(page.slice(10))}`;
  if (page.startsWith('login?next=')) return `/login?next=${encodeURIComponent(pageToPath(page.slice(11)))}`;
  return '/';
}

export function pathToPage(pathname, search = '') {
  const path = (pathname || '/').replace(/\/+$/, '') || '/';
  if (STATIC_BY_PATH[path]) {
    if (path === '/login') {
      const next = new URLSearchParams(search).get('next');
      if (next) return `login?next=${pathToPage(next)}`;
    }
    return STATIC_BY_PATH[path];
  }
  const [, first, second] = path.split('/');
  if (first === 'producto' && second) return `product/${second}`;
  if (first === 'pedido' && second) return `order/${second}`;
  if (first === 'joyeria' && second) {
    const label = FILTROS.find((f) => slugify(f) === second);
    return label ? `joyeria/${label}` : 'joyeria';
  }
  if (first === 'coleccion' && second) {
    const col = COLLECTIONS.find((c) => c.page?.startsWith('coleccion/') && slugify(c.label) === second);
    return col ? col.page : 'colecciones';
  }
  return 'home';
}

// Absolute URL of a page, for copy/share buttons.
export const pageUrl = (page) => `${window.location.origin}${pageToPath(page)}`;
