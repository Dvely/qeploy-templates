// LUMIÈRE(루미에르) 메디컬 뷰티 템플릿. 상담 양식은 로컬 예시이며 정보를 전송하지 않습니다.
const treatments = {
  lifting: { title: '올리지오X 600샷 & 티타늄 리프팅 60KJ', price: '890,000', original: '1,400,000', description: '나의 피부 고민과 상태를 충분히 살펴보고, 복합 리프팅 프로그램의 구성을 상담에서 안내합니다.', image: 'images/lifting-care.jpg', steps: ['올리지오X 600샷 구성 안내', '티타늄 리프팅 60KJ 구성 안내'] },
  skin: { title: '포텐자 레이저 & 스킨 케어 패키지', price: '390,000', original: '650,000', description: '현재의 피부 컨디션과 일상에서의 고민을 먼저 살피는 스킨 케어 프로그램입니다.', image: 'images/skin-care.jpg', steps: ['포텐자 프로그램 구성 안내', '개인별 스킨 케어 상담'] },
  contour: { title: '인모드 FX + FORMA 풀페이스 케어', price: '249,000', original: '490,000', description: '얼굴의 균형과 각자의 고민을 살펴보는 맞춤형 윤곽 케어 프로그램입니다.', image: 'images/contour-care.jpg', steps: ['인모드 FX 구성 안내', 'FORMA 프로그램 구성 안내'] },
};
const escapeHTML = (text) => String(text).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const storageKey = 'lumiere:saved-treatments';
let saved = new Set();
try {
  const value = JSON.parse(localStorage.getItem(storageKey) || '[]');
  if (Array.isArray(value)) saved = new Set(value.filter((id) => Object.hasOwn(treatments, id)));
} catch { /* The collection remains usable when browser storage is disabled. */ }
const requestedCare = new URLSearchParams(location.search).get('care');
const careId = Object.hasOwn(treatments, requestedCare) ? requestedCare : 'lifting';
const currentTreatment = treatments[careId];
const title = document.querySelector('#treatment-title');
if (title) {
  title.textContent = currentTreatment.title;
  document.title = `${currentTreatment.title} · LUMIÈRE 루미에르`;
  document.querySelector('#treatment-price').textContent = `₩${currentTreatment.price}`;
  document.querySelector('#treatment-original-price').textContent = `구성 예시 ₩${currentTreatment.original}`;
  document.querySelector('#treatment-description').textContent = currentTreatment.description;
  document.querySelectorAll('[data-program-heading]').forEach((heading, index) => { heading.textContent = currentTreatment.steps[index]; });
  const dossier = document.querySelector('#treatment-dossier');
  // Each package presents its own content; no unrelated discount or installment claims are carried over.
  const priceBlock = document.querySelector('#treatment-price').closest('.border-t');
  priceBlock.innerHTML = `<div class="detail-price"><del id="treatment-original-price">구성 예시 ₩${currentTreatment.original}</del><div><strong id="treatment-price">₩${currentTreatment.price}</strong><span>VAT 포함 · 예시 요금</span></div><p>포함 항목과 최종 비용은 상담에서 확인해주세요.</p></div>`;
  const inclusions = dossier.querySelector('.pt-4.space-y-2\\.5');
  if (inclusions) inclusions.innerHTML = `<div class="text-[11px] tracking-wider text-on-surface uppercase font-medium">포함 항목 안내</div>${[...currentTreatment.steps, '개인별 피부 상태 확인', '진행 과정과 사후 안내'].map((text) => `<p>• ${escapeHTML(text)}</p>`).join('')}`;
  dossier.querySelector('[data-booking]').dataset.booking = currentTreatment.title;
  const breadcrumb = document.querySelector('nav[aria-label="Breadcrumb"] > span:last-child');
  if (breadcrumb) breadcrumb.textContent = currentTreatment.title;
}

let toastTimeout;
function toast(message) {
  const node = document.querySelector('.toast');
  clearTimeout(toastTimeout);
  node.textContent = message;
  node.hidden = false;
  toastTimeout = setTimeout(() => { node.hidden = true; }, 3200);
}
function updateSaved() {
  document.querySelectorAll('[data-save-treatment]').forEach((button) => {
    const active = saved.has(careId);
    button.setAttribute('aria-pressed', String(active));
    const text = button.querySelector('#wishlist-text');
    if (text) text.textContent = active ? '보관함에 저장됨' : '관심 시술 보관';
  });
  try { localStorage.setItem(storageKey, JSON.stringify([...saved])); } catch { /* Keep the current selection in memory. */ }
}
document.querySelectorAll('[data-save-treatment]').forEach((button) => button.addEventListener('click', () => {
  if (saved.has(careId)) saved.delete(careId); else saved.add(careId);
  updateSaved();
  toast(saved.has(careId) ? '관심 시술을 보관했습니다.' : '보관한 시술을 해제했습니다.');
}));
updateSaved();

