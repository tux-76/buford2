/*
	Buford2 main file.
	For an easy to use gui for each of the public functions, head to https://tux-76.github.io/buford2
*/


import {Variable, Coefficient, Term, Expression, Equation} from "./module/private/alge-classes.js";
import * as constants from "./module/private/constants.js";
import { debug, toString } from "./module/private/alge-func.js"

import * as algeFunc from "./module/public/alge.js";
import * as factor from "./module/public/factor.js"

let Buford2 = {alge:{}};
Buford2.factor = factor;

function algeFunctionInputs(mode, string, ...otherArgs) {
	if (mode === "simplifyExpression") 
		return algeFunc[mode](new Expression(string));
	else if (mode === "doubleSidedSolve") 
		return algeFunc[mode](new Equation(string), constants.variables.indexOf(otherArgs[0]));
	else if (mode === "substituteVariable") 
		return algeFunc[mode](new Expression(string), constants.variables.indexOf(otherArgs[0]), otherArgs[1]);
}

function algebraFunctionWrap(mode, ...args) {
	debug.group(`Buford2`, `"${args[0]}"`, 0);
	debug.log("Mode", mode);
	let retr;

	//format string
	let string = args[0];
	string = string.split(" ").join("");
	string = string.split("--").join("+")
	debug.log("Format String", `"${string}"`);
	
	retr = algeFunctionInputs(mode, string, ...args.slice(1));

	debug.groupEnd("Buford2", retr);
	return toString.basic(retr, "no parenthesis");
}

// add all functions as wrapped
for (const key in algeFunc) {
	Buford2.alge[key] = (...args) => algebraFunctionWrap(key, ...args);
}

export default Buford2;
console.log("Buford2 module exported.");

/*
-------Written by c1uq92-------

Timeline:
	-SAT 11:15 02/12/2022: Buford2 Algebra started
	-SAT 15:38 04/30/2022: Multidimensional array system working??? [Machine readable matrix]
	-MON 20:57 05/09/2022: Just started using VS code after moving to Pop!_OS. It turns out to be a whole lot better than the default text editor I was using previously :)
	-SAT 17:10 05/14/2022: About to change the way the machine readable part works :/ I don't want to have exponents as operation arrays anymore. It seemed to make since in theory but did not work out practicaly.
	-MON 20:08 09/12/2022: Changed the data structure once again. This time we have classes for Expression, Term, and Coefficient. This allows for more specialized methods involving each.
	-SUN 09:34 09/25/2022: First operational version of "simplify expression" mode!
	-MON 19:36 09/26/2022: We are now caught up to the first version of Buford in functionality! Yet this time with a long road of improvement ahead :)
	-THU 19:52 10/06/2022: Attempt to change the structure to a more modular based approach. A little bit difficult because I don't know how to keep all the ties to other functions I've created.
	-FRI 11:55 11/25/2022: Create rough dynamic site for Buford2 (Dynamic in updating with updates to "index.json"). Looking really classy at https://tux-76.github.io/buford2
	- I JUST DID SOMETHING
*/