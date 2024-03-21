import { cnt } from "./gost/gost.js"
import { fromHex, toHex } from "./utils.js";

const fieldset = /**@type { HTMLFieldSetElement } */(document.querySelector("#section-2>fieldset"));
console.log(fieldset.elements);

const {
    nodes,
    key,
    input,
    output,
    run,
    inputType,
    outputType
} = fieldset.elements;

if (!(nodes instanceof HTMLTextAreaElement)) throw new Error();
if (!(key instanceof HTMLInputElement)) throw new Error();
if (!(input instanceof HTMLTextAreaElement)) throw new Error();
if (!(output instanceof HTMLTextAreaElement)) throw new Error();
if (!(run instanceof HTMLButtonElement)) throw new Error();
if (!(inputType instanceof HTMLSelectElement)) throw new Error();
if (!(outputType instanceof HTMLSelectElement)) throw new Error();


const encoder = new TextEncoder();
const decoder = new TextDecoder();
run.addEventListener("click", function() {
    const KEY = fromHex(key.value);
    const raw_SBOX = nodes.value.split("\n").map(row => row.split(/\s+/).map(s => (Number.parseInt(s) & 0xF)));
    const SBOX = new Array();
    for (let i = 0; i < raw_SBOX.length; i++) {
        for (let j = 0; j < raw_SBOX[i].length; j++) {
            (SBOX[j] ?? (SBOX[j] = []))[i] = raw_SBOX[i][j]
        }
    }
    /**@type { Uint8Array } */
    let DATA;
    switch (inputType.value) {
        case "utf8":
            DATA = encoder.encode(input.value);
            break;
        case "hex":
            DATA = fromHex(input.value);
            break
        default: return void alert(`unexpected input type: "${inputType.value}"`)
    }
    console.log(SBOX);
    const encrypted = cnt(KEY, DATA, SBOX);
    console.log(encrypted);
    switch (outputType.value) {
        case "utf8":
            output.value = decoder.decode(encrypted);
            break;
        case "hex":
            output.value = toHex(encrypted);
            break
        default: return void alert(`unexpected input type: "${inputType.value}"`)
    }
})