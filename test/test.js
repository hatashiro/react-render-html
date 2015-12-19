'use strict';

import test from 'ava';
import renderHTML from '../index';
import * as ReactDOMServer from 'react-dom/server';

let renderTest = (t, html) => {
  t.same(ReactDOMServer.renderToStaticMarkup(renderHTML(html)), html);
};

test('react-render-html', t => {
  renderTest(t, '<ul>' +
                  '<li><a class="hello" href="https://github.com">hihi</a></li>' +
                  '<li><p><b>hello</b>world</p><p>react</p></li>' +
                '</ul>');
});
