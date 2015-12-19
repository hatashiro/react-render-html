'use strict';

let htmlParser = require('parse5');
let React = require('react');
let convertAttr = require('react-attr-converter');

let renderNode = (node, key) => {
  if (node.nodeName === '#text') {
    return node.value;
  }

  let attr = node.attrs.reduce((result, attr) => {
    result[convertAttr(attr.name)] = attr.value;
    return result;
  }, {key});

  let children = node.childNodes.map(renderNode);
  return React.createElement(node.tagName, attr, children);
};

let renderHTML = (html) => {
  let htmlAST = htmlParser.parseFragment(html);

  if (htmlAST.childNodes.length === 0) {
    return null;
  }

  let result = htmlAST.childNodes.map(renderNode);

  return result.length === 1 ? result[0] : result;
};

module.exports = renderHTML;
module.exports.renderHTML = renderHTML;
