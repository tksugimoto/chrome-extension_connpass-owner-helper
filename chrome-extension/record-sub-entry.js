"use strict";
/*
出欠席以外に懇親会の出欠も確認する
*/

{
	function loadSavedEntryList(eventId) {
		return new Promise(resolve => {
			chrome.storage.local.get({
				[eventId]: []
			}, items => {
				resolve(items[eventId]);
			});
		});
	}

	const eventId = location.pathname.match(/^[/]event[/](\d+)/)[1];
	const eventTitle = document.querySelector(".event_title").innerText;

	loadSavedEntryList(eventId).then(entryList => {
		let promiseChain = Promise.resolve();

		function updateEntryList(userId, userName, value) {
			promiseChain = promiseChain.then(() => {
				entryList = entryList.filter(entry => {
					return entry.id !== userId;
				});
				if (value) {
					entryList.push({
						id: userId,
						name: userName
					});
				}
				return new Promise(resolve => {
					chrome.storage.local.set({
						[eventId]: entryList
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
				const userName = elem.getAttribute("data-username");
				const value = checkbox.checked;
				updateEntryList(userId, userName, value);
			});
		});
	});
}
