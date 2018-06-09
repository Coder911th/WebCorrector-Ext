// Словарь
var EN = {
  'При выполнении скрипта': 'During the execution of the script',
  'произошла ошибка': 'an error occurred',
  'Произошла ошибка при парсинге скрипта': 'An error occurred while parsing the script'
};

function getTranslate(lang, phrase) {
  return lang == 'EN'
    ? EN[phrase]
      ? EN[phrase]
      : phrase
    : phrase;
}

// Список названий библиотек, которые либо уже загружены, либо ожидают загрузки
var loadList = [];

// Хранилище всех скриптов
var libs = null;

// Получает url библиотеки, если таковая есть в базе
function getLibUrl(name) {
  if (!libs)
    return false;

  for (var i = 0; i < libs.length; i++) {
    if (libs[i].alias == name) {
      return libs[i].url;
    }
  }
  return false;
}

// Добавляем скрипт в список на загрузку
function addLibToLoadList(name) {
  var url = getLibUrl(name);
  if (!url)
    return false;

  // Проверяем была ли уже загружена данная библиотека
  for (var i = 0; i < loadList.length; i++) {
    if (loadList[i] == url) {

      // Библиотека уже была загружена
      return false;
    }
  }

  // Библиотека ещё не была загружена на страницу
  loadList.push(url);
  return url;
}

function loadScript(url, callback, code, scriptName, lang) {
  var element = document.createElement('script');
  element.async = false;

  if (url) {
    element.src = url;
    element.onerror = function() {
      alert('Could not load the library at ' + url);
      callback();
    };
  } else {
    injectedCode = 
      'try {' + '\n\n' + 
        code + '\n\n' +
      '} catch (error) {' + '\n' +
      '  console.error(\'[WebCorrector Ext] ' + getTranslate(lang, 'При выполнении скрипта') + ' "' + scriptName.replace("'", "\\'") + '" ' + getTranslate(lang, 'произошла ошибка') + '!\');' + '\n' +
      '  console.error(error);' + '\n' +
      '}';
    try {
      eval('if (false) {' + injectedCode + '}');
    } catch (error) {
      console.error('[WebCorrector] ' + getTranslate(lang, 'Произошла ошибка при парсинге скрипта') + ' "' + scriptName + '"!');
      console.error(error);
      return;
    }
    element.textContent = injectedCode;
  }

  element.onload = callback;
  document.body.appendChild(element);
}

function loader(storage) {
  
  // Вставка скриптов отключена
  if (!storage.extension) {
    return;
  }
  
  // Хранилище скриптов и библиотек
  var scripts = storage.scripts;
  libs = storage.libs;

  // Скрипты ожидающие выполнения
  var queueScripts = [];

  scripts.forEach(function(script) {
    // Скрипт отключен пользователем
    if (!script.active) {
      return;
    }

    // Скрипт не нацелен на данный сайт
    if (!new RegExp(script.sites).test(location.href)) {
      return;
    }

    // Формируем список подключаемых библиотек
    script.libs.forEach(addLibToLoadList);

    // Добавляем скрипт в очередь выполнения
    queueScripts.push(script);
  });

  function onLibsLoaded() {
    // Все библиотеки загрузились, начинаем выполнять скрипты
    if (--leftLoad < 1) {
      queueScripts.forEach(function(script) {
        loadScript(null, null, script.code, script.name, storage.lang);
      });
    }
  }
  
  // Осталось загрузить библиотек
  var leftLoad = loadList.length;

  if (!leftLoad) {
    onLibsLoaded();
  }

  // Подключаем библиотеки
  loadList.forEach(function(url) {
    loadScript(url, onLibsLoaded, null, null, storage.lang);
  });
}

chrome.storage.local.get(null, loader);

// Обработка запросов на выполнение скриптов (по имени)
chrome.runtime.onMessage.addListener(function(message) {
  switch (message.type) {
    case 'execScript':
      var name = message.data;

      // Загружаем список скриптов из хранилища расширений
      chrome.storage.local.get(['scripts', 'libs', 'lang'], function(storage) {
        var scripts = storage.scripts;

        // Обновляем список библиотек расширения
        libs = storage.libs;

        scripts.forEach(function(script) {
          if (script.name == name) {
            
            var amount = 0;
            var waitingForLoading = false;

            // Подключаем зависимости скрипта
            script.libs.forEach(function(libName) {
              var url = addLibToLoadList(libName);
              if (url) {
                amount++;
                waitingForLoading = true;
                loadScript(url, function() {

                  // Если все библиотеки загружены, то выполняем сам скрипт
                  if (--amount < 1) {  
                    loadScript(null, null, script.code, script.name, storage.lang);
                  }
                });
              }
            });

            // Если все зависимости скрипта уже загружены на страницу
            // Выполняем сам скрипт
            if (!waitingForLoading) {
              loadScript(null, null, script.code, script.name, storage.lang);
            }
          }
        });
      });
      break;
  }
});