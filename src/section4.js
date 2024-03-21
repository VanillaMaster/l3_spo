import { sha224, stringify } from "@vanilla/sha/224";

const fieldset = /**@type { HTMLFieldSetElement } */(document.querySelector("#section-4>fieldset"));
    // console.log(fieldset);
const {
    input,
    output,
    run
} = fieldset.elements;

if (!(input instanceof HTMLInputElement)) throw new Error();
if (!(output instanceof HTMLInputElement)) throw new Error();
if (!(run instanceof HTMLButtonElement)) throw new Error();


const encoder = new TextEncoder();
run.addEventListener("click", function() {
    
    const hash = stringify(sha224(encoder.encode(input.value)));
    output.value = hash;
})