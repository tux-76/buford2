import Buford2 from "./main.js";
import * as classes from "./module/classes.js";
import * as priv from "./module/private-alge.js";
import * as publ from "./module/public/alge.js";

window.bu2 = Buford2;
window.bu2._extra_ = {};
window.bu2._extra_.class = classes;
window.bu2._extra_.privateAlgebra = priv;
window.bu2._extra_.publicAlgebra = publ;

console.log('Buford2 loaded to global variable "bu2"');