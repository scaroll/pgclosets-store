const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'local.db');
console.log('Creating database at:', dbPath);

const db = new Database(dbPath);

// Enable WAL mode
db.pragma('journal_mode = WAL');

// Create categories table
db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  )
`);

// Create products table
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    price REAL NOT NULL,
    category TEXT,
    images TEXT DEFAULT '[]',
    featured INTEGER NOT NULL DEFAULT 0,
    in_stock INTEGER NOT NULL DEFAULT 1,
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    FOREIGN KEY (category) REFERENCES categories(slug)
  )
`);

// Seed categories
const categories = [
  { name: 'Wardrobes', slug: 'wardrobes', description: 'Complete wardrobe systems' },
  { name: 'Closet Organizers', slug: 'closet-organizers', description: 'Storage organizers' },
  { name: 'Hardware', slug: 'hardware', description: 'Cabinet hardware and accessories' },
];

const insertCategory = db.prepare('INSERT OR IGNORE INTO categories (name, slug, description) VALUES (?, ?, ?)');
categories.forEach(cat => insertCategory.run(cat.name, cat.slug, cat.description));

// Seed products
const products = [
  {
    name: 'Classic Wardrobe',
    slug: 'classic-wardrobe',
    description: 'Timeless design with modern functionality',
    price: 2499,
    category: 'wardrobes',
    featured: 1,
    inStock: 1,
    images: JSON.stringify([]),
  },
  {
    name: 'Modern Reach-In',
    slug: 'modern-reach-in',
    description: 'Sleek and efficient closet organizer',
    price: 1899,
    category: 'closet-organizers',
    featured: 1,
    inStock: 1,
    images: JSON.stringify([]),
  },
  {
    name: 'Walk-In Closet System',
    slug: 'walk-in-closet-system',
    description: 'Luxurious walk-in organization',
    price: 3499,
    category: 'closet-organizers',
    featured: 1,
    inStock: 1,
    images: JSON.stringify([]),
  },
  {
    name: 'Corner Unit',
    slug: 'corner-unit',
    description: 'Maximize corner space',
    price: 1299,
    category: 'closet-organizers',
    featured: 0,
    inStock: 1,
    images: JSON.stringify([]),
  },
  {
    name: 'Double Hanging Rod',
    slug: 'double-hanging-rod',
    description: 'Double the hanging space',
    price: 899,
    category: 'hardware',
    featured: 0,
    inStock: 1,
    images: JSON.stringify([]),
  },
  {
    name: 'Shelving Module',
    slug: 'shelving-module',
    description: 'Adjustable shelving system',
    price: 699,
    category: 'hardware',
    featured: 0,
    inStock: 1,
    images: JSON.stringify([]),
  },
];

const insertProduct = db.prepare(`
  INSERT OR IGNORE INTO products (name, slug, description, price, category, images, featured, in_stock)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

products.forEach(p => {
  insertProduct.run(p.name, p.slug, p.description, p.price, p.category, p.images, p.featured, p.inStock);
});

// Verify
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('Tables created:', tables.map(t => t.name).join(', '));

const catCount = db.prepare('SELECT COUNT(*) as count FROM categories').get();
const prodCount = db.prepare('SELECT COUNT(*) as count FROM products').get();
console.log(`Categories: ${catCount.count}, Products: ${prodCount.count}`);

db.close();
console.log('Database setup complete!');
