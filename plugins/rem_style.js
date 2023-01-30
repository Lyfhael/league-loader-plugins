const utils = require('./_utils')

let previous_page;
let ranked_observer;

function removeIframe() {
	const observer = new MutationObserver(mutations => {
		mutations.forEach(mutation => {
			if (mutation.type === 'childList') {
				mutation.addedNodes.forEach(node => {
					if (node.tagName === 'IFRAME' && node.hasAttribute('src') && node.hasAttribute('referrerpolicy')) {
						//node.remove();
						;
					}
				});
			}
		});
	});
	observer.observe(document.body, { childList: true, subtree: true });
}

// function monitorPage() {
// 	let currentPage = document.querySelector(".rcp-fe-viewport-main > .screen-root");
// 	let page = currentPage.getAttribute("data-screen-name");
// 	let intervalId = window.setInterval(() => {
// 		if (currentPage){
// 			let currentPage = document.querySelector(".rcp-fe-viewport-main > .screen-root");
// 			let current_title_page = currentPage.getAttribute("data-screen-name")
// 			if (current_title_page != page) {
// 				if (current_title_page == "rcp-fe-lol-home-main"){
// 					console.log("yay")
// 					document.getElementById("retrorem-bg").style.filter = 'brightness(0.3)';
// 				}
// 				else {
// 					console.log("nay")
// 					document.getElementById("retrorem-bg").style.filter = 'brightness(0.4)';
// 				}
// 			}
// 			page = current_title_page
// 		}
// 		else {
// 			window.clearInterval(intervalId)
// 		}
// 	}, 300)
// }

var nodeRemovedEvent = function (event) {
	if (event.target.classList && event.target.classList.contains("lol-loading-screen-container")) {
		let retroremBg = document.getElementById("retrorem-bg");
		let viewportRoot = document.getElementById("rcp-fe-viewport-root")

		viewportRoot.style.filter = "none"
		retroremBg.style.filter = "none"
		document.removeEventListener("DOMNodeRemoved", nodeRemovedEvent);
		// monitorPage()
	}
};

document.addEventListener("DOMNodeRemoved", nodeRemovedEvent);

let updateLobbyRegaliaBanner = async message => {
	let phase = JSON.parse(message["data"])[2]["data"];

	if (phase == "Lobby") {
		let intervalId = window.setInterval(() => {
			try {
				let base = document.querySelector("lol-regalia-parties-v2-element.regalia-loaded").shadowRoot.querySelector(".regalia-parties-v2-banner-backdrop.regalia-banner-loaded")

				base.shadowRoot.querySelector(".regalia-banner-asset-static-image").style.filter = "sepia(1) brightness(3.5) opacity(0.4)"
				base.shadowRoot.querySelector(".regalia-banner-state-machine").shadowRoot.querySelector(".regalia-banner-intro.regalia-banner-video").style.filter = "grayscale(1) saturate(0) brightness(0.5)"
			} catch {
				return;
			}
			window.clearInterval(intervalId)
		}, 100)
	}
}

