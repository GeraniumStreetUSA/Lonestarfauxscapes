(() => {
  // Utility functions
  const isMobile = () => window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // RAF-based throttle
  const throttleRAF = (fn) => {
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
  };

  const onReady = (callback) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback, { once: true });
    } else {
      callback();
    }
  };

  const initLiveCards = () => {
    // Skip on mobile
    if (isMobile()) return;

    const cards = document.querySelectorAll('.live-card');

    cards.forEach((card) => {
      const el = card;

      // Throttled mousemove handler
      const handleMouseMove = throttleRAF((event) => {
        const rect = el.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        el.style.setProperty('--x', `${x}px`);
        el.style.setProperty('--y', `${y}px`);

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -2;
        const rotateY = ((x - centerX) / centerX) * 2;

        el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      });

      el.addEventListener('mousemove', handleMouseMove, { passive: true });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      });
    });
  };

  const initYear = () => {
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear().toString();
    }
  };

  const initMobileMenu = () => {
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileToggle = document.getElementById('mobile-toggle-btn');
    const mobileClose = document.getElementById('mobile-close-btn');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    const toggleMenu = () => {
      mobileMenu?.classList.toggle('active');
      document.body.classList.toggle('menu-open', mobileMenu?.classList.contains('active'));
    };

    mobileToggle?.addEventListener('click', toggleMenu);
    mobileClose?.addEventListener('click', toggleMenu);
    mobileLinks.forEach((link) => link.addEventListener('click', () => mobileMenu?.classList.remove('active')));
  };

  const initAnimations = () => {
    const gsapLib = window.gsap;
    const scrollTrigger = window.ScrollTrigger;
    if (!gsapLib || !scrollTrigger) return;

    // Skip ALL GSAP animations on mobile - transforms cause scroll jank
    if (isMobile()) return;

    gsapLib.registerPlugin(scrollTrigger);

    // Scroll-triggered reveal animations for below-fold content
    gsapLib.utils.toArray('.gs-reveal').forEach((element) => {
      gsapLib.fromTo(
        element,
        { y: 40, opacity: 0 },
        {
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
          },
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
        }
      );
    });

    // Hero animations removed - now handled by CSS-only animations
    };

    const initParallaxMedia = () => {
        // Skip on mobile
        if (isMobile()) return;

        const parallaxEls = document.querySelectorAll('[data-parallax]');
        if (!parallaxEls.length) return;

    // Throttled mousemove handler
    const onMove = throttleRAF((event) => {
      const { innerWidth, innerHeight } = window;
      const x = (event.clientX / innerWidth - 0.5) * 10;
      const y = (event.clientY / innerHeight - 0.5) * 6;
      parallaxEls.forEach((el) => {
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
    });

    window.addEventListener('mousemove', onMove, { passive: true });

    parallaxEls.forEach((el) => {
      el.addEventListener('mouseenter', () => el.classList.add('hovered'));
      el.addEventListener('mouseleave', () => el.classList.remove('hovered'));
    });
    };

    const initTexasMap = () => {
        const mapCard = document.querySelector('.texas-map-card');
        const gsapLib = window.gsap;
        const scrollTrigger = window.ScrollTrigger;
        if (!mapCard || !gsapLib || !scrollTrigger) return;
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const arcs = mapCard.querySelectorAll('.map-arc');
        arcs.forEach((arc) => {
            if (typeof arc.getTotalLength !== 'function') return;
            const length = arc.getTotalLength();
            arc.style.strokeDasharray = `${length}`;
            arc.style.strokeDashoffset = length;
            gsapLib.to(arc, {
                strokeDashoffset: 0,
                duration: 1.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: mapCard,
                    start: 'top 80%',
                    toggleActions: 'play none none none',
                },
            });
        });

        if (prefersReduced) return;

        const nodes = mapCard.querySelectorAll('.map-city');
        gsapLib.fromTo(
            nodes,
            { opacity: 0, y: 8, scale: 0.85 },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.7,
                ease: 'back.out(1.4)',
                stagger: 0.08,
                scrollTrigger: {
                    trigger: mapCard,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                },
            }
        );
    };

    // Three.js WebGL removed - "The Stillness" hero uses CSS-only animations

  const init = () => {
        initLiveCards();
        initYear();
        initMobileMenu();
        // Delay GSAP scroll animations by 3 seconds to reduce TBT
        setTimeout(initAnimations, 3000);
        setTimeout(initTexasMap, 3000);
        initParallaxMedia();
        // Three.js removed - hero now uses CSS-only animations
    };

    onReady(init);
})();
