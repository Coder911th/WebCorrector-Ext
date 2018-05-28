<!--
  Подробная информация о скрипте (также страница с созданием скрипта)
  Синглтон - только один экземпляр на всё приложение.

  Для работы компонента необходим иконочный шрифт со следующими классами:
  > icon-forward
  > icon-floppy
  > icon-trash
-->
<template>
  <transition name="slide-from-right">
    <div class="about-script" v-if="script">
      <ScrollArea>
        <div class="about-script__scroll-content">
          
          <div class="about-script__menu">
            <div class="about-script__menu-left">

              <div
                ref="save"
                class="about-script__save-button icon-floppy"
                @click="onSave"
              />

              <div
                v-if="!script.isNewScript"
                class="about-script__remove-button icon-trash-empty"
                @click="onRemove"
              />

            </div>

            <div class="about-script__caption">{{
              script.isNewScript
                ? 'Новый скрипт'
                : 'Информация о скрипте'
            |lc}}</div>
            
            <div class="about-script__menu-right">

              <div
                class="about-script__back-button icon-forward"
                @click="onBack"
              />

            </div>
          </div>

          <div class="about-script__label">{{'Название'|lc}}</div>
          <TextBox 
            v-model="scriptName"
            :validators="[required('value')]"
          />
          
          <div class="about-script__label">URL<QuestionMark
              class="about-script__url-tooltip"
              :text="'Регулярное выражение, определяющее сайты, на которых будет срабатывать данный скрипт.'|lc"
            />
          </div>
          <TextBox
            class="about-script__url"
            v-model="scriptSites"
            :validators="[required('value')]"
          />
          
          <div class="about-script__editor-line">

            <div class="row">
              <div>{{'Состояние:'|lc}}</div>
              <Toggle
                class="about-script__toggle-active"
                v-model="scriptActive"
              />
            </div>

            <div class="row">
              <Editor v-model="scriptCode"/>
              <QuestionMark
                :text="'<b>Редактор кода</b><div style=&quot;margin-bottom: 5px&quot;>Нажмите ESC, чтобы выйти из режима редактирования.</div><div>Ctrl+Space - автодополнение.</div>'|lc"
              />
            </div>

          </div>

          <Spoiler class="about-script__line" :caption="'Подключаемые библиотеки'|lc" :initOpen="isOpenSpoiler">
            <DataTable
              class="about-script__table"
              v-model="libs"
              keyField="alias"
              :columns="tableColumns"
              :emptyTableText="'Нет ни одной библиотеки'|lc"
            >
              <template slot="isConnected" slot-scope="{row}">
                <TextCheckBox
                  class="about-script__checkbox"
                  :checked="scriptLibs.indexOf(row.alias) > -1"
                  @check="toggleLib(row.alias, $event)"
                />
              </template>
            </DataTable>
          </Spoiler>
        </div>
      </ScrollArea>
    </div>
  </transition>
</template>

<script>
import Vue from 'vue';
import {vModel} from 'JavaScript/VuexHelpers';
import Editor from '@/Editor';
import Popup from 'JavaScript/PopupManager';
import Validation from 'Mixins/Validation';
import Validators from 'JavaScript/Validators';

