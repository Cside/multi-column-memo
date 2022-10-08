// 最小： Safari: 575, Chrome: 500
// n < 640         : 1
// 640 <= n < 1000 : 2
// 1000 <= n       : 3

const toggle_visibility = (elem: HTMLElement) => {
  elem.style.display = elem.style.display === 'none'
    ? 'block'
    : 'none';
};

const CONFIG = {
  columns: [
    { minWidth: 0 },
    { minWidth: 640 },
    { minWidth: 1_000 },
  ],
};

const COLUMNS: HTMLTextAreaElement[] = [];
for (const [i] of CONFIG.columns.entries()) {
  const col = document.createElement('textarea');
  col.id = `${i}`;
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
  for (const [i, col] of COLUMNS.entries()) {
    if (i < visibleCols.length) {
      col.style.display = 'block';
    } else {
      col.style.display = 'none';
    }
  }
  if (PREV_COLS_LENGTH !== visibleCols.length) {
    console.log('## size changed');
  }
  for (const col of visibleCols) {
    col.style.width = (((window.innerWidth) / visibleCols.length)) + 'px';
    col.style.height = (window.innerHeight - 20) + 'px';
  }
  PREV_COLS_LENGTH = visibleCols.length;
};
window.addEventListener('resize', adjust);
adjust();

// // responsible
// {
//   let prevWidth = 0;
//   const minWidth = 640;
//   const adjustSize = () => {
//     const currentWidth = window.innerWidth;
//     const currentHeight = window.innerHeight;
//     let columnNum: number;
// 
//     const textareaRight = document.querySelector('#textarea-right') as HTMLTextAreaElement;
//     const textareaLeft = document.querySelector('#textarea-left') as HTMLTextAreaElement;
// 
//     if (currentWidth < minWidth) {
//       columnNum = 1;
//       if (prevWidth == 0 || prevWidth >= minWidth)
//         textareaRight.style.display = 'none';
// 
//     } else {
//       columnNum = 2;
//       if (prevWidth < minWidth)
//         textareaRight.style.display = 'block';
//     }
// 
//     for (const textarea of (columnNum == 2 ? [textareaLeft, textareaRight] : [textareaLeft])) {
//       textarea.style.width = (currentWidth / columnNum - 21) + 'px';
//       textarea.style.height = currentHeight + 'px';
//     }
// 
//     prevWidth = currentWidth;
//   }
//   window.addEventListener('resize', adjustSize);
//   adjustSize();
// }
// 
// document.addEventListener('keydown', (event: KeyboardEvent) => {
//   if (event.key !== "Tab" || event.isComposing) { return; }
//   event.preventDefault();
//   document.execCommand('insertText', false, '    ');
// });
// 
// for (const id of ['#textarea-left', '#textarea-right']) {
//   const textarea = document.querySelector(id) as HTMLTextAreaElement;
// 
//   textarea.value = localStorage[id] ?? "";
// 
//   textarea.addEventListener('input', () => {
//     localStorage[id] = textarea.value;
//   });
// }
