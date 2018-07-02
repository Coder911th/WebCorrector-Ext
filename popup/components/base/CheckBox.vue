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
      ]"
      tabindex="0"
      @keyup.enter.space="toggle">
    <div
        class="check-box__flag"
        @click="toggle"/>
    <vLabel
        class="check-box__label"
        @click="toggle">
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
  },
  methods: {
    toggle() {
      this.$emit('check', !this.checked);
    }
  }
}
</script>

<style lang="scss">
.check-box {
  display: block;
  outline: none;
  user-select: none;
  margin: 5px 0;

  &:focus {
    .check-box__flag {
      border-color: #999;
    }
  }

  &_checked .check-box__flag::before {
    background: #555;
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

    &::before {
      transition: background-color .3s;
      content: "";
      position: absolute;
      top: 2px;
      right: 2px;
      bottom: 2px;
      left: 2px;
    }
  }

  &__label {
    vertical-align: middle;
  }
}
</style>
