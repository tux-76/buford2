import * as constants from "../constants.js";
import * as classes from "../classes.js";
import toString from "./toString.js";

//------------------------------------------------------------sort
export function sort(object) {
	if (object instanceof classes.Variable || !isNaN(object)) return "number" //do not do anything to variables or numbers
	else if (object instanceof classes.Coefficient) {
		sort(object.base);
		sort(object.exponent);
	}
	else if (object instanceof classes.Term) sortArrayObject(object.coefficients);
	else if (object instanceof classes.Expression) sortArrayObject(object);
	else if (object instanceof classes.Equation) {
		sortArrayObject(object.left);
		sortArrayObject(object.right);
	}
	else console.error("sort could not handle value:", object);
}

//----------------------------------------------------------sort array object
export function sortArrayObject(array) { //sorts array objects (term's coefficents property, expression itself)
	array.forEach(e => sort(e)); //sort all values within this object
	
	//create string array with values corresponding to the real ones
	let correspondingStrArr = [...array.map(e => toString(e))];

	//create and organize sortedStrArr
	let sortedStrArr = correspondingStrArr.slice().sort();
	sortedStrArr.slice().forEach((e, i) => {
		if (constants.parenthesis.includes(e[0])) { //if the first character is a parenthesis
			sortedStrArr.splice(i, 1); //remove the element
			sortedStrArr.push(e); //put it at the end
		}
	})

	//create sorted array with the actual values
	let sortedArray = sortedStrArr.map((string) => array[correspondingStrArr.indexOf(string)]);
	sortedArray.forEach((str, i) => array[i] = str); //set this object's values to the sorted array
}