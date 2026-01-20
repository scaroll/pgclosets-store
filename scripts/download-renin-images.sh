#!/bin/bash
# Download Renin product images for PG Closets

mkdir -p public/images/renin/{barn-doors,closet-doors,hardware,mirrors}

echo "=== Downloading Renin Product Images ==="

# Barn Door Images
echo ""
echo "📦 Barn Doors..."

curl -sL "https://www.renin.com/wp-content/uploads/2020/12/Herringbone-Satin-Nickel-Grey-Stain-Slab_1-scaled.jpg" -o "public/images/renin/barn-doors/herringbone-hero.jpg"
curl -sL "https://www.renin.com/wp-content/uploads/2020/11/Herringbone-Barn-Door-Satin-Nickel-Grey-Stain-Beauty_3-scaled.jpg" -o "public/images/renin/barn-doors/herringbone-lifestyle.jpg"

curl -sL "https://www.renin.com/wp-content/uploads/2021/06/BD045-Gatsby-Gray-MM-BD-Beauty-Image-Brick_v4-Square-scaled.jpg" -o "public/images/renin/barn-doors/gatsby-hero.jpg"
curl -sL "https://www.renin.com/wp-content/uploads/2020/10/Gatsby-Barn-Door-MB1-Lifestyle-600x374.jpg" -o "public/images/renin/barn-doors/gatsby-lifestyle.jpg"
curl -sL "https://www.renin.com/wp-content/uploads/2020/10/Gatsby-BD-Slab-GR-w_MB1-Hardware_Strap-Close_HiR-600x600.jpg" -o "public/images/renin/barn-doors/gatsby-detail.jpg"
curl -sL "https://www.renin.com/wp-content/uploads/2021/06/BD045-Gatsby-Mix-and-Match-Door-Gray-Slab-600x1219.jpg" -o "public/images/renin/barn-doors/gatsby-slab.jpg"

curl -sL "https://www.renin.com/wp-content/uploads/2021/05/PV3340_Provincial-Beauty-Image-Open_cropped-scaled.jpg" -o "public/images/renin/barn-doors/provincial-hero.jpg"

curl -sL "https://www.renin.com/wp-content/uploads/2020/11/Renin_36_in_BD_Kit_Dimensions_v5-600x779.jpg" -o "public/images/renin/barn-doors/dimensions.jpg"

echo "  ✓ Barn doors complete"

# Closet Door Images
echo ""
echo "📦 Closet Doors..."

curl -sL "https://www.renin.com/wp-content/uploads/2020/11/EU3010_Euro_1-Lite-Bifold_Off-White_Lifestyle-1.jpg" -o "public/images/renin/closet-doors/euro-1-lite-hero.jpg"
curl -sL "https://www.renin.com/wp-content/uploads/2020/11/EU3010_Euro_1-Lite-Bifold_Off-White_Lifestyle-1-600x674.jpg" -o "public/images/renin/closet-doors/euro-1-lite-lifestyle.jpg"

echo "  ✓ Closet doors complete"

# Summary
echo ""
echo "=== Download Complete ==="
ls -la public/images/renin/barn-doors/
ls -la public/images/renin/closet-doors/
