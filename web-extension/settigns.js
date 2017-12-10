
const Setting = {
	settings: [{
		name: "参加者・補欠者を検索（フィルタリング）する",
		key: "search_participant",
		defaultValue: true
	}, {
		name: "アンケートの回答を集計する",
		key: "count_questionnaire",
		defaultValue: true
	}, {
		name: "懇親会参加の有無の記録",
		key: "record_sub_entry",
		defaultValue: true
	}],

	get: function (key) {
		return new Promise(resolve => {
			const setting = this.settings.find(s => s.key === key);
			if (setting) {
				chrome.storage.local.get({
					[setting.key]: setting.defaultValue
				}, items => {
					resolve(items[setting.key]);
				});
			} else {
				console.error(`setting "${key}" does not exist`);
				resolve();
			}
		});
	},

	set: function (key, value) {
		return new Promise(resolve => {
			const setting = this.settings.find(s => s.key === key);
			if (setting) {
				chrome.storage.local.set({
					[setting.key]: value
				}, resolve);
			} else {
				console.error(`setting "${key}" does not exist`);
				resolve();
			}
		});
	},

	getAll: function () {
		return new Promise(resolve => {
			const keys = this.settings.reduce((keys, {key, defaultValue}) => {
				keys[key] = defaultValue;
				return keys;
			}, {});
			chrome.storage.local.get(keys, items => {
				const results = this.settings.map(({name, key}) => {
					const value = items[key];
					return {
						name, key, value
					};
				});
				resolve(results);
			});
		});
	}
};
