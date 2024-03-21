import { alphabet, zip } from "./simpleReplace/simpleReplace.js";
const fieldset = /**@type { HTMLFieldSetElement } */(document.querySelector("#section-1>fieldset"));

const {
    alphabet: replaceAlphabet,
    input,
    output,
    run
} = fieldset.elements;

if (!(replaceAlphabet instanceof HTMLInputElement)) throw new Error();
if (!(input instanceof HTMLInputElement)) throw new Error();
if (!(output instanceof HTMLInputElement)) throw new Error();
if (!(run instanceof HTMLButtonElement)) throw new Error();


run.addEventListener("click", function() {
    const replace = replaceAlphabet.value.replaceAll(" ", "").split("");
    const dictionary = Object.fromEntries(zip(
        [...replace.map(c => c.toLowerCase()), ...replace.map(c => c.toUpperCase())],
        [...alphabet.map(c => c.toLowerCase()), ...alphabet.map(c => c.toUpperCase())]
    ));

    const msg = input.value;
    const buffer = [];
    for (const char of msg) {
        if (char in dictionary) buffer.push(dictionary[char])
        else buffer.push(char);
    }
    output.value = buffer.join("");
})