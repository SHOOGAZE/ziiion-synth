const path = require('path');
const { chromium } = require('playwright');
const PAGE = 'file://' + path.resolve(__dirname, '..', 'index.html');
const LAUNCH = { executablePath: process.env.CHROME_PATH || undefined, args: ['--autoplay-policy=no-user-gesture-required', '--no-sandbox'] };
const results = []; const fails = [];
const ok = (name, cond, extra) => { results.push((cond ? 'PASS ' : 'FAIL ') + name + (extra !== undefined ? '  ' + JSON.stringify(extra) : '')); if (!cond) fails.push(name); };
(async () => {
  const browser = await chromium.launch(LAUNCH);
  const errors = [];
  async function open(vw, vh, keepStorage) {
    const ctx = await browser.newContext({ viewport: { width: vw, height: vh }, deviceScaleFactor: 1, hasTouch: true });
    const page = await ctx.newPage();
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', e => errors.push('PAGEERROR ' + e.message));
    await page.goto(PAGE);
    await page.mouse.click(vw / 2, vh / 2);
    await page.waitForFunction(() => window.PB && PB.engine.ready, null, { timeout: 5000 });
    await page.waitForTimeout(300);
    return { ctx, page };
  }
  const evalP = (page, fn, arg) => page.evaluate(fn, arg);
  const dn = (page, id, pid = 1) => page.evaluate(([id, pid]) => { const e = document.querySelector('[data-id="' + id + '"]'); const r = e.getBoundingClientRect(); e.dispatchEvent(new PointerEvent('pointerdown', { pointerId: pid, bubbles: true, clientX: r.x + r.width / 2, clientY: r.y + r.height / 2 })); }, [id, pid]);
  const up = (page, id, pid = 1) => page.evaluate(([id, pid]) => { const e = document.querySelector('[data-id="' + id + '"]'); const r = e.getBoundingClientRect(); e.dispatchEvent(new PointerEvent('pointerup', { pointerId: pid, bubbles: true, clientX: r.x + r.width / 2, clientY: r.y + r.height / 2 })); }, [id, pid]);
  const tap = async (page, id) => { await dn(page, id); await page.waitForTimeout(30); await up(page, id); await page.waitForTimeout(30); };
  const key = async (page, n, hold = 40) => { await page.evaluate(([n]) => { const k = document.querySelectorAll('.wkey,.bkey'); /* index by note */ const w = [0, 2, 4, 5, 7, 9, 11, 12]; const b = [1, 3, 6, 8, 10]; const els = {}; document.querySelectorAll('.wkey').forEach((e, i) => els[w[i]] = e); document.querySelectorAll('.bkey').forEach((e, i) => els[b[i]] = e); const e = els[n]; const r = e.getBoundingClientRect(); e.dispatchEvent(new PointerEvent('pointerdown', { pointerId: 77, bubbles: true, clientX: r.x + 5, clientY: r.y + 5 })); window.__k = e; }, [n]); await page.waitForTimeout(hold); await page.evaluate(() => { window.__k.dispatchEvent(new PointerEvent('pointerup', { pointerId: 77, bubbles: true })); }); await page.waitForTimeout(20); };
  const S = (page) => page.evaluate(() => JSON.parse(JSON.stringify({ mode: PB.S.mode, running: PB.S.running, cursor: PB.S.cursor, edit: PB.S.edit, playIdx: PB.S.playIdx, num: PB.S.num, side: PB.S.side, group: PB.S.group, trackSel: PB.S.trackSel, tracks: PB.S.tracks[0].length, k: PB.S.k, len: PB.S.patterns[PB.S.group * 16 + PB.S.side * 8 + PB.S.num].len })));

  // ---------- landscape tests ----------
  let { ctx, page } = await open(844, 390);
  // A. run/stop
  await tap(page, 'run');
  await page.waitForTimeout(900);
  let s = await S(page);
  ok('run starts', s.running === true);
  ok('playhead advances', s.playIdx >= 3, s.playIdx);
  const ledState = await page.evaluate(() => ({ stepOn: document.querySelectorAll('.led.on').length, runLed: document.querySelectorAll('.led')[16] && true }));
  ok('step LED lit while running', ledState.stepOn >= 1, ledState);
  await tap(page, 'run');
  await page.waitForTimeout(100);
  s = await S(page); ok('run stops', s.running === false);

  // B. write mode editing via taps on mode knob
  await page.evaluate(() => document.querySelector('[data-id=k-mode]').dispatchEvent(new PointerEvent('pointerdown', { pointerId: 5, bubbles: true, clientX: 5, clientY: 5 })));
  await page.evaluate(() => document.querySelector('[data-id=k-mode]').dispatchEvent(new PointerEvent('pointerup', { pointerId: 5, bubbles: true, clientX: 5, clientY: 5 })));
  s = await S(page); ok('mode knob tap -> PATTERN WRITE', s.mode === 3, s.mode);
  await key(page, 1);
  let st0 = await page.evaluate(() => PB.S.patterns[0].steps[0]);
  ok('key writes pitch to cursor step', st0.n === 1 && st0.k === 1, st0);
  await tap(page, 'acc'); // toggle accent on step0 (was 1 -> 0)
  st0 = await page.evaluate(() => PB.S.patterns[0].steps[0]); ok('ACCENT toggles step flag', st0.a === 0, st0);
  await tap(page, 'up'); st0 = await page.evaluate(() => PB.S.patterns[0].steps[0]); ok('UP sets transpose', st0.t === 1, st0);
  await tap(page, 'next'); s = await S(page); ok('WRITE/NEXT advances cursor', s.cursor === 1, s.cursor);
  await tap(page, 'back'); s = await S(page); ok('BACK steps back', s.cursor === 0, s.cursor);
  await tap(page, 'next');
  await tap(page, 'pt'); s = await S(page); ok('PITCH MODE toggles to TIME', s.edit === 'time');
  await tap(page, 'up'); // TIE at cursor 1
  let st1 = await page.evaluate(() => PB.S.patterns[0].steps[1]); s = await S(page);
  ok('TIME: UP = TIE and advances', st1.k === 2 && s.cursor === 2, { st1, c: s.cursor });
  await tap(page, 'acc'); let st2 = await page.evaluate(() => PB.S.patterns[0].steps[2]); ok('TIME: ACCENT = REST', st2.k === 0, st2);
  await tap(page, 'down'); let st3 = await page.evaluate(() => PB.S.patterns[0].steps[3]); ok('TIME: DOWN = NOTE', st3.k === 1, st3);
  await tap(page, 'pt');
  // length via FUNCTION + selector 3
  await dn(page, 'fn', 11); await tap(page, 'sel3'); await up(page, 'fn', 11);
  s = await S(page); ok('FUNCTION+3 sets length 6', s.len === 6, s.len);
  // random
  await dn(page, 'fn', 12); await dn(page, 'clear', 13); await page.waitForTimeout(800); await up(page, 'clear', 13); await up(page, 'fn', 12);
  const notes = await page.evaluate(() => PB.S.patterns[0].steps.filter(x => x.k === 1).length); s = await S(page);
  ok('FUNCTION+hold CLEAR randomizes (len 16)', notes > 3 && s.len === 16, { notes, len: s.len });
  // clear
  await dn(page, 'clear', 14); await page.waitForTimeout(800); await up(page, 'clear', 14);
  const notes2 = await page.evaluate(() => PB.S.patterns[0].steps.filter(x => x.k !== 0).length); ok('hold CLEAR clears pattern', notes2 === 0, notes2);
  // short tap doesn't clear
  await key(page, 5); await tap(page, 'clear'); await page.waitForTimeout(100);
  const notes3 = await page.evaluate(() => PB.S.patterns[0].steps.filter(x => x.k !== 0).length); ok('short tap CLEAR keeps pattern', notes3 === 1, notes3);
  // selector / side / group in write mode
  await tap(page, 'sel4'); await tap(page, 'B'); s = await S(page); ok('selector+side select pattern', s.num === 3 && s.side === 1, s);
  await page.evaluate(() => { const e = document.querySelector('[data-id=k-group]'); e.dispatchEvent(new PointerEvent('pointerdown', { pointerId: 6, bubbles: true, clientX: 5, clientY: 5 })); e.dispatchEvent(new PointerEvent('pointerup', { pointerId: 6, bubbles: true, clientX: 5, clientY: 5 })); });
  s = await S(page); ok('group knob tap -> II', s.group === 1, s.group);

  // C. track write/play
  await page.evaluate(() => { PB.S.group = 0; PB.S.num = 0; PB.S.side = 0; });
  await page.evaluate(() => { const e = document.querySelector('[data-id=k-mode]'); e.dispatchEvent(new PointerEvent('pointerdown', { pointerId: 7, bubbles: true, clientX: 5, clientY: 5 })); e.dispatchEvent(new PointerEvent('pointerup', { pointerId: 7, bubbles: true, clientX: 5, clientY: 5 })); });
  s = await S(page); ok('mode tap wraps to TRACK WRITE', s.mode === 0, s.mode);
  await tap(page, 'next'); await tap(page, 'sel2'); await tap(page, 'next');
  s = await S(page); ok('TRACK WRITE appends patterns', s.tracks === 2, s.tracks);
  await tap(page, 'back'); s = await S(page); ok('TRACK WRITE BACK removes', s.tracks === 1, s.tracks);
  await tap(page, 'next');
  await page.evaluate(() => { const e = document.querySelector('[data-id=k-mode]'); e.dispatchEvent(new PointerEvent('pointerdown', { pointerId: 8, bubbles: true, clientX: 5, clientY: 5 })); e.dispatchEvent(new PointerEvent('pointerup', { pointerId: 8, bubbles: true, clientX: 5, clientY: 5 })); });
  s = await S(page); ok('mode -> TRACK PLAY', s.mode === 1, s.mode);
  await tap(page, 'run'); await page.waitForTimeout(300);
  const mapLen = await page.evaluate(() => PB.buildPlay().map.length); ok('TRACK PLAY playlist = 2 patterns', mapLen === 32, mapLen);
  await tap(page, 'run');

  // D. tap tempo
  await tap(page, 'tap'); await page.waitForTimeout(500); await tap(page, 'tap'); await page.waitForTimeout(500); await tap(page, 'tap');
  const bpm = await page.evaluate(() => Math.round(50 + PB.S.k.tempo * 150)); ok('tap tempo ~107 BPM (560ms taps)', Math.abs(bpm - 107) <= 5, bpm);

  // E. knob drag (landscape: up = increase)
  const before = await page.evaluate(() => PB.S.k.cut);
  const box = await page.evaluate(() => { const r = document.querySelector('[data-id=k-cut]').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
  await page.mouse.move(box.x, box.y); await page.mouse.down(); await page.mouse.move(box.x, box.y - 40, { steps: 6 }); await page.mouse.up();
  const after = await page.evaluate(() => PB.S.k.cut); ok('knob drag up increases (landscape)', after > before + 0.15, { before, after });

  // F. persistence
  await page.waitForTimeout(600);
  const saved = await page.evaluate(() => !!localStorage.getItem('pb303.v1')); ok('state saved to localStorage', saved);
  // G. offline render through the real worklet in-page
  const rend = await page.evaluate(async () => {
    const sr = 44100, oc = new OfflineAudioContext(2, sr * 4, sr);
    const node = await PB.createEngine(oc);
    const p = PB.parsePat('E1^ . E1 E2 . E1~ G1 . E1 . E1^ B1 . A1~ G1 .');
    const seq = p.steps.map(st => st.k === 1 ? [1, 36 + st.n + 12 * st.t, st.a, st.s] : [st.k === 2 ? 2 : 0]);
    let steps = 0; node.port.onmessage = e => { if (e.data.t === 's') steps++; };
    node.port.postMessage({ t: 'seq', seq, at: 'now' }); node.port.postMessage({ t: 'bpm', v: 128 }); node.port.postMessage({ t: 'run', on: true });
    await new Promise(r => setTimeout(r, 300)); const buf = await oc.startRendering(); const d = buf.getChannelData(0);
    let peak = 0, sum = 0, nan = 0; for (const v of d) { if (!isFinite(v)) nan++; peak = Math.max(peak, Math.abs(v)); sum += v * v; }
    return { peak, rms: Math.sqrt(sum / d.length), nan, steps };
  });
  ok('in-page worklet renders audio', rend.rms > 0.05 && rend.peak < 1.001 && rend.nan === 0, rend);
  ok('worklet reports steps', rend.steps >= 20, rend.steps);
  await ctx.close();

  // reload: persisted state restored
  ({ ctx, page } = await open(844, 390));
  // (new context => fresh storage; just ensure boots)
  s = await S(page); ok('boots clean in fresh context', s.mode === 2);
  await ctx.close();

  // ---------- portrait: rotated drag mapping ----------
  ({ ctx, page } = await open(390, 844));
  const rot = await page.evaluate(() => PB.view.rot); ok('portrait rotates stage 90deg', rot === 90, rot);
  const pb = await page.evaluate(() => { const r = document.querySelector('[data-id=k-res]').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, v: PB.S.k.res }; });
  await page.mouse.move(pb.x, pb.y); await page.mouse.down(); await page.mouse.move(pb.x + 30, pb.y, { steps: 6 }); await page.mouse.up();
  const rv = await page.evaluate(() => PB.S.k.res); ok('portrait: drag toward local-up (screen right) increases', rv > pb.v + 0.1 || rv === 1, { from: pb.v, to: rv });
  // run via real click in rotated view
  const rb = await page.evaluate(() => { const r = document.querySelector('[data-id=run]').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
  await page.mouse.click(rb.x, rb.y); await page.waitForTimeout(500);
  s = await S(page); ok('portrait: RUN via real click', s.running === true);
  await ctx.close();

  await browser.close();
  console.log(results.join('\n'));
  console.log('\nconsole errors:', errors.length ? errors : 'none');
  console.log(fails.length ? 'FAILED: ' + fails.join(', ') : 'ALL PASSED');
})();
