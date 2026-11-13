import { writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { phones, features, won } from './catalog.mjs';

const image = (id, alt = '', eager = false) => `<img src="assets/${id}.jpg" alt="${alt}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'}>`;
const nav = [
  ['스마트폰','index.html'], ['모델 비교','compare.html'],
  ['액세서리','accessories.html'], ['기기 지원','guide.html'],
];
const mark = '<a class="brand" href="index.html" aria-label="모렌 모바일 홈"><img src="assets/mark.svg" width="25" height="25" alt=""><span>MOREN</span></a>';
const link = (href, label, filled = false) => `<a class="${filled ? 'pill' : 'text-link'}" href="${href}">${label}${filled ? '' : ' <span aria-hidden="true">›</span>'}</a>`;
const product = phone => 'model-' + phone.id + '.html';
const configure = phone => 'configure.html?model=' + phone.id;

function frame(title, content) {
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="theme-color" content="#f8f7fa">
  <meta name="description" content="모렌 모바일 스마트폰과 액세서리를 둘러보고 모델을 비교해 보세요.">
  <title>${title} | 모렌 모바일</title>
  <link rel="icon" href="assets/mark.svg" type="image/svg+xml">
  <link rel="stylesheet" href="site.css">
  <script type="module" src="site.mjs"></script>
</head>
<body>
  <a class="skip" href="#main">본문으로 바로가기</a>
  <header class="top"><div class="top-inner">${mark}
    <nav class="desktop-nav" aria-label="주요 메뉴">${nav.map(([name, href]) => `<a href="${href}">${name}</a>`).join('')}</nav>
    <div class="top-actions">
      <button class="icon" type="button" data-dialog="search-dialog" aria-label="검색 열기"><svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="10" cy="10" r="6"/><path d="m14.5 14.5 5 5"/></svg></button>
      <a class="icon" href="bag.html" aria-label="쇼핑백"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 7h14v13H5zM9 7V5a3 3 0 0 1 6 0v2"/></svg><span id="bag-count" hidden></span></a>
      <button class="icon menu-trigger" type="button" data-dialog="menu-dialog" aria-label="메뉴 열기"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 9h16M4 15h16"/></svg></button>
    </div></div></header>
  <dialog id="menu-dialog" aria-labelledby="menu-title"><div class="dialog-heading"><h2 id="menu-title">메뉴</h2><form method="dialog"><button class="icon close" aria-label="메뉴 닫기">×</button></form></div>
    <nav class="dialog-links" aria-label="전체 메뉴">${nav.map(([name, href]) => `<a href="${href}">${name}</a>`).join('')}</nav></dialog>
  <dialog id="search-dialog" aria-labelledby="search-title"><div class="dialog-heading"><h2 id="search-title">모델 검색</h2><form method="dialog"><button class="icon close" aria-label="검색 닫기">×</button></form></div>
    <input id="model-query" aria-label="모델 이름" type="search" placeholder="예: 모렌 폴드" maxlength="60"><p id="search-status" role="status"></p>
    <nav class="dialog-links" aria-label="검색 결과">${phones.map(p => `<a data-result="${p.id}" href="${product(p)}">${p.name}</a>`).join('')}</nav></dialog>
  <main id="main" tabindex="-1">${content}</main>
  <footer class="footer"><div class="wrap">${mark}<p>모렌 모바일은 제품을 탐색하고 구성을 비교하는 가상 브랜드입니다.</p>
    <nav aria-label="푸터 메뉴">${nav.map(([name, href]) => `<a href="${href}">${name}</a>`).join('')}<a href="bag.html">쇼핑백</a></nav><small>© 2026 모렌 모바일</small></div></footer>
</body>
</html>
`;
}

const arrows = label => `<div class="rail-controls" aria-label="${label} 조작">
  <button class="round" type="button" data-step="-1" aria-label="${label} 이전" disabled>‹</button>
  <button class="round" type="button" data-step="1" aria-label="${label} 다음" disabled>›</button></div>`;

function modelStrip() {
  const items = [...phones.map(p => [p.id, p.name, product(p)]), ['transfer','비교하기','compare.html'], ['gear','액세서리','accessories.html'], ['finish','기기 지원','guide.html']];
  return `<section class="model-strip" data-carousel aria-label="모델 빠른 탐색">
    <nav class="rail quick-rail" data-track tabindex="0" aria-label="모델 바로가기">${items.map(([id, name, href]) =>
      `<a href="${href}">${image(id)}<span>${name}</span></a>`).join('')}</nav>${arrows('모델 목록')}
  </section>`;
}

function campaigns() {
  return `<section class="campaign" data-carousel aria-label="추천 스마트폰"><div class="rail campaign-rail" data-track tabindex="0" aria-label="가로 배너">
    ${phones.slice(0,2).map((p,i) => `<article class="campaign-card ${i ? 'campaign-dark' : 'campaign-light'}">
      <div class="campaign-top"><div><h2>${p.name}</h2><p>${p.brief}</p></div>
      <div class="actions">${link(product(p),'더 알아보기',true)}${link(configure(p),'구성 보기')}</div></div>
      ${image(i ? 'hero-studio' : 'hero-fold', p.name + ' 콘셉트 제품 이미지', i === 0)}</article>`).join('')}
  </div>${arrows('캠페인')}</section>`;
}

function featureRail() {
  return `<section class="section soft" aria-labelledby="features-title"><div class="wrap"><h2 id="features-title">모렌을 알아보세요.</h2></div>
    <div class="feature-section" data-carousel><div class="rail feature-rail" data-track tabindex="0" aria-label="기능 둘러보기">
    ${features.map(f => `<article class="feature-card">${image(f.image)}<div><h3>${f.title}</h3><p>${f.subtitle}</p></div>
      <button class="round" type="button" data-dialog="feature-${f.id}" aria-label="${f.title} 자세히">+</button></article>`).join('')}
    </div>${arrows('기능 카드')}</div>
    ${features.map(f => `<dialog class="feature-dialog" id="feature-${f.id}" aria-labelledby="feature-title-${f.id}">
      <div class="dialog-heading"><h2 id="feature-title-${f.id}">${f.title}</h2><form method="dialog"><button class="icon close" aria-label="기능 닫기">×</button></form></div>
      ${image(f.image)}${f.steps.map(([title, text]) => `<article><h3>${title}</h3><p>${text}</p></article>`).join('')}
    </dialog>`).join('')}
  </section>`;
}

function lineup() {
  return `<section class="section wrap" id="lineup"><div class="section-head"><h2>라인업 살펴보기.</h2>${link('compare.html','모델 비교하기')}</div>
    <div class="lineup">${phones.map(p => `<article><a href="${product(p)}" aria-label="${p.name} 상세 보기">${image(p.id)}</a>
      <div class="swatches" aria-label="색상">${p.colors.map(([name, hex]) => `<span title="${name}" style="--swatch:${hex}"><span class="sr-only">${name}</span></span>`).join('')}</div>
      <h3>${p.name}</h3><p>${p.brief}</p><strong>${won(p.price)}부터</strong>
      <div class="actions">${link(product(p),'더 알아보기',true)}${link(configure(p),'구성 보기')}</div>
      <dl><div><dt>화면</dt><dd>${p.display}</dd></div><div><dt>카메라</dt><dd>${p.camera}</dd></div></dl></article>`).join('')}</div>
  </section>`;
}

const home = () => `<div class="announcement">모델별 색상과 저장 용량을 둘러보세요. ${link('#lineup','모든 모델 보기')}</div>
  <div class="wrap opening"><h1>모렌 스마트폰</h1></div>${modelStrip()}${campaigns()}${featureRail()}${lineup()}
  <section class="section soft"><div class="wrap"><div class="section-head"><h2>모렌과 함께 쓰는 제품.</h2>${link('accessories.html','액세서리 보기')}</div>
    <article class="accessory-preview">${image('gear','케이스와 충전 액세서리')}<div><h3>케이스와 충전 용품</h3><p>모델에 맞는 보호와 충전 구성을 확인하세요.</p>${link('accessories.html','더 알아보기')}</div></article>
  </div></section>`;

function details(p) {
  return `<div class="product-bar"><div class="wrap"><strong>${p.name}</strong><div class="actions">${link('compare.html','비교하기')}${link(configure(p),'구성 보기',true)}</div></div></div>
    <section class="section wrap detail"><div class="detail-copy"><h1>${p.name}</h1><p class="subtitle">${p.brief}</p><p>${p.text}</p><strong>${won(p.price)}부터</strong>
    <div class="actions">${link(configure(p),'구성 보기',true)}${link('compare.html?first='+p.id,'모델 비교')}</div></div>
    ${image(p.id,p.name+' 콘셉트 제품 이미지',true)}</section>
    <section class="section soft"><div class="wrap"><h2>주요 사양</h2><div class="spec-grid">
      ${[['화면',p.display],['카메라',p.camera],['저장 용량',p.storage.join(' / ')+' GB'],['색상',p.colors.map(c=>c[0]).join(' / ')]].map(([label,value])=>`<div><p>${label}</p><strong>${value}</strong></div>`).join('')}
    </div></div></section>`;
}

const options = selected => phones.map(p => `<option value="${p.id}"${p.id === selected ? ' selected' : ''}>${p.name}</option>`).join('');
const compare = () => `<section class="section wrap"><div class="sub-head"><h1>모델 비교하기.</h1><p>두 모델을 선택해 화면, 카메라, 저장 용량과 예시 가격을 비교하세요.</p></div>
  <div class="compare-controls"><label>첫 번째 모델<select id="compare-first">${options('fold')}</select></label><label>두 번째 모델<select id="compare-second">${options('studio')}</select></label></div>
  <div id="compare-result" class="compare-result"></div></section>`;
const config = () => `<section class="section wrap"><div class="sub-head"><h1>나에게 맞는 구성.</h1><p>색상과 용량을 고르고 쇼핑백에서 예시 금액을 확인하세요.</p></div>
  <div class="config-layout"><div id="config-image"></div><form id="config-form"><label>모델<select name="model">${options('fold')}</select></label>
  <label>색상<select name="color"></select></label><label>저장 용량<select name="storage"></select></label>
  <output id="config-price"></output><button class="pill" type="submit" disabled>쇼핑백에 담기</button></form></div></section>`;
const bag = () => `<section class="section wrap"><div class="sub-head"><h1>쇼핑백.</h1><p>구성과 예시 금액을 확인하는 화면입니다.</p></div>
  <div id="bag-lines"></div><div id="bag-empty" class="empty" hidden><p>아직 담은 제품이 없습니다.</p>${link('index.html#lineup','라인업 보기',true)}</div>
  <p id="bag-total" role="status"></p></section>`;
const accessories = () => `<section class="section wrap"><div class="sub-head"><h1>액세서리.</h1><p>모델에 맞는 케이스와 충전 용품을 고를 때 확인할 사항입니다.</p></div>
  <article class="accessory-preview">${image('gear','케이스와 충전 액세서리',true)}<div><h2>휴대와 충전을 위한 기본 구성</h2>
    <p>케이스를 고를 때는 모델별 화면 크기와 버튼 위치를, 충전 용품은 기기의 연결 단자를 확인하세요.</p>${link('compare.html','모델 비교')}</div></article></section>`;
const guide = () => `<section class="section wrap"><div class="sub-head"><h1>기기 지원.</h1><p>모델을 고르거나 새 기기를 시작할 때 참고할 안내입니다.</p></div>
  <div class="faq">${features.map(f=>`<details><summary>${f.title}</summary>${f.steps.map(([label,text])=>`<h2>${label}</h2><p>${text}</p>`).join('')}</details>`).join('')}</div></section>`;

export async function buildMorenMobile() {
  const pages = [
    ['index','스마트폰',home()], ['compare','모델 비교',compare()], ['configure','구성 보기',config()],
    ['bag','쇼핑백',bag()], ['accessories','액세서리',accessories()], ['guide','기기 지원',guide()],
    ...phones.map(p=>['model-'+p.id,p.name,details(p)]),
  ];
  await Promise.all(pages.map(([slug,title,body])=>writeFile(new URL(slug+'.html',import.meta.url),frame(title,body))));
  console.log(`모렌 모바일: ${pages.length}개 페이지 생성`);
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) await buildMorenMobile();
