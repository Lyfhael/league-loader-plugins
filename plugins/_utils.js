let riotclient_auth, riotclient_port;
let regex_rc_auth = /^--riotclient-auth-token=([a-zA-Z0-9]+)$/
let regex_rc_port = /^--riotclient-app-port=([0-9]+)$/
let phase; // automatically updated to current gameflow phase
let debug_sub = true // to display debug messages
let observerCallbacks = [] // array of functions that will be called in MutationObserver API

/**
 * Subscribe to a specific endpoint, and trigger callback function when that endpoint is called
 * @param {string} endpoint Endpoint you wish to monitor. ex: /lol-gameflow/v1/gameflow-phase
 * @param {function} callback The callback function
 */
async function subscribe_endpoint(endpoint, callback) {
	const API = endpoint
	const uri = document.querySelector('link[rel="riot:plugins:websocket"]').href
	const ws = new WebSocket(uri, 'wamp')

	ws.onopen = () => ws.send(JSON.stringify([5, 'OnJsonApiEvent' + API.replace(/\//g, '_')]))
	ws.onmessage = callback
}

/** fetch the Riot client API port/auth and save it to variables that can be exported */
async function fetch_riotclient_credentials(){
	await fetch("/riotclient/command-line-args", {
		"method": "GET",
	}).then(response=>response.json()).then(data=>{data.forEach(elem => {if (regex_rc_auth.exec(elem)) riotclient_auth = regex_rc_auth.exec(elem)[1]; else if (regex_rc_port.exec(elem)) riotclient_port = regex_rc_port.exec(elem)[1];}); })

	if (debug_sub)
		console.log(riotclient_auth, riotclient_port)   
}

/** Callback function to be sent in subscribe_endpoint() to update the variable monitoring the gameflow phase */
let updatePhaseCallback = async message => {phase = JSON.parse(message["data"])[2]["data"];}

/**
 * Add function to be called in the MutationObserver API
 * @param {function} callback The callback function
 */
function observerAddCallback(callback) {
	observerCallbacks.push(callback)
}

module.exports = {
    riotclient_auth: riotclient_auth,
	riotclient_port: riotclient_port,
	phase: phase,
	subscribe_endpoint: subscribe_endpoint,
	observerAddCallback: observerAddCallback
}

window.addEventListener('DOMContentLoaded', () => {
	fetch_riotclient_credentials()
	subscribe_endpoint("/lol-gameflow/v1/gameflow-phase", updatePhaseCallback)
	var observer = new MutationObserver(function(mutations) {
		observerCallbacks.forEach(func => {func()})
	});
	observer.observe(document, {childList: true, subtree:true});
})
