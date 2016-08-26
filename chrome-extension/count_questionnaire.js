"use strict";
/*
申込者の管理ページでアンケート結果を集計
*/

{
	const container = document.createElement("ol");
	container.style.listStyleType = "decimal";
	container.style.webkitPaddingStart = "30px";
	container.style.position = "fixed";
	container.style.bottom = "10px";
	container.style.right = "10px";
	container.style.background = "white";
	container.style.border = "2px gray solid";
	document.body.appendChild(container);

	const questions = Array.from(document.querySelector(".participation_table_area .ParticipantView .enquete_area.Answers").querySelectorAll(".question")).map(questionElem => {
		return questionElem.innerText;
	});
	const answerCountResults = Array.from(document.querySelectorAll(".participation_table_area .ParticipantView .enquete_area.Answers")).map(elem => {
		return Array.from(elem.querySelectorAll(".answer")).map(answerElem => {
			return answerElem.innerText;
		});
	}).reduce((results, answers) => {
		answers.forEach((answer, i) => {
			if (!results[i]) results[i] = {};
			const result = results[i];
			if (answer in result) result[answer]++;
			else result[answer] = 1;
		});
		return results;
	}, []);

	answerCountResults.forEach((result, i) => {
		const containerLi = document.createElement("li");
		containerLi.appendChild(document.createTextNode(questions[i]));
		const ul = document.createElement("ul");
		ul.style.listStyleType = "disc";
		ul.style.webkitPaddingStart = "20px";

		Object.keys(result).forEach(key => {
			const count = result[key];
			const li = document.createElement("li");
			li.innerText = `${key}: ${count}`;
			ul.appendChild(li);
		});

		containerLi.appendChild(ul);
		container.appendChild(containerLi);
	});
}
