<!-- Страница с настройками расширения -->
<template>
  <ScrollArea>
    <div class="settings">
      <div class="settings__header">
        <NamedSwitch
            v-model="lang"
            @change="changeLocalization"
            leftText="EN"
            rightText="RU"
            class="settings__lang"/>
        <div class="settings__caption">WebCorrector Ext.</div>
        <div class="settings__version">{{ $store.state.version }}</div>
        <div class="settings__author">{{ 'Ложкин Дмитрий'|lc }}</div>
      </div>
      <div class="settings__status">
        <span>{{ 'Расширение'|lc }}</span><Toggle v-model="extension"/>
        <SimpleButton
            class="settings__create-script"
            @click="action('createScript')">
          {{ 'Новый скрипт'|lc }}
        </SimpleButton>
      </div>
      <div>
        <TextHelper
            class="settings__lib-header"
            :text="'Список библиотек'|lc"
            :tooltip="'Данные библиотеки будут доступны для подключения перед загрузкой скриптов.'|lc"/>
        <FormItem>
          <template slot="label">{{ 'Псевдоним:'|lc }}</template>
          <TextBox
              v-model="libAlias"
              class="settings__text-box"
              :validators="aliasValidators"/>
        </FormItem>
        <FormItem>
          <template slot="label">{{ 'URL библиотеки:'|lc }}</template>
          <TextBox
              v-model="libURL"
              class="settings__text-box"
              :validators="urlValidators"/>
        </FormItem>
        <SimpleButton
            ref="addLib"
            class="settings__add-lib"
            @click="addLib">
          {{ 'Добавить'|lc }}
        </SimpleButton>
      </div>
      <DataTable
          class="settings__table"
          v-model="libs"
          keyField="alias"
          :columns="libsColumns"
          :editable="true"
          :emptyTableText="'Нет ни одной библиотеки'|lc"
          :onRemove="onRemoveLib"
          :onSave="onSaveLib"/>
    </div>
  </ScrollArea>
</template>

<script>
import Vue from 'vue';
import {vModel} from 'JavaScript/VuexHelpers';
import Validation from 'Mixins/Validation';
import Validators from 'JavaScript/Validators';
import Popup from 'JavaScript/PopupManager';
import {escapeHTML} from 'JavaScript/Escape.js';

export default {
  name: 'Settings',
  mixins: [Validation],
  data() {
    return {
      
      // Валидаторы названия библиотеки
      aliasValidators: [
        Validators.required('value'),
        target => {
          let alias = this.libAlias.trim();
          if (this.libs.some(lib => lib.alias == alias))
            return `${lc('Псевдоним')} "${escapeHTML(alias)}" ${lc('уже присутствует в таблице')}!`;
          return true;
        }
      ],

      // Валидаторы url библиотеки 
      urlValidators: [Validators.required('value')]
    };
  },
  computed: {
    ...vModel([
      'libAlias',
      'libURL',
      'libs',
      'extension',
      'lang'
    ]),

    // Описание столбцов таблицы библиотек
    libsColumns: () => [
      {
        field: 'alias',
        caption: lc('Псевдоним'),
        width: '50%',
        headerAlign: 'center'
      },
      {
        field: 'url',
        caption: 'URL',
        width: '50%',
        headerAlign: 'center'
      }
    ]
  },
  methods: {
    
    // Обработчик кнопки добавить библиотеку
    addLib(x) {
      if (this.validate()) {

        // Добавляем библиотеку в хранилище
        this.libs.push({
          alias: this.libAlias.trim(),
          url: this.libURL.trim()
        });

        // Вызываем мутацию
        this.libs = this.libs;

        this.libAlias = '';
        this.libURL = '';
        new Vue.options.components.Tooltip({
          propsData: {
            text: lc('Библиотека успешно добавлена'),
            element: this.$refs.addLib.$el,
            hideAfter: 15000
          }
        }).mountToDocument();
      }
    },

    // Обработчик изменения локализации
    changeLocalization(value) {
      this.$root.$forceUpdate();
    },

    // Обработчик удаления библиотеки
    async onRemoveLib(row, rowIndex) {
      let libAlias = row.children[1].textContent;
      let scripts = this.$store.state.scripts;
      let libUser = scripts.find(script => script.libs.some(lib => lib == libAlias));
      // Проверяем зависимые скрипты
      if (libUser) {
        return `${lc('Данная библиотека используется в скрипте под названием')} <b>${escapeHTML(libUser.name)}</b>`;
      }
      return true;
    },

    // Обработчик сохранения библиотеки
    async onSaveLib(row, rowIndex) {
      let newLibAlias = row.children[1].textContent;
      let newLibRUL = row.children[2].textContent;
      let scripts = this.$store.state.scripts;
      let oldLib = this.$store.state.libs[rowIndex];

      if (oldLib.url != newLibURL) {

        // Массив скриптов, зависящих от измененной библиотеки
        let needUpdateSK = scripts.filter(script => script.libs.some(lib => lib == oldLib.alias));

        // Если хотя бы один скрипт зависит от данной билиотеки
        if (needUpdateSK.length) {  
          if (!(await Popup.confirm(lc('Был изменён URL-адрес библиотеки'), lc('У всех скриптов, использующих данную библиотеку обновится значение ключа безопасности.<br>Сохранить изменения?')))) {
            // Не сохраняем изменения
            return false;
          } else {
            // Обновляем ключ безопосности для всех зависимых скриптов
            needUpdateSK.forEach(script => this.action('updateSK', script));
          }
        }
      }

      if (oldLib.alias != newLibAlias) {
        // Обновляем псевдоним во всех скриптах
        scripts.forEach(script =>
          script.libs.forEach((lib, index) =>
            lib == oldLib.alias
              ? script.libs.splice(index, 1, newLibAlias)
              : null
          )
        );

        // Вызываем мутацию хранилища скриптов
        this.setState('scripts', scripts);
      }

      return true;
    }
  }
}
</script>

<style lang="scss">
.settings {
  box-sizing: border-box;
  width: 350px;
  padding: 5px;
}

.settings__header {
  padding: 20px 10px;
  margin: 0px -5px;
  background: #f9f5f5;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
}

.settings__caption {
  padding: 0 0 10px 10px;
  font-size: 20px;
  font-variant: small-caps;
}

.settings__author {
  font-style: italic;
  font-size: 12px;
  text-align: right;
}

.settings__version {
  float: left;
  font-size: 12px;
}

.settings__lang {
  float: right;
}

.settings__status {
  margin-top: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  span {
    padding-right: 5px;
    font-size: 13px;
  }
}

.settings__create-script {
  margin-left: 40px;
}

.settings__lib-header {
  display: block !important;
  margin: 20px 0 0px;
  text-align: center;
  font-size: 1.2rem;
}

.settings__text-box {
  margin-bottom: 10px;
}

.settings__add-lib {
  float: right;
  margin-bottom: 10px;
}

.settings__table {
  clear: both;
}
</style>
