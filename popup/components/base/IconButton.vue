<!--
  Кнопка-картика с использованием иконочного шрифта
-->

<template>
  <div
      v-focus
      class="icon-button"
      @click.capture="click"
      @mouseover="isHover = true"
      @mouseout="isHover = false"
      @keydown.enter.space="isActive = true"
      @keyup.enter.space="click"
      @blur="isActive = false">
    <div
        :class="[
          'icon-button__icon',
          icon,
          {
            'icon-button__icon_hover': isHover,
            'icon-button__icon_active': isActive
          }
        ]"
        :style="{
          fontSize: size,
          color: color
        }"/>
  </div>
</template>

<script>
export default {
  name: "IconButton",
  props: {
    // CSS-класс иконки
    icon: {
      type: String,
      required: true
    },
    
    // CSS-цвет шрфита
    color: {
      type: String,
      default: 'black'
    },

    //CSS-размер шрифта
    size: {
      type: String,
      default: '1em'
    }
  },
  data() {
    return {
      isHover: false,
      isActive: false
    }
  },
  methods: {
    // Анимирует нажатие на кнопку
    press() {
      // this.scaleStyle = {transform: 'scale(.8)'};
      // setTimeout(() => this.scaleStyle = {}, 100);
    },
    click() {
      this.isActive = false;
      this.$emit('click', {target: this.$el});
    }
  }
}
</script>

<style lang="scss">
.icon-button {
  display: inline-block;
  outline: none;
  user-select: none;
  cursor: pointer;
  line-height: 1;
}

.icon-button__icon {
  transform: scale(.85);
  &::before {
    margin: 0 !important;
  }
}

.icon-button[focus] .icon-button__icon,
.icon-button__icon_hover {
  transform: scale(1);
}

.icon-button__icon_active,
.icon-button__icon:active {
  transform: scale(.7) !important;
}
</style>
