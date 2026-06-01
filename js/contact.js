/* ===== Contact form (front-end demo) ===== */
(function () {
  'use strict';
  var form = document.getElementById('contact-form');
  if (!form) return;
  var msg = document.getElementById('contact-success');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = document.getElementById('c-name').value.trim();
    var email = document.getElementById('c-email').value.trim();
    if (!name || !email || email.indexOf('@') === -1) {
      msg.textContent = 'Please enter your name and a valid email.';
      msg.classList.remove('hidden', 'text-secondary');
      msg.classList.add('text-white');
      return;
    }
    form.reset();
    msg.textContent = 'Thank you, ' + name + '! Camila will be in touch soon.';
    msg.classList.remove('hidden', 'text-white');
    msg.classList.add('text-secondary');
  });
})();
