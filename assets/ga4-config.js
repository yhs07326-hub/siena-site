/* SIENA GA4 configuration. Keep the measurement ID in this file only. */
var GA4_MEASUREMENT_ID = 'G-464JXZ7MDB';

(function () {
  var id = (GA4_MEASUREMENT_ID || '').trim();
  if (!/^G-[A-Z0-9]+$/.test(id)) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
  document.head.appendChild(script);

  window.gtag('js', new Date());
  window.gtag('config', id, { debug_mode: true });
})();
