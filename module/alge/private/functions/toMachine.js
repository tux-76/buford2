import * as constants from "../constants.js";
import { debug } from "../functions.js";
import { specialCharactersReplacements as SCHAR } from "../constants.js";

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


