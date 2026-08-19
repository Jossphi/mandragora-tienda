import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useProducts({ isNovios = false, category = null, isSale = false } = {}) {
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
          .select(`
            *,
            categories(name),
            product_variants(stock, sku),
            product_images(image_url)
          `)
          .eq('is_active', true);

        if (isNovios) {
          query = query.eq('is_novios', true);
        } else {
          query = query.eq('is_novios', false);
        }

        const { data, error } = await query;
        if (error) throw error;

        // Transform data to match previous local format
        const formatted = data.map(p => {
          const primaryImage = p.product_images && p.product_images[0] ? p.product_images[0].image_url : '';
          const variant = p.product_variants && p.product_variants[0] ? p.product_variants[0] : { stock: 0 };
          
          return {
            id: p.slug,
            name: p.name,
            price: `S/ ${p.base_price}`,
            priceNum: p.base_price,
            cat: p.categories ? p.categories.name.toUpperCase() : '',
            tag: isSale ? 'SALE' : (Math.random() > 0.7 ? 'NUEVO' : ''), // Re-using dummy tags for now
            image: primaryImage,
            description: p.description,
            stock: variant.stock,
            isNovios: p.is_novios
          };
        });

        // Filter Sale
        let result = formatted;
        if (isSale) {
          result = result.filter(p => p.tag === 'SALE');
        }
        
        // Filter Category
        if (category && category !== 'TODO') {
          result = result.filter(p => p.cat === category);
        }

        setProducts(result);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [isNovios, category, isSale]);

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
          .select(`
            *,
            categories(name),
            product_variants(stock, sku),
            product_images(image_url)
          `)
          .eq('slug', slug)
          .single();

        if (error) throw error;

        const primaryImage = data.product_images && data.product_images[0] ? data.product_images[0].image_url : '';
        const variant = data.product_variants && data.product_variants[0] ? data.product_variants[0] : { stock: 0 };

        setProduct({
          id: data.slug,
          name: data.name,
          price: `S/ ${data.base_price}`,
          priceNum: data.base_price,
          cat: data.categories ? data.categories.name.toUpperCase() : '',
          image: primaryImage,
          description: data.description,
          stock: variant.stock,
          isNovios: data.is_novios
        });
      } catch (err) {
        console.error("Error fetching product details:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [slug]);

  return { product, loading };
}
