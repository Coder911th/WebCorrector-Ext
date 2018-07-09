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

// Метод для перебора NodeList
let each = Array.prototype.forEach;

// Поиск ближайшего родительского окна элемента
function findWindow(node, callback) {
  let currentElement = node;
  while (currentElement) {
    let vue = currentElement.__vue__;
    if (vue) {
      do {
        if (vue.isWindow) {
          node.parentWindow = vue;
          callback(vue);
          return;
        }
      } while (vue = vue.$parent);
      return;
    }
    currentElement = currentElement.parentElement;
  }
}

// Возвращает итератор по всем узлам, на которых можно фокусироваться,
// в поддереве root
function getIterator(root, condition) {
  return document.createNodeIterator(
    root,
    NodeFilter.SHOW_ELEMENT,
    node =>
      condition(node)
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_SKIP
  );
}

// Налюдаем за добавлением/удалением фокусируемых элементов
new MutationObserver(function(mutations) {
  let windows = new Map();
  
  mutations.forEach(mutation => {
    // Смотрим добавленные узлы
    each.call(mutation.addedNodes, node => {
      // Перебираем поддерево добавленного элемента
      let iterator = getIterator(node,
        node => node.canBeFocused === true);

      while (node = iterator.nextNode()) {
        findWindow(node, window => {
          if (!windows.has(window)) {
            windows.set(window, {
              add: [node],
              remove: []
            });
          } else {
            windows.get(window).add.push(node);
          }
        });
      }
    });

    // Смотрим удаленные узлы
    each.call(mutation.removedNodes, node => {
      // Перебираем поддерево удаленного элемента
      let iterator = getIterator(node, node =>
        node.canBeFocused === true && node.parentWindow);

      while (node = iterator.nextNode()) {
        if (!windows.has(node.parentWindow)) {
          windows.set(node.parentWindow, {
            add: [],
            remove: [node]
          });
        } else {
          windows.get(node.parentWindow).remove.push(node);
        }
      }
    });
  });

  // Упорядочиваем список фокусируемых элементов изменённых окон
  windows.forEach((changes, window) => {
    let selected = window.focusClosure[window.focusTargetIndex];

    // Чистим удаленные узлы
    window.focusClosure = window.focusClosure
      .filter(item => changes.remove.indexOf(item) === -1);
    
      // Добавляем новые узлы
    window.focusClosure = window.focusClosure.concat(changes.add);
    
    // Сортируем узлы в порядке их расположения в DOM
    window.focusClosure.sort((a, b) => {
      return a.compareDocumentPosition(b) & 0b10 ? 1 : -1;
    });
    
    // Обновляем индекс активного элемента
    if (selected) {
      let newIndex = window.focusClosure.indexOf(selected);
      if (newIndex > -1) {
        window.focusTargetIndex = newIndex;
        return;
      } 
    }
    window.focusTargetIndex = -1;
  });
}).observe(document.body, {
  childList: true,
  subtree: true
});

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
  bind(el, binding, vnode) {
    // Для совместимости с нативным фокусом
    el.tabIndex = 0;

    // Устанавливаем метку фокусируемого элемента
    el.canBeFocused = true;
  }
};