const utils = require('./_utils')
let regex = /(?:\/lol-chat\/v1\/conversations\/)(.+)(?:\/messages\/)(.+)/
let regex2 = /(?:\/lol-chat\/v1\/conversations\/)(.+)(?:\/participants)/
let participants = {}

async function log_participant(participant, room_id, pos) {
	let sender_id = participant["summonerId"] || participant["obfuscatedSummonerId"] || participant["fromSummonerId"] || participant["fromObfuscatedSummonerId"];
	let sender_name = participant["name"] || `AnonymousPlayer${pos}`;

	console.log("PARTICIPANTS:", participant)
	if (room_id in participants == false) {
		participants[room_id] = {}
	}
	if (sender_id in participants[room_id] == false) {
		participants[room_id][sender_id] = sender_name
	}
}

async function send_message_in_lobby(message, room_id) {
	await fetch(`/lol-chat/v1/conversations/${room_id}/messages`, {
		"headers": {
			"accept": "application/json",
			"content-type": "application/json",
		},
		"body": `{\"type\":\"chat\",\"fromId\":\"${utils.pvp_net_id}\",\"fromSummonerId\":${utils.summoner_id},\"isHistorical\":false,\"timestamp\":\"${new Date().toISOString()}\",\"body\":\"${message}\"}`,
		"method": "POST",
	});
}

let davinciHandleMessage = async (message) => {
	const data = JSON.parse(message.data)
	let regres = regex.exec(data[2]["uri"])
	let regres2 = regex2.exec(data[2]["uri"])

	if (regres2 && data[2]["data"]) {
		let pvp_net_room_id = regres2[1] // chat room id
		let pos = 0; // used  to format default user name (AnonymousPlayer1) in case real usernames are not available

		if (Array.isArray(data[2]["data"])){
			for (let user of data[2]["data"]){
				await log_participant(user, pvp_net_room_id, pos)
				pos += 1;
			}
		}
		else if (typeof data[2]["data"] === "object") {
			await log_participant(data[2]["data"], pvp_net_room_id, pos)
		}
	}

	else if (regres && data[2]["data"] && "body" in data[2]["data"] && data[2]["data"]["type"] != "SYSTEM") {
		let pvp_net_room_id = regres[1] // chat room id
		let sender_id = data[2]["data"]["fromSummonerId"] || data[2]["data"]["fromObfuscatedSummonerId"];
		let message = data[2]["data"]["body"]
		let sender_name;
		try{
			sender_name = participants[pvp_net_room_id][sender_id]
		}
		catch {
			sender_name = "AnonymousPlayer0"
		}
		console.log(participants)
		if (message.toLowerCase().startsWith("/ariane") == false) {
			return ;
		}
		else {
			var response_message;
	
			message = `${sender_name}: ${message}`
			await fetch("http://127.0.0.1:5000/davinci", {method:"POST", headers:{"id":pvp_net_room_id, "personality":"ariane", "message":message}})
			.then(response => response.json())
			.then(data => response_message = `${data}`)
			.catch(error => console.error(error))

			await send_message_in_lobby(response_message, pvp_net_room_id)
		}
	}
}

window.addEventListener('DOMContentLoaded', () => {
	utils.subscribe_endpoint("/lol-chat/v1/conversations", davinciHandleMessage)
})
