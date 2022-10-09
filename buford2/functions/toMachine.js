import * as constants from "../constants.js";

//--------------------------------------------------------------------------------check parenthesis
export function checkParenthesis(parenStacks, char) {
	if (char === '(') {
		parenStacks[0] += 1;
	}
	else if (char === '[') {
		parenStacks[1] += 1;
	}
	else if (char === '{') {
		parenStacks[2] += 1;
	}
	
	//check for closing parens
	else if (char === ')') {
		parenStacks[0] -= 1;
	}
	else if (char === ']') {
		parenStacks[1] -= 1;
	}
	else if (char === '}') {
		parenStacks[2] -= 1;
	}
	return parenStacks
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