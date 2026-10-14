(function () {
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const data = window.DAYWELL24;
  window.emartBridge = () => true;
  function route(value) {
    if (!value || value.startsWith('#') || value.startsWith('javascript:')) return value;
    const parsed = new URL(value, location.href);
    if (parsed.pathname.endsWith('.html') && !parsed.hostname.includes('emart24')) return value;
    const local = data.routes[parsed.pathname] || (parsed.pathname.includes('/event/') ? 'daywell24-event-detail.html' : null);
    return local ? local + parsed.search + parsed.hash : value;
  }
  const dialog = document.createElement('dialog');
  dialog.className = 'daywell-dialog';
  dialog.setAttribute('aria-label', '데이웰24 안내');
  document.body.append(dialog);
  function show(title, text, product) {
    dialog.replaceChildren();
    const close = document.createElement('button');
    close.className='daywell-close'; close.type='button'; close.textContent='×'; close.setAttribute('aria-label','안내 닫기');close.onclick=()=>dialog.close();
    const heading=document.createElement('h2'); heading.textContent=title;
    const paragraph=document.createElement('p');paragraph.textContent=text;
    dialog.append(close,heading);
    if(product){const img=document.createElement('img');img.src=product.image;img.alt=product.TITLE;dialog.append(img);}
    dialog.append(paragraph);
    if(!dialog.open)dialog.showModal();
  }
  dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
  window.addEventListener('daywell-auth-demo',()=>show('본인인증 시연 안내','이 화면은 가상의 브랜드 템플릿입니다. 외부 본인인증 서비스를 실행하거나 인증 정보를 전송하지 않습니다.'));
  $$('a[href]').forEach(anchor=>{const mapped=route(anchor.getAttribute('href'));if(mapped)anchor.setAttribute('href',mapped);});
  // Runtime-generated links follow the same static destinations as the original controls.
  document.addEventListener('click',event=> {
    const anchor=event.target.closest('a[href]');
    if(anchor){const mapped=route(anchor.getAttribute('href'));if(mapped!==anchor.getAttribute('href'))anchor.href=mapped;}
    const productButton=event.target.closest('[data-daywell-product]');
    if(productButton){event.preventDefault();const product=data.products.find(p=>p.id===productButton.dataset.daywellProduct);if(product)show(product.TITLE,`${product.PRICE_REAL.toLocaleString('ko-KR')}원 · ${product.CATEGORY} 구성의 가상 상품입니다. 상품 사진과 가격은 화면 시연용 예시입니다.`,product);}
  });
  $$('form').forEach(form=>form.addEventListener('submit',event=> {
    const search=form.querySelector('[name="search"], [name="keyword"]');
    if(search && document.body.dataset.daywellPage==='stores')return;
    event.preventDefault();
    if(!form.reportValidity())return;
    show('작성 내용을 확인했습니다.','데이웰24는 가상의 브랜드입니다. 입력한 이름·연락처·문의 내용은 서버로 전송하거나 저장하지 않으며, 실제 신청은 이루어지지 않습니다.');
  },true));
  const menu=$('.topHeader .right');
  if(menu){menu.setAttribute('role','button');menu.setAttribute('aria-label','전체 메뉴');menu.setAttribute('tabindex','0');menu.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();menu.click();}if(event.key==='Escape'&&$('.mobGnbWrap')?.classList.contains('gnbOpen'))menu.click();});}
  ['.playBtn','.prevBtn','.nextBtn','.icoSearch'].forEach((selector,index)=>{$$(selector).forEach(el=>{el.setAttribute('role','button');el.setAttribute('tabindex','0');el.setAttribute('aria-label',['이벤트 자동 재생 전환','이전 이벤트','다음 이벤트','매장 검색'][index]);el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();el.click();}});});});
  // Remove stale original download/submit destinations while leaving their visual controls intact.
  $$('a[download]').forEach(a=>a.href='downloads/daywell24-brand-guide.txt');
  const brandDownloads=$$('[onclick*="Download"], [onclick*="download"]');
  brandDownloads.forEach(el=>el.addEventListener('click',event=>{event.preventDefault();event.stopImmediatePropagation();const a=document.createElement('a');a.href='downloads/daywell24-brand-guide.txt';a.download='daywell24-brand-guide.txt';a.click();},true));
})();
