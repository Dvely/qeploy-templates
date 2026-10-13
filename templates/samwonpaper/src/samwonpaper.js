(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const data = window.SAMWONPAPER;
  const page = document.body.dataset.localPage;
  const params = new URLSearchParams(location.search);
  const dialog = $('#samwonpaper-dialog');
  let returnFocus;
  function show(title, content) {
    returnFocus = document.activeElement;
    $('#samwonpaper-dialog-title').textContent = title;
    const body = $('#samwonpaper-dialog-body');
    body.replaceChildren();
    if (typeof content === 'string') { const p = document.createElement('p'); p.textContent = content; body.append(p); }
    else body.append(content);
    dialog.showModal();
  }
  dialog.addEventListener('close', () => returnFocus?.focus());
  dialog.addEventListener('click', e => { if(e.target === dialog) dialog.close(); });
  $('[data-local-close]').addEventListener('click', () => dialog.close());
  window.addEventListener('samwonpaper:message', e => show('안내', e.detail.text));

  const input = $('#searchString');
  const cells = $$('[data-local-product]');
  let keyword = params.get('q') || params.get('searchString') || '';
  let selectedPackage = params.get('searchPaper.uidPackageBookCode') || '';
  let sorting = 'NEW';
  let currentPage = 1;
  let filterWords = [];
  const collection = $('.product-list .grid-layout-inner');
  const resultsStatus = document.createElement('p');
  resultsStatus.className = 'samwon-search-status';
  resultsStatus.setAttribute('role', 'status');
  collection?.parentElement.append(resultsStatus);
  const matches = cell => {
    const text = (cell.textContent + ' ' + (cell.dataset.searchDescription || '')).toLocaleLowerCase();
    const packageMatch = !selectedPackage || cell.querySelector('[data-package-uid]')?.dataset.packageUid === selectedPackage;
    return packageMatch && (!keyword || text.includes(keyword.toLocaleLowerCase())) && filterWords.every(words=>words.some(word=>text.includes(word.toLocaleLowerCase())));
  };
  function filter() {
    const filtered = cells.filter(matches);
    const sorted = [...filtered];
    if (sorting === 'NAME') sorted.sort((a,b) => a.dataset.localProduct.localeCompare(b.dataset.localProduct, 'ko'));
    cells.forEach(c => { c.hidden = true; });
    const perPage = page === 'find-paper' ? 24 : 12;
    const pages = Math.max(1, Math.ceil(sorted.length / perPage));
    currentPage = Math.min(currentPage, pages);
    sorted.forEach((c,i) => { collection?.append(c); c.hidden = i < (currentPage-1)*perPage || i >= currentPage*perPage; });
    const total = $('.board-list-total');
    if(total) total.textContent = `${filtered.length}개의 ${page === 'find-paper' ? '종이' : '제품'}`;
    resultsStatus.textContent = !filtered.length ? '검색 결과가 없습니다. 다른 검색어를 입력해 주세요.' : keyword ? `“${keyword}” 검색 결과` : '';
    const paging = $('.paging-wrap');
    if(paging) {
      paging.replaceChildren();
      for(let n = 1; n <= pages; n++) {
        const b=document.createElement('button'); b.type='button'; b.dataset.localPageNumber=String(n); b.textContent=String(n);
        b.setAttribute('aria-label', `${n}페이지`); if(n===currentPage)b.setAttribute('aria-current','page'); paging.append(b);
      }
    }
  }
  if (input) input.value = keyword;
  if (page === 'search') {
    $('.page-title').textContent = '통합 검색';
    $('.page-headline').textContent = keyword ? `“${keyword}” 검색 결과` : '검색 결과';
    // Featured product descriptions and keywords are searchable alongside collection names.
    cells.forEach(c => { const featured=data.products.find(p=>p.uid === c.querySelector('[data-uid]')?.dataset.uid); if(featured)c.dataset.searchDescription=featured.description; });
  }
  if(cells.length) filter();
  function search(value, local = false) {
    const query = String(value || '').trim();
    if(local && cells.length) {
      keyword=query; selectedPackage=''; currentPage=1;
      const url=new URL(location.href);url.search='';if(query)url.searchParams.set('q',query);history.replaceState(null,'',url);filter();
    } else location.href = 'samwonpaper-search.html' + (query ? '?q='+encodeURIComponent(query) : '');
  }
  function paperDetail(link) {
    const cell = link.closest('[data-local-product]');
    const name = cell?.dataset.localProduct || link.dataset.uid || '종이';
    const content=document.createElement('div');content.className='samwon-product-detail';
    const source=link.querySelector('img');
    if(source) { const img=source.cloneNode(); img.alt=name;img.loading='eager';content.append(img); }
    const meta=document.createElement('div');
    const note=document.createElement('p');note.textContent=cell?.querySelector('.item-tag')?.textContent.trim() || '종이의 색상과 표면을 확인해 보세요.';
    const code=document.createElement('p');code.textContent='제품 코드 · '+(link.dataset.uid || '');
    const cta=document.createElement('a');cta.className='btn-basic btn-black';cta.href='samwonpaper-contact.html';cta.textContent='제품 문의하기';
    meta.append(code,note,cta);content.append(meta);show(name,content);
  }
  function validateForm(form) {
    if(!form)return false;
    const required=$$('input[req="true"],input[req="ture"],textarea[req="true"],textarea[req="ture"],select[req="true"]',form);
    required.forEach(el=>{if(el.type!=='hidden'&&el.getClientRects().length)el.required=true;});
    if(form.id==='tourForm') {
      ['fdReservationDate','fdApplicantName','fdApplicantMobile','fdApplicantEmail','fdVisitNum'].forEach(name=>{const el=$(`[name="${name}"]`,form);if(el)el.required=true;});
      $$('input[name="fdReservationTime"],input[name="fdGroupCode"]',form).forEach(el=>el.required=true);
    }
    const agree=form.id==='inquiryForm'?$('#chkAgree'):$('input[name="fdPersonalInfoType"]',form);if(agree)agree.required=true;
    return form.reportValidity();
  }
  function submit(form) {
    if(form) $$('.accordion-cell',form).forEach(cell=>{cell.classList.add('actived');const content=$('.accordion-content',cell);if(content)content.style.height='auto';});
    if(!validateForm(form))return;
    show(form.id==='tourForm'?'투어 신청 내용 확인':'문의 내용 확인','입력한 내용을 확인했습니다. 이 화면은 로컬 미리보기이며 실제 접수나 개인정보 전송은 진행하지 않습니다.');
  }
  document.addEventListener('click', e => {
    const el=e.target.closest('a,button');if(!el)return;
    if(el.matches('[data-search-global]')) {e.preventDefault();search($('#integratedString')?.value);}
    else if(el.matches('[data-search-product]')) {e.preventDefault();search(input?.value || $('#productSearchString')?.value,cells.length>0);}
    else if(el.matches('[data-search-tag]')) {e.preventDefault();search(el.dataset.searchTag);}
    else if(el.matches('[data-colors-open]')) {e.preventDefault();const current=window.SAMWONPAPER_CURRENT_PRODUCT;const grid=document.createElement('div');grid.className='samwon-color-grid';Object.values(window.SAMWONPAPER_PRODUCTS||{}).filter(p=>p.package===current.package).forEach(p=>{const a=document.createElement('a');a.href='samwonpaper-product.html?uid='+encodeURIComponent(p.uid);const img=document.createElement('img');img.src=p.image;img.alt=p.color;const label=document.createElement('span');label.textContent=p.color;a.append(img,label);grid.append(a);});show('컬러칩 · '+current.name,grid);}
    else if(el.matches('[data-local-page-number]')) {currentPage=+el.dataset.localPageNumber;filter();$('.board-list-header')?.scrollIntoView({block:'start',behavior:'smooth'});}
    else if(el.matches('[data-category-filter]')) {keyword=el.textContent.trim();if(input)input.value=keyword;currentPage=1;filter();}
    else if(el.matches('[data-sort]')) {sorting=el.dataset.sort;currentPage=1;filter();}
    else if(el.matches('[data-search-reset]')) {keyword='';selectedPackage='';filterWords=[];if(input)input.value='';$$('.search-detail input[type=checkbox]').forEach(i=>i.checked=false);filter();}
    else if(el.matches('[data-filter-toggle]')) {e.preventDefault();const detail=$('.search-detail');detail?.classList.toggle('actived');el.setAttribute('aria-expanded',String(detail?.classList.contains('actived')));}
    else if(el.matches('[data-list-type]')) {$$('[data-list-type]').forEach(b=>b.classList.toggle('actived',b===el));$('.product-list')?.classList.toggle('samwon-three-columns',el.classList.contains('btn-type-3'));}
    else if(el.matches('[data-open-pop]')) {e.preventDefault();window.front?.pop.open(el.dataset.openPop);}
    else if(el.matches('[data-close-pop]')) {e.preventDefault();if(el.dataset.closePop)window.front?.pop.close(el.dataset.closePop);else el.closest('.layer-pop-wrap')?.classList.remove('actived');}
    else if(el.matches('[data-demo-submit]')) {e.preventDefault();submit(el.closest('form')||$('#inquiryForm')||$('#tourForm'));}
    else if(el.matches('[data-local-archive]')) {e.preventDefault();show('과거 자료 안내','이 자료는 로컬 미리보기에 포함되어 있지 않습니다. 현재 목록에 연결된 소식을 확인해 주세요.');}
    else if(el.matches('[data-local-help]')) {show('고객센터','삼원페이퍼 고객 문의 화면에서 문의 내용을 작성할 수 있습니다.');}
    else if(el.matches('[data-local-detail]') || /fn(?:Paper|Drawing)ProductDetail/.test(el.dataset.originalAction||'')) {e.preventDefault();paperDetail(el);}
    else if(/fnSearchFilter/.test(el.dataset.originalAction||'')) {keyword=input?.value||'';selectedPackage='';const checked=$$('.search-detail input:checked');const aliases={'갈색':['Brown','갈색','크라프트'],'흰색':['White','화이트','백색'],'검정':['Black','블랙'],'파랑':['Blue','블루'],'초록':['Green','그린'],'노랑':['Yellow','옐로우']};filterWords=checked.map(i=>{const name=i.closest('label')?.getAttribute('title')||i.closest('label')?.textContent.trim();return aliases[name]||[name];}).filter(words=>words[0]);currentPage=1;filter();$('.search-detail')?.classList.remove('actived');}
    else if(el.matches('[data-page]')) {e.preventDefault();const items=$$('.board-gallery-list .grid-layout-cell');show('페이지 안내','현재 로컬 미리보기에 포함된 '+items.length+'개의 소식을 확인할 수 있습니다.');}
    else if(el.matches('button[href]')) {location.href=el.getAttribute('href');}
    else if(el.matches('[data-original-action]')) {
      e.preventDefault();
      const call=el.dataset.originalAction;
      if(/fnGoPageUrl\(this/.test(call))location.href='samwonpaper-find-paper.html?searchPaper.uidPackageBookCode='+encodeURIComponent(el.dataset.uid||'');
      else if(/fnGoPageUrl/.test(call)) {
        const id=call.match(/,\s*(\d+)/)?.[1];
        const type=location.pathname.includes('download')?'download':location.pathname.includes('gallery')?'gallery':location.pathname.includes('press')?'press':'notice';
        location.href=id ? `samwonpaper-${type}-${id}.html` : `samwonpaper-${type==='download'?'downloads':'news-'+type}.html`;
      } else if(/fnFileDownload/.test(call))show('자료 다운로드','자료 파일은 다운로드 페이지에서 확인할 수 있습니다.');
    }
  });
  document.addEventListener('keydown',e=>{
    if(e.key==='Enter' && e.target.matches('#integratedString,#searchString,#productSearchString')){e.preventDefault();search(e.target.value,e.target.id==='searchString'&&cells.length>0);}
    if(e.key==='Escape' && $('#dHead')?.classList.contains('state-sitemap'))$('.btn-gnb-menu-close')?.click();
  });
  $$('form').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();if(form.contains($('#integratedString')))search($('#integratedString').value);else submit(form);}));
  $$('input[name="fdReservationDate"]').forEach(el=>{el.type='date';el.min=new Date().toLocaleDateString('en-CA');el.setAttribute('aria-label','신청일 선택');$('.j-datepicker')?.replaceChildren(el);});
  const applicantEmail=$('#fdApplicantEmail');if(applicantEmail)applicantEmail.type='email';
  const visitNum=$('#fdVisitNum');if(visitNum){visitNum.min='1';visitNum.max='10';}
  $('#emailDomain')?.addEventListener('change',e=>{const dest=$('#email_2');if(dest){dest.value=e.target.value==='direct'?'':e.target.value;dest.readOnly=!!dest.value;}});

  const open=$('.btn-gnb-menu-open'),close=$('.btn-gnb-menu-close');
  open?.setAttribute('aria-label','전체 메뉴 열기');close?.setAttribute('aria-label','전체 메뉴 닫기');
  open?.setAttribute('aria-expanded','false');
  open?.addEventListener('click',()=>{open.setAttribute('aria-expanded','true');requestAnimationFrame(()=>close?.focus());});
  close?.addEventListener('click',()=>{open?.setAttribute('aria-expanded','false');open?.focus();});
  const menu=$('.header-all-menu-wrap');
  document.addEventListener('keydown',e=>{
    if(e.key!=='Tab'||!$('#dHead')?.classList.contains('state-sitemap'))return;
    const focusables=$$('a[href],button',menu).filter(x=>x.getClientRects().length), first=focusables[0],last=focusables.at(-1);
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}
  });
  if(page==='index'){const breakpoint=matchMedia('(max-width:1199px)');breakpoint.addEventListener('change',()=>location.reload());}
  if(window.innerWidth<1200 && page==='index') {
    const slides=$$('.main-visual-items');let active=0;
    const dots=document.createElement('div');dots.className='samwon-hero-dots';dots.setAttribute('aria-label','메인 배너 선택');
    function activate(n){active=(n+slides.length)%slides.length;slides.forEach((s,i)=>{s.classList.toggle('mobile-active',i===active);s.setAttribute('aria-hidden',String(i!==active));s.querySelector('a')?.setAttribute('tabindex',i===active?'0':'-1');});$$('button',dots).forEach((b,i)=>b.setAttribute('aria-current',String(i===active)));}
    slides.forEach((s,i)=>{const caption=document.createElement('div');caption.className='samwon-mobile-caption';const title=document.createElement('h2');title.textContent=$('.item-label .txt',s)?.textContent||'';const link=document.createElement('a');link.href=$('.item-visual',s)?.getAttribute('href')||'samwonpaper-paper-collection.html';link.textContent='자세히 보기 →';caption.append(title,link);s.append(caption);const b=document.createElement('button');b.type='button';b.textContent=String(i+1).padStart(2,'0');b.setAttribute('aria-label',`${i+1}번째 배너`);b.addEventListener('click',()=>activate(i));dots.append(b);});$('.main-visual').append(dots);activate(0);
    if(!matchMedia('(prefers-reduced-motion: reduce)').matches)setInterval(()=>{if(!document.hidden&&!$('#dHead')?.classList.contains('state-sitemap'))activate(active+1);},6000);
    const cards=$$('.main-new .slider-body .slider-items');let index=0;
    function card(n){index=(n+cards.length)%cards.length;cards.forEach((c,i)=>c.classList.toggle('mobile-card-active',i===index));$$('.main-new .keywords-cell').forEach((c,i)=>c.classList.toggle('mobile-card-active',i===index));}card(0);
    $('.main-new .prev')?.addEventListener('click',()=>card(index-1));$('.main-new .next')?.addEventListener('click',()=>card(index+1));
    // The desktop controller owns these sliders; initialize only their mobile counterpart here.
    if(window.Swiper)new Swiper('.main-middle-banner .swiper',{slidesPerView:1,loop:true,pagination:{el:'.main-middle-banner .swiper-pagination',clickable:true}});
  }
  const searchNews=page==='search'?data.news.filter(n=>n.title&&(!keyword||n.title.includes(keyword))):[];
  if(searchNews.length){const section=document.createElement('section');section.className='samwon-search-news';const h=document.createElement('h3');h.textContent='소식 검색 결과';const grid=document.createElement('div');grid.className='samwon-news-grid';searchNews.forEach(n=>{const a=document.createElement('a');a.href=n.file;const t=document.createElement('span');t.textContent=n.title;if(n.image){const img=document.createElement('img');img.src=n.image;img.alt='';img.loading='lazy';a.append(img);}a.append(t);grid.append(a);});section.append(h,grid);$('.product-list-wrap')?.append(section);}
  document.querySelector('#wrap')?.classList.add('actived');
})();
