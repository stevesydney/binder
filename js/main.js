import { create } from './modules/binder.js';
window.clickEvents = false;
window.clickEvents = false;

let currentMouseOverBoundary = null;

const mouseEntered = [];


const EVENT_MOUSE_ENTER = 'mouseenter';
const EVENT_MOUSE_LEAVE = 'mouseleave';
const EVENT_MOUSE_CLICK = 'click';

// document.addEventListener(EVENT_MOUSE_ENTER, e => {

//     if (!boundaryNodes.includes(e.target)) return;

//     candidateElEvent(e.target, EVENT_MOUSE_ENTER);

// }, true);

// document.addEventListener(EVENT_MOUSE_LEAVE, e => {

//     if (!boundaryNodes.includes(e.target)) return;

//     candidateElEvent(e.target, EVENT_MOUSE_LEAVE);

// }, true);


// document.addEventListener(EVENT_MOUSE_CLICK, e => {

//     if (!window.clickEvents) return;

//     candidateElEvent(e.target, EVENT_MOUSE_CLICK);

// }, true);


// function candidateElEvent(eventEl, eventType) {

//     if (eventType === EVENT_MOUSE_ENTER) {

//         currentMouseOverBoundary = eventEl;

//         if (!mouseEntered.includes(eventEl)) {

//             mouseEntered.push(eventEl);

//         }

//         boundaryNodes.forEach(candidateEl => {

//             candidateEl.dataset.boundaryOver = candidateEl === eventEl;

//         });

//     }

//     if (eventType === EVENT_MOUSE_LEAVE) {

//         if (mouseEntered.includes(eventEl)) {

//             mouseEntered.splice(mouseEntered.indexOf(eventEl), 1);

//         }

//         const nextCandidateNode = !!mouseEntered.length && mouseEntered[mouseEntered.length - 1];

//         currentMouseOverBoundary = nextCandidateNode;

//         boundaryNodes.forEach(candidateEl => {

//             candidateEl.dataset.boundaryOver = !!nextCandidateNode && candidateEl === nextCandidateNode;

//         });

//     }


//     if (eventType === EVENT_MOUSE_CLICK) {

//         boundaryNodes.forEach(candidateEl => {

//             if (candidateEl === currentMouseOverBoundary) {

//                 candidateEl.dataset.boundarySelected = true;

//             } else {

//                 candidateEl.dataset.boundarySelected = false;

//             }

//         });

//     }

// }


function getTextNodes(node, textNodes = []) {

    if (isVisibleNode(node) && hasValidChildNodes(node)) {

        const childNodeSummary = getChildNodeSummary(node);

        childNodeSummary.textNodes.forEach(textNodeIndex => {
            textNodes.push(node.childNodes[textNodeIndex]);
        });

        childNodeSummary.elementNodes.forEach(elementNodeIndex => {
            getTextNodes(node.childNodes[elementNodeIndex], textNodes);
        });

    }

    return textNodes;

}

function getBlockParentNode(node) { // NEEEEEDS WORK

    if (isInlineNode(node.parentNode) || getChildNodeSummary(node.parentNode).total <= 1) {
        console.log('invalid', node, node.parentNode);
        getBlockParentNode(node.parentNode);
    }

    console.log('valid', node.parentNode);

    return node.parentNode;

}

function isInlineNode(node) {

    const inlineProps = [
        "inline",
        "inline-block",
        "inline-flex",
        "inline-grid"
    ]

    if (!inlineProps.includes(window.getComputedStyle(node).display)) return false;

    return true;
}

function getChildNodeSummary(node) {

    const summary = {
        elementNodes: [],
        textNodes: [],
        total: 0
    };

    let i = 0;

    for (const childNode of node.childNodes) {

        if (isValidElementNode(childNode)) {

            summary.elementNodes.push(i);

            summary.total++;

        } else if (isValidTextNode(childNode)) {

            summary.textNodes.push(i);

            summary.total++;

        }

        i++;

    }

    return summary;
}

function isValidElementNode(node) {

    if (node.nodeType !== 1) return false;

    if (!isVisibleNode(node)) return false;

    return true;

}

function isValidTextNode(node) {

    if (node.nodeType !== 3) return false;

    if (!node.textContent.trim().length) return false;

    return true;
}

function hasValidChildNodes(node) { // all we want to know is if this node has real children

    // does it have child nodes
    if (!node.childNodes.length) return false;

    // it has child nodes but we check if they are valid
    for (const childNode of node.childNodes) {

        if (isValidElementNode(childNode) || isValidTextNode(childNode)) return true;

    }

    // it has junk child nodes
    return false;

}

function isVisibleNode(node) {

    if (node.hidden) return false;

    if (node.nodeName === 'SCRIPT') return false;

    const computedStyles = window.getComputedStyle(node);

    if (computedStyles.display === 'none') return false;

    if (computedStyles.visibility === 'hidden') return false;

    if (computedStyles.opacity === '0') return false;

    if (node.offsetLeft < 0 && node.offsetTop < 0) { // should also check to the right and bottom but that needs to know viewport size
        return false;
    }

    return true;

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

// const textNodes = getTextNodes(document.body);
// console.log(textNodes);
// const boundaryNodes = getBoundaryNodes(textNodes);
// console.log(boundaryNodes);


//const boundaryNodes = getboundaryNodes(document.body);
//console.log(boundaryNodes);

/*

create a custome event for hovering an eligible candidate Element.
- if the element has multiple direct sibling children
- if the element is the body or a child of
*/