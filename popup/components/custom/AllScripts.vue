<!-- Компонент со списком всех скриптов -->
<template>
  <div class="all-scripts">
    <ScriptsList
        :items="scripts"
        :emptyListMessage="emptyListMessage"/>
  </div>
</template>

<script>
import ScriptsList from '@/ScriptsList';

export default {
  name: 'AllScripts',
  components: {
    ScriptsList
  },
  computed: {
    scripts() {;
      return this.$store.state.scripts;
    },
    emptyListMessage() {
      return lc('Не обнаружено ни одного скрипта');
    }
  }
}
</script>