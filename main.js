const adjustSize = (textarea) => {
  textarea.style.width  = (window.innerWidth / 2 - 21) + 'px';
  textarea.style.height = (window.innerHeight) + 'px';
};

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
