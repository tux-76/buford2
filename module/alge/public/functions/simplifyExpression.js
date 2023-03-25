/*
	SIMPLIFY EXPRESSION

	IN: expression to simplify
	OUT: simplified expression
*/


import * as debug from "../../private/functions/debug.js";

export default function simplifyExpression(expression) {
	debug.group("Simplify Expression", expression);

	expression.simplify();
	expression.compress();

	debug.groupEnd("Simplify Expression", expression);
	return expression;
}