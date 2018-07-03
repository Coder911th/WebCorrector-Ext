// Дикетива "Подсказка"
import {vCreate} from 'JavaScript/VueHelpers';

let
  // Массив элементов, у которых может быть всплывающая подсказка
  observed = [],
  // Координаты мыши
  mouseX = 0,
  mouseY = 0;

document.addEventListener('mouseenter', ev => {
  /*
    Получаем элемент, над которым сейчас находится указатель мыши,
    если этот элемент в списке наблдаемых элементов, иначе undefined
  */
  let el = observed[observed.indexOf(ev.target)];
  if (el && el.tooltipDelayTimer == null && el.linkedTooltip == null && el.tooltipText) {
    el.tooltipDelayTimer = setTimeout(function() {
      // Выводим подсказку
      el.linkedTooltip = vCreate('Tooltip', {
        text: el.tooltipText,
        initX: mouseX,
        initY: mouseY
      });
      el.tooltipDelayTimer = null;
    } , 1000);
  }
}, true);

document.addEventListener('mouseleave', ev => {
  // Мышь ушла за пределы элемента
  let el = ev.target;
  if (el.tooltipDelayTimer != null) {
    // Если был запущен таймер для показа подсказки, отменяем его
    clearTimeout(el.tooltipDelayTimer);
    el.tooltipDelayTimer = null;
  } else if (el.linkedTooltip != null) {
    // Если была показана подсказка, скрываем её
    el.linkedTooltip.cancel();
    el.linkedTooltip = null;
  }
}, true);

// Отслеживаем координаты мыши
document.addEventListener('mousemove', ev => {
  mouseX = ev.pageX;
  mouseY = ev.pageY;
});

export default function(el, {value: text}) {
  if (!el.tooltipText) {
    /*
      Если за элементом ещё не ведётся наблюдение, 
      заносим его в список наблюдаемых элементов
    */
    observed.push(el);
    el.tooltipDelayTimer = null;
    el.linkedTooltip = null;
  }
  // Реактивно обновляем значение текста подсказки
  el.tooltipText = text;
};