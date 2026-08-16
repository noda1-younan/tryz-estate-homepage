var navToggle = document.getElementById('nav-toggle');
var mainNav = document.getElementById('main-nav');
if (navToggle && mainNav) {
  navToggle.addEventListener('click', function () {
    var isOpen = mainNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  mainNav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      mainNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

var form = document.getElementById('contact-form-el');
var formMessage = document.getElementById('form-message');
if (form && formMessage) {
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    formMessage.textContent = 'フォーム送信機能は仮実装です。送信先が確定してから接続してください。';
  });
}
