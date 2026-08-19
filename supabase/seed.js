import { createClient } from '@supabase/supabase-js';
import { PRODUCTS, NOVIOS } from '../src/data/products.js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("Fetching categories...");
  const { data: categories, error: catError } = await supabase.from('categories').select('*');
  if (catError) {
    console.error("Error fetching categories:", catError);
    return;
  }

  // Create a map of category names (uppercase) to their IDs for easy lookup
  const catMap = {};
  categories.forEach(c => {
    catMap[c.name.toUpperCase()] = c.id;
  });

  console.log("Seeding PRODUCTS...");
  for (const p of PRODUCTS) {
    // Insert product
    const { data: product, error: pError } = await supabase
      .from('products')
      .insert({
        name: p.name,
        slug: p.id,
        description: p.description,
        base_price: p.priceNum,
        category_id: catMap[p.cat] || null,
        is_active: true,
        is_novios: false
      })
      .select()
      .single();

    if (pError) {
      console.error(`Error inserting product ${p.name}:`, pError.message);
      continue;
    }

    // Insert variant to hold stock
    const { data: variant, error: vError } = await supabase
      .from('product_variants')
      .insert({
        product_id: product.id,
        sku: `${p.id}-STD`,
        stock: p.stock
      })
      .select()
      .single();

    if (vError) {
      console.error(`Error inserting variant for ${p.name}:`, vError.message);
    }

    // Insert image
    await supabase.from('product_images').insert({
      product_id: product.id,
      image_url: p.image,
      is_primary: true
    });
    
    console.log(`✅ Seeded ${p.name}`);
  }

  console.log("\nSeeding NOVIOS...");
  for (const p of NOVIOS) {
    const { data: product, error: pError } = await supabase
      .from('products')
      .insert({
        name: p.name,
        slug: p.id,
        description: p.description,
        base_price: p.priceNum,
        is_active: true,
        is_novios: true
      })
      .select()
      .single();

    if (pError) {
      console.error(`Error inserting product ${p.name}:`, pError.message);
      continue;
    }

    // Insert variant
    await supabase.from('product_variants').insert({
      product_id: product.id,
      sku: `${p.id}-NOV`,
      stock: p.stock
    });

    // Insert image
    await supabase.from('product_images').insert({
      product_id: product.id,
      image_url: p.image,
      is_primary: true
    });

    console.log(`✅ Seeded ${p.name}`);
  }

  console.log("\nSeeding complete!");
}

seed().catch(console.error);
