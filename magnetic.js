/**
 * Magnetic Button Effect
 * Buttons subtly follow cursor on hover for a delightful interaction
 */
(function() {
  const magneticElements = document.querySelectorAll('.btn, .nav-cta, .arrow-cta span');

  magneticElements.forEach(el => {
    el.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Magnetic pull strength (adjust for more/less effect)
      const strength = 0.3;

      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0, 0)';
    });
  });
})();
