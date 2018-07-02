/**** Хелперы для работы с Vuex-хранилищем ****/

import {get, set} from 'JavaScript/BrowserExtensionHelpers';

// Добавляет глобально всем компонентам метод для установки состояний
// глобального хранилища через мутации
export function setState(name, value) {
  if (this) {
    // Метод вызывается в контексте компонента
    this.$store.commit(name, value);
  } else {
    // Метод вызывается из вёрстки
    $store.commit(name, value);
  }
};

export function action(name, payload) {
  if (this) {
    // Метод вызывается в контексте компонента
    return this.$store.dispatch(name, payload);
  } else {
    // Метод вызывается из вёрстки
    return $store.dispatch(name, payload);
  }
}

// Задаёт двустороннее связывание свойства компонента с хранилищем
// Принимает массив с названиями состояний Vuex-хранилища.
// В результат в компоненте будут созданы вычислимые свойства с названиями
// совпадающими с названиями соответствующих состояний Vuex-хранилища.
export function vModel(names) {
  let mixin = {};
  names.forEach(name =>
    mixin[name] = {
      get() {
        return this.$store.state[name];
      },
      set(value) {
        this.$store.commit(name, value);
      }
    }
  );
  return mixin;
};

// Объявляет в Vuex-хранилище состояния, переданные в качестве аргумента.
// Значения состояний инициализируются из хранилища расширения и при
// мутациях состояния автоматически записываются туда же.
export async function vuexStates(names) {
  let mixin = {
    state: {},
    mutations: {}
  };

  let queries = [];
  
  names.forEach(name => {
    queries.push(get(name).then(value => mixin.state[name] = value));
    mixin.mutations[name] = (state, value) => {
      // Изменяем состояние
      state[name] = value;
      // Записываем данные в хранилище расширения
      set(name, value);
    }
  });

  // Ожидаем загрузки всех данных из хранилища
  await Promise.all(queries);
  return mixin;
};