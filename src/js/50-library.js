/* ---- LIBRARY (sequences + sound presets) ---- */
const LIB = [
  // genre, name, bpm, pattern, knobs [tune cut res env dec acc], wave, dist, delay, reverb
  ['ACID', 'ACID CLASSIC', 130, 'E1^ . E1 E2 . E1~ G1 . E1 . E1^ B1 . A1~ G1 .', [.5, .32, .72, .7, .32, .65], 0, 0, 0, 0],
  ['ACID', 'SQUELCH', 138, 'A1 A1 A2^ A1 . A1~ C2 A1 . A1^ A2 . G1~ A1 . A1', [.5, .22, .9, .85, .25, .8], 0, 1, 0, 0],
  ['ACID', 'ACID TRIP', 135, 'E1^ E2 . E1 E3~ E2 . E1^ G1 . E2 . B1~ A1 . E1', [.5, .26, .82, .8, .3, .75], 0, 0, 1, 0],
  ['TECHNO', 'DRIVING', 132, 'A1 . A1 A1 . A1 . A2 A1 . A1 A1 . A1^ . G1', [.5, .3, .5, .45, .22, .6], 0, 1, 0, 0],
  ['TECHNO', 'HYPNOTIC', 128, 'D1 . D1 . D1^ . D1 . D1 . D1~ F1 . D1 . D1', [.5, .24, .68, .55, .35, .55], 0, 0, 1, 0],
  ['TECHNO', 'INDUSTRIAL', 140, 'C1^ C1 . C1 C1^ . C1 C2 C1^ . C1 . D#1 . C1 .', [.5, .35, .6, .65, .18, .85], 1, 1, 0, 0],
  ['HOUSE', 'DEEP HOUSE', 122, 'C1^ . . C1 . . C2 . C1^ . . C1 . D#1~ F1 .', [.5, .16, .3, .3, .45, .4], 1, 0, 0, 0],
  ['HOUSE', 'CHICAGO', 124, 'F1^ . . F1 . F2~ F1 . A#1^ . . A#1 . C2 . F1', [.5, .28, .55, .5, .3, .6], 0, 0, 0, 1],
  ['ELECTRO', 'ELECTRO', 128, 'F1^ . F1 F1 . F2 . F1 F1^ . F1 . A#1 . C2~ F1', [.5, .3, .45, .55, .4, .6], 1, 1, 0, 0],
  ['ELECTRO', 'MIAMI BASS', 118, 'C1^ . . C1 . . C1^ . . C1 . . D#1^ . F1~ G1', [.5, .2, .4, .4, .55, .7], 1, 0, 0, 0],
  ['RAVE', 'RAVE STAB', 145, 'C3^ . C3 . D#3^ . C3 . G2^ . C3 . D#3 . F3~ G3', [.5, .5, .8, .6, .15, .9], 1, 1, 1, 0],
  ['RAVE', 'TRANCE ARP', 138, 'A1 . A2 C3 A2 . E3 C3 A2 . A1^ A2 C3~ E3 . C3', [.5, .62, .55, .4, .3, .7], 0, 0, 1, 0],
  ['DUB', 'DUB BASS', 100, 'E1^ _ _ . . E1 _ . G1^ _ . . A1~ B1 _ .', [.5, .28, .6, .5, .6, .5], 0, 0, 1, 1],
  ['DUB', 'SUB WOBBLE', 70, 'E1^ _ _ _ _ _ E1 _ G1^ _ _ . A1 _ _ .', [.5, .2, .7, .45, .75, .4], 1, 0, 1, 1],
  ['AMBIENT', 'AMBIENT', 90, 'D1^ _ _ _ A1 _ _ _ F1^ _ _ . C2~ D2 _ _', [.5, .4, .5, .45, .85, .4], 1, 0, 1, 1],
  ['AMBIENT', 'DRIFT', 76, 'G1^ _ _ _ _ _ _ _ D2^ _ _ _ A1~ G1 _ _', [.5, .46, .4, .35, .9, .3], 0, 0, 1, 1],
  ['ACID', 'ACID RAIN', 126, 'G1^ . G1 . D2 . G1~ A#1 G1 . G1^ . F2~ D2 . G1', [.5, .3, .78, .72, .28, .7], 0, 0, 1, 0],
  ['ACID', 'ACID SAW', 134, 'C2^ C2 . C3 C2 . D#2~ C2 . C2^ . C3 . A#1~ C2 .', [.5, .27, .75, .8, .26, .8], 0, 1, 0, 0],
  ['ACID', 'WARP', 142, 'D2^ . D3 D2 . D2 A2~ . D2^ . D3 . D2 F2~ .', [.5, .35, .85, .75, .2, .85], 0, 1, 1, 0],
  ['ACID', 'SLOW BURN', 112, 'A1^ . . A1 . A1~ C2 . A1 . . A1^ . D2~ C2 .', [.5, .2, .8, .6, .5, .6], 0, 0, 1, 1],
  ['TECHNO', 'ROLLING', 135, 'F1 F1 . F1 F1^ . F1 F1 . F1 F1 . F2 . F1 .', [.5, .27, .45, .4, .2, .6], 0, 0, 0, 0],
  ['TECHNO', 'WAREHOUSE', 130, 'E1^ . . E1 . E1 . . E2^ . . E1 . G1~ E1 .', [.5, .22, .6, .5, .3, .6], 0, 1, 0, 1],
  ['TECHNO', 'DARK LOOP', 138, 'G1^ . G1 . G1 . A#1~ G1 . . G1^ . G1 . D2 .', [.5, .2, .7, .45, .28, .65], 1, 1, 1, 0],
  ['HOUSE', 'PIANO HOUSE', 126, 'A1^ . A1 . . C2 . E2 A1^ . A1 . G1 . A1 .', [.5, .38, .4, .4, .35, .55], 0, 0, 0, 1],
  ['HOUSE', 'GARAGE', 130, 'D1^ . . D2 . D1 . F1 . . A1^ . . G1~ F1 .', [.5, .24, .45, .45, .35, .6], 1, 0, 0, 0],
  ['HOUSE', 'DISCO BASS', 118, 'C2^ C3 C2 C3 A#1^ A#2 A#1 A#2 G#1^ G#2 G#1 G#2 G1^ G2 G1 G2', [.5, .34, .3, .35, .22, .55], 0, 0, 0, 0],
  ['ELECTRO', 'KRAFT', 120, 'E1^ . E1 . E1 . G1 . E1^ . E1 . B1 . A1 .', [.5, .3, .35, .4, .3, .55], 1, 0, 1, 0],
  ['ELECTRO', 'BREAKS', 135, 'A1^ . . A1 . A2 . . A1 . A1^ . . G1~ A1 .', [.5, .3, .6, .55, .3, .7], 0, 1, 0, 0],
  ['RAVE', 'HOOVER', 150, 'F2^ . F2 . F3 . D#2~ F2 . . F2^ . F3 . C3 .', [.5, .55, .85, .65, .2, .9], 0, 1, 1, 0],
  ['RAVE', 'GABBER', 160, 'E1^ E1 E1 E1^ E1 E1 E1 E1^ E1 E1 E1 E1^ E1 E1 G1 E1', [.5, .3, .5, .5, .1, .9], 1, 1, 0, 0],
  ['DUB', 'ROOTS', 85, 'A1^ _ . . E2 . A1~ . G1^ _ . . D2 . . .', [.5, .24, .5, .4, .55, .45], 1, 0, 1, 1],
  ['AMBIENT', 'GLASS', 82, 'E2^ _ _ _ B2 _ _ _ G2^ _ _ . D3~ B2 _ _', [.5, .55, .45, .35, .8, .35], 0, 0, 1, 1]
].map(r => ({ g: r[0], name: r[1], bpm: r[2], pat: r[3], k: r[4], w: r[5], d: r[6], dl: r[7], rv: r[8] }));

