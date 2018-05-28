<!-- Тестовое поле -->
<template>
  <input
    class="text-box" 
    type="text"
    :placeholder="placeholder"
    :value="value"
    @input="$emit('input', $event.target.value)"
  >
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
    }
  }
}
</script>

<style>
.text-box {
  transition: .5s;

  width: 100%;
  box-sizing: border-box;

  padding: 5px;
  
  outline: none;
  border: 1px solid #ccc;

  background: #fff;

  font-size: 13px;
}
</style>
