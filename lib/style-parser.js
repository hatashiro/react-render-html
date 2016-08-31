var camelcase = require('camelcase');
var uppercamelcase = require('uppercamelcase');

function convertKey(key) {
  var vendorPrefixed = key.indexOf('-webkit-') === 0 ||
                       key.indexOf('-moz-') === 0 ||
                       key.indexOf('-o-') === 0;
  return vendorPrefixed ? uppercamelcase(key) : camelcase(key);
}

module.exports = function styleParser(styleStr) {
  return styleStr
    .split(';')
    .reduce(function (obj, str) {
      var tokens = str.split(':');
      var key = tokens[0].trim();
      if (key) {
        var value = tokens[1].trim();
        obj[convertKey(key)] = value;
      }
      return obj;
    }, {});
};
