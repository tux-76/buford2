const titleColor = "color: #c63915";
const logColor = "color: #a3642a";
const arrowColorOut = "color: #1da588";
const arrowColorIn = "color: #b144c9";
const normalColor = "color: #878d94";

let doDebug = true;

function log(title, output) {
	if (doDebug) {
		if (output === undefined) console.log(`%c! ${title} !`, logColor);

		else if (typeof output === "string") console.log(`%c${title} %c=> %c${output}`, logColor, arrowColorOut, normalColor);

		else console.log(`%c${title} %c=> %c${bu2_toString(output, "no parenthesis")}`, logColor, arrowColorOut, normalColor);
	}
}
function group(title, input, collapsed=1) {
	if (doDebug) {
		let string = (typeof input === "string") ? input : bu2_toString(input, "no parenthesis");
		if (collapsed) console.groupCollapsed(`%c${title} %c<= %c${string}`, titleColor, arrowColorIn, normalColor);
		else console.group(`%c${title} %c<= %c${string}`, titleColor, arrowColorIn, normalColor);
	}
}
function groupEnd(title, output) {
	if (doDebug) {
		console.groupEnd();
		log(title, output)
	}
}