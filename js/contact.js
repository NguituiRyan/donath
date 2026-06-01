/* ===== Contact form — sends the enquiry to Camila via WhatsApp ===== */
(function () {
  'use strict';
  var form = document.getElementById('contact-form');
  if (!form) return;
  var msg = document.getElementById('contact-success');

  var WHATSAPP = '254741418210';
  var EMAIL = 'camilashirima7@gmail.com';

  function isSwahili() {
    return (window.CamilaI18n && window.CamilaI18n.getLang() === 'sw');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = document.getElementById('c-name').value.trim();
    var email = document.getElementById('c-email').value.trim();
    var goal = document.getElementById('c-goal').value;
    var message = document.getElementById('c-msg').value.trim();

    if (!name || !email || email.indexOf('@') === -1) {
      msg.textContent = isSwahili()
        ? 'Tafadhali weka jina lako na barua pepe sahihi.'
        : 'Please enter your name and a valid email.';
      msg.classList.remove('hidden', 'text-secondary');
      msg.classList.add('text-white');
      return;
    }

    // Build the message Camila will receive
    var lines = [
      'Hi Camila, I\'d like to book a consultation.',
      '',
      'Name: ' + name,
      'Email: ' + email,
      'Goal: ' + goal
    ];
    if (message) lines.push('Message: ' + message);
    var text = encodeURIComponent(lines.join('\n'));

    // Open WhatsApp with the enquiry pre-filled
    var waUrl = 'https://wa.me/' + WHATSAPP + '?text=' + text;
    window.open(waUrl, '_blank', 'noopener');

    var mailUrl = 'mailto:' + EMAIL +
      '?subject=' + encodeURIComponent('Consultation request — ' + name) +
      '&body=' + text;

    form.reset();
    msg.innerHTML = (isSwahili()
      ? 'Asante, ' + name + '! WhatsApp imefunguliwa ili kutuma ujumbe wako. '
        + 'Haikufunguka? <a class="underline" href="' + mailUrl + '">Tuma kwa barua pepe badala yake</a>.'
      : 'Thanks, ' + name + '! WhatsApp has opened to send your message. '
        + 'Didn\'t open? <a class="underline" href="' + mailUrl + '">Email it instead</a>.');
    msg.classList.remove('hidden', 'text-white');
    msg.classList.add('text-secondary');
  });
})();
