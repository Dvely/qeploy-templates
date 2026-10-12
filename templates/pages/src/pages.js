// 홈의 상호작용. 상세 주소와 콘텐츠는 pages-data.js의 정본을 사용합니다.
(() => {
  'use strict';
  const $=(s,p=document)=>p.querySelector(s),$$=(s,p=document)=>[...p.querySelectorAll(s)];
  const books=window.PAGES_CONTENT.books;
  const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const storage={read(key,fallback){try{return JSON.parse(localStorage.getItem('pages:'+key))??fallback;}catch{return fallback;}},write(key,value){try{localStorage.setItem('pages:'+key,JSON.stringify(value));}catch{toast('이 브라우저에서는 보관 내용이 유지되지 않습니다.');}}};
  let toastTimer;
  function toast(text){const el=$('#pages-toast');el.textContent=text;el.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.hidden=true,3000);}
  const dialog=$('#pages-dialog');
  function modal(title,html){$('#dialog-title').textContent=title;$('#dialog-body').innerHTML=html;dialog.showModal();}
  let query='',category='all';
  function filter(){let count=0;$$('[data-search-card]').forEach(card=>{const b=books.find(b=>b.id===card.dataset.bookCard);const match=(!query||(card.textContent+' '+(b?.author||'')).toLocaleLowerCase().includes(query))&&(category==='all'||card.dataset.searchType!=='book'||card.dataset.category===category);card.hidden=!match;if(match)count++;});$('#search-result-count').textContent=(query?'“'+query+'” 검색 · ':'')+count+'개의 책과 모임';$('.results-bar').hidden=!query&&category==='all';$('#empty-results').hidden=count>0;}
  $$('[data-search]').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();location.href='pages-search.html?q='+encodeURIComponent($('input',form).value);}));
  const params=new URLSearchParams(location.search);if(params.has('q')){query=params.get('q').toLocaleLowerCase();$('header input[type="search"]').value=params.get('q');filter();}
  const themes=[['2026 가을 문학전','‘사유의 문장들’','pages-collection-autumn.html'],['빛과 잔상의 철학','나만의 시선을 찾는 시간','pages-book-light.html'],['함께 읽는 저녁','책을 사이에 둔 대화','pages-clubs.html'],['소설의 행간으로','한서우의 문장들','pages-club-novels.html'],['에디터스 초이스','계절을 닮은 한 권','pages-collection-editors.html']];
  $$('[data-hero-tab]').forEach(btn=>btn.addEventListener('click',()=>{const i=Number(btn.dataset.heroTab);$('h1').innerHTML=escape(themes[i][0])+'<br><span class="font-serif-kr italic text-primary">'+escape(themes[i][1])+'</span>';$$('[data-hero-tab]').forEach(el=>el.setAttribute('aria-pressed',String(el===btn)));$('[data-hero-index]').textContent=String(i+1).padStart(2,'0');$('[data-hero-link]').href=themes[i][2];}));
  const promo=$('[data-promo]');if(storage.read('hide-promo','')===new Date().toDateString())promo.hidden=true;
  document.addEventListener('click',e=>{const el=e.target.closest('button,a');if(!el)return;
    if(el.dataset.addBook){const b=books.find(b=>b.id===el.dataset.addBook);if(!b)return;let cart=storage.read('cart',{});if(!cart||typeof cart!=='object'||Array.isArray(cart))cart={};const count=Number.isInteger(cart[b.id])?cart[b.id]:0;cart[b.id]=Math.min(99,Math.max(0,count)+1);storage.write('cart',cart);toast('『'+b.title+'』을 장바구니에 담았습니다.');return;}
    if(el.dataset.quote){const b=books.find(b=>b.title===el.dataset.quoteTitle);modal(el.dataset.quoteTitle,'<blockquote>“'+escape(el.dataset.quote)+'”</blockquote><a class="primary-button" href="'+(b?.url||'pages-books.html')+'">도서 자세히 보기 →</a>');return;}
    if(el.hasAttribute('data-close')){dialog.close();return;}
    if(el.hasAttribute('data-categories')){modal('도서 카테고리','<div class="category-list">'+[['humanities','인문 · 철학'],['literature','문학 · 소설'],['art','예술 · 디자인'],['essay','라이프 · 에세이']].map(([id,label])=>'<a class="secondary-button" href="pages-collection-'+id+'.html">'+label+'</a>').join('')+'</div>');return;}
    if(el.dataset.bookFilter){category=el.dataset.bookFilter;$$('[data-book-filter]').forEach(btn=>btn.setAttribute('aria-pressed',String(btn===el)));filter();return;}
    if(el.hasAttribute('data-reset-search')){query='';category='all';$$('[data-book-filter]').forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.bookFilter==='all')));$('header input[type="search"]').value='';filter();const url=new URL(location.href);url.searchParams.delete('q');history.replaceState(null,'',url);return;}
    if(el.hasAttribute('data-dismiss-promo')){if($('#hide-promo').checked)storage.write('hide-promo',new Date().toDateString());promo.hidden=true;}
  });
  const menu=$('.mobile-menu'),nav=$('#pages-navigation');menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open);});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){menu.setAttribute('aria-expanded','false');nav.classList.remove('is-open');menu.focus();}});
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
})();
