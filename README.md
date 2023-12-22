<h1 align="center">
  <img src="https://github.com/jcubic/velvet/blob/master/.github/assets/logo.svg?raw=true"
       width="300"
       alt="Logo of Velvet library - it represents a Yellow Banana and Text Velvet with the name of the library" />
</h1>

Vanilla JavaScript Universal CSS in JS library

Similar to Facebook styleX but run it's not a compiler only library that runs at runtime.
It's also library agnostic. Inspired by React Native StyleSheet API and compatible with
strict CSP (Content Security Policy) and nonce.

## Installation

```
npm install velvet-style
```

## Usage

Using with ReactJS and static stylesheet:

```javascript
import { Stylesheet } from 'velvet-style';

const styles = StyleSheet.create({
    header: {
      color: red
    }
});

const Header = ({title}) => {
  useEffect(() => {
     return styles.header.inject(nonce);
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
import { style } from 'velvet-style';

const Button = ({color, title}) => {
   const className = useRef();
   useEffect(() => {
      className.current = style({ color });
      return className.current.inject(nonce);
   }, [color]);

   return (
     <button className={className.current}>{title}</button>
   );
};
```

## License

Released with [MIT](http://opensource.org/licenses/MIT) license<br/>
Copyright (c) 2023 [Jakub T. Jankiewicz](https://jakub.jankiewicz.org)
