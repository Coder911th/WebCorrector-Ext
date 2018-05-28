<!-- Контейнер с вкладками, переключающий содержимое при выборе вклаки -->

<template>
  <div class="tabs">
    <div class="tabs__menu">
      <div
        class="tabs__button"
        :class="{ 'tabs__button_current': index == currentIndex }"
        v-for="(tab, index) of items" 
        :key="tab.caption"
        @click="currentIndex = index; $emit('onTabChanged', index)"
      >
        {{tab.caption}}
      </div>
    </div>
    <keep-alive>
      <component
        class="tabs__content"
        :is="items[currentIndex].component"
        :key="items[currentIndex].key"
      />
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'Tabs',
  props: {
    initialIndex: {
      type: Number,
      default: 0
    },
    items: {
      type: Array,
      required: true,

      // tab.component должен быть vue-компонентом
      validator(value) {
        return value.every(tab => 
          tab.caption != undefined && typeof tab.caption == 'string' &&
          tab.component != undefined && tab.key != undefined
        );
      }
    }
  },
  data() {
    return {
      currentIndex: this.initialIndex
    };
  }
}
</script>

<style lang="scss">
$bd: #ccc;

.tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Меню с названием вкладок */
.tabs__menu {
  display: flex;
}

/* Кнопка отдельной вкладки */
.tabs__button {
  transition: background-color .3s;
  flex: 1 1 auto;
  padding-top: 5px;
  border-bottom: 1px solid $bd;
  border-right: 1px solid $bd;
  text-align: center;
  line-height: 2;
  user-select: none;
  background: rgba(0, 0, 0, .05);

  &:last-child {
    border-right: none;
  }
  
  &:hover:not(&_current) {
    background: rgba(0, 0, 0, .1);
  }

  /* Текущая вкладка */
  &_current {
    border-bottom: none;
    background: transparent;
  }
}

/* Контейнер с содержимым вкладки */
.tabs__content{
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
</style>
