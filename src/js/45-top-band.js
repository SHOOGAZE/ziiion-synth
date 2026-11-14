/* ---- TOP BAND ---- */
jack(50, 46, 'MIX IN'); jack(210, 46, 'SYNC IN');
lab('WAVEFORM', 130, 14, { cls: 'sm' });
const swWave = mkSwitch(130, 46, S.wave, v => { S.wave = v; send(paramMsg()); save(); osd(v ? 'WAVEFORM  SQUARE' : 'WAVEFORM  SAW'); });
(function waveIcons() {
  const sawSvg = svgEl('svg', { width: 18, height: 12, viewBox: '0 0 18 12' });
  svgEl('polyline', { points: '1,11 9,1 9,11 17,1', fill: 'none', 'stroke-width': 1.6, 'stroke-linejoin': 'round' }, sawSvg);
  sawSvg.style.cssText = 'position:absolute;left:84px;top:40px;overflow:visible';
  chassis.appendChild(sawSvg);
  const sqSvg = svgEl('svg', { width: 18, height: 12, viewBox: '0 0 18 12' });
  svgEl('polyline', { points: '1,11 1,1 9,1 9,11 17,11 17,1', fill: 'none', 'stroke-width': 1.6, 'stroke-linejoin': 'round' }, sqSvg);
  sqSvg.style.cssText = 'position:absolute;left:158px;top:40px;overflow:visible';
  chassis.appendChild(sqSvg);
})();

const knobs = {};
const topKnobs = [
  ['tune', 'TUNING', 301], ['cut', 'CUT OFF FREQ', 381], ['res', 'RESONANCE', 460],
  ['env', 'ENV MOD', 540], ['dec', 'DECAY', 619], ['acc', 'ACCENT', 698]
];
const DEF = { tune: .5, cut: .32, res: .72, env: .7, dec: .32, acc: .65, tempo: .52, vol: .7 };
topKnobs.forEach(t => {
  const key = t[0];
  lab(t[1], t[2], 14, { cls: 'sm' });
  knobs[key] = mkKnob({
    name: key, x: t[2], y: 58, d: 48, value: S.k[key], def: DEF[key],
    onChange: v => {
      S.k[key] = v; send(paramMsg()); save();
      osd(t[1] + '  ' + (key === 'tune' ? (v - .5 >= 0 ? '+' : '') + ((v - .5) * 200).toFixed(0) + ' ct' : Math.round(v * 100) + '%'), 900);
    }
  });
  lab('0', t[2] - 21, 91, { cls: 'sm', s: 7.5 }); lab('10', t[2] + 21, 91, { cls: 'sm', s: 7.5 });
});
// right jacks
[['OUTPUT', 920], ['DC 9V', 966]].forEach(j => jack(j[1], 46, j[0], true));
// effect switches take the freed top-right space
const fxSw = {};
[['dist', 'DIST', 772], ['delay', 'DELAY', 822], ['reverb', 'REVERB', 872]].forEach(f => {
  lab(f[1], f[2], 14, { cls: 'sm' });
  fxSw[f[0]] = mkSwitch(f[2], 46, S[f[0]], v => { S[f[0]] = v; send(paramMsg()); save(); osd(f[1] + (v ? '  ON' : '  OFF')); });
});
el('mark big', chassis, 'left:744px;top:145px;transform:translateX(-50%)', 'ZION 303');
lab('POCKET BASS SEQUENCER', 744, 197, { s: 9.5, w: 800, ls: .1 });
lab('TEMPO', 608, 199, { cls: 'sm' });
