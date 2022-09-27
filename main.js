let prevWidth = 0;
const adjustSize = (textarea) => {
    const currentWidth = window.innerWidth;
    let columnNum;
    if (currentWidth < 640) {
        console.log('col size: 1');
        document.querySelector('#textarea-right').style.display = 'none';
        columnNum = 1;
    } else {
        console.log('col size: 2');
        document.querySelector('#textarea-right').style.display = 'block';
        columnNum = 2;
    }
    // これは毎回計算する必要がある
    textarea.style.width  = (currentWidth / columnNum - 21) + 'px';
    textarea.style.height = (window.innerHeight) + 'px';
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
