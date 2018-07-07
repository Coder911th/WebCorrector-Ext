/* Добавляет компоненту возможность проходить валидацию */

// Рекурсивная функция для проверки валидации потомков
function checkChildren(parent) {
  return (parent.validate ? parent.validateControl() : true) &&
    parent.$children.every(child => 
      (child.validate ? child.validateControl() : true) &&
      child.$children.every(childOfChild => checkChildren(childOfChild))
  );
}

export default {
  props: {
    // Массив функций-валидаторов
    validators: {
      type: Array,
      default: () => [],
      validator(value) {
        return value.every(validator => validator instanceof Function);
      }
    }
  },
  methods: {
    // Производит валидацию контрола c проверкой потомков
    validate() {
      return checkChildren(this);
    },
    // Производит валидацию конкретного контрола без проверки потомков
    validateControl() {
      return this.validators.every(validator => {
        let validationMessage = validator(this);
        if (validationMessage === true)
          return true;
        if (typeof validationMessage == 'string') {
          if (this.$_validation_tooltip) {
            this.$_validation_tooltip.text = validationMessage;
          } else {
            this.vCreate('Tooltip', {
              text: validationMessage,
              element: this.$el,
              borderColor: '#bb0000'
            });
          }
        }
        return false;
      });
    }
  }
};