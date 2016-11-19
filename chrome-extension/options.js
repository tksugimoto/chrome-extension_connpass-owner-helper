"use strict";
const setting_container = document.getElementById("setting_container");
Setting.getAll().then(settings => {
	settings.forEach(setting => {
		const checkBox = document.createElement("check-box");
		checkBox.checked = setting.value;
		checkBox.innerText = setting.name;
		checkBox.addEventListener("change", ({checked}) => {
			Setting.set(setting.key, checked);
		});

		const li = document.createElement("li");
		li.appendChild(checkBox);
		setting_container.appendChild(li);
	});
});
