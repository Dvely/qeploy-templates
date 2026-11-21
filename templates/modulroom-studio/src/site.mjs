const $ = (selector, scope=document) => scope.querySelector(selector);
const $$ = (selector, scope=document) => [...scope.querySelectorAll(selector)];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let motionPaused = false;

const menu = $('#site-menu');
const menuToggle = $('.menu-toggle');
function closeMenu() {
  menu.close();
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.focus({preventScroll:true});
}
menuToggle.addEventListener('click', () => {
  if (menu.open) return closeMenu();
  menu.showModal();
  menuToggle.setAttribute('aria-expanded', 'true');
  $('.close-menu').focus();
});
$('.close-menu').addEventListener('click', closeMenu);
menu.addEventListener('cancel', event => {event.preventDefault(); closeMenu();});
menu.addEventListener('close', () => menuToggle.setAttribute('aria-expanded','false'));
$('.back-top').addEventListener('click', () => window.scrollTo({top:0,behavior:reducedMotion.matches?'instant':'smooth'}));

const tabs = $$('[role="tab"]');
const panels = $$('[role="tabpanel"]');
let serviceIndex = 0;
let manualServiceY = null;
function selectService(index, focus=false) {
  serviceIndex = index;
  tabs.forEach((tab, i) => {
    tab.setAttribute('aria-selected', String(i===index));
    tab.tabIndex = i===index ? 0 : -1;
    panels[i].hidden = i!==index;
  });
  if (focus) tabs[index].focus();
}
tabs.forEach((tab,index) => {
  tab.addEventListener('click', () => {selectService(index); manualServiceY=scrollY;});
  tab.addEventListener('keydown', event => {
    let next=index;
    if (event.key==='ArrowRight'||event.key==='ArrowDown') next=(index+1)%tabs.length;
    else if (event.key==='ArrowLeft'||event.key==='ArrowUp') next=(index+tabs.length-1)%tabs.length;
    else if (event.key==='Home') next=0;
    else if (event.key==='End') next=tabs.length-1;
    else return;
    event.preventDefault(); selectService(next,true); manualServiceY=scrollY;
  });
});

const header = $('.header');
const progress = $('.progress');
const hero = $('.hero');
const browserObject = $('.browser-object');
const serviceScroll = $('.service-scroll');
const detail = $('.detail-section');
const sections = $$('[data-section]');
const darkSections = new Set(['SERVICES','DETAIL','BEHIND']);
function updateScroll() {
  document.body.classList.toggle('scrolled',scrollY>90);
  const available = document.documentElement.scrollHeight-innerHeight;
  const ratio = available>0 ? scrollY/available : 0;
  progress.style.setProperty('--progress',`${Math.min(100,ratio*100)}%`);
  $('small',progress).textContent=`${Math.round(ratio*100)}%`;
  const active=sections.find(section => {
    const rect=section.getBoundingClientRect();
    return rect.top<innerHeight*.4 && rect.bottom>innerHeight*.4;
  });
  if (active) {
    $('.section-name').textContent=`[ ${active.dataset.section} ]`;
    header.classList.toggle('dark',darkSections.has(active.dataset.section));
  } else header.classList.remove('dark');
  const animate=!motionPaused&&!reducedMotion.matches;
  if (browserObject) {
    const amount=Math.max(0,Math.min(1,scrollY/hero.offsetHeight));
    browserObject.style.setProperty('--hero-x',animate?`${amount*34}deg`:'0deg');
    browserObject.style.setProperty('--hero-y',animate?`${amount*-25}deg`:'0deg');
    browserObject.style.setProperty('--hero-z',animate?`${amount*-7}deg`:'0deg');
  }
  if (serviceScroll && innerWidth>640) {
    const rect=serviceScroll.getBoundingClientRect();
    if (manualServiceY!==null && Math.abs(manualServiceY-scrollY)>18) manualServiceY=null;
    if (manualServiceY===null&&rect.top<=0&&rect.bottom>=innerHeight) {
      const index=Math.min(3,Math.floor(Math.max(0,-rect.top/(rect.height-innerHeight)) * 4));
      if (index!==serviceIndex) selectService(index);
    }
  }
  if (detail && innerWidth>640) {
    const rect=detail.getBoundingClientRect();
    const amount=Math.max(0,Math.min(1,(innerHeight*.6-rect.top)/(rect.height*.7)));
    $('.detail-phone').style.setProperty('--phone-turn',animate?`${-80+amount*95}deg`:'0deg');
  }
}
let scheduled=false;
addEventListener('scroll', () => {
  if (scheduled) return;
  scheduled=true;
  requestAnimationFrame(() => {updateScroll(); scheduled=false;});
},{passive:true});
addEventListener('resize',updateScroll);
updateScroll();
const motionToggle=$('.motion-toggle');
motionToggle?.addEventListener('click', () => {
  motionPaused=!motionPaused;
  document.body.classList.toggle('motion-paused',motionPaused);
  motionToggle.setAttribute('aria-pressed',String(motionPaused));
  motionToggle.textContent=motionPaused?'모션 재생':'모션 멈춤';
  updateScroll();
});
reducedMotion.addEventListener('change',updateScroll);

