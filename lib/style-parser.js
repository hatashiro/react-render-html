const camelcase = require('camelcase');
const uppercamelcase = require('uppercamelcase');

const convertKey = key => {
  const vendorPrefixed = key.indexOf('-webkit-') === 0 ||
                       key.indexOf('-moz-') === 0 ||
                       key.indexOf('-o-') === 0;
  return vendorPrefixed ? uppercamelcase(key) : camelcase(key);
};

module.exports = styleStr => {
  return styleStr
    .split(';')
    .reduce((res, token) => {
      if (token.slice(0, 7) === 'base64,') {
        res[res.length - 1] += ';' + token;
      } else {
        res.push(token);
      }
      return res;
    }, [])
    .reduce((obj, str) => {
      const tokens = str.split(':');
      const key = tokens[0].trim();
      if (key) {
        const value = tokens.slice(1).join(':').trim();
        obj[convertKey(key)] = value;
      }
      return obj;
    }, {});
};
