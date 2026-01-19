-- Insert sample products based on Renin-style offerings
INSERT INTO products (
  name, slug, description, short_description, sku, category_id, base_price, 
  dimensions, materials, finishes, features, is_active, is_featured
) VALUES
(
  'Classic Barn Door - Single Panel',
  'classic-barn-door-single',
  'Premium single panel barn door crafted from solid wood with authentic rustic styling. Perfect for adding character to any interior space while saving floor space.',
  'Solid wood single panel barn door with rustic charm',
  'BD-CLASSIC-SINGLE-001',
  (SELECT id FROM categories WHERE slug = 'single-doors'),
  299.99,
  '{"width": 36, "height": 84, "depth": 1.5, "unit": "inches"}',
  '["Solid Wood", "Pine"]',
  '["Natural", "Stained", "Weathered"]',
  '["Authentic Rustic Look", "Space Saving", "Easy Installation"]',
  true,
  true
),
(
  'Modern Flush Barn Door',
  'modern-flush-barn-door',
  'Sleek and contemporary flush barn door with clean lines. Features smooth surface perfect for modern and minimalist interiors.',
  'Contemporary flush design barn door',
  'BD-MODERN-FLUSH-001',
  (SELECT id FROM categories WHERE slug = 'single-doors'),
  349.99,
  '{"width": 32, "height": 80, "depth": 1.375, "unit": "inches"}',
  '["MDF", "Composite"]',
  '["Painted", "Laminate"]',
  '["Smooth Surface", "Modern Design", "Lightweight"]',
  true,
  true
),
(
  'Premium Walk-in Closet System',
  'premium-walkin-closet-system',
  'Complete walk-in closet organization system with adjustable shelving, hanging rods, and drawer units. Maximizes storage while maintaining elegant appearance.',
  'Complete walk-in closet organization solution',
  'CS-WALKIN-PREM-001',
  (SELECT id FROM categories WHERE slug = 'walk-in-closets'),
  1299.99,
  '{"width": 120, "height": 84, "depth": 24, "unit": "inches"}',
  '["Melamine", "Steel"]',
  '["White", "Espresso", "Natural"]',
  '["Adjustable Shelving", "Soft Close Drawers", "LED Compatible"]',
  true,
  true
),
(
  'Heavy Duty Barn Door Hardware Kit',
  'heavy-duty-hardware-kit',
  'Professional grade sliding barn door hardware kit supports doors up to 200 lbs. Includes track, rollers, guides, and all mounting hardware.',
  'Heavy duty sliding door hardware kit',
  'HW-HEAVY-DUTY-001',
  (SELECT id FROM categories WHERE slug = 'hardware'),
  159.99,
  '{"length": 96, "unit": "inches"}',
  '["Steel", "Stainless Steel"]',
  '["Black", "Brushed Nickel", "Oil Rubbed Bronze"]',
  '["200 lb Capacity", "Smooth Operation", "Complete Kit"]',
  true,
  false
);

-- Insert product variants for different sizes and finishes
INSERT INTO product_variants (product_id, name, sku, price, attributes, stock_quantity) VALUES
(
  (SELECT id FROM products WHERE slug = 'classic-barn-door-single'),
  'Classic Barn Door 36" x 84" Natural',
  'BD-CLASSIC-36-84-NAT',
  299.99,
  '{"size": "36x84", "finish": "Natural", "material": "Pine"}',
  15
),
(
  (SELECT id FROM products WHERE slug = 'classic-barn-door-single'),
  'Classic Barn Door 32" x 80" Stained',
  'BD-CLASSIC-32-80-STAIN',
  289.99,
  '{"size": "32x80", "finish": "Dark Stain", "material": "Pine"}',
  12
),
(
  (SELECT id FROM products WHERE slug = 'modern-flush-barn-door'),
  'Modern Flush Door 36" x 84" White',
  'BD-MODERN-36-84-WHT',
  349.99,
  '{"size": "36x84", "finish": "White Paint", "material": "MDF"}',
  8
);
