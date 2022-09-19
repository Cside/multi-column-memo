const adjustSize = (textarea) => {
  textarea.style.width  = (window.innerWidth / 2 - 21) + 'px';
  textarea.style.height = (window.innerHeight) + 'px';
};
const inputTab = (textarea, ev) => {
    if (ev.isComposing) { return; }

    ev.preventDefault();

    var TAB = "    ";
    var value = textarea.value;
    var sPos =  textarea.selectionStart;
    var ePos =  textarea.selectionEnd;
    var result = value.slice(0, sPos) + TAB + value.slice(ePos);
    var cPos = sPos + TAB.length;
    textarea.value = result;
    textarea.setSelectionRange(cPos, cPos);
}

for (const id of ['#textarea-left', '#textarea-right']) {
    const textarea = document.querySelector(id);

    textarea.value = localStorage[id] ?? "";

    window.addEventListener('resize', () => {
        adjustSize(textarea);
    });
    textarea.addEventListener('input', () => {
        localStorage[id] = textarea.value;
    });
    textarea.addEventListener('keydown', ev => {
        if (ev.key === "Tab") {
            inputTab(textarea, ev);
        }
    });

    adjustSize(textarea);
}

function input_tab(event) {
}
