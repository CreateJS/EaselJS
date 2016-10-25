"use strict";

var _get = function get(object, property, receiver) {
    if (object === null)
        object = Function.prototype;
    var desc = Object.getOwnPropertyDescriptor(object, property);
    if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);
        if (parent === null) {
            return undefined;
        } else {
            return get(parent, property, receiver);
        }
    } else if ("value" in desc) {
        return desc.value;
    } else {
        var getter = desc.get;
        if (getter === undefined) {
            return undefined;
        }
        return getter.call(receiver);
    }
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
        return Constructor;
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

var TranspiledStrictSimple = function() {
    function TranspiledStrictSimple() {
        _classCallCheck(this, TranspiledStrictSimple);
    }

    _createClass(TranspiledStrictSimple, [
        {
            key: "superChained",
            value: function superChained() {}
        }, {
            key: "superGrantParent",
            value: function superGrantParent() {}
        }, {
            key: "inherit",
            value: function inherit() {}
        }
    ]);

    return TranspiledStrictSimple;
}();

var TranspiledStrictMid = function(_TranspiledStrictSimp) {
    _inherits(TranspiledStrictMid, _TranspiledStrictSimp);

    function TranspiledStrictMid() {
        _classCallCheck(this, TranspiledStrictMid);

        return _possibleConstructorReturn(this, (TranspiledStrictMid.__proto__ || Object.getPrototypeOf(TranspiledStrictMid)).call(this));
    }

    _createClass(TranspiledStrictMid, [
        {
            key: "superChained",
            value: function superChained() {
                _get(TranspiledStrictMid.prototype.__proto__ || Object.getPrototypeOf(TranspiledStrictMid.prototype), "superChained", this).call(this);
            }
        }
    ]);

    return TranspiledStrictMid;
}(TranspiledStrictSimple);

var TranspiledStrictExtended = function(_TranspiledStrictMid) {
    _inherits(TranspiledStrictExtended, _TranspiledStrictMid);

    function TranspiledStrictExtended() {
        _classCallCheck(this, TranspiledStrictExtended);

        return _possibleConstructorReturn(this, (TranspiledStrictExtended.__proto__ || Object.getPrototypeOf(TranspiledStrictExtended)).call(this));
    }

    _createClass(TranspiledStrictExtended, [
        {
            key: "superChained",
            value: function superChained() {
                _get(TranspiledStrictExtended.prototype.__proto__ || Object.getPrototypeOf(TranspiledStrictExtended.prototype), "superChained", this).call(this);
            }
        }, {
            key: "superGrandParent",
            value: function superGrandParent() {
                _get(TranspiledStrictExtended.prototype.__proto__ || Object.getPrototypeOf(TranspiledStrictExtended.prototype), "superGrantParent", this).call(this);
            }
        }, {
            key: "extend",
            value: function extend() {}
        }
    ]);

    return TranspiledStrictExtended;
}(TranspiledStrictMid);
