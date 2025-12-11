#!/bin/bash
# Script to backup all HTML pages before updating
# Run with: bash apply-navbar-to-all.sh

echo "🔄 Creating backups of all HTML pages..."

pages=(
  "commercial.html"
  "commercial2.html"
  "products.html"
  "living-wall.html"
  "commercial-wall.html"
  "fence-extensions.html"
  "artificial-hedge.html"
  "blog.html"
  "austin.html"
  "dallas.html"
  "houston.html"
  "san-antonio.html"
  "hedge-builder-residential.html"
  "hedge-builder-commercial.html"
)

for page in "${pages[@]}"; do
  if [ -f "$page" ]; then
    cp "$page" "${page}.backup-$(date +%Y%m%d)"
    echo "✅ Backed up: $page"
  else
    echo "⚠️  Not found: $page"
  fi
done

echo ""
echo "✨ Backup complete! Ready for navbar updates."
