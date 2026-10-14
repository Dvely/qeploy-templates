import {categories, products, image, productUrl} from './ongyeol-data.js';
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const escape = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const menu = $('#all-menu');
const menuButton = $('[data-action="menu"]');
let previousFocus;
function toggleMenu(open) {
  if (open) previousFocus = document.activeElement;
  menu.hidden = !open;
  menuButton.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('locked', open);
  $$('.header, main, .footer, .section-dots, .top-button, .skip').forEach(el => el.inert = open);
  if (open) $('[data-action="close-menu"]').focus();
  else previousFocus?.focus();
}
function showDialog(id) {
  const dialog = $(id);
  dialog.showModal();
  document.body.classList.add('locked');
}
$$('dialog').forEach(dialog => {
  dialog.addEventListener('close', () => document.body.classList.remove('locked'));
  dialog.addEventListener('click', event => {
    if(event.target === dialog) {
      const r = dialog.getBoundingClientRect();
      if(event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
    }
  });
});
let heroIndex = 0;
let paused = matchMedia('(prefers-reduced-motion: reduce)').matches;
const slides = $$('.hero-slide');
function setHero(index) {
  if (!slides.length) return;
  heroIndex = (index + slides.length) % slides.length;
  slides.forEach((slide,i) => {
    slide.classList.toggle('active', i === heroIndex);
    slide.setAttribute('aria-hidden', String(i !== heroIndex));
  });
  $$('[data-slide]').forEach((button,i) => {
    button.classList.toggle('active', i === heroIndex);
    button.setAttribute('aria-pressed', String(i === heroIndex));
  });
}
if(slides.length) {
  const pauseButton = $('[data-action="hero-pause"]');
  const updatePause = () => {
    pauseButton.textContent = paused ? '▶' : 'Ⅱ';
    pauseButton.setAttribute('aria-label', paused ? '자동 재생 시작' : '자동 재생 일시정지');
  };
  updatePause();
  pauseButton.addEventListener('click', () => { paused = !paused; updatePause(); });
  setInterval(() => {
    if(!paused && !document.hidden && menu.hidden && !$('.hero-controls').contains(document.activeElement)) setHero(heroIndex + 1);
  }, 5000);
}
let bestIndex = 0;
const bestIds = ['window-1', 'partition-2', 'door-1', 'board-4'];
function setBest(direction) {
  bestIndex = (bestIndex + direction + bestIds.length) % bestIds.length;
  const product = products.find(p => p.id === bestIds[bestIndex]);
  const img = $('.product-showcase img');
  img.src = image(product.image);
  img.alt = product.name + ' 공간 연출';
  $('#best-category').textContent = categories.find(c => c.id === product.category).name;
  $('#best-name').textContent = product.name;
  $('#best-link').href = productUrl(product.id);
}
let showroomIndex = 0;
function setShowroom(direction) {
  const ids = ['showroom', 'door', 'materials'];
  showroomIndex = (showroomIndex + direction + ids.length) % ids.length;
  $('.showroom-photo img').src = image(ids[showroomIndex]);
  $('.showroom-photo img').alt = ['온결 소재 라이브러리','도어와 중문 전시','소재 샘플 구성'][showroomIndex];
}
let productPhotoIndex = 0;
const currentProduct = products.find(p => p.id === document.body.dataset.key);
function setProductPhoto(direction) {
  const ids = [currentProduct.image, currentProduct.image === 'materials' ? 'hero' : 'materials', 'showroom'];
  productPhotoIndex = (productPhotoIndex + direction + ids.length) % ids.length;
  $('.product-main-photo img').src = image(ids[productPhotoIndex]);
  $('.product-main-photo img').alt = `${currentProduct.name} · ${['공간 연출','소재 조합','쇼룸 구성'][productPhotoIndex]}`;
  $('#product-photo-count').textContent = `${String(productPhotoIndex+1).padStart(2,'0')} / 03`;
}
document.addEventListener('click',event => {
  const button = event.target.closest('[data-action], [data-slide]');
  if(!button) return;
  const action = button.dataset.action;
  if(button.hasAttribute('data-slide')) setHero(Number(button.dataset.slide));
  else if(action==='menu') toggleMenu(true);
  else if(action==='close-menu') toggleMenu(false);
  else if(action==='language') {
    const panel = $('.language');
    panel.hidden = !panel.hidden;
    button.setAttribute('aria-expanded',String(!panel.hidden));
  }
  else if(action==='search') { showDialog('#search-modal'); $('#search-modal input').focus(); }
  else if(action==='story') showDialog('#story-modal');
  else if(action==='close-dialog') button.closest('dialog').close();
  else if(action==='hero-prev') setHero(heroIndex - 1);
  else if(action==='hero-next') setHero(heroIndex + 1);
  else if(action==='best-prev'||action==='best-next') setBest(action.endsWith('prev')?-1:1);
  else if(action==='showroom-prev'||action==='showroom-next') setShowroom(action.endsWith('prev')?-1:1);
  else if(action==='product-prev'||action==='product-next') setProductPhoto(action.endsWith('prev')?-1:1);
  else if(action==='print') window.print();
});
document.addEventListener('keydown',event => {
  if(event.key==='Escape') {
    if(!menu.hidden) toggleMenu(false);
    $('.language').hidden = true;
    $('[data-action="language"]').setAttribute('aria-expanded','false');
  }
  if(event.key==='Tab' && !menu.hidden) {
    const focusable = [...menu.querySelectorAll('button, a[href]')];
    const first = focusable[0], last = focusable.at(-1);
    if(event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if(!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});
document.addEventListener('click',event => {
  if(!event.target.closest('.language,[data-action="language"]')) {
    $('.language').hidden = true;
    $('[data-action="language"]').setAttribute('aria-expanded','false');
  }
});
const searchForm = $('.search-form');
function runSearch() {
  const query = searchForm.querySelector('input').value.trim().toLocaleLowerCase();
  const matches = query ? products.filter(p => `${p.name} ${p.type} ${categories.find(c=>c.id===p.category).name}`.toLocaleLowerCase().includes(query)) : [];
  $('.search-results').innerHTML = query ? (matches.length ? `<p>${matches.length}개 제품을 찾았습니다.</p>`+matches.map(p=>`<a href="${productUrl(p.id)}"><img src="${image(p.image)}" alt="${p.name}"><div>${p.name}<span>${p.type} · ${p.code}</span></div></a>`).join('') : `<p>“${escape(query)}” 검색 결과가 없습니다. 다른 제품명이나 분류로 검색해 보세요.</p>`) : '<p>온결의 제품과 소재를 찾아보세요.</p>';
}
searchForm.addEventListener('submit', event=>{event.preventDefault();runSearch();});
searchForm.querySelector('input').addEventListener('input',runSearch);
const productFilter = $('[data-product-filter]');
if(productFilter) productFilter.addEventListener('input',()=> {
  const query = productFilter.value.trim().toLocaleLowerCase();
  const cards = $$('.filter-grid .card');
  cards.forEach(card=>card.hidden=!card.dataset.search.toLocaleLowerCase().includes(query));
  const count = cards.filter(card=>!card.hidden).length;
  $('#result-count').textContent=String(count);
  $('.filter-grid .empty').hidden=count!==0;
});
$$('[data-gallery-filter]').forEach(button=>button.addEventListener('click',()=> {
  $$('[data-gallery-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
  $$('.gallery-grid .card').forEach(card=>card.hidden=button.dataset.galleryFilter!=='ALL'&&card.dataset.galleryType!==button.dataset.galleryFilter);
}));
$$('[data-finish]').forEach(button=>button.addEventListener('click',()=> {
  $$('[data-finish]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
  $('#selected-finish').textContent=button.dataset.finish;
  const contactLink = $('.product-info a[href^="ongyeol-contact"]');
  contactLink.href=`ongyeol-contact.html?product=${currentProduct.id}&finish=${encodeURIComponent(button.dataset.finish)}`;
}));
$$('[data-future-date]').forEach(input=> {
  const today = new Date();
  const offset = today.getTimezoneOffset();
  input.min = new Date(today.getTime()-offset*60000).toISOString().slice(0,10);
});
const contactForm=$('.contact-form');
if(contactForm) {
  const params=new URLSearchParams(location.search);
  if(products.some(p=>p.id===params.get('product'))) contactForm.elements.product.value=params.get('product');
  if(['내추럴 오크','웜 베이지'].includes(params.get('finish'))) contactForm.elements.message.value=`선택 마감: ${params.get('finish')}\n`;
  contactForm.addEventListener('submit',event=> {
    event.preventDefault();
    if(!contactForm.reportValidity())return;
    const selected=products.find(p=>p.id===contactForm.elements.product.value);
    const status=$('.form-status');
    status.hidden=false;
    status.innerHTML=`<h2>작성하신 내용을 확인했습니다.</h2><p>상담 유형: ${escape(contactForm.elements.topic.value)}<br>관심 제품: ${selected?selected.name:'미선택'}<br>공간 유형: ${escape(contactForm.elements.space.value)}${contactForm.elements.date.value?`<br>희망 날짜: ${escape(contactForm.elements.date.value)}`:''}</p><p>시연이 완료되었습니다. 실제 신청이나 외부 전송은 이루어지지 않았습니다.</p>`;
    status.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  });
}
if(slides.length) {
  document.documentElement.classList.add('home-scroll');
  const observer=new IntersectionObserver(entries=> {
    entries.forEach(entry=> {
      if(!entry.isIntersecting)return;
      const id=entry.target.id;
      $$('.section-dots a').forEach(a=> {
        const active=a.hash===`#${id}`;
        a.classList.toggle('active',active);
        if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');
      });
      const dark=['showroom','brand'].includes(id);
      $('.header').classList.toggle('on-dark',dark);
      $('.section-dots').classList.toggle('light',dark);
    });
  },{threshold:.5});
  $$('.scene').forEach(section=>observer.observe(section));
}
