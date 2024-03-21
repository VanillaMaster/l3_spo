/**@type { readonly string[] } */
export const alphabet = [
    "а", "б", "в", "г", "д", "е", "ё", "ж", "з", "и", "й",
    "к", "л", "м", "н", "о", "п", "р", "с", "т", "у", "ф",
    "х", "ц", "ч", "ш", "щ", "ъ", "ы", "ь", "э", "ю", "я"
];
// const replace = [
//     "ё", "ц", "к", "н", "ш", "з", "ъ", "ы", "а", "р", "л",
//     "ж", "я", "с", "и", "ь", "ю", "й", "у", "е", "г", "щ",
//     "х", "ф", "в", "п", "о", "д", "э", "ч", "м", "т", "б"
// ];

/**
 * @template T
 * @param  {...T[]} arrays
 * @returns { Generator<T[], void, never> }
 */
export function* zip(...arrays) {
    const length = Math.max(...arrays.map( a => a.length))
    for (let i = 0; i < length; i++) {
        yield arrays.map(a => a[i]);
    }
}

/*
const dictionary = Object.fromEntries(zip(
    [...replace.map(c => c.toLowerCase()), ...replace.map(c => c.toUpperCase())],
    [...alphabet.map(c => c.toLowerCase()), ...alphabet.map(c => c.toUpperCase())]
));

const msg = "Иржьншё р ирвзнь из цьлезуч, меь изйёагсиь."
const buffer = [];
for (const char of msg) {
    if (char in dictionary) buffer.push(dictionary[char])
    else buffer.push(char);
}
console.log(buffer.join(""));
*/