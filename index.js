'use strict';

var htmlParser = require('parse5');
var React = require('react');
var convertAttr = require('react-attr-converter');

var renderNode = function (node, key) {
  if (node.nodeName === '#text') {
    return node.value;
  }

  var attr = node.attrs.reduce(function (result, attr) {
    result[convertAttr(attr.name)] = attr.value;
    return result;
  }, {key: key});

  if (node.childNodes.length === 0) {
    return React.createElement(node.tagName, attr);
  } else {
    var children = node.childNodes.map(renderNode);
    return React.createElement(node.tagName, attr, children);
  }
};

var renderHTML = function (html) {
  var htmlAST = htmlParser.parseFragment(html);

  if (htmlAST.childNodes.length === 0) {
    return null;
  }

  var result = htmlAST.childNodes.map(renderNode);

  return result.length === 1 ? result[0] : result;
};

module.exports = renderHTML;
module.exports.renderHTML = renderHTML;
