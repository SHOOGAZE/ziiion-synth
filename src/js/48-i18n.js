/* ---- language (RU / EN) ---- */
let LANG = 'en';
try { LANG = localStorage.getItem('pb303.lang') || 'en'; } catch (e) { /* ignore */ }
const T = (r, e) => (LANG === 'ru' ? r : e);
