"use strict";
/*
申込者の管理ページで検索機能（受付時の確認を楽にする）
*/

Setting.get("search_participant").then(isEnabled => {
	if (!isEnabled) return;
	const participantsTables = Array.from(document.querySelectorAll(".participants_table")).map(table => {
		const participants = Array.from(table.querySelectorAll(".ParticipantView")).map(elem => {
			const number = getTextIfExist(elem, ".number");
			const displayName = elem.getAttribute("data-username").toLocaleLowerCase();
			const userName = getTextIfExist(elem, ".user_name").toLocaleLowerCase();
			return {elem, number, displayName, userName};
		});
		return {
			showAll: () => {
				participants.forEach(({elem}) => {
					elem.style.display = "";
				});
				table.style.display = "";
			},
			filterByText: value => {
				const matchCount = participants.reduce((count, {elem, number, displayName, userName}) => {
					const isMatch = number.includes(value) || displayName.includes(value) || userName.includes(value);
					elem.style.display = isMatch ? "" : "none";
					if (isMatch) count++;
					return count;
				}, 0);
				table.style.display = matchCount > 0 ? "" : "none";
			}
		};
	});
	const entryTable = document.querySelector(".entirety_area ");
	const container = document.createElement("div");
	container.style.margin = "auto";
	container.style.textAlign = "center";
	const input = document.createElement("input");
	input.style.width = "80%";
	input.placeholder = "受付番号・参加者名・IDで検索（大文字小文字無視）";
	input.addEventListener("keyup", () => {
		const value = input.value.toLocaleLowerCase();
		participantsTables.forEach(pt => pt.filterByText(value));
	});
	input.addEventListener("focus", () => {
		input.select();
	});
	container.appendChild(input);

	const clearButton = document.createElement("input");
	clearButton.type = "button";
	clearButton.value = "クリア"
	clearButton.style.cursor = "pointer";
	clearButton.addEventListener("click", () => {
		input.value = "";
		participantsTables.forEach(pt => pt.showAll());
		input.focus();
	});
	container.appendChild(clearButton);

	entryTable.parentNode.insertBefore(container, entryTable.nextElementSibling);

	function getTextIfExist(elem, selector) {
		const target = elem.querySelector(selector);
		return target ? target.innerText : "";
	}
});
