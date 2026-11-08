import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { brands, news, topics, navigation } from './content.mjs';

const dir = new URL('./', import.meta.url);
const esc = s => s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const arrow = '<span aria-hidden="true">↗</span>';
const href = (id, l) => (l ? 'en-' : '') + id + '.html';
const brandBy = id => brands.find(b => b.id === id);
const names = Object.fromEntries([...navigation, ['index',['홈','Home']],['contact',['협업 안내','Contact']],['sitemap',['사이트맵','Sitemap']]]);
const descriptor = ['베일로 컬렉티브는 패션, 뷰티, 리빙의 감각을 탐구하는 가상의 라이프스타일 그룹입니다.','Veilo Collective is a fictional lifestyle house exploring the senses through fashion, beauty and living.'];
const logo = '<span class="monogram" aria-hidden="true"></span><span class="wordmark">VEILO<small>COLLECTIVE</small></span>';
const navLink = (id, name, l, active) => '<a href="'+href(id,l)+'"'+(active===id?' aria-current="page"':'')+'>'+name[l]+'</a>';
const pageLink = (id, name, l, cls='line-link') => '<a class="'+cls+'" href="'+href(id,l)+'">'+name[l]+arrow+'</a>';
const picture = (b,l,cls='',loading='lazy') => '<img class="'+cls+'" src="assets/'+b.image+'" alt="'+esc(b.alt[l])+'" style="--focus:'+b.position+'" loading="'+loading+'" decoding="async">';
const hdr = (id,active,l) => {
  const nav = navigation.map(([key,name])=>navLink(key,name,l,active)).join('');
  const lang = '<div class="languages" aria-label="'+(l?'Language':'언어 선택')+'"><a href="'+href(id,0)+'" hreflang="ko" lang="ko" aria-label="한국어"'+(!l?' aria-current="true"':'')+'>KO</a><a href="'+href(id,1)+'" hreflang="en" lang="en" aria-label="English"'+(l?' aria-current="true"':'')+'>EN</a></div>';
  return '<a class="skip" href="#main">'+(l?'Skip to content':'본문 바로가기')+'</a><header class="site-header"><div class="header-inner"><a class="identity" href="'+href('index',l)+'" aria-label="'+(l?'Veilo Collective home':'베일로 컬렉티브 홈')+'">'+logo+'</a><nav class="desktop-nav" aria-label="'+(l?'Main navigation':'주 메뉴')+'">'+nav+'</nav><div class="header-tools">'+lang+'<button class="menu-toggle" type="button" aria-controls="menu" aria-expanded="false" aria-label="'+(l?'Open menu':'메뉴 열기')+'"><i></i><i></i></button></div></div></header><dialog id="menu" aria-label="'+(l?'Main menu':'전체 메뉴')+'"><div class="drawer-top"><span class="identity">'+logo+'</span><button class="menu-close" aria-label="'+(l?'Close menu':'메뉴 닫기')+'">×</button></div><nav>'+nav+navLink('contact',names.contact,l,active)+'</nav></dialog>';
};
const footer = l => '<footer class="footer"><div class="wrap footer-grid"><div><a class="identity" href="'+href('index',l)+'">'+logo+'</a><p>'+descriptor[l]+'</p></div><nav>'+['company','business','news','contact','sitemap'].map(id=>navLink(id,names[id],l)).join('')+'</nav><div class="footer-address"><span>'+(l?'Illustrative location only':'학습용 예시 위치')+'</span><p>'+(l?'Dongyang Mirae University, 445 Gyeongin-ro, Guro-gu, Seoul 08221':'서울특별시 구로구 경인로 445 동양미래대학교 (08221)')+'</p><p>'+(l?'No affiliation or actual business address.':'실제 사업장이나 제휴 관계를 뜻하지 않습니다.')+'</p></div></div><div class="wrap footer-bottom"><span>© 2026 VEILO COLLECTIVE · '+(l?'Fictional concept':'창작 콘셉트')+'</span><button class="back-top">'+(l?'Back to top':'맨 위로')+' ↑</button></div></footer>';
function shell(id,active,title,l,body) {
  return '<!doctype html>\n<html lang="'+(l?'en':'ko')+'"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="'+esc(descriptor[l])+'"><meta name="theme-color" content="#f7f3ee"><title>'+esc(title)+' | VEILO COLLECTIVE</title><link rel="alternate" hreflang="'+(l?'ko':'en')+'" href="'+href(id,1-l)+'"><link rel="icon" href="assets/mark.svg" type="image/svg+xml"><link rel="stylesheet" href="site.css"><script src="site.js" defer></script></head><body'+(id==='index'?' class="home"':'')+'>'+hdr(id,active,l)+'<main id="main">'+body+'</main>'+footer(l)+'</body></html>\n';
}
const eyebrow = s => '<p class="eyebrow">'+s+'</p>';
const pageIntro = (tag,title,lead) => '<section class="page-intro wrap">'+eyebrow(tag)+'<h1>'+title+'</h1><p>'+lead+'</p></section>';
const panels = (rows,l) => '<div class="panels">'+rows.map(r=>'<article><h2>'+r[l*2]+'</h2><p>'+r[l*2+1]+'</p></article>').join('')+'</div>';
const rows = (rows,l) => '<div class="accordion">'+rows.map(r=>'<details><summary>'+r[l*2]+'<span aria-hidden="true">+</span></summary><p>'+r[l*2+1]+'</p></details>').join('')+'</div>';
const card = (b,i,l) => '<article class="brand-card" data-entry="'+b.id+'"><a href="'+href('brand-'+b.id,l)+'"><div class="brand-photo">'+picture(b,l)+'</div><div class="brand-meta"><span>0'+(i+1)+' / '+b.label[l]+'</span>'+arrow+'<h3>'+b.name[l]+'</h3></div></a></article>';
const articleCard = (n,l) => {
  const b = brandBy(n.brand);
  return '<article class="news-card" data-entry="'+n.topic+'"><a href="'+href('news-'+n.id,l)+'"><div class="news-photo">'+picture(b,l)+'</div><div class="news-meta"><span>'+topics[n.topic][l]+' · <time datetime="'+n.date.replaceAll('.','-')+'">'+n.date+'</time></span><h3>'+n.title[l]+'</h3><p>'+n.lead[l]+'</p></div></a></article>';
};
const filter = (id,items,l) => '<div class="filter-bar" data-filter-bar="'+id+'"><button type="button" data-filter="all" aria-pressed="true">'+(l?'All':'전체')+'</button>'+items.map(([key,label])=>'<button type="button" data-filter="'+key+'" aria-pressed="false">'+label[l]+'</button>').join('')+'</div>';
function home(l) {
  const titles = ['The shape of<br>everyday.','A quieter<br>ritual.','Rooms with<br>warmth.'];
  const leads = [['매일의 감각을 입고, 쓰고, 머무는 방식으로.','Dress, touch and dwell with a sense of the everyday.'],['빛과 질감으로 그린 뷰티의 새로운 장면.','A different scene for beauty, drawn in light and texture.'],['빛이 드는 자리, 온기가 머무는 물건.','The places light falls, the objects that hold warmth.']];
  return '<section class="hero" aria-label="'+(l?'Editorial campaigns':'캠페인 모음')+'"><h1 class="sr">'+(l?'Veilo Collective':'베일로 컬렉티브')+'</h1><div class="scenes">'+brands.slice(0,3).map((b,i)=>'<article class="scene '+b.id+(i?'':' is-active')+'"'+(i?' hidden':'')+'>'+picture(b,l,'hero-image',i?'lazy':'eager')+'<div class="scene-copy wrap">'+eyebrow((l?'THE VEILO EDIT':'베일로 에디트')+' / 0'+(i+1))+'<h2 lang="en">'+titles[i]+'</h2><p>'+leads[i][l]+'</p>'+pageLink('brand-'+b.id,['컬렉션 보기','Explore the collection'],l)+'</div></article>').join('')+'</div><div class="hero-bar wrap"><a href="#about" class="scroll-link">'+(l?'Discover Veilo':'베일로 소개')+' <span aria-hidden="true">↓</span></a><div class="carousel-control"><button type="button" data-prev aria-label="'+(l?'Previous campaign':'이전 캠페인')+'">←</button><span class="slide-count" aria-live="off">01 / 03</span><button type="button" data-next aria-label="'+(l?'Next campaign':'다음 캠페인')+'">→</button><button type="button" class="playback" aria-label="'+(l?'Pause slideshow':'자동 전환 멈추기')+'" aria-pressed="false">Ⅱ</button></div></div></section>'
  +'<section id="about" class="wrap about-section"><div>'+eyebrow(l?'01 / OUR PERSPECTIVE':'01 / 우리가 보는 일상')+'<h2>'+(l?'A new way to see<br>the familiar.':'익숙한 일상을,<br>새로운 감각으로.')+'</h2></div><div><p>'+(l?'What we wear, the objects we touch and the rooms we return to tell a story together. Veilo brings the perspectives of fashion, beauty and living to that story.':'몸에 닿는 옷, 손이 가는 물건, 돌아오고 싶은 공간은 함께 한 사람의 일상을 이룹니다. 베일로는 패션·뷰티·리빙이라는 서로 다른 관점으로 그 일상을 바라봅니다.')+'</p>'+pageLink('company',['베일로에 대해','About Veilo'],l)+'</div></section>'
  +'<section class="wrap portfolio section"><div class="section-head"><div>'+eyebrow(l?'02 / PORTFOLIO':'02 / 베일로 포트폴리오')+'<h2>'+(l?'Worlds we bring together.':'서로 다른 감각의 세계.')+'</h2></div>'+pageLink('business',['사업 전체 보기','Explore our businesses'],l)+'</div><div class="brand-grid home-grid">'+brands.map((b,i)=>card(b,i,l)).join('')+'</div></section>'
  +'<section class="studio-band"><div class="wrap studio-inner"><div>'+eyebrow(l?'03 / A SHARED PRACTICE':'03 / 함께 만드는 방식')+'<h2>'+(l?'More considered,<br>together.':'더 세심하게,<br>함께 만드는 일.')+'</h2><p>'+(l?'We consider how a collection is presented, described and cared for.':'컬렉션을 소개하는 방식부터 소재를 설명하고 관리하는 방법까지 살핍니다.')+'</p>'+pageLink('responsibility',['책임 경영 살펴보기','Our approach to responsibility'],l)+'</div>'+picture(brandBy('studio'),l)+'</div></section>'
  +'<section class="wrap section"><div class="section-head"><div>'+eyebrow(l?'04 / FROM THE EDIT':'04 / 베일로 소식')+'<h2>'+(l?'The Veilo Journal.':'베일로 저널.')+'</h2></div>'+pageLink('news',['모든 소식 보기','View all news'],l)+'</div><div class="news-grid">'+news.map(n=>articleCard(n,l)).join('')+'</div></section>';
}
function business(l) {
  return pageIntro('PORTFOLIO',l?'A collection of perspectives.':'서로 다른 감각의 세계.',l?'Explore the four practices of Veilo, from fashion and beauty to living and collaboration.':'패션, 뷰티, 리빙, 파트너십을 아우르는 베일로의 네 가지 사업 분야입니다.')
  +'<section class="wrap page-body" data-list="brands">'+filter('brands',brands.map(b=>[b.id,b.label]),l)+'<p class="result-count" aria-live="polite"></p><div class="brand-grid">'+brands.map((b,i)=>card(b,i,l)).join('')+'</div></section>';
}
function brand(b,l) {
  return pageIntro(b.label[l]+' / '+b.name[l],b.headline[l],b.intro[l])
  +'<figure class="wrap detail-cover">'+picture(b,l,'','eager')+'</figure><section class="wrap page-body">'+panels(b.details,l)
  +'<div class="page-links">'+pageLink('business',['사업 분야로 돌아가기','Back to businesses'],l)+pageLink('contact',['협업 방식 보기','Explore collaboration'],l)+'</div></section>';
}
function journal(l) {
  return pageIntro('JOURNAL',l?'Stories from the house.':'베일로의 장면과 소식.',l?'Read our fictional campaigns and editorial studies.':'가상의 캠페인과 에디토리얼을 모았습니다.')
  +'<section class="wrap page-body" data-list="news">'+filter('news',Object.entries(topics),l)+'<p class="result-count" aria-live="polite"></p><div class="news-grid">'+news.map(n=>articleCard(n,l)).join('')+'</div></section>';
}
function article(n,l) {
  return pageIntro(topics[n.topic][l]+' / '+n.date,n.title[l],n.lead[l])
  +'<figure class="wrap detail-cover">'+picture(brandBy(n.brand),l,'','eager')+'</figure><section class="wrap page-body">'+panels(n.body,l)
  +'<div class="page-links">'+pageLink('news',['소식 목록으로','Back to news'],l)+pageLink('brand-'+n.brand,['관련 브랜드 보기','Explore the related brand'],l)+'</div></section>';
}
const essays = {
  company:{
    intro:['COMPANY','일상의 감각을 잇는 집단.','브랜드와 사람이 만나는 순간을 소재, 이미지, 공간의 관점에서 그립니다.','A house for everyday senses.','We imagine where brands meet people, through material, image and space.'],
    cover:'living',
    rows:[['하나의 취향보다 여러 관점','패션의 움직임, 뷰티의 촉감, 리빙의 온도를 함께 살피면 일상에 대한 새로운 질문이 생깁니다.','Several points of view','Fashion brings motion, beauty brings touch, and living brings warmth. Together they raise new questions about the everyday.'],['좋은 장면의 조건','물건을 돋보이게 하는 표현과 그 물건이 놓일 환경을 같이 생각합니다. 베일로는 이 관계를 콘텐츠와 공간으로 풀어내는 가상 기업입니다.','What makes a good scene','The way an object is shown matters alongside the place it will live. Veilo is a fictional house built to explore that relationship.']]
  },
  investors:{
    intro:['INVESTORS','기업 정보의 구조.','가상 기업의 투자 정보 메뉴가 어떤 자료를 안내하는지 살펴볼 수 있습니다.','How company information is organized.','Explore the types of information an investor section can present.'],
    disclosures:true,
    rows:[['지배구조','이 페이지는 역할과 의사결정 구조를 정리하는 예시입니다. 실재 이사회·주주·임원 명단은 없습니다.','Governance','This illustrates how roles and decision-making can be described. It does not name any real board, officers or shareholders.'],['공시와 재무','공식 공시나 매출·주가·투자 실적을 제공하지 않습니다.','Disclosures and finance','No official filings, sales, share prices or investment performance are provided.'],['주주 안내','투자 모집이나 금융 상품 권유를 하지 않는 디자인 시연입니다.','Shareholder information','This design demonstration does not solicit investments or offer financial products.']]
  },
  responsibility:{
    intro:['RESPONSIBILITY','물건의 다음 장면까지.','만들고 소개하는 과정에서 소재 정보와 관리 방법을 이해하기 쉽게 전하는 방식을 탐구합니다.','Consider the next chapter.','We explore how to describe materials and care in a way people can understand.'],
    cover:'studio',
    rows:[['소재를 알아볼 수 있게','사용한 소재의 특성과 손질 방법을 제품 설명과 함께 전달하는 콘텐츠를 기획합니다.','Make materials legible','We consider how product descriptions can explain both the character of a material and how to care for it.'],['오래 두고 쓰는 관점','포장과 전시, 보관까지 물건의 쓰임을 생각합니다. 이 원칙은 디자인 방향이며 실제 인증이나 환경 실적을 뜻하지 않습니다.','A view toward longer use','Packaging, display and storage are part of an object’s life. This is a design principle, without claims of certifications or environmental performance.']]
  },
  people:{
    intro:['PEOPLE','각자의 감각으로 함께.','다른 재능이 모여 한 장면을 완성하는 라이프스타일 팀의 일을 소개합니다.','Different eyes on one scene.','Meet the kinds of roles that can bring a lifestyle editorial together.'],
    disclosures:true,
    rows:[['브랜드 에디터','소재와 브랜드의 배경을 조사하고, 사진과 문구가 하나의 이야기로 읽히도록 편집하는 직무 예시입니다.','Brand editor','A sample role researching materials and brand context, then editing photographs and words into a coherent story.'],['비주얼 디자이너','사진, 타이포그래피, 공간의 관계를 정리해 캠페인의 톤을 만드는 직무 예시입니다.','Visual designer','A sample role shaping the tone of a campaign through photography, typography and space.'],['지원 안내','가상의 직무 소개이며 실제 채용 공고나 지원 접수는 운영하지 않습니다.','Applications','These roles are fictional. No openings or application intake are offered.']]
  },
  contact:{
    intro:['CONTACT','협업을 시작하는 방법.','브랜드와 작업의 방향이 만날 수 있는 지점을 찾는 과정입니다.','Ways to begin a collaboration.','Start by finding where the direction of a brand and a project meet.'],
    disclosures:true,
    rows:[['브랜드 협업','관련 사업 분야를 살펴보고 브랜드의 방향, 협업 주제, 예상 결과물부터 정리하는 흐름입니다.','Brand collaboration','Explore the relevant business, then outline the direction, collaboration theme and intended outcome.'],['콘텐츠·미디어','캠페인과 에디토리얼의 배경은 소식 페이지에서 확인할 수 있습니다.','Content and media','The news pages provide context for the fictional campaigns and editorials.'],['개인정보 안내','이 사이트에는 접수 양식이나 실제 문의처가 없으며 입력 정보를 수집하는 기능을 제공하지 않습니다.','Privacy information','This site has no submission form or active contact details, and offers no feature that collects user input.']]
  }
};
function essay(id,l){
  const e=essays[id], [tag,t0,p0,t1,p1]=e.intro;
  return pageIntro(tag,l?t1:t0,l?p1:p0)+(e.cover?'<figure class="wrap detail-cover">'+picture(brandBy(e.cover),l,'','eager')+'</figure>':'')
  +'<section class="wrap page-body">'+(e.disclosures?rows(e.rows,l):panels(e.rows,l))
  +'<div class="page-links">'+pageLink('business',['사업 분야 보기','Explore our businesses'],l)+pageLink('news',['베일로 소식','Read the journal'],l)+'</div></section>';
}
function sitemap(l) {
  const groups = [[...navigation,...['contact'].map(x=>[x,names[x]])], brands.map(b=>['brand-'+b.id,b.name]), news.map(n=>['news-'+n.id,n.title])];
  return pageIntro('INDEX',l?'Site directory.':'사이트맵.',l?'Find each section, brand and journal entry.':'기업 정보부터 브랜드 상세와 소식까지 바로 이동할 수 있습니다.')
  +'<section class="wrap page-body sitemap">'+groups.map((g,i)=>'<div><h2>'+([['기업 정보','Company'],['브랜드','Brands'],['소식 상세','Journal']][i][l])+'</h2>'+g.map(([id,label])=>pageLink(id,label,l)).join('')+'</div>').join('')+'</section>';
}
export async function buildVeiloCollective() {
  const jobs=[];
  for(const l of [0,1]){
    const add=(id,active,title,body)=>jobs.push(writeFile(new URL(href(id,l),dir),shell(id,active,title,l,body)));
    add('index','index',['베일로 컬렉티브','Veilo Collective'][l],home(l));
    add('business','business',names.business[l],business(l));
    add('news','news',names.news[l],journal(l));
    add('sitemap','sitemap',names.sitemap[l],sitemap(l));
    for(const id of Object.keys(essays))add(id,id,names[id][l],essay(id,l));
    for(const b of brands)add('brand-'+b.id,'business',b.name[l],brand(b,l));
    for(const n of news)add('news-'+n.id,'news',n.title[l],article(n,l));
  }
  await Promise.all(jobs);
  console.log('베일로 컬렉티브 '+jobs.length+'개 페이지 생성');
}
if(process.argv[1]===fileURLToPath(import.meta.url))await buildVeiloCollective();
