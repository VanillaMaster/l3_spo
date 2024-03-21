/**
 * @typedef { ArrayLike<ArrayLike<number>> } s_box
 * @typedef { [N1: number, N2: number ] } NS
 */
import { SEQ_ENCRYPT, BLOCKSIZE, C1, C2 } from "./constants.js"

/**
 * Counter mode of operation
 * @param { Uint8Array } key encryption key
 * @param { Uint8Array } data data to encrypt
 * @param { s_box } sbox S-box to use
 * @param { Uint8Array } [iv] initialization vector (BLOCKSIZE length)
 */
export function cnt(key, data, sbox, iv = new Uint8Array(BLOCKSIZE)) {
    let [n2, n1] = encrypt(sbox, key, block2ns(iv));
    const len = data.length + pad_size(data.length, BLOCKSIZE);
    const gamma = new Uint8Array(len);
    for (let i = 0; i < len; i += BLOCKSIZE) {
        n1 = (n1 + C2) >>> 0;
        n2 = (n2 + C1) % 0xFFFFFFFF;
        gamma.set(ns2block(encrypt(sbox, key, [n1, n2])), i);
    }
    return xor(gamma, data);
}

/**
 * @param { Uint8Array } a 
 * @param { Uint8Array } b 
 */
function xor(a, b) {
    const minLength = Math.min(a.length, b.length);
    const result = new Uint8Array(minLength);
    for (let i = 0; i < minLength; i++) result[i] = a[i] ^ b[i];
    return result;
}

/**
 * Calculate required pad size to full up blocksize
 * @param { number } data_size 
 * @param { number } blocksize 
 */
function pad_size(data_size, blocksize) {
    if (data_size < blocksize) return blocksize - data_size;
    if ((data_size % blocksize) == 0) return 0;
    return blocksize - data_size % blocksize
}

/**
 * Convert N1 and N2 integers to 8-byte block
 * @param { NS } ns 
 */
function ns2block(ns) {
    const [n1, n2] = ns;
    const block = new Uint8Array(8);

    block[0] = (n2 >> 0x00) & 0xFF;
    block[1] = (n2 >> 0x08) & 0xFF;
    block[2] = (n2 >> 0x10) & 0xFF;
    block[3] = (n2 >> 0x18) & 0xFF;
    block[4] = (n1 >> 0x00) & 0xFF;
    block[5] = (n1 >> 0x08) & 0xFF;
    block[6] = (n1 >> 0x10) & 0xFF;
    block[7] = (n1 >> 0x18) & 0xFF;

    return block;
}

/**
 * Convert block to N1 and N2 integers
 * @param { Uint8Array } data 
 * @returns { NS }
 */
function block2ns(data) {
    return [
        (data[0] | data[1] << 8 | data[2] << 16 | data[3] << 24) >>> 0,
        (data[4] | data[5] << 8 | data[6] << 16 | data[7] << 24) >>> 0
    ]
}

/**
 * Encrypt single block
 * @param { s_box } sbox 
 * @param { Uint8Array } key 
 * @param { NS } ns 
 */
function encrypt(sbox, key, ns) {
    return xcrypt(SEQ_ENCRYPT, sbox, key, ns)
}

/**
 * Perform full-round single-block operation
 * @param { readonly number[] } seq sequence of K_i S-box applying (either encrypt or decrypt)
 * @param { s_box } sbox S-box to use
 * @param { Uint8Array } key 256-bit encryption key
 * @param { NS } ns 
 * @returns { NS }
 */
function xcrypt(seq, sbox, key, ns) {
    const x = new Uint32Array(8);
    for (let i = 0; i < x.length; i++) {
        x[i] = (
            key[(i * 4) + 0] << 0x00 |
            key[(i * 4) + 1] << 0x08 |
            key[(i * 4) + 2] << 0x10 |
            key[(i * 4) + 3] << 0x18
        ) >>> 0;
    }
    let [n1, n2] = ns;
    for (const i of seq) {
        const tmp = n1;
        n1 = (_shift11(_K(sbox,  (n1 + x[i]) >>> 0)) ^ n2) >>> 0;
        n2 = tmp;
    }
    return [n1, n2];
}

/**
 * S-box substitution
 * @param { s_box } s S-box
 * @param { number } input 32-bit word
 * @returns { number } substituted 32-bit word
 */
function _K(s, input) {
    return (
        (s[0][(input >>> 0x00) & 0xF] << 0x00) |
        (s[1][(input >>> 0x04) & 0xF] << 0x04) |
        (s[2][(input >>> 0x08) & 0xF] << 0x08) |
        (s[3][(input >>> 0x0C) & 0xF] << 0x0C) |
        (s[4][(input >>> 0x10) & 0xF] << 0x10) |
        (s[5][(input >>> 0x14) & 0xF] << 0x14) |
        (s[6][(input >>> 0x18) & 0xF] << 0x18) |
        (s[7][(input >>> 0x1C) & 0xF] << 0x1C)
    ) >>> 0;
}

/**
 * @param { number } x 
 * @param { number } n 
 */
function __cyclicLeftBitShift(x, n) {
    return ((x << n) | (x >>> (32 - n))) >>> 0;
}

/**
 * 11-bit cyclic shift
 * @param { number } x 
 */
function _shift11(x) {
    return __cyclicLeftBitShift(x, 11);
}