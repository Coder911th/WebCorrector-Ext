<!-- Текстовая кнопка -->
<template>
  <div
    class="text-button"
    @click="$emit('click')"
  >
    <slot/>
  </div>
</template>

<script>
export default {
  name: 'TextButton'
}
</script>

<style lang="scss">
.text-button {
  box-sizing: border-box;
  display: inline-block;
  border-bottom: 1px dotted transparent;
  color: #333;
  cursor: pointer;
  transition: .2s;

  &:hover {
    border-bottom-color: #999;
    color: #333;
    text-shadow: 1px 0px 1px #ccc;
  }
}
</style>
