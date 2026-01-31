const fs = require('fs');
const path = require('path');

// Get all HTML files
const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html') && !f.startsWith('404') && !f.startsWith('hero-backup') && !f.startsWith('navbar'));
const blogFiles = fs.readdirSync('./blog').filter(f => f.endsWith('.html')).map(f => `blog/${f}`);
const allFiles = [...htmlFiles, ...blogFiles];

// New desktop navigation HTML
const newDesktopNav = `<a href="index.html" class="lsfs-link">Home</a>

      <!-- Products Dropdown -->
      <div class="lsfs-dropdown">
        <a href="products.html" class="lsfs-link">Products <span class="lsfs-caret">&#9662;</span></a>
        <div class="lsfs-dropdown-menu lsfs-dropdown-wide">
          <div class="lsfs-dropdown-section">
            <span class="lsfs-dropdown-label">Hedges</span>
            <a href="artificial-hedge.html">Artificial Hedge</a>
            <a href="artificial-boxwood-hedge.html">Boxwood Hedge</a>
            <a href="fire-rated-artificial-hedge.html">Fire-Rated</a>
            <a href="hoa-approved-artificial-hedge.html">HOA-Approved</a>
          </div>
          <div class="lsfs-dropdown-section">
            <span class="lsfs-dropdown-label">Walls & More</span>
            <a href="living-wall.html">Living Wall</a>
            <a href="commercial-wall.html">Commercial Wall</a>
            <a href="fence-extensions.html">Fence Extensions</a>
            <a href="pool-privacy-hedge.html">Pool Privacy</a>
            <a href="vallum-frx.html">Vallum FRX</a>
          </div>
        </div>
      </div>

      <!-- Locations Dropdown -->
      <div class="lsfs-dropdown">
        <a href="#" class="lsfs-link">Locations <span class="lsfs-caret">&#9662;</span></a>
        <div class="lsfs-dropdown-menu lsfs-dropdown-wide">
          <div class="lsfs-dropdown-section">
            <span class="lsfs-dropdown-label">Major Cities</span>
            <a href="dallas.html">Dallas</a>
            <a href="houston.html">Houston</a>
            <a href="austin.html">Austin</a>
            <a href="san-antonio.html">San Antonio</a>
            <a href="fort-worth.html">Fort Worth</a>
          </div>
          <div class="lsfs-dropdown-section">
            <span class="lsfs-dropdown-label">DFW Metro</span>
            <a href="plano.html">Plano</a>
            <a href="frisco.html">Frisco</a>
            <a href="irving.html">Irving</a>
            <a href="arlington.html">Arlington</a>
          </div>
          <div class="lsfs-dropdown-section">
            <span class="lsfs-dropdown-label">Houston Metro</span>
            <a href="sugar-land.html">Sugar Land</a>
            <a href="the-woodlands.html">The Woodlands</a>
          </div>
        </div>
      </div>

      <a href="installation.html" class="lsfs-link">Installation</a>
      <a href="gallery.html" class="lsfs-link">Gallery</a>
      <a href="blog.html" class="lsfs-link">Blog</a>
      <a href="pricing.html" class="lsfs-link">Pricing</a>
      <a href="contact.html" class="lsfs-link lsfs-cta">Get Quote</a>`;

// New mobile menu HTML
const newMobileMenu = `<div id="lsfs-mobile-menu">
  <button id="lsfs-close" aria-label="Close menu">&#215;</button>

  <a href="index.html" class="lsfs-mobile-link">Home</a>

  <!-- Products Section -->
  <span class="lsfs-mobile-label">Products</span>
  <a href="artificial-hedge.html" class="lsfs-mobile-link lsfs-sub">Artificial Hedge</a>
  <a href="artificial-boxwood-hedge.html" class="lsfs-mobile-link lsfs-sub">Boxwood Hedge</a>
  <a href="fire-rated-artificial-hedge.html" class="lsfs-mobile-link lsfs-sub">Fire-Rated</a>
  <a href="living-wall.html" class="lsfs-mobile-link lsfs-sub">Living Wall</a>
  <a href="commercial-wall.html" class="lsfs-mobile-link lsfs-sub">Commercial Wall</a>
  <a href="fence-extensions.html" class="lsfs-mobile-link lsfs-sub">Fence Extensions</a>
  <a href="pool-privacy-hedge.html" class="lsfs-mobile-link lsfs-sub">Pool Privacy</a>

  <!-- Locations Section -->
  <span class="lsfs-mobile-label">Locations</span>
  <a href="dallas.html" class="lsfs-mobile-link lsfs-sub">Dallas</a>
  <a href="houston.html" class="lsfs-mobile-link lsfs-sub">Houston</a>
  <a href="austin.html" class="lsfs-mobile-link lsfs-sub">Austin</a>
  <a href="san-antonio.html" class="lsfs-mobile-link lsfs-sub">San Antonio</a>
  <a href="fort-worth.html" class="lsfs-mobile-link lsfs-sub">Fort Worth</a>
  <a href="plano.html" class="lsfs-mobile-link lsfs-sub">Plano</a>
  <a href="frisco.html" class="lsfs-mobile-link lsfs-sub">Frisco</a>

  <a href="installation.html" class="lsfs-mobile-link">Installation</a>
  <a href="gallery.html" class="lsfs-mobile-link">Gallery</a>
  <a href="blog.html" class="lsfs-mobile-link">Blog</a>
  <a href="pricing.html" class="lsfs-mobile-link">Pricing</a>
  <a href="contact.html" class="lsfs-mobile-link lsfs-mobile-cta">Get Quote</a>
</div>`;

