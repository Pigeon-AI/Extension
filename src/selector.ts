console.log('Selector injected into website.');
export {}

const handleClicks = (e: MouseEvent) => {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    if (e.preventDefault) {
        e.preventDefault();
    }

    const target = e.target as Element;
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
        console.log(response);
    });

    // Remove it:
    window.removeEventListener('click', handleClicks, false);
}

// Add the listener:
window.addEventListener('click', handleClicks, false);
