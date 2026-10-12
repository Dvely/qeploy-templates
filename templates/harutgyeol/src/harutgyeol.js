// HARUTGYEOL: 모든 페이지에서 같은 콘텐츠·찜 목록·여행 일정을 공유합니다.
const content = window.HARUTGYEOL;
const stays = new Map(content.stays.map((stay) => [stay.id, stay]));
const pageType = document.body.dataset.page;
const query = new URLSearchParams(location.search);
const storageKey = 'harutgyeol:saved-stays';
const money = (value) => new Intl.NumberFormat('ko-KR').format(value);
const escapeHTML = (text) => String(text).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const localDate = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const stayURL = (id) => `harutgyeol-stay-${id}.html`;
let saved = new Set();
try {
  const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
  if (Array.isArray(stored)) saved = new Set(stored.filter((id) => stays.has(id)));
} catch { /* Favorites remain available for this visit when storage is unavailable. */ }
const filters = [...document.querySelectorAll('.filter')];
const filterCards = [...document.querySelectorAll(pageType === 'home' ? '.discovery-section .stay-card' : '.catalog-grid .stay-card')];
const searchForm = document.querySelector('.search-form, .catalog-search');
const summary = document.querySelector('.filter-summary');
const collection = content.collections.find((item) => item.id === document.body.dataset.collectionId);
const categories = ['all', 'spa', 'forest', 'architecture', 'pet', 'promotion', 'tea'];
const regions = { '충': '충청도', '제주': '제주', '강원': '강원도', '전': '전라도', '부산': '부산' };
const state = {
  category: categories.includes(query.get('theme')) ? query.get('theme') : 'all',
  region: Object.hasOwn(regions, query.get('region')) ? query.get('region') : '',
  guests: query.has('guests') ? Math.max(1, Math.min(6, Number(query.get('guests')) || 2)) : 0,
  savedOnly: pageType === 'saved',
  sort: ['recommended','price-low','price-high','capacity'].includes(query.get('sort')) ? query.get('sort') : 'recommended',
};
let toastTimeout;
function toast(message) {
  const element = document.querySelector('.toast');
  clearTimeout(toastTimeout);
  element.textContent = message;
  element.hidden = false;
  toastTimeout = setTimeout(() => { element.hidden = true; }, 3200);
}
function updateSaved() {
  document.querySelectorAll('[data-save-stay]').forEach((button) => {
    const stay = stays.get(button.dataset.saveStay);
    const active = saved.has(stay.id);
    button.setAttribute('aria-pressed', String(active));
    button.setAttribute('aria-label', `${stay.name} ${active ? '찜 해제' : '찜하기'}`);
  });
  document.querySelectorAll('.saved-count').forEach((count) => { count.textContent = saved.size; count.hidden = !saved.size; });
  try { localStorage.setItem(storageKey, JSON.stringify([...saved])); } catch { /* Keep the in-memory collection. */ }
}
document.querySelectorAll('[data-save-stay]').forEach((button) => button.addEventListener('click', () => {
  const id = button.dataset.saveStay;
  if (saved.has(id)) saved.delete(id); else saved.add(id);
  updateSaved();
  if (state.savedOnly) applyFilters();
  toast(saved.has(id) ? '마음에 드는 스테이를 보관했어요.' : '보관한 스테이를 해제했어요.');
}));
window.addEventListener('storage', (event) => {
  if (event.key !== storageKey && event.key !== null) return;
  try { const value = JSON.parse(event.newValue || '[]'); if (Array.isArray(value)) saved = new Set(value.filter((id) => stays.has(id))); } catch { return; }
  updateSaved();
  if (state.savedOnly) applyFilters();
});
updateSaved();

