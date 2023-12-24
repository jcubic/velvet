import { StyleSheet, inject, style } from '../velvet';

describe('Style injection', () => {
    let injections: Array<(purge?: true) => void>;
    beforeEach(() => {
        injections = [];
    });
    afterEach(() => {
        injections.forEach(fn => {
            fn(true);
        });
    });
    const test_style = (style: HTMLStyleElement, re: RegExp) => {
        const text = style.innerHTML;
        expect([text, re, re.test(text)]).toEqual([text, re, true]);
    };
    it('should create empty style', () => {
        const styles = StyleSheet.create({
            empty: {}
        });
        injections.push(inject(styles.empty, { debug: true }));
        const $style = document.head.querySelector('style');
        expect($style).not.toBe(null);
        test_style($style!, /^\.velvet-[0-9a-f]+ \{\}$/);
    });
    it('should not create debug info', () => {
        const styles = StyleSheet.create({
            empty: {}
        });
        injections.push(inject(styles.empty));
        const $style = document.head.querySelector('style');
        expect($style).not.toBe(null);
        expect($style?.innerHTML).toEqual('');
    });
    it('should create proper Selector', () => {
        const styles = StyleSheet.create({
            empty: {}
        });
        injections.push(inject(styles.empty, { debug: true }));
        const $style = document.head.querySelector('style');
        test_style($style!, new RegExp(`^\\.${styles.empty} \\{\\}$`));
    });
    it('should create basic style', () => {
        const styles = StyleSheet.create({
            header: {
                color: 'red',
                background: 'black'
            }
        });
        injections.push(inject(styles.header, { debug: true }));
        const $style = document.head.querySelector('style');
        test_style($style!, /^\.velvet-[0-9a-f]+ \{color: red; background: black;\}$/);
    });
    it('should not modify the style', () => {
        const styles = StyleSheet.create({
            header: {
                color: 'red',
                background: 'black'
            }
        });
        injections.push(inject(styles.header, { debug: true }));
        injections.push(inject(styles.header, { debug: true }));
        const $style = document.head.querySelector('style');
        test_style($style!, /^\.velvet-[0-9a-f]+ \{color: red; background: black;\}$/);
    });
    it('should create single style', () => {
        const class_name = style({
            color: 'red',
            background: 'black'
        });
        injections.push(inject(class_name, { debug: true }));
        const $style = document.head.querySelector('style');
        test_style($style!, new RegExp(`^.${class_name} \\{color: red; background: black;\\}$`));
    });
    it('should trhow error when no style created', () => {
        expect(() => {
            injections.push(inject('velvet-hello', { debug: true }));
        }).toThrow();
    });
    it('should create nonce', () => {
        const class_name = style({
            color: 'red',
            background: 'black'
        });
        const nonce = 'FFFFFFF';
        injections.push(inject(class_name, { debug: true, nonce }));
        const $style = document.head.querySelector('style');
        test_style($style!, new RegExp(`^.${class_name} \\{color: red; background: black;\\}$`));
        expect($style!.nonce).toEqual(nonce);
    });
    it('should create CSS Variables', () => {
        const class_name = style({
            '--color': 'red',
            '--background': 'black'
        });
        injections.push(inject(class_name, { debug: true }));
        const $style = document.head.querySelector('style');
        test_style($style!, new RegExp(`^.${class_name} \\{--color: red; --background: black;\\}$`));
    });
    it('should create multiple styles', () => {
        const styles = StyleSheet.create({
            header: {
                color: 'red',
                background: 'black'
            },
            title: {
                fontSize: '40px'
            },
            text: {
                fontFamily: 'monospace',
                background: '#000',
                color: '#ccc'
            },
        });
        injections.push(inject(styles.header, { debug: true }));
        injections.push(inject(styles.title, { debug: true }));
        injections.push(inject(styles.text, { debug: true }));
        const $style = document.head.querySelector('style');
        test_style($style!, new RegExp(
            [
                `^\\.${styles.header} \\{color: red; background: black;\\}`,
                `\\.${styles.title} \\{font-size: 40px;\\}`,
                `\\.${styles.text} \\{font-family: monospace; background: #000; color: #ccc;\\}$`,
            ].join('\\n')
        ));
    });
});
