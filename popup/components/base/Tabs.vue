<!-- Контейнер с вкладками, переключающий содержимое при выборе вклаки -->

<template>
  <div
      v-focus
      class="tabs"
      @keyup.left="prevTab"
      @keyup.right="nextTab">
    <div class="tabs__menu">
      <div
          class="tabs__button"
          :class="{ 'tabs__button_current': index == selectedIndex }"
          v-for="(tab, index) of items" 
          :key="tab.caption"
          @click="$emit('change', index)">
        {{ tab.caption }}
      </div>
    </div>
    <keep-alive>
      <component
          class="tabs__content"
          :is="items[selectedIndex].component"
          :key="items[selectedIndex].key"/>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'Tabs',
  model: {
    prop: 'selectedIndex',
    event: 'change'
  },
  props: {
    selectedIndex: {
      type: Number,
      required: true
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
  methods: {
    nextTab() {
      this.$emit('change', (this.selectedIndex + 1) % this.items.length);
    },
    prevTab() {
      this.$emit('change',
        this.selectedIndex - 1 < 0
          ? this.items.length - 1
          : this.selectedIndex - 1);
    }
  }
}
</script>

<style lang="scss">
$bd: #ccc;

.tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  outline: none;

  &[focus] .tabs__button_current {
    text-shadow: 1px 0 0 #000;
  }
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
