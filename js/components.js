/* ===== Camila Nutrition — shared header/footer + interactions ===== */
(function () {
  'use strict';

  var NAV = [
    { href: 'index.html', label: 'Home', sw: 'Nyumbani' },
    { href: 'calculator.html', label: 'TDEE Calculator', sw: 'Kikokotoo cha TDEE' },
    { href: 'tracker.html', label: 'Food Tracker', sw: 'Kufuatilia Chakula' },
    { href: 'nutrition.html', label: 'Local Nutrition', sw: 'Lishe ya Kienyeji' },
    { href: 'blood-sugar.html', label: 'Blood Sugar', sw: 'Sukari ya Damu' },
    { href: 'exercise.html', label: 'Exercise', sw: 'Mazoezi' }
  ];

  var IG = 'https://www.instagram.com/_c.a.m.ill.a_/';
  var TT = 'https://www.tiktok.com/@_c.a.mill.a_';

  var current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  if (current === '') current = 'index.html';

  var leaf = '<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/></svg>';
  var sun = '<svg data-icon="sun" class="h-5 w-5 hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>';
  var moon = '<svg data-icon="moon" class="h-5 w-5 hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';

  function navLinks(mobile) {
    return NAV.map(function (item) {
      var active = item.href === current;
      if (mobile) {
        return '<a href="' + item.href + '" data-sw="' + item.sw + '" class="block rounded-xl px-4 py-3 transition-colors ' +
          (active ? 'bg-muted text-primary font-700' : 'hover:bg-muted hover:text-primary') + '">' + item.label + '</a>';
      }
      return '<a href="' + item.href + '" data-sw="' + item.sw + '" class="transition-colors cursor-pointer ' +
        (active ? 'text-primary font-700' : 'hover:text-primary') + '">' + item.label + '</a>';
    }).join('');
  }

  var toggles =
    '<div class="flex items-center gap-1.5">' +
      '<div class="flex items-center rounded-full bg-muted p-0.5 text-xs font-700 text-muted-ink">' +
        '<button data-lang-btn="en" class="lang-seg px-2.5 py-1 rounded-full cursor-pointer" aria-label="English">EN</button>' +
        '<button data-lang-btn="sw" class="lang-seg px-2.5 py-1 rounded-full cursor-pointer" aria-label="Kiswahili">SW</button>' +
      '</div>' +
      '<button data-theme-btn class="grid h-9 w-9 place-items-center rounded-full bg-muted text-primary-deep hover:bg-primary hover:text-white transition-colors cursor-pointer" aria-label="Toggle dark mode">' + sun + moon + '</button>' +
    '</div>';

  var headerHTML =
    '<nav class="mx-auto max-w-7xl px-5 sm:px-8">' +
      '<div class="mt-3 flex items-center justify-between gap-3 rounded-organic bg-card/85 backdrop-blur-md shadow-soft border border-border px-4 sm:px-6 py-3">' +
        '<a href="index.html" class="flex items-center gap-2.5 group shrink-0">' +
          '<span class="grid h-10 w-10 place-items-center rounded-2xl bg-primary text-white shadow-soft transition-transform duration-300 group-hover:-rotate-6" aria-hidden="true">' + leaf + '</span>' +
          '<span class="font-display text-xl font-600 text-primary-deeper leading-none">Camila<span class="text-accent">.</span>' +
          '<span class="block text-[11px] font-body font-500 tracking-[0.2em] text-muted-ink uppercase">Nutrition</span></span>' +
        '</a>' +
        '<div class="hidden xl:flex items-center gap-6 text-sm font-500 text-ink-soft">' + navLinks(false) + '</div>' +
        '<div class="flex items-center gap-2 sm:gap-3">' +
          toggles +
          '<a href="contact.html" data-sw="Fanya kazi nami" class="hidden sm:inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-600 text-white shadow-soft transition-all duration-200 hover:bg-accent-soft hover:shadow-soft-lg cursor-pointer">Work with me</a>' +
          '<button data-menu-btn class="xl:hidden grid h-10 w-10 place-items-center rounded-2xl text-primary-deeper hover:bg-muted transition-colors cursor-pointer" aria-label="Open menu">' +
            '<svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg>' +
          '</button>' +
        '</div>' +
      '</div>' +
      '<div data-menu class="xl:hidden hidden mt-2 rounded-organic bg-card shadow-soft-lg border border-border p-4 text-sm font-500 text-ink-soft">' +
        navLinks(true) +
        '<a href="contact.html" data-sw="Fanya kazi nami" class="mt-2 block rounded-xl bg-accent px-4 py-3 text-center font-600 text-white">Work with me</a>' +
      '</div>' +
    '</nav>';

  var footerHTML =
    '<div class="mx-auto max-w-7xl px-5 sm:px-8 py-12 grid sm:grid-cols-3 gap-8">' +
      '<div class="sm:col-span-1">' +
        '<div class="flex items-center gap-2.5">' +
          '<span class="grid h-9 w-9 place-items-center rounded-2xl bg-primary text-white" aria-hidden="true">' + leaf + '</span>' +
          '<span class="font-display text-lg font-600 text-primary-deeper">Camila Nutrition</span>' +
        '</div>' +
        '<p class="mt-3 text-sm text-muted-ink max-w-xs" data-sw="Tunasaidia watu kote Kenya na Tanzania kula vizuri, kufanya mazoezi na kuishi vizuri — kwa chakula cha kienyeji na mazoea halisi.">Helping people across Kenya &amp; Tanzania eat well, move well and live well — with local food and realistic habits.</p>' +
      '</div>' +
      '<div>' +
        '<p class="font-600 text-primary-deeper" data-sw="Gundua">Explore</p>' +
        '<ul class="mt-3 space-y-2 text-sm text-ink-soft">' +
          '<li><a class="hover:text-primary" href="calculator.html" data-sw="Kikokotoo cha TDEE">TDEE Calculator</a></li>' +
          '<li><a class="hover:text-primary" href="tracker.html" data-sw="Kufuatilia Chakula">Food Tracker</a></li>' +
          '<li><a class="hover:text-primary" href="nutrition.html" data-sw="Lishe ya Kienyeji">Local Nutrition</a></li>' +
          '<li><a class="hover:text-primary" href="blood-sugar.html" data-sw="Sukari ya Damu na Insulini">Blood Sugar &amp; Insulin</a></li>' +
          '<li><a class="hover:text-primary" href="exercise.html" data-sw="Mazoezi">Exercise</a></li>' +
        '</ul>' +
      '</div>' +
      '<div>' +
        '<p class="font-600 text-primary-deeper" data-sw="Tufuate">Follow along</p>' +
        '<div class="mt-3 flex gap-3">' +
          '<a href="' + IG + '" target="_blank" rel="noopener noreferrer" class="grid h-10 w-10 place-items-center rounded-2xl bg-muted text-primary-deep hover:bg-primary hover:text-white transition-colors cursor-pointer" aria-label="Instagram"><svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>' +
          '<a href="' + TT + '" target="_blank" rel="noopener noreferrer" class="grid h-10 w-10 place-items-center rounded-2xl bg-muted text-primary-deep hover:bg-primary hover:text-white transition-colors cursor-pointer" aria-label="TikTok"><svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 5.82s.51.5 0 0A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48Z"/></svg></a>' +
        '</div>' +
        '<div class="mt-4 space-y-1.5 text-sm">' +
          '<a href="https://wa.me/254741418210" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 text-ink-soft hover:text-primary transition-colors"><svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm5.8 14.01c-.24.68-1.42 1.31-1.95 1.36-.5.05-.95.24-3.2-.67-2.7-1.06-4.42-3.84-4.55-4.02-.13-.18-1.1-1.46-1.1-2.79s.7-1.98.95-2.25c.24-.27.53-.34.71-.34l.51.01c.16.01.39-.06.6.46.24.58.81 2 .88 2.14.07.14.12.31.02.49-.09.18-.14.29-.27.45-.14.16-.29.36-.41.48-.14.14-.28.29-.12.56.16.27.71 1.17 1.53 1.9 1.05.93 1.94 1.22 2.21 1.36.27.14.43.12.59-.07.16-.18.68-.79.86-1.06.18-.27.36-.22.6-.13.24.09 1.55.73 1.81.86.27.13.45.2.51.31.07.11.07.63-.17 1.31Z"/></svg>+254 741 418 210</a>' +
          '<a href="mailto:camilashirima7@gmail.com" class="flex items-center gap-2 text-ink-soft hover:text-primary transition-colors"><svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/></svg><span class="break-all">camilashirima7@gmail.com</span></a>' +
        '</div>' +
        '<p class="mt-4 text-xs text-muted-ink">© <span data-year></span> Camila Nutrition.</p>' +
        '<p class="mt-1 text-xs text-muted-ink" data-sw="Maudhui ya kielimu — si mbadala wa ushauri wa daktari.">Educational content — not a substitute for medical advice.</p>' +
      '</div>' +
    '</div>';

  /* ---------- THEME ---------- */
  function getTheme() {
    try { return localStorage.getItem('camila_theme'); } catch (e) { return null; }
  }
  function applyTheme(theme) {
    var dark = theme === 'dark';
    document.documentElement.classList.toggle('dark', dark);
    var sunEl = document.querySelector('[data-icon="sun"]');
    var moonEl = document.querySelector('[data-icon="moon"]');
    if (sunEl && moonEl) { sunEl.classList.toggle('hidden', !dark); moonEl.classList.toggle('hidden', dark); }
  }
  function initTheme() {
    var t = getTheme();
    if (!t) { t = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light'; }
    applyTheme(t);
  }

  /* ---------- I18N ---------- */
  function getLang() {
    try { return localStorage.getItem('camila_lang') || 'en'; } catch (e) { return 'en'; }
  }
  function captureEnglish() {
    document.querySelectorAll('[data-sw]').forEach(function (el) {
      if (!el.hasAttribute('data-en')) el.setAttribute('data-en', el.innerHTML);
    });
    document.querySelectorAll('[data-sw-ph]').forEach(function (el) {
      if (!el.hasAttribute('data-en-ph')) el.setAttribute('data-en-ph', el.getAttribute('placeholder') || '');
    });
  }
  function applyLang(lang) {
    document.querySelectorAll('[data-sw]').forEach(function (el) {
      el.innerHTML = (lang === 'sw') ? el.getAttribute('data-sw') : (el.getAttribute('data-en') || el.innerHTML);
    });
    document.querySelectorAll('[data-sw-ph]').forEach(function (el) {
      el.setAttribute('placeholder', (lang === 'sw') ? el.getAttribute('data-sw-ph') : (el.getAttribute('data-en-ph') || ''));
    });
    document.documentElement.setAttribute('lang', lang === 'sw' ? 'sw' : 'en');
    document.querySelectorAll('[data-lang-btn]').forEach(function (b) {
      b.classList.toggle('is-active', b.getAttribute('data-lang-btn') === lang);
    });
    try { document.dispatchEvent(new CustomEvent('camila:lang', { detail: lang })); } catch (e) {}
  }

  function inject() {
    var header = document.getElementById('site-header');
    if (header) {
      header.className = 'fixed top-0 inset-x-0 z-50 transition-all duration-300';
      header.setAttribute('data-nav', '');
      header.innerHTML = headerHTML;
    }
    var footer = document.getElementById('site-footer');
    if (footer) {
      footer.className = 'border-t border-border bg-white/70 mt-8';
      footer.innerHTML = footerHTML;
    }
    wire();
  }

  function wire() {
    // capture English source text first
    captureEnglish();

    // theme
    initTheme();
    var themeBtn = document.querySelector('[data-theme-btn]');
    if (themeBtn) {
      themeBtn.addEventListener('click', function () {
        var next = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
        try { localStorage.setItem('camila_theme', next); } catch (e) {}
        applyTheme(next);
      });
    }

    // language
    applyLang(getLang());
    document.querySelectorAll('[data-lang-btn]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var lang = btn.getAttribute('data-lang-btn');
        try { localStorage.setItem('camila_lang', lang); } catch (e) {}
        applyLang(lang);
      });
    });

    // year
    document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

    // mobile menu
    var btn = document.querySelector('[data-menu-btn]');
    var menu = document.querySelector('[data-menu]');
    if (btn && menu) {
      btn.addEventListener('click', function () { menu.classList.toggle('hidden'); });
      menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { menu.classList.add('hidden'); }); });
    }

    // nav scroll shadow
    var nav = document.querySelector('[data-nav]');
    function onScroll() { if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 12); }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // scroll reveal
    var revealEls = document.querySelectorAll('[data-reveal]');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    }
  }

  // expose for late-rendered content (e.g. tracker re-renders)
  window.CamilaI18n = { getLang: getLang, apply: applyLang, capture: captureEnglish };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
