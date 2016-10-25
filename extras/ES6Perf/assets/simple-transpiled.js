"use strict";

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return call && (typeof call === "object" || typeof call === "function")
        ? call
        : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    if (superClass)
        Object.setPrototypeOf
            ? Object.setPrototypeOf(subClass, superClass)
            : subClass.__proto__ = superClass;
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

    TranspiledSimple.prototype.superTest = function superTest() { console.log('simple test'); };

    TranspiledSimple.prototype.superTest2 = function superTest2() {};

    return TranspiledSimple;
}();

var TranspiledMid = function(_TranspiledSimple) {
    _inherits(TranspiledMid, _TranspiledSimple);

    function TranspiledMid() {
        _classCallCheck(this, TranspiledMid);

        return _possibleConstructorReturn(this, _TranspiledSimple.call(this));
    }

    TranspiledMid.prototype.superTest2 = function superTest() {
       console.log('mid test');
        _TranspiledSimple.prototype.superTest.call(this);
    };

    return TranspiledMid;
}(TranspiledSimple);

var TranspiledExtended = function(_TranspiledMid) {
    _inherits(TranspiledExtended, _TranspiledMid);

    function TranspiledExtended() {
        _classCallCheck(this, TranspiledExtended);

        return _possibleConstructorReturn(this, _TranspiledMid.call(this));
    }

    TranspiledExtended.prototype.superTest = function superTest() {
       console.log('ext test');
        _TranspiledMid.prototype.superTest.call(this);
    };

    TranspiledExtended.prototype.superTest2 = function superTest2() {
        _TranspiledMid.prototype.superTest2.call(this);
    };

    return TranspiledExtended;
}(TranspiledMid);
