/* ---- export ---- */
function download(name, bytes, type) {
  const url = URL.createObjectURL(new Blob([bytes], { type: type }));
  const a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click();
  setTimeout(() => { a.remove(); URL.revokeObjectURL(url); }, 5000);
}
function exportName(ext) {
  const nm = isTrackMode() ? 'track' + (S.trackSel + 1) : patName(patIdx());
  return 'zion303-' + nm + '-' + bpmOf(S.k.tempo) + 'bpm.' + ext;
}
function wavBytes(buf) {
  const n = buf.length, ch = [buf.getChannelData(0), buf.getChannelData(1)];
  let peak = 0;
  for (let c = 0; c < 2; c++) for (let i = 0; i < n; i++) { const v = Math.abs(ch[c][i]); if (v > peak) peak = v; }
  const g = peak > 0 ? 0.89 / peak : 1;
  const out = new DataView(new ArrayBuffer(44 + n * 4));
  const w = (o, t) => { for (let i = 0; i < t.length; i++) out.setUint8(o + i, t.charCodeAt(i)); };
  w(0, 'RIFF'); out.setUint32(4, 36 + n * 4, true); w(8, 'WAVEfmt '); out.setUint32(16, 16, true);
  out.setUint16(20, 1, true); out.setUint16(22, 2, true); out.setUint32(24, buf.sampleRate, true);
  out.setUint32(28, buf.sampleRate * 4, true); out.setUint16(32, 4, true); out.setUint16(34, 16, true);
  w(36, 'data'); out.setUint32(40, n * 4, true);
  let o = 44;
  for (let i = 0; i < n; i++) for (let c = 0; c < 2; c++) { out.setInt16(o, Math.max(-32768, Math.min(32767, Math.round(ch[c][i] * g * 32767))), true); o += 2; }
  return new Uint8Array(out.buffer);
}
async function renderWav() {
  const b = buildPlay();
  if (!b.seq.length) throw new Error('empty');
  const sr = 44100, bpm = bpmOf(S.k.tempo), stepSec = 15 / bpm;
  const loops = isTrackMode() ? 1 : 2;
  let seq = [];
  for (let l = 0; l < loops; l++) seq = seq.concat(b.seq);
  const tailSteps = Math.ceil((S.reverb ? 3.2 : S.delay ? 2.2 : 0.5) / stepSec);
  for (let i = 0; i < tailSteps; i++) seq.push([0]);
  const dur = seq.length * stepSec;
  const oc = new OfflineAudioContext(2, Math.ceil(dur * sr), sr);
  const node = await createEngine(oc);
  const pm = paramMsg(); pm.snap = true;
  node.port.postMessage(pm); node.port.postMessage({ t: 'bpm', v: bpm });
  node.port.postMessage({ t: 'seq', seq: seq, at: 'now' }); node.port.postMessage({ t: 'run', on: true });
  await new Promise(r => setTimeout(r, 300));
  return wavBytes(await oc.startRendering());
}
async function exportWav() { download(exportName('wav'), await renderWav(), 'audio/wav'); }
function vlq(n) { const o = [n & 127]; while ((n >>= 7)) o.unshift((n & 127) | 128); return o; }
function midiBytes() {
  const b = buildPlay();
  if (!b.seq.length) throw new Error('empty');
  const seq = b.seq, n = seq.length, bpm = bpmOf(S.k.tempo), T = 120, GATE = 0.56;
  const ev = []; let open = null;
  const on = (t, note, acc) => ev.push({ t: t, o: 1, note: note, vel: acc ? 118 : 84 });
  const off = (t, note) => ev.push({ t: t, o: 0, note: note });
  for (let i = 0; i < n; i++) {
    const s = seq[i], nx = i + 1 < n ? seq[i + 1] : [0], t0 = i * T, gOff = t0 + Math.round(T * GATE);
    if (s[0] === 1) {
      if (open && open.slide) { on(t0, s[1], s[2]); off(t0 + 2, open.note); }
      else { if (open) off(t0, open.note); on(t0, s[1], s[2]); }
      open = { note: s[1], slide: !!s[3] };
      if (!(nx[0] === 2 || (s[3] && nx[0] === 1))) { off(gOff, s[1]); open = null; }
    } else if (s[0] === 2 && open) {
      if (!(nx[0] === 2 || (open.slide && nx[0] === 1))) { off(gOff, open.note); open = null; }
    } else if (open) { off(t0, open.note); open = null; }
  }
  if (open) off(n * T, open.note);
  ev.sort((a, c) => a.t - c.t || a.o - c.o);
  const tr = [];
  const us = Math.round(60000000 / bpm);
  tr.push(0, 0xFF, 0x51, 3, (us >> 16) & 255, (us >> 8) & 255, us & 255);
  const name = 'ZION 303 ' + (isTrackMode() ? 'track ' + (S.trackSel + 1) : patName(patIdx()));
  tr.push(0, 0xFF, 0x03, name.length); for (let i = 0; i < name.length; i++) tr.push(name.charCodeAt(i) & 127);
  let last = 0;
  ev.forEach(e => { vlq(e.t - last).forEach(x => tr.push(x)); last = e.t; tr.push(e.o ? 0x90 : 0x80, e.note, e.o ? e.vel : 0); });
  vlq(Math.max(0, n * T - last)).forEach(x => tr.push(x)); tr.push(0xFF, 0x2F, 0);
  const head = [0x4D, 0x54, 0x68, 0x64, 0, 0, 0, 6, 0, 0, 0, 1, 1, 0xE0];
  const len = tr.length;
  return new Uint8Array(head.concat([0x4D, 0x54, 0x72, 0x6B, (len >> 24) & 255, (len >> 16) & 255, (len >> 8) & 255, len & 255], tr));
}
function exportMidi() { download(exportName('mid'), midiBytes(), 'audio/midi'); }

// power overlay
const powerEl = el('', stage, '', '', 'div'); powerEl.id = 'power';
powerEl.innerHTML = '<div class="pw"><svg viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round"><path d="M12 3v8"/><path d="M6.6 6.6a8 8 0 1 0 10.8 0"/></svg></div><div>Power</div><small>тапни, чтобы включить звук</small>';
let powering = false;
powerEl.addEventListener('click', async e => {
  e.preventDefault();
  if (powering) return;
  powering = true;
  const ok = await powerOn();
  powering = false;
  if (ok) powerEl.classList.add('gone');
});