function tripParams(form = searchForm) {
  const params = new URLSearchParams();
  if (state.region) params.set('region', state.region);
  if (state.category !== 'all') params.set('theme', state.category);
  if (state.sort !== 'recommended') params.set('sort', state.sort);
  for (const key of ['checkin','checkout']) {
    const value = form?.elements[key] ? form.elements[key].value : query.get(key);
    if (/^\d{4}-\d{2}-\d{2}$/.test(value || '')) params.set(key,value);
  }
  const guests = form?.elements.guests?.value || state.guests || query.get('guests');
  if (guests && Number(guests) >= 1 && Number(guests) <= 6) params.set('guests',String(guests));
  return params;
}
function decorateStayLinks() {
  const reserveForm = document.querySelector('[data-stay-booking]');
  const params = tripParams(reserveForm || searchForm);
  document.querySelectorAll('[data-stay-link]').forEach((link) => { link.href = stayURL(link.dataset.stayLink) + (params.size ? '?' + params : ''); });
  document.querySelectorAll('[data-back-to-stays]').forEach((link) => { link.href = 'harutgyeol-stays.html' + (params.size ? '?' + params : ''); });
}
function applyFilters() {
  filters.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.filter === state.category)));
  let count = 0;
  filterCards.forEach((card) => {
    const stay = stays.get(card.dataset.id);
    const matches = (state.category === 'all' || stay.categories.includes(state.category))
      && (!state.region || stay.location.includes(state.region))
      && stay.capacity >= state.guests
      && (!state.savedOnly || saved.has(stay.id));
    card.hidden = !matches;
    if (matches) count++;
  });
  document.querySelectorAll('.discovery-section').forEach((section) => {
    const populated = [...section.querySelectorAll('.stay-card')].some((card) => !card.hidden);
    section.hidden = !populated && section.id !== 'rooms';
    section.querySelector('.empty').hidden = populated;
  });
  const labels = [state.savedOnly ? '찜한 숙소' : '', state.region ? regions[state.region] : '', state.category !== 'all' ? ({spa:'노천탕 & 자쿠지',forest:'숲속 독채',architecture:'건축가 컬렉션',pet:'반려견 동반',promotion:'얼리버드',tea:'다도와 명상'}[state.category]) : '', state.guests ? `${state.guests}명` : ''].filter(Boolean);
  if (summary) {
    summary.hidden = !labels.length || (pageType === 'saved' && labels.length === 1);
    summary.querySelector('p').textContent = `${labels.join(' · ')} — ${count}개의 스테이`;
  }
  document.querySelectorAll('[data-result-count]').forEach((node) => { node.textContent = `${collection ? collection.name + ' · ' : ''}${count}개의 스테이`; });
  document.querySelectorAll('.catalog-empty').forEach((empty) => {
    empty.hidden = count > 0;
    empty.querySelector('p').textContent = state.savedOnly ? '아직 보관한 스테이가 없어요. 마음에 드는 공간의 하트를 눌러보세요.' : '선택한 조건에 맞는 스테이가 없어요. 다른 조건으로 다시 살펴보세요.';
  });
  sortCards();
  decorateStayLinks();
}
function sortCards() {
  const grid = document.querySelector('.catalog-grid');
  if (!grid) return;
  const order = new Map(content.stays.map((stay,index) => [stay.id,index]));
  [...filterCards].sort((a,b) => {
    const first = stays.get(a.dataset.id), second = stays.get(b.dataset.id);
    if (state.sort === 'price-low') return first.price - second.price;
    if (state.sort === 'price-high') return second.price - first.price;
    if (state.sort === 'capacity') return second.capacity - first.capacity;
    return order.get(first.id) - order.get(second.id);
  }).forEach((card) => grid.append(card));
}
function updateCatalogURL() {
  if (pageType !== 'catalog') return;
  const params = tripParams();
  history.replaceState(null,'',location.pathname + (params.size ? '?' + params : ''));
}
filters.forEach((button) => button.addEventListener('click', () => { state.category = button.dataset.filter; applyFilters(); updateCatalogURL(); }));
document.querySelector('.reset-button')?.addEventListener('click', () => {
  Object.assign(state,{category:'all',region:'',guests:0,sort:'recommended'});
  if (searchForm) {
    searchForm.reset();
    for (const name of ['checkin','checkout']) searchForm.elements[name].value = '';
    searchForm.elements.checkout.setCustomValidity('');
    searchForm.elements.checkout.min = localDate(new Date());
  }
  if (sortSelect) sortSelect.value = 'recommended';
  applyFilters();
  updateCatalogURL();
});
const sortSelect = document.querySelector('[data-sort-stays]');
if (sortSelect) {
  sortSelect.value = state.sort;
  sortSelect.addEventListener('change', () => { state.sort = sortSelect.value; sortCards(); updateCatalogURL(); decorateStayLinks(); });
}

