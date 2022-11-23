import * as constants from "../constants.js"
import { toMachine, toString, debug, sort as bu2_sort } from "../private-alge.js";
import { Variable, Coefficient, Term } from "../classes.js";
import { GCF } from "../public/factor.js";

export default class Expression extends Array {
	//==========================================================================================================
	//----------------------------------------------------------------------------------------------------constructor
	//==========================================================================================================
	
	#sliceAtTerms(string) { //splice the string where there is a '+'(exclusive) or '-'(inclusive)
		return toMachine.split(string, '+', '-');
	} //end sliceAtTerms

	//---------------------------------------------------------------------------------------------constructor
	#stringConstructor(string) {
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


	//===========================================================================================================
	//-----------------------------------------------------------------------------------------------------getters
	//===========================================================================================================

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
		return new Expression(toString(this).slice(1, -1));
	}

	//=======================================================================================================
	//----------------------------------------------------------------------------------------------------modifiers
	//=======================================================================================================

	//--------------------------------------------------------------------------------------------------buford sort
	bufordSort() {
		bu2_sort.sortArrayObject(this);
	}

	//---------------------------------------------------------------------------------------------simplify
	simplify() {
		this.forEach(e => e.simplify());

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

		this.bufordSort();
	}

	//-----------------------------------------------------------------------------------------------------distribute
	distribute(termIndex, recursive=false) {
		if (!this[termIndex].isDistributable) return 1;
		let term = this[termIndex];

		//get the index of the expression within the term
		let expressionIndex = null;
		for (let i = 0; i < term.coefficients.length && expressionIndex === null; i++) {
			if (term.coefficients[i].base instanceof Expression && term.coefficients[i].exponent === 1) expressionIndex = i;
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
			this.distribute(this.indexOf(term), true);
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
	/*  */
	undistribute(...termIndexes) {
		debug.group("Undistribute", this);
		if (termIndexes.length < 1) termIndexes = this.map((_e, i) => i);
		
		// get terms
		let terms = [];
		termIndexes.forEach(i => terms.push(this[i].copy()));
		terms.forEach(term => bu2_sort.sort(term));
		debug.log("Terms to undistribute", terms);

		// make new term with constant set to the gcf of all the terms constants
		let newTerm = new Term(GCF(...terms.map(term => term.constant)));
		// divide all terms by gcf
		terms.forEach((term) => term.constant /= newTerm.constant);

		// get common coefficients
		let commonBases = terms[0].coefficients.map(e => e.base);
		terms.forEach((term) => {
			commonBases = commonBases.filter(cBase => (bu2_sort.findObject(cBase, term.coefficients.map(e => e.base)) !== -1));
		});
		debug.log("Common coefficients", commonBases);


		// determine whether to contine and modify data
		if (commonBases.length === 0 && newTerm.constant === 1) {
			debug.groupEnd("Undistribute canceled: No common factors");
			return 1;
		} else { // contine
			terms.forEach(term => {
				this.splice(bu2_sort.findObject(term, this), 1);
			});
			debug.log("Checks passed, deleting terms from expression")
		}
		


		// get exponents of common bases and add to new term
		commonBases.forEach(base => {
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


		// make change
		termIndexes.forEach(i => this.splice(i, 1)); // remove terms
		this.push(newTerm);

		
		this.bufordSort();
		debug.groupEnd("Undistribute", this);
		return 0;
	}
}