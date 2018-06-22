<!--
  Компонент - текст с маленьким знаком вопроса в конце,
  наводя на который появляется подсказка.
-->
<template>
  <div class="text-helper">
    {{ text }}<QuestionMark
        class="text-helper__tooltip"
        :text="tooltip"
        /><span v-if="textAfter" class="text-helper__colon">{{ textAfter }}</span>
  </div>
</template>

<script>
export default {
  name: 'TextHelper',
  props: {
    // Текст перед вопросительным знаком
    text: {
      type: String,
      default: ''
    },
    // Содержимое подсказки (html)
    tooltip: {
      type: String,
      required: true
    },
    // Текст следующий сразу за вопросительным знаком
    textAfter: {
      type: String,
       default: ''
    }
  }
}
</script>

<style>
.text-helper {
  display: inline;
}

.text-helper__tooltip {
  transform: scale(.7) translateY(-6px);
  margin-left: -6px;
  font-size: 14px;
}

.text-helper__colon {
  margin-left: -3px;
}
</style>
