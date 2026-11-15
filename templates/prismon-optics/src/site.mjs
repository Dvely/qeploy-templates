import { searchIndex } from './search-index.mjs';

const motion = matchMedia('(prefers-reduced-motion: reduce)');
for (const button of document.querySelectorAll('[data-dialog]')) {
  const dialog = document.getElementById(button.dataset.dialog);
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-controls', dialog.id);
  button.addEventListener('click', () => {
    dialog.showModal();
    button.setAttribute('aria-expanded', 'true');
    dialog.querySelector('input')?.focus();
  });
  dialog.addEventListener('close', () => button.setAttribute('aria-expanded', 'false'));
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
}

const query = document.querySelector('#query');
query.addEventListener('input', () => {
  const term = query.value.trim().toLocaleLowerCase('ko-KR');
  const results = document.querySelector('#results');
  const matches = term ? searchIndex.filter(item => (item.title + ' ' + item.words).toLocaleLowerCase('ko-KR').includes(term)) : [];
  results.replaceChildren(...matches.map(item => {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = item.href;
    link.textContent = item.title;
    li.append(link);
    return li;
  }));
  document.querySelector('#search-status').textContent = !term ? '찾으려는 내용을 입력하세요.' :
    matches.length ? `검색 결과 ${matches.length}개` : '검색 결과가 없습니다.';
});

const hero = document.querySelector('.hero');
if (hero) {
  const slides = [...hero.querySelectorAll('.slide')];
  const controls = hero.querySelector('.hero-controls');
  const toggle = hero.querySelector('[data-play]');
  const previous = hero.querySelector('[data-previous]');
  const next = hero.querySelector('[data-next]');
  let active = 0;
  let running = !motion.matches;
  let pointerInside = false;
  let touch;
  let timer;

  function queue() {
    clearTimeout(timer);
    if (running && !pointerInside && !hero.contains(document.activeElement) && !document.hidden) {
      timer = setTimeout(() => render(active + 1, false), 8500);
    }
  }

  function render(index, announce = true) {
    active = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => { slide.hidden = i !== active; });
    hero.querySelector('#slide-number').textContent = String(active + 1).padStart(2, '0');
    controls.style.setProperty('--slide-progress', (active + 1) / slides.length);
    if (announce) hero.querySelector('#slide-status').textContent = slides[active].querySelector('h2').textContent;
    queue();
  }

  function setRunning(value) {
    running = value;
    toggle.setAttribute('aria-label', running ? '배너 자동 전환 정지' : '배너 자동 전환 시작');
    toggle.textContent = running ? 'Ⅱ' : '▷';
    queue();
  }

  previous.addEventListener('click', () => render(active - 1));
  next.addEventListener('click', () => render(active + 1));
  toggle.addEventListener('click', () => setRunning(!running));
  controls.addEventListener('keydown', event => {
    if (!['ArrowLeft','ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    render(active + (event.key === 'ArrowLeft' ? -1 : 1));
  });
  hero.addEventListener('pointerenter', event => {
    if (event.pointerType === 'mouse') { pointerInside = true; queue(); }
  });
  hero.addEventListener('pointerleave', event => {
    if (event.pointerType === 'mouse') { pointerInside = false; queue(); }
  });
  hero.addEventListener('focusin', queue);
  hero.addEventListener('focusout', () => requestAnimationFrame(queue));
  hero.addEventListener('touchstart', event => { touch = event.touches[0]; }, {passive:true});
  hero.addEventListener('touchcancel', () => { touch = null; }, {passive:true});
  hero.addEventListener('touchend', event => {
    if (!touch) return;
    const end = event.changedTouches[0];
    const dx = end.clientX - touch.clientX;
    const dy = end.clientY - touch.clientY;
    touch = null;
    if (Math.abs(dx) > 52 && Math.abs(dx) > Math.abs(dy) * 1.5) render(active + (dx < 0 ? 1 : -1));
  }, {passive:true});
  document.addEventListener('visibilitychange', queue);
  motion.addEventListener('change', () => setRunning(!motion.matches));
  setRunning(running);
}

const track = document.querySelector('.news-track');
if (track) {
  const [previous, next] = document.querySelectorAll('[data-news]');
  function sync() {
    previous.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
  }
  for (const button of [previous, next]) {
    button.addEventListener('click', () => {
      const [first, second] = track.children;
      track.scrollBy({left:(second.offsetLeft - first.offsetLeft) * Number(button.dataset.news),
        behavior:motion.matches ? 'instant' : 'smooth'});
    });
  }
  track.addEventListener('scroll', sync, {passive:true});
  new ResizeObserver(sync).observe(track);
  sync();
}

const inquiry = document.querySelector('#inquiry');
if (inquiry) {
  inquiry.querySelector('button').disabled = false;
  const { topic, message } = inquiry.elements;
  message.addEventListener('input', () => message.setCustomValidity(''));
  inquiry.addEventListener('submit', event => {
    event.preventDefault();
    if (!message.value.trim()) {
      message.setCustomValidity('검토 내용을 입력하세요.');
      message.reportValidity();
      return;
    }
    const result = document.querySelector('#inquiry-result');
    result.textContent = topic.value + '\n' + message.value.trim();
    result.hidden = false;
    result.focus();
  });
}
