/* ================= audio engine glue ================= */
const engine = { ctx: null, node: null, queue: [], ready: false };
function send(m) {
  if (engine.node) engine.node.port.postMessage(m);
  else engine.queue.push(m);
}
async function createEngine(ctx) {
  const code = '(' + workletMain.toString() + ')()';
  try {
    await ctx.audioWorklet.addModule(URL.createObjectURL(new Blob([code], { type: 'application/javascript' })));
  } catch (err) {
    // some browsers refuse blob: modules on file:// — fall back to a data: URL
    await ctx.audioWorklet.addModule('data:application/javascript;base64,' + btoa(unescape(encodeURIComponent(code))));
  }
  const node = new AudioWorkletNode(ctx, 'pb303', { numberOfInputs: 0, numberOfOutputs: 1, outputChannelCount: [2] });
  node.connect(ctx.destination);
  return node;
}
function paramMsg() {
  const k = S.k;
  return { t: 'p', p: { tune: k.tune, cut: k.cut, res: k.res, env: k.env, dec: k.dec, acc: k.acc, vol: k.vol, wave: S.wave, dist: S.dist, delay: S.delay, reverb: S.reverb } };
}
let playMap = [];
function buildPlay() {
  const seq = [], map = [];
  const add = pi => {
    const p = S.patterns[pi];
    for (let i = 0; i < p.len; i++) {
      const st = p.steps[i];
      seq.push(st.k === 1 ? [1, stepMidi(st), st.a, st.s] : [st.k === 2 ? 2 : 0]);
      map.push([pi, i]);
    }
  };
  if (isTrackMode()) S.tracks[S.trackSel].forEach(add); else add(patIdx());
  return { seq, map };
}
function pushSeq(at) {
  const b = buildPlay();
  playMap = b.map;
  send({ t: 'seq', seq: b.seq, at: at || 'now' });
}
function syncAll() {
  send(paramMsg());
  send({ t: 'bpm', v: bpmOf(S.k.tempo) });
  pushSeq('now');
}
async function powerOn() {
  if (engine.ready) return true;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC || !window.AudioWorkletNode) { showErr('Этот браузер не поддерживает AudioWorklet'); return false; }
  try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) { /* ignore */ }
  try {
    engine.ctx = new AC({ latencyHint: 'interactive' });
    await engine.ctx.resume();
    engine.node = await createEngine(engine.ctx);
    engine.node.port.onmessage = ev => { if (ev.data && ev.data.t === 's') onStep(ev.data.i); };
    const q = engine.queue; engine.queue = [];
    syncAll();
    engine.ready = true;
    return true;
  } catch (err) {
    showErr('Не удалось запустить звук: ' + (err && err.message ? err.message : err));
    return false;
  }
}
function showErr(msg) {
  const p = document.getElementById('power');
  if (p) { p.classList.remove('gone'); const s = p.querySelector('small'); if (s) s.textContent = msg; }
}
function resumeAudio() {
  if (engine.ctx && engine.ctx.state !== 'running') engine.ctx.resume().catch(() => { });
}
document.addEventListener('visibilitychange', resumeAudio);
window.addEventListener('pointerdown', resumeAudio, true);
window.addEventListener('touchend', resumeAudio, true);
window.addEventListener('click', resumeAudio, true);
