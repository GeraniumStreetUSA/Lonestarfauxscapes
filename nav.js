(function () {
  const isMobile =
    window.innerWidth < 992 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  const style = document.createElement('style');
  style.innerHTML = isMobile
    ? `
    header { background: rgba(5,10,7,0.92); }
    header.scrolled { background: rgba(5,10,7,0.92); box-shadow: 0 12px 30px rgba(0,0,0,0.35); border-bottom: 1px solid rgba(255,255,255,0.08); }
    .nav-item.active,
    .lsfs-link.active,
    .lsfs-mobile-link.active { color: #fff !important; }
    .nav-item.active::after { transform: scaleX(1); }
  `
    : `
    header { transition: background-color 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease; }
    header.scrolled { background: rgba(5,10,7,0.92); box-shadow: 0 12px 30px rgba(0,0,0,0.35); border-bottom: 1px solid rgba(255,255,255,0.08); }
    .nav-item { transition: color 0.2s ease; }
    .nav-item::after { height: 2px; opacity: 0.6; transition: transform 0.2s ease, opacity 0.2s ease; }
    .nav-item:hover::after { opacity: 1; }
    .nav-item.active,
    .lsfs-link.active,
    .lsfs-mobile-link.active { color: #fff !important; }
    .nav-item.active::after { transform: scaleX(1); }
    .nav-item:focus-visible,
    .nav-dropdown-item:focus-visible,
    .nav-cta:focus-visible {
      outline: 2px solid rgba(76,175,80,0.8);
      outline-offset: 2px;
      box-shadow: 0 0 0 4px rgba(76,175,80,0.15);
      color: #fff;
    }
  `;
  document.head.appendChild(style);

  const normalizePath = (value) => {
    const raw = String(value || '').trim();
    if (!raw || raw === '#') return '';
    if (/^(mailto:|tel:|javascript:)/i.test(raw)) return '';

    let path = raw;
    if (/^https?:\/\//i.test(path)) {
      try {
        path = new URL(path).pathname;
      } catch {
        return '';
      }
    }

    path = path.split('#')[0].split('?')[0];
    if (!path) return '';
    if (path === '/' || path === '/index' || path === '/index.html') return '/';
    path = path.replace(/\.html$/i, '');
    path = path.replace(/\/+$/, '');
    return path || '/';
  };

  const header = document.querySelector('header');
  let lastScrolled = null;
  const handleScroll = () => {
    if (!header) return;
    const isScrolled = window.scrollY > 80;
    if (lastScrolled === isScrolled) return;
    lastScrolled = isScrolled;
    header.classList.toggle('scrolled', isScrolled);
  };
  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });

  const currentPath = normalizePath(window.location.pathname);
  const links = Array.from(document.querySelectorAll('.nav-item, .lsfs-link, .mobile-link, .lsfs-mobile-link'));
  links.forEach((link) => {
    const target = normalizePath(link.getAttribute('href'));
    if (!target) {
      link.classList.remove('active');
      return;
    }
    const isMatch = target === '/' ? currentPath === '/' : currentPath === target || currentPath.startsWith(`${target}/`);
    link.classList.toggle('active', isMatch);
  });
})();
