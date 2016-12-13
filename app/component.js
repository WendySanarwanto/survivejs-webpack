var styles = require('./component.scss');

module.exports = function () {
  var element = document.createElement('div');

  element.innerHTML = '<div class="header">Hello Webpack</div>';
  element.innerHTML += '<div><img src="../assets/images/webpack-logo-600x419.gif" alt=""></div>';
  element.innerHTML += '<hr/>';
  element.innerHTML += '<form class="form-entry">'+
                       '<label for="#greet"><span>Entry your name here </span></label>'+
                       '<input type="text" id="greet">' +
                       '<button type="submit" class="pure-button pure-button-primary">Submit</button>'+
                       '</form>';

  element.className = styles.component;

  return element;
};