const CONFIG = {
  columns: [
    { minWidth: 0 },
    { minWidth: 640 },
    { minWidth: 1_200 },
  ],
};
const COLUMNS: HTMLTextAreaElement[] = [];

(async () => {
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
        await chrome.storage.sync.set({ [key(i)]: col.value }, () => { });
      } catch (error) {
        // maybe quota exceeded
        console.error(error);
        alert(error);
      }
    });

    COLUMNS.push(col);
    document.body.appendChild(col);
  }

  let PREV_COLS_LENGTH = 0;
  const adjust = () => {
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
  window.addEventListener('resize', adjust);
  adjust();
})();

document.addEventListener('keydown', (event: KeyboardEvent) => {
  if (event.key !== "Tab" || event.isComposing) { return; }
  event.preventDefault();
  document.execCommand('insertText', false, '    ');
});