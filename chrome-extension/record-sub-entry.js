"use strict";
/*
出欠席以外に懇親会の出欠も確認する
*/

{
	function loadSavedEntryList(eventId) {
		return new Promise(resolve => {
			chrome.storage.local.get(eventId, items => {
				resolve(items[eventId]);
			});
		});
	}

	const eventId = location.pathname.match(/^[/]event[/](\d+)/)[1];
	const eventTitle = document.querySelector(".event_title").innerText;

	const subCheckedinCountElem = document.createElement("span");
	subCheckedinCountElem.innerText = 0;
	{
		const container = document.createElement("span");
		container.title = "懇親会参加者数";
		container.appendChild(document.createTextNode("（"));
		container.appendChild(subCheckedinCountElem);
		container.appendChild(document.createTextNode("人）"));

		const parent = document.getElementById("CheckedinCount").parentNode;
		parent.appendChild(container);
	}

	loadSavedEntryList(eventId).then(({entryList = []} = {}) => {
		subCheckedinCountElem.innerText = entryList.length;
		let promiseChain = Promise.resolve();

		function updateEntryList(userId, userDisplayName, value) {
			promiseChain = promiseChain.then(() => {
				entryList = entryList.filter(entry => {
					return entry.id !== userId;
				});
				if (value) {
					entryList.push({
						id: userId,
						displayName: userDisplayName
					});
				}
				subCheckedinCountElem.innerText = entryList.length;
				return new Promise(resolve => {
					chrome.storage.local.set({
						[eventId]: {eventTitle, entryList}
					}, resolve);
				});
			});
		}

		Array.from(document.querySelectorAll(".ParticipantView")).forEach(elem => {
			const userId = elem.getAttribute("data-user_id");

			const label = document.createElement("label");
			label.className = "btn btn_default";
			const checkbox = document.createElement("input");
			checkbox.checked = entryList.some(entry => entry.id === userId);
			checkbox.type = "checkbox";
			checkbox.style.verticalAlign = "middle";
			checkbox.style.cursor = "pointer";
			label.appendChild(checkbox);
			label.appendChild(document.createTextNode("懇親会参加"));
			elem.querySelector(".id").appendChild(label);

			checkbox.addEventListener("change", evt => {
				const userDisplayName = elem.getAttribute("data-username");
				const value = checkbox.checked;
				updateEntryList(userId, userDisplayName, value);
			});
		});
	});
}
