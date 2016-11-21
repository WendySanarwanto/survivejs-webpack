var styles = require('./component.css');

module.exports = function () {
  var element = document.createElement('h1');

  element.innerHTML = '<div>Hello Webpack</div>';
  element.className = styles.header;
  element.innerHTML += '<hr/>';

  return element;
};