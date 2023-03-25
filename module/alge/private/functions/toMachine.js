import * as constants from "../constants.js";
import { debug } from "../functions.js";
import { specialCharactersReplacements as SCHAR } from "../constants.js";

export function split(string, exclusiveChar, inclusiveChar) {
	let negates = ['^', '#', '*', '/'];

	let parenStack = 0;
	let builder = "";
	let output = [];

	let splitArr = string.split("");
	splitArr.forEach((char, i) => {
		// exclusive and inclusive chars
		if ([exclusiveChar, inclusiveChar].includes(char) && parenStack === 0 && !negates.includes(splitArr[i-1])) {
			output.push(builder); builder = (char === exclusiveChar) ? "" : inclusiveChar;
		} else {
			// open and close parens
			if (constants.parenthesis.includes(char)) parenStack += (constants.parenthesis.indexOf(char) < 3) ? 1 : -1;

			builder += char;
		}
	});
	return output.concat([builder]).filter(e => e !== '');
}

//-------------------------------------------------------------------------------identify string
export function interpretMathString(mathString) {
	let type = {
		influence: "nul",
		type: "err"
	}
	
	// Influence: 
	if (mathString[0] === "/") {
		type.influence = "div";
		mathString = mathString.slice(1);
	} else if (mathString[0] === SCHAR["+~-"]) {// Plus or minus
		type.influence = "pm"
		mathString = mathString.slice(1);
	}

	// Type
	if (mathString === "") {
		type.type = "emp";
	} else if (!isNaN(mathString)) {
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


