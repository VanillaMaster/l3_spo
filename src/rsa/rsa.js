/**
 * @param { Uint8Array } source 
 * @param { number } n 
 * @param { number} e 
 */
export function encrypt(source, n, e) {
    const result = new Uint8Array(source.length * 4);
    const view = new DataView(result.buffer);

    for (let i = 0; i < source.length; i++) {
        const byte = source[i];
        view.setUint32(i * 4, __encrypt(source[i], n, e));
    }
    
    return result
}

/**
 * @param { number } m 
 * @param { number } n 
 * @param { number } e 
 */
function __encrypt(m, n, e) {
    let result = 1;
    for (let i = 0; i < e; i++) result = (result * m) % n;
    return result;
    // return Number((BigInt(m) ** BigInt(e)) % BigInt(n))
}

/**
 * @param { Uint8Array } source 
 * @param { number } n 
 * @param { number} d
 */
export function decrypt(source, n, d) {
    const result = new Uint8Array(source.length / 4);
    const view = new DataView(source.buffer);
    for (let i = 0; i < result.length; i++) {
        result[i] = __decrypt(view.getUint32(i * 4), n, d);
    }
    return result;
}

/**
 * @param { number } m 
 * @param { number } n 
 * @param { number } d 
 */
function __decrypt(m, n, d) {
    let result = 1;
    for (let i = 0; i < d; i++) result = (result * m) % n;
    return result;
    // return Number((BigInt(m) ** BigInt(d)) % BigInt(n))
}

/**
 * @param { number } p 
 * @param { number } q
 * @param { number } rn random number between 0 and 1
 */
export function generateKeys(p, q, rn){
    const n = p * q;
    if (n > Number.MAX_SAFE_INTEGER) throw new Error();
    const phi = (p - 1) * (q - 1);
    if (phi > Number.MAX_SAFE_INTEGER) throw new Error();

    const e = getE(3, phi, rn);
    const d = modInverse(e, phi);
    
    return [n, e, d];
}

/**
 * 
 * @param { number } min inclusive minimum
 * @param { number } max exclusive maximum 
 * @param { number } point random number between 0 and 1
 */
function getE(min, max, point) {
    const delta = max - min;
    const start = Math.trunc(delta * point);
    for (let e = start; e < max; e++) if (GCD(e, max) === 1) return e;
    for (let e = (start - 1); e >= min; e--) if (GCD(e, max) === 1) return e;

    throw new Error();
}

/**
 * @param { number } a 
 * @param { number } b 
 */
function GCD(a, b){
    if (a === 0) return b;
    if (b === 0) return a;
    if (a === b) return a;

    let k = 0;
    /*
     * if least significant bit in both numbers is 0
     * then devide both until at least one become odd
     */
    while (((a | b) & 0b1) === 0) {
        a >>>= 1;
        b >>>= 1;
        k++;
    }

    /*
     * make sure a is odd
     */
    while ((a & 0b1) === 0) a >>>= 1;

    do {
        /*
         * make sure b is odd
         */
        while ((b & 0b1) === 0) b >>>= 1;
        /*
         * swap if needed (a <= b)
         */
        if (a > b) {
            let t = a;
            a = b;
            b = t;
        }

        b = (b - a);
    } while (b !== 0);

    return (a << k) >>> 0; 
}

/**
 * @param { number } a 
 * @param { number } m 
 * @returns 
 */
function modInverse(a, m) {
    if (m == 1) return 0;

    let m0 = m, y = 0, x = 1;
 
    while (a > 1){
        let q = Math.trunc(a / m), t = m;

        m = a % m;
        a = t;
        t = y;
 
        y = x - q * y;
        x = t;
    }
 
    if (x < 0) x += m0;
    return x;
}