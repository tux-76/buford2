
/*
	*Buford2 private functions
*/

//==========================================================================================================
//-------------------------------------------------------------------------------------------------------debug
//==========================================================================================================

var bu2_debug_doDebug = true;

class Buford2Error extends Error {
	constructor(message) {
		super(message);
	}
}

function bu2_debug_log(funcName, descriptor, ...messages) {
	if (bu2_debug_doDebug) console.log("%cDEBUG|%c|" + funcName + "|%c|" + descriptor + ":", "color: #ff0000", "color:#079127", "color:#2c9c90", ...messages);
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
const bu2_operationSymbols = ['=', '<', '>'];


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
		mathString = mathString.slice(1);
	}
	if (mathString === "") {
		type.type = "emp";
	} else if (!isNaN(mathString)) {
		type.type = "num";
	} else if (bu2_const_variables.includes(mathString)) {
		type.type = "var";
	} else if (bu2_const_parenthesis.includes(mathString[0]) && bu2_const_parenthesis.includes(mathString[mathString.length-1])) {
		type.type = "exp";
	} else {
		type.type = "non";
	}
	return type
}

//==========================================================================================================
//------------------------------------------------------------------------------------------------------classes
//==========================================================================================================

//------------------------------------------------------------------------------variable
class bu2_Variable {
	constructor (char) {
		this.index = bu2_const_variables.indexOf(char);
		if (this.index === -1) console.error(`Character "${char}" is not a valid variable.`);
	}
	get char() {
		return bu2_const_variables[this.index];
	}
}

//------------------------------------------------------------------------------coefficient
class bu2_Coefficient {
	#sliceAtExponent(string) {
		let base = ""
		let exponent = ""
		let parenStacks = [0, 0, 0]

		let i = 0;
		while (!(string[i] == "^" && (parenStacks[0] == 0 && parenStacks[1] == 0 && parenStacks[2] == 0)) && i < string.length) { // loop to ^ sign
			base += string[i]
			parenStacks = bu2_toMachine_checkParenthesis(parenStacks, string[i])
			i++;
		}
		i++;
		while(i < string.length) { // set exponent to everything after ^ sign
			exponent += string[i];
			i++;
		}

		return [base, exponent];
	} //sliceAtExponents

	base = null;
	exponent = null;

	constructor (coefStr) {
		bu2_debug_groupC(`Coefficient constructor: ${coefStr}`);

		//slice input to base and exponent
		let sliced = this.#sliceAtExponent(coefStr);
		let baseStr = sliced[0];
		let exponentStr = sliced[1];
		
		//handle exponent str
		let exponentType = bu2_toMachine_interpretMathString(exponentStr);
		if (exponentType.type === "num") this.exponent = parseFloat(exponentStr);
		else if (exponentType.type === "emp") this.exponent = 1;
		//else this.exponent = new bu2_Expression(exponentStr);
		else console.error(`Input error for string "${exponentStr}": only numerical values are allowed for exponents at this moment :(`);

		//handle base str division
		let baseType = bu2_toMachine_interpretMathString(baseStr);
		if (baseType.influence === "div") { //if division
			baseStr = baseStr.slice(1) //remove sign
			if (!isNaN(this.exponent)) { //if exponent is number
				this.exponent *= -1; //invert
			} else { //if not number

			}
		}

		//handle base str
		if (baseType.type === "num") {
			this.base = parseFloat(baseStr)
		} else if (baseType.type === "var") {
			this.base = new bu2_Variable(baseStr);
		} else if (baseType.type === "exp") {
			this.base = new bu2_Expression(baseStr.slice(1, baseStr.length-1));
		} else console.error(`Coefficient base type "${baseType.type}" does not have a handler.`);
		bu2_debug_log("Coefficient constructor", "base", this.base);
		bu2_debug_log("Coefficient constructor", "exponent", this.exponent);
		bu2_debug_groupEnd();
	}

	isNumerical() {return (!isNaN(this.base) && !isNaN(this.exponent))}; //determines if coefficient has objects or variables

	simplify() {
		if (isNaN(this.base) && !(this.base instanceof bu2_Variable)) this.base.simplify();
		if (isNaN(this.exponent) && !(this.base instanceof bu2_Variable)) this.exponent.simplify();
	}
}

//--------------------------------------------------------------------------------term
class bu2_Term {
	#sliceAtFactors(string) { //splice the term into it's factors
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


	//---------------------------------------------constructor
	constant = 1;
	coefficients = [];
	#stringConstuct(mathString) {
		bu2_debug_groupC(`Term constructor (string): ${mathString}`);

		//main
		let slices = this.#sliceAtFactors(mathString);
		slices.forEach(factor => { //for all the factors of the term:
			let factorType = bu2_toMachine_interpretMathString(factor);

			if (factorType.type === "num") {
				if (factorType.influence === "div") { //if the number is divided: set to reciprocal
					this.constant *= Math.pow(parseFloat(factor.slice(1)), -1); // constant * factor(without '/') ^ -1
				} else { //the number is just as is
					this.constant *= parseFloat(factor);
				}
			} else {
				this.coefficients.push(new bu2_Coefficient(factor));
			}
		});

