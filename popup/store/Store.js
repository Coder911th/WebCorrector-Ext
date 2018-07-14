import Vue from 'vue';
import Vuex from 'vuex';
import {vuexStates} from 'JavaScript/VuexHelpers';
import Popup from 'JavaScript/PopupManager';
import {getCurrentUrl} from 'JavaScript/BrowserExtensionHelpers';
import {escapeHTML} from 'JavaScript/Escape.js'

Vue.use(Vuex);

export default new Promise(async function(resolve) {
  resolve(new Vuex.Store(await getStore()));
});

async function getStore() {
  let store = {
    ...await vuexStates([
      
      // Режим работы расширения
      // true - обычный режим. Происходят инъекции кода в страницы.
      // false - Popup приложения работает, но инъекции кода не происходят
      'extension',
  
      // Версия приложения
      'version',
  
      // Следующее значение (свободное) ключа безопасности
      'nextSecurityKey',
  
      // Хранилище скриптов
      'scripts',
  
      // Хранилище библиотек
      'libs',
  
      // Язык локализации
      'lang',
  
      /////////////////////////////////////////////
      // Настройки для сохранения состояния окна //
      /////////////////////////////////////////////
  
      // Открыт ли спойлер в окне с информацией о скрипте
      'isOpenSpoiler',
  
      // Индекс просматриваемой вкладки
      'activeTab',
  
      // Содержимое поля фильтра
      'filterField',
  
      // Название библиотеки в настройках (поле ввода)
      'libAlias',
  
      // Url библиотеки в настройках (поле ввода)
      'libURL',
      
      // Просматриваемый скрипт в компоненте AboutScript
      'aboutScriptTarget',

      /*** Поля редактируемого скрипта ***/
      'scriptActive',
      'scriptName',
      'scriptSites',
      'scriptLibs',
      'scriptCode',
  
      // Флаги фильтров
      'filterFlags'
    ]),
    actions: {
      // Создаёт новый скрипт и открывает окно его редактирования
      // В дополнение заполняет указанные в объекте init поля нового скрипта
      createScript({dispatch: action}, init={}) {
        action('showScriptInfo', {
          isNewScript: true,
          active: init.active || true,
          name: init.name || '',
          sites: init.sites || '',
          code: init.code || '',
          libs: init.libs || [],
        });
      },
      
      // Показывает страницу с информацией о скрипте
      showScriptInfo({state, commit: setState}, script) {
        setState('aboutScriptTarget', script);
        setState('scriptActive',script.active);
        setState('scriptName', script.name);
        setState('scriptSites', script.sites);
        setState('scriptLibs', Array.from(script.libs));
        setState('scriptCode', script.code);
        if (!state.aboutScriptWindow) {
          setState('initAboutScriptWindow');
        }
        state.aboutScriptWindow.activateWindow();
      },

      // Скрывает страницу с информацией о скрипте
      hideScriptInfo({state, commit: setState}) {
        setState('aboutScriptTarget', null);
        this._vm.$mainWindow.activateWindow();
      },

      // Проверяет изменился ли скрипт (кромя состояния active)
      wasChanges({state}, {before, after}) {
        return !before.isNewScript && (
          after.name != before.name || 
          after.sites != before.sites ||
          after.code != before.code ||
          before.libs.some(oldLib => after.libs.indexOf(oldLib) == -1) ||
          after.libs.some(nowLib => before.libs.indexOf(nowLib) == -1));
      },
  
      // Сохраняет скрипт
      async saveScript({state: {scripts}, commit: setState, dispatch: action}, {before, after}) {
        // Обрезаем начальные и конечные пробелы в названии скрипта и маске сайтов
        after.name = after.name.trim();
        after.sites = after.sites.trim();
  
        // Проверяем уникальность названия скрипта
        let isNotUniqueName = scripts.some(script => script.securityKey != before.securityKey && script.name == after.name);
        if (isNotUniqueName) {
          Popup.alert('Придумайте уникальное название', `Название скрипта "${escapeHTML(after.name)}" уже есть в базе!`);
          return false;
        }
  
        if (before.isNewScript) {
          // Обновляем хранилище скриптов локально
          scripts.push(after);
        } else {
          if (await action('wasChanges', {before, after})) {
            // Обновляем хранилище скриптов локально
            scripts.splice(scripts.findIndex(script => script.securityKey == before.securityKey), 1, after);
          } else {
            if (before.active != after.active) {
              action('toggleScriptActive', before);
            }
            return true;
          }
        }
  
        // Обновляем ключ безопасности скрипта
        await action('updateSK', after);
        // Вызываем мутацию изменения в хранилище скриптов
        setState('scripts', scripts);
        // Обновляем информацию о наблюдаемом скрипте
        action('showScriptInfo', after);
        return true;
      },
  
      // Обновляет ключ безопасности скрпита
      updateSK({state, commit: setState}, script) {
        // Обновляем ключ безопасности скрипта локально
        script.securityKey = state.nextSecurityKey;
        // Вызываем мутацию scripts
        setState('scripts', state.scripts);
        // Вызываем мутацию nextSecurityKey
        setState('nextSecurityKey', state.nextSecurityKey + 1);
      },
  
      // Удаляет скрипт по названию
      removeScript({state: {scripts}, commit: setState}, name) {
        scripts.splice(scripts.findIndex(script => script.name == name), 1);
        setState('scripts', scripts);
      },
  
      // Переключает состояние скрипта (включен/выключен)
      toggleScriptActive({state: {scripts}, commit: setState}, script) {
        script.active = !script.active;
        setState('scripts', scripts);
      }
    }
  };

  // Добавляем глобальные состояния не привязанные к хранилищу расширения
  Object.assign(store.state, {
    // Адрес активной вкладки браузера
    currentUrl: await getCurrentUrl(),
    // Окно с информацие о скрипте
    aboutScriptWindow: null
  });

  // Добавляем мутации не привязанные к хранилищу расширения
  Object.assign(store.mutations, {
    // У активной вкладки сменился URL-адрес
    changedUrl(state, url) {
      state.currentUrl = url;
    },
    // Открывает окно с информацией о скрипте
    initAboutScriptWindow(state) {
      state.aboutScriptWindow = this
        ._vm
        .$mainWindow
        .openChildWindow('AboutScript');
    }
  });

  return store;
}