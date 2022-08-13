
/*
	*Buford2 private functions
*/

//==========================================================================================================
//-------------------------------------------------------------------------------------------------------debug
//==========================================================================================================

var bu2_debug_doDebug = true;

function bu2_debug_log(funcName, descriptor, message) {
	if (bu2_debug_doDebug) console.log("%cDEBUG|%c|" + funcName + "|%c|" + descriptor + ":", "color: #ff0000", "color:#079127", "color:#2c9c90", message);
}

function bu2_debug_group(funcName) {
	if (bu2_debug_doDebug) console.group("%cDEBUG|%c|" + funcName, "color: #ff0000", "color:#2c9c90");
}
function bu2_debug_groupC(funcName) {
	if (bu2_debug_doDebug) console.groupCollapsed("%cDEBUG|%c|" + funcName, "color: #ff0000", "color:#2c9c90");
}
function bu2_debug_groupEnd() {
	if (bu2_debug_doDebug) console.groupEnd();
}
function bu2_debug_printMatrix(matrix) {
	if (bu2_debug_doDebug) {
		bu2_debug_groupC(matrix.type);
		matrix.map((e, i) => {
			if (Array.isArray(e))
				bu2_debug_printMatrix(e);
			else {
				//bu2_debug_groupC(isNaN(e) ? ` ${e.character} (Variable)` : ` ${e} (Number)`); bu2_debug_groupEnd();
				bu2_debug_log("PRINT", e.type === "MathematicalVariable" ? `Variable` : `Number`, e.type === "MathematicalVariable" ? e.character : e.val);
			}
		});
		bu2_debug_groupEnd();
	}
}



//==========================================================================================================
//-----------------------------------------------------------------------------------------------string slicing
//==========================================================================================================

const bu2_const_variables = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
const bu2_const_numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-'];
const bu2_const_parenthesis = ['(', '[', '{', ')', ']', '}'];
const bu2_const_operators = ['=', '<', '>', '+', '-', '*', '/', '^', '#'];



//--------------------------------------------------------------------------------------slice at expressions
function bu2_toMachine_sliceAtExpressions(string) { 
	let expressionArray = []; //an array for the spliced terms
	let operations = [];
	
	let expressionBuild = ""; //create a string for concatinating chars to 
	for (i=0; i<string.length; i++) { //start slice loop
		if (string[i] === '=') { //if the character is a '='
			expressionArray.push(expressionBuild);
			expressionBuild = "";
			operations.push(string[i]);
		} else if (string[i] === '<') { //if the character is a '<'
			expressionArray.push(expressionBuild);
			expressionBuild = "";
			operations.push(string[i]);
		} else if (string[i] === '>') { //if the character is a '>'
			expressionArray.push(expressionBuild);
			expressionBuild = "";
			operations.push(string[i]);
		} else { //if the character is neither
			expressionBuild += string[i]; //keep building the term
		}
	} //slice loop
	expressionArray.push(expressionBuild);
	
	//bu2_debug_log("sliceAtExpressions", "out", [expressionArray.slice(), operations.slice()]);
	return [expressionArray, operations];
}





//==========================================================================================================
//--------------------------------------------------------------------------------------------convert to machine
//==========================================================================================================
//--------------------------------------------------------------------------------check parenthesis
function bu2_toMachine_checkParenthesis(parenStacks, char) {
	if (char === '(') {
		parenStacks[0] += 1;
	}
	else if (char === '[') {
		parenStacks[1] += 1;
	}
	else if (char === '{') {
		parenStacks[2] += 1;
	}
	
	//check for closing parens
	else if (char === ')') {
		parenStacks[0] -= 1;
	}
	else if (char === ']') {
		parenStacks[1] -= 1;
	}
	else if (char === '}') {
		parenStacks[2] -= 1;
	}
	return parenStacks
}

//-------------------------------------------------------------------------------identify string
function bu2_toMachine_interpretMathString(mathString) {
	let type = {
		influence: "nul",
		type: "err"
	}
	if (mathString[0] === "/") {
		type.influence = "div";
	}
	if (!isNaN(mathString)) {
		type.type = "num";
	} else if (bu2_const_variables.includes(mathString)) {
		type.type = "var";
	} else if (bu2_const_parenthesis.includes(mathString[0]) && bu2_const_parenthesis(mathString[mathString.length-1])) {
		type.type = "exp";
	} else {
		type.type = "nxt";
	}
	return type
}

//------------------------------------------------------------------------------coefficient
class bu2_Coefficient {
	#sliceAtExponents(string) {
		let parenStacks = [0, 0, 0]; //create stacks for [bu2_const_parenthesis '()', bracket '[]', brace '{}']
		
		let exponents = [];
		let exponentBuild = "";
		for (i=0; i<string.length; i++) {
			if (parenStacks[0] === 0 && parenStacks[1] === 0 && parenStacks[2] === 0) { //if there are no openbu2_const_parenthesis
				if (string[i] === '^') {
					exponents.push(exponentBuild);
					exponentBuild = "";
				} else if (string[i] === '/') { //if theres a little divide action
					return ["(" + string.slice(1) + ")", -1]
				} else {
					exponentBuild += string[i];
				}
			} else { //if there is still an open parenthesis set
				exponentBuild += string[i];
			}
			
			parenStacks = bu2_toMachine_checkParenthesis(parenStacks, string[i]); //keep paren stack up to date
		} //loop
		exponents.push(exponentBuild);
		
