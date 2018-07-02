/* Вспомогательные функции для работы с Vue */
import Vue from 'vue';

// Создание компонета из кода
export function vCreate(name, props) {
  return new Vue.options.components[name]({
    propsData: props
  });
};