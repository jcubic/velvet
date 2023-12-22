<h1 align="center">
  <img src="https://github.com/jcubic/velvet/blob/master/.github/assets/logo.svg?raw=true"
       width="300"
       alt="Logo of Velvet library - it represents a Yellow Banana and Text Velvet with the name of the library" />
</h1>

[![npm](https://img.shields.io/badge/npm-0.1.2-blue.svg)](https://www.npmjs.com/package/velvet-style)

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

## TODO
- [x] Reserve npm name
- [x] Write the code according to API
- [ ] Write unit tests using Jest
- [x] Use TypeScript
- [x] Make ESM, CJS, UDM libraries
- [x] Build when publish with package.json
- [x] Create Live Demo
- [ ] Add blog post about the story and about the logo origin
- [ ] GitHub actions
  - [ ] Build
  - [ ] Coveralls

## License

Released with [MIT](http://opensource.org/licenses/MIT) license<br/>
Copyright (c) 2023 [Jakub T. Jankiewicz](https://jakub.jankiewicz.org)
