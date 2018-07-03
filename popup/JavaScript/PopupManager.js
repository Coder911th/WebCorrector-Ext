// Хелпер для работы с модальными окнами
import {vCreate} from 'JavaScript/VueHelpers';

export default {

  // Окно с сообщением
  alert(caption, message) {
    vCreate('Popup', {
      type: 'alert',
      caption, message,
      positiveButtonText: lc('Да'),
      negativeButtonText: lc('Нет')
    });
  },

  // Окно с подтверждением
  confirm(caption, message) {
    return new Promise(resolve => {
      vCreate('Popup', {
        type: 'confirm',
        caption, message,
        onPositive: () => resolve(true),
        onNegative: () => resolve(false),
        positiveButtonText: lc('Да'),
        negativeButtonText: lc('Нет')
      });
    });
  }
};