// 추천/랭킹 탭 · 카테고리 · 검색으로 상품을 걸러 보여준다.
// 카드에 data-category, data-rank, data-name 만 맞추면 이 파일은 고치지 않아도 된다.
const tabs = document.querySelectorAll('.tab');
const filters = document.querySelectorAll('.filter');
const products = [...document.querySelectorAll('.product')];
const grid = document.querySelector('.products');
const empty = document.querySelector('.empty');
const search = document.querySelector('#q');

const state = { sort: 'recommend', category: 'all', query: '' };

function apply() {
  if (!grid) return;
  const q = state.query.trim().toLowerCase();
  let shown = 0;

  // 추천은 처음 적어 둔 순서, 랭킹은 data-rank 오름차순. DOM 을 옮기므로 원본 배열은 그대로 둔다.
  const ordered = state.sort === 'rank'
    ? products.slice().sort((a, b) => Number(a.dataset.rank ?? 99) - Number(b.dataset.rank ?? 99))
    : products;

  ordered.forEach((card) => grid.append(card));

  products.forEach((card) => {
    const byCat = state.category === 'all' || card.dataset.category === state.category;
    const byQuery = !q || (card.dataset.name ?? '').toLowerCase().includes(q);
    const match = byCat && byQuery;
    card.hidden = !match;
    if (match) shown += 1;
  });

  if (grid) grid.dataset.sort = state.sort;
  if (empty) empty.hidden = shown > 0;
}

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((other) => other.setAttribute('aria-selected', String(other === tab)));
    state.sort = tab.dataset.sort ?? 'recommend';
    apply();
  });
});

filters.forEach((button) => {
  button.addEventListener('click', () => {
    filters.forEach((other) => other.setAttribute('aria-pressed', String(other === button)));
    state.category = button.dataset.filter ?? 'all';
    apply();
  });
});

document.querySelector('.search')?.addEventListener('submit', (event) => {
  event.preventDefault();
  state.query = search?.value ?? '';
  apply();
});

search?.addEventListener('input', () => {
  state.query = search.value;
  apply();
});

// 바로가기는 해당 분류 필터를 켜고 상품 목록으로 스크롤한다.
document.querySelectorAll('[data-jump]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const category = link.dataset.jump;
    const target = [...filters].find((button) => button.dataset.filter === category);
    target?.click();
    document.querySelector('#products')?.scrollIntoView({ behavior: 'smooth' });
  });
});

// 하트는 카드 링크로 가지 않고 찜만 토글한다.
document.querySelectorAll('.wish').forEach((button) => {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    const on = button.getAttribute('aria-pressed') !== 'true';
    button.setAttribute('aria-pressed', String(on));
    button.setAttribute('aria-label', on ? '찜 해제' : '찜하기');
  });
});

// 오늘 자정까지 남은 시간을 보여준다. 서버 시각이 없으니 브라우저 로컬 날짜를 쓴다.
const timer = document.querySelector('[data-timer]');

function pad(n) {
  return String(n).padStart(2, '0');
}

function tick() {
  if (!timer) return;
  const end = new Date();
  end.setHours(24, 0, 0, 0);
  const left = Math.max(0, end.getTime() - Date.now());
  const h = Math.floor(left / 3_600_000);
  const m = Math.floor((left % 3_600_000) / 60_000);
  const s = Math.floor((left % 60_000) / 1_000);
  timer.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
}

tick();
setInterval(tick, 1000);
