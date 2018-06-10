<!-- Компонент со списком всех скриптов для текущего сайта -->
<template>
  <div class="current-site-scripts">
    <ScriptsList
      :items="scripts"
      :showFilter="false"
      :emptyListMessage="emptyMessage"/>
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
    currentUrl: {
      get() {
        return this.$store.state.currentUrl;
      }
    },
    isResolvedThisUrl() {
      return this.currentUrl.startsWith('http') || this.currentUrl.startsWith('https');
    },
    scripts() {
      if (this.isResolvedThisUrl) {
        return this.$store.state.scripts.filter(script =>
          script.sites && new RegExp(script.sites, 'i').test(this.currentUrl)
        );
      } else {
        return [];
      }
    },
    emptyMessage() {
      return this.isResolvedThisUrl
        ? lc('Не обнаружено ни одного скрипта')
        : lc('В целях безопасности данное расширение работает только на сайтах, работающих по протоколам http/https!');
    }
  }
}
</script>