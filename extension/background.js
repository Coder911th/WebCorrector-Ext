function initStorage(details){
    if (details.reason != 'install')
        return;
    
	chrome.storage.local.clear();
	// Инициализируем хранилище скриптов
	chrome.storage.local.set({
		extension: true,
		version: 'v1.1.0',
		nextSecurityKey: 1,
		scripts: [],
		libs: [],
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
}

chrome.runtime.onInstalled.addListener(initStorage);

var currentTabId = null;

chrome.runtime.onMessage.addListener(function(message) {
	// Прослушиваем запросы от popup
	switch (message.type) {
		case 'execScript':
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				var tabId = tabs[0].id;
				if (currentTabId != tabId) {
					// DEBUG
					console.error('Несовпадающие идентфикиаторы!');
					console.log(`currentTabId = ${currentTabId}`);
					console.log(`tabId = ${tabId}`);
					console.log(tabs);
				}
				// Запрос на выполнение скрипта на активной вклаке
				chrome.tabs.sendMessage(tabId, message);
			});
			break;
	}
});

// Отлавливаем изменение URL-адреса текущей вкладки
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if (!changeInfo.url)
		return; // URL не изменился
	currentTabId = tabId;
	chrome.runtime.sendMessage({
		type: 'changedURL',
		data: tab.url
	});
});

// Отлавливаем переключение вкладок
chrome.tabs.onActivated.addListener(function(info) {
	currentTabId = info.tabId;
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		var tab = tabs[0];
		chrome.runtime.sendMessage({
			type: 'changedURL',
			data: tab.url
		});
  });
});