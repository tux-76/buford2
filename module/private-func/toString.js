import * as classes from "../classes/main.js";
import * as constants from "../constants.js";

/*----------------------------------------------------------to string
	MODES: "normal", "no constant", "no parenthesis"
*/
export default function toString(value, mode="normal") {
	if (!isNaN(value)) return value.toString();

	else if (value instanceof classes.Variable) return value.char;

	else if (value instanceof classes.Coefficient) return toString(value.base) + ((value.exponent !== 1) ? ("^" + toString(value.exponent)) : "");

	else if (value instanceof classes.Term) {
		let string = ((value.constant !== 1 || value.coefficients.length < 1) && !(mode === "no constant")) ? toString(value.constant) : ""; //add constant num if not 1 and more coefficients
		value.coefficients.forEach((coef) => {
			if (!isNaN(coef.base) && string.length > 0) string += "*";
			string += toString(coef);
		});
		return string;
	}
	else if (value instanceof classes.Expression) {
		let string = ""
		if (!(mode === "no parenthesis")) {
			value.forEach((e) => string += toString(e) + "+"); 
			string = string.substring(0, string.length-1/*remove the + at the end*/);
			return `(${string})`;
		} else {
			value.forEach((e) => string += toString(e) + " + "); 
			string = string.substring(0, string.length-3/*remove the + at the end*/);
			return string;
		}
	}
	else if (value instanceof classes.Equation) {
		let side1 = toString(value.left, "no parenthesis");
		let side2 = toString(value.right, "no parenthesis");
		return (side1 || '0') + ` ${constants.operationSymbols[value.operation]} ` + (side2 || '0');
	}
	else console.error(`toString did not recognize value:`, value);
}