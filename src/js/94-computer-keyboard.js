/* ---- computer keyboard ---- */
const KMAP = { a: 0, w: 1, s: 2, e: 3, d: 4, f: 5, t: 6, g: 7, y: 8, h: 9, u: 10, j: 11, k: 12 };
const kdown = {};
window.addEventListener('keydown', e => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const key = e.key.toLowerCase();
  if (key === ' ') { e.preventDefault(); if (!e.repeat && engine.ready) toggleRun(); return; }
  if (key in KMAP && !e.repeat) { const n = KMAP[key]; kdown[key] = 1; keyEls[n].classList.add('down'); keyDown(n, 'k' + key); }
});
window.addEventListener('keyup', e => {
  const key = e.key.toLowerCase();
  if (key in KMAP && kdown[key]) { delete kdown[key]; const n = KMAP[key]; keyEls[n].classList.remove('down'); keyUp(n, 'k' + key); }
});
