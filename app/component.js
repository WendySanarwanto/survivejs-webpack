module.exports = function () {
  var element = document.createElement('h1');

  element.innerHTML = '<h1 style="font-family: helvetica-neue;">Hello Webpack</h1>';
  element.innerHTML += '<hr/>';

  return element;
};