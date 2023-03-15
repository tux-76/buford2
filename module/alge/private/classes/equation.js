import {Expression} from "../../alge-classes.js"
import * as constants from "../../constants.js"

export default class Equation {
	//========================================================================================================================
	//-----------------------------------------------------------------------------------------------------------------constructor
	//========================================================================================================================
	
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
		
		return [expressionArray, operations];
	}

	operation = null;
	left = null;
	right = null;

	constructor(mathString) {
		let sliced = this.#sliceAtExpressions(mathString);
		let equation = sliced[0];
		if (equation.length > 2) console.error("Equation cannot have more than two expressions! (Try system of equations!)");
		else if (equation.length < 2) console.error("Equation must have two sides! (=, <, >)");

		this.left = new Expression(sliced[0][0]);
		this.right = new Expression(sliced[0][1]);
		this.operation = constants.operationSymbols.indexOf(sliced[1][0]);
	}

	//========================================================================================================================
	//-------------------------------------------------------------------------------------------------------------------getters
	//========================================================================================================================


	//========================================================================================================================
	//-------------------------------------------------------------------------------------------------------------------modifiers
	//========================================================================================================================
	//------------------------------------------------------swap sides
	swap() {
		let oldRight = this.right.slice();
		this.right = this.left.slice();
		this.left = oldRight;
	}
}