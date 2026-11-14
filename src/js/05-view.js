/* ================= view / fit ================= */
const view = { s: 1, rot: 0 };
function fit() {
  const vw = window.innerWidth, vh = window.innerHeight;
  const portrait = vh > vw * 1.08;
  let s;
  if (portrait) {
    s = Math.min(vh / W, vw / H) * 0.985;
    s = Math.min(s, 2.2);
    view.rot = 90;
    const tx = (vw + H * s) / 2, ty = (vh - W * s) / 2;
    stage.style.transform = 'translate(' + tx + 'px,' + ty + 'px) rotate(90deg) scale(' + s + ')';
  } else {
    s = Math.min(vw / W, vh / H) * 0.985;
    s = Math.min(s, 2.2);
    view.rot = 0;
    const tx = (vw - W * s) / 2, ty = (vh - H * s) / 2;
    stage.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + s + ')';
  }
  view.s = s;
}
function toLocal(dx, dy) {
  return view.rot === 90 ? { x: dy / view.s, y: -dx / view.s } : { x: dx / view.s, y: dy / view.s };
}
