<!-- Панель с дополнительными условиями фильтрации списка скриптов -->
<!-- Данная панель фильтров состоит только из чекбоксов -->

<template>
  <div class="check-boxes-panel">
    <TextCheckBox
        v-for="(checked, flagName) in flags"
        :key="flagName"
        :checked="checked"
        @check="change(flagName, $event)">
      {{ description[flagName] }}
    </TextCheckBox>
  </div>
</template>

<script>
import Validation from 'Mixins/Validation';

export default {
  name: 'CheckBoxesPanel',
  mixins: [Validation],
  model: {
    prop: 'flags',
    event: 'change'
  },
  props: {
    // Флаги
    flags: {
      type: Object,
      required: true
    },

    // Описания флагов {flagName: text}
    description: {
      type: Object,
      required: true
    }
  },
  methods: {
    change(flagName, newValue) {
      let oldValue = this.flags[flagName];
      this.flags[flagName] = newValue;
      if (!this.validate()) {
        this.flags[flagName] = oldValue;
      } else {
        this.$emit('change', this.flags);
      }
    }
  }
}
</script>

<style>
.check-boxes-panel {
  padding: 10px;
}
</style>
