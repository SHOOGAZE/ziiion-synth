/* ================= body: PCB layer under frosted plastic, chrome rim, haze, dot-matrix display ================= */
(function () {
  /* ---------- seeded random ---------- */
  let seed = 303;
  const rnd = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
  const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1));

  /* ---------- chrome rim around the frosted body ---------- */
  const rim = el('rim', stage, '');
  stage.insertBefore(rim, chassis);

  /* ---------- PCB under the frosted body ---------- */
  const TR = '#59616c', PAD = '#4f5762';
  let svg = '';
  const path = pts => 'M' + pts.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L');
  function offsetPath(pts, d) {
    return pts.map((p, i) => {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
      let dx = b[0] - a[0], dy = b[1] - a[1]; const l = Math.hypot(dx, dy) || 1;
      return [p[0] - dy / l * d, p[1] + dx / l * d];
    });
  }
  function bus(x, y, n, steps, dirs) {
    // a bundle of parallel traces that runs straight, jogs at 45 degrees, runs straight again
    const c = [[x, y]]; let dir = dirs[0];
    for (let i = 0; i < steps; i++) {
      const len = i % 2 === 0 ? ri(70, 230) : ri(18, 44);
      const [vx, vy] = i % 2 === 0 ? dir : [dir[0] + (dir[0] === 0 ? (rnd() < .5 ? 1 : -1) : 0), dir[1] + (dir[1] === 0 ? (rnd() < .5 ? 1 : -1) : 0)];
      const last = c[c.length - 1], k = i % 2 === 0 ? 1 : 0.7071;
      c.push([last[0] + vx * len * k, last[1] + vy * len * k]);
    }
    const sp = 4.6;
    for (let j = 0; j < n; j++) {
      const o = offsetPath(c, (j - (n - 1) / 2) * sp);
      svg += '<path d="' + path(o) + '" fill="none" stroke="' + TR + '" stroke-width="1.7" stroke-linejoin="round"/>';
      const e = o[o.length - 1], s0 = o[0];
      svg += '<circle cx="' + e[0].toFixed(1) + '" cy="' + e[1].toFixed(1) + '" r="2.3" fill="none" stroke="' + PAD + '" stroke-width="1.2"/>';
      if (rnd() < .5) svg += '<circle cx="' + s0[0].toFixed(1) + '" cy="' + s0[1].toFixed(1) + '" r="1.7" fill="' + PAD + '"/>';
    }
  }
  const H = [1, 0], V = [0, 1];
  [[0, 118, 6, 4, [H]], [0, 232, 5, 4, [H]], [1000, 150, 7, 4, [[-1, 0]]], [1000, 340, 4, 4, [[-1, 0]]],
   [120, 0, 4, 4, [V]], [640, 0, 5, 4, [V]], [880, 500, 6, 4, [[0, -1]]], [300, 500, 5, 4, [[0, -1]]],
   [0, 330, 3, 4, [H]], [1000, 60, 4, 4, [[-1, 0]]], [500, 500, 4, 4, [[0, -1]]], [0, 60, 5, 4, [H]],
   [560, 226, 6, 3, [H]], [840, 226, 5, 3, [[-1, 0]]], [560, 100, 5, 3, [H]], [840, 100, 4, 3, [[-1, 0]]]].forEach(b => bus.apply(null, b));
  for (let i = 0; i < 70; i++) svg += '<circle cx="' + ri(8, 992) + '" cy="' + ri(8, 492) + '" r="' + (rnd() < .3 ? 2.2 : 1.5) + '" fill="none" stroke="' + PAD + '" stroke-width="1"/>';

  function chip(x, y, w, h, name, pin) {
    svg += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="2.5" fill="#c3c8ce" stroke="' + TR + '" stroke-width="1.3"/>';
    for (let p = 5; p < w - 3; p += pin) svg += '<path d="M' + (x + p) + ' ' + (y - 3.5) + 'v3.5M' + (x + p) + ' ' + (y + h) + 'v3.5" stroke="' + TR + '" stroke-width="1.3"/>';
    for (let p = 5; p < h - 3; p += pin) svg += '<path d="M' + (x - 3.5) + ' ' + (y + p) + 'h3.5M' + (x + w) + ' ' + (y + p) + 'h3.5" stroke="' + TR + '" stroke-width="1.3"/>';
    svg += '<circle cx="' + (x + 5) + '" cy="' + (y + 5) + '" r="1.6" fill="' + TR + '"/><text x="' + (x + w / 2) + '" y="' + (y + h / 2 + 2.2) + '" text-anchor="middle" font-size="6.5" font-family="ui-monospace,Menlo,Consolas,monospace" fill="#69707a">' + name + '</text>';
  }
  const res = (x, y, v) => { svg += '<rect x="' + x + '" y="' + y + '" width="' + (v ? 5 : 11) + '" height="' + (v ? 11 : 5) + '" rx="1" fill="#bfc4ca" stroke="' + TR + '" stroke-width="1"/>'; };
  chip(28, 128, 52, 52, 'ZN-01', 6.5);
  chip(940, 130, 40, 40, 'DSP-1', 6.5);
  chip(938, 196, 30, 14, 'MX-4', 5);
  res(26, 196, 0); res(40, 196, 0); res(54, 196, 0); res(70, 192, 1); res(84, 150, 1); res(84, 164, 1);
  res(972, 190, 1); res(986, 190, 1); res(950, 182, 0);
  svg += '<rect x="243" y="298" width="20" height="112" rx="2" fill="#c3c8ce" stroke="' + TR + '" stroke-width="1.3"/>';
  for (let i = 0; i < 14; i++) svg += '<path d="M246 ' + (304 + i * 7.5) + 'h14" stroke="' + TR + '" stroke-width="1.2"/>';
  svg += '<rect x="652" y="300" width="18" height="86" rx="2" fill="#c3c8ce" stroke="' + TR + '" stroke-width="1.3"/>';
  for (let i = 0; i < 10; i++) svg += '<path d="M655 ' + (306 + i * 7.6) + 'h12" stroke="' + TR + '" stroke-width="1.2"/>';
  // crystal + coils
  svg += '<rect x="30" y="248" width="34" height="16" rx="8" fill="#c3c8ce" stroke="' + TR + '" stroke-width="1.3"/>';
  svg += '<circle cx="962" cy="262" r="9" fill="none" stroke="' + TR + '" stroke-width="1.3"/><circle cx="962" cy="262" r="4.5" fill="none" stroke="' + TR + '" stroke-width="1.1"/>';
  // silkscreen
  const tx = (x, y, t, r, sz) => { svg += '<text x="' + x + '" y="' + y + '" font-size="' + (sz || 6.2) + '" font-family="ui-monospace,Menlo,Consolas,monospace" letter-spacing=".6" fill="#4f5762"' + (r ? ' transform="rotate(' + r + ' ' + x + ' ' + y + ')"' : '') + '>' + t + '</text>'; };
  tx(13, 478, 'ZIIION  MODEL ZB-03  REV C', -90, 6.6);
  tx(12, 220, 'TP1  TP2  TP3', -90); tx(988, 224, 'J4  CN-FFC 16P', -90);
  tx(556, 224, 'R101  R102  C21  C22  L3', 0); tx(556, 112, 'U7 / U8   PWR-IN   GND', 0);
  tx(330, 224, '+ - + -', 0); tx(250, 296, 'FFC-A', 0);
  const pcb = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  pcb.setAttribute('viewBox', '0 0 1000 500'); pcb.setAttribute('class', 'pcb'); pcb.innerHTML = svg;
  chassis.insertBefore(pcb, chassis.firstChild);
  document.documentElement.style.setProperty('--pcb', 'url("data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 500" preserveAspectRatio="none">' + svg + '</svg>') + '")');
  const frost = el('frost', chassis, ''); chassis.insertBefore(frost, pcb.nextSibling);

  /* ---------- haze: the board fades out underneath the controls ---------- */
  function haze() {
    chassis.querySelectorAll('.knob,.btn,.wkey,.bkey,.sw').forEach(c => {
      const l = parseFloat(c.style.left), t = parseFloat(c.style.top), w = parseFloat(c.style.width) || c.offsetWidth, h = parseFloat(c.style.height) || c.offsetHeight;
      if (isNaN(l) || isNaN(t)) return;
      const hz = el('haze' + (c.classList.contains('knob') ? ' round' : ''), chassis, 'left:' + (l - 5) + 'px;top:' + (t - 5) + 'px;width:' + (w + 10) + 'px;height:' + (h + 10) + 'px');
      chassis.insertBefore(hz, frost.nextSibling);
    });
  }
  haze();

  /* ---------- red accent ---------- */
  const redsq = el('redsq', chassis, 'left:562px;top:104px');

  /* ---------- dot-matrix display ---------- */
  const COLS = 84, ROWS = 32, PITCH = 3, PAD_ = 6;
  const bz = el('dm', chassis, 'left:562px;top:114px;width:' + (COLS * PITCH + PAD_ * 2) + 'px;height:' + (ROWS * PITCH + PAD_ * 2) + 'px');
  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  const cv = document.createElement('canvas');
  cv.width = Math.round(COLS * PITCH * 2 * dpr / 1); cv.height = Math.round(ROWS * PITCH * 2 * dpr / 1);
  cv.style.cssText = 'position:absolute;left:' + PAD_ + 'px;top:' + PAD_ + 'px;width:' + COLS * PITCH + 'px;height:' + ROWS * PITCH + 'px';
  bz.appendChild(cv);
  el('dmglass', bz, '');
  const ctx = cv.getContext('2d'), K = cv.width / (COLS * PITCH); // pixels per css px
  const bg = document.createElement('canvas'); bg.width = cv.width; bg.height = cv.height;
  (function () { // unlit dots, drawn once
    const b = bg.getContext('2d'); b.fillStyle = '#1b1c20';
    b.beginPath();
    for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) { const cx = (x + .5) * PITCH * K, cy = (y + .5) * PITCH * K; b.moveTo(cx + 1.05 * K, cy); b.arc(cx, cy, 1.05 * K, 0, 6.283); }
    b.fill();
  })();

  const F = {
    '0': '01110 10001 10011 10101 11001 10001 01110', '1': '00100 01100 00100 00100 00100 00100 01110', '2': '01110 10001 00001 00010 00100 01000 11111',
    '3': '11110 00001 00001 01110 00001 00001 11110', '4': '00010 00110 01010 10010 11111 00010 00010', '5': '11111 10000 11110 00001 00001 10001 01110',
    '6': '00110 01000 10000 11110 10001 10001 01110', '7': '11111 00001 00010 00100 01000 01000 01000', '8': '01110 10001 10001 01110 10001 10001 01110',
    '9': '01110 10001 10001 01111 00001 00010 01100',
    A: '01110 10001 10001 11111 10001 10001 10001', B: '11110 10001 10001 11110 10001 10001 11110', C: '01110 10001 10000 10000 10000 10001 01110',
    D: '11100 10010 10001 10001 10001 10010 11100', E: '11111 10000 10000 11110 10000 10000 11111', F: '11111 10000 10000 11110 10000 10000 10000',
    G: '01110 10001 10000 10111 10001 10001 01111', H: '10001 10001 10001 11111 10001 10001 10001', I: '01110 00100 00100 00100 00100 00100 01110',
    J: '00111 00010 00010 00010 00010 10010 01100', K: '10001 10010 10100 11000 10100 10010 10001', L: '10000 10000 10000 10000 10000 10000 11111',
    M: '10001 11011 10101 10101 10001 10001 10001', N: '10001 10001 11001 10101 10011 10001 10001', O: '01110 10001 10001 10001 10001 10001 01110',
    P: '11110 10001 10001 11110 10000 10000 10000', Q: '01110 10001 10001 10001 10101 10010 01101', R: '11110 10001 10001 11110 10100 10010 10001',
    S: '01111 10000 10000 01110 00001 00001 11110', T: '11111 00100 00100 00100 00100 00100 00100', U: '10001 10001 10001 10001 10001 10001 01110',
    V: '10001 10001 10001 10001 10001 01010 00100', W: '10001 10001 10001 10101 10101 10101 01010', X: '10001 10001 01010 00100 01010 10001 10001',
    Y: '10001 10001 01010 00100 00100 00100 00100', Z: '11111 00001 00010 00100 01000 10000 11111',
    '.': '00000 00000 00000 00000 00000 01100 01100', ':': '00000 01100 01100 00000 01100 01100 00000', '-': '00000 00000 00000 11111 00000 00000 00000',
    '+': '00000 00100 00100 11111 00100 00100 00000', '#': '01010 01010 11111 01010 11111 01010 01010', '/': '00001 00010 00010 00100 01000 01000 10000',
    '%': '11001 11010 00010 00100 01000 01011 10011', '^': '00100 01010 10001 00000 00000 00000 00000', '~': '00000 00000 01000 10101 00010 00000 00000',
    '_': '00000 00000 00000 00000 00000 00000 11111', '>': '10000 01000 00100 00010 00100 01000 10000', '<': '00001 00010 00100 01000 00100 00010 00001',
    '*': '00000 00100 10101 01110 10101 00100 00000', '=': '00000 00000 11111 00000 11111 00000 00000', ' ': '00000 00000 00000 00000 00000 00000 00000',
    '(': '00010 00100 01000 01000 01000 00100 00010', ')': '01000 00100 00010 00010 00010 00100 01000', '!': '00100 00100 00100 00100 00100 00000 00100',
    '?': '01110 10001 00001 00010 00100 00000 00100', "'": '00100 00100 01000 00000 00000 00000 00000', '|': '00100 00100 00100 00100 00100 00100 00100'
  };
  const G = {}; Object.keys(F).forEach(k => { G[k] = F[k].split(' ').map(r => r.split('').map(c => c === '1')); });
  const supported = s => s.split('').every(c => G[c.toUpperCase()]);

  let msg = '', msgTimer = 0;
  function dot(x, y, a) { // a = brightness 0..1
    if (x < 0 || y < 0 || x >= COLS || y >= ROWS) return;
    const cx = (x + .5) * PITCH * K, cy = (y + .5) * PITCH * K;
    ctx.fillStyle = a >= 1 ? '#f4f5f7' : 'rgba(244,245,247,' + a + ')';
    ctx.beginPath(); ctx.arc(cx, cy, 1.15 * K, 0, 6.283); ctx.fill();
  }
  function text(str, x, y, a, sc) { // returns end x
    sc = sc || 1;
    for (const ch of String(str).toUpperCase()) {
      const g = G[ch] || G['?'];
      for (let r = 0; r < 7; r++) for (let c = 0; c < 5; c++) if (g[r][c]) {
        for (let u = 0; u < sc; u++) for (let v = 0; v < sc; v++) dot(x + c * sc + u, y + r * sc + v, a == null ? 1 : a);
      }
      x += 6 * sc;
    }
    return x;
  }
  const width = (s, sc) => String(s).length * 6 * (sc || 1) - (sc || 1);

  let splashing = false;
  function draw() {
    if (splashing) return;
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.drawImage(bg, 0, 0);
    const bpm = String(bpmOf(S.k.tempo));
    const pat = curPat();
    let headStep = -1, headPat = pat;
    if (S.running && S.playIdx >= 0) { const m = playMap[S.playIdx]; if (m) { headPat = S.patterns[m[0]]; headStep = m[1]; } }
    const shown = headStep >= 0 ? headPat : pat;
    text('ZIIION', 0, 0, 1);
    if (msg) {
      text(bpm, COLS - width(bpm), 0, .55);
      const words = msg.split(/\s+/).filter(Boolean), lines = ['']; // wrap at 14 chars
      words.forEach(w => { const cur = lines[lines.length - 1]; if ((cur + ' ' + w).trim().length <= 14) lines[lines.length - 1] = (cur + ' ' + w).trim(); else if (lines.length < 2) lines.push(w.slice(0, 14)); });
      lines.forEach((ln, i) => text(ln.slice(0, 14), 0, 9 + i * 8, 1));
    } else {
      const mode = ['TRK WR', 'TRK PL', 'PTN PL', 'PTN WR'][S.mode];
      text(mode, 0, 9, .8); if (S.running) text('>', 40, 9, 1);
      let note = '';
      const stp = headStep >= 0 ? headPat.steps[headStep] : (S.mode === 3 ? pat.steps[S.cursor] : null);
      if (stp) note = stp.k === 0 ? '.' : stp.k === 2 ? '_' : midiName(stepMidi(stp)).replace('#', '#') + (stp.a ? '^' : '') + (stp.s ? '~' : '');
      text(patName(S.group * 16 + S.side * 8 + S.num).replace(/^$/, ''), 0, 18, .8);
      if (note) text(note, 36, 18, 1);
      text(bpm, COLS - width(bpm, 2), 0, 1, 2);
      text('BPM', COLS - width('BPM'), 17, .55);
    }
    // step strip: bar height = pitch, current step lit
    const y0 = 25, base = ROWS - 1;
    for (let i = 0; i < 16; i++) {
      const x = 2 + i * 5, st = shown.steps[i], inLen = i < shown.len, cur = i === headStep || (S.mode === 3 && headStep < 0 && i === S.cursor);
      const a = cur ? 1 : inLen ? .45 : .12;
      if (st.k === 1) {
        const h = 2 + Math.round(st.n / 12 * 4) + (st.t === 1 ? 1 : 0);
        for (let r = 0; r < h; r++) for (let c = 0; c < 4; c++) dot(x + c, base - r, a);
        if (st.a) for (let c = 0; c < 4; c++) dot(x + c, base - h - 1, cur ? 1 : .8);
        if (st.s) { dot(x + 4, base - 1, a); }
      } else if (st.k === 2) { for (let c = 0; c < 5; c++) dot(x + c, base - 2, a * .8); }
      else { dot(x + 1, base, a * .8); dot(x + 2, base, a * .8); }
    }
  }

  dmHook = function (text_, ms) {
    if (text_ != null) {
      if (!supported(text_)) return false;
      msg = text_.replace(/\s+/g, ' ').trim(); clearTimeout(msgTimer);
      msgTimer = setTimeout(() => { msg = ''; draw(); }, ms || 1200);
    }
    draw();
    return text_ != null;
  };
  draw();

  /* ---------- boot splash: dots fly in from all over the display and form the logo ---------- */
  function splash() {
    const g = [];
    let cx0 = 7;
    for (const ch of 'ZIIION') {
      const gl = G[ch];
      for (let r = 0; r < 7; r++) for (let c = 0; c < 5; c++) if (gl[r][c]) for (let u = 0; u < 2; u++) for (let v = 0; v < 2; v++) g.push([cx0 + c * 2 + u, 9 + r * 2 + v, rnd() * COLS, rnd() * ROWS, rnd() * .7]);
      cx0 += 12;
    }
    try { // short quiet bass blip
      const ac = engine.ctx, o = ac.createOscillator(), f = ac.createBiquadFilter(), gn = ac.createGain(), t = ac.currentTime;
      o.type = 'sawtooth'; o.frequency.value = 41.2; f.type = 'lowpass'; f.Q.value = 6;
      f.frequency.setValueAtTime(180, t); f.frequency.exponentialRampToValueAtTime(1600, t + .7); f.frequency.exponentialRampToValueAtTime(300, t + 1.5);
      gn.gain.setValueAtTime(0, t); gn.gain.linearRampToValueAtTime(.16, t + .6); gn.gain.exponentialRampToValueAtTime(.001, t + 1.7);
      o.connect(f); f.connect(gn); gn.connect(ac.destination); o.start(t); o.stop(t + 1.8);
    } catch (e) { /* ignore */ }
    splashing = true;
    const t0 = performance.now();
    const skip = () => { splashing = false; window.removeEventListener('pointerdown', skip, true); draw(); };
    window.addEventListener('pointerdown', skip, true);
    (function step(now) {
      if (!splashing) return;
      const t = (now - t0) / 1000;
      if (t > 2.5) { skip(); return; }
      ctx.clearRect(0, 0, cv.width, cv.height); ctx.drawImage(bg, 0, 0);
      const fade = t > 1.9 ? Math.max(0, (2.5 - t) / .6) : 1;
      for (const d of g) {
        const k = Math.min(1, Math.max(0, (t - d[4] * .8) / .9)), e = 1 - Math.pow(1 - k, 3);
        dot(Math.round(d[2] + (d[0] - d[2]) * e), Math.round(d[3] + (d[1] - d[3]) * e), (.3 + .7 * e) * fade);
      }
      if (t > 1.5 && !redsq.classList.contains('flash')) { redsq.classList.add('flash'); setTimeout(() => redsq.classList.remove('flash'), 900); }
      requestAnimationFrame(step);
    })(t0);
  }
  splashHook = splash;
})();
