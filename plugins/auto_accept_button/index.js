const version = "1.2.2"
import utils from '../_utils'
import data from './config/auto_accept_button_config.json'// determine if it should auto accept matchmaking
let auto_accept = data["is_auto_accept_enabled"]
console.log("????????????????????", auto_accept)
let queue_accepted = false // determine if the queue has been accepted by the script, so to not spam /accept
let player_declined = false // determine if the user has declined the queue in the delay time.

/** Called upon clicking the Auto Accept button. Enable/Disable queue auto acceptation */
function autoAcceptQueueButton(){
	let element = document.getElementById("autoAcceptQueueButton")
	if (element.attributes.selected != undefined) {
		auto_accept = false
		element.removeAttribute("selected")
	}
	else {
		element.setAttribute("selected", "true")
		auto_accept = true
	}
}

window.autoAcceptQueueButton = autoAcceptQueueButton

/** Called upon Match found. Accept the Matchmaking */
let autoAcceptCallback = async message => {
	utils.phase = JSON.parse(message["data"])[2]["data"]
	if (utils.phase == "ReadyCheck" && auto_accept && !queue_accepted) {
		await setTimeout(acceptMatchmaking, data.delay); // delay the accept by a maximum amount
		queue_accepted = true
	}
	else if (utils.phase != "ReadyCheck") {
		queue_accepted = false
	}
}

function fetch_or_create_champselect_buttons_container() {
	if (document.querySelector(".cs-buttons-container")) {
		return document.querySelector(".cs-buttons-container")
	}
	else {
		const div = document.createElement("div")

		div.className = "cs-buttons-container"
		document.querySelector(".v2-footer-notifications.ember-view").append(div)
		return div
	}
}

/** Callback function to be sent in routineAddCallback(). Will create the Auto Accept button */
let autoAcceptMutationObserver = (mutations) => {
	if (document.querySelector(".v2-footer-notifications.ember-view") != null && document.getElementById("autoAcceptQueueButton") == null) {
		let newOption = document.createElement("lol-uikit-radio-input-option");
		let container = fetch_or_create_champselect_buttons_container()
	
		newOption.setAttribute("id", "autoAcceptQueueButton");
		newOption.setAttribute("onclick", "window.autoAcceptQueueButton()");
		if (auto_accept){
			newOption.setAttribute("selected", "");
		}
		newOption.innerHTML = "<div class='auto-accept-button-text'>Auto Accept</div>";
		container.append(newOption);
	}
}
/** Callback function for the player Response */
let declinedQueueCallback = async message => {
	let status = JSON.parse(message["data"])[2]["data"]["playerResponse"]; // Checking if the player has declined the match
	if (status == "Declined") {
		player_declined = true;
	} else {
		player_declined = false;
	}
}

window.addEventListener('load', () => {
	utils.subscribe_endpoint('/lol-gameflow/v1/gameflow-phase', autoAcceptCallback)
	utils.subscribe_endpoint('/lol-matchmaking/v1/ready-check', declinedQueueCallback)
	utils.routineAddCallback(autoAcceptMutationObserver, ["v2-footer-notifications.ember-view"])
	utils.addCss("//plugins/auto_accept_button/assets/auto_accept_button.css")
})

let acceptMatchmaking = async () => {
	if (player_declined) return;
	await fetch('/lol-matchmaking/v1/ready-check/accept', { method: 'POST' })

}
