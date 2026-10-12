const filters = [...document.querySelectorAll('.filter')];
const cards = [...document.querySelectorAll('.stay-card')];
const sections = [...document.querySelectorAll('.discovery-section')];
const searchForm = document.querySelector('.search-form');
const summary = document.querySelector('.filter-summary');
const feedback = document.querySelector('.search-feedback');
const dialog = document.querySelector('.content-dialog');
const dialogTitle = document.querySelector('#dialog-title');
const dialogBody = document.querySelector('.dialog-body');
const state = { category: 'all', location: '', guests: 0, savedOnly: false };
const storageKey = 'harutgyeol:saved-stays';
let saved = new Set();
try {
  const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
  if (Array.isArray(stored)) saved = new Set(stored.filter((id) => cards.some((card) => card.dataset.id === id)));
} catch { /* Browsers that disable storage can still use favorites during this visit. */ }

const escapeHTML = (text) => String(text).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
let toastTimeout;
function toast(message) {
  const element = document.querySelector('.toast');
  clearTimeout(toastTimeout);
  element.textContent = message;
  element.hidden = false;
  toastTimeout = setTimeout(() => { element.hidden = true; }, 3200);
}

function updateSaved() {
  cards.forEach((card) => {
    const button = card.querySelector('.favorite');
    const active = saved.has(card.dataset.id);
    button.setAttribute('aria-pressed', String(active));
    button.setAttribute('aria-label', `${card.querySelector('h3').textContent} ${active ? '찜 해제' : '찜하기'}`);
  });
  const count = document.querySelector('.saved-count');
  count.textContent = saved.size;
  count.hidden = saved.size === 0;
  try { localStorage.setItem(storageKey, JSON.stringify([...saved])); } catch { /* Keep the in-memory selection. */ }
}

function applyFilters() {
  filters.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.filter === state.category)));
  let total = 0;
  cards.forEach((card) => {
    const matches = (state.category === 'all' || card.dataset.category.split(' ').includes(state.category))
      && (!state.location || card.dataset.location.includes(state.location))
      && Number(card.dataset.capacity) >= state.guests
      && (!state.savedOnly || saved.has(card.dataset.id));
    card.hidden = !matches;
    if (matches) total++;
  });
  sections.forEach((section) => {
    const hasCards = [...section.querySelectorAll('.stay-card')].some((card) => !card.hidden);
    // Keep the first shelf visible so an empty search has a clear result and recovery path.
    section.hidden = !hasCards && section.id !== 'rooms';
    section.querySelector('.empty').hidden = hasCards;
  });
  summary.hidden = state.category === 'all' && !state.location && !state.guests && !state.savedOnly;
  const labels = [];
  if (state.savedOnly) labels.push('찜한 숙소');
  if (state.location) labels.push(searchForm.elements.location.selectedOptions[0].textContent);
  if (state.category !== 'all') labels.push(filters.find((button) => button.dataset.filter === state.category).textContent);
  if (state.guests) labels.push(`${state.guests}명`);
  summary.querySelector('p').textContent = `${labels.join(' · ')} — ${total}개의 스테이`;
  return total;
}

filters.forEach((button) => button.addEventListener('click', () => {
  state.category = button.dataset.filter;
  applyFilters();
}));
document.querySelectorAll('[data-show-category]').forEach((link) => link.addEventListener('click', () => {
  state.category = link.dataset.showCategory;
  applyFilters();
}));
document.querySelector('.reset-button').addEventListener('click', () => {
  Object.assign(state, { category: 'all', location: '', guests: 0, savedOnly: false });
  searchForm.reset();
  searchForm.elements.checkout.min = searchForm.elements.checkin.min;
  searchForm.elements.checkout.setCustomValidity('');
  feedback.hidden = true;
  applyFilters();
});

