(() => {
  'use strict';
  const $=(q,root=document)=>root.querySelector(q);
  const $$=(q,root=document)=>[...root.querySelectorAll(q)];
  const products=JSON.parse($('#shop-data').textContent);
  const items=new Map(products.map(p=>[p.id,p]));
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const keys={cart:'aislegate-cart-v1',saved:'aislegate-saved-v1',recent:'aislegate-recent-v1',currency:'aislegate-currency-v1'};
  function load(k,defaultValue){
    try { return JSON.parse(localStorage.getItem(keys[k]))??defaultValue; } catch { return defaultValue; }
  }
  function store(k,value){
    try { localStorage.setItem(keys[k],JSON.stringify(value)); return true; } catch { return false; }
  }
  const list=k=>{const v=load(k,[]);return Array.isArray(v)?v:[];};
  const ids=k=>[...new Set(list(k).filter(id=>items.has(id)))];
  const key=row=>row.id+':'+row.option;
  const quantity=n=>Math.max(1,Math.min(9,Math.trunc(Number(n))||1));
  function loadCart(){
    const valid=new Map();
    list('cart').forEach(row=>{
      const item=items.get(row?.id);
      if(item&&Number.isInteger(row.option)&&item.options[row.option]&&Number.isFinite(row.qty)&&row.qty>=1)valid.set(key(row),{id:row.id,option:row.option,qty:quantity(row.qty)});
    });
    return [...valid.values()];
  }
  let cart=loadCart(), saved=ids('saved'), recent=ids('recent').slice(0,8), currency=load('currency','USD')==='KRW'?'KRW':'USD';
  const detail=items.get(document.body.dataset.item);
  if(detail){recent=[detail.id,...recent.filter(id=>id!==detail.id)].slice(0,8);store('recent',recent);}
  const krw=new Intl.NumberFormat('ko-KR');
  const usd=new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'});
  const money=n=>currency==='KRW'?krw.format(Math.round(n*1350/100))+'원':usd.format(n/100);
  let toastTimer;
  function toast(t){$('.toast').textContent=t;clearTimeout(toastTimer);toastTimer=setTimeout(()=>{$('.toast').textContent='';},2600);}
  function prices(root=document){$$('[data-price]',root).forEach(el=>{el.textContent=money(Number(el.dataset.price));});}
  function currencyState(){
    $$('[data-currency]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.currency===currency)));
    prices();
  }
  $$('[data-currency]').forEach(button=>button.addEventListener('click',()=>{
    currency=button.dataset.currency;store('currency',currency);currencyState();
    toast(currency==='KRW'?'원화 예시 표시 · 1달러당 1,350원 적용':'달러 예시 표시');
  }));
  currencyState();
  function badge(){
    const n=cart.reduce((sum,row)=>sum+row.qty,0);
    $('.bag-count').textContent=n;
    $('.bag-link').setAttribute('aria-label','장바구니'+(n?' '+n+'개':''));
  }
  function refreshArchives(){
    $$('[data-save]').forEach(b=>{
      const active=saved.includes(b.dataset.save);
      b.setAttribute('aria-pressed',String(active));
      b.setAttribute('aria-label',items.get(b.dataset.save).name+(active?' 관심 해제':' 관심 등록'));
    });
    for(const [kind,selected] of [['saved',saved],['recent',recent]]){
      const grid=$('#'+kind+'-grid');if(!grid)continue;
      const cards=new Map($$('[data-product]',grid).map(el=>[el.dataset.product,el]));
      cards.forEach((el,id)=>{el.hidden=!selected.includes(id);});
      selected.forEach(id=>grid.append(cards.get(id)));
      $('#'+kind+'-empty').hidden=selected.length>0;
      if(kind==='recent')$('#clear-recent').disabled=selected.length===0;
    }
  }
  function add(id,option,qty){
    const row=cart.find(r=>r.id===id&&r.option===option);
    const count=Math.min(9-(row?.qty||0),qty);
    if(count>0){if(row)row.qty+=count;else cart.push({id,option,qty:count});}
    const ok=store('cart',cart);badge();
    if(!ok)return '브라우저 저장이 제한되어 다른 화면에서는 보관되지 않습니다.';
    if(!count)return '같은 구성은 최대 9개까지 담을 수 있어요.';
    return count<qty?'한도에 맞춰 '+count+'개를 담았어요.':count+'개를 장바구니에 담았어요.';
  }
  document.addEventListener('click',e=>{
    const save=e.target.closest('[data-save]'), quick=e.target.closest('[data-add]');
    if(save){
      const id=save.dataset.save,active=saved.includes(id);
      saved=active?saved.filter(x=>x!==id):[id,...saved];
      const ok=store('saved',saved);refreshArchives();
      if(save.closest('[hidden]'))($('#saved-grid article:not([hidden]) [data-save]')||$('#saved-empty a'))?.focus();
      toast(ok?(active?'관심 상품에서 뺐어요.':'관심 상품에 담았어요.'):'현재 화면에서만 관심 상태가 유지됩니다.');
    }
    if(quick)toast(add(quick.dataset.add,0,1));
  });
  badge();refreshArchives();
  $('#clear-recent')?.addEventListener('click',()=>{
    const kept=store('recent',[]);recent=[];refreshArchives();$('#recent-empty a').focus();
    toast(kept?'최근 본 상품 기록을 비웠어요.':'현재 화면에서만 기록을 비웠어요.');
  });
  $('[data-top]').addEventListener('click',()=>window.scrollTo({top:0,behavior:reduce.matches?'instant':'smooth'}));

  function open(dialog,opener){
    dialog.showModal();document.body.classList.add('modal-open');
    if(opener.hasAttribute('aria-expanded'))opener.setAttribute('aria-expanded','true');
    dialog.addEventListener('close',()=>{
      document.body.classList.remove('modal-open');
      if(opener.hasAttribute('aria-expanded'))opener.setAttribute('aria-expanded','false');
      if(opener.offsetWidth&&!opener.disabled)opener.focus();
    },{once:true});
  }
  $$('[data-open]').forEach(b=>{
    b.setAttribute('aria-expanded','false');b.setAttribute('aria-controls',b.dataset.open);
    b.addEventListener('click',()=>{open(document.getElementById(b.dataset.open),b);if(b.dataset.open==='search-dialog')$('#dialog-query').focus();});
  });
  $$('dialog').forEach(d=>{
    $('[data-close]',d).addEventListener('click',()=>d.close());
    d.addEventListener('click',e=>{
      if(e.target!==d)return;const r=d.getBoundingClientRect();
      if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();
    });
  });
  matchMedia('(max-width:790px)').addEventListener('change',e=>{if(!e.matches&&$('#search-dialog').open)$('#search-dialog').close();});
  const hero=$('.hero');
  if(hero){
    const slides=$$('.hero-slide',hero), play=$('[data-play]',hero);
    let idx=0,paused=reduce.matches,visible=true,timer;
    function schedule(){
      clearTimeout(timer);
      if(paused||!visible||document.hidden||hero.matches(':focus-within')||$('dialog[open]'))return;
      timer=setTimeout(()=>{show(1,false);schedule();},9500);
    }
    function show(delta,manual){
      idx=(idx+delta+slides.length)%slides.length;
      slides.forEach((s,i)=>{s.hidden=idx!==i;});
      const count=String(idx+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0');
      $('.counter').textContent=count;
      if(manual)$('.hero-announcement').textContent=count+' · '+$('h2',slides[idx]).innerText.replace(/\s+/g,' ');
    }
    function playback(){
      play.textContent=paused?'▷':'Ⅱ';play.setAttribute('aria-pressed',String(paused));play.setAttribute('aria-label',paused?'자동 전환 재생':'자동 전환 멈추기');schedule();
    }
    $$('[data-shift]',hero).forEach(b=>b.addEventListener('click',()=>{show(Number(b.dataset.shift),true);schedule();}));
    play.addEventListener('click',()=>{paused=!paused;playback();});
    hero.addEventListener('focusin',schedule);hero.addEventListener('focusout',()=>queueMicrotask(schedule));
    document.addEventListener('visibilitychange',schedule);
    $$('[data-open]').forEach(b=>b.addEventListener('click',schedule));
    $$('dialog').forEach(d=>d.addEventListener('close',schedule));
    if('IntersectionObserver' in window)new IntersectionObserver(([e])=>{visible=e.intersectionRatio>=.25;schedule();},{threshold:[0,.25]}).observe(hero);
    reduce.addEventListener('change',e=>{if(e.matches){paused=true;playback();}});playback();
  }

  const grid=$('#catalog-grid');
  if(grid){
    const params=new URLSearchParams(location.search), filters=$$('[data-filter]'), sort=$('#sort');
    const cat=filters.some(b=>b.dataset.filter===params.get('cat'))?params.get('cat'):'all';
    const q=(params.get('q')||'').trim().slice(0,80), norm=t=>t.normalize('NFC').toLocaleLowerCase('ko');
    $('#catalog-query').value=q;$('#head-query').value=q;
    if([...sort.options].some(o=>o.value===params.get('sort')))sort.value=params.get('sort');
    const terms=norm(q).split(/\s+/).filter(Boolean);
    const visible=products.filter(p=>(cat==='all'||cat==='sale'&&p.list>p.price||p.cat===cat)&&terms.every(t=>norm(p.brand+' '+p.name+' '+p.options.join(' ')).includes(t)));
    const cards=new Map($$('[data-product]',grid).map(e=>[e.dataset.product,e]));
    filters.forEach(a=>{
      if(a.dataset.filter===cat)a.setAttribute('aria-current','true');
      const url=new URL(a.href);if(q)url.searchParams.set('q',q);if(sort.value!=='default')url.searchParams.set('sort',sort.value);a.href=url;
    });
    if(cat!=='all'){
      const input=document.createElement('input');input.type='hidden';input.name='cat';input.value=cat;$('.catalog-search').append(input);
    }
    const discount=p=>(p.list-p.price)/p.list;
    function render(){
      const shown=new Set(visible.map(p=>p.id));cards.forEach((e,id)=>{e.hidden=!shown.has(id);});
      [...visible].sort((a,b)=>sort.value==='rank'?a.rank-b.rank:sort.value==='sale'?discount(b)-discount(a):sort.value==='low'?a.price-b.price:sort.value==='high'?b.price-a.price:0).forEach(p=>grid.append(cards.get(p.id)));
      filters.forEach(a=>{const u=new URL(a.href);if(sort.value==='default')u.searchParams.delete('sort');else u.searchParams.set('sort',sort.value);a.href=u;});
      $('#result-count').textContent=(q?'“'+q+'” · ':'')+visible.length+'개 상품';$('#no-results').hidden=visible.length>0;
    }
    sort.addEventListener('change',render);render();
  }
  const addForm=$('#add-form');
  if(addForm&&detail){
    const qty=$('#qty'), total=$('.detail-total');
    function calculate(){total.dataset.price=detail.price*quantity(qty.value);total.textContent=money(Number(total.dataset.price));}
    $$('[data-qty]',addForm).forEach(b=>b.addEventListener('click',()=>{qty.value=quantity(Number(qty.value)+Number(b.dataset.qty));calculate();}));
    qty.addEventListener('input',calculate);qty.addEventListener('change',()=>{qty.value=quantity(qty.value);calculate();});
    addForm.addEventListener('submit',e=>{e.preventDefault();$('#added').textContent=add(detail.id,Number($('#variant').value),quantity(qty.value));});
  }

  const cartRows=$('#cart-rows'), ignored=new Set();
  const el=(tag,text='',cls='')=>{const e=document.createElement(tag);e.textContent=text;if(cls)e.className=cls;return e;};
  function priced(n){const s=el('span',money(n));s.dataset.price=n;return s;}
  const selected=()=>cart.filter(r=>!ignored.has(key(r)));
  function cartSummary(){
    const rows=selected(), checkbox=$('#cart-all'), total=$('.cart-total');
    checkbox.checked=rows.length===cart.length;checkbox.indeterminate=rows.length>0&&rows.length<cart.length;
    $('#cart-qty').textContent=rows.reduce((a,b)=>a+b.qty,0)+'개';
    total.dataset.price=rows.reduce((sum,row)=>sum+items.get(row.id).price*row.qty,0);total.textContent=money(Number(total.dataset.price));
    $('#cart-delete').disabled=$('#cart-preview').disabled=!rows.length;
  }
  function saveCart(focus){
    if(!store('cart',cart))toast('장바구니가 현재 화면에서만 유지됩니다.');
    badge();renderCart();
    if(focus)(cart.length?($('[data-focus="'+focus+'"]:not(:disabled)',cartRows)||$('#cart-all')):$('#cart-empty a'))?.focus({preventScroll:true});
  }
  function renderCart(){
    if(!cartRows)return;
    $('.cart-layout').hidden=!cart.length;$('#cart-empty').hidden=!!cart.length;cartRows.replaceChildren();
    cart.forEach(row=>{
      const p=items.get(row.id), id=key(row), name=p.name+' · '+p.options[row.option];
      const article=el('article','','cart-row'), tick=el('input');tick.type='checkbox';tick.checked=!ignored.has(id);tick.setAttribute('aria-label',name+' 선택');
      tick.addEventListener('change',()=>{if(tick.checked)ignored.delete(id);else ignored.add(id);cartSummary();});
      const img=el('img');img.src='assets/'+p.image;img.alt='';img.width=70;img.height=70;
      const copy=el('div'), h=el('h3'), link=el('a',p.name), amount=el('strong');link.href='product-'+p.id+'.html';h.append(link);amount.append(priced(p.price*row.qty));copy.append(h,el('p',p.options[row.option]),amount);
      const actions=el('div','','cart-actions'), step=el('div','','stepper');
      for(const [delta,t,s] of [[-1,'수량 줄이기','−'],[1,'수량 늘리기','+']]){
        if(delta===1)step.append(el('output',String(row.qty)));
        const b=el('button',s), focus=id+'-'+t;b.type='button';b.dataset.focus=focus;b.setAttribute('aria-label',name+' '+t);b.disabled=delta===1?row.qty>=9:row.qty<=1;
        b.addEventListener('click',()=>{row.qty=quantity(row.qty+delta);saveCart(focus);});step.append(b);
      }
      const remove=el('button','삭제','remove');remove.type='button';remove.setAttribute('aria-label',name+' 삭제');
      remove.addEventListener('click',()=>{ignored.delete(id);cart=cart.filter(r=>r!==row);saveCart('removed');});
      actions.append(step,remove);article.append(tick,img,copy,actions);cartRows.append(article);
    });cartSummary();
  }
  if(cartRows){
    $('#cart-all').addEventListener('change',e=>{ignored.clear();if(!e.target.checked)cart.forEach(r=>ignored.add(key(r)));renderCart();});
    $('#cart-delete').addEventListener('click',()=>{cart=cart.filter(r=>ignored.has(key(r)));ignored.clear();saveCart('removed');});
    $('#cart-preview').addEventListener('click',e=>{
      const rows=$('#preview-rows');rows.replaceChildren();
      selected().forEach(r=>{const p=items.get(r.id),line=el('p','','preview-line');line.append(el('span',p.name+' · '+p.options[r.option]+' × '+r.qty),priced(p.price*r.qty));rows.append(line);});
      open($('#preview-dialog'),e.currentTarget);
    });renderCart();
  }
  $('#pickup-form')?.addEventListener('submit',e=>{
    e.preventDefault();
    const terminal=$('#terminal'), departure=$('#departure'), result=$('#pickup-result');
    const area=terminal.value==='1'?'초록 라운지 옆 데스크 A':'중앙 아트리움 옆 데스크 B';
    result.replaceChildren(el('strong','터미널 '+terminal.value+' · '+departure.selectedOptions[0].textContent),el('p','가상 수령 위치: '+area),el('p','탑승 구역 안내 → 시연 데스크 → 상품 구성 확인'),el('p','시연 전용 · 일정은 저장되지 않습니다.'));
    result.hidden=false;result.focus();
  });
  window.addEventListener('storage',e=>{
    if(e.key===keys.currency||e.key===null){currency=load('currency','USD')==='KRW'?'KRW':'USD';currencyState();}
    if(e.key===keys.cart||e.key===null){cart=loadCart();badge();renderCart();}
    if(e.key===keys.saved||e.key===keys.recent||e.key===null){saved=ids('saved');recent=ids('recent').slice(0,8);refreshArchives();}
  });
})();
