/* ================= data ================= */
const NN = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const ROMAN = ['I', 'II', 'III', 'IV'];
const MODES = ['TRACK WRITE', 'TRACK PLAY', 'PATTERN PLAY', 'PATTERN WRITE'];
const midiName = m => NN[((m % 12) + 12) % 12] + (Math.floor(m / 12) - 1);
const blankStep = () => ({ k: 0, n: 0, t: 0, a: 0, s: 0 });
const blankPat = () => ({ len: 16, steps: Array.from({ length: 16 }, blankStep) });
function setFromMidi(st, m) {
  m = clamp(Math.round(m), 24, 60);
  if (m < 36) { st.t = -1; st.n = m - 24; }
  else if (m <= 48) { st.t = 0; st.n = m - 36; }
  else { st.t = 1; st.n = m - 48; }
}
const stepMidi = st => 36 + st.n + 12 * st.t;
function parsePat(str) {
  const p = blankPat();
  const tk = str.trim().split(/\s+/);
  for (let i = 0; i < 16; i++) {
    const t = tk[i] || '.';
    const st = p.steps[i];
    if (t === '.') continue;
    if (t === '_') { st.k = 2; continue; }
    const m = /^([A-G])(#?)(-?\d)(\^?)(~?)$/.exec(t);
    if (!m) continue;
    const base = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[m[1]] + (m[2] ? 1 : 0);
    st.k = 1; setFromMidi(st, 12 * (parseInt(m[3], 10) + 1) + base);
    st.a = m[4] ? 1 : 0; st.s = m[5] ? 1 : 0;
  }
  return p;
}
// index = group*16 + side*8 + number.  ^ accent, ~ slide (into next note), _ tie, . rest
const FACTORY = [
  [0, 'E1^ . E1 E2 . E1~ G1 . E1 . E1^ B1 . A1~ G1 .'],
  [1, 'A1 A1^ A2 A1 . A1 C2~ D2 A1 A1^ . A2 A1 G2~ E2 .'],
  [2, 'C2^ . C2 . C3 . A#2~ G2 C2 . C2^ . D#2 . F2~ G2'],
  [3, '. . F1^ . . F1 . F1 . . F1^ . F2~ F1 . .'],
  [4, 'D1^ _ . D1 D2 . D1~ F1 D1^ _ . D2 C2~ A1 . D1'],
  [5, 'G1 . G1^ G2 G1 . D#2~ F2 G1 . G1^ . A#1 . C2~ G1'],
  [6, 'E1^ E1 E2 E1 E1^ E1 G2~ E1 E1^ E1 E2 E1 B1~ C2 E1 E1'],
  [7, 'A1^ . . A1 . . A2~ G2 . . A1^ . . E2~ G2 .'],
  [8, 'E1 . E1^ . E2 . E1 G1~ A1 . E1^ . B1 . D2~ E2'],
  [9, 'A1^ A1 . A1 A2 . A1 . C2^ . A1 . G2~ E2 . A1'],
  [10, 'C2 C2^ . C3~ A#2 . G2 . C2 C2^ . D#3~ C3 . G2 .'],
  [11, 'F1^ . . F1^ . . F2 . F1 . F1^ . . C2~ D#2 .'],
  [16, 'D1 . . D1 . . D2~ C2 . . D1 . A1~ . G1 .'],
  [17, 'G1^ _ _ . G1 . G1^ . D2~ D#2 . G1 . F2~ D2 .']
];
const SAVE_KEY = 'pb303.v1';
const S = {
  mode: 2, group: 0, num: 0, side: 0, edit: 'pitch', cursor: 0, running: false,
  trackSel: 0, fn: false, patterns: null, tracks: null,
  live: { t: 0, a: 0, s: 0 }, playIdx: -1,
  k: { tune: .5, cut: .32, res: .72, env: .7, dec: .32, acc: .65, tempo: .52, vol: .7 },
  wave: 0, dist: 0, delay: 0, reverb: 0, preset: ''
};
function sanitizePat(p) {
  const out = blankPat();
  if (!p || !Array.isArray(p.steps)) return out;
  out.len = clamp(parseInt(p.len, 10) || 16, 1, 16);
  for (let i = 0; i < 16; i++) {
    const s = p.steps[i] || {};
    out.steps[i] = { k: clamp(s.k | 0, 0, 2), n: clamp(s.n | 0, 0, 12), t: clamp(s.t | 0, -1, 1), a: s.a ? 1 : 0, s: s.s ? 1 : 0 };
  }
  return out;
}
function initData() {
  S.patterns = Array.from({ length: 64 }, blankPat);
  FACTORY.forEach(f => { S.patterns[f[0]] = parsePat(f[1]); });
  S.tracks = Array.from({ length: 8 }, () => []);
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return;
    const d = JSON.parse(raw);
    if (!d || d.v !== 1) return;
    if (Array.isArray(d.patterns) && d.patterns.length === 64) S.patterns = d.patterns.map(sanitizePat);
    if (Array.isArray(d.tracks) && d.tracks.length === 8) S.tracks = d.tracks.map(t => Array.isArray(t) ? t.filter(x => x >= 0 && x < 64).slice(0, 64) : []);
    if (d.k) for (const key in S.k) if (typeof d.k[key] === 'number') S.k[key] = clamp(d.k[key], 0, 1);
    S.preset = typeof d.preset === 'string' ? d.preset.slice(0, 18) : '';
    S.wave = d.wave ? 1 : 0; S.dist = d.dist ? 1 : 0; S.delay = d.delay ? 1 : 0; S.reverb = d.reverb ? 1 : 0;
    S.group = clamp(d.group | 0, 0, 3); S.num = clamp(d.num | 0, 0, 7); S.side = d.side ? 1 : 0;
    S.mode = clamp(d.mode == null ? 2 : d.mode | 0, 0, 3); S.trackSel = clamp(d.trackSel | 0, 0, 7);
  } catch (e) { /* ignore */ }
}
let saveTimer = 0;
function save() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({
        v: 1, patterns: S.patterns, tracks: S.tracks, k: S.k, preset: S.preset, wave: S.wave, dist: S.dist, delay: S.delay, reverb: S.reverb,
        group: S.group, num: S.num, side: S.side, mode: S.mode, trackSel: S.trackSel
      }));
    } catch (e) { /* ignore */ }
  }, 350);
}
initData();

const patIdx = () => S.group * 16 + S.side * 8 + S.num;
const curPat = () => S.patterns[patIdx()];
const isTrackMode = () => S.mode < 2;
const patName = i => ROMAN[i >> 4] + '-' + ((i & 7) + 1) + ((i >> 3) & 1 ? 'B' : 'A');
const bpmOf = v => Math.round(50 + v * 150);
