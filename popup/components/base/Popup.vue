<!-- Модальное окно -->

<template>
  <div class="popup">
    <div class="popup__window">
      <div
          v-if="caption"
          v-html="caption"
          class="popup__caption"/>
      <div class="popup__message" v-html="message"/>
      
      <SimpleButton
          v-if="type == 'alert'"
          v-focus
          @click="destroy()">
        OK
      </SimpleButton>
      
      <div>
        <SimpleButton
            v-if="type == 'confirm'"
            v-focus
            @click="onPositive();destroy()">
          {{ positiveButtonText }}
        </SimpleButton>

        <SimpleButton
            v-if="type == 'confirm'"
            v-focus
            @click="onNegative();destroy()"
            style="margin-left: 10px">
          {{ negativeButtonText }}
        </SimpleButton>
      </div>
    </div>
  </div>
</template>

<script>
import Window from 'Base/Window';

export default {
  name: 'Popup',
  extends: Window,
  props: {

    // Тип модального окна
    // alert - простое окно с сообщением
    // confirm - окно подтверждения
    type: {
      type: String,
      default: 'alert',
      validator(value) {
        return value == 'alert' || value == 'confirm'
      }
    },

    // Заголовок
    caption: {
      type: String,
      default: ''
    },

    // Сообщение
    message: {
      type: String,
      default: ''
    },

    // Текст кнопки с положительным ответом (для type = 'confirm')
    positiveButtonText: {
      type: String,
      default: 'Да'
    },

    // Текст кнопки с отрицательным ответом (для type = 'confirm')
    negativeButtonText: {
      type: String,
      default: 'Нет'
    },

    // Обработчик положительного ответа (для type = 'confirm')
    onPositive: {
      type: Function,
      default: function() {}
    },

    // Обработчик отрицательного ответа (для type = 'confirm')
    onNegative: {
      type: Function,
      default: function() {}
    }
  },
  methods: {
    // Уничтожает popup
    destroy() {
      document.body.removeChild(this.$el);
    }
  }
}
</script>

<style lang="scss">
.popup {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: linear-gradient(transparent 0, rgba(0, 0, 0, .25) 10px, rgba(0, 0, 0, .25) calc(100% - 10px), transparent 100%);
}

.popup__window {
  display: flex;
  flex-flow: column wrap;
  align-items: center;
  padding: 10px;
  margin: 10px;
  border: 1px solid #999;
  border-radius: 5px;
  background: #fff;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, .5);
}

.popup__caption {
  width: 100%;
  border-bottom: 1px solid #999;
  text-align: center;
  text-shadow: 1px 0 0 rgba(0, 0, 0, .75);
}

.popup__message {
  margin: 10px 0;
  text-align: center;
}
</style>
