//------------------------------------------------------------------term phase
function termPhase() {
    bu2_debug_group("Term Phase", equation);
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
    bu2_debug_log("Move non-variables to R, simplify R", equation);
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
    bu2_debug_log("Move non-variables to L, simplify L", equation);
    bu2_debug_groupEnd("Term Phase", equation); //end term phase
}

//------------------------------------------------------------------factor phase
function factorPhase() {
    bu2_debug_log("Variable reduced to 1 term");
    bu2_debug_group("Factor Phase", equation);

    let term = equation.left[0];
    //move constant
    equation.right.forEach(rightTerm => {
        rightTerm.constant /= term.constant;
    });
    term.constant = 1;
    bu2_debug_log("Move Target's Constant", equation);
    
    //move other variables
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
    bu2_debug_log("Move Target's Other Variables", equation)

    bu2_debug_groupEnd("Factor Phase", equation);
}

//------------------------------------------------------------------------------main
export default function doubleSidedSolve(equation, variable) {
	bu2_debug_group("Double Sided Solve", equation);

	bu2_simplifyExpression(equation.left);
	bu2_simplifyExpression(equation.right);

	bu2_sort()
	
	termPhase();

	if (equation.left.length === 1) {
		factorPhase();
	}

	bu2_debug_groupEnd("Double Sided Solve", equation);
	return equation;
}