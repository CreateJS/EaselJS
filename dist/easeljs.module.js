/**
 * @license
 * EaselJS
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
import Tween from "@createjs/tweenjs/src/Tween";

import Timeline from "@createjs/tweenjs/src/Timeline";

class Event {
  constructor(type, bubbles = false, cancelable = false) {
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
  preventDefault() {
    this.defaultPrevented = this.cancelable;
    return this;
  }
  stopPropagation() {
    this.propagationStopped = true;
    return this;
  }
  stopImmediatePropagation() {
    this.immediatePropagationStopped = this.propagationStopped = true;
    return this;
  }
  remove() {
    this.removed = true;
    return this;
  }
  clone() {
    const event = new Event(this.type, this.bubbles, this.cancelable);
    for (let n in this) {
      if (this.hasOwnProperty(n)) {
        event[n] = this[n];
      }
    }
    return event;
  }
  set(props) {
    for (let n in props) {
      this[n] = props[n];
    }
    return this;
  }
  toString() {
    return `[${this.constructor.name} (type=${this.type})]`;
  }
}

class EventDispatcher {
  static initialize(target) {
    const p = EventDispatcher.prototype;
    target.addEventListener = p.addEventListener;
    target.on = p.on;
    target.removeEventListener = target.off = p.removeEventListener;
    target.removeAllEventListeners = p.removeAllEventListeners;
    target.hasEventListener = p.hasEventListener;
    target.dispatchEvent = p.dispatchEvent;
    target._dispatchEvent = p._dispatchEvent;
    target.willTrigger = p.willTrigger;
  }
  constructor() {
    this._listeners = null;
    this._captureListeners = null;
  }
  addEventListener(type, listener, useCapture = false) {
    let listeners;
    if (useCapture) {
      listeners = this._captureListeners = this._captureListeners || {};
    } else {
      listeners = this._listeners = this._listeners || {};
    }
    let arr = listeners[type];
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
  }
  on(type, listener, scope = null, once = false, data = {}, useCapture = false) {
    if (listener.handleEvent) {
      scope = scope || listener;
      listener = listener.handleEvent;
    }
    scope = scope || this;
    return this.addEventListener(type, evt => {
      listener.call(scope, evt, data);
      once && evt.remove();
    }, useCapture);
  }
  removeEventListener(type, listener, useCapture = false) {
    const listeners = useCapture ? this._captureListeners : this._listeners;
    if (!listeners) {
      return;
    }
    const arr = listeners[type];
    if (!arr) {
      return;
    }
    const l = arr.length;
    for (let i = 0; i < l; i++) {
      if (arr[i] === listener) {
        if (l === 1) {
          delete listeners[type];
        } else {
          arr.splice(i, 1);
        }
        break;
      }
    }
  }
  off(type, listener, useCapture = false) {
    this.removeEventListener(type, listener, useCapture);
  }
  removeAllEventListeners(type = null) {
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
  }
  dispatchEvent(eventObj, bubbles = false, cancelable = false) {
    if (typeof eventObj === "string") {
      const listeners = this._listeners;
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
      let top = this;
      const list = [ top ];
      while (top.parent) {
        list.push(top = top.parent);
      }
      const l = list.length;
      let i;
      for (i = l - 1; i >= 0 && !eventObj.propagationStopped; i--) {
        list[i]._dispatchEvent(eventObj, 1 + (i == 0));
      }
      for (i = 1; i < l && !eventObj.propagationStopped; i++) {
        list[i]._dispatchEvent(eventObj, 3);
      }
    }
    return !eventObj.defaultPrevented;
  }
  hasEventListener(type) {
    const listeners = this._listeners, captureListeners = this._captureListeners;
    return !!(listeners && listeners[type] || captureListeners && captureListeners[type]);
  }
  willTrigger(type) {
    let o = this;
    while (o) {
      if (o.hasEventListener(type)) {
        return true;
      }
      o = o.parent;
    }
    return false;
  }
  toString() {
    return `[${this.constructor.name + this.name ? ` ${this.name}` : ""}]`;
  }
  _dispatchEvent(eventObj, eventPhase) {
    const listeners = eventPhase === 1 ? this._captureListeners : this._listeners;
    if (eventObj && listeners) {
      let arr = listeners[eventObj.type];
      let l;
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
      for (let i = 0; i < l && !eventObj.immediatePropagationStopped; i++) {
        let o = arr[i];
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
  }
}

class Ticker extends EventDispatcher {
  static get RAF_SYNCHED() {
    return "synched";
  }
  static get RAF() {
    return "raf";
  }
  static get TIMEOUT() {
    return "timeout";
  }
  constructor(name) {
    super();
    this.name = name;
    this.timingMode = Ticker.TIMEOUT;
    this.maxDelta = 0;
    this.paused = false;
    this._inited = false;
    this._startTime = 0;
    this._pausedTime = 0;
    this._ticks = 0;
    this._pausedTicks = 0;
    this._interval = 50;
    this._lastTime = 0;
    this._times = null;
    this._tickTimes = null;
    this._timerId = null;
    this._raf = true;
  }
  get interval() {
    return this._interval;
  }
  set interval(interval) {
    this._interval = interval;
    if (!this._inited) {
      return;
    }
    this._setupTick();
  }
  get framerate() {
    return 1e3 / this._interval;
  }
  set framerate(framerate) {
    this.interval = 1e3 / framerate;
  }
  init() {
    if (this._inited) {
      return;
    }
    this._inited = true;
    this._times = [];
    this._tickTimes = [];
    this._startTime = this._getTime();
    this._times.push(this._lastTime = 0);
    this._setupTick();
  }
  reset() {
    if (this._raf) {
      let f = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame;
      f && f(this._timerId);
    } else {
      clearTimeout(this._timerId);
    }
    this.removeAllEventListeners("tick");
    this._timerId = this._times = this._tickTimes = null;
    this._startTime = this._lastTime = this._ticks = 0;
    this._inited = false;
  }
  addEventListener(type, listener, useCapture) {
    !this._inited && this.init();
    return super.addEventListener(type, listener, useCapture);
  }
  getMeasuredTickTime(ticks = null) {
    const times = this._tickTimes;
    if (!times || times.length < 1) {
      return -1;
    }
    ticks = Math.min(times.length, ticks || this.framerate | 0);
    return times.reduce((a, b) => a + b, 0) / ticks;
  }
  getMeasuredFPS(ticks = null) {
    const times = this._times;
    if (!times || times.length < 2) {
      return -1;
    }
    ticks = Math.min(times.length - 1, ticks || this.framerate | 0);
    return 1e3 / ((times[0] - times[ticks]) / ticks);
  }
  getTime(runTime = false) {
    return this._startTime ? this._getTime() - (runTime ? this._pausedTime : 0) : -1;
  }
  getEventTime(runTime = false) {
    return this._startTime ? (this._lastTime || this._startTime) - (runTime ? this._pausedTime : 0) : -1;
  }
  getTicks(pauseable = false) {
    return this._ticks - (pauseable ? this._pausedTicks : 0);
  }
  _handleSynch() {
    this._timerId = null;
    this._setupTick();
    if (this._getTime() - this._lastTime >= (this._interval - 1) * .97) {
      this._tick();
    }
  }
  _handleRAF() {
    this._timerId = null;
    this._setupTick();
    this._tick();
  }
  _handleTimeout() {
    this._timerId = null;
    this._setupTick();
    this._tick();
  }
  _setupTick() {
    if (this._timerId != null) {
      return;
    }
    const mode = this.timingMode || this._raf && Ticker.RAF;
    if (mode === Ticker.RAF_SYNCHED || mode === Ticker.RAF) {
      const f = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame;
      if (f) {
        this._timerId = f(mode === Ticker.RAF ? this._handleRAF.bind(this) : this._handleSynch.bind(this));
        this._raf = true;
        return;
      }
    }
    this._raf = false;
    this._timerId = setTimeout(this._handleTimeout.bind(this), this._interval);
  }
  _tick() {
    const paused = this.paused, time = this._getTime(), elapsedTime = time - this._lastTime;
    this._lastTime = time;
    this._ticks++;
    if (paused) {
      this._pausedTicks++;
      this._pausedTime += elapsedTime;
    }
    if (this.hasEventListener("tick")) {
      const event = new Event("tick");
      const maxDelta = this.maxDelta;
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
  }
  _getTime() {
    const now = window.performance && window.performance.now;
    return (now && now.call(performance) || new Date().getTime()) - this._startTime;
  }
  static on(type, listener, scope, once, data, useCapture) {
    return _instance.on(type, listener, scope, once, data, useCapture);
  }
  static removeEventListener(type, listener, useCapture) {
    _instance.removeEventListener(type, listener, useCapture);
  }
  static off(type, listener, useCapture) {
    _instance.off(type, listener, useCapture);
  }
  static removeAllEventListeners(type) {
    _instance.removeAllEventListeners(type);
  }
  static dispatchEvent(eventObj, bubbles, cancelable) {
    return _instance.dispatchEvent(eventObj, bubbles, cancelable);
  }
  static hasEventListener(type) {
    return _instance.hasEventListener(type);
  }
  static willTrigger(type) {
    return _instance.willTrigger(type);
  }
  static toString() {
    return _instance.toString();
  }
  static init() {
    _instance.init();
  }
  static reset() {
    _instance.reset();
  }
  static addEventListener(type, listener, useCapture) {
    _instance.addEventListener(type, listener, useCapture);
  }
  static getMeasuredTickTime(ticks) {
    return _instance.getMeasuredTickTime(ticks);
  }
  static getMeasuredFPS(ticks) {
    return _instance.getMeasuredFPS(ticks);
  }
  static getTime(runTime) {
    return _instance.getTime(runTime);
  }
  static getEventTime(runTime) {
    return _instance.getEventTime(runTime);
  }
  static getTicks(pauseable) {
    return _instance.getTicks(pauseable);
  }
  static get interval() {
    return _instance.interval;
  }
  static set interval(interval) {
    _instance.interval = interval;
  }
  static get framerate() {
    return _instance.framerate;
  }
  static set framerate(framerate) {
    _instance.framerate = framerate;
  }
  static get name() {
    return _instance.name;
  }
  static set name(name) {
    _instance.name = name;
  }
  static get timingMode() {
    return _instance.timingMode;
  }
  static set timingMode(timingMode) {
    _instance.timingMode = timingMode;
  }
  static get maxDelta() {
    return _instance.maxDelta;
  }
  static set maxDelta(maxDelta) {
    _instance.maxDelta = maxDelta;
  }
  static get paused() {
    return _instance.paused;
  }
  static set paused(paused) {
    _instance.paused = paused;
  }
}

const _instance = new Ticker("createjs.global");

class StageGL {
  constructor() {
    throw new Error(`\n\t\t\tStageGL is not currently supported on the EaselJS 2.0 branch.\n\t\t\tEnd of Q1 2018 is targetted for StageGL support.\n\t\t\tFollow @CreateJS on Twitter for updates.\n\t\t`);
  }
}

let _nextID = 0;

class UID {
  constructor() {
    throw "UID cannot be instantiated";
  }
  static get _nextID() {
    return _nextID;
  }
  static set _nextID(nextID) {
    _nextID = nextID;
  }
  static get() {
    return UID._nextID++;
  }
}

class Point {
  constructor(x = 0, y = 0) {
    this.setValues(x, y);
  }
  setValues(x = 0, y = 0) {
    this.x = x;
    this.y = y;
    return this;
  }
  copy(point) {
    this.x = point.x;
    this.y = point.y;
    return this;
  }
  clone() {
    return new Point(this.x, this.y);
  }
  toString() {
    return `[${this.constructor.name} (x=${this.x} y=${this.y})]`;
  }
}

class Matrix2D {
  constructor(a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0) {
    this.setValues(a, b, c, d, tx, ty);
  }
  setValues(a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.tx = tx;
    this.ty = ty;
    return this;
  }
  append(a, b, c, d, tx, ty) {
    let a1 = this.a;
    let b1 = this.b;
    let c1 = this.c;
    let d1 = this.d;
    if (a != 1 || b != 0 || c != 0 || d != 1) {
      this.a = a1 * a + c1 * b;
      this.b = b1 * a + d1 * b;
      this.c = a1 * c + c1 * d;
      this.d = b1 * c + d1 * d;
    }
    this.tx = a1 * tx + c1 * ty + this.tx;
    this.ty = b1 * tx + d1 * ty + this.ty;
    return this;
  }
  prepend(a, b, c, d, tx, ty) {
    let a1 = this.a;
    let c1 = this.c;
    let tx1 = this.tx;
    this.a = a * a1 + c * this.b;
    this.b = b * a1 + d * this.b;
    this.c = a * c1 + c * this.d;
    this.d = b * c1 + d * this.d;
    this.tx = a * tx1 + c * this.ty + tx;
    this.ty = b * tx1 + d * this.ty + ty;
    return this;
  }
  appendMatrix(matrix) {
    return this.append(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
  }
  prependMatrix(matrix) {
    return this.prepend(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
  }
  appendTransform(x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
    let r, cos, sin;
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
  }
  prependTransform(x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
    let r, cos, sin;
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
  }
  rotate(angle) {
    angle *= Matrix2D.DEG_TO_RAD;
    let cos = Math.cos(angle);
    let sin = Math.sin(angle);
    let a1 = this.a;
    let b1 = this.b;
    this.a = a1 * cos + this.c * sin;
    this.b = b1 * cos + this.d * sin;
    this.c = -a1 * sin + this.c * cos;
    this.d = -b1 * sin + this.d * cos;
    return this;
  }
  skew(skewX, skewY) {
    skewX *= Matrix2D.DEG_TO_RAD;
    skewY *= Matrix2D.DEG_TO_RAD;
    this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), 0, 0);
    return this;
  }
  scale(x, y) {
    this.a *= x;
    this.b *= x;
    this.c *= y;
    this.d *= y;
    return this;
  }
  translate(x, y) {
    this.tx += this.a * x + this.c * y;
    this.ty += this.b * x + this.d * y;
    return this;
  }
  identity() {
    this.a = this.d = 1;
    this.b = this.c = this.tx = this.ty = 0;
    return this;
  }
  invert() {
    let a1 = this.a;
    let b1 = this.b;
    let c1 = this.c;
    let d1 = this.d;
    let tx1 = this.tx;
    let n = a1 * d1 - b1 * c1;
    this.a = d1 / n;
    this.b = -b1 / n;
    this.c = -c1 / n;
    this.d = a1 / n;
    this.tx = (c1 * this.ty - d1 * tx1) / n;
    this.ty = -(a1 * this.ty - b1 * tx1) / n;
    return this;
  }
  isIdentity() {
    return this.tx === 0 && this.ty === 0 && this.a === 1 && this.b === 0 && this.c === 0 && this.d === 1;
  }
  equals(matrix) {
    return this.tx === matrix.tx && this.ty === matrix.ty && this.a === matrix.a && this.b === matrix.b && this.c === matrix.c && this.d === matrix.d;
  }
  transformPoint(x, y, pt = new Point()) {
    pt.x = x * this.a + y * this.c + this.tx;
    pt.y = x * this.b + y * this.d + this.ty;
    return pt;
  }
  decompose(target = {}) {
    target.x = this.tx;
    target.y = this.ty;
    target.scaleX = Math.sqrt(this.a * this.a + this.b * this.b);
    target.scaleY = Math.sqrt(this.c * this.c + this.d * this.d);
    let skewX = Math.atan2(-this.c, this.d);
    let skewY = Math.atan2(this.b, this.a);
    let delta = Math.abs(1 - skewX / skewY);
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
  }
  copy(matrix) {
    return this.setValues(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
  }
  clone() {
    return new Matrix2D(this.a, this.b, this.c, this.d, this.tx, this.ty);
  }
  toString() {
    return `[${this.constructor.name} (a=${this.a} b=${this.b} c=${this.c} d=${this.d} tx=${this.tx} ty=${this.ty})]`;
  }
}

{
  Matrix2D.DEG_TO_RAD = Math.PI / 180;
  Matrix2D.identity = new Matrix2D();
}

class DisplayProps {
  constructor(visible = true, alpha = 1, shadow, compositeOperation, matrix) {
    this.setValues(visible, alpha, shadow, compositeOperation, matrix);
  }
  setValues(visible = true, alpha = 1, shadow, compositeOperation, matrix) {
    this.visible = visible;
    this.alpha = alpha;
    this.shadow = shadow;
    this.compositeOperation = compositeOperation;
    this.matrix = matrix || this.matrix && this.matrix.identity() || new Matrix2D();
    return this;
  }
  append(visible, alpha, shadow, compositeOperation, matrix) {
    this.alpha *= alpha;
    this.shadow = shadow || this.shadow;
    this.compositeOperation = compositeOperation || this.compositeOperation;
    this.visible = this.visible && visible;
    matrix && this.matrix.appendMatrix(matrix);
    return this;
  }
  prepend(visible, alpha, shadow, compositeOperation, matrix) {
    this.alpha *= alpha;
    this.shadow = this.shadow || shadow;
    this.compositeOperation = this.compositeOperation || compositeOperation;
    this.visible = this.visible && visible;
    matrix && this.matrix.prependMatrix(matrix);
    return this;
  }
  identity() {
    this.visible = true;
    this.alpha = 1;
    this.shadow = this.compositeOperation = null;
    this.matrix.identity();
    return this;
  }
  clone() {
    return new DisplayProps(this.alpha, this.shadow, this.compositeOperation, this.visible, this.matrix.clone());
  }
}

class Rectangle {
  constructor(x = 0, y = 0, width = 0, height = 0) {
    this.setValues(x, y, width, height);
  }
  setValues(x = 0, y = 0, width = 0, height = 0) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    return this;
  }
  extend(x, y, width = 0, height = 0) {
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
  }
  pad(top, left, bottom, right) {
    this.x -= left;
    this.y -= top;
    this.width += left + right;
    this.height += top + bottom;
    return this;
  }
  copy(rectangle) {
    return this.setValues(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
  }
  contains(x, y, width = 0, height = 0) {
    return x >= this.x && x + width <= this.x + this.width && y >= this.y && y + height <= this.y + this.height;
  }
  union(rect) {
    return this.clone().extend(rect.x, rect.y, rect.width, rect.height);
  }
  intersection(rect) {
    let x1 = rect.x, y1 = rect.y, x2 = x1 + rect.width, y2 = y1 + rect.height;
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
  }
  intersects(rect) {
    return rect.x <= this.x + this.width && this.x <= rect.x + rect.width && rect.y <= this.y + this.height && this.y <= rect.y + rect.height;
  }
  isEmpty() {
    return this.width <= 0 || this.height <= 0;
  }
  clone() {
    return new Rectangle(this.x, this.y, this.width, this.height);
  }
  toString() {
    return `[${this.constructor.name} (x=${this.x} y=${this.y} width=${this.width} height=${this.height})]`;
  }
}

class Filter {
  constructor() {
    this.usesContext = false;
    this._multiPass = null;
    this.VTX_SHADER_BODY = null;
    this.FRAG_SHADER_BODY = null;
  }
  getBounds(rect) {
    return rect;
  }
  shaderParamSetup(gl, stage, shaderProgram) {}
  applyFilter(ctx, x, y, width, height, targetCtx, targetX, targetY) {
    targetCtx = targetCtx || ctx;
    if (targetX == null) {
      targetX = x;
    }
    if (targetY == null) {
      targetY = y;
    }
    try {
      let imageData = ctx.getImageData(x, y, width, height);
      if (this._applyFilter(imageData)) {
        targetCtx.putImageData(imageData, targetX, targetY);
        return true;
      }
    } catch (e) {}
    return false;
  }
  toString() {
    return `[${this.constructor.name}]`;
  }
  clone() {
    return new Filter();
  }
  _applyFilter(imageData) {
    return true;
  }
}

class BitmapCache extends Filter {
  constructor() {
    super();
    this.width = undefined;
    this.height = undefined;
    this.x = undefined;
    this.y = undefined;
    this.scale = 1;
    this.offX = 0;
    this.offY = 0;
    this.cacheID = 0;
    this._filterOffX = 0;
    this._filterOffY = 0;
    this._cacheDataURLID = 0;
    this._cacheDataURL = null;
    this._drawWidth = 0;
    this._drawHeight = 0;
    this._boundRect = new Rectangle();
  }
  static getFilterBounds(target, output = new Rectangle()) {
    let filters = target.filters;
    let filterCount = filters && filters.length;
    if (!!filterCount <= 0) {
      return output;
    }
    for (let i = 0; i < filterCount; i++) {
      let f = filters[i];
      if (!f || !f.getBounds) {
        continue;
      }
      let test = f.getBounds();
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
  }
  define(target, x = 0, y = 0, width = 1, height = 1, scale = 1, options) {
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
  }
  update(compositeOperation) {
    if (!this.target) {
      throw "define() must be called before update()";
    }
    let filterBounds = BitmapCache.getFilterBounds(this.target);
    let surface = this.target.cacheCanvas;
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
  }
  release() {
    let stage = this.target.stage;
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
  }
  getCacheDataURL() {
    let cacheCanvas = this.target && this.target.cacheCanvas;
    if (!cacheCanvas) {
      return null;
    }
    if (this.cacheID != this._cacheDataURLID) {
      this._cacheDataURLID = this.cacheID;
      this._cacheDataURL = cacheCanvas.toDataURL ? cacheCanvas.toDataURL() : null;
    }
    return this._cacheDataURL;
  }
  draw(ctx) {
    if (!this.target) {
      return false;
    }
    ctx.drawImage(this.target.cacheCanvas, this.x + this._filterOffX / this.scale, this.y + this._filterOffY / this.scale, this._drawWidth / this.scale, this._drawHeight / this.scale);
    return true;
  }
  getBounds() {
    const scale = this.scale;
    return this._boundRect.setValue(this._filterOffX / scale, this._filterOffY / scale, this.width / scale, this.height / scale);
  }
  _updateSurface() {
    let surface;
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
          throw `Cannot use 'stage' for cache because the object's parent stage is ${this.target.stage != null ? "non WebGL." : "not set, please addChild to the correct stage."}`;
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
    let stageGL = this._webGLCache;
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
  }
  _drawToCache(compositeOperation) {
    let target = this.target;
    let surface = target.cacheCanvas;
    let webGL = this._webGLCache;
    if (!this._useWebGL || !webGL) {
      let ctx = surface.getContext("2d");
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
  }
  _applyFilters() {
    let surface = this.target.cacheCanvas;
    let filters = this.target.filters;
    let w = this._drawWidth;
    let h = this._drawHeight;
    let data = surface.getContext("2d").getImageData(0, 0, w, h);
    let l = filters.length;
    for (let i = 0; i < l; i++) {
      filters[i]._applyFilter(data);
    }
    surface.getContext("2d").putImageData(data, 0, 0);
  }
}

class DisplayObject extends EventDispatcher {
  constructor() {
    super();
    this.alpha = 1;
    this.cacheCanvas = null;
    this.bitmapCache = null;
    this.id = UID.get();
    this.mouseEnabled = true;
    this.tickEnabled = true;
    this.name = null;
    this.parent = null;
    this.regX = 0;
    this.regY = 0;
    this.rotation = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.skewX = 0;
    this.skewY = 0;
    this.shadow = null;
    this.visible = true;
    this.x = 0;
    this.y = 0;
    this.transformMatrix = null;
    this.compositeOperation = null;
    this.snapToPixel = true;
    this.filters = null;
    this.mask = null;
    this.hitArea = null;
    this.cursor = null;
    this._props = new DisplayProps();
    this._rectangle = new Rectangle();
    this._bounds = null;
    this._webGLRenderStyle = DisplayObject._StageGL_NONE;
  }
  get stage() {
    let o = this;
    while (o.parent) {
      o = o.parent;
    }
    if (/^\[Stage(GL)?(\s\(name=\w+\))?\]$/.test(o.toString())) {
      return o;
    }
    return null;
  }
  get scale() {
    return this.scaleX;
  }
  set scale(value) {
    this.scaleX = this.scaleY = value;
  }
  isVisible() {
    return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0);
  }
  draw(ctx, ignoreCache = false) {
    return this.drawCache(ctx, ignoreCache);
  }
  drawCache(ctx, ignoreCache = false) {
    let cache = this.bitmapCache;
    if (cache && !ignoreCache) {
      return cache.draw(ctx);
    }
    return false;
  }
  updateContext(ctx) {
    let o = this, mask = o.mask, mtx = o._props.matrix;
    if (mask && mask.graphics && !mask.graphics.isEmpty()) {
      mask.getMatrix(mtx);
      ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
      mask.graphics.drawAsPath(ctx);
      ctx.clip();
      mtx.invert();
      ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
    }
    this.getMatrix(mtx);
    let tx = mtx.tx, ty = mtx.ty;
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
  }
  cache(x, y, width, height, scale = 1, options) {
    if (!this.bitmapCache) {
      this.bitmapCache = new BitmapCache();
    }
    this.bitmapCache.define(this, x, y, width, height, scale, options);
  }
  updateCache(compositeOperation) {
    if (!this.bitmapCache) {
      throw "cache() must be called before updateCache()";
    }
    this.bitmapCache.update(compositeOperation);
  }
  uncache() {
    if (this.bitmapCache) {
      this.bitmapCache.release();
      this.bitmapCache = undefined;
    }
  }
  getCacheDataURL() {
    return this.bitmapCache ? this.bitmapCache.getDataURL() : null;
  }
  localToGlobal(x, y, pt = new Point()) {
    return this.getConcatenatedMatrix(this._props.matrix).transformPoint(x, y, pt);
  }
  globalToLocal(x, y, pt = new Point()) {
    return this.getConcatenatedMatrix(this._props.matrix).invert().transformPoint(x, y, pt);
  }
  localToLocal(x, y, target, pt) {
    pt = this.localToGlobal(x, y, pt);
    return target.globalToLocal(pt.x, pt.y, pt);
  }
  setTransform(x = 0, y = 0, scaleX = 1, scaleY = 1, rotation = 0, skewX = 0, skewY = 0, regX = 0, regY = 0) {
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
  }
  getMatrix(matrix) {
    let o = this, mtx = matrix && matrix.identity() || new Matrix2D();
    return o.transformMatrix ? mtx.copy(o.transformMatrix) : mtx.appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY);
  }
  getConcatenatedMatrix(matrix) {
    let o = this, mtx = this.getMatrix(matrix);
    while (o = o.parent) {
      mtx.prependMatrix(o.getMatrix(o._props.matrix));
    }
    return mtx;
  }
  getConcatenatedDisplayProps(props) {
    props = props ? props.identity() : new DisplayProps();
    let o = this, mtx = o.getMatrix(props.matrix);
    do {
      props.prepend(o.visible, o.alpha, o.shadow, o.compositeOperation);
      if (o != this) {
        mtx.prependMatrix(o.getMatrix(o._props.matrix));
      }
    } while (o = o.parent);
    return props;
  }
  hitTest(x, y) {
    let ctx = DisplayObject._hitTestContext;
    ctx.setTransform(1, 0, 0, 1, -x, -y);
    this.draw(ctx);
    let hit = this._testHit(ctx);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, 2, 2);
    return hit;
  }
  set(props) {
    for (let n in props) {
      this[n] = props[n];
    }
    return this;
  }
  getBounds() {
    if (this._bounds) {
      return this._rectangle.copy(this._bounds);
    }
    let cacheCanvas = this.cacheCanvas;
    if (cacheCanvas) {
      let scale = this._cacheScale;
      return this._rectangle.setValues(this._cacheOffsetX, this._cacheOffsetY, cacheCanvas.width / scale, cacheCanvas.height / scale);
    }
    return null;
  }
  getTransformedBounds() {
    return this._getBounds();
  }
  setBounds(x, y, width, height) {
    if (x == null) {
      this._bounds = x;
    }
    this._bounds = (this._bounds || new Rectangle()).setValues(x, y, width, height);
  }
  clone() {
    return this._cloneProps(new DisplayObject());
  }
  toString() {
    return `[${this.constructor.name}${this.name ? ` (name=${this.name})` : ""}]`;
  }
  _cloneProps(o) {
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
  }
  _applyShadow(ctx, shadow = Shadow.identity) {
    shadow = shadow;
    ctx.shadowColor = shadow.color;
    ctx.shadowOffsetX = shadow.offsetX;
    ctx.shadowOffsetY = shadow.offsetY;
    ctx.shadowBlur = shadow.blur;
  }
  _tick(evtObj) {
    let ls = this._listeners;
    if (ls && ls["tick"]) {
      evtObj.target = null;
      evtObj.propagationStopped = evtObj.immediatePropagationStopped = false;
      this.dispatchEvent(evtObj);
    }
  }
  _testHit(ctx) {
    try {
      return ctx.getImageData(0, 0, 1, 1).data[3] > 1;
    } catch (e) {
      if (!DisplayObject.suppressCrossDomainErrors) {
        throw "An error has occurred. This is most likely due to security restrictions on reading canvas pixel data with local or cross-domain images.";
      }
      return false;
    }
  }
  _getBounds(matrix, ignoreTransform) {
    return this._transformBounds(this.getBounds(), matrix, ignoreTransform);
  }
  _transformBounds(bounds, matrix, ignoreTransform) {
    if (!bounds) {
      return bounds;
    }
    let {x: x, y: y, width: width, height: height} = bounds;
    let mtx = this._props.matrix;
    mtx = ignoreTransform ? mtx.identity() : this.getMatrix(mtx);
    if (x || y) {
      mtx.appendTransform(0, 0, 1, 1, 0, 0, 0, -x, -y);
    }
    if (matrix) {
      mtx.prependMatrix(matrix);
    }
    let x_a = width * mtx.a, x_b = width * mtx.b;
    let y_c = height * mtx.c, y_d = height * mtx.d;
    let tx = mtx.tx, ty = mtx.ty;
    let minX = tx, maxX = tx, minY = ty, maxY = ty;
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
  }
  _hasMouseEventListener() {
    let evts = DisplayObject._MOUSE_EVENTS;
    for (let i = 0, l = evts.length; i < l; i++) {
      if (this.hasEventListener(evts[i])) {
        return true;
      }
    }
    return !!this.cursor;
  }
}

{
  let canvas = window.createjs && createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas");
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

class Container extends DisplayObject {
  constructor() {
    super();
    this.children = [];
    this.mouseChildren = true;
    this.tickChildren = true;
  }
  get numChildren() {
    return this.children.length;
  }
  isVisible() {
    let hasContent = this.cacheCanvas || this.children.length;
    return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent);
  }
  draw(ctx, ignoreCache = false) {
    if (super.draw(ctx, ignoreCache)) {
      return true;
    }
    let list = this.children.slice();
    for (let i = 0, l = list.length; i < l; i++) {
      let child = list[i];
      if (!child.isVisible()) {
        continue;
      }
      ctx.save();
      child.updateContext(ctx);
      child.draw(ctx);
      ctx.restore();
    }
    return true;
  }
  addChild(...children) {
    const l = children.length;
    if (l === 0) {
      return null;
    }
    let child = children[0];
    if (l > 1) {
      for (let i = 0; i < l; i++) {
        child = this.addChild(children[i]);
      }
      return child;
    }
    let parent = child.parent, silent = parent === this;
    parent && parent._removeChildAt(parent.children.indexOf(child), silent);
    child.parent = this;
    this.children.push(child);
    if (!silent) {
      child.dispatchEvent("added");
    }
    return child;
  }
  addChildAt(...children) {
    const l = children.length;
    if (l === 0) {
      return null;
    }
    let index = children.pop();
    if (index < 0 || index > this.children.length) {
      return children[l - 2];
    }
    if (l > 2) {
      for (let i = 0; i < l - 1; i++) {
        this.addChildAt(children[i], index++);
      }
      return children[l - 2];
    }
    let child = children[0];
    let parent = child.parent, silent = parent === this;
    parent && parent._removeChildAt(parent.children.indexOf(child), silent);
    child.parent = this;
    this.children.splice(index++, 0, child);
    if (!silent) {
      child.dispatchEvent("added");
    }
    return child;
  }
  removeChild(...children) {
    const l = children.length;
    if (l === 0) {
      return true;
    }
    if (l > 1) {
      let good = true;
      for (let i = 0; i < l; i++) {
        good = good && this.removeChild(children[i]);
      }
      return good;
    }
    return this._removeChildAt(this.children.indexOf(children[0]));
  }
  removeChildAt(...indexes) {
    const l = indexes.length;
    if (l === 0) {
      return true;
    }
    if (l > 1) {
      indexes.sort((a, b) => b - a);
      let good = true;
      for (let i = 0; i < l; i++) {
        good = good && this._removeChildAt(indexes[i]);
      }
      return good;
    }
    return this._removeChildAt(indexes[0]);
  }
  removeAllChildren() {
    let kids = this.children;
    while (kids.length) {
      this._removeChildAt(0);
    }
  }
  getChildAt(index) {
    return this.children[index];
  }
  getChildByName(name) {
    let kids = this.children;
    const l = kids.length;
    for (let i = 0; i < l; i++) {
      if (kids[i].name === name) {
        return kids[i];
      }
    }
    return null;
  }
  sortChildren(sortFunction) {
    this.children.sort(sortFunction);
  }
  getChildIndex(child) {
    return this.children.indexOf(child);
  }
  swapChildrenAt(index1, index2) {
    let kids = this.children;
    let o1 = kids[index1];
    let o2 = kids[index2];
    if (!o1 || !o2) {
      return;
    }
    kids[index1] = o2;
    kids[index2] = o1;
  }
  swapChildren(child1, child2) {
    let kids = this.children;
    const l = kids.length;
    let index1, index2;
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
  }
  setChildIndex(child, index) {
    let kids = this.children;
    const l = kids.length;
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
  }
  contains(child) {
    while (child) {
      if (child === this) {
        return true;
      }
      child = child.parent;
    }
    return false;
  }
  hitTest(x, y) {
    return this.getObjectUnderPoint(x, y) != null;
  }
  getObjectsUnderPoint(x, y, mode = 0) {
    let arr = [];
    let pt = this.localToGlobal(x, y);
    this._getObjectsUnderPoint(pt.x, pt.y, arr, mode > 0, mode === 1);
    return arr;
  }
  getObjectUnderPoint(x, y, mode = 0) {
    let pt = this.localToGlobal(x, y);
    return this._getObjectsUnderPoint(pt.x, pt.y, null, mode > 0, mode === 1);
  }
  getBounds() {
    return this._getBounds(null, true);
  }
  getTransformedBounds() {
    return this._getBounds();
  }
  clone(recursive = false) {
    let o = this._cloneProps(new Container());
    if (recursive) {
      this._cloneChildren(o);
    }
    return o;
  }
  _tick(evtObj) {
    if (this.tickChildren) {
      for (let i = this.children.length - 1; i >= 0; i--) {
        let child = this.children[i];
        if (child.tickEnabled && child._tick) {
          child._tick(evtObj);
        }
      }
    }
    super._tick(evtObj);
  }
  _cloneChildren(o) {
    if (o.children.length) {
      o.removeAllChildren();
    }
    let arr = o.children;
    const l = this.children.length;
    for (let i = 0; i < l; i++) {
      let clone = this.children[i].clone(true);
      clone.parent = o;
      arr.push(clone);
    }
  }
  _removeChildAt(index, silent = false) {
    if (index < 0 || index > this.children.length - 1) {
      return false;
    }
    let child = this.children[index];
    if (child) {
      child.parent = null;
    }
    this.children.splice(index, 1);
    if (!silent) {
      child.dispatchEvent("removed");
    }
    return true;
  }
  _getObjectsUnderPoint(x, y, arr, mouse, activeListener, currentDepth = 0) {
    if (!currentDepth && !this._testMask(this, x, y)) {
      return null;
    }
    let mtx, ctx = DisplayObject._hitTestContext;
    activeListener = activeListener || mouse && this._hasMouseEventListener();
    let children = this.children;
    const l = children.length;
    for (let i = l - 1; i >= 0; i--) {
      let child = children[i];
      let hitArea = child.hitArea;
      if (!child.visible || !hitArea && !child.isVisible() || mouse && !child.mouseEnabled) {
        continue;
      }
      if (!hitArea && !this._testMask(child, x, y)) {
        continue;
      }
      if (!hitArea && child instanceof Container) {
        let result = child._getObjectsUnderPoint(x, y, arr, mouse, activeListener, currentDepth + 1);
        if (!arr && result) {
          return mouse && !this.mouseChildren ? this : result;
        }
      } else {
        if (mouse && !activeListener && !child._hasMouseEventListener()) {
          continue;
        }
        let props = child.getConcatenatedDisplayProps(child._props);
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
  }
  _testMask(target, x, y) {
    let mask = target.mask;
    if (!mask || !mask.graphics || mask.graphics.isEmpty()) {
      return true;
    }
    let mtx = this._props.matrix, parent = target.parent;
    mtx = parent ? parent.getConcatenatedMatrix(mtx) : mtx.identity();
    mtx = mask.getMatrix(mask._props.matrix).prependMatrix(mtx);
    let ctx = DisplayObject._hitTestContext;
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
  }
  _getBounds(matrix, ignoreTransform) {
    let bounds = super.getBounds();
    if (bounds) {
      return this._transformBounds(bounds, matrix, ignoreTransform);
    }
    let mtx = this._props.matrix;
    mtx = ignoreTransform ? mtx.identity() : this.getMatrix(mtx);
    if (matrix) {
      mtx.prependMatrix(matrix);
    }
    const l = this.children.length;
    let rect = null;
    for (let i = 0; i < l; i++) {
      let child = this.children[i];
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
  }
}

class MouseEvent extends Event {
  constructor(type, bubbles, cancelable, stageX, stageY, nativeEvent, pointerID, primary, rawX, rawY, relatedTarget) {
    super(type, bubbles, cancelable);
    this.stageX = stageX;
    this.stageY = stageY;
    this.rawX = rawX == null ? stageX : rawX;
    this.rawY = rawY == null ? stageY : rawY;
    this.nativeEvent = nativeEvent;
    this.pointerID = pointerID;
    this.primary = !!primary;
    this.relatedTarget = relatedTarget;
  }
  get localX() {
    return this.currentTarget.globalToLocal(this.rawX, this.rawY).x;
  }
  get localY() {
    return this.currentTarget.globalToLocal(this.rawX, this.rawY).y;
  }
  get isTouch() {
    return this.pointerID !== -1;
  }
  clone() {
    return new MouseEvent(this.type, this.bubbles, this.cancelable, this.stageX, this.stageY, this.nativeEvent, this.pointerID, this.primary, this.rawX, this.rawY);
  }
  toString() {
    return `[${this.constructor.name} (type=${this.type} stageX=${this.stageX} stageY=${this.stageY})]`;
  }
}

class Stage extends Container {
  constructor(canvas) {
    super();
    this.autoClear = true;
    this.canvas = typeof canvas === "string" ? document.getElementById(canvas) : canvas;
    this.mouseX = 0;
    this.mouseY = 0;
    this.drawRect = null;
    this.snapToPixelEnabled = false;
    this.mouseInBounds = false;
    this.tickOnUpdate = true;
    this.mouseMoveOutside = false;
    this.preventSelection = true;
    this._pointerData = {};
    this._pointerCount = 0;
    this._primaryPointerID = null;
    this._mouseOverIntervalID = null;
    this._nextStage = null;
    this._prevStage = null;
    this.enableDOMEvents(true);
  }
  get nextStage() {
    return this._nextStage;
  }
  set nextStage(stage) {
    if (this._nextStage) {
      this._nextStage._prevStage = null;
    }
    if (stage) {
      stage._prevStage = this;
    }
    this._nextStage = stage;
  }
  update(props) {
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
    let r = this.drawRect, ctx = this.canvas.getContext("2d");
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
  }
  tick(props) {
    if (!this.tickEnabled || this.dispatchEvent("tickstart", false, true) === false) {
      return;
    }
    let evtObj = new Event("tick");
    if (props) {
      for (let n in props) {
        if (props.hasOwnProperty(n)) {
          evtObj[n] = props[n];
        }
      }
    }
    this._tick(evtObj);
    this.dispatchEvent("tickend");
  }
  handleEvent(evt) {
    if (evt.type === "tick") {
      this.update(evt);
    }
  }
  clear() {
    if (!this.canvas) {
      return;
    }
    let ctx = this.canvas.getContext("2d");
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.canvas.width + 1, this.canvas.height + 1);
  }
  toDataURL(backgroundColor, mimeType = "image/png") {
    let data, ctx = this.canvas.getContext("2d"), w = this.canvas.width, h = this.canvas.height;
    if (backgroundColor) {
      data = ctx.getImageData(0, 0, w, h);
      var compositeOperation = ctx.globalCompositeOperation;
      ctx.globalCompositeOperation = "destination-over";
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, w, h);
    }
    let dataURL = this.canvas.toDataURL(mimeType);
    if (backgroundColor) {
      ctx.putImageData(data, 0, 0);
      ctx.globalCompositeOperation = compositeOperation;
    }
    return dataURL;
  }
  enableMouseOver(frequency = 20) {
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
    this._mouseOverIntervalID = setInterval(() => this._testMouseOver(), 1e3 / Math.min(50, frequency));
  }
  enableDOMEvents(enable = true) {
    let ls = this._eventListeners;
    if (!enable && ls) {
      for (let n in ls) {
        let o = ls[n];
        o.t.removeEventListener(n, o.f, false);
      }
      this._eventListeners = null;
    } else if (enable && !ls && this.canvas) {
      let t = window.addEventListener ? window : document;
      ls = this._eventListeners = {
        mouseup: {
          t: t,
          f: e => this._handleMouseUp(e)
        },
        mousemove: {
          t: t,
          f: e => this._handleMouseMove(e)
        },
        dblclick: {
          t: this.canvas,
          f: e => this._handleDoubleClick(e)
        },
        mousedown: {
          t: this.canvas,
          f: e => this._handleMouseDown(e)
        }
      };
      for (let n in ls) {
        let o = ls[n];
        o.t.addEventListener && o.t.addEventListener(n, o.f, false);
      }
    }
  }
  clone() {
    throw "Stage cannot be cloned.";
  }
  _getElementRect(e) {
    let bounds;
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
    let offX = (window.pageXOffset || document.scrollLeft || 0) - (document.clientLeft || document.body.clientLeft || 0);
    let offY = (window.pageYOffset || document.scrollTop || 0) - (document.clientTop || document.body.clientTop || 0);
    let styles = window.getComputedStyle ? getComputedStyle(e, null) : e.currentStyle;
    let padL = parseInt(styles.paddingLeft) + parseInt(styles.borderLeftWidth);
    let padT = parseInt(styles.paddingTop) + parseInt(styles.borderTopWidth);
    let padR = parseInt(styles.paddingRight) + parseInt(styles.borderRightWidth);
    let padB = parseInt(styles.paddingBottom) + parseInt(styles.borderBottomWidth);
    return {
      left: bounds.left + offX + padL,
      right: bounds.right + offX - padR,
      top: bounds.top + offY + padT,
      bottom: bounds.bottom + offY - padB
    };
  }
  _getPointerData(id) {
    let data = this._pointerData[id];
    if (!data) {
      data = this._pointerData[id] = {
        x: 0,
        y: 0
      };
    }
    return data;
  }
  _handleMouseMove(e = window.event) {
    this._handlePointerMove(-1, e, e.pageX, e.pageY);
  }
  _handlePointerMove(id, e, pageX, pageY, owner) {
    if (this._prevStage && owner === undefined) {
      return;
    }
    if (!this.canvas) {
      return;
    }
    let nextStage = this._nextStage, o = this._getPointerData(id);
    let inBounds = o.inBounds;
    this._updatePointerPosition(id, e, pageX, pageY);
    if (inBounds || o.inBounds || this.mouseMoveOutside) {
      if (id === -1 && o.inBounds === !inBounds) {
        this._dispatchMouseEvent(this, inBounds ? "mouseleave" : "mouseenter", false, id, o, e);
      }
      this._dispatchMouseEvent(this, "stagemousemove", false, id, o, e);
      this._dispatchMouseEvent(o.target, "pressmove", true, id, o, e);
    }
    nextStage && nextStage._handlePointerMove(id, e, pageX, pageY, null);
  }
  _updatePointerPosition(id, e, pageX, pageY) {
    let rect = this._getElementRect(this.canvas);
    pageX -= rect.left;
    pageY -= rect.top;
    let w = this.canvas.width;
    let h = this.canvas.height;
    pageX /= (rect.right - rect.left) / w;
    pageY /= (rect.bottom - rect.top) / h;
    let o = this._getPointerData(id);
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
  }
  _handleMouseUp(e) {
    this._handlePointerUp(-1, e, false);
  }
  _handlePointerUp(id, e, clear, owner) {
    let nextStage = this._nextStage, o = this._getPointerData(id);
    if (this._prevStage && owner === undefined) {
      return;
    }
    let target = null, oTarget = o.target;
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
  }
  _handleMouseDown(e) {
    this._handlePointerDown(-1, e, e.pageX, e.pageY);
  }
  _handlePointerDown(id, e, pageX, pageY, owner) {
    if (this.preventSelection) {
      e.preventDefault();
    }
    if (this._primaryPointerID == null || id === -1) {
      this._primaryPointerID = id;
    }
    if (pageY != null) {
      this._updatePointerPosition(id, e, pageX, pageY);
    }
    let target = null, nextStage = this._nextStage, o = this._getPointerData(id);
    if (!owner) {
      target = o.target = this._getObjectsUnderPoint(o.x, o.y, null, true);
    }
    if (o.inBounds) {
      this._dispatchMouseEvent(this, "stagemousedown", false, id, o, e, target);
      o.down = true;
    }
    this._dispatchMouseEvent(target, "mousedown", true, id, o, e);
    nextStage && nextStage._handlePointerDown(id, e, pageX, pageY, owner || target && this);
  }
  _testMouseOver(clear, owner, eventTarget) {
    if (this._prevStage && owner === undefined) {
      return;
    }
    let nextStage = this._nextStage;
    if (!this._mouseOverIntervalID) {
      nextStage && nextStage._testMouseOver(clear, owner, eventTarget);
      return;
    }
    let o = this._getPointerData(-1);
    if (!o || !clear && this.mouseX === this._mouseOverX && this.mouseY === this._mouseOverY && this.mouseInBounds) {
      return;
    }
    let e = o.posEvtObj;
    let isEventTarget = eventTarget || e && e.target === this.canvas;
    let target = null, common = -1, cursor = "";
    if (!owner && (clear || this.mouseInBounds && isEventTarget)) {
      target = this._getObjectsUnderPoint(this.mouseX, this.mouseY, null, true);
      this._mouseOverX = this.mouseX;
      this._mouseOverY = this.mouseY;
    }
    let oldList = this._mouseOverTarget || [];
    let oldTarget = oldList[oldList.length - 1];
    let list = this._mouseOverTarget = [];
    let t = target;
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
    for (let i = 0, l = list.length; i < l; i++) {
      if (list[i] != oldList[i]) {
        break;
      }
      common = i;
    }
    if (oldTarget != target) {
      this._dispatchMouseEvent(oldTarget, "mouseout", true, -1, o, e, target);
    }
    for (let i = oldList.length - 1; i > common; i--) {
      this._dispatchMouseEvent(oldList[i], "rollout", false, -1, o, e, target);
    }
    for (let i = list.length - 1; i > common; i--) {
      this._dispatchMouseEvent(list[i], "rollover", false, -1, o, e, oldTarget);
    }
    if (oldTarget != target) {
      this._dispatchMouseEvent(target, "mouseover", true, -1, o, e, oldTarget);
    }
    nextStage && nextStage._testMouseOver(clear, owner || target && this, eventTarget || isEventTarget && this);
  }
  _handleDoubleClick(e, owner) {
    let target = null, nextStage = this._nextStage, o = this._getPointerData(-1);
    if (!owner) {
      target = this._getObjectsUnderPoint(o.x, o.y, null, true);
      this._dispatchMouseEvent(target, "dblclick", true, -1, o, e);
    }
    nextStage && nextStage._handleDoubleClick(e, owner || target && this);
  }
  _dispatchMouseEvent(target, type, bubbles, pointerId, o, nativeEvent, relatedTarget) {
    if (!target || !bubbles && !target.hasEventListener(type)) {
      return;
    }
    let evt = new MouseEvent(type, bubbles, false, o.x, o.y, nativeEvent, pointerId, pointerId === this._primaryPointerID || pointerId === -1, o.rawX, o.rawY, relatedTarget);
    target.dispatchEvent(evt);
  }
}

class VideoBuffer {
  constructor(video) {
    this.readyState = video.readyState;
    this._video = video;
    this._canvas = null;
    this._lastTime = -1;
    if (this.readyState < 2) {
      video.addEventListener("canplaythrough", this._videoReady.bind(this));
    }
  }
  getImage() {
    if (this.readyState < 2) {
      return;
    }
    let canvas = this._canvas, video = this._video;
    if (!canvas) {
      canvas = this._canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }
    if (video.readyState >= 2 && video.currentTime !== this._lastTime) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      this._lastTime = video.currentTime;
    }
    return canvas;
  }
  _videoReady() {
    this.readyState = 2;
  }
}

class Bitmap extends DisplayObject {
  constructor(imageOrUri) {
    super();
    if (typeof imageOrUri === "string") {
      this.image = document.createElement("img");
      this.image.src = imageOrUri;
    } else {
      this.image = imageOrUri;
    }
    this.sourceRect = null;
    this._webGLRenderStyle = DisplayObject._StageGL_BITMAP;
  }
  isVisible() {
    let image = this.image;
    let hasContent = this.cacheCanvas || image && (image.naturalWidth || image.getContext || image.readyState >= 2);
    return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent);
  }
  draw(ctx, ignoreCache = false) {
    if (super.draw(ctx, ignoreCache)) {
      return true;
    }
    let img = this.image, rect = this.sourceRect;
    if (img instanceof VideoBuffer) {
      img = img.getImage();
    }
    if (img == null) {
      return true;
    }
    if (rect) {
      let x1 = rect.x, y1 = rect.y, x2 = x1 + rect.width, y2 = y1 + rect.height, x = 0, y = 0, w = img.width, h = img.height;
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
  }
  getBounds() {
    let rect = super.getBounds();
    if (rect) {
      return rect;
    }
    let image = this.image, o = this.sourceRect || image;
    let hasContent = image && (image.naturalWidth || image.getContext || image.readyState >= 2);
    return hasContent ? this._rectangle.setValues(0, 0, o.width, o.height) : null;
  }
  clone(node) {
    let img = this.image;
    if (img != null && node != null) {
      img = img.cloneNode();
    }
    let bmp = new Bitmap(img);
    if (this.sourceRect) {
      bmp.sourceRect = this.sourceRect.clone();
    }
    this._cloneProps(bmp);
    return bmp;
  }
}

class Sprite extends DisplayObject {
  constructor(spriteSheet, frameOrAnimation) {
    super();
    this.currentFrame = 0;
    this.currentAnimation = null;
    this.paused = true;
    this.spriteSheet = spriteSheet;
    this.currentAnimationFrame = 0;
    this.framerate = 0;
    this._animation = null;
    this._currentFrame = null;
    this._skipAdvance = false;
    this._webGLRenderStyle = DisplayObject._StageGL_SPRITE;
    if (frameOrAnimation != null) {
      this.gotoAndPlay(frameOrAnimation);
    }
  }
  isVisible() {
    let hasContent = this.cacheCanvas || this.spriteSheet.complete;
    return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent);
  }
  draw(ctx, ignoreCache) {
    if (super.draw(ctx, ignoreCache)) {
      return true;
    }
    this._normalizeFrame();
    let o = this.spriteSheet.getFrame(this._currentFrame | 0);
    if (!o) {
      return false;
    }
    let rect = o.rect;
    if (rect.width && rect.height) {
      ctx.drawImage(o.image, rect.x, rect.y, rect.width, rect.height, -o.regX, -o.regY, rect.width, rect.height);
    }
    return true;
  }
  play() {
    this.paused = false;
  }
  stop() {
    this.paused = true;
  }
  gotoAndPlay(frameOrAnimation) {
    this.paused = false;
    this._skipAdvance = true;
    this._goto(frameOrAnimation);
  }
  gotoAndStop(frameOrAnimation) {
    this.paused = true;
    this._goto(frameOrAnimation);
  }
  advance(time) {
    let fps = this.framerate || this.spriteSheet.framerate;
    let t = fps && time != null ? time / (1e3 / fps) : 1;
    this._normalizeFrame(t);
  }
  getBounds() {
    return super.getBounds() || this.spriteSheet.getFrameBounds(this.currentFrame, this._rectangle);
  }
  clone() {
    return this._cloneProps(new Sprite(this.spriteSheet));
  }
  _cloneProps(o) {
    super._cloneProps(o);
    o.currentFrame = this.currentFrame;
    o.currentAnimation = this.currentAnimation;
    o.paused = this.paused;
    o.currentAnimationFrame = this.currentAnimationFrame;
    o.framerate = this.framerate;
    o._animation = this._animation;
    o._currentFrame = this._currentFrame;
    o._skipAdvance = this._skipAdvance;
    return o;
  }
  _tick(evtObj) {
    if (!this.paused) {
      if (!this._skipAdvance) {
        this.advance(evtObj && evtObj.delta);
      }
      this._skipAdvance = false;
    }
    super._tick(evtObj);
  }
  _normalizeFrame(frameDelta = 0) {
    let animation = this._animation;
    let paused = this.paused;
    let frame = this._currentFrame;
    if (animation) {
      let speed = animation.speed || 1;
      let animFrame = this.currentAnimationFrame;
      let l = animation.frames.length;
      if (animFrame + frameDelta * speed >= l) {
        let next = animation.next;
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
      let l = this.spriteSheet.getNumFrames();
      if (frame >= l && l > 0) {
        if (!this._dispatchAnimationEnd(animation, frame, paused, l - 1)) {
          if ((this._currentFrame -= l) >= l) {
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
  }
  _dispatchAnimationEnd(animation, frame, paused, next, end) {
    let name = animation ? animation.name : null;
    if (this.hasEventListener("animationend")) {
      let evt = new Event("animationend");
      evt.name = name;
      evt.next = next;
      this.dispatchEvent(evt);
    }
    let changed = this._animation != animation || this._currentFrame != frame;
    if (!changed && !paused && this.paused) {
      this.currentAnimationFrame = end;
      changed = true;
    }
    return changed;
  }
  _goto(frameOrAnimation, frame) {
    this.currentAnimationFrame = 0;
    if (isNaN(frameOrAnimation)) {
      let data = this.spriteSheet.getAnimation(frameOrAnimation);
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
  }
}

let _maxPoolSize = 100;

let _spritePool = [];

class BitmapText extends Container {
  constructor(text = "", spriteSheet = null) {
    super();
    this.text = text;
    this.spriteSheet = spriteSheet;
    this.lineHeight = 0;
    this.letterSpacing = 0;
    this.spaceWidth = 0;
    this._oldProps = {
      text: 0,
      spriteSheet: 0,
      lineHeight: 0,
      letterSpacing: 0,
      spaceWidth: 0
    };
    this._oldStage = null;
    this._drawAction = null;
  }
  static get maxPoolSize() {
    return _maxPoolSize;
  }
  static set maxPoolSize(maxPoolSize) {
    _maxPoolSize = maxPoolSize;
  }
  static get _spritePool() {
    return _spritePool;
  }
  draw(ctx, ignoreCache) {
    if (this.drawCache(ctx, ignoreCache)) {
      return;
    }
    this._updateState();
    super.draw(ctx, ignoreCache);
  }
  getBounds() {
    this._updateText();
    return super.getBounds();
  }
  isVisible() {
    let hasContent = this.cacheCanvas || this.spriteSheet && this.spriteSheet.complete && this.text;
    return !!(this.visible && this.alpha > 0 && this.scaleX !== 0 && this.scaleY !== 0 && hasContent);
  }
  clone() {
    return this._cloneProps(new BitmapText(this.text, this.spriteSheet));
  }
  addChild() {}
  addChildAt() {}
  removeChild() {}
  removeChildAt() {}
  removeAllChildren() {}
  _updateState() {
    this._updateText();
  }
  _cloneProps(o) {
    super._cloneProps(o);
    o.lineHeight = this.lineHeight;
    o.letterSpacing = this.letterSpacing;
    o.spaceWidth = this.spaceWidth;
    return o;
  }
  _getFrameIndex(character, spriteSheet) {
    let c, o = spriteSheet.getAnimation(character);
    if (!o) {
      character != (c = character.toUpperCase()) || character != (c = character.toLowerCase()) || (c = null);
      if (c) {
        o = spriteSheet.getAnimation(c);
      }
    }
    return o && o.frames[0];
  }
  _getFrame(character, spriteSheet) {
    let index = this._getFrameIndex(character, spriteSheet);
    return index == null ? index : spriteSheet.getFrame(index);
  }
  _getLineHeight(ss) {
    let frame = this._getFrame("1", ss) || this._getFrame("T", ss) || this._getFrame("L", ss) || ss.getFrame(0);
    return frame ? frame.rect.height : 1;
  }
  _getSpaceWidth(ss) {
    let frame = this._getFrame("1", ss) || this._getFrame("l", ss) || this._getFrame("e", ss) || this._getFrame("a", ss) || ss.getFrame(0);
    return frame ? frame.rect.width : 1;
  }
  _tick(evtObj) {
    let stage = this.stage;
    stage && stage.on("drawstart", this._updateText, this, true);
    super._tick(evtObj);
  }
  _updateText() {
    let x = 0, y = 0, o = this._oldProps, change = false, spaceW = this.spaceWidth, lineH = this.lineHeight, ss = this.spriteSheet;
    let pool = BitmapText._spritePool, kids = this.children, childIndex = 0, numKids = kids.length, sprite;
    for (let n in o) {
      if (o[n] != this[n]) {
        o[n] = this[n];
        change = true;
      }
    }
    if (!change) {
      return;
    }
    let hasSpace = !!this._getFrame(" ", ss);
    if (!hasSpace && !spaceW) {
      spaceW = this._getSpaceWidth(ss);
    }
    if (!lineH) {
      lineH = this._getLineHeight(ss);
    }
    for (let i = 0, l = this.text.length; i < l; i++) {
      let character = this.text.charAt(i);
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
      let index = this._getFrameIndex(character, ss);
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
  }
}

class DOMElement extends DisplayObject {
  constructor(htmlElement) {
    super();
    if (typeof htmlElement === "string") {
      htmlElement = document.getElementById(htmlElement);
    }
    this.mouseEnabled = false;
    let style = htmlElement.style;
    style.position = "absolute";
    style.transformOrigin = style.WebkitTransformOrigin = style.msTransformOrigin = style.MozTransformOrigin = style.OTransformOrigin = "0% 0%";
    this.htmlElement = htmlElement;
    this._oldProps = null;
    this._oldStage = null;
    this._drawAction = null;
  }
  isVisible() {
    return this.htmlElement != null;
  }
  draw(ctx, ignoreCache) {
    return true;
  }
  cache() {}
  uncache() {}
  updateCache() {}
  hitTest() {}
  localToGlobal() {}
  globalToLocal() {}
  localToLocal() {}
  clone() {
    throw "DOMElement cannot be cloned.";
  }
  _tick(evtObj) {
    let stage = this.stage;
    if (stage != null && stage !== this._oldStage) {
      this._drawAction && stage.off("drawend", this._drawAction);
      this._drawAction = stage.on("drawend", this._handleDrawEnd, this);
      this._oldStage = stage;
    }
    super._tick(evtObj);
  }
  _handleDrawEnd(evt) {
    let o = this.htmlElement;
    if (!o) {
      return;
    }
    let style = o.style;
    let props = this.getConcatenatedDisplayProps(this._props), mtx = props.matrix;
    let visibility = props.visible ? "visible" : "hidden";
    if (visibility != style.visibility) {
      style.visibility = visibility;
    }
    if (!props.visible) {
      return;
    }
    let oldProps = this._oldProps, oldMtx = oldProps && oldProps.matrix;
    let n = 1e4;
    if (!oldMtx || !oldMtx.equals(mtx)) {
      let str = "matrix(" + (mtx.a * n | 0) / n + "," + (mtx.b * n | 0) / n + "," + (mtx.c * n | 0) / n + "," + (mtx.d * n | 0) / n + "," + (mtx.tx + .5 | 0);
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
  }
}

class Graphics {
  constructor() {
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
  static getRGB(r, g, b, alpha) {
    if (r != null && b == null) {
      alpha = g;
      b = r & 255;
      g = r >> 8 & 255;
      r = r >> 16 & 255;
    }
    if (alpha == null) {
      return `rgb(${r},${g},${b})`;
    } else {
      return `rgba(${r},${g},${b},${alpha})`;
    }
  }
  static getHSL(hue, saturation, lightness, alpha) {
    if (alpha == null) {
      return `hsl(${hue % 360},${saturation}%,${lightness}%)`;
    } else {
      return `hsl(${hue % 360},${saturation}%,${lightness}%,${alpha})`;
    }
  }
  get instructions() {
    this._updateInstructions();
    return this._instructions;
  }
  isEmpty() {
    return !(this._instructions.length || this._activeInstructions.length);
  }
  draw(ctx, data) {
    this._updateInstructions();
    let instr = this._instructions;
    const l = instr.length;
    for (let i = this._storeIndex; i < l; i++) {
      instr[i].exec(ctx, data);
    }
  }
  drawAsPath(ctx) {
    this._updateInstructions();
    let instr, instrs = this._instructions;
    const l = instrs.length;
    for (let i = this._storeIndex; i < l; i++) {
      if ((instr = instrs[i]).path !== false) {
        instr.exec(ctx);
      }
    }
  }
  moveTo(x, y) {
    return this.append(new MoveTo(x, y), true);
  }
  lineTo(x, y) {
    return this.append(new LineTo(x, y));
  }
  arcTo(x1, y1, x2, y2, radius) {
    return this.append(new ArcTo(x1, y1, x2, y2, radius));
  }
  arc(x, y, radius, startAngle, endAngle, anticlockwise) {
    return this.append(new Arc(x, y, radius, startAngle, endAngle, anticlockwise));
  }
  quadraticCurveTo(cpx, cpy, x, y) {
    return this.append(new QuadraticCurveTo(cpx, cpy, x, y));
  }
  bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
    return this.append(new BezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y));
  }
  rect(x, y, w, h) {
    return this.append(new Rect(x, y, w, h));
  }
  closePath() {
    return this._activeInstructions.length ? this.append(new ClosePath()) : this;
  }
  clear() {
    this._instructions.length = this._activeInstructions.length = this._commitIndex = 0;
    this._strokeStyle = this._oldStrokeStyle = this._stroke = this._fill = this._strokeDash = this._oldStrokeDash = null;
    this._dirty = this._strokeIgnoreScale = false;
    return this;
  }
  beginFill(color) {
    return this._setFill(color ? new Fill(color) : null);
  }
  beginLinearGradientFill(colors, ratios, x0, y0, x1, y1) {
    return this._setFill(new Fill().linearGradient(colors, ratios, x0, y0, x1, y1));
  }
  beginRadialGradientFill(colors, ratios, x0, y0, r0, x1, y1, r1) {
    return this._setFill(new Fill().radialGradient(colors, ratios, x0, y0, r0, x1, y1, r1));
  }
  beginBitmapFill(image, repetition, matrix) {
    return this._setFill(new Fill(null, matrix).bitmap(image, repetition));
  }
  endFill() {
    return this.beginFill();
  }
  setStrokeStyle(thickness, caps = 0, joints = 0, miterLimit = 10, ignoreScale = false) {
    this._updateInstructions(true);
    this._strokeStyle = this.command = new StrokeStyle(thickness, caps, joints, miterLimit, ignoreScale);
    if (this._stroke) {
      this._stroke.ignoreScale = ignoreScale;
    }
    this._strokeIgnoreScale = ignoreScale;
    return this;
  }
  setStrokeDash(segments, offset = 0) {
    this._updateInstructions(true);
    this._strokeDash = this.command = new StrokeDash(segments, offset);
    return this;
  }
  beginStroke(color) {
    return this._setStroke(color ? new Stroke(color) : null);
  }
  beginLinearGradientStroke(colors, ratios, x0, y0, x1, y1) {
    return this._setStroke(new Stroke().linearGradient(colors, ratios, x0, y0, x1, y1));
  }
  beginRadialGradientStroke(colors, ratios, x0, y0, r0, x1, y1, r1) {
    return this._setStroke(new Stroke().radialGradient(colors, ratios, x0, y0, r0, x1, y1, r1));
  }
  beginBitmapStroke(image, repetition = "repeat") {
    return this._setStroke(new Stroke().bitmap(image, repetition));
  }
  endStroke() {
    return this.beginStroke();
  }
  drawRoundRect(x, y, w, h, radius) {
    return this.drawRoundRectComplex(x, y, w, h, radius, radius, radius, radius);
  }
  drawRoundRectComplex(x, y, w, h, radiusTL, radiusTR, radiusBR, radiusBL) {
    return this.append(new RoundRect(x, y, w, h, radiusTL, radiusTR, radiusBR, radiusBL));
  }
  drawCircle(x, y, radius) {
    return this.append(new Circle(x, y, radius));
  }
  drawEllipse(x, y, w, h) {
    return this.append(new Ellipse(x, y, w, h));
  }
  drawPolyStar(x, y, radius, sides, pointSize, angle) {
    return this.append(new PolyStar(x, y, radius, sides, pointSize, angle));
  }
  append(command, clean) {
    this._activeInstructions.push(command);
    this.command = command;
    if (!clean) {
      this._dirty = true;
    }
    return this;
  }
  decodePath(str) {
    let instructions = [ this.moveTo, this.lineTo, this.quadraticCurveTo, this.bezierCurveTo, this.closePath ];
    let paramCount = [ 2, 2, 4, 6, 0 ];
    let i = 0;
    const l = str.length;
    let params = [];
    let x = 0, y = 0;
    let base64 = Graphics.BASE_64;
    while (i < l) {
      let c = str.charAt(i);
      let n = base64[c];
      let fi = n >> 3;
      let f = instructions[fi];
      if (!f || n & 3) {
        throw `bad path data (@${i}):c`;
      }
      const pl = paramCount[fi];
      if (!fi) {
        x = y = 0;
      }
      params.length = 0;
      i++;
      let charCount = (n >> 2 & 1) + 2;
      for (let p = 0; p < pl; p++) {
        let num = base64[str.charAt(i)];
        let sign = num >> 5 ? -1 : 1;
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
  }
  store() {
    this._updateInstructions(true);
    this._storeIndex = this._instructions.length;
    return this;
  }
  unstore() {
    this._storeIndex = 0;
    return this;
  }
  clone() {
    let o = new Graphics();
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
  }
  toString() {
    return `[${this.constructor.name}]`;
  }
  _updateInstructions(commit) {
    let instr = this._instructions, active = this._activeInstructions, commitIndex = this._commitIndex;
    if (this._dirty && active.length) {
      instr.length = commitIndex;
      instr.push(Graphics.beginCmd);
      const l = active.length, ll = instr.length;
      instr.length = ll + l;
      for (let i = 0; i < l; i++) {
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
  }
  _setFill(fill) {
    this._updateInstructions(true);
    this.command = this._fill = fill;
    return this;
  }
  _setStroke(stroke) {
    this._updateInstructions(true);
    if (this.command = this._stroke = stroke) {
      stroke.ignoreScale = this._strokeIgnoreScale;
    }
    return this;
  }
}

class LineTo {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  exec(ctx) {
    ctx.lineTo(this.x, this.y);
  }
}

class MoveTo {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  exec(ctx) {
    ctx.moveTo(this.x, this.y);
  }
}

class ArcTo {
  constructor(x1, y1, x2, y2, radius) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.radius = radius;
  }
  exec(ctx) {
    ctx.arcTo(this.x1, this.y1, this.x2, this.y2, this.radius);
  }
}

class Arc {
  constructor(x, y, radius, startAngle, endAngle, anticlockwise) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.startAngle = startAngle;
    this.endAngle = endAngle;
    this.anticlockwise = !!anticlockwise;
  }
  exec(ctx) {
    ctx.arc(this.x, this.y, this.radius, this.startAngle, this.endAngle, this.anticlockwise);
  }
}

class QuadraticCurveTo {
  constructor(cpx, cpy, x, y) {
    this.cpx = cpx;
    this.cpy = cpy;
    this.x = x;
    this.y = y;
  }
  exec(ctx) {
    ctx.quadraticCurveTo(this.cpx, this.cpy, this.x, this.y);
  }
}

class BezierCurveTo {
  constructor(cp1x, cp1y, cp2x, cp2y, x, y) {
    this.cp1x = cp1x;
    this.cp1y = cp1y;
    this.cp2x = cp2x;
    this.cp2y = cp2y;
    this.x = x;
    this.y = y;
  }
  exec(ctx) {
    ctx.bezierCurveTo(this.cp1x, this.cp1y, this.cp2x, this.cp2y, this.x, this.y);
  }
}

class Rect {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  exec(ctx) {
    ctx.rect(this.x, this.y, this.w, this.h);
  }
}

class ClosePath {
  constructor() {}
  exec(ctx) {
    ctx.closePath();
  }
}

class BeginPath {
  constructor() {}
  exec(ctx) {
    ctx.beginPath();
  }
}

class Fill {
  constructor(style, matrix) {
    this.style = style;
    this.matrix = matrix;
    this.path = false;
  }
  exec(ctx) {
    if (!this.style) {
      return;
    }
    ctx.fillStyle = this.style;
    let mtx = this.matrix;
    if (mtx) {
      ctx.save();
      ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
    }
    ctx.fill();
    if (mtx) {
      ctx.restore();
    }
  }
  linearGradient(colors, ratios, x0, y0, x1, y1) {
    let o = this.style = Graphics._ctx.createLinearGradient(x0, y0, x1, y1);
    const l = colors.length;
    for (let i = 0; i < l; i++) {
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
  }
  radialGradient(colors, ratios, x0, y0, r0, x1, y1, r1) {
    let o = this.style = Graphics._ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
    const l = colors.length;
    for (let i = 0; i < l; i++) {
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
  }
  bitmap(image, repetition = "") {
    if (image.naturalWidth || image.getContext || image.readyState >= 2) {
      let o = this.style = Graphics._ctx.createPattern(image, repetition);
      o.props = {
        image: image,
        repetition: repetition,
        type: "bitmap"
      };
    }
    return this;
  }
}

class Stroke {
  constructor(style, ignoreScale) {
    this.style = style;
    this.ignoreScale = ignoreScale;
    this.path = false;
  }
  exec(ctx) {
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
  }
  linearGradient(...args) {
    Fill.prototype.linearGradient.apply(this, args);
  }
  radialGradient(...args) {
    Fill.prototype.radialGradient.apply(this, args);
  }
  bitmap(...args) {
    Fill.prototype.bitmap.apply(this, args);
  }
}

class StrokeStyle {
  constructor(width, caps = "butt", joints = "miter", miterLimit = 10, ignoreScale = false) {
    this.width = width;
    this.caps = caps;
    this.joints = joints;
    this.miterLimit = miterLimit;
    this.ignoreScale = ignoreScale;
    this.path = false;
  }
  exec(ctx) {
    ctx.lineWidth = this.width;
    ctx.lineCap = isNaN(this.caps) ? this.caps : Graphics.STROKE_CAPS_MAP[this.caps];
    ctx.lineJoin = isNaN(this.joints) ? this.joints : Graphics.STROKE_JOINTS_MAP[this.joints];
    ctx.miterLimit = this.miterLimit;
    ctx.ignoreScale = this.ignoreScale;
  }
}

class StrokeDash {
  constructor(segments = StrokeDash.EMPTY_SEGMENTS, offset = 0) {
    this.segments = segments;
    this.offset = offset;
  }
  static get EMPTY_SEGMENTS() {
    return _EMPTY_SEGMENTS;
  }
  exec(ctx) {
    if (ctx.setLineDash) {
      ctx.setLineDash(this.segments);
      ctx.lineDashOffset = this.offset;
    }
  }
}

class RoundRect {
  constructor(x, y, w, h, radiusTL, radiusTR, radiusBR, radiusBL) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.radiusTL = radiusTL;
    this.radiusTR = radiusTR;
    this.radiusBR = radiusBR;
    this.radiusBL = radiusBL;
  }
  exec(ctx) {
    let max = (w < h ? w : h) / 2;
    let mTL = 0, mTR = 0, mBR = 0, mBL = 0;
    let x = this.x, y = this.y, w = this.w, h = this.h;
    let rTL = this.radiusTL, rTR = this.radiusTR, rBR = this.radiusBR, rBL = this.radiusBL;
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
  }
}

class Circle {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
  }
  exec(ctx) {
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
  }
}

class Ellipse {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  exec(ctx) {
    let x = this.x, y = this.y;
    let w = this.w, h = this.h;
    let k = .5522848;
    let ox = w / 2 * k;
    let oy = h / 2 * k;
    let xe = x + w;
    let ye = y + h;
    let xm = x + w / 2;
    let ym = y + h / 2;
    ctx.moveTo(x, ym);
    ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
  }
}

class PolyStar {
  constructor(x, y, radius, sides, pointSize = 0, angle = 0) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.sides = sides;
    this.pointSize = pointSize;
    this.angle = angle;
  }
  exec(ctx) {
    let x = this.x, y = this.y;
    let radius = this.radius;
    let angle = this.angle / 180 * Math.PI;
    let sides = this.sides;
    let ps = 1 - this.pointSize;
    let a = Math.PI / sides;
    ctx.moveTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
    for (let i = 0; i < sides; i++) {
      angle += a;
      if (ps != 1) {
        ctx.lineTo(x + Math.cos(angle) * radius * ps, y + Math.sin(angle) * radius * ps);
      }
      angle += a;
      ctx.lineTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
    }
    ctx.closePath();
  }
}

{
  let canvas = window.createjs && createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas");
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

class MovieClip extends Container {
  constructor({mode: mode = MovieClip.INDEPENDENT, startPosition: startPosition = 0, loop: loop = -1, paused: paused = false, frameBounds: frameBounds = null, labels: labels = null}) {
    super();
    !MovieClip.inited && MovieClip.init();
    this.mode = mode;
    this.startPosition = startPosition;
    this.loop = loop === true ? -1 : loop || 0;
    this.currentFrame = 0;
    this.timeline = new Timeline({
      useTicks: true,
      paused: true,
      mode: mode,
      startPosition: startPosition,
      loop: loop,
      frameBounds: frameBounds,
      labels: labels
    });
    this.paused = paused;
    this.actionsEnabled = true;
    this.autoReset = true;
    this.frameBounds = this.frameBounds || props.frameBounds;
    this.framerate = null;
    this._synchOffset = 0;
    this._rawPosition = -1;
    this._t = 0;
    this._managed = {};
    this._bound_resolveState = this._resolveState.bind(this);
  }
  static init() {
    if (MovieClip.inited) {
      return;
    }
    MovieClipPlugin.install();
    MovieClip.inited = true;
  }
  get labels() {
    return this.timeline.labels;
  }
  get currentLabel() {
    return this.timeline.getCurrentLabel();
  }
  get duration() {
    return this.timeline.duration;
  }
  get totalFrames() {
    return this.duration;
  }
  isVisible() {
    return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0);
  }
  draw(ctx, ignoreCache) {
    if (this.drawCache(ctx, ignoreCache)) {
      return true;
    }
    this._updateState();
    super.draw(ctx, ignoreCache);
    return true;
  }
  play() {
    this.paused = false;
  }
  stop() {
    this.paused = true;
  }
  gotoAndPlay(positionOrLabel) {
    this.paused = false;
    this._goto(positionOrLabel);
  }
  gotoAndStop(positionOrLabel) {
    this.paused = true;
    this._goto(positionOrLabel);
  }
  advance(time) {
    let INDEPENDENT = MovieClip.INDEPENDENT;
    if (this.mode !== INDEPENDENT) {
      return;
    }
    let o = this, fps = o.framerate;
    while ((o = o.parent) && fps === null) {
      if (o.mode === INDEPENDENT) {
        fps = o._framerate;
      }
    }
    this._framerate = fps;
    if (this.paused) {
      return;
    }
    let t = fps !== null && fps !== -1 && time !== null ? time / (1e3 / fps) + this._t : 1;
    let frames = t | 0;
    this._t = t - frames;
    while (frames--) {
      this._updateTimeline(this._rawPosition + 1, false);
    }
  }
  clone() {
    throw "MovieClip cannot be cloned.";
  }
  _updateState() {
    if (this._rawPosition === -1 || this.mode !== MovieClip.INDEPENDENT) {
      this._updateTimeline(-1);
    }
  }
  _tick(evtObj) {
    this.advance(evtObj && evtObj.delta);
    super._tick(evtObj);
  }
  _goto(positionOrLabel) {
    let pos = this.timeline.resolve(positionOrLabel);
    if (pos == null) {
      return;
    }
    this._t = 0;
    this._updateTimeline(pos, true);
  }
  _reset() {
    this._rawPosition = -1;
    this._t = this.currentFrame = 0;
    this.paused = false;
  }
  _updateTimeline(rawPosition, jump) {
    let synced = this.mode !== MovieClip.INDEPENDENT, tl = this.timeline;
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
  }
  _renderFirstFrame() {
    const tl = this.timeline, pos = tl.rawPosition;
    tl.setPosition(0, true, true, this._bound_resolveState);
    tl.rawPosition = pos;
  }
  _resolveState() {
    let tl = this.timeline;
    this.currentFrame = tl.position;
    for (let n in this._managed) {
      this._managed[n] = 1;
    }
    let tweens = tl.tweens;
    for (let tween of tweens) {
      let target = tween.target;
      if (target === this || tween.passive) {
        continue;
      }
      let offset = tween._stepPosition;
      if (target instanceof DisplayObject) {
        this._addManagedChild(target, offset);
      } else {
        this._setState(target.state, offset);
      }
    }
    let kids = this.children;
    for (let i = kids.length - 1; i >= 0; i--) {
      let id = kids[i].id;
      if (this._managed[id] === 1) {
        this.removeChildAt(i);
        delete this._managed[id];
      }
    }
  }
  _setState(state, offset) {
    if (!state) {
      return;
    }
    for (let i = state.length - 1; i >= 0; i--) {
      let o = state[i];
      let target = o.t;
      let props = o.p;
      for (let n in props) {
        target[n] = props[n];
      }
      this._addManagedChild(target, offset);
    }
  }
  _addManagedChild(child, offset) {
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
  }
  _getBounds(matrix, ignoreTransform) {
    let bounds = this.getBounds();
    if (!bounds && this.frameBounds) {
      bounds = this._rectangle.copy(this.frameBounds[this.currentFrame]);
    }
    if (bounds) {
      return this._transformBounds(bounds, matrix, ignoreTransform);
    }
    return super._getBounds(matrix, ignoreTransform);
  }
}

{
  MovieClip.INDEPENDENT = "independent";
  MovieClip.SINGLE_FRAME = "single";
  MovieClip.SYNCHED = "synched";
  MovieClip.inited = false;
}

class MovieClipPlugin {
  constructor() {
    throw "MovieClipPlugin cannot be instantiated.";
  }
  static install() {
    Tween._installPlugin(MovieClipPlugin);
  }
  static init(tween, prop, value) {
    return value;
  }
  static tween(tween, prop, value, startValues, endValues, ratio, wait, end) {
    if (!(tween.target instanceof MovieClip)) {
      return value;
    }
    return ratio === 1 ? endValues[prop] : startValues[prop];
  }
}

{
  MovieClipPlugin.priority = 100;
}

class Shadow {
  constructor(color = "black", offsetX = 0, offsetY = 0, blur = 0) {
    this.color = color;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.blur = blur;
  }
  toString() {
    return `[${this.constructor.name}]`;
  }
  clone() {
    return new Shadow(this.color, this.offsetX, this.offsetY, this.blur);
  }
}

{
  Shadow.identity = new Shadow("transparent");
}

class Shape extends DisplayObject {
  constructor(graphics = new Graphics()) {
    super();
    this.graphics = graphics;
  }
  isVisible() {
    let hasContent = this.cacheCanvas || this.graphics && !this.graphics.isEmpty();
    return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent);
  }
  draw(ctx, ignoreCache = false) {
    if (super.draw(ctx, ignoreCache)) {
      return true;
    }
    this.graphics.draw(ctx, this);
    return true;
  }
  clone(recursive = false) {
    let g = recursive && this.graphics ? this.graphics.clone() : this.graphics;
    return this._cloneProps(new Shape(g));
  }
}

class SpriteSheet extends EventDispatcher {
  constructor(data) {
    super();
    this.complete = true;
    this.framerate = 0;
    this._animations = null;
    this._frames = null;
    this._images = null;
    this._data = null;
    this._loadCount = 0;
    this._frameHeight = 0;
    this._frameWidth = 0;
    this._numFrames = 0;
    this._regX = 0;
    this._regY = 0;
    this._spacing = 0;
    this._margin = 0;
    this._parseData(data);
  }
  get animations() {
    return this._animations.slice();
  }
  getNumFrames(animation) {
    if (animation == null) {
      return this._frames ? this._frames.length : this._numFrames || 0;
    } else {
      let data = this._data[animation];
      if (data == null) {
        return 0;
      } else {
        return data.frames.length;
      }
    }
  }
  getAnimation(name) {
    return this._data[name];
  }
  getFrame(frameIndex) {
    let frame;
    if (this._frames && (frame = this._frames[frameIndex])) {
      return frame;
    }
    return null;
  }
  getFrameBounds(frameIndex, rectangle = new Rectangle()) {
    let frame = this.getFrame(frameIndex);
    return frame ? rectangle.setValues(-frame.regX, -frame.regY, frame.rect.width, frame.rect.height) : null;
  }
  toString() {
    return `[${this.constructor.name}]`;
  }
  clone() {
    throw "SpriteSheet cannot be cloned.";
  }
  _parseData(data) {
    if (data == null) {
      return;
    }
    this.framerate = data.framerate || 0;
    if (data.images) {
      for (let img of data.images) {
        let a = this._images = [];
        let src;
        if (typeof img === "string") {
          src = img;
          img = document.createElement("img");
          img.src = src;
        }
        a.push(img);
        if (!img.getContext && !img.naturalWidth) {
          this._loadCount++;
          this.complete = false;
          img.onload = (() => this._handleImageLoad(src));
          img.onerror = (() => this._handleImageError(src));
        }
      }
    }
    if (data.frames != null) {
      if (Array.isArray(data.frames)) {
        this._frames = [];
        for (let arr of data.frames) {
          this._frames.push({
            image: this._images[arr[4] ? arr[4] : 0],
            rect: new Rectangle(arr[0], arr[1], arr[2], arr[3]),
            regX: arr[5] || 0,
            regY: arr[6] || 0
          });
        }
      } else {
        let o = data.frames;
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
      let o = data.animations;
      for (let name in o) {
        let anim = {
          name: name
        };
        let obj = o[name];
        let a;
        if (typeof obj === "number") {
          a = anim.frames = [ obj ];
        } else if (Array.isArray(obj)) {
          if (obj.length === 1) {
            anim.frames = [ obj[0] ];
          } else {
            anim.speed = obj[3];
            anim.next = obj[2];
            a = anim.frames = [];
            for (let i = obj[0]; i <= obj[1]; i++) {
              a.push(i);
            }
          }
        } else {
          anim.speed = obj.speed;
          anim.next = obj.next;
          let frames = obj.frames;
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
  }
  _handleImageLoad(src) {
    if (--this._loadCount === 0) {
      this._calculateFrames();
      this.complete = true;
      this.dispatchEvent("complete");
    }
  }
  _handleImageError(src) {
    let errorEvent = new Event("error");
    errorEvent.src = src;
    this.dispatchEvent(errorEvent);
    if (--this._loadCount === 0) {
      this.dispatchEvent("complete");
    }
  }
  _calculateFrames() {
    if (this._frames || this._frameWidth === 0) {
      return;
    }
    this._frames = [];
    let maxFrames = this._numFrames || 1e5;
    let frameCount = 0, frameWidth = this._frameWidth, frameHeight = this._frameHeight;
    let spacing = this._spacing, margin = this._margin;
    imgLoop: for (let i = 0, imgs = this._images, l = imgs.length; i < l; i++) {
      let img = imgs[i], imgW = img.width || img.naturalWidth, imgH = img.height || img.naturalHeight;
      let y = margin;
      while (y <= imgH - margin - frameHeight) {
        let x = margin;
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
  }
}

const _H_OFFSETS = {
  start: 0,
  left: 0,
  center: -.5,
  end: -1,
  right: -1
};

const _V_OFFSETS = {
  top: 0,
  hanging: -.01,
  middle: -.4,
  alphabetic: -.8,
  ideographic: -.85,
  bottom: -1
};

class Text extends DisplayObject {
  constructor(text, font, color) {
    super();
    this.text = text;
    this.font = font;
    this.color = color;
    this.textAlign = "left";
    this.textBaseline = "top";
    this.maxWidth = null;
    this.outline = 0;
    this.lineHeight = 0;
    this.lineWidth = null;
  }
  static get H_OFFSETS() {
    return _H_OFFSETS;
  }
  static get V_OFFSETS() {
    return _V_OFFSETS;
  }
  isVisible() {
    let hasContent = this.cacheCanvas || this.text != null && this.text !== "";
    return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent);
  }
  draw(ctx, ignoreCache) {
    if (super.draw(ctx, ignoreCache)) {
      return true;
    }
    let col = this.color || "#000";
    if (this.outline) {
      ctx.strokeStyle = col;
      ctx.lineWidth = this.outline * 1;
    } else {
      ctx.fillStyle = col;
    }
    this._drawText(this._prepContext(ctx));
    return true;
  }
  getMeasuredWidth() {
    return this._getMeasuredWidth(this.text);
  }
  getMeasuredLineHeight() {
    return this._getMeasuredWidth("M") * 1.2;
  }
  getMeasuredHeight() {
    return this._drawText(null, {}).height;
  }
  getBounds() {
    let rect = super.getBounds();
    if (rect) {
      return rect;
    }
    if (this.text == null || this.text === "") {
      return null;
    }
    let o = this._drawText(null, {});
    let w = this.maxWidth && this.maxWidth < o.width ? this.maxWidth : o.width;
    let x = w * Text.H_OFFSETS[this.textAlign || "left"];
    let lineHeight = this.lineHeight || this.getMeasuredLineHeight();
    let y = lineHeight * Text.V_OFFSETS[this.textBaseline || "top"];
    return this._rectangle.setValues(x, y, w, o.height);
  }
  getMetrics() {
    let o = {
      lines: []
    };
    o.lineHeight = this.lineHeight || this.getMeasuredLineHeight();
    o.vOffset = o.lineHeight * Text.V_OFFSETS[this.textBaseline || "top"];
    return this._drawText(null, o, o.lines);
  }
  clone() {
    return this._cloneProps(new Text(this.text, this.font, this.color));
  }
  toString() {
    return `[${this.constructor.name} (text=${this.text.length > 20 ? `${this.text.substr(0, 17)}...` : this.text})]`;
  }
  _cloneProps(o) {
    super._cloneProps(o);
    o.textAlign = this.textAlign;
    o.textBaseline = this.textBaseline;
    o.maxWidth = this.maxWidth;
    o.outline = this.outline;
    o.lineHeight = this.lineHeight;
    o.lineWidth = this.lineWidth;
    return o;
  }
  _prepContext(ctx) {
    ctx.font = this.font || "10px sans-serif";
    ctx.textAlign = this.textAlign || "left";
    ctx.textBaseline = this.textBaseline || "top";
    ctx.lineJoin = "miter";
    ctx.miterLimit = 2.5;
    return ctx;
  }
  _drawText(ctx, o, lines) {
    const paint = !!ctx;
    if (!paint) {
      ctx = Text._workingContext;
      ctx.save();
      this._prepContext(ctx);
    }
    let lineHeight = this.lineHeight || this.getMeasuredLineHeight();
    let maxW = 0, count = 0;
    let hardLines = String(this.text).split(/(?:\r\n|\r|\n)/);
    for (let str of hardLines) {
      let w = null;
      if (this.lineWidth != null && (w = ctx.measureText(str).width) > this.lineWidth) {
        let words = str.split(/(\s)/);
        str = words[0];
        w = ctx.measureText(str).width;
        const l = words.length;
        for (let i = 1; i < l; i += 2) {
          let wordW = ctx.measureText(words[i] + words[i + 1]).width;
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
  }
  _drawTextLine(ctx, text, y) {
    if (this.outline) {
      ctx.strokeText(text, 0, y, this.maxWidth || 65535);
    } else {
      ctx.fillText(text, 0, y, this.maxWidth || 65535);
    }
  }
  _getMeasuredWidth(text) {
    let ctx = Text._workingContext;
    ctx.save();
    let w = this._prepContext(ctx).measureText(text).width;
    ctx.restore();
    return w;
  }
}

{
  let canvas = window.createjs && createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas");
  if (canvas.getContext) {
    Text._workingContext = canvas.getContext("2d");
    canvas.width = canvas.height = 1;
  }
}

class AlphaMapFilter extends Filter {
  constructor(alphaMap) {
    super();
    this.alphaMap = alphaMap;
    this._alphaMap = null;
    this._mapData = null;
    this._mapTexture = null;
    this.FRAG_SHADER_BODY = `\n\t\t\tuniform sampler2D uAlphaSampler;\n\n\t\t\tvoid main (void) {\n\t\t\t\tvec4 color = texture2D(uSampler, vRenderCoord);\n\t\t\t\tvec4 alphaMap = texture2D(uAlphaSampler, vTextureCoord);\n\n\t\t\t\t// some image formats can have transparent white rgba(1,1,1, 0) when put on the GPU, this means we need a slight tweak\n\t\t\t\t// using ceil ensure that the colour will be used so long as it exists but pure transparency will be treated black\n\t\t\t\tgl_FragColor = vec4(color.rgb, color.a * (alphaMap.r * ceil(alphaMap.a)));\n\t\t\t}\n\t\t`;
  }
  shaderParamSetup(gl, stage, shaderProgram) {
    if (!this._mapTexture) {
      this._mapTexture = gl.createTexture();
    }
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this._mapTexture);
    stage.setTextureParams(gl);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.alphaMap);
    gl.uniform1i(gl.getUniformLocation(shaderProgram, "uAlphaSampler"), 1);
  }
  clone() {
    let o = new AlphaMapFilter(this.alphaMap);
    o._alphaMap = this._alphaMap;
    o._mapData = this._mapData;
    return o;
  }
  _applyFilter(imageData) {
    if (!this.alphaMap) {
      return true;
    }
    if (!this._prepAlphaMap()) {
      return false;
    }
    let data = imageData.data;
    let map = this._mapData;
    const l = data.length;
    for (let i = 0; i < l; i += 4) {
      data[i + 3] = map[i] || 0;
    }
    return true;
  }
  _prepAlphaMap() {
    if (!this.alphaMap) {
      return false;
    }
    if (this.alphaMap === this._alphaMap && this._mapData) {
      return true;
    }
    this._mapData = null;
    let map = this._alphaMap = this.alphaMap;
    let canvas = map;
    let ctx;
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
  }
}

class AlphaMaskFilter extends Filter {
  constructor(mask) {
    super();
    this.mask = mask;
    this.usesContext = true;
    this.FRAG_SHADER_BODY = `\n\t\t\tuniform sampler2D uAlphaSampler;\n\n\t\t\tvoid main (void) {\n\t\t\t\tvec4 color = texture2D(uSampler, vRenderCoord);\n\t\t\t\tvec4 alphaMap = texture2D(uAlphaSampler, vTextureCoord);\n\n\t\t\t\tgl_FragColor = vec4(color.rgb, color.a * alphaMap.a);\n\t\t\t}\n\t\t`;
  }
  applyFilter(ctx, x, y, width, height, targetCtx, targetX, targetY) {
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
  }
  clone() {
    return new AlphaMaskFilter(this.mask);
  }
  shaderParamSetup(gl, stage, shaderProgram) {
    if (!this._mapTexture) {
      this._mapTexture = gl.createTexture();
    }
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this._mapTexture);
    stage.setTextureParams(gl);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.mask);
    gl.uniform1i(gl.getUniformLocation(shaderProgram, "uAlphaSampler"), 1);
  }
}

const _MUL_TABLE = [ 1, 171, 205, 293, 57, 373, 79, 137, 241, 27, 391, 357, 41, 19, 283, 265, 497, 469, 443, 421, 25, 191, 365, 349, 335, 161, 155, 149, 9, 278, 269, 261, 505, 245, 475, 231, 449, 437, 213, 415, 405, 395, 193, 377, 369, 361, 353, 345, 169, 331, 325, 319, 313, 307, 301, 37, 145, 285, 281, 69, 271, 267, 263, 259, 509, 501, 493, 243, 479, 118, 465, 459, 113, 446, 55, 435, 429, 423, 209, 413, 51, 403, 199, 393, 97, 3, 379, 375, 371, 367, 363, 359, 355, 351, 347, 43, 85, 337, 333, 165, 327, 323, 5, 317, 157, 311, 77, 305, 303, 75, 297, 294, 73, 289, 287, 71, 141, 279, 277, 275, 68, 135, 67, 133, 33, 262, 260, 129, 511, 507, 503, 499, 495, 491, 61, 121, 481, 477, 237, 235, 467, 232, 115, 457, 227, 451, 7, 445, 221, 439, 218, 433, 215, 427, 425, 211, 419, 417, 207, 411, 409, 203, 202, 401, 399, 396, 197, 49, 389, 387, 385, 383, 95, 189, 47, 187, 93, 185, 23, 183, 91, 181, 45, 179, 89, 177, 11, 175, 87, 173, 345, 343, 341, 339, 337, 21, 167, 83, 331, 329, 327, 163, 81, 323, 321, 319, 159, 79, 315, 313, 39, 155, 309, 307, 153, 305, 303, 151, 75, 299, 149, 37, 295, 147, 73, 291, 145, 289, 287, 143, 285, 71, 141, 281, 35, 279, 139, 69, 275, 137, 273, 17, 271, 135, 269, 267, 133, 265, 33, 263, 131, 261, 130, 259, 129, 257, 1 ];

const _SHG_TABLE = [ 0, 9, 10, 11, 9, 12, 10, 11, 12, 9, 13, 13, 10, 9, 13, 13, 14, 14, 14, 14, 10, 13, 14, 14, 14, 13, 13, 13, 9, 14, 14, 14, 15, 14, 15, 14, 15, 15, 14, 15, 15, 15, 14, 15, 15, 15, 15, 15, 14, 15, 15, 15, 15, 15, 15, 12, 14, 15, 15, 13, 15, 15, 15, 15, 16, 16, 16, 15, 16, 14, 16, 16, 14, 16, 13, 16, 16, 16, 15, 16, 13, 16, 15, 16, 14, 9, 16, 16, 16, 16, 16, 16, 16, 16, 16, 13, 14, 16, 16, 15, 16, 16, 10, 16, 15, 16, 14, 16, 16, 14, 16, 16, 14, 16, 16, 14, 15, 16, 16, 16, 14, 15, 14, 15, 13, 16, 16, 15, 17, 17, 17, 17, 17, 17, 14, 15, 17, 17, 16, 16, 17, 16, 15, 17, 16, 17, 11, 17, 16, 17, 16, 17, 16, 17, 17, 16, 17, 17, 16, 17, 17, 16, 16, 17, 17, 17, 16, 14, 17, 17, 17, 17, 15, 16, 14, 16, 15, 16, 13, 16, 15, 16, 14, 16, 15, 16, 12, 16, 15, 16, 17, 17, 17, 17, 17, 13, 16, 15, 17, 17, 17, 16, 15, 17, 17, 17, 16, 15, 17, 17, 14, 16, 17, 17, 16, 17, 17, 16, 15, 17, 16, 14, 17, 16, 15, 17, 16, 17, 17, 16, 17, 15, 16, 17, 14, 17, 16, 15, 17, 16, 17, 13, 17, 16, 17, 17, 16, 17, 14, 17, 16, 17, 16, 17, 16, 17, 9 ];

class BlurFilter extends Filter {
  constructor(blurX = 0, blurY = 0, quality = 1) {
    super();
    this._blurX = blurX;
    this._blurXTable = [];
    this._lastBlurX = null;
    this._blurY = blurY;
    this._blurYTable = [];
    this._lastBlurY = null;
    this._quality = isNaN(quality) || quality < 1 ? 1 : quality;
    this._lastQuality = null;
    this.quality = this._quality | 0;
    this.FRAG_SHADER_TEMPLATE = `\n\t\t\tuniform float xWeight[{{blurX}}];\n\t\t\tuniform float yWeight[{{blurY}}];\n\t\t\tuniform vec2 textureOffset;\n\t\t\tvoid main (void) {\n\t\t\t\tvec4 color = vec4(0.0);\n\n\t\t\t\tfloat xAdj = ({{blurX}}.0-1.0)/2.0;\n\t\t\t\tfloat yAdj = ({{blurY}}.0-1.0)/2.0;\n\t\t\t\tvec2 sampleOffset;\n\n\t\t\t\tfor(int i=0; i<{{blurX}}; i++) {\n\t\t\t\t\tfor(int j=0; j<{{blurY}}; j++) {\n\t\t\t\t\t\tsampleOffset = vRenderCoord + (textureOffset * vec2(float(i)-xAdj, float(j)-yAdj));\n\t\t\t\t\t\tcolor += texture2D(uSampler, sampleOffset) * (xWeight[i] * yWeight[j]);\n\t\t\t\t\t}\n\t\t\t\t}\n\n\t\t\t\tgl_FragColor = color.rgba;\n\t\t\t}\n\t\t`;
  }
  static get MUL_TABLE() {
    return _MUL_TABLE;
  }
  static get SHG_TABLE() {
    return _SHG_TABLE;
  }
  get blurX() {
    return this._blurX;
  }
  set blurX(blurX) {
    if (isNaN(blurX) || blurX < 0) {
      blurX = 0;
    }
    this._blurX = blurX;
  }
  get blurY() {
    return this._blurY;
  }
  set blurY(blurY) {
    if (isNaN(blurY) || blurY < 0) {
      blurY = 0;
    }
    this._blurY = blurY;
  }
  get quality() {
    return this._quality;
  }
  set quality(quality) {
    if (isNaN(quality) || quality < 0) {
      quality = 0;
    }
    this._quality = quality | 0;
  }
  get _buildShader() {
    const xChange = this._lastBlurX !== this._blurX;
    const yChange = this._lastBlurY !== this._blurY;
    const qChange = this._lastQuality !== this._quality;
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
  set _builtShader(value) {
    this._compiledShader;
  }
  shaderParamSetup(gl, stage, shaderProgram) {
    gl.uniform1fv(gl.getUniformLocation(shaderProgram, "xWeight"), this._blurXTable);
    gl.uniform1fv(gl.getUniformLocation(shaderProgram, "yWeight"), this._blurYTable);
    gl.uniform2f(gl.getUniformLocation(shaderProgram, "textureOffset"), 2 / (stage._viewportWidth * this._quality), 2 / (stage._viewportHeight * this._quality));
  }
  getBounds(rect) {
    let x = this.blurX | 0, y = this.blurY | 0;
    if (x <= 0 && y <= 0) {
      return rect;
    }
    let q = Math.pow(this.quality, .2);
    return (rect || new Rectangle()).pad(y * q + 1, x * q + 1, y * q + 1, x * q + 1);
  }
  clone() {
    return new BlurFilter(this.blurX, this.blurY, this.quality);
  }
  _updateShader() {
    let result = this.FRAG_SHADER_TEMPLATE;
    result = result.replace(/{{blurX}}/g, this._blurXTable.length.toFixed(0));
    result = result.replace(/{{blurY}}/g, this._blurYTable.length.toFixed(0));
    this.FRAG_SHADER_BODY = result;
  }
  _getTable(spread) {
    const EDGE = 4.2;
    if (spread <= 1) {
      return [ 1 ];
    }
    let result = [];
    let count = Math.ceil(spread * 2);
    count += count % 2 ? 0 : 1;
    let adjust = count / 2 | 0;
    for (let i = -adjust; i <= adjust; i++) {
      let x = i / adjust * EDGE;
      result.push(1 / Math.sqrt(2 * Math.PI) * Math.pow(Math.E, -(Math.pow(x, 2) / 4)));
    }
    let factor = result.reduce((a, b) => a + b, 0);
    return result.map(currentValue => currentValue / factor);
  }
  _applyFilter(imageData) {
    let radiusX = this._blurX >> 1;
    if (isNaN(radiusX) || radiusX < 0) return false;
    let radiusY = this._blurY >> 1;
    if (isNaN(radiusY) || radiusY < 0) return false;
    if (radiusX === 0 && radiusY === 0) return false;
    let iterations = this.quality;
    if (isNaN(iterations) || iterations < 1) iterations = 1;
    iterations |= 0;
    if (iterations > 3) iterations = 3;
    if (iterations < 1) iterations = 1;
    let px = imageData.data;
    let x = 0, y = 0, i = 0, p = 0, yp = 0, yi = 0, yw = 0, r = 0, g = 0, b = 0, a = 0, pr = 0, pg = 0, pb = 0, pa = 0;
    let divx = radiusX + radiusX + 1 | 0;
    let divy = radiusY + radiusY + 1 | 0;
    let w = imageData.width | 0;
    let h = imageData.height | 0;
    let w1 = w - 1 | 0;
    let h1 = h - 1 | 0;
    let rxp1 = radiusX + 1 | 0;
    let ryp1 = radiusY + 1 | 0;
    let ssx = {
      r: 0,
      b: 0,
      g: 0,
      a: 0
    };
    let sx = ssx;
    for (i = 1; i < divx; i++) {
      sx = sx.n = {
        r: 0,
        b: 0,
        g: 0,
        a: 0
      };
    }
    sx.n = ssx;
    let ssy = {
      r: 0,
      b: 0,
      g: 0,
      a: 0
    };
    let sy = ssy;
    for (i = 1; i < divy; i++) {
      sy = sy.n = {
        r: 0,
        b: 0,
        g: 0,
        a: 0
      };
    }
    sy.n = ssy;
    let si = null;
    let mtx = BlurFilter.MUL_TABLE[radiusX] | 0;
    let stx = BlurFilter.SHG_TABLE[radiusX] | 0;
    let mty = BlurFilter.MUL_TABLE[radiusY] | 0;
    let sty = BlurFilter.SHG_TABLE[radiusY] | 0;
    while (iterations-- > 0) {
      yw = yi = 0;
      let ms = mtx;
      let ss = stx;
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
  }
}

class ColorFilter extends Filter {
  constructor(redMultiplier = 1, greenMultiplier = 1, blueMultiplier = 1, alphaMultiplier = 1, redOffset = 0, greenOffset = 0, blueOffset = 0, alphaOffset = 0) {
    super();
    this.redMultiplier = redMultiplier;
    this.greenMultiplier = greenMultiplier;
    this.blueMultiplier = blueMultiplier;
    this.alphaMultiplier = alphaMultiplier;
    this.redOffset = redOffset;
    this.greenOffset = greenOffset;
    this.blueOffset = blueOffset;
    this.alphaOffset = alphaOffset;
    this.FRAG_SHADER_BODY = `\n\t\t\tuniform vec4 uColorMultiplier;\n\t\t\tuniform vec4 uColorOffset;\n\n\t\t\tvoid main (void) {\n\t\t\t\tvec4 color = texture2D(uSampler, vRenderCoord);\n\n\t\t\t\tgl_FragColor = (color * uColorMultiplier) + uColorOffset;\n\t\t\t}\n\t\t`;
  }
  shaderParamSetup(gl, stage, shaderProgram) {
    gl.uniform4f(gl.getUniformLocation(shaderProgram, "uColorMultiplier"), this.redMultiplier, this.greenMultiplier, this.blueMultiplier, this.alphaMultiplier);
    gl.uniform4f(gl.getUniformLocation(shaderProgram, "uColorOffset"), this.redOffset / 255, this.greenOffset / 255, this.blueOffset / 255, this.alphaOffset / 255);
  }
  clone() {
    return new ColorFilter(this.redMultiplier, this.greenMultiplier, this.blueMultiplier, this.alphaMultiplier, this.redOffset, this.greenOffset, this.blueOffset, this.alphaOffset);
  }
  _applyFilter(imageData) {
    let data = imageData.data;
    const l = data.length;
    for (let i = 0; i < l; i += 4) {
      data[i] = data[i] * this.redMultiplier + this.redOffset;
      data[i + 1] = data[i + 1] * this.greenMultiplier + this.greenOffset;
      data[i + 2] = data[i + 2] * this.blueMultiplier + this.blueOffset;
      data[i + 3] = data[i + 3] * this.alphaMultiplier + this.alphaOffset;
    }
    return true;
  }
}

const _DELTA_INDEX = [ 0, .01, .02, .04, .05, .06, .07, .08, .1, .11, .12, .14, .15, .16, .17, .18, .2, .21, .22, .24, .25, .27, .28, .3, .32, .34, .36, .38, .4, .42, .44, .46, .48, .5, .53, .56, .59, .62, .65, .68, .71, .74, .77, .8, .83, .86, .89, .92, .95, .98, 1, 1.06, 1.12, 1.18, 1.24, 1.3, 1.36, 1.42, 1.48, 1.54, 1.6, 1.66, 1.72, 1.78, 1.84, 1.9, 1.96, 2, 2.12, 2.25, 2.37, 2.5, 2.62, 2.75, 2.87, 3, 3.2, 3.4, 3.6, 3.8, 4, 4.3, 4.7, 4.9, 5, 5.5, 6, 6.5, 6.8, 7, 7.3, 7.5, 7.8, 8, 8.4, 8.7, 9, 9.4, 9.6, 9.8, 10 ];

const _IDENTITY_MATRIX = [ 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1 ];

const _LENGTH = 25;

class ColorMatrix {
  constructor(brightness, contrast, saturation, hue) {
    this.setColor(brightness, contrast, saturation, hue);
  }
  static get DELTA_INDEX() {
    return _DELTA_INDEX;
  }
  static get IDENTITY_MATRIX() {
    return _IDENTITY_MATRIX;
  }
  static get LENGTH() {
    return _LENGTH;
  }
  setColor(brightness, contrast, saturation, hue) {
    return this.reset().adjustColor(brightness, contrast, saturation, hue);
  }
  reset() {
    return this.copy(ColorMatrix.IDENTITY_MATRIX);
  }
  adjustColor(brightness, contrast, saturation, hue) {
    this.adjustHue(hue);
    this.adjustContrast(contrast);
    this.adjustBrightness(brightness);
    return this.adjustSaturation(saturation);
  }
  adjustBrightness(value) {
    if (value === 0 || isNaN(value)) {
      return this;
    }
    value = this._cleanValue(value, 255);
    this._multiplyMatrix([ 1, 0, 0, 0, value, 0, 1, 0, 0, value, 0, 0, 1, 0, value, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1 ]);
    return this;
  }
  adjustContrast(value) {
    if (value === 0 || isNaN(value)) {
      return this;
    }
    value = this._cleanValue(value, 100);
    let x;
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
  }
  adjustSaturation(value) {
    if (value === 0 || isNaN(value)) {
      return this;
    }
    value = this._cleanValue(value, 100);
    let x = 1 + (value > 0 ? 3 * value / 100 : value / 100);
    let lumR = .3086;
    let lumG = .6094;
    let lumB = .082;
    this._multiplyMatrix([ lumR * (1 - x) + x, lumG * (1 - x), lumB * (1 - x), 0, 0, lumR * (1 - x), lumG * (1 - x) + x, lumB * (1 - x), 0, 0, lumR * (1 - x), lumG * (1 - x), lumB * (1 - x) + x, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1 ]);
    return this;
  }
  adjustHue(value) {
    if (value === 0 || isNaN(value)) {
      return this;
    }
    value = this._cleanValue(value, 180) / 180 * Math.PI;
    let cosVal = Math.cos(value);
    let sinVal = Math.sin(value);
    let lumR = .213;
    let lumG = .715;
    let lumB = .072;
    this._multiplyMatrix([ lumR + cosVal * (1 - lumR) + sinVal * -lumR, lumG + cosVal * -lumG + sinVal * -lumG, lumB + cosVal * -lumB + sinVal * (1 - lumB), 0, 0, lumR + cosVal * -lumR + sinVal * .143, lumG + cosVal * (1 - lumG) + sinVal * .14, lumB + cosVal * -lumB + sinVal * -.283, 0, 0, lumR + cosVal * -lumR + sinVal * -(1 - lumR), lumG + cosVal * -lumG + sinVal * lumG, lumB + cosVal * (1 - lumB) + sinVal * lumB, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1 ]);
    return this;
  }
  concat(matrix) {
    matrix = this._fixMatrix(matrix);
    if (matrix.length != ColorMatrix.LENGTH) {
      return this;
    }
    this._multiplyMatrix(matrix);
    return this;
  }
  clone() {
    return new ColorMatrix().copy(this);
  }
  toArray() {
    let arr = [];
    const l = ColorMatrix.LENGTH;
    for (let i = 0; i < l; i++) {
      arr[i] = this[i];
    }
    return arr;
  }
  copy(matrix) {
    const l = ColorMatrix.LENGTH;
    for (let i = 0; i < l; i++) {
      this[i] = matrix[i];
    }
    return this;
  }
  toString() {
    return `[${this.constructor.name}]`;
  }
  _multiplyMatrix(matrix) {
    let col = [];
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        col[j] = this[j + i * 5];
      }
      for (let j = 0; j < 5; j++) {
        let val = 0;
        for (let k = 0; k < 5; k++) {
          val += matrix[j + k * 5] * col[k];
        }
        this[j + i * 5] = val;
      }
    }
  }
  _cleanValue(value, limit) {
    return Math.min(limit, Math.max(-limit, value));
  }
  _fixMatrix(matrix) {
    if (matrix instanceof ColorMatrix) {
      matrix = matrix.toArray();
    }
    if (matrix.length < ColorMatrix.LENGTH) {
      matrix = matrix.slice(0, matrix.length).concat(ColorMatrix.IDENTITY_MATRIX.slice(matrix.length, ColorMatrix.LENGTH));
    } else if (matrix.length > ColorMatrix.LENGTH) {
      matrix = matrix.slice(0, ColorMatrix.LENGTH);
    }
    return matrix;
  }
}

class ColorMatrixFilter extends Filter {
  constructor(matrix) {
    super();
    this.matrix = matrix;
    this.FRAG_SHADER_BODY = `\n\t\t\tuniform mat4 uColorMatrix;\n\t\t\tuniform vec4 uColorMatrixOffset;\n\n\t\t\tvoid main (void) {\n\t\t\t\tvec4 color = texture2D(uSampler, vRenderCoord);\n\n\t\t\t\tmat4 m = uColorMatrix;\n\t\t\t\tvec4 newColor = vec4(0,0,0,0);\n\t\t\t\tnewColor.r = color.r*m[0][0] + color.g*m[0][1] + color.b*m[0][2] + color.a*m[0][3];\n\t\t\t\tnewColor.g = color.r*m[1][0] + color.g*m[1][1] + color.b*m[1][2] + color.a*m[1][3];\n\t\t\t\tnewColor.b = color.r*m[2][0] + color.g*m[2][1] + color.b*m[2][2] + color.a*m[2][3];\n\t\t\t\tnewColor.a = color.r*m[3][0] + color.g*m[3][1] + color.b*m[3][2] + color.a*m[3][3];\n\n\t\t\t\tgl_FragColor = newColor + uColorMatrixOffset;\n\t\t\t}\n\t\t`;
  }
  shaderParamSetup(gl, stage, shaderProgram) {
    let mat = this.matrix;
    let colorMatrix = new Float32Array([ mat[0], mat[1], mat[2], mat[3], mat[5], mat[6], mat[7], mat[8], mat[10], mat[11], mat[12], mat[13], mat[15], mat[16], mat[17], mat[18] ]);
    gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "uColorMatrix"), false, colorMatrix);
    gl.uniform4f(gl.getUniformLocation(shaderProgram, "uColorMatrixOffset"), mat[4] / 255, mat[9] / 255, mat[14] / 255, mat[19] / 255);
  }
  clone() {
    return new ColorMatrixFilter(this.matrix);
  }
  _applyFilter(imageData) {
    let data = imageData.data;
    const l = data.length;
    let r, g, b, a;
    let mtx = this.matrix;
    let m0 = mtx[0], m1 = mtx[1], m2 = mtx[2], m3 = mtx[3], m4 = mtx[4];
    let m5 = mtx[5], m6 = mtx[6], m7 = mtx[7], m8 = mtx[8], m9 = mtx[9];
    let m10 = mtx[10], m11 = mtx[11], m12 = mtx[12], m13 = mtx[13], m14 = mtx[14];
    let m15 = mtx[15], m16 = mtx[16], m17 = mtx[17], m18 = mtx[18], m19 = mtx[19];
    for (let i = 0; i < l; i += 4) {
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
  }
}

class ButtonHelper {
  constructor(target, outLabel = "out", overLabel = "over", downLabel = "down", play = false, hitArea, hitLabel) {
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
  get enabled() {
    return this._enabled;
  }
  set enabled(enabled) {
    if (enabled === this._enabled) {
      return;
    }
    let o = this.target;
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
  toString() {
    return `[${this.constructor.name}]`;
  }
  handleEvent(evt) {
    let label, t = this.target, type = evt.type;
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
  }
  _reset() {
    let p = this.paused;
    this.__reset();
    this.paused = p;
  }
}

class Touch {
  constructor() {
    throw "Touch cannot be instantiated";
  }
  static isSupported() {
    return !!("ontouchstart" in window || window.navigator["msPointerEnabled"] && window.navigator["msMaxTouchPoints"] > 0 || window.navigator["pointerEnabled"] && window.navigator["maxTouchPoints"] > 0);
  }
  static enable(stage, singleTouch = false, allowDefault = false) {
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
  }
  static disable(stage) {
    if (!stage) {
      return;
    }
    if ("ontouchstart" in window) {
      Touch._IOS_disable(stage);
    } else if (window.navigator["msPointerEnabled"] || window.navigator["pointerEnabled"]) {
      Touch._IE_disable(stage);
    }
    delete stage.__touch;
  }
  static _IOS_enable(stage) {
    let canvas = stage.canvas;
    let f = stage.__touch.f = (e => Touch._IOS_handleEvent(stage, e));
    canvas.addEventListener("touchstart", f, false);
    canvas.addEventListener("touchmove", f, false);
    canvas.addEventListener("touchend", f, false);
    canvas.addEventListener("touchcancel", f, false);
  }
  static _IOS_disable(stage) {
    let canvas = stage.canvas;
    if (!canvas) {
      return;
    }
    let f = stage.__touch.f;
    canvas.removeEventListener("touchstart", f, false);
    canvas.removeEventListener("touchmove", f, false);
    canvas.removeEventListener("touchend", f, false);
    canvas.removeEventListener("touchcancel", f, false);
  }
  static _IOS_handleEvent(stage, e) {
    if (!stage) {
      return;
    }
    if (stage.__touch.preventDefault) {
      e.preventDefault && e.preventDefault();
    }
    let touches = e.changedTouches;
    let type = e.type;
    const l = touches.length;
    for (let touch of touches) {
      let id = touch.identifier;
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
  }
  static _IE_enable(stage) {
    let canvas = stage.canvas;
    let f = stage.__touch.f = (e => Touch._IE_handleEvent(stage, e));
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
  }
  static _IE_disable(stage) {
    let f = stage.__touch.f;
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
  }
  static _IE_handleEvent(stage, e) {
    if (!stage) {
      return;
    }
    if (stage.__touch.preventDefault) {
      e.preventDefault && e.preventDefault();
    }
    let type = e.type;
    let id = e.pointerId;
    let ids = stage.__touch.activeIDs;
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
  }
  static _handleStart(stage, id, e, x, y) {
    let props = stage.__touch;
    if (!props.multitouch && props.count) {
      return;
    }
    let ids = props.pointers;
    if (ids[id]) {
      return;
    }
    ids[id] = true;
    props.count++;
    stage._handlePointerDown(id, e, x, y);
  }
  static _handleMove(stage, id, e, x, y) {
    if (!stage.__touch.pointers[id]) {
      return;
    }
    stage._handlePointerMove(id, e, x, y);
  }
  static _handleEnd(stage, id, e) {
    let props = stage.__touch;
    let ids = props.pointers;
    if (!ids[id]) {
      return;
    }
    props.count--;
    stage._handlePointerUp(id, e, true);
    delete ids[id];
  }
}

const _ERR_DIMENSIONS = "frame dimensions exceed max spritesheet dimensions";

const _ERR_RUNNING = "a build is already running";

class SpriteSheetBuilder extends EventDispatcher {
  constructor(framerate = 0) {
    super();
    this.maxWidth = 2048;
    this.maxHeight = 2048;
    this.spriteSheet = null;
    this.scale = 1;
    this.padding = 1;
    this.timeSlice = .3;
    this.progress = -1;
    this.framerate = framerate;
    this._frames = [];
    this._animations = {};
    this._data = null;
    this._nextFrameIndex = 0;
    this._index = 0;
    this._timerID = null;
    this._scale = 1;
  }
  static get ERR_DIMENSIONS() {
    return _ERR_DIMENSIONS;
  }
  static get ERR_RUNNING() {
    return _ERR_RUNNING;
  }
  addFrame(source, sourceRect, scale = 1, setupFunction, setupData) {
    if (this._data) {
      throw SpriteSheetBuilder.ERR_RUNNING;
    }
    let rect = sourceRect || source.bounds || source.nominalBounds || source.getBounds && source.getBounds();
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
  }
  addAnimation(name, frames, next, speed) {
    if (this._data) {
      throw SpriteSheetBuilder.ERR_RUNNING;
    }
    this._animations[name] = {
      frames: frames,
      next: next,
      speed: speed
    };
  }
  addMovieClip(source, sourceRect, scale = 1, setupFunction, setupData, labelFunction) {
    if (this._data) {
      throw SpriteSheetBuilder.ERR_RUNNING;
    }
    let rects = source.frameBounds;
    let rect = sourceRect || source.bounds || source.nominalBounds || source.getBounds && source.getBounds();
    if (!rect && !rects) {
      return;
    }
    let baseFrameIndex = this._frames.length;
    const duration = source.timeline.duration;
    for (let i = 0; i < duration; i++) {
      let r = rects && rects[i] ? rects[i] : rect;
      this.addFrame(source, r, scale, this._setupMovieClipFrame, {
        i: i,
        f: setupFunction,
        d: setupData
      });
    }
    const labels = source.timeline._labels;
    let lbls = [];
    for (let n in labels) {
      lbls.push({
        index: labels[n],
        label: n
      });
    }
    if (lbls.length) {
      lbls.sort((a, b) => a.index - b.index);
      for (let i = 0, l = lbls.length; i < l; i++) {
        let label = lbls[i].label;
        let start = baseFrameIndex + lbls[i].index;
        let end = baseFrameIndex + (i === l - 1 ? duration : lbls[i + 1].index);
        let frames = [];
        for (let i = start; i < end; i++) {
          frames.push(i);
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
  }
  build() {
    if (this._data) {
      throw SpriteSheetBuilder.ERR_RUNNING;
    }
    this._startBuild();
    while (this._drawNext()) {}
    this._endBuild();
    return this.spriteSheet;
  }
  buildAsync(timeSlice) {
    if (this._data) {
      throw SpriteSheetBuilder.ERR_RUNNING;
    }
    this.timeSlice = timeSlice;
    this._startBuild();
    this._timerID = setTimeout(() => this._run(), 50 - Math.max(.01, Math.min(.99, this.timeSlice || .3)) * 50);
  }
  stopAsync() {
    clearTimeout(this._timerID);
    this._data = null;
  }
  clone() {
    throw "SpriteSheetBuilder cannot be cloned.";
  }
  toString() {
    return `[${this.constructor.name}]`;
  }
  _startBuild() {
    let pad = this.padding || 0;
    this.progress = 0;
    this.spriteSheet = null;
    this._index = 0;
    this._scale = this.scale;
    let dataFrames = [];
    this._data = {
      images: [],
      frames: dataFrames,
      framerate: this.framerate,
      animations: this._animations
    };
    let frames = this._frames.slice();
    frames.sort((a, b) => a.height <= b.height ? -1 : 1);
    if (frames[frames.length - 1].height + pad * 2 > this.maxHeight) {
      throw SpriteSheetBuilder.ERR_DIMENSIONS;
    }
    let y = 0, x = 0;
    let img = 0;
    while (frames.length) {
      let o = this._fillRow(frames, y, img, dataFrames, pad);
      if (o.w > x) {
        x = o.w;
      }
      y += o.h;
      if (!o.h || !frames.length) {
        let canvas = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas");
        canvas.width = this._getSize(x, this.maxWidth);
        canvas.height = this._getSize(y, this.maxHeight);
        this._data.images[img] = canvas;
        if (!o.h) {
          x = y = 0;
          img++;
        }
      }
    }
  }
  _setupMovieClipFrame(source, data) {
    let ae = source.actionsEnabled;
    source.actionsEnabled = false;
    source.gotoAndStop(data.i);
    source.actionsEnabled = ae;
    data.f && data.f(source, data.d, data.i);
  }
  _getSize(size, max) {
    let pow = 4;
    while (Math.pow(2, ++pow) < size) {}
    return Math.min(max, Math.pow(2, pow));
  }
  _fillRow(frames, y, img, dataFrames, pad) {
    let w = this.maxWidth;
    let maxH = this.maxHeight;
    y += pad;
    let h = maxH - y;
    let x = pad;
    let height = 0;
    for (let i = frames.length - 1; i >= 0; i--) {
      let frame = frames[i];
      let sc = this._scale * frame.scale;
      let rect = frame.sourceRect;
      let source = frame.source;
      let rx = Math.floor(sc * rect.x - pad);
      let ry = Math.floor(sc * rect.y - pad);
      let rh = Math.ceil(sc * rect.height + pad * 2);
      let rw = Math.ceil(sc * rect.width + pad * 2);
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
  }
  _endBuild() {
    this.spriteSheet = new SpriteSheet(this._data);
    this._data = null;
    this.progress = 1;
    this.dispatchEvent("complete");
  }
  _run() {
    let ts = Math.max(.01, Math.min(.99, this.timeSlice || .3)) * 50;
    let t = new Date().getTime() + ts;
    let complete = false;
    while (t > new Date().getTime()) {
      if (!this._drawNext()) {
        complete = true;
        break;
      }
    }
    if (complete) {
      this._endBuild();
    } else {
      this._timerID = setTimeout(() => this._run(), 50 - ts);
    }
    let p = this.progress = this._index / this._frames.length;
    if (this.hasEventListener("progress")) {
      let evt = new Event("progress");
      evt.progress = p;
      this.dispatchEvent(evt);
    }
  }
  _drawNext() {
    let frame = this._frames[this._index];
    let sc = frame.scale * this._scale;
    let rect = frame.rect;
    let sourceRect = frame.sourceRect;
    let canvas = this._data.images[frame.img];
    let ctx = canvas.getContext("2d");
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
  }
}

class SpriteSheetUtils {
  constructor() {
    throw "SpriteSheetUtils cannot be instantiated";
  }
  static extractFrame(spriteSheet, frameOrAnimation) {
    if (isNaN(frameOrAnimation)) {
      frameOrAnimation = spriteSheet.getAnimation(frameOrAnimation).frames[0];
    }
    let data = spriteSheet.getFrame(frameOrAnimation);
    if (!data) {
      return null;
    }
    let r = data.rect;
    let canvas = SpriteSheetUtils._workingCanvas;
    canvas.width = r.width;
    canvas.height = r.height;
    SpriteSheetUtils._workingContext.drawImage(data.image, r.x, r.y, r.width, r.height, 0, 0, r.width, r.height);
    let img = document.createElement("img");
    img.src = canvas.toDataURL("image/png");
    return img;
  }
  static mergeAlpha(rgbImage, alphaImage, canvas) {
    if (!canvas) {
      canvas = window.createjs && createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas");
    }
    canvas.width = Math.max(alphaImage.width, rgbImage.width);
    canvas.height = Math.max(alphaImage.height, rgbImage.height);
    let ctx = canvas.getContext("2d");
    ctx.save();
    ctx.drawImage(rgbImage, 0, 0);
    ctx.globalCompositeOperation = "destination-in";
    ctx.drawImage(alphaImage, 0, 0);
    ctx.restore();
    return canvas;
  }
  static _flip(spriteSheet, count, h, v) {
    let imgs = spriteSheet._images;
    let canvas = SpriteSheetUtils._workingCanvas;
    let ctx = SpriteSheetUtils._workingContext;
    const il = imgs.length / count;
    for (let i = 0; i < il; i++) {
      let src = imgs[i];
      src.__tmp = i;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width + 1, canvas.height + 1);
      canvas.width = src.width;
      canvas.height = src.height;
      ctx.setTransform(h ? -1 : 1, 0, 0, v ? -1 : 1, h ? src.width : 0, v ? src.height : 0);
      ctx.drawImage(src, 0, 0);
      let img = document.createElement("img");
      img.src = canvas.toDataURL("image/png");
      img.width = src.width || src.naturalWidth;
      img.height = src.height || src.naturalHeight;
      imgs.push(img);
    }
    let frames = spriteSheet._frames;
    const fl = frames.length / count;
    for (let i = 0; i < fl; i++) {
      let src = frames[i];
      let rect = src.rect.clone();
      let img = imgs[src.image.__tmp + il * count];
      let frame = {
        image: img,
        rect: rect,
        regX: src.regX,
        regY: src.regY
      };
      if (h) {
        rect.x = (img.width || img.naturalWidth) - rect.x - rect.width;
        frame.regX = rect.width - src.regX;
      }
      if (v) {
        rect.y = (img.height || img.naturalHeight) - rect.y - rect.height;
        frame.regY = rect.height - src.regY;
      }
      frames.push(frame);
    }
    let sfx = `_${h ? "h" : ""}${v ? "v" : ""}`;
    let names = spriteSheet._animations;
    let data = spriteSheet._data;
    const al = names.length / count;
    for (let i = 0; i < al; i++) {
      let name = names[i];
      let src = data[name];
      let anim = {
        name: name + sfx,
        speed: src.speed,
        next: src.next,
        frames: []
      };
      if (src.next) {
        anim.next += sfx;
      }
      let frames = src.frames;
      for (let i = 0, l = frames.length; i < l; i++) {
        anim.frames.push(frames[i] + fl * count);
      }
      data[anim.name] = anim;
      names.push(anim.name);
    }
  }
}

{
  let canvas = window.createjs && createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas");
  if (canvas.getContext) {
    SpriteSheetUtils._workingCanvas = canvas;
    SpriteSheetUtils._workingContext = canvas.getContext("2d");
    canvas.width = canvas.height = 1;
  }
}

let _alternateOutput = null;

class WebGLInspector extends EventDispatcher {
  constructor(stage) {
    super();
    this._stage = stage;
  }
  static get alternateOutput() {
    return _alternateOutput;
  }
  static set alternateOutput(alternateOutput) {
    _alternateOutput = alternateOutput;
  }
  static dispProps(item, prepend = "") {
    let p = `\tP: ${item.x.toFixed(2)}x${item.y.toFixed(2)}\t`;
    let r = `\tR: ${item.regX.toFixed(2)}x${item.regY.toFixed(2)}\t`;
    WebGLInspector._log(prepend, `${item.toString()}\t`, p, r);
  }
  static _log(...info) {
    if (WebGLInspector.alternateOutput) {
      WebGLInspector.alternateOutput.log(...info);
    } else {
      console.log(...info);
    }
  }
  log(stage) {
    if (!stage) {
      stage = this._stage;
    }
    WebGLInspector._log(`Batches Per Draw: ${(stage._batchID / stage._drawID).toFixed(4)}`);
    this.logContextInfo(stage._webGLContext);
    this.logDepth(stage.children, "");
    this.logTextureFill(stage);
  }
  toggleGPUDraw(stage, enabled) {
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
          WebGLInspector._log(`BlankDraw[${this._drawID}:${this._batchID}] : ${this.batchReason}`);
        }
      };
    }
  }
  logDepth(children, prepend = "", logFunc = WebGLInspector._log) {
    if (!children) {
      children = this._stage.children;
    }
    const l = children.length;
    for (let i = 0; i < l; i++) {
      let child = children[i];
      logFunc(`${prepend}-`, child);
      if (child.children && child.children.length) {
        this.logDepth(child.children, `|${prepend}`, logFunc);
      }
    }
  }
  logContextInfo(gl) {
    if (!gl) {
      gl = this._stage._webGLContext;
    }
    let data = `\n\t\t\t== LOG:\n\n\t\t\tMax textures per draw: ${gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS)}\n\n\t\t\tMax textures active: ${gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS)}\n\n\t\t\t\n\n\t\t\tMax texture size: ${gl.getParameter(gl.MAX_TEXTURE_SIZE) / 2}\n\n\t\t\tMax cache size: ${gl.getParameter(gl.MAX_RENDERBUFFER_SIZE) / 2}\n\n\t\t\t\n\n\t\t\tMax attributes per vertex: ${gl.getParameter(gl.MAX_VERTEX_ATTRIBS)}\n\n\t\t\tWebGL Version string: ${gl.getParameter(gl.VERSION)}\n\n\t\t\t======\n\t\t`;
    WebGLInspector._log(data);
  }
  logTextureFill(stage) {
    if (!stage) {
      stage = this._stage;
    }
    let dict = stage._textureDictionary;
    let count = stage._batchTextureCount;
    WebGLInspector._log(`${textureMax}: ${count}`);
    let output = [];
    for (let n in dict) {
      let str = n.replace(window.location.origin, "");
      let tex = dict[n];
      let shifted = tex._lastActiveIndex ? tex._lastActiveIndex === tex._activeIndex : false;
      output.push({
        src: src,
        element: tex,
        shifted: shifted
      });
      tex._lastActiveIndex = tex._activeIndex;
    }
    output.sort((a, b) => {
      if (a.element._drawID === stage._drawID) {
        return 1;
      }
      if (a.element._drawID < b.element._drawID) {
        return -1;
      }
      return 0;
    });
    const l = output.length;
    for (let i = 0; i < l; i++) {
      let out = output[i];
      let active = out.element._drawID === stage._drawID;
      WebGLInspector._log(`[${out.src}] ${active ? "ACTIVE" : "stale"} ${out.shifted ? "steady" : "DRIFT"}`, out.element);
    }
  }
}

export { EventDispatcher, Event, Ticker, StageGL, Stage, Container, DisplayObject, Bitmap, BitmapText, DOMElement, Graphics, Arc, ArcTo, BeginPath, BezierCurveTo, Circle, ClosePath, Ellipse, Fill, LineTo, MoveTo, PolyStar, QuadraticCurveTo, Rect, RoundRect, Stroke, StrokeDash, StrokeStyle, MovieClip, Shadow as Shadow, Shape, Sprite, SpriteSheet, Text, MouseEvent, AlphaMapFilter, AlphaMaskFilter, BitmapCache, BlurFilter, ColorFilter, ColorMatrix, ColorMatrixFilter, Filter, DisplayProps, Matrix2D, Point, Rectangle, ButtonHelper, Touch, SpriteSheetBuilder, SpriteSheetUtils, UID, WebGLInspector };

var cjs = window.createjs = window.createjs || {};

var v = cjs.v = cjs.v || {};

v.easeljs = "NEXT";
//# sourceMappingURL=maps/easeljs.module.js.map
