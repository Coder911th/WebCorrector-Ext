/* Вспомогательные функции для работы с Vue */
import Vue from 'vue';

// Создание компонета из кода и сразу монтирование его в <body>
export function vCreate(name, props) {
  let component = new Vue.options.components[name]({
    propsData: props
  });
  component.$mount();
  document.body.appendChild(component.$el);
  return component;
};