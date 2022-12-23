const CONFIG = {
  columns: [{ minWidth: 0 }, { minWidth: 640 }, { minWidth: 1_200 }],
};
const COLUMNS: HTMLElement[] = [];

(async () => {
  // storage への get/set
  const getKey = (i: number) => `textarea-${i}`;
  const keys = Array.from(CONFIG.columns.entries(), ([i]) => getKey(i));

  let data = await chrome.storage.local.get(keys);

  if (Object.keys(data).length === 0) {
    const msg = 'failed to get data from storage.local. use storage.sync';
    console.warn(msg);
    alert(msg);
    data = await chrome.storage.sync.get(keys);
  }

  for (const [i] of CONFIG.columns.entries()) {
    const key = getKey(i);
    const col = document.createElement('textarea');
    col.value = data[key] ?? '';

    col.addEventListener('input', async () => {
      for (const pair of [
        [
          'chrome.storage.local.set()',
          () => chrome.storage.local.set({ [key]: col.value }),
        ],
        // ['chrome.storage.sync.set()', () => setToSyncStorage()],
        ['localStorage.setItem()', () => localStorage.setItem(key, col.value)],
        /* eslint @typescript-eslint/no-explicit-any: 0 */
      ] as [string, () => any][]) {
        const [name, fn] = pair;
        try {
          await fn();
        } catch (error) {
          const msg = `error in ${name}:\n${error}`;
          console.error(msg);
          alert(msg);
        }
      }
    });
    const wrapper = document.createElement('div');
    wrapper.className = 'textarea-wrapper';
    wrapper.appendChild(col);

    document.body.appendChild(wrapper);
    COLUMNS.push(wrapper);
  }

  // サイズ・タブ数の調整
  let PREV_COLS_LENGTH = 0;
  const adjustAppearance = () => {
    const visibleCols: HTMLElement[] = [];
    for (const [i, eachConfig] of CONFIG.columns.entries()) {
      if (eachConfig.minWidth <= window.innerWidth) {
        visibleCols.push(COLUMNS[i]);
      } else {
        break;
      }
    }
    for (const col of visibleCols) {
      col.style.width = window.innerWidth / visibleCols.length + 'px';
      col.style.height = window.innerHeight - 2 + 'px';
    }

    if (visibleCols.length !== PREV_COLS_LENGTH) {
      for (const [i, col] of COLUMNS.entries()) {
        if (i < visibleCols.length) {
          col.style.display = 'block';
        } else {
          col.style.display = 'none';
        }
      }
    }
    PREV_COLS_LENGTH = visibleCols.length;
  };
  window.addEventListener('resize', adjustAppearance);
  adjustAppearance();
})();

// tab で 4 spaces を挿入
document.addEventListener('keydown', (event: KeyboardEvent) => {
  if (event.key !== 'Tab' || event.isComposing) {
    return;
  }
  event.preventDefault();
  document.execCommand('insertText', false, '    ');
});
