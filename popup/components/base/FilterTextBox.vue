<!-- Текстовое поле с выезжающим меню с фильтров -->
<template>
  <div class="filter-text-box">
    <div class="filter-text-box__text-line">
      <TextBox
          class="filter-text-box__search-line"
          :style="{padding: '5px'}"
          :hasBorder="true"
          :placeholder="placeholder"
          :value="value"
          @input="$emit('input', $event)"/>
      <div
          v-focus
          :class="[
            'filter-text-box__button',
            'icon-filter',
            {'filter-text-box__button_open': isOpen}
          ]"
          @click="isOpen = !isOpen"
          @keyup.enter.space="isOpen = !isOpen"/>
    </div>
    <transition
        name="slide"
        @after-leave="onToggleFilterPanel"
        @after-enter="onToggleFilterPanel">
      <div
          class="filter-text-box__panel"
          v-show="isOpen">
        <slot/>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'FilterTextBox',
  props: {
    // Значение поля поиска
    value: {
      type: String,
      default: ''
    },
    // Подсказа в поле поиска, пока в нём нет текста
    placeholder: {
      type: String,
      default: ''
    },
    // Обработчик открытия/закрытия панели фильтров
    onToggleFilterPanel: {
      type: Function,
      default: function() {}
    }
  },
  data() {
    return {
      isOpen: false
    };
  }
}
</script>

<style lang="scss">

// Поисковая строка фильтра
.filter-text-box__text-line {
  display: flex;
}

// Строка поиска
.filter-text-box__search-line {
  border-right: none !important;
}

// Кнопка фильтра
.filter-text-box__button {
  display: flex;
  align-items: center;
  justify-content: center;
  
  width: 25px;
  padding: 3px;
  
  outline: none;
  border: 1px solid #ccc;

  color: #555;
  user-select: none;

  &[focus] {
    box-shadow: inset 0 0 3px rgba(#000, .25);
    color: #000;
  }
  
  // Состояние кнопки, если панель открыта
  &_open {
    background-color: #f0f0f0;
  }
}

// Панель фильтров
.filter-text-box__panel {
  border: 1px solid #ccc;
  border-top: none;
}

// Сворачивание/разворачивание панели
.slide-enter-active {
  transition: .16s ease-in;
  overflow: hidden;
}

.slide-leave-active {
  transition: .16s ease-out;
  overflow: hidden;
}

.slide-enter,
.slide-leave-to {
  max-height: 0;
}

.slide-enter-to,
.slide-leave {
  max-height: 100vh;
}
</style>