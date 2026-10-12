// 홈과 상세 페이지가 함께 사용하는 반응형 메뉴.
(() => {
  const header = document.querySelector('.pages-header');
  const menu = header?.querySelector('.mobile-menu');
  const nav = header?.querySelector('#pages-navigation');
  if (!header || !menu || !nav) return;

  function setOpen(open) {
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    nav.classList.toggle('is-open', open);
  }

  function updateHeight() {
    document.documentElement.style.setProperty('--pages-header-height', `${header.getBoundingClientRect().height}px`);
  }

  updateHeight();
  new ResizeObserver(updateHeight).observe(header);
  menu.addEventListener('click', () => setOpen(menu.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      menu.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!header.contains(event.target)) setOpen(false);
  });
  nav.addEventListener('click', event => {
    if (event.target.closest('a')) setOpen(false);
  });
  window.matchMedia('(min-width: 1024px)').addEventListener('change', () => setOpen(false));
})();
