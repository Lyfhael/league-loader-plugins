const utils = require('./_utils')

async function dodgeQueue(){
	await fetch("/lol-login/v1/session/invoke?destination=lcdsServiceProxy&method=call&args=[\"\",\"teambuilder-draft\",\"quitV2\",\"\"]",
		{"body":"[\"\",\"teambuilder-draft\",\"quitV2\",\"\"]", "method":"POST"})
}

window.dodgeQueue = dodgeQueue

function generateDodgeButton(parentDiv) {
	const div = document.createElement("div");
	div.setAttribute("id", "dodgeButton");
	div.setAttribute("class", "quit-button ember-view");
	div.setAttribute("onclick", "window.dodgeQueue()")

	const button = document.createElement("lol-uikit-flat-button");
	button.innerHTML = "Dodge";
	
	div.appendChild(button);
	parentDiv.insertBefore(div, parentDiv.firstChild);
}

let addDodgeButtonObserver = () => {
	if (utils.phase == "ChampSelect" && document.querySelector(".bottom-right-buttons") && !document.querySelector(".bottom-right-buttons > .quit-button.ember-view")){
		generateDodgeButton(document.querySelector(".bottom-right-buttons"))
	}
}

window.addEventListener('DOMContentLoaded', () => {
	utils.observerAddCallback(addDodgeButtonObserver)
})

// fetch("/lol-login/v1/session/invoke?destination=lcdsServiceProxy&method=call&args=[\"\",\"teambuilder-draft\",\"quitV2\",\"\"]",
// 	{"body":"[\"\",\"teambuilder-draft\",\"quitV2\",\"\"]", "method":"POST", "headers":{"accept":"application/json", "content-type":"application/json"}})
