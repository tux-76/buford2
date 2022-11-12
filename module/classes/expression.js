import { toMachine, debug, sort } from "../algebra-private.js";
import { Variable, Term } from "../classes.js";

export default class Expression extends Array {
	//========================================================================================================================
	//-----------------------------------------------------------------------------------------------------------------constructor
	//========================================================================================================================
	
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
			
			parenStacks = toMachine.checkParenthesis(parenStacks, string[i]); //keep paren stack up to date
		} //end splice loop
		slicedTerms.push(termBuild);
		
		return slicedTerms;
	} //end sliceAtTerms

	//---------------------------------------------------------------------------------------------constructor
	constructor (string) {
		if (typeof string === "string") { 
			super(0);
			let slices = this.#sliceAtTerms(string);

			for (let i = 0; i<slices.length; i++) {
				this[i] = new Term(slices[i]);
			}
		} else super(string);
	}


	//========================================================================================================================
	//-------------------------------------------------------------------------------------------------------------------getters
	//========================================================================================================================

	//------------------------------------------------------------------------------------------has variable
	hasVariable(variable=-1) {
		let hasVar = false;
		this.forEach(term => {
			if (term.hasVariable(variable)) hasVar = true;
		});
		return hasVar;
	}

	//========================================================================================================================
	//-------------------------------------------------------------------------------------------------------------------modifiers
	//========================================================================================================================

	//--------------------------------------------------------------------------------------------------buford sort
	bufordSort() {
		sort.sortArrayObject(this);
	}

	//---------------------------------------------------------------------------------------------simplify
	simplify() {
		this.forEach(term => {
			term.simplify();
		});
		let simplified = [];
		this.forEach(term => {
			let matchFound = false;
			for (let i = 0; (i < simplified.length) && !matchFound; i++) {
				let simpTerm = simplified[i];
				if (term.compareTerms(simpTerm)) {
					simpTerm.constant += term.constant;
					matchFound = true;
				}
			}
			if (!matchFound) simplified.push(term);
		})
		this.splice(0);
		simplified.forEach(simpTerm => this.push(simpTerm));
		//remove meaningless terms
		this.slice().forEach(term => {
			if (term.constant === 0) this.splice(this.indexOf(term), 1);
		});
	}

	//-----------------------------------------------------------------------------------------------------distribute
	distribute(termIndex, recursive=false) {
		if (!this[termIndex].isDistributable) return 1;
		let term = this[termIndex]; this.splice(termIndex, 1);

		//get the index of the expression within the term
		let expressionIndex = null;
		for (let i = 0; i < term.coefficients.length && expressionIndex === null; i++) {
			if (term.coefficients[i].base instanceof Expression) expressionIndex = i;
		}
		let expression = term.coefficients[expressionIndex].base; term.coefficients.splice(expressionIndex, 1);

		//start distributing
		let newTerms = [];
		expression.forEach((distributingTerm) => {
			let newTerm = term.copy();
			newTerm.multiply(distributingTerm);
			newTerms.push(newTerm);
		});
		newTerms.forEach(e => this.push(e));

		//recurse if set to
		if (recursive) {
			newTerms.forEach(newTerm => {
				if (newTerm.isDistributable) this.distribute(this.indexOf(newTerm), true);
			});
		}

		return 0;
	}

	//-----------------------------------------------------------------------------------------------------distribute all
	distributeAll(recursive=true) {
		this.slice().forEach(term => {
			this.distribute(this.indexOf(term), true);
		});
	}

	//----------------------------------------------------------------------------------------------------compress
	compress() {
		this.distributeAll();
		this.bufordSort();
		this.simplify();
	}

	//------------------------------------------------------------------------------------------------------undistribute
	undistribute(...termIndexes) {
		// get terms
		let terms = [];
		if (termIndexes.length > 0) termIndexes.forEach((e) => terms.push(this[e]))
		else this.forEach((e) => terms.push(e))

		// get variables
		let allVariables = []
		terms.forEach((term) => {
			term.coefficients.forEach((coef) => {
				if (coef.base instanceof Variable) {
					if (!allVariables.includes(coef.base.index)) allVariables.push(coef.base.index);
				}
			});
		});
		console.log(terms, allVariables);

		// undistribute constant
		
	}
}