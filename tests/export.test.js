const path = require('path');
const { chromium } = require('playwright');
const PAGE = 'file://' + path.resolve(__dirname, '..', 'index.html');
const LAUNCH = { executablePath: process.env.CHROME_PATH || undefined, args: ['--autoplay-policy=no-user-gesture-required', '--no-sandbox'] };
const fs = require('fs');
(async () => {
  const browser = await chromium.launch(LAUNCH);
  const ctx = await browser.newContext({ viewport: { width: 844, height: 390 }, deviceScaleFactor: 2, hasTouch: true, acceptDownloads: true });
  const page = await ctx.newPage(); const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); }); page.on('pageerror', e => errors.push(e.message));
  await page.goto(PAGE);
  await page.mouse.click(422, 195); await page.waitForFunction(() => PB.engine.ready);
  const ev = (id, t, pid = 1) => page.evaluate(([id, t, pid]) => { const e = document.querySelector('[data-id="' + id + '"]'); const r = e.getBoundingClientRect(); e.dispatchEvent(new PointerEvent(t, { pointerId: pid, bubbles: true, clientX: r.x + 5, clientY: r.y + 5 })); }, [id, t, pid]);
  const tap = async id => { await ev(id, 'pointerdown'); await ev(id, 'pointerup'); await page.waitForTimeout(40); };
  const r = [];
  // copy / paste / undo (pattern play mode = 2)
  await page.evaluate(() => { PB.S.num = 0; PB.refresh(); });
  await ev('fn', 'pointerdown', 9); await tap('barreset'); await ev('fn', 'pointerup', 9);
  await page.evaluate(() => { PB.S.num = 5; });
  await ev('fn', 'pointerdown', 9); await tap('tap'); await ev('fn', 'pointerup', 9);
  r.push(['paste copies pattern 1 into 6', await page.evaluate(() => JSON.stringify(PB.S.patterns[5]) === JSON.stringify(PB.S.patterns[0]))]);
  await ev('fn', 'pointerdown', 9); await tap('back'); await ev('fn', 'pointerup', 9);
  r.push(['undo restores pattern 6 original', await page.evaluate(() => JSON.stringify(PB.S.patterns[5]) !== JSON.stringify(PB.S.patterns[0]))]);
  // midi
  await page.evaluate(() => { PB.S.num = 0; });
  const mid = await page.evaluate(() => Array.from(PB.midiBytes()));
  fs.writeFileSync(require('os').tmpdir() + '/zion-test.mid', Buffer.from(mid));
  // wav, delay on
  await page.evaluate(() => { PB.S.delay = 1; });
  const wav = await page.evaluate(async () => { const b = await PB.renderWav(); return Array.from(b); });
  fs.writeFileSync(require('os').tmpdir() + '/zion-test.wav', Buffer.from(wav));
  // download path through help button
  await page.evaluate(() => document.querySelector('.helpbtn').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: 3 })));
  await page.waitForTimeout(200); await page.evaluate(() => [...document.querySelectorAll('#help .tabs span')].find((t, i, a) => i === a.length - 1).click()); await page.waitForTimeout(150);
  const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 15000 }), page.evaluate(() => document.querySelector('.xbtn[data-x=mid]').click())]);
  r.push(['MIDI download via help button', dl.suggestedFilename()]);
  await page.waitForTimeout(2000);
  const manifest = await page.evaluate(() => !!document.querySelector('link[rel=manifest]') && !!document.querySelector('link[rel=apple-touch-icon]'));
  r.push(['manifest+icon injected', manifest]);
  await page.evaluate(() => document.querySelector('#help').classList.remove('open'));
    console.log(r.map(x => x.join(': ')).join('\n')); console.log('errors:', errors.length ? errors : 'none');
  await browser.close();
})();
