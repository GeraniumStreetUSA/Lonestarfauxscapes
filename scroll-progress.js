// scroll-progress.js — Desktop-only scroll progress bar + scroll cue hide
(function() {
  if (window.__LSFS_MOBILE_PERF_MODE) return;

  var bar = document.querySelector('.hm-progress-bar');
  var cue = document.querySelector('.hm-scroll-cue');
  if (!bar) return;

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function() {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = docHeight > 0 ? scrollTop / docHeight : 0;
      bar.style.transform = 'scaleX(' + Math.min(progress, 1) + ')';

      if (cue && scrollTop > 100) {
        cue.classList.add('hm-hidden');
      }
      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
