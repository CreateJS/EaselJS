/*
* Ticker by Grant Skinner. Dec 5, 2010
* Visit http://easeljs.com/ for documentation, updates and examples.
*
*
* Copyright (c) 2010 Grant Skinner
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

/**
* The Easel Javascript library provides a retained graphics mode for canvas 
* including a full, hierarchical display list, a core interaction model, and 
* helper classes to make working with Canvas much easier.
* @module EaselJS
**/


(function(window) {


// constructor:
	/**
	* The Ticker class uses a static interface (ex. Ticker.getPaused()) and should not be instantiated.
	* Provides a centralized tick or heartbeat broadcast at a set interval. Listeners can subscribe 
	* to the tick event to be notified when a set time interval has elapsed.
	* Note that the interval that the tick event is called is a target interval, and may be broadcast 
	* at a slower interval during times of high CPU load.
	* @class Ticker
	* @static
	**/
	Ticker = function() {
		throw "Ticker cannot be instantiated.";
	}
	
	
	/**
	* Event broadcast  once each tick / interval. The interval is specified via the 
	* .setInterval(ms) or setFPS methods.
	* @event tick
	* @param {Number} timeElapsed The time elapsed in milliseconds since the last tick event.
	*/	
	
// private static properties:

	
	/** 
	* @property _listeners
	* @type Array[Object]
	* @protected 
	**/
	Ticker._listeners = [];
	
	/** 
	* @property _pauseable
	* @type Array[Boolean]
	* @protected 
	**/
	Ticker._pauseable = [];
	
	/** 
	* @property _paused
	* @type Boolean
	* @protected 
	**/
	Ticker._paused = false;
	
	/** 
	* @property _inited
	* @type Boolean
	* @protected 
	**/
	Ticker._inited = false;
	
	/** 
	* @property _startTime
	* @type Number
	* @protected 
	**/
	Ticker._startTime = 0;
	
	/** 
	* @property _pausedTime
	* @type Number
	* @protected 
	**/
	Ticker._pausedTime=0;
	
	/** 
	* Number of ticks that have passed
	* @property _ticks
	* @type Number
	* @protected 
	**/
	Ticker._ticks = 0;
	
	/**
	* Number of ticks that have passed while Ticker has been paused
	* @property _pausedTickers
	* @type Number
	* @protected 
	**/
	Ticker._pausedTickers = 0;
	
	/** 
	* @property _interval
	* @type Number
	* @protected 
	**/
	Ticker._interval = 50; // READ-ONLY
	
	/** 
	* @property _intervalID
	* @type Number
	* @protected 
	**/
	Ticker._intervalID = null;
	
	/** 
	* @property _lastTime
	* @type Number
	* @protected 
	**/
	Ticker._lastTime = 0;
	
	/** 
	* @property _times
	* @type Array[Number]
	* @protected 
	**/
	Ticker._times = [];
	
// public static methods:
	/**
	* Adds a listener for the tick event. The listener object must expose a .tick() method, 
	* which will be called once each tick / interval. The interval is specified via the 
	* .setInterval(ms) method.
	* The exposed tick method is passed a single parameter, which include the elapsed time between the 
	* previous tick and the current one.
	* @method addListener
	* @static
	* @param {Object} o The object to add as a listener.
	* @param {Boolean} pauseable If false, the listener will continue to have tick called 
	* even when Ticker is paused via Ticker.pause(). Default is true.
	**/
	Ticker.addListener = function(o, pauseable) {
		if (!Ticker._inited) {
			Ticker._inited = true;
			Ticker.setInterval(Ticker._interval);
		}
		this.removeListener(o);
		Ticker._pauseable[Ticker._listeners.length] = (pauseable == null) ? true : pauseable;
		Ticker._listeners.push(o);
	}
	
	/**
	* Removes the specified listener.
	* @method removeListener
	* @static
	* @param {Object} o The object to remove from listening from the tick event.
	**/
	Ticker.removeListener = function(o) {
		if (Ticker._listeners == null) { return; }
		var index = Ticker._listeners.indexOf(o);
		if (index != -1) {
			Ticker._listeners.splice(index, 1);
			Ticker._pauseable.splice(index, 1);
		}
	}
	
	/**
	* Removes all listeners.
	* @method removeAllListeners
	* @static
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
		if (Ticker._intervalID != null) { clearInterval(Ticker._intervalID); }
		Ticker._lastTime = Ticker._getTime();
		Ticker._interval = interval;
		Ticker._intervalID = setInterval(Ticker._tick, interval);
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
	* Returns the actual frames / ticks per second.
	* @method getMeasuredFPS
	* @static
	* @param {Number} ticks Optional. The number of previous ticks over which to measure the actual 
	* frames / ticks per second.
	* @return {Number} The actual frames / ticks per second. Depending on performance, this may differ
	* from the target frames per second.
	**/
	Ticker.getMeasuredFPS = function(ticks) {
		if (Ticker._times.length < 2) { return -1; }
		
		// x >> 1 : use bitwise to divide by two (int math)
		if (ticks == null) { ticks = Ticker.getFPS()>>1; }
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
	* Returns the number of milliseconds that have elapsed since the first tick event listener was added to
	* Ticker. For example, you could use this in a time synchronized animation to determine the exact amount of 
	* time that has elapsed.
	* @method getTime
	* @static
	* @param {Boolean} pauseable Indicates whether to include time elapsed
	* while Ticker was paused. If false only time elapsed while Ticker is not paused will be returned.
	* If true, the value returned will be total time elapsed since the first tick event listener was added.
	* @return {Number} Number of milliseconds that have elapsed since Ticker was begun.
	**/
	Ticker.getTime = function(pauseable) {
		return Ticker._getTime() - Ticker._startTime - (pauseable ? Ticker._pausedTime : 0);
	}
	
	/**
	* Returns the number of ticks that have been broadcast by Ticker.
	* @method getTicks
	* @static
	* @param {Boolean} pauseable Indicates whether to include ticks that would have been broadcast
	* while Ticker was paused. If false only tick events broadcast while Ticker is not paused will be returned.
	* If true, tick events that would have been broadcast while Ticker was paused will be included in the return
	* value. The default value is false.
	* @return {Number} of ticks that have been broadcast.
	**/
	Ticker.getTicks = function(pauseable) {
		return  Ticker._ticks - (pauseable ?Ticker._pausedTickers : 0);
	}
	
// private static methods:

	/**
	* @method _tick
	* @protected
	**/
	Ticker._tick = function() {
		Ticker._ticks++;
		
		var time = Ticker.getTime(false);
		var elapsedTime = time-Ticker._lastTime;
		var paused = Ticker._paused;
		
		if (paused) {
			Ticker._pausedTickers++;
			Ticker._pausedTime += elapsedTime;
		}
		Ticker._lastTime = time;
		
		var pauseable = Ticker._pauseable;
		var listeners = Ticker._listeners;
		
		var l = listeners ? listeners.length : 0;
		for (var i=0; i<l; i++) {
			var p = pauseable[i];
			var listener = listeners[i];
			if (listener == null || (paused && p) || listener.tick == null) { continue; }
			listener.tick(elapsedTime);
		}
		
		Ticker._times.unshift(time);
		if (Ticker._times.length > 100) { Ticker._times.pop(); }
	}
	
	/**
	* @method _getTime
	* @protected
	**/
	Ticker._getTime = function() {
		return new Date().getTime();
	}
	
	//docced above
	Ticker._startTime = Ticker._getTime();

window.Ticker = Ticker;
}(window));