import { categories, products, won } from './products.mjs';

const byId = new Map(products.map(product => [product.id, product]));
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const cartKey = 'sodam-kan.cart.v1';
const savedKey = 'sodam-kan.saved.v1';
const fallback = new Map();

function read(key, defaultValue) {
  if (fallback.has(key)) return fallback.get(key);
  try {
    const value = localStorage.getItem(key);
    return value === null ? defaultValue : JSON.parse(value);
  } catch {
    return defaultValue;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    fallback.delete(key);
  } catch {
    fallback.set(key, value);
  }
}

function getCart() {
  const value = read(cartKey, {});
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).filter(([id, qty]) =>
    byId.has(id) && Number.isInteger(qty) && qty >= 1 && qty <= 9));
}

function getSaved() {
  const value = read(savedKey, []);
  return new Set(Array.isArray(value) ? value.filter(id => byId.has(id)) : []);
}

let toastTimer;
function announce(text) {
  const toast = $('.toast');
  clearTimeout(toastTimer);
  toast.textContent = text;
  toastTimer = setTimeout(() => { toast.textContent = ''; }, 2600);
}

function refreshSaved() {
  const saved = getSaved();
  $$('[data-save]').forEach(button => {
    const product = byId.get(button.dataset.save);
    const active = saved.has(product.id);
    button.setAttribute('aria-pressed', String(active));
    button.setAttribute('aria-label', product.title + (active ? ' 찜 해제' : ' 찜'));
  });
  if ($('#saved-results')) {
    $$('#saved-results [data-product]').forEach(card => {
      card.hidden = !saved.has(card.dataset.product);
    });
    $('#no-saved').hidden = saved.size > 0;
  }
}

function refreshCount() {
  const count = Object.values(getCart()).reduce((sum, qty) => sum + qty, 0);
  $$('[data-cart-count]').forEach(badge => {
    badge.hidden = count === 0;
    badge.textContent = String(count);
    badge.closest('a').setAttribute('aria-label', count ? `장바구니, ${count}개 상품` : '장바구니');
  });
}

function add(id, qty) {
  const product = byId.get(id);
  const cart = getCart();
  const before = cart[id] ?? 0;
  const after = Math.min(9, before + qty);
  cart[id] = after;
  write(cartKey, cart);
  refreshCount();
  if (before === after) announce('상품은 최대 9개까지 담을 수 있어요.');
  else announce(`${product.title} ${after - before}개를 담았어요.`);
}

function initCampaign() {
  const track = $('.campaign-track');
  if (!track) return;
  const buttons = $$('[data-slide]');
  const slides = $$('.campaign-slide');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const currentIndex = () => Math.round(track.scrollLeft / Math.max(track.clientWidth, 1));
  const go = index => {
    const slide = slides[Math.max(0, Math.min(index, slides.length - 1))];
    track.scrollTo({left: slide.offsetLeft - slides[0].offsetLeft, behavior: reduced.matches ? 'instant' : 'smooth'});
  };
  buttons.forEach((button, index) => button.addEventListener('click', () => go(index)));
  track.addEventListener('scroll', () => {
    buttons.forEach((button, index) => button.setAttribute('aria-current', String(index === currentIndex())));
  }, {passive: true});
  track.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    go(currentIndex() + (event.key === 'ArrowRight' ? 1 : -1));
  });
}

function initCatalog() {
  const results = $('#shop-results');
  if (!results) return;
  const params = new URLSearchParams(location.search);
  const input = $('#query');
  const sort = $('#sort');
  const chips = $$('[data-category]');
  const categoryNames = new Map(categories.map(category => [category.id, category.name]));
  const cat = categoryNames.has(params.get('cat')) ? params.get('cat') : 'all';
  const group = ['new', 'best'].includes(params.get('group')) ? params.get('group') : '';
  const search = params.get('q') ?? '';
  input.value = search;
  const query = search.trim().toLocaleLowerCase('ko-KR');
  const terms = query ? query.split(/\s+/u) : [];
  const rows = new Map([...results.children].map(card => [card.dataset.product, card]));
  const matches = products.filter(product => {
    const inGroup = group === 'best' ? product.best : group === 'new' ? product.fresh : true;
    const label = `${product.title} ${product.size} ${categoryNames.get(product.category)}`.toLocaleLowerCase('ko-KR');
    return inGroup && (cat === 'all' || cat === product.category) && terms.every(term => label.includes(term));
  });
  if (group) $('.page-head h1').textContent = group === 'best' ? '인기 상품' : '새로 들어온 상품';
  const form = $('#search');
  const fields = {};
  for (const name of ['cat', 'group', 'sort']) {
    const field = document.createElement('input');
    field.type = 'hidden';
    field.name = name;
    fields[name] = field;
    form.append(field);
  }
  fields.cat.value = cat;
  fields.cat.disabled = cat === 'all';
  fields.group.value = group;
  fields.group.disabled = !group;
  sort.value = ['low', 'high'].includes(params.get('sort')) ? params.get('sort') : 'recommended';
  function show() {
    fields.sort.value = sort.value;
    fields.sort.disabled = sort.value === 'recommended';
    chips.forEach(chip => {
      const next = new URLSearchParams();
      if (group) next.set('group', group);
      if (query) next.set('q', search);
      if (!fields.sort.disabled) next.set('sort', sort.value);
      if (chip.dataset.category !== 'all') next.set('cat', chip.dataset.category);
      chip.href = 'shop.html' + (next.size ? '?' + next : '');
      chip.setAttribute('aria-current', String(chip.dataset.category === cat));
    });
    const ranked = [...matches];
    if (sort.value === 'low') ranked.sort((a, b) => a.price - b.price);
    if (sort.value === 'high') ranked.sort((a, b) => b.price - a.price);
    rows.forEach(card => { card.hidden = true; });
    for (const product of ranked) {
      const card = rows.get(product.id);
      card.hidden = false;
      results.append(card);
    }
    $('#result-count').textContent = `상품 ${matches.length}개`;
    $('#no-results').hidden = matches.length > 0;
  }
  sort.addEventListener('change', () => {
    const url = new URL(location.href);
    if (sort.value === 'recommended') url.searchParams.delete('sort');
    else url.searchParams.set('sort', sort.value);
    history.replaceState(null, '', url);
    show();
  });
  show();
  if (location.hash === '#search') input.focus({preventScroll: true});
}

