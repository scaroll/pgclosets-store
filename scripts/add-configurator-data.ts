#!/usr/bin/env npx tsx
// @ts-nocheck - Script with potentially undefined values

/**
 * Add Configurator Data to Products
 *
 * This script adds configurator metadata to products in both
 * simple-products.json and renin-products-database.json
 */

import * as fs from 'fs';
import * as path from 'path';
import type { ProductConfiguratorData } from '../types/configurator';

// Sample configurator data generator
function generateConfiguratorData(category: string, basePrice: number): ProductConfiguratorData {
  const configs: Record<string, Partial<ProductConfiguratorData>> = {
    'Barn Doors': {
      opening_min_width: 30,
      opening_max_width: 48,
      opening_min_height: 80,
      opening_max_height: 96,
      panel_options: [1],
      price_per_panel: 0,
      lead_time_weeks: 2
    },
    'Bypass Doors': {
      opening_min_width: 48,
      opening_max_width: 96,
      opening_min_height: 80,
      opening_max_height: 96,
      panel_options: [2, 3, 4],
      price_per_panel: 8000, // $80
      lead_time_weeks: 2
    },
    'Bifold Doors': {
      opening_min_width: 24,
      opening_max_width: 72,
      opening_min_height: 80,
      opening_max_height: 96,
      panel_options: [2, 4],
      price_per_panel: 6000, // $60
      lead_time_weeks: 2
    }
  };

  const baseConfig = configs[category] || configs['Barn Doors'];

  return {
    opening_min_width: baseConfig.opening_min_width!,
    opening_max_width: baseConfig.opening_max_width!,
    opening_min_height: baseConfig.opening_min_height!,
    opening_max_height: baseConfig.opening_max_height!,
    panel_options: baseConfig.panel_options!,
    finish_options: [
      {
        id: 'bright-white',
        name: 'Bright White',
        color: '#FFFFFF',
        price_modifier: 0
      },
      {
        id: 'matte-black',
        name: 'Matte Black',
        color: '#1A1A1A',
        price_modifier: 3000 // +$30
      },
      {
        id: 'natural-oak',
        name: 'Natural Oak',
        color: '#D4A574',
        price_modifier: 5000 // +$50
      },
      {
        id: 'espresso',
        name: 'Espresso',
        color: '#3E2723',
        price_modifier: 5000 // +$50
      }
    ],
    base_price_cad: basePrice,
    installed_price_from_cad: basePrice,
    price_per_panel: baseConfig.price_per_panel!,
    lead_time_weeks: baseConfig.lead_time_weeks!,
    includes: [
      'Professional in-home measurement',
      'Custom fabrication',
      'Professional installation',
      'Hardware and tracks',
      'Post-install cleanup',
      '30-day fit check'
    ],
    addons: [
      {
        id: 'soft-close',
        name: 'Soft-Close Upgrade',
        description: 'Quiet, smooth closing mechanism',
        price_cad: 7500, // $75
        category: 'hardware'
      },
      {
        id: 'haul-away',
        name: 'Old Door Haul-Away',
        description: 'We remove and dispose of your old doors',
        price_cad: 5000, // $50
        category: 'service'
      },
      {
        id: 'rush',
        name: 'Rush Fabrication',
        description: '1-week install instead of 2-3 weeks',
        price_cad: 15000, // $150
        category: 'service'
      }
    ]
  };
}

// Main execution
console.log('\n🔧 Adding Configurator Data to Products...\n');

// 1. Update simple-products.json
const simpleProductsPath = path.join(process.cwd(), 'data/simple-products.json');
const simpleProducts = JSON.parse(fs.readFileSync(simpleProductsPath, 'utf-8'));

const updatedSimpleProducts = simpleProducts.map((product: any) => {
  const configuratorData = generateConfiguratorData(product.category, product.price);

  return {
    ...product,
    configurator_data: configuratorData
  };
});

// Backup original
const simpleBackup = simpleProductsPath.replace('.json', `.backup-${new Date().toISOString()}.json`);
fs.copyFileSync(simpleProductsPath, simpleBackup);

fs.writeFileSync(simpleProductsPath, JSON.stringify(updatedSimpleProducts, null, 2));
console.log(`✅ Updated ${updatedSimpleProducts.length} products in simple-products.json`);
console.log(`📋 Backup: ${path.basename(simpleBackup)}\n`);

// 2. Update renin-products-database.json
const reninDbPath = path.join(process.cwd(), 'lib/renin-products-database.json');
const reninDb = JSON.parse(fs.readFileSync(reninDbPath, 'utf-8'));

const updatedReninProducts = reninDb.products.map((product: any) => {
  const category = product.collection?.title || 'Barn Doors';
  const basePrice = (product.variants && product.variants[0]?.price) || product.price || 50000;
  const configuratorData = generateConfiguratorData(category, basePrice);

  return {
    ...product,
    metadata: {
      ...product.metadata,
      configurator_data: configuratorData
    }
  };
});

// Backup original
const reninBackup = reninDbPath.replace('.json', `.backup-${new Date().toISOString()}.json`);
fs.copyFileSync(reninDbPath, reninBackup);

fs.writeFileSync(reninDbPath, JSON.stringify({
  ...reninDb,
  products: updatedReninProducts
}, null, 2));

console.log(`✅ Updated ${updatedReninProducts.length} products in renin-products-database.json`);
console.log(`📋 Backup: ${path.basename(reninBackup)}\n`);

console.log('📊 Summary:');
console.log(`  Total products updated: ${updatedSimpleProducts.length + updatedReninProducts.length}`);
console.log(`  Finish options: 4 per product`);
console.log(`  Add-ons: 3 per product`);
console.log(`  Lead time: 2 weeks`);
console.log('\n✅ Configurator data added successfully!\n');
