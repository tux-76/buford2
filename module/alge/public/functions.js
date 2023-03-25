/*
    FUNCTIONS for the public algebra
*/

// Functions to export
import simplifyExpression from "./functions/simplifyExpression.js";
import doubleSidedSolve from "./functions/doubleSidedSolve.js";
import substituteVariable from "./functions/substituteVariable.js";

// Functions for user mods
import { variables } from "../private/constants.js";
import { toString } from "../private/functions.js";
import { Equation, Expression } from "../private/classes.js";




/*
    User Input Mods
    
    This "wraps" the functions to convert the input and the output like so:
        string-input => machine-input
        function()
        machine-output => string-output

    ACTUAL FORMAT:
    "FUNC_NAME": {
        "in": (STRING_INPUT) => [new Equation(STRING_INPUT)],
        "out": (OUTPUT) => toString.pretty(OUTPUT)
    },
*/
export const userMods = {
    "simplifyExpression": {
        "in": (stringExp) => [new Expression(stringExp)],
        "out": (expression) => toString.pretty(expression)
    },
    // IN: equation string, varable character
    "doubleSidedSolve": {
        "in": (stringEq, variableChar) => [new Equation(stringEq), variables.indexOf(variableChar)],
        "out": (equation) => toString.pretty(equation)
    },
    // IN: expression string, variable char, expression replacement
    "substituteVariable": {
        "in": (originalStr, varChar, replaceStr) => [new Expression(originalStr), variables.indexOf(varChar), new Expression(replaceStr)],
        "out": (any) => toString.pretty(any)
    },
}

export { simplifyExpression, doubleSidedSolve, substituteVariable };