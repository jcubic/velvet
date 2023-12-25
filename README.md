<h1 align="center">
  <img src="https://github.com/jcubic/velvet/blob/master/.github/assets/logo.svg?raw=true"
       width="300"
       alt="Logo of Velvet library - it represents a Yellow Banana and Text Velvet with the name of the library" />
</h1>

[![npm](https://img.shields.io/badge/npm-0.2.1-blue.svg)](https://www.npmjs.com/package/velvet-style)
[![build and test](https://github.com/jcubic/velvet/actions/workflows/test.yaml/badge.svg)](https://github.com/jcubic/velvet/actions/workflows/test.yaml)
[![Coverage Status](https://coveralls.io/repos/github/jcubic/velvet/badge.svg?branch=master)](https://coveralls.io/github/jcubic/velvet?branch=master)

[Simple Vanilla JavaScript Universal CSS in JS library](https://github.com/jcubic/velvet/)

Similar to [Facebook styleX](https://stylexjs.com/) but it's not a compiler only
library that executes at runtime.  It's also library agnostic. Inspired by React Native
[StyleSheet API](https://reactnative.dev/docs/stylesheet) and compatible with strict *CSP*
([Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)) and
nonce.

[Live Demo](https://jcubic.github.io/velvet/)

## Installation

```
npm install velvet-style
```

## Usage

Using ReactJS and static stylesheet:

```javascript
import { useEffect } from 'react';
import { Stylesheet, inject } from 'velvet-style';

const styles = StyleSheet.create({
    header: {
      color: red
    }
});

const Header = ({title}) => {
  useEffect(() => {
     return inject(styles.header, { nonce });
  }, []);

  return (
    <h1 className={styles.header}>
      {title}
    </h1>
  );
}
```

With dynamic style:

```javascript
import { useEffect } from 'react';
import { style, inject } from 'velvet-style';

const Button = ({color, title}) => {
   const className = useRef();
   useEffect(() => {
      className.current = style({ color });
      return inject(className.current, { nonce });
   }, [color]);

   return (
     <button className={className.current}>{title}</button>
   );
};
```

Usage in browser with Vanilla JavaScript

```javascript
// debug will show the nonce and the CSS inside style tag in devtools
const debug = true;

const nonce = '2726c7f26c';

const styles = velvet.StyleSheet.create({
    A: {
        color: 'red'
    },
    B: {
        color: 'darkblue'
    }
});

function create_p(class_name, text) {
    const p = document.createElement('p');
    p.innerText = text;
    p.classList.add(class_name);
    velvet.inject(class_name, { nonce, debug });
    document.body.appendChild(p);
}

create_p(styles.A, 'Hello');
create_p(styles.B, 'World');

const class_name = velvet.style({
    background: 'black',
    color: '#ccc',
    fontFamily: 'monospace'
});

create_p(class_name, 'Hello World');

```

Usage with Web Components:

```html
<script>
function tag(name, class_name, text) {
  const p = document.createElement(name);
  p.innerText = text;
  p.classList.add(class_name);
  return p;
}

class HelloWorld extends window.HTMLElement {
  constructor() {
    super();
    this.name = 'World';
    this.color = 'red';
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    const class_name = velvet.style({
     color: this.color
    });
    const p = tag('p', class_name, `Hello ${this.name}`);
    shadow.appendChild(p);
    velvet.inject(class_name, { debug: true, target: shadow });
  }

  attributeChangedCallback(property, oldValue, newValue) {
    if (oldValue === newValue) return;
    this[ property ] = newValue;
  }

  static get observedAttributes() {
    return ['name', 'color'];
  }
}

window.customElements.define('hello-world', HelloWorld);
const hello = document.createElement('hello-world');
document.body.appendChild(hello);
</script>

<hello-world name="Velvet" color="blue"></hello-world>
```

## License

Released with [MIT](http://opensource.org/licenses/MIT) license<br/>
Copyright (c) 2023 [Jakub T. Jankiewicz](https://jakub.jankiewicz.org)