// Original parametric point sculpture, drawn locally without a third-party model.
const canvas=$('.particle-art');
if (canvas) {
  const context=canvas.getContext('2d');
  let width=0,height=0,visible=false,lastTime=0,phase=0;
  function sizeCanvas() {
    const rect=canvas.getBoundingClientRect();
    width=rect.width; height=rect.height;
    const density=Math.min(devicePixelRatio||1,1.5);
    canvas.width=width*density; canvas.height=height*density;
    context.setTransform(density,0,0,density,0,0);
  }
  sizeCanvas();
  addEventListener('resize',sizeCanvas);
  new IntersectionObserver(entries => {visible=entries[0].isIntersecting;},{rootMargin:'100px'}).observe(canvas);
  const points=Array.from({length:2200},(_,i)=>{
    const u=(i%110)/110*Math.PI*2;
    const v=Math.floor(i/110)/20*Math.PI*2;
    const radius=1+.33*Math.cos(v);
    return [radius*Math.cos(u),radius*Math.sin(u),.33*Math.sin(v)];
  });
  function draw(time) {
    requestAnimationFrame(draw);
    if (!visible || document.hidden || time-lastTime<32) return;
    const paused=motionPaused||reducedMotion.matches;
    if (!paused) phase+=.004;
    lastTime=time;
    context.clearRect(0,0,width,height);
    const mobile=width<=640;
    const scale=mobile?Math.min(width*.22,100):Math.min(width*.17,height*.31);
    const centerX=width*(mobile?.5:.31),centerY=height*(mobile?.55:.53);
    const turn=phase+serviceIndex*.4;
    const c=Math.cos(turn),s=Math.sin(turn);
    const tilt=.8+Math.sin(phase*.5)*.3;
    for (let i=0;i<points.length;i+=(mobile?2:1)) {
      const [px,py,pz]=points[i];
      const x=px*c-pz*s,z=px*s+pz*c;
      const y=py*Math.cos(tilt)-z*Math.sin(tilt);
      const depth=py*Math.sin(tilt)+z*Math.cos(tilt);
      const perspective=3.2/(3.2-depth);
      const alpha=.22+(depth+1.5)/3*.65;
      context.fillStyle=`rgba(${serviceIndex===1?'185,180,255':'225,228,235'},${alpha})`;
      context.beginPath();
      context.arc(centerX+x*scale*perspective,centerY+y*scale*perspective,.75*perspective,0,Math.PI*2);
      context.fill();
    }
  }
  requestAnimationFrame(draw);
}
$('.detail-stage')?.addEventListener('pointermove',event => {
  if (event.pointerType!=='mouse') return;
  const bounds=event.currentTarget.getBoundingClientRect();
  $('.lens-reading').textContent=`X ${Math.round(event.clientX-bounds.left)}px · Y ${Math.round(event.clientY-bounds.top)}px · 화면 ${Math.round(bounds.width)}px`;
});
$('.fold-toggle')?.addEventListener('click',event => {
  const folded=$('.foldable').classList.toggle('folded');
  event.currentTarget.setAttribute('aria-pressed',String(folded));
  event.currentTarget.textContent=folded?'화면 펼쳐 보기':'화면 접어 보기';
});
$$('.operation-list details').forEach(details => details.addEventListener('toggle',()=>{
  if(details.open) $$('.operation-list details').filter(item=>item!==details).forEach(item=>item.open=false);
}));
$$('[data-principle]').forEach(button => button.addEventListener('click',()=>{
  const selected=Number(button.dataset.principle);
  $$('.principle-slider article').forEach((article,i)=>article.hidden=i!==selected);
  $$('[data-principle]').forEach((dot,i)=>dot.setAttribute('aria-pressed',String(i===selected)));
}));
$$('[data-filter]').forEach(button => button.addEventListener('click',()=>{
  const filter=button.dataset.filter;
  let count=0;
  $$('.works-page .work-card').forEach(card=>{
    card.hidden=filter!=='전체'&&card.dataset.category!==filter;
    if(!card.hidden) count++;
  });
  $$('[data-filter]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
  $('.filter-count').textContent=`${count}개의 콘셉트 프로젝트`;
}));

function downloadText(filename,text) {
  const url=URL.createObjectURL(new Blob(['\ufeff'+text],{type:'text/plain;charset=utf-8'}));
  const anchor=document.createElement('a');
  anchor.href=url; anchor.download=filename;
  document.body.append(anchor); anchor.click(); anchor.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
let briefText='';
$('.brief-form')?.addEventListener('submit',event=>{
  event.preventDefault();
  const form=event.currentTarget;
  if(!form.reportValidity()) return;
  const values=new FormData(form);
  briefText=[
    '모듈룸 스튜디오 · 프로젝트 브리프',
    `이름: ${values.get('name')}`,
    `이메일: ${values.get('email')}`,
    `팀·회사: ${values.get('company')||'미정'}`,
    `관심 분야: ${values.getAll('service').join(', ')||'미정'}`,
    `희망 일정: ${values.get('timeline')}`,
    ...(values.has('website')?[`현재 사이트: ${values.get('website')||'미정'}`]:[]),
    '',String(values.get('message')),'',
    '이 파일은 데모 브리프입니다. 서버 전송이나 문의 접수는 이루어지지 않았습니다.'
  ].join('\n');
  const result=$('.brief-result');
  $('pre',result).textContent=briefText;
  result.hidden=false; result.focus();
});
$('.download-brief')?.addEventListener('click',()=>downloadText('modulroom-brief.txt',briefText));

const quoteForm=$('.quote-form');
let quoteText='';
function updateQuote() {
  if(!quoteForm) return;
  const values=new FormData(quoteForm);
  const base=Number(values.get('kind'));
  const pages=Number(values.get('pages'));
  const extra=values.getAll('extra').reduce((sum,value)=>sum+Number(value),0);
  const total=base+pages*200000+extra;
  $('#page-count').textContent=pages;
  $('#quote-total').textContent=`${total.toLocaleString('ko-KR')}원`;
  const kind=$('input[name="kind"]:checked',quoteForm).nextElementSibling.textContent;
  const extras=$$('input[name="extra"]:checked',quoteForm).map(input=>input.nextElementSibling.textContent);
  const lines=[`분야: ${kind}`,`페이지: ${pages}개`,`추가 구성: ${extras.join(', ')||'없음'}`];
  $('#quote-breakdown').replaceChildren(...lines.map(line=>{const p=document.createElement('p');p.textContent=line;return p;}));
  quoteText=['모듈룸 스튜디오 · 예시 구성',...lines,`예상 금액: ${total.toLocaleString('ko-KR')}원`,'실제 견적 또는 계약 금액이 아닌 체험용 계산입니다.'].join('\n');
}
quoteForm?.addEventListener('input',updateQuote);
updateQuote();
$('.quote-download')?.addEventListener('click',()=>downloadText('modulroom-quote.txt',quoteText));
const translations={
  ko:['한국어','함께 만드는 동네의 주말','작은 전시, 커피 한 잔, 가볍게 걷는 산책길. 이번 주말에 발견한 장소를 나눠 주세요.','공간 이야기 · 예시 게시물'],
  en:['English','A weekend in our neighborhood','A small exhibition, a cup of coffee, a quiet path. Share a place you discovered this weekend.','Places and stories · Sample post'],
  ja:['日本語','みんなでつくる街の週末','小さな展示、一杯のコーヒー、静かな散歩道。今週末に見つけた場所を教えてください。','場所の物語 · サンプル投稿']
};
$$('[data-language]').forEach(button=>button.addEventListener('click',()=>{
  const language=button.dataset.language;
  const [label,title,text,meta]=translations[language];
  $('.language-label').textContent=label;
  $('.community-title').textContent=title;
  $('.community-text').textContent=text;
  $('.community-meta').textContent=meta;
  $('.community-demo').lang=language;
  $$('[data-language]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
}));
