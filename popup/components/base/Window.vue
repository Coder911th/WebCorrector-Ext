<!--
  Абстрактное окно.
-->
<script>
import Vue from 'vue';
import {vCreate} from 'JavaScript/VueHelpers';
import Window from 'Base/Window';

// Активное окно
let activeWindow = null;
Object.defineProperty(Vue.prototype, '$activeWindow', {
  get() {
    return activeWindow;
  }
});

// Перехват Tab
document.addEventListener('keydown', ev => {
  if (!activeWindow)
    return;
  if (ev.keyCode == 9) { /* Tab */
    ev.preventDefault();
    if (activeWindow.focusTarget)
      activeWindow.focusTarget.removeAttribute('focus');
    if (ev.shiftKey) {
      // Переводим фокус назад
      activeWindow.focusTargetIndex = 
        activeWindow.focusTargetIndex - 1 < 0
          ? activeWindow.focusClosure.length - 1
          : activeWindow.focusTargetIndex - 1;
    } else {
      // Переводим фокус вперёд
      activeWindow.focusTargetIndex = 
        (activeWindow.focusTargetIndex + 1) 
          % activeWindow.focusClosure.length;
    }
    activeWindow.focusTarget.setAttribute('focus', '');
    activeWindow.focusTarget.focus();
  }
});

// Активация элемента при клике
document.addEventListener('mousedown', ev => {
  let target = ev.target;
  
  while (target && target.tabIndex < 0)
    target = target.parentElement;
  
  let oldFocusTarget = activeWindow.focusTarget;

  if (target && target.parentWindow) {
    let window = target.parentWindow;
    window.focusTargetIndex = window.focusClosure.indexOf(target);
    window.activateWindow();
  }
  
  if (oldFocusTarget)
    oldFocusTarget.removeAttribute('focus');
});

export default {
  props: {
    opener: {
      type: Window,
      default: null
    }
  },
  data() {
    return {
      // Индекс активного элемента окна в focusClosure
      focusTargetIndex: -1,
      // Замыкание из фокусируемых элементов окна
      focusClosure: [],
      // Метка окна
      isWindow: true
    };
  },
  computed: {
    // Активный DOM-элемент
    focusTarget() {
      return this.focusClosure[this.focusTargetIndex];
    }
  },
  methods: {
    // Является ли текущее окно активным
    isActiveWindow() {
      return activeWindow == this;
    },

    // Делет текущее окно активным
    activateWindow(addFocusClass) {
      if (activeWindow.focusTarget) {
        activeWindow.focusTarget.removeAttribute('focus');
      }
      if (!this.isActiveWindow()) {
        activeWindow.$el.removeAttribute('active-window');
        activeWindow = this;
        this.$el.setAttribute('active-window', '');
      }
      if (this.focusTarget) {
        addFocusClass && this.focusTarget.setAttribute('focus', '');
        this.focusTarget.focus();
      }
    },

    // Открывает дочернее окно
    openChildWindow(name, props, addFocusClass) {
      if (Vue.options.components[name].options.data().isWindow !== true)
        return console.warn(`Попытка открыть дочернее окно "${name}", ` +
          'которое не является экземпляром класса Window!');
      
      let window = vCreate(name, Object.assign(props, {
        opener: this
      }));

      window.$nextTick(() => window.activateWindow(addFocusClass));
    }
  },
  mounted() {
    if (!activeWindow) {
      activeWindow = this;
      activeWindow.activateWindow();
    }
  },
  destroyed() {
    if (this.opener) {
      this.opener.activateWindow();
    }
  }
}
</script>
