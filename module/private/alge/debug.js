import * as toString from "./toString.js";

const errorColor = "color: #bb0293"
const titleColor = "color: #c63915";
const logColor = "color: #a3642a";
const arrowColorOut = "color: #1da588";
const arrowColorIn = "color: #b144c9";
const normalColor = "color: #878d94";

let doDebug = true;

export function log(title, output) {
	if (doDebug) {
		if (output === undefined) console.log(`%c! ${title} !`, logColor);

		else if (typeof output === "string") console.log(`%c${title} %c=> %c${output}`, logColor, arrowColorOut, normalColor);

		else if (output.constructor === Array) console.log(`%c${title} %c=> %c${output.map(e => toString.basic(e)).toString()}`, logColor, arrowColorOut, normalColor);

		else console.log(`%c${title} %c=> %c${toString.basic(output, "no parenthesis")}`, logColor, arrowColorOut, normalColor);
	}
}
export function group(title, input, collapsed=1) {
	if (doDebug) {
		let string = (typeof input === "string") ? input : toString.basic(input, "no parenthesis");
		if (collapsed) console.groupCollapsed(`%c${title} %c<= %c${string}`, titleColor, arrowColorIn, normalColor);
		else console.group(`%c${title} %c<= %c${string}`, titleColor, arrowColorIn, normalColor);
	}
}
export function groupEnd(title, output) {
	if (doDebug) {
		console.groupEnd();
		log(title, output);
	}
}

export function error(title, output) {
	if (doDebug) {
		if (doDebug) {
			if (output === undefined) console.error(`%c! ${title} !`, errorColor);
	
			else if (typeof output === "string") console.error(`%c${title} %c=> %c${output}`, errorColor, arrowColorOut, normalColor);
	
			else if (output.constructor === Array) console.error(`%c${title} %c=> %c${output.map(e => toString.basic(e)).toString()}`, errorColor, arrowColorOut, normalColor);
	
			else console.error(`%c${title} %c=> %c${toString.basic(output, "no parenthesis")}`, errorColor, arrowColorOut, normalColor);
		}
	}
}