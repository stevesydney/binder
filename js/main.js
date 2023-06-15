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

    if (isNodeParent(boundaryEl) && isNodeVisible(boundaryEl)) {

        for (const childNode of boundaryEl.childNodes) {

            if (childNode.nodeType === 3 && childNode.textContent.trim().length && isNodeParent(childNode)) {

                boundaryEl.dataset.textNode = true;

                textNodes.push(boundaryEl);

            }

            if (childNode.nodeType === 1 && isNodeParent(childNode) && isNodeVisible(childNode)) {

                if (isElementTextNode(childNode)) {

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

function newGetTextNodes(node, textNodes = []) {

    if (isNodeVisible(node) && isParentNode(node)) {

        const childNodeSummary = getChildNodeSummary(node);


        if (childNodeSummary.textNodes.length && !childNodeSummary.elementNodes.length) {

            node.dataset.textNode = true;

            if (isInline(node)) {

                const singleParentNode = getSingleParentNode(node);

                singleParentNode.dataset.textParentNode = true;
            }

        }

        childNodeSummary.textNodes.forEach(textNodeIndex => {
            textNodes.push(node.childNodes[textNodeIndex]);
        });

        childNodeSummary.elementNodes.forEach(elementNodeIndex => {
            newGetTextNodes(node.childNodes[elementNodeIndex], textNodes);
        });

    }

    return textNodes;

}

function getSingleParentNode(node) {

    // NEEDS TO BE NEXT SINGLE BLOCK PARENT - HAS TO SKIP INLINE TILL IT FINDS A BLOCK

    if (getChildNodeSummary(node.parentNode).total > 1 && !isInline(node.parentNode)) {

        getSingleParentNode(node.parentNode);

    }

    return node.parentNode;

}

function isInline(node) {

    const inlineProps = [
        "inline",
        "inline-block",
        "inline-flex",
        "inline-grid"
    ]

    if (inlineProps.includes(window.getComputedStyle(node).display)) return true;

    return false;
}

function getChildNodeSummary(node) {

    const summary = {
        elementNodes: [],
        textNodes: []
    };

    let i = 0;

    for (const childNode of node.childNodes) {

        if (childNode.nodeType === 1 && isValidElementNode(childNode)) summary.elementNodes.push(i);

        if (childNode.nodeType === 3 && isValidTextNode(childNode)) summary.textNodes.push(i);

        i++;

    }

    summary.total = summary.elementNodes.length + summary.textNodes.length;

    return summary;
}

function isValidElementNode(node) {

    if (!isNodeVisible(node)) return false;

    return true;

}

function isValidTextNode(node) {
    if (node.textContent.trim().length) return true;

    return false;
}

function isParentNode(node) { // all we want to know is if this node has real children

    // does it have child nodes
    if (!node.childNodes.length) return false;

    // it has child nodes but we check if they are valid
    for (const childNode of node.childNodes) {

        if (childNode.nodeType === 1 && isValidElementNode(childNode)) return true;

        if (childNode.nodeType === 3 && isValidTextNode(childNode)) return true;

    }

    // it has junk child nodes
    return false;

}


function isNodeParent(node) {
    if (!node.childNodes.length) {
        return false;
    }

    return true
}

function isElementTextNode(node) {

    if (!INLINE_TEXT_ELEMENTS.includes(node.nodeName)) {
        return false;
    }

    if (window.getComputedStyle(node).display !== 'inline') {
        return false;
    }

    return true;

}

function isNodeVisible(node) {

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


const textNodes = newGetTextNodes(document.body);
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