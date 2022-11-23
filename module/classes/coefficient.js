import { Variable, Term, Expression } from "../classes.js";
import * as toMachine from "../private-alge/toMachine.js";
import toString from "../private-alge/toString.js";


export default class Coefficient {
	//========================================================================================================================
	//-----------------------------------------------------------------------------------------------------------------constructor
	//========================================================================================================================
	
	#sliceAtExponent(string) {
		let split = toMachine.split(string, '^', '#');
		return [split[0], split.slice(1).join('^')];
	} //sliceAtExponents

	base = null;
	exponent = null;

	//---------------------------------------------------------------constructor
	#stringConstuctor(coefStr) {
		//slice input to base and exponent
		let sliced = this.#sliceAtExponent(coefStr);
		let baseStr = sliced[0];
		let exponentStr = sliced[1];
		
		//handle exponent str
		let exponentType = toMachine.interpretMathString(exponentStr);
		if (exponentType.type === "num") this.exponent = parseFloat(exponentStr);
		else if (exponentType.type === "emp") this.exponent = 1;
		else console.error(`Input error for string "${exponentStr}": only numerical values are allowed for exponents at this moment :(`);

		//handle base str division
		let baseType = toMachine.interpretMathString(baseStr);
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
			this.base = new Variable(baseStr);
		} else if (baseType.type === "exp") {
			this.base = new Expression(baseStr.slice(1, baseStr.length-1));
		} else console.error(`Coefficient base type "${baseType.type}" does not have a handler.`);
	}
	#manualConstructor(base, exponent) {
		this.base = base;
		this.exponent = exponent;
	}
	constructor (arg1, arg2) {
		if (typeof arg1 === "string") this.#stringConstuctor(arg1);
		else this.#manualConstructor(arg1, arg2);
	}


	//========================================================================================================================
	//-------------------------------------------------------------------------------------------------------------------getters
	//========================================================================================================================

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
		return new Coefficient(toString(this));
	}

	//---------------------------------------------------------------is numerical
	isNumerical() {return (!isNaN(this.base) && !isNaN(this.exponent))}; //determines if coefficient has objects or variables

	
	//========================================================================================================================
	//-------------------------------------------------------------------------------------------------------------------modifiers
	//========================================================================================================================

	//----------------------------------------------------------------simplify
	simplify() {
		// check if unnecessary expression is present and remove if so
		if (this.base instanceof Expression) if (this.base.length === 1) {
			let term = this.base[0];
			if (term.coefficients.length === 0) {
				this.base = term.constant;
			}
		}

		if (isNaN(this.base) && !(this.base instanceof Variable)) this.base.simplify();
		if (isNaN(this.exponent) && !(this.base instanceof Variable)) this.exponent.simplify();
	}
}