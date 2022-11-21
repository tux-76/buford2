
import * as constants from "../constants.js";
import * as toMachine from "../private-alge/toMachine.js";
import { toString, sort as bu2_sort } from "../private-alge.js";
import {Coefficient, Expression} from "../classes.js";

export default class Term {
	//========================================================================================================================
	//-----------------------------------------------------------------------------------------------------------------constructor
	//========================================================================================================================
	
	#sliceAtFactors(string) { //splice the term into it's factors
		let parenStacks = [0, 0, 0]; //create stacks for [parenthesis '()', bracket '[]', brace '{}']

		let factors = []; //array for factors
		let factorBuild = ""; //builder for factors
		for (let i=0; i<string.length; i++) { //loop through term string
			if (parenStacks[0] === 0 && parenStacks[1] === 0 && parenStacks[2] === 0) { //if there are no open parenthesis
				if ( //if implied multiplication with parenthesis
					constants.parenthesis.includes(string[i]) && //the current character is parenthesis
					!(constants.operators.includes(string[i-1])) && //there is no operator in front of the paren
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
				} else if (constants.variables.includes(string[i]) && !(constants.operators.includes(string[i-1]))) { //if the char is a variable and theres no operator in front
					if (factorBuild !== "") { //if the build isn't empty
						factors.push(factorBuild);
					}
					factorBuild = string[i];
				} else if (constants.numbers.includes(string[i])) { //if it's a number
					if (constants.variables.includes(factorBuild)) { //if the term builder is a variable
						factors.push(factorBuild); //push it because the next will be a new term
						factorBuild = "";
					}
					factorBuild += string[i];
				} else { //if its none of those
					factorBuild += string[i];
				}
				
			}//paren check

			else { //if parenthesis is open
				factorBuild += string[i];
			}
		
			parenStacks = toMachine.checkParenthesis(parenStacks, string[i]); //keep the paren stack up to date
		} //end term loop
		if (factorBuild !== "") { //if it there are leftovers
			factors.push(factorBuild);
		}
		
		return factors;
	}//sliceAtFactors

	//-------------------------------------------------------------------------------------------constructor
	constant = 1;
	coefficients = [];
	#stringConstuctor(mathString) {
		//main
		let slices = this.#sliceAtFactors(mathString);
		slices.forEach(factor => { //for all the factors of the term:
			let factorType = toMachine.interpretMathString(factor);

			if (factorType.type === "num") {
				if (factorType.influence === "div") { //if the number is divided: set to reciprocal
					this.constant *= Math.pow(parseFloat(factor.slice(1)), -1); // constant * factor(without '/') ^ -1
				} else { //the number is just as is
					this.constant *= parseFloat(factor);
				}
			} else {
				this.coefficients.push(new Coefficient(factor));
			}
		});
	}
	#manualConstructor(constant, coefficients=[]) {
		this.constant = constant;
		this.coefficients = coefficients;
	}
	constructor(arg1, arg2) {
		if (typeof arg1 === "string") this.#stringConstuctor(arg1);
		else this.#manualConstructor(arg1, arg2);
	}



	//========================================================================================================================
	//-------------------------------------------------------------------------------------------------------------------getters
	//========================================================================================================================

	//-----------------------------------------------------------------------------------------------has variable
	hasVariable(variable=-1) {
		let hasVar = false;
		this.coefficients.forEach(coef => {
			if (coef.hasVariable(variable)) hasVar = true;
		});
		return hasVar;
	}

	//------------------------------------------------------------------------------------------------------is distributable
	get isDistributable() {
		let flag = false;
		this.coefficients.forEach(coef => {
			if (coef.base instanceof Expression) flag = true;
		});
		return flag;
	}

	//---------------------------------------------------------------------------------------------compare terms
	compareTerms(term) {
		return (toString(this, "no constant") == toString(term, "no constant"));
	}

	//------------------------------------------------------------------------------------------------copy
	copy() {
		return new Term(toString(this));
	}

	

	//========================================================================================================================
	//-------------------------------------------------------------------------------------------------------------------modifiers
	//========================================================================================================================
	//-------------------------------------------------------------------------add
	/*
		- BOTH THIS AND TERM MUST BE SORTED
		- COEFFICIENTS MUST BE THE SAME!
	*/
	add(term) {
		this.constant += term.constant
		this.coefficients.forEach((coef, i) => coef.exponent += term.coefficients[i].exponent);
		bu2_sort.sort(this);
	}

	//--------------------------------------------------------------------------------------------------multiply
	multiply(term) {
		this.constant *= term.constant;
		term.coefficients.forEach(coef => {
			this.coefficients.push(new Coefficient(coef.base, coef.exponent));
		});
		bu2_sort.sort(this);
	}

	//-------------------------------------------------------------------------------------------------------simplify
	simplify() {
		let coefs = this.coefficients.filter(coef => {
			coef.simplify();
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
				if (toString(coef.base) === toString(simpCoef.base)) {
					simpCoef.exponent += coef.exponent;
					matchFound = true;
				}
			}
			if (!matchFound) simplified.push(coef);
		});
		this.coefficients = simplified;
		// remove meaningless coefficients
		this.coefficients = this.coefficients.filter((coef) => {
			if (coef.base === 1 || coef.exponent === 0) return false;
			else return true;
		});
		bu2_sort.sort(this);
	}

	//--------------------------------------------------------------------------------------------------------flatten exponent
	flattenExponent(coefIndex) {
		let coef = this.coefficients[coefIndex];
		if (!isNaN(coef.exponent)) {
			for (let i = 0; i < Math.abs(coef.exponent)-1; i++) {
				let newCoef = coef.copy();
				newCoef.exponent = (coef.exponent > 0) ? 1 : -1;
				this.coefficients.push(newCoef);
			}
			coef.exponent = (coef.exponent > 0) ? 1 : -1;
		} else console.error("Flatten exponent only accepts numerical exponents.");
		bu2_sort.sort(this);
	}
}