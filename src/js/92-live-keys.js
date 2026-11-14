/* ---- live keys ---- */
const held = [];
function keyDown(n, src) {
  if (!engine.ready) return;
  let midi, acc, sld;
  if (S.mode === 3 && S.edit === 'pitch') {
    pushUndo();
    const st = editStep();
    st.n = n; if (st.k === 0) st.k = 1;
    midi = stepMidi(st); acc = st.a; sld = 0;
    edited();
    osd(stepDesc(S.cursor, st, curPat().len), 900);
  } else if (S.mode === 3) {
    const st = editStep();
    midi = 36 + n + 12 * st.t; acc = 0; sld = 0;
  } else {
    midi = 36 + n + 12 * S.live.t; acc = S.live.a; sld = S.live.s;
  }
  held.push({ src, n, midi, acc, sld });
  send({ t: 'on', note: midi, acc, sld: held.length > 1 ? sld : 0 });
  refresh();
}
function keyUp(n, src) {
  const i = held.findIndex(h => h.src === src);
  if (i < 0) return;
  held.splice(i, 1);
  if (!held.length) send({ t: 'off' });
  else { const h = held[held.length - 1]; send({ t: 'on', note: h.midi, acc: h.acc, sld: 1 }); }
  refresh();
}
