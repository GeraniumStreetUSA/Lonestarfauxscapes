#!/usr/bin/env python3
"""
Script to update all HTML pages with the standardized homepage navbar
Reads the navbar from residential.html (already updated) and applies to all pages
"""

import re
import os
from pathlib import Path

# List of pages to update
PAGES = [
    "commercial.html",
    "commercial2.html",
    "products.html",
    "living-wall.html",
    "commercial-wall.html",
    "fence-extensions.html",
    "artificial-hedge.html",
    "blog.html",
    "austin.html",
    "dallas.html",
    "houston.html",
    "san-antonio.html",
    "hedge-builder-residential.html",
    "hedge-builder-commercial.html"
]

def extract_navbar_from_template():
    """Extract navbar CSS, HTML, and JS from residential.html"""
    with open('residential.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract navbar CSS (from "/* Floating Island Header */" to end of mobile-link styles)
    css_pattern = r'(\/\* Floating Island Header \*\/.*?\.mobile-link:hover \{[^}]+\})'
    css_match = re.search(css_pattern, content, re.DOTALL)
    navbar_css = css_match.group(1) if css_match else None

    # Extract navbar HTML (from "<!-- Island Navigation -->" to end of mobile menu)
    html_pattern = r'(<!-- Island Navigation -->.*?</div>\s*\n\s*<main>)'
    html_match = re.search(html_pattern, content, re.DOTALL)
    navbar_html = html_match.group(1).replace('</div>\n\n  <main>', '</div>') if html_match else None

    # Extract navbar JavaScript
    js_pattern = r'(// Navbar scroll behavior.*?// Other JavaScript)'
    js_match = re.search(js_pattern, content, re.DOTALL)
    navbar_js = js_match.group(1) if js_match else None

    return navbar_css, navbar_html, navbar_js

def update_page(filename, navbar_css, navbar_html, navbar_js):
    """Update a single page with the new navbar"""
    print(f"📄 Updating {filename}...")

    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Replace old navbar CSS
    # Find any existing header/nav CSS and replace it
    old_css_patterns = [
        r'\.site-header \{[^}]+\}.*?\.nav-drawer \.drawer-cta \{[^}]+\}',
        r'header \{[^}]+\}.*?\.mobile-toggle \{[^}]+\}',
        r'#main-header \{.*?\.mobile-link:hover \{[^}]+\}'
    ]

    replaced_css = False
    for pattern in old_css_patterns:
        if re.search(pattern, content, re.DOTALL):
            content = re.sub(pattern, navbar_css, content, count=1, flags=re.DOTALL)
            replaced_css = True
            break

    if not replaced_css:
        # Insert before .hero styles if pattern not found
        content = re.sub(r'(\.hero \{)', navbar_css + '\n    \\1', content, count=1)

    # 2. Replace old navbar HTML
    old_html_patterns = [
        r'<header class="site-header">.*?</header>',
        r'<header id="main-header">.*?</div>\s*\n\s*<main>',
        r'<header[^>]*>.*?</header>\s*\n\s*<main>'
    ]

    for pattern in old_html_patterns:
        if re.search(pattern, content, re.DOTALL):
            content = re.sub(pattern, navbar_html + '\n\n  <main>', content, count=1, flags=re.DOTALL)
            break

    # 3. Update JavaScript
    old_js_patterns = [
        r'const header = document\.querySelector\(.*?\);.*?if \(menuToggle && navDrawer\) \{.*?\}\s*\}',
        r'const header = document\.getElementById\(.*?\);.*?// Other JavaScript'
    ]

    for pattern in old_js_patterns:
        if re.search(pattern, content, re.DOTALL):
            content = re.sub(pattern, navbar_js, content, count=1, flags=re.DOTALL)
            break

    # Write updated content
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"✅ Updated {filename}")

def main():
    print("🚀 Starting navbar update for all pages...\n")

    # Extract navbar components from template
    navbar_css, navbar_html, navbar_js = extract_navbar_from_template()

    if not all([navbar_css, navbar_html, navbar_js]):
        print("❌ Failed to extract navbar components from residential.html")
        return

    print(f"✅ Extracted navbar components from residential.html\n")

    # Update each page
    updated_count = 0
    for page in PAGES:
        if os.path.exists(page):
            try:
                update_page(page, navbar_css, navbar_html, navbar_js)
                updated_count += 1
            except Exception as e:
                print(f"❌ Error updating {page}: {e}")
        else:
            print(f"⚠️  {page} not found, skipping...")

    print(f"\n✨ Done! Updated {updated_count}/{len(PAGES)} pages")
    print("📝 All pages now have the standardized homepage navbar!")

if __name__ == "__main__":
    main()
