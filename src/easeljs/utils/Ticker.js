/*
* Ticker
* Visit http://createjs.com/ for documentation, updates and examples.
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

// namespace:
this.createjs = this.createjs||{};

(function() {

// constructor:
/**
 * The Ticker provides  a centralized tick or heartbeat broadcast at a set interval. Listeners can subscribe to the tick
 * event to be notified when a set time interval has elapsed.
 *
 * Note that the interval that the tick event is called is a target interval, and may be broadcast at a slower interval
 * during times of high CPU load. The Ticker class uses a static interface (ex. <code>Ticker.getPaused()</code>) and should not be
 * instantiated.
 *
 * <h4>Example</h4>
 *      createjs.Ticker.addEventListener("tick", handleTick);
 *      function handleTick(event) {
 *          // Actions carried out each frame
 *      }
 * @class Ticker
 * @uses EventDispatcher
 * @static
 **/
var Ticker = function() {
	throw "Ticker cannot be instantiated.";
}

// events:

	/**
	 * Dispatched each tick.
	 * @event tick
	 * @param {Object} target The object that dispatched the event.
	 * @param {String} type The event type.
	 * @param {Boolean} paused Indicates whether the ticker is currently paused.
	 * @param {Number} delta The time elapsed in ms since the last tick.
	 * @param {Number} time The total time in ms since Ticker was initialized.
	 * @param {Number} runTime The total time in ms that Ticker was not paused since it was initialized. For example,
	 * 	you could determine the amount of time that the Ticker has been paused since initialization with time-runTime.
	 * @since 0.6.0
	 */

// public static properties:
	/**
	 * Indicates whether Ticker should use requestAnimationFrame if it is supported in the browser. If false, Ticker
	 * will use setTimeout. If you use RAF, it is recommended that you set the framerate to a divisor of 60 (ex. 15,
	 * 20, 30, 60).
	 * @property useRAF
	 * @static
	 * @type {Boolean}
	 * @default false
	 **/
	Ticker.useRAF = false;
	
// mix-ins:
	// EventDispatcher methods:
	Ticker.addEventListener = null;
	Ticker.removeEventListener = null;
	Ticker.removeAllEventListeners = null;
	Ticker.dispatchEvent = null;
	Ticker.hasEventListener = null;
	Ticker._listeners = null;
	createjs.EventDispatcher.initialize(Ticker); // inject EventDispatcher methods.
	
// private static properties:

	
	/** 
	 * @property _listeners
	 * @type {Array}
	 * @protected 
	 **/
	Ticker._listeners = null;
	
	/** 
	 * @property _pauseable
	 * @type {Array}
	 * @protected 
	 **/
	Ticker._pauseable = null;
	
	/** 
	 * @property _paused
	 * @type {Boolean}
	 * @protected 
	 **/
	Ticker._paused = false;
	
	/** 
	 * @property _inited
	 * @type {Boolean}
	 * @protected 
	 **/
	Ticker._inited = false;
	
	/** 
	 * @property _startTime
	 * @type {Number}
	 * @protected 
	 **/
	Ticker._startTime = 0;
	
	/** 
	 * @property _pausedTime
	 * @type {Number}
	 * @protected 
	 **/
	Ticker._pausedTime=0;
	
	/** 
	 * Number of ticks that have passed
	 * @property _ticks
	 * @type {Number}
	 * @protected 
	 **/
	Ticker._ticks = 0;
	
	/**
	 * Number of ticks that have passed while Ticker has been paused
	 * @property _pausedTicks
	 * @type {Number}
	 * @protected 
	 **/
	Ticker._pausedTicks = 0;
	
	/** 
	 * @property _interval
	 * @type {Number}
	 * @protected 
	 **/
	Ticker._interval = 50; // READ-ONLY
	
	/** 
	 * @property _lastTime
	 * @type {Number}
	 * @protected 
	 **/
	Ticker._lastTime = 0;
	
	/** 
	 * @property _times
	 * @type {Array}
	 * @protected 
	 **/
	Ticker._times = null;
	
	/** 
	 * @property _tickTimes
	 * @type {Array}
	 * @protected 
	 **/
	Ticker._tickTimes = null;
	
	/** 
	 * @property _rafActive
	 * @type {Boolean}
	 * @protected 
	 **/
	Ticker._rafActive = false;
	
	/** 
	 * @property _timeoutID
	 * @type {Number}
	 * @protected 
	 **/
	Ticker._timeoutID = null;
	
	