function nights(form) {
  const first = form.elements.checkin.value, last = form.elements.checkout.value;
  if (!first || !last || last <= first) return 0;
  return Math.round((Date.parse(last+'T00:00:00Z') - Date.parse(first+'T00:00:00Z')) / 86400000);
}
function validateDates(form) {
  const first = form.elements.checkin, last = form.elements.checkout;
  last.setCustomValidity('');
  const next = first.value ? new Date(first.value + 'T12:00:00') : new Date();
  if (first.value) next.setDate(next.getDate() + 1);
  last.min = localDate(next);
  if (!!first.value !== !!last.value) last.setCustomValidity('체크인과 체크아웃 날짜를 모두 선택해주세요.');
  else if (first.value && last.value <= first.value) last.setCustomValidity('체크아웃은 체크인 다음 날 이후로 선택해주세요.');
}
function initializeDates(form) {
  for (const name of ['checkin','checkout']) {
    const field = form.elements[name];
    field.min = localDate(new Date());
    if (/^\d{4}-\d{2}-\d{2}$/.test(query.get(name)||'')) field.value = query.get(name);
    field.addEventListener('input', () => { validateDates(form); updateEstimate(form); decorateStayLinks(); });
  }
  if (form.elements.guests && state.guests) form.elements.guests.value = String(Math.min(state.guests,Number(form.elements.guests.options[form.elements.guests.options.length-1].value)));
  validateDates(form);
}
const homeSearch = document.querySelector('.search-form');
if (homeSearch) {
  // The home and full catalog use the same date rules.
  homeSearch.dataset.dateRange = '';
}
document.querySelectorAll('[data-date-range]').forEach(initializeDates);
if (searchForm) {
  searchForm.elements.location.value = state.region;
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    validateDates(searchForm);
    if (!searchForm.reportValidity()) return;
    state.region = searchForm.elements.location.value;
    state.guests = Number(searchForm.elements.guests.value);
    if (pageType === 'home') { location.href = 'harutgyeol-stays.html?' + tripParams(searchForm); return; }
    applyFilters();
    updateCatalogURL();
    document.querySelector('[data-result-count]')?.scrollIntoView({behavior:'smooth',block:'center'});
  });
}
if (filterCards.length) applyFilters();
else decorateStayLinks();

function updateEstimate(form) {
  const id = form.dataset.stayId || form.elements.stay?.value;
  const stay = stays.get(id);
  const target = form.querySelector('[data-estimate]');
  if (!stay || !target) return;
  const count = nights(form);
  target.textContent = count > 0 ? `${count}박 예상 ₩${money(count * stay.price)} · 기준 ${stay.baseGuests}인 요금` : '날짜를 선택하면 예상 금액을 볼 수 있어요.';
}
document.querySelectorAll('[data-stay-booking]').forEach((form) => {
  updateEstimate(form);
  form.elements.guests.addEventListener('change', () => { updateEstimate(form); decorateStayLinks(); });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    validateDates(form);
    if (!form.reportValidity()) return;
    const params = tripParams(form);
    params.set('stay',form.dataset.stayId);
    location.href = 'harutgyeol-booking.html?' + params;
  });
});

