/*
  신청 폼 처리. 입력값은 어디로도 보내지 않습니다.
  - 폼 입력칸에는 name 속성이 없어서, 스크립트가 꺼져 있어도 값이 주소창·서버로 넘어가지 않습니다.
  - 제출 → 개인정보 안내 팝업 → 동의 → 입력값 즉시 삭제 → result.html 이동.
  - 나중에 폼을 Make·구글시트 등에 연결하면 팝업 문구(index.html의 #privacy-modal)를 반드시 고쳐야 합니다.
*/
(function () {
  var form = document.getElementById('lead-form');
  var modal = document.getElementById('privacy-modal');
  if (!modal) return;
  var agree = document.getElementById('privacy-agree');
  var ok = document.getElementById('privacy-ok');
  var cancel = document.getElementById('privacy-cancel');
  var mode = 'info';
  var privacySource = 'unknown';

  function track(name, params) {
    if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
    if (!window.fbq || name === 'page_view' || name.indexOf('scroll') !== -1) return;

    var metaEventNames = {
      generate_lead: 'Lead',
      sign_up: 'CompleteRegistration',
      contact_click: 'Contact',
      view_item: 'ViewContent',
      add_to_cart: 'AddToCart',
      begin_checkout: 'InitiateCheckout',
      purchase: 'Purchase',
      search: 'Search'
    };
    var metaName = metaEventNames[name];

    if (metaName === 'Purchase') {
      fbq('track', 'Purchase', {
        value: params && params.value != null ? params.value : 0,
        currency: 'KRW'
      });
    } else if (metaName) {
      fbq('track', metaName);
    } else {
      fbq('trackCustom', name);
    }
  }

  function wipe() {
    if (!form) return;
    form.querySelectorAll('input, select, textarea').forEach(function (el) {
      if (el.type === 'checkbox' || el.type === 'radio') el.checked = false;
      else el.value = '';
    });
    form.reset();
  }

  function open(m, source) {
    mode = m;
    privacySource = source || 'unknown';
    agree.checked = false;
    ok.disabled = true;
    ok.textContent = m === 'submit' ? '동의하고 완료하기' : '확인했습니다';
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    agree.focus();
    track('privacy_notice_action', { action_type: 'open', privacy_source: privacySource });
  }

  function close(action) {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    if (action) track('privacy_notice_action', { action_type: action, privacy_source: privacySource });
  }

  agree.addEventListener('change', function () { ok.disabled = !agree.checked; });
  cancel.addEventListener('click', function () { close('close_button'); });
  modal.addEventListener('click', function (e) { if (e.target === modal) close('dismiss_background'); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close('dismiss_escape'); });

  ok.addEventListener('click', function () {
    if (mode !== 'submit') { close(); return; }
    wipe();
    // 분석 도구를 붙였다면 여기서 개인정보 없이 이벤트 이름만 보냅니다 (Day 34~35).
    if (typeof window.gtag === 'function') window.gtag('event', 'generate_lead');
    if (window.fbq) fbq('track', 'Lead');
    location.replace('result.html');
  });

  document.querySelectorAll('[data-privacy-open]').forEach(function (b) {
    b.addEventListener('click', function (e) {
      e.preventDefault();
      open('info', b.getAttribute('data-privacy-source') || 'unknown');
    });
  });

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      open('submit', 'form_submit');
    });
  }

  // 검토 메모 패널 닫기 (검토용 빌드에만 있음)
  var rp = document.querySelector('.review-panel button');
  if (rp) rp.addEventListener('click', function () { rp.parentNode.remove(); });
})();
