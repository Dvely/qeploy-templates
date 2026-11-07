/* Original vanilla-browser interactions for the MORROW FIELD demo. */
(()=>{
 'use strict';
 const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>Array.from(r.querySelectorAll(s));
 const data=JSON.parse($('#morrow-data').textContent),programs=data.programs;
 const motion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const scrollBehavior=motion?'instant':'smooth';
 let toastTimer;
 function toast(message){$('.toast').textContent=message;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('.toast').textContent='',4000);}
 const menu=$('.mobile-menu'),toggle=$('.menu-toggle');
 function closeMenu(){menu.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','전체 메뉴 열기');document.body.classList.remove('menu-open');}
 toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';menu.hidden=!open;toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'전체 메뉴 닫기':'전체 메뉴 열기');document.body.classList.toggle('menu-open',open);if(open)$('a',menu).focus();});
 document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&!menu.hidden){closeMenu();toggle.focus();}
  if(e.key==='Tab'&&!menu.hidden){
   const targets=[toggle,...$$('a',menu)],first=targets[0],last=targets.at(-1);
   if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
   if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  }
 });
 window.matchMedia('(min-width:851px)').addEventListener('change',e=>{if(e.matches)closeMenu();});
 $('.to-top').addEventListener('click',()=>window.scrollTo({top:0,behavior:scrollBehavior}));
 // Keep all content visible if observers or scripting are unavailable.
 if('IntersectionObserver' in window&&!motion){
  document.documentElement.classList.add('motion-ready');
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.06});
  $$('.reveal').forEach(el=>observer.observe(el));
 }
 const rail=$('.zone-rail');
 if(rail){
  const prev=$('[data-rail="prev"]'),next=$('[data-rail="next"]');
  function updateRail(){const max=rail.scrollWidth-rail.clientWidth;prev.disabled=rail.scrollLeft<3;next.disabled=rail.scrollLeft>=max-3;const index=max>0?Math.round(rail.scrollLeft/max*3):0;$$('.rail-dots i').forEach((el,i)=>el.classList.toggle('active',i===index));}
  $$('[data-rail]').forEach(el=>el.addEventListener('click',()=>rail.scrollBy({left:(el.dataset.rail==='next'?1:-1)*($('.zone-card',rail).getBoundingClientRect().width+22),behavior:scrollBehavior})));
  rail.addEventListener('scroll',updateRail,{passive:true});
  rail.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();rail.scrollBy({left:(e.key==='ArrowRight'?1:-1)*300,behavior:scrollBehavior});}});
  window.addEventListener('resize',updateRail);updateRail();
 }
 const zoneFilters=$('[data-filter-target="zones"]');
 if(zoneFilters)$$('[data-filter]',zoneFilters).forEach(btn=>btn.addEventListener('click',()=>{
  $$('[data-filter]',zoneFilters).forEach(el=>el.setAttribute('aria-pressed',String(el===btn)));
  let count=0;$$('.zone-grid .zone-card').forEach(card=>{card.hidden=btn.dataset.filter!=='전체'&&card.dataset.zoneFloor!==btn.dataset.filter;if(!card.hidden)count++;});
  $('.result-count',zoneFilters).textContent=`${count}개의 공간`;
 }));
 const storyFilters=$('[data-filter-target="stories"]');
 if(storyFilters){
  let category='전체';const search=$('#journal-search');
  function filterStories(){let count=0;$$('.journal-card[data-category]').forEach(card=>{card.hidden=(category!=='전체'&&card.dataset.category!==category)||!card.dataset.search.toLocaleLowerCase().includes(search.value.trim().toLocaleLowerCase());if(!card.hidden)count++;});$('#story-count').textContent=`${count}개의 이야기`;$('#story-empty').hidden=count!==0;}
  $$('[data-filter]',storyFilters).forEach(btn=>btn.addEventListener('click',()=>{category=btn.dataset.filter;$$('[data-filter]',storyFilters).forEach(el=>el.setAttribute('aria-pressed',String(el===btn)));filterStories();}));
  search.addEventListener('input',filterStories);$('.search-field').addEventListener('submit',e=>{e.preventDefault();filterStories();});
 }
 const copy=$('[data-copy-address]');
 if(copy)copy.addEventListener('click',async()=>{const address='학습용 예시 위치: (08221) 서울특별시 구로구 경인로 445 동양미래대학교';try{await navigator.clipboard.writeText(address);toast('학습용 예시 주소를 복사했습니다.');}catch{toast('복사가 지원되지 않습니다. 화면의 예시 주소를 직접 선택해 주세요.');}});
 const storeKey='morrow-field-visits-v1';
 const validVisit=v=>v&&typeof v==='object'&&programs.some(p=>p.id===v.program)&&typeof v.code==='string'&&/^MF-[A-Z0-9-]{5,40}$/.test(v.code)&&typeof v.date==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v.date)&&!Number.isNaN(new Date(`${v.date}T12:00:00`).getTime())&&programs.find(p=>p.id===v.program).times.includes(v.time)&&Number.isInteger(v.guests)&&v.guests>=1&&v.guests<=8;
 function loadVisits(){try{const saved=JSON.parse(localStorage.getItem(storeKey)||'[]');return Array.isArray(saved)?saved.filter(validVisit).slice(0,30):[];}catch{return [];}}
 function saveVisits(visits){try{localStorage.setItem(storeKey,JSON.stringify(visits));return true;}catch{return false;}}
 const dateLabel=iso=>new Intl.DateTimeFormat('ko-KR',{year:'numeric',month:'long',day:'numeric',weekday:'short'}).format(new Date(`${iso}T12:00:00`));
 const facts=v=>{
  const p=programs.find(p=>p.id===v.program);
  return `<dl class="facts"><div><dt>프로그램</dt><dd>${p.name} · 약 ${p.duration}분</dd></div><div><dt>방문 날짜</dt><dd>${dateLabel(v.date)}</dd></div><div><dt>방문 시간</dt><dd>${v.time}</dd></div><div><dt>방문 인원</dt><dd>${v.guests}명</dd></div></dl>`;
 };
 if(document.body.dataset.page==='reserve'){
  const day=new Date();day.setHours(0,0,0,0);
  const end=new Date(day);end.setDate(end.getDate()+90);
  let month=new Date(day.getFullYear(),day.getMonth(),1),step=1;
  const query=new URLSearchParams(location.search).get('program');
  const selected={program:programs.some(p=>p.id===query)?query:'walk',date:'',time:'',guests:1};
  const maxGuests=()=>Number(programs.find(p=>p.id===selected.program).group.match(/\d+/g).at(-1));
  const iso=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  function updateSummary(){
   const p=programs.find(p=>p.id===selected.program);
   $('[data-summary="program"]').textContent=p.name;
   $('[data-summary="date"]').textContent=selected.date?dateLabel(selected.date):'선택해 주세요';
   $('[data-summary="time"]').textContent=selected.time||'선택해 주세요';
   $('[data-summary="guests"]').textContent=`${selected.guests}명`;
   $('#guest-count').textContent=selected.guests;
   $('[data-count="minus"]').disabled=selected.guests===1;
   $('[data-count="plus"]').disabled=selected.guests>=maxGuests();
  }
  function renderTimes(){const p=programs.find(p=>p.id===selected.program);$('.time-grid').innerHTML=p.times.map(t=>`<button data-time="${t}" aria-pressed="${t===selected.time}">${t}</button>`).join('');}
  function renderCalendar(){
   $('#calendar-month').textContent=`${month.getFullYear()}년 ${month.getMonth()+1}월`;
   const first=new Date(month.getFullYear(),month.getMonth(),1),last=new Date(month.getFullYear(),month.getMonth()+1,0);
   const blanks=first.getDay();let markup='<span aria-hidden="true"></span>'.repeat(blanks);
   for(let n=1;n<=last.getDate();n++){
    const d=new Date(month.getFullYear(),month.getMonth(),n),value=iso(d),disabled=d<day||d>end||d.getDay()===1;
    markup+=`<button data-date="${value}" aria-label="${dateLabel(value)}${d.getDay()===1?' · 휴관':''}" aria-pressed="${value===selected.date}"${disabled?' disabled':''}>${n}</button>`;
   }
   $('.calendar-days').innerHTML=markup;
   $('[data-month="prev"]').disabled=month.getFullYear()===day.getFullYear()&&month.getMonth()===day.getMonth();
   $('[data-month="next"]').disabled=month.getFullYear()===end.getFullYear()&&month.getMonth()===end.getMonth();
  }
  function updateProgram(){
   $$('[data-program]').forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.program===selected.program)));
   selected.guests=Math.min(selected.guests,maxGuests());renderTimes();updateSummary();
  }
  $$('[data-program]').forEach(btn=>btn.addEventListener('click',()=>{selected.program=btn.dataset.program;selected.time='';$('#booking-error').textContent='';updateProgram();}));
  $('.calendar-days').addEventListener('click',e=>{const btn=e.target.closest('[data-date]');if(!btn||btn.disabled)return;selected.date=btn.dataset.date;$$('[data-date]').forEach(el=>el.setAttribute('aria-pressed',String(el===btn)));$('#booking-error').textContent='';updateSummary();});
  $$('[data-month]').forEach(btn=>btn.addEventListener('click',()=>{month=new Date(month.getFullYear(),month.getMonth()+(btn.dataset.month==='next'?1:-1),1);renderCalendar();}));
  $('.time-grid').addEventListener('click',e=>{const btn=e.target.closest('[data-time]');if(!btn)return;selected.time=btn.dataset.time;renderTimes();$('#booking-error').textContent='';updateSummary();});
  $$('[data-count]').forEach(btn=>btn.addEventListener('click',()=>{selected.guests=Math.max(1,Math.min(maxGuests(),selected.guests+(btn.dataset.count==='plus'?1:-1)));updateSummary();}));
  function showStep(next){
   step=next;$$('[data-step]').forEach(el=>el.hidden=Number(el.dataset.step)!==step);
   $$('[data-step-label]').forEach(el=>{if(Number(el.dataset.stepLabel)===step)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');});
   const heading=$(`[data-step="${step}"] h2`);heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});$('.stepper').scrollIntoView({behavior:scrollBehavior,block:'start'});
  }
  $('[data-booking-next]').addEventListener('click',()=>{
   if(!selected.date||!selected.time){$('#booking-error').textContent='방문 날짜와 시간을 모두 선택해 주세요.';return;}
   $('.review-selection').innerHTML=facts(selected)+`<p class="inline-note">권장 대상: ${programs.find(p=>p.id===selected.program).age}<br>실제 방문·예약·결제는 진행되지 않습니다.</p>`;showStep(2);
  });
  $('[data-booking-back]').addEventListener('click',()=>showStep(1));
  $('[data-booking-confirm]').addEventListener('click',()=>{
   if(!$('#acknowledge').checked||!$('#visit-guide-ack').checked){$('#confirm-error').textContent='두 가지 안내를 모두 확인해 주세요.';return;}
   const p=programs.find(p=>p.id===selected.program),v={...selected,code:`MF-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2,6).toUpperCase()}`};
   if(!validVisit(v)||selected.guests>maxGuests()){$('#confirm-error').textContent='선택한 구성을 다시 확인해 주세요.';return;}
   const saved=loadVisits();if(saved.length>=30){$('#confirm-error').textContent='최대 30개까지 보관할 수 있습니다. 나의 방문에서 이전 구성을 정리해 주세요.';return;}
   if(!saveVisits([v,...saved])){$('#confirm-error').textContent='브라우저 저장이 차단되어 보관하지 못했습니다. 저장 설정을 확인한 뒤 다시 시도해 주세요.';return;}
   $('.confirmation-detail').innerHTML=facts(v)+`<p class="micro muted">구성 번호 · ${v.code}</p>`;showStep(3);toast(`${p.name} 방문 구성을 보관했습니다.`);
  });
  renderCalendar();updateProgram();
 }
 if(document.body.dataset.page==='my-visit'){
  const container=$('#saved-visits');let recentlyDeleted;
  function renderVisits(){
   const visits=loadVisits();
   if(!visits.length){container.innerHTML=`<div class="empty"><p>아직 보관한 방문 구성이 없어요.<br>어떤 경험이 궁금한지 먼저 둘러볼까요?</p><div class="actions" style="justify-content:center;margin-top:25px"><a class="btn" href="reserve.html">방문 계획하기 ↗</a><a class="btn light" href="programs.html">프로그램 살펴보기 ↗</a></div></div>`;return;}
   container.innerHTML=visits.map(v=>{const p=programs.find(p=>p.id===v.program);return `<article class="ticket"><div class="ticket-top"><div><p class="eyebrow">가상의 방문 구성</p><h2>${p.name}</h2></div><span class="ticket-code">${v.code}</span></div>${facts(v)}<p class="inline-note">실제 예약 확인서가 아닙니다. 이 브라우저에 보관한 시연용 방문 구성입니다.</p><div class="actions"><button class="btn light" data-print="${v.code}">구성 인쇄 ↗</button><button class="btn light" data-delete="${v.code}">구성 삭제</button></div></article>`;}).join('');
  }
  container.addEventListener('click',e=>{
   const del=e.target.closest('[data-delete]'),print=e.target.closest('[data-print]');
   if(del){const visits=loadVisits();recentlyDeleted=visits.find(v=>v.code===del.dataset.delete);if(saveVisits(visits.filter(v=>v.code!==del.dataset.delete))){renderVisits();const undo=document.createElement('button');undo.className='btn light';undo.textContent='방금 삭제한 구성 복원';undo.addEventListener('click',()=>{if(recentlyDeleted&&saveVisits([recentlyDeleted,...loadVisits()])){recentlyDeleted=null;renderVisits();toast('방문 구성을 복원했습니다.');}});container.append(undo);toast('이 브라우저에서 방문 구성을 삭제했습니다.');}else toast('기록을 삭제하지 못했습니다. 브라우저 저장 설정을 확인해 주세요.');}
   if(print){$$('.ticket',container).forEach(t=>t.hidden=!t.contains(print));window.print();$$('.ticket',container).forEach(t=>t.hidden=false);}
  });renderVisits();
 }
})();