const requestForm = document.querySelector('.booking-request-form');
if (requestForm) {
  const summary = document.querySelector('[data-booking-summary]');
  const emptyBookingSummary = summary.innerHTML;
  if (stays.has(query.get('stay'))) requestForm.elements.stay.value = query.get('stay');
  function renderBookingSummary() {
    const stay = stays.get(requestForm.elements.stay.value);
    if (!stay) { summary.innerHTML = emptyBookingSummary; return; }
    const guests = requestForm.elements.guests;
    const chosen = Number(guests.value) || stay.baseGuests;
    guests.innerHTML = Array.from({length:stay.capacity},(_,index) => `<option value="${index+1}">${index+1}명</option>`).join('');
    guests.value = String(Math.min(chosen,stay.capacity));
    const count = nights(requestForm);
    const detailURL = stayURL(stay.id) + '?' + tripParams(requestForm);
    summary.innerHTML = `<a href="${detailURL}"><img src="${stay.image}" alt="${escapeHTML(stay.alt)}"></a><p class="eyebrow">YOUR STAY · ${escapeHTML(stay.location)}</p><h2><a href="${detailURL}">${escapeHTML(stay.name)}</a></h2><p>${escapeHTML(stay.tagline)}</p><dl><div><dt>일정</dt><dd>${count ? `${requestForm.elements.checkin.value} — ${requestForm.elements.checkout.value} · ${count}박` : '날짜를 선택해주세요'}</dd></div><div><dt>인원</dt><dd>${guests.value}명 · 최대 ${stay.capacity}명</dd></div><div><dt>1박 기준</dt><dd>₩${money(stay.price)}</dd></div><div><dt>예상 금액</dt><dd>${count ? '₩'+money(count * stay.price) : '—'}</dd></div></dl><p class="booking-note">기준 ${stay.baseGuests}인 예시 요금입니다. 추가 인원·시설 요금과 날짜별 예약 가능 여부는 숙소에 문의해주세요.</p><a class="text-link" href="${detailURL}">숙소 상세 다시 보기 →</a>`;
  }
  requestForm.addEventListener('input',renderBookingSummary);
  requestForm.elements.stay.addEventListener('change',renderBookingSummary);
  renderBookingSummary();
  requestForm.addEventListener('submit', (event) => {
    event.preventDefault();
    validateDates(requestForm);
    if (!requestForm.reportValidity()) return;
    const stay = stays.get(requestForm.elements.stay.value);
    const count = nights(requestForm);
    const confirmation = document.querySelector('.booking-confirmation');
    document.querySelector('[data-confirmation-summary]').innerHTML = `<img src="${stay.image}" alt="${escapeHTML(stay.alt)}"><div><h3>${escapeHTML(stay.name)}</h3><p>${escapeHTML(stay.location)}</p><p>${requestForm.elements.checkin.value} — ${requestForm.elements.checkout.value} · ${count}박 · ${requestForm.elements.guests.value}명</p><strong>예상 금액 ₩${money(stay.price * count)}</strong></div>`;
    document.querySelector('[data-confirmation-stay]').href = stayURL(stay.id) + '?' + tripParams(requestForm);
    document.querySelector('.booking-layout').hidden = true;
    confirmation.hidden = false;
    confirmation.focus();
    confirmation.scrollIntoView({behavior:'smooth',block:'start'});
  });
  document.querySelector('[data-edit-booking]').addEventListener('click', () => {
    document.querySelector('.booking-confirmation').hidden = true;
    document.querySelector('.booking-layout').hidden = false;
    requestForm.elements.stay.focus();
  });
}

