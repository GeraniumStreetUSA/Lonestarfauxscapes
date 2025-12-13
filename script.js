/**
 * Legacy city-page navigation
 * Used by: frisco.html, irving.html, plano.html, sugar-land.html, the-woodlands.html
 *
 * This keeps the mobile menu working without pulling in heavier site scripts.
 */

(function () {
  const toggleButton = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu');

  if (!toggleButton || !menu) return;

  if (!menu.id) menu.id = 'primary-nav';
  toggleButton.setAttribute('aria-controls', menu.id);
  toggleButton.setAttribute('aria-expanded', 'false');

  const openMenu = () => {
    menu.classList.add('is-open');
    toggleButton.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
  };

  const closeMenu = () => {
    menu.classList.remove('is-open');
    toggleButton.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  };

  const toggleMenu = () => {
    if (menu.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  toggleButton.addEventListener('click', toggleMenu);

  // Close menu when a link is clicked.
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu when clicking outside.
  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (menu.contains(target) || toggleButton.contains(target)) return;
    closeMenu();
  });

  // If the user resizes to desktop, ensure the mobile menu is closed.
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 992) closeMenu();
  });
})();