function randomEntry() {
  const R = Math.random, pick = a => a[(R() * a.length) | 0], rr = (a, b) => a + R() * (b - a);
  const scale = pick([[0, 3, 5, 7, 10], [0, 1, 3, 5, 7, 8, 10], [0, 2, 3, 5, 7, 8, 11], [0, 3, 5, 6, 7, 10]]);
  const root = 36 + pick([0, 2, 3, 5, 7, 9, 10]);
  const p = blankPat();
  let prevNote = false;
  for (let i = 0; i < 16; i++) {
    const st = p.steps[i];
    const r = R();
    if (i > 0 && r < 0.2) { st.k = 0; prevNote = false; continue; }
    if (i > 0 && prevNote && r < 0.3) { st.k = 2; continue; }
    st.k = 1; prevNote = true;
    let m = root + (R() < 0.45 ? 0 : pick(scale));
    const o = R();
    if (o < 0.18) m += 12; else if (o < 0.26) m -= 12;
    setFromMidi(st, clamp(m, 24, 60));
    st.a = R() < 0.27 ? 1 : 0;
    st.s = R() < 0.18 ? 1 : 0;
  }
  p.steps[0].k = 1; if (p.steps[0].k === 1 && !p.steps.some(x => x.k === 1)) p.steps[0].k = 1;
  p.steps[15].s = 0;
  return {
    g: 'USER', name: 'RANDOM', bpm: Math.round(rr(116, 146)), pat: p,
    k: [.5, rr(.14, .55), rr(.35, .92), rr(.3, .9), rr(.15, .7), rr(.4, .9)].map(v => +v.toFixed(3)),
    w: R() < .3 ? 1 : 0, d: R() < .35 ? 1 : 0, dl: R() < .45 ? 1 : 0, rv: R() < .3 ? 1 : 0
  };
}
const KN = ['tune', 'cut', 'res', 'env', 'dec', 'acc'];
let userLib = [];
try { userLib = JSON.parse(localStorage.getItem('pb303.user') || '[]').filter(e => e && e.name && e.pat); } catch (e) { userLib = []; }
const saveUserLib = () => { try { localStorage.setItem('pb303.user', JSON.stringify(userLib)); } catch (e) { /* ignore */ } };
const libOpts = { pat: true, snd: true };
let libSnap = null;

