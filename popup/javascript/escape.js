export function escapeHTML(text) {
  var safe = {
    '>': '&gt;',
    '<': '&lt;',
    '&': '&amp;'
  };
  return text.toString().replace(/[<>&]/g, symbol => safe[symbol]);
}