/**
 * Card spotlight effects
 * Cursor-tracking illumination without hover movement
 * DESKTOP ONLY - transforms cause scroll jank on mobile
 */
(function() {
  // Skip on mobile - cursor-tracking effects are not useful on touch
  const isMobile = window.innerWidth < 992 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if (isMobile) return;

  // Respect reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Use shared throttle utility or fallback
  const throttleRAF = (window.LonestarUtils && window.LonestarUtils.throttleRAF) || ((fn) => {
    let ticking = false;
    return function(...args) {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          fn.apply(this, args);
          ticking = false;
        });
      }
    };
  });

  const cards = document.querySelectorAll('.card, .live-card');

  cards.forEach(card => {
    // Throttled mousemove handler
    const handleMouseMove = throttleRAF((e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // Some card styles use --x/--y instead of --mouse-x/--mouse-y.
      card.style.setProperty('--x', `${x}px`);
      card.style.setProperty('--y', `${y}px`);
    });

    card.addEventListener('mousemove', handleMouseMove, { passive: true });

    card.addEventListener('mouseleave', () => {
      card.style.removeProperty('--mouse-x');
      card.style.removeProperty('--mouse-y');
      card.style.removeProperty('--x');
      card.style.removeProperty('--y');
    });
  });

  // Cursor glow — ambient green glow follows cursor (desktop only)
  const glow = document.querySelector('.hm-cursor-glow');
  if (glow) {
    const moveGlow = throttleRAF((e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    });
    document.addEventListener('mousemove', moveGlow, { passive: true });
  }
})();
