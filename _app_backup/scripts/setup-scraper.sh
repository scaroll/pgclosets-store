#!/bin/bash

echo "🔧 Setting up Renin Image Scraper..."

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    echo "Please install Python 3 and try again."
    exit 1
fi

# Create virtual environment
echo "📦 Creating virtual environment..."
python3 -m venv renin_scraper_env

# Activate virtual environment
echo "⚡ Activating virtual environment..."
source renin_scraper_env/bin/activate

# Install requirements
echo "📚 Installing Python packages..."
pip install -r requirements.txt

echo "✅ Setup complete!"
echo ""
echo "To use the scraper:"
echo "1. Activate the virtual environment:"
echo "   source renin_scraper_env/bin/activate"
echo ""
echo "2. Run the scraper:"
echo "   python3 renin-image-scraper.py"
echo ""
echo "3. Optional parameters:"
echo "   --output DIR    Output directory (default: renin_images)"
echo "   --workers N     Number of download threads (default: 5)"
echo "   --delay SECS    Delay between requests (default: 1.0)"
echo ""
echo "Example:"
echo "   python3 renin-image-scraper.py --output ../public/renin_images --workers 3 --delay 2.0"