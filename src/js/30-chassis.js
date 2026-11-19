/* ================= chassis layout ================= */
// screws
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
