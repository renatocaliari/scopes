export function convertToNumberingScheme(number) {
    var baseChar = ("A").charCodeAt(0),
        letters = "";

    do {
        number -= 1;
        letters = String.fromCharCode(baseChar + (number % 26)) + letters;
        number = (number / 26) >> 0; // quick `floor`
    } while (number > 0);

    return letters;
}

export function deepFreeze(object) {
    // Retrieve the property names defined on object
    const propNames = Object.getOwnPropertyNames(object);

    // Freeze properties before freezing self

    for (const name of propNames) {
        const value = object[name];

        if (value && typeof value === "object") {
            deepFreeze(value);
        }
    }

    return Object.freeze(object);
}

const obj2 = {
    internal: {
        a: null
    }
};

export function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}
