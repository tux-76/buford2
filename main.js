/*
	Buford2 main file.
	For an easy to use gui for each of the public functions, head to https://tux-76.github.io/buford2
*/

import * as algeFunctions from "./module/alge/public/functions.js";
import * as factor from "./module/factor/public/functions.js";
import * as formulas from "./module/alge/public/formulas.js";
import { debug } from "./module/alge/private/functions.js";
import "./module/alge/public/config.js";
import config from "./module/alge/public/config.js";




/*
	Buford2 home structure setup

	config: configuration
		settings: The active settings
		default: The default settings
	alge:
		An empty object, functions will be added with their inputs and outputs changed
	factor:
		All factor functions
*/
let Buford2 = {};
Buford2.factor = factor;
Buford2.config = config;

// =========================================================================================
// -----------------------------------------------------------algebra function inputs and stuff
// =========================================================================================
Buford2.alge = {};
// loop through all the algebra exports except for the user modifications
for (const functionKey in algeFunctions) if (functionKey !== "userMods") {
	// The main function with input values 
	const baseFunc = algeFunctions[functionKey]
	// Input mod variable
	const inputMod = algeFunctions.userMods[functionKey].in
	if (inputMod === undefined) debug.error(`Input modifier for ${functionKey} isn't set up right`)
	// Output mod variable
	const outputMod = algeFunctions.userMods[functionKey].out
	if (outputMod === undefined) debug.error(`Output modifier for ${functionKey} isn't set up right`)
	// Create the function in Buford2
	Buford2.alge[functionKey] = function (...args) {
		// Return function with the input and output modified
		// Distribute the string arguements to inputMod, then distribute that into the raw func and then modify the output
		return outputMod(baseFunc(...inputMod(...args)))
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
-------Written by Jonas Blackwood-------

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