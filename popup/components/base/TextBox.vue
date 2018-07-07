<!-- Тестовое поле -->
<template>
  <input
      type="text"
      v-focus
      :class="['text-box', {'text-box_has-border': hasBorder}]" 
      :placeholder="placeholder"
      :value="value"
      @input="$emit('input', $event.target.value)">
</template>

<script>
import Validation from 'Mixins/Validation';

export default {
  name: 'TextBox',
  mixins: [Validation],
  props: {
    value: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      default: ''
    },
    hasBorder: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss">
.text-box {
  transition: .5s;

  width: 100%;
  box-sizing: border-box;

  padding: 1px;
  
  outline: none;
  border: none;
  border-bottom: 1px solid #ccc;
  background: #fff;

  font-size: 13px;

  &:hover {
    border-bottom-color: #999;
  }

  &[focus] {
    border-bottom-color: #555 !important;
  }

  &_has-border {
    border: 1px solid #ccc;
  }
}
</style>
