/*
* EventDispatcher
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

/**
 * Provides methods for managing prioritized queues of event listeners and dispatching events. You can either extend
 * this class or mix its methods into an existing prototype or instance by using EventDispatcher.initialize(target).
 * @class EventDispatcher
 * @constructor
 **/
var EventDispatcher = function() {
  this.initialize();
};
var p = EventDispatcher.prototype;


	/**
	 * Static initializer to mix in EventDispatcher methods.
	 * @method initialize
	 * @static
	 * @param {Object} target The target object to inject EventDispatcher methods into. This can be an instance or a prototype.
	 **/
	EventDispatcher.initialize = function(target) {
		target.addEventListener = p.addEventListener;
		target.removeEventListener = p.removeEventListener;
		target.removeAllEventListeners = p.removeAllEventListeners;
		target.hasEventListener = p.hasEventListener;
		target.dispatchEvent = p.dispatchEvent;
	};

	/**
	* Inner class used by the EventDispatcher class.
	 * @protected
	 * @class Listener
	 * @for EventDispatcher
	 * @constructor
	 **/
	function Listener(f, scope, priority) {
		this.f = f;
		this.scope = scope;
		this.priority = priority;
	};

// private properties:
	/**
	 * @protected
	 * @property _listeners
	 * @type Object
	 **/
	p._listeners = null;

// constructor:
	/**
	 * Initialization method.
	 * @method initialize
	 * @protected
	 **/
	p.initialize = function() {};

// public methods:
	/**
	 * Adds the specified event listener.
	 * @method addEventListener
	 * @param {String} type The string type of the event.
	 * @param {Function} callback The function that will be called when this event is dispatched.
	 * @param {Object} scope Optional. The scope/context that the callback will be called in (ie. the "this").
	 * @param {Number} priority Optional. Listeners with a higher priority will be called before those with lower priority. Default is 0.
	 **/
	p.addEventListener = function(type, callback, scope, priority) {
		priority = priority || 0;
		var o = new Listener(callback, scope || this, priority);
		var listeners = this._listeners;
		if (!listeners) { listeners = this._listeners = {}; }
		var arr = listeners[type];
		if (!arr) { arr = listeners[type] = [o]; return; }
		this.removeEventListener(type, callback, scope);
		for (var i=0,l=arr.length; i<l && arr[i].priority >= priority; i++) {}
		arr.splice(i, 0, o);
	};
	
	/**
	 * Removes the specified event listener.
	 * @method removeEventListener
	 * @param {String} type The string type of the event.
	 * @param {Function} callback The listener function.
	 * @param {Object} scope Optional. The listener scope. This must be the same as for addEventListener.
	 **/
	p.removeEventListener = function(type, callback, scope) {
		var listeners = this._listeners;
		if (!listeners) { return; }
		var arr = listeners[type];
		if (!arr) { return; }
		scope = scope || this;
		for (var i=0,l=arr.length; i<l; i++) {
			var o = arr[i];
			if (o.f == callback && o.scope == scope) {
				if (l==1) { delete(listeners[type]); } // allows for faster checks.
				else { arr.splice(i,1); }
				break;
			}
		}
	};
	
	/**
	 * Removes all listeners for the specified type, or all listeners of all types.
	 * @method removeEventListener
	 * @param {String} type The string type of the event. If omitted, all listeners for all types will be removed.
	 **/
	p.removeAllEventListeners = function(type) {
		if (!type) { this._listeners = null; }
		else if (this._listeners) { delete(this._listeners[type]); }
	};
	
	/**
	 * Dispatches the specified event.
	 * @method dispatchEvent
	 * @param {Object | String} eventObj An object with a "type" property, or a string type. If a string is used, dispatchEvent will contstruct a generic event object with "type" and "params" properties.
	 * @param {Function} callback Optional. If specified, dispatchEvent will call the specified function in this scope, with the parameters specified in params.
	 * @param {Array} params Optional. An array of parameters to call the handler with specified by handlerName. This will also be added as a "params" property on the constructed event object if a string is passed to eventObj.
	 * @return {Boolean} Returns true if any listener returned true.
	 **/
	p.dispatchEvent = function(eventObj, callback, params) {
		// NOTE: DisplayObject._tick inlines some of this logic. Update both if this changes.
		callback&&callback.apply(this, params);
		
		var ret = false;
		var listeners = this._listeners;
		if (eventObj && listeners) {
			if (typeof eventObj == "string") { eventObj = {type:eventObj, params:params}; }
			//eventObj.target = this;
			var arr = listeners[eventObj.type];
			if (!arr) { return ret; }
			for (var i=0,l=arr.length; i<l; i++) {
				var o = arr[i];
				o.f.apply(o.scope, [eventObj]);
			}
		}
		return !!ret;
	};
	
	/**
	 * Indicates whether there is at least one listener for the specified event type or a defined callback.
	 * @method hasEventListener
	 * @param {String} type The string type of the event.
	 * @param {Function} callback Optional. The callback function related to this event.
	 * @return {Boolean} Returns true if there is at least one listener for the specified event.
	 **/
	p.hasEventListener = function(type, callback) {
		return !!(callback || (this._listeners && this._listeners[type]));
	};

	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 **/
	p.toString = function() {
		return "[EventDispatcher]";
	};

createjs.EventDispatcher = EventDispatcher;
}());