// Тестовое хранилище
chrome.storage.local.set({
	extension: true,
	version: 'v1.2.0 test',
	nextSecurityKey: 1,
	scripts: [
		{
			name: "Reloger",
			sites: "https://games.mail.ru/",
			active: true,
			libs: ["jQuery 3.3.1"],
			code: "3$('.pm-logo__link').text('Relogo')",
			securityKey: 0
		}
	],
	libs: [
		{
			alias: "jQuery 3.3.1",
			url: "https://code.jquery.com/jquery-3.3.1.js"
		}
	],
	lang: 'EN',	
	
	aboutScriptTarget: null,
	isOpenSpoiler: true,
	activeTab: 0,
	filterField: '',
	libAlias: '',
	libURL: '',

	scriptActive: true,
	scriptName: '',
	scriptSites: '',
	scriptLibs: [],
	scriptCode: '',

	filterFlags: {
		byName: true,
		bySite: false,
		bySecurityKey: false
	}
});