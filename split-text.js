/**
 * Split Text Hero Animation
 * Letter-by-letter reveal for hero headlines
 */
(function() {
  // Respect reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Only target simple hero h1 elements, not the homepage hero-content which has its own GSAP animation
  const heroHeadings = document.querySelectorAll('.hero h1');

  // Skip if this is the homepage (has hero-content with WebGL)
  if (document.querySelector('.hero-content h1')) return;

  heroHeadings.forEach(heading => {
    const text = heading.textContent;
    heading.innerHTML = '';
    heading.style.opacity = '1';

    // Split into words, then letters
    const words = text.split(' ');

    words.forEach((word, wordIndex) => {
      const wordSpan = document.createElement('span');
      wordSpan.style.display = 'inline-block';
      wordSpan.style.whiteSpace = 'nowrap';

      word.split('').forEach((letter, letterIndex) => {
        const span = document.createElement('span');
        span.textContent = letter;
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        span.style.transform = 'translateY(40px) rotateX(-20deg)';
        span.style.transition = `opacity 0.5s ease, transform 0.5s ease`;

        // Stagger delay based on position
        const delay = (wordIndex * 3 + letterIndex) * 30;
        span.style.transitionDelay = `${delay}ms`;

        wordSpan.appendChild(span);
      });

      heading.appendChild(wordSpan);

      // Add space between words
      if (wordIndex < words.length - 1) {
        const space = document.createElement('span');
        space.innerHTML = '&nbsp;';
        space.style.display = 'inline-block';
        heading.appendChild(space);
      }
    });

    // Trigger animation after small delay
    setTimeout(() => {
      heading.querySelectorAll('span > span').forEach(span => {
        span.style.opacity = '1';
        span.style.transform = 'translateY(0) rotateX(0)';
      });
    }, 100);
  });
})();