const dialogs = [...document.querySelectorAll('dialog')];
let dialogTrigger;
function openDialog(dialog) {
  dialogTrigger = document.activeElement;
  dialogs.forEach((other) => { if (other.open) other.close(); });
  dialog.showModal();
}
dialogs.forEach((dialog) => {
  dialog.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => dialogTrigger?.focus());
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
});
const bookingDialog = document.querySelector('#booking-dialog');
const bookingForm = document.querySelector('#booking-form');
const bookingResult = document.querySelector('#booking-result');
const today = new Date();
bookingForm.elements.date.min = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
document.querySelectorAll('[data-booking]').forEach((trigger) => trigger.addEventListener('click', (event) => {
  event.preventDefault();
  bookingForm.hidden = false;
  bookingResult.hidden = true;
  bookingForm.reset();
  const topic = trigger.dataset.booking;
  const index = topic.includes('포텐자') ? 1 : topic.includes('인모드') ? 2 : topic.includes('의료진') ? 3 : 0;
  bookingForm.elements.topic.selectedIndex = index;
  openDialog(bookingDialog);
}));
bookingForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!bookingForm.reportValidity()) return;
  bookingResult.textContent = '상담 요청 양식을 확인했습니다. 예시 페이지이므로 실제 예약은 접수되지 않으며, 입력한 정보는 저장하거나 전송하지 않습니다.';
  bookingResult.hidden = false;
  bookingForm.hidden = true;
  bookingForm.reset();
});

const infoDialog = document.querySelector('#info-dialog');
const infoTitle = document.querySelector('#info-title');
const infoContent = document.querySelector('#info-content');
function showInfo(title, html) {
  infoTitle.textContent = title;
  infoContent.innerHTML = html;
  openDialog(infoDialog);
}
document.querySelectorAll('[data-info]').forEach((button) => button.addEventListener('click', (event) => {
  event.preventDefault();
  showInfo(button.dataset.info, '<p>루미에르는 가상의 메디컬 뷰티 큐레이션 템플릿입니다. 실제 의료기관의 안내와 예약 기능을 연결하려면 해당 내용을 교체해주세요.</p><p>문의 예시: hello@example.com</p>');
}));
function savedContent() {
  if (!saved.size) return '<p>아직 보관한 시술이 없습니다. 시술 상세 화면에서 관심 시술을 담아보세요.</p><a class="primary-button" href="index.html#packages">시술 살펴보기</a>';
  return `<ul class="saved-list">${[...saved].map((id) => `<li><img src="${treatments[id].image}" alt=""><div><a href="lumiere-treatment.html?care=${id}">${escapeHTML(treatments[id].title)}</a><small>₩${treatments[id].price} · 예시 요금</small></div><button type="button" data-remove-saved="${id}" aria-label="${escapeHTML(treatments[id].title)} 보관 해제">해제</button></li>`).join('')}</ul>`;
}
document.querySelectorAll('[data-show-saved]').forEach((trigger) => trigger.addEventListener('click', (event) => {
  event.preventDefault();
  showInfo('보관한 시술', savedContent());
}));
infoContent.addEventListener('click', (event) => {
  const remove = event.target.closest('[data-remove-saved]');
  if (!remove) return;
  saved.delete(remove.dataset.removeSaved);
  updateSaved();
  infoContent.innerHTML = savedContent();
});

const menu = document.querySelector('.main-navigation');
const menuButton = document.querySelector('.menu-toggle');
function closeMenu() { menu.classList.remove('is-open'); menuButton.setAttribute('aria-expanded', 'false'); }
menuButton.addEventListener('click', () => {
  const open = menu.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(open));
});
menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    const search = document.querySelector('#heroSearchInput');
    if (search) { event.preventDefault(); search.focus(); search.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
  }
});
document.querySelectorAll('[data-open-search]').forEach((button) => button.addEventListener('click', () => {
  const search = document.querySelector('#heroSearchInput');
  search.scrollIntoView({ behavior: 'smooth', block: 'center' });
  search.focus({ preventScroll: true });
}));

