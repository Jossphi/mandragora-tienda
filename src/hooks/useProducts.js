import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const PRODUCT_SELECT = `
  *,
  categories(name, slug),
  product_variants(id, sku, label, color, price_modifier, stock),
  product_images(id, image_url, is_primary, display_order, variant_id)
`;

export function formatPrice(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return '';
  return Number.isInteger(n) ? `S/ ${n}` : `S/ ${n.toFixed(2)}`;
}

// Transforms a Supabase product row into the shape the UI uses.
export function formatProduct(p) {
  const images = [...(p.product_images || [])].sort(
    (a, b) => (b.is_primary - a.is_primary) || (a.display_order - b.display_order)
  );
  const variants = (p.product_variants || []).map((v) => {
    const img = images.find((i) => i.variant_id === v.id);
    return {
      id: v.id,
      sku: v.sku,
      label: v.label || v.color || 'Estándar',
      color: v.color,
      priceModifier: Number(v.price_modifier) || 0,
      stock: v.stock ?? 0,
      image: img ? img.image_url : null,
    };
  });
  const basePrice = Number(p.base_price);
  const compareAt = p.compare_at_price != null ? Number(p.compare_at_price) : null;
  const onSale = compareAt != null && compareAt > basePrice;

  return {
    id: p.slug,
    name: p.name,
    price: formatPrice(basePrice),
    priceNum: basePrice,
    compareAtPrice: onSale ? formatPrice(compareAt) : null,
    compareAtNum: onSale ? compareAt : null,
    discountPct: onSale ? Math.round((1 - basePrice / compareAt) * 100) : null,
    cat: p.categories ? p.categories.name.toUpperCase() : '',
    tag: onSale ? 'SALE' : '',
    image: images[0] ? images[0].image_url : '',
    images: images.map((i) => i.image_url),
    description: p.description,
    collection: p.collection,
    variants,
    stock: variants.reduce((sum, v) => sum + v.stock, 0),
    isNovios: p.is_novios,
  };
}

export function useProducts({ isNovios = false, category = null, isSale = false, collection = null } = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(null);
      try {
        let query = supabase
          .from('products')
          .select(PRODUCT_SELECT)
          .eq('is_active', true)
          .eq('is_novios', isNovios)
          .order('name');

        if (isSale) {
          query = query.not('compare_at_price', 'is', null);
        }

        if (collection) {
          query = query.eq('collection', collection);
        }

        const { data, error } = await query;
        if (error) throw error;

        let result = data.map(formatProduct);

        if (category && category !== 'TODO') {
          result = result.filter((p) => p.cat === category);
        }

        setProducts(result);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [isNovios, category, isSale, collection]);

  return { products, loading, error };
}

export function useProduct(slug) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      if (!slug) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select(PRODUCT_SELECT)
          .eq('slug', slug)
          .eq('is_active', true)
          .maybeSingle();

        if (error) throw error;
        setProduct(data ? formatProduct(data) : null);
      } catch (err) {
        console.error('Error fetching product details:', err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [slug]);

  return { product, loading };
}
