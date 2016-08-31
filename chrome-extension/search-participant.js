"use strict";
/*
申込者の管理ページで検索機能（受付時の確認を楽にする）
*/

{
	const participants = Array.from(document.querySelectorAll(".ParticipantView")).map(elem => {
		const number = getTextIfExist(elem, ".number");
		const displayName = elem.getAttribute("data-username").toLocaleLowerCase();
		const userName = getTextIfExist(elem, ".user_name").toLocaleLowerCase();
		return {elem, number, displayName, userName};
	});
	const entryTable = document.querySelector(".entirety_area ");
	const container = document.createElement("div");
	const input = document.createElement("input");
	input.style.width = "80%";
	input.style.display = "block";
	input.style.margin = "auto";
	input.placeholder = "受付番号・参加者名・IDで検索（大文字小文字無視）";
	input.addEventListener("keyup", () => {
		const value = input.value.toLocaleLowerCase();
		participants.forEach(({elem, number, displayName, userName}) => {
			const isMatch = number.startsWith(value) || displayName.includes(value) || userName.includes(value);
			elem.style.display = isMatch ? "" : "none";
		});
	});
	input.addEventListener("focus", () => {
		input.select();
	});
	container.appendChild(input);
	entryTable.parentNode.insertBefore(container, entryTable.nextElementSibling);

	function getTextIfExist(elem, selector) {
		const target = elem.querySelector(selector);
		return target ? target.innerText : "";
	}
}
