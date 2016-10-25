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

var TranspiledLooseSimple = function() {
    function TranspiledLooseSimple() {
        _classCallCheck(this, TranspiledLooseSimple);
    }

    TranspiledLooseSimple.prototype.superChained = function superChained() {};

    TranspiledLooseSimple.prototype.superGrantParent = function superGrantParent() {};

    TranspiledLooseSimple.prototype.inherit = function inherit() {};

    return TranspiledLooseSimple;
}();

var TranspiledLooseMid = function(_TranspiledLooseSimple) {
    _inherits(TranspiledLooseMid, _TranspiledLooseSimple);

    function TranspiledLooseMid() {
        _classCallCheck(this, TranspiledLooseMid);

        return _possibleConstructorReturn(this, _TranspiledLooseSimple.call(this));
    }

    TranspiledLooseMid.prototype.superChained = function superChained() {
        _TranspiledLooseSimple.prototype.superChained.call(this);
    };

    return TranspiledLooseMid;
}(TranspiledLooseSimple);

var TranspiledLooseExtended = function(_TranspiledLooseMid) {
    _inherits(TranspiledLooseExtended, _TranspiledLooseMid);

    function TranspiledLooseExtended() {
        _classCallCheck(this, TranspiledLooseExtended);

        return _possibleConstructorReturn(this, _TranspiledLooseMid.call(this));
    }

    TranspiledLooseExtended.prototype.superChained = function superChained() {
        _TranspiledLooseMid.prototype.superChained.call(this);
    };

    TranspiledLooseExtended.prototype.superGrandParent = function superGrandParent() {
        _TranspiledLooseMid.prototype.superGrantParent.call(this);
    };

    TranspiledLooseExtended.prototype.extend = function extend() {};

    return TranspiledLooseExtended;
}(TranspiledLooseMid);
