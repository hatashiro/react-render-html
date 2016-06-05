'use strict';

import test from 'ava';
import * as ReactDOMServer from 'react-dom/server';
import renderHTML from '../index';

let renderTest = (t, reactEl, expectedHTML) => {
  t.is(ReactDOMServer.renderToStaticMarkup(reactEl), expectedHTML);
};

let singeElementTest = (t, html) => {
  renderTest(t, renderHTML(html), html);
};

test('returns a single React element rendering a provided HTML', t => {
  singeElementTest(t, '<ul>' +
                        '<li><a class="hello" href="https://github.com">hihi</a></li>' +
                        '<li><p><b>hello</b>world</p><p>react</p></li>' +
                      '</ul>');
});

test('returns an array of React elements if several nodes are provided', t => {
  let arr = renderHTML('<li><a class="hello" href="https://github.com">hihi</a></li>' +
                       '<li><p><b>hello</b>world</p><p>react</p></li>');
  t.is(arr.length, 2);
  renderTest(t, arr[0], '<li><a class="hello" href="https://github.com">hihi</a></li>');
  renderTest(t, arr[1], '<li><p><b>hello</b>world</p><p>react</p></li>');
});
