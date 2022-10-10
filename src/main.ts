import { throttle } from './utils';

const CONFIG = {
  columns: [
    { minWidth: 0 },
    { minWidth: 640 },
    { minWidth: 1_200 },
  ],
};
const COLUMNS: HTMLTextAreaElement[] = [];

// MAX_WRITE_OPERATIONS_PER_HOUR = 1,800 に合わせる
const setToSyncStorage = throttle(async (keyValue: Object) => {
  return await chrome.storage.sync.set(keyValue)
}, 2000);

(async () => {
  // storage への get/set
  const key = (i: number) => `textarea-${i}`;
  const keys = Array.from(CONFIG.columns.entries(), ([i]) => key(i));
  let data = await chrome.storage.local.get(keys);

  if (Object.keys(data).length === 0) {
    const msg = 'failed to get data from storage.local. use storage.sync';
    console.warn(msg);
    alert(msg);
    data = await chrome.storage.sync.get(keys);
  }

  for (const [i] of CONFIG.columns.entries()) {
    const col = document.createElement('textarea');
    col.value = data[key(i)] ?? '';

    col.addEventListener('input', async () => {
      try {
        await chrome.storage.local.set({ [key(i)]: col.value });
      } catch (error) {
        const msg = `error in localStorage.setItem():\n${error}`;
        console.error(msg);
        alert(msg);
      }
      // backup just in case
      try {
        await setToSyncStorage({ [key(i)]: col.value });
      } catch (error) {
        // maybe quota exceeded
        const msg = `error in chrome.storage.sync.set():\n${error}`;
        console.error(msg);
        alert(msg);
      }
    });

    COLUMNS.push(col);
    document.body.appendChild(col);
  }

  // サイズ・タブ数の調整
  let PREV_COLS_LENGTH = 0;
  const adjustAppearance = () => {
    const visibleCols: HTMLTextAreaElement[] = [];
    for (const [i, eachConfig] of CONFIG.columns.entries()) {
      if (eachConfig.minWidth <= window.innerWidth) {
        visibleCols.push(COLUMNS[i]);
      } else {
        break;
      }
    }
    for (const col of visibleCols) {
      col.style.width = (window.innerWidth / visibleCols.length) + 'px';
      col.style.height = (window.innerHeight - 20) + 'px';
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
  if (event.key !== "Tab" || event.isComposing) { return; }
  event.preventDefault();
  document.execCommand('insertText', false, '    ');
});