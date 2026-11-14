/* ---- knobs ---- */
function mkKnob(o) {
  const d = o.d, pad = 18, size = d + pad * 2;
  const k = el('knob' + (o.sel ? ' sel' : ''), chassis, 'left:' + (o.x - d / 2) + 'px;top:' + (o.y - d / 2) + 'px;width:' + d + 'px;height:' + d + 'px');
  if (o.name) k.dataset.id = 'k-' + o.name;
  const svg = svgEl('svg', { class: 'kticks', viewBox: (-size / 2) + ' ' + (-size / 2) + ' ' + size + ' ' + size });
  svg.style.cssText = 'left:' + (-pad) + 'px;top:' + (-pad) + 'px;width:' + size + 'px;height:' + size + 'px';
  const angles = o.angles || Array.from({ length: 11 }, (_, i) => -135 + i * 27);
  angles.forEach((a, i) => {
    const big = o.angles ? true : (i % 5 === 0);
    const r1 = d / 2 + 4, r2 = d / 2 + (big ? 11 : 7.5), rad = a * Math.PI / 180;
    svgEl('line', {
      x1: r1 * Math.sin(rad), y1: -r1 * Math.cos(rad), x2: r2 * Math.sin(rad), y2: -r2 * Math.cos(rad),
      'stroke-width': big ? 1.7 : 1.1, 'stroke-linecap': 'round'
    }, svg);
  });
  k.appendChild(svg);
  el('kshadow', k); el('kbase', k);
  const body = el('kbody', k);
  const rotA = el('krot', body); el('kridge', rotA);
  el('kcap', body);
  const rotB = el('krot', body); el('kind', rotB);
  el('kgloss', body);
  if (o.angles) k.classList.add('st');
  const n = o.angles ? o.angles.length : 0;
  let v = o.value;
  if (n) v = Math.round(clamp(v, 0, 1) * (n - 1)) / (n - 1);
  const api = { el: k, get value() { return v; }, get index() { return n ? Math.round(v * (n - 1)) : 0; } };
  function render() { const t = 'rotate(' + (n ? o.angles[api.index] : -135 + v * 270) + 'deg)'; rotA.style.transform = t; rotB.style.transform = t; }
  api.set = function (nv, silent) {
    nv = clamp(nv, 0, 1);
    if (n) nv = Math.round(nv * (n - 1)) / (n - 1);
    const changed = nv !== v;
    v = nv; render();
    if (!silent && changed && o.onChange) o.onChange(v, api);
  };
  api.setIndex = (i, silent) => api.set(n > 1 ? i / (n - 1) : 0, silent);
  render();

  let drag = null, lastTap = 0;
  k.addEventListener('pointerdown', e => {
    e.preventDefault();
    if (drag) return;
    try { k.setPointerCapture(e.pointerId); } catch (_) { }
    drag = { id: e.pointerId, x: e.clientX, y: e.clientY, v0: v, i0: api.index, moved: false };
    k.classList.add('active');
  });
  k.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (Math.abs(dx) + Math.abs(dy) > 5) drag.moved = true;
    if (!drag.moved) return;
    const l = toLocal(dx, dy);
    if (n) api.setIndex(clamp(drag.i0 + Math.round(-l.y / 30), 0, n - 1));
    else api.set(drag.v0 - l.y / 150);
  });
  const end = e => {
    if (!drag || e.pointerId !== drag.id) return;
    const d0 = drag; drag = null;
    k.classList.remove('active');
    if (!d0.moved && e.type === 'pointerup') {
      const now = performance.now();
      if (n) api.setIndex((api.index + 1) % n);
      else if (now - lastTap < 320 && o.def != null) api.set(o.def);
      lastTap = now;
    }
  };
  k.addEventListener('pointerup', end);
  k.addEventListener('pointercancel', end);
  k.addEventListener('wheel', e => { e.preventDefault(); if (n) api.setIndex(clamp(api.index + (e.deltaY < 0 ? 1 : -1), 0, n - 1)); else api.set(v - e.deltaY / 900); }, { passive: false });
  return api;
}
