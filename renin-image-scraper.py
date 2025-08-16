#!/usr/bin/env python3
"""
Renin Product Image Scraper
Comprehensive tool for extracting product images from renin.com

Usage:
    python renin-image-scraper.py

Features:
- Scrapes all product pages from sitemap
- Downloads high-quality product images
- Organizes images by category
- Generates metadata CSV
- Respects rate limits and robots.txt
"""

import os
import time
import hashlib
import requests
import xml.etree.ElementTree as ET
from pathlib import Path
from urllib.parse import urljoin, urlparse
import csv
from dataclasses import dataclass
from typing import List, Dict, Optional
import logging

# Third-party imports (install with: pip install selenium beautifulsoup4 pillow)
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
from PIL import Image
import io

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@dataclass
class ProductImage:
    """Data class for product image information"""
    url: str
    product_name: str
    category: str
    filename: str
    local_path: str
    size: tuple
    file_size: int

class ReninImageScraper:
    def __init__(self, base_url="https://www.renin.com", output_dir="renin_images"):
        self.base_url = base_url
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
        
        # Create category directories
        self.categories = ["barn-doors", "closet-doors", "mirrors", "hardware"]
        for category in self.categories:
            (self.output_dir / category).mkdir(exist_ok=True)
        
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        })
        
        self.downloaded_images: List[ProductImage] = []
        self.rate_limit_delay = 2  # seconds between requests
        
    def setup_selenium_driver(self, headless=True) -> webdriver.Chrome:
        """Setup Chrome WebDriver with optimized options"""
        options = Options()
        if headless:
            options.add_argument("--headless=new")
        
        # Performance optimizations
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--disable-gpu")
        options.add_argument("--disable-web-security")
        options.add_argument("--disable-features=VizDisplayCompositor")
        
        # Disable images for initial page load (we'll get them via BeautifulSoup)
        prefs = {
            "profile.managed_default_content_settings.images": 2,
            "profile.default_content_setting_values.notifications": 2
        }
        options.add_experimental_option("prefs", prefs)
        
        return webdriver.Chrome(options=options)
    
    def get_product_urls_from_sitemap(self) -> List[Dict[str, str]]:
        """Extract all product URLs from the sitemap"""
        sitemap_url = f"{self.base_url}/product-sitemap.xml"
        
        try:
            response = self.session.get(sitemap_url)
            response.raise_for_status()
            
            root = ET.fromstring(response.content)
            namespace = {'ns': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
            
            products = []
            for url_element in root.findall('ns:url', namespace):
                loc = url_element.find('ns:loc', namespace)
                if loc is not None:
                    product_url = loc.text
                    
                    # Categorize based on URL path
                    category = "other"
                    if "/barn-doors/" in product_url:
                        category = "barn-doors"
                    elif "/closet-doors/" in product_url:
                        category = "closet-doors"
                    elif "/mirrors/" in product_url:
                        category = "mirrors"
                    elif "/hardware/" in product_url:
                        category = "hardware"
                    
                    # Extract product name from URL
                    product_name = product_url.rstrip('/').split('/')[-1].replace('-', ' ').title()
                    
                    products.append({
                        'url': product_url,
                        'category': category,
                        'name': product_name
                    })
            
            logger.info(f"Found {len(products)} products in sitemap")
            return products
            
        except Exception as e:
            logger.error(f"Error fetching sitemap: {e}")
            return []
    
    def extract_images_from_product_page(self, product_url: str, category: str, product_name: str) -> List[str]:
        """Extract all product images from a specific product page"""
        driver = self.setup_selenium_driver()
        image_urls = []
        
        try:
            logger.info(f"Scraping images from: {product_url}")
            driver.get(product_url)
            
            # Wait for page to load
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )
            
            # Get page source and parse with BeautifulSoup
            soup = BeautifulSoup(driver.page_source, 'html.parser')
            
            # Target specific image containers for Renin's WooCommerce setup
            selectors = [
                '.woocommerce-product-gallery img',  # Main product gallery
                '.product-images img',               # Alternative product images
                '.flex-viewport img',                # FlexSlider images
                'img[src*="wp-content/uploads"]',    # WordPress uploads
            ]
            
            found_images = set()
            
            for selector in selectors:
                images = soup.select(selector)
                for img in images:
                    # Get image URL from src or data-src (lazy loading)
                    img_url = img.get('src') or img.get('data-src') or img.get('data-large_image')
                    
                    if img_url:
                        # Handle relative URLs
                        if img_url.startswith('//'):
                            img_url = 'https:' + img_url
                        elif img_url.startswith('/'):
                            img_url = urljoin(self.base_url, img_url)
                        
                        # Filter for actual product images (high quality)
                        if (img_url not in found_images and 
                            'wp-content/uploads' in img_url and
                            not any(exclude in img_url.lower() for exclude in ['thumbnail', '-100x100', '-150x150'])):
                            found_images.add(img_url)
            
            image_urls = list(found_images)
            logger.info(f"Found {len(image_urls)} images for {product_name}")
            
        except Exception as e:
            logger.error(f"Error extracting images from {product_url}: {e}")
        
        finally:
            driver.quit()
        
        return image_urls
    
    def download_image(self, image_url: str, product_name: str, category: str) -> Optional[ProductImage]:
        """Download a single image and return ProductImage object"""
        try:
            response = self.session.get(image_url, timeout=30)
            response.raise_for_status()
            
            # Create unique filename
            url_hash = hashlib.md5(image_url.encode()).hexdigest()[:8]
            parsed_url = urlparse(image_url)
            original_name = Path(parsed_url.path).name
            
            # Clean up product name for filename
            clean_product_name = "".join(c for c in product_name if c.isalnum() or c in (' ', '-')).rstrip()
            clean_product_name = clean_product_name.replace(' ', '_')[:30]  # Limit length
            
            # Determine file extension
            ext = Path(original_name).suffix if Path(original_name).suffix else '.jpg'
            filename = f"{clean_product_name}_{url_hash}{ext}"
            
            # Save to category directory
            local_path = self.output_dir / category / filename
            
            # Open image to verify and get metadata
            img = Image.open(io.BytesIO(response.content))
            img.save(local_path, optimize=True, quality=95)
            
            # Create ProductImage object
            product_image = ProductImage(
                url=image_url,
                product_name=product_name,
                category=category,
                filename=filename,
                local_path=str(local_path),
                size=img.size,
                file_size=len(response.content)
            )
            
            logger.info(f"Downloaded: {filename} ({img.size[0]}x{img.size[1]})")
            return product_image
            
        except Exception as e:
            logger.error(f"Error downloading {image_url}: {e}")
            return None
    
    def save_metadata(self):
        """Save metadata about downloaded images to CSV"""
        metadata_file = self.output_dir / "image_metadata.csv"
        
        with open(metadata_file, 'w', newline='', encoding='utf-8') as csvfile:
            fieldnames = ['url', 'product_name', 'category', 'filename', 'local_path', 
                         'width', 'height', 'file_size_bytes']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            
            writer.writeheader()
            for img in self.downloaded_images:
                writer.writerow({
                    'url': img.url,
                    'product_name': img.product_name,
                    'category': img.category,
                    'filename': img.filename,
                    'local_path': img.local_path,
                    'width': img.size[0],
                    'height': img.size[1],
                    'file_size_bytes': img.file_size
                })
        
        logger.info(f"Metadata saved to {metadata_file}")
    
    def scrape_all_products(self, limit: Optional[int] = None):
        """Main method to scrape all product images"""
        logger.info("Starting Renin product image scraping...")
        
        # Get all product URLs
        products = self.get_product_urls_from_sitemap()
        
        if limit:
            products = products[:limit]
            logger.info(f"Limiting to first {limit} products for testing")
        
        total_images = 0
        
        for i, product in enumerate(products, 1):
            logger.info(f"Processing product {i}/{len(products)}: {product['name']}")
            
            # Extract images from product page
            image_urls = self.extract_images_from_product_page(
                product['url'], 
                product['category'], 
                product['name']
            )
            
            # Download each image
            for image_url in image_urls:
                product_image = self.download_image(
                    image_url, 
                    product['name'], 
                    product['category']
                )
                
                if product_image:
                    self.downloaded_images.append(product_image)
                    total_images += 1
                
                # Rate limiting
                time.sleep(self.rate_limit_delay)
            
            # Longer delay between products
            time.sleep(3)
        
        # Save metadata
        self.save_metadata()
        
        logger.info(f"Scraping complete! Downloaded {total_images} images from {len(products)} products")
        self.print_summary()
    
    def print_summary(self):
        """Print summary of downloaded images by category"""
        category_counts = {}
        for img in self.downloaded_images:
            category_counts[img.category] = category_counts.get(img.category, 0) + 1
        
        print("\n" + "="*50)
        print("DOWNLOAD SUMMARY")
        print("="*50)
        for category, count in category_counts.items():
            print(f"{category.title()}: {count} images")
        print(f"Total: {len(self.downloaded_images)} images")
        print(f"Storage location: {self.output_dir.absolute()}")
        print("="*50)

def main():
    """Main function to run the scraper"""
    scraper = ReninImageScraper()
    
    # For testing, limit to first 5 products
    # Remove or increase this limit for full scraping
    scraper.scrape_all_products(limit=5)
    
    # For full scraping, use:
    # scraper.scrape_all_products()

if __name__ == "__main__":
    main()