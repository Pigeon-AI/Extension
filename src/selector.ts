console.log('Selector injected into website.');
export {}

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
        data: JSON.stringify({
            title: "screenshot",
            data: center
        })
    }, (response) => {
        console.log("Response: " + response);
    });

    // Remove it:
    window.removeEventListener('click', handleClicks, false);

    // and the highlighter
    window.removeEventListener('mouseover', handleHover, false);
    window.removeEventListener('mouseout', hoverEnd, false);

    // remove the active highlighted color
    target.style.backgroundColor = "";
    target.style.color = "";
}

const handleHover = (e: MouseEvent) => {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    if (e.preventDefault) {
        e.preventDefault();
    }

    const target = e.target as HTMLElement;
    
    target.style.backgroundColor = "#f0a3ff";
    target.style.color = "#000000";
}

const hoverEnd = (e: MouseEvent) => {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    if (e.preventDefault) {
        e.preventDefault();
    }

    const target = e.target as HTMLElement;
    
    target.style.backgroundColor = "";
    target.style.color = "";
}

// Add the listener:
window.addEventListener('click', handleClicks, false);
window.addEventListener('mouseover', handleHover, false);
window.addEventListener('mouseout', hoverEnd, false);
