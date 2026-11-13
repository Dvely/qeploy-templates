import { phones, upgrade, won } from './catalog.mjs';

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const modelById = new Map(phones.map(model => [model.id, model]));
const query = new URLSearchParams(location.search);
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const bagKey = 'moren-mobile.bag.v1';

for (const trigger of $$('[data-dialog]')) {
  const dialog = document.getElementById(trigger.dataset.dialog);
  trigger.addEventListener('click', () => {
    dialog.showModal();
    dialog.querySelector('input')?.focus();
  });
}

const search = $('#model-query');
search.addEventListener('input', () => {
  const term = search.value.trim().toLowerCase();
  let count = 0;
  for (const result of $$('[data-result]')) {
    const phone = modelById.get(result.dataset.result);
    result.hidden = ![phone.name, phone.id, phone.size].join(' ').toLowerCase().includes(term);
    if (!result.hidden) count++;
  }
  $('#search-status').textContent = term ? (count ? `모델 ${count}개` : '검색 결과가 없습니다.') : '';
});

for (const carousel of $$('[data-carousel]')) {
  const track = carousel.querySelector('[data-track]');
  const [previous, next] = carousel.querySelectorAll('[data-step]');
  function sync() {
    carousel.classList.toggle('can-scroll', track.scrollWidth > track.clientWidth + 2);
    previous.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
  }
  function move(direction) {
    const [first, second] = track.children;
    if (second) track.scrollBy({left: direction * (second.getBoundingClientRect().left - first.getBoundingClientRect().left),
      behavior: reduced.matches ? 'instant' : 'smooth'});
  }
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  track.addEventListener('keydown', event => {
    if (event.target !== track || !['ArrowLeft','ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    move(event.key === 'ArrowLeft' ? -1 : 1);
  });
  track.addEventListener('scroll', sync, {passive:true});
  new ResizeObserver(sync).observe(track);
  sync();
}

const first = $('#compare-first');
const second = $('#compare-second');
if (first && second) {
  if (modelById.has(query.get('first'))) first.value = query.get('first');
  if (modelById.has(query.get('second'))) second.value = query.get('second');
  function renderCompare() {
    const selection = [first.value, second.value].map(id => modelById.get(id));
    $('#compare-result').innerHTML = selection.map(phone => `<article class="compare-card">
      <img src="assets/${phone.id}.jpg" alt=""><h2><a href="model-${phone.id}.html">${phone.name}</a></h2>
      <dl>${[['형태',phone.size],['화면',phone.display],['카메라',phone.camera],['저장 용량',phone.storage.join(' / ') + ' GB'],['예시 가격',won(phone.price)+'부터']].map(([label,value])=>`<div><dt>${label}</dt><dd>${value}</dd></div>`).join('')}</dl>
    </article>`).join('');
  }
  for (const select of [first,second]) select.addEventListener('change', () => {
    const url = new URL(location.href);
    url.searchParams.set('first', first.value);
    url.searchParams.set('second', second.value);
    history.replaceState(null, '', url);
    renderCompare();
  });
  renderCompare();
}

function getBag() {
  try {
    const value = JSON.parse(localStorage.getItem(bagKey) ?? '[]');
    if (!Array.isArray(value)) return [];
    return value.filter(item => {
      const phone = modelById.get(item?.model);
      return phone?.storage.includes(item.storage) && phone.colors.some(([name]) => name === item.color);
    }).slice(0, 24);
  } catch {
    return [];
  }
}

function saveBag(items) {
  try {
    localStorage.setItem(bagKey, JSON.stringify(items));
    return true;
  } catch {
    return false;
  }
}

const priceFor = (phone, storage) => phone.price + (storage === phone.storage[0] ? 0 : upgrade);
const form = $('#config-form');
if (form) {
  const {model,color,storage} = form.elements;
  const output = $('#config-price');
  const button = form.querySelector('button');
  let phone;
  if (modelById.has(query.get('model'))) model.value = query.get('model');
  function price() { output.textContent = won(priceFor(phone, Number(storage.value))); }
  function options() {
    phone = modelById.get(model.value);
    color.replaceChildren(...phone.colors.map(([name]) => new Option(name,name)));
    storage.replaceChildren(...phone.storage.map(n => new Option(n + ' GB',n)));
    $('#config-image').innerHTML = `<img src="assets/${phone.id}.jpg" alt="${phone.name} 대표 콘셉트 이미지"><p class="image-note">모델 대표 이미지</p>`;
    price();
  }
  model.addEventListener('change', options);
  storage.addEventListener('change', price);
  form.addEventListener('submit', event => {
    event.preventDefault();
    const items = getBag();
    if (items.length >= 24) {
      output.textContent = '쇼핑백에서 기존 구성을 먼저 정리해 주세요.';
      return;
    }
    if (saveBag([...items,{model:phone.id,color:color.value,storage:Number(storage.value)}])) location.assign('bag.html');
    else output.textContent = '이 브라우저에서 구성을 저장할 수 없습니다.';
  });
  options();
  button.disabled = false;
}

const bag = $('#bag-lines');
function renderBag() {
  const items = getBag();
  const count = $('#bag-count');
  count.hidden = items.length === 0;
  count.textContent = items.length;
  count.closest('a').setAttribute('aria-label', items.length ? `쇼핑백, ${items.length}개 구성` : '쇼핑백');
  if (!bag) return;
  $('#bag-empty').hidden = items.length > 0;
  let total = 0;
  bag.innerHTML = items.map((item, index) => {
    const phone = modelById.get(item.model);
    const amount = priceFor(phone,item.storage);
    total += amount;
    return `<article class="bag-line"><img src="assets/${phone.id}.jpg" alt=""><div>
      <h2><a href="model-${phone.id}.html">${phone.name}</a></h2><p>${item.color} · ${item.storage} GB · ${won(amount)}</p></div>
      <button type="button" data-remove="${index}" aria-label="${phone.name} 구성 삭제">삭제</button></article>`;
  }).join('');
  $('#bag-total').textContent = items.length ? '예시 합계 ' + won(total) : '';
}
bag?.addEventListener('click', event => {
  const button = event.target.closest('[data-remove]');
  if (!button) return;
  const items = getBag();
  items.splice(Number(button.dataset.remove),1);
  if (!saveBag(items)) {
    $('#bag-total').textContent = '이 브라우저에서 구성을 삭제할 수 없습니다.';
    return;
  }
  renderBag();
  (bag.querySelector('button') ?? $('#bag-empty a')).focus({preventScroll:true});
});
window.addEventListener('storage', event => { if (event.key === bagKey || event.key === null) renderBag(); });
renderBag();