const localDate = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
searchForm.elements.checkin.min = localDate(new Date());
searchForm.elements.checkout.min = localDate(new Date());
function validateDates() {
  const checkin = searchForm.elements.checkin;
  const checkout = searchForm.elements.checkout;
  checkout.setCustomValidity('');
  if (checkin.value) {
    const nextDay = new Date(`${checkin.value}T12:00:00`);
    nextDay.setDate(nextDay.getDate() + 1);
    checkout.min = localDate(nextDay);
  } else {
    checkout.min = checkin.min;
  }
  if ((checkin.value && !checkout.value) || (!checkin.value && checkout.value)) {
    checkout.setCustomValidity('체크인과 체크아웃 날짜를 모두 선택해주세요.');
  } else if (checkin.value && checkout.value <= checkin.value) {
    checkout.setCustomValidity('체크아웃은 체크인 다음 날 이후로 선택해주세요.');
  }
}
searchForm.elements.checkin.addEventListener('input', validateDates);
searchForm.elements.checkout.addEventListener('input', validateDates);
searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  validateDates();
  if (!searchForm.reportValidity()) return;
  state.location = searchForm.elements.location.value;
  state.guests = Number(searchForm.elements.guests.value);
  const total = applyFilters();
  const checkin = searchForm.elements.checkin.value;
  const checkout = searchForm.elements.checkout.value;
  feedback.textContent = `${checkin ? `${checkin} — ${checkout} · ` : ''}${state.guests}명 기준 ${total}개의 스테이. 날짜별 예약 가능 여부는 숙소에 문의해주세요.`;
  feedback.hidden = false;
  summary.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

cards.forEach((card) => {
  card.querySelector('.favorite').addEventListener('click', () => {
    const id = card.dataset.id;
    if (saved.has(id)) saved.delete(id); else saved.add(id);
    updateSaved();
    if (state.savedOnly) applyFilters();
    toast(saved.has(id) ? '마음에 드는 스테이를 보관했어요.' : '보관한 스테이를 해제했어요.');
  });
  card.querySelector('.detail-button').addEventListener('click', () => {
    const name = card.querySelector('h3').textContent;
    const image = card.querySelector('img');
    openDialog(name, `<img src="${escapeHTML(image.getAttribute('src'))}" alt="${escapeHTML(image.alt)}"><p>${escapeHTML(card.querySelector('.stay-info > p').textContent)}</p><p><strong>${escapeHTML(card.querySelector('.price').textContent)}</strong> / 1박 기준</p><p>체크인 16:00 · 체크아웃 11:00<br>세부 이용 안내와 날짜별 요금은 예약 문의로 확인해주세요.</p><p>이 숙소와 요금은 템플릿의 예시 콘텐츠입니다. 실제 예약이나 결제는 진행되지 않습니다.</p><a class="button" href="mailto:hello@example.com?subject=${encodeURIComponent(`${name} 예약 문의`)}">예약 문의하기</a>`);
  });
});

let dialogTrigger;
function openDialog(title, content) {
  dialogTrigger = document.activeElement;
  dialogTitle.textContent = title;
  dialogBody.innerHTML = content;
  dialog.showModal();
}
document.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});
dialog.addEventListener('close', () => dialogTrigger?.focus());

