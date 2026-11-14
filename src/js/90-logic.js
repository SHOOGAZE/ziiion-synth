/* ================= logic ================= */
const undoStack = [];
let clip = null;
function pushUndo() {
  const i = patIdx();
  undoStack.push({ i: i, p: JSON.stringify(S.patterns[i]) });
  if (undoStack.length > 40) undoStack.shift();
}
function undo() {
  const u = undoStack.pop();
  if (!u) { osd('NOTHING TO UNDO'); return; }
  S.patterns[u.i] = JSON.parse(u.p);
  if (S.cursor >= curPat().len) S.cursor = 0;
  pushSeq('now'); refresh(); save(); osd('UNDO  ' + patName(u.i));
}
function copyPat() {
  if (isTrackMode()) { osd(T('COPY: только паттерны', 'COPY: patterns only')); return; }
  clip = JSON.stringify(curPat()); osd('COPIED  ' + patName(patIdx()));
}
function pastePat() {
  if (isTrackMode()) { osd(T('PASTE: только паттерны', 'PASTE: patterns only')); return; }
  if (!clip) { osd('CLIPBOARD EMPTY'); return; }
  pushUndo(); S.patterns[patIdx()] = JSON.parse(clip); S.cursor = 0; edited();
  osd('PASTED  → ' + patName(patIdx()));
}
function afterSelect() {
  if (S.cursor >= curPat().len) S.cursor = 0;
  pushSeq(S.running ? 'bar' : 'now');
  refresh(); save();
}
function onStep(i) {
  S.playIdx = i; refresh();
  const m = playMap[i];
  if (m) {
    if (isTrackMode() && m[0] !== S._lastPat) osd('PATTERN ' + patName(m[0]), 700);
    S._lastPat = m[0];
  }
}
function toggleRun() {
  S.running = !S.running;
  if (S.running) { pushSeq('now'); S.playIdx = -1; S._lastPat = -1; send({ t: 'run', on: true }); }
  else { send({ t: 'run', on: false }); S.playIdx = -1; }
  refresh();
}
function togglePitchTime() {
  if (S.mode !== 3) { osd(T('PITCH / TIME — только в PATTERN WRITE', 'PITCH / TIME — PATTERN WRITE only')); return; }
  S.edit = S.edit === 'pitch' ? 'time' : 'pitch';
  refresh(); osd(S.edit === 'pitch' ? 'PITCH MODE' : 'TIME MODE');
}
function stepDesc(i, st, len) {
  const kind = st.k === 0 ? 'REST' : st.k === 2 ? 'TIE' : midiName(stepMidi(st)) + (st.a ? ' ACC' : '') + (st.s ? ' SLD' : '');
  return 'STEP ' + (i + 1) + '/' + len + '  ' + kind;
}
function editStep() { return curPat().steps[S.cursor]; }
function edited(at) { pushSeq(at || 'now'); refresh(); save(); }
function advance(d) {
  const p = curPat();
  S.cursor = (S.cursor + d + p.len) % p.len;
  refresh();
  osd(stepDesc(S.cursor, p.steps[S.cursor], p.len), 900);
}
function onFlagBtn(nm) {
  if (S.mode === 3) {
    pushUndo();
    const st = editStep();
    if (S.edit === 'time') {
      if (nm === 'sld') { osd('TIME MODE: DOWN / UP / ACCENT'); return; }
      st.k = nm === 'down' ? 1 : nm === 'up' ? 2 : 0;
      if (st.k === 2 && S.cursor === 0) st.k = 1;
      edited(); advance(1);
      return;
    }
    if (nm === 'down') st.t = st.t === -1 ? 0 : -1;
    else if (nm === 'up') st.t = st.t === 1 ? 0 : 1;
    else if (nm === 'acc') st.a = st.a ? 0 : 1;
    else st.s = st.s ? 0 : 1;
    if (st.k === 0 && (nm === 'acc' || nm === 'sld' || nm === 'up' || nm === 'down')) st.k = 1;
    edited();
    osd(stepDesc(S.cursor, st, curPat().len), 900);
    return;
  }
  const lv = S.live;
  if (nm === 'down') { lv.t = lv.t === -1 ? 0 : -1; }
  else if (nm === 'up') { lv.t = lv.t === 1 ? 0 : 1; }
  else if (nm === 'acc') lv.a = lv.a ? 0 : 1;
  else lv.s = lv.s ? 0 : 1;
  refresh();
}
function onNext() {
  if (S.mode === 3) advance(1);
  else if (S.mode === 0) {
    const t = S.tracks[S.trackSel];
    if (t.length >= 64) { osd('TRACK FULL'); return; }
    t.push(patIdx()); save(); refresh();
    osd('TRACK ' + (S.trackSel + 1) + '  + ' + patName(patIdx()) + '  (' + t.length + ')');
  } else osd(T('WRITE/NEXT: в WRITE режимах', 'WRITE/NEXT: WRITE modes only'));
}
function onBack() {
  if (S.fn) { undo(); return; }
  if (S.mode === 3) advance(-1);
  else if (S.mode === 0) {
    const t = S.tracks[S.trackSel];
    t.pop(); save(); refresh();
    osd('TRACK ' + (S.trackSel + 1) + '  (' + t.length + ')');
  }
}
const taps = [];
function onTap() {
  if (S.fn) { pastePat(); return; }
  const now = performance.now();
  if (taps.length && now - taps[taps.length - 1] > 2000) taps.length = 0;
  taps.push(now);
  if (taps.length > 5) taps.shift();
  if (taps.length >= 2) {
    const iv = []; for (let i = 1; i < taps.length; i++) iv.push(taps[i] - taps[i - 1]);
    const avg = iv.reduce((a, b) => a + b, 0) / iv.length;
    const bpm = clamp(Math.round(60000 / avg), 50, 200);
    knobs.tempo.set((bpm - 50) / 150, true);
    S.k.tempo = (bpm - 50) / 150; send({ t: 'bpm', v: bpm }); save();
    osd('TAP  ' + bpm + ' BPM');
  } else osd('TAP…', 600);
}
function onSide(sd) {
  if (S.mode === 1) { osd(T('A/B: не в TRACK PLAY', 'A/B: not in TRACK PLAY')); return; }
  S.side = sd; S.cursor = 0; afterSelect(); osd('PATTERN ' + patName(patIdx()));
}
function onSelector(i) {
  if (S.fn) {
    if (S.mode === 3) { pushUndo(); const p = curPat(); p.len = (i + 1) * 2; if (S.cursor >= p.len) S.cursor = 0; edited(); osd('LENGTH  ' + p.len); return; }
    if (S.mode === 0 || S.mode === 1) { S.trackSel = i; afterSelect(); osd('TRACK ' + (i + 1) + '  (' + S.tracks[i].length + ' PAT)'); return; }
  }
  if (S.mode === 1) { S.trackSel = i; afterSelect(); osd('TRACK ' + (i + 1) + '  (' + S.tracks[i].length + ' PAT)'); return; }
  S.num = i; S.cursor = 0; afterSelect(); osd('PATTERN ' + patName(patIdx()));
}
function onStepTap(i) {
  if (S.mode !== 3) return;
  if (S.fn) { pushUndo(); const p = curPat(); p.len = i + 1; if (S.cursor >= p.len) S.cursor = 0; edited(); osd('LENGTH  ' + p.len); return; }
  const p = curPat();
  if (i >= p.len) return;
  S.cursor = i; refresh(); osd(stepDesc(i, p.steps[i], p.len), 900);
}
function doClearOrRandom() {
  if (S.mode === 0 || S.mode === 1) { S.tracks[S.trackSel] = []; save(); afterSelect(); osd('TRACK ' + (S.trackSel + 1) + ' CLEARED'); return; }
  pushUndo();
  const p = curPat();
  if (S.fn) {
    randomize(p); osd('RANDOM  ' + patName(patIdx()));
  } else {
    p.len = 16; p.steps = Array.from({ length: 16 }, blankStep); osd('CLEARED  ' + patName(patIdx()));
  }
  S.cursor = 0; edited();
}
function randomize(p) {
  const root = 24 + Math.floor(Math.random() * 8);
  const scale = [0, 0, 0, 3, 5, 7, 10, 12, 0, 7];
  p.len = 16;
  p.steps = Array.from({ length: 16 }, blankStep);
  for (let i = 0; i < 16; i++) {
    const st = p.steps[i], r = Math.random();
    if (r < 0.7 || i === 0) {
      st.k = 1;
      let m = root + scale[Math.floor(Math.random() * scale.length)] + (Math.random() < .14 ? 12 : 0);
      setFromMidi(st, m);
      st.a = Math.random() < .24 ? 1 : 0;
      st.s = Math.random() < .2 ? 1 : 0;
    } else if (r < 0.8) st.k = 2;
    else st.k = 0;
  }
  p.steps.forEach((st, i) => { const nx = p.steps[(i + 1) % 16]; if (st.s && nx.k !== 1) st.s = 0; });
}
