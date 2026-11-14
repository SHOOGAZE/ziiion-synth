/* ================= chassis layout ================= */
const bands = [
  ['top:0;height:97px;background:linear-gradient(rgba(255,255,255,.20),rgba(255,255,255,0))'],
  ['top:100px;height:126px;background:linear-gradient(rgba(0,0,0,.07),rgba(0,0,0,.02))'],
  ['top:229px;bottom:0;background:linear-gradient(rgba(0,0,0,.04),rgba(0,0,0,.10))']
];
bands.forEach(b => el('band', chassis, b[0]));
el('sheen', chassis, '');
// etched lines and screws
[26, 933].forEach(x => { for (let i = 0; i < 4; i++) el('etch', chassis, 'left:' + x + 'px;top:' + (146 + i * 9) + 'px'); });
[[10, 478, 60], [980, 478, -15]].forEach(c => el('screw', chassis, 'left:' + c[0] + 'px;top:' + c[1] + 'px;--r:' + c[2] + 'deg'));
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
