/* ---- 7-segment BPM display (TB-03 style) ---- */
const SEG = { 0: 'abcdef', 1: 'bc', 2: 'abdeg', 3: 'abcdg', 4: 'bcfg', 5: 'acdfg', 6: 'acdefg', 7: 'abc', 8: 'abcdefg', 9: 'abcdfg', ' ': '' };
const segDisp = (function () {
  const W = 92, H = 38, box = el('lcd', chassis, 'left:562px;top:150px;width:' + W + 'px;height:' + H + 'px');
  const svg = svgEl('svg', { viewBox: '0 0 94 38', width: W, height: H }); box.appendChild(svg);
  const hs = 1.5; // half thickness
  const hz = (x1, x2, y) => [[x1, y], [x1 + hs, y - hs], [x2 - hs, y - hs], [x2, y], [x2 - hs, y + hs], [x1 + hs, y + hs]].map(p => p.join(',')).join(' ');
  const vt = (x, y1, y2) => [[x, y1], [x + hs, y1 + hs], [x + hs, y2 - hs], [x, y2], [x - hs, y2 - hs], [x - hs, y1 + hs]].map(p => p.join(',')).join(' ');
  const L = 2.5, R = 14.5, T = 2, M = 14, B = 26;
  const P = {
    a: hz(L + 2, R - 2, T), g: hz(L + 2, R - 2, M), d: hz(L + 2, R - 2, B),
    f: vt(L, T + 2, M - 2), b: vt(R, T + 2, M - 2), e: vt(L, M + 2, B - 2), c: vt(R, M + 2, B - 2)
  };
  const xs = [5, 26, 47, 74], digits = [];
  xs.forEach(x => {
    const g = svgEl('g', { transform: 'translate(' + x + ',5) skewX(-4)' });
    const segs = {};
    Object.keys(P).forEach(k => { segs[k] = svgEl('polygon', { points: P[k], class: 'sg' }); g.appendChild(segs[k]); });
    svg.appendChild(g); digits.push(segs);
  }); 
  svg.appendChild(svgEl('circle', { cx: 66.5, cy: 30, r: 1.9, class: 'sg on' }));
  return function show(txt) { // txt: 4 chars, e.g. '1260' → 126.0
    for (let i = 0; i < 4; i++) {
      const on = SEG[txt[i]] || '';
      Object.keys(digits[i]).forEach(k => digits[i][k].setAttribute('class', 'sg' + (on.indexOf(k) >= 0 ? ' on' : (i === 0 ? ' x' : ''))));
    }
  };
})();
let lastBpmTxt = '';
setInterval(() => {
  const b = bpmOf(S.k.tempo), t = String(b).padStart(3, ' ') + '0';
  if (t !== lastBpmTxt) { lastBpmTxt = t; segDisp(t); }
}, 120);

lab('VOLUME', 886, 107);
knobs.vol = mkKnob({
  name: 'vol', x: 886, y: MY, d: 74, value: S.k.vol, def: DEF.vol,
  onChange: v => { S.k.vol = v; send(paramMsg()); save(); osd('VOLUME  ' + Math.round(v * 100) + '%', 900); }
});
lab('MIN', 848, 216, { cls: 'sm' }); lab('MAX', 924, 216, { cls: 'sm' });
