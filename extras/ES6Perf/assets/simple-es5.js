// PROMOTE / EXTEND utils from createjs
function promote (subclass, prefix) {
  var subP = subclass.prototype, supP = (Object.getPrototypeOf&&Object.getPrototypeOf(subP))||subP.__proto__;
  if (supP) {
    subP[(prefix+="_") + "constructor"] = supP.constructor; // constructor is not always innumerable
    for (var n in supP) {
      if (subP.hasOwnProperty(n) && (typeof supP[n] == "function")) { subP[prefix + n] = supP[n]; }
    }
  }
  return subclass;
}
function extend (subclass, superclass) {
  function o() { this.constructor = subclass; }
  o.prototype = superclass.prototype;
  return (subclass.prototype = new o());
}
// SIMPLE class
var p;
function ES5Simple () { }
p = ES5Simple.prototype;
p.superTest = function () { };
p.inheritTest = function () { };
// Extended class, extends SIMPLE.
function _ES5Extended () { this.ES5Simple_constructor(); }
p = extend(_ES5Extended, ES5Simple);
p.superTest = function () { this.ES5Simple_superTest(); };
p.extendTest = function () { };
var ES5Extended = promote(_ES5Extended, "ES5Simple");
