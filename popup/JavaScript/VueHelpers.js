/* Вспомогательные функции для работы с Vue */
import Vue from 'vue';

function connectComponent(name) {
  if (!Vue.options.components[name]) {
    let config = require('@/' + name).default;
    Vue.component(name, config);
  }
}

// Возвращает конфиг Vue-компонента по имени
export function getComponent(name) {
  connectComponent(name);
  return Vue.options.components[name];
}

// Создание компонета из кода и сразу монтирование его в <body>
export function vCreate(name, props) {
  connectComponent  (name);
  let component = new (getComponent(name))({
    propsData: props
  });
  component.$mount();
  document.body.appendChild(component.$el);
  return component;
};