
/*
	*Buford2 private functions
*/


//==========================================================================================================
//-------------------------------------------------------------------------------------------------------debug
//==========================================================================================================

var bu2_doDebug = true;

class Buford2Error extends Error {
	constructor(message) {
		super(message);
	}
}

let titleColor = "color: #c63915";
let logColor = "color: #a3642a";
let arrowColorOut = "color: #1da588";
let arrowColorIn = "color: #b144c9";
let normalColor = "color: #878d94";

function bu2_debug_log(title, output) {
	if (bu2_doDebug) {
		if (output === undefined) console.log(`%c! ${title} !`, logColor);

		else if (typeof output === "string") console.log(`%c${title} %c=> %c${output}`, logColor, arrowColorOut, normalColor);

		else console.log(`%c${title} %c=> %c${bu2_toString(output, "no parenthesis")}`, logColor, arrowColorOut, normalColor);
	}
}
function bu2_debug_group(title, input, collapsed=1) {
	if (bu2_doDebug) {
		let string = (typeof input === "string") ? input : bu2_toString(input, "no parenthesis");
		if (collapsed) console.groupCollapsed(`%c${title} %c<= %c${string}`, titleColor, arrowColorIn, normalColor);
		else console.group(`%c${title} %c<= %c${string}`, titleColor, arrowColorIn, normalColor);
	}
}
function bu2_debug_groupEnd(title, output) {
	if (bu2_doDebug) {
		console.groupEnd();
		bu2_debug_log(title, output)
	}
}

//==========================================================================================================
//-----------------------------------------------------------------------------------------------string slicing
//==========================================================================================================




//==========================================================================================================
//--------------------------------------------------------------------------------------------convert to machine
//==========================================================================================================








//===============================================================================================================
//--------------------------------------------------------------------------------------------------------------sort
//===============================================================================================================

//------------------------------------------------------------sort
function bu2_sort(object) {
	if (object instanceof bu2_Variable || !isNaN(object)) return "number" //do not do anything to variables or numbers
	else if (object instanceof bu2_Coefficient) {
		bu2_sort(object.base);
		bu2_sort(object.exponent);
	}
	else if (object instanceof bu2_Term) bu2_sortArrayObject(object.coefficients);
	else if (object instanceof bu2_Expression) bu2_sortArrayObject(object);
	else if (object instanceof bu2_Equation) {
		bu2_sortArrayObject(object.left);
		bu2_sortArrayObject(object.right);
	}
	else console.error("bu2_sort could not handle value:", object);
}

//----------------------------------------------------------sort array object
function bu2_sortArrayObject(array) { //sorts array objects (term's coefficents property, expression itself)
	array.forEach(e => bu2_sort(e)); //sort all values within this object
	
	//create string array with values corresponding to the real ones
	let correspondingStrArr = [...array.map(e => bu2_toString(e))];

	//create and organize sortedStrArr
	let sortedStrArr = correspondingStrArr.slice().sort();
	sortedStrArr.slice().forEach((e, i) => {
		if (bu2_const_parenthesis.includes(e[0])) { //if the first character is a parenthesis
			sortedStrArr.splice(i, 1); //remove the element
			sortedStrArr.push(e); //put it at the end
		}
	})

	//create sorted array with the actual values
	let sortedArray = sortedStrArr.map((string) => array[correspondingStrArr.indexOf(string)]);
	sortedArray.forEach((str, i) => array[i] = str); //set this object's values to the sorted array
}


//===============================================================================================================
//----------------------------------------------------------------------------------------------------------simplify
//===============================================================================================================
function bu2_compareTerms(term1, term2) {
	return (bu2_toString(term1, "no constant") == bu2_toString(term2, "no constant"));
}


//==========================================================================================================
//----------------------------------------------------------------------------------------------------the end!
//==========================================================================================================

console.log("Buford2 header sucessfully loaded");
