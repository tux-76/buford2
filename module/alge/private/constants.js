export const variables = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
export const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-'];
export const parenthesis = ['(', '[', '{', ')', ']', '}'];
export const operators = ['=', '<', '>', '+', '-', "±", '*', '/', '^'];
export const operationSymbols = ['=', '<', '>'];

// These are combos that will be replaced with special characters
// The key is the input that will be replaced with the other.
// There is a list of ASCII math symbols here http://asciimath.org/
export const specialCharactersReplacements = {
    "oo":"∞",
    "+~-":"±",

    // not in basic
    "-": "−",

    "/":"÷",
    "*":"⋅",
}