function showSaved() {
  const selected = cards.filter((card) => saved.has(card.dataset.id));
  const content = selected.length ? `<ul class="saved-list">${selected.map((card) => `<li><img src="${escapeHTML(card.querySelector('img').getAttribute('src'))}" alt=""><div><strong>${escapeHTML(card.querySelector('h3').textContent)}</strong><br><small>${escapeHTML(card.dataset.location)}</small></div><button type="button" data-remove-saved="${escapeHTML(card.dataset.id)}" aria-label="${escapeHTML(card.querySelector('h3').textContent)} 찜 해제">해제</button></li>`).join('')}</ul><button class="button" type="button" data-view-saved>보관한 스테이 모아보기</button>` : '<p>아직 보관한 스테이가 없습니다.<br>숙소 사진 위 하트 버튼으로 마음에 드는 공간을 담아보세요.</p>';
  openDialog(`보관한 스테이 ${selected.length}`, content);
}
document.querySelector('.saved-button').addEventListener('click', showSaved);
dialogBody.addEventListener('click', (event) => {
  const remove = event.target.closest('[data-remove-saved]');
  if (remove) {
    saved.delete(remove.dataset.removeSaved);
    updateSaved();
    if (state.savedOnly) applyFilters();
    // Preserve the original trigger while re-rendering the open dialog.
    const trigger = dialogTrigger;
    dialog.close();
    showSaved();
    dialogTrigger = trigger;
  }
  if (event.target.closest('[data-view-saved]')) {
    Object.assign(state, { category: 'all', location: '', guests: 0, savedOnly: true });
    searchForm.reset();
    feedback.hidden = true;
    applyFilters();
    dialog.close();
    summary.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});
document.querySelector('.contact-button').addEventListener('click', () => openDialog('예약 문의', '<p>머물고 싶은 숙소명, 날짜와 인원을 메일로 알려주세요.</p><p>이 페이지는 숙소 큐레이션 예시입니다. 문의 버튼은 이메일 작성 화면을 엽니다.</p><a class="button" href="mailto:hello@example.com">hello@example.com</a>'));

document.querySelectorAll('.journal-button').forEach((button) => button.addEventListener('click', () => {
  const article = button.closest('.journal-card');
  openDialog(button.textContent, `<img src="${escapeHTML(article.querySelector('img').getAttribute('src'))}" alt=""><p>${escapeHTML(article.querySelector('.eyebrow').textContent)}</p><p>${escapeHTML(article.querySelector('.journal-excerpt').textContent)}</p><p>${escapeHTML(article.querySelector('.journal-meta').textContent)}</p>`);
}));

const rankGrid = document.querySelector('#popular .stay-grid');
const rankCards = [...rankGrid.children];
const orders = [[0, 1, 2], [1, 2, 0], [2, 0, 1]];
document.querySelectorAll('[data-period]').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('[data-period]').forEach((tab) => tab.setAttribute('aria-pressed', String(tab === button)));
  orders[Number(button.dataset.period)].forEach((index, rank) => {
    const card = rankCards[index];
    card.querySelector('.badge').textContent = String(rank + 1).padStart(2, '0');
    rankGrid.append(card);
  });
}));

const slides = [...document.querySelectorAll('.hero-slide')];
const slideInterval = 3000;
let slideIndex = 0;
let slideTimer;
let slidePaused = false;
const playbackButton = document.querySelector('.hero-playback');
function showSlide(index) {
  slideIndex = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => {
    slide.classList.toggle('is-active', i === slideIndex);
    slide.setAttribute('aria-hidden', String(i !== slideIndex));
  });
  document.querySelector('.hero-page').textContent = `${String(slideIndex + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
}
function restartSlideTimer() {
  clearInterval(slideTimer);
  if (!document.hidden && !slidePaused) {
    slideTimer = setInterval(() => showSlide(slideIndex + 1), slideInterval);
  }
}
document.querySelectorAll('[data-slide]').forEach((button) => button.addEventListener('click', () => {
  showSlide(slideIndex + Number(button.dataset.slide));
  restartSlideTimer();
}));
playbackButton.addEventListener('click', () => {
  slidePaused = !slidePaused;
  playbackButton.setAttribute('aria-pressed', String(slidePaused));
  playbackButton.setAttribute('aria-label', slidePaused ? '슬라이드 자동재생 시작' : '슬라이드 자동재생 일시정지');
  playbackButton.querySelector('svg').innerHTML = slidePaused
    ? '<path d="m9 5 11 7-11 7Z"/>'
    : '<path d="M9 5v14M15 5v14"/>';
  restartSlideTimer();
});
document.addEventListener('visibilitychange', restartSlideTimer);
window.addEventListener('pagehide', () => clearInterval(slideTimer));
window.addEventListener('pageshow', restartSlideTimer);
showSlide(0);
restartSlideTimer();

const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');
function closeMenu() { navigation.classList.remove('is-open'); menuToggle.setAttribute('aria-expanded', 'false'); menuToggle.setAttribute('aria-label', '메뉴 열기'); }
menuToggle.addEventListener('click', () => {
  const open = navigation.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
});
navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });

document.querySelector('.newsletter-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const status = document.querySelector('.newsletter-status');
  status.textContent = '구독 양식을 확인했어요. 예시 페이지에서는 이메일을 저장하거나 실제 레터를 발송하지 않습니다.';
  status.hidden = false;
  event.currentTarget.reset();
});
updateSaved();
