/*
 * @license easeljs
 * Visit http://createjs.com for documentation, updates and examples.
 *
 * Copyright (c) 2010 gskinner.com, inc.
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
(function (exports) {
  "use strict";
  var asyncGenerator = function () {
    function AwaitValue(value) {
      this.value = value
    }

    function AsyncGenerator(gen) {
      var front, back;

      function send(key, arg) {
        return new Promise(function (resolve, reject) {
          var request = {
            key: key,
            arg: arg,
            resolve: resolve,
            reject: reject,
            next: null
          };
          if (back) {
            back = back.next = request
          } else {
            front = back = request;
            resume(key, arg)
          }
        })
      }

      function resume(key, arg) {
        try {
          var result = gen[key](arg);
          var value = result.value;
          if (value instanceof AwaitValue) {
            Promise.resolve(value.value).then(function (arg) {
              resume("next", arg)
            }, function (arg) {
              resume("throw", arg)
            })
          } else {
            settle(result.done ? "return" : "normal", result.value)
          }
        } catch (err) {
          settle("throw", err)
        }
      }

      function settle(type, value) {
        switch (type) {
          case "return":
            front.resolve({
              value: value,
              done: true
            });
            break;
          case "throw":
            front.reject(value);
            break;
          default:
            front.resolve({
              value: value,
              done: false
            });
            break
        }
        front = front.next;
        if (front) {
          resume(front.key, front.arg)
        } else {
          back = null
        }
      }
      this._invoke = send;
      if (typeof gen.return !== "function") {
        this.return = undefined
      }
    }
    if (typeof Symbol === "function" && Symbol.asyncIterator) {
      AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
        return this
      }
    }
    AsyncGenerator.prototype.next = function (arg) {
      return this._invoke("next", arg)
    };
    AsyncGenerator.prototype.throw = function (arg) {
      return this._invoke("throw", arg)
    };
    AsyncGenerator.prototype.return = function (arg) {
      return this._invoke("return", arg)
    };
    return {
      wrap: function (fn) {
        return function () {
          return new AsyncGenerator(fn.apply(this, arguments))
        }
      },
      await: function (value) {
        return new AwaitValue(value)
      }
    }
  }();
  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function")
    }
  };
  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor)
      }
    }
    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor
    }
  }();
  var get$1 = function get$1(object, property, receiver) {
    if (object === null) object = Function.prototype;
    var desc = Object.getOwnPropertyDescriptor(object, property);
    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);
      if (parent === null) {
        return undefined
      } else {
        return get$1(parent, property, receiver)
      }
    } else if ("value" in desc) {
      return desc.value
    } else {
      var getter = desc.get;
      if (getter === undefined) {
        return undefined
      }
      return getter.call(receiver)
    }
  };
  var inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass)
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass
  };
  var possibleConstructorReturn = function (self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
    }
    return call && (typeof call === "object" || typeof call === "function") ? call : self
  };
  var set$1 = function set$1(object, property, value, receiver) {
    var desc = Object.getOwnPropertyDescriptor(object, property);
    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);
      if (parent !== null) {
        set$1(parent, property, value, receiver)
      }
    } else if ("value" in desc && desc.writable) {
      desc.value = value
    } else {
      var setter = desc.set;
      if (setter !== undefined) {
        setter.call(receiver, value)
      }
    }
    return value
  };
  /**
   * Contains properties and methods shared by all events for use with {{#crossLink "EventDispatcher"}}{{/crossLink}}.
   * Note that Event objects are often reused, so you should never
   * rely on an event object's state outside of the call stack it was received in.
   *
   * @class Event
   */
  var Event = function () {
    // constructor:
    /**
     * @param {String} type The event type.
     * @param {Boolean} [bubbles=false] Indicates whether the event will bubble through the display list.
     * @param {Boolean} [cancelable=false] Indicates whether the default behaviour of this event can be cancelled.
     * @constructor
     */
    function Event(type) {
      var bubbles = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var cancelable = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      classCallCheck(this, Event);
      /**
       * The type of event.
       * @property type
       * @type String
       */
      this.type = type;
      /**
       * The object that generated an event.
       * @property target
       * @type Object
       * @default null
       * @readonly
       */
      this.target = null;
      /**
       * The current target that a bubbling event is being dispatched from. For non-bubbling events, this will
       * always be the same as target. For example, if childObj.parent = parentObj, and a bubbling event
       * is generated from childObj, then a listener on parentObj would receive the event with
       * target=childObj (the original target) and currentTarget=parentObj (where the listener was added).
       * @property currentTarget
       * @type Object
       * @default null
       * @readonly
       */
      this.currentTarget = null;
      /**
       * For bubbling events, this indicates the current event phase:<OL>
       * 	<LI> capture phase: starting from the top parent to the target</LI>
       * 	<LI> at target phase: currently being dispatched from the target</LI>
       * 	<LI> bubbling phase: from the target to the top parent</LI>
       * </OL>
       * @property eventPhase
       * @type Number
       * @default 0
       * @readonly
       */
      this.eventPhase = 0;
      /**
       * Indicates whether the event will bubble through the display list.
       * @property bubbles
       * @type Boolean
       * @default false
       * @readonly
       */
      this.bubbles = bubbles;
      /**
       * Indicates whether the default behaviour of this event can be cancelled via
       * {{#crossLink "Event/preventDefault"}}{{/crossLink}}. This is set via the Event constructor.
       * @property cancelable
       * @type Boolean
       * @default false
       * @readonly
       */
      this.cancelable = cancelable;
      /**
       * The epoch time at which this event was created.
       * @property timeStamp
       * @type Number
       * @default 0
       * @readonly
       */
      this.timeStamp = (new Date).getTime();
      /**
       * Indicates if {{#crossLink "Event/preventDefault"}}{{/crossLink}} has been called
       * on this event.
       * @property defaultPrevented
       * @type Boolean
       * @default false
       * @readonly
       */
      this.defaultPrevented = false;
      /**
       * Indicates if {{#crossLink "Event/stopPropagation"}}{{/crossLink}} or
       * {{#crossLink "Event/stopImmediatePropagation"}}{{/crossLink}} has been called on this event.
       * @property propagationStopped
       * @type Boolean
       * @default false
       * @readonly
       */
      this.propagationStopped = false;
      /**
       * Indicates if {{#crossLink "Event/stopImmediatePropagation"}}{{/crossLink}} has been called
       * on this event.
       * @property immediatePropagationStopped
       * @type Boolean
       * @default false
       * @readonly
       */
      this.immediatePropagationStopped = false;
      /**
       * Indicates if {{#crossLink "Event/remove"}}{{/crossLink}} has been called on this event.
       * @property removed
       * @type Boolean
       * @default false
       * @readonly
       */
      this.removed = false
    }
    // public methods:
    /**
     * Sets {{#crossLink "Event/defaultPrevented"}}{{/crossLink}} to true if the event is cancelable.
     * Mirrors the DOM level 2 event standard. In general, cancelable events that have `preventDefault()` called will
     * cancel the default behaviour associated with the event.
     * @method preventDefault
     */
    createClass(Event, [{
      key: "preventDefault",
      value: function preventDefault() {
        this.defaultPrevented = this.cancelable
      }
    }, {
      key: "stopPropagation",
      value: function stopPropagation() {
        this.propagationStopped = true
      }
    }, {
      key: "stopImmediatePropagation",
      value: function stopImmediatePropagation() {
        this.immediatePropagationStopped = this.propagationStopped = true
      }
    }, {
      key: "remove",
      value: function remove() {
        this.removed = true
      }
    }, {
      key: "clone",
      value: function clone() {
        var event = new Event(this.type, this.bubbles, this.cancelable);
        for (var n in this) {
          if (this.hasOwnProperty(n)) {
            event[n] = this[n]
          }
        }
        return event
      }
    }, {
      key: "set",
      value: function set(props) {
        for (var n in props) {
          this[n] = props[n]
        }
        return this
      }
    }, {
      key: "toString",
      value: function toString() {
        return "[Event (type=" + this.type + ")]"
      }
    }]);
    return Event
  }();
  /**
   * EventDispatcher provides methods for managing queues of event listeners and dispatching events.
   *
   * You can either extend EventDispatcher or mix its methods into an existing prototype or instance by using the
   * EventDispatcher {{#crossLink "EventDispatcher/initialize"}}{{/crossLink}} method.
   *
   * Together with the CreateJS Event class, EventDispatcher provides an extended event model that is based on the
   * DOM Level 2 event model, including addEventListener, removeEventListener, and dispatchEvent. It supports
   * bubbling / capture, preventDefault, stopPropagation, stopImmediatePropagation, and handleEvent.
   *
   * EventDispatcher also exposes a {{#crossLink "EventDispatcher/on"}}{{/crossLink}} method, which makes it easier
   * to create scoped listeners, listeners that only run once, and listeners with associated arbitrary data. The
   * {{#crossLink "EventDispatcher/off"}}{{/crossLink}} method is merely an alias to
   * {{#crossLink "EventDispatcher/removeEventListener"}}{{/crossLink}}.
   *
   * Another addition to the DOM Level 2 model is the {{#crossLink "EventDispatcher/removeAllEventListeners"}}{{/crossLink}}
   * method, which can be used to listeners for all events, or listeners for a specific event. The Event object also
   * includes a {{#crossLink "Event/remove"}}{{/crossLink}} method which removes the active listener.
   *
   * <h4>Example</h4>
   * Add EventDispatcher capabilities to the "MyClass" class.
   *
   *      EventDispatcher.initialize(MyClass.prototype);
   *
   * Add an event (see {{#crossLink "EventDispatcher/addEventListener"}}{{/crossLink}}).
   *
   *      instance.addEventListener("eventName", handlerMethod);
   *      function handlerMethod(event) {
   *          console.log(event.target + " Was Clicked");
   *      }
   *
   * <b>Maintaining proper scope</b><br />
   * Scope (ie. "this") can be be a challenge with events. Using the {{#crossLink "EventDispatcher/on"}}{{/crossLink}}
   * method to subscribe to events simplifies this.
   *
   *      instance.addEventListener("click", function(event) {
   *          console.log(instance == this); // false, scope is ambiguous.
   *      });
   *
   *      instance.on("click", function(event) {
   *          console.log(instance == this); // true, "on" uses dispatcher scope by default.
   *      });
   *
   * If you want to use addEventListener instead, you may want to use function.bind() or a similar proxy to manage scope.
   *
   *
   * @class EventDispatcher
   */
  var EventDispatcher = function () {
    createClass(EventDispatcher, null, [{
      key: "initialize",
      // static methods:
      /**
       * Static initializer to mix EventDispatcher methods into a target object or prototype.
       *
       * 		EventDispatcher.initialize(MyClass.prototype); // add to the prototype of the class
       * 		EventDispatcher.initialize(myObject); // add to a specific instance
       *
       * @method initialize
       * @static
       * @param {Object} target The target object to inject EventDispatcher methods into. This can be an instance or a
       * prototype.
       */
      value: function initialize(target) {
        var p = EventDispatcher.prototype;
        target.addEventListener = p.addEventListener;
        target.on = p.on;
        target.removeEventListener = target.off = p.removeEventListener;
        target.removeAllEventListeners = p.removeAllEventListeners;
        target.hasEventListener = p.hasEventListener;
        target.dispatchEvent = p.dispatchEvent;
        target._dispatchEvent = p._dispatchEvent;
        target.willTrigger = p.willTrigger
      }
    }]);

    function EventDispatcher() {
      classCallCheck(this, EventDispatcher);
      /**
       * @protected
       * @property _listeners
       * @type Object
       */
      this._listeners = null;
      /**
       * @protected
       * @property _captureListeners
       * @type Object
       */
      this._captureListeners = null
    }
    // public methods:
    /**
     * Adds the specified event listener. Note that adding multiple listeners to the same function will result in
     * multiple callbacks getting fired.
     *
     * <h4>Example</h4>
     *
     *      displayObject.addEventListener("click", handleClick);
     *      function handleClick(event) {
     *         // Click happened.
     *      }
     *
     * @method addEventListener
     * @param {String} type The string type of the event.
     * @param {Function | Object} listener An object with a handleEvent method, or a function that will be called when
     * the event is dispatched.
     * @param {Boolean} [useCapture] For events that bubble, indicates whether to listen for the event in the capture or bubbling/target phase.
     * @return {Function | Object} Returns the listener for chaining or assignment.
     */
    createClass(EventDispatcher, [{
      key: "addEventListener",
      value: function addEventListener(type, listener, useCapture) {
        var listeners = void 0;
        if (useCapture) {
          listeners = this._captureListeners = this._captureListeners || {}
        } else {
          listeners = this._listeners = this._listeners || {}
        }
        var arr = listeners[type];
        if (arr) {
          this.removeEventListener(type, listener, useCapture)
        }
        arr = listeners[type]; // remove may have deleted the array
        if (!arr) {
          listeners[type] = [listener]
        } else {
          arr.push(listener)
        }
        return listener
      }
    }, {
      key: "on",
      value: function on(type, listener) {
        var scope = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
        var once = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
        var data = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
        var useCapture = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
        if (listener.handleEvent) {
          scope = scope || listener;
          listener = listener.handleEvent
        }
        scope = scope || this;
        return this.addEventListener(type, function (evt) {
          listener.call(scope, evt, data);
          once && evt.remove()
        }, useCapture)
      }
    }, {
      key: "removeEventListener",
      value: function removeEventListener(type, listener, useCapture) {
        var listeners = useCapture ? this._captureListeners : this._listeners;
        if (!listeners) {
          return
        }
        var arr = listeners[type];
        if (!arr) {
          return
        }
        var l = arr.length;
        for (var i = 0; i < l; i++) {
          if (arr[i] == listener) {
            if (l == 1) {
              delete listeners[type]
            } else {
              arr.splice(i, 1)
            }
            break
          }
        }
      }
    }, {
      key: "off",
      value: function off(type, listener, useCapture) {
        this.removeEventListener(type, listener, useCapture)
      }
    }, {
      key: "removeAllEventListeners",
      value: function removeAllEventListeners(type) {
        if (!type) {
          this._listeners = this._captureListeners = null
        } else {
          if (this._listeners) {
            delete this._listeners[type]
          }
          if (this._captureListeners) {
            delete this._captureListeners[type]
          }
        }
      }
    }, {
      key: "dispatchEvent",
      value: function dispatchEvent(eventObj) {
        var bubbles = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var cancelable = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        if (typeof eventObj == "string") {
          // skip everything if there's no listeners and it doesn't bubble:
          var listeners = this._listeners;
          if (!bubbles && (!listeners || !listeners[eventObj])) {
            return true
          }
          eventObj = new Event(eventObj, bubbles, cancelable)
        } else if (eventObj.target && eventObj.clone) {
          // redispatching an active event object, so clone it:
          eventObj = eventObj.clone()
        }
        // TODO: it would be nice to eliminate this. Maybe in favour of evtObj instanceof Event? Or !!evtObj.createEvent
        try {
          eventObj.target = this
        } catch (e) {} // try/catch allows redispatching of native events
        if (!eventObj.bubbles || !this.parent) {
          this._dispatchEvent(eventObj, 2)
        } else {
          var top = this,
            i = void 0;
          var list = [top];
          while (top.parent) {
            list.push(top = top.parent)
          }
          var l = list.length;
          // capture & atTarget
          for (i = l - 1; i >= 0 && !eventObj.propagationStopped; i--) {
            list[i]._dispatchEvent(eventObj, 1 + (i == 0))
          }
          // bubbling
          for (i = 1; i < l && !eventObj.propagationStopped; i++) {
            list[i]._dispatchEvent(eventObj, 3)
          }
        }
        return !eventObj.defaultPrevented
      }
    }, {
      key: "hasEventListener",
      value: function hasEventListener(type) {
        var listeners = this._listeners,
          captureListeners = this._captureListeners;
        return !!(listeners && listeners[type] || captureListeners && captureListeners[type])
      }
    }, {
      key: "willTrigger",
      value: function willTrigger(type) {
        var o = this;
        while (o) {
          if (o.hasEventListener(type)) {
            return true
          }
          o = o.parent
        }
        return false
      }
    }, {
      key: "toString",
      value: function toString() {
        return "[EventDispatcher]"
      }
    }, {
      key: "_dispatchEvent",
      value: function _dispatchEvent(eventObj, eventPhase) {
        var listeners = eventPhase == 1 ? this._captureListeners : this._listeners;
        var l = void 0;
        if (eventObj && listeners) {
          var arr = listeners[eventObj.type];
          if (!arr || !(l = arr.length)) {
            return
          }
          try {
            eventObj.currentTarget = this
          } catch (e) {}
          try {
            eventObj.eventPhase = eventPhase
          } catch (e) {}
          eventObj.removed = false;
          arr = arr.slice(); // to avoid issues with items being removed or added during the dispatch
          for (var i = 0; i < l && !eventObj.immediatePropagationStopped; i++) {
            var o = arr[i];
            if (o.handleEvent) {
              o.handleEvent(eventObj)
            } else {
              o(eventObj)
            }
            if (eventObj.removed) {
              this.off(eventObj.type, o, eventPhase == 1);
              eventObj.removed = false
            }
          }
        }
      }
    }]);
    return EventDispatcher
  }();
  var _nextID = 0;
  /**
   * Global utility for generating sequential unique ID numbers. The UID class uses a static interface (ex. <code>UID.get()</code>)
   * and should not be instantiated.
   * @class UID
   * @static
   */
  var UID = function () {
    // constructor:
    /**
     * @constructor
     */
    function UID() {
      classCallCheck(this, UID);
      throw "UID cannot be instantiated"
    }
    // private static properties:
    /**
     * @property _nextID
     * @type Number
     * @protected
     */
    createClass(UID, null, [{
      key: "get",
      // public static methods:
      /**
       * Returns the next unique id.
       * @method get
       * @return {Number} The next unique id
       * @static
       */
      value: function get() {
        return UID._nextID++
      }
    }, {
      key: "_nextID",
      get: function get() {
        return _nextID
      },
      set: function set(nextID) {
        _nextID = nextID
      }
    }]);
    return UID
  }();
  /**
   * Represents a point on a 2 dimensional x / y coordinate system.
   *
   * <h4>Example</h4>
   *
   *      var point = new createjs.Point(0, 100);
   *
   * @class Point
   */
  var Point = function () {
    // constructor:
    /**
     * @constructor
     * @param {Number} [x=0] X position.
     * @param {Number} [y=0] Y position.
     * @constructor
     */
    function Point() {
      var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      classCallCheck(this, Point);
      this.setValues(x, y)
    }
    // public methods:
    /**
     * Sets the specified values on this instance.
     * @method setValues
     * @param {Number} [x=0] X position.
     * @param {Number} [y=0] Y position.
     * @return {Point} This instance. Useful for chaining method calls.
     * @chainable
     */
    createClass(Point, [{
      key: "setValues",
      value: function setValues() {
        var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        this.x = x;
        this.y = y;
        return this
      }
    }, {
      key: "copy",
      value: function copy(point) {
        this.x = point.x;
        this.y = point.y;
        return this
      }
    }, {
      key: "clone",
      value: function clone() {
        return new Point(this.x, this.y)
      }
    }, {
      key: "toString",
      value: function toString() {
        return "[Point (x=" + this.x + " y=" + this.y + ")]"
      }
    }]);
    return Point
  }();
  /**
   * Represents an affine transformation matrix, and provides tools for constructing and concatenating matrices.
   *
   * This matrix can be visualized as:
   *
   * 	[ a  c  tx
   * 	  b  d  ty
   * 	  0  0  1  ]
   *
   * Note the locations of b and c.
   *
   * @class Matrix2D
   */
  var Matrix2D = function () {
    // constructor:
    /**
     * @constructor
     * @param {Number} [a=1] Specifies the a property for the new matrix.
     * @param {Number} [b=0] Specifies the b property for the new matrix.
     * @param {Number} [c=0] Specifies the c property for the new matrix.
     * @param {Number} [d=1] Specifies the d property for the new matrix.
     * @param {Number} [tx=0] Specifies the tx property for the new matrix.
     * @param {Number} [ty=0] Specifies the ty property for the new matrix.
     */
    function Matrix2D() {
      var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var c = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var d = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
      var tx = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
      var ty = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
      classCallCheck(this, Matrix2D);
      this.setValues(a, b, c, d, tx, ty)
    }
    // public methods:
    /**
     * Sets the specified values on this instance.
     * @method setValues
     * @param {Number} [a=1] Specifies the a property for the new matrix.
     * @param {Number} [b=0] Specifies the b property for the new matrix.
     * @param {Number} [c=0] Specifies the c property for the new matrix.
     * @param {Number} [d=1] Specifies the d property for the new matrix.
     * @param {Number} [tx=0] Specifies the tx property for the new matrix.
     * @param {Number} [ty=0] Specifies the ty property for the new matrix.
     * @return {Matrix2D} This instance. Useful for chaining method calls.
     */
    createClass(Matrix2D, [{
      key: "setValues",
      value: function setValues() {
        var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
        var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var c = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var d = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
        var tx = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
        var ty = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
        // don't forget to update docs in the constructor if these change:
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.tx = tx;
        this.ty = ty;
        return this
      }
    }, {
      key: "append",
      value: function append(a, b, c, d, tx, ty) {
        var a1 = this.a;
        var b1 = this.b;
        var c1 = this.c;
        var d1 = this.d;
        if (a != 1 || b != 0 || c != 0 || d != 1) {
          this.a = a1 * a + c1 * b;
          this.b = b1 * a + d1 * b;
          this.c = a1 * c + c1 * d;
          this.d = b1 * c + d1 * d
        }
        this.tx = a1 * tx + c1 * ty + this.tx;
        this.ty = b1 * tx + d1 * ty + this.ty;
        return this
      }
    }, {
      key: "prepend",
      /**
       * Prepends the specified matrix properties to this matrix.
       * This is the equivalent of multiplying `(specified matrix) * (this matrix)`.
       * All parameters are required.
       * @method prepend
       * @param {Number} a
       * @param {Number} b
       * @param {Number} c
       * @param {Number} d
       * @param {Number} tx
       * @param {Number} ty
       * @return {Matrix2D} This matrix. Useful for chaining method calls.
       */
      value: function prepend(a, b, c, d, tx, ty) {
        var a1 = this.a;
        var c1 = this.c;
        var tx1 = this.tx;
        this.a = a * a1 + c * this.b;
        this.b = b * a1 + d * this.b;
        this.c = a * c1 + c * this.d;
        this.d = b * c1 + d * this.d;
        this.tx = a * tx1 + c * this.ty + tx;
        this.ty = b * tx1 + d * this.ty + ty;
        return this
      }
    }, {
      key: "appendMatrix",
      value: function appendMatrix(matrix) {
        return this.append(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty)
      }
    }, {
      key: "prependMatrix",
      value: function prependMatrix(matrix) {
        return this.prepend(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty)
      }
    }, {
      key: "appendTransform",
      value: function appendTransform(x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
        var r = void 0,
          cos = void 0,
          sin = void 0;
        if (rotation % 360) {
          r = rotation * Matrix2D.DEG_TO_RAD;
          cos = Math.cos(r);
          sin = Math.sin(r)
        } else {
          cos = 1;
          sin = 0
        }
        if (skewX || skewY) {
          // TODO: can this be combined into a single append operation?
          skewX *= Matrix2D.DEG_TO_RAD;
          skewY *= Matrix2D.DEG_TO_RAD;
          this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
          this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, 0, 0)
        } else {
          this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y)
        }
        if (regX || regY) {
          // append the registration offset:
          this.tx -= regX * this.a + regY * this.c;
          this.ty -= regX * this.b + regY * this.d
        }
        return this
      }
    }, {
      key: "prependTransform",
      value: function prependTransform(x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
        var r = void 0,
          cos = void 0,
          sin = void 0;
        if (rotation % 360) {
          r = rotation * Matrix2D.DEG_TO_RAD;
          cos = Math.cos(r);
          sin = Math.sin(r)
        } else {
          cos = 1;
          sin = 0
        }
        if (regX || regY) {
          // prepend the registration offset:
          this.tx -= regX;
          this.ty -= regY
        }
        if (skewX || skewY) {
          // TODO: can this be combined into a single prepend operation?
          skewX *= Matrix2D.DEG_TO_RAD;
          skewY *= Matrix2D.DEG_TO_RAD;
          this.prepend(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, 0, 0);
          this.prepend(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y)
        } else {
          this.prepend(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y)
        }
        return this
      }
    }, {
      key: "rotate",
      value: function rotate(angle) {
        angle *= Matrix2D.DEG_TO_RAD;
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);
        var a1 = this.a;
        var b1 = this.b;
        this.a = a1 * cos + this.c * sin;
        this.b = b1 * cos + this.d * sin;
        this.c = -a1 * sin + this.c * cos;
        this.d = -b1 * sin + this.d * cos;
        return this
      }
    }, {
      key: "skew",
      value: function skew(skewX, skewY) {
        skewX *= Matrix2D.DEG_TO_RAD;
        skewY *= Matrix2D.DEG_TO_RAD;
        this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), 0, 0);
        return this
      }
    }, {
      key: "scale",
      value: function scale(x, y) {
        this.a *= x;
        this.b *= x;
        this.c *= y;
        this.d *= y;
        //this.tx *= x;
        //this.ty *= y;
        return this
      }
    }, {
      key: "translate",
      value: function translate(x, y) {
        this.tx += this.a * x + this.c * y;
        this.ty += this.b * x + this.d * y;
        return this
      }
    }, {
      key: "identity",
      value: function identity() {
        this.a = this.d = 1;
        this.b = this.c = this.tx = this.ty = 0;
        return this
      }
    }, {
      key: "invert",
      value: function invert() {
        var a1 = this.a;
        var b1 = this.b;
        var c1 = this.c;
        var d1 = this.d;
        var tx1 = this.tx;
        var n = a1 * d1 - b1 * c1;
        this.a = d1 / n;
        this.b = -b1 / n;
        this.c = -c1 / n;
        this.d = a1 / n;
        this.tx = (c1 * this.ty - d1 * tx1) / n;
        this.ty = -(a1 * this.ty - b1 * tx1) / n;
        return this
      }
    }, {
      key: "isIdentity",
      value: function isIdentity() {
        return this.tx === 0 && this.ty === 0 && this.a === 1 && this.b === 0 && this.c === 0 && this.d === 1
      }
    }, {
      key: "equals",
      value: function equals(matrix) {
        return this.tx === matrix.tx && this.ty === matrix.ty && this.a === matrix.a && this.b === matrix.b && this.c === matrix.c && this.d === matrix.d
      }
    }, {
      key: "transformPoint",
      value: function transformPoint(x, y) {
        var pt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Point;
        pt.x = x * this.a + y * this.c + this.tx;
        pt.y = x * this.b + y * this.d + this.ty;
        return pt
      }
    }, {
      key: "decompose",
      value: function decompose() {
        var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        // TODO: it would be nice to be able to solve for whether the matrix can be decomposed into only scale/rotation even when scale is negative
        target.x = this.tx;
        target.y = this.ty;
        target.scaleX = Math.sqrt(this.a * this.a + this.b * this.b);
        target.scaleY = Math.sqrt(this.c * this.c + this.d * this.d);
        var skewX = Math.atan2(-this.c, this.d);
        var skewY = Math.atan2(this.b, this.a);
        var delta = Math.abs(1 - skewX / skewY);
        if (delta < 1e-5) {
          // effectively identical, can use rotation:
          target.rotation = skewY / Matrix2D.DEG_TO_RAD;
          if (this.a < 0 && this.d >= 0) {
            target.rotation += target.rotation <= 0 ? 180 : -180
          }
          target.skewX = target.skewY = 0
        } else {
          target.skewX = skewX / Matrix2D.DEG_TO_RAD;
          target.skewY = skewY / Matrix2D.DEG_TO_RAD
        }
        return target
      }
    }, {
      key: "copy",
      value: function copy(matrix) {
        return this.setValues(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty)
      }
    }, {
      key: "clone",
      value: function clone() {
        return new Matrix2D(this.a, this.b, this.c, this.d, this.tx, this.ty)
      }
    }, {
      key: "toString",
      value: function toString() {
        return "[Matrix2D (a=" + this.a + " b=" + this.b + " c=" + this.c + " d=" + this.d + " tx=" + this.tx + " ty=" + this.ty + ")]"
      }
    }]);
    return Matrix2D
  }(); {
    Matrix2D.DEG_TO_RAD = Math.PI / 180;
    Matrix2D.identity = new Matrix2D
  }
  /**
   * Used for calculating and encapsulating display related properties.
   * @class DisplayProps
   */
  var DisplayProps = function () {
    // constructor:
    /**
     * @constructor
     * @param {Number} [visible=true] Visible value.
     * @param {Number} [alpha=1] Alpha value.
     * @param {Number} [shadow=null] A Shadow instance or null.
     * @param {Number} [compositeOperation=null] A compositeOperation value or null.
     * @param {Number} [matrix] A transformation matrix. Defaults to a new identity matrix.
     */
    function DisplayProps() {
      var visible = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var alpha = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var shadow = arguments[2];
      var compositeOperation = arguments[3];
      var matrix = arguments[4];
      classCallCheck(this, DisplayProps);
      this.setValues(visible, alpha, shadow, compositeOperation, matrix)
    }
    // public methods:
    /**
     * Reinitializes the instance with the specified values.
     * @method setValues
     * @param {Number} [visible=true] Visible value.
     * @param {Number} [alpha=1] Alpha value.
     * @param {Number} [shadow=null] A Shadow instance or null.
     * @param {Number} [compositeOperation=null] A compositeOperation value or null.
     * @param {Number} [matrix] A transformation matrix. Defaults to an identity matrix.
     * @return {DisplayProps} This instance. Useful for chaining method calls.
     * @chainable
     */
    createClass(DisplayProps, [{
      key: "setValues",
      value: function setValues() {
        var visible = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
        var alpha = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
        var shadow = arguments[2];
        var compositeOperation = arguments[3];
        var matrix = arguments[4];
        this.visible = visible;
        this.alpha = alpha;
        this.shadow = shadow;
        this.compositeOperation = compositeOperation;
        this.matrix = matrix || this.matrix && this.matrix.identity() || new Matrix2D;
        return this
      }
    }, {
      key: "append",
      value: function append(visible, alpha, shadow, compositeOperation, matrix) {
        this.alpha *= alpha;
        this.shadow = shadow || this.shadow;
        this.compositeOperation = compositeOperation || this.compositeOperation;
        this.visible = this.visible && visible;
        matrix && this.matrix.appendMatrix(matrix);
        return this
      }
    }, {
      key: "prepend",
      value: function prepend(visible, alpha, shadow, compositeOperation, matrix) {
        this.alpha *= alpha;
        this.shadow = this.shadow || shadow;
        this.compositeOperation = this.compositeOperation || compositeOperation;
        this.visible = this.visible && visible;
        matrix && this.matrix.prependMatrix(matrix);
        return this
      }
    }, {
      key: "identity",
      value: function identity() {
        this.visible = true;
        this.alpha = 1;
        this.shadow = this.compositeOperation = null;
        this.matrix.identity();
        return this
      }
    }, {
      key: "clone",
      value: function clone() {
        return new DisplayProps(this.alpha, this.shadow, this.compositeOperation, this.visible, this.matrix.clone())
      }
    }]);
    return DisplayProps
  }();
  /**
   * Represents a rectangle as defined by the points (x, y) and (x+width, y+height).
   *
   * <h4>Example</h4>
   *
   *      var rect = new createjs.Rectangle(0, 0, 100, 100);
   *
   * @class Rectangle
   */
  var Rectangle = function () {
    // constructor:
    /**
     * @constructor
     * @param {Number} [x=0] X position.
     * @param {Number} [y=0] Y position.
     * @param {Number} [width=0] The width of the Rectangle.
     * @param {Number} [height=0] The height of the Rectangle.
     */
    function Rectangle() {
      var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var height = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
      classCallCheck(this, Rectangle);
      this.setValues(x, y, width, height)
    }
    // public methods:
    /**
     * Sets the specified values on this instance.
     * @method setValues
     * @param {Number} [x=0] X position.
     * @param {Number} [y=0] Y position.
     * @param {Number} [width=0] The width of the Rectangle.
     * @param {Number} [height=0] The height of the Rectangle.
     * @return {Rectangle} This instance. Useful for chaining method calls.
     * @chainable
     */
    createClass(Rectangle, [{
      key: "setValues",
      value: function setValues() {
        var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var height = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
        // don't forget to update docs in the constructor if these change:
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        return this
      }
    }, {
      key: "extend",
      value: function extend(x, y) {
        var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var height = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
        if (x + width > this.x + this.width) {
          this.width = x + width - this.x
        }
        if (y + height > this.y + this.height) {
          this.height = y + height - this.y
        }
        if (x < this.x) {
          this.width += this.x - x;
          this.x = x
        }
        if (y < this.y) {
          this.height += this.y - y;
          this.y = y
        }
        return this
      }
    }, {
      key: "pad",
      value: function pad(top, left, bottom, right) {
        this.x -= left;
        this.y -= top;
        this.width += left + right;
        this.height += top + bottom;
        return this
      }
    }, {
      key: "copy",
      value: function copy(rectangle) {
        return this.setValues(rectangle.x, rectangle.y, rectangle.width, rectangle.height)
      }
    }, {
      key: "contains",
      value: function contains(x, y) {
        var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var height = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
        return x >= this.x && x + width <= this.x + this.width && y >= this.y && y + height <= this.y + this.height
      }
    }, {
      key: "union",
      value: function union(rect) {
        return this.clone().extend(rect.x, rect.y, rect.width, rect.height)
      }
    }, {
      key: "intersection",
      value: function intersection(rect) {
        var x1 = rect.x,
          y1 = rect.y,
          x2 = x1 + rect.width,
          y2 = y1 + rect.height;
        if (this.x > x1) {
          x1 = this.x
        }
        if (this.y > y1) {
          y1 = this.y
        }
        if (this.x + this.width < x2) {
          x2 = this.x + this.width
        }
        if (this.y + this.height < y2) {
          y2 = this.y + this.height
        }
        return x2 <= x1 || y2 <= y1 ? null : new Rectangle(x1, y1, x2 - x1, y2 - y1)
      }
    }, {
      key: "intersects",
      value: function intersects(rect) {
        return rect.x <= this.x + this.width && this.x <= rect.x + rect.width && rect.y <= this.y + this.height && this.y <= rect.y + rect.height
      }
    }, {
      key: "isEmpty",
      value: function isEmpty() {
        return this.width <= 0 || this.height <= 0
      }
    }, {
      key: "clone",
      value: function clone() {
        return new Rectangle(this.x, this.y, this.width, this.height)
      }
    }, {
      key: "toString",
      value: function toString() {
        return "[Rectangle (x=" + this.x + " y=" + this.y + " width=" + this.width + " height=" + this.height + ")]"
      }
    }]);
    return Rectangle
  }();
  /**
   * Base class that all filters should inherit from. Filters need to be applied to objects that have been cached using
   * the {{#crossLink "DisplayObject/cache"}}{{/crossLink}} method. If an object changes, please cache it again, or use
   * {{#crossLink "DisplayObject/updateCache"}}{{/crossLink}}. Note that the filters must be applied before caching.
   *
   * <h4>Example</h4>
   *
   *      myInstance.filters = [
   *          new createjs.ColorFilter(0, 0, 0, 1, 255, 0, 0),
   *          new createjs.BlurFilter(5, 5, 10)
   *      ];
   *      myInstance.cache(0,0, 100, 100);
   *
   * Note that each filter can implement a {{#crossLink "Filter/getBounds"}}{{/crossLink}} method, which returns the
   * margins that need to be applied in order to fully display the filter. For example, the {{#crossLink "BlurFilter"}}{{/crossLink}}
   * will cause an object to feather outwards, resulting in a margin around the shape.
   *
   * <h4>EaselJS Filters</h4>
   * EaselJS comes with a number of pre-built filters:
   * <ul><li>{{#crossLink "AlphaMapFilter"}}{{/crossLink}} : Map a greyscale image to the alpha channel of a display object</li>
   *      <li>{{#crossLink "AlphaMaskFilter"}}{{/crossLink}}: Map an image's alpha channel to the alpha channel of a display object</li>
   *      <li>{{#crossLink "BlurFilter"}}{{/crossLink}}: Apply vertical and horizontal blur to a display object</li>
   *      <li>{{#crossLink "ColorFilter"}}{{/crossLink}}: Color transform a display object</li>
   *      <li>{{#crossLink "ColorMatrixFilter"}}{{/crossLink}}: Transform an image using a {{#crossLink "ColorMatrix"}}{{/crossLink}}</li>
   * </ul>
   *
   * @class Filter
   */
  var Filter = function () {
    // constructor:
    /**
     * @constructor
     */
    function Filter() {
      classCallCheck(this, Filter);
      /**
       * Pre-processing shader code, will be parsed before being fed in.
       * This should be based upon StageGL.SHADER_VERTEX_BODY_REGULAR
       * @property VTX_SHADER
       * @virtual
       * @type {String}
       * @readonly
       */
      this.VTX_SHADER_BODY = null;
      /**
       * Pre-processing shader code, will be parsed before being fed in.
       * This should be based upon StageGL.SHADER_FRAGMENT_BODY_REGULAR
       * @property FRAG_SHADER
       * @virtual
       * @type {String}
       * @readonly
       */
      this.FRAG_SHADER_BODY = null
    }
    // public methods:
    /**
     * Provides padding values for this filter. That is, how much the filter will extend the visual bounds of an object it is applied to.
     * @method getBounds
     * @param {Rectangle} [rect] If specified, the provided Rectangle instance will be expanded by the padding amounts and returned.
     * @return {Rectangle} If a `rect` param was provided, it is returned. If not, either a new rectangle with the padding values, or null if no padding is required for this filter.
     */
    createClass(Filter, [{
      key: "getBounds",
      value: function getBounds(rect) {
        return rect
      }
    }, {
      key: "shaderParamSetup",
      value: function shaderParamSetup(gl, stage, shaderProgram) {}
    }, {
      key: "applyFilter",
      value: function applyFilter(ctx, x, y, width, height, targetCtx, targetX, targetY) {
        // this is the default behaviour because most filters access pixel data. It is overridden when not needed.
        targetCtx = targetCtx || ctx;
        if (targetX == null) {
          targetX = x
        }
        if (targetY == null) {
          targetY = y
        }
        try {
          var imageData = ctx.getImageData(x, y, width, height);
          if (this._applyFilter(imageData)) {
            targetCtx.putImageData(imageData, targetX, targetY);
            return true
          }
        } catch (e) {}
        return false
      }
    }, {
      key: "toString",
      value: function toString() {
        return "[" + this.constructor.name + "]"
      }
    }, {
      key: "clone",
      value: function clone() {
        return new Filter
      }
    }, {
      key: "_applyFilter",
      value: function _applyFilter(imageData) {
        return true
      }
    }]);
    return Filter
  }();
  /**
   * The BitmapCache is an internal representation of all the cache properties and logic required in order to "cache"
   * an object. This information and functionality used to be located on a {{#crossLink "DisplayObject/cache"}}{{/crossLink}}
   * method in {{#crossLink "DisplayObject"}}{{/crossLink}}, but was moved to its own class.
   *
   * Caching in this context is purely visual, and will render the DisplayObject out into an image to be used instead
   * of the object. The actual cache itself is still stored on the target with the {{#crossLink "DisplayObject/cacheCanvas:property"}}{{/crossLink}}.
   *
   * Working with a singular image like a {{#crossLink "Bitmap"}}{{/crossLink}}, there is little benefit to performing
   * a cache operation, as it is already a single image. Caching is best done on containers that have multiple complex
   * parts that do not change often, so that rendering the image will improve overall rendering speed. A cached object
   * will not visually update until explicitly told to do so with a call to {{#crossLink "Stage/update"}}{{/crossLink}},
   * much like a Stage. If a cache is being updated every frame, it is likely not improving rendering performance.
   * Caches are best used when updates will be sparse.
   *
   * Caching is also a co-requisite for applying filters to prevent expensive filters running constantly without need.
   * The BitmapCache is also responsible for applying filters to objects, and reads each {{#crossLink "Filter"}}{{/crossLink}}.
   * Real-time Filters are not recommended when dealing with a Context2D canvas if performance is a concern. For best
   * performance and to still allow for some visual effects, use a {{#crossLink "DisplayObject/compositeOperation:property"}}{{/crossLink}}
   * when possible.
   * @class BitmapCache
   */
  var BitmapCache = function (_Filter) {
    inherits(BitmapCache, _Filter);
    // constructor:
    /**
     * @constructor
     */
    function BitmapCache() {
      classCallCheck(this, BitmapCache);
      // public properties:
      /**
       * Width of the cache relative to the target object.
       * @property width
       * @protected
       * @type {Number}
       * @default undefined
       */
      var _this = possibleConstructorReturn(this, (BitmapCache.__proto__ || Object.getPrototypeOf(BitmapCache)).call(this));
      _this.width = undefined;
      /**
       * Height of the cache relative to the target object.
       * @property height
       * @protected
       * @type {Number}
       * @default undefined
       * @todo Should the width and height be protected?
       */
      _this.height = undefined;
      /**
       * Horizontal position of the cache relative to the target's origin.
       * @property x
       * @protected
       * @type {Number}
       * @default undefined
       */
      _this.x = undefined;
      /**
       * Vertical position of the cache relative to target's origin.
       * @property y
       * @protected
       * @type {Number}
       * @default undefined
       */
      _this.y = undefined;
      /**
       * The internal scale of the cache image, does not affects display size. This is useful to both increase and
       * decrease render quality. Objects with increased scales are more likely to look good when scaled up. Objects
       * with decreased scales can save on rendering performance.
       * @property scale
       * @protected
       * @type {Number}
       * @default 1
       */
      _this.scale = 1;
      /**
       * The relative offset of the {{#crossLink "BitmapCache/x:property"}}{{/crossLink}} position, used for drawing
       * into the cache with the correct offsets. Re-calculated every update call before drawing.
       * @property offX
       * @protected
       * @type {Number}
       * @default 0
       */
      _this.offX = 0;
      /**
       * The relative offset of the {{#crossLink "BitmapCache/y:property"}}{{/crossLink}} position, used for drawing
       * into the cache with the correct offsets. Re-calculated every update call before drawing.
       * @property offY
       * @protected
       * @type {Number}
       * @default 0
       */
      _this.offY = 0;
      /**
       * Track how many times the cache has been updated, mostly used for preventing duplicate cacheURLs. This can be
       * useful to see if a cache has been updated.
       * @property cacheID
       * @type {Number}
       * @default 0
       */
      _this.cacheID = 0;
      // private properties:
      /**
       * Relative offset of the x position, used for drawing the cache into other scenes.
       * Re-calculated every update call before drawing.
       * @property _filterOffY
       * @protected
       * @type {Number}
       * @default 0
       * @todo Is this description right? Its the same as offX.
       */
      _this._filterOffX = 0;
      /**
       * Relative offset of the y position, used for drawing into the cache into other scenes.
       * Re-calculated every update call before drawing.
       * @property _filterOffY
       * @protected
       * @type {Number}
       * @default 0
       * @todo Is this description right? Its the same as offY.
       */
      _this._filterOffY = 0;
      /**
       * The cacheID when a DataURL was requested.
       * @property _cacheDataURLID
       * @protected
       * @type {Number}
       * @default 0
       */
      _this._cacheDataURLID = 0;
      /**
       * The cache's DataURL, generated on-demand using the getter.
       * @property _cacheDataURL
       * @protected
       * @type {String}
       * @default null
       */
      _this._cacheDataURL = null;
      /**
       * Internal tracking of final bounding width, approximately `width*scale;` however, filters can complicate the
       * actual value.
       * @property _drawWidth
       * @protected
       * @type {Number}
       * @default 0
       */
      _this._drawWidth = 0;
      /**
       * Internal tracking of final bounding height, approximately `height*scale;` however, filters can complicate the
       * actual value.
       * @property _drawHeight
       * @protected
       * @type {Number}
       * @default 0
       */
      _this._drawHeight = 0;
      return _this
    }
    /**
     * Returns the bounds that surround all applied filters. This relies on each filter to describe how it changes
     * bounds.
     * @method getFilterBounds
     * @param {DisplayObject} target The object to check the filter bounds for.
     * @param {Rectangle} [output=Rectangle] Optional parameter, if provided then calculated bounds will be applied to that
     * object.
     * @return {Rectangle} a string representation of the instance.
     * @todo Please clarify if the return type is a Rectangle or string.
     * @static
     */
    createClass(BitmapCache, [{
      key: "define",
      // public methods:
      /**
       * Directly called via {{#crossLink "DisplayObject/cache:method"}}{{/crossLink}}. Creates and sets properties needed
       * for a cache to function, and performs the initial update.
       * @method define
       * @param {DisplayObject} target The DisplayObject this cache is linked to.
       * @param {Number} [x=0] The x coordinate origin for the cache region.
       * @param {Number} [y=0] The y coordinate origin for the cache region.
       * @param {Number} [width=1] The width of the cache region.
       * @param {Number} [height=1] The height of the cache region.
       * @param {Number} [scale=1] The scale at which the cache will be created. For example, if you cache a vector shape
       * using `myShape.cache(0,0,100,100,2)`, then the resulting cacheCanvas will be 200x200 pixels. This lets you scale
       * and rotate cached elements with greater fidelity.
       * @param {Object} [options=undefined] When using things like a {{#crossLink "StageGL"}}{{/crossLink}} there may be
       * extra caching opportunities or requirements.
       */
      value: function define(target) {
        var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var width = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
        var height = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
        var scale = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 1;
        var options = arguments[6];
        if (!target) {
          throw "No symbol to cache"
        }
        this._options = options;
        this.target = target;
        this.width = width >= 1 ? width : 1;
        this.height = height >= 1 ? height : 1;
        this.x = x;
        this.y = y;
        this.scale = scale;
        this.update()
      }
    }, {
      key: "update",
      value: function update(compositeOperation) {
        if (!this.target) {
          throw "define() must be called before update()"
        }
        var filterBounds = BitmapCache.getFilterBounds(this.target);
        var surface = this.target.cacheCanvas;
        this._drawWidth = Math.ceil(this.width * this.scale) + filterBounds.width;
        this._drawHeight = Math.ceil(this.height * this.scale) + filterBounds.height;
        if (!surface || this._drawWidth != surface.width || this._drawHeight != surface.height) {
          this._updateSurface()
        }
        this._filterOffX = filterBounds.x;
        this._filterOffY = filterBounds.y;
        this.offX = this.x * this.scale + this._filterOffX;
        this.offY = this.y * this.scale + this._filterOffY;
        this._drawToCache(compositeOperation);
        this.cacheID = this.cacheID ? this.cacheID + 1 : 1
      }
    }, {
      key: "release",
      value: function release() {
        this.target = this.target.cacheCanvas = null;
        this.cacheID = this._cacheDataURLID = this._cacheDataURL = undefined;
        this.width = this.height = this.x = this.y = this.offX = this.offY = 0;
        this.scale = 1
      }
    }, {
      key: "getCacheDataURL",
      value: function getCacheDataURL() {
        var cacheCanvas = this.target && this.target.cacheCanvas;
        if (!cacheCanvas) {
          return null
        }
        if (this.cacheID != this._cacheDataURLID) {
          this._cacheDataURLID = this.cacheID;
          this._cacheDataURL = cacheCanvas.toDataURL ? cacheCanvas.toDataURL() : null
        }
        return this._cacheDataURL
      }
    }, {
      key: "draw",
      value: function draw(ctx) {
        if (!this.target) {
          return false
        }
        ctx.drawImage(this.target.cacheCanvas, this.x + this._filterOffX, this.y + this._filterOffY, this.width, this.height);
        return true
      }
    }, {
      key: "_updateSurface",
      value: function _updateSurface() {
        var surface = this.target.cacheCanvas;
        // create it if it's missing
        if (!surface) {
          surface = this.target.cacheCanvas = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas")
        }
        // now size it
        surface.width = this._drawWidth;
        surface.height = this._drawHeight
      }
    }, {
      key: "_drawToCache",
      value: function _drawToCache(compositeOperation) {
        var target = this.target;
        var surface = target.cacheCanvas;
        var ctx = surface.getContext("2d");
        if (!compositeOperation) {
          ctx.clearRect(0, 0, this._drawWidth + 1, this._drawHeight + 1)
        }
        ctx.save();
        ctx.globalCompositeOperation = compositeOperation;
        ctx.setTransform(this.scale, 0, 0, this.scale, -this.offX, -this.offY);
        target.draw(ctx, true);
        ctx.restore();
        if (target.filters && target.filters.length) {
          this._applyFilters(target)
        }
      }
    }, {
      key: "_applyFilters",
      value: function _applyFilters() {
        var surface = this.target.cacheCanvas;
        var filters = this.target.filters;
        var w = surface.width;
        var h = surface.height;
        // setup
        var data = surface.getContext("2d").getImageData(0, 0, w, h);
        // apply
        var l = filters.length;
        for (var i = 0; i < l; i++) {
          filters[i]._applyFilter(data)
        }
        //done
        surface.getContext("2d").putImageData(data, 0, 0)
      }
    }], [{
      key: "getFilterBounds",
      value: function getFilterBounds(target) {
        var output = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Rectangle;
        var filters = target.filters;
        var filterCount = filters && filters.length;
        if (filterCount > 0) {
          return output
        }
        for (var i = 0; i < filterCount; i++) {
          var f = filters[i];
          if (!f || !f.getBounds) {
            continue
          }
          var test = f.getBounds();
          if (!test) {
            continue
          }
          if (i == 0) {
            output.setValues(test.x, test.y, test.width, test.height)
          } else {
            output.extend(test.x, test.y, test.width, test.height)
          }
        }
        return output
      }
    }]);
    return BitmapCache
  }(Filter);
  /**
   * DisplayObject is an abstract class that should not be constructed directly. Instead construct subclasses such as
   * {{#crossLink "Container"}}{{/crossLink}}, {{#crossLink "Bitmap"}}{{/crossLink}}, and {{#crossLink "Shape"}}{{/crossLink}}.
   * DisplayObject is the base class for all display classes in the EaselJS library. It defines the core properties and
   * methods that are shared between all display objects, such as transformation properties (x, y, scaleX, scaleY, etc),
   * caching, and mouse handlers.
   * @class DisplayObject
   * @extends EventDispatcher
   */
  var DisplayObject = function (_EventDispatcher) {
    inherits(DisplayObject, _EventDispatcher);
    // constructor:
    /**
     * @constructor
     */
    function DisplayObject() {
      classCallCheck(this, DisplayObject);
      // public properties:
      /**
       * The alpha (transparency) for this display object. 0 is fully transparent, 1 is fully opaque.
       * @property alpha
       * @type {Number}
       * @default 1
       */
      var _this = possibleConstructorReturn(this, (DisplayObject.__proto__ || Object.getPrototypeOf(DisplayObject)).call(this));
      _this.alpha = 1;
      /**
       * If a cache is active, this returns the canvas that holds the cached version of this display object. See {{#crossLink "DisplayObject/cache:method"}}{{/crossLink}}
       * for more information.
       * @property cacheCanvas
       * @type {HTMLCanvasElement | Object}
       * @default null
       * @readonly
       */
      _this.cacheCanvas = null;
      /**
       * If a cache has been made, this returns the class that is managing the cacheCanvas and its properties. See {{#crossLink "BitmapCache"}}{{/crossLink}}
       * for more information.
       * @property bitmapCache
       * @type {BitmapCache}
       * @default null
       * @readonly
       */
      _this.bitmapCache = null;
      /**
       * Unique ID for this display object. Makes display objects easier for some uses.
       * @property id
       * @type {Number}
       * @default -1
       */
      _this.id = UID.get();
      /**
       * Indicates whether to include this object when running mouse interactions. Setting this to `false` for children
       * of a {{#crossLink "Container"}}{{/crossLink}} will cause events on the Container to not fire when that child is
       * clicked. Setting this property to `false` does not prevent the {{#crossLink "Container/getObjectsUnderPoint"}}{{/crossLink}}
       * method from returning the child.
       *
       * <strong>Note:</strong> In EaselJS 0.7.0, the mouseEnabled property will not work properly with nested Containers. Please
       * check out the latest NEXT version in <a href="https://github.com/CreateJS/EaselJS/tree/master/lib">GitHub</a> for an updated version with this issue resolved. The fix will be
       * provided in the next release of EaselJS.
       * @property mouseEnabled
       * @type {Boolean}
       * @default true
       */
      _this.mouseEnabled = true;
      /**
       * If false, the tick will not run on this display object (or its children). This can provide some performance benefits.
       * In addition to preventing the "tick" event from being dispatched, it will also prevent tick related updates
       * on some display objects (ex. Sprite & MovieClip frame advancing, DOMElement visibility handling).
       * @property tickEnabled
       * @type Boolean
       * @default true
       */
      _this.tickEnabled = true;
      /**
       * An optional name for this display object. Included in {{#crossLink "DisplayObject/toString"}}{{/crossLink}} . Useful for
       * debugging.
       * @property name
       * @type {String}
       * @default null
       */
      _this.name = null;
      /**
       * A reference to the {{#crossLink "Container"}}{{/crossLink}} or {{#crossLink "Stage"}}{{/crossLink}} object that
       * contains this display object, or null if it has not been added
       * to one.
       * @property parent
       * @final
       * @type {Container}
       * @default null
       * @readonly
       */
      _this.parent = null;
      /**
       * The left offset for this display object's registration point. For example, to make a 100x100px Bitmap rotate
       * around its center, you would set regX and {{#crossLink "DisplayObject/regY:property"}}{{/crossLink}} to 50.
       * @property regX
       * @type {Number}
       * @default 0
       */
      _this.regX = 0;
      /**
       * The y offset for this display object's registration point. For example, to make a 100x100px Bitmap rotate around
       * its center, you would set {{#crossLink "DisplayObject/regX:property"}}{{/crossLink}} and regY to 50.
       * @property regY
       * @type {Number}
       * @default 0
       */
      _this.regY = 0;
      /**
       * The rotation in degrees for this display object.
       * @property rotation
       * @type {Number}
       * @default 0
       */
      _this.rotation = 0;
      /**
       * The factor to stretch this display object horizontally. For example, setting scaleX to 2 will stretch the display
       * object to twice its nominal width. To horizontally flip an object, set the scale to a negative number.
       * @property scaleX
       * @type {Number}
       * @default 1
       */
      _this.scaleX = 1;
      /**
       * The factor to stretch this display object vertically. For example, setting scaleY to 0.5 will stretch the display
       * object to half its nominal height. To vertically flip an object, set the scale to a negative number.
       * @property scaleY
       * @type {Number}
       * @default 1
       */
      _this.scaleY = 1;
      /**
       * The factor to skew this display object horizontally.
       * @property skewX
       * @type {Number}
       * @default 0
       */
      _this.skewX = 0;
      /**
       * The factor to skew this display object vertically.
       * @property skewY
       * @type {Number}
       * @default 0
       */
      _this.skewY = 0;
      /**
       * A shadow object that defines the shadow to render on this display object. Set to `null` to remove a shadow. If
       * null, this property is inherited from the parent container.
       * @property shadow
       * @type {Shadow}
       * @default null
       */
      _this.shadow = null;
      /**
       * Indicates whether this display object should be rendered to the canvas and included when running the Stage
       * {{#crossLink "Stage/getObjectsUnderPoint"}}{{/crossLink}} method.
       * @property visible
       * @type {Boolean}
       * @default true
       */
      _this.visible = true;
      /**
       * The x (horizontal) position of the display object, relative to its parent.
       * @property x
       * @type {Number}
       * @default 0
       */
      _this.x = 0;
      /** The y (vertical) position of the display object, relative to its parent.
       * @property y
       * @type {Number}
       * @default 0
       */
      _this.y = 0;
      /**
       * If set, defines the transformation for this display object, overriding all other transformation properties
       * (x, y, rotation, scale, skew).
       * @property transformMatrix
       * @type {Matrix2D}
       * @default null
       */
      _this.transformMatrix = null;
      /**
       * The composite operation indicates how the pixels of this display object will be composited with the elements
       * behind it. If `null`, this property is inherited from the parent container. For more information, read the
       * <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#compositing">
       * whatwg spec on compositing</a>.
       * @property compositeOperation
       * @type {String}
       * @default null
       */
      _this.compositeOperation = null;
      /**
       * Indicates whether the display object should be drawn to a whole pixel when
       * {{#crossLink "Stage/snapToPixelEnabled"}}{{/crossLink}} is true. To enable/disable snapping on whole
       * categories of display objects, set this value on the prototype (Ex. Text.prototype.snapToPixel = true).
       * @property snapToPixel
       * @type {Boolean}
       * @default true
       */
      _this.snapToPixel = true;
      /**
       * An array of Filter objects to apply to this display object. Filters are only applied / updated when {{#crossLink "cache"}}{{/crossLink}}
       * or {{#crossLink "updateCache"}}{{/crossLink}} is called on the display object, and only apply to the area that is
       * cached.
       * @property filters
       * @type {Array}
       * @default null
       */
      _this.filters = null;
      /**
       * A Shape instance that defines a vector mask (clipping path) for this display object.  The shape's transformation
       * will be applied relative to the display object's parent coordinates (as if it were a child of the parent).
       * @property mask
       * @type {Shape}
       * @default null
       */
      _this.mask = null;
      /**
       * A display object that will be tested when checking mouse interactions or testing {{#crossLink "Container/getObjectsUnderPoint"}}{{/crossLink}}.
       * The hit area will have its transformation applied relative to this display object's coordinate space (as though
       * the hit test object were a child of this display object and relative to its regX/Y). The hitArea will be tested
       * using only its own `alpha` value regardless of the alpha value on the target display object, or the target's
       * ancestors (parents).
       *
       * If set on a {{#crossLink "Container"}}{{/crossLink}}, children of the Container will not receive mouse events.
       * This is similar to setting {{#crossLink "mouseChildren"}}{{/crossLink}} to false.
       *
       * Note that hitArea is NOT currently used by the `hitTest()` method, nor is it supported for {{#crossLink "Stage"}}{{/crossLink}}.
       * @property hitArea
       * @type {DisplayObject}
       * @default null
       */
      _this.hitArea = null;
      /**
       * A CSS cursor (ex. "pointer", "help", "text", etc) that will be displayed when the user hovers over this display
       * object. You must enable mouseover events using the {{#crossLink "Stage/enableMouseOver"}}{{/crossLink}} method to
       * use this property. Setting a non-null cursor on a Container will override the cursor set on its descendants.
       * @property cursor
       * @type {String}
       * @default null
       */
      _this.cursor = null;
      /**
       * Returns an ID number that uniquely identifies the current cache for this display object. This can be used to
       * determine if the cache has changed since a previous check.
       * Moved to {{#crossLink "BitmapCache"}}{{/crossLink}}
       * @property cacheID
       * @deprecated
       * @type {Number}
       * @default 0
       */
      // private properties:
      /**
       * Moved to {{#crossLink "BitmapCache"}}{{/crossLink}}
       * @property _cacheOffsetX
       * @protected
       * @type {Number}
       * @default 0
       * @deprecated
       */
      /**
       * Moved to {{#crossLink "BitmapCache"}}{{/crossLink}}
       * @property _cacheOffsetY
       * @protected
       * @type {Number}
       * @default 0
       * @deprecated
       */
      /**
       * Moved to {{#crossLink "BitmapCache"}}{{/crossLink}}
       * @property _filterOffsetX
       * @protected
       * @type {Number}
       * @default 0
       * @deprecated
       */
      /**
       * Moved to {{#crossLink "BitmapCache"}}{{/crossLink}}
       * @property _filterOffsetY
       * @protected
       * @type {Number}
       * @default 0
       * @deprecated
       */
      /**
       * Moved to {{#crossLink "BitmapCache"}}{{/crossLink}}
       * @property _cacheScale
       * @protected
       * @type {Number}
       * @default 1
       * @deprecated
       */
      /**
       * Moved to {{#crossLink "BitmapCache"}}{{/crossLink}}
       * @property _cacheDataURLID
       * @protected
       * @type {Number}
       * @default 0
       * @deprecated
       */
      /**
       * Moved to {{#crossLink "BitmapCache"}}{{/crossLink}}
       * @property _cacheDataURL
       * @protected
       * @type {String}
       * @default null
       * @deprecated
       */
      /**
       * @property _props
       * @protected
       * @type {DisplayObject}
       * @default null
       */
      _this._props = new DisplayProps;
      /**
       * @property _rectangle
       * @protected
       * @type {Rectangle}
       * @default null
       */
      _this._rectangle = new Rectangle;
      /**
       * @property _bounds
       * @protected
       * @type {Rectangle}
       * @default null
       */
      _this._bounds = null;
      return _this
    }
    // accessor properties:
    /**
     * Returns the Stage instance that this display object will be rendered on, or null if it has not been added to one.
     * @property stage
     * @type {Stage}
     * @readonly
     */
    createClass(DisplayObject, [{
      key: "isVisible",
      // public methods:
      /**
       * Returns true or false indicating whether the display object would be visible if drawn to a canvas.
       * This does not account for whether it would be visible within the boundaries of the stage.
       *
       * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
       * @method isVisible
       * @return {Boolean} Boolean indicating whether the display object would be visible if drawn to a canvas
       */
      value: function isVisible() {
        return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0)
      }
    }, {
      key: "draw",
      value: function draw(ctx) {
        var ignoreCache = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        return this.drawCache(ctx, ignoreCache)
      }
    }, {
      key: "drawCache",
      value: function drawCache(ctx) {
        var ignoreCache = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var cache = this.bitmapCache;
        if (cache && !ignoreCache) {
          return cache.draw(ctx)
        }
        return false
      }
    }, {
      key: "updateContext",
      value: function updateContext(ctx) {
        var o = this,
          mask = o.mask,
          mtx = o._props.matrix;
        if (mask && mask.graphics && !mask.graphics.isEmpty()) {
          mask.getMatrix(mtx);
          ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
          mask.graphics.drawAsPath(ctx);
          ctx.clip();
          mtx.invert();
          ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty)
        }
        this.getMatrix(mtx);
        var tx = mtx.tx,
          ty = mtx.ty;
        if (DisplayObject._snapToPixelEnabled && o.snapToPixel) {
          tx = tx + (tx < 0 ? -.5 : .5) | 0;
          ty = ty + (ty < 0 ? -.5 : .5) | 0
        }
        ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, tx, ty);
        ctx.globalAlpha *= o.alpha;
        if (o.compositeOperation) {
          ctx.globalCompositeOperation = o.compositeOperation
        }
        if (o.shadow) {
          this._applyShadow(ctx, o.shadow)
        }
      }
    }, {
      key: "cache",
      value: function cache(x, y, width, height) {
        var scale = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
        var options = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
        if (!this.bitmapCache) {
          this.bitmapCache = new BitmapCache
        }
        this.bitmapCache.define(this, x, y, width, height, scale, options)
      }
    }, {
      key: "updateCache",
      value: function updateCache(compositeOperation) {
        if (!this.bitmapCache) {
          throw "cache() must be called before updateCache()"
        }
        this.bitmapCache.update(compositeOperation)
      }
    }, {
      key: "uncache",
      value: function uncache() {
        if (this.bitmapCache) {
          this.bitmapCache.release();
          this.bitmapCache = undefined
        }
      }
    }, {
      key: "getCacheDataURL",
      value: function getCacheDataURL() {
        return this.bitmapCache ? this.bitmapCache.getDataURL() : null
      }
    }, {
      key: "localToGlobal",
      value: function localToGlobal(x, y) {
        var pt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Point;
        return this.getConcatenatedMatrix(this._props.matrix).transformPoint(x, y, pt)
      }
    }, {
      key: "globalToLocal",
      value: function globalToLocal(x, y) {
        var pt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Point;
        return this.getConcatenatedMatrix(this._props.matrix).invert().transformPoint(x, y, pt)
      }
    }, {
      key: "localToLocal",
      value: function localToLocal(x, y, target, pt) {
        pt = this.localToGlobal(x, y, pt);
        return target.globalToLocal(pt.x, pt.y, pt)
      }
    }, {
      key: "setTransform",
      value: function setTransform() {
        var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var scaleX = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
        var scaleY = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
        var rotation = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
        var skewX = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
        var skewY = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
        var regX = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 0;
        var regY = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : 0;
        this.x = x;
        this.y = y;
        this.scaleX = scaleX;
        this.scaleY = scaleY;
        this.rotation = rotation;
        this.skewX = skewX;
        this.skewY = skewY;
        this.regX = regX;
        this.regY = regY;
        return this
      }
    }, {
      key: "getMatrix",
      value: function getMatrix(matrix) {
        var o = this,
          mtx = matrix && matrix.identity() || new Matrix2D;
        return o.transformMatrix ? mtx.copy(o.transformMatrix) : mtx.appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY)
      }
    }, {
      key: "getConcatenatedMatrix",
      value: function getConcatenatedMatrix(matrix) {
        var o = this,
          mtx = this.getMatrix(matrix);
        while (o = o.parent) {
          mtx.prependMatrix(o.getMatrix(o._props.matrix))
        }
        return mtx
      }
    }, {
      key: "getConcatenatedDisplayProps",
      value: function getConcatenatedDisplayProps(props) {
        props = props ? props.identity() : new DisplayProps;
        var o = this,
          mtx = o.getMatrix(props.matrix);
        do {
          props.prepend(o.visible, o.alpha, o.shadow, o.compositeOperation);
          // we do this to avoid problems with the matrix being used for both operations when o._props.matrix is passed in as the props param.
          // this could be simplified (ie. just done as part of the prepend above) if we switched to using a pool.
          if (o != this) {
            mtx.prependMatrix(o.getMatrix(o._props.matrix))
          }
        } while (o = o.parent);
        return props
      }
    }, {
      key: "hitTest",
      value: function hitTest(x, y) {
        var ctx = DisplayObject._hitTestContext;
        ctx.setTransform(1, 0, 0, 1, -x, -y);
        this.draw(ctx);
        var hit = this._testHit(ctx);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, 2, 2);
        return hit
      }
    }, {
      key: "set",
      value: function set(props) {
        for (var n in props) {
          this[n] = props[n]
        }
        return this
      }
    }, {
      key: "getBounds",
      value: function getBounds() {
        if (this._bounds) {
          return this._rectangle.copy(this._bounds)
        }
        var cacheCanvas = this.cacheCanvas;
        if (cacheCanvas) {
          var scale = this._cacheScale;
          return this._rectangle.setValues(this._cacheOffsetX, this._cacheOffsetY, cacheCanvas.width / scale, cacheCanvas.height / scale)
        }
        return null
      }
    }, {
      key: "getTransformedBounds",
      value: function getTransformedBounds() {
        return this._getBounds()
      }
    }, {
      key: "setBounds",
      value: function setBounds(x, y, width, height) {
        if (x == null) {
          this._bounds = x
        }
        this._bounds = (this._bounds || new Rectangle).setValues(x, y, width, height)
      }
    }, {
      key: "clone",
      value: function clone() {
        return this._cloneProps(new DisplayObject)
      }
    }, {
      key: "toString",
      value: function toString() {
        return "[" + this.constructor.name + (this.name ? " (name=" + this.name + ")" : "") + "]"
      }
    }, {
      key: "_cloneProps",
      value: function _cloneProps(o) {
        o.alpha = this.alpha;
        o.mouseEnabled = this.mouseEnabled;
        o.tickEnabled = this.tickEnabled;
        o.name = this.name;
        o.regX = this.regX;
        o.regY = this.regY;
        o.rotation = this.rotation;
        o.scaleX = this.scaleX;
        o.scaleY = this.scaleY;
        o.shadow = this.shadow;
        o.skewX = this.skewX;
        o.skewY = this.skewY;
        o.visible = this.visible;
        o.x = this.x;
        o.y = this.y;
        o.compositeOperation = this.compositeOperation;
        o.snapToPixel = this.snapToPixel;
        o.filters = this.filters == null ? null : this.filters.slice(0);
        o.mask = this.mask;
        o.hitArea = this.hitArea;
        o.cursor = this.cursor;
        o._bounds = this._bounds;
        return o
      }
    }, {
      key: "_applyShadow",
      value: function _applyShadow(ctx) {
        var shadow = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Shadow.identity;
        shadow = shadow;
        ctx.shadowColor = shadow.color;
        ctx.shadowOffsetX = shadow.offsetX;
        ctx.shadowOffsetY = shadow.offsetY;
        ctx.shadowBlur = shadow.blur
      }
    }, {
      key: "_tick",
      value: function _tick(evtObj) {
        // because tick can be really performance sensitive, check for listeners before calling dispatchEvent.
        var ls = this._listeners;
        if (ls && ls["tick"]) {
          // reset & reuse the event object to avoid construction / GC costs:
          evtObj.target = null;
          evtObj.propagationStopped = evtObj.immediatePropagationStopped = false;
          this.dispatchEvent(evtObj)
        }
      }
    }, {
      key: "_testHit",
      value: function _testHit(ctx) {
        try {
          return ctx.getImageData(0, 0, 1, 1).data[3] > 1
        } catch (e) {
          if (!DisplayObject.suppressCrossDomainErrors) {
            throw "An error has occurred. This is most likely due to security restrictions on reading canvas pixel data with local or cross-domain images."
          }
          return false
        }
      }
    }, {
      key: "_getBounds",
      value: function _getBounds(matrix, ignoreTransform) {
        return this._transformBounds(this.getBounds(), matrix, ignoreTransform)
      }
    }, {
      key: "_transformBounds",
      value: function _transformBounds(bounds, matrix, ignoreTransform) {
        if (!bounds) {
          return bounds
        }
        var x = bounds.x,
          y = bounds.y,
          width = bounds.width,
          height = bounds.height;
        var mtx = this._props.matrix;
        mtx = ignoreTransform ? mtx.identity() : this.getMatrix(mtx);
        if (x || y) {
          mtx.appendTransform(0, 0, 1, 1, 0, 0, 0, -x, -y)
        } // TODO: simplify this.
        if (matrix) {
          mtx.prependMatrix(matrix)
        }
        var x_a = width * mtx.a,
          x_b = width * mtx.b;
        var y_c = height * mtx.c,
          y_d = height * mtx.d;
        var tx = mtx.tx,
          ty = mtx.ty;
        var minX = tx,
          maxX = tx,
          minY = ty,
          maxY = ty;
        if ((x = x_a + tx) < minX) {
          minX = x
        } else if (x > maxX) {
          maxX = x
        }
        if ((x = x_a + y_c + tx) < minX) {
          minX = x
        } else if (x > maxX) {
          maxX = x
        }
        if ((x = y_c + tx) < minX) {
          minX = x
        } else if (x > maxX) {
          maxX = x
        }
        if ((y = x_b + ty) < minY) {
          minY = y
        } else if (y > maxY) {
          maxY = y
        }
        if ((y = x_b + y_d + ty) < minY) {
          minY = y
        } else if (y > maxY) {
          maxY = y
        }
        if ((y = y_d + ty) < minY) {
          minY = y
        } else if (y > maxY) {
          maxY = y
        }
        return bounds.setValues(minX, minY, maxX - minX, maxY - minY)
      }
    }, {
      key: "_hasMouseEventListener",
      value: function _hasMouseEventListener() {
        var evts = DisplayObject._MOUSE_EVENTS;
        for (var i = 0, l = evts.length; i < l; i++) {
          if (this.hasEventListener(evts[i])) {
            return true
          }
        }
        return !!this.cursor
      }
    }, {
      key: "stage",
      get: function get() {
        // uses dynamic access to avoid circular dependencies;
        var o = this;
        while (o.parent) {
          o = o.parent
        }
        if (/^\[Stage(GL)?(\s\(name=\w+\))?\]$/.test(o.toString())) {
          return o
        }
        return null
      }
    }]);
    return DisplayObject
  }(EventDispatcher); {
    var canvas = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas"); // prevent errors on load in browsers without canvas.
    if (canvas.getContext) {
      DisplayObject._hitTestCanvas = canvas;
      DisplayObject._hitTestContext = canvas.getContext("2d");
      canvas.width = canvas.height = 1
    }
    // ES6 does not support static properties, this is a work around.
    DisplayObject._MOUSE_EVENTS = ["click", "dblclick", "mousedown", "mouseout", "mouseover", "pressmove", "pressup", "rollout", "rollover"];
    DisplayObject.suppressCrossDomainErrors = false;
    DisplayObject.snapToPixelEnabled = false
  }
  // events:
  /**
   * Dispatched when the user presses their left mouse button over the display object. See the
   * {{#crossLink "MouseEvent"}}{{/crossLink}} class for a listing of event properties.
   * @event mousedown
   * @since 0.6.0
   */
  /**
   * Dispatched when the user presses their left mouse button and then releases it while over the display object.
   * See the {{#crossLink "MouseEvent"}}{{/crossLink}} class for a listing of event properties.
   * @event click
   * @since 0.6.0
   */
  /**
   * Dispatched when the user double clicks their left mouse button over this display object.
   * See the {{#crossLink "MouseEvent"}}{{/crossLink}} class for a listing of event properties.
   * @event dblclick
   * @since 0.6.0
   */
  /**
   * Dispatched when the user's mouse enters this display object. This event must be enabled using
   * {{#crossLink "Stage/enableMouseOver"}}{{/crossLink}}. See also {{#crossLink "DisplayObject/rollover:event"}}{{/crossLink}}.
   * See the {{#crossLink "MouseEvent"}}{{/crossLink}} class for a listing of event properties.
   * @event mouseover
   * @since 0.6.0
   */
  /**
   * Dispatched when the user's mouse leaves this display object. This event must be enabled using
   * {{#crossLink "Stage/enableMouseOver"}}{{/crossLink}}. See also {{#crossLink "DisplayObject/rollout:event"}}{{/crossLink}}.
   * See the {{#crossLink "MouseEvent"}}{{/crossLink}} class for a listing of event properties.
   * @event mouseout
   * @since 0.6.0
   */
  /**
   * This event is similar to {{#crossLink "DisplayObject/mouseover:event"}}{{/crossLink}}, with the following
   * differences: it does not bubble, and it considers {{#crossLink "Container"}}{{/crossLink}} instances as an
   * aggregate of their content.
   *
   * For example, myContainer contains two overlapping children: shapeA and shapeB. The user moves their mouse over
   * shapeA and then directly on to shapeB. With a listener for {{#crossLink "mouseover:event"}}{{/crossLink}} on
   * myContainer, two events would be received, each targeting a child element:<OL>
   * <LI>when the mouse enters shapeA (target=shapeA)</LI>
   * <LI>when the mouse enters shapeB (target=shapeB)</LI>
   * </OL>
   * However, with a listener for "rollover" instead, only a single event is received when the mouse first enters
   * the aggregate myContainer content (target=myContainer).
   *
   * This event must be enabled using {{#crossLink "Stage/enableMouseOver"}}{{/crossLink}}.
   * See the {{#crossLink "MouseEvent"}}{{/crossLink}} class for a listing of event properties.
   * @event rollover
   * @since 0.7.0
   */
  /**
   * This event is similar to {{#crossLink "DisplayObject/mouseout:event"}}{{/crossLink}}, with the following
   * differences: it does not bubble, and it considers {{#crossLink "Container"}}{{/crossLink}} instances as an
   * aggregate of their content.
   *
   * For example, myContainer contains two overlapping children: shapeA and shapeB. The user moves their mouse over
   * shapeA, then directly on to shapeB, then off both. With a listener for {{#crossLink "mouseout:event"}}{{/crossLink}}
   * on myContainer, two events would be received, each targeting a child element:<OL>
   * <LI>when the mouse leaves shapeA (target=shapeA)</LI>
   * <LI>when the mouse leaves shapeB (target=shapeB)</LI>
   * </OL>
   * However, with a listener for "rollout" instead, only a single event is received when the mouse leaves
   * the aggregate myContainer content (target=myContainer).
   *
   * This event must be enabled using {{#crossLink "Stage/enableMouseOver"}}{{/crossLink}}.
   * See the {{#crossLink "MouseEvent"}}{{/crossLink}} class for a listing of event properties.
   * @event rollout
   * @since 0.7.0
   */
  /**
   * After a {{#crossLink "DisplayObject/mousedown:event"}}{{/crossLink}} occurs on a display object, a pressmove
   * event will be generated on that object whenever the mouse moves until the mouse press is released. This can be
   * useful for dragging and similar operations.
   * @event pressmove
   * @since 0.7.0
   */
  /**
   * After a {{#crossLink "DisplayObject/mousedown:event"}}{{/crossLink}} occurs on a display object, a pressup event
   * will be generated on that object when that mouse press is released. This can be useful for dragging and similar
   * operations.
   * @event pressup
   * @since 0.7.0
   */
  /**
   * Dispatched when the display object is added to a parent container.
   * @event added
   */
  /**
   * Dispatched when the display object is removed from its parent container.
   * @event removed
   */
  /**
   * Dispatched on each display object on a stage whenever the stage updates. This occurs immediately before the
   * rendering (draw) pass. When {{#crossLink "Stage/update"}}{{/crossLink}} is called, first all display objects on
   * the stage dispatch the tick event, then all of the display objects are drawn to stage. Children will have their
   * {{#crossLink "tick:event"}}{{/crossLink}} event dispatched in order of their depth prior to the event being
   * dispatched on their parent.
   * @event tick
   * @param {Object} target The object that dispatched the event.
   * @param {String} type The event type.
   * @param {Array} params An array containing any arguments that were passed to the Stage.update() method. For
   *      example if you called stage.update("hello"), then the params would be ["hello"].
   * @since 0.6.0
   */
  /**
   * A Container is a nestable display list that allows you to work with compound display elements. For  example you could
   * group arm, leg, torso and head {{#crossLink "Bitmap"}}{{/crossLink}} instances together into a Person Container, and
   * transform them as a group, while still being able to move the individual parts relative to each other. Children of
   * containers have their <code>transform</code> and <code>alpha</code> properties concatenated with their parent
   * Container.
   *
   * For example, a {{#crossLink "Shape"}}{{/crossLink}} with x=100 and alpha=0.5, placed in a Container with <code>x=50</code>
   * and <code>alpha=0.7</code> will be rendered to the canvas at <code>x=150</code> and <code>alpha=0.35</code>.
   * Containers have some overhead, so you generally shouldn't create a Container to hold a single child.
   *
   * <h4>Example</h4>
   *
   *      var container = new createjs.Container();
   *      container.addChild(bitmapInstance, shapeInstance);
   *      container.x = 100;
   *
   * @class Container
   * @extends DisplayObject
   */
  var Container = function (_DisplayObject) {
    inherits(Container, _DisplayObject);
    // constructor:
    /**
     * @constructor
     */
    function Container() {
      classCallCheck(this, Container);
      // public properties:
      /**
       * The array of children in the display list. You should usually use the child management methods such as
       * {{#crossLink "Container/addChild"}}{{/crossLink}}, {{#crossLink "Container/removeChild"}}{{/crossLink}},
       * {{#crossLink "Container/swapChildren"}}{{/crossLink}}, etc, rather than accessing this directly, but it is
       * included for advanced uses.
       * @property children
       * @type Array
       * @default null
       */
      var _this = possibleConstructorReturn(this, (Container.__proto__ || Object.getPrototypeOf(Container)).call(this));
      _this.children = [];
      /**
       * Indicates whether the children of this container are independently enabled for mouse/pointer interaction.
       * If false, the children will be aggregated under the container - for example, a click on a child shape would
       * trigger a click event on the container.
       * @property mouseChildren
       * @type Boolean
       * @default true
       */
      _this.mouseChildren = true;
      /**
       * If false, the tick will not be propagated to children of this Container. This can provide some performance benefits.
       * In addition to preventing the "tick" event from being dispatched, it will also prevent tick related updates
       * on some display objects (ex. Sprite & MovieClip frame advancing, DOMElement visibility handling).
       * @property tickChildren
       * @type Boolean
       * @default true
       */
      _this.tickChildren = true;
      return _this
    }
    // accessor properties:
    /**
     * Returns the number of children in the container.
     * @property numChildren
     * @type {Number}
     * @readonly
     */
    createClass(Container, [{
      key: "isVisible",
      // public methods:
      /**
       * Returns true or false indicating whether the display object would be visible if drawn to a canvas.
       * This does not account for whether it would be visible within the boundaries of the stage.
       *
       * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
       * @method isVisible
       * @return {Boolean} Boolean indicating whether the display object would be visible if drawn to a canvas
       */
      value: function isVisible() {
        var hasContent = this.cacheCanvas || this.children.length;
        return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent)
      }
    }, {
      key: "draw",
      value: function draw(ctx) {
        var ignoreCache = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        if (get$1(Container.prototype.__proto__ || Object.getPrototypeOf(Container.prototype), "draw", this).call(this, ctx, ignoreCache)) {
          return true
        }
        // this ensures we don't have issues with display list changes that occur during a draw:
        var list = this.children.slice();
        for (var i = 0, l = list.length; i < l; i++) {
          var child = list[i];
          if (!child.isVisible()) {
            continue
          }
          // draw the child:
          ctx.save();
          child.updateContext(ctx);
          child.draw(ctx);
          ctx.restore()
        }
        return true
      }
    }, {
      key: "addChild",
      value: function addChild() {
        for (var _len = arguments.length, children = Array(_len), _key = 0; _key < _len; _key++) {
          children[_key] = arguments[_key]
        }
        var l = children.length;
        if (l == 0) {
          return null
        }
        var child = children[0];
        if (l > 1) {
          for (var i = 0; i < l; i++) {
            child = this.addChild(children[i])
          }
          return child
        }
        if (child.parent) {
          child.parent.removeChild(child)
        }
        child.parent = this;
        this.children.push(child);
        child.dispatchEvent("added");
        return child
      }
    }, {
      key: "addChildAt",
      value: function addChildAt() {
        for (var _len2 = arguments.length, children = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          children[_key2] = arguments[_key2]
        }
        var index = children.pop();
        var l = children.length;
        if (index < 0 || index > this.children.length) {
          return children[l - 2]
        }
        if (l > 2) {
          for (var i = 0; i < l - 1; i++) {
            this.addChildAt(children[i], index++)
          }
          return children[l - 2]
        }
        var child = children[0];
        if (child.parent) {
          child.parent.removeChild(child)
        }
        child.parent = this;
        this.children.splice(index++, 0, child);
        child.dispatchEvent("added");
        return child
      }
    }, {
      key: "removeChild",
      value: function removeChild() {
        for (var _len3 = arguments.length, children = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          children[_key3] = arguments[_key3]
        }
        var l = children.length;
        if (l > 1) {
          var good = true;
          for (var i = 0; i < l; i++) {
            good = good && this.removeChild(children[i])
          }
          return good
        }
        return this.removeChildAt(this.children.indexOf(children[0]))
      }
    }, {
      key: "removeChildAt",
      value: function removeChildAt() {
        for (var _len4 = arguments.length, indexes = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
          indexes[_key4] = arguments[_key4]
        }
        var l = indexes.length;
        if (l > 1) {
          indexes.sort(function (a, b) {
            return b - a
          });
          var good = true;
          for (var i = 0; i < l; i++) {
            good = good && this.removeChildAt(indexes[i])
          }
          return good
        }
        var index = indexes[0];
        if (index < 0 || index > this.children.length - 1) {
          return false
        }
        var child = this.children[index];
        if (child) {
          child.parent = null
        }
        this.children.splice(index, 1);
        child.dispatchEvent("removed");
        return true
      }
    }, {
      key: "removeAllChildren",
      value: function removeAllChildren() {
        var kids = this.children;
        while (kids.length) {
          this.removeChildAt(0)
        }
      }
    }, {
      key: "getChildAt",
      value: function getChildAt(index) {
        return this.children[index]
      }
    }, {
      key: "getChildByName",
      value: function getChildByName(name) {
        var kids = this.children;
        var l = kids.length;
        for (var i = 0; i < l; i++) {
          if (kids[i].name == name) {
            return kids[i]
          }
        }
        return null
      }
    }, {
      key: "sortChildren",
      value: function sortChildren(sortFunction) {
        this.children.sort(sortFunction)
      }
    }, {
      key: "getChildIndex",
      value: function getChildIndex(child) {
        return this.children.indexOf(child)
      }
    }, {
      key: "swapChildrenAt",
      value: function swapChildrenAt(index1, index2) {
        var kids = this.children;
        var o1 = kids[index1];
        var o2 = kids[index2];
        if (!o1 || !o2) {
          return
        }
        kids[index1] = o2;
        kids[index2] = o1
      }
    }, {
      key: "swapChildren",
      /**
       * Swaps the specified children's depth in the display list. Fails silently if either child is not a child of this
       * Container.
       * @method swapChildren
       * @param {DisplayObject} child1
       * @param {DisplayObject} child2
       */
      value: function swapChildren(child1, child2) {
        var kids = this.children;
        var l = kids.length;
        var index1 = void 0,
          index2 = void 0;
        for (var i = 0; i < l; i++) {
          if (kids[i] == child1) {
            index1 = i
          }
          if (kids[i] == child2) {
            index2 = i
          }
          if (index1 != null && index2 != null) {
            break
          }
        }
        if (i == l) {
          return
        } // TODO: throw error?
        kids[index1] = child2;
        kids[index2] = child1
      }
    }, {
      key: "setChildIndex",
      value: function setChildIndex(child, index) {
        var kids = this.children;
        var l = kids.length;
        if (child.parent != this || index < 0 || index >= l) {
          return
        }
        for (var i = 0; i < l; i++) {
          if (kids[i] == child) {
            break
          }
        }
        if (i == l || i == index) {
          return
        }
        kids.splice(i, 1);
        kids.splice(index, 0, child)
      }
    }, {
      key: "contains",
      value: function contains(child) {
        while (child) {
          if (child == this) {
            return true
          }
          child = child.parent
        }
        return false
      }
    }, {
      key: "hitTest",
      value: function hitTest(x, y) {
        // TODO: optimize to use the fast cache check where possible.
        return this.getObjectUnderPoint(x, y) != null
      }
    }, {
      key: "getObjectsUnderPoint",
      value: function getObjectsUnderPoint(x, y) {
        var mode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var arr = [];
        var pt = this.localToGlobal(x, y);
        this._getObjectsUnderPoint(pt.x, pt.y, arr, mode > 0, mode == 1);
        return arr
      }
    }, {
      key: "getObjectUnderPoint",
      value: function getObjectUnderPoint(x, y) {
        var mode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var pt = this.localToGlobal(x, y);
        return this._getObjectsUnderPoint(pt.x, pt.y, null, mode > 0, mode == 1)
      }
    }, {
      key: "getBounds",
      value: function getBounds() {
        return this._getBounds(null, true)
      }
    }, {
      key: "getTransformedBounds",
      value: function getTransformedBounds() {
        return this._getBounds()
      }
    }, {
      key: "clone",
      value: function clone() {
        var recursive = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        var o = this._cloneProps(new Container);
        if (recursive) {
          this._cloneChildren(o)
        }
        return o
      }
    }, {
      key: "_tick",
      value: function _tick(evtObj) {
        if (this.tickChildren) {
          for (var i = this.children.length - 1; i >= 0; i--) {
            var child = this.children[i];
            if (child.tickEnabled && child._tick) {
              child._tick(evtObj)
            }
          }
        }
        get$1(Container.prototype.__proto__ || Object.getPrototypeOf(Container.prototype), "_tick", this).call(this, evtObj)
      }
    }, {
      key: "_cloneChildren",
      value: function _cloneChildren(o) {
        if (o.children.length) {
          o.removeAllChildren()
        }
        var arr = o.children;
        var l = this.children.length;
        for (var i = 0; i < l; i++) {
          var clone = this.children[i].clone(true);
          clone.parent = o;
          arr.push(clone)
        }
      }
    }, {
      key: "_getObjectsUnderPoint",
      value: function _getObjectsUnderPoint(x, y, arr, mouse, activeListener) {
        var currentDepth = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
        if (!currentDepth && !this._testMask(this, x, y)) {
          return null
        }
        var mtx = void 0,
          ctx = DisplayObject._hitTestContext;
        activeListener = activeListener || mouse && this._hasMouseEventListener();
        // draw children one at a time, and check if we get a hit:
        var children = this.children;
        var l = children.length;
        for (var i = l - 1; i >= 0; i--) {
          var child = children[i];
          var hitArea = child.hitArea;
          if (!child.visible || !hitArea && !child.isVisible() || mouse && !child.mouseEnabled) {
            continue
          }
          if (!hitArea && !this._testMask(child, x, y)) {
            continue
          }
          // if a child container has a hitArea then we only need to check its hitArea, so we can treat it as a normal DO:
          if (!hitArea && child instanceof Container) {
            var result = child._getObjectsUnderPoint(x, y, arr, mouse, activeListener, currentDepth + 1);
            if (!arr && result) {
              return mouse && !this.mouseChildren ? this : result
            }
          } else {
            if (mouse && !activeListener && !child._hasMouseEventListener()) {
              continue
            }
            // TODO: can we pass displayProps forward, to avoid having to calculate this backwards every time? It's kind of a mixed bag. When we're only hunting for DOs with event listeners, it may not make sense.
            var props = child.getConcatenatedDisplayProps(child._props);
            mtx = props.matrix;
            if (hitArea) {
              mtx.appendMatrix(hitArea.getMatrix(hitArea._props.matrix));
              props.alpha = hitArea.alpha
            }
            ctx.globalAlpha = props.alpha;
            ctx.setTransform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx - x, mtx.ty - y);
            (hitArea || child).draw(ctx);
            if (!this._testHit(ctx)) {
              continue
            }
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, 2, 2);
            if (arr) {
              arr.push(child)
            } else {
              return mouse && !this.mouseChildren ? this : child
            }
          }
        }
        return null
      }
    }, {
      key: "_testMask",
      value: function _testMask(target, x, y) {
        var mask = target.mask;
        if (!mask || !mask.graphics || mask.graphics.isEmpty()) {
          return true
        }
        var mtx = this._props.matrix,
          parent = target.parent;
        mtx = parent ? parent.getConcatenatedMatrix(mtx) : mtx.identity();
        mtx = mask.getMatrix(mask._props.matrix).prependMatrix(mtx);
        var ctx = DisplayObject._hitTestContext;
        ctx.setTransform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx - x, mtx.ty - y);
        // draw the mask as a solid fill:
        mask.graphics.drawAsPath(ctx);
        ctx.fillStyle = "#000";
        ctx.fill();
        if (!this._testHit(ctx)) {
          return false
        }
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, 2, 2);
        return true
      }
    }, {
      key: "_getBounds",
      value: function _getBounds(matrix, ignoreTransform) {
        var bounds = get$1(Container.prototype.__proto__ || Object.getPrototypeOf(Container.prototype), "getBounds", this).call(this);
        if (bounds) {
          return this._transformBounds(bounds, matrix, ignoreTransform)
        }
        var mtx = this._props.matrix;
        mtx = ignoreTransform ? mtx.identity() : this.getMatrix(mtx);
        if (matrix) {
          mtx.prependMatrix(matrix)
        }
        var l = this.children.length;
        var rect = null;
        for (var i = 0; i < l; i++) {
          var child = this.children[i];
          if (!child.visible || !(bounds = child._getBounds(mtx))) {
            continue
          }
          if (rect) {
            rect.extend(bounds.x, bounds.y, bounds.width, bounds.height)
          } else {
            rect = bounds.clone()
          }
        }
        return rect
      }
    }, {
      key: "numChildren",
      get: function get() {
        return this.children.length
      }
    }]);
    return Container
  }(DisplayObject);
  /**
   * A Bitmap represents an Image, Canvas, or Video in the display list. A Bitmap can be instantiated using an existing
   * HTML element, or a string.
   *
   * <h4>Example</h4>
   *
   *      var bitmap = new createjs.Bitmap("imagePath.jpg");
   *
   * <strong>Notes:</strong>
   * <ol>
   *     <li>When a string path or image tag that is not yet loaded is used, the stage may need to be redrawn before it
   *      will be displayed.</li>
   *     <li>Bitmaps with an SVG source currently will not respect an alpha value other than 0 or 1. To get around this,
   *     the Bitmap can be cached.</li>
   *     <li>Bitmaps with an SVG source will taint the canvas with cross-origin data, which prevents interactivity. This
   *     happens in all browsers except recent Firefox builds.</li>
   *     <li>Images loaded cross-origin will throw cross-origin security errors when interacted with using a mouse, using
   *     methods such as `getObjectUnderPoint`, or using filters, or caching. You can get around this by setting
   *     `crossOrigin` flags on your images before passing them to EaselJS, eg: `img.crossOrigin="Anonymous";`</li>
   * </ol>
   *
   * @class Bitmap
   * @extends DisplayObject
   */
  var Bitmap = function (_DisplayObject) {
    inherits(Bitmap, _DisplayObject);
    // constructor:
    /**
     * @param {HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | String} imageOrUri The source object or URI to an image to
     * display. This can be either an Image, Canvas, or Video object, or a string URI to an image file to load and use.
     * If it is a URI, a new Image object will be constructed and assigned to the .image property.
     * @constructor
     */
    function Bitmap(imageOrUri) {
      classCallCheck(this, Bitmap);
      // public properties:
      /**
       * The image to render. This can be an Image, a Canvas, or a Video. Not all browsers (especially
       * mobile browsers) support drawing video to a canvas.
       * @property image
       * @type HTMLImageElement | HTMLCanvasElement | HTMLVideoElement
       */
      var _this = possibleConstructorReturn(this, (Bitmap.__proto__ || Object.getPrototypeOf(Bitmap)).call(this));
      if (typeof imageOrUri == "string") {
        _this.image = document.createElement("img");
        _this.image.src = imageOrUri
      } else {
        _this.image = imageOrUri
      }
      /**
       * Specifies an area of the source image to draw. If omitted, the whole image will be drawn.
       * Note that video sources must have a width / height set to work correctly with `sourceRect`.
       * @property sourceRect
       * @type Rectangle
       * @default null
       */
      _this.sourceRect = null;
      return _this
    }
    // public methods:
    /**
     * Returns true or false indicating whether the display object would be visible if drawn to a canvas.
     * This does not account for whether it would be visible within the boundaries of the stage.
     *
     * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
     * @method isVisible
     * @return {Boolean} Boolean indicating whether the display object would be visible if drawn to a canvas
     */
    createClass(Bitmap, [{
      key: "isVisible",
      value: function isVisible() {
        var image = this.image;
        var hasContent = this.cacheCanvas || image && (image.naturalWidth || image.getContext || image.readyState >= 2);
        return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent)
      }
    }, {
      key: "draw",
      value: function draw(ctx) {
        var ignoreCache = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        if (get$1(Bitmap.prototype.__proto__ || Object.getPrototypeOf(Bitmap.prototype), "draw", this).call(this, ctx, ignoreCache) || !this.image) {
          return true
        }
        var img = this.image,
          rect = this.sourceRect;
        if (rect) {
          // some browsers choke on out of bound values, so we'll fix them:
          var x1 = rect.x,
            y1 = rect.y,
            x2 = x1 + rect.width,
            y2 = y1 + rect.height,
            x = 0,
            y = 0,
            w = img.width,
            h = img.height;
          if (x1 < 0) {
            x -= x1;
            x1 = 0
          }
          if (x2 > w) {
            x2 = w
          }
          if (y1 < 0) {
            y -= y1;
            y1 = 0
          }
          if (y2 > h) {
            y2 = h
          }
          ctx.drawImage(img, x1, y1, x2 - x1, y2 - y1, x, y, x2 - x1, y2 - y1)
        } else {
          ctx.drawImage(img, 0, 0)
        }
        return true
      }
    }, {
      key: "getBounds",
      value: function getBounds() {
        var rect = get$1(Bitmap.prototype.__proto__ || Object.getPrototypeOf(Bitmap.prototype), "getBounds", this).call(this);
        if (rect) {
          return rect
        }
        var image = this.image,
          o = this.sourceRect || image;
        var hasContent = image && (image.naturalWidth || image.getContext || image.readyState >= 2);
        return hasContent ? this._rectangle.setValues(0, 0, o.width, o.height) : null
      }
    }, {
      key: "clone",
      value: function clone() {
        var o = new Bitmap(this.image);
        if (this.sourceRect) {
          o.sourceRect = this.sourceRect.clone()
        }
        this._cloneProps(o);
        return o
      }
    }]);
    return Bitmap
  }(DisplayObject);
  /**
   * Displays a frame or sequence of frames (ie. an animation) from a SpriteSheet instance. A sprite sheet is a series of
   * images (usually animation frames) combined into a single image. For example, an animation consisting of 8 100x100
   * images could be combined into a 400x200 sprite sheet (4 frames across by 2 high). You can display individual frames,
   * play frames as an animation, and even sequence animations together.
   *
   * See the {{#crossLink "SpriteSheet"}}{{/crossLink}} class for more information on setting up frames and animations.
   *
   * <h4>Example</h4>
   *
   *      var instance = new createjs.Sprite(spriteSheet);
   *      instance.gotoAndStop("frameName");
   *
   * Until {{#crossLink "Sprite/gotoAndStop"}}{{/crossLink}} or {{#crossLink "Sprite/gotoAndPlay"}}{{/crossLink}} is called,
   * only the first defined frame defined in the sprite sheet will be displayed.
   *
   * @class Sprite
   * @extends DisplayObject
   */
  var Sprite = function (_DisplayObject) {
    inherits(Sprite, _DisplayObject);
    // constructor:
    /**
     * @constructor
     * @param {SpriteSheet} spriteSheet The SpriteSheet instance to play back. This includes the source image(s), frame
     * dimensions, and frame data. See {{#crossLink "SpriteSheet"}}{{/crossLink}} for more information.
     * @param {String|Number} [frameOrAnimation] The frame number or animation to play initially.
     */
    function Sprite(spriteSheet, frameOrAnimation) {
      classCallCheck(this, Sprite);
      // public properties:
      /**
       * The frame index that will be drawn when draw is called. Note that with some {{#crossLink "SpriteSheet"}}{{/crossLink}}
       * definitions, this will advance non-sequentially. This will always be an integer value.
       * @property currentFrame
       * @type {Number}
       * @default 0
       * @readonly
       */
      var _this = possibleConstructorReturn(this, (Sprite.__proto__ || Object.getPrototypeOf(Sprite)).call(this));
      _this.currentFrame = 0;
      /**
       * Returns the name of the currently playing animation.
       * @property currentAnimation
       * @type {String}
       * @final
       * @readonly
       */
      _this.currentAnimation = null;
      /**
       * Prevents the animation from advancing each tick automatically. For example, you could create a sprite
       * sheet of icons, set paused to true, and display the appropriate icon by setting <code>currentFrame</code>.
       * @property paused
       * @type {Boolean}
       * @default false
       */
      _this.paused = true;
      /**
       * The SpriteSheet instance to play back. This includes the source image, frame dimensions, and frame
       * data. See {{#crossLink "SpriteSheet"}}{{/crossLink}} for more information.
       * @property spriteSheet
       * @type {SpriteSheet}
       * @readonly
       */
      _this.spriteSheet = spriteSheet;
      /**
       * Specifies the current frame index within the currently playing animation. When playing normally, this will increase
       * from 0 to n-1, where n is the number of frames in the current animation.
       *
       * This could be a non-integer value if
       * using time-based playback (see {{#crossLink "Sprite/framerate"}}{{/crossLink}}, or if the animation's speed is
       * not an integer.
       * @property currentAnimationFrame
       * @type {Number}
       * @default 0
       */
      _this.currentAnimationFrame = 0;
      /**
       * By default Sprite instances advance one frame per tick. Specifying a framerate for the Sprite (or its related
       * SpriteSheet) will cause it to advance based on elapsed time between ticks as appropriate to maintain the target
       * framerate.
       *
       * For example, if a Sprite with a framerate of 10 is placed on a Stage being updated at 40fps, then the Sprite will
       * advance roughly one frame every 4 ticks. This will not be exact, because the time between each tick will
       * vary slightly between frames.
       *
       * This feature is dependent on the tick event object (or an object with an appropriate "delta" property) being
       * passed into {{#crossLink "Stage/update"}}{{/crossLink}}.
       * @property framerate
       * @type {Number}
       * @default 0
       */
      _this.framerate = 0;
      // private properties:
      /**
       * Current animation object.
       * @property _animation
       * @protected
       * @type {Object}
       * @default null
       */
      _this._animation = null;
      /**
       * Current frame index.
       * @property _currentFrame
       * @protected
       * @type {Number}
       * @default null
       */
      _this._currentFrame = null;
      /**
       * Skips the next auto advance. Used by gotoAndPlay to avoid immediately jumping to the next frame
       * @property _skipAdvance
       * @protected
       * @type {Boolean}
       * @default false
       */
      _this._skipAdvance = false;
      if (frameOrAnimation != null) {
        _this.gotoAndPlay(frameOrAnimation)
      }
      return _this
    }
    // public methods:
    /**
     * Returns true or false indicating whether the display object would be visible if drawn to a canvas.
     * This does not account for whether it would be visible within the boundaries of the stage.
     * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
     * @method isVisible
     * @return {Boolean} Boolean indicating whether the display object would be visible if drawn to a canvas
     */
    createClass(Sprite, [{
      key: "isVisible",
      value: function isVisible() {
        var hasContent = this.cacheCanvas || this.spriteSheet.complete;
        return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent)
      }
    }, {
      key: "draw",
      value: function draw(ctx, ignoreCache) {
        if (get$1(Sprite.prototype.__proto__ || Object.getPrototypeOf(Sprite.prototype), "draw", this).call(this, ctx, ignoreCache)) {
          return true
        }
        this._normalizeFrame();
        var o = this.spriteSheet.getFrame(this._currentFrame | 0);
        if (!o) {
          return false
        }
        var rect = o.rect;
        if (rect.width && rect.height) {
          ctx.drawImage(o.image, rect.x, rect.y, rect.width, rect.height, -o.regX, -o.regY, rect.width, rect.height)
        }
        return true
      }
    }, {
      key: "play",
      value: function play() {
        this.paused = false
      }
    }, {
      key: "stop",
      value: function stop() {
        this.paused = true
      }
    }, {
      key: "gotoAndPlay",
      value: function gotoAndPlay(frameOrAnimation) {
        this.paused = false;
        this._skipAdvance = true;
        this._goto(frameOrAnimation)
      }
    }, {
      key: "gotoAndStop",
      value: function gotoAndStop(frameOrAnimation) {
        this.paused = true;
        this._goto(frameOrAnimation)
      }
    }, {
      key: "advance",
      value: function advance(time) {
        var fps = this.framerate || this.spriteSheet.framerate;
        var t = fps && time != null ? time / (1e3 / fps) : 1;
        this._normalizeFrame(t)
      }
    }, {
      key: "getBounds",
      value: function getBounds() {
        // TODO: should this normalizeFrame?
        return get$1(Sprite.prototype.__proto__ || Object.getPrototypeOf(Sprite.prototype), "getBounds", this).call(this) || this.spriteSheet.getFrameBounds(this.currentFrame, this._rectangle)
      }
    }, {
      key: "clone",
      value: function clone() {
        return this._cloneProps(new Sprite(this.spriteSheet))
      }
    }, {
      key: "_cloneProps",
      value: function _cloneProps(o) {
        get$1(Sprite.prototype.__proto__ || Object.getPrototypeOf(Sprite.prototype), "_cloneProps", this).call(this, o);
        o.currentFrame = this.currentFrame;
        o.currentAnimation = this.currentAnimation;
        o.paused = this.paused;
        o.currentAnimationFrame = this.currentAnimationFrame;
        o.framerate = this.framerate;
        o._animation = this._animation;
        o._currentFrame = this._currentFrame;
        o._skipAdvance = this._skipAdvance;
        return o
      }
    }, {
      key: "_tick",
      value: function _tick(evtObj) {
        if (!this.paused) {
          if (!this._skipAdvance) {
            this.advance(evtObj && evtObj.delta)
          }
          this._skipAdvance = false
        }
        get$1(Sprite.prototype.__proto__ || Object.getPrototypeOf(Sprite.prototype), "_tick", this).call(this, evtObj)
      }
    }, {
      key: "_normalizeFrame",
      value: function _normalizeFrame() {
        var frameDelta = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var animation = this._animation;
        var paused = this.paused;
        var frame = this._currentFrame;
        if (animation) {
          var speed = animation.speed || 1;
          var animFrame = this.currentAnimationFrame;
          var l = animation.frames.length;
          if (animFrame + frameDelta * speed >= l) {
            var next = animation.next;
            if (this._dispatchAnimationEnd(animation, frame, paused, next, l - 1)) {
              // something changed in the event stack, so we shouldn't make any more changes here.
              return
            } else if (next) {
              // sequence. Automatically calls _normalizeFrame again with the remaining frames.
              return this._goto(next, frameDelta - (l - animFrame) / speed)
            } else {
              // end.
              this.paused = true;
              animFrame = animation.frames.length - 1
            }
          } else {
            animFrame += frameDelta * speed
          }
          this.currentAnimationFrame = animFrame;
          this._currentFrame = animation.frames[animFrame | 0]
        } else {
          frame = this._currentFrame += frameDelta;
          var _l = this.spriteSheet.getNumFrames();
          if (frame >= _l && _l > 0) {
            if (!this._dispatchAnimationEnd(animation, frame, paused, _l - 1)) {
              // looped.
              if ((this._currentFrame -= _l) >= _l) {
                return this._normalizeFrame()
              }
            }
          }
        }
        frame = this._currentFrame | 0;
        if (this.currentFrame != frame) {
          this.currentFrame = frame;
          this.dispatchEvent("change")
        }
      }
    }, {
      key: "_dispatchAnimationEnd",
      /**
       * Dispatches the "animationend" event. Returns true if a handler changed the animation (ex. calling {{#crossLink "Sprite/stop"}}{{/crossLink}},
       * {{#crossLink "Sprite/gotoAndPlay"}}{{/crossLink}}, etc.)
       * @method _dispatchAnimationEnd
       * @param animation
       * @param frame
       * @param paused
       * @param next
       * @param end
       * @private
       */
      value: function _dispatchAnimationEnd(animation, frame, paused, next, end) {
        var name = animation ? animation.name : null;
        if (this.hasEventListener("animationend")) {
          var evt = new Event("animationend");
          evt.name = name;
          evt.next = next;
          this.dispatchEvent(evt)
        }
        // did the animation get changed in the event stack?:
        var changed = this._animation != animation || this._currentFrame != frame;
        // if the animation hasn't changed, but the sprite was paused, then we want to stick to the last frame:
        if (!changed && !paused && this.paused) {
          this.currentAnimationFrame = end;
          changed = true
        }
        return changed
      }
    }, {
      key: "_goto",
      value: function _goto(frameOrAnimation, frame) {
        this.currentAnimationFrame = 0;
        if (isNaN(frameOrAnimation)) {
          var data = this.spriteSheet.getAnimation(frameOrAnimation);
          if (data) {
            this._animation = data;
            this.currentAnimation = frameOrAnimation;
            this._normalizeFrame(frame)
          }
        } else {
          this.currentAnimation = this._animation = null;
          this._currentFrame = frameOrAnimation;
          this._normalizeFrame()
        }
      }
    }]);
    return Sprite
  }(DisplayObject);
  // ES6 does not support static properties, this is a work around.
  var _maxPoolSize = 100;
  var _spritePool = [];
  /**
   * Displays text using bitmap glyphs defined in a sprite sheet. Multi-line text is supported
   * using new line characters, but automatic wrapping is not supported. See the
   * {{#crossLink "BitmapText/spriteSheet:property"}}{{/crossLink}}
   * property for more information on defining glyphs.
   *
   * <strong>Important:</strong> BitmapText extends Container, but is not designed to be used as one.
   * As such, methods like addChild and removeChild are disabled.
   * @class BitmapText
   * @extends Container
   */
  var BitmapText = function (_Container) {
    inherits(BitmapText, _Container);
    // constructor:
    /**
     * @param {String} [text=""] The text to display.
     * @param {SpriteSheet} [spriteSheet=null] The spritesheet that defines the character glyphs.
     * @constructor
     */
    function BitmapText() {
      var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
      var spriteSheet = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      classCallCheck(this, BitmapText);
      // public properties:
      /**
       * The text to display.
       * @property text
       * @type String
       * @default ""
       */
      var _this = possibleConstructorReturn(this, (BitmapText.__proto__ || Object.getPrototypeOf(BitmapText)).call(this));
      _this.text = text;
      /**
       * A SpriteSheet instance that defines the glyphs for this bitmap text. Each glyph/character
       * should have a single frame animation defined in the sprite sheet named the same as
       * corresponding character. For example, the following animation definition:
       *
       * 		"A": {frames: [0]}
       *
       * would indicate that the frame at index 0 of the spritesheet should be drawn for the "A" character. The short form
       * is also acceptable:
       *
       * 		"A": 0
       *
       * Note that if a character in the text is not found in the sprite sheet, it will also
       * try to use the alternate case (upper or lower).
       *
       * See SpriteSheet for more information on defining sprite sheet data.
       * @property spriteSheet
       * @type SpriteSheet
       * @default null
       */
      _this.spriteSheet = spriteSheet;
      /**
       * The height of each line of text. If 0, then it will use a line height calculated
       * by checking for the height of the "1", "T", or "L" character (in that order). If
       * those characters are not defined, it will use the height of the first frame of the
       * sprite sheet.
       * @property lineHeight
       * @type Number
       * @default 0
       */
      _this.lineHeight = 0;
      /**
       * This spacing (in pixels) will be added after each character in the output.
       * @property letterSpacing
       * @type Number
       * @default 0
       */
      _this.letterSpacing = 0;
      /**
       * If a space character is not defined in the sprite sheet, then empty pixels equal to
       * spaceWidth will be inserted instead. If 0, then it will use a value calculated
       * by checking for the width of the "1", "l", "E", or "A" character (in that order). If
       * those characters are not defined, it will use the width of the first frame of the
       * sprite sheet.
       * @property spaceWidth
       * @type Number
       * @default 0
       */
      _this.spaceWidth = 0;
      // private properties:
      /**
       * @property _oldProps
       * @type Object
       * @protected
       */
      _this._oldProps = {
        text: 0,
        spriteSheet: 0,
        lineHeight: 0,
        letterSpacing: 0,
        spaceWidth: 0
      };
      return _this
    }
    // static properties:
    /**
     * BitmapText uses Sprite instances to draw text. To reduce the creation and destruction of instances (and thus garbage collection), it maintains
     * an internal object pool of sprite instances to reuse. Increasing this value can cause more sprites to be
     * retained, slightly increasing memory use, but reducing instantiation.
     * @property maxPoolSize
     * @type Number
     * @static
     * @default 100
     */
    createClass(BitmapText, [{
      key: "draw",
      // public methods:
      /**
       * Docced in superclass.
       */
      value: function draw(ctx, ignoreCache) {
        get$1(BitmapText.prototype.__proto__ || Object.getPrototypeOf(BitmapText.prototype), "draw", this).call(this, ctx, ignoreCache)
      }
    }, {
      key: "getBounds",
      value: function getBounds() {
        this._updateText();
        return get$1(BitmapText.prototype.__proto__ || Object.getPrototypeOf(BitmapText.prototype), "getBounds", this).call(this)
      }
    }, {
      key: "isVisible",
      value: function isVisible() {
        var hasContent = this.cacheCanvas || this.spriteSheet && this.spriteSheet.complete && this.text;
        return !!(this.visible && this.alpha > 0 && this.scaleX !== 0 && this.scaleY !== 0 && hasContent)
      }
    }, {
      key: "clone",
      value: function clone() {
        return this._cloneProps(new BitmapText(this.text, this.spriteSheet))
      }
    }, {
      key: "addChild",
      value: function addChild() {}
    }, {
      key: "addChildAt",
      value: function addChildAt() {}
    }, {
      key: "removeChild",
      value: function removeChild() {}
    }, {
      key: "removeChildAt",
      value: function removeChildAt() {}
    }, {
      key: "removeAllChildren",
      value: function removeAllChildren() {}
    }, {
      key: "_cloneProps",
      value: function _cloneProps(o) {
        get$1(BitmapText.prototype.__proto__ || Object.getPrototypeOf(BitmapText.prototype), "_cloneProps", this).call(this, o);
        o.lineHeight = this.lineHeight;
        o.letterSpacing = this.letterSpacing;
        o.spaceWidth = this.spaceWidth;
        return o
      }
    }, {
      key: "_getFrameIndex",
      value: function _getFrameIndex(character, spriteSheet) {
        var c = void 0,
          o = spriteSheet.getAnimation(character);
        if (!o) {
          character != (c = character.toUpperCase()) || character != (c = character.toLowerCase()) || (c = null);
          if (c) {
            o = spriteSheet.getAnimation(c)
          }
        }
        return o && o.frames[0]
      }
    }, {
      key: "_getFrame",
      value: function _getFrame(character, spriteSheet) {
        var index = this._getFrameIndex(character, spriteSheet);
        return index == null ? index : spriteSheet.getFrame(index)
      }
    }, {
      key: "_getLineHeight",
      value: function _getLineHeight(ss) {
        var frame = this._getFrame("1", ss) || this._getFrame("T", ss) || this._getFrame("L", ss) || ss.getFrame(0);
        return frame ? frame.rect.height : 1
      }
    }, {
      key: "_getSpaceWidth",
      value: function _getSpaceWidth(ss) {
        var frame = this._getFrame("1", ss) || this._getFrame("l", ss) || this._getFrame("e", ss) || this._getFrame("a", ss) || ss.getFrame(0);
        return frame ? frame.rect.width : 1
      }
    }, {
      key: "_tick",
      value: function _tick(evtObj) {
        var stage = this.stage;
        stage && stage.on("drawstart", this._updateText, this, true);
        get$1(BitmapText.prototype.__proto__ || Object.getPrototypeOf(BitmapText.prototype), "_tick", this).call(this, evtObj)
      }
    }, {
      key: "_updateText",
      value: function _updateText() {
        var x = 0,
          y = 0,
          o = this._oldProps,
          change = false,
          spaceW = this.spaceWidth,
          lineH = this.lineHeight,
          ss = this.spriteSheet;
        var pool = BitmapText._spritePool,
          kids = this.children,
          childIndex = 0,
          numKids = kids.length,
          sprite = void 0;
        for (var n in o) {
          if (o[n] != this[n]) {
            o[n] = this[n];
            change = true
          }
        }
        if (!change) {
          return
        }
        var hasSpace = !!this._getFrame(" ", ss);
        if (!hasSpace && !spaceW) {
          spaceW = this._getSpaceWidth(ss)
        }
        if (!lineH) {
          lineH = this._getLineHeight(ss)
        }
        for (var i = 0, l = this.text.length; i < l; i++) {
          var character = this.text.charAt(i);
          if (character == " " && !hasSpace) {
            x += spaceW;
            continue
          } else if (character == "\n" || character == "\r") {
            if (character == "\r" && this.text.charAt(i + 1) == "\n") {
              i++
            } // crlf
            x = 0;
            y += lineH;
            continue
          }
          var index = this._getFrameIndex(character, ss);
          if (index == null) {
            continue
          }
          if (childIndex < numKids) {
            sprite = kids[childIndex]
          } else {
            kids.push(sprite = pool.length ? pool.pop() : new Sprite);
            sprite.parent = this;
            numKids++
          }
          sprite.spriteSheet = ss;
          sprite.gotoAndStop(index);
          sprite.x = x;
          sprite.y = y;
          childIndex++;
          x += sprite.getBounds().width + this.letterSpacing
        }
        while (numKids > childIndex) {
          // faster than removeChild.
          pool.push(sprite = kids.pop());
          sprite.parent = null;
          numKids--
        }
        if (pool.length > BitmapText.maxPoolSize) {
          pool.length = BitmapText.maxPoolSize
        }
      }
    }], [{
      key: "maxPoolSize",
      get: function get() {
        return _maxPoolSize
      },
      set: function set(maxPoolSize) {
        _maxPoolSize = maxPoolSize
      }
    }, {
      key: "_spritePool",
      get: function get() {
        return _spritePool
      }
    }]);
    return BitmapText
  }(Container);
  /**
   * <b>This class is still experimental, and more advanced use is likely to be buggy. Please report bugs.</b>
   *
   * A DOMElement allows you to associate a HTMLElement with the display list. It will be transformed
   * within the DOM as though it is child of the {{#crossLink "Container"}}{{/crossLink}} it is added to. However, it is
   * not rendered to canvas, and as such will retain whatever z-index it has relative to the canvas (ie. it will be
   * drawn in front of or behind the canvas).
   *
   * The position of a DOMElement is relative to their parent node in the DOM. It is recommended that
   * the DOM Object be added to a div that also contains the canvas so that they share the same position
   * on the page.
   *
   * DOMElement is useful for positioning HTML elements over top of canvas content, and for elements
   * that you want to display outside the bounds of the canvas. For example, a tooltip with rich HTML
   * content.
   *
   * <h4>Mouse Interaction</h4>
   *
   * DOMElement instances are not full EaselJS display objects, and do not participate in EaselJS mouse
   * events or support methods like hitTest. To get mouse events from a DOMElement, you must instead add handlers to
   * the htmlElement (note, this does not support EventDispatcher)
   *
   *      var domElement = new createjs.DOMElement(htmlElement);
   *      domElement.htmlElement.onclick = function() {
   *          console.log("clicked");
   *      }
   *
   * @class DOMElement
   * @extends DisplayObject
   */
  var DOMElement = function (_DisplayObject) {
    inherits(DOMElement, _DisplayObject);
    // constructor:
    /**
     * @constructor
     * @param {HTMLElement|String} htmlElement A reference or id for the DOM element to manage.
     */
    function DOMElement(htmlElement) {
      classCallCheck(this, DOMElement);
      var _this = possibleConstructorReturn(this, (DOMElement.__proto__ || Object.getPrototypeOf(DOMElement)).call(this));
      if (typeof htmlElement == "string") {
        htmlElement = document.getElementById(htmlElement)
      }
      _this.mouseEnabled = false;
      var style = htmlElement.style;
      style.position = "absolute";
      style.transformOrigin = style.WebkitTransformOrigin = style.msTransformOrigin = style.MozTransformOrigin = style.OTransformOrigin = "0% 0%";
      // public properties:
      /**
       * The DOM object to manage.
       * @property htmlElement
       * @type HTMLElement
       */
      _this.htmlElement = htmlElement;
      // private properties:
      /**
       * @property _oldMtx
       * @type Matrix2D
       * @protected
       */
      _this._oldProps = null;
      return _this
    }
    // public methods:
    /**
     * Returns true or false indicating whether the display object would be visible if drawn to a canvas.
     * This does not account for whether it would be visible within the boundaries of the stage.
     * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
     * @method isVisible
     * @return {Boolean} Boolean indicating whether the display object would be visible if drawn to a canvas
     */
    createClass(DOMElement, [{
      key: "isVisible",
      value: function isVisible() {
        return this.htmlElement != null
      }
    }, {
      key: "draw",
      value: function draw(ctx, ignoreCache) {
        // this relies on the _tick method because draw isn't called if the parent is not visible.
        // the actual update happens in _handleDrawEnd
        return true
      }
    }, {
      key: "cache",
      value: function cache() {}
    }, {
      key: "uncache",
      value: function uncache() {}
    }, {
      key: "updateCache",
      value: function updateCache() {}
    }, {
      key: "hitTest",
      value: function hitTest() {}
    }, {
      key: "localToGlobal",
      value: function localToGlobal() {}
    }, {
      key: "globalToLocal",
      value: function globalToLocal() {}
    }, {
      key: "localToLocal",
      value: function localToLocal() {}
    }, {
      key: "clone",
      value: function clone() {
        throw "DOMElement cannot be cloned."
      }
    }, {
      key: "_tick",
      value: function _tick(evtObj) {
        var stage = this.stage;
        stage && stage.on("drawend", this._handleDrawEnd, this, true);
        get$1(DOMElement.prototype.__proto__ || Object.getPrototypeOf(DOMElement.prototype), "_tick", this).call(this, evtObj)
      }
    }, {
      key: "_handleDrawEnd",
      value: function _handleDrawEnd(evt) {
        var o = this.htmlElement;
        if (!o) {
          return
        }
        var style = o.style;
        var props = this.getConcatenatedDisplayProps(this._props),
          mtx = props.matrix;
        var visibility = props.visible ? "visible" : "hidden";
        if (visibility != style.visibility) {
          style.visibility = visibility
        }
        if (!props.visible) {
          return
        }
        var oldProps = this._oldProps,
          oldMtx = oldProps && oldProps.matrix;
        var n = 1e4; // precision
        if (!oldMtx || !oldMtx.equals(mtx)) {
          var str = "matrix(" + (mtx.a * n | 0) / n + "," + (mtx.b * n | 0) / n + "," + (mtx.c * n | 0) / n + "," + (mtx.d * n | 0) / n + "," + (mtx.tx + .5 | 0);
          style.transform = style.WebkitTransform = style.OTransform = style.msTransform = str + "," + (mtx.ty + .5 | 0) + ")";
          style.MozTransform = str + "px," + (mtx.ty + .5 | 0) + "px)";
          if (!oldProps) {
            oldProps = this._oldProps = new DisplayProps(true, NaN)
          }
          oldProps.matrix.copy(mtx)
        }
        if (oldProps.alpha != props.alpha) {
          style.opacity = "" + (props.alpha * n | 0) / n;
          oldProps.alpha = props.alpha
        }
      }
    }]);
    return DOMElement
  }(DisplayObject);
  /**
   * The Graphics class exposes an easy to use API for generating vector drawing instructions and drawing them to a
   * specified context. Note that you can use Graphics without any dependency on the EaselJS framework by calling {{#crossLink "Graphics/draw"}}{{/crossLink}}
   * directly, or it can be used with the {{#crossLink "Shape"}}{{/crossLink}} object to draw vector graphics within the
   * context of an EaselJS display list.
   *
   * There are two approaches to working with Graphics object: calling methods on a Graphics instance (the "Graphics API"), or
   * instantiating Graphics command objects and adding them to the graphics queue via {{#crossLink "Graphics/append"}}{{/crossLink}}.
   * The former abstracts the latter, simplifying beginning and ending paths, fills, and strokes.
   *
   *      var g = new createjs.Graphics();
   *      g.setStrokeStyle(1);
   *      g.beginStroke("#000000");
   *      g.beginFill("red");
   *      g.drawCircle(0,0,30);
   *
   * All drawing methods in Graphics return the Graphics instance, so they can be chained together. For example,
   * the following line of code would generate the instructions to draw a rectangle with a red stroke and blue fill:
   *
   *      myGraphics.beginStroke("red").beginFill("blue").drawRect(20, 20, 100, 50);
   *
   * Each graphics API call generates a command object (see below). The last command to be created can be accessed via
   * {{#crossLink "Graphics/command:property"}}{{/crossLink}}:
   *
   *      var fillCommand = myGraphics.beginFill("red").command;
   *      // ... later, update the fill style/color:
   *      fillCommand.style = "blue";
   *      // or change it to a bitmap fill:
   *      fillCommand.bitmap(myImage);
   *
   * For more direct control of rendering, you can instantiate and append command objects to the graphics queue directly. In this case, you
   * need to manage path creation manually, and ensure that fill/stroke is applied to a defined path:
   *
   *      // start a new path. Graphics.beginCmd is a reusable BeginPath instance:
   *      myGraphics.append(createjs.Graphics.beginCmd);
   *      // we need to define the path before applying the fill:
   *      var circle = new createjs.Graphics.Circle(0,0,30);
   *      myGraphics.append(circle);
   *      // fill the path we just defined:
   *      var fill = new createjs.Graphics.Fill("red");
   *      myGraphics.append(fill);
   *
   * These approaches can be used together, for example to insert a custom command:
   *
   *      myGraphics.beginFill("red");
   *      var customCommand = new CustomSpiralCommand(etc);
   *      myGraphics.append(customCommand);
   *      myGraphics.beginFill("blue");
   *      myGraphics.drawCircle(0, 0, 30);
   *
   * See {{#crossLink "Graphics/append"}}{{/crossLink}} for more info on creating custom commands.
   *
   * <h4>Tiny API</h4>
   * The Graphics class also includes a "tiny API", which is one or two-letter methods that are shortcuts for all of the
   * Graphics methods. These methods are great for creating compact instructions, and is used by the Toolkit for CreateJS
   * to generate readable code. All tiny methods are marked as protected, so you can view them by enabling protected
   * descriptions in the docs.
   *
   * <table>
   *     <tr><td><b>Tiny</b></td><td><b>Method</b></td><td><b>Tiny</b></td><td><b>Method</b></td></tr>
   *     <tr><td>mt</td><td>{{#crossLink "Graphics/moveTo"}}{{/crossLink}} </td>
   *     <td>lt</td> <td>{{#crossLink "Graphics/lineTo"}}{{/crossLink}}</td></tr>
   *     <tr><td>a/at</td><td>{{#crossLink "Graphics/arc"}}{{/crossLink}} / {{#crossLink "Graphics/arcTo"}}{{/crossLink}} </td>
   *     <td>bt</td><td>{{#crossLink "Graphics/bezierCurveTo"}}{{/crossLink}} </td></tr>
   *     <tr><td>qt</td><td>{{#crossLink "Graphics/quadraticCurveTo"}}{{/crossLink}} (also curveTo)</td>
   *     <td>r</td><td>{{#crossLink "Graphics/rect"}}{{/crossLink}} </td></tr>
   *     <tr><td>cp</td><td>{{#crossLink "Graphics/closePath"}}{{/crossLink}} </td>
   *     <td>c</td><td>{{#crossLink "Graphics/clear"}}{{/crossLink}} </td></tr>
   *     <tr><td>f</td><td>{{#crossLink "Graphics/beginFill"}}{{/crossLink}} </td>
   *     <td>lf</td><td>{{#crossLink "Graphics/beginLinearGradientFill"}}{{/crossLink}} </td></tr>
   *     <tr><td>rf</td><td>{{#crossLink "Graphics/beginRadialGradientFill"}}{{/crossLink}} </td>
   *     <td>bf</td><td>{{#crossLink "Graphics/beginBitmapFill"}}{{/crossLink}} </td></tr>
   *     <tr><td>ef</td><td>{{#crossLink "Graphics/endFill"}}{{/crossLink}} </td>
   *     <td>ss / sd</td><td>{{#crossLink "Graphics/setStrokeStyle"}}{{/crossLink}} / {{#crossLink "Graphics/setStrokeDash"}}{{/crossLink}} </td></tr>
   *     <tr><td>s</td><td>{{#crossLink "Graphics/beginStroke"}}{{/crossLink}} </td>
   *     <td>ls</td><td>{{#crossLink "Graphics/beginLinearGradientStroke"}}{{/crossLink}} </td></tr>
   *     <tr><td>rs</td><td>{{#crossLink "Graphics/beginRadialGradientStroke"}}{{/crossLink}} </td>
   *     <td>bs</td><td>{{#crossLink "Graphics/beginBitmapStroke"}}{{/crossLink}} </td></tr>
   *     <tr><td>es</td><td>{{#crossLink "Graphics/endStroke"}}{{/crossLink}} </td>
   *     <td>dr</td><td>{{#crossLink "Graphics/drawRect"}}{{/crossLink}} </td></tr>
   *     <tr><td>rr</td><td>{{#crossLink "Graphics/drawRoundRect"}}{{/crossLink}} </td>
   *     <td>rc</td><td>{{#crossLink "Graphics/drawRoundRectComplex"}}{{/crossLink}} </td></tr>
   *     <tr><td>dc</td><td>{{#crossLink "Graphics/drawCircle"}}{{/crossLink}} </td>
   *     <td>de</td><td>{{#crossLink "Graphics/drawEllipse"}}{{/crossLink}} </td></tr>
   *     <tr><td>dp</td><td>{{#crossLink "Graphics/drawPolyStar"}}{{/crossLink}} </td>
   *     <td>p</td><td>{{#crossLink "Graphics/decodePath"}}{{/crossLink}} </td></tr>
   * </table>
   *
   * Here is the above example, using the tiny API instead.
   *
   *      myGraphics.s("red").f("blue").r(20, 20, 100, 50);
   *
   * @class Graphics
   */
  var Graphics = function () {
    // constructor:
    /**
     * @constructor
     */
    function Graphics() {
      classCallCheck(this, Graphics);
      // public properties
      /**
       * Holds a reference to the last command that was created or appended. For example, you could retain a reference
       * to a Fill command in order to dynamically update the color later by using:
       *
       * 		var myFill = myGraphics.beginFill("red").command;
       * 		// update color later:
       * 		myFill.style = "yellow";
       *
       * @property command
       * @type Object
       */
      this.command = null;
      // private properties
      /**
       * @property _stroke
       * @protected
       * @type {Stroke}
       */
      this._stroke = null;
      /**
       * @property _strokeStyle
       * @protected
       * @type {StrokeStyle}
       */
      this._strokeStyle = null;
      /**
       * @property _oldStrokeStyle
       * @protected
       * @type {StrokeStyle}
       */
      this._oldStrokeStyle = null;
      /**
       * @property _strokeDash
       * @protected
       * @type {StrokeDash}
       */
      this._strokeDash = null;
      /**
       * @property _oldStrokeDash
       * @protected
       * @type {StrokeDash}
       */
      this._oldStrokeDash = null;
      /**
       * @property _strokeIgnoreScale
       * @protected
       * @type Boolean
       */
      this._strokeIgnoreScale = false;
      /**
       * @property _fill
       * @protected
       * @type {Fill}
       */
      this._fill = null;
      /**
       * @property _instructions
       * @protected
       * @type {Array}
       */
      this._instructions = [];
      /**
       * Indicates the last instruction index that was committed.
       * @property _commitIndex
       * @protected
       * @type {Number}
       */
      this._commitIndex = 0;
      /**
       * Uncommitted instructions.
       * @property _activeInstructions
       * @protected
       * @type {Array}
       */
      this._activeInstructions = [];
      /**
       * This indicates that there have been changes to the activeInstruction list since the last updateInstructions call.
       * @property _dirty
       * @protected
       * @type {Boolean}
       * @default false
       */
      this._dirty = false;
      /**
       * Index to draw from if a store operation has happened.
       * @property _storeIndex
       * @protected
       * @type {Number}
       * @default 0
       */
      this._storeIndex = 0;
      // ActionScript mappings:
      /**
       * Maps the familiar ActionScript <code>curveTo()</code> method to the functionally similar {{#crossLink "Graphics/quadraticCurveTo"}}{{/crossLink}}
       * method.
       * @method curveTo
       * @param {Number} cpx
       * @param {Number} cpy
       * @param {Number} x
       * @param {Number} y
       * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
       * @chainable
       */
      this.curveTo = this.quadraticCurveTo;
      /**
       * Maps the familiar ActionScript <code>drawRect()</code> method to the functionally similar {{#crossLink "Graphics/rect"}}{{/crossLink}}
       * method.
       * @method drawRect
       * @param {Number} x
       * @param {Number} y
       * @param {Number} w Width of the rectangle
       * @param {Number} h Height of the rectangle
       * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
       * @chainable
       */
      this.drawRect = this.rect;
      // tiny API:
      /**
       * Shortcut to moveTo.
       * @method mt
       * @param {Number} x The x coordinate the drawing point should move to.
       * @param {Number} y The y coordinate the drawing point should move to.
       * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls).
       * @chainable
       * @protected
       */
      this.mt = this.moveTo;
      /**
       * Shortcut to lineTo.
       * @method lt
       * @param {Number} x The x coordinate the drawing point should draw to.
       * @param {Number} y The y coordinate the drawing point should draw to.
       * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
       * @chainable
       * @protected
       */
      this.lt = this.lineTo;
      /**
       * Shortcut to arcTo.
       * @method at
       * @param {Number} x1
       * @param {Number} y1
       * @param {Number} x2
       * @param {Number} y2
       * @param {Number} radius
       * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
       * @chainable
       * @protected
       */
      this.at = this.arcTo;
      /**
       * Shortcut to bezierCurveTo.
       * @method bt
       * @param {Number} cp1x
       * @param {Number} cp1y
       * @param {Number} cp2x
       * @param {Number} cp2y
       * @param {Number} x
       * @param {Number} y
       * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
       * @chainable
       * @protected
       */
      this.bt = this.bezierCurveTo;
      /**
       * Shortcut to quadraticCurveTo / curveTo.
       * @method qt
       * @param {Number} cpx
       * @param {Number} cpy
       * @param {Number} x
       * @param {Number} y
       * @protected
       * @chainable
       */
      this.qt = this.quadraticCurveTo;
      /**
       * Shortcut to arc.
       * @method a
       * @param {Number} x
       * @param {Number} y
       * @param {Number} radius
       * @param {Number} startAngle Measured in radians.
       * @param {Number} endAngle Measured in radians.
       * @param {Boolean} anticlockwise
       * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
       * @protected
       * @chainable
       */
      this.a = this.arc;
      /**
       * Shortcut to rect.
       * @method r
       * @param {Number} x
       * @param {Number} y
       * @param {Number} w Width of the rectangle
       * @param {Number} h Height of the rectangle
       * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
       * @chainable
       * @protected
       */
      this.r = this.rect;
      /**
       * Shortcut to closePath.
       * @method cp
       * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
       * @chainable
       * @protected
       */
      this.cp = this.closePath;
      /**
       * Shortcut to clear.
       * @method c
       * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
       * @chainable
       * @protected
       */
      this.c = this.clear;
      /**
       * Shortcut to beginFill.
       * @method f
       * @param {String} color A CSS compatible color value (ex. "red", "#FF0000", or "rgba(255,0,0,0.5)"). Setting to
       * null will result in no fill.
       * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
       * @chainable
       * @protected
       */
      this.f = this.beginFill;
      /**
       * Shortcut to beginLinearGradientFill.
       * @method lf
       * @param {Array} colors An array of CSS compatible color values. For example, ["#F00","#00F"] would define a gradient
       * drawing from red to blue.
       * @param {Array} ratios An array of gradient positions which correspond to the colors. For example, [0.1, 0.9] would draw
       * the first color to 10% then interpolating to the second color at 90%.
       * @param {Number} x0 The position of the first point defining the line that defines the gradient direction and size.
       * @param {Number} y0 The position of the first point defining the line that defines the gradient direction and size.
       * @param {Number} x1 The position of the second point defining the line that defines the gradient direction and size.
       * @param {Number} y1 The position of the second point defining the line that defines the gradient direction and size.
       * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
       * @chainable
       * @protected
       */
      this.lf = this.beginLinearGradientFill;
      /**
       * Shortcut to beginRadialGradientFill.
       * @method rf
       * @param {Array} colors An array of CSS compatible color values. For example, ["#F00","#00F"] would define
       * a gradient drawing from red to blue.
       * @param {Array} ratios An array of gradient positions which correspond to the colors. For example, [0.1,
       * 0.9] would draw the first color to 10% then interpolating to the second color at 90%.
       * @param {Number} x0 Center position of the inner circle that defines the gradient.
       * @param {Number} y0 Center position of the inner circle that defines the gradient.
       * @param {Number} r0 Radius of the inner circle that defines the gradient.
       * @param {Number} x1 Center position of the outer circle that defines the gradient.
       * @param {Number} y1 Center position of the outer circle that defines the gradient.
       * @param {Number} r1 Radius of the outer circle that defines the gradient.
       * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
       * @chainable
       * @protected
       */
      this.rf = this.beginRadialGradientFill;
      /**
       * Shortcut to beginBitmapFill.
       * @method bf
       * @param {HTMLImageElement | HTMLCanvasElement | HTMLVideoElement} image The Image, Canvas, or Video object to use
       * as the pattern.
       * @param {String} repetition Optional. Indicates whether to repeat the image in the fill area. One of "repeat",
       * "repeat-x", "repeat-y", or "no-repeat". Defaults to "repeat". Note that Firefox does not support "repeat-x" or
       * "repeat-y" (latest tests were in FF 20.0), and will default to "repeat".
       * @param {Matrix2D} matrix Optional. Specifies a transformation matrix for the bitmap fill. This transformation
       * will be applied relative to the parent transform.
       * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
       * @chainable
       * @protected
       */
      this.bf = this.beginBitmapFill;
      /**
       * Shortcut to endFill.
       * @method ef
       * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
       * @chainable
       * @protected
       */
      this.ef = this.endFill;
      /**
       * Shortcut to setStrokeStyle.
       * @method ss
       * @param {Number} thickness The width of the stroke.
       * @param {String | Number} [caps=0] Indicates the type of caps to use at the end of lines. One of butt,
       * round, or square. Defaults to "butt". Also accepts the values 0 (butt), 1 (round), and 2 (square) for use with
       * the tiny API.
       * @param {String | Number} [joints=0] Specifies the type of joints that should be used where two lines meet.
       * One of bevel, round, or miter. Defaults to "miter". Also accepts the values 0 (miter), 1 (round), and 2 (bevel)
       * for use with the tiny API.
       * @param {Number} [miterLimit=10] If joints is set to "miter", then you can specify a miter limit ratio which
       * controls at what point a mitered joint will be clipped.
       * @param {Boolean} [ignoreScale=false] If true, the stroke will be drawn at the specified thickness regardless
       * of active transformations.
       * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
       * @chainable
       * @protected
       */
      this.ss = this.setStrokeStyle;
      /**
       * Shortcut to setStrokeDash.
       * @method sd
       * @param {Array} [segments] An array specifying the dash pattern, alternating between line and gap.
       * For example, [20,10] would create a pattern of 20 pixel lines with 10 pixel gaps between them.
       * Passing null or an empty array will clear any existing dash.
       * @param {Number} [offset=0] The offset of the dash pattern. For example, you could increment this value to create a "marching ants" effect.
       * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
       * @chainable
       * @protected
       */
      this.sd = this.setStrokeDash;
      /**
       * Shortcut to beginStroke.
       * @method s
       * @param {String} color A CSS compatible color value (ex. "#FF0000", "red", or "rgba(255,0,0,0.5)"). Setting to
       * null will result in no stroke.
       * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
       * @chainable
       * @protected
       */
      this.s = this.beginStroke;
      /**
       * Shortcut to beginLinearGradientStroke.
       * @method ls
       * @param {Array} colors An array of CSS compatible color values. For example, ["#F00","#00F"] would define
       * a gradient drawing from red to blue.
       * @param {Array} ratios An array of gradient positions which correspond to the colors. For example, [0.1,
       * 0.9] would draw the first color to 10% then interpolating to the second color at 90%.
       * @param {Number} x0 The position of the first point defining the line that defines the gradient direction and size.
       * @param {Number} y0 The position of the first point defining the line that defines the gradient direction and size.
       * @param {Number} x1 The position of the second point defining the line that defines the gradient direction and size.
       * @param {Number} y1 The position of the second point defining the line that defines the gradient direction and size.
       * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
       * @chainable
       * @protected
       */
      this.ls = this.beginLinearGradientStroke;
      /**
       * Shortcut to beginRadialGradientStroke.
       * @method rs
       * @param {Array} colors An array of CSS compatible color values. For example, ["#F00","#00F"] would define
       * a gradient drawing from red to blue.
       * @param {Array} ratios An array of gradient positions which correspond to the colors. For example, [0.1,
       * 0.9] would draw the first color to 10% then interpolating to the second color at 90%, then draw the second color
       * to 100%.
       * @param {Number} x0 Center position of the inner circle that defines the gradient.
       * @param {Number} y0 Center position of the inner circle that defines the gradient.
       * @param {Number} r0 Radius of the inner circle that defines the gradient.
       * @param {Number} x1 Center position of the outer circle that defines the gradient.
       * @param {Number} y1 Center position of the outer circle that defines the gradient.
       * @param {Number} r1 Radius of the outer circle that defines the gradient.
       * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
       * @chainable
       * @protected
       */
      this.rs = this.beginRadialGradientStroke;
      /**
       * Shortcut to beginBitmapStroke.
       * @method bs
       * @param {HTMLImageElement | HTMLCanvasElement | HTMLVideoElement} image The Image, Canvas, or Video object to use
       * as the pattern.
       * @param {String} [repetition=repeat] Optional. Indicates whether to repeat the image in the fill area. One of
       * "repeat", "repeat-x", "repeat-y", or "no-repeat". Defaults to "repeat".
       * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
       * @chainable
       * @protected
       */
      this.bs = this.beginBitmapStroke;
      /**
       * Shortcut to endStroke.
       * @method es
       * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
       * @chainable
       * @protected
       */
      this.es = this.endStroke;
      /**
       * Shortcut to drawRect.
       * @method dr
       * @param {Number} x
       * @param {Number} y
       * @param {Number} w Width of the rectangle
       * @param {Number} h Height of the rectangle
       * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
       * @chainable
       * @protected
       */
      this.dr = this.drawRect;
      /**
       * Shortcut to drawRoundRect.
       * @method rr
       * @param {Number} x
       * @param {Number} y
       * @param {Number} w
       * @param {Number} h
       * @param {Number} radius Corner radius.
       * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
       * @chainable
       * @protected
       */
      this.rr = this.drawRoundRect;
      /**
       * Shortcut to drawRoundRectComplex.
       * @method rc
       * @param {Number} x The horizontal coordinate to draw the round rect.
       * @param {Number} y The vertical coordinate to draw the round rect.
       * @param {Number} w The width of the round rect.
       * @param {Number} h The height of the round rect.
       * @param {Number} radiusTL Top left corner radius.
       * @param {Number} radiusTR Top right corner radius.
       * @param {Number} radiusBR Bottom right corner radius.
       * @param {Number} radiusBL Bottom left corner radius.
       * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
       * @chainable
       * @protected
       */
      this.rc = this.drawRoundRectComplex;
      /**
       * Shortcut to drawCircle.
       * @method dc
       * @param {Number} x x coordinate center point of circle.
       * @param {Number} y y coordinate center point of circle.
       * @param {Number} radius Radius of circle.
       * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
       * @chainable
       * @protected
       */
      this.dc = this.drawCircle;
      /**
       * Shortcut to drawEllipse.
       * @method de
       * @param {Number} x The left coordinate point of the ellipse. Note that this is different from {{#crossLink "Graphics/drawCircle"}}{{/crossLink}}
       * which draws from center.
       * @param {Number} y The top coordinate point of the ellipse. Note that this is different from {{#crossLink "Graphics/drawCircle"}}{{/crossLink}}
       * which draws from the center.
       * @param {Number} w The height (horizontal diameter) of the ellipse. The horizontal radius will be half of this
       * number.
       * @param {Number} h The width (vertical diameter) of the ellipse. The vertical radius will be half of this number.
       * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
       * @chainable
       * @protected
       */
      this.de = this.drawEllipse;
      /**
       * Shortcut to drawPolyStar.
       * @method dp
       * @param {Number} x Position of the center of the shape.
       * @param {Number} y Position of the center of the shape.
       * @param {Number} radius The outer radius of the shape.
       * @param {Number} sides The number of points on the star or sides on the polygon.
       * @param {Number} pointSize The depth or "pointy-ness" of the star points. A pointSize of 0 will draw a regular
       * polygon (no points), a pointSize of 1 will draw nothing because the points are infinitely pointy.
       * @param {Number} angle The angle of the first point / corner. For example a value of 0 will draw the first point
       * directly to the right of the center.
       * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
       * @chainable
       * @protected
       */
      this.dp = this.drawPolyStar;
      /**
       * Shortcut to decodePath.
       * @method p
       * @param {String} str The path string to decode.
       * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
       * @chainable
       * @protected
       */
      this.p = this.decodePath;
      this.clear()
    }
    // static public methods:
    /**
     * Returns a CSS compatible color string based on the specified RGB numeric color values in the format
     * "rgba(255,255,255,1.0)", or if alpha is null then in the format "rgb(255,255,255)". For example,
     *
     *      createjs.Graphics.getRGB(50, 100, 150, 0.5);
     *      // Returns "rgba(50,100,150,0.5)"
     *
     * It also supports passing a single hex color value as the first param, and an optional alpha value as the second
     * param. For example,
     *
     *      createjs.Graphics.getRGB(0xFF00FF, 0.2);
     *      // Returns "rgba(255,0,255,0.2)"
     *
     * @method getRGB
     * @static
     * @param {Number} r The red component for the color, between 0 and 0xFF (255).
     * @param {Number} g The green component for the color, between 0 and 0xFF (255).
     * @param {Number} b The blue component for the color, between 0 and 0xFF (255).
     * @param {Number} [alpha] The alpha component for the color where 0 is fully transparent and 1 is fully opaque.
     * @return {String} A CSS compatible color string based on the specified RGB numeric color values in the format
     * "rgba(255,255,255,1.0)", or if alpha is null then in the format "rgb(255,255,255)".
     */
    createClass(Graphics, [{
      key: "isEmpty",
      // public methods:
      /**
       * Returns true if this Graphics instance has no drawing commands.
       * @method isEmpty
       * @return {Boolean} Returns true if this Graphics instance has no drawing commands.
       */
      value: function isEmpty() {
        return !(this._instructions.length || this._activeInstructions.length)
      }
    }, {
      key: "draw",
      value: function draw(ctx, data) {
        this._updateInstructions();
        var instr = this._instructions;
        var l = instr.length;
        for (var i = this._storeIndex; i < l; i++) {
          instr[i].exec(ctx, data)
        }
      }
    }, {
      key: "drawAsPath",
      value: function drawAsPath(ctx) {
        this._updateInstructions();
        var instr = void 0,
          instrs = this._instructions;
        var l = instrs.length;
        for (var i = this._storeIndex; i < l; i++) {
          // the first command is always a beginPath command.
          if ((instr = instrs[i]).path !== false) {
            instr.exec(ctx)
          }
        }
      }
    }, {
      key: "moveTo",
      value: function moveTo(x, y) {
        return this.append(new MoveTo(x, y), true)
      }
    }, {
      key: "lineTo",
      value: function lineTo(x, y) {
        return this.append(new LineTo(x, y))
      }
    }, {
      key: "arcTo",
      value: function arcTo(x1, y1, x2, y2, radius) {
        return this.append(new ArcTo(x1, y1, x2, y2, radius))
      }
    }, {
      key: "arc",
      value: function arc(x, y, radius, startAngle, endAngle, anticlockwise) {
        return this.append(new Arc(x, y, radius, startAngle, endAngle, anticlockwise))
      }
    }, {
      key: "quadraticCurveTo",
      value: function quadraticCurveTo(cpx, cpy, x, y) {
        return this.append(new QuadraticCurveTo(cpx, cpy, x, y))
      }
    }, {
      key: "bezierCurveTo",
      value: function bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
        return this.append(new BezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y))
      }
    }, {
      key: "rect",
      value: function rect(x, y, w, h) {
        return this.append(new Rect(x, y, w, h))
      }
    }, {
      key: "closePath",
      value: function closePath() {
        return this._activeInstructions.length ? this.append(new ClosePath) : this
      }
    }, {
      key: "clear",
      value: function clear() {
        this._instructions.length = this._activeInstructions.length = this._commitIndex = 0;
        this._strokeStyle = this._oldStrokeStyle = this._stroke = this._fill = this._strokeDash = this._oldStrokeDash = null;
        this._dirty = this._strokeIgnoreScale = false;
        return this
      }
    }, {
      key: "beginFill",
      value: function beginFill(color) {
        return this._setFill(color ? new Fill(color) : null)
      }
    }, {
      key: "beginLinearGradientFill",
      value: function beginLinearGradientFill(colors, ratios, x0, y0, x1, y1) {
        return this._setFill((new Fill).linearGradient(colors, ratios, x0, y0, x1, y1))
      }
    }, {
      key: "beginRadialGradientFill",
      value: function beginRadialGradientFill(colors, ratios, x0, y0, r0, x1, y1, r1) {
        return this._setFill((new Fill).radialGradient(colors, ratios, x0, y0, r0, x1, y1, r1))
      }
    }, {
      key: "beginBitmapFill",
      value: function beginBitmapFill(image, repetition, matrix) {
        return this._setFill(new Fill(null, matrix).bitmap(image, repetition))
      }
    }, {
      key: "endFill",
      value: function endFill() {
        return this.beginFill()
      }
    }, {
      key: "setStrokeStyle",
      value: function setStrokeStyle(thickness) {
        var caps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var joints = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var miterLimit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 10;
        var ignoreScale = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
        this._updateInstructions(true);
        this._strokeStyle = this.command = new StrokeStyle(thickness, caps, joints, miterLimit, ignoreScale);
        // ignoreScale lives on Stroke, not StrokeStyle, so we do a little trickery:
        if (this._stroke) {
          this._stroke.ignoreScale = ignoreScale
        }
        this._strokeIgnoreScale = ignoreScale;
        return this
      }
    }, {
      key: "setStrokeDash",
      value: function setStrokeDash(segments) {
        var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        this._updateInstructions(true);
        this._strokeDash = this.command = new StrokeDash(segments, offset);
        return this
      }
    }, {
      key: "beginStroke",
      value: function beginStroke(color) {
        return this._setStroke(color ? new Stroke(color) : null)
      }
    }, {
      key: "beginLinearGradientStroke",
      value: function beginLinearGradientStroke(colors, ratios, x0, y0, x1, y1) {
        return this._setStroke((new Stroke).linearGradient(colors, ratios, x0, y0, x1, y1))
      }
    }, {
      key: "beginRadialGradientStroke",
      value: function beginRadialGradientStroke(colors, ratios, x0, y0, r0, x1, y1, r1) {
        return this._setStroke((new Stroke).radialGradient(colors, ratios, x0, y0, r0, x1, y1, r1))
      }
    }, {
      key: "beginBitmapStroke",
      value: function beginBitmapStroke(image) {
        var repetition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "repeat";
        // NOTE: matrix is not supported for stroke because transforms on strokes also affect the drawn stroke width.
        return this._setStroke((new Stroke).bitmap(image, repetition))
      }
    }, {
      key: "endStroke",
      value: function endStroke() {
        return this.beginStroke()
      }
    }, {
      key: "drawRoundRect",
      value: function drawRoundRect(x, y, w, h, radius) {
        return this.drawRoundRectComplex(x, y, w, h, radius, radius, radius, radius)
      }
    }, {
      key: "drawRoundRectComplex",
      value: function drawRoundRectComplex(x, y, w, h, radiusTL, radiusTR, radiusBR, radiusBL) {
        return this.append(new RoundRect(x, y, w, h, radiusTL, radiusTR, radiusBR, radiusBL))
      }
    }, {
      key: "drawCircle",
      value: function drawCircle(x, y, radius) {
        return this.append(new Circle(x, y, radius))
      }
    }, {
      key: "drawEllipse",
      value: function drawEllipse(x, y, w, h) {
        return this.append(new Ellipse(x, y, w, h))
      }
    }, {
      key: "drawPolyStar",
      value: function drawPolyStar(x, y, radius, sides, pointSize, angle) {
        return this.append(new PolyStar(x, y, radius, sides, pointSize, angle))
      }
    }, {
      key: "append",
      value: function append(command, clean) {
        this._activeInstructions.push(command);
        this.command = command;
        if (!clean) {
          this._dirty = true
        }
        return this
      }
    }, {
      key: "decodePath",
      value: function decodePath(str) {
        var instructions = [this.moveTo, this.lineTo, this.quadraticCurveTo, this.bezierCurveTo, this.closePath];
        var paramCount = [2, 2, 4, 6, 0];
        var i = 0;
        var l = str.length;
        var params = [];
        var x = 0,
          y = 0;
        var base64 = Graphics.BASE_64;
        while (i < l) {
          var c = str.charAt(i);
          var n = base64[c];
          var fi = n >> 3; // highest order bits 1-3 code for operation.
          var f = instructions[fi];
          // check that we have a valid instruction & that the unused bits are empty:
          if (!f || n & 3) {
            throw "bad path data (@" + i + "):c"
          }
          var pl = paramCount[fi];
          if (!fi) {
            x = y = 0
          } // move operations reset the position.
          params.length = 0;
          i++;
          var charCount = (n >> 2 & 1) + 2; // 4th header bit indicates number size for this operation.
          for (var p = 0; p < pl; p++) {
            var num = base64[str.charAt(i)];
            var sign = num >> 5 ? -1 : 1;
            num = (num & 31) << 6 | base64[str.charAt(i + 1)];
            if (charCount == 3) {
              num = num << 6 | base64[str.charAt(i + 2)]
            }
            num = sign * num / 10;
            if (p % 2) {
              x = num += x
            } else {
              y = num += y
            }
            params[p] = num;
            i += charCount
          }
          f.apply(this, params)
        }
        return this
      }
    }, {
      key: "store",
      value: function store() {
        this._updateInstructions(true);
        this._storeIndex = this._instructions.length;
        return this
      }
    }, {
      key: "unstore",
      value: function unstore() {
        this._storeIndex = 0;
        return this
      }
    }, {
      key: "clone",
      value: function clone() {
        var o = new Graphics;
        o.command = this.command;
        o._stroke = this._stroke;
        o._strokeStyle = this._strokeStyle;
        o._strokeDash = this._strokeDash;
        o._strokeIgnoreScale = this._strokeIgnoreScale;
        o._fill = this._fill;
        o._instructions = this._instructions.slice();
        o._commitIndex = this._commitIndex;
        o._activeInstructions = this._activeInstructions.slice();
        o._dirty = this._dirty;
        o._storeIndex = this._storeIndex;
        return o
      }
    }, {
      key: "toString",
      value: function toString() {
        return "[Graphics]"
      }
    }, {
      key: "_updateInstructions",
      value: function _updateInstructions(commit) {
        var instr = this._instructions,
          active = this._activeInstructions,
          commitIndex = this._commitIndex;
        if (this._dirty && active.length) {
          instr.length = commitIndex; // remove old, uncommitted commands
          instr.push(Graphics.beginCmd);
          var l = active.length,
            ll = instr.length;
          instr.length = ll + l;
          for (var i = 0; i < l; i++) {
            instr[i + ll] = active[i]
          }
          if (this._fill) {
            instr.push(this._fill)
          }
          if (this._stroke) {
            // doesn't need to be re-applied if it hasn't changed.
            if (this._strokeDash !== this._oldStrokeDash) {
              this._oldStrokeDash = this._strokeDash;
              instr.push(this._strokeDash)
            }
            if (this._strokeStyle !== this._oldStrokeStyle) {
              this._oldStrokeStyle = this._strokeStyle;
              instr.push(this._strokeStyle)
            }
            instr.push(this._stroke)
          }
          this._dirty = false
        }
        if (commit) {
          active.length = 0;
          this._commitIndex = instr.length
        }
      }
    }, {
      key: "_setFill",
      /**
       * @method _setFill
       * @param fill
       * @protected
       */
      value: function _setFill(fill) {
        this._updateInstructions(true);
        this.command = this._fill = fill;
        return this
      }
    }, {
      key: "_setStroke",
      value: function _setStroke(stroke) {
        this._updateInstructions(true);
        if (this.command = this._stroke = stroke) {
          stroke.ignoreScale = this._strokeIgnoreScale
        }
        return this
      }
    }, {
      key: "instructions",
      // accessor properties:
      /**
       * Returns the graphics instructions array. Each entry is a graphics command object (ex. Graphics.Fill, Graphics.Rect)
       * Modifying the returned array directly is not recommended, and is likely to result in unexpected behaviour.
       *
       * This property is mainly intended for introspection of the instructions (ex. for graphics export).
       * @property instructions
       * @type {Array}
       * @readonly
       */
      get: function get() {
        this._updateInstructions();
        return this._instructions
      }
    }], [{
      key: "getRGB",
      value: function getRGB(r, g, b, alpha) {
        if (r != null && b == null) {
          alpha = g;
          b = r & 255;
          g = r >> 8 & 255;
          r = r >> 16 & 255
        }
        if (alpha == null) {
          return "rgb(" + r + "," + g + "," + b + ")"
        } else {
          return "rgba(" + r + "," + g + "," + b + "," + alpha + ")"
        }
      }
    }, {
      key: "getHSL",
      value: function getHSL(hue, saturation, lightness, alpha) {
        if (alpha == null) {
          return "hsl(" + hue % 360 + "," + saturation + "%," + lightness + "%)"
        } else {
          return "hsl(" + hue % 360 + "," + saturation + "%," + lightness + "%," + alpha + ")"
        }
      }
    }]);
    return Graphics
  }();
  var LineTo = function () {
    /**
     * @constructor
     * @param {Number} x
     * @param {Number} y
     */
    function LineTo(x, y) {
      classCallCheck(this, LineTo);
      /**
       * @property x
       * @type Number
       */
      this.x = x;
      /**
       * @property y
       * @type Number
       */
      this.y = y
    }
    /**
     * Execute the Graphics command in the provided Canvas context.
     * @method exec
     * @param {CanvasRenderingContext2D} ctx The canvas rendering context
     */
    createClass(LineTo, [{
      key: "exec",
      value: function exec(ctx) {
        ctx.lineTo(this.x, this.y)
      }
    }]);
    return LineTo
  }();
  /**
   * Graphics command object. See {{#crossLink "Graphics/moveTo"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
   * @class MoveTo
   */
  var MoveTo = function () {
    /**
     * @constructor
     * @param {Number} x
     * @param {Number} y
     */
    function MoveTo(x, y) {
      classCallCheck(this, MoveTo);
      /**
       * @property x
       * @type Number
       */
      this.x = x;
      /**
       * @property y
       * @type Number
       */
      this.y = y
    }
    /**
     * @method exec
     * @param {CanvasRenderingContext2D} ctx
     */
    createClass(MoveTo, [{
      key: "exec",
      value: function exec(ctx) {
        ctx.moveTo(this.x, this.y)
      }
    }]);
    return MoveTo
  }();
  /**
   * Graphics command object. See {{#crossLink "Graphics/arcTo"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
   * @class ArcTo
   */
  var ArcTo = function () {
    /**
     * @constructor
     * @param {Number} x1
     * @param {Number} y1
     * @param {Number} x2
     * @param {Number} y2
     * @param {Number} radius
     */
    function ArcTo(x1, y1, x2, y2, radius) {
      classCallCheck(this, ArcTo);
      /**
       * @property x1
       * @type Number
       */
      this.x1 = x1;
      /**
       * @property y1
       * @type Number
       */
      this.y1 = y1;
      /**
       * @property x2
       * @type Number
       */
      this.x2 = x2;
      /**
       * @property y2
       * @type Number
       */
      this.y2 = y2;
      /**
       * @property radius
       * @type Number
       */
      this.radius = radius
    }
    /**
     * Execute the Graphics command in the provided Canvas context.
     * @method exec
     * @param {CanvasRenderingContext2D} ctx The canvas rendering context
     */
    createClass(ArcTo, [{
      key: "exec",
      value: function exec(ctx) {
        ctx.arcTo(this.x1, this.y1, this.x2, this.y2, this.radius)
      }
    }]);
    return ArcTo
  }();
  /**
   * Graphics command object. See {{#crossLink "Graphics/arc"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
   * @class Arc
   */
  var Arc = function () {
    /**
     * @constructor
     * @param {Number} x
     * @param {Number} y
     * @param {Number} radius
     * @param {Number} startAngle
     * @param {Number} endAngle
     * @param {Number} anticlockwise
     */
    function Arc(x, y, radius, startAngle, endAngle, anticlockwise) {
      classCallCheck(this, Arc);
      /**
       * @property x
       * @type Number
       */
      this.x = x;
      /**
       * @property y
       * @type Number
       */
      this.y = y;
      /**
       * @property radius
       * @type Number
       */
      this.radius = radius;
      /**
       * @property startAngle
       * @type Number
       */
      this.startAngle = startAngle;
      /**
       * @property endAngle
       * @type Number
       */
      this.endAngle = endAngle;
      /**
       * @property anticlockwise
       * @type Number
       */
      this.anticlockwise = !!anticlockwise
    }
    /**
     * Execute the Graphics command in the provided Canvas context.
     * @method exec
     * @param {CanvasRenderingContext2D} ctx The canvas rendering context
     */
    createClass(Arc, [{
      key: "exec",
      value: function exec(ctx) {
        ctx.arc(this.x, this.y, this.radius, this.startAngle, this.endAngle, this.anticlockwise)
      }
    }]);
    return Arc
  }();
  /**
   * Graphics command object. See {{#crossLink "Graphics/quadraticCurveTo"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
   * @class QuadraticCurveTo
   */
  var QuadraticCurveTo = function () {
    /**
     * @constructor
     * @param {Number} cpx
     * @param {Number} cpy
     * @param {Number} x
     * @param {Number} y
     */
    function QuadraticCurveTo(cpx, cpy, x, y) {
      classCallCheck(this, QuadraticCurveTo);
      /**
       * @property cpx
       * @type Number
       */
      this.cpx = cpx;
      /**
       * @property cpy
       * @type Number
       */
      this.cpy = cpy;
      /**
       * @property x
       * @type Number
       */
      this.x = x;
      /**
       * @property y
       * @type Number
       */
      this.y = y
    }
    /**
     * Execute the Graphics command in the provided Canvas context.
     * @method exec
     * @param {CanvasRenderingContext2D} ctx The canvas rendering context
     */
    createClass(QuadraticCurveTo, [{
      key: "exec",
      value: function exec(ctx) {
        ctx.quadraticCurveTo(this.cpx, this.cpy, this.x, this.y)
      }
    }]);
    return QuadraticCurveTo
  }();
  /**
   * Graphics command object. See {{#crossLink "Graphics/bezierCurveTo"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
   * @class BezierCurveTo
   */
  var BezierCurveTo = function () {
    /**
     * @constructor
     * @param {Number} cp1x
     * @param {Number} cp1y
     * @param {Number} cp2x
     * @param {Number} cp2y
     * @param {Number} x
     * @param {Number} y
     */
    function BezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
      classCallCheck(this, BezierCurveTo);
      /**
       * @property cp1x
       * @type Number
       */
      this.cp1x = cp1x;
      /**
       * @property cp1y
       * @type Number
       */
      this.cp1y = cp1y;
      /**
       * @property cp2x
       * @type Number
       */
      this.cp2x = cp2x;
      /**
       * @property cp2y
       * @type Number
       */
      this.cp2y = cp2y;
      /**
       * @property x
       * @type Number
       */
      this.x = x;
      /**
       * @property y
       * @type Number
       */
      this.y = y
    }
    /**
     * Execute the Graphics command in the provided Canvas context.
     * @method exec
     * @param {CanvasRenderingContext2D} ctx The canvas rendering context
     */
    createClass(BezierCurveTo, [{
      key: "exec",
      value: function exec(ctx) {
        ctx.bezierCurveTo(this.cp1x, this.cp1y, this.cp2x, this.cp2y, this.x, this.y)
      }
    }]);
    return BezierCurveTo
  }();
  /**
   * Graphics command object. See {{#crossLink "Graphics/rect"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
   * @class Rect
   */
  var Rect = function () {
    /**
     * @constructor
     * @param {Number} x
     * @param {Number} y
     * @param {Number} w
     * @param {Number} h
     */
    function Rect(x, y, w, h) {
      classCallCheck(this, Rect);
      /**
       * @property x
       * @type Number
       */
      this.x = x;
      /**
       * @property y
       * @type Number
       */
      this.y = y;
      /**
       * @property w
       * @type Number
       */
      this.w = w;
      /**
       * @property h
       * @type Number
       */
      this.h = h
    }
    /**
     * Execute the Graphics command in the provided Canvas context.
     * @method exec
     * @param {CanvasRenderingContext2D} ctx The canvas rendering context
     */
    createClass(Rect, [{
      key: "exec",
      value: function exec(ctx) {
        ctx.rect(this.x, this.y, this.w, this.h)
      }
    }]);
    return Rect
  }();
  /**
   * Graphics command object. See {{#crossLink "Graphics/closePath"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
   * @class ClosePath
   */
  var ClosePath = function () {
    /**
     * @constructor
     */
    function ClosePath() {
      classCallCheck(this, ClosePath)
    }
    /**
     * Execute the Graphics command in the provided Canvas context.
     * @method exec
     * @param {CanvasRenderingContext2D} ctx The canvas rendering context
     */
    createClass(ClosePath, [{
      key: "exec",
      value: function exec(ctx) {
        ctx.closePath()
      }
    }]);
    return ClosePath
  }();
  /**
   * Graphics command object to begin a new path. See {{#crossLink "Graphics"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
   * @class BeginPath
   */
  var BeginPath = function () {
    /**
     * @constructor
     */
    function BeginPath() {
      classCallCheck(this, BeginPath)
    }
    /**
     * Execute the Graphics command in the provided Canvas context.
     * @method exec
     * @param {CanvasRenderingContext2D} ctx The canvas rendering context
     */
    createClass(BeginPath, [{
      key: "exec",
      value: function exec(ctx) {
        ctx.beginPath()
      }
    }]);
    return BeginPath
  }();
  /**
   * Graphics command object. See {{#crossLink "Graphics/beginFill"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
   * @class Fill
   */
  var Fill = function () {
    /**
     * @constructor
     * @param {Object} style A valid Context2D fillStyle.
     * @param {Matrix2D} matrix
     */
    function Fill(style, matrix) {
      classCallCheck(this, Fill);
      /**
       * A valid Context2D fillStyle.
       * @property style
       * @type Object
       */
      this.style = style;
      /**
       * @property matrix
       * @type Matrix2D
       */
      this.matrix = matrix;
      /**
       * @property path
       * @type {Boolean}
       */
      this.path = false
    }
    /**
     * Execute the Graphics command in the provided Canvas context.
     * @method exec
     * @param {CanvasRenderingContext2D} ctx The canvas rendering context
     */
    createClass(Fill, [{
      key: "exec",
      value: function exec(ctx) {
        if (!this.style) {
          return
        }
        ctx.fillStyle = this.style;
        var mtx = this.matrix;
        if (mtx) {
          ctx.save();
          ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty)
        }
        ctx.fill();
        if (mtx) {
          ctx.restore()
        }
      }
    }, {
      key: "linearGradient",
      value: function linearGradient(colors, ratios, x0, y0, x1, y1) {
        var o = this.style = Graphics._ctx.createLinearGradient(x0, y0, x1, y1);
        var l = colors.length;
        for (var i = 0; i < l; i++) {
          o.addColorStop(ratios[i], colors[i])
        }
        o.props = {
          colors: colors,
          ratios: ratios,
          x0: x0,
          y0: y0,
          x1: x1,
          y1: y1,
          type: "linear"
        };
        return this
      }
    }, {
      key: "radialGradient",
      value: function radialGradient(colors, ratios, x0, y0, r0, x1, y1, r1) {
        var o = this.style = Graphics._ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
        var l = colors.length;
        for (var i = 0; i < l; i++) {
          o.addColorStop(ratios[i], colors[i])
        }
        o.props = {
          colors: colors,
          ratios: ratios,
          x0: x0,
          y0: y0,
          r0: r0,
          x1: x1,
          y1: y1,
          r1: r1,
          type: "radial"
        };
        return this
      }
    }, {
      key: "bitmap",
      value: function bitmap(image) {
        var repetition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
        if (image.naturalWidth || image.getContext || image.readyState >= 2) {
          var o = this.style = Graphics._ctx.createPattern(image, repetition);
          o.props = {
            image: image,
            repetition: repetition,
            type: "bitmap"
          }
        }
        return this
      }
    }]);
    return Fill
  }();
  /**
   * Graphics command object. See {{#crossLink "Graphics/beginStroke"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
   * @class Stroke
   */
  var Stroke = function () {
    /**
     * @constructor
     * @param {Object} style A valid Context2D fillStyle.
     * @param {Boolean} ignoreScale
     */
    function Stroke(style, ignoreScale) {
      classCallCheck(this, Stroke);
      /**
       * A valid Context2D strokeStyle.
       * @property style
       * @type Object
       */
      this.style = style;
      /**
       * @property ignoreScale
       * @type Boolean
       */
      this.ignoreScale = ignoreScale;
      /**
       * @property path
       * @type {Boolean}
       */
      this.path = false
    }
    /**
     * Execute the Graphics command in the provided Canvas context.
     * @method exec
     * @param {CanvasRenderingContext2D} ctx The canvas rendering context
     */
    createClass(Stroke, [{
      key: "exec",
      value: function exec(ctx) {
        if (!this.style) {
          return
        }
        ctx.strokeStyle = this.style;
        if (this.ignoreScale) {
          ctx.save();
          ctx.setTransform(1, 0, 0, 1, 0, 0)
        }
        ctx.stroke();
        if (this.ignoreScale) {
          ctx.restore()
        }
      }
    }, {
      key: "linearGradient",
      value: function linearGradient() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key]
        }
        // TODO-ES6: Anything but this...
        Fill.prototype.linearGradient.apply(this, args)
      }
    }, {
      key: "radialGradient",
      value: function radialGradient() {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2]
        }
        Fill.prototype.radialGradient.apply(this, args)
      }
    }, {
      key: "bitmap",
      value: function bitmap() {
        for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3]
        }
        Fill.prototype.bitmap.apply(this, args)
      }
    }]);
    return Stroke
  }();
  /**
   * Graphics command object. See {{#crossLink "Graphics/setStrokeStyle"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
   * @class StrokeStyle
   */
  var StrokeStyle = function () {
    /**
     * @constructor
     * @param {Number} [width=1]
     * @param {String} [caps=butt]
     * @param {String} [joints=miter]
     * @param {Number} [miterLimit=10]
     * @param {Boolean} [ignoreScale=false]
     * @type {String}
     */
    function StrokeStyle(width) {
      var caps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "butt";
      var joints = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "miter";
      var miterLimit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 10;
      var ignoreScale = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
      classCallCheck(this, StrokeStyle);
      /**
       * @property width
       * @type Number
       */
      this.width = width;
      /**
       * One of: butt, round, square
       * @property caps
       * @type String
       */
      this.caps = caps;
      /**
       * One of: round, bevel, miter
       * @property joints
       * @type String
       */
      this.joints = joints;
      /**
       * @property miterLimit
       * @type Number
       */
      this.miterLimit = miterLimit;
      /**
       * @property ignoreScale
       * @type Boolean
       */
      this.ignoreScale = ignoreScale;
      /**
       * @property path
       * @type {Boolean}
       */
      this.path = false
    }
    /**
     * Execute the Graphics command in the provided Canvas context.
     * @method exec
     * @param {CanvasRenderingContext2D} ctx The canvas rendering context
     */
    createClass(StrokeStyle, [{
      key: "exec",
      value: function exec(ctx) {
        ctx.lineWidth = this.width;
        ctx.lineCap = isNaN(this.caps) ? this.caps : Graphics.STROKE_CAPS_MAP[this.caps];
        ctx.lineJoin = isNaN(this.joints) ? this.joints : Graphics.STROKE_JOINTS_MAP[this.joints];
        ctx.miterLimit = this.miterLimit;
        ctx.ignoreScale = this.ignoreScale
      }
    }]);
    return StrokeStyle
  }();
  /**
   * Graphics command object. See {{#crossLink "Graphics/setStrokeDash"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
   * @class StrokeDash
   */
  var StrokeDash = function () {
    /**
     * @constructor
     * @param {Array} [segments=[]]
     * @param {Number} [offset=0]
     */
    function StrokeDash() {
      var segments = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : StrokeDash.EMPTY_SEGMENTS;
      var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      classCallCheck(this, StrokeDash);
      /**
       * @property segments
       * @type Array
       */
      this.segments = segments;
      /**
       * @property offset
       * @type Number
       */
      this.offset = offset
    }
    /**
     * The default value for segments (ie. no dash).
     * Used instead of [] to reduce churn.
     * @property EMPTY_SEGMENTS
     * @static
     * @final
     * @readonly
     * @protected
     * @type {Array}
     */
    createClass(StrokeDash, [{
      key: "exec",
      /**
       * Execute the Graphics command in the provided Canvas context.
       * @method exec
       * @param {CanvasRenderingContext2D} ctx The canvas rendering context
       */
      value: function exec(ctx) {
        if (ctx.setLineDash) {
          // feature detection.
          ctx.setLineDash(this.segments);
          ctx.lineDashOffset = this.offset
        }
      }
    }], [{
      key: "EMPTY_SEGMENTS",
      get: function get() {
        return _EMPTY_SEGMENTS
      }
    }]);
    return StrokeDash
  }();
  /**
   * Graphics command object. See {{#crossLink "Graphics/drawRoundRectComplex"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
   * @class RoundRect
   */
  var RoundRect = function () {
    /**
     * @constructor
     * @param {Number} x
     * @param {Number} y
     * @param {Number} w
     * @param {Number} h
     * @param {Number} radiusTL
     * @param {Number} radiusTR
     * @param {Number} radiusBR
     * @param {Number} radiusBL
     */
    function RoundRect(x, y, w, h, radiusTL, radiusTR, radiusBR, radiusBL) {
      classCallCheck(this, RoundRect);
      /**
       * @property x
       * @type Number
       */
      this.x = x;
      /**
       * @property y
       * @type Number
       */
      this.y = y;
      /**
       * @property w
       * @type Number
       */
      this.w = w;
      /**
       * @property h
       * @type Number
       */
      this.h = h;
      /**
       * @property radiusTL
       * @type Number
       */
      this.radiusTL = radiusTL;
      /**
       * @property radiusTR
       * @type Number
       */
      this.radiusTR = radiusTR;
      /**
       * @property radiusBR
       * @type Number
       */
      this.radiusBR = radiusBR;
      /**
       * @property radiusBL
       * @type Number
       */
      this.radiusBL = radiusBL
    }
    /**
     * Execute the Graphics command in the provided Canvas context.
     * @method exec
     * @param {CanvasRenderingContext2D} ctx The canvas rendering context
     */
    createClass(RoundRect, [{
      key: "exec",
      value: function exec(ctx) {
        var max = (w < h ? w : h) / 2;
        var mTL = 0,
          mTR = 0,
          mBR = 0,
          mBL = 0;
        var x = this.x,
          y = this.y,
          w = this.w,
          h = this.h;
        var rTL = this.radiusTL,
          rTR = this.radiusTR,
          rBR = this.radiusBR,
          rBL = this.radiusBL;
        if (rTL < 0) {
          rTL *= mTL = -1
        }
        if (rTL > max) {
          rTL = max
        }
        if (rTR < 0) {
          rTR *= mTR = -1
        }
        if (rTR > max) {
          rTR = max
        }
        if (rBR < 0) {
          rBR *= mBR = -1
        }
        if (rBR > max) {
          rBR = max
        }
        if (rBL < 0) {
          rBL *= mBL = -1
        }
        if (rBL > max) {
          rBL = max
        }
        ctx.moveTo(x + w - rTR, y);
        ctx.arcTo(x + w + rTR * mTR, y - rTR * mTR, x + w, y + rTR, rTR);
        ctx.lineTo(x + w, y + h - rBR);
        ctx.arcTo(x + w + rBR * mBR, y + h + rBR * mBR, x + w - rBR, y + h, rBR);
        ctx.lineTo(x + rBL, y + h);
        ctx.arcTo(x - rBL * mBL, y + h + rBL * mBL, x, y + h - rBL, rBL);
        ctx.lineTo(x, y + rTL);
        ctx.arcTo(x - rTL * mTL, y - rTL * mTL, x + rTL, y, rTL);
        ctx.closePath()
      }
    }]);
    return RoundRect
  }();
  /**
   * Graphics command object. See {{#crossLink "Graphics/drawCircle"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
   * @class Circle
   */
  var Circle = function () {
    /**
     * @constructor
     * @param {Number} x
     * @param {Number} y
     * @param {Number} radius
     */
    function Circle(x, y, radius) {
      classCallCheck(this, Circle);
      /**
       * @property x
       * @type Number
       */
      this.x = x;
      /**
       * @property y
       * @type Number
       */
      this.y = y;
      /**
       * @property radius
       * @type Number
       */
      this.radius = radius
    }
    /**
     * Execute the Graphics command in the provided Canvas context.
     * @method exec
     * @param {CanvasRenderingContext2D} ctx The canvas rendering context
     */
    createClass(Circle, [{
      key: "exec",
      value: function exec(ctx) {
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
      }
    }]);
    return Circle
  }();
  /**
   * Graphics command object. See {{#crossLink "Graphics/drawEllipse"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
   * @class Ellipse
   */
  var Ellipse = function () {
    /**
     * @constructor
     * @param {Number} x
     * @param {Number} y
     * @param {Number} w
     * @param {Number} h
     */
    function Ellipse(x, y, w, h) {
      classCallCheck(this, Ellipse);
      /**
       * @property x
       * @type Number
       */
      this.x = x;
      /**
       * @property y
       * @type Number
       */
      this.y = y;
      /**
       * @property w
       * @type Number
       */
      this.w = w;
      /**
       * @property h
       * @type Number
       */
      this.h = h
    }
    /**
     * Execute the Graphics command in the provided Canvas context.
     * @method exec
     * @param {CanvasRenderingContext2D} ctx The canvas rendering context
     */
    createClass(Ellipse, [{
      key: "exec",
      value: function exec(ctx) {
        var x = this.x,
          y = this.y;
        var w = this.w,
          h = this.h;
        var k = .5522848;
        var ox = w / 2 * k;
        var oy = h / 2 * k;
        var xe = x + w;
        var ye = y + h;
        var xm = x + w / 2;
        var ym = y + h / 2;
        ctx.moveTo(x, ym);
        ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
        ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
        ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
        ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym)
      }
    }]);
    return Ellipse
  }();
  /**
   * Graphics command object. See {{#crossLink "Graphics/drawPolyStar"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
   * @class PolyStar
   */
  var PolyStar = function () {
    /**
     * @constructor
     * @param {Number} x
     * @param {Number} y
     * @param {Number} radius
     * @param {Number} sides
     * @param {Number} [pointSize=0]
     * @param {Number} [angle=0]
     */
    function PolyStar(x, y, radius, sides) {
      var pointSize = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
      var angle = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
      classCallCheck(this, PolyStar);
      /**
       * @property x
       * @type Number
       */
      this.x = x;
      /**
       * @property y
       * @type Number
       */
      this.y = y;
      /**
       * @property radius
       * @type Number
       */
      this.radius = radius;
      /**
       * @property sides
       * @type Number
       */
      this.sides = sides;
      /**
       * @property pointSize
       * @type Number
       */
      this.pointSize = pointSize;
      /**
       * @property angle
       * @type Number
       */
      this.angle = angle
    }
    /**
     * Execute the Graphics command in the provided Canvas context.
     * @method exec
     * @param {CanvasRenderingContext2D} ctx The canvas rendering context
     */
    createClass(PolyStar, [{
      key: "exec",
      value: function exec(ctx) {
        var x = this.x,
          y = this.y;
        var radius = this.radius;
        var angle = this.angle / 180 * Math.PI;
        var sides = this.sides;
        var ps = 1 - this.pointSize;
        var a = Math.PI / sides;
        ctx.moveTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
        for (var i = 0; i < sides; i++) {
          angle += a;
          if (ps != 1) {
            ctx.lineTo(x + Math.cos(angle) * radius * ps, y + Math.sin(angle) * radius * ps)
          }
          angle += a;
          ctx.lineTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius)
        }
        ctx.closePath()
      }
    }]);
    return PolyStar
  }();
  // static properties:
  /**
   * A reusable instance of {{#crossLink "Graphics/BeginPath"}}{{/crossLink}} to avoid
   * unnecessary instantiation.
   * @property beginCmd
   * @type {Graphics.BeginPath}
   * @static
   * @readonly
   */
  /**
   * Map of Base64 characters to values. Used by {{#crossLink "Graphics/decodePath"}}{{/crossLink}}.
   * @property BASE_64
   * @static
   * @final
   * @readonly
   * @type {Object}
   */
  /**
   * Maps numeric values for the caps parameter of {{#crossLink "Graphics/setStrokeStyle"}}{{/crossLink}} to
   * corresponding string values. This is primarily for use with the tiny API. The mappings are as follows: 0 to
   * "butt", 1 to "round", and 2 to "square".
   * For example, to set the line caps to "square":
   *
   *      myGraphics.ss(16, 2);
   *
   * @property STROKE_CAPS_MAP
   * @static
   * @final
   * @readonly
   * @type {Array}
   */
  /**
   * Maps numeric values for the joints parameter of {{#crossLink "Graphics/setStrokeStyle"}}{{/crossLink}} to
   * corresponding string values. This is primarily for use with the tiny API. The mappings are as follows: 0 to
   * "miter", 1 to "round", and 2 to "bevel".
   * For example, to set the line joints to "bevel":
   *
   *      myGraphics.ss(16, 0, 2);
   *
   * @property STROKE_JOINTS_MAP
   * @static
   * @final
   * @readonly
   * @type {Array}
   */
  /**
   * @property _ctx
   * @static
   * @protected
   * @type {CanvasRenderingContext2D}
   */
  {
    var canvas$1 = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas");
    if (canvas$1.getContext) {
      Graphics._ctx = canvas$1.getContext("2d");
      canvas$1.width = canvas$1.height = 1
    }
    Graphics.beginCmd = new BeginPath;
    Graphics.BASE_64 = {
      A: 0,
      B: 1,
      C: 2,
      D: 3,
      E: 4,
      F: 5,
      G: 6,
      H: 7,
      I: 8,
      J: 9,
      K: 10,
      L: 11,
      M: 12,
      N: 13,
      O: 14,
      P: 15,
      Q: 16,
      R: 17,
      S: 18,
      T: 19,
      U: 20,
      V: 21,
      W: 22,
      X: 23,
      Y: 24,
      Z: 25,
      a: 26,
      b: 27,
      c: 28,
      d: 29,
      e: 30,
      f: 31,
      g: 32,
      h: 33,
      i: 34,
      j: 35,
      k: 36,
      l: 37,
      m: 38,
      n: 39,
      o: 40,
      p: 41,
      q: 42,
      r: 43,
      s: 44,
      t: 45,
      u: 46,
      v: 47,
      w: 48,
      x: 49,
      y: 50,
      z: 51,
      0: 52,
      1: 53,
      2: 54,
      3: 55,
      4: 56,
      5: 57,
      6: 58,
      7: 59,
      8: 60,
      9: 61,
      "+": 62,
      "/": 63
    };
    Graphics.STROKE_CAPS_MAP = ["butt", "round", "square"];
    Graphics.STROKE_JOINTS_MAP = ["miter", "round", "bevel"];
    Graphics.EMPTY_SEGMENTS = []
  }
  // TODO: Get Tween and Timeline imports.
  /**
   * The MovieClip class associates a TweenJS Timeline with an EaselJS {{#crossLink "Container"}}{{/crossLink}}. It allows
   * you to create objects which encapsulate timeline animations, state changes, and synched actions. Due to the
   * complexities inherent in correctly setting up a MovieClip, it is largely intended for tool output and is not included
   * in the main EaselJS library.
   *
   * Currently MovieClip only works properly if it is tick based (as opposed to time based) though some concessions have
   * been made to support time-based timelines in the future.
   *
   * <h4>Example</h4>
   * This example animates two shapes back and forth. The grey shape starts on the left, but we jump to a mid-point in
   * the animation using {{#crossLink "MovieClip/gotoAndPlay"}}{{/crossLink}}.
   *
   *      var stage = new createjs.Stage("canvas");
   *      createjs.Ticker.addEventListener("tick", stage);
   *
   *      var mc = new createjs.MovieClip(null, 0, true, {start:20});
   *      stage.addChild(mc);
   *
   *      var child1 = new createjs.Shape(
   *          new createjs.Graphics().beginFill("#999999")
   *              .drawCircle(30,30,30));
   *      var child2 = new createjs.Shape(
   *          new createjs.Graphics().beginFill("#5a9cfb")
   *              .drawCircle(30,30,30));
   *
   *      mc.timeline.addTween(
   *          createjs.Tween.get(child1)
   *              .to({x:0}).to({x:60}, 50).to({x:0}, 50));
   *      mc.timeline.addTween(
   *          createjs.Tween.get(child2)
   *              .to({x:60}).to({x:0}, 50).to({x:60}, 50));
   *
   *      mc.gotoAndPlay("start");
   *
   * It is recommended to use <code>tween.to()</code> to animate and set properties (use no duration to have it set
   * immediately), and the <code>tween.wait()</code> method to create delays between animations. Note that using the
   * <code>tween.set()</code> method to affect properties will likely not provide the desired result.
   *
   * @class MovieClip
   * @main MovieClip
   * @extends Container
   */
  var MovieClip = function (_Container) {
    inherits(MovieClip, _Container);
    // constructor:
    /**
     * @constructor
     * @param {String} [mode=independent] Initial value for the mode property. One of {{#crossLink "MovieClip/INDEPENDENT:property"}}{{/crossLink}},
     * {{#crossLink "MovieClip/SINGLE_FRAME:property"}}{{/crossLink}}, or {{#crossLink "MovieClip/SYNCHED:property"}}{{/crossLink}}.
     * The default is {{#crossLink "MovieClip/INDEPENDENT:property"}}{{/crossLink}}.
     * @param {Number} [startPosition=0] Initial value for the {{#crossLink "MovieClip/startPosition:property"}}{{/crossLink}}
     * property.
     * @param {Boolean} [loop=true] Initial value for the {{#crossLink "MovieClip/loop:property"}}{{/crossLink}}
     * property. The default is `true`.
     * @param {Object} [labels=null] A hash of labels to pass to the {{#crossLink "MovieClip/timeline:property"}}{{/crossLink}}
     * instance associated with this MovieClip. Labels only need to be passed if they need to be used.
     */
    function MovieClip() {
      var mode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : MovieClip.INDEPENDENT;
      var startPosition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var loop = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var labels = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      classCallCheck(this, MovieClip);
      var _this = possibleConstructorReturn(this, (MovieClip.__proto__ || Object.getPrototypeOf(MovieClip)).call(this));
      !MovieClip.inited && MovieClip.init(); // static init
      // public properties:
      /**
       * Controls how this MovieClip advances its time. Must be one of 0 (INDEPENDENT), 1 (SINGLE_FRAME), or 2 (SYNCHED).
       * See each constant for a description of the behaviour.
       * @property mode
       * @type String
       * @default null
       */
      _this.mode = mode;
      /**
       * Specifies what the first frame to play in this movieclip, or the only frame to display if mode is SINGLE_FRAME.
       * @property startPosition
       * @type Number
       * @default 0
       */
      _this.startPosition = startPosition;
      /**
       * Indicates whether this MovieClip should loop when it reaches the end of its timeline.
       * @property loop
       * @type Boolean
       * @default true
       */
      _this.loop = loop;
      /**
       * The current frame of the movieclip.
       * @property currentFrame
       * @type Number
       * @default 0
       * @readonly
       */
      _this.currentFrame = 0;
      /**
       * The TweenJS Timeline that is associated with this MovieClip. This is created automatically when the MovieClip
       * instance is initialized. Animations are created by adding <a href="http://tweenjs.com">TweenJS</a> Tween
       * instances to the timeline.
       *
       * <h4>Example</h4>
       *
       *      var tween = createjs.Tween.get(target).to({x:0}).to({x:100}, 30);
       *      var mc = new createjs.MovieClip();
       *      mc.timeline.addTween(tween);
       *
       * Elements can be added and removed from the timeline by toggling an "_off" property
       * using the <code>tweenInstance.to()</code> method. Note that using <code>Tween.set</code> is not recommended to
       * create MovieClip animations. The following example will toggle the target off on frame 0, and then back on for
       * frame 1. You can use the "visible" property to achieve the same effect.
       *
       *      var tween = createjs.Tween.get(target).to({_off:false})
       *          .wait(1).to({_off:true})
       *          .wait(1).to({_off:false});
       *
       * @property timeline
       * @type Timeline
       * @default null
       */
      _this.timeline = new Timeline(null, labels, {
        paused: true,
        position: startPosition,
        useTicks: true
      });
      /**
       * If true, the MovieClip's position will not advance when ticked.
       * @property paused
       * @type Boolean
       * @default false
       */
      _this.paused = false;
      /**
       * If true, actions in this MovieClip's tweens will be run when the playhead advances.
       * @property actionsEnabled
       * @type Boolean
       * @default true
       */
      _this.actionsEnabled = true;
      /**
       * If true, the MovieClip will automatically be reset to its first frame whenever the timeline adds
       * it back onto the display list. This only applies to MovieClip instances with mode=INDEPENDENT.
       * <br><br>
       * For example, if you had a character animation with a "body" child MovieClip instance
       * with different costumes on each frame, you could set body.autoReset = false, so that
       * you can manually change the frame it is on, without worrying that it will be reset
       * automatically.
       * @property autoReset
       * @type Boolean
       * @default true
       */
      _this.autoReset = true;
      /**
       * An array of bounds for each frame in the MovieClip. This is mainly intended for tool output.
       * @property frameBounds
       * @type Array
       * @default null
       */
      _this.frameBounds = _this.frameBounds || null; // TODO: Deprecated. This is for backwards support of Flash/Animate
      /**
       * By default MovieClip instances advance one frame per tick. Specifying a framerate for the MovieClip
       * will cause it to advance based on elapsed time between ticks as appropriate to maintain the target
       * framerate.
       *
       * For example, if a MovieClip with a framerate of 10 is placed on a Stage being updated at 40fps, then the MovieClip will
       * advance roughly one frame every 4 ticks. This will not be exact, because the time between each tick will
       * vary slightly between frames.
       *
       * This feature is dependent on the tick event object (or an object with an appropriate "delta" property) being
       * passed into {{#crossLink "Stage/update"}}{{/crossLink}}.
       * @property framerate
       * @type {Number}
       * @default null
       */
      _this.framerate = null;
      // private properties:
      /**
       * @property _synchOffset
       * @type Number
       * @default 0
       * @private
       */
      _this._synchOffset = 0;
      /**
       * @property _prevPos
       * @type Number
       * @default -1
       * @private
       */
      _this._prevPos = -1; // TODO: evaluate using a ._reset Boolean prop instead of -1.
      /**
       * @property _prevPosition
       * @type Number
       * @default 0
       * @private
       */
      _this._prevPosition = 0;
      /**
       * The time remaining from the previous tick, only applicable when .framerate is set.
       * @property _t
       * @type Number
       * @private
       */
      _this._t = 0;
      /**
       * List of display objects that are actively being managed by the MovieClip.
       * @property _managed
       * @type Object
       * @private
       */
      _this._managed = {};
      return _this
    }
    // static methods:
    createClass(MovieClip, [{
      key: "isVisible",
      // public methods:
      /**
       * Returns true or false indicating whether the display object would be visible if drawn to a canvas.
       * This does not account for whether it would be visible within the boundaries of the stage.
       * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
       * @method isVisible
       * @return {Boolean} Boolean indicating whether the display object would be visible if drawn to a canvas
       */
      value: function isVisible() {
        // children are placed in draw, so we can't determine if we have content.
        return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0)
      }
    }, {
      key: "draw",
      value: function draw(ctx, ignoreCache) {
        // draw to cache first:
        if (this.cacheDraw(ctx, ignoreCache)) {
          return true
        }
        this._updateTimeline();
        get$1(MovieClip.prototype.__proto__ || Object.getPrototypeOf(MovieClip.prototype), "draw", this).call(this, ctx, ignoreCache);
        return true
      }
    }, {
      key: "play",
      value: function play() {
        this.paused = false
      }
    }, {
      key: "stop",
      value: function stop() {
        this.paused = true
      }
    }, {
      key: "gotoAndPlay",
      value: function gotoAndPlay(positionOrLabel) {
        this.paused = false;
        this._goto(positionOrLabel)
      }
    }, {
      key: "gotoAndStop",
      value: function gotoAndStop(positionOrLabel) {
        this.paused = true;
        this._goto(positionOrLabel)
      }
    }, {
      key: "advance",
      value: function advance(time) {
        // TODO: should we worry at all about clips who change their own modes via frame scripts?
        var independent = MovieClip.INDEPENDENT;
        if (this.mode != independent) {
          return
        }
        var o = this,
          fps = o.framerate;
        while ((o = o.parent) && fps == null) {
          if (o.mode == independent) {
            fps = o._framerate
          }
        }
        this._framerate = fps;
        var t = fps != null && fps != -1 && time != null ? time / (1e3 / fps) + this._t : 1;
        var frames = t | 0;
        this._t = t - frames; // leftover time
        while (!this.paused && frames--) {
          this._prevPosition = this._prevPos < 0 ? 0 : this._prevPosition + 1;
          this._updateTimeline()
        }
      }
    }, {
      key: "clone",
      value: function clone() {
        // TODO: add support for this? Need to clone the Timeline & retarget tweens - pretty complex.
        throw "MovieClip cannot be cloned."
      }
    }, {
      key: "_tick",
      value: function _tick(evtObj) {
        this.advance(evtObj && evtObj.delta);
        get$1(MovieClip.prototype.__proto__ || Object.getPrototypeOf(MovieClip.prototype), "_tick", this).call(this, evtObj)
      }
    }, {
      key: "_goto",
      value: function _goto(positionOrLabel) {
        var pos = this.timeline.resolve(positionOrLabel);
        if (pos == null) {
          return
        }
        // prevent _updateTimeline from overwriting the new position because of a reset:
        if (this._prevPos == -1) {
          this._prevPos = NaN
        }
        this._prevPosition = pos;
        this._t = 0;
        this._updateTimeline()
      }
    }, {
      key: "_reset",
      value: function _reset() {
        this._prevPos = -1;
        this._t = this.currentFrame = 0;
        this.paused = false
      }
    }, {
      key: "_updateTimeline",
      value: function _updateTimeline() {
        var tl = this.timeline;
        var synched = this.mode != MovieClip.INDEPENDENT;
        tl.loop = this.loop == null ? true : this.loop;
        var pos = synched ? this.startPosition + (this.mode == MovieClip.SINGLE_FRAME ? 0 : this._synchOffset) : this._prevPos < 0 ? 0 : this._prevPosition;
        var mode = synched || !this.actionsEnabled ? Tween.NONE : null;
        // pre-assign currentFrame so it is available to frame scripts:
        this.currentFrame = tl._calcPosition(pos);
        // update timeline position, ignoring actions if this is a graphic.
        tl.setPosition(pos, mode);
        this._prevPosition = tl._prevPosition;
        if (this._prevPos == tl._prevPos) {
          return
        }
        this.currentFrame = this._prevPos = tl._prevPos;
        for (var n in this._managed) {
          this._managed[n] = 1
        }
        var tweens = tl._tweens;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;
        try {
          for (var _iterator = tl._tweens[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var tween = _step.value;
            var target = tween._target;
            if (target == this || tween.passive) {
              continue
            } // TODO: this assumes actions tween has this as the target. Valid?
            var offset = tween._stepPosition;
            if (target instanceof createjs.DisplayObject) {
              // motion tween.
              this._addManagedChild(target, offset)
            } else {
              // state tween.
              this._setState(target.state, offset)
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return()
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError
            }
          }
        }
        var kids = this.children;
        for (var i = kids.length - 1; i >= 0; i--) {
          var id = kids[i].id;
          if (this._managed[id] == 1) {
            this.removeChildAt(i);
            delete this._managed[id]
          }
        }
      }
    }, {
      key: "_setState",
      value: function _setState(state, offset) {
        if (!state) {
          return
        }
        for (var i = state.length - 1; i >= 0; i--) {
          var o = state[i];
          var target = o.t;
          var props = o.p;
          for (var n in props) {
            target[n] = props[n]
          }
          this._addManagedChild(target, offset)
        }
      }
    }, {
      key: "_addManagedChild",
      value: function _addManagedChild(child, offset) {
        if (child._off) {
          return
        }
        this.addChildAt(child, 0);
        if (child instanceof MovieClip) {
          child._synchOffset = offset;
          // TODO: this does not precisely match Adobe Flash/Animate, which loses track of the clip if it is renamed or removed from the timeline, which causes it to reset.
          if (child.mode == MovieClip.INDEPENDENT && child.autoReset && !this._managed[child.id]) {
            child._reset()
          }
        }
        this._managed[child.id] = 2
      }
    }, {
      key: "_getBounds",
      value: function _getBounds(matrix, ignoreTransform) {
        var bounds = this.getBounds();
        if (!bounds) {
          this._updateTimeline();
          if (this.frameBounds) {
            bounds = this._rectangle.copy(this.frameBounds[this.currentFrame])
          }
        }
        if (bounds) {
          return this._transformBounds(bounds, matrix, ignoreTransform)
        }
        return get$1(MovieClip.prototype.__proto__ || Object.getPrototypeOf(MovieClip.prototype), "_getBounds", this).call(this, matrix, ignoreTransform)
      }
    }, {
      key: "labels",
      // accessor properties:
      /**
       * Returns an array of objects with label and position (aka frame) properties, sorted by position.
       * Shortcut to TweenJS: Timeline.getLabels();
       * @property labels
       * @type {Array}
       * @readonly
       */
      get: function get() {
        return this.timeline.getLabels()
      }
    }, {
      key: "currentLabel",
      get: function get() {
        this._updateTimeline();
        return this.timeline.getCurrentLabel()
      }
    }, {
      key: "duration",
      get: function get() {
        return this.timeline.duration
      }
    }, {
      key: "totalFrames",
      get: function get() {
        return this.duration
      }
    }], [{
      key: "init",
      value: function init() {
        if (MovieClip.inited) {
          return
        }
        // plugins introduce some overhead to Tween, so we only install this if an MC is instantiated.
        MovieClipPlugin.install();
        MovieClip.inited = true
      }
    }]);
    return MovieClip
  }(Container); {
    MovieClip.INDEPENDENT = "independent";
    MovieClip.SINGLE_FRAME = "single";
    MovieClip.SYNCHED = "synched";
    MovieClip.inited = false
  }
  /**
   * This plugin works with <a href="http://tweenjs.com" target="_blank">TweenJS</a> to prevent the startPosition
   * property from tweening.
   * @private
   * @class MovieClipPlugin
   */
  var MovieClipPlugin = function () {
    /**
     * @constructor
     */
    function MovieClipPlugin() {
      classCallCheck(this, MovieClipPlugin);
      throw "MovieClipPlugin cannot be instantiated."
    }
    /**
     * @method install
     * @private
     */
    createClass(MovieClipPlugin, null, [{
      key: "install",
      value: function install() {
        Tween.installPlugin(MovieClipPlugin, ["startPosition"])
      }
    }, {
      key: "init",
      value: function init(tween, prop, value) {
        return value
      }
    }, {
      key: "tween",
      value: function tween(_tween, prop, value, startValues, endValues, ratio, wait, end) {
        if (!(_tween.target instanceof MovieClip)) {
          return value
        }
        return ratio == 1 ? endValues[prop] : startValues[prop]
      }
    }]);
    return MovieClipPlugin
  }(); {
    MovieClipPlugin.priority = 100
  }
  /**
   * This class encapsulates the properties required to define a shadow to apply to a {{#crossLink "DisplayObject"}}{{/crossLink}}
   * via its <code>shadow</code> property.
   *
   * <h4>Example</h4>
   *
   *      myImage.shadow = new createjs.Shadow("#000000", 5, 5, 10);
   *
   * @class Shadow
   */
  var Shadow$1 = function () {
    // constructor:
    /**
     * @constructor
     * @param {String} color The color of the shadow. This can be any valid CSS color value.
     * @param {Number} offsetX The x offset of the shadow in pixels.
     * @param {Number} offsetY The y offset of the shadow in pixels.
     * @param {Number} blur The size of the blurring effect.
     */
    function Shadow() {
      var color = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "black";
      var offsetX = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var offsetY = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var blur = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
      classCallCheck(this, Shadow);
      // public properties:
      /**
       * The color of the shadow. This can be any valid CSS color value.
       * @property color
       * @type String
       * @default black
       */
      this.color = color;
      /** The x offset of the shadow.
       * @property offsetX
       * @type Number
       * @default 0
       */
      this.offsetX = offsetX;
      /** The y offset of the shadow.
       * @property offsetY
       * @type Number
       * @default 0
       */
      this.offsetY = offsetY;
      /** The blur of the shadow.
       * @property blur
       * @type Number
       * @default 0
       */
      this.blur = blur
    }
    // public methods:
    /**
     * Returns a string representation of this object.
     * @method toString
     * @return {String} a string representation of the instance.
     */
    createClass(Shadow, [{
      key: "toString",
      value: function toString() {
        return "[Shadow]"
      }
    }, {
      key: "clone",
      value: function clone() {
        return new Shadow(this.color, this.offsetX, this.offsetY, this.blur)
      }
    }]);
    return Shadow
  }(); {
    Shadow$1.identity = new Shadow$1("transparent")
  }
  /**
   * A Shape allows you to display vector art in the display list. It composites a {{#crossLink "Graphics"}}{{/crossLink}}
   * instance which exposes all of the vector drawing methods. The Graphics instance can be shared between multiple Shape
   * instances to display the same vector graphics with different positions or transforms.
   *
   * If the vector art will not
   * change between draws, you may want to use the {{#crossLink "DisplayObject/cache"}}{{/crossLink}} method to reduce the
   * rendering cost.
   *
   * <h4>Example</h4>
   *
   *      var graphics = new createjs.Graphics().beginFill("#ff0000").drawRect(0, 0, 100, 100);
   *      var shape = new createjs.Shape(graphics);
   *
   *      //Alternatively use can also use the graphics property of the Shape class to renderer the same as above.
   *      var shape = new createjs.Shape();
   *      shape.graphics.beginFill("#ff0000").drawRect(0, 0, 100, 100);
   *
   * @class Shape
   * @extends DisplayObject
   */
  var Shape = function (_DisplayObject) {
    inherits(Shape, _DisplayObject);
    // constructor:
    /**
     * @constructor
     * @param {Graphics} [graphics=Graphics] Optional. The graphics instance to display. If null, a new Graphics instance will be created.
     */
    function Shape() {
      var graphics = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Graphics;
      classCallCheck(this, Shape);
      // public properties:
      /**
       * The graphics instance to display.
       * @property graphics
       * @type Graphics
       */
      var _this = possibleConstructorReturn(this, (Shape.__proto__ || Object.getPrototypeOf(Shape)).call(this));
      _this.graphics = graphics;
      return _this
    }
    // public methods:
    /**
     * Returns true or false indicating whether the Shape would be visible if drawn to a canvas.
     * This does not account for whether it would be visible within the boundaries of the stage.
     * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
     * @method isVisible
     * @return {Boolean} Boolean indicating whether the Shape would be visible if drawn to a canvas
     */
    createClass(Shape, [{
      key: "isVisible",
      value: function isVisible() {
        var hasContent = this.cacheCanvas || this.graphics && !this.graphics.isEmpty();
        return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent)
      }
    }, {
      key: "draw",
      value: function draw(ctx) {
        var ignoreCache = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        if (get$1(Shape.prototype.__proto__ || Object.getPrototypeOf(Shape.prototype), "draw", this).call(this, ctx, ignoreCache)) {
          return true
        }
        this.graphics.draw(ctx, this);
        return true
      }
    }, {
      key: "clone",
      value: function clone() {
        var recursive = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        var g = recursive && this.graphics ? this.graphics.clone() : this.graphics;
        return this._cloneProps(new Shape(g))
      }
    }]);
    return Shape
  }(DisplayObject);
  /**
   * Encapsulates the properties and methods associated with a sprite sheet. A sprite sheet is a series of images (usually
   * animation frames) combined into a larger image (or images). For example, an animation consisting of eight 100x100
   * images could be combined into a single 400x200 sprite sheet (4 frames across by 2 high).
   *
   * The data passed to the SpriteSheet constructor defines:
   * <ol>
   * 	<li> The source image or images to use.</li>
   * 	<li> The positions of individual image frames.</li>
   * 	<li> Sequences of frames that form named animations. Optional.</li>
   * 	<li> The target playback framerate. Optional.</li>
   * </ol>
   * <h3>SpriteSheet Format</h3>
   * SpriteSheets are an object with two required properties (`images` and `frames`), and two optional properties
   * (`framerate` and `animations`). This makes them easy to define in javascript code, or in JSON.
   *
   * <h4>images</h4>
   * An array of source images. Images can be either an HTMlimage
   * instance, or a uri to an image. The former is recommended to control preloading.
   *
   * 	images: [image1, "path/to/image2.png"],
   *
   * <h4>frames</h4>
   * Defines the individual frames. There are two supported formats for frame data:
   * When all of the frames are the same size (in a grid), use an object with `width`, `height`, `regX`, `regY`,
   * and `count` properties.
   *
   * <ul>
   *  <li>`width` & `height` are required and specify the dimensions of the frames</li>
   *  <li>`regX` & `regY` indicate the registration point or "origin" of the frames</li>
   *  <li>`spacing` indicate the spacing between frames</li>
   *  <li>`margin` specify the margin around the image(s)</li>
   *  <li>`count` allows you to specify the total number of frames in the spritesheet; if omitted, this will
   *  be calculated based on the dimensions of the source images and the frames. Frames will be assigned
   *  indexes based on their position in the source images (left to right, top to bottom).</li>
   * </ul>
   *
   *  	frames: {width:64, height:64, count:20, regX: 32, regY:64, spacing:0, margin:0}
   *
   * If the frames are of different sizes, use an array of frame definitions. Each definition is itself an array
   * with 4 required and 3 optional entries, in the order:
   *
   * <ul>
   *  <li>The first four, `x`, `y`, `width`, and `height` are required and define the frame rectangle.</li>
   *  <li>The fifth, `imageIndex`, specifies the index of the source image (defaults to 0)</li>
   *  <li>The last two, `regX` and `regY` specify the registration point of the frame</li>
   * </ul>
   *
   * 	frames: [
   * 		// x, y, width, height, imageIndex*, regX*, regY*
   * 		[64, 0, 96, 64],
   * 		[0, 0, 64, 64, 1, 32, 32]
   * 		// etc.
   * 	]
   *
   * <h4>animations</h4>
   * Optional. An object defining sequences of frames to play as named animations. Each property corresponds to an
   * animation of the same name. Each animation must specify the frames to play, and may
   * also include a relative playback `speed` (ex. 2 would playback at double speed, 0.5 at half), and
   * the name of the `next` animation to sequence to after it completes.
   *
   * There are three formats supported for defining the frames in an animation, which can be mixed and matched as appropriate:
   * <ol>
   * 	<li>for a single frame animation, you can simply specify the frame index
   *
   * 		animations: {
   * 			sit: 7
   * 		}
   *
   * </li>
   * <li>
   *      for an animation of consecutive frames, you can use an array with two required, and two optional entries
   * 		in the order: `start`, `end`, `next`, and `speed`. This will play the frames from start to end inclusive.
   *
   * 		animations: {
   * 			// start, end, next*, speed*
   * 			run: [0, 8],
   * 			jump: [9, 12, "run", 2]
   * 		}
   *
   *  </li>
   *  <li>
   *     for non-consecutive frames, you can use an object with a `frames` property defining an array of frame
   *     indexes to play in order. The object can also specify `next` and `speed` properties.
   *
   * 		animations: {
   * 			walk: {
   * 				frames: [1,2,3,3,2,1]
   * 			},
   * 			shoot: {
   * 				frames: [1,4,5,6],
   * 				next: "walk",
   * 				speed: 0.5
   * 			}
   * 		}
   *
   *  </li>
   * </ol>
   * <strong>Note:</strong> the `speed` property was added in EaselJS 0.7.0. Earlier versions had a `frequency`
   * property instead, which was the inverse of `speed`. For example, a value of "4" would be 1/4 normal speed in
   * earlier versions, but is 4x normal speed in EaselJS 0.7.0+.
   *
   * <h4>framerate</h4>
   * Optional. Indicates the default framerate to play this spritesheet at in frames per second. See
   * {{#crossLink "SpriteSheet/framerate:property"}}{{/crossLink}} for more information.
   *
   * 		framerate: 20
   *
   * Note that the Sprite framerate will only work if the stage update method is provided with the {{#crossLink "Ticker/tick:event"}}{{/crossLink}}
   * event generated by the {{#crossLink "Ticker"}}{{/crossLink}}.
   *
   * 		createjs.Ticker.on("tick", handleTick);
   * 		function handleTick(event) {
   *			stage.update(event);
   *		}
   *
   * <h3>Example</h3>
   * To define a simple sprite sheet, with a single image "sprites.jpg" arranged in a regular 50x50 grid with three
   * animations: "stand" showing the first frame, "run" looping frame 1-5 inclusive, and "jump" playing frame 6-8 and
   * sequencing back to run.
   *
   * 		var data = {
   * 			images: ["sprites.jpg"],
   * 			frames: {width:50, height:50},
   * 			animations: {
   * 				stand:0,
   * 				run:[1,5],
   * 				jump:[6,8,"run"]
   * 			}
   * 		};
   * 		var spriteSheet = new createjs.SpriteSheet(data);
   * 		var animation = new createjs.Sprite(spriteSheet, "run");
   *
   * <h3>Generating SpriteSheet Images</h3>
   * Spritesheets can be created manually by combining images in PhotoShop, and specifying the frame size or
   * coordinates manually, however there are a number of tools that facilitate this.
   * <ul>
   *     <li>Exporting SpriteSheets or HTML5 content from Adobe Flash/Animate supports the EaselJS SpriteSheet format.</li>
   *     <li>The popular <a href="https://www.codeandweb.com/texturepacker/easeljs" target="_blank">Texture Packer</a> has
   *     EaselJS support.
   *     <li>SWF animations in Adobe Flash/Animate can be exported to SpriteSheets using <a href="http://createjs.com/zoe" target="_blank"></a></li>
   * </ul>
   *
   * <h3>Cross Origin Issues</h3>
   * <strong>Warning:</strong> Images loaded cross-origin will throw cross-origin security errors when interacted with
   * using:
   * <ul>
   *     <li>a mouse</li>
   *     <li>methods such as {{#crossLink "Container/getObjectUnderPoint"}}{{/crossLink}}</li>
   *     <li>Filters (see {{#crossLink "Filter"}}{{/crossLink}})</li>
   *     <li>caching (see {{#crossLink "DisplayObject/cache"}}{{/crossLink}})</li>
   * </ul>
   * You can get around this by setting `crossOrigin` property on your images before passing them to EaselJS, or
   * setting the `crossOrigin` property on PreloadJS' LoadQueue or LoadItems.
   *
   * 		var image = new Image();
   * 		img.crossOrigin="Anonymous";
   * 		img.src = "http://server-with-CORS-support.com/path/to/image.jpg";
   *
   * If you pass string paths to SpriteSheets, they will not work cross-origin. The server that stores the image must
   * support cross-origin requests, or this will not work. For more information, check out
   * <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS" target="_blank">CORS overview on MDN</a>.
   *
   * @class SpriteSheet
   * @extends EventDispatcher
   */
  var SpriteSheet = function (_EventDispatcher) {
    inherits(SpriteSheet, _EventDispatcher);
    // constructor:
    /**
     * @constructor
     * @param {Object} data An object describing the SpriteSheet data.
     */
    function SpriteSheet(data) {
      classCallCheck(this, SpriteSheet);
      // public properties:
      /**
       * Indicates whether all images are finished loading.
       * @property complete
       * @type Boolean
       * @readonly
       */
      var _this = possibleConstructorReturn(this, (SpriteSheet.__proto__ || Object.getPrototypeOf(SpriteSheet)).call(this));
      _this.complete = true;
      /**
       * Specifies the framerate to use by default for Sprite instances using the SpriteSheet. See the Sprite class
       * {{#crossLink "Sprite/framerate:property"}}{{/crossLink}} for more information.
       * @property framerate
       * @type Number
       */
      _this.framerate = 0;
      // private properties:
      /**
       * @property _animations
       * @protected
       * @type Array
       */
      _this._animations = null;
      /**
       * @property _frames
       * @protected
       * @type Array
       */
      _this._frames = null;
      /**
       * @property _images
       * @protected
       * @type Array
       */
      _this._images = null;
      /**
       * @property _data
       * @protected
       * @type Object
       */
      _this._data = null;
      /**
       * @property _loadCount
       * @protected
       * @type Number
       */
      _this._loadCount = 0;
      // only used for simple frame defs:
      /**
       * @property _frameHeight
       * @protected
       * @type Number
       */
      _this._frameHeight = 0;
      /**
       * @property _frameWidth
       * @protected
       * @type Number
       */
      _this._frameWidth = 0;
      /**
       * @property _numFrames
       * @protected
       * @type Number
       */
      _this._numFrames = 0;
      /**
       * @property _regX
       * @protected
       * @type Number
       */
      _this._regX = 0;
      /**
       * @property _regY
       * @protected
       * @type Number
       */
      _this._regY = 0;
      /**
       * @property _spacing
       * @protected
       * @type Number
       */
      _this._spacing = 0;
      /**
       * @property _margin
       * @protected
       * @type Number
       */
      _this._margin = 0;
      _this._parseData(data);
      return _this
    }
    // accessor properties:
    /**
     * Returns an array of all available animation names available on this sprite sheet as strings.
     * @property animations
     * @type {Array}
     * @readonly
     */
    createClass(SpriteSheet, [{
      key: "getNumFrames",
      // public methods:
      /**
       * Returns the total number of frames in the specified animation, or in the whole sprite
       * sheet if the animation param is omitted. Returns 0 if the spritesheet relies on calculated frame counts, and
       * the images have not been fully loaded.
       * @method getNumFrames
       * @param {String} animation The name of the animation to get a frame count for.
       * @return {Number} The number of frames in the animation, or in the entire sprite sheet if the animation param is omitted.
       */
      value: function getNumFrames(animation) {
        if (animation == null) {
          return this._frames ? this._frames.length : this._numFrames || 0
        } else {
          var data = this._data[animation];
          if (data == null) {
            return 0
          } else {
            return data.frames.length
          }
        }
      }
    }, {
      key: "getAnimation",
      value: function getAnimation(name) {
        return this._data[name]
      }
    }, {
      key: "getFrame",
      value: function getFrame(frameIndex) {
        var frame = void 0;
        if (this._frames && (frame = this._frames[frameIndex])) {
          return frame
        }
        return null
      }
    }, {
      key: "getFrameBounds",
      value: function getFrameBounds(frameIndex) {
        var rectangle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Rectangle;
        var frame = this.getFrame(frameIndex);
        return frame ? rectangle.setValues(-frame.regX, -frame.regY, frame.rect.width, frame.rect.height) : null
      }
    }, {
      key: "toString",
      value: function toString() {
        return "[SpriteSheet]"
      }
    }, {
      key: "clone",
      value: function clone() {
        // TODO-ES6: Add throw docs
        throw "SpriteSheet cannot be cloned."
      }
    }, {
      key: "_parseData",
      value: function _parseData(data) {
        var _this2 = this;
        if (data == null) {
          return
        }
        this.framerate = data.framerate || 0;
        // parse images:
        if (data.images) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;
          try {
            for (var _iterator = data.images[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var img = _step.value;
              var a = this._images = [];
              if (typeof img == "string") {
                var _src = img;
                img = document.createElement("img");
                img.src = _src
              }
              a.push(img);
              if (!img.getContext && !img.naturalWidth) {
                this._loadCount++;
                this.complete = false;
                img.onload = function () {
                  return _this2._handleImadeLoad(src)
                };
                img.onerror = function () {
                  return _this2._handleImageError(src)
                }
              }
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return()
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError
              }
            }
          }
        }
        // parse frames:
        if (data.frames != null) {
          if (Array.isArray(data.frames)) {
            this._frames = [];
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;
            try {
              for (var _iterator2 = data.frames[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var arr = _step2.value;
                this._frames.push({
                  image: this._images[arr[4] ? arr[4] : 0],
                  rect: new Rectangle(arr[0], arr[1], arr[2], arr[3]),
                  regX: arr[5] || 0,
                  regY: arr[6] || 0
                })
              }
            } catch (err) {
              _didIteratorError2 = true;
              _iteratorError2 = err
            } finally {
              try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return()
                }
              } finally {
                if (_didIteratorError2) {
                  throw _iteratorError2
                }
              }
            }
          } else {
            var o = data.frames;
            this._frameWidth = o.width;
            this._frameHeight = o.height;
            this._regX = o.regX || 0;
            this._regY = o.regY || 0;
            this._spacing = o.spacing || 0;
            this._margin = o.margin || 0;
            this._numFrames = o.count;
            if (this._loadCount == 0) {
              this._calculateFrames()
            }
          }
        }
        // parse animations:
        this._animations = [];
        if (data.animations != null) {
          this._data = {};
          var _o = data.animations;
          for (var name in _o) {
            var anim = {
              name: name
            };
            var obj = _o[name];
            var _a = void 0;
            if (typeof obj == "number") {
              // single frame
              _a = anim.frames = [obj]
            } else if (Array.isArray(obj)) {
              // simple
              if (obj.length == 1) {
                anim.frames = [obj[0]]
              } else {
                anim.speed = obj[3];
                anim.next = obj[2];
                _a = anim.frames = [];
                for (var i = obj[0]; i <= obj[1]; i++) {
                  _a.push(i)
                }
              }
            } else {
              // complex
              anim.speed = obj.speed;
              anim.next = obj.next;
              var frames = obj.frames;
              _a = anim.frames = typeof frames == "number" ? [frames] : frames.slice(0)
            }
            if (anim.next === true || anim.next === undefined) {
              anim.next = name
            } // loop
            if (anim.next === false || _a.length < 2 && anim.next == name) {
              anim.next = null
            } // stop
            if (!anim.speed) {
              anim.speed = 1
            }
            this._animations.push(name);
            this._data[name] = anim
          }
        }
      }
    }, {
      key: "_handleImageLoad",
      value: function _handleImageLoad(src) {
        if (--this._loadCount == 0) {
          this._calculateFrames();
          this.complete = true;
          this.dispatchEvent("complete")
        }
      }
    }, {
      key: "_handleImageError",
      value: function _handleImageError(src) {
        var errorEvent = new Event("error");
        errorEvent.src = src;
        this.dispatchEvent(errorEvent);
        // Complete is still dispatched.
        if (--this._loadCount == 0) {
          this.dispatchEvent("complete")
        }
      }
    }, {
      key: "_calculateFrames",
      value: function _calculateFrames() {
        if (this._frames || this._frameWidth == 0) {
          return
        }
        this._frames = [];
        var maxFrames = this._numFrames || 1e5; // if we go over this, something is wrong.
        var frameCount = 0,
          frameWidth = this._frameWidth,
          frameHeight = this._frameHeight;
        var spacing = this._spacing,
          margin = this._margin;
        imgLoop: for (var i = 0, imgs = this._images, l = imgs.length; i < l; i++) {
          var img = imgs[i],
            imgW = img.width,
            imgH = img.height;
          var y = margin;
          while (y <= imgH - margin - frameHeight) {
            var x = margin;
            while (x <= imgW - margin - frameWidth) {
              if (frameCount >= maxFrames) {
                break imgLoop
              }
              frameCount++;
              this._frames.push({
                image: img,
                rect: new Rectangle(x, y, frameWidth, frameHeight),
                regX: this._regX,
                regY: this._regY
              });
              x += frameWidth + spacing
            }
            y += frameHeight + spacing
          }
        }
        this._numFrames = frameCount
      }
    }, {
      key: "animations",
      get: function get() {
        return this._animations.slice()
      }
    }]);
    return SpriteSheet
  }(EventDispatcher);
  /**
   * Passed as the parameter to all mouse/pointer/touch related events. For a listing of mouse events and their properties,
   * see the {{#crossLink "DisplayObject"}}{{/crossLink}} and {{#crossLink "Stage"}}{{/crossLink}} event listings.
   * @class MouseEvent
   * @extends Event
   */
  var MouseEvent = function (_Event) {
    inherits(MouseEvent, _Event);
    // constructor:
    /**
     * @constructor
     * @param {String} type The event type.
     * @param {Boolean} bubbles Indicates whether the event will bubble through the display list.
     * @param {Boolean} cancelable Indicates whether the default behaviour of this event can be cancelled.
     * @param {Number} stageX The normalized x position relative to the stage.
     * @param {Number} stageY The normalized y position relative to the stage.
     * @param {MouseEvent} nativeEvent The native DOM event related to this mouse event.
     * @param {Number} pointerID The unique id for the pointer.
     * @param {Boolean} primary Indicates whether this is the primary pointer in a multitouch environment.
     * @param {Number} rawX The raw x position relative to the stage.
     * @param {Number} rawY The raw y position relative to the stage.
     * @param {DisplayObject} relatedTarget The secondary target for the event.
     */
    function MouseEvent(type, bubbles, cancelable, stageX, stageY, nativeEvent, pointerID, primary, rawX, rawY, relatedTarget) {
      classCallCheck(this, MouseEvent);
      // public properties:
      /**
       * The normalized x position on the stage. This will always be within the range 0 to stage width.
       * @property stageX
       * @type Number
       */
      var _this = possibleConstructorReturn(this, (MouseEvent.__proto__ || Object.getPrototypeOf(MouseEvent)).call(this, type, bubbles, cancelable));
      _this.stageX = stageX;
      /**
       * The normalized y position on the stage. This will always be within the range 0 to stage height.
       * @property stageY
       * @type Number
       */
      _this.stageY = stageY;
      /**
       * The raw x position relative to the stage. Normally this will be the same as the stageX value, unless
       * stage.mouseMoveOutside is true and the pointer is outside of the stage bounds.
       * @property rawX
       * @type Number
       */
      _this.rawX = rawX == null ? stageX : rawX;
      /**
       * The raw y position relative to the stage. Normally this will be the same as the stageY value, unless
       * stage.mouseMoveOutside is true and the pointer is outside of the stage bounds.
       * @property rawY
       * @type Number
       */
      _this.rawY = rawY == null ? stageY : rawY;
      /**
       * The native MouseEvent generated by the browser. The properties and API for this
       * event may differ between browsers. This property will be null if the
       * EaselJS property was not directly generated from a native MouseEvent.
       * @property nativeEvent
       * @type HtmlMouseEvent
       * @default null
       */
      _this.nativeEvent = nativeEvent;
      /**
       * The unique id for the pointer (touch point or cursor). This will be either -1 for the mouse, or the system
       * supplied id value.
       * @property pointerID
       * @type {Number}
       */
      _this.pointerID = pointerID;
      /**
       * Indicates whether this is the primary pointer in a multitouch environment. This will always be true for the mouse.
       * For touch pointers, the first pointer in the current stack will be considered the primary pointer.
       * @property primary
       * @type {Boolean}
       */
      _this.primary = !!primary;
      /**
       * The secondary target for the event, if applicable. This is used for mouseout/rollout
       * events to indicate the object that the mouse entered from, mouseover/rollover for the object the mouse exited,
       * and stagemousedown/stagemouseup events for the object that was the under the cursor, if any.
       *
       * Only valid interaction targets will be returned (ie. objects with mouse listeners or a cursor set).
       * @property relatedTarget
       * @type {DisplayObject}
       */
      _this.relatedTarget = relatedTarget;
      return _this
    }
    // accessor properties:
    /**
     * Returns the x position of the mouse in the local coordinate system of the current target (ie. the dispatcher).
     * @property localX
     * @type {Number}
     * @readonly
     */
    createClass(MouseEvent, [{
      key: "clone",
      // public methods:
      /**
       * Returns a clone of the MouseEvent instance.
       * @method clone
       * @return {MouseEvent} a clone of the MouseEvent instance.
       */
      value: function clone() {
        return new MouseEvent(this.type, this.bubbles, this.cancelable, this.stageX, this.stageY, this.nativeEvent, this.pointerID, this.primary, this.rawX, this.rawY)
      }
    }, {
      key: "toString",
      value: function toString() {
        return "[MouseEvent (type=" + this.type + " stageX=" + this.stageX + " stageY=" + this.stageY + ")]"
      }
    }, {
      key: "localX",
      get: function get() {
        return this.currentTarget.globalToLocal(this.rawX, this.rawY).x
      }
    }, {
      key: "localY",
      get: function get() {
        return this.currentTarget.globalToLocal(this.rawX, this.rawY).y
      }
    }, {
      key: "isTouch",
      get: function get() {
        return this.pointerID !== -1
      }
    }]);
    return MouseEvent
  }(Event);
  /**
   * A stage is the root level {{#crossLink "Container"}}{{/crossLink}} for a display list. Each time its {{#crossLink "Stage/tick"}}{{/crossLink}}
   * method is called, it will render its display list to its target canvas.
   *
   * <h4>Example</h4>
   * This example creates a stage, adds a child to it, then uses {{#crossLink "Ticker"}}{{/crossLink}} to update the child
   * and redraw the stage using {{#crossLink "Stage/update"}}{{/crossLink}}.
   *
   *      var stage = new createjs.Stage("canvasElementId");
   *      var image = new createjs.Bitmap("imagePath.png");
   *      stage.addChild(image);
   *      createjs.Ticker.addEventListener("tick", handleTick);
   *      function handleTick(event) {
   *          image.x += 10;
   *          stage.update();
   *      }
   *
   * @class Stage
   * @extends Container
   */
  var Stage = function (_Container) {
    inherits(Stage, _Container);
    // constructor:
    /**
     * @constructor
     * @param {HTMLCanvasElement | String | Object} canvas A canvas object that the Stage will render to, or the string id
     * of a canvas object in the current document.
     */
    function Stage(canvas) {
      classCallCheck(this, Stage);
      // public properties:
      /**
       * Indicates whether the stage should automatically clear the canvas before each render. You can set this to <code>false</code>
       * to manually control clearing (for generative art, or when pointing multiple stages at the same canvas for
       * example).
       *
       * <h4>Example</h4>
       *
       *      var stage = new createjs.Stage("canvasId");
       *      stage.autoClear = false;
       *
       * @property autoClear
       * @type Boolean
       * @default true
       */
      var _this = possibleConstructorReturn(this, (Stage.__proto__ || Object.getPrototypeOf(Stage)).call(this));
      _this.autoClear = true;
      /**
       * The canvas the stage will render to. Multiple stages can share a single canvas, but you must disable autoClear for all but the
       * first stage that will be ticked (or they will clear each other's render).
       *
       * When changing the canvas property you must disable the events on the old canvas, and enable events on the
       * new canvas or mouse events will not work as expected. For example:
       *
       *      myStage.enableDOMEvents(false);
       *      myStage.canvas = anotherCanvas;
       *      myStage.enableDOMEvents(true);
       *
       * @property canvas
       * @type HTMLCanvasElement | Object
       */
      _this.canvas = typeof canvas == "string" ? document.getElementById(canvas) : canvas;
      /**
       * The current mouse X position on the canvas. If the mouse leaves the canvas, this will indicate the most recent
       * position over the canvas, and mouseInBounds will be set to false.
       * @property mouseX
       * @type Number
       * @readonly
       */
      _this.mouseX = 0;
      /**
       * The current mouse Y position on the canvas. If the mouse leaves the canvas, this will indicate the most recent
       * position over the canvas, and mouseInBounds will be set to false.
       * @property mouseY
       * @type Number
       * @readonly
       */
      _this.mouseY = 0;
      /**
       * Specifies the area of the stage to affect when calling update. This can be use to selectively
       * re-draw specific regions of the canvas. If null, the whole canvas area is drawn.
       * @property drawRect
       * @type {Rectangle}
       */
      _this.drawRect = null;
      /**
       * Indicates whether display objects should be rendered on whole pixels. You can set the
       * {{#crossLink "DisplayObject/snapToPixel"}}{{/crossLink}} property of
       * display objects to false to enable/disable this behaviour on a per instance basis.
       * @property snapToPixelEnabled
       * @type Boolean
       * @default false
       */
      _this.snapToPixelEnabled = false;
      /**
       * Indicates whether the mouse is currently within the bounds of the canvas.
       * @property mouseInBounds
       * @type Boolean
       * @default false
       */
      _this.mouseInBounds = false;
      /**
       * If true, tick callbacks will be called on all display objects on the stage prior to rendering to the canvas.
       * @property tickOnUpdate
       * @type Boolean
       * @default true
       */
      _this.tickOnUpdate = true;
      /**
       * If true, mouse move events will continue to be called when the mouse leaves the target canvas. See
       * {{#crossLink "Stage/mouseInBounds:property"}}{{/crossLink}}, and {{#crossLink "MouseEvent"}}{{/crossLink}}
       * x/y/rawX/rawY.
       * @property mouseMoveOutside
       * @type Boolean
       * @default false
       */
      _this.mouseMoveOutside = false;
      /**
       * Prevents selection of other elements in the html page if the user clicks and drags, or double clicks on the canvas.
       * This works by calling `preventDefault()` on any mousedown events (or touch equivalent) originating on the canvas.
       * @property preventSelection
       * @type Boolean
       * @default true
       */
      _this.preventSelection = true;
      /**
       * The hitArea property is not supported for Stage.
       * @property hitArea
       * @type {DisplayObject}
       * @default null
       */
      // private properties:
      /**
       * Holds objects with data for each active pointer id. Each object has the following properties:
       * x, y, event, target, overTarget, overX, overY, inBounds, posEvtObj (native event that last updated position)
       * @property _pointerData
       * @type {Object}
       * @private
       */
      _this._pointerData = {};
      /**
       * Number of active pointers.
       * @property _pointerCount
       * @type {Object}
       * @private
       */
      _this._pointerCount = 0;
      /**
       * The ID of the primary pointer.
       * @property _primaryPointerID
       * @type {Object}
       * @private
       */
      _this._primaryPointerID = null;
      /**
       * @property _mouseOverIntervalID
       * @protected
       * @type Number
       */
      _this._mouseOverIntervalID = null;
      /**
       * @property _nextStage
       * @protected
       * @type Stage
       */
      _this._nextStage = null;
      /**
       * @property _prevStage
       * @protected
       * @type Stage
       */
      _this._prevStage = null;
      _this.enableDOMEvents(true);
      return _this
    }
    // accessor properties:
    /**
     * Specifies a target stage that will have mouse / touch interactions relayed to it after this stage handles them.
     * This can be useful in cases where you have multiple layered canvases and want user interactions
     * events to pass through. For example, this would relay mouse events from topStage to bottomStage:
     *
     *      topStage.nextStage = bottomStage;
     *
     * To disable relaying, set nextStage to null.
     *
     * MouseOver, MouseOut, RollOver, and RollOut interactions are also passed through using the mouse over settings
     * of the top-most stage, but are only processed if the target stage has mouse over interactions enabled.
     * Considerations when using roll over in relay targets:<OL>
     * <LI> The top-most (first) stage must have mouse over interactions enabled (via enableMouseOver)</LI>
     * <LI> All stages that wish to participate in mouse over interaction must enable them via enableMouseOver</LI>
     * <LI> All relay targets will share the frequency value of the top-most stage</LI>
     * </OL>
     * To illustrate, in this example the targetStage would process mouse over interactions at 10hz (despite passing
     * 30 as it's desired frequency):
     * 	topStage.nextStage = targetStage;
     * 	topStage.enableMouseOver(10);
     * 	targetStage.enableMouseOver(30);
     *
     * If the target stage's canvas is completely covered by this stage's canvas, you may also want to disable its
     * DOM events using:
     *
     *	targetStage.enableDOMEvents(false);
     *
     * @property nextStage
     * @type {Stage}
     */
    createClass(Stage, [{
      key: "update",
      // public methods:
      /**
       * Each time the update method is called, the stage will call {{#crossLink "Stage/tick"}}{{/crossLink}}
       * unless {{#crossLink "Stage/tickOnUpdate:property"}}{{/crossLink}} is set to false,
       * and then render the display list to the canvas.
       *
       * @method update
       * @param {Object} [props] Props object to pass to `tick()`. Should usually be a {{#crossLink "Ticker"}}{{/crossLink}} event object, or similar object with a delta property.
       */
      value: function update(props) {
        if (!this.canvas) {
          return
        }
        if (this.tickOnUpdate) {
          this.tick(props)
        }
        if (this.dispatchEvent("drawstart", false, true) === false) {
          return
        }
        DisplayObject._snapToPixelEnabled = this.snapToPixelEnabled;
        var r = this.drawRect,
          ctx = this.canvas.getContext("2d");
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        if (this.autoClear) {
          if (r) {
            ctx.clearRect(r.x, r.y, r.width, r.height)
          } else {
            ctx.clearRect(0, 0, this.canvas.width + 1, this.canvas.height + 1)
          }
        }
        ctx.save();
        if (this.drawRect) {
          ctx.beginPath();
          ctx.rect(r.x, r.y, r.width, r.height);
          ctx.clip()
        }
        this.updateContext(ctx);
        this.draw(ctx, false);
        ctx.restore();
        this.dispatchEvent("drawend")
      }
    }, {
      key: "tick",
      value: function tick(props) {
        if (!this.tickEnabled || this.dispatchEvent("tickstart", false, true) === false) {
          return
        }
        var evtObj = new Event("tick");
        if (props) {
          for (var n in props) {
            if (props.hasOwnProperty(n)) {
              evtObj[n] = props[n]
            }
          }
        }
        this._tick(evtObj);
        this.dispatchEvent("tickend")
      }
    }, {
      key: "handleEvent",
      value: function handleEvent(evt) {
        if (evt.type == "tick") {
          this.update(evt)
        }
      }
    }, {
      key: "clear",
      value: function clear() {
        if (!this.canvas) {
          return
        }
        var ctx = this.canvas.getContext("2d");
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, this.canvas.width + 1, this.canvas.height + 1)
      }
    }, {
      key: "toDataURL",
      value: function toDataURL(backgroundColor) {
        var mimeType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "image/png";
        var data = void 0,
          ctx = this.canvas.getContext("2d"),
          w = this.canvas.width,
          h = this.canvas.height;
        if (backgroundColor) {
          data = ctx.getImageData(0, 0, w, h);
          var compositeOperation = ctx.globalCompositeOperation;
          ctx.globalCompositeOperation = "destination-over";
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(0, 0, w, h)
        }
        var dataURL = this.canvas.toDataURL(mimeType);
        if (backgroundColor) {
          ctx.putImageData(data, 0, 0);
          ctx.globalCompositeOperation = compositeOperation
        }
        return dataURL
      }
    }, {
      key: "enableMouseOver",
      /**
       * Enables or disables (by passing a frequency of 0) mouse over ({{#crossLink "DisplayObject/mouseover:event"}}{{/crossLink}}
       * and {{#crossLink "DisplayObject/mouseout:event"}}{{/crossLink}}) and roll over events ({{#crossLink "DisplayObject/rollover:event"}}{{/crossLink}}
       * and {{#crossLink "DisplayObject/rollout:event"}}{{/crossLink}}) for this stage's display list. These events can
       * be expensive to generate, so they are disabled by default. The frequency of the events can be controlled
       * independently of mouse move events via the optional `frequency` parameter.
       *
       * <h4>Example</h4>
       *
       *      var stage = new createjs.Stage("canvasId");
       *      stage.enableMouseOver(10); // 10 updates per second
       *
       * @method enableMouseOver
       * @param {Number} [frequency=20] Optional param specifying the maximum number of times per second to broadcast
       * mouse over/out events. Set to 0 to disable mouse over events completely. Maximum is 50. A lower frequency is less
       * responsive, but uses less CPU.
       */
      value: function enableMouseOver() {
        var _this2 = this;
        var frequency = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 20;
        if (this._mouseOverIntervalID) {
          clearInterval(this._mouseOverIntervalID);
          this._mouseOverIntervalID = null;
          if (frequency == 0) {
            this._testMouseOver(true)
          }
        }
        if (frequency <= 0) {
          return
        }
        this._mouseOverIntervalID = setInterval(function () {
          return _this2._testMouseOver()
        }, 1e3 / Math.min(50, frequency))
      }
    }, {
      key: "enableDOMEvents",
      value: function enableDOMEvents() {
        var _this3 = this;
        var enable = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
        var ls = this._eventListeners;
        if (!enable && ls) {
          for (var n in ls) {
            var o = ls[n];
            o.t.removeEventListener(n, o.f, false)
          }
          this._eventListeners = null
        } else if (enable && !ls && this.canvas) {
          var t = window.addEventListener ? window : document;
          ls = this._eventListeners = {
            mouseup: {
              t: t,
              f: function f(e) {
                return _this3._handleMouseUp(e)
              }
            },
            mousemove: {
              t: t,
              f: function f(e) {
                return _this3._handleMouseMove(e)
              }
            },
            dblclick: {
              t: this.canvas,
              f: function f(e) {
                return _this3._handleDoubleClick(e)
              }
            },
            mousedown: {
              t: this.canvas,
              f: function f(e) {
                return _this3._handleMouseDown(e)
              }
            }
          };
          for (var _n in ls) {
            var _o = ls[_n];
            _o.t.addEventListener(_n, _o.f, false)
          }
        }
      }
    }, {
      key: "clone",
      value: function clone() {
        throw "Stage cannot be cloned."
      }
    }, {
      key: "_getElementRect",
      value: function _getElementRect(e) {
        var bounds = void 0;
        try {
          bounds = e.getBoundingClientRect()
        } // this can fail on disconnected DOM elements in IE9
        catch (err) {
          bounds = {
            top: e.offsetTop,
            left: e.offsetLeft,
            width: e.offsetWidth,
            height: e.offsetHeight
          }
        }
        var offX = (window.pageXOffset || document.scrollLeft || 0) - (document.clientLeft || document.body.clientLeft || 0);
        var offY = (window.pageYOffset || document.scrollTop || 0) - (document.clientTop || document.body.clientTop || 0);
        var styles = window.getComputedStyle ? getComputedStyle(e, null) : e.currentStyle; // IE <9 compatibility.
        var padL = parseInt(styles.paddingLeft) + parseInt(styles.borderLeftWidth);
        var padT = parseInt(styles.paddingTop) + parseInt(styles.borderTopWidth);
        var padR = parseInt(styles.paddingRight) + parseInt(styles.borderRightWidth);
        var padB = parseInt(styles.paddingBottom) + parseInt(styles.borderBottomWidth);
        // note: in some browsers bounds properties are read only.
        return {
          left: bounds.left + offX + padL,
          right: bounds.right + offX - padR,
          top: bounds.top + offY + padT,
          bottom: bounds.bottom + offY - padB
        }
      }
    }, {
      key: "_getPointerData",
      value: function _getPointerData(id) {
        var data = this._pointerData[id];
        if (!data) {
          data = this._pointerData[id] = {
            x: 0,
            y: 0
          }
        }
        return data
      }
    }, {
      key: "_handleMouseMove",
      value: function _handleMouseMove() {
        var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window.event;
        this._handlePointerMove(-1, e, e.pageX, e.pageY)
      }
    }, {
      key: "_handlePointerMove",
      value: function _handlePointerMove(id, e, pageX, pageY, owner) {
        if (this._prevStage && owner === undefined) {
          return
        } // redundant listener.
        if (!this.canvas) {
          return
        }
        var nextStage = this._nextStage,
          o = this._getPointerData(id);
        var inBounds = o.inBounds;
        this._updatePointerPosition(id, e, pageX, pageY);
        if (inBounds || o.inBounds || this.mouseMoveOutside) {
          if (id === -1 && o.inBounds == !inBounds) {
            this._dispatchMouseEvent(this, inBounds ? "mouseleave" : "mouseenter", false, id, o, e)
          }
          this._dispatchMouseEvent(this, "stagemousemove", false, id, o, e);
          this._dispatchMouseEvent(o.target, "pressmove", true, id, o, e)
        }
        nextStage && nextStage._handlePointerMove(id, e, pageX, pageY, null)
      }
    }, {
      key: "_updatePointerPosition",
      value: function _updatePointerPosition(id, e, pageX, pageY) {
        var rect = this._getElementRect(this.canvas);
        pageX -= rect.left;
        pageY -= rect.top;
        var w = this.canvas.width;
        var h = this.canvas.height;
        pageX /= (rect.right - rect.left) / w;
        pageY /= (rect.bottom - rect.top) / h;
        var o = this._getPointerData(id);
        if (o.inBounds = pageX >= 0 && pageY >= 0 && pageX <= w - 1 && pageY <= h - 1) {
          o.x = pageX;
          o.y = pageY
        } else if (this.mouseMoveOutside) {
          o.x = pageX < 0 ? 0 : pageX > w - 1 ? w - 1 : pageX;
          o.y = pageY < 0 ? 0 : pageY > h - 1 ? h - 1 : pageY
        }
        o.posEvtObj = e;
        o.rawX = pageX;
        o.rawY = pageY;
        if (id === this._primaryPointerID || id === -1) {
          this.mouseX = o.x;
          this.mouseY = o.y;
          this.mouseInBounds = o.inBounds
        }
      }
    }, {
      key: "_handleMouseUp",
      value: function _handleMouseUp(e) {
        this._handlePointerUp(-1, e, false)
      }
    }, {
      key: "_handlePointerUp",
      value: function _handlePointerUp(id, e, clear, owner) {
        var nextStage = this._nextStage,
          o = this._getPointerData(id);
        if (this._prevStage && owner === undefined) {
          return
        } // redundant listener.
        var target = null,
          oTarget = o.target;
        if (!owner && (oTarget || nextStage)) {
          target = this._getObjectsUnderPoint(o.x, o.y, null, true)
        }
        if (o.down) {
          this._dispatchMouseEvent(this, "stagemouseup", false, id, o, e, target);
          o.down = false
        }
        if (target == oTarget) {
          this._dispatchMouseEvent(oTarget, "click", true, id, o, e)
        }
        this._dispatchMouseEvent(oTarget, "pressup", true, id, o, e);
        if (clear) {
          if (id == this._primaryPointerID) {
            this._primaryPointerID = null
          }
          delete this._pointerData[id]
        } else {
          o.target = null
        }
        nextStage && nextStage._handlePointerUp(id, e, clear, owner || target && this)
      }
    }, {
      key: "_handleMouseDown",
      value: function _handleMouseDown(e) {
        this._handlePointerDown(-1, e, e.pageX, e.pageY)
      }
    }, {
      key: "_handlePointerDown",
      value: function _handlePointerDown(id, e, pageX, pageY, owner) {
        if (this.preventSelection) {
          e.preventDefault()
        }
        if (this._primaryPointerID == null || id === -1) {
          this._primaryPointerID = id
        } // mouse always takes over.
        if (pageY != null) {
          this._updatePointerPosition(id, e, pageX, pageY)
        }
        var target = null,
          nextStage = this._nextStage,
          o = this._getPointerData(id);
        if (!owner) {
          target = o.target = this._getObjectsUnderPoint(o.x, o.y, null, true)
        }
        if (o.inBounds) {
          this._dispatchMouseEvent(this, "stagemousedown", false, id, o, e, target);
          o.down = true
        }
        this._dispatchMouseEvent(target, "mousedown", true, id, o, e);
        nextStage && nextStage._handlePointerDown(id, e, pageX, pageY, owner || target && this)
      }
    }, {
      key: "_testMouseOver",
      value: function _testMouseOver(clear, owner, eventTarget) {
        if (this._prevStage && owner === undefined) {
          return
        } // redundant listener.
        var nextStage = this._nextStage;
        if (!this._mouseOverIntervalID) {
          // not enabled for mouseover, but should still relay the event.
          nextStage && nextStage._testMouseOver(clear, owner, eventTarget);
          return
        }
        var o = this._getPointerData(-1);
        // only update if the mouse position has changed. This provides a lot of optimization, but has some trade-offs.
        if (!o || !clear && this.mouseX == this._mouseOverX && this.mouseY == this._mouseOverY && this.mouseInBounds) {
          return
        }
        var e = o.posEvtObj;
        var isEventTarget = eventTarget || e && e.target == this.canvas;
        var target = null,
          common = -1,
          cursor = "";
        if (!owner && (clear || this.mouseInBounds && isEventTarget)) {
          target = this._getObjectsUnderPoint(this.mouseX, this.mouseY, null, true);
          this._mouseOverX = this.mouseX;
          this._mouseOverY = this.mouseY
        }
        var oldList = this._mouseOverTarget || [];
        var oldTarget = oldList[oldList.length - 1];
        var list = this._mouseOverTarget = [];
        // generate ancestor list and check for cursor:
        var t = target;
        while (t) {
          list.unshift(t);
          if (!cursor) {
            cursor = t.cursor
          }
          t = t.parent
        }
        this.canvas.style.cursor = cursor;
        if (!owner && eventTarget) {
          eventTarget.canvas.style.cursor = cursor
        }
        // find common ancestor:
        for (var i = 0, l = list.length; i < l; i++) {
          if (list[i] != oldList[i]) {
            break
          }
          common = i
        }
        if (oldTarget != target) {
          this._dispatchMouseEvent(oldTarget, "mouseout", true, -1, o, e, target)
        }
        for (var _i = oldList.length - 1; _i > common; _i--) {
          this._dispatchMouseEvent(oldList[_i], "rollout", false, -1, o, e, target)
        }
        for (var _i2 = list.length - 1; _i2 > common; _i2--) {
          this._dispatchMouseEvent(list[_i2], "rollover", false, -1, o, e, oldTarget)
        }
        if (oldTarget != target) {
          this._dispatchMouseEvent(target, "mouseover", true, -1, o, e, oldTarget)
        }
        nextStage && nextStage._testMouseOver(clear, owner || target && this, eventTarget || isEventTarget && this)
      }
    }, {
      key: "_handleDoubleClick",
      value: function _handleDoubleClick(e, owner) {
        var target = null,
          nextStage = this._nextStage,
          o = this._getPointerData(-1);
        if (!owner) {
          target = this._getObjectsUnderPoint(o.x, o.y, null, true);
          this._dispatchMouseEvent(target, "dblclick", true, -1, o, e)
        }
        nextStage && nextStage._handleDoubleClick(e, owner || target && this)
      }
    }, {
      key: "_dispatchMouseEvent",
      value: function _dispatchMouseEvent(target, type, bubbles, pointerId, o, nativeEvent, relatedTarget) {
        // TODO: might be worth either reusing MouseEvent instances, or adding a willTrigger method to avoid GC.
        if (!target || !bubbles && !target.hasEventListener(type)) {
          return
        }
        /*
           // TODO: account for stage transformations?
           this._mtx = this.getConcatenatedMatrix(this._mtx).invert();
           let pt = this._mtx.transformPoint(o.x, o.y);
           let evt = new MouseEvent(type, bubbles, false, pt.x, pt.y, nativeEvent, pointerId, pointerId==this._primaryPointerID || pointerId==-1, o.rawX, o.rawY);
           */
        var evt = new MouseEvent(type, bubbles, false, o.x, o.y, nativeEvent, pointerId, pointerId === this._primaryPointerID || pointerId === -1, o.rawX, o.rawY, relatedTarget);
        target.dispatchEvent(evt)
      }
    }, {
      key: "nextStage",
      get: function get() {
        return this._nextStage
      },
      set: function set(stage) {
        if (this._nextStage) {
          this._nextStage._prevStage = null
        }
        if (stage) {
          stage._prevStage = this
        }
        this._nextStage = stage
      }
    }]);
    return Stage
  }(Container);
  /*
   * README IF EDITING:
   * Terminology for developers:
   *
   * Vertex: a point that help defines a shape, 3 per triangle. Usually has an x,y,z but can have more/less info.
   * Vertex Property: a piece of information attached to the vertex like a vector3 containing x,y,z
   * Index/Indices: used in groups of 3 to define a triangle, points to vertices by their index in an array (some render modes do not use these)
   * Card: a group of 2 triangles used to display a rectangular image
   * U/V: common names for the [0-1] texture co-ordinates on an image
   * Batch: a single call to the renderer, best done as little as possible so multiple cards are put into a single batch
   * Buffer: WebGL array data
   * Program/Shader: For every vertex we run the Vertex shader. The results are used per pixel by the Fragment shader. When combined and paired these are a shader "program"
   * Texture: WebGL representation of image data and associated extra information
   * Slot: A space on the GPU into which textures can be loaded for use in a batch, using "ActiveTexture" switches texture slot.
   */
  /**
   * A StageGL instance is the root level {{#crossLink "Container"}}{{/crossLink}} for an WebGL-optimized display list,
   * which is used in place of the usual {{#crossLink "Stage"}}{{/crossLink}}. This class should behave identically to
   * a {{#crossLink "Stage"}}{{/crossLink}} except for WebGL-specific functionality.
   *
   * Each time the {{#crossLink "Stage/tick"}}{{/crossLink}} method is called, the display list is rendered to the
   * target &lt;canvas/&gt; instance, ignoring non-WebGL-compatible display objects. On devices and browsers that don't
   * support WebGL, content will automatically be rendered to canvas 2D context instead.
   *
   * <h4>Limitations</h4>
   * - {{#crossLink "Shape"}}{{/crossLink}}, {{#crossLink "Shadow"}}{{/crossLink}}, and {{#crossLink "Text"}}{{/crossLink}}
   * 	are not rendered when added to the display list.
   * - Images are wrapped as a webGL texture. Graphics cards have a limit to concurrent textures, and too many
   *	textures can slow performance. Caching may slow WebGL.
   * - To display something StageGL cannot render, {{#crossLink "displayObject/cache"}}{{/crossLink}} the object.
   *	Caches can be rendered regardless of source. Be wary of creating a lot of small caches, and instead use
   *	techniques such as SpriteSheets to generate images that contain multiple objects.
   * - Clone image nodes (DOM Image/Canvas Element) to re-use them between multiple StageGL instances, otherwise the
   *	GPU texture loading and tracking will get confused.
   * - You must call {{#crossLink "StageGL/updateViewport"}}{{/crossLink}} if you resize your canvas after
   *	initializing StageGL to properly size the 3D context stored in memory.
   * - Best performance will come from manual management of texture memory, but it is handled automatically by default.
   * 	See {{#crossLink "StageGL/releaseTexture"}}{{/crossLink}} for more information.
   *
   * <h4>Example</h4>
   * This example creates a StageGL instance, adds a child to it, then uses the EaselJS {{#crossLink "Ticker"}}{{/crossLink}}
   * to update the child and redraw the stage.
   *
   *      var stage = new createjs.StageGL("canvasElementId", false, false);
   *      stage.updateViewport(800, 600); //LM: Is this necessary in this example? Could you use canvas.width instead?
   *
   *      var image = new createjs.Bitmap("imagePath.png");
   *      stage.addChild(image);
   *
   *      createjs.Ticker.on("tick", handleTick);
   *
   *      function handleTick(event) {
   *          image.x += 10;
   *          stage.update();
   *      }
   *
   * <h4>Notes</h4>
   * - StageGL is not currently included in the minified version of EaselJS.
   * - {{#crossLink "SpriteContainer"}}{{/crossLink}} (the previous approach to WebGL with EaselJS) has been deprecated.
   * - Earlier versions of WebGL support in EaselJS (SpriteStage and SpriteContainer) had hard limitations on images
   * 	per container, which have been solved.
   *
   * @class StageGL
   * @extends Stage
   */
  var StageGL = function (_Stage) {
    inherits(StageGL, _Stage);
    // constructor:
    /**
     * @constructor
     * @param {HTMLCanvasElement | String | Object} canvas A canvas object that StageGL will render to, or the string id
     *  of a canvas object in the current DOM.
     * @param {Object} options All the option parameters in a reference object.
     * @param {Boolean} [options.preserveBuffer=false] If `true`, the canvas is NOT auto-cleared by WebGL (the spec
     *  discourages setting this to `true`). This is useful if you want persistent draw effects.
     * @param {Boolean} [options.antialias=false] Specifies whether or not the browser's WebGL implementation should try
     *  to perform anti-aliasing. This will also enable linear pixel sampling on power-of-two textures (smoother images).
     * @param {Boolean} [options.transparent=false] If `true`, the canvas is transparent. This is <strong>very</strong>
     * expensive, and should be used with caution.
     * @param {Boolean} [options.premultiply=false] Alters color handling. If `true`, this assumes the shader must
     * account for pre-multiplied alpha. This can help avoid visual halo effects with some assets, but may also cause
     * problems with other assets.
     * @param {Integer} [options.autoPurge=1200] How often the system should automatically dump unused textures with
     * `purgeTextures(autoPurge)` every `autoPurge/2` draws. See {{#crossLink "purgeTextures"}}{{/crossLink}} for more
     * information.
     */
    function StageGL(canvas, _ref) {
      var _ref$preserveBuffer = _ref.preserveBuffer,
        preserveBuffer = _ref$preserveBuffer === undefined ? false : _ref$preserveBuffer,
        _ref$antialias = _ref.antialias,
        antialias = _ref$antialias === undefined ? false : _ref$antialias,
        _ref$transparent = _ref.transparent,
        transparent = _ref$transparent === undefined ? false : _ref$transparent,
        _ref$premultiply = _ref.premultiply,
        premultiply = _ref$premultiply === undefined ? false : _ref$premultiply,
        _ref$autoPurge = _ref.autoPurge,
        autoPurge = _ref$autoPurge === undefined ? 1200 : _ref$autoPurge;
      classCallCheck(this, StageGL);
      // public properties:
      /**
       * Console log potential issues and problems. This is designed to have <em>minimal</em> performance impact, so
       * if extensive debugging information is required, this may be inadequate. See {{#crossLink "WebGLInspector"}}{{/crossLink}}
       * @property vocalDebug
       * @type {Boolean}
       * @default false
       */
      var _this = possibleConstructorReturn(this, (StageGL.__proto__ || Object.getPrototypeOf(StageGL)).call(this, canvas));
      _this.vocalDebug = false;
      // private properties:
      /**
       * Specifies whether or not the canvas is auto-cleared by WebGL. The WebGL spec discourages `true`.
       * If true, the canvas is NOT auto-cleared by WebGL. Used when the canvas context is created and requires
       * context re-creation to update.
       * @property _preserveBuffer
       * @protected
       * @type {Boolean}
       * @default false
       */
      _this._preserveBuffer = preserveBuffer;
      /**
       * Specifies whether or not the browser's WebGL implementation should try to perform anti-aliasing.
       * @property _antialias
       * @protected
       * @type {Boolean}
       * @default false
       */
      _this._antialias = antialias;
      /**
       * Specifies whether or not the browser's WebGL implementation should be transparent.
       * @property _transparent
       * @protected
       * @type {Boolean}
       * @default false
       */
      _this._transparent = transparent;
      /**
       * Specifies whether or not StageGL is handling colours as premultiplied alpha.
       * @property _premultiply
       * @protected
       * @type {Boolean}
       * @default false
       */
      _this._premultiply = premultiply;
      /**
       * Internal value of {{#crossLink "StageGL/autoPurge"}}{{/crossLink}}
       * @property _autoPurge
       * @protected
       * @type {Integer}
       * @default null
       */
      _this._autoPurge = autoPurge;
      /**
       * The width of the drawing surface used in memory.
       * @property _viewportWidth
       * @protected
       * @type {Number}
       * @default 0
       */
      _this._viewportWidth = 0;
      /**
       * The height of the drawing surface used in memory.
       * @property _viewportHeight
       * @protected
       * @type {Number}
       * @default 0
       */
      _this._viewportHeight = 0;
      /**
       * A 2D projection matrix used to convert WebGL's viewspace into canvas co-ordinates. Regular canvas display
       * uses Top-Left values of [0,0] where WebGL uses a Center [0,0] Top-Right [1,1] system.
       * @property _projectionMatrix
       * @protected
       * @type {Float32Array}
       * @default null
       */
      _this._projectionMatrix = null;
      /**
       * The current WebGL canvas context. Often shorthanded to just "gl" in many parts of the code.
       * @property _webGLContext
       * @protected
       * @type {WebGLRenderingContext}
       * @default null
       */
      _this._webGLContext = null;
      /**
       * The color to use when the WebGL canvas has been cleared.
       * @property _clearColor
       * @protected
       * @type {Object}
       * @default {r: 0.00, g: 0.00, b: 0.00, a: 0.00} (black)
       */
      _this._clearColor = {
        r: 0,
        g: 0,
        b: 0,
        a: 0
      }; //TODO: formalize this approach into regular canvases
      /**
       * The maximum number of cards (aka a single sprite) that can be drawn in one draw call. Use getter/setters to
       * modify otherwise internal buffers may be incorrect sizes.
       * @property _maxCardsPerBatch
       * @protected
       * @type {Number}
       * @default StageGL.DEFAULT_MAX_BATCH_SIZE (10000)
       */
      _this._maxCardsPerBatch = StageGL.DEFAULT_MAX_BATCH_SIZE; //TODO: write getter/setters for this
      /**
       * The shader program used to draw the current batch.
       * @property _activeShader
       * @protected
       * @type {WebGLProgram}
       * @default null
       */
      _this._activeShader = null;
      /**
       * The vertex position data for the current draw call.
       * @property _vertices
       * @protected
       * @type {Float32Array}
       * @default null
       */
      _this._vertices = null;
      /**
       * The WebGL buffer attached to {{#crossLink "StageGL/_vertices:property"}}{{/crossLink}}.
       * @property _vertexPositionBuffer
       * @protected
       * @type {WebGLBuffer}
       * @default null
       */
      _this._vertexPositionBuffer = null;
      /**
       * The vertex U/V data for the current draw call.
       * @property _uvs
       * @protected
       * @type {Float32Array}
       * @default null
       */
      _this._uvs = null;
      /**
       * The WebGL buffer attached to {{#crossLink "StageGL/_uvs:property"}}{{/crossLink}}.
       * @property _uvPositionBuffer
       * @protected
       * @type {WebGLBuffer}
       * @default null
       */
      _this._uvPositionBuffer = null;
      /**
       * The vertex indices data for the current draw call.
       * @property _indices
       * @protected
       * @type {Float32Array}
       * @default null
       */
      _this._indices = null;
      /**
       * The WebGL buffer attached to {{#crossLink "StageGL/_indices:property"}}{{/crossLink}}.
       * @property _textureIndexBuffer
       * @protected
       * @type {WebGLBuffer}
       * @default null
       */
      _this._textureIndexBuffer = null;
      /**
       * The vertices data for the current draw call.
       * @property _alphas
       * @protected
       * @type {Float32Array}
       * @default null
       */
      _this._alphas = null;
      /**
       * The WebGL buffer attached to {{#crossLink "StageGL/_alphas:property"}}{{/crossLink}}.
       * @property _alphaBuffer
       * @protected
       * @type {WebGLBuffer}
       * @default null
       */
      _this._alphaBuffer = null;
      /**
       * An index based lookup of every WebGL Texture currently in use.
       * @property _drawTexture
       * @protected
       * @type {Array}
       */
      _this._textureDictionary = [];
      /**
       * A string based lookup hash of which index a texture is stored at in the dictionary. The lookup string is
       * often the src url.
       * @property _textureIDs
       * @protected
       * @type {Object}
       */
      _this._textureIDs = {};
      /**
       * An array of all the textures currently loaded into the GPU. The index in the array matches the GPU index.
       * @property _batchTextures
       * @protected
       * @type {Array}
       */
      _this._batchTextures = [];
      /**
       * An array of all the simple filler textures used to prevent issues with missing textures in a batch.
       * @property _baseTextures
       * @protected
       * @type {Array}
       */
      _this._baseTextures = [];
      /**
       * The number of concurrent textures the GPU can handle. This value is dynamically set from WebGL during
       * initialization. The WebGL spec states that the lowest guaranteed value is 8, but it could be higher. Do not
       * set this value higher than the value returned by the GPU. Setting it lower will potentially reduce
       * performance.
       *
       * 		// Can also act as a length for _batchTextures
       *      gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS)
       * @property _batchTextureCount
       * @protected
       * @type {Number}
       * @default 8
       */
      _this._batchTextureCount = 8;
      /**
       * The location at which the last texture was inserted into a GPU slot in {{#crossLink "StageGL/_batchTextures:property"}}{{/crossLink}}.
       * Manual control of this variable can yield improvements in performance by intelligently replacing textures
       * inside a batch. It is impossible to write automated general use code, as it requires display list inspection
       * and/or foreknowledge.
       * @property _lastTextureInsert
       * @protected
       * @type {Number}
       * @default -1
       */
      _this._lastTextureInsert = -1;
      /**
       * The current batch being drawn, A batch consists of a call to `drawElements` on the GPU. Many of these calls
       * can occur per draw.
       * @property _batchId
       * @protected
       * @type {Number}
       * @default 0
       */
      _this._batchID = 0;
      /**
       * The current draw being performed, and may contain multiple batches. Comparing to {{#crossLink "StageGL/_batchID:property"}}{{/crossLink}}
       * can reveal batching efficiency.
       * @property _drawID
       * @protected
       * @type {Number}
       * @default 0
       */
      _this._drawID = 0;
      /**
       * Used to prevent textures in certain GPU slots from being replaced by an insert.
       * @property _slotBlackList
       * @protected
       * @type {Array}
       */
      _this._slotBlacklist = [];
      /**
       * Used to prevent nested draw calls from accidentally overwriting drawing information by tracking depth.
       * @property _isDrawing
       * @protected
       * @type {Number}
       * @default 0
       */
      _this._isDrawing = 0;
      /**
       * Used to ensure every canvas used has a unique ID.
       * @property _lastTrackedCanvas
       * @protected
       * @type {Number}
       * @default 0
       */
      _this._lastTrackedCanvas = 0;
      /**
       * Controls whether final rendering output of a {{#crossLink "cacheDraw"}}{{/crossLink}} is the canvas or a render texture.
       * See the {{#crossLink "cache"}}{{/crossLink}} function modifications for full implications and discussion.
       * @property isCacheControlled
       * @protected
       * @type {Boolean}
       * @default false
       * @todo LM: is this supposed to be _isCacheControlled since its private?
       */
      _this.isCacheControlled = false;
      /**
       * Used to counter-position the object being cached so it aligns with the cache surface.
       * @property _cacheContainer
       * @protected
       * @type {Container}
       * @default An instance of an EaselJS Container.
       */
      _this._cacheContainer = new Container;
      _this._textureName = 0;
      _this._initializeWebGL();
      return _this
    }
    // static methods:
    /**
     * Calculate the U/V co-ordinate-based info for sprite frames. Instead of pixel count it uses a 0-1 space. It also
     * includes the ability to get info back for a specific frame, or only calculate that one frame.
     * @method buildUVRects
     * @param  {SpriteSheet} spritesheet The sprite sheet to find {{#crossLink "StageGL/_frames:property"}}{{/crossLink}} on.
     * @param  {frame} [target=-1] The frame to return
     * @param  {Boolean} [onlyTarget=false] Whether "target" is the only frame that gets calculated
     * @static
     * @return {Object} the target frame if supplied and present or a generic frame {t, l, b, r}
     */
    createClass(StageGL, [{
      key: "_initializeWebGL",
      // constructor methods:
      /**
       * Create and properly initialize the WebGL instance.
       * @method _initializeWebGL
       * @protected
       * @return {WebGLRenderingContext}
       */
      value: function _initializeWebGL() {
        if (this.canvas) {
          if (!this._webGLContext || this._webGLContext.canvas !== this.canvas) {
            // A context hasn't been defined yet,
            // OR the defined context belongs to a different canvas, so reinitialize.
            // defaults and options
            var options = {
              depth: false, // Disable the depth buffer as it isn't used.
              alpha: this._transparent, // Make the canvas background transparent.
              stencil: true,
              antialias: this._antialias,
              premultipliedAlpha: this._premultiply, // Assume the drawing buffer contains colors with premultiplied alpha.
              preserveDrawingBuffer: this._preserveBuffer
            };
            var gl = this._webGLContext = this._fetchWebGLContext(this.canvas, options);
            if (!gl) {
              return null
            }
            this.updateSimultaneousTextureCount(gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS));
            this._maxTextureSlots = gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
            this._createBuffers(gl);
            this._initTextures(gl);
            gl.disable(gl.DEPTH_TEST);
            gl.enable(gl.BLEND);
            gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this._premultiply);
            //gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
            this.setClearColor();
            this.updateViewport(this._viewportWidth || this.canvas.width, this._viewportHeight || this.canvas.height)
          }
        } else {
          this._webGLContext = null
        }
        return this._webGLContext
      }
    }, {
      key: "update",
      value: function update(props) {
        if (!this.canvas) {
          return
        }
        if (this.tickOnUpdate) {
          this.tick(props)
        }
        this.dispatchEvent("drawstart");
        if (this.autoClear) {
          this.clear()
        }
        if (this._webGLContext) {
          // Use WebGL.
          this._batchDraw(this, this._webGLContext);
          if (this._autoPurge != -1 && !(this._drawID % (this._autoPurge / 2 | 0))) {
            this.purgeTextures(this._autoPurge)
          }
        } else {
          // Use 2D.
          var ctx = this.canvas.getContext("2d");
          ctx.save();
          this.updateContext(ctx);
          this.draw(ctx, false);
          ctx.restore()
        }
        this.dispatchEvent("drawend")
      }
    }, {
      key: "clear",
      value: function clear() {
        if (!this.canvas) {
          return
        }
        if (StageGL.isWebGLActive(this._webGLContext)) {
          var gl = this._webGLContext;
          // Use WebGL.
          gl.clear(gl.COLOR_BUFFER_BIT)
        } else {
          // Use 2D.
          var ctx = this.canvas.getContext("2d");
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.clearRect(0, 0, this.canvas.width + 1, this.canvas.height + 1)
        }
      }
    }, {
      key: "draw",
      value: function draw(context) {
        var ignoreCache = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        if (context === this._webGLContext && StageGL.isWebGLActive(this._webGLContext)) {
          var gl = this._webGLContext;
          this._batchDraw(this, gl, ignoreCache);
          return true
        } else {
          return get$1(StageGL.prototype.__proto__ || Object.getPrototypeOf(StageGL.prototype), "draw", this).call(this, context, ignoreCache)
        }
      }
    }, {
      key: "cacheDraw",
      value: function cacheDraw(target, filters, manager) {
        if (StageGL.isWebGLActive(this._webGLContext)) {
          this._cacheDraw(target, filters, manager);
          return true
        } else {
          return false
        }
      }
    }, {
      key: "protectTextureSlot",
      value: function protectTextureSlot(id) {
        var lock = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        if (id > this._maxTextureSlots || id < 0) {
          throw "Slot outside of acceptable range"
        }
        this._slotBlacklist[id] = lock
      }
    }, {
      key: "getTargetRenderTexture",
      value: function getTargetRenderTexture(target, w, h) {
        var result = void 0,
          toggle = false;
        var gl = this._webGLContext;
        if (target.__lastRT !== undefined && target.__lastRT === target.__rtA) {
          toggle = true
        }
        if (!toggle) {
          if (target.__rtA === undefined) {
            target.__rtA = this.getRenderBufferTexture(w, h)
          } else {
            if (w != target.__rtA._width || h != target.__rtA._height) {
              this.resizeTexture(target.__rtA, w, h)
            }
            this.setTextureParams(gl)
          }
          result = target.__rtA
        } else {
          if (target.__rtB === undefined) {
            target.__rtB = this.getRenderBufferTexture(w, h)
          } else {
            if (w != target.__rtB._width || h != target.__rtB._height) {
              this.resizeTexture(target.__rtB, w, h)
            }
            this.setTextureParams(gl)
          }
          result = target.__rtB
        }
        if (!result) {
          throw "Problems creating render textures, known causes include using too much VRAM by not releasing WebGL texture instances"
        }
        target.__lastRT = result;
        return result
      }
    }, {
      key: "releaseTexture",
      value: function releaseTexture(item) {
        if (!item) {
          return
        }
        // this is a container object
        if (item.children) {
          for (var i = 0, l = item.children.length; i < l; i++) {
            this.releaseTexture(item.children[i])
          }
        }
        // this has a cache canvas
        if (item.cacheCanvas) {
          item.uncache();
          if (this.vocalDebug) {
            console.log("Automatic uncache call, potentially unexpected behaviour. Recommend manual uncache calling.")
          }
        }
        var foundImage = void 0;
        if (item._storeID !== undefined) {
          // this is a texture itself
          if (item === this._textureDictionary[item._storeID]) {
            this._killTextureObject(item);
            item._storeID = undefined;
            return
          }
          // this is an image or canvas
          foundImage = item
        } else if (item._webGLRenderStyle === 2) {
          // this is a Bitmap class
          foundImage = item.image
        } else if (item._webGLRenderStyle === 1) {
          // this is a SpriteSheet, we can't tell which image we used from the list easily so remove them all!
          for (var _i = 0, _l = item.spriteSheet._images.length; _i < _l; _i++) {
            this.releaseTexture(item.spriteSheet._images[_i])
          }
          return
        }
        // did we find anything
        if (foundImage === undefined) {
          if (this.vocalDebug) {
            console.log("No associated texture found on release")
          }
          return
        }
        // remove it
        this._killTextureObject(this._textureDictionary[foundImage._storeID]);
        foundImage._storeID = undefined
      }
    }, {
      key: "purgeTextures",
      /**
       * Similar to {{#crossLink "releaseTexture"}}{{/crossLink}}, but this function differs by searching for textures to
       * release. It works by assuming that it can purge any texture which was last used more than "count" draw calls ago.
       * Because this process is unaware of the objects and whether they may be used on your stage, false positives can
       * occur. It is recommended to manually manage your memory with {{#crossLink "StageGL/releaseTexture"}}{{/crossLink}},
       * however, there are many use cases where this is simpler and error-free. This process is also run by default under
       * the hood to prevent leaks. To disable it see the {{#crossLink "StageGL/autoPurge:property"}}{{/crossLink}} property.
       * @method purgeTextures
       * @param {Number} [count=100] How many renders ago the texture was last used
       */
      value: function purgeTextures() {
        var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;
        var dict = this._textureDictionary;
        var l = dict.length;
        for (var i = 0; i < l; i++) {
          var item = dict[i];
          if (!item) {
            continue
          }
          if (item._drawID + count <= this._drawID) {
            // use draw not batch as draw is more indicative of time
            this._killTextureObject(item)
          }
        }
      }
    }, {
      key: "updateSimultaneousTextureCount",
      value: function updateSimultaneousTextureCount() {
        var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
        // TODO: DHG: make sure API works in all instances, may be some issues with buffers etc I haven't foreseen
        var gl = this._webGLContext;
        var success = false;
        this._batchTextureCount = count;
        while (!success) {
          try {
            this._activeShader = this._fetchShaderProgram(gl);
            success = true
          } catch (e) {
            if (this._batchTextureCount == 1) {
              throw "Cannot compile shader " + e
            }
            this._batchTextureCount -= 4;
            if (this._batchTextureCount < 1) {
              this._batchTextureCount = 1
            }
            if (this.vocalDebug) {
              // TODO-ES6: Directory search for quotations and + next to eachother for string interp.
              console.log("Reducing desired texture count due to errors: " + this._batchTextureCount)
            }
          }
        }
      }
    }, {
      key: "updateViewport",
      value: function updateViewport(width, height) {
        this._viewportWidth = width | 0;
        this._viewportHeight = height | 0;
        var gl = this._webGLContext;
        if (gl) {
          gl.viewport(0, 0, this._viewportWidth, this._viewportHeight);
          // WebGL works with a -1,1 space on its screen. It also follows Y-Up
          // we need to flip the y, scale and then translate the co-ordinates to match this
          // additionally we offset into they Y so the polygons are inside the camera's "clipping" plane
          this._projectionMatrix = new Float32Array([2 / this._viewportWidth, 0, 0, 0, 0, -2 / this._viewportHeight, 1, 0, 0, 0, 1, 0, -1, 1, .1, 0]);
          // create the flipped version for use with render texture flipping
          // DHG: this would be a slice but some platforms don't offer slice's for Float32Array
          this._projectionMatrixFlip = new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
          this._projectionMatrixFlip.set(this._projectionMatrix);
          this._projectionMatrixFlip[5] *= -1;
          this._projectionMatrixFlip[13] *= -1
        }
      }
    }, {
      key: "getFilterShader",
      value: function getFilterShader(filter) {
        if (!filter) {
          filter = this
        }
        var gl = this._webGLContext;
        var targetShader = this._activeShader;
        if (filter._builtShader) {
          targetShader = filter._builtShader;
          if (targetShader.shaderParamSetup) {
            targetShader.shaderParamSetup(gl, this, targetShader)
          }
        } else {
          try {
            targetShader = this._fetchShaderProgram(gl, "filter", filter.VTX_SHADER_BODY, filter.FRAG_SHADER_BODY, filter.shaderParamSetup && filter.shaderParamSetup.bind(filter));
            filter._builtShader = targetShader;
            targetShader._name = filter.toString()
          } catch (e) {
            // TODO-ES6: Place this under vocalDebug?
            console && console.log(e)
          }
        }
        return targetShader
      }
    }, {
      key: "getBaseTexture",
      /**
       * Returns a base texture that has no image or data loaded. Not intended for loading images. It may return `null`
       * in some error cases, and trying to use a "null" texture can cause renders to fail.
       * @method getBaseTexture
       * @param  {uint} [w=1] The width of the texture in pixels
       * @param  {uint} [h=1] The height of the texture in pixels
       * @todo Remove the console.log in this function. Please check for other instances.
       */
      value: function getBaseTexture() {
        var w = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
        var h = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
        var width = Math.ceil(w > 0 ? w : 1);
        var height = Math.ceil(h > 0 ? h : 1);
        var gl = this._webGLContext;
        var texture = gl.createTexture();
        this.resizeTexture(texture, width, height);
        this.setTextureParams(gl, false);
        texture.__trackName = this._textureName++;
        return texture
      }
    }, {
      key: "resizeTexture",
      /**
       * Resizes a supplied texture element. It may return `null` in some error cases, such as when the texture is too
       * large, an out of texture memory error occurs, etc. Trying to use a "null" texture can cause renders to fail.
       * NOTE: The texture must have been made with "texImage2D", all default APIs in StageGL use this so this only
       * matters for changes.
       * @method getBaseTexture
       * @param  {WebGLTexture} texture The GL Texture to be modified.
       * @param  {uint} [width=1] The width of the texture in pixels
       * @param  {uint} [height=1] The height of the texture in pixels
       */
      value: function resizeTexture(texture) {
        var width = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
        var height = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
        var gl = this._webGLContext;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, // target
          0, // level of detail
          gl.RGBA, // internal format
          width, height, 0, // width, height, border (only for array/null sourced textures)
          gl.RGBA, // format (match internal format)
          gl.UNSIGNED_BYTE, // type of texture(pixel color depth)
          null);
        texture.width = width;
        texture.height = height
      }
    }, {
      key: "getRenderBufferTexture",
      value: function getRenderBufferTexture(w, h) {
        var gl = this._webGLContext;
        // get the texture
        var renderTexture = this.getBaseTexture(w, h);
        if (!renderTexture) {
          return null
        }
        // get the frame buffer
        var frameBuffer = gl.createFramebuffer();
        if (!renderTexture) {
          return null
        }
        // set its width and height for spoofing as an image
        renderTexture.width = w;
        renderTexture.height = h;
        // attach frame buffer to texture and provide cross links to look up each other
        gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, renderTexture, 0);
        frameBuffer._renderTexture = renderTexture;
        renderTexture._frameBuffer = frameBuffer;
        // these keep track of themselves simply to reduce complexity of some lookup code
        renderTexture._storeID = this._textureDictionary.length;
        this._textureDictionary[renderTexture._storeID] = renderTexture;
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        return renderTexture
      }
    }, {
      key: "setTextureParams",
      value: function setTextureParams(gl) {
        var isPOT = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        if (isPOT && this._antialias) {
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        } else {
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
        }
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      }
    }, {
      key: "setClearColor",
      value: function setClearColor() {
        var color = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var r = void 0,
          g = void 0,
          b = void 0,
          a = void 0,
          output = void 0;
        if (typeof color == "string") {
          if (color.indexOf("#") == 0) {
            if (color.length == 4) {
              color = "#" + (color.charAt(1) + color.charAt(1) + color.charAt(2) + color.charAt(2) + color.charAt(3) + color.charAt(3))
            }
            r = Number("0x" + color.slice(1, 3)) / 255;
            g = Number("0x" + color.slice(3, 5)) / 255;
            b = Number("0x" + color.slice(5, 7)) / 255;
            a = Number("0x" + color.slice(7, 9)) / 255
          } else if (color.indexOf("rgba(") == 0) {
            output = color.slice(5, -1).split(",");
            r = Number(output[0]) / 255;
            g = Number(output[1]) / 255;
            b = Number(output[2]) / 255;
            a = Number(output[3])
          }
        } else {
          // >>> is an unsigned shift which is what we want as 0x80000000 and up are negative values
          r = ((color & 4278190080) >>> 24) / 255;
          g = ((color & 16711680) >>> 16) / 255;
          b = ((color & 65280) >>> 8) / 255;
          a = (color & 255) / 255
        }
        this._clearColor.r = r || 0;
        this._clearColor.g = g || 0;
        this._clearColor.b = b || 0;
        this._clearColor.a = a || 0;
        if (!this._webGLContext) {
          return
        }
        this._webGLContext.clearColor(this._clearColor.r, this._clearColor.g, this._clearColor.b, this._clearColor.a)
      }
    }, {
      key: "_fetchWebGLContext",
      value: function _fetchWebGLContext(canvas, options) {
        var gl = void 0;
        try {
          gl = canvas.getContext("webgl", options) || canvas.getContext("experimental-webgl", options)
        } catch (e) {}
        if (!gl) {
          var msg = "Could not initialize WebGL";
          // TODO-ES6: vocalDebug?
          console.error ? console.error(msg) : console.log(msg)
        } else {
          gl.viewportWidth = canvas.width;
          gl.viewportHeight = canvas.height
        }
        return gl
      }
    }, {
      key: "_fetchShaderProgram",
      value: function _fetchShaderProgram(gl) {
        var shaderName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "regular";
        var customVTX = arguments[2];
        var customFRAG = arguments[3];
        var shaderParamSetup = arguments[4];
        gl.useProgram(null); // safety to avoid collisions
        // build the correct shader string out of the right headers and bodies
        var targetFrag = void 0,
          targetVtx = void 0;
        switch (shaderName) {
          case "filter":
            targetVtx = StageGL.COVER_VERTEX_HEADER + (customVTX || StageGL.COVER_VERTEX_BODY);
            targetFrag = StageGL.COVER_FRAGMENT_HEADER + (customFRAG || StageGL.COVER_FRAGMENT_BODY);
            break;
          case "particle":
            targetVtx = StageGL.REGULAR_VERTEX_HEADER + StageGL.PARTICLE_VERTEX_BODY;
            targetFrag = StageGL.REGULAR_FRAGMENT_HEADER + StageGL.PARTICLE_FRAGMENT_BODY;
            break;
          case "override":
            targetVtx = StageGL.REGULAR_VERTEX_HEADER + (customVTX || StageGL.REGULAR_VERTEX_BODY);
            targetFrag = StageGL.REGULAR_FRAGMENT_HEADER + (customFRAG || StageGL.REGULAR_FRAGMENT_BODY);
            break;
          case "regular":
          default:
            targetVtx = StageGL.REGULAR_VERTEX_HEADER + StageGL.REGULAR_VERTEX_BODY;
            targetFrag = StageGL.REGULAR_FRAGMENT_HEADER + StageGL.REGULAR_FRAGMENT_BODY;
            break
        }
        // create the separate vars
        var vertexShader = this._createShader(gl, gl.VERTEX_SHADER, targetVtx);
        var fragmentShader = this._createShader(gl, gl.FRAGMENT_SHADER, targetFrag);
        // link them together
        var shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
        shaderProgram._type = shaderName;
        // check compile status
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
          gl.useProgram(this._activeShader);
          throw gl.getProgramInfoLog(shaderProgram)
        }
        // set up the parameters on the shader
        gl.useProgram(shaderProgram);
        switch (shaderName) {
          case "filter":
            // get the places in memory the shader is stored so we can feed information into them
            // then save it off on the shader because it's so tied to the shader itself
            shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vertexPosition");
            gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
            shaderProgram.uvPositionAttribute = gl.getAttribLocation(shaderProgram, "uvPosition");
            gl.enableVertexAttribArray(shaderProgram.uvPositionAttribute);
            shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
            gl.uniform1i(shaderProgram.samplerUniform, 0);
            shaderProgram.uprightUniform = gl.getUniformLocation(shaderProgram, "uUpright");
            gl.uniform1f(shaderProgram.uprightUniform, 0);
            // if there's some custom attributes be sure to hook them up
            if (shaderParamSetup) {
              shaderParamSetup(gl, this, shaderProgram)
            }
            break;
          case "override":
          case "particle":
          case "regular":
          default:
            // get the places in memory the shader is stored so we can feed information into them
            // then save it off on the shader because it's so tied to the shader itself
            shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vertexPosition");
            gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
            shaderProgram.uvPositionAttribute = gl.getAttribLocation(shaderProgram, "uvPosition");
            gl.enableVertexAttribArray(shaderProgram.uvPositionAttribute);
            shaderProgram.textureIndexAttribute = gl.getAttribLocation(shaderProgram, "textureIndex");
            gl.enableVertexAttribArray(shaderProgram.textureIndexAttribute);
            shaderProgram.alphaAttribute = gl.getAttribLocation(shaderProgram, "objectAlpha");
            gl.enableVertexAttribArray(shaderProgram.alphaAttribute);
            var samplers = [];
            // create array of integers
            for (var i = 0; i < this._batchTextureCount; i++) {
              samplers[i] = i
            }
            shaderProgram.samplerData = samplers;
            shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
            gl.uniform1iv(shaderProgram.samplerUniform, samplers);
            shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "pMatrix");
            break
        }
        gl.useProgram(this._activeShader);
        return shaderProgram
      }
    }, {
      key: "_createShader",
      value: function _createShader(gl, type, str) {
        // inject the static number
        str = str.replace(/{{count}}/g, this._batchTextureCount);
        // resolve issue with no dynamic samplers by creating correct samplers in if else chain
        var insert = "";
        for (var i = 1; i < this._batchTextureCount; i++) {
          insert += "} else if (src == " + i + ") { color = texture2D(uSampler[" + i + "], vTextureCoord);"
        }
        str = str.replace(/{{alternates}}/g, insert).replace(/{{premultiply}}/g, this._premultiply ? "/color.a" : "");
        // actually compile the shader
        var shader = gl.createShader(type);
        gl.shaderSource(shader, str);
        gl.compileShader(shader);
        // check compile status
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          throw gl.getShaderInfoLog(shader)
        }
        return shader
      }
    }, {
      key: "_createBuffers",
      value: function _createBuffers(gl) {
        var groupCount = this._maxCardsPerBatch * StageGL.INDICIES_PER_CARD;
        var groupSize = void 0;
        // INFO:
        // all buffers are created using this pattern
        // create a WebGL buffer
        // attach it to context
        // figure out how many parts it has to an entry
        // fill it with empty data to reserve the memory
        // attach the empty data to the GPU
        // track the sizes on the buffer object
        // INFO:
        // a single buffer may be optimal in some situations and would be approached like this
        // currently not implemented due to lack of need and potential complications with drawCover
        // var vertexBuffer = this._vertexBuffer = gl.createBuffer();
        // gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        // groupSize = 2 + 2 + 1 + 1; //x/y, u/v, index, alpha
        // var vertexData = this._vertexData = new Float32Array(groupCount * groupSize);
        // for(i=0; i<vertexData.length; i+=groupSize) {
        // 	vertexData[i+0] = vertexData[i+1] = 0;
        // 	vertexData[i+2] = vertexData[i+3] = 0.5;
        // 	vertexData[i+4] = 0;
        // 	vertexData[i+5] = 1;
        // }
        // vertexBuffer.itemSize = groupSize;
        // vertexBuffer.numItems = groupCount;
        // TODO bechmark and test using unified buffer
        // the actual position information
        var vertexPositionBuffer = this._vertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
        groupSize = 2;
        var vertices = this._vertices = new Float32Array(groupCount * groupSize);
        for (var i = 0, l = vertices.length; i < l; i += groupSize) {
          vertices[i] = vertices[i + 1] = 0
        }
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);
        vertexPositionBuffer.itemSize = groupSize;
        vertexPositionBuffer.numItems = groupCount;
        // where on the texture it gets its information
        var uvPositionBuffer = this._uvPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, uvPositionBuffer);
        groupSize = 2;
        var uvs = this._uvs = new Float32Array(groupCount * groupSize);
        for (var _i2 = 0, _l2 = uvs.length; _i2 < _l2; _i2 += groupSize) {
          uvs[_i2] = uvs[_i2 + 1] = 0
        }
        gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.DYNAMIC_DRAW);
        uvPositionBuffer.itemSize = groupSize;
        uvPositionBuffer.numItems = groupCount;
        // what texture it should use
        var textureIndexBuffer = this._textureIndexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, textureIndexBuffer);
        groupSize = 1;
        var indices = this._indices = new Float32Array(groupCount * groupSize);
        for (var _i3 = 0, _l3 = indices.length; _i3 < _l3; _i3++) {
          indices[_i3] = 0
        }
        gl.bufferData(gl.ARRAY_BUFFER, indices, gl.DYNAMIC_DRAW);
        textureIndexBuffer.itemSize = groupSize;
        textureIndexBuffer.numItems = groupCount;
        // what alpha it should have
        var alphaBuffer = this._alphaBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, alphaBuffer);
        groupSize = 1;
        var alphas = this._alphas = new Float32Array(groupCount * groupSize);
        for (var _i4 = 0, _l4 = alphas.length; _i4 < _l4; _i4++) {
          alphas[_i4] = 1
        }
        gl.bufferData(gl.ARRAY_BUFFER, alphas, gl.DYNAMIC_DRAW);
        alphaBuffer.itemSize = groupSize;
        alphaBuffer.numItems = groupCount
      }
    }, {
      key: "_initTextures",
      value: function _initTextures() {
        //TODO: DHG: add a cleanup routine in here in case this happens mid stream
        // reset counters
        this._lastTextureInsert = -1;
        // clear containers
        this._textureDictionary = [];
        this._textureIDs = {};
        this._baseTextures = [];
        this._batchTextures = [];
        // fill in blanks as it helps the renderer be stable while textures are loading and reduces need for safety code
        for (var i = 0; i < this._batchTextureCount; i++) {
          var t = this.getBaseTexture();
          this._baseTextures[i] = this._batchTextures[i] = t;
          if (!t) {
            throw "Problems creating basic textures, known causes include using too much VRAM by not releasing WebGL texture instances"
          }
        }
      }
    }, {
      key: "_loadTextureImage",
      value: function _loadTextureImage(gl, image) {
        var src = image.src;
        if (!src) {
          // one time canvas property setup
          image._isCanvas = true;
          src = image.src = "canvas_" + this._lastTrackedCanvas++
        }
        // put the texture into our storage system
        var storeID = this._textureIDs[src];
        if (storeID === undefined) {
          storeID = this._textureIDs[src] = this._textureDictionary.length
        }
        if (this._textureDictionary[storeID] === undefined) {
          this._textureDictionary[storeID] = this.getBaseTexture()
        }
        var texture = this._textureDictionary[storeID];
        if (texture) {
          // get texture params all set up
          texture._batchID = this._batchID;
          texture._storeID = storeID;
          texture._imageData = image;
          this._insertTextureInBatch(gl, texture);
          // get the data into the texture or wait for it to load
          image._storeID = storeID;
          if (image.complete || image.naturalWidth || image._isCanvas) {
            // is it already loaded
            this._updateTextureImageData(gl, image)
          } else {
            //image.onload = this._updateTextureImageData.bind(this, gl, image);										//TODO: DHG: EventListener instead of callback
            image.addEventListener("load", this._updateTextureImageData.bind(this, gl, image))
          }
        } else {
          // we really really should have a texture, try to recover the error by using a saved empty texture so we don't crash
          var msg = "Problems creating basic textures, known causes include using too much VRAM by not releasing WebGL texture instances";
          console.error && console.error(msg) || console.log(msg);
          texture = this._baseTextures[0];
          texture._batchID = this._batchID;
          texture._storeID = -1;
          texture._imageData = texture;
          this._insertTextureInBatch(gl, texture)
        }
        return texture
      }
    }, {
      key: "_updateTextureImageData",
      value: function _updateTextureImageData(gl, image) {
        // the bitwise & is intentional, cheap exponent 2 check
        var isNPOT = image.width & image.width - 1 || image.height & image.height - 1;
        var texture = this._textureDictionary[image._storeID];
        gl.activeTexture(gl.TEXTURE0 + texture._activeIndex);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        texture.isPOT = !isNPOT;
        this.setTextureParams(gl, texture.isPOT);
        try {
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
        } catch (e) {
          var errString = "\nAn error has occurred. This is most likely due to security restrictions on WebGL images with local or cross-domain origins";
          if (console.error) {
            //TODO: LM: I recommend putting this into a log function internally, since you do it so often, and each is implemented differently.
            console.error(e, errString)
          } else {
            console && console.log(e, errString)
          }
        }
        image._invalid = false;
        texture._w = image.width;
        texture._h = image.height;
        if (this.vocalDebug) {
          if (isNPOT) {
            console.warn("NPOT(Non Power of Two) Texture: " + image.src)
          }
          if (image.width > gl.MAX_TEXTURE_SIZE || image.height > gl.MAX_TEXTURE_SIZE) {
            console && console.error("Oversized Texture: " + image.width + "x" + image.height + " vs " + gl.MAX_TEXTURE_SIZE + "max")
          }
        }
      }
    }, {
      key: "_insertTextureInBatch",
      /**
       * Adds the texture to a spot in the current batch, forcing a draw if no spots are free.
       * @method _insertTextureInBatch
       * @param {WebGLRenderingContext} gl The canvas WebGL context object to draw into.
       * @param {WebGLTexture} texture The texture to be inserted.
       * @protected
       */
      value: function _insertTextureInBatch(gl, texture) {
        // if it wasn't used last batch
        if (this._batchTextures[texture._activeIndex] !== texture) {
          // we've got to find it a a spot.
          var found = -1;
          var start = (this._lastTextureInsert + 1) % this._batchTextureCount;
          var look = start;
          do {
            if (this._batchTextures[look]._batchID != this._batchID && !this._slotBlacklist[look]) {
              found = look;
              break
            }
            look = (look + 1) % this._batchTextureCount
          } while (look !== start);
          // we couldn't find anywhere for it go, meaning we're maxed out
          if (found === -1) {
            this.batchReason = "textureOverflow";
            this._drawBuffers(gl); // <------------------------------------------------------------------------
            this.batchCardCount = 0;
            found = start
          }
          // lets put it into that spot
          this._batchTextures[found] = texture;
          texture._activeIndex = found;
          var image = texture._imageData;
          if (image && image._invalid && texture._drawID !== undefined) {
            this._updateTextureImageData(gl, image)
          } else {
            gl.activeTexture(gl.TEXTURE0 + found);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            this.setTextureParams(gl)
          }
          this._lastTextureInsert = found
        } else {
          var _image = texture._imageData;
          if (texture._storeID != undefined && _image._invalid) {
            this._updateTextureImageData(gl, _image)
          }
        }
        texture._drawID = this._drawID;
        texture._batchID = this._batchID
      }
    }, {
      key: "_killTextureObject",
      value: function _killTextureObject(tex) {
        if (!tex) {
          return
        }
        var gl = this._webGLContext;
        // remove linkage
        if (tex._storeID !== undefined && tex._storeID >= 0) {
          this._textureDictionary[tex._storeID] = undefined;
          for (var n in this._textureIDs) {
            if (this._textureIDs[n] == tex._storeID) {
              delete this._textureIDs[n]
            }
          }
          tex._storeID = undefined
        }
        // make sure to drop it out of an active slot
        if (tex._activeIndex !== undefined && this._batchTextures[tex._activeIndex] === tex) {
          this._batchTextures[tex._activeIndex] = this._baseTextures[tex._activeIndex]
        }
        // remove buffers if present
        try {
          if (tex._frameBuffer) {
            gl.deleteFramebuffer(tex._frameBuffer)
          }
          tex._frameBuffer = undefined
        } catch (e) { /* suppress delete errors because it's already gone or didn't need deleting probably */
          if (this.vocalDebug) {
            console.log(e)
          }
        }
        // remove entry
        try {
          console.log("KILL", tex.__trackName);
          gl.deleteTexture(tex)
        } catch (e) { /* suppress delete errors because it's already gone or didn't need deleting probably */
          if (this.vocalDebug) {
            console.log(e)
          }
        }
      }
    }, {
      key: "_backupBatchTextures",
      value: function _backupBatchTextures(restore, target) {
        var gl = this._webGLContext;
        if (!this._backupTextures) {
          this._backupTextures = []
        }
        if (target === undefined) {
          target = this._backupTextures
        }
        for (var i = 0; i < this._batchTextureCount; i++) {
          gl.activeTexture(gl.TEXTURE0 + i);
          if (restore) {
            this._batchTextures[i] = target[i]
          } else {
            target[i] = this._batchTextures[i];
            this._batchTextures[i] = this._baseTextures[i]
          }
          gl.bindTexture(gl.TEXTURE_2D, this._batchTextures[i]);
          this.setTextureParams(gl, this._batchTextures[i].isPOT)
        }
        if (restore && target === this._backupTextures) {
          this._backupTextures = []
        }
      }
    }, {
      key: "_batchDraw",
      /**
       * Begin the drawing process for a regular render.
       * @method _batchDraw
       * @param {WebGLRenderingContext} gl The canvas WebGL context object to draw into.
       * @param {Stage || Container} sceneGraph {{#crossLink "Container"}}{{/crossLink}} object with all that needs to rendered, preferably a stage
       * @param {WebGLRenderingContext} ignoreCache
       * @protected
       * @todo Review the ignoreCache parameter. Is it a context or a boolean?
       */
      value: function _batchDraw(sceneGraph, gl, ignoreCache) {
        if (this._isDrawing > 0) {
          this._drawBuffers(gl)
        }
        this._isDrawing++;
        this._drawID++;
        this.batchCardCount = 0;
        this.depth = 0;
        this._appendToBatchGroup(sceneGraph, gl, new Matrix2D, this.alpha, ignoreCache); //TODO: DHG: isn't there a global alpha or something?
        this.batchReason = "drawFinish";
        this._drawBuffers(gl); // <--------------------------------------------------------
        this._isDrawing--
      }
    }, {
      key: "_cacheDraw",
      value: function _cacheDraw(target, filters, manager) {
        /*
           Implicitly there are 4 modes to this function: filteredSameContext, filteredUniqueContext, sameContext, uniqueContext.
           Each situation must be handled slightly differently as uniqueContext or sameContext define how the output works,
           one drawing directly into the main context and the other drawing into a stored renderTexture respectively.
           When the draw is a filtered draw the filters are applied sequentially in order to draw into saved textures repeatedly.
           Once the final filter is up the final output is treated depending upon whether it is a same or unique context.
           The internal complexity comes from sahring information, and issues like textures needing to be flipped sometimes when written to render textures.
           */
        var gl = this._webGLContext;
        var renderTexture = void 0;
        var shaderBackup = this._activeShader;
        var blackListBackup = this._slotBlacklist;
        var lastTextureSlot = this._maxTextureSlots - 1;
        var wBackup = this._viewportWidth,
          hBackup = this._viewportHeight;
        // protect the last slot so that we have somewhere to bind the renderTextures so it doesn't get upset
        this.protectTextureSlot(lastTextureSlot, true);
        // create offset container for drawing item
        var mtx = target.getMatrix();
        mtx = mtx.clone();
        mtx.scale(1 / manager.scale, 1 / manager.scale);
        mtx = mtx.invert();
        mtx.translate(-manager.offX / manager.scale, -manager.offY / manager.scale);
        var container = this._cacheContainer;
        container.children = [target];
        container.transformMatrix = mtx;
        this._backupBatchTextures(false);
        var filterCount = filters && filters.length;
        if (filterCount) {
          //this._backupBatchTextures(false);
          this._drawFilters(target, filters, manager)
        } else {
          // is this for another stage or mine?
          if (this.isCacheControlled) {
            // draw item to canvas				I -> C
            gl.clear(gl.COLOR_BUFFER_BIT);
            this._batchDraw(container, gl, true)
          } else {
            //this._backupBatchTextures(false);
            gl.activeTexture(gl.TEXTURE0 + lastTextureSlot);
            target.cacheCanvas = this.getTargetRenderTexture(target, manager._drawWidth, manager._drawHeight);
            renderTexture = target.cacheCanvas;
            // draw item to render texture		I -> T
            gl.bindFramebuffer(gl.FRAMEBUFFER, renderTexture._frameBuffer);
            this.updateViewport(manager._drawWidth, manager._drawHeight);
            this._projectionMatrix = this._projectionMatrixFlip;
            gl.clear(gl.COLOR_BUFFER_BIT);
            this._batchDraw(container, gl, true);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            this.updateViewport(wBackup, hBackup)
          }
        }
        this._backupBatchTextures(true);
        this.protectTextureSlot(lastTextureSlot, false);
        this._activeShader = shaderBackup;
        this._slotBlacklist = blackListBackup
      }
    }, {
      key: "_drawFilters",
      /**
       * @method _drawFilters
       * @param target
       * @param filters
       * @param manager
       * @protected
       * @todo Please doc this method
       */
      value: function _drawFilters(target, filters, manager) {
        var gl = this._webGLContext;
        var renderTexture = void 0;
        var lastTextureSlot = this._maxTextureSlots - 1;
        var wBackup = this._viewportWidth,
          hBackup = this._viewportHeight;
        var container = this._cacheContainer;
        var filterCount = filters && filters.length;
        // we don't know which texture slot we're dealing with previously and we need one out of the way
        // once we're using that slot activate it so when we make and bind our RenderTexture it's safe there
        gl.activeTexture(gl.TEXTURE0 + lastTextureSlot);
        renderTexture = this.getTargetRenderTexture(target, manager._drawWidth, manager._drawHeight);
        // draw item to render texture		I -> T
        gl.bindFramebuffer(gl.FRAMEBUFFER, renderTexture._frameBuffer);
        this.updateViewport(manager._drawWidth, manager._drawHeight);
        gl.clear(gl.COLOR_BUFFER_BIT);
        this._batchDraw(container, gl, true);
        // bind the result texture to slot 0 as all filters and cover draws assume original content is in slot 0
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, renderTexture);
        this.setTextureParams(gl);
        var flipY = false;
        // apply each filter in order, but remember to toggle used texture and render buffer
        for (var i = 0; i < filterCount; i++) {
          var filter = filters[i];
          // swap to correct shader
          this._activeShader = this.getFilterShader(filter);
          if (!this._activeShader) {
            continue
          }
          // now the old result is stored in slot 0, make a new render texture
          gl.activeTexture(gl.TEXTURE0 + lastTextureSlot);
          renderTexture = this.getTargetRenderTexture(target, manager._drawWidth, manager._drawHeight);
          gl.bindFramebuffer(gl.FRAMEBUFFER, renderTexture._frameBuffer);
          // draw result to render texture	R -> T
          gl.viewport(0, 0, manager._drawWidth, manager._drawHeight);
          gl.clear(gl.COLOR_BUFFER_BIT);
          this._drawCover(gl, flipY);
          // bind the result texture to slot 0 as all filters and cover draws assume original content is in slot 0
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, renderTexture);
          this.setTextureParams(gl);
          // use flipping to keep things upright, things already cancel out on a single filter
          if (filterCount > 1) {
            flipY = !flipY
          }
        }
        // is this for another stage or mine
        if (this.isCacheControlled) {
          gl.bindFramebuffer(gl.FRAMEBUFFER, null);
          this.updateViewport(wBackup, hBackup);
          // draw result to canvas			R -> C
          this._activeShader = this.getFilterShader(this);
          gl.clear(gl.COLOR_BUFFER_BIT);
          this._drawCover(gl, flipY)
        } else {
          //TODO: DHG: this is less than ideal a flipped inital render for this circumstance might help, adjust the perspective matrix?
          if (flipY) {
            gl.activeTexture(gl.TEXTURE0 + lastTextureSlot);
            renderTexture = this.getTargetRenderTexture(target, manager._drawWidth, manager._drawHeight);
            gl.bindFramebuffer(gl.FRAMEBUFFER, renderTexture._frameBuffer);
            this._activeShader = this.getFilterShader(this);
            gl.viewport(0, 0, manager._drawWidth, manager._drawHeight);
            gl.clear(gl.COLOR_BUFFER_BIT);
            this._drawCover(gl, !flipY)
          }
          gl.bindFramebuffer(gl.FRAMEBUFFER, null);
          this.updateViewport(wBackup, hBackup);
          // make sure the last texture is the active thing to draw
          target.cacheCanvas = renderTexture
        }
      }
    }, {
      key: "_appendToBatchGroup",
      /**
       * Add all the contents of a container to the pending buffers, called recursively on each container. This may
       * trigger a draw if a buffer runs out of space.
       * @method _appendToBatchGroup
       * @param {Container} container The {{#crossLink "Container"}}{{/crossLink}} that contains everything to be drawn.
       * @param {WebGLRenderingContext} gl The canvas WebGL context object to draw into.
       * @param {Matrix2D} concatMtx The effective (concatenated) transformation matrix when beginning this container
       * @param {Number} concatAlpha The effective (concatenated) alpha when beginning this container
       * @param {Boolean} ignoreCache Don't use an element's cache during this draw
       * @protected
       */
      value: function _appendToBatchGroup(container, gl, concatMtx, concatAlpha, ignoreCache) {
        // sort out shared properties
        if (!container._glMtx) {
          container._glMtx = new Matrix2D
        }
        var cMtx = container._glMtx;
        cMtx.copy(concatMtx);
        if (container.transformMatrix) {
          cMtx.appendMatrix(container.transformMatrix)
        } else {
          cMtx.appendTransform(container.x, container.y, container.scaleX, container.scaleY, container.rotation, container.skewX, container.skewY, container.regX, container.regY)
        }
        // sub components of figuring out the position an object holds
        var subL = void 0,
          subT = void 0,
          subR = void 0,
          subB = void 0;
        // actually apply its data to the buffers
        var l = container.numChildren;
        for (var i = 0; i < l; i++) {
          var item = container.children[i];
          if (!(item.visible && concatAlpha)) {
            continue
          }
          if (!item.cacheCanvas || ignoreCache) {
            if (item.children) {
              this._appendToBatchGroup(item, gl, cMtx, item.alpha * concatAlpha);
              continue
            }
          }
          // check for overflowing batch, if yes then force a render
          if (this.batchCardCount + 1 > this._maxCardsPerBatch) {
            //TODO: DHG: consider making this polygon count dependant for things like vector draws
            this.batchReason = "vertexOverflow";
            this._drawBuffers(gl); // <------------------------------------------------------------
            this.batchCardCount = 0
          }
          // keep track of concatenated position
          if (!item._glMtx) {
            item._glMtx = new Matrix2D
          }
          var iMtx = item._glMtx;
          iMtx.copy(cMtx);
          if (item.transformMatrix) {
            iMtx.appendMatrix(item.transformMatrix)
          } else {
            iMtx.appendTransform(item.x, item.y, item.scaleX, item.scaleY, item.rotation, item.skewX, item.skewY, item.regX, item.regY)
          }
          var uvRect = void 0,
            texIndex = void 0,
            image = void 0,
            frame = void 0,
            texture = void 0,
            src = void 0;
          if (item._webGLRenderStyle === 2 || item.cacheCanvas && !ignoreCache) {
            // BITMAP / Cached Canvas
            image = (ignoreCache ? false : item.cacheCanvas) || item.image
          } else if (item._webGLRenderStyle === 1) {
            // SPRITE
            frame = item.spriteSheet.getFrame(item.currentFrame); //TODO: Faster way?
            image = frame.image
          } else {
            // MISC (DOM objects render themselves later)
            continue
          }
          var uvs = this._uvs;
          var vertices = this._vertices;
          var texI = this._indices;
          var alphas = this._alphas;
          // calculate texture
          if (!image) {
            continue
          }
          if (image._storeID === undefined) {
            // this texture is new to us so load it and add it to the batch
            texture = this._loadTextureImage(gl, image);
            this._insertTextureInBatch(gl, texture)
          } else {
            // fetch the texture (render textures know how to look themselves up to simplify this logic)
            texture = this._textureDictionary[image._storeID];
            // put it in the batch if needed
            if (texture._batchID !== this._batchID) {
              this._insertTextureInBatch(gl, texture)
            }
          }
          texIndex = texture._activeIndex;
          if (item._webGLRenderStyle === 2 || item.cacheCanvas && !ignoreCache) {
            // BITMAP / Cached Canvas
            if (item.sourceRect) {
              // calculate uvs
              if (!item._uvRect) {
                item._uvRect = {}
              }
              src = item.sourceRect;
              uvRect = item._uvRect;
              uvRect.t = src.x / image.width;
              uvRect.l = src.y / image.height;
              uvRect.b = (src.x + src.width) / image.width;
              uvRect.r = (src.y + src.height) / image.height;
              // calculate vertices
              subL = 0;
              subT = 0;
              subR = src.width + subL;
              subB = src.height + subT
            } else {
              // calculate uvs
              // calculate vertices
              if (item.cacheCanvas) {
                src = item.bitmapCache;
                uvRect = StageGL.UV_RECT;
                subL = src.x;
                subT = src.y;
                subR = src.width + subL;
                subB = src.height + subT
              } else {
                uvRect = StageGL.UV_RECT;
                subL = 0;
                subT = 0;
                subR = image.width + subL;
                subB = image.height + subT
              }
            }
          } else if (item._webGLRenderStyle === 1) {
            // SPRITE
            var rect = frame.rect;
            // calculate uvs
            uvRect = frame.uvRect;
            if (!uvRect) {
              uvRect = StageGL.buildUVRects(item.spriteSheet, item.currentFrame, false)
            }
            // calculate vertices
            subL = -frame.regX;
            subT = -frame.regY;
            subR = rect.width - frame.regX;
            subB = rect.height - frame.regY
          }
          // These must be calculated here else a forced draw might happen after they're set
          var offV1 = this.batchCardCount * StageGL.INDICIES_PER_CARD; // offset for 1 component vectors
          var offV2 = offV1 * 2; // offset for 2 component vectors
          //DHG: See Matrix2D.transformPoint for why this math specifically
          // apply vertices
          vertices[offV2] = subL * iMtx.a + subT * iMtx.c + iMtx.tx;
          vertices[offV2 + 1] = subL * iMtx.b + subT * iMtx.d + iMtx.ty;
          vertices[offV2 + 2] = subL * iMtx.a + subB * iMtx.c + iMtx.tx;
          vertices[offV2 + 3] = subL * iMtx.b + subB * iMtx.d + iMtx.ty;
          vertices[offV2 + 4] = subR * iMtx.a + subT * iMtx.c + iMtx.tx;
          vertices[offV2 + 5] = subR * iMtx.b + subT * iMtx.d + iMtx.ty;
          vertices[offV2 + 6] = vertices[offV2 + 2];
          vertices[offV2 + 7] = vertices[offV2 + 3];
          vertices[offV2 + 8] = vertices[offV2 + 4];
          vertices[offV2 + 9] = vertices[offV2 + 5];
          vertices[offV2 + 10] = subR * iMtx.a + subB * iMtx.c + iMtx.tx;
          vertices[offV2 + 11] = subR * iMtx.b + subB * iMtx.d + iMtx.ty;
          // apply uvs
          uvs[offV2] = uvRect.l;
          uvs[offV2 + 1] = uvRect.t;
          uvs[offV2 + 2] = uvRect.l;
          uvs[offV2 + 3] = uvRect.b;
          uvs[offV2 + 4] = uvRect.r;
          uvs[offV2 + 5] = uvRect.t;
          uvs[offV2 + 6] = uvRect.l;
          uvs[offV2 + 7] = uvRect.b;
          uvs[offV2 + 8] = uvRect.r;
          uvs[offV2 + 9] = uvRect.t;
          uvs[offV2 + 10] = uvRect.r;
          uvs[offV2 + 11] = uvRect.b;
          // apply texture
          texI[offV1] = texI[offV1 + 1] = texI[offV1 + 2] = texI[offV1 + 3] = texI[offV1 + 4] = texI[offV1 + 5] = texIndex;
          // apply alpha
          alphas[offV1] = alphas[offV1 + 1] = alphas[offV1 + 2] = alphas[offV1 + 3] = alphas[offV1 + 4] = alphas[offV1 + 5] = item.alpha * concatAlpha;
          this.batchCardCount++
        }
      }
    }, {
      key: "_drawBuffers",
      /**
       * Draws all the currently defined cards in the buffer to the render surface.
       * @method _drawBuffers
       * @param {WebGLRenderingContext} gl The canvas WebGL context object to draw into.
       * @protected
       */
      value: function _drawBuffers(gl) {
        if (this.batchCardCount <= 0) {
          return
        } // prevents error spam on stages filled with unrenederable content.
        if (this.vocalDebug) {
          console.log("Draw[" + this._drawID + ":" + this._batchID + "] : " + this.batchReason)
        }
        var shaderProgram = this._activeShader;
        var vertexPositionBuffer = this._vertexPositionBuffer;
        var textureIndexBuffer = this._textureIndexBuffer;
        var uvPositionBuffer = this._uvPositionBuffer;
        var alphaBuffer = this._alphaBuffer;
        gl.useProgram(shaderProgram);
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this._vertices);
        gl.bindBuffer(gl.ARRAY_BUFFER, textureIndexBuffer);
        gl.vertexAttribPointer(shaderProgram.textureIndexAttribute, textureIndexBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this._indices);
        gl.bindBuffer(gl.ARRAY_BUFFER, uvPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.uvPositionAttribute, uvPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this._uvs);
        gl.bindBuffer(gl.ARRAY_BUFFER, alphaBuffer);
        gl.vertexAttribPointer(shaderProgram.alphaAttribute, alphaBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this._alphas);
        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, gl.FALSE, this._projectionMatrix);
        for (var i = 0; i < this._batchTextureCount; i++) {
          var texture = this._batchTextures[i];
          gl.activeTexture(gl.TEXTURE0 + i);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          this.setTextureParams(gl, texture.isPOT)
        }
        gl.drawArrays(gl.TRIANGLES, 0, this.batchCardCount * StageGL.INDICIES_PER_CARD);
        this._batchID++
      }
    }, {
      key: "_drawCover",
      /**
       * Draws a card that covers the entire render surface.
       * @method _drawBuffers
       * @param {WebGLRenderingContext} gl The canvas WebGL context object to draw into.
       * @param {Boolean} flipY Covers are used for things like RenderTextures and because of 3D vs Canvas space this can
       * end up meaning `y` sometimes, and requires flipping in the render
       * @protected
       */
      value: function _drawCover(gl, flipY) {
        if (this._isDrawing > 0) {
          this._drawBuffers(gl)
        }
        if (this.vocalDebug) {
          console.log("Draw[" + this._drawID + ":" + this._batchID + "] : Cover")
        }
        var shaderProgram = this._activeShader;
        var vertexPositionBuffer = this._vertexPositionBuffer;
        var uvPositionBuffer = this._uvPositionBuffer;
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(shaderProgram);
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, StageGL.COVER_VERT);
        gl.bindBuffer(gl.ARRAY_BUFFER, uvPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.uvPositionAttribute, uvPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flipY ? StageGL.COVER_UV_FLIP : StageGL.COVER_UV);
        gl.uniform1i(shaderProgram.samplerUniform, 0);
        gl.uniform1f(shaderProgram.uprightUniform, flipY ? 0 : 1);
        gl.drawArrays(gl.TRIANGLES, 0, StageGL.INDICIES_PER_CARD)
      }
    }, {
      key: "isWebGL",
      // accessor properties:
      /**
       * Indicates whether WebGL is being used for rendering. For example, this would be `false` if WebGL is not
       * supported in the browser.
       * @property isWebGL
       * @type {Boolean}
       * @readonly
       */
      get: function get() {
        return !!this._webGLContext
      }
    }, {
      key: "autoPurge",
      get: function get() {
        return Number(this._autoPurge)
      },
      set: function set(autoPurge) {
        autoPurge = isNaN(autoPurge) ? 1200 : autoPurge;
        if (autoPurge != -1 && autoPurge < 10) {
          autoPurge = 10
        }
        this._autoPurge = autoPurge
      }
    }], [{
      key: "buildUVRects",
      value: function buildUVRects(spritesheet) {
        var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;
        var onlyTarget = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        if (!spritesheet || !spritesheet._frames) {
          return null
        }
        var start = target != -1 && onlyTarget ? target : 0;
        var end = target != -1 && onlyTarget ? target + 1 : spritesheet._frames.length;
        for (var i = start; i < end; i++) {
          var f = spritesheet._frames[i];
          if (f.uvRect || f.image.width <= 0 || f.image.height <= 0) {
            continue
          }
          var r = f.rect;
          f.uvRect = {
            t: r.y / f.image.height,
            l: r.x / f.image.width,
            b: (r.y + r.height) / f.image.height,
            r: (r.x + r.width) / f.image.width
          }
        }
        return spritesheet._frames[target != -1 ? target : 0].uvRect || StageGL.UV_RECT
      }
    }, {
      key: "isWebGLActive",
      value: function isWebGLActive(ctx) {
        return ctx && ctx instanceof WebGLRenderingContext && typeof WebGLRenderingContext !== "undefined"
      }
    }]);
    return StageGL
  }(Stage); {
    StageGL.VERTEX_PROPERTY_COUNT = 6;
    StageGL.INDICIES_PER_CARD = 6;
    StageGL.DEFAULT_MAX_BATCH_SIZE = 1e4;
    StageGL.WEBGL_MAX_INDEX_NUM = Math.pow(2, 16);
    StageGL.UV_RECT = {
      t: 0,
      l: 0,
      b: 1,
      r: 1
    };
    StageGL.COVER_VERT = new Float32Array([-1, 1, // TL
      1, 1, // TR
      -1, -1, // BL
      1, 1, // TR
      1, -1, // BR
      -1, -1
    ]);
    StageGL.COVER_UV = new Float32Array([0, 0, // TL
      1, 0, // TR
      0, 1, // BL
      1, 0, // TR
      1, 1, // BR
      0, 1
    ]);
    StageGL.COVER_UV_FLIP = new Float32Array([0, 1, // TL
      1, 1, // TR
      0, 0, // BL
      1, 1, // TR
      1, 0, // BR
      0, 0
    ]);
    StageGL.REGULAR_VARYING_HEADER = "\n\t\tprecision mediump float;\n\t\tvarying vec2 vTextureCoord;\n\t\tvarying lowp float indexPicker;\n\t\tvarying lowp float alphaValue;\n\t";
    StageGL.REGULAR_VERTEX_HEADER = "\n\t\t" + StageGL.REGULAR_VARYING_HEADER + "\n\t\tattribute vec2 vertexPosition;\n\t\tattribute vec2 uvPosition;\n\t\tattribute lowp float textureIndex;\n\t\tattribute lowp float objectAlpha;\n\t\tuniform mat4 pMatrix;\n\t";
    StageGL.REGULAR_FRAGMENT_HEADER = "\n\t\t" + StageGL.REGULAR_VARYING_HEADER + "\n\t\tuniform sampler2D uSampler[{{count}}];\n\t";
    StageGL.REGULAR_VERTEX_BODY = "\n\t\tvoid main (void) {\n\t\t\t// DHG TODO: This doesn't work. Must be something wrong with the hand built matrix see js... bypass for now\n\t\t\t// vertexPosition, round if flag\n\t\t\t// gl_Position = pMatrix * vec4(vertexPosition.x, vertexPosition.y, 0.0, 1.0);\n\t\t\tgl_Position = vec4(\n\t\t\t\t(vertexPosition.x * pMatrix[0][0]) + pMatrix[3][0],\n\t\t\t\t(vertexPosition.y * pMatrix[1][1]) + pMatrix[3][1],\n\t\t\t\tpMatrix[3][2],\n\t\t\t\t1.0\n\t\t\t);\n\t\t\talphaValue = objectAlpha;\n\t\t\tindexPicker = textureIndex;\n\t\t\tvTextureCoord = uvPosition;\n\t\t}\n\t";
    StageGL.REGULAR_FRAGMENT_BODY = "\n\t\tvoid main (void) {\n\t\t\tint src = int(indexPicker);\n\t\t\tvec4 color = vec4(1.0, 0.0, 0.0, 1.0);\n\n\t\t\tif (src == 0) {\n\t\t\t\tcolor = texture2D(uSampler[0], vTextureCoord);\n\t\t\t\t{{alternates}}\n\t\t\t}\n\n\t\t\tgl_FragColor = vec4(color.rgb{{premultiply}}, color.a * alphaValue);\n\t\t}\n\t";
    StageGL.PARTICLE_VERTEX_BODY = "\n\t\t" + StageGL.REGULAR_VERTEX_BODY + "\n\t";
    StageGL.PARTICLE_FRAGMENT_BODY = "\n\t\t" + StageGL.REGULAR_FRAGMENT_BODY + "\n\t";
    StageGL.COVER_VARYING_HEADER = "\n\t\tprecision mediump float;\n\t\tvarying highp vec2 vRenderCoord;\n\t\tvarying highp vec2 vTextureCoord;\n\t";
    StageGL.COVER_VERTEX_HEADER = "\n\t\t" + StageGL.COVER_VARYING_HEADER + "\n\t\tattribute vec2 vertexPosition;\n\t\tattribute vec2 uvPosition;\n\t\tuniform float uUpright;\n\t";
    StageGL.COVER_FRAGMENT_HEADER = "\n\t\t" + StageGL.COVER_VARYING_HEADER + "\n\t\tuniform sampler2D uSampler;\n\t";
    StageGL.COVER_VERTEX_BODY = "\n\t\tvoid main (void) {\n\t\t\tgl_Position = vec4(vertexPosition.x, vertexPosition.y, 0.0, 1.0);\n\t\t\tvRenderCoord = uvPosition;\n\t\t\tvTextureCoord = vec2(uvPosition.x, abs(uUpright - uvPosition.y));\n\t\t}\n\t";
    StageGL.COVER_FRAGMENT_BODY = "\n\t\tvoid main (void) {\n\t\t\tvec4 color = texture2D(uSampler, vRenderCoord);\n\t\t\tgl_FragColor = color;\n\t\t}\n\t"
  }
  // events:
  /**
   * Dispatched each update immediately before the canvas is cleared and the display list is drawn to it.
   * You can call {{#crossLink "Event/preventDefault"}}{{/crossLink}} on the event to cancel the draw.
   * @event drawstart
   */
  /**
   * Dispatched each update immediately after the display list is drawn to the canvas and the canvas context is
   * restored.
   * @event drawend
   */
  // injected properties and methods:
  /*
   * We need to modify other classes, do this during our class initialization
   */
  (function _injectWebGLFunctionality() {
    //TODO: maybe re-examine this approach?
    // Set which classes are compatible with StageGL. The order is important!!!
    // Reflect any changes to the drawing loop
    var candidates = [Sprite, Bitmap];
    candidates.forEach(function (_class, index) {
      _class.prototype._webGLRenderStyle = index + 1
    });
    var bc = BitmapCache.prototype;
    /**
     * Functionality injected to {{#crossLink "BitmapCache"}}{{/crossLink}}. Ensure StageGL is loaded after all other
     * standard EaselJS classes are loaded but before making any DisplayObject instances for injection to take full effect.
     * Replaces the context2D cache draw with the option for WebGL or context2D drawing.
     * If options is set to "true" a StageGL is created and contained on the object for use when rendering a cache.
     * If options is a StageGL instance it will not create an instance but use the one provided.
     * If possible it is best to provide the StageGL instance that is a parent to this DisplayObject for performance reasons.
     * A StageGL cache does not infer the ability to draw objects a StageGL cannot currently draw,
     * i.e. do not use a WebGL context cache when caching a Shape, Text, etc.
     * <h4>Example</h4>
     * Using WebGL cache with a 2d context
     *
     *     var stage = new createjs.Stage();
     *     var bmp = new createjs.Bitmap(src);
     *     bmp.cache(0, 0, bmp.width, bmp.height, 1, true);          // no StageGL to use, so make one
     *     var shape = new createjs.Shape();
     *     shape.graphics.clear().fill("red").drawRect(0,0,20,20);
     *     shape.cache(0, 0, 20, 20, 1);                             // cannot use WebGL cache
     *
     * <h4>Example</h4>
     * Using WebGL cache with a WebGL context:
     *
     *     var stageGL = new createjs.StageGL();
     *     var bmp = new createjs.Bitmap(src);
     *     bmp.cache(0, 0, bmp.width, bmp.height, 1, stageGL);       // use our StageGL to cache
     *     var shape = new createjs.Shape();
     *     shape.graphics.clear().fill("red").drawRect(0,0,20,20);
     *     shape.cache(0, 0, 20, 20, 1);                             // cannot use WebGL cache
     *
     * You can make your own StageGL and have it render to a canvas if you set ".isCacheControlled" to true on your stage.
     * You may wish to create your own StageGL instance to control factors like background color/transparency, AA, and etc.
     * You must set "options" to its own stage if you wish to use the fast Render Textures available only to StageGLs.
     * If you use WebGL cache on a container with Shapes you will have to cache each shape individually before the container,
     * otherwise the WebGL cache will not render the shapes.
     * @public
     * @method BitmapCache.cache
     * @param {Number} x The x coordinate origin for the cache region.
     * @param {Number} y The y coordinate origin for the cache region.
     * @param {Number} width The width of the cache region.
     * @param {Number} height The height of the cache region.
     * @param {Number} [scale=1] The scale at which the cache will be created. For example, if you cache a vector shape using
     * 	myShape.cache(0,0,100,100,2) then the resulting cacheCanvas will be 200x200 px. This lets you scale and rotate
     * 	cached elements with greater fidelity. Default is 1.
     * @param {Boolean|StageGL} [options=undefined] Select whether to use context 2D, or WebGL rendering, and whether to make a new stage instance or use an existing one.
     * @for BitmapCache
     * @todo Doc the rest of BitmapCache
     */
    bc._updateSurfaceBASE = bc._updateSurface;
    bc._updateSurface = function () {
      if (!this._options) {
        this._updateSurfaceBASE();
        return
      }
      // create it if it's missing
      if (!this._webGLCache) {
        if (this._options === true || this.target.stage !== this._options) {
          // a StageGL dedicated to this cache
          this.target.cacheCanvas = document.createElement("canvas");
          this._webGLCache = new StageGL(this.target.cacheCanvas, {});
          this._webGLCache.isCacheControlled = true
        } else {
          // a StageGL re-used by this cache
          try {
            this.target.cacheCanvas = true; // we'll replace this with a render texture during the draw as it changes per draw
            this._webGLCache = this._options
          } catch (e) {
            throw "Invalid StageGL object used for cache param"
          }
        }
      }
      // now size render surfaces
      var stageGL = this._webGLCache;
      var surface = this.target.cacheCanvas;
      // if we have a dedicated stage we've gotta size it
      if (stageGL.isCacheControlled) {
        surface.width = this._drawWidth;
        surface.height = this._drawHeight;
        stageGL.updateViewport(this._drawWidth, this._drawHeight)
      }
      if (this.target.filters) {
        // with filters we can't tell how many we'll need but the most we'll ever need is two, so make them now
        stageGL.getTargetRenderTexture(this.target, this._drawWidth, this._drawHeight);
        stageGL.getTargetRenderTexture(this.target, this._drawWidth, this._drawHeight)
      } else {
        // without filters then we only need one RenderTexture, and that's only if its not a dedicated stage
        if (!stageGL.isCacheControlled) {
          stageGL.getTargetRenderTexture(this.target, this._drawWidth, this._drawHeight)
        }
      }
    };
    bc._drawToCacheBASE = bc._drawToCache;
    bc._drawToCache = function (compositeOperation) {
      var surface = this.target.cacheCanvas;
      var target = this.target;
      var webGL = this._webGLCache;
      if (!webGL) {
        this._drawToCacheBASE(compositeOperation);
        surface._invalid = true;
        return
      }
      //TODO: auto split blur into an x/y pass
      this._webGLCache.cacheDraw(target, target.filters, this);
      // NOTE: we may of swapped around which element the surface is, so we re-fetch it
      surface = this.target.cacheCanvas;
      surface.width = this._drawWidth;
      surface.height = this._drawHeight;
      surface._invalid = true
    };
    bc.releaseBASE = bc.release;
    bc.release = function () {
      if (this._webGLCache) {
        // if it isn't cache controlled clean up after yourself
        if (!this._webGLCache.isCacheControlled) {
          if (this.__lastRT) {
            this.__lastRT = undefined
          }
          if (this.__rtA) {
            this._webGLCache._killTextureObject(this.__rtA)
          }
          if (this.__rtB) {
            this._webGLCache._killTextureObject(this.__rtB)
          }
          if (this.target && this.target.cacheCanvas) {
            this._webGLCache._killTextureObject(this.target.cacheCanvas)
          }
        }
        // set the context to none and let the garbage collector get the rest when the canvas itself gets removed
        this._webGLCache = false
      } else {
        var stage = this.target.stage;
        if (stage instanceof StageGL) {
          stage.releaseTexture(this.target.cacheCanvas);
          this.target.cacheCanvas.remove()
        }
      }
      this.releaseBASE()
    }
  })();
  var _H_OFFSETS = {
    start: 0,
    left: 0,
    center: -.5,
    end: -1,
    right: -1
  };
  var _V_OFFSETS = {
    top: 0,
    hanging: -.01,
    middle: -.4,
    alphabetic: -.8,
    ideographic: -.85,
    bottom: -1
  };
  /**
   * Display one or more lines of dynamic text (not user editable) in the display list. Line wrapping support (using the
   * lineWidth) is very basic, wrapping on spaces and tabs only. Note that as an alternative to Text, you can position HTML
   * text above or below the canvas relative to items in the display list using the {{#crossLink "DisplayObject/localToGlobal"}}{{/crossLink}}
   * method, or using {{#crossLink "DOMElement"}}{{/crossLink}}.
   *
   * <b>Please note that Text does not support HTML text, and can only display one font style at a time.</b> To use
   * multiple font styles, you will need to create multiple text instances, and position them manually.
   *
   * <h4>Example</h4>
   *
   *      var text = new createjs.Text("Hello World", "20px Arial", "#ff7700");
   *      text.x = 100;
   *      text.textBaseline = "alphabetic";
   *
   * CreateJS Text supports web fonts (the same rules as Canvas). The font must be loaded and supported by the browser
   * before it can be displayed.
   *
   * <strong>Note:</strong> Text can be expensive to generate, so cache instances where possible. Be aware that not all
   * browsers will render Text exactly the same.
   * @class Text
   * @extends DisplayObject
   */
  var Text = function (_DisplayObject) {
    inherits(Text, _DisplayObject);
    // constructor:
    /**
     * @constructor
     * @param {String} [text] The text to display.
     * @param {String} [font] The font style to use. Any valid value for the CSS font attribute is acceptable (ex. "bold
     * 36px Arial").
     * @param {String} [color] The color to draw the text in. Any valid value for the CSS color attribute is acceptable (ex.
     * "#F00", "red", or "#FF0000").
     */
    function Text(text, font, color) {
      classCallCheck(this, Text);
      // public properties:
      /**
       * The text to display.
       * @property text
       * @type String
       */
      var _this = possibleConstructorReturn(this, (Text.__proto__ || Object.getPrototypeOf(Text)).call(this));
      _this.text = text;
      /**
       * The font style to use. Any valid value for the CSS font attribute is acceptable (ex. "bold 36px Arial").
       * @property font
       * @type String
       */
      _this.font = font;
      /**
       * The color to draw the text in. Any valid value for the CSS color attribute is acceptable (ex. "#F00"). Default is "#000".
       * It will also accept valid canvas fillStyle values.
       * @property color
       * @type String
       */
      _this.color = color;
      /**
       * The horizontal text alignment. Any of "start", "end", "left", "right", and "center". For detailed
       * information view the
       * <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#text-styles">
       * whatwg spec</a>. Default is "left".
       * @property textAlign
       * @type String
       */
      _this.textAlign = "left";
      /**
       * The vertical alignment point on the font. Any of "top", "hanging", "middle", "alphabetic", "ideographic", or
       * "bottom". For detailed information view the <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#text-styles">
       * whatwg spec</a>. Default is "top".
       * @property textBaseline
       * @type String
       */
      _this.textBaseline = "top";
      /**
       * The maximum width to draw the text. If maxWidth is specified (not null), the text will be condensed or
       * shrunk to make it fit in this width. For detailed information view the
       * <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#text-styles">
       * whatwg spec</a>.
       * @property maxWidth
       * @type Number
       */
      _this.maxWidth = null;
      /**
       * If greater than 0, the text will be drawn as a stroke (outline) of the specified width.
       * @property outline
       * @type Number
       */
      _this.outline = 0;
      /**
       * Indicates the line height (vertical distance between baselines) for multi-line text. If null or 0,
       * the value of getMeasuredLineHeight is used.
       * @property lineHeight
       * @type Number
       */
      _this.lineHeight = 0;
      /**
       * Indicates the maximum width for a line of text before it is wrapped to multiple lines. If null,
       * the text will not be wrapped.
       * @property lineWidth
       * @type Number
       */
      _this.lineWidth = null;
      return _this
    }
    // static constants:
    /**
     * Lookup table for the ratio to offset bounds x calculations based on the textAlign property.
     * @property H_OFFSETS
     * @type Object
     * @protected
     * @static
     */
    createClass(Text, [{
      key: "isVisible",
      // public methods:
      /**
       * Returns true or false indicating whether the display object would be visible if drawn to a canvas.
       * This does not account for whether it would be visible within the boundaries of the stage.
       * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
       * @method isVisible
       * @return {Boolean} Whether the display object would be visible if drawn to a canvas
       */
      value: function isVisible() {
        var hasContent = this.cacheCanvas || this.text != null && this.text !== "";
        return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent)
      }
    }, {
      key: "draw",
      value: function draw(ctx, ignoreCache) {
        if (get$1(Text.prototype.__proto__ || Object.getPrototypeOf(Text.prototype), "draw", this).call(this, ctx, ignoreCache)) {
          return true
        }
        var col = this.color || "#000";
        if (this.outline) {
          ctx.strokeStyle = col;
          ctx.lineWidth = this.outline * 1
        } else {
          ctx.fillStyle = col
        }
        this._drawText(this._prepContext(ctx));
        return true
      }
    }, {
      key: "getMeasuredWidth",
      value: function getMeasuredWidth() {
        return this._getMeasuredWidth(this.text)
      }
    }, {
      key: "getMeasuredLineHeight",
      value: function getMeasuredLineHeight() {
        return this._getMeasuredWidth("M") * 1.2
      }
    }, {
      key: "getMeasuredHeight",
      value: function getMeasuredHeight() {
        return this._drawText(null, {}).height
      }
    }, {
      key: "getBounds",
      value: function getBounds() {
        var rect = get$1(Text.prototype.__proto__ || Object.getPrototypeOf(Text.prototype), "getBounds", this).call(this);
        if (rect) {
          return rect
        }
        if (this.text == null || this.text === "") {
          return null
        }
        var o = this._drawText(null, {});
        var w = this.maxWidth && this.maxWidth < o.width ? this.maxWidth : o.width;
        var x = w * Text.H_OFFSETS[this.textAlign || "left"];
        var lineHeight = this.lineHeight || this.getMeasuredLineHeight();
        var y = lineHeight * Text.V_OFFSETS[this.textBaseline || "top"];
        return this._rectangle.setValues(x, y, w, o.height)
      }
    }, {
      key: "getMetrics",
      value: function getMetrics() {
        var o = {
          lines: []
        };
        o.lineHeight = this.lineHeight || this.getMeasuredLineHeight();
        o.vOffset = o.lineHeight * Text.V_OFFSETS[this.textBaseline || "top"];
        return this._drawText(null, o, o.lines)
      }
    }, {
      key: "clone",
      value: function clone() {
        return this._cloneProps(new Text(this.text, this.font, this.color))
      }
    }, {
      key: "toString",
      value: function toString() {
        return "[Text (text=" + (this.text.length > 20 ? this.text.substr(0, 17) + "..." : this.text) + ")]"
      }
    }, {
      key: "_cloneProps",
      value: function _cloneProps(o) {
        get$1(Text.prototype.__proto__ || Object.getPrototypeOf(Text.prototype), "_cloneProps", this).call(this, o);
        o.textAlign = this.textAlign;
        o.textBaseline = this.textBaseline;
        o.maxWidth = this.maxWidth;
        o.outline = this.outline;
        o.lineHeight = this.lineHeight;
        o.lineWidth = this.lineWidth;
        return o
      }
    }, {
      key: "_prepContext",
      value: function _prepContext(ctx) {
        ctx.font = this.font || "10px sans-serif";
        ctx.textAlign = this.textAlign || "left";
        ctx.textBaseline = this.textBaseline || "top";
        return ctx
      }
    }, {
      key: "_drawText",
      value: function _drawText(ctx, o, lines) {
        var paint = !!ctx;
        if (!paint) {
          ctx = Text._workingContext;
          ctx.save();
          this._prepContext(ctx)
        }
        var lineHeight = this.lineHeight || this.getMeasuredLineHeight();
        var maxW = 0,
          count = 0;
        var hardLines = String(this.text).split(/(?:\r\n|\r|\n)/);
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;
        try {
          for (var _iterator = hardLines[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var str = _step.value;
            var w = null;
            if (this.lineWidth != null && (w = ctx.measureText(str).width) > this.lineWidth) {
              // text wrapping:
              var words = str.split(/(\s)/);
              str = words[0];
              w = ctx.measureText(str).width;
              var l = words.length;
              for (var i = 1; i < l; i += 2) {
                // Line needs to wrap:
                var wordW = ctx.measureText(words[i] + words[i + 1]).width;
                if (w + wordW > this.lineWidth) {
                  if (paint) {
                    this._drawTextLine(ctx, str, count * lineHeight)
                  }
                  if (lines) {
                    lines.push(str)
                  }
                  if (w > maxW) {
                    maxW = w
                  }
                  str = words[i + 1];
                  w = ctx.measureText(str).width;
                  count++
                } else {
                  str += words[i] + words[i + 1];
                  w += wordW
                }
              }
            }
            if (paint) {
              this._drawTextLine(ctx, str, count * lineHeight)
            }
            if (lines) {
              lines.push(str)
            }
            if (o && w == null) {
              w = ctx.measureText(str).width
            }
            if (w > maxW) {
              maxW = w
            }
            count++
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return()
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError
            }
          }
        }
        if (o) {
          o.width = maxW;
          o.height = count * lineHeight
        }
        if (!paint) {
          ctx.restore()
        }
        return o
      }
    }, {
      key: "_drawTextLine",
      value: function _drawTextLine(ctx, text, y) {
        // Chrome 17 will fail to draw the text if the last param is included but null, so we feed it a large value instead:
        if (this.outline) {
          ctx.strokeText(text, 0, y, this.maxWidth || 65535)
        } else {
          ctx.fillText(text, 0, y, this.maxWidth || 65535)
        }
      }
    }, {
      key: "_getMeasuredWidth",
      value: function _getMeasuredWidth(text) {
        var ctx = Text._workingContext;
        ctx.save();
        var w = this._prepContext(ctx).measureText(text).width;
        ctx.restore();
        return w
      }
    }], [{
      key: "H_OFFSETS",
      get: function get() {
        return _H_OFFSETS
      }
    }, {
      key: "V_OFFSETS",
      get: function get() {
        return _V_OFFSETS
      }
    }]);
    return Text
  }(DisplayObject); {
    /**
     * @property _workingContext
     * @type CanvasRenderingContext2D
     * @private
     * @static
     */
    var canvas$2 = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas");
    if (canvas$2.getContext) {
      Text._workingContext = canvas$2.getContext("2d");
      canvas$2.width = canvas$2.height = 1
    }
  }
  /**
   * Applies a greyscale alpha map image (or canvas) to the target, such that the alpha channel of the result will
   * be copied from the red channel of the map, and the RGB channels will be copied from the target.
   *
   * Generally, it is recommended that you use {{#crossLink "AlphaMaskFilter"}}{{/crossLink}}, because it has much
   * better performance.
   *
   * <h4>Example</h4>
   * This example draws a red->blue box, caches it, and then uses the cache canvas as an alpha map on a 100x100 image.
   *
   *       var box = new createjs.Shape();
   *       box.graphics.beginLinearGradientFill(["#ff0000", "#0000ff"], [0, 1], 0, 0, 0, 100)
   *       box.graphics.drawRect(0, 0, 100, 100);
   *       box.cache(0, 0, 100, 100);
   *
   *       var bmp = new createjs.Bitmap("path/to/image.jpg");
   *       bmp.filters = [
   *           new createjs.AlphaMapFilter(box.cacheCanvas)
   *       ];
   *       bmp.cache(0, 0, 100, 100);
   *       stage.addChild(bmp);
   *
   * See {{#crossLink "Filter"}}{{/crossLink}} for more information on applying filters.
   * @class AlphaMapFilter
   * @extends Filter
   */
  var AlphaMapFilter = function (_Filter) {
    inherits(AlphaMapFilter, _Filter);
    // constructor:
    /**
     * @constructor
     * @param {HTMLImageElement|HTMLCanvasElement} alphaMap The greyscale image (or canvas) to use as the alpha value for the
     * result. This should be exactly the same dimensions as the target.
     */
    function AlphaMapFilter(alphaMap) {
      classCallCheck(this, AlphaMapFilter);
      // public properties:
      /**
       * The greyscale image (or canvas) to use as the alpha value for the result. This should be exactly the same
       * dimensions as the target.
       * @property alphaMap
       * @type HTMLImageElement|HTMLCanvasElement
       */
      var _this = possibleConstructorReturn(this, (AlphaMapFilter.__proto__ || Object.getPrototypeOf(AlphaMapFilter)).call(this));
      _this.alphaMap = alphaMap;
      // private properties:
      /**
       * @property _alphaMap
       * @protected
       * @type HTMLImageElement|HTMLCanvasElement
       */
      _this._alphaMap = null;
      /**
       * @property _mapData
       * @protected
       * @type Uint8ClampedArray
       */
      _this._mapData = null;
      _this._mapTexture = null;
      _this.FRAG_SHADER_BODY = "\n\t\t\tuniform sampler2D uAlphaSampler;\n\n\t\t\tvoid main (void) {\n\t\t\t\tvec4 color = texture2D(uSampler, vRenderCoord);\n\t\t\t\tvec4 alphaMap = texture2D(uAlphaSampler, vTextureCoord);\n\n\t\t\t\t// some image formats can have transparent white rgba(1,1,1, 0) when put on the GPU, this means we need a slight tweak\n\t\t\t\t// using ceil ensure that the colour will be used so long as it exists but pure transparency will be treated black\n\t\t\t\tgl_FragColor = vec4(color.rgb, color.a * (alphaMap.r * ceil(alphaMap.a)));\n\t\t\t}\n\t\t";
      return _this
    }
    /**
     * TODO: Docs
     */
    createClass(AlphaMapFilter, [{
      key: "shaderParamSetup",
      value: function shaderParamSetup(gl, stage, shaderProgram) {
        if (!this._mapTexture) {
          this._mapTexture = gl.createTexture()
        }
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this._mapTexture);
        stage.setTextureParams(gl);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.alphaMap);
        gl.uniform1i(gl.getUniformLocation(shaderProgram, "uAlphaSampler"), 1)
      }
    }, {
      key: "clone",
      value: function clone() {
        var o = new AlphaMapFilter(this.alphaMap);
        o._alphaMap = this._alphaMap;
        o._mapData = this._mapData;
        return o
      }
    }, {
      key: "_applyFilter",
      value: function _applyFilter(imageData) {
        if (!this.alphaMap) {
          return true
        }
        if (!this._prepAlphaMap()) {
          return false
        }
        // TODO: update to support scenarios where the target has different dimensions.
        var data = imageData.data;
        var map = this._mapData;
        var l = data.length;
        for (var i = 0; i < l; i += 4) {
          data[i + 3] = map[i] || 0
        }
        return true
      }
    }, {
      key: "_prepAlphaMap",
      value: function _prepAlphaMap() {
        if (!this.alphaMap) {
          return false
        }
        if (this.alphaMap == this._alphaMap && this._mapData) {
          return true
        }
        this._mapData = null;
        var map = this._alphaMap = this.alphaMap;
        var canvas = map;
        var ctx = void 0;
        if (map instanceof HTMLCanvasElement) {
          ctx = canvas.getContext("2d")
        } else {
          canvas = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas");
          canvas.width = map.width;
          canvas.height = map.height;
          ctx = canvas.getContext("2d");
          ctx.drawImage(map, 0, 0)
        }
        try {
          this._mapData = ctx.getImageData(0, 0, map.width, map.height).data;
          return true
        } catch (e) {
          //if (!this.suppressCrossDomainErrors) throw new Error("unable to access local image data: " + e);
          return false
        }
      }
    }]);
    return AlphaMapFilter
  }(Filter);
  /**
   * Applies the alpha from the mask image (or canvas) to the target, such that the alpha channel of the result will
   * be derived from the mask, and the RGB channels will be copied from the target. This can be used, for example, to
   * apply an alpha mask to a display object. This can also be used to combine a JPG compressed RGB image with a PNG32
   * alpha mask, which can result in a much smaller file size than a single PNG32 containing ARGB.
   *
   * <b>IMPORTANT NOTE: This filter currently does not support the targetCtx, or targetX/Y parameters correctly.</b>
   *
   * <h4>Example</h4>
   * This example draws a gradient box, then caches it and uses the "cacheCanvas" as the alpha mask on a 100x100 image.
   *
   *      var box = new createjs.Shape();
   *      box.graphics.beginLinearGradientFill(["#000000", "rgba(0, 0, 0, 0)"], [0, 1], 0, 0, 100, 100)
   *      box.graphics.drawRect(0, 0, 100, 100);
   *      box.cache(0, 0, 100, 100);
   *
   *      var bmp = new createjs.Bitmap("path/to/image.jpg");
   *      bmp.filters = [
   *          new createjs.AlphaMaskFilter(box.cacheCanvas)
   *      ];
   *      bmp.cache(0, 0, 100, 100);
   *
   * See {{#crossLink "Filter"}}{{/crossLink}} for more information on applying filters.
   * @class AlphaMaskFilter
   * @extends Filter
   */
  var AlphaMaskFilter = function (_Filter) {
    inherits(AlphaMaskFilter, _Filter);
    // constructor:
    /**
     * @constructor
     * @param {HTMLImageElement|HTMLCanvasElement} mask
     */
    function AlphaMaskFilter(mask) {
      classCallCheck(this, AlphaMaskFilter);
      // public properties:
      /**
       * The image (or canvas) to use as the mask.
       * @property mask
       * @type HTMLImageElement|HTMLCanvasElement
       */
      var _this = possibleConstructorReturn(this, (AlphaMaskFilter.__proto__ || Object.getPrototypeOf(AlphaMaskFilter)).call(this));
      _this.mask = mask;
      _this.FRAG_SHADER_BODY = "\n\t\t\tuniform sampler2D uAlphaSampler;\n\n\t\t\tvoid main (void) {\n\t\t\t\tvec4 color = texture2D(uSampler, vRenderCoord);\n\t\t\t\tvec4 alphaMap = texture2D(uAlphaSampler, vTextureCoord);\n\n\t\t\t\tgl_FragColor = vec4(color.rgb, color.a * alphaMap.a);\n\t\t\t}\n\t\t";
      return _this
    }
    // public methods:
    /**
     * Applies the filter to the specified context.
     *
     * <strong>IMPORTANT NOTE: This filter currently does not support the targetCtx, or targetX/Y parameters
     * correctly.</strong>
     * @method applyFilter
     * @param {CanvasRenderingContext2D} ctx The 2D context to use as the source.
     * @param {Number} x The x position to use for the source rect.
     * @param {Number} y The y position to use for the source rect.
     * @param {Number} width The width to use for the source rect.
     * @param {Number} height The height to use for the source rect.
     * @param {CanvasRenderingContext2D} [targetCtx] NOT SUPPORTED IN THIS FILTER. The 2D context to draw the result to. Defaults to the context passed to ctx.
     * @param {Number} [targetX] NOT SUPPORTED IN THIS FILTER. The x position to draw the result to. Defaults to the value passed to x.
     * @param {Number} [targetY] NOT SUPPORTED IN THIS FILTER. The y position to draw the result to. Defaults to the value passed to y.
     * @return {Boolean} If the filter was applied successfully.
     */
    createClass(AlphaMaskFilter, [{
      key: "applyFilter",
      value: function applyFilter(ctx, x, y, width, height, targetCtx, targetX, targetY) {
        if (!this.mask) {
          return true
        }
        targetCtx = targetCtx || ctx;
        if (targetX == null) {
          targetX = x
        }
        if (targetY == null) {
          targetY = y
        }
        targetCtx.save();
        if (ctx != targetCtx) {
          // TODO: support targetCtx and targetX/Y
          // clearRect, then draw the ctx in?
          return false
        }
        targetCtx.globalCompositeOperation = "destination-in";
        targetCtx.drawImage(this.mask, targetX, targetY);
        targetCtx.restore();
        return true
      }
    }, {
      key: "clone",
      value: function clone() {
        return new AlphaMaskFilter(this.mask)
      }
    }, {
      key: "shaderParamSetup",
      value: function shaderParamSetup(gl, stage, shaderProgram) {
        if (!this._mapTexture) {
          this._mapTexture = gl.createTexture()
        }
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this._mapTexture);
        stage.setTextureParams(gl);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.mask);
        gl.uniform1i(gl.getUniformLocation(shaderProgram, "uAlphaSampler"), 1)
      }
    }]);
    return AlphaMaskFilter
  }(Filter);
  var _MUL_TABLE = [1, 171, 205, 293, 57, 373, 79, 137, 241, 27, 391, 357, 41, 19, 283, 265, 497, 469, 443, 421, 25, 191, 365, 349, 335, 161, 155, 149, 9, 278, 269, 261, 505, 245, 475, 231, 449, 437, 213, 415, 405, 395, 193, 377, 369, 361, 353, 345, 169, 331, 325, 319, 313, 307, 301, 37, 145, 285, 281, 69, 271, 267, 263, 259, 509, 501, 493, 243, 479, 118, 465, 459, 113, 446, 55, 435, 429, 423, 209, 413, 51, 403, 199, 393, 97, 3, 379, 375, 371, 367, 363, 359, 355, 351, 347, 43, 85, 337, 333, 165, 327, 323, 5, 317, 157, 311, 77, 305, 303, 75, 297, 294, 73, 289, 287, 71, 141, 279, 277, 275, 68, 135, 67, 133, 33, 262, 260, 129, 511, 507, 503, 499, 495, 491, 61, 121, 481, 477, 237, 235, 467, 232, 115, 457, 227, 451, 7, 445, 221, 439, 218, 433, 215, 427, 425, 211, 419, 417, 207, 411, 409, 203, 202, 401, 399, 396, 197, 49, 389, 387, 385, 383, 95, 189, 47, 187, 93, 185, 23, 183, 91, 181, 45, 179, 89, 177, 11, 175, 87, 173, 345, 343, 341, 339, 337, 21, 167, 83, 331, 329, 327, 163, 81, 323, 321, 319, 159, 79, 315, 313, 39, 155, 309, 307, 153, 305, 303, 151, 75, 299, 149, 37, 295, 147, 73, 291, 145, 289, 287, 143, 285, 71, 141, 281, 35, 279, 139, 69, 275, 137, 273, 17, 271, 135, 269, 267, 133, 265, 33, 263, 131, 261, 130, 259, 129, 257, 1];
  var _SHG_TABLE = [0, 9, 10, 11, 9, 12, 10, 11, 12, 9, 13, 13, 10, 9, 13, 13, 14, 14, 14, 14, 10, 13, 14, 14, 14, 13, 13, 13, 9, 14, 14, 14, 15, 14, 15, 14, 15, 15, 14, 15, 15, 15, 14, 15, 15, 15, 15, 15, 14, 15, 15, 15, 15, 15, 15, 12, 14, 15, 15, 13, 15, 15, 15, 15, 16, 16, 16, 15, 16, 14, 16, 16, 14, 16, 13, 16, 16, 16, 15, 16, 13, 16, 15, 16, 14, 9, 16, 16, 16, 16, 16, 16, 16, 16, 16, 13, 14, 16, 16, 15, 16, 16, 10, 16, 15, 16, 14, 16, 16, 14, 16, 16, 14, 16, 16, 14, 15, 16, 16, 16, 14, 15, 14, 15, 13, 16, 16, 15, 17, 17, 17, 17, 17, 17, 14, 15, 17, 17, 16, 16, 17, 16, 15, 17, 16, 17, 11, 17, 16, 17, 16, 17, 16, 17, 17, 16, 17, 17, 16, 17, 17, 16, 16, 17, 17, 17, 16, 14, 17, 17, 17, 17, 15, 16, 14, 16, 15, 16, 13, 16, 15, 16, 14, 16, 15, 16, 12, 16, 15, 16, 17, 17, 17, 17, 17, 13, 16, 15, 17, 17, 17, 16, 15, 17, 17, 17, 16, 15, 17, 17, 14, 16, 17, 17, 16, 17, 17, 16, 15, 17, 16, 14, 17, 16, 15, 17, 16, 17, 17, 16, 17, 15, 16, 17, 14, 17, 16, 15, 17, 16, 17, 13, 17, 16, 17, 17, 16, 17, 14, 17, 16, 17, 16, 17, 16, 17, 9];
  /**
   * Applies a box blur to DisplayObjects. Note that this filter is fairly CPU intensive, particularly if the quality is
   * set higher than 1.
   *
   * <h4>Example</h4>
   * This example creates a red circle, and then applies a 5 pixel blur to it. It uses the {{#crossLink "Filter/getBounds"}}{{/crossLink}}
   * method to account for the spread that the blur causes.
   *
   *      let shape = new createjs.Shape().set({x:100,y:100});
   *      shape.graphics.beginFill("#ff0000").drawCircle(0,0,50);
   *
   *      let blurFilter = new createjs.BlurFilter(5, 5, 1);
   *      shape.filters = [blurFilter];
   *      let bounds = blurFilter.getBounds();
   *
   *      shape.cache(-50+bounds.x, -50+bounds.y, 100+bounds.width, 100+bounds.height);
   *
   * See {{#crossLink "Filter"}}{{/crossLink}} for an more information on applying filters.
   * @class BlurFilter
   * @extends Filter
   */
  var BlurFilter = function (_Filter) {
    inherits(BlurFilter, _Filter);
    // constructor:
    /**
     * @constructor
     * @param {Number} [blurX=0] The horizontal blur radius in pixels.
     * @param {Number} [blurY=0] The vertical blur radius in pixels.
     * @param {Number} [quality=1] The number of blur iterations.
     */
    function BlurFilter() {
      var blurX = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var blurY = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var quality = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
      classCallCheck(this, BlurFilter);
      // public properties:
      /**
       * Horizontal blur radius in pixels
       * @property blurX
       * @default 0
       * @type Number
       */
      var _this = possibleConstructorReturn(this, (BlurFilter.__proto__ || Object.getPrototypeOf(BlurFilter)).call(this));
      _this._blurX = blurX;
      _this._blurXTable = [];
      /**
       * Vertical blur radius in pixels
       * @property blurY
       * @default 0
       * @type Number
       */
      _this._blurY = blurY;
      _this._blurYTable = [];
      /**
       * Number of blur iterations. For example, a value of 1 will produce a rough blur. A value of 2 will produce a
       * smoother blur, but take twice as long to run.
       * @property quality
       * @default 1
       * @type Number
       */
      _this._quality;
      /**
       * This is a template to generate the shader for {{#crossLink FRAG_SHADER_BODY}}{{/crossLink}}
       */
      _this.FRAG_SHADER_TEMPLATE = "\n\t\t\tuniform float xWeight[{{blurX}}];\n\t\t\tuniform float yWeight[{{blurY}}];\n\t\t\tuniform vec2 textureOffset;\n\t\t\tvoid main (void) {\n\t\t\t\tvec4 color = vec4(0.0);\n\n\t\t\t\tfloat xAdj = ({{blurX}}.0-1.0)/2.0;\n\t\t\t\tfloat yAdj = ({{blurY}}.0-1.0)/2.0;\n\t\t\t\tvec2 sampleOffset;\n\n\t\t\t\tfor(int i=0; i<{{blurX}}; i++) {\n\t\t\t\t\tfor(int j=0; j<{{blurY}}; j++) {\n\t\t\t\t\t\tsampleOffset = vRenderCoord + (textureOffset * vec2(float(i)-xAdj, float(j)-yAdj));\n\t\t\t\t\t\tcolor += texture2D(uSampler, sampleOffset) * (xWeight[i] * yWeight[j]);\n\t\t\t\t\t}\n\t\t\t\t}\n\n\t\t\t\tgl_FragColor = color.rgba;\n\t\t\t}\n\t\t";
      _this.quality = isNaN(quality) || quality < 1 ? 1 : quality;
      return _this
    }
    // constants:
    /**
     * Array of multiply values for blur calculations.
     * @property MUL_TABLE
     * @type Array
     * @protected
     * @static
     */
    createClass(BlurFilter, [{
      key: "updateShader",
      // public methods:
      /**
       *
       */
      value: function updateShader() {
        var result = this.FRAG_SHADER_TEMPLATE;
        result = result.replace(/{{blurX}}/g, this._blurXTable.length.toFixed(0));
        result = result.replace(/{{blurY}}/g, this._blurYTable.length.toFixed(0));
        this.FRAG_SHADER_BODY = result
      }
    }, {
      key: "shaderParamSetup",
      value: function shaderParamSetup(gl, stage, shaderProgram) {
        // load the normalized gaussian weight tables
        gl.uniform1fv(gl.getUniformLocation(shaderProgram, "xWeight"), this._blurXTable);
        gl.uniform1fv(gl.getUniformLocation(shaderProgram, "yWeight"), this._blurYTable);
        // what is the size of a single pixel in -1, 1 (webGL) space
        gl.uniform2f(gl.getUniformLocation(shaderProgram, "textureOffset"), 2 / (stage._viewportWidth * this._quality), 2 / (stage._viewportHeight * this._quality))
      }
    }, {
      key: "getBounds",
      value: function getBounds(rect) {
        var x = this.blurX | 0,
          y = this.blurY | 0;
        if (x <= 0 && y <= 0) {
          return rect
        }
        var q = Math.pow(this.quality, .2);
        return (rect || new Rectangle).pad(x * q + 1, y * q + 1, x * q + 1, y * q + 1)
      }
    }, {
      key: "clone",
      value: function clone() {
        return new BlurFilter(this.blurX, this.blurY, this.quality)
      }
    }, {
      key: "_getTable",
      value: function _getTable(spread) {
        var EDGE = 4.2;
        if (spread <= 1) {
          return [1]
        }
        var result = [];
        var count = Math.ceil(spread * 2);
        count += count % 2 ? 0 : 1;
        var adjust = count / 2 | 0;
        for (var i = -adjust; i <= adjust; i++) {
          var x = i / adjust * EDGE;
          result.push(1 / Math.sqrt(2 * Math.PI) * Math.pow(Math.E, -(Math.pow(x, 2) / 4)))
        }
        var factor = result.reduce(function (a, b) {
          return a + b
        }, 0);
        return result.map(function (currentValue) {
          return currentValue / factor
        })
      }
    }, {
      key: "_applyFilter",
      value: function _applyFilter(imageData) {
        var radiusX = this._blurX >> 1;
        if (isNaN(radiusX) || radiusX < 0) return false;
        var radiusY = this._blurY >> 1;
        if (isNaN(radiusY) || radiusY < 0) return false;
        if (radiusX == 0 && radiusY == 0) return false;
        var iterations = this.quality;
        if (isNaN(iterations) || iterations < 1) iterations = 1;
        iterations |= 0;
        if (iterations > 3) iterations = 3;
        if (iterations < 1) iterations = 1;
        var px = imageData.data;
        var x = 0,
          y = 0,
          i = 0,
          p = 0,
          yp = 0,
          yi = 0,
          yw = 0,
          r = 0,
          g = 0,
          b = 0,
          a = 0,
          pr = 0,
          pg = 0,
          pb = 0,
          pa = 0;
        var divx = radiusX + radiusX + 1 | 0;
        var divy = radiusY + radiusY + 1 | 0;
        var w = imageData.width | 0;
        var h = imageData.height | 0;
        var w1 = w - 1 | 0;
        var h1 = h - 1 | 0;
        var rxp1 = radiusX + 1 | 0;
        var ryp1 = radiusY + 1 | 0;
        var ssx = {
          r: 0,
          b: 0,
          g: 0,
          a: 0
        };
        var sx = ssx;
        for (i = 1; i < divx; i++) {
          sx = sx.n = {
            r: 0,
            b: 0,
            g: 0,
            a: 0
          }
        }
        sx.n = ssx;
        var ssy = {
          r: 0,
          b: 0,
          g: 0,
          a: 0
        };
        var sy = ssy;
        for (i = 1; i < divy; i++) {
          sy = sy.n = {
            r: 0,
            b: 0,
            g: 0,
            a: 0
          }
        }
        sy.n = ssy;
        var si = null;
        var mtx = BlurFilter.MUL_TABLE[radiusX] | 0;
        var stx = BlurFilter.SHG_TABLE[radiusX] | 0;
        var mty = BlurFilter.MUL_TABLE[radiusY] | 0;
        var sty = BlurFilter.SHG_TABLE[radiusY] | 0;
        while (iterations-- > 0) {
          yw = yi = 0;
          var ms = mtx;
          var ss = stx;
          for (y = h; --y > -1;) {
            r = rxp1 * (pr = px[yi | 0]);
            g = rxp1 * (pg = px[yi + 1 | 0]);
            b = rxp1 * (pb = px[yi + 2 | 0]);
            a = rxp1 * (pa = px[yi + 3 | 0]);
            sx = ssx;
            for (i = rxp1; --i > -1;) {
              sx.r = pr;
              sx.g = pg;
              sx.b = pb;
              sx.a = pa;
              sx = sx.n
            }
            for (i = 1; i < rxp1; i++) {
              p = yi + ((w1 < i ? w1 : i) << 2) | 0;
              r += sx.r = px[p];
              g += sx.g = px[p + 1];
              b += sx.b = px[p + 2];
              a += sx.a = px[p + 3];
              sx = sx.n
            }
            si = ssx;
            for (x = 0; x < w; x++) {
              px[yi++] = r * ms >>> ss;
              px[yi++] = g * ms >>> ss;
              px[yi++] = b * ms >>> ss;
              px[yi++] = a * ms >>> ss;
              p = yw + ((p = x + radiusX + 1) < w1 ? p : w1) << 2;
              r -= si.r - (si.r = px[p]);
              g -= si.g - (si.g = px[p + 1]);
              b -= si.b - (si.b = px[p + 2]);
              a -= si.a - (si.a = px[p + 3]);
              si = si.n
            }
            yw += w
          }
          ms = mty;
          ss = sty;
          for (x = 0; x < w; x++) {
            yi = x << 2 | 0;
            r = ryp1 * (pr = px[yi]) | 0;
            g = ryp1 * (pg = px[yi + 1 | 0]) | 0;
            b = ryp1 * (pb = px[yi + 2 | 0]) | 0;
            a = ryp1 * (pa = px[yi + 3 | 0]) | 0;
            sy = ssy;
            for (i = 0; i < ryp1; i++) {
              sy.r = pr;
              sy.g = pg;
              sy.b = pb;
              sy.a = pa;
              sy = sy.n
            }
            yp = w;
            for (i = 1; i <= radiusY; i++) {
              yi = yp + x << 2;
              r += sy.r = px[yi];
              g += sy.g = px[yi + 1];
              b += sy.b = px[yi + 2];
              a += sy.a = px[yi + 3];
              sy = sy.n;
              if (i < h1) {
                yp += w
              }
            }
            yi = x;
            si = ssy;
            if (iterations > 0) {
              for (y = 0; y < h; y++) {
                p = yi << 2;
                px[p + 3] = pa = a * ms >>> ss;
                if (pa > 0) {
                  px[p] = r * ms >>> ss;
                  px[p + 1] = g * ms >>> ss;
                  px[p + 2] = b * ms >>> ss
                } else {
                  px[p] = px[p + 1] = px[p + 2] = 0
                }
                p = x + ((p = y + ryp1) < h1 ? p : h1) * w << 2;
                r -= si.r - (si.r = px[p]);
                g -= si.g - (si.g = px[p + 1]);
                b -= si.b - (si.b = px[p + 2]);
                a -= si.a - (si.a = px[p + 3]);
                si = si.n;
                yi += w
              }
            } else {
              for (y = 0; y < h; y++) {
                p = yi << 2;
                px[p + 3] = pa = a * ms >>> ss;
                if (pa > 0) {
                  pa = 255 / pa;
                  px[p] = (r * ms >>> ss) * pa;
                  px[p + 1] = (g * ms >>> ss) * pa;
                  px[p + 2] = (b * ms >>> ss) * pa
                } else {
                  px[p] = px[p + 1] = px[p + 2] = 0
                }
                p = x + ((p = y + ryp1) < h1 ? p : h1) * w << 2;
                r -= si.r - (si.r = px[p]);
                g -= si.g - (si.g = px[p + 1]);
                b -= si.b - (si.b = px[p + 2]);
                a -= si.a - (si.a = px[p + 3]);
                si = si.n;
                yi += w
              }
            }
          }
        }
        return true
      }
    }, {
      key: "blurX",
      // accessor properties:
      // TODO: Docs for these.
      get: function get() {
        return this._blurX
      },
      set: function set(blurX) {
        if (isNaN(blurX) || blurX < 0) {
          blurX = 0
        }
        this._blurX = blurX;
        this._blurXTable = this._getTable(blurX * this._quality);
        this.updateShader()
      }
    }, {
      key: "blurY",
      get: function get() {
        return this._blurY
      },
      set: function set(blurY) {
        if (isNaN(blurY) || blurY < 0) {
          blurY = 0
        }
        this._blurY = blurY;
        this._blurYTable = this._getTable(blurY * this._quality);
        this.updateShader()
      }
    }, {
      key: "quality",
      get: function get() {
        return this._quality
      },
      set: function set(quality) {
        this._quality = quality;
        this._blurXTable = this._getTable(this._blurX * this._quality);
        this._blurYTable = this._getTable(this._blurY * this._quality);
        this.updateShader()
      }
    }], [{
      key: "MUL_TABLE",
      get: function get() {
        return _MUL_TABLE
      }
    }, {
      key: "SHG_TABLE",
      get: function get() {
        return _SHG_TABLE
      }
    }]);
    return BlurFilter
  }(Filter);
  /**
   * Applies a color transform to DisplayObjects.
   *
   * <h4>Example</h4>
   * This example draws a red circle, and then transforms it to Blue. This is accomplished by multiplying all the channels
   * to 0 (except alpha, which is set to 1), and then adding 255 to the blue channel.
   *
   *      var shape = new createjs.Shape().set({x:100,y:100});
   *      shape.graphics.beginFill("#ff0000").drawCircle(0,0,50);
   *
   *      shape.filters = [
   *          new createjs.ColorFilter(0,0,0,1, 0,0,255,0)
   *      ];
   *      shape.cache(-50, -50, 100, 100);
   *
   * See {{#crossLink "Filter"}}{{/crossLink}} for an more information on applying filters.
   * @class ColorFilter
   * @extends Filter
   */
  var ColorFilter = function (_Filter) {
    inherits(ColorFilter, _Filter);
    // constructor:
    /**
     * @constructor
     * @param {Number} [redMultiplier=1] The amount to multiply against the red channel. This is a range between 0 and 1.
     * @param {Number} [greenMultiplier=1] The amount to multiply against the green channel. This is a range between 0 and 1.
     * @param {Number} [blueMultiplier=1] The amount to multiply against the blue channel. This is a range between 0 and 1.
     * @param {Number} [alphaMultiplier=1] The amount to multiply against the alpha channel. This is a range between 0 and 1.
     * @param {Number} [redOffset=0] The amount to add to the red channel after it has been multiplied. This is a range
     * between -255 and 255.
     * @param {Number} [greenOffset=0] The amount to add to the green channel after it has been multiplied. This is a range
     * between -255 and 255.
     * @param {Number} [blueOffset=0] The amount to add to the blue channel after it has been multiplied. This is a range
     * between -255 and 255.
     * @param {Number} [alphaOffset=0] The amount to add to the alpha channel after it has been multiplied. This is a range
     * between -255 and 255.
     */
    function ColorFilter() {
      var redMultiplier = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var greenMultiplier = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var blueMultiplier = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
      var alphaMultiplier = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
      var redOffset = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
      var greenOffset = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
      var blueOffset = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
      var alphaOffset = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 0;
      classCallCheck(this, ColorFilter);
      // public properties:
      /**
       * Red channel multiplier.
       * @property redMultiplier
       * @type Number
       */
      var _this = possibleConstructorReturn(this, (ColorFilter.__proto__ || Object.getPrototypeOf(ColorFilter)).call(this));
      _this.redMultiplier = redMultiplier;
      /**
       * Green channel multiplier.
       * @property greenMultiplier
       * @type Number
       */
      _this.greenMultiplier = greenMultiplier;
      /**
       * Blue channel multiplier.
       * @property blueMultiplier
       * @type Number
       */
      _this.blueMultiplier = blueMultiplier;
      /**
       * Alpha channel multiplier.
       * @property alphaMultiplier
       * @type Number
       */
      _this.alphaMultiplier = alphaMultiplier;
      /**
       * Red channel offset (added to value).
       * @property redOffset
       * @type Number
       */
      _this.redOffset = redOffset;
      /**
       * Green channel offset (added to value).
       * @property greenOffset
       * @type Number
       */
      _this.greenOffset = greenOffset;
      /**
       * Blue channel offset (added to value).
       * @property blueOffset
       * @type Number
       */
      _this.blueOffset = blueOffset;
      /**
       * Alpha channel offset (added to value).
       * @property alphaOffset
       * @type Number
       */
      _this.alphaOffset = alphaOffset;
      _this.FRAG_SHADER_BODY = "\n\t\t\tuniform vec4 uColorMultiplier;\n\t\t\tuniform vec4 uColorOffset;\n\n\t\t\tvoid main (void) {\n\t\t\t\tvec4 color = texture2D(uSampler, vRenderCoord);\n\n\t\t\t\tgl_FragColor = (color * uColorMultiplier) + uColorOffset;\n\t\t\t}\n\t\t";
      return _this
    }
    // public methods:
    createClass(ColorFilter, [{
      key: "shaderParamSetup",
      value: function shaderParamSetup(gl, stage, shaderProgram) {
        gl.uniform4f(gl.getUniformLocation(shaderProgram, "uColorMultiplier"), this.redMultiplier, this.greenMultiplier, this.blueMultiplier, this.alphaMultiplier);
        gl.uniform4f(gl.getUniformLocation(shaderProgram, "uColorOffset"), this.redOffset / 255, this.greenOffset / 255, this.blueOffset / 255, this.alphaOffset / 255)
      }
    }, {
      key: "clone",
      value: function clone() {
        return new ColorFilter(this.redMultiplier, this.greenMultiplier, this.blueMultiplier, this.alphaMultiplier, this.redOffset, this.greenOffset, this.blueOffset, this.alphaOffset)
      }
    }, {
      key: "_applyFilter",
      value: function _applyFilter(imageData) {
        var data = imageData.data;
        var l = data.length;
        for (var i = 0; i < l; i += 4) {
          data[i] = data[i] * this.redMultiplier + this.redOffset;
          data[i + 1] = data[i + 1] * this.greenMultiplier + this.greenOffset;
          data[i + 2] = data[i + 2] * this.blueMultiplier + this.blueOffset;
          data[i + 3] = data[i + 3] * this.alphaMultiplier + this.alphaOffset
        }
        return true
      }
    }]);
    return ColorFilter
  }(Filter);
  var _DELTA_INDEX = [0, .01, .02, .04, .05, .06, .07, .08, .1, .11, .12, .14, .15, .16, .17, .18, .2, .21, .22, .24, .25, .27, .28, .3, .32, .34, .36, .38, .4, .42, .44, .46, .48, .5, .53, .56, .59, .62, .65, .68, .71, .74, .77, .8, .83, .86, .89, .92, .95, .98, 1, 1.06, 1.12, 1.18, 1.24, 1.3, 1.36, 1.42, 1.48, 1.54, 1.6, 1.66, 1.72, 1.78, 1.84, 1.9, 1.96, 2, 2.12, 2.25, 2.37, 2.5, 2.62, 2.75, 2.87, 3, 3.2, 3.4, 3.6, 3.8, 4, 4.3, 4.7, 4.9, 5, 5.5, 6, 6.5, 6.8, 7, 7.3, 7.5, 7.8, 8, 8.4, 8.7, 9, 9.4, 9.6, 9.8, 10];
  var _IDENTITY_MATRIX = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1];
  var _LENGTH = 25;
  /**
   * Provides helper functions for assembling a matrix for use with the {{#crossLink "ColorMatrixFilter"}}{{/crossLink}}.
   * Most methods return the instance to facilitate chained calls.
   *
   * <h4>Example</h4>
   *
   *      myColorMatrix.adjustHue(20).adjustBrightness(50);
   *
   * See {{#crossLink "Filter"}}{{/crossLink}} for an example of how to apply filters, or {{#crossLink "ColorMatrixFilter"}}{{/crossLink}}
   * for an example of how to use ColorMatrix to change a DisplayObject's color.
   * @class ColorMatrix
   */
  var ColorMatrix = function () {
    // constructor:
    /**
     * @constructor
     * @param {Number} brightness
     * @param {Number} contrast
     * @param {Number} saturation
     * @param {Number} hue
     */
    function ColorMatrix(brightness, contrast, saturation, hue) {
      classCallCheck(this, ColorMatrix);
      this.setColor(brightness, contrast, saturation, hue)
    }
    // constants:
    /**
     * Array of delta values for contrast calculations.
     * @property DELTA_INDEX
     * @type Array
     * @protected
     * @static
     */
    createClass(ColorMatrix, [{
      key: "setColor",
      // public methods:
      /**
       * Resets the instance with the specified values.
       * @method setColor
       * @param {Number} brightness
       * @param {Number} contrast
       * @param {Number} saturation
       * @param {Number} hue
       * @return {ColorMatrix} The ColorMatrix instance the method is called on (useful for chaining calls.)
       * @chainable
       */
      value: function setColor(brightness, contrast, saturation, hue) {
        return this.reset().adjustColor(brightness, contrast, saturation, hue)
      }
    }, {
      key: "reset",
      value: function reset() {
        return this.copy(ColorMatrix.IDENTITY_MATRIX)
      }
    }, {
      key: "adjustColor",
      value: function adjustColor(brightness, contrast, saturation, hue) {
        this.adjustHue(hue);
        this.adjustContrast(contrast);
        this.adjustBrightness(brightness);
        return this.adjustSaturation(saturation)
      }
    }, {
      key: "adjustBrightness",
      value: function adjustBrightness(value) {
        if (value == 0 || isNaN(value)) {
          return this
        }
        value = this._cleanValue(value, 255);
        this._multiplyMatrix([1, 0, 0, 0, value, 0, 1, 0, 0, value, 0, 0, 1, 0, value, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1]);
        return this
      }
    }, {
      key: "adjustContrast",
      value: function adjustContrast(value) {
        if (value == 0 || isNaN(value)) {
          return this
        }
        value = this._cleanValue(value, 100);
        var x = void 0;
        if (value < 0) {
          x = 127 + value / 100 * 127
        } else {
          x = value % 1;
          if (x == 0) {
            x = ColorMatrix.DELTA_INDEX[value]
          } else {
            x = ColorMatrix.DELTA_INDEX[value << 0] * (1 - x) + ColorMatrix.DELTA_INDEX[(value << 0) + 1] * x
          }
          x = x * 127 + 127
        }
        this._multiplyMatrix([x / 127, 0, 0, 0, .5 * (127 - x), 0, x / 127, 0, 0, .5 * (127 - x), 0, 0, x / 127, 0, .5 * (127 - x), 0, 0, 0, 1, 0, 0, 0, 0, 0, 1]);
        return this
      }
    }, {
      key: "adjustSaturation",
      value: function adjustSaturation(value) {
        if (value == 0 || isNaN(value)) {
          return this
        }
        value = this._cleanValue(value, 100);
        var x = 1 + (value > 0 ? 3 * value / 100 : value / 100);
        var lumR = .3086;
        var lumG = .6094;
        var lumB = .082;
        this._multiplyMatrix([lumR * (1 - x) + x, lumG * (1 - x), lumB * (1 - x), 0, 0, lumR * (1 - x), lumG * (1 - x) + x, lumB * (1 - x), 0, 0, lumR * (1 - x), lumG * (1 - x), lumB * (1 - x) + x, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1]);
        return this
      }
    }, {
      key: "adjustHue",
      value: function adjustHue(value) {
        if (value == 0 || isNaN(value)) {
          return this
        }
        value = this._cleanValue(value, 180) / 180 * Math.PI;
        var cosVal = Math.cos(value);
        var sinVal = Math.sin(value);
        var lumR = .213;
        var lumG = .715;
        var lumB = .072;
        this._multiplyMatrix([lumR + cosVal * (1 - lumR) + sinVal * -lumR, lumG + cosVal * -lumG + sinVal * -lumG, lumB + cosVal * -lumB + sinVal * (1 - lumB), 0, 0, lumR + cosVal * -lumR + sinVal * .143, lumG + cosVal * (1 - lumG) + sinVal * .14, lumB + cosVal * -lumB + sinVal * -.283, 0, 0, lumR + cosVal * -lumR + sinVal * -(1 - lumR), lumG + cosVal * -lumG + sinVal * lumG, lumB + cosVal * (1 - lumB) + sinVal * lumB, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1]);
        return this
      }
    }, {
      key: "concat",
      value: function concat(matrix) {
        matrix = this._fixMatrix(matrix);
        if (matrix.length != ColorMatrix.LENGTH) {
          return this
        }
        this._multiplyMatrix(matrix);
        return this
      }
    }, {
      key: "clone",
      value: function clone() {
        return (new ColorMatrix).copy(this)
      }
    }, {
      key: "toArray",
      value: function toArray() {
        var arr = [];
        var l = ColorMatrix.LENGTH;
        for (var i = 0; i < l; i++) {
          arr[i] = this[i]
        }
        return arr
      }
    }, {
      key: "copy",
      value: function copy(matrix) {
        var l = ColorMatrix.LENGTH;
        for (var i = 0; i < l; i++) {
          this[i] = matrix[i]
        }
        return this
      }
    }, {
      key: "toString",
      value: function toString() {
        return "[ColorMatrix]"
      }
    }, {
      key: "_multiplyMatrix",
      value: function _multiplyMatrix(matrix) {
        var col = [];
        for (var i = 0; i < 5; i++) {
          for (var j = 0; j < 5; j++) {
            col[j] = this[j + i * 5]
          }
          for (var _j = 0; _j < 5; _j++) {
            var val = 0;
            for (var k = 0; k < 5; k++) {
              val += matrix[_j + k * 5] * col[k]
            }
            this[_j + i * 5] = val
          }
        }
      }
    }, {
      key: "_cleanValue",
      value: function _cleanValue(value, limit) {
        return Math.min(limit, Math.max(-limit, value))
      }
    }, {
      key: "_fixMatrix",
      value: function _fixMatrix(matrix) {
        if (matrix instanceof ColorMatrix) {
          matrix = matrix.toArray()
        }
        if (matrix.length < ColorMatrix.LENGTH) {
          matrix = matrix.slice(0, matrix.length).concat(ColorMatrix.IDENTITY_MATRIX.slice(matrix.length, ColorMatrix.LENGTH))
        } else if (matrix.length > ColorMatrix.LENGTH) {
          matrix = matrix.slice(0, ColorMatrix.LENGTH)
        }
        return matrix
      }
    }], [{
      key: "DELTA_INDEX",
      get: function get() {
        return _DELTA_INDEX
      }
    }, {
      key: "IDENTITY_MATRIX",
      get: function get() {
        return _IDENTITY_MATRIX
      }
    }, {
      key: "LENGTH",
      get: function get() {
        return _LENGTH
      }
    }]);
    return ColorMatrix
  }();
  /**
   * Allows you to carry out complex color operations such as modifying saturation, brightness, or inverting. See the
   * {{#crossLink "ColorMatrix"}}{{/crossLink}} for more information on changing colors. For an easier color transform,
   * consider the {{#crossLink "ColorFilter"}}{{/crossLink}}.
   *
   * <h4>Example</h4>
   * This example creates a red circle, inverts its hue, and then saturates it to brighten it up.
   *
   *      var shape = new createjs.Shape().set({x:100,y:100});
   *      shape.graphics.beginFill("#ff0000").drawCircle(0,0,50);
   *
   *      var matrix = new createjs.ColorMatrix().adjustHue(180).adjustSaturation(100);
   *      shape.filters = [
   *          new createjs.ColorMatrixFilter(matrix)
   *      ];
   *
   *      shape.cache(-50, -50, 100, 100);
   *
   * See {{#crossLink "Filter"}}{{/crossLink}} for an more information on applying filters.
   * @class ColorMatrixFilter
   * @extends Filter
   */
  var ColorMatrixFilter = function (_Filter) {
    inherits(ColorMatrixFilter, _Filter);
    // constructor:
    /**
     * @constructor
     * @param {Array | ColorMatrix} matrix A 4x5 matrix describing the color operation to perform. See also the {{#crossLink "ColorMatrix"}}{{/crossLink}}
     * class.
     */
    function ColorMatrixFilter(matrix) {
      classCallCheck(this, ColorMatrixFilter);
      // public properties:
      /**
       * A 4x5 matrix describing the color operation to perform. See also the {{#crossLink "ColorMatrix"}}{{/crossLink}}
       * @property matrix
       * @type Array | ColorMatrix
       */
      var _this = possibleConstructorReturn(this, (ColorMatrixFilter.__proto__ || Object.getPrototypeOf(ColorMatrixFilter)).call(this));
      _this.matrix = matrix;
      _this.FRAG_SHADER_BODY = "\n\t\t\tuniform mat4 uColorMatrix;\n\t\t\tuniform vec4 uColorMatrixOffset;\n\n\t\t\tvoid main (void) {\n\t\t\t\tvec4 color = texture2D(uSampler, vRenderCoord);\n\n\t\t\t\tmat4 m = uColorMatrix;\n\t\t\t\tvec4 newColor = vec4(0,0,0,0);\n\t\t\t\tnewColor.r = color.r*m[0][0] + color.g*m[0][1] + color.b*m[0][2] + color.a*m[0][3];\n\t\t\t\tnewColor.g = color.r*m[1][0] + color.g*m[1][1] + color.b*m[1][2] + color.a*m[1][3];\n\t\t\t\tnewColor.b = color.r*m[2][0] + color.g*m[2][1] + color.b*m[2][2] + color.a*m[2][3];\n\t\t\t\tnewColor.a = color.r*m[3][0] + color.g*m[3][1] + color.b*m[3][2] + color.a*m[3][3];\n\n\t\t\t\tgl_FragColor = newColor + uColorMatrixOffset;\n\t\t\t}\n\t\t";
      return _this
    }
    // public methods:
    createClass(ColorMatrixFilter, [{
      key: "shaderParamSetup",
      value: function shaderParamSetup(gl, stage, shaderProgram) {
        var mat = this.matrix;
        var colorMatrix = new Float32Array([mat[0], mat[1], mat[2], mat[3], mat[5], mat[6], mat[7], mat[8], mat[10], mat[11], mat[12], mat[13], mat[15], mat[16], mat[17], mat[18]]);
        gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "uColorMatrix"), false, colorMatrix);
        gl.uniform4f(gl.getUniformLocation(shaderProgram, "uColorMatrixOffset"), mat[4] / 255, mat[9] / 255, mat[14] / 255, mat[19] / 255)
      }
    }, {
      key: "clone",
      value: function clone() {
        return new ColorMatrixFilter(this.matrix)
      }
    }, {
      key: "_applyFilter",
      value: function _applyFilter(imageData) {
        var data = imageData.data;
        var l = data.length;
        var r = void 0,
          g = void 0,
          b = void 0,
          a = void 0;
        var mtx = this.matrix;
        var m0 = mtx[0],
          m1 = mtx[1],
          m2 = mtx[2],
          m3 = mtx[3],
          m4 = mtx[4];
        var m5 = mtx[5],
          m6 = mtx[6],
          m7 = mtx[7],
          m8 = mtx[8],
          m9 = mtx[9];
        var m10 = mtx[10],
          m11 = mtx[11],
          m12 = mtx[12],
          m13 = mtx[13],
          m14 = mtx[14];
        var m15 = mtx[15],
          m16 = mtx[16],
          m17 = mtx[17],
          m18 = mtx[18],
          m19 = mtx[19];
        for (var i = 0; i < l; i += 4) {
          r = data[i];
          g = data[i + 1];
          b = data[i + 2];
          a = data[i + 3];
          data[i] = r * m0 + g * m1 + b * m2 + a * m3 + m4; // red
          data[i + 1] = r * m5 + g * m6 + b * m7 + a * m8 + m9; // green
          data[i + 2] = r * m10 + g * m11 + b * m12 + a * m13 + m14; // blue
          data[i + 3] = r * m15 + g * m16 + b * m17 + a * m18 + m19
        }
        return true
      }
    }]);
    return ColorMatrixFilter
  }(Filter);
  /**
   * The ButtonHelper is a helper class to create interactive buttons from {{#crossLink "MovieClip"}}{{/crossLink}} or
   * {{#crossLink "Sprite"}}{{/crossLink}} instances. This class will intercept mouse events from an object, and
   * automatically call {{#crossLink "Sprite/gotoAndStop"}}{{/crossLink}} or {{#crossLink "Sprite/gotoAndPlay"}}{{/crossLink}},
   * to the respective animation labels, add a pointer cursor, and allows the user to define a hit state frame.
   *
   * The ButtonHelper instance does not need to be added to the stage, but a reference should be maintained to prevent
   * garbage collection.
   *
   * Note that over states will not work unless you call {{#crossLink "Stage/enableMouseOver"}}{{/crossLink}}.
   *
   * <h4>Example</h4>
   *
   *      var helper = new createjs.ButtonHelper(myInstance, "out", "over", "down", false, myInstance, "hit");
   *      myInstance.addEventListener("click", handleClick);
   *      function handleClick(event) {
   *          // Click Happened.
   *      }
   *
   * @class ButtonHelper
   */
  var ButtonHelper = function () {
    // constructor:
    /**
     * @constructor
     * @param {Sprite|MovieClip} target The instance to manage.
     * @param {String} [outLabel="out"] The label or animation to go to when the user rolls out of the button.
     * @param {String} [overLabel="over"] The label or animation to go to when the user rolls over the button.
     * @param {String} [downLabel="down"] The label or animation to go to when the user presses the button.
     * @param {Boolean} [play=false] If the helper should call "gotoAndPlay" or "gotoAndStop" on the button when changing
     * states.
     * @param {DisplayObject} [hitArea] An optional item to use as the hit state for the button. If this is not defined,
     * then the button's visible states will be used instead. Note that the same instance as the "target" argument can be
     * used for the hitState.
     * @param {String} [hitLabel] The label or animation on the hitArea instance that defines the hitArea bounds. If this is
     * null, then the default state of the hitArea will be used. *
     */
    function ButtonHelper(target) {
      var outLabel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "out";
      var overLabel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "over";
      var downLabel = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "down";
      var play = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
      var hitArea = arguments[5];
      var hitLabel = arguments[6];
      classCallCheck(this, ButtonHelper);
      if (!target.addEventListener) {
        return
      }
      // public properties:
      /**
       * The target for this button helper.
       * @property target
       * @type MovieClip | Sprite
       * @readonly
       */
      this.target = target;
      /**
       * The label name or frame number to display when the user mouses out of the target. Defaults to "over".
       * @property overLabel
       * @type String | Number
       */
      this.overLabel = overLabel;
      /**
       * The label name or frame number to display when the user mouses over the target. Defaults to "out".
       * @property outLabel
       * @type String | Number
       */
      this.outLabel = outLabel;
      /**
       * The label name or frame number to display when the user presses on the target. Defaults to "down".
       * @property downLabel
       * @type String | Number
       */
      this.downLabel = downLabel == null;
      /**
       * If true, then ButtonHelper will call gotoAndPlay, if false, it will use gotoAndStop. Default is false.
       * @property play
       * @default false
       * @type Boolean
       */
      this.play = play;
      //  private properties
      /**
       * @property _isPressed
       * @type Boolean
       * @protected
       */
      this._isPressed = false;
      /**
       * @property _isOver
       * @type Boolean
       * @protected
       */
      this._isOver = false;
      /**
       * @property _enabled
       * @type Boolean
       * @protected
       */
      this._enabled = false;
      // setup:
      target.mouseChildren = false; // prevents issues when children are removed from the display list when state changes.
      this.enabled = true;
      this.handleEvent({});
      if (hitArea) {
        if (hitLabel) {
          hitArea.actionsEnabled = false;
          hitArea.gotoAndStop && hitArea.gotoAndStop(hitLabel)
        }
        target.hitArea = hitArea
      }
    }
    // accessor properties:
    /**
     * Enables or disables the button functionality on the target.
     * @property enabled
     * @type {Boolean}
     */
    createClass(ButtonHelper, [{
      key: "toString",
      // public methods:
      /**
       * Returns a string representation of this object.
       * @method toString
       * @return {String} a string representation of the instance.
       */
      value: function toString() {
        return "[ButtonHelper]"
      }
    }, {
      key: "handleEvent",
      value: function handleEvent(evt) {
        var label = void 0,
          t = this.target,
          type = evt.type;
        if (type == "mousedown") {
          this._isPressed = true;
          label = this.downLabel
        } else if (type == "pressup") {
          this._isPressed = false;
          label = this._isOver ? this.overLabel : this.outLabel
        } else if (type == "rollover") {
          this._isOver = true;
          label = this._isPressed ? this.downLabel : this.overLabel
        } else {
          // rollout and default
          this._isOver = false;
          label = this._isPressed ? this.overLabel : this.outLabel
        }
        if (this.play) {
          t.gotoAndPlay && t.gotoAndPlay(label)
        } else {
          t.gotoAndStop && t.gotoAndStop(label)
        }
      }
    }, {
      key: "_reset",
      value: function _reset() {
        // TODO: explore better ways to handle this issue. This is hacky & disrupts object signatures.
        var p = this.paused;
        this.__reset();
        this.paused = p
      }
    }, {
      key: "enabled",
      get: function get() {
        return this._enabled
      },
      set: function set(enabled) {
        if (enabled == this._enabled) {
          return
        }
        var o = this.target;
        this._enabled = enabled;
        if (enabled) {
          o.cursor = "pointer";
          o.addEventListener("rollover", this);
          o.addEventListener("rollout", this);
          o.addEventListener("mousedown", this);
          o.addEventListener("pressup", this);
          if (o._reset) {
            o.__reset = o._reset;
            o._reset = this._reset
          }
        } else {
          o.cursor = null;
          o.removeEventListener("rollover", this);
          o.removeEventListener("rollout", this);
          o.removeEventListener("mousedown", this);
          o.removeEventListener("pressup", this);
          if (o.__reset) {
            o._reset = o.__reset;
            delete o.__reset
          }
        }
      }
    }]);
    return ButtonHelper
  }();
  /**
   * Global utility for working with multi-touch enabled devices in EaselJS. Currently supports W3C Touch API (iOS and
   * modern Android browser) and the Pointer API (IE), including ms-prefixed events in IE10, and unprefixed in IE11.
   *
   * Ensure that you {{#crossLink "Touch/disable"}}{{/crossLink}} touch when cleaning up your application. You do not have
   * to check if touch is supported to enable it, as it will fail gracefully if it is not supported.
   *
   * <h4>Example</h4>
   *
   *      var stage = new createjs.Stage("canvasId");
   *      createjs.Touch.enable(stage);
   *
   * <strong>Note:</strong> It is important to disable Touch on a stage that you are no longer using:
   *
   *      createjs.Touch.disable(stage);
   *
   * @class Touch
   * @static
   */
  var Touch = function () {
    // constructor:
    /**
     * @constructor
     */
    function Touch() {
      classCallCheck(this, Touch);
      throw "Touch cannot be instantiated"
    }
    // public static methods:
    /**
     * Returns `true` if touch is supported in the current browser.
     * @method isSupported
     * @return {Boolean} Indicates whether touch is supported in the current browser.
     * @static
     */
    createClass(Touch, null, [{
      key: "isSupported",
      value: function isSupported() { // iOS & Android
        return !!("ontouchstart" in window || window.navigator["msPointerEnabled"] && window.navigator["msMaxTouchPoints"] > 0 || window.navigator["pointerEnabled"] && window.navigator["maxTouchPoints"] > 0)
      }
    }, {
      key: "enable",
      value: function enable(stage) {
        var singleTouch = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var allowDefault = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        if (!stage || !stage.canvas || !Touch.isSupported()) {
          return false
        }
        if (stage.__touch) {
          return true
        }
        // inject required properties on stage:
        stage.__touch = {
          pointers: {},
          multitouch: !singleTouch,
          preventDefault: !allowDefault,
          count: 0
        };
        // note that in the future we may need to disable the standard mouse event model before adding
        // these to prevent duplicate calls. It doesn't seem to be an issue with iOS devices though.
        if ("ontouchstart" in window) {
          Touch._IOS_enable(stage)
        } else if (window.navigator["msPointerEnabled"] || window.navigator["pointerEnabled"]) {
          Touch._IE_enable(stage)
        }
        return true
      }
    }, {
      key: "disable",
      value: function disable(stage) {
        if (!stage) {
          return
        }
        if ("ontouchstart" in window) {
          Touch._IOS_disable(stage)
        } else if (window.navigator["msPointerEnabled"] || window.navigator["pointerEnabled"]) {
          Touch._IE_disable(stage)
        }
        delete stage.__touch
      }
    }, {
      key: "_IOS_enable",
      value: function _IOS_enable(stage) {
        var canvas = stage.canvas;
        var f = stage.__touch.f = function (e) {
          return Touch._IOS_handleEvent(stage, e)
        };
        canvas.addEventListener("touchstart", f, false);
        canvas.addEventListener("touchmove", f, false);
        canvas.addEventListener("touchend", f, false);
        canvas.addEventListener("touchcancel", f, false)
      }
    }, {
      key: "_IOS_disable",
      value: function _IOS_disable(stage) {
        var canvas = stage.canvas;
        if (!canvas) {
          return
        }
        var f = stage.__touch.f;
        canvas.removeEventListener("touchstart", f, false);
        canvas.removeEventListener("touchmove", f, false);
        canvas.removeEventListener("touchend", f, false);
        canvas.removeEventListener("touchcancel", f, false)
      }
    }, {
      key: "_IOS_handleEvent",
      value: function _IOS_handleEvent(stage, e) {
        if (!stage) {
          return
        }
        if (stage.__touch.preventDefault) {
          e.preventDefault && e.preventDefault()
        }
        var touches = e.changedTouches;
        var type = e.type;
        var l = touches.length;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;
        try {
          for (var _iterator = touches[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var touch = _step.value;
            var id = touch.identifier;
            if (touch.target != stage.canvas) {
              continue
            }
            if (type == "touchstart") {
              this._handleStart(stage, id, e, touch.pageX, touch.pageY)
            } else if (type == "touchmove") {
              this._handleMove(stage, id, e, touch.pageX, touch.pageY)
            } else if (type == "touchend" || type == "touchcancel") {
              this._handleEnd(stage, id, e)
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return()
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError
            }
          }
        }
      }
    }, {
      key: "_IE_enable",
      value: function _IE_enable(stage) {
        var canvas = stage.canvas;
        var f = stage.__touch.f = function (e) {
          return Touch._IE_handleEvent(stage, e)
        };
        if (window.navigator["pointerEnabled"] === undefined) {
          canvas.addEventListener("MSPointerDown", f, false);
          window.addEventListener("MSPointerMove", f, false);
          window.addEventListener("MSPointerUp", f, false);
          window.addEventListener("MSPointerCancel", f, false);
          if (stage.__touch.preventDefault) {
            canvas.style.msTouchAction = "none"
          }
        } else {
          canvas.addEventListener("pointerdown", f, false);
          window.addEventListener("pointermove", f, false);
          window.addEventListener("pointerup", f, false);
          window.addEventListener("pointercancel", f, false);
          if (stage.__touch.preventDefault) {
            canvas.style.touchAction = "none"
          }
        }
        stage.__touch.activeIDs = {}
      }
    }, {
      key: "_IE_disable",
      value: function _IE_disable(stage) {
        var f = stage.__touch.f;
        if (window.navigator["pointerEnabled"] === undefined) {
          window.removeEventListener("MSPointerMove", f, false);
          window.removeEventListener("MSPointerUp", f, false);
          window.removeEventListener("MSPointerCancel", f, false);
          if (stage.canvas) {
            stage.canvas.removeEventListener("MSPointerDown", f, false)
          }
        } else {
          window.removeEventListener("pointermove", f, false);
          window.removeEventListener("pointerup", f, false);
          window.removeEventListener("pointercancel", f, false);
          if (stage.canvas) {
            stage.canvas.removeEventListener("pointerdown", f, false)
          }
        }
      }
    }, {
      key: "_IE_handleEvent",
      value: function _IE_handleEvent(stage, e) {
        if (!stage) {
          return
        }
        if (stage.__touch.preventDefault) {
          e.preventDefault && e.preventDefault()
        }
        var type = e.type;
        var id = e.pointerId;
        var ids = stage.__touch.activeIDs;
        if (type == "MSPointerDown" || type == "pointerdown") {
          if (e.srcElement != stage.canvas) {
            return
          }
          ids[id] = true;
          this._handleStart(stage, id, e, e.pageX, e.pageY)
        } else if (ids[id]) {
          // it's an id we're watching
          if (type == "MSPointerMove" || type == "pointermove") {
            this._handleMove(stage, id, e, e.pageX, e.pageY)
          } else if (type == "MSPointerUp" || type == "MSPointerCancel" || type == "pointerup" || type == "pointercancel") {
            delete ids[id];
            this._handleEnd(stage, id, e)
          }
        }
      }
    }, {
      key: "_handleStart",
      value: function _handleStart(stage, id, e, x, y) {
        var props = stage.__touch;
        if (!props.multitouch && props.count) {
          return
        }
        var ids = props.pointers;
        if (ids[id]) {
          return
        }
        ids[id] = true;
        props.count++;
        stage._handlePointerDown(id, e, x, y)
      }
    }, {
      key: "_handleMove",
      value: function _handleMove(stage, id, e, x, y) {
        if (!stage.__touch.pointers[id]) {
          return
        }
        stage._handlePointerMove(id, e, x, y)
      }
    }, {
      key: "_handleEnd",
      value: function _handleEnd(stage, id, e) {
        // TODO: cancel should be handled differently for proper UI (ex. an up would trigger a click, a cancel would more closely resemble an out).
        var props = stage.__touch;
        var ids = props.pointers;
        if (!ids[id]) {
          return
        }
        props.count--;
        stage._handlePointerUp(id, e, true);
        delete ids[id]
      }
    }]);
    return Touch
  }();
  var _ERR_DIMENSIONS = "frame dimensions exceed max spritesheet dimensions";
  var _ERR_RUNNING = "a build is already running";
  /**
   * The SpriteSheetBuilder allows you to generate {{#crossLink "SpriteSheet"}}{{/crossLink}} instances at run time
   * from any display object. This can allow you to maintain your assets as vector graphics (for low file size), and
   * render them at run time as SpriteSheets for better performance.
   *
   * SpriteSheets can be built either synchronously, or asynchronously, so that large SpriteSheets can be generated
   * without locking the UI.
   *
   * Note that the "images" used in the generated SpriteSheet are actually canvas elements, and that they will be
   * sized to the nearest power of 2 up to the value of {{#crossLink "SpriteSheetBuilder/maxWidth:property"}}{{/crossLink}}
   * or {{#crossLink "SpriteSheetBuilder/maxHeight:property"}}{{/crossLink}}.
   * @class SpriteSheetBuilder
   * @param {Number} [framerate=0] The {{#crossLink "SpriteSheet/framerate:property"}}{{/crossLink}} of
   * {{#crossLink "SpriteSheet"}}{{/crossLink}} instances that are created.
   * @extends EventDispatcher
   */
  var SpriteSheetBuilder = function (_EventDispatcher) {
    inherits(SpriteSheetBuilder, _EventDispatcher);
    // constructor:
    /**
     * @constructor
     * @param {Number} [framerate=0] The {{#crossLink "SpriteSheet/framerate:property"}}{{/crossLink}} of
     * {{#crossLink "SpriteSheet"}}{{/crossLink}} instances that are created.
     */
    function SpriteSheetBuilder() {
      var framerate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      classCallCheck(this, SpriteSheetBuilder);
      // public properties:
      /**
       * The maximum width for the images (not individual frames) in the generated SpriteSheet. It is recommended to
       * use a power of 2 for this value (ex. 1024, 2048, 4096). If the frames cannot all fit within the max
       * dimensions, then additional images will be created as needed.
       * @property maxWidth
       * @type Number
       * @default 2048
       */
      var _this = possibleConstructorReturn(this, (SpriteSheetBuilder.__proto__ || Object.getPrototypeOf(SpriteSheetBuilder)).call(this));
      _this.maxWidth = 2048;
      /**
       * The maximum height for the images (not individual frames) in the generated SpriteSheet. It is recommended to
       * use a power of 2 for this value (ex. 1024, 2048, 4096). If the frames cannot all fit within the max
       * dimensions, then additional images will be created as needed.
       * @property maxHeight
       * @type Number
       * @default 2048
       */
      _this.maxHeight = 2048;
      /**
       * The SpriteSheet that was generated. This will be null before a build is completed successfully.
       * @property spriteSheet
       * @type SpriteSheet
       */
      _this.spriteSheet = null;
      /**
       * The scale to apply when drawing all frames to the SpriteSheet. This is multiplied against any scale specified
       * in the addFrame call. This can be used, for example, to generate a SpriteSheet at run time that is tailored
       * to the a specific device resolution (ex. tablet vs mobile).
       * @property scale
       * @type Number
       * @default 1
       */
      _this.scale = 1;
      /**
       * The padding to use between frames. This is helpful to preserve antialiasing on drawn vector content.
       * @property padding
       * @type Number
       * @default 1
       */
      _this.padding = 1;
      /**
       * A number from 0.01 to 0.99 that indicates what percentage of time the builder can use. This can be
       * thought of as the number of seconds per second the builder will use. For example, with a timeSlice value of 0.3,
       * the builder will run 20 times per second, using approximately 15ms per build (30% of available time, or 0.3s per second).
       * Defaults to 0.3.
       * @property timeSlice
       * @type Number
       * @default 0.3
       */
      _this.timeSlice = .3;
      /**
       * A value between 0 and 1 that indicates the progress of a build, or -1 if a build has not
       * been initiated.
       * @property progress
       * @type Number
       * @default -1
       * @readonly
       */
      _this.progress = -1;
      /**
       * A {{#crossLink "SpriteSheet/framerate:property"}}{{/crossLink}} value that will be passed to new {{#crossLink "SpriteSheet"}}{{/crossLink}} instances that are
       * created. If no framerate is specified (or it is 0), then SpriteSheets will use the {{#crossLink "Ticker"}}{{/crossLink}}
       * framerate.
       * @property framerate
       * @type Number
       * @default 0
       */
      _this.framerate = framerate;
      // private properties:
      /**
       * @property _frames
       * @protected
       * @type Array
       */
      _this._frames = [];
      /**
       * @property _animations
       * @protected
       * @type Array
       */
      _this._animations = {};
      /**
       * @property _data
       * @protected
       * @type Array
       */
      _this._data = null;
      /**
       * @property _nextFrameIndex
       * @protected
       * @type Number
       */
      _this._nextFrameIndex = 0;
      /**
       * @property _index
       * @protected
       * @type Number
       */
      _this._index = 0;
      /**
       * @property _timerID
       * @protected
       * @type Number
       */
      _this._timerID = null;
      /**
       * @property _scale
       * @protected
       * @type Number
       */
      _this._scale = 1;
      return _this
    }
    // constants:
    createClass(SpriteSheetBuilder, [{
      key: "addFrame",
      // public methods:
      /**
       * Adds a frame to the {{#crossLink "SpriteSheet"}}{{/crossLink}}. Note that the frame will not be drawn until you
       * call {{#crossLink "SpriteSheetBuilder/build"}}{{/crossLink}} method. The optional setup params allow you to have
       * a function run immediately before the draw occurs. For example, this allows you to add a single source multiple
       * times, but manipulate it or its children to change it to generate different frames.
       *
       * Note that the source's transformations (x, y, scale, rotate, alpha) will be ignored, except for regX/Y. To apply
       * transforms to a source object and have them captured in the SpriteSheet, simply place it into a {{#crossLink "Container"}}{{/crossLink}}
       * and pass in the Container as the source.
       * @method addFrame
       * @param {DisplayObject} source The source {{#crossLink "DisplayObject"}}{{/crossLink}}  to draw as the frame.
       * @param {Rectangle} [sourceRect] A {{#crossLink "Rectangle"}}{{/crossLink}} defining the portion of the
       * source to draw to the frame. If not specified, it will look for a `getBounds` method, bounds property, or
       * `nominalBounds` property on the source to use. If one is not found, the frame will be skipped.
       * @param {Number} [scale=1] Optional. The scale to draw this frame at. Default is 1.
       * @param {Function} [setupFunction] A function to call immediately before drawing this frame. It will be called with two parameters: the source, and setupData.
       * @param {Object} [setupData] Arbitrary setup data to pass to setupFunction as the second parameter.
       * @return {Number} The index of the frame that was just added, or null if a sourceRect could not be determined.
       */
      value: function addFrame(source, sourceRect) {
        var scale = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
        var setupFunction = arguments[3];
        var setupData = arguments[4];
        if (this._data) {
          throw SpriteSheetBuilder.ERR_RUNNING
        }
        var rect = sourceRect || source.bounds || source.nominalBounds || source.getBounds && source.getBounds();
        if (!rect) {
          return null
        }
        return this._frames.push({
          source: source,
          sourceRect: rect,
          scale: scale,
          funct: setupFunction,
          data: setupData,
          index: this._frames.length,
          height: rect.height * scale
        }) - 1
      }
    }, {
      key: "addAnimation",
      value: function addAnimation(name, frames, next, speed) {
        if (this._data) {
          throw SpriteSheetBuilder.ERR_RUNNING
        }
        this._animations[name] = {
          frames: frames,
          next: next,
          speed: speed
        }
      }
    }, {
      key: "addMovieClip",
      value: function addMovieClip(source, sourceRect) {
        var scale = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
        var setupFunction = arguments[3];
        var setupData = arguments[4];
        var labelFunction = arguments[5];
        if (this._data) {
          throw SpriteSheetBuilder.ERR_RUNNING
        }
        var rects = source.frameBounds;
        var rect = sourceRect || source.bounds || source.nominalBounds || source.getBounds && source.getBounds();
        if (!rect && !rects) {
          return
        }
        var baseFrameIndex = this._frames.length;
        var duration = source.timeline.duration;
        for (var i = 0; i < duration; i++) {
          var r = rects && rects[i] ? rects[i] : rect;
          this.addFrame(source, r, scale, this._setupMovieClipFrame, {
            i: i,
            f: setupFunction,
            d: setupData
          })
        }
        var labels = source.timeline._labels;
        var lbls = [];
        for (var n in labels) {
          lbls.push({
            index: labels[n],
            label: n
          })
        }
        if (lbls.length) {
          lbls.sort(function (a, b) {
            return a.index - b.index
          });
          for (var _i = 0, l = lbls.length; _i < l; _i++) {
            var label = lbls[_i].label;
            var start = baseFrameIndex + lbls[_i].index;
            var end = baseFrameIndex + (_i == l - 1 ? duration : lbls[_i + 1].index);
            var frames = [];
            for (var _i2 = start; _i2 < end; _i2++) {
              frames.push(_i2)
            }
            if (labelFunction) {
              label = labelFunction(label, source, start, end);
              if (!label) {
                continue
              }
            }
            this.addAnimation(label, frames, true)
          }
        }
      }
    }, {
      key: "build",
      value: function build() {
        if (this._data) {
          throw SpriteSheetBuilder.ERR_RUNNING
        }
        this._startBuild();
        while (this._drawNext()) {}
        this._endBuild();
        return this.spriteSheet
      }
    }, {
      key: "buildAsync",
      value: function buildAsync(timeSlice) {
        var _this2 = this;
        if (this._data) {
          throw SpriteSheetBuilder.ERR_RUNNING
        }
        this.timeSlice = timeSlice;
        this._startBuild();
        this._timerID = setTimeout(function () {
          return _this2._run()
        }, 50 - Math.max(.01, Math.min(.99, this.timeSlice || .3)) * 50)
      }
    }, {
      key: "stopAsync",
      value: function stopAsync() {
        clearTimeout(this._timerID);
        this._data = null
      }
    }, {
      key: "clone",
      value: function clone() {
        throw "SpriteSheetBuilder cannot be cloned."
      }
    }, {
      key: "toString",
      value: function toString() {
        return "[SpriteSheetBuilder]"
      }
    }, {
      key: "_startBuild",
      value: function _startBuild() {
        var pad = this.padding || 0;
        this.progress = 0;
        this.spriteSheet = null;
        this._index = 0;
        this._scale = this.scale;
        var dataFrames = [];
        this._data = {
          images: [],
          frames: dataFrames,
          framerate: this.framerate,
          animations: this._animations
        };
        var frames = this._frames.slice();
        frames.sort(function (a, b) {
          return a.height <= b.height ? -1 : 1
        });
        if (frames[frames.length - 1].height + pad * 2 > this.maxHeight) {
          throw SpriteSheetBuilder.ERR_DIMENSIONS
        }
        var y = 0,
          x = 0;
        var img = 0;
        while (frames.length) {
          var o = this._fillRow(frames, y, img, dataFrames, pad);
          if (o.w > x) {
            x = o.w
          }
          y += o.h;
          if (!o.h || !frames.length) {
            var canvas = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas");
            canvas.width = this._getSize(x, this.maxWidth);
            canvas.height = this._getSize(y, this.maxHeight);
            this._data.images[img] = canvas;
            if (!o.h) {
              x = y = 0;
              img++
            }
          }
        }
      }
    }, {
      key: "_setupMovieClipFrame",
      /**
       * @method _setupMovieClipFrame
       * @protected
       * @return {Number} The width & height of the row.
       */
      value: function _setupMovieClipFrame(source, data) {
        var ae = source.actionsEnabled;
        source.actionsEnabled = false;
        source.gotoAndStop(data.i);
        source.actionsEnabled = ae;
        data.f && data.f(source, data.d, data.i)
      }
    }, {
      key: "_getSize",
      value: function _getSize(size, max) {
        var pow = 4;
        while (Math.pow(2, ++pow) < size) {}
        return Math.min(max, Math.pow(2, pow))
      }
    }, {
      key: "_fillRow",
      /**
       * @method _fillRow
       * @param {Array} frames
       * @param {Number} y
       * @param {HTMLImageElement} img
       * @param {Object} dataFrames
       * @param {Number} pad
       * @protected
       * @return {Number} The width & height of the row.
       */
      value: function _fillRow(frames, y, img, dataFrames, pad) {
        var w = this.maxWidth;
        var maxH = this.maxHeight;
        y += pad;
        var h = maxH - y;
        var x = pad;
        var height = 0;
        for (var i = frames.length - 1; i >= 0; i--) {
          var frame = frames[i];
          var sc = this._scale * frame.scale;
          var rect = frame.sourceRect;
          var source = frame.source;
          var rx = Math.floor(sc * rect.x - pad);
          var ry = Math.floor(sc * rect.y - pad);
          var rh = Math.ceil(sc * rect.height + pad * 2);
          var rw = Math.ceil(sc * rect.width + pad * 2);
          if (rw > w) {
            throw SpriteSheetBuilder.ERR_DIMENSIONS
          }
          if (rh > h || x + rw > w) {
            continue
          }
          frame.img = img;
          frame.rect = new Rectangle(x, y, rw, rh);
          height = height || rh;
          frames.splice(i, 1);
          dataFrames[frame.index] = [x, y, rw, rh, img, Math.round(-rx + sc * source.regX - pad), Math.round(-ry + sc * source.regY - pad)];
          x += rw
        }
        return {
          w: x,
          h: height
        }
      }
    }, {
      key: "_endBuild",
      value: function _endBuild() {
        this.spriteSheet = new SpriteSheet(this._data);
        this._data = null;
        this.progress = 1;
        this.dispatchEvent("complete")
      }
    }, {
      key: "_run",
      value: function _run() {
        var _this3 = this;
        var ts = Math.max(.01, Math.min(.99, this.timeSlice || .3)) * 50;
        var t = (new Date).getTime() + ts;
        var complete = false;
        while (t > (new Date).getTime()) {
          if (!this._drawNext()) {
            complete = true;
            break
          }
        }
        if (complete) {
          this._endBuild()
        } else {
          this._timerID = setTimeout(function () {
            return _this3._run()
          }, 50 - ts)
        }
        var p = this.progress = this._index / this._frames.length;
        if (this.hasEventListener("progress")) {
          var evt = new Event("progress");
          evt.progress = p;
          this.dispatchEvent(evt)
        }
      }
    }, {
      key: "_drawNext",
      value: function _drawNext() {
        var frame = this._frames[this._index];
        var sc = frame.scale * this._scale;
        var rect = frame.rect;
        var sourceRect = frame.sourceRect;
        var canvas = this._data.images[frame.img];
        var ctx = canvas.getContext("2d");
        frame.funct && frame.funct(frame.source, frame.data);
        ctx.save();
        ctx.beginPath();
        ctx.rect(rect.x, rect.y, rect.width, rect.height);
        ctx.clip();
        ctx.translate(Math.ceil(rect.x - sourceRect.x * sc), Math.ceil(rect.y - sourceRect.y * sc));
        ctx.scale(sc, sc);
        frame.source.draw(ctx); // display object will draw itself.
        ctx.restore();
        return ++this._index < this._frames.length
      }
    }], [{
      key: "ERR_DIMENSIONS",
      get: function get() {
        return _ERR_DIMENSIONS
      }
    }, {
      key: "ERR_RUNNING",
      get: function get() {
        return _ERR_RUNNING
      }
    }]);
    return SpriteSheetBuilder
  }(EventDispatcher);
  /**
   * The SpriteSheetUtils class is a collection of static methods for working with {{#crossLink "SpriteSheet"}}{{/crossLink}}s.
   * A sprite sheet is a series of images (usually animation frames) combined into a single image on a regular grid. For
   * example, an animation consisting of 8 100x100 images could be combined into a 400x200 sprite sheet (4 frames across
   * by 2 high). The SpriteSheetUtils class uses a static interface and should not be instantiated.
   * @class SpriteSheetUtils
   * @static
   */
  var SpriteSheetUtils = function () {
    // constructor:
    /**
     * @constructor
     */
    function SpriteSheetUtils() {
      classCallCheck(this, SpriteSheetUtils);
      throw "SpriteSheetUtils cannot be instantiated"
    }
    // public static methods:
    /**
     * Returns a single frame of the specified sprite sheet as a new PNG image. An example of when this may be useful is
     * to use a spritesheet frame as the source for a bitmap fill.
     *
     * <strong>WARNING:</strong> In almost all cases it is better to display a single frame using a {{#crossLink "Sprite"}}{{/crossLink}}
     * with a {{#crossLink "Sprite/gotoAndStop"}}{{/crossLink}} call than it is to slice out a frame using this
     * method and display it with a Bitmap instance. You can also crop an image using the {{#crossLink "Bitmap/sourceRect"}}{{/crossLink}}
     * property of {{#crossLink "Bitmap"}}{{/crossLink}}.
     *
     * The extractFrame method may cause cross-domain warnings since it accesses pixels directly on the canvas.
     * @method extractFrame
     * @static
     * @param {SpriteSheet} spriteSheet The SpriteSheet instance to extract a frame from.
     * @param {Number|String} frameOrAnimation The frame number or animation name to extract. If an animation
     * name is specified, only the first frame of the animation will be extracted.
     * @return {HTMLImageElement} a single frame of the specified sprite sheet as a new PNG image.
     */
    createClass(SpriteSheetUtils, null, [{
      key: "extractFrame",
      value: function extractFrame(spriteSheet, frameOrAnimation) {
        if (isNaN(frameOrAnimation)) {
          frameOrAnimation = spriteSheet.getAnimation(frameOrAnimation).frames[0]
        }
        var data = spriteSheet.getFrame(frameOrAnimation);
        if (!data) {
          return null
        }
        var r = data.rect;
        var canvas = SpriteSheetUtils._workingCanvas;
        canvas.width = r.width;
        canvas.height = r.height;
        SpriteSheetUtils._workingContext.drawImage(data.image, r.x, r.y, r.width, r.height, 0, 0, r.width, r.height);
        var img = document.createElement("img");
        img.src = canvas.toDataURL("image/png");
        return img
      }
    }, {
      key: "mergeAlpha",
      value: function mergeAlpha(rgbImage, alphaImage, canvas) {
        if (!canvas) {
          canvas = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas")
        }
        canvas.width = Math.max(alphaImage.width, rgbImage.width);
        canvas.height = Math.max(alphaImage.height, rgbImage.height);
        var ctx = canvas.getContext("2d");
        ctx.save();
        ctx.drawImage(rgbImage, 0, 0);
        ctx.globalCompositeOperation = "destination-in";
        ctx.drawImage(alphaImage, 0, 0);
        ctx.restore();
        return canvas
      }
    }, {
      key: "_flip",
      value: function _flip(spriteSheet, count, h, v) {
        var imgs = spriteSheet._images;
        var canvas = SpriteSheetUtils._workingCanvas;
        var ctx = SpriteSheetUtils._workingContext;
        var il = imgs.length / count;
        for (var i = 0; i < il; i++) {
          var src = imgs[i];
          src.__tmp = i; // a bit hacky, but faster than doing indexOf below.
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.clearRect(0, 0, canvas.width + 1, canvas.height + 1);
          canvas.width = src.width;
          canvas.height = src.height;
          ctx.setTransform(h ? -1 : 1, 0, 0, v ? -1 : 1, h ? src.width : 0, v ? src.height : 0);
          ctx.drawImage(src, 0, 0);
          var img = document.createElement("img");
          img.src = canvas.toDataURL("image/png");
          // work around a strange bug in Safari:
          img.width = src.width;
          img.height = src.height;
          imgs.push(img)
        }
        var frames = spriteSheet._frames;
        var fl = frames.length / count;
        for (var _i = 0; _i < fl; _i++) {
          var _src = frames[_i];
          var rect = _src.rect.clone();
          var _img = imgs[_src.image.__tmp + il * count];
          var frame = {
            image: _img,
            rect: rect,
            regX: _src.regX,
            regY: _src.regY
          };
          if (h) {
            rect.x = _img.width - rect.x - rect.width; // update rect
            frame.regX = rect.width - _src.regX
          }
          if (v) {
            rect.y = _img.height - rect.y - rect.height; // update rect
            frame.regY = rect.height - _src.regY
          }
          frames.push(frame)
        }
        var sfx = "_" + (h ? "h" : "") + (v ? "v" : "");
        var names = spriteSheet._animations;
        var data = spriteSheet._data;
        var al = names.length / count;
        for (var _i2 = 0; _i2 < al; _i2++) {
          var name = names[_i2];
          var _src2 = data[name];
          var anim = {
            name: name + sfx,
            speed: _src2.speed,
            next: _src2.next,
            frames: []
          };
          if (_src2.next) {
            anim.next += sfx
          }
          var _frames = _src2.frames;
          for (var _i3 = 0, l = _frames.length; _i3 < l; _i3++) {
            anim.frames.push(_frames[_i3] + fl * count)
          }
          data[anim.name] = anim;
          names.push(anim.name)
        }
      }
    }]);
    return SpriteSheetUtils
  }(); {
    var canvas$3 = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas");
    if (canvas$3.getContext) {
      SpriteSheetUtils._workingCanvas = canvas$3;
      SpriteSheetUtils._workingContext = canvas$3.getContext("2d");
      canvas$3.width = canvas$3.height = 1
    }
  }
  var _alternateOutput = null;
  /**
   * A utility and helper class designed to work with {{#crossLink "StageGL"}}{{/crossLink}} to help investigate and
   * test performance or display problems. It contains logging functions to analyze behaviour and performance testing
   * utilities.
   * @class WebGLInspector
   * @extends EventDispatcher
   */
  var WebGLInspector = function (_EventDispatcher) {
    inherits(WebGLInspector, _EventDispatcher);
    // constructor:
    /**
     * @constructor
     * @param {StageGL} stage The default stage to use when none is supplied.
     */
    function WebGLInspector(stage) {
      classCallCheck(this, WebGLInspector);
      // private properties:
      /**
       * The internal reference to the default stage this Inspector is for.
       * @property _stage
       * @protected
       * @type {StageGL}
       */
      var _this = possibleConstructorReturn(this, (WebGLInspector.__proto__ || Object.getPrototypeOf(WebGLInspector)).call(this));
      _this._stage = stage;
      return _this
    }
    // static properties:
    /**
     * Alternate output for debugging situations where "console" is not available, i.e. Mobile or remote debugging.
     * Expects object with a "log" function that takes any number of params.
     * @property alternateOutput
     * @type {Console}
     * @default null
     * @static
     * @protected
     */
    createClass(WebGLInspector, [{
      key: "log",
      // public methods:
      /**
       * Perform all of the logging reports at once.
       * @method log
       * @param {StageGL} [stage=this._stage] The stage to log information for.
       */
      value: function log(stage) {
        if (!stage) {
          stage = this._stage
        }
        WebGLInspector._log("Batches Per Draw: " + (stage._batchID / stage._drawID).toFixed(4));
        this.logContextInfo(stage._webGLContext);
        this.logDepth(stage.children, "");
        this.logTextureFill(stage)
      }
    }, {
      key: "toggleGPUDraw",
      value: function toggleGPUDraw(stage, enabled) {
        if (!stage) {
          stage = this._stage
        }
        if (enabled === undefined) {
          enabled = !!stage._drawBuffers_
        }
        if (enabled && stage._drawBuffers_) {
          stage._drawBuffers = stage._drawBuffers_;
          stage._drawBuffers_ = undefined
        } else {
          stage._drawBuffers_ = stage._drawBuffers;
          stage._drawBuffers = function _inspectorDrawBuffers(gl) {
            if (this.vocalDebug) {
              WebGLInspector._log("BlankDraw[" + this._drawID + ":" + this._batchID + "] : " + this.batchReason)
            }
          }
        }
      }
    }, {
      key: "logDepth",
      value: function logDepth(children) {
        var prepend = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
        var logFunc = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : WebGLInspector._log;
        if (!children) {
          children = this._stage.children
        }
        var l = children.length;
        for (var i = 0; i < l; i++) {
          var child = children[i];
          logFunc(prepend + "-", child);
          if (child.children && child.children.length) {
            this.logDepth(child.children, "|" + prepend, logFunc)
          }
        }
      }
    }, {
      key: "logContextInfo",
      value: function logContextInfo(gl) {
        if (!gl) {
          gl = this._stage._webGLContext
        }
        var data = "\n\t\t\t== LOG:\n\n\t\t\tMax textures per draw: " + gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS) + "\n\n\t\t\tMax textures active: " + gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS) + "\n\n\t\t\t\n\n\t\t\tMax texture size: " + gl.getParameter(gl.MAX_TEXTURE_SIZE) / 2 + "\n\n\t\t\tMax cache size: " + gl.getParameter(gl.MAX_RENDERBUFFER_SIZE) / 2 + "\n\n\t\t\t\n\n\t\t\tMax attributes per vertex: " + gl.getParameter(gl.MAX_VERTEX_ATTRIBS) + "\n\n\t\t\tWebGL Version string: " + gl.getParameter(gl.VERSION) + "\n\n\t\t\t======\n\t\t";
        WebGLInspector._log(data)
      }
    }, {
      key: "logTextureFill",
      value: function logTextureFill(stage) {
        if (!stage) {
          stage = this._stage
        }
        var dict = stage._textureDictionary;
        var count = stage._batchTextureCount;
        WebGLInspector._log(textureMax + ": " + count);
        var output = [];
        for (var n in dict) {
          var str = n.replace(window.location.origin, "");
          var tex = dict[n];
          var shifted = tex._lastActiveIndex ? tex._lastActiveIndex == tex._activeIndex : false;
          output.push({
            src: src,
            element: tex,
            shifted: shifted
          });
          tex._lastActiveIndex = tex._activeIndex
        }
        output.sort(function (a, b) {
          if (a.element._drawID == stage._drawID) {
            return 1
          }
          if (a.element._drawID < b.element._drawID) {
            return -1
          }
          return 0
        });
        var l = output.length;
        for (var i = 0; i < l; i++) {
          var out = output[i];
          var active = out.element._drawID == stage._drawID;
          WebGLInspector._log("[" + out.src + "] " + (active ? "ACTIVE" : "stale") + " " + (out.shifted ? "steady" : "DRIFT"), out.element)
        }
      }
    }], [{
      key: "dispProps",
      // static methods:
      /**
       * Utility function for use with {{#crossLink "logDepth"))((/crossLink}}. Logs an item's position and registration.
       * Useful to see if something is being forced off screen or has an integer position.
       * @method dispProps
       * @param {DisplayObject} item The item we're currently logging about.
       * @param {String} [prepend=""] The string to show before the item, usually formatting for a tree view.
       * @static
       */
      value: function dispProps(item) {
        var prepend = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
        var p = "\tP: " + item.x.toFixed(2) + "x" + item.y.toFixed(2) + "\t";
        var r = "\tR: " + item.regX.toFixed(2) + "x" + item.regY.toFixed(2) + "\t";
        WebGLInspector._log(prepend, item.toString() + "\t", p, r)
      }
    }, {
      key: "_log",
      value: function _log() {
        if (WebGLInspector.alternateOutput) {
          var _WebGLInspector$alter;
          (_WebGLInspector$alter = WebGLInspector.alternateOutput).log.apply(_WebGLInspector$alter, arguments)
        } else {
          var _console;
          (_console = console).log.apply(_console, arguments)
        }
      }
    }, {
      key: "alternateOutput",
      get: function get() {
        return _alternateOutput
      },
      set: function set(alternateOutput) {
        _alternateOutput = alternateOutput
      }
    }]);
    return WebGLInspector
  }(EventDispatcher);
  // display
  // TODO: Export version?
  exports.DisplayObject = DisplayObject;
  exports.Container = Container;
  exports.Bitmap = Bitmap;
  exports.BitmapText = BitmapText;
  exports.DOMElement = DOMElement;
  exports.Graphics = Graphics;
  exports.Arc = Arc;
  exports.ArcTo = ArcTo;
  exports.BeginPath = BeginPath;
  exports.BezierCurveTo = BezierCurveTo;
  exports.Circle = Circle;
  exports.ClosePath = ClosePath;
  exports.Ellipse = Ellipse;
  exports.Fill = Fill;
  exports.LineTo = LineTo;
  exports.MoveTo = MoveTo;
  exports.PolyStar = PolyStar;
  exports.QuadraticCurveTo = QuadraticCurveTo;
  exports.Rect = Rect;
  exports.RoundRect = RoundRect;
  exports.Stroke = Stroke;
  exports.StrokeDash = StrokeDash;
  exports.StrokeStyle = StrokeStyle;
  exports.MovieClip = MovieClip;
  exports.Shadow = Shadow$1;
  exports.Shape = Shape;
  exports.Sprite = Sprite;
  exports.SpriteSheet = SpriteSheet;
  exports.Stage = Stage;
  exports.StageGL = StageGL;
  exports.Text = Text;
  exports.MouseEvent = MouseEvent;
  exports.AlphaMapFilter = AlphaMapFilter;
  exports.AlphaMaskFilter = AlphaMaskFilter;
  exports.BitmapCache = BitmapCache;
  exports.BlurFilter = BlurFilter;
  exports.ColorFilter = ColorFilter;
  exports.ColorMatrix = ColorMatrix;
  exports.ColorMatrixFilter = ColorMatrixFilter;
  exports.Filter = Filter;
  exports.DisplayProps = DisplayProps;
  exports.Matrix2D = Matrix2D;
  exports.Point = Point;
  exports.Rectangle = Rectangle;
  exports.ButtonHelper = ButtonHelper;
  exports.Touch = Touch;
  exports.SpriteSheetBuilder = SpriteSheetBuilder;
  exports.SpriteSheetUtils = SpriteSheetUtils;
  exports.UID = UID;
  exports.WebGLInspector = WebGLInspector
})(this.createjs = this.createjs || {});
//# sourceMappingURL=easeljs.map
