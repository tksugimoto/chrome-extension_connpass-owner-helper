'use strict';
/*
出欠席以外に懇親会の出欠も確認する
*/

window.Setting.get('record_sub_entry').then(isEnabled => {
	if (!isEnabled) return;
	function loadSavedEntryList(eventId) {
		return new Promise(resolve => {
			chrome.storage.local.get(eventId, items => {
				resolve(items[eventId]);
			});
		});
	}

	const eventId = location.pathname.match(/^[/]event[/](\d+)/)[1];
	const eventTitle = document.querySelector('.event_title').innerText;

	loadSavedEntryList(eventId).then(({entryList = []} = {}) => {

		const {
			subCheckedinCountElem,
			updateEntryListDownloadLink,
		} = (() => {
			const _subCheckedinCountElem = document.createElement('span');
			const container = document.createElement('a');
			container.href = '#';
			container.target = '_blank';
			container.download = `${eventTitle}-懇親会参加者一覧.json`;
			container.title = '懇親会参加者数（クリックで一覧をダウンロード）';
			container.appendChild(document.createTextNode('（'));
			container.appendChild(_subCheckedinCountElem);
			container.appendChild(document.createTextNode('人）'));

			const parent = document.getElementById('CheckedinCount').parentNode;
			parent.appendChild(container);

			const _updateEntryListDownloadLink = (_entryList) => {
				let text = `懇親会参加者（${_entryList.length}人）\n` + _entryList.map(entry => entry.displayName).join('\n');
				let blob = new Blob([
					text,
				], {
					type: 'application/json',
				});
				container.href = window.URL.createObjectURL(blob);
			};
			return {
				subCheckedinCountElem: _subCheckedinCountElem,
				updateEntryListDownloadLink: _updateEntryListDownloadLink,
			};
		})();

		subCheckedinCountElem.innerText = entryList.length;
		updateEntryListDownloadLink(entryList);
		let promiseChain = Promise.resolve();

		function updateEntryList(userId, userDisplayName, value) {
			promiseChain = promiseChain.then(() => {
				entryList = entryList.filter(entry => {
					return entry.id !== userId;
				});
				if (value) {
					entryList.push({
						id: userId,
						displayName: userDisplayName,
					});
				}
				subCheckedinCountElem.innerText = entryList.length;
				updateEntryListDownloadLink(entryList);
				return new Promise(resolve => {
					chrome.storage.local.set({
						[eventId]: {eventTitle, entryList},
					}, resolve);
				});
			});
		}

		Array.from(document.querySelectorAll('.ParticipantView')).forEach(elem => {
			const userId = elem.getAttribute('data-user_id');

			const label = document.createElement('label');
			label.className = 'btn btn_default';
			const checkbox = document.createElement('input');
			checkbox.checked = entryList.some(entry => entry.id === userId);
			checkbox.type = 'checkbox';
			checkbox.style.verticalAlign = 'middle';
			checkbox.style.cursor = 'pointer';
			label.appendChild(checkbox);
			label.appendChild(document.createTextNode('懇親会参加'));
			elem.querySelector('.id').appendChild(label);

			checkbox.addEventListener('change', () => {
				const userDisplayName = elem.getAttribute('data-username');
				const value = checkbox.checked;
				updateEntryList(userId, userDisplayName, value);
			});
		});
	});
});
