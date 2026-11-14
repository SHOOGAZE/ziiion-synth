/* ---- BOTTOM BAND ---- */
// step strip
lab('STEP', 256, 250, { cls: 'sm', a: 'r' });
const stepHits = [];
for (let i = 0; i < 16; i++) {
  const x = 282 + i * 24;
  lab(String(i + 1), x, 238, { cls: 'sm', s: 7 });
  L.steps.push(led(x, 251));
  const hit = el('', chassis, 'position:absolute;left:' + (x - 11) + 'px;top:232px;width:22px;height:34px;touch-action:none;cursor:pointer');
  hit.addEventListener('pointerdown', e => { e.preventDefault(); onStepTap(i); });
  stepHits.push(hit);
}
// keybed + keys
const KEYX = { 0: 294, 1: 318, 2: 342, 3: 366, 4: 390, 5: 438, 6: 462, 7: 486, 8: 510, 9: 534, 10: 558, 11: 582, 12: 630 };
const KEYLAB = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C'];
const WHITE = [0, 2, 4, 5, 7, 9, 11, 12], BLACK = [1, 3, 6, 8, 10];
const keyEls = [];
for (let n = 0; n < 13; n++) {
  lab(KEYLAB[n], KEYX[n], 269, { cls: 'sm', s: 8.5 });
  L.keys.push(led(KEYX[n], 283));
}
// two staggered rows like the original: black keys back row, white keys front row
const BY = 299, BH = 46, WY = 356, WH = 54;
BLACK.forEach(n => {
  const sl = el('slot', chassis); rect(sl, KEYX[n] - 19, BY - 3, 38, BH + 6);
  const k = el('bkey', chassis, '', KEYLAB[n]); rect(k, KEYX[n] - 17, BY, 34, BH); keyEls[n] = k;
});
WHITE.forEach((n, i) => {
  const cx = KEYX[n];
  const sl = el('slot', chassis); rect(sl, cx - 22, WY - 3, 44, WH + 6);
  const k = el('wkey', chassis, '', KEYLAB[n]); rect(k, cx - 20, WY, 40, WH); keyEls[n] = k;
});
keyEls.forEach((k, n) => {
  let pid = null;
  k.addEventListener('pointerdown', e => {
    e.preventDefault();
    if (pid !== null) return;
    pid = e.pointerId;
    try { k.setPointerCapture(pid); } catch (_) { }
    k.classList.add('down'); keyDown(n, 'p' + pid);
  });
  const up = e => { if (e.pointerId !== pid) return; pid = null; k.classList.remove('down'); keyUp(n, 'p' + e.pointerId); };
  k.addEventListener('pointerup', up); k.addEventListener('pointercancel', up);
});

// selector row
const selBtns = [];
for (let i = 0; i < 8; i++) {
  const x = 270 + i * 48 + 4;
  L.sel.push(led(x + 20, 431));
  selBtns.push(mkBtn({ id: 'sel' + (i + 1), x: x, y: 441, w: 40, h: 33, cls: 'dark', text: String(i + 1), down: () => onSelector(i) }));
}
lab('SELECTOR', 462, 483, { cls: 'sm' });

// left cluster
lab('PATTERN CLEAR', 74, 250, { cls: 'sm' }); lab('BAR RESET', 184, 250, { cls: 'sm' });
let clearTimer = 0, clearFired = false;
const clrBtn = mkBtn({
  id: 'clear', x: 24, y: 261, w: 100, h: 31, cls: 'grey',
  down: () => {
    clearFired = false; clearTimer = setTimeout(() => { clearFired = true; doClearOrRandom(); }, 650);
    osd(S.fn ? 'HOLD: RANDOM' : 'HOLD TO CLEAR', 800);
  },
  up: () => { clearTimeout(clearTimer); }
});
mkBtn({ id: 'barreset', x: 134, y: 261, w: 100, h: 31, cls: 'grey', down: () => { if (S.fn) { copyPat(); return; } send({ t: 'reset' }); S.cursor = 0; S.playIdx = -1; refresh(); osd('BAR RESET'); } });

