(() => {
 'use strict';
 const root = new URL('.', document.currentScript.src);
 const content = {titles:['세온 어패럴, 일상에서 출발하는 소재 실험 노트 공개','세온 플레이, 함께 응원하는 주말의 장면을 담다','세온 스쿨, 편안한 움직임을 위한 새 학기 컬렉션','세온 웍스, 작업실과 일상을 잇는 유틸리티웨어 제안','작은 조각에서 시작하는 순환 소재 이야기','다섯 명의 디자이너가 나눈 다음 계절의 아이디어','세온 스튜디오 오픈 데이, 소재와 사람을 만나다','오래 입는 옷을 위한 봉제 디테일 연구','커뮤니티와 함께하는 주말 디자인 워크숍','도시의 리듬을 담은 새로운 색 조합','옷장 속 일상을 새롭게 보는 방법','세온의 첫 번째 디자인 기록집'],photos:['team','play','school','work','circular','team','headquarters','work','team','play','school','circular']};
 content.titles.push('계절의 감각을 담아 고른 여섯 가지 소재','세온 플레이의 컬러 스터디, 코트에서 일상으로','하루의 움직임을 따라 다듬은 새로운 패턴','작업의 도구가 된 옷, 세온 웍스 제작 노트','남은 천 조각으로 그려보는 다음 디자인','스튜디오 테이블에서 시작된 작은 대화','함께 쓰는 공간과 함께 만드는 아이디어','소재의 결을 살리는 봉제 방식의 발견','자연광 아래에서 다시 살펴본 색의 표정','오래 곁에 두고 싶은 기본 아이템','새로운 계절을 준비하는 세온 스쿨','세온 어패럴의 디자인 아카이브를 열다');
 const esc = text => String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function modal(title,text){
  let box=document.querySelector('#seon-dialog');
  if(!box){box=document.createElement('dialog');box.id='seon-dialog';document.body.append(box);box.addEventListener('click',e=>{if(e.target===box||e.target.closest('[data-close]'))box.close();});}
  box.innerHTML='<button class="seon-dialog-close" data-close aria-label="닫기">×</button><p class="seon-eyebrow">SEON APPAREL</p><h2>'+esc(title)+'</h2><p>'+esc(text)+'</p><button class="seon-dialog-confirm" data-close>확인</button>';
  box.showModal();
 }
 window.alertLayer=(message,unused,callback)=>{modal('안내',message);if(callback){document.querySelector('#seon-dialog').addEventListener('close',callback,{once:true});}};
 window.movePage = value => {if(value)location.assign(new URL(value,root));};
 window.seonDocument = el => modal((el.querySelector('.tit')?.textContent||el.textContent||'세온의 디자인 기록').trim(),'세온 어패럴의 가상 문서 예시입니다. 이 화면의 공고와 재무 수치는 디자인 시연을 위한 창작 자료이며 실제 공시나 투자 정보가 아닙니다.');
 window.seonCohort = value => {
  const cells=[...document.querySelectorAll('td')].filter(c=>/^\d[\d,]*$/.test(c.textContent.trim()));
  cells.forEach((c,i)=>c.textContent=((Number(value)||24)*107+(i+7)*137).toLocaleString('ko-KR'));
 };
 async function copyLink(){
  try{await navigator.clipboard.writeText(location.href);modal('링크를 복사했습니다','현재 세온 어패럴 화면의 주소를 복사했습니다.');}
  catch{modal('현재 페이지 주소',location.href);}
 }
 window.shareLink=copyLink;
 window.shareFacebook=copyLink;
 window.shareX=copyLink;
 window.shareNaverBlog=copyLink;
 window.seonLanguage = language => {
  const labels={en:'ENG',ja:'JPN','zh-CN':'CHN'};
  document.querySelectorAll('.lang_wrap .btn span,.sitemap .lang .btn span').forEach(x=>x.textContent=labels[language]||'KOR');
  document.querySelectorAll('.lang_wrap,.sitemap .lang').forEach(x=>x.classList.remove('open'));
  modal('Language preview','세온 어패럴은 한국어로 구성한 브랜드 시연 사이트입니다. 언어 선택 메뉴의 배치와 전환을 확인할 수 있으며, 별도의 번역 서비스로 데이터를 전송하지 않습니다.');
 };
 window.frmChk = () => {
  const form=document.querySelector('#frm');if(!form)return;
  const one=form.querySelector('input[name="type"]:checked'),two=form.querySelector('.sect2 input:checked');
  const fields=[['#inpTitle','제목'],['#inpConts','문의 내용'],['#email1','이메일'],['#email2','이메일 도메인']];
  if(!one||!two){modal('문의 분야를 선택해주세요','관심 있는 분야와 상세 항목을 차례대로 선택해주세요.');return;}
  for(const [selector,label] of fields){const field=form.querySelector(selector);if(!field?.value.trim()){modal(label+'을 입력해주세요','이 화면은 전송되지 않는 시연입니다. 예시 내용을 입력해 흐름을 확인해주세요.');field?.focus();return;}}
  if(!form.querySelector('#cu_agree')?.checked){modal('시연 안내를 확인해주세요','입력 내용이 전송되지 않는다는 안내를 확인해주세요.');return;}
  modal('입력 내용을 확인했습니다','문의 흐름 시연이 완료되었습니다. 실제 문의는 접수되지 않으며, 입력한 정보는 전송하거나 저장하지 않았습니다.');
  document.querySelector('#seon-dialog').addEventListener('close',()=>{form.reset();location.assign(new URL('index.html',root));},{once:true});
 };
 window.refreshCaptcha=()=>{};
 const mapCommand = type => document.querySelector('#map iframe')?.contentWindow.postMessage({seonMap:type},location.origin);
 window.zoomIn=()=>mapCommand('in');window.zoomOut=()=>mapCommand('out');window.mapRefresh=()=>mapCommand('reset');window.setMapType=t=>mapCommand(t);window.goLink=()=>modal('가상 스튜디오 위치','서울시 세온구 디자인로 24는 디자인 시연을 위한 가상 주소입니다.');
 document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('form').forEach(f=>f.addEventListener('submit',e=>e.preventDefault()));
  document.querySelectorAll('[role="button"][tabindex]').forEach(el=>el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();el.click();}}));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){document.querySelector('.sitemap')?.classList.remove('on');document.documentElement.classList.remove('scroll_none');}});
  document.querySelectorAll('a[href="#url"]').forEach(a=>{a.href='#';a.addEventListener('click',e=>{e.preventDefault();modal('목록 안내','현재 표시된 항목은 가상의 브랜드 디자인 기록입니다. 각 카드를 선택해 상세 내용을 살펴보세요.');});});
  document.querySelectorAll('a[href="javascript:void(0);"]').forEach(a=>{if(a.querySelector('img[src*="partner-"]')){a.href=new URL('seon-network.html',root);}});
  // Native header opens the same sitemap; repair the source's mobile-only selector typo.
  if(window.jQuery){jQuery('#header .sitemap .depth1 > a').off('click');jQuery('#header .sitemap .depth1 > li > a').on('click',function(e){if(innerWidth<=1240){e.preventDefault();jQuery(this).parent().siblings().children('.depth2').slideUp(250);jQuery(this).siblings('.depth2').slideToggle(250);}});}
  const page=Math.min(2,Math.max(1,Number(new URLSearchParams(location.search).get('page'))||1));
  document.querySelectorAll('.num_list li').forEach((li,i)=>{li.classList.toggle('active',i+1===page);const a=li.querySelector('a');if(a){a.setAttribute('aria-label',`${i+1}페이지`);if(i+1===page)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');}});
  const noticeTitles=['브랜드 운영 현황 안내','제작 기준 공개 자료','소재 실험 기록집 안내','디자인 프로젝트 운영 보고서','지속가능 디자인 노트','크리에이티브 네트워크 소개','가상 재무 정보 이용 안내','스튜디오 오픈 데이 안내','브랜드 아카이브 열람 안내','세온의 다음 계절 디자인 계획'];
  document.querySelectorAll('a[onclick=\"seonDocument(this); return false;\"]').forEach((a,i)=>{const title=a.querySelector('.tit');if(title)title.textContent=noticeTitles[i%noticeTitles.length]+(page===2?' · 이전 기록':'');});
  if(page===2){
   document.querySelectorAll('#press .press_list .item').forEach((item,i)=>{const id=i+12;const title=item.querySelector('.tit');if(title)title.textContent=content.titles[id];item.onclick=()=>location.assign(new URL('seon-story.html?type=news&id='+id,root));});
   document.querySelectorAll('#contribute .contribute_list .item').forEach((item,i)=>{item.hidden=i>=4;if(i>=4)item.style.display='none';else{const title=item.querySelector('.tit');if(title)title.textContent=['옷의 쓰임을 함께 생각하는 주말 워크숍','작은 소재 조각을 나누는 커뮤니티 테이블','디자인을 가까이에서 만나는 오픈 스튜디오','다음 세대와 함께 그리는 편안한 일상'][i];}});
  }
  document.querySelectorAll('#press .item[role="link"]').forEach(item=>item.addEventListener('keydown',e=>{if(e.key==='Enter')item.click();}));
  const article=document.querySelector('#seon-story');
  if(article){
   const params=new URLSearchParams(location.search),i=(Number(params.get('id'))||0)%content.titles.length;
   const community=params.get('type')==='community';
   document.querySelector('#story-title').textContent=community?'함께 만드는 일상, 세온의 커뮤니티 노트':content.titles[i];
   const image=document.querySelector('#story-image');image.src=new URL('assets/seon-'+content.photos[i%content.photos.length]+'.png',root);image.alt=content.titles[i];
   document.querySelector('#story-body').innerHTML='<p>좋은 디자인은 가까운 일상을 관찰하는 데서 출발합니다. 세온은 옷을 입는 사람의 움직임과 소재의 촉감, 함께 보내는 시간에 주목합니다.</p><p>이번 기록은 '+esc(content.titles[i].replace(/^세온.*?, /,''))+'에 관한 창작 콘셉트입니다. 디자이너들은 서로의 경험을 나누고 작은 샘플을 직접 살펴보며 아이디어를 구체화했습니다.</p><p>더 편하게 움직이는 패턴, 자연스럽게 어울리는 색, 오래 사용하고 싶은 디테일을 함께 생각합니다. 세온 스쿨·세온 플레이·세온 웍스가 서로 다른 일상의 장면을 연결합니다.</p><p class="seon-caption">이 글과 회사, 협업 및 프로젝트는 디자인 시연을 위한 가상 예시입니다.</p>';
   document.querySelector('#story-back').href=community?'seon-community.html':'seon-news.html';
  }
 });
})();
