(function () {
  const style = document.createElement('style');
  style.innerHTML = `
    [data-reveal] {
      opacity: 0;
      transform: translateY(22px);
      transition: opacity 0.5s ease, transform 0.5s ease;
    }
    [data-reveal].reveal-in {
      opacity: 1;
      transform: translateY(0);
    }
    [data-reveal][data-reveal-delay="1"] { transition-delay: 0.1s; }
    [data-reveal][data-reveal-delay="2"] { transition-delay: 0.2s; }
    [data-reveal][data-reveal-delay="3"] { transition-delay: 0.3s; }
  `;
  document.head.appendChild(style);

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const els = new Set();

  const init = () => {
    document.querySelectorAll('[data-reveal]').forEach((el) => {
      if (els.has(el)) return;
      els.add(el);
      if (prefersReduced) {
        el.classList.add('reveal-in');
        return;
      }
      observer.observe(el);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-in');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: '0px 0px -5% 0px' }
  );

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
