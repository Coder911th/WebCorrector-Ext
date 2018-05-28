// Хелпер для работы с модальными окнами
import Vue from 'vue';

export default {

  // Окно с сообщением
  alert(caption, message) {
    new Vue.options.components.Popup({
      propsData: {
        type: 'alert',
        caption, message,
        positiveButtonText: lc('Да'),
        negativeButtonText: lc('Нет')
      }
    }).mountToDocument();
  },

  // Окно с подтверждением
  confirm(caption, message) {
    return new Promise(resolve => {
      new Vue.options.components.Popup({
        propsData: {
          type: 'confirm',
          caption, message,
          onPositive: () => resolve(true),
          onNegative: () => resolve(false),
          positiveButtonText: lc('Да'),
          negativeButtonText: lc('Нет')
        }
      }).mountToDocument();
    });
  }
};