function createCartLine(product, qty) {
  const row = document.createElement('article');
  row.className = 'cart-row';
  row.dataset.line = product.id;
  row.innerHTML = `<a href="product-${product.id}.html" aria-label="${product.title} 상세 보기">
      <img src="assets/${product.id}.jpg" width="74" height="74" alt="">
    </a>
    <div>
      <h2><a href="product-${product.id}.html">${product.title}</a></h2>
      <p class="size">${product.size}</p><strong>${won(product.price * qty)}</strong>
      <div class="cart-actions" aria-label="${product.title} 수량 조절">
        <button type="button" data-action="minus" aria-label="${product.title} 수량 줄이기"${qty <= 1 ? ' disabled' : ''}>−</button>
        <output aria-label="${product.title} 수량">${qty}</output>
        <button type="button" data-action="plus" aria-label="${product.title} 수량 늘리기"${qty >= 9 ? ' disabled' : ''}>+</button>
        <button type="button" class="remove" data-action="remove" aria-label="${product.title} 삭제">삭제</button>
      </div>
    </div>`;
  return row;
}

const cartLines = $('#cart-lines');
function renderCart() {
  if (!cartLines) return;
  const entries = Object.entries(getCart());
  cartLines.replaceChildren(...entries.map(([id, qty]) => createCartLine(byId.get(id), qty)));
  $('#no-cart').hidden = entries.length > 0;
  $('#cart-summary').hidden = entries.length === 0;
  const subtotal = entries.reduce((sum, [id, qty]) => sum + byId.get(id).price * qty, 0);
  const shipping = subtotal && subtotal < 30000 ? 3000 : 0;
  $('#subtotal').textContent = won(subtotal);
  $('#shipping').textContent = won(shipping);
  $('#total').textContent = won(subtotal + shipping);
}

cartLines?.addEventListener('click', event => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const id = button.closest('[data-line]').dataset.line;
  const action = button.dataset.action;
  const cart = getCart();
  if (!cart[id]) return;
  if (action === 'remove') {
    delete cart[id];
    announce('장바구니에서 상품을 삭제했어요.');
  } else {
    cart[id] = Math.min(9, Math.max(1, cart[id] + (action === 'plus' ? 1 : -1)));
  }
  write(cartKey, cart);
  renderCart();
  refreshCount();
  const sameLine = cartLines.querySelector(`[data-line="${id}"]`);
  const next = sameLine?.querySelector(`[data-action="${action}"]:not(:disabled)`) ??
    sameLine?.querySelector('[data-action]:not(:disabled)') ??
    cartLines.querySelector('[data-action="remove"]') ?? $('#no-cart a');
  next.focus({preventScroll: true});
});

$('#review-order')?.addEventListener('click', () => {
  const items = Object.entries(getCart()).map(([id, qty]) => {
    const product = byId.get(id);
    const item = document.createElement('li');
    item.textContent = `${product.title} · ${qty}개 · ${won(product.price * qty)}`;
    return item;
  });
  if (items.length === 0) return;
  $('#order-items').replaceChildren(...items);
  $('#order-total').textContent = `예상 주문 합계 ${$('#total').textContent}`;
  $('#order-dialog').showModal();
});

document.addEventListener('click', event => {
  const save = event.target.closest('[data-save]');
  if (save) {
    const id = save.dataset.save;
    const saved = getSaved();
    const active = saved.has(id);
    if (active) saved.delete(id);
    else saved.add(id);
    write(savedKey, [...saved]);
    refreshSaved();
    if (save.closest('[hidden]')) {
      const next = $('#saved-results article:not([hidden]) [data-save]') ?? $('#no-saved a');
      next.focus({preventScroll: true});
    }
    announce(active ? '찜 목록에서 뺐어요.' : '찜 목록에 저장했어요.');
  }
  const buy = event.target.closest('[data-add]');
  if (buy) add(buy.dataset.add, 1);
});

const buyForm = $('[data-buy]');
if (buyForm) {
  const quantity = buyForm.elements.quantity;
  const product = byId.get(buyForm.dataset.buy);
  quantity.addEventListener('change', () => {
    $('#detail-total').textContent = won(product.price * Number(quantity.value));
  });
  buyForm.addEventListener('submit', event => {
    event.preventDefault();
    add(product.id, Number(quantity.value));
  });
}

window.addEventListener('storage', event => {
  if (event.key === cartKey || event.key === null) {
    refreshCount();
    renderCart();
    if ($('#order-dialog')?.open) $('#order-dialog').close();
  }
  if (event.key === savedKey || event.key === null) refreshSaved();
});

initCampaign();
initCatalog();
refreshSaved();
refreshCount();
renderCart();
