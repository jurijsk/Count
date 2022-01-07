import {MessageTypes} from '../MessageTypes';
import {RuntimeMessage} from '../RuntimeMessage';
import {SelectionObj} from '../SelectionObj';


chrome.runtime.onStartup.addListener(function() {
	console.log("coming at you from background:onStartup");
	chrome.browserAction.setBadgeBackgroundColor({color: "#A9FFAD"});
	chrome.browserAction.setBadgeText({ text: "   0"});
});

chrome.tabs.onUpdated.addListener(function() {
	console.log(arguments)
});


chrome.runtime.onConnect.addListener(function(port: chrome.runtime.Port){
	console.log('[background]', arguments);
});

let onTabActivated = function onTabActivated(info: chrome.tabs.TabActiveInfo){
	chrome.tabs.sendMessage(info.tabId, {type: MessageTypes.SendSelection});
}


chrome.tabs.onActivated.addListener(onTabActivated);


let dispatchMessage = function dispatchMessage(message: RuntimeMessage
	, sender: chrome.runtime.MessageSender
	, sendResponse: (response?: any) => void){

	if(message.type == MessageTypes.Selection) {
		let response = updateBadge(message.selection as SelectionObj);
		sendResponse(response);
	} else if (message.type == MessageTypes.TabBlur){
		updateBadge({text: ''});
	}
}
chrome.runtime.onMessage.addListener(dispatchMessage);


let maxLength = 280;
let countFromUserParam = 20;
let countTillUserParam = 999;

let updateBadge = function updateBadge(selection: SelectionObj){
	let badgeText = '9999+';
	let color = '#BC89EC';
	let textLenth = selection.text.length;
	let count = Math.ceil(textLenth / maxLength); 
	let tweetLen = textLenth % maxLength;


	if(textLenth <= countFromUserParam || textLenth >= countTillUserParam) {
		badgeText = '';
	} else {
		if(tweetLen >= 200 && tweetLen < 240) {
			color = '#F09E00';
		} else if(tweetLen >= 240 && tweetLen < 280) {
			color = '#FF6500';
		} else if(tweetLen == 0) {
			color = '#FF0000';
		}
		badgeText = (count >= 2 ? '' + count + '|' : '') + (maxLength - (tweetLen || maxLength));
	}

	chrome.browserAction.setBadgeText({text: badgeText});
	chrome.browserAction.setBadgeBackgroundColor({color: color});
	chrome.browserAction.setTitle({title: `Count: ${textLenth} characters selected.`});
	return {msg: 'badge text: ' + badgeText}
}

export {}