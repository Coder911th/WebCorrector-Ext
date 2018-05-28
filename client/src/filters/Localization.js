// Фильтр локализации для Vue
export default {
  name: 'lc',
  handler(phrase) {
    return window.lc(phrase);
  }
};