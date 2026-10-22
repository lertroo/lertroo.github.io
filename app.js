(() => {
  'use strict';

  const root = document.documentElement;
  const save = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* 保存できなくても表示は切り替える */ }
  };

  // ボタンの押下状態を、現在の設定値に合わせる
  function sync(segId, attr) {
    document.querySelectorAll(`#${segId} button`).forEach(b =>
      b.setAttribute('aria-pressed', String(b.dataset[attr] === root.dataset[attr])));
  }

  function bind(segId, attr, key) {
    sync(segId, attr);
    document.getElementById(segId).addEventListener('click', e => {
      const v = e.target.closest('button')?.dataset[attr];
      if (!v) return;
      root.dataset[attr] = v;
      save(key, v);
      sync(segId, attr);
    });
  }

  bind('font-seg', 'font', 'top-font');
  bind('theme-seg', 'theme', 'top-theme');
})();
