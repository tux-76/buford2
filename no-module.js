import Buford2 from "./main.js";
import * as classes from "./module/classes.js";
import * as priv from "./module/algebra-private.js";
import * as publ from "./module/public.js";

window.bu2 = Buford2;
window.bu2.class = classes;
window.bu2.priv = priv;
window.bu2.pub = publ;

console.log('Buford2 loaded to global variable "bu2"');