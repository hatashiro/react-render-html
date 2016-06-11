import test from 'ava';
import React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import renderHTML, {
  applyMiddleware
} from '../lib/index';

const renderTest = (t, reactEl, expectedHTML) => {
  t.is(ReactDOMServer.renderToStaticMarkup(reactEl), expectedHTML);
};

const singleElementTest = (t, html) => {
  renderTest(t, renderHTML(html), html);
};

test('returns a single React element rendering a provided HTML', t => {
  singleElementTest(t, '<ul>' +
                        '<li><a class="hello" href="https://github.com">hihi</a></li>' +
                        '<li><p><b>hello</b>world</p><p>react</p></li>' +
                      '</ul>');
});

test('returns an array of React elements if several nodes are provided', t => {
  const arr = renderHTML('<li><a class="hello" href="https://github.com">hihi</a></li>' +
                       '<li><p><b>hello</b>world</p><p>react</p></li>');
  t.is(arr.length, 2);
  renderTest(t, arr[0], '<li><a class="hello" href="https://github.com">hihi</a></li>');
  renderTest(t, arr[1], '<li><p><b>hello</b>world</p><p>react</p></li>');
});

test('parse the style attribute when specified as a string', t => {
  singleElementTest(t, '<ul>' +
                        '<li style="font-weight:bold;color:green;"><a class="hello" href="https://github.com">hihi</a></li>' +
                        '<li style="font-style:italic;"><p><b>hello</b>world</p><p>react</p></li>' +
                      '</ul>');
});

test('uses the given `renderNode` function', t => {
  const replaceHref = () => next => (node, key) => {
    const element = next(node, key);
    if (node.tagName === 'a') {
      return React.cloneElement(element, {
        href: 'https://example.com'
      });
    }
    return element;
  };
  const htmlElement = renderHTML(
    '<ul>' +
      '<li><a class="hello" href="https://github.com">hihi</a></li>' +
      '<li><p><b>hello</b>world</p><p>react</p></li>' +
    '</ul>',
    replaceHref
  );

  renderTest(
    t,
    htmlElement,
    '<ul>' +
      '<li><a class="hello" href="https://example.com">hihi</a></li>' +
      '<li><p><b>hello</b>world</p><p>react</p></li>' +
    '</ul>'
  );
});

test('can compose `renderNode` functions', t => {
  const replaceHref = () => next => (node, key) => {
    const element = next(node, key);
    if (node.tagName === 'a') {
      return React.cloneElement(element, {
        href: 'https://example.com'
      });
    }
    return element;
  };
  const replacePs = () => next => (node, key) => {
    if (node.tagName === 'p') {
      return React.createElement(node.tagName, {}, 'Redacted');
    }
    return next(node, key);
  };
  const addLi = renderNode => next => (node, key) => {
    const element = next(node, key);
    if (node.tagName === 'ul') {
      return React.cloneElement(
        element,
        {},
        ...node.childNodes.map(renderNode),
        React.createElement('li', {}, 'One more')
      );
    }
    return element;
  };
  const htmlElement = renderHTML(
    '<ul>' +
      '<li><a class="hello" href="https://github.com">hihi</a></li>' +
      '<li><p><b>hello</b>world</p><p>react</p></li>' +
    '</ul>',
    applyMiddleware(replaceHref, replacePs, addLi)
  );

  renderTest(
    t,
    htmlElement,
    '<ul>' +
      '<li><a class="hello" href="https://example.com">hihi</a></li>' +
      '<li><p>Redacted</p><p>Redacted</p></li>' +
      '<li>One more</li>' +
    '</ul>'
  );
});
