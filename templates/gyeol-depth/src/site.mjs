import { index } from './search-index.mjs';

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const params = new URLSearchParams(location.search);

for (const trigger of $$('[data-dialog]')) {
  const dialog = document.getElementById(trigger.dataset.dialog);
  trigger.addEventListener('click', () => {
    dialog.showModal();
    dialog.querySelector('input')?.focus();
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const { top, right, bottom, left } = dialog.getBoundingClientRect();
    if (event.clientX < left || event.clientX > right || event.clientY < top || event.clientY > bottom) dialog.close();
  });
}

function initHero() {
  const hero = $('.hero');
  if (!hero) return;
  const slides = $$('.slide');
  const selectors = $$('[data-slide]');
  const play = $('[data-play]');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let active = 0;
  let running = !motion.matches;
  let hovered = false;
  let focused = false;
  let timer;
  let start;
  function queue() {
    clearTimeout(timer);
    if (!running || hovered || focused || document.hidden) return;
    timer = setTimeout(() => show(active + 1, false), 9000);
  }
  function updatePlay() {
    play.firstElementChild.textContent = running ? 'Ⅱ' : '▷';
    play.setAttribute('aria-label', running ? '자동 전환 일시 정지' : '자동 전환 시작');
    queue();
  }
  function show(i, announce = true) {
    active = (i + slides.length) % slides.length;
    slides.forEach((slide, position) => { slide.hidden = position !== active; });
    selectors.forEach((tab, position) => tab.setAttribute('aria-current', String(position === active)));
    if (announce) $('#slide-status').textContent = selectors[active].textContent;
    queue();
  }
  selectors.forEach((button, i) => button.addEventListener('click', () => show(i)));
  $('[data-prev]').addEventListener('click', () => show(active - 1));
  $('[data-next]').addEventListener('click', () => show(active + 1));
  play.addEventListener('click', () => { running = !running; updatePlay(); });
  hero.addEventListener('focusin', () => { focused = true; queue(); });
  hero.addEventListener('focusout', event => { focused = hero.contains(event.relatedTarget); queue(); });
  hero.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') { hovered = true; queue(); } });
  hero.addEventListener('pointerleave', event => { if (event.pointerType === 'mouse') { hovered = false; queue(); } });
  hero.addEventListener('touchstart', event => {
    const touch = event.touches[0];
    start = { x: touch.clientX, y: touch.clientY };
  }, { passive: true });
  hero.addEventListener('touchend', event => {
    if (!start) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    start = null;
    if (Math.abs(dx) > 52 && Math.abs(dx) > Math.abs(dy) * 1.5) show(active + (dx < 0 ? 1 : -1));
  }, { passive: true });
  hero.addEventListener('touchcancel', () => { start = null; }, { passive: true });
  motion.addEventListener('change', () => { running = !motion.matches; updatePlay(); });
  document.addEventListener('visibilitychange', queue);
  updatePlay();
}

function normalize(value) {
  return value.trim().toLocaleLowerCase('ko-KR');
}

function matches(value, terms) {
  const normalized = normalize(value);
  const code = normalized.replace(/[^a-z0-9]/g, '');
  return terms.every(term => normalized.includes(term) ||
    (/^[a-z]+-?\d[a-z0-9-]*$/i.test(term) && code.includes(term.replaceAll('-', ''))));
}

function termsFor(query) {
  const cleaned = normalize(query);
  return cleaned ? cleaned.split(/\s+/u) : [];
}

function initCatalog() {
  const form = $('#product-search');
  if (!form) return;
  const input = form.elements.part;
  const filters = $$('[data-filter]');
  const cards = $$('#product-list [data-product]');
  let active = filters.some(button => button.dataset.filter === params.get('type')) ? params.get('type') : '전체';
  input.value = params.get('part') ?? '';
  function update() {
    const terms = termsFor(input.value);
    let count = 0;
    for (const card of cards) {
      const match = (active === '전체' || active === card.dataset.type) &&
        matches(card.textContent + ' ' + card.dataset.code, terms);
      card.hidden = !match;
      if (match) count++;
    }
    filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === active)));
    $('#product-count').textContent = `제품 ${count}개`;
    $('#no-products').hidden = count !== 0;
  }
  function save() {
    const next = new URL(location.href);
    for (const [key, value] of [['part', input.value.trim()], ['type', active === '전체' ? '' : active]]) {
      if (value) next.searchParams.set(key, value);
      else next.searchParams.delete(key);
    }
    history.replaceState(null, '', next);
    update();
  }
  for (const button of filters) button.addEventListener('click', () => {
    active = button.dataset.filter;
    save();
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    save();
  });
  update();
}

function initSearch() {
  const results = $('#search-results');
  if (!results) return;
  const query = params.get('q') ?? '';
  $('.search-page input').value = query;
  const terms = termsFor(query);
  const entries = terms.length ? index.filter(item => matches(item.title + ' ' + item.text, terms)) : [];
  $('#search-count').textContent = terms.length ? `검색 결과 ${entries.length}개` : '제품 이름, 품번 또는 검색어를 입력하세요.';
  if (terms.length && !entries.length) {
    const item = document.createElement('li');
    item.textContent = '일치하는 페이지가 없습니다. 다른 검색어를 입력해 보세요.';
    results.append(item);
  }
  for (const item of entries) {
    const row = document.createElement('li');
    const link = document.createElement('a');
    const summary = document.createElement('p');
    link.href = item.href;
    link.textContent = item.title;
    summary.textContent = item.text;
    row.append(link, summary);
    results.append(row);
  }
}

function initInquiry() {
  const form = $('#inquiry-form');
  if (!form) return;
  const submit = form.querySelector('button');
  submit.disabled = false;
  const { product, note } = form.elements;
  const selected = params.get('product');
  if ([...product.options].some(option => option.value === selected)) product.value = selected;
  note.addEventListener('input', () => note.setCustomValidity(''));
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!note.value.trim()) {
      note.setCustomValidity('검토 내용을 입력하세요.');
      note.reportValidity();
      return;
    }
    $('#inquiry-output').textContent = product.selectedOptions[0].textContent + '\n' + note.value.trim();
    const result = $('#inquiry-result');
    result.hidden = false;
    result.focus();
  });
}

function initIndustries() {
  const options = $$('[data-industry]');
  for (const button of options) {
    button.addEventListener('click', () => {
      for (const option of options) {
        const selected = option === button;
        option.setAttribute('aria-pressed', String(selected));
        document.getElementById(option.getAttribute('aria-controls')).hidden = !selected;
      }
    });
  }
}

if ($('[data-play]')) initHero();
initIndustries();
initCatalog();
initSearch();
initInquiry();
