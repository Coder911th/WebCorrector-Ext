<!-- Всплывающая подсказка -->

<template>
  <transition
    appear
    name="fade"
  >
    <div
      v-show="isVisible"
      class="tooltip"
      :style="{
        borderColor: borderColor,
        left: `${left}px`,
        top: `${top}px`
      }"
    >
      <div v-html="text"/>
      <div
        class="tooltip__arrow"
        :style="arrowStyle"
      />
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Tooltip',
  props: {
    // Текст подсказки
    text: {
      type: String,
      required: true
    },
    // Расположить подсказку над DOM-элементом
    element: {
      type: Element,
      default: null
    },
    // Инициализирующее поле
    // x-координата точки, над которой должна появиться подсказка
    initX: {
      type: Number,
      default: 0
    },
    // Инициализирующее поле
    // y-координата точки, над которой должна появиться подсказка
    initY: {
      type: Number,
      default: 0
    },
    // Инициализирующее поле
    // Высота элемента, над которым выводится подсказка
    initElHeight: {
      type: Number,
      default: 0
    },
    // Цвет рамки окна подсказки
    borderColor: {
      type: String,
      default: '#ccc'
    },
    // Автоматически скрывает подсказку через X мс.
    hideAfter: {
      type: Number,
      default: NaN
    },
    // Обработчик закрытия подсказки
    onCancel: {
      type: Function,
      default: function() {}
    }
  },
  data() {
    return {

      // Инициализируем положение подсказки переданными данными
      x: this.initX,
      y: this.initY,
      elHeight: this.initElHeight,

      // Ширина подсказки
      width: NaN,

      // Высота подсказки
      height: NaN,

      // Специальные стили стрелки
      arrowStyle: {},

      // Флаг видимости элемента
      isVisible: true,

      // Время вставки в DOM
      mountedTime: Date.now()
    };
  },
  computed: {
    borderValue() {
      return `1px solid ${this.borderColor}`;
    },
    left() {
      if (isNaN(this.width))
        return 0;
      let pre = this.x - this.width /2;
      let docWidth = document.documentElement.clientWidth;
      return pre < 0
        ? 10
        : docWidth - (pre + this.width) < 0
          ? pre + docWidth - (pre + this.width) - 10
          : pre;
    },
    top() {
      if (isNaN(this.height))
        return 0;
      let pre = this.y - this.height - 10;
      if (pre < 0) {

        // Стрелка сверху
        this.arrowStyle = {
          borderRight: 'none',
          borderBottom: 'none',
          borderLeft: this.borderValue,
          borderTop: this.borderValue,
          bottom: `calc(100% - 5px)`,
          left: `${Math.max(5, Math.min(this.width - 20, this.x - this.left - 6))}px`
        };

        return this.y + this.elHeight + 10;
      } else {

        // Стрелка снизу
        this.arrowStyle = {
          borderColor: this.borderColor,
          left: `${Math.max(5, Math.min(this.width - 20, this.x - this.left - 6))}px`
        };
      }
      return pre;
    }
  },
  methods: {

    // Монтирует элемент в документ
    mountToDocument() {

      // Монтируем элемент вне документа
      this.$mount();

      // Добавляем элемент на страницу
      document.body.appendChild(this.$el);
    },

    // Плавно закрываем подсказку
    cancel() {
      if (this.isVisible) {
        this.isVisible = false;
        setTimeout(() => {
          this.onCancel();
          this.$el.parentNode && this.$el.parentNode.removeChild(this.$el);
        }, 500);
      }
    }
  },
  created() {
    /*
      Если компонент передан конкретный DOM-элемент, то
      переданные параметры x, y, elHeight игнорируются и
      расположение подсказки рассчитывается относительно
      переданного элемента.
    */
    let el = this.element;
    if (el) {
      let sizes = el.getBoundingClientRect();
      this.x = sizes.x + sizes.width / 2;
      this.y = sizes.y;
      this.elHeight = sizes.height;
    }
  },
  mounted() {

    // Вычисляем ширину подсказки
    this.$nextTick(() => {
      ({ width: this.width, height: this.height } = this.$el.getBoundingClientRect());
    });

    // Если указана опция hideAfter, скрываем подсказку автоматически
    if (!Number.isNaN(this.hideAfter)) {
      setTimeout(() => this.cancel(), this.hideAfter);
    }

    this.mountedTime = Date.now();
  }
}

function hideAllTooltips() {
  Array.prototype.forEach.call(
    document.getElementsByClassName('tooltip'), tooltip => {
      tooltip = tooltip.__vue__;
      if (!tooltip) return;

      tooltip = tooltip.$parent;
      if (!tooltip) return;
      
      if (Date.now() - tooltip.mountedTime > 100)
        tooltip.cancel();
    }
  );
}

/*
  Автоскрытие подсказов при клике или прокрутке страницы, если при создании
  не указано явно, что они должны закрываться по крестику
*/
document.addEventListener('click', hideAllTooltips);
document.addEventListener('wheel', hideAllTooltips);
</script>

<style lang="scss">
.tooltip {
  position: absolute;
  left: 0;
  top: 0;

  padding: 5px;
  box-sizing: border-box;
  min-width: 50px;
  max-width: 300px;

  box-shadow: 1px 1px 5px rgba(0, 0, 0, .5);
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fefefe;

  word-wrap: break-word;
  text-align: center;
  user-select: none;
  z-index: 100000;
}

// Стрелка снизу/сверху тултипа
.tooltip__arrow {
  transform: rotate(45deg);

  position: absolute;
  left: calc(50% - 5px);
  bottom: -6px;

  width: 10px;
  height: 10px;

  border-right: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  background-color: #fefefe;
}

// Анимация появления/исчезновения
.fade-enter-active,
.fade-leave-active {
  transition: opacity .5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.fade-leave,
.fade-enter-to {
  opacity: 1;
}
</style>
