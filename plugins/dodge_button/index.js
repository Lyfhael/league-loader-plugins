const version = "1.2.0"
import utils from '../_utils'

async function exitClient(){
	await fetch("/process-control/v1/process/quit",
		{"method":"POST"})
}

window.exitClient = exitClient

async function dodgeQueue(){
	await fetch("/lol-login/v1/session/invoke?destination=lcdsServiceProxy&method=call&args=[\"\",\"teambuilder-draft\",\"quitV2\",\"\"]",
		{"body":"[\"\",\"teambuilder-draft\",\"quitV2\",\"\"]", "method":"POST"})
}

window.dodgeQueue = dodgeQueue

function generateDodgeAndExitButton(siblingDiv) {
	const div = document.createElement("div");
	const parentDiv = document.createElement("div")
	const placeHolderDiv = document.createElement("div")

	parentDiv.setAttribute("class", "dodge-button-container")
	parentDiv.setAttribute("style", "position: absolute;right: 0px;bottom: 57px;display: flex;align-items: flex-end;")
	div.setAttribute("class", "quit-button ember-view");
	div.setAttribute("onclick", "window.dodgeQueue()")
	div.setAttribute("id", "dodgeButton");

	placeHolderDiv.setAttribute("class", "quit-button ember-view");
	placeHolderDiv.setAttribute("onclick", "window.exitClient()")
	placeHolderDiv.setAttribute("id", "exitButton");

	const buttonPlaceHolder = document.createElement("lol-uikit-flat-button");
	const button = document.createElement("lol-uikit-flat-button");
	button.innerHTML = "Dodge";
	buttonPlaceHolder.innerHTML = "Exit";
	
	div.appendChild(button);
	placeHolderDiv.appendChild(buttonPlaceHolder)

	parentDiv.appendChild(div);
	parentDiv.appendChild(placeHolderDiv);
	console.log(parentDiv)
	siblingDiv.parentNode.insertBefore(parentDiv, siblingDiv)
}

let addDodgeAndExitButtonObserver = (mutations) => {
	if (utils.phase == "ChampSelect" && document.querySelector(".bottom-right-buttons") && !document.querySelector(".dodge-button-container")){
		generateDodgeAndExitButton(document.querySelector(".bottom-right-buttons"))
	}
}

window.addEventListener('load', () => {
	utils.routineAddCallback(addDodgeAndExitButtonObserver, ["bottom-right-buttons"])
	utils.addCss("./assets/dodge_button.css")
})