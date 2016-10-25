function promote(subclass, prefix) {
    var subP = subclass.prototype,
        supP = (Object.getPrototypeOf && Object.getPrototypeOf(subP)) || subP.__proto__;
    if (supP) {
        subP[(prefix += "_") + "constructor"] = supP.constructor; // constructor is not always innumerable
        for (var n in supP) {
            if (subP.hasOwnProperty(n) && (typeof supP[n] == "function")) {
                subP[prefix + n] = supP[n];
            }
        }
    }
    return subclass;
}
function extend(subclass, superclass) {
    function o() {
        this.constructor = subclass;
    }
    o.prototype = superclass.prototype;
    return (subclass.prototype = new o());
}

var p;
function ES5Simple() {}
p = ES5Simple.prototype;
p.superChained = function() {};
p.superGrantParent = function() {};
p.inherit = function() {};

function _ES5Mid() {
    this.ES5Simple_constructor();
}
p = extend(_ES5Mid, ES5Simple);
p.superChained = function() {
    this.ES5Simple_superChained();
};
var ES5Mid = promote(_ES5Mid, "ES5Simple");

function _ES5Extended() {
    this.ES5Mid_constructor();
}
p = extend(_ES5Extended, ES5Mid);
p.superChained = function() {
    this.ES5Mid_superChained();
};
p.superGrantParent = function() {
    this.ES5Simple_superGrandParent();
};
p.extend = function() {};
var ES5Extended = promote(_ES5Extended, "ES5Mid");
