
import { toMachine, toString, debug, sort as bu2_sort } from "../functions.js";
import { Variable, Coefficient, Term } from "../classes.js";
import { GCF } from "../../../factor/public/functions.js";
import { specialCharacters as SCHAR } from "../constants.js";

export default class Expression extends Array {
	//=======================================================================
	//----------------------------------------------------------------------------------------------------constructor
	//=======================================================================
	
	#sliceAtTerms(string) { //splice the string where there is a '+'(exclusive) or '-'(inclusive)
		return toMachine.split(string, '+', ['-', SCHAR["@+-"]]);
	} //end sliceAtTerms

	//---------------------------------------------------------------------------------------------constructor
	#stringConstructor(string) {
		// console.log("Expression string", string);

		let slices = this.#sliceAtTerms(string);
		for (let i = 0; i<slices.length; i++) {
			this[i] = new Term(slices[i]);
		}
	}
	#manualConstructor(...terms) {
		terms.forEach(term => this.push(term));
	}
	constructor (...args) {
		super(0);

		if (typeof args[0] === "string") this.#stringConstructor(args[0]);
		
		else if (args.length > 1) this.#manualConstructor(...args);
	}


	//========================================================================
	//-----------------------------------------------------------------------------------------------------getters
	//========================================================================

	//------------------------------------------------------------------------------------------has variable
	hasVariable(variable=-1) {
		let hasVar = false;
		this.forEach(term => {
			if (term.hasVariable(variable)) hasVar = true;
		});
		return hasVar;
	}

	//-------------------------------------------------------------------------copy
	copy() {
		return new Expression(toString.basic(this).slice(1, -1));
	}

	//====================================================================
	//----------------------------------------------------------------------------------------------------modifiers
	//====================================================================

	//--------------------------------------------------------------------------------------------------buford sort
	bufordSort() {
		bu2_sort.sortArrayObject(this);
	}

	//---------------------------------------------------------------------------------------------simplify
	simplify() {
		// simplify all the terms
		this.forEach(e => e.simplify());

		// The end product
		let simplified = [];
		// For every term in myself
		this.forEach(term => {
			// A flag for if there is a match in simplified
			let matchFound = false;
			// For every entry in the 
			for (let i = 0; (i < simplified.length) && !matchFound; i++) {
				let simpTerm = simplified[i];
				if (term.compareTerms(simpTerm)) {
					simpTerm.constant.value += term.constant.value;
					matchFound = true;
				}
			}
			if (!matchFound) simplified.push(term);
		})
		this.splice(0);
		simplified.forEach(simpTerm => this.push(simpTerm));
		//remove meaningless terms
		this.slice().forEach(term => {
			if (term.constant.value === 0) this.splice(this.indexOf(term), 1);
		});

		this.bufordSort();
	}

	//-----------------------------------------------------------------------------------------------------distribute
	distribute(termIndex, recursive=false) {
		if (!this[termIndex].isDistributable) return 1;
		let term = this[termIndex];

		//get the index of the expression within the term
		let expressionIndex = null;
		for (let i = 0; i < term.coefficients.length && expressionIndex === null; i++) {
			if (term.coefficients[i].base instanceof Expression && term.coefficients[i].exponent.value === 1) expressionIndex = i;
		}
		// flag if exponent of expression is not 1
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

		this.splice(termIndex, 1);
		this.simplify();
		this.bufordSort();

		return 0;
	}

	//-----------------------------------------------------------------------------------------------------distribute all
	distributeAll(recursive=true) {
		this.slice().forEach(term => {
			this.distribute(this.indexOf(term), recursive);
		});
		debug.log("Distribute all", this);
	}

	//----------------------------------------------------------------------------------------------------compress
	compress() {
		debug.group("Compress expression", this);

		this.distributeAll();
		this.simplify();

		debug.groupEnd("Compress expression", this);
	}

	//------------------------------------------------------------------------------------------------------undistribute
	/* 
		Undistribute Expression
		DESC: Will attempt to find a common factor in the given terms (inputted as indexes). If 
	*/
	undistribute(...termIndexes) {
		debug.group("Undistribute", this);
		if (termIndexes.length < 1) termIndexes = this.map((_e, i) => i);
		
		// get actual terms from term indexes
		let terms = [];
		termIndexes.forEach(i => terms.push(this[i].copy()));
		terms.forEach(term => bu2_sort.sort(term));
		debug.log("Terms to undistribute", terms);

		// Create the new term. This will be the final product (ex. "3(a+b)")
		// Set the new term's constant to the GCF of all the constants of the terms being undistributed
		let newTerm = new Term(GCF(...terms.map(term => term.constant)));
		// Divide each of the terms being undistributed by this GCF (newTerm.constant)
		terms.forEach((term) => term.constant.value /= newTerm.constant.value);

		// Find the common coefficients (I call them bases here for some reason)
		// Get the bases of the first term. These will be used to compare to all the other terms.
		let commonBases = terms[0].coefficients.map(e => e.base);
		terms.forEach((term) => {
			// Filter out the original bases that are not in that term
			commonBases = commonBases.filter(cBase => (bu2_sort.findObject(cBase, term.coefficients.map(e => e.base)) !== -1));
		});
		debug.log("Common coefficients", commonBases);


		// Determine whether to continue.
		// If there was no common coefficients or any GCF
		if (commonBases.length === 0 && newTerm.constant.value === 1) {
			debug.groupEnd("Undistribute canceled: No common factors");
			return 1;
		}
		
		// DATA MODIFIED BEYOND THIS POINT

		// Get exponents of common bases and add to new term
		commonBases.forEach(base => {
			// Set the least exponent of the undistributed terms to infinity
			let leastExponent = Infinity;
			terms.forEach(term => {
				let exponent = term.coefficients[bu2_sort.findObject(base, term.coefficients.map(e => e.base))].exponent
				if (exponent < leastExponent) leastExponent = exponent;
			})
			// add to new term
			newTerm.coefficients.push(new Coefficient(base, leastExponent));
			// subtract exponent from old coef
			terms.forEach(term => term.coefficients[bu2_sort.findObject(base, term.coefficients.map(e => e.base))].exponent -= leastExponent);
		});
		debug.log("Factored out", newTerm);


		// simplify terms and add to back of new term
		terms.forEach(term => {
			term.simplify();
			bu2_sort.sort(term);
		});
		newTerm.coefficients.push(new Coefficient(new Expression(...terms), 1));
		debug.log("New expression", newTerm.coefficients[newTerm.coefficients.length-1]);


		// Delete factored terms from expression
		// Create a list of all the terms that need to be deleted
		let termsToDelete = termIndexes.map(i => this[i])
		// Now delete all the terms to delete
		termsToDelete.forEach(term => {
			this.splice(this.indexOf(term), 1)
		})
		
		// Add new total undistributed term to expression
		this.push(newTerm)

		this.bufordSort();
		debug.groupEnd("Undistribute", this);
		return 0;
	}
}