import * as debug from "../../private-alge/debug.js";

export default function simplifyExpression(expression) {
	debug.group("Simplify Expression", expression);

	expression.simplify();
	expression.compress();

	debug.groupEnd("Simplify Expression", expression);
	return expression;
}