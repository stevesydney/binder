import { create } from './modules/binder.js';
window.clickEvents = false;
window.clickEvents = false;

let currentMouseOverBoundary = null;

const mouseEntered = [];


const EVENT_MOUSE_ENTER = 'mouseenter';
const EVENT_MOUSE_LEAVE = 'mouseleave';
const EVENT_MOUSE_CLICK = 'click';
const INLINE_TEXT_ELEMENTS = [
    "A",
    "ABBR",
    "B",
    "BDI",
    "BDO",
    "BR",
    "CITE",
    "CODE",
    "DATA",
    "DFN",
    "EM",
    "I",
    "KBD",
    "MARK",
    "Q",
    "RP",
    "RT",
    "RUBY",
    "S",
    "SAMP",
    "SMALL",
    "SPAN",
    "STRONG",
    "SUB",
    "SUP",
    "TIME",
    "U",
    "VAR",
    "WBR"
];


document.addEventListener(EVENT_MOUSE_ENTER, e => {

    if (!boundaryNodes.includes(e.target)) return;

    candidateElEvent(e.target, EVENT_MOUSE_ENTER);

}, true);

document.addEventListener(EVENT_MOUSE_LEAVE, e => {

    if (!boundaryNodes.includes(e.target)) return;

    candidateElEvent(e.target, EVENT_MOUSE_LEAVE);

}, true);


document.addEventListener(EVENT_MOUSE_CLICK, e => {

    if (!window.clickEvents) return;

    candidateElEvent(e.target, EVENT_MOUSE_CLICK);

}, true);



function candidateElEvent(eventEl, eventType) {

    if (eventType === EVENT_MOUSE_ENTER) {

        currentMouseOverBoundary = eventEl;

        if (!mouseEntered.includes(eventEl)) {

            mouseEntered.push(eventEl);

        }

        boundaryNodes.forEach(candidateEl => {

            candidateEl.dataset.boundaryOver = candidateEl === eventEl;

        });

    }

    if (eventType === EVENT_MOUSE_LEAVE) {

        if (mouseEntered.includes(eventEl)) {

            mouseEntered.splice(mouseEntered.indexOf(eventEl), 1);

        }

        const nextCandidateNode = !!mouseEntered.length && mouseEntered[mouseEntered.length - 1];

        currentMouseOverBoundary = nextCandidateNode;

        boundaryNodes.forEach(candidateEl => {

            candidateEl.dataset.boundaryOver = !!nextCandidateNode && candidateEl === nextCandidateNode;

        });

    }


    if (eventType === EVENT_MOUSE_CLICK) {

        boundaryNodes.forEach(candidateEl => {

            if (candidateEl === currentMouseOverBoundary) {

                candidateEl.dataset.boundarySelected = true;

            } else {

                candidateEl.dataset.boundarySelected = false;

            }

        });

    }

}



function getTextNodes(boundaryEl, textNodes = []) {

    if (boundaryEl.classList.contains('custom-logo-link')) {
        console.log(boundaryEl);
    }

    if (boundaryEl.childNodes.length && !boundaryEl.hidden && boundaryEl.offsetLeft >= 0 && boundaryEl.offsetTop >= 0) {

        for (const childNode of boundaryEl.childNodes) {

            if (childNode.nodeType === 3 && childNode.textContent.trim().length) {

                boundaryEl.dataset.textNode = true;

                textNodes.push(boundaryEl);

            }

            if (childNode.nodeType === 1) {

                if (INLINE_TEXT_ELEMENTS.includes(childNode.nodeName) && childNode.offsetLeft >= 0 && childNode.offsetTop >= 0 && childNode.childNodes.length) {

                    boundaryEl.dataset.textNode = true;

                    textNodes.push(boundaryEl);

                } else {

                    getTextNodes(childNode, textNodes);

                }


            }

        }

    }

    return textNodes;
}


function getBoundaryNodes(textNodes) {

    const boundaryNodes = [];

    textNodes.forEach(textNode => {

        let parentNode = textNode.parentElement;

        if (
            textNode.nodeType === 1 &&
            parentNode.children.length === 1 &&
            parentNode.clientWidth === textNode.clientWidth &&
            parentNode.clientHeight === textNode.clientHeight
        ) {

            parentNode = textNode;

        }

        if (!boundaryNodes.includes(parentNode)) {
            boundaryNodes.push(parentNode);
        }

    });

    return boundaryNodes;

}


const textNodes = getTextNodes(document.body);
console.log(textNodes);
const boundaryNodes = getBoundaryNodes(textNodes);
console.log(boundaryNodes);


//const boundaryNodes = getboundaryNodes(document.body);
//console.log(boundaryNodes);

/*

create a custome event for hovering an eligible candidate Element.
- if the element has multiple direct sibling children
- if the element is the body or a child of
*/