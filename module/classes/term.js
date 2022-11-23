
import * as constants from "../constants.js";
import * as toMachine from "../private-alge/toMachine.js";
import { toString, sort as bu2_sort } from "../private-alge.js";
import {Coefficient, Expression} from "../classes.js";

export default class Term {
	//========================================================================================================================
	//-----------------------------------------------------------------------------------------------------------------constructor
	//========================================================================================================================
	
	#sliceAtFactors(string) { //splice the term into it's factors
		let symbolsAdded = '';
		let splitStr = string.split('');
		let lastType = 'none';
		let parenStacks = 0;

		splitStr.forEach((char, i) => {
			let thisType = 'none';
			if (constants.variables.includes(char)) thisType = char;
			else if (constants.numbers.includes(char)) thisType = 'num';
			else if (constants.parenthesis.slice(0,3).includes(char)) thisType = 'open paren';
			else if (constants.parenthesis.slice(3,6).includes(char)) thisType = 'close paren';
			else thisType = 'none';

			if (
				lastType !== thisType && 
				!['none', 'close paren'].includes(thisType) && 
				!['none', 'open paren'].includes(lastType) &&
				parenStacks < 1
			) {
				symbolsAdded += '*';
			}

			symbolsAdded += char;
			lastType = thisType;

			if (constants.parenthesis.includes(char)) parenStacks += (constants.parenthesis.slice(0, 3).includes(char)) ? 1 : -1
		});
		return toMachine.split(symbolsAdded, '*', '/')
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
		this.coefficients.forEach(coef => {
			if (coef.base instanceof Expression && coef.exponent === 1) return 1;
		});
		return 0;
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
		this.coefficients.forEach(e => e.simplify());
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