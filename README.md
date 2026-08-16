# Mandrágora · Tienda Online

Bijouterie hecha a mano en Lima · Vite + React

## Cómo correr el proyecto

```bash
npm install
npm run dev
```

## Estructura de carpetas

```
src/
├── components/
│   ├── layout/          # AnnouncementBar, Header, Footer
│   ├── home/            # Secciones de la página de inicio
│   ├── shop/            # ProductCard, FilterBar
│   └── ui/              # ImageSlot (placeholder de imágenes)
├── pages/               # HomePage, JoyeriaPage, ColeccionesPage, NoviosPage, NosotrosPage, ContactoPage
├── data/                # products.js, collections.js, heros.js
├── hooks/               # useCart.js
├── App.jsx              # Router SPA + ensamblado
├── main.jsx
└── index.css            # Design tokens y animaciones globales
```

## Agregar imágenes

Coloca las imágenes en `public/images/` según la categoría:

```
public/images/
├── hero/          ← flor-de-sal.webp, noche-magenta.webp, novios.webp
├── products/      ← arete-luna-perla.webp, collar-mandragora.webp, ...
├── collections/   ← flor-de-sal.webp, noche-magenta.webp, camelia.webp, novios.webp
├── categories/    ← aretes.webp, collares.webp, pulseras.webp, anillos.webp, sets.webp, charms.webp
├── novios/        ← tiara-aurora.webp, arete-velo.webp, collar-nupcial.webp, ...
├── editorial/     ← novios-editorial.webp, taller.webp
└── instagram/     ← ig-01.webp ... ig-06.webp
```

Las rutas de imagen están definidas en `src/data/products.js` y `src/data/heros.js`.

## Paleta de colores

| Variable          | Valor     | Uso                    |
|-------------------|-----------|------------------------|
| `--accent`        | `#aa2159` | Rosa magenta principal |
| `--dark`          | `#23161c` | Casi negro             |
| `--bg`            | `#fdf8fa` | Fondo crema            |
| `--rose`          | `#ecc0d1` | Rosa claro             |
| `--near-black`    | `#0c0c0c` | Negro puro (Novios)    |

## Tipografías

- **Cormorant Garamond** — titulares, precios, logo
- **Jost** — cuerpo de texto, navegación, botones
