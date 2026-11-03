(() => {
 const root = new URL('.', document.currentScript.src);
 const routes = {"/en":"luon-english.html","/ko":"index.html","/ko/about":"luon-about.html","/ko/careers":"luon-careers.html","/ko/contact":"luon-contact.html","/ko/cos":"luon-cos.html","/ko/cos/projects/cream-cli":"luon-cos-projects-cli.html","/ko/cos/projects/cream-navi-vision":"luon-cos-projects-navi-vision.html","/ko/cos/projects/cream-wiki":"luon-cos-projects-wiki.html","/ko/cos/services":"luon-cos-services.html","/ko/cos/services/bannerly":"luon-cos-services-canvasly.html","/ko/cos/services/lane":"luon-cos-services-scenelog.html","/ko/cos/services/lolo":"luon-cos-services-tastenote.html","/ko/cos/services/sag":"luon-cos-services-lens.html","/ko/cos/services/sellery":"luon-cos-services-formnote.html","/ko/cos/services/skmagic":"luon-cos-services-onyou-home.html","/ko/cos/services/umsh":"luon-cos-services-momentroom.html","/ko/journal":"luon-journal.html","/ko/journal/news-106":"luon-journal-news-106.html","/ko/journal/news-107":"luon-journal-news-107.html","/ko/journal/news-108":"luon-journal-news-108.html","/ko/journal/news-109":"luon-journal-news-109.html","/ko/works":"luon-works.html","/ko/works/lotte-alice":"luon-works-orbi-alice.html","/ko/works/lotte-wonder":"luon-works-orbi-wonder.html","/about":"luon-about.html","/careers":"luon-careers.html","/contact":"luon-contact.html","/cos":"luon-cos.html","/ko/cos/projects/luon-cli":"luon-cos-projects-cli.html","/cos/projects/cream-cli":"luon-cos-projects-cli.html","/cos/projects/luon-cli":"luon-cos-projects-cli.html","/ko/cos/projects/luon-navi-vision":"luon-cos-projects-navi-vision.html","/cos/projects/cream-navi-vision":"luon-cos-projects-navi-vision.html","/cos/projects/luon-navi-vision":"luon-cos-projects-navi-vision.html","/ko/cos/projects/luon-wiki":"luon-cos-projects-wiki.html","/cos/projects/cream-wiki":"luon-cos-projects-wiki.html","/cos/projects/luon-wiki":"luon-cos-projects-wiki.html","/cos/services":"luon-cos-services.html","/ko/cos/services/canvasly":"luon-cos-services-canvasly.html","/cos/services/bannerly":"luon-cos-services-canvasly.html","/cos/services/canvasly":"luon-cos-services-canvasly.html","/ko/cos/services/scenelog":"luon-cos-services-scenelog.html","/cos/services/lane":"luon-cos-services-scenelog.html","/cos/services/scenelog":"luon-cos-services-scenelog.html","/ko/cos/services/tastenote":"luon-cos-services-tastenote.html","/cos/services/lolo":"luon-cos-services-tastenote.html","/cos/services/tastenote":"luon-cos-services-tastenote.html","/cos/services/sag":"luon-cos-services-lens.html","/ko/cos/services/formnote":"luon-cos-services-formnote.html","/cos/services/sellery":"luon-cos-services-formnote.html","/cos/services/formnote":"luon-cos-services-formnote.html","/ko/cos/services/onyou-home":"luon-cos-services-onyou-home.html","/cos/services/skmagic":"luon-cos-services-onyou-home.html","/cos/services/onyou-home":"luon-cos-services-onyou-home.html","/ko/cos/services/momentroom":"luon-cos-services-momentroom.html","/cos/services/umsh":"luon-cos-services-momentroom.html","/cos/services/momentroom":"luon-cos-services-momentroom.html","/journal":"luon-journal.html","/journal/news-106":"luon-journal-news-106.html","/journal/news-107":"luon-journal-news-107.html","/journal/news-108":"luon-journal-news-108.html","/journal/news-109":"luon-journal-news-109.html","/works":"luon-works.html","/works/lotte-alice":"luon-works-orbi-alice.html","/works/lotte-wonder":"luon-works-orbi-wonder.html"};
 function route(href) {
  if (!href || /^(#|mailto:|tel:|data:|blob:)/.test(href)) return null;
  let u;try{u=new URL(href,location.href);}catch{return null;}
  let path=decodeURIComponent(u.pathname).replace(/\/$/,'');
  const file=path.split('/').pop();
  if(Object.values(routes).includes(file))return new URL(file+u.search+u.hash,root).href;
  if(u.origin===location.origin&&(path===''||path==='/'))return new URL('index.html'+u.hash,root).href;
  if(routes[path])return new URL(routes[path]+u.search+u.hash,root).href;
  const names={'sellery':'formnote','lane':'scenelog','umsh':'momentroom','skmagic':'onyou-home','bannerly':'canvasly','lolo':'tastenote'};
  let key=path.replace(/^\/(ko|en)/,'');
  if(routes[key])return new URL(routes[key]+u.search+u.hash,root).href;
  if(key.startsWith('/works/'))return new URL('luon-works-orbi-alice.html',root).href;
  if(key.startsWith('/journal/'))return new URL('luon-journal-news-109.html',root).href;
  if(key.startsWith('/cos/'))return new URL('luon-cos.html',root).href;
  if(/\.(pdf|pptx|docx|zip)$/i.test(path))return new URL('assets/luon-brand-guide.pdf',root).href;
  if(/youtube|youtu\.be/.test(u.hostname))return new URL('luon-works-orbi-alice.html',root).href;
  if(u.origin!==location.origin)return new URL(/recruit|careers|talent/.test(u.href)?'luon-careers.html':/instagram|behance|brunch|openai/.test(u.hostname)?'luon-about.html':'luon-contact.html',root).href;
  return null;
 }
 function normalize(){
  document.querySelectorAll('a[href]').forEach(a=>{let dest=route(a.getAttribute('href'));if(dest&&a.href!==dest){a.href=dest;a.removeAttribute('target');}});

 }
 document.addEventListener('click',e=>{
  const b=e.target.closest('button');
  if(b&&['KO','EN','한국어','English'].includes(b.textContent.trim())){e.preventDefault();e.stopImmediatePropagation();location.href=new URL(b.textContent.trim()==='EN'||b.textContent.trim()==='English'?'luon-english.html':'index.html',root);return;}
  const a=e.target.closest('a[href]');if(!a||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
  const dest=route(a.getAttribute('href'));if(dest){if(/\.pdf(?:\?|$)/i.test(dest)){a.href=dest;a.download='luon-brand-guide.pdf';e.stopImmediatePropagation();return;}e.preventDefault();e.stopImmediatePropagation();location.assign(dest);}
 },true);
 const nativeFetch=window.fetch.bind(window);
 window.fetch=(input,options={})=>{
  const u=new URL(typeof input==='string'||input instanceof URL?input:input.url,location.href);
  if(u.pathname==='/api/chat')return Promise.resolve(new Response(JSON.stringify({text:'안녕하세요, 루온 스튜디오의 안내 화면입니다. 브랜드 경험, UX/UI, 캠페인, 콘텐츠와 제작 흐름을 함께 살펴보세요. 프로젝트 이야기는 Contact에서 입력해 볼 수 있습니다. 실제 상담이나 개인정보 전송은 이루어지지 않습니다.'}),{headers:{'content-type':'application/json'}}));
  if(u.pathname==='/api/inquiries')return Promise.resolve(new Response(JSON.stringify({ok:true,demo:true}),{headers:{'content-type':'application/json'}}));
  if(u.pathname.startsWith('/api/directions'))return Promise.resolve(new Response(JSON.stringify({path:[],walkMin:0}),{headers:{'content-type':'application/json'}}));
  if(u.origin!==location.origin||(options.method||'GET').toUpperCase()!=='GET')return Promise.reject(new TypeError('가상 스튜디오 화면은 외부로 데이터를 전송하지 않습니다.'));
  return nativeFetch(input,options);
 };
 function start(){const body=document.body;if(!body){requestAnimationFrame(start);return;}normalize();let scheduled=false;new MutationObserver(()=>{if(!scheduled){scheduled=true;requestAnimationFrame(()=>{scheduled=false;normalize();});}}).observe(body,{childList:true,subtree:true});}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
