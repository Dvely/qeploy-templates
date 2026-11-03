(function () {
  function init() {
    document.querySelectorAll('main .button:not(.secondary), main .btn:not(.secondary):not(.btn-cta), main .sk-button, .luon-tech-action a, .luon-service-card__cta').forEach(function (button) {
      if (button.classList.contains('luon-action-motion')) return;
      button.classList.add('luon-action-motion');
      var style = getComputedStyle(button);
      button.style.setProperty('--luon-action-color', style.backgroundColor === 'rgba(0, 0, 0, 0)' ? style.color : style.backgroundColor);
      var arrow = Array.from(button.children).find(function (child) { return /^[↗→↓]$/.test(child.textContent.trim()); });
      if (!arrow) {
        arrow = document.createElement('span');
        arrow.textContent = button.hasAttribute('download') ? '↓' : '→';
        button.appendChild(arrow);
      }
      arrow.classList.add('luon-action-arrow');
      arrow.setAttribute('aria-hidden', 'true');
      var ring = document.createElement('span');
      ring.className = 'luon-action-ring';
      ring.setAttribute('aria-hidden', 'true');
      button.appendChild(ring);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
