(() => {
  const carousel = document.querySelector('[data-carousel]');
  if (carousel) {
    const slides = [...carousel.querySelectorAll('[data-slide]')];
    const dotsHost = carousel.querySelector('.carousel-dots');
    const pauseButton = carousel.querySelector('[data-pause]');
    const pauseLabel = pauseButton.querySelector('.pause-label');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let index = 0;
    let timer = null;
    let manuallyPaused = reducedMotion;

    const dots = slides.map((slide, slideIndex) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel-dot';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `${slideIndex + 1}枚目の画像を表示`);
      dot.addEventListener('click', () => {
        showSlide(slideIndex);
        restart();
      });
      dotsHost.append(dot);
      return dot;
    });

    function showSlide(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        const active = slideIndex === index;
        slide.classList.toggle('is-active', active);
        slide.setAttribute('aria-hidden', String(!active));
        dots[slideIndex].setAttribute('aria-selected', String(active));
        dots[slideIndex].tabIndex = active ? 0 : -1;
      });
    }

    function stop() {
      window.clearInterval(timer);
      timer = null;
    }

    function start() {
      if (manuallyPaused || reducedMotion || timer) return;
      timer = window.setInterval(() => showSlide(index + 1), 6500);
    }

    function restart() {
      stop();
      start();
    }

    carousel.querySelector('[data-prev]').addEventListener('click', () => {
      showSlide(index - 1);
      restart();
    });
    carousel.querySelector('[data-next]').addEventListener('click', () => {
      showSlide(index + 1);
      restart();
    });
    pauseButton.addEventListener('click', () => {
      manuallyPaused = !manuallyPaused;
      pauseButton.setAttribute('aria-pressed', String(manuallyPaused));
      pauseButton.firstElementChild.textContent = manuallyPaused ? '▶' : 'Ⅱ';
      pauseLabel.textContent = manuallyPaused ? '再生' : '停止';
      manuallyPaused ? stop() : start();
    });
    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    carousel.addEventListener('focusin', stop);
    carousel.addEventListener('focusout', (event) => {
      if (!carousel.contains(event.relatedTarget)) start();
    });
    showSlide(0);
    start();
  }

  const menuButton = document.querySelector('.menu-button');
  const mobileMenu = document.querySelector('#mobile-menu');
  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!open));
      mobileMenu.hidden = open;
    });
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        menuButton.setAttribute('aria-expanded', 'false');
        mobileMenu.hidden = true;
      });
    });
  }

  const contactPanel = document.querySelector('#contact');
  const mobileSticky = document.querySelector('.mobile-sticky');
  if (contactPanel && mobileSticky && 'IntersectionObserver' in window) {
    const contactObserver = new IntersectionObserver(([entry]) => {
      mobileSticky.classList.toggle('is-contact-visible', entry.isIntersecting);
    }, { threshold: 0.08 });
    contactObserver.observe(contactPanel);
  }

  const form = document.querySelector('[data-contact-form]');
  const confirmation = document.querySelector('[data-form-confirmation]');
  const errorMessage = document.querySelector('[data-form-error]');
  const purposeCards = document.querySelectorAll('[data-purpose]');
  const formSteps = form ? [...form.querySelectorAll('[data-form-step]')] : [];
  const stepIndicators = form ? [...form.querySelectorAll('[data-step-indicator]')] : [];

  const getField = (name) => form?.querySelector(`[name="${name}"]`);
  const getCheckedField = (name) => form?.querySelector(`[name="${name}"]:checked`);

  const clearFieldError = (name) => {
    if (!form) return;
    const error = form.querySelector(`[data-error-for="${name}"]`);
    const group = form.querySelector(`[data-field-group="${name}"]`);
    const fields = form.querySelectorAll(`[name="${name}"]`);
    if (error) error.hidden = true;
    if (group) group.removeAttribute('data-invalid');
    fields.forEach((field) => field.removeAttribute('aria-invalid'));
  };

  const showFieldError = (name) => {
    if (!form) return;
    const error = form.querySelector(`[data-error-for="${name}"]`);
    const group = form.querySelector(`[data-field-group="${name}"]`);
    const fields = form.querySelectorAll(`[name="${name}"]`);
    if (error) error.hidden = false;
    if (group) group.setAttribute('data-invalid', 'true');
    fields.forEach((field) => field.setAttribute('aria-invalid', 'true'));
  };

  const focusField = (name) => {
    const group = form?.querySelector(`[data-field-group="${name}"]`);
    const target = group?.querySelector('input') || getField(name);
    target?.focus({ preventScroll: true });
    target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const showStep = (stepNumber, { focus = true } = {}) => {
    formSteps.forEach((step) => {
      step.hidden = Number(step.dataset.formStep) !== stepNumber;
    });
    stepIndicators.forEach((indicator) => {
      const indicatorNumber = Number(indicator.dataset.stepIndicator);
      indicator.classList.toggle('is-current', indicatorNumber === stepNumber);
      indicator.classList.toggle('is-complete', indicatorNumber < stepNumber);
      if (indicatorNumber === stepNumber) indicator.setAttribute('aria-current', 'step');
      else indicator.removeAttribute('aria-current');
    });
    if (errorMessage) errorMessage.hidden = true;
    if (focus) {
      const firstFieldName = stepNumber === 1 ? 'propertyType' : 'purpose';
      window.setTimeout(() => focusField(firstFieldName), 100);
    }
  };

  const fieldIsValid = (name) => {
    const radioNames = ['propertyType', 'purpose', 'contactMethod'];
    if (radioNames.includes(name)) return Boolean(getCheckedField(name));

    const field = getField(name);
    const value = field?.value.trim() || '';
    if (!value) return false;

    if (name === 'contact') {
      const digits = value.replace(/\D/g, '');
      return digits.length === 10 || digits.length === 11;
    }
    if (name === 'email') return field.validity.valid;
    return true;
  };

  const validateFields = (fieldNames) => {
    let firstInvalid = '';
    fieldNames.forEach((name) => {
      clearFieldError(name);
      if (!fieldIsValid(name)) {
        showFieldError(name);
        if (!firstInvalid) firstInvalid = name;
      }
    });
    if (firstInvalid) focusField(firstInvalid);
    return !firstInvalid;
  };

  purposeCards.forEach((card) => {
    card.addEventListener('click', () => {
      const selected = form?.querySelector(`input[name="purpose"][value="${card.dataset.purpose}"]`);
      if (selected) {
        selected.checked = true;
        clearFieldError('purpose');
      }
      document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.setTimeout(() => document.querySelector('#prefecture')?.focus({ preventScroll: true }), 500);
    });
  });

  if (form && confirmation) {
    const stepOneFields = ['propertyType', 'prefecture', 'city', 'area'];
    const stepTwoFields = ['purpose', 'name', 'contact', 'email', 'contactMethod'];

    form.querySelector('[data-next-step]')?.addEventListener('click', () => {
      if (!validateFields(stepOneFields)) return;
      showStep(2);
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    form.querySelector('[data-prev-step]')?.addEventListener('click', () => {
      showStep(1, { focus: false });
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.setTimeout(() => getField('area')?.focus({ preventScroll: true }), 350);
    });

    form.querySelectorAll('input, select, textarea').forEach((field) => {
      const clear = () => clearFieldError(field.name);
      field.addEventListener('input', clear);
      field.addEventListener('change', clear);
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!validateFields(stepTwoFields)) {
        if (errorMessage) errorMessage.hidden = false;
        return;
      }

      const summary = confirmation.querySelector('[data-confirmation-summary]');
      const values = [
        ['物件種別', getCheckedField('propertyType')?.value],
        ['物件の所在地', [getField('prefecture')?.value, getField('city')?.value.trim(), getField('area')?.value.trim()].filter(Boolean).join(' ')],
        ['相談の目的', getCheckedField('purpose')?.value],
        ['お名前', getField('name')?.value.trim()],
        ['電話番号', getField('contact')?.value.trim()],
        ['メールアドレス', getField('email')?.value.trim()],
        ['希望する連絡方法', getCheckedField('contactMethod')?.value],
        ['状況・お悩み', getField('message')?.value.trim() || '未入力']
      ];

      if (summary) {
        summary.replaceChildren();
        values.forEach(([label, value]) => {
          const row = document.createElement('div');
          const term = document.createElement('dt');
          const detail = document.createElement('dd');
          term.textContent = label;
          detail.textContent = value;
          row.append(term, detail);
          summary.append(row);
        });
      }

      if (errorMessage) errorMessage.hidden = true;
      form.hidden = true;
      confirmation.hidden = false;
      confirmation.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    confirmation.querySelector('[data-edit-form]')?.addEventListener('click', () => {
      confirmation.hidden = true;
      form.hidden = false;
      showStep(2, { focus: false });
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.setTimeout(() => getField('name')?.focus({ preventScroll: true }), 350);
    });
  }
})();
