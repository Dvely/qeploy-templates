(() => {
  'use strict';
  const $=(s,parent=document)=>parent.querySelector(s);
  const $$=(s,parent=document)=>[...parent.querySelectorAll(s)];
  const data=window.PAGES_CONTENT;
  const params=new URLSearchParams(location.search);
  const kind=document.body.dataset.kind;
  const id=document.body.dataset.id;
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const money=n=>Number(n).toLocaleString('ko-KR')+'원';
  const book=key=>data.books.find(b=>b.id===key);
  const club=key=>data.clubs.find(c=>c.id===key);
  const event=key=>data.events.find(e=>e.id===key);
  const bounded=(n,max=99)=>Math.min(max,Math.max(1,Math.floor(Number(n)||1)));
  const url=(file,values={})=>file+'?'+new URLSearchParams(values).toString();
  const legacy=kind==='book'&&params.has('book')?book(params.get('book')):kind==='club'&&params.has('program')?club(params.get('program')):kind==='event'&&params.get('program')==='reading'?event('reading'):null;
  if(legacy&&legacy.url!==location.pathname.split('/').pop()){location.replace(legacy.url);return;}
  let toastTimer;
  function toast(text){const el=$('#pages-toast');el.textContent=text;el.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.hidden=true,3000);}
  const storage={read(key,fallback){try{return JSON.parse(localStorage.getItem('pages:'+key))??fallback;}catch{return fallback;}},write(key,value){try{localStorage.setItem('pages:'+key,JSON.stringify(value));}catch{toast('이 브라우저에서는 보관 내용이 유지되지 않습니다.');}}};
  const session={read(key){try{return JSON.parse(sessionStorage.getItem('pages:'+key));}catch{return null;}},write(key,value){try{sessionStorage.setItem('pages:'+key,JSON.stringify(value));return true;}catch{return false;}}};
  let rawCart=storage.read('cart',{});
  let cart=rawCart&&typeof rawCart==='object'&&!Array.isArray(rawCart)?Object.fromEntries(Object.entries(rawCart).filter(([key,n])=>book(key)&&Number.isInteger(n)&&n>0&&n<=99)):{};
  let saved=storage.read('saved',[]);
  saved=Array.isArray(saved)?saved.filter(item=>item&&(item.type==='book'?book(item.id):item.type==='club'?club(item.id):false)):[];
  let qty=1;
  const currentBook=book(id);
  const currentEvent=event(id);
  const primary=(href,label)=>`<a class="primary-button" href="${href}">${esc(label)} →</a>`;
  const empty=(title,desc,href,label)=>`<div class="d-empty"><h2>${esc(title)}</h2><p>${esc(desc)}</p>${primary(href,label)}</div>`;
  function persistCart(){storage.write('cart',cart);updateCartBadge();}
  function updateCartBadge(){$$('[data-path="cart"]').forEach(el=>el.setAttribute('aria-label',`장바구니 ${Object.values(cart).reduce((a,b)=>a+b,0)}권`));}
  function syncSaved(){$$('[data-save-item]').forEach(el=>{const[type,key]=el.dataset.saveItem.split(':');const active=saved.some(item=>item.type===type&&item.id===key);el.setAttribute('aria-pressed',String(active));$('span',el).textContent=active?'보관한 항목':'보관하기';});}
  function renderCart(){const area=$('[data-cart-page]');if(!area)return;const items=Object.entries(cart);if(!items.length){area.innerHTML=empty('장바구니가 비어 있습니다.','다음에 읽고 싶은 책을 한 권 골라 보세요.','pages-books.html','도서 둘러보기');return;}
    const total=items.reduce((sum,[key,n])=>sum+book(key).price*n,0);
    area.innerHTML=`<ul class="cart-list">${items.map(([key,n])=>{const b=book(key);return `<li><a href="${b.url}"><img src="${b.image}" alt="${esc(b.title)} 표지"></a><div><a href="${b.url}">${esc(b.title)}</a><small>${money(b.price)}</small><div class="quantity-control"><button type="button" data-cart-change="${key}" data-delta="-1" ${n===1?'disabled':''} aria-label="${esc(b.title)} 수량 감소">−</button><span>${n}</span><button type="button" data-cart-change="${key}" data-delta="1" ${n===99?'disabled':''} aria-label="${esc(b.title)} 수량 증가">+</button><button type="button" data-cart-remove="${key}">삭제</button></div></div><strong>${money(b.price*n)}</strong></li>`;}).join('')}</ul><div class="order-total"><span>무료 배송 · 합계</span><strong>${money(total)}</strong></div>${primary('pages-checkout.html?cart=1','선택 도서 주문하기')}`;
  }
  function renderSaved(){const area=$('[data-saved-page]');if(!area)return;if(!saved.length){area.innerHTML=empty('아직 보관한 문장이 없습니다.','도서와 모임의 보관 버튼으로 읽고 싶은 항목을 모아 보세요.','pages-books.html','서가 둘러보기');return;}
    area.innerHTML=`<ul class="cart-list">${saved.map(item=>{const value=item.type==='book'?book(item.id):club(item.id);return `<li><a href="${value.url}"><img src="${value.image}" alt="${esc(value.title)}"></a><div><a href="${value.url}">${esc(value.title)}</a><small>${money(value.price)}</small></div><button data-remove-saved="${item.type}:${item.id}" type="button">삭제</button></li>`;}).join('')}</ul>`;
  }
  const field=(label,name,type='text',required=true)=>`<label>${label}<input name="${name}" type="${type}" ${required?'required':''} maxlength="200"></label>`;
  const consent='<label class="check-label"><input type="checkbox" required> 실제 결제·예약 없이 신청 과정을 체험합니다.</label>';
  const localNote='<p class="d-caption">입력한 이름과 연락처는 저장하거나 전송하지 않습니다.</p>';
  function complete(selection){if(session.write('confirmation',selection)){location.href='pages-confirmation.html';return;}const area=$('[data-checkout-page],[data-booking-page],[data-reservation-page]');area.innerHTML=empty('신청 과정을 완료했습니다.','입력 정보를 저장하거나 전송하지 않았습니다.','index.html','페이지스 홈으로');}
  function renderCheckout(){const area=$('[data-checkout-page]');if(!area)return;
    const fromCart=params.get('cart')==='1';const requested=book(params.get('book'));
    const items=fromCart?Object.entries(cart):requested?[[requested.id,bounded(params.get('qty'))]]:[];
    if(!items.length){area.innerHTML=empty('주문할 도서를 골라 주세요.','장바구니에서 책을 담거나 도서 상세에서 주문을 시작해 보세요.','pages-books.html','서가 둘러보기');return;}
    const total=items.reduce((sum,[key,n])=>sum+book(key).price*n,0),gift=params.get('gift')==='1';
    area.innerHTML=`<div class="d-summary"><h3>${gift?'한 권의 책 선물':'선택한 도서'}</h3>${items.map(([key,n])=>`<p><a href="${book(key).url}">${esc(book(key).title)}</a> · ${n}권 · ${money(book(key).price*n)}</p>`).join('')}<div class="order-total"><span>무료 배송 · 합계</span><strong>${money(total)}</strong></div></div><form class="d-form" id="checkout-form"><div class="d-form-row">${field(gift?'받는 분 이름':'이름','name')}${field('안내받을 이메일','email','email')}</div>${field('배송지 예시','address')}${gift?'<label>함께 전할 문장<textarea name="message" maxlength="300" rows="3"></textarea></label>':''}${consent}<button class="primary-button" type="submit">체험 주문 완료</button>${localNote}</form>`;
    $('#checkout-form').addEventListener('submit',e=>{e.preventDefault();e.target.reset();if(fromCart){cart={};persistCart();}complete({kind:'order',items,total,gift});});
  }
  function renderBooking(){const area=$('[data-booking-page]');if(!area)return;
    const type=params.get('type');const selection=type==='club'?club(params.get('id')):type==='event'?event(params.get('id')):null;
    if(!selection){area.innerHTML=empty('함께 읽을 모임을 선택해 주세요.','모임 상세에서 일정과 참가 방식을 확인한 뒤 신청할 수 있습니다.','pages-clubs.html','북클럽 둘러보기');return;}
    let option=params.get('option')==='online'?'online':'offline';const maximum=Math.min(type==='club'?selection.remaining:option==='online'?5:selection.remaining,5);
    const price=()=>type==='event'&&option==='online'?selection.onlinePrice:selection.price;
    area.innerHTML=`<div class="d-summary"><h3><a href="${selection.url}">${esc(selection.title)}</a></h3><p>${esc(type==='club'?selection.schedule:selection.date+' '+selection.time)}</p><p>${esc(type==='club'?selection.duration:'작가 북토크 & 낭독')}</p></div><form class="d-form" id="booking-form">${type==='event'?`<label>참여 방식<select name="option"><option value="offline" ${option==='offline'?'selected':''}>현장 참여 · ${money(selection.price)}</option><option value="online" ${option==='online'?'selected':''}>온라인 라이브 · ${money(selection.onlinePrice)}</option></select></label>`:''}<label>참가 인원<select name="people">${Array.from({length:maximum},(_,i)=>`<option value="${i+1}">${i+1}명</option>`).join('')}</select></label><div class="d-form-row">${field('참가자 이름','name')}${field('안내받을 이메일','email','email')}</div><label>나누고 싶은 질문 (선택)<textarea name="question" rows="3" maxlength="500"></textarea></label><div class="order-total"><span>총 신청 금액</span><strong id="booking-total">${money(price())}</strong></div>${consent}<button class="primary-button" type="submit">체험 참가 신청 완료</button>${localNote}</form>`;
    const form=$('#booking-form');const update=()=>{$('#booking-total').textContent=money(price()*Number(form.elements.people.value));};
    form.elements.people.addEventListener('change',update);
    form.elements.option?.addEventListener('change',()=>{option=form.elements.option.value;update();});
    form.addEventListener('submit',e=>{e.preventDefault();const count=Number(form.elements.people.value),total=price()*count;form.reset();complete({kind:'booking',type,id:selection.id,option,qty:count,total});});
  }
  const today=()=>{const d=new Date();return[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');};
  function renderReservation(){const area=$('[data-reservation-page]');if(!area)return;const initial=data.lounges.find(l=>l.id===params.get('lounge'))||data.lounges[0];
    area.innerHTML=`<form class="d-form" id="reservation-form"><label>공간<select name="lounge">${data.lounges.map(l=>`<option value="${l.id}" ${l.id===initial.id?'selected':''}>${esc(l.name)} · ${money(l.price)} / 2시간</option>`).join('')}</select></label><p><a id="reservation-lounge-link" href="pages-lounge-${initial.id}.html">선택한 공간 자세히 보기 →</a></p><div class="d-form-row"><label>이용 날짜<input name="date" type="date" min="${today()}" required></label><label>시간<select name="slot"><option value="10:00">10:00–12:00</option><option value="14:00">14:00–16:00</option><option value="18:00">18:00–20:00</option></select></label></div><label>참가 인원<input name="people" type="number" value="2" min="1" max="${initial.capacity}" required></label><div class="d-form-row">${field('담당자 이름','name')}${field('안내받을 이메일','email','email')}</div><label>모임 소개 (선택)<textarea name="purpose" maxlength="1000" rows="3"></textarea></label><div class="order-total"><span>2시간 대관 금액</span><strong id="reservation-total">${money(initial.price)}</strong></div>${consent}<button class="primary-button" type="submit">체험 대관 신청 완료</button>${localNote}</form>`;
    const form=$('#reservation-form');form.elements.lounge.addEventListener('change',()=>{const l=data.lounges.find(l=>l.id===form.elements.lounge.value);form.elements.people.max=l.capacity;form.elements.people.value=Math.min(Number(form.elements.people.value),l.capacity);$('#reservation-total').textContent=money(l.price);$('#reservation-lounge-link').href='pages-lounge-'+l.id+'.html';});
    form.elements.date.addEventListener('input',()=>form.elements.date.setCustomValidity(form.elements.date.value<today()?'오늘 이후 날짜를 선택해 주세요.':''));
    form.addEventListener('submit',e=>{e.preventDefault();const l=data.lounges.find(l=>l.id===form.elements.lounge.value);const selection={kind:'reservation',id:l.id,date:form.elements.date.value,slot:form.elements.slot.value,qty:Number(form.elements.people.value),total:l.price};form.reset();complete(selection);});
  }
  function renderConfirmation(){const area=$('[data-confirmation-page]');if(!area)return;const selection=session.read('confirmation');
    const valid=selection&&Number.isFinite(selection.total)&&selection.total>=0&&(['order','booking','reservation'].includes(selection.kind));
    if(!valid){area.innerHTML=empty('아직 확인할 신청이 없습니다.','선택한 책이나 모임에서 신청 과정을 시작해 보세요.','pages-books.html','서가 둘러보기');return;}
    let summary='',href='index.html',edit='';
    if(selection.kind==='order'&&Array.isArray(selection.items)&&selection.items.every(([key,n])=>book(key)&&Number.isInteger(n)&&n>0&&n<=99)){summary=selection.items.map(([key,n])=>`<p><a href="${book(key).url}">${esc(book(key).title)}</a> · ${n}권</p>`).join('');href=book(selection.items[0][0]).url;}
    else if(selection.kind==='booking'){const s=selection.type==='club'?club(selection.id):event(selection.id);if(!s){area.innerHTML=empty('신청 정보를 다시 선택해 주세요.','현재 프로그램을 확인할 수 없습니다.','pages-clubs.html','모임 보기');return;}summary=`<h3>${esc(s.title)}</h3><p>${selection.qty}명 · ${selection.option==='online'?'온라인 라이브':selection.type==='club'?'독서 모임':'현장 참여'}</p><p>${esc(selection.type==='club'?s.schedule:s.date+' '+s.time)}</p>`;href=s.url;edit=url('pages-booking.html',{type:selection.type,id:selection.id,option:selection.option});}
    else if(selection.kind==='reservation'){const l=data.lounges.find(l=>l.id===selection.id);if(!l){area.innerHTML=empty('공간을 다시 선택해 주세요.','현재 공간을 확인할 수 없습니다.','pages-lounges.html','공간 보기');return;}summary=`<h3>${esc(l.name)}</h3><p>${esc(selection.date)} · ${esc(selection.slot)} · ${selection.qty}명</p>`;href='pages-lounge-'+l.id+'.html';edit='pages-reservation.html?lounge='+l.id;}
    else{area.innerHTML=empty('신청 내용을 확인할 수 없습니다.','책과 모임에서 다시 선택해 주세요.','index.html','홈으로');return;}
    area.innerHTML=`<p class="eyebrow">NEXT PAGE CONFIRMED</p><h2>체험 신청이 완료되었습니다.</h2><div class="d-summary">${summary}<div class="order-total"><span>선택 금액</span><strong>${money(selection.total)}</strong></div></div><p>실제 결제와 예약은 진행되지 않았습니다. 입력한 이름과 연락처는 저장하거나 전송하지 않았습니다.</p>${primary(href,'선택 항목 다시 보기')}${edit?`<a class="secondary-button" href="${edit}">신청 다시 선택하기</a>`:''}`;
  }
  const dialog=$('#detail-dialog');
  function openDialog(title,html){$('#detail-dialog-title').textContent=title;$('#detail-dialog-body').innerHTML=html;dialog.showModal();}
  document.addEventListener('click',async e=>{const el=e.target.closest('button,a');if(!el)return;
    if(el.dataset.quantity){qty=bounded(qty+Number(el.dataset.quantity));$('#d-quantity').value=qty;$$('[data-quantity]').forEach(btn=>btn.disabled=(Number(btn.dataset.quantity)===-1&&qty===1)||(Number(btn.dataset.quantity)===1&&qty===99));$('[data-buy-book]').href=url('pages-checkout.html',{book:id,qty});return;}
    if(el.dataset.addBook){const b=book(el.dataset.addBook);if(!b)return;cart[b.id]=Math.min(99,(cart[b.id]||0)+(kind==='book'&&b.id===id?qty:1));persistCart();toast('『'+b.title+'』을 장바구니에 담았습니다.');return;}
    if(el.dataset.cartChange){cart[el.dataset.cartChange]=bounded(cart[el.dataset.cartChange]+Number(el.dataset.delta));persistCart();renderCart();return;}
    if(el.dataset.cartRemove){delete cart[el.dataset.cartRemove];persistCart();renderCart();return;}
    if(el.dataset.saveItem){const[type,key]=el.dataset.saveItem.split(':');const exists=saved.some(item=>item.type===type&&item.id===key);saved=exists?saved.filter(item=>!(item.type===type&&item.id===key)):[...saved,{type,id:key}];storage.write('saved',saved);syncSaved();toast(exists?'보관함에서 삭제했습니다.':'나의 서재에 보관했습니다.');return;}
    if(el.dataset.removeSaved){const[type,key]=el.dataset.removeSaved.split(':');saved=saved.filter(item=>!(item.type===type&&item.id===key));storage.write('saved',saved);renderSaved();return;}
    if(el.hasAttribute('data-clear-reading')){openDialog('서재 비우기','<p>현재 브라우저에 보관한 도서·모임과 장바구니를 비웁니다.</p><button class="primary-button" data-confirm-clear type="button">비우기</button><button class="secondary-button" data-close-dialog type="button">취소</button>');return;}
    if(el.hasAttribute('data-confirm-clear')){cart={};saved=[];persistCart();storage.write('saved',saved);syncSaved();renderSaved();dialog.close();toast('장바구니와 보관함을 비웠습니다.');return;}
    if(el.hasAttribute('data-logout')){session.write('reader',false);toast('체험 로그인을 종료했습니다.');return;}
    if(el.dataset.gallerySrc){$('#d-gallery-main').src=el.dataset.gallerySrc;$$('[data-gallery-src]').forEach(btn=>btn.setAttribute('aria-pressed',String(btn===el)));return;}
    if(el.dataset.copy){try{await navigator.clipboard.writeText(el.dataset.copy);toast('문장을 복사했습니다.');}catch{openDialog('마음에 남은 문장',`<textarea readonly aria-label="복사할 문장">${esc(el.dataset.copy)}</textarea>`);$('textarea',dialog).select();}return;}
    if(el.hasAttribute('data-close-dialog'))dialog.close();
    if(el.hasAttribute('data-categories')){location.href='pages-books.html';return;}
  });
  if(currentEvent)$$('input[name="ticket"]').forEach(input=>input.addEventListener('change',()=>{const option=$('input[name="ticket"]:checked').value;$('[data-ticket-total]').textContent=money(option==='online'?currentEvent.onlinePrice:currentEvent.price);$('[data-event-booking]').href=url('pages-booking.html',{type:'event',id,option});}));
  $$('[data-review-form]').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();const article=document.createElement('article'),stars=document.createElement('p'),text=document.createElement('p'),by=document.createElement('small');stars.textContent='★'.repeat(Number(form.elements.rating.value));text.textContent=form.elements.review.value;by.textContent='나의 독서 기록';article.append(stars,text,by);$('[data-review-list]').append(article);form.reset();toast('한 문장의 기록을 남겼습니다.');}));
  $$('[data-demo-form]').forEach(form=>{const count=form.elements.people;if(count){count.min=1;count.max=500;}form.addEventListener('submit',e=>{e.preventDefault();const type=form.dataset.demoForm;form.reset();if(['login','signup'].includes(type)){session.write('reader',true);location.href='pages-mypage.html';return;}const result=$('.d-form-result',form);result.textContent='제안 내용을 확인했습니다. 실제 접수 없이 체험을 완료했으며 입력 내용을 저장하거나 전송하지 않았습니다.';result.hidden=false;result.focus();});});
  $$('[data-search]').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();location.href=url('pages-search.html',{q:$('input',form).value});}));
  let category='all';
  function filterCatalog(){const cards=$$('[data-catalog-card]');if(!cards.length||!$('[data-catalog-count]'))return;const q=($('[data-catalog-search]')?.value||'').trim().toLocaleLowerCase();let count=0;cards.forEach(card=>{const visible=(!q||card.dataset.search.toLocaleLowerCase().includes(q))&&(category==='all'||card.dataset.category===category);card.hidden=!visible;if(visible)count++;});$('[data-catalog-count]').textContent=count+'개의 책과 프로그램';$('[data-catalog-empty]').hidden=count>0;}
  $('[data-catalog-search]')?.addEventListener('input',filterCatalog);
  $$('[data-catalog-category]').forEach(btn=>btn.addEventListener('click',()=>{category=btn.dataset.catalogCategory;$$('[data-catalog-category]').forEach(el=>el.setAttribute('aria-pressed',String(el===btn)));filterCatalog();}));
  $('[data-catalog-sort]')?.addEventListener('change',e=>{const parent=$('[data-catalog-card]')?.parentElement;if(!parent)return;const direction=e.target.value==='high'?-1:1;const cards=$$('[data-catalog-card]');cards.forEach((card,i)=>card.dataset.order??=i);cards.sort((a,b)=>e.target.value==='recommended'?Number(a.dataset.order)-Number(b.dataset.order):(Number(a.dataset.price)-Number(b.dataset.price))*direction).forEach(card=>parent.append(card));});
  if($('[data-catalog-search]')&&params.has('q'))$('[data-catalog-search]').value=params.get('q');filterCatalog();
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
  renderCart();renderSaved();renderCheckout();renderBooking();renderReservation();renderConfirmation();syncSaved();updateCartBadge();
})();
