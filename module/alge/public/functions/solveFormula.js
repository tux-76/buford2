import { Equation, Expression, Variable } from "../../private/classes.js"
import { debug } from "../../private/functions.js"
import * as constants from "../../private/constants.js"
import { doubleSidedSolve, substituteVariable } from "../functions.js"

/*
    SOLVE FORMULA

    DESC: Will solve the formula inputted and return a version solved for the variable.

    INPUTS: 
        1: Fomula Equation
        2: Formula key {VARIABLE_INDEX: REPLACEMENT_OBJ} such as: {0: Expression}
        3: Variable index to solve for (can be left blank if only one variable has not been specified)
*/

export default function solveFormula(formula, formulaKey, variableToSolveFor) {
    // If the formula comes as an expression, make it an equation like this: α = formula expression (yes, with the alpha symbol)
    if (!(formula instanceof Equation)) {
        formula = new Equation(new Expression("α"), formula, constants.equalitySymbols.indexOf("="));
        // Set the variable to solve for to to the new variable on the other side
        if (variableToSolveFor === -1) variableToSolveFor = formula.left[0].coefficients[0].base.index
    }

    // Debug
    debug.group("solveFormula", formula)
    debug.log("Solve for variable", constants.variables[variableToSolveFor] || "none given")

    // The output of the formula with the variables subtituted with values
    let output = formula.copy()

    // Substitute variables from formulaKey
    // For every variable INDEX in the key (FORMAT: {Variable: Sub})
    for (const variableIndex in formulaKey) {
        debug.log(`Sub variable: "${constants.variables[variableIndex]}"`, formulaKey[variableIndex])
        // Substitute the variable in the output
        // NOTE: variableIndex is actually a string (because it is part of an object or something), so we will convert it into an integer
        substituteVariable(output, parseInt(variableIndex), formulaKey[variableIndex])
    }

    // Solve
    doubleSidedSolve(output, variableToSolveFor)

    debug.groupEnd("solveFormula", output)
    return output
}