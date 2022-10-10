import { Variable, Expression } from "../classes.js";
import * as toMachine from "../private-func/toMachine.js";
import toString from "../private-func/toString.js";


export default class Coefficient {
	//========================================================================================================================
	//-----------------------------------------------------------------------------------------------------------------constructor
	//========================================================================================================================
	
	#sliceAtExponent(string) {
		let base = ""
		let exponent = ""
		let parenStacks = [0, 0, 0]

		let i = 0;
		while (!(string[i] == "^" && (parenStacks[0] == 0 && parenStacks[1] == 0 && parenStacks[2] == 0)) && i < string.length) { // loop to ^ sign
			base += string[i]
			parenStacks = toMachine.checkParenthesis(parenStacks, string[i])
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
		if (this.base instanceof Variable) {
			if (variable === -1 || this.base.index === variable) hasVar = true;
		} else if (this.base instanceof Expression) {
			if (this.base.hasVariable(variable)) hasVar = true;
		}
		if (this.exponent instanceof Variable) {
			if (variable === -1 || this.exponent.index === variable) hasVar = true;
		} else if (this.exponent instanceof Expression) {
			if (this.exponent.hasVariable(variable)) hasVar = true;
		}
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
		if (isNaN(this.base) && !(this.base instanceof Variable)) this.base.simplify();
		if (isNaN(this.exponent) && !(this.base instanceof Variable)) this.exponent.simplify();
	}
}