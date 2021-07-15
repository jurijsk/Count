import {MessageTypes} from '../MessageTypes';
import {RuntimeMessage} from '../RuntimeMessage';
import {SelectionObj} from '../SelectionObj';


export class CountStarter {

	constructor() {
		document.addEventListener('selectionchange', () => {
			sendSelection();
		});

		let onfocusIn = function onFocusIn(event: FocusEvent) {
			
			sendSelection();
		}
		document.addEventListener('focusin', onfocusIn);

		let onfocusOut = function onfocusOut(event: FocusEvent) {
			
			sendSelection();
		}
		document.addEventListener('focusout', onfocusOut);


		let dispatchMessage = function dispatchMessage(message: RuntimeMessage
			, sender: chrome.runtime.MessageSender
			, sendResponse: (response?: any) => void) {

			if(message.type == MessageTypes.SendSelection) {
				sendSelection();
			}
		}
		chrome.runtime.onMessage.addListener(dispatchMessage);

		let sendSelection = function sendSelection(isOnLoad = false){
			let selection = isOnLoad ? null : window.getSelection();
			chrome.runtime.sendMessage(
				{type: MessageTypes.Selection, selection: new SelectionObj(selection, document.activeElement)}
				, function(response: {msg: string}) {
				//console.log("response from background:", response.msg);
			});
		}




		function docReady(fn: Function) {
			if(document.readyState === "complete" || document.readyState === "interactive") {
				setTimeout(fn, 1);
			} else {
				document.addEventListener("DOMContentLoaded", () => {fn()});
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




