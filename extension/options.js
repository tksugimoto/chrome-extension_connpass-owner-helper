'use strict';
const setting_container = document.getElementById('setting_container');
window.Setting.getAll().then(settings => {
	settings.forEach(setting => {
		const checkBox = document.createElement('input');
		checkBox.type = 'checkbox';
		checkBox.checked = setting.value;
		const span = document.createElement('span');
		span.innerText = setting.name;
		checkBox.addEventListener('change', () => {
			window.Setting.set(setting.key, checkBox.checked);
		});

		const label = document.createElement('label');
		label.append(checkBox);
		label.append(span);

		const li = document.createElement('li');
		li.appendChild(label);
		setting_container.appendChild(li);
	});
});
