const version = "0.2.1"
const utils = require('./_utils')

async function fetch_lobby_summoners() {
	let auth_token = btoa(`riot:${utils.riotclient_auth}`);
	var playerlist = [];
	let headers = {
		"Connection": "keep-alive", "Authorization": `Basic ${auth_token}`, "Accept": "application/json", "Method": "GET",
		"Access-Control-Allow-Credentials": "true", "Access-Control-Allow-Origin": "127.0.0.1", "Content-Type": "application/json",
		"Origin": `https://127.0.0.1:${utils.riotclient_port}`, "Sec-Fetch-Dest": "empty", "Sec-Fetch-Mode": "cors",
		"Sec-Fetch-Site": "same-origin", "Sec-Fetch-User": "?F", "sec-ch-ua": "Chromium", "Accept-Language": "en-US,en;q=0.9",
		"Referer": `https://127.0.0.1:${utils.riotclient_port}/index.html`, "Accept-Encoding": "gzip, deflate, br",
		"User-Agent": `Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) RiotClient/1.5.6 (CEF 74) Safari/537.36`
	};

	await fetch(`https://127.0.0.1:${utils.riotclient_port}/chat/v5/participants/champ-select`, {
		method: "GET", headers: headers, mode: "cors", cache: "no-cache", credentials: "same-origin"
	})
		.then(response => response.json())
		.then(data => {
			console.log(data)
			data.participants.forEach((elem) => { playerlist.push(elem.name) })
		})
		.catch(error => {
			console.error(error);
		});
	return playerlist
}

window.fetch_lobby_summoners = fetch_lobby_summoners

function create_element(tagName, className, content) {
	const el = document.createElement(tagName);
	el.className = className;
	if (content) {
		el.innerHTML = content;
	}
	return el;
};

function create_player_icon_container(level, image_link) {
	const playerIconContainer = create_element("div", "profile-icon-container-revealer")
	const levelHeader = create_element("div", "level-header-revealer", level)
	const profileIconBorder = create_element("div", "profile-icon-border-revealer")
	const borderNotch = create_element("div", "border-notch-revealer")
	const playerIconImage = create_element("img", "profile-icon-image-revealer")
	playerIconImage.src = image_link

	playerIconContainer.append(levelHeader)
	playerIconContainer.append(profileIconBorder)
	profileIconBorder.append(borderNotch)
	profileIconBorder.append(playerIconImage)

	return playerIconContainer
}

function create_player_past_rank_container(past_rank) {
	const playerPastRankContainer = create_element("div", "player-past-ranks-container-revealer");
	let season = "S22";

	playerPastRankContainer.append(create_element("span", "past-rank-revealer", `<b class="rank-reveal gold"><strong>${season}</strong>${past_rank}</b>`))

	return playerPastRankContainer
}

function create_name_and_role_container(name, roles) {
	const nameAndRoleContainer = create_element("div", "name-and-role-container-revealer")
	const playerName = create_element("span", "player-name-revealer", name)

	nameAndRoleContainer.append(playerName)
	for (let role of roles) {
		let roleIcon = create_element("img", "role-icon-revealer")

		roleIcon.src = `//assets/icon-position-${role.toLocaleLowerCase().replace(' ', '-')}.svg`
		roleIcon.title = `Main ${role}`
		nameAndRoleContainer.append(roleIcon)
	}
	return nameAndRoleContainer
}

function create_rank_information(wins, losses, rank, lps) {
	const rankInformation = create_element("div", "rank-information-revealer")
	const rankIcon = create_element("img", "rank-icon-revealer")
	const rankGameInformation = create_element("div", "rank-game-information-revealer")

	const rankElo = create_element("span", "rank-revealer", `<strong>${rank}</strong> ${lps}LP`)
	const winCount = create_element("span", "win-revealer", `Wins <b>${wins}</b>`)
	const lossCount = create_element("span", "loss-revealer", `Losses <b>${losses}</b>`)

	rankIcon.src = `//assets/rank-icon-${rank.toLocaleLowerCase().split(" ")[0]}.png`
	rankGameInformation.append(rankElo)
	rankGameInformation.append(winCount)
	rankGameInformation.append(lossCount)
	rankInformation.append(rankIcon)
	rankInformation.append(rankGameInformation)

	return rankInformation
}

