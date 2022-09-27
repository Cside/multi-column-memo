{
  let prevWidth = 0;
  const minWidth = 640;
  const adjustSize = () => {
    const currentWidth = window.innerWidth;
    const currentHeight = window.innerHeight;
    let columnNum;

    const textareaRight = document.querySelector('#textarea-right');
    const textareaLeft = document.querySelector('#textarea-left');

    if (currentWidth < minWidth) {
      columnNum = 1;
      if (prevWidth == 0 || prevWidth >= minWidth)
        textareaRight.style.display = 'none';

    } else {
      columnNum = 2;
      if (prevWidth < minWidth)
        textareaRight.style.display = 'block';
    }

    for (const textarea of (columnNum == 2 ? [textareaLeft, textareaRight] : [textareaLeft])) {
      textarea.style.width = (currentWidth / columnNum - 21) + 'px';
      textarea.style.height = currentHeight + 'px';
    }

    prevWidth = currentWidth;
  }
  window.addEventListener('resize', adjustSize);
  adjustSize();
}

document.addEventListener('keydown', ev => {
  if (ev.key !== "Tab" || ev.isComposing) { return; }
  event.preventDefault();
  document.execCommand('insertText', false, '    ');
});

for (const id of ['#textarea-left', '#textarea-right']) {
  const textarea = document.querySelector(id);

  textarea.value = localStorage[id] ?? "";

  textarea.addEventListener('input', () => {
    localStorage[id] = textarea.value;
  });
}

function input_tab(event) {
}
