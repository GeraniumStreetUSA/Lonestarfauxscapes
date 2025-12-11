#!/usr/bin/env python3
import re
import os

# Files to update
files = [
    'commercial2.html',
    'products.html',
    'living-wall.html',
    'commercial-wall.html',
    'fence-extensions.html',
    'artificial-hedge.html',
    'blog.html',
    'austin.html',
    'dallas.html',
    'houston.html',
    'san-antonio.html',
    'hedge-builder-residential.html',
    'hedge-builder-commercial.html'
]

# Read the updated commercial.html to extract the navbar components
with open('commercial.html', 'r', encoding='utf-8') as f:
    commercial_content = f.read()

# Extract CSS navbar section (from "/* Floating Island Header */" to mobile-link:hover)
css_pattern = r'(/\* Floating Island Header \*/.*?\.mobile-link:hover \{[^}]+\})'
css_match = re.search(css_pattern, commercial_content, re.DOTALL)
new_navbar_css = css_match.group(1) if css_match else None

# Extract HTML navbar section (from <!-- Island Navigation --> to </div> after mobile menu)
html_pattern = r'(<!-- Island Navigation -->.*?<div id="mobile-menu">.*?</div>\s+<main>)'
html_match = re.search(html_pattern, commercial_content, re.DOTALL)
new_navbar_html = html_match.group(1).replace('  <main>', '') if html_match else None

# Extract JS navbar section (the IIFE function)
js_pattern = r'(\(function\(\) \{[^}]*?// Navbar scroll behavior.*?// Active page indicator.*?\}\)\(\);)'
js_match = re.search(js_pattern, commercial_content, re.DOTALL)
new_navbar_js = js_match.group(1) if js_match else None

if not all([new_navbar_css, new_navbar_html, new_navbar_js]):
    print("ERROR: Could not extract navbar components from commercial.html")
    exit(1)

print(f"[OK] Extracted navbar CSS ({len(new_navbar_css)} chars)")
print(f"[OK] Extracted navbar HTML ({len(new_navbar_html)} chars)")
print(f"[OK] Extracted navbar JS ({len(new_navbar_js)} chars)")
print()

# Update each file
for filename in files:
    if not os.path.exists(filename):
        print(f"[SKIP] {filename} (not found)")
        continue

    print(f"Processing {filename}...")

    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    changes = 0

    # Replace CSS - look for various header/nav CSS patterns
    # Pattern 1: Old sticky header style
    old_css_pattern1 = r'(a \{ color: inherit;[^}]+\}\s+)(header \{.*?\.nav-group:hover \.nav-dropdown \{[^}]+\})'
    if re.search(old_css_pattern1, content, re.DOTALL):
        content = re.sub(old_css_pattern1, r'\1' + new_navbar_css, content, flags=re.DOTALL)
        changes += 1

    # Pattern 2: Old .site-header style
    old_css_pattern2 = r'(a \{ color: inherit;[^}]+\}\s+)(\.site-header \{.*?@media.*?\.mobile-toggle.*?\})'
    if re.search(old_css_pattern2, content, re.DOTALL):
        content = re.sub(old_css_pattern2, r'\1' + new_navbar_css, content, flags=re.DOTALL)
        changes += 1

    # Replace HTML - look for old header patterns
    # Pattern 1: <header id="site-header">
    old_html_pattern1 = r'<header id="site-header">.*?</header>\s+<main>'
    if re.search(old_html_pattern1, content, re.DOTALL):
        content = re.sub(old_html_pattern1, new_navbar_html + '\n\n  <main>', content, flags=re.DOTALL)
        changes += 1

    # Pattern 2: <header class="site-header">
    old_html_pattern2 = r'<header class="site-header">.*?</header>\s+<main>'
    if re.search(old_html_pattern2, content, re.DOTALL):
        content = re.sub(old_html_pattern2, new_navbar_html + '\n\n  <main>', content, flags=re.DOTALL)
        changes += 1

    # Pattern 3: Just <header> without class/id
    old_html_pattern3 = r'<header>.*?</header>\s+<main>'
    if re.search(old_html_pattern3, content, re.DOTALL) and 'id="main-header"' not in content:
        content = re.sub(old_html_pattern3, new_navbar_html + '\n\n  <main>', content, flags=re.DOTALL)
        changes += 1

    # Replace JS - look for old header scroll behavior
    old_js_pattern1 = r"const header = document\.getElementById\('site-header'\);.*?observer\.observe\(document\.body\);"
    if re.search(old_js_pattern1, content, re.DOTALL):
        content = re.sub(old_js_pattern1, new_navbar_js, content, flags=re.DOTALL)
        changes += 1

    # Pattern 2: Different nav JS patterns
    old_js_pattern2 = r"const header = document\.querySelector\('header'\);.*?window\.addEventListener\('scroll'[^}]+\}\);"
    if re.search(old_js_pattern2, content, re.DOTALL):
        content = re.sub(old_js_pattern2, new_navbar_js, content, flags=re.DOTALL)
        changes += 1

    if content != original_content:
        # Save updated file
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  [OK] Updated {filename} ({changes} sections replaced)")
    else:
        print(f"  [SKIP] No changes made to {filename} (patterns not found or already updated)")

    print()

print("Done! All files processed.")
