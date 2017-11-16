# react-render-html [![travis-ci](https://travis-ci.org/utatti/react-render-html.svg)](https://travis-ci.org/utatti/react-render-html)

Render HTML as React element, possibly replacing dangerouslySetInnerHTML

## Motivation
If you have a string containing HTML, and you attempt to render it inside of a JSX element, React will _escape_ the HTML; the user will end up seeing the HTML source code (rather than the desired UI elements).  This is to prevent XSS attacks, but it can be frustrating when you _want_ to render such a string to the page.

In order to get around this, we parse the HTML sring into a _node_ (or collection of nodes), which React won't bother escaping.  React can't tell the difference between this node-that-came-from-a-string, and any other vanilla node, so it decides it doesn't need to do any escaping.  We're essentially tricking React into thinking it hasn't been passed something that it needs to escape.


## How it works

It renders a provided HTML string into a React element.

If you have a
```js
import renderHTML from 'react-render-html';

renderHTML("<a class='github' href='https://github.com'><b>GitHub</b></a>")
// => React Element
//    <a className="github" href="https://github.com"><b>GitHub</b></a>
```

It may be used in the `render` method in a React component:

```js
let App = React.createClass({
  render() {
    return (
      <div className='app'>
        {renderHTML(someHTML)}
      </div>
    );
  }
});
```

Or just by itself
```js
ReactDOM.render(renderHTML(someHTML), document.getElementById('app'));
```

If a provided HTML contains several top-level nodes, the function will return
an array of React elements.

```js
renderHTML('<li>hello</li><li>world</li>');
// => [React Element <li>hello</li>, React Element <li>world</li>]
```

## Pros and cons

### Pros

- Can make use of React's reconciliation for plain HTML too
- Fully compatible with JSX

### Cons

- It uses [parse5](https://github.com/inikulin/parse5) to parse HTML, which can
  result in large bundle size
- Can result in slower rendering speed, mainly for parsing

## Install

Install with NPM:

```
npm i --save react-render-html
```

Import with CommonJS or whatever:

```js
const renderHTML = require('react-render-html');

import renderHTML from 'react-render-html';
```

## A bug!

When a bug is found, please report them in [Issues](https://github.com/utatti/react-render-html/issues).

Also, any form of contribution(especially a PR) will absolutely be welcomed :beers:

## License

[MIT](LICENSE)