function fxSet() {
  swWave.classList.toggle('on', !!S.wave);
  ['dist', 'delay', 'reverb'].forEach(f => fxSw[f].classList.toggle('on', !!S[f]));
}
function applyEntry(e) {
  if (libOpts.pat && !isTrackMode()) {
    pushUndo();
    S.patterns[patIdx()] = typeof e.pat === 'string' ? parsePat(e.pat) : sanitizePat(e.pat);
    S.cursor = 0;
    S.k.tempo = clamp((e.bpm - 50) / 150, 0, 1); knobs.tempo.set(S.k.tempo, true); send({ t: 'bpm', v: bpmOf(S.k.tempo) });
  }
  if (libOpts.snd) {
    KN.forEach((k, i) => { S.k[k] = e.k[i]; knobs[k].set(e.k[i], true); });
    S.wave = e.w ? 1 : 0; S.dist = e.d ? 1 : 0; S.delay = e.dl ? 1 : 0; S.reverb = e.rv ? 1 : 0;
    fxSet(); send(paramMsg());
  }
  S.preset = e.name;
  libLab.textContent = e.name;
  if (libOpts.pat && !isTrackMode()) edited(); else { refresh(); save(); }
  libMark();
}
function currentEntry(name) {
  return {
    g: 'USER', name: name, bpm: bpmOf(S.k.tempo), pat: JSON.parse(JSON.stringify(curPat())),
    k: KN.map(k => +S.k[k].toFixed(3)), w: S.wave, d: S.dist, dl: S.delay, rv: S.reverb
  };
}
function libSnapshot() {
  return {
    i: patIdx(), pat: JSON.stringify(S.patterns[patIdx()]), k: Object.assign({}, S.k),
    w: S.wave, d: S.dist, dl: S.delay, rv: S.reverb, name: S.preset
  };
}
function libRestore() {
  if (!libSnap) return;
  S.patterns[libSnap.i] = JSON.parse(libSnap.pat);
  Object.keys(libSnap.k).forEach(k => { S.k[k] = libSnap.k[k]; if (knobs[k]) knobs[k].set(libSnap.k[k], true); });
  S.wave = libSnap.w; S.dist = libSnap.d; S.delay = libSnap.dl; S.reverb = libSnap.rv; S.preset = libSnap.name;
  libLab.textContent = S.preset || 'LIBRARY';
  fxSet(); send(paramMsg()); send({ t: 'bpm', v: bpmOf(S.k.tempo) });
  edited(); libMark(); osd(T('ВОЗВРАТ', 'REVERTED'));
}

