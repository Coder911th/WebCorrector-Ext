<!--
  Кнопка-картика с использованием иконочного шрифта
-->

<template>
  <div
    class="icon-button"
    @click.capture="$emit('click', {target: $el})"
    @mouseover="scaleStyle = {transform: 'scale(1)'}"
    @mouseout="scaleStyle = {}"
  >
    <div
      :class="['icon-button__icon', icon]"
      :style="[{
        fontSize: size,
        color: color
      }, scaleStyle]"
    />
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
      scaleStyle: {}
    }
  },
  methods: {
    // Анимирует нажатие на кнопку
    press() {
      this.scaleStyle = {transform: 'scale(.8)'};
      setTimeout(() => this.scaleStyle = {}, 100);
    }
  }
}
</script>

<style lang="scss">
.icon-button {
  display: inline-block;
  user-select: none;
  cursor: pointer;
  line-height: 1;
}

.icon-button__icon:active {
  transform: scale(.8) !important;
}

.icon-button__icon {
  transform: scale(.9);
  &::before {
    margin: 0 !important;
  }
}
</style>
