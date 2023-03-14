import { debug, sort as bu2_sort, toString } from "../../private/alge-func.js";
import { Term, Expression } from "../../private/alge-classes.js";
import * as constants from "../../private/constants.js"


export default function doubleSidedSolve(equation, variable) {
	debug.group("Double Sided Solve", equation);


    //===========================================================================================
    //-----------------------------------------------------------------------------------------main
    //===========================================================================================
    function main() {
        // compress both sides of the equation (distrubute, simplify)
        equation.left.compress();
        equation.right.compress();
        debug.log("Compress both sides", equation)
        
        // start the term phase
        // moves no variable terms to the right, variable terms to the left
        termPhase();

        // is there only one term that contains the variable?
        if (equation.left.length === 1) {
            debug.log("Variable reduced to 1 term");
            factorPhase();
        } else if (equation.left.length > 1) {
            debug.log(`Variable found in ${equation.left.length} terms`);
            solveForMultipleTerms()
        } else {
            debug.log(`The given variable "${constants.variables[variable]}" was not found`)
        }

        debug.groupEnd("Double Sided Solve", equation);
        return equation;
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
        
    */
    function solveForMultipleTerms() {
        debug.log("Solve for multiple terms", equation.left);
        // attempt to undistribute
        if (equation.left.undistribute() !== 1) {
            // set up variables
            let target = equation.left[0];
            let receivers;
            let factor = new Term(target.constant, target.coefficients.filter(coef => {
                if (coef.base instanceof Expression) {
                    receivers = coef.base;
                    return 0;
                } else return 1;
            }));

            // check if variable is factored out
            if (factor.hasVariable(variable) && !receivers.hasVariable(variable)) {
                debug.log("Variable sucessfully factored(undistributed) into single term");
                factorPhase();
            }
        }
    }
    //===========================================================================================
    //------------------------------------------------------------------------------------factor phase
    //===========================================================================================
    function factorPhase() {
        debug.group("Factor Phase", equation);

        let target = equation.left[0];

        //-------------------------------------------------move constant
        equation.right.forEach(rightTerm => rightTerm.constant /= target.constant);
        target.constant = 1;
        debug.log("Move Target's Constant", equation);

        //--------------------------------------------move other variables
        let removedCoefs = [];
        target.coefficients = target.coefficients.filter((coef) => { // remove extra coefs from term and add to array
            if (coef.hasVariable(variable) === false) {
                removedCoefs.push(coef);
                return false;
            } else return true;
        });
        equation.right.forEach((term) => { // add the extras to the other side
            term.coefficients = term.coefficients.concat(removedCoefs.map(coef => {
                let newCoef = coef.copy();
                newCoef.exponent *= -1;
                return newCoef;
            }));
        });
        equation.right.simplify();
        debug.log("Move Target's Other Variables", equation)

        debug.groupEnd("Factor Phase", equation);
    }

    
    return main()
}