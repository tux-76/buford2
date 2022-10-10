/*----------------------------------------------------------to string
	MODES: "normal", "no constant", "no parenthesis"
*/
export default function toString(value, mode="normal") {
	if (!isNaN(value)) return value.toString();

	else if (value instanceof bu2_Variable) return value.char;

	else if (value instanceof bu2_Coefficient) return bu2_toString(value.base) + ((value.exponent !== 1) ? ("^" + bu2_toString(value.exponent)) : "");

	else if (value instanceof bu2_Term) {
		let string = ((value.constant !== 1 || value.coefficients.length < 1) && !(mode === "no constant")) ? bu2_toString(value.constant) : ""; //add constant num if not 1 and more coefficients
		value.coefficients.forEach((coef) => {
			if (!isNaN(coef.base) && string.length > 0) string += "*";
			string += bu2_toString(coef);
		});
		return string;
	}
	else if (value instanceof bu2_Expression) {
		let string = ""
		if (!(mode === "no parenthesis")) {
			value.forEach((e) => string += bu2_toString(e) + "+"); 
			string = string.substring(0, string.length-1/*remove the + at the end*/);
			return `(${string})`;
		} else {
			value.forEach((e) => string += bu2_toString(e) + " + "); 
			string = string.substring(0, string.length-3/*remove the + at the end*/);
			return string;
		}
	}
	else if (value instanceof bu2_Equation) {
		side1 = bu2_toString(value.left, "no parenthesis");
		side2 = bu2_toString(value.right, "no parenthesis");
		return (side1 || '0') + ` ${bu2_operationSymbols[value.operation]} ` + (side2 || '0');
	}
	else console.error(`bu2_toString did not recognize value:`, value);
}