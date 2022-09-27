let prevWidth = 0;
const minWidth = 640;
const adjustSize = (textarea) => {
  const currentWidth = window.innerWidth;
  let columnNum;
  if ((prevWidth == 0 || prevWidth >= minWidth) && currentWidth < minWidth) {
    document.querySelector('#textarea-right').style.display = 'none';
    columnNum = 1;

  } else if (prevWidth < minWidth && currentWidth >= minWidth) {
    document.querySelector('#textarea-right').style.display = 'block';
    columnNum = 2;
  }
  textarea.style.width  = (currentWidth / columnNum - 21) + 'px';
  textarea.style.height = (window.innerHeight) + 'px';

  prevWidth = currentWidth;
}

document.addEventListener('keydown', ev => {
  if (ev.key !== "Tab" || ev.isComposing) { return; }
  event.preventDefault();
  document.execCommand('insertText', false, '    ');
});

for (const id of ['#textarea-left', '#textarea-right']) {
  const textarea = document.querySelector(id);

  textarea.value = localStorage[id] ?? "";

  window.addEventListener('resize', () => {
    adjustSize(textarea);
  });
  textarea.addEventListener('input', () => {
    localStorage[id] = textarea.value;
  });

  adjustSize(textarea);
}

function input_tab(event) {
}
