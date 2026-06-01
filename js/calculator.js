/* ===== TDEE Calculator ===== */
(function () {
  'use strict';

  var form = document.getElementById('tdee-form');
  if (!form) return;

  var errorEl = document.getElementById('tdee-error');
  var placeholder = document.getElementById('tdee-placeholder');
  var output = document.getElementById('tdee-output');
  var sendBtn = document.getElementById('send-to-tracker');
  var savedMsg = document.getElementById('goal-saved');

  var last = null;

  function fmt(n) { return Math.round(n).toLocaleString('en-US'); }
  function showError(msg) { errorEl.textContent = msg; errorEl.classList.remove('hidden'); }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    errorEl.classList.add('hidden');
    if (savedMsg) savedMsg.classList.add('hidden');

    var sex = (form.querySelector('input[name="sex"]:checked') || {}).value || 'female';
    var age = parseFloat(document.getElementById('age').value);
    var height = parseFloat(document.getElementById('height').value);
    var weight = parseFloat(document.getElementById('weight').value);
    var activity = parseFloat(document.getElementById('activity').value);

    if (!age || !height || !weight) { showError('Please fill in your age, height and weight.'); return; }
    if (age < 14 || age > 100 || height < 120 || height > 230 || weight < 35 || weight > 250) {
      showError('Please double-check your numbers — one value looks out of range.'); return;
    }

    var bmr = (10 * weight) + (6.25 * height) - (5 * age) + (sex === 'male' ? 5 : -161);
    var tdee = bmr * activity;
    var mildLoss = tdee - 250;
    var loss = tdee - 500;
    var gain = tdee + 250;

    var protein = 2 * weight;
    var proteinKcal = protein * 4;
    var fatKcal = loss * 0.25;
    var fat = fatKcal / 9;
    var carbs = Math.max((loss - proteinKcal - fatKcal) / 4, 0);

    document.getElementById('r-tdee').textContent = fmt(tdee);
    document.getElementById('r-bmr').textContent = fmt(bmr);
    document.getElementById('r-mildloss').textContent = fmt(mildLoss);
    document.getElementById('r-loss').textContent = fmt(loss);
    document.getElementById('r-gain').textContent = fmt(gain);
    document.getElementById('r-protein').textContent = fmt(protein) + 'g';
    document.getElementById('r-carbs').textContent = fmt(carbs) + 'g';
    document.getElementById('r-fat').textContent = fmt(fat) + 'g';

    last = {
      calorieGoal: Math.round(loss),
      maintenance: Math.round(tdee),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fat: Math.round(fat)
    };

    placeholder.classList.add('hidden');
    output.classList.remove('hidden');

    if (window.innerWidth < 1024) {
      document.getElementById('tdee-results').scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  form.addEventListener('reset', function () {
    errorEl.classList.add('hidden');
    output.classList.add('hidden');
    placeholder.classList.remove('hidden');
    if (savedMsg) savedMsg.classList.add('hidden');
  });

  if (sendBtn) {
    sendBtn.addEventListener('click', function () {
      if (!last) return;
      try {
        localStorage.setItem('camila_goal', JSON.stringify(last));
        savedMsg.textContent = 'Saved! Your goal of ' + last.calorieGoal.toLocaleString('en-US') + ' kcal is ready in the Food Tracker.';
        savedMsg.classList.remove('hidden');
      } catch (err) {
        savedMsg.textContent = 'Could not save — your browser may be blocking storage.';
        savedMsg.classList.remove('hidden');
      }
    });
  }
})();
