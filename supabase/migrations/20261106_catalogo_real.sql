-- ==============================================
-- Catálogo real de Mandrágora
-- Agrega campos para precio tachado (SALE), colección y fotos por variante,
-- y las categorías del catálogo.
-- ==============================================

ALTER TABLE products ADD COLUMN IF NOT EXISTS compare_at_price DECIMAL(10, 2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS collection VARCHAR(100);

ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS label VARCHAR(100);

ALTER TABLE product_images ADD COLUMN IF NOT EXISTS variant_id UUID
    REFERENCES product_variants(id) ON DELETE SET NULL;

ALTER TABLE categories ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

INSERT INTO categories (name, slug) VALUES
    ('Chokers', 'chokers'),
    ('Diademas', 'diademas'),
    ('Niños y bebés', 'ninos-y-bebes'),
    ('Hombre', 'hombre'),
    ('Joyeros', 'joyeros'),
    ('Regalos', 'regalos')
ON CONFLICT (slug) DO NOTHING;

UPDATE categories SET display_order = CASE slug
    WHEN 'aretes' THEN 1 WHEN 'collares' THEN 2 WHEN 'chokers' THEN 3
    WHEN 'pulseras' THEN 4 WHEN 'sets' THEN 5 WHEN 'diademas' THEN 6
    WHEN 'ninos-y-bebes' THEN 7 WHEN 'hombre' THEN 8 WHEN 'joyeros' THEN 9
    WHEN 'regalos' THEN 10 WHEN 'anillos' THEN 11 WHEN 'charms' THEN 12
    ELSE 99 END;
