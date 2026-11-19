/* ---- LEDs ---- */
function setLed(e, on) { if (e) e.classList.toggle('on', !!on); }
function refresh() {
  const pat = curPat();
  let headPat = pat, headStep = -1;
  if (S.running && S.playIdx >= 0) {
    const m = playMap[S.playIdx];
    if (m) { headPat = S.patterns[m[0]]; headStep = m[1]; }
  }
  const stripPat = (S.running && headStep >= 0) ? headPat : pat;
  for (let i = 0; i < 16; i++) {
    const e = L.steps[i];
    e.classList.toggle('on', i === headStep);
    e.classList.toggle('cur', S.mode === 3 && i === S.cursor && i !== headStep);
    e.classList.toggle('dim', i >= stripPat.len);
  }
  setLed(L.run, S.running);
  let st = null;
  if (S.mode === 3) st = pat.steps[S.cursor];
  else if (S.running && headStep >= 0) st = headPat.steps[headStep];
  const heldNotes = held.map(h => h.n);
  for (let n = 0; n < 13; n++) {
    let on = heldNotes.indexOf(n) >= 0;
    if (!on && st && st.k === 1 && st.n === n) on = true;
    L.keys[n].classList.toggle('on', on);
  }
  if (S.mode === 3 && S.edit === 'time') {
    setLed(L.down, st.k === 1); setLed(L.up, st.k === 2); setLed(L.acc, st.k === 0); setLed(L.sld, false);
  } else if (st) {
    setLed(L.down, st.t === -1); setLed(L.up, st.t === 1); setLed(L.acc, st.a); setLed(L.sld, st.s);
  } else {
    setLed(L.down, S.live.t === -1); setLed(L.up, S.live.t === 1); setLed(L.acc, S.live.a); setLed(L.sld, S.live.s);
  }
  const selIdx = (S.mode === 1 || (S.fn && S.mode === 0)) ? S.trackSel : S.num;
  for (let i = 0; i < 8; i++) setLed(L.sel[i], i === selIdx);
  setLed(L.A, S.side === 0 && S.mode !== 1); setLed(L.B, S.side === 1 && S.mode !== 1);
  setLed(L.fn, S.fn);
  setLed(L.pitch, S.mode === 3 && S.edit === 'pitch'); setLed(L.time, S.mode === 3 && S.edit === 'time');
  if (dmHook) dmHook();
}
