(() => {
  'use strict';
  const $ = (s, p = document) => p.querySelector(s), $$ = (s, p = document) => [...p.querySelectorAll(s)];
  const items = window.CRAFT_ROAST, item = id => items.find(x => x.id === id);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const money = n => n.toLocaleString('ko-KR') + '원';
  const storage = {read(key, fallback){try{return JSON.parse(localStorage.getItem('craft-roast:' + key)) ?? fallback;}catch{return fallback;}}, write(key, value){try{localStorage.setItem('craft-roast:' + key, JSON.stringify(value));}catch{toast('이 브라우저에서는 보관 내용이 유지되지 않습니다.');}}};
  let cart = storage.read('cart', []), saved = storage.read('saved', []);
  cart = Array.isArray(cart) ? cart.filter(x => x && item(x.id) && Number.isInteger(x.quantity) && x.quantity > 0 && x.quantity <= 99 && Number.isInteger(x.unit) && x.unit > 0 && x.unit < 1000000 && typeof x.options === 'string') : [];
  saved = Array.isArray(saved) ? saved.filter(id => item(id)) : [];
  let quantity = 1, mode = 'onetime', grind = '홀빈 (원두 그대로)', extras = new Map(), region = 'all', facilities = new Set(), toastTimer;
  const dialog = $('#craft-dialog'), status = $('#craft-status');
  function toast(text){status.textContent = text;status.hidden = false;clearTimeout(toastTimer);toastTimer = setTimeout(() => status.hidden = true, 3000);}
  function modal(title, html){$('#craft-dialog-title').textContent = title;$('#craft-dialog-body').innerHTML = html;if(!dialog.open)dialog.showModal();}
  function syncCart(){storage.write('cart', cart);$$('[data-path="cart"]').forEach(a => a.setAttribute('aria-label', '장바구니 ' + cart.reduce((n,x) => n+x.quantity, 0) + '개'));}
  function syncSaved(){$$('[data-save]').forEach(b => b.setAttribute('aria-pressed', String(saved.includes(b.dataset.save))));}
  function menuPrice(){const form = $('#orderConfigForm');if(!form)return 12800;return 12800 + ($('input[name="beanOption"]:checked',form)?.value === 'decaf' ? 500 : 0) + ({oat:600,lactose_free:400}[$('input[name="milkOption"]:checked',form)?.value] || 0) + ($('#shotSelect')?.value === '1' ? 700 : 0) + [...extras.values()].reduce((a,b) => a+b,0);}
  function updatePrice(){if($('#totalPriceDisplay'))$('#totalPriceDisplay').textContent = menuPrice().toLocaleString('ko-KR');if($('#btnOrderText'))$('#btnOrderText').textContent = '선택한 매장으로 스마트 오더 (' + money(menuPrice()) + ')';$$('[data-bean-price]').forEach(p => p.textContent = (34200 * (mode==='sub' ? .9 : 1) * quantity).toLocaleString('ko-KR'));if($('#qty-display'))$('#qty-display').textContent = quantity;$$('[data-quantity="-1"]').forEach(b => b.disabled = quantity === 1);}
  function selection(id){let options = '', unit = item(id).price, count = 1;if(id === 'caramel-pair'){unit = menuPrice();const form=$('#orderConfigForm'),values=form?new FormData(form):null,labels={iced:'아이스',hot:'따뜻하게',classic:'클래식 원두',decaf:'디카페인',whole:'일반 우유',oat:'오트밀크',lactose_free:'락토프리 우유',dine_in:'매장 이용',takeout:'포장'};options=values?[...values.entries()].map(([key,value])=>key==='shots'?'샷 '+(value==='1'?'추가':value==='-1'?'연하게':'기본'):key==='sweetness'?'당도 '+value+'%':labels[value]||'기본 구성').join(' · '):'기본 구성';if(extras.size)options+=' · 추가 페어링 '+extras.size+'개';}if(id === 'geisha'){unit = mode==='sub' ? 30780 : 34200;count=quantity;options=(mode==='sub'?'정기구독':'1회 구매')+' · '+grind;}return {id,unit,quantity:count,options};}
  function add(id){if(!item(id))return;const line=selection(id),existing=cart.find(x=>x.id===line.id&&x.options===line.options&&x.unit===line.unit);if(existing)existing.quantity=Math.min(99,existing.quantity+line.quantity);else cart.push(line);syncCart();toast('장바구니에 담았습니다.');}
  function cartPanel(){modal('나의 커피 장바구니',cart.length ? '<ul class="cr-cart">'+cart.map((x,i)=>'<li><img src="'+item(x.id).image+'" alt=""><div><strong>'+esc(item(x.id).title)+'</strong><small>'+esc(x.options)+'</small><span>'+money(x.unit*x.quantity)+'</span><div class="cr-quantity"><button type="button" data-cart-change="'+i+'" data-delta="-1" aria-label="수량 감소">−</button><span>'+x.quantity+'</span><button type="button" data-cart-change="'+i+'" data-delta="1" aria-label="수량 증가">+</button></div></div><button type="button" data-cart-remove="'+i+'">삭제</button></li>').join('')+'</ul><div class="cr-total"><span>총 상품 금액</span><strong>'+money(cart.reduce((n,x)=>n+x.unit*x.quantity,0))+'</strong></div><button class="cr-primary" type="button" data-checkout>주문 확인하기 →</button>' : '<div class="cr-empty"><p>장바구니가 비어 있습니다.</p><a class="cr-primary" href="index.html#signature-grid">시그니처 메뉴 둘러보기</a></div>');}
  let pending = [];
  function checkout(lines){pending=lines.map(x=>({...x}));const beans=lines.some(x=>x.id==='geisha'),cake=lines.some(x=>item(x.id).category==='wholecake');const date=new Date();if(cake)date.setDate(date.getDate()+2);const min=new Date(date.getTime()-date.getTimezoneOffset()*60000).toISOString().slice(0,10);
    modal('선택한 주문 확인','<div class="cr-summary">'+lines.map(x=>'<p>'+esc(item(x.id).title)+' × '+x.quantity+'<br><small>'+esc(x.options)+'</small></p>').join('')+'<strong>'+money(lines.reduce((n,x)=>n+x.unit*x.quantity,0))+'</strong></div><form class="cr-form" data-demo-order><label>이름<input name="name" required maxlength="50" autocomplete="name"></label><label>이메일<input name="email" type="email" required autocomplete="email"></label>'+(beans?'<label>배송 주소<input name="address" required maxlength="200" autocomplete="street-address"></label>':'<label>픽업 매장<select name="store"><option>성수 아틀리에</option><option>한남 살롱</option><option>북촌 헤리티지</option></select></label><label>픽업 날짜<input name="date" type="date" min="'+min+'" required></label>')+'<label class="cr-check"><input type="checkbox" required> 실제 결제와 접수 없이 주문 과정을 체험합니다.</label><button class="cr-primary" type="submit">주문 체험 완료</button><p class="cr-caption">입력한 연락처와 주소는 저장하거나 전송하지 않습니다.</p></form>');}
  const panels = {
    login:['멤버십 로그인','<form class="cr-form" data-local-form="login"><label>이메일<input type="email" required autocomplete="email"></label><label>비밀번호<input type="password" required autocomplete="current-password"></label><button class="cr-primary" type="submit">체험 로그인</button><p class="cr-caption">실제 계정 연결 없이 화면을 체험합니다.</p></form>'],
    information:['이용과 원산지 안내','<p>크래프트 앤 로스트는 가상의 카페 브랜드입니다. 상품 가격·원산지·매장·가맹 비용은 디자인을 위한 예시이며 실제 주문과 상담 접수는 제공하지 않습니다.</p><p>장바구니에는 상품과 옵션, 수량만 저장합니다. 입력한 개인정보는 저장하거나 전송하지 않습니다.</p>'],
    subscription:['새로운 산지를 만나는 구독','<p>게이샤 원두 정기구독 옵션을 선택하면 상품 금액에서 10% 할인된 예시 가격을 확인할 수 있습니다. 실제 정기 결제나 배송은 발생하지 않습니다.</p><a class="cr-primary" href="craft-roast-beans.html?mode=sub">구독 구성 선택하기 →</a>'],
    'order-guide':['기다림 없는 스토어 오더','<ol><li>메뉴와 페어링을 고릅니다.</li><li>원두, 우유와 온도를 선택합니다.</li><li>픽업 매장과 날짜를 고르고 주문 체험을 완료합니다.</li></ol><a class="cr-primary" href="craft-roast-menu.html">메뉴 주문 살펴보기 →</a>'],
    'store-choice':['나의 픽업 매장','<p>주문 확인 단계에서 성수·한남·북촌 중 원하는 픽업 매장을 선택할 수 있습니다.</p><a class="cr-primary" href="craft-roast-stores.html#store-locator">매장과 공간 찾기 →</a>'],
    review:['나의 테이스팅 기록','<form class="cr-form" data-local-form="review"><label>만족도<select><option>★★★★★</option><option>★★★★☆</option><option>★★★☆☆</option></select></label><label>기록할 한 문장<textarea required minlength="5" maxlength="500" rows="4"></textarea></label><button class="cr-primary" type="submit">기록 확인하기</button><p class="cr-caption">현재 화면에서만 확인하며 전송되지 않습니다.</p></form>'],
    reviews:['함께 남긴 브루잉 기록','<p>꽃향기와 과일의 산미, 부드러운 여운을 비교해 보세요. 화면에 표시된 후기는 디자인을 위한 예시입니다.</p><button class="cr-primary" type="button" data-panel="review">나의 기록 작성하기</button>']
  };
  document.addEventListener('click',event=>{
    const el=event.target.closest('button,a');if(!el)return;
    if(el.hasAttribute('data-close')){dialog.close();return;}
    if(el.dataset.panel){event.preventDefault();if(el.dataset.panel==='cart')cartPanel();else if(panels[el.dataset.panel])modal(...panels[el.dataset.panel]);return;}
    if(el.dataset.go){location.href=el.dataset.go;return;}
    if(el.dataset.detail){const x=item(el.dataset.detail);modal(x.title,'<img class="cr-detail-image" src="'+x.image+'" alt="'+esc(x.title)+'"><p>'+esc(x.description||'계절의 풍미를 담은 시그니처 메뉴입니다.')+'</p><strong class="cr-price">'+money(x.price)+'</strong><div class="cr-modal-actions"><button type="button" class="cr-primary" data-item="'+x.id+'" data-order>픽업 주문하기</button><button type="button" class="cr-secondary" data-item="'+x.id+'" data-add>장바구니 담기</button></div>');return;}
    if(el.hasAttribute('data-add')){add(el.dataset.item);return;}
    if(el.hasAttribute('data-order')){checkout([selection(el.dataset.item)]);return;}
    if(el.hasAttribute('data-checkout')){checkout(cart);return;}
    if(el.hasAttribute('data-cart-remove')){cart.splice(Number(el.dataset.cartRemove),1);syncCart();cartPanel();return;}
    if(el.hasAttribute('data-cart-change')){const x=cart[Number(el.dataset.cartChange)];if(x)x.quantity=Math.max(1,Math.min(99,x.quantity+Number(el.dataset.delta)));syncCart();cartPanel();return;}
    if(el.dataset.menuFilter){$$('[data-menu-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===el)));$$('.menu-card').forEach(c=>c.hidden=el.dataset.menuFilter!=='all'&&c.dataset.category!==el.dataset.menuFilter);return;}
    if(el.dataset.purchaseMode){mode=el.dataset.purchaseMode;$$('[data-purchase-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b===el)));$('#sub-details-box')?.classList.toggle('hidden',mode!=='sub');updatePrice();return;}
    if(el.dataset.grind){grind=el.dataset.grind;$$('[data-grind]').forEach(b=>b.setAttribute('aria-pressed',String(b===el)));$('#selected-grind-name').textContent=grind;$('#grind-guide-text').textContent=el.dataset.grindDescription;return;}
    if(el.dataset.quantity){quantity=Math.max(1,Math.min(99,quantity+Number(el.dataset.quantity)));updatePrice();return;}
    if(el.hasAttribute('data-pairing-extra')){const selected=el.getAttribute('aria-pressed')==='true';el.setAttribute('aria-pressed',String(!selected));if(selected)extras.delete(el);else extras.set(el,Number(el.dataset.pairingExtra));el.textContent=selected?'+ 페어링 추가':'✓ 페어링 추가됨';updatePrice();return;}
    if(el.dataset.save){saved=saved.includes(el.dataset.save)?saved.filter(x=>x!==el.dataset.save):[...saved,el.dataset.save];storage.write('saved',saved);syncSaved();toast(saved.includes(el.dataset.save)?'원두를 보관했습니다.':'보관을 해제했습니다.');return;}
    if(el.hasAttribute('data-subscribe')){mode='sub';$$('[data-purchase-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.purchaseMode==='sub')));$('#sub-details-box')?.classList.remove('hidden');updatePrice();checkout([selection('geisha')]);return;}
    if(el.hasAttribute('data-print')){window.print();return;}
    if(el.classList.contains('store-filter-region')){region=el.dataset.region;$$('.store-filter-region').forEach(b=>b.setAttribute('aria-pressed',String(b===el)));filterStores();return;}
    if(el.dataset.facility){facilities.has(el.dataset.facility)?facilities.delete(el.dataset.facility):facilities.add(el.dataset.facility);el.setAttribute('aria-pressed',String(facilities.has(el.dataset.facility)));filterStores();return;}
    if(el.classList.contains('faq-toggle')){const open=el.getAttribute('aria-expanded')!=='true';el.setAttribute('aria-expanded',String(open));el.nextElementSibling?.classList.toggle('hidden',!open);return;}
    if(el.hasAttribute('data-review-filter')){$$('[data-review-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===el)));$$('[data-review-card]').forEach(c=>c.hidden=el.dataset.reviewFilter!=='0'&&c.dataset.reviewCard!==String(Number(el.dataset.reviewFilter)-1));return;}
  });
  const storeCards=$$('.store-card');let storeEmpty;
  function filterStores(){const query=new URLSearchParams(location.search).get('q')?.trim()||'';let count=0;storeCards.forEach(c=>{c.hidden=(region!=='all'&&c.dataset.region!==region)||[...facilities].some(f=>!c.dataset.facilities.split(' ').includes(f))||!c.textContent.includes(query);if(!c.hidden)count++;});if(!storeEmpty&&storeCards.length){storeEmpty=document.createElement('p');storeEmpty.className='cr-empty';storeEmpty.setAttribute('role','status');$('#store-list-container').append(storeEmpty);}if(storeEmpty){storeEmpty.hidden=count>0;storeEmpty.textContent='조건에 맞는 예시 매장이 없습니다. 다른 지역이나 서비스를 선택해 주세요.';}}
  function selectStore(card){storeCards.forEach(c=>c.setAttribute('aria-pressed',String(c===card)));if($('#map-active-title'))$('#map-active-title').textContent=card.dataset.storeName;if($('#map-active-desc'))$('#map-active-desc').textContent='선택한 예시 매장의 공간과 서비스 안내입니다.';}
  storeCards.forEach(c=>{c.addEventListener('click',()=>selectStore(c));c.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();selectStore(c);}});});filterStores();
  $('#orderConfigForm')?.addEventListener('change',updatePrice);
  $('#orderConfigForm')?.addEventListener('submit',e=>e.preventDefault());
  document.addEventListener('submit',event=>{
    const form=event.target;
    if(form.hasAttribute('data-store-search')){event.preventDefault();location.href='craft-roast-stores.html?q='+encodeURIComponent($('#store-search-input').value)+'#store-locator';return;}
    if(form.hasAttribute('data-demo-order')){event.preventDefault();if(!form.reportValidity())return;modal('주문 체험을 완료했습니다','<p>선택한 구성으로 주문 흐름을 확인했습니다. 실제 결제·매장 접수·배송은 이루어지지 않습니다.</p><div class="cr-summary">'+pending.map(x=>'<p>'+esc(item(x.id).title)+' × '+x.quantity+'</p>').join('')+'</div><a class="cr-primary" href="index.html">홈으로 돌아가기 →</a>');return;}
    if(form.hasAttribute('data-local-form')){event.preventDefault();if(!form.reportValidity())return;let result=$('.cr-form-result',form);if(!result){result=document.createElement('p');result.className='cr-form-result';result.setAttribute('role','status');form.append(result);}result.textContent=form.dataset.localForm==='review'?'테이스팅 기록을 확인했습니다. 전송 없이 현재 화면에서만 표시됩니다.':'입력 내용을 확인했습니다. 실제 신청이나 계정 연결 없이 화면 체험을 완료했습니다.';form.reset();}
  });
  const header=$('.cr-header'),menu=$('.cr-menu-toggle'),nav=$('#craft-navigation');
  function activeNavigation(){const page=document.body.dataset.page,hash=location.hash;const path=page==='menu'?'menu-and-pairing':page==='beans'?'roastery-market':page==='stores'?(hash==='#store-locator'?'spaces-and-stores':'franchise-and-partnership'):hash==='#signature-grid'?'menu-and-pairing':hash==='#pairing-guide'?'brand-journal':null;$$('a',nav).forEach(a=>{if(a.dataset.path===path)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});}
  activeNavigation();window.addEventListener('hashchange',activeNavigation);
  function closeMenu(){menu.setAttribute('aria-expanded','false');nav.classList.remove('is-open');}
  const updateHeader=()=>document.documentElement.style.setProperty('--craft-header-height',header.getBoundingClientRect().height+'px');new ResizeObserver(updateHeader).observe(header);updateHeader();
  menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open);});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){closeMenu();menu.focus();}});
  document.addEventListener('click',e=>{if(!header.contains(e.target))closeMenu();});nav.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});window.matchMedia('(min-width:1280px)').addEventListener('change',closeMenu);
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
  $$('[data-menu-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.menuFilter==='all')));$$('[data-purchase-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.purchaseMode===mode)));$$('[data-grind]').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===0)));$$('.store-filter-region').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.region==='all')));
  if(document.body.dataset.page==='beans'&&new URLSearchParams(location.search).get('mode')==='sub')$('[data-purchase-mode="sub"]').click();syncSaved();syncCart();updatePrice();
  $$('[data-review-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.reviewFilter==='0')));
})();
