import parse5 from 'parse5';
import React from 'react';
import convertAttr from 'react-attr-converter';
import styler from 'react-styling';

const compose = (...fns) => arg => fns.reduceRight((prev, fn) => fn(prev), arg);

function baseRenderNode(renderNode) {
  return (node, key) => {
    if (node.nodeName === '#text') {
      return node.value;
    }

    const props = {
      key,
      ...node.attrs.reduce((attrs, attr) => {
        const name = convertAttr(attr.name);
        return {
          ...attrs,
          [name]: name === 'style' ? styler(attr.value) : attr.value
        };
      }, {})
    };

    const children = node.childNodes.map(renderNode);
    return React.createElement(node.tagName, props, ...children);
  };
}

export function applyMiddleware(...middlewares) {
  return renderNode => (node, key) => {
    const chain = middlewares.map(middleware => middleware(renderNode));
    return compose(...chain)(node, key);
  };
}

export default function renderHTML(html, middleware = () => next => (...args) => next(...args)) {
  const htmlAST = parse5.parseFragment(html);

  if (htmlAST.childNodes.length === 0) {
    return null;
  }

  const finalRenderNode =
    (node, key) => middleware(finalRenderNode)(baseRenderNode(finalRenderNode))(node, key);
  const result = htmlAST.childNodes.map(finalRenderNode);

  return result.length === 1 ? result[0] : result;
}
