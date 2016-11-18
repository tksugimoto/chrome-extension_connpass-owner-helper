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


	class AnswerCount {
		constructor() {
			this.participantCount = 0;
			this.waitingCount = 0;
		}

		countUp(isWaiting) {
			if (isWaiting) {
				this.waitingCount++;
			} else {
				this.participantCount++;
			}
		}
	}

	Array.from(document.querySelectorAll(".ParticipantView .enquete_area.Answers")).map(elem => {
		const questions = elem.querySelectorAll(".question");
		const isWaiting = !!elem.closest(".waitlist_table_area");
		return Array.from(elem.querySelectorAll(".answer")).map((answerElem, i) => {
			return {
				isWaiting: isWaiting,
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
		if (!(enquete.answer in answers)) answers[enquete.answer] = new AnswerCount();
		answers[enquete.answer].countUp(enquete.isWaiting);
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
			li.innerText = `${key}: ${count.participantCount} + ${count.waitingCount}`;
			li.title = "回答: 参加者数 + 補欠者数";
			ul.appendChild(li);
		});

		containerLi.appendChild(ul);
		container.appendChild(containerLi);
	});
}
