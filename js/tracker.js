/* ===== Camila Nutrition — Food Tracker (MyFitnessPal-style) ===== */
(function () {
  'use strict';

  var DB = window.FOOD_DB || [];
  var GROUPS = window.FOOD_GROUPS || [];
  var MEALS = [
    { key: 'breakfast', en: 'Breakfast', sw: 'Kifungua kinywa' },
    { key: 'lunch', en: 'Lunch', sw: 'Chakula cha mchana' },
    { key: 'dinner', en: 'Dinner', sw: 'Chakula cha jioni' },
    { key: 'snacks', en: 'Snacks', sw: 'Vitafunio' }
  ];
  var MACRO_COLOR = { p: '#10B981', c: '#F59E0B', f: '#EA580C' };
  var WATER_GOAL = 8; // glasses (~250 ml each = 2 L)

  function lang() { return (window.CamilaI18n && window.CamilaI18n.getLang()) || 'en'; }
  var T = {
    noFoods: { en: 'No foods found here. Try another tab or add a custom food below.', sw: 'Hakuna vyakula hapa. Jaribu kichupo kingine au ongeza chakula maalum hapa chini.' },
    noRecent: { en: 'Foods you log will show up here for quick re-adding.', sw: 'Vyakula utakavyoandika vitaonekana hapa ili kuongeza upya haraka.' },
    noMine: { en: 'No custom foods yet. Create one with “Add a custom food” below.', sw: 'Hakuna vyakula maalum bado. Tengeneza kimoja kupitia “Ongeza chakula maalum” hapa chini.' },
    nothing: { en: 'Nothing logged yet.', sw: 'Hakuna kilichoandikwa bado.' },
    over: { en: ' over', sw: ' zaidi' },
    left: { en: ' left', sw: ' zimebaki' },
    tagLocal: { en: 'Local', sw: 'Kienyeji' },
    quickAdd: { en: 'Quick add', sw: 'Kalori za haraka' },
    servings: { en: 'servings', sw: 'sehemu' },
    save: { en: 'Save', sw: 'Hifadhi' },
    add: { en: 'Add', sw: 'Ongeza' },
    allGroups: { en: 'All food groups', sw: 'Makundi yote' },
    remaining: { en: 'Remaining', sw: 'Zilizobaki' },
    goalCal: { en: 'Goal', sw: 'Lengo' },
    food: { en: 'Food', sw: 'Chakula' },
    exercise: { en: 'Exercise', sw: 'Mazoezi' },
    glasses: { en: 'glasses', sw: 'glasi' },
    savedFood: { en: 'Saved to My foods ✓', sw: 'Imehifadhiwa kwenye Vyangu ✓' },
    repeatConfirm: { en: 'Copy everything you logged yesterday into today?', sw: 'Nakili vyote ulivyoandika jana hadi leo?' },
    clearConfirm: { en: 'Remove all foods logged for this day?', sw: 'Ondoa vyakula vyote vya siku hii?' },
    delFood: { en: 'Delete', sw: 'Futa' }
  };
  function t(k) { return (T[k] && (T[k][lang()] || T[k].en)) || k; }
  function mealLabel(key) { var m = MEALS.find(function (x) { return x.key === key; }); return m ? (lang() === 'sw' ? m.sw : m.en) : key; }
  function groupLabel(key) { var g = GROUPS.find(function (x) { return x.key === key; }); return g ? (lang() === 'sw' ? g.sw : g.en) : key; }

  var DEFAULT_GOAL = { calorieGoal: 2000, protein: 120, carbs: 200, fat: 55 };

  var state = {
    date: new Date(),
    tab: 'all',          // all | recent | frequent | mine
    group: 'all',
    query: '',
    view: [],            // foods currently shown in results
    pending: null,       // food awaiting modal confirm
    editing: null        // entry id being edited (else null)
  };

  /* ---------- helpers ---------- */
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function dateKey(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function round(n) { return Math.round(n); }
  function fmt(n) { return round(n).toLocaleString('en-US'); }
  function gfmt(n) { var r = Math.round(n * 10) / 10; return (r % 1 === 0 ? r.toFixed(0) : r.toFixed(1)); }
  function lsGet(key, fallback) { try { var v = JSON.parse(localStorage.getItem(key)); return v == null ? fallback : v; } catch (e) { return fallback; } }
  function lsSet(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }

  function logKey() { return 'camila_log_' + dateKey(state.date); }
  function waterKey() { return 'camila_water_' + dateKey(state.date); }
  function exKey() { return 'camila_exercise_' + dateKey(state.date); }
  function noteKey() { return 'camila_note_' + dateKey(state.date); }

  function loadGoal() {
    var g = lsGet('camila_goal', null) || {};
    return {
      calorieGoal: g.calorieGoal || DEFAULT_GOAL.calorieGoal,
      protein: g.protein || DEFAULT_GOAL.protein,
      carbs: g.carbs || DEFAULT_GOAL.carbs,
      fat: g.fat || DEFAULT_GOAL.fat
    };
  }
  function saveGoal(g) { lsSet('camila_goal', g); }
  function loadLog() { return lsGet(logKey(), []); }
  function saveLog(log) { lsSet(logKey(), log); }
  function myFoods() { return lsGet('camila_myfoods', []); }
  function saveMyFoods(arr) { lsSet('camila_myfoods', arr); }

  /* ---------- food sources ---------- */
  function allFoods() { return myFoods().concat(DB); }

  function recordUse(name) {
    var recent = lsGet('camila_recent', []);
    recent = recent.filter(function (n) { return n !== name; });
    recent.unshift(name);
    if (recent.length > 40) recent = recent.slice(0, 40);
    lsSet('camila_recent', recent);
    var freq = lsGet('camila_freq', {});
    freq[name] = (freq[name] || 0) + 1;
    lsSet('camila_freq', freq);
  }
  function byName(name) { return allFoods().filter(function (x) { return x.name === name; })[0]; }
  function recentFoods() {
    return lsGet('camila_recent', []).map(byName).filter(Boolean);
  }
  function frequentFoods() {
    var freq = lsGet('camila_freq', {});
    return Object.keys(freq)
      .sort(function (a, b) { return freq[b] - freq[a]; })
      .map(byName).filter(Boolean);
  }

  /* ---------- DOM ---------- */
  var $ = function (id) { return document.getElementById(id); };
  var resultsEl, mealsEl, searchEl;

  /* ---------- search / results ---------- */
  function activeList() {
    if (state.tab === 'mine') return myFoods();
    if (state.tab === 'recent') return recentFoods();
    if (state.tab === 'frequent') return frequentFoods();
    return allFoods();
  }
  function matchFoods() {
    var q = state.query.trim().toLowerCase();
    return activeList().filter(function (food) {
      if (state.group !== 'all' && food.cat !== state.group) return false;
      if (!q) return true;
      return food.name.toLowerCase().indexOf(q) !== -1;
    });
  }

  function emptyMsg() {
    if (state.tab === 'recent' || state.tab === 'frequent') return t('noRecent');
    if (state.tab === 'mine') return t('noMine');
    return t('noFoods');
  }

  function renderResults() {
    var foods = matchFoods();
    state.view = foods;
    if (!foods.length) {
      resultsEl.innerHTML = '<li class="text-sm text-muted-ink py-6 text-center">' + emptyMsg() + '</li>';
      return;
    }
    resultsEl.innerHTML = foods.slice(0, 60).map(function (food, i) {
      var u = food.units[0];
      var tag = food.local
        ? '<span class="result-tag bg-primary/10 text-primary">' + t('tagLocal') + '</span>'
        : '<span class="result-tag bg-muted text-muted-ink">' + groupLabel(food.cat) + '</span>';
      return '<li>' +
        '<button class="result-row" data-idx="' + i + '">' +
          '<span class="min-w-0">' +
            '<span class="block font-600 text-ink truncate">' + food.name + '</span>' +
            '<span class="block text-xs text-muted-ink">' + u.label + ' · ' + u.kcal + ' kcal</span>' +
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

  /* ---------- add / edit modal ---------- */
  var modal;
  function fillUnitOptions(food, selectedLabel) {
    $('modal-unit').innerHTML = food.units.map(function (u) {
      return '<option value="' + u.label + '"' + (u.label === selectedLabel ? ' selected' : '') + '>' + u.label + '</option>';
    }).join('');
  }
  function currentUnit() {
    if (!state.pending) return null;
    var label = $('modal-unit').value;
    return state.pending.units.filter(function (u) { return u.label === label; })[0] || state.pending.units[0];
  }
  function openModal(food, entry) {
    state.pending = food;
    state.editing = entry ? entry.id : null;
    $('modal-food-name').textContent = food.name;
    fillUnitOptions(food, entry ? entry.unitLabel : food.units[0].label);
    $('modal-qty').value = entry ? entry.qty : 1;
    $('modal-meal').value = entry ? entry.meal : (defaultMeal());
    $('modal-add').textContent = entry ? t('save') : t('add');
    $('modal-delete').classList.toggle('hidden', !entry);
    updateModalPreview();
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    $('modal-qty').focus();
  }
  function closeModal() {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    state.pending = null;
    state.editing = null;
  }
  function updateModalPreview() {
    var u = currentUnit();
    if (!u) return;
    var qty = parseFloat($('modal-qty').value) || 0;
    $('modal-kcal').textContent = fmt(u.kcal * qty);
    $('modal-p').textContent = gfmt(u.p * qty);
    $('modal-c').textContent = gfmt(u.c * qty);
    $('modal-f').textContent = gfmt(u.f * qty);
  }
  function defaultMeal() {
    var h = new Date().getHours();
    if (h < 11) return 'breakfast';
    if (h < 16) return 'lunch';
    if (h < 21) return 'dinner';
    return 'snacks';
  }

  /* ---------- entries ---------- */
  function entryTotals(e) {
    var b = e.base, q = e.qty || 1;
    return { kcal: b.kcal * q, p: b.p * q, c: b.c * q, f: b.f * q, fb: (b.fb || 0) * q, sg: (b.sg || 0) * q, na: (b.na || 0) * q };
  }
  function newId() { return Date.now() + '-' + Math.random().toString(36).slice(2, 7); }

  function commitFromModal() {
    if (!state.pending) return;
    var u = currentUnit();
    var qty = parseFloat($('modal-qty').value);
    if (!qty || qty <= 0) qty = 1;
    var meal = $('modal-meal').value;
    var base = { kcal: u.kcal, p: u.p, c: u.c, f: u.f, fb: u.fb || 0, sg: u.sg || 0, na: u.na || 0 };
    var log = loadLog();
    if (state.editing) {
      log = log.map(function (e) {
        if (e.id !== state.editing) return e;
        return Object.assign({}, e, { unitLabel: u.label, qty: qty, meal: meal, base: base });
      });
    } else {
      log.push({ id: newId(), name: state.pending.name, group: state.pending.cat, meal: meal, unitLabel: u.label, qty: qty, base: base });
      recordUse(state.pending.name);
    }
    saveLog(log);
    closeModal();
    render();
  }
  function removeEntry(id) {
    saveLog(loadLog().filter(function (e) { return e.id !== id; }));
    render();
  }
  function quickAdd(kcal, meal) {
    var log = loadLog();
    log.push({ id: newId(), name: t('quickAdd'), group: 'quick', meal: meal, unitLabel: 'kcal', qty: 1, base: { kcal: kcal, p: 0, c: 0, f: 0, fb: 0, sg: 0, na: 0 } });
    saveLog(log);
    render();
  }

  /* ---------- meal log ---------- */
  function renderMeals() {
    var log = loadLog();
    mealsEl.innerHTML = MEALS.map(function (m) {
      var items = log.filter(function (e) { return e.meal === m.key; });
      var subtotal = items.reduce(function (s, e) { return s + entryTotals(e).kcal; }, 0);
      var rows = items.length ? items.map(function (e) {
        var tot = entryTotals(e);
        var qtyLabel = e.unitLabel === 'kcal' ? '' : ((e.qty === 1 ? '' : (gfmt(e.qty) + ' × ')) + e.unitLabel);
        return '<li class="log-item" data-edit="' + e.id + '">' +
          '<span class="min-w-0"><span class="block font-500 text-ink truncate">' + e.name + '</span>' +
          (qtyLabel ? '<span class="block text-xs text-muted-ink">' + qtyLabel + '</span>' : '') + '</span>' +
          '<span class="flex items-center gap-3 shrink-0"><span class="font-600 text-primary-deep">' + fmt(tot.kcal) + ' kcal</span>' +
          '<button class="del-btn" data-del="' + e.id + '" aria-label="Remove ' + e.name + '">' +
            '<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
          '</button></span>' +
        '</li>';
      }).join('') : '<li class="text-sm text-muted-ink px-1 py-3">' + t('nothing') + '</li>';

      return '<div class="meal-block">' +
        '<div class="meal-head"><h3 class="font-600 text-primary-deeper">' + mealLabel(m.key) + '</h3>' +
        '<span class="text-sm font-600 text-muted-ink">' + fmt(subtotal) + ' kcal</span></div>' +
        '<ul class="mt-2 space-y-1.5">' + rows + '</ul>' +
      '</div>';
    }).join('');
  }

  /* ---------- summary ---------- */
  function renderDonut(tot) {
    var pCal = tot.p * 4, cCal = tot.c * 4, fCal = tot.f * 9;
    var sum = pCal + cCal + fCal;
    var donut = $('macro-donut');
    if (!donut) return;
    if (sum <= 0) {
      donut.style.background = 'conic-gradient(rgba(255,255,255,0.18) 0 100%)';
    } else {
      var pPct = (pCal / sum) * 100, cPct = (cCal / sum) * 100;
      var a = pPct, b = pPct + cPct;
      donut.style.background = 'conic-gradient(' +
        MACRO_COLOR.p + ' 0 ' + a + '%,' +
        MACRO_COLOR.c + ' ' + a + '% ' + b + '%,' +
        MACRO_COLOR.f + ' ' + b + '% 100%)';
    }
    $('donut-kcal').textContent = fmt(tot.kcal);
    $('leg-p').textContent = sum ? Math.round((pCal / sum) * 100) + '%' : '0%';
    $('leg-c').textContent = sum ? Math.round((cCal / sum) * 100) + '%' : '0%';
    $('leg-f').textContent = sum ? Math.round((fCal / sum) * 100) + '%' : '0%';
  }

  function renderSummary() {
    var goal = loadGoal();
    var log = loadLog();
    var tot = log.reduce(function (s, e) {
      var x = entryTotals(e);
      s.kcal += x.kcal; s.p += x.p; s.c += x.c; s.f += x.f; s.fb += x.fb; s.sg += x.sg; s.na += x.na; return s;
    }, { kcal: 0, p: 0, c: 0, f: 0, fb: 0, sg: 0, na: 0 });
    var exercise = parseInt(lsGet(exKey(), 0), 10) || 0;

    $('sum-eaten').textContent = fmt(tot.kcal);
    $('sum-goal').textContent = fmt(goal.calorieGoal);
    $('sum-goal-2').textContent = fmt(goal.calorieGoal);
    $('sum-exercise').textContent = fmt(exercise);
    var remaining = goal.calorieGoal - tot.kcal + exercise;
    $('sum-remaining').textContent = fmt(Math.abs(remaining)) + (remaining < 0 ? t('over') : '');
    var calPct = Math.min((tot.kcal / (goal.calorieGoal + exercise)) * 100, 100);
    var calBar = $('cal-bar');
    calBar.style.width = calPct + '%';
    calBar.classList.toggle('bg-accent', remaining < 0);
    calBar.classList.toggle('bg-secondary', remaining >= 0);

    $('sum-p').textContent = gfmt(tot.p); $('goal-p').textContent = fmt(goal.protein);
    $('sum-c').textContent = gfmt(tot.c); $('goal-c').textContent = fmt(goal.carbs);
    $('sum-f').textContent = gfmt(tot.f); $('goal-f').textContent = fmt(goal.fat);
    $('bar-p').style.width = Math.min((tot.p / goal.protein) * 100, 100) + '%';
    $('bar-c').style.width = Math.min((tot.c / goal.carbs) * 100, 100) + '%';
    $('bar-f').style.width = Math.min((tot.f / goal.fat) * 100, 100) + '%';

    $('sum-fb').textContent = gfmt(tot.fb) + ' g';
    $('sum-sg').textContent = gfmt(tot.sg) + ' g';
    $('sum-na').textContent = fmt(tot.na) + ' mg';

    renderDonut(tot);

    $('goal-input').value = goal.calorieGoal;
    $('goal-p-input').value = goal.protein;
    $('goal-c-input').value = goal.carbs;
    $('goal-f-input').value = goal.fat;
    $('ex-input').value = exercise || '';
  }

  /* ---------- water ---------- */
  function renderWater() {
    var n = parseInt(lsGet(waterKey(), 0), 10) || 0;
    $('water-count').textContent = n;
    var cells = '';
    for (var i = 0; i < WATER_GOAL; i++) {
      cells += '<span class="water-glass' + (i < n ? ' is-full' : '') + '" aria-hidden="true">' +
        '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 3h14l-1.4 16.1A2 2 0 0 1 15.6 21H8.4a2 2 0 0 1-2-1.9L5 3Z"/></svg></span>';
    }
    $('water-glasses').innerHTML = cells;
  }
  function setWater(n) { lsSet(waterKey(), Math.max(0, n)); renderWater(); }

  /* ---------- note ---------- */
  function renderNote() { $('day-note').value = lsGet(noteKey(), '') || ''; }

  function render() {
    renderSummary();
    renderMeals();
    renderWater();
    renderNote();
  }

  /* ---------- date controls ---------- */
  function syncDateInput() { $('date-input').value = dateKey(state.date); }
  function shiftDate(days) { state.date.setDate(state.date.getDate() + days); syncDateInput(); render(); }

  /* ---------- group filter ---------- */
  function buildGroupFilter() {
    var sel = $('group-filter');
    var cur = state.group;
    sel.innerHTML = '<option value="all">' + t('allGroups') + '</option>' +
      GROUPS.map(function (g) { return '<option value="' + g.key + '">' + groupLabel(g.key) + '</option>'; }).join('');
    sel.value = cur;
  }

  /* ---------- events ---------- */
  function bind() {
    searchEl.addEventListener('input', function () { state.query = searchEl.value; renderResults(); });

    document.querySelectorAll('.food-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        document.querySelectorAll('.food-tab').forEach(function (x) { x.classList.remove('is-active'); });
        tab.classList.add('is-active');
        state.tab = tab.getAttribute('data-tab');
        renderResults();
      });
    });

    $('group-filter').addEventListener('change', function () { state.group = this.value; renderResults(); });

    resultsEl.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-idx]');
      if (!btn) return;
      var food = state.view[parseInt(btn.getAttribute('data-idx'), 10)];
      if (food) openModal(food, null);
    });

    mealsEl.addEventListener('click', function (e) {
      var del = e.target.closest('[data-del]');
      if (del) { removeEntry(del.getAttribute('data-del')); return; }
      var row = e.target.closest('[data-edit]');
      if (row) {
        var id = row.getAttribute('data-edit');
        var entry = loadLog().filter(function (x) { return x.id === id; })[0];
        if (!entry || entry.unitLabel === 'kcal') return; // quick-add not editable
        var food = byName(entry.name);
        // fall back to a single-unit food built from the entry if not found
        if (!food) food = { name: entry.name, cat: entry.group, local: false, units: [{ label: entry.unitLabel, kcal: entry.base.kcal, p: entry.base.p, c: entry.base.c, f: entry.base.f, fb: entry.base.fb, sg: entry.base.sg, na: entry.base.na }] };
        openModal(food, entry);
      }
    });

    // modal
    $('modal-unit').addEventListener('change', updateModalPreview);
    $('modal-qty').addEventListener('input', updateModalPreview);
    $('modal-cancel').addEventListener('click', closeModal);
    $('modal-delete').addEventListener('click', function () { if (state.editing) { removeEntry(state.editing); closeModal(); } });
    modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
    $('modal-add').addEventListener('click', commitFromModal);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });

    // quick add
    $('qa-add').addEventListener('click', function () {
      var kcal = parseFloat($('qa-kcal').value);
      if (!kcal || kcal <= 0) { $('qa-kcal').focus(); return; }
      quickAdd(kcal, $('qa-meal').value);
      $('qa-kcal').value = '';
    });

    // custom food (saved to My foods + logged once)
    $('cf-add').addEventListener('click', function () {
      var name = $('cf-name').value.trim();
      var kcal = parseFloat($('cf-kcal').value);
      if (!name || !kcal) { $('cf-name').focus(); return; }
      var unitLabel = $('cf-serving').value.trim() || '1 serving';
      var food = {
        name: name, cat: 'mine', local: false,
        units: [{ label: unitLabel, kcal: kcal, p: parseFloat($('cf-p').value) || 0, c: parseFloat($('cf-c').value) || 0, f: parseFloat($('cf-f').value) || 0, fb: 0, sg: 0, na: 0 }]
      };
      // save to My foods (replace same-name)
      var mine = myFoods().filter(function (x) { return x.name !== name; });
      mine.unshift(food);
      saveMyFoods(mine);
      // log it once
      var log = loadLog();
      log.push({ id: newId(), name: name, group: 'mine', meal: $('cf-meal').value, unitLabel: unitLabel, qty: 1, base: food.units[0] });
      saveLog(log);
      recordUse(name);
      $('cf-name').value = $('cf-serving').value = $('cf-kcal').value = $('cf-p').value = $('cf-c').value = $('cf-f').value = '';
      var note = $('cf-saved'); note.textContent = t('savedFood'); note.classList.remove('hidden');
      setTimeout(function () { note.classList.add('hidden'); }, 2500);
      render();
    });

    // goal editing (calories + macros)
    $('edit-goal-btn').addEventListener('click', function () { $('goal-panel').classList.toggle('hidden'); });
    $('goal-save').addEventListener('click', function () {
      var goal = loadGoal();
      var cal = parseInt($('goal-input').value, 10);
      if (cal && cal >= 800) goal.calorieGoal = cal;
      goal.protein = parseInt($('goal-p-input').value, 10) || goal.protein;
      goal.carbs = parseInt($('goal-c-input').value, 10) || goal.carbs;
      goal.fat = parseInt($('goal-f-input').value, 10) || goal.fat;
      saveGoal(goal);
      $('goal-panel').classList.add('hidden');
      render();
    });

    // water
    $('water-add').addEventListener('click', function () { setWater((parseInt(lsGet(waterKey(), 0), 10) || 0) + 1); });
    $('water-remove').addEventListener('click', function () { setWater((parseInt(lsGet(waterKey(), 0), 10) || 0) - 1); });

    // exercise calories (auto-save)
    $('ex-input').addEventListener('input', function () {
      var v = parseInt($('ex-input').value, 10);
      lsSet(exKey(), isNaN(v) || v < 0 ? 0 : v);
      renderSummary();
    });

    // daily note (auto-save)
    var noteTimer;
    $('day-note').addEventListener('input', function () {
      clearTimeout(noteTimer);
      var val = $('day-note').value;
      noteTimer = setTimeout(function () { lsSet(noteKey(), val); }, 400);
    });

    // repeat yesterday
    $('repeat-yesterday').addEventListener('click', function () {
      var y = new Date(state.date); y.setDate(y.getDate() - 1);
      var prev = lsGet('camila_log_' + dateKey(y), []);
      if (!prev.length) return;
      if (!confirm(t('repeatConfirm'))) return;
      var log = loadLog();
      prev.forEach(function (e) { log.push(Object.assign({}, e, { id: newId() })); });
      saveLog(log);
      render();
    });

    // clear day
    $('clear-day').addEventListener('click', function () {
      if (confirm(t('clearConfirm'))) { saveLog([]); render(); }
    });

    // date nav
    $('date-prev').addEventListener('click', function () { shiftDate(-1); });
    $('date-next').addEventListener('click', function () { shiftDate(1); });
    $('date-today').addEventListener('click', function () { state.date = new Date(); syncDateInput(); render(); });
    $('date-input').addEventListener('change', function () {
      var v = $('date-input').value;
      if (v) { var p = v.split('-'); state.date = new Date(+p[0], +p[1] - 1, +p[2]); render(); }
    });
  }

  /* ---------- init ---------- */
  function init() {
    resultsEl = $('food-results');
    mealsEl = $('meals');
    searchEl = $('food-search');
    modal = $('add-modal');
    buildGroupFilter();
    syncDateInput();
    renderResults();
    render();
    bind();
  }
  init();

  // re-render dynamic content when the language toggle changes
  document.addEventListener('camila:lang', function () {
    buildGroupFilter();
    renderResults();
    render();
    if (state.pending) { $('modal-add').textContent = state.editing ? t('save') : t('add'); }
  });
})();
