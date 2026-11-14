/* ---- PWA bits ---- */
(function pwa() {
  try {
    const c = document.createElement('canvas'); c.width = c.height = 512;
    const g = c.getContext('2d');
    let gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, '#2b2d34'); gr.addColorStop(1, '#0d0e11');
    g.fillStyle = gr; g.fillRect(0, 0, 512, 512);
    gr = g.createRadialGradient(215, 190, 20, 256, 240, 190); gr.addColorStop(0, '#6a6d76'); gr.addColorStop(.55, '#2c2e34'); gr.addColorStop(1, '#101114');
    g.fillStyle = gr; g.beginPath(); g.arc(256, 236, 170, 0, 7); g.fill();
    g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 3; g.stroke();
    g.strokeStyle = '#d9dade'; g.lineWidth = 7; g.lineCap = 'round';
    for (let i = 0; i <= 10; i++) { const a = (-135 + i * 27) * Math.PI / 180; g.beginPath(); g.moveTo(256 + 186 * Math.sin(a), 236 - 186 * Math.cos(a)); g.lineTo(256 + 208 * Math.sin(a), 236 - 208 * Math.cos(a)); g.stroke(); }
    g.strokeStyle = '#f4f3ee'; g.lineWidth = 16; const ia = 40 * Math.PI / 180;
    g.beginPath(); g.moveTo(256 + 60 * Math.sin(ia), 236 - 60 * Math.cos(ia)); g.lineTo(256 + 140 * Math.sin(ia), 236 - 140 * Math.cos(ia)); g.stroke();
    g.shadowColor = 'rgba(255,70,50,.95)'; g.shadowBlur = 40; g.fillStyle = '#ff4a35'; g.beginPath(); g.arc(256, 450, 17, 0, 7); g.fill();
    const icon = c.toDataURL('image/png');
    const l = document.createElement('link'); l.rel = 'apple-touch-icon'; l.href = icon; document.head.appendChild(l);
    const mf = { name: 'ZION 303 Pocket Bass', short_name: 'ZION 303', start_url: './', display: 'standalone', orientation: 'landscape', background_color: '#0b0c0f', theme_color: '#0b0c0f', icons: [{ src: icon, sizes: '512x512', type: 'image/png' }] };
    const m = document.createElement('link'); m.rel = 'manifest'; m.href = URL.createObjectURL(new Blob([JSON.stringify(mf)], { type: 'application/manifest+json' })); document.head.appendChild(m);
    if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) navigator.serviceWorker.register('sw.js').catch(() => { });
  } catch (e) { /* ignore */ }
})();
