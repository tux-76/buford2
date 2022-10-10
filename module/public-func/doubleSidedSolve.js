import { debug, sort } from "../private-func.js";
import * as constants from "../constants.js"


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

    //===========================================================================================
    //------------------------------------------------------------------------------------factor phase
    //===========================================================================================
    function factorPhase() {
        debug.group("Factor Phase", equation);

        let term = equation.left[0];

        //-------------------------------------------------move constant
        equation.right.forEach(rightTerm => {
            rightTerm.constant /= term.constant;
        });
        term.constant = 1;
        debug.log("Move Target's Constant", equation);
        
        //--------------------------------------------move other variables
        let removedCoefs = [];
        term.coefficients = term.coefficients.filter((coef) => { // remove extra coefs from term and add to array
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
    sort.sort(equation);
	equation.left.compress();
	equation.right.compress();
    debug.log("Compress both sides", equation)
	
    sort.sort(equation);
	termPhase();

    sort.sort(equation);
	if (equation.left.length === 1) {
        debug.log("Variable reduced to 1 term");
        factorPhase();
    } else if (equation.left.length > 1) {
        debug.log(`Variable found in ${equation.left.length} terms`);
    } else {
        console.error(`The given variable "${constants.variables[variable]}" was not found!`)
    }
    sort.sort(equation);

	debug.groupEnd("Double Sided Solve", equation);
	return equation;
}