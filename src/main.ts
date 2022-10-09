const CONFIG = {
  columns: [
    { minWidth: 0 },
    { minWidth: 640 },
    { minWidth: 1_200 },
  ],
};
console.log(chrome.action);

const COLUMNS: HTMLTextAreaElement[] = [];
for (const [i] of CONFIG.columns.entries()) {
  const key = `textarea-${i}`;
  const col = document.createElement('textarea');
  col.value = localStorage.getItem(key) ?? '';
  col.addEventListener('input', () => {
    localStorage.setItem(key, col.value);
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

document.addEventListener('keydown', (event: KeyboardEvent) => {
  if (event.key !== "Tab" || event.isComposing) { return; }
  event.preventDefault();
  document.execCommand('insertText', false, '    ');
});