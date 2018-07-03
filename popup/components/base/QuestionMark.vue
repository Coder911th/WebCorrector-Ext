<!--
  Компонент знак вопроса с подсказкой при наведении мыши 
  Для работы данного компонента требуется иконочный шрифт с классом "icon-help"
-->
<template>
  <div
      class="question-mark icon-help"
      tabindex="0"
      @focus="showTooltip"
      @blur="!isMouseOver ? hideTooltip() : null"
      @mouseenter="isMouseOver = true; showTooltip()"
      @mouseleave="isMouseOver = false; hideTooltip()"/>
</template>

<script>
import Vue from 'vue';

export default {
  name: 'QuestionMark',
  props: {
    // Текст подсказки
    text: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      // Vue-элемент подсказки
      tooltip: null,
      isMouseOver: false
    };
  },
  methods: {
    showTooltip() {
      if (this.tooltip) {
        return;
      }
      let elRect = this.$el.getBoundingClientRect();
      this.tooltip = this.vCreate('Tooltip', {
        text: this.text,
        element: this.$el
      });
    },
    hideTooltip() {
      if (this.tooltip) {
        this.tooltip.cancel();
        this.tooltip = null;
      }
    }
  }
}
</script>

<style lang="scss">
.question-mark {
  transition: .3s;
  display: inline-block;
  outline: none;
  font-size: 18px;
  user-select: none;
  cursor: help;
  &:hover {
    text-shadow: 0 0 3px #999;
  }
}
</style>
