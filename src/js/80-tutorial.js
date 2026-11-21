/* ---- tutorial (tabs, schematic of the panel, mode knob, example pattern) ---- */
const SVGNS = 'http://www.w3.org/2000/svg';
function schem(marks) {
  let h = '<svg viewBox="0 0 1000 500" class="schem"><defs><radialGradient id="sgk" cx=".38" cy=".28" r=".85"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="#c8d0d8" stop-opacity=".6"/></radialGradient></defs>' +
    '<rect x="4" y="4" width="992" height="492" rx="26" fill="#eceff2" stroke="#8f959e" stroke-width="3"/>' +
    '<line x1="8" x2="992" y1="96" y2="96" stroke="#8d939c" stroke-width="2"/><line x1="8" x2="992" y1="226" y2="226" stroke="#8d939c" stroke-width="2"/>';
  const gk = (x, y, r) => '<circle cx="' + x + '" cy="' + (y + 3) + '" r="' + r + '" fill="#3c4654" opacity=".18"/><circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="url(#sgk)" stroke="#8f959e" stroke-width="2"/><circle cx="' + x + '" cy="' + y + '" r="' + (r * .6) + '" fill="#fff" fill-opacity=".45" stroke="#b4bcc6" stroke-width="1.5"/><rect x="' + (x - 1.8) + '" y="' + (y - r * .96) + '" width="3.6" height="' + (r * .5) + '" fill="#c8452f"/>';
  const circ = (x, y, r, f) => '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + (f || '#17181b') + '"/>';
  [301, 381, 460, 540, 619, 698].forEach(x => { h += gk(x, 58, 24); });
  [130, 772, 822, 872].forEach(x => { h += '<rect x="' + (x - 24) + '" y="38" width="48" height="18" rx="4" fill="#17181b"/>'; });
  [50, 210, 920, 966].forEach(x => { h += circ(x, 46, 12, '#8d909a'); });
  [[130, 168, 37], [290, 168, 32], [455, 168, 32], [886, 168, 37]].forEach(k => { h += gk(k[0], k[1], k[2]); });
  h += '<rect x="562" y="114" width="264" height="108" rx="10" fill="#070708"/><text x="574" y="140" font-family="Courier New,monospace" font-weight="700" font-size="22" fill="#f4f5f7">ZIIION</text><text x="812" y="150" text-anchor="end" font-family="Courier New,monospace" font-weight="700" font-size="52" fill="#f4f5f7">128</text><rect x="562" y="104" width="8" height="8" fill="#c8452f"/>';
  [[24, 261, 100, 31, '#c5cad0'], [134, 261, 100, 31, '#c5cad0'], [24, 323, 210, 46, '#f6f7f8'], [24, 415, 100, 31, '#f6f7f8'], [134, 415, 100, 31, '#f6f7f8']]
    .forEach(r => { h += '<rect x="' + r[0] + '" y="' + r[1] + '" width="' + r[2] + '" height="' + r[3] + '" rx="5" fill="' + r[4] + '" stroke="#a8aeb6" stroke-width="2"/>'; });
  for (let i = 0; i < 16; i++) h += circ(285 + i * 23.6, 251, 5, '#6a1c14');
  [320, 367, 462, 509, 557].forEach(x => { h += '<rect x="' + (x - 19) + '" y="299" width="38" height="48" rx="5" fill="#1f2125"/>'; });
  [297, 344, 391, 439, 486, 533, 580, 628].forEach(x => { h += '<rect x="' + (x - 21) + '" y="356" width="42" height="54" rx="5" fill="#fafafb" stroke="#a4aab2" stroke-width="2"/><rect x="' + (x - 20) + '" y="441" width="40" height="33" rx="5" fill="#1f2125"/>'; });
  [706, 781, 856, 931].forEach(x => { h += '<rect x="' + (x - 35) + '" y="278" width="70" height="40" rx="5" fill="#f1f1f3" stroke="#a8aeb6" stroke-width="2"/>'; });
  [[671, 94], [772, 94], [873, 94]].forEach(r => { h += '<rect x="' + r[0] + '" y="370" width="' + r[1] + '" height="36" rx="5" fill="#f1f1f3" stroke="#a8aeb6" stroke-width="2"/>'; });
  [[672, 62], [744, 62]].forEach(r => { h += '<rect x="' + r[0] + '" y="441" width="' + r[1] + '" height="33" rx="5" fill="#1f2125"/>'; });
  h += '<rect x="838" y="441" width="84" height="29" rx="5" fill="#c5cad0"/>';
  (marks || []).forEach(m => {
    if (m.box) h += '<rect x="' + m.box[0] + '" y="' + m.box[1] + '" width="' + m.box[2] + '" height="' + m.box[3] + '" rx="10" fill="rgba(211,32,15,.10)" stroke="#d3200f" stroke-width="5" stroke-dasharray="14 8"/>';
    h += '<circle cx="' + m.x + '" cy="' + m.y + '" r="19" fill="#d3200f" stroke="#fff" stroke-width="3"/><text x="' + m.x + '" y="' + (m.y + 8) + '" text-anchor="middle" font-family="Helvetica,Arial" font-weight="900" font-size="22" fill="#fff">' + m.n + '</text>';
  });
  return h + '</svg>';
}
function modeSvg() {
  const pos = [[-135, 'TRACK WRITE', 'нижний левый'], [-45, 'TRACK PLAY', 'верхний левый'], [45, 'PATTERN PLAY', 'верхний правый'], [135, 'PATTERN WRITE', 'нижний правый']];
  let h = '<svg viewBox="-5 0 320 200" class="modesvg"><defs><radialGradient id="mk" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#fafafa"/><stop offset="1" stop-color="#b4b7bf"/></radialGradient></defs>' +
    '<circle cx="150" cy="104" r="42" fill="#000" opacity=".25"/><circle cx="150" cy="100" r="41" fill="#8f929b"/>' +
    '<circle cx="150" cy="100" r="36.5" fill="none" stroke="#555861" stroke-width="7" stroke-dasharray="1.6 2.2"/>' +
    '<circle cx="150" cy="100" r="31" fill="url(#mk)" stroke="#9a9da6" stroke-width="1.5"/>' +
    '<line x1="150" y1="100" x2="150" y2="76" stroke="#25262a" stroke-width="4.5" stroke-linecap="round" transform="rotate(135 150 100)"/>';
  pos.forEach((p, i) => {
    const a = p[0] * Math.PI / 180, x = 150 + 56 * Math.sin(a), y = 100 - 56 * Math.cos(a);
    const tx = 150 + 64 * Math.sin(a), ty = 100 - 64 * Math.cos(a);
    h += '<circle cx="' + x + '" cy="' + y + '" r="5" fill="' + (i === 3 ? '#d3200f' : '#4b4d55') + '"/>' +
      '<text x="' + tx + '" y="' + (ty + (ty < 100 ? -6 : 14)) + '" text-anchor="' + (tx < 150 ? 'end' : 'start') + '" font-family="Helvetica,Arial" font-weight="800" font-size="12" fill="' + (i === 3 ? '#a8281b' : '#25262a') + '">' + p[1] + '</text>';
  });
  return h + '</svg>';
}
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
function stepStrip(str) {
  const p = parsePat(str);
  let h = '<div class="strip">';
  p.steps.forEach((st, i) => {
    const m = stepMidi(st);
    h += '<div class="sc' + (st.k === 0 ? ' r' : st.k === 2 ? ' t' : '') + (st.a ? ' ac' : '') + '"><em>' + (i + 1) + '</em><b>' +
      (st.k === 1 ? NOTE_NAMES[m % 12] + '<sub>' + (Math.floor(m / 12) - 1) + '</sub>' : st.k === 2 ? '＿' : '·') + '</b><u>' + (st.s ? '〰' : '') + '</u></div>';
  });
  return h + '</div>';
}
const HELP_PAGES = [
  [() => T('СТАРТ', 'START'), () =>
    '<div class="fig">' + schem([{ x: 129, y: 346, n: 1, box: [20, 318, 218, 56] }, { x: 462, y: 328, n: 2, box: [270, 293, 385, 125] }, { x: 540, y: 58, n: 3, box: [280, 30, 440, 56] }, { x: 607, y: 212, n: 4, box: [560, 144, 94, 50] }, { x: 880, y: 455, n: 5, box: [832, 436, 96, 42] }]) + '</div>' +
    '<ol class="steps">' +
    '<li>' + T('<b>RUN/STOP</b> — запуск. Паттерн <i>I‑1A</i> уже записан.', '<b>RUN/STOP</b> starts playback. Pattern <i>I‑1A</i> is already loaded.') + '</li>' +
    '<li>' + T('<b>Клавиши C…C</b> играют вживую. На Mac: <b>A W S E D F T G Y H U J K</b>, пробел — RUN.', '<b>Keys C…C</b> play live. On a computer: <b>A W S E D F T G Y H U J K</b>, Space = RUN.') + '</li>' +
    '<li>' + T('<b>CUT OFF</b>, <b>RESONANCE</b>, <b>ENV MOD</b> — основа кислотного звука. Ручки: свайп вверх/вниз, двойной тап — сброс.', '<b>CUT OFF</b>, <b>RESONANCE</b> and <b>ENV MOD</b> make the acid sound. Knobs: swipe up/down, double‑tap to reset.') + '</li>' +
    '<li>' + T('<b>TEMPO</b> или несколько тапов по <b>TAP</b>. Темп виден на дисплее.', 'Turn <b>TEMPO</b> or tap <b>TAP</b> a few times. The tempo shows on the display.') + '</li>' +
    '<li>' + T('<b>LIB</b> — готовые пресеты и рандом.', '<b>LIB</b> opens ready‑made presets and a random button.') + '</li></ol>'],
  [() => T('ПАНЕЛЬ', 'PANEL'), () =>
    '<div class="fig">' + schem([{ x: 130, y: 20, n: 1 }, { x: 460, y: 20, n: 2 }, { x: 822, y: 20, n: 3 }, { x: 290, y: 118, n: 4, box: [254, 130, 72, 76] }, { x: 455, y: 118, n: 5, box: [419, 130, 72, 76] }, { x: 886, y: 118, n: 6 }, { x: 129, y: 246, n: 7, box: [20, 256, 218, 40] }, { x: 462, y: 428, n: 8, box: [270, 436, 385, 42] }, { x: 810, y: 342, n: 9 }]) + '</div>' +
    '<ol class="steps tight">' +
    '<li>' + T('<b>WAVEFORM</b> — пила / квадрат.', '<b>WAVEFORM</b> — saw / square.') + '</li>' +
    '<li>' + T('<b>TUNING</b>, <b>CUT OFF</b> (частота фильтра), <b>RESONANCE</b> (писк), <b>ENV MOD</b> (как сильно огибающая открывает фильтр), <b>DECAY</b> (длина огибающей), <b>ACCENT</b> (сила акцентных шагов).', '<b>TUNING</b>, <b>CUT OFF</b> (filter frequency), <b>RESONANCE</b> (squeal), <b>ENV MOD</b> (how far the envelope opens the filter), <b>DECAY</b> (envelope length), <b>ACCENT</b> (strength of accented steps).') + '</li>' +
    '<li>' + T('<b>DIST</b>, <b>DELAY</b> (пинг‑понг 3/16), <b>REVERB</b> — эффекты.', '<b>DIST</b>, <b>DELAY</b> (ping‑pong 3/16), <b>REVERB</b> — effects.') + '</li>' +
    '<li>' + T('<b>PATT. GROUP</b> I–IV — группа паттернов.', '<b>PATT. GROUP</b> I–IV — pattern group.') + '</li>' +
    '<li>' + T('<b>MODE</b> — режим (см. «ЗАПИСЬ»).', '<b>MODE</b> — operating mode (see WRITE).') + '</li>' +
    '<li>' + T('<b>VOLUME</b> — громкость.', '<b>VOLUME</b> — master level.') + '</li>' +
    '<li>' + T('<b>PATTERN CLEAR</b>, <b>BAR RESET</b>: очистить, вернуть в начало такта.', '<b>PATTERN CLEAR</b>, <b>BAR RESET</b>: clear the pattern, jump back to bar start.') + '</li>' +
    '<li>' + T('<b>SELECTOR 1–8</b> + <b>A/B</b> — номер паттерна внутри группы. Смена при игре — на стыке такта.', '<b>SELECTOR 1–8</b> + <b>A/B</b> — pattern number inside the group. While playing, the change happens at the next bar.') + '</li>' +
    '<li>' + T('<b>DOWN / UP / ACCENT / SLIDE</b> — флаги шага.', '<b>DOWN / UP / ACCENT / SLIDE</b> — step flags.') + '</li></ol>'],
  [() => T('ЗАПИСЬ', 'WRITE'), () =>
    '<div class="two"><div class="fig sm">' + modeSvg() + '<p class="cap">' + T('Ручка <b>MODE</b>: для записи паттерна — нижний правый.', '<b>MODE</b> knob: for writing a pattern use the lower right position.') + '</p></div>' +
    '<ol class="steps tight">' +
    '<li>' + T('<b>MODE</b> → <i>PATTERN WRITE</i>. Выбери паттерн: <b>PATT. GROUP</b>, <b>A/B</b>, <b>SELECTOR</b>.', '<b>MODE</b> → <i>PATTERN WRITE</i>. Pick a pattern with <b>PATT. GROUP</b>, <b>A/B</b> and <b>SELECTOR</b>.') + '</li>' +
    '<li>' + T('Удерживай <b>PATTERN CLEAR</b> — паттерн очищается. Мигающий светодиод в ряду шагов — курсор (можно тапнуть по номеру шага).', 'Hold <b>PATTERN CLEAR</b> to wipe it. The blinking LED in the step row is the cursor (you can tap a step number).') + '</li>' +
    '<li>' + T('<b>Клавиша</b> = нота этого шага. <b>WRITE/NEXT</b> — следующий шаг, <b>BACK</b> — назад.', 'A <b>key</b> sets the note of this step. <b>WRITE/NEXT</b> moves to the next step, <b>BACK</b> goes back.') + '</li>' +
    '<li>' + T('Флаги шага: <b>DOWN/UP</b> — октава −/+, <b>ACCENT</b>, <b>SLIDE</b> (плавный переход в следующую ноту без повторной атаки).', 'Step flags: <b>DOWN/UP</b> octave −/+, <b>ACCENT</b>, <b>SLIDE</b> (glide into the next note without a new attack).') + '</li>' +
    '<li>' + T('<b>PITCH MODE</b> → <b>TIME MODE</b>: DOWN = нота, UP = лига (TIE), ACCENT = пауза (REST). Курсор идёт сам.', '<b>PITCH MODE</b> → <b>TIME MODE</b>: DOWN = note, UP = tie, ACCENT = rest. The cursor advances by itself.') + '</li></ol></div>' +
    '<p class="cap l">' + T('Пример паттерна: высота — клавишами, красная метка — акцент, 〰 — слайд, ＿ — лига, · — пауза.', 'Example pattern: pitch comes from the keys, red frame = accent, 〰 = slide, ＿ = tie, · = rest.') + '</p>' + stepStrip('E1^ . E1 E2 . E1~ G1 . E1 . E1^ B1 . A1~ G1 .') +
    '<p class="cap l">' + T('<b>FUNCTION</b> (держать) + тап по номеру шага — длина паттерна · + <b>SELECTOR</b> — длина 2…16 · + <b>BACK</b> — отмена · + <b>BAR RESET</b> — копировать · + <b>TAP</b> — вставить · + удержание <b>PATTERN CLEAR</b> — случайный паттерн.', 'Hold <b>FUNCTION</b> + tap a step number = pattern length · + <b>SELECTOR</b> = length 2…16 · + <b>BACK</b> = undo · + <b>BAR RESET</b> = copy · + <b>TAP</b> = paste · + hold <b>PATTERN CLEAR</b> = random pattern.') + '</p>'],
  [() => T('ТРЕКИ', 'TRACKS'), () =>
    '<div class="two"><div class="fig sm"><svg viewBox="0 0 300 120" class="modesvg"><g font-family="Helvetica,Arial" font-weight="800" font-size="12" fill="#25262a">' +
    '<rect x="8" y="22" width="52" height="34" rx="5" fill="#1f2125"/><text x="34" y="44" text-anchor="middle" fill="#fff">I‑1A</text>' +
    '<rect x="68" y="22" width="52" height="34" rx="5" fill="#1f2125"/><text x="94" y="44" text-anchor="middle" fill="#fff">I‑3A</text>' +
    '<rect x="128" y="22" width="52" height="34" rx="5" fill="#1f2125"/><text x="154" y="44" text-anchor="middle" fill="#fff">I‑1A</text>' +
    '<rect x="188" y="22" width="52" height="34" rx="5" fill="#1f2125"/><text x="214" y="44" text-anchor="middle" fill="#fff">II‑2B</text>' +
    '<text x="8" y="14" font-size="11">' + T('ТРЕК 1 — цепочка паттернов', 'TRACK 1 — a chain of patterns') + '</text><text x="248" y="46" fill="#d3200f" font-size="18">…</text></g></svg>' +
    '<p class="cap">' + T('Трек — цепочка паттернов, играется по кругу.', 'A track is a chain of patterns that loops.') + '</p></div>' +
    '<ol class="steps tight">' +
    '<li>' + T('<b>MODE</b> → <i>TRACK WRITE</i> (нижний левый).', '<b>MODE</b> → <i>TRACK WRITE</i> (lower left).') + '</li>' +
    '<li>' + T('<b>FUNCTION</b> + <b>SELECTOR 1–8</b> — выбрать трек. Просто <b>SELECTOR</b> — выбрать паттерн.', '<b>FUNCTION</b> + <b>SELECTOR 1–8</b> picks the track. A plain <b>SELECTOR</b> picks the pattern.') + '</li>' +
    '<li>' + T('<b>WRITE/NEXT</b> — добавить выбранный паттерн в конец цепочки, <b>BACK</b> — убрать последний. Удержание <b>PATTERN CLEAR</b> — очистить трек.', '<b>WRITE/NEXT</b> appends the selected pattern to the chain, <b>BACK</b> removes the last one. Hold <b>PATTERN CLEAR</b> to empty the track.') + '</li>' +
    '<li>' + T('<b>MODE</b> → <i>TRACK PLAY</i> (верхний левый), <b>SELECTOR</b> — выбор трека, <b>RUN</b> — играть цепочку.', '<b>MODE</b> → <i>TRACK PLAY</i> (upper left): <b>SELECTOR</b> picks the track, <b>RUN</b> plays the chain.') + '</li></ol></div>' +
    '<p class="cap l">' + T('Всё сохраняется само: паттерны, треки, ручки, эффекты.', 'Everything is saved automatically: patterns, tracks, knobs, effects.') + '</p>'],
  [() => 'LIB', () =>
    '<div class="two"><div class="fig sm"><svg viewBox="0 0 300 130" class="modesvg"><rect x="10" y="10" width="280" height="110" rx="10" fill="#dcdee3" stroke="#62656d" stroke-width="3"/>' +
    '<rect x="22" y="22" width="120" height="30" rx="5" fill="#eeeff1" stroke="#a8aeb6"/><text x="32" y="42" font-family="Helvetica,Arial" font-weight="800" font-size="12" fill="#25262a">ACID CLASSIC</text>' +
    '<rect x="152" y="22" width="126" height="30" rx="5" fill="#3a3d4d"/><text x="162" y="42" font-family="Helvetica,Arial" font-weight="800" font-size="12" fill="#f3f3ef">SQUELCH</text>' +
    '<rect x="22" y="60" width="120" height="30" rx="5" fill="#eeeff1" stroke="#a8aeb6"/><text x="32" y="80" font-family="Helvetica,Arial" font-weight="800" font-size="12" fill="#25262a">DEEP HOUSE</text>' +
    '<rect x="152" y="60" width="126" height="30" rx="5" fill="#eeeff1" stroke="#a8aeb6"/><text x="162" y="80" font-family="Helvetica,Arial" font-weight="800" font-size="12" fill="#25262a">RAVE STAB</text></svg>' +
    '<p class="cap">' + T('Тёмная плашка — выбранный пресет.', 'The dark tile is the selected preset.') + '</p></div>' +
    '<ol class="steps tight">' +
    '<li>' + T('Тап по строке — загрузить пресет: <b>паттерн + темп + звук</b>. Играет секвенсор — смена на стыке такта.', 'Tap a tile to load a preset: <b>pattern + tempo + sound</b>. If the sequencer is running, the change lands on the next bar.') + '</li>' +
    '<li>' + T('<b>ПАТТЕРН</b> / <b>ЗВУК</b> — что именно загружать. Выключи «ПАТТЕРН» — поменяется только звук.', '<b>PATTERN</b> / <b>SOUND</b> choose what gets loaded. Switch PATTERN off to change only the sound.') + '</li>' +
    '<li>' + T('<b>РАНДОМ</b> — случайный паттерн в случайной тональности и случайный звук.', '<b>RANDOM</b> builds a random pattern in a random key with a random sound.') + '</li>' +
    '<li>' + T('<b>▶/■</b> — играть/стоп, <b>ОТМЕНИТЬ</b> — вернуть всё, как было при открытии.', '<b>▶/■</b> play / stop, <b>REVERT</b> restores everything to how it was when you opened the sheet.') + '</li>' +
    '<li>' + T('<b>СОХРАНИТЬ ТЕКУЩЕЕ</b> — свой пресет под своим именем (× — удалить). <b>ЭКСПОРТ / ИМПОРТ</b> — файлом .json.', '<b>SAVE CURRENT</b> stores your own preset under a name (× deletes it). <b>EXPORT / IMPORT</b> move presets as a .json file.') + '</li></ol></div>'],
  [() => T('ЭКСПОРТ', 'EXPORT'), () =>
    '<ol class="steps"><li>' + T('<b>WAV · ЛУП</b> — рендер текущего паттерна (или трека) со звуком, эффектами и хвостом реверба.', '<b>WAV · LOOP</b> renders the current pattern (or track) with sound, effects and the reverb tail.') + '</li>' +
    '<li>' + T('<b>MIDI · ПАТТЕРН</b> — нотный файл: акценты — громче, слайды — легато. Подходит для Digitakt и DAW.', '<b>MIDI · PATTERN</b> exports notes: accents are louder, slides are legato. Works with hardware sequencers and DAWs.') + '</li></ol>' +
    '<div class="exp"><span class="xbtn" data-x="wav">' + T('WAV · ЛУП', 'WAV · LOOP') + '</span><span class="xbtn" data-x="mid">' + T('MIDI · ПАТТЕРН', 'MIDI · PATTERN') + '</span></div>' +
    '<p class="cap l">' + T('Файл имеет имя вида <b>ZIIION‑I‑1A‑130bpm.wav</b>. В портретной ориентации корпус повёрнут — клади телефон набок.', 'Files are named like <b>ZIIION‑I‑1A‑130bpm.wav</b>. In portrait the panel is rotated — hold the phone sideways.') + '</p>']
];
helpEl.innerHTML = '<div class="x"></div><div class="lang"><span data-l="ru">RU</span><span data-l="en">EN</span></div><div class="tabs"></div><div class="pg"></div>';
const helpTabs = helpEl.querySelector('.tabs'), helpPg = helpEl.querySelector('.pg');
let helpIdx = 0;
function helpShow(i) {
  helpIdx = i;
  helpEl.querySelector('.x').textContent = T('ЗАКРЫТЬ ✕', 'CLOSE ✕');
  helpEl.querySelectorAll('.lang span').forEach(l => l.classList.toggle('on', l.dataset.l === LANG));
  helpTabs.innerHTML = '';
  HELP_PAGES.forEach((p, j) => { const t = document.createElement('span'); t.textContent = p[0](); t.classList.toggle('on', j === i); t.addEventListener('click', () => helpShow(j)); helpTabs.appendChild(t); });
  helpPg.innerHTML = i < 2 ? '<div class="two">' + HELP_PAGES[i][1]() + '</div>' : HELP_PAGES[i][1]();
  helpPg.querySelectorAll('.xbtn').forEach(wireExport);
}
helpEl.querySelectorAll('.lang span').forEach(l => l.addEventListener('click', () => {
  LANG = l.dataset.l; try { localStorage.setItem('pb303.lang', LANG); } catch (e) { /* ignore */ }
  libLang(); helpShow(helpIdx);
}));
helpBtn.addEventListener('pointerdown', e => { e.preventDefault(); helpShow(0); helpEl.classList.add('open'); });
helpEl.querySelector('.x').addEventListener('pointerdown', e => { e.preventDefault(); helpEl.classList.remove('open'); });
function wireExport(b) {
  b.addEventListener('click', async e => {
    e.preventDefault();
    if (b.dataset.busy) return;
    const label = b.textContent; b.dataset.busy = '1'; b.textContent = '…';
    try {
      if (b.dataset.x === 'wav') await exportWav(); else exportMidi();
      b.textContent = T('ГОТОВО ✓', 'DONE ✓');
    } catch (err) { b.textContent = err && err.message === 'empty' ? T('ПАТТЕРН ПУСТ', 'PATTERN EMPTY') : T('ОШИБКА', 'ERROR'); }
    setTimeout(() => { b.textContent = label; delete b.dataset.busy; }, 1800);
  });
}
