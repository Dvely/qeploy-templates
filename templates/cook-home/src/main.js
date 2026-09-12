// 요일 · 분류 · 검색으로 수업과 레시피를 걸러 보여준다.
// 카드에 data-day, data-category, data-name 만 맞추면 이 파일은 고치지 않아도 된다.
const days = document.querySelectorAll('.day');
const filters = document.querySelectorAll('.filter');
const classes = document.querySelectorAll('.klass');
const recipes = document.querySelectorAll('.recipe');
const emptyClass = document.querySelector('.empty-class');
const empty = document.querySelector('.empty');
const search = document.querySelector('#q');

const state = { day: 'all', category: 'all', query: '' };

function apply() {
  let shownClass = 0;
  classes.forEach((card) => {
    const match = state.day === 'all' || card.dataset.day === state.day;
    card.hidden = !match;
    if (match) shownClass += 1;
  });
  if (emptyClass) emptyClass.hidden = shownClass > 0;

  const q = state.query.trim().toLowerCase();
  let shownRecipe = 0;
  recipes.forEach((card) => {
    const byCat = state.category === 'all' || card.dataset.category === state.category;
    const byQuery = !q || (card.dataset.name ?? '').toLowerCase().includes(q);
    const match = byCat && byQuery;
    card.hidden = !match;
    if (match) shownRecipe += 1;
  });
  if (empty) empty.hidden = shownRecipe > 0;
}

days.forEach((button) => {
  button.addEventListener('click', () => {
    days.forEach((other) => other.setAttribute('aria-pressed', String(other === button)));
    state.day = button.dataset.day ?? 'all';
    apply();
  });
});

filters.forEach((button) => {
  button.addEventListener('click', () => {
    filters.forEach((other) => other.setAttribute('aria-pressed', String(other === button)));
    state.category = button.dataset.filter ?? 'all';
    apply();
  });
});

document.querySelector('.search')?.addEventListener('submit', (event) => event.preventDefault());
search?.addEventListener('input', () => {
  state.query = search.value;
  apply();
});

const form = document.querySelector('.inquiry');
const note = document.querySelector('.form-note');

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (note) note.hidden = false;
  form.reset();
});
