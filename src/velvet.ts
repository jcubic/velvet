/*
 * Velvet <https://github.com/jcubic/velvet/>
 *
 * Copyright (c) 2023 Jakub T. Jankiewicz <jcubic@onet.pl>
 * Released under MIT license
 */
import hash from './crc32';

type Style = Partial<CSSStyleDeclaration> & {
    [key: `--${string}`]: string | number;
};

type StyleSheet<T> = {
    readonly [key in keyof T]: Style
};

type ClassName = `velvet-${string}`;

type ClassMapping<T> = {
    readonly [key in keyof T]: ClassName
};

interface MapNode {
    ref: number;
    style: Style;
};

const make_style = () => {
    const node = document.createElement('style');
    node.classList.add('velvet');
    return node;
};

const empty_rule = (sheet: CSSStyleSheet, class_name: string) => {
    const index = sheet.cssRules.length;
    sheet.insertRule(`.${class_name} { }`, index);
    return sheet.cssRules[index];
};

const dash_name = (property: string) => {
    return property.replace(/([A-Z])/g, (_, char) => {
        return `-${char}`;
    }).toLowerCase();
}

const set_css = (sheet: CSSStyleSheet, class_name: string, style: Style) => {
    const selector = `.${class_name}`;
    let rule = [...sheet.cssRules].find(rule => {
        return rule instanceof CSSStyleRule && rule.selectorText === selector;
    });
    if (!rule) {
        rule = empty_rule(sheet, class_name);
        if (rule instanceof CSSStyleRule) {
            const style_rule = rule.style;
            Object.entries(style).forEach(([prop, value]) => {
                style_rule.setProperty(dash_name(prop), value as any);
            });
        }
    }
};

const delete_rule = (sheet: CSSStyleSheet, class_name: string) => {
    const selector = `.${class_name}`;
    let index = [...sheet.cssRules].findIndex(rule => {
        return rule instanceof CSSStyleRule && rule.selectorText === selector;
    });
    if (index !== -1) {
        sheet.deleteRule(index);
    }
};

const dump_css = (sheet: CSSStyleSheet) => {
    $style.innerHTML = [...sheet.cssRules].map(rule => rule.cssText).join('\n');
};


export const style = (style: Style) => {
    const repr = JSON.stringify(style);
    const class_name: ClassName = `velvet-${hash(repr)}`;
    if (!cache.has(class_name)) {
        cache.set(class_name, {
            ref: 0,
            style,
        } as MapNode);
    }
    return class_name;
};

export const StyleSheet = {
    create<T>(input: StyleSheet<T>): ClassMapping<T> {
        const pairs: Array<[T, ClassName]> = Object.entries(input).map(([name, _style]) => {
            const class_name = style(_style as Style);
            return [name, class_name] as [T, ClassName];
        });
        return Object.fromEntries(pairs);
    }
};

interface Options {
    nonce?: string;
    debug?: true;
};

const inject_style = ({ nonce, debug }: Options) => {
    if (nonce) {
        // allow to use strict CSP (Content Security Policy)
        $style.nonce = nonce;
        if (debug) {
            $style.setAttribute('nonce', nonce);
        }
    }
    if (!injected) {
        document.head.appendChild($style);
    }
    injected = true;
};

export const inject = (class_name: ClassName, { nonce, debug }: Options = {}) => {
    if (!cache.has(class_name)) {
        throw new Error(`velvet: style with class ${class_name} not found`);
    }
    const obj = cache.get(class_name)!;
    inject_style({ nonce, debug });
    const { sheet } = $style;
    set_css(sheet!, class_name, obj.style);
    if (debug) {
        // by default dynamic style is not visible in devtools
        dump_css(sheet!);
    }
    ++obj.ref;
    return (purge?: true) => {
        if (cache.has(class_name)) {
            const obj = cache.get(class_name)!;
            obj.ref--;
            if (obj.ref <= 0) {
                const { sheet } = $style;
                delete_rule(sheet!, class_name);
                if (debug) {
                    dump_css(sheet!);
                }
                if (purge) {
                    // when user decide he can remove the style object
                    // this is safe when there are no more references
                    // this is usesfull when the style will never be reused
                    cache.delete(class_name);
                }
            }
        }
    };
};

// The hash of the CSS in form of a class is keep as key, each time when we call inject
// we increase the ref number and when destroy is called (fuction return from inject)
// the ref is decreased when ref reach zero, the style is Removed from DOM
const cache = new Map<ClassName, MapNode>();

let injected = false;

const $style: HTMLStyleElement = make_style();
