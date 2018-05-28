<!-- Компонент: Флаг. Реализация: текстовый символ -->
<template>
  <div
    class="check-box"
    @click="$emit('check', !checked)"
  >
    <div>{{checked ? '☑' : '☐'}} <slot/></div>
  </div>
</template>

<script>
export default {
  name: 'TextCheckBox',
  model: {
    prop: 'checked',
    event: 'check'
  },
  props: {
    checked: {
      type: Boolean,
      required: true
    }
  }
}
</script>

<style>
.check-box {
  display: block;
  user-select: none;
}
</style>
