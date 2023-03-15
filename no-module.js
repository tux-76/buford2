import Buford2 from "./main.js";
import * as classes from "./module/alge/private/classes.js";
import * as priv from "./module/alge/private/functions.js";
import * as publ from "./module/alge/public/functions.js";

window.bu2 = Buford2;
window.bu2._e = {};
window.bu2._e.class = classes;
window.bu2._e.privAlge = priv;
window.bu2._e.publAlge = publ;

window.bu2_toString = window.bu2._e.privAlge.toString;
window.bu2_Class = window.bu2._e.class;

console.log('Buford2 loaded to global variable "bu2"');