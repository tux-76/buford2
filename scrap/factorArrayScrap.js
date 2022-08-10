class bu2_FactorArray extends bu2_OperationArray { 
	type = "FactorArray";
	
	constructor (arg1) { //-------------------------------------------constructor
		if (typeof arg1 === "string") { //if expected input:
			bu2_debug_groupC(`FactorArray Constructor ("${arg1}")`); //debug
			
			super(bu2_toMachine_sliceAtFactors(arg1));
			
			bu2_debug_groupEnd(); //debug
		} else if (arg1 instanceof Array) {
			super(0);
			arg1.map((e, i) => this[i] = e);
		} else super(arg1); //acception handling for other input
	} //constructor

	getCoefficients() {
		if (!sorted) bu2_simplify_sort(this);
		return this.slice(1);
	}

	toUserOutput() {

	}
}




/* ---------------------------------------------------------------------------------------------------------------factorSimplify
*IN: Any instance of a factor array
*DESC: Loops through the factor array. It will catagorize each element by MathematicalConstant, MathematicalVariable, and OperationArray.
	*If it is a constant it will be multiplied by the constant variable (which will be put at the front of the output array).
	*If it is a mathematical variable then it will check for identical variables in the output. If it finds an identical 
	variable then it will add it's exponent to it's twin. If it does not find an identical variable then it will add it to the output.
	*If it is an operation array then it will sort it, and then check for matches in the same manner as the variable.
*BUGS: Cannot add exponents that are not of primary int value.
*/
function bu2_simplify_factorArraySimplify(factorArray) {
	bu2_debug_groupC("bu2_simplify_factorArraySimplify");

	let constant = 1;
	let variables = [];
	let opArrays = [];

	factorArray.map((factor) => {
		if (factor instanceof bu2_MathematicalConstant) { //-------------------------------constant
			constant *= factor.val;
		} else if (factor instanceof bu2_MathematicalVariable) { //-------------------------variable
			let matchFound = false;
			for (i = 0; i < variables.length && !matchFound; i++) {//loop through the variables that are already processed
				if (variables[i].index === factor.index) { //if they are the same variable
					//add the exponents
					variables[i].exponent = bu2_simplify_add(variables[i].exponent, factor.exponent);
					matchFound = true;
				}
			}
			if (!matchFound) variables.push(factor);
		} else if (factor instanceof bu2_OperationArray) { //-------------------------operation array
			bu2_simplify_sort(factor);
			let matchFound = false;
			for (i = 0; i < opArrays.length && !matchFound; i++) {//loop through the oparrays that are already processed
				//check if they have the same contents
				if (bu2_compareOperationArray(opArrays[i], factor)) {
					//add the exponents
					opArrays[i].exponent = bu2_simplify_add(opArrays[i].exponent, factor.exponent);
					matchFound = true;
				}
			}
			if (!matchFound) opArrays.push(factor);
		} else console.error(`The following value was not recognized:`, factor);
	});

	constant = new bu2_MathematicalConstant(constant);
	factorArray.splice(0, factorArray.length, constant, ...variables, ...opArrays);
	if (factorArray.length == 1) factorArray = factorArray[0];

	bu2_debug_groupEnd();
	bu2_debug_log("bu2_simplify_factorArraySimplify", "OUT", factorArray.slice());
	return factorArray;
}





/* --------------------------------------------------------------------------------------------------------------termSimplify
*IN: Any instance of a term array

*/
function bu2_simplify_termSimplify(termArray) {
	let constant = 0
	let otherTerms = []
}

