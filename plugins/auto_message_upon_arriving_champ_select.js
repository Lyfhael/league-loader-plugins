const utils = require('./_utils')
let set_timeout_player_joined; // id of setTimeout that will trigger the send_message_in_lobby()
let pvp_net_room_id; // chat room id
let regex1 = /\/lol-chat\/v1\/conversations\/.+\/messages\/.+/
let regex2 = /(?:\/lol-chat\/v1\/conversations\/)(.+)(?:\/messages\/.+)/
let message_to_send = "https://twitch-tools.lolarchiver.com"
/**
 * Send message in the current lobby.
 * @param {message} endpoint Message to be send in lobby
 */
async function send_message_in_lobby(message) {
	await fetch(`/lol-chat/v1/conversations/${pvp_net_room_id}/messages`, {
		"headers": {
			"accept": "application/json",
			"content-type": "application/json",
		},
		"body": `{\"type\":\"chat\",\"fromId\":\"${utils.pvp_net_id}\",\"fromSummonerId\":${utils.summoner_id},\"isHistorical\":false,\"timestamp\":\"${new Date().toISOString()}\",\"body\":\"${message}\"}`,
		"method": "POST",
	});
}

/** Called upon connecting to a lobby with other users(champ-select, post game lobby, etc). */
let sendMessageUponArrivingLobby = async message => {
	const data = JSON.parse(message.data)
	const phasesTracked = ["ChampSelect", "EndOfGame", "PreEndOfGame", "WaitingForStats"]
	if (debug_sub)
		console.log(utils.phase, utils.pvp_net_id, utils.summoner_id, pvp_net_room_id)

	if (regex1.exec(data[2]["uri"]) && "body" in data[2]["data"] && data[2]["data"]["body"] == "joined_room" && phasesTracked.includes(utils.phase)) {
		utils.phase = utils.phase + "AdvertiseDone"
		pvp_net_room_id = regex2.exec(data[2]["uri"])[1]
		clearTimeout(set_timeout_player_joined) // goal is to delay the sending of the message until last player joined. Remove this line if necessary
		set_timeout_player_joined = setTimeout(async () => {
			await send_message_in_lobby(message_to_send)
		}, 1500)
	}
}

window.addEventListener('DOMContentLoaded', () => {
	utils.subscribe_endpoint("/lol-chat/v1/conversations", sendMessageUponArrivingLobby)
})