		bu2_debug_log("Term Constructor", "constant", this.constant);
		bu2_debug_log("Term Constructor", "coefficients", this.coefficients);
		bu2_debug_groupEnd();
	}
	#manualConstruct(constant, coefficients=[]) {
		this.constant = constant;
		this.coefficients = coefficients;
	}
	constructor(arg1, arg2) {
		if (typeof arg1 === "string") this.#stringConstuct(arg1);
		else this.#manualConstruct(arg1, arg2);
	}

	//-----------------------------------------copy
	copy() {
		return new bu2_Term(this.constant, this.coefficients);
	}

	//-----------------------------------------multiply
	multiply(term) {
		this.constant *= term.constant;
		this.coefficients = this.coefficients.concat(term.coefficients);
	}

	//-----------------------------------------simplify
	simplify() {
		let coefs = this.coefficients.filter(coef => {
			if (coef.isNumerical()) {
				this.constant *= Math.pow(coef.base, coef.exponent);
				return false;
			} else return true;
		});

		let simplified = [];
		coefs.filter((coef, ci) => {
			let matchFound = false;
			for (let sci = 0; sci < simplified.length && !matchFound; sci++) {
				let simpCoef = simplified[sci];
				if (bu2_toString(coef.base) == bu2_toString(simpCoef.base)) {
					simpCoef.exponent += coef.exponent;
					matchFound = true;
				}
			}
			if (!matchFound) simplified.push(coef);
		});
		this.coefficients = simplified;
	}

	//---------------------------------------is distributable
	get isDistributable() {
		let flag = false;
		this.coefficients.forEach(coef => {
			if (coef.base instanceof bu2_Expression) flag = true;
		});
		return flag;
	}
}

//--------------------------------------------------------------------------------expression
class bu2_Expression extends Array {
	#sliceAtTerms(string) { //splice the string where there is a '+'(exclusive) or '-'(inclusive)
		let slicedTerms = []; //an array for the spliced terms
		let parenStacks = [0, 0, 0]; //create stacks for [parenthesis '()', bracket '[]', brace '{}']
		
