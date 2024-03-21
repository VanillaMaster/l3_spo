/**
 * Sequence of K_i S-box applying for encryption
 * @type { readonly number[] }
 */
export const SEQ_ENCRYPT = [
    0, 1, 2, 3, 4, 5, 6, 7,
    0, 1, 2, 3, 4, 5, 6, 7,
    0, 1, 2, 3, 4, 5, 6, 7,
    7, 6, 5, 4, 3, 2, 1, 0,
]
/**
 * Sequence of K_i S-box applying for decryption
 * @type { readonly number[] }
 */
export const SEQ_DECRYPT = [
    0, 1, 2, 3, 4, 5, 6, 7,
    7, 6, 5, 4, 3, 2, 1, 0,
    7, 6, 5, 4, 3, 2, 1, 0,
    7, 6, 5, 4, 3, 2, 1, 0,
]

export const BLOCKSIZE = 8;
export const C1 = 0x01010104;
export const C2 = 0x01010101;