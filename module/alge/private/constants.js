/*
    These are constants that are used by various different functions (mainly string functions)
*/


// SPECIAL CHARACTERS AND REPLACEMENTS
// These are combos that will be replaced with special characters
// The key is the input that will be replaced with the other.
// There is a list of ASCII math symbols here http://asciimath.org/
export const specialCharacters = {
    "@oo":"∞",
    "@+-":"±",
    "@pi":"π"
}
const SCHAR = specialCharacters

// CHARACTERS
export const placeholders = [SCHAR["@pi"]]
export const variables = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z', 
'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 
"α", ...placeholders];
export const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-'];
export const parenthesis = ['(', '[', '{', ')', ']', '}'];
export const operators = ['=', '<', '>', '+', '-', SCHAR["@+-"], '*', '/', '^'];
export const equalitySymbols = ['=', '<', '>'];
