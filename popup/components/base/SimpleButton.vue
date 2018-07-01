<!-- Простая кнопка -->
<template>
  <div
      :class="['simple-button', {'simple-button_active': isActive}]"
      tabindex="0"
      @click="click"
      @keydown.enter.space="isActive = true"
      @keyup.enter.space="click"
      @blur="isActive = false">
    <slot/>
  </div>
</template>

<script>
export default {
  name: 'SimpleButton',
  data() {
    return {
      isActive: false
    }
  },
  methods: {
    click(ev) {
      this.isActive = false;
      this.$emit('click', ev);
    }
  }
}
</script>

<style lang="scss">
.simple-button {
  transition: background-color 0.1s linear;
  
  display: inline-block;
  
  padding: 5px 15px;

  outline: none;
  border: 1px solid rgb(33, 126, 74);
  border-radius: 4px;

  background-color: rgb(43, 153, 91);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.08);
  
  color: #fff;
  font: 14px Arial, Helvetica, sans-serif;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.25);
  text-align: center;
  user-select: none;
  
  &:focus,
  &:hover {
    background-color: rgb(55, 163, 111);
  }

  &.simple-button_active,
  &:active {
    background-color: rgb(35, 153, 91);
  }
}
</style>
