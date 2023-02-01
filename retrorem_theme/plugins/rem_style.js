const utils = require('./_utils')
let previous_page;
let ranked_observer;
let force_bg_pause = false;
let wallpapers = ["Retrorem.webm", "Retrorem2.webm"]
let bg_filters = {
	"rcp-fe-lol-champ-select": {"Retrorem.webm": 'blur(3px) brightness(0.4) saturate(1.5)',
								"Retrorem2.webm": 'blur(3px) brightness(0.4) saturate(1.5)'},
	"rcp-fe-lol-clash-full": {"Retrorem.webm": 'blur(10px) brightness(0.2)',
							  "Retrorem2.webm": 'blur(10px) brightness(0.2)'},
	"rcp-fe-lol-loot": {"Retrorem.webm": 'brightness(0.3)',
						"Retrorem2.webm": 'brightness(0.3)'},
	"rcp-fe-lol-store": {"Retrorem.webm": 'brightness(0.2)',
						 "Retrorem2.webm": 'brightness(0.45) saturate(0.5) blur(5px)'},
	"rcp-fe-lol-collections": {"Retrorem.webm": 'brightness(0.2)',
							   "Retrorem2.webm": 'brightness(0.2)'},
	"rcp-fe-lol-profiles-main": {"Retrorem.webm": 'brightness(0.3)',
								 "Retrorem2.webm": 'brightness(0.3)'},
	"rcp-fe-lol-parties": {"Retrorem.webm": 'brightness(0.4) blur(6px)',
						   "Retrorem2.webm": 'brightness(0.4) blur(6px)'},
	"default": {"Retrorem.webm": 'brightness(0.7) saturate(0.8)',
				"Retrorem2.webm": 'none'},
}

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
		retroremBg.style.filter = "brightness(0.7) saturate(0.8)"
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

function retrorem_play_pause() {
	let retrorem_bg_elem = document.getElementById("retrorem-bg")

	if (force_bg_pause) {
		retrorem_bg_elem.pause()
	}
	else {
		retrorem_bg_elem.play()
	}
}

function play_pause_set_icon(elem) {
	let pause_bg_icon = elem || document.querySelector(".pause-bg-icon")

	if (!pause_bg_icon) {
		return;
	}
	if (!force_bg_pause) {
		pause_bg_icon.setAttribute("src", "//assets/pause_button.png")
	}
	else {
		pause_bg_icon.setAttribute("src", "//assets/play_button.png")
	}
}

function next_wallpaper() {
	let retroremBg = document.getElementById("retrorem-bg")
	document.querySelector(":root").classList.remove(wallpapers[0].replace(/\.[a-zA-Z]+$/, '-vars'))
	retroremBg.classList.add("webm-hidden");
	wallpapers.push(wallpapers.shift())
	document.querySelector(":root").classList.add(wallpapers[0].replace(/\.[a-zA-Z]+$/, '-vars'))
	setTimeout(function () {
		retroremBg.src = `//assets/${wallpapers[0]}`
		retrorem_play_pause()
		retroremBg.classList.remove("webm-hidden");
	}, 500);
}

function create_webm_buttons() {
	const container = document.createElement("div")
	const pauseBg = document.createElement("div");
	const nextBg = document.createElement("div");
	const pauseBgIcon = document.createElement("img")
	const nextBgIcon = document.createElement("img")

	container.classList.add("webm-bottom-buttons-container")
	pauseBg.id = "pause-bg"
	nextBg.id = "next-bg"
	nextBgIcon.classList.add("next-bg-icon")
	pauseBgIcon.classList.add("pause-bg-icon")
	
	play_pause_set_icon(pauseBgIcon)
	pauseBg.addEventListener("click", () => {
		force_bg_pause = !force_bg_pause
		retrorem_play_pause()
		play_pause_set_icon()
	})

	nextBg.addEventListener("click", () => {
		next_wallpaper()
	})

	nextBgIcon.setAttribute("src", "//assets/next_button.png")
	document.getElementsByClassName("rcp-fe-lol-home")[0].appendChild(container)
	container.append(pauseBg)
	container.append(nextBg)
	pauseBg.append(pauseBgIcon)
	nextBg.append(nextBgIcon)
}

