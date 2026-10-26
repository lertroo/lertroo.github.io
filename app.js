(() => {
  'use strict';

  // 文字の大きさ・ライト/ダーク・フォントの設定（この端末に保存）。津々浦ラの歯車のメニューと同じ並び
  const root = document.documentElement;
  const get = k => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } };
  const save = (k, v) => { try { if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); } catch { /* 保存できなくても表示は切り替える */ } };
  const $ = id => document.getElementById(id);

  const SIZES = ['s', 'm', 'l'], THEMES = ['auto', 'light', 'dark'], THEME_LABEL = { auto: '自動', light: 'ライト', dark: 'ダーク' };
  const DARK_MQ = window.matchMedia('(prefers-color-scheme: dark)');
  let size = SIZES.includes(get('top-font')) ? get('top-font') : 'm';
  let theme = THEMES.includes(get('top-theme')) ? get('top-theme') : 'auto';
  let faceSys = get('top-face') === 'sys';

  function apply() {
    root.dataset.font = size;
    root.dataset.theme = theme === 'auto' ? (DARK_MQ.matches ? 'dark' : 'light') : theme;
    if (faceSys) root.dataset.face = 'sys'; else delete root.dataset.face;
    $('fsm').disabled = size === 's'; $('fsp').disabled = size === 'l';
    $('theme').textContent = THEME_LABEL[theme];
    $('face').textContent = faceSys ? '端末の標準' : 'サイト指定';
  }
  DARK_MQ.addEventListener('change', apply);   // 「自動」のときは、端末の設定が変わったら追いかける

  $('fsm').addEventListener('click', () => { size = SIZES[Math.max(0, SIZES.indexOf(size) - 1)]; save('top-font', size); apply(); });
  $('fsp').addEventListener('click', () => { size = SIZES[Math.min(2, SIZES.indexOf(size) + 1)]; save('top-font', size); apply(); });
  $('theme').addEventListener('click', () => { theme = THEMES[(THEMES.indexOf(theme) + 1) % 3]; save('top-theme', theme === 'auto' ? null : theme); apply(); });
  $('face').addEventListener('click', () => { faceSys = !faceSys; save('top-face', faceSys ? 'sys' : null); apply(); });
  $('prefreset').addEventListener('click', () => {
    ['top-font', 'top-theme', 'top-face'].forEach(k => save(k, null));
    size = 'm'; theme = 'auto'; faceSys = false; apply();
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
