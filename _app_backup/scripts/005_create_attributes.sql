-- Create product attributes system for flexible specifications
CREATE TABLE IF NOT EXISTS attributes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL, -- text, number, select, multiselect, boolean
  options JSONB, -- For select/multiselect types
  unit VARCHAR(50), -- For number types (inches, lbs, etc.)
  is_required BOOLEAN DEFAULT false,
  is_filterable BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert common attributes for closet/door products
INSERT INTO attributes (name, slug, type, options, unit, is_filterable, sort_order) VALUES
('Width', 'width', 'number', NULL, 'inches', true, 1),
('Height', 'height', 'number', NULL, 'inches', true, 2),
('Depth', 'depth', 'number', NULL, 'inches', false, 3),
('Material', 'material', 'select', '["Wood", "MDF", "Steel", "Glass", "Composite"]', NULL, true, 4),
('Finish', 'finish', 'select', '["Natural", "Stained", "Painted", "Laminate"]', NULL, true, 5),
('Hardware Color', 'hardware-color', 'select', '["Black", "Brushed Nickel", "Oil Rubbed Bronze", "Stainless Steel"]', NULL, true, 6),
('Installation Type', 'installation-type', 'select', '["Wall Mount", "Ceiling Mount", "Floor Mount"]', NULL, true, 7),
('Weight Capacity', 'weight-capacity', 'number', NULL, 'lbs', false, 8);

-- Create product attributes junction table
CREATE TABLE IF NOT EXISTS product_attributes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  attribute_id UUID REFERENCES attributes(id) ON DELETE CASCADE,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, attribute_id)
);

CREATE INDEX IF NOT EXISTS idx_product_attributes_product ON product_attributes(product_id);
CREATE INDEX IF NOT EXISTS idx_product_attributes_attribute ON product_attributes(attribute_id);
