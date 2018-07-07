<!--
    Элемент формы, состоящий из метки и произвольного содержимого
    В слоте по умолчанию передаётся элемент формы
    В слоте label передаётся содержимое метки
-->
<template>
  <div class="form-item">
    <vLabel
        class="form-item__label"
        @click="activateLink">
      <slot name="label"/>
    </vLabel>
    <div ref="control" class="form-item__control">
      <slot/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormItem',
  methods: {
    activateLink() {
      let control = this.$refs.control.firstElementChild;
      if (control) {
        control.vFocus();
      }
    }
  }
}
</script>

<style lang="scss">
.form-item {
  display: flex;
}

.form-item__label {
  margin-right: 5px;
}

.form-item__control {
  flex-grow: 1;
}
</style>
