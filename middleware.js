// Vercel Routing Middleware.
// Link-preview bots (WhatsApp, Facebook, Instagram, Telegram...) don't run
// JavaScript, so for product links we answer them with a small HTML page that
// has the product's name, price and photo in Open Graph tags. Regular visitors
// (and search engines, which render JS) continue to the normal app.

export const config = { matcher: '/producto/:path*' };

const PREVIEW_BOTS = /facebookexternalhit|facebot|whatsapp|twitterbot|telegrambot|slackbot|linkedinbot|discordbot|pinterest|skypeuripreview|vkshare|redditbot|embedly|iframely|applebot/i;

// Public values (also shipped in the browser bundle).
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://bmluhghiimvflbtuflpy.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_HoAINXVGtutp3EMVL_jNLw_tzWFAcKX';

const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const price = (n) => {
  const v = Number(n);
  return Number.isInteger(v) ? `S/ ${v}` : `S/ ${v.toFixed(2)}`;
};

export async function buildPreview(slug, pageUrl) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/products?slug=eq.${encodeURIComponent(slug)}&is_active=eq.true` +
      '&select=name,description,base_price,compare_at_price,product_images(image_url,is_primary,display_order)',
    { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
  );
  if (!res.ok) return null;
  const [p] = await res.json();
  if (!p) return null;
  const img = [...(p.product_images || [])].sort(
    (a, b) => (b.is_primary - a.is_primary) || (a.display_order - b.display_order)
  )[0];
  const title = `${p.name} · ${price(p.base_price)} · Mandrágora`;
  const desc = p.description || 'Joyería hecha a mano en Perú.';
  return `<!doctype html>
<html lang="es"><head>
<meta charset="utf-8">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta property="og:type" content="product">
<meta property="og:site_name" content="Mandrágora">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${esc(pageUrl)}">
${img ? `<meta property="og:image" content="${esc(img.image_url)}">\n<meta property="og:image:alt" content="${esc(p.name)}">` : ''}
<meta property="product:price:amount" content="${esc(Number(p.base_price).toFixed(2))}">
<meta property="product:price:currency" content="PEN">
<meta name="twitter:card" content="summary_large_image">
<link rel="canonical" href="${esc(pageUrl)}">
</head><body>
<h1>${esc(p.name)}</h1>
<p>${esc(price(p.base_price))}</p>
<p>${esc(desc)}</p>
<p><a href="${esc(pageUrl)}">Ver producto</a></p>
</body></html>`;
}

export default async function middleware(request) {
  const ua = request.headers.get('user-agent') || '';
  if (!PREVIEW_BOTS.test(ua)) return; // normal visitors: continue to the app

  try {
    const url = new URL(request.url);
    const slug = url.pathname.split('/')[2];
    if (!slug) return;
    const html = await buildPreview(slug, `${url.origin}/producto/${slug}`);
    if (!html) return;
    return new Response(html, {
      headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=600' },
    });
  } catch {
    return; // on any error, fall back to the normal page
  }
}
