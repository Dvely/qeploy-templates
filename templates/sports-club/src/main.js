// 종목 · 요일로 프로그램과 용품을 함께 걸러 보여준다.
// 카드에 data-category, data-day 만 맞추면 이 파일은 고치지 않아도 된다.
const sports = document.querySelectorAll('.sport');
const days = document.querySelectorAll('.day');
const filters = document.querySelectorAll('.filter');
const programs = document.querySelectorAll('.program');
const items = document.querySelectorAll('.item');
const emptyPrograms = document.querySelector('.empty');
const emptyGear = document.querySelector('.empty-gear');

const state = { sport: 'all', day: 'all' };

function press(buttons, current, key, value) {
  buttons.forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset[key] === value));
  });
  if (current) current.setAttribute('aria-pressed', 'true');
}

function apply() {
  let shownPrograms = 0;
  programs.forEach((card) => {
    const bySport = state.sport === 'all' || card.dataset.category === state.sport;
    const byDay = state.day === 'all' || card.dataset.day === state.day;
    const match = bySport && byDay;
    card.hidden = !match;
    if (match) shownPrograms += 1;
  });
  if (emptyPrograms) emptyPrograms.hidden = shownPrograms > 0;

  let shownGear = 0;
  items.forEach((card) => {
    const match = state.sport === 'all' || card.dataset.category === state.sport;
    card.hidden = !match;
    if (match) shownGear += 1;
  });
  if (emptyGear) emptyGear.hidden = shownGear > 0;

  // 종목 바로가기와 용품 필터는 같은 값을 가리킨다. 한쪽만 켜져 있으면 고른 상태가 어긋난다.
  sports.forEach((button) => {
    button.setAttribute('aria-pressed', String(state.sport === button.dataset.jump));
  });
  filters.forEach((button) => {
    button.setAttribute('aria-pressed', String(state.sport === button.dataset.filter));
  });
}

function setSport(sport) {
  // 같은 종목을 다시 누르면 전체를 보여준다.
  state.sport = state.sport === sport ? 'all' : sport;
  apply();
}

sports.forEach((button) => {
  button.addEventListener('click', () => {
    setSport(button.dataset.jump ?? 'all');
    document.querySelector('#programs')?.scrollIntoView({ behavior: 'smooth' });
  });
});

filters.forEach((button) => {
  button.addEventListener('click', () => {
    state.sport = button.dataset.filter ?? 'all';
    apply();
  });
});

days.forEach((button) => {
  button.addEventListener('click', () => {
    press(days, button, 'day', button.dataset.day ?? 'all');
    state.day = button.dataset.day ?? 'all';
    apply();
  });
});
