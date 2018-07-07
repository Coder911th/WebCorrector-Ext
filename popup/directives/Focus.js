/*
  Директива v-focus

  Система фокусов с поддержкой окон.
  Директива вешается на DOM-элемент, который может
  ловить фокус.
  
  При фокусировке на элемент накладывается класс "focus".
  
  Класс накладывается только, если фокусировка была
  произведена с помощью клавиатуры.
  
  Накладываение класса при клике мышкой не происходит,
  однако элемент будет находиться в фокусе. На такой элемент
  можно накладывать стили с помощью псевдокласса :focus.
*/
import Vue from 'vue';
import WindowConfig from 'Base/Window';
let Window = Vue.options.components.Window;

// Фокусировка на DOM-элементе
// addFocusClass - нужно ли добавить класс "focus"
// активному элементу
Node.prototype.vFocus = function(addFocusClass) {
  let window = this.parentWindow;
  if (!window) {
    console.warn('Элемент не содержит директивы v-focus или ' +
                 'не принадлежит никакому окну!\n', this);
  } else {
    window.focusTargetIndex = window.focusClosure.indexOf(this);
    window.activateWindow(focusClass);
  }
};

export default {
  inserted: function(el, binding, vnode) {
    // Для совместимости с нативным фокусом
    el.tabIndex = 0;
    // Поиск ближайщего родительского окна
    let currentElement = el;
    while (currentElement) {
      let window = currentElement.__vue__;
      if (window) {
        if (window.isWindow) {
          el.parentWindow = window;
          // Нашли родительское окно
          let index = window.focusClosure.push(el) - 1;
          if (!window.focusTarget) {
            window.focusTargetIndex = index;
          }
          break;
        }
      }
      currentElement = currentElement.parentElement;
    }
  }
};