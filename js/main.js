import { create } from './modules/binder.js';

window.mouseoverEvents = true;
window.clickEvents = true;

let currentMouseOver = null;
let currentMouseOverBoundary = null;



const EVENT_MOUSE_MOVE = 'mousemove';
const EVENT_MOUSE_CLICK = 'click';

document.addEventListener(EVENT_MOUSE_MOVE, e => {
    if (!window.mouseoverEvents) return;
    if (currentMouseOver === e.target) return;
    candidateElEvent(e.target, EVENT_MOUSE_MOVE);
}, true);


document.addEventListener(EVENT_MOUSE_CLICK, e => {
    if (!window.clickEvents) return;
    candidateElEvent(e.target, EVENT_MOUSE_CLICK);
}, true);



function getCandidateEls(parentEl, candidateEls = []) {

    if (parentEl.children.length) {

        if (parentEl.children.length > 1) {

            candidateEls.push(parentEl);

        }

        for (const childEl of parentEl.children) {

            getCandidateEls(childEl, candidateEls);

        }
    }

    return candidateEls;
}

function candidateElEvent(eventEl, eventType) {

    if (eventType === EVENT_MOUSE_MOVE) {

        currentMouseOver = eventEl;

    }

    if (eventType === EVENT_MOUSE_MOVE && candidateEls.includes(eventEl)) {

        currentMouseOverBoundary = eventEl;

        candidateEls.forEach(candidateEl => {

            candidateEl.dataset.boundaryOver = candidateEl === eventEl;

        });

    }

    if (eventType === EVENT_MOUSE_CLICK) {

        candidateEls.forEach(candidateEl => {

            candidateEl.dataset.boundarySelected = candidateEl === currentMouseOverBoundary;

        });

    }
}


const candidateEls = getCandidateEls(document.body);
console.log(candidateEls);

/*

create a custome event for hovering an eligible candidate Element.
- if the element has multiple direct sibling children
- if the element is the body or a child of
*/