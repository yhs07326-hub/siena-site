/* Non-PII interaction tracking for SIENA. */
(function () {
  function on(selector, type, handler) {
    document.querySelectorAll(selector).forEach(function (element) {
      element.addEventListener(type, handler);
    });
  }

  function track(name, params) {
    if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
  }

  function linkUrl(element) {
    return element.getAttribute('href') || '';
  }

  on('[data-ga-nav]', 'click', function () {
    track('nav_click', {
      menu_name: this.getAttribute('data-ga-nav'),
      nav_location: this.getAttribute('data-ga-location') || '',
      link_url: linkUrl(this)
    });
  });

  on('[data-ga-cta]', 'click', function () {
    track('cta_click', {
      cta_location: this.getAttribute('data-ga-cta'),
      cta_text: (this.textContent || '').trim(),
      target_section: this.getAttribute('href') || ''
    });
  });

  on('[data-portfolio-action]', 'click', function () {
    track('portfolio_action', {
      action_type: this.getAttribute('data-portfolio-action'),
      portfolio_location: this.getAttribute('data-portfolio-location') || ''
    });
  });

  on('[data-content-id]', 'click', function () {
    track('select_content', {
      content_type: this.getAttribute('data-content-type'),
      content_id: this.getAttribute('data-content-id'),
      content_title: this.getAttribute('data-content-title'),
      content_position: Number(this.getAttribute('data-content-position'))
    });
  });

  on('[data-ga-social]', 'click', function () {
    track('social_click', {
      social_platform: this.getAttribute('data-ga-social'),
      link_url: linkUrl(this)
    });
  });
})();
