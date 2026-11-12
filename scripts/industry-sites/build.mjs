import { copyFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { components, depth } from './content.mjs';

const arrow = '<span aria-hidden="true">↗</span>';
const searchIcon = '<svg aria-hidden="true" width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/></svg>';
const menuIcon = '<svg aria-hidden="true" width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 6h18M3 12h18M3 18h18"/></svg>';
const img = (name, alt = '', eager = false) =>
  `<img src="assets/${name}.jpg" alt="${alt}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'}>`;

function logo(site) {
  return `<a class="brand" href="index.html" aria-label="${site.brand} 홈"><img src="assets/mark.svg" width="35" height="35" alt=""><span>${site.wordmark}</span></a>`;
}

function links(site, active) {
  return site.nav.map(([label, slug]) =>
    `<a href="${slug}.html"${active === slug ? ' aria-current="page"' : ''}>${label}</a>`).join('');
}

function menuLinks(site, active) {
  return site.nav.map(([label, slug]) => {
    const current = active === slug ? ' aria-current="page"' : '';
    const details = slug === 'products'
      ? [ ...site.products.map(p => [p.title, 'product-' + p.id + '.html']), ['적용 분야', 'applications.html'] ]
      : slug === 'news' ? site.stories.map(s => [s.title, 'story-' + s.id + '.html'])
      : slug === 'about' && site.theme === 'depth' ? [['직무 안내', 'careers.html']] : [];
    const items = [...(site.menu?.[slug] ?? []), ...details];
    return `<div class="menu-group"><a href="${slug}.html"${current}>${label}</a>${items.length
      ? `<ul>${items.map(([name, href]) => `<li><a href="${href}">${name}</a></li>`).join('')}</ul>` : ''}</div>`;
  }).join('');
}

function searchForm(label, placeholder, target = 'search', name = 'q') {
  return `<form class="search-form" action="${target}.html" role="search">
    <input name="${name}" type="search" placeholder="${placeholder}" aria-label="${label}" maxlength="80"><button aria-label="${label} 실행">${searchIcon}</button>
  </form>`;
}

function shell(site, page, title, content, active = page) {
  const suggestions = site.products.map(p =>
    `<a href="product-${p.id}.html">${p.title} ${arrow}</a>`).join('');
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${site.description}">
  <meta name="theme-color" content="${site.themeColor ?? (site.theme === 'depth' ? '#101b19' : '#16182c')}">
  <title>${title} | ${site.brand}</title>
  <link rel="icon" href="assets/mark.svg" type="image/svg+xml">
  <link rel="stylesheet" href="base.css">
  <link rel="stylesheet" href="theme.css">
  <script type="module" src="site.mjs"></script>${site.extraModule ? '\n  <script type="module" src="' + site.extraModule + '"></script>' : ''}
</head>
<body class="${site.theme}${page === 'index' ? ' home-page' : ''}">
  <a href="#main" class="skip">본문으로 바로가기</a>
  <header class="site-header">
    <div class="wrap head-inner">
      ${logo(site)}
      <nav class="top-nav" aria-label="주요 메뉴">${links(site, active)}</nav>
      <div class="head-actions">
        <button class="icon-button" type="button" data-dialog="site-search" aria-label="검색 열기">${searchIcon}</button>
        <button class="icon-button" type="button" data-dialog="site-menu" aria-label="전체 메뉴 열기">${menuIcon}</button>
      </div>
    </div>
  </header>
  <dialog id="site-search" class="site-dialog" aria-labelledby="site-search-title">
    <div class="dialog-top"><h2 id="site-search-title">사이트 검색</h2><form method="dialog"><button class="icon-button" aria-label="검색 닫기">×</button></form></div>
    ${searchForm('사이트 검색', '제품, 품번, 기술 자료 검색')}
    <nav class="suggestions" aria-label="주요 제품">${suggestions}</nav>
  </dialog>
  <dialog id="site-menu" class="site-dialog menu-dialog" aria-labelledby="site-menu-title">
    <div class="dialog-top"><h2 id="site-menu-title">전체 메뉴</h2><form method="dialog"><button class="icon-button" aria-label="메뉴 닫기">×</button></form></div>
    <nav class="menu-grid" aria-label="전체 메뉴">${menuLinks(site, active)}</nav>
  </dialog>
  <main id="main" tabindex="-1">${content}</main>
  <footer class="footer"><div class="wrap footer-inner">
    <div>${logo(site)}<p>${site.description}</p></div>
    <nav aria-label="푸터 메뉴">${links(site)}</nav>
    <small>© 2026 ${site.brand} · 기업 웹사이트 시연</small>
    <a class="to-top" href="#main">맨 위로 <span aria-hidden="true">↑</span></a>
  </div></footer>
</body>
</html>
`;
}

function cta(href, text, solid = false) {
  return `<a href="${href}" class="button${solid ? ' solid' : ''}">${text} ${arrow}</a>`;
}

function header(tag, title, text = '') {
  return `<section class="sub-hero"><div class="wrap"><p class="eyebrow">${tag}</p><h1>${title}</h1>${text ? `<p>${text}</p>` : ''}</div></section>`;
}

function productCard(product) {
  return `<article class="product-card" data-product data-code="${product.code}" data-type="${product.type}">
    <a class="product-link" href="product-${product.id}.html">
      <div class="card-media">${img(product.image)}</div>
      <div class="card-text"><p class="eyebrow">${product.type} <span>${product.code}</span></p><h3>${product.title}</h3><p>${product.summary}</p><span class="card-arrow" aria-hidden="true">↗</span></div>
    </a>
  </article>`;
}

function stories(site) {
  return `<div class="stories">${site.stories.map(item => `<article class="story"><a href="story-${item.id}.html">
    ${img(item.image)}<div><p class="eyebrow">${item.type}</p><h3>${item.title}</h3><p>${item.summary}</p></div><span class="card-arrow" aria-hidden="true">↗</span></a>
  </article>`).join('')}</div>`;
}

function carousel(site, afterControls = '') {
  return `<section class="hero" aria-label="주요 기술 소개" aria-roledescription="캐러셀">
    <h1 class="sr-only">${site.brand}</h1>
    ${site.hero.map((slide, index) => `<article class="slide slide-${slide.image}"${index ? ' hidden' : ''} aria-roledescription="슬라이드" aria-label="${index + 1} / ${site.hero.length}">
      ${img(slide.image, '', index === 0)}<div class="wrap slide-content"><p class="eyebrow">${slide.tag}</p>
      <h2>${slide.title.join('<br>')}</h2><p class="slide-description">${slide.text}</p>${cta(slide.href, slide.action)}</div>
    </article>`).join('')}
    <div class="wrap hero-nav">
      <div class="hero-tabs" aria-label="슬라이드 선택">${site.hero.map((item, index) =>
        `<button type="button" data-slide="${index}" aria-current="${index === 0}">${item.tag}</button>`).join('')}</div>
      <div class="hero-actions">
        <button class="icon-button" type="button" data-prev aria-label="이전 슬라이드">‹</button>
        <button class="icon-button" type="button" data-play aria-label="자동 전환 일시 정지"><span aria-hidden="true">Ⅱ</span></button>
        <button class="icon-button" type="button" data-next aria-label="다음 슬라이드">›</button>
      </div><span class="sr-only" id="slide-status" role="status"></span>
    </div>${afterControls}
  </section>`;
}

function productSection(site) {
  return `<section class="section wrap" id="products"><div class="section-title"><div><h2>${site.theme === 'depth' ? '제품 라인업' : '제품 정보'}</h2>
    <p>${site.theme === 'depth' ? '작업 공간에 맞는 거리 측정 방식을 찾아보세요.' : '부품 종류를 고르거나 품번으로 찾을 수 있습니다.'}</p></div>${cta('products.html', '전체 제품')}</div>${site.theme === 'components' ? '\n    ' + searchForm('품번 검색', '품번 입력 (예: GC-C102)', 'products', 'part') : ''}
    <div class="cards">${site.products.map(productCard).join('')}</div>
  </section>`;
}

function supportBand(site) {
  return `<section class="support-band"><div class="wrap"><div><h2>${site.theme === 'depth' ? '설치 조건을 검토하고 있나요?' : '제품을 찾는 데 도움이 필요하신가요?'}</h2>
    <p>제품 비교와 자주 묻는 질문을 확인하세요.</p></div>${cta('support.html', '지원 센터', true)}</div></section>`;
}

function depthHome(site) {
  const hero = site.hero[0];
  return `<section class="hero depth-hero" aria-label="깊이결 라이다 소개"><article class="slide">
    ${img(hero.image, '', true)}<div class="wrap slide-content"><p class="eyebrow">${hero.tag}</p>
    <h1>${hero.title.join('<br>')}</h1><p class="slide-description">${hero.text}</p>
    <div class="actions">${cta(hero.href, hero.action, true)}${cta('support.html', '기술 지원')}</div></div>
  </article><div class="wrap depth-hero-bottom"><a href="#products">제품 라인업 <span aria-hidden="true">↓</span></a></div></section>
  <section class="depth-intro"><div class="wrap"><h2>${site.about.title}</h2>${cta('about.html', '깊이결 소개')}</div></section>
  ${productSection(site)}
  <section class="application-band depth-industries"><div class="wrap section">
    <div class="section-title"><div><h2>라이다가 쓰이는 공간</h2><p>적용 분야별로 센서가 읽는 정보를 살펴보세요.</p></div></div>
    <div class="industry-tabs filters" aria-label="산업 선택">
      ${site.applications.map((item, i) => `<button type="button" data-industry="${item.id}" aria-controls="industry-${item.id}" aria-pressed="${i === 0}">${item.title}</button>`).join('')}
    </div>
    ${site.applications.map((item, i) => `<article class="industry-panel" id="industry-${item.id}"${i ? ' hidden' : ''}>${img(item.image)}
      <div><h3>${item.title}</h3><p>${item.text}</p>${cta('applications.html#' + item.id, '적용 사례 보기', true)}</div></article>`).join('')}
  </div></section>
  <section class="section wrap"><div class="section-title"><div><h2>기술</h2><p>${site.technology.title}</p></div>${cta('technology.html', '기술 자세히')}</div>
    <div class="value-grid">${site.technology.cards.map(([title, text]) => `<article><h3>${title}</h3><p>${text}</p></article>`).join('')}</div></section>
  <section class="section wrap"><div class="section-title"><h2>기술 소식</h2>${cta('news.html', '전체 소식')}</div>${stories(site)}</section>
  <section class="support-band"><div class="wrap"><div><h2>공간 인식을 만드는 직무</h2><p>광학, 소프트웨어, 현장 적용 역할을 알아보세요.</p></div>${cta('careers.html', '직무 안내', true)}</div></section>`;
}

function home(site) {
  if (site.theme === 'depth') return depthHome(site);
  const notices = site.stories.map(item => `<a href="story-${item.id}.html">${item.title} ${arrow}</a>`).join('');
  return `${carousel(site)}
    <aside class="notice-bar"><div class="wrap"><strong>새 소식</strong><div>${notices}</div></div></aside>
    ${productSection(site)}
    <section class="application-band"><div class="wrap application-inner">${img('facility')}<div><p class="eyebrow">지속가능성</p><h2>제조 과정에서<br>무엇을 살피는가.</h2><p>환경, 작업 현장, 공급 과정에서 확인할 항목을 소개합니다.</p>${cta('sustainability.html', '지속가능성 살펴보기', true)}</div></div></section>
    <section class="section wrap"><div class="section-title"><h2>뉴스룸</h2>${cta('news.html', '전체 소식')}</div>${stories(site)}</section>
    ${supportBand(site)}`;
}

function catalog(site) {
  return `${header('제품정보', site.theme === 'depth' ? '라이다 제품' : '전자부품 제품군', '제품 이름이나 품번으로 찾고, 제품군별로 비교할 수 있습니다.')}
  <section class="section wrap" aria-label="제품 목록">
    <form id="product-search" class="search-form" action="products.html" role="search">
      <input type="search" name="part" aria-label="제품 이름 또는 품번" placeholder="예: ${site.products[0].code}" maxlength="80">
      <button aria-label="제품 검색 실행">${searchIcon}</button>
    </form>
    <div class="filters" aria-label="제품군">
      ${['전체', ...new Set(site.products.map(p => p.type))].map(type => `<button type="button" data-filter="${type}" aria-pressed="${type === '전체'}">${type}</button>`).join('')}
    </div>
    <p id="product-count" class="count" role="status"></p><h2 class="sr-only">제품 검색 결과</h2>
    <div class="cards" id="product-list">${site.products.map(productCard).join('')}</div>
    <p class="empty" id="no-products" hidden>검색 결과가 없습니다. 다른 제품 이름이나 품번을 입력하세요.</p>
  </section>`;
}

function detail(site, product) {
  return `${header(product.type, product.title, product.summary)}
    <div class="wrap section">
      <a class="back" href="products.html">‹ 전체 제품</a>
      <section class="detail"><div class="detail-image">${img(product.image, product.title + ' 콘셉트 이미지', true)}</div>
      <div class="detail-copy"><p class="eyebrow">${product.code}</p><h2>구성과 특징</h2><p>${product.detail}</p>
      <dl class="facts">${product.facts.map(([key, value]) => `<div><dt>${key}</dt><dd>${value}</dd></div>`).join('')}</dl>
      <p class="fine-print">이 페이지의 모델과 품번은 제품 탐색 시연을 위한 예시입니다.</p>
      <div class="actions">${cta('applications.html#' + product.application, '관련 적용 분야')}${cta('support.html?product=' + product.id + '#inquiry', '기술 문의 미리보기', true)}</div></div></section>
    </div>`;
}

function applications(site) {
  return `${header('적용 분야', site.theme === 'depth' ? '라이다가 쓰이는 공간' : '전자부품 적용 분야', '사용 환경에 따라 달라지는 제품 선택 기준을 살펴보세요.')}
    <div class="wrap section applications">${site.applications.map(item => `<section id="${item.id}">
      ${img(item.image)}<div><h2>${item.title}</h2><p>${item.text}</p>${cta('product-' + item.product + '.html', '관련 제품 보기')}</div>
    </section>`).join('')}</div>`;
}

function editorial(tag, item) {
  return `${header(tag, item.title, item.text)}<section class="section wrap editorial" aria-label="${tag} 상세">
    ${img(item.image, '', true)}<div class="value-grid">${item.cards.map(([title, text]) =>
      `<article><h2>${title}</h2><p>${text}</p></article>`).join('')}</div>
    </section>`;
}

function news(site) {
  return `${header('뉴스룸', site.theme === 'depth' ? '기술 소식' : '뉴스룸', '제품과 적용 환경을 더 깊이 알아볼 수 있는 글입니다.')}
    <section class="section wrap"><h2 class="sr-only">최신 글</h2>${stories(site)}</section>`;
}

function article(item) {
  return `${header(item.type, item.title, item.summary)}
    <article class="section wrap prose"><a class="back" href="news.html">‹ 전체 소식</a>${img(item.image, '', true)}
    ${item.paragraphs.map(text => `<p>${text}</p>`).join('')}</article>`;
}

function support(site) {
  return `${header('지원', site.theme === 'depth' ? '기술 지원' : '고객지원', '제품을 비교하고 적용 환경에 대한 질문을 정리하세요.')}
    <div class="section wrap support-content">
      <section><h2>자주 묻는 질문</h2><div class="faq">${site.faq.map(([q, a]) =>
        `<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</div>
      <h2 class="related-title">제품 자료</h2><nav aria-label="제품 자료" class="suggestions">${site.products.map(p =>
        `<a href="product-${p.id}.html">${p.title} · ${p.code} ${arrow}</a>`).join('')}</nav></section>
      <section class="inquiry" id="inquiry"><h2>문의 내용 미리보기</h2>
        <p>선택한 제품과 작성한 내용은 이 페이지에서 요약해 볼 수 있습니다.</p>
        <form id="inquiry-form"><label>제품<select name="product"><option value="general">일반 문의</option>
          ${site.products.map(p => `<option value="${p.id}">${p.title}</option>`).join('')}</select></label>
          <label>검토 내용<textarea name="note" rows="4" maxlength="400" required placeholder="예: 설치 환경과 검토 중인 연결 방식"></textarea></label>
          <button class="button solid" type="submit" disabled>문의 미리보기 ${arrow}</button>
        </form>
        <div id="inquiry-result" hidden tabindex="-1"><strong>문의 요약</strong><p id="inquiry-output"></p></div>
      </section>
    </div>`;
}

function searchPage() {
  return `${header('검색', '사이트 검색', '제품, 품번, 적용 분야와 소식을 검색할 수 있습니다.')}
    <section class="section wrap search-page">${searchForm('사이트 검색', '검색어 입력')}
      <p class="count" role="status" id="search-count"></p><ul class="search-results" id="search-results"></ul>
    </section>`;
}

function entries(site, homePage = home(site)) {
  const pages = [
    ['index', '홈', homePage, '', site.description],
    ['about', '기업 소개', editorial('기업정보', site.about), 'about', site.about.text],
    ['products', '제품정보', catalog(site), 'products', '제품 이름, 품번과 제품군으로 검색'],
    ['applications', '적용 분야', applications(site), 'applications', site.applications.map(item => item.title + ' ' + item.text).join(' ')],
    ['news', '뉴스룸', news(site), 'news', '제품과 적용 환경의 기술 소식'],
    ['support', '지원', support(site), 'support', site.faq.map(([q]) => q).join(' ')],
    ['search', '사이트 검색', searchPage(), '', ''],
    ...site.products.map(p => ['product-' + p.id, p.title, detail(site, p), 'products', `${p.code} · ${p.type} · ${p.summary}`]),
    ...site.stories.map(s => ['story-' + s.id, s.title, article(s), 'news', s.summary]),
  ];
  if (site.sustainability) pages.push(['sustainability', '지속가능성', editorial('지속가능성', site.sustainability), 'sustainability', site.sustainability.text]);
  if (site.technology) pages.push(['technology', '공간 인식 기술', editorial('기술', site.technology), 'technology', site.technology.text]);
  if (site.careers) pages.push(['careers', '채용 안내', editorial('채용', site.careers), 'careers', site.careers.text]);
  return pages;
}

export async function writeIndustrySite(root, site, pages) {
  const directory = path.join(root, 'templates', site.id, 'src');
  const index = pages.filter(([id]) => id !== 'search' && id !== 'index')
    .map(([id, title, , , text]) => ({ href: id + '.html', title, text }));
  await Promise.all([
    ...pages.map(([id, title, content, active]) => writeFile(path.join(directory, id + '.html'), shell(site, id, title, content, active))),
    writeFile(path.join(directory, 'search-index.mjs'), 'export const index = ' + JSON.stringify(index, null, 2) + ';\n'),
    copyFile(new URL('./base.css', import.meta.url), path.join(directory, 'base.css')),
    copyFile(new URL('./site.mjs', import.meta.url), path.join(directory, 'site.mjs')),
  ]);
  console.log(`${site.brand}: ${pages.length}개 페이지 생성`);
}

export async function buildIndustrySites(root) {
  for (const site of [depth, components]) await writeIndustrySite(root, site, entries(site));
}

export { carousel, cta, editorial, entries, header, img, productCard };
