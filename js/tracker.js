/* ===== Camila Nutrition — Food Tracker ===== */
(function () {
  'use strict';

  var DB = window.FOOD_DB || [];
  var MEALS = [
    { key: 'breakfast', label: 'Breakfast', sw: 'Kifungua kinywa' },
    { key: 'lunch', label: 'Lunch', sw: 'Chakula cha mchana' },
    { key: 'dinner', label: 'Dinner', sw: 'Chakula cha jioni' },
    { key: 'snacks', label: 'Snacks', sw: 'Vitafunio' }
  ];

  function lang() { return (window.CamilaI18n && window.CamilaI18n.getLang()) || 'en'; }
  var T = {
    noFoods: { en: 'No foods found. Try the custom food option below.', sw: 'Hakuna vyakula vilivyopatikana. Jaribu chaguo la chakula maalum hapa chini.' },
    nothing: { en: 'Nothing logged yet.', sw: 'Hakuna kilichoandikwa bado.' },
    over: { en: ' over', sw: ' zaidi' },
    tagLocal: { en: 'Local', sw: 'Kienyeji' },
    tagStreet: { en: 'Street', sw: 'Mtaani' },
    tagGeneral: { en: 'General', sw: 'Kawaida' }
  };
  function t(k) { return T[k][lang()] || T[k].en; }

  var DEFAULT_GOAL = { calorieGoal: 2000, protein: 120, carbs: 200, fat: 55 };

  var state = {
    date: new Date(),
    filter: 'all',
    query: '',
    pending: null // food awaiting modal confirm
  };

  /* ---------- helpers ---------- */
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function dateKey(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function logStorageKey() { return 'camila_log_' + dateKey(state.date); }
  function round(n) { return Math.round(n); }
  function fmt(n) { return round(n).toLocaleString('en-US'); }

  function loadGoal() {
    try {
      var raw = localStorage.getItem('camila_goal');
      if (!raw) return Object.assign({}, DEFAULT_GOAL);
      var g = JSON.parse(raw);
      return {
        calorieGoal: g.calorieGoal || DEFAULT_GOAL.calorieGoal,
        protein: g.protein || DEFAULT_GOAL.protein,
        carbs: g.carbs || DEFAULT_GOAL.carbs,
        fat: g.fat || DEFAULT_GOAL.fat
      };
    } catch (e) { return Object.assign({}, DEFAULT_GOAL); }
  }
  function saveGoal(g) { try { localStorage.setItem('camila_goal', JSON.stringify(g)); } catch (e) {} }

  function loadLog() {
    try { return JSON.parse(localStorage.getItem(logStorageKey())) || []; }
    catch (e) { return []; }
  }
  function saveLog(log) { try { localStorage.setItem(logStorageKey(), JSON.stringify(log)); } catch (e) {} }

  /* ---------- DOM refs ---------- */
  var $ = function (id) { return document.getElementById(id); };
  var resultsEl = $('food-results');
  var mealsEl = $('meals');
  var searchEl = $('food-search');

  /* ---------- search list ---------- */
  function matchFoods() {
    var q = state.query.trim().toLowerCase();
    return DB.filter(function (food) {
      if (state.filter !== 'all' && food.cat !== state.filter) return false;
      if (!q) return true;
      return food.name.toLowerCase().indexOf(q) !== -1;
    });
  }

  function renderResults() {
    var foods = matchFoods();
    if (!foods.length) {
      resultsEl.innerHTML = '<li class="text-sm text-muted-ink py-4 text-center">' + t('noFoods') + '</li>';
      return;
    }
    resultsEl.innerHTML = foods.slice(0, 40).map(function (food, i) {
      var idx = DB.indexOf(food);
      var tag;
      if (food.cat === 'local') tag = '<span class="result-tag bg-primary/10 text-primary">' + t('tagLocal') + '</span>';
      else if (food.cat === 'street') tag = '<span class="result-tag bg-accent/10 text-accent">' + t('tagStreet') + '</span>';
      else tag = '<span class="result-tag bg-muted text-muted-ink">' + t('tagGeneral') + '</span>';
      return '<li>' +
        '<button class="result-row" data-idx="' + idx + '">' +
          '<span class="min-w-0">' +
            '<span class="block font-600 text-ink truncate">' + food.name + '</span>' +
            '<span class="block text-xs text-muted-ink">' + food.serving + ' · ' + food.kcal + ' kcal</span>' +
          '</span>' +
          '<span class="flex items-center gap-2 shrink-0">' + tag +
            '<span class="grid h-8 w-8 place-items-center rounded-full bg-primary text-white">' +
              '<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>' +
            '</span>' +
          '</span>' +
        '</button>' +
      '</li>';
    }).join('');
  }

  /* ---------- add modal ---------- */
  var modal = $('add-modal');
  function openModal(food) {
    state.pending = food;
    $('modal-food-name').textContent = food.name;
    $('modal-food-serving').textContent = food.serving;
    $('modal-qty').value = '1';
    updateModalKcal();
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
  function closeModal() {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    state.pending = null;
  }
  function updateModalKcal() {
    if (!state.pending) return;
    var qty = parseFloat($('modal-qty').value) || 0;
    $('modal-kcal').textContent = fmt(state.pending.kcal * qty);
  }

  /* ---------- entries ---------- */
  function addEntry(food, meal, qty) {
    var log = loadLog();
    log.push({
      id: Date.now() + '-' + Math.random().toString(36).slice(2, 7),
      name: food.name,
      serving: food.serving,
      meal: meal,
      qty: qty,
      kcal: food.kcal * qty,
      p: (food.p || 0) * qty,
      c: (food.c || 0) * qty,
      f: (food.f || 0) * qty
    });
    saveLog(log);
    render();
  }

  function removeEntry(id) {
    var log = loadLog().filter(function (e) { return e.id !== id; });
    saveLog(log);
    render();
  }

  /* ---------- meal log render ---------- */
  function renderMeals() {
    var log = loadLog();
    mealsEl.innerHTML = MEALS.map(function (m) {
      var items = log.filter(function (e) { return e.meal === m.key; });
      var subtotal = items.reduce(function (s, e) { return s + e.kcal; }, 0);
      var rows = items.length ? items.map(function (e) {
        var qtyLabel = e.qty === 1 ? e.serving : (e.qty + ' × ' + e.serving);
        return '<li class="log-item">' +
          '<span class="min-w-0"><span class="block font-500 text-ink truncate">' + e.name + '</span>' +
          '<span class="block text-xs text-muted-ink">' + qtyLabel + '</span></span>' +
          '<span class="flex items-center gap-3 shrink-0"><span class="font-600 text-primary-deep">' + fmt(e.kcal) + ' kcal</span>' +
          '<button class="del-btn" data-del="' + e.id + '" aria-label="Remove ' + e.name + '">' +
            '<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
          '</button></span>' +
        '</li>';
      }).join('') : '<li class="text-sm text-muted-ink px-1 py-3">' + t('nothing') + '</li>';

      return '<div class="meal-block">' +
        '<div class="meal-head"><h3 class="font-600 text-primary-deeper">' + (lang() === 'sw' ? m.sw : m.label) + '</h3>' +
        '<span class="text-sm font-600 text-muted-ink">' + fmt(subtotal) + ' kcal</span></div>' +
        '<ul class="mt-2 space-y-1.5">' + rows + '</ul>' +
      '</div>';
    }).join('');
  }

  /* ---------- summary render ---------- */
  function renderSummary() {
    var goal = loadGoal();
    var log = loadLog();
    var tot = log.reduce(function (s, e) {
      s.kcal += e.kcal; s.p += e.p; s.c += e.c; s.f += e.f; return s;
    }, { kcal: 0, p: 0, c: 0, f: 0 });

    $('sum-eaten').textContent = fmt(tot.kcal);
    $('sum-goal').textContent = fmt(goal.calorieGoal);
    var remaining = goal.calorieGoal - tot.kcal;
    $('sum-remaining').textContent = fmt(Math.abs(remaining)) + (remaining < 0 ? t('over') : '');
    var calPct = Math.min((tot.kcal / goal.calorieGoal) * 100, 100);
    var calBar = $('cal-bar');
    calBar.style.width = calPct + '%';
    calBar.classList.toggle('bg-accent', remaining < 0);
    calBar.classList.toggle('bg-secondary', remaining >= 0);

    $('sum-p').textContent = fmt(tot.p); $('goal-p').textContent = fmt(goal.protein);
    $('sum-c').textContent = fmt(tot.c); $('goal-c').textContent = fmt(goal.carbs);
    $('sum-f').textContent = fmt(tot.f); $('goal-f').textContent = fmt(goal.fat);
    $('bar-p').style.width = Math.min((tot.p / goal.protein) * 100, 100) + '%';
    $('bar-c').style.width = Math.min((tot.c / goal.carbs) * 100, 100) + '%';
    $('bar-f').style.width = Math.min((tot.f / goal.fat) * 100, 100) + '%';

    $('goal-input').value = goal.calorieGoal;
  }

  function render() {
    renderSummary();
    renderMeals();
  }

  /* ---------- date controls ---------- */
  function syncDateInput() { $('date-input').value = dateKey(state.date); }
  function shiftDate(days) {
    state.date.setDate(state.date.getDate() + days);
    syncDateInput();
    render();
  }

  /* ---------- events ---------- */
  function bind() {
    searchEl.addEventListener('input', function () { state.query = searchEl.value; renderResults(); });

    document.querySelectorAll('.filter-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        document.querySelectorAll('.filter-chip').forEach(function (c) { c.classList.remove('is-active'); });
        chip.classList.add('is-active');
        state.filter = chip.getAttribute('data-filter');
        renderResults();
      });
    });

    resultsEl.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-idx]');
      if (!btn) return;
      var food = DB[parseInt(btn.getAttribute('data-idx'), 10)];
      if (food) openModal(food);
    });

    mealsEl.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-del]');
      if (btn) removeEntry(btn.getAttribute('data-del'));
    });

    // modal
    $('modal-qty').addEventListener('input', updateModalKcal);
    $('modal-cancel').addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
    $('modal-add').addEventListener('click', function () {
      if (!state.pending) return;
      var qty = parseFloat($('modal-qty').value);
      if (!qty || qty <= 0) qty = 1;
      addEntry(state.pending, $('modal-meal').value, qty);
      closeModal();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });

    // custom food
    $('cf-add').addEventListener('click', function () {
      var name = $('cf-name').value.trim();
      var kcal = parseFloat($('cf-kcal').value);
      if (!name || !kcal) { $('cf-name').focus(); return; }
      var food = {
        name: name, serving: 'custom', kcal: kcal,
        p: parseFloat($('cf-p').value) || 0,
        c: parseFloat($('cf-c').value) || 0,
        f: parseFloat($('cf-f').value) || 0
      };
      addEntry(food, $('cf-meal').value, 1);
      $('cf-name').value = $('cf-kcal').value = $('cf-p').value = $('cf-c').value = $('cf-f').value = '';
    });

    // goal editing
    $('edit-goal-btn').addEventListener('click', function () { $('goal-panel').classList.toggle('hidden'); });
    $('goal-save').addEventListener('click', function () {
      var val = parseInt($('goal-input').value, 10);
      if (!val || val < 800) return;
      var goal = loadGoal();
      goal.calorieGoal = val;
      saveGoal(goal);
      $('goal-panel').classList.add('hidden');
      render();
    });

    // clear day
    $('clear-day').addEventListener('click', function () {
      if (confirm('Remove all foods logged for this day?')) { saveLog([]); render(); }
    });

    // date nav
    $('date-prev').addEventListener('click', function () { shiftDate(-1); });
    $('date-next').addEventListener('click', function () { shiftDate(1); });
    $('date-today').addEventListener('click', function () { state.date = new Date(); syncDateInput(); render(); });
    $('date-input').addEventListener('change', function () {
      var v = $('date-input').value;
      if (v) { var parts = v.split('-'); state.date = new Date(+parts[0], +parts[1] - 1, +parts[2]); render(); }
    });
  }

  /* ---------- init ---------- */
  syncDateInput();
  renderResults();
  render();
  bind();

  // re-render dynamic content when the language toggle changes
  document.addEventListener('camila:lang', function () {
    renderResults();
    render();
  });
})();