// New dropdown CSS - much cleaner and less smooshed
const newDropdownCSS = `/* ===== DROPDOWN - GPU accelerated ===== */
.lsfs-dropdown {
  position: relative !important;
  display: inline-flex !important;
  transform: translateZ(0) !important;
  backface-visibility: hidden !important;
}

.lsfs-caret {
  font-size: 0.6rem !important;
  margin-left: 0.35rem !important;
  transition: transform 0.2s ease !important;
  opacity: 0.6 !important;
  display: inline-block !important;
  transform-origin: center !important;
  will-change: transform !important;
}

.lsfs-dropdown:hover .lsfs-caret {
  transform: rotate(180deg) translateZ(0) !important;
}

.lsfs-dropdown-menu {
  position: absolute !important;
  top: 100% !important;
  left: 50% !important;
  transform: translateX(-50%) translateY(-10px) !important;
  margin-top: 1rem !important;
  min-width: 200px !important;
  background: rgba(10, 18, 14, 0.97) !important;
  backdrop-filter: blur(20px) !important;
  -webkit-backdrop-filter: blur(20px) !important;
  border: 1px solid rgba(100, 211, 138, 0.15) !important;
  border-radius: 12px !important;
  padding: 0.75rem !important;
  box-shadow: 0 25px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(100,211,138,0.08) !important;
  opacity: 0 !important;
  visibility: hidden !important;
  transition: all 0.2s ease !important;
  z-index: 1000 !important;
}

/* Wide dropdown for multi-column */
.lsfs-dropdown-menu.lsfs-dropdown-wide {
  display: flex !important;
  gap: 0.5rem !important;
  min-width: auto !important;
  left: 50% !important;
  transform: translateX(-50%) translateY(-10px) !important;
}

.lsfs-dropdown:hover .lsfs-dropdown-menu {
  opacity: 1 !important;
  visibility: visible !important;
  transform: translateX(-50%) translateY(0) !important;
}
.lsfs-dropdown:focus-within .lsfs-dropdown-menu {
  opacity: 1 !important;
  visibility: visible !important;
  transform: translateX(-50%) translateY(0) !important;
}

/* Dropdown sections for multi-column layout */
.lsfs-dropdown-section {
  display: flex !important;
  flex-direction: column !important;
  min-width: 160px !important;
  padding: 0.25rem !important;
}

.lsfs-dropdown-label {
  display: block !important;
  padding: 0.5rem 0.75rem 0.4rem !important;
  font-size: 0.7rem !important;
  font-weight: 600 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.08em !important;
  color: rgba(100, 211, 138, 0.7) !important;
  border-bottom: 1px solid rgba(255,255,255,0.06) !important;
  margin-bottom: 0.4rem !important;
}

.lsfs-dropdown-menu a {
  display: block !important;
  padding: 0.65rem 0.75rem !important;
  font-size: 0.85rem !important;
  font-weight: 400 !important;
  color: rgba(255,255,255,0.85) !important;
  transition: all 0.15s ease !important;
  text-align: left !important;
  border-radius: 6px !important;
  white-space: nowrap !important;
}

.lsfs-dropdown-menu a:hover {
  color: #fff !important;
  background: rgba(100,211,138,0.12) !important;
  padding-left: 1rem !important;
}

/* Mobile label styling */
.lsfs-mobile-label {
  display: block !important;
  padding: 1.5rem 2rem 0.5rem !important;
  font-size: 0.7rem !important;
  font-weight: 600 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.1em !important;
  color: rgba(100, 211, 138, 0.6) !important;
}`;

let updatedCount = 0;

allFiles.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;

    // 1. Replace desktop nav links (between lsfs-desktop-links opening and closing)
    const desktopNavRegex = /<div id="lsfs-desktop-links">[\s\S]*?<\/div>\s*(?=\s*<!--\s*Mobile Hamburger|<button id="lsfs-hamburger")/;
    if (desktopNavRegex.test(content)) {
      content = content.replace(desktopNavRegex, `<div id="lsfs-desktop-links">\n      ${newDesktopNav}\n    </div>\n\n    `);
      modified = true;
    }

    // 2. Replace mobile menu
    const mobileMenuRegex = /<div id="lsfs-mobile-menu">[\s\S]*?<\/div>\s*(?=\s*<!--\s*ALL STYLES|<style>)/;
    if (mobileMenuRegex.test(content)) {
      content = content.replace(mobileMenuRegex, newMobileMenu + '\n\n');
      modified = true;
    }

    // 3. Replace dropdown CSS
    const dropdownCSSRegex = /\/\* ===== DROPDOWN - GPU accelerated =====[\s\S]*?(?=\/\* ===== HAMBURGER BUTTON =====)/;
    if (dropdownCSSRegex.test(content)) {
      content = content.replace(dropdownCSSRegex, newDropdownCSS + '\n\n');
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(file, content, 'utf8');
      updatedCount++;
      console.log(`Updated: ${file}`);
    }
  } catch (err) {
    console.error(`Error processing ${file}:`, err.message);
  }
});

console.log(`\nUpdated ${updatedCount} files with new navigation and dropdown styles`);
