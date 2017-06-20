const camelcase = require('camelcase');
const uppercamelcase = require('uppercamelcase');

function convertKey(key) {
  const vendorPrefixed = key.indexOf('-webkit-') === 0 ||
                       key.indexOf('-moz-') === 0 ||
                       key.indexOf('-o-') === 0;
  return vendorPrefixed ? uppercamelcase(key) : camelcase(key);
}

module.exports = styleStr => {
  return styleStr
    .split(';')
    .reduce((obj, str) => {
      const tokens = str.split(':');
      const key = tokens[0].trim();
      if (key) {
        const value = tokens[1].trim();
        obj[convertKey(key)] = value;
      }
      return obj;
    }, {});
};
