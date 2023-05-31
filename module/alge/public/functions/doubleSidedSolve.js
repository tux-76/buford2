/*
    BUFORD 2 DOUBLE SIDED SOLVE

    DESC:
        Solves a two sided equation. Will perform arithmetic means to reach the target

    TARGET:
        ULTIMATE: Isolate the variable on the left side of the equation
        SECONDARY: Create a highly simplized for 

    CAN DO:
        - 
*/
import { debug, sort as bu2_sort, toString } from "../../private/functions.js";
import { Coefficient, Term, Expression } from "../../private/classes.js";
import * as constants from "../../private/constants.js"
import "../config.js"
import config from "../config.js";

export default function doubleSidedSolve(equation, variable) {
	debug.group("Double Sided Solve", equation);


    //===========================================================================================
    //-----------------------------------------------------------------------------------------main
    //===========================================================================================
    function main() {
        // Pre Phase: just gets it ready to be dealt with
        prePhase();

        // Term Phase
        // moves no variable terms to the right, variable terms to the left
        termPhase();

        // Factorish Phase
        // is there only one term that contains the variable?
        if (equation.left.length === 1) {
            debug.log("Variable reduced to 1 term");
            factorPhase();
        } else if (equation.left.length > 1) {
            debug.log(`Variable found in ${equation.left.length} terms`);
            solveForMultipleTerms()
        } else {
            // There are 0 instances of the variable
            debug.log(`The given variable "${constants.variables[variable]}" was not found`)
        }

        // Exponent Phase
        // If the above methods suceeded in isolating the variable from Terms, the constant of the variabled term, and Coefficients
        if (equation.left.length === 1 && equation.left[0].constant === 1 && equation.left[0].coefficients.length === 1) {
            debug.log("The variable has been isolated from terms and coefficients")
            let variableCoef = equation.left[0].coefficients[0]
            // If the coef's exponent is NOT 1 (exponent of 1 means removing the exponent is pointless)
            if (variableCoef.exponent !== 1) {
                exponentPhase()
            }
        }

        // Return
        debug.groupEnd("Double Sided Solve", equation);
        return equation;
    }
    //===========================================================================================
    //------------------------------------------------------------------------------------term phase
    //===========================================================================================
    function prePhase() {
        // Compression
        // compress both sides of the equation (distrubute, simplify)
        equation.left.compress();
        equation.right.compress();
        debug.log("Compress both sides", equation)
        
        // Check for if there are multiple equations (or basically if theres a plus or minus)
        let mulitpleEquations = false
        equation.left.concat(equation.right).forEach(term => {
            if (term.plusMinus) mulitpleEquations = true;
        })

    }

    //===========================================================================================
    //------------------------------------------------------------------------------------term phase
    //===========================================================================================
    /*
        Term Phase Part 1
        Jobs:
            - Move all the terms on the left side WITHOUT variable to the right
            - Simplify the right side
            - Move all terms on the right WITH variable to the left
            - Simplify the left side
    */
    function termPhase() {
        debug.group("Term Phase", equation);

        //move terms in L without variable to R
        equation.left = equation.left.filter((term) => {
            if (term.hasVariable(variable)) return true;
            else {
                let termCopy = term.copy();
                termCopy.constant *= -1;
                equation.right.push(termCopy);
            }
        });

        //simplify R
        equation.right.simplify();
        debug.log("Move non-variables to R, simplify R", equation);

        //move terms in R with variable to L
        equation.right = equation.right.filter((term) => {
            if (!term.hasVariable(variable)) return true;
            else {
                let termCopy = term.copy();
                termCopy.constant *= -1;
                equation.left.push(termCopy);
            }
        });

        //simplify L
        equation.left.simplify();
        debug.log("Move non-variables to L, simplify L", equation);
        debug.groupEnd("Term Phase", equation); //end term phase
    }

    /*
        Solve For Multiple Terms
        DESC: Will attempt to factor a single variable out of multiple terms. EX: ax + bx = c --> x(a + b) = c --> x = c / (a + b)
        STEPS:
            - Undistribute the variable side
            - Create a term without the factored expression and isolate the expression
            - Make sure:
                1) The term that was factored out has the variable in it
                2) The factored expression does NOT have the variable in it
                EX: x(3+a): Good
            - If true: Move to factor phase
    */
    function solveForMultipleTerms() {
        debug.group("Solve for multiple terms", equation);
        // attempt to undistribute (0 = Undistributed, 1 = Not possible)
        if (equation.left.undistribute() === 0) {
            // The target is the term that contains the un-distributed expression
            let target = equation.left[0];
            // The factor expression is the expression in the target
            let factorExpression;
            // Create a new term without the expression coefficient
            let factor = new Term(target.constant, target.coefficients.filter(coef => {
                if (coef.base instanceof Expression) {
                    factorExpression = coef.base;
                    return 0;
                } else return 1;
            }));

            // check if variable is factored out
            if (factor.hasVariable(variable) && !factorExpression.hasVariable(variable)) {
                debug.log("Variable sucessfully factored(undistributed) into single term");
                factorPhase();
            }
        }

        debug.groupEnd("Solve for multiple terms", equation);
    }
    //===========================================================================================
    //------------------------------------------------------------------------------------factor phase
    //===========================================================================================
    /*
        Factor Phase
        WHEN: There is only one term with a variable in it (in equation.left)
        DESC: Will move all coefficients to the other side of the equation, as well as the constant (number).
        STEPS:
            - Divide all terms (right and left) by the constant of the target (variabled term)

    */
    function factorPhase() {
        debug.group("Factor Phase", equation);
        
        // Do checks and give errors
        if (equation.left.length !== 1) 
            console.error("Factor Phase", `Must only have one variable on the left side, ${equation.left.length} were given!`)

        // The target term, the one we will isolate the variable in 
        let target = equation.left[0];

        // Divide both sides by the constant of the target
        equation.right.forEach(rightTerm => rightTerm.constant /= target.constant);
        target.constant = 1;
        debug.log("Move Target's Constant", equation);

        // Remove the coefs without the target variable in the target term
        let removedCoefs = [];
        target.coefficients = target.coefficients.filter((coef) => { // remove extra coefs from term and add to array
            if (coef.hasVariable(variable) === false) {
                removedCoefs.push(coef);
                return false;
            } else return true;
        });
        // Add the coefficients that were removed to each term on the other side
        equation.right.forEach((term) => { 
            term.coefficients = term.coefficients.concat(removedCoefs.map(coef => {
                let newCoef = coef.copy();
                newCoef.exponent *= -1;
                return newCoef;
            }));
        });
        // Simplify the right side
        equation.right.simplify();
        debug.log("Move Target's Other Variables", equation)

        debug.groupEnd("Factor Phase", equation);
    }

    // =============================================================================
    // ---------------------------------------------------------------------exponent phase
    // =============================================================================
    /*
        Exponent Phase
        WHEN: There is only one term and all the coefficients have been removed from the variable
        DESC: Removes the exponent from the variable
        STEPS:
            - If the exponent of the variable is a number:
                - Get the reciprocal and raise the other half of the equation by it
            - If not: cry
    */
    function exponentPhase() {
        debug.group("Exponent Phase", equation)

        let variableCoef = equation.left[0].coefficients[0]
        // If the exponent is a number, not anything crazy like variables or expressions
        if (typeof variableCoef.exponent === "number") {
            // Raise the right side of the equation by the exponent
            // Create new coefficient with base as the right side and new exponent as reciprocal of variable exponent
            //   EX: 2a + b => Coef:(2a + b)^0.5
            let newRightSideCoef = new Coefficient(equation.right.copy(), Math.pow(variableCoef.exponent, -1))
            // Delete the right side (to replace it with the exponent version)
            equation.right.splice(0, equation.right.length)
            // Add a new term with the coefficient to the right side
            equation.right.push(new Term(1, [newRightSideCoef]))
            // Set the varible's exponent to 1
            variableCoef.exponent = 1
            debug.log(`Cancel power (${variableCoef.exponent}): Raise by right by reciprocal`, equation)
            // Simplify the right side
            equation.right.simplify()
            debug.log("Simplify", equation)
        } else debug.log("Buford2 cannot compute non-numerical exponents at this time :(")


        debug.groupEnd("Exponent Phase", equation)
    }


    // END END END END END 
    return main()
}