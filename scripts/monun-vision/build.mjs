import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { carousel, cta, editorial, entries, header, img, productCard, writeIndustrySite } from '../industry-sites/build.mjs';
import { vision } from './content.mjs';

const arrow = '<span aria-hidden="true">↗</span>';

function newsList() {
  const filters = ['전체', ...new Set(vision.stories.map(item => item.type))];
  return `<div class="filters" aria-label="뉴스 분류">
      ${filters.map(type => `<button type="button" data-news-filter="${type}" aria-pressed="${type === '전체'}">${type}</button>`).join('')}
    </div>
    <div class="cards" id="news-cards">
      ${vision.stories.map(item => `<article class="product-card" data-news-type="${item.type}"><a class="product-link" href="story-${item.id}.html">
        <div class="card-media">${img(item.image)}</div><div class="card-text"><p class="eyebrow">${item.type}</p>
        <h3>${item.title}</h3><p>${item.summary}</p><span class="card-arrow" aria-hidden="true">↗</span></div></a></article>`).join('')}
    </div><p id="news-status" class="sr-only" role="status"></p>`;
}

function features() {
  return `<section class="section wrap" id="highlights"><div class="section-title"><h2>영상 솔루션의 구성</h2></div>
    <div class="feature-grid">
      <article class="feature-main">${img('technology')}<div><h3>렌즈에서 기록까지</h3><p>촬영·전송·검색이 이어지는 영상 기술</p>${cta('technology.html', '기술 알아보기')}</div></article>
      <a class="feature-small" href="products.html?type=네트워크%20카메라">${img('dome')}<div><h3>네트워크 카메라</h3><p>공간에 맞는 외형과 시야</p><span>${arrow}</span></div></a>
      <a class="feature-small" href="product-desk.html">${img('recorder')}<div><h3>영상 관리</h3><p>구역별 보기와 기록 검색</p><span>${arrow}</span></div></a>
    </div></section>`;
}

function reel() {
  return `<section class="product-band"><div class="wrap section" data-reel>
      <div class="section-title"><div><h2>제품 살펴보기</h2><p>카메라, 레코더, 영상 관리 도구를 비교해 보세요.</p></div>${cta('products.html', '제품 전체 보기')}</div>
      <div class="reel-tools" aria-label="제품 목록 이동"><button class="icon-button" type="button" data-reel-step="-1" aria-label="이전 제품" disabled>‹</button><button class="icon-button" type="button" data-reel-step="1" aria-label="다음 제품" disabled>›</button></div>
      <div class="product-reel" id="featured-products" tabindex="0" aria-label="추천 제품">${vision.products.map(productCard).join('')}</div>
    </div></section>`;
}

function caseHref(id) { return 'case-' + id + '.html'; }

function industry() {
  return `<section class="wrap section" id="industries">
    <div class="section-title"><div><h2>산업별 적용 사례</h2><p>공간을 선택하고 영상 장비를 배치하는 방법을 살펴보세요.</p></div>${cta('applications.html', '산업 전체 보기')}</div>
    <div class="industry-tabs filters" aria-label="산업 선택">${vision.applications.map((item, i) =>
      `<button type="button" data-industry="${item.id}" aria-controls="industry-${item.id}" aria-pressed="${i === 0}">${item.title}</button>`).join('')}</div>
    ${vision.applications.map((item, i) => `<article class="industry-panel" id="industry-${item.id}"${i ? ' hidden' : ''}>
      ${img(item.image)}<div><h3>${item.title}</h3><p>${item.text}</p>${cta(caseHref(item.id), '사례 보기', true)}</div></article>`).join('')}
  </section>`;
}

