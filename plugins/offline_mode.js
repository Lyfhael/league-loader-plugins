const utils = require('./_utils')
let covert_status = "chat";

/** return the player availability status */
function get_status() {
	let element = document.querySelector(".availability-icon")
	let possible_status = ["dnd", "chat", "away", "offline", "mobile"]

	if (element) {
		for (let elem of possible_status){
			if (element.classList.contains(elem)){
				return elem
			}
		}
	}
	/** it shouldn't reach here */
	return "chat"
}

let switch_between_status = async () => {
	let status = get_status()
	let availability = (status == "chat") ? "mobile" : (status == "mobile") ? "dnd" : (status == "dnd") ? "away" : (status == "away") ? "offline" : (status == "offline") ? "chat" : "chat"

	console.log("pass 1")
	await fetch("/lol-chat/v1/me", {
		"headers": {
			"content-type": "application/json",
		},
		"body": `{\"availability\":\"${availability}\"${(availability == "offline" || availability == "away") ? `,\"lol\":{\"gameStatus\":\"outOfGame\"}` : (availability == "dnd") ? `,\"lol\":{\"gameStatus\":\"inGame\"}` : `` }}`,
		"method": "PUT",
	});
	/** replace old status by new one */
	document.querySelector(".availability-icon").classList.remove(status)
	document.querySelector(".availability-icon").classList.add(availability)
	covert_status = availability
}

window.switch_between_status = switch_between_status

/** fix status when in champ select / game */
async function patchStatus(){
	await fetch("/lol-chat/v1/me", {
		"headers": {
			"content-type": "application/json",
		},
		"body": `{\"availability\":\"${covert_status}\",\"lol\":{\"gameStatus\":\"outOfGame\"}}`,
		"method": "PUT",
	});
}

let champSelectPatchStatus = async message => {
	let phase = JSON.parse(message["data"])[2]["data"];
	if (phase == "ChampSelect" && (covert_status == "offline" || covert_status == "away")) {
		await patchStatus()
	}
}

let availabilityButtonMutationObserver = async (mutations) => {
	let circle_status = document.querySelector(".availability-hitbox:not(.offline-mode-available), .availability-hitbox:not([onclick])")
	let circle_status_custom = document.querySelectorAll(".availability-hitbox.offline-mode-available")
	let custom_message_status = document.querySelector(".details .status-message.game-status")

	/** if status circle icon is legacy, update it to new one that has new click event */
	if (circle_status) {
		console.log(mutations)
		circle_status.classList.add("offline-mode-available");
		circle_status.outerHTML = circle_status.outerHTML
		document.querySelector(".availability-hitbox").setAttribute("onclick", "window.switch_between_status()")
	}
	/** if status is offline, but message status doesn't match offline status, update it */
	if (custom_message_status && covert_status == "offline") {		
		await patchStatus();
	}
	if (circle_status_custom.length > 1){
		circle_status_custom.forEach((elem, index) => {
			if (index){
				elem.remove()
			}
		})
	}
}

window.addEventListener('DOMContentLoaded', () => {
	utils.subscribe_endpoint("/lol-gameflow/v1/gameflow-phase", champSelectPatchStatus)
	utils.observerAddCallback(availabilityButtonMutationObserver, ["availability-hitbox", "status-message"])
})
