/*
  Для работы требуется иконочный шрифт с определенными классами:
  > icon-pencil
  > icon-cancel
  > icon-floppy
  > icon-forward
*/

import Vue from 'vue';

export default {
  name: 'DataTable',
  model: {
    prop: 'rows',
    event: 'update'
  },
  props: {
    // Информация о столбцах
    /* Структура столбца
    {
      field: 'alias',        - ключевое поле столбца из массива данных
      caption: 'Псевдоним',  - название столбца
      width: '30%',          - ширина ячейки в единицах CSS
      overflow: 'nowrap',    - поведение при переполнении ячейки (по умолчанию - перенос на другую строку)
      headerAlign: 'center', - выравнивание заголовка
      align: 'center',       - выравнивание контента
      canSort: true,         - можно ли сортировать столбец (по умолчанию - нельзя)
      hidden: true,          - скрыть столбец
      computed: true,        - вычилимое поле. Слот и завание field определяет содержимое ячейки. 
      Есть доступ ко всем данным текущей строки через объекта row. Нельзя редактировать и сортировать.
      tooltip: 30            - Для режима nowrap определяет кол-во символов, после которого при наведении
      мыши будет выводится подсказка с содержимым ячейки
    }
    */
    columns: {
      type: Array,
      required: true,
      validator(value) {
        return value.every(column =>
          column.field != undefined &&
          column.width != undefined
        );
      }
    },
    // Данные
    rows: {
      type: Array,
      required: true
    },
    /*
      Название ключевого поля. Все строки должны иметь уникальное значение
      ключевого поля.
    */
    keyField: {
      type: String,
      required: true
    },
    // Текст, если таблица пуста
    emptyTableText: {
      type: String,
      default: 'В таблице нет данных'
    },
    // Скрывать ли названия столбцов
    hideCaption: {
      type: Boolean,
      default: false
    },
    // Подсвечивать ли ряд, при навередении курсора
    hoverHighlight: {
      type: Boolean,
      default: false
    },
    // Есть ли возможность редактировать данные (у каждой строки появляется панель редактирования)
    editable: {
      type: Boolean,
      default: false
    },
    // В режиме редактирования (editable = true) доступно только удаление строк
    onlyRemove: {
      type: Boolean,
      default: false
    },
    // Валидатор удаления строки. (true - успех, иначе - текст ошибки)
    // Асинхронная функция
    onRemove: {
      type: Function,
      default: (row, rowIndex) => true
    },
    // Валидатор редактирования строки (true - успех, иначе - текст ошибки)
    // Асинхронная функция
    onEdit: {
      type: Function,
      default: (row, rowIndex) => true
    },
    // Валидатор сохранения строки. (true - успех, иначе - текст ошибки)
    // Асинхронная функция
    onSave: {
      type: Function,
      default: (row, rowIndex) => true
    },
    // Обработчик отмены редактирования строки (возвращаемое значение роли не играет)
    // Асинхронная функция
    onRollback: {
      type: Function,
      default: (row, rowIndex) => true
    },
  },
  data() {
    return {
      // Направление сортировки столбца
      sortDir: false,
      // Название поля сортируемого столбца
      sortField: null,
      // Флаг редактирования строки
      editing: false,
      // Значение ключевого поля редактируемой строки
      editingRowKey: null
    };
  },
  methods: {
    // Метод проводит валидацию действия для элемента управления строкой таблицы
    async controlAction(ev, type, success) {
      // Сам элемент текущей строки
      let row = ev.target.parentNode.parentNode;
      // Индекс текущей строки в исходном массиве this.rows
      let rowIndex = this.rows.indexOf(
        this.sortedRows[Array.prototype.indexOf.call(row.parentNode.children, row) - 1]
      );
      let errorMessage = await this[type](row, rowIndex);
      if (errorMessage === true) {
        // Валидация успешно пройдена
        success(row, rowIndex);
      } else {
        if (errorMessage === false) {
          // Если вернули не сообщение, а просто false,
          // то отменяем действие без сообщения об ошибке
          return;
        }
        // Выводим сообщение об ошибке
        new Vue.options.components.Tooltip({
          propsData: {
            text: errorMessage,
            element: ev.target.parentNode,
            borderColor: '#bb0000'
          }
        }).mountToDocument();
      }
    },
    remove(ev) {
      /*
        Вызываем обработчик onRemove, возвращаемое значение которого определяет
        возможность выполнения действия - удаления строки. В случае, если обработчик
        onRemove вернёт значение отличное от true, действие (3й аргумент) не будет выполнено,
        а также будет выведено сообщение с текстовым представление возвращаемого значения
        из обработчика onRemove
      */
      this.controlAction(ev, 'onRemove', (row, rowIndex) => {
        this.rows.splice(rowIndex, 1);
        this.$emit('update', this.rows);
      });
    },
    edit(ev) {
      this.controlAction(ev, 'onEdit', (row, rowIndex) => {
        // Включаем режим редактирование таблицы
        this.$el.classList.add('data-table_editing');
        // Помечаем редактируемую строку таблицы
        row.classList.add('data-table__editing-target');
        // Включаем режим редактирования
        this.editing = true;
        // Запоминаем значение ключевого поля редактируемой строки
        this.editingRowKey = this.rows[rowIndex][this.keyField];
      });
    },
    save(ev) {
      this.controlAction(ev, 'onSave', (row, rowIndex) => {
        // Заканчиваем редактирование
        this.editing = false;
        // Выключаем режим редактирования таблицы
        this.$el.classList.remove('data-table_editing');
        // Снимаем с редактируемого ряда метку
        row.classList.remove('data-table__editing-target');
        // Обновляем данные
        let rowObject = this.rows[rowIndex];
        Array.prototype.forEach.call(row.querySelectorAll(`.data-table__cell`), (cell, colIndex) => {
          rowObject[this.columns[colIndex].field] = cell.textContent;
        });
        this.$emit('update', this.rows);
      });
    },
    rollback(ev) {
      let row = ev.target.parentNode.parentNode;
      let rowIndex = Array.prototype.indexOf.call(row.parentNode.children, row) - 1;
      // Заканчиваем редактирование
      this.editing = false;
      // Выключаем режим редактирования таблицы
      this.$el.classList.remove('data-table_editing');
      // Снимаем с редактируемого ряда метку
      row.classList.remove('data-table__editing-target');
      // Откатываем данные
      let cells = Array.prototype.slice.call(row.children, 1);
      cells.forEach((cell, colIndex) =>
        this.columns[colIndex].computed
          ? null
          : cell.textContent = this.rows[rowIndex][this.columns[colIndex].field]
      );
    },
    // Вывести содержимое ячейки в одну строку с троеточием в конце? 
    isNoWrapCell(row, col) {
      return !(this.editing && row[this.keyField] == this.editingRowKey) && col.overflow  == 'nowrap';
    },
    // Возвращает содержимое директивы v-tooltip для конкретной ячейки
    getTooltip(row, col) {
      return col.computed
        ? null
        : this.isNoWrapCell(row, col)
          ? row[col.field].length >= +col.tooltip
            ? row[col.field]
            : null
          : null;
    }
  },
  computed: {
    // Отсортированные данные
    sortedRows() {
      return this.sortField == null
        ? this.rows
        : this.rows.concat().sort((a, b) =>
          (
            a[this.sortField] > b[this.sortField]
              ? 1
              : a[this.sortField] == b[this.sortField]
                ? 0
                : -1
          ) * (this.sortDir ? 1 : -1)
        );
    }
  },
  create() {
    // Кэшируем изображение при загрузке компонента
    //new Image().src = require('Assets/images/DataTable/save.svg');
  },
  mounted() {
    this.$el.addEventListener('click', ev => {
      let target = ev.target;
      if (!this.editing && target.classList.contains('data-table__header-cell')) {
        // Сортировка по столбцу
        let colIndex = Array.prototype.indexOf.call(target.parentNode.children, target);
        if (!this.columns[colIndex].canSort || this.columns[colIndex].computed)
          return;
        if (this.sortField == this.columns[colIndex].field) {
          this.sortDir = !this.sortDir
        } else {
          this.sortField = this.columns[colIndex].field;
          this.sortDir = false;
        }
      }
    });
  }
}