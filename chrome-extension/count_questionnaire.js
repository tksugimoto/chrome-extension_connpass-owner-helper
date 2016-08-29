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

	Array.from(document.querySelectorAll(".participation_table_area .ParticipantView .enquete_area.Answers")).map(elem => {
		const questions = elem.querySelectorAll(".question");
		return Array.from(elem.querySelectorAll(".answer")).map((answerElem, i) => {
			return {
				question: questions[i].innerText,
				answer: answerElem.innerText
			};
		});
	}).reduce((flat, toFlatten) => {
		// flatten
		return flat.concat(toFlatten);
	}).reduce((results, enquete) => {
		let result = results.find(_ => _.question === enquete.question);
		if (!result) {
			result = {
				question: enquete.question,
				answers: {}
			};
			results.push(result);
		}
		const answers = result.answers;
		if (enquete.answer in answers) answers[enquete.answer]++;
		else answers[enquete.answer] = 1;
		return results;
	}, []).forEach(result => {
		const containerLi = document.createElement("li");
		containerLi.appendChild(document.createTextNode(result.question));
		const ul = document.createElement("ul");
		ul.style.listStyleType = "disc";
		ul.style.webkitPaddingStart = "20px";

		const answers = result.answers;
		Object.keys(answers).forEach(key => {
			const count = answers[key];
			const li = document.createElement("li");
			li.innerText = `${key}: ${count}`;
			ul.appendChild(li);
		});

		containerLi.appendChild(ul);
		container.appendChild(containerLi);
	});
}
