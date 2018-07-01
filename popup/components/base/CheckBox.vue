<!--
  Флаг.
  
  Слот по умолчанию - метка
-->
<template>
  <div
      :class="[
        'check-box',
        {
          'check-box_checked': checked
        }
      ]">
    <div
        class="check-box__flag"
        @click="$emit('check', !checked)"/>
    <vLabel
        class="check-box__label"
        @click="$emit('check', !checked)">
      <slot/>
    </vLabel>
  </div>
</template>

<script>
export default {
  name: 'CheckBox',
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

<style lang="scss">
.check-box {
  display: block;
  user-select: none;
  margin: 5px 0;

  &_checked {
    .check-box__flag::before {
      content: "";
      position: absolute;
      top: 2px;
      right: 2px;
      bottom: 2px;
      left: 2px;
      background: #555;
    }
  }

  &__flag {
    box-sizing: border-box;
    display: inline-block;
    position: relative;
    width: 16px;
    height: 16px;
    background: #fff;
    border: 2px solid #ccc;
    vertical-align: middle;
  }

  &__label {
    vertical-align: middle;
  }
}
</style>
