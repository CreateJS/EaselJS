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

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tweenjs = require('@createjs/tweenjs');

var Event =
function () {
  function Event(type, bubbles, cancelable) {
    if (bubbles === void 0) {
      bubbles = false;
    }
    if (cancelable === void 0) {
      cancelable = false;
    }
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
  var _proto = Event.prototype;
  _proto.preventDefault = function preventDefault() {
    this.defaultPrevented = this.cancelable;
    return this;
  };
  _proto.stopPropagation = function stopPropagation() {
    this.propagationStopped = true;
    return this;
  };
  _proto.stopImmediatePropagation = function stopImmediatePropagation() {
    this.immediatePropagationStopped = this.propagationStopped = true;
    return this;
  };
  _proto.remove = function remove() {
    this.removed = true;
    return this;
  };
  _proto.clone = function clone() {
    var event = new Event(this.type, this.bubbles, this.cancelable);
    for (var n in this) {
      if (this.hasOwnProperty(n)) {
        event[n] = this[n];
      }
    }
    return event;
  };
  _proto.set = function set(props) {
    for (var n in props) {
      this[n] = props[n];
    }
    return this;
  };
  _proto.toString = function toString() {
    return "[" + this.constructor.name + " (type=" + this.type + ")]";
  };
  return Event;
}();

var EventDispatcher =
function () {
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
    this._listeners = null;
    this._captureListeners = null;
  }
  var _proto = EventDispatcher.prototype;
  _proto.addEventListener = function addEventListener(type, listener, useCapture) {
    if (useCapture === void 0) {
      useCapture = false;
    }
    var listeners;
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
      listeners[type] = [listener];
    }
    return listener;
  };
  _proto.on = function on(type, listener, scope, once, data, useCapture) {
    if (scope === void 0) {
      scope = null;
    }
    if (once === void 0) {
      once = false;
    }
    if (data === void 0) {
      data = {};
    }
    if (useCapture === void 0) {
      useCapture = false;
    }
    if (listener.handleEvent) {
      scope = scope || listener;
      listener = listener.handleEvent;
    }
    scope = scope || this;
    return this.addEventListener(type, function (evt) {
      listener.call(scope, evt, data);
      once && evt.remove();
    }, useCapture);
  };
  _proto.removeEventListener = function removeEventListener(type, listener, useCapture) {
    if (useCapture === void 0) {
      useCapture = false;
    }
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
        }
        else {
            arr.splice(i, 1);
          }
        break;
      }
    }
  };
  _proto.off = function off(type, listener, useCapture) {
    if (useCapture === void 0) {
      useCapture = false;
    }
    this.removeEventListener(type, listener, useCapture);
  };
  _proto.removeAllEventListeners = function removeAllEventListeners(type) {
    if (type === void 0) {
      type = null;
    }
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
  _proto.dispatchEvent = function dispatchEvent(eventObj, bubbles, cancelable) {
    if (bubbles === void 0) {
      bubbles = false;
    }
    if (cancelable === void 0) {
      cancelable = false;
    }
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
      var list = [top];
      while (top.parent) {
        list.push(top = top.parent);
      }
      var l = list.length;
      var i;
      for (i = l - 1; i >= 0 && !eventObj.propagationStopped; i--) {
        list[i]._dispatchEvent(eventObj, 1 + (i == 0));
      }
      for (i = 1; i < l && !eventObj.propagationStopped; i++) {
        list[i]._dispatchEvent(eventObj, 3);
      }
    }
    return !eventObj.defaultPrevented;
  };
  _proto.hasEventListener = function hasEventListener(type) {
    var listeners = this._listeners,
        captureListeners = this._captureListeners;
    return !!(listeners && listeners[type] || captureListeners && captureListeners[type]);
  };
  _proto.willTrigger = function willTrigger(type) {
    var o = this;
    while (o) {
      if (o.hasEventListener(type)) {
        return true;
      }
      o = o.parent;
    }
    return false;
  };
  _proto.toString = function toString() {
    return "[" + (this.constructor.name + this.name ? " " + this.name : "") + "]";
  };
  _proto._dispatchEvent = function _dispatchEvent(eventObj, eventPhase) {
    var listeners = eventPhase === 1 ? this._captureListeners : this._listeners;
    if (eventObj && listeners) {
      var arr = listeners[eventObj.type];
      var l;
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

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

var Ticker =
function (_EventDispatcher) {
  _inheritsLoose(Ticker, _EventDispatcher);
  _createClass(Ticker, null, [{
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
  }]);
  function Ticker(name) {
    var _this;
    _this = _EventDispatcher.call(this) || this;
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
  var _proto = Ticker.prototype;
  _proto.init = function init() {
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
  _proto.reset = function reset() {
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
  _proto.addEventListener = function addEventListener(type, listener, useCapture) {
    !this._inited && this.init();
    return _EventDispatcher.prototype.addEventListener.call(this, type, listener, useCapture);
  };
  _proto.getMeasuredTickTime = function getMeasuredTickTime(ticks) {
    if (ticks === void 0) {
      ticks = null;
    }
    var times = this._tickTimes;
    if (!times || times.length < 1) {
      return -1;
    }
    ticks = Math.min(times.length, ticks || this.framerate | 0);
    return times.reduce(function (a, b) {
      return a + b;
    }, 0) / ticks;
  };
  _proto.getMeasuredFPS = function getMeasuredFPS(ticks) {
    if (ticks === void 0) {
      ticks = null;
    }
    var times = this._times;
    if (!times || times.length < 2) {
      return -1;
    }
    ticks = Math.min(times.length - 1, ticks || this.framerate | 0);
    return 1000 / ((times[0] - times[ticks]) / ticks);
  };
  _proto.getTime = function getTime(runTime) {
    if (runTime === void 0) {
      runTime = false;
    }
    return this._startTime ? this._getTime() - (runTime ? this._pausedTime : 0) : -1;
  };
  _proto.getEventTime = function getEventTime(runTime) {
    if (runTime === void 0) {
      runTime = false;
    }
    return this._startTime ? (this._lastTime || this._startTime) - (runTime ? this._pausedTime : 0) : -1;
  };
  _proto.getTicks = function getTicks(pauseable) {
    if (pauseable === void 0) {
      pauseable = false;
    }
    return this._ticks - (pauseable ? this._pausedTicks : 0);
  };
  _proto._handleSynch = function _handleSynch() {
    this._timerId = null;
    this._setupTick();
    if (this._getTime() - this._lastTime >= (this._interval - 1) * 0.97) {
      this._tick();
    }
  };
  _proto._handleRAF = function _handleRAF() {
    this._timerId = null;
    this._setupTick();
    this._tick();
  };
  _proto._handleTimeout = function _handleTimeout() {
    this._timerId = null;
    this._setupTick();
    this._tick();
  };
  _proto._setupTick = function _setupTick() {
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
  _proto._tick = function _tick() {
    var paused = this.paused,
        time = this._getTime(),
        elapsedTime = time - this._lastTime;
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
  _proto._getTime = function _getTime() {
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
  _createClass(Ticker, [{
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
      return 1000 / this._interval;
    },
    set: function set(framerate) {
      this.interval = 1000 / framerate;
    }
  }], [{
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
  }, {
    key: "name",
    get: function get() {
      return _instance.name;
    },
    set: function set(name) {
      _instance.name = name;
    }
  }, {
    key: "timingMode",
    get: function get() {
      return _instance.timingMode;
    },
    set: function set(timingMode) {
      _instance.timingMode = timingMode;
    }
  }, {
    key: "maxDelta",
    get: function get() {
      return _instance.maxDelta;
    },
    set: function set(maxDelta) {
      _instance.maxDelta = maxDelta;
    }
  }, {
    key: "paused",
    get: function get() {
      return _instance.paused;
    },
    set: function set(paused) {
      _instance.paused = paused;
    }
  }]);
  return Ticker;
}(EventDispatcher);
var _instance = new Ticker("createjs.global");

var StageGL = function StageGL() {
  throw new Error("\n\t\t\tStageGL is not currently supported on the EaselJS 2.0 branch.\n\t\t\tEnd of Q1 2018 is targetted for StageGL support.\n\t\t\tFollow @CreateJS on Twitter for updates.\n\t\t");
};

var Shadow =
function () {
  function Shadow(color, offsetX, offsetY, blur) {
    if (color === void 0) {
      color = "black";
    }
    if (offsetX === void 0) {
      offsetX = 0;
    }
    if (offsetY === void 0) {
      offsetY = 0;
    }
    if (blur === void 0) {
      blur = 0;
    }
    this.color = color;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.blur = blur;
  }
  var _proto = Shadow.prototype;
  _proto.toString = function toString() {
    return "[" + this.constructor.name + "]";
  };
  _proto.clone = function clone() {
    return new Shadow(this.color, this.offsetX, this.offsetY, this.blur);
  };
  return Shadow;
}();
Shadow.identity = new Shadow("transparent");

var _nextId = 0;
function uid() {
  return _nextId++;
}

var Point =
function () {
  function Point(x, y) {
    this.setValues(x, y);
  }
  var _proto = Point.prototype;
  _proto.setValues = function setValues(x, y) {
    if (x === void 0) {
      x = 0;
    }
    if (y === void 0) {
      y = 0;
    }
    this.x = x;
    this.y = y;
    return this;
  };
  _proto.copy = function copy(point) {
    this.x = point.x;
    this.y = point.y;
    return this;
  };
  _proto.clone = function clone() {
    return new Point(this.x, this.y);
  };
  _proto.toString = function toString() {
    return "[" + this.constructor.name + " (x=" + this.x + " y=" + this.y + ")]";
  };
  return Point;
}();

var Matrix2D =
function () {
  function Matrix2D(a, b, c, d, tx, ty) {
    this.setValues(a, b, c, d, tx, ty);
  }
  var _proto = Matrix2D.prototype;
  _proto.setValues = function setValues(a, b, c, d, tx, ty) {
    if (a === void 0) {
      a = 1;
    }
    if (b === void 0) {
      b = 0;
    }
    if (c === void 0) {
      c = 0;
    }
    if (d === void 0) {
      d = 1;
    }
    if (tx === void 0) {
      tx = 0;
    }
    if (ty === void 0) {
      ty = 0;
    }
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.tx = tx;
    this.ty = ty;
    return this;
  };
  _proto.append = function append(a, b, c, d, tx, ty) {
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
  _proto.prepend = function prepend(a, b, c, d, tx, ty) {
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
  _proto.appendMatrix = function appendMatrix(matrix) {
    return this.append(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
  };
  _proto.prependMatrix = function prependMatrix(matrix) {
    return this.prepend(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
  };
  _proto.appendTransform = function appendTransform(x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
    var r, cos, sin;
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
  _proto.prependTransform = function prependTransform(x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
    var r, cos, sin;
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
  _proto.rotate = function rotate(angle) {
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
  _proto.skew = function skew(skewX, skewY) {
    skewX *= Matrix2D.DEG_TO_RAD;
    skewY *= Matrix2D.DEG_TO_RAD;
    this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), 0, 0);
    return this;
  };
  _proto.scale = function scale(x, y) {
    this.a *= x;
    this.b *= x;
    this.c *= y;
    this.d *= y;
    return this;
  };
  _proto.translate = function translate(x, y) {
    this.tx += this.a * x + this.c * y;
    this.ty += this.b * x + this.d * y;
    return this;
  };
  _proto.identity = function identity() {
    this.a = this.d = 1;
    this.b = this.c = this.tx = this.ty = 0;
    return this;
  };
  _proto.invert = function invert() {
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
  _proto.isIdentity = function isIdentity() {
    return this.tx === 0 && this.ty === 0 && this.a === 1 && this.b === 0 && this.c === 0 && this.d === 1;
  };
  _proto.equals = function equals(matrix) {
    return this.tx === matrix.tx && this.ty === matrix.ty && this.a === matrix.a && this.b === matrix.b && this.c === matrix.c && this.d === matrix.d;
  };
  _proto.transformPoint = function transformPoint(x, y, pt) {
    if (pt === void 0) {
      pt = new Point();
    }
    pt.x = x * this.a + y * this.c + this.tx;
    pt.y = x * this.b + y * this.d + this.ty;
    return pt;
  };
  _proto.decompose = function decompose(target) {
    if (target === void 0) {
      target = {};
    }
    target.x = this.tx;
    target.y = this.ty;
    target.scaleX = Math.sqrt(this.a * this.a + this.b * this.b);
    target.scaleY = Math.sqrt(this.c * this.c + this.d * this.d);
    var skewX = Math.atan2(-this.c, this.d);
    var skewY = Math.atan2(this.b, this.a);
    var delta = Math.abs(1 - skewX / skewY);
    if (delta < 0.00001) {
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
  _proto.copy = function copy(matrix) {
    return this.setValues(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
  };
  _proto.clone = function clone() {
    return new Matrix2D(this.a, this.b, this.c, this.d, this.tx, this.ty);
  };
  _proto.toString = function toString() {
    return "[" + this.constructor.name + " (a=" + this.a + " b=" + this.b + " c=" + this.c + " d=" + this.d + " tx=" + this.tx + " ty=" + this.ty + ")]";
  };
  return Matrix2D;
}();
Matrix2D.DEG_TO_RAD = Math.PI / 180;
Matrix2D.identity = new Matrix2D();

var DisplayProps =
function () {
  function DisplayProps(visible, alpha, shadow, compositeOperation, matrix) {
    this.setValues(visible, alpha, shadow, compositeOperation, matrix);
  }
  var _proto = DisplayProps.prototype;
  _proto.setValues = function setValues(visible, alpha, shadow, compositeOperation, matrix) {
    if (visible === void 0) {
      visible = true;
    }
    if (alpha === void 0) {
      alpha = 1;
    }
    this.visible = visible;
    this.alpha = alpha;
    this.shadow = shadow;
    this.compositeOperation = compositeOperation;
    this.matrix = matrix || this.matrix && this.matrix.identity() || new Matrix2D();
    return this;
  };
  _proto.append = function append(visible, alpha, shadow, compositeOperation, matrix) {
    this.alpha *= alpha;
    this.shadow = shadow || this.shadow;
    this.compositeOperation = compositeOperation || this.compositeOperation;
    this.visible = this.visible && visible;
    matrix && this.matrix.appendMatrix(matrix);
    return this;
  };
  _proto.prepend = function prepend(visible, alpha, shadow, compositeOperation, matrix) {
    this.alpha *= alpha;
    this.shadow = this.shadow || shadow;
    this.compositeOperation = this.compositeOperation || compositeOperation;
    this.visible = this.visible && visible;
    matrix && this.matrix.prependMatrix(matrix);
    return this;
  };
  _proto.identity = function identity() {
    this.visible = true;
    this.alpha = 1;
    this.shadow = this.compositeOperation = null;
    this.matrix.identity();
    return this;
  };
  _proto.clone = function clone() {
    return new DisplayProps(this.alpha, this.shadow, this.compositeOperation, this.visible, this.matrix.clone());
  };
  return DisplayProps;
}();

var Rectangle =
function () {
  function Rectangle(x, y, width, height) {
    this.setValues(x, y, width, height);
  }
  var _proto = Rectangle.prototype;
  _proto.setValues = function setValues(x, y, width, height) {
    if (x === void 0) {
      x = 0;
    }
    if (y === void 0) {
      y = 0;
    }
    if (width === void 0) {
      width = 0;
    }
    if (height === void 0) {
      height = 0;
    }
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    return this;
  };
  _proto.extend = function extend(x, y, width, height) {
    if (width === void 0) {
      width = 0;
    }
    if (height === void 0) {
      height = 0;
    }
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
  _proto.pad = function pad(top, left, bottom, right) {
    this.x -= left;
    this.y -= top;
    this.width += left + right;
    this.height += top + bottom;
    return this;
  };
  _proto.copy = function copy(rect) {
    return this.setValues(rect.x, rect.y, rect.width, rect.height);
  };
  _proto.contains = function contains(x, y, width, height) {
    if (width === void 0) {
      width = 0;
    }
    if (height === void 0) {
      height = 0;
    }
    return x >= this.x && x + width <= this.x + this.width && y >= this.y && y + height <= this.y + this.height;
  };
  _proto.union = function union(rect) {
    return this.clone().extend(rect.x, rect.y, rect.width, rect.height);
  };
  _proto.intersection = function intersection(rect) {
    var x1 = rect.x,
        y1 = rect.y,
        x2 = x1 + rect.width,
        y2 = y1 + rect.height;
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
  _proto.intersects = function intersects(rect) {
    return rect.x <= this.x + this.width && this.x <= rect.x + rect.width && rect.y <= this.y + this.height && this.y <= rect.y + rect.height;
  };
  _proto.isEmpty = function isEmpty() {
    return this.width <= 0 || this.height <= 0;
  };
  _proto.clone = function clone() {
    return new Rectangle(this.x, this.y, this.width, this.height);
  };
  _proto.toString = function toString() {
    return "[" + this.constructor.name + " (x=" + this.x + " y=" + this.y + " width=" + this.width + " height=" + this.height + ")]";
  };
  return Rectangle;
}();

var Filter =
function () {
  function Filter() {
    this.usesContext = false;
    this._multiPass = null;
    this.VTX_SHADER_BODY = null;
    this.FRAG_SHADER_BODY = null;
  }
  var _proto = Filter.prototype;
  _proto.getBounds = function getBounds(rect) {};
  _proto.shaderParamSetup = function shaderParamSetup(gl, stage, shaderProgram) {};
  _proto.applyFilter = function applyFilter(ctx, x, y, width, height, targetCtx, targetX, targetY) {
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
  _proto.toString = function toString() {
    return "[" + this.constructor.name + "]";
  };
  _proto.clone = function clone() {
    return new Filter();
  };
  _proto._applyFilter = function _applyFilter(imageData) {};
  return Filter;
}();

var BitmapCache =
function (_Filter) {
  _inheritsLoose(BitmapCache, _Filter);
  function BitmapCache() {
    var _this;
    _this = _Filter.call(this) || this;
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
  BitmapCache.getFilterBounds = function getFilterBounds(target, output) {
    if (output === void 0) {
      output = new Rectangle();
    }
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
  var _proto = BitmapCache.prototype;
  _proto.define = function define(target, x, y, width, height, scale, options) {
    if (x === void 0) {
      x = 0;
    }
    if (y === void 0) {
      y = 0;
    }
    if (width === void 0) {
      width = 1;
    }
    if (height === void 0) {
      height = 1;
    }
    if (scale === void 0) {
      scale = 1;
    }
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
  _proto.update = function update(compositeOperation) {
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
  _proto.release = function release() {
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
  _proto.getCacheDataURL = function getCacheDataURL() {
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
  _proto.draw = function draw(ctx) {
    if (!this.target) {
      return false;
    }
    ctx.drawImage(this.target.cacheCanvas, this.x + this._filterOffX / this.scale, this.y + this._filterOffY / this.scale, this._drawWidth / this.scale, this._drawHeight / this.scale);
    return true;
  };
  _proto.getBounds = function getBounds() {
    var scale = this.scale;
    return this._boundRect.setValue(this._filterOffX / scale, this._filterOffY / scale, this.width / scale, this.height / scale);
  };
  _proto._updateSurface = function _updateSurface() {
    var surface;
    if (!this._useWebGL) {
      surface = this.target.cacheCanvas;
      if (!surface) {
        surface = this.target.cacheCanvas = window.createjs && createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas");
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
  _proto._drawToCache = function _drawToCache(compositeOperation) {
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
  _proto._applyFilters = function _applyFilters() {
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

var DisplayObject =
function (_EventDispatcher) {
  _inheritsLoose(DisplayObject, _EventDispatcher);
  function DisplayObject() {
    var _this;
    _this = _EventDispatcher.call(this) || this;
    _this.alpha = 1;
    _this.cacheCanvas = null;
    _this.bitmapCache = null;
    _this.id = uid();
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
  var _proto = DisplayObject.prototype;
  _proto.isVisible = function isVisible() {
    return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0);
  };
  _proto.draw = function draw(ctx, ignoreCache) {
    if (ignoreCache === void 0) {
      ignoreCache = false;
    }
    return this.drawCache(ctx, ignoreCache);
  };
  _proto.drawCache = function drawCache(ctx, ignoreCache) {
    if (ignoreCache === void 0) {
      ignoreCache = false;
    }
    var cache = this.bitmapCache;
    if (cache && !ignoreCache) {
      return cache.draw(ctx);
    }
    return false;
  };
  _proto.updateContext = function updateContext(ctx) {
    var o = this,
        mask = o.mask,
        mtx = o._props.matrix;
    if (mask && mask.graphics && !mask.graphics.isEmpty()) {
      mask.getMatrix(mtx);
      ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
      mask.graphics.drawAsPath(ctx);
      ctx.clip();
      mtx.invert();
      ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
    }
    this.getMatrix(mtx);
    var tx = mtx.tx,
        ty = mtx.ty;
    if (DisplayObject._snapToPixelEnabled && o.snapToPixel) {
      tx = tx + (tx < 0 ? -0.5 : 0.5) | 0;
      ty = ty + (ty < 0 ? -0.5 : 0.5) | 0;
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
  _proto.cache = function cache(x, y, width, height, scale, options) {
    if (scale === void 0) {
      scale = 1;
    }
    if (!this.bitmapCache) {
      this.bitmapCache = new BitmapCache();
    }
    this.bitmapCache.define(this, x, y, width, height, scale, options);
  };
  _proto.updateCache = function updateCache(compositeOperation) {
    if (!this.bitmapCache) {
      throw "No cache found. cache() must be called before updateCache()";
    }
    this.bitmapCache.update(compositeOperation);
  };
  _proto.uncache = function uncache() {
    if (this.bitmapCache) {
      this.bitmapCache.release();
      this.bitmapCache = undefined;
    }
  };
  _proto.getCacheDataURL = function getCacheDataURL() {
    return this.bitmapCache ? this.bitmapCache.getDataURL() : null;
  };
  _proto.localToGlobal = function localToGlobal(x, y, pt) {
    if (pt === void 0) {
      pt = new Point();
    }
    return this.getConcatenatedMatrix(this._props.matrix).transformPoint(x, y, pt);
  };
  _proto.globalToLocal = function globalToLocal(x, y, pt) {
    if (pt === void 0) {
      pt = new Point();
    }
    return this.getConcatenatedMatrix(this._props.matrix).invert().transformPoint(x, y, pt);
  };
  _proto.localToLocal = function localToLocal(x, y, target, pt) {
    pt = this.localToGlobal(x, y, pt);
    return target.globalToLocal(pt.x, pt.y, pt);
  };
  _proto.setTransform = function setTransform(x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
    if (x === void 0) {
      x = 0;
    }
    if (y === void 0) {
      y = 0;
    }
    if (scaleX === void 0) {
      scaleX = 1;
    }
    if (scaleY === void 0) {
      scaleY = 1;
    }
    if (rotation === void 0) {
      rotation = 0;
    }
    if (skewX === void 0) {
      skewX = 0;
    }
    if (skewY === void 0) {
      skewY = 0;
    }
    if (regX === void 0) {
      regX = 0;
    }
    if (regY === void 0) {
      regY = 0;
    }
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
  _proto.getMatrix = function getMatrix(matrix) {
    var o = this,
        mtx = matrix && matrix.identity() || new Matrix2D();
    return o.transformMatrix ? mtx.copy(o.transformMatrix) : mtx.appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY);
  };
  _proto.getConcatenatedMatrix = function getConcatenatedMatrix(matrix) {
    var o = this,
        mtx = this.getMatrix(matrix);
    while (o = o.parent) {
      mtx.prependMatrix(o.getMatrix(o._props.matrix));
    }
    return mtx;
  };
  _proto.getConcatenatedDisplayProps = function getConcatenatedDisplayProps(props) {
    props = props ? props.identity() : new DisplayProps();
    var o = this,
        mtx = o.getMatrix(props.matrix);
    do {
      props.prepend(o.visible, o.alpha, o.shadow, o.compositeOperation);
      if (o != this) {
        mtx.prependMatrix(o.getMatrix(o._props.matrix));
      }
    } while (o = o.parent);
    return props;
  };
  _proto.hitTest = function hitTest(x, y) {
    var ctx = DisplayObject._hitTestContext;
    ctx.setTransform(1, 0, 0, 1, -x, -y);
    this.draw(ctx);
    var hit = this._testHit(ctx);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, 2, 2);
    return hit;
  };
  _proto.set = function set(props) {
    for (var n in props) {
      this[n] = props[n];
    }
    return this;
  };
  _proto.getBounds = function getBounds() {
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
  _proto.getTransformedBounds = function getTransformedBounds() {
    return this._getBounds();
  };
  _proto.setBounds = function setBounds(x, y, width, height) {
    if (x == null) {
      this._bounds = null;
    }
    this._bounds = (this._bounds || new Rectangle()).setValues(x, y, width, height);
  };
  _proto.clone = function clone() {
    return this._cloneProps(new DisplayObject());
  };
  _proto.toString = function toString() {
    return "[" + this.constructor.name + (this.name ? " (name=" + this.name + ")" : "") + "]";
  };
  _proto._cloneProps = function _cloneProps(o) {
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
  _proto._applyShadow = function _applyShadow(ctx, shadow) {
    if (shadow === void 0) {
      shadow = Shadow.identity;
    }
    shadow = shadow;
    ctx.shadowColor = shadow.color;
    ctx.shadowOffsetX = shadow.offsetX;
    ctx.shadowOffsetY = shadow.offsetY;
    ctx.shadowBlur = shadow.blur;
  };
  _proto._tick = function _tick(evtObj) {
    var ls = this._listeners;
    if (ls && ls["tick"]) {
      evtObj.target = null;
      evtObj.propagationStopped = evtObj.immediatePropagationStopped = false;
      this.dispatchEvent(evtObj);
    }
  };
  _proto._testHit = function _testHit(ctx) {
    try {
      return ctx.getImageData(0, 0, 1, 1).data[3] > 1;
    } catch (e) {
      if (!DisplayObject.suppressCrossDomainErrors) {
        throw "An error has occurred. This is most likely due to security restrictions on reading canvas pixel data with local or cross-domain images.";
      }
      return false;
    }
  };
  _proto._getBounds = function _getBounds(matrix, ignoreTransform) {
    return this._transformBounds(this.getBounds(), matrix, ignoreTransform);
  };
  _proto._transformBounds = function _transformBounds(bounds, matrix, ignoreTransform) {
    if (!bounds) {
      return bounds;
    }
    var x = bounds.x,
        y = bounds.y,
        width = bounds.width,
        height = bounds.height;
    var mtx = this._props.matrix;
    mtx = ignoreTransform ? mtx.identity() : this.getMatrix(mtx);
    if (x || y) {
      mtx.appendTransform(0, 0, 1, 1, 0, 0, 0, -x, -y);
    }
    if (matrix) {
      mtx.prependMatrix(matrix);
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
  _proto._hasMouseEventListener = function _hasMouseEventListener() {
    var evts = DisplayObject._MOUSE_EVENTS;
    for (var i = 0, l = evts.length; i < l; i++) {
      if (this.hasEventListener(evts[i])) {
        return true;
      }
    }
    return !!this.cursor;
  };
  _createClass(DisplayObject, [{
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
    set: function set(value) {
      this.scaleX = this.scaleY = value;
    },
    get: function get() {
      return this.scaleX;
    }
  }]);
  return DisplayObject;
}(EventDispatcher);
{
  var canvas = window.createjs && createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas");
  if (canvas.getContext) {
    DisplayObject._hitTestCanvas = canvas;
    DisplayObject._hitTestContext = canvas.getContext("2d");
    canvas.width = canvas.height = 1;
  }
}
DisplayObject._MOUSE_EVENTS = ["click", "dblclick", "mousedown", "mouseout", "mouseover", "pressmove", "pressup", "rollout", "rollover"];
DisplayObject.suppressCrossDomainErrors = false;
DisplayObject.snapToPixelEnabled = false;
DisplayObject._StageGL_NONE = 0;
DisplayObject._StageGL_SPRITE = 1;
DisplayObject._StageGL_BITMAP = 2;

var Container =
function (_DisplayObject) {
  _inheritsLoose(Container, _DisplayObject);
  function Container() {
    var _this;
    _this = _DisplayObject.call(this) || this;
    _this.children = [];
    _this.mouseChildren = true;
    _this.tickChildren = true;
    return _this;
  }
  var _proto = Container.prototype;
  _proto.isVisible = function isVisible() {
    var hasContent = this.cacheCanvas || this.children.length;
    return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent);
  };
  _proto.draw = function draw(ctx, ignoreCache) {
    if (ignoreCache === void 0) {
      ignoreCache = false;
    }
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
  _proto.addChild = function addChild() {
    var l = arguments.length;
    if (l === 0) {
      return null;
    }
    var child = arguments.length <= 0 ? undefined : arguments[0];
    if (l > 1) {
      for (var i = 0; i < l; i++) {
        child = this.addChild(i < 0 || arguments.length <= i ? undefined : arguments[i]);
      }
      return child;
    }
    var parent = child.parent,
        silent = parent === this;
    parent && parent._removeChildAt(parent.children.indexOf(child), silent);
    child.parent = this;
    this.children.push(child);
    if (!silent) {
      child.dispatchEvent("added");
    }
    return child;
  };
  _proto.addChildAt = function addChildAt() {
    for (var _len = arguments.length, children = new Array(_len), _key = 0; _key < _len; _key++) {
      children[_key] = arguments[_key];
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
    var parent = child.parent,
        silent = parent === this;
    parent && parent._removeChildAt(parent.children.indexOf(child), silent);
    child.parent = this;
    this.children.splice(index++, 0, child);
    if (!silent) {
      child.dispatchEvent("added");
    }
    return child;
  };
  _proto.removeChild = function removeChild() {
    var l = arguments.length;
    if (l === 0) {
      return true;
    }
    if (l > 1) {
      var good = true;
      for (var i = 0; i < l; i++) {
        good = good && this.removeChild(i < 0 || arguments.length <= i ? undefined : arguments[i]);
      }
      return good;
    }
    return this._removeChildAt(this.children.indexOf(arguments.length <= 0 ? undefined : arguments[0]));
  };
  _proto.removeChildAt = function removeChildAt() {
    for (var _len2 = arguments.length, indexes = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      indexes[_key2] = arguments[_key2];
    }
    var l = indexes.length;
    if (l === 0) {
      return true;
    }
    if (l > 1) {
      indexes.sort(function (a, b) {
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
  _proto.removeAllChildren = function removeAllChildren() {
    var kids = this.children;
    while (kids.length) {
      this._removeChildAt(0);
    }
  };
  _proto.getChildAt = function getChildAt(index) {
    return this.children[index];
  };
  _proto.getChildByName = function getChildByName(name) {
    var kids = this.children;
    var l = kids.length;
    for (var i = 0; i < l; i++) {
      if (kids[i].name === name) {
        return kids[i];
      }
    }
    return null;
  };
  _proto.sortChildren = function sortChildren(sortFunction) {
    this.children.sort(sortFunction);
  };
  _proto.getChildIndex = function getChildIndex(child) {
    return this.children.indexOf(child);
  };
  _proto.swapChildrenAt = function swapChildrenAt(index1, index2) {
    var kids = this.children;
    var o1 = kids[index1];
    var o2 = kids[index2];
    if (!o1 || !o2) {
      return;
    }
    kids[index1] = o2;
    kids[index2] = o1;
  };
  _proto.swapChildren = function swapChildren(child1, child2) {
    var kids = this.children;
    var l = kids.length;
    var index1, index2;
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
  _proto.setChildIndex = function setChildIndex(child, index) {
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
  _proto.contains = function contains(child) {
    while (child) {
      if (child === this) {
        return true;
      }
      child = child.parent;
    }
    return false;
  };
  _proto.hitTest = function hitTest(x, y) {
    return this.getObjectUnderPoint(x, y) != null;
  };
  _proto.getObjectsUnderPoint = function getObjectsUnderPoint(x, y, mode) {
    if (mode === void 0) {
      mode = 0;
    }
    var arr = [];
    var pt = this.localToGlobal(x, y);
    this._getObjectsUnderPoint(pt.x, pt.y, arr, mode > 0, mode === 1);
    return arr;
  };
  _proto.getObjectUnderPoint = function getObjectUnderPoint(x, y, mode) {
    if (mode === void 0) {
      mode = 0;
    }
    var pt = this.localToGlobal(x, y);
    return this._getObjectsUnderPoint(pt.x, pt.y, null, mode > 0, mode === 1);
  };
  _proto.getBounds = function getBounds() {
    return this._getBounds(null, true);
  };
  _proto.getTransformedBounds = function getTransformedBounds() {
    return this._getBounds();
  };
  _proto.clone = function clone(recursive) {
    if (recursive === void 0) {
      recursive = false;
    }
    var o = this._cloneProps(new Container());
    if (recursive) {
      this._cloneChildren(o);
    }
    return o;
  };
  _proto._tick = function _tick(evtObj) {
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
  _proto._cloneChildren = function _cloneChildren(o) {
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
  _proto._removeChildAt = function _removeChildAt(index, silent) {
    if (silent === void 0) {
      silent = false;
    }
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
  _proto._getObjectsUnderPoint = function _getObjectsUnderPoint(x, y, arr, mouse, activeListener, currentDepth) {
    if (currentDepth === void 0) {
      currentDepth = 0;
    }
    if (!currentDepth && !this._testMask(this, x, y)) {
      return null;
    }
    var mtx,
        ctx = DisplayObject._hitTestContext;
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
  _proto._testMask = function _testMask(target, x, y) {
    var mask = target.mask;
    if (!mask || !mask.graphics || mask.graphics.isEmpty()) {
      return true;
    }
    var mtx = this._props.matrix,
        parent = target.parent;
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
  _proto._getBounds = function _getBounds(matrix, ignoreTransform) {
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
  _createClass(Container, [{
    key: "numChildren",
    get: function get() {
      return this.children.length;
    }
  }]);
  return Container;
}(DisplayObject);

var MouseEvent =
function (_Event) {
  _inheritsLoose(MouseEvent, _Event);
  function MouseEvent(type, bubbles, cancelable, stageX, stageY, nativeEvent, pointerID, primary, rawX, rawY, relatedTarget) {
    var _this;
    _this = _Event.call(this, type, bubbles, cancelable) || this;
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
  var _proto = MouseEvent.prototype;
  _proto.clone = function clone() {
    return new MouseEvent(this.type, this.bubbles, this.cancelable, this.stageX, this.stageY, this.nativeEvent, this.pointerID, this.primary, this.rawX, this.rawY);
  };
  _proto.toString = function toString() {
    return "[" + this.constructor.name + " (type=" + this.type + " stageX=" + this.stageX + " stageY=" + this.stageY + ")]";
  };
  _createClass(MouseEvent, [{
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
  }]);
  return MouseEvent;
}(Event);

var Stage =
function (_Container) {
  _inheritsLoose(Stage, _Container);
  function Stage(canvas) {
    var _this;
    _this = _Container.call(this) || this;
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
  var _proto = Stage.prototype;
  _proto.update = function update(props) {
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
    var r = this.drawRect,
        ctx = this.canvas.getContext("2d");
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
  _proto.tick = function tick(props) {
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
  _proto.handleEvent = function handleEvent(evt) {
    if (evt.type === "tick") {
      this.update(evt);
    }
  };
  _proto.clear = function clear() {
    if (!this.canvas) {
      return;
    }
    var ctx = this.canvas.getContext("2d");
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.canvas.width + 1, this.canvas.height + 1);
  };
  _proto.toDataURL = function toDataURL(backgroundColor, mimeType) {
    if (mimeType === void 0) {
      mimeType = "image/png";
    }
    var data,
        ctx = this.canvas.getContext('2d'),
        w = this.canvas.width,
        h = this.canvas.height;
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
  _proto.enableMouseOver = function enableMouseOver(frequency) {
    var _this2 = this;
    if (frequency === void 0) {
      frequency = 20;
    }
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
    this._mouseOverIntervalID = setInterval(function () {
      return _this2._testMouseOver();
    }, 1000 / Math.min(50, frequency));
  };
  _proto.enableDOMEvents = function enableDOMEvents(enable) {
    var _this3 = this;
    if (enable === void 0) {
      enable = true;
    }
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
        _o.t.addEventListener && _o.t.addEventListener(_n, _o.f, false);
      }
    }
  };
  _proto.clone = function clone() {
    throw "Stage cannot be cloned.";
  };
  _proto._getElementRect = function _getElementRect(e) {
    var bounds;
    try {
      bounds = e.getBoundingClientRect();
    }
    catch (err) {
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
  _proto._getPointerData = function _getPointerData(id) {
    var data = this._pointerData[id];
    if (!data) {
      data = this._pointerData[id] = {
        x: 0,
        y: 0
      };
    }
    return data;
  };
  _proto._handleMouseMove = function _handleMouseMove(e) {
    if (e === void 0) {
      e = window.event;
    }
    this._handlePointerMove(-1, e, e.pageX, e.pageY);
  };
  _proto._handlePointerMove = function _handlePointerMove(id, e, pageX, pageY, owner) {
    if (this._prevStage && owner === undefined) {
      return;
    }
    if (!this.canvas) {
      return;
    }
    var nextStage = this._nextStage,
        o = this._getPointerData(id);
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
  _proto._updatePointerPosition = function _updatePointerPosition(id, e, pageX, pageY) {
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
  _proto._handleMouseUp = function _handleMouseUp(e) {
    this._handlePointerUp(-1, e, false);
  };
  _proto._handlePointerUp = function _handlePointerUp(id, e, clear, owner) {
    var nextStage = this._nextStage,
        o = this._getPointerData(id);
    if (this._prevStage && owner === undefined) {
      return;
    }
    var target = null,
        oTarget = o.target;
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
  _proto._handleMouseDown = function _handleMouseDown(e) {
    this._handlePointerDown(-1, e, e.pageX, e.pageY);
  };
  _proto._handlePointerDown = function _handlePointerDown(id, e, pageX, pageY, owner) {
    if (this.preventSelection) {
      e.preventDefault();
    }
    if (this._primaryPointerID == null || id === -1) {
      this._primaryPointerID = id;
    }
    if (pageY != null) {
      this._updatePointerPosition(id, e, pageX, pageY);
    }
    var target = null,
        nextStage = this._nextStage,
        o = this._getPointerData(id);
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
  _proto._testMouseOver = function _testMouseOver(clear, owner, eventTarget) {
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
    var target = null,
        common = -1,
        cursor = "";
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
  _proto._handleDoubleClick = function _handleDoubleClick(e, owner) {
    var target = null,
        nextStage = this._nextStage,
        o = this._getPointerData(-1);
    if (!owner) {
      target = this._getObjectsUnderPoint(o.x, o.y, null, true);
      this._dispatchMouseEvent(target, "dblclick", true, -1, o, e);
    }
    nextStage && nextStage._handleDoubleClick(e, owner || target && this);
  };
  _proto._dispatchMouseEvent = function _dispatchMouseEvent(target, type, bubbles, pointerId, o, nativeEvent, relatedTarget) {
    if (!target || !bubbles && !target.hasEventListener(type)) {
      return;
    }
    var evt = new MouseEvent(type, bubbles, false, o.x, o.y, nativeEvent, pointerId, pointerId === this._primaryPointerID || pointerId === -1, o.rawX, o.rawY, relatedTarget);
    target.dispatchEvent(evt);
  };
  _createClass(Stage, [{
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
  }]);
  return Stage;
}(Container);

function createCanvas(width, height) {
  if (width === void 0) {
    width = 1;
  }
  if (height === void 0) {
    height = 1;
  }
  var c;
  if (window.createjs !== undefined && window.createjs.createCanvas !== undefined) {
    c = window.createjs.createCanvas();
  }
  if (window.document !== undefined && window.document.createElement !== undefined) {
    c = document.createElement("canvas");
  }
  if (c !== undefined) {
    c.width = width;
    c.height = height;
    return c;
  }
  throw "Canvas not supported in this environment.";
}

var VideoBuffer =
function () {
  function VideoBuffer(video) {
    this.readyState = video.readyState;
    this._video = video;
    this._canvas = null;
    this._lastTime = -1;
    if (this.readyState < 2) {
      video.addEventListener("canplaythrough", this._videoReady.bind(this));
    }
  }
  var _proto = VideoBuffer.prototype;
  _proto.getImage = function getImage() {
    if (this.readyState < 2) {
      return;
    }
    var canvas = this._canvas,
        video = this._video;
    if (!canvas) {
      canvas = this._canvas = createCanvas();
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
  _proto._videoReady = function _videoReady() {
    this.readyState = 2;
  };
  return VideoBuffer;
}();

var Bitmap =
function (_DisplayObject) {
  _inheritsLoose(Bitmap, _DisplayObject);
  function Bitmap(imageOrUri) {
    var _this;
    _this = _DisplayObject.call(this) || this;
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
  var _proto = Bitmap.prototype;
  _proto.isVisible = function isVisible() {
    var image = this.image;
    var hasContent = this.cacheCanvas || image && (image.naturalWidth || image.getContext || image.readyState >= 2);
    return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent);
  };
  _proto.draw = function draw(ctx, ignoreCache) {
    if (ignoreCache === void 0) {
      ignoreCache = false;
    }
    if (_DisplayObject.prototype.draw.call(this, ctx, ignoreCache)) {
      return true;
    }
    var img = this.image,
        rect = this.sourceRect;
    if (img instanceof VideoBuffer) {
      img = img.getImage();
    }
    if (img == null) {
      return true;
    }
    if (rect) {
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
  _proto.getBounds = function getBounds() {
    var rect = _DisplayObject.prototype.getBounds.call(this);
    if (rect) {
      return rect;
    }
    var image = this.image,
        o = this.sourceRect || image;
    var hasContent = image && (image.naturalWidth || image.getContext || image.readyState >= 2);
    return hasContent ? this._rectangle.setValues(0, 0, o.width, o.height) : null;
  };
  _proto.clone = function clone(node) {
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

var Sprite =
function (_DisplayObject) {
  _inheritsLoose(Sprite, _DisplayObject);
  function Sprite(spriteSheet, frameOrAnimation) {
    var _this;
    _this = _DisplayObject.call(this) || this;
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
  var _proto = Sprite.prototype;
  _proto.isVisible = function isVisible() {
    var hasContent = this.cacheCanvas || this.spriteSheet.complete;
    return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent);
  };
  _proto.draw = function draw(ctx, ignoreCache) {
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
  _proto.play = function play() {
    this.paused = false;
  };
  _proto.stop = function stop() {
    this.paused = true;
  };
  _proto.gotoAndPlay = function gotoAndPlay(frameOrAnimation) {
    this.paused = false;
    this._skipAdvance = true;
    this._goto(frameOrAnimation);
  };
  _proto.gotoAndStop = function gotoAndStop(frameOrAnimation) {
    this.paused = true;
    this._goto(frameOrAnimation);
  };
  _proto.advance = function advance(time) {
    var fps = this.framerate || this.spriteSheet.framerate;
    var t = fps && time != null ? time / (1000 / fps) : 1;
    this._normalizeFrame(t);
  };
  _proto.getBounds = function getBounds() {
    return _DisplayObject.prototype.getBounds.call(this) || this.spriteSheet.getFrameBounds(this.currentFrame, this._rectangle);
  };
  _proto.clone = function clone() {
    return this._cloneProps(new Sprite(this.spriteSheet));
  };
  _proto._cloneProps = function _cloneProps(o) {
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
  _proto._tick = function _tick(evtObj) {
    if (!this.paused) {
      if (!this._skipAdvance) {
        this.advance(evtObj && evtObj.delta);
      }
      this._skipAdvance = false;
    }
    _DisplayObject.prototype._tick.call(this, evtObj);
  };
  _proto._normalizeFrame = function _normalizeFrame(frameDelta) {
    if (frameDelta === void 0) {
      frameDelta = 0;
    }
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
  _proto._dispatchAnimationEnd = function _dispatchAnimationEnd(animation, frame, paused, next, end) {
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
  _proto._goto = function _goto(frameOrAnimation, frame) {
    if (frame === void 0) {
      frame = 0;
    }
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

var BitmapText =
function (_Container) {
  _inheritsLoose(BitmapText, _Container);
  function BitmapText(text, spriteSheet) {
    var _this;
    if (text === void 0) {
      text = "";
    }
    if (spriteSheet === void 0) {
      spriteSheet = null;
    }
    _this = _Container.call(this) || this;
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
  var _proto = BitmapText.prototype;
  _proto.draw = function draw(ctx, ignoreCache) {
    if (this.drawCache(ctx, ignoreCache)) {
      return;
    }
    this._updateState();
    _Container.prototype.draw.call(this, ctx, ignoreCache);
  };
  _proto.getBounds = function getBounds() {
    this._updateText();
    return _Container.prototype.getBounds.call(this);
  };
  _proto.isVisible = function isVisible() {
    var hasContent = this.cacheCanvas || this.spriteSheet && this.spriteSheet.complete && this.text;
    return !!(this.visible && this.alpha > 0 && this.scaleX !== 0 && this.scaleY !== 0 && hasContent);
  };
  _proto.clone = function clone() {
    return this._cloneProps(new BitmapText(this.text, this.spriteSheet));
  };
  _proto.addChild = function addChild() {};
  _proto.addChildAt = function addChildAt() {};
  _proto.removeChild = function removeChild() {};
  _proto.removeChildAt = function removeChildAt() {};
  _proto.removeAllChildren = function removeAllChildren() {};
  _proto._updateState = function _updateState() {
    this._updateText();
  };
  _proto._cloneProps = function _cloneProps(o) {
    _Container.prototype._cloneProps.call(this, o);
    o.lineHeight = this.lineHeight;
    o.letterSpacing = this.letterSpacing;
    o.spaceWidth = this.spaceWidth;
    return o;
  };
  _proto._getFrameIndex = function _getFrameIndex(character, spriteSheet) {
    var c,
        o = spriteSheet.getAnimation(character);
    if (!o) {
      character != (c = character.toUpperCase()) || character != (c = character.toLowerCase()) || (c = null);
      if (c) {
        o = spriteSheet.getAnimation(c);
      }
    }
    return o && o.frames[0];
  };
  _proto._getFrame = function _getFrame(character, spriteSheet) {
    var index = this._getFrameIndex(character, spriteSheet);
    return index == null ? index : spriteSheet.getFrame(index);
  };
  _proto._getLineHeight = function _getLineHeight(ss) {
    var frame = this._getFrame("1", ss) || this._getFrame("T", ss) || this._getFrame("L", ss) || ss.getFrame(0);
    return frame ? frame.rect.height : 1;
  };
  _proto._getSpaceWidth = function _getSpaceWidth(ss) {
    var frame = this._getFrame("1", ss) || this._getFrame("l", ss) || this._getFrame("e", ss) || this._getFrame("a", ss) || ss.getFrame(0);
    return frame ? frame.rect.width : 1;
  };
  _proto._tick = function _tick(evtObj) {
    var stage = this.stage;
    stage && stage.on("drawstart", this._updateText, this, true);
    _Container.prototype._tick.call(this, evtObj);
  };
  _proto._updateText = function _updateText() {
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
        sprite;
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
  return BitmapText;
}(Container);
BitmapText.maxPoolSize = 100;
BitmapText._spritePool = [];

var DOMElement =
function (_DisplayObject) {
  _inheritsLoose(DOMElement, _DisplayObject);
  function DOMElement(htmlElement) {
    var _this;
    _this = _DisplayObject.call(this) || this;
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
  var _proto = DOMElement.prototype;
  _proto.isVisible = function isVisible() {
    return this.htmlElement != null;
  };
  _proto.draw = function draw(ctx, ignoreCache) {
    return true;
  };
  _proto.cache = function cache() {};
  _proto.uncache = function uncache() {};
  _proto.updateCache = function updateCache() {};
  _proto.hitTest = function hitTest() {};
  _proto.localToGlobal = function localToGlobal() {};
  _proto.globalToLocal = function globalToLocal() {};
  _proto.localToLocal = function localToLocal() {};
  _proto.clone = function clone() {
    throw "DOMElement cannot be cloned.";
  };
  _proto._tick = function _tick(evtObj) {
    var stage = this.stage;
    if (stage != null && stage !== this._oldStage) {
      this._drawAction && stage.off("drawend", this._drawAction);
      this._drawAction = stage.on("drawend", this._handleDrawEnd, this);
      this._oldStage = stage;
    }
    _DisplayObject.prototype._tick.call(this, evtObj);
  };
  _proto._handleDrawEnd = function _handleDrawEnd(evt) {
    var o = this.htmlElement;
    if (!o) {
      return;
    }
    var style = o.style;
    var props = this.getConcatenatedDisplayProps(this._props),
        mtx = props.matrix;
    var visibility = props.visible ? "visible" : "hidden";
    if (visibility != style.visibility) {
      style.visibility = visibility;
    }
    if (!props.visible) {
      return;
    }
    var oldProps = this._oldProps,
        oldMtx = oldProps && oldProps.matrix;
    var n = 10000;
    if (!oldMtx || !oldMtx.equals(mtx)) {
      var str = "matrix(" + (mtx.a * n | 0) / n + "," + (mtx.b * n | 0) / n + "," + (mtx.c * n | 0) / n + "," + (mtx.d * n | 0) / n + "," + (mtx.tx + 0.5 | 0);
      style.transform = style.WebkitTransform = style.OTransform = style.msTransform = str + "," + (mtx.ty + 0.5 | 0) + ")";
      style.MozTransform = str + "px," + (mtx.ty + 0.5 | 0) + "px)";
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

var Graphics =
function () {
  function Graphics() {
    this.command = null;
    this._stroke = null;
    this._strokeStyle = null;
    this._oldStrokeStyle = null;
    this._strokeDash = null;
    this._oldStrokeDash = null;
    this._fill = null;
    this._strokeIgnoreScale = false;
    this._commitIndex = 0;
    this._instructions = [];
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
      b = r & 0xFF;
      g = r >> 8 & 0xFF;
      r = r >> 16 & 0xFF;
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
  var _proto = Graphics.prototype;
  _proto.isEmpty = function isEmpty() {
    return !(this._instructions.length || this._activeInstructions.length);
  };
  _proto.draw = function draw(ctx, data) {
    this._updateInstructions();
    var instr = this._instructions;
    var l = instr.length;
    for (var i = this._storeIndex; i < l; i++) {
      instr[i].exec(ctx, data);
    }
  };
  _proto.drawAsPath = function drawAsPath(ctx) {
    this._updateInstructions();
    var instr,
        instrs = this._instructions;
    var l = instrs.length;
    for (var i = this._storeIndex; i < l; i++) {
      if ((instr = instrs[i]).path !== false) {
        instr.exec(ctx);
      }
    }
  };
  _proto.moveTo = function moveTo(x, y) {
    return this.append(new MoveTo(x, y), true);
  };
  _proto.lineTo = function lineTo(x, y) {
    return this.append(new LineTo(x, y));
  };
  _proto.arcTo = function arcTo(x1, y1, x2, y2, radius) {
    return this.append(new ArcTo(x1, y1, x2, y2, radius));
  };
  _proto.arc = function arc(x, y, radius, startAngle, endAngle, anticlockwise) {
    return this.append(new Arc(x, y, radius, startAngle, endAngle, anticlockwise));
  };
  _proto.quadraticCurveTo = function quadraticCurveTo(cpx, cpy, x, y) {
    return this.append(new QuadraticCurveTo(cpx, cpy, x, y));
  };
  _proto.bezierCurveTo = function bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
    return this.append(new BezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y));
  };
  _proto.rect = function rect(x, y, w, h) {
    return this.append(new Rect(x, y, w, h));
  };
  _proto.closePath = function closePath() {
    return this._activeInstructions.length ? this.append(new ClosePath()) : this;
  };
  _proto.clear = function clear() {
    this._instructions.length = this._activeInstructions.length = this._commitIndex = 0;
    this._strokeStyle = this._oldStrokeStyle = this._stroke = this._fill = this._strokeDash = this._oldStrokeDash = null;
    this._dirty = this._strokeIgnoreScale = false;
    return this;
  };
  _proto.beginFill = function beginFill(color) {
    return this._setFill(color ? new Fill(color) : null);
  };
  _proto.beginLinearGradientFill = function beginLinearGradientFill(colors, ratios, x0, y0, x1, y1) {
    return this._setFill(new Fill().linearGradient(colors, ratios, x0, y0, x1, y1));
  };
  _proto.beginRadialGradientFill = function beginRadialGradientFill(colors, ratios, x0, y0, r0, x1, y1, r1) {
    return this._setFill(new Fill().radialGradient(colors, ratios, x0, y0, r0, x1, y1, r1));
  };
  _proto.beginBitmapFill = function beginBitmapFill(image, repetition, matrix) {
    return this._setFill(new Fill(null, matrix).bitmap(image, repetition));
  };
  _proto.endFill = function endFill() {
    return this.beginFill();
  };
  _proto.setStrokeStyle = function setStrokeStyle(thickness, caps, joints, miterLimit, ignoreScale) {
    if (caps === void 0) {
      caps = 0;
    }
    if (joints === void 0) {
      joints = 0;
    }
    if (miterLimit === void 0) {
      miterLimit = 10;
    }
    if (ignoreScale === void 0) {
      ignoreScale = false;
    }
    this._updateInstructions(true);
    this._strokeStyle = this.command = new StrokeStyle(thickness, caps, joints, miterLimit, ignoreScale);
    if (this._stroke) {
      this._stroke.ignoreScale = ignoreScale;
    }
    this._strokeIgnoreScale = ignoreScale;
    return this;
  };
  _proto.setStrokeDash = function setStrokeDash(segments, offset) {
    if (offset === void 0) {
      offset = 0;
    }
    this._updateInstructions(true);
    this._strokeDash = this.command = new StrokeDash(segments, offset);
    return this;
  };
  _proto.beginStroke = function beginStroke(color) {
    return this._setStroke(color ? new Stroke(color) : null);
  };
  _proto.beginLinearGradientStroke = function beginLinearGradientStroke(colors, ratios, x0, y0, x1, y1) {
    return this._setStroke(new Stroke().linearGradient(colors, ratios, x0, y0, x1, y1));
  };
  _proto.beginRadialGradientStroke = function beginRadialGradientStroke(colors, ratios, x0, y0, r0, x1, y1, r1) {
    return this._setStroke(new Stroke().radialGradient(colors, ratios, x0, y0, r0, x1, y1, r1));
  };
  _proto.beginBitmapStroke = function beginBitmapStroke(image, repetition) {
    if (repetition === void 0) {
      repetition = "repeat";
    }
    return this._setStroke(new Stroke().bitmap(image, repetition));
  };
  _proto.endStroke = function endStroke() {
    return this.beginStroke();
  };
  _proto.drawRoundRect = function drawRoundRect(x, y, w, h, radius) {
    return this.drawRoundRectComplex(x, y, w, h, radius, radius, radius, radius);
  };
  _proto.drawRoundRectComplex = function drawRoundRectComplex(x, y, w, h, radiusTL, radiusTR, radiusBR, radiusBL) {
    return this.append(new RoundRect(x, y, w, h, radiusTL, radiusTR, radiusBR, radiusBL));
  };
  _proto.drawCircle = function drawCircle(x, y, radius) {
    return this.append(new Circle(x, y, radius));
  };
  _proto.drawEllipse = function drawEllipse(x, y, w, h) {
    return this.append(new Ellipse(x, y, w, h));
  };
  _proto.drawPolyStar = function drawPolyStar(x, y, radius, sides, pointSize, angle) {
    return this.append(new PolyStar(x, y, radius, sides, pointSize, angle));
  };
  _proto.append = function append(command, clean) {
    this._activeInstructions.push(command);
    this.command = command;
    if (!clean) {
      this._dirty = true;
    }
    return this;
  };
  _proto.decodePath = function decodePath(str) {
    var instructions = [this.moveTo, this.lineTo, this.quadraticCurveTo, this.bezierCurveTo, this.closePath];
    var paramCount = [2, 2, 4, 6, 0];
    var i = 0;
    var l = str.length;
    var params = [];
    var x = 0,
        y = 0;
    var base64 = Graphics._BASE_64;
    while (i < l) {
      var c = str.charAt(i);
      var n = base64[c];
      var fi = n >> 3;
      var f = instructions[fi];
      if (!f || n & 3) {
        throw "Bad path data (@" + i + "):c";
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
  _proto.store = function store() {
    this._updateInstructions(true);
    this._storeIndex = this._instructions.length;
    return this;
  };
  _proto.unstore = function unstore() {
    this._storeIndex = 0;
    return this;
  };
  _proto.clone = function clone() {
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
  _proto.toString = function toString() {
    return "[" + this.constructor.name + "]";
  };
  _proto._updateInstructions = function _updateInstructions(commit) {
    var instr = this._instructions,
        active = this._activeInstructions,
        commitIndex = this._commitIndex;
    if (this._dirty && active.length) {
      instr.length = commitIndex;
      instr.push(Graphics.beginCmd);
      var l = active.length,
          ll = instr.length;
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
  _proto._setFill = function _setFill(fill) {
    this._updateInstructions(true);
    this.command = this._fill = fill;
    return this;
  };
  _proto._setStroke = function _setStroke(stroke) {
    this._updateInstructions(true);
    if (this.command = this._stroke = stroke) {
      stroke.ignoreScale = this._strokeIgnoreScale;
    }
    return this;
  };
  _createClass(Graphics, [{
    key: "instructions",
    get: function get() {
      this._updateInstructions();
      return this._instructions;
    }
  }], [{
    key: "LineTo",
    get: function get() {
      return LineTo;
    }
  }, {
    key: "MoveTo",
    get: function get() {
      return MoveTo;
    }
  }, {
    key: "ArcTo",
    get: function get() {
      return ArcTo;
    }
  }, {
    key: "Arc",
    get: function get() {
      return Arc;
    }
  }, {
    key: "QuadraticCurveTo",
    get: function get() {
      return QuadraticCurveTo;
    }
  }, {
    key: "BezierCurveTo",
    get: function get() {
      return BezierCurveTo;
    }
  }, {
    key: "Rect",
    get: function get() {
      return Rect;
    }
  }, {
    key: "ClosePath",
    get: function get() {
      return ClosePath;
    }
  }, {
    key: "BeginPath",
    get: function get() {
      return BeginPath;
    }
  }, {
    key: "Fill",
    get: function get() {
      return Fill;
    }
  }, {
    key: "Stroke",
    get: function get() {
      return Stroke;
    }
  }, {
    key: "StrokeStyle",
    get: function get() {
      return StrokeStyle;
    }
  }, {
    key: "StrokeDash",
    get: function get() {
      return StrokeDash;
    }
  }, {
    key: "RoundRect",
    get: function get() {
      return RoundRect;
    }
  }, {
    key: "Circle",
    get: function get() {
      return Circle;
    }
  }, {
    key: "Ellipse",
    get: function get() {
      return Ellipse;
    }
  }, {
    key: "PolyStar",
    get: function get() {
      return PolyStar;
    }
  }]);
  return Graphics;
}();
var LineTo =
function () {
  function LineTo(x, y) {
    this.x = x;
    this.y = y;
  }
  var _proto2 = LineTo.prototype;
  _proto2.exec = function exec(ctx) {
    ctx.lineTo(this.x, this.y);
  };
  return LineTo;
}();
var MoveTo =
function () {
  function MoveTo(x, y) {
    this.x = x;
    this.y = y;
  }
  var _proto3 = MoveTo.prototype;
  _proto3.exec = function exec(ctx) {
    ctx.moveTo(this.x, this.y);
  };
  return MoveTo;
}();
var ArcTo =
function () {
  function ArcTo(x1, y1, x2, y2, radius) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.radius = radius;
  }
  var _proto4 = ArcTo.prototype;
  _proto4.exec = function exec(ctx) {
    ctx.arcTo(this.x1, this.y1, this.x2, this.y2, this.radius);
  };
  return ArcTo;
}();
var Arc =
function () {
  function Arc(x, y, radius, startAngle, endAngle, anticlockwise) {
    if (anticlockwise === void 0) {
      anticlockwise = false;
    }
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.startAngle = startAngle;
    this.endAngle = endAngle;
    this.anticlockwise = anticlockwise;
  }
  var _proto5 = Arc.prototype;
  _proto5.exec = function exec(ctx) {
    ctx.arc(this.x, this.y, this.radius, this.startAngle, this.endAngle, this.anticlockwise);
  };
  return Arc;
}();
var QuadraticCurveTo =
function () {
  function QuadraticCurveTo(cpx, cpy, x, y) {
    this.cpx = cpx;
    this.cpy = cpy;
    this.x = x;
    this.y = y;
  }
  var _proto6 = QuadraticCurveTo.prototype;
  _proto6.exec = function exec(ctx) {
    ctx.quadraticCurveTo(this.cpx, this.cpy, this.x, this.y);
  };
  return QuadraticCurveTo;
}();
var BezierCurveTo =
function () {
  function BezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
    this.cp1x = cp1x;
    this.cp1y = cp1y;
    this.cp2x = cp2x;
    this.cp2y = cp2y;
    this.x = x;
    this.y = y;
  }
  var _proto7 = BezierCurveTo.prototype;
  _proto7.exec = function exec(ctx) {
    ctx.bezierCurveTo(this.cp1x, this.cp1y, this.cp2x, this.cp2y, this.x, this.y);
  };
  return BezierCurveTo;
}();
var Rect =
function () {
  function Rect(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  var _proto8 = Rect.prototype;
  _proto8.exec = function exec(ctx) {
    ctx.rect(this.x, this.y, this.w, this.h);
  };
  return Rect;
}();
var ClosePath =
function () {
  function ClosePath() {}
  var _proto9 = ClosePath.prototype;
  _proto9.exec = function exec(ctx) {
    ctx.closePath();
  };
  return ClosePath;
}();
var BeginPath =
function () {
  function BeginPath() {}
  var _proto10 = BeginPath.prototype;
  _proto10.exec = function exec(ctx) {
    ctx.beginPath();
  };
  return BeginPath;
}();
var Fill =
function () {
  function Fill(style, matrix) {
    this.style = style;
    this.matrix = matrix;
    this.path = false;
  }
  var _proto11 = Fill.prototype;
  _proto11.exec = function exec(ctx) {
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
  _proto11.linearGradient = function linearGradient(colors, ratios, x0, y0, x1, y1) {
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
  _proto11.radialGradient = function radialGradient(colors, ratios, x0, y0, r0, x1, y1, r1) {
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
  _proto11.bitmap = function bitmap(image, repetition) {
    if (repetition === void 0) {
      repetition = "";
    }
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
var Stroke =
function (_Fill) {
  _inheritsLoose(Stroke, _Fill);
  function Stroke(style, ignoreScale) {
    var _this;
    _this = _Fill.call(this) || this;
    _this.style = style;
    _this.ignoreScale = ignoreScale;
    _this.path = false;
    return _this;
  }
  var _proto12 = Stroke.prototype;
  _proto12.exec = function exec(ctx) {
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
  return Stroke;
}(Fill);
var StrokeStyle =
function () {
  function StrokeStyle(width, caps, joints, miterLimit, ignoreScale) {
    if (width === void 0) {
      width = 1;
    }
    if (caps === void 0) {
      caps = "butt";
    }
    if (joints === void 0) {
      joints = "miter";
    }
    if (miterLimit === void 0) {
      miterLimit = 10;
    }
    if (ignoreScale === void 0) {
      ignoreScale = false;
    }
    this.width = width;
    this.caps = caps;
    this.joints = joints;
    this.miterLimit = miterLimit;
    this.ignoreScale = ignoreScale;
    this.path = false;
  }
  var _proto13 = StrokeStyle.prototype;
  _proto13.exec = function exec(ctx) {
    ctx.lineWidth = this.width;
    ctx.lineCap = isNaN(this.caps) ? this.caps : Graphics._STROKE_CAPS_MAP[this.caps];
    ctx.lineJoin = isNaN(this.joints) ? this.joints : Graphics._STROKE_JOINTS_MAP[this.joints];
    ctx.miterLimit = this.miterLimit;
    ctx.ignoreScale = this.ignoreScale;
  };
  return StrokeStyle;
}();
var StrokeDash =
function () {
  function StrokeDash(segments, offset) {
    if (segments === void 0) {
      segments = [];
    }
    if (offset === void 0) {
      offset = 0;
    }
    this.segments = segments;
    this.offset = offset;
  }
  var _proto14 = StrokeDash.prototype;
  _proto14.exec = function exec(ctx) {
    if (ctx.setLineDash) {
      ctx.setLineDash(this.segments);
      ctx.lineDashOffset = this.offset;
    }
  };
  return StrokeDash;
}();
var RoundRect =
function () {
  function RoundRect(x, y, w, h, radiusTL, radiusTR, radiusBR, radiusBL) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.radiusTL = radiusTL;
    this.radiusTR = radiusTR;
    this.radiusBR = radiusBR;
    this.radiusBL = radiusBL;
  }
  var _proto15 = RoundRect.prototype;
  _proto15.exec = function exec(ctx) {
    var max = (this.w < this.h ? this.w : this.h) / 2;
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
var Circle =
function () {
  function Circle(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
  }
  var _proto16 = Circle.prototype;
  _proto16.exec = function exec(ctx) {
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
  };
  return Circle;
}();
var Ellipse =
function () {
  function Ellipse(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  var _proto17 = Ellipse.prototype;
  _proto17.exec = function exec(ctx) {
    var x = this.x,
        y = this.y;
    var w = this.w,
        h = this.h;
    var k = 0.5522848;
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
var PolyStar =
function () {
  function PolyStar(x, y, radius, sides, pointSize, angle) {
    if (pointSize === void 0) {
      pointSize = 0;
    }
    if (angle === void 0) {
      angle = 0;
    }
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.sides = sides;
    this.pointSize = pointSize;
    this.angle = angle;
  }
  var _proto18 = PolyStar.prototype;
  _proto18.exec = function exec(ctx) {
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
        ctx.lineTo(x + Math.cos(angle) * radius * ps, y + Math.sin(angle) * radius * ps);
      }
      angle += a;
      ctx.lineTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
    }
    ctx.closePath();
  };
  return PolyStar;
}();
Graphics.beginCmd = new BeginPath();
Graphics._BASE_64 = {
  "A": 0,
  "B": 1,
  "C": 2,
  "D": 3,
  "E": 4,
  "F": 5,
  "G": 6,
  "H": 7,
  "I": 8,
  "J": 9,
  "K": 10,
  "L": 11,
  "M": 12,
  "N": 13,
  "O": 14,
  "P": 15,
  "Q": 16,
  "R": 17,
  "S": 18,
  "T": 19,
  "U": 20,
  "V": 21,
  "W": 22,
  "X": 23,
  "Y": 24,
  "Z": 25,
  "a": 26,
  "b": 27,
  "c": 28,
  "d": 29,
  "e": 30,
  "f": 31,
  "g": 32,
  "h": 33,
  "i": 34,
  "j": 35,
  "k": 36,
  "l": 37,
  "m": 38,
  "n": 39,
  "o": 40,
  "p": 41,
  "q": 42,
  "r": 43,
  "s": 44,
  "t": 45,
  "u": 46,
  "v": 47,
  "w": 48,
  "x": 49,
  "y": 50,
  "z": 51,
  "0": 52,
  "1": 53,
  "2": 54,
  "3": 55,
  "4": 56,
  "5": 57,
  "6": 58,
  "7": 59,
  "8": 60,
  "9": 61,
  "+": 62,
  "/": 63
};
Graphics._STROKE_CAPS_MAP = ["butt", "round", "square"];
Graphics._STROKE_JOINTS_MAP = ["miter", "round", "bevel"];
Graphics._ctx = createCanvas().getContext("2d");

var MovieClip =
function (_Container) {
  _inheritsLoose(MovieClip, _Container);
  function MovieClip(props) {
    var _this;
    _this = _Container.call(this) || this;
    !MovieClip.inited && MovieClip.init();
    _this.mode = props.mode != null ? props.mode : MovieClip.INDEPENDENT;
    _this.startPosition = props.startPosition != null ? props.startPosition : 0;
    if (typeof props.loop === "number") {
      _this.loop = props.loop;
    } else if (props.loop === false) {
      _this.loop = 0;
    } else {
      _this.loop = -1;
    }
    _this.currentFrame = 0;
    _this.timeline = new tweenjs.Timeline(Object.assign({
      useTicks: true,
      paused: true
    }, props));
    _this.paused = props.paused != null ? props.paused : false;
    _this.actionsEnabled = true;
    _this.autoReset = true;
    _this.frameBounds = _this.frameBounds || props.frameBounds;
    _this.framerate = null;
    _this._synchOffset = 0;
    _this._rawPosition = -1;
    _this._t = 0;
    _this._managed = {};
    _this._bound_resolveState = _this._resolveState.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }
  MovieClip.init = function init() {
    if (MovieClip.inited) {
      return;
    }
    MovieClipPlugin.install();
    MovieClip.inited = true;
  };
  var _proto = MovieClip.prototype;
  _proto.isVisible = function isVisible() {
    return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0);
  };
  _proto.draw = function draw(ctx, ignoreCache) {
    if (this.drawCache(ctx, ignoreCache)) {
      return true;
    }
    this._updateState();
    _Container.prototype.draw.call(this, ctx, ignoreCache);
    return true;
  };
  _proto.play = function play() {
    this.paused = false;
  };
  _proto.stop = function stop() {
    this.paused = true;
  };
  _proto.gotoAndPlay = function gotoAndPlay(positionOrLabel) {
    this.play();
    this._goto(positionOrLabel);
  };
  _proto.gotoAndStop = function gotoAndStop(positionOrLabel) {
    this.stop();
    this._goto(positionOrLabel);
  };
  _proto.advance = function advance(time) {
    if (this.mode !== MovieClip.INDEPENDENT) {
      return;
    }
    var o = this,
        fps = o.framerate;
    while ((o = o.parent) && fps === null) {
      if (o.mode === MovieClip.INDEPENDENT) {
        fps = o._framerate;
      }
    }
    this._framerate = fps;
    if (this.paused) {
      return;
    }
    var t = fps !== null && fps !== -1 && time !== null ? time / (1000 / fps) + this._t : 1;
    var frames = t | 0;
    this._t = t - frames;
    while (frames--) {
      this._updateTimeline(this._rawPosition + 1, false);
    }
  };
  _proto.clone = function clone() {
    throw "MovieClip cannot be cloned.";
  };
  _proto._updateState = function _updateState() {
    if (this._rawPosition === -1 || this.mode !== MovieClip.INDEPENDENT) {
      this._updateTimeline(-1);
    }
  };
  _proto._tick = function _tick(evtObj) {
    this.advance(evtObj && evtObj.delta);
    _Container.prototype._tick.call(this, evtObj);
  };
  _proto._goto = function _goto(positionOrLabel) {
    var pos = this.timeline.resolve(positionOrLabel);
    if (pos == null) {
      return;
    }
    this._t = 0;
    this._updateTimeline(pos, true);
  };
  _proto._reset = function _reset() {
    this._rawPosition = -1;
    this._t = this.currentFrame = 0;
    this.paused = false;
  };
  _proto._updateTimeline = function _updateTimeline(rawPosition, jump) {
    var synced = this.mode !== MovieClip.INDEPENDENT,
        tl = this.timeline;
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
  _proto._renderFirstFrame = function _renderFirstFrame() {
    var tl = this.timeline,
        pos = tl.rawPosition;
    tl.setPosition(0, true, true, this._bound_resolveState);
    tl.rawPosition = pos;
  };
  _proto._resolveState = function _resolveState() {
    var tl = this.timeline;
    this.currentFrame = tl.position;
    for (var n in this._managed) {
      this._managed[n] = 1;
    }
    var tweens = tl.tweens;
    for (var _iterator = tweens, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;
      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }
      var tween = _ref;
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
  _proto._setState = function _setState(state, offset) {
    if (!state) {
      return;
    }
    for (var i = state.length - 1; i >= 0; i--) {
      var o = state[i];
      var target = o.t;
      var props = o.p;
      for (var n in props) {
        target[n] = props[n];
      }
      this._addManagedChild(target, offset);
    }
  };
  _proto._addManagedChild = function _addManagedChild(child, offset) {
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
  _proto._getBounds = function _getBounds(matrix, ignoreTransform) {
    var bounds = this.getBounds();
    if (!bounds && this.frameBounds) {
      bounds = this._rectangle.copy(this.frameBounds[this.currentFrame]);
    }
    if (bounds) {
      return this._transformBounds(bounds, matrix, ignoreTransform);
    }
    return _Container.prototype._getBounds.call(this, matrix, ignoreTransform);
  };
  _createClass(MovieClip, [{
    key: "labels",
    get: function get() {
      return this.timeline.labels;
    }
  }, {
    key: "currentLabel",
    get: function get() {
      return this.timeline.currentLabel;
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
  }]);
  return MovieClip;
}(Container);
MovieClip.INDEPENDENT = "independent";
MovieClip.SINGLE_FRAME = "single";
MovieClip.SYNCHED = "synched";
MovieClip.inited = false;
var MovieClipPlugin =
function () {
  function MovieClipPlugin() {
    throw "MovieClipPlugin cannot be instantiated.";
  }
  MovieClipPlugin.install = function install() {
    tweenjs.Tween.installPlugin(MovieClipPlugin);
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
MovieClipPlugin.priority = 100;

var Shape =
function (_DisplayObject) {
  _inheritsLoose(Shape, _DisplayObject);
  function Shape(graphics) {
    var _this;
    if (graphics === void 0) {
      graphics = new Graphics();
    }
    _this = _DisplayObject.call(this) || this;
    _this.graphics = graphics;
    return _this;
  }
  var _proto = Shape.prototype;
  _proto.isVisible = function isVisible() {
    var hasContent = this.cacheCanvas || this.graphics && !this.graphics.isEmpty();
    return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent);
  };
  _proto.draw = function draw(ctx, ignoreCache) {
    if (ignoreCache === void 0) {
      ignoreCache = false;
    }
    if (_DisplayObject.prototype.draw.call(this, ctx, ignoreCache)) {
      return true;
    }
    this.graphics.draw(ctx, this);
    return true;
  };
  _proto.clone = function clone(recursive) {
    if (recursive === void 0) {
      recursive = false;
    }
    var g = recursive && this.graphics ? this.graphics.clone() : this.graphics;
    return this._cloneProps(new Shape(g));
  };
  return Shape;
}(DisplayObject);

var SpriteSheet =
function (_EventDispatcher) {
  _inheritsLoose(SpriteSheet, _EventDispatcher);
  function SpriteSheet(data) {
    var _this;
    _this = _EventDispatcher.call(this) || this;
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
  var _proto = SpriteSheet.prototype;
  _proto.getNumFrames = function getNumFrames(animation) {
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
  _proto.getAnimation = function getAnimation(name) {
    return this._data[name];
  };
  _proto.getFrame = function getFrame(frameIndex) {
    var frame;
    if (this._frames && (frame = this._frames[frameIndex])) {
      return frame;
    }
    return null;
  };
  _proto.getFrameBounds = function getFrameBounds(frameIndex, rectangle) {
    if (rectangle === void 0) {
      rectangle = new Rectangle();
    }
    var frame = this.getFrame(frameIndex);
    return frame ? rectangle.setValues(-frame.regX, -frame.regY, frame.rect.width, frame.rect.height) : null;
  };
  _proto.toString = function toString() {
    return "[" + this.constructor.name + "]";
  };
  _proto.clone = function clone() {
    throw "SpriteSheet cannot be cloned.";
  };
  _proto._parseData = function _parseData(data) {
    var _this2 = this;
    if (data == null) {
      return;
    }
    this.framerate = data.framerate || 0;
    if (data.images) {
      var _loop = function _loop() {
        if (_isArray) {
          if (_i >= _iterator.length) return "break";
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) return "break";
          _ref = _i.value;
        }
        var img = _ref;
        var a = _this2._images = [];
        var src = void 0;
        if (typeof img === "string") {
          src = img;
          img = document.createElement("img");
          img.src = src;
        }
        a.push(img);
        if (!img.getContext && !img.naturalWidth) {
          _this2._loadCount++;
          _this2.complete = false;
          img.onload = function () {
            return _this2._handleImageLoad(src);
          };
          img.onerror = function () {
            return _this2._handleImageError(src);
          };
        }
      };
      for (var _iterator = data.images, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;
        var _ret = _loop();
        if (_ret === "break") break;
      }
    }
    if (data.frames != null) {
      if (Array.isArray(data.frames)) {
        this._frames = [];
        for (var _iterator2 = data.frames, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
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
          a = anim.frames = [obj];
        } else if (Array.isArray(obj)) {
          if (obj.length === 1) {
            anim.frames = [obj[0]];
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
          a = anim.frames = typeof frames === "number" ? [frames] : frames.slice(0);
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
  _proto._handleImageLoad = function _handleImageLoad(src) {
    if (--this._loadCount === 0) {
      this._calculateFrames();
      this.complete = true;
      this.dispatchEvent("complete");
    }
  };
  _proto._handleImageError = function _handleImageError(src) {
    var errorEvent = new Event("error");
    errorEvent.src = src;
    this.dispatchEvent(errorEvent);
    if (--this._loadCount === 0) {
      this.dispatchEvent("complete");
    }
  };
  _proto._calculateFrames = function _calculateFrames() {
    if (this._frames || this._frameWidth === 0) {
      return;
    }
    this._frames = [];
    var maxFrames = this._numFrames || 100000;
    var frameCount = 0,
        frameWidth = this._frameWidth,
        frameHeight = this._frameHeight;
    var spacing = this._spacing,
        margin = this._margin;
    imgLoop: for (var i = 0, imgs = this._images, l = imgs.length; i < l; i++) {
      var img = imgs[i],
          imgW = img.width || img.naturalWidth,
          imgH = img.height || img.naturalHeight;
      var y = margin;
      while (y <= imgH - margin - frameHeight) {
        var x = margin;
        while (x <= imgW - margin - frameWidth) {
          if (frameCount >= maxFrames) {
            break imgLoop;
          }
          frameCount++;
          this._frames.push({
            image: img,
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
  _createClass(SpriteSheet, [{
    key: "animations",
    get: function get() {
      return this._animations.slice();
    }
  }]);
  return SpriteSheet;
}(EventDispatcher);

var Text =
function (_DisplayObject) {
  _inheritsLoose(Text, _DisplayObject);
  function Text(text, font, color) {
    var _this;
    _this = _DisplayObject.call(this) || this;
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
  var _proto = Text.prototype;
  _proto.isVisible = function isVisible() {
    var hasContent = this.cacheCanvas || this.text != null && this.text !== "";
    return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent);
  };
  _proto.draw = function draw(ctx, ignoreCache) {
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
  _proto.getMeasuredWidth = function getMeasuredWidth() {
    return this._getMeasuredWidth(this.text);
  };
  _proto.getMeasuredLineHeight = function getMeasuredLineHeight() {
    return this._getMeasuredWidth("M") * 1.2;
  };
  _proto.getMeasuredHeight = function getMeasuredHeight() {
    return this._drawText(null, {}).height;
  };
  _proto.getBounds = function getBounds() {
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
  _proto.getMetrics = function getMetrics() {
    var o = {
      lines: []
    };
    o.lineHeight = this.lineHeight || this.getMeasuredLineHeight();
    o.vOffset = o.lineHeight * Text.V_OFFSETS[this.textBaseline || "top"];
    return this._drawText(null, o, o.lines);
  };
  _proto.clone = function clone() {
    return this._cloneProps(new Text(this.text, this.font, this.color));
  };
  _proto.toString = function toString() {
    return "[" + this.constructor.name + " (text=" + (this.text.length > 20 ? this.text.substr(0, 17) + "..." : this.text) + ")]";
  };
  _proto._cloneProps = function _cloneProps(o) {
    _DisplayObject.prototype._cloneProps.call(this, o);
    o.textAlign = this.textAlign;
    o.textBaseline = this.textBaseline;
    o.maxWidth = this.maxWidth;
    o.outline = this.outline;
    o.lineHeight = this.lineHeight;
    o.lineWidth = this.lineWidth;
    return o;
  };
  _proto._prepContext = function _prepContext(ctx) {
    ctx.font = this.font || "10px sans-serif";
    ctx.textAlign = this.textAlign || "left";
    ctx.textBaseline = this.textBaseline || "top";
    ctx.lineJoin = "miter";
    ctx.miterLimit = 2.5;
    return ctx;
  };
  _proto._drawText = function _drawText(ctx, o, lines) {
    var paint = !!ctx;
    if (!paint) {
      ctx = Text._ctx;
      ctx.save();
      this._prepContext(ctx);
    }
    var lineHeight = this.lineHeight || this.getMeasuredLineHeight();
    var maxW = 0,
        count = 0;
    var hardLines = String(this.text).split(/(?:\r\n|\r|\n)/);
    for (var _iterator = hardLines, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
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
  _proto._drawTextLine = function _drawTextLine(ctx, text, y) {
    if (this.outline) {
      ctx.strokeText(text, 0, y, this.maxWidth || 0xFFFF);
    } else {
      ctx.fillText(text, 0, y, this.maxWidth || 0xFFFF);
    }
  };
  _proto._getMeasuredWidth = function _getMeasuredWidth(text) {
    var ctx = Text._ctx;
    ctx.save();
    var w = this._prepContext(ctx).measureText(text).width;
    ctx.restore();
    return w;
  };
  return Text;
}(DisplayObject);
Text.H_OFFSETS = {
  start: 0,
  left: 0,
  center: -0.5,
  end: -1,
  right: -1
};
Text.V_OFFSETS = {
  top: 0,
  hanging: -0.01,
  middle: -0.4,
  alphabetic: -0.8,
  ideographic: -0.85,
  bottom: -1
};
Text._ctx = createCanvas().getContext("2d");

var AlphaMapFilter =
function (_Filter) {
  _inheritsLoose(AlphaMapFilter, _Filter);
  function AlphaMapFilter(alphaMap) {
    var _this;
    _this = _Filter.call(this) || this;
    _this.alphaMap = alphaMap;
    _this._alphaMap = null;
    _this._mapData = null;
    _this._mapTexture = null;
    _this.FRAG_SHADER_BODY = "\n\t\t\tuniform sampler2D uAlphaSampler;\n\n\t\t\tvoid main (void) {\n\t\t\t\tvec4 color = texture2D(uSampler, vRenderCoord);\n\t\t\t\tvec4 alphaMap = texture2D(uAlphaSampler, vTextureCoord);\n\n\t\t\t\t// some image formats can have transparent white rgba(1,1,1, 0) when put on the GPU, this means we need a slight tweak\n\t\t\t\t// using ceil ensure that the colour will be used so long as it exists but pure transparency will be treated black\n\t\t\t\tgl_FragColor = vec4(color.rgb, color.a * (alphaMap.r * ceil(alphaMap.a)));\n\t\t\t}\n\t\t";
    return _this;
  }
  var _proto = AlphaMapFilter.prototype;
  _proto.shaderParamSetup = function shaderParamSetup(gl, stage, shaderProgram) {
    if (!this._mapTexture) {
      this._mapTexture = gl.createTexture();
    }
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this._mapTexture);
    stage.setTextureParams(gl);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.alphaMap);
    gl.uniform1i(gl.getUniformLocation(shaderProgram, "uAlphaSampler"), 1);
  };
  _proto.clone = function clone() {
    var o = new AlphaMapFilter(this.alphaMap);
    o._alphaMap = this._alphaMap;
    o._mapData = this._mapData;
    return o;
  };
  _proto._applyFilter = function _applyFilter(imageData) {
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
  _proto._prepAlphaMap = function _prepAlphaMap() {
    if (!this.alphaMap) {
      return false;
    }
    if (this.alphaMap === this._alphaMap && this._mapData) {
      return true;
    }
    this._mapData = null;
    var map = this._alphaMap = this.alphaMap;
    var canvas = map;
    var ctx;
    if (map instanceof HTMLCanvasElement) {
      ctx = canvas.getContext("2d");
    } else {
      canvas = window.createjs && createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas");
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

var AlphaMaskFilter =
function (_Filter) {
  _inheritsLoose(AlphaMaskFilter, _Filter);
  function AlphaMaskFilter(mask) {
    var _this;
    _this = _Filter.call(this) || this;
    _this.mask = mask;
    _this.usesContext = true;
    _this.FRAG_SHADER_BODY = "\n\t\t\tuniform sampler2D uAlphaSampler;\n\n\t\t\tvoid main (void) {\n\t\t\t\tvec4 color = texture2D(uSampler, vRenderCoord);\n\t\t\t\tvec4 alphaMap = texture2D(uAlphaSampler, vTextureCoord);\n\n\t\t\t\tgl_FragColor = vec4(color.rgb, color.a * alphaMap.a);\n\t\t\t}\n\t\t";
    return _this;
  }
  var _proto = AlphaMaskFilter.prototype;
  _proto.applyFilter = function applyFilter(ctx, x, y, width, height, targetCtx, targetX, targetY) {
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
  _proto.clone = function clone() {
    return new AlphaMaskFilter(this.mask);
  };
  _proto.shaderParamSetup = function shaderParamSetup(gl, stage, shaderProgram) {
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

var BlurFilter =
function (_Filter) {
  _inheritsLoose(BlurFilter, _Filter);
  function BlurFilter(blurX, blurY, quality) {
    var _this;
    if (blurX === void 0) {
      blurX = 0;
    }
    if (blurY === void 0) {
      blurY = 0;
    }
    if (quality === void 0) {
      quality = 1;
    }
    _this = _Filter.call(this) || this;
    _this._blurX = blurX;
    _this._blurXTable = [];
    _this._lastBlurX = null;
    _this._blurY = blurY;
    _this._blurYTable = [];
    _this._lastBlurY = null;
    _this._quality = isNaN(quality) || quality < 1 ? 1 : quality;
    _this._lastQuality = null;
    _this.FRAG_SHADER_TEMPLATE = "\n\t\t\tuniform float xWeight[{{blurX}}];\n\t\t\tuniform float yWeight[{{blurY}}];\n\t\t\tuniform vec2 textureOffset;\n\t\t\tvoid main (void) {\n\t\t\t\tvec4 color = vec4(0.0);\n\n\t\t\t\tfloat xAdj = ({{blurX}}.0-1.0)/2.0;\n\t\t\t\tfloat yAdj = ({{blurY}}.0-1.0)/2.0;\n\t\t\t\tvec2 sampleOffset;\n\n\t\t\t\tfor(int i=0; i<{{blurX}}; i++) {\n\t\t\t\t\tfor(int j=0; j<{{blurY}}; j++) {\n\t\t\t\t\t\tsampleOffset = vRenderCoord + (textureOffset * vec2(float(i)-xAdj, float(j)-yAdj));\n\t\t\t\t\t\tcolor += texture2D(uSampler, sampleOffset) * (xWeight[i] * yWeight[j]);\n\t\t\t\t\t}\n\t\t\t\t}\n\n\t\t\t\tgl_FragColor = color.rgba;\n\t\t\t}\n\t\t";
    return _this;
  }
  var _proto = BlurFilter.prototype;
  _proto.shaderParamSetup = function shaderParamSetup(gl, stage, shaderProgram) {
    gl.uniform1fv(gl.getUniformLocation(shaderProgram, "xWeight"), this._blurXTable);
    gl.uniform1fv(gl.getUniformLocation(shaderProgram, "yWeight"), this._blurYTable);
    gl.uniform2f(gl.getUniformLocation(shaderProgram, "textureOffset"), 2 / (stage._viewportWidth * this._quality), 2 / (stage._viewportHeight * this._quality));
  };
  _proto.getBounds = function getBounds(rect) {
    var x = this.blurX | 0,
        y = this.blurY | 0;
    if (x <= 0 && y <= 0) {
      return rect;
    }
    var q = Math.pow(this.quality, 0.2);
    return (rect || new Rectangle()).pad(y * q + 1, x * q + 1, y * q + 1, x * q + 1);
  };
  _proto.clone = function clone() {
    return new BlurFilter(this.blurX, this.blurY, this.quality);
  };
  _proto._updateShader = function _updateShader() {
    var result = this.FRAG_SHADER_TEMPLATE;
    result = result.replace(/{{blurX}}/g, this._blurXTable.length.toFixed(0));
    result = result.replace(/{{blurY}}/g, this._blurYTable.length.toFixed(0));
    this.FRAG_SHADER_BODY = result;
  };
  _proto._getTable = function _getTable(spread) {
    var EDGE = 4.2;
    if (spread <= 1) {
      return [1];
    }
    var result = [];
    var count = Math.ceil(spread * 2);
    count += count % 2 ? 0 : 1;
    var adjust = count / 2 | 0;
    for (var i = -adjust; i <= adjust; i++) {
      var x = i / adjust * EDGE;
      result.push(1 / Math.sqrt(2 * Math.PI) * Math.pow(Math.E, -(Math.pow(x, 2) / 4)));
    }
    var factor = result.reduce(function (a, b) {
      return a + b;
    }, 0);
    return result.map(function (currentValue) {
      return currentValue / factor;
    });
  };
  _proto._applyFilter = function _applyFilter(imageData) {
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
  _createClass(BlurFilter, [{
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
      return this._quality | 0;
    },
    set: function set(quality) {
      if (isNaN(quality) || quality < 0) {
        quality = 0;
      }
      this._quality = quality;
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
      this._compiledShader = value;
    }
  }]);
  return BlurFilter;
}(Filter);
BlurFilter.MUL_TABLE = [1, 171, 205, 293, 57, 373, 79, 137, 241, 27, 391, 357, 41, 19, 283, 265, 497, 469, 443, 421, 25, 191, 365, 349, 335, 161, 155, 149, 9, 278, 269, 261, 505, 245, 475, 231, 449, 437, 213, 415, 405, 395, 193, 377, 369, 361, 353, 345, 169, 331, 325, 319, 313, 307, 301, 37, 145, 285, 281, 69, 271, 267, 263, 259, 509, 501, 493, 243, 479, 118, 465, 459, 113, 446, 55, 435, 429, 423, 209, 413, 51, 403, 199, 393, 97, 3, 379, 375, 371, 367, 363, 359, 355, 351, 347, 43, 85, 337, 333, 165, 327, 323, 5, 317, 157, 311, 77, 305, 303, 75, 297, 294, 73, 289, 287, 71, 141, 279, 277, 275, 68, 135, 67, 133, 33, 262, 260, 129, 511, 507, 503, 499, 495, 491, 61, 121, 481, 477, 237, 235, 467, 232, 115, 457, 227, 451, 7, 445, 221, 439, 218, 433, 215, 427, 425, 211, 419, 417, 207, 411, 409, 203, 202, 401, 399, 396, 197, 49, 389, 387, 385, 383, 95, 189, 47, 187, 93, 185, 23, 183, 91, 181, 45, 179, 89, 177, 11, 175, 87, 173, 345, 343, 341, 339, 337, 21, 167, 83, 331, 329, 327, 163, 81, 323, 321, 319, 159, 79, 315, 313, 39, 155, 309, 307, 153, 305, 303, 151, 75, 299, 149, 37, 295, 147, 73, 291, 145, 289, 287, 143, 285, 71, 141, 281, 35, 279, 139, 69, 275, 137, 273, 17, 271, 135, 269, 267, 133, 265, 33, 263, 131, 261, 130, 259, 129, 257, 1];
BlurFilter.SHG_TABLE = [0, 9, 10, 11, 9, 12, 10, 11, 12, 9, 13, 13, 10, 9, 13, 13, 14, 14, 14, 14, 10, 13, 14, 14, 14, 13, 13, 13, 9, 14, 14, 14, 15, 14, 15, 14, 15, 15, 14, 15, 15, 15, 14, 15, 15, 15, 15, 15, 14, 15, 15, 15, 15, 15, 15, 12, 14, 15, 15, 13, 15, 15, 15, 15, 16, 16, 16, 15, 16, 14, 16, 16, 14, 16, 13, 16, 16, 16, 15, 16, 13, 16, 15, 16, 14, 9, 16, 16, 16, 16, 16, 16, 16, 16, 16, 13, 14, 16, 16, 15, 16, 16, 10, 16, 15, 16, 14, 16, 16, 14, 16, 16, 14, 16, 16, 14, 15, 16, 16, 16, 14, 15, 14, 15, 13, 16, 16, 15, 17, 17, 17, 17, 17, 17, 14, 15, 17, 17, 16, 16, 17, 16, 15, 17, 16, 17, 11, 17, 16, 17, 16, 17, 16, 17, 17, 16, 17, 17, 16, 17, 17, 16, 16, 17, 17, 17, 16, 14, 17, 17, 17, 17, 15, 16, 14, 16, 15, 16, 13, 16, 15, 16, 14, 16, 15, 16, 12, 16, 15, 16, 17, 17, 17, 17, 17, 13, 16, 15, 17, 17, 17, 16, 15, 17, 17, 17, 16, 15, 17, 17, 14, 16, 17, 17, 16, 17, 17, 16, 15, 17, 16, 14, 17, 16, 15, 17, 16, 17, 17, 16, 17, 15, 16, 17, 14, 17, 16, 15, 17, 16, 17, 13, 17, 16, 17, 17, 16, 17, 14, 17, 16, 17, 16, 17, 16, 17, 9];

var ColorFilter =
function (_Filter) {
  _inheritsLoose(ColorFilter, _Filter);
  function ColorFilter(redMultiplier, greenMultiplier, blueMultiplier, alphaMultiplier, redOffset, greenOffset, blueOffset, alphaOffset) {
    var _this;
    if (redMultiplier === void 0) {
      redMultiplier = 1;
    }
    if (greenMultiplier === void 0) {
      greenMultiplier = 1;
    }
    if (blueMultiplier === void 0) {
      blueMultiplier = 1;
    }
    if (alphaMultiplier === void 0) {
      alphaMultiplier = 1;
    }
    if (redOffset === void 0) {
      redOffset = 0;
    }
    if (greenOffset === void 0) {
      greenOffset = 0;
    }
    if (blueOffset === void 0) {
      blueOffset = 0;
    }
    if (alphaOffset === void 0) {
      alphaOffset = 0;
    }
    _this = _Filter.call(this) || this;
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
  var _proto = ColorFilter.prototype;
  _proto.shaderParamSetup = function shaderParamSetup(gl, stage, shaderProgram) {
    gl.uniform4f(gl.getUniformLocation(shaderProgram, "uColorMultiplier"), this.redMultiplier, this.greenMultiplier, this.blueMultiplier, this.alphaMultiplier);
    gl.uniform4f(gl.getUniformLocation(shaderProgram, "uColorOffset"), this.redOffset / 255, this.greenOffset / 255, this.blueOffset / 255, this.alphaOffset / 255);
  };
  _proto.clone = function clone() {
    return new ColorFilter(this.redMultiplier, this.greenMultiplier, this.blueMultiplier, this.alphaMultiplier, this.redOffset, this.greenOffset, this.blueOffset, this.alphaOffset);
  };
  _proto._applyFilter = function _applyFilter(imageData) {
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

var ColorMatrix =
function () {
  function ColorMatrix(brightness, contrast, saturation, hue) {
    this.setColor(brightness, contrast, saturation, hue);
  }
  var _proto = ColorMatrix.prototype;
  _proto.setColor = function setColor(brightness, contrast, saturation, hue) {
    return this.reset().adjustColor(brightness, contrast, saturation, hue);
  };
  _proto.reset = function reset() {
    return this.copy(ColorMatrix.IDENTITY_MATRIX);
  };
  _proto.adjustColor = function adjustColor(brightness, contrast, saturation, hue) {
    return this.adjustBrightness(brightness).adjustContrast(contrast).adjustSaturation(saturation).adjustHue(hue);
  };
  _proto.adjustBrightness = function adjustBrightness(value) {
    if (value === 0 || isNaN(value)) {
      return this;
    }
    value = this._cleanValue(value, 255);
    this._multiplyMatrix([1, 0, 0, 0, value, 0, 1, 0, 0, value, 0, 0, 1, 0, value, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1]);
    return this;
  };
  _proto.adjustContrast = function adjustContrast(value) {
    if (value === 0 || isNaN(value)) {
      return this;
    }
    value = this._cleanValue(value, 100);
    var x;
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
    this._multiplyMatrix([x / 127, 0, 0, 0, 0.5 * (127 - x), 0, x / 127, 0, 0, 0.5 * (127 - x), 0, 0, x / 127, 0, 0.5 * (127 - x), 0, 0, 0, 1, 0, 0, 0, 0, 0, 1]);
    return this;
  };
  _proto.adjustSaturation = function adjustSaturation(value) {
    if (value === 0 || isNaN(value)) {
      return this;
    }
    value = this._cleanValue(value, 100);
    var x = 1 + (value > 0 ? 3 * value / 100 : value / 100);
    var lumR = 0.3086;
    var lumG = 0.6094;
    var lumB = 0.0820;
    this._multiplyMatrix([lumR * (1 - x) + x, lumG * (1 - x), lumB * (1 - x), 0, 0, lumR * (1 - x), lumG * (1 - x) + x, lumB * (1 - x), 0, 0, lumR * (1 - x), lumG * (1 - x), lumB * (1 - x) + x, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1]);
    return this;
  };
  _proto.adjustHue = function adjustHue(value) {
    if (value === 0 || isNaN(value)) {
      return this;
    }
    value = this._cleanValue(value, 180) / 180 * Math.PI;
    var cosVal = Math.cos(value);
    var sinVal = Math.sin(value);
    var lumR = 0.213;
    var lumG = 0.715;
    var lumB = 0.072;
    this._multiplyMatrix([lumR + cosVal * (1 - lumR) + sinVal * -lumR, lumG + cosVal * -lumG + sinVal * -lumG, lumB + cosVal * -lumB + sinVal * (1 - lumB), 0, 0, lumR + cosVal * -lumR + sinVal * 0.143, lumG + cosVal * (1 - lumG) + sinVal * 0.140, lumB + cosVal * -lumB + sinVal * -0.283, 0, 0, lumR + cosVal * -lumR + sinVal * -(1 - lumR), lumG + cosVal * -lumG + sinVal * lumG, lumB + cosVal * (1 - lumB) + sinVal * lumB, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1]);
    return this;
  };
  _proto.concat = function concat(matrix) {
    matrix = this._fixMatrix(matrix);
    if (matrix.length != ColorMatrix.LENGTH) {
      return this;
    }
    this._multiplyMatrix(matrix);
    return this;
  };
  _proto.clone = function clone() {
    return new ColorMatrix().copy(this);
  };
  _proto.toArray = function toArray() {
    var arr = [];
    var l = ColorMatrix.LENGTH;
    for (var i = 0; i < l; i++) {
      arr[i] = this[i];
    }
    return arr;
  };
  _proto.copy = function copy(matrix) {
    var l = ColorMatrix.LENGTH;
    for (var i = 0; i < l; i++) {
      this[i] = matrix[i];
    }
    return this;
  };
  _proto.toString = function toString() {
    return "[" + this.constructor.name + "]";
  };
  _proto._multiplyMatrix = function _multiplyMatrix(matrix) {
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
  _proto._cleanValue = function _cleanValue(value, limit) {
    return Math.min(limit, Math.max(-limit, value));
  };
  _proto._fixMatrix = function _fixMatrix(matrix) {
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
  return ColorMatrix;
}();
ColorMatrix.DELTA_INDEX = Object.freeze([0, 0.01, 0.02, 0.04, 0.05, 0.06, 0.07, 0.08, 0.1, 0.11, 0.12, 0.14, 0.15, 0.16, 0.17, 0.18, 0.20, 0.21, 0.22, 0.24, 0.25, 0.27, 0.28, 0.30, 0.32, 0.34, 0.36, 0.38, 0.40, 0.42, 0.44, 0.46, 0.48, 0.5, 0.53, 0.56, 0.59, 0.62, 0.65, 0.68, 0.71, 0.74, 0.77, 0.80, 0.83, 0.86, 0.89, 0.92, 0.95, 0.98, 1.0, 1.06, 1.12, 1.18, 1.24, 1.30, 1.36, 1.42, 1.48, 1.54, 1.60, 1.66, 1.72, 1.78, 1.84, 1.90, 1.96, 2.0, 2.12, 2.25, 2.37, 2.50, 2.62, 2.75, 2.87, 3.0, 3.2, 3.4, 3.6, 3.8, 4.0, 4.3, 4.7, 4.9, 5.0, 5.5, 6.0, 6.5, 6.8, 7.0, 7.3, 7.5, 7.8, 8.0, 8.4, 8.7, 9.0, 9.4, 9.6, 9.8, 10.0]);
ColorMatrix.IDENTITY_MATRIX = Object.freeze([1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1]);
ColorMatrix.LENGTH = 25;

var ColorMatrixFilter =
function (_Filter) {
  _inheritsLoose(ColorMatrixFilter, _Filter);
  function ColorMatrixFilter(matrix) {
    var _this;
    _this = _Filter.call(this) || this;
    _this.matrix = matrix;
    _this.FRAG_SHADER_BODY = "\n\t\t\tuniform mat4 uColorMatrix;\n\t\t\tuniform vec4 uColorMatrixOffset;\n\n\t\t\tvoid main (void) {\n\t\t\t\tvec4 color = texture2D(uSampler, vRenderCoord);\n\n\t\t\t\tmat4 m = uColorMatrix;\n\t\t\t\tvec4 newColor = vec4(0,0,0,0);\n\t\t\t\tnewColor.r = color.r*m[0][0] + color.g*m[0][1] + color.b*m[0][2] + color.a*m[0][3];\n\t\t\t\tnewColor.g = color.r*m[1][0] + color.g*m[1][1] + color.b*m[1][2] + color.a*m[1][3];\n\t\t\t\tnewColor.b = color.r*m[2][0] + color.g*m[2][1] + color.b*m[2][2] + color.a*m[2][3];\n\t\t\t\tnewColor.a = color.r*m[3][0] + color.g*m[3][1] + color.b*m[3][2] + color.a*m[3][3];\n\n\t\t\t\tgl_FragColor = newColor + uColorMatrixOffset;\n\t\t\t}\n\t\t";
    return _this;
  }
  var _proto = ColorMatrixFilter.prototype;
  _proto.shaderParamSetup = function shaderParamSetup(gl, stage, shaderProgram) {
    var mat = this.matrix;
    var colorMatrix = new Float32Array([mat[0], mat[1], mat[2], mat[3], mat[5], mat[6], mat[7], mat[8], mat[10], mat[11], mat[12], mat[13], mat[15], mat[16], mat[17], mat[18]]);
    gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "uColorMatrix"), false, colorMatrix);
    gl.uniform4f(gl.getUniformLocation(shaderProgram, "uColorMatrixOffset"), mat[4] / 255, mat[9] / 255, mat[14] / 255, mat[19] / 255);
  };
  _proto.clone = function clone() {
    return new ColorMatrixFilter(this.matrix);
  };
  _proto._applyFilter = function _applyFilter(imageData) {
    var data = imageData.data;
    var l = data.length;
    var r, g, b, a;
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
      data[i] = r * m0 + g * m1 + b * m2 + a * m3 + m4;
      data[i + 1] = r * m5 + g * m6 + b * m7 + a * m8 + m9;
      data[i + 2] = r * m10 + g * m11 + b * m12 + a * m13 + m14;
      data[i + 3] = r * m15 + g * m16 + b * m17 + a * m18 + m19;
    }
    return true;
  };
  return ColorMatrixFilter;
}(Filter);

var ButtonHelper =
function () {
  function ButtonHelper(target, outLabel, overLabel, downLabel, play, hitArea, hitLabel) {
    if (outLabel === void 0) {
      outLabel = "out";
    }
    if (overLabel === void 0) {
      overLabel = "over";
    }
    if (downLabel === void 0) {
      downLabel = "down";
    }
    if (play === void 0) {
      play = false;
    }
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
  var _proto = ButtonHelper.prototype;
  _proto.toString = function toString() {
    return "[" + this.constructor.name + "]";
  };
  _proto.handleEvent = function handleEvent(evt) {
    var label,
        t = this.target,
        type = evt.type;
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
  _proto._reset = function _reset() {
    var p = this.paused;
    this.__reset();
    this.paused = p;
  };
  _createClass(ButtonHelper, [{
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
  }]);
  return ButtonHelper;
}();

var Touch = {
  isSupported: function isSupported() {
    return !!('ontouchstart' in window ||
    window.MSPointerEvent && window.navigator.msMaxTouchPoints > 0
    || window.PointerEvent && window.navigator.maxTouchPoints > 0);
  },
  enable: function enable(stage, singleTouch, allowDefault) {
    if (singleTouch === void 0) {
      singleTouch = false;
    }
    if (allowDefault === void 0) {
      allowDefault = false;
    }
    if (!stage || !stage.canvas || !this.isSupported()) {
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
    if ('ontouchstart' in window) {
      this._IOS_enable(stage);
    } else if (window.PointerEvent || window.MSPointerEvent) {
      this._IE_enable(stage);
    }
    return true;
  },
  disable: function disable(stage) {
    if (!stage) {
      return;
    }
    if ('ontouchstart' in window) {
      this._IOS_disable(stage);
    } else if (window.PointerEvent || window.MSPointerEvent) {
      this._IE_disable(stage);
    }
    delete stage.__touch;
  },
  _IOS_enable: function _IOS_enable(stage) {
    var _this = this;
    var canvas = stage.canvas;
    var f = stage.__touch.f = function (e) {
      return _this._IOS_handleEvent(stage, e);
    };
    canvas.addEventListener("touchstart", f, false);
    canvas.addEventListener("touchmove", f, false);
    canvas.addEventListener("touchend", f, false);
    canvas.addEventListener("touchcancel", f, false);
  },
  _IOS_disable: function _IOS_disable(stage) {
    var canvas = stage.canvas;
    if (!canvas) {
      return;
    }
    var f = stage.__touch.f;
    canvas.removeEventListener("touchstart", f, false);
    canvas.removeEventListener("touchmove", f, false);
    canvas.removeEventListener("touchend", f, false);
    canvas.removeEventListener("touchcancel", f, false);
  },
  _IOS_handleEvent: function _IOS_handleEvent(stage, e) {
    if (!stage) {
      return;
    }
    if (stage.__touch.preventDefault) {
      e.preventDefault && e.preventDefault();
    }
    var touches = e.changedTouches;
    var type = e.type;
    var l = touches.length;
    for (var _iterator = touches, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
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
  },
  _IE_enable: function _IE_enable(stage) {
    var _this2 = this;
    var canvas = stage.canvas;
    var f = stage.__touch.f = function (e) {
      return _this2._IE_handleEvent(stage, e);
    };
    if (window.PointerEvent === undefined) {
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
  },
  _IE_disable: function _IE_disable(stage) {
    var f = stage.__touch.f;
    if (window.PointerEvent === undefined) {
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
  },
  _IE_handleEvent: function _IE_handleEvent(stage, e) {
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
  },
  _handleStart: function _handleStart(stage, id, e, x, y) {
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
  },
  _handleMove: function _handleMove(stage, id, e, x, y) {
    if (!stage.__touch.pointers[id]) {
      return;
    }
    stage._handlePointerMove(id, e, x, y);
  },
  _handleEnd: function _handleEnd(stage, id, e) {
    var props = stage.__touch;
    var ids = props.pointers;
    if (!ids[id]) {
      return;
    }
    props.count--;
    stage._handlePointerUp(id, e, true);
    delete ids[id];
  }
};

var SpriteSheetBuilder =
function (_EventDispatcher) {
  _inheritsLoose(SpriteSheetBuilder, _EventDispatcher);
  function SpriteSheetBuilder(framerate) {
    var _this;
    if (framerate === void 0) {
      framerate = 0;
    }
    _this = _EventDispatcher.call(this) || this;
    _this.maxWidth = 2048;
    _this.maxHeight = 2048;
    _this.spriteSheet = null;
    _this.scale = 1;
    _this.padding = 1;
    _this.timeSlice = 0.3;
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
  var _proto = SpriteSheetBuilder.prototype;
  _proto.addFrame = function addFrame(source, sourceRect, scale, setupFunction, setupData) {
    if (scale === void 0) {
      scale = 1;
    }
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
  _proto.addAnimation = function addAnimation(name, frames, next, speed) {
    if (this._data) {
      throw SpriteSheetBuilder.ERR_RUNNING;
    }
    this._animations[name] = {
      frames: frames,
      next: next,
      speed: speed
    };
  };
  _proto.addMovieClip = function addMovieClip(source, sourceRect, scale, setupFunction, setupData, labelFunction) {
    if (scale === void 0) {
      scale = 1;
    }
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
      lbls.sort(function (a, b) {
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
  _proto.build = function build() {
    if (this._data) {
      throw SpriteSheetBuilder.ERR_RUNNING;
    }
    this._startBuild();
    while (this._drawNext()) {}
    this._endBuild();
    return this.spriteSheet;
  };
  _proto.buildAsync = function buildAsync(timeSlice) {
    var _this2 = this;
    if (this._data) {
      throw SpriteSheetBuilder.ERR_RUNNING;
    }
    this.timeSlice = timeSlice;
    this._startBuild();
    this._timerID = setTimeout(function () {
      return _this2._run();
    }, 50 - Math.max(0.01, Math.min(0.99, this.timeSlice || 0.3)) * 50);
  };
  _proto.stopAsync = function stopAsync() {
    clearTimeout(this._timerID);
    this._data = null;
  };
  _proto.toString = function toString() {
    return "[" + this.constructor.name + "]";
  };
  _proto._startBuild = function _startBuild() {
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
      return a.height <= b.height ? -1 : 1;
    });
    if (frames[frames.length - 1].height + pad * 2 > this.maxHeight) {
      throw SpriteSheetBuilder.ERR_DIMENSIONS;
    }
    var y = 0,
        x = 0;
    var img = 0;
    while (frames.length) {
      var o = this._fillRow(frames, y, img, dataFrames, pad);
      if (o.w > x) {
        x = o.w;
      }
      y += o.h;
      if (!o.h || !frames.length) {
        var canvas = window.createjs && createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas");
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
  _proto._setupMovieClipFrame = function _setupMovieClipFrame(source, data) {
    var ae = source.actionsEnabled;
    source.actionsEnabled = false;
    source.gotoAndStop(data.i);
    source.actionsEnabled = ae;
    data.f && data.f(source, data.d, data.i);
  };
  _proto._getSize = function _getSize(size, max) {
    var pow = 4;
    while (Math.pow(2, ++pow) < size) {}
    return Math.min(max, Math.pow(2, pow));
  };
  _proto._fillRow = function _fillRow(frames, y, img, dataFrames, pad) {
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
      dataFrames[frame.index] = [x, y, rw, rh, img, Math.round(-rx + sc * source.regX - pad), Math.round(-ry + sc * source.regY - pad)];
      x += rw;
    }
    return {
      w: x,
      h: height
    };
  };
  _proto._endBuild = function _endBuild() {
    this.spriteSheet = new SpriteSheet(this._data);
    this._data = null;
    this.progress = 1;
    this.dispatchEvent("complete");
  };
  _proto._run = function _run() {
    var _this3 = this;
    var ts = Math.max(0.01, Math.min(0.99, this.timeSlice || 0.3)) * 50;
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
      this._timerID = setTimeout(function () {
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
  _proto._drawNext = function _drawNext() {
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
  return SpriteSheetBuilder;
}(EventDispatcher);
SpriteSheetBuilder.ERR_DIMENSIONS = "frame dimensions exceed max spritesheet dimensions";
SpriteSheetBuilder.ERR_RUNNING = "a build is already running";

var SpriteSheetUtils = {
  _workingCanvas: createCanvas(),
  get _workingContext() {
    return this._workingCanvas.getContext("2d");
  },
  extractFrame: function extractFrame(spriteSheet, frameOrAnimation) {
    if (isNaN(frameOrAnimation)) {
      frameOrAnimation = spriteSheet.getAnimation(frameOrAnimation).frames[0];
    }
    var data = spriteSheet.getFrame(frameOrAnimation);
    if (!data) {
      return null;
    }
    var r = data.rect;
    var canvas = this._workingCanvas;
    canvas.width = r.width;
    canvas.height = r.height;
    this._workingContext.drawImage(data.image, r.x, r.y, r.width, r.height, 0, 0, r.width, r.height);
    var img = document.createElement("img");
    img.src = canvas.toDataURL("image/png");
    return img;
  },
  _flip: function _flip(spriteSheet, count, h, v) {
    var imgs = spriteSheet._images;
    var canvas = this._workingCanvas;
    var ctx = this._workingContext;
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
  }
};

var WebGLInspector =
function (_EventDispatcher) {
  _inheritsLoose(WebGLInspector, _EventDispatcher);
  function WebGLInspector(stage) {
    var _this;
    _this = _EventDispatcher.call(this) || this;
    _this._stage = stage;
    return _this;
  }
  WebGLInspector.dispProps = function dispProps(item, prepend) {
    if (prepend === void 0) {
      prepend = "";
    }
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
  var _proto = WebGLInspector.prototype;
  _proto.log = function log(stage) {
    if (!stage) {
      stage = this._stage;
    }
    WebGLInspector._log("Batches Per Draw: " + (stage._batchID / stage._drawID).toFixed(4));
    this.logContextInfo(stage._webGLContext);
    this.logDepth(stage.children, "");
    this.logTextureFill(stage);
  };
  _proto.toggleGPUDraw = function toggleGPUDraw(stage, enabled) {
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
  _proto.logDepth = function logDepth(children, prepend, logFunc) {
    if (prepend === void 0) {
      prepend = "";
    }
    if (logFunc === void 0) {
      logFunc = WebGLInspector._log;
    }
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
  _proto.logContextInfo = function logContextInfo(gl) {
    if (!gl) {
      gl = this._stage._webGLContext;
    }
    var data = "\n\t\t\t== LOG:\n\n\t\t\tMax textures per draw: " + gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS) + "\n\n\t\t\tMax textures active: " + gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS) + "\n\n\t\t\t\n\n\t\t\tMax texture size: " + gl.getParameter(gl.MAX_TEXTURE_SIZE) / 2 + "\n\n\t\t\tMax cache size: " + gl.getParameter(gl.MAX_RENDERBUFFER_SIZE) / 2 + "\n\n\t\t\t\n\n\t\t\tMax attributes per vertex: " + gl.getParameter(gl.MAX_VERTEX_ATTRIBS) + "\n\n\t\t\tWebGL Version string: " + gl.getParameter(gl.VERSION) + "\n\n\t\t\t======\n\t\t";
    WebGLInspector._log(data);
  };
  _proto.logTextureFill = function logTextureFill(stage) {
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
    output.sort(function (a, b) {
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
  return WebGLInspector;
}(EventDispatcher);
WebGLInspector.alternateOutput = null;

exports.Event = Event;
exports.EventDispatcher = EventDispatcher;
exports.Ticker = Ticker;
exports.StageGL = StageGL;
exports.Stage = Stage;
exports.Container = Container;
exports.DisplayObject = DisplayObject;
exports.Bitmap = Bitmap;
exports.BitmapText = BitmapText;
exports.DOMElement = DOMElement;
exports.Graphics = Graphics;
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
exports.uid = uid;
exports.createCanvas = createCanvas;
exports.WebGLInspector = WebGLInspector;


					var cjs = window.createjs = window.createjs || {};
					var v = cjs.v = cjs.v || {};
				
v.easeljs = "NEXT";
//# sourceMappingURL=easeljs.cjs.js.map
