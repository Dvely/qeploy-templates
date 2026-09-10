// 작업물 분류 필터.
// data-filter 값과 카드의 data-category 값을 맞춰 보여주고 숨긴다.
// 카드를 추가할 때 data-category 만 붙이면 되고, 이 파일은 고치지 않아도 된다.
const filters = document.querySelectorAll('.filter');
const works = document.querySelectorAll('.work');
const empty = document.querySelector('.empty');

function apply(category) {
  let shown = 0;

  works.forEach((work) => {
    const match = category === 'all' || work.dataset.category === category;
    // hidden 속성을 쓴다. style.display 로 감추면 다시 켤 때 원래 display 값을 잃는다.
    work.hidden = !match;
    if (match) shown += 1;
  });

  if (empty) empty.hidden = shown > 0;
}

filters.forEach((button) => {
  button.addEventListener('click', () => {
    filters.forEach((other) => other.setAttribute('aria-pressed', String(other === button)));
    apply(button.dataset.filter);
  });
});
