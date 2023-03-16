import * as classes from "../classes.js";
import * as constants from "../constants.js";

/*----------------------------------------------------------to string
	MODES: "normal", "no constant", "no parenthesis"
*/
export function basic(value, mode="normal") {
	if (!isNaN(value)) return value.toString();

	else if (value instanceof classes.Variable) return value.char;

	else if (value instanceof classes.Coefficient) return basic(value.base) + ((value.exponent !== 1) ? ("^" + basic(value.exponent)) : "");

	else if (value instanceof classes.Term) {
		let string = ((value.constant !== 1 || value.coefficients.length < 1) && !(mode === "no constant")) ? basic(value.constant) : ""; //add constant num if not 1 and more coefficients
		value.coefficients.forEach((coef) => {
			if (!isNaN(coef.base) && string.length > 0) string += "*";
			string += basic(coef);
		});
		return string;
	}
	else if (value instanceof classes.Expression) {
		let string = ""
		if (!(mode === "no parenthesis")) {
			value.forEach((e) => string += basic(e) + "+"); 
			string = string.substring(0, string.length-1/*remove the + at the end*/);
			return `(${string})`;
		} else {
			value.forEach((e) => string += basic(e) + " + "); 
			string = string.substring(0, string.length-3/*remove the + at the end*/);
			return string;
		}
	}
	else if (value instanceof classes.Equation) {
		let side1 = basic(value.left, "no parenthesis");
		let side2 = basic(value.right, "no parenthesis");
		return (side1 || '0') + ` ${constants.operationSymbols[value.operation]} ` + (side2 || '0');
	}
	else console.error(`toString did not recognize value: ${value}`);
}

export function pretty(value) {
	
}