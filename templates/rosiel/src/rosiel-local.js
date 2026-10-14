(function () {
  const data = window.ROSIEL;
  const dialog = document.createElement('dialog');
  dialog.className = 'rosiel-dialog'; dialog.setAttribute('aria-label','로지엘 안내'); document.body.append(dialog);
  function show(title, text) {
    dialog.replaceChildren();
    const close = document.createElement('button');close.type='button';close.className='rosiel-close';close.textContent='×';close.setAttribute('aria-label','안내 닫기');close.onclick=()=>dialog.close();
    const h=document.createElement('h2');h.textContent=title;const p=document.createElement('p');p.textContent=text;dialog.append(close,h,p);if(!dialog.open)dialog.showModal();
  }
  document.addEventListener('click',event=>{if(event.target.closest('[data-rosiel-info]')){event.preventDefault();show('로지엘 상품 안내','가상의 브랜드와 상품을 소개하는 디자인 시연입니다. 실제 구매·결제·주문은 진행되지 않습니다.');}});
  document.addEventListener('submit',event=> {
    const form=event.target;
    if(form.querySelector('.search-field,[name="s"]')){
      event.preventDefault();event.stopImmediatePropagation();const q=form.querySelector('.search-field,[name="s"]').value.trim();location.href='rosiel-collection.html?q='+encodeURIComponent(q);return;
    }
    event.preventDefault();event.stopImmediatePropagation();show('로지엘 디자인 시연','실제 주문이나 신청은 접수되지 않으며 입력 내용을 저장하거나 전송하지 않습니다.');
  },true);
  // Existing native controls are kept; these attributes only add accessible keyboard access.
  const toggle=document.getElementById('toggle');
  if(toggle){toggle.setAttribute('role','button');toggle.setAttribute('tabindex','0');toggle.setAttribute('aria-label','전체 메뉴');toggle.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();toggle.click();}});}
  const fetchOriginal=window.fetch;
  window.fetch=function(input,options){if(/rosiel-local-api|wp-admin|wp-json|wc-ajax/.test(String(input?.url||input)))return Promise.resolve(new Response(JSON.stringify({success:true,suggestions:[],data:[],html:'',fragments:{}}),{headers:{'Content-Type':'application/json'}}));return fetchOriginal.apply(this,arguments);};
  const params=new URLSearchParams(location.search);
  if(document.body.dataset.rosielPage==='collection'){
    const query=(params.get('q')||'').toLowerCase();const category=(params.get('category')||'all').split('/')[0];
    const matches=data.products.filter(product=>(category==='all'||category==='new'||product.category===category)&&(!query||product.name.toLowerCase().includes(query)));
    document.querySelectorAll('.product-grid-item').forEach(card=>{const href=card.querySelector('h3 a')?.getAttribute('href');const product=data.products.find(p=>p.page===href);const hidden=!!product&&!matches.includes(product);card.hidden=hidden;card.style.display=hidden?'none':'';});
    const categoryNames={all:'전체 상품',new:'새로운 상품',eye:'아이 메이크업',lip:'립 메이크업',face:'페이스 메이크업','skin-care':'스킨케어',cleanser:'클렌저','sun-care':'선 케어',nail:'네일',body:'바디',hair:'헤어',tool:'뷰티 도구','mask-pack':'마스크팩'};
    const heading=document.querySelector('.page-title h1,.page-title .entry-title');if(heading)heading.textContent=query?'“'+params.get('q')+'” 검색 결과':categoryNames[category]||'로지엘 컬렉션';
  }
  // Main search preview uses the original result container and merchandise card markup.
  document.querySelectorAll('.main-search .search-field').forEach(input=>input.addEventListener('input',()=> {
    const term=input.value.trim().toLowerCase(),target=document.querySelector('.main-search .smart-search-results');if(!target)return;
    const matches=data.products.filter(p=>p.name.toLowerCase().includes(term)).slice(0,6);
    let results=target.querySelector('[data-rosiel-results]');if(!results){results=document.createElement('div');results.setAttribute('data-rosiel-results','');target.append(results);}results.replaceChildren(); if(!term)return;
    matches.forEach(product=>{const a=document.createElement('a');a.href=product.page;a.className='smart-search-suggestion';const img=document.createElement('img');img.src=product.image;img.alt=product.name;img.width=70;img.height=70;const label=document.createElement('span');label.textContent=product.name; a.append(img,label);results.append(a);});
    if(!matches.length){const p=document.createElement('p');p.textContent='검색 결과가 없습니다.';results.append(p);}
  }));
})();
