/* ================= OSD ================= */
const osdEl = el('', stage, '', '', 'div'); osdEl.id = 'osd';
let osdTimer = 0;
function osd(text, ms) {
  osdEl.textContent = text;
  osdEl.classList.add('show');
  clearTimeout(osdTimer);
  osdTimer = setTimeout(() => osdEl.classList.remove('show'), ms || 1200);
}