const libEl = el('', stage, '', '', 'div'); libEl.id = 'lib';
libEl.innerHTML =
  '<div class="lh"><span class="lt">LIBRARY</span>' +
  '<span class="tg on" data-o="pat">ПАТТЕРН</span><span class="tg on" data-o="snd">ЗВУК</span>' +
  '<span class="lb" data-a="rnd">РАНДОМ</span><span class="lb" data-a="run">▶ / ■</span><span class="lb" data-a="undo">ОТМЕНИТЬ</span>' +
  '<span class="lb done" data-a="close">ГОТОВО</span></div>' +
  '<div class="ll"></div>' +
  '<div class="lf"><input class="ln" maxlength="18" placeholder="имя пресета" autocomplete="off" autocapitalize="characters">' +
  '<span class="lb" data-a="save">СОХРАНИТЬ ТЕКУЩЕЕ</span><span class="lb" data-a="exp">ЭКСПОРТ</span><span class="lb" data-a="imp">ИМПОРТ</span><span class="lb" data-a="lite"></span>' +
  '<input type="file" class="lfile" accept=".json,application/json" hidden></div>';
const LIBTXT = [['[data-o=pat]', 'ПАТТЕРН', 'PATTERN'], ['[data-o=snd]', 'ЗВУК', 'SOUND'], ['[data-a=rnd]', 'РАНДОМ', 'RANDOM'], ['[data-a=undo]', 'ОТМЕНИТЬ', 'REVERT'],
  ['[data-a=close]', 'ГОТОВО', 'DONE'], ['[data-a=save]', 'СОХРАНИТЬ ТЕКУЩЕЕ', 'SAVE CURRENT'], ['[data-a=exp]', 'ЭКСПОРТ', 'EXPORT'], ['[data-a=imp]', 'ИМПОРТ', 'IMPORT']];
const liteLabel = () => { const e = libEl.querySelector('[data-a=lite]'); if (e) e.textContent = T('ЛАЙТ: ', 'LITE: ') + (LITE ? T('ВКЛ', 'ON') : T('ВЫКЛ', 'OFF')); };
const libList = libEl.querySelector('.ll'), libName = libEl.querySelector('.ln'), libFile = libEl.querySelector('.lfile');

