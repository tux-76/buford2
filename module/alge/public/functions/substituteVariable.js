/*
    SUBSTITUTE VARIABLE

    Will replace the variable in a given equation with something (right now it will just be expression)

    INPUT: original thingy (any class), the variable index to replace, the replacement (any class)
*/




import { Equation, Expression, Term, Coefficient, Variable } from "../../private/classes.js";
import { simplifyExpression } from "../functions.js";
import * as debug from "../../private/functions/debug.js";
import * as constants from "../../private/constants.js";

let sub;
let variableIndex;

function loop(anyClass) {
    if (anyClass instanceof Variable) {
        if (anyClass.index === variableIndex) anyClass = sub;
    } else if (anyClass instanceof Coefficient) {
        anyClass.base = loop(anyClass.base);
        anyClass.exponent = loop(anyClass.exponent);
    } else if (anyClass instanceof Term) {
        anyClass.coefficients = anyClass.coefficients.map(coef => loop(coef));
    } else if (anyClass instanceof Expression) {
        anyClass = anyClass.map(term => loop(term));
    } else if (anyClass instanceof Equation) {
        anyClass.left = loop(anyClass.left);
        anyClass.right = loop(anyClass.right);
    }
    return anyClass;
}

export default function substituteVariable(anyClass, variableIndexInput, subInput) {
    debug.group("Substitute Variable", anyClass);
    debug.log("Variable To Sub", constants.variables[variableIndexInput]);
    debug.log("Sub Value", subInput)

    sub = subInput;
    variableIndex = variableIndexInput;

    anyClass = loop(anyClass);
    debug.log("Substituted", anyClass)

    if (isNaN(anyClass)) anyClass.simplify()

    debug.groupEnd("Substitute Variable", anyClass)
    return anyClass;
}
