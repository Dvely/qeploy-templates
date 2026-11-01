// Local asset resolution and navigation leave the original UI components intact.
(() => {
 const root = new URL('.', document.currentScript.src);
 const routeMap = {
 '/ko':'index.html','/en':'moav-english.html',
 '/about/who-we-are':'moav-about-who-we-are.html','/about/history':'moav-about-history.html',
 '/business/channel':'moav-business-channel.html','/business/ip-universe':'moav-business-ip-universe.html','/business/md-portfolio':'moav-business-md-portfolio.html','/business/global':'moav-business-global.html',
 '/value/ethics-compliance/ethics':'moav-value-ethics-compliance-ethics.html','/value/ethics-compliance/compliance':'moav-value-ethics-compliance-compliance.html','/value/ethics-compliance/viewer-committee':'moav-value-ethics-compliance-viewer-committee.html','/value/partnership':'moav-value-partnership.html',
 '/newsroom/press':'moav-newsroom-press.html','/newsroom/media':'moav-newsroom-media.html','/newsroom/on-insight':'moav-newsroom-on-insight.html',
 '/newsroom/press/167':'moav-newsroom-press-167.html','/newsroom/press/165':'moav-newsroom-press-165.html','/newsroom/press/162':'moav-newsroom-press-162.html',
 '/careers/culture':'moav-careers-culture.html','/careers/people':'moav-careers-people.html','/careers/benefit':'moav-careers-benefit.html',
 '/support/inquiry':'moav-support-inquiry.html','/support/bidding':'moav-support-bidding.html','/support/integrity-report':'moav-support-integrity-report.html',
 '/personal-info-rule':'moav-personal-info-rule.html','/use-rule':'moav-use-rule.html'
 };
 window.MOAV_ASSET_URL = value => {
  if (!value) return '';
  if (/^(data:|blob:)/.test(value)) return value;
  if (/^(assets|_next)\//.test(value)) return value;
  const path = value.split(/[?#]/)[0];
  const name = path.split('/').pop();
  const mapped = window.MOAV_ASSET_MAP?.[name];
  if (mapped) return mapped;
  if (/\.(mp4|webm|gif)$/i.test(name)) return 'assets/moav-story.mp4';
  if (name.includes('logo')) return 'assets/moav-wordmark-purple.svg';
  if (/\.(png|jpe?g|webp|avif|svg)$/i.test(name)) return 'assets/moav-objects.png';
  return value;
 };
 function localRoute(href) {
  if (!href || href.startsWith('#') || /^(mailto:|tel:|data:|blob:)/.test(href)) return null;
  let url;
  try { url = new URL(href, location.href); } catch { return null; }
  const path = decodeURIComponent(url.pathname);
  const file = path.split('/').pop();
  if (Object.values(routeMap).includes(file)) return new URL(file + url.search + url.hash, root).href;
  if (path === '/ko' || path === '/en' || path === '/') return new URL(routeMap[path] || 'index.html', root).href;
  if (path.startsWith('/api/')) return new URL('assets/moav-brand-guide.pdf',root).href;
  const clean = path.replace(/^\/(ko|en)(?=\/)/, '');
  if (clean === '/value/ethics-compliance/feedback') return new URL('moav-value-ethics-compliance-viewer-committee.html',root).href;
  if (routeMap[clean]) return new URL(routeMap[clean] + url.search + url.hash, root).href;
  if (/\.(pdf|hwp|docx?|xlsx?|zip)$/i.test(path) || /download/i.test(path)) return new URL('assets/moav-brand-guide.pdf', root).href;
  if (/cjonstyle|cjenm|cj\.net|onstyleventures|instagram|youtube|tiktok|recruit/i.test(url.hostname)) {
   const dest = /recruit/.test(url.hostname) ? 'moav-careers-culture.html' : /customer|legal|terms/.test(path) ? 'moav-support-inquiry.html' : 'moav-about-who-we-are.html';
   return new URL(dest, root).href;
  }
  if (url.origin !== location.origin) return new URL('moav-about-who-we-are.html', root).href;
  if (clean.startsWith('/newsroom/')) return new URL('moav-newsroom-press-167.html', root).href;
  return null;
 }
 function normalizeLinks() {
  document.querySelectorAll('a[href]').forEach(a => {
   const next = localRoute(a.getAttribute('href'));
   if (next && a.href !== next) { a.href = next; a.removeAttribute('target'); }
  });
  document.querySelectorAll('img[width][height]').forEach(img => {
   if (img.style.height === 'auto' && Number(img.height) > 0 && !img.style.aspectRatio) { img.style.aspectRatio = `${img.getAttribute('width')} / ${img.getAttribute('height')}`; img.style.objectFit = 'cover'; }
  });
 }
 function announce(message, form) {
  let status = document.getElementById('moav-status');
  if (!status) { status = document.createElement('p'); status.id = 'moav-status'; status.setAttribute('role','status'); (form || document.body).append(status); }
  status.textContent = message; status.focus();
 }
 document.addEventListener('click', event => {
  const button = event.target.closest('button');
  const lang = button?.textContent.trim();
  if (lang === 'KR' || lang === 'EN') {
   event.preventDefault(); event.stopImmediatePropagation(); location.href = new URL(lang === 'EN' ? 'moav-english.html' : 'index.html',root); return;
  }
  const a = event.target.closest('a[href]');
  if (!a || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const dest = localRoute(a.getAttribute('href'));
  if (dest) { event.preventDefault(); event.stopImmediatePropagation(); location.assign(dest); }
 }, true);
 document.addEventListener('submit', event => {
  event.preventDefault(); event.stopImmediatePropagation();
  announce('입력 내용을 확인했습니다. 이 사이트는 가상 브랜드의 시연용 화면으로, 문의나 개인정보를 실제로 전송하지 않습니다.', event.target);
 }, true);
 const realFetch = window.fetch.bind(window);
 window.fetch = (input, options = {}) => {
  const url = new URL(typeof input === 'string' || input instanceof URL ? input : input.url, location.href);
  if (/\.(pdf|hwp|docx?|xlsx?)$/i.test(url.pathname) || url.pathname.startsWith('/api/')) return realFetch(new URL('assets/moav-brand-guide.pdf',root));
  if (url.origin !== location.origin || (options.method || 'GET').toUpperCase() !== 'GET') return Promise.reject(new TypeError('이 예시 사이트는 외부 서비스에 데이터를 전송하지 않습니다.'));
  return realFetch(input, options);
 };
 document.addEventListener('DOMContentLoaded', () => {
  normalizeLinks();
  let pending = false;
  new MutationObserver(() => { if (!pending) { pending = true; requestAnimationFrame(() => { pending = false; normalizeLinks(); }); } }).observe(document.body,{childList:true,subtree:true});
 });
})();
