import { writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { categories, products, won } from './products.mjs';

const brand = '소담칸';
const logo = '<a class="logo" href="index.html" aria-label="소담칸 홈"><img src="assets/mark.svg" width="38" height="38" alt=""><span>소담칸</span></a>';
const paths = {
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/>',
  bag: '<path d="M4 8h16l-1.4 12H5.4zM9 9V6a3 3 0 0 1 6 0v3"/>',
  home: '<path d="m3 11 9-7 9 7v9H3zM9 20v-6h6v6"/>',
  heart: '<path d="M12 20s-8-4.7-8-10a4.4 4.4 0 0 1 8-2.5A4.4 4.4 0 0 1 20 10c0 5.3-8 10-8 10Z"/>',
  star: '<path d="m12 3 2.6 5.8 6.4.7-4.7 4.3 1.3 6.2-5.6-3.2L6.4 20l1.3-6.2L3 9.5l6.4-.7z"/>',
  drop: '<path d="M12 3C9 7.5 6 10.5 6 14a6 6 0 0 0 12 0c0-3.5-3-6.5-6-11ZM9 15a3 3 0 0 0 2 2"/>',
  kitchen: '<path d="M3 10h18v2a7 7 0 0 1-7 7h-4a7 7 0 0 1-7-7zM8 5l1 2m4-3 1 3m3-2 1 2"/>',
  food: '<path d="M12 21v-8c0-5 4-7 8-7 0 5-2 8-8 8m0 3c-1-6-4-8-8-8 0 5 3 8 8 8"/>',
  arrow: '<path d="M4 12h15m-6-6 6 6-6 6"/>',
  left: '<path d="m14 6-6 6 6 6"/>',
  right: '<path d="m10 6 6 6-6 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  sparkle: '<path d="M12 3v18M3 12h18M6 6l12 12M6 18 18 6"/>',
};
const icon = (name, size = 24) => `<svg aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${paths[name]}</svg>`;

const tabs = [
  ['categories', 'categories.html', 'grid', '카테고리'],
  ['shop', 'shop.html', 'search', '상품 찾기'],
  ['index', 'index.html', 'home', '홈'],
  ['saved', 'saved.html', 'heart', '찜'],
  ['cart', 'cart.html', 'bag', '장바구니'],
];

function shell(id, title, content) {
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#f7f5ed">
  <meta name="description" content="소담칸에서 주방, 욕실, 생활용품과 먹거리를 둘러보세요.">
  <title>${title} | ${brand}</title>
  <link rel="icon" href="assets/mark.svg" type="image/svg+xml">
  <link rel="stylesheet" href="shop.css">
  <script type="module" src="shop.mjs"></script>
</head>
<body>
  <a class="skip" href="#main">본문으로 건너뛰기</a>
  <div class="layout">
    <aside class="side" aria-label="소담칸 소개">
      ${logo}
      <p class="side-title">자주 쓰는 것부터<br>소담하게.</p>
      <p>주방과 욕실, 찬장에 두고<br>매일 쓰는 물건을 골랐어요.</p>
      <nav aria-label="빠른 탐색">
        <a href="shop.html?group=best">인기 상품 ${icon('arrow', 16)}</a>
        <a href="shop.html?group=new">새로 들어온 상품 ${icon('arrow', 16)}</a>
      </nav>
    </aside>
    <div class="storefront">
      <header class="header">
        ${logo}
        <nav aria-label="상단 메뉴">
          <a class="icon-link" href="shop.html#search" aria-label="검색">${icon('search')}</a>
          <a class="icon-link cart-icon" href="cart.html" aria-label="장바구니">${icon('bag')}<span data-cart-count hidden aria-hidden="true">0</span></a>
        </nav>
      </header>
      <main id="main" tabindex="-1">${content}</main>
      <footer class="footer">
        ${logo}
        <nav aria-label="하단 안내"><a href="guide.html">이용 안내</a><a href="categories.html">상품 분류</a></nav>
        <p>가상 생활용품 쇼핑몰 · 주문 미리보기</p>
        <small>© 2026 소담칸</small>
      </footer>
      <nav class="dock" aria-label="주요 메뉴">
        ${tabs.map(([key, href, glyph, name]) => `<a href="${href}"${id === key ? ' aria-current="page"' : ''}>${icon(glyph, 21)}<span>${name}</span></a>`).join('')}
      </nav>
    </div>
  </div>
  <p class="toast" role="status" aria-live="polite" aria-atomic="true"></p>
</body>
</html>
`;
}

function prices(product) {
  const off = product.was ? Math.round(100 * (product.was - product.price) / product.was) : 0;
  return `<div class="prices">${off ? `<span class="discount">${off}%</span>` : ''}<strong>${won(product.price)}</strong>${product.was ? `<del>${won(product.was)}</del>` : ''}</div>`;
}

function card(product) {
  return `<article class="product-card" data-product="${product.id}">
    <div class="card-image">
      <a href="product-${product.id}.html" aria-label="${product.title} 상세 보기"><img src="assets/${product.id}.jpg" width="438" height="438" alt="" loading="lazy"></a>
      <button type="button" class="heart" data-save="${product.id}" aria-label="${product.title} 찜" aria-pressed="false">${icon('heart', 18)}</button>
    </div>
    <div class="card-body">
      <h3><a href="product-${product.id}.html">${product.title}</a></h3>
      <p class="size">${product.size}</p>
      ${prices(product)}
      <button class="add" type="button" data-add="${product.id}" aria-label="${product.title} 담기">${icon('plus', 16)} 담기</button>
    </div>
  </article>`;
}

const quickItems = [
  ['categories.html', 'grid', '전체 분류'],
  ['shop.html?group=best', 'star', '인기'],
  ['shop.html?group=new', 'sparkle', '신상품'],
  ...categories.map(c => [`shop.html?cat=${c.id}`, c.icon, c.name]),
];

function section(title, href, items) {
  return `<section class="shop-section">
    <div class="section-top"><h2>${title}</h2><a href="${href}" aria-label="${title} 더 보기">더 보기 ${icon('right', 14)}</a></div>
    <div class="product-grid">${items.map(card).join('')}</div>
  </section>`;
}

const home = `<h1 class="sr-only">소담칸 생활용품 쇼핑몰</h1>
  <a class="strip" href="shop.html?group=new"><strong>새로 들어왔어요</strong><span>이번 입고 상품 보기</span>${icon('arrow', 16)}</a>
  <section class="campaign" aria-label="기획전">
    <div class="campaign-track" tabindex="0" aria-label="좌우로 넘기는 기획전">
      <article class="campaign-slide home-slide">
        <div class="campaign-copy"><h2>매일 쓰는<br>살림의 기본</h2><p>부엌과 욕실의 기본용품</p><a href="shop.html?cat=kitchen">주방용품 보기 ${icon('arrow', 15)}</a></div>
        <img src="assets/home.jpg" width="1350" height="900" fetchpriority="high" alt="">
      </article>
      <article class="campaign-slide pantry-slide">
        <div class="campaign-copy"><h2>찬장에 두는<br>아침 한 끼</h2><p>부담 없이 꺼내는 식료품</p><a href="shop.html?cat=food">먹거리 보기 ${icon('arrow', 15)}</a></div>
        <img src="assets/pantry.jpg" width="1350" height="900" alt="">
      </article>
    </div>
    <div class="campaign-controls" aria-label="기획전 선택">
      <button type="button" data-slide="0" aria-label="살림의 기본" aria-current="true"></button>
      <button type="button" data-slide="1" aria-label="아침 한 끼" aria-current="false"></button>
    </div>
  </section>
  <nav class="quick" aria-label="상품 바로가기">
    ${quickItems.map(([href, glyph, label]) => `<a href="${href}"><span>${icon(glyph, 22)}</span>${label}</a>`).join('')}
  </nav>
  <section class="featured" aria-labelledby="feature-title">
    <div class="section-top"><h2 id="feature-title">지금 눈여겨볼 상품</h2><a href="shop.html?group=best">인기 상품 ${icon('right', 14)}</a></div>
    <article class="featured-item">
      <a href="product-paper.html"><img src="assets/paper.jpg" width="438" height="438" alt="도톰한 주방 종이타월"></a>
      <div><h3><a href="product-paper.html">${products[0].title}</a></h3><p class="size">${products[0].size}</p>${prices(products[0])}
      <button class="add" type="button" data-add="paper" aria-label="도톰한 주방 종이타월 장바구니 담기">${icon('bag', 16)} 장바구니 담기</button></div>
    </article>
  </section>
  ${section('자주 고르는 상품', 'shop.html?group=best', products.filter(p => p.best))}
  ${section('새로 들어온 상품', 'shop.html?group=new', products.filter(p => p.fresh))}
`;

const filters = [['all', '전체'], ...categories.map(c => [c.id, c.name])];
const shop = `<section class="page-head"><h1>상품 찾기</h1></section>
  <div class="page-content">
    <form class="search" id="search" action="shop.html" role="search"><label class="sr-only" for="query">상품 검색</label><input id="query" name="q" type="search" placeholder="상품 이름 또는 카테고리 검색"><button aria-label="검색 실행">${icon('search', 20)}</button></form>
    <nav class="chips" aria-label="상품 카테고리">${filters.map(([id, label]) => `<a data-category="${id}" href="shop.html${id === 'all' ? '' : '?cat=' + id}">${label}</a>`).join('')}</nav>
    <div class="list-tools"><p id="result-count" aria-live="polite"></p><label>정렬 <select id="sort"><option value="recommended">추천순</option><option value="low">낮은 가격순</option><option value="high">높은 가격순</option></select></label></div>
    <h2 class="sr-only">상품 목록</h2>
    <div class="product-grid" id="shop-results">${products.map(card).join('')}</div>
    <div class="empty" id="no-results" hidden><h2>검색 결과가 없어요</h2><p>다른 상품 이름이나 카테고리로 찾아보세요.</p><a class="primary" href="shop.html">전체 상품 보기</a></div>
  </div>`;

const categoryPage = `<section class="page-head"><h1>카테고리</h1></section>
  <section class="page-content" aria-label="상품 분류"><div class="category-list">
  ${categories.map(c => `<a href="shop.html?cat=${c.id}"><img src="assets/${c.photo}.jpg" width="438" height="438" alt=""><div><h2>${c.name}</h2><p>${c.detail}</p></div>${icon('right', 20)}</a>`).join('')}
  </div></section>`;

const saved = `<section class="page-head"><h1>찜한 상품</h1></section>
  <div class="page-content"><h2 class="sr-only">찜 목록</h2>
    <div class="product-grid" id="saved-results">${products.map(card).join('')}</div>
    <div class="empty" id="no-saved" hidden><h2>아직 찜한 상품이 없어요</h2><a class="primary" href="shop.html">상품 둘러보기</a></div>
  </div>`;

const cart = `<section class="page-head"><h1>장바구니</h1></section>
  <div class="page-content">
    <div id="cart-lines" class="cart-lines" aria-label="담은 상품"></div>
    <div class="empty" id="no-cart" hidden><h2>장바구니가 비어 있어요</h2><a class="primary" href="shop.html">상품 둘러보기</a></div>
    <section class="summary" id="cart-summary" hidden><h2>예상 주문 금액</h2>
      <p><span>상품 합계</span><strong id="subtotal">0원</strong></p>
      <p><span>예상 배송비</span><strong id="shipping">0원</strong></p>
      <p class="total"><span>합계</span><strong id="total">0원</strong></p>
      <button type="button" class="primary" id="review-order">주문 미리보기</button>
    </section>
  </div>
  <dialog id="order-dialog" aria-labelledby="order-title"><form method="dialog">
    <h2 id="order-title">주문 미리보기</h2><ul id="order-items"></ul><p id="order-total"></p><p class="muted">이 화면은 구매 흐름을 보여주는 시연입니다.</p>
    <button class="primary" autofocus>닫기</button>
  </form></dialog>`;

const guide = `<section class="page-head"><h1>이용 안내</h1></section><div class="page-content guide">
  <details open><summary>상품은 어떻게 찾나요?</summary><p>카테고리를 고르거나 검색창에 상품 이름을 입력하면 상품을 찾을 수 있어요.</p></details>
  <details><summary>찜과 장바구니는 어디에 저장되나요?</summary><p>현재 브라우저에 저장됩니다. 브라우저의 사이트 데이터를 지우면 목록도 함께 지워집니다.</p></details>
  <details><summary>결제와 배송은 어떻게 진행되나요?</summary><p>이곳은 가상 쇼핑몰 시연입니다. 주문 미리보기에서 상품과 예상 금액을 확인할 수 있어요.</p></details>
</div>`;

function detail(p) {
  const c = categories.find(category => category.id === p.category);
  const similar = products.filter(item => item.category === p.category && item.id !== p.id);
  return `<div class="page-content detail">
    <a class="back" href="shop.html?cat=${c.id}">${icon('left', 17)} ${c.name} 둘러보기</a>
    <div class="detail-media"><img src="assets/${p.id}.jpg" width="438" height="438" alt="${p.title}"><button type="button" class="heart" data-save="${p.id}" aria-label="${p.title} 찜" aria-pressed="false">${icon('heart')}</button></div>
    <h1>${p.title}</h1><p class="size">${p.size}</p>${prices(p)}
    <p class="description">${p.description}</p>
    <form class="product-form" data-buy="${p.id}">
      <label for="quantity">수량</label><select id="quantity" name="quantity">${Array.from({length: 9}, (_, i) => `<option>${i + 1}</option>`).join('')}</select>
      <output id="detail-total" aria-label="상품 합계">${won(p.price)}</output>
      <button class="primary">${icon('bag', 19)} 장바구니 담기</button>
    </form>
    <p class="muted shipping-note">예상 배송비 3,000원 · 상품 합계 30,000원 이상 무료</p>
  </div>${similar.length ? section('함께 볼 만한 상품', 'shop.html?cat=' + p.category, similar) : ''}`;
}

export async function buildSodamKan() {
  const pages = [
    ['index', '생활용품과 먹거리', home],
    ['categories', '카테고리', categoryPage],
    ['shop', '상품 찾기', shop],
    ['saved', '찜한 상품', saved],
    ['cart', '장바구니', cart],
    ['guide', '이용 안내', guide],
    ...products.map(p => ['product-' + p.id, p.title, detail(p)]),
  ];
  await Promise.all(pages.map(([id, title, content]) =>
    writeFile(new URL(`${id}.html`, import.meta.url), shell(id, title, content))));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await buildSodamKan();
}
