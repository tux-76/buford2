import * as constants from "../constants.js";
import { debug } from "../functions.js";
import { specialCharactersReplacements as SCHAR } from "../constants.js";
import * as classes from "../classes.js"

/*
	SPLIT MATH STRING

	DESC: Will split the math string at the characters given. Exclusive characters don't have any mathematical effect 
		on the next block (+, -), whereas inclusive characters do (-, /)
*/
export function split(string, exclusiveChars=[], inclusiveChars=[]) {
	// Most functions were built to only do one exclusive char and one inclusive, this will fix that if that input happens
	if (typeof exclusiveChars === "string") exclusiveChars = [exclusiveChars]
	if (typeof inclusiveChars === "string") inclusiveChars = [inclusiveChars]

	// If these come before a character, that character will not be processed
	let negates = ['^', '#', '*', '/'];
	// Parenthesis stack keeps from splitting inside a parenthesis
	let parenStack = 0;
	// This is where the characters will be built up until they are added to output
	let block = "";
	// The final product
	let output = [];

	// Create an array of all the string's characters
	let splitArr = string.split("");
	splitArr.forEach((char, i) => {
		// If this is a valid location to split the string
		// If the character is an exclusive or an inclusive character AND not in parenthesis AND no negating character before
		if ([...exclusiveChars, ...inclusiveChars].includes(char) && parenStack === 0 && !negates.includes(splitArr[i-1])) {
			// Push the built object (may be a term or coefficient or somthing like that)
			output.push(block); 
			// If it is an exclusive char
			block = (exclusiveChars.includes(char)) ? "" : char;
		} else {
			// If the character is an open or closed parenthesis: add or subtract it to the paren stack
			if (constants.parenthesis.includes(char)) parenStack += (constants.parenthesis.indexOf(char) < 3) ? 1 : -1;
			// Add the character to the block
			block += char;
		}
	});
	// Return the output with the last block added to it and then filter any spaces out
	return output.concat([block]).filter(e => e !== '');
}

//-------------------------------------------------------------------------------identify string
export function interpretMathString(mathString) {
	let type = {
		influence: "nul",
		type: "err",
		plusMinus: false
	}
	
	// Influence:
	if (mathString[0] === "/") {
		type.influence = "div";
		mathString = mathString.slice(1);
	}

	// Check if there is a plus or minus
	if (mathString[0] === SCHAR["+~-"]) { // Plus or minus
		type.plusMinus = true
		mathString = mathString.slice(1);
	}

	// Type
	if (mathString === "") {
		type.type = "emp";
	} else if (!isNaN(mathString)) { // number
		type.type = "num";
	} else if (constants.variables.includes(mathString)) {
		type.type = "var";
	} else if (constants.parenthesis.includes(mathString[0]) && constants.parenthesis.includes(mathString[mathString.length-1])) {
		type.type = "exp";
	} else if (mathString === '-') {
		type.type = "neg"
	} else {
		type.type = "non";
	}
	return type
}

// Formats the input string to a certain extent to allow for easier interpretation (remove spaces and stuff like that)
export function formatInputString(string) {
	// Error checking
	if (typeof string !== "string") debug.error("That is not a string!", string)
	
	// Remove spaces
	string = string.split(" ").join("");

	// Remove double negs
	string = string.split("--").join("+")

	// Replace special characters
	// For every special key combo, if it is in the string
	// Note: the key is the special key combo (that can be typed on keyboard), the value is the special char
	for (const key in constants.specialCharactersReplacements) if (string.includes(key)) {
		// Replace the special key combo with the special character
		string = string.split(key).join(constants.specialCharactersReplacements[key])
	}

	debug.log("Format String", `"${string}"`);
	return string
}

/* Create an object from the string that is the best fit for the string inputted
 * Notes: BUILT IN FORMATTING!, NUMBERS DONT HAVE TO BE STRINGS
 *
 * MODES:
 * - "all": Includes all classes
 * - "coef friendly": The classes a coefficient can have as bases and exponents (float, variable, expression)
 */  
export function translate(string, mode="all") {
	// If the string is just a number (straight numbers wont error)
	if (!isNaN(string)) return parseFloat(string)
	// If the string is a just a variable
	if (constants.variables.includes(string)) return new classes.Variable(string)

	// Format the string
	string = formatInputString(string)

	// The number of expressions in the string
	let expressionsCount = 1
	// Make the number of expressions go up with the amount of equality symbols (<, >, =)
	// EX: 4a+b => 1 expression || 4a=6=2b => 3 expressions
	string.split("").forEach(char => {
		if (constants.equalitySymbols.includes(char)) expressionsCount++;
	});

	// Go ahead and try to determine class based on the number of expressions.
	// If two sided equation
	if (expressionsCount === 2) return new classes.Equation(string)
	// More than one equal sign, means a system of equations is needed
	else if (expressionsCount > 2) debug.error(`No support for system of equations`, `${expressionsCount} expressions found in ${string}`)

	// FROM THIS POINT ON: everything from Expressions down
	// Create "onion class". Will "peel" the onion until the best fit class is found
	let onionClass = new classes.Expression(string);
	// If we are using coefficient friendly values and it is not number or string, then it must be Expression
	if (mode === "coef friendly") return onionClass;

	// Onion Expression to Term
	// If expression length is more than 1, it is needed
	if (onionClass.length > 1) return onionClass
	// If the expression does only have one term we know that the string is a term
	else onionClass = new classes.Term(string)

	// Onion Term to Coefficients
	// The idea for the if block below is that if we have to add the constant to the coef count if it is not one and the coef
	//   count needs to be greater than one to keep the term
	// If const = 1 and coef > 1 or const != 1 and coef > 0
	if ((onionClass.constant===1 && onionClass.coefficients.length>1) || (onionClass.constant!==1 && onionClass.coefficients.length>0))
		return onionClass
	else onionClass = new classes.Coefficient(string)

	// This is the last return, the string should be in its lowest ranking class right now (other than the easy ones up top)
	return onionClass
}