function home() {
  return `${carousel(vision, '<a class="hero-scroll" href="#highlights">솔루션 살펴보기 <span aria-hidden="true">↓</span></a>')}
  ${features()}${reel()}${industry()}
  <section class="section wrap"><div class="section-title"><div><h2>뉴스 및 인사이트</h2><p>제품 가이드와 현장 노트를 살펴보세요.</p></div>${cta('news.html', '기사 전체 보기')}</div>${newsList()}</section>
  <section class="resource-band"><div class="wrap"><div><h2>제품 자료와 도입 지원</h2><p>예시 사양을 내려받거나 검토 내용을 정리할 수 있습니다.</p></div>
    <div class="actions">${cta('resources.html', '자료 다운로드', true)}${cta('support.html#inquiry', '도입 문의 미리보기')}</div></div></section>
  <details class="vision-quick"><summary>빠른 메뉴</summary><nav aria-label="빠른 메뉴">
    <a href="products.html">제품 찾기 ${arrow}</a><a href="resources.html">자료 다운로드 ${arrow}</a><a href="support.html#inquiry">도입 문의 ${arrow}</a>
  </nav></details>`;
}

function cases() {
  return `${header('솔루션', '산업별 영상 솔루션', '교통, 물류, 상업 시설의 예시를 살펴보세요.')}
  <section class="wrap section applications"><h2 class="sr-only">산업별 사례 목록</h2>${vision.applications.map(item => `<section id="${item.id}">
    ${img(item.image)}<div><h2>${item.title}</h2><p>${item.text}</p>${cta(caseHref(item.id), '사례 상세 보기')}</div></section>`).join('')}</section>`;
}

function caseDetail(item) {
  return `${header('적용 사례', item.title, item.text)}
    <div class="wrap section editorial"><a class="back" href="applications.html">‹ 산업별 솔루션</a>
    ${img(item.image, item.title + ' 환경 예시', true)}
    <section class="value-grid" aria-label="설계 검토 항목">${item.checks.map(([title, text]) => `<article><h2>${title}</h2><p>${text}</p></article>`).join('')}</section>
    <div class="actions">${cta('product-' + item.product + '.html', '예시 제품 보기', true)}${cta('support.html#inquiry', '도입 문의 미리보기')}</div></div>`;
}

function resourcePage() {
  return `${header('지원', '자료 다운로드', '모눈비전 가상 제품의 검토 항목을 텍스트 파일로 내려받을 수 있습니다.')}
  <section class="section wrap"><h2 class="sr-only">제품 자료</h2><div class="resource-list">${vision.products.map(p => `<article><div>
    <p class="eyebrow">${p.code} · ${p.type}</p><h3><a href="product-${p.id}.html">${p.title}</a></h3></div>
    <a class="button" download href="resources/${p.code}.txt" aria-label="${p.title} 예시 자료 다운로드">TXT 내려받기 <span aria-hidden="true">↓</span></a></article>`).join('')}</div></section>`;
}

export async function buildMonunVision(root) {
  const pages = entries(vision, home()).map(page => {
    if (page[0] === 'applications') return [page[0], page[1], cases(), page[3], page[4]];
    if (page[0] === 'news') return ['news', '뉴스 및 이벤트', header('뉴스룸', '뉴스 및 인사이트') + '<section class="wrap section"><h2 class="sr-only">기사 목록</h2>' + newsList() + '</section>', 'news', '기술 노트, 제품 가이드, 현장 인사이트'];
    return page;
  });
  for (const [id, title] of [['learning', '학습'], ['partners', '파트너']]) {
    pages.push([id, title, editorial(title, vision[id]), id, vision[id].text]);
  }
  pages.push(['resources', '자료 다운로드', resourcePage(), 'support', '제품별 예시 사양 텍스트 자료']);
  for (const item of vision.applications) {
    pages.push(['case-' + item.id, item.title, caseDetail(item), 'applications', item.text]);
  }

  const directory = path.join(root, 'templates', vision.id, 'src', 'resources');
  await Promise.all([
    writeIndustrySite(root, vision, pages),
    ...vision.products.map(p => writeFile(path.join(directory, p.code + '.txt'),
      [vision.brand + ' | ' + p.title, p.code + ' · ' + p.type, '', p.detail, '',
        ...p.facts.map(([title, value]) => title + ' — ' + value), '', '이 자료는 가상 제품의 탐색용 예시입니다.', ''].join('\n'))),
  ]);
}
