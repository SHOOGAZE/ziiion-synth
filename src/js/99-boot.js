/* ---- boot ---- */
fit();
window.addEventListener('resize', fit);
window.addEventListener('orientationchange', () => setTimeout(fit, 120));
if (window.visualViewport) window.visualViewport.addEventListener('resize', fit);
refresh();
window.PB = { randomEntry, applyEntry, LIB, libOpts, libOpen, midiBytes, renderWav, undo, copyPat, pastePat, S, send, engine, createEngine, buildPlay, pushSeq, refresh, parsePat, powerOn, knobs, fit, view };
