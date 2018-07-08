<!-- Контекстное меню -->
<template>
  <transition
      appear
      name="fade">
    <div
        v-focus
        ref="menu"
        class="context-menu"
        :style="{
          top: `${computedY}px`,
          left: `${computedX}px`
        }"
        @keyup.down="nextItem"
        @keyup.up="prevItem"
        @keyup.esc="destroyAllContextMenus"
        @keyup.enter.space="items[focusIndex].onClick(); destroyAllContextMenus()">
      <div
          :class="['context-menu__item', {
            'context-menu__focus': index == focusIndex
          }]"
          v-for="(item, index) of items"
          :key="index"
          @click="item.onClick()"
          @mousemove="focusIndex = index">
        {{ item.text }}
      </div>
    </div>
  </transition>
</template>

<script>
import Window from 'Base/Window';

function destroyAllContextMenus() {
  Array.prototype.forEach.call(document.getElementsByClassName('context-menu'), menu => {
    let vm = menu.__vue__;
    
    if (!vm)
      return;

    vm = vm.$parent;
    if (!vm)
      return;

    if (Date.now() - vm.createdDate > 300) {
      menu.parentNode.removeChild(menu);
      vm.$destroy();
    }
  });
}

document.addEventListener('click', destroyAllContextMenus);
document.addEventListener('contextmenu', destroyAllContextMenus);
document.addEventListener('wheel', destroyAllContextMenus);

export default {
  name: 'ContextMenu',
  extends: Window,
  props: {  
    // Массив объектов со свойствами:
    // > text - текстовое описание элемента списка
    // > onClick - функция-обработчик клика по элементу списка
    items: {
      type: Array,
      required: true
    },

    // Координата отновительно окна просмотра, в которой должно появиться меню
    x: {
      type: Number,
      required: true
    },

    // Координата отновительно окна просмотра, в которой должно появиться меню
    y: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      createdDate: Date.now(),
      width: 0,
      height: 0,
      focusIndex: null
    };
  },
  computed: {
    computedX() {
      if (!this.width) {
        return 0;
      }

      return this.x + this.width > document.body.clientWidth
        ? this.x - this.width
        : this.x;
    },

    computedY() {
      if (!this.height) {
        return 0;
      }

      return this.y + this.height > document.body.clientHeight
        ? this.y - this.height
        : this.y;
    }
  },
  methods: {
    hasFocus() {
      return this.$refs.menu == document.activeElement;
    },
    nextItem() {
      if (this.hasFocus()) {
        this.focusIndex = (this.focusIndex + 1) % this.items.length;
      }
    },
    prevItem() {
      if (this.hasFocus()) {
        this.focusIndex = (this.focusIndex + 1) % this.items.length;
      }
    },
    destroyAllContextMenus: destroyAllContextMenus
  },
  mounted() {
    let self = this;
    setTimeout(function findSizes() {
      if (!self.$el) {
        setTimeout(findSizes, 4);
      } else {
        let sizes = self.$el.getBoundingClientRect();
        self.width = sizes.width;
        self.height = sizes.height;
      }
    }, 4);
  }
}
</script>

<style lang="scss">
.context-menu {
  box-sizing: border-box;
  position: fixed;
  padding: 0;
  border: 1px solid #ccc;
  background: #fff;
  box-shadow: 1px 1px 1px rgba(0, 0, 0, .25);
  outline: none;
  user-select: none;
}

.context-menu__item {
  transition: .3s;
  padding: 3px 10px;
  
  &:last-child {
    border-bottom: none;
  }
}

.context-menu__focus {
  background: #eee;
  cursor: pointer;
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
