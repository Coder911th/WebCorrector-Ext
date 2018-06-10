// Vuex-хранилище состояний
let store = null;

// Возвращает перевод фразы по переданному словарю
function getTranslate(dict, phrase) {
  return dict[phrase] == undefined
    ? phrase
    : dict[phrase];
}

// Интерфейс для локализации
function localize(phrase) {
  switch (store.lang) {
    case 'RU': return phrase;
    case 'EN': return getTranslate(EN, phrase); break;
    default: return phrase;
  }
}

// Словарь
let EN = {
  'Все скрипты': 'All scripts',
  'Этот сайт': 'This site',
  'Настройки': 'Settings',
  'Открыть редактор кода': 'Open Code Editor',
  'Поиск': 'Search',
  'Не обнаружено ни одного скрипта': 'No script found',
  'Хотя бы один флаг должен быть выбран': 'At least one flag must be selected',
  'По названию': 'By name',
  'По сайту': 'By site',
  'По Security key (точное совпадение)': 'By Security key (exact match)',
  'Ложкин Дмитрий': 'Lozhkin Dmitry',
  'Расширение': 'Extension',
  'Новый скрипт': 'New script',
  'Список библиотек': 'List of Libraries',
  'Данные библиотеки будут доступны для подключения перед загрузкой скриптов.': 'These libraries will be available for connection before loading scripts.',
  'Псевдоним': 'Alias',
  'URL библиотеки': 'Library URL',
  'Добавить': 'Add',
  'Нет ни одной библиотеки': 'There are no libraries available',
  'уже присутствует в таблице': 'already exists in the table',
  'Библиотека успешно добавлена': 'Library successfully added',
  'Данная библиотека используется в скрипте под названием': 'This library is used in a script called',
  'Был изменён URL-адрес библиотеки': 'The URL of the library was changed',
  'У всех скриптов, использующих данную библиотеку обновится значение ключа безопасности.<br>Сохранить изменения?': 'All scripts that use this library will update the value of the security key. <br> Save changes?',
  'Информация о скрипте': 'Information about the script',
  'Название': 'Name',
  'Подключаемые библиотеки': 'Connected Libraries',
  '<b>Редактор кода</b><div style="margin-bottom: 5px">Нажмите ESC, чтобы выйти из режима редактирования.</div><div>Ctrl+Space - автодополнение.</div>': '<b> Code Editor</b><div style="margin-bottom: 5px">Press ESC to exit edit mode.</div><div>Ctrl + Space - auto-completion.</div>',
  'Данные были изменены': 'Data has been changed',
  'Вы уверены, что хотите отменить все сделанные изменения?': 'Are you sure you want to discard all changes made?',
  'Скрипт успешно создан!': 'The script was created successfully!',
  'Сохранение прошло успешно!': 'Saving was successful!',
  'Новый ключ безопасности': 'New security key',
  'Удаление скрипта': 'Deleting a script',
  'Вы уверены, что хотите удалить скрипт?': 'Are you sure you want to delete the script?',
  'Скрипт': 'Script',
  'успешно удалён': 'successfully deleted',
  'Да': 'Yes',
  'Нет': 'No',
  'Это поле обязательно для заполнения!': 'This field is required!',
  '<div>Регулярное выражение, определяющее сайты, на которых будет автоматически срабатывать данный скрипт.</div><div style="margin-top: 5px">Пустое поле означает невозможность автоматически подгружать данный скрипт на сайты. Только вручную.</div>': '<div>A regular expression that defines the sites on which this script will fire automatically.</div><div style="margin-top: 5px">An empty field indicates the inability to automatically load this script to sites. Only manually.</div>',
  'Состояние:': 'Status:',
  'В целях безопасности данное расширение работает только на сайтах, работающих по протоколам http/https!': 'For security reasons, this extension works only on sites that use the http/https protocols!',
  'Редактировать': 'Edit',
  'Удалить': 'Remove',
  'Сохранить': 'Save',
  'Отмена': 'Cancel'
};

// Выносим функцию локализации в глобалью область
window.lc = localize;

export default function(states) {
  store = states;
};