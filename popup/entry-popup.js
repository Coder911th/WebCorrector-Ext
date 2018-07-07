import 'babel-polyfill';
import 'JavaScript/ChromeStorageEmulator';
import Vue from 'vue';
import App from './App.vue';
import {setState, action} from 'JavaScript/VuexHelpers';
import {vCreate} from 'JavaScript/VueHelpers';
import Localization from 'JavaScript/Localization';
import Store from 'Store/Store';

// Объявляем глобально базовые компоненты приложения
let requireComponent = require.context('./components/base', true, /\.vue$/);
requireComponent.keys().forEach(fileName => {
  let baseComponentConfig = requireComponent(fileName).default;
  if (baseComponentConfig.name)
    Vue.component(baseComponentConfig.name, baseComponentConfig);
});

// Объявляем глобально фильтры приложения
let requireFilter = require.context('./filters');
requireFilter.keys().forEach(fileName => {
  let baseFilterConfig = requireFilter(fileName).default;
  Vue.filter(baseFilterConfig.name, baseFilterConfig.handler);
});

// Подключаем все пользовательские директивы из directives
let requireDirective = require.context('./directives');
requireDirective.keys().forEach(fileName => {
  let directiveName = fileName
    .replace(/^.+\//, '')
    .replace(/\.\w+$/, '');
  Vue.directive(directiveName, requireDirective(fileName).default);
});

// Расширяем прототип Vue
Object.assign(Vue.prototype, {
  vCreate,  // Создание компонентов из кода
  setState, // Изменение состояния Vuex хранилища
  action    // Выполнение действий Vuex хранилищ
});

(async function() {
  // Инициализируем глобальное хранилище состояний приложения
  let store = await Store;

  // Обрабатываем сообщения от фоновой страницы браузера
  chrome.runtime.onMessage.addListener(function(message) {
    switch (message.type) {
      case 'changedURL':
        // Сообщние о изменении URL-адреса активной вкладки
        store.commit('changedURL', message.data);
        break;
    }
  });

  // Инициализируем модуль локализации
  Localization(store.state);

  // Создаём корневой экземляр приложения
  new Vue({
    el: '#app',
    render: h => h(App),
    store
  });
})();

// Блокируем вызов контекстного меню
if (process.env.NODE_ENV != 'development') {
  document.addEventListener('contextmenu', ev => ev.preventDefault());
}