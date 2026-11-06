(() => {
 'use strict';
 const project=document.body.dataset.project;
 const root=document.body.dataset.root || '';
 const key=`${project}:original-v1`;
 const read=()=>{try { const data=JSON.parse(localStorage.getItem(key)||'{}'); return {saved:Array.isArray(data.saved)?data.saved:[],cart:Array.isArray(data.cart)?data.cart:[]}; }catch{return {saved:[],cart:[]};}};
 let state=read(), data=null, quantity=1, filter='all', toastTimer;
 const write=()=>{try{localStorage.setItem(key,JSON.stringify(state));}catch{showToast('이 브라우저에서는 보관 기능을 사용할 수 없습니다.');} refresh();};
 const showToast=text=>{const target=document.querySelector('[data-toast]');target.textContent=text;target.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>target.classList.remove('visible'),2600);};
 const feedback=(title,text)=>{const dialog=document.querySelector('[data-feedback]');dialog.querySelector('[data-feedback-title]').textContent=title;dialog.querySelector('[data-feedback-message]').textContent=text;dialog.showModal();};
 const menu=document.querySelector('.menu-toggle'),nav=document.getElementById('main-menu');
 menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);});
 document.addEventListener('keydown',event=>{if(event.key==='Escape'){menu.setAttribute('aria-expanded','false');nav.classList.remove('open');}});
 nav.addEventListener('click',event=>{if(event.target.closest('a')){menu.setAttribute('aria-expanded','false');nav.classList.remove('open');}});
 document.querySelectorAll('[data-close]').forEach(button=>button.addEventListener('click',()=>button.closest('dialog').close()));
 const refresh=()=>{
  document.querySelectorAll('[data-cart-count]').forEach(node=>node.textContent=String(state.cart.reduce((sum,item)=>sum+item.qty,0)));
  document.querySelectorAll('[data-save]').forEach(button=>{const saved=state.saved.includes(button.dataset.save);button.setAttribute('aria-pressed',String(saved));button.classList.toggle('is-saved',saved);if(button.classList.contains('save-button'))button.textContent=saved?'♥':'♡';else button.textContent=saved?'보관됨 ♥':'보관하기 ♡';});
  filterCards();
 };
 document.querySelectorAll('[data-save]').forEach(button=>button.addEventListener('click',()=>{const id=button.dataset.save,added=!state.saved.includes(id);state.saved=added?[...state.saved,id]:state.saved.filter(value=>value!==id);write();showToast(added?'보관함에 추가했습니다.':'보관함에서 제거했습니다.');}));
 function filterCards(){
  const panel=document.querySelector('[data-collection]');if(!panel)return;
  const query=panel.querySelector('[data-search]').value.trim().toLocaleLowerCase('ko');
  let count=0;panel.querySelectorAll('[data-card]').forEach(card=>{const savedId=card.querySelector('[data-save]').dataset.save;const match=(filter==='all'||(filter==='saved'?state.saved.includes(savedId):card.dataset.category===filter))&&card.dataset.title.toLocaleLowerCase('ko').includes(query);card.hidden=!match;if(match)count++;});
  panel.querySelector('[data-result]').textContent=`${count}개의 항목`;
  panel.querySelector('[data-empty]').hidden=count>0;
 }
 document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{filter=button.dataset.filter;document.querySelectorAll('[data-filter]').forEach(other=>other.setAttribute('aria-pressed',String(other===button)));filterCards();}));
 document.querySelector('[data-search]')?.addEventListener('input',filterCards);
 document.querySelector('[data-sort]')?.addEventListener('change',event=>{const grid=document.querySelector('[data-grid]'),cards=[...grid.children],sort=event.target.value;cards.sort((a,b)=>sort==='name'?a.dataset.title.localeCompare(b.dataset.title,'ko'):Number(a.dataset[sort==='price'?'price':'order'])-Number(b.dataset[sort==='price'?'price':'order']));cards.forEach(card=>grid.append(card));});
 document.querySelectorAll('[data-quantity]').forEach(button=>button.addEventListener('click',()=>{quantity=Math.max(1,Math.min(20,quantity+Number(button.dataset.quantity)));document.querySelector('[data-quantity-value]').textContent=String(quantity);}));
 const loadData=async()=>{if(data)return data;const embedded=document.getElementById('catalog-data');if(embedded){data=JSON.parse(embedded.textContent);return data;}const response=await fetch(root+'site-config.json');if(!response.ok)throw Error('content');data=await response.json();return data;};
 document.querySelectorAll('[data-add]').forEach(button=>button.addEventListener('click',async()=>{button.disabled=true;try{const config=await loadData();const item=config.items.find(entry=>entry.id===button.dataset.add);if(!item)return;const option=document.querySelector('[data-product-option]').value;const existing=state.cart.find(entry=>entry.id===item.id&&entry.option===option);if(existing)existing.qty=Math.min(20,existing.qty+quantity);else state.cart.push({id:item.id,option,qty:quantity});write();showToast('구성에 담았습니다. 상단의 구성에서 확인해 주세요.');}catch{showToast('항목을 불러오지 못했습니다. 정적 서버에서 다시 열어 주세요.');}finally{button.disabled=false;}}));
 const cart=document.querySelector('[data-cart-items]');
 async function renderCart(){
  if(!cart)return;
  try{
   const config=await loadData();cart.replaceChildren();let total=0;
   state.cart=state.cart.filter(entry=>config.items.some(item=>item.id===entry.id)&&Number.isInteger(entry.qty)&&entry.qty>=1&&entry.qty<=20);
   if(!state.cart.length){const empty=document.createElement('p');empty.className='empty-state';empty.textContent='아직 담은 항목이 없습니다. 컬렉션에서 관심 있는 항목을 선택해 보세요.';cart.append(empty);}
   state.cart.forEach((entry,index)=>{
    const item=config.items.find(item=>item.id===entry.id);total+=(item.price||0)*entry.qty;
    const article=document.createElement('article');article.className='cart-row';
    const image=document.createElement('img');image.src=root+item.image;image.alt=item.title;
    const copy=document.createElement('div'),title=document.createElement('h2'),note=document.createElement('p'),price=document.createElement('p');title.textContent=item.title;note.textContent=entry.option;price.textContent=((item.price||0)*entry.qty).toLocaleString('ko-KR')+'원';copy.append(title,note,price);
    const controls=document.createElement('div');controls.className='cart-controls';
    const label=document.createElement('label');label.textContent='수량 ';const select=document.createElement('select');select.setAttribute('aria-label',item.title+' 수량');for(let number=1;number<=20;number++){const option=document.createElement('option');option.value=String(number);option.textContent=String(number);option.selected=number===entry.qty;select.append(option);}select.addEventListener('change',()=>{state.cart[index].qty=Number(select.value);write();renderCart();});label.append(select);
    const remove=document.createElement('button');remove.type='button';remove.textContent='제거';remove.setAttribute('aria-label',item.title+' 구성에서 제거');remove.addEventListener('click',()=>{state.cart.splice(index,1);write();renderCart();});controls.append(label,remove);article.append(image,copy,controls);cart.append(article);
   });
   document.querySelector('[data-cart-total]').textContent=total.toLocaleString('ko-KR')+'원';refresh();
  }catch{cart.textContent='구성을 불러오지 못했습니다. 정적 서버에서 페이지를 다시 열어 주세요.';}
 }
 const form=document.querySelector('[data-contact]');
 if(form){const selected=new URLSearchParams(location.search).get('item');if(selected)form.elements.item.value=selected;const date=form.elements.date;date.min=new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Seoul'}).format(new Date());form.addEventListener('submit',event=>{event.preventDefault();if(!form.reportValidity())return;feedback('작성 내용을 확인했습니다.',`${form.elements.name.value}님, 선택한 ${form.elements.type.value} 내용을 이 화면에서 확인했습니다. 실제 문의나 예약은 접수되지 않았으며 입력 내용은 저장·전송하지 않았습니다.`);form.reset();});}
 document.querySelectorAll('[data-print]').forEach(button=>button.addEventListener('click',()=>window.print()));
 const search=document.querySelector('[data-search]');if(search){const query=new URLSearchParams(location.search).get('q');if(query)search.value=query;}
 refresh();renderCart();
})();
