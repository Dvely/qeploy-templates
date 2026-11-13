import { writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { groups } from './content.mjs';

const brand = '브리온 모빌리티';
const arrow = '<span aria-hidden="true">↗</span>';
const mark = '<img src="assets/mark.svg" alt="" width="38" height="38">';
const logo = `<a class="brand" href="index.html" aria-label="${brand} 홈">${mark}<span>BRION <small>MOBILITY</small></span></a>`;
const panels = [
  ['home', '첫 화면'], ['overview', '회사 소개'], ['collaboration', '협업 방식'], ['inquiry', '문의'],
];
const cta = (href, title, primary = false) => `<a class="cta${primary ? ' primary' : ''}" href="${href}">${title} ${arrow}</a>`;
const picture = (file, eager = false) => `<img src="assets/${file}.jpg" alt="" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'}>`;

function footer() {
  return `<footer class="footer" id="footer"><div class="wrap footer-inner">
    <div>${logo}<p>차량 소프트웨어 기업 웹사이트 시연</p></div>
    <nav aria-label="푸터 메뉴">${groups.map(g => `<a href="${g.id}.html">${g.name}</a>`).join('')}<a href="contact.html">문의 미리보기</a></nav>
    <small>© 2026 브리온 모빌리티</small></div></footer>`;
}

function menu(active) {
  return `<dialog class="drawer" id="site-menu" aria-labelledby="menu-title"><div class="drawer-top">
    <h2 id="menu-title">전체 메뉴</h2><form method="dialog"><button class="icon" aria-label="메뉴 닫기">×</button></form>
    </div><nav aria-label="전체 메뉴">
    ${groups.map(g => `<details${g.id === active ? ' open' : ''}><summary>${g.name}<span aria-hidden="true"></span></summary>
      <ul><li><a href="${g.id}.html">전체 보기 ${arrow}</a></li>${g.pages.map(p => `<li><a href="${p.id}.html">${p.title}</a></li>`).join('')}</ul>
    </details>`).join('')}
    <a class="drawer-contact" href="contact.html">문의 미리보기 ${arrow}</a></nav>
  </dialog>`;
}

function layout(page, title, content, group = '') {
  const home = page === 'index';
  return `<!doctype html>
<html lang="ko"${home ? ' class="home-root"' : ''}>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#202035">
  <meta name="description" content="브리온 모빌리티의 차량 소프트웨어, 제어기, 연결과 충전 기술을 살펴보세요.">
  <title>${title} | ${brand}</title>
  <link rel="icon" href="assets/mark.svg" type="image/svg+xml">
  <link rel="stylesheet" href="site.css">
  <script type="module" src="site.mjs"></script>
</head>
<body${home ? ' class="home-page"' : ''}>
  <a class="skip" href="#main">본문으로 바로가기</a>
  <header class="header"><div class="header-inner">${logo}
    <div class="head-actions"><a class="header-contact" href="${home ? '#inquiry' : 'contact.html'}">문의하기 ${arrow}</a>
    <button class="icon menu-trigger" type="button" aria-label="전체 메뉴 열기" aria-controls="site-menu"><span></span><span></span></button></div>
  </div></header>
  ${menu(group)}
  <main id="main" tabindex="-1">${content}</main>
  ${footer()}${home ? `\n  <div class="home-controls">
    <nav aria-label="홈 섹션" class="panel-nav">${panels.map(([id, label], i) => `<a href="#${id}" aria-label="${label}"${i === 0 ? ' aria-current="location"' : ''}></a>`).join('')}</nav>
    <a class="step-link" href="#overview">아래로 이동 <span aria-hidden="true">↓</span></a>
    </div>` : ''}
  <div class="floating"><a href="${home ? '#inquiry' : 'contact.html'}" class="help" aria-label="문의하기 바로가기">?</a><a href="${home ? '#home' : '#main'}" class="back-top" aria-label="맨 위로">↑</a></div>
</body>
</html>
`;
}

function contactForm() {
  return `<form class="inquiry-form" data-inquiry>
    <p class="form-note">연락처 없이 예시 내용을 작성하면 화면에서 요약을 확인할 수 있습니다.</p>
    <div class="form-grid">
      <label>조직명 <span>(선택)</span><input name="organization" maxlength="80" placeholder="예: 차량 개발팀"></label>
      <label>문의 분야<select name="topic" required><option value="">선택해 주세요</option>${groups[0].pages.map(p => `<option value="${p.id}">${p.title}</option>`).join('')}</select></label>
    </div>
    <label>검토 내용<textarea name="message" rows="4" maxlength="400" required placeholder="예: 차량 제어기 도입 과정에서 검토할 항목이 궁금합니다."></textarea></label>
    <button type="submit" class="cta primary" disabled>문의 미리보기 ${arrow}</button>
    <div class="inquiry-result" hidden tabindex="-1"><h3>문의 요약</h3><p></p></div>
  </form>`;
}

function home() {
  const topics = groups[0].pages;
  return `<section class="panel hero dark" id="home" data-panel>
    ${picture('hero', true)}
    <div class="wrap hero-inner"><div class="hero-copy">
      <p class="eyebrow">차량 소프트웨어와 제어기</p>
      <h1>움직임을 설계하는<br>차량 소프트웨어.</h1>
      <p>차량 제어와 연결, 전기차 충전을 하나의 개발 흐름에서 살펴봅니다.</p>
      ${cta('business.html', '사업 분야 살펴보기', true)}
    </div></div>
  </section>
  <section class="panel overview" id="overview" data-panel>
    <div class="wrap centered"><h2>브리온 모빌리티 소개</h2>
    <p class="lead">차량 기능을 설계하고 검증한 뒤 현장에 적용하는 과정에서 필요한 기술을 소개합니다.</p>
    <div class="overview-grid">
      ${[['5', '사업 분야', 'business.html'], ['3', '기술 자료', 'resources.html'], ['3', '협업 역할', 'partnership.html'], ['3', '개발 단계', 'about.html']].map(([count, label, href]) => `<a href="${href}"><span>${label}</span><strong>${count}</strong><span aria-hidden="true">↗</span></a>`).join('')}
    </div>${cta('about.html', '회사 소개 보기')}</div>
  </section>
  <section class="panel collaboration dark" id="collaboration" data-panel>
    ${picture('workshop')}
    <div class="wrap centered"><h2>설계부터 운영까지 함께</h2>
    <p class="lead">차량 제조, 부품 개발과 시험, 현장 운영에서 맡는 역할을 나누고 연결합니다.</p>
    <div class="roles">${[['차량 설계', '기능과 사용 조건 정의'], ['부품 개발', '제어기와 통신 기능 개발'], ['시험·운영', '시스템 검증과 현장 적용']].map(([title, text]) => `<article><h3>${title}</h3><p>${text}</p></article>`).join('')}</div>
    ${cta('partnership.html', '협업 방식 보기')}</div>
  </section>
  <section class="panel contact" id="inquiry" data-panel><div class="wrap contact-layout">
    <div><h2>도입 문의</h2><p class="lead">검토하려는 차량 기능과 사업 분야를 선택해 문의 내용을 정리해 보세요.</p>
      <div class="topic-links">${topics.map(p => `<a href="contact.html?topic=${p.id}">${p.title} ${arrow}</a>`).join('')}</div>
    </div>
    ${contactForm()}
  </div></section>`;
}

function subHero(group, title, intro, image) {
  return `<section class="sub-hero dark">${picture(image, true)}<div class="wrap">
    <p class="eyebrow">${group}</p><h1>${title}</h1><p>${intro}</p>
  </div></section>`;
}

function groupPage(group) {
  return `${subHero(group.name, group.title, group.intro, group.pages[0].image)}
    <section class="wrap section" aria-label="${group.name} 목록"><div class="card-grid">${group.pages.map(p => `<article class="card"><a href="${p.id}.html">
      ${picture(p.image)}<div><h2>${p.title}</h2><p>${p.intro}</p><span aria-hidden="true">↗</span></div>
    </a></article>`).join('')}</div></section>`;
}

function demo() {
  return `<div class="demo" data-demo><div class="demo-controls" aria-label="시연 단계 선택">
    ${['설계', '검토', '인계'].map((label, i) => `<button type="button" data-stage="${i}" aria-pressed="${i === 0}" aria-controls="stage-${i}">${label}</button>`).join('')}
  </div>${groups[1].pages[2].blocks.map(([label, text], i) => `<article id="stage-${i}"${i ? ' hidden' : ''}><h2>${label}</h2><p>${text}</p></article>`).join('')}</div>`;
}

function detail(group, p) {
  const body = p.id === 'demo' ? demo() : `<div class="detail-grid">
    ${p.blocks.map(([label, text]) => `<article><h2>${label}</h2><p>${text}</p></article>`).join('')}
  </div>`;
  return `${subHero(group.name, p.title, p.intro, p.image)}
    <section class="wrap section" aria-label="${p.title} 상세"><a class="back" href="${group.id}.html">‹ ${group.name} 전체 보기</a>
    ${body}
    ${group.id === 'business' ? `<div class="detail-actions">${cta('contact.html?topic=' + p.id, '이 분야 문의 미리보기', true)}</div>` : ''}
    </section>`.replace(/^[ \t]+$/gm, '');
}

export async function buildBrionMobility() {
  const pages = [['index', '홈', home(), ''], ['contact', '도입 문의', `<section class="wrap section contact-layout standalone"><div><h1>도입 문의</h1><p class="lead">관심 분야와 검토 사항을 정리하고 문의 요약을 확인하세요.</p></div>${contactForm()}</section>`, '']];
  for (const group of groups) {
    pages.push([group.id, group.name, groupPage(group), group.id]);
    for (const p of group.pages) pages.push([p.id, p.title, detail(group, p), group.id]);
  }
  await Promise.all(pages.map(([id, title, content, group]) =>
    writeFile(new URL(id + '.html', import.meta.url), layout(id, title, content, group))));
  console.log(`${brand}: ${pages.length}개 페이지 생성`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await buildBrionMobility();
