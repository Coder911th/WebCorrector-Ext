<!--
  Подробная информация о скрипте (также страница с созданием скрипта)
  Синглтон - только один экземпляр на всё приложение.

  Для работы компонента необходим иконочный шрифт со следующими классами:
  > icon-forward
  > icon-floppy
  > icon-trash

  Hotkeys:
    F5 - выполнить скрипт
    Shift+S - Сохранить скрипт
    backspace - Закрыть окно
-->
<template>
  <transition name="slide-from-right">
    <div
        v-if="script"
        ref="panel"
        class="about-script"
        tabindex="0"
        @keydown.shift.83.prevent="press('save')"
        @keyup.shift.83="unpress('save')"
        @keydown.8.prevent="press('back')"
        @keyup.8="unpress('back')"
        @keydown.116.prevent="press('play')"
        @keyup.116="unpress('play')">
      <ScrollArea>
        <div class="about-script__scroll-content"> 
          <div class="about-script__menu">
            <div class="about-script__menu-left">
              <IconButton
                  ref="save"
                  icon="icon-floppy"
                  color="#1842a5"
                  size="1.32em"
                  @click="onSave"/>

              <IconButton
                  v-if="!script.isNewScript"
                  class="about-script__remove-button"
                  icon="icon-trash-empty"
                  color="#d0cfcf"
                  size="1.1em"
                  @click="onRemove"/>
            </div>

            <div class="about-script__caption">{{
              script.isNewScript
                ? 'Новый скрипт'
                : 'Информация о скрипте'
            |lc}}</div>
            
            <div class="about-script__menu-right">
              <IconButton
                  ref="play"
                  class="about-script__play-button"
                  icon="icon-play"
                  color="#424442"
                  size="1.1em"
                  @click="onPlay"/>
              <IconButton
                  ref="back"
                  icon="icon-forward"
                  color="rgb(211, 36, 36)"
                  size="1.1em"
                  @click="onBack"/>
            </div>
          </div>

          <FormItem class="about-script__line">
            <template slot="label">{{ 'Название:'|lc }}</template>
            <TextBox 
                v-model="scriptName"
                :validators="[required('value')]"/>
          </FormItem>
          
          <FormItem class="about-script__line">
            <template slot="label">
              <TextHelper
                  text="URL"
                  :tooltip='`<div>Регулярное выражение, определяющее сайты, на которых будет автоматически срабатывать данный скрипт.</div><div style="margin-top: 5px">Пустое поле означает невозможность автоматически подгружать данный скрипт на сайты. Только вручную.</div>`|lc'
                  textAfter="."/>
            </template>
            <TextBox
                class="about-script__url"
                v-model="scriptSites"/>
          </FormItem>
          
          <div class="about-script__editor-line about-script__line">
            <div class="row">
              <div>{{ 'Состояние:'|lc }}</div>
              <Toggle
                  class="about-script__toggle-active"
                  v-model="scriptActive"/>
            </div>
            <div class="row">
              <Editor
                  ref="editor"
                  v-model="scriptCode"/>
              <QuestionMark
                  :text="'<b>Редактор кода</b><div style=&quot;margin-bottom: 5px&quot;>Нажмите ESC, чтобы выйти из режима редактирования.</div><div>Ctrl+Space - автодополнение.</div>'|lc"/>
            </div>
          </div>

          <Spoiler
              class="about-script__line"
              :caption="'Подключаемые библиотеки'|lc"
              :initOpen="isOpenSpoiler"
              @toggle="setState('isOpenSpoiler', !isOpenSpoiler)">
            <DataTable
                class="about-script__table"
                v-model="libs"
                keyField="alias"
                :columns="tableColumns"
                :emptyTableText="'Нет ни одной библиотеки'|lc">
              <template slot="isConnected" slot-scope="{row}">
                <CheckBox
                    class="about-script__checkbox"
                    :checked="scriptLibs.indexOf(row.alias) > -1"
                    @check="toggleLib(row.alias, $event)"/>
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
import {escapeHTML} from 'JavaScript/Escape.js';

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
        width: 'calc(50% - 15px)'
      },
      {
        field: 'url',
        caption: 'URL',
        width: 'calc(50% - 15px)',
        overflow: 'nowrap',
        tooltip: 1
      },
      {
        field: 'isConnected',
        width: '20px',
        computed: true
      }
    ]
  },
  methods: {

    // Валидатор поля, обязательного к заполнению
    required: Validators.required,

    press(target) {
      return this.$refs[target].isActive = true;
    },

    unpress(target) {
      return this.$refs[target].click();
    },
    
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
        return false;
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
              text: (isNewScript ? lc('Скрипт успешно создан!') : lc('Сохранение прошло успешно!')) + `<br>${lc('Новый ключ безопасности')}: <b>${escapeHTML(after.securityKey)}</b>`,
              element: this.$refs.save.$el,
              hideAfter: 2000,
              borderColor: 'rgb(0, 100, 0)'
            }
          }).mountToDocument()
        }
      }
      return true;
    },

    // Обработчик крестика (Удалить)
    async onRemove() {
      if (await Popup.confirm(lc('Удаление скрипта'), lc('Вы уверены, что хотите удалить скрипт?'))) {
        this.action('removeScript', this.scriptName);

        // Скрываем окно редактирования скрипта
        this.action('hideScriptInfo');
        Popup.alert(null, `${lc('Скрипт')} <b>${escapeHTML(this.scriptName)}</b> ${lc('успешно удалён')}!`);
      }
    },

    async onPlay() {
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
        if (await Popup.confirm(null, lc('<div>Перед выполнением скрипта необходимо сохранить изменения.</div><div>Сохранить и продолжить?</div>'))) {
          if (!await this.onSave())
            return;
        } else {
          return;
        }
      }

      chrome.runtime.sendMessage({
        type: 'execScript',
        data: this.script.name
      });
    }
  }
}
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

.about-script__url {
  font-family: monospace;
}

.about-script__checkbox {
  display: flex !important;
  justify-content: center;
  align-items: center;
}

.about-script__editor-line {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.about-script__line {
  margin-top: 10px;
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
}

.about-script__caption {
  user-select: none;
}

.about-script__menu-left {
  width: 50px;
  display: flex;
  align-items: center;
  font-size: 16px;
}

.about-script__menu-right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 50px;
  font-size: 16px;
}

.about-script__remove-button {
  margin-left: 10px;
}

.about-script__play-button {
  margin-right: 10px;
}

.about-script__table {
  margin-bottom: -1px;
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
