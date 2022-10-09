const CONFIG = {
  columns: [
    { minWidth: 0 },
    { minWidth: 640 },
    { minWidth: 1_200 },
  ],
};
const COLUMNS: HTMLTextAreaElement[] = [];

(async () => {
  // storage への get/set
  const key = (i: number) => `textarea-${i}`;
  const data = await chrome.storage.sync.get(
    Array.from(CONFIG.columns.entries(), ([i]) => key(i))
  );
  for (const [i] of CONFIG.columns.entries()) {
    const col = document.createElement('textarea');
    col.value = data[key(i)] ?? '';

    // throttle したい気がしないでもない ...
    col.addEventListener('input', async () => {
      try {
        await chrome.storage.sync.set({ [key(i)]: col.value });
      } catch (error) {
        // maybe quota exceeded
        const msg = `error in chrome.storage.sync.set():\n${error}`;
        console.error(msg);
        alert(msg);
      }
      try {
        // backup just in case
        localStorage.setItem(key(i), col.value);
      } catch (error) {
        const msg = `error in localStorage.setItem():\n${error}`;
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