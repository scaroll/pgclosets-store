import requests
import os
from urllib.parse import urlparse
import time
from pathlib import Path

def download_media_batch(urls, output_dir="downloaded_media"):
    """
    Download media files from a list of URLs
    """
    # Create output directory
    Path(output_dir).mkdir(exist_ok=True)
    
    downloaded = []
    failed = []
    
    for i, url in enumerate(urls):
        try:
            print(f"Downloading {i+1}/{len(urls)}: {url}")
            
            # Parse URL to get filename
            parsed = urlparse(url)
            filename = os.path.basename(parsed.path)
            if not filename or '.' not in filename:
                filename = f"media_{i+1}.jpg"  # Default extension
            
            # Make request
            response = requests.get(url, stream=True, timeout=30)
            response.raise_for_status()
            
            # Save file
            filepath = os.path.join(output_dir, filename)
            with open(filepath, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            
            downloaded.append({
                'url': url,
                'filename': filename,
                'filepath': filepath,
                'size': os.path.getsize(filepath)
            })
            
            print(f"✓ Downloaded: {filename}")
            
            # Rate limiting
            time.sleep(1)
            
        except Exception as e:
            print(f"✗ Failed to download {url}: {str(e)}")
            failed.append({'url': url, 'error': str(e)})
    
    print(f"\nDownload complete!")
    print(f"Successfully downloaded: {len(downloaded)} files")
    print(f"Failed downloads: {len(failed)} files")
    
    return downloaded, failed

# Example usage:
if __name__ == "__main__":
    # Add your extracted URLs here
    urls = [
        # "https://example.com/image1.jpg",
        # "https://example.com/image2.png",
    ]
    
    if urls:
        download_media_batch(urls)
    else:
        print("Please add URLs to the 'urls' list in this script")
