import * as constants from "../../constants.js"

export default class Variable {
	constructor (char) {
		this.index = constants.variables.indexOf(char);
		if (this.index === -1) console.error(`Character "${char}" is not a valid variable.`);
	}
	get char() {
		return constants.variables[this.index];
	}
}