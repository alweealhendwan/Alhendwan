/* ============================================================
   ALHENDWAN — Shared script (all pages)
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* Nav scroll */
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => {
    nav?.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });

  /* Hamburger */
  const ham = document.querySelector('.nav__hamburger');
  const mob = document.querySelector('.nav__mobile');
  ham?.addEventListener('click', () => mob?.classList.toggle('open'));
  document.addEventListener('click', e => {
    if (!ham?.contains(e.target) && !mob?.contains(e.target))
      mob?.classList.remove('open');
  });

  /* Active link */
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a, .nav__mobile a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });

  /* Scroll reveal */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = Number(entry.target.dataset.delay || 0);
          setTimeout(() => entry.target.classList.add('in'), delay);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('in'));
  }

  /* Background music */
  const audio    = document.getElementById('bg-music');
  const btn      = document.getElementById('music-toggle');
  const bars     = document.getElementById('music-bars');
  const lbl      = document.getElementById('music-label');
  let playing    = false;

  if (audio && btn) {
    audio.volume = 0.35;
    (async () => {
      try { await audio.play(); playing = true; syncUI(); } catch (_) {}
    })();
    btn.addEventListener('click', async () => {
      playing ? audio.pause() : await audio.play();
      playing = !playing;
      syncUI();
    });
  }
  function syncUI() {
    bars?.classList.toggle('paused', !playing);
    if (lbl) lbl.textContent = playing ? 'Pause' : 'Play';
  }

  /* Search */
  function doSearch(q) {
    q = q.toLowerCase().trim();
    const cards = document.querySelectorAll('.card[data-category], .product-card[data-category]');
    if (!cards.length) {
      if (q) window.location.href = `shop.html?q=${encodeURIComponent(q)}`;
      return;
    }
    cards.forEach(c => {
      const name = (c.querySelector('.card__name, .product-card__name')?.textContent || '').toLowerCase();
      const cat  = (c.dataset.category || '').toLowerCase();
      c.style.display = (!q || name.includes(q) || cat.includes(q)) ? '' : 'none';
    });
  }

  ['nav-search-input', 'shop-search-input'].forEach(id => {
    const el = document.getElementById(id);
    el?.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(el.value); });
  });

  const urlQ = new URLSearchParams(location.search).get('q');
  if (urlQ) {
    ['nav-search-input','shop-search-input'].forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.value = urlQ; doSearch(urlQ); }
    });
  }

});