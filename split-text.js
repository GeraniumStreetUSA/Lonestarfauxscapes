/**
 * Split Text Hero Animation
 *
 * Launch-safe default:
 * this effect is opt-in only because letter-by-letter DOM transforms can
 * compromise readability on long headlines, city pages, and generated content.
 *
 * To enable the effect on a specific heading, add:
 *   data-split-text="letters"
 */
(function () {
  const isMobile =
    window.innerWidth < 992 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  if (isMobile) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const heroHeadings = document.querySelectorAll('.hero h1[data-split-text="letters"]');
  if (!heroHeadings.length) return;

  heroHeadings.forEach((heading) => {
    const text = heading.textContent || '';
    if (!text.trim()) return;

    heading.innerHTML = '';
    heading.style.opacity = '1';

    const words = text.split(/\s+/);

    words.forEach((word, wordIndex) => {
      const wordSpan = document.createElement('span');
      wordSpan.style.display = 'inline-block';
      wordSpan.style.whiteSpace = 'nowrap';

      word.split('').forEach((letter, letterIndex) => {
        const span = document.createElement('span');
        span.textContent = letter;
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        span.style.transform = 'translateY(24px)';
        span.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
        span.style.transitionDelay = `${(wordIndex * 3 + letterIndex) * 24}ms`;
        wordSpan.appendChild(span);
      });

      heading.appendChild(wordSpan);

      if (wordIndex < words.length - 1) {
        heading.appendChild(document.createTextNode(' '));
      }
    });

    window.setTimeout(() => {
      heading.querySelectorAll('span > span').forEach((span) => {
        span.style.opacity = '1';
        span.style.transform = 'translateY(0)';
      });
    }, 80);
  });
})();