function create_player_flavor_tags_container(tags) {
	const playerFlavorTagsContainer = create_element("div", "player-flavor-tags-container-revealer")

	for (let tag of tags) {
		let tagElement = create_element("div", `player-flavor-tag-revealer ${tag.color}`, `<strong>${tag.title}</strong>`)

		tagElement.title = tag.description
		playerFlavorTagsContainer.append(tagElement)
	}
	return playerFlavorTagsContainer
}

function create_premade_items(premade) {
	if (premade) {
		var premadeIcon = create_element("img", "premade-icon")
		var premadeNumber = create_element("span", "premade-number", premade)

		premadeIcon.src = "//assets/players-duo.svg"
		return [premadeIcon, premadeNumber]
	}

	return undefined
}

function create_player_info_container(player) {
	const playerInfoContainer = create_element("div", "player-info-revealer")
	const playerPastRankContainer = create_player_past_rank_container(player.rank_last_season)
	const nameAndRoleContainer = create_name_and_role_container(player.name, player.main_roles)
	const premadeItems = create_premade_items(player.premade)
	const rankInformation = create_rank_information(player.wins, player.losses, player.rank, player.lps)
//	const playerFlavorTagsContainer = create_player_flavor_tags_container(player.tags)

	if (premadeItems != undefined){
		for (let item of premadeItems){
			nameAndRoleContainer.append(item)
		}
	}
	playerInfoContainer.append(playerPastRankContainer)
	playerInfoContainer.append(nameAndRoleContainer)
	playerInfoContainer.append(rankInformation)
//	playerInfoContainer.append(playerFlavorTagsContainer)

	return playerInfoContainer
}

function generate_player_box(player) {
	const playerSuperContainerRevealer = create_element("div", "player-super-container-revealer hide-revealer")
	const playerContainerRevealer = create_element("div", "player-container-revealer")
	const playerIconContainer = create_player_icon_container(player.level, player.profileIcon)
	const playerInfoContainer = create_player_info_container(player)
	const playerFlavorTagsContainer = create_player_flavor_tags_container(player.tags)

	playerContainerRevealer.append(playerIconContainer)
	playerContainerRevealer.append(playerInfoContainer)
	playerSuperContainerRevealer.append(playerContainerRevealer)
	playerSuperContainerRevealer.append(playerFlavorTagsContainer)
	return playerSuperContainerRevealer
}



