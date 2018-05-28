<!-- Компонент для представления списка скриптов -->

<template>
  <div class="script-list">
    <FilterTextBox
      v-if="showFilter"
      v-model="filterField"
      :placeholder="'Поиск'|lc"
    >
      <CheckBoxesPanel
        v-model="filterFlags"
        :description="flagsDescription"
        :validators="[flagsValidator]"
      />
    </FilterTextBox>
    <ScrollArea
      ref="scrollArea"
      class="script-list__list"
    >
      <template v-if="filteredList.length">
        <div
          v-for="item of filteredList"
          :key="item.securityKey"
        >
          <ScriptInfoListItem :script="item"/>
        </div>
      </template>
      <div
        v-else
        class="script-list__empty-list-message"
      >{{emptyListMessage}}</div>
    </ScrollArea>
  </div>
</template>

<script>
import {vModel} from 'JavaScript/VuexHelpers';
import ScriptInfoListItem from '@/ScriptInfoListItem';

export default {
  name: 'ScriptsList',
  components: {
    ScriptInfoListItem
  },
  props: {
    items: {
      type: Array,
      required: true
    },
    showFilter: {
      type: Boolean,
      default: true
    },
    emptyListMessage: {
      type: String,
      default: lc('Не обнаружено ни одного скрипта')
    }
  },
  computed: {
    ...vModel([
      
      // Строка фильтра
      'filterField',

      // Флаги фильтра
      'filterFlags'
    ]),
    
    // Отфильтрованный список
    filteredList() {
      return this.items.filter(script =>
        this.filterFlags.byName && script.name.toUpperCase().indexOf(this.filterField.toUpperCase()) > -1 ||
        this.filterFlags.bySite && new RegExp(script.sites, 'i').test(this.filterField) ||
        this.filterFlags.bySecurityKey && script.securityKey.toString() === this.filterField
      );
    },

    // Флаги фильтрации
    flagsDescription: () => ({
      byName: lc('По названию'),
      bySite: lc('По сайту'),
      bySecurityKey: lc('По Security key (точное совпадение)')
    })
  },
  methods: {
    // Запрещаем снимать все флаги в фильтре
    flagsValidator() {
      for (let flagName in this.filterFlags) {
        if (this.filterFlags[flagName]) {
          return true;
        }
      }
      return lc('Хотя бы один флаг должен быть выбран');
    }
  }
}
</script>
<style>
.script-list {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin-top: -1px;
}

.script-list__list {
  padding-bottom: 5px;
  background: linear-gradient(#ccc 0, transparent 5px);
  flex-grow: 1;
}

.script-list__empty-list-message {
  box-sizing: border-box;
  width: 350px;
  padding: 10px 5px 5px;
  text-align: center;
}
</style>
