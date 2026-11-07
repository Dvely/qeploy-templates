(()=>{
 'use strict';
 const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>Array.from(r.querySelectorAll(s));
 const {services,products}=JSON.parse($('#ongil-data').textContent);
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,behavior=reduced?'instant':'smooth';
 let timer;function toast(text){$('.toast').textContent=text;clearTimeout(timer);timer=setTimeout(()=>$('.toast').textContent='',4200);}
 const menu=$('#mobile-menu'),toggle=$('.menu-button');
 function menuState(open){menu.hidden=!open;toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'전체 메뉴 닫기':'전체 메뉴 열기');document.body.classList.toggle('menu-open',open);$$('main,.footer,.contact-band,.to-top').forEach(el=>el.inert=open);if(open)$('a',menu).focus();}
 toggle.addEventListener('click',()=>menuState(toggle.getAttribute('aria-expanded')!=='true'));
 document.addEventListener('keydown',event=>{
  if(menu.hidden)return;
  if(event.key==='Escape'){menuState(false);toggle.focus();}
  if(event.key==='Tab'){const first=toggle,last=$$('a',menu).at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}
 });
 matchMedia('(min-width:901px)').addEventListener('change',event=>{if(event.matches)menuState(false);});
 $('.to-top').addEventListener('click',()=>scrollTo({top:0,behavior}));
 if('IntersectionObserver' in window&&!reduced){document.documentElement.classList.add('motion-ready');const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.08});$$('.reveal').forEach(el=>observer.observe(el));}
 $$('[data-point]').forEach(button=>button.addEventListener('click',()=>{
  const service=services.find(s=>s.id===button.dataset.point);if(!service)return;
  $$('[data-point]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.point===service.id)));
  $('#hero-readout p').textContent=service.short;$('#hero-readout a').href=`service-${service.id}.html`;
 }));
 const storageKey='ongil-safe-products-v1';
 function loadSaved(){try{const data=JSON.parse(localStorage.getItem(storageKey)||'[]');return Array.isArray(data)?[...new Set(data.filter(id=>products.some(p=>p.id===id)))].slice(0,4):[];}catch{return [];}}
 function writeSaved(ids){try{localStorage.setItem(storageKey,JSON.stringify(ids));return true;}catch{toast('브라우저 저장이 차단되어 관심 제품을 보관하지 못했습니다.');return false;}}
 let saved=loadSaved();
 function renderSaved(){
  $$('[data-saved-count]').forEach(el=>el.textContent=saved.length);
  $$('[data-save],[data-save-text]').forEach(button=>{const id=button.dataset.save||button.dataset.saveText,p=products.find(p=>p.id===id),active=saved.includes(id);button.setAttribute('aria-pressed',String(active));if(button.dataset.saveText)button.textContent=active?'관심 제품 해제 −':'관심 제품 담기 +';else button.setAttribute('aria-label',`${p.name} 관심 제품 ${active?'해제':'담기'}`);});
  const list=$('.selected-list');
  if(list){list.replaceChildren();if(!saved.length){const text=document.createElement('p');text.className='note';text.textContent='아직 관심 제품이 없습니다. 제품 이미지의 보관 아이콘을 눌러보세요.';list.append(text);}else saved.forEach(id=>{const p=products.find(p=>p.id===id),chip=document.createElement('div'),a=document.createElement('a'),remove=document.createElement('button');chip.className='selected-chip';a.href=`product-${id}.html`;a.textContent=p.name;remove.textContent='×';remove.dataset.remove=id;remove.setAttribute('aria-label',`${p.name} 관심 목록에서 제거`);chip.append(a,remove);list.append(chip);});$('[data-clear-saved]').disabled=saved.length===0;}
 }
 document.addEventListener('click',event=>{
  const button=event.target.closest('[data-save],[data-save-text],[data-remove],[data-clear-saved]');if(!button)return;
  const id=button.dataset.save||button.dataset.saveText||button.dataset.remove;
  let next;
  if(button.hasAttribute('data-clear-saved'))next=[];
  else if(saved.includes(id))next=saved.filter(x=>x!==id);
  else{if(saved.length>=4){toast('최대 4개까지 보관할 수 있습니다. 관심 목록에서 다른 제품을 먼저 해제해 주세요.');return;}next=[...saved,id];}
  if(writeSaved(next)){saved=next;renderSaved();toast('관심 제품을 업데이트했습니다.');}
 });
 window.addEventListener('storage',event=>{if(event.key===storageKey){saved=loadSaved();renderSaved();}});renderSaved();
 const productFilters=$('[data-filter-group="products"]');
 if(productFilters){let category='전체';const search=$('#product-search');function filter(){let count=0;$$('.product-card').forEach(card=>{card.hidden=(category!=='전체'&&card.dataset.category!==category)||!card.dataset.search.toLocaleLowerCase().includes(search.value.trim().toLocaleLowerCase());if(!card.hidden)count++;});$('#product-count').textContent=`${count}개의 제품 콘셉트`;$('#product-empty').hidden=count!==0;}
  $$('[data-filter]',productFilters).forEach(button=>button.addEventListener('click',()=>{category=button.dataset.filter;$$('[data-filter]',productFilters).forEach(el=>el.setAttribute('aria-pressed',String(el===button)));filter();}));search.addEventListener('input',filter);$('.search').addEventListener('submit',event=>{event.preventDefault();filter();});
 }
 for(const kind of ['cases','news']){const group=$(`[data-filter-group="${kind}"]`);if(!group)continue;$$('[data-filter]',group).forEach(button=>button.addEventListener('click',()=>{let count=0;$$('[data-filter]',group).forEach(el=>el.setAttribute('aria-pressed',String(el===button)));$$(kind==='cases'?'.case-card':'.news-row').forEach(card=>{card.hidden=button.dataset.filter!=='전체'&&card.dataset.category!==button.dataset.filter;if(!card.hidden)count++;});if(kind==='cases')$('#case-count').textContent=`${count}개의 가상 사례`;}));}
 if(document.body.dataset.page==='contact'){
  const query=new URLSearchParams(location.search),queryService=query.get('service'),queryProduct=query.get('product');
  const selectedProducts=[...new Set([...(products.some(p=>p.id===queryProduct)?[queryProduct]:[]),...saved])].slice(0,4);
  const selection={service:services.some(s=>s.id===queryService)?queryService:'',space:''};
  let step=1,draft='';const company=$('#company-name'),email=$('#reply-email'),message=$('#inquiry-message');
  function summary(){
   $('[data-summary="service"]').textContent=services.find(s=>s.id===selection.service)?.name||'선택해 주세요';
   $('[data-summary="space"]').textContent=selection.space||'선택해 주세요';
   $('[data-summary="products"]').textContent=selectedProducts.map(id=>products.find(p=>p.id===id).name).join(', ')||'없음';
   $$('[data-service]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.service===selection.service)));
  }
  function showStep(next){step=next;$$('[data-step]').forEach(el=>el.hidden=Number(el.dataset.step)!==step);$$('[data-step-label]').forEach(el=>{if(Number(el.dataset.stepLabel)===Math.min(step,3))el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');});const heading=$(`[data-step="${step}"] h2`);heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});$('.stepper').scrollIntoView({behavior,block:'start'});}
  $$('[data-service]').forEach(button=>button.addEventListener('click',()=>{selection.service=button.dataset.service;$('#step-one-error').textContent='';summary();}));
  $('#space-type').addEventListener('change',event=>{selection.space=event.target.value;summary();});
  message.addEventListener('input',()=>$('#character-count').textContent=`${message.value.length} / 3000자`);
  function renderDraft(){
   const parts=[['서비스',services.find(s=>s.id===selection.service).name],['공간',selection.space],['관심 제품',selectedProducts.map(id=>products.find(p=>p.id===id).name).join(', ')||'없음'],['회사·기관명 (예시)',company.value.trim()],['이메일 (예시)',email.value.trim()||'미입력'],['궁금한 내용',message.value.trim()]];
   const container=$('#draft-review');container.replaceChildren();
   for(const [title,text]of parts){const h=document.createElement('h3'),p=document.createElement('p');h.textContent=title;p.textContent=text;container.append(h,p);}
   draft='온길 세이프 · 문의 초안 시연\n실제 문의는 전송되지 않았습니다.\n\n'+parts.map(([title,text])=>`${title}\n${text}`).join('\n\n');
  }
  $$('[data-next]').forEach(button=>button.addEventListener('click',()=>{
   const next=Number(button.dataset.next);
   if(next===2&&(!selection.service||!selection.space)){$('#step-one-error').textContent='서비스와 공간의 쓰임을 모두 선택해 주세요.';return;}
   if(next===3){if(company.value.trim().length<2||message.value.trim().length<10||!email.checkValidity()){$('#step-two-error').textContent='회사·기관명은 2자 이상, 내용은 10자 이상 작성해 주세요. 이메일을 입력했다면 형식을 확인해 주세요.';return;}$('#step-two-error').textContent='';$('#demo-ack').checked=false;renderDraft();}
   showStep(next);
  }));
  $$('[data-back]').forEach(button=>button.addEventListener('click',()=>showStep(Number(button.dataset.back))));
  $('#finish-draft').addEventListener('click',()=>{if(!$('#demo-ack').checked){$('#step-three-error').textContent='실제 전송이 없는 시연임을 확인해 주세요.';return;}$('#step-three-error').textContent='';showStep(4);});
  $('#download-draft').addEventListener('click',()=>{if(!draft)return;const url=URL.createObjectURL(new Blob(['\uFEFF'+draft],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='ongil-inquiry-draft.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('문의 초안을 기기에 내려받습니다. 실제 전송은 없습니다.');});
  $('#restart-draft').addEventListener('click',()=>{company.value='';email.value='';message.value='';$('#character-count').textContent='0 / 3000자';$('#demo-ack').checked=false;$('#draft-review').replaceChildren();draft='';$$('.error').forEach(el=>el.textContent='');selection.service='';selection.space='';$('#space-type').value='';summary();showStep(1);});
  summary();
 }
})();
