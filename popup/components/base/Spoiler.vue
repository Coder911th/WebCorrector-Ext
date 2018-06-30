<!-- Спойлер скрывающий и показывающий вложенную информацию по клику -->
<template>
  <div :class="['spoiler', {'spoiler_collapsed': !isOpen}]">
    <div
        class="spoiler__caption"
        @click="toggle">{{ caption }}</div>
    <transition name="slide">
      <div class="spoiler__content" v-if="isOpen">
        <slot/>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'Spoiler',
  props: {
    // Изначально спойлер открыт?
    initOpen: {
      type: Boolean,
      default: false
    },
    // Заголовок спойлера
    caption: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isOpen: this.initOpen
    };
  },
  // Методы для усправление элементом из вне
  methods: {
    toggle() {
      this.$emit('toggle');
      this.isOpen = !this.isOpen;
    }
  }
}
</script>

<style lang="scss">
.spoiler {
  border: 1px solid rgb(196, 196, 196);
  overflow: hidden;
}

// Открытый спойлер
.spoiler_collapsed {
  .spoiler__caption::before {
    transform: rotate(-90deg);
    text-shadow: none;
  }
}

// Заголовок спойлера
.spoiler__caption {
  padding: 5px;
  font-weight: bold;
  color: #556;
  background: rgb(233, 231, 231);
  user-select: none;
  cursor: pointer;

  &:hover {
    background: #e3e2e2;
  }

  &::before {
    display: inline-block;
    content: "▼";
    transition: .3s;
    margin-right: 7px;
  }
}

// Контейнер с содержимым спойлера
.spoiler__content {
  background: rgb(247, 247, 247);
  border-top: 1px solid rgb(196, 196, 196);
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
