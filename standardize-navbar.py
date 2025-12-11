#!/usr/bin/env python3
"""
Standardize navbar across all HTML files using index.html as the source of truth.
"""
import re
import os
from pathlib import Path

# Read the source of truth from index.html
with open('index.html', 'r', encoding='utf-8') as f:
    index_content = f.read()

# Extract navbar CSS (Floating Island Header + Mobile Menu)
css_start = index_content.find('/* Floating Island Header */')
css_end = index_content.find('.mobile-link:hover { color: var(--color-accent); -webkit-text-stroke: 0px; }')
css_end = index_content.find('\n', css_end) + 1
navbar_css = index_content[css_start:css_end].strip()

# Extract header HTML
header_start = index_content.find('<!-- Island Navigation -->')
header_end = index_content.find('</header>', header_start) + len('</header>')
header_html = index_content[header_start:header_end].strip()

# Extract mobile menu HTML
mobile_start = index_content.find('<!-- Mobile Menu -->')
mobile_end = index_content.find('</div>', mobile_start)
# Find the closing div for mobile-menu
mobile_temp = index_content[mobile_start:]
mobile_div_count = 0
for i, char in enumerate(mobile_temp):
    if mobile_temp[i:i+4] == '<div':
        mobile_div_count += 1
    elif mobile_temp[i:i+6] == '</div>':
        mobile_div_count -= 1
        if mobile_div_count == 0:
            mobile_end = mobile_start + i + 6
            break
mobile_menu_html = index_content[mobile_start:mobile_end].strip()

# Navbar JavaScript (inline)
navbar_js = """    <script>
    // Navbar scroll behavior and mobile menu
    (function() {
        // Scroll behavior
        const header = document.getElementById('main-header');
        if (header) {
            const handleScroll = () => {
                header.classList.toggle('scrolled', window.scrollY > 50);
            };
            window.addEventListener('scroll', handleScroll, { passive: true });
            handleScroll();
        }

        // Mobile menu
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileToggle = document.getElementById('mobile-toggle-btn');
        const mobileClose = document.getElementById('mobile-close-btn');
        const mobileLinks = document.querySelectorAll('.mobile-link');

        const toggleMenu = () => {
            if (mobileMenu) {
                mobileMenu.classList.toggle('active');
                document.body.classList.toggle('menu-open', mobileMenu.classList.contains('active'));
            }
        };

        if (mobileToggle) mobileToggle.addEventListener('click', toggleMenu);
        if (mobileClose) mobileClose.addEventListener('click', toggleMenu);
        mobileLinks.forEach((link) => link.addEventListener('click', () => {
            if (mobileMenu) mobileMenu.classList.remove('active');
        }));

        // Active page indicator
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-item').forEach(item => {
            const href = item.getAttribute('href');
            if (href && (href === currentPage || href.includes(currentPage))) {
                item.classList.add('active');
            }
        });
    })();
    </script>"""

# Full navbar component block
full_navbar_component = f"""<!-- STANDARDIZED NAVBAR COMPONENT -->
<style>
{navbar_css}
</style>

{header_html}

{mobile_menu_html}
"""

print("Extracted navbar component from index.html")
print(f"CSS length: {len(navbar_css)} chars")
print(f"Header HTML length: {len(header_html)} chars")
print(f"Mobile menu HTML length: {len(mobile_menu_html)} chars")
print()

# List of files to update (all HTML files except index.html)
files_to_update = [
    'commercial.html',
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
    'residential.html',
    'residential2.html',
    'hedge-builder-residential.html',
    'hedge-builder-commercial.html',
]

for filename in files_to_update:
    if not os.path.exists(filename):
        print(f"[SKIP] {filename} not found")
        continue

    print(f"Processing {filename}...")

    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove old navbar CSS (various patterns)
    # Pattern 1: Floating Island Header block
    content = re.sub(
        r'/\* Floating Island Header \*/.*?\.mobile-link:hover \{[^}]+\}',
        '',
        content,
        flags=re.DOTALL
    )

    # Pattern 2: Old site-header styles
    content = re.sub(
        r'\.site-header \{.*?@media.*?\}',
        '',
        content,
        flags=re.DOTALL
    )

    # Pattern 3: Mobile menu styles
    content = re.sub(
        r'/\* Mobile Menu \*/.*?\.mobile-link:hover \{[^}]+\}',
        '',
        content,
        flags=re.DOTALL
    )

    # Remove old header HTML
    content = re.sub(
        r'<header[^>]*>.*?</header>',
        '',
        content,
        flags=re.DOTALL
    )

    # Remove old mobile menu HTML
    content = re.sub(
        r'<div id="mobile-menu"[^>]*>.*?</div>\s*(?=<(?:main|section|div class="page-wrap"))',
        '',
        content,
        flags=re.DOTALL
    )

    # Remove old navbar JavaScript
    content = re.sub(
        r'<script>.*?(?:mobile-toggle-btn|mobile-close-btn|getElementById\([\'"]main-header[\'"])|mobileMenu).*?</script>',
        '',
        content,
        flags=re.DOTALL
    )

    # Insert new navbar component in <head> (CSS)
    head_match = re.search(r'</style>\s*</head>', content)
    if head_match:
        insert_pos = head_match.start()
        # Find the position after the last </style> but before </head>
        style_section = f"\n    <!-- STANDARDIZED NAVBAR COMPONENT CSS -->\n    <style>\n    {navbar_css}\n    </style>\n"
        content = content[:insert_pos] + style_section + content[insert_pos:]

    # Insert header and mobile menu HTML after <body>
    body_match = re.search(r'<body[^>]*>\s*', content)
    if body_match:
        insert_pos = body_match.end()
        html_section = f"\n{header_html}\n\n{mobile_menu_html}\n\n"
        content = content[:insert_pos] + html_section + content[insert_pos:]

    # Insert navbar JavaScript before </body>
    body_close_match = re.search(r'</body>', content)
    if body_close_match:
        insert_pos = body_close_match.start()
        content = content[:insert_pos] + navbar_js + "\n" + content[insert_pos:]

    # Write the updated content
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"  [OK] Updated {filename}")

print("\nDone! All files have been standardized with the navbar from index.html")
