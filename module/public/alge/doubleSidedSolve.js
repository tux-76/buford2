import { debug, sort as bu2_sort, toString } from "../../private/alge-func.js";
import { Term, Expression } from "../../private/alge-classes.js";
import * as constants from "../../private/constants.js"


export default function doubleSidedSolve(equation, variable) {
	debug.group("Double Sided Solve", equation);

    //===========================================================================================
    //------------------------------------------------------------------------------------term phase
    //===========================================================================================
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
        //move terms in R without variable to L
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

    function multiTerm() {
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

    //===========================================================================================
    //-----------------------------------------------------------------------------------------main
    //===========================================================================================
	equation.left.compress();
	equation.right.compress();
    debug.log("Compress both sides", equation)
	
	termPhase();

	if (equation.left.length === 1) {
        debug.log("Variable reduced to 1 term");
        factorPhase();
    } else if (equation.left.length > 1) {
        debug.log(`Variable found in ${equation.left.length} terms`);
        multiTerm()
    } else {
        debug.log(`The given variable "${constants.variables[variable]}" was not found`)
    }

	debug.groupEnd("Double Sided Solve", equation);
	return equation;
}