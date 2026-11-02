(() => {
  'use strict';

  // 文字の大きさ・ライト/ダーク・フォントの設定。津々浦ラ（site.js）と同じ保存先（jp-fs・jp-theme・jp-font）を使うので、
  // どちらで変えても、もう片方に引き継がれる（同じ lertroo.github.io の中なので、この端末の保存場所が共通）
  const root = document.documentElement;
  const get = k => { try { return localStorage.getItem(k); } catch { return null; } };
  const set = (k, v) => { try { if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch { /* 保存できなくても表示は切り替える */ } };
  const $ = id => document.getElementById(id);

  const THEMES = ['auto', 'light', 'dark'], THEME_LABEL = { auto: '自動', light: 'ライト', dark: 'ダーク' };
  const DARK_MQ = window.matchMedia('(prefers-color-scheme: dark)');
  let fsPct = Math.max(80, Math.min(150, parseInt(get('jp-fs'), 10) || 100));   // 80〜150%、10%きざみ（津々浦ラと同じ）
  let theme = THEMES.includes(get('jp-theme')) ? get('jp-theme') : 'auto';
  let fontSys = get('jp-font') === 'sys';

  function apply() {
    root.style.setProperty('--fs', fsPct / 100);
    root.dataset.theme = theme === 'auto' ? (DARK_MQ.matches ? 'dark' : 'light') : theme;
    if (fontSys) root.dataset.font = 'sys'; else delete root.dataset.font;
    $('fsm').disabled = fsPct <= 80; $('fsp').disabled = fsPct >= 150;
    $('theme').textContent = THEME_LABEL[theme];
    $('face').textContent = fontSys ? '端末の標準' : 'サイト指定';
  }
  DARK_MQ.addEventListener('change', apply);   // 「自動」のときは、端末の設定が変わったら追いかける

  $('fsm').addEventListener('click', () => { fsPct = Math.max(80, fsPct - 10); set('jp-fs', String(fsPct)); apply(); });
  $('fsp').addEventListener('click', () => { fsPct = Math.min(150, fsPct + 10); set('jp-fs', String(fsPct)); apply(); });
  $('theme').addEventListener('click', () => { theme = THEMES[(THEMES.indexOf(theme) + 1) % 3]; set('jp-theme', theme); apply(); });
  $('face').addEventListener('click', () => { fontSys = !fontSys; set('jp-font', fontSys ? 'sys' : null); apply(); });
  $('prefreset').addEventListener('click', () => {
    ['jp-fs', 'jp-theme', 'jp-font'].forEach(k => set(k, null));
    fsPct = 100; theme = 'auto'; fontSys = false; apply();
    const b = $('prefreset'), t0 = b.textContent; b.textContent = '戻しました'; setTimeout(() => { b.textContent = t0; }, 1500);
  });
  apply();

  // 歯車のメニュー：押すと開く。外を押すか Esc で閉じる
  const btn = $('prefbtn'), menu = $('prefmenu');
  const show = on => { menu.hidden = !on; btn.setAttribute('aria-expanded', String(on)); };
  btn.addEventListener('click', () => show(menu.hidden));
  document.addEventListener('click', e => { if (!menu.hidden && !e.target.closest('.prefs')) show(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { show(false); btn.focus(); } });
})();
