// Script to update all HTML pages with the standardized navbar
// Run with: node update-navbars.js

const fs = require('fs');
const path = require('path');

const pages = [
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
  'hedge-builder-residential.html',
  'hedge-builder-commercial.html'
];

const navbarCSS = `    /* Floating Island Header */
    #main-header {
      position: fixed;
      top: 1.25rem;
      left: 50%;
      transform: translateX(-50%);
      width: 94%;
      max-width: 1100px;
      z-index: 1000;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      padding: 0.85rem 1.5rem;
      border-radius: 28px;
      background: rgba(10, 20, 15, 0.8);
      backdrop-filter: blur(14px);
      border: 1px solid rgba(255,255,255,0.07);
      box-shadow: 0 12px 28px rgba(0,0,0,0.2);
    }
    #main-header.scrolled {
      top: 1rem;
      background: rgba(5, 10, 7, 0.9);
      width: 96%;
    }
    .nav-container {
      display: flex;
      align-items: center;
      width: 100%;
      max-width: none;
      gap: 1rem;
    }
    .logo {
      font-family: var(--font-heading, 'Helvetica Neue', Helvetica, Arial, sans-serif);
      font-size: 1rem;
      font-weight: 900;
      color: #fff;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      white-space: nowrap;
    }
    .nav-links { display: none; }
    @media(min-width: 992px) {
      .nav-links {
        display: flex;
        gap: 2.75rem;
        align-items: center;
        margin-left: auto;
      }
      .nav-item {
        font-size: 0.85rem;
        font-weight: 600;
        color: rgba(255,255,255,0.7);
        text-transform: uppercase;
        letter-spacing: 0.03em;
        position: relative;
        padding-bottom: 0.25rem;
      }
      .nav-item:hover { color: var(--color-accent, var(--accent, #4caf50)); }
      .nav-item::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 2px;
        background: linear-gradient(90deg, rgba(76,175,80,0.9), rgba(76,175,80,0.5));
        transform: scaleX(0);
        transform-origin: center;
        transition: transform 0.2s ease;
      }
      .nav-item:hover::after { transform: scaleX(1); }
      .nav-item.active::after { transform: scaleX(1); }
      .nav-dropdown { position: relative; display: inline-flex; align-items: center; }
      .nav-item-parent { display: inline-flex; align-items: center; gap: 0.3rem; }
      .nav-cta {
        padding: 0.55rem 1.1rem;
        border: 1px solid rgba(255,255,255,0.16);
        border-radius: 999px;
        color: #fff;
        background: rgba(255,255,255,0.06);
        box-shadow: inset 0 0 0 1px rgba(255,255,255,0.04);
      }
      .nav-cta:hover {
        background: rgba(255,255,255,0.12);
        color: #fff;
      }
      .nav-dropdown-menu {
        position: absolute;
        top: 100%;
        left: 0;
        background: rgba(5,10,7,0.95);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 12px;
        min-width: 220px;
        padding: 0.5rem 0;
        box-shadow: 0 15px 40px rgba(0,0,0,0.35);
        z-index: 1500;
        opacity: 0;
        visibility: hidden;
        transform: translateY(-8px);
        pointer-events: none;
        display: none;
        transition: opacity 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), visibility 0.3s;
      }
      .nav-dropdown:hover .nav-dropdown-menu,
      .nav-dropdown:focus-within .nav-dropdown-menu {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
        pointer-events: auto;
        display: block;
      }
      .nav-dropdown-item {
        display: block;
        padding: 0.6rem 1rem;
        color: rgba(255,255,255,0.8);
        font-size: 0.8rem;
        letter-spacing: 0.03em;
        white-space: nowrap;
        opacity: 0;
        transform: translateX(-8px);
        transition: opacity 0.2s ease, transform 0.2s ease, background 0.2s ease;
      }
      .nav-dropdown:hover .nav-dropdown-item:nth-child(1) { opacity: 1; transform: translateX(0); transition-delay: 50ms; }
      .nav-dropdown:hover .nav-dropdown-item:nth-child(2) { opacity: 1; transform: translateX(0); transition-delay: 100ms; }
      .nav-dropdown:hover .nav-dropdown-item:nth-child(3) { opacity: 1; transform: translateX(0); transition-delay: 150ms; }
      .nav-dropdown:hover .nav-dropdown-item:nth-child(4) { opacity: 1; transform: translateX(0); transition-delay: 200ms; }
      .nav-dropdown-item:hover {
        color: var(--color-accent, var(--accent, #4caf50));
        background: rgba(255,255,255,0.04);
      }
      .nav-caret {
        font-size: 0.7rem;
        margin-left: 0.3rem;
        display: inline-block;
        transition: transform 0.2s ease;
      }
      .nav-dropdown:hover .nav-caret {
        transform: rotate(180deg);
      }
    }
    .mobile-toggle {
      color: #fff;
      font-size: 1.2rem;
      cursor: pointer;
      display: block;
    }
    @media(min-width: 992px) {
      .mobile-toggle { display: none; }
    }
    /* Mobile Menu */
    #mobile-menu {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      background: rgba(5, 10, 7, 0.98);
      backdrop-filter: blur(20px);
      z-index: 9999;
      padding: 6rem 2rem;
      transform: translateY(-100%);
      transition: transform 0.5s cubic-bezier(0.7, 0, 0.3, 1);
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
    #mobile-menu.active {
      transform: translateY(0);
    }
    .mobile-link {
      font-family: var(--font-heading, 'Helvetica Neue', Helvetica, Arial, sans-serif);
      font-size: 1.5rem;
      font-weight: 700;
      color: rgba(255,255,255,0.9);
      -webkit-text-fill-color: rgba(255,255,255,0.9);
      -webkit-text-stroke: 0;
      transition: 0.3s;
      padding: 0.5rem 0;
      text-decoration: none;
    }
    .mobile-link:hover {
      color: var(--color-accent, var(--accent, #4caf50));
      -webkit-text-fill-color: var(--color-accent, var(--accent, #4caf50));
    }`;

console.log('Starting navbar update process...');
console.log(`Will update ${pages.length} pages\n`);

pages.forEach(page => {
  const filePath = path.join(__dirname, page);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Skipping ${page} - file not found`);
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Backup
    fs.writeFileSync(filePath + '.backup', content);

    // Note: This is a placeholder - actual replacement logic would go here
    console.log(`✅ Backed up ${page}`);

  } catch (error) {
    console.error(`❌ Error processing ${page}:`, error.message);
  }
});

console.log('\n✨ Navbar update process complete!');
console.log('Note: Manual updates still required for precise CSS/HTML replacements');
