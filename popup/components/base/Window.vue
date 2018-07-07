<!--
  Абстрактное окно.
-->
<script>
// Активное окно
let activeWindow = null;

// Перехват Tab
document.addEventListener('keydown', ev => {
  if (!activeWindow)
    return;
  if (ev.keyCode == 9) { /* Tab */
    ev.preventDefault();
    if (ev.shiftKey) {
      // Переводим фокус назад
      activeWindow.focusTargetIndex = 
        (activeWindow.focusTargetIndex - 1) 
          % activeWindow.focusClosure.length;
    } else {
      // Переводим фокус вперёд
      activeWindow.focusTargetIndex = 
        (activeWindow.focusTargetIndex + 1) 
          % activeWindow.focusClosure.length;
    }
    activeWindow.activateWindow(true);
  }
});

// Активация элемента при клике
document.addEventListener('mousedown', ev => {
  let target = ev.target;
  while (target && target.tabIndex < 0)
    target = target.parentElement;
  if (target && target.parentWindow) {
    let window = target.parentWindow;
    window.focusTargetIndex = window.focusClosure.indexOf(target);
    window.activateWindow();
  }
});

export default {
  data() {
    return {
      // Индекс активного элемента окна в focusClosure
      focusTargetIndex: null,
      // Замыкание из фокусируемых элементов окна
      focusClosure: []
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
        activeWindow.focusTarget.classList.remove('focus');
      }
      if (!this.isActiveWindow()) {
        activeWindow.classList.remove('window_active');
        activeWindow = this;
        this.classList.add('window_active');
      }
      if (this.focusTarget) {
        addFocusClass && this.focusTarget.classList.add('focus');
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
