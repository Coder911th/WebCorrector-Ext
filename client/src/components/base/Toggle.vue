<!-- Переключатель между состояниями включен/выключен -->
<template>
  <div
      class="toggle"
      @click="$emit('change', !checked)">
    <div :class="['toggle__button', {'toggle__button_on': checked}]"/>
    <div :class="['toggle__label', 'toggle__label_on']">ON</div>
    <div :class="['toggle__label', 'toggle__label_off']">OFF</div>
  </div>
</template>

<script>
export default {
  name: 'Toggle',
  model: {
    prop: 'checked',
    event: 'change'
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
.toggle {
  display: inline-block;
  position: relative;

  height: 22px;
  width: 45px;
  
  border: 1px solid #999;
  border-radius: 15px;
  background: #333;

  user-select: none;
}

.toggle:hover .toggle__button {
  background: rgb(180, 9, 9);
  &_on {
    background: rgb(29, 138, 29);
  }
}

.toggle__button {
  transition: .5s;

  position: absolute;
  left: calc(100% - 23px);
  top: -1px;

  height: 22px;
  width: 22px;
  
  border: 1px solid #999;
  border-radius: 15px;
  background: rgb(128, 2, 2);

  &_on {
    left: -1px;
    background: rgb(19, 100, 19);
    & + .toggle__label_on {
      color: #fff;
    }
  }

  &:not(&_on) {
    & + .toggle__label_on + .toggle__label_off {
      color: #fff;
    }
  }
}

.toggle__label {
  transition: .3s;

  display: flex;
  flex-direction: column;
  justify-content: center;

  position: absolute;
  top: 0;
  bottom: 0;
  
  color: #999;
  font-size: 9px;

  &_on {
    left: 4.65px;
  }
  &_off {
    right: 3px;
  }
}
</style>
