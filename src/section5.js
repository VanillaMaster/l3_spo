import { decrypt, encrypt, generateKeys,  } from "./rsa/rsa.js";
import { fromHex, toHex } from "./utils.js";

const fieldset = /**@type { HTMLFieldSetElement } */(document.querySelector("#section-5>fieldset"));
    // console.log(fieldset);
const {
    type,
    inputType,
    outputType,
    p,
    q,
    n,
    e,
    d,
    input,
    output,
    run,
    keygen
} = fieldset.elements;

if (!(type instanceof HTMLSelectElement)) throw new Error();
if (!(inputType instanceof HTMLSelectElement)) throw new Error();
if (!(outputType instanceof HTMLSelectElement)) throw new Error();
if (!(p instanceof HTMLInputElement)) throw new Error();
if (!(q instanceof HTMLInputElement)) throw new Error();
if (!(n instanceof HTMLInputElement)) throw new Error();
if (!(e instanceof HTMLInputElement)) throw new Error();
if (!(d instanceof HTMLInputElement)) throw new Error();
if (!(input instanceof HTMLTextAreaElement)) throw new Error();
if (!(output instanceof HTMLTextAreaElement)) throw new Error();
if (!(run instanceof HTMLButtonElement)) throw new Error();
if (!(keygen instanceof HTMLButtonElement)) throw new Error();


keygen.addEventListener("click", function(){
    const valP = Number.parseInt(p.value);
    const valQ = Number.parseInt(q.value);

    const R = Math.random();

    const [valN, valE, valD] = generateKeys(valP, valQ, R);

    n.value = String(valN);
    e.value = String(valE);
    d.value = String(valD);
})

const encoder = new TextEncoder();
const decoder = new TextDecoder();

run.addEventListener("click", function(){
    if (n.value == "") return void alert("enter n first")
    const valN = Number.parseInt(n.value);
    if (e.value == "") return void alert("enter e first")
    const valE = Number.parseInt(e.value);
    if (d.value == "") return void alert("enter d first")
    const valD = Number.parseInt(d.value);

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

    switch (type.value) {
        case "encode":
            DATA = encrypt(DATA, valN, valE);
            break;
        case "decode":
            DATA = decrypt(DATA, valN, valD);
            break;
        default: throw new Error();
    }

    switch (outputType.value) {
        case "utf8":
            output.value = decoder.decode(DATA);
            break;
        case "hex":
            output.value = toHex(DATA);
            break;
        default: return void alert(`unexpected input type: "${inputType.value}"`)
    }

})