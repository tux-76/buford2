import { Equation, Expression, Term, Coefficient, Variable } from "../../private/alge-classes.js";
import { simplifyExpression } from "../alge.js";

let sub;
let variableIndex;

function loop(anyClass) {
    if (anyClass instanceof Variable) {
        if (anyClass.index === variableIndex) {
            anyClass = sub;
        }
    } else if (anyClass instanceof Coefficient) {
        anyClass.base = loop(anyClass.base);
        anyClass.exponent = loop(anyClass.exponent);
    } else if (anyClass instanceof Term) {
        anyClass.coefficients = anyClass.coefficients.map(coef => loop(coef));
    } else if (anyClass instanceof Expression) {
        anyClass = anyClass.map(term => loop(term));
    } else if (anyClass instanceof Equation) {
        anyClass.left = loop(anyClass.left);
        anyClass.right = loop(anyClass.right);
    }
    return anyClass;
}

export default function substituteVariable(anyClass, variableIndexIn, subIn) {
    sub = subIn;
    variableIndex = variableIndexIn;

    anyClass = loop(anyClass);
    
    simplifyExpression(anyClass);
    return anyClass;
}
