/* ================= OSD ================= */
const osdEl = el('', stage, '', '', 'div'); osdEl.id = 'osd';
let osdTimer = 0;
let dmHook = null; // set by the dot-matrix display
let splashHook = null; // boot animation, set by the display
function osd(text, ms) {
  osdEl.textContent = text;
  if (dmHook && dmHook(text, ms || 1200)) return;
  osdEl.classList.add('show');
  clearTimeout(osdTimer);
  osdTimer = setTimeout(() => osdEl.classList.remove('show'), ms || 1200);
}