		let termBuild = ""; //create a string for concatinating chars to 
		for (let i = 0; i<string.length; i++) { //start slice loop
			if (parenStacks[0] === 0 && parenStacks[1] === 0 && parenStacks[2] === 0) { //if there are no open parenthesis
				if (string[i] === '+') { //if the character is a '+'
					//push the term and empty the builder
					slicedTerms.push(termBuild);
					termBuild = "";
				} else if (string[i] === '-') { //if the character is a '-'
					//push the term and empty the builder
					if (termBuild !== "") slicedTerms.push(termBuild);
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
		slicedTerms.push(termBuild);
		
		//bu2_debug_log("sliceAtTerms", "out", termArray.slice());
		return slicedTerms;
	} //end sliceAtTerms

	//----------------------------------------------------constructor
	constructor (string) {
		if (typeof string === "string") { 
			bu2_debug_groupC(`Expression constructor: ${string}`);

			super(0);
			let slices = this.#sliceAtTerms(string);

			for (let i = 0; i<slices.length; i++) {
				this[i] = new bu2_Term(slices[i]);
			}

			bu2_debug_groupEnd();
		} else super(string);
	}

	//---------------------------------------------------buford sort
	bufordSort() {
		bu2_sortArrayObject(this);
	}

	//---------------------------------------------------simplify
	simplify() {
		let simplified = [];
		this.forEach(term => {
			let matchFound = false;
			for (let i = 0; (i < simplified.length) && !matchFound; i++) {
				let simpTerm = simplified[i];
				if (bu2_compareTerms(term, simpTerm)) {
					simpTerm.constant += term.constant;
					matchFound = true;
				}
			}
			if (!matchFound) simplified.push(term);
		})
		this.splice(0);
		simplified.forEach(simpTerm => this.push(simpTerm));
	}

	//-----------------------------------------------------distribute
	distribute(termIndex, recursive=false) {
		let term = this[termIndex]; this.splice(termIndex, 1);
		let expressionIndex = null;
		for (let i = 0; i < term.coefficients.length && expressionIndex === null; i++) {
			if (term.coefficients[i].base instanceof bu2_Expression) expressionIndex = i;
			console.log(term.coefficients[i].base)
		}
		console.log("expr", expressionIndex, term)
		let expression = term.coefficients[expressionIndex].base; term.coefficients.splice(expressionIndex, 1);
		let newTerms = [];
		expression.forEach((distributingTerm) => {
			let newTerm = term.copy();
			newTerm.multiply(distributingTerm);
			newTerms.push(newTerm);
		});
		newTerms.forEach(e => this.push(e));
	}
}

//---------------------------------------------------------------------------------two sided equation
class bu2_Equation {
	#sliceAtExpressions(string) { 
		let expressionArray = []; //an array for the spliced terms
		let operations = [];
		
		let expressionBuild = ""; //create a string for concatinating chars to 
		for (let i=0; i<string.length; i++) { //start slice loop
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

	operation = null;
	left = null;
	right = null;

	constructor(mathString) {
		bu2_debug_groupC(`Equation constructor: ${mathString}`);

		let sliced = this.#sliceAtExpressions(mathString);
		if (sliced[0].length > 2) throw new Buford2Error("bu2_TwoSidedEquation cannot have more than 2 expressions!");

		this.left = new bu2_Expression(sliced[0][0]);
		this.right = new bu2_Expression(sliced[0][1]);
		this.operation = bu2_operationSymbols.indexOf(sliced[1][0]);

		bu2_debug_groupEnd();
	}


	//------------------------------------------------------swap sides
	swap() {
		let oldRight = this.right.slice();
		this.right = this.left.slice();
		this.left = oldRight;
	}

	//------------------------------------------------------move terms
	moveTerms(termSide, ...termIndexes) {
		let reciever = (termSide === 1) ? 0 : 1;
		
		termIndexes.forEach((index) => {
			let term = this[termSide][index];

			term.constant *= -1;
			this[reciever].push(term);
		});

		//remove moved elements from original place
		this[termSide] = this[termSide].filter((e, i) => !termIndexes.includes(i));

		bu2_debug_log("bu2_TwoSidedEquation", "moveTerms", "terms", ...termIndexes, "move to side", termSide);
	}
}



//===============================================================================================================
//--------------------------------------------------------------------------------------------------------------sort
//===============================================================================================================
/*----------------------------------------------------------to string
	MODES: "normal", "no constant", "no parenthesis"
*/
function bu2_toString(value, mode="normal") {
	if (!isNaN(value)) return value.toString();

	else if (value instanceof bu2_Variable) return value.char;

	else if (value instanceof bu2_Coefficient) return bu2_toString(value.base) + ((value.exponent !== 1) ? ("^" + bu2_toString(value.exponent)) : "");

	else if (value instanceof bu2_Term) {
		let string = ((value.constant !== 1 || value.coefficients.length < 1) && !(mode === "no constant")) ? bu2_toString(value.constant) : ""; //add constant num if not 1 and more coefficients
		value.coefficients.forEach((coef) => {
			if (!isNaN(coef.base) && string.length > 0) string += "*";
			string += bu2_toString(coef);
		});
		return string;
	}
	else if (value instanceof bu2_Expression) {
		let string = ""
		if (!(mode === "no parenthesis")) {
			value.forEach((e) => string += bu2_toString(e) + "+"); 
			string = string.substring(0, string.length-1/*remove the + at the end*/);
			return `(${string})`;
		} else {
			value.forEach((e) => string += bu2_toString(e) + " + "); 
			string = string.substring(0, string.length-3/*remove the + at the end*/);
			return string;
		}
	}
	else if (value instanceof bu2_Equation) {
		side1 = bu2_toString(value.left, "no parenthesis");
		side2 = bu2_toString(value.right, "no parenthesis");
		return side1 + ` ${bu2_operationSymbols[value.operation]} ` + side2;
	}
	else console.error(`bu2_toString did not recognize value:`, value);
}

//------------------------------------------------------------sort
function bu2_sort(object) {
	if (object instanceof bu2_Variable || !isNaN(object)) return "number" //do not do anything to variables or numbers
	else if (object instanceof bu2_Coefficient) {
		bu2_sort(object.base);
		bu2_sort(object.exponent);
	}
	else if (object instanceof bu2_Term) bu2_sortArrayObject(object.coefficients);
	else if (object instanceof bu2_Expression) bu2_sortArrayObject(object);
	else if (object instanceof bu2_Equation) {
		bu2_sortArrayObject(object.left);
		bu2_sortArrayObject(object.right);
	}
	else console.error("bu2_sort could not handle value:", object);
}

//----------------------------------------------------------sort array object
function bu2_sortArrayObject(array) { //sorts array objects (term's coefficents property, expression itself)
	array.forEach(e => bu2_sort(e)); //sort all values within this object
	
	//create string array with values corresponding to the real ones
	let correspondingStrArr = [...array.map(e => bu2_toString(e))];

	//create and organize sortedStrArr
	let sortedStrArr = correspondingStrArr.slice().sort();
	sortedStrArr.slice().forEach((e, i) => {
		if (bu2_const_parenthesis.includes(e[0])) { //if the first character is a parenthesis
			sortedStrArr.splice(i, 1); //remove the element
			sortedStrArr.push(e); //put it at the end
		}
	})

	//create sorted array with the actual values
	let sortedArray = sortedStrArr.map((string) => array[correspondingStrArr.indexOf(string)]);
	sortedArray.forEach((str, i) => array[i] = str); //set this object's values to the sorted array
}


//===============================================================================================================
//----------------------------------------------------------------------------------------------------------simplify
//===============================================================================================================
function bu2_compareTerms(term1, term2) {
	return (bu2_toString(term1, "no constant") == bu2_toString(term2, "no constant"));
}


//==========================================================================================================
//----------------------------------------------------------------------------------------------------the end!
//==========================================================================================================

console.log("Buford2 header sucessfully loaded");