// public static methods:
	/**
	 * Adds a listener for the tick event. The listener must be either an object exposing a <code>tick</code> method,
	 * or a function. The listener will be called once each tick / interval. The interval is specified via the 
	 * .setInterval(ms) method.
	 * The tick method or function is passed two parameters: the elapsed time between the 
	 * previous tick and the current one, and a boolean indicating whether Ticker is paused.
	 * @method addListener
	 * @static
	 * @param {Object} o The object or function to add as a listener.
	 * @param {Boolean} pauseable If false, the listener will continue to have tick called 
	 * even when Ticker is paused via Ticker.pause(). Default is true.
	 * @deprecated In favour of the "tick" event. Will be removed in a future version.
	 **/
	Ticker.addListener = function(o, pauseable) {
		if (o == null) { return; }
		Ticker.removeListener(o);
		Ticker._pauseable[Ticker._listeners.length] = (pauseable == null) ? true : pauseable;
		Ticker._listeners.push(o);
	}
	
	/**
	 * Initializes or resets the timer, clearing all associated listeners and fps measuring data, starting the tick.
	 * This is called automatically when the first listener is added.
	 * @method init
	 * @static
	 **/
	Ticker.init = function() {
		Ticker._inited = true;
		Ticker._times = [];
		Ticker._tickTimes = [];
		Ticker._pauseable = [];
		Ticker._listeners = [];
		Ticker._times.push(Ticker._lastTime = Ticker._startTime = Ticker._getTime());
		Ticker.setInterval(Ticker._interval);
	}
	
	/**
	 * Removes the specified listener.
	 * @method removeListener
	 * @static
	 * @param {Object} o The object or function to remove from listening from the tick event.
	 * @deprecated In favour of the "tick" event. Will be removed in a future version.
	 **/
	Ticker.removeListener = function(o) {
		var listeners = Ticker._listeners;
		if (!listeners) { return; }
		var index = listeners.indexOf(o);
		if (index != -1) {
			listeners.splice(index, 1);
			Ticker._pauseable.splice(index, 1);
		}
	}
	
	/**
	 * Removes all listeners.
	 * @method removeAllListeners
	 * @static
	 * @deprecated In favour of the "tick" event. Will be removed in a future version.
	 **/
	Ticker.removeAllListeners = function() {
		Ticker._listeners = [];
		Ticker._pauseable = [];
	}
	
	/**
	 * Sets the target time (in milliseconds) between ticks. Default is 50 (20 FPS).
	 * Note actual time between ticks may be more than requested depending on CPU load.
	 * @method setInterval
	 * @static
	 * @param {Number} interval Time in milliseconds between ticks. Default value is 50.
	 **/
	Ticker.setInterval = function(interval) {
		Ticker._interval = interval;
		if (!Ticker._inited) { return; }
		Ticker._setupTick();
	}
	
	/**
	 * Returns the current target time between ticks, as set with setInterval.
	 * @method getInterval
	 * @static
	 * @return {Number} The current target interval in milliseconds between tick events.
	 **/
	Ticker.getInterval = function() {
		return Ticker._interval;
	}
	
	/**
	 * Sets the target frame rate in frames per second (FPS). For example, with an interval of 40, getFPS() will 
	 * return 25 (1000ms per second divided by 40 ms per tick = 25fps).
	 * @method setFPS
	 * @static
	 * @param {Number} value Target number of ticks broadcast per second.
	 **/	
	Ticker.setFPS = function(value) {
		Ticker.setInterval(1000/value);
	}
	
	/**
	 * Returns the target frame rate in frames per second (FPS). For example, with an 
	 * interval of 40, getFPS() will return 25 (1000ms per second divided by 40 ms per tick = 25fps).
	 * @method getFPS
	 * @static
	 * @return {Number} The current target number of frames / ticks broadcast per second.
	 **/
	Ticker.getFPS = function() {
		return 1000/Ticker._interval;
	}
	
	/**
	 * Returns the actual frames / ticks per second.
	 * @method getMeasuredFPS
	 * @static
	 * @param {Number} ticks Optional. The number of previous ticks over which to measure the actual 
	 * frames / ticks per second. Defaults to the number of ticks per second.
	 * @return {Number} The actual frames / ticks per second. Depending on performance, this may differ
	 * from the target frames per second.
	 **/
	Ticker.getMeasuredFPS = function(ticks) {
		if (Ticker._times.length < 2) { return -1; }
		
		// by default, calculate fps for the past 1 second:
		if (ticks == null) { ticks = Ticker.getFPS()|0; }
		ticks = Math.min(Ticker._times.length-1, ticks);
		return 1000/((Ticker._times[0]-Ticker._times[ticks])/ticks);
	}
	
	/**
	 * While Ticker is paused, pausable listeners are not ticked. See addListener for more information.
	 * @method setPaused
	 * @static
	 * @param {Boolean} value Indicates whether to pause (true) or unpause (false) Ticker.
	 **/
	Ticker.setPaused = function(value) {
		Ticker._paused = value;
	}
	
	/**
	 * Returns a boolean indicating whether Ticker is currently paused, as set with setPaused.
	 * @method getPaused
	 * @static
	 * @return {Boolean} Whether the Ticker is currently paused.
	 **/
	Ticker.getPaused = function() {
		return Ticker._paused;
	}
	
	/**
	 * Returns the number of milliseconds that have elapsed since Ticker was initialized.
	 * For example, you could use this in a time synchronized animation to determine the exact amount of 
	 * time that has elapsed.
	 * @method getTime
	 * @static
	 * @param {Boolean} runTime If true only time elapsed while Ticker was not paused will be returned.
	 * If false, the value returned will be total time elapsed since the first tick event listener was added.
	 * The default value is false.
	 * @return {Number} Number of milliseconds that have elapsed since Ticker was initialized.
	 **/
	Ticker.getTime = function(runTime) {
		return Ticker._getTime() - Ticker._startTime - (runTime ? Ticker._pausedTime : 0);
	}
	
	/**
	 * Returns the number of ticks that have been broadcast by Ticker.
	 * @method getTicks
	 * @static
	 * @param {Boolean} pauseable Indicates whether to include ticks that would have been broadcast
	 * while Ticker was paused. If true only tick events broadcast while Ticker is not paused will be returned.
	 * If false, tick events that would have been broadcast while Ticker was paused will be included in the return
	 * value. The default value is false.
	 * @return {Number} of ticks that have been broadcast.
	 **/
	Ticker.getTicks = function(pauseable) {
		return  Ticker._ticks - (pauseable ?Ticker._pausedTicks : 0);
	}
	
