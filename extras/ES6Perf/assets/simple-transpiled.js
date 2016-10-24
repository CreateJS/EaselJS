"use strict";

var _get = function get(proto, property) {
    var parent = proto;
    while (parent = parent.__proto__) {
        var prop = parent.constructor.name+"_"+property;
        if (proto.hasOwnProperty(prop)) {
          return proto[prop];
        }
    }
};

var _promote = function(subClass, superClass, p) {
  if (superClass && superClass.name !== "Object") {
    var prefix = superClass.name;
    var subP = subClass.prototype,
        supP = subP.__proto__;
    if (supP) {
      subP[(prefix+="_") + "constructor"] = supP.constructor; // constructor is not always innumerable
      Object.getOwnPropertyNames(supP).forEach(function (n) {
        if (subP.hasOwnProperty(n) && (typeof supP[n] == "function")) { subP[prefix + n] = supP[n]; }
      });
    }
  }
  debugger;
  return subClass;
};

var _createClass = function() {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor)
                descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    return function(Constructor, protoProps, staticProps) {
        if (protoProps)
            defineProperties(Constructor.prototype, protoProps);
        if (staticProps)
            defineProperties(Constructor, staticProps);
        return _promote(Constructor, Constructor.prototype.__proto__.constructor);
    };
}();

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return call && (typeof call === "object" || typeof call === "function")
        ? call
        : self;
}

function _inherits(subClass, superClass) {
    function o() { this.constructor = subClass; }
    o.prototype = superClass.prototype;
    return (subClass.prototype = new o());
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var TranspiledSimple = function() {
    function TranspiledSimple() {
        _classCallCheck(this, TranspiledSimple);
    }

    _createClass(TranspiledSimple, [
        {
            key: "superTest",
            value: function superTest() {}
        }, {
            key: "superTest2",
            value: function superTest2() {}
        }
    ]);

    return TranspiledSimple;
}();

var TranspiledMid = function(_TranspiledSimple) {
    _inherits(TranspiledMid, _TranspiledSimple);

    function TranspiledMid() {
        _classCallCheck(this, TranspiledMid);

        return _possibleConstructorReturn(this, (TranspiledMid.__proto__ || Object.getPrototypeOf(TranspiledMid)).call(this));
    }

    _createClass(TranspiledMid, [
        {
            key: "superTest",
            value: function superTest() {
                _get(TranspiledMid.prototype, "superTest", this).call(this);
            }
        }
    ]);

    return TranspiledMid;
}(TranspiledSimple);

var TranspiledExtended = function(_TranspiledMid) {
    _inherits(TranspiledExtended, _TranspiledMid);

    function TranspiledExtended() {
        _classCallCheck(this, TranspiledExtended);

        return _possibleConstructorReturn(this, (TranspiledExtended.__proto__ || Object.getPrototypeOf(TranspiledExtended)).call(this));
    }

    _createClass(TranspiledExtended, [
        {
            key: "superTest",
            value: function superTest() {
                _get(TranspiledExtended.prototype, "superTest", this).call(this);
            }
        }, {
            key: "superTest2",
            value: function superTest2() {
                _get(TranspiledExtended.prototype, "superTest2", this).call(this);
            }
        }
    ]);

    return TranspiledExtended;
}(TranspiledMid);