function libLang() {
  liteLabel();
  LIBTXT.forEach(r => { const e = libEl.querySelector(r[0]); if (e) e.textContent = T(r[1], r[2]); });
  libName.placeholder = T('имя пресета', 'preset name');
}
libLang();
function miniEl(pat) {
  const p = typeof pat === 'string' ? parsePat(pat) : sanitizePat(pat);
  const m = document.createElement('div'); m.className = 'mini';
  p.steps.slice(0, p.len).forEach(st => {
    const b = document.createElement('i');
    if (st.k === 0) b.className = 'r';
    else if (st.k === 2) b.className = 't';
    else { const pi = st.n + 12 * (st.t + 1); b.style.height = (4 + pi / 36 * 13) + 'px'; if (st.a) b.className = 'a'; }
    m.appendChild(b);
  });
  return m;
}
function libBuild() {
  libList.innerHTML = '';
  const groups = {};
  LIB.concat(userLib.map(u => Object.assign({ user: 1 }, u))).forEach(e => { (groups[e.g] = groups[e.g] || []).push(e); });
  Object.keys(groups).forEach(g => {
    const h = document.createElement('div'); h.className = 'gh'; h.textContent = g; libList.appendChild(h);
    const grid = document.createElement('div'); grid.className = 'gr'; libList.appendChild(grid);
    groups[g].forEach(e => {
      const r = document.createElement('div'); r.className = 'row'; r.dataset.n = e.name;
      const t = document.createElement('div'); t.className = 'rt';
      t.innerHTML = '<b></b><span>' + e.bpm + ' BPM</span>'; t.firstChild.textContent = e.name;
      r.appendChild(t); r.appendChild(miniEl(e.pat));
      if (e.user) { const x = document.createElement('u'); x.textContent = '×'; x.dataset.del = e.name; r.appendChild(x); }
      r.addEventListener('click', ev => {
        if (ev.target.dataset && ev.target.dataset.del) {
          userLib = userLib.filter(u => u.name !== ev.target.dataset.del); saveUserLib(); libBuild(); return;
        }
        applyEntry(e);
      });
      grid.appendChild(r);
    });
  });
  libMark();
}
function libMark() { libList.querySelectorAll('.row').forEach(r => r.classList.toggle('cur', r.dataset.n === S.preset)); }
function libOpen() { libSnap = libSnapshot(); libBuild(); libEl.classList.add('open'); }
libEl.addEventListener('click', ev => {
  const t = ev.target.closest('[data-o],[data-a]'); if (!t) return;
  if (t.dataset.o) { libOpts[t.dataset.o] = !libOpts[t.dataset.o]; t.classList.toggle('on', libOpts[t.dataset.o]); return; }
  const a = t.dataset.a;
  if (a === 'close') libEl.classList.remove('open');
  else if (a === 'rnd') applyEntry(randomEntry());
  else if (a === 'run') toggleRun();
  else if (a === 'undo') libRestore();
  else if (a === 'save') {
    const nm = libName.value.trim().toUpperCase().slice(0, 18);
    if (!nm) { libName.focus(); return; }
    userLib = userLib.filter(u => u.name !== nm); userLib.push(currentEntry(nm)); saveUserLib();
    S.preset = nm; libLab.textContent = nm; libName.value = ''; libBuild(); osd(T('СОХРАНЕНО  ', 'SAVED  ') + nm);
  }
  else if (a === 'exp') {
    if (!userLib.length) { osd(T('НЕТ СВОИХ ПРЕСЕТОВ', 'NO USER PRESETS')); return; }
    download('ziiion-presets.json', JSON.stringify(userLib, null, 1), 'application/json');
  }
  else if (a === 'imp') libFile.click();
  else if (a === 'lite') { setLite(!LITE); liteLabel(); osd(LITE ? T('ЛАЙТ-РЕЖИМ ВКЛ', 'LITE MODE ON') : T('ЛАЙТ-РЕЖИМ ВЫКЛ', 'LITE MODE OFF')); }
});
libFile.addEventListener('change', () => {
  const f = libFile.files[0]; if (!f) return;
  f.text().then(txt => {
    const arr = JSON.parse(txt); if (!Array.isArray(arr)) throw 0;
    let n = 0;
    arr.forEach(e => {
      if (!e || typeof e.name !== 'string' || !e.pat || !Array.isArray(e.k) || e.k.length < 6) return;
      const c = { g: 'USER', name: String(e.name).toUpperCase().slice(0, 18), bpm: clamp(+e.bpm || 120, 50, 200), pat: e.pat, k: e.k.slice(0, 6).map(v => clamp(+v || 0, 0, 1)), w: e.w ? 1 : 0, d: e.d ? 1 : 0, dl: e.dl ? 1 : 0, rv: e.rv ? 1 : 0 };
      userLib = userLib.filter(u => u.name !== c.name); userLib.push(c); n++;
    });
    saveUserLib(); libBuild(); osd(T('ИМПОРТ  ', 'IMPORTED  ') + n);
  }).catch(() => osd(T('ОШИБКА ФАЙЛА', 'FILE ERROR'))).then(() => { libFile.value = ''; });
});
const libLab = lab(S.preset || 'LIBRARY', 880, 483, { cls: 'sm' });
mkBtn({ id: 'lib', x: 836, y: 441, w: 88, h: 33, cls: 'grey', text: 'LIB', down: () => libOpen() });
