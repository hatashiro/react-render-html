var camelcase = require('camelcase');
var uppercamelcase = require('uppercamelcase');

function convertKey(key) {
  var vendorPrefixed = key.indexOf('-webkit-') === 0 ||
                       key.indexOf('-moz-') === 0 ||
                       key.indexOf('-o-') === 0;
  return vendorPrefixed ? uppercamelcase(key) : camelcase(key);
}

module.exports = function (styleStr) {
  return styleStr
    .split(';')
    .reduce(function (res, token) {
      if (token.slice(0, 7) === 'base64,') {
        res[res.length - 1] += ';' + token;
      } else {
        res.push(token);
      }
      return res;
    }, [])
    .reduce(function (obj, str) {
      var tokens = str.split(':');
      var key = tokens[0].trim();
      if (key) {
        var value = tokens.slice(1).join(':').trim();
        obj[convertKey(key)] = value;
      }
      return obj;
    }, {});
};