let pageChangeMutation = (node) => {
	let pagename;
	let retrorem_bg_elem = document.getElementById("retrorem-bg")
	let brightness_modifiers = ["rcp-fe-lol-champ-select", "rcp-fe-lol-store", "rcp-fe-lol-collections", "rcp-fe-lol-profiles-main",
		"rcp-fe-lol-parties", "rcp-fe-lol-loot", "rcp-fe-lol-clash-full"]
	pagename = node.getAttribute("data-screen-name")

	console.log(pagename)
	if (pagename == "rcp-fe-lol-home-main") {
		if (!document.getElementsByClassName("webm-bottom-buttons-container").length) {
			create_webm_buttons()
		}
	}
	else if (pagename != "rcp-fe-lol-navigation-screen" && pagename != "window-controls" && pagename != "rcp-fe-lol-home" && pagename != "social") {
		if (document.getElementsByClassName("webm-bottom-buttons-container").length) {
			document.getElementsByClassName("webm-bottom-buttons-container")[0].remove()
		}
	}
	if (pagename == "rcp-fe-lol-uikit-full-page-modal-controller") {
		return;
	}
	if (pagename == "rcp-fe-lol-champ-select") {
		retrorem_bg_elem.style.filter = bg_filters["rcp-fe-lol-champ-select"][wallpapers[0]];
	}
	else if (previous_page == "rcp-fe-lol-champ-select" && brightness_modifiers.indexOf(pagename) == -1) {
		retrorem_bg_elem.style.filter = retrorem_bg_elem.style.filter = bg_filters["default"][wallpapers[0]];
	}
	if (pagename == "rcp-fe-lol-clash-full") {
		retrorem_bg_elem.style.filter = retrorem_bg_elem.style.filter = bg_filters["rcp-fe-lol-clash-full"][wallpapers[0]];
	}
	else if (previous_page == "rcp-fe-lol-clash-full" && brightness_modifiers.indexOf(pagename) == -1) {
		retrorem_bg_elem.style.filter = bg_filters["default"][wallpapers[0]];
	}
	if (pagename == "rcp-fe-lol-loot") {
		retrorem_bg_elem.style.filter = bg_filters["rcp-fe-lol-loot"][wallpapers[0]];
	}
	else if (previous_page == "rcp-fe-lol-loot" && brightness_modifiers.indexOf(pagename) == -1) {
		retrorem_bg_elem.style.filter = bg_filters["default"][wallpapers[0]];
	}
	if (pagename == "rcp-fe-lol-store") {
		retrorem_bg_elem.style.filter = bg_filters["rcp-fe-lol-store"][wallpapers[0]];
	}
	else if (previous_page == "rcp-fe-lol-store" && brightness_modifiers.indexOf(pagename) == -1) {
		retrorem_bg_elem.style.filter = bg_filters["default"][wallpapers[0]];
	}
	if (pagename == "rcp-fe-lol-collections") {
		retrorem_bg_elem.style.filter = bg_filters["rcp-fe-lol-collections"][wallpapers[0]];
	}
	else if (previous_page == "rcp-fe-lol-collections" && brightness_modifiers.indexOf(pagename) == -1) {
		retrorem_bg_elem.style.filter = bg_filters["default"][wallpapers[0]];
	}
	if (pagename == "rcp-fe-lol-profiles-main") {
		let rankedNode = document.querySelector('[section-id="profile_subsection_leagues"]')

		if (!ranked_observer && rankedNode) {
			ranked_observer = new MutationObserver(mutations => {
				mutations.forEach(mutation => {
					if (mutation.target.classList.contains('visible')) {
						let tmpInterval = window.setInterval(() => {
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
			ranked_observer.observe(document.querySelector('[section-id="profile_subsection_leagues"]'), { attributes: true, childList: false, subtree: false });
		}
		retrorem_bg_elem.style.filter = bg_filters["rcp-fe-lol-profiles-main"][wallpapers[0]];
	}
	else if (previous_page == "rcp-fe-lol-profiles-main") {
		if (brightness_modifiers.indexOf(pagename) == -1)
			retrorem_bg_elem.style.filter = bg_filters["default"][wallpapers[0]];
		if (ranked_observer)
			ranked_observer.disconnect()
		ranked_observer = undefined
	}
	if (pagename == "rcp-fe-lol-parties") {
		retrorem_bg_elem.style.filter = bg_filters["rcp-fe-lol-parties"][wallpapers[0]];
	}
	else if (previous_page == "rcp-fe-lol-parties" && brightness_modifiers.indexOf(pagename) == -1) {
		retrorem_bg_elem.style.filter = bg_filters["default"][wallpapers[0]];
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
	//removeIframe()
	utils.subscribe_endpoint('/lol-gameflow/v1/gameflow-phase', (message) => {
		let phase = JSON.parse(message["data"])[2]["data"]

		if (phase == "GameStart" || phase == "InProgress") {
			document.getElementById("retrorem-bg").style.filter = 'blur(10px) brightness(0.4) saturate(1.5)';
			document.getElementById("retrorem-bg").pause()
		}
		else {
			retrorem_play_pause()
		}
	})
})
