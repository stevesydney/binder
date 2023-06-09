function create(boundaryEl) {

    boundaryEl.classList.add("boundary");

    setBlocks(boundaryEl);

}

function setBlocks(boundaryEl) {

    const blockEls = boundaryEl.querySelectorAll(":scope > *:not(br):not(hr)");

    blockEls.forEach(blockEl => {

        const targetEl = document.createElement("span")
        targetEl.classList.add("target");

        blockEl.classList.add("block");
        blockEl.dataset.blockReveal = false;
        blockEl.appendChild(targetEl);

    });

}

export { create };
