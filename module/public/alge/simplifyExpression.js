import * as debug from "../../private-alge/debug.js";

export default function simplifyExpression(expression) {
	debug.group("Simplify Expression", expression);

	expression.compress();
	debug.log("Compress Expression", expression);

	debug.groupEnd("Simplify Expression", expression);
	return expression;
}