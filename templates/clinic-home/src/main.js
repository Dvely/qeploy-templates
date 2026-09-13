// 진료 분류 필터. data-category 만 맞추면 이 파일은 고치지 않아도 된다.
const filters = document.querySelectorAll('.filter');
const cards = document.querySelectorAll('.card');
const empty = document.querySelector('.empty');

filters.forEach((button) => {
  button.addEventListener('click', () => {
    filters.forEach((other) => other.setAttribute('aria-pressed', String(other === button)));
    const category = button.dataset.filter ?? 'all';
    let shown = 0;
    cards.forEach((card) => {
      const match = category === 'all' || card.dataset.category === category;
      card.hidden = !match;
      if (match) shown += 1;
    });
    if (empty) empty.hidden = shown > 0;
  });
});
