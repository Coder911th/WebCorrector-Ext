// Набор стандартных валидаторов
export default {
  /*
    Обязательное запонение поля с названием field.
    Начальные и конечные пробелы обрезаются при проверке.
  */
  required(field) {
    return target => {
      if (target[field].toString().trim() == '')
        return lc('Это поле обязательно для заполнения!');
      return true;
    }
  }
};