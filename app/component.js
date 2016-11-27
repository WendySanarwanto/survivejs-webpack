var styles = require('./component.css');

module.exports = function () {
  var element = document.createElement('h1');

  element.innerHTML = '<div class="header">Hello Webpack</div>';
  element.innerHTML += '<hr/>';
  element.innerHTML += '<form class="form-entry">'+
                       '<label for="#greet"><span>Entry your name here </span></label>'+
                       '<input type="text" id="greet">' +
                       '</form>';

  element.className = styles.component;

  return element;
};