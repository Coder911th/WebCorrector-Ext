<!-- Таблица с данными -->
<template>
  <div :class="[
    'data-table', 
    {
      'data-table_to-top': sortField != null && sortDir,
      'data-table_to-bottom': sortField != null && !sortDir,
      'data-table_hover-highlight': hoverHighlight,
      'data-table_editable': editable
    }
  ]">
    <!-- Заголовок таблицы -->
    <div
      v-if="!hideCaption"
      class="data-table__header-row"
    >
      <div
        v-for="col of columns"
        v-if="!col.hidden"
        :key="col.field"
        :class="[
          'data-table__header-cell',
          {
            'data-table__header-cell_can-sort': col.canSort,
            'data-table__header-cell_sort-target': sortField == col.field
          }
        ]"
        :style="{
          width: col.width,
          textAlign: col.headerAlign
        }"
      >{{col.caption}}</div>
    </div>
    <!-- Строки таблицы -->
    <template v-if="rows.length">
      <div
        v-for="row of sortedRows"
        :key="row[keyField]"
        class="data-table__row"
      >
        <!-- Элементы управления строкой -->
        <div
          v-if="editable"
          class="data-table__row-options"
          :style="{ width: onlyRemove ? '30px' : null }" 
        >
          <!-- Редактирование -->
          <IconButton
            v-if="!editing && !onlyRemove"
            icon="icon-pencil"
            color="rgb(48, 74, 187)"
            size="1.1em"
            @click="edit"
          />
          <!-- Удаление -->
          <IconButton
            v-if="!editing"
            icon="icon-trash-empty"
            color="rgb(211, 36, 36)"
            size="1.1em"
            @click="remove"
          />
          <!-- Сохранение -->
          <IconButton
            v-if="editing"
            icon="icon-floppy"
            color="#1842a5"
            size="1.32em"
            @click="save"
          />
          <!-- Отмена -->
          <IconButton
            v-if="editing"
            icon="icon-forward"
            color="rgb(211, 36, 36)"
            size="1.1em"
            @click="rollback"
          />
        </div>
        <!-- Ячейки таблицы -->
        <div
          v-for="col of columns"
          v-if="!col.hidden"
          v-tooltip="getTooltip(row, col)"
          :key="col.field"
          class="data-table__cell"
          :style="{
            width: col.width,
            wordWrap: isNoWrapCell(row, col) ? null : 'break-word',
            textOverflow: isNoWrapCell(row, col) ? 'ellipsis' : null,
            whiteSpace: isNoWrapCell(row, col) ? 'nowrap' : null,
            textAlign: col.align,
            cursor: editing && row[keyField] == editingRowKey &&
              !col.computed ? 'auto' : null
          }"
          :contenteditable="editing && row[keyField] == editingRowKey && !col.computed"
          @input="$event.target.textContent = $event.target.textContent"
        >
          <slot v-if="col.computed" :name="col.field" :row="row"/>
          <template v-else>{{row[col.field]}}</template>
        </div>
      </div>
    </template>
    <div
      v-else
      class="data-table__empty-table-message"
    >{{emptyTableText}}</div>
  </div>
</template>
<script src="./DataTable.js"></script>
<style src="./DataTable.scss" lang="scss"></style>