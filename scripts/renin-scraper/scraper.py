#!/usr/bin/env python3
"""
Renin.com Scraper - Downloads entire site for local hosting
Bypasses Cloudflare using curl-cffi browser impersonation
"""

import re
import os
import time
import hashlib
from urllib.parse import urljoin, urlparse
from pathlib import Path
from curl_cffi import requests
from bs4 import BeautifulSoup
import logging

# Configuration
BASE_URL = "https://www.renin.com"
START_PATH = "/us/"
OUTPUT_DIR = "/Users/spencercarroll/pgclosets-store/public/renin"
DELAY = 1  # Seconds between requests to be respectful

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class ReninScraper:
    def __init__(self):
        self.session = requests.Session(impersonate="chrome120")
        self.visited_urls = set()
        self.asset_urls = set()
        self.to_visit = [urljoin(BASE_URL, START_PATH)]
        self.output_dir = Path(OUTPUT_DIR)
        self.output_dir.mkdir(parents=True, exist_ok=True)

        # Create subdirectories
        (self.output_dir / "assets").mkdir(exist_ok=True)
        (self.output_dir / "assets" / "css").mkdir(exist_ok=True)
        (self.output_dir / "assets" / "js").mkdir(exist_ok=True)
        (self.output_dir / "assets" / "images").mkdir(exist_ok=True)
        (self.output_dir / "assets" / "fonts").mkdir(exist_ok=True)
        (self.output_dir / "wp-content").mkdir(exist_ok=True)

        logger.info(f"Scraper initialized. Output: {OUTPUT_DIR}")

    def get_cache_path(self, url):
        """Generate a local file path for a URL"""
        parsed = urlparse(url)
        path = parsed.path.rstrip('/')

        # Handle WordPress content
        if '/wp-content/' in path:
            parts = path.split('/wp-content/')
            if len(parts) > 1:
                return self.output_dir / 'wp-content' / parts[1].lstrip('/')

        # Handle root
        if path == '' or path == START_PATH.strip('/'):
            return self.output_dir / 'index.html'

        # Handle other pages
        if path.endswith('.html') or path.endswith('.php'):
            filename = os.path.basename(path).replace('.php', '.html')
            return self.output_dir / path.replace(filename, '').lstrip('/') / filename

        # Add .html for pages without extension
        if '.' not in os.path.basename(path):
            return self.output_dir / path.lstrip('/') / 'index.html'

        return self.output_dir / path.lstrip('/')

    def is_valid_url(self, url):
        """Check if URL should be scraped"""
        parsed = urlparse(url)
        if parsed.netloc != urlparse(BASE_URL).netloc:
            return False
        # Skip certain paths
        if any(x in url.lower() for x in ['api', 'ajax', 'wp-json', 'feed', 'comment']):
            return False
        return True

    def sanitize_filename(self, filename):
        """Make filename safe for filesystem"""
        return re.sub(r'[<>:"/\\|?*]', '_', filename)

    def download_asset(self, url):
        """Download an asset file (CSS, JS, image, font)"""
        if url in self.asset_urls:
            return None

        self.asset_urls.add(url)

        try:
            response = self.session.get(url, timeout=30)
            if response.status_code != 200:
                return None

            # Determine file path
            parsed = urlparse(url)
            path = parsed.path

            # Handle wp-content uploads
            if '/wp-content/uploads/' in path:
                relative_path = path.split('/wp-content/uploads/')[1]
                local_path = self.output_dir / 'wp-content' / 'uploads' / relative_path
            else:
                # Determine extension
                if path.endswith('.css'):
                    local_path = self.output_dir / 'assets' / 'css' / os.path.basename(path)
                elif path.endswith('.js'):
                    local_path = self.output_dir / 'assets' / 'js' / os.path.basename(path)
                elif any(ext in path for ext in ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.ico']):
                    local_path = self.output_dir / 'assets' / 'images' / os.path.basename(path)
                elif any(ext in path for ext in ['.woff', '.woff2', '.ttf', '.otf', '.eot']):
                    local_path = self.output_dir / 'assets' / 'fonts' / os.path.basename(path)
                else:
                    local_path = self.output_dir / 'assets' / sanitize_filename(os.path.basename(path))

            local_path.parent.mkdir(parents=True, exist_ok=True)

            with open(local_path, 'wb') as f:
                f.write(response.content)

            logger.info(f"Downloaded asset: {url}")
            return local_path

        except Exception as e:
            logger.error(f"Failed to download asset {url}: {e}")
            return None

    def process_page(self, url, content):
        """Process HTML page, download assets, fix links"""
        soup = BeautifulSoup(content, 'html.parser')

        # Process links in head (CSS, JS, etc)
        for link in soup.find_all('link', {'rel': re.compile('stylesheet', re.I)}):
            href = link.get('href')
            if href and not href.startswith('data:'):
                full_url = urljoin(url, href)
                if self.is_valid_url(full_url):
                    local_path = self.download_asset(full_url)
                    if local_path:
                        link['href'] = f'/assets/css/{local_path.name}'

        for script in soup.find_all('script', {'src': True}):
            src = script.get('src')
            full_url = urljoin(url, src)
            if self.is_valid_url(full_url):
                local_path = self.download_asset(full_url)
                if local_path:
                    script['src'] = f'/assets/js/{local_path.name}'

        # Process images
        for img in soup.find_all('img', {'src': True}):
            src = img.get('src')
            if src and not src.startswith('data:'):
                full_url = urljoin(url, src)
                if self.is_valid_url(full_url):
                    local_path = self.download_asset(full_url)
                    if local_path:
                        img['src'] = f'/assets/images/{local_path.name}'

        # Process srcset
        for img in soup.find_all('img', {'srcset': True}):
            srcset = img.get('srcset', '')
            new_srcset = []
            for part in srcset.split(','):
                if part.strip():
                    url_part = part.strip().split()[0]
                    full_url = urljoin(url, url_part)
                    if self.is_valid_url(full_url):
                        local_path = self.download_asset(full_url)
                        if local_path:
                            new_srcset.append(f"/assets/images/{local_path.name} {part.strip().split()[1] if len(part.strip().split()) > 1 else ''}")
            if new_srcset:
                img['srcset'] = ', '.join(new_srcset)

        return str(soup)

    def scrape_page(self, url):
        """Scrape a single page"""
        if url in self.visited_urls:
            return

        self.visited_urls.add(url)

        try:
            logger.info(f"Scraping: {url}")
            response = self.session.get(url, timeout=30)

            if response.status_code != 200:
                logger.warning(f"Got status {response.status_code} for {url}")
                return

            content_type = response.headers.get('content-type', '')
            if 'text/html' not in content_type:
                # It's an asset, download it
                self.download_asset(url)
                return

            # Process HTML
            processed_html = self.process_page(url, response.text)

            # Save HTML
            local_path = self.get_cache_path(url)
            local_path.parent.mkdir(parents=True, exist_ok=True)

            with open(local_path, 'w', encoding='utf-8') as f:
                f.write(processed_html)

            logger.info(f"Saved: {local_path}")

            # Find more links to follow
            soup = BeautifulSoup(response.text, 'html.parser')
            for link in soup.find_all('a', {'href': True}):
                href = link.get('href')
                full_url = urljoin(url, href)

                if self.is_valid_url(full_url) and full_url not in self.visited_urls:
                    # Normalize URL
                    parsed = urlparse(full_url)
                    clean_url = f"{parsed.scheme}://{parsed.netloc}{parsed.path}"
                    if clean_url not in [u.split('?')[0].split('#')[0] for u in self.visited_urls]:
                        self.to_visit.append(clean_url)

            time.sleep(DELAY)

        except Exception as e:
            logger.error(f"Error scraping {url}: {e}")

    def run(self, max_pages=50):
        """Run the scraper"""
        logger.info(f"Starting scrape of {BASE_URL}")

        pages_scraped = 0
        while self.to_visit and pages_scraped < max_pages:
            url = self.to_visit.pop(0)
            if url not in self.visited_urls:
                self.scrape_page(url)
                pages_scraped += 1

        logger.info(f"Scraping complete! Scraped {pages_scraped} pages")
        logger.info(f"Visited {len(self.visited_urls)} URLs")
        logger.info(f"Downloaded {len(self.asset_urls)} assets")


def main():
    scraper = ReninScraper()
    scraper.run(max_pages=100)


if __name__ == "__main__":
    main()
