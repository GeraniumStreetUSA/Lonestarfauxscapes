export const UNIVERSAL_NAV_STYLESHEET = '  <link rel="stylesheet" href="/navbar-universal.css">';

export const UNIVERSAL_NAV_MARKUP = `<!-- NAVBAR HTML -->
<header id="lsfs-header">
  <nav id="lsfs-nav">
    <a href="/" id="lsfs-logo">Lone Star Faux Scapes</a>

    <!-- Desktop Navigation -->
    <div id="lsfs-desktop-links">
      <a href="/" class="lsfs-link">Home</a>

      <!-- Products Dropdown -->
            <div class="lsfs-dropdown">
        <a href="/products" class="lsfs-link">Products <span class="lsfs-caret">&#9662;</span></a>
        <div class="lsfs-dropdown-menu lsfs-dropdown-wide">
          <div class="lsfs-dropdown-section">
            <span class="lsfs-dropdown-label">Hedges</span>
            <a href="/artificial-hedge">Artificial Hedge</a>
            <a href="/artificial-boxwood-hedge">Boxwood Hedge</a>
            <a href="/fire-rated-artificial-hedge">Fire-Rated</a>
            <a href="/hoa-approved-artificial-hedge">HOA-Approved</a>
            <a href="/pool-privacy-hedge">Pool Privacy</a>
            <a href="/vallum-frx">Vallum FRX</a>
          </div>
          <div class="lsfs-dropdown-section">
            <span class="lsfs-dropdown-label">Walls</span>
            <a href="/living-wall">Living Wall</a>
            <a href="/pool-living-wall">Pool Living Wall</a>
            <a href="/commercial-wall">Commercial Wall</a>
            <a href="/fence-extensions">Fence Extensions</a>
          </div>
        </div>
      </div>

      <!-- Locations Dropdown -->
      <div class="lsfs-dropdown">
        <a href="/locations" class="lsfs-link">Locations <span class="lsfs-caret">&#9662;</span></a>
        <div class="lsfs-dropdown-menu lsfs-dropdown-wide">
          <div class="lsfs-dropdown-section">
            <span class="lsfs-dropdown-label">Major Cities</span>
            <a href="/dallas">Dallas</a>
            <a href="/houston">Houston</a>
            <a href="/austin">Austin</a>
            <a href="/san-antonio">San Antonio</a>
            <a href="/fort-worth">Fort Worth</a>
          </div>
          <div class="lsfs-dropdown-section">
            <span class="lsfs-dropdown-label">DFW Metro</span>
            <a href="/plano">Plano</a>
            <a href="/frisco">Frisco</a>
            <a href="/irving">Irving</a>
            <a href="/arlington">Arlington</a>
          </div>
          <div class="lsfs-dropdown-section">
            <span class="lsfs-dropdown-label">Houston Metro</span>
            <a href="/sugar-land">Sugar Land</a>
            <a href="/the-woodlands">The Woodlands</a>
          </div>
        </div>
      </div>

      <a href="/installation" class="lsfs-link">Installation</a>
      <a href="/case-studies" class="lsfs-link">Projects</a>
      <a href="/guides" class="lsfs-link">Guides</a>
      <a href="/pricing" class="lsfs-link">Pricing</a>
      <a href="/contact" class="lsfs-link lsfs-cta">Get Quote</a>
    </div>

    <!-- Mobile Hamburger -->
    <button id="lsfs-hamburger" aria-label="Open menu">
      <span></span>
      <span></span>
      <span></span>
    </button>
  </nav>
</header>

<!-- MOBILE MENU (separate from header) -->
<div id="lsfs-mobile-menu">
  <button id="lsfs-close" aria-label="Close menu">&#215;</button>

  <a href="/" class="lsfs-mobile-link">Home</a>

  <!-- Products Section -->
  <span class="lsfs-mobile-label">Products</span>
  <span class="lsfs-mobile-subhead">Hedges</span>
  <a href="/artificial-hedge" class="lsfs-mobile-link lsfs-sub">Artificial Hedge</a>
  <a href="/artificial-boxwood-hedge" class="lsfs-mobile-link lsfs-sub">Boxwood Hedge</a>
  <a href="/fire-rated-artificial-hedge" class="lsfs-mobile-link lsfs-sub">Fire-Rated</a>
  <a href="/hoa-approved-artificial-hedge" class="lsfs-mobile-link lsfs-sub">HOA-Approved</a>
  <a href="/pool-privacy-hedge" class="lsfs-mobile-link lsfs-sub">Pool Privacy</a>
  <a href="/vallum-frx" class="lsfs-mobile-link lsfs-sub">Vallum FRX</a>
  <span class="lsfs-mobile-subhead">Walls</span>
  <a href="/living-wall" class="lsfs-mobile-link lsfs-sub">Living Wall</a>
  <a href="/pool-living-wall" class="lsfs-mobile-link lsfs-sub">Pool Living Wall</a>
  <a href="/commercial-wall" class="lsfs-mobile-link lsfs-sub">Commercial Wall</a>
  <a href="/fence-extensions" class="lsfs-mobile-link lsfs-sub">Fence Extensions</a>
  <!-- Locations Section -->
  <span class="lsfs-mobile-label">Locations</span>
  <a href="/dallas" class="lsfs-mobile-link lsfs-sub">Dallas</a>
  <a href="/houston" class="lsfs-mobile-link lsfs-sub">Houston</a>
  <a href="/austin" class="lsfs-mobile-link lsfs-sub">Austin</a>
  <a href="/san-antonio" class="lsfs-mobile-link lsfs-sub">San Antonio</a>
  <a href="/fort-worth" class="lsfs-mobile-link lsfs-sub">Fort Worth</a>
  <a href="/plano" class="lsfs-mobile-link lsfs-sub">Plano</a>
  <a href="/frisco" class="lsfs-mobile-link lsfs-sub">Frisco</a>

  <a href="/installation" class="lsfs-mobile-link">Installation</a>
  <a href="/case-studies" class="lsfs-mobile-link">Projects</a>
  <a href="/guides" class="lsfs-mobile-link">Guides</a>
  <a href="/pricing" class="lsfs-mobile-link">Pricing</a>
  <a href="/contact" class="lsfs-mobile-link lsfs-mobile-cta">Get Quote</a>
</div>`;

export const UNIVERSAL_NAV_SCRIPT = `  <script>
    (function() {
      const hamburger = document.getElementById('lsfs-hamburger');
      const mobileMenu = document.getElementById('lsfs-mobile-menu');
      const closeBtn = document.getElementById('lsfs-close');
      const mobileLinks = document.querySelectorAll('.lsfs-mobile-link');

      if (!hamburger || !mobileMenu || !closeBtn) return;

      const closeMenu = () => {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      };

      hamburger.addEventListener('click', () => {
        mobileMenu.classList.add('open');
        document.body.style.overflow = 'hidden';
      });

      closeBtn.addEventListener('click', closeMenu);
      mobileLinks.forEach((link) => link.addEventListener('click', closeMenu));

      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && mobileMenu.classList.contains('open')) {
          closeMenu();
        }
      });
    })();
  </script>
  <script defer src="/nav.js"></script>`;
