/*
    NUMBER CLASS

    num => number

    That's it :\ 
    The point is to be able to create multiple references to the same number so if it changes, 
    we are all good.
*/


export default class NumberValue {
    constructor (num) {
        if (typeof num === "string") {
            this.value = parseFloat(num)
        } else {
            this.value = num
        }
    }

    simplify() {}
}