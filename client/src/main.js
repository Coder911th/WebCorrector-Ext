import 'babel-polyfill';
import 'JavaScript/ChromeStorageEmulator.js';
import Vue from 'vue';
import App from './App.vue';
import {addSetStateMixin, addActionMixin} from 'JavaScript/VuexHelpers';
import Localization from 'JavaScript/Localization';
import Store from 'Store/index.js';

// Объявляем глобально базовые компоненты приложения
let requireComponent = require.context('./components/base', true, /\.vue$/);
requireComponent.keys().forEach(fileName => {
  let baseComponentConfig = requireComponent(fileName).default;
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
requireDirective.keys().forEach(fileName =>{
  let directiveName = fileName
    .replace(/^.+\//, '')
    .replace(/\.\w+$/, '');
  Vue.directive(directiveName, requireDirective(fileName).default);
});

// Добавляем метод для смены состояний Vuex-хранилища во все компоненты
addSetStateMixin();

// Добавляем псевдоним метода вызова действия Vuex-хранилища во все компоненты
addActionMixin();

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