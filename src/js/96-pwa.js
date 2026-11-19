/* ---- PWA bits ---- */
(function pwa() {
  try {
    const icon = '/*{{ICON}}*/';
    const l = document.createElement('link'); l.rel = 'apple-touch-icon'; l.href = icon; document.head.appendChild(l);
    const mf = { name: 'ZIIION Pocket Bass', short_name: 'ZIIION', start_url: './', display: 'standalone', orientation: 'landscape', background_color: '#0b0c0f', theme_color: '#0b0c0f', icons: [{ src: icon, sizes: '512x512', type: 'image/png' }] };
    const m = document.createElement('link'); m.rel = 'manifest'; m.href = URL.createObjectURL(new Blob([JSON.stringify(mf)], { type: 'application/manifest+json' })); document.head.appendChild(m);
    if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) navigator.serviceWorker.register('sw.js').catch(() => { });
  } catch (e) { /* ignore */ }
})();
