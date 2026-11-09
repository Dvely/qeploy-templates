(() => {
  'use strict';
  const $ = (q, root=document) => root.querySelector(q);
  const $$ = (q, root=document) => [...root.querySelectorAll(q)];
  const products = JSON.parse($('#catalog-data').textContent);
  const items = new Map(products.map(p => [p.id,p]));
  const money = n => new Intl.NumberFormat('ko-KR').format(n) + '원';
  const keyOf = item => item.id + ':' + item.option;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const cartKey = 'loop-shelf-cart-v1', savedKey = 'loop-shelf-saved-v1';
  const limit = n => Math.max(1,Math.min(9,Math.trunc(Number(n)) || 1));
  function read(key) {
    try { const value = JSON.parse(localStorage.getItem(key)); return Array.isArray(value) ? value : []; }
    catch { return []; }
  }
  function loadCart() {
    const map = new Map();
    for (const row of read(cartKey)) {
      const p = items.get(row?.id);
      if (!p || !Number.isInteger(row.option) || !p.options[row.option] || !Number.isFinite(row.qty) || row.qty < 1) continue;
      map.set(keyOf(row),{id:row.id,option:row.option,qty:limit(row.qty)});
    }
    return [...map.values()];
  }
  let cart = loadCart(), saved = new Set(read(savedKey).filter(id=>items.has(id)));
  let toastTimer;
  function toast(message) {
    $('.toast').textContent = message;
    clearTimeout(toastTimer);
    toastTimer=setTimeout(() => { $('.toast').textContent = ''; },2700);
  }
  function persist(key,value) {
    try { localStorage.setItem(key,JSON.stringify(value)); return true; }
    catch { return false; }
  }
  const applyCart = () => {
    const count=cart.reduce((sum,row)=>sum+row.qty,0);
    $('.cart-badge').textContent=count;
    $('.cart-link').setAttribute('aria-label','장바구니'+(count?' '+count+'개':''));
  };
  function applySaved() {
    $$('[data-save]').forEach(button => {
      const active=saved.has(button.dataset.save);
      button.setAttribute('aria-pressed',String(active));
      button.setAttribute('aria-label',items.get(button.dataset.save).title+(active?' 찜 해제':' 찜'));
    });
    if ($('#saved-results')) {
      $$('#saved-results [data-product]').forEach(card => { card.hidden=!saved.has(card.dataset.product); });
      $('#saved-empty').hidden=saved.size>0;
    }
  }
  applyCart();
  applySaved();
  document.addEventListener('click', e => {
    const button=e.target.closest('[data-save]');
    if (!button) return;
    const id=button.dataset.save;
    if (saved.has(id)) saved.delete(id); else saved.add(id);
    const kept=persist(savedKey,[...saved]);
    applySaved();
    if (button.closest('[hidden]')) ($('#saved-results .product-card:not([hidden]) [data-save]') || $('#saved-empty a'))?.focus();
    toast(!kept?'이 페이지에서만 찜 상태가 유지됩니다.':saved.has(id)?'찜한 상품에 추가했어요.':'찜한 상품에서 뺐어요.');
  });
  document.querySelector('[data-top]').addEventListener('click', () => window.scrollTo({top:0,behavior:reduced.matches?'instant':'smooth'}));

  function modal(d,opener) {
    d.showModal();
    document.body.classList.add('modal-open');
    if (opener.hasAttribute('aria-expanded')) opener.setAttribute('aria-expanded','true');
    d.addEventListener('close',() => {
      document.body.classList.remove('modal-open');
      if (opener.hasAttribute('aria-expanded')) opener.setAttribute('aria-expanded','false');
      if (!opener.disabled && opener.offsetWidth) opener.focus();
    },{once:true});
  }
  $$('[data-open]').forEach(button => {
    const d=document.getElementById(button.dataset.open);
    button.setAttribute('aria-expanded','false');
    button.setAttribute('aria-controls',d.id);
    button.addEventListener('click', () => { modal(d,button); if (d.id==='search') $('#quick-query').focus(); });
  });
  $$('dialog').forEach(d => {
    $('[data-close]',d).addEventListener('click',() => d.close());
    d.addEventListener('click',e => {
      if(e.target!==d)return;
      const b=d.getBoundingClientRect();
      if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)d.close();
    });
  });
  matchMedia('(max-width:790px)').addEventListener('change',e=>{if(!e.matches&&$('#menu').open)$('#menu').close();});

  const hero=$('.hero');
  if (hero) {
    const slides=$$('.slide',hero), play=$('[data-play]',hero), number=$('.slide-number',hero);
    let position=0, paused=reduced.matches, visible=true, timer;
    const active=()=>slides[position];
    function schedule() {
      clearTimeout(timer);
      if(paused||!visible||document.hidden||hero.matches(':focus-within')||$('dialog[open]'))return;
      timer=setTimeout(()=>{step(1,false);schedule();},8500);
    }
    function step(direction,manual) {
      position=(position+direction+slides.length)%slides.length;
      slides.forEach((slide,index)=>{slide.hidden=index!==position;});
      number.textContent=String(position+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0');
      if(manual) $('.slide-status').textContent=number.textContent+' · '+$('h2',active()).innerText.replace(/\s+/g,' ');
    }
    function playback() {
      play.textContent=paused?'▷':'Ⅱ';
      play.setAttribute('aria-label',paused?'자동 전환 재생':'자동 전환 멈추기');
      play.setAttribute('aria-pressed',String(paused));
      schedule();
    }
    $$('[data-slide]',hero).forEach(button=>button.addEventListener('click',()=>{
      if(button.classList.contains('next-preview')) $('.slide-controls [data-slide="1"]').focus({preventScroll:true});
      step(Number(button.dataset.slide),true);schedule();
    }));
    play.addEventListener('click',()=>{paused=!paused;playback();});
    hero.addEventListener('focusin',schedule);
    hero.addEventListener('focusout',()=>queueMicrotask(schedule));
    document.addEventListener('visibilitychange',schedule);
    $$('[data-open]').forEach(button=>button.addEventListener('click',schedule));
    $$('dialog').forEach(dialog=>dialog.addEventListener('close',schedule));
    if('IntersectionObserver' in window) new IntersectionObserver(([e])=>{visible=e.intersectionRatio>=.25;schedule();},{threshold:[0,.25]}).observe(hero);
    reduced.addEventListener('change',e=>{if(e.matches){paused=true;playback();}});
    playback();
  }

  const results=$('#results');
  if(results) {
    const params=new URLSearchParams(location.search), chips=$$('[data-filter]');
    const cat=chips.some(chip=>chip.dataset.filter===params.get('cat'))?params.get('cat'):'all';
    const q=(params.get('q')||'').trim().slice(0,80);
    const sort=$('#sort');
    const cards=new Map($$('[data-product]',results).map(card=>[card.dataset.product,card]));
    $('#catalog-query').value=q;
    chips.forEach(chip=>{
      if(chip.dataset.filter===cat)chip.setAttribute('aria-current','true');
      if(q){const url=new URL(chip.href);url.searchParams.set('q',q);chip.href=url;}
    });
    if(cat!=='all'){const field=document.createElement('input');field.type='hidden';field.name='cat';field.value=cat;$('.catalog-search').append(field);}
    const norm=s=>s.normalize('NFC').toLocaleLowerCase('ko');
    const terms=norm(q).split(/\s+/).filter(Boolean);
    const list=products.filter(p=>(cat==='all'||cat==='new'&&p.fresh||p.category===cat)&&terms.every(term=>norm([p.artist,p.title,p.format,...p.options].join(' ')).includes(term)));
    function render() {
      const visible=new Set(list.map(p=>p.id));
      cards.forEach((card,id)=>{card.hidden=!visible.has(id);});
      const ordered=[...list].sort((a,b)=>sort.value==='low'?a.price-b.price:sort.value==='high'?b.price-a.price:sort.value==='new'?Number(b.fresh)-Number(a.fresh):0);
      ordered.forEach(p=>results.append(cards.get(p.id)));
      $('.result-count').textContent=(q?'“'+q+'” · ':'')+list.length+'개 상품';
      $('#no-results').hidden=list.length!==0;
    }
    sort.addEventListener('change',render);
    render();
  }

  const form=$('#product-form');
  if(form) {
    const p=items.get(form.dataset.id), qty=$('#qty');
    const total=$('#product-total');
    function update() { total.textContent=money(limit(qty.value)*p.price); }
    $$('[data-qty]',form).forEach(button=>button.addEventListener('click',()=>{qty.value=limit(Number(qty.value)+Number(button.dataset.qty));update();}));
    qty.addEventListener('input',update);
    qty.addEventListener('change',()=>{qty.value=limit(qty.value);update();});
    form.addEventListener('submit',e=>{
      e.preventDefault();
      const option=Number(form.elements.option.value);
      const existing=cart.find(row=>row.id===p.id&&row.option===option);
      const request=limit(qty.value), capacity=9-(existing?.qty||0);
      const added=Math.min(request,capacity);
      if(added>0){if(existing)existing.qty+=added;else cart.push({id:p.id,option,qty:added});}
      const kept=persist(cartKey,cart);
      applyCart();
      $('.after-add').textContent=!kept?'브라우저 저장이 제한되어 다른 페이지에서 목록을 볼 수 없습니다.':!added?'구성마다 최대 9개까지 담을 수 있어요.':added<request?'한도에 맞춰 '+added+'개를 담았어요.':added+'개를 장바구니에 담았어요.';
    });
  }

  const cartItems=$('#cart-items'), ignored=new Set();
  function element(tag,text,cls){
    const el=document.createElement(tag);
    if(text)el.textContent=text;
    if(cls)el.className=cls;
    return el;
  }
  function action(text,label,fn,cls) {
    const button=element('button',text,cls);button.type='button';button.setAttribute('aria-label',label);
    button.addEventListener('click',fn);return button;
  }
  function changeCart(next,focusId) {
    cart=next;
    if(!persist(cartKey,cart))toast('장바구니가 이 페이지에서만 유지됩니다.');
    applyCart();renderCart();
    if(focusId) (cart.length ? ($('[data-focus="'+focusId+'"]:not(:disabled)',cartItems)||$('#select-all')) : $('#cart-empty a'))?.focus({preventScroll:true});
  }
  function renderCart() {
    if(!cartItems)return;
    $('.cart-layout').hidden=!cart.length;
    $('#cart-empty').hidden=!!cart.length;
    cartItems.replaceChildren();
    cart.forEach(row=>{
      const p=items.get(row.id), key=keyOf(row), name=p.title+' · '+p.options[row.option];
      const entry=element('article','','cart-row'), select=document.createElement('input');
      select.type='checkbox';select.checked=!ignored.has(key);select.setAttribute('aria-label',name+' 선택');
      select.addEventListener('change',()=>{if(select.checked)ignored.delete(key);else ignored.add(key);summary();});
      const img=document.createElement('img');img.src='assets/'+p.asset;img.alt='';img.width=75;img.height=75;
      const info=element('div'), h=element('h3'), link=element('a',p.title);
      link.href='product-'+p.id+'.html';h.append(link);
      info.append(h,element('p',p.options[row.option]),element('strong',money(p.price*row.qty)));
      const controls=element('div','','cart-row-controls'), stepper=element('div','','stepper');
      for(const [delta,label,sign] of [[-1,'수량 줄이기','−'],[1,'수량 늘리기','+']]){
        if(delta===1)stepper.append(element('output',String(row.qty)));
        const focus=key+'-'+label;
        const button=action(sign,name+' '+label,()=>{row.qty=limit(row.qty+delta);changeCart(cart,focus);});
        button.dataset.focus=focus;button.disabled=delta===-1?row.qty<=1:row.qty>=9;stepper.append(button);
      }
      controls.append(stepper,action('삭제',name+' 삭제',()=>{ignored.delete(key);changeCart(cart.filter(r=>r!==row),key);},'cart-remove'));
      entry.append(select,img,info,controls);cartItems.append(entry);
    });
    summary();
  }
  function selectedRows(){return cart.filter(row=>!ignored.has(keyOf(row)));}
  function summary() {
    const rows=selectedRows(), all=$('#select-all');
    all.checked=rows.length===cart.length;all.indeterminate=rows.length>0&&rows.length<cart.length;
    $('#selected-qty').textContent=rows.reduce((n,r)=>n+r.qty,0)+'개';
    $('#cart-total').textContent=money(rows.reduce((n,r)=>n+r.qty*items.get(r.id).price,0));
    $('#review-order').disabled=!rows.length;
    $('#remove-selected').disabled=!rows.length;
  }
  if(cartItems) {
    $('#select-all').addEventListener('change',e=>{ignored.clear();if(!e.target.checked)cart.forEach(row=>ignored.add(keyOf(row)));renderCart();});
    $('#remove-selected').addEventListener('click',()=>{const next=cart.filter(row=>ignored.has(keyOf(row)));ignored.clear();changeCart(next,'deleted');});
    $('#review-order').addEventListener('click',e=>{
      const review=$('#review-items');review.replaceChildren();
      selectedRows().forEach(row=>{
        const p=items.get(row.id), line=element('p','','review-line');
        line.append(element('span',p.title+' · '+p.options[row.option]+' × '+row.qty),element('strong',money(p.price*row.qty)));
        review.append(line);
      });
      modal($('#review'),e.currentTarget);
    });
    renderCart();
  }
  window.addEventListener('storage',e=>{
    if(e.key===cartKey||e.key===null){cart=loadCart();applyCart();renderCart();}
    if(e.key===savedKey||e.key===null){saved=new Set(read(savedKey).filter(id=>items.has(id)));applySaved();}
  });
})();
