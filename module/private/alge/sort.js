
import * as classes from "../alge-classes.js";
import * as toString from "./toString.js";

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
	let correspondingStrArr = [...array.map(e => toString.basic(e))];

	//create and organize sortedStrArr
	let sortedStrArr = correspondingStrArr.slice().sort();

	//create sorted array with the actual values
	let sortedArray = sortedStrArr.map((string) => array[correspondingStrArr.indexOf(string)]);
	sortedArray.forEach((str, i) => array[i] = str); //set this object's values to the sorted array
}

export function findObject(needle, haystack=[]) {
	return haystack.map(e => toString.basic(e)).indexOf(toString.basic(needle));
}