const dialog = document.querySelector('.content-dialog');
let dialogTrigger;
function openDialog(title,html,photo = false) {
  dialogTrigger = document.activeElement;
  dialog.classList.toggle('photo-dialog',photo);
  dialog.querySelector('#dialog-title').textContent = title;
  dialog.querySelector('.dialog-body').innerHTML = html;
  dialog.showModal();
}
dialog.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => dialogTrigger?.focus());
dialog.addEventListener('click', (event) => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});
document.querySelectorAll('[data-open-photo]').forEach((button) => button.addEventListener('click', () => openDialog('공간의 기록', `<img src="${escapeHTML(button.dataset.openPhoto)}" alt="${escapeHTML(button.dataset.photoAlt)}">`,true)));
document.querySelectorAll('[data-copy-link]').forEach((button) => button.addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(location.href); toast('페이지 링크를 복사했어요.'); }
  catch { openDialog('링크 공유',`<p>아래 주소를 복사해 공유할 수 있어요.</p><input class="share-address" aria-label="공유할 페이지 주소" value="${escapeHTML(location.href)}" readonly>`); }
}));

const rankGrid = document.querySelector('#popular .stay-grid');
if (rankGrid) {
  const rankCards = [...rankGrid.children];
  const orders = [[0,1,2],[1,2,0],[2,0,1]];
  document.querySelectorAll('[data-period]').forEach((button) => button.addEventListener('click', () => {
    document.querySelectorAll('[data-period]').forEach((tab) => tab.setAttribute('aria-pressed',String(tab===button)));
    orders[Number(button.dataset.period)].forEach((index,rank) => { const card=rankCards[index]; card.querySelector('.badge').textContent=String(rank+1).padStart(2,'0'); rankGrid.append(card); });
  }));
}
const slides = [...document.querySelectorAll('.hero-slide')];
if (slides.length) {
  let slideIndex=0, timer, paused=false;
  const playback = document.querySelector('.hero-playback');
  function showSlide(index) {
    slideIndex=(index+slides.length)%slides.length;
    slides.forEach((slide,i) => { slide.classList.toggle('is-active',i===slideIndex); slide.setAttribute('aria-hidden',String(i!==slideIndex)); });
    document.querySelector('.hero-page').textContent=`${String(slideIndex+1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;
  }
  function restart() { clearInterval(timer); if (!paused && !document.hidden) timer=setInterval(() => showSlide(slideIndex+1),3000); }
  document.querySelectorAll('[data-slide]').forEach((button) => button.addEventListener('click', () => { showSlide(slideIndex+Number(button.dataset.slide)); restart(); }));
  playback.addEventListener('click', () => { paused=!paused; playback.setAttribute('aria-pressed',String(paused)); playback.setAttribute('aria-label',paused?'슬라이드 자동재생 시작':'슬라이드 자동재생 일시정지'); playback.querySelector('svg').innerHTML=paused?'<path d="m9 5 11 7-11 7Z"/>':'<path d="M9 5v14M15 5v14"/>'; restart(); });
  document.addEventListener('visibilitychange',restart); window.addEventListener('pagehide',() => clearInterval(timer)); window.addEventListener('pageshow',restart); showSlide(0); restart();
}
const menuToggle=document.querySelector('.menu-toggle');
const navigation=document.querySelector('.site-nav');
function closeMenu() { navigation.classList.remove('is-open'); menuToggle.setAttribute('aria-expanded','false'); menuToggle.setAttribute('aria-label','메뉴 열기'); }
menuToggle.addEventListener('click', () => { const open=navigation.classList.toggle('is-open'); menuToggle.setAttribute('aria-expanded',String(open)); menuToggle.setAttribute('aria-label',open?'메뉴 닫기':'메뉴 열기'); });
navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click',closeMenu));
document.addEventListener('keydown', (event) => { if (event.key==='Escape') closeMenu(); });
document.querySelector('.newsletter-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const status=document.querySelector('.newsletter-status');
  status.textContent='구독 양식을 확인했어요. 예시 페이지에서는 이메일을 저장하거나 실제 레터를 발송하지 않습니다.'; status.hidden=false; event.currentTarget.reset();
});
