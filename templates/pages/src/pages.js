(() => {
  'use strict';
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
  const books = window.PAGES_BOOKS;
  const money = value => Number(value).toLocaleString('ko-KR') + '원';
  const escape = text => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const page = document.body.dataset.page;
  const params = new URLSearchParams(location.search);
  const currentBook = books.find(book => book.id === params.get('book')) || books[0];
  const programs = {
    private: {title:'현대 소설 다시 읽기 & 심층 에세이 클럽',price:110000,host:'이서헌',weeks:4,image:'images/pages-hanok-salon.jpg',intro:'소설의 행간을 함께 읽고 나만의 에세이를 완성하는 서촌의 작은 독서 살롱입니다.'},
    classics: {title:'하루 한 페이지 고전 읽기: 오디세이아',price:39000,host:'서다온',weeks:4,image:'images/pages-classics-salon.jpg',intro:'매일 한 페이지씩 읽고 매주 함께 이야기합니다. 고전 속 여정을 오늘의 삶과 연결하며 나만의 완독 기록을 남겨 보세요.'},
    novels: {title:'한서우 전작 탐독 클럽',price:48000,host:'한서우',weeks:4,image:'images/pages-curator-library.jpg',intro:'작가의 소설을 함께 읽으며 인물의 시선과 문장의 리듬을 탐색합니다. 각자의 독서 메모를 나누는 네 번의 만남입니다.'},
    philosophy: {title:'철학자의 밤: 현대 사상 입문 살롱',price:55000,host:'정하온',weeks:4,image:'images/pages-philosophy-salon.jpg',intro:'어렵게 느껴졌던 철학을 일상의 질문에서 시작합니다. 짧은 텍스트와 대화를 통해 나만의 생각을 정리하는 저녁 살롱입니다.'},
    morning: {title:'일요일 아침 에세이 필사 & 티타임',price:0,host:'민유라',weeks:1,image:'images/pages-morning-writing.jpg',intro:'좋아하는 문장 한 줄을 천천히 옮겨 적고 따뜻한 차를 나눕니다. 가볍게 참여하는 일요일 아침의 독서 모임입니다.'}
  };
  const club = programs[params.get('program')] || programs.private;
  const reading = page === 'event' && params.get('program') === 'reading';
  const eventTitle = reading ? '번역가의 서재: 영미 시선집 원서 낭독회' : '공간이 만든 문장, 문장이 지은 공간';
  let ticket = 'offline';
  const ticketPrice = () => ticket === 'online' ? 15000 : reading ? 28000 : 35000;
  const storage = {
    read(key, fallback) { try { return JSON.parse(localStorage.getItem('pages:'+key)) ?? fallback; } catch { return fallback; } },
    write(key, value) { try { localStorage.setItem('pages:'+key, JSON.stringify(value)); } catch { toast('이 브라우저에서는 보관 내용이 저장되지 않습니다.'); } }
  };
  let cart = storage.read('cart',{});
  if (!cart || Array.isArray(cart) || typeof cart !== 'object') cart = {};
  cart = Object.fromEntries(Object.entries(cart).filter(([id,n]) => books.some(b=>b.id===id) && Number.isInteger(n) && n>0 && n<=99));
  let saved = storage.read('saved',[]);
  if (!Array.isArray(saved)) saved = [];
  saved = saved.filter(item=>item && typeof item.id==='string' && ['book','club'].includes(item.type));
  const dialog = $('#pages-dialog');
  const dialogBody = $('#dialog-body');
  let toastTimer;
  function toast(message) { const el=$('#pages-toast');el.textContent=message;el.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.hidden=true,3000); }
  function openDialog(title, html) { $('#dialog-title').textContent=title;dialogBody.innerHTML=html;if(!dialog.open)dialog.showModal(); }
  function quantity() { return Number($('#qtyVal')?.textContent || 1); }
  function updateCartBadge() { $$('[data-panel="cart"]').forEach(el=>{el.setAttribute('aria-label',`장바구니 ${Object.values(cart).reduce((a,b)=>a+b,0)}권`);}); }
  function addBook(id, count=1) { const book=books.find(b=>b.id===id);if(!book)return;cart[id]=Math.min(99,(cart[id]||0)+count);storage.write('cart',cart);updateCartBadge();toast(`『${book.title}』 ${count}권을 장바구니에 담았습니다.`); }
  function cartDialog() {
    const entries=Object.entries(cart).filter(([id])=>books.some(b=>b.id===id));
    if(!entries.length){openDialog('장바구니','<p>장바구니가 비어 있습니다.</p><a class="primary-button" href="index.html#books">도서 둘러보기</a>');return;}
    const total=entries.reduce((sum,[id,count])=>sum+books.find(b=>b.id===id).price*count,0);
    openDialog('장바구니',`<ul class="cart-list">${entries.map(([id,count])=>{const b=books.find(b=>b.id===id);return `<li><img src="${b.image}" alt="${escape(b.title)} 표지"><div><a href="pages-book.html?book=${id}">${escape(b.title)}</a><small>${money(b.price)}</small><div class="quantity-control"><button data-cart-change="${id}" data-delta="-1" aria-label="${escape(b.title)} 수량 감소" ${count===1?'disabled':''}>−</button><span>${count}</span><button data-cart-change="${id}" data-delta="1" aria-label="${escape(b.title)} 수량 증가" ${count===99?'disabled':''}>+</button><button data-cart-remove="${id}">삭제</button></div></div><strong>${money(b.price*count)}</strong></li>`;}).join('')}</ul><div class="order-total"><span>배송비 무료 · 합계</span><strong>${money(total)}</strong></div><button class="primary-button" data-checkout="cart">주문 미리보기</button>`);
  }
  function checkout(id) {
    const items=id==='cart'?Object.entries(cart):[[currentBook.id,quantity()]];
    const total=items.reduce((sum,[bookId,count])=>sum+(books.find(b=>b.id===bookId)?.price||0)*count,0);
    if(!total){cartDialog();return;}
    openDialog('주문 확인',`<p>선택하신 도서와 수량을 확인해 주세요.</p><ul class="summary-list">${items.map(([bookId,count])=>`<li>${escape(books.find(b=>b.id===bookId).title)} · ${count}권</li>`).join('')}</ul><div class="order-total"><span>총 주문 금액</span><strong>${money(total)}</strong></div><form id="demo-order"><label class="check-label"><input type="checkbox" required> 실제 결제와 배송이 없는 체험 주문임을 확인합니다.</label><button class="primary-button" type="submit">체험 주문 완료</button></form>`);
    $('#demo-order').addEventListener('submit',e=>{e.preventDefault();if(id==='cart'){cart={};storage.write('cart',cart);updateCartBadge();}openDialog('체험 주문 완료','<p>주문 흐름을 완료했습니다. 실제 결제나 배송은 진행되지 않습니다.</p><a class="primary-button" href="index.html#books">다른 책 둘러보기</a>');});
  }
  function booking(type) {
    const name=type==='club'?club.title:eventTitle;
    const price=type==='club'?club.price:ticketPrice();
    const option=type==='club'?`${club.weeks}주 독서 모임`:ticket==='online'?'온라인 라이브':'현장 참여';
    openDialog('참가 신청',`<p class="booking-name">${escape(name)}</p><p>${escape(option)} · ${money(price)}</p><form id="demo-booking"><label>참가 인원<select name="people" aria-label="참가 인원">${[1,2,3].map(n=>`<option value="${n}">${n}명</option>`).join('')}</select></label><label>참가자 이름<input name="name" autocomplete="name" required maxlength="40"></label><label>안내받을 이메일<input name="email" type="email" autocomplete="email" required maxlength="100"></label><div class="order-total"><span>총 신청 금액</span><strong id="booking-total">${money(price)}</strong></div><label class="check-label"><input type="checkbox" required> 체험 신청이며 입력 정보가 저장·전송되지 않음을 확인합니다.</label><button type="submit" class="primary-button">체험 신청 완료</button></form>`);
    const form=$('#demo-booking');form.elements.people.addEventListener('change',()=>$('#booking-total').textContent=money(price*Number(form.elements.people.value)));
    form.addEventListener('submit',e=>{e.preventDefault();const people=form.elements.people.value;form.reset();$('#authorQuestion') && ($('#authorQuestion').value='');openDialog('체험 신청 완료',`<p>${escape(name)} · ${people}명 신청 흐름을 완료했습니다.</p><p>실제 예약과 결제는 진행되지 않으며 입력 정보는 저장하거나 전송하지 않습니다.</p><a class="primary-button" href="index.html#clubs">다른 모임 둘러보기</a>`);});
  }
  function syncSaved() {
    $$('[data-save]').forEach(el=>{const type=el.dataset.save,id=type==='book'?currentBook.id:params.get('program')||'private';el.setAttribute('aria-pressed',String(saved.some(item=>item.type===type&&item.id===id)));});
  }
  function savedDialog() {
    const items=saved.map(item=>item.type==='book'?{...books.find(b=>b.id===item.id),type:'book'}:{...programs[item.id],id:item.id,type:'club'}).filter(item=>item.title);
    openDialog('나의 보관함',items.length?`<ul class="cart-list">${items.map(item=>`<li><img src="${item.image}" alt="${escape(item.title)}"><div><a href="pages-${item.type}.html?${item.type==='book'?'book':'program'}=${item.id}">${escape(item.title)}</a><small>${money(item.price)}</small></div><button data-remove-saved="${item.type}:${item.id}">삭제</button></li>`).join('')}</ul>`:'<p>보관한 도서와 모임이 없습니다. 상세 페이지의 북마크 버튼으로 취향을 모아 보세요.</p><a href="index.html#books" class="primary-button">도서 둘러보기</a>');
  }
  const panelContent={
    account:['PAGES에 오신 것을 환영합니다','이 템플릿에서는 계정 없이 도서와 모임을 둘러보고 보관할 수 있습니다.','<button class="primary-button" data-panel="saved">나의 보관함 보기</button>'],
    privacy:['개인정보 안내','체험 신청 양식의 이름과 이메일은 화면 확인에만 사용하며 저장하거나 전송하지 않습니다. 장바구니와 보관한 항목만 현재 브라우저에 저장됩니다.','<button class="secondary-button" data-clear-storage>장바구니와 보관함 비우기</button>'],
    terms:['이용 안내','PAGES의 도서, 프로그램, 공간과 후기는 가상의 예시 콘텐츠입니다. 실제 판매·배송·예약은 제공되지 않습니다.',''],
    membership:['라운지와 멤버십','서촌의 조용한 북살롱과 성수의 열린 북라운지를 만나 보세요. 한 권의 책을 읽는 시간부터 함께 이야기하는 저녁까지 다양한 프로그램을 제안합니다.','<a class="primary-button" href="pages-club.html">북클럽 살펴보기</a><a class="secondary-button" href="index.html#spaces">라운지 둘러보기</a>'],
    app:['어디서든 이어지는 독서','PAGES의 독서 기록과 보관함을 이 화면에서 체험해 보세요. 별도의 앱 설치가 필요하지 않습니다.','<button class="primary-button" data-panel="saved">보관함 열기</button>'],
    contact:['문장으로 시작하는 만남','북클럽 호스트 지원, 공간 대관, 큐레이션과 제휴 문의를 위한 예시 안내입니다. 관심 있는 주제와 함께 나누고 싶은 책을 준비해 주세요.','<p>예시 문의: hello@pages.example.com</p><a class="primary-button" href="pages-club.html">살롱 프로그램 살펴보기</a>']
  };
  function panel(name) { if(name==='cart')return cartDialog();if(name==='saved')return savedDialog();const [title,content,extra]=panelContent[name]||panelContent.contact;openDialog(title,`<p>${content}</p>${extra}`); }
  function replaceText(parent, before, after) { const walk=document.createTreeWalker(parent,NodeFilter.SHOW_TEXT);while(walk.nextNode())walk.currentNode.textContent=walk.currentNode.textContent.split(before).join(after); }
  if(page==='book') {
    document.title=currentBook.title+' | PAGES 페이지스';document.body.dataset.book=currentBook.id;
    if(currentBook.id!=='garden'){
      replaceText($('main'),'사유의 정원',currentBook.title);replaceText($('main'),'정하온',currentBook.author);
      $('#book-title').textContent=currentBook.title+': '+currentBook.subtitle;
      $('#book-title').nextElementSibling.textContent='“'+currentBook.quote+'”';
      $('#book-main-image').src=currentBook.image;$('#book-main-image').alt=currentBook.title+' 책 표지';
      const cover=$('[data-gallery]');cover.dataset.gallery=currentBook.image;$('img',cover).src=currentBook.image;
      const intro=$$('main section')[2];const paragraphs=$$('p',intro);paragraphs.slice(0,2).forEach((p,i)=>p.textContent=i===0?currentBook.intro:'PAGES 에디터가 함께 읽을 질문과 문장들을 골랐습니다. 느린 독서로 일상에서 자신만의 감각을 발견해 보세요.');
      $$('#sentences article p').forEach(p=>p.textContent='“'+currentBook.quote+'”');
      replaceText($('main'),'불안의 시대에 나를 지키는 태도',currentBook.subtitle);
    }
    $$('[data-book-price]').forEach(el=>el.textContent=money(currentBook.price));
    $$('[data-book-original]').forEach(el=>el.textContent=money(Math.round(currentBook.price/0.9/100)*100));
    $('#qtyMinus').disabled=true;
    const changeQty=delta=>{const count=Math.max(1,Math.min(99,quantity()+delta));$('#qtyVal').textContent=count;$('#qtyMinus').disabled=count===1;$('#qtyPlus').disabled=count===99;$$('[data-book-total]').forEach(el=>el.textContent=money(currentBook.price*count));};
    $('#qtyMinus').addEventListener('click',()=>changeQty(-1));$('#qtyPlus').addEventListener('click',()=>changeQty(1));
    $$('[data-gallery]').forEach(el=>el.addEventListener('click',()=>{const img=$('#book-main-image');img.src=el.dataset.gallery;img.alt=$('img',el).alt;$$('[data-gallery]').forEach(btn=>btn.setAttribute('aria-pressed',String(btn===el)));}));
  }
  if(page==='club' && params.has('program')) {
    $('#program-title').textContent=club.title;document.title=club.title+' | PAGES 페이지스';
    $('#program-image').src=club.image;$('#program-image').alt=club.title+' 독서 공간';
    $('#program-title').nextElementSibling.textContent=club.intro;
    replaceText($('main'),'이서헌',club.host);
    $$('[data-club-price]').forEach(el=>el.textContent=money(club.price));
    $$('[data-club-original]').forEach(el=>el.hidden=true);
    if(club.weeks===1)replaceText($('main'),'4주','1회');
    const titles=$$('[data-week-title]');const labels=['함께 읽을 질문과 첫 문장 나누기','인물과 문장의 시선 바꾸기','내 삶과 책을 연결하는 독서 노트','완독 기록과 좋아하는 문장 낭독'];titles.forEach((el,i)=>el.textContent=labels[i]);
    if(club.weeks===1)titles.slice(1).forEach(el=>el.closest('[data-week-row]').hidden=true);
    $$('[data-club-date]').forEach(el=>el.textContent=club.weeks===1?'11월 08일(일) · 10:00':'11월 07일(토) · 14:00');
  }
  if(reading) {
    $('#program-title').textContent=eventTitle;document.title=eventTitle+' | PAGES 페이지스';
    $('#program-image').src='images/pages-seongsu-lounge.jpg';$('#program-image').alt='성수 원서 낭독 라운지';
    replaceText($('main'),'건축가 서지안','번역가 윤서진');replaceText($('main'),'서지안','윤서진');
    $('#program-intro').textContent='원문의 소리와 번역의 결을 함께 읽습니다. 짧은 시를 낭독하고 각자의 언어로 다시 적어 보는 성수의 저녁입니다.';
  }
  function updateTicket() {
    if(page!=='event')return;ticket=$('input[name="ticket_type"]:checked').value;
    $('#basePrice').textContent=money(ticketPrice());$('#totalPrice').textContent=money(ticketPrice());
    $('#btnLabel').textContent=ticket==='online'?'온라인 라이브 신청하기':'현장 참여 신청하기';
    $$('input[name="ticket_type"]').forEach(input=>{input.closest('label').classList.toggle('ticket-selected',input.checked);});
  }
  if(page==='event'){$$('input[name="ticket_type"]').forEach(input=>input.addEventListener('change',updateTicket));updateTicket();$('#reservationForm').addEventListener('submit',e=>{e.preventDefault();booking('event');});if(reading){const price=$('#labelOffline').querySelector('.font-headline-md');if(price)price.textContent=money(28000);}}
  let searchTerm='',category='all';
  function filterCards() {
    const cards=$$('[data-search-card]');let count=0;
    cards.forEach(card=>{const b=books.find(book=>book.id===card.dataset.bookCard);const content=card.textContent+' '+(b?.author||'');const visible=(!searchTerm||content.toLocaleLowerCase().includes(searchTerm))&&(category==='all'||card.dataset.searchType!=='book'||card.dataset.category===category);card.hidden=!visible;if(visible)count++;});
    if($('#search-result-count')){$('#search-result-count').textContent=`${searchTerm?'“'+searchTerm+'” 검색 · ':''}${count}개의 도서와 모임`;$('.results-bar').hidden=!searchTerm && category==='all';$('#empty-results').hidden=count>0;}
  }
  function search(term) {
    if(page!=='home'){location.href='index.html?q='+encodeURIComponent(term);return;}
    searchTerm=term.trim().toLocaleLowerCase();category='all';filterCards();const first=$$('[data-search-card]').find(el=>!el.hidden);(first||$('#books')).scrollIntoView({behavior:'smooth',block:'center'});
    const url=new URL(location.href);term?url.searchParams.set('q',term):url.searchParams.delete('q');history.replaceState(null,'',url);
  }
  $$('[data-search]').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();search($('input',form).value);}));
  $$('header input[type="search"]').forEach(input=>input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!input.closest('form')){e.preventDefault();search(input.value);}}));
  if(page==='home' && params.has('q')){const term=params.get('q');$('header input[type="search"]').value=term;searchTerm=term.toLocaleLowerCase();filterCards();}
  if(page==='home'){
    const promo=$('[data-promo]');if(promo&&storage.read('hide-promo','')===new Date().toDateString())promo.hidden=true;
    const themes=[['2026 가을 문학전','‘사유의 문장들’'],['빛과 잔상의 철학','나만의 시선을 찾는 시간'],['함께 읽는 저녁','책을 사이에 둔 대화'],['소설의 행간으로','한서우의 문장들'],['에디터스 초이스','계절을 닮은 한 권']];
    $$('[data-hero-tab]').forEach(btn=>btn.addEventListener('click',()=>{const i=Number(btn.dataset.heroTab);$('h1').innerHTML=`${themes[i][0]}<br><span class="font-serif-kr italic text-primary">${themes[i][1]}</span>`;$$('[data-hero-tab]').forEach(el=>el.setAttribute('aria-pressed',String(el===btn)));$('[data-hero-index]').textContent=String(i+1).padStart(2,'0');$('[data-hero-link]').href=['pages-book.html?book=garden','pages-book.html?book=light','pages-club.html','pages-club.html?program=novels','index.html#books'][i];}));
  }
  const menu=$('.mobile-menu');menu?.addEventListener('click',()=>{const nav=$('#pages-navigation');const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open);});
  $('#pages-navigation')?.addEventListener('click',e=>{if(e.target.closest('a')){$('#pages-navigation').classList.remove('is-open');menu.setAttribute('aria-expanded','false');}});
  document.addEventListener('keydown',e=>{if(e.key==='Escape' && menu?.getAttribute('aria-expanded')==='true'){$('#pages-navigation').classList.remove('is-open');menu.setAttribute('aria-expanded','false');menu.focus();}});
  let reviewPage=1;
  document.addEventListener('click',async e=>{
    const el=e.target.closest('button,a');if(!el)return;
    if(el.hasAttribute('data-close')){dialog.close();return;}
    if(el.dataset.panel){e.preventDefault();panel(el.dataset.panel);return;}
    if(el.dataset.go){location.href=el.dataset.go;return;}
    if(el.dataset.addBook){addBook(el.dataset.addBook==='current'?currentBook.id:el.dataset.addBook,el.dataset.addBook==='current'?quantity():1);return;}
    if(el.dataset.checkout){checkout(el.dataset.checkout);return;}
    if(el.dataset.booking){booking(el.dataset.booking);return;}
    if(el.dataset.cartChange){const id=el.dataset.cartChange;cart[id]=Math.max(1,Math.min(99,cart[id]+Number(el.dataset.delta)));storage.write('cart',cart);cartDialog();updateCartBadge();return;}
    if(el.dataset.cartRemove){delete cart[el.dataset.cartRemove];storage.write('cart',cart);cartDialog();updateCartBadge();return;}
    if(el.dataset.removeSaved){const [type,id]=el.dataset.removeSaved.split(':');saved=saved.filter(item=>!(item.type===type&&item.id===id));storage.write('saved',saved);savedDialog();syncSaved();return;}
    if(el.dataset.save){const type=el.dataset.save,id=type==='book'?currentBook.id:params.get('program')||'private';const exists=saved.some(item=>item.type===type&&item.id===id);saved=exists?saved.filter(item=>!(item.type===type&&item.id===id)):[...saved,{type,id}];storage.write('saved',saved);syncSaved();toast(exists?'보관함에서 삭제했습니다.':'보관함에 저장했습니다.');return;}
    if(el.hasAttribute('data-clear-storage')){cart={};saved=[];storage.write('cart',cart);storage.write('saved',saved);syncSaved();updateCartBadge();toast('장바구니와 보관함을 비웠습니다.');return;}
    if(el.dataset.quote){openDialog(el.dataset.quoteTitle,`<blockquote>“${escape(el.dataset.quote)}”</blockquote><a href="pages-book.html?book=${books.find(b=>b.title===el.dataset.quoteTitle)?.id||'garden'}" class="primary-button">도서 자세히 보기</a>`);return;}
    if(el.hasAttribute('data-copy-quote')||el.hasAttribute('data-share')){const text=el.hasAttribute('data-share')?location.href:el.closest('article')?.querySelector('p')?.textContent||currentBook.quote;try{await navigator.clipboard.writeText(text);toast('복사했습니다.');}catch{openDialog('복사할 내용',`<textarea readonly aria-label="복사할 내용">${escape(text)}</textarea>`);$('textarea',dialogBody).select();}return;}
    if(el.hasAttribute('data-preview')){openDialog('책 미리보기',`<img class="preview-image" src="images/pages-garden-inside.jpg" alt="도서 내지 예시"><p>${escape(currentBook.intro)}</p><blockquote>“${escape(currentBook.quote)}”</blockquote>`);return;}
    if(el.classList.contains('faq-toggle')){const open=el.getAttribute('aria-expanded')!=='true';$$('.faq-toggle').forEach(btn=>{btn.setAttribute('aria-expanded',String(btn===el&&open));btn.nextElementSibling.classList.toggle('hidden',!(btn===el&&open));});return;}
    if(el.dataset.bookFilter){category=el.dataset.bookFilter;$$('[data-book-filter]').forEach(btn=>btn.setAttribute('aria-pressed',String(btn===el)));filterCards();return;}
    if(el.hasAttribute('data-reset-search')){$('header input[type="search"]').value='';searchTerm='';category='all';$$('[data-book-filter]').forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.bookFilter==='all')));filterCards();const url=new URL(location.href);url.searchParams.delete('q');history.replaceState(null,'',url);return;}
    if(el.hasAttribute('data-categories')){openDialog('도서 카테고리',`<div class="category-list">${[['humanities','인문 · 철학'],['literature','문학 · 소설'],['art','예술 · 디자인'],['essay','라이프 · 에세이']].map(([id,t])=>`<button data-select-category="${id}">${t}</button>`).join('')}</div>`);return;}
    if(el.dataset.selectCategory){category=el.dataset.selectCategory;filterCards();dialog.close();$('#books').scrollIntoView({behavior:'smooth'});return;}
    if(el.hasAttribute('data-dismiss-promo')){if($('#hide-promo')?.checked)storage.write('hide-promo',new Date().toDateString());$('[data-promo]').hidden=true;return;}
    if(el.hasAttribute('data-write-review')){openDialog('나의 독서 기록','<form id="review-form"><label>별점<select name="rating"><option value="5">★★★★★</option><option value="4">★★★★☆</option><option value="3">★★★☆☆</option></select></label><label>읽고 남긴 한 문장<textarea name="text" required minlength="5" maxlength="500" rows="4"></textarea></label><p>작성한 기록은 현재 화면에서만 표시됩니다.</p><button type="submit" class="primary-button">기록 남기기</button></form>');$('#review-form').addEventListener('submit',ev=>{ev.preventDefault();const form=ev.target,article=document.createElement('article');article.className='reader-review';article.dataset.review='new';article.dataset.helpfulCount='0';const star=document.createElement('p');star.textContent='★'.repeat(Number(form.elements.rating.value));const p=document.createElement('p');p.textContent=form.elements.text.value;article.append(star,p);$('#reviews').append(article);dialog.close();toast('독서 기록을 남겼습니다.');});return;}
    if(el.hasAttribute('data-helpful')){const active=el.getAttribute('aria-pressed')!=='true';el.setAttribute('aria-pressed',String(active));const initial=Number(el.dataset.initialCount||el.textContent.match(/\d+/)?.[0]||0);el.dataset.initialCount=initial;el.textContent='도움돼요 '+(initial+(active?1:0));return;}
    if(el.hasAttribute('data-comments')){openDialog('독자들의 대화','<p>“저도 마지막 장을 읽고 천천히 산책하고 싶어졌어요.”</p><p>“함께 읽는 모임에서 이 문장을 다시 나누고 싶어요.”</p>');return;}
    if(el.dataset.reviewSort){$$('[data-review-sort]').forEach(btn=>btn.setAttribute('aria-pressed',String(btn===el)));const reviews=$$('[data-review]');const parent=reviews[0]?.parentElement;reviews.sort((a,b)=>el.dataset.reviewSort==='newest'?Number(a.dataset.review)-Number(b.dataset.review):Number(b.dataset.helpfulCount)-Number(a.dataset.helpfulCount)).forEach(item=>parent.append(item));return;}
    if(el.dataset.reviewPage){const value=el.dataset.reviewPage;reviewPage=Math.max(1,Math.min(3,value==='prev'?reviewPage-1:value==='next'?reviewPage+1:Number(value)));const texts=[['작은 문장들이 오래 남아 책장에 다시 손이 갑니다.','함께 읽으면 익숙한 문장도 새롭게 보입니다.'],['차분한 편집과 종이의 질감이 마음에 들었습니다.','읽다가 밑줄을 긋고 싶은 문장이 많았어요.'],['퇴근 후 십 분의 독서 시간이 생겼습니다.','다음 달 북클럽에서도 같이 읽고 싶습니다.']];$$('[data-review]').slice(0,2).forEach((item,i)=>{const p=$('[data-review-body]',item);if(p)p.textContent=texts[reviewPage-1][i];});$$('[data-review-page]').forEach(btn=>{const v=btn.dataset.reviewPage;btn.setAttribute('aria-current',Number(v)===reviewPage?'page':'false');if(v==='prev')btn.disabled=reviewPage===1;if(v==='next')btn.disabled=reviewPage===3;});return;}
  });
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
  syncSaved();updateCartBadge();
})();