		//bu2_debug_log("sliceAtExponents", "out", exponents.slice());
		return exponents;
	} //sliceAtExponents

	constructor (mathString) {

	}
}


//--------------------------------------------------------------------------------term
class bu2_Term {
	sliceAtFactors(string) { //splice the term into it's factors
		let parenStacks = [0, 0, 0]; //create stacks for [parenthesis '()', bracket '[]', brace '{}']

		let factors = []; //array for factors
		let factorBuild = ""; //builder for factors
		for (let i=0; i<string.length; i++) { //loop through term string
			if (parenStacks[0] === 0 && parenStacks[1] === 0 && parenStacks[2] === 0) { //if there are no open parenthesis
				if ( //if implied multiplication with parenthesis
					bu2_const_parenthesis.includes(string[i]) && //the current character is parenthesis
					!(bu2_const_operators.includes(string[i-1])) && //there is no operator in front of the paren
					!(factorBuild === "") //there is a term to be pushed
				) { 
					factors.push(factorBuild);
					factorBuild = "(";
				} else if (string[i] === '*') { //if its a multiplication
					factors.push(factorBuild);
					factorBuild = "";
				} else if (string[i] === '/') { //if it's division
					factors.push(factorBuild);
					factorBuild = "/"; //converting division into multiplication
				} else if (string[i] === '-') { //if theres a subtraction
					factors.push(-1);
				} else if (bu2_const_variables.includes(string[i]) && !(bu2_const_operators.includes(string[i-1]))) { //if the char is a variable and theres no operator in front
					if (factorBuild !== "") { //if the build isn't empty
						factors.push(factorBuild);
					}
					factorBuild = string[i];
				} else if (bu2_const_numbers.includes(string[i])) { //if it's a number
					if (bu2_const_variables.includes(factorBuild)) { //if the term builder is a variable
						factors.push(factorBuild); //push it because the next will be a new term
						factorBuild = "";
					}
					factorBuild += string[i];
				} else { //if its none of those
					factorBuild += string[i];
				}
				
			}//paren check

			else { //ifbu2_const_parenthesis is open
				factorBuild += string[i];
			}
		
			parenStacks = bu2_toMachine_checkParenthesis(parenStacks, string[i]); //keep the paren stack up to date
		} //end term loop
		if (factorBuild !== "") { //if it there are leftovers
			factors.push(factorBuild);
		}
		
		//bu2_debug_log("sliceAtFactors", "out", factors.slice());
		return factors;
	}//sliceAtFactors

	constructor(mathString) {
		let slices = this.sliceAtFactors(mathString);
		this.constant = 1
		this.coefficients = []

		for (i=0; i<slices.length; i++) { //for all the factors of the term:
			let factor = slices[i];
			let factorType = bu2_toMachine_interpretMathString(factor);
			if (factorType.influence === "div") { //remove the divide sign if division
				factor = factor.slice(1)
			}

			if (factorType.type === "num") {
				if (factorType.influence === "div") { //if the number is divided: set to reciprocal
					constant *= Math.pow(parseFloat(factor), -1);
				} else { //the number is just as is
					constant *= parseFloat(factor);
				}
			} else if (factorType.type === "var") {
				this.coefficients.push(new bu2_Coefficient(factor))
			} else if (factorType.type === "exp") {
				this.coefficients.push(new bu2_Expression(factor.slice(1, factor.length-1)))
			}
		}
	}
}

class bu2_Expression extends Array {
	#sliceAtTerms(string) { //splice the string where there is a '+'(exclusive) or '-'(inclusive)
		let termArray = []; //an array for the spliced terms
		let parenStacks = [0, 0, 0]; //create stacks for [parenthesis '()', bracket '[]', brace '{}']
		
		let termBuild = ""; //create a string for concatinating chars to 
		for (i=0; i<string.length; i++) { //start slice loop
			if (parenStacks[0] === 0 && parenStacks[1] === 0 && parenStacks[2] === 0) { //if there are no open parenthesis
				if (string[i] === '+') { //if the character is a '+'
					//push the term and empty the builder
					termArray.push(termBuild);
					termBuild = "";
				} else if (string[i] === '-') { //if the character is a '-'
					//push the term and empty the builder
					termArray.push(termBuild);
					termBuild = "-"; //add negative
				} else { //if the character is neither
					termBuild += string[i]; //keep building the term
				}
			} //end paren check
			
			else { //if the parens arn't closed
				termBuild += string[i]; //keep building the term
			}
			
			parenStacks = bu2_toMachine_checkParenthesis(parenStacks, string[i]); //keep paren stack up to date
		} //end splice loop
		termArray.push(termBuild);
		
		//bu2_debug_log("sliceAtTerms", "out", termArray.slice());
		return termArray;
	} //end sliceAtTerms

	constructor (string) {
		let slices = this.#sliceAtTerms(string)

		for (i=0; i<slices.length; i++) {
			
		}
	}
}





//==========================================================================================================
//----------------------------------------------------------------------------------------------------the end!
//==========================================================================================================

console.log("Buford2 header sucessfully loaded");
