import { StyleSheet, inject } from '../velvet';

describe('StyleSheet', () => {
    let injections: Array<(purge?: true) => void>;
    beforeEach(() => {
        injections = [];
    });
    afterEach(() => {
        injections.forEach(fn => {
            fn();
        });
    });
    const test_style = (style: HTMLStyleElement, re: RegExp) => {
        const text = style.innerHTML;
        expect([text, re.test(text)]).toEqual([text, true]);
    };
    it('should create empty style', () => {
        const styles = StyleSheet.create({
            empty: {}
        });
        injections.push(inject(styles.empty, { debug: true }));
        const style = document.head.querySelector('style');
        expect(style).not.toBe(null);
        test_style(style!, /^\.velvet-[0-9a-f]+ \{\}$/);
    });
    it('should create proper Selector', () => {
        const styles = StyleSheet.create({
            empty: {}
        });
        injections.push(inject(styles.empty, { debug: true }));
        const style = document.head.querySelector('style');
        test_style(style!, new RegExp(`^\\.${styles.empty} \\{\\}$`));
    });
    it('should create basic style', () => {
        const styles = StyleSheet.create({
            header: {
                color: 'red',
                background: 'black'
            }
        });
        injections.push(inject(styles.header, { debug: true }));
        const style = document.head.querySelector('style');
        test_style(style!, /^\.velvet-[0-9a-f]+ \{color: red; background: black;\}$/);
    });
});
