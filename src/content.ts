console.log('Hello Content');
export {}

const handleClicks = (e: MouseEvent) => {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    if (e.preventDefault) {
        e.preventDefault();
    }
    console.log(e.target);
}

window.onclick = handleClicks
