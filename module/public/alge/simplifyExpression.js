import * as debug from "../../private-func/debug.js";

export default function simplifyExpression(expression) {
	debug.group("Simplify Expression", expression);

	expression.compress();
	debug.log("Compress Expression", expression);

	debug.groupEnd("Simplify Expression", expression);
	return expression;
}