async function scrape_leagueofgraphs(players, region) {
	var results = []
	var list_players = ""

	for (let player of players) {
		if (list_players){
			list_players += ','
		}
		list_players += `${player}`
	}
	await fetch(`https://porofessor.gg/partial/pregame-partial/${region}/${list_players}/ranked-only`).then(response => response.text())
		.then(async data => {
			let parser = new DOMParser();
			let doc = parser.parseFromString(data, 'text/html');
			
			console.log(doc.querySelector(".cards-list.cards-list-centered"))
			if (!doc.querySelector(".cards-list.cards-list-centered")){
				console.log(doc, `https://porofessor.gg/partial/pregame-partial/${region}/${list_players}/ranked-only`)
			}
			if (doc.querySelector(".cards-list.cards-list-centered")){
				for (let player_card of doc.querySelector(".cards-list.cards-list-centered").children){
					let result = {}
					result.name = player_card.querySelector("[data-summonername]").getAttribute("data-summonername")
					try {result.rank = player_card.querySelector(".rankingsBox .txt > .title").childNodes[0].textContent.split("\n")[1].trim()}
					catch {result.rank = "Unranked"}
					try {result.lps = player_card.querySelector(".rankingsBox .txt > .title").childNodes[1].textContent.split(" ")[0]}
					catch {result.lps = 0}
					try {
						result.wins = player_card.querySelector("#mainsBox .win > span").textContent
						result.losses = player_card.querySelector("#mainsBox .played > span").textContent - result.wins
					}
					catch {result.losses = 0; result.winss = 0}
					try { result.rank_last_season = player_card.querySelector(".inlinePreviousSeasonRanking > img").title }
					catch { result.rank_last_season = "Unranked" }
					try {result.main_roles = player_card.querySelector(".rolesBox > .imgFlex > .txt > .content.oneLiner > span.highlight").textContent.split('\n')[1].trim().split(", ")}
					catch {result.main_roles = []}
					if (player_card.querySelector(".premadeHistoryTagContainer > .premadeTag")) {
						result.premade = player_card.querySelector(".premadeHistoryTagContainer > .premadeTag").className.split('-')[1]
					}
					else {
						result.premade = 0
					}
					result.tags = []
					if (player_card.querySelector(".box.tags-box")) {
						for (let tag of player_card.querySelector(".box.tags-box").children) {
							let tag_result = {};
							let parser_tags = new DOMParser();
							let doc_tags = parser_tags.parseFromString(tag.querySelector("div").getAttribute("tooltip"), 'text/html');

							try {
								tag_result.color = doc_tags.querySelector("itemname.tagTitle").classList[1]
							}
							catch {
								tag_result.color = "green"
							}
							try {
								tag_result.title = doc_tags.querySelector("itemname.tagTitle").textContent
							}
							catch {
								tag_result.title = "Undefined"
								console.log(tag)
							}
							tag_result.description = ""
							for (let node of doc_tags.querySelector("span.tagDescription").childNodes) {
								tag_result.description += node.textContent
							}
							result.tags.push(tag_result)
						}
					}
					// await fetch(`https://www.op.gg/summoners/${region}/${result.name}`).then(response => response.text())
					// .then(async data => {
					// 	let parser_opgg = new DOMParser();
					// 	let doc = parser_opgg.parseFromString(data, 'text/html');

					// 	result.level = doc.querySelector("span.level").textContent
					// 	result.profileIcon = doc.querySelector(".profile-icon > img").src
					// }).catch(error => console.error(error));
					results.push(result)
				}
				await Promise.all(players.map(player => fetch(`https://www.op.gg/summoners/${region}/${player}`)))
				.then(responses => {
				return Promise.all(responses.map(response => response.text()));
				})
				.then(texts => {
				texts.forEach((data, index) => {
					let parser_opgg = new DOMParser();
					let doc = parser_opgg.parseFromString(data, 'text/html');
					let current_player = doc.querySelector(".summoner-name").textContent

					for (let elem in results) {
						console.log()
						if (results[elem].name.toLocaleLowerCase() == current_player.toLocaleLowerCase()){
							results[elem].level = doc.querySelector("span.level").textContent
							results[elem].profileIcon = doc.querySelector(".profile-icon > img").src
						}
					}
				});
				});
			}
		})
		.catch(error => console.error(error));
	return results
}

function remove_reveal_box() {
	if (document.querySelector("#players-name-reveal-container")) {
		document.querySelector("#players-name-reveal-container").remove()
		return true
	}
	else {
		return false
	}
}

function create_loading_wheel() {
	const spinnerDiv = document.createElement('div');
	spinnerDiv.classList.add('managed-iframe-spinner');
	
	const spinnerImage = document.createElement('img');
	spinnerImage.src = '/fe/lol-static-assets/images/spinner.png';
	spinnerImage.classList.add('lol-uikit-spinner-image', 'lol-uikit-spinner-image-default-size', 'loading-wheel-revealer');
	
	spinnerDiv.appendChild(spinnerImage);

	return spinnerDiv
}

