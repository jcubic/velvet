<h1 align="center">
  <img src="https://github.com/jcubic/velvet/blob/master/.github/assets/logo.svg?raw=true"
       width="300"
       alt="Logo of Velvet library - it represents a Yellow Banana and Text Velvet with the name of the library" />
</h1>

Vanilla JavaScript Universal CSS in JS library

Similar to [Facebook styleX](https://stylexjs.com/) but it's not a compiler only
library that executes at runtime.  It's also library agnostic. Inspired by React Native
[StyleSheet API](https://reactnative.dev/docs/stylesheet) and compatible with strict *CSP*
([Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)) and
nonce.

**NOTE**: This library is a placeholder. The code below is how the API will look like.
The code is not yet public and it's in experimental stage. But the proof of concept
is working.

## TODO
- [x] Reserve npm name
- [x] Write the code according to API
- [ ] Write unit tests using Jest
- [x] Use TypeScript
- [x] Make ESM, CJS, UDM libraries
- [ ] Build when publish with package.json
- [ ] Create Live Demo [CodePen]
- [ ] Add blog post about the story and about the logo origin
- [ ] GitHub actions
  - [ ] Build
  - [ ] Coveralls

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

Usage with Vanilla JavaScript

```javascript
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
```

## License

Released with [MIT](http://opensource.org/licenses/MIT) license<br/>
Copyright (c) 2023 [Jakub T. Jankiewicz](https://jakub.jankiewicz.org)
