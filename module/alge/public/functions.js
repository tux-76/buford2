/*
    FUNCTIONS for the public algebra
*/

// Functions to export
import simplifyExpression from "./functions/simplifyExpression.js";
import doubleSidedSolve from "./functions/doubleSidedSolve.js";
import substituteVariable from "./functions/substituteVariable.js";
import solveFormula from "./functions/solveFormula.js";

// Functions for user mods
import { variables } from "../private/constants.js";
import { toString } from "../private/functions.js";
import { Equation, Expression } from "../private/classes.js";
import { translate, formatInputString as fstr } from "../private/functions/toMachine.js";
import * as constants from "../private/constants.js"




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
    // SIMPLIFY EXPRESSION
    "simplifyExpression": {
        "in": (stringExp) => [new Expression(stringExp)],
        "out": (expression) => toString.pretty(fstr(expression))
    },

    // DOUBLE SIDED SOLVE
    // IN: equation string, varable character
    "doubleSidedSolve": {
        "in": (stringEq, variableChar) => [new Equation(fstr(stringEq)), variables.indexOf(variableChar)],
        "out": (equation) => toString.pretty(equation)
    },

    // SUBSTITUTE VARIABLE
    // IN: any class, variable char, any class variable replacement
    "substituteVariable": {
        "in": (originalStr, varChar, replaceStr) => [translate(originalStr), variables.indexOf(varChar), translate(replaceStr, "coef friendly")],
        "out": (any) => toString.pretty(any)
    },

    // SOLVE FORMULA
    // IN: formula equation, formula key {variable:value}, variable to solve for
    "solveFormula": {
        "in": (formulaStr, rawFormulaKey, variableChar) => {
            // The actual format for the formula key
            let formulaKey = {}
            for (const key in rawFormulaKey)
                // {variableChar: strValue} => {variableIndex: machineValue}
                formulaKey[constants.variables.indexOf(key)] = translate(rawFormulaKey[key])
            return [translate(formulaStr), formulaKey, constants.variables.indexOf(variableChar)]
        },
        "out": equation => toString.pretty(equation)
    }
}

export { simplifyExpression, doubleSidedSolve, substituteVariable, solveFormula };