async function create_reveal_box(target) {
	const container = document.createElement("div");
	container.id = "players-name-reveal-container";
	container.className = "modal";
	container.style.position = "absolute";
	container.style.inset = "0px";
	container.style.zIndex = "8500";

	const backdrop = document.createElement("lol-uikit-full-page-backdrop");
	backdrop.className = "backdrop";
	backdrop.style.display = "flex";
	backdrop.style.alignItems = "center";
	backdrop.style.justifyContent = "center";
	backdrop.style.position = "absolute";
	backdrop.style.inset = "0px";
	backdrop.style.background = "linear-gradient(rgb(0 0 0 / 42%), rgb(0 0 0 / 43%) 100%)!important";

	const dialogConfirm = document.createElement("div");
	dialogConfirm.className = "dialog-confirm";
	dialogConfirm.style.display = "flex";
	dialogConfirm.style.alignItems = "center";
	dialogConfirm.style.justifyContent = "center";
	dialogConfirm.style.position = "absolute";
	dialogConfirm.style.inset = "0px";

	const dialogFrame = document.createElement("lol-uikit-dialog-frame");
	dialogFrame.className = "dialog-frame";
	dialogFrame.setAttribute("orientation", "bottom");
	dialogFrame.style.zIndex = "0";

	const dialogContent = document.createElement("div");
	dialogContent.className = "dialog-content";
	dialogContent.style.paddingBottom = "30px"

	const modal = document.createElement("div");
	modal.className = "lol-friend-finder-modal scrollbar-revealer";

	const title = document.createElement("h4");
	title.className = "title";
	title.innerText = "Players";

	const buttonGroup = document.createElement("lol-uikit-flat-button-group");
	buttonGroup.setAttribute("type", "dialog-frame");

	const buttonAccept = document.createElement("lol-uikit-flat-button");
	buttonAccept.className = "button-accept";
	buttonAccept.innerText = "Close";
	buttonAccept.addEventListener("click", () => {
		remove_reveal_box()
	})

	const spinnerDiv = create_loading_wheel()

	modal.appendChild(title);
	modal.appendChild(spinnerDiv)
	dialogContent.appendChild(modal);
	dialogFrame.appendChild(dialogContent);
	dialogFrame.appendChild(buttonGroup);
	buttonGroup.appendChild(buttonAccept);
	dialogConfirm.appendChild(dialogFrame);
	container.appendChild(backdrop);
	container.appendChild(dialogConfirm);

	target.prepend(container)
	let players = await fetch_lobby_summoners()
	let region = /[a-zA-Z]+/.exec(document.body.dataset.region)[0]
	let scraped_players = await scrape_leagueofgraphs(players, region)
	console.log(scraped_players)
	for (let scraped_player of scraped_players) {
		modal.appendChild(generate_player_box(scraped_player))
		modal.appendChild(create_element("hr", "hr-revealer hide-revealer"))
	}
	document.querySelector(".loading-wheel-revealer").remove()
	document.querySelectorAll(".hide-revealer").forEach((elem) => {elem.classList.remove("hide-revealer")})
}

async function reveal_players_box() {
	if (remove_reveal_box()) {
		return
	}
	else {
		await create_reveal_box(document.querySelector(".champion-select-main-container .visible"))
	}
}

function create_button() {
	let button = document.createElement("button");
	let div = document.createElement("div");

	button.id = "display-summoner-button-container";
	div.classList.add("display-summoner-button-icon", "visibility-on-icon");
	button.appendChild(div);
	button.addEventListener("click", async () => {reveal_players_box()})
	return button
}

let addRevealPlayersButtonObserver = (mutations) => {
	let controls_container = document.querySelector(".loadout-edit-controls > .loadout-edit-controls-row")

	if (utils.phase == "ChampSelect" && controls_container) {
		if (!document.querySelector("button#display-summoner-button-container")) {
			let button = create_button()

			controls_container.prepend(button)
		}
	}
}

window.addEventListener('DOMContentLoaded', () => {
	utils.addCss("//assets/display_summoner_names.css")
	utils.routineAddCallback(addRevealPlayersButtonObserver, ["loadout-edit-controls"])
})