export default {
  name: 'AboutScript',
  components: {
    Editor
  },
  mixins: [Validation],
  computed: {
    
    // Массив из всех библиотек {alias, url}
    libs() {
      return this.$store.state.libs;
    },
    
    // Редактируемый скрипт
    script() {
      return this.$store.state.aboutScriptTarget;
    },

    ...vModel([
      'isOpenSpoiler',
      'scriptActive',
      'scriptName',
      'scriptSites',
      'scriptLibs',
      'scriptCode'
    ]),

    // Описание столбцов таблицы
    tableColumns: () => [
      {
        field: 'alias',
        caption: lc('Название'),
        width: 'calc(50% - 10px)'
      },
      {
        field: 'url',
        caption: 'URL',
        width: 'calc(50% - 10px)',
        overflow: 'nowrap',
        tooltip: 1
      },
      {
        field: 'isConnected',
        width: '10px',
        computed: true
      }
    ]
  },
  methods: {

    // Валидатор поля, обязательного к заполнению
    required: Validators.required,
    
    // Переключает состояние библиотеки alias в текущем скрипте на value
    toggleLib(alias, value) {
      let libs = this.scriptLibs;
      if (value) {
        libs.push(alias);
      } else {
        libs.splice(libs.indexOf(alias), 1);
      }

      // Вызываем мутацию
      this.scriptLibs = this.scriptLibs;
    },
    
    // Обработчик стрелки назад
    async onBack() {
      let payload = {
        before: this.script,
        after: {
          active: this.scriptActive,
          name: this.scriptName,
          sites: this.scriptSites,
          libs: this.scriptLibs,
          code: this.scriptCode
        }
      };

      if (await this.action('wasChanges', payload)) {

        // Если было что-то отредактировано
        if (await Popup.confirm(lc('Данные были изменены'), lc('Вы уверены, что хотите отменить все сделанные изменения?'))) {
          if (this.script.active != this.scriptActive) {

            // Состояние скрипта сохраняется в любом случае
            this.action('toggleScriptActive', this.script);
          }

          // Скрываем окно редактирования скрипта
          this.action('hideScriptInfo');
        } else {
          return;
        }
      } else {
        if (this.script.active != this.scriptActive) {

          // Если было изменено только состояние скрипта (включен/выключен)
          this.action('toggleScriptActive', this.script);
        }

        // Скрываем окно редактирования скрипта
        this.action('hideScriptInfo');
      }
    },

    // Обработчик дискетки (Сохранить)
    async onSave() {
      if (!this.validate()) {
        return;
      }

      let after = {
        active: this.scriptActive,
        name: this.scriptName.trim(),
        sites: this.scriptSites.trim(),
        libs: Array.from(this.scriptLibs),
        code: this.scriptCode
      };

      let isNewScript = this.script.isNewScript;

      let success = await this.action('saveScript', {
        before: this.script,
        after: after
      });

      if (success) {
        if (after.securityKey) {
          new Vue.options.components.Tooltip({
            propsData: {
              text: (isNewScript ? lc('Скрипт успешно создан!') : lc('Сохранение прошло успешно!')) + `<br>${lc('Новый ключ безопасности')}: <b>${after.securityKey}</b>`,
              element: this.$refs.save,
              hideAfter: 3000,
              borderColor: 'rgb(0, 100, 0)'
            }
          }).mountToDocument()
        }
      }
    },

    // Обработчик крестика (Удалить)
    async onRemove() {
      if (await Popup.confirm(lc('Удаление скрипта'), lc('Вы уверены, что хотите удалить скрипт?'))) {
        this.action('removeScript', this.scriptName);

        // Скрываем окно редактирования скрипта
        this.action('hideScriptInfo');
        Popup.alert(null, `${lc('Скрипт')} <b>${this.scriptName}</b> ${lc('успешно удалён')}!`);
      }
    }
  }
};
</script>

<style lang="scss">
.about-script {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  box-shadow: -1px 0 3px rgba(0, 0, 0, .25);
}

.about-script__scroll-content {
  box-sizing: border-box;
  padding: 10px;
  width: 350px;
}

.about-script__label {
  margin: 10px 0 0 5px;
}

.about-script__line {
  margin-top: 10px;
}

.about-script__url {
  font-family: monospace;
}

.about-script__checkbox {
  height: 100%;
  display: flex !important;
  justify-content: center;
  align-items: center;
}

.about-script__editor-line {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-top: 10px;
}

.row {
  display: flex;
  align-items: center;
}

.about-script__menu {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0px -10px 0px;
  padding: 0 10px;
  background: #f9f5f5;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  line-height: 24px;

  .about-script__save-button,
  .about-script__remove-button,
  .about-script__back-button {
    user-select: none;
    cursor: pointer;
    &:hover {
      transform: scale(1.1);
    }
    &:active {
      transform: scale(.9);
    }
  }
}

.about-script__caption {
  user-select: none;
}

.about-script__menu-left {
  width: 50px;
  display: flex;
  font-size: 16px;
}

.about-script__menu-right {
  display: flex;
  justify-content: flex-end;
  width: 50px;
  font-size: 16px;
}

.about-script__remove-button {
  margin-left: 10px;
  color: #d0cfcf;
}

.about-script__save-button {
  color: #1842a5;
  font-size: 1.2em;
}

.about-script__back-button {
  color: rgb(211, 36, 36);
}

.about-script__table {
  margin-bottom: -1px;
}

.about-script__url-tooltip {
  transform: scale(.7);
  margin-left: -5px;
}

.about-script__toggle-active {
  transform: scale(.8);
}

/* Анимация выезжающей панели */
.slide-from-right-enter-active,
.slide-from-right-leave-active {
  transition: .5s;
}

.slide-from-right-enter,
.slide-from-right-leave-to {
  left: 100%;
  right: -100%;
}

.slide-from-right-leave,
.slide-from-right-enter-to {
  left: 0;
  right: 0;
}
</style>