// private static methods:
	/**
	 * @method _handleAF
	 * @protected
	 **/
	Ticker._handleAF = function() {
		Ticker._rafActive = false;
		Ticker._setupTick();
		// run if enough time has elapsed, with a little bit of flexibility to be early, because RAF seems to run a little faster than 60hz:
		if (Ticker._getTime() - Ticker._lastTime >= (Ticker._interval-1)*0.97) {
			Ticker._tick();
		}
	}
	
	/**
	 * @method _handleTimeout
	 * @protected
	 **/
	Ticker._handleTimeout = function() {
		Ticker.timeoutID = null;
		Ticker._setupTick();
		Ticker._tick();
	}
	
	/**
	 * @method _setupTick
	 * @protected
	 **/
	Ticker._setupTick = function() {
		if (Ticker._rafActive || Ticker.timeoutID != null) { return; } // avoid duplicates
		if (Ticker.useRAF) {
			var f = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame;
			if (f) {
				f(Ticker._handleAF);
				Ticker._rafActive = true;
				return;
			}
		}
		Ticker.timeoutID = setTimeout(Ticker._handleTimeout, Ticker._interval);
	}
	
	/**
	 * @method _tick
	 * @protected
	 **/
	Ticker._tick = function() {
		var time = Ticker._getTime();
		Ticker._ticks++;
		
		var elapsedTime = time-Ticker._lastTime;
		
		var paused = Ticker._paused;
		
		if (paused) {
			Ticker._pausedTicks++;
			Ticker._pausedTime += elapsedTime;
		}
		Ticker._lastTime = time;
		
		var pauseable = Ticker._pauseable;
		var listeners = Ticker._listeners.slice();
		var l = listeners ? listeners.length : 0;
		for (var i=0; i<l; i++) {
			var listener = listeners[i];
			if (listener == null || (paused && pauseable[i])) { continue; }
			if (listener.tick) { listener.tick(elapsedTime, paused); }
			else if (listener instanceof Function) { listener(elapsedTime, paused); }
		}
		
		Ticker.dispatchEvent({type:"tick", paused:paused, delta:elapsedTime, time:time, runTime:time-Ticker._pausedTime})
		
		Ticker._tickTimes.unshift(Ticker._getTime()-time);
		while (Ticker._tickTimes.length > 100) { Ticker._tickTimes.pop(); }
		
		Ticker._times.unshift(time);
		while (Ticker._times.length > 100) { Ticker._times.pop(); }
	}
	
	/**
	 * @method _getTime
	 * @protected
	 **/
	var now = window.performance && (performance.now || performance.mozNow || performance.msNow || performance.oNow || performance.webkitNow);
	Ticker._getTime = function() {
		return (now&&now.call(performance))||(new Date().getTime());
	}
	
	
	Ticker.init();

createjs.Ticker = Ticker;
}());
