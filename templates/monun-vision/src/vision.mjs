const newsButtons = [...document.querySelectorAll('[data-news-filter]')];
if (newsButtons.length) {
  const articles = [...document.querySelectorAll('[data-news-type]')];
  for (const button of newsButtons) {
    button.addEventListener('click', () => {
      const type = button.dataset.newsFilter;
      let visible = 0;
      for (const article of articles) {
        article.hidden = type !== '전체' && article.dataset.newsType !== type;
        if (!article.hidden) visible++;
      }
      for (const option of newsButtons) option.setAttribute('aria-pressed', String(option === button));
      document.querySelector('#news-status').textContent = `${type} 기사 ${visible}개`;
    });
  }
}

const reel = document.querySelector('[data-reel]');
if (reel) {
  const track = reel.querySelector('.product-reel');
  const buttons = [...reel.querySelectorAll('[data-reel-step]')];
  const [previous, next] = buttons;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  function sync() {
    previous.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
  }

  for (const button of buttons) {
    button.addEventListener('click', () => {
      const first = track.children[0];
      const second = track.children[1];
      const distance = second.offsetLeft - first.offsetLeft;
      track.scrollBy({left: distance * Number(button.dataset.reelStep), behavior: reduced.matches ? 'instant' : 'smooth'});
    });
  }
  track.addEventListener('scroll', sync, {passive: true});
  new ResizeObserver(sync).observe(track);
  sync();
}

const quick = document.querySelector('.vision-quick');
if (quick) {
  const summary = quick.querySelector('summary');
  document.addEventListener('click', event => {
    if (quick.open && !quick.contains(event.target)) quick.open = false;
  });
  quick.addEventListener('keydown', event => {
    if (event.key === 'Escape' && quick.open) {
      quick.open = false;
      summary.focus();
    }
  });
}
