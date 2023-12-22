import hash from './crc32';

const __DEBUG__ = false;

type Style = Partial<CSSStyleDeclaration>;

type StyleSheet<T> = {
    readonly [key in keyof T]: Style
};

type ClassName = `velvet-${string}`;

type ClassMapping<T> = {
    readonly [key in keyof T]: ClassName
};

// The hash of the CSS in form of a class is keep as key, each time when we call inject
// we increase the ref number and when destroy is called (fuction return from inject)
// the ref is decreased when ref reach zero, the style is Removed from DOM
const cache = new Map<ClassName, {ref: number, $style: HTMLStyleElement}>();

const make_style = () => {
    return document.createElement('style');
};

const empty_rule = (sheet: CSSStyleSheet, class_name: string) => {
    const index = sheet.cssRules.length;
    sheet.insertRule(`.${class_name} { }`, index);
    return sheet.cssRules[index];
}

const set_css = (sheet: CSSStyleSheet, class_name: string, style: Style) => {
    const selector = `.${class_name}`;
    let rule = [...sheet.cssRules].find(rule => {
        return rule instanceof CSSStyleRule && rule.selectorText === selector;
    });
    if (!rule) {
        rule = empty_rule(sheet, class_name);
    }
    if (rule instanceof CSSStyleRule) {
        Object.assign(rule.style, style);
    }
};

const dump_css = (sheet: CSSStyleSheet) => {
    return [...sheet.cssRules].map(rule => rule.cssText).join('\n')
};

export const StyleSheet = {
    create<T>(input: StyleSheet<T>): ClassMapping<T> {
        const pairs: Array<[T, ClassName]> = Object.entries(input).map(([name, style]) => {
            const repr = JSON.stringify(style);
            const class_name: ClassName = `velvet-${hash(repr)}`;
            if (cache.has(class_name)) {
                const obj = cache.get(class_name)!;
                obj.ref++;
            } else {
                const $style = make_style();
                const { sheet } = $style;
                set_css(sheet!, class_name, style as Style);
                if (__DEBUG__) {
                    // by default dynamic style is not visible in devtools
                    $style.innerText = dump_css(sheet!);
                }
                cache.set(class_name, {
                    ref: 1,
                    $style
                });
            }
            return [name as T, class_name as ClassName];
        });
        return Object.fromEntries(pairs);
    }
};

export const inject = (class_name: ClassName, nonce?: string) => {
    if (!cache.has(class_name)) {
        throw new Error(`velvet: style with class ${class_name} not found`);
    }
    const obj = cache.get(class_name)!;
    obj.ref++
    if (nonce) {
        // allow to use strict CSP (Content Security Policy)
        obj.$style.nonce = nonce;
    }
    document.head.appendChild(obj.$style);
    return (purge?: true) => {
        if (cache.has(class_name)) {
            const obj = cache.get(class_name)!;
            obj.ref--;
            // no more references we can remove the style from DOM
            if (obj.ref <= 0) {
                obj.$style.remove();
                if (purge) {
                    // when user decide he can also remove the style object
                    // this is usesfull when the style will never be reused
                    cache.delete(class_name);
                }
            }
        }
    };
};

