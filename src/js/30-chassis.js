/* ================= chassis layout ================= */
const bands = [
  ['top:0;height:97px;background:linear-gradient(rgba(255,255,255,.20),rgba(255,255,255,0))'],
  ['top:100px;height:139px;background:linear-gradient(rgba(0,0,0,.07),rgba(0,0,0,.02))'],
  ['top:242px;bottom:0;background:linear-gradient(rgba(0,0,0,.04),rgba(0,0,0,.10))']
];
bands.forEach(b => el('band', chassis, b[0]));
el('groove', chassis, 'top:96px');
el('groove', chassis, 'top:226px');
el('vline', chassis, 'left:262px;top:6px;height:86px');
el('vline', chassis, 'left:738px;top:6px;height:86px');

/* ---- LED registry ---- */
function led(x, y, cls, parent) {
  const e = el('led' + (cls ? ' ' + cls : ''), parent, '');
  e.style.left = px(x); e.style.top = px(y);
  return e;
}
const L = { keys: [], steps: [], sel: [] };
