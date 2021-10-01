console.log('Selector injected into website.');
export {}

const addHighlight = (elem: HTMLElement) => {
    // color the background
    elem.style.backgroundColor = "#f0a3ff";

    // make sure the text is still readable
    elem.style.color = "#000000";

    // background color won't work on an image so add a "tint" on top of it
    if (elem.localName == "img") {
        elem.style.filter = "sepia(100%) saturate(300%) brightness(70%) hue-rotate(180deg)";
    }
}

const removeHighlight = (elem: HTMLElement) => {
    elem.style.backgroundColor = "";
    elem.style.color = "";
    elem.style.filter = "";
}

const handleClicks = (e: MouseEvent) => {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    if (e.preventDefault) {
        e.preventDefault();
    }

    const target = e.target as HTMLElement;
    
    const rect = target.getBoundingClientRect();
    const center = {
        x: (rect.left + rect.right) / 2,
        y: (rect.top + rect.bottom) / 2
    }

    console.log(center);

    chrome.runtime.sendMessage({
        title: "screenshot",
        data: center
    }, (response) => {
        console.log("Response: " + response);
    });

    // Remove it:
    window.removeEventListener('click', handleClicks, false);

    // and the highlighter
    window.removeEventListener('mouseover', handleHover, false);
    window.removeEventListener('mouseout', hoverEnd, false);

    removeHighlight(target);
}

const handleHover = (e: MouseEvent) => {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    if (e.preventDefault) {
        e.preventDefault();
    }

    const target = e.target as HTMLElement;
    
    addHighlight(target);
}

const hoverEnd = (e: MouseEvent) => {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    if (e.preventDefault) {
        e.preventDefault();
    }

    const target = e.target as HTMLElement;
    
    removeHighlight(target);
}

// Add the listener:
window.addEventListener('click', handleClicks, false);
window.addEventListener('mouseover', handleHover, false);
window.addEventListener('mouseout', hoverEnd, false);
