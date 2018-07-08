<!--
  Абстрактное окно.
-->
<script>
// Активное окно
let activeWindow = null;

// Перехват Tab
document.addEventListener('keydown', ev => {
  if (!activeWindow || !activeWindow.focusTarget)
    return;
  if (ev.keyCode == 9) { /* Tab */
    ev.preventDefault();
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
  if (target && target.parentWindow) {
    let window = target.parentWindow;
    if (activeWindow.focusTarget)
      activeWindow.focusTarget.removeAttribute('focus');
    window.focusTargetIndex = window.focusClosure.indexOf(target);
    window.activateWindow();
  }
});

export default {
  data() {
    return {
      // Индекс активного элемента окна в focusClosure
      focusTargetIndex: 0,
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
        activeWindow.removeAttribute('active-window');
        activeWindow = this;
        this.setAttribute('active-window');
      }
      if (this.focusTarget) {
        addFocusClass && this.focusTarget.setAttribute('focus');
        this.focusTarget.focus();
      }
    }
  },
  mounted() {
    if (!activeWindow) {
      activeWindow = this;
      activeWindow.activateWindow();
    }
  }
}
</script>
