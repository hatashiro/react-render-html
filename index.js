'use strict';

const htmlParser = require('parse5');
const React = require('react');
const convertAttr = require('react-attr-converter');
const styleParser = require('./lib/style-parser');

const renderNode = function (node, key) {
  if (node.nodeName === '#text') {
    return node.value;
  }

  if (node.nodeName === '#comment') {
    return node.value;
  }

  const attr = node.attrs.reduce((result, attr) => {
    const name = convertAttr(attr.name);
    result[name] = name === 'style' ? styleParser(attr.value) : attr.value;
    return result;
  }, {key});

  if (node.childNodes.length === 0) {
    return React.createElement(node.tagName, attr);
  }

  const children = node.childNodes.map(renderNode);
  return React.createElement(node.tagName, attr, children);
};

const renderHTML = function (html) {
  const htmlAST = htmlParser.parseFragment(html);

  if (htmlAST.childNodes.length === 0) {
    return null;
  }

  const result = htmlAST.childNodes.map(renderNode);

  return result.length === 1 ? result[0] : result;
};

module.exports = renderHTML;
