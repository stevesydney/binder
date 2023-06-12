function create(boundaryEl) {

    boundaryEl.dataset.boundaryActive = true;

    boundaryEl.addEventListener('mousedown', () => {
        boundaryEl.dataset.boundaryMouseDown = true;
    });

    boundaryEl.addEventListener('mouseup', () => {
        boundaryEl.dataset.boundaryMouseDown = false;
    });

    setBlocks(boundaryEl);

}

function setBlocks(boundaryEl) {

    const blockEls = boundaryEl.querySelectorAll(":scope > *:not(br):not(hr)");

    blockEls.forEach(blockEl => {

        const targetEl = document.createElement("span");
        targetEl.classList.add("target");
        setEventListeners(targetEl, blockEl);

        blockEl.dataset.blockActive = true;
        blockEl.appendChild(targetEl);

    });

}

function setEventListeners(targetEl, blockEl) {

    // mouseover
    targetEl.addEventListener('mouseover', () => {
        targetEl.dataset.targetMouseOver = true;
        blockEl.dataset.blockReveal = true;
    });

    // mouseout
    targetEl.addEventListener('mouseout', () => {
        targetEl.dataset.targetMouseOver = false;
        blockEl.dataset.blockReveal = false;
    });
}

export { create };
