/* ---- volume ---- */
lab('VOLUME', 886, 107);
knobs.vol = mkKnob({
  name: 'vol', x: 886, y: MY, d: 74, value: S.k.vol, def: DEF.vol,
  onChange: v => { S.k.vol = v; send(paramMsg()); save(); osd('VOLUME  ' + Math.round(v * 100) + '%', 900); }
});
lab('MIN', 848, 216, { cls: 'sm' }); lab('MAX', 924, 216, { cls: 'sm' });
