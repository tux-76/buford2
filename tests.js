/*
    FOR TESTING THE BUFORD 2 ALGE INTERFACE
*/

import Buford2 from "./main.js"
const bu2 = Buford2

// Print successes or just errors?
const PRINT_ALL = true
// The test list
const TESTS = [
    // TEST LIST FORMAT:
    // "FUNCTION NAME",       FUNCTION,                  [INPUT ARGS],   EXPECTED OUTPUT

    // Addition and subtraction
    ["alge.doubleSidedSolve", bu2.alge.doubleSidedSolve, ["a=8"], "a=8"],
    ["alge.doubleSidedSolve", bu2.alge.doubleSidedSolve, ["8=a"], "a=8"],
    ["alge.doubleSidedSolve", bu2.alge.doubleSidedSolve, ["a-4=8"], "a=12"],
    ["alge.doubleSidedSolve", bu2.alge.doubleSidedSolve, ["a-6x=5", "a"], "a=5+6x"],
    ["alge.doubleSidedSolve", bu2.alge.doubleSidedSolve, ["8-a=4"], "a=4"],
    
    // Multiplication
    ["alge.doubleSidedSolve", bu2.alge.doubleSidedSolve, ["-a=8"], "a=-8"],
    ["alge.doubleSidedSolve", bu2.alge.doubleSidedSolve, ["4a=8"], "a=2"],
    ["alge.doubleSidedSolve", bu2.alge.doubleSidedSolve, ["4*a=8*2"], "a=4"],
    
    // Exponential (division included because it uses x^-1)
    ["alge.doubleSidedSolve", bu2.alge.doubleSidedSolve, ["a^2=64"], "a=8"],
    // ["alge.doubleSidedSolve", bu2.alge.doubleSidedSolve, ["a/4=2"], "a=8"],

];


// Test function
function test(fullFuncName, func, args, expectedOutput) {
    try {
        let result = func(...args)
        if (result === expectedOutput) {
            if (PRINT_ALL) { 
                console.groupCollapsed("TEST FUNCTION:", fullFuncName, "<=", args)
                console.log("Output:", result)
                console.log("TEST PASSED")
                console.groupEnd()
            }
        } else {
            console.group("TEST FUNCTION:", fullFuncName, "<=", args)
            console.log("Output:", result)
            console.log("Expected output:", expectedOutput)
            console.warn("TEST FAILED")
            console.groupEnd()
        }
    } catch (error) {
        console.group("TEST FUNCTION:", fullFuncName, "<=", args)
        console.log("Expected output:", expectedOutput)
        console.log("ERROR")
        console.error(error)
        console.groupEnd()
    }
}

TESTS.forEach(e => test(...e))