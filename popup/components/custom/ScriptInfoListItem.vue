<!-- Элемент списка скриптов -->
<template>
  <div
      v-focus
      :class="[
        'script-info-list-item',
        {
          disabled: script.sites && !script.active,
          'without-target': !script.sites
        }
      ]"
      @click="action('showScriptInfo', script);"
      @keyup.space.enter="action('showScriptInfo', script);"
      @contextmenu.prevent="showContextMenu">
    <div class="script-info-list-item__info">
      <div
          class="script-info-list-item__name"
          v-tooltip="script.name.length > 20 ? escapeHTML(script.name) : ''">
        {{ script.name }}
      </div>
      <div
          class="script-info-list-item__sites"
          v-tooltip="script.sites.length > 20 ? escapeHTML(script.sites) : ''">
        {{ script.sites }}
      </div>
    </div>
    <div class="script-info-list-item__security-key">
      <div>Security key</div>
      <div>{{ script.securityKey }}</div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import {escapeHTML} from 'JavaScript/Escape.js';

export default {
  name: 'ScriptInfoListItem',
  props: ['script'],
  methods: {
    escapeHTML,
    showContextMenu(ev) {
      let items = [{
        text: 'Выполнить скрипт',
        onClick: () => {
          chrome.runtime.sendMessage({
            type: 'execScript',
            data: this.script.name
          });
        }
      }];

      if (this.script.sites) {
        items.push({
          text: this.script.active 
            ? 'Отключить автозагрузку'
            : 'Включить автозагрузку',
          onClick: () => {
            this.action('toggleScriptActive', this.script);
          }
        });
      }

      this.$mainWindow.openChildWindow('ContextMenu', {
        x: ev.clientX,
        y: ev.clientY,
        items: items
      });console.log(ev)
    }
  }
}
</script>

<style lang="scss">
.script-info-list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;

  box-sizing: border-box;
  height: 40px;
  width: 350px;
  
  padding: 5px;
  border-bottom: 1px solid #ccc;
  outline: none;

  &:hover .script-info-list-item__name,
  &[focus] .script-info-list-item__name {
    text-shadow: 1px 0 0 #000;
  }

  &::before {
    content: "";
    flex: 0 0 20px;
    height: 40px;
    background: radial-gradient(circle closest-side at 8px, rgb(38, 133, 38), transparent 6px);
  }

  &.disabled::before {
    background: radial-gradient(circle closest-side at 8px, rgb(105, 18, 25), transparent 6px);
  }

  &.without-target::before {
    background: radial-gradient(circle closest-side at 8px, rgb(143, 129, 3), transparent 6px);
  }
}

.script-info-list-item__info {
  flex: 1 1 auto;
}

.script-info-list-item * {
  cursor: default;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.script-info-list-item__name {
  transition: .3s;
  text-shadow: 1px 0 0 rgba(0, 0, 0, .25);
}

.script-info-list-item__sites {
  font-size: .7em;
  font-family: monospace;
  color: rgb(192, 109, 26);
}

.script-info-list-item__security-key {
  margin-left: 5px;
  margin-right: 5px;
  flex: 0 0 auto;
  font-variant: small-caps;
  user-select: none;
  font-size: 12px;
  &:last-child {
    text-align: center;
  }
}
</style>
