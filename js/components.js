/* ===== Camila Nutrition — shared header/footer + interactions ===== */
(function () {
  'use strict';

  var NAV = [
    { href: 'index.html', label: 'Home' },
    { href: 'calculator.html', label: 'TDEE Calculator' },
    { href: 'tracker.html', label: 'Food Tracker' },
    { href: 'nutrition.html', label: 'Local Nutrition' },
    { href: 'blood-sugar.html', label: 'Blood Sugar' },
    { href: 'exercise.html', label: 'Exercise' }
  ];

  var IG = 'https://www.instagram.com/_c.a.m.ill.a_/';
  var TT = 'https://www.tiktok.com/@_c.a.m.ill.a_';

  var current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  if (current === '') current = 'index.html';

  var leaf = '<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/></svg>';

  function navLinks(mobile) {
    return NAV.map(function (item) {
      var active = item.href === current;
      if (mobile) {
        return '<a href="' + item.href + '" class="block rounded-xl px-4 py-3 transition-colors ' +
          (active ? 'bg-muted text-primary font-700' : 'hover:bg-muted hover:text-primary') + '">' + item.label + '</a>';
      }
      return '<a href="' + item.href + '" class="transition-colors cursor-pointer ' +
        (active ? 'text-primary font-700' : 'hover:text-primary') + '">' + item.label + '</a>';
    }).join('');
  }

  var headerHTML =
    '<nav class="mx-auto max-w-7xl px-5 sm:px-8">' +
      '<div class="mt-3 flex items-center justify-between rounded-organic bg-card/85 backdrop-blur-md shadow-soft border border-border px-4 sm:px-6 py-3">' +
        '<a href="index.html" class="flex items-center gap-2.5 group">' +
          '<span class="grid h-10 w-10 place-items-center rounded-2xl bg-primary text-white shadow-soft transition-transform duration-300 group-hover:-rotate-6" aria-hidden="true">' + leaf + '</span>' +
          '<span class="font-display text-xl font-600 text-primary-deeper leading-none">Camila<span class="text-accent">.</span>' +
          '<span class="block text-[11px] font-body font-500 tracking-[0.2em] text-muted-ink uppercase">Nutrition</span></span>' +
        '</a>' +
        '<div class="hidden xl:flex items-center gap-6 text-sm font-500 text-ink-soft">' + navLinks(false) + '</div>' +
        '<a href="contact.html" class="hidden sm:inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-600 text-white shadow-soft transition-all duration-200 hover:bg-accent-soft hover:shadow-soft-lg cursor-pointer">Work with me</a>' +
        '<button data-menu-btn class="xl:hidden grid h-10 w-10 place-items-center rounded-2xl text-primary-deeper hover:bg-muted transition-colors cursor-pointer" aria-label="Open menu">' +
          '<svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg>' +
        '</button>' +
      '</div>' +
      '<div data-menu class="xl:hidden hidden mt-2 rounded-organic bg-card shadow-soft-lg border border-border p-4 text-sm font-500 text-ink-soft">' +
        navLinks(true) +
        '<a href="contact.html" class="mt-2 block rounded-xl bg-accent px-4 py-3 text-center font-600 text-white">Work with me</a>' +
      '</div>' +
    '</nav>';

  var footerHTML =
    '<div class="mx-auto max-w-7xl px-5 sm:px-8 py-12 grid sm:grid-cols-3 gap-8">' +
      '<div class="sm:col-span-1">' +
        '<div class="flex items-center gap-2.5">' +
          '<span class="grid h-9 w-9 place-items-center rounded-2xl bg-primary text-white" aria-hidden="true">' + leaf + '</span>' +
          '<span class="font-display text-lg font-600 text-primary-deeper">Camila Nutrition</span>' +
        '</div>' +
        '<p class="mt-3 text-sm text-muted-ink max-w-xs">Helping people across Kenya &amp; Tanzania eat well, move well and live well — with local food and realistic habits.</p>' +
      '</div>' +
      '<div>' +
        '<p class="font-600 text-primary-deeper">Explore</p>' +
        '<ul class="mt-3 space-y-2 text-sm text-ink-soft">' +
          '<li><a class="hover:text-primary" href="calculator.html">TDEE Calculator</a></li>' +
          '<li><a class="hover:text-primary" href="tracker.html">Food Tracker</a></li>' +
          '<li><a class="hover:text-primary" href="nutrition.html">Local Nutrition</a></li>' +
          '<li><a class="hover:text-primary" href="blood-sugar.html">Blood Sugar &amp; Insulin</a></li>' +
          '<li><a class="hover:text-primary" href="exercise.html">Exercise</a></li>' +
        '</ul>' +
      '</div>' +
      '<div>' +
        '<p class="font-600 text-primary-deeper">Follow along</p>' +
        '<div class="mt-3 flex gap-3">' +
          '<a href="' + IG + '" target="_blank" rel="noopener noreferrer" class="grid h-10 w-10 place-items-center rounded-2xl bg-muted text-primary-deep hover:bg-primary hover:text-white transition-colors cursor-pointer" aria-label="Instagram"><svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>' +
          '<a href="' + TT + '" target="_blank" rel="noopener noreferrer" class="grid h-10 w-10 place-items-center rounded-2xl bg-muted text-primary-deep hover:bg-primary hover:text-white transition-colors cursor-pointer" aria-label="TikTok"><svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 5.82s.51.5 0 0A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48Z"/></svg></a>' +
        '</div>' +
        '<p class="mt-4 text-xs text-muted-ink">© <span data-year></span> Camila Nutrition.<br/>Educational content — not a substitute for medical advice.</p>' +
      '</div>' +
    '</div>';

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
    // year
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });

    // mobile menu
    var btn = document.querySelector('[data-menu-btn]');
    var menu = document.querySelector('[data-menu]');
    if (btn && menu) {
      btn.addEventListener('click', function () { menu.classList.toggle('hidden'); });
      menu.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () { menu.classList.add('hidden'); });
      });
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
