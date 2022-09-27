
/*
	Buford 2 is a mathematics bot with the purpose of handling problems that are in string form.

	Function modes (arguement 1):
	 ~ "simplify expression"
	 ~ "double sided solve"
*/


function Buford2 (mode, ...args) {
	bu2_debug_group(`Buford2`, `"${args[0]}"`, 0);
	bu2_debug_log("Mode", mode);
	let retr;

	//format string
	let string = args[0];
	string = string.split(" ").join("");
	bu2_debug_log("Format String", `"${string}"`);
	

	//functions
	if (mode === "simplify expression") retr = bu2_simplifyExpression(new bu2_Expression(string));
	else if (mode === "double sided solve") retr = bu2_doubleSidedSolve(new bu2_Equation(string), bu2_const_variables.indexOf(args[1]));


	bu2_debug_groupEnd();
	bu2_debug_log("Buford2", retr);
	return bu2_toString(retr, "no parenthesis");
}


//----------------------------------------------------------------simplify expression
function bu2_simplifyExpression(expression) {
	bu2_debug_group("Simplify Expression", expression);

	expression.compress();

	bu2_debug_groupEnd();
	bu2_debug_log("Simplify Expression", expression);
	return expression;
}

//-----------------------------------------------------------------double sided solve
function bu2_doubleSidedSolve(equation, variable) {
	bu2_debug_group("Double Sided Solve", equation);

	bu2_simplifyExpression(equation.left);
	bu2_simplifyExpression(equation.right);

	//= term phase =====================================
	bu2_debug_group("Term Phase", equation);
	//move terms in L without variable to R
	equation.left = equation.left.filter((term) => {
		if (term.hasVariable(variable)) return true;
		else {
			let termCopy = term.copy();
			termCopy.constant *= -1;
			equation.right.push(termCopy);
		}
	});
	//simplify R
	equation.right.simplify();
	bu2_debug_log("Move non-variables to R, simplify R", equation);
	//move terms in R without variable to L
	equation.right = equation.right.filter((term) => {
		if (!term.hasVariable(variable)) return true;
		else {
			let termCopy = term.copy();
			termCopy.constant *= -1;
			equation.left.push(termCopy);
		}
	});
	//simplify L
	equation.left.simplify();
	bu2_debug_log("Move non-variables to L, simplify L", equation);
	bu2_debug_groupEnd(); //end term phase
	bu2_debug_log("Term Phase", equation);

	//= factor phase ==========================================
	if (equation.left.length === 1) {
		bu2_debug_log("Variable reduced to 1 term, entering factor phase.");
		bu2_debug_group("Factor Phase", equation);

		let term = equation.left[0];
		//move constant
		equation.right.forEach(rightTerm => {
			rightTerm.constant /= term.constant;
		});
		term.constant = 1;
		bu2_debug_log("Move Variables's Constant", equation);
		
		bu2_debug_groupEnd();
		bu2_debug_log("Factor Phase", equation);
	}

	bu2_debug_groupEnd();
	bu2_debug_log("Double Sided Solve", equation);
	return equation;
}


console.log("Buford2 app sucessfully loaded");

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
*/





