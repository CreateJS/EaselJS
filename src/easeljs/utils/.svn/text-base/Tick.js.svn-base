/**
* Tick by Grant Skinner. Dec 5, 2010
* Visit www.gskinner.com/blog for documentation, updates and more free code.
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
	* The Tick class uses a static interface (ex. Tick.getPaused()) and should not be instantiated.
	* @class Provides a centralized tick or heartbeat. Listeners can subscribe to the tick, and identify whether they are pausable or not.
	**/
	function Tick() {
		throw "Tick cannot be instantiated.";
	}
	
// private static properties:
	/** @private **/
	Tick._listeners = null;
	/** @private **/
	Tick._pauseable = null;
	/** @private **/
	Tick._paused = false;
	/** @private **/
	Tick._inited = false;
	/** @private **/
	Tick._startTime = 0;
	/** @private **/
	Tick._pausedTime=0;
	/** @private **/
	Tick._ticks = 0;
	/** @private **/
	Tick._pausedTicks = 0;
	/** @private **/
	Tick._interval = 50; // READ-ONLY
	/** @private **/
	Tick._intervalID = null;
	/** @private **/
	Tick._lastTime = 0;
	
// public static methods:
	/**
	* Adds a listener to the tick. The listener object must expose a .tick() method, which will be called once each tick. The exposed tick method can optionally accept a single parameter, which will include the elapsed time between the previous tick and the current one.
	* @param o The object to add as a listener.
	* @param pausable If false, the listener will continue to have tick called even when Tick is paused via Tick.pause(). Default is false.
	* @static
	**/
	Tick.addListener = function(o, pauseable) {
		if (!Tick._inited) {
			Tick._inited = true;
			Tick.removeAllListeners();
			Tick.setInterval(Tick._interval);
		}
		
		var index = Tick._listeners.indexOf(o);
		if (index != -1) {
			Tick._pauseable[index] = pauseable;
			return;
		}
		
		Tick._pauseable[Tick._listeners.length] = pauseable;
		Tick._listeners.push(o);
	}
	
	/**
	* Removes the specified listener.
	* @param o The listener to remove.
	* @static
	**/
	Tick.removeListener = function(o) {
		if (Tick._listeners == null) { return; }
		var index = Tick._listeners.indexOf(o);
		if (index != -1) {
			Tick._listeners.splice(index,1);
			Tick._pauseable.splice(index,1);
		}
	}
	
	/**
	* Removes all listeners.
	* @static
	**/
	Tick.removeAllListeners = function() {
		Tick._listeners = [];
		Tick._pauseable = [];
	}
	
	/**
	* Sets the time (in milliseconds) between ticks. Default is 50 (20 FPS).
	* @param interval Time in milliseconds between ticks.
	* @static
	**/
	Tick.setInterval = function(interval) {
		if (Tick._intervalID != null) { clearInterval(Tick._intervalID); }
		Tick._lastTime = Tick._getTime();
		Tick._interval = interval;
		Tick._intervalID = setInterval(Tick._tick, interval);
	}
	
	/**
	* Returns the current time between ticks, as set with setInterval.
	* @static
	**/
	Tick.getInterval = function() {
		return Tick._interval;
	}
	
	/**
	* Returns the frame rate in frames per second (FPS). For example, with an interval of 40, getFPS() will return 25 (1000ms per second divided by 40 ms per tick = 25fps).
	* @static
	**/
	Tick.getFPS = function() {
		return 1000/Tick._interval;
	}
	
	/**
	* While Tick is paused, pausable listeners are not ticked. See addListener for more information.
	* @param value Indicates whether to pause (true) or unpause (false) Tick.
	* @static
	**/
	Tick.setPaused = function(value) {
		Tick._paused = value;
	}
	
	/**
	* Returns a boolean indicating whether Tick is currently paused, as set with setPaused.
	* @static
	**/
	Tick.getPaused = function() {
		return Tick._paused;
	}
	
	/**
	* Returns the number of milliseconds that have elapsed since Tick was loaded. For example, you could use this in a time synchronized animation to determine the exact amount of time that has elapsed.
	* @param pauseable Indicates whether to return the elapsed time for pauseable, or unpauseable listeners. If true, time that elapsed while Tick was paused is not included.
	* @static
	**/
	Tick.getTime = function(pauseable) {
		return Tick._getTime() - Tick._startTime - (pauseable ? Tick._pausedTime : 0);
	}
	
	/**
	* Returns the number of ticks that have elapsed while Tick was active.
	* @param pauseable Indicates whether to return the elapsed ticks for pauseable, or unpauseable listeners.
	* @static
	**/
	Tick.getTicks = function(pauseable) {
		return  Tick._ticks - (pauseable ?Tick._pausedTicks : 0);
	}
	
// private static methods:
	/** @private **/
	Tick._tick = function() {
		Tick._ticks++;
		
		var time = Tick.getTime(false);
		var elapsedTime = time-Tick._lastTime;
		var paused = Tick._paused;
		
		if (paused) {
			Tick._pausedTicks++;
			Tick._pausedTime += elapsedTime;
		}
		Tick._lastTime = time;
		
		var pauseable = Tick._pauseable;
		var listeners = Tick._listeners;
		
		var l = listeners ? listeners.length : 0;
		for (var i=0; i<l; i++) {
			var p = pauseable[i];
			var listener = listeners[i];
			if (listener == null || (paused && p) || listener.tick == null) { continue; }
			listener.tick(elapsedTime);
		}
	}
	
	/** @private **/
	Tick._getTime = function() {
		return new Date().getTime();
	}
	Tick._startTime = Tick._getTime();

window.Tick = Tick;
}(window));