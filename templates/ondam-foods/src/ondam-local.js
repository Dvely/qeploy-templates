// Static routes and search work from both a local file and a web server.
(() => {
 const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const query = new URLSearchParams(location.search).get('keyword') || '';
 const field = document.querySelector('#ondam-query');
 if (field) {
  field.value = query;
  const normalized = query.trim().toLocaleLowerCase();
  const results = normalized ? ONDAM_CONTENT.filter(item => `${item.title} ${item.category} ${item.summary}`.toLocaleLowerCase().includes(normalized)) : ONDAM_CONTENT;
  document.querySelector('#ondam-result-count').textContent = normalized ? `‘${query}’ 검색 결과 ${results.length}건` : `전체 ${results.length}개의 제품과 이야기`;
  document.querySelector('#ondam-results').innerHTML = results.length ? `<div class="ondam-card-grid">${results.map(item => `<a class="ondam-card" href="ondam-${item.id}.html"><img src="${item.image}" alt="${escape(item.title)}"><div><span>${escape(item.category)}</span><h2>${escape(item.title)}</h2><p>${escape(item.summary)}</p><b>자세히 보기 ↗</b></div></a>`).join('')}</div>` : '<p class="ondam-empty">검색 결과가 없습니다. 제품명이나 재료 이름으로 다시 찾아보세요.</p>';
 }
 document.querySelectorAll('a[title]').forEach(a => { a.title = a.title.replace(/새창열림/g, '').trim(); });
 // The static header keeps the original desktop hover and mobile menu behavior.
 document.querySelectorAll('.header a[href]').forEach(a => {
  const path = location.pathname.split('/').pop() || 'index.html';
  if (a.getAttribute('href') === path && !a.closest('.sub_menu')) a.setAttribute('aria-current','page');
 });
 document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  const header = document.querySelector('.header');
  const menu = header?.querySelector('.btn_dropdown');
  if (menu?.classList.contains('active')) menu.click();
  if (document.querySelector('#pop_search')?.style.display !== 'none' && document.querySelector('#pop_search')) ui.common.popupFn.pcSearchClose('pop_search');
 });
 // Refresh slide geometry after local social cards have been filled.
 if (document.querySelector('.main_visual')) window.addEventListener('load', () => {
  document.querySelectorAll('.ottogi_sns .swiper-container').forEach(el => el.swiper?.update());
 });
})();
// Feed vector motion data directly so file:// previews need no JSON requests.
if (typeof ONDAM_MOTION !== 'undefined') {
 customElements.whenDefined('lottie-player').then(() => {
  document.querySelectorAll('lottie-player[data-motion]').forEach(player => player.load(ONDAM_MOTION[player.dataset.motion]));
 });
}
