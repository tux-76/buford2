import * as debug from "./module/private-func/debug.js";
import * as funcs from "./module/public-func/main.js";
import * as classes from "./module/classes/main.js";
import * as constants from "./module/constants.js";

/*
	Function modes (arguement 1):
	 ~ "simplify expression"
	 ~ "double sided solve"
*/

function main(mode, ...args) {
	debug.group(`buford2`, `"${args[0]}"`, 0);
	debug.log("Mode", mode);
	let retr;

	//format string
	let string = args[0];
	string = string.split(" ").join("");
	debug.log("Format String", `"${string}"`);
	

	//functions
	if (mode === "simplify expression") retr = funcs.simplifyExpression(new classes.Expression(string));
	else if (mode === "double sided solve") retr = funcs.doubleSidedSolve(new classes.Equation(string), constants.variables.indexOf(args[1]));


	debug.groupEnd("Buford2", retr);
	return debug.toString(retr, "no parenthesis");
}

let Buford2 = {};
Buford2.simplifyExpression = function (...args) {main("simplify expression", ...args)};
Buford2.doubleSidedSolve = function (...args) {main("double sided solve", ...args)};

export default Buford2;
console.log("Buford2 module exported.")

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
*/