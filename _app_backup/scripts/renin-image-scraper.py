#!/usr/bin/env python3
"""
Renin.com Image Scraper
Extracts product images from Renin's barn door catalog for e-commerce use.
"""

import os
import re
import requests
import time
import json
from urllib.parse import urljoin, urlparse
from bs4 import BeautifulSoup
from pathlib import Path
import concurrent.futures
from threading import Lock

class ReninImageScraper:
    def __init__(self, output_dir="renin_images", max_workers=5, delay=1.0):
        self.base_url = "https://www.renin.com"
        self.output_dir = Path(output_dir)
        self.max_workers = max_workers
        self.delay = delay  # Respectful delay between requests
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        self.download_lock = Lock()
        self.downloaded_count = 0
        
        # Create output directories
        self.output_dir.mkdir(exist_ok=True)
        (self.output_dir / "barn_doors").mkdir(exist_ok=True)
        (self.output_dir / "hardware").mkdir(exist_ok=True)
        (self.output_dir / "metadata").mkdir(exist_ok=True)
    
    def get_product_urls(self):
        """Get all product URLs from Renin's barn door catalog."""
        print("🔍 Discovering product URLs...")
        product_urls = []
        
        # Main barn doors category page
        catalog_url = f"{self.base_url}/us/barn-doors/"
        
        try:
            response = self.session.get(catalog_url)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Find product links
            product_links = soup.find_all('a', href=re.compile(r'/barn-doors/[^/]+/$'))
            
            for link in product_links:
                href = link.get('href')
                if href:
                    full_url = urljoin(self.base_url, href)
                    if full_url not in product_urls:
                        product_urls.append(full_url)
            
            print(f"📋 Found {len(product_urls)} product URLs")
            return product_urls
            
        except Exception as e:
            print(f"❌ Error getting product URLs: {e}")
            return []
    
    def extract_product_data(self, product_url):
        """Extract product data and images from a product page."""
        try:
            time.sleep(self.delay)  # Respectful delay
            
            response = self.session.get(product_url)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Extract product name and code
            title = soup.find('h1', class_='product_title')
            product_name = title.get_text(strip=True) if title else "Unknown Product"
            
            # Clean product name for filename
            clean_name = re.sub(r'[^\w\s-]', '', product_name)
            clean_name = re.sub(r'[-\s]+', '-', clean_name).strip('-')
            
            # Extract product images
            images = []
            
            # Look for main product images
            img_tags = soup.find_all('img', src=re.compile(r'wp-content/uploads.*\.(jpg|jpeg|png|webp)', re.I))
            
            for img in img_tags:
                src = img.get('src')
                if src and 'wp-content/uploads' in src:
                    # Get full resolution image URL
                    img_url = urljoin(self.base_url, src)
                    
                    # Remove size suffixes to get original image
                    img_url = re.sub(r'-\d+x\d+(\.(jpg|jpeg|png|webp))$', r'\1', img_url, flags=re.I)
                    
                    images.append({
                        'url': img_url,
                        'alt': img.get('alt', ''),
                        'filename': self.get_image_filename(img_url, clean_name)
                    })
            
            # Remove duplicates
            unique_images = []
            seen_urls = set()
            for img in images:
                if img['url'] not in seen_urls:
                    unique_images.append(img)
                    seen_urls.add(img['url'])
            
            return {
                'name': product_name,
                'clean_name': clean_name,
                'url': product_url,
                'images': unique_images
            }
            
        except Exception as e:
            print(f"❌ Error extracting data from {product_url}: {e}")
            return None
    
    def get_image_filename(self, img_url, product_name):
        """Generate a clean filename for the image."""
        parsed = urlparse(img_url)
        original_filename = os.path.basename(parsed.path)
        
        # Extract file extension
        name, ext = os.path.splitext(original_filename)
        
        # Create descriptive filename
        if 'lifestyle' in name.lower():
            suffix = 'lifestyle'
        elif 'slab' in name.lower():
            suffix = 'product'
        elif 'detail' in name.lower():
            suffix = 'detail'
        else:
            suffix = 'image'
        
        return f"{product_name}_{suffix}{ext}"
    
    def download_image(self, image_data, category="barn_doors"):
        """Download a single image."""
        try:
            img_url = image_data['url']
            filename = image_data['filename']
            
            # Determine output path
            output_path = self.output_dir / category / filename
            
            # Skip if already exists
            if output_path.exists():
                return True
            
            # Download image
            response = self.session.get(img_url, stream=True)
            response.raise_for_status()
            
            # Save image
            with open(output_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            
            with self.download_lock:
                self.downloaded_count += 1
                print(f"✅ Downloaded: {filename} ({self.downloaded_count})")
            
            return True
            
        except Exception as e:
            print(f"❌ Error downloading {image_data.get('url', 'unknown')}: {e}")
            return False
    
    def save_metadata(self, products_data):
        """Save product metadata to JSON file."""
        metadata_file = self.output_dir / "metadata" / "products.json"
        
        try:
            with open(metadata_file, 'w') as f:
                json.dump(products_data, f, indent=2)
            print(f"💾 Saved metadata to {metadata_file}")
        except Exception as e:
            print(f"❌ Error saving metadata: {e}")
    
    def scrape_all(self):
        """Main scraping function."""
        print("🚀 Starting Renin image scraper...")
        
        # Get all product URLs
        product_urls = self.get_product_urls()
        if not product_urls:
            print("❌ No product URLs found. Exiting.")
            return
        
        # Extract product data
        print("\n📊 Extracting product data...")
        products_data = []
        all_images = []
        
        for i, url in enumerate(product_urls, 1):
            print(f"Processing {i}/{len(product_urls)}: {url}")
            product_data = self.extract_product_data(url)
            
            if product_data:
                products_data.append(product_data)
                all_images.extend(product_data['images'])
        
        print(f"\n📷 Found {len(all_images)} images to download")
        
        # Download images with thread pool
        print("\n⬇️ Downloading images...")
        with concurrent.futures.ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            futures = [executor.submit(self.download_image, img) for img in all_images]
            concurrent.futures.wait(futures)
        
        # Save metadata
        self.save_metadata(products_data)
        
        print(f"\n🎉 Scraping complete! Downloaded {self.downloaded_count} images")
        print(f"📁 Images saved to: {self.output_dir}")

def main():
    """Main function with command line interface."""
    import argparse
    
    parser = argparse.ArgumentParser(description='Scrape product images from Renin.com')
    parser.add_argument('--output', '-o', default='renin_images', 
                       help='Output directory for images (default: renin_images)')
    parser.add_argument('--workers', '-w', type=int, default=5,
                       help='Number of download threads (default: 5)')
    parser.add_argument('--delay', '-d', type=float, default=1.0,
                       help='Delay between requests in seconds (default: 1.0)')
    
    args = parser.parse_args()
    
    # Create scraper and run
    scraper = ReninImageScraper(
        output_dir=args.output,
        max_workers=args.workers,
        delay=args.delay
    )
    
    scraper.scrape_all()

if __name__ == "__main__":
    main()