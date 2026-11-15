import { writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { groups, slides } from './content.mjs';

const [company, business, investors, news, esg, careers] = groups;
const photo = (id, eager = false) =>
  `<img src="assets/${id}.jpg" alt="" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'}>`;
const arrow = '<span aria-hidden="true">›</span>';
const mark = '<a class="brand" href="index.html" aria-label="프리즘온 홈"><img src="assets/mark.svg" width="29" height="29" alt="">PRISMON</a>';
const route = ([id]) => id + '.html';
const pageLink = (item, label = item[1]) => `<a href="${route(item)}">${label} ${arrow}</a>`;
const groupsNav = groups.map(group => `<a href="${group.id}.html">${group.name}</a>`).join('');
const labels = ['공시 안내','재무 정보','기업 자료실','직무 소개','일하는 환경','채용 절차'];
const symbols = ['<path d="M5 3h11l3 3v15H5zM8 9h8m-8 4h8m-8 4h6"/>','<path d="M4 20h16M7 16v-4m5 4V8m5 8V4"/>','<path d="M3 7h7l2 2h9v11H3z"/>','<circle cx="12" cy="8" r="3"/><path d="M6 21v-3a6 6 0 0 1 12 0v3"/>','<path d="M4 8h16v12H4zM9 8V5h6v3m-11 5h16"/>','<path d="M5 6h14M5 12h14M5 18h14"/><circle cx="5" cy="6" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="18" r="1"/>'];
const icon = name => `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round">${symbols[labels.indexOf(name)]}</svg>`;

function shell(title, content, active = '') {
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#f7faf8"><meta name="description" content="프리즘온의 정밀광학과 영상 모듈, 기업 자료를 살펴보세요.">
  <title>${title} | 프리즘온</title>
  <link rel="icon" type="image/svg+xml" href="assets/mark.svg">
  <link rel="stylesheet" href="site.css"><script type="module" src="site.mjs"></script>
</head>
<body>
  <a class="skip" href="#main">본문 바로가기</a>
  <header class="head"><div class="head-inner">${mark}<nav class="desktop-links" aria-label="주요 메뉴">${groupsNav}</nav>
    <div class="head-actions">
      <button type="button" class="head-search" data-dialog="search" aria-label="사이트 검색 열기"><svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/></svg></button>
      <button type="button" class="hamburger" data-dialog="menu" aria-label="전체 메뉴 열기"><span></span><span></span><span></span></button>
    </div></div></header>
  <dialog class="drawer" id="menu" aria-labelledby="menu-title">
    <div class="modal-top"><h2 id="menu-title">전체 메뉴</h2><form method="dialog"><button class="close" aria-label="메뉴 닫기">×</button></form></div>
    <nav aria-label="전체 메뉴">${groups.map(group => `<details${active === group.id ? ' open' : ''}><summary>${group.name}</summary>
    <ul><li><a href="${group.id}.html">전체 보기 ${arrow}</a></li>${group.pages.map(item => `<li>${pageLink(item)}</li>`).join('')}</ul></details>`).join('')}<a class="menu-contact" href="contact.html">문의 안내 ${arrow}</a></nav>
  </dialog>
  <dialog id="search" aria-labelledby="search-title"><div class="modal-top"><h2 id="search-title">사이트 검색</h2><form method="dialog"><button class="close" aria-label="검색 닫기">×</button></form></div>
    <label for="query">검색어</label><input type="search" id="query" maxlength="80" placeholder="예: 카메라, 채용"><p id="search-status" role="status">찾으려는 내용을 입력하세요.</p><ul id="results"></ul></dialog>
  <main id="main" tabindex="-1">${content}</main>
  <footer class="footer"><div class="container">${mark}<nav aria-label="푸터 메뉴"><a href="contact.html">문의 안내</a><a href="company.html">회사 소개</a><a href="reports.html">기업 자료실</a></nav>
    <p>정밀광학 기업 웹사이트 시연</p><small>© 2026 프리즘온</small></div></footer>
</body>
</html>
`;
}

function hero() {
  return `<section class="hero" aria-label="대표 배너" aria-roledescription="캐러셀">
    <h1 class="sr-only">프리즘온</h1>
    ${slides.map(([img,title,copy,href,cta],index) => `<article class="slide"${index ? ' hidden' : ''} aria-roledescription="슬라이드" aria-label="${index + 1} / ${slides.length}">
      ${photo(img,index === 0)}<div class="container slide-copy"><h2>${title}</h2><p>${copy}</p><a class="under-link" href="${href}">${cta} ${arrow}</a></div>
    </article>`).join('')}
    <div class="hero-controls" aria-label="배너 조작"><button class="circle" type="button" data-previous aria-label="이전 배너">‹</button>
      <span id="slide-number" aria-hidden="true">01</span><span class="progress" aria-hidden="true"><span></span></span><span aria-hidden="true">04</span>
      <button class="circle" type="button" data-next aria-label="다음 배너">›</button><button class="pause" type="button" data-play aria-label="배너 자동 전환 정지">Ⅱ</button>
      <span class="sr-only" id="slide-status" role="status"></span>
    </div>
  </section>`;
}

function shortcuts(group) {
  return `<div class="shortcuts">${group.pages.map(item => `<a href="${route(item)}">${icon(item[1])}<span>${item[1]}</span></a>`).join('')}</div>`;
}

function home() {
  return `${hero()}
  <section class="split" id="business" aria-label="사업 소개">${business.pages.map((item,i)=>`<article class="image-panel">
    ${photo(item[2])}<div><h2>${['정밀 카메라 모듈','산업 영상 솔루션'][i]}</h2><p>${item[3]}</p>
    <a class="under-link" href="${route(item)}">${item[1]} 보기 ${arrow}</a></div></article>`).join('')}</section>
  <section class="wide-panel image-panel" id="investors">${photo('meeting')}<div class="container panel-content">
    <h2>IR CENTER</h2><p>공시, 재무, 기업 자료를 한곳에서 살펴보세요.</p>${shortcuts(investors)}
  </div></section>
  <section class="news-band" id="news"><div class="container">
    <div class="section-head"><div><h2>NEWS ROOM</h2><p>프리즘온의 제품과 기술을 다루는 노트.</p></div><a href="news.html">전체 소식 ${arrow}</a></div>
    <div class="news-track" tabindex="0" aria-label="기술 소식 가로 목록">${news.pages.map(item => `<article><a href="${route(item)}">
      <p>기술 노트</p><h3>${item[1]}</h3><p>${item[3]}</p><span aria-hidden="true">↗</span></a></article>`).join('')}</div>
    <div class="news-controls"><button type="button" data-news="-1" aria-label="이전 소식" disabled>‹</button><button type="button" data-news="1" aria-label="다음 소식" disabled>›</button></div>
  </div></section>
  <section class="esg" id="esg" aria-label="ESG 경영">${esg.pages.map((item,i) => `<article class="image-panel">
    ${photo(item[2])}<div><h2>${['Environment','People','Governance'][i]}</h2><p>${item[1]}</p>
    <a class="under-link" href="${route(item)}">${item[1]} 보기 ${arrow}</a></div></article>`).join('')}</section>
  <section class="wide-panel image-panel" id="careers">${photo('lab')}<div class="container panel-content">
    <h2>CAREER</h2><p>정밀광학을 설계하고 생산하는 직무를 알아보세요.</p>${shortcuts(careers)}
    <div class="role-list"><h3>직무 분야</h3>
      ${['광학 설계','제조기술','품질 관리','사업 운영'].map((role,i) => `<a href="roles.html#role-${i}">${role} ${arrow}</a>`).join('')}
    </div></div></section>`;
}

function banner(label, title, text, image = 'campus') {
  return `<section class="sub-hero image-panel">${photo(image,true)}<div class="container">
    <p>${label}</p><h1>${title}</h1><p>${text}</p></div></section>`;
}

function groupPage(group) {
  return `${banner('프리즘온',group.name,group.description,group.pages[0][2])}
  <section class="container content-section cards" aria-label="${group.name} 항목">${group.pages.map(item => `<article><a href="${route(item)}">
    ${photo(item[2])}<div><h2>${item[1]}</h2><p>${item[3]}</p>${arrow}</div></a></article>`).join('')}</section>`;
}

function details(group, item) {
  const [id,title,image,intro,text] = item;
  const roles = [
    ['광학 설계','렌즈와 센서의 구성, 촬영 조건을 검토합니다.'],['제조기술','조립 공정의 조건과 설비의 작동을 확인합니다.'],
    ['품질 관리','검사 조건과 결과를 비교해 변경 사항을 기록합니다.'],['사업 운영','고객의 사용 조건을 설계와 제조 담당자에게 전달합니다.'],
  ];
  return `${banner(group.name,title,intro,image)}
  <section class="container content-section detail"><a class="back" href="${group.id}.html">‹ ${group.name} 전체 보기</a>
    ${photo(image)}<div class="detail-copy"><h2>${title}</h2><p>${text}</p>${id === 'reports' ? '<a class="download" href="prismon-overview.txt" download>기업 개요 예시 자료 내려받기 ↓</a>' : ''}</div>${id === 'roles' ? `\n    <div class="role-detail">${roles.map(([label,body],i) => `<article id="role-${i}"><h3>${label}</h3><p>${body}</p></article>`).join('')}</div>` : ''}
  </section>`;
}

const contact = `${banner('고객 안내','문의 안내','관심 분야를 고르고 검토 내용을 미리 정리해 보세요.','meeting')}
  <section class="container content-section"><form id="inquiry" class="inquiry"><h2>문의 미리보기</h2>
    <p>입력한 내용은 이 화면에 표시됩니다.</p>
    <label>문의 분야<select name="topic">${groups.map(group=>`<option>${group.name}</option>`).join('')}</select></label>
    <label>검토 내용<textarea name="message" rows="4" maxlength="400" required></textarea></label>
    <button type="submit" disabled>요약 보기</button><p id="inquiry-result" tabindex="-1" hidden></p>
  </form></section>`;

export async function buildPrismon() {
  const pages = [['index','홈',home(),''], ['contact','문의 안내',contact,'']];
  const search = [{href:'contact.html',title:'문의 안내',words:'문의 고객 지원'}];
  for (const group of groups) {
    pages.push([group.id,group.name,groupPage(group),group.id]);
    search.push({href:group.id+'.html',title:group.name,words:group.description});
    for (const item of group.pages) {
      pages.push([item[0],item[1],details(group,item),group.id]);
      search.push({href:route(item),title:item[1],words:group.name+' '+item[3]+' '+item[4]});
    }
  }
  await Promise.all([
    ...pages.map(([slug,title,content,active]) => writeFile(new URL(slug+'.html',import.meta.url),shell(title,content,active))),
    writeFile(new URL('search-index.mjs',import.meta.url),'export const searchIndex = '+JSON.stringify(search,null,2)+';\n'),
    writeFile(new URL('prismon-overview.txt',import.meta.url),'프리즘온 기업 개요 (시연 자료)\n\n사업 분야\n- 모바일 카메라 모듈\n- 산업 영상 솔루션\n\n개발 단계\n- 광학 구성 검토\n- 조립 조건 확인\n- 검사 기준 기록\n'),
  ]);
  console.log(`프리즘온: ${pages.length}개 화면 생성`);
}
if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) await buildPrismon();
