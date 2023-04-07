import * as classes from "../classes.js";
import * as constants from "../constants.js";
import { specialCharactersReplacements as SCHAR } from "../constants.js";

/*----------------------------------------------------------to string
	MODES: "normal", "no constant", "no parenthesis"
*/
export function basic(value, mode="normal") {
	if (!isNaN(value)) return value.toString();

	else if (value instanceof classes.Variable) return value.char;

	else if (value instanceof classes.Coefficient) return basic(value.base) + ((value.exponent !== 1) ? ("^" + basic(value.exponent)) : "");

	else if (value instanceof classes.Term) {
		// Create the string with the constant number in it
		// Constant number is only shown when: The constant isn't 1 OR when there are no coefficients, 
		// Also the mode musn't be "no constant"
		let string = ((value.constant !== 1 || value.coefficients.length < 1) && !(mode === "no constant")) ? basic(value.constant) : ""; 
		// Add the coefficients
		value.coefficients.forEach((coef) => {
			// If the coefficient's base is a number and there is something before it, add a *
			// **This is because implied multiplication works with 4*a (4a) but not 4*5 (45)**
			if (!isNaN(coef.base) && string.length > 0) string += "*";
			string += basic(coef);
		});
		return string;
	}
	else if (value instanceof classes.Expression) {
		// The final expression string
		let string = ""
		// For every term in the expression
		value.forEach((term) => {
			// Add operator
			string += term.plusMinus ? SCHAR["+~-"] : "+";
			// Add the term to the string
			string += basic(term);
		}); 

		// Remove the plus at the beginning
		if (string[0] === "+") string = string.slice(1)
		return (mode === "no parenthesis") ? string : `(${string})`
	}
	else if (value instanceof classes.Equation) {
		let side1 = basic(value.left, "no parenthesis");
		let side2 = basic(value.right, "no parenthesis");
		return (side1 || '0') + `${constants.equalitySymbols[value.operation]}` + (side2 || '0');
	}
	else console.error(`toString did not recognize value: ${value}. Raw:`, value);
}


// ============================================================================================
// -------------------------------------------------------------------------------------pretty
// ============================================================================================
export function pretty(value) {
	// -----------------CALCULATE
	// TEMPORARY
	let string = basic(value, "no parenthesis");

	//------------------REPLACE CHARACTERS


	// -----------------END
	return string
}