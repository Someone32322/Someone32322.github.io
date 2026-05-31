/* ============================================================
   UNHEARD VOICES  JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* =========================================================
     1. READING PROGRESS BAR
  ========================================================= */
  const progressBar = document.getElementById('progress-bar');

  function updateProgress() {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct = total > 0 ? (scrolled / total) * 100 : 0;
    progressBar.style.width = Math.min(pct, 100) + '%';
  }

  /* =========================================================
     2. NAVBAR  scroll behaviour + active link
  ========================================================= */
  const navbar = document.getElementById('navbar');

  function updateNavbar() {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }

  const allSections = Array.from(document.querySelectorAll('section[id]'));
  const allNavLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));

  function updateActiveLink() {
    const mid = window.scrollY + window.innerHeight / 2;
    let current = null;

    for (const sec of allSections) {
      if (sec.offsetTop <= mid) {
        current = sec.id;
      }
    }

    allNavLinks.forEach(link => {
      const target = link.getAttribute('href').slice(1);
      link.classList.toggle('active', target === current);
    });
  }

  /* =========================================================
     3. MOBILE NAV TOGGLE
  ========================================================= */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinksList = document.querySelector('.nav-links');

  if (navToggle && navLinksList) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinksList.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close on link click
    navLinksList.addEventListener('click', e => {
      if (e.target.tagName === 'A') {
        navLinksList.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!navbar.contains(e.target)) {
        navLinksList.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* =========================================================
     4. SCROLL REVEAL (Intersection Observer)
  ========================================================= */
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Unobserve after reveal to save CPU
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
  );

  document.querySelectorAll('.reveal, .stagger').forEach(el => {
    revealObserver.observe(el);
  });

  /* =========================================================
     5. TIMELINE LINE ANIMATION
  ========================================================= */
  const timelineFill = document.querySelector('.timeline-connector-fill');
  if (timelineFill) {
    const tlObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            timelineFill.classList.add('go');
            tlObserver.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    tlObserver.observe(timelineFill.parentElement);
  }

  /* =========================================================
     6. COUNTER ANIMATION
  ========================================================= */
  function animateCounter(el) {
    const rawTarget = el.dataset.target || '0';
    // Separate numeric part and suffix (e.g. "1,000+" → num=1000, suffix="+")
    const cleaned = rawTarget.replace(/,/g, '');
    const match = cleaned.match(/^([\d.]+)(.*)$/);
    if (!match) { el.textContent = rawTarget; return; }

    const numTarget = parseFloat(match[1]);
    const suffix = match[2];
    const useComma = rawTarget.includes(',');
    const duration = 1800;
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const value = Math.round(eased * numTarget);
      el.textContent = (useComma ? value.toLocaleString() : value) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.done) {
          entry.target.dataset.done = '1';
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

  /* =========================================================
     7. GLOSSARY TOOLTIPS
  ========================================================= */
  const tooltip = document.getElementById('glossary-tooltip');
  let tooltipVisible = false;

  function positionTooltip(e) {
    const x = e.clientX;
    const y = e.clientY;
    const tw = tooltip.offsetWidth  || 280;
    const th = tooltip.offsetHeight || 70;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let left = x + 16;
    let top  = y - th - 16;

    if (left + tw > vw - 12) left = x - tw - 16;
    if (top < 10)            top  = y + 22;
    if (top + th > vh - 12)  top  = vh - th - 12;

    tooltip.style.left = left + 'px';
    tooltip.style.top  = top  + 'px';
  }

  document.querySelectorAll('.glossary').forEach(term => {
    term.addEventListener('mouseenter', function (e) {
      const word = this.dataset.word || this.textContent;
      const def  = this.dataset.def  || '';
      tooltip.innerHTML = `<strong>${word}</strong>${def}`;
      tooltip.classList.add('visible');
      tooltipVisible = true;
      positionTooltip(e);
    });

    term.addEventListener('mousemove', e => {
      if (tooltipVisible) positionTooltip(e);
    });

    term.addEventListener('mouseleave', () => {
      tooltip.classList.remove('visible');
      tooltipVisible = false;
    });

    // Keyboard accessibility  show on focus
    term.addEventListener('focus', function (e) {
      const word = this.dataset.word || this.textContent;
      const def  = this.dataset.def  || '';
      tooltip.innerHTML = `<strong>${word}</strong>${def}`;
      tooltip.classList.add('visible');
      tooltipVisible = true;
      positionTooltip(e);
    });

    term.addEventListener('blur', () => {
      tooltip.classList.remove('visible');
      tooltipVisible = false;
    });
  });

  /* =========================================================
     8. SMOOTH SCROLL for anchor links
  ========================================================= */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      if (!targetId) return;
      const target = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();
      const navH = navbar ? navbar.offsetHeight : 0;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH - 20;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* =========================================================
     9. UNIFIED SCROLL HANDLER (throttled)
  ========================================================= */
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateProgress();
        updateNavbar();
        updateActiveLink();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Initial calls
  updateProgress();
  updateNavbar();
  updateActiveLink();

  /* =========================================================
     10. HERO ERA PILL  highlight "During" on load
  ========================================================= */
  const durPill = document.querySelector('.hero-era-pill[data-era="during"]');
  if (durPill) {
    setTimeout(() => {
      document.querySelectorAll('.hero-era-pill').forEach(p => p.classList.remove('active'));
      durPill.classList.add('active');
    }, 2600);
    setTimeout(() => {
      durPill.classList.remove('active');
      const afterPill = document.querySelector('.hero-era-pill[data-era="after"]');
      if (afterPill) afterPill.classList.add('active');
    }, 4200);
  }

})();