let pageChangeMutation = (node) => {
	let pagename;
	let brightness_modifiers = ["rcp-fe-lol-champ-select","rcp-fe-lol-store", "rcp-fe-lol-collections", "rcp-fe-lol-profiles-main",
								"rcp-fe-lol-parties", "rcp-fe-lol-loot", "rcp-fe-lol-clash-full"]
	pagename = node.getAttribute("data-screen-name")

	console.log(pagename)
	if (pagename == "rcp-fe-lol-uikit-full-page-modal-controller"){
		return;
	}
	if (pagename == "rcp-fe-lol-champ-select") {
		document.getElementById("retrorem-bg").style.filter = 'blur(3px) brightness(0.4) saturate(1.5)';
	}
	else if (previous_page == "rcp-fe-lol-champ-select" && brightness_modifiers.indexOf(pagename) == -1) {
		document.getElementById("retrorem-bg").style.filter = 'brightness(0.3)';
	}
	if (pagename == "rcp-fe-lol-clash-full") {
		document.getElementById("retrorem-bg").style.filter = 'blur(10px) brightness(0.2)';
	}
	else if (previous_page == "rcp-fe-lol-clash-full" && brightness_modifiers.indexOf(pagename) == -1) {
		document.getElementById("retrorem-bg").style.filter = 'brightness(0.3)';
	}
	if (pagename == "rcp-fe-lol-loot") {
		document.getElementById("retrorem-bg").style.filter = 'brightness(0.3)';
	}
	else if (previous_page == "rcp-fe-lol-loot" && brightness_modifiers.indexOf(pagename) == -1) {
		document.getElementById("retrorem-bg").style.filter = 'brightness(0.3)';
	}
	if (pagename == "rcp-fe-lol-store") {
		document.getElementById("retrorem-bg").style.filter = 'brightness(0.2)';
	}
	else if (previous_page == "rcp-fe-lol-store" && brightness_modifiers.indexOf(pagename) == -1) {
		document.getElementById("retrorem-bg").style.filter = 'brightness(0.3)';
	}
	if (pagename == "rcp-fe-lol-collections") {
		document.getElementById("retrorem-bg").style.filter = 'brightness(0.2)';
	}
	else if (previous_page == "rcp-fe-lol-collections" && brightness_modifiers.indexOf(pagename) == -1) {
		document.getElementById("retrorem-bg").style.filter = 'brightness(0.3)';
	}
	if (pagename == "rcp-fe-lol-profiles-main") {
		let rankedNode = document.querySelector('[section-id="profile_subsection_leagues"]')

		if (!ranked_observer && rankedNode) {
			ranked_observer = new MutationObserver(mutations => {
				mutations.forEach(mutation => {
					if (mutation.target.classList.contains('visible')){
						let tmpInterval = window.setInterval(()=>{
							try {
								document.querySelector("div.smoke-background-container > lol-uikit-parallax-background").shadowRoot.querySelector(".parallax-layer-container").style.backgroundImage = ''
								window.clearInterval(tmpInterval)
							}
							catch {
								;
							}
						}, 50)
					}
				});
			});
			ranked_observer.observe(document.querySelector('[section-id="profile_subsection_leagues"]'), {attributes: true, childList: false, subtree: false});
		}
		document.getElementById("retrorem-bg").style.filter = 'brightness(0.3)';
	}
	else if (previous_page == "rcp-fe-lol-profiles-main") {
		if  (brightness_modifiers.indexOf(pagename) == -1)
			document.getElementById("retrorem-bg").style.filter = 'brightness(0.3)';
		if (ranked_observer)
			ranked_observer.disconnect()
		ranked_observer = undefined
	}
	if (pagename == "rcp-fe-lol-parties") {
		document.getElementById("retrorem-bg").style.filter = 'brightness(0.4) blur(6px)';
	}
	else if (previous_page == "rcp-fe-lol-parties" && brightness_modifiers.indexOf(pagename) == -1) {
		document.getElementById("retrorem-bg").style.filter = 'brightness(0.3)';
	}
	if (previous_page != pagename)
		previous_page = pagename
}

window.addEventListener('load', () => {
	utils.mutationObserverAddCallback(pageChangeMutation, ["screen-root"])
})

window.addEventListener('DOMContentLoaded', () => {
	const video = document.createElement('video');
	video.id = 'retrorem-bg';
	video.setAttribute('autoplay', '');
	video.setAttribute('loop', '');
	video.src = '//assets/Retrorem.webm';

	utils.subscribe_endpoint("/lol-gameflow/v1/gameflow-phase", updateLobbyRegaliaBanner)
	utils.addCss("//assets/rem_style.css")
	document.querySelector("body").prepend(video)
	removeIframe()
	utils.subscribe_endpoint('/lol-gameflow/v1/gameflow-phase', (message) => {
		let phase = JSON.parse(message["data"])[2]["data"]

		if (phase == "GameStart" || phase == "InProgress") {
			document.getElementById("retrorem-bg").style.filter = 'blur(10px) brightness(0.4) saturate(1.5)';
		}
	})
})