const cards = [...document.querySelectorAll('.treatment-card')];
const tagContainer = document.querySelector('#filterTagContainer');
const tagData = {
  concern: [['all', '전체 보기'], ['lifting', '#탄력 리프팅'], ['skin', '#모공·피부 결'], ['contour', '#윤곽 턱선'], ['booster', '#스킨 케어']],
  treatment: [['all', '전체 보기'], ['lifting', '#올리지오X'], ['skin', '#포텐자'], ['contour', '#인모드'], ['booster', '#스킨 케어']],
  area: [['all', '전체 보기'], ['강남', '#강남'], ['압구정', '#압구정'], ['신사', '#신사']],
};
const searchState = { category: 'all', area: '', query: '' };
let currentGroup = 'concern';
function applySearch() {
  let shown = 0;
  cards.forEach((card) => {
    const haystack = `${card.textContent} ${card.dataset.area}`.toLocaleLowerCase().replace(/\s/g, '');
    const match = (searchState.category === 'all' || card.dataset.category.split(' ').includes(searchState.category))
      && (!searchState.area || card.dataset.area === searchState.area)
      && (!searchState.query || haystack.includes(searchState.query.toLocaleLowerCase().replace(/\s/g, '')));
    card.hidden = !match;
    if (match) shown++;
  });
  document.querySelectorAll('[data-filter]').forEach((button) => button.setAttribute('aria-pressed', String(currentGroup === 'area' && button.closest('#filterTagContainer') ? button.dataset.filter === (searchState.area || 'all') : button.dataset.filter === searchState.category)));
  document.querySelector('.empty-results').hidden = shown > 0;
  const bar = document.querySelector('.results-bar');
  bar.hidden = searchState.category === 'all' && !searchState.area && !searchState.query;
  document.querySelector('#search-status').textContent = `${searchState.query || searchState.area || '선택한 주제'} · ${shown}개의 프로그램`;
}
function renderTags() {
  tagContainer.innerHTML = tagData[currentGroup].map(([key, label]) => `<button class="filter-chip" type="button" data-filter="${key}" aria-pressed="false">${label}</button>`).join('');
  document.querySelectorAll('[data-filter-group]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.filterGroup === currentGroup)));
  applySearch();
}
if (cards.length) {
  renderTags();
  document.addEventListener('click', (event) => {
    const group = event.target.closest('[data-filter-group]');
    if (group) { currentGroup = group.dataset.filterGroup; renderTags(); }
    const filter = event.target.closest('[data-filter]');
    if (filter) {
      if (currentGroup === 'area' && filter.closest('#filterTagContainer')) searchState.area = filter.dataset.filter === 'all' ? '' : filter.dataset.filter;
      else searchState.category = filter.dataset.filter;
      applySearch();
    }
  });
  document.querySelector('#lumiere-search').addEventListener('submit', (event) => {
    event.preventDefault();
    searchState.query = document.querySelector('#heroSearchInput').value.trim();
    applySearch();
    document.querySelector('#packages').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  document.querySelector('[data-reset]').addEventListener('click', () => {
    Object.assign(searchState, { category: 'all', area: '', query: '' });
    document.querySelector('#heroSearchInput').value = '';
    applySearch();
  });
  document.querySelectorAll('[data-sort]').forEach((button) => button.addEventListener('click', () => {
    document.querySelectorAll('[data-sort]').forEach((other) => other.setAttribute('aria-pressed', String(other === button)));
    const sorted = [...cards].sort((a, b) => button.dataset.sort === 'rating' ? Number(b.dataset.rating) - Number(a.dataset.rating) : button.dataset.sort === 'bookings' ? Number(b.dataset.bookings) - Number(a.dataset.bookings) : Number(a.dataset.order) - Number(b.dataset.order));
    sorted.forEach((card) => card.parentNode.append(card));
  }));
}

document.querySelectorAll('[data-read-insight]').forEach((button) => button.addEventListener('click', () => {
  const article = button.closest('article');
  showInfo(button.textContent, `<img class="insight-image" src="${article.querySelector('img').getAttribute('src')}" alt=""><p>${escapeHTML(article.querySelector('h3 + p').textContent)}</p><p>이 글은 매거진 레이아웃 예시입니다. 자세한 시술 정보와 개인별 적합성은 의료진과의 상담에서 확인해주세요.</p>`);
}));
const galleryImage = document.querySelector('#gallery-image');
if (galleryImage) {
  const original = { src: galleryImage.getAttribute('src'), alt: galleryImage.alt };
  const buttons = [...document.querySelectorAll('[data-gallery]')];
  buttons.forEach((button, index) => button.addEventListener('click', () => {
    document.querySelector('#gallery-counter').textContent = `${String(index + 2).padStart(2, '0')} / 04`;
    galleryImage.src = button.querySelector('img').getAttribute('src');
    galleryImage.alt = button.querySelector('img').alt;
    buttons.forEach((other) => other.setAttribute('aria-pressed', String(other === button)));
  }));
  document.querySelector('[data-gallery-reset]').addEventListener('click', () => {
    document.querySelector('#gallery-counter').textContent = '01 / 04';
    galleryImage.src = original.src;
    galleryImage.alt = original.alt;
    buttons.forEach((button) => button.setAttribute('aria-pressed', 'false'));
  });
}
