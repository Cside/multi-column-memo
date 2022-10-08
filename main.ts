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
  colmns: [
    { minWidth: 0 },
    { minWidth: 640 },
    { minWidth: 1_000 },
  ],
};

const TEXTAREAS: HTMLTextAreaElement[] = [];
for (const [i] of CONFIG.colmns.entries()) {
  const textarea = document.createElement('textarea');
  textarea.id = `${i}`;
  TEXTAREAS.push(textarea);
  document.body.appendChild(textarea);
}
const adjust = () => {
  const width = window.innerWidth;
  const visibleColumns: { minWidth: number }[] = [];
  for (const eachConfig of CONFIG.colmns) {
    if (eachConfig.minWidth <= width) {
      visibleColumns.push(eachConfig);
    } else {
      break;
    }
  }
  for (const [i, textarea] of TEXTAREAS.entries()) {
    if (i < visibleColumns.length) {
      textarea.style.display = 'block';
    } else {
      textarea.style.display = 'none';
    }
  }
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
