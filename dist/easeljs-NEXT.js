/**
 * @license EaselJS
 * Visit https://createjs.com for documentation, updates and examples.
 *
 * Copyright (c) 2017 gskinner.com, inc.
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
(function(exports, Tween, Timeline) {
  "use strict";
  Tween = Tween && Tween.hasOwnProperty("default") ? Tween["default"] : Tween;
  Timeline = Timeline && Timeline.hasOwnProperty("default") ? Timeline["default"] : Timeline;
  var classCallCheck = function(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };
  var createClass = function() {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    return function(Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();
  var inherits = function(subClass, superClass) {
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
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  };
  var possibleConstructorReturn = function(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  };
  var Event = function() {
    function Event(type) {
      var bubbles = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var cancelable = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      classCallCheck(this, Event);
      this.type = type;
      this.target = null;
      this.currentTarget = null;
      this.eventPhase = 0;
      this.bubbles = bubbles;
      this.cancelable = cancelable;
      this.timeStamp = new Date().getTime();
      this.defaultPrevented = false;
      this.propagationStopped = false;
      this.immediatePropagationStopped = false;
      this.removed = false;
    }
    Event.prototype.preventDefault = function preventDefault() {
      this.defaultPrevented = this.cancelable;
      return this;
    };
    Event.prototype.stopPropagation = function stopPropagation() {
      this.propagationStopped = true;
      return this;
    };
    Event.prototype.stopImmediatePropagation = function stopImmediatePropagation() {
      this.immediatePropagationStopped = this.propagationStopped = true;
      return this;
    };
    Event.prototype.remove = function remove() {
      this.removed = true;
      return this;
    };
    Event.prototype.clone = function clone() {
      var event = new Event(this.type, this.bubbles, this.cancelable);
      for (var n in this) {
        if (this.hasOwnProperty(n)) {
          event[n] = this[n];
        }
      }
      return event;
    };
    Event.prototype.set = function set(props) {
      for (var n in props) {
        this[n] = props[n];
      }
      return this;
    };
    Event.prototype.toString = function toString() {
      return "[" + this.constructor.name + " (type=" + this.type + ")]";
    };
    return Event;
  }();
  var EventDispatcher = function() {
    EventDispatcher.initialize = function initialize(target) {
      var p = EventDispatcher.prototype;
      target.addEventListener = p.addEventListener;
      target.on = p.on;
      target.removeEventListener = target.off = p.removeEventListener;
      target.removeAllEventListeners = p.removeAllEventListeners;
      target.hasEventListener = p.hasEventListener;
      target.dispatchEvent = p.dispatchEvent;
      target._dispatchEvent = p._dispatchEvent;
      target.willTrigger = p.willTrigger;
    };
    function EventDispatcher() {
      classCallCheck(this, EventDispatcher);
      this._listeners = null;
      this._captureListeners = null;
    }
    EventDispatcher.prototype.addEventListener = function addEventListener(type, listener) {
      var useCapture = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var listeners = void 0;
      if (useCapture) {
        listeners = this._captureListeners = this._captureListeners || {};
      } else {
        listeners = this._listeners = this._listeners || {};
      }
      var arr = listeners[type];
      if (arr) {
        this.removeEventListener(type, listener, useCapture);
        arr = listeners[type];
      }
      if (arr) {
        arr.push(listener);
      } else {
        listeners[type] = [ listener ];
      }
      return listener;
    };
    EventDispatcher.prototype.on = function on(type, listener) {
      var scope = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var once = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      var data = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
      var useCapture = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
      if (listener.handleEvent) {
        scope = scope || listener;
        listener = listener.handleEvent;
      }
      scope = scope || this;
      return this.addEventListener(type, function(evt) {
        listener.call(scope, evt, data);
        once && evt.remove();
      }, useCapture);
    };
    EventDispatcher.prototype.removeEventListener = function removeEventListener(type, listener) {
      var useCapture = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var listeners = useCapture ? this._captureListeners : this._listeners;
      if (!listeners) {
        return;
      }
      var arr = listeners[type];
      if (!arr) {
        return;
      }
      var l = arr.length;
      for (var i = 0; i < l; i++) {
        if (arr[i] === listener) {
          if (l === 1) {
            delete listeners[type];
          } else {
            arr.splice(i, 1);
          }
          break;
        }
      }
    };
    EventDispatcher.prototype.off = function off(type, listener) {
      var useCapture = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      this.removeEventListener(type, listener, useCapture);
    };
    EventDispatcher.prototype.removeAllEventListeners = function removeAllEventListeners() {
      var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      if (type) {
        if (this._listeners) {
          delete this._listeners[type];
        }
        if (this._captureListeners) {
          delete this._captureListeners[type];
        }
      } else {
        this._listeners = this._captureListeners = null;
      }
    };
    EventDispatcher.prototype.dispatchEvent = function dispatchEvent(eventObj) {
      var bubbles = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var cancelable = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      if (typeof eventObj === "string") {
        var listeners = this._listeners;
        if (!bubbles && (!listeners || !listeners[eventObj])) {
          return true;
        }
        eventObj = new Event(eventObj, bubbles, cancelable);
      } else if (eventObj.target && eventObj.clone) {
        eventObj = eventObj.clone();
      }
      try {
        eventObj.target = this;
      } catch (e) {}
      if (!eventObj.bubbles || !this.parent) {
        this._dispatchEvent(eventObj, 2);
      } else {
        var top = this;
        var list = [ top ];
        while (top.parent) {
          list.push(top = top.parent);
        }
        var l = list.length;
        var i = void 0;
        for (i = l - 1; i >= 0 && !eventObj.propagationStopped; i--) {
          list[i]._dispatchEvent(eventObj, 1 + (i == 0));
        }
        for (i = 1; i < l && !eventObj.propagationStopped; i++) {
          list[i]._dispatchEvent(eventObj, 3);
        }
      }
      return !eventObj.defaultPrevented;
    };
    EventDispatcher.prototype.hasEventListener = function hasEventListener(type) {
      var listeners = this._listeners, captureListeners = this._captureListeners;
      return !!(listeners && listeners[type] || captureListeners && captureListeners[type]);
    };
    EventDispatcher.prototype.willTrigger = function willTrigger(type) {
      var o = this;
      while (o) {
        if (o.hasEventListener(type)) {
          return true;
        }
        o = o.parent;
      }
      return false;
    };
    EventDispatcher.prototype.toString = function toString() {
      return "[" + (this.constructor.name + this.name ? " " + this.name : "") + "]";
    };
    EventDispatcher.prototype._dispatchEvent = function _dispatchEvent(eventObj, eventPhase) {
      var listeners = eventPhase === 1 ? this._captureListeners : this._listeners;
      if (eventObj && listeners) {
        var arr = listeners[eventObj.type];
        var l = void 0;
        if (!arr || (l = arr.length) === 0) {
          return;
        }
        try {
          eventObj.currentTarget = this;
        } catch (e) {}
        try {
          eventObj.eventPhase = eventPhase;
        } catch (e) {}
        eventObj.removed = false;
        arr = arr.slice();
        for (var i = 0; i < l && !eventObj.immediatePropagationStopped; i++) {
          var o = arr[i];
          if (o.handleEvent) {
            o.handleEvent(eventObj);
          } else {
            o(eventObj);
          }
          if (eventObj.removed) {
            this.off(eventObj.type, o, eventPhase === 1);
            eventObj.removed = false;
          }
        }
      }
    };
    return EventDispatcher;
  }();
  var Ticker = function(_EventDispatcher) {
    inherits(Ticker, _EventDispatcher);
    createClass(Ticker, null, [ {
      key: "RAF_SYNCHED",
      get: function get() {
        return "synched";
      }
    }, {
      key: "RAF",
      get: function get() {
        return "raf";
      }
    }, {
      key: "TIMEOUT",
      get: function get() {
        return "timeout";
      }
    } ]);
    function Ticker(name) {
      classCallCheck(this, Ticker);
      var _this = possibleConstructorReturn(this, _EventDispatcher.call(this));
      _this.name = name;
      _this.timingMode = Ticker.TIMEOUT;
      _this.maxDelta = 0;
      _this.paused = false;
      _this._inited = false;
      _this._startTime = 0;
      _this._pausedTime = 0;
      _this._ticks = 0;
      _this._pausedTicks = 0;
      _this._interval = 50;
      _this._lastTime = 0;
      _this._times = null;
      _this._tickTimes = null;
      _this._timerId = null;
      _this._raf = true;
      return _this;
    }
    Ticker.prototype.init = function init() {
      if (this._inited) {
        return;
      }
      this._inited = true;
      this._times = [];
      this._tickTimes = [];
      this._startTime = this._getTime();
      this._times.push(this._lastTime = 0);
      this._setupTick();
    };
    Ticker.prototype.reset = function reset() {
      if (this._raf) {
        var f = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame;
        f && f(this._timerId);
      } else {
        clearTimeout(this._timerId);
      }
      this.removeAllEventListeners("tick");
      this._timerId = this._times = this._tickTimes = null;
      this._startTime = this._lastTime = this._ticks = 0;
      this._inited = false;
    };
    Ticker.prototype.addEventListener = function addEventListener(type, listener, useCapture) {
      !this._inited && this.init();
      return _EventDispatcher.prototype.addEventListener.call(this, type, listener, useCapture);
    };
    Ticker.prototype.getMeasuredTickTime = function getMeasuredTickTime() {
      var ticks = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var times = this._tickTimes;
      if (!times || times.length < 1) {
        return -1;
      }
      ticks = Math.min(times.length, ticks || this.framerate | 0);
      return times.reduce(function(a, b) {
        return a + b;
      }, 0) / ticks;
    };
    Ticker.prototype.getMeasuredFPS = function getMeasuredFPS() {
      var ticks = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var times = this._times;
      if (!times || times.length < 2) {
        return -1;
      }
      ticks = Math.min(times.length - 1, ticks || this.framerate | 0);
      return 1e3 / ((times[0] - times[ticks]) / ticks);
    };
    Ticker.prototype.getTime = function getTime() {
      var runTime = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      return this._startTime ? this._getTime() - (runTime ? this._pausedTime : 0) : -1;
    };
    Ticker.prototype.getEventTime = function getEventTime() {
      var runTime = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      return this._startTime ? (this._lastTime || this._startTime) - (runTime ? this._pausedTime : 0) : -1;
    };
    Ticker.prototype.getTicks = function getTicks() {
      var pauseable = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      return this._ticks - (pauseable ? this._pausedTicks : 0);
    };
    Ticker.prototype._handleSynch = function _handleSynch() {
      this._timerId = null;
      this._setupTick();
      if (this._getTime() - this._lastTime >= (this._interval - 1) * .97) {
        this._tick();
      }
    };
    Ticker.prototype._handleRAF = function _handleRAF() {
      this._timerId = null;
      this._setupTick();
      this._tick();
    };
    Ticker.prototype._handleTimeout = function _handleTimeout() {
      this._timerId = null;
      this._setupTick();
      this._tick();
    };
    Ticker.prototype._setupTick = function _setupTick() {
      if (this._timerId != null) {
        return;
      }
      var mode = this.timingMode || this._raf && Ticker.RAF;
      if (mode === Ticker.RAF_SYNCHED || mode === Ticker.RAF) {
        var f = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame;
        if (f) {
          this._timerId = f(mode === Ticker.RAF ? this._handleRAF.bind(this) : this._handleSynch.bind(this));
          this._raf = true;
          return;
        }
      }
      this._raf = false;
      this._timerId = setTimeout(this._handleTimeout.bind(this), this._interval);
    };
    Ticker.prototype._tick = function _tick() {
      var paused = this.paused, time = this._getTime(), elapsedTime = time - this._lastTime;
      this._lastTime = time;
      this._ticks++;
      if (paused) {
        this._pausedTicks++;
        this._pausedTime += elapsedTime;
      }
      if (this.hasEventListener("tick")) {
        var event = new Event("tick");
        var maxDelta = this.maxDelta;
        event.delta = maxDelta && elapsedTime > maxDelta ? maxDelta : elapsedTime;
        event.paused = paused;
        event.time = time;
        event.runTime = time - this._pausedTime;
        this.dispatchEvent(event);
      }
      this._tickTimes.unshift(this._getTime() - time);
      while (this._tickTimes.length > 100) {
        this._tickTimes.pop();
      }
      this._times.unshift(time);
      while (this._times.length > 100) {
        this._times.pop();
      }
    };
    Ticker.prototype._getTime = function _getTime() {
      var now = window.performance && window.performance.now;
      return (now && now.call(performance) || new Date().getTime()) - this._startTime;
    };
    Ticker.on = function on(type, listener, scope, once, data, useCapture) {
      return _instance.on(type, listener, scope, once, data, useCapture);
    };
    Ticker.removeEventListener = function removeEventListener(type, listener, useCapture) {
      _instance.removeEventListener(type, listener, useCapture);
    };
    Ticker.off = function off(type, listener, useCapture) {
      _instance.off(type, listener, useCapture);
    };
    Ticker.removeAllEventListeners = function removeAllEventListeners(type) {
      _instance.removeAllEventListeners(type);
    };
    Ticker.dispatchEvent = function dispatchEvent(eventObj, bubbles, cancelable) {
      return _instance.dispatchEvent(eventObj, bubbles, cancelable);
    };
    Ticker.hasEventListener = function hasEventListener(type) {
      return _instance.hasEventListener(type);
    };
    Ticker.willTrigger = function willTrigger(type) {
      return _instance.willTrigger(type);
    };
    Ticker.toString = function toString() {
      return _instance.toString();
    };
    Ticker._dispatchEvent = function _dispatchEvent(eventObj, eventPhase) {};
    Ticker.init = function init() {
      _instance.init();
    };
    Ticker.reset = function reset() {
      _instance.reset();
    };
    Ticker.addEventListener = function addEventListener(type, listener, useCapture) {
      _instance.addEventListener(type, listener, useCapture);
    };
    Ticker.getMeasuredTickTime = function getMeasuredTickTime(ticks) {
      return _instance.getMeasuredTickTime(ticks);
    };
    Ticker.getMeasuredFPS = function getMeasuredFPS(ticks) {
      return _instance.getMeasuredFPS(ticks);
    };
    Ticker.getTime = function getTime(runTime) {
      return _instance.getTime(runTime);
    };
    Ticker.getEventTime = function getEventTime(runTime) {
      return _instance.getEventTime(runTime);
    };
    Ticker.getTicks = function getTicks(pauseable) {
      return _instance.getTicks(pauseable);
    };
    Ticker._handleSynch = function _handleSynch() {
      _instance._handleSynch();
    };
    Ticker._handleRAF = function _handleRAF() {
      _instance._handleRAF();
    };
    Ticker._handleTimeout = function _handleTimeout() {
      _instance._handleTimeout();
    };
    Ticker._setupTick = function _setupTick() {
      _instance._setupTick();
    };
    Ticker._tick = function _tick() {
      _instance._tick();
    };
    Ticker._getTime = function _getTime() {
      return _instance._getTime();
    };
    createClass(Ticker, [ {
      key: "interval",
      get: function get() {
        return this._interval;
      },
      set: function set(interval) {
        this._interval = interval;
        if (!this._inited) {
          return;
        }
        this._setupTick();
      }
    }, {
      key: "framerate",
      get: function get() {
        return 1e3 / this._interval;
      },
      set: function set(framerate) {
        this.interval = 1e3 / framerate;
      }
    } ], [ {
      key: "interval",
      get: function get() {
        return _instance.interval;
      },
      set: function set(interval) {
        _instance.interval = interval;
      }
    }, {
      key: "framerate",
      get: function get() {
        return _instance.framerate;
      },
      set: function set(framerate) {
        _instance.framerate = framerate;
      }
    } ]);
    return Ticker;
  }(EventDispatcher);
  var _instance = new Ticker("createjs.global");
  var _nextID = 0;
  var UID = function() {
    function UID() {
      classCallCheck(this, UID);
      throw "UID cannot be instantiated";
    }
    UID.get = function get() {
      return UID._nextID++;
    };
    createClass(UID, null, [ {
      key: "_nextID",
      get: function get() {
        return _nextID;
      },
      set: function set(nextID) {
        _nextID = nextID;
      }
    } ]);
    return UID;
  }();
  var Point = function() {
    function Point() {
      var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      classCallCheck(this, Point);
      this.setValues(x, y);
    }
    Point.prototype.setValues = function setValues() {
      var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      this.x = x;
      this.y = y;
      return this;
    };
    Point.prototype.copy = function copy(point) {
      this.x = point.x;
      this.y = point.y;
      return this;
    };
    Point.prototype.clone = function clone() {
      return new Point(this.x, this.y);
    };
    Point.prototype.toString = function toString() {
      return "[" + this.constructor.name + " (x=" + this.x + " y=" + this.y + ")]";
    };
    return Point;
  }();
  var Matrix2D = function() {
    function Matrix2D() {
      var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var c = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var d = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
      var tx = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
      var ty = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
      classCallCheck(this, Matrix2D);
      this.setValues(a, b, c, d, tx, ty);
    }
    Matrix2D.prototype.setValues = function setValues() {
      var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var c = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var d = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
      var tx = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
      var ty = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
      this.a = a;
      this.b = b;
      this.c = c;
      this.d = d;
      this.tx = tx;
      this.ty = ty;
      return this;
    };
    Matrix2D.prototype.append = function append(a, b, c, d, tx, ty) {
      var a1 = this.a;
      var b1 = this.b;
      var c1 = this.c;
      var d1 = this.d;
      if (a != 1 || b != 0 || c != 0 || d != 1) {
        this.a = a1 * a + c1 * b;
        this.b = b1 * a + d1 * b;
        this.c = a1 * c + c1 * d;
        this.d = b1 * c + d1 * d;
      }
      this.tx = a1 * tx + c1 * ty + this.tx;
      this.ty = b1 * tx + d1 * ty + this.ty;
      return this;
    };
    Matrix2D.prototype.prepend = function prepend(a, b, c, d, tx, ty) {
      var a1 = this.a;
      var c1 = this.c;
      var tx1 = this.tx;
      this.a = a * a1 + c * this.b;
      this.b = b * a1 + d * this.b;
      this.c = a * c1 + c * this.d;
      this.d = b * c1 + d * this.d;
      this.tx = a * tx1 + c * this.ty + tx;
      this.ty = b * tx1 + d * this.ty + ty;
      return this;
    };
    Matrix2D.prototype.appendMatrix = function appendMatrix(matrix) {
      return this.append(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
    };
    Matrix2D.prototype.prependMatrix = function prependMatrix(matrix) {
      return this.prepend(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
    };
    Matrix2D.prototype.appendTransform = function appendTransform(x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
      var r = void 0, cos = void 0, sin = void 0;
      if (rotation % 360) {
        r = rotation * Matrix2D.DEG_TO_RAD;
        cos = Math.cos(r);
        sin = Math.sin(r);
      } else {
        cos = 1;
        sin = 0;
      }
      if (skewX || skewY) {
        skewX *= Matrix2D.DEG_TO_RAD;
        skewY *= Matrix2D.DEG_TO_RAD;
        this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
        this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, 0, 0);
      } else {
        this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y);
      }
      if (regX || regY) {
        this.tx -= regX * this.a + regY * this.c;
        this.ty -= regX * this.b + regY * this.d;
      }
      return this;
    };
    Matrix2D.prototype.prependTransform = function prependTransform(x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
      var r = void 0, cos = void 0, sin = void 0;
      if (rotation % 360) {
        r = rotation * Matrix2D.DEG_TO_RAD;
        cos = Math.cos(r);
        sin = Math.sin(r);
      } else {
        cos = 1;
        sin = 0;
      }
      if (regX || regY) {
        this.tx -= regX;
        this.ty -= regY;
      }
      if (skewX || skewY) {
        skewX *= Matrix2D.DEG_TO_RAD;
        skewY *= Matrix2D.DEG_TO_RAD;
        this.prepend(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, 0, 0);
        this.prepend(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
      } else {
        this.prepend(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y);
      }
      return this;
    };
    Matrix2D.prototype.rotate = function rotate(angle) {
      angle *= Matrix2D.DEG_TO_RAD;
      var cos = Math.cos(angle);
      var sin = Math.sin(angle);
      var a1 = this.a;
      var b1 = this.b;
      this.a = a1 * cos + this.c * sin;
      this.b = b1 * cos + this.d * sin;
      this.c = -a1 * sin + this.c * cos;
      this.d = -b1 * sin + this.d * cos;
      return this;
    };
    Matrix2D.prototype.skew = function skew(skewX, skewY) {
      skewX *= Matrix2D.DEG_TO_RAD;
      skewY *= Matrix2D.DEG_TO_RAD;
      this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), 0, 0);
      return this;
    };
    Matrix2D.prototype.scale = function scale(x, y) {
      this.a *= x;
      this.b *= x;
      this.c *= y;
      this.d *= y;
      return this;
    };
    Matrix2D.prototype.translate = function translate(x, y) {
      this.tx += this.a * x + this.c * y;
      this.ty += this.b * x + this.d * y;
      return this;
    };
    Matrix2D.prototype.identity = function identity() {
      this.a = this.d = 1;
      this.b = this.c = this.tx = this.ty = 0;
      return this;
    };
    Matrix2D.prototype.invert = function invert() {
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
      return this;
    };
    Matrix2D.prototype.isIdentity = function isIdentity() {
      return this.tx === 0 && this.ty === 0 && this.a === 1 && this.b === 0 && this.c === 0 && this.d === 1;
    };
    Matrix2D.prototype.equals = function equals(matrix) {
      return this.tx === matrix.tx && this.ty === matrix.ty && this.a === matrix.a && this.b === matrix.b && this.c === matrix.c && this.d === matrix.d;
    };
    Matrix2D.prototype.transformPoint = function transformPoint(x, y) {
      var pt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Point();
      pt.x = x * this.a + y * this.c + this.tx;
      pt.y = x * this.b + y * this.d + this.ty;
      return pt;
    };
    Matrix2D.prototype.decompose = function decompose() {
      var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      target.x = this.tx;
      target.y = this.ty;
      target.scaleX = Math.sqrt(this.a * this.a + this.b * this.b);
      target.scaleY = Math.sqrt(this.c * this.c + this.d * this.d);
      var skewX = Math.atan2(-this.c, this.d);
      var skewY = Math.atan2(this.b, this.a);
      var delta = Math.abs(1 - skewX / skewY);
      if (delta < 1e-5) {
        target.rotation = skewY / Matrix2D.DEG_TO_RAD;
        if (this.a < 0 && this.d >= 0) {
          target.rotation += target.rotation <= 0 ? 180 : -180;
        }
        target.skewX = target.skewY = 0;
      } else {
        target.skewX = skewX / Matrix2D.DEG_TO_RAD;
        target.skewY = skewY / Matrix2D.DEG_TO_RAD;
      }
      return target;
    };
    Matrix2D.prototype.copy = function copy(matrix) {
      return this.setValues(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
    };
    Matrix2D.prototype.clone = function clone() {
      return new Matrix2D(this.a, this.b, this.c, this.d, this.tx, this.ty);
    };
    Matrix2D.prototype.toString = function toString() {
      return "[" + this.constructor.name + " (a=" + this.a + " b=" + this.b + " c=" + this.c + " d=" + this.d + " tx=" + this.tx + " ty=" + this.ty + ")]";
    };
    return Matrix2D;
  }();
  {
    Matrix2D.DEG_TO_RAD = Math.PI / 180;
    Matrix2D.identity = new Matrix2D();
  }
  var DisplayProps = function() {
    function DisplayProps() {
      var visible = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var alpha = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var shadow = arguments[2];
      var compositeOperation = arguments[3];
      var matrix = arguments[4];
      classCallCheck(this, DisplayProps);
      this.setValues(visible, alpha, shadow, compositeOperation, matrix);
    }
    DisplayProps.prototype.setValues = function setValues() {
      var visible = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var alpha = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var shadow = arguments[2];
      var compositeOperation = arguments[3];
      var matrix = arguments[4];
      this.visible = visible;
      this.alpha = alpha;
      this.shadow = shadow;
      this.compositeOperation = compositeOperation;
      this.matrix = matrix || this.matrix && this.matrix.identity() || new Matrix2D();
      return this;
    };
    DisplayProps.prototype.append = function append(visible, alpha, shadow, compositeOperation, matrix) {
      this.alpha *= alpha;
      this.shadow = shadow || this.shadow;
      this.compositeOperation = compositeOperation || this.compositeOperation;
      this.visible = this.visible && visible;
      matrix && this.matrix.appendMatrix(matrix);
      return this;
    };
    DisplayProps.prototype.prepend = function prepend(visible, alpha, shadow, compositeOperation, matrix) {
      this.alpha *= alpha;
      this.shadow = this.shadow || shadow;
      this.compositeOperation = this.compositeOperation || compositeOperation;
      this.visible = this.visible && visible;
      matrix && this.matrix.prependMatrix(matrix);
      return this;
    };
    DisplayProps.prototype.identity = function identity() {
      this.visible = true;
      this.alpha = 1;
      this.shadow = this.compositeOperation = null;
      this.matrix.identity();
      return this;
    };
    DisplayProps.prototype.clone = function clone() {
      return new DisplayProps(this.alpha, this.shadow, this.compositeOperation, this.visible, this.matrix.clone());
    };
    return DisplayProps;
  }();
  var Rectangle = function() {
    function Rectangle() {
      var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var height = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
      classCallCheck(this, Rectangle);
      this.setValues(x, y, width, height);
    }
    Rectangle.prototype.setValues = function setValues() {
      var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var height = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      return this;
    };
    Rectangle.prototype.extend = function extend(x, y) {
      var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var height = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
      if (x + width > this.x + this.width) {
        this.width = x + width - this.x;
      }
      if (y + height > this.y + this.height) {
        this.height = y + height - this.y;
      }
      if (x < this.x) {
        this.width += this.x - x;
        this.x = x;
      }
      if (y < this.y) {
        this.height += this.y - y;
        this.y = y;
      }
      return this;
    };
    Rectangle.prototype.pad = function pad(top, left, bottom, right) {
      this.x -= left;
      this.y -= top;
      this.width += left + right;
      this.height += top + bottom;
      return this;
    };
    Rectangle.prototype.copy = function copy(rectangle) {
      return this.setValues(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
    };
    Rectangle.prototype.contains = function contains(x, y) {
      var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var height = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
      return x >= this.x && x + width <= this.x + this.width && y >= this.y && y + height <= this.y + this.height;
    };
    Rectangle.prototype.union = function union(rect) {
      return this.clone().extend(rect.x, rect.y, rect.width, rect.height);
    };
    Rectangle.prototype.intersection = function intersection(rect) {
      var x1 = rect.x, y1 = rect.y, x2 = x1 + rect.width, y2 = y1 + rect.height;
      if (this.x > x1) {
        x1 = this.x;
      }
      if (this.y > y1) {
        y1 = this.y;
      }
      if (this.x + this.width < x2) {
        x2 = this.x + this.width;
      }
      if (this.y + this.height < y2) {
        y2 = this.y + this.height;
      }
      return x2 <= x1 || y2 <= y1 ? null : new Rectangle(x1, y1, x2 - x1, y2 - y1);
    };
    Rectangle.prototype.intersects = function intersects(rect) {
      return rect.x <= this.x + this.width && this.x <= rect.x + rect.width && rect.y <= this.y + this.height && this.y <= rect.y + rect.height;
    };
    Rectangle.prototype.isEmpty = function isEmpty() {
      return this.width <= 0 || this.height <= 0;
    };
    Rectangle.prototype.clone = function clone() {
      return new Rectangle(this.x, this.y, this.width, this.height);
    };
    Rectangle.prototype.toString = function toString() {
      return "[" + this.constructor.name + " (x=" + this.x + " y=" + this.y + " width=" + this.width + " height=" + this.height + ")]";
    };
    return Rectangle;
  }();
  var Filter = function() {
    function Filter() {
      classCallCheck(this, Filter);
      this.usesContext = false;
      this._multiPass = null;
      this.VTX_SHADER_BODY = null;
      this.FRAG_SHADER_BODY = null;
    }
    Filter.prototype.getBounds = function getBounds(rect) {
      return rect;
    };
    Filter.prototype.shaderParamSetup = function shaderParamSetup(gl, stage, shaderProgram) {};
    Filter.prototype.applyFilter = function applyFilter(ctx, x, y, width, height, targetCtx, targetX, targetY) {
      targetCtx = targetCtx || ctx;
      if (targetX == null) {
        targetX = x;
      }
      if (targetY == null) {
        targetY = y;
      }
      try {
        var imageData = ctx.getImageData(x, y, width, height);
        if (this._applyFilter(imageData)) {
          targetCtx.putImageData(imageData, targetX, targetY);
          return true;
        }
      } catch (e) {}
      return false;
    };
    Filter.prototype.toString = function toString() {
      return "[" + this.constructor.name + "]";
    };
    Filter.prototype.clone = function clone() {
      return new Filter();
    };
    Filter.prototype._applyFilter = function _applyFilter(imageData) {
      return true;
    };
    return Filter;
  }();
  var BitmapCache = function(_Filter) {
    inherits(BitmapCache, _Filter);
    function BitmapCache() {
      classCallCheck(this, BitmapCache);
      var _this = possibleConstructorReturn(this, _Filter.call(this));
      _this.width = undefined;
      _this.height = undefined;
      _this.x = undefined;
      _this.y = undefined;
      _this.scale = 1;
      _this.offX = 0;
      _this.offY = 0;
      _this.cacheID = 0;
      _this._filterOffX = 0;
      _this._filterOffY = 0;
      _this._cacheDataURLID = 0;
      _this._cacheDataURL = null;
      _this._drawWidth = 0;
      _this._drawHeight = 0;
      _this._boundRect = new Rectangle();
      return _this;
    }
    BitmapCache.getFilterBounds = function getFilterBounds(target) {
      var output = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Rectangle();
      var filters = target.filters;
      var filterCount = filters && filters.length;
      if (!!filterCount <= 0) {
        return output;
      }
      for (var i = 0; i < filterCount; i++) {
        var f = filters[i];
        if (!f || !f.getBounds) {
          continue;
        }
        var test = f.getBounds();
        if (!test) {
          continue;
        }
        if (i == 0) {
          output.setValues(test.x, test.y, test.width, test.height);
        } else {
          output.extend(test.x, test.y, test.width, test.height);
        }
      }
      return output;
    };
    BitmapCache.prototype.define = function define(target) {
      var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var width = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
      var height = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
      var scale = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 1;
      var options = arguments[6];
      if (!target) {
        throw "No symbol to cache";
      }
      this._options = options;
      this._useWebGL = options !== undefined;
      this.target = target;
      this.width = width >= 1 ? width : 1;
      this.height = height >= 1 ? height : 1;
      this.x = x;
      this.y = y;
      this.scale = scale;
      this.update();
    };
    BitmapCache.prototype.update = function update(compositeOperation) {
      if (!this.target) {
        throw "define() must be called before update()";
      }
      var filterBounds = BitmapCache.getFilterBounds(this.target);
      var surface = this.target.cacheCanvas;
      this._drawWidth = Math.ceil(this.width * this.scale) + filterBounds.width;
      this._drawHeight = Math.ceil(this.height * this.scale) + filterBounds.height;
      if (!surface || this._drawWidth != surface.width || this._drawHeight != surface.height) {
        this._updateSurface();
      }
      this._filterOffX = filterBounds.x;
      this._filterOffY = filterBounds.y;
      this.offX = this.x * this.scale + this._filterOffX;
      this.offY = this.y * this.scale + this._filterOffY;
      this._drawToCache(compositeOperation);
      this.cacheID = this.cacheID ? this.cacheID + 1 : 1;
    };
    BitmapCache.prototype.release = function release() {
      var stage = this.target.stage;
      if (this._useWebGL && this._webGLCache) {
        if (!this._webGLCache.isCacheControlled) {
          if (this.__lastRT) {
            this.__lastRT = undefined;
          }
          if (this.__rtA) {
            this._webGLCache._killTextureObject(this.__rtA);
          }
          if (this.__rtB) {
            this._webGLCache._killTextureObject(this.__rtB);
          }
          if (this.target && this.target.cacheCanvas) {
            this._webGLCache._killTextureObject(this.target.cacheCanvas);
          }
        }
        this._webGLCache = false;
      } else if (stage instanceof StageGL) {
        stage.releaseTexture(this.target.cacheCanvas);
      }
      this.target = this.target.cacheCanvas = null;
      this.cacheID = this._cacheDataURLID = this._cacheDataURL = undefined;
      this.width = this.height = this.x = this.y = this.offX = this.offY = 0;
      this.scale = 1;
    };
    BitmapCache.prototype.getCacheDataURL = function getCacheDataURL() {
      var cacheCanvas = this.target && this.target.cacheCanvas;
      if (!cacheCanvas) {
        return null;
      }
      if (this.cacheID != this._cacheDataURLID) {
        this._cacheDataURLID = this.cacheID;
        this._cacheDataURL = cacheCanvas.toDataURL ? cacheCanvas.toDataURL() : null;
      }
      return this._cacheDataURL;
    };
    BitmapCache.prototype.draw = function draw(ctx) {
      if (!this.target) {
        return false;
      }
      ctx.drawImage(this.target.cacheCanvas, this.x + this._filterOffX / this.scale, this.y + this._filterOffY / this.scale, this._drawWidth / this.scale, this._drawHeight / this.scale);
      return true;
    };
    BitmapCache.prototype.getBounds = function getBounds() {
      var scale = this.scale;
      return this._boundRect.setValue(this._filterOffX / scale, this._filterOffY / scale, this.width / scale, this.height / scale);
    };
    BitmapCache.prototype._updateSurface = function _updateSurface() {
      var surface = void 0;
      if (!this._useWebGL) {
        surface = this.target.cacheCanvas;
        if (!surface) {
          surface = this.target.cacheCanvas = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas");
        }
        surface.width = this._drawWidth;
        surface.height = this._drawHeight;
        return;
      }
      if (!this._webGLCache) {
        if (this._options.useGL === "stage") {
          if (!(this.target.stage != null && this.target.stage.isWebGL)) {
            throw "Cannot use 'stage' for cache because the object's parent stage is " + (this.target.stage != null ? "non WebGL." : "not set, please addChild to the correct stage.");
          }
          this.target.cacheCanvas = true;
          this._webGLCache = this.target.stage;
        } else if (this._options.useGL === "new") {
          this.target.cacheCanvas = document.createElement("canvas");
          this._webGLCache = new StageGL(this.target.cacheCanvas, {
            antialias: true,
            transparent: true,
            autoPurge: -1
          });
          this._webGLCache.isCacheControlled = true;
        } else {
          throw "Invalid option provided to useGL, expected ['stage', 'new', StageGL, undefined], got " + this._options.useGL;
        }
      }
      var stageGL = this._webGLCache;
      surface = this.target.cacheCanvas;
      if (stageGL.isCacheControlled) {
        surface.width = this._drawWidth;
        surface.height = this._drawHeight;
        stageGL.updateViewport(this._drawWidth, this._drawHeight);
      }
      if (this.target.filters) {
        stageGL.getTargetRenderTexture(this.target, this._drawWidth, this._drawHeight);
        stageGL.getTargetRenderTexture(this.target, this._drawWidth, this._drawHeight);
      } else if (!stageGL.isCacheControlled) {
        stageGL.getTargetRenderTexture(this.target, this._drawWidth, this._drawHeight);
      }
    };
    BitmapCache.prototype._drawToCache = function _drawToCache(compositeOperation) {
      var target = this.target;
      var surface = target.cacheCanvas;
      var webGL = this._webGLCache;
      if (!this._useWebGL || !webGL) {
        var ctx = surface.getContext("2d");
        if (!compositeOperation) {
          ctx.clearRect(0, 0, this._drawWidth + 1, this._drawHeight + 1);
        }
        ctx.save();
        ctx.globalCompositeOperation = compositeOperation;
        ctx.setTransform(this.scale, 0, 0, this.scale, -this._filterOffX, -this._filterOffY);
        ctx.translate(-this.x, -this.y);
        target.draw(ctx, true);
        ctx.restore();
        if (target.filters && target.filters.length) {
          this._applyFilters(target);
        }
        surface._invalid = true;
        return;
      }
      this._webGLCache.cacheDraw(target, target.filters, this);
      surface = this.target.cacheCanvas;
      surface.width = this._drawWidth;
      surface.height = this._drawHeight;
      surface._invalid = true;
    };
    BitmapCache.prototype._applyFilters = function _applyFilters() {
      var surface = this.target.cacheCanvas;
      var filters = this.target.filters;
      var w = this._drawWidth;
      var h = this._drawHeight;
      var data = surface.getContext("2d").getImageData(0, 0, w, h);
      var l = filters.length;
      for (var i = 0; i < l; i++) {
        filters[i]._applyFilter(data);
      }
      surface.getContext("2d").putImageData(data, 0, 0);
    };
    return BitmapCache;
  }(Filter);
  var DisplayObject = function(_EventDispatcher) {
    inherits(DisplayObject, _EventDispatcher);
    function DisplayObject() {
      classCallCheck(this, DisplayObject);
      var _this = possibleConstructorReturn(this, _EventDispatcher.call(this));
      _this.alpha = 1;
      _this.cacheCanvas = null;
      _this.bitmapCache = null;
      _this.id = UID.get();
      _this.mouseEnabled = true;
      _this.tickEnabled = true;
      _this.name = null;
      _this.parent = null;
      _this.regX = 0;
      _this.regY = 0;
      _this.rotation = 0;
      _this.scaleX = 1;
      _this.scaleY = 1;
      _this.skewX = 0;
      _this.skewY = 0;
      _this.shadow = null;
      _this.visible = true;
      _this.x = 0;
      _this.y = 0;
      _this.transformMatrix = null;
      _this.compositeOperation = null;
      _this.snapToPixel = true;
      _this.filters = null;
      _this.mask = null;
      _this.hitArea = null;
      _this.cursor = null;
      _this._props = new DisplayProps();
      _this._rectangle = new Rectangle();
      _this._bounds = null;
      _this._webGLRenderStyle = DisplayObject._StageGL_NONE;
      return _this;
    }
    DisplayObject.prototype.isVisible = function isVisible() {
      return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0);
    };
    DisplayObject.prototype.draw = function draw(ctx) {
      var ignoreCache = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      return this.drawCache(ctx, ignoreCache);
    };
    DisplayObject.prototype.drawCache = function drawCache(ctx) {
      var ignoreCache = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var cache = this.bitmapCache;
      if (cache && !ignoreCache) {
        return cache.draw(ctx);
      }
      return false;
    };
    DisplayObject.prototype.updateContext = function updateContext(ctx) {
      var o = this, mask = o.mask, mtx = o._props.matrix;
      if (mask && mask.graphics && !mask.graphics.isEmpty()) {
        mask.getMatrix(mtx);
        ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
        mask.graphics.drawAsPath(ctx);
        ctx.clip();
        mtx.invert();
        ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
      }
      this.getMatrix(mtx);
      var tx = mtx.tx, ty = mtx.ty;
      if (DisplayObject._snapToPixelEnabled && o.snapToPixel) {
        tx = tx + (tx < 0 ? -.5 : .5) | 0;
        ty = ty + (ty < 0 ? -.5 : .5) | 0;
      }
      ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, tx, ty);
      ctx.globalAlpha *= o.alpha;
      if (o.compositeOperation) {
        ctx.globalCompositeOperation = o.compositeOperation;
      }
      if (o.shadow) {
        this._applyShadow(ctx, o.shadow);
      }
    };
    DisplayObject.prototype.cache = function cache(x, y, width, height) {
      var scale = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
      var options = arguments[5];
      if (!this.bitmapCache) {
        this.bitmapCache = new BitmapCache();
      }
      this.bitmapCache.define(this, x, y, width, height, scale, options);
    };
    DisplayObject.prototype.updateCache = function updateCache(compositeOperation) {
      if (!this.bitmapCache) {
        throw "cache() must be called before updateCache()";
      }
      this.bitmapCache.update(compositeOperation);
    };
    DisplayObject.prototype.uncache = function uncache() {
      if (this.bitmapCache) {
        this.bitmapCache.release();
        this.bitmapCache = undefined;
      }
    };
    DisplayObject.prototype.getCacheDataURL = function getCacheDataURL() {
      return this.bitmapCache ? this.bitmapCache.getDataURL() : null;
    };
    DisplayObject.prototype.localToGlobal = function localToGlobal(x, y) {
      var pt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Point();
      return this.getConcatenatedMatrix(this._props.matrix).transformPoint(x, y, pt);
    };
    DisplayObject.prototype.globalToLocal = function globalToLocal(x, y) {
      var pt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Point();
      return this.getConcatenatedMatrix(this._props.matrix).invert().transformPoint(x, y, pt);
    };
    DisplayObject.prototype.localToLocal = function localToLocal(x, y, target, pt) {
      pt = this.localToGlobal(x, y, pt);
      return target.globalToLocal(pt.x, pt.y, pt);
    };
    DisplayObject.prototype.setTransform = function setTransform() {
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
      return this;
    };
    DisplayObject.prototype.getMatrix = function getMatrix(matrix) {
      var o = this, mtx = matrix && matrix.identity() || new Matrix2D();
      return o.transformMatrix ? mtx.copy(o.transformMatrix) : mtx.appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY);
    };
    DisplayObject.prototype.getConcatenatedMatrix = function getConcatenatedMatrix(matrix) {
      var o = this, mtx = this.getMatrix(matrix);
      while (o = o.parent) {
        mtx.prependMatrix(o.getMatrix(o._props.matrix));
      }
      return mtx;
    };
    DisplayObject.prototype.getConcatenatedDisplayProps = function getConcatenatedDisplayProps(props) {
      props = props ? props.identity() : new DisplayProps();
      var o = this, mtx = o.getMatrix(props.matrix);
      do {
        props.prepend(o.visible, o.alpha, o.shadow, o.compositeOperation);
        if (o != this) {
          mtx.prependMatrix(o.getMatrix(o._props.matrix));
        }
      } while (o = o.parent);
      return props;
    };
    DisplayObject.prototype.hitTest = function hitTest(x, y) {
      var ctx = DisplayObject._hitTestContext;
      ctx.setTransform(1, 0, 0, 1, -x, -y);
      this.draw(ctx);
      var hit = this._testHit(ctx);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, 2, 2);
      return hit;
    };
    DisplayObject.prototype.set = function set(props) {
      for (var n in props) {
        this[n] = props[n];
      }
      return this;
    };
    DisplayObject.prototype.getBounds = function getBounds() {
      if (this._bounds) {
        return this._rectangle.copy(this._bounds);
      }
      var cacheCanvas = this.cacheCanvas;
      if (cacheCanvas) {
        var scale = this._cacheScale;
        return this._rectangle.setValues(this._cacheOffsetX, this._cacheOffsetY, cacheCanvas.width / scale, cacheCanvas.height / scale);
      }
      return null;
    };
    DisplayObject.prototype.getTransformedBounds = function getTransformedBounds() {
      return this._getBounds();
    };
    DisplayObject.prototype.setBounds = function setBounds(x, y, width, height) {
      if (x == null) {
        this._bounds = x;
      }
      this._bounds = (this._bounds || new Rectangle()).setValues(x, y, width, height);
    };
    DisplayObject.prototype.clone = function clone() {
      return this._cloneProps(new DisplayObject());
    };
    DisplayObject.prototype.toString = function toString() {
      return "[" + this.constructor.name + (this.name ? " (name=" + this.name + ")" : "") + "]";
    };
    DisplayObject.prototype._cloneProps = function _cloneProps(o) {
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
      return o;
    };
    DisplayObject.prototype._applyShadow = function _applyShadow(ctx) {
      var shadow = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Shadow.identity;
      shadow = shadow;
      ctx.shadowColor = shadow.color;
      ctx.shadowOffsetX = shadow.offsetX;
      ctx.shadowOffsetY = shadow.offsetY;
      ctx.shadowBlur = shadow.blur;
    };
    DisplayObject.prototype._tick = function _tick(evtObj) {
      var ls = this._listeners;
      if (ls && ls["tick"]) {
        evtObj.target = null;
        evtObj.propagationStopped = evtObj.immediatePropagationStopped = false;
        this.dispatchEvent(evtObj);
      }
    };
    DisplayObject.prototype._testHit = function _testHit(ctx) {
      try {
        return ctx.getImageData(0, 0, 1, 1).data[3] > 1;
      } catch (e) {
        if (!DisplayObject.suppressCrossDomainErrors) {
          throw "An error has occurred. This is most likely due to security restrictions on reading canvas pixel data with local or cross-domain images.";
        }
        return false;
      }
    };
    DisplayObject.prototype._getBounds = function _getBounds(matrix, ignoreTransform) {
      return this._transformBounds(this.getBounds(), matrix, ignoreTransform);
    };
    DisplayObject.prototype._transformBounds = function _transformBounds(bounds, matrix, ignoreTransform) {
      if (!bounds) {
        return bounds;
      }
      var x = bounds.x, y = bounds.y, width = bounds.width, height = bounds.height;
      var mtx = this._props.matrix;
      mtx = ignoreTransform ? mtx.identity() : this.getMatrix(mtx);
      if (x || y) {
        mtx.appendTransform(0, 0, 1, 1, 0, 0, 0, -x, -y);
      }
      if (matrix) {
        mtx.prependMatrix(matrix);
      }
      var x_a = width * mtx.a, x_b = width * mtx.b;
      var y_c = height * mtx.c, y_d = height * mtx.d;
      var tx = mtx.tx, ty = mtx.ty;
      var minX = tx, maxX = tx, minY = ty, maxY = ty;
      if ((x = x_a + tx) < minX) {
        minX = x;
      } else if (x > maxX) {
        maxX = x;
      }
      if ((x = x_a + y_c + tx) < minX) {
        minX = x;
      } else if (x > maxX) {
        maxX = x;
      }
      if ((x = y_c + tx) < minX) {
        minX = x;
      } else if (x > maxX) {
        maxX = x;
      }
      if ((y = x_b + ty) < minY) {
        minY = y;
      } else if (y > maxY) {
        maxY = y;
      }
      if ((y = x_b + y_d + ty) < minY) {
        minY = y;
      } else if (y > maxY) {
        maxY = y;
      }
      if ((y = y_d + ty) < minY) {
        minY = y;
      } else if (y > maxY) {
        maxY = y;
      }
      return bounds.setValues(minX, minY, maxX - minX, maxY - minY);
    };
    DisplayObject.prototype._hasMouseEventListener = function _hasMouseEventListener() {
      var evts = DisplayObject._MOUSE_EVENTS;
      for (var i = 0, l = evts.length; i < l; i++) {
        if (this.hasEventListener(evts[i])) {
          return true;
        }
      }
      return !!this.cursor;
    };
    createClass(DisplayObject, [ {
      key: "stage",
      get: function get() {
        var o = this;
        while (o.parent) {
          o = o.parent;
        }
        if (/^\[Stage(GL)?(\s\(name=\w+\))?\]$/.test(o.toString())) {
          return o;
        }
        return null;
      }
    }, {
      key: "scale",
      get: function get() {
        return this.scaleX;
      },
      set: function set(value) {
        this.scaleX = this.scaleY = value;
      }
    } ]);
    return DisplayObject;
  }(EventDispatcher);
  {
    var canvas = createjs && createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas");
    if (canvas.getContext) {
      DisplayObject._hitTestCanvas = canvas;
      DisplayObject._hitTestContext = canvas.getContext("2d");
      canvas.width = canvas.height = 1;
    }
    DisplayObject._MOUSE_EVENTS = [ "click", "dblclick", "mousedown", "mouseout", "mouseover", "pressmove", "pressup", "rollout", "rollover" ];
    DisplayObject.suppressCrossDomainErrors = false;
    DisplayObject.snapToPixelEnabled = false;
    DisplayObject._StageGL_NONE = 0;
    DisplayObject._StageGL_SPRITE = 1;
    DisplayObject._StageGL_BITMAP = 2;
  }
  var Container = function(_DisplayObject) {
    inherits(Container, _DisplayObject);
    function Container() {
      classCallCheck(this, Container);
      var _this = possibleConstructorReturn(this, _DisplayObject.call(this));
      _this.children = [];
      _this.mouseChildren = true;
      _this.tickChildren = true;
      return _this;
    }
    Container.prototype.isVisible = function isVisible() {
      var hasContent = this.cacheCanvas || this.children.length;
      return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent);
    };
    Container.prototype.draw = function draw(ctx) {
      var ignoreCache = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      if (_DisplayObject.prototype.draw.call(this, ctx, ignoreCache)) {
        return true;
      }
      var list = this.children.slice();
      for (var i = 0, l = list.length; i < l; i++) {
        var child = list[i];
        if (!child.isVisible()) {
          continue;
        }
        ctx.save();
        child.updateContext(ctx);
        child.draw(ctx);
        ctx.restore();
      }
      return true;
    };
    Container.prototype.addChild = function addChild() {
      for (var _len = arguments.length, children = Array(_len), _key = 0; _key < _len; _key++) {
        children[_key] = arguments[_key];
      }
      var l = children.length;
      if (l === 0) {
        return null;
      }
      var child = children[0];
      if (l > 1) {
        for (var i = 0; i < l; i++) {
          child = this.addChild(children[i]);
        }
        return child;
      }
      var parent = child.parent, silent = parent === this;
      parent && parent._removeChildAt(parent.children.indexOf(child), silent);
      child.parent = this;
      this.children.push(child);
      if (!silent) {
        child.dispatchEvent("added");
      }
      return child;
    };
    Container.prototype.addChildAt = function addChildAt() {
      for (var _len2 = arguments.length, children = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        children[_key2] = arguments[_key2];
      }
      var l = children.length;
      if (l === 0) {
        return null;
      }
      var index = children.pop();
      if (index < 0 || index > this.children.length) {
        return children[l - 2];
      }
      if (l > 2) {
        for (var i = 0; i < l - 1; i++) {
          this.addChildAt(children[i], index++);
        }
        return children[l - 2];
      }
      var child = children[0];
      var parent = child.parent, silent = parent === this;
      parent && parent._removeChildAt(parent.children.indexOf(child), silent);
      child.parent = this;
      this.children.splice(index++, 0, child);
      if (!silent) {
        child.dispatchEvent("added");
      }
      return child;
    };
    Container.prototype.removeChild = function removeChild() {
      for (var _len3 = arguments.length, children = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        children[_key3] = arguments[_key3];
      }
      var l = children.length;
      if (l === 0) {
        return true;
      }
      if (l > 1) {
        var good = true;
        for (var i = 0; i < l; i++) {
          good = good && this.removeChild(children[i]);
        }
        return good;
      }
      return this._removeChildAt(this.children.indexOf(children[0]));
    };
    Container.prototype.removeChildAt = function removeChildAt() {
      for (var _len4 = arguments.length, indexes = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        indexes[_key4] = arguments[_key4];
      }
      var l = indexes.length;
      if (l === 0) {
        return true;
      }
      if (l > 1) {
        indexes.sort(function(a, b) {
          return b - a;
        });
        var good = true;
        for (var i = 0; i < l; i++) {
          good = good && this._removeChildAt(indexes[i]);
        }
        return good;
      }
      return this._removeChildAt(indexes[0]);
    };
    Container.prototype.removeAllChildren = function removeAllChildren() {
      var kids = this.children;
      while (kids.length) {
        this._removeChildAt(0);
      }
    };
    Container.prototype.getChildAt = function getChildAt(index) {
      return this.children[index];
    };
    Container.prototype.getChildByName = function getChildByName(name) {
      var kids = this.children;
      var l = kids.length;
      for (var i = 0; i < l; i++) {
        if (kids[i].name === name) {
          return kids[i];
        }
      }
      return null;
    };
    Container.prototype.sortChildren = function sortChildren(sortFunction) {
      this.children.sort(sortFunction);
    };
    Container.prototype.getChildIndex = function getChildIndex(child) {
      return this.children.indexOf(child);
    };
    Container.prototype.swapChildrenAt = function swapChildrenAt(index1, index2) {
      var kids = this.children;
      var o1 = kids[index1];
      var o2 = kids[index2];
      if (!o1 || !o2) {
        return;
      }
      kids[index1] = o2;
      kids[index2] = o1;
    };
    Container.prototype.swapChildren = function swapChildren(child1, child2) {
      var kids = this.children;
      var l = kids.length;
      var index1 = void 0, index2 = void 0;
      for (var i = 0; i < l; i++) {
        if (kids[i] === child1) {
          index1 = i;
        }
        if (kids[i] === child2) {
          index2 = i;
        }
        if (index1 != null && index2 != null) {
          break;
        }
      }
      if (i === l) {
        return;
      }
      kids[index1] = child2;
      kids[index2] = child1;
    };
    Container.prototype.setChildIndex = function setChildIndex(child, index) {
      var kids = this.children;
      var l = kids.length;
      if (child.parent != this || index < 0 || index >= l) {
        return;
      }
      for (var i = 0; i < l; i++) {
        if (kids[i] === child) {
          break;
        }
      }
      if (i === l || i === index) {
        return;
      }
      kids.splice(i, 1);
      kids.splice(index, 0, child);
    };
    Container.prototype.contains = function contains(child) {
      while (child) {
        if (child === this) {
          return true;
        }
        child = child.parent;
      }
      return false;
    };
    Container.prototype.hitTest = function hitTest(x, y) {
      return this.getObjectUnderPoint(x, y) != null;
    };
    Container.prototype.getObjectsUnderPoint = function getObjectsUnderPoint(x, y) {
      var mode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var arr = [];
      var pt = this.localToGlobal(x, y);
      this._getObjectsUnderPoint(pt.x, pt.y, arr, mode > 0, mode === 1);
      return arr;
    };
    Container.prototype.getObjectUnderPoint = function getObjectUnderPoint(x, y) {
      var mode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var pt = this.localToGlobal(x, y);
      return this._getObjectsUnderPoint(pt.x, pt.y, null, mode > 0, mode === 1);
    };
    Container.prototype.getBounds = function getBounds() {
      return this._getBounds(null, true);
    };
    Container.prototype.getTransformedBounds = function getTransformedBounds() {
      return this._getBounds();
    };
    Container.prototype.clone = function clone() {
      var recursive = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var o = this._cloneProps(new Container());
      if (recursive) {
        this._cloneChildren(o);
      }
      return o;
    };
    Container.prototype._tick = function _tick(evtObj) {
      if (this.tickChildren) {
        for (var i = this.children.length - 1; i >= 0; i--) {
          var child = this.children[i];
          if (child.tickEnabled && child._tick) {
            child._tick(evtObj);
          }
        }
      }
      _DisplayObject.prototype._tick.call(this, evtObj);
    };
    Container.prototype._cloneChildren = function _cloneChildren(o) {
      if (o.children.length) {
        o.removeAllChildren();
      }
      var arr = o.children;
      var l = this.children.length;
      for (var i = 0; i < l; i++) {
        var clone = this.children[i].clone(true);
        clone.parent = o;
        arr.push(clone);
      }
    };
    Container.prototype._removeChildAt = function _removeChildAt(index) {
      var silent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      if (index < 0 || index > this.children.length - 1) {
        return false;
      }
      var child = this.children[index];
      if (child) {
        child.parent = null;
      }
      this.children.splice(index, 1);
      if (!silent) {
        child.dispatchEvent("removed");
      }
      return true;
    };
    Container.prototype._getObjectsUnderPoint = function _getObjectsUnderPoint(x, y, arr, mouse, activeListener) {
      var currentDepth = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
      if (!currentDepth && !this._testMask(this, x, y)) {
        return null;
      }
      var mtx = void 0, ctx = DisplayObject._hitTestContext;
      activeListener = activeListener || mouse && this._hasMouseEventListener();
      var children = this.children;
      var l = children.length;
      for (var i = l - 1; i >= 0; i--) {
        var child = children[i];
        var hitArea = child.hitArea;
        if (!child.visible || !hitArea && !child.isVisible() || mouse && !child.mouseEnabled) {
          continue;
        }
        if (!hitArea && !this._testMask(child, x, y)) {
          continue;
        }
        if (!hitArea && child instanceof Container) {
          var result = child._getObjectsUnderPoint(x, y, arr, mouse, activeListener, currentDepth + 1);
          if (!arr && result) {
            return mouse && !this.mouseChildren ? this : result;
          }
        } else {
          if (mouse && !activeListener && !child._hasMouseEventListener()) {
            continue;
          }
          var props = child.getConcatenatedDisplayProps(child._props);
          mtx = props.matrix;
          if (hitArea) {
            mtx.appendMatrix(hitArea.getMatrix(hitArea._props.matrix));
            props.alpha = hitArea.alpha;
          }
          ctx.globalAlpha = props.alpha;
          ctx.setTransform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx - x, mtx.ty - y);
          (hitArea || child).draw(ctx);
          if (!this._testHit(ctx)) {
            continue;
          }
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.clearRect(0, 0, 2, 2);
          if (arr) {
            arr.push(child);
          } else {
            return mouse && !this.mouseChildren ? this : child;
          }
        }
      }
      return null;
    };
    Container.prototype._testMask = function _testMask(target, x, y) {
      var mask = target.mask;
      if (!mask || !mask.graphics || mask.graphics.isEmpty()) {
        return true;
      }
      var mtx = this._props.matrix, parent = target.parent;
      mtx = parent ? parent.getConcatenatedMatrix(mtx) : mtx.identity();
      mtx = mask.getMatrix(mask._props.matrix).prependMatrix(mtx);
      var ctx = DisplayObject._hitTestContext;
      ctx.setTransform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx - x, mtx.ty - y);
      mask.graphics.drawAsPath(ctx);
      ctx.fillStyle = "#000";
      ctx.fill();
      if (!this._testHit(ctx)) {
        return false;
      }
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, 2, 2);
      return true;
    };
    Container.prototype._getBounds = function _getBounds(matrix, ignoreTransform) {
      var bounds = _DisplayObject.prototype.getBounds.call(this);
      if (bounds) {
        return this._transformBounds(bounds, matrix, ignoreTransform);
      }
      var mtx = this._props.matrix;
      mtx = ignoreTransform ? mtx.identity() : this.getMatrix(mtx);
      if (matrix) {
        mtx.prependMatrix(matrix);
      }
      var l = this.children.length;
      var rect = null;
      for (var i = 0; i < l; i++) {
        var child = this.children[i];
        if (!child.visible || !(bounds = child._getBounds(mtx))) {
          continue;
        }
        if (rect) {
          rect.extend(bounds.x, bounds.y, bounds.width, bounds.height);
        } else {
          rect = bounds.clone();
        }
      }
      return rect;
    };
    createClass(Container, [ {
      key: "numChildren",
      get: function get() {
        return this.children.length;
      }
    } ]);
    return Container;
  }(DisplayObject);
  var MouseEvent = function(_Event) {
    inherits(MouseEvent, _Event);
    function MouseEvent(type, bubbles, cancelable, stageX, stageY, nativeEvent, pointerID, primary, rawX, rawY, relatedTarget) {
      classCallCheck(this, MouseEvent);
      var _this = possibleConstructorReturn(this, _Event.call(this, type, bubbles, cancelable));
      _this.stageX = stageX;
      _this.stageY = stageY;
      _this.rawX = rawX == null ? stageX : rawX;
      _this.rawY = rawY == null ? stageY : rawY;
      _this.nativeEvent = nativeEvent;
      _this.pointerID = pointerID;
      _this.primary = !!primary;
      _this.relatedTarget = relatedTarget;
      return _this;
    }
    MouseEvent.prototype.clone = function clone() {
      return new MouseEvent(this.type, this.bubbles, this.cancelable, this.stageX, this.stageY, this.nativeEvent, this.pointerID, this.primary, this.rawX, this.rawY);
    };
    MouseEvent.prototype.toString = function toString() {
      return "[" + this.constructor.name + " (type=" + this.type + " stageX=" + this.stageX + " stageY=" + this.stageY + ")]";
    };
    createClass(MouseEvent, [ {
      key: "localX",
      get: function get() {
        return this.currentTarget.globalToLocal(this.rawX, this.rawY).x;
      }
    }, {
      key: "localY",
      get: function get() {
        return this.currentTarget.globalToLocal(this.rawX, this.rawY).y;
      }
    }, {
      key: "isTouch",
      get: function get() {
        return this.pointerID !== -1;
      }
    } ]);
    return MouseEvent;
  }(Event);
  var Stage = function(_Container) {
    inherits(Stage, _Container);
    function Stage(canvas) {
      classCallCheck(this, Stage);
      var _this = possibleConstructorReturn(this, _Container.call(this));
      _this.autoClear = true;
      _this.canvas = typeof canvas === "string" ? document.getElementById(canvas) : canvas;
      _this.mouseX = 0;
      _this.mouseY = 0;
      _this.drawRect = null;
      _this.snapToPixelEnabled = false;
      _this.mouseInBounds = false;
      _this.tickOnUpdate = true;
      _this.mouseMoveOutside = false;
      _this.preventSelection = true;
      _this._pointerData = {};
      _this._pointerCount = 0;
      _this._primaryPointerID = null;
      _this._mouseOverIntervalID = null;
      _this._nextStage = null;
      _this._prevStage = null;
      _this.enableDOMEvents(true);
      return _this;
    }
    Stage.prototype.update = function update(props) {
      if (!this.canvas) {
        return;
      }
      if (this.tickOnUpdate) {
        this.tick(props);
      }
      if (this.dispatchEvent("drawstart", false, true) === false) {
        return;
      }
      DisplayObject._snapToPixelEnabled = this.snapToPixelEnabled;
      var r = this.drawRect, ctx = this.canvas.getContext("2d");
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      if (this.autoClear) {
        if (r) {
          ctx.clearRect(r.x, r.y, r.width, r.height);
        } else {
          ctx.clearRect(0, 0, this.canvas.width + 1, this.canvas.height + 1);
        }
      }
      ctx.save();
      if (this.drawRect) {
        ctx.beginPath();
        ctx.rect(r.x, r.y, r.width, r.height);
        ctx.clip();
      }
      this.updateContext(ctx);
      this.draw(ctx, false);
      ctx.restore();
      this.dispatchEvent("drawend");
    };
    Stage.prototype.tick = function tick(props) {
      if (!this.tickEnabled || this.dispatchEvent("tickstart", false, true) === false) {
        return;
      }
      var evtObj = new Event("tick");
      if (props) {
        for (var n in props) {
          if (props.hasOwnProperty(n)) {
            evtObj[n] = props[n];
          }
        }
      }
      this._tick(evtObj);
      this.dispatchEvent("tickend");
    };
    Stage.prototype.handleEvent = function handleEvent(evt) {
      if (evt.type === "tick") {
        this.update(evt);
      }
    };
    Stage.prototype.clear = function clear() {
      if (!this.canvas) {
        return;
      }
      var ctx = this.canvas.getContext("2d");
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, this.canvas.width + 1, this.canvas.height + 1);
    };
    Stage.prototype.toDataURL = function toDataURL(backgroundColor) {
      var mimeType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "image/png";
      var data = void 0, ctx = this.canvas.getContext("2d"), w = this.canvas.width, h = this.canvas.height;
      if (backgroundColor) {
        data = ctx.getImageData(0, 0, w, h);
        var compositeOperation = ctx.globalCompositeOperation;
        ctx.globalCompositeOperation = "destination-over";
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, w, h);
      }
      var dataURL = this.canvas.toDataURL(mimeType);
      if (backgroundColor) {
        ctx.putImageData(data, 0, 0);
        ctx.globalCompositeOperation = compositeOperation;
      }
      return dataURL;
    };
    Stage.prototype.enableMouseOver = function enableMouseOver() {
      var _this2 = this;
      var frequency = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 20;
      if (this._mouseOverIntervalID) {
        clearInterval(this._mouseOverIntervalID);
        this._mouseOverIntervalID = null;
        if (frequency === 0) {
          this._testMouseOver(true);
        }
      }
      if (frequency <= 0) {
        return;
      }
      this._mouseOverIntervalID = setInterval(function() {
        return _this2._testMouseOver();
      }, 1e3 / Math.min(50, frequency));
    };
    Stage.prototype.enableDOMEvents = function enableDOMEvents() {
      var _this3 = this;
      var enable = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var ls = this._eventListeners;
      if (!enable && ls) {
        for (var n in ls) {
          var o = ls[n];
          o.t.removeEventListener(n, o.f, false);
        }
        this._eventListeners = null;
      } else if (enable && !ls && this.canvas) {
        var t = window.addEventListener ? window : document;
        ls = this._eventListeners = {
          mouseup: {
            t: t,
            f: function f(e) {
              return _this3._handleMouseUp(e);
            }
          },
          mousemove: {
            t: t,
            f: function f(e) {
              return _this3._handleMouseMove(e);
            }
          },
          dblclick: {
            t: this.canvas,
            f: function f(e) {
              return _this3._handleDoubleClick(e);
            }
          },
          mousedown: {
            t: this.canvas,
            f: function f(e) {
              return _this3._handleMouseDown(e);
            }
          }
        };
        for (var _n in ls) {
          var _o = ls[_n];
          _o.t.addEventListener(_n, _o.f, false);
        }
      }
    };
    Stage.prototype.clone = function clone() {
      throw "Stage cannot be cloned.";
    };
    Stage.prototype._getElementRect = function _getElementRect(e) {
      var bounds = void 0;
      try {
        bounds = e.getBoundingClientRect();
      } catch (err) {
        bounds = {
          top: e.offsetTop,
          left: e.offsetLeft,
          width: e.offsetWidth,
          height: e.offsetHeight
        };
      }
      var offX = (window.pageXOffset || document.scrollLeft || 0) - (document.clientLeft || document.body.clientLeft || 0);
      var offY = (window.pageYOffset || document.scrollTop || 0) - (document.clientTop || document.body.clientTop || 0);
      var styles = window.getComputedStyle ? getComputedStyle(e, null) : e.currentStyle;
      var padL = parseInt(styles.paddingLeft) + parseInt(styles.borderLeftWidth);
      var padT = parseInt(styles.paddingTop) + parseInt(styles.borderTopWidth);
      var padR = parseInt(styles.paddingRight) + parseInt(styles.borderRightWidth);
      var padB = parseInt(styles.paddingBottom) + parseInt(styles.borderBottomWidth);
      return {
        left: bounds.left + offX + padL,
        right: bounds.right + offX - padR,
        top: bounds.top + offY + padT,
        bottom: bounds.bottom + offY - padB
      };
    };
    Stage.prototype._getPointerData = function _getPointerData(id) {
      var data = this._pointerData[id];
      if (!data) {
        data = this._pointerData[id] = {
          x: 0,
          y: 0
        };
      }
      return data;
    };
    Stage.prototype._handleMouseMove = function _handleMouseMove() {
      var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window.event;
      this._handlePointerMove(-1, e, e.pageX, e.pageY);
    };
    Stage.prototype._handlePointerMove = function _handlePointerMove(id, e, pageX, pageY, owner) {
      if (this._prevStage && owner === undefined) {
        return;
      }
      if (!this.canvas) {
        return;
      }
      var nextStage = this._nextStage, o = this._getPointerData(id);
      var inBounds = o.inBounds;
      this._updatePointerPosition(id, e, pageX, pageY);
      if (inBounds || o.inBounds || this.mouseMoveOutside) {
        if (id === -1 && o.inBounds === !inBounds) {
          this._dispatchMouseEvent(this, inBounds ? "mouseleave" : "mouseenter", false, id, o, e);
        }
        this._dispatchMouseEvent(this, "stagemousemove", false, id, o, e);
        this._dispatchMouseEvent(o.target, "pressmove", true, id, o, e);
      }
      nextStage && nextStage._handlePointerMove(id, e, pageX, pageY, null);
    };
    Stage.prototype._updatePointerPosition = function _updatePointerPosition(id, e, pageX, pageY) {
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
        o.y = pageY;
      } else if (this.mouseMoveOutside) {
        o.x = pageX < 0 ? 0 : pageX > w - 1 ? w - 1 : pageX;
        o.y = pageY < 0 ? 0 : pageY > h - 1 ? h - 1 : pageY;
      }
      o.posEvtObj = e;
      o.rawX = pageX;
      o.rawY = pageY;
      if (id === this._primaryPointerID || id === -1) {
        this.mouseX = o.x;
        this.mouseY = o.y;
        this.mouseInBounds = o.inBounds;
      }
    };
    Stage.prototype._handleMouseUp = function _handleMouseUp(e) {
      this._handlePointerUp(-1, e, false);
    };
    Stage.prototype._handlePointerUp = function _handlePointerUp(id, e, clear, owner) {
      var nextStage = this._nextStage, o = this._getPointerData(id);
      if (this._prevStage && owner === undefined) {
        return;
      }
      var target = null, oTarget = o.target;
      if (!owner && (oTarget || nextStage)) {
        target = this._getObjectsUnderPoint(o.x, o.y, null, true);
      }
      if (o.down) {
        this._dispatchMouseEvent(this, "stagemouseup", false, id, o, e, target);
        o.down = false;
      }
      if (target === oTarget) {
        this._dispatchMouseEvent(oTarget, "click", true, id, o, e);
      }
      this._dispatchMouseEvent(oTarget, "pressup", true, id, o, e);
      if (clear) {
        if (id == this._primaryPointerID) {
          this._primaryPointerID = null;
        }
        delete this._pointerData[id];
      } else {
        o.target = null;
      }
      nextStage && nextStage._handlePointerUp(id, e, clear, owner || target && this);
    };
    Stage.prototype._handleMouseDown = function _handleMouseDown(e) {
      this._handlePointerDown(-1, e, e.pageX, e.pageY);
    };
    Stage.prototype._handlePointerDown = function _handlePointerDown(id, e, pageX, pageY, owner) {
      if (this.preventSelection) {
        e.preventDefault();
      }
      if (this._primaryPointerID == null || id === -1) {
        this._primaryPointerID = id;
      }
      if (pageY != null) {
        this._updatePointerPosition(id, e, pageX, pageY);
      }
      var target = null, nextStage = this._nextStage, o = this._getPointerData(id);
      if (!owner) {
        target = o.target = this._getObjectsUnderPoint(o.x, o.y, null, true);
      }
      if (o.inBounds) {
        this._dispatchMouseEvent(this, "stagemousedown", false, id, o, e, target);
        o.down = true;
      }
      this._dispatchMouseEvent(target, "mousedown", true, id, o, e);
      nextStage && nextStage._handlePointerDown(id, e, pageX, pageY, owner || target && this);
    };
    Stage.prototype._testMouseOver = function _testMouseOver(clear, owner, eventTarget) {
      if (this._prevStage && owner === undefined) {
        return;
      }
      var nextStage = this._nextStage;
      if (!this._mouseOverIntervalID) {
        nextStage && nextStage._testMouseOver(clear, owner, eventTarget);
        return;
      }
      var o = this._getPointerData(-1);
      if (!o || !clear && this.mouseX === this._mouseOverX && this.mouseY === this._mouseOverY && this.mouseInBounds) {
        return;
      }
      var e = o.posEvtObj;
      var isEventTarget = eventTarget || e && e.target === this.canvas;
      var target = null, common = -1, cursor = "";
      if (!owner && (clear || this.mouseInBounds && isEventTarget)) {
        target = this._getObjectsUnderPoint(this.mouseX, this.mouseY, null, true);
        this._mouseOverX = this.mouseX;
        this._mouseOverY = this.mouseY;
      }
      var oldList = this._mouseOverTarget || [];
      var oldTarget = oldList[oldList.length - 1];
      var list = this._mouseOverTarget = [];
      var t = target;
      while (t) {
        list.unshift(t);
        if (!cursor) {
          cursor = t.cursor;
        }
        t = t.parent;
      }
      this.canvas.style.cursor = cursor;
      if (!owner && eventTarget) {
        eventTarget.canvas.style.cursor = cursor;
      }
      for (var i = 0, l = list.length; i < l; i++) {
        if (list[i] != oldList[i]) {
          break;
        }
        common = i;
      }
      if (oldTarget != target) {
        this._dispatchMouseEvent(oldTarget, "mouseout", true, -1, o, e, target);
      }
      for (var _i = oldList.length - 1; _i > common; _i--) {
        this._dispatchMouseEvent(oldList[_i], "rollout", false, -1, o, e, target);
      }
      for (var _i2 = list.length - 1; _i2 > common; _i2--) {
        this._dispatchMouseEvent(list[_i2], "rollover", false, -1, o, e, oldTarget);
      }
      if (oldTarget != target) {
        this._dispatchMouseEvent(target, "mouseover", true, -1, o, e, oldTarget);
      }
      nextStage && nextStage._testMouseOver(clear, owner || target && this, eventTarget || isEventTarget && this);
    };
    Stage.prototype._handleDoubleClick = function _handleDoubleClick(e, owner) {
      var target = null, nextStage = this._nextStage, o = this._getPointerData(-1);
      if (!owner) {
        target = this._getObjectsUnderPoint(o.x, o.y, null, true);
        this._dispatchMouseEvent(target, "dblclick", true, -1, o, e);
      }
      nextStage && nextStage._handleDoubleClick(e, owner || target && this);
    };
    Stage.prototype._dispatchMouseEvent = function _dispatchMouseEvent(target, type, bubbles, pointerId, o, nativeEvent, relatedTarget) {
      if (!target || !bubbles && !target.hasEventListener(type)) {
        return;
      }
      var evt = new MouseEvent(type, bubbles, false, o.x, o.y, nativeEvent, pointerId, pointerId === this._primaryPointerID || pointerId === -1, o.rawX, o.rawY, relatedTarget);
      target.dispatchEvent(evt);
    };
    createClass(Stage, [ {
      key: "nextStage",
      get: function get() {
        return this._nextStage;
      },
      set: function set(stage) {
        if (this._nextStage) {
          this._nextStage._prevStage = null;
        }
        if (stage) {
          stage._prevStage = this;
        }
        this._nextStage = stage;
      }
    } ]);
    return Stage;
  }(Container);
  var StageGL = function(_Stage) {
    inherits(StageGL, _Stage);
    function StageGL(canvas, _ref) {
      var _ref$preserveBuffer = _ref.preserveBuffer, preserveBuffer = _ref$preserveBuffer === undefined ? false : _ref$preserveBuffer, _ref$antialias = _ref.antialias, antialias = _ref$antialias === undefined ? false : _ref$antialias, _ref$transparent = _ref.transparent, transparent = _ref$transparent === undefined ? false : _ref$transparent, _ref$premultiply = _ref.premultiply, premultiply = _ref$premultiply === undefined ? false : _ref$premultiply, _ref$autoPurge = _ref.autoPurge, autoPurge = _ref$autoPurge === undefined ? 1200 : _ref$autoPurge;
      classCallCheck(this, StageGL);
      var _this = possibleConstructorReturn(this, _Stage.call(this, canvas));
      _this.vocalDebug = false;
      _this._preserveBuffer = preserveBuffer;
      _this._antialias = antialias;
      _this._transparent = transparent;
      _this._premultiply = premultiply;
      _this._autoPurge = autoPurge;
      _this._viewportWidth = 0;
      _this._viewportHeight = 0;
      _this._projectionMatrix = null;
      _this._webGLContext = null;
      _this._clearColor = {
        r: 0,
        g: 0,
        b: 0,
        a: 0
      };
      _this._maxCardsPerBatch = StageGL.DEFAULT_MAX_BATCH_SIZE;
      _this._activeShader = null;
      _this._vertices = null;
      _this._vertexPositionBuffer = null;
      _this._uvs = null;
      _this._uvPositionBuffer = null;
      _this._indices = null;
      _this._textureIndexBuffer = null;
      _this._alphas = null;
      _this._alphaBuffer = null;
      _this._textureDictionary = [];
      _this._textureIDs = {};
      _this._batchTextures = [];
      _this._baseTextures = [];
      _this._batchTextureCount = 8;
      _this._lastTextureInsert = -1;
      _this._batchID = 0;
      _this._drawID = 0;
      _this._slotBlacklist = [];
      _this._isDrawing = 0;
      _this._lastTrackedCanvas = -1;
      _this.isCacheControlled = false;
      _this._cacheContainer = new Container();
      _this._initializeWebGL();
      return _this;
    }
    StageGL.buildUVRects = function buildUVRects(spritesheet) {
      var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;
      var onlyTarget = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      if (!spritesheet || !spritesheet._frames) {
        return null;
      }
      var start = target != -1 && onlyTarget ? target : 0;
      var end = target != -1 && onlyTarget ? target + 1 : spritesheet._frames.length;
      for (var i = start; i < end; i++) {
        var f = spritesheet._frames[i];
        if (f.uvRect || f.image.width <= 0 || f.image.height <= 0) {
          continue;
        }
        var _r = f.rect;
        f.uvRect = {
          t: _r.y / f.image.height,
          l: _r.x / f.image.width,
          b: (_r.y + _r.height) / f.image.height,
          r: (_r.x + _r.width) / f.image.width
        };
      }
      var r = StageGL.UV_RECT;
      return spritesheet._frames[target != -1 ? target : 0].uvRect || {
        t: r.t,
        l: r.l,
        b: r.b,
        r: r.r
      };
    };
    StageGL.isWebGLActive = function isWebGLActive(ctx) {
      return ctx && ctx instanceof WebGLRenderingContext && typeof WebGLRenderingContext !== "undefined";
    };
    StageGL.prototype._initializeWebGL = function _initializeWebGL() {
      if (this.canvas) {
        if (!this._webGLContext || this._webGLContext.canvas !== this.canvas) {
          var options = {
            depth: false,
            alpha: this._transparent,
            stencil: true,
            antialias: this._antialias,
            premultipliedAlpha: this._premultiply,
            preserveDrawingBuffer: this._preserveBuffer
          };
          var gl = this._webGLContext = this._fetchWebGLContext(this.canvas, options);
          if (!gl) {
            return null;
          }
          this.updateSimultaneousTextureCount(gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS));
          this._maxTextureSlots = gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
          this._createBuffers(gl);
          this._initTextures(gl);
          gl.disable(gl.DEPTH_TEST);
          gl.enable(gl.BLEND);
          gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
          gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this._premultiply);
          this.setClearColor();
          this.updateViewport(this._viewportWidth || this.canvas.width, this._viewportHeight || this.canvas.height);
        }
      } else {
        this._webGLContext = null;
      }
      return this._webGLContext;
    };
    StageGL.prototype.update = function update(props) {
      if (!this.canvas) {
        return;
      }
      if (this.tickOnUpdate) {
        this.tick(props);
      }
      this.dispatchEvent("drawstart");
      if (this.autoClear) {
        this.clear();
      }
      if (this._webGLContext) {
        this._batchDraw(this, this._webGLContext);
        if (this._autoPurge != -1 && !(this._drawID % (this._autoPurge / 2 | 0))) {
          this.purgeTextures(this._autoPurge);
        }
      } else {
        var ctx = this.canvas.getContext("2d");
        ctx.save();
        this.updateContext(ctx);
        this.draw(ctx, false);
        ctx.restore();
      }
      this.dispatchEvent("drawend");
    };
    StageGL.prototype.clear = function clear() {
      if (!this.canvas) {
        return;
      }
      if (StageGL.isWebGLActive(this._webGLContext)) {
        var gl = this._webGLContext;
        gl.clear(gl.COLOR_BUFFER_BIT);
      } else {
        var ctx = this.canvas.getContext("2d");
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, this.canvas.width + 1, this.canvas.height + 1);
        _Stage.prototype.clear.call(this);
      }
    };
    StageGL.prototype.draw = function draw(context) {
      var ignoreCache = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      if (context === this._webGLContext && StageGL.isWebGLActive(this._webGLContext)) {
        var gl = this._webGLContext;
        this._batchDraw(this, gl, ignoreCache);
        return true;
      } else {
        return _Stage.prototype.draw.call(this, context, ignoreCache);
      }
    };
    StageGL.prototype.cacheDraw = function cacheDraw(target, filters, manager) {
      if (StageGL.isWebGLActive(this._webGLContext)) {
        this._cacheDraw(target, filters, manager);
        return true;
      } else {
        return false;
      }
    };
    StageGL.prototype.protectTextureSlot = function protectTextureSlot(id) {
      var lock = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      if (id > this._maxTextureSlots || id < 0) {
        throw "Slot outside of acceptable range";
      }
      this._slotBlacklist[id] = !!lock;
    };
    StageGL.prototype.getTargetRenderTexture = function getTargetRenderTexture(target, w, h) {
      var result = void 0, toggle = false;
      var gl = this._webGLContext;
      if (target.__lastRT !== undefined && target.__lastRT === target.__rtA) {
        toggle = true;
      }
      if (!toggle) {
        if (target.__rtA === undefined) {
          target.__rtA = this.getRenderBufferTexture(w, h);
        } else {
          if (w != target.__rtA._width || h != target.__rtA._height) {
            this.resizeTexture(target.__rtA, w, h);
          }
          this.setTextureParams(gl);
        }
        result = target.__rtA;
      } else {
        if (target.__rtB === undefined) {
          target.__rtB = this.getRenderBufferTexture(w, h);
        } else {
          if (w != target.__rtB._width || h != target.__rtB._height) {
            this.resizeTexture(target.__rtB, w, h);
          }
          this.setTextureParams(gl);
        }
        result = target.__rtB;
      }
      if (!result) {
        throw "Problems creating render textures, known causes include using too much VRAM by not releasing WebGL texture instances";
      }
      target.__lastRT = result;
      return result;
    };
    StageGL.prototype.releaseTexture = function releaseTexture(item, safe) {
      if (!item) {
        return;
      }
      if (item.children) {
        for (var i = 0, l = item.children.length; i < l; i++) {
          this.releaseTexture(item.children[i]);
        }
      }
      if (item.cacheCanvas) {
        item.uncache();
      }
      var foundImage = void 0;
      if (item._storeID !== undefined) {
        if (item === this._textureDictionary[item._storeID]) {
          this._killTextureObject(item);
          item._storeID = undefined;
          return;
        }
        foundImage = item;
      } else if (item._webGLRenderStyle === 2) {
        foundImage = item.image;
      } else if (item._webGLRenderStyle === 1) {
        for (var _i = 0, _l = item.spriteSheet._images.length; _i < _l; _i++) {
          this.releaseTexture(item.spriteSheet._images[_i]);
        }
        return;
      }
      if (foundImage === undefined) {
        if (this.vocalDebug) {
          console.log("No associated texture found on release");
        }
        return;
      }
      var texture = this._textureDictionary[foundImage._storeID];
      if (safe) {
        var data = texture._imageData;
        var index = data.indexOf(foundImage);
        if (index >= 0) {
          data.splice(index, 1);
        }
        foundImage._storeID = undefined;
        if (data.length === 0) {
          this._killTextureObject(texture);
        }
      } else {
        this._killTextureObject(texture);
      }
    };
    StageGL.prototype.purgeTextures = function purgeTextures() {
      var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;
      if (count < 0) {
        count = 100;
      }
      var dict = this._textureDictionary;
      var l = dict.length;
      var i = void 0, j = void 0;
      for (i = 0; i < l; i++) {
        var data = void 0, texture = dict[i];
        if (!texture || !(data = texture._imageData)) {
          continue;
        }
        for (j = 0; j < data.length; j++) {
          var item = data[j];
          if (item._drawID + count <= this._drawID) {
            item._storeID = undefined;
            data.splice(j--, 1);
          }
        }
        if (!data.length) {
          this._killTextureObject(texture);
        }
      }
    };
    StageGL.prototype.updateSimultaneousTextureCount = function updateSimultaneousTextureCount() {
      var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var gl = this._webGLContext;
      var success = false;
      if (count < 1) {
        count = 1;
      }
      this._batchTextureCount = count;
      while (!success) {
        try {
          this._activeShader = this._fetchShaderProgram(gl);
          success = true;
        } catch (e) {
          if (this._batchTextureCount === 1) {
            throw "Cannot compile shader " + e;
          }
          this._batchTextureCount -= 4;
          if (this._batchTextureCount < 1) {
            this._batchTextureCount = 1;
          }
          if (this.vocalDebug) {
            console.log("Reducing desired texture count due to errors: " + this._batchTextureCount);
          }
        }
      }
    };
    StageGL.prototype.updateViewport = function updateViewport(width, height) {
      this._viewportWidth = width | 0;
      this._viewportHeight = height | 0;
      var gl = this._webGLContext;
      if (gl) {
        gl.viewport(0, 0, this._viewportWidth, this._viewportHeight);
        this._projectionMatrix = new Float32Array([ 2 / this._viewportWidth, 0, 0, 0, 0, -2 / this._viewportHeight, 1, 0, 0, 0, 1, 0, -1, 1, .1, 0 ]);
        this._projectionMatrixFlip = new Float32Array([ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]);
        this._projectionMatrixFlip.set(this._projectionMatrix);
        this._projectionMatrixFlip[5] *= -1;
        this._projectionMatrixFlip[13] *= -1;
      }
    };
    StageGL.prototype.getFilterShader = function getFilterShader(filter) {
      if (!filter) {
        filter = this;
      }
      var gl = this._webGLContext;
      var targetShader = this._activeShader;
      if (filter._builtShader) {
        targetShader = filter._builtShader;
        if (filter.shaderParamSetup) {
          gl.useProgram(targetShader);
          filter.shaderParamSetup(gl, this, targetShader);
        }
      } else {
        try {
          targetShader = this._fetchShaderProgram(gl, "filter", filter.VTX_SHADER_BODY, filter.FRAG_SHADER_BODY, filter.shaderParamSetup && filter.shaderParamSetup.bind(filter));
          filter._builtShader = targetShader;
          targetShader._name = filter.toString();
        } catch (e) {
          console && console.log(e);
        }
      }
      return targetShader;
    };
    StageGL.prototype.getBaseTexture = function getBaseTexture() {
      var w = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var h = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var width = Math.ceil(w > 0 ? w : 1);
      var height = Math.ceil(h > 0 ? h : 1);
      var gl = this._webGLContext;
      var texture = gl.createTexture();
      this.resizeTexture(texture, width, height);
      this.setTextureParams(gl, false);
      return texture;
    };
    StageGL.prototype.resizeTexture = function resizeTexture(texture) {
      var width = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var height = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
      var gl = this._webGLContext;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      texture.width = width;
      texture.height = height;
    };
    StageGL.prototype.getRenderBufferTexture = function getRenderBufferTexture(w, h) {
      var gl = this._webGLContext;
      var renderTexture = this.getBaseTexture(w, h);
      if (!renderTexture) {
        return null;
      }
      var frameBuffer = gl.createFramebuffer();
      if (!frameBuffer) {
        return null;
      }
      renderTexture.width = w;
      renderTexture.height = h;
      gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, renderTexture, 0);
      frameBuffer._renderTexture = renderTexture;
      renderTexture._frameBuffer = frameBuffer;
      renderTexture._storeID = this._textureDictionary.length;
      this._textureDictionary[renderTexture._storeID] = renderTexture;
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      return renderTexture;
    };
    StageGL.prototype.setTextureParams = function setTextureParams(gl) {
      var isPOT = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      if (isPOT && this._antialias) {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      } else {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      }
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    };
    StageGL.prototype.setClearColor = function setClearColor() {
      var color = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var r = void 0, g = void 0, b = void 0, a = void 0, output = void 0;
      if (typeof color === "string") {
        if (color.indexOf("#") === 0) {
          if (color.length === 4) {
            color = "#" + (color.charAt(1) + color.charAt(1) + color.charAt(2) + color.charAt(2) + color.charAt(3) + color.charAt(3));
          }
          r = Number("0x" + color.slice(1, 3)) / 255;
          g = Number("0x" + color.slice(3, 5)) / 255;
          b = Number("0x" + color.slice(5, 7)) / 255;
          a = Number("0x" + color.slice(7, 9)) / 255;
        } else if (color.indexOf("rgba(") === 0) {
          output = color.slice(5, -1).split(",");
          r = Number(output[0]) / 255;
          g = Number(output[1]) / 255;
          b = Number(output[2]) / 255;
          a = Number(output[3]);
        }
      } else {
        r = ((color & 4278190080) >>> 24) / 255;
        g = ((color & 16711680) >>> 16) / 255;
        b = ((color & 65280) >>> 8) / 255;
        a = (color & 255) / 255;
      }
      this._clearColor.r = r || 0;
      this._clearColor.g = g || 0;
      this._clearColor.b = b || 0;
      this._clearColor.a = a || 0;
      if (!this._webGLContext) {
        return;
      }
      this._webGLContext.clearColor(this._clearColor.r, this._clearColor.g, this._clearColor.b, this._clearColor.a);
    };
    StageGL.prototype._getSafeTexture = function _getSafeTexture(w, h) {
      var texture = this.getBaseTexture(w, h);
      if (!texture) {
        var msg = "Problem creating texture, possible cause: using too much VRAM, please try releasing texture memory";
        console.error && console.error(msg) || console.log(msg);
        texture = this._baseTextures[0];
      }
      return texture;
    };
    StageGL.prototype._fetchWebGLContext = function _fetchWebGLContext(canvas, options) {
      var gl = void 0;
      try {
        gl = canvas.getContext("webgl", options) || canvas.getContext("experimental-webgl", options);
      } catch (e) {}
      if (!gl) {
        var msg = "Could not initialize WebGL";
        console.error ? console.error(msg) : console.log(msg);
      } else {
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
      }
      return gl;
    };
    StageGL.prototype._fetchShaderProgram = function _fetchShaderProgram(gl) {
      var shaderName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "regular";
      var customVTX = arguments[2];
      var customFRAG = arguments[3];
      var shaderParamSetup = arguments[4];
      gl.useProgram(null);
      var targetFrag = void 0, targetVtx = void 0;
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
        break;
      }
      var vertexShader = this._createShader(gl, gl.VERTEX_SHADER, targetVtx);
      var fragmentShader = this._createShader(gl, gl.FRAGMENT_SHADER, targetFrag);
      var shaderProgram = gl.createProgram();
      gl.attachShader(shaderProgram, vertexShader);
      gl.attachShader(shaderProgram, fragmentShader);
      gl.linkProgram(shaderProgram);
      shaderProgram._type = shaderName;
      if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        gl.useProgram(this._activeShader);
        throw gl.getProgramInfoLog(shaderProgram);
      }
      gl.useProgram(shaderProgram);
      switch (shaderName) {
       case "filter":
        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vertexPosition");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
        shaderProgram.uvPositionAttribute = gl.getAttribLocation(shaderProgram, "uvPosition");
        gl.enableVertexAttribArray(shaderProgram.uvPositionAttribute);
        shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
        gl.uniform1i(shaderProgram.samplerUniform, 0);
        shaderProgram.uprightUniform = gl.getUniformLocation(shaderProgram, "uUpright");
        gl.uniform1f(shaderProgram.uprightUniform, 0);
        if (shaderParamSetup) {
          shaderParamSetup(gl, this, shaderProgram);
        }
        break;

       case "override":
       case "particle":
       case "regular":
       default:
        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vertexPosition");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
        shaderProgram.uvPositionAttribute = gl.getAttribLocation(shaderProgram, "uvPosition");
        gl.enableVertexAttribArray(shaderProgram.uvPositionAttribute);
        shaderProgram.textureIndexAttribute = gl.getAttribLocation(shaderProgram, "textureIndex");
        gl.enableVertexAttribArray(shaderProgram.textureIndexAttribute);
        shaderProgram.alphaAttribute = gl.getAttribLocation(shaderProgram, "objectAlpha");
        gl.enableVertexAttribArray(shaderProgram.alphaAttribute);
        var samplers = [];
        for (var i = 0; i < this._batchTextureCount; i++) {
          samplers[i] = i;
        }
        shaderProgram.samplerData = samplers;
        shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
        gl.uniform1iv(shaderProgram.samplerUniform, samplers);
        shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "pMatrix");
        break;
      }
      gl.useProgram(this._activeShader);
      return shaderProgram;
    };
    StageGL.prototype._createShader = function _createShader(gl, type, str) {
      str = str.replace(/\{\{count}}/g, this._batchTextureCount);
      var insert = "";
      for (var i = 1; i < this._batchTextureCount; i++) {
        insert += "} else if (src === " + i + ") { color = texture2D(uSampler[" + i + "], vTextureCoord);";
      }
      str = str.replace(/\{\{alternates}}/g, insert).replace(/\{\{fragColor}}/g, this._premultiply ? StageGL.REGULAR_FRAG_COLOR_PREMULTIPLY : StageGL.REGULAR_FRAG_COLOR_NORMAL);
      var shader = gl.createShader(type);
      gl.shaderSource(shader, str).compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw gl.getShaderInfoLog(shader);
      }
      return shader;
    };
    StageGL.prototype._createBuffers = function _createBuffers(gl) {
      var groupCount = this._maxCardsPerBatch * StageGL.INDICIES_PER_CARD;
      var groupSize = void 0;
      var vertexPositionBuffer = this._vertexPositionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
      groupSize = 2;
      var vertices = this._vertices = new Float32Array(groupCount * groupSize);
      for (var i = 0, l = vertices.length; i < l; i += groupSize) {
        vertices[i] = vertices[i + 1] = 0;
      }
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);
      vertexPositionBuffer.itemSize = groupSize;
      vertexPositionBuffer.numItems = groupCount;
      var uvPositionBuffer = this._uvPositionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, uvPositionBuffer);
      groupSize = 2;
      var uvs = this._uvs = new Float32Array(groupCount * groupSize);
      for (var _i2 = 0, _l2 = uvs.length; _i2 < _l2; _i2 += groupSize) {
        uvs[_i2] = uvs[_i2 + 1] = 0;
      }
      gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.DYNAMIC_DRAW);
      uvPositionBuffer.itemSize = groupSize;
      uvPositionBuffer.numItems = groupCount;
      var textureIndexBuffer = this._textureIndexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, textureIndexBuffer);
      groupSize = 1;
      var indices = this._indices = new Float32Array(groupCount * groupSize);
      for (var _i3 = 0, _l3 = indices.length; _i3 < _l3; _i3++) {
        indices[_i3] = 0;
      }
      gl.bufferData(gl.ARRAY_BUFFER, indices, gl.DYNAMIC_DRAW);
      textureIndexBuffer.itemSize = groupSize;
      textureIndexBuffer.numItems = groupCount;
      var alphaBuffer = this._alphaBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, alphaBuffer);
      groupSize = 1;
      var alphas = this._alphas = new Float32Array(groupCount * groupSize);
      for (var _i4 = 0, _l4 = alphas.length; _i4 < _l4; _i4++) {
        alphas[_i4] = 1;
      }
      gl.bufferData(gl.ARRAY_BUFFER, alphas, gl.DYNAMIC_DRAW);
      alphaBuffer.itemSize = groupSize;
      alphaBuffer.numItems = groupCount;
    };
    StageGL.prototype._initTextures = function _initTextures() {
      this._lastTextureInsert = -1;
      this._textureDictionary = [];
      this._textureIDs = {};
      this._baseTextures = [];
      this._batchTextures = [];
      for (var i = 0; i < this._batchTextureCount; i++) {
        var texture = this.getBaseTexture();
        this._baseTextures[i] = this._batchTextures[i] = texture;
        if (!texture) {
          throw "Problems creating basic textures, known causes include using too much VRAM by not releasing WebGL texture instances";
        } else {
          texture._storeID = -1;
        }
      }
    };
    StageGL.prototype._loadTextureImage = function _loadTextureImage(gl, image) {
      var srcPath = void 0, texture = void 0, msg = void 0;
      if (image instanceof Image && image.src) {
        srcPath = image.src;
      } else if (image instanceof HTMLCanvasElement) {
        image._isCanvas = true;
        srcPath = "canvas_" + ++this._lastTrackedCanvas;
      } else {
        msg = "Invalid image provided as source. Please ensure source is a correct DOM element.";
        console.error && console.error(msg, image) || console.log(msg, image);
        return;
      }
      var storeID = this._textureIDs[srcPath];
      if (storeID === undefined) {
        this._textureIDs[srcPath] = storeID = this._textureDictionary.length;
        image._storeID = storeID;
        image._invalid = !image.isCanvas;
        texture = this._getSafeTexture();
        this._textureDictionary[storeID] = texture;
      } else {
        image._storeID = storeID;
        texture = this._textureDictionary[storeID];
      }
      if (texture._storeID != -1) {
        texture._storeID = storeID;
        if (texture._imageData) {
          texture._imageData.push(image);
        } else {
          texture._imageData = [ image ];
        }
      }
      this._insertTextureInBatch(gl, texture);
      return texture;
    };
    StageGL.prototype._updateTextureImageData = function _updateTextureImageData(gl, image) {
      if (!(image.complete || image._isCanvas || image.naturalWidth)) {
        return;
      }
      var isNPOT = image.width & image.width - 1 || image.height & image.height - 1;
      var texture = this._textureDictionary[image._storeID];
      gl.activeTexture(gl.TEXTURE0 + texture._activeIndex);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      texture.isPOT = !isNPOT;
      this.setTextureParams(gl, texture.isPOT);
      try {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      } catch (e) {
        var errString = "\nAn error has occurred. This is most likely due to security restrictions on WebGL images with local or cross-domain origins";
        if (console.error) {
          console.error(e, errString);
        } else {
          console && console.log(e, errString);
        }
      }
      image._invalid = false;
      texture._w = image.width;
      texture._h = image.height;
      if (this.vocalDebug) {
        if (isNPOT && this._antialias) {
          console.warn("NPOT(Non Power of Two) Texture w/ antialias on: " + image.src);
        }
        if (image.width > gl.MAX_TEXTURE_SIZE || image.height > gl.MAX_TEXTURE_SIZE) {
          console && console.error("Oversized Texture: " + image.width + "x" + image.height + " vs " + gl.MAX_TEXTURE_SIZE + "max");
        }
      }
    };
    StageGL.prototype._insertTextureInBatch = function _insertTextureInBatch(gl, texture) {
      if (this._batchTextures[texture._activeIndex] !== texture) {
        var found = -1;
        var start = (this._lastTextureInsert + 1) % this._batchTextureCount;
        var look = start;
        do {
          if (this._batchTextures[look]._batchID != this._batchID && !this._slotBlacklist[look]) {
            found = look;
            break;
          }
          look = (look + 1) % this._batchTextureCount;
        } while (look !== start);
        if (found === -1) {
          this.batchReason = "textureOverflow";
          this._drawBuffers(gl);
          this.batchCardCount = 0;
          found = start;
        }
        this._batchTextures[found] = texture;
        texture._activeIndex = found;
        var image = texture._imageData && texture._imageData[0];
        if (image && image._invalid) {
          this._updateTextureImageData(gl, image);
        } else {
          gl.activeTexture(gl.TEXTURE0 + found);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          this.setTextureParams(gl);
        }
        this._lastTextureInsert = found;
      } else if (texture._drawID !== this._drawID) {
        var _image = texture._imageData && texture._imageData[0];
        if (_image && _image._invalid) {
          this._updateTextureImageData(gl, _image);
        }
      }
      texture._drawID = this._drawID;
      texture._batchID = this._batchID;
    };
    StageGL.prototype._killTextureObject = function _killTextureObject(texture) {
      if (!texture) {
        return;
      }
      var gl = this._webGLContext;
      if (texture._storeID !== undefined && texture._storeID >= 0) {
        this._textureDictionary[texture._storeID] = undefined;
        for (var n in this._textureIDs) {
          if (this._textureIDs[n] === texture._storeID) {
            delete this._textureIDs[n];
          }
        }
        var data = texture._imageData;
        for (var i = data.length - 1; i >= 0; i--) {
          data[i]._storeID = undefined;
        }
        texture._imageData = texture._storeID = undefined;
      }
      if (texture._activeIndex !== undefined && this._batchTextures[texture._activeIndex] === texture) {
        this._batchTextures[texture._activeIndex] = this._baseTextures[texture._activeIndex];
      }
      try {
        if (texture._frameBuffer) {
          gl.deleteFramebuffer(texture._frameBuffer);
        }
        texture._frameBuffer = undefined;
      } catch (e) {
        if (this.vocalDebug) {
          console.log(e);
        }
      }
      try {
        gl.deleteTexture(texture);
      } catch (e) {
        if (this.vocalDebug) {
          console.log(e);
        }
      }
    };
    StageGL.prototype._backupBatchTextures = function _backupBatchTextures(restore, target) {
      var gl = this._webGLContext;
      if (!this._backupTextures) {
        this._backupTextures = [];
      }
      if (target === undefined) {
        target = this._backupTextures;
      }
      for (var i = 0; i < this._batchTextureCount; i++) {
        gl.activeTexture(gl.TEXTURE0 + i);
        if (restore) {
          this._batchTextures[i] = target[i];
        } else {
          target[i] = this._batchTextures[i];
          this._batchTextures[i] = this._baseTextures[i];
        }
        gl.bindTexture(gl.TEXTURE_2D, this._batchTextures[i]);
        this.setTextureParams(gl, this._batchTextures[i].isPOT);
      }
      if (restore && target === this._backupTextures) {
        this._backupTextures = [];
      }
    };
    StageGL.prototype._batchDraw = function _batchDraw(sceneGraph, gl, ignoreCache) {
      if (this._isDrawing > 0) {
        this._drawBuffers(gl);
      }
      this._isDrawing++;
      this._drawID++;
      this.batchCardCount = 0;
      this.depth = 0;
      this._appendToBatchGroup(sceneGraph, gl, new Matrix2D(), this.alpha, ignoreCache);
      this.batchReason = "drawFinish";
      this._drawBuffers(gl);
      this._isDrawing--;
    };
    StageGL.prototype._cacheDraw = function _cacheDraw(target, filters, manager) {
      var gl = this._webGLContext;
      var renderTexture = void 0;
      var shaderBackup = this._activeShader;
      var blackListBackup = this._slotBlacklist;
      var lastTextureSlot = this._maxTextureSlots - 1;
      var wBackup = this._viewportWidth, hBackup = this._viewportHeight;
      this.protectTextureSlot(lastTextureSlot, true);
      var mtx = target.getMatrix();
      mtx = mtx.clone();
      mtx.scale(1 / manager.scale, 1 / manager.scale);
      mtx = mtx.invert();
      mtx.translate(-manager.offX / manager.scale * target.scaleX, -manager.offY / manager.scale * target.scaleY);
      var container = this._cacheContainer;
      container.children = [ target ];
      container.transformMatrix = mtx;
      this._backupBatchTextures(false);
      if (filters && filters.length) {
        this._drawFilters(target, filters, manager);
      } else {
        if (this.isCacheControlled) {
          gl.clear(gl.COLOR_BUFFER_BIT);
          this._batchDraw(container, gl, true);
        } else {
          gl.activeTexture(gl.TEXTURE0 + lastTextureSlot);
          target.cacheCanvas = this.getTargetRenderTexture(target, manager._drawWidth, manager._drawHeight);
          renderTexture = target.cacheCanvas;
          gl.bindFramebuffer(gl.FRAMEBUFFER, renderTexture._frameBuffer);
          this.updateViewport(manager._drawWidth, manager._drawHeight);
          this._projectionMatrix = this._projectionMatrixFlip;
          gl.clear(gl.COLOR_BUFFER_BIT);
          this._batchDraw(container, gl, true);
          gl.bindFramebuffer(gl.FRAMEBUFFER, null);
          this.updateViewport(wBackup, hBackup);
        }
      }
      this._backupBatchTextures(true);
      this.protectTextureSlot(lastTextureSlot, false);
      this._activeShader = shaderBackup;
      this._slotBlacklist = blackListBackup;
    };
    StageGL.prototype._drawFilters = function _drawFilters(target, filters, manager) {
      var gl = this._webGLContext;
      var renderTexture = void 0;
      var lastTextureSlot = this._maxTextureSlots - 1;
      var wBackup = this._viewportWidth, hBackup = this._viewportHeight;
      var container = this._cacheContainer;
      var filterCount = filters.length;
      gl.activeTexture(gl.TEXTURE0 + lastTextureSlot);
      renderTexture = this.getTargetRenderTexture(target, manager._drawWidth, manager._drawHeight);
      gl.bindFramebuffer(gl.FRAMEBUFFER, renderTexture._frameBuffer);
      this.updateViewport(manager._drawWidth, manager._drawHeight);
      gl.clear(gl.COLOR_BUFFER_BIT);
      this._batchDraw(container, gl, true);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, renderTexture);
      this.setTextureParams(gl);
      var flipY = false;
      var i = 0, filter = filters[i];
      do {
        this._activeShader = this.getFilterShader(filter);
        if (!this._activeShader) {
          continue;
        }
        gl.activeTexture(gl.TEXTURE0 + lastTextureSlot);
        renderTexture = this.getTargetRenderTexture(target, manager._drawWidth, manager._drawHeight);
        gl.bindFramebuffer(gl.FRAMEBUFFER, renderTexture._frameBuffer);
        gl.viewport(0, 0, manager._drawWidth, manager._drawHeight);
        gl.clear(gl.COLOR_BUFFER_BIT);
        this._drawCover(gl, flipY);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, renderTexture);
        this.setTextureParams(gl);
        if (filterCount > 1 || filters[0]._multiPass) {
          flipY = !flipY;
        }
        filter = filter._multiPass !== null ? filter._multiPass : filters[++i];
      } while (filter);
      if (this.isCacheControlled) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        this.updateViewport(wBackup, hBackup);
        this._activeShader = this.getFilterShader(this);
        gl.clear(gl.COLOR_BUFFER_BIT);
        this._drawCover(gl, flipY);
      } else {
        if (flipY) {
          gl.activeTexture(gl.TEXTURE0 + lastTextureSlot);
          renderTexture = this.getTargetRenderTexture(target, manager._drawWidth, manager._drawHeight);
          gl.bindFramebuffer(gl.FRAMEBUFFER, renderTexture._frameBuffer);
          this._activeShader = this.getFilterShader(this);
          gl.viewport(0, 0, manager._drawWidth, manager._drawHeight);
          gl.clear(gl.COLOR_BUFFER_BIT);
          this._drawCover(gl, !flipY);
        }
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        this.updateViewport(wBackup, hBackup);
        target.cacheCanvas = renderTexture;
      }
    };
    StageGL.prototype._appendToBatchGroup = function _appendToBatchGroup(container, gl, concatMtx, concatAlpha, ignoreCache) {
      if (!container._glMtx) {
        container._glMtx = new Matrix2D();
      }
      var cMtx = container._glMtx;
      cMtx.copy(concatMtx);
      if (container.transformMatrix) {
        cMtx.appendMatrix(container.transformMatrix);
      } else {
        cMtx.appendTransform(container.x, container.y, container.scaleX, container.scaleY, container.rotation, container.skewX, container.skewY, container.regX, container.regY);
      }
      var subL = void 0, subT = void 0, subR = void 0, subB = void 0;
      var l = container.numChildren;
      for (var i = 0; i < l; i++) {
        var item = container.children[i];
        if (!(item.visible && concatAlpha)) {
          continue;
        }
        if (!item.cacheCanvas || ignoreCache) {
          if (item.children) {
            this._appendToBatchGroup(item, gl, cMtx, item.alpha * concatAlpha);
            continue;
          }
        }
        if (this.batchCardCount + 1 > this._maxCardsPerBatch) {
          this.batchReason = "vertexOverflow";
          this._drawBuffers(gl);
          this.batchCardCount = 0;
        }
        if (!item._glMtx) {
          item._glMtx = new Matrix2D();
        }
        var iMtx = item._glMtx;
        iMtx.copy(cMtx);
        if (item.transformMatrix) {
          iMtx.appendMatrix(item.transformMatrix);
        } else {
          iMtx.appendTransform(item.x, item.y, item.scaleX, item.scaleY, item.rotation, item.skewX, item.skewY, item.regX, item.regY);
        }
        var uvRect = void 0, texIndex = void 0, image = void 0, frame = void 0, texture = void 0, src = void 0;
        var useCache = item.cacheCanvas && !ignoreCache;
        if (item._webGLRenderStyle === 2 || useCache) {
          image = (ignoreCache ? false : item.cacheCanvas) || item.image;
        } else if (item._webGLRenderStyle === 1) {
          frame = item.spriteSheet.getFrame(item.currentFrame);
          if (frame === null) {
            continue;
          }
          image = frame.image;
        } else {
          continue;
        }
        if (!image) {
          continue;
        }
        var uvs = this._uvs;
        var vertices = this._vertices;
        var texI = this._indices;
        var alphas = this._alphas;
        if (image._storeID === undefined) {
          texture = this._loadTextureImage(gl, image);
        } else {
          texture = this._textureDictionary[image._storeID];
          if (!texture) {
            if (this.vocalDebug) {
              console.log("Image source should not be lookup a non existent texture, please report a bug.");
            }
            continue;
          }
          if (texture._batchID !== this._batchID) {
            this._insertTextureInBatch(gl, texture);
          }
        }
        texIndex = texture._activeIndex;
        image._drawID = this._drawID;
        if (item._webGLRenderStyle === 2 || useCache) {
          if (!useCache && item.sourceRect) {
            if (!item._uvRect) {
              item._uvRect = {};
            }
            src = item.sourceRect;
            uvRect = item._uvRect;
            uvRect.t = src.y / image.height;
            uvRect.l = src.x / image.width;
            uvRect.b = (src.y + src.height) / image.height;
            uvRect.r = (src.x + src.width) / image.width;
            subL = 0;
            subT = 0;
            subR = src.width + subL;
            subB = src.height + subT;
          } else {
            uvRect = StageGL.UV_RECT;
            if (item.cacheCanvas) {
              src = item.bitmapCache;
              subL = src.x + src._filterOffX / src.scale;
              subT = src.y + src._filterOffY / src.scale;
              subR = src._drawWidth / src.scale + subL;
              subB = src._drawHeight / src.scale + subT;
            } else {
              subL = subT = 0;
              subR = image.width + subL;
              subB = image.height + subT;
            }
          }
        } else if (item._webGLRenderStyle === 1) {
          var rect = frame.rect;
          uvRect = frame.uvRect;
          if (!uvRect) {
            uvRect = StageGL.buildUVRects(item.spriteSheet, item.currentFrame, false);
          }
          subL = -frame.regX;
          subT = -frame.regY;
          subR = rect.width - frame.regX;
          subB = rect.height - frame.regY;
        }
        var offV1 = this.batchCardCount * StageGL.INDICIES_PER_CARD;
        var offV2 = offV1 * 2;
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
        texI[offV1] = texI[offV1 + 1] = texI[offV1 + 2] = texI[offV1 + 3] = texI[offV1 + 4] = texI[offV1 + 5] = texIndex;
        alphas[offV1] = alphas[offV1 + 1] = alphas[offV1 + 2] = alphas[offV1 + 3] = alphas[offV1 + 4] = alphas[offV1 + 5] = item.alpha * concatAlpha;
        this.batchCardCount++;
      }
    };
    StageGL.prototype._drawBuffers = function _drawBuffers(gl) {
      if (this.batchCardCount <= 0) {
        return;
      }
      if (this.vocalDebug) {
        console.log("Draw[" + this._drawID + ":" + this._batchID + "] : " + this.batchReason);
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
        this.setTextureParams(gl, texture.isPOT);
      }
      gl.drawArrays(gl.TRIANGLES, 0, this.batchCardCount * StageGL.INDICIES_PER_CARD);
      this._batchID++;
    };
    StageGL.prototype._drawCover = function _drawCover(gl, flipY) {
      if (this._isDrawing > 0) {
        this._drawBuffers(gl);
      }
      if (this.vocalDebug) {
        console.log("Draw[" + this._drawID + ":" + this._batchID + "] : Cover");
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
      gl.drawArrays(gl.TRIANGLES, 0, StageGL.INDICIES_PER_CARD);
    };
    createClass(StageGL, [ {
      key: "isWebGL",
      get: function get() {
        return !!this._webGLContext;
      }
    }, {
      key: "autoPurge",
      get: function get() {
        return Number(this._autoPurge);
      },
      set: function set(autoPurge) {
        autoPurge = isNaN(autoPurge) ? 1200 : autoPurge;
        if (autoPurge != -1 && autoPurge < 10) {
          autoPurge = 10;
        }
        this._autoPurge = autoPurge;
      }
    } ]);
    return StageGL;
  }(Stage);
  {
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
    try {
      StageGL.COVER_VERT = new Float32Array([ -1, 1, 1, 1, -1, -1, 1, 1, 1, -1, -1, -1 ]);
      StageGL.COVER_UV = new Float32Array([ 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1 ]);
      StageGL.COVER_UV_FLIP = new Float32Array([ 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0 ]);
    } catch (e) {}
    StageGL.REGULAR_VARYING_HEADER = "\n\t\tprecision mediump float;\n\t\tvarying vec2 vTextureCoord;\n\t\tvarying lowp float indexPicker;\n\t\tvarying lowp float alphaValue;\n\t";
    StageGL.REGULAR_VERTEX_HEADER = "\n\t\t" + StageGL.REGULAR_VARYING_HEADER + "\n\t\tattribute vec2 vertexPosition;\n\t\tattribute vec2 uvPosition;\n\t\tattribute lowp float textureIndex;\n\t\tattribute lowp float objectAlpha;\n\t\tuniform mat4 pMatrix;\n\t";
    StageGL.REGULAR_FRAGMENT_HEADER = "\n\t\t" + StageGL.REGULAR_VARYING_HEADER + "\n\t\tuniform sampler2D uSampler[{{count}}];\n\t";
    StageGL.REGULAR_VERTEX_BODY = "\n\t\tvoid main (void) {\n\t\t\t// DHG TODO: This doesn't work. Must be something wrong with the hand built matrix see js... bypass for now\n\t\t\t// vertexPosition, round if flag\n\t\t\t// gl_Position = pMatrix * vec4(vertexPosition.x, vertexPosition.y, 0.0, 1.0);\n\t\t\tgl_Position = vec4(\n\t\t\t\t(vertexPosition.x * pMatrix[0][0]) + pMatrix[3][0],\n\t\t\t\t(vertexPosition.y * pMatrix[1][1]) + pMatrix[3][1],\n\t\t\t\tpMatrix[3][2],\n\t\t\t\t1.0\n\t\t\t);\n\t\t\talphaValue = objectAlpha;\n\t\t\tindexPicker = textureIndex;\n\t\t\tvTextureCoord = uvPosition;\n\t\t}\n\t";
    StageGL.REGULAR_FRAGMENT_BODY = "\n\t\tvoid main (void) {\n\t\t\tint src = int(indexPicker);\n\t\t\tvec4 color = vec4(1.0, 0.0, 0.0, 1.0);\n\n\t\t\tif (src === 0) {\n\t\t\t\tcolor = texture2D(uSampler[0], vTextureCoord);\n\t\t\t\t{{alternates}}\n\t\t\t}\n\n\t\t\t{{fragColor}};\n\t\t}\n\t";
    StageGL.REGULAR_FRAG_COLOR_NORMAL = "\n\t\tgl_FragColor = vec4(color.rgb, color.a * alphaValue);\n\t";
    StageGL.REGULAR_FRAG_COLOR_PREMULTIPLY = "\n\t\tif (color.a > 0.0035) {\n\t\t\tgl_FragColor = vec4(color.rgb / color.a, color.a * alphaValue);\n\t\t} else {\n\t\t\tgl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);\n\t\t}\n\t";
    StageGL.PARTICLE_VERTEX_BODY = "\n\t\t" + StageGL.REGULAR_VERTEX_BODY + "\n\t";
    StageGL.PARTICLE_FRAGMENT_BODY = "\n\t\t" + StageGL.REGULAR_FRAGMENT_BODY + "\n\t";
    StageGL.COVER_VARYING_HEADER = "\n\t\tprecision mediump float;\n\t\tvarying highp vec2 vRenderCoord;\n\t\tvarying highp vec2 vTextureCoord;\n\t";
    StageGL.COVER_VERTEX_HEADER = "\n\t\t" + StageGL.COVER_VARYING_HEADER + "\n\t\tattribute vec2 vertexPosition;\n\t\tattribute vec2 uvPosition;\n\t\tuniform float uUpright;\n\t";
    StageGL.COVER_FRAGMENT_HEADER = "\n\t\t" + StageGL.COVER_VARYING_HEADER + "\n\t\tuniform sampler2D uSampler;\n\t";
    StageGL.COVER_VERTEX_BODY = "\n\t\tvoid main (void) {\n\t\t\tgl_Position = vec4(vertexPosition.x, vertexPosition.y, 0.0, 1.0);\n\t\t\tvRenderCoord = uvPosition;\n\t\t\tvTextureCoord = vec2(uvPosition.x, abs(uUpright - uvPosition.y));\n\t\t}\n\t";
    StageGL.COVER_FRAGMENT_BODY = "\n\t\tvoid main (void) {\n\t\t\tvec4 color = texture2D(uSampler, vRenderCoord);\n\t\t\tgl_FragColor = color;\n\t\t}\n\t";
  }
  var VideoBuffer = function() {
    function VideoBuffer(video) {
      classCallCheck(this, VideoBuffer);
      this.readyState = video.readyState;
      this._video = video;
      this._canvas = null;
      this._lastTime = -1;
      if (this.readyState < 2) {
        video.addEventListener("canplaythrough", this._videoReady.bind(this));
      }
    }
    VideoBuffer.prototype.getImage = function getImage() {
      if (this.readyState < 2) {
        return;
      }
      var canvas = this._canvas, video = this._video;
      if (!canvas) {
        canvas = this._canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }
      if (video.readyState >= 2 && video.currentTime !== this._lastTime) {
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        this._lastTime = video.currentTime;
      }
      return canvas;
    };
    VideoBuffer.prototype._videoReady = function _videoReady() {
      this.readyState = 2;
    };
    return VideoBuffer;
  }();
  var Bitmap = function(_DisplayObject) {
    inherits(Bitmap, _DisplayObject);
    function Bitmap(imageOrUri) {
      classCallCheck(this, Bitmap);
      var _this = possibleConstructorReturn(this, _DisplayObject.call(this));
      if (typeof imageOrUri === "string") {
        _this.image = document.createElement("img");
        _this.image.src = imageOrUri;
      } else {
        _this.image = imageOrUri;
      }
      _this.sourceRect = null;
      _this._webGLRenderStyle = DisplayObject._StageGL_BITMAP;
      return _this;
    }
    Bitmap.prototype.isVisible = function isVisible() {
      var image = this.image;
      var hasContent = this.cacheCanvas || image && (image.naturalWidth || image.getContext || image.readyState >= 2);
      return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent);
    };
    Bitmap.prototype.draw = function draw(ctx) {
      var ignoreCache = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      if (_DisplayObject.prototype.draw.call(this, ctx, ignoreCache)) {
        return true;
      }
      var img = this.image, rect = this.sourceRect;
      if (img instanceof VideoBuffer) {
        img = img.getImage();
      }
      if (img == null) {
        return true;
      }
      if (rect) {
        var x1 = rect.x, y1 = rect.y, x2 = x1 + rect.width, y2 = y1 + rect.height, x = 0, y = 0, w = img.width, h = img.height;
        if (x1 < 0) {
          x -= x1;
          x1 = 0;
        }
        if (x2 > w) {
          x2 = w;
        }
        if (y1 < 0) {
          y -= y1;
          y1 = 0;
        }
        if (y2 > h) {
          y2 = h;
        }
        ctx.drawImage(img, x1, y1, x2 - x1, y2 - y1, x, y, x2 - x1, y2 - y1);
      } else {
        ctx.drawImage(img, 0, 0);
      }
      return true;
    };
    Bitmap.prototype.getBounds = function getBounds() {
      var rect = _DisplayObject.prototype.getBounds.call(this);
      if (rect) {
        return rect;
      }
      var image = this.image, o = this.sourceRect || image;
      var hasContent = image && (image.naturalWidth || image.getContext || image.readyState >= 2);
      return hasContent ? this._rectangle.setValues(0, 0, o.width, o.height) : null;
    };
    Bitmap.prototype.clone = function clone(node) {
      var img = this.image;
      if (img != null && node != null) {
        img = img.cloneNode();
      }
      var bmp = new Bitmap(img);
      if (this.sourceRect) {
        bmp.sourceRect = this.sourceRect.clone();
      }
      this._cloneProps(bmp);
      return bmp;
    };
    return Bitmap;
  }(DisplayObject);
  var Sprite = function(_DisplayObject) {
    inherits(Sprite, _DisplayObject);
    function Sprite(spriteSheet, frameOrAnimation) {
      classCallCheck(this, Sprite);
      var _this = possibleConstructorReturn(this, _DisplayObject.call(this));
      _this.currentFrame = 0;
      _this.currentAnimation = null;
      _this.paused = true;
      _this.spriteSheet = spriteSheet;
      _this.currentAnimationFrame = 0;
      _this.framerate = 0;
      _this._animation = null;
      _this._currentFrame = null;
      _this._skipAdvance = false;
      _this._webGLRenderStyle = DisplayObject._StageGL_SPRITE;
      if (frameOrAnimation != null) {
        _this.gotoAndPlay(frameOrAnimation);
      }
      return _this;
    }
    Sprite.prototype.isVisible = function isVisible() {
      var hasContent = this.cacheCanvas || this.spriteSheet.complete;
      return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent);
    };
    Sprite.prototype.draw = function draw(ctx, ignoreCache) {
      if (_DisplayObject.prototype.draw.call(this, ctx, ignoreCache)) {
        return true;
      }
      this._normalizeFrame();
      var o = this.spriteSheet.getFrame(this._currentFrame | 0);
      if (!o) {
        return false;
      }
      var rect = o.rect;
      if (rect.width && rect.height) {
        ctx.drawImage(o.image, rect.x, rect.y, rect.width, rect.height, -o.regX, -o.regY, rect.width, rect.height);
      }
      return true;
    };
    Sprite.prototype.play = function play() {
      this.paused = false;
    };
    Sprite.prototype.stop = function stop() {
      this.paused = true;
    };
    Sprite.prototype.gotoAndPlay = function gotoAndPlay(frameOrAnimation) {
      this.paused = false;
      this._skipAdvance = true;
      this._goto(frameOrAnimation);
    };
    Sprite.prototype.gotoAndStop = function gotoAndStop(frameOrAnimation) {
      this.paused = true;
      this._goto(frameOrAnimation);
    };
    Sprite.prototype.advance = function advance(time) {
      var fps = this.framerate || this.spriteSheet.framerate;
      var t = fps && time != null ? time / (1e3 / fps) : 1;
      this._normalizeFrame(t);
    };
    Sprite.prototype.getBounds = function getBounds() {
      return _DisplayObject.prototype.getBounds.call(this) || this.spriteSheet.getFrameBounds(this.currentFrame, this._rectangle);
    };
    Sprite.prototype.clone = function clone() {
      return this._cloneProps(new Sprite(this.spriteSheet));
    };
    Sprite.prototype._cloneProps = function _cloneProps(o) {
      _DisplayObject.prototype._cloneProps.call(this, o);
      o.currentFrame = this.currentFrame;
      o.currentAnimation = this.currentAnimation;
      o.paused = this.paused;
      o.currentAnimationFrame = this.currentAnimationFrame;
      o.framerate = this.framerate;
      o._animation = this._animation;
      o._currentFrame = this._currentFrame;
      o._skipAdvance = this._skipAdvance;
      return o;
    };
    Sprite.prototype._tick = function _tick(evtObj) {
      if (!this.paused) {
        if (!this._skipAdvance) {
          this.advance(evtObj && evtObj.delta);
        }
        this._skipAdvance = false;
      }
      _DisplayObject.prototype._tick.call(this, evtObj);
    };
    Sprite.prototype._normalizeFrame = function _normalizeFrame() {
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
            return;
          } else if (next) {
            return this._goto(next, frameDelta - (l - animFrame) / speed);
          } else {
            this.paused = true;
            animFrame = animation.frames.length - 1;
          }
        } else {
          animFrame += frameDelta * speed;
        }
        this.currentAnimationFrame = animFrame;
        this._currentFrame = animation.frames[animFrame | 0];
      } else {
        frame = this._currentFrame += frameDelta;
        var _l = this.spriteSheet.getNumFrames();
        if (frame >= _l && _l > 0) {
          if (!this._dispatchAnimationEnd(animation, frame, paused, _l - 1)) {
            if ((this._currentFrame -= _l) >= _l) {
              return this._normalizeFrame();
            }
          }
        }
      }
      frame = this._currentFrame | 0;
      if (this.currentFrame != frame) {
        this.currentFrame = frame;
        this.dispatchEvent("change");
      }
    };
    Sprite.prototype._dispatchAnimationEnd = function _dispatchAnimationEnd(animation, frame, paused, next, end) {
      var name = animation ? animation.name : null;
      if (this.hasEventListener("animationend")) {
        var evt = new Event("animationend");
        evt.name = name;
        evt.next = next;
        this.dispatchEvent(evt);
      }
      var changed = this._animation != animation || this._currentFrame != frame;
      if (!changed && !paused && this.paused) {
        this.currentAnimationFrame = end;
        changed = true;
      }
      return changed;
    };
    Sprite.prototype._goto = function _goto(frameOrAnimation, frame) {
      this.currentAnimationFrame = 0;
      if (isNaN(frameOrAnimation)) {
        var data = this.spriteSheet.getAnimation(frameOrAnimation);
        if (data) {
          this._animation = data;
          this.currentAnimation = frameOrAnimation;
          this._normalizeFrame(frame);
        }
      } else {
        this.currentAnimation = this._animation = null;
        this._currentFrame = frameOrAnimation;
        this._normalizeFrame();
      }
    };
    return Sprite;
  }(DisplayObject);
  var _maxPoolSize = 100;
  var _spritePool = [];
  var BitmapText = function(_Container) {
    inherits(BitmapText, _Container);
    function BitmapText() {
      var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
      var spriteSheet = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      classCallCheck(this, BitmapText);
      var _this = possibleConstructorReturn(this, _Container.call(this));
      _this.text = text;
      _this.spriteSheet = spriteSheet;
      _this.lineHeight = 0;
      _this.letterSpacing = 0;
      _this.spaceWidth = 0;
      _this._oldProps = {
        text: 0,
        spriteSheet: 0,
        lineHeight: 0,
        letterSpacing: 0,
        spaceWidth: 0
      };
      _this._oldStage = null;
      _this._drawAction = null;
      return _this;
    }
    BitmapText.prototype.draw = function draw(ctx, ignoreCache) {
      if (this.drawCache(ctx, ignoreCache)) {
        return;
      }
      this._updateState();
      _Container.prototype.draw.call(this, ctx, ignoreCache);
    };
    BitmapText.prototype.getBounds = function getBounds() {
      this._updateText();
      return _Container.prototype.getBounds.call(this);
    };
    BitmapText.prototype.isVisible = function isVisible() {
      var hasContent = this.cacheCanvas || this.spriteSheet && this.spriteSheet.complete && this.text;
      return !!(this.visible && this.alpha > 0 && this.scaleX !== 0 && this.scaleY !== 0 && hasContent);
    };
    BitmapText.prototype.clone = function clone() {
      return this._cloneProps(new BitmapText(this.text, this.spriteSheet));
    };
    BitmapText.prototype.addChild = function addChild() {};
    BitmapText.prototype.addChildAt = function addChildAt() {};
    BitmapText.prototype.removeChild = function removeChild() {};
    BitmapText.prototype.removeChildAt = function removeChildAt() {};
    BitmapText.prototype.removeAllChildren = function removeAllChildren() {};
    BitmapText.prototype._updateState = function _updateState() {
      this._updateText();
    };
    BitmapText.prototype._cloneProps = function _cloneProps(o) {
      _Container.prototype._cloneProps.call(this, o);
      o.lineHeight = this.lineHeight;
      o.letterSpacing = this.letterSpacing;
      o.spaceWidth = this.spaceWidth;
      return o;
    };
    BitmapText.prototype._getFrameIndex = function _getFrameIndex(character, spriteSheet) {
      var c = void 0, o = spriteSheet.getAnimation(character);
      if (!o) {
        character != (c = character.toUpperCase()) || character != (c = character.toLowerCase()) || (c = null);
        if (c) {
          o = spriteSheet.getAnimation(c);
        }
      }
      return o && o.frames[0];
    };
    BitmapText.prototype._getFrame = function _getFrame(character, spriteSheet) {
      var index = this._getFrameIndex(character, spriteSheet);
      return index == null ? index : spriteSheet.getFrame(index);
    };
    BitmapText.prototype._getLineHeight = function _getLineHeight(ss) {
      var frame = this._getFrame("1", ss) || this._getFrame("T", ss) || this._getFrame("L", ss) || ss.getFrame(0);
      return frame ? frame.rect.height : 1;
    };
    BitmapText.prototype._getSpaceWidth = function _getSpaceWidth(ss) {
      var frame = this._getFrame("1", ss) || this._getFrame("l", ss) || this._getFrame("e", ss) || this._getFrame("a", ss) || ss.getFrame(0);
      return frame ? frame.rect.width : 1;
    };
    BitmapText.prototype._tick = function _tick(evtObj) {
      var stage = this.stage;
      stage && stage.on("drawstart", this._updateText, this, true);
      _Container.prototype._tick.call(this, evtObj);
    };
    BitmapText.prototype._updateText = function _updateText() {
      var x = 0, y = 0, o = this._oldProps, change = false, spaceW = this.spaceWidth, lineH = this.lineHeight, ss = this.spriteSheet;
      var pool = BitmapText._spritePool, kids = this.children, childIndex = 0, numKids = kids.length, sprite = void 0;
      for (var n in o) {
        if (o[n] != this[n]) {
          o[n] = this[n];
          change = true;
        }
      }
      if (!change) {
        return;
      }
      var hasSpace = !!this._getFrame(" ", ss);
      if (!hasSpace && !spaceW) {
        spaceW = this._getSpaceWidth(ss);
      }
      if (!lineH) {
        lineH = this._getLineHeight(ss);
      }
      for (var i = 0, l = this.text.length; i < l; i++) {
        var character = this.text.charAt(i);
        if (character === " " && !hasSpace) {
          x += spaceW;
          continue;
        } else if (character === "\n" || character === "\r") {
          if (character === "\r" && this.text.charAt(i + 1) === "\n") {
            i++;
          }
          x = 0;
          y += lineH;
          continue;
        }
        var index = this._getFrameIndex(character, ss);
        if (index == null) {
          continue;
        }
        if (childIndex < numKids) {
          sprite = kids[childIndex];
        } else {
          kids.push(sprite = pool.length ? pool.pop() : new Sprite());
          sprite.parent = this;
          numKids++;
        }
        sprite.spriteSheet = ss;
        sprite.gotoAndStop(index);
        sprite.x = x;
        sprite.y = y;
        childIndex++;
        x += sprite.getBounds().width + this.letterSpacing;
      }
      while (numKids > childIndex) {
        pool.push(sprite = kids.pop());
        sprite.parent = null;
        numKids--;
      }
      if (pool.length > BitmapText.maxPoolSize) {
        pool.length = BitmapText.maxPoolSize;
      }
    };
    createClass(BitmapText, null, [ {
      key: "maxPoolSize",
      get: function get() {
        return _maxPoolSize;
      },
      set: function set(maxPoolSize) {
        _maxPoolSize = maxPoolSize;
      }
    }, {
      key: "_spritePool",
      get: function get() {
        return _spritePool;
      }
    } ]);
    return BitmapText;
  }(Container);
  var DOMElement = function(_DisplayObject) {
    inherits(DOMElement, _DisplayObject);
    function DOMElement(htmlElement) {
      classCallCheck(this, DOMElement);
      var _this = possibleConstructorReturn(this, _DisplayObject.call(this));
      if (typeof htmlElement === "string") {
        htmlElement = document.getElementById(htmlElement);
      }
      _this.mouseEnabled = false;
      var style = htmlElement.style;
      style.position = "absolute";
      style.transformOrigin = style.WebkitTransformOrigin = style.msTransformOrigin = style.MozTransformOrigin = style.OTransformOrigin = "0% 0%";
      _this.htmlElement = htmlElement;
      _this._oldProps = null;
      _this._oldStage = null;
      _this._drawAction = null;
      return _this;
    }
    DOMElement.prototype.isVisible = function isVisible() {
      return this.htmlElement != null;
    };
    DOMElement.prototype.draw = function draw(ctx, ignoreCache) {
      return true;
    };
    DOMElement.prototype.cache = function cache() {};
    DOMElement.prototype.uncache = function uncache() {};
    DOMElement.prototype.updateCache = function updateCache() {};
    DOMElement.prototype.hitTest = function hitTest() {};
    DOMElement.prototype.localToGlobal = function localToGlobal() {};
    DOMElement.prototype.globalToLocal = function globalToLocal() {};
    DOMElement.prototype.localToLocal = function localToLocal() {};
    DOMElement.prototype.clone = function clone() {
      throw "DOMElement cannot be cloned.";
    };
    DOMElement.prototype._tick = function _tick(evtObj) {
      var stage = this.stage;
      if (stage != null && stage !== this._oldStage) {
        this._drawAction && stage.off("drawend", this._drawAction);
        this._drawAction = stage.on("drawend", this._handleDrawEnd, this);
        this._oldStage = stage;
      }
      _DisplayObject.prototype._tick.call(this, evtObj);
    };
    DOMElement.prototype._handleDrawEnd = function _handleDrawEnd(evt) {
      var o = this.htmlElement;
      if (!o) {
        return;
      }
      var style = o.style;
      var props = this.getConcatenatedDisplayProps(this._props), mtx = props.matrix;
      var visibility = props.visible ? "visible" : "hidden";
      if (visibility != style.visibility) {
        style.visibility = visibility;
      }
      if (!props.visible) {
        return;
      }
      var oldProps = this._oldProps, oldMtx = oldProps && oldProps.matrix;
      var n = 1e4;
      if (!oldMtx || !oldMtx.equals(mtx)) {
        var str = "matrix(" + (mtx.a * n | 0) / n + "," + (mtx.b * n | 0) / n + "," + (mtx.c * n | 0) / n + "," + (mtx.d * n | 0) / n + "," + (mtx.tx + .5 | 0);
        style.transform = style.WebkitTransform = style.OTransform = style.msTransform = str + "," + (mtx.ty + .5 | 0) + ")";
        style.MozTransform = str + "px," + (mtx.ty + .5 | 0) + "px)";
        if (!oldProps) {
          oldProps = this._oldProps = new DisplayProps(true, null);
        }
        oldProps.matrix.copy(mtx);
      }
      if (oldProps.alpha != props.alpha) {
        style.opacity = "" + (props.alpha * n | 0) / n;
        oldProps.alpha = props.alpha;
      }
    };
    return DOMElement;
  }(DisplayObject);
  var Graphics = function() {
    function Graphics() {
      classCallCheck(this, Graphics);
      this.command = null;
      this._stroke = null;
      this._strokeStyle = null;
      this._oldStrokeStyle = null;
      this._strokeDash = null;
      this._oldStrokeDash = null;
      this._strokeIgnoreScale = false;
      this._fill = null;
      this._instructions = [];
      this._commitIndex = 0;
      this._activeInstructions = [];
      this._dirty = false;
      this._storeIndex = 0;
      this.curveTo = this.quadraticCurveTo;
      this.drawRect = this.rect;
      this.mt = this.moveTo;
      this.lt = this.lineTo;
      this.at = this.arcTo;
      this.bt = this.bezierCurveTo;
      this.qt = this.quadraticCurveTo;
      this.a = this.arc;
      this.r = this.rect;
      this.cp = this.closePath;
      this.c = this.clear;
      this.f = this.beginFill;
      this.lf = this.beginLinearGradientFill;
      this.rf = this.beginRadialGradientFill;
      this.bf = this.beginBitmapFill;
      this.ef = this.endFill;
      this.ss = this.setStrokeStyle;
      this.sd = this.setStrokeDash;
      this.s = this.beginStroke;
      this.ls = this.beginLinearGradientStroke;
      this.rs = this.beginRadialGradientStroke;
      this.bs = this.beginBitmapStroke;
      this.es = this.endStroke;
      this.dr = this.drawRect;
      this.rr = this.drawRoundRect;
      this.rc = this.drawRoundRectComplex;
      this.dc = this.drawCircle;
      this.de = this.drawEllipse;
      this.dp = this.drawPolyStar;
      this.p = this.decodePath;
      this.clear();
    }
    Graphics.getRGB = function getRGB(r, g, b, alpha) {
      if (r != null && b == null) {
        alpha = g;
        b = r & 255;
        g = r >> 8 & 255;
        r = r >> 16 & 255;
      }
      if (alpha == null) {
        return "rgb(" + r + "," + g + "," + b + ")";
      } else {
        return "rgba(" + r + "," + g + "," + b + "," + alpha + ")";
      }
    };
    Graphics.getHSL = function getHSL(hue, saturation, lightness, alpha) {
      if (alpha == null) {
        return "hsl(" + hue % 360 + "," + saturation + "%," + lightness + "%)";
      } else {
        return "hsl(" + hue % 360 + "," + saturation + "%," + lightness + "%," + alpha + ")";
      }
    };
    Graphics.prototype.isEmpty = function isEmpty() {
      return !(this._instructions.length || this._activeInstructions.length);
    };
    Graphics.prototype.draw = function draw(ctx, data) {
      this._updateInstructions();
      var instr = this._instructions;
      var l = instr.length;
      for (var i = this._storeIndex; i < l; i++) {
        instr[i].exec(ctx, data);
      }
    };
    Graphics.prototype.drawAsPath = function drawAsPath(ctx) {
      this._updateInstructions();
      var instr = void 0, instrs = this._instructions;
      var l = instrs.length;
      for (var i = this._storeIndex; i < l; i++) {
        if ((instr = instrs[i]).path !== false) {
          instr.exec(ctx);
        }
      }
    };
    Graphics.prototype.moveTo = function moveTo(x, y) {
      return this.append(new MoveTo(x, y), true);
    };
    Graphics.prototype.lineTo = function lineTo(x, y) {
      return this.append(new LineTo(x, y));
    };
    Graphics.prototype.arcTo = function arcTo(x1, y1, x2, y2, radius) {
      return this.append(new ArcTo(x1, y1, x2, y2, radius));
    };
    Graphics.prototype.arc = function arc(x, y, radius, startAngle, endAngle, anticlockwise) {
      return this.append(new Arc(x, y, radius, startAngle, endAngle, anticlockwise));
    };
    Graphics.prototype.quadraticCurveTo = function quadraticCurveTo(cpx, cpy, x, y) {
      return this.append(new QuadraticCurveTo(cpx, cpy, x, y));
    };
    Graphics.prototype.bezierCurveTo = function bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
      return this.append(new BezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y));
    };
    Graphics.prototype.rect = function rect(x, y, w, h) {
      return this.append(new Rect(x, y, w, h));
    };
    Graphics.prototype.closePath = function closePath() {
      return this._activeInstructions.length ? this.append(new ClosePath()) : this;
    };
    Graphics.prototype.clear = function clear() {
      this._instructions.length = this._activeInstructions.length = this._commitIndex = 0;
      this._strokeStyle = this._oldStrokeStyle = this._stroke = this._fill = this._strokeDash = this._oldStrokeDash = null;
      this._dirty = this._strokeIgnoreScale = false;
      return this;
    };
    Graphics.prototype.beginFill = function beginFill(color) {
      return this._setFill(color ? new Fill(color) : null);
    };
    Graphics.prototype.beginLinearGradientFill = function beginLinearGradientFill(colors, ratios, x0, y0, x1, y1) {
      return this._setFill(new Fill().linearGradient(colors, ratios, x0, y0, x1, y1));
    };
    Graphics.prototype.beginRadialGradientFill = function beginRadialGradientFill(colors, ratios, x0, y0, r0, x1, y1, r1) {
      return this._setFill(new Fill().radialGradient(colors, ratios, x0, y0, r0, x1, y1, r1));
    };
    Graphics.prototype.beginBitmapFill = function beginBitmapFill(image, repetition, matrix) {
      return this._setFill(new Fill(null, matrix).bitmap(image, repetition));
    };
    Graphics.prototype.endFill = function endFill() {
      return this.beginFill();
    };
    Graphics.prototype.setStrokeStyle = function setStrokeStyle(thickness) {
      var caps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var joints = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var miterLimit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 10;
      var ignoreScale = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
      this._updateInstructions(true);
      this._strokeStyle = this.command = new StrokeStyle(thickness, caps, joints, miterLimit, ignoreScale);
      if (this._stroke) {
        this._stroke.ignoreScale = ignoreScale;
      }
      this._strokeIgnoreScale = ignoreScale;
      return this;
    };
    Graphics.prototype.setStrokeDash = function setStrokeDash(segments) {
      var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      this._updateInstructions(true);
      this._strokeDash = this.command = new StrokeDash(segments, offset);
      return this;
    };
    Graphics.prototype.beginStroke = function beginStroke(color) {
      return this._setStroke(color ? new Stroke(color) : null);
    };
    Graphics.prototype.beginLinearGradientStroke = function beginLinearGradientStroke(colors, ratios, x0, y0, x1, y1) {
      return this._setStroke(new Stroke().linearGradient(colors, ratios, x0, y0, x1, y1));
    };
    Graphics.prototype.beginRadialGradientStroke = function beginRadialGradientStroke(colors, ratios, x0, y0, r0, x1, y1, r1) {
      return this._setStroke(new Stroke().radialGradient(colors, ratios, x0, y0, r0, x1, y1, r1));
    };
    Graphics.prototype.beginBitmapStroke = function beginBitmapStroke(image) {
      var repetition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "repeat";
      return this._setStroke(new Stroke().bitmap(image, repetition));
    };
    Graphics.prototype.endStroke = function endStroke() {
      return this.beginStroke();
    };
    Graphics.prototype.drawRoundRect = function drawRoundRect(x, y, w, h, radius) {
      return this.drawRoundRectComplex(x, y, w, h, radius, radius, radius, radius);
    };
    Graphics.prototype.drawRoundRectComplex = function drawRoundRectComplex(x, y, w, h, radiusTL, radiusTR, radiusBR, radiusBL) {
      return this.append(new RoundRect(x, y, w, h, radiusTL, radiusTR, radiusBR, radiusBL));
    };
    Graphics.prototype.drawCircle = function drawCircle(x, y, radius) {
      return this.append(new Circle(x, y, radius));
    };
    Graphics.prototype.drawEllipse = function drawEllipse(x, y, w, h) {
      return this.append(new Ellipse(x, y, w, h));
    };
    Graphics.prototype.drawPolyStar = function drawPolyStar(x, y, radius, sides, pointSize, angle) {
      return this.append(new PolyStar(x, y, radius, sides, pointSize, angle));
    };
    Graphics.prototype.append = function append(command, clean) {
      this._activeInstructions.push(command);
      this.command = command;
      if (!clean) {
        this._dirty = true;
      }
      return this;
    };
    Graphics.prototype.decodePath = function decodePath(str) {
      var instructions = [ this.moveTo, this.lineTo, this.quadraticCurveTo, this.bezierCurveTo, this.closePath ];
      var paramCount = [ 2, 2, 4, 6, 0 ];
      var i = 0;
      var l = str.length;
      var params = [];
      var x = 0, y = 0;
      var base64 = Graphics.BASE_64;
      while (i < l) {
        var c = str.charAt(i);
        var n = base64[c];
        var fi = n >> 3;
        var f = instructions[fi];
        if (!f || n & 3) {
          throw "bad path data (@" + i + "):c";
        }
        var pl = paramCount[fi];
        if (!fi) {
          x = y = 0;
        }
        params.length = 0;
        i++;
        var charCount = (n >> 2 & 1) + 2;
        for (var p = 0; p < pl; p++) {
          var num = base64[str.charAt(i)];
          var sign = num >> 5 ? -1 : 1;
          num = (num & 31) << 6 | base64[str.charAt(i + 1)];
          if (charCount === 3) {
            num = num << 6 | base64[str.charAt(i + 2)];
          }
          num = sign * num / 10;
          if (p % 2) {
            x = num += x;
          } else {
            y = num += y;
          }
          params[p] = num;
          i += charCount;
        }
        f.apply(this, params);
      }
      return this;
    };
    Graphics.prototype.store = function store() {
      this._updateInstructions(true);
      this._storeIndex = this._instructions.length;
      return this;
    };
    Graphics.prototype.unstore = function unstore() {
      this._storeIndex = 0;
      return this;
    };
    Graphics.prototype.clone = function clone() {
      var o = new Graphics();
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
      return o;
    };
    Graphics.prototype.toString = function toString() {
      return "[" + this.constructor.name + "]";
    };
    Graphics.prototype._updateInstructions = function _updateInstructions(commit) {
      var instr = this._instructions, active = this._activeInstructions, commitIndex = this._commitIndex;
      if (this._dirty && active.length) {
        instr.length = commitIndex;
        instr.push(Graphics.beginCmd);
        var l = active.length, ll = instr.length;
        instr.length = ll + l;
        for (var i = 0; i < l; i++) {
          instr[i + ll] = active[i];
        }
        if (this._fill) {
          instr.push(this._fill);
        }
        if (this._stroke) {
          if (this._strokeDash !== this._oldStrokeDash) {
            instr.push(this._strokeDash);
          }
          if (this._strokeStyle !== this._oldStrokeStyle) {
            instr.push(this._strokeStyle);
          }
          if (commit) {
            this._oldStrokeDash = this._strokeDash;
            this._oldStrokeStyle = this._strokeStyle;
          }
          instr.push(this._stroke);
        }
        this._dirty = false;
      }
      if (commit) {
        active.length = 0;
        this._commitIndex = instr.length;
      }
    };
    Graphics.prototype._setFill = function _setFill(fill) {
      this._updateInstructions(true);
      this.command = this._fill = fill;
      return this;
    };
    Graphics.prototype._setStroke = function _setStroke(stroke) {
      this._updateInstructions(true);
      if (this.command = this._stroke = stroke) {
        stroke.ignoreScale = this._strokeIgnoreScale;
      }
      return this;
    };
    createClass(Graphics, [ {
      key: "instructions",
      get: function get() {
        this._updateInstructions();
        return this._instructions;
      }
    } ]);
    return Graphics;
  }();
  var LineTo = function() {
    function LineTo(x, y) {
      classCallCheck(this, LineTo);
      this.x = x;
      this.y = y;
    }
    LineTo.prototype.exec = function exec(ctx) {
      ctx.lineTo(this.x, this.y);
    };
    return LineTo;
  }();
  var MoveTo = function() {
    function MoveTo(x, y) {
      classCallCheck(this, MoveTo);
      this.x = x;
      this.y = y;
    }
    MoveTo.prototype.exec = function exec(ctx) {
      ctx.moveTo(this.x, this.y);
    };
    return MoveTo;
  }();
  var ArcTo = function() {
    function ArcTo(x1, y1, x2, y2, radius) {
      classCallCheck(this, ArcTo);
      this.x1 = x1;
      this.y1 = y1;
      this.x2 = x2;
      this.y2 = y2;
      this.radius = radius;
    }
    ArcTo.prototype.exec = function exec(ctx) {
      ctx.arcTo(this.x1, this.y1, this.x2, this.y2, this.radius);
    };
    return ArcTo;
  }();
  var Arc = function() {
    function Arc(x, y, radius, startAngle, endAngle, anticlockwise) {
      classCallCheck(this, Arc);
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.startAngle = startAngle;
      this.endAngle = endAngle;
      this.anticlockwise = !!anticlockwise;
    }
    Arc.prototype.exec = function exec(ctx) {
      ctx.arc(this.x, this.y, this.radius, this.startAngle, this.endAngle, this.anticlockwise);
    };
    return Arc;
  }();
  var QuadraticCurveTo = function() {
    function QuadraticCurveTo(cpx, cpy, x, y) {
      classCallCheck(this, QuadraticCurveTo);
      this.cpx = cpx;
      this.cpy = cpy;
      this.x = x;
      this.y = y;
    }
    QuadraticCurveTo.prototype.exec = function exec(ctx) {
      ctx.quadraticCurveTo(this.cpx, this.cpy, this.x, this.y);
    };
    return QuadraticCurveTo;
  }();
  var BezierCurveTo = function() {
    function BezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
      classCallCheck(this, BezierCurveTo);
      this.cp1x = cp1x;
      this.cp1y = cp1y;
      this.cp2x = cp2x;
      this.cp2y = cp2y;
      this.x = x;
      this.y = y;
    }
    BezierCurveTo.prototype.exec = function exec(ctx) {
      ctx.bezierCurveTo(this.cp1x, this.cp1y, this.cp2x, this.cp2y, this.x, this.y);
    };
    return BezierCurveTo;
  }();
  var Rect = function() {
    function Rect(x, y, w, h) {
      classCallCheck(this, Rect);
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
    }
    Rect.prototype.exec = function exec(ctx) {
      ctx.rect(this.x, this.y, this.w, this.h);
    };
    return Rect;
  }();
  var ClosePath = function() {
    function ClosePath() {
      classCallCheck(this, ClosePath);
    }
    ClosePath.prototype.exec = function exec(ctx) {
      ctx.closePath();
    };
    return ClosePath;
  }();
  var BeginPath = function() {
    function BeginPath() {
      classCallCheck(this, BeginPath);
    }
    BeginPath.prototype.exec = function exec(ctx) {
      ctx.beginPath();
    };
    return BeginPath;
  }();
  var Fill = function() {
    function Fill(style, matrix) {
      classCallCheck(this, Fill);
      this.style = style;
      this.matrix = matrix;
      this.path = false;
    }
    Fill.prototype.exec = function exec(ctx) {
      if (!this.style) {
        return;
      }
      ctx.fillStyle = this.style;
      var mtx = this.matrix;
      if (mtx) {
        ctx.save();
        ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
      }
      ctx.fill();
      if (mtx) {
        ctx.restore();
      }
    };
    Fill.prototype.linearGradient = function linearGradient(colors, ratios, x0, y0, x1, y1) {
      var o = this.style = Graphics._ctx.createLinearGradient(x0, y0, x1, y1);
      var l = colors.length;
      for (var i = 0; i < l; i++) {
        o.addColorStop(ratios[i], colors[i]);
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
      return this;
    };
    Fill.prototype.radialGradient = function radialGradient(colors, ratios, x0, y0, r0, x1, y1, r1) {
      var o = this.style = Graphics._ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
      var l = colors.length;
      for (var i = 0; i < l; i++) {
        o.addColorStop(ratios[i], colors[i]);
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
      return this;
    };
    Fill.prototype.bitmap = function bitmap(image) {
      var repetition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
      if (image.naturalWidth || image.getContext || image.readyState >= 2) {
        var o = this.style = Graphics._ctx.createPattern(image, repetition);
        o.props = {
          image: image,
          repetition: repetition,
          type: "bitmap"
        };
      }
      return this;
    };
    return Fill;
  }();
  var Stroke = function() {
    function Stroke(style, ignoreScale) {
      classCallCheck(this, Stroke);
      this.style = style;
      this.ignoreScale = ignoreScale;
      this.path = false;
    }
    Stroke.prototype.exec = function exec(ctx) {
      if (!this.style) {
        return;
      }
      ctx.strokeStyle = this.style;
      if (this.ignoreScale) {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
      }
      ctx.stroke();
      if (this.ignoreScale) {
        ctx.restore();
      }
    };
    Stroke.prototype.linearGradient = function linearGradient() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      Fill.prototype.linearGradient.apply(this, args);
    };
    Stroke.prototype.radialGradient = function radialGradient() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      Fill.prototype.radialGradient.apply(this, args);
    };
    Stroke.prototype.bitmap = function bitmap() {
      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }
      Fill.prototype.bitmap.apply(this, args);
    };
    return Stroke;
  }();
  var StrokeStyle = function() {
    function StrokeStyle(width) {
      var caps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "butt";
      var joints = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "miter";
      var miterLimit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 10;
      var ignoreScale = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
      classCallCheck(this, StrokeStyle);
      this.width = width;
      this.caps = caps;
      this.joints = joints;
      this.miterLimit = miterLimit;
      this.ignoreScale = ignoreScale;
      this.path = false;
    }
    StrokeStyle.prototype.exec = function exec(ctx) {
      ctx.lineWidth = this.width;
      ctx.lineCap = isNaN(this.caps) ? this.caps : Graphics.STROKE_CAPS_MAP[this.caps];
      ctx.lineJoin = isNaN(this.joints) ? this.joints : Graphics.STROKE_JOINTS_MAP[this.joints];
      ctx.miterLimit = this.miterLimit;
      ctx.ignoreScale = this.ignoreScale;
    };
    return StrokeStyle;
  }();
  var StrokeDash = function() {
    function StrokeDash() {
      var segments = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : StrokeDash.EMPTY_SEGMENTS;
      var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      classCallCheck(this, StrokeDash);
      this.segments = segments;
      this.offset = offset;
    }
    StrokeDash.prototype.exec = function exec(ctx) {
      if (ctx.setLineDash) {
        ctx.setLineDash(this.segments);
        ctx.lineDashOffset = this.offset;
      }
    };
    createClass(StrokeDash, null, [ {
      key: "EMPTY_SEGMENTS",
      get: function get() {
        return _EMPTY_SEGMENTS;
      }
    } ]);
    return StrokeDash;
  }();
  var RoundRect = function() {
    function RoundRect(x, y, w, h, radiusTL, radiusTR, radiusBR, radiusBL) {
      classCallCheck(this, RoundRect);
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.radiusTL = radiusTL;
      this.radiusTR = radiusTR;
      this.radiusBR = radiusBR;
      this.radiusBL = radiusBL;
    }
    RoundRect.prototype.exec = function exec(ctx) {
      var max = (w < h ? w : h) / 2;
      var mTL = 0, mTR = 0, mBR = 0, mBL = 0;
      var x = this.x, y = this.y, w = this.w, h = this.h;
      var rTL = this.radiusTL, rTR = this.radiusTR, rBR = this.radiusBR, rBL = this.radiusBL;
      if (rTL < 0) {
        rTL *= mTL = -1;
      }
      if (rTL > max) {
        rTL = max;
      }
      if (rTR < 0) {
        rTR *= mTR = -1;
      }
      if (rTR > max) {
        rTR = max;
      }
      if (rBR < 0) {
        rBR *= mBR = -1;
      }
      if (rBR > max) {
        rBR = max;
      }
      if (rBL < 0) {
        rBL *= mBL = -1;
      }
      if (rBL > max) {
        rBL = max;
      }
      ctx.moveTo(x + w - rTR, y);
      ctx.arcTo(x + w + rTR * mTR, y - rTR * mTR, x + w, y + rTR, rTR);
      ctx.lineTo(x + w, y + h - rBR);
      ctx.arcTo(x + w + rBR * mBR, y + h + rBR * mBR, x + w - rBR, y + h, rBR);
      ctx.lineTo(x + rBL, y + h);
      ctx.arcTo(x - rBL * mBL, y + h + rBL * mBL, x, y + h - rBL, rBL);
      ctx.lineTo(x, y + rTL);
      ctx.arcTo(x - rTL * mTL, y - rTL * mTL, x + rTL, y, rTL);
      ctx.closePath();
    };
    return RoundRect;
  }();
  var Circle = function() {
    function Circle(x, y, radius) {
      classCallCheck(this, Circle);
      this.x = x;
      this.y = y;
      this.radius = radius;
    }
    Circle.prototype.exec = function exec(ctx) {
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    };
    return Circle;
  }();
  var Ellipse = function() {
    function Ellipse(x, y, w, h) {
      classCallCheck(this, Ellipse);
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
    }
    Ellipse.prototype.exec = function exec(ctx) {
      var x = this.x, y = this.y;
      var w = this.w, h = this.h;
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
      ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    };
    return Ellipse;
  }();
  var PolyStar = function() {
    function PolyStar(x, y, radius, sides) {
      var pointSize = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
      var angle = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
      classCallCheck(this, PolyStar);
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.sides = sides;
      this.pointSize = pointSize;
      this.angle = angle;
    }
    PolyStar.prototype.exec = function exec(ctx) {
      var x = this.x, y = this.y;
      var radius = this.radius;
      var angle = this.angle / 180 * Math.PI;
      var sides = this.sides;
      var ps = 1 - this.pointSize;
      var a = Math.PI / sides;
      ctx.moveTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
      for (var i = 0; i < sides; i++) {
        angle += a;
        if (ps != 1) {
          ctx.lineTo(x + Math.cos(angle) * radius * ps, y + Math.sin(angle) * radius * ps);
        }
        angle += a;
        ctx.lineTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
      }
      ctx.closePath();
    };
    return PolyStar;
  }();
  {
    var canvas = createjs && createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas");
    if (canvas.getContext) {
      Graphics._ctx = canvas.getContext("2d");
      canvas.width = canvas.height = 1;
    }
    Graphics.beginCmd = new BeginPath();
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
    Graphics.STROKE_CAPS_MAP = [ "butt", "round", "square" ];
    Graphics.STROKE_JOINTS_MAP = [ "miter", "round", "bevel" ];
    Graphics.EMPTY_SEGMENTS = [];
  }
  var MovieClip = function(_Container) {
    inherits(MovieClip, _Container);
    function MovieClip(_ref) {
      var _ref$mode = _ref.mode, mode = _ref$mode === undefined ? MovieClip.INDEPENDENT : _ref$mode, _ref$startPosition = _ref.startPosition, startPosition = _ref$startPosition === undefined ? 0 : _ref$startPosition, _ref$loop = _ref.loop, loop = _ref$loop === undefined ? -1 : _ref$loop, _ref$paused = _ref.paused, paused = _ref$paused === undefined ? false : _ref$paused, _ref$frameBounds = _ref.frameBounds, frameBounds = _ref$frameBounds === undefined ? null : _ref$frameBounds, _ref$labels = _ref.labels, labels = _ref$labels === undefined ? null : _ref$labels;
      classCallCheck(this, MovieClip);
      var _this = possibleConstructorReturn(this, _Container.call(this));
      !MovieClip.inited && MovieClip.init();
      _this.mode = mode;
      _this.startPosition = startPosition;
      _this.loop = loop === true ? -1 : loop || 0;
      _this.currentFrame = 0;
      _this.timeline = new Timeline({
        useTicks: true,
        paused: true,
        mode: mode,
        startPosition: startPosition,
        loop: loop,
        frameBounds: frameBounds,
        labels: labels
      });
      _this.paused = paused;
      _this.actionsEnabled = true;
      _this.autoReset = true;
      _this.frameBounds = _this.frameBounds || props.frameBounds;
      _this.framerate = null;
      _this._synchOffset = 0;
      _this._rawPosition = -1;
      _this._t = 0;
      _this._managed = {};
      _this._bound_resolveState = _this._resolveState.bind(_this);
      return _this;
    }
    MovieClip.init = function init() {
      if (MovieClip.inited) {
        return;
      }
      MovieClipPlugin.install();
      MovieClip.inited = true;
    };
    MovieClip.prototype.isVisible = function isVisible() {
      return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0);
    };
    MovieClip.prototype.draw = function draw(ctx, ignoreCache) {
      if (this.drawCache(ctx, ignoreCache)) {
        return true;
      }
      this._updateState();
      _Container.prototype.draw.call(this, ctx, ignoreCache);
      return true;
    };
    MovieClip.prototype.play = function play() {
      this.paused = false;
    };
    MovieClip.prototype.stop = function stop() {
      this.paused = true;
    };
    MovieClip.prototype.gotoAndPlay = function gotoAndPlay(positionOrLabel) {
      this.paused = false;
      this._goto(positionOrLabel);
    };
    MovieClip.prototype.gotoAndStop = function gotoAndStop(positionOrLabel) {
      this.paused = true;
      this._goto(positionOrLabel);
    };
    MovieClip.prototype.advance = function advance(time) {
      var INDEPENDENT = MovieClip.INDEPENDENT;
      if (this.mode !== INDEPENDENT) {
        return;
      }
      var o = this, fps = o.framerate;
      while ((o = o.parent) && fps === null) {
        if (o.mode === INDEPENDENT) {
          fps = o._framerate;
        }
      }
      this._framerate = fps;
      if (this.paused) {
        return;
      }
      var t = fps !== null && fps !== -1 && time !== null ? time / (1e3 / fps) + this._t : 1;
      var frames = t | 0;
      this._t = t - frames;
      while (frames--) {
        this._updateTimeline(this._rawPosition + 1, false);
      }
    };
    MovieClip.prototype.clone = function clone() {
      throw "MovieClip cannot be cloned.";
    };
    MovieClip.prototype._updateState = function _updateState() {
      if (this._rawPosition === -1 || this.mode !== MovieClip.INDEPENDENT) {
        this._updateTimeline(-1);
      }
    };
    MovieClip.prototype._tick = function _tick(evtObj) {
      this.advance(evtObj && evtObj.delta);
      _Container.prototype._tick.call(this, evtObj);
    };
    MovieClip.prototype._goto = function _goto(positionOrLabel) {
      var pos = this.timeline.resolve(positionOrLabel);
      if (pos == null) {
        return;
      }
      this._t = 0;
      this._updateTimeline(pos, true);
    };
    MovieClip.prototype._reset = function _reset() {
      this._rawPosition = -1;
      this._t = this.currentFrame = 0;
      this.paused = false;
    };
    MovieClip.prototype._updateTimeline = function _updateTimeline(rawPosition, jump) {
      var synced = this.mode !== MovieClip.INDEPENDENT, tl = this.timeline;
      if (synced) {
        rawPosition = this.startPosition + (this.mode === MovieClip.SINGLE_FRAME ? 0 : this._synchOffset);
      }
      if (rawPosition < 1) {
        rawPosition = 0;
      }
      if (this._rawPosition === rawPosition && !synced) {
        return;
      }
      this._rawPosition = rawPosition;
      tl.loop = this.loop;
      tl.setPosition(rawPosition, synced || !this.actionsEnabled, jump, this._bound_resolveState);
    };
    MovieClip.prototype._renderFirstFrame = function _renderFirstFrame() {
      var tl = this.timeline, pos = tl.rawPosition;
      tl.setPosition(0, true, true, this._bound_resolveState);
      tl.rawPosition = pos;
    };
    MovieClip.prototype._resolveState = function _resolveState() {
      var tl = this.timeline;
      this.currentFrame = tl.position;
      for (var n in this._managed) {
        this._managed[n] = 1;
      }
      var tweens = tl.tweens;
      for (var _iterator = tweens, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator](); ;) {
        var _ref2;
        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref2 = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref2 = _i.value;
        }
        var tween = _ref2;
        var target = tween.target;
        if (target === this || tween.passive) {
          continue;
        }
        var offset = tween._stepPosition;
        if (target instanceof DisplayObject) {
          this._addManagedChild(target, offset);
        } else {
          this._setState(target.state, offset);
        }
      }
      var kids = this.children;
      for (var i = kids.length - 1; i >= 0; i--) {
        var id = kids[i].id;
        if (this._managed[id] === 1) {
          this.removeChildAt(i);
          delete this._managed[id];
        }
      }
    };
    MovieClip.prototype._setState = function _setState(state, offset) {
      if (!state) {
        return;
      }
      for (var i = state.length - 1; i >= 0; i--) {
        var o = state[i];
        var target = o.t;
        var _props = o.p;
        for (var n in _props) {
          target[n] = _props[n];
        }
        this._addManagedChild(target, offset);
      }
    };
    MovieClip.prototype._addManagedChild = function _addManagedChild(child, offset) {
      if (child._off) {
        return;
      }
      this.addChildAt(child, 0);
      if (child instanceof MovieClip) {
        child._synchOffset = offset;
        if (child.mode === MovieClip.INDEPENDENT && child.autoReset && !this._managed[child.id]) {
          child._reset();
        }
      }
      this._managed[child.id] = 2;
    };
    MovieClip.prototype._getBounds = function _getBounds(matrix, ignoreTransform) {
      var bounds = this.getBounds();
      if (!bounds && this.frameBounds) {
        bounds = this._rectangle.copy(this.frameBounds[this.currentFrame]);
      }
      if (bounds) {
        return this._transformBounds(bounds, matrix, ignoreTransform);
      }
      return _Container.prototype._getBounds.call(this, matrix, ignoreTransform);
    };
    createClass(MovieClip, [ {
      key: "labels",
      get: function get() {
        return this.timeline.labels;
      }
    }, {
      key: "currentLabel",
      get: function get() {
        return this.timeline.getCurrentLabel();
      }
    }, {
      key: "duration",
      get: function get() {
        return this.timeline.duration;
      }
    }, {
      key: "totalFrames",
      get: function get() {
        return this.duration;
      }
    } ]);
    return MovieClip;
  }(Container);
  {
    MovieClip.INDEPENDENT = "independent";
    MovieClip.SINGLE_FRAME = "single";
    MovieClip.SYNCHED = "synched";
    MovieClip.inited = false;
  }
  var MovieClipPlugin = function() {
    function MovieClipPlugin() {
      classCallCheck(this, MovieClipPlugin);
      throw "MovieClipPlugin cannot be instantiated.";
    }
    MovieClipPlugin.install = function install() {
      Tween._installPlugin(MovieClipPlugin);
    };
    MovieClipPlugin.init = function init(tween, prop, value) {
      return value;
    };
    MovieClipPlugin.tween = function tween(_tween, prop, value, startValues, endValues, ratio, wait, end) {
      if (!(_tween.target instanceof MovieClip)) {
        return value;
      }
      return ratio === 1 ? endValues[prop] : startValues[prop];
    };
    return MovieClipPlugin;
  }();
  {
    MovieClipPlugin.priority = 100;
  }
  var Shadow = function() {
    function Shadow() {
      var color = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "black";
      var offsetX = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var offsetY = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var blur = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
      classCallCheck(this, Shadow);
      this.color = color;
      this.offsetX = offsetX;
      this.offsetY = offsetY;
      this.blur = blur;
    }
    Shadow.prototype.toString = function toString() {
      return "[" + this.constructor.name + "]";
    };
    Shadow.prototype.clone = function clone() {
      return new Shadow(this.color, this.offsetX, this.offsetY, this.blur);
    };
    return Shadow;
  }();
  {
    Shadow.identity = new Shadow("transparent");
  }
  var Shape = function(_DisplayObject) {
    inherits(Shape, _DisplayObject);
    function Shape() {
      var graphics = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Graphics();
      classCallCheck(this, Shape);
      var _this = possibleConstructorReturn(this, _DisplayObject.call(this));
      _this.graphics = graphics;
      return _this;
    }
    Shape.prototype.isVisible = function isVisible() {
      var hasContent = this.cacheCanvas || this.graphics && !this.graphics.isEmpty();
      return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent);
    };
    Shape.prototype.draw = function draw(ctx) {
      var ignoreCache = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      if (_DisplayObject.prototype.draw.call(this, ctx, ignoreCache)) {
        return true;
      }
      this.graphics.draw(ctx, this);
      return true;
    };
    Shape.prototype.clone = function clone() {
      var recursive = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var g = recursive && this.graphics ? this.graphics.clone() : this.graphics;
      return this._cloneProps(new Shape(g));
    };
    return Shape;
  }(DisplayObject);
  var SpriteSheet = function(_EventDispatcher) {
    inherits(SpriteSheet, _EventDispatcher);
    function SpriteSheet(data) {
      classCallCheck(this, SpriteSheet);
      var _this = possibleConstructorReturn(this, _EventDispatcher.call(this));
      _this.complete = true;
      _this.framerate = 0;
      _this._animations = null;
      _this._frames = null;
      _this._images = null;
      _this._data = null;
      _this._loadCount = 0;
      _this._frameHeight = 0;
      _this._frameWidth = 0;
      _this._numFrames = 0;
      _this._regX = 0;
      _this._regY = 0;
      _this._spacing = 0;
      _this._margin = 0;
      _this._parseData(data);
      return _this;
    }
    SpriteSheet.prototype.getNumFrames = function getNumFrames(animation) {
      if (animation == null) {
        return this._frames ? this._frames.length : this._numFrames || 0;
      } else {
        var data = this._data[animation];
        if (data == null) {
          return 0;
        } else {
          return data.frames.length;
        }
      }
    };
    SpriteSheet.prototype.getAnimation = function getAnimation(name) {
      return this._data[name];
    };
    SpriteSheet.prototype.getFrame = function getFrame(frameIndex) {
      var frame = void 0;
      if (this._frames && (frame = this._frames[frameIndex])) {
        return frame;
      }
      return null;
    };
    SpriteSheet.prototype.getFrameBounds = function getFrameBounds(frameIndex) {
      var rectangle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Rectangle();
      var frame = this.getFrame(frameIndex);
      return frame ? rectangle.setValues(-frame.regX, -frame.regY, frame.rect.width, frame.rect.height) : null;
    };
    SpriteSheet.prototype.toString = function toString() {
      return "[" + this.constructor.name + "]";
    };
    SpriteSheet.prototype.clone = function clone() {
      throw "SpriteSheet cannot be cloned.";
    };
    SpriteSheet.prototype._parseData = function _parseData(data) {
      var _this2 = this;
      if (data == null) {
        return;
      }
      this.framerate = data.framerate || 0;
      if (data.images) {
        var _loop = function _loop(_img) {
          var a = _this2._images = [];
          var src = void 0;
          if (typeof _img === "string") {
            src = _img;
            _img = document.createElement("img");
            _img.src = src;
          }
          a.push(_img);
          if (!_img.getContext && !_img.naturalWidth) {
            _this2._loadCount++;
            _this2.complete = false;
            _img.onload = function() {
              return _this2._handleImageLoad(src);
            };
            _img.onerror = function() {
              return _this2._handleImageError(src);
            };
          }
          img = _img;
        };
        for (var _iterator = data.images, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator](); ;) {
          var _ref;
          if (_isArray) {
            if (_i >= _iterator.length) break;
            _ref = _iterator[_i++];
          } else {
            _i = _iterator.next();
            if (_i.done) break;
            _ref = _i.value;
          }
          var img = _ref;
          _loop(img);
        }
      }
      if (data.frames != null) {
        if (Array.isArray(data.frames)) {
          this._frames = [];
          for (var _iterator2 = data.frames, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator](); ;) {
            var _ref2;
            if (_isArray2) {
              if (_i2 >= _iterator2.length) break;
              _ref2 = _iterator2[_i2++];
            } else {
              _i2 = _iterator2.next();
              if (_i2.done) break;
              _ref2 = _i2.value;
            }
            var arr = _ref2;
            this._frames.push({
              image: this._images[arr[4] ? arr[4] : 0],
              rect: new Rectangle(arr[0], arr[1], arr[2], arr[3]),
              regX: arr[5] || 0,
              regY: arr[6] || 0
            });
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
          if (this._loadCount === 0) {
            this._calculateFrames();
          }
        }
      }
      this._animations = [];
      if (data.animations != null) {
        this._data = {};
        var _o = data.animations;
        for (var name in _o) {
          var anim = {
            name: name
          };
          var obj = _o[name];
          var a = void 0;
          if (typeof obj === "number") {
            a = anim.frames = [ obj ];
          } else if (Array.isArray(obj)) {
            if (obj.length === 1) {
              anim.frames = [ obj[0] ];
            } else {
              anim.speed = obj[3];
              anim.next = obj[2];
              a = anim.frames = [];
              for (var i = obj[0]; i <= obj[1]; i++) {
                a.push(i);
              }
            }
          } else {
            anim.speed = obj.speed;
            anim.next = obj.next;
            var frames = obj.frames;
            a = anim.frames = typeof frames === "number" ? [ frames ] : frames.slice(0);
          }
          if (anim.next === true || anim.next === undefined) {
            anim.next = name;
          }
          if (anim.next === false || a.length < 2 && anim.next === name) {
            anim.next = null;
          }
          if (!anim.speed) {
            anim.speed = 1;
          }
          this._animations.push(name);
          this._data[name] = anim;
        }
      }
    };
    SpriteSheet.prototype._handleImageLoad = function _handleImageLoad(src) {
      if (--this._loadCount === 0) {
        this._calculateFrames();
        this.complete = true;
        this.dispatchEvent("complete");
      }
    };
    SpriteSheet.prototype._handleImageError = function _handleImageError(src) {
      var errorEvent = new Event("error");
      errorEvent.src = src;
      this.dispatchEvent(errorEvent);
      if (--this._loadCount === 0) {
        this.dispatchEvent("complete");
      }
    };
    SpriteSheet.prototype._calculateFrames = function _calculateFrames() {
      if (this._frames || this._frameWidth === 0) {
        return;
      }
      this._frames = [];
      var maxFrames = this._numFrames || 1e5;
      var frameCount = 0, frameWidth = this._frameWidth, frameHeight = this._frameHeight;
      var spacing = this._spacing, margin = this._margin;
      imgLoop: for (var i = 0, imgs = this._images, l = imgs.length; i < l; i++) {
        var _img2 = imgs[i], imgW = _img2.width || _img2.naturalWidth, imgH = _img2.height || _img2.naturalHeight;
        var y = margin;
        while (y <= imgH - margin - frameHeight) {
          var x = margin;
          while (x <= imgW - margin - frameWidth) {
            if (frameCount >= maxFrames) {
              break imgLoop;
            }
            frameCount++;
            this._frames.push({
              image: _img2,
              rect: new Rectangle(x, y, frameWidth, frameHeight),
              regX: this._regX,
              regY: this._regY
            });
            x += frameWidth + spacing;
          }
          y += frameHeight + spacing;
        }
      }
      this._numFrames = frameCount;
    };
    createClass(SpriteSheet, [ {
      key: "animations",
      get: function get() {
        return this._animations.slice();
      }
    } ]);
    return SpriteSheet;
  }(EventDispatcher);
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
  var Text = function(_DisplayObject) {
    inherits(Text, _DisplayObject);
    function Text(text, font, color) {
      classCallCheck(this, Text);
      var _this = possibleConstructorReturn(this, _DisplayObject.call(this));
      _this.text = text;
      _this.font = font;
      _this.color = color;
      _this.textAlign = "left";
      _this.textBaseline = "top";
      _this.maxWidth = null;
      _this.outline = 0;
      _this.lineHeight = 0;
      _this.lineWidth = null;
      return _this;
    }
    Text.prototype.isVisible = function isVisible() {
      var hasContent = this.cacheCanvas || this.text != null && this.text !== "";
      return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent);
    };
    Text.prototype.draw = function draw(ctx, ignoreCache) {
      if (_DisplayObject.prototype.draw.call(this, ctx, ignoreCache)) {
        return true;
      }
      var col = this.color || "#000";
      if (this.outline) {
        ctx.strokeStyle = col;
        ctx.lineWidth = this.outline * 1;
      } else {
        ctx.fillStyle = col;
      }
      this._drawText(this._prepContext(ctx));
      return true;
    };
    Text.prototype.getMeasuredWidth = function getMeasuredWidth() {
      return this._getMeasuredWidth(this.text);
    };
    Text.prototype.getMeasuredLineHeight = function getMeasuredLineHeight() {
      return this._getMeasuredWidth("M") * 1.2;
    };
    Text.prototype.getMeasuredHeight = function getMeasuredHeight() {
      return this._drawText(null, {}).height;
    };
    Text.prototype.getBounds = function getBounds() {
      var rect = _DisplayObject.prototype.getBounds.call(this);
      if (rect) {
        return rect;
      }
      if (this.text == null || this.text === "") {
        return null;
      }
      var o = this._drawText(null, {});
      var w = this.maxWidth && this.maxWidth < o.width ? this.maxWidth : o.width;
      var x = w * Text.H_OFFSETS[this.textAlign || "left"];
      var lineHeight = this.lineHeight || this.getMeasuredLineHeight();
      var y = lineHeight * Text.V_OFFSETS[this.textBaseline || "top"];
      return this._rectangle.setValues(x, y, w, o.height);
    };
    Text.prototype.getMetrics = function getMetrics() {
      var o = {
        lines: []
      };
      o.lineHeight = this.lineHeight || this.getMeasuredLineHeight();
      o.vOffset = o.lineHeight * Text.V_OFFSETS[this.textBaseline || "top"];
      return this._drawText(null, o, o.lines);
    };
    Text.prototype.clone = function clone() {
      return this._cloneProps(new Text(this.text, this.font, this.color));
    };
    Text.prototype.toString = function toString() {
      return "[" + this.constructor.name + " (text=" + (this.text.length > 20 ? this.text.substr(0, 17) + "..." : this.text) + ")]";
    };
    Text.prototype._cloneProps = function _cloneProps(o) {
      _DisplayObject.prototype._cloneProps.call(this, o);
      o.textAlign = this.textAlign;
      o.textBaseline = this.textBaseline;
      o.maxWidth = this.maxWidth;
      o.outline = this.outline;
      o.lineHeight = this.lineHeight;
      o.lineWidth = this.lineWidth;
      return o;
    };
    Text.prototype._prepContext = function _prepContext(ctx) {
      ctx.font = this.font || "10px sans-serif";
      ctx.textAlign = this.textAlign || "left";
      ctx.textBaseline = this.textBaseline || "top";
      ctx.lineJoin = "miter";
      ctx.miterLimit = 2.5;
      return ctx;
    };
    Text.prototype._drawText = function _drawText(ctx, o, lines) {
      var paint = !!ctx;
      if (!paint) {
        ctx = Text._workingContext;
        ctx.save();
        this._prepContext(ctx);
      }
      var lineHeight = this.lineHeight || this.getMeasuredLineHeight();
      var maxW = 0, count = 0;
      var hardLines = String(this.text).split(/(?:\r\n|\r|\n)/);
      for (var _iterator = hardLines, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator](); ;) {
        var _ref;
        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }
        var str = _ref;
        var w = null;
        if (this.lineWidth != null && (w = ctx.measureText(str).width) > this.lineWidth) {
          var words = str.split(/(\s)/);
          str = words[0];
          w = ctx.measureText(str).width;
          var l = words.length;
          for (var i = 1; i < l; i += 2) {
            var wordW = ctx.measureText(words[i] + words[i + 1]).width;
            if (w + wordW > this.lineWidth) {
              if (paint) {
                this._drawTextLine(ctx, str, count * lineHeight);
              }
              if (lines) {
                lines.push(str);
              }
              if (w > maxW) {
                maxW = w;
              }
              str = words[i + 1];
              w = ctx.measureText(str).width;
              count++;
            } else {
              str += words[i] + words[i + 1];
              w += wordW;
            }
          }
        }
        if (paint) {
          this._drawTextLine(ctx, str, count * lineHeight);
        }
        if (lines) {
          lines.push(str);
        }
        if (o && w == null) {
          w = ctx.measureText(str).width;
        }
        if (w > maxW) {
          maxW = w;
        }
        count++;
      }
      if (o) {
        o.width = maxW;
        o.height = count * lineHeight;
      }
      if (!paint) {
        ctx.restore();
      }
      return o;
    };
    Text.prototype._drawTextLine = function _drawTextLine(ctx, text, y) {
      if (this.outline) {
        ctx.strokeText(text, 0, y, this.maxWidth || 65535);
      } else {
        ctx.fillText(text, 0, y, this.maxWidth || 65535);
      }
    };
    Text.prototype._getMeasuredWidth = function _getMeasuredWidth(text) {
      var ctx = Text._workingContext;
      ctx.save();
      var w = this._prepContext(ctx).measureText(text).width;
      ctx.restore();
      return w;
    };
    createClass(Text, null, [ {
      key: "H_OFFSETS",
      get: function get() {
        return _H_OFFSETS;
      }
    }, {
      key: "V_OFFSETS",
      get: function get() {
        return _V_OFFSETS;
      }
    } ]);
    return Text;
  }(DisplayObject);
  {
    var canvas = createjs && createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas");
    if (canvas.getContext) {
      Text._workingContext = canvas.getContext("2d");
      canvas.width = canvas.height = 1;
    }
  }
  var AlphaMapFilter = function(_Filter) {
    inherits(AlphaMapFilter, _Filter);
    function AlphaMapFilter(alphaMap) {
      classCallCheck(this, AlphaMapFilter);
      var _this = possibleConstructorReturn(this, _Filter.call(this));
      _this.alphaMap = alphaMap;
      _this._alphaMap = null;
      _this._mapData = null;
      _this._mapTexture = null;
      _this.FRAG_SHADER_BODY = "\n\t\t\tuniform sampler2D uAlphaSampler;\n\n\t\t\tvoid main (void) {\n\t\t\t\tvec4 color = texture2D(uSampler, vRenderCoord);\n\t\t\t\tvec4 alphaMap = texture2D(uAlphaSampler, vTextureCoord);\n\n\t\t\t\t// some image formats can have transparent white rgba(1,1,1, 0) when put on the GPU, this means we need a slight tweak\n\t\t\t\t// using ceil ensure that the colour will be used so long as it exists but pure transparency will be treated black\n\t\t\t\tgl_FragColor = vec4(color.rgb, color.a * (alphaMap.r * ceil(alphaMap.a)));\n\t\t\t}\n\t\t";
      return _this;
    }
    AlphaMapFilter.prototype.shaderParamSetup = function shaderParamSetup(gl, stage, shaderProgram) {
      if (!this._mapTexture) {
        this._mapTexture = gl.createTexture();
      }
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, this._mapTexture);
      stage.setTextureParams(gl);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.alphaMap);
      gl.uniform1i(gl.getUniformLocation(shaderProgram, "uAlphaSampler"), 1);
    };
    AlphaMapFilter.prototype.clone = function clone() {
      var o = new AlphaMapFilter(this.alphaMap);
      o._alphaMap = this._alphaMap;
      o._mapData = this._mapData;
      return o;
    };
    AlphaMapFilter.prototype._applyFilter = function _applyFilter(imageData) {
      if (!this.alphaMap) {
        return true;
      }
      if (!this._prepAlphaMap()) {
        return false;
      }
      var data = imageData.data;
      var map = this._mapData;
      var l = data.length;
      for (var i = 0; i < l; i += 4) {
        data[i + 3] = map[i] || 0;
      }
      return true;
    };
    AlphaMapFilter.prototype._prepAlphaMap = function _prepAlphaMap() {
      if (!this.alphaMap) {
        return false;
      }
      if (this.alphaMap === this._alphaMap && this._mapData) {
        return true;
      }
      this._mapData = null;
      var map = this._alphaMap = this.alphaMap;
      var canvas = map;
      var ctx = void 0;
      if (map instanceof HTMLCanvasElement) {
        ctx = canvas.getContext("2d");
      } else {
        canvas = createjs && createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas");
        canvas.width = map.width;
        canvas.height = map.height;
        ctx = canvas.getContext("2d");
        ctx.drawImage(map, 0, 0);
      }
      try {
        this._mapData = ctx.getImageData(0, 0, map.width, map.height).data;
        return true;
      } catch (e) {
        return false;
      }
    };
    return AlphaMapFilter;
  }(Filter);
  var AlphaMaskFilter = function(_Filter) {
    inherits(AlphaMaskFilter, _Filter);
    function AlphaMaskFilter(mask) {
      classCallCheck(this, AlphaMaskFilter);
      var _this = possibleConstructorReturn(this, _Filter.call(this));
      _this.mask = mask;
      _this.usesContext = true;
      _this.FRAG_SHADER_BODY = "\n\t\t\tuniform sampler2D uAlphaSampler;\n\n\t\t\tvoid main (void) {\n\t\t\t\tvec4 color = texture2D(uSampler, vRenderCoord);\n\t\t\t\tvec4 alphaMap = texture2D(uAlphaSampler, vTextureCoord);\n\n\t\t\t\tgl_FragColor = vec4(color.rgb, color.a * alphaMap.a);\n\t\t\t}\n\t\t";
      return _this;
    }
    AlphaMaskFilter.prototype.applyFilter = function applyFilter(ctx, x, y, width, height, targetCtx, targetX, targetY) {
      if (!this.mask) {
        return true;
      }
      targetCtx = targetCtx || ctx;
      if (targetX == null) {
        targetX = x;
      }
      if (targetY == null) {
        targetY = y;
      }
      targetCtx.save();
      if (ctx != targetCtx) {
        return false;
      }
      targetCtx.globalCompositeOperation = "destination-in";
      targetCtx.drawImage(this.mask, targetX, targetY);
      targetCtx.restore();
      return true;
    };
    AlphaMaskFilter.prototype.clone = function clone() {
      return new AlphaMaskFilter(this.mask);
    };
    AlphaMaskFilter.prototype.shaderParamSetup = function shaderParamSetup(gl, stage, shaderProgram) {
      if (!this._mapTexture) {
        this._mapTexture = gl.createTexture();
      }
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, this._mapTexture);
      stage.setTextureParams(gl);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.mask);
      gl.uniform1i(gl.getUniformLocation(shaderProgram, "uAlphaSampler"), 1);
    };
    return AlphaMaskFilter;
  }(Filter);
  var _MUL_TABLE = [ 1, 171, 205, 293, 57, 373, 79, 137, 241, 27, 391, 357, 41, 19, 283, 265, 497, 469, 443, 421, 25, 191, 365, 349, 335, 161, 155, 149, 9, 278, 269, 261, 505, 245, 475, 231, 449, 437, 213, 415, 405, 395, 193, 377, 369, 361, 353, 345, 169, 331, 325, 319, 313, 307, 301, 37, 145, 285, 281, 69, 271, 267, 263, 259, 509, 501, 493, 243, 479, 118, 465, 459, 113, 446, 55, 435, 429, 423, 209, 413, 51, 403, 199, 393, 97, 3, 379, 375, 371, 367, 363, 359, 355, 351, 347, 43, 85, 337, 333, 165, 327, 323, 5, 317, 157, 311, 77, 305, 303, 75, 297, 294, 73, 289, 287, 71, 141, 279, 277, 275, 68, 135, 67, 133, 33, 262, 260, 129, 511, 507, 503, 499, 495, 491, 61, 121, 481, 477, 237, 235, 467, 232, 115, 457, 227, 451, 7, 445, 221, 439, 218, 433, 215, 427, 425, 211, 419, 417, 207, 411, 409, 203, 202, 401, 399, 396, 197, 49, 389, 387, 385, 383, 95, 189, 47, 187, 93, 185, 23, 183, 91, 181, 45, 179, 89, 177, 11, 175, 87, 173, 345, 343, 341, 339, 337, 21, 167, 83, 331, 329, 327, 163, 81, 323, 321, 319, 159, 79, 315, 313, 39, 155, 309, 307, 153, 305, 303, 151, 75, 299, 149, 37, 295, 147, 73, 291, 145, 289, 287, 143, 285, 71, 141, 281, 35, 279, 139, 69, 275, 137, 273, 17, 271, 135, 269, 267, 133, 265, 33, 263, 131, 261, 130, 259, 129, 257, 1 ];
  var _SHG_TABLE = [ 0, 9, 10, 11, 9, 12, 10, 11, 12, 9, 13, 13, 10, 9, 13, 13, 14, 14, 14, 14, 10, 13, 14, 14, 14, 13, 13, 13, 9, 14, 14, 14, 15, 14, 15, 14, 15, 15, 14, 15, 15, 15, 14, 15, 15, 15, 15, 15, 14, 15, 15, 15, 15, 15, 15, 12, 14, 15, 15, 13, 15, 15, 15, 15, 16, 16, 16, 15, 16, 14, 16, 16, 14, 16, 13, 16, 16, 16, 15, 16, 13, 16, 15, 16, 14, 9, 16, 16, 16, 16, 16, 16, 16, 16, 16, 13, 14, 16, 16, 15, 16, 16, 10, 16, 15, 16, 14, 16, 16, 14, 16, 16, 14, 16, 16, 14, 15, 16, 16, 16, 14, 15, 14, 15, 13, 16, 16, 15, 17, 17, 17, 17, 17, 17, 14, 15, 17, 17, 16, 16, 17, 16, 15, 17, 16, 17, 11, 17, 16, 17, 16, 17, 16, 17, 17, 16, 17, 17, 16, 17, 17, 16, 16, 17, 17, 17, 16, 14, 17, 17, 17, 17, 15, 16, 14, 16, 15, 16, 13, 16, 15, 16, 14, 16, 15, 16, 12, 16, 15, 16, 17, 17, 17, 17, 17, 13, 16, 15, 17, 17, 17, 16, 15, 17, 17, 17, 16, 15, 17, 17, 14, 16, 17, 17, 16, 17, 17, 16, 15, 17, 16, 14, 17, 16, 15, 17, 16, 17, 17, 16, 17, 15, 16, 17, 14, 17, 16, 15, 17, 16, 17, 13, 17, 16, 17, 17, 16, 17, 14, 17, 16, 17, 16, 17, 16, 17, 9 ];
  var BlurFilter = function(_Filter) {
    inherits(BlurFilter, _Filter);
    function BlurFilter() {
      var blurX = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var blurY = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var quality = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
      classCallCheck(this, BlurFilter);
      var _this = possibleConstructorReturn(this, _Filter.call(this));
      _this._blurX = blurX;
      _this._blurXTable = [];
      _this._lastBlurX = null;
      _this._blurY = blurY;
      _this._blurYTable = [];
      _this._lastBlurY = null;
      _this._quality = isNaN(quality) || quality < 1 ? 1 : quality;
      _this._lastQuality = null;
      _this.quality = _this._quality | 0;
      _this.FRAG_SHADER_TEMPLATE = "\n\t\t\tuniform float xWeight[{{blurX}}];\n\t\t\tuniform float yWeight[{{blurY}}];\n\t\t\tuniform vec2 textureOffset;\n\t\t\tvoid main (void) {\n\t\t\t\tvec4 color = vec4(0.0);\n\n\t\t\t\tfloat xAdj = ({{blurX}}.0-1.0)/2.0;\n\t\t\t\tfloat yAdj = ({{blurY}}.0-1.0)/2.0;\n\t\t\t\tvec2 sampleOffset;\n\n\t\t\t\tfor(int i=0; i<{{blurX}}; i++) {\n\t\t\t\t\tfor(int j=0; j<{{blurY}}; j++) {\n\t\t\t\t\t\tsampleOffset = vRenderCoord + (textureOffset * vec2(float(i)-xAdj, float(j)-yAdj));\n\t\t\t\t\t\tcolor += texture2D(uSampler, sampleOffset) * (xWeight[i] * yWeight[j]);\n\t\t\t\t\t}\n\t\t\t\t}\n\n\t\t\t\tgl_FragColor = color.rgba;\n\t\t\t}\n\t\t";
      return _this;
    }
    BlurFilter.prototype.shaderParamSetup = function shaderParamSetup(gl, stage, shaderProgram) {
      gl.uniform1fv(gl.getUniformLocation(shaderProgram, "xWeight"), this._blurXTable);
      gl.uniform1fv(gl.getUniformLocation(shaderProgram, "yWeight"), this._blurYTable);
      gl.uniform2f(gl.getUniformLocation(shaderProgram, "textureOffset"), 2 / (stage._viewportWidth * this._quality), 2 / (stage._viewportHeight * this._quality));
    };
    BlurFilter.prototype.getBounds = function getBounds(rect) {
      var x = this.blurX | 0, y = this.blurY | 0;
      if (x <= 0 && y <= 0) {
        return rect;
      }
      var q = Math.pow(this.quality, .2);
      return (rect || new Rectangle()).pad(y * q + 1, x * q + 1, y * q + 1, x * q + 1);
    };
    BlurFilter.prototype.clone = function clone() {
      return new BlurFilter(this.blurX, this.blurY, this.quality);
    };
    BlurFilter.prototype._updateShader = function _updateShader() {
      var result = this.FRAG_SHADER_TEMPLATE;
      result = result.replace(/{{blurX}}/g, this._blurXTable.length.toFixed(0));
      result = result.replace(/{{blurY}}/g, this._blurYTable.length.toFixed(0));
      this.FRAG_SHADER_BODY = result;
    };
    BlurFilter.prototype._getTable = function _getTable(spread) {
      var EDGE = 4.2;
      if (spread <= 1) {
        return [ 1 ];
      }
      var result = [];
      var count = Math.ceil(spread * 2);
      count += count % 2 ? 0 : 1;
      var adjust = count / 2 | 0;
      for (var i = -adjust; i <= adjust; i++) {
        var x = i / adjust * EDGE;
        result.push(1 / Math.sqrt(2 * Math.PI) * Math.pow(Math.E, -(Math.pow(x, 2) / 4)));
      }
      var factor = result.reduce(function(a, b) {
        return a + b;
      }, 0);
      return result.map(function(currentValue) {
        return currentValue / factor;
      });
    };
    BlurFilter.prototype._applyFilter = function _applyFilter(imageData) {
      var radiusX = this._blurX >> 1;
      if (isNaN(radiusX) || radiusX < 0) return false;
      var radiusY = this._blurY >> 1;
      if (isNaN(radiusY) || radiusY < 0) return false;
      if (radiusX === 0 && radiusY === 0) return false;
      var iterations = this.quality;
      if (isNaN(iterations) || iterations < 1) iterations = 1;
      iterations |= 0;
      if (iterations > 3) iterations = 3;
      if (iterations < 1) iterations = 1;
      var px = imageData.data;
      var x = 0, y = 0, i = 0, p = 0, yp = 0, yi = 0, yw = 0, r = 0, g = 0, b = 0, a = 0, pr = 0, pg = 0, pb = 0, pa = 0;
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
        };
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
        };
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
        for (y = h; --y > -1; ) {
          r = rxp1 * (pr = px[yi | 0]);
          g = rxp1 * (pg = px[yi + 1 | 0]);
          b = rxp1 * (pb = px[yi + 2 | 0]);
          a = rxp1 * (pa = px[yi + 3 | 0]);
          sx = ssx;
          for (i = rxp1; --i > -1; ) {
            sx.r = pr;
            sx.g = pg;
            sx.b = pb;
            sx.a = pa;
            sx = sx.n;
          }
          for (i = 1; i < rxp1; i++) {
            p = yi + ((w1 < i ? w1 : i) << 2) | 0;
            r += sx.r = px[p];
            g += sx.g = px[p + 1];
            b += sx.b = px[p + 2];
            a += sx.a = px[p + 3];
            sx = sx.n;
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
            si = si.n;
          }
          yw += w;
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
            sy = sy.n;
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
              yp += w;
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
                px[p + 2] = b * ms >>> ss;
              } else {
                px[p] = px[p + 1] = px[p + 2] = 0;
              }
              p = x + ((p = y + ryp1) < h1 ? p : h1) * w << 2;
              r -= si.r - (si.r = px[p]);
              g -= si.g - (si.g = px[p + 1]);
              b -= si.b - (si.b = px[p + 2]);
              a -= si.a - (si.a = px[p + 3]);
              si = si.n;
              yi += w;
            }
          } else {
            for (y = 0; y < h; y++) {
              p = yi << 2;
              px[p + 3] = pa = a * ms >>> ss;
              if (pa > 0) {
                pa = 255 / pa;
                px[p] = (r * ms >>> ss) * pa;
                px[p + 1] = (g * ms >>> ss) * pa;
                px[p + 2] = (b * ms >>> ss) * pa;
              } else {
                px[p] = px[p + 1] = px[p + 2] = 0;
              }
              p = x + ((p = y + ryp1) < h1 ? p : h1) * w << 2;
              r -= si.r - (si.r = px[p]);
              g -= si.g - (si.g = px[p + 1]);
              b -= si.b - (si.b = px[p + 2]);
              a -= si.a - (si.a = px[p + 3]);
              si = si.n;
              yi += w;
            }
          }
        }
      }
      return true;
    };
    createClass(BlurFilter, [ {
      key: "blurX",
      get: function get() {
        return this._blurX;
      },
      set: function set(blurX) {
        if (isNaN(blurX) || blurX < 0) {
          blurX = 0;
        }
        this._blurX = blurX;
      }
    }, {
      key: "blurY",
      get: function get() {
        return this._blurY;
      },
      set: function set(blurY) {
        if (isNaN(blurY) || blurY < 0) {
          blurY = 0;
        }
        this._blurY = blurY;
      }
    }, {
      key: "quality",
      get: function get() {
        return this._quality;
      },
      set: function set(quality) {
        if (isNaN(quality) || quality < 0) {
          quality = 0;
        }
        this._quality = quality | 0;
      }
    }, {
      key: "_buildShader",
      get: function get() {
        var xChange = this._lastBlurX !== this._blurX;
        var yChange = this._lastBlurY !== this._blurY;
        var qChange = this._lastQuality !== this._quality;
        if (xChange || yChange || qChange) {
          if (xChange || qChange) {
            this._blurXTable = this._getTable(this._blurX * this._quality);
          }
          if (yChange || qChange) {
            this._blurYTable = this._getTable(this._blurY * this._quality);
          }
          this._updateShader();
          this._lastBlurX = this._blurX;
          this._lastBlurY = this._blurY;
          this._lastQuality = this._quality;
          return undefined;
        }
        return this._compiledShader;
      }
    }, {
      key: "_builtShader",
      set: function set(value) {
        this._compiledShader;
      }
    } ], [ {
      key: "MUL_TABLE",
      get: function get() {
        return _MUL_TABLE;
      }
    }, {
      key: "SHG_TABLE",
      get: function get() {
        return _SHG_TABLE;
      }
    } ]);
    return BlurFilter;
  }(Filter);
  var ColorFilter = function(_Filter) {
    inherits(ColorFilter, _Filter);
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
      var _this = possibleConstructorReturn(this, _Filter.call(this));
      _this.redMultiplier = redMultiplier;
      _this.greenMultiplier = greenMultiplier;
      _this.blueMultiplier = blueMultiplier;
      _this.alphaMultiplier = alphaMultiplier;
      _this.redOffset = redOffset;
      _this.greenOffset = greenOffset;
      _this.blueOffset = blueOffset;
      _this.alphaOffset = alphaOffset;
      _this.FRAG_SHADER_BODY = "\n\t\t\tuniform vec4 uColorMultiplier;\n\t\t\tuniform vec4 uColorOffset;\n\n\t\t\tvoid main (void) {\n\t\t\t\tvec4 color = texture2D(uSampler, vRenderCoord);\n\n\t\t\t\tgl_FragColor = (color * uColorMultiplier) + uColorOffset;\n\t\t\t}\n\t\t";
      return _this;
    }
    ColorFilter.prototype.shaderParamSetup = function shaderParamSetup(gl, stage, shaderProgram) {
      gl.uniform4f(gl.getUniformLocation(shaderProgram, "uColorMultiplier"), this.redMultiplier, this.greenMultiplier, this.blueMultiplier, this.alphaMultiplier);
      gl.uniform4f(gl.getUniformLocation(shaderProgram, "uColorOffset"), this.redOffset / 255, this.greenOffset / 255, this.blueOffset / 255, this.alphaOffset / 255);
    };
    ColorFilter.prototype.clone = function clone() {
      return new ColorFilter(this.redMultiplier, this.greenMultiplier, this.blueMultiplier, this.alphaMultiplier, this.redOffset, this.greenOffset, this.blueOffset, this.alphaOffset);
    };
    ColorFilter.prototype._applyFilter = function _applyFilter(imageData) {
      var data = imageData.data;
      var l = data.length;
      for (var i = 0; i < l; i += 4) {
        data[i] = data[i] * this.redMultiplier + this.redOffset;
        data[i + 1] = data[i + 1] * this.greenMultiplier + this.greenOffset;
        data[i + 2] = data[i + 2] * this.blueMultiplier + this.blueOffset;
        data[i + 3] = data[i + 3] * this.alphaMultiplier + this.alphaOffset;
      }
      return true;
    };
    return ColorFilter;
  }(Filter);
  var _DELTA_INDEX = [ 0, .01, .02, .04, .05, .06, .07, .08, .1, .11, .12, .14, .15, .16, .17, .18, .2, .21, .22, .24, .25, .27, .28, .3, .32, .34, .36, .38, .4, .42, .44, .46, .48, .5, .53, .56, .59, .62, .65, .68, .71, .74, .77, .8, .83, .86, .89, .92, .95, .98, 1, 1.06, 1.12, 1.18, 1.24, 1.3, 1.36, 1.42, 1.48, 1.54, 1.6, 1.66, 1.72, 1.78, 1.84, 1.9, 1.96, 2, 2.12, 2.25, 2.37, 2.5, 2.62, 2.75, 2.87, 3, 3.2, 3.4, 3.6, 3.8, 4, 4.3, 4.7, 4.9, 5, 5.5, 6, 6.5, 6.8, 7, 7.3, 7.5, 7.8, 8, 8.4, 8.7, 9, 9.4, 9.6, 9.8, 10 ];
  var _IDENTITY_MATRIX = [ 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1 ];
  var _LENGTH = 25;
  var ColorMatrix = function() {
    function ColorMatrix(brightness, contrast, saturation, hue) {
      classCallCheck(this, ColorMatrix);
      this.setColor(brightness, contrast, saturation, hue);
    }
    ColorMatrix.prototype.setColor = function setColor(brightness, contrast, saturation, hue) {
      return this.reset().adjustColor(brightness, contrast, saturation, hue);
    };
    ColorMatrix.prototype.reset = function reset() {
      return this.copy(ColorMatrix.IDENTITY_MATRIX);
    };
    ColorMatrix.prototype.adjustColor = function adjustColor(brightness, contrast, saturation, hue) {
      this.adjustHue(hue);
      this.adjustContrast(contrast);
      this.adjustBrightness(brightness);
      return this.adjustSaturation(saturation);
    };
    ColorMatrix.prototype.adjustBrightness = function adjustBrightness(value) {
      if (value === 0 || isNaN(value)) {
        return this;
      }
      value = this._cleanValue(value, 255);
      this._multiplyMatrix([ 1, 0, 0, 0, value, 0, 1, 0, 0, value, 0, 0, 1, 0, value, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1 ]);
      return this;
    };
    ColorMatrix.prototype.adjustContrast = function adjustContrast(value) {
      if (value === 0 || isNaN(value)) {
        return this;
      }
      value = this._cleanValue(value, 100);
      var x = void 0;
      if (value < 0) {
        x = 127 + value / 100 * 127;
      } else {
        x = value % 1;
        if (x === 0) {
          x = ColorMatrix.DELTA_INDEX[value];
        } else {
          x = ColorMatrix.DELTA_INDEX[value << 0] * (1 - x) + ColorMatrix.DELTA_INDEX[(value << 0) + 1] * x;
        }
        x = x * 127 + 127;
      }
      this._multiplyMatrix([ x / 127, 0, 0, 0, .5 * (127 - x), 0, x / 127, 0, 0, .5 * (127 - x), 0, 0, x / 127, 0, .5 * (127 - x), 0, 0, 0, 1, 0, 0, 0, 0, 0, 1 ]);
      return this;
    };
    ColorMatrix.prototype.adjustSaturation = function adjustSaturation(value) {
      if (value === 0 || isNaN(value)) {
        return this;
      }
      value = this._cleanValue(value, 100);
      var x = 1 + (value > 0 ? 3 * value / 100 : value / 100);
      var lumR = .3086;
      var lumG = .6094;
      var lumB = .082;
      this._multiplyMatrix([ lumR * (1 - x) + x, lumG * (1 - x), lumB * (1 - x), 0, 0, lumR * (1 - x), lumG * (1 - x) + x, lumB * (1 - x), 0, 0, lumR * (1 - x), lumG * (1 - x), lumB * (1 - x) + x, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1 ]);
      return this;
    };
    ColorMatrix.prototype.adjustHue = function adjustHue(value) {
      if (value === 0 || isNaN(value)) {
        return this;
      }
      value = this._cleanValue(value, 180) / 180 * Math.PI;
      var cosVal = Math.cos(value);
      var sinVal = Math.sin(value);
      var lumR = .213;
      var lumG = .715;
      var lumB = .072;
      this._multiplyMatrix([ lumR + cosVal * (1 - lumR) + sinVal * -lumR, lumG + cosVal * -lumG + sinVal * -lumG, lumB + cosVal * -lumB + sinVal * (1 - lumB), 0, 0, lumR + cosVal * -lumR + sinVal * .143, lumG + cosVal * (1 - lumG) + sinVal * .14, lumB + cosVal * -lumB + sinVal * -.283, 0, 0, lumR + cosVal * -lumR + sinVal * -(1 - lumR), lumG + cosVal * -lumG + sinVal * lumG, lumB + cosVal * (1 - lumB) + sinVal * lumB, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1 ]);
      return this;
    };
    ColorMatrix.prototype.concat = function concat(matrix) {
      matrix = this._fixMatrix(matrix);
      if (matrix.length != ColorMatrix.LENGTH) {
        return this;
      }
      this._multiplyMatrix(matrix);
      return this;
    };
    ColorMatrix.prototype.clone = function clone() {
      return new ColorMatrix().copy(this);
    };
    ColorMatrix.prototype.toArray = function toArray() {
      var arr = [];
      var l = ColorMatrix.LENGTH;
      for (var i = 0; i < l; i++) {
        arr[i] = this[i];
      }
      return arr;
    };
    ColorMatrix.prototype.copy = function copy(matrix) {
      var l = ColorMatrix.LENGTH;
      for (var i = 0; i < l; i++) {
        this[i] = matrix[i];
      }
      return this;
    };
    ColorMatrix.prototype.toString = function toString() {
      return "[" + this.constructor.name + "]";
    };
    ColorMatrix.prototype._multiplyMatrix = function _multiplyMatrix(matrix) {
      var col = [];
      for (var i = 0; i < 5; i++) {
        for (var j = 0; j < 5; j++) {
          col[j] = this[j + i * 5];
        }
        for (var _j = 0; _j < 5; _j++) {
          var val = 0;
          for (var k = 0; k < 5; k++) {
            val += matrix[_j + k * 5] * col[k];
          }
          this[_j + i * 5] = val;
        }
      }
    };
    ColorMatrix.prototype._cleanValue = function _cleanValue(value, limit) {
      return Math.min(limit, Math.max(-limit, value));
    };
    ColorMatrix.prototype._fixMatrix = function _fixMatrix(matrix) {
      if (matrix instanceof ColorMatrix) {
        matrix = matrix.toArray();
      }
      if (matrix.length < ColorMatrix.LENGTH) {
        matrix = matrix.slice(0, matrix.length).concat(ColorMatrix.IDENTITY_MATRIX.slice(matrix.length, ColorMatrix.LENGTH));
      } else if (matrix.length > ColorMatrix.LENGTH) {
        matrix = matrix.slice(0, ColorMatrix.LENGTH);
      }
      return matrix;
    };
    createClass(ColorMatrix, null, [ {
      key: "DELTA_INDEX",
      get: function get() {
        return _DELTA_INDEX;
      }
    }, {
      key: "IDENTITY_MATRIX",
      get: function get() {
        return _IDENTITY_MATRIX;
      }
    }, {
      key: "LENGTH",
      get: function get() {
        return _LENGTH;
      }
    } ]);
    return ColorMatrix;
  }();
  var ColorMatrixFilter = function(_Filter) {
    inherits(ColorMatrixFilter, _Filter);
    function ColorMatrixFilter(matrix) {
      classCallCheck(this, ColorMatrixFilter);
      var _this = possibleConstructorReturn(this, _Filter.call(this));
      _this.matrix = matrix;
      _this.FRAG_SHADER_BODY = "\n\t\t\tuniform mat4 uColorMatrix;\n\t\t\tuniform vec4 uColorMatrixOffset;\n\n\t\t\tvoid main (void) {\n\t\t\t\tvec4 color = texture2D(uSampler, vRenderCoord);\n\n\t\t\t\tmat4 m = uColorMatrix;\n\t\t\t\tvec4 newColor = vec4(0,0,0,0);\n\t\t\t\tnewColor.r = color.r*m[0][0] + color.g*m[0][1] + color.b*m[0][2] + color.a*m[0][3];\n\t\t\t\tnewColor.g = color.r*m[1][0] + color.g*m[1][1] + color.b*m[1][2] + color.a*m[1][3];\n\t\t\t\tnewColor.b = color.r*m[2][0] + color.g*m[2][1] + color.b*m[2][2] + color.a*m[2][3];\n\t\t\t\tnewColor.a = color.r*m[3][0] + color.g*m[3][1] + color.b*m[3][2] + color.a*m[3][3];\n\n\t\t\t\tgl_FragColor = newColor + uColorMatrixOffset;\n\t\t\t}\n\t\t";
      return _this;
    }
    ColorMatrixFilter.prototype.shaderParamSetup = function shaderParamSetup(gl, stage, shaderProgram) {
      var mat = this.matrix;
      var colorMatrix = new Float32Array([ mat[0], mat[1], mat[2], mat[3], mat[5], mat[6], mat[7], mat[8], mat[10], mat[11], mat[12], mat[13], mat[15], mat[16], mat[17], mat[18] ]);
      gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "uColorMatrix"), false, colorMatrix);
      gl.uniform4f(gl.getUniformLocation(shaderProgram, "uColorMatrixOffset"), mat[4] / 255, mat[9] / 255, mat[14] / 255, mat[19] / 255);
    };
    ColorMatrixFilter.prototype.clone = function clone() {
      return new ColorMatrixFilter(this.matrix);
    };
    ColorMatrixFilter.prototype._applyFilter = function _applyFilter(imageData) {
      var data = imageData.data;
      var l = data.length;
      var r = void 0, g = void 0, b = void 0, a = void 0;
      var mtx = this.matrix;
      var m0 = mtx[0], m1 = mtx[1], m2 = mtx[2], m3 = mtx[3], m4 = mtx[4];
      var m5 = mtx[5], m6 = mtx[6], m7 = mtx[7], m8 = mtx[8], m9 = mtx[9];
      var m10 = mtx[10], m11 = mtx[11], m12 = mtx[12], m13 = mtx[13], m14 = mtx[14];
      var m15 = mtx[15], m16 = mtx[16], m17 = mtx[17], m18 = mtx[18], m19 = mtx[19];
      for (var i = 0; i < l; i += 4) {
        r = data[i];
        g = data[i + 1];
        b = data[i + 2];
        a = data[i + 3];
        data[i] = r * m0 + g * m1 + b * m2 + a * m3 + m4;
        data[i + 1] = r * m5 + g * m6 + b * m7 + a * m8 + m9;
        data[i + 2] = r * m10 + g * m11 + b * m12 + a * m13 + m14;
        data[i + 3] = r * m15 + g * m16 + b * m17 + a * m18 + m19;
      }
      return true;
    };
    return ColorMatrixFilter;
  }(Filter);
  var ButtonHelper = function() {
    function ButtonHelper(target) {
      var outLabel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "out";
      var overLabel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "over";
      var downLabel = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "down";
      var play = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
      var hitArea = arguments[5];
      var hitLabel = arguments[6];
      classCallCheck(this, ButtonHelper);
      if (!target.addEventListener) {
        return;
      }
      this.target = target;
      this.overLabel = overLabel;
      this.outLabel = outLabel;
      this.downLabel = downLabel == null;
      this.play = play;
      this._isPressed = false;
      this._isOver = false;
      this._enabled = false;
      target.mouseChildren = false;
      this.enabled = true;
      this.handleEvent({});
      if (hitArea) {
        if (hitLabel) {
          hitArea.actionsEnabled = false;
          hitArea.gotoAndStop && hitArea.gotoAndStop(hitLabel);
        }
        target.hitArea = hitArea;
      }
    }
    ButtonHelper.prototype.toString = function toString() {
      return "[" + this.constructor.name + "]";
    };
    ButtonHelper.prototype.handleEvent = function handleEvent(evt) {
      var label = void 0, t = this.target, type = evt.type;
      if (type === "mousedown") {
        this._isPressed = true;
        label = this.downLabel;
      } else if (type === "pressup") {
        this._isPressed = false;
        label = this._isOver ? this.overLabel : this.outLabel;
      } else if (type === "rollover") {
        this._isOver = true;
        label = this._isPressed ? this.downLabel : this.overLabel;
      } else {
        this._isOver = false;
        label = this._isPressed ? this.overLabel : this.outLabel;
      }
      if (this.play) {
        t.gotoAndPlay && t.gotoAndPlay(label);
      } else {
        t.gotoAndStop && t.gotoAndStop(label);
      }
    };
    ButtonHelper.prototype._reset = function _reset() {
      var p = this.paused;
      this.__reset();
      this.paused = p;
    };
    createClass(ButtonHelper, [ {
      key: "enabled",
      get: function get() {
        return this._enabled;
      },
      set: function set(enabled) {
        if (enabled === this._enabled) {
          return;
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
            o._reset = this._reset;
          }
        } else {
          o.cursor = null;
          o.removeEventListener("rollover", this);
          o.removeEventListener("rollout", this);
          o.removeEventListener("mousedown", this);
          o.removeEventListener("pressup", this);
          if (o.__reset) {
            o._reset = o.__reset;
            delete o.__reset;
          }
        }
      }
    } ]);
    return ButtonHelper;
  }();
  var Touch = function() {
    function Touch() {
      classCallCheck(this, Touch);
      throw "Touch cannot be instantiated";
    }
    Touch.isSupported = function isSupported() {
      return !!("ontouchstart" in window || window.navigator["msPointerEnabled"] && window.navigator["msMaxTouchPoints"] > 0 || window.navigator["pointerEnabled"] && window.navigator["maxTouchPoints"] > 0);
    };
    Touch.enable = function enable(stage) {
      var singleTouch = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var allowDefault = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      if (!stage || !stage.canvas || !Touch.isSupported()) {
        return false;
      }
      if (stage.__touch) {
        return true;
      }
      stage.__touch = {
        pointers: {},
        multitouch: !singleTouch,
        preventDefault: !allowDefault,
        count: 0
      };
      if ("ontouchstart" in window) {
        Touch._IOS_enable(stage);
      } else if (window.navigator["msPointerEnabled"] || window.navigator["pointerEnabled"]) {
        Touch._IE_enable(stage);
      }
      return true;
    };
    Touch.disable = function disable(stage) {
      if (!stage) {
        return;
      }
      if ("ontouchstart" in window) {
        Touch._IOS_disable(stage);
      } else if (window.navigator["msPointerEnabled"] || window.navigator["pointerEnabled"]) {
        Touch._IE_disable(stage);
      }
      delete stage.__touch;
    };
    Touch._IOS_enable = function _IOS_enable(stage) {
      var canvas = stage.canvas;
      var f = stage.__touch.f = function(e) {
        return Touch._IOS_handleEvent(stage, e);
      };
      canvas.addEventListener("touchstart", f, false);
      canvas.addEventListener("touchmove", f, false);
      canvas.addEventListener("touchend", f, false);
      canvas.addEventListener("touchcancel", f, false);
    };
    Touch._IOS_disable = function _IOS_disable(stage) {
      var canvas = stage.canvas;
      if (!canvas) {
        return;
      }
      var f = stage.__touch.f;
      canvas.removeEventListener("touchstart", f, false);
      canvas.removeEventListener("touchmove", f, false);
      canvas.removeEventListener("touchend", f, false);
      canvas.removeEventListener("touchcancel", f, false);
    };
    Touch._IOS_handleEvent = function _IOS_handleEvent(stage, e) {
      if (!stage) {
        return;
      }
      if (stage.__touch.preventDefault) {
        e.preventDefault && e.preventDefault();
      }
      var touches = e.changedTouches;
      var type = e.type;
      var l = touches.length;
      for (var _iterator = touches, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator](); ;) {
        var _ref;
        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }
        var touch = _ref;
        var id = touch.identifier;
        if (touch.target != stage.canvas) {
          continue;
        }
        if (type === "touchstart") {
          this._handleStart(stage, id, e, touch.pageX, touch.pageY);
        } else if (type === "touchmove") {
          this._handleMove(stage, id, e, touch.pageX, touch.pageY);
        } else if (type === "touchend" || type === "touchcancel") {
          this._handleEnd(stage, id, e);
        }
      }
    };
    Touch._IE_enable = function _IE_enable(stage) {
      var canvas = stage.canvas;
      var f = stage.__touch.f = function(e) {
        return Touch._IE_handleEvent(stage, e);
      };
      if (window.navigator["pointerEnabled"] === undefined) {
        canvas.addEventListener("MSPointerDown", f, false);
        window.addEventListener("MSPointerMove", f, false);
        window.addEventListener("MSPointerUp", f, false);
        window.addEventListener("MSPointerCancel", f, false);
        if (stage.__touch.preventDefault) {
          canvas.style.msTouchAction = "none";
        }
      } else {
        canvas.addEventListener("pointerdown", f, false);
        window.addEventListener("pointermove", f, false);
        window.addEventListener("pointerup", f, false);
        window.addEventListener("pointercancel", f, false);
        if (stage.__touch.preventDefault) {
          canvas.style.touchAction = "none";
        }
      }
      stage.__touch.activeIDs = {};
    };
    Touch._IE_disable = function _IE_disable(stage) {
      var f = stage.__touch.f;
      if (window.navigator["pointerEnabled"] === undefined) {
        window.removeEventListener("MSPointerMove", f, false);
        window.removeEventListener("MSPointerUp", f, false);
        window.removeEventListener("MSPointerCancel", f, false);
        if (stage.canvas) {
          stage.canvas.removeEventListener("MSPointerDown", f, false);
        }
      } else {
        window.removeEventListener("pointermove", f, false);
        window.removeEventListener("pointerup", f, false);
        window.removeEventListener("pointercancel", f, false);
        if (stage.canvas) {
          stage.canvas.removeEventListener("pointerdown", f, false);
        }
      }
    };
    Touch._IE_handleEvent = function _IE_handleEvent(stage, e) {
      if (!stage) {
        return;
      }
      if (stage.__touch.preventDefault) {
        e.preventDefault && e.preventDefault();
      }
      var type = e.type;
      var id = e.pointerId;
      var ids = stage.__touch.activeIDs;
      if (type === "MSPointerDown" || type === "pointerdown") {
        if (e.srcElement != stage.canvas) {
          return;
        }
        ids[id] = true;
        this._handleStart(stage, id, e, e.pageX, e.pageY);
      } else if (ids[id]) {
        if (type === "MSPointerMove" || type === "pointermove") {
          this._handleMove(stage, id, e, e.pageX, e.pageY);
        } else if (type === "MSPointerUp" || type === "MSPointerCancel" || type === "pointerup" || type === "pointercancel") {
          delete ids[id];
          this._handleEnd(stage, id, e);
        }
      }
    };
    Touch._handleStart = function _handleStart(stage, id, e, x, y) {
      var props = stage.__touch;
      if (!props.multitouch && props.count) {
        return;
      }
      var ids = props.pointers;
      if (ids[id]) {
        return;
      }
      ids[id] = true;
      props.count++;
      stage._handlePointerDown(id, e, x, y);
    };
    Touch._handleMove = function _handleMove(stage, id, e, x, y) {
      if (!stage.__touch.pointers[id]) {
        return;
      }
      stage._handlePointerMove(id, e, x, y);
    };
    Touch._handleEnd = function _handleEnd(stage, id, e) {
      var props = stage.__touch;
      var ids = props.pointers;
      if (!ids[id]) {
        return;
      }
      props.count--;
      stage._handlePointerUp(id, e, true);
      delete ids[id];
    };
    return Touch;
  }();
  var _ERR_DIMENSIONS = "frame dimensions exceed max spritesheet dimensions";
  var _ERR_RUNNING = "a build is already running";
  var SpriteSheetBuilder = function(_EventDispatcher) {
    inherits(SpriteSheetBuilder, _EventDispatcher);
    function SpriteSheetBuilder() {
      var framerate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      classCallCheck(this, SpriteSheetBuilder);
      var _this = possibleConstructorReturn(this, _EventDispatcher.call(this));
      _this.maxWidth = 2048;
      _this.maxHeight = 2048;
      _this.spriteSheet = null;
      _this.scale = 1;
      _this.padding = 1;
      _this.timeSlice = .3;
      _this.progress = -1;
      _this.framerate = framerate;
      _this._frames = [];
      _this._animations = {};
      _this._data = null;
      _this._nextFrameIndex = 0;
      _this._index = 0;
      _this._timerID = null;
      _this._scale = 1;
      return _this;
    }
    SpriteSheetBuilder.prototype.addFrame = function addFrame(source, sourceRect) {
      var scale = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
      var setupFunction = arguments[3];
      var setupData = arguments[4];
      if (this._data) {
        throw SpriteSheetBuilder.ERR_RUNNING;
      }
      var rect = sourceRect || source.bounds || source.nominalBounds || source.getBounds && source.getBounds();
      if (!rect) {
        return null;
      }
      return this._frames.push({
        source: source,
        sourceRect: rect,
        scale: scale,
        funct: setupFunction,
        data: setupData,
        index: this._frames.length,
        height: rect.height * scale
      }) - 1;
    };
    SpriteSheetBuilder.prototype.addAnimation = function addAnimation(name, frames, next, speed) {
      if (this._data) {
        throw SpriteSheetBuilder.ERR_RUNNING;
      }
      this._animations[name] = {
        frames: frames,
        next: next,
        speed: speed
      };
    };
    SpriteSheetBuilder.prototype.addMovieClip = function addMovieClip(source, sourceRect) {
      var scale = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
      var setupFunction = arguments[3];
      var setupData = arguments[4];
      var labelFunction = arguments[5];
      if (this._data) {
        throw SpriteSheetBuilder.ERR_RUNNING;
      }
      var rects = source.frameBounds;
      var rect = sourceRect || source.bounds || source.nominalBounds || source.getBounds && source.getBounds();
      if (!rect && !rects) {
        return;
      }
      var baseFrameIndex = this._frames.length;
      var duration = source.timeline.duration;
      for (var i = 0; i < duration; i++) {
        var r = rects && rects[i] ? rects[i] : rect;
        this.addFrame(source, r, scale, this._setupMovieClipFrame, {
          i: i,
          f: setupFunction,
          d: setupData
        });
      }
      var labels = source.timeline._labels;
      var lbls = [];
      for (var n in labels) {
        lbls.push({
          index: labels[n],
          label: n
        });
      }
      if (lbls.length) {
        lbls.sort(function(a, b) {
          return a.index - b.index;
        });
        for (var _i = 0, l = lbls.length; _i < l; _i++) {
          var label = lbls[_i].label;
          var start = baseFrameIndex + lbls[_i].index;
          var end = baseFrameIndex + (_i === l - 1 ? duration : lbls[_i + 1].index);
          var frames = [];
          for (var _i2 = start; _i2 < end; _i2++) {
            frames.push(_i2);
          }
          if (labelFunction) {
            label = labelFunction(label, source, start, end);
            if (!label) {
              continue;
            }
          }
          this.addAnimation(label, frames, true);
        }
      }
    };
    SpriteSheetBuilder.prototype.build = function build() {
      if (this._data) {
        throw SpriteSheetBuilder.ERR_RUNNING;
      }
      this._startBuild();
      while (this._drawNext()) {}
      this._endBuild();
      return this.spriteSheet;
    };
    SpriteSheetBuilder.prototype.buildAsync = function buildAsync(timeSlice) {
      var _this2 = this;
      if (this._data) {
        throw SpriteSheetBuilder.ERR_RUNNING;
      }
      this.timeSlice = timeSlice;
      this._startBuild();
      this._timerID = setTimeout(function() {
        return _this2._run();
      }, 50 - Math.max(.01, Math.min(.99, this.timeSlice || .3)) * 50);
    };
    SpriteSheetBuilder.prototype.stopAsync = function stopAsync() {
      clearTimeout(this._timerID);
      this._data = null;
    };
    SpriteSheetBuilder.prototype.clone = function clone() {
      throw "SpriteSheetBuilder cannot be cloned.";
    };
    SpriteSheetBuilder.prototype.toString = function toString() {
      return "[" + this.constructor.name + "]";
    };
    SpriteSheetBuilder.prototype._startBuild = function _startBuild() {
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
      frames.sort(function(a, b) {
        return a.height <= b.height ? -1 : 1;
      });
      if (frames[frames.length - 1].height + pad * 2 > this.maxHeight) {
        throw SpriteSheetBuilder.ERR_DIMENSIONS;
      }
      var y = 0, x = 0;
      var img = 0;
      while (frames.length) {
        var o = this._fillRow(frames, y, img, dataFrames, pad);
        if (o.w > x) {
          x = o.w;
        }
        y += o.h;
        if (!o.h || !frames.length) {
          var canvas = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas");
          canvas.width = this._getSize(x, this.maxWidth);
          canvas.height = this._getSize(y, this.maxHeight);
          this._data.images[img] = canvas;
          if (!o.h) {
            x = y = 0;
            img++;
          }
        }
      }
    };
    SpriteSheetBuilder.prototype._setupMovieClipFrame = function _setupMovieClipFrame(source, data) {
      var ae = source.actionsEnabled;
      source.actionsEnabled = false;
      source.gotoAndStop(data.i);
      source.actionsEnabled = ae;
      data.f && data.f(source, data.d, data.i);
    };
    SpriteSheetBuilder.prototype._getSize = function _getSize(size, max) {
      var pow = 4;
      while (Math.pow(2, ++pow) < size) {}
      return Math.min(max, Math.pow(2, pow));
    };
    SpriteSheetBuilder.prototype._fillRow = function _fillRow(frames, y, img, dataFrames, pad) {
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
          throw SpriteSheetBuilder.ERR_DIMENSIONS;
        }
        if (rh > h || x + rw > w) {
          continue;
        }
        frame.img = img;
        frame.rect = new Rectangle(x, y, rw, rh);
        height = height || rh;
        frames.splice(i, 1);
        dataFrames[frame.index] = [ x, y, rw, rh, img, Math.round(-rx + sc * source.regX - pad), Math.round(-ry + sc * source.regY - pad) ];
        x += rw;
      }
      return {
        w: x,
        h: height
      };
    };
    SpriteSheetBuilder.prototype._endBuild = function _endBuild() {
      this.spriteSheet = new SpriteSheet(this._data);
      this._data = null;
      this.progress = 1;
      this.dispatchEvent("complete");
    };
    SpriteSheetBuilder.prototype._run = function _run() {
      var _this3 = this;
      var ts = Math.max(.01, Math.min(.99, this.timeSlice || .3)) * 50;
      var t = new Date().getTime() + ts;
      var complete = false;
      while (t > new Date().getTime()) {
        if (!this._drawNext()) {
          complete = true;
          break;
        }
      }
      if (complete) {
        this._endBuild();
      } else {
        this._timerID = setTimeout(function() {
          return _this3._run();
        }, 50 - ts);
      }
      var p = this.progress = this._index / this._frames.length;
      if (this.hasEventListener("progress")) {
        var evt = new Event("progress");
        evt.progress = p;
        this.dispatchEvent(evt);
      }
    };
    SpriteSheetBuilder.prototype._drawNext = function _drawNext() {
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
      frame.source.draw(ctx);
      ctx.restore();
      return ++this._index < this._frames.length;
    };
    createClass(SpriteSheetBuilder, null, [ {
      key: "ERR_DIMENSIONS",
      get: function get() {
        return _ERR_DIMENSIONS;
      }
    }, {
      key: "ERR_RUNNING",
      get: function get() {
        return _ERR_RUNNING;
      }
    } ]);
    return SpriteSheetBuilder;
  }(EventDispatcher);
  var SpriteSheetUtils = function() {
    function SpriteSheetUtils() {
      classCallCheck(this, SpriteSheetUtils);
      throw "SpriteSheetUtils cannot be instantiated";
    }
    SpriteSheetUtils.extractFrame = function extractFrame(spriteSheet, frameOrAnimation) {
      if (isNaN(frameOrAnimation)) {
        frameOrAnimation = spriteSheet.getAnimation(frameOrAnimation).frames[0];
      }
      var data = spriteSheet.getFrame(frameOrAnimation);
      if (!data) {
        return null;
      }
      var r = data.rect;
      var canvas = SpriteSheetUtils._workingCanvas;
      canvas.width = r.width;
      canvas.height = r.height;
      SpriteSheetUtils._workingContext.drawImage(data.image, r.x, r.y, r.width, r.height, 0, 0, r.width, r.height);
      var img = document.createElement("img");
      img.src = canvas.toDataURL("image/png");
      return img;
    };
    SpriteSheetUtils.mergeAlpha = function mergeAlpha(rgbImage, alphaImage, canvas) {
      if (!canvas) {
        canvas = createjs && createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas");
      }
      canvas.width = Math.max(alphaImage.width, rgbImage.width);
      canvas.height = Math.max(alphaImage.height, rgbImage.height);
      var ctx = canvas.getContext("2d");
      ctx.save();
      ctx.drawImage(rgbImage, 0, 0);
      ctx.globalCompositeOperation = "destination-in";
      ctx.drawImage(alphaImage, 0, 0);
      ctx.restore();
      return canvas;
    };
    SpriteSheetUtils._flip = function _flip(spriteSheet, count, h, v) {
      var imgs = spriteSheet._images;
      var canvas = SpriteSheetUtils._workingCanvas;
      var ctx = SpriteSheetUtils._workingContext;
      var il = imgs.length / count;
      for (var i = 0; i < il; i++) {
        var src = imgs[i];
        src.__tmp = i;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width + 1, canvas.height + 1);
        canvas.width = src.width;
        canvas.height = src.height;
        ctx.setTransform(h ? -1 : 1, 0, 0, v ? -1 : 1, h ? src.width : 0, v ? src.height : 0);
        ctx.drawImage(src, 0, 0);
        var img = document.createElement("img");
        img.src = canvas.toDataURL("image/png");
        img.width = src.width || src.naturalWidth;
        img.height = src.height || src.naturalHeight;
        imgs.push(img);
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
          rect.x = (_img.width || _img.naturalWidth) - rect.x - rect.width;
          frame.regX = rect.width - _src.regX;
        }
        if (v) {
          rect.y = (_img.height || _img.naturalHeight) - rect.y - rect.height;
          frame.regY = rect.height - _src.regY;
        }
        frames.push(frame);
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
          anim.next += sfx;
        }
        var _frames = _src2.frames;
        for (var _i3 = 0, l = _frames.length; _i3 < l; _i3++) {
          anim.frames.push(_frames[_i3] + fl * count);
        }
        data[anim.name] = anim;
        names.push(anim.name);
      }
    };
    return SpriteSheetUtils;
  }();
  {
    var canvas = createjs && createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas");
    if (canvas.getContext) {
      SpriteSheetUtils._workingCanvas = canvas;
      SpriteSheetUtils._workingContext = canvas.getContext("2d");
      canvas.width = canvas.height = 1;
    }
  }
  var _alternateOutput = null;
  var WebGLInspector = function(_EventDispatcher) {
    inherits(WebGLInspector, _EventDispatcher);
    function WebGLInspector(stage) {
      classCallCheck(this, WebGLInspector);
      var _this = possibleConstructorReturn(this, _EventDispatcher.call(this));
      _this._stage = stage;
      return _this;
    }
    WebGLInspector.dispProps = function dispProps(item) {
      var prepend = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
      var p = "\tP: " + item.x.toFixed(2) + "x" + item.y.toFixed(2) + "\t";
      var r = "\tR: " + item.regX.toFixed(2) + "x" + item.regY.toFixed(2) + "\t";
      WebGLInspector._log(prepend, item.toString() + "\t", p, r);
    };
    WebGLInspector._log = function _log() {
      if (WebGLInspector.alternateOutput) {
        var _WebGLInspector$alter;
        (_WebGLInspector$alter = WebGLInspector.alternateOutput).log.apply(_WebGLInspector$alter, arguments);
      } else {
        var _console;
        (_console = console).log.apply(_console, arguments);
      }
    };
    WebGLInspector.prototype.log = function log(stage) {
      if (!stage) {
        stage = this._stage;
      }
      WebGLInspector._log("Batches Per Draw: " + (stage._batchID / stage._drawID).toFixed(4));
      this.logContextInfo(stage._webGLContext);
      this.logDepth(stage.children, "");
      this.logTextureFill(stage);
    };
    WebGLInspector.prototype.toggleGPUDraw = function toggleGPUDraw(stage, enabled) {
      if (!stage) {
        stage = this._stage;
      }
      if (enabled === undefined) {
        enabled = !!stage._drawBuffers_;
      }
      if (enabled && stage._drawBuffers_) {
        stage._drawBuffers = stage._drawBuffers_;
        stage._drawBuffers_ = undefined;
      } else {
        stage._drawBuffers_ = stage._drawBuffers;
        stage._drawBuffers = function _inspectorDrawBuffers(gl) {
          if (this.vocalDebug) {
            WebGLInspector._log("BlankDraw[" + this._drawID + ":" + this._batchID + "] : " + this.batchReason);
          }
        };
      }
    };
    WebGLInspector.prototype.logDepth = function logDepth(children) {
      var prepend = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
      var logFunc = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : WebGLInspector._log;
      if (!children) {
        children = this._stage.children;
      }
      var l = children.length;
      for (var i = 0; i < l; i++) {
        var child = children[i];
        logFunc(prepend + "-", child);
        if (child.children && child.children.length) {
          this.logDepth(child.children, "|" + prepend, logFunc);
        }
      }
    };
    WebGLInspector.prototype.logContextInfo = function logContextInfo(gl) {
      if (!gl) {
        gl = this._stage._webGLContext;
      }
      var data = "\n\t\t\t== LOG:\n\n\t\t\tMax textures per draw: " + gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS) + "\n\n\t\t\tMax textures active: " + gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS) + "\n\n\t\t\t\n\n\t\t\tMax texture size: " + gl.getParameter(gl.MAX_TEXTURE_SIZE) / 2 + "\n\n\t\t\tMax cache size: " + gl.getParameter(gl.MAX_RENDERBUFFER_SIZE) / 2 + "\n\n\t\t\t\n\n\t\t\tMax attributes per vertex: " + gl.getParameter(gl.MAX_VERTEX_ATTRIBS) + "\n\n\t\t\tWebGL Version string: " + gl.getParameter(gl.VERSION) + "\n\n\t\t\t======\n\t\t";
      WebGLInspector._log(data);
    };
    WebGLInspector.prototype.logTextureFill = function logTextureFill(stage) {
      if (!stage) {
        stage = this._stage;
      }
      var dict = stage._textureDictionary;
      var count = stage._batchTextureCount;
      WebGLInspector._log(textureMax + ": " + count);
      var output = [];
      for (var n in dict) {
        var str = n.replace(window.location.origin, "");
        var tex = dict[n];
        var shifted = tex._lastActiveIndex ? tex._lastActiveIndex === tex._activeIndex : false;
        output.push({
          src: src,
          element: tex,
          shifted: shifted
        });
        tex._lastActiveIndex = tex._activeIndex;
      }
      output.sort(function(a, b) {
        if (a.element._drawID === stage._drawID) {
          return 1;
        }
        if (a.element._drawID < b.element._drawID) {
          return -1;
        }
        return 0;
      });
      var l = output.length;
      for (var i = 0; i < l; i++) {
        var out = output[i];
        var active = out.element._drawID === stage._drawID;
        WebGLInspector._log("[" + out.src + "] " + (active ? "ACTIVE" : "stale") + " " + (out.shifted ? "steady" : "DRIFT"), out.element);
      }
    };
    createClass(WebGLInspector, null, [ {
      key: "alternateOutput",
      get: function get() {
        return _alternateOutput;
      },
      set: function set(alternateOutput) {
        _alternateOutput = alternateOutput;
      }
    } ]);
    return WebGLInspector;
  }(EventDispatcher);
  exports.EventDispatcher = EventDispatcher;
  exports.Event = Event;
  exports.Ticker = Ticker;
  exports.StageGL = StageGL;
  exports.Stage = Stage;
  exports.Container = Container;
  exports.DisplayObject = DisplayObject;
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
  exports.Shadow = Shadow;
  exports.Shape = Shape;
  exports.Sprite = Sprite;
  exports.SpriteSheet = SpriteSheet;
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
  exports.WebGLInspector = WebGLInspector;
  var v = exports.versions = exports.versions || {};
  v.easeljs = "NEXT";
})(this.createjs = this.createjs || {}, this.createjs && this.createjs.Tween, this.createjs && this.createjs.Timeline);
//# sourceMappingURL=maps/easeljs-NEXT.js.map
