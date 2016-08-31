var camelcase = require('camelcase');

module.exports = function styleParser(styleStr) {
  return styleStr
    .split(';')
    .reduce(function (obj, str) {
      var tokens = str.split(':');
      var key = tokens[0].trim();
      if (key) {
        var value = tokens[1].trim();
        obj[camelcase(key)] = value;
      }
      return obj;
    }, {});
};
