/* ---- MID BAND ---- */
const MY = 168;
lab('TEMPO', 130, 107);
knobs.tempo = mkKnob({
  name: 'tempo', x: 130, y: MY, d: 74, value: S.k.tempo, def: DEF.tempo,
  onChange: v => { S.k.tempo = v; send({ t: 'bpm', v: bpmOf(v) }); save(); osd('TEMPO  ' + bpmOf(v) + ' BPM', 900); }
});
lab('SLOW', 92, 216, { cls: 'sm' }); lab('FAST', 168, 216, { cls: 'sm' });

lab('PATT. GROUP', 290, 107);
const grpAngles = [-90, -30, 30, 90];
knobs.group = mkKnob({
  name: 'group', x: 290, y: MY, d: 64, sel: true, angles: grpAngles, value: S.group / 3,
  onChange: (v, a) => { S.group = a.index; S.cursor = 0; afterSelect(); osd('GROUP  ' + ROMAN[S.group]); }
});
grpAngles.forEach((a, i) => {
  const r = 43, rad = a * Math.PI / 180;
  lab(ROMAN[i], 290 + r * Math.sin(rad), MY - r * Math.cos(rad), { s: 10, w: 800 });
});

lab('MODE', 455, 107);
const modeAngles = [-135, -45, 45, 135];
knobs.mode = mkKnob({
  name: 'mode', x: 455, y: MY, d: 64, sel: true, angles: modeAngles, value: S.mode / 3,
  onChange: (v, a) => { S.mode = a.index; S.cursor = 0; S.edit = 'pitch'; afterSelect(); osd(MODES[S.mode]); }
});
[['WRITE', -135, 'r'], ['PLAY', -45, 'r'], ['PLAY', 45, 'l'], ['WRITE', 135, 'l']].forEach(t => {
  const r = 49, rad = t[1] * Math.PI / 180;
  lab(t[0], 455 + r * Math.sin(rad) + (t[2] === 'r' ? -2 : 2), MY - r * Math.cos(rad), { a: t[2], cls: 'sm', s: 8 });
});
lab('TRACK', 360, MY, { cls: 'sm', rot: -90 });
lab('PATTERN', 553, MY, { cls: 'sm', rot: 90 });
el('', chassis, 'position:absolute;left:367px;top:126px;width:2px;height:84px;background:var(--ink);opacity:.75');
el('', chassis, 'position:absolute;left:541px;top:126px;width:2px;height:84px;background:var(--ink);opacity:.75');
