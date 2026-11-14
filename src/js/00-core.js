const W = 1000, H = 500;
const stage = document.getElementById('stage');
const chassis = document.getElementById('chassis');
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const px = n => n + 'px';

function el(cls, parent, css, txt, tag) {
  const e = document.createElement(tag || 'div');
  if (cls) e.className = cls;
  if (css) e.style.cssText = css;
  if (txt != null) e.textContent = txt;
  (parent || chassis).appendChild(e);
  return e;
}
function rect(e, x, y, w, h) {
  e.style.left = px(x); e.style.top = px(y);
  if (w != null) e.style.width = px(w);
  if (h != null) e.style.height = px(h);
  return e;
}
function lab(text, x, y, o) {
  o = o || {};
  const e = el('lab' + (o.cls ? ' ' + o.cls : ''), o.parent, '', text);
  e.style.left = px(x); e.style.top = px(y);
  if (o.s) e.style.fontSize = px(o.s);
  if (o.c) e.style.color = o.c;
  if (o.w) e.style.fontWeight = o.w;
  if (o.ls != null) e.style.letterSpacing = o.ls + 'em';
  const tx = o.a === 'l' ? 0 : o.a === 'r' ? -100 : -50;
  e.style.transform = 'translate(' + tx + '%,-50%)' + (o.rot ? ' rotate(' + o.rot + 'deg)' : '');
  return e;
}
const NS = 'http://www.w3.org/2000/svg';
function svgEl(name, attrs, parent) {
  const e = document.createElementNS(NS, name);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}
