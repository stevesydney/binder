const binderMode = (function() {


    function targetClick(target, block) {
        block.dataset.reveal = block.dataset.reveal === 'false' ? true : false;
    }

    function init(block) {
        block.classList.add("binder");

        const directChildren = block.querySelectorAll(":scope > *:not(br):not(hr)");

        // console.log(directChildren);


        directChildren.forEach(block => {
            block.classList.add("block")
            block.dataset.reveal = false;
            const target = document.createElement("span");
            target.classList.add("target");

            target.addEventListener("click", () => {
                targetClick(target, block);
            });




            block.appendChild(target);
        });


    }

    return {
        init: init
    }

})();

binderMode.init(document.querySelector(".body"));