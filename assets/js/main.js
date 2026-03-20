// --- S1 Haircut & Beauty Schaba — München Haidhausen ---
// Partial-Loader + Burger-Menü + Auto-Hide Header + FAQ Accordion

/* ---- Root Prefix (GitHub Pages kompatibel) ---- */
function getRootPrefix() {
  const parts = window.location.pathname.split('/').filter(Boolean);
  const ghPages = document.documentElement.dataset.repo;
  let after = parts;
  if (ghPages) {
    const idx = parts.indexOf(ghPages);
    if (idx !== -1) after = parts.slice(idx + 1);
  }
  return '../'.repeat(Math.max(0, after.length - 1));
}

function resolveRootToken(s) {
  return (s || '').replace(/\{\{ROOT\}\}/g, getRootPrefix());
}

/* ---- Partial Loader ---- */
async function loadIncludes() {
  for (const el of document.querySelectorAll('[data-include]')) {
    let url = resolveRootToken(el.getAttribute('data-include'));
    if (!url) continue;
    try {
      const res = await fetch(url, { cache: 'no-cache' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      el.innerHTML = resolveRootToken(await res.text());
    } catch (e) {
      console.error('Partial fehlgeschlagen:', url, e);
    }
  }
}

/* ---- Burger Menü ---- */
function initBurger() {
  const btn = document.querySelector('[data-burger]');
  const menu = document.querySelector('[data-mobile-menu]');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => {
    const open = menu.hasAttribute('hidden');
    if (open) menu.removeAttribute('hidden'); else menu.setAttribute('hidden', '');
    btn.setAttribute('aria-expanded', String(open));
  });
  menu.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      menu.setAttribute('hidden', '');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ---- Auto-Hide Header ---- */
function initAutoHideHeader() {
  const header = document.getElementById('siteHeader');
  if (!header) return;
  let lastY = 0;
  let ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.pageYOffset || document.documentElement.scrollTop;
      if (y > 60) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
      if (y > lastY && y > 200) header.classList.add('hidden');
      else header.classList.remove('hidden');
      lastY = y;
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ---- Active Nav Highlight ---- */
function highlightActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, [data-mobile-menu] a:not(.nav-cta)').forEach(a => {
    const href = a.getAttribute('href');
    if (!href) return;
    const linkPage = href.split('/').pop().split('#')[0];
    if (linkPage === path) {
      a.style.color = 'var(--text)';
      a.style.background = 'var(--surface2)';
    }
  });
}

/* ---- FAQ Accordion ---- */
function initFAQ() {
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
}

/* ---- Init ---- */
(async () => {
  await loadIncludes();
  initBurger();
  initAutoHideHeader();
  highlightActiveNav();
  initFAQ();
})();
