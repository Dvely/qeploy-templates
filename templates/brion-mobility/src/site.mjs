const trigger = document.querySelector('.menu-trigger');
const menu = document.querySelector('#site-menu');

trigger.addEventListener('click', () => {
  trigger.setAttribute('aria-expanded', 'true');
  menu.showModal();
});
trigger.setAttribute('aria-expanded', 'false');
menu.addEventListener('close', () => {
  trigger.setAttribute('aria-expanded', 'false');
  trigger.focus({ preventScroll: true });
});
menu.addEventListener('click', event => {
  if (event.target === menu && event.clientX < menu.getBoundingClientRect().left) menu.close();
});

const panels = [...document.querySelectorAll('[data-panel]')];
if (panels.length) {
  const panelLinks = [...document.querySelectorAll('.panel-nav a')];
  const step = document.querySelector('.step-link');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let pending = false;
  let current = '';

  function updatePanel() {
    pending = false;
    const point = Math.min(innerHeight * .46, 380);
    const atEnd = scrollY > 0 && Math.ceil(scrollY + innerHeight) >= document.documentElement.scrollHeight - 2;
    const panel = !atEnd && panels.find(section => {
      const rect = section.getBoundingClientRect();
      return rect.top <= point && rect.bottom > point;
    });
    const id = panel?.id ?? 'footer';
    if (id === current) return;
    current = id;
    document.body.dataset.current = id;
    for (const link of panelLinks) {
      if (link.hash === '#' + id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
    const next = panel ? panels[panels.indexOf(panel) + 1] : panels[0];
    step.href = '#' + (next?.id ?? 'footer');
    step.firstChild.textContent = panel ? '아래로 이동 ' : '맨 위로 이동 ';
    step.lastElementChild.textContent = panel ? '↓' : '↑';
  }

  function schedule() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(updatePanel);
  }

  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.classList.contains('skip')) return;
    const target = document.getElementById(link.hash.slice(1));
    if (!target) return;
    event.preventDefault();
    if (location.hash !== link.hash) history.pushState(null, '', link.hash);
    target.scrollIntoView({ behavior: motion.matches ? 'instant' : 'smooth' });
    if (event.detail === 0) {
      target.setAttribute('tabindex', '-1');
      target.focus({preventScroll: true});
    }
  });

  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  updatePanel();
}

const inquiry = document.querySelector('[data-inquiry]');
if (inquiry) {
  const { organization, topic, message } = inquiry.elements;
  const inputTopic = new URLSearchParams(location.search).get('topic');
  if ([...topic.options].some(option => option.value === inputTopic)) topic.value = inputTopic;
  inquiry.querySelector('button').disabled = false;
  message.addEventListener('input', () => message.setCustomValidity(''));
  inquiry.addEventListener('submit', event => {
    event.preventDefault();
    const text = message.value.trim();
    if (!text) {
      message.setCustomValidity('검토 내용을 입력하세요.');
      message.reportValidity();
      return;
    }
    const result = inquiry.querySelector('.inquiry-result');
    const title = topic.selectedOptions[0].textContent;
    result.querySelector('p').textContent = [organization.value.trim(), title, text].filter(Boolean).join('\n');
    result.hidden = false;
    result.focus();
  });
}

const stages = [...document.querySelectorAll('[data-stage]')];
for (const button of stages) {
  button.addEventListener('click', () => {
    for (const stage of stages) {
      const selected = stage === button;
      stage.setAttribute('aria-pressed', String(selected));
      document.getElementById(stage.getAttribute('aria-controls')).hidden = !selected;
    }
  });
}
