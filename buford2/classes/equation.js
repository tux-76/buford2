import {Expression} from "./main.js"
import * as constants from "../constants.js"

export default class Equation {
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
		if (sliced[0].length > 2) throw new Buford2Error("Equation cannot have more than 2 expressions!");

		this.left = new Expression(sliced[0][0]);
		this.right = new Expression(sliced[0][1]);
		this.operation = constants.operationSymbols.indexOf(sliced[1][0]);
	}


	//------------------------------------------------------swap sides
	swap() {
		let oldRight = this.right.slice();
		this.right = this.left.slice();
		this.left = oldRight;
	}
}