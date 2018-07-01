// Хелперы для работы с API расширений браузера

// Получение данных из хранилища расширения
export function get(name) {
  return new Promise(resolve => chrome.storage.local.get(name, obj => resolve(obj[name])));
}

// Запись данных в хранилище расширения
export function set(name, value) {
  chrome.storage.local.set({[name]: value});
}

// Возвращает URL-адрес текущей вкладки
export async function getCurrentUrl() {
  return new Promise(resolve =>
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      let tab = tabs[0];
      resolve(tab.url);
    })
  );
};