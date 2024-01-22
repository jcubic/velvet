/*
 * Velvet <https://github.com/jcubic/velvet/>
 *
 * Copyright (c) 2023-2024 Jakub T. Jankiewicz <jcubic@onet.pl>
 * Released under MIT license
 */

// based on https://stackoverflow.com/a/18639999/387194
const make_crc_table = () => {
    let c: number;
    const crc_table: Array<number> = [];
    for(let n = 0; n < 256; n++){
        c = n;
        for(let k =0; k < 8; k++){
            c = ((c&1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
        }
        crc_table[n] = c;
    }
    return crc_table;
};

const crc_table = make_crc_table();

const crc32 = (str: string) => {
    let crc = 0 ^ (-1);

    for (let i = 0; i < str.length; i++ ) {
        crc = (crc >>> 8) ^ crc_table[(crc ^ str.charCodeAt(i)) & 0xFF];
    }

    return (crc ^ (-1)) >>> 0;
};

const hash = (str: string): string => {
    return crc32(str).toString(16);
};

export default hash;
