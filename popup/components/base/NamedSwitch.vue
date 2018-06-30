<!-- Переключатель с именованными кнопками -->
<template>
  <div class="named-switch">
    <div
        :class="[
          'named-switch__button',
          'named-switch__left',
          {'named-switch__button_active': active == leftText}
        ]"
        @click="switchToLeft">
      {{ leftText }}
    </div>
    <div 
        :class="[
          'named-switch__button',
          'named-switch__right',
          {'named-switch__button_active': active == rightText}
        ]"
        @click="switchToRight">
      {{ rightText }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'NamedSwitch',
  model: {
    prop: 'active',
    event: 'change'
  },
  props: {
    leftText: {
      type: String,
      required: true
    },
    rightText: {
      type: String,
      required: true
    },
    active: {
      type: String,
      required: true
    }
  },
  methods: {
    switchToLeft() {
      if (this.active != this.leftText)
        this.$emit('change', this.leftText);
    },
    switchToRight() {
      if (this.active != this.rightText)
        this.$emit('change', this.rightText);
    }
  }
}
</script>

<style lang="scss">
.named-switch {
  display: inline-flex;
  background: #fefefe;
  user-select: none;
}

.named-switch__button {
  padding: 5px;
  border: 1px solid #ccc;
  text-align: center;
  &:hover {
    background: #f5f5f5;
  }

  &_active {
    background: #333 !important;
    color: #f0f0f0 !important;
  }
}

.named-switch__left {
  border-radius: 3px 0 0 3px;
}

.named-switch__right {
  border-left: none;
  border-radius: 0 3px 3px 0;
}
</style>
