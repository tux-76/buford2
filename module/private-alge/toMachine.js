import * as constants from "../constants.js";

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
	if (mathString[0] === "/") {
		type.influence = "div";
		mathString = mathString.slice(1);
	}
	if (mathString === "") {
		type.type = "emp";
	} else if (!isNaN(mathString)) {
		type.type = "num";
	} else if (constants.variables.includes(mathString)) {
		type.type = "var";
	} else if (constants.parenthesis.includes(mathString[0]) && constants.parenthesis.includes(mathString[mathString.length-1])) {
		type.type = "exp";
	} else {
		type.type = "non";
	}
	return type
}