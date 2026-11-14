/* ---- language (RU / EN) ---- */
let LANG = 'en';
try { LANG = localStorage.getItem('pb303.lang') || (/^(ru|uk|be)/i.test(navigator.language || '') ? 'ru' : 'en'); } catch (e) { /* ignore */ }
const T = (r, e) => (LANG === 'ru' ? r : e);
