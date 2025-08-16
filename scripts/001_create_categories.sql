-- Create categories table for organizing products
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES categories(id),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert main categories for Renin-style products
INSERT INTO categories (name, slug, description, sort_order) VALUES
('Barn Doors', 'barn-doors', 'Premium sliding barn doors for interior spaces', 1),
('Closet Systems', 'closet-systems', 'Complete closet organization solutions', 2),
('Hardware', 'hardware', 'Door hardware, tracks, and accessories', 3),
('Accessories', 'accessories', 'Additional closet and door accessories', 4);

-- Insert subcategories
INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
('Single Doors', 'single-doors', 'Single panel barn doors', (SELECT id FROM categories WHERE slug = 'barn-doors'), 1),
('Double Doors', 'double-doors', 'Double panel barn door sets', (SELECT id FROM categories WHERE slug = 'barn-doors'), 2),
('Bypass Doors', 'bypass-doors', 'Space-saving bypass barn doors', (SELECT id FROM categories WHERE slug = 'barn-doors'), 3),
('Walk-in Closets', 'walk-in-closets', 'Complete walk-in closet systems', (SELECT id FROM categories WHERE slug = 'closet-systems'), 1),
('Reach-in Closets', 'reach-in-closets', 'Efficient reach-in closet solutions', (SELECT id FROM categories WHERE slug = 'closet-systems'), 2),
('Pantry Systems', 'pantry-systems', 'Kitchen and pantry organization', (SELECT id FROM categories WHERE slug = 'closet-systems'), 3);
