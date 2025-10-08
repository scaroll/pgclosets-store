#!/usr/bin/env npx tsx

import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data/simple-products.json');
const products = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

// Fix image field - extract URL if it's an object
let fixedCount = 0;
const fixed = products.map((p: any) => {
  if (typeof p.image === 'object' && p.image !== null) {
    fixedCount++;
    return {
      ...p,
      image: p.image.url || p.image.src || ''
    };
  }
  return p;
});

// Backup original
const backupPath = filePath.replace('.json', `.backup-${new Date().toISOString()}.json`);
fs.copyFileSync(filePath, backupPath);

fs.writeFileSync(filePath, JSON.stringify(fixed, null, 2));
console.log(`✅ Fixed ${fixedCount} products with object images`);
console.log(`📋 Backup created: ${path.basename(backupPath)}`);
