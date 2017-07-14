var camelcase = require('camelcase');

function convertKey(key) {
  var res = camelcase(key);

  if (key.indexOf('-webkit-') === 0 ||
      key.indexOf('-moz-') === 0 ||
      key.indexOf('-o-') === 0) {
    res = res[0].toUpperCase() + res.slice(1);
  }

  return res;
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
