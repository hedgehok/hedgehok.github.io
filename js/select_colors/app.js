const cols = document.querySelectorAll('.col');

// function generateRandomColor() {
//     const hexCodes = '0123456789ABCDEF';
//     let color = '';
//     for (let i = 0; i < 6; i++) {
//         color += hexCodes[Math.floor(Math.random() * hexCodes.length)];
//     }
//     return '#' + color;
// }

function copyToClipboard(text) {
    return navigator.clipboard.writeText(text);
}

function setTextColor(elem, color) {
    const luminance = chroma(color).luminance();
    elem.style.color = luminance > 0.5 ? 'black' : 'white';
}

function setRandomColors(isInitial = false) {
    const colors = isInitial ? getColorsFromHash() : [];
    cols.forEach((col, index) => {
        const isLocked = col.querySelector('i').classList.contains('fa-lock');
        const text = col.querySelector('h2');
        const button = col.querySelector('button');
        
        if (isLocked) {
            colors.push(text.textContent);
            return;
        }

        const color = isInitial 
            ? colors[index]
                ? colors[index] 
                : chroma.random()
            : chroma.random();
        // generateRandomColor();
        if (!isInitial) {
            colors.push(color);
        }
        text.textContent = color;
        col.style.background = color;

        setTextColor(text, color);
        setTextColor(button, color);
    });
    updateColorsHash(colors);
}

function updateColorsHash(colors = []) {
    document.location.hash = colors.map(color => color.toString().substring(1)).join('-');
}

function getColorsFromHash() {
    if (document.location.hash.length > 1) {
        return document.location.hash.substring(1).split('-').map(color => '#' + color);
    }
    return [];
}

document.addEventListener('keydown', event => {
    if (event.code.toLowerCase() === 'space') {
        event.preventDefault();
        setRandomColors();
    }
});

document.addEventListener('click', event => {
    const type = event.target.dataset.type;

    switch (type) {
        case 'lock':
            const node = event.target.tagName.toLowerCase() === 'i'
                ? event.target
                : event.target.children[0];
            
            node.classList.toggle('fa-lock-open');
            node.classList.toggle('fa-lock');
            break;
        case 'copy':
            copyToClipboard(event.target.textContent);
            break;
        default:
            break;
    }
});

setRandomColors(true);