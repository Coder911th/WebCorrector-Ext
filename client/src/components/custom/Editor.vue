<!-- Редактор JavaScript кода (интеграция CodeMirror) -->
<template>
  <div
    class="editor"
  >
    <div
      ref="editor"
      v-show="fullscreen"
      @keydown="$emit('input', getCode())"
    />
    <SimpleButton
      @click="toFullscreenMode"
    >{{'Открыть редактор кода'|lc}}</SimpleButton>
  </div>
</template>

<script>
// Ядро
import CodeMirror from 'codemirror'

// Основные стили редактора
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/scroll/simplescrollbars.js';

// Полосы прокрутки
import 'codemirror/addon/scroll/simplescrollbars.css';

// Подсветка JavaScript кода
import 'codemirror/mode/javascript/javascript.js';

// Подключаем подсказки при вводе
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/hint/show-hint.js'
import 'codemirror/addon/hint/javascript-hint.js';

// Сворачивание блоков кода
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/fold/foldcode.js';
import 'codemirror/addon/fold/foldgutter.js';
import 'codemirror/addon/fold/brace-fold.js';
import 'codemirror/addon/fold/comment-fold.js';

// Полноэкранный режим
import 'codemirror/addon/display/fullscreen.css';
import 'codemirror/addon/display/fullscreen.js';

// Панель управления
import 'codemirror/addon/display/panel.js'

export default {
  name: 'Editor',
  model: {
    event: 'input',
    prop: 'value'
  },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      editor: null,
      fullscreen: false
    };
  },
  methods: {
    // Обработчик кнопки "Открыть редактор кода"
    toFullscreenMode() {
      //Устанавливаем флаг полноэкранного режима редактора
      this.fullscreen = true;
      // При следующей открисовке устанавливаем полноэкранный режим
      // Нужно, чтобы Vue успел сделать элемент редактора видимым перед
      // активацией полноэкранного режима
      this.$nextTick(() => this.editor.setOption("fullScreen", true));
      // Фокусируемся на редакторе кода, после того как редактор будет открыт
      setTimeout(() => this.editor.focus(), 300);
      // Растягиваем окно по ширине и сжимаем по высоте для удобства редактирования
      // 80 символов на строку
      document.body.style.width = '670px';
      document.body.style.height = '300px';
    },
    // Обработчик закрытия полноэкранного режима клавишей Esc
    closeEditorHandler(ev) {
      if (ev.key == 'Escape') {
        // Блокируем закрытие всего окно
        ev.preventDefault();
        // Выключаем полноэкранный режим
        this.editor.setOption('fullScreen', false);
        // Скрываем редактор
        this.fullscreen = false;
        // Восстанавливаем размеры окна
        document.body.style.width = null;
        document.body.style.height = null;
      }
    },
    // Возвращает записанный в редакторе код
    getCode() {
      return this.editor.getValue();
    },
    setCode(value) {
      this.editor.setValue(value);
    }
  },
  mounted() {
    // Объект конфигураций создаваемого редактора кода
    let editorConfig = {
      value: this.value, // Указываем изначально записанный в редактор тест
      lineNumbers: true, // Показывать сбоку нумерацию строк в редакторе
      mode: "javascript", // Целевой язык редактора - javascript
      tabSize: 2, // один таб равен двум пробелам
      foldGutter: true, // Возможность сворачивания блоков кода
      gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
      // Горячие клавиши
      extraKeys: {
        "Ctrl-Space": "autocomplete"
      },
      scrollbarStyle: 'overlay' // Изменяем стиль полосы прокрутки текста
    }; 
    
    this.editor = CodeMirror(this.$refs.editor, editorConfig);
    document.addEventListener('keyup', this.closeEditorHandler);
  },
  destroyed() {
    document.removeEventListener('keyup', this.closeEditorHandler);
  }
}
</script>

<style>
.editor {
  display:inline-block;
}
</style>