L.run = led(36, 310); lab('RUN', 49, 310, { a: 'l', cls: 'sm' });
mkBtn({ id: 'run', x: 24, y: 323, w: 210, h: 46, cls: 'run', text: '', down: () => toggleRun() });
lab('RUN / STOP', 129, 384, { cls: 'sm' });

lab('FUNCTION', 74, 404, { cls: 'sm' }); lab('PITCH MODE', 184, 404, { cls: 'sm' });
mkBtn({ id: 'fn', x: 24, y: 415, w: 100, h: 31, down: () => { S.fn = true; refresh(); }, up: () => { S.fn = false; refresh(); } });
mkBtn({ id: 'pt', x: 134, y: 415, w: 100, h: 31, down: () => togglePitchTime() });
L.fn = led(74, 461);
L.pitch = led(154, 461); L.time = led(214, 461);
lab('FN', 74, 475, { cls: 'sm', s: 7 }); lab('PITCH', 154, 475, { cls: 'sm', s: 7 }); lab('TIME', 214, 475, { cls: 'sm', s: 7 });

// right cluster
const RX = 676, RW = 68, RG = 76;
const brkX1 = RX, brkX2 = RX + RG + RW;
el('brk', chassis, 'left:' + (brkX1 + 4) + 'px;top:256px;width:' + (brkX2 - brkX1 - 8) + 'px');
lab('TRANSPOSE', (brkX1 + brkX2) / 2, 247, { cls: 'sm' });
lab('ACCENT', RX + 2 * RG + RW / 2, 250, { cls: 'sm' }); lab('SLIDE', RX + 3 * RG + RW / 2, 250, { cls: 'sm' });
L.tr = [];
['down', 'up', 'acc', 'sld'].forEach((nm, i) => {
  const x = RX + i * RG;
  L[nm] = led(x + RW / 2, 271);
  mkBtn({ id: nm, x: x, y: 281, w: RW, h: 36, down: () => onFlagBtn(nm) });
});
lab('DOWN', RX + RW / 2, 328, { cls: 'sm' }); lab('UP', RX + RG + RW / 2, 328, { cls: 'sm' });
['NOTE', 'TIE', 'REST'].forEach((t, i) => lab(t, RX + i * RG + RW / 2, 339, { cls: 'sm', s: 7, c: 'var(--red)' }));
el('brk', chassis, 'left:' + (RX + 4) + 'px;top:346px;width:' + (2 * RG + RW - 8) + 'px;transform:scaleY(-1);border-color:var(--red)');
lab('TIME MODE', RX + RG + RW / 2, 358, { cls: 'sm', s: 7.5, c: 'var(--red)' });
const R2 = [[RX, 'BACK'], [RX + 103, 'WRITE/NEXT'], [RX + 206, 'TAP']];
R2.forEach((r, i) => {
  mkBtn({ id: ['back', 'next', 'tap'][i], x: r[0], y: 372, w: 90, h: 32, down: () => [onBack, onNext, onTap][i]() });
  lab(r[1], r[0] + 45, 414, { cls: 'sm' });
});
L.A = led(RX + 31, 431); L.B = led(RX + 31 + 72, 431);
mkBtn({ id: 'A', x: RX, y: 441, w: 62, h: 33, cls: 'dark', text: 'A', down: () => onSide(0) });
mkBtn({ id: 'B', x: RX + 72, y: 441, w: 62, h: 33, cls: 'dark', text: 'B', down: () => onSide(1) });
lab('SIDE', RX + 67, 483, { cls: 'sm' });

// help button
const helpBtn = el('helpbtn', chassis, 'left:944px;top:470px', '?');
const helpEl = el('', stage, '', '', 'div'); helpEl.id = 'help';
