#!/bin/bash
# 50-Agent Team Route Testing

echo "🔍 TEAM 1 (Agents 1-10): Testing Core Pages..."
routes=(
  "/"
  "/about"
  "/contact"
  "/products"
  "/store"
  "/cart"
  "/quote"
  "/services"
  "/faq"
  "/gallery"
)

for route in "${routes[@]}"; do
  echo -n "Agent testing $route ... "
  status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000$route 2>/dev/null)
  if [ "$status" = "200" ]; then
    echo "✅ $status"
  else
    echo "❌ $status FAILED"
  fi
done

echo ""
echo "🔍 TEAM 2 (Agents 11-20): Testing Product Pages..."
product_routes=(
  "/products/barn-doors"
  "/products/interior-doors"
  "/products/hardware"
  "/products/closet-systems"
  "/products/room-dividers"
  "/products/catalog"
  "/products/search"
  "/products/euro-1-lite-bypass"
  "/products/euro-3-lite-bypass"
  "/products/ashbury-2-panel-design-steel-frame-bypass-door"
)

for route in "${product_routes[@]}"; do
  echo -n "Agent testing $route ... "
  status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000$route 2>/dev/null)
  if [ "$status" = "200" ]; then
    echo "✅ $status"
  else
    echo "❌ $status FAILED"
  fi
done

echo ""
echo "🔍 TEAM 3 (Agents 21-30): Testing Location Pages..."
location_routes=(
  "/ottawa"
  "/kanata"
  "/orleans"
  "/barrhaven"
  "/nepean"
  "/renin"
  "/renin/ottawa"
  "/renin/kanata"
  "/installation-ottawa"
  "/renin-quotes"
)

for route in "${location_routes[@]}"; do
  echo -n "Agent testing $route ... "
  status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000$route 2>/dev/null)
  if [ "$status" = "200" ]; then
    echo "✅ $status"
  else
    echo "❌ $status FAILED"
  fi
done

echo ""
echo "🔍 TEAM 4 (Agents 31-40): Testing Utility Pages..."
utility_routes=(
  "/legal/privacy"
  "/legal/terms"
  "/privacy-policy"
  "/return-policy"
  "/shipping-policy"
  "/terms-of-service"
  "/offline"
  "/blog"
  "/account"
  "/wishlist"
)

for route in "${utility_routes[@]}"; do
  echo -n "Agent testing $route ... "
  status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000$route 2>/dev/null)
  if [ "$status" = "200" ]; then
    echo "✅ $status"
  else
    echo "❌ $status FAILED"
  fi
done

echo ""
echo "🔍 TEAM 5 (Agents 41-50): Testing API Routes..."
api_routes=(
  "/api/health"
  "/api/status"
  "/api/products"
  "/api/monitoring"
)

for route in "${api_routes[@]}"; do
  echo -n "Agent testing $route ... "
  status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000$route 2>/dev/null)
  if [ "$status" = "200" ]; then
    echo "✅ $status"
  else
    echo "❌ $status (May require auth/data)"
  fi
done
