// 소식 분류 필터.
// 카드에 data-category 만 맞추면 이 파일은 고치지 않아도 된다.
const filters = document.querySelectorAll('.filter');
const items = document.querySelectorAll('.news-item');
const empty = document.querySelector('.empty');

function apply(category) {
  let shown = 0;
  items.forEach((item) => {
    const match = category === 'all' || item.dataset.category === category;
    item.hidden = !match;
    if (match) shown += 1;
  });
  if (empty) empty.hidden = shown > 0;
}

filters.forEach((button) => {
  button.addEventListener('click', () => {
    filters.forEach((other) => other.setAttribute('aria-pressed', String(other === button)));
    apply(button.dataset.filter ?? 'all');
  });
});

// 문의 폼은 예시라 서버로 보내지 않는다. 보낸 것처럼만 보여 준다.
const form = document.querySelector('.inquiry');
const note = document.querySelector('.form-note');

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (note) note.hidden = false;
  form.reset();
});
