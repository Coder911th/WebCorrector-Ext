<!-- Текстовое поле с выезжающим меню с фильтров -->
<template>
  <div class="filter-text-box">
    <div class="filter-text-box__text-line">
      <TextBox
        :placeholder="placeholder"
        :value="value"
        @input="$emit('input', $event)"
      />
      <div
        :class="['filter-text-box__button', { 'filter-text-box__button_open': isOpen }]"
        @click="isOpen = !isOpen"
      />
    </div>
    <transition
      name="slide"
      @after-leave="onToggleFilterPanel"
      @after-enter="onToggleFilterPanel"
    >
      <div
        class="filter-text-box__panel"
        v-show="isOpen"
      >
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

// Кнопка фильтра
.filter-text-box__button {
  display: flex;
  align-items: center;
  width: 25px;
  padding: 3px;
  border: 1px solid #ccc;
  border-left: 0;
  user-select: none;
  background: url(./filter.svg) no-repeat center center content-box border-box white;
  
  // Состояние кнопки, если панель открыта
  &_open {
    background-color: rgba(0, 0, 0, .05);
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