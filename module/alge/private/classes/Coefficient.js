import { Variable, Term, Expression, NumberValue } from "../classes.js";
import * as toMachine from "../functions/toMachine.js";
import * as toString from "../functions/toString.js";


export default class Coefficient {
	//=====================================================================================
	//-----------------------------------------------------------------------------------------------------------------constructor
	//=====================================================================================
	
	#sliceAtExponent(string) {
		let split = toMachine.split(string, '^', '#');
		return [split[0], split.slice(1).join('^')];
	} //sliceAtExponents

	base = null;
	exponent = null;

	//---------------------------------------------------------------constructor
	#stringConstuctor(coefStr) {
		// console.log("Coef string", coefStr);

		//slice input to base and exponent
		let sliced = this.#sliceAtExponent(coefStr);
		let baseStr = sliced[0];
		let exponentStr = sliced[1];
		
		// Handle Exponent Str
		let exponentType = toMachine.interpretMathString(exponentStr);
		if (exponentType.type === "emp")
			this.exponent = new NumberValue(1)
		else
			this.exponent = toMachine.translate(exponentStr)

		//handle base str division
		let baseType = toMachine.interpretMathString(baseStr);
		if (baseType.influence === "div") { //if division
			baseStr = baseStr.slice(1) //remove sign
			if (this.exponent instanceof NumberValue) { //if exponent is number
				this.exponent.value *= -1; //invert
			} else { //if not number

			}
		}

		//handle base str
		if (baseType.type === "neg") {
			this.base = new NumberValue(-1);
		} else {
			this.base = toMachine.translate(baseStr)
		}
	}
	#manualConstructor(base, exponent) {
		this.base = base;
		this.exponent = exponent;
	}
	constructor (arg1, arg2) {
		if (typeof arg1 === "string") this.#stringConstuctor(arg1);
		else this.#manualConstructor(arg1, arg2);
	}


	//=====================================================================================
	//-------------------------------------------------------------------------------------------------------------------getters
	//=====================================================================================

	//---------------------------------------------------------------has variable
	hasVariable(variable=-1) {
		let hasVar = false;
		if (this.base instanceof Variable)
			if (variable === -1 || this.base.index === variable) hasVar = true;
		else if (this.base instanceof Expression) 
			if (this.base.hasVariable(variable)) hasVar = true;
		if (this.exponent instanceof Variable)
			if (variable === -1 || this.exponent.index === variable) hasVar = true;
		else if (this.exponent instanceof Expression)
			if (this.exponent.hasVariable(variable)) hasVar = true;
		return hasVar;
	}

	//--------------------------------------------------------------copy
	copy() {
		return new Coefficient(toString.basic(this));
	}

	//---------------------------------------------------------------is numerical
	isNumerical() {return (this.base instanceof NumberValue && this.exponent instanceof NumberValue)}; //determines if coefficient has objects or variables

	
	//=====================================================================================
	//-----------------------------------------------------------------------------------modifiers
	//=====================================================================================

	//----------------------------------------------------------------simplify
	simplify() {
		// Check if unnecessary expression is present and remove if so
		// Expressions that are just a coefficient (one term, that term has no coefficients)
		if (this.base instanceof Expression) if (this.base.length === 1) {
			let term = this.base[0];
			if (term.coefficients.length === 0) {
				this.base = term.constant;
			}
		}

		this.base.simplify()
		this.exponent.simplify()
	}
}