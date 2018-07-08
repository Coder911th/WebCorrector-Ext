// Хелпер для работы с модальными окнами
import Vue from 'vue';
import {vCreate} from 'JavaScript/VueHelpers';

export default {
  // Окно с сообщением
  alert(caption, message) {
    Vue.prototype.$mainWindow.openChildWindow('Popup', {
      type: 'alert',
      caption, message,
      positiveButtonText: lc('Да'),
      negativeButtonText: lc('Нет')
    }, true);
  },

  // Окно с подтверждением
  confirm(caption, message) {
    return new Promise(resolve => {
      Vue.prototype.$mainWindow.openChildWindow('Popup', {
        type: 'confirm',
        caption, message,
        onPositive: () => resolve(true),
        onNegative: () => resolve(false),
        positiveButtonText: lc('Да'),
        negativeButtonText: lc('Нет')
      });
    }, true);
  }
};