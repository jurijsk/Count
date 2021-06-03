/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./sources/MessageTypes.ts
var MessageTypes;
(function (MessageTypes) {
    MessageTypes["SendSelection"] = "SEND_SELECTION";
    MessageTypes["Selection"] = "SELECTION";
    MessageTypes["TabBlur"] = "TAB_BLUR";
})(MessageTypes || (MessageTypes = {}));

;// CONCATENATED MODULE: ./sources/background/background.ts

chrome.runtime.onStartup.addListener(function () {
    console.log("coming at you from background:onStartup");
    chrome.browserAction.setBadgeBackgroundColor({ color: "#A9FFAD" });
    chrome.browserAction.setBadgeText({ text: "   0" });
});
chrome.tabs.onUpdated.addListener(function () {
    console.log(arguments);
});
chrome.runtime.onConnect.addListener(function (port) {
    console.log('[background]', arguments);
});
let onTabActivated = function onTabActivated(info) {
    chrome.tabs.sendMessage(info.tabId, { type: MessageTypes.SendSelection });
};
chrome.tabs.onActivated.addListener(onTabActivated);
let dispatchMessage = function dispatchMessage(message, sender, sendResponse) {
    if (message.type == MessageTypes.Selection) {
        let response = updateBadge(message.selection);
        sendResponse(response);
    }
    else if (message.type == MessageTypes.TabBlur) {
        updateBadge({ text: '' });
    }
};
chrome.runtime.onMessage.addListener(dispatchMessage);
let updateBadge = function updateBadge(selection) {
    let text = '9999+';
    let color = '#BC89EC';
    let len = selection.text.length;
    if (len == 0) {
        text = '';
    }
    else if (len <= 999) {
        if (len >= 240 && len < 280) {
            color = '#FF6500';
        }
        else if (len == 280) {
            color = '#FF0000';
        }
        text = '' + len;
    }
    chrome.browserAction.setBadgeText({ text: text });
    chrome.browserAction.setBadgeBackgroundColor({ color: color });
    chrome.browserAction.setTitle({ title: `Count: ${len} characters selected.` });
    return { msg: 'badge text: ' + text };
};

/******/ })()
;