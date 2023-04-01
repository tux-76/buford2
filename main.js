/*
	Buford2 main file.
	For an easy to use gui for each of the public functions, head to https://tux-76.github.io/buford2
*/

import * as algeFunc from "./module/alge/public/functions.js";
import * as factor from "./module/factor/public/functions.js"
import * as formulas from "./module/alge/public/formulas.js"





/*
	Buford2 home structure setup

	alge:
		An empty object, functions will be added with their inputs and outputs changed
*/
let Buford2 = {};
Buford2.factor = factor;


// =========================================================================================
// -----------------------------------------------------------algebra function inputs and stuff
// =========================================================================================
Buford2.alge = {};
// loop through all the algebra exports except for the user modifications
for (const key in algeFunc) if (key !== "userMods") {
	const rawFunc = algeFunc[key]
	const inputMod = algeFunc.userMods[key].in
	const outputMod = algeFunc.userMods[key].out
	// Create the function in Buford2
	Buford2.alge[key] = function (...args) {
		// Return function with the input and output modified
		// Distribute the string arguements to inputMod, then distribute that into the raw func and then modify the output
		return outputMod(rawFunc(...inputMod(...args)))
	}
}

// Add formulas
Buford2.alge.formulas = formulas




// =========================================================================================
// --------------------------------------------------------------------------------------export
// =========================================================================================
export default Buford2;
console.log("Buford2 module exported.");

/*
-------Written by Tux76-------

Timeline:
	-SAT 11:15 02/12/2022: Buford2 Algebra started
	-SAT 15:38 04/30/2022: Multidimensional array system working??? [Machine readable matrix]
	-MON 20:57 05/09/2022: Just started using VS code after moving to Pop!_OS. It turns out to be a whole lot better than the default text editor I was using previously :)
	-SAT 17:10 05/14/2022: About to change the way the machine readable part works :/ I don't want to have exponents as operation arrays anymore. It seemed to make since in theory but did not work out practicaly.
	-MON 20:08 09/12/2022: Changed the data structure once again. This time we have classes for Expression, Term, and Coefficient. This allows for more specialized methods involving each.
	-SUN 09:34 09/25/2022: First operational version of "simplify expression" mode!
	-MON 19:36 09/26/2022: We are now caught up to the first version of Buford in functionality! Yet this time with a long road of improvement ahead :)
	-THU 19:52 10/06/2022: Attempt to change the structure to a more modular based approach. A little bit difficult because I don't know how to keep all the ties to other functions I've created. But it succeeded in the end.
	-FRI 11:55 11/25/2022: Create rough dynamic site for Buford2 (Dynamic in updating with updates to "index.json"). Looking really classy at https://tux-76.github.io/buford2
	-SUN 14:35 03/19/2023: New year! Also a month past Buford2's birthdate (more like conception date).
*/