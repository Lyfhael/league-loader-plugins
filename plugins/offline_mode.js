const utils = require('./_utils')

let switch_between_status = async () => {
	let status = document.querySelector("[availability]").getAttribute("availability")
	let availability = (status == "chat") ? "dnd" : (status == "dnd") ? "offline" : (status == "offline") ? "chat" : "chat"

	await fetch("/lol-chat/v1/me", {
		"headers": {
			"content-type": "application/json",
		},
		"body": `{\"availability\":\"${availability}\"${(availability == "offline") ? `,\"lol\":{\"gameStatus\":\"outOfGame\"}` : ``}}`,
		"method": "PUT",
	});
	/** replace old status by new one */
	document.querySelector(".availability-icon").classList.remove(status)
	document.querySelector(".availability-icon").classList.add(availability)
}

window.switch_between_status = switch_between_status

let availabilityButtonMutationObserver = async (mutations) => {
	let circle_status = document.querySelector(".availability-hitbox:not(.offline-mode-available)")
	let message_status = document.querySelector(".status-message:not(.offline)")
	let status = document.querySelector("[availability]").getAttribute("availability")

	/** remove duplicates */
	if (circle_status && document.querySelector(".availability-hitbox.offline-mode-available")) {
		circle_status.remove()
	}
	/** if status circle icon is legacy, update it to new one that has new click event */
	else if (circle_status) {
		console.log(mutations)
		circle_status.classList.add("offline-mode-available");
		circle_status.outerHTML = circle_status.outerHTML
		document.querySelector(".availability-hitbox").addEventListener("click", switch_between_status, false)
	}
	/** if status is offline, but message status doesn't match offline status, update it */
	if (message_status && status == "offline") {		
		await fetch("/lol-chat/v1/me", {
			"headers": {
				"content-type": "application/json",
			},
			"body": `{\"availability\":\"${status}\",\"lol\":{\"gameStatus\":\"outOfGame\"}}`,
			"method": "PUT",
		});
	}
}

window.addEventListener('DOMContentLoaded', () => {
	utils.observerAddCallback(availabilityButtonMutationObserver)
})
