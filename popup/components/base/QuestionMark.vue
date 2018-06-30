<!--
  Компонент знак вопроса с подсказкой при наведении мыши 
  Для работы данного компонента требуется иконочный шрифт с классом "icon-help"
-->
<template>
  <div class="question-mark icon-help"/>
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
      tooltip: null
    };
  },
  mounted() {
    this.$el.addEventListener('mouseenter', ev => {
      if (this.tooltip) {
        return;
      }
      let elRect = this.$el.getBoundingClientRect();
      this.tooltip = new Vue.options.components.Tooltip({
        propsData: {
          text: this.text,
          element: this.$el
        }
      });
      this.tooltip.mountToDocument();
    });
    this.$el.addEventListener('mouseleave', ev => {
      this.tooltip.cancel();
      this.tooltip = null;
    });
  }
}
</script>

<style lang="scss">
.question-mark {
  transition: .3s;
  display: inline-block;
  font-size: 18px;
  user-select: none;
  cursor: help;
  &:hover {
    text-shadow: 0 0 3px #999;
  }
}
</style>
