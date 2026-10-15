(() => {
  'use strict';
  const $=(s,p=document)=>p.querySelector(s),$$=(s,p=document)=>[...p.querySelectorAll(s)],data=window.AQUAFOLIO,params=new URLSearchParams(location.search);
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),money=n=>n.toLocaleString('ko-KR')+'원';
  const today=()=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  const dateAt=s=>new Date(s+'T12:00:00Z'),iso=d=>d.toISOString().slice(0,10),addDays=(s,n)=>{const d=dateAt(s);d.setUTCDate(d.getUTCDate()+n);return iso(d);},days=['일','월','화','수','목','금','토'];
  const validDate=s=>/^\d{4}-\d{2}-\d{2}$/.test(s||'')&&!isNaN(dateAt(s))&&iso(dateAt(s))===s;
  const dateLabel=s=>{const d=dateAt(s);return `${d.getUTCFullYear()}. ${String(d.getUTCMonth()+1).padStart(2,'0')}. ${String(d.getUTCDate()).padStart(2,'0')} (${days[d.getUTCDay()]})`;};
  const status=$('#aquafolio-status'),dialog=$('#aquafolio-dialog');let toastTimer;
  function toast(text){status.textContent=text;status.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>status.hidden=true,3500);}
  function modal(title,body){$('#aquafolio-dialog-title').textContent=title;$('#aquafolio-dialog-body').innerHTML=body;if(!dialog.open)dialog.showModal();}
  function speciesDetail(id){if(!Object.hasOwn(data.species,id))return;const s=data.species[id];modal(s.title,`<img class="aq-detail-image" src="${s.image}" alt="${esc(s.title)}"><p class="aq-eyebrow">${esc(s.latin)}</p><p>${esc(s.desc)}</p><dl class="aq-detail-facts"><div><dt>전시 위치</dt><dd>${esc(s.zone)}</dd></div><div><dt>전시 안내</dt><dd>관람·생물 정보는 시안의 예시입니다.</dd></div></dl><a class="aq-button" href="aquafolio-tickets.html">관람 티켓 선택 →</a>`);}
  let category='all',sort='pop';const cards=$$('.creature-card'),grid=$('#creature-grid'),featured=$('[data-species-feature]');
  function filterCreatures(){if(!grid)return;const search=$('#creature-search').value.toLocaleLowerCase().trim();let total=0;
    for(const card of cards){const s=data.species[card.dataset.species];const categoryMatch=category==='all'||(category==='protected'?s.protected:s.category===category);card.hidden=!categoryMatch||!card.textContent.toLocaleLowerCase().includes(search);if(!card.hidden)total++;}
    if(featured){featured.hidden=!(category==='all'||category==='mammal')||!featured.textContent.toLocaleLowerCase().includes(search);if(!featured.hidden)total++;}
    const ordered=[...cards].sort((a,b)=>{const x=data.species[a.dataset.species],y=data.species[b.dataset.species];return sort==='name'?x.title.localeCompare(y.title,'ko'):sort==='floor'?x.zone.localeCompare(y.zone,'ko'):x.rank-y.rank;});ordered.forEach(c=>grid.append(c));
    $('.aq-results[data-creature-count]').textContent=total+'종의 전시 생물';$('[data-creature-empty]').hidden=total>0;$$('.filter-pill').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.category===category)));$$('.sort-btn').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.sort===sort)));
  }
  $('#creature-search')?.addEventListener('input',filterCreatures);if(params.has('category'))category=['all','mammal','shark','reef','deep','freshwater','protected'].includes(params.get('category'))?params.get('category'):'all';filterCreatures();
  let selectedProgramDate=validDate(params.get('date'))&&params.get('date')>=today()?params.get('date'):today(),programFilter='all';
  function renderPrograms(){if(!$('[data-program-date]'))return;$$('[data-program-date]').forEach((b,i)=>{const date=addDays(today(),i),d=dateAt(date);b.dataset.date=date;b.setAttribute('aria-pressed',String(date===selectedProgramDate));const spans=$$('span',b);spans[0].textContent=i===0?'TODAY':['SUN','MON','TUE','WED','THU','FRI','SAT'][d.getUTCDay()];spans[1].textContent=(d.getUTCMonth()+1)+'/'+d.getUTCDate();spans[2].textContent='일정 보기';});
    $$('[data-program-card]').forEach(c=>c.hidden=programFilter!=='all'&&c.dataset.programCard!==programFilter);$$('[data-program-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.programFilter===programFilter)));$('[data-schedule-date]').textContent=dateLabel(selectedProgramDate)+' · '+$$('[data-program-card]').filter(c=>!c.hidden).length+'개 정규 프로그램 · 일정 예시';if($('[data-program-day-label]'))$('[data-program-day-label]').textContent=dateLabel(selectedProgramDate);}
  renderPrograms();
  $$('.aq-date-strip,.aq-program-filters').forEach(strip=>{
    let gesture=null,suppressClick=false;
    strip.addEventListener('pointerdown',e=>{
      if(e.pointerType!=='mouse'||e.button!==0)return;
      suppressClick=false;gesture={id:e.pointerId,x:e.clientX,left:strip.scrollLeft,dragging:false};
    });
    strip.addEventListener('pointermove',e=>{
      if(!gesture||gesture.id!==e.pointerId)return;
      const distance=e.clientX-gesture.x;
      if(!gesture.dragging&&Math.abs(distance)>5){gesture.dragging=true;strip.setPointerCapture(e.pointerId);strip.classList.add('is-dragging');}
      if(gesture.dragging){e.preventDefault();strip.scrollLeft=gesture.left-distance;}
    });
    const finish=e=>{
      if(!gesture||gesture.id!==e.pointerId)return;
      suppressClick=gesture.dragging;gesture=null;strip.classList.remove('is-dragging');
      if(strip.hasPointerCapture(e.pointerId))strip.releasePointerCapture(e.pointerId);
    };
    strip.addEventListener('pointerup',finish);strip.addEventListener('pointercancel',finish);
    strip.addEventListener('pointerleave',()=>{if(gesture&&!gesture.dragging)gesture=null;});
    strip.addEventListener('click',e=>{if(suppressClick){suppressClick=false;e.preventDefault();e.stopImmediatePropagation();}},true);
  });
  const qty={adult:1,child:1,family:0,night:0,annual:0};if(Object.hasOwn(data.prices,params.get('ticket'))){Object.keys(qty).forEach(k=>qty[k]=0);qty[params.get('ticket')]=1;}
  let selectedDate=validDate(params.get('date'))&&params.get('date')>=today()&&params.get('date')<=addDays(today(),365)?params.get('date'):today();
  let month=dateAt(selectedDate);month.setUTCDate(1);const totalQty=()=>Object.values(qty).reduce((a,b)=>a+b,0),ticketTotal=()=>Object.keys(qty).reduce((a,k)=>a+qty[k]*data.prices[k].price,0);
  function renderTickets(){if(!$('#total-final-price'))return;let original=0;for(const [id,n]of Object.entries(qty)){const price=data.prices[id];original+=n*price.original;$('#qty-'+id).textContent=n;const row=$('#summary-row-'+id);row.classList.toggle('hidden',n===0);$('span:first-child',row).textContent=price.name+' '+n+(id==='family'?'세트':'매');$('span:last-child',row).textContent=money(n*price.price);$('.qty-btn-minus[data-id="'+id+'"]').disabled=n===0;$('.qty-btn-plus[data-id="'+id+'"]').disabled=totalQty()>=10;}
    $('#total-original-price').textContent=money(original);$('#total-discount-price').textContent='−'+money(original-ticketTotal());$('#total-final-price').textContent=money(ticketTotal());$('#display-selected-date').textContent=dateLabel(selectedDate);$$('.date-chip').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.date===selectedDate)));if($('#aquafolio-calendar'))renderCalendar();}
  function renderCalendar(){const year=month.getUTCFullYear(),m=month.getUTCMonth(),start=new Date(Date.UTC(year,m,1,12)),end=new Date(Date.UTC(year,m+1,0,12)),parts=Array(start.getUTCDay()).fill('<span aria-hidden="true"></span>');
    for(let d=1;d<=end.getUTCDate();d++){const date=iso(new Date(Date.UTC(year,m,d,12))),past=date<today()||date>addDays(today(),365);parts.push(`<button type="button" data-calendar-date="${date}" aria-label="${dateLabel(date)}" aria-pressed="${date===selectedDate}" ${past?'disabled':''}>${d}</button>`);}$('#aquafolio-calendar').innerHTML=parts.join('');$('[data-calendar-label]').textContent=year+'년 '+(m+1)+'월';const current=dateAt(today());current.setUTCDate(1);$('[data-calendar-month="-1"]').disabled=month<=current;$('[data-calendar-month="1"]').disabled=year*12+m>=current.getUTCFullYear()*12+current.getUTCMonth()+12;}
  if($('#quick-date-group')){
    let nextWeekday=addDays(today(),1);while([0,6].includes(dateAt(nextWeekday).getUTCDay()))nextWeekday=addDays(nextWeekday,1);let saturday=addDays(today(),1);while(dateAt(saturday).getUTCDay()!==6)saturday=addDays(saturday,1);
    const dates=[today(),addDays(today(),1),nextWeekday,saturday];$$('.date-chip').forEach((b,i)=>{b.dataset.date=dates[i];const spans=$$('span',b),d=dateAt(dates[i]);spans[0].textContent=['오늘 방문','내일 방문','가까운 평일','다음 토요일'][i];spans[1].textContent=(d.getUTCMonth()+1)+'월 '+d.getUTCDate()+'일 ('+days[d.getUTCDay()]+')';spans[2].textContent=[0,6].includes(d.getUTCDay())?'주말 운영 (21:00)':'평일 운영 (20:00)';});renderTickets();$$('.pay-method-btn').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===0)));}
  const linkDate=date=>'aquafolio-tickets.html?date='+date;
  document.addEventListener('click',e=>{
    const b=e.target.closest('button,a');if(!b)return;
    if(b.hasAttribute('data-close')){dialog.close();return;}if(b.dataset.go){location.href=b.dataset.go;return;}if(b.hasAttribute('data-print')){window.print();return;}
    if(b.classList.contains('course-tab-btn')){$$('.course-tab-btn').forEach(x=>x.setAttribute('aria-selected',String(x===b)));$$('.course-panel').forEach(p=>p.classList.toggle('hidden',p.id!==b.dataset.target));return;}
    if(b.dataset.category){category=b.dataset.category;filterCreatures();return;}if(b.dataset.sort){sort=b.dataset.sort;filterCreatures();return;}if(b.classList.contains('modal-open-btn')){speciesDetail(b.dataset.creature||'beluga');return;}
    if(b.hasAttribute('data-program-date')){selectedProgramDate=b.dataset.date;renderPrograms();return;}if(b.dataset.programFilter){programFilter=b.dataset.programFilter;renderPrograms();return;}
    if(b.dataset.programDetail){const p=data.programs.find(p=>p.id===b.dataset.programDetail);if(!p)return;modal(p.title,`<img class="aq-detail-image" src="${p.image}" alt="${esc(p.title)}"><p class="aq-eyebrow">${dateLabel(selectedProgramDate)} · ${esc(p.time.replace(/\s+/g,' '))}</p><p>${esc(p.description)}</p><p><strong>관람 위치</strong> · ${esc(p.zone)}</p><a class="aq-button" href="${linkDate(selectedProgramDate)}">이 날짜의 입장권 선택 →</a>`);return;}
    if(b.dataset.experience){const p=data.experiences.find(p=>p.id===b.dataset.experience);if(!p)return;modal(p.title,`<p>${esc(p.description)}</p><p class="aq-caption">실제 체험 예약 없이 신청 흐름을 확인합니다.</p><form class="aq-modal-form" data-experience-form="${p.id}"><label>참여 날짜<input type="date" name="date" min="${today()}" value="${selectedProgramDate}" required></label><label>참여 인원<input type="number" name="people" min="1" max="10" value="1" required></label><button class="aq-button" type="submit">선택 내용 확인하기</button></form>`);return;}
    if(b.hasAttribute('data-reminder')){try{localStorage.setItem('aquafolio:schedule',selectedProgramDate);toast(dateLabel(selectedProgramDate)+' 일정을 이 브라우저에 보관했습니다.');}catch{toast('이 브라우저에서는 일정을 보관할 수 없습니다.');}return;}
    if(b.classList.contains('date-chip')){selectedDate=b.dataset.date;month=dateAt(selectedDate);month.setUTCDate(1);renderTickets();return;}
    if(b.dataset.calendarDate){selectedDate=b.dataset.calendarDate;renderTickets();return;}
    if(b.dataset.calendarMonth){month.setUTCMonth(month.getUTCMonth()+Number(b.dataset.calendarMonth));renderCalendar();return;}
    if(b.classList.contains('qty-btn-plus')||b.classList.contains('qty-btn-minus')){const id=b.dataset.id;if(!(id in qty))return;qty[id]=Math.max(0,Math.min(10,qty[id]+(b.classList.contains('qty-btn-plus')&&totalQty()<10?1:b.classList.contains('qty-btn-minus')?-1:0)));renderTickets();return;}
    if(b.classList.contains('pay-method-btn')){$$('.pay-method-btn').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));return;}
    if(b.classList.contains('faq-toggle')){const item=b.closest('.faq-item'),open=b.getAttribute('aria-expanded')!=='true';b.setAttribute('aria-expanded',String(open));$('.faq-content',item).classList.toggle('hidden',!open);return;}
    if(b.id==='btn-submit-booking'){
      if(!totalQty()){toast('티켓을 1매 이상 선택해 주세요.');return;}const lines=Object.keys(qty).filter(k=>qty[k]).map(k=>`<div><dt>${data.prices[k].name} ${qty[k]}${k==='family'?'세트':'매'}</dt><dd>${money(qty[k]*data.prices[k].price)}</dd></div>`).join('');const payment=$('.pay-method-btn[aria-pressed="true"]')?.textContent.trim()||'선택한 결제 수단';
      modal('관람 티켓 선택 확인',`<p class="aq-eyebrow">${dateLabel(selectedDate)}</p><dl class="aq-detail-facts">${lines}<div><dt>합계</dt><dd>${money(ticketTotal())}</dd></div><div><dt>결제 수단 예시</dt><dd>${esc(payment)}</dd></div></dl><p>실제 결제·예약 접수·발권은 진행하지 않았습니다.</p><button class="aq-button" type="button" data-close>선택 내용으로 돌아가기</button>`);
    }
  });
  document.addEventListener('submit',e=>{const form=e.target;if(form.matches('[data-experience-form]')){e.preventDefault();if(!form.reportValidity())return;const date=$('[name=date]',form).value,people=$('[name=people]',form).value;if(!validDate(date)||date<today()){toast('오늘 이후 날짜를 선택해 주세요.');return;}const p=data.experiences.find(p=>p.id===form.dataset.experienceForm);modal('체험 선택 확인',`<p>${esc(p.title)} · ${dateLabel(date)} · ${esc(people)}인</p><p>실제 신청 접수 없이 선택 내용을 확인했습니다.</p><a class="aq-button" href="${linkDate(date)}">같은 날짜의 입장권 선택 →</a>`);}else if(form.id==='aquafolio-group-form'){e.preventDefault();if(!form.reportValidity())return;const date=$('[name=date]',form).value,people=$('[name=people]',form).value;if(!validDate(date)||date<today()){toast('오늘 이후의 관람일을 선택해 주세요.');return;}form.reset();modal('단체 관람 문의 확인',`<p>${dateLabel(date)} · ${esc(people)}인</p><p>실제 문의 접수 없이 화면 체험을 완료했습니다. 입력한 연락처는 저장하거나 전송하지 않았습니다.</p><a class="aq-button" href="aquafolio-guide.html">관람 가이드 보기 →</a>`);}});
  if($('#aquafolio-group-form'))$('#aquafolio-group-form input[name=date]').min=today();
  const header=$('.aq-header'),menu=$('.aq-menu-toggle'),nav=$('#aquafolio-navigation');function setMenu(open){menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'메뉴 닫기':'메뉴 열기');nav.classList.toggle('is-open',open);}
  const updateHeader=()=>document.documentElement.style.setProperty('--aquafolio-header-height',header.getBoundingClientRect().height+'px');new ResizeObserver(updateHeader).observe(header);updateHeader();menu.addEventListener('click',()=>setMenu(menu.getAttribute('aria-expanded')!=='true'));nav.addEventListener('click',e=>{if(e.target.closest('a'))setMenu(false);});document.addEventListener('click',e=>{if(!header.contains(e.target))setMenu(false);});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){setMenu(false);menu.focus();}});matchMedia('(min-width:1280px)').addEventListener('change',()=>setMenu(false));
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
  if(document.body.dataset.page==='creatures'&&Object.hasOwn(data.species,params.get('species')))speciesDetail(params.get('species'));
})();
