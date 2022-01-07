/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

// UNUSED EXPORTS: CountStarter

;// CONCATENATED MODULE: ./sources/MessageTypes.ts
var MessageTypes;
(function (MessageTypes) {
    MessageTypes["SendSelection"] = "SEND_SELECTION";
    MessageTypes["Selection"] = "SELECTION";
    MessageTypes["TabBlur"] = "TAB_BLUR";
})(MessageTypes || (MessageTypes = {}));

;// CONCATENATED MODULE: ./sources/SelectionObj.ts
class SelectionObj {
    constructor(selection, activeElement) {
        this.text = "";
        if (!selection) {
            selection = { isCollapsed: true, toString: () => '' };
        }
        if (selection.isCollapsed) {
            if (!activeElement) {
                console.log("no active element");
            }
            else if (activeElement instanceof HTMLInputElement) {
                this.text = activeElement.value;
                console.log("input element: " + this.text);
            }
            else if (activeElement instanceof HTMLTextAreaElement) {
                this.text = activeElement.value;
                console.log("text area element: " + this.text);
            }
            else if (activeElement instanceof HTMLElement && activeElement.contentEditable) {
                //this.text = activeElement.innerText;
                //console.log("content editable: " + this.text);
            }
            else {
                console.log(activeElement);
            }
        }
        else {
            console.log(selection);
            this.text = selection.toString();
        }
    }
}

;// CONCATENATED MODULE: ./sources/content-script/content-script.ts


class CountStarter {
    constructor() {
        document.addEventListener('selectionchange', () => {
            sendSelection();
        });
        let onfocusIn = function onFocusIn(event) {
            sendSelection();
        };
        document.addEventListener('focusin', onfocusIn);
        let onfocusOut = function onfocusOut(event) {
            sendSelection();
        };
        document.addEventListener('focusout', onfocusOut);
        let dispatchMessage = function dispatchMessage(message, sender, sendResponse) {
            if (message.type == MessageTypes.SendSelection) {
                sendSelection();
            }
        };
        chrome.runtime.onMessage.addListener(dispatchMessage);
        let sendSelection = function sendSelection(isOnLoad = false) {
            let selection = isOnLoad ? null : window.getSelection();
            chrome.runtime.sendMessage({ type: MessageTypes.Selection, selection: new SelectionObj(selection, document.activeElement) }, function (response) {
                //console.log("response from background:", response.msg);
            });
        };
        function docReady(fn) {
            if (document.readyState === "complete" || document.readyState === "interactive") {
                setTimeout(fn, 1);
            }
            else {
                document.addEventListener("DOMContentLoaded", () => { fn(); });
            }
        }
        docReady(() => sendSelection(true));
        // document.oninput = function(event: Event){
        // 	let target = event.target;
        // 	if(target instanceof HTMLElement && target.contentEditable){
        // 		chrome.runtime.sendMessage(
        // 			{type: MessageTypes.Selection, selection: {text: target.innerText}});
        // 	}
        // }
        // document.onfocus = function(event: Event) {
        // 	console.log("focus: ", event);
        // }
    }
}
new CountStarter();

/******/ })()
;