<!--
  Метка
-->
<template>
  <div 
      class="v-label"
      @click="$emit('click')">
    <slot/>
  </div>
</template>

<script>
export default {
  name: 'vLabel'
}
</script>

<style lang="scss">
.v-label {
  display: inline-block;
  color: #000;
  cursor: pointer;
  user-select: none;
  &:hover {
    color: #555;
  }
}
</style>
