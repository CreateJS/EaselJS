/**
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
**/

(function(window) {

// constructor:
	/**
	* The Ticker class uses a static interface (ex. Ticker.getPaused()) and should not be instantiated.
	* @class Provides a centralized tick or heartbeat broadcast at a set interval. Listeners can subscribe 
	* to the tick event to be notified when a set time interval has elapsed.
	* Note that the interval that the tick event is called is a target interval, and may be broadcast 
	* at a slower interval during times of high CPU load.
	**/
	Ticker = function() {
		throw "Ticker cannot be instantiated.";
	}
	
// private static properties:
	/** @private */
	Ticker._listeners = [];
	/** @private */
	Ticker._pauseable = [];
	/** @private */
	Ticker._paused = false;
	/** @private */
	Ticker._inited = false;
	/** @private */
	Ticker._startTime = 0;
	/** @private */
	Ticker._pausedTime=0;
	/** @private : number of ticks that have passed */
	Ticker._ticks = 0;
	/** @private : number of ticks that have passed while Ticker has been paused */
	Ticker._pausedTickers = 0;
	/** @private */
	Ticker._interval = 50; // READ-ONLY
	/** @private */
	Ticker._intervalID = null;
	/** @private */
	Ticker._lastTime = 0;
	/** @private */
	Ticker._times = [];
	
// public static methods:
	/**
	* Adds a listener for the tick event. The listener object must expose a .tick() method, which will be called once 
	* each tick / interval. The interval is specified via the .setInterval(ms) method.
	* The exposed tick method is passed a single parameter, which include the elapsed time between the 
	* previous tick and the current one.
	* @param o The object to add as a listener.
	* @param pauseable If false, the listener will continue to have tick called even when Ticker is paused via
	* Ticker.pause(). Default is true.
	* @static
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
	* @param o The object to remove from listening from the tick event.
	* @static
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
	* @static
	**/
	Ticker.removeAllListeners = function() {
		Ticker._listeners = [];
		Ticker._pauseable = [];
	}
	
	/**
	* Sets the target time (in milliseconds) between ticks. Default is 50 (20 FPS).
	* Note actual time between ticks may be more than requested depending on CPU load.
	* @param interval Time in milliseconds between ticks.
	* @static
	**/
	Ticker.setInterval = function(interval) {
		if (Ticker._intervalID != null) { clearInterval(Ticker._intervalID); }
		Ticker._lastTime = Ticker._getTime();
		Ticker._interval = interval;
		Ticker._intervalID = setInterval(Ticker._tick, interval);
	}
	
	/**
	* Returns the current target time between ticks, as set with setInterval.
	* @static
	**/
	Ticker.getInterval = function() {
		return Ticker._interval;
	}
	
	/**
	* Returns the target frame rate in frames per second (FPS). For example, with an interval of 40, getFPS() will 
	* return 25 (1000ms per second divided by 40 ms per tick = 25fps).
	* @static
	**/
	Ticker.getFPS = function() {
		return 1000/Ticker._interval;
	}
	
	/**
	* Sets the target frame rate in frames per second (FPS). For example, with an interval of 40, getFPS() will 
	* return 25 (1000ms per second divided by 40 ms per tick = 25fps).
	* @param value Target number of ticks broadcast per second.
	* @static
	**/	
	Ticker.setFPS = function(value) {
		Ticker.setInterval(1000/value);
	}
	
	/**
	* Returns the actual frames / ticks per second.
	* @param ticks Optional. The number of previous ticks over which to measure the actual frames / ticks per second. 
	* @static
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
	* @param value Indicates whether to pause (true) or unpause (false) Ticker.
	* @static
	**/
	Ticker.setPaused = function(value) {
		Ticker._paused = value;
	}
	
	/**
	* Returns a boolean indicating whether Ticker is currently paused, as set with setPaused.
	* @static
	**/
	Ticker.getPaused = function() {
		return Ticker._paused;
	}
	
	/**
	* Returns the number of milliseconds that have elapsed since Ticker was loaded. For example, you could use this in 
	* a time synchronized animation to determine the exact amount of time that has elapsed.
	* @param pauseable Indicates whether to return the elapsed time for pauseable, or unpauseable listeners. If true, 
	* time that elapsed while Ticker was paused is not included.
	* @static
	**/
	Ticker.getTime = function(pauseable) {
		return Ticker._getTime() - Ticker._startTime - (pauseable ? Ticker._pausedTime : 0);
	}
	
	/**
	* Returns the number of ticks that have elapsed while Ticker was active.
	* @param pauseable Indicates whether to return the elapsed ticks for pauseable, or unpauseable listeners.
	* @static
	**/
	Ticker.getTicks = function(pauseable) {
		return  Ticker._ticks - (pauseable ?Ticker._pausedTickers : 0);
	}
	
// private static methods:
	/** @private */
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
	
	/** @private */
	Ticker._getTime = function() {
		return new Date().getTime();
	}
	Ticker._startTime = Ticker._getTime();

window.Ticker = Ticker;
}(window));