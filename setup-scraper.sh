#!/bin/bash
# Setup script for Renin Image Scraper

set -e

echo "🔧 Setting up Renin Image Scraper..."

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

echo "✅ Python 3 found: $(python3 --version)"

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 is not installed. Please install pip3."
    exit 1
fi

echo "✅ pip3 found: $(pip3 --version)"

# Create virtual environment
echo "📦 Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "🚀 Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "⬆️  Upgrading pip..."
pip install --upgrade pip

# Install requirements
echo "📚 Installing Python packages..."
pip install -r requirements.txt

# Check if Chrome is installed
if ! command -v google-chrome &> /dev/null && ! command -v chromium-browser &> /dev/null; then
    echo "⚠️  Chrome/Chromium not found. Please install Google Chrome."
    echo "   macOS: brew install --cask google-chrome"
    echo "   Ubuntu: sudo apt-get install google-chrome-stable"
    echo "   Or download from: https://www.google.com/chrome/"
else
    echo "✅ Chrome browser found"
fi

# Check ChromeDriver (optional - the script can work with webdriver-manager)
if command -v chromedriver &> /dev/null; then
    echo "✅ ChromeDriver found: $(chromedriver --version)"
else
    echo "ℹ️  ChromeDriver not found in PATH, but webdriver-manager will handle this automatically"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To use the scraper:"
echo "1. Activate the virtual environment: source venv/bin/activate"
echo "2. Run the scraper: python renin-image-scraper.py"
echo ""
echo "📁 Images will be saved to the 'renin_images' directory"
echo "📊 Metadata will be saved to 'renin_images/image_metadata.csv'"
echo ""
echo "⚠️  Important notes:"
echo "   - The scraper includes rate limiting to be respectful"
echo "   - Check Renin's robots.txt and terms of service"
echo "   - Consider reaching out to Renin for permission if needed"
echo "   - Start with the test mode (limited products) first"