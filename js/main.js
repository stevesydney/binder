import { create } from './modules/binder.js';

function boundaryFinder() {
    const boundaryCandidateChildEls = document.querySelectorAll('* *');

    boundaryCandidateChildEls.forEach(boundaryCandidateChildEl => {

        const boundaryCandidateEl = boundaryCandidateChildEl.parentElement;

        boundaryCandidateEl.addEventListener(
            'mouseover', (e) => {
                e.target.dataset.boundaryCandidate = true;     
            }, true
        );

        boundaryCandidateEl.addEventListener(
            'mouseout', (e) => {
                e.target.dataset.boundaryCandidate = false;     
            }, true
        );

        boundaryCandidateEl.addEventListener(
            'click', (e) => {
                create(e.target);
            }
        )
    });
}

// possible also innerText length combined with element display prop, element siblings, and children count. 

boundaryFinder();

//create(document.querySelector(".body"));