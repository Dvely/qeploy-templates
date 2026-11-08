(() => {
  'use strict';
  const $ = (q, root = document) => root.querySelector(q);
  const $$ = (q, root = document) => [...root.querySelectorAll(q)];
  const en = document.documentElement.lang === 'en';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const header = $('.site-header');
  const updateHeader = () => header.classList.toggle('solid', window.scrollY > 36);
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
  $('.back-top').addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduced.matches ? 'instant' : 'smooth' }));

  const menu = $('#menu'), toggle = $('.menu-toggle');
  toggle.addEventListener('click', () => {
    menu.showModal();
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
  });
  $('.menu-close', menu).addEventListener('click', () => menu.close());
  menu.addEventListener('click', e => {
    if (e.target !== menu) return;
    const bounds = menu.getBoundingClientRect();
    if (e.clientX < bounds.left || e.clientX > bounds.right || e.clientY < bounds.top || e.clientY > bounds.bottom) menu.close();
  });
  menu.addEventListener('close', () => {
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    if (toggle.offsetWidth) toggle.focus();
  });
  matchMedia('(max-width:900px)').addEventListener('change', e => {
    if (!e.matches && menu.open) menu.close();
  });

  const hero = $('.hero');
  if (hero) {
    const slides = $$('.scene', hero), display = $('.slide-count'), playback = $('.playback');
    let current = 0, paused = reduced.matches, timer, inView = true;
    const show = next => {
      current = (next + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        slide.hidden = i !== current;
        slide.classList.toggle('is-active', i === current);
      });
      display.textContent = String(current + 1).padStart(2, '0') + ' / ' + String(slides.length).padStart(2, '0');
    };
    function schedule() {
      clearTimeout(timer);
      if (paused || menu.open || !inView || document.hidden || hero.matches(':focus-within')) return;
      timer = setTimeout(() => { show(current + 1); schedule(); }, 9000);
    }
    function updatePlayback() {
      playback.setAttribute('aria-pressed', String(paused));
      playback.setAttribute('aria-label', paused ? (en ? 'Resume slideshow' : '자동 전환 재생') : (en ? 'Pause slideshow' : '자동 전환 멈추기'));
      playback.textContent = paused ? '▷' : 'Ⅱ';
      schedule();
    }
    $('[data-prev]').addEventListener('click', () => { show(current - 1); schedule(); });
    $('[data-next]').addEventListener('click', () => { show(current + 1); schedule(); });
    playback.addEventListener('click', () => { paused = !paused; updatePlayback(); });
    hero.addEventListener('focusin', schedule);
    hero.addEventListener('focusout', () => queueMicrotask(schedule));
    document.addEventListener('visibilitychange', schedule);
    reduced.addEventListener('change', e => { if (e.matches) { paused = true; updatePlayback(); } });
    toggle.addEventListener('click', schedule);
    menu.addEventListener('close', schedule);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; schedule(); }, { threshold: 0.25 }).observe(hero);
    }
    updatePlayback();
  }

  $$('[data-list]').forEach(section => {
    const buttons = $$('[data-filter]', section), entries = $$('[data-entry]', section);
    const count = $('.result-count', section);
    function filter(key) {
      let visible = 0;
      entries.forEach(entry => {
        entry.hidden = key !== 'all' && entry.dataset.entry !== key;
        if (!entry.hidden) visible++;
      });
      buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === key)));
      count.textContent = en ? visible + (visible === 1 ? ' item' : ' items') : visible + '개 항목';
    }
    buttons.forEach(button => button.addEventListener('click', () => filter(button.dataset.filter)));
    filter('all');
  });
})();
