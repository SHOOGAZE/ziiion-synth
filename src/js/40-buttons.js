/* ---- buttons ---- */
function mkBtn(o) {
  const slot = el('slot', chassis);
  rect(slot, o.x - 3, o.y - 3, o.w + 6, o.h + 6);
  const b = el('btn' + (o.cls ? ' ' + o.cls : ''), chassis, '', o.text || '');
  if (o.id) b.dataset.id = o.id;
  rect(b, o.x, o.y, o.w, o.h);
  let pid = null;
  b.addEventListener('pointerdown', e => {
    e.preventDefault();
    if (pid !== null) return;
    pid = e.pointerId;
    try { b.setPointerCapture(pid); } catch (_) { }
    b.classList.add('down');
    if (o.down) o.down(e);
  });
  const up = e => {
    if (e.pointerId !== pid) return;
    pid = null; b.classList.remove('down');
    if (o.up) o.up(e, e.type === 'pointercancel');
  };
  b.addEventListener('pointerup', up);
  b.addEventListener('pointercancel', up);
  return b;
}
function mkSwitch(x, y, on, onChange) {
  const s = el('sw' + (on ? ' on' : ''), chassis, 'left:' + x + 'px;top:' + y + 'px');
  el('slot2', s); el('tab', s);
  s.addEventListener('pointerdown', e => { e.preventDefault(); s.classList.toggle('on'); onChange(s.classList.contains('on') ? 1 : 0); });
  return s;
}
function jack(x, y, name, sm) {
  el('jack' + (sm ? ' sm' : ''), chassis, 'left:' + x + 'px;top:' + y + 'px');
  lab(name, x, 14, { cls: 'sm' });
}
