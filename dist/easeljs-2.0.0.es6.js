/**
 * @license easeljs
 * Visit http://createjs.com for documentation, updates and examples.
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

/*
* @license Event
* Visit http://createjs.com/ for documentation, updates and examples.
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

/**
 * A collection of classes that are shared across the CreateJS libraries.
 * Classes required by a library are compiled with that library.
 *
 * @module CreateJS
 * @main CreateJS
 */

/**
 * Contains properties and methods shared by all events for use with {{#crossLink "EventDispatcher"}}{{/crossLink}}.
 * Note that Event objects are often reused, so you should never
 * rely on an event object's state outside of the call stack it was received in.
 *
 * @class Event
 * @module CreateJS
 */
class Event {

// constructor:
	/**
	 * @param {String} type The event type.
	 * @param {Boolean} [bubbles=false] Indicates whether the event will bubble through the display list.
	 * @param {Boolean} [cancelable=false] Indicates whether the default behaviour of this event can be cancelled.
	 * @constructor
	 */
	constructor (type, bubbles = false, cancelable = false) {
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
		this.timeStamp = new Date().getTime();

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
		this.removed = false;
	}

// public methods:
	/**
	 * Sets {{#crossLink "Event/defaultPrevented"}}{{/crossLink}} to true if the event is cancelable.
	 * Mirrors the DOM level 2 event standard. In general, cancelable events that have `preventDefault()` called will
	 * cancel the default behaviour associated with the event.
	 * @method preventDefault
	 */
	preventDefault () {
		this.defaultPrevented = this.cancelable;
	}

	/**
	 * Sets {{#crossLink "Event/propagationStopped"}}{{/crossLink}} to true.
	 * Mirrors the DOM event standard.
	 * @method stopPropagation
	 */
	stopPropagation () {
		this.propagationStopped = true;
	}

	/**
	 * Sets {{#crossLink "Event/propagationStopped"}}{{/crossLink}} and
	 * {{#crossLink "Event/immediatePropagationStopped"}}{{/crossLink}} to true.
	 * Mirrors the DOM event standard.
	 * @method stopImmediatePropagation
	 */
	stopImmediatePropagation () {
		this.immediatePropagationStopped = this.propagationStopped = true;
	}

	/**
	 * Causes the active listener to be removed via removeEventListener();
	 *
	 * 		myBtn.addEventListener("click", function(evt) {
	 * 			// do stuff...
	 * 			evt.remove(); // removes this listener.
	 * 		});
	 *
	 * @method remove
	 */
	remove () {
		this.removed = true;
	}

	/**
	 * Returns a clone of the Event instance.
	 * @method clone
	 * @return {Event} a clone of the Event instance.
	 */
	clone () {
		let event = new Event(this.type, this.bubbles, this.cancelable);
		for (let n in this) {
			if (this.hasOwnProperty(n)) {
				event[n] = this[n];
			}
		}

		return event;
	}

	/**
	 * Provides a chainable shortcut method for setting a number of properties on the instance.
	 *
	 * @method set
	 * @param {Object} props A generic object containing properties to copy to the instance.
	 * @return {Event} Returns the instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
	set (props) {
		for (let n in props) { this[n] = props[n]; }
		return this;
	}

	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 */
	toString () {
		return `[${this.constructor.name} (type=${this.type})]`;
	}

}

/*
* @license EventDispatcher
* Visit http://createjs.com/ for documentation, updates and examples.
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
 * @module CreateJS
 */
class EventDispatcher {

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
	static initialize (target) {
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

// constructor:
	/**
	 * @constructor
	 */
	constructor () {
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
		this._captureListeners = null;
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
	addEventListener (type, listener, useCapture) {
		let listeners;
		if (useCapture) {
			listeners = this._captureListeners = this._captureListeners||{};
		} else {
			listeners = this._listeners = this._listeners||{};
		}
		let arr = listeners[type];
		if (arr) { this.removeEventListener(type, listener, useCapture); }
		arr = listeners[type]; // remove may have deleted the array
		if (!arr) { listeners[type] = [listener];  }
		else { arr.push(listener); }
		return listener;
	}

	/**
	 * A shortcut method for using addEventListener that makes it easier to specify an execution scope, have a listener
	 * only run once, associate arbitrary data with the listener, and remove the listener.
	 *
	 * This method works by creating an anonymous wrapper function and subscribing it with addEventListener.
	 * The wrapper function is returned for use with `removeEventListener` (or `off`).
	 *
	 * <b>IMPORTANT:</b> To remove a listener added with `on`, you must pass in the returned wrapper function as the listener, or use
	 * {{#crossLink "Event/remove"}}{{/crossLink}}. Likewise, each time you call `on` a NEW wrapper function is subscribed, so multiple calls
	 * to `on` with the same params will create multiple listeners.
	 *
	 * <h4>Example</h4>
	 *
	 * 		var listener = myBtn.on("click", handleClick, null, false, {count:3});
	 * 		function handleClick(evt, data) {
	 * 			data.count -= 1;
	 * 			console.log(this == myBtn); // true - scope defaults to the dispatcher
	 * 			if (data.count == 0) {
	 * 				alert("clicked 3 times!");
	 * 				myBtn.off("click", listener);
	 * 				// alternately: evt.remove();
	 * 			}
	 * 		}
	 *
	 * @method on
	 * @param {String} type The string type of the event.
	 * @param {Function | Object} listener An object with a handleEvent method, or a function that will be called when
	 * the event is dispatched.
	 * @param {Object} [scope] The scope to execute the listener in. Defaults to the dispatcher/currentTarget for function listeners, and to the listener itself for object listeners (ie. using handleEvent).
	 * @param {Boolean} [once=false] If true, the listener will remove itself after the first time it is triggered.
	 * @param {*} [data] Arbitrary data that will be included as the second parameter when the listener is called.
	 * @param {Boolean} [useCapture=false] For events that bubble, indicates whether to listen for the event in the capture or bubbling/target phase.
	 * @return {Function} Returns the anonymous function that was created and assigned as the listener. This is needed to remove the listener later using .removeEventListener.
	 */
	on (type, listener, scope = null, once = false, data = {}, useCapture = false) {
		if (listener.handleEvent) {
			scope = scope||listener;
			listener = listener.handleEvent;
		}
		scope = scope||this;
		return this.addEventListener(type, function(evt) {
			listener.call(scope, evt, data);
			once&&evt.remove();
		}, useCapture);
	}

	/**
	 * Removes the specified event listener.
	 *
	 * <b>Important Note:</b> that you must pass the exact function reference used when the event was added. If a proxy
	 * function, or function closure is used as the callback, the proxy/closure reference must be used - a new proxy or
	 * closure will not work.
	 *
	 * <h4>Example</h4>
	 *
	 *      displayObject.removeEventListener("click", handleClick);
	 *
	 * @method removeEventListener
	 * @param {String} type The string type of the event.
	 * @param {Function | Object} listener The listener function or object.
	 * @param {Boolean} [useCapture] For events that bubble, indicates whether to listen for the event in the capture or bubbling/target phase.
	 */
	removeEventListener (type, listener, useCapture) {
		const listeners = useCapture ? this._captureListeners : this._listeners;
		if (!listeners) { return; }
		const arr = listeners[type];
		if (!arr) { return; }
		const l = arr.length;
		for (let i=0; i<l; i++) {
			if (arr[i] == listener) {
				if (l==1) { delete(listeners[type]); } // allows for faster checks.
				else { arr.splice(i,1); }
				break;
			}
		}
	}

	/**
	 * A shortcut to the removeEventListener method, with the same parameters and return value. This is a companion to the
	 * .on method.
	 *
	 * <b>IMPORTANT:</b> To remove a listener added with `on`, you must pass in the returned wrapper function as the listener. See
	 * {{#crossLink "EventDispatcher/on"}}{{/crossLink}} for an example.
	 *
	 * @method off
	 * @param {String} type The string type of the event.
	 * @param {Function | Object} listener The listener function or object.
	 * @param {Boolean} [useCapture] For events that bubble, indicates whether to listen for the event in the capture or bubbling/target phase.
	 */
	off (type, listener, useCapture) {
		this.removeEventListener(type, listener, useCapture);
	}

	/**
	 * Removes all listeners for the specified type, or all listeners of all types.
	 *
	 * <h4>Example</h4>
	 *
	 *      // Remove all listeners
	 *      displayObject.removeAllEventListeners();
	 *
	 *      // Remove all click listeners
	 *      displayObject.removeAllEventListeners("click");
	 *
	 * @method removeAllEventListeners
	 * @param {String} [type] The string type of the event. If omitted, all listeners for all types will be removed.
	 */
	removeAllEventListeners (type) {
		if (!type) { this._listeners = this._captureListeners = null; }
		else {
			if (this._listeners) { delete(this._listeners[type]); }
			if (this._captureListeners) { delete(this._captureListeners[type]); }
		}
	}

	/**
	 * Dispatches the specified event to all listeners.
	 *
	 * <h4>Example</h4>
	 *
	 *      // Use a string event
	 *      this.dispatchEvent("complete");
	 *
	 *      // Use an Event instance
	 *      var event = new createjs.Event("progress");
	 *      this.dispatchEvent(event);
	 *
	 * @method dispatchEvent
	 * @param {Object | String | Event} eventObj An object with a "type" property, or a string type.
	 * While a generic object will work, it is recommended to use a CreateJS Event instance. If a string is used,
	 * dispatchEvent will construct an Event instance if necessary with the specified type. This latter approach can
	 * be used to avoid event object instantiation for non-bubbling events that may not have any listeners.
	 * @param {Boolean} [bubbles] Specifies the `bubbles` value when a string was passed to eventObj.
	 * @param {Boolean} [cancelable] Specifies the `cancelable` value when a string was passed to eventObj.
	 * @return {Boolean} Returns false if `preventDefault()` was called on a cancelable event, true otherwise.
	 */
	dispatchEvent (eventObj, bubbles = false, cancelable = false) {
		if (typeof eventObj == "string") {
			// skip everything if there's no listeners and it doesn't bubble:
			const listeners = this._listeners;
			if (!bubbles && (!listeners || !listeners[eventObj])) { return true; }
			eventObj = new Event(eventObj, bubbles, cancelable);
		} else if (eventObj.target && eventObj.clone) {
			// redispatching an active event object, so clone it:
			eventObj = eventObj.clone();
		}

		// TODO: it would be nice to eliminate this. Maybe in favour of evtObj instanceof Event? Or !!evtObj.createEvent
		try { eventObj.target = this; } catch (e) {} // try/catch allows redispatching of native events

		if (!eventObj.bubbles || !this.parent) {
			this._dispatchEvent(eventObj, 2);
		} else {
			let top = this, i;
			const list = [top];
			while (top.parent) { list.push(top = top.parent); }
			const l = list.length;

			// capture & atTarget
			for (i=l-1; i>=0 && !eventObj.propagationStopped; i--) {
				list[i]._dispatchEvent(eventObj, 1+(i==0));
			}
			// bubbling
			for (i=1; i<l && !eventObj.propagationStopped; i++) {
				list[i]._dispatchEvent(eventObj, 3);
			}
		}
		return !eventObj.defaultPrevented;
	}

	/**
	 * Indicates whether there is at least one listener for the specified event type.
	 * @method hasEventListener
	 * @param {String} type The string type of the event.
	 * @return {Boolean} Returns true if there is at least one listener for the specified event.
	 */
	hasEventListener (type) {
		const listeners = this._listeners, captureListeners = this._captureListeners;
		return !!((listeners && listeners[type]) || (captureListeners && captureListeners[type]));
	}

	/**
	 * Indicates whether there is at least one listener for the specified event type on this object or any of its
	 * ancestors (parent, parent's parent, etc). A return value of true indicates that if a bubbling event of the
	 * specified type is dispatched from this object, it will trigger at least one listener.
	 *
	 * This is similar to {{#crossLink "EventDispatcher/hasEventListener"}}{{/crossLink}}, but it searches the entire
	 * event flow for a listener, not just this object.
	 * @method willTrigger
	 * @param {String} type The string type of the event.
	 * @return {Boolean} Returns `true` if there is at least one listener for the specified event.
	 */
	willTrigger (type) {
		let o = this;
		while (o) {
			if (o.hasEventListener(type)) { return true; }
			o = o.parent;
		}
		return false;
	}

	/**
	 * @method toString
	 * @return {String} a string representation of the instance.
	 */
	toString () {
		return "[EventDispatcher]";
	}

	// private methods:
	/**
	 * @method _dispatchEvent
	 * @param {Object | String | Event} eventObj
	 * @param {Object} eventPhase
	 * @protected
	 */
	_dispatchEvent (eventObj, eventPhase) {
		const listeners = (eventPhase==1) ? this._captureListeners : this._listeners;
		let l;
		if (eventObj && listeners) {
			let arr = listeners[eventObj.type];
			if (!arr||!(l=arr.length)) { return; }
			try { eventObj.currentTarget = this; } catch (e) {}
			try { eventObj.eventPhase = eventPhase; } catch (e) {}
			eventObj.removed = false;

			arr = arr.slice(); // to avoid issues with items being removed or added during the dispatch
			for (let i=0; i<l && !eventObj.immediatePropagationStopped; i++) {
				let o = arr[i];
				if (o.handleEvent) { o.handleEvent(eventObj); }
				else { o(eventObj); }
				if (eventObj.removed) {
					this.off(eventObj.type, o, eventPhase==1);
					eventObj.removed = false;
				}
			}
		}
	}

}

/*
* @license Ticker
* Visit http://createjs.com/ for documentation, updates and examples.
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

/**
 * The Ticker provides a centralized tick or heartbeat broadcast at a set interval. Listeners can subscribe to the tick
 * event to be notified when a set time interval has elapsed.
 *
 * Note that the interval that the tick event is called is a target interval, and may be broadcast at a slower interval
 * when under high CPU load. The Ticker class uses a static interface (ex. `Ticker.framerate = 30;`) and
 * can not be instantiated.
 *
 * <h4>Example</h4>
 *
 *      createjs.Ticker.addEventListener("tick", handleTick);
 *      function handleTick(event) {
 *          // Actions carried out each tick (aka frame)
 *          if (!event.paused) {
 *              // Actions carried out when the Ticker is not paused.
 *          }
 *      }
 *
 * @class TickerAPI
 * @extends EventDispatcher
 * @module CreateJS
 */
class TickerAPI extends EventDispatcher {

// constructor:
	/**
	 * @param name {String} The name assigned to this instance.
	 * @constructor
	 * TODO-ES6: Pass timingMode, maxDelta, paused values as instantiation arguments?
	 */
	constructor (name) {
		super();

// public properties:
		/**
		 * The name of this instance.
		 * @property name
		 * @type {String}
		 */
		this.name = name;
		/**
		 * Specifies the timing api (setTimeout or requestAnimationFrame) and mode to use. See
		 * {{#crossLink "Ticker/TIMEOUT"}}{{/crossLink}}, {{#crossLink "Ticker/RAF"}}{{/crossLink}}, and
		 * {{#crossLink "Ticker/RAF_SYNCHED"}}{{/crossLink}} for mode details.
		 * @property timingMode
		 * @type {String}
		 * @default Ticker.TIMEOUT
		 */
		this.timingMode = TickerAPI.TIMEOUT;

		/**
		 * Specifies a maximum value for the delta property in the tick event object. This is useful when building time
		 * based animations and systems to prevent issues caused by large time gaps caused by background tabs, system sleep,
		 * alert dialogs, or other blocking routines. Double the expected frame duration is often an effective value
		 * (ex. maxDelta=50 when running at 40fps).
		 *
		 * This does not impact any other values (ex. time, runTime, etc), so you may experience issues if you enable maxDelta
		 * when using both delta and other values.
		 *
		 * If 0, there is no maximum.
		 * @property maxDelta
		 * @type {number}
		 * @default 0
		 */
		this.maxDelta = 0;

		/**
		 * When the ticker is paused, all listeners will still receive a tick event, but the <code>paused</code> property
		 * of the event will be `true`. Also, while paused the `runTime` will not increase. See {{#crossLink "Ticker/tick:event"}}{{/crossLink}},
		 * {{#crossLink "Ticker/getTime"}}{{/crossLink}}, and {{#crossLink "Ticker/getEventTime"}}{{/crossLink}} for more
		 * info.
		 *
		 * <h4>Example</h4>
		 *
		 *      createjs.Ticker.addEventListener("tick", handleTick);
		 *      createjs.Ticker.paused = true;
		 *      function handleTick(event) {
		 *          console.log(event.paused,
		 *          	createjs.Ticker.getTime(false),
		 *          	createjs.Ticker.getTime(true));
		 *      }
		 *
		 * @property paused
		 * @type {Boolean}
		 * @default false
		 */
		this.paused = false;

// private properties:
		/**
		 * @property _inited
		 * @type {Boolean}
		 * @protected
		 */
		this._inited = false;

		/**
		 * @property _startTime
		 * @type {Number}
		 * @protected
		 */
		this._startTime = 0;

		/**
		 * @property _pausedTime
		 * @type {Number}
		 * @protected
		 */
		this._pausedTime = 0;

		/**
		 * The number of ticks that have passed
		 * @property _ticks
		 * @type {Number}
		 * @protected
		 */
		this._ticks = 0;

		/**
		 * The number of ticks that have passed while Ticker has been paused
		 * @property _pausedTicks
		 * @type {Number}
		 * @protected
		 */
		this._pausedTicks = 0;

		/**
		 * @property _interval
		 * @type {Number}
		 * @protected
		 */
		this._interval = 50;

		/**
		 * @property _lastTime
		 * @type {Number}
		 * @protected
		 */
		this._lastTime = 0;

		/**
		 * @property _times
		 * @type {Array}
		 * @protected
		 */
		this._times = null;

		/**
		 * @property _tickTimes
		 * @type {Array}
		 * @protected
		 */
		this._tickTimes = null;

		/**
		 * Stores the timeout or requestAnimationFrame id.
		 * @property _timerId
		 * @type {Number}
		 * @protected
		 */
		this._timerId = null;

		/**
		 * True if currently using requestAnimationFrame, false if using setTimeout. This may be different than timingMode
		 * if that property changed and a tick hasn't fired.
		 * @property _raf
		 * @type {Boolean}
		 * @protected
		 */
		this._raf = true;
	}

// accessor properties:
	/**
	 * Indicates the target time (in milliseconds) between ticks. Default is 50 (20 FPS).
	 * Note that actual time between ticks may be more than specified depending on CPU load.
	 * This property is ignored if the ticker is using the `RAF` timing mode.
	 * @property interval
	 * @static
	 * @type {Number}
	 */
	get interval () {
		return this._interval;
	}

	set interval (interval) {
		this._interval = interval;
		if (!this._inited) { return; }
		this._setupTick();
	}

	/**
	 * Indicates the target frame rate in frames per second (FPS). Effectively just a shortcut to `interval`, where
	 * `framerate == 1000/interval`.
	 * @property framerate
	 * @static
	 * @type {Number}
	 */
	get framerate () {
		return 1000/this._interval;
	}

	set framerate (fps) {
		this.interval = 1000/fps;
	}

// public methods:
	/**
	 * Call createjs.Ticker.create() to get a new TickerAPI instance.
	 * It is not initalized by default and its ticks are not synched with any other instance.
	 *
	 * @param name {String} The name given to the new instance.
	 * @method create
	 * @return {TickerAPI} A new TickerAPI instance.
	 */
	create (name) {
		return new TickerAPI(name);
	}

	/**
	 * Starts the tick. This is called automatically when the first listener is added.
	 * @method init
	 */
	init () {
		if (this._inited) { return; }
		this._inited = true;
		this._times = [];
		this._tickTimes = [];
		this._startTime = this._getTime();
		this._times.push(this._lastTime = 0);
		this._setupTick();
	}

	/**
	 * Stops the Ticker and removes all listeners. Use init() to restart the Ticker.
	 * @method reset
	 */
	reset () {
		if (this._raf) {
			let f = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame;
			f&&f(this._timerId);
		} else {
			clearTimeout(this._timerId);
		}
		this.removeAllEventListeners("tick");
		this._timerId = this._times = this._tickTimes = null;
		this._startTime = this._lastTime = this._ticks = 0;
		this._inited = false;
	}

	/**
	 * Init the Ticker instance if it hasn't been already.
	 * Docced in superclass.
	 */
	addEventListener (type, listener, useCapture) {
		!this._inited && this.init();
		return super.addEventListener(type, listener, useCapture);
	}

	/**
	 * Returns the average time spent within a tick. This can vary significantly from the value provided by getMeasuredFPS
	 * because it only measures the time spent within the tick execution stack.
	 *
	 * Example 1: With a target FPS of 20, getMeasuredFPS() returns 20fps, which indicates an average of 50ms between
	 * the end of one tick and the end of the next. However, getMeasuredTickTime() returns 15ms. This indicates that
	 * there may be up to 35ms of "idle" time between the end of one tick and the start of the next.
	 *
	 * Example 2: With a target FPS of 30, getFPS() returns 10fps, which indicates an average of 100ms between the end of
	 * one tick and the end of the next. However, getMeasuredTickTime() returns 20ms. This would indicate that something
	 * other than the tick is using ~80ms (another script, DOM rendering, etc).
	 * @method getMeasuredTickTime
	 * @param {Number} [ticks] The number of previous ticks over which to measure the average time spent in a tick.
	 * Defaults to the number of ticks per second. To get only the last tick's time, pass in 1.
	 * @return {Number} The average time spent in a tick in milliseconds.
	 */
	getMeasuredTickTime (ticks) {
		let times=this._tickTimes;
		if (!times || times.length < 1) { return -1; }

		// by default, calculate average for the past ~1 second:
		ticks = Math.min(times.length, ticks||(this.framerate|0));
		let ttl = times.reduce((a, b) => a + b, 0);
		return ttl/ticks;
	}

	/**
	 * Returns the actual frames / ticks per second.
	 * @method getMeasuredFPS
	 * @param {Number} [ticks] The number of previous ticks over which to measure the actual frames / ticks per second.
	 * Defaults to the number of ticks per second.
	 * @return {Number} The actual frames / ticks per second. Depending on performance, this may differ
	 * from the target frames per second.
	 */
	getMeasuredFPS (ticks) {
		let times = this._times;
		if (!times || times.length < 2) { return -1; }

		// by default, calculate fps for the past ~1 second:
		ticks = Math.min(times.length-1, ticks||(this.framerate|0));
		return 1000/((times[0]-times[ticks])/ticks);
	}

	/**
	 * Returns the number of milliseconds that have elapsed since Ticker was initialized via {{#crossLink "Ticker/init"}}.
	 * Returns -1 if Ticker has not been initialized. For example, you could use
	 * this in a time synchronized animation to determine the exact amount of time that has elapsed.
	 * @method getTime
	 * @param {Boolean} [runTime=false] If true only time elapsed while Ticker was not paused will be returned.
	 * If false, the value returned will be total time elapsed since the first tick event listener was added.
	 * @return {Number} Number of milliseconds that have elapsed since Ticker was initialized or -1.
	 */
	getTime (runTime = false) {
		return this._startTime ? this._getTime() - (runTime ? this._pausedTime : 0) : -1;
	}

	/**
	 * Similar to the {{#crossLink "Ticker/getTime"}}{{/crossLink}} method, but returns the time on the most recent {{#crossLink "Ticker/tick:event"}}{{/crossLink}}
	 * event object.
	 * @method getEventTime
	 * @param runTime {Boolean} [runTime=false] If true, the runTime property will be returned instead of time.
	 * @returns {number} The time or runTime property from the most recent tick event or -1.
	 */
	getEventTime (runTime = false) {
		return this._startTime ? (this._lastTime || this._startTime) - (runTime ? this._pausedTime : 0) : -1;
	}

	/**
	 * Returns the number of ticks that have been broadcast by Ticker.
	 * @method getTicks
	 * @param {Boolean} [pauseable=false] Indicates whether to include ticks that would have been broadcast
	 * while Ticker was paused. If true only tick events broadcast while Ticker is not paused will be returned.
	 * If false, tick events that would have been broadcast while Ticker was paused will be included in the return
	 * value.
	 * @return {Number} of ticks that have been broadcast.
	 */
	getTicks (pauseable = false) {
		return this._ticks - (pauseable ? this._pausedTicks : 0);
	}


// private methods:
	/**
	 * @method _handleSynch
	 * @protected
	 */
	_handleSynch () {
		this._timerId = null;
		this._setupTick();

		// run if enough time has elapsed, with a little bit of flexibility to be early:
		if (this._getTime() - this._lastTime >= (this._interval-1)*0.97) {
			this._tick();
		}
	}

	/**
	 * @method _handleRAF
	 * @protected
	 */
	_handleRAF () {
		this._timerId = null;
		this._setupTick();
		this._tick();
	}

	/**
	 * @method _handleTimeout
	 * @protected
	 */
	_handleTimeout () {
		this._timerId = null;
		this._setupTick();
		this._tick();
	}

	/**
	 * @method _setupTick
	 * @protected
	 */
	_setupTick () {
		if (this._timerId != null) { return; } // avoid duplicates

		let mode = this.timingMode || (this._raf && TickerAPI.RAF); // TODO-ES6: Verify that this is desired, since Ticker.useRAF was removed.
		if (mode == TickerAPI.RAF_SYNCHED || mode == TickerAPI.RAF) {
			let f = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame;
			if (f) {
				this._timerId = f(mode == TickerAPI.RAF ? this._handleRAF.bind(this) : this._handleSynch.bind(this));
				this._raf = true;
				return;
			}
		}
		this._raf = false;
		this._timerId = setTimeout(this._handleTimeout.bind(this), this._interval);
	}

	/**
	 * @method _tick
	 * @protected
	 */
	_tick () {
		let paused = this.paused;
		let time = this._getTime();
		let elapsedTime = time-this._lastTime;
		this._lastTime = time;
		this._ticks++;

		if (paused) {
			this._pausedTicks++;
			this._pausedTime += elapsedTime;
		}

		if (this.hasEventListener("tick")) {
			let event = new Event("tick");
			let maxDelta = this.maxDelta;
			event.delta = (maxDelta && elapsedTime > maxDelta) ? maxDelta : elapsedTime;
			event.paused = paused;
			event.time = time;
			event.runTime = time-this._pausedTime;
			this.dispatchEvent(event);
		}

		this._tickTimes.unshift(this._getTime()-time);
		while (this._tickTimes.length > 100) { this._tickTimes.pop(); }

		this._times.unshift(time);
		while (this._times.length > 100) { this._times.pop(); }
	}

	/**
	 * @method _getTime
	 * @protected
	 */
	_getTime () {
		let now = window.performance.now;
		return ((now&&now.call(performance))||(new Date().getTime())) - this._startTime;
	}

}

// constants:
/**
 * In this mode, Ticker uses the requestAnimationFrame API, but attempts to synch the ticks to target framerate. It
 * uses a simple heuristic that compares the time of the RAF return to the target time for the current frame and
 * dispatches the tick when the time is within a certain threshold.
 *
 * This mode has a higher variance for time between frames than {{#crossLink "Ticker/TIMEOUT:property"}}{{/crossLink}},
 * but does not require that content be time based as with {{#crossLink "Ticker/RAF:property"}}{{/crossLink}} while
 * gaining the benefits of that API (screen synch, background throttling).
 *
 * Variance is usually lowest for framerates that are a divisor of the RAF frequency. This is usually 60, so
 * framerates of 10, 12, 15, 20, and 30 work well.
 *
 * Falls back to {{#crossLink "Ticker/TIMEOUT:property"}}{{/crossLink}} if the requestAnimationFrame API is not
 * supported.
 * @property RAF_SYNCHED
 * @static
 * @type {String}
 * @default "synched"
 * @readonly
 */
TickerAPI.RAF_SYNCHED = "synched";

/**
 * In this mode, Ticker passes through the requestAnimationFrame heartbeat, ignoring the target framerate completely.
 * Because requestAnimationFrame frequency is not deterministic, any content using this mode should be time based.
 * You can leverage {{#crossLink "Ticker/getTime"}}{{/crossLink}} and the {{#crossLink "Ticker/tick:event"}}{{/crossLink}}
 * event object's "delta" properties to make this easier.
 *
 * Falls back on {{#crossLink "Ticker/TIMEOUT:property"}}{{/crossLink}} if the requestAnimationFrame API is not
 * supported.
 * @property RAF
 * @static
 * @type {String}
 * @default "raf"
 * @readonly
 */
TickerAPI.RAF = "raf";

/**
 * In this mode, Ticker uses the setTimeout API. This provides predictable, adaptive frame timing, but does not
 * provide the benefits of requestAnimationFrame (screen synch, background throttling).
 * @property TIMEOUT
 * @static
 * @type {String}
 * @default "timeout"
 * @readonly
 */
TickerAPI.TIMEOUT = "timeout";

// events:
/**
 * Dispatched each tick. The event will be dispatched to each listener even when the Ticker has been paused using
 * {{#crossLink "Ticker/setPaused"}}{{/crossLink}}.
 *
 * <h4>Example</h4>
 *
 *      createjs.Ticker.addEventListener("tick", handleTick);
 *      function handleTick(event) {
 *          console.log("Paused:", event.paused, event.delta);
 *      }
 *
 * @event tick
 * @param {Object} target The object that dispatched the event.
 * @param {String} type The event type.
 * @param {Boolean} paused Indicates whether the ticker is currently paused.
 * @param {Number} delta The time elapsed in ms since the last tick.
 * @param {Number} time The total time in ms since Ticker was initialized.
 * @param {Number} runTime The total time in ms that Ticker was not paused since it was initialized. For example,
 * 	you could determine the amount of time that the Ticker has been paused since initialization with `time-runTime`.
 * @since 0.6.0
 */

/**
 * The Ticker object is a singleton instance of the TickerAPI class.
 * See the {{#crossLink "TickerAPI"}}{{/crossLink}} documentation for its usage.
 * @class Ticker
 * @static
 * @module CreateJS
 */
const Ticker = new TickerAPI("createjs.global");

/*
* @license UID
* Visit http://createjs.com/ for documentation, updates and examples.
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

let _nextID = 0;

/**
 * Global utility for generating sequential unique ID numbers. The UID class uses a static interface (ex. <code>UID.get()</code>)
 * and should not be instantiated.
 * @class UID
 * @static
 * @module EaselJS
 */
class UID {

// constructor:
	/**
	 * @constructor
	 */
	constructor () {
		throw "UID cannot be instantiated";
	}

// private static properties:
	/**
	 * @property _nextID
	 * @type Number
	 * @protected
	 */
	static get _nextID () { return _nextID; }
	static set _nextID (nextID) { _nextID = nextID; }

// public static methods:
	/**
	 * Returns the next unique id.
	 * @method get
	 * @return {Number} The next unique id
	 * @static
	 */
	static get () {
		return UID._nextID++;
	}

}

/*
* @license Point
* Visit http://createjs.com/ for documentation, updates and examples.
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

/**
 * @module EaselJS
 */

/**
 * Represents a point on a 2 dimensional x / y coordinate system.
 *
 * <h4>Example</h4>
 *
 *      var point = new createjs.Point(0, 100);
 *
 * @class Point
 */
class Point {

// constructor:
	/**
	 * @constructor
	 * @param {Number} [x=0] X position.
	 * @param {Number} [y=0] Y position.
	 * @constructor
	 */
	constructor (x = 0, y = 0) {
		this.setValues(x, y);

// public properties:
		// assigned in the setValues method.
		/**
		 * X position.
		 * @property x
		 * @type Number
		 */

		/**
		 * Y position.
		 * @property y
		 * @type Number
		 */
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
	setValues (x = 0, y = 0) {
		this.x = x;
		this.y = y;
		return this;
	}

	/**
	 * Copies all properties from the specified point to this point.
	 * @method copy
	 * @param {Point} point The point to copy properties from.
	 * @return {Point} This point. Useful for chaining method calls.
	 * @chainable
	*/
	copy (point) {
		this.x = point.x;
		this.y = point.y;
		return this;
	}

	/**
	 * Returns a clone of the Point instance.
	 * @method clone
	 * @return {Point} a clone of the Point instance.
	 */
	clone () {
		return new Point(this.x, this.y);
	}

	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 */
	toString () {
		return `[${this.constructor.name} (x=${this.x} y=${this.y})]`;
	}

}

/*
* @license Matrix2D
* Visit http://createjs.com/ for documentation, updates and examples.
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

/**
 * @module EaselJS
 */

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
class Matrix2D {

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
	constructor (a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0) {
		this.setValues(a,b,c,d,tx,ty);

// public properties:
		// assigned in the setValues method.
		/**
		 * Position (0, 0) in a 3x3 affine transformation matrix.
		 * @property a
		 * @type Number
		 */

		/**
		 * Position (0, 1) in a 3x3 affine transformation matrix.
		 * @property b
		 * @type Number
		 */

		/**
		 * Position (1, 0) in a 3x3 affine transformation matrix.
		 * @property c
		 * @type Number
		 */

		/**
		 * Position (1, 1) in a 3x3 affine transformation matrix.
		 * @property d
		 * @type Number
		 */

		/**
		 * Position (2, 0) in a 3x3 affine transformation matrix.
		 * @property tx
		 * @type Number
		 */

		/**
		 * Position (2, 1) in a 3x3 affine transformation matrix.
		 * @property ty
		 * @type Number
		 */
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
	setValues (a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0) {
		// don't forget to update docs in the constructor if these change:
		this.a = a;
		this.b = b;
		this.c = c;
		this.d = d;
		this.tx = tx;
		this.ty = ty;
		return this;
	}

	/**
	 * Appends the specified matrix properties to this matrix. All parameters are required.
	 * This is the equivalent of multiplying `(this matrix) * (specified matrix)`.
	 * @method append
	 * @param {Number} a
	 * @param {Number} b
	 * @param {Number} c
	 * @param {Number} d
	 * @param {Number} tx
	 * @param {Number} ty
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 */
	append (a, b, c, d, tx, ty) {
		let a1 = this.a;
		let b1 = this.b;
		let c1 = this.c;
		let d1 = this.d;
		if (a != 1 || b != 0 || c != 0 || d != 1) {
			this.a  = a1*a+c1*b;
			this.b  = b1*a+d1*b;
			this.c  = a1*c+c1*d;
			this.d  = b1*c+d1*d;
		}
		this.tx = a1*tx+c1*ty+this.tx;
		this.ty = b1*tx+d1*ty+this.ty;
		return this;
	};

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
	prepend (a, b, c, d, tx, ty) {
		let a1 = this.a;
		let c1 = this.c;
		let tx1 = this.tx;

		this.a  = a*a1+c*this.b;
		this.b  = b*a1+d*this.b;
		this.c  = a*c1+c*this.d;
		this.d  = b*c1+d*this.d;
		this.tx = a*tx1+c*this.ty+tx;
		this.ty = b*tx1+d*this.ty+ty;
		return this;
	}

	/**
	 * Appends the specified matrix to this matrix.
	 * This is the equivalent of multiplying `(this matrix) * (specified matrix)`.
	 * @method appendMatrix
	 * @param {Matrix2D} matrix
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 */
	appendMatrix (matrix) {
		return this.append(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
	}

	/**
	 * Prepends the specified matrix to this matrix.
	 * This is the equivalent of multiplying `(specified matrix) * (this matrix)`.
	 * For example, you could calculate the combined transformation for a child object using:
	 *
	 * 	var o = myDisplayObject;
	 * 	var mtx = o.getMatrix();
	 * 	while (o = o.parent) {
	 * 		// prepend each parent's transformation in turn:
	 * 		o.prependMatrix(o.getMatrix());
	 * 	}
	 * @method prependMatrix
	 * @param {Matrix2D} matrix
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 */
	prependMatrix (matrix) {
		return this.prepend(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
	}

	/**
	 * Generates matrix properties from the specified display object transform properties, and appends them to this matrix.
	 * For example, you can use this to generate a matrix representing the transformations of a display object:
	 *
	 * 	var mtx = new createjs.Matrix2D();
	 * 	mtx.appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation);
	 * @method appendTransform
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} scaleX
	 * @param {Number} scaleY
	 * @param {Number} rotation
	 * @param {Number} skewX
	 * @param {Number} skewY
	 * @param {Number} regX Optional.
	 * @param {Number} regY Optional.
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 */
	appendTransform (x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
		let r, cos, sin;
		if (rotation%360) {
			r = rotation*Matrix2D.DEG_TO_RAD;
			cos = Math.cos(r);
			sin = Math.sin(r);
		} else {
			cos = 1;
			sin = 0;
		}

		if (skewX || skewY) {
			// TODO: can this be combined into a single append operation?
			skewX *= Matrix2D.DEG_TO_RAD;
			skewY *= Matrix2D.DEG_TO_RAD;
			this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
			this.append(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, 0, 0);
		} else {
			this.append(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, x, y);
		}

		if (regX || regY) {
			// append the registration offset:
			this.tx -= regX*this.a+regY*this.c;
			this.ty -= regX*this.b+regY*this.d;
		}
		return this;
	}

	/**
	 * Generates matrix properties from the specified display object transform properties, and prepends them to this matrix.
	 * For example, you could calculate the combined transformation for a child object using:
	 *
	 * 	var o = myDisplayObject;
	 * 	var mtx = new createjs.Matrix2D();
	 * 	do  {
	 * 		// prepend each parent's transformation in turn:
	 * 		mtx.prependTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY);
	 * 	} while (o = o.parent);
	 *
	 * 	Note that the above example would not account for {{#crossLink "DisplayObject/transformMatrix:property"}}{{/crossLink}}
	 * 	values. See {{#crossLink "Matrix2D/prependMatrix"}}{{/crossLink}} for an example that does.
	 * @method prependTransform
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} scaleX
	 * @param {Number} scaleY
	 * @param {Number} rotation
	 * @param {Number} skewX
	 * @param {Number} skewY
	 * @param {Number} regX Optional.
	 * @param {Number} regY Optional.
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 */
	prependTransform (x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
		let r, cos, sin;
		if (rotation%360) {
			r = rotation*Matrix2D.DEG_TO_RAD;
			cos = Math.cos(r);
			sin = Math.sin(r);
		} else {
			cos = 1;
			sin = 0;
		}

		if (regX || regY) {
			// prepend the registration offset:
			this.tx -= regX; this.ty -= regY;
		}
		if (skewX || skewY) {
			// TODO: can this be combined into a single prepend operation?
			skewX *= Matrix2D.DEG_TO_RAD;
			skewY *= Matrix2D.DEG_TO_RAD;
			this.prepend(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, 0, 0);
			this.prepend(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
		} else {
			this.prepend(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, x, y);
		}
		return this;
	}

	/**
	 * Applies a clockwise rotation transformation to the matrix.
	 * @method rotate
	 * @param {Number} angle The angle to rotate by, in degrees. To use a value in radians, multiply it by `180/Math.PI`.
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 */
	rotate (angle) {
		angle *= Matrix2D.DEG_TO_RAD;
		let cos = Math.cos(angle);
		let sin = Math.sin(angle);

		let a1 = this.a;
		let b1 = this.b;

		this.a = a1*cos+this.c*sin;
		this.b = b1*cos+this.d*sin;
		this.c = -a1*sin+this.c*cos;
		this.d = -b1*sin+this.d*cos;
		return this;
	}

	/**
	 * Applies a skew transformation to the matrix.
	 * @method skew
	 * @param {Number} skewX The amount to skew horizontally in degrees. To use a value in radians, multiply it by `180/Math.PI`.
	 * @param {Number} skewY The amount to skew vertically in degrees.
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	*/
	skew (skewX, skewY) {
		skewX *= Matrix2D.DEG_TO_RAD;
		skewY *= Matrix2D.DEG_TO_RAD;
		this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), 0, 0);
		return this;
	}

	/**
	 * Applies a scale transformation to the matrix.
	 * @method scale
	 * @param {Number} x The amount to scale horizontally. E.G. a value of 2 will double the size in the X direction, and 0.5 will halve it.
	 * @param {Number} y The amount to scale vertically.
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 */
	scale (x, y) {
		this.a *= x;
		this.b *= x;
		this.c *= y;
		this.d *= y;
		//this.tx *= x;
		//this.ty *= y;
		return this;
	}

	/**
	 * Translates the matrix on the x and y axes.
	 * @method translate
	 * @param {Number} x
	 * @param {Number} y
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 */
	translate (x, y) {
		this.tx += this.a*x + this.c*y;
		this.ty += this.b*x + this.d*y;
		return this;
	}

	/**
	 * Sets the properties of the matrix to those of an identity matrix (one that applies a null transformation).
	 * @method identity
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 */
	identity () {
		this.a = this.d = 1;
		this.b = this.c = this.tx = this.ty = 0;
		return this;
	}

	/**
	 * Inverts the matrix, causing it to perform the opposite transformation.
	 * @method invert
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 */
	invert () {
		let a1 = this.a;
		let b1 = this.b;
		let c1 = this.c;
		let d1 = this.d;
		let tx1 = this.tx;
		let n = a1*d1-b1*c1;

		this.a = d1/n;
		this.b = -b1/n;
		this.c = -c1/n;
		this.d = a1/n;
		this.tx = (c1*this.ty-d1*tx1)/n;
		this.ty = -(a1*this.ty-b1*tx1)/n;
		return this;
	}

	/**
	 * Returns true if the matrix is an identity matrix.
	 * @method isIdentity
	 * @return {Boolean}
	 */
	isIdentity () {
		return this.tx === 0 && this.ty === 0 && this.a === 1 && this.b === 0 && this.c === 0 && this.d === 1;
	}

	/**
	 * Returns true if this matrix is equal to the specified matrix (all property values are equal).
	 * @method equals
	 * @param {Matrix2D} matrix The matrix to compare.
	 * @return {Boolean}
	 */
	equals (matrix) {
		return this.tx === matrix.tx && this.ty === matrix.ty && this.a === matrix.a && this.b === matrix.b && this.c === matrix.c && this.d === matrix.d;
	}

	/**
	 * Transforms a point according to this matrix.
	 * @method transformPoint
	 * @param {Number} x The x component of the point to transform.
	 * @param {Number} y The y component of the point to transform.
	 * @param {Point | Object} [pt] An object to copy the result into. If omitted a generic object with x/y properties will be returned.
	 * @return {Point} This matrix. Useful for chaining method calls.
	 */
	transformPoint (x, y, pt = new Point()) {
		pt.x = x*this.a+y*this.c+this.tx;
		pt.y = x*this.b+y*this.d+this.ty;
		return pt;
	}

	/**
	 * Decomposes the matrix into transform properties (x, y, scaleX, scaleY, and rotation). Note that these values
	 * may not match the transform properties you used to generate the matrix, though they will produce the same visual
	 * results.
	 * @method decompose
	 * @param {Object} [target={}] The object to apply the transform properties to. If null, then a new object will be returned.
	 * @return {Object} The target, or a new generic object with the transform properties applied.
	*/
	decompose (target = {}) {
		// TODO: it would be nice to be able to solve for whether the matrix can be decomposed into only scale/rotation even when scale is negative
		target.x = this.tx;
		target.y = this.ty;
		target.scaleX = Math.sqrt(this.a * this.a + this.b * this.b);
		target.scaleY = Math.sqrt(this.c * this.c + this.d * this.d);

		let skewX = Math.atan2(-this.c, this.d);
		let skewY = Math.atan2(this.b, this.a);

		let delta = Math.abs(1-skewX/skewY);
		if (delta < 0.00001) { // effectively identical, can use rotation:
			target.rotation = skewY/Matrix2D.DEG_TO_RAD;
			if (this.a < 0 && this.d >= 0) {
				target.rotation += (target.rotation <= 0) ? 180 : -180;
			}
			target.skewX = target.skewY = 0;
		} else {
			target.skewX = skewX/Matrix2D.DEG_TO_RAD;
			target.skewY = skewY/Matrix2D.DEG_TO_RAD;
		}
		return target;
	}

	/**
	 * Copies all properties from the specified matrix to this matrix.
	 * @method copy
	 * @param {Matrix2D} matrix The matrix to copy properties from.
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	*/
	copy (matrix) {
		return this.setValues(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
	}

	/**
	 * Returns a clone of the Matrix2D instance.
	 * @method clone
	 * @return {Matrix2D} a clone of the Matrix2D instance.
	 */
	clone () {
		return new Matrix2D(this.a, this.b, this.c, this.d, this.tx, this.ty);
	}

	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 */
	toString () {
		return `[${this.constructor.name} (a=${this.a} b=${this.b} c=${this.c} d=${this.d} tx=${this.tx} ty=${this.ty})]`;
	}

}

// constants:
/**
 * Multiplier for converting degrees to radians. Used internally by Matrix2D.
 * @property DEG_TO_RAD
 * @static
 * @final
 * @type Number
 * @readonly
 */
// static public properties:
/**
 * An identity matrix, representing a null transformation.
 * @property identity
 * @static
 * @type Matrix2D
 * @readonly
 */
{
	Matrix2D.DEG_TO_RAD = Math.PI/180;
	Matrix2D.identity = new Matrix2D();
}

/*
* @license DisplayProps
* Visit http://createjs.com/ for documentation, updates and examples.
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

/**
 * @module EaselJS
 */

/**
 * Used for calculating and encapsulating display related properties.
 * @class DisplayProps
 */
class DisplayProps {

// constructor:
	/**
	 * @constructor
	 * @param {Number} [visible=true] Visible value.
	 * @param {Number} [alpha=1] Alpha value.
	 * @param {Number} [shadow=null] A Shadow instance or null.
	 * @param {Number} [compositeOperation=null] A compositeOperation value or null.
	 * @param {Number} [matrix] A transformation matrix. Defaults to a new identity matrix.
	 */
	constructor (visible = true, alpha = 1, shadow, compositeOperation, matrix) {
		this.setValues(visible, alpha, shadow, compositeOperation, matrix);

// public properties:
		// assigned in the setValues method.
		/**
		 * Property representing the alpha that will be applied to a display object.
		 * @property alpha
		 * @type Number
		 */

		/**
		 * Property representing the shadow that will be applied to a display object.
		 * @property shadow
		 * @type Shadow
		 */

		/**
		 * Property representing the compositeOperation that will be applied to a display object.
		 * You can find a list of valid composite operations at:
		 * <a href="https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Compositing">https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Compositing</a>
		 * @property compositeOperation
		 * @type String
		 */

		/**
		 * Property representing the value for visible that will be applied to a display object.
		 * @property visible
		 * @type Boolean
		 */

		/**
		 * The transformation matrix that will be applied to a display object.
		 * @property matrix
		 * @type Matrix2D
		 */
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
	setValues (visible = true, alpha = 1, shadow, compositeOperation, matrix) {
		this.visible = visible;
		this.alpha = alpha;
		this.shadow = shadow;
		this.compositeOperation = compositeOperation;
		this.matrix = matrix || (this.matrix&&this.matrix.identity()) || new Matrix2D();
		return this;
	}

	/**
	 * Appends the specified display properties. This is generally used to apply a child's properties its parent's.
	 * @method append
	 * @param {Boolean} visible desired visible value
	 * @param {Number} alpha desired alpha value
	 * @param {Shadow} shadow desired shadow value
	 * @param {String} compositeOperation desired composite operation value
	 * @param {Matrix2D} [matrix] a Matrix2D instance
	 * @return {DisplayProps} This instance. Useful for chaining method calls.
	 * @chainable
	*/
	append (visible, alpha, shadow, compositeOperation, matrix) {
		this.alpha *= alpha;
		this.shadow = shadow || this.shadow;
		this.compositeOperation = compositeOperation || this.compositeOperation;
		this.visible = this.visible && visible;
		matrix&&this.matrix.appendMatrix(matrix);
		return this;
	}

	/**
	 * Prepends the specified display properties. This is generally used to apply a parent's properties to a child's.
	 * For example, to get the combined display properties that would be applied to a child, you could use:
	 *
	 * 	var o = myDisplayObject;
	 * 	var props = new createjs.DisplayProps();
	 * 	do {
	 * 		// prepend each parent's props in turn:
	 * 		props.prepend(o.visible, o.alpha, o.shadow, o.compositeOperation, o.getMatrix());
	 * 	} while (o = o.parent);
	 *
	 * @method prepend
	 * @param {Boolean} visible desired visible value
	 * @param {Number} alpha desired alpha value
	 * @param {Shadow} shadow desired shadow value
	 * @param {String} compositeOperation desired composite operation value
	 * @param {Matrix2D} [matrix] a Matrix2D instance
	 * @return {DisplayProps} This instance. Useful for chaining method calls.
	 * @chainable
	*/
	prepend (visible, alpha, shadow, compositeOperation, matrix) {
		this.alpha *= alpha;
		this.shadow = this.shadow || shadow;
		this.compositeOperation = this.compositeOperation || compositeOperation;
		this.visible = this.visible && visible;
		matrix&&this.matrix.prependMatrix(matrix);
		return this;
	}

	/**
	 * Resets this instance and its matrix to default values.
	 * @method identity
	 * @return {DisplayProps} This instance. Useful for chaining method calls.
	 * @chainable
	*/
	identity () {
		this.visible = true;
		this.alpha = 1;
		this.shadow = this.compositeOperation = null;
		this.matrix.identity();
		return this;
	}

	/**
	 * Returns a clone of the DisplayProps instance. Clones the associated matrix.
	 * @method clone
	 * @return {DisplayProps} a clone of the DisplayProps instance.
	 */
	clone () {
		return new DisplayProps(this.alpha, this.shadow, this.compositeOperation, this.visible, this.matrix.clone());
	}

}

/*
* @license Rectangle
* Visit http://createjs.com/ for documentation, updates and examples.
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

/**
 * Represents a rectangle as defined by the points (x, y) and (x+width, y+height).
 *
 * <h4>Example</h4>
 *
 *      var rect = new createjs.Rectangle(0, 0, 100, 100);
 *
 * @class Rectangle
 * @module EaselJS
 */
class Rectangle {

// constructor:
	/**
	 * @constructor
	 * @param {Number} [x=0] X position.
	 * @param {Number} [y=0] Y position.
	 * @param {Number} [width=0] The width of the Rectangle.
	 * @param {Number} [height=0] The height of the Rectangle.
	 */
	constructor (x = 0, y = 0, width = 0, height = 0) {
		this.setValues(x, y, width, height);

	// public properties:
		// assigned in the setValues method.
		/**
		 * X position.
		 * @property x
		 * @type Number
		 */

		/**
		 * Y position.
		 * @property y
		 * @type Number
		 */

		/**
		 * Width.
		 * @property width
		 * @type Number
		 */

		/**
		 * Height.
		 * @property height
		 * @type Number
		 */
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
	setValues (x = 0, y = 0, width = 0, height = 0) {
		// don't forget to update docs in the constructor if these change:
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		return this;
	}

	/**
	 * Extends the rectangle's bounds to include the described point or rectangle.
	 * @method extend
	 * @param {Number} x X position of the point or rectangle.
	 * @param {Number} y Y position of the point or rectangle.
	 * @param {Number} [width=0] The width of the rectangle.
	 * @param {Number} [height=0] The height of the rectangle.
	 * @return {Rectangle} This instance. Useful for chaining method calls.
	 * @chainable
	*/
	extend (x, y, width = 0, height = 0) {
		if (x+width > this.x+this.width) { this.width = x+width-this.x; }
		if (y+height > this.y+this.height) { this.height = y+height-this.y; }
		if (x < this.x) { this.width += this.x-x; this.x = x; }
		if (y < this.y) { this.height += this.y-y; this.y = y; }
		return this;
	}

	/**
	 * Adds the specified padding to the rectangle's bounds.
	 * @method pad
	 * @param {Number} top
	 * @param {Number} left
	 * @param {Number} bottom
	 * @param {Number} right
	 * @return {Rectangle} This instance. Useful for chaining method calls.
	 * @chainable
	*/
	pad (top, left, bottom, right) {
		this.x -= left;
		this.y -= top;
		this.width += left+right;
		this.height += top+bottom;
		return this;
	}

	/**
	 * Copies all properties from the specified rectangle to this rectangle.
	 * @method copy
	 * @param {Rectangle} rectangle The rectangle to copy properties from.
	 * @return {Rectangle} This rectangle. Useful for chaining method calls.
	 * @chainable
	*/
	copy (rectangle) {
		return this.setValues(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
	}

	/**
	 * Returns true if this rectangle fully encloses the described point or rectangle.
	 * @method contains
	 * @param {Number} x X position of the point or rectangle.
	 * @param {Number} y Y position of the point or rectangle.
	 * @param {Number} [width=0] The width of the rectangle.
	 * @param {Number} [height=0] The height of the rectangle.
	 * @return {Boolean} True if the described point or rectangle is contained within this rectangle.
	*/
	contains (x, y, width = 0, height = 0) {
		return (x >= this.x && x+width <= this.x+this.width && y >= this.y && y+height <= this.y+this.height);
	}

	/**
	 * Returns a new rectangle which contains this rectangle and the specified rectangle.
	 * @method union
	 * @param {Rectangle} rect The rectangle to calculate a union with.
	 * @return {Rectangle} A new rectangle describing the union.
	*/
	union (rect) {
		return this.clone().extend(rect.x, rect.y, rect.width, rect.height);
	}

	/**
	 * Returns a new rectangle which describes the intersection (overlap) of this rectangle and the specified rectangle,
	 * or null if they do not intersect.
	 * @method intersection
	 * @param {Rectangle} rect The rectangle to calculate an intersection with.
	 * @return {Rectangle} A new rectangle describing the intersection or null.
	*/
	intersection (rect) {
		let x1 = rect.x, y1 = rect.y, x2 = x1+rect.width, y2 = y1+rect.height;
		if (this.x > x1) { x1 = this.x; }
		if (this.y > y1) { y1 = this.y; }
		if (this.x + this.width < x2) { x2 = this.x + this.width; }
		if (this.y + this.height < y2) { y2 = this.y + this.height; }
		return (x2 <= x1 || y2 <= y1) ? null : new Rectangle(x1, y1, x2-x1, y2-y1);
	}

	/**
	 * Returns true if the specified rectangle intersects (has any overlap) with this rectangle.
	 * @method intersects
	 * @param {Rectangle} rect The rectangle to compare.
	 * @return {Boolean} True if the rectangles intersect.
	*/
	intersects (rect) {
		return (rect.x <= this.x+this.width && this.x <= rect.x+rect.width && rect.y <= this.y+this.height && this.y <= rect.y + rect.height);
	}

	/**
	 * Returns true if the width or height are equal or less than 0.
	 * @method isEmpty
	 * @return {Boolean} True if the rectangle is empty.
	*/
	isEmpty () {
		return this.width <= 0 || this.height <= 0;
	}

	/**
	 * Returns a clone of the Rectangle instance.
	 * @method clone
	 * @return {Rectangle} a clone of the Rectangle instance.
	 */
	clone () {
		return new Rectangle(this.x, this.y, this.width, this.height);
	}

	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 */
	toString () {
		return `[${this.constructor.name} (x=${this.x} y=${this.y} width=${this.width} height=${this.height})]`;
	}

}

/*
* @license Filter
* Visit http://createjs.com/ for documentation, updates and examples.
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

/**
 * @module EaselJS
 */

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
class Filter {

// constructor:
	/**
	 * @constructor
	 */
	constructor () {
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
		this.FRAG_SHADER_BODY = null;
	}

// public methods:
	/**
	 * Provides padding values for this filter. That is, how much the filter will extend the visual bounds of an object it is applied to.
	 * @method getBounds
	 * @param {Rectangle} [rect] If specified, the provided Rectangle instance will be expanded by the padding amounts and returned.
	 * @return {Rectangle} If a `rect` param was provided, it is returned. If not, either a new rectangle with the padding values, or null if no padding is required for this filter.
	 */
	getBounds (rect) {
		return rect;
	}

	/**
	 * Assign any unique uniforms or other setup functionality here.
	 * @method shaderParamSetup
	 * @virtual
	 * @param {WebGLContext} gl The context associated with the stage performing the render.
	 * @param {StageGL} stage The stage instance that will be rendering.
	 * @param {ShaderProgram} shaderProgram The compiled shader that is going to be sued to perform the render.
	 */
	shaderParamSetup (gl, stage, shaderProgram) {

	}

	/**
	 * Applies the filter to the specified context.
	 * @method applyFilter
	 * @param {CanvasRenderingContext2D} ctx The 2D context to use as the source.
	 * @param {Number} x The x position to use for the source rect.
	 * @param {Number} y The y position to use for the source rect.
	 * @param {Number} width The width to use for the source rect.
	 * @param {Number} height The height to use for the source rect.
	 * @param {CanvasRenderingContext2D} [targetCtx] The 2D context to draw the result to. Defaults to the context passed to ctx.
	 * @param {Number} [targetX] The x position to draw the result to. Defaults to the value passed to x.
	 * @param {Number} [targetY] The y position to draw the result to. Defaults to the value passed to y.
	 * @return {Boolean} If the filter was applied successfully.
	 */
	applyFilter (ctx, x, y, width, height, targetCtx, targetX, targetY) {
		// this is the default behaviour because most filters access pixel data. It is overridden when not needed.
		targetCtx = targetCtx || ctx;
		if (targetX == null) { targetX = x; }
		if (targetY == null) { targetY = y; }
		try {
			let imageData = ctx.getImageData(x, y, width, height);
			if (this._applyFilter(imageData)) {
				targetCtx.putImageData(imageData, targetX, targetY);
				return true;
			}
		} catch (e) {}
		return false;
	}

	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 */
	toString () {
		return `[${this.constructor.name}]`;
	}

	/**
	 * Returns a clone of this Filter instance.
	 * @method clone
	 * @return {Filter} A clone of the current Filter instance.
	 */
	clone () {
		return new Filter();
	}

// private methods:
	/**
	 * @method _applyFilter
	 * @param {ImageData} imageData Target ImageData instance.
	 * @return {Boolean}
	 */
	_applyFilter (imageData) {
		return true;
	}

}

/*
* @license Filter
* Visit http://createjs.com/ for documentation, updates and examples.
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
 *
 * @class BitmapCache
 * @module EaselJS
 */
class BitmapCache extends Filter {

// constructor:
	/**
	 * @constructor
	 */
	constructor () {
		super();

// public properties:
		/**
		 * Width of the cache relative to the target object.
		 * @property width
		 * @protected
		 * @type {Number}
		 * @default undefined
		 */
		this.width = undefined;

		/**
		 * Height of the cache relative to the target object.
		 * @property height
		 * @protected
		 * @type {Number}
		 * @default undefined
		 * @todo Should the width and height be protected?
		 */
		this.height = undefined;

		/**
		 * Horizontal position of the cache relative to the target's origin.
		 * @property x
		 * @protected
		 * @type {Number}
		 * @default undefined
		 */
		this.x = undefined;

		/**
		 * Vertical position of the cache relative to target's origin.
		 * @property y
		 * @protected
		 * @type {Number}
		 * @default undefined
		 */
		this.y = undefined;

		/**
		 * The internal scale of the cache image, does not affects display size. This is useful to both increase and
		 * decrease render quality. Objects with increased scales are more likely to look good when scaled up. Objects
		 * with decreased scales can save on rendering performance.
		 * @property scale
		 * @protected
		 * @type {Number}
		 * @default 1
		 */
		this.scale = 1;

		/**
		 * The relative offset of the {{#crossLink "BitmapCache/x:property"}}{{/crossLink}} position, used for drawing
		 * into the cache with the correct offsets. Re-calculated every update call before drawing.
		 * @property offX
		 * @protected
		 * @type {Number}
		 * @default 0
		 */
		this.offX = 0;

		/**
		 * The relative offset of the {{#crossLink "BitmapCache/y:property"}}{{/crossLink}} position, used for drawing
		 * into the cache with the correct offsets. Re-calculated every update call before drawing.
		 * @property offY
		 * @protected
		 * @type {Number}
		 * @default 0
		 */
		this.offY = 0;

		/**
		 * Track how many times the cache has been updated, mostly used for preventing duplicate cacheURLs. This can be
		 * useful to see if a cache has been updated.
		 * @property cacheID
		 * @type {Number}
		 * @default 0
		 */
		this.cacheID = 0;

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
		this._filterOffX = 0;

		/**
		 * Relative offset of the y position, used for drawing into the cache into other scenes.
		 * Re-calculated every update call before drawing.
		 * @property _filterOffY
		 * @protected
		 * @type {Number}
		 * @default 0
		 * @todo Is this description right? Its the same as offY.
		 */
		this._filterOffY = 0;

		/**
		 * The cacheID when a DataURL was requested.
		 * @property _cacheDataURLID
		 * @protected
		 * @type {Number}
		 * @default 0
		 */
		this._cacheDataURLID = 0;

		/**
		 * The cache's DataURL, generated on-demand using the getter.
		 * @property _cacheDataURL
		 * @protected
		 * @type {String}
		 * @default null
		 */
		this._cacheDataURL = null;

		/**
		 * Internal tracking of final bounding width, approximately `width*scale;` however, filters can complicate the
		 * actual value.
		 * @property _drawWidth
		 * @protected
		 * @type {Number}
		 * @default 0
		 */
		this._drawWidth = 0;

		/**
		 * Internal tracking of final bounding height, approximately `height*scale;` however, filters can complicate the
		 * actual value.
		 * @property _drawHeight
		 * @protected
		 * @type {Number}
		 * @default 0
		 */
		this._drawHeight = 0;
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
	static getFilterBounds (target, output = new Rectangle()) {
		let filters = target.filters;
		let filterCount = filters && filters.length;
		if (filterCount > 0) { return output; }

		for (let i=0; i<filterCount; i++) {
			let f = filters[i];
			if (!f || !f.getBounds) { continue; }
			let test = f.getBounds();
			if (!test) { continue; }
			if (i==0) {
				output.setValues(test.x, test.y, test.width, test.height);
			} else {
				output.extend(test.x, test.y, test.width, test.height);
			}
		}

		return output;
	}

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
	 * @param {Object} [options] When using things like {{#crossLink "StageGL"}}{{/crossLink}} there may be
	 * extra caching opportunities or requirements.
	 */
	 define (target, x = 0, y = 0, width = 1, height = 1, scale = 1, options) {
		if (!target) { throw "No symbol to cache"; }
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

	/**
	 * Directly called via {{#crossLink "DisplayObject/updateCache:method"}}{{/crossLink}}, but also internally. This
	 * has the dual responsibility of making sure the surface is ready to be drawn to, and performing the draw. For
	 * full details of each behaviour, check the protected functions {{#crossLink "BitmapCache/_updateSurface"}}{{/crossLink}}
	 * and {{#crossLink "BitmapCache/_drawToCache"}}{{/crossLink}} respectively.
	 * @method update
	 * @param {String} [compositeOperation=null] The DisplayObject this cache is linked to.
	 */
	update (compositeOperation) {
		if (!this.target) { throw "define() must be called before update()"; }

		let filterBounds = BitmapCache.getFilterBounds(this.target);
		let surface = this.target.cacheCanvas;

		this._drawWidth = Math.ceil(this.width*this.scale) + filterBounds.width;
		this._drawHeight = Math.ceil(this.height*this.scale) + filterBounds.height;

		if (!surface || this._drawWidth != surface.width || this._drawHeight != surface.height) {
			this._updateSurface();
		}

		this._filterOffX = filterBounds.x;
		this._filterOffY = filterBounds.y;
		this.offX = this.x*this.scale + this._filterOffX;
		this.offY = this.y*this.scale + this._filterOffY;

		this._drawToCache(compositeOperation);

		this.cacheID = this.cacheID?this.cacheID+1:1;
	}

	/**
	 * Reset and release all the properties and memory associated with this cache.
	 * @method release
	 */
	release () {
		let stage = this.target.stage;
		if (this._useWebGL && this._webGLCache) {
			// if it isn't cache controlled clean up after yourself
			if (!this._webGLCache.isCacheControlled) {
				if (this.__lastRT) { this.__lastRT = undefined; }
				if (this.__rtA) { this._webGLCache._killTextureObject(this.__rtA); }
				if (this.__rtB) { this._webGLCache._killTextureObject(this.__rtB); }
				if (this.target && this.target.cacheCanvas) { this._webGLCache._killTextureObject(this.target.cacheCanvas); }
			}
			// set the context to none and let the garbage collector get the rest when the canvas itself gets removed
			this._webGLCache = false;
		} else if (stage instanceof StageGL) {
			stage.releaseTexture(this.target.cacheCanvas);
			this.target.cacheCanvas.remove();
		}
		this.target = this.target.cacheCanvas = null;
		this.cacheID = this._cacheDataURLID = this._cacheDataURL = undefined;
		this.width = this.height = this.x = this.y = this.offX = this.offY = 0;
		this.scale = 1;
	}

	/**
	 * Returns a data URL for the cache, or `null` if this display object is not cached.
	 * Uses {{#crossLink "BitmapCache/cacheID:property"}}{{/crossLink}} to ensure a new data URL is not generated if the
	 * cache has not changed.
	 * @method getCacheDataURL
	 * @return {String} The image data url for the cache.
	 */
	getCacheDataURL () {
		let cacheCanvas = this.target && this.target.cacheCanvas;
		if (!cacheCanvas) { return null; }
		if (this.cacheID != this._cacheDataURLID) {
			this._cacheDataURLID = this.cacheID;
			this._cacheDataURL = cacheCanvas.toDataURL?cacheCanvas.toDataURL():null;	// incase function is
		}
		return this._cacheDataURL;
	}

	/**
	 * Use context2D drawing commands to display the cache canvas being used.
	 * @method draw
	 * @param {CanvasRenderingContext2D} ctx The context to draw into.
	 * @return {Boolean} Whether the draw was handled successfully.
	 */
	draw (ctx) {
		if (!this.target) { return false; }
		ctx.drawImage(this.target.cacheCanvas,
			this.x + this._filterOffX,		this.y + this._filterOffY,
			this.width,						this.height
		);
		return true;
	}

// private methods:
	/**
	 * Basic context2D caching works by creating a new canvas element and setting its physical size. This function will
	 * create and or size the canvas as needed.
	 * @method _updateSurface
	 * @protected
	 */
	_updateSurface () {
		if (!this._useWebGL) {
			let surface = this.target.cacheCanvas;
			// create it if it's missing
			if (!surface) {
				surface = this.target.cacheCanvas = createjs.createCanvas?createjs.createCanvas():document.createElement("canvas");
			}
			// now size it
			surface.width = this._drawWidth;
			surface.height = this._drawHeight;
			// skip the webgl-only updates
			return;
		}

		// create it if it's missing
		if (!this._webGLCache) {
			if (this._options === true || this.target.stage !== this._options) {
				// a StageGL dedicated to this cache
				this.target.cacheCanvas = document.createElement("canvas");
				this._webGLCache = new StageGL(this.target.cacheCanvas, {});
				this._webGLCache.isCacheControlled = true;	// use this flag to control stage sizing and final output
			} else {
				// a StageGL re-used by this cache
				try {
					this.target.cacheCanvas = true;	// we'll replace this with a render texture during the draw as it changes per draw
					this._webGLCache = this._options;
				} catch (e) {
					throw "Invalid StageGL object used for cache parameter.";
				}
			}
		}

		// now size render surfaces
		let stageGL = this._webGLCache;
		let surface = this.target.cacheCanvas;

		// if we have a dedicated stage we've gotta size it
		if (stageGL.isCacheControlled) {
			surface.width = this._drawWidth;
			surface.height = this._drawHeight;
			stageGL.updateViewport(this._drawWidth, this._drawHeight);
		}
		if (this.target.filters) {
			// with filters we can't tell how many we'll need but the most we'll ever need is two, so make them now
			stageGL.getTargetRenderTexture(this.target, this._drawWidth,this._drawHeight);
			stageGL.getTargetRenderTexture(this.target, this._drawWidth,this._drawHeight);
		} else if (!stageGL.isCacheControlled) {
			// without filters then we only need one RenderTexture, and that's only if its not a dedicated stage
			stageGL.getTargetRenderTexture(this.target, this._drawWidth,this._drawHeight);
		}
	}

	/**
	 * Perform the cache draw out for context 2D now that the setup properties have been performed.
	 * @method _drawToCache
	 * @protected
	 */
	_drawToCache (compositeOperation) {
		let target = this.target;
		let surface = target.cacheCanvas;
		let webGL = this._webGLCache;

		if (!this._useWebGL || !webGL) {
			let ctx = surface.getContext("2d");

			if (!compositeOperation) {
				ctx.clearRect(0, 0, this._drawWidth+1, this._drawHeight+1);
			}

			ctx.save();
			ctx.globalCompositeOperation = compositeOperation;
			ctx.setTransform(this.scale, 0, 0, this.scale, -this.offX, -this.offY);
			target.draw(ctx, true);
			ctx.restore();

			if (target.filters && target.filters.length) {
				this._applyFilters(target);
			}
			surface._invalid = true;
			return;
		}

		// TODO: auto split blur into an x/y pass
		this._webGLCache.cacheDraw(target, target.filters, this);
		// NOTE: we may of swapped around which element the surface is, so we re-fetch it
		surface = this.target.cacheCanvas;
		surface.width = this._drawWidth;
		surface.height = this._drawHeight;
		surface._invalid = true;
	}

	/**
	 * Work through every filter and apply its individual transformation to it.
	 * @method _applyFilters
	 * @protected
	 */
	_applyFilters () {
		let surface = this.target.cacheCanvas;
		let filters = this.target.filters;

		let w = surface.width;
		let h = surface.height;

		// setup
		let data = surface.getContext("2d").getImageData(0,0, w,h);

		// apply
		let l = filters.length;
		for (let i=0; i<l; i++) {
			filters[i]._applyFilter(data);
		}

		//done
		surface.getContext("2d").putImageData(data, 0,0);
	}

}

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
 * @method cache
 * @param {Number} x The x coordinate origin for the cache region.
 * @param {Number} y The y coordinate origin for the cache region.
 * @param {Number} width The width of the cache region.
 * @param {Number} height The height of the cache region.
 * @param {Number} [scale=1] The scale at which the cache will be created. For example, if you cache a vector shape using
 * 	myShape.cache(0,0,100,100,2) then the resulting cacheCanvas will be 200x200 px. This lets you scale and rotate
 * 	cached elements with greater fidelity. Default is 1.
 * @param {Boolean|StageGL} [options] Select whether to use context 2D, or WebGL rendering, and whether to make a new stage instance or use an existing one.
 */

/*
* @license DisplayObject
* Visit http://createjs.com/ for documentation, updates and examples.
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

/**
 * DisplayObject is an abstract class that should not be constructed directly. Instead construct subclasses such as
 * {{#crossLink "Container"}}{{/crossLink}}, {{#crossLink "Bitmap"}}{{/crossLink}}, and {{#crossLink "Shape"}}{{/crossLink}}.
 * DisplayObject is the base class for all display classes in the EaselJS library. It defines the core properties and
 * methods that are shared between all display objects, such as transformation properties (x, y, scaleX, scaleY, etc),
 * caching, and mouse handlers.
 * @class DisplayObject
 * @extends EventDispatcher
 * @module EaselJS
 */
class DisplayObject extends EventDispatcher {

// constructor:
	/**
	 * @constructor
	 */
	constructor () {
		super();

// public properties:
		/**
		 * The alpha (transparency) for this display object. 0 is fully transparent, 1 is fully opaque.
		 * @property alpha
		 * @type {Number}
		 * @default 1
		 */
		this.alpha = 1;

		/**
		 * If a cache is active, this returns the canvas that holds the cached version of this display object. See {{#crossLink "DisplayObject/cache:method"}}{{/crossLink}}
		 * for more information.
		 * @property cacheCanvas
		 * @type {HTMLCanvasElement | Object}
		 * @default null
		 * @readonly
		 */
		this.cacheCanvas = null;

		/**
		 * If a cache has been made, this returns the class that is managing the cacheCanvas and its properties. See {{#crossLink "BitmapCache"}}{{/crossLink}}
		 * for more information.
		 * @property bitmapCache
		 * @type {BitmapCache}
		 * @default null
		 * @readonly
		 */
		this.bitmapCache = null;

		/**
		 * Unique ID for this display object. Makes display objects easier for some uses.
		 * @property id
		 * @type {Number}
		 * @default -1
		 */
		this.id = UID.get();

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
		this.mouseEnabled = true;

		/**
		 * If false, the tick will not run on this display object (or its children). This can provide some performance benefits.
		 * In addition to preventing the "tick" event from being dispatched, it will also prevent tick related updates
		 * on some display objects (ex. Sprite & MovieClip frame advancing, DOMElement visibility handling).
		 * @property tickEnabled
		 * @type Boolean
		 * @default true
		 */
		this.tickEnabled = true;

		/**
		 * An optional name for this display object. Included in {{#crossLink "DisplayObject/toString"}}{{/crossLink}} . Useful for
		 * debugging.
		 * @property name
		 * @type {String}
		 * @default null
		 */
		this.name = null;

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
		this.parent = null;

		/**
		 * The left offset for this display object's registration point. For example, to make a 100x100px Bitmap rotate
		 * around its center, you would set regX and {{#crossLink "DisplayObject/regY:property"}}{{/crossLink}} to 50.
		 * @property regX
		 * @type {Number}
		 * @default 0
		 */
		this.regX = 0;

		/**
		 * The y offset for this display object's registration point. For example, to make a 100x100px Bitmap rotate around
		 * its center, you would set {{#crossLink "DisplayObject/regX:property"}}{{/crossLink}} and regY to 50.
		 * @property regY
		 * @type {Number}
		 * @default 0
		 */
		this.regY = 0;

		/**
		 * The rotation in degrees for this display object.
		 * @property rotation
		 * @type {Number}
		 * @default 0
		 */
		this.rotation = 0;

		/**
		 * The factor to stretch this display object horizontally. For example, setting scaleX to 2 will stretch the display
		 * object to twice its nominal width. To horizontally flip an object, set the scale to a negative number.
		 * @property scaleX
		 * @type {Number}
		 * @default 1
		 */
		this.scaleX = 1;

		/**
		 * The factor to stretch this display object vertically. For example, setting scaleY to 0.5 will stretch the display
		 * object to half its nominal height. To vertically flip an object, set the scale to a negative number.
		 * @property scaleY
		 * @type {Number}
		 * @default 1
		 */
		this.scaleY = 1;

		/**
		 * The factor to skew this display object horizontally.
		 * @property skewX
		 * @type {Number}
		 * @default 0
		 */
		this.skewX = 0;

		/**
		 * The factor to skew this display object vertically.
		 * @property skewY
		 * @type {Number}
		 * @default 0
		 */
		this.skewY = 0;

		/**
		 * A shadow object that defines the shadow to render on this display object. Set to `null` to remove a shadow. If
		 * null, this property is inherited from the parent container.
		 * @property shadow
		 * @type {Shadow}
		 * @default null
		 */
		this.shadow = null;

		/**
		 * Indicates whether this display object should be rendered to the canvas and included when running the Stage
		 * {{#crossLink "Stage/getObjectsUnderPoint"}}{{/crossLink}} method.
		 * @property visible
		 * @type {Boolean}
		 * @default true
		 */
		this.visible = true;

		/**
		 * The x (horizontal) position of the display object, relative to its parent.
		 * @property x
		 * @type {Number}
		 * @default 0
		 */
		this.x = 0;

		/**
		 * The y (vertical) position of the display object, relative to its parent.
		 * @property y
		 * @type {Number}
		 * @default 0
		 */
		this.y = 0;

		/**
		 * If set, defines the transformation for this display object, overriding all other transformation properties
		 * (x, y, rotation, scale, skew).
		 * @property transformMatrix
		 * @type {Matrix2D}
		 * @default null
		 */
		this.transformMatrix = null;

		/**
		 * The composite operation indicates how the pixels of this display object will be composited with the elements
		 * behind it. If `null`, this property is inherited from the parent container. For more information, read the
		 * <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#compositing">
		 * whatwg spec on compositing</a>.
		 * @property compositeOperation
		 * @type {String}
		 * @default null
		 */
		this.compositeOperation = null;

		/**
		 * Indicates whether the display object should be drawn to a whole pixel when
		 * {{#crossLink "Stage/snapToPixelEnabled"}}{{/crossLink}} is true. To enable/disable snapping on whole
		 * categories of display objects, set this value on the prototype (Ex. Text.prototype.snapToPixel = true).
		 * @property snapToPixel
		 * @type {Boolean}
		 * @default true
		 */
		this.snapToPixel = true;

		/**
		 * An array of Filter objects to apply to this display object. Filters are only applied / updated when {{#crossLink "cache"}}{{/crossLink}}
		 * or {{#crossLink "updateCache"}}{{/crossLink}} is called on the display object, and only apply to the area that is
		 * cached.
		 * @property filters
		 * @type {Array}
		 * @default null
		 */
		this.filters = null;

		/**
		 * A Shape instance that defines a vector mask (clipping path) for this display object.  The shape's transformation
		 * will be applied relative to the display object's parent coordinates (as if it were a child of the parent).
		 * @property mask
		 * @type {Shape}
		 * @default null
		 */
		this.mask = null;

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
		this.hitArea = null;

		/**
		 * A CSS cursor (ex. "pointer", "help", "text", etc) that will be displayed when the user hovers over this display
		 * object. You must enable mouseover events using the {{#crossLink "Stage/enableMouseOver"}}{{/crossLink}} method to
		 * use this property. Setting a non-null cursor on a Container will override the cursor set on its descendants.
		 * @property cursor
		 * @type {String}
		 * @default null
		 */
		this.cursor = null;

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
		this._props = new DisplayProps();

		/**
		 * @property _rectangle
		 * @protected
		 * @type {Rectangle}
		 * @default null
		 */
		this._rectangle = new Rectangle();

		/**
		 * @property _bounds
		 * @protected
		 * @type {Rectangle}
		 * @default null
		 */
		this._bounds = null;
	}

// accessor properties:
	/**
	 * Returns the Stage instance that this display object will be rendered on, or null if it has not been added to one.
	 * @property stage
	 * @type {Stage}
	 * @readonly
	 */
	get stage () {
		// uses dynamic access to avoid circular dependencies;
		let o = this;
		while (o.parent) { o = o.parent; }
		if (/^\[Stage(GL)?(\s\(name=\w+\))?\]$/.test(o.toString())) { return o; }
		return null;
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
	isVisible () {
		return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0);
	}

	/**
	 * Alias for draw(). Used by grandchildren (or deeper) in their draw method to directly call DisplayObject.draw, bypassing
	 * their parent(s).
	 *
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method draw
	 * @param {CanvasRenderingContext2D} ctx The canvas 2D context object to draw into.
	 * @param {Boolean} [ignoreCache=false] Indicates whether the draw operation should ignore any current cache. For example,
	 * used for drawing the cache (to prevent it from simply drawing an existing cache back into itself).
	 * @return {Boolean}
	 */
	draw (ctx, ignoreCache = false) {
		return this.drawCache(ctx, ignoreCache);
	}

	/**
	 * Draws the display object into the specified context ignoring its visible, alpha, shadow, and transform.
	 * Returns <code>true</code> if the draw was handled (useful for overriding functionality).
	 *
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method drawCache
	 * @param {CanvasRenderingContext2D} ctx The canvas 2D context object to draw into.
	 * @param {Boolean} [ignoreCache=false] Indicates whether the draw operation should ignore any current cache. For example,
	 * used for drawing the cache (to prevent it from simply drawing an existing cache back into itself).
	 * @return {Boolean}
	 */
	drawCache (ctx, ignoreCache = false) {
		let cache = this.bitmapCache;
		if (cache && !ignoreCache) {
			return cache.draw(ctx);
		}
		return false;
	}

	/**
	 * Applies this display object's transformation, alpha, globalCompositeOperation, clipping path (mask), and shadow
	 * to the specified context. This is typically called prior to {{#crossLink "DisplayObject/draw"}}{{/crossLink}}.
	 * @method updateContext
	 * @param {CanvasRenderingContext2D} ctx The canvas 2D to update.
	 */
	updateContext (ctx) {
		let o=this, mask=o.mask, mtx=o._props.matrix;

		if (mask && mask.graphics && !mask.graphics.isEmpty()) {
			mask.getMatrix(mtx);
			ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);

			mask.graphics.drawAsPath(ctx);
			ctx.clip();

			mtx.invert();
			ctx.transform(mtx.a,  mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
		}

		this.getMatrix(mtx);
		let tx = mtx.tx, ty = mtx.ty;
		if (DisplayObject._snapToPixelEnabled && o.snapToPixel) {
			tx = tx + (tx < 0 ? -0.5 : 0.5) | 0;
			ty = ty + (ty < 0 ? -0.5 : 0.5) | 0;
		}
		ctx.transform(mtx.a,  mtx.b, mtx.c, mtx.d, tx, ty);
		ctx.globalAlpha *= o.alpha;
		if (o.compositeOperation) { ctx.globalCompositeOperation = o.compositeOperation; }
		if (o.shadow) { this._applyShadow(ctx, o.shadow); }
	}

	/**
	 * Draws the display object into a new element, which is then used for subsequent draws. Intended for complex content
	 * that does not change frequently (ex. a Container with many children that do not move, or a complex vector Shape),
	 * this can provide for much faster rendering because the content does not need to be re-rendered each tick. The
	 * cached display object can be moved, rotated, faded, etc freely, however if its content changes, you must manually
	 * update the cache by calling <code>updateCache()</code> again. You must specify the cached area via the x, y, w,
	 * and h parameters. This defines the rectangle that will be rendered and cached  using this display object's coordinates.
	 *
	 * <h4>Example</h4>
	 * For example if you defined a Shape that drew a circle at 0, 0 with a radius of 25:
	 *
	 *      var shape = new createjs.Shape();
	 *      shape.graphics.beginFill("#ff0000").drawCircle(0, 0, 25);
	 *      myShape.cache(-25, -25, 50, 50);
	 *
	 * Note that filters need to be defined <em>before</em> the cache is applied or you will have to call updateCache after
	 * application. Check out the {{#crossLink "Filter"}}{{/crossLink}} class for more information. Some filters
	 * (ex. BlurFilter) may not work as expected in conjunction with the scale param.
	 *
	 * Usually, the resulting cacheCanvas will have the dimensions width*scale by height*scale, however some filters (ex. BlurFilter)
	 * will add padding to the canvas dimensions.
	 *
	 * Actual implementation of the caching mechanism can change with a {{#crossLink "StageGL"}}{{/crossLink}} and so
	 * all caching and filter behaviour has been moved to the {{#crossLink "BitmapCache"}}{{/crossLink}}
	 *
	 * @method cache
	 * @param {Number} x The x coordinate origin for the cache region.
	 * @param {Number} y The y coordinate origin for the cache region.
	 * @param {Number} width The width of the cache region.
	 * @param {Number} height The height of the cache region.
	 * @param {Number} [scale=1] The scale at which the cache will be created. For example, if you cache a vector shape using
	 * 	myShape.cache(0,0,100,100,2) then the resulting cacheCanvas will be 200x200 px. This lets you scale and rotate
	 * 	cached elements with greater fidelity. Default is 1.
	 * @param {Object} [options] When using alternate displays there may be extra caching opportunities or needs.
	 */
	cache (x, y, width, height, scale = 1, options) {
		if (!this.bitmapCache) {
			this.bitmapCache = new BitmapCache();
		}
		this.bitmapCache.define(this, x, y, width, height, scale, options);
	}

	/**
	 * Redraws the display object to its cache. Calling updateCache without an active cache will throw an error.
	 * If compositeOperation is null the current cache will be cleared prior to drawing. Otherwise the display object
	 * will be drawn over the existing cache using the specified compositeOperation.
	 *
	 * <h4>Example</h4>
	 * Clear the current graphics of a cached shape, draw some new instructions, and then update the cache. The new line
	 * will be drawn on top of the old one.
	 *
	 *      // Not shown: Creating the shape, and caching it.
	 *      shapeInstance.clear();
	 *      shapeInstance.setStrokeStyle(3).beginStroke("#ff0000").moveTo(100, 100).lineTo(200,200);
	 *      shapeInstance.updateCache();
	 *
	 * Actual implementation of the caching mechanism can change with a {{#crossLink "StageGL"}}{{/crossLink}} and so
	 * all caching and filter behaviour has been moved to the {{#crossLink "BitmapCache"}}{{/crossLink}}
	 *
	 * @method updateCache
	 * @param {String} compositeOperation The compositeOperation to use, or null to clear the cache and redraw it.
	 * <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#compositing">
	 * whatwg spec on compositing</a>.
	 */
	updateCache (compositeOperation) {
		if (!this.bitmapCache) {
			throw "cache() must be called before updateCache()";
		}
		this.bitmapCache.update(compositeOperation);
	}

	/**
	 * Clears the current cache. See {{#crossLink "DisplayObject/cache"}}{{/crossLink}} for more information.
	 * @method uncache
	 */
	uncache () {
		if (this.bitmapCache) {
			this.bitmapCache.release();
			this.bitmapCache = undefined;
		}
	}

	/**
	 * Returns a data URL for the cache, or null if this display object is not cached.
	 * Only generated if the cache has changed, otherwise returns last result.
	 * @method getCacheDataURL
	 * @return {String} The image data url for the cache.
	 */
	getCacheDataURL () {
		return this.bitmapCache ? this.bitmapCache.getDataURL() : null;
	}

	/**
	 * Transforms the specified x and y position from the coordinate space of the display object
	 * to the global (stage) coordinate space. For example, this could be used to position an HTML label
	 * over a specific point on a nested display object. Returns a Point instance with x and y properties
	 * correlating to the transformed coordinates on the stage.
	 *
	 * <h4>Example</h4>
	 *
	 *      displayObject.x = 300;
	 *      displayObject.y = 200;
	 *      stage.addChild(displayObject);
	 *      var point = displayObject.localToGlobal(100, 100);
	 *      // Results in x=400, y=300
	 *
	 * @method localToGlobal
	 * @param {Number} x The x position in the source display object to transform.
	 * @param {Number} y The y position in the source display object to transform.
	 * @param {Point | Object} [pt=Point] An object to copy the result into. If omitted a new Point object with x/y properties will be returned.
	 * @return {Point} A Point instance with x and y properties correlating to the transformed coordinates
	 * on the stage.
	 */
	localToGlobal (x, y, pt = new Point()) {
		return this.getConcatenatedMatrix(this._props.matrix).transformPoint(x, y, pt);
	}

	/**
	 * Transforms the specified x and y position from the global (stage) coordinate space to the
	 * coordinate space of the display object. For example, this could be used to determine
	 * the current mouse position within the display object. Returns a Point instance with x and y properties
	 * correlating to the transformed position in the display object's coordinate space.
	 *
	 * <h4>Example</h4>
	 *
	 *      displayObject.x = 300;
	 *      displayObject.y = 200;
	 *      stage.addChild(displayObject);
	 *      var point = displayObject.globalToLocal(100, 100);
	 *      // Results in x=-200, y=-100
	 *
	 * @method globalToLocal
	 * @param {Number} x The x position on the stage to transform.
	 * @param {Number} y The y position on the stage to transform.
	 * @param {Point | Object} [pt=Point] An object to copy the result into. If omitted a new Point object with x/y properties will be returned.
	 * @return {Point} A Point instance with x and y properties correlating to the transformed position in the
	 * display object's coordinate space.
	 */
	globalToLocal (x, y, pt = new Point()) {
		return this.getConcatenatedMatrix(this._props.matrix).invert().transformPoint(x, y, pt);
	}

	/**
	 * Transforms the specified x and y position from the coordinate space of this display object to the coordinate
	 * space of the target display object. Returns a Point instance with x and y properties correlating to the
	 * transformed position in the target's coordinate space. Effectively the same as using the following code with
	 * {{#crossLink "DisplayObject/localToGlobal"}}{{/crossLink}} and {{#crossLink "DisplayObject/globalToLocal"}}{{/crossLink}}.
	 *
	 *      var pt = this.localToGlobal(x, y);
	 *      pt = target.globalToLocal(pt.x, pt.y);
	 *
	 * @method localToLocal
	 * @param {Number} x The x position in the source display object to transform.
	 * @param {Number} y The y position on the source display object to transform.
	 * @param {DisplayObject} target The target display object to which the coordinates will be transformed.
	 * @param {Point | Object} [pt] An object to copy the result into. If omitted a new Point object with x/y properties will be returned.
	 * @return {Point} Returns a Point instance with x and y properties correlating to the transformed position
	 * in the target's coordinate space.
	 */
	localToLocal (x, y, target, pt) {
		pt = this.localToGlobal(x, y, pt);
		return target.globalToLocal(pt.x, pt.y, pt);
	}

	/**
	 * Shortcut method to quickly set the transform properties on the display object. All parameters are optional.
	 * Omitted parameters will have the default value set.
	 *
	 * <h4>Example</h4>
	 *
	 *      displayObject.setTransform(100, 100, 2, 2);
	 *
	 * @method setTransform
	 * @param {Number} [x=0] The horizontal translation (x position) in pixels
	 * @param {Number} [y=0] The vertical translation (y position) in pixels
	 * @param {Number} [scaleX=1] The horizontal scale, as a percentage of 1
	 * @param {Number} [scaleY=1] the vertical scale, as a percentage of 1
	 * @param {Number} [rotation=0] The rotation, in degrees
	 * @param {Number} [skewX=0] The horizontal skew factor
	 * @param {Number} [skewY=0] The vertical skew factor
	 * @param {Number} [regX=0] The horizontal registration point in pixels
	 * @param {Number} [regY=0] The vertical registration point in pixels
	 * @return {DisplayObject} Returns this instance. Useful for chaining commands.
	 * @chainable
	*/
	setTransform (x=0, y=0, scaleX=1, scaleY=1, rotation=0, skewX=0, skewY=0, regX=0, regY=0) {
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

	/**
	 * Returns a matrix based on this object's current transform.
	 * @method getMatrix
	 * @param {Matrix2D} [matrix] A Matrix2D object to populate with the calculated values. If null, a new
	 * Matrix object is returned.
	 * @return {Matrix2D} A matrix representing this display object's transform.
	 */
	getMatrix (matrix) {
		let o = this, mtx = matrix&&matrix.identity() || new Matrix2D();
		return o.transformMatrix ?  mtx.copy(o.transformMatrix) : mtx.appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY);
	}

	/**
	 * Generates a Matrix2D object representing the combined transform of the display object and all of its
	 * parent Containers up to the highest level ancestor (usually the {{#crossLink "Stage"}}{{/crossLink}}). This can
	 * be used to transform positions between coordinate spaces, such as with {{#crossLink "DisplayObject/localToGlobal"}}{{/crossLink}}
	 * and {{#crossLink "DisplayObject/globalToLocal"}}{{/crossLink}}.
	 * @method getConcatenatedMatrix
	 * @param {Matrix2D} [matrix] A {{#crossLink "Matrix2D"}}{{/crossLink}} object to populate with the calculated values.
	 * If null, a new Matrix2D object is returned.
	 * @return {Matrix2D} The combined matrix.
	 */
	getConcatenatedMatrix (matrix) {
		let o = this, mtx = this.getMatrix(matrix);
		while (o = o.parent) {
			mtx.prependMatrix(o.getMatrix(o._props.matrix));
		}
		return mtx;
	}

	/**
	 * Generates a DisplayProps object representing the combined display properties of the  object and all of its
	 * parent Containers up to the highest level ancestor (usually the {{#crossLink "Stage"}}{{/crossLink}}).
	 * @method getConcatenatedDisplayProps
	 * @param {DisplayProps} [props] A {{#crossLink "DisplayProps"}}{{/crossLink}} object to populate with the calculated values.
	 * If null, a new DisplayProps object is returned.
	 * @return {DisplayProps} The combined display properties.
	 */
	getConcatenatedDisplayProps (props) {
		props = props ? props.identity() : new DisplayProps();
		let o = this, mtx = o.getMatrix(props.matrix);
		do {
			props.prepend(o.visible, o.alpha, o.shadow, o.compositeOperation);

			// we do this to avoid problems with the matrix being used for both operations when o._props.matrix is passed in as the props param.
			// this could be simplified (ie. just done as part of the prepend above) if we switched to using a pool.
			if (o != this) { mtx.prependMatrix(o.getMatrix(o._props.matrix)); }
		} while (o = o.parent);
		return props;
	}

	/**
	 * Tests whether the display object intersects the specified point in local coordinates (ie. draws a pixel with alpha > 0 at
	 * the specified position). This ignores the alpha, shadow, hitArea, mask, and compositeOperation of the display object.
	 *
	 * <h4>Example</h4>
	 *
	 *      stage.addEventListener("stagemousedown", handleMouseDown);
	 *      function handleMouseDown(event) {
	 *          var hit = myShape.hitTest(event.stageX, event.stageY);
	 *      }
	 *
	 * Please note that shape-to-shape collision is not currently supported by EaselJS.
	 * @method hitTest
	 * @param {Number} x The x position to check in the display object's local coordinates.
	 * @param {Number} y The y position to check in the display object's local coordinates.
	 * @return {Boolean} A Boolean indicating whether a visible portion of the DisplayObject intersect the specified
	 * local Point.
	*/
	hitTest (x, y) {
		let ctx = DisplayObject._hitTestContext;
		ctx.setTransform(1, 0, 0, 1, -x, -y);
		this.draw(ctx);

		let hit = this._testHit(ctx);
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, 2, 2);
		return hit;
	}

	/**
	 * Provides a chainable shortcut method for setting a number of properties on the instance.
	 *
	 * <h4>Example</h4>
	 *
	 *      var myGraphics = new createjs.Graphics().beginFill("#ff0000").drawCircle(0, 0, 25);
	 *      var shape = stage.addChild(new Shape()).set({graphics:myGraphics, x:100, y:100, alpha:0.5});
	 *
	 * @method set
	 * @param {Object} props A generic object containing properties to copy to the DisplayObject instance.
	 * @return {DisplayObject} Returns the instance the method is called on (useful for chaining calls.)
	 * @chainable
	*/
	set (props) {
		for (let n in props) { this[n] = props[n]; }
		return this;
	}

	/**
	 * Returns a rectangle representing this object's bounds in its local coordinate system (ie. with no transformation).
	 * Objects that have been cached will return the bounds of the cache.
	 *
	 * Not all display objects can calculate their own bounds (ex. Shape). For these objects, you can use
	 * {{#crossLink "DisplayObject/setBounds"}}{{/crossLink}} so that they are included when calculating Container
	 * bounds.
	 *
	 * <table>
	 * 	<tr><td><b>All</b></td><td>
	 * 		All display objects support setting bounds manually using setBounds(). Likewise, display objects that
	 * 		have been cached using cache() will return the bounds of their cache. Manual and cache bounds will override
	 * 		the automatic calculations listed below.
	 * 	</td></tr>
	 * 	<tr><td><b>Bitmap</b></td><td>
	 * 		Returns the width and height of the sourceRect (if specified) or image, extending from (x=0,y=0).
	 * 	</td></tr>
	 * 	<tr><td><b>Sprite</b></td><td>
	 * 		Returns the bounds of the current frame. May have non-zero x/y if a frame registration point was specified
	 * 		in the spritesheet data. See also {{#crossLink "SpriteSheet/getFrameBounds"}}{{/crossLink}}
	 * 	</td></tr>
	 * 	<tr><td><b>Container</b></td><td>
	 * 		Returns the aggregate (combined) bounds of all children that return a non-null value from getBounds().
	 * 	</td></tr>
	 * 	<tr><td><b>Shape</b></td><td>
	 * 		Does not currently support automatic bounds calculations. Use setBounds() to manually define bounds.
	 * 	</td></tr>
	 * 	<tr><td><b>Text</b></td><td>
	 * 		Returns approximate bounds. Horizontal values (x/width) are quite accurate, but vertical values (y/height) are
	 * 		not, especially when using textBaseline values other than "top".
	 * 	</td></tr>
	 * 	<tr><td><b>BitmapText</b></td><td>
	 * 		Returns approximate bounds. Values will be more accurate if spritesheet frame registration points are close
	 * 		to (x=0,y=0).
	 * 	</td></tr>
	* </table>
	 *
	 * Bounds can be expensive to calculate for some objects (ex. text, or containers with many children), and
	 * are recalculated each time you call getBounds(). You can prevent recalculation on static objects by setting the
	 * bounds explicitly:
	 *
	 * 	var bounds = obj.getBounds();
	 * 	obj.setBounds(bounds.x, bounds.y, bounds.width, bounds.height);
	 * 	// getBounds will now use the set values, instead of recalculating
	 *
	 * To reduce memory impact, the returned Rectangle instance may be reused internally; clone the instance or copy its
	 * values if you need to retain it.
	 *
	 * 	var myBounds = obj.getBounds().clone();
	 * 	// OR:
	 * 	myRect.copy(obj.getBounds());
	 *
	 * @method getBounds
	 * @return {Rectangle} A Rectangle instance representing the bounds, or null if bounds are not available for this
	 * object.
	 */
	getBounds () {
		if (this._bounds) { return this._rectangle.copy(this._bounds); }
		let cacheCanvas = this.cacheCanvas;
		if (cacheCanvas) {
			let scale = this._cacheScale;
			return this._rectangle.setValues(this._cacheOffsetX, this._cacheOffsetY, cacheCanvas.width/scale, cacheCanvas.height/scale);
		}
		return null;
	}

	/**
	 * Returns a rectangle representing this object's bounds in its parent's coordinate system (ie. with transformations applied).
	 * Objects that have been cached will return the transformed bounds of the cache.
	 *
	 * Not all display objects can calculate their own bounds (ex. Shape). For these objects, you can use
	 * {{#crossLink "DisplayObject/setBounds"}}{{/crossLink}} so that they are included when calculating Container
	 * bounds.
	 *
	 * To reduce memory impact, the returned Rectangle instance may be reused internally; clone the instance or copy its
	 * values if you need to retain it.
	 *
	 * Container instances calculate aggregate bounds for all children that return bounds via getBounds.
	 * @method getTransformedBounds
	 * @return {Rectangle} A Rectangle instance representing the bounds, or null if bounds are not available for this object.
	 */
	getTransformedBounds () {
		return this._getBounds();
	}

	/**
	 * Allows you to manually specify the bounds of an object that either cannot calculate their own bounds (ex. Shape &
	 * Text) for future reference, or so the object can be included in Container bounds. Manually set bounds will always
	 * override calculated bounds.
	 *
	 * The bounds should be specified in the object's local (untransformed) coordinates. For example, a Shape instance
	 * with a 25px radius circle centered at 0,0 would have bounds of (-25, -25, 50, 50).
	 * @method setBounds
	 * @param {Number} x The x origin of the bounds. Pass null to remove the manual bounds.
	 * @param {Number} y The y origin of the bounds.
	 * @param {Number} width The width of the bounds.
	 * @param {Number} height The height of the bounds.
	 */
	setBounds (x, y, width, height) {
		if (x == null) { this._bounds = x; }
		this._bounds = (this._bounds || new Rectangle()).setValues(x, y, width, height);
	}

	/**
	 * Returns a clone of this DisplayObject. Some properties that are specific to this instance's current context are
	 * reverted to their defaults (for example .parent). Caches are not maintained across clones, and some elements
	 * are copied by reference (masks, individual filter instances, hit area)
	 * @method clone
	 * @return {DisplayObject} A clone of the current DisplayObject instance.
	 */
	clone () {
		return this._cloneProps(new DisplayObject());
	}

	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 */
	toString () {
		return `[${this.constructor.name}${this.name ? ` (name=${this.name})` : ""}]`;
	}


// private methods:
	// separated so it can be used more easily in subclasses:
	/**
	 * @method _cloneProps
	 * @param {DisplayObject} o The DisplayObject instance which will have properties from the current DisplayObject
	 * instance copied into.
	 * @return {DisplayObject} o
	 * @protected
	 */
	_cloneProps (o) {
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
		o.x  = this.x;
		o.y = this.y;
		o.compositeOperation = this.compositeOperation;
		o.snapToPixel = this.snapToPixel;
		o.filters = this.filters==null?null:this.filters.slice(0);
		o.mask = this.mask;
		o.hitArea = this.hitArea;
		o.cursor = this.cursor;
		o._bounds = this._bounds;
		return o;
	}

	/**
	 * @method _applyShadow
	 * @protected
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {Shadow} [shadow=Shadow]
	 */
	_applyShadow (ctx, shadow = Shadow.identity) {
		shadow = shadow;
		ctx.shadowColor = shadow.color;
		ctx.shadowOffsetX = shadow.offsetX;
		ctx.shadowOffsetY = shadow.offsetY;
		ctx.shadowBlur = shadow.blur;
	}

	/**
	 * @method _tick
	 * @param {Object} evtObj An event object that will be dispatched to all tick listeners. This object is reused between dispatchers to reduce construction & GC costs.
	 * @protected
	 */
	_tick (evtObj) {
		// because tick can be really performance sensitive, check for listeners before calling dispatchEvent.
		let ls = this._listeners;
		if (ls && ls["tick"]) {
			// reset & reuse the event object to avoid construction / GC costs:
			evtObj.target = null;
			evtObj.propagationStopped = evtObj.immediatePropagationStopped = false;
			this.dispatchEvent(evtObj);
		}
	}

	/**
	 * @method _testHit
	 * @protected
	 * @param {CanvasRenderingContext2D} ctx
	 * @return {Boolean}
	 */
	_testHit (ctx) {
		try {
			return ctx.getImageData(0, 0, 1, 1).data[3] > 1;
		} catch (e) {
			if (!DisplayObject.suppressCrossDomainErrors) {
				throw "An error has occurred. This is most likely due to security restrictions on reading canvas pixel data with local or cross-domain images.";
			}
			return false;
		}
	}

	/**
	 * @method _getBounds
	 * @param {Matrix2D} matrix
	 * @param {Boolean} ignoreTransform If true, does not apply this object's transform.
	 * @return {Rectangle}
	 * @protected
	 */
	_getBounds (matrix, ignoreTransform) {
		return this._transformBounds(this.getBounds(), matrix, ignoreTransform);
	}

	/**
	 * @method _transformBounds
	 * @param {Rectangle} bounds
	 * @param {Matrix2D} matrix
	 * @param {Boolean} ignoreTransform
	 * @return {Rectangle}
	 * @protected
	 */
	_transformBounds (bounds, matrix, ignoreTransform) {
		if (!bounds) { return bounds; }
		let { x, y, width, height } = bounds;
		let mtx = this._props.matrix;
		mtx = ignoreTransform ? mtx.identity() : this.getMatrix(mtx);

		if (x || y) { mtx.appendTransform(0,0,1,1,0,0,0,-x,-y); } // TODO: simplify this.
		if (matrix) { mtx.prependMatrix(matrix); }

		let x_a = width*mtx.a, x_b = width*mtx.b;
		let y_c = height*mtx.c, y_d = height*mtx.d;
		let tx = mtx.tx, ty = mtx.ty;

		let minX = tx, maxX = tx, minY = ty, maxY = ty;

		if ((x = x_a + tx) < minX) { minX = x; } else if (x > maxX) { maxX = x; }
		if ((x = x_a + y_c + tx) < minX) { minX = x; } else if (x > maxX) { maxX = x; }
		if ((x = y_c + tx) < minX) { minX = x; } else if (x > maxX) { maxX = x; }

		if ((y = x_b + ty) < minY) { minY = y; } else if (y > maxY) { maxY = y; }
		if ((y = x_b + y_d + ty) < minY) { minY = y; } else if (y > maxY) { maxY = y; }
		if ((y = y_d + ty) < minY) { minY = y; } else if (y > maxY) { maxY = y; }

		return bounds.setValues(minX, minY, maxX-minX, maxY-minY);
	}

	/**
	 * Indicates whether the display object has any mouse event listeners or a cursor.
	 * @method _hasMouseEventListener
	 * @return {Boolean}
	 * @protected
	 */
	_hasMouseEventListener () {
		let evts = DisplayObject._MOUSE_EVENTS;
		for (let i=0, l=evts.length; i<l; i++) {
			if (this.hasEventListener(evts[i])) { return true; }
		}
		return !!this.cursor;
	}

}

// static properties:
/**
 * Listing of mouse event names. Used in _hasMouseEventListener.
 * @property _MOUSE_EVENTS
 * @protected
 * @static
 * @type {Array}
 * @readonly
 */

/**
 * Suppresses errors generated when using features like hitTest, mouse events, and {{#crossLink "getObjectsUnderPoint"}}{{/crossLink}}
 * with cross domain content.
 * @property suppressCrossDomainErrors
 * @static
 * @type {Boolean}
 * @default false
 */
/**
 * @property _snapToPixelEnabled
 * @protected
 * @static
 * @type {Boolean}
 * @default false
 */
/**
 * @property _hitTestCanvas
 * @type {HTMLCanvasElement | Object}
 * @static
 * @protected
 */
/**
 * @property _hitTestContext
 * @type {CanvasRenderingContext2D}
 * @static
 * @protected
 */
{
	let canvas = createjs && createjs.createCanvas?createjs.createCanvas():document.createElement("canvas"); // prevent errors on load in browsers without canvas.
	if (canvas.getContext) {
		DisplayObject._hitTestCanvas = canvas;
		DisplayObject._hitTestContext = canvas.getContext("2d");
		canvas.width = canvas.height = 1;
	}
	// ES6 does not support static properties, this is a work around.
	DisplayObject._MOUSE_EVENTS = ["click","dblclick","mousedown","mouseout","mouseover","pressmove","pressup","rollout","rollover"];
	DisplayObject.suppressCrossDomainErrors = false;
	DisplayObject.snapToPixelEnabled = false;
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

/*
* @license Container
* Visit http://createjs.com/ for documentation, updates and examples.
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
 * @module EaselJS
 */
class Container extends DisplayObject {

// constructor:
	/**
	 * @constructor
	 */
	constructor () {
		super();

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
		this.children = [];

		/**
		 * Indicates whether the children of this container are independently enabled for mouse/pointer interaction.
		 * If false, the children will be aggregated under the container - for example, a click on a child shape would
		 * trigger a click event on the container.
		 * @property mouseChildren
		 * @type Boolean
		 * @default true
		 */
		this.mouseChildren = true;

		/**
		 * If false, the tick will not be propagated to children of this Container. This can provide some performance benefits.
		 * In addition to preventing the "tick" event from being dispatched, it will also prevent tick related updates
		 * on some display objects (ex. Sprite & MovieClip frame advancing, DOMElement visibility handling).
		 * @property tickChildren
		 * @type Boolean
		 * @default true
		 */
		this.tickChildren = true;
		}

// accessor properties:
	/**
	 * Returns the number of children in the container.
	 * @property numChildren
	 * @type {Number}
	 * @readonly
	 */
	get numChildren () {
		return this.children.length;
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
	isVisible () {
		let hasContent = this.cacheCanvas || this.children.length;
		return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent);
	}

	/**
	 * Draws the display object into the specified context ignoring its visible, alpha, shadow, and transform.
	 * Returns true if the draw was handled (useful for overriding functionality).
	 *
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method draw
	 * @param {CanvasRenderingContext2D} ctx The canvas 2D context object to draw into.
	 * @param {Boolean} [ignoreCache=false] Indicates whether the draw operation should ignore any current cache.
	 * For example, used for drawing the cache (to prevent it from simply drawing an existing cache back
	 * into itself).
	 */
	draw (ctx, ignoreCache = false) {
		if (super.draw(ctx, ignoreCache)) { return true; }

		// this ensures we don't have issues with display list changes that occur during a draw:
		let list = this.children.slice();
		for (let i=0,l=list.length; i<l; i++) {
			let child = list[i];
			if (!child.isVisible()) { continue; }

			// draw the child:
			ctx.save();
			child.updateContext(ctx);
			child.draw(ctx);
			ctx.restore();
		}
		return true;
	}

	/**
	 * Adds a child to the top of the display list.
	 *
	 * <h4>Example</h4>
	 *
	 * 		container.addChild(bitmapInstance);
	 *
	 * You can also add multiple children at once:
	 *
	 * 		container.addChild(bitmapInstance, shapeInstance, textInstance);
	 *
	 * @method addChild
	 * @param {...DisplayObject} children The display object(s) to add.
	 * @return {DisplayObject} The child that was added, or the last child if multiple children were added.
	 */
	addChild (...children) {
		const l = children.length;
		if (l === 0) { return null; }
		let child = children[0];
		if (l > 1) {
			for (let i = 0; i < l; i++) { child = this.addChild(children[i]); }
			return child;
		}
		if (child.parent) { child.parent.removeChild(child); }
		child.parent = this;
		this.children.push(child);
		child.dispatchEvent("added");
		return child;
	}
	/*
	TODO-ES6: Perf test rest param loops vs arguments.
	addChild (...children) {
		const l = children.length;
		if (l === 0) { return null; }
		let child;
		for (let i = 0; i < l; i++) {
			child = children[0];
			if (child.parent) { child.parent.removeChild(child); }
			child.parent = this;
			this.children.push(child);
			child.dispatchEvent("added");
		}
		return child;
	}*/

	/**
	 * Adds a child to the display list at the specified index, bumping children at equal or greater indexes up one, and
	 * setting its parent to this Container.
	 *
	 * <h4>Example</h4>
	 *
	 *      addChildAt(child1, index);
	 *
	 * You can also add multiple children, such as:
	 *
	 *      addChildAt(child1, child2, ..., index);
	 *
	 * The index must be between 0 and numChildren. For example, to add myShape under otherShape in the display list,
	 * you could use:
	 *
	 *      container.addChildAt(myShape, container.getChildIndex(otherShape));
	 *
	 * This would also bump otherShape's index up by one. Fails silently if the index is out of range.
	 *
	 * @method addChildAt
	 * @param {...DisplayObject} children The display object(s) to add.
	 * @param {Number} index The index to add the child at.
	 * @return {DisplayObject} Returns the last child that was added, or the last child if multiple children were added.
	 */
	addChildAt(...children) {
		let index = children.pop();
		const l = children.length;
		if (index < 0 || index > this.children.length) { return children[l-2]; }
		if (l > 2) {
			for (let i = 0; i < l - 1; i++) { this.addChildAt(children[i], index++); }
			return children[l - 2];
		}
		let child = children[0];
		if (child.parent) { child.parent.removeChild(child); }
		child.parent = this;
		this.children.splice(index++, 0, child);
		child.dispatchEvent("added");
		return child;
	}
	/*
	addChildAt (...children) {
		let index = children.pop();
		const l = children.length;
		if (index < 0 || index > this.children.length) { return children[l-2]; }
		let child;
		for (let i = 0; i < l; i++) {
			child = children[i];
			if (child.parent) { child.parent.removeChild(child); }
			child.parent = this;
			this.children.splice(index++, 0, child);
			child.dispatchEvent("added");
		}
		return child;
	}
	*/

	/**
	 * Removes the specified child from the display list. Note that it is faster to use removeChildAt() if the index is
	 * already known.
	 *
	 * <h4>Example</h4>
	 *
	 *      container.removeChild(child);
	 *
	 * You can also remove multiple children:
	 *
	 *      removeChild(child1, child2, ...);
	 *
	 * Returns true if the child (or children) was removed, or false if it was not in the display list.
	 * @method removeChild
	 * @param {DisplayObject} children The display object(s) to remove.
	 * @return {Boolean} true if the child (or children) was removed, or false if it was not in the display list.
	 */
	removeChild (...children) {
		const l = children.length;
		if (l > 1) {
			let good = true;
			for (let i = 0; i < l; i++) { good = good && this.removeChild(children[i]); }
			return good;
		}
		return this.removeChildAt(this.children.indexOf(children[0]));
	}
  /*
	removeChild(...children) {
		const l = children.length;
		let good = true;
		let child;
		for (let i = 0; i < l; i++) {
			good = good && this.removeChildAt(this.children.indexOf(children[i]));
		}
		return good;
	}
  */

	/**
	 * Removes the child at the specified index from the display list, and sets its parent to null.
	 *
	 * <h4>Example</h4>
	 *
	 *      container.removeChildAt(2);
	 *
	 * You can also remove multiple children:
	 *
	 *      container.removeChild(2, 7, ...)
	 *
	 * Returns true if the child (or children) was removed, or false if any index was out of range.
	 * @method removeChildAt
	 * @param {...Number} index The index of the child to remove.
	 * @return {Boolean} true if the child (or children) was removed, or false if any index was out of range.
	 */
	removeChildAt (...indexes) {
		const l = indexes.length;
		if (l > 1) {
			indexes.sort((a, b) => b - a);
			let good = true;
			for (let i = 0; i < l; i++) { good = good && this.removeChildAt(indexes[i]); }
			return good;
		}
		let index = indexes[0];
		if (index < 0 || index > this.children.length - 1) { return false; }
		let child = this.children[index];
		if (child) { child.parent = null; }
		this.children.splice(index, 1);
		child.dispatchEvent("removed");
		return true;
	}
	/*
	removeChildAt (...indexes) {
		const l = indexes.length;
		if (l > 1) { indexes.sort((a, b) => b - a); }
		let good = true;
		for (let i = 0; i < l; i++) {
			let index = indexes[0];
			if (index < 0 || index > this.children.length - 1) {
				good = false;
				continue;
			}
			let child = this.children[index];
			if (child) { child.parent = null; }
			this.children.splice(index, 1);
			child.dispatchEvent("removed");
		}
		return good;
	}
	*/

	/**
	 * Removes all children from the display list.
	 *
	 * <h4>Example</h4>
	 *
	 * 	container.removeAllChildren();
	 *
	 * @method removeAllChildren
	 */
	removeAllChildren () {
		let kids = this.children;
		while (kids.length) { this.removeChildAt(0); }
	}

	/**
	 * Returns the child at the specified index.
	 *
	 * <h4>Example</h4>
	 *
	 *      container.getChildAt(2);
	 *
	 * @method getChildAt
	 * @param {Number} index The index of the child to return.
	 * @return {DisplayObject} The child at the specified index. Returns null if there is no child at the index.
	 */
	getChildAt (index) {
		return this.children[index];
	}

	/**
	 * Returns the child with the specified name.
	 * @method getChildByName
	 * @param {String} name The name of the child to return.
	 * @return {DisplayObject} The child with the specified name.
	 */
	getChildByName (name) {
		let kids = this.children;
		const l = kids.length;
		for (let i = 0; i < l; i++) {
			if (kids[i].name === name) { return kids[i]; }
		}
		return null;
	}

	/**
	 * Performs an array sort operation on the child list.
	 *
	 * <h4>Example: Display children with a higher y in front.</h4>
	 *
	 *      var sortFunction = function(obj1, obj2, options) {
	 *          if (obj1.y > obj2.y) { return 1; }
	 *          if (obj1.y < obj2.y) { return -1; }
	 *          return 0;
	 *      }
	 *      container.sortChildren(sortFunction);
	 *
	 * @method sortChildren
	 * @param {Function} sortFunction the function to use to sort the child list. See JavaScript's <code>Array.sort</code>
	 * documentation for details.
	 */
	sortChildren (sortFunction) {
		this.children.sort(sortFunction);
	}

	/**
	 * Returns the index of the specified child in the display list, or -1 if it is not in the display list.
	 *
	 * <h4>Example</h4>
	 *
	 *      var index = container.getChildIndex(child);
	 *
	 * @method getChildIndex
	 * @param {DisplayObject} child The child to return the index of.
	 * @return {Number} The index of the specified child. -1 if the child is not found.
	 */
	getChildIndex (child) {
		return this.children.indexOf(child);
	}

	/**
	 * Swaps the children at the specified indexes. Fails silently if either index is out of range.
	 * @method swapChildrenAt
	 * @param {Number} index1
	 * @param {Number} index2
	 */
	swapChildrenAt (index1, index2) {
		let kids = this.children;
		let o1 = kids[index1];
		let o2 = kids[index2];
		if (!o1 || !o2) { return; }
		kids[index1] = o2;
		kids[index2] = o1;
	};

	/**
	 * Swaps the specified children's depth in the display list. Fails silently if either child is not a child of this
	 * Container.
	 * @method swapChildren
	 * @param {DisplayObject} child1
	 * @param {DisplayObject} child2
	 */
	swapChildren (child1, child2) {
		let kids = this.children;
		const l = kids.length;
		let index1,index2;
		for (var i = 0; i < l; i++) {
			if (kids[i] === child1) { index1 = i; }
			if (kids[i] === child2) { index2 = i; }
			if (index1 != null && index2 != null) { break; }
		}
		if (i === l) { return; } // TODO: throw error?
		kids[index1] = child2;
		kids[index2] = child1;
	}

	/**
	 * Changes the depth of the specified child. Fails silently if the child is not a child of this container, or the index is out of range.
	 * @param {DisplayObject} child
	 * @param {Number} index
	 * @method setChildIndex
	 */
	setChildIndex (child, index) {
		let kids = this.children;
		const l = kids.length;
		if (child.parent != this || index < 0 || index >= l) { return; }
		for (var i = 0; i < l; i++) {
			if (kids[i] === child) { break; }
		}
		if (i === l || i === index) { return; }
		kids.splice(i, 1);
		kids.splice(index, 0, child);
	}

	/**
	 * Returns true if the specified display object either is this container or is a descendent (child, grandchild, etc)
	 * of this container.
	 * @method contains
	 * @param {DisplayObject} child The DisplayObject to be checked.
	 * @return {Boolean} true if the specified display object either is this container or is a descendent.
	 */
	contains (child) {
		while (child) {
			if (child === this) { return true; }
			child = child.parent;
		}
		return false;
	}

	/**
	 * Tests whether the display object intersects the specified local point (ie. draws a pixel with alpha > 0 at the
	 * specified position). This ignores the alpha, shadow and compositeOperation of the display object, and all
	 * transform properties including regX/Y.
	 * @method hitTest
	 * @param {Number} x The x position to check in the display object's local coordinates.
	 * @param {Number} y The y position to check in the display object's local coordinates.
	 * @return {Boolean} A Boolean indicating whether there is a visible section of a DisplayObject that overlaps the specified
	 * coordinates.
	 */
	hitTest (x, y) {
		// TODO: optimize to use the fast cache check where possible.
		return this.getObjectUnderPoint(x, y) != null;
	}

	/**
	 * Returns an array of all display objects under the specified coordinates that are in this container's display
	 * list. This routine ignores any display objects with {{#crossLink "DisplayObject/mouseEnabled:property"}}{{/crossLink}}
	 * set to `false`. The array will be sorted in order of visual depth, with the top-most display object at index 0.
	 * This uses shape based hit detection, and can be an expensive operation to run, so it is best to use it carefully.
	 * For example, if testing for objects under the mouse, test on tick (instead of on {{#crossLink "DisplayObject/mousemove:event"}}{{/crossLink}}),
	 * and only if the mouse's position has changed.
	 *
	 * <ul>
	 *     <li>By default (mode=0) this method evaluates all display objects.</li>
	 *     <li>By setting the `mode` parameter to `1`, the {{#crossLink "DisplayObject/mouseEnabled:property"}}{{/crossLink}}
	 * 		and {{#crossLink "mouseChildren:property"}}{{/crossLink}} properties will be respected.</li>
	 * 	   <li>Setting the `mode` to `2` additionally excludes display objects that do not have active mouse event
	 * 	   	listeners or a {{#crossLink "DisplayObject:cursor:property"}}{{/crossLink}} property. That is, only objects
	 * 	   	that would normally intercept mouse interaction will be included. This can significantly improve performance
	 * 	   	in some cases by reducing the number of display objects that need to be tested.</li>
	 * </li>
	 *
	 * This method accounts for both {{#crossLink "DisplayObject/hitArea:property"}}{{/crossLink}} and {{#crossLink "DisplayObject/mask:property"}}{{/crossLink}}.
	 * @method getObjectsUnderPoint
	 * @param {Number} x The x position in the container to test.
	 * @param {Number} y The y position in the container to test.
	 * @param {Number} [mode=0] The mode to use to determine which display objects to include. 0-all, 1-respect mouseEnabled/mouseChildren, 2-only mouse opaque objects.
	 * @return {Array} An Array of DisplayObjects under the specified coordinates.
	 */
	getObjectsUnderPoint (x, y, mode = 0) {
		let arr = [];
		let pt = this.localToGlobal(x, y);
		this._getObjectsUnderPoint(pt.x, pt.y, arr, mode > 0, mode === 1);
		return arr;
	}

	/**
	 * Similar to {{#crossLink "Container/getObjectsUnderPoint"}}{{/crossLink}}, but returns only the top-most display
	 * object. This runs significantly faster than <code>getObjectsUnderPoint()</code>, but is still potentially an expensive
	 * operation. See {{#crossLink "Container/getObjectsUnderPoint"}}{{/crossLink}} for more information.
	 * @method getObjectUnderPoint
	 * @param {Number} x The x position in the container to test.
	 * @param {Number} y The y position in the container to test.
	 * @param {Number} [mode=0] The mode to use to determine which display objects to include.  0-all, 1-respect mouseEnabled/mouseChildren, 2-only mouse opaque objects.
	 * @return {DisplayObject} The top-most display object under the specified coordinates.
	 */
	getObjectUnderPoint (x, y, mode = 0) {
		let pt = this.localToGlobal(x, y);
		return this._getObjectsUnderPoint(pt.x, pt.y, null, mode > 0, mode === 1);
	}

	/**
	 * Docced in superclass.
	 */
	getBounds () {
		return this._getBounds(null, true);
	}


	/**
	 * Docced in superclass.
	 */
	getTransformedBounds () {
		return this._getBounds();
	}

	/**
	 * Returns a clone of this Container. Some properties that are specific to this instance's current context are
	 * reverted to their defaults (for example .parent).
	 * @method clone
	 * @param {Boolean} [recursive=false] If true, all of the descendants of this container will be cloned recursively. If false, the
	 * properties of the container will be cloned, but the new instance will not have any children.
	 * @return {Container} A clone of the current Container instance.
	 */
	clone (recursive = false) {
		let o = this._cloneProps(new Container());
		if (recursive) { this._cloneChildren(o); }
		return o;
	}

// private methods:
	/**
	 * @method _tick
	 * @param {Object} evtObj An event object that will be dispatched to all tick listeners. This object is reused between dispatchers to reduce construction & GC costs.
	 * @protected
	 */
	_tick (evtObj) {
		if (this.tickChildren) {
			for (let i = this.children.length - 1; i >= 0; i--) {
				let child = this.children[i];
				if (child.tickEnabled && child._tick) { child._tick(evtObj); }
			}
		}
		super._tick(evtObj);
	}

	/**
	 * Recursively clones all children of this container, and adds them to the target container.
	 * @method cloneChildren
	 * @protected
	 * @param {Container} o The target container.
	 */
	_cloneChildren (o) {
		if (o.children.length) { o.removeAllChildren(); }
		let arr = o.children;
		const l = this.children.length;
		for (let i = 0; i < l; i++) {
			let clone = this.children[i].clone(true);
			clone.parent = o;
			arr.push(clone);
		}
	}

	/**
	 * @method _getObjectsUnderPoint
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Array} arr
	 * @param {Boolean} mouse If true, it will respect mouse interaction properties like mouseEnabled, mouseChildren, and active listeners.
	 * @param {Boolean} activeListener If true, there is an active mouse event listener on a parent object.
	 * @param {Number} [currentDepth=0] Indicates the current depth of the search.
	 * @return {DisplayObject}
	 * @protected
	 */
	_getObjectsUnderPoint (x, y, arr, mouse, activeListener, currentDepth = 0) {
		if (!currentDepth && !this._testMask(this, x, y)) { return null; }
		let mtx, ctx = DisplayObject._hitTestContext;
		activeListener = activeListener || (mouse && this._hasMouseEventListener());

		// draw children one at a time, and check if we get a hit:
		let children = this.children;
		const l = children.length;
		for (let i = l - 1; i >= 0; i--) {
			let child = children[i];
			let hitArea = child.hitArea;
			if (!child.visible || (!hitArea && !child.isVisible()) || (mouse && !child.mouseEnabled)) { continue; }
			if (!hitArea && !this._testMask(child, x, y)) { continue; }

			// if a child container has a hitArea then we only need to check its hitArea, so we can treat it as a normal DO:
			if (!hitArea && child instanceof Container) {
				let result = child._getObjectsUnderPoint(x, y, arr, mouse, activeListener, currentDepth + 1);
				if (!arr && result) { return (mouse && !this.mouseChildren) ? this : result; }
			} else {
				if (mouse && !activeListener && !child._hasMouseEventListener()) { continue; }

				// TODO: can we pass displayProps forward, to avoid having to calculate this backwards every time? It's kind of a mixed bag. When we're only hunting for DOs with event listeners, it may not make sense.
				let props = child.getConcatenatedDisplayProps(child._props);
				mtx = props.matrix;

				if (hitArea) {
					mtx.appendMatrix(hitArea.getMatrix(hitArea._props.matrix));
					props.alpha = hitArea.alpha;
				}

				ctx.globalAlpha = props.alpha;
				ctx.setTransform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx-x, mtx.ty-y);
				(hitArea || child).draw(ctx);
				if (!this._testHit(ctx)) { continue; }
				ctx.setTransform(1, 0, 0, 1, 0, 0);
				ctx.clearRect(0, 0, 2, 2);
				if (arr) { arr.push(child); }
				else { return (mouse && !this.mouseChildren) ? this : child; }
			}
		}
		return null;
	}

	/**
	 * @method _testMask
	 * @param {DisplayObject} target
	 * @param {Number} x
	 * @param {Number} y
	 * @return {Boolean} Indicates whether the x/y is within the masked region.
	 * @protected
	 */
	_testMask (target, x, y) {
		let mask = target.mask;
		if (!mask || !mask.graphics || mask.graphics.isEmpty()) { return true; }

		let mtx = this._props.matrix, parent = target.parent;
		mtx = parent ? parent.getConcatenatedMatrix(mtx) : mtx.identity();
		mtx = mask.getMatrix(mask._props.matrix).prependMatrix(mtx);

		let ctx = DisplayObject._hitTestContext;
		ctx.setTransform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx-x, mtx.ty-y);

		// draw the mask as a solid fill:
		mask.graphics.drawAsPath(ctx);
		ctx.fillStyle = "#000";
		ctx.fill();

		if (!this._testHit(ctx)) { return false; }
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, 2, 2);

		return true;
	}

	/**
	 * @method _getBounds
	 * @param {Matrix2D} matrix
	 * @param {Boolean} ignoreTransform If true, does not apply this object's transform.
	 * @return {Rectangle}
	 * @protected
	 */
	_getBounds (matrix, ignoreTransform) {
		let bounds = super.getBounds();
		if (bounds) { return this._transformBounds(bounds, matrix, ignoreTransform); }

		let mtx = this._props.matrix;
		mtx = ignoreTransform ? mtx.identity() : this.getMatrix(mtx);
		if (matrix) { mtx.prependMatrix(matrix); }

		const l = this.children.length;
		let rect = null;
		for (let i = 0; i < l; i++) {
			let child = this.children[i];
			if (!child.visible || !(bounds = child._getBounds(mtx))) { continue; }
			if (rect) { rect.extend(bounds.x, bounds.y, bounds.width, bounds.height); }
			else { rect = bounds.clone(); }
		}
		return rect;
	}

}

/*
* @license MouseEvent
* Visit http://createjs.com/ for documentation, updates and examples.
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

/**
 * Passed as the parameter to all mouse/pointer/touch related events. For a listing of mouse events and their properties,
 * see the {{#crossLink "DisplayObject"}}{{/crossLink}} and {{#crossLink "Stage"}}{{/crossLink}} event listings.
 * @class MouseEvent
 * @extends Event
 * @module EaselJS
 */
class MouseEvent extends Event {

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
	constructor (type, bubbles, cancelable, stageX, stageY, nativeEvent, pointerID, primary, rawX, rawY, relatedTarget) {
		super (type, bubbles, cancelable);

// public properties:
		/**
		 * The normalized x position on the stage. This will always be within the range 0 to stage width.
		 * @property stageX
		 * @type Number
		*/
		this.stageX = stageX;

		/**
		 * The normalized y position on the stage. This will always be within the range 0 to stage height.
		 * @property stageY
		 * @type Number
		 */
		this.stageY = stageY;

		/**
		 * The raw x position relative to the stage. Normally this will be the same as the stageX value, unless
		 * stage.mouseMoveOutside is true and the pointer is outside of the stage bounds.
		 * @property rawX
		 * @type Number
		*/
		this.rawX = (rawX==null)?stageX:rawX;

		/**
		 * The raw y position relative to the stage. Normally this will be the same as the stageY value, unless
		 * stage.mouseMoveOutside is true and the pointer is outside of the stage bounds.
		 * @property rawY
		 * @type Number
		*/
		this.rawY = (rawY==null)?stageY:rawY;

		/**
		 * The native MouseEvent generated by the browser. The properties and API for this
		 * event may differ between browsers. This property will be null if the
		 * EaselJS property was not directly generated from a native MouseEvent.
		 * @property nativeEvent
		 * @type HtmlMouseEvent
		 * @default null
		 */
		this.nativeEvent = nativeEvent;

		/**
		 * The unique id for the pointer (touch point or cursor). This will be either -1 for the mouse, or the system
		 * supplied id value.
		 * @property pointerID
		 * @type {Number}
		 */
		this.pointerID = pointerID;

		/**
		 * Indicates whether this is the primary pointer in a multitouch environment. This will always be true for the mouse.
		 * For touch pointers, the first pointer in the current stack will be considered the primary pointer.
		 * @property primary
		 * @type {Boolean}
		 */
		this.primary = !!primary;

		/**
		 * The secondary target for the event, if applicable. This is used for mouseout/rollout
		 * events to indicate the object that the mouse entered from, mouseover/rollover for the object the mouse exited,
		 * and stagemousedown/stagemouseup events for the object that was the under the cursor, if any.
		 *
		 * Only valid interaction targets will be returned (ie. objects with mouse listeners or a cursor set).
		 * @property relatedTarget
		 * @type {DisplayObject}
		 */
		this.relatedTarget = relatedTarget;
	}

// accessor properties:
/**
 * Returns the x position of the mouse in the local coordinate system of the current target (ie. the dispatcher).
 * @property localX
 * @type {Number}
 * @readonly
 */
	get localX () {
		return this.currentTarget.globalToLocal(this.rawX, this.rawY).x;
	}

	/**
	 * Returns the y position of the mouse in the local coordinate system of the current target (ie. the dispatcher).
	 * @property localY
	 * @type {Number}
	 * @readonly
	 */
	get localY () {
		return this.currentTarget.globalToLocal(this.rawX, this.rawY).y;
	}

	/**
	 * Indicates whether the event was generated by a touch input (versus a mouse input).
	 * @property isTouch
	 * @type {Boolean}
	 * @readonly
	 */
	get isTouch () {
		return this.pointerID !== -1;
	}

// public methods:
	/**
	 * Returns a clone of the MouseEvent instance.
	 * @method clone
	 * @return {MouseEvent} a clone of the MouseEvent instance.
	 */
	clone () {
		return new MouseEvent(this.type, this.bubbles, this.cancelable, this.stageX, this.stageY, this.nativeEvent, this.pointerID, this.primary, this.rawX, this.rawY);
	}

	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 */
	toString () {
		return `[${this.constructor.name} (type=${this.type} stageX=${this.stageX} stageY=${this.stageY})]`;
	}

}

/*
* @license Stage
* Visit http://createjs.com/ for documentation, updates and examples.
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
 * @module EaselJS
 */
class Stage extends Container {

// constructor:
	/**
	 * @constructor
	 * @param {HTMLCanvasElement | String | Object} canvas A canvas object that the Stage will render to, or the string id
	 * of a canvas object in the current document.
	 */
	constructor (canvas) {
		super();

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
		this.autoClear = true;

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
		this.canvas = (typeof canvas === "string") ? document.getElementById(canvas) : canvas;

		/**
		 * The current mouse X position on the canvas. If the mouse leaves the canvas, this will indicate the most recent
		 * position over the canvas, and mouseInBounds will be set to false.
		 * @property mouseX
		 * @type Number
		 * @readonly
		 */
		this.mouseX = 0;

		/**
		 * The current mouse Y position on the canvas. If the mouse leaves the canvas, this will indicate the most recent
		 * position over the canvas, and mouseInBounds will be set to false.
		 * @property mouseY
		 * @type Number
		 * @readonly
		 */
		this.mouseY = 0;

		/**
		 * Specifies the area of the stage to affect when calling update. This can be use to selectively
		 * re-draw specific regions of the canvas. If null, the whole canvas area is drawn.
		 * @property drawRect
		 * @type {Rectangle}
		 */
		this.drawRect = null;

		/**
		 * Indicates whether display objects should be rendered on whole pixels. You can set the
		 * {{#crossLink "DisplayObject/snapToPixel"}}{{/crossLink}} property of
		 * display objects to false to enable/disable this behaviour on a per instance basis.
		 * @property snapToPixelEnabled
		 * @type Boolean
		 * @default false
		 */
		this.snapToPixelEnabled = false;

		/**
		 * Indicates whether the mouse is currently within the bounds of the canvas.
		 * @property mouseInBounds
		 * @type Boolean
		 * @default false
		 */
		this.mouseInBounds = false;

		/**
		 * If true, tick callbacks will be called on all display objects on the stage prior to rendering to the canvas.
		 * @property tickOnUpdate
		 * @type Boolean
		 * @default true
		 */
		this.tickOnUpdate = true;

		/**
		 * If true, mouse move events will continue to be called when the mouse leaves the target canvas. See
		 * {{#crossLink "Stage/mouseInBounds:property"}}{{/crossLink}}, and {{#crossLink "MouseEvent"}}{{/crossLink}}
		 * x/y/rawX/rawY.
		 * @property mouseMoveOutside
		 * @type Boolean
		 * @default false
		 */
		this.mouseMoveOutside = false;


		/**
		 * Prevents selection of other elements in the html page if the user clicks and drags, or double clicks on the canvas.
		 * This works by calling `preventDefault()` on any mousedown events (or touch equivalent) originating on the canvas.
		 * @property preventSelection
		 * @type Boolean
		 * @default true
		 */
		this.preventSelection = true;

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
		this._pointerData = {};

		/**
		 * Number of active pointers.
		 * @property _pointerCount
		 * @type {Object}
		 * @private
		 */
		this._pointerCount = 0;

		/**
		 * The ID of the primary pointer.
		 * @property _primaryPointerID
		 * @type {Object}
		 * @private
		 */
		this._primaryPointerID = null;

		/**
		 * @property _mouseOverIntervalID
		 * @protected
		 * @type Number
		 */
		this._mouseOverIntervalID = null;

		/**
		 * @property _nextStage
		 * @protected
		 * @type Stage
		 */
		this._nextStage = null;

		/**
		 * @property _prevStage
		 * @protected
		 * @type Stage
		 */
		this._prevStage = null;

		this.enableDOMEvents(true);
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
	get nextStage () {
		return this._nextStage;
	}

	set nextStage (stage) {
		if (this._nextStage) { this._nextStage._prevStage = null; }
		if (stage) { stage._prevStage = this; }
		this._nextStage = stage;
	}

// public methods:
	/**
	 * Each time the update method is called, the stage will call {{#crossLink "Stage/tick"}}{{/crossLink}}
	 * unless {{#crossLink "Stage/tickOnUpdate:property"}}{{/crossLink}} is set to false,
	 * and then render the display list to the canvas.
	 *
	 * @method update
	 * @param {Object} [props] Props object to pass to `tick()`. Should usually be a {{#crossLink "Ticker"}}{{/crossLink}} event object, or similar object with a delta property.
	 */
	update (props) {
		if (!this.canvas) { return; }
		if (this.tickOnUpdate) { this.tick(props); }
		if (this.dispatchEvent("drawstart", false, true) === false) { return; }
		DisplayObject._snapToPixelEnabled = this.snapToPixelEnabled;
		let r = this.drawRect, ctx = this.canvas.getContext("2d");
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		if (this.autoClear) {
			if (r) { ctx.clearRect(r.x, r.y, r.width, r.height); }
			else { ctx.clearRect(0, 0, this.canvas.width+1, this.canvas.height+1); }
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

	/**
	 * Propagates a tick event through the display list. This is automatically called by {{#crossLink "Stage/update"}}{{/crossLink}}
	 * unless {{#crossLink "Stage/tickOnUpdate:property"}}{{/crossLink}} is set to false.
	 *
	 * If a props object is passed to `tick()`, then all of its properties will be copied to the event object that is
	 * propagated to listeners.
	 *
	 * Some time-based features in EaselJS (for example {{#crossLink "Sprite/framerate"}}{{/crossLink}} require that
	 * a {{#crossLink "Ticker/tick:event"}}{{/crossLink}} event object (or equivalent object with a delta property) be
	 * passed as the `props` parameter to `tick()`. For example:
	 *
	 * 	Ticker.on("tick", handleTick);
	 * 	function handleTick(evtObj) {
	 * 		// clone the event object from Ticker, and add some custom data to it:
	 * 		var evt = evtObj.clone().set({greeting:"hello", name:"world"});
	 *
	 * 		// pass it to stage.update():
	 * 		myStage.update(evt); // subsequently calls tick() with the same param
	 * 	}
	 *
	 * 	// ...
	 * 	myDisplayObject.on("tick", handleDisplayObjectTick);
	 * 	function handleDisplayObjectTick(evt) {
	 * 		console.log(evt.delta); // the delta property from the Ticker tick event object
	 * 		console.log(evt.greeting, evt.name); // custom data: "hello world"
	 * 	}
	 *
	 * @method tick
	 * @param {Object} [props] An object with properties that should be copied to the event object. Should usually be a Ticker event object, or similar object with a delta property.
	 */
	tick (props) {
		if (!this.tickEnabled || this.dispatchEvent("tickstart", false, true) === false) { return; }
		let evtObj = new Event("tick");
		if (props) {
			for (let n in props) {
				if (props.hasOwnProperty(n)) { evtObj[n] = props[n]; }
			}
		}
		this._tick(evtObj);
		this.dispatchEvent("tickend");
	}

	/**
	 * Default event handler that calls the Stage {{#crossLink "Stage/update"}}{{/crossLink}} method when a {{#crossLink "DisplayObject/tick:event"}}{{/crossLink}}
	 * event is received. This allows you to register a Stage instance as a event listener on {{#crossLink "Ticker"}}{{/crossLink}}
	 * directly, using:
	 *
	 *      Ticker.addEventListener("tick", myStage");
	 *
	 * Note that if you subscribe to ticks using this pattern, then the tick event object will be passed through to
	 * display object tick handlers, instead of <code>delta</code> and <code>paused</code> parameters.
	 * @property handleEvent
	 * @type Function
	 */
	handleEvent (evt) {
		if (evt.type === "tick") { this.update(evt); }
	}

	/**
	 * Clears the target canvas. Useful if {{#crossLink "Stage/autoClear:property"}}{{/crossLink}} is set to `false`.
	 * @method clear
	 */
	clear () {
		if (!this.canvas) { return; }
		let ctx = this.canvas.getContext("2d");
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, this.canvas.width+1, this.canvas.height+1);
	}

	/**
	 * Returns a data url that contains a Base64-encoded image of the contents of the stage. The returned data url can
	 * be specified as the src value of an image element.
	 * @method toDataURL
	 * @param {String} [backgroundColor] The background color to be used for the generated image. Any valid CSS color
	 * value is allowed. The default value is a transparent background.
	 * @param {String} [mimeType="image/png"] The MIME type of the image format to be create. The default is "image/png". If an unknown MIME type
	 * is passed in, or if the browser does not support the specified MIME type, the default value will be used.
	 * @return {String} a Base64 encoded image.
	 */
	toDataURL (backgroundColor, mimeType = "image/png") {
		let data, ctx = this.canvas.getContext('2d'), w = this.canvas.width, h = this.canvas.height;

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
	};

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
	enableMouseOver (frequency = 20) {
		if (this._mouseOverIntervalID) {
			clearInterval(this._mouseOverIntervalID);
			this._mouseOverIntervalID = null;
			if (frequency === 0) {
				this._testMouseOver(true);
			}
		}
		if (frequency <= 0) { return; }
		this._mouseOverIntervalID = setInterval(() => this._testMouseOver(), 1000/Math.min(50,frequency));
	}

	/**
	 * Enables or disables the event listeners that stage adds to DOM elements (window, document and canvas). It is good
	 * practice to disable events when disposing of a Stage instance, otherwise the stage will continue to receive
	 * events from the page.
	 *
	 * When changing the canvas property you must disable the events on the old canvas, and enable events on the
	 * new canvas or mouse events will not work as expected. For example:
	 *
	 *      myStage.enableDOMEvents(false);
	 *      myStage.canvas = anotherCanvas;
	 *      myStage.enableDOMEvents(true);
	 *
	 * @method enableDOMEvents
	 * @param {Boolean} [enable=true] Indicates whether to enable or disable the events. Default is true.
	 */
	enableDOMEvents (enable = true) {
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
				mouseup: {t, f:e => this._handleMouseUp(e) },
				mousemove: {t, f:e => this._handleMouseMove(e) },
				dblclick: {t:this.canvas, f:e => this._handleDoubleClick(e) },
				mousedown: {t:this.canvas, f:e => this._handleMouseDown(e) }
			};
			for (let n in ls) {
				let o = ls[n];
				o.t.addEventListener(n, o.f, false);
			}
		}
	}

	/**
	 * Stage instances cannot be cloned.
	 * @method clone
	 */
	clone () {
		throw("Stage cannot be cloned.");
	}

// private methods:
	/**
	 * @method _getElementRect
	 * @protected
	 * @param {HTMLElement} e
	 */
	_getElementRect (e) {
		let bounds;
		try { bounds = e.getBoundingClientRect(); } // this can fail on disconnected DOM elements in IE9
		catch (err) { bounds = {top:e.offsetTop, left:e.offsetLeft, width:e.offsetWidth, height:e.offsetHeight}; }

		let offX = (window.pageXOffset || document.scrollLeft || 0) - (document.clientLeft || document.body.clientLeft || 0);
		let offY = (window.pageYOffset || document.scrollTop || 0) - (document.clientTop  || document.body.clientTop  || 0);

		let styles = window.getComputedStyle ? getComputedStyle(e, null) : e.currentStyle; // IE <9 compatibility.
		let padL = parseInt(styles.paddingLeft)+parseInt(styles.borderLeftWidth);
		let padT = parseInt(styles.paddingTop)+parseInt(styles.borderTopWidth);
		let padR = parseInt(styles.paddingRight)+parseInt(styles.borderRightWidth);
		let padB = parseInt(styles.paddingBottom)+parseInt(styles.borderBottomWidth);

		// note: in some browsers bounds properties are read only.
		return {
			left: bounds.left+offX+padL,
			right: bounds.right+offX-padR,
			top: bounds.top+offY+padT,
			bottom: bounds.bottom+offY-padB
		};
	}

	/**
	 * @method _getPointerData
	 * @protected
	 * @param {Number} id
	 */
	_getPointerData (id) {
		let data = this._pointerData[id];
		if (!data) { data = this._pointerData[id] = {x:0, y:0}; }
		return data;
	}

	/**
	 * @method _handleMouseMove
	 * @protected
	 * @param {MouseEvent} [e=window.event]
	 */
	_handleMouseMove (e = window.event) {
		this._handlePointerMove(-1, e, e.pageX, e.pageY);
	}

	/**
	 * @method _handlePointerMove
	 * @protected
	 * @param {Number} id
	 * @param {Event} e
	 * @param {Number} pageX
	 * @param {Number} pageY
	 * @param {Stage} owner Indicates that the event has already been captured & handled by the indicated stage.
	 */
	_handlePointerMove (id, e, pageX, pageY, owner) {
		if (this._prevStage && owner === undefined) { return; } // redundant listener.
		if (!this.canvas) { return; }
		let nextStage=this._nextStage, o=this._getPointerData(id);

		let inBounds = o.inBounds;
		this._updatePointerPosition(id, e, pageX, pageY);
		if (inBounds || o.inBounds || this.mouseMoveOutside) {
			if (id === -1 && o.inBounds === !inBounds) {
				this._dispatchMouseEvent(this, (inBounds ? "mouseleave" : "mouseenter"), false, id, o, e);
			}

			this._dispatchMouseEvent(this, "stagemousemove", false, id, o, e);
			this._dispatchMouseEvent(o.target, "pressmove", true, id, o, e);
		}

		nextStage&&nextStage._handlePointerMove(id, e, pageX, pageY, null);
	}

	/**
	 * @method _updatePointerPosition
	 * @protected
	 * @param {Number} id
	 * @param {Event} e
	 * @param {Number} pageX
	 * @param {Number} pageY
	 */
	_updatePointerPosition (id, e, pageX, pageY) {
		let rect = this._getElementRect(this.canvas);
		pageX -= rect.left;
		pageY -= rect.top;

		let w = this.canvas.width;
		let h = this.canvas.height;
		pageX /= (rect.right-rect.left)/w;
		pageY /= (rect.bottom-rect.top)/h;
		let o = this._getPointerData(id);
		if (o.inBounds = (pageX >= 0 && pageY >= 0 && pageX <= w-1 && pageY <= h-1)) {
			o.x = pageX;
			o.y = pageY;
		} else if (this.mouseMoveOutside) {
			o.x = pageX < 0 ? 0 : (pageX > w-1 ? w-1 : pageX);
			o.y = pageY < 0 ? 0 : (pageY > h-1 ? h-1 : pageY);
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

	/**
	 * @method _handleMouseUp
	 * @protected
	 * @param {MouseEvent} e
	 */
	_handleMouseUp (e) {
		this._handlePointerUp(-1, e, false);
	}

	/**
	 * @method _handlePointerUp
	 * @protected
	 * @param {Number} id
	 * @param {Event} e
	 * @param {Boolean} clear
	 * @param {Stage} owner Indicates that the event has already been captured & handled by the indicated stage.
	 */
	_handlePointerUp (id, e, clear, owner) {
		let nextStage = this._nextStage, o = this._getPointerData(id);
		if (this._prevStage && owner === undefined) { return; } // redundant listener.

		let target=null, oTarget = o.target;
		if (!owner && (oTarget || nextStage)) { target = this._getObjectsUnderPoint(o.x, o.y, null, true); }

		if (o.down) { this._dispatchMouseEvent(this, "stagemouseup", false, id, o, e, target); o.down = false; }

		if (target === oTarget) { this._dispatchMouseEvent(oTarget, "click", true, id, o, e); }
		this._dispatchMouseEvent(oTarget, "pressup", true, id, o, e);

		if (clear) {
			if (id==this._primaryPointerID) { this._primaryPointerID = null; }
			delete(this._pointerData[id]);
		} else { o.target = null; }

		nextStage&&nextStage._handlePointerUp(id, e, clear, owner || target && this);
	}

	/**
	 * @method _handleMouseDown
	 * @protected
	 * @param {MouseEvent} e
	 */
	_handleMouseDown (e) {
		this._handlePointerDown(-1, e, e.pageX, e.pageY);
	}

	/**
	 * @method _handlePointerDown
	 * @protected
	 * @param {Number} id
	 * @param {Event} e
	 * @param {Number} pageX
	 * @param {Number} pageY
	 * @param {Stage} owner Indicates that the event has already been captured & handled by the indicated stage.
	 */
	_handlePointerDown (id, e, pageX, pageY, owner) {
		if (this.preventSelection) { e.preventDefault(); }
		if (this._primaryPointerID == null || id === -1) { this._primaryPointerID = id; } // mouse always takes over.

		if (pageY != null) { this._updatePointerPosition(id, e, pageX, pageY); }
		let target = null, nextStage = this._nextStage, o = this._getPointerData(id);
		if (!owner) { target = o.target = this._getObjectsUnderPoint(o.x, o.y, null, true); }

		if (o.inBounds) { this._dispatchMouseEvent(this, "stagemousedown", false, id, o, e, target); o.down = true; }
		this._dispatchMouseEvent(target, "mousedown", true, id, o, e);

		nextStage&&nextStage._handlePointerDown(id, e, pageX, pageY, owner || target && this);
	}

	/**
	 * @method _testMouseOver
	 * @param {Boolean} clear If true, clears the mouseover / rollover (ie. no target)
	 * @param {Stage} owner Indicates that the event has already been captured & handled by the indicated stage.
	 * @param {Stage} eventTarget The stage that the cursor is actively over.
	 * @protected
	 */
	_testMouseOver (clear, owner, eventTarget) {
		if (this._prevStage && owner === undefined) { return; } // redundant listener.

		let nextStage = this._nextStage;
		if (!this._mouseOverIntervalID) {
			// not enabled for mouseover, but should still relay the event.
			nextStage&&nextStage._testMouseOver(clear, owner, eventTarget);
			return;
		}
		let o = this._getPointerData(-1);
		// only update if the mouse position has changed. This provides a lot of optimization, but has some trade-offs.
		if (!o || (!clear && this.mouseX === this._mouseOverX && this.mouseY === this._mouseOverY && this.mouseInBounds)) { return; }

		let e = o.posEvtObj;
		let isEventTarget = eventTarget || e&&(e.target === this.canvas);
		let target=null, common = -1, cursor="";

		if (!owner && (clear || this.mouseInBounds && isEventTarget)) {
			target = this._getObjectsUnderPoint(this.mouseX, this.mouseY, null, true);
			this._mouseOverX = this.mouseX;
			this._mouseOverY = this.mouseY;
		}

		let oldList = this._mouseOverTarget||[];
		let oldTarget = oldList[oldList.length-1];
		let list = this._mouseOverTarget = [];

		// generate ancestor list and check for cursor:
		let t = target;
		while (t) {
			list.unshift(t);
			if (!cursor) { cursor = t.cursor; }
			t = t.parent;
		}
		this.canvas.style.cursor = cursor;
		if (!owner && eventTarget) { eventTarget.canvas.style.cursor = cursor; }

		// find common ancestor:
		for (let i=0,l=list.length; i<l; i++) {
			if (list[i] != oldList[i]) { break; }
			common = i;
		}

		if (oldTarget != target) {
			this._dispatchMouseEvent(oldTarget, "mouseout", true, -1, o, e, target);
		}

		for (let i=oldList.length-1; i>common; i--) {
			this._dispatchMouseEvent(oldList[i], "rollout", false, -1, o, e, target);
		}

		for (let i=list.length-1; i>common; i--) {
			this._dispatchMouseEvent(list[i], "rollover", false, -1, o, e, oldTarget);
		}

		if (oldTarget != target) {
			this._dispatchMouseEvent(target, "mouseover", true, -1, o, e, oldTarget);
		}

		nextStage&&nextStage._testMouseOver(clear, owner || target && this, eventTarget || isEventTarget && this);
	}

	/**
	 * @method _handleDoubleClick
	 * @protected
	 * @param {MouseEvent} e
	 * @param {Stage} owner Indicates that the event has already been captured & handled by the indicated stage.
	 */
	_handleDoubleClick (e, owner) {
		let target=null, nextStage=this._nextStage, o=this._getPointerData(-1);
		if (!owner) {
			target = this._getObjectsUnderPoint(o.x, o.y, null, true);
			this._dispatchMouseEvent(target, "dblclick", true, -1, o, e);
		}
		nextStage&&nextStage._handleDoubleClick(e, owner || target && this);
	}

	/**
	 * @method _dispatchMouseEvent
	 * @protected
	 * @param {DisplayObject} target
	 * @param {String} type
	 * @param {Boolean} bubbles
	 * @param {Number} pointerId
	 * @param {Object} o
	 * @param {MouseEvent} [nativeEvent]
	 * @param {DisplayObject} [relatedTarget]
	 */
	_dispatchMouseEvent (target, type, bubbles, pointerId, o, nativeEvent, relatedTarget) {
		// TODO: might be worth either reusing MouseEvent instances, or adding a willTrigger method to avoid GC.
		if (!target || (!bubbles && !target.hasEventListener(type))) { return; }
		/*
		// TODO: account for stage transformations?
		this._mtx = this.getConcatenatedMatrix(this._mtx).invert();
		let pt = this._mtx.transformPoint(o.x, o.y);
		let evt = new MouseEvent(type, bubbles, false, pt.x, pt.y, nativeEvent, pointerId, pointerId==this._primaryPointerID || pointerId==-1, o.rawX, o.rawY);
		*/
		let evt = new MouseEvent(type, bubbles, false, o.x, o.y, nativeEvent, pointerId, pointerId === this._primaryPointerID || pointerId === -1, o.rawX, o.rawY, relatedTarget);
		target.dispatchEvent(evt);
	}

}

// events:
/**
 * Dispatched when the user moves the mouse over the canvas.
 * See the {{#crossLink "MouseEvent"}}{{/crossLink}} class for a listing of event properties.
 * @event stagemousemove
 * @since 0.6.0
 */

/**
 * Dispatched when the user presses their left mouse button on the canvas. See the {{#crossLink "MouseEvent"}}{{/crossLink}}
 * class for a listing of event properties.
 * @event stagemousedown
 * @since 0.6.0
 */

/**
 * Dispatched when the user the user presses somewhere on the stage, then releases the mouse button anywhere that the page can detect it (this varies slightly between browsers).
 * You can use {{#crossLink "Stage/mouseInBounds:property"}}{{/crossLink}} to check whether the mouse is currently within the stage bounds.
 * See the {{#crossLink "MouseEvent"}}{{/crossLink}} class for a listing of event properties.
 * @event stagemouseup
 * @since 0.6.0
 */

/**
 * Dispatched when the mouse moves from within the canvas area (mouseInBounds === true) to outside it (mouseInBounds === false).
 * This is currently only dispatched for mouse input (not touch). See the {{#crossLink "MouseEvent"}}{{/crossLink}}
 * class for a listing of event properties.
 * @event mouseleave
 * @since 0.7.0
 */

/**
 * Dispatched when the mouse moves into the canvas area (mouseInBounds === false) from outside it (mouseInBounds === true).
 * This is currently only dispatched for mouse input (not touch). See the {{#crossLink "MouseEvent"}}{{/crossLink}}
 * class for a listing of event properties.
 * @event mouseenter
 * @since 0.7.0
 */

/**
 * Dispatched each update immediately before the tick event is propagated through the display list.
 * You can call preventDefault on the event object to cancel propagating the tick event.
 * @event tickstart
 * @since 0.7.0
 */

/**
 * Dispatched each update immediately after the tick event is propagated through the display list. Does not fire if
 * tickOnUpdate is false. Precedes the "drawstart" event.
 * @event tickend
 * @since 0.7.0
 */

/**
 * Dispatched each update immediately before the canvas is cleared and the display list is drawn to it.
 * You can call preventDefault on the event object to cancel the draw.
 * @event drawstart
 * @since 0.7.0
 */

/**
 * Dispatched each update immediately after the display list is drawn to the canvas and the canvas context is restored.
 * @event drawend
 * @since 0.7.0
 */

/*
* @license StageGL
* Visit http://createjs.com/ for documentation, updates and examples.
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

/*
 * README IF EDITING:
 * Terminology for developers:
 *
 * Vertex: a point that help defines a shape, 3 per triangle. Usually has an x,y,z but can have more/less info.
 * Vertex Property: a piece of information attached to the vertex like a vector3 containing x,y,z
 * Index/Indices: used in groups of 3 to define a triangle, points to vertices by their index in an array (some render
 * 		modes do not use these)
 * Card: a group of 2 triangles used to display a rectangular image
 * U/V: common names for the [0-1] texture co-ordinates on an image
 * Batch: a single call to the renderer, best done as little as possible so multiple cards are put into a single batch
 * Buffer: WebGL array data
 * Program/Shader: For every vertex we run the Vertex shader. The results are used per pixel by the Fragment shader. When
 * 		combined and paired these are a shader "program"
 * Texture: WebGL representation of image data and associated extra information
 * Slot: A space on the GPU into which textures can be loaded for use in a batch, using "ActiveTexture" switches texture slot.
 *
 * @uglify
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
 * - To display something StageGL cannot render, {{#crossLink "displayObject/cache"}}{{/crossLink}} the object.
 *	Caches can be rendered regardless of source.
 * - Images are wrapped as a webGL "Texture". Each graphics card has a limit to its concurrent Textures, too many
 * Textures will noticeably slow performance.
 * - Each cache counts as an individual Texture. As such {{#crossLink "SpriteSheet"}}{{/crossLink}} and
 * {{#crossLink "SpriteSheetBuilder"}}{{/crossLink}} are recommended practices to help keep texture counts low.
 * - To use any image node (DOM Image/Canvas Element) between multiple StageGL instances it must be a
 * {{#crossLink "Bitmap/clone"}}{{/crossLink}}, otherwise the GPU texture loading and tracking  will get confused.
 * - You must call {{#crossLink "StageGL/updateViewport"}}{{/crossLink}} if you resize your canvas after making
 * a StageGL instance, this will properly size the WebGL context stored in memory, this won't change the DOM element.
 * - Best performance will come from manual management of texture memory, but it is handled automatically by default.
 * See {{#crossLink "StageGL/releaseTexture"}}{{/crossLink}} for details.
 *
 * <h4>Example</h4>
 * This example creates a StageGL instance, adds a child to it, then uses the EaselJS {{#crossLink "Ticker"}}{{/crossLink}}
 * to update the child and redraw the stage.
 *
 *      var stage = new createjs.StageGL("canvasElementId", false, false);
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
 * @module EaselJS
 */
class StageGL extends Stage {

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
	 * `purgeTextures(autoPurge)` every `autoPurge/2` draws. See {{#crossLink "StageGL/purgeTextures"}}{{/crossLink}} for more
	 * information.
	 */
	constructor (canvas, { preserveBuffer = false, antialias = false, transparent = false, premultiply = false, autoPurge = 1200 }) {
		super(canvas);

// public properties:
		/**
		 * Console log potential issues and problems. This is designed to have <em>minimal</em> performance impact, so
		 * if extensive debugging information is required, this may be inadequate. See {{#crossLink "WebGLInspector"}}{{/crossLink}}
		 * @property vocalDebug
		 * @type {Boolean}
		 * @default false
		 */
		this.vocalDebug = false;

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
		this._preserveBuffer = preserveBuffer;

		/**
		 * Specifies whether or not the browser's WebGL implementation should try to perform anti-aliasing.
		 * @property _antialias
		 * @protected
		 * @type {Boolean}
		 * @default false
		 */
		this._antialias = antialias;

		/**
		 * Specifies whether or not the browser's WebGL implementation should be transparent.
		 * @property _transparent
		 * @protected
		 * @type {Boolean}
		 * @default false
		 */
		this._transparent = transparent;

		/**
		 * Specifies whether or not StageGL is handling colours as premultiplied alpha.
		 * @property _premultiply
		 * @protected
		 * @type {Boolean}
		 * @default false
		 */
		this._premultiply = premultiply;

		/**
		 * Internal value of {{#crossLink "StageGL/autoPurge"}}{{/crossLink}}
		 * @property _autoPurge
		 * @protected
		 * @type {Integer}
		 * @default null
		 */
		this._autoPurge = autoPurge;

		/**
		 * The width of the drawing surface used in memory.
		 * @property _viewportWidth
		 * @protected
		 * @type {Number}
		 * @default 0
		 */
		this._viewportWidth = 0;

		/**
		 * The height of the drawing surface used in memory.
		 * @property _viewportHeight
		 * @protected
		 * @type {Number}
		 * @default 0
		 */
		this._viewportHeight = 0;

		/**
		 * A 2D projection matrix used to convert WebGL's viewspace into canvas co-ordinates. Regular canvas display
		 * uses Top-Left values of [0,0] where WebGL uses a Center [0,0] Top-Right [1,1] system.
		 * @property _projectionMatrix
		 * @protected
		 * @type {Float32Array}
		 * @default null
		 */
		this._projectionMatrix = null;

		/**
		 * The current WebGL canvas context. Often shorthanded to just "gl" in many parts of the code.
		 * @property _webGLContext
		 * @protected
		 * @type {WebGLRenderingContext}
		 * @default null
		 */
		this._webGLContext = null;

		/**
		 * The color to use when the WebGL canvas has been cleared.
		 * @property _clearColor
		 * @protected
		 * @type {Object}
		 * @default {r: 0.00, g: 0.00, b: 0.00, a: 0.00} (black)
		 */
		this._clearColor = {r: 0.00, g: 0.00, b: 0.00, a: 0.00};														//TODO: formalize this approach into regular canvases

		/**
		 * The maximum number of cards (aka a single sprite) that can be drawn in one draw call. Use getter/setters to
		 * modify otherwise internal buffers may be incorrect sizes.
		 * @property _maxCardsPerBatch
		 * @protected
		 * @type {Number}
		 * @default StageGL.DEFAULT_MAX_BATCH_SIZE (10000)
		 */
		this._maxCardsPerBatch = StageGL.DEFAULT_MAX_BATCH_SIZE;														//TODO: write getter/setters for this

		/**
		 * The shader program used to draw the current batch.
		 * @property _activeShader
		 * @protected
		 * @type {WebGLProgram}
		 * @default null
		 */
		this._activeShader = null;

		/**
		 * The vertex position data for the current draw call.
		 * @property _vertices
		 * @protected
		 * @type {Float32Array}
		 * @default null
		 */
		this._vertices = null;

		/**
		 * The WebGL buffer attached to {{#crossLink "StageGL/_vertices:property"}}{{/crossLink}}.
		 * @property _vertexPositionBuffer
		 * @protected
		 * @type {WebGLBuffer}
		 * @default null
		 */
		this._vertexPositionBuffer = null;

		/**
		 * The vertex U/V data for the current draw call.
		 * @property _uvs
		 * @protected
		 * @type {Float32Array}
		 * @default null
		 */
		this._uvs = null;

		/**
		 * The WebGL buffer attached to {{#crossLink "StageGL/_uvs:property"}}{{/crossLink}}.
		 * @property _uvPositionBuffer
		 * @protected
		 * @type {WebGLBuffer}
		 * @default null
		 */
		this._uvPositionBuffer = null;

		/**
		 * The vertex indices data for the current draw call.
		 * @property _indices
		 * @protected
		 * @type {Float32Array}
		 * @default null
		 */
		this._indices = null;

		/**
		 * The WebGL buffer attached to {{#crossLink "StageGL/_indices:property"}}{{/crossLink}}.
		 * @property _textureIndexBuffer
		 * @protected
		 * @type {WebGLBuffer}
		 * @default null
		 */
		this._textureIndexBuffer = null;

		/**
		 * The vertices data for the current draw call.
		 * @property _alphas
		 * @protected
		 * @type {Float32Array}
		 * @default null
		 */
		this._alphas = null;

		/**
		 * The WebGL buffer attached to {{#crossLink "StageGL/_alphas:property"}}{{/crossLink}}.
		 * @property _alphaBuffer
		 * @protected
		 * @type {WebGLBuffer}
		 * @default null
		 */
		this._alphaBuffer = null;

		/**
		 * An index based lookup of every WebGL Texture currently in use.
		 * @property _drawTexture
		 * @protected
		 * @type {Array}
		 */
		this._textureDictionary = [];

		/**
		 * A string based lookup hash of which index a texture is stored at in the dictionary. The lookup string is
		 * often the src url.
		 * @property _textureIDs
		 * @protected
		 * @type {Object}
		 */
		this._textureIDs = {};

		/**
		 * An array of all the textures currently loaded into the GPU. The index in the array matches the GPU index.
		 * @property _batchTextures
		 * @protected
		 * @type {Array}
		 */
		this._batchTextures = [];

		/**
		 * An array of all the simple filler textures used to prevent issues with missing textures in a batch.
		 * @property _baseTextures
		 * @protected
		 * @type {Array}
		 */
		this._baseTextures = [];

		/**
		 * The number of concurrent textures the GPU can handle. This value is dynamically set from WebGL during initialization
		 * via `gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS)`. The WebGL spec states that the lowest guaranteed value is 8,
		 * but it could be higher. Do not set this value higher than the value returned by the GPU. Setting it lower will
		 * probably reduce performance, but may be advisable to reserve slots for custom filter work.
		 * NOTE: Can also act as a length for {{#crossLink "StageGL/_batchTextures:property"}}.
		 * @property _batchTextureCount
		 * @protected
		 * @type {Number}
		 * @default 8
		 */
		this._batchTextureCount = 8;

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
		this._lastTextureInsert = -1;

		/**
		 * The current batch being drawn, A batch consists of a call to `drawElements` on the GPU. Many of these calls
		 * can occur per draw.
		 * @property _batchId
		 * @protected
		 * @type {Number}
		 * @default 0
		 */
		this._batchID = 0;

		/**
		 * The current draw being performed, and may contain multiple batches. Comparing to {{#crossLink "StageGL/_batchID:property"}}{{/crossLink}}
		 * can reveal batching efficiency.
		 * @property _drawID
		 * @protected
		 * @type {Number}
		 * @default 0
		 */
		this._drawID = 0;

		/**
		 * Used to prevent textures in certain GPU slots from being replaced by an insert.
		 * @property _slotBlackList
		 * @protected
		 * @type {Array}
		 */
		this._slotBlacklist = [];

		/**
		 * Used to prevent nested draw calls from accidentally overwriting drawing information by tracking depth.
		 * @property _isDrawing
		 * @protected
		 * @type {Number}
		 * @default 0
		 */
		this._isDrawing = 0;

		/**
		 * Used to ensure every canvas used has a unique ID.
		 * @property _lastTrackedCanvas
		 * @protected
		 * @type {Number}
		 * @default 0
		 */
		this._lastTrackedCanvas = 0;

		/**
		 * Controls whether final rendering output of a {{#crossLink "cacheDraw"}}{{/crossLink}} is the canvas or a render
		 * texture. See the {{#crossLink "cache"}}{{/crossLink}} function modifications for full implications and discussion.
		 * @property isCacheControlled
		 * @protected
		 * @type {Boolean}
		 * @default false
		 * @todo LM: is this supposed to be _isCacheControlled since its private?
		 */
		this.isCacheControlled = false;

		/**
		 * Used to counter-position the object being cached so it aligns with the cache surface.
		 * @property _cacheContainer
		 * @protected
		 * @type {Container}
		 * @default An instance of an EaselJS Container.
		 */
		this._cacheContainer = new Container();

		this._initializeWebGL();
	}

// static methods:
	/**
	 * Calculate the U/V co-ordinate based info for sprite frames. Instead of pixel count it uses a 0-1 space. Also includes
	 * the ability to get info back for a specific frame, or only calculate that one frame.
	 *
	 *     //generate UV rects for all entries
	 *     StageGL.buildUVRects( spriteSheetA );
	 *     //generate all, fetch the first
	 *     var firstFrame = StageGL.buildUVRects( spriteSheetB, 0 );
	 *     //generate the rect for just a single frame for performance's sake
	 *     var newFrame = StageGL.buildUVRects( dynamicSpriteSheet, newFrameIndex, true );
	 *
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method buildUVRects
	 * @param  {SpriteSheet} spritesheet The spritesheet to find the frames on
	 * @param  {int} [target=-1] The index of the frame to return
	 * @param  {Boolean} [onlyTarget=false] Whether "target" is the only frame that gets calculated
	 * @static
	 * @return {Object} the target frame if supplied and present or a generic frame {t, l, b, r}
	 */
	static buildUVRects (spritesheet, target = -1, onlyTarget = false) {
		if (!spritesheet || !spritesheet._frames) { return null; }

		let start = (target != -1 && onlyTarget) ? target : 0;
		let end = (target != -1 && onlyTarget) ? target+1 : spritesheet._frames.length;
		for (let i=start; i<end; i++) {
			let f = spritesheet._frames[i];
			if (f.uvRect || f.image.width <= 0 || f.image.height <= 0) { continue; }

			let r = f.rect;
			f.uvRect = {
				t: r.y / f.image.height,
				l: r.x / f.image.width,
				b: (r.y + r.height) / f.image.height,
				r: (r.x + r.width) / f.image.width
			};
		}
		// make a copy of the default rect to avoid users modifying the returned object
		// only create it if needed to avoid slowing down the normal path
		let r = StageGL.UV_RECT;
		return spritesheet._frames[(target != -1) ? target : 0].uvRect
			|| { t: r.t, l: r.l, b: r.b, r: r.r };
	}

	/**
	 * Test a context to see if it has WebGL enabled on it.
	 * @method isWebGLActive
	 * @param {CanvasContext} ctx The context to test
	 * @static
	 * @return {Boolean} Whether WebGL is enabled
	 */
	static isWebGLActive (ctx) {
		return ctx &&
			ctx instanceof WebGLRenderingContext &&
			typeof WebGLRenderingContext !== 'undefined';
	}

// accessor properties:
	/**
	 * Indicates whether WebGL is being used for rendering. For example, this would be `false` if WebGL is not
	 * supported in the browser.
	 * @property isWebGL
	 * @type {Boolean}
	 * @readonly
	 */
	get isWebGL () {
		return !!this._webGLContext;
	}

	/**
	 * Specifies whether or not StageGL is automatically purging unused textures. Higher numbers purge less
	 * often. Values below 10 are upgraded to 10, and -1 disables this feature.
	 * @property autoPurge
	 * @protected
	 * @type {Integer}
	 * @default 1000
	 */
	get autoPurge () {
		return Number(this._autoPurge);
	}

	set autoPurge (autoPurge) {
		autoPurge = isNaN(autoPurge) ? 1200 : autoPurge;
		if (autoPurge != -1 && autoPurge < 10) { autoPurge = 10; }
		this._autoPurge = autoPurge;
	}

// constructor methods:
	/**
	 * Create and properly initialize the WebGL instance.
	 * @method _initializeWebGL
	 * @protected
	 * @return {WebGLRenderingContext}
	 */
	_initializeWebGL () {
		if (this.canvas) {
			if (!this._webGLContext || this._webGLContext.canvas !== this.canvas) {
				// A context hasn't been defined yet,
				// OR the defined context belongs to a different canvas, so reinitialize.

				// defaults and options
				const options = {
					depth: false, // Disable the depth buffer as it isn't used.
					alpha: this._transparent, // Make the canvas background transparent.
					stencil: true,
					antialias: this._antialias,
					premultipliedAlpha: this._premultiply, // Assume the drawing buffer contains colors with premultiplied alpha.
					preserveDrawingBuffer: this._preserveBuffer
				};

				let gl = this._webGLContext = this._fetchWebGLContext(this.canvas, options);
				if (!gl) { return null; }

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
				this.updateViewport(this._viewportWidth || this.canvas.width, this._viewportHeight || this.canvas.height);
			}
		} else {
			this._webGLContext = null;
		}
		return this._webGLContext;
	}

// public methods:
	/**
	 * Docced in superclass
	 */
	update (props) {
		if (!this.canvas) { return; }
		if (this.tickOnUpdate) { this.tick(props); }
		this.dispatchEvent("drawstart");
		if (this.autoClear) { this.clear(); }

		if (this._webGLContext) {
			// Use WebGL.
			this._batchDraw(this, this._webGLContext);
			if (this._autoPurge != -1 && !(this._drawID%((this._autoPurge/2)|0))) {
				this.purgeTextures(this._autoPurge);
			}
		} else {
			// Use 2D.
			let ctx = this.canvas.getContext("2d");
			ctx.save();
			this.updateContext(ctx);
			this.draw(ctx, false);
			ctx.restore();
		}
		this.dispatchEvent("drawend");
	}

	/**
	 * Docced in superclass
	 */
	clear () {
		if (!this.canvas) { return; }
		if (StageGL.isWebGLActive(this._webGLContext)) {
			let gl = this._webGLContext;
			// Use WebGL.
			gl.clear(gl.COLOR_BUFFER_BIT);
		} else {
			// Use 2D.
			let ctx = this.canvas.getContext("2d");
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.clearRect(0, 0, this.canvas.width + 1, this.canvas.height + 1);
		}
	}

	/**
	 * Draws the stage into the supplied context if possible. Many WebGL properties only exist on their context. As such
	 * you cannot share contexts among many StageGLs and each context requires a unique StageGL instance. Contexts that
	 * don't match the context managed by this StageGL will be treated as a 2D context.
	 *
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method draw
	 * @param {CanvasRenderingContext2D | WebGLRenderingContext} context The context object to draw into.
	 * @param {Boolean} [ignoreCache=false] Indicates whether the draw operation should ignore any current cache. For
	 *  example, used for drawing the cache (to prevent it from simply drawing an existing cache back into itself).
	 * @return {Boolean} If the draw was handled by this function
	 */
	draw (context, ignoreCache = false) {
		if (context === this._webGLContext && StageGL.isWebGLActive(this._webGLContext)) {
			let gl = this._webGLContext;
			this._batchDraw(this, gl, ignoreCache);
			return true;
		} else {
			return super.draw(context, ignoreCache);
		}
	}

	/**
	 * Draws the target into the correct context, be it a canvas or Render Texture using WebGL.
	 *
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method cacheDraw
	 * @param {DisplayObject} target The object we're drawing into cache.
	 * For example, used for drawing the cache (to prevent it from simply drawing an existing cache back into itself).
	 * @param {Array} filters The filters we're drawing into cache.
	 * @param {BitmapCache} manager The BitmapCache instance looking after the cache
	 * @return {Boolean} If the draw was handled by this function
	 */
	cacheDraw (target, filters, manager) {
		if (StageGL.isWebGLActive(this._webGLContext)) {
			this._cacheDraw(target, filters, manager);
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Blocks, or frees a texture "slot" on the GPU. Can be useful if you are overflowing textures. When overflowing
	 * textures they are re-uploaded to the GPU every time they're encountered, this can be expensive with large textures.
	 * By blocking the slot you reduce available slots, potentially increasing draw calls, but mostly you prevent a
	 * texture being re-uploaded if it would have moved slots due to overflow.
	 *
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * For example, block the slot a background image is stored in so there is less re-loading of that image.
	 * @method protectTextureSlot
	 * @param  {Number} id The slot to be affected
	 * @param  {Boolean} [lock=false] Whether this slot is the one being locked.
	 */
	protectTextureSlot (id, lock = false) {
		if (id > this._maxTextureSlots || id < 0) {
			throw "Slot outside of acceptable range";
		}
		this._slotBlacklist[id] = !!lock;
	}

	/**
	 * Render textures can't draw into themselves so any item being used for renderTextures needs two to alternate between.
	 * This function creates, gets, and toggles the render surface between the two.
	 *
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method getTargetRenderTexture
	 * @param  {DisplayObject} target The object associated with the render textures, usually a cached object.
	 * @param  {Number} w The width to create the texture at.
	 * @param  {Number} h The height to create the texture at.
	 * @return {Objet}
	 * @todo fill in return type
	 */
	getTargetRenderTexture (target, w, h) {
		let result, toggle = false;
		let gl = this._webGLContext;
		if (target.__lastRT !== undefined && target.__lastRT === target.__rtA) { toggle = true; }
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
	}

	/**
	 * For every image encountered StageGL registers and tracks it automatically. This tracking can cause memory leaks
	 * if not purged. StageGL, by default, automatically fixes this. This does take performance and may unfortunately
	 * feature false positives. This function is for manual management of this memory instead of the automatic system.
	 *
	 * This function will recursively remove all textures found on the object, its children, cache, etc. It will uncache
	 * objects and remove any texture it finds REGARDLESS of whether it is currently in use elsewhere. It is up to the user
	 * to ensure that a texture in use is not removed.
	 *
	 * Textures in use, or to be used again shortly, should not be removed. This is simply for performance reasons.
	 * Removing a texture in use will cause the texture to have to be re-uploaded slowing rendering.
	 * @method releaseTexture
	 * @param  {DisplayObject | Texture | Image | Canvas} item An object that used the texture to be discarded.
	 */
	releaseTexture (item) {
		if (!item) { return; }

		// this is a container object
		if (item.children) {
			for (let i = 0, l = item.children.length; i < l; i++) {
				this.releaseTexture(item.children[i]);
			}
		}

		// this has a cache canvas
		if (item.cacheCanvas) {
			item.uncache();
		}

		let foundImage;
		if (item._storeID !== undefined) {
			// this is a texture itself
			if (item === this._textureDictionary[item._storeID]) {
				this._killTextureObject(item);
				item._storeID = undefined;
				return;
			}

			// this is an image or canvas
			foundImage = item;
		} else if (item._webGLRenderStyle === 2) {
			// this is a Bitmap class
			foundImage = item.image;
		} else if (item._webGLRenderStyle === 1) {
			// this is a SpriteSheet, we can't tell which image we used from the list easily so remove them all!
			for (let i = 0, l = item.spriteSheet._images.length; i < l; i++) {
				this.releaseTexture(item.spriteSheet._images[i]);
			}
			return;
		}

		// did we find anything
		if (foundImage === undefined) {
			if (this.vocalDebug) {
				console.log("No associated texture found on release");
			}
			return;
		}

		// remove it
		this._killTextureObject(this._textureDictionary[foundImage._storeID]);
		foundImage._storeID = undefined;
	}

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
	purgeTextures (count = 100) {
		const dict = this._textureDictionary;
		const l = dict.length;
		for (let i = 0; i < l; i++) {
			let item = dict[i];
			if (!item) { continue; }
			if (item._drawID + count <= this._drawID) {	// use draw not batch as draw is more indicative of time
				this._killTextureObject(item);
			}
		}
	}

	/**
	 * Try to set the max textures the system can handle. It should default to the hardware maximum, and lower values
	 * may limit performance. Some devices have been known to mis-report their max textures, or you may need a standard
	 * baseline cross devices for testing. Barring the previous suggestions, there is little need to call this function
	 * as the library will automatically try to find the best value.
	 *
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method updateSimultaneousTextureCount
	 * @param {Number} [count=1] The number of textures intended for simultaneous loading.
	 */
	updateSimultaneousTextureCount (count = 1) {
		// TODO: DHG: make sure API works in all instances, may be some issues with buffers etc I haven't foreseen
		let gl = this._webGLContext;
		let success = false;

		if (count < 1) { count = 1; }
		this._batchTextureCount = count;

		while (!success) {
			try {
				this._activeShader = this._fetchShaderProgram(gl);
				success = true;
			} catch(e) {
				if (this._batchTextureCount === 1) {
					throw `Cannot compile shader ${e}`;
				}

				this._batchTextureCount -= 4;
				if (this._batchTextureCount < 1) { this._batchTextureCount = 1; }

				if (this.vocalDebug) {
					// TODO-ES6: Directory search for quotations and + next to eachother for string interp.
					console.log("Reducing desired texture count due to errors: " + this._batchTextureCount);
				}
			}
		}
	}

	/**
	 * Update the WebGL viewport. Note that this does <strong>not</strong> update the canvas element's width/height, but
	 * the render surface's instead. This is necessary after resizing the canvas object.
	 * @method updateViewport
	 * @param {Integer} width The width of the render surface in pixels.
	 * @param {Integer} height The height of the render surface in pixels.
	 */
	updateViewport (width, height) {
		this._viewportWidth = width|0;
		this._viewportHeight = height|0;
		let gl = this._webGLContext;

		if (gl) {
			gl.viewport(0, 0, this._viewportWidth, this._viewportHeight);

			// WebGL works with a -1,1 space on its screen. It also follows Y-Up
			// we need to flip the y, scale and then translate the co-ordinates to match this
			// additionally we offset into they Y so the polygons are inside the camera's "clipping" plane
			this._projectionMatrix = new Float32Array([
				2 / this._viewportWidth,	0,								0,							0,
				0,							-2 / this._viewportHeight,		1,							0,
				0,							0,								1,							0,
				-1,							1,								0.1,						0
			]);
			// create the flipped version for use with render texture flipping
			// DHG: this would be a slice but some platforms don't offer slice's for Float32Array
			this._projectionMatrixFlip = new Float32Array([0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]);
			this._projectionMatrixFlip.set(this._projectionMatrix);
			this._projectionMatrixFlip[5] *= -1;
			this._projectionMatrixFlip[13] *= -1;
		}
	}

	/**
	 * Fetches the shader compiled and set up to work with the provided filter/object. The shader is compiled on first
	 * use and returned on subsequent calls.
	 * @method getFilterShader
	 * @param  {Filter|Object} filter The object which will provide the information needed to construct the filter shader.
	 * @return {Shader}
	 * @todo Review return type
	 */
	getFilterShader (filter) {
		if (!filter) { filter = this; }

		let gl = this._webGLContext;
		let targetShader = this._activeShader;

		if (filter._builtShader) {
			targetShader = filter._builtShader;
			if (targetShader.shaderParamSetup) {
				targetShader.shaderParamSetup(gl, this, targetShader);
			}
		} else {
			try {
				targetShader = this._fetchShaderProgram(
					gl, "filter",
					filter.VTX_SHADER_BODY, filter.FRAG_SHADER_BODY,
					filter.shaderParamSetup && filter.shaderParamSetup.bind(filter)
				);
				filter._builtShader = targetShader;
				targetShader._name = filter.toString();
			} catch (e) {
				// TODO-ES6: Place this under vocalDebug?
				console && console.log(e);
			}
		}
		return targetShader;
	}

	/**
	 * Returns a base texture that has no image or data loaded. Not intended for loading images. It may return `null`
	 * in some error cases, and trying to use a "null" texture can cause renders to fail.
	 * @method getBaseTexture
	 * @param  {uint} [w=1] The width of the texture in pixels, defaults to 1
	 * @param  {uint} [h=1] The height of the texture in pixels, defaults to 1
	 */
	getBaseTexture (w = 1, h = 1) {
		let width = Math.ceil(w > 0 ? w : 1);
		let height = Math.ceil(h > 0 ? h : 1);

		let gl = this._webGLContext;
		let texture = gl.createTexture();
		this.resizeTexture(texture, width, height);
		this.setTextureParams(gl, false);

		return texture;
	}

	/**
	 * Resizes a supplied texture element. It may return `null` in some error cases, such as when the texture is too large,
	 * an out of texture memory error occurs, etc. Trying to use a "null" texture can cause renders to fail.
	 * NOTE: The texture must have been made with "texImage2D", all default APIs in StageGL use this, so this note
	 * only matters for changes and plugins.
	 * @method resizeTexture
	 * @param  {WebGLTexture} texture The GL Texture to be modified.
	 * @param  {uint} [width=1] The width of the texture in pixels, defaults to 1
	 * @param  {uint} [height=1] The height of the texture in pixels, defaults to 1
	 */
	resizeTexture (texture, width = 1, height = 1) {
		let gl = this._webGLContext;
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(
			gl.TEXTURE_2D,				// target
			0,							// level of detail
			gl.RGBA,					// internal format
			width, height, 0,			// width, height, border (only for array/null sourced textures)
			gl.RGBA,					// format (match internal format)
			gl.UNSIGNED_BYTE,			// type of texture(pixel color depth)
			null						// image data, we can do null because we're doing array data
		);
		texture.width = width;
		texture.height = height;
	}

	/**
	 * Returns a base texture (see {{#crossLink "StageGL/getBaseTexture"}}{{/crossLink}}) for details. Also includes an
	 * attached and linked render buffer in `texture._frameBuffer`. RenderTextures  can be thought of as an internal
	 * canvas that can be drawn to.
	 * @method getRenderBufferTexture
	 * @param  {Number} w The width of the texture in pixels.
	 * @param  {Number} h The height of the texture in pixels.
	 * @return {Texture} the basic texture instance with a render buffer property.
	 */
	getRenderBufferTexture (w, h) {
		let gl = this._webGLContext;

		// get the texture
		let renderTexture = this.getBaseTexture(w, h);
		if (!renderTexture) { return null; }

		// get the frame buffer
		let frameBuffer = gl.createFramebuffer();
		if (!frameBuffer) { return null; }

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
		return renderTexture;
	}

	/**
	 * Common utility function used to apply the correct texture processing parameters for the bound texture.
	 * @method setTextureParams
	 * @param  {WebGLRenderingContext} gl  The canvas WebGL context object to draw into.
	 * @param  {Boolean} [isPOT=false] Marks whether the texture is "Power of Two", this may allow better quality.
	 */
	setTextureParams (gl, isPOT = false) {
		if (isPOT && this._antialias) {
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		} else {
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		}
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	}

	/**
	 * Changes the webGL clear, aka "background" color to the provided value. A transparent clear is recommended, as
	 * non-transparent colours may create undesired boxes around some visuals.
	 *
	 * The clear color will also be used for filters and other "render textures". The stage background will ignore the
	 * transparency value and display a solid color normally. For the stage to recognize and use transparency it must be
	 * created with the transparent flag set to `true` (see {{#crossLink "StageGL/constructor"}}{{/crossLink}})). Using
	 * "transparent white" to demonstrate, the valid data formats are as follows:
	 * <ul>
	 *     <li>"#FFF"</li>
	 *     <li>"#FFFFFF"</li>
	 *     <li>"#FFFFFF00"</li>
	 *     <li>"rgba(255,255,255,0.0)"</li>
	 *     <li>0xFFFFFF00</li>
	 * </ul>
	 * @method setClearColor
	 * @param {String|int} [color=0x00000000] The new color to use as the background
	 */
	setClearColor (color = 0x00000000) {
		let r, g, b, a, output;

		if (typeof color === "string") {
			if (color.indexOf("#") === 0) {
				if (color.length === 4) {
					color = `#${color.charAt(1)+color.charAt(1) + color.charAt(2)+color.charAt(2) + color.charAt(3)+color.charAt(3)}`;
				}
				r = Number(`0x${color.slice(1, 3)}`)/255;
				g = Number(`0x${color.slice(3, 5)}`)/255;
				b = Number(`0x${color.slice(5, 7)}`)/255;
				a = Number(`0x${color.slice(7, 9)}`)/255;
			} else if (color.indexOf("rgba(") === 0) {
				output = color.slice(5, -1).split(",");
				r = Number(output[0])/255;
				g = Number(output[1])/255;
				b = Number(output[2])/255;
				a = Number(output[3]);
			}
		} else {	// >>> is an unsigned shift which is what we want as 0x80000000 and up are negative values
			r = ((color & 0xFF000000) >>> 24)/255;
			g = ((color & 0x00FF0000) >>> 16)/255;
			b = ((color & 0x0000FF00) >>> 8)/255;
			a = (color & 0x000000FF)/255;
		}

		this._clearColor.r = r || 0;
		this._clearColor.g = g || 0;
		this._clearColor.b = b || 0;
		this._clearColor.a = a || 0;

		if (!this._webGLContext) { return; }
		this._webGLContext.clearColor(this._clearColor.r, this._clearColor.g, this._clearColor.b, this._clearColor.a);
	}

// private methods:
	/**
	 * Sets up and returns the WebGL context for the canvas. May return undefined in error scenarios. These can include
	 * situations wher the canvas element already has a context.
	 * @param  {Canvas} canvas The DOM canvas element to attach to
	 * @param  {Object} options The options to be handed into the WebGL object, see WebGL spec
	 * @method _fetchWebGLContext
	 * @protected
	 * @return {WebGLRenderingContext} The WebGL context, may return undefined in error scenarios
	 */
	_fetchWebGLContext (canvas, options) {
		let gl;

		try {
			gl = canvas.getContext("webgl", options) || canvas.getContext("experimental-webgl", options);
		} catch (e) {
			// don't do anything in catch, null check will handle it
		}

		if (!gl) {
			let msg = "Could not initialize WebGL";
			console.error?console.error(msg):console.log(msg);
		} else {
			gl.viewportWidth = canvas.width;
			gl.viewportHeight = canvas.height;
		}

		return gl;
	}

	/**
	 * Create the completed Shader Program from the vertex and fragment shaders. Allows building of custom shaders for
	 * filters. Once compiled, shaders are saved so that if the Shader code is dynamically reruns this function when it
	 * needs to change.
	 * @method _fetchShaderProgram
	 * @param  {WebGLRenderingContext} gl The canvas WebGL context object to draw into.
	 * @param  {String} [shaderName="regular"] Working values: "regular", "override", and "filter". Which type of shader to build.
	 * Filter and override both accept the custom params. Regular and override have all features. Filter is a special case reduced feature shader meant to be over-ridden.
	 * @param  {String} [customVTX] Extra vertex shader information to replace a regular draw, see
	 * {{#crossLink "StageGL/COVER_VERTEX_BODY"}}{{/crossLink}} for default and {{#crossLink "Filter"}}{{/crossLink}} for examples.
	 * @param  {String} [customFRAG] Extra fragment shader information to replace a regular draw, see
	 * {{#crossLink "StageGL/COVER_FRAGMENT_BODY"}}{{/crossLink}} for default and {{#crossLink "Filter"}}{{/crossLink}} for examples.
	 * @param  {Function} [shaderParamSetup] Function to run so custom shader parameters can get applied for the render.
	 * @protected
	 * @return {ShaderProgram} The compiled and linked shader
	 */
	_fetchShaderProgram (gl, shaderName = "regular", customVTX, customFRAG, shaderParamSetup) {
		gl.useProgram(null); // safety to avoid collisions

		// build the correct shader string out of the right headers and bodies
		let targetFrag, targetVtx;
		switch (shaderName) {
			case "filter":
				targetVtx = StageGL.COVER_VERTEX_HEADER + (customVTX || StageGL.COVER_VERTEX_BODY);
				targetFrag = StageGL.COVER_FRAGMENT_HEADER + (customFRAG || StageGL.COVER_FRAGMENT_BODY);
				break;
			case "particle": //TODO
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

		// create the separate vars
		let vertexShader = this._createShader(gl, gl.VERTEX_SHADER, targetVtx);
		let fragmentShader = this._createShader(gl, gl.FRAGMENT_SHADER, targetFrag);

		// link them together
		let shaderProgram = gl.createProgram();
		gl.attachShader(shaderProgram, vertexShader);
		gl.attachShader(shaderProgram, fragmentShader);
		gl.linkProgram(shaderProgram);
		shaderProgram._type = shaderName;

		// check compile status
		if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
			gl.useProgram(this._activeShader);
			throw gl.getProgramInfoLog(shaderProgram);
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
					shaderParamSetup(gl, this, shaderProgram);
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

				let samplers = [];
				for (let i = 0; i < this._batchTextureCount; i++) {
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
	}

	/**
	 * Creates a shader from the specified string. Replaces several template items marked like `{{` `key` `}}``.
	 * @method _createShader
	 * @param  {WebGLRenderingContext} gl The canvas WebGL context object to draw into.
	 * @param  {Number} type The type of shader to create. gl.VERTEX_SHADER | gl.FRAGMENT_SHADER
	 * @param  {String} str The definition for the shader.
	 * @return {WebGLShader}
	 * @protected
	 */
	_createShader (gl, type, str) {
		// inject the static number
		str = str.replace(/{{count}}/g, this._batchTextureCount);

		// resolve issue with no dynamic samplers by creating correct samplers in if else chain
		let insert = "";
		for (let i = 1; i<this._batchTextureCount; i++) {
			insert += `} else if (src === ${i}) { color = texture2D(uSampler[${i}], vTextureCoord);`;
		}
		str = str.replace(/{{alternates}}/g, insert)
						 .replace(/{{premultiply}}/g, this._premultiply ? "/color.a" : "");

		// actually compile the shader
		let shader = gl.createShader(type);
		gl.shaderSource(shader, str)
			.compileShader(shader);

		// check compile status
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			throw gl.getShaderInfoLog(shader);
		}

		return shader;
	}

	/**
	 * Sets up the necessary vertex property buffers, including position and U/V.
	 * @method _createBuffers
	 * @param {WebGLRenderingContext} gl
	 * @protected
	 */
	_createBuffers (gl) {
		let groupCount = this._maxCardsPerBatch * StageGL.INDICIES_PER_CARD;
		let groupSize;

		// INFO:
		// all buffers are created using this pattern
		// create a WebGL buffer
		// attach it to context
		// figure out how many parts it has to an entry
		// fill it with empty data to reserve the memory
		// attach the empty data to the GPU
		// track the sizes on the buffer object

		// INFO:
		// a single buffer may be optimal in some situations and would be approached like this,
		// currently not implemented due to lack of need and potential complications with drawCover

		// var vertexBuffer = this._vertexBuffer = gl.createBuffer();
		// gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		// groupSize = 2 + 2 + 1 + 1; //x/y, u/v, index, alpha
		// var vertexData = this._vertexData = new Float32Array(groupCount * groupSize);
		// for (i=0; i<vertexData.length; i+=groupSize) {
		// 	vertexData[i+0] = vertexData[i+1] = 0;
		// 	vertexData[i+2] = vertexData[i+3] = 0.5;
		// 	vertexData[i+4] = 0;
		// 	vertexData[i+5] = 1;
		// }
		// vertexBuffer.itemSize = groupSize;
		// vertexBuffer.numItems = groupCount;
		// TODO bechmark and test using unified buffer

		// the actual position information
		let vertexPositionBuffer = this._vertexPositionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
		groupSize = 2;
		let vertices = this._vertices = new Float32Array(groupCount * groupSize);
		for (let i=0, l=vertices.length; i<l; i+=groupSize) { vertices[i] = vertices[i+1] = 0; }
		gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);
		vertexPositionBuffer.itemSize = groupSize;
		vertexPositionBuffer.numItems = groupCount;

		// where on the texture it gets its information
		let uvPositionBuffer = this._uvPositionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, uvPositionBuffer);
		groupSize = 2;
		let uvs = this._uvs = new Float32Array(groupCount * groupSize);
		for(let i=0, l=uvs.length; i<l; i+=groupSize) { uvs[i] = uvs[i+1] = 0; }
		gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.DYNAMIC_DRAW);
		uvPositionBuffer.itemSize = groupSize;
		uvPositionBuffer.numItems = groupCount;

		// what texture it should use
		let textureIndexBuffer = this._textureIndexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, textureIndexBuffer);
		groupSize = 1;
		let indices = this._indices = new Float32Array(groupCount * groupSize);
		for(let i=0, l=indices.length; i<l; i++) { indices[i] = 0; }
		gl.bufferData(gl.ARRAY_BUFFER, indices, gl.DYNAMIC_DRAW);
		textureIndexBuffer.itemSize = groupSize;
		textureIndexBuffer.numItems = groupCount;

		// what alpha it should have
		let alphaBuffer = this._alphaBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, alphaBuffer);
		groupSize = 1;
		let alphas = this._alphas = new Float32Array(groupCount * groupSize);
		for(let i=0, l=alphas.length; i<l; i++) { alphas[i] = 1; }
		gl.bufferData(gl.ARRAY_BUFFER, alphas, gl.DYNAMIC_DRAW);
		alphaBuffer.itemSize = groupSize;
		alphaBuffer.numItems = groupCount;
	}

	/**
	 * Do all the setup steps for textures in the system.
	 * @method _initTextures
	 * @protected
	 */
	_initTextures () {
		//TODO: DHG: add a cleanup routine in here in case this happens mid stream

		// reset counters
		this._lastTextureInsert = -1;

		// clear containers
		this._textureDictionary = [];
		this._textureIDs = {};
		this._baseTextures = [];
		this._batchTextures = [];

		// fill in blanks as it helps the renderer be stable while textures are loading and reduces need for safety code
		for (let i=0; i<this._batchTextureCount;i++) {
			let t = this.getBaseTexture();
			this._baseTextures[i] = this._batchTextures[i] = t;
			if (!t) {
				throw "Problems creating basic textures, known causes include using too much VRAM by not releasing WebGL texture instances";
			}
		}
	}

	/**
	 * Load a specific texture, accounting for potential delay, as it might not be preloaded
	 * @method _loadTextureImage
	 * @param {WebGLRenderingContext} gl
	 * @param {Image} image Actual image to be loaded
	 * @return {WebGLTexture} The resulting Texture object
	 * @protected
	 */
	_loadTextureImage (gl, image) {
		let src = image.src;

		if (!src) {
			// one time canvas property setup
			image._isCanvas = true;
			src = image.src = `canvas_${this._lastTrackedCanvas++}`;
		}

		// put the texture into our storage system
		let storeID = this._textureIDs[src];
		if (storeID === undefined) {
			storeID = this._textureIDs[src] = this._textureDictionary.length;
		}
		if (this._textureDictionary[storeID] === undefined) {
			this._textureDictionary[storeID] = this.getBaseTexture();
		}

		let texture = this._textureDictionary[storeID];

		if (texture) {
			// get texture params all set up
			texture._batchID = this._batchID;
			texture._storeID = storeID;
			texture._imageData = image;
			this._insertTextureInBatch(gl, texture);

			// get the data into the texture or wait for it to load
			image._storeID = storeID;
			if (image.complete || image.naturalWidth || image._isCanvas) {	// is it already loaded
				this._updateTextureImageData(gl, image);
			} else  {
				image.addEventListener("load", this._updateTextureImageData.bind(this, gl, image));
			}
		} else {
			// we really really should have a texture, try to recover the error by using a saved empty texture so we don't crash
			let msg = "Problems creating basic textures, known causes include using too much VRAM by not releasing WebGL texture instances";
			(console.error && console.error(msg)) || console.log(msg);

			texture = this._baseTextures[0];
			texture._batchID = this._batchID;
			texture._storeID = -1;
			texture._imageData = texture;
			this._insertTextureInBatch(gl, texture);
		}

		return texture;
	}

	/**
	 * @method _updateTextureImageData
	 * Necessary to upload the actual image data to the GPU. Without this the texture will be blank. Called automatically
	 * in most cases due to loading and caching APIs. Flagging an image source with `_invalid = true` will trigger this
	 * next time the image is rendered.
	 * @param {WebGLRenderingContext} gl
	 * @param {Image | Canvas} image The image data to be uploaded
	 * @protected
	 */
	_updateTextureImageData (gl, image) {
		// the bitwise & is intentional, cheap exponent 2 check
		let isNPOT = (image.width & image.width-1) || (image.height & image.height-1);
		let texture = this._textureDictionary[image._storeID];

		gl.activeTexture(gl.TEXTURE0 + texture._activeIndex);
		gl.bindTexture(gl.TEXTURE_2D, texture);

		texture.isPOT = !isNPOT;
		this.setTextureParams(gl, texture.isPOT);

		try {
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
		} catch(e) {
			let errString = "\nAn error has occurred. This is most likely due to security restrictions on WebGL images with local or cross-domain origins";
			if (console.error) {
				//TODO: LM: I recommend putting this into a log function internally, since you do it so often, and each is implemented differently.
				console.error(e, errString);
			} else {
				console && console.log(e, errString);
			}
		}

		image._invalid = false;

		texture._w = image.width;
		texture._h = image.height;

		if (this.vocalDebug) {
			if (isNPOT) {
				console.warn("NPOT(Non Power of Two) Texture: "+ image.src);
			}
			if (image.width > gl.MAX_TEXTURE_SIZE || image.height > gl.MAX_TEXTURE_SIZE){
				console && console.error("Oversized Texture: "+ image.width+"x"+image.height +" vs "+ gl.MAX_TEXTURE_SIZE +"max");
			}
		}
	}

	/**
	 * Adds the texture to a spot in the current batch, forcing a draw if no spots are free.
	 * @method _insertTextureInBatch
	 * @param {WebGLRenderingContext} gl The canvas WebGL context object to draw into.
	 * @param {WebGLTexture} texture The texture to be inserted.
	 * @protected
	 */
	_insertTextureInBatch (gl, texture) {
		// if it wasn't used last batch
		if (this._batchTextures[texture._activeIndex] !== texture) {
			// we've got to find it a a spot.
			let found = -1;
			let start = (this._lastTextureInsert+1) % this._batchTextureCount;
			let look = start;
			do {
				if (this._batchTextures[look]._batchID != this._batchID && !this._slotBlacklist[look]) {
					found = look;
					break;
				}
				look = (look+1) % this._batchTextureCount;
			} while (look !== start);

			// we couldn't find anywhere for it go, meaning we're maxed out
			if (found === -1) {
				this.batchReason = "textureOverflow";
				this._drawBuffers(gl);		// <------------------------------------------------------------------------
				this.batchCardCount = 0;
				found = start;
			}

			// lets put it into that spot
			this._batchTextures[found] = texture;
			texture._activeIndex = found;
			let image = texture._imageData;
			if (image && image._invalid && texture._drawID !== undefined) {
				this._updateTextureImageData(gl, image);
			} else {
				gl.activeTexture(gl.TEXTURE0 + found);
				gl.bindTexture(gl.TEXTURE_2D, texture);
				this.setTextureParams(gl);
			}
			this._lastTextureInsert = found;
		} else {
			let image = texture._imageData;
			if (texture._storeID != undefined && image._invalid) {
				this._updateTextureImageData(gl, image);
			}
		}

		texture._drawID = this._drawID;
		texture._batchID = this._batchID;
	}

	/**
	 * Remove and clean the texture, expects a texture and is inflexible. Mostly for internal use, recommended to call
	 * {{#crossLink "StageGL/releaseTexture"}}{{/crossLink}} instead as it will call this with the correct texture object(s).
	 * Note: Testing shows this may not happen immediately, have to wait for WebGL to have actually adjust memory.
	 * @method _killTextureObject
	 * @param {Texture} tex The texture to be cleaned out
	 * @protected
	 */
	_killTextureObject (tex) {
		if (!tex) { return; }
		let gl = this._webGLContext;

		// remove linkage
		if (tex._storeID !== undefined && tex._storeID >= 0) {
			this._textureDictionary[tex._storeID] = undefined;
			for (let n in this._textureIDs) {
				if (this._textureIDs[n] === tex._storeID) { delete this._textureIDs[n]; }
			}
			tex._imageData._storeID = tex._storeID = undefined;
		}

		// make sure to drop it out of an active slot
		if (tex._activeIndex !== undefined && this._batchTextures[tex._activeIndex] === tex) {
			this._batchTextures[tex._activeIndex] = this._baseTextures[tex._activeIndex];
		}

		// remove buffers if present
		try {
			if (tex._frameBuffer) { gl.deleteFramebuffer(tex._frameBuffer); }
			tex._frameBuffer = undefined;
		} catch(e) {
			/* suppress delete errors because it's already gone or didn't need deleting probably */
			if (this.vocalDebug) { console.log(e); }
		}

		// remove entry
		try {
			gl.deleteTexture(tex);
		} catch(e) {
			/* suppress delete errors because it's already gone or didn't need deleting probably */
			if (this.vocalDebug) { console.log(e); }
		}
	}

	/**
	 * Store or restore current batch textures into a backup array
	 * @method _backupBatchTextures
	 * @param {Boolean} restore Perform a restore instead of a store.
	 * @param {Array} [target=this._backupTextures] Where to perform the backup, defaults to internal backup.
	 * @protected
	 */
	_backupBatchTextures (restore, target) {
		let gl = this._webGLContext;

		if (!this._backupTextures) { this._backupTextures = []; }
		if (target === undefined) { target = this._backupTextures; }

		for (let i=0; i<this._batchTextureCount; i++) {
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

		if (restore && target === this._backupTextures) { this._backupTextures = []; }
	}

	/**
	 * Begin the drawing process for a regular render.
	 * @method _batchDraw
	 * @param {WebGLRenderingContext} gl The canvas WebGL context object to draw into.
	 * @param {Stage || Container} sceneGraph {{#crossLink "Container"}}{{/crossLink}} object with all that needs to rendered, preferably a Stage.
	 * @param {Boolean} ignoreCache
	 * @protected
	 * @todo Review the ignoreCache parameter. Is it a context or a boolean?
	 */
	_batchDraw (sceneGraph, gl, ignoreCache) {
		if (this._isDrawing > 0) {
			this._drawBuffers(gl);
		}
		this._isDrawing++;
		this._drawID++;

		this.batchCardCount = 0;
		this.depth = 0;

		this._appendToBatchGroup(sceneGraph, gl, new Matrix2D(), this.alpha, ignoreCache);

		this.batchReason = "drawFinish";
		this._drawBuffers(gl);								// <--------------------------------------------------------
		this._isDrawing--;
	}

	/**
	 * Perform the drawing process to fill a specific cache texture, including applying filters.
	 * @method _cacheDraw
	 * @param {DisplayObject} target The object we're drawing into the cache. For example, used for drawing the cache
	 * (to prevent it from simply drawing an existing cache back into itself).
	 * @param {Array} filters The filters we're drawing into cache.
	 * @param {BitmapCache} manager The BitmapCache instance looking after the cache
	 * @protected
	 */
	_cacheDraw (target, filters, manager) {
		/*
		Implicitly there are 4 modes to this function: filtered-sameContext, filtered-uniqueContext, sameContext, uniqueContext.
		Each situation must be handled slightly differently as 'sameContext' or 'uniqueContext' define how the output works,
		one drawing directly into the main context and the other drawing into a stored renderTexture respectively.
		When the draw is a 'filtered' draw, the filters are applied sequentially and will draw into saved textures repeatedly.
		Once the final filter is done the final output is treated depending upon whether it is a same or unique context.
		The internal complexity comes from reducing over-draw, shared code, and issues like textures needing to be flipped
		sometimes when written to render textures.
		*/
		let gl = this._webGLContext;
		let renderTexture;
		let shaderBackup = this._activeShader;
		let blackListBackup = this._slotBlacklist;
		let lastTextureSlot = this._maxTextureSlots-1;
		let wBackup = this._viewportWidth, hBackup = this._viewportHeight;

		// protect the last slot so that we have somewhere to bind the renderTextures so it doesn't get upset
		this.protectTextureSlot(lastTextureSlot, true);

		// create offset container for drawing item
		let mtx = target.getMatrix();
		mtx = mtx.clone();
		mtx.scale(1/manager.scale, 1/manager.scale);
		mtx = mtx.invert();
		mtx.translate(-manager.offX/manager.scale, -manager.offY/manager.scale);
		let container = this._cacheContainer;
		container.children = [target];
		container.transformMatrix = mtx;

		this._backupBatchTextures(false);

		let filterCount = filters && filters.length;
		if (filterCount) {
			//this._backupBatchTextures(false);
			this._drawFilters(target, filters, manager);
			//this._backupBatchTextures(true);
		} else {
			// is this for another stage or mine?
			if (this.isCacheControlled) {
				// draw item to canvas				I -> C
				gl.clear(gl.COLOR_BUFFER_BIT);
				this._batchDraw(container, gl, true);
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
				this.updateViewport(wBackup, hBackup);
				//this._backupBatchTextures(true);
			}
		}

		this._backupBatchTextures(true);

		this.protectTextureSlot(lastTextureSlot, false);
		this._activeShader = shaderBackup;
		this._slotBlacklist = blackListBackup;
	}

	/**
	 * Sub portion of _cacheDraw, split off for readability. Do not call independently.
	 * @method _drawFilters
	 * @param {DisplayObject} target The object we're drawing with a filter.
	 * @param {Array} filters The filters we're drawing into cache.
	 * @param {BitmapCache} manager The BitmapCache instance looking after the cache
	 * @protected
	 * @todo Please doc this method
	 */
	_drawFilters (target, filters, manager) {
		let gl = this._webGLContext;
		let renderTexture;
		let lastTextureSlot = this._maxTextureSlots-1;
		let wBackup = this._viewportWidth, hBackup = this._viewportHeight;

		let container = this._cacheContainer;
		let filterCount = filters && filters.length;

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

		let flipY = false;

		// apply each filter in order, but remember to toggle used texture and render buffer
		for (let i=0; i<filterCount; i++) {
			let filter = filters[i];

			// swap to correct shader
			this._activeShader = this.getFilterShader(filter);
			if (!this._activeShader) { continue; }

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
				flipY = !flipY;
			}
		}

		// is this for another stage or mine
		if (this.isCacheControlled) {
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
			this.updateViewport(wBackup, hBackup);

			// draw result to canvas			R -> C
			this._activeShader = this.getFilterShader(this);
			gl.clear(gl.COLOR_BUFFER_BIT);
			this._drawCover(gl, flipY);
		} else {
			//TODO: DHG: this is less than ideal a flipped inital render for this circumstance might help, adjust the perspective matrix?
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

			// make sure the last texture is the active thing to draw
			target.cacheCanvas = renderTexture;
		}
	}

	/**
	 * Add all the contents of a container to the pending buffers, called recursively on each container. This may
	 * trigger a draw if a buffer runs out of space. This is the main workforce of the render loop.
	 * @method _appendToBatchGroup
	 * @param {Container} container The {{#crossLink "Container"}}{{/crossLink}} that contains everything to be drawn.
	 * @param {WebGLRenderingContext} gl The canvas WebGL context object to draw into.
	 * @param {Matrix2D} concatMtx The effective (concatenated) transformation matrix when beginning this container
	 * @param {Number} concatAlpha The effective (concatenated) alpha when beginning this container
	 * @param {Boolean} ignoreCache Don't use an element's cache during this draw
	 * @protected
	 */
	_appendToBatchGroup (container, gl, concatMtx, concatAlpha, ignoreCache) {
		// sort out shared properties
		if (!container._glMtx) { container._glMtx = new Matrix2D(); }
		let cMtx = container._glMtx;
		cMtx.copy(concatMtx);
		if (container.transformMatrix) {
			cMtx.appendMatrix(container.transformMatrix);
		} else {
			cMtx.appendTransform(
				container.x, container.y,
				container.scaleX, container.scaleY,
				container.rotation, container.skewX, container.skewY,
				container.regX, container.regY
			);
		}

		// sub components of figuring out the position an object holds
		let subL, subT, subR, subB;

		// actually apply its data to the buffers
		const l = container.numChildren;
		for (let i = 0; i < l; i++) {
			let item = container.children[i];

			if (!(item.visible && concatAlpha)) { continue; }
			if (!item.cacheCanvas || ignoreCache) {
				if (item.children) {
					this._appendToBatchGroup(item, gl, cMtx, item.alpha * concatAlpha);
					continue;
				}
			}

			// check for overflowing batch, if yes then force a render
			if (this.batchCardCount+1 > this._maxCardsPerBatch) {														//TODO: DHG: consider making this polygon count dependant for things like vector draws
				this.batchReason = "vertexOverflow";
				this._drawBuffers(gl);					// <------------------------------------------------------------
				this.batchCardCount = 0;
			}

			// keep track of concatenated position
			if (!item._glMtx) { item._glMtx = new Matrix2D(); }
			let iMtx = item._glMtx;
			iMtx.copy(cMtx);
			if (item.transformMatrix) {
				iMtx.appendMatrix(item.transformMatrix);
			} else {
				iMtx.appendTransform(
					item.x, item.y,
					item.scaleX, item.scaleY,
					item.rotation, item.skewX, item.skewY,
					item.regX, item.regY
				);
			}

			let uvRect, texIndex, image, frame, texture, src;

			if (item._webGLRenderStyle === 2 || (item.cacheCanvas && !ignoreCache)) {			// BITMAP / Cached Canvas
				image = (ignoreCache?false:item.cacheCanvas) || item.image;
			} else if (item._webGLRenderStyle === 1) {											// SPRITE
				frame = item.spriteSheet.getFrame(item.currentFrame);	//TODO: Faster way?
				image = frame.image;
			} else {																			// MISC (DOM objects render themselves later)
				continue;
			}

			let uvs = this._uvs;
			let vertices = this._vertices;
			let texI = this._indices;
			let alphas = this._alphas;

			// calculate texture
			if (!image) { continue; }
			if (image._storeID === undefined) {
				// this texture is new to us so load it and add it to the batch
				texture = this._loadTextureImage(gl, image);
				this._insertTextureInBatch(gl, texture);
			} else {
				// fetch the texture (render textures know how to look themselves up to simplify this logic)
				texture = this._textureDictionary[image._storeID];
				if (!texture){
					if (this.vocalDebug){ console.log("Texture should not be looked up while not being stored."); }
					continue;
				}

				// put it in the batch if needed
				if (texture._batchID !== this._batchID) {
					this._insertTextureInBatch(gl, texture);
				}
			}
			texIndex = texture._activeIndex;

			if (item._webGLRenderStyle === 2 || (item.cacheCanvas && !ignoreCache)) {			// BITMAP / Cached Canvas
				if (item.sourceRect) {
					// calculate uvs
					if (!item._uvRect) { item._uvRect = {}; }
					src = item.sourceRect;
					uvRect = item._uvRect;
					uvRect.t = (src.x)/image.width;
					uvRect.l = (src.y)/image.height;
					uvRect.b = (src.x + src.width)/image.width;
					uvRect.r = (src.y + src.height)/image.height;

					// calculate vertices
					subL = 0;							subT = 0;
					subR = src.width+subL;				subB = src.height+subT;
				} else {
					// calculate uvs
					// calculate vertices
					if (item.cacheCanvas) {
						src = item.bitmapCache;
						uvRect = StageGL.UV_RECT;
						subL = src.x;					subT = src.y;
						subR = src.width+subL;			subB = src.height+subT;
					} else {
						uvRect = StageGL.UV_RECT;
						subL = 0;						subT = 0;
						subR = image.width+subL;		subB = image.height+subT;
					}
				}
			} else if (item._webGLRenderStyle === 1) {											// SPRITE
				let rect = frame.rect;

				// calculate uvs
				uvRect = frame.uvRect;
				if (!uvRect) {
					uvRect = StageGL.buildUVRects(item.spriteSheet, item.currentFrame, false);
				}

				// calculate vertices
				subL = -frame.regX;								subT = -frame.regY;
				subR = rect.width-frame.regX;					subB = rect.height-frame.regY;
			}

			// These must be calculated here else a forced draw might happen after they're set
			let offV1 = this.batchCardCount*StageGL.INDICIES_PER_CARD;		// offset for 1 component vectors
			let offV2 = offV1*2;											// offset for 2 component vectors

			//DHG: See Matrix2D.transformPoint for why this math specifically
			// apply vertices
			vertices[offV2] =		subL *iMtx.a + subT *iMtx.c +iMtx.tx;		vertices[offV2+1] =		subL *iMtx.b + subT *iMtx.d +iMtx.ty;
			vertices[offV2+2] =		subL *iMtx.a + subB *iMtx.c +iMtx.tx;		vertices[offV2+3] =		subL *iMtx.b + subB *iMtx.d +iMtx.ty;
			vertices[offV2+4] =		subR *iMtx.a + subT *iMtx.c +iMtx.tx;		vertices[offV2+5] =		subR *iMtx.b + subT *iMtx.d +iMtx.ty;
			vertices[offV2+6] =		vertices[offV2+2];							vertices[offV2+7] =		vertices[offV2+3];
			vertices[offV2+8] =		vertices[offV2+4];							vertices[offV2+9] =		vertices[offV2+5];
			vertices[offV2+10] =	subR *iMtx.a + subB *iMtx.c +iMtx.tx;		vertices[offV2+11] =	subR *iMtx.b + subB *iMtx.d +iMtx.ty;

			// apply uvs
			uvs[offV2] =	uvRect.l;			uvs[offV2+1] =	uvRect.t;
			uvs[offV2+2] =	uvRect.l;			uvs[offV2+3] =	uvRect.b;
			uvs[offV2+4] =	uvRect.r;			uvs[offV2+5] =	uvRect.t;
			uvs[offV2+6] =	uvRect.l;			uvs[offV2+7] =	uvRect.b;
			uvs[offV2+8] =	uvRect.r;			uvs[offV2+9] =	uvRect.t;
			uvs[offV2+10] =	uvRect.r;			uvs[offV2+11] =	uvRect.b;

			// apply texture
			texI[offV1] = texI[offV1+1] = texI[offV1+2] = texI[offV1+3] = texI[offV1+4] = texI[offV1+5] = texIndex;

			// apply alpha
			alphas[offV1] = alphas[offV1+1] = alphas[offV1+2] = alphas[offV1+3] = alphas[offV1+4] = alphas[offV1+5] = item.alpha * concatAlpha;

			this.batchCardCount++;
		}
	}

	/**
	 * Draws all the currently defined cards in the buffer to the render surface.
	 * @method _drawBuffers
	 * @param {WebGLRenderingContext} gl The canvas WebGL context object to draw into.
	 * @protected
	 */
	_drawBuffers (gl) {
		if (this.batchCardCount <= 0) { return; }	// prevents error logs on stages filled with un-renederable content.

		if (this.vocalDebug) {
			console.log(`Draw[${this._drawID}:${this._batchID}] : ${this.batchReason}`);
		}
		let shaderProgram = this._activeShader;
		let vertexPositionBuffer = this._vertexPositionBuffer;
		let textureIndexBuffer = this._textureIndexBuffer;
		let uvPositionBuffer = this._uvPositionBuffer;
		let alphaBuffer = this._alphaBuffer;

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

		for (let i = 0; i < this._batchTextureCount; i++) {
			let texture = this._batchTextures[i];
			gl.activeTexture(gl.TEXTURE0 + i);
			gl.bindTexture(gl.TEXTURE_2D, texture);
			this.setTextureParams(gl, texture.isPOT);
		}

		gl.drawArrays(gl.TRIANGLES, 0, this.batchCardCount*StageGL.INDICIES_PER_CARD);
		this._batchID++;
	}

	/**
	 * Draws a card that covers the entire render surface. Mainly used for filters.
	 * @method _drawBuffers
	 * @param {WebGLRenderingContext} gl The canvas WebGL context object to draw into.
	 * @param {Boolean} flipY Covers are used for things like RenderTextures and because of 3D vs Canvas space this can
	 * end up meaning the `y` space sometimes requires flipping in the render.
	 * @protected
	 */
	_drawCover (gl, flipY) {
		if (this._isDrawing > 0) {
			this._drawBuffers(gl);
		}

		if (this.vocalDebug) {
			console.log(`Draw[${this._drawID}:${this._batchID}] : Cover`);
		}
		let shaderProgram = this._activeShader;
		let vertexPositionBuffer = this._vertexPositionBuffer;
		let uvPositionBuffer = this._uvPositionBuffer;

		gl.clear(gl.COLOR_BUFFER_BIT);
		gl.useProgram(shaderProgram);

		gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, StageGL.COVER_VERT);
		gl.bindBuffer(gl.ARRAY_BUFFER, uvPositionBuffer);
		gl.vertexAttribPointer(shaderProgram.uvPositionAttribute, uvPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, flipY?StageGL.COVER_UV_FLIP:StageGL.COVER_UV);

		gl.uniform1i(shaderProgram.samplerUniform, 0);
		gl.uniform1f(shaderProgram.uprightUniform, flipY?0:1);

		gl.drawArrays(gl.TRIANGLES, 0, StageGL.INDICIES_PER_CARD);
	}

}

// static properties:
/**
 * The number of properties defined per vertex (x, y, textureU, textureV, textureIndex, alpha)
 * @property VERTEX_PROPERTY_COUNT
 * @static
 * @final
 * @type {Number}
 * @default 6
 * @readonly
 */
/**
 * The number of triangle indices it takes to form a Card. 3 per triangle, 2 triangles.
 * @property INDICIES_PER_CARD
 * @static
 * @final
 * @type {Number}
 * @default 6
 * @readonly
 */
/**
 * The default value for the maximum number of cards we want to process in a batch. See {{#crossLink "StageGL/WEBGL_MAX_INDEX_NUM:property"}}{{/crossLink}}
 * for a hard limit.
 * @property DEFAULT_MAX_BATCH_SIZE
 * @static
 * @final
 * @type {Number}
 * @default 10000
 * @readonly
 */
/**
 * The maximum size WebGL allows for element index numbers. Uses a 16 bit unsigned integer. It takes 6 indices to
 * make a unique card.
 * @property WEBGL_MAX_INDEX_NUM
 * @static
 * @final
 * @type {Number}
 * @default 65536
 * @readonly
 */
/**
 * Default U/V rect for dealing with full coverage from an image source.
 * @property UV_RECT
 * @static
 * @final
 * @type {Object}
 * @default {t:0, l:0, b:1, r:1}
 * @readonly
 */
/**
 * Vertex positions for a card that covers the entire render. Used with render targets primarily.
 * @property COVER_VERT
 * @static
 * @final
 * @type {Float32Array}
 * @readonly
 */
/**
 * U/V for {{#crossLink "StageGL/COVER_VERT:property"}}{{/crossLink}}.
 * @property COVER_UV
 * @static
 * @final
 * @type {Float32Array}
 * @readonly
 */
/**
 * Flipped U/V for {{#crossLink "StageGL:COVER_VERT:property"}}{{/crossLink}}.
 * @property COVER_UV_FLIP
 * @static
 * @final
 * @type {Float32Array}
 * @readonly
 */
/**
 * Portion of the shader that contains the "varying" properties required in both vertex and fragment shaders. The
 * regular shader is designed to render all expected objects. Shader code may contain templates that are replaced
 * pre-compile.
 * @property REGULAR_VARYING_HEADER
 * @static
 * @final
 * @type {String}
 * @readonly
 */
/**
 * Actual full header for the vertex shader. Includes the varying header. The regular shader is designed to render
 * all expected objects. Shader code may contain templates that are replaced pre-compile.
 * @property REGULAR_VERTEX_HEADER
 * @static
 * @final
 * @type {String}
 * @readonly
 */
/**
 * Actual full header for the fragment shader. Includes the varying header. The regular shader is designed to render
 * all expected objects. Shader code may contain templates that are replaced pre-compile.
 * @property REGULAR_FRAGMENT_HEADER
 * @static
 * @final
 * @type {String}
 * @readonly
 */
/**
 * Body of the vertex shader. The regular shader is designed to render all expected objects. Shader code may contain
 * templates that are replaced pre-compile.
 * @property REGULAR_VERTEX_BODY
 * @static
 * @final
 * @type {String}
 * @readonly
 */
/**
 * Body of the fragment shader. The regular shader is designed to render all expected objects. Shader code may
 * contain templates that are replaced pre-compile.
 * @property REGULAR_FRAGMENT_BODY
 * @static
 * @final
 * @type {String}
 * @readonly
 */
// TODO: DHG: a real particle shader
/**
 * @property PARTICLE_VERTEX_BODY
 * @todo
 * @final
 * @static
 * @type {String}
 * @readonly
 */
/**
 * @property PARTICLE_FRAGMENT_BODY
 * @todo
 * @final
 * @static
 * @type {String}
 * @readonly
 */
/**
 * Portion of the shader that contains the "varying" properties required in both vertex and fragment shaders. The
 * cover shader is designed to be a simple vertex/uv only texture render that covers the render surface. Shader
 * code may contain templates that are replaced pre-compile.
 * @property COVER_VARYING_HEADER
 * @static
 * @final
 * @type {String}
 * @readonly
 */
/**
 * Actual full header for the vertex shader. Includes the varying header. The cover shader is designed to be a
 * simple vertex/uv only texture render that covers the render surface. Shader code may contain templates that are
 * replaced pre-compile.
 * @property COVER_VERTEX_HEADER
 * @static
 * @final
 * @type {String}
 * @readonly
 */
/**
 * Actual full header for the fragment shader. Includes the varying header. The cover shader is designed to be a
 * simple vertex/uv only texture render that covers the render surface. Shader code may contain templates that are
 * replaced pre-compile.
 * @property COVER_FRAGMENT_HEADER
 * @static
 * @final
 * @type {String}
 * @readonly
 */
/**
 * Body of the vertex shader. The cover shader is designed to be a simple vertex/uv only texture render that covers
 * the render surface. Shader code may contain templates that are replaced pre-compile.
 * @property COVER_VERTEX_BODY
 * @static
 * @final
 * @type {String}
 * @readonly
 */
/**
 * Body of the fragment shader. The cover shader is designed to be a simple vertex/uv only texture render that
 * covers the render surface. Shader code may contain templates that are replaced pre-compile.
 * @property COVER_FRAGMENT_BODY
 * @static
 * @final
 * @type {String}
 * @readonly
 */
{
	StageGL.VERTEX_PROPERTY_COUNT = 6;
	StageGL.INDICIES_PER_CARD = 6;
	StageGL.DEFAULT_MAX_BATCH_SIZE = 10000;
	StageGL.WEBGL_MAX_INDEX_NUM = Math.pow(2, 16);
	StageGL.UV_RECT = {t:0, l:0, b:1, r:1};

	StageGL.COVER_VERT = new Float32Array([
		-1,		 1,		// TL
		1,		 1,		// TR
		-1,		-1,		// BL
		1,		 1,		// TR
		1,		-1,		// BR
		-1,		-1		// BL
	]);
	StageGL.COVER_UV = new Float32Array([
		 0,		 0,		// TL
		 1,		 0,		// TR
		 0,		 1,		// BL
		 1,		 0,		// TR
		 1,		 1,		// BR
		 0,		 1		// BL
	]);
	StageGL.COVER_UV_FLIP = new Float32Array([
		 0,		 1,		// TL
		 1,		 1,		// TR
		 0,		 0,		// BL
		 1,		 1,		// TR
		 1,		 0,		// BR
		 0,		 0		// BL
	]);
	StageGL.REGULAR_VARYING_HEADER = `
		precision mediump float;
		varying vec2 vTextureCoord;
		varying lowp float indexPicker;
		varying lowp float alphaValue;
	`;
	StageGL.REGULAR_VERTEX_HEADER = `
		${StageGL.REGULAR_VARYING_HEADER}
		attribute vec2 vertexPosition;
		attribute vec2 uvPosition;
		attribute lowp float textureIndex;
		attribute lowp float objectAlpha;
		uniform mat4 pMatrix;
	`;
	StageGL.REGULAR_FRAGMENT_HEADER = `
		${StageGL.REGULAR_VARYING_HEADER}
		uniform sampler2D uSampler[{{count}}];
	`;
	StageGL.REGULAR_VERTEX_BODY = `
		void main (void) {
			// DHG TODO: This doesn't work. Must be something wrong with the hand built matrix see js... bypass for now
			// vertexPosition, round if flag
			// gl_Position = pMatrix * vec4(vertexPosition.x, vertexPosition.y, 0.0, 1.0);
			gl_Position = vec4(
				(vertexPosition.x * pMatrix[0][0]) + pMatrix[3][0],
				(vertexPosition.y * pMatrix[1][1]) + pMatrix[3][1],
				pMatrix[3][2],
				1.0
			);
			alphaValue = objectAlpha;
			indexPicker = textureIndex;
			vTextureCoord = uvPosition;
		}
	`;
	StageGL.REGULAR_FRAGMENT_BODY = `
		void main (void) {
			int src = int(indexPicker);
			vec4 color = vec4(1.0, 0.0, 0.0, 1.0);

			if (src === 0) {
				color = texture2D(uSampler[0], vTextureCoord);
				{{alternates}}
			}

			gl_FragColor = vec4(color.rgb{{premultiply}}, color.a * alphaValue);
		}
	`;
	StageGL.PARTICLE_VERTEX_BODY = `
		${StageGL.REGULAR_VERTEX_BODY}
	`;
	StageGL.PARTICLE_FRAGMENT_BODY = `
		${StageGL.REGULAR_FRAGMENT_BODY}
	`;
	StageGL.COVER_VARYING_HEADER = `
		precision mediump float;
		varying highp vec2 vRenderCoord;
		varying highp vec2 vTextureCoord;
	`;
	StageGL.COVER_VERTEX_HEADER = `
		${StageGL.COVER_VARYING_HEADER}
		attribute vec2 vertexPosition;
		attribute vec2 uvPosition;
		uniform float uUpright;
	`;
	StageGL.COVER_FRAGMENT_HEADER = `
		${StageGL.COVER_VARYING_HEADER}
		uniform sampler2D uSampler;
	`;
	StageGL.COVER_VERTEX_BODY = `
		void main (void) {
			gl_Position = vec4(vertexPosition.x, vertexPosition.y, 0.0, 1.0);
			vRenderCoord = uvPosition;
			vTextureCoord = vec2(uvPosition.x, abs(uUpright - uvPosition.y));
		}
	`;
	StageGL.COVER_FRAGMENT_BODY = `
		void main (void) {
			vec4 color = texture2D(uSampler, vRenderCoord);
			gl_FragColor = color;
		}
	`;
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

/*
* @license Bitmap
* Visit http://createjs.com/ for documentation, updates and examples.
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
 * @module EaselJS
 */
class Bitmap extends DisplayObject {

// constructor:
	/**
	 * @param {HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | String} imageOrUri The source object or URI to an image to
	 * display. This can be either an Image, Canvas, or Video object, or a string URI to an image file to load and use.
	 * If it is a URI, a new Image object will be constructed and assigned to the .image property.
	 * @constructor
	 */
	constructor (imageOrUri) {
		super();
// public properties:
		/**
		 * The image to render. This can be an Image, a Canvas, or a Video. Not all browsers (especially
		 * mobile browsers) support drawing video to a canvas.
		 * @property image
		 * @type HTMLImageElement | HTMLCanvasElement | HTMLVideoElement
		 */
		if (typeof imageOrUri === "string") {
			this.image = document.createElement("img");
			this.image.src = imageOrUri;
		} else {
			this.image = imageOrUri;
		}

		/**
		 * Specifies an area of the source image to draw. If omitted, the whole image will be drawn.
		 * Note that video sources must have a width / height set to work correctly with `sourceRect`.
		 * @property sourceRect
		 * @type Rectangle
		 * @default null
		 */
		this.sourceRect = null;

		/**
		 * Set as compatible with WebGL.
		 * @property _webGLRenderStyle
		 * @protected
		 * @type {Number}
		 * @default 2
		 */
		this._webGLRenderStyle = 2;
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
	isVisible () {
		let image = this.image;
		let hasContent = this.cacheCanvas || (image && (image.naturalWidth || image.getContext || image.readyState >= 2));
		return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent);
	}

	/**
	 * Draws the display object into the specified context ignoring its visible, alpha, shadow, and transform.
	 * Returns true if the draw was handled (useful for overriding functionality).
	 *
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method draw
	 * @param {CanvasRenderingContext2D} ctx The canvas 2D context object to draw into.
	 * @param {Boolean} [ignoreCache=false] Indicates whether the draw operation should ignore any current cache.
	 * For example, used for drawing the cache (to prevent it from simply drawing an existing cache back
	 * into itself).
	 * @return {Boolean}
	 */
	draw (ctx, ignoreCache = false) {
		if (super.draw(ctx, ignoreCache) || !this.image) { return true; }
		let img = this.image, rect = this.sourceRect;
		if (rect) {
			// some browsers choke on out of bound values, so we'll fix them:
			let x1 = rect.x, y1 = rect.y, x2 = x1 + rect.width, y2 = y1 + rect.height, x = 0, y = 0, w = img.width, h = img.height;
			if (x1 < 0) { x -= x1; x1 = 0; }
			if (x2 > w) { x2 = w; }
			if (y1 < 0) { y -= y1; y1 = 0; }
			if (y2 > h) { y2 = h; }
			ctx.drawImage(img, x1, y1, x2-x1, y2-y1, x, y, x2-x1, y2-y1);
		} else {
			ctx.drawImage(img, 0, 0);
		}
		return true;
	}

	// Note, the doc sections below document using the specified APIs (from DisplayObject) from
	// Bitmap. This is why they have no method implementations.

	/**
	 * Because the content of a Bitmap is already in a simple format, cache is unnecessary for Bitmap instances.
	 * You should <b>not</b> cache Bitmap instances as it can degrade performance.
	 *
	 * <strong>However: If you want to use a filter on a Bitmap, you <em>MUST</em> cache it, or it will not work.</strong>
	 * To see the API for caching, please visit the DisplayObject {{#crossLink "DisplayObject/cache"}}{{/crossLink}}
	 * method.
	 * @method cache
	 */

	/**
	 * Because the content of a Bitmap is already in a simple format, cache is unnecessary for Bitmap instances.
	 * You should <b>not</b> cache Bitmap instances as it can degrade performance.
	 *
	 * <strong>However: If you want to use a filter on a Bitmap, you <em>MUST</em> cache it, or it will not work.</strong>
	 * To see the API for caching, please visit the DisplayObject {{#crossLink "DisplayObject/cache"}}{{/crossLink}}
	 * method.
	 * @method updateCache
	 */

	/**
	 * Because the content of a Bitmap is already in a simple format, cache is unnecessary for Bitmap instances.
	 * You should <b>not</b> cache Bitmap instances as it can degrade performance.
	 *
	 * <strong>However: If you want to use a filter on a Bitmap, you <em>MUST</em> cache it, or it will not work.</strong>
	 * To see the API for caching, please visit the DisplayObject {{#crossLink "DisplayObject/cache"}}{{/crossLink}}
	 * method.
	 * @method uncache
	 */

	/**
	 * Docced in superclass.
	 */
	getBounds () {
		let rect = super.getBounds();
		if (rect) { return rect; }
		let image = this.image, o = this.sourceRect || image;
		let hasContent = (image && (image.naturalWidth || image.getContext || image.readyState >= 2));
		return hasContent ? this._rectangle.setValues(0, 0, o.width, o.height) : null;
	}

	/**
	 * Returns a clone of the Bitmap instance.
	 * @method clone
	 * @return {Bitmap} a clone of the Bitmap instance.
	 */
	clone () {
		let o = new Bitmap(this.image);
		if (this.sourceRect) { o.sourceRect = this.sourceRect.clone(); }
		this._cloneProps(o);
		return o;
	}

}

/*
* @license Sprite
* Visit http://createjs.com/ for documentation, updates and examples.
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
 * @module EaselJS
 */
class Sprite extends DisplayObject {

// constructor:
	/**
	 * @constructor
	 * @param {SpriteSheet} spriteSheet The SpriteSheet instance to play back. This includes the source image(s), frame
	 * dimensions, and frame data. See {{#crossLink "SpriteSheet"}}{{/crossLink}} for more information.
	 * @param {String|Number} [frameOrAnimation] The frame number or animation to play initially.
	 */
	constructor (spriteSheet, frameOrAnimation) {
		super();

// public properties:
		/**
		 * The frame index that will be drawn when draw is called. Note that with some {{#crossLink "SpriteSheet"}}{{/crossLink}}
		 * definitions, this will advance non-sequentially. This will always be an integer value.
		 * @property currentFrame
		 * @type {Number}
		 * @default 0
		 * @readonly
		 */
		this.currentFrame = 0;

		/**
		 * Returns the name of the currently playing animation.
		 * @property currentAnimation
		 * @type {String}
		 * @final
		 * @readonly
		 */
		this.currentAnimation = null;

		/**
		 * Prevents the animation from advancing each tick automatically. For example, you could create a sprite
		 * sheet of icons, set paused to true, and display the appropriate icon by setting <code>currentFrame</code>.
		 * @property paused
		 * @type {Boolean}
		 * @default false
		 */
		this.paused = true;

		/**
		 * The SpriteSheet instance to play back. This includes the source image, frame dimensions, and frame
		 * data. See {{#crossLink "SpriteSheet"}}{{/crossLink}} for more information.
		 * @property spriteSheet
		 * @type {SpriteSheet}
		 * @readonly
		 */
		this.spriteSheet = spriteSheet;

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
		this.currentAnimationFrame = 0;

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
		this.framerate = 0;


// private properties:
		/**
		 * Current animation object.
		 * @property _animation
		 * @protected
		 * @type {Object}
		 * @default null
		 */
		this._animation = null;

		/**
		 * Current frame index.
		 * @property _currentFrame
		 * @protected
		 * @type {Number}
		 * @default null
		 */
		this._currentFrame = null;

		/**
		 * Skips the next auto advance. Used by gotoAndPlay to avoid immediately jumping to the next frame
		 * @property _skipAdvance
		 * @protected
		 * @type {Boolean}
		 * @default false
		 */
		this._skipAdvance = false;

		/**
		 * Set as compatible with WebGL.
		 * @property _webGLRenderStyle
		 * @protected
		 * @type {Number}
		 * @default 1
		 */
		this._webGLRenderStyle = 1;

		if (frameOrAnimation != null) { this.gotoAndPlay(frameOrAnimation); }
	}

// public methods:
	/**
	 * Returns true or false indicating whether the display object would be visible if drawn to a canvas.
	 * This does not account for whether it would be visible within the boundaries of the stage.
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method isVisible
	 * @return {Boolean} Boolean indicating whether the display object would be visible if drawn to a canvas
	 */
	isVisible () {
		let hasContent = this.cacheCanvas || this.spriteSheet.complete;
		return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent);
	}

	/**
	 * Draws the display object into the specified context ignoring its visible, alpha, shadow, and transform.
	 * Returns true if the draw was handled (useful for overriding functionality).
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method draw
	 * @param {CanvasRenderingContext2D} ctx The canvas 2D context object to draw into.
	 * @param {Boolean} ignoreCache Indicates whether the draw operation should ignore any current cache.
	 * For example, used for drawing the cache (to prevent it from simply drawing an existing cache back
	 * into itself).
	 */
	draw (ctx, ignoreCache) {
		if (super.draw(ctx, ignoreCache)) { return true; }
		this._normalizeFrame();
		let o = this.spriteSheet.getFrame(this._currentFrame|0);
		if (!o) { return false; }
		let rect = o.rect;
		if (rect.width && rect.height) { ctx.drawImage(o.image, rect.x, rect.y, rect.width, rect.height, -o.regX, -o.regY, rect.width, rect.height); }
		return true;
	}

	// Note, the doc sections below document using the specified APIs (from DisplayObject) from
	// Bitmap. This is why they have no method implementations.

	/**
	 * Because the content of a Sprite is already in a raster format, cache is unnecessary for Sprite instances.
	 * You should not cache Sprite instances as it can degrade performance.
	 * @method cache
	 */

	/**
	 * Because the content of a Sprite is already in a raster format, cache is unnecessary for Sprite instances.
	 * You should not cache Sprite instances as it can degrade performance.
	 * @method updateCache
	 */

	/**
	 * Because the content of a Sprite is already in a raster format, cache is unnecessary for Sprite instances.
	 * You should not cache Sprite instances as it can degrade performance.
	 * @method uncache
	 */

	/**
	 * Play (unpause) the current animation. The Sprite will be paused if either {{#crossLink "Sprite/stop"}}{{/crossLink}}
	 * or {{#crossLink "Sprite/gotoAndStop"}}{{/crossLink}} is called. Single frame animations will remain
	 * unchanged.
	 * @method play
	 */
	play () {
		this.paused = false;
	}

	/**
	 * Stop playing a running animation. The Sprite will be playing if {{#crossLink "Sprite/gotoAndPlay"}}{{/crossLink}}
	 * is called. Note that calling {{#crossLink "Sprite/gotoAndPlay"}}{{/crossLink}} or {{#crossLink "Sprite/play"}}{{/crossLink}}
	 * will resume playback.
	 * @method stop
	 */
	stop () {
		this.paused = true;
	}

	/**
	 * Sets paused to false and plays the specified animation name, named frame, or frame number.
	 * @method gotoAndPlay
	 * @param {String|Number} frameOrAnimation The frame number or animation name that the playhead should move to
	 * and begin playing.
	 */
	gotoAndPlay (frameOrAnimation) {
		this.paused = false;
		this._skipAdvance = true;
		this._goto(frameOrAnimation);
	}

	/**
	 * Sets paused to true and seeks to the specified animation name, named frame, or frame number.
	 * @method gotoAndStop
	 * @param {String|Number} frameOrAnimation The frame number or animation name that the playhead should move to
	 * and stop.
	 */
	gotoAndStop (frameOrAnimation) {
		this.paused = true;
		this._goto(frameOrAnimation);
	}

	/**
	 * Advances the playhead. This occurs automatically each tick by default.
	 * @param [time] {Number} The amount of time in ms to advance by. Only applicable if framerate is set on the Sprite
	 * or its SpriteSheet.
	 * @method advance
	*/
	advance (time) {
		let fps = this.framerate || this.spriteSheet.framerate;
		let t = (fps && time != null) ? time/(1000/fps) : 1;
		this._normalizeFrame(t);
	}

	/**
	 * Returns a {{#crossLink "Rectangle"}}{{/crossLink}} instance defining the bounds of the current frame relative to
	 * the origin. For example, a 90 x 70 frame with <code>regX=50</code> and <code>regY=40</code> would return a
	 * rectangle with [x=-50, y=-40, width=90, height=70]. This ignores transformations on the display object.
	 *
	 * Also see the SpriteSheet {{#crossLink "SpriteSheet/getFrameBounds"}}{{/crossLink}} method.
	 * @method getBounds
	 * @return {Rectangle} A Rectangle instance. Returns null if the frame does not exist, or the image is not fully
	 * loaded.
	 */
	getBounds () {
		// TODO: should this normalizeFrame?
		return super.getBounds() || this.spriteSheet.getFrameBounds(this.currentFrame, this._rectangle);
	}

	/**
	 * Returns a clone of the Sprite instance. Note that the same SpriteSheet is shared between cloned
	 * instances.
	 * @method clone
	 * @return {Sprite} a clone of the Sprite instance.
	 */
	clone () {
		return this._cloneProps(new Sprite(this.spriteSheet));
	}

// private methods:
	/**
	 * @method _cloneProps
	 * @param {Sprite} o
	 * @return {Sprite} o
	 * @protected
	 */
	_cloneProps (o) {
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

	/**
	 * Advances the <code>currentFrame</code> if paused is not true. This is called automatically when the {{#crossLink "Stage"}}{{/crossLink}}
	 * ticks.
	 * @param {Object} evtObj An event object that will be dispatched to all tick listeners. This object is reused between dispatchers to reduce construction & GC costs.
	 * @protected
	 * @method _tick
	 */
	_tick (evtObj) {
		if (!this.paused) {
			if (!this._skipAdvance) { this.advance(evtObj&&evtObj.delta); }
			this._skipAdvance = false;
		}
		super._tick(evtObj);
	}


	/**
	 * Normalizes the current frame, advancing animations and dispatching callbacks as appropriate.
	 * @protected
	 * @method _normalizeFrame
	 * @param {Number} [frameDelta=0]
	 */
	_normalizeFrame (frameDelta = 0) {
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
					// something changed in the event stack, so we shouldn't make any more changes here.
					return;
				} else if (next) {
					// sequence. Automatically calls _normalizeFrame again with the remaining frames.
					return this._goto(next, frameDelta - (l - animFrame) / speed);
				} else {
					// end.
					this.paused = true;
					animFrame = animation.frames.length - 1;
				}
			} else {
				animFrame += frameDelta * speed;
			}
			this.currentAnimationFrame = animFrame;
			this._currentFrame = animation.frames[animFrame | 0];
		} else {
			frame = (this._currentFrame += frameDelta);
			let l = this.spriteSheet.getNumFrames();
			if (frame >= l && l > 0) {
				if (!this._dispatchAnimationEnd(animation, frame, paused, l - 1)) {
					// looped.
					if ((this._currentFrame -= l) >= l) { return this._normalizeFrame(); }
				}
			}
		}
		frame = this._currentFrame | 0;
		if (this.currentFrame != frame) {
			this.currentFrame = frame;
			this.dispatchEvent("change");
		}
	};

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
	_dispatchAnimationEnd (animation, frame, paused, next, end) {
		let name = animation ? animation.name : null;
		if (this.hasEventListener("animationend")) {
			let evt = new Event("animationend");
			evt.name = name;
			evt.next = next;
			this.dispatchEvent(evt);
		}
		// did the animation get changed in the event stack?:
		let changed = (this._animation != animation || this._currentFrame != frame);
		// if the animation hasn't changed, but the sprite was paused, then we want to stick to the last frame:
		if (!changed && !paused && this.paused) { this.currentAnimationFrame = end; changed = true; }
		return changed;
	}

	/**
	 * Moves the playhead to the specified frame number or animation.
	 * @method _goto
	 * @param {String|Number} frameOrAnimation The frame number or animation that the playhead should move to.
	 * @param {Boolean} [frame] The frame of the animation to go to. Defaults to 0.
	 * @protected
	 */
	_goto (frameOrAnimation, frame) {
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

// events:
/**
 * Dispatched when an animation reaches its ends.
 * @event animationend
 * @param {Object} target The object that dispatched the event.
 * @param {String} type The event type.
 * @param {String} name The name of the animation that just ended.
 * @param {String} next The name of the next animation that will be played, or null. This will be the same as name if the animation is looping.
 * @since 0.6.0
 */

/**
 * Dispatched any time the current frame changes. For example, this could be due to automatic advancement on a tick,
 * or calling gotoAndPlay() or gotoAndStop().
 * @event change
 * @param {Object} target The object that dispatched the event.
 * @param {String} type The event type.
 */

/*
* @license BitmapText
* Visit http://createjs.com/ for documentation, updates and examples.
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

// ES6 does not support static properties, this is a work around.
let _maxPoolSize = 100;
let _spritePool = [];

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
 * @module EaselJS
 */
class BitmapText extends Container {

// constructor:
	/**
	 * @param {String} [text=""] The text to display.
	 * @param {SpriteSheet} [spriteSheet=null] The spritesheet that defines the character glyphs.
	 * @constructor
	 */
	constructor (text = "", spriteSheet = null) {
		super();
// public properties:
		/**
		 * The text to display.
		 * @property text
		 * @type String
		 * @default ""
		 */
		this.text = text;

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
		this.spriteSheet = spriteSheet;

		/**
		 * The height of each line of text. If 0, then it will use a line height calculated
		 * by checking for the height of the "1", "T", or "L" character (in that order). If
		 * those characters are not defined, it will use the height of the first frame of the
		 * sprite sheet.
		 * @property lineHeight
		 * @type Number
		 * @default 0
		 */
		this.lineHeight = 0;

		/**
		 * This spacing (in pixels) will be added after each character in the output.
		 * @property letterSpacing
		 * @type Number
		 * @default 0
		 */
		this.letterSpacing = 0;

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
		this.spaceWidth = 0;


// private properties:
	 	/**
		 * @property _oldProps
		 * @type Object
		 * @protected
		 */
		this._oldProps = {text:0,spriteSheet:0,lineHeight:0,letterSpacing:0,spaceWidth:0};
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
	static get maxPoolSize () { return _maxPoolSize; }
	static set maxPoolSize (maxPoolSize) { _maxPoolSize = maxPoolSize;}

	/**
	 * Sprite object pool.
	 * @type {Array}
	 * @static
	 * @private
	 * @readonly
	 */
	static get _spritePool () { return _spritePool; }

// public methods:
	/**
	 * Docced in superclass.
	 */
	draw (ctx, ignoreCache) {
		super.draw(ctx, ignoreCache);
	}

	/**
	 * Docced in superclass.
	 */
	getBounds () {
		this._updateText();
		return super.getBounds();
	}

	/**
	 * Returns true or false indicating whether the display object would be visible if drawn to a canvas.
	 * This does not account for whether it would be visible within the boundaries of the stage.
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method isVisible
	 * @return {Boolean} Boolean indicating whether the display object would be visible if drawn to a canvas
	 */
	isVisible () {
		let hasContent = this.cacheCanvas || (this.spriteSheet && this.spriteSheet.complete && this.text);
		return !!(this.visible && this.alpha > 0 && this.scaleX !== 0 && this.scaleY !== 0 && hasContent);
	}

	clone () {
		return this._cloneProps(new BitmapText(this.text, this.spriteSheet));
	}

	/**
	 * <strong>Disabled in BitmapText.</strong>
	 * @method addChild
	 */
	addChild () {}

	/**
	 * <strong>Disabled in BitmapText.</strong>
	 * @method addChildAt
	 */
	addChildAt () {}

	/**
	 * <strong>Disabled in BitmapText.</strong>
	 * @method removeChild
	 */
	removeChild () {}

	/**
	 * <strong>Disabled in BitmapText.</strong>
	 * @method removeChildAt
	 */
	removeChildAt () {}

	/**
	 * <strong>Disabled in BitmapText.</strong>
	 * @method removeAllChildren
	 */
	removeAllChildren () {}

// private methods:
 	/**
	 * @method _cloneProps
	 * @param {BitmapText} o
	 * @return {BitmapText} o
	 * @protected
	 */
	_cloneProps (o) {
		super._cloneProps(o);
		o.lineHeight = this.lineHeight;
		o.letterSpacing = this.letterSpacing;
		o.spaceWidth = this.spaceWidth;
		return o;
	}

	/**
	 * @method _getFrameIndex
	 * @param {String} character
	 * @param {SpriteSheet} spriteSheet
	 * @return {Number}
	 * @protected
	 */
	_getFrameIndex (character, spriteSheet) {
		let c, o = spriteSheet.getAnimation(character);
		if (!o) {
			(character != (c = character.toUpperCase())) || (character != (c = character.toLowerCase())) || (c = null);
			if (c) { o = spriteSheet.getAnimation(c); }
		}
		return o && o.frames[0];
	}

	/**
	 * @method _getFrame
	 * @param {String} character
	 * @param {SpriteSheet} spriteSheet
	 * @return {Object}
	 * @protected
	 */
	_getFrame (character, spriteSheet) {
		let index = this._getFrameIndex(character, spriteSheet);
		return index == null ? index : spriteSheet.getFrame(index);
	}

	/**
	 * @method _getLineHeight
	 * @param {SpriteSheet} ss
	 * @return {Number}
	 * @protected
	 */
	_getLineHeight (ss) {
		let frame = this._getFrame("1", ss) || this._getFrame("T", ss) || this._getFrame("L", ss) || ss.getFrame(0);
		return frame ? frame.rect.height : 1;
	}

	/**
	 * @method _getSpaceWidth
	 * @param {SpriteSheet} ss
	 * @return {Number}
	 * @protected
	 */
	_getSpaceWidth (ss) {
		let frame = this._getFrame("1", ss) || this._getFrame("l", ss) || this._getFrame("e", ss) || this._getFrame("a", ss) || ss.getFrame(0);
		return frame ? frame.rect.width : 1;
	}

	_tick (evtObj) {
		let stage = this.stage;
		stage && stage.on("drawstart", this._updateText, this, true);
		super._tick(evtObj);
	}

	/**
	 * @method _updateText
	 * @protected
	 */
	_updateText () {
		let x = 0, y = 0, o = this._oldProps, change = false, spaceW = this.spaceWidth, lineH = this.lineHeight, ss = this.spriteSheet;
		let pool = BitmapText._spritePool, kids = this.children, childIndex = 0, numKids = kids.length, sprite;

		for (let n in o) {
			if (o[n] != this[n]) {
				o[n] = this[n];
				change = true;
			}
		}
		if (!change) { return; }

		let hasSpace = !!this._getFrame(" ", ss);
		if (!hasSpace && !spaceW) { spaceW = this._getSpaceWidth(ss); }
		if (!lineH) { lineH = this._getLineHeight(ss); }

		for (let i = 0, l = this.text.length; i < l; i++) {
			let character = this.text.charAt(i);
			if (character === " " && !hasSpace) {
				x += spaceW;
				continue;
			} else if (character === "\n" || character === "\r") {
				if (character === "\r" && this.text.charAt(i+1) === "\n") { i++; } // crlf
				x = 0;
				y += lineH;
				continue;
			}

			let index = this._getFrameIndex(character, ss);
			if (index == null) { continue; }

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
			 // faster than removeChild.
			pool.push(sprite = kids.pop());
			sprite.parent = null;
			numKids--;
		}
		if (pool.length > BitmapText.maxPoolSize) { pool.length = BitmapText.maxPoolSize; }
	}

}

/*
* @license DOMElement
* Visit http://createjs.com/ for documentation, updates and examples.
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
 * @module EaselJS
 */
class DOMElement extends DisplayObject {

// constructor:
	/**
	 * @constructor
	 * @param {HTMLElement|String} htmlElement A reference or id for the DOM element to manage.
	 */
	constructor (htmlElement) {
		super();

		if (typeof(htmlElement) === "string") { htmlElement = document.getElementById(htmlElement); }
		this.mouseEnabled = false;

		let style = htmlElement.style;
		style.position = "absolute";
		style.transformOrigin = style.WebkitTransformOrigin = style.msTransformOrigin = style.MozTransformOrigin = style.OTransformOrigin = "0% 0%";

// public properties:
		/**
		 * The DOM object to manage.
		 * @property htmlElement
		 * @type HTMLElement
		 */
		this.htmlElement = htmlElement;

// private properties:
		/**
		 * @property _oldMtx
		 * @type Matrix2D
		 * @protected
		 */
		this._oldProps = null;
	}

// public methods:
	/**
	 * Returns true or false indicating whether the display object would be visible if drawn to a canvas.
	 * This does not account for whether it would be visible within the boundaries of the stage.
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method isVisible
	 * @return {Boolean} Boolean indicating whether the display object would be visible if drawn to a canvas
	 */
	isVisible () {
		return this.htmlElement != null;
	}

	/**
	 * Draws the display object into the specified context ignoring its visible, alpha, shadow, and transform.
	 * Returns true if the draw was handled (useful for overriding functionality).
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method draw
	 * @param {CanvasRenderingContext2D} ctx The canvas 2D context object to draw into.
	 * @param {Boolean} ignoreCache Indicates whether the draw operation should ignore any current cache.
	 * For example, used for drawing the cache (to prevent it from simply drawing an existing cache back
	 * into itself).
	 * @return {Boolean}
	 */
	draw (ctx, ignoreCache) {
		// this relies on the _tick method because draw isn't called if the parent is not visible.
		// the actual update happens in _handleDrawEnd
		return true;
	}

	/**
	 * Not applicable to DOMElement.
	 * @method cache
	 */
	cache () {}

	/**
	 * Not applicable to DOMElement.
	 * @method uncache
	 */
	uncache () {}

	/**
	 * Not applicable to DOMElement.
	 * @method updateCache
	 */
	updateCache () {}

	/**
	 * Not applicable to DOMElement.
	 * @method hitTest
	 */
	hitTest () {}

	/**
	 * Not applicable to DOMElement.
	 * @method localToGlobal
	 */
	localToGlobal () {}

	/**
	 * Not applicable to DOMElement.
	 * @method globalToLocal
	 */
	globalToLocal () {}

	/**
	 * Not applicable to DOMElement.
	 * @method localToLocal
	 */
	localToLocal () {}

	/**
	 * DOMElement cannot be cloned. Throws an error.
	 * @method clone
	 */
	clone () {
		throw("DOMElement cannot be cloned.")
	}

// private methods:
	/**
	 * @method _tick
	 * @param {Object} evtObj An event object that will be dispatched to all tick listeners. This object is reused between dispatchers to reduce construction & GC costs.
	 * function.
	 * @protected
	 */
	_tick (evtObj) {
		let stage = this.stage;
		stage && stage.on("drawend", this._handleDrawEnd, this, true);
		super._tick(evtObj);
	}

	/**
	 * @method _handleDrawEnd
	 * @param {Event} evt
	 * @protected
	 */
	_handleDrawEnd (evt) {
		let o = this.htmlElement;
		if (!o) { return; }
		let style = o.style;

		let props = this.getConcatenatedDisplayProps(this._props), mtx = props.matrix;

		let visibility = props.visible ? "visible" : "hidden";
		if (visibility != style.visibility) { style.visibility = visibility; }
		if (!props.visible) { return; }

		let oldProps = this._oldProps, oldMtx = oldProps&&oldProps.matrix;
		let n = 10000; // precision

		if (!oldMtx || !oldMtx.equals(mtx)) {
			let str = "matrix(" + (mtx.a*n|0)/n +","+ (mtx.b*n|0)/n +","+ (mtx.c*n|0)/n +","+ (mtx.d*n|0)/n +","+ (mtx.tx+0.5|0);
			style.transform = style.WebkitTransform = style.OTransform = style.msTransform = str +","+ (mtx.ty+0.5|0) +")";
			style.MozTransform = str +"px,"+ (mtx.ty+0.5|0) +"px)";
			if (!oldProps) { oldProps = this._oldProps = new DisplayProps(true, NaN); }
			oldProps.matrix.copy(mtx);
		}

		if (oldProps.alpha != props.alpha) {
			style.opacity = ""+(props.alpha*n|0)/n;
			oldProps.alpha = props.alpha;
		}
	}

}

/**
 * Interaction events should be added to `htmlElement`, and not the DOMElement instance, since DOMElement instances
 * are not full EaselJS display objects and do not participate in EaselJS mouse events.
 * @event click
 */

/**
 * Interaction events should be added to `htmlElement`, and not the DOMElement instance, since DOMElement instances
 * are not full EaselJS display objects and do not participate in EaselJS mouse events.
 * @event dblClick
 */

/**
 * Interaction events should be added to `htmlElement`, and not the DOMElement instance, since DOMElement instances
 * are not full EaselJS display objects and do not participate in EaselJS mouse events.
 * @event mousedown
 */

/**
 * The HTMLElement can listen for the mouseover event, not the DOMElement instance.
 * Since DOMElement instances are not full EaselJS display objects and do not participate in EaselJS mouse events.
 * @event mouseover
 */

/**
 * Not applicable to DOMElement.
 * @event tick
 */

/*
* @license Graphics
* Visit http://createjs.com/ for documentation, updates and examples.
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
 * @module EaselJS
 */
class Graphics {

// constructor:
	/**
	 * @constructor
	 */
	constructor () {
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

		this.clear();
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
	static getRGB (r, g, b, alpha) {
		if (r != null && b == null) {
			alpha = g;
			b = r&0xFF;
			g = r>>8&0xFF;
			r = r>>16&0xFF;
		}
		if (alpha == null) {
			return `rgb(${r},${g},${b})`;
		} else {
			return `rgba(${r},${g},${b},${alpha})`;
		}
	}

	/**
	 * Returns a CSS compatible color string based on the specified HSL numeric color values in the format "hsla(360,100,100,1.0)",
	 * or if alpha is null then in the format "hsl(360,100,100)".
	 *
	 *      createjs.Graphics.getHSL(150, 100, 70);
	 *      // Returns "hsl(150,100,70)"
	 *
	 * @method getHSL
	 * @static
	 * @param {Number} hue The hue component for the color, between 0 and 360.
	 * @param {Number} saturation The saturation component for the color, between 0 and 100.
	 * @param {Number} lightness The lightness component for the color, between 0 and 100.
	 * @param {Number} [alpha] The alpha component for the color where 0 is fully transparent and 1 is fully opaque.
	 * @return {String} A CSS compatible color string based on the specified HSL numeric color values in the format
	 * "hsla(360,100,100,1.0)", or if alpha is null then in the format "hsl(360,100,100)".
	 */
	static getHSL (hue, saturation, lightness, alpha) {
		if (alpha == null) {
			return `hsl(${hue % 360},${saturation}%,${lightness}%)`;
		} else {
			return `hsl(${hue % 360},${saturation}%,${lightness}%,${alpha})`;
		}
	}

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
	get instructions () {
		this._updateInstructions();
		return this._instructions;
	}

// public methods:
	/**
	 * Returns true if this Graphics instance has no drawing commands.
	 * @method isEmpty
	 * @return {Boolean} Returns true if this Graphics instance has no drawing commands.
	 */
	isEmpty () {
		return !(this._instructions.length || this._activeInstructions.length);
	}

	/**
	 * Draws the display object into the specified context ignoring its visible, alpha, shadow, and transform.
	 * Returns true if the draw was handled (useful for overriding functionality).
	 *
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method draw
	 * @param {CanvasRenderingContext2D} ctx The canvas 2D context object to draw into.
	 * @param {Object} data Optional data that is passed to graphics command exec methods. When called from a Shape instance, the shape passes itself as the data parameter. This can be used by custom graphic commands to insert contextual data.
	 */
	draw (ctx, data) {
		this._updateInstructions();
		let instr = this._instructions;
		const l = instr.length;
		for (let i = this._storeIndex; i < l; i++) {
			instr[i].exec(ctx, data);
		}
	}

	/**
	 * Draws only the path described for this Graphics instance, skipping any non-path instructions, including fill and
	 * stroke descriptions. Used for <code>DisplayObject.mask</code> to draw the clipping path, for example.
	 *
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method drawAsPath
	 * @param {CanvasRenderingContext2D} ctx The canvas 2D context object to draw into.
	 */
	drawAsPath (ctx) {
		this._updateInstructions();
		let instr, instrs = this._instructions;
		const l = instrs.length;
		for (let i = this._storeIndex; i < l; i++) {
			// the first command is always a beginPath command.
			if ((instr = instrs[i]).path !== false) { instr.exec(ctx); }
		}
	}


// public methods that map directly to context 2D calls:
	/**
	 * Moves the drawing point to the specified position. A tiny API method "mt" also exists.
	 * @method moveTo
	 * @param {Number} x The x coordinate the drawing point should move to.
	 * @param {Number} y The y coordinate the drawing point should move to.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls).
	 * @chainable
	 */
	moveTo (x, y) {
		return this.append(new MoveTo(x,y), true);
	}

	/**
	 * Draws a line from the current drawing point to the specified position, which become the new current drawing
	 * point. Note that you *must* call {{#crossLink "Graphics/moveTo"}}{{/crossLink}} before the first `lineTo()`.
	 * A tiny API method "lt" also exists.
	 *
	 * For detailed information, read the
	 * <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#complex-shapes-(paths)">
	 * whatwg spec</a>.
	 * @method lineTo
	 * @param {Number} x The x coordinate the drawing point should draw to.
	 * @param {Number} y The y coordinate the drawing point should draw to.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
	lineTo (x, y) {
		return this.append(new LineTo(x,y));
	}

	/**
	 * Draws an arc with the specified control points and radius.  For detailed information, read the
	 * <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#dom-context-2d-arcto">
	 * whatwg spec</a>. A tiny API method "at" also exists.
	 * @method arcTo
	 * @param {Number} x1
	 * @param {Number} y1
	 * @param {Number} x2
	 * @param {Number} y2
	 * @param {Number} radius
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
	arcTo (x1, y1, x2, y2, radius) {
		return this.append(new ArcTo(x1, y1, x2, y2, radius));
	}

	/**
	 * Draws an arc defined by the radius, startAngle and endAngle arguments, centered at the position (x, y). For
	 * example, to draw a full circle with a radius of 20 centered at (100, 100):
	 *
	 *      arc(100, 100, 20, 0, Math.PI*2);
	 *
	 * For detailed information, read the
	 * <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#dom-context-2d-arc">whatwg spec</a>.
	 * A tiny API method "a" also exists.
	 * @method arc
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} radius
	 * @param {Number} startAngle Measured in radians.
	 * @param {Number} endAngle Measured in radians.
	 * @param {Boolean} anticlockwise
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
	arc (x, y, radius, startAngle, endAngle, anticlockwise) {
		return this.append(new Arc(x, y, radius, startAngle, endAngle, anticlockwise));
	}

	/**
	 * Draws a quadratic curve from the current drawing point to (x, y) using the control point (cpx, cpy). For detailed
	 * information, read the <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#dom-context-2d-quadraticcurveto">
	 * whatwg spec</a>. A tiny API method "qt" also exists.
	 * @method quadraticCurveTo
	 * @param {Number} cpx
	 * @param {Number} cpy
	 * @param {Number} x
	 * @param {Number} y
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
	quadraticCurveTo (cpx, cpy, x, y) {
		return this.append(new QuadraticCurveTo(cpx, cpy, x, y));
	}

	/**
	 * Draws a bezier curve from the current drawing point to (x, y) using the control points (cp1x, cp1y) and (cp2x,
	 * cp2y). For detailed information, read the
	 * <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#dom-context-2d-beziercurveto">
	 * whatwg spec</a>. A tiny API method "bt" also exists.
	 * @method bezierCurveTo
	 * @param {Number} cp1x
	 * @param {Number} cp1y
	 * @param {Number} cp2x
	 * @param {Number} cp2y
	 * @param {Number} x
	 * @param {Number} y
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
	bezierCurveTo (cp1x, cp1y, cp2x, cp2y, x, y) {
		return this.append(new BezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y));
	}

	/**
	 * Draws a rectangle at (x, y) with the specified width and height using the current fill and/or stroke.
	 * For detailed information, read the
	 * <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#dom-context-2d-rect">
	 * whatwg spec</a>. A tiny API method "r" also exists.
	 * @method rect
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} w Width of the rectangle
	 * @param {Number} h Height of the rectangle
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
	rect (x, y, w, h) {
		return this.append(new Rect(x, y, w, h));
	}

	/**
	 * Closes the current path, effectively drawing a line from the current drawing point to the first drawing point specified
	 * since the fill or stroke was last set. A tiny API method "cp" also exists.
	 * @method closePath
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
	closePath () {
		return this._activeInstructions.length ? this.append(new ClosePath()) : this;
	}


// public methods that roughly map to Adobe Flash/Animate graphics APIs:
	/**
	 * Clears all drawing instructions, effectively resetting this Graphics instance. Any line and fill styles will need
	 * to be redefined to draw shapes following a clear call. A tiny API method "c" also exists.
	 * @method clear
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
	clear () {
		this._instructions.length = this._activeInstructions.length = this._commitIndex = 0;
		this._strokeStyle = this._oldStrokeStyle = this._stroke = this._fill = this._strokeDash = this._oldStrokeDash = null;
		this._dirty = this._strokeIgnoreScale = false;
		return this;
	}

	/**
	 * Begins a fill with the specified color. This ends the current sub-path. A tiny API method "f" also exists.
	 * @method beginFill
	 * @param {String} color A CSS compatible color value (ex. "red", "#FF0000", or "rgba(255,0,0,0.5)"). Setting to
	 * null will result in no fill.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
	beginFill (color) {
		return this._setFill(color ? new Fill(color) : null);
	}

	/**
	 * Begins a linear gradient fill defined by the line (x0, y0) to (x1, y1). This ends the current sub-path. For
	 * example, the following code defines a black to white vertical gradient ranging from 20px to 120px, and draws a
	 * square to display it:
	 *
	 *      myGraphics.beginLinearGradientFill(["#000","#FFF"], [0, 1], 0, 20, 0, 120).drawRect(20, 20, 120, 120);
	 *
	 * A tiny API method "lf" also exists.
	 * @method beginLinearGradientFill
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
	 */
	beginLinearGradientFill (colors, ratios, x0, y0, x1, y1) {
		return this._setFill(new Fill().linearGradient(colors, ratios, x0, y0, x1, y1));
	}

	/**
	 * Begins a radial gradient fill. This ends the current sub-path. For example, the following code defines a red to
	 * blue radial gradient centered at (100, 100), with a radius of 50, and draws a circle to display it:
	 *
	 *      myGraphics.beginRadialGradientFill(["#F00","#00F"], [0, 1], 100, 100, 0, 100, 100, 50).drawCircle(100, 100, 50);
	 *
	 * A tiny API method "rf" also exists.
	 * @method beginRadialGradientFill
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
	 */
	beginRadialGradientFill (colors, ratios, x0, y0, r0, x1, y1, r1) {
		return this._setFill(new Fill().radialGradient(colors, ratios, x0, y0, r0, x1, y1, r1));
	}

	/**
	 * Begins a pattern fill using the specified image. This ends the current sub-path. A tiny API method "bf" also
	 * exists.
	 * @method beginBitmapFill
	 * @param {HTMLImageElement | HTMLCanvasElement | HTMLVideoElement} image The Image, Canvas, or Video object to use
	 * as the pattern. Must be loaded prior to creating a bitmap fill, or the fill will be empty.
	 * @param {String} repetition Optional. Indicates whether to repeat the image in the fill area. One of "repeat",
	 * "repeat-x", "repeat-y", or "no-repeat". Defaults to "repeat". Note that Firefox does not support "repeat-x" or
	 * "repeat-y" (latest tests were in FF 20.0), and will default to "repeat".
	 * @param {Matrix2D} matrix Optional. Specifies a transformation matrix for the bitmap fill. This transformation
	 * will be applied relative to the parent transform.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
	beginBitmapFill (image, repetition, matrix) {
		return this._setFill(new Fill(null, matrix).bitmap(image, repetition));
	}

	/**
	 * Ends the current sub-path, and begins a new one with no fill. Functionally identical to <code>beginFill(null)</code>.
	 * A tiny API method "ef" also exists.
	 * @method endFill
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
	endFill () {
		return this.beginFill();
	}

	/**
	 * Sets the stroke style. Like all drawing methods, this can be chained, so you can define
	 * the stroke style and color in a single line of code like so:
	 *
	 * 	myGraphics.setStrokeStyle(8,"round").beginStroke("#F00");
	 *
	 * A tiny API method "ss" also exists.
	 * @method setStrokeStyle
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
	 */
	setStrokeStyle (thickness, caps = 0, joints = 0, miterLimit = 10, ignoreScale = false) {
		this._updateInstructions(true);
		this._strokeStyle = this.command = new StrokeStyle(thickness, caps, joints, miterLimit, ignoreScale);

		// ignoreScale lives on Stroke, not StrokeStyle, so we do a little trickery:
		if (this._stroke) { this._stroke.ignoreScale = ignoreScale; }
		this._strokeIgnoreScale = ignoreScale;
		return this;
	}

	/**
	 * Sets or clears the stroke dash pattern.
	 *
	 * 	myGraphics.setStrokeDash([20, 10], 0);
	 *
	 * A tiny API method `sd` also exists.
	 * @method setStrokeDash
	 * @param {Array} [segments] An array specifying the dash pattern, alternating between line and gap.
	 * For example, `[20,10]` would create a pattern of 20 pixel lines with 10 pixel gaps between them.
	 * Passing null or an empty array will clear the existing stroke dash.
	 * @param {Number} [offset=0] The offset of the dash pattern. For example, you could increment this value to create a "marching ants" effect.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
	setStrokeDash (segments, offset = 0) {
		this._updateInstructions(true);
		this._strokeDash = this.command = new StrokeDash(segments, offset);
		return this;
	}

	/**
	 * Begins a stroke with the specified color. This ends the current sub-path. A tiny API method "s" also exists.
	 * @method beginStroke
	 * @param {String} color A CSS compatible color value (ex. "#FF0000", "red", or "rgba(255,0,0,0.5)"). Setting to
	 * null will result in no stroke.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
	beginStroke (color) {
		return this._setStroke(color ? new Stroke(color) : null);
	}

	/**
	 * Begins a linear gradient stroke defined by the line (x0, y0) to (x1, y1). This ends the current sub-path. For
	 * example, the following code defines a black to white vertical gradient ranging from 20px to 120px, and draws a
	 * square to display it:
	 *
	 *      myGraphics.setStrokeStyle(10).
	 *          beginLinearGradientStroke(["#000","#FFF"], [0, 1], 0, 20, 0, 120).drawRect(20, 20, 120, 120);
	 *
	 * A tiny API method "ls" also exists.
	 * @method beginLinearGradientStroke
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
	 */
	beginLinearGradientStroke (colors, ratios, x0, y0, x1, y1) {
		return this._setStroke(new Stroke().linearGradient(colors, ratios, x0, y0, x1, y1));
	}

	/**
	 * Begins a radial gradient stroke. This ends the current sub-path. For example, the following code defines a red to
	 * blue radial gradient centered at (100, 100), with a radius of 50, and draws a rectangle to display it:
	 *
	 *      myGraphics.setStrokeStyle(10)
	 *          .beginRadialGradientStroke(["#F00","#00F"], [0, 1], 100, 100, 0, 100, 100, 50)
	 *          .drawRect(50, 90, 150, 110);
	 *
	 * A tiny API method "rs" also exists.
	 * @method beginRadialGradientStroke
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
	 */
	beginRadialGradientStroke (colors, ratios, x0, y0, r0, x1, y1, r1) {
		return this._setStroke(new Stroke().radialGradient(colors, ratios, x0, y0, r0, x1, y1, r1));
	}

	/**
	 * Begins a pattern fill using the specified image. This ends the current sub-path. Note that unlike bitmap fills,
	 * strokes do not currently support a matrix parameter due to limitations in the canvas API. A tiny API method "bs"
	 * also exists.
	 * @method beginBitmapStroke
	 * @param {HTMLImageElement | HTMLCanvasElement | HTMLVideoElement} image The Image, Canvas, or Video object to use
	 * as the pattern. Must be loaded prior to creating a bitmap fill, or the fill will be empty.
	 * @param {String} [repetition=repeat] Optional. Indicates whether to repeat the image in the fill area. One of
	 * "repeat", "repeat-x", "repeat-y", or "no-repeat". Defaults to "repeat".
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
	beginBitmapStroke (image, repetition = "repeat") {
		// NOTE: matrix is not supported for stroke because transforms on strokes also affect the drawn stroke width.
		return this._setStroke(new Stroke().bitmap(image, repetition));
	}

	/**
	 * Ends the current sub-path, and begins a new one with no stroke. Functionally identical to <code>beginStroke(null)</code>.
	 * A tiny API method "es" also exists.
	 * @method endStroke
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
	endStroke () {
		return this.beginStroke();
	}

	/**
	 * Draws a rounded rectangle with all corners with the specified radius.
	 * @method drawRoundRect
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} w
	 * @param {Number} h
	 * @param {Number} radius Corner radius.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
	drawRoundRect (x, y, w, h, radius) {
		return this.drawRoundRectComplex(x, y, w, h, radius, radius, radius, radius);
	}

	/**
	 * Draws a rounded rectangle with different corner radii. Supports positive and negative corner radii. A tiny API
	 * method "rc" also exists.
	 * @method drawRoundRectComplex
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
	 */
	drawRoundRectComplex (x, y, w, h, radiusTL, radiusTR, radiusBR, radiusBL) {
		return this.append(new RoundRect(x, y, w, h, radiusTL, radiusTR, radiusBR, radiusBL));
	}

	/**
	 * Draws a circle with the specified radius at (x, y).
	 *
	 *      var g = new createjs.Graphics();
	 *	    g.setStrokeStyle(1);
	 *	    g.beginStroke(createjs.Graphics.getRGB(0,0,0));
	 *	    g.beginFill(createjs.Graphics.getRGB(255,0,0));
	 *	    g.drawCircle(0,0,3);
	 *
	 *	    var s = new createjs.Shape(g);
	 *		  s.x = 100;
	 *		  s.y = 100;
	 *
	 *	    stage.addChild(s);
	 *	    stage.update();
	 *
	 * A tiny API method "dc" also exists.
	 * @method drawCircle
	 * @param {Number} x x coordinate center point of circle.
	 * @param {Number} y y coordinate center point of circle.
	 * @param {Number} radius Radius of circle.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
	drawCircle (x, y, radius) {
		return this.append(new Circle(x, y, radius));
	}

	/**
	 * Draws an ellipse (oval) with a specified width (w) and height (h). Similar to {{#crossLink "Graphics/drawCircle"}}{{/crossLink}},
	 * except the width and height can be different. A tiny API method "de" also exists.
	 * @method drawEllipse
	 * @param {Number} x The left coordinate point of the ellipse. Note that this is different from {{#crossLink "Graphics/drawCircle"}}{{/crossLink}}
	 * which draws from center.
	 * @param {Number} y The top coordinate point of the ellipse. Note that this is different from {{#crossLink "Graphics/drawCircle"}}{{/crossLink}}
	 * which draws from the center.
	 * @param {Number} w The height (horizontal diameter) of the ellipse. The horizontal radius will be half of this
	 * number.
	 * @param {Number} h The width (vertical diameter) of the ellipse. The vertical radius will be half of this number.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
	drawEllipse (x, y, w, h) {
		return this.append(new Ellipse(x, y, w, h));
	}

	/**
	 * Draws a star if pointSize is greater than 0, or a regular polygon if pointSize is 0 with the specified number of
	 * points. For example, the following code will draw a familiar 5 pointed star shape centered at 100, 100 and with a
	 * radius of 50:
	 *
	 *      myGraphics.beginFill("#FF0").drawPolyStar(100, 100, 50, 5, 0.6, -90);
	 *      // Note: -90 makes the first point vertical
	 *
	 * A tiny API method "dp" also exists.
	 *
	 * @method drawPolyStar
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
	 */
	drawPolyStar (x, y, radius, sides, pointSize, angle) {
		return this.append(new PolyStar(x, y, radius, sides, pointSize, angle));
	}

	/**
	 * Appends a graphics command object to the graphics queue. Command objects expose an "exec" method
	 * that accepts two parameters: the Context2D to operate on, and an arbitrary data object passed into
	 * {{#crossLink "Graphics/draw"}}{{/crossLink}}. The latter will usually be the Shape instance that called draw.
	 *
	 * This method is used internally by Graphics methods, such as drawCircle, but can also be used directly to insert
	 * built-in or custom graphics commands. For example:
	 *
	 * 		// attach data to our shape, so we can access it during the draw:
	 * 		myShape.color = "red";
	 *
	 * 		// append a Circle command object:
	 * 		myShape.graphics.append(new createjs.Graphics.Circle(50, 50, 30));
	 *
	 * 		// append a custom command object with an exec method that sets the fill style
	 * 		// based on the shape's data, and then fills the circle.
	 * 		myShape.graphics.append({exec:function(ctx, shape) {
	 * 			ctx.fillStyle = shape.color;
	 * 			ctx.fill();
	 * 		}});
	 *
	 * @method append
	 * @param {Object} command A graphics command object exposing an "exec" method.
	 * @param {boolean} clean The clean param is primarily for internal use. A value of true indicates that a command does not generate a path that should be stroked or filled.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
	append (command, clean) {
		this._activeInstructions.push(command);
		this.command = command;
		if (!clean) { this._dirty = true; }
		return this;
	}

	/**
	 * Decodes a compact encoded path string into a series of draw instructions.
	 * This format is not intended to be human readable, and is meant for use by authoring tools.
	 * The format uses a base64 character set, with each character representing 6 bits, to define a series of draw
	 * commands.
	 *
	 * Each command is comprised of a single "header" character followed by a variable number of alternating x and y
	 * position values. Reading the header bits from left to right (most to least significant): bits 1 to 3 specify the
	 * type of operation (0-moveTo, 1-lineTo, 2-quadraticCurveTo, 3-bezierCurveTo, 4-closePath, 5-7 unused). Bit 4
	 * indicates whether position values use 12 bits (2 characters) or 18 bits (3 characters), with a one indicating the
	 * latter. Bits 5 and 6 are currently unused.
	 *
	 * Following the header is a series of 0 (closePath), 2 (moveTo, lineTo), 4 (quadraticCurveTo), or 6 (bezierCurveTo)
	 * parameters. These parameters are alternating x/y positions represented by 2 or 3 characters (as indicated by the
	 * 4th bit in the command char). These characters consist of a 1 bit sign (1 is negative, 0 is positive), followed
	 * by an 11 (2 char) or 17 (3 char) bit integer value. All position values are in tenths of a pixel. Except in the
	 * case of move operations which are absolute, this value is a delta from the previous x or y position (as
	 * appropriate).
	 *
	 * For example, the string "A3cAAMAu4AAA" represents a line starting at -150,0 and ending at 150,0.
	 * <br />A - bits 000000. First 3 bits (000) indicate a moveTo operation. 4th bit (0) indicates 2 chars per
	 * parameter.
	 * <br />n0 - 110111011100. Absolute x position of -150.0px. First bit indicates a negative value, remaining bits
	 * indicate 1500 tenths of a pixel.
	 * <br />AA - 000000000000. Absolute y position of 0.
	 * <br />I - 001100. First 3 bits (001) indicate a lineTo operation. 4th bit (1) indicates 3 chars per parameter.
	 * <br />Au4 - 000000101110111000. An x delta of 300.0px, which is added to the previous x value of -150.0px to
	 * provide an absolute position of +150.0px.
	 * <br />AAA - 000000000000000000. A y delta value of 0.
	 *
	 * A tiny API method "p" also exists.
	 * @method decodePath
	 * @param {String} str The path string to decode.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
	decodePath (str) {
		let instructions = [this.moveTo, this.lineTo, this.quadraticCurveTo, this.bezierCurveTo, this.closePath];
		let paramCount = [2, 2, 4, 6, 0];
		let i = 0;
		const l = str.length;
		let params = [];
		let x = 0, y = 0;
		let base64 = Graphics.BASE_64;

		while (i < l) {
			let c = str.charAt(i);
			let n = base64[c];
			let fi = n>>3; // highest order bits 1-3 code for operation.
			let f = instructions[fi];
			// check that we have a valid instruction & that the unused bits are empty:
			if (!f || (n&3)) { throw(`bad path data (@${i}):c`); }
			const pl = paramCount[fi];
			if (!fi) { x=y=0; } // move operations reset the position.
			params.length = 0;
			i++;
			let charCount = (n>>2&1)+2;  // 4th header bit indicates number size for this operation.
			for (let p = 0; p < pl; p++) {
				let num = base64[str.charAt(i)];
				let sign = (num>>5) ? -1 : 1;
				num = ((num&31)<<6)|(base64[str.charAt(i+1)]);
				if (charCount === 3) { num = (num<<6)|(base64[str.charAt(i+2)]); }
				num = sign*num/10;
				if (p%2) { x = (num += x); }
				else { y = (num += y); }
				params[p] = num;
				i += charCount;
			}
			f.apply(this, params);
		}
		return this;
	}

	/**
	 * Stores all graphics commands so they won't be executed in future draws. Calling store() a second time adds to
	 * the existing store. This also affects `drawAsPath()`.
	 *
	 * This is useful in cases where you are creating vector graphics in an iterative manner (ex. generative art), so
	 * that only new graphics need to be drawn (which can provide huge performance benefits), but you wish to retain all
	 * of the vector instructions for later use (ex. scaling, modifying, or exporting).
	 *
	 * Note that calling store() will force the active path (if any) to be ended in a manner similar to changing
	 * the fill or stroke.
	 *
	 * For example, consider a application where the user draws lines with the mouse. As each line segment (or collection of
	 * segments) are added to a Shape, it can be rasterized using {{#crossLink "DisplayObject/updateCache"}}{{/crossLink}},
	 * and then stored, so that it can be redrawn at a different scale when the application is resized, or exported to SVGraphics.
	 *
	 * 	// set up cache:
	 * 	myShape.cache(0,0,500,500,scale);
	 *
	 * 	// when the user drags, draw a new line:
	 * 	myShape.graphics.moveTo(oldX,oldY).lineTo(newX,newY);
	 * 	// then draw it into the existing cache:
	 * 	myShape.updateCache("source-over");
	 * 	// store the new line, so it isn't redrawn next time:
	 * 	myShape.store();
	 *
	 * 	// then, when the window resizes, we can re-render at a different scale:
	 * 	// first, unstore all our lines:
	 * 	myShape.unstore();
	 * 	// then cache using the new scale:
	 * 	myShape.cache(0,0,500,500,newScale);
	 * 	// finally, store the existing commands again:
	 * 	myShape.store();
	 *
	 * @method store
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
	store () {
		this._updateInstructions(true);
		this._storeIndex = this._instructions.length;
		return this;
	}

	/**
	 * Unstores any graphics commands that were previously stored using {{#crossLink "Graphics/store"}}{{/crossLink}}
	 * so that they will be executed in subsequent draw calls.
	 *
	 * @method unstore
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
	unstore () {
		this._storeIndex = 0;
		return this;
	}

	/**
	 * Returns a clone of this Graphics instance. Note that the individual command objects are not cloned.
	 * @method clone
	 * @return {Graphics} A clone of the current Graphics instance.
	 */
	clone () {
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

	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 */
	toString () {
		return `[${this.constructor.name}]`;
	}

// private methods:
	/**
	 * @method _updateInstructions
	 * @param commit
	 * @protected
	 */
	_updateInstructions (commit) {
		let instr = this._instructions, active = this._activeInstructions, commitIndex = this._commitIndex;

		if (this._dirty && active.length) {
			instr.length = commitIndex; // remove old, uncommitted commands
			instr.push(Graphics.beginCmd);

			const l = active.length, ll = instr.length;
			instr.length = ll+l;
			for (let i = 0; i < l; i++) { instr[i+ll] = active[i]; }

			if (this._fill) { instr.push(this._fill); }
			if (this._stroke) {
				// doesn't need to be re-applied if it hasn't changed.
				if (this._strokeDash !== this._oldStrokeDash) {
					this._oldStrokeDash = this._strokeDash;
					instr.push(this._strokeDash);
				}
				if (this._strokeStyle !== this._oldStrokeStyle) {
					this._oldStrokeStyle = this._strokeStyle;
					instr.push(this._strokeStyle);
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

	/**
	 * @method _setFill
	 * @param fill
	 * @protected
	 */
	_setFill (fill) {
		this._updateInstructions(true);
		this.command = this._fill = fill;
		return this;
	}

	/**
	 * @method _setStroke
	 * @param stroke
	 * @protected
	 */
	_setStroke (stroke) {
		this._updateInstructions(true);
		if (this.command = this._stroke = stroke) {
			stroke.ignoreScale = this._strokeIgnoreScale;
		}
		return this;
	}

}

// Command Objects:

/**
 * @namespace Graphics
 */

/**
 * Graphics command object. See {{#crossLink "Graphics/lineTo"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information. See {{#crossLink "Graphics"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
 * @class LineTo
 */
class LineTo {
	/**
	 * @constructor
	 * @param {Number} x
	 * @param {Number} y
	 */
	constructor (x, y) {
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
	}
	/**
	 * Execute the Graphics command in the provided Canvas context.
	 * @method exec
	 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
	 */
	exec (ctx) {
		ctx.lineTo(this.x, this.y);
	}
}

/**
 * Graphics command object. See {{#crossLink "Graphics/moveTo"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
 * @class MoveTo
 */
class MoveTo {
	/**
	 * @constructor
   * @param {Number} x
   * @param {Number} y
	 */
 	constructor (x, y) {
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
 	}
	/**
	 * @method exec
	 * @param {CanvasRenderingContext2D} ctx
	 */
 	exec (ctx) {
 		ctx.moveTo(this.x, this.y);
 	}
}


/**
 * Graphics command object. See {{#crossLink "Graphics/arcTo"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
 * @class ArcTo
 */
class ArcTo {
	/**
	 * @constructor
	 * @param {Number} x1
	 * @param {Number} y1
	 * @param {Number} x2
	 * @param {Number} y2
	 * @param {Number} radius
	 */
 	constructor (x1, y1, x2, y2, radius) {
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
	 	this.radius = radius;
 	}
	/**
	 * Execute the Graphics command in the provided Canvas context.
	 * @method exec
	 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
	 */
 	exec (ctx) {
 		ctx.arcTo(this.x1, this.y1, this.x2, this.y2, this.radius);
 	}
}

/**
 * Graphics command object. See {{#crossLink "Graphics/arc"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
 * @class Arc
 */
class Arc {
	/**
	 * @constructor
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} radius
	 * @param {Number} startAngle
	 * @param {Number} endAngle
	 * @param {Number} anticlockwise
	 */
 	constructor (x, y, radius, startAngle, endAngle, anticlockwise) {
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
	 	this.anticlockwise = !!anticlockwise;
 	}
	/**
	 * Execute the Graphics command in the provided Canvas context.
	 * @method exec
	 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
	 */
 	exec (ctx) {
 		ctx.arc(this.x, this.y, this.radius, this.startAngle, this.endAngle, this.anticlockwise);
 	}
}

/**
 * Graphics command object. See {{#crossLink "Graphics/quadraticCurveTo"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
 * @class QuadraticCurveTo
 */
class QuadraticCurveTo {
	/**
	 * @constructor
	 * @param {Number} cpx
	 * @param {Number} cpy
	 * @param {Number} x
	 * @param {Number} y
	 */
 	constructor (cpx, cpy, x, y) {
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
		this.y = y;
 	}
	/**
	 * Execute the Graphics command in the provided Canvas context.
	 * @method exec
	 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
	 */
 	exec (ctx) {
 		ctx.quadraticCurveTo(this.cpx, this.cpy, this.x, this.y);
 	}
}

/**
 * Graphics command object. See {{#crossLink "Graphics/bezierCurveTo"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
 * @class BezierCurveTo
 */
class BezierCurveTo {
	/**
	 * @constructor
	 * @param {Number} cp1x
	 * @param {Number} cp1y
	 * @param {Number} cp2x
	 * @param {Number} cp2y
	 * @param {Number} x
	 * @param {Number} y
	 */
 	constructor (cp1x, cp1y, cp2x, cp2y, x, y) {
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
		this.y = y;
 	}
	/**
	 * Execute the Graphics command in the provided Canvas context.
	 * @method exec
	 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
	 */
 	exec (ctx) {
 		ctx.bezierCurveTo(this.cp1x, this.cp1y, this.cp2x, this.cp2y, this.x, this.y);
 	}
}

/**
 * Graphics command object. See {{#crossLink "Graphics/rect"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
 * @class Rect
 */
class Rect {
	/**
	 * @constructor
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} w
	 * @param {Number} h
	 */
 	constructor (x, y, w, h) {
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
 	}
	/**
	 * Execute the Graphics command in the provided Canvas context.
	 * @method exec
	 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
	 */
 	exec (ctx) {
 		ctx.rect(this.x, this.y, this.w, this.h);
 	}
}

/**
 * Graphics command object. See {{#crossLink "Graphics/closePath"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
 * @class ClosePath
 */
class ClosePath {
	/**
	 * @constructor
	 */
 	constructor () { }
	/**
	 * Execute the Graphics command in the provided Canvas context.
	 * @method exec
	 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
	 */
 	exec (ctx) {
 		ctx.closePath();
 	}
}

/**
 * Graphics command object to begin a new path. See {{#crossLink "Graphics"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
 * @class BeginPath
 */
class BeginPath {
	/**
	 * @constructor
	 */
 	constructor () { }
	/**
	 * Execute the Graphics command in the provided Canvas context.
	 * @method exec
	 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
	 */
 	exec (ctx) {
 		ctx.beginPath();
 	}
}

/**
 * Graphics command object. See {{#crossLink "Graphics/beginFill"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
 * @class Fill
 */
class Fill {
	/**
	 * @constructor
	 * @param {Object} style A valid Context2D fillStyle.
	 * @param {Matrix2D} matrix
	 */
	constructor (style, matrix) {
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
		this.path = false;
	}
	/**
	 * Execute the Graphics command in the provided Canvas context.
	 * @method exec
	 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
	 */
	exec (ctx) {
		if (!this.style) { return; }
		ctx.fillStyle = this.style;
		let mtx = this.matrix;
		if (mtx) { ctx.save(); ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty); }
		ctx.fill();
		if (mtx) { ctx.restore(); }
	}
	/**
	 * Creates a linear gradient style and assigns it to {{#crossLink "Fill/style:property"}}{{/crossLink}}.
	 * See {{#crossLink "Graphics/beginLinearGradientFill"}}{{/crossLink}} for more information.
	 * @method linearGradient
	 * @param {Array} colors
	 *
	 * @param {Array} ratios
	 * @param {Number} x0
	 * @param {Number} y0
	 * @param {Number} x1
	 * @param {Number} y1
	 * @return {Fill} Returns this Fill object for chaining or assignment.
	 */
	linearGradient (colors, ratios, x0, y0, x1, y1) {
		let o = this.style = Graphics._ctx.createLinearGradient(x0, y0, x1, y1);
		const l = colors.length;
		for (let i = 0; i < l; i++) { o.addColorStop(ratios[i], colors[i]); }
		o.props = {colors, ratios, x0, y0, x1, y1, type:"linear"};
		return this;
	}
	/**
	 * Creates a radial gradient style and assigns it to {{#crossLink "Fill/style:property"}}{{/crossLink}}.
	 * See {{#crossLink "Graphics/beginRadialGradientFill"}}{{/crossLink}} for more information.
	 * @method radialGradient
	 * @param {Array} colors
	 * @param {Array} ratios
	 * @param {Number} x0
	 * @param {Number} y0
	 * @param {Number} r0
	 * @param {Number} x1
	 * @param {Number} y1
	 * @param {Number} r1
	 * @return {Fill} Returns this Fill object for chaining or assignment.
	 */
	radialGradient (colors, ratios, x0, y0, r0, x1, y1, r1) {
		let o = this.style = Graphics._ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
		const l = colors.length;
		for (let i = 0; i < l; i++) { o.addColorStop(ratios[i], colors[i]); }
		o.props = {colors, ratios, x0, y0, r0, x1, y1, r1, type: "radial"};
		return this;
	}
	/**
	 * Creates a bitmap fill style and assigns it to the {{#crossLink "Fill/style:property"}}{{/crossLink}}.
	 * See {{#crossLink "Graphics/beginBitmapFill"}}{{/crossLink}} for more information.
	 * @method bitmap
	 * @param {HTMLImageElement | HTMLCanvasElement | HTMLVideoElement} image  Must be loaded prior to creating a bitmap fill, or the fill will be empty.
	 * @param {String} [repetition] One of: repeat, repeat-x, repeat-y, or no-repeat.
	 * @return {Fill} Returns this Fill object for chaining or assignment.
	 */
	bitmap (image, repetition = "") {
		if (image.naturalWidth || image.getContext || image.readyState >= 2) {
			let o = this.style = Graphics._ctx.createPattern(image, repetition);
			o.props = {image, repetition, type: "bitmap"};
		}
		return this;
	}
}

/**
 * Graphics command object. See {{#crossLink "Graphics/beginStroke"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
 * @class Stroke
 */
class Stroke {
	/**
	 * @constructor
	 * @param {Object} style A valid Context2D fillStyle.
	 * @param {Boolean} ignoreScale
	 */
	constructor (style, ignoreScale) {
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
		this.path = false;
	}
	/**
	 * Execute the Graphics command in the provided Canvas context.
	 * @method exec
	 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
	 */
	exec (ctx) {
		if (!this.style) { return; }
		ctx.strokeStyle = this.style;
		if (this.ignoreScale) { ctx.save(); ctx.setTransform(1,0,0,1,0,0); }
		ctx.stroke();
		if (this.ignoreScale) { ctx.restore(); }
	}
	/**
	 * Creates a linear gradient style and assigns it to {{#crossLink "Stroke/style:property"}}{{/crossLink}}.
	 * See {{#crossLink "Graphics/beginLinearGradientStroke"}}{{/crossLink}} for more information.
	 * @method linearGradient
	 * @param {Array} colors
	 * @param {Array} ratios
	 * @param {Number} x0
	 * @param {Number} y0
	 * @param {Number} x1
	 * @param {Number} y1
	 * @return {Fill} Returns this Stroke object for chaining or assignment.
	 */
	linearGradient (...args) {
		// TODO-ES6: Anything but this...
		Fill.prototype.linearGradient.apply(this, args);
	}
	/**
	 * Creates a radial gradient style and assigns it to {{#crossLink "Stroke/style:property"}}{{/crossLink}}.
	 * See {{#crossLink "Graphics/beginRadialGradientStroke"}}{{/crossLink}} for more information.
	 * @method radialGradient
	 * @param {Array} colors
	 * @param {Array} ratios
	 * @param {Number} x0
	 * @param {Number} y0
	 * @param {Number} r0
	 * @param {Number} x1
	 * @param {Number} y1
	 * @param {Number} r1
	 * @return {Fill} Returns this Stroke object for chaining or assignment.
	 */
	radialGradient (...args) {
 		Fill.prototype.radialGradient.apply(this, args);
 	}
	/**
	 * Creates a bitmap fill style and assigns it to {{#crossLink "Stroke/style:property"}}{{/crossLink}}.
	 * See {{#crossLink "Graphics/beginBitmapStroke"}}{{/crossLink}} for more information.
	 * @method bitmap
	 * @param {HTMLImageElement} image
	 * @param {String} [repetition] One of: repeat, repeat-x, repeat-y, or no-repeat.
	 * @return {Fill} Returns this Stroke object for chaining or assignment.
	 */
	bitmap (...args) {
 		Fill.prototype.bitmap.apply(this, args);
 	}
}

/**
 * Graphics command object. See {{#crossLink "Graphics/setStrokeStyle"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
 * @class StrokeStyle
 */
class StrokeStyle {
	/**
	 * @constructor
	 * @param {Number} [width=1]
	 * @param {String} [caps=butt]
	 * @param {String} [joints=miter]
	 * @param {Number} [miterLimit=10]
	 * @param {Boolean} [ignoreScale=false]
	 * @type {String}
	 */
	constructor (width, caps = "butt", joints = "miter", miterLimit = 10, ignoreScale = false) {
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
		this.path = false;
	}
	/**
	 * Execute the Graphics command in the provided Canvas context.
	 * @method exec
	 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
	 */
	exec (ctx) {
		ctx.lineWidth = this.width;
		ctx.lineCap = (isNaN(this.caps) ? this.caps : Graphics.STROKE_CAPS_MAP[this.caps]);
		ctx.lineJoin = (isNaN(this.joints) ? this.joints : Graphics.STROKE_JOINTS_MAP[this.joints]);
		ctx.miterLimit = this.miterLimit;
		ctx.ignoreScale = this.ignoreScale;
	}
}

/**
 * Graphics command object. See {{#crossLink "Graphics/setStrokeDash"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
 * @class StrokeDash
 */
class StrokeDash {
	/**
	 * @constructor
	 * @param {Array} [segments=[]]
	 * @param {Number} [offset=0]
	 */
 	constructor (segments = StrokeDash.EMPTY_SEGMENTS, offset = 0) {
		/**
		 * @property segments
		 * @type Array
		 */
	 	this.segments = segments;
		/**
		 * @property offset
		 * @type Number
		 */
	 	this.offset = offset;
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
	static get EMPTY_SEGMENTS () { return _EMPTY_SEGMENTS; }

	/**
	 * Execute the Graphics command in the provided Canvas context.
	 * @method exec
	 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
	 */
 	exec (ctx) {
 		if (ctx.setLineDash) { // feature detection.
	 		ctx.setLineDash(this.segments);
	 		ctx.lineDashOffset = this.offset;
	 	}
 	}
}

/**
 * Graphics command object. See {{#crossLink "Graphics/drawRoundRectComplex"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
 * @class RoundRect
 */
class RoundRect {
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
 	constructor (x, y, w, h, radiusTL, radiusTR, radiusBR, radiusBL) {
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
		this.radiusBL = radiusBL;
 	}
	/**
	 * Execute the Graphics command in the provided Canvas context.
	 * @method exec
	 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
	 */
 	exec (ctx) {
 		let max = (w<h?w:h)/2;
	 	let mTL=0, mTR=0, mBR=0, mBL=0;
	 	let x = this.x, y = this.y, w = this.w, h = this.h;
	 	let rTL = this.radiusTL, rTR = this.radiusTR, rBR = this.radiusBR, rBL = this.radiusBL;

	 	if (rTL < 0) { rTL *= (mTL=-1); }
	 	if (rTL > max) { rTL = max; }
	 	if (rTR < 0) { rTR *= (mTR=-1); }
	 	if (rTR > max) { rTR = max; }
	 	if (rBR < 0) { rBR *= (mBR=-1); }
	 	if (rBR > max) { rBR = max; }
	 	if (rBL < 0) { rBL *= (mBL=-1); }
	 	if (rBL > max) { rBL = max; }

	 	ctx.moveTo(x+w-rTR, y);
	 	ctx.arcTo(x+w+rTR*mTR, y-rTR*mTR, x+w, y+rTR, rTR);
	 	ctx.lineTo(x+w, y+h-rBR);
	 	ctx.arcTo(x+w+rBR*mBR, y+h+rBR*mBR, x+w-rBR, y+h, rBR);
	 	ctx.lineTo(x+rBL, y+h);
	 	ctx.arcTo(x-rBL*mBL, y+h+rBL*mBL, x, y+h-rBL, rBL);
	 	ctx.lineTo(x, y+rTL);
	 	ctx.arcTo(x-rTL*mTL, y-rTL*mTL, x+rTL, y, rTL);
	 	ctx.closePath();
 	}
}

/**
 * Graphics command object. See {{#crossLink "Graphics/drawCircle"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
 * @class Circle
 */
class Circle {
	/**
	 * @constructor
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} radius
	 */
 	constructor (x, y, radius) {
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
 	}
	/**
	 * Execute the Graphics command in the provided Canvas context.
	 * @method exec
	 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
	 */
 	exec (ctx) {
 		ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
 	}
}

/**
 * Graphics command object. See {{#crossLink "Graphics/drawEllipse"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
 * @class Ellipse
 */
class Ellipse {
	/**
	 * @constructor
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} w
	 * @param {Number} h
	 */
 	constructor (x, y, w, h) {
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
 	}
	/**
	 * Execute the Graphics command in the provided Canvas context.
	 * @method exec
	 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
	 */
 	exec (ctx) {
 		let x = this.x, y = this.y;
	 	let w = this.w, h = this.h;

	 	let k = 0.5522848;
	 	let ox = (w / 2) * k;
	 	let oy = (h / 2) * k;
	 	let xe = x + w;
	 	let ye = y + h;
	 	let xm = x + w / 2;
	 	let ym = y + h / 2;

	 	ctx.moveTo(x, ym);
	 	ctx.bezierCurveTo(x, ym-oy, xm-ox, y, xm, y);
	 	ctx.bezierCurveTo(xm+ox, y, xe, ym-oy, xe, ym);
	 	ctx.bezierCurveTo(xe, ym+oy, xm+ox, ye, xm, ye);
	 	ctx.bezierCurveTo(xm-ox, ye, x, ym+oy, x, ym);
 	}
}

/**
 * Graphics command object. See {{#crossLink "Graphics/drawPolyStar"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
 * @class PolyStar
 */
class PolyStar {
	/**
	 * @constructor
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} radius
	 * @param {Number} sides
	 * @param {Number} [pointSize=0]
	 * @param {Number} [angle=0]
	 */
 	constructor (x, y, radius, sides, pointSize = 0, angle = 0) {
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
	 	this.angle = angle;
 	}
	/**
	 * Execute the Graphics command in the provided Canvas context.
	 * @method exec
	 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
	 */
 	exec (ctx) {
 		let x = this.x, y = this.y;
	 	let radius = this.radius;
	 	let angle = this.angle/180*Math.PI;
	 	let sides = this.sides;
	 	let ps = 1-this.pointSize;
	 	let a = Math.PI/sides;

	 	ctx.moveTo(x+Math.cos(angle)*radius, y+Math.sin(angle)*radius);
	 	for (let i = 0; i < sides; i++) {
	 		angle += a;
	 		if (ps != 1) {
	 			ctx.lineTo(x+Math.cos(angle)*radius*ps, y+Math.sin(angle)*radius*ps);
	 		}
	 		angle += a;
	 		ctx.lineTo(x+Math.cos(angle)*radius, y+Math.sin(angle)*radius);
	 	}
	 	ctx.closePath();
 	}
}

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
	let canvas = (createjs && createjs.createCanvas?createjs.createCanvas():document.createElement("canvas"));
	if (canvas.getContext) {
		Graphics._ctx = canvas.getContext("2d");
		canvas.width = canvas.height = 1;
	}
	Graphics.beginCmd = new BeginPath();
	Graphics.BASE_64 = {"A":0,"B":1,"C":2,"D":3,"E":4,"F":5,"G":6,"H":7,"I":8,"J":9,"K":10,"L":11,"M":12,"N":13,"O":14,"P":15,"Q":16,"R":17,"S":18,"T":19,"U":20,"V":21,"W":22,"X":23,"Y":24,"Z":25,"a":26,"b":27,"c":28,"d":29,"e":30,"f":31,"g":32,"h":33,"i":34,"j":35,"k":36,"l":37,"m":38,"n":39,"o":40,"p":41,"q":42,"r":43,"s":44,"t":45,"u":46,"v":47,"w":48,"x":49,"y":50,"z":51,"0":52,"1":53,"2":54,"3":55,"4":56,"5":57,"6":58,"7":59,"8":60,"9":61,"+":62,"/":63};
	Graphics.STROKE_CAPS_MAP = ["butt", "round", "square"];
	Graphics.STROKE_JOINTS_MAP = ["miter", "round", "bevel"];
	Graphics.EMPTY_SEGMENTS = [];
}

/*
* @license Event
* Visit http://createjs.com/ for documentation, updates and examples.
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

/**
 * A collection of classes that are shared across the CreateJS libraries.
 * Classes required by a library are compiled with that library.
 *
 * @module CreateJS
 * @main CreateJS
 */

/**
 * Contains properties and methods shared by all events for use with {{#crossLink "EventDispatcher"}}{{/crossLink}}.
 * Note that Event objects are often reused, so you should never
 * rely on an event object's state outside of the call stack it was received in.
 *
 * @class Event
 * @module CreateJS
 */
class Event$1 {

// constructor:
	/**
	 * @param {String} type The event type.
	 * @param {Boolean} [bubbles=false] Indicates whether the event will bubble through the display list.
	 * @param {Boolean} [cancelable=false] Indicates whether the default behaviour of this event can be cancelled.
	 * @constructor
	 */
	constructor (type, bubbles = false, cancelable = false) {
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
		this.timeStamp = new Date().getTime();

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
		this.removed = false;
	}

// public methods:
	/**
	 * Sets {{#crossLink "Event/defaultPrevented"}}{{/crossLink}} to true if the event is cancelable.
	 * Mirrors the DOM level 2 event standard. In general, cancelable events that have `preventDefault()` called will
	 * cancel the default behaviour associated with the event.
	 * @method preventDefault
	 */
	preventDefault () {
		this.defaultPrevented = this.cancelable;
	}

	/**
	 * Sets {{#crossLink "Event/propagationStopped"}}{{/crossLink}} to true.
	 * Mirrors the DOM event standard.
	 * @method stopPropagation
	 */
	stopPropagation () {
		this.propagationStopped = true;
	}

	/**
	 * Sets {{#crossLink "Event/propagationStopped"}}{{/crossLink}} and
	 * {{#crossLink "Event/immediatePropagationStopped"}}{{/crossLink}} to true.
	 * Mirrors the DOM event standard.
	 * @method stopImmediatePropagation
	 */
	stopImmediatePropagation () {
		this.immediatePropagationStopped = this.propagationStopped = true;
	}

	/**
	 * Causes the active listener to be removed via removeEventListener();
	 *
	 * 		myBtn.addEventListener("click", function(evt) {
	 * 			// do stuff...
	 * 			evt.remove(); // removes this listener.
	 * 		});
	 *
	 * @method remove
	 */
	remove () {
		this.removed = true;
	}

	/**
	 * Returns a clone of the Event instance.
	 * @method clone
	 * @return {Event} a clone of the Event instance.
	 */
	clone () {
		let event = new Event$1(this.type, this.bubbles, this.cancelable);
		for (let n in this) {
			if (this.hasOwnProperty(n)) {
				event[n] = this[n];
			}
		}

		return event;
	}

	/**
	 * Provides a chainable shortcut method for setting a number of properties on the instance.
	 *
	 * @method set
	 * @param {Object} props A generic object containing properties to copy to the instance.
	 * @return {Event} Returns the instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
	set (props) {
		for (let n in props) { this[n] = props[n]; }
		return this;
	}

	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 */
	toString () {
		return `[${this.constructor.name} (type=${this.type})]`;
	}

}

/*
* @license EventDispatcher
* Visit http://createjs.com/ for documentation, updates and examples.
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
 * @module CreateJS
 */
class EventDispatcher$1 {

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
	static initialize (target) {
		const p = EventDispatcher$1.prototype;
		target.addEventListener = p.addEventListener;
		target.on = p.on;
		target.removeEventListener = target.off = p.removeEventListener;
		target.removeAllEventListeners = p.removeAllEventListeners;
		target.hasEventListener = p.hasEventListener;
		target.dispatchEvent = p.dispatchEvent;
		target._dispatchEvent = p._dispatchEvent;
		target.willTrigger = p.willTrigger;
	}

// constructor:
	/**
	 * @constructor
	 */
	constructor () {
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
		this._captureListeners = null;
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
	addEventListener (type, listener, useCapture) {
		let listeners;
		if (useCapture) {
			listeners = this._captureListeners = this._captureListeners||{};
		} else {
			listeners = this._listeners = this._listeners||{};
		}
		let arr = listeners[type];
		if (arr) { this.removeEventListener(type, listener, useCapture); }
		arr = listeners[type]; // remove may have deleted the array
		if (!arr) { listeners[type] = [listener];  }
		else { arr.push(listener); }
		return listener;
	}

	/**
	 * A shortcut method for using addEventListener that makes it easier to specify an execution scope, have a listener
	 * only run once, associate arbitrary data with the listener, and remove the listener.
	 *
	 * This method works by creating an anonymous wrapper function and subscribing it with addEventListener.
	 * The wrapper function is returned for use with `removeEventListener` (or `off`).
	 *
	 * <b>IMPORTANT:</b> To remove a listener added with `on`, you must pass in the returned wrapper function as the listener, or use
	 * {{#crossLink "Event/remove"}}{{/crossLink}}. Likewise, each time you call `on` a NEW wrapper function is subscribed, so multiple calls
	 * to `on` with the same params will create multiple listeners.
	 *
	 * <h4>Example</h4>
	 *
	 * 		var listener = myBtn.on("click", handleClick, null, false, {count:3});
	 * 		function handleClick(evt, data) {
	 * 			data.count -= 1;
	 * 			console.log(this == myBtn); // true - scope defaults to the dispatcher
	 * 			if (data.count == 0) {
	 * 				alert("clicked 3 times!");
	 * 				myBtn.off("click", listener);
	 * 				// alternately: evt.remove();
	 * 			}
	 * 		}
	 *
	 * @method on
	 * @param {String} type The string type of the event.
	 * @param {Function | Object} listener An object with a handleEvent method, or a function that will be called when
	 * the event is dispatched.
	 * @param {Object} [scope] The scope to execute the listener in. Defaults to the dispatcher/currentTarget for function listeners, and to the listener itself for object listeners (ie. using handleEvent).
	 * @param {Boolean} [once=false] If true, the listener will remove itself after the first time it is triggered.
	 * @param {*} [data] Arbitrary data that will be included as the second parameter when the listener is called.
	 * @param {Boolean} [useCapture=false] For events that bubble, indicates whether to listen for the event in the capture or bubbling/target phase.
	 * @return {Function} Returns the anonymous function that was created and assigned as the listener. This is needed to remove the listener later using .removeEventListener.
	 */
	on (type, listener, scope = null, once = false, data = {}, useCapture = false) {
		if (listener.handleEvent) {
			scope = scope||listener;
			listener = listener.handleEvent;
		}
		scope = scope||this;
		return this.addEventListener(type, function(evt) {
			listener.call(scope, evt, data);
			once&&evt.remove();
		}, useCapture);
	}

	/**
	 * Removes the specified event listener.
	 *
	 * <b>Important Note:</b> that you must pass the exact function reference used when the event was added. If a proxy
	 * function, or function closure is used as the callback, the proxy/closure reference must be used - a new proxy or
	 * closure will not work.
	 *
	 * <h4>Example</h4>
	 *
	 *      displayObject.removeEventListener("click", handleClick);
	 *
	 * @method removeEventListener
	 * @param {String} type The string type of the event.
	 * @param {Function | Object} listener The listener function or object.
	 * @param {Boolean} [useCapture] For events that bubble, indicates whether to listen for the event in the capture or bubbling/target phase.
	 */
	removeEventListener (type, listener, useCapture) {
		const listeners = useCapture ? this._captureListeners : this._listeners;
		if (!listeners) { return; }
		const arr = listeners[type];
		if (!arr) { return; }
		const l = arr.length;
		for (let i=0; i<l; i++) {
			if (arr[i] == listener) {
				if (l==1) { delete(listeners[type]); } // allows for faster checks.
				else { arr.splice(i,1); }
				break;
			}
		}
	}

	/**
	 * A shortcut to the removeEventListener method, with the same parameters and return value. This is a companion to the
	 * .on method.
	 *
	 * <b>IMPORTANT:</b> To remove a listener added with `on`, you must pass in the returned wrapper function as the listener. See
	 * {{#crossLink "EventDispatcher/on"}}{{/crossLink}} for an example.
	 *
	 * @method off
	 * @param {String} type The string type of the event.
	 * @param {Function | Object} listener The listener function or object.
	 * @param {Boolean} [useCapture] For events that bubble, indicates whether to listen for the event in the capture or bubbling/target phase.
	 */
	off (type, listener, useCapture) {
		this.removeEventListener(type, listener, useCapture);
	}

	/**
	 * Removes all listeners for the specified type, or all listeners of all types.
	 *
	 * <h4>Example</h4>
	 *
	 *      // Remove all listeners
	 *      displayObject.removeAllEventListeners();
	 *
	 *      // Remove all click listeners
	 *      displayObject.removeAllEventListeners("click");
	 *
	 * @method removeAllEventListeners
	 * @param {String} [type] The string type of the event. If omitted, all listeners for all types will be removed.
	 */
	removeAllEventListeners (type) {
		if (!type) { this._listeners = this._captureListeners = null; }
		else {
			if (this._listeners) { delete(this._listeners[type]); }
			if (this._captureListeners) { delete(this._captureListeners[type]); }
		}
	}

	/**
	 * Dispatches the specified event to all listeners.
	 *
	 * <h4>Example</h4>
	 *
	 *      // Use a string event
	 *      this.dispatchEvent("complete");
	 *
	 *      // Use an Event instance
	 *      var event = new createjs.Event("progress");
	 *      this.dispatchEvent(event);
	 *
	 * @method dispatchEvent
	 * @param {Object | String | Event} eventObj An object with a "type" property, or a string type.
	 * While a generic object will work, it is recommended to use a CreateJS Event instance. If a string is used,
	 * dispatchEvent will construct an Event instance if necessary with the specified type. This latter approach can
	 * be used to avoid event object instantiation for non-bubbling events that may not have any listeners.
	 * @param {Boolean} [bubbles] Specifies the `bubbles` value when a string was passed to eventObj.
	 * @param {Boolean} [cancelable] Specifies the `cancelable` value when a string was passed to eventObj.
	 * @return {Boolean} Returns false if `preventDefault()` was called on a cancelable event, true otherwise.
	 */
	dispatchEvent (eventObj, bubbles = false, cancelable = false) {
		if (typeof eventObj == "string") {
			// skip everything if there's no listeners and it doesn't bubble:
			const listeners = this._listeners;
			if (!bubbles && (!listeners || !listeners[eventObj])) { return true; }
			eventObj = new Event$1(eventObj, bubbles, cancelable);
		} else if (eventObj.target && eventObj.clone) {
			// redispatching an active event object, so clone it:
			eventObj = eventObj.clone();
		}

		// TODO: it would be nice to eliminate this. Maybe in favour of evtObj instanceof Event? Or !!evtObj.createEvent
		try { eventObj.target = this; } catch (e) {} // try/catch allows redispatching of native events

		if (!eventObj.bubbles || !this.parent) {
			this._dispatchEvent(eventObj, 2);
		} else {
			let top = this, i;
			const list = [top];
			while (top.parent) { list.push(top = top.parent); }
			const l = list.length;

			// capture & atTarget
			for (i=l-1; i>=0 && !eventObj.propagationStopped; i--) {
				list[i]._dispatchEvent(eventObj, 1+(i==0));
			}
			// bubbling
			for (i=1; i<l && !eventObj.propagationStopped; i++) {
				list[i]._dispatchEvent(eventObj, 3);
			}
		}
		return !eventObj.defaultPrevented;
	}

	/**
	 * Indicates whether there is at least one listener for the specified event type.
	 * @method hasEventListener
	 * @param {String} type The string type of the event.
	 * @return {Boolean} Returns true if there is at least one listener for the specified event.
	 */
	hasEventListener (type) {
		const listeners = this._listeners, captureListeners = this._captureListeners;
		return !!((listeners && listeners[type]) || (captureListeners && captureListeners[type]));
	}

	/**
	 * Indicates whether there is at least one listener for the specified event type on this object or any of its
	 * ancestors (parent, parent's parent, etc). A return value of true indicates that if a bubbling event of the
	 * specified type is dispatched from this object, it will trigger at least one listener.
	 *
	 * This is similar to {{#crossLink "EventDispatcher/hasEventListener"}}{{/crossLink}}, but it searches the entire
	 * event flow for a listener, not just this object.
	 * @method willTrigger
	 * @param {String} type The string type of the event.
	 * @return {Boolean} Returns `true` if there is at least one listener for the specified event.
	 */
	willTrigger (type) {
		let o = this;
		while (o) {
			if (o.hasEventListener(type)) { return true; }
			o = o.parent;
		}
		return false;
	}

	/**
	 * @method toString
	 * @return {String} a string representation of the instance.
	 */
	toString () {
		return "[EventDispatcher]";
	}

	// private methods:
	/**
	 * @method _dispatchEvent
	 * @param {Object | String | Event} eventObj
	 * @param {Object} eventPhase
	 * @protected
	 */
	_dispatchEvent (eventObj, eventPhase) {
		const listeners = (eventPhase==1) ? this._captureListeners : this._listeners;
		let l;
		if (eventObj && listeners) {
			let arr = listeners[eventObj.type];
			if (!arr||!(l=arr.length)) { return; }
			try { eventObj.currentTarget = this; } catch (e) {}
			try { eventObj.eventPhase = eventPhase; } catch (e) {}
			eventObj.removed = false;

			arr = arr.slice(); // to avoid issues with items being removed or added during the dispatch
			for (let i=0; i<l && !eventObj.immediatePropagationStopped; i++) {
				let o = arr[i];
				if (o.handleEvent) { o.handleEvent(eventObj); }
				else { o(eventObj); }
				if (eventObj.removed) {
					this.off(eventObj.type, o, eventPhase==1);
					eventObj.removed = false;
				}
			}
		}
	}

}

/*
* TweenJS
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

/**
 * Base class that both {{#crossLink "Tween"}}{{/crossLink}} and {{#crossLink "Timeline"}}{{/crossLink}} extend. Should not be instantiated directly.
 * @class AbstractTween
 * @param {Object} [props]
 * @extends EventDispatcher
 * @module TweenJS
 * @constructor
 */
class AbstractTween extends EventDispatcher$1 {

// constructor:
  /**
   * @constructor
   * @param {Object} [props]
   */
  constructor (props) {
    super();

  // public properties:
		/**
		 * Causes this tween to continue playing when a global pause is active. For example, if TweenJS is using {{#crossLink "Ticker"}}{{/crossLink}},
		 * then setting this to false (the default) will cause this tween to be paused when `Ticker.setPaused(true)`
		 * is called. See the {{#crossLink "Tween/tick"}}{{/crossLink}} method for more info. Can be set via the `props`
		 * parameter.
		 * @property ignoreGlobalPause
		 * @type Boolean
		 * @default false
		 */
		this.ignoreGlobalPause = false;

		/**
		 * Indicates the number of times to loop. If set to -1, the tween will loop continuously.
		 * @property loop
		 * @type {Number}
		 * @default 0
		 */
		this.loop = 0;

		/**
		 * Uses ticks for all durations instead of milliseconds. This also changes the behaviour of some actions (such as `call`).
		 * Changing this value on a running tween could have unexpected results.
		 * @property useTicks
		 * @type {Boolean}
		 * @default false
		 * @readonly
		 */
		this.useTicks = false;

		/**
		 * Causes the tween to play in reverse.
		 * @property reversed
		 * @type {Boolean}
		 * @default false
		 */
		this.reversed = false;

		/**
		 * Causes the tween to reverse direction at the end of each loop.
		 * @property bounce
		 * @type {Boolean}
		 * @default false
		 */
		this.bounce = false;

		/**
		 * Changes the rate at which the tween advances. For example, a `timeScale` value of `2` will double the
		 * playback speed, a value of `0.5` would halve it.
		 * @property timeScale
		 * @type {Number}
		 * @default 1
		 */
		this.timeScale = 1;

		/**
		 * Indicates the duration of this tween in milliseconds (or ticks if `useTicks` is true), irrespective of `loops`.
		 * This value is automatically updated as you modify the tween. Changing it directly could result in unexpected
		 * behaviour.
		 * @property duration
		 * @type {Number}
		 * @default 0
		 * @readonly
		 */
		this.duration = 0;

		/**
		 * The current normalized position of the tween. This will always be a value between 0 and `duration`.
		 * Changing this property directly will have unexpected results, use {{#crossLink "Tween/setPosition"}}{{/crossLink}}.
		 * @property position
		 * @type {Object}
		 * @default 0
		 * @readonly
		 */
		this.position = 0;

		/**
		 * The raw tween position. This value will be between `0` and `loops * duration` while the tween is active, or -1 before it activates.
		 * @property rawPosition
		 * @type {Number}
		 * @default -1
		 * @readonly
		 */
		this.rawPosition = -1;


	// private properties:
		/**
		 * @property _paused
		 * @type {Boolean}
		 * @default false
		 * @protected
		 */
		this._paused = true;

		/**
		 * @property _next
		 * @type {Tween}
		 * @default null
		 * @protected
		 */
		this._next = null;

		/**
		 * @property _prev
		 * @type {Tween}
		 * @default null
		 * @protected
		 */
		this._prev = null;

		/**
		 * @property _parent
		 * @type {Object}
		 * @default null
		 * @protected
		 */
		this._parent = null;

		/**
		 * @property _labels
		 * @type Object
		 * @protected
		 */
		this._labels = null;

		/**
		 * @property _labelList
		 * @type Array[Object]
		 * @protected
		 */
		this._labelList = null;

		if (props) {
			this.useTicks = !!props.useTicks;
			this.ignoreGlobalPause = !!props.ignoreGlobalPause;
			this.loop = props.loop === true ? -1 : (props.loop||0);
			this.reversed = !!props.reversed;
			this.bounce = !!props.bounce;
			this.timeScale = props.timeScale||1;
			props.onChange && this.addEventListener("change", props.onChange);
			props.onComplete && this.addEventListener("complete", props.onComplete);
		}

		// while `position` is shared, it needs to happen after ALL props are set, so it's handled in _init()
  }

// accessor properties:
	/**
	 * Returns a list of the labels defined on this tween sorted by position.
	 * @property labels
	 * @return {Array[Object]} A sorted array of objects with label and position properties.
	 */
	get labels () {
		let list = this._labelList;
		if (!list) {
			list = this._labelList = [];
			let labels = this._labels;
			for (let label in labels) {
				list.push({ label, position: labels[label] });
			}
			list.sort((a, b) => a.position - b.position);
		}
		return list;
	}

  /**
	 * Defines labels for use with gotoAndPlay/Stop. Overwrites any previously set labels.
	 * @param {Object} labels An object defining labels for using {{#crossLink "Timeline/gotoAndPlay"}}{{/crossLink}}/{{#crossLink "Timeline/gotoAndStop"}}{{/crossLink}}
	 * in the form `{myLabelName:time}` where time is in milliseconds (or ticks if `useTicks` is `true`).
	 */
	set labels (labels) {
		this._labels = labels;
		this._labelList = null;
	}

// public methods:
	/**
	 * Advances the tween by a specified amount.
	 * @method advance
	 * @param {Number} delta The amount to advance in milliseconds (or ticks if useTicks is true). Negative values are supported.
	 * @param {Boolean} [ignoreActions=false] If true, actions will not be executed due to this change in position.
	 */
	advance (delta, ignoreActions = false) {
		this.setPosition(this.rawPosition+delta*this.timeScale, ignoreActions);
	}

	/**
	 * Advances the tween to a specified position.
	 * @method setPosition
	 * @param {Number} rawPosition The raw position to seek to in milliseconds (or ticks if useTicks is true).
	 * @param {Boolean} [ignoreActions=false] If true, do not run any actions that would be triggered by this operation.
	 * @param {Boolean} [jump=false] If true, only actions at the new position will be run. If false, actions between the old and new position are run.
	 * @param {Function} [callback] Primarily for use with MovieClip, this callback is called after properties are updated, but before actions are run.
	 */
	setPosition (rawPosition, ignoreActions = false, jump = false, callback) {
		let d = this.duration, loopCount = this.loop, prevRawPos = this.rawPosition;
		let loop = 0, t = 0, end = false;

		// normalize position:
		if (rawPosition < 0) { rawPosition = 0; }

		if (d === 0) {
			// deal with 0 length tweens.
			end = true;
			if (prevRawPos !== -1) { return end; } // we can avoid doing anything else if we're already at 0.
		} else {
			loop = rawPosition / d | 0;
			t = rawPosition - loop * d;

			end = (loopCount !== -1 && rawPosition >= loopCount * d + d);
			if (end) { rawPosition = (t = d) * (loop = loopCount) + d; }
			if (rawPosition === prevRawPos) { return end; } // no need to update

			let rev = !this.reversed !== !(this.bounce && loop % 2); // current loop is reversed
			if (rev) { t = d - t; }
		}

		// set this in advance in case an action modifies position:
		this.position = t;
		this.rawPosition = rawPosition;

		this._updatePosition(jump, end);
		if (end) { this.setPaused(true); }

		callback && callback(this);

		if (!ignoreActions) { this._runActions(prevRawPos, rawPosition, jump, !jump && prevRawPos === -1); }

		this.dispatchEvent("change");
		if (end) { this.dispatchEvent("complete"); }
	}

	/**
	 * Calculates a normalized position based on a raw position. For example, given a tween with a duration of 3000ms set to loop:
	 * 	console.log(myTween.calculatePosition(3700); // 700
	 * @method calculatePosition
	 * @param {Number} rawPosition A raw position.
	 */
	calculatePosition (rawPosition) {
		// largely duplicated from setPosition, but necessary to avoid having to instantiate generic objects to pass values (end, loop, position) back.
		let d = this.duration, loopCount = this.loop, loop = 0, t = 0;

		if (d === 0) { return 0; }
		if (loopCount !== -1 && rawPosition >= loopCount * d + d) { t = d; loop = loopCount; } // end
		else if (rawPosition < 0) { t = 0; }
		else { loop = rawPosition /d | 0; t = rawPosition - loop * d; }

		let rev = !this.reversed !== !(this.bounce && loop % 2); // current loop is reversed
		return rev ? d - t : t;
	}

	/**
	 * Adds a label that can be used with {{#crossLink "Timeline/gotoAndPlay"}}{{/crossLink}}/{{#crossLink "Timeline/gotoAndStop"}}{{/crossLink}}.
	 * @method addLabel
	 * @param {String} label The label name.
	 * @param {Number} position The position this label represents.
	 */
	addLabel (label, position) {
		if (!this._labels) { this._labels = {}; }
		this._labels[label] = position;
		let list = this._labelList;
		if (list) {
			for (let i = 0, l = list.length; i < l; i++) { if (position < list[i].position) { break; } }
			list.splice(i, 0, { label, position });
		}
	}

	/**
	 * Returns the name of the label on or immediately before the current position. For example, given a tween with
	 * two labels, "first" on frame index 4, and "second" on frame 8, getCurrentLabel would return:
	 * <UL>
	 * 		<LI>null if the current position is 2.</LI>
	 * 		<LI>"first" if the current position is 4.</LI>
	 * 		<LI>"first" if the current position is 7.</LI>
	 * 		<LI>"second" if the current position is 15.</LI>
	 * </UL>
	 * @method getCurrentLabel
	 * @return {String} The name of the current label or null if there is no label
	 */
	getCurrentLabel (pos) {
		let labels = this.labels, i, l;
		if (pos == null) { pos = this.position; }
		for (i = 0, l = labels.length; i < l; i++) { if (pos < labels[i].position) { break; } }
		return i === 0 ? null : labels[i - 1].label;
	}

	/**
	 * Unpauses this timeline and jumps to the specified position or label.
	 * @method gotoAndPlay
	 * @param {String|Number} positionOrLabel The position in milliseconds (or ticks if `useTicks` is `true`)
	 * or label to jump to.
	 */
	gotoAndPlay (positionOrLabel) {
		this.setPaused(false);
		this._goto(positionOrLabel);
	}

	/**
	 * Pauses this timeline and jumps to the specified position or label.
	 * @method gotoAndStop
	 * @param {String|Number} positionOrLabel The position in milliseconds (or ticks if `useTicks` is `true`) or label
	 * to jump to.
	 */
	gotoAndStop (positionOrLabel) {
		this.setPaused(true);
		this._goto(positionOrLabel);
	}

	/**
	 * If a numeric position is passed, it is returned unchanged. If a string is passed, the position of the
	 * corresponding frame label will be returned, or `null` if a matching label is not defined.
	 * @method resolve
	 * @param {String|Number} positionOrLabel A numeric position value or label string.
	 */
	resolve (positionOrLabel) {
		let pos = Number(positionOrLabel);
		if (isNaN(pos)) { pos = this._labels && this._labels[positionOrLabel]; }
		return pos;
	}

	/**
	 * Pauses or plays this tween.
	 * @method setPaused
	 * @param {Boolean} [value=true] Indicates whether the tween should be paused (`true`) or played (`false`).
	 * @return {Tween} This tween instance (for chaining calls)
	 * @chainable
	 */
	setPaused (value) {
		Tween._register(this, value);
		return this;
	}

	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 */
	toString () {
		return `[${this.constructor.name}${this.name ? ` (name=${this.name})` : ""}]`;
	}

	/**
	 * @method clone
	 * @protected
	 */
	clone () {
		throw("AbstractTween can not be cloned.")
	}

// private methods:
	/**
	 * Shared logic that executes at the end of the subclass constructor.
	 * @method _init
	 * @protected
	 */
	_init (props) {
		if (!props || !props.paused) { this.setPaused(false); }
		if (props && props.position != null) { this.setPosition(props.position); }
	}

	/**
	 * @method _goto
	 * @protected
	 */
	_goto (positionOrLabel) {
		let pos = this.resolve(positionOrLabel);
		if (pos != null) { this.setPosition(pos, false, true); }
	}

	/**
   * Runs actions between startPos & endPos. Separated to support action deferral.
	 * @method _runActions
	 * @protected
	 */
	_runActions (startRawPos, endRawPos, jump, includeStart) {
	  // console.log(this.passive === false ? " > Tween" : "Timeline", "run", startRawPos, endRawPos, jump, includeStart);
		// if we don't have any actions, and we're not a Timeline, then return:
		// TODO: a cleaner way to handle this would be to override this method in Tween, but I'm not sure it's worth the overhead.
		if (!this._actionHead && !this._tweens) { return; }

		let d = this.duration, reversed = this.reversed, bounce = this.bounce, loopCount = this.loop;
		let loop0, loop1, t0, t1;

		if (d === 0) {
			// deal with 0 length tweens:
			loop0 = loop1 = t0 = t1 = 0;
			reversed = bounce = false;
		} else {
			loop0 = startRawPos / d | 0;
			loop1 = endRawPos / d | 0;
			t0 = startRawPos - loop0 * d;
			t1 = endRawPos - loop1 * d;
		}

		// catch positions that are past the end:
		if (loopCount !== -1) {
			if (loop1 > loopCount) { t1 = d; loop1 = loopCount; }
			if (loop0 > loopCount) { t0 = d; loop0 = loopCount; }
		}

		// special cases:
		if (jump) { return this._runActionsRange(t1, t1, jump, includeStart); } // jump.
		else if (loop0 === loop1 && t0 === t1 && !jump) { return; } // no actions if the position is identical.
		else if (loop0 === -1) { loop0 = t0 = 0; } // correct the -1 value for first advance, important with useTicks.

		let dir = (startRawPos <= endRawPos), loop = loop0;
		do {
			let rev = !reversed !== !(bounce && loop % 2);

			let start = (loop === loop0) ? t0 : dir ? 0 : d;
			let end = (loop === loop1) ? t1 : dir ? d : 0;

			if (rev) {
				start = d - start;
				end = d - end;
			}

			if (bounce && loop !== loop0 && start === end) { /* bounced onto the same time/frame, don't re-execute end actions */ }
			else if (this._runActionsRange(start, end, jump, includeStart || (loop !== loop0 && !bounce))) { return true; }

			includeStart = false;
		} while ((dir && ++loop <= loop1) || (!dir && --loop >= loop1));
	}

  /**
	 * @method _runActionsRange
   * @abstract
	 * @protected
	 */
	_runActionsRange (startPos, endPos, jump, includeStart) {
		// throw("_runActionsRange is abstract and must be overridden by a subclass");
	}

  /**
	 * @method _updatePosition
   * @abstract
	 * @protected
	 */
	_updatePosition (jump, end) {
    // throw("_updatePosition is abstract and must be overridden by a subclass");
	}

}

// events:
/**
 * Dispatched whenever the tween's position changes.
 * @event change
 */
/**
 * Dispatched when the tween reaches its end and has paused itself. This does not fire until all loops are complete;
 * tweens that loop continuously will never fire a complete event.
 * @event complete
 */

/*
* Ease
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

/**
 * The Ease class provides a collection of easing functions for use with TweenJS. It does not use the standard 4 param
 * easing signature. Instead it uses a single param which indicates the current linear ratio (0 to 1) of the tween.
 *
 * Most methods on Ease can be passed directly as easing functions:
 *
 *      Tween.get(target).to({x:100}, 500, Ease.linear);
 *
 * However, methods beginning with "get" will return an easing function based on parameter values:
 *
 *      Tween.get(target).to({y:200}, 500, Ease.getPowIn(2.2));
 *
 * Please see the <a href="http://www.createjs.com/Demos/TweenJS/Tween_SparkTable">spark table demo</a> for an
 * overview of the different ease types on <a href="http://tweenjs.com">TweenJS.com</a>.
 *
 * <em>Equations derived from work by Robert Penner.</em>
 * @class Ease
 * @static
 * @module TweenJS
 */
class Ease {

	constructor () {
		throw "Ease is static and cannot be instantiated.";
	}

// static methods:
	/**
	 * @method linear
	 * @param {Number} t
	 * @static
	 * @return {Number}
	 */
	static linear (t) {
		return t;
	}

	/**
	 * Mimics the simple -100 to 100 easing in Flash Pro.
	 * @method get
	 * @param {Number} amount A value from -1 (ease in) to 1 (ease out) indicating the strength and direction of the ease.
	 * @static
	 * @return {Function}
	 */
	static get (amount) {
		if (amount < -1) { amount = -1; }
		else if (amount > 1) { amount = 1; }
		return function (t) {
			if (amount == 0) { return t; }
			if (amount < 0) { return t * (t * -amount + 1 + amount); }
			return t * ((2 - t) * amount + (1 - amount));
		};
	}

	/**
	 * Configurable exponential ease.
	 * @method getPowIn
	 * @param {Number} pow The exponent to use (ex. 3 would return a cubic ease).
	 * @static
	 * @return {Function}
	 */
	static getPowIn (pow) {
		return function (t) {
			return Math.pow(t, pow);
		};
	}

	/**
	 * Configurable exponential ease.
	 * @method getPowOut
	 * @param {Number} pow The exponent to use (ex. 3 would return a cubic ease).
	 * @static
	 * @return {Function}
	 */
	static getPowOut (pow) {
		return function (t) {
			return 1 - Math.pow(1 - t, pow);
		};
	}

	/**
	 * Configurable exponential ease.
	 * @method getPowInOut
	 * @param {Number} pow The exponent to use (ex. 3 would return a cubic ease).
	 * @static
	 * @return {Function}
	 */
	static getPowInOut (pow) {
		return function (t) {
			if ((t *= 2) < 1) return 0.5 * Math.pow(t, pow);
			return 1 - 0.5 * Math.abs(Math.pow(2 - t, pow));
		};
	}

	/**
	 * @method sineIn
	 * @param {Number} t
	 * @static
	 * @return {Number}
	 */
	static sineIn (t) {
		return 1 - Math.cos(t * Math.PI / 2);
	}

	/**
	 * @method sineOut
	 * @param {Number} t
	 * @static
	 * @return {Number}
	 */
	static sineOut (t) {
		return Math.sin(t * Math.PI / 2);
	}

	/**
	 * @method sineInOut
	 * @param {Number} t
	 * @static
	 * @return {Number}
	 */
	static sineInOut (t) {
		return -0.5 * (Math.cos(Math.PI * t) - 1);
	}

	/**
	 * Configurable "back in" ease.
	 * @method getBackIn
	 * @param {Number} amount The strength of the ease.
	 * @static
	 * @return {Function}
	 */
	static getBackIn (amount) {
		return function (t) {
			return t * t * ((amount + 1) * t - amount);
		};
	}

	/**
	 * Configurable "back out" ease.
	 * @method getBackOut
	 * @param {Number} amount The strength of the ease.
	 * @static
	 * @return {Function}
	 */
	static getBackOut (amount) {
		return function (t) {
			return (--t * t * ((amount + 1) * t + amount) + 1);
		};
	}

	/**
	 * Configurable "back in out" ease.
	 * @method getBackInOut
	 * @param {Number} amount The strength of the ease.
	 * @static
	 * @return {Function}
	 */
	static getBackInOut (amount) {
		amount *= 1.525;
		return function (t) {
			if ((t *= 2) < 1) return 0.5 * (t * t * ((amount + 1) * t - amount));
			return 0.5 * ((t -= 2) * t * ((amount + 1) * t + amount) + 2);
		};
	}

	/**
	 * @method circIn
	 * @param {Number} t
	 * @static
	 * @return {Number}
	 */
	static circIn (t) {
		return -(Math.sqrt(1 - t * t) - 1);
	}

	/**
	 * @method circOut
	 * @param {Number} t
	 * @static
	 * @return {Number}
	 */
	static circOut (t) {
		return Math.sqrt(1 - --t * t);
	}

	/**
	 * @method circInOut
	 * @param {Number} t
	 * @static
	 * @return {Number}
	 */
	static circInOut (t) {
		if ((t *= 2) < 1) return -0.5 * (Math.sqrt(1 - t * t) - 1);
		return 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
	}

	/**
	 * @method bounceIn
	 * @param {Number} t
	 * @static
	 * @return {Number}
	 */
	static bounceIn (t) {
		return 1 - Ease.bounceOut(1 - t);
	}

	/**
	 * @method bounceOut
	 * @param {Number} t
	 * @static
	 * @return {Number}
	 */
	static bounceOut (t) {
		if (t < 1 / 2.75) {
			return 7.5625 * t * t;
		} else if (t < 2 / 2.75) {
			return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
		} else if (t < 2.5 / 2.75) {
			return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
		} else {
			return 7.5625 * ( t-= 2.625 / 2.75) * t + 0.984375;
		}
	}

	/**
	 * @method bounceInOut
	 * @param {Number} t
	 * @static
	 * @return {Number}
	 */
	static bounceInOut (t) {
		if (t < 0.5) return Ease.bounceIn(t * 2) * 0.5;
		return Ease.bounceOut(t * 2 - 1) * 0.5 + 0.5;
	}

	/**
	 * Configurable elastic ease.
	 * @method getElasticIn
	 * @param {Number} amplitude
	 * @param {Number} period
	 * @static
	 * @return {Function}
	 */
	static getElasticIn (amplitude, period) {
		let pi2 = Math.PI * 2;
		return function (t) {
			if (t === 0 || t === 1) return t;
			let s = period / pi2 * Math.asin(1 / amplitude);
			return -(amplitude * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * pi2 / period));
		};
	}

	/**
	 * Configurable elastic ease.
	 * @method getElasticOut
	 * @param {Number} amplitude
	 * @param {Number} period
	 * @static
	 * @return {Function}
	 */
	static getElasticOut (amplitude, period) {
		let pi2 = Math.PI * 2;
		return function (t) {
			if (t === 0 || t === 1) return t;
			let s = period / pi2 * Math.asin(1 / amplitude);
			return amplitude * Math.pow(2, -10 * t) * Math.sin((t - s) * pi2 / period) + 1;
		};
	}

	/**
	 * Configurable elastic ease.
	 * @method getElasticInOut
	 * @param {Number} amplitude
	 * @param {Number} period
	 * @static
	 * @return {Function}
	 */
	static getElasticInOut (amplitude, period) {
		let pi2 = Math.PI * 2;
		return function (t) {
			let s = period / pi2 * Math.asin(1 / amplitude);
			if ((t *= 2) < 1) return -0.5 * (amplitude * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * pi2 / period));
			return amplitude * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - s) * pi2 / period) * 0.5 + 1;
		};
	}

}

// static properties
/**
 * Identical to linear.
 * @method none
 * @param {Number} t
 * @static
 * @return {Number}
 */
Ease.none = Ease.linear;
/**
 * @method quadIn
 * @param {Number} t
 * @static
 * @return {Number}
 */
Ease.quadIn = Ease.getPowIn(2);
/**
 * @method quadOut
 * @param {Number} t
 * @static
 * @return {Number}
 */
Ease.quadOut = Ease.getPowOut(2);
/**
 * @method quadInOut
 * @param {Number} t
 * @static
 * @return {Number}
 */
Ease.quadInOut = Ease.getPowInOut(2);
/**
 * @method cubicIn
 * @param {Number} t
 * @static
 * @return {Number}
 */
Ease.cubicIn = Ease.getPowIn(3);
/**
 * @method cubicOut
 * @param {Number} t
 * @static
 * @return {Number}
 */
Ease.cubicOut = Ease.getPowOut(3);
/**
 * @method cubicInOut
 * @param {Number} t
 * @static
 * @return {Number}
 */
Ease.cubicInOut = Ease.getPowInOut(3);
/**
 * @method quartIn
 * @param {Number} t
 * @static
 * @return {Number}
 */
Ease.quartIn = Ease.getPowIn(4);
/**
 * @method quartOut
 * @param {Number} t
 * @static
 * @return {Number}
 */
Ease.quartOut = Ease.getPowOut(4);
/**
 * @method quartInOut
 * @param {Number} t
 * @static
 * @return {Number}
 */
Ease.quartInOut = Ease.getPowInOut(4);
/**
 * @method quintIn
 * @param {Number} t
 * @static
 * @return {Number}
 */
Ease.quintIn = Ease.getPowIn(5);
/**
 * @method quintOut
 * @param {Number} t
 * @static
 * @return {Number}
 */
Ease.quintOut = Ease.getPowOut(5);
/**
 * @method quintInOut
 * @param {Number} t
 * @static
 * @return {Number}
 */
Ease.quintInOut = Ease.getPowInOut(5);
/**
 * @method backIn
 * @param {Number} t
 * @static
 * @return {Number}
 */
Ease.backIn = Ease.getBackIn(1.7);
/**
 * @method backOut
 * @param {Number} t
 * @static
 * @return {Number}
 */
Ease.backOut = Ease.getBackOut(1.7);
/**
 * @method backInOut
 * @param {Number} t
 * @static
 * @return {Number}
 */
Ease.backInOut = Ease.getBackInOut(1.7);
/**
 * @method elasticIn
 * @param {Number} t
 * @static
 * @return {Number}
 */
Ease.elasticIn = Ease.getElasticIn(1, 0.3);
/**
 * @method elasticOut
 * @param {Number} t
 * @static
 * @return {Number}
 */
Ease.elasticOut = Ease.getElasticOut(1, 0.3);
/**
 * @method elasticInOut
 * @param {Number} t
 * @static
 * @return {Number}
 */
Ease.elasticInOut = Ease.getElasticInOut(1, 0.3 * 1.5);

/*
* @license Ticker
* Visit http://createjs.com/ for documentation, updates and examples.
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

/**
 * The Ticker provides a centralized tick or heartbeat broadcast at a set interval. Listeners can subscribe to the tick
 * event to be notified when a set time interval has elapsed.
 *
 * Note that the interval that the tick event is called is a target interval, and may be broadcast at a slower interval
 * when under high CPU load. The Ticker class uses a static interface (ex. `Ticker.framerate = 30;`) and
 * can not be instantiated.
 *
 * <h4>Example</h4>
 *
 *      createjs.Ticker.addEventListener("tick", handleTick);
 *      function handleTick(event) {
 *          // Actions carried out each tick (aka frame)
 *          if (!event.paused) {
 *              // Actions carried out when the Ticker is not paused.
 *          }
 *      }
 *
 * @class TickerAPI
 * @extends EventDispatcher
 * @module CreateJS
 */
class TickerAPI$1 extends EventDispatcher$1 {

// constructor:
	/**
	 * @param name {String} The name assigned to this instance.
	 * @constructor
	 * TODO-ES6: Pass timingMode, maxDelta, paused values as instantiation arguments?
	 */
	constructor (name) {
		super();

// public properties:
		/**
		 * The name of this instance.
		 * @property name
		 * @type {String}
		 */
		this.name = name;
		/**
		 * Specifies the timing api (setTimeout or requestAnimationFrame) and mode to use. See
		 * {{#crossLink "Ticker/TIMEOUT"}}{{/crossLink}}, {{#crossLink "Ticker/RAF"}}{{/crossLink}}, and
		 * {{#crossLink "Ticker/RAF_SYNCHED"}}{{/crossLink}} for mode details.
		 * @property timingMode
		 * @type {String}
		 * @default Ticker.TIMEOUT
		 */
		this.timingMode = TickerAPI$1.TIMEOUT;

		/**
		 * Specifies a maximum value for the delta property in the tick event object. This is useful when building time
		 * based animations and systems to prevent issues caused by large time gaps caused by background tabs, system sleep,
		 * alert dialogs, or other blocking routines. Double the expected frame duration is often an effective value
		 * (ex. maxDelta=50 when running at 40fps).
		 *
		 * This does not impact any other values (ex. time, runTime, etc), so you may experience issues if you enable maxDelta
		 * when using both delta and other values.
		 *
		 * If 0, there is no maximum.
		 * @property maxDelta
		 * @type {number}
		 * @default 0
		 */
		this.maxDelta = 0;

		/**
		 * When the ticker is paused, all listeners will still receive a tick event, but the <code>paused</code> property
		 * of the event will be `true`. Also, while paused the `runTime` will not increase. See {{#crossLink "Ticker/tick:event"}}{{/crossLink}},
		 * {{#crossLink "Ticker/getTime"}}{{/crossLink}}, and {{#crossLink "Ticker/getEventTime"}}{{/crossLink}} for more
		 * info.
		 *
		 * <h4>Example</h4>
		 *
		 *      createjs.Ticker.addEventListener("tick", handleTick);
		 *      createjs.Ticker.paused = true;
		 *      function handleTick(event) {
		 *          console.log(event.paused,
		 *          	createjs.Ticker.getTime(false),
		 *          	createjs.Ticker.getTime(true));
		 *      }
		 *
		 * @property paused
		 * @type {Boolean}
		 * @default false
		 */
		this.paused = false;

// private properties:
		/**
		 * @property _inited
		 * @type {Boolean}
		 * @protected
		 */
		this._inited = false;

		/**
		 * @property _startTime
		 * @type {Number}
		 * @protected
		 */
		this._startTime = 0;

		/**
		 * @property _pausedTime
		 * @type {Number}
		 * @protected
		 */
		this._pausedTime = 0;

		/**
		 * The number of ticks that have passed
		 * @property _ticks
		 * @type {Number}
		 * @protected
		 */
		this._ticks = 0;

		/**
		 * The number of ticks that have passed while Ticker has been paused
		 * @property _pausedTicks
		 * @type {Number}
		 * @protected
		 */
		this._pausedTicks = 0;

		/**
		 * @property _interval
		 * @type {Number}
		 * @protected
		 */
		this._interval = 50;

		/**
		 * @property _lastTime
		 * @type {Number}
		 * @protected
		 */
		this._lastTime = 0;

		/**
		 * @property _times
		 * @type {Array}
		 * @protected
		 */
		this._times = null;

		/**
		 * @property _tickTimes
		 * @type {Array}
		 * @protected
		 */
		this._tickTimes = null;

		/**
		 * Stores the timeout or requestAnimationFrame id.
		 * @property _timerId
		 * @type {Number}
		 * @protected
		 */
		this._timerId = null;

		/**
		 * True if currently using requestAnimationFrame, false if using setTimeout. This may be different than timingMode
		 * if that property changed and a tick hasn't fired.
		 * @property _raf
		 * @type {Boolean}
		 * @protected
		 */
		this._raf = true;
	}

// accessor properties:
	/**
	 * Indicates the target time (in milliseconds) between ticks. Default is 50 (20 FPS).
	 * Note that actual time between ticks may be more than specified depending on CPU load.
	 * This property is ignored if the ticker is using the `RAF` timing mode.
	 * @property interval
	 * @static
	 * @type {Number}
	 */
	get interval () {
		return this._interval;
	}

	set interval (interval) {
		this._interval = interval;
		if (!this._inited) { return; }
		this._setupTick();
	}

	/**
	 * Indicates the target frame rate in frames per second (FPS). Effectively just a shortcut to `interval`, where
	 * `framerate == 1000/interval`.
	 * @property framerate
	 * @static
	 * @type {Number}
	 */
	get framerate () {
		return 1000/this._interval;
	}

	set framerate (fps) {
		this.interval = 1000/fps;
	}

// public methods:
	/**
	 * Call createjs.Ticker.create() to get a new TickerAPI instance.
	 * It is not initalized by default and its ticks are not synched with any other instance.
	 *
	 * @param name {String} The name given to the new instance.
	 * @method create
	 * @return {TickerAPI} A new TickerAPI instance.
	 */
	create (name) {
		return new TickerAPI$1(name);
	}

	/**
	 * Starts the tick. This is called automatically when the first listener is added.
	 * @method init
	 */
	init () {
		if (this._inited) { return; }
		this._inited = true;
		this._times = [];
		this._tickTimes = [];
		this._startTime = this._getTime();
		this._times.push(this._lastTime = 0);
		this._setupTick();
	}

	/**
	 * Stops the Ticker and removes all listeners. Use init() to restart the Ticker.
	 * @method reset
	 */
	reset () {
		if (this._raf) {
			let f = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame;
			f&&f(this._timerId);
		} else {
			clearTimeout(this._timerId);
		}
		this.removeAllEventListeners("tick");
		this._timerId = this._times = this._tickTimes = null;
		this._startTime = this._lastTime = this._ticks = 0;
		this._inited = false;
	}

	/**
	 * Init the Ticker instance if it hasn't been already.
	 * Docced in superclass.
	 */
	addEventListener (type, listener, useCapture) {
		!this._inited && this.init();
		return super.addEventListener(type, listener, useCapture);
	}

	/**
	 * Returns the average time spent within a tick. This can vary significantly from the value provided by getMeasuredFPS
	 * because it only measures the time spent within the tick execution stack.
	 *
	 * Example 1: With a target FPS of 20, getMeasuredFPS() returns 20fps, which indicates an average of 50ms between
	 * the end of one tick and the end of the next. However, getMeasuredTickTime() returns 15ms. This indicates that
	 * there may be up to 35ms of "idle" time between the end of one tick and the start of the next.
	 *
	 * Example 2: With a target FPS of 30, getFPS() returns 10fps, which indicates an average of 100ms between the end of
	 * one tick and the end of the next. However, getMeasuredTickTime() returns 20ms. This would indicate that something
	 * other than the tick is using ~80ms (another script, DOM rendering, etc).
	 * @method getMeasuredTickTime
	 * @param {Number} [ticks] The number of previous ticks over which to measure the average time spent in a tick.
	 * Defaults to the number of ticks per second. To get only the last tick's time, pass in 1.
	 * @return {Number} The average time spent in a tick in milliseconds.
	 */
	getMeasuredTickTime (ticks) {
		let times=this._tickTimes;
		if (!times || times.length < 1) { return -1; }

		// by default, calculate average for the past ~1 second:
		ticks = Math.min(times.length, ticks||(this.framerate|0));
		let ttl = times.reduce((a, b) => a + b, 0);
		return ttl/ticks;
	}

	/**
	 * Returns the actual frames / ticks per second.
	 * @method getMeasuredFPS
	 * @param {Number} [ticks] The number of previous ticks over which to measure the actual frames / ticks per second.
	 * Defaults to the number of ticks per second.
	 * @return {Number} The actual frames / ticks per second. Depending on performance, this may differ
	 * from the target frames per second.
	 */
	getMeasuredFPS (ticks) {
		let times = this._times;
		if (!times || times.length < 2) { return -1; }

		// by default, calculate fps for the past ~1 second:
		ticks = Math.min(times.length-1, ticks||(this.framerate|0));
		return 1000/((times[0]-times[ticks])/ticks);
	}

	/**
	 * Returns the number of milliseconds that have elapsed since Ticker was initialized via {{#crossLink "Ticker/init"}}.
	 * Returns -1 if Ticker has not been initialized. For example, you could use
	 * this in a time synchronized animation to determine the exact amount of time that has elapsed.
	 * @method getTime
	 * @param {Boolean} [runTime=false] If true only time elapsed while Ticker was not paused will be returned.
	 * If false, the value returned will be total time elapsed since the first tick event listener was added.
	 * @return {Number} Number of milliseconds that have elapsed since Ticker was initialized or -1.
	 */
	getTime (runTime = false) {
		return this._startTime ? this._getTime() - (runTime ? this._pausedTime : 0) : -1;
	}

	/**
	 * Similar to the {{#crossLink "Ticker/getTime"}}{{/crossLink}} method, but returns the time on the most recent {{#crossLink "Ticker/tick:event"}}{{/crossLink}}
	 * event object.
	 * @method getEventTime
	 * @param runTime {Boolean} [runTime=false] If true, the runTime property will be returned instead of time.
	 * @returns {number} The time or runTime property from the most recent tick event or -1.
	 */
	getEventTime (runTime = false) {
		return this._startTime ? (this._lastTime || this._startTime) - (runTime ? this._pausedTime : 0) : -1;
	}

	/**
	 * Returns the number of ticks that have been broadcast by Ticker.
	 * @method getTicks
	 * @param {Boolean} [pauseable=false] Indicates whether to include ticks that would have been broadcast
	 * while Ticker was paused. If true only tick events broadcast while Ticker is not paused will be returned.
	 * If false, tick events that would have been broadcast while Ticker was paused will be included in the return
	 * value.
	 * @return {Number} of ticks that have been broadcast.
	 */
	getTicks (pauseable = false) {
		return this._ticks - (pauseable ? this._pausedTicks : 0);
	}


// private methods:
	/**
	 * @method _handleSynch
	 * @protected
	 */
	_handleSynch () {
		this._timerId = null;
		this._setupTick();

		// run if enough time has elapsed, with a little bit of flexibility to be early:
		if (this._getTime() - this._lastTime >= (this._interval-1)*0.97) {
			this._tick();
		}
	}

	/**
	 * @method _handleRAF
	 * @protected
	 */
	_handleRAF () {
		this._timerId = null;
		this._setupTick();
		this._tick();
	}

	/**
	 * @method _handleTimeout
	 * @protected
	 */
	_handleTimeout () {
		this._timerId = null;
		this._setupTick();
		this._tick();
	}

	/**
	 * @method _setupTick
	 * @protected
	 */
	_setupTick () {
		if (this._timerId != null) { return; } // avoid duplicates

		let mode = this.timingMode || (this._raf && TickerAPI$1.RAF); // TODO-ES6: Verify that this is desired, since Ticker.useRAF was removed.
		if (mode == TickerAPI$1.RAF_SYNCHED || mode == TickerAPI$1.RAF) {
			let f = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame;
			if (f) {
				this._timerId = f(mode == TickerAPI$1.RAF ? this._handleRAF.bind(this) : this._handleSynch.bind(this));
				this._raf = true;
				return;
			}
		}
		this._raf = false;
		this._timerId = setTimeout(this._handleTimeout.bind(this), this._interval);
	}

	/**
	 * @method _tick
	 * @protected
	 */
	_tick () {
		let paused = this.paused;
		let time = this._getTime();
		let elapsedTime = time-this._lastTime;
		this._lastTime = time;
		this._ticks++;

		if (paused) {
			this._pausedTicks++;
			this._pausedTime += elapsedTime;
		}

		if (this.hasEventListener("tick")) {
			let event = new Event$1("tick");
			let maxDelta = this.maxDelta;
			event.delta = (maxDelta && elapsedTime > maxDelta) ? maxDelta : elapsedTime;
			event.paused = paused;
			event.time = time;
			event.runTime = time-this._pausedTime;
			this.dispatchEvent(event);
		}

		this._tickTimes.unshift(this._getTime()-time);
		while (this._tickTimes.length > 100) { this._tickTimes.pop(); }

		this._times.unshift(time);
		while (this._times.length > 100) { this._times.pop(); }
	}

	/**
	 * @method _getTime
	 * @protected
	 */
	_getTime () {
		let now = window.performance.now;
		return ((now&&now.call(performance))||(new Date().getTime())) - this._startTime;
	}

}

// constants:
/**
 * In this mode, Ticker uses the requestAnimationFrame API, but attempts to synch the ticks to target framerate. It
 * uses a simple heuristic that compares the time of the RAF return to the target time for the current frame and
 * dispatches the tick when the time is within a certain threshold.
 *
 * This mode has a higher variance for time between frames than {{#crossLink "Ticker/TIMEOUT:property"}}{{/crossLink}},
 * but does not require that content be time based as with {{#crossLink "Ticker/RAF:property"}}{{/crossLink}} while
 * gaining the benefits of that API (screen synch, background throttling).
 *
 * Variance is usually lowest for framerates that are a divisor of the RAF frequency. This is usually 60, so
 * framerates of 10, 12, 15, 20, and 30 work well.
 *
 * Falls back to {{#crossLink "Ticker/TIMEOUT:property"}}{{/crossLink}} if the requestAnimationFrame API is not
 * supported.
 * @property RAF_SYNCHED
 * @static
 * @type {String}
 * @default "synched"
 * @readonly
 */
TickerAPI$1.RAF_SYNCHED = "synched";

/**
 * In this mode, Ticker passes through the requestAnimationFrame heartbeat, ignoring the target framerate completely.
 * Because requestAnimationFrame frequency is not deterministic, any content using this mode should be time based.
 * You can leverage {{#crossLink "Ticker/getTime"}}{{/crossLink}} and the {{#crossLink "Ticker/tick:event"}}{{/crossLink}}
 * event object's "delta" properties to make this easier.
 *
 * Falls back on {{#crossLink "Ticker/TIMEOUT:property"}}{{/crossLink}} if the requestAnimationFrame API is not
 * supported.
 * @property RAF
 * @static
 * @type {String}
 * @default "raf"
 * @readonly
 */
TickerAPI$1.RAF = "raf";

/**
 * In this mode, Ticker uses the setTimeout API. This provides predictable, adaptive frame timing, but does not
 * provide the benefits of requestAnimationFrame (screen synch, background throttling).
 * @property TIMEOUT
 * @static
 * @type {String}
 * @default "timeout"
 * @readonly
 */
TickerAPI$1.TIMEOUT = "timeout";

// events:
/**
 * Dispatched each tick. The event will be dispatched to each listener even when the Ticker has been paused using
 * {{#crossLink "Ticker/setPaused"}}{{/crossLink}}.
 *
 * <h4>Example</h4>
 *
 *      createjs.Ticker.addEventListener("tick", handleTick);
 *      function handleTick(event) {
 *          console.log("Paused:", event.paused, event.delta);
 *      }
 *
 * @event tick
 * @param {Object} target The object that dispatched the event.
 * @param {String} type The event type.
 * @param {Boolean} paused Indicates whether the ticker is currently paused.
 * @param {Number} delta The time elapsed in ms since the last tick.
 * @param {Number} time The total time in ms since Ticker was initialized.
 * @param {Number} runTime The total time in ms that Ticker was not paused since it was initialized. For example,
 * 	you could determine the amount of time that the Ticker has been paused since initialization with `time-runTime`.
 * @since 0.6.0
 */

/**
 * The Ticker object is a singleton instance of the TickerAPI class.
 * See the {{#crossLink "TickerAPI"}}{{/crossLink}} documentation for its usage.
 * @class Ticker
 * @static
 * @module CreateJS
 */
const Ticker$2 = new TickerAPI$1("createjs.global");

/*
* Tween
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

/**
 * Tweens properties for a single target. Methods can be chained to create complex animation sequences:
 *
 * <h4>Example</h4>
 *
 *	createjs.Tween.get(target)
 *		.wait(500)
 *		.to({alpha:0, visible:false}, 1000)
 *		.call(handleComplete);
 *
 * Multiple tweens can share a target, however if they affect the same properties there could be unexpected
 * behaviour. To stop all tweens on an object, use {{#crossLink "Tween/removeTweens"}}{{/crossLink}} or pass `override:true`
 * in the props argument.
 *
 * 	createjs.Tween.get(target, {override:true}).to({x:100});
 *
 * Subscribe to the {{#crossLink "Tween/change:event"}}{{/crossLink}} event to be notified when the tween position changes.
 *
 * 	createjs.Tween.get(target, {override:true}).to({x:100}).addEventListener("change", handleChange);
 * 	function handleChange(event) {
 * 		// The tween changed.
 * 	}
 *
 * See the {{#crossLink "Tween/get"}}{{/crossLink}} method also.
 * @class Tween
 * @extends AbstractTween
 * @module TweenJS
 */
class Tween extends AbstractTween {

// constructor:
	/**
	 * @constructor
	 * @param {Object} target The target object that will have its properties tweened.
	 * @param {Object} [props] The configuration properties to apply to this instance (ex. `{loop:-1, paused:true}`).
	 * Supported props are listed below. These props are set on the corresponding instance properties except where
	 * specified.<UL>
	 *    <LI> `useTicks`</LI>
	 *    <LI> `ignoreGlobalPause`</LI>
	 *    <LI> `loop`</LI>
	 *    <LI> `reversed`</LI>
	 *    <LI> `bounce`</LI>
	 *    <LI> `timeScale`</LI>
	 *    <LI> `pluginData`</LI>
	 *    <LI> `paused`: indicates whether to start the tween paused.</LI>
	 *    <LI> `position`: indicates the initial position for this tween.</LI>
	 *    <LI> `onChange`: adds the specified function as a listener to the `change` event</LI>
	 *    <LI> `onComplete`: adds the specified function as a listener to the `complete` event</LI>
	 *    <LI> `override`: if true, removes all existing tweens for the target</LI>
	 * </UL>
	 */
	constructor (target, props) {
		super(props);

	// public properties:
		/**
		 * Allows you to specify data that will be used by installed plugins. Each plugin uses this differently, but in general
		 * you specify data by assigning it to a property of `pluginData` with the same name as the plugin.
		 * Note that in many cases, this data is used as soon as the plugin initializes itself for the tween.
		 * As such, this data should be set before the first `to` call in most cases.
		 * @example
		 *	myTween.pluginData.SmartRotation = data;
		 *
		 * Most plugins also support a property to disable them for a specific tween. This is typically the plugin name followed by "_disabled".
		 * @example
		 *	myTween.pluginData.SmartRotation_disabled = true;
		 *
		 * Some plugins also store working data in this object, usually in a property named `_PluginClassName`.
		 * See the documentation for individual plugins for more details.
		 * @property pluginData
		 * @type {Object}
		 */
		this.pluginData = null;

		/**
		 * The target of this tween. This is the object on which the tweened properties will be changed.
		 * @property target
		 * @type {Object}
		 * @readonly
		 */
		this.target = target;

		/**
		 * Indicates the tween's current position is within a passive wait.
		 * @property passive
		 * @type {Boolean}
		 * @default false
		 * @readonly
		 */
		this.passive = false;

	// private properties:
		/**
		 * @property _stepHead
		 * @type {TweenStep}
		 * @protected
		 */
		this._stepHead = new TweenStep(null, 0, 0, {}, null, true);

		/**
		 * @property _stepTail
		 * @type {TweenStep}
		 * @protected
		 */
		this._stepTail = this._stepHead;

		/**
		 * The position within the current step. Used by MovieClip.
		 * @property _stepPosition
		 * @type {Number}
		 * @default 0
		 * @protected
		 */
		this._stepPosition = 0;

		/**
		 * @property _actionHead
		 * @type {TweenAction}
		 * @protected
		 */
		this._actionHead = null;

		/**
		 * @property _actionTail
		 * @type {TweenAction}
		 * @protected
		 */
		this._actionTail = null;

		/**
		 * Plugins added to this tween instance.
		 * @property _plugins
		 * @type Array[Object]
		 * @default null
		 * @protected
		 */
		this._plugins = null;

		/**
		 * Used by plugins to inject new properties.
		 * @property _injected
		 * @type {Object}
		 * @default null
		 * @protected
		 */
		this._injected = null;

		if (props) {
			this.pluginData = props.pluginData;
			if (props.override) { Tween.removeTweens(target); }
		}
		if (!this.pluginData) { this.pluginData = {}; }

		this._init(props);
	}

// static methods:
	/**
	 * Returns a new tween instance. This is functionally identical to using `new Tween(...)`, but may look cleaner
	 * with the chained syntax of TweenJS.
	 * <h4>Example</h4>
	 *
	 *	var tween = createjs.Tween.get(target).to({x:100}, 500);
	 *	// equivalent to:
	 *	var tween = new createjs.Tween(target).to({x:100}, 500);
	 *
	 * @method get
	 * @param {Object} target The target object that will have its properties tweened.
	 * @param {Object} [props] The configuration properties to apply to this instance (ex. `{loop:-1, paused:true}`).
	 * Supported props are listed below. These props are set on the corresponding instance properties except where
	 * specified.<UL>
	 *    <LI> `useTicks`</LI>
	 *    <LI> `ignoreGlobalPause`</LI>
	 *    <LI> `loop`</LI>
	 *    <LI> `reversed`</LI>
	 *    <LI> `bounce`</LI>
	 *    <LI> `timeScale`</LI>
	 *    <LI> `pluginData`</LI>
	 *    <LI> `paused`: indicates whether to start the tween paused.</LI>
	 *    <LI> `position`: indicates the initial position for this tween.</LI>
	 *    <LI> `onChange`: adds the specified function as a listener to the `change` event</LI>
	 *    <LI> `onComplete`: adds the specified function as a listener to the `complete` event</LI>
	 *    <LI> `override`: if true, removes all existing tweens for the target</LI>
	 * </UL>
	 * @return {Tween} A reference to the created tween.
	 * @static
	 */
	static get (target, props) {
		return new Tween(target, props);
	}

	/**
	 * Advances all tweens. This typically uses the {{#crossLink "Ticker"}}{{/crossLink}} class, but you can call it
	 * manually if you prefer to use your own "heartbeat" implementation.
	 * @method tick
	 * @param {Number} delta The change in time in milliseconds since the last tick. Required unless all tweens have
	 * `useTicks` set to true.
	 * @param {Boolean} paused Indicates whether a global pause is in effect. Tweens with {{#crossLink "Tween/ignoreGlobalPause:property"}}{{/crossLink}}
	 * will ignore this, but all others will pause if this is `true`.
	 * @static
	 */
	static tick (delta, paused) {
		let tween = Tween._tweenHead;
		while (tween) {
			let next = tween._next; // in case it completes and wipes its _next property
			if ((paused && !tween.ignoreGlobalPause) || tween._paused) { /* paused */ }
			else { tween.advance(tween.useTicks ? 1: delta); }
			tween = next;
		}
	}

	/**
	 * Handle events that result from Tween being used as an event handler. This is included to allow Tween to handle
	 * {{#crossLink "Ticker/tick:event"}}{{/crossLink}} events from the createjs {{#crossLink "Ticker"}}{{/crossLink}}.
	 * No other events are handled in Tween.
	 * @method handleEvent
	 * @param {Object} event An event object passed in by the {{#crossLink "EventDispatcher"}}{{/crossLink}}. Will
	 * usually be of type "tick".
	 * @private
	 * @static
	 * @since 0.4.2
	 */
	static handleEvent (event) {
		if (event.type === "tick") {
			this.tick(event.delta, event.paused);
		}
	}

	/**
	 * Removes all existing tweens for a target. This is called automatically by new tweens if the `override`
	 * property is `true`.
	 * @method removeTweens
	 * @param {Object} target The target object to remove existing tweens from.
	 * @static
	 */
	static removeTweens (target) {
		if (!target.tweenjs_count) { return; }
		let tween = Tween._tweenHead;
		while (tween) {
			let next = tween._next;
			if (tween.target === target) { Tween._register(tween, true); }
			tween = next;
		}
		target.tweenjs_count = 0;
	}

	/**
	 * Stop and remove all existing tweens.
	 * @method removeAllTweens
	 * @static
	 * @since 0.4.1
	 */
	static removeAllTweens () {
		let tween = Tween._tweenHead;
		while (tween) {
			let next = tween._next;
			tween._paused = true;
			tween.target && (tween.target.tweenjs_count = 0);
			tween._next = tween._prev = null;
			tween = next;
		}
		Tween._tweenHead = Tween._tweenTail = null;
	}

	/**
	 * Indicates whether there are any active tweens on the target object (if specified) or in general.
	 * @method hasActiveTweens
	 * @param {Object} [target] The target to check for active tweens. If not specified, the return value will indicate
	 * if there are any active tweens on any target.
	 * @return {Boolean} Indicates if there are active tweens.
	 * @static
	 */
	static hasActiveTweens (target) {
		if (target) { return !!target.tweenjs_count; }
		return !!Tween._tweenHead;
	}

	/**
	 * Installs a plugin, which can modify how certain properties are handled when tweened. See the {{#crossLink "SamplePlugin"}}{{/crossLink}}
	 * for an example of how to write TweenJS plugins. Plugins should generally be installed via their own `install` method, in order to provide
	 * the plugin with an opportunity to configure itself.
	 * @method _installPlugin
	 * @param {Object} plugin The plugin to install
	 * @static
	 * @protected
	 */
	static _installPlugin (plugin) {
		let priority = plugin.priority, arr = Tween._plugins;
		if (priority == null) { plugin.priority = priority = 0; }
		if (!arr) { arr = Tween._plugins = []; }
		for (let i = 0, l = arr.length; i < l; i++) {
			if (priority < arr[i].priority) { break; }
		}
		arr.splice(i, 0, plugin);
	}

	/**
	 * Registers or unregisters a tween with the ticking system.
	 * @method _register
	 * @param {Tween} tween The tween instance to register or unregister.
	 * @param {Boolean} paused If `false`, the tween is registered. If `true` the tween is unregistered.
	 * @static
	 * @protected
	 */
	static _register (tween, paused) {
		let target = tween.target;
		if (!paused && tween._paused) {
			// TODO: this approach might fail if a dev is using sealed objects in ES5
			if (target) { target.tweenjs_count = target.tweenjs_count ? target.tweenjs_count + 1 : 1; }
			let tail = Tween._tweenTail;
			if (!tail) { Tween._tweenHead = Tween._tweenTail = tween; }
			else {
				Tween._tweenTail = tail._next = tween;
				tween._prev = tail;
			}
			if (!Tween._inited) { Ticker$2.addEventListener("tick", Tween); Tween._inited = true; }
		} else if (paused && !tween._paused) {
			if (target) { target.tweenjs_count--; }
			let next = tween._next, prev = tween._prev;

			if (next) { next._prev = prev; }
			else { Tween._tweenTail = prev; } // was tail
			if (prev) { prev._next = next; }
			else { Tween._tweenHead = next; } // was head.

			tween._next = tween._prev = null;
		}
		tween._paused = paused;
	}

// public methods:
	/**
	 * Adds a wait (essentially an empty tween).
	 * <h4>Example</h4>
	 *
	 *	//This tween will wait 1s before alpha is faded to 0.
	 *	createjs.Tween.get(target).wait(1000).to({alpha:0}, 1000);
	 *
	 * @method wait
	 * @param {Number} duration The duration of the wait in milliseconds (or in ticks if `useTicks` is true).
	 * @param {Boolean} [passive=false] Tween properties will not be updated during a passive wait. This
	 * is mostly useful for use with {{#crossLink "Timeline"}}{{/crossLink}} instances that contain multiple tweens
	 * affecting the same target at different times.
	 * @return {Tween} This tween instance (for chaining calls).
	 * @chainable
	 */
	wait (duration, passive = false) {
		if (duration > 0) { this._addStep(duration, this._stepTail.props, null, passive); }
		return this;
	}

	/**
	 * Adds a tween from the current values to the specified properties. Set duration to 0 to jump to these value.
	 * Numeric properties will be tweened from their current value in the tween to the target value. Non-numeric
	 * properties will be set at the end of the specified duration.
	 * <h4>Example</h4>
	 *
	 *	createjs.Tween.get(target).to({alpha:0, visible:false}, 1000);
	 *
	 * @method to
	 * @param {Object} props An object specifying property target values for this tween (Ex. `{x:300}` would tween the x
	 * property of the target to 300).
	 * @param {Number} [duration=0] The duration of the tween in milliseconds (or in ticks if `useTicks` is true).
	 * @param {Function} [ease=Ease.linear] The easing function to use for this tween. See the {{#crossLink "Ease"}}{{/crossLink}}
	 * class for a list of built-in ease functions.
	 * @return {Tween} This tween instance (for chaining calls).
	 * @chainable
	 */
	to (props, duration = 0, ease = Ease.linear) {
		if (duration < 0) { duration = 0; }
		let step = this._addStep(duration, null, ease);
		this._appendProps(props, step);
		return this;
	}

	/**
	 * Adds a label that can be used with {{#crossLink "Tween/gotoAndPlay"}}{{/crossLink}}/{{#crossLink "Tween/gotoAndStop"}}{{/crossLink}}
	 * at the current point in the tween. For example:
	 *
	 * 	var tween = createjs.Tween.get(foo)
	 * 					.to({x:100}, 1000)
	 * 					.label("myLabel")
	 * 					.to({x:200}, 1000);
	 * // ...
	 * tween.gotoAndPlay("myLabel"); // would play from 1000ms in.
	 *
	 * @method addLabel
	 * @param {String} label The label name.
	 * @param {Number} position The position this label represents.
	 * @return {Tween} This tween instance (for chaining calls).
	 * @chainable
	 */
	label (name) {
		this.addLabel(name, this.duration);
		return this;
	}

	/**
	 * Adds an action to call the specified function.
	 * <h4>Example</h4>
	 *
	 * 	//would call myFunction() after 1 second.
	 * 	createjs.Tween.get().wait(1000).call(myFunction);
	 *
	 * @method call
	 * @param {Function} callback The function to call.
	 * @param {Array} [params]. The parameters to call the function with. If this is omitted, then the function
	 * will be called with a single param pointing to this tween.
	 * @param {Object} [scope]. The scope to call the function in. If omitted, it will be called in the target's scope.
	 * @return {Tween} This tween instance (for chaining calls).
	 * @chainable
	 */
	call (callback, params, scope) {
		return this._addAction(scope || this.target, callback, params || [ this ]);
	}

	/**
	 * Adds an action to set the specified props on the specified target. If `target` is null, it will use this tween's
	 * target. Note that for properties on the target object, you should consider using a zero duration {{#crossLink "Tween/to"}}{{/crossLink}}
	 * operation instead so the values are registered as tweened props.
	 * <h4>Example</h4>
	 *
	 *	myTween.wait(1000).set({visible:false}, foo);
	 *
	 * @method set
	 * @param {Object} props The properties to set (ex. `{visible:false}`).
	 * @param {Object} [target] The target to set the properties on. If omitted, they will be set on the tween's target.
	 * @return {Tween} This tween instance (for chaining calls).
	 * @chainable
	 */
	set (props, target) {
		return this._addAction(target || this.target, this._set, [ props ]);
	}

	/**
	 * Adds an action to play (unpause) the specified tween. This enables you to sequence multiple tweens.
	 * <h4>Example</h4>
	 *
	 *	myTween.to({x:100}, 500).play(otherTween);
	 *
	 * @method play
	 * @param {Tween} tween The tween to play.
	 * @return {Tween} This tween instance (for chaining calls).
	 * @chainable
	 */
	play (tween) {
		return this.call(this.setPaused, [ false ], tween || this);
	}

	/**
	 * Adds an action to pause the specified tween.
	 *
	 * 	myTween.pause(otherTween).to({alpha:1}, 1000).play(otherTween);
	 *
	 * @method pause
	 * @param {Tween} tween The tween to pause. If null, it pauses this tween.
	 * @return {Tween} This tween instance (for chaining calls)
	 * @chainable
	 */
	pause (tween) {
		return this.call(this.setPaused, [ true ], tween || this);
	}

	/**
	 * @method clone
	 * @protected
	 */
	clone () {
		throw("Tween can not be cloned.")
	}

// private methods:
	/**
	 * Adds a plugin to this tween.
	 * @method _addPlugin
	 * @param {Object} plugin
	 * @protected
	 */
	_addPlugin (plugin) {
		let plugins = this._plugins, priority = plugin.priority, added = false;
		if (!plugins) { plugins = this._plugins = []; }
		for (let i = 0, l = plugins.length; i < l; i++) {
			if (plugins[i] === plugin) {
				if (!added) { return; }
				else { plugins.splice(i, 1); }
			} else if (!added && priority < plugins[i].priority) {
				plugins.splice(i, 0, plugin);
				added = true;
			}
		}
		if (!added) { plugins.push(plugin); }
	};

	/**
   * @method _updatePosition
   * @override
   */
	_updatePosition (jump, end) {
		let step = this._stepHead.next, t = this.position, d = this.duration;
		if (this.target && step) {
			// find our new step index:
			let stepNext = step.next;
			while (stepNext && stepNext.t <= t) { step = step.next; stepNext = step.next; }
			let ratio = end ? t / d : (t - step.t) / step.d; // TODO: revisit this.
			this._updateTargetProps(step, ratio, end);
		}
		this._stepPosition = step ? t - step.t : 0;
	}

	/**
	 * @method _updateTargetProps
	 * @param {Object} step
	 * @param {Number} ratio
	 * @param {Boolean} end Indicates to plugins that the full tween has ended.
	 * @protected
	 */
	_updateTargetProps (step, ratio, end) {
		if (this.passive = !!step.passive) { return; } // don't update props.

		let v, v0, v1, ease;
		let p0 = step.prev.props;
		let p1 = step.props;
		if (ease = step.ease) { ratio = ease(ratio, 0, 1, 1); }

		let plugins = this._plugins;
		for (let n in p0) {
			v = v0 = p0[n];
			v1 = p1[n];

			// values are different & it is numeric then interpolate:
			if (v0 !== v1 && (typeof(v0) === "number")) {
				v = v0 + (v1 - v0) * ratio;
			}

			if (plugins) {
				for (let i = 0, l = plugins.length; i < l; i++) {
					let value = plugins[i].tween(this, step, n, v, ratio, end);
					if (v === Tween.IGNORE) { return; }
					if (value !== undefined) { v = value; }
				}
			}
			this.target[n] = v;
		}

	}

	/**
	 * @method _runActionsRange
	 * @param {Number} startPos
	 * @param {Number} endPos
	 * @param {Boolean} includeStart
	 * @protected
	 * @override
	 */
	_runActionsRange (startPos, endPos, jump, includeStart) {
		//console.log("	range", startPos, endPos, jump, includeStart);
		let rev = startPos > endPos;
		let action = rev ? this._actionTail : this._actionHead;
		let ePos = endPos, sPos = startPos;
		if (rev) { ePos = startPos; sPos = endPos; }
		let t = this.position;
		while (action) {
			let pos = action.t;
			if (pos === endPos || (pos > sPos && pos < ePos) || (includeStart && pos === startPos)) {
				//console.log(pos, "start", sPos, startPos, "end", ePos, endPos);
				action.funct.apply(action.scope, action.params);
				if (t !== this.position) { return true; }
			}
			action = rev ? action.prev : action.next;
		}
	}

	/**
	 * @method _appendProps
	 * @param {Object} props
	 * @protected
	 */
	_appendProps (props, step) {
		let initProps = this._stepHead.props, target = this.target, plugins = Tween._plugins;
		let inject, ignored;

		let oldStep = step.prev, oldProps = oldStep.props;
		let stepProps = step.props = this._cloneProps(oldProps);

		for (let n in props) {
			stepProps[n] = props[n];

			if (initProps[n] !== undefined) { continue; }

			let oldValue = undefined; // accessing missing properties on DOMElements when using CSSPlugin is INSANELY expensive.
			if (plugins) {
				for (let i = 0, l = plugins.length; i < l; i++) {
					let value = plugins[i].init(this, n, oldValue);
					if (value !== undefined) { oldValue = value; }
					if (oldValue === Tween.IGNORE) {
						(ignored = ignored || {})[n] = true;
						delete(stepProps[n]);
						break;
					}
				}
			}

			if (oldValue !== Tween.IGNORE) {
				if (oldValue === undefined) { oldValue = target[n]; }
				oldProps[n] = (oldValue === undefined) ? null : oldValue;
			}
		}

		plugins = this._plugins;
		for (let n in props) {
			if (ignored && ignored[n]) { continue; }
			let value = props[n];

			// propagate old value to previous steps:
			let o, prev = oldStep;
			while ((o = prev) && (prev = o.prev)) {
				if (prev.props === o.props) { continue; } // wait step
				if (prev.props[n] !== undefined) { break; } // already has a value, we're done.
				prev.props[n] = oldProps[n];
			}

			if (plugins) {
				for (let i = 0, l = plugins.length; i < l; i++) {
					let value = plugins[i].step(this, step, n, value);
					if (value !== undefined) { step.props[n] = value; }
				}
			}
		}

		if (inject = this._injected) {
			this._injected = null;
			this._appendProps(inject, step);
		}
	}

	/**
	 * Used by plugins to inject properties. Called from within `Plugin.step` calls.
	 * @method _injectProps
	 * @param {Object} props
	 * @protected
	 */
	_injectProps (props) {
		let o = this._injected;
		if (!this._injected) { o = this._injected = {}; }
		for (let n in props) { o[n] = props[n]; }
	}

	/**
	 * @method _addStep
	 * @param {Number} duration
	 * @param {Object} props
	 * @param {Function} ease
	 * @param {Boolean} [passive=false]
	 * @protected
	 */
	_addStep (duration, props, ease, passive = false) {
		let step = new TweenStep(this._stepTail, this.duration, duration, props, ease, passive);
		this.duration += duration;
		return this._stepTail = (this._stepTail.next = step);
	}

	/**
	 * @method _addAction
	 * @param {Object} scope
	 * @param {Function} funct
	 * @param {Array} params
	 * @protected
	 */
	_addAction (scope, funct, params) {
		let action = new TweenAction(this._actionTail, this.duration, scope, funct, params);
		if (this._actionTail) { this._actionTail.next = action; }
		else { this._actionHead = action; }
		this._actionTail = action;
		return this;
	}

	/**
	 * @method _set
	 * @param {Object} props
	 * @protected
	 */
	_set (props) {
		for (let n in props) {
			this[n] = props[n];
		}
	}

	/**
	 * @method _cloneProps
	 * @param {Object} props
	 * @protected
	 */
	_cloneProps (props) {
		let o = {};
		for (let n in props) { o[n] = props[n]; }
		return o;
	}

}

// tiny api (primarily for tool output):
{
	let p = Tween.prototype;
	p.w = p.wait;
	p.t = p.to;
	p.c = p.call;
	p.s = p.set;
}

// static properties
/**
 * Constant returned by plugins to tell the tween not to use default assignment.
 * @property IGNORE
 * @type Object
 * @static
 */
Tween.IGNORE = {};

/**
 * @property _listeners
 * @type Array[Tween]
 * @static
 * @protected
 */
Tween._tweens = [];

/**
 * @property _plugins
 * @type Object
 * @static
 * @protected
 */
Tween._plugins = null;

/**
 * @property _tweenHead
 * @type Tween
 * @static
 * @protected
 */
Tween._tweenHead = null;

/**
 * @property _tweenTail
 * @type Tween
 * @static
 * @protected
 */
Tween._tweenTail = null;

// helpers:

class TweenStep {

	constructor (prev, t, d, props, ease, passive) {
		this.next = null;
		this.prev = prev;
		this.t = t;
		this.d = d;
		this.props = props;
		this.ease = ease;
		this.passive = passive;
		this.index = prev ? prev.index + 1 : 0;
	}

}

class TweenAction {

	constructor (prev, t, scope, funct, params) {
		this.next = null;
		this.d = 0;
		this.prev = prev;
		this.t = t;
		this.scope = scope;
		this.funct = funct;
		this.params = params;
	}

}

/*
* Timeline
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

/**
 * The Timeline class synchronizes multiple tweens and allows them to be controlled as a group. Please note that if a
 * timeline is looping, the tweens on it may appear to loop even if the "loop" property of the tween is false.
 *
 * NOTE: Timeline currently also accepts a param list in the form: `tweens, labels, props`. This is for backwards
 * compatibility only and will be removed in the future. Include tweens and labels as properties on the props object.
 * @class Timeline
 * @param {Object} [props] The configuration properties to apply to this instance (ex. `{loop:-1, paused:true}`).
 * Supported props are listed below. These props are set on the corresponding instance properties except where
 * specified.<UL>
 *    <LI> `useTicks`</LI>
 *    <LI> `ignoreGlobalPause`</LI>
 *    <LI> `loop`</LI>
 *    <LI> `reversed`</LI>
 *    <LI> `bounce`</LI>
 *    <LI> `timeScale`</LI>
 *    <LI> `paused`: indicates whether to start the tween paused.</LI>
 *    <LI> `position`: indicates the initial position for this tween.</LI>
 *    <LI> `onChange`: adds the specified function as a listener to the `change` event</LI>
 *    <LI> `onComplete`: adds the specified function as a listener to the `complete` event</LI>
 * </UL>
 * @extends AbstractTween
 * @module TweenJS
 */
class Timeline extends AbstractTween {

// constructor
	/**
	 * @constructor
	 * @param {Object} props
	 */
	constructor (props) {
		super(props);

	// private properties:
		/**
		 * @property _tweens
		 * @type Array[Tween]
		 * @protected
		 */
		this._tweens = [];

		if (props.tweens) { this.addTween(...tweens); }
		this.labels = props.labels;

		this._init(props);
	}


// public methods:
	/**
	 * Adds one or more tweens (or timelines) to this timeline. The tweens will be paused (to remove them from the
	 * normal ticking system) and managed by this timeline. Adding a tween to multiple timelines will result in
	 * unexpected behaviour.
	 * @method addTween
	 * @param {Tween} ...tween The tween(s) to add. Accepts multiple arguments.
	 * @return {Tween} The first tween that was passed in.
	 */
	addTween (...args) {
		let l = args.length;
		if (l === 1) {
			let tween = args[0];
			this._tweens.push(tween);
			tween._parent = this;
			tween.setPaused(true);
			let d = tween.duration;
			if (tween.loop > 0) { d *= tween.loop + 1; }
			if (d > this.duration) { this.duration = d; }
			if (this.rawPosition >= 0) { tween.setPosition(this.rawPosition); }
			return tween;
		}
		if (l > 1) {
			for (let i = 0; i < l; i++) { this.addTween(args[i]); }
			return args[l - 1];
		}
		return null;
	}

	/**
	 * Removes one or more tweens from this timeline.
	 * @method removeTween
	 * @param {Tween} ...args The tween(s) to remove. Accepts multiple arguments.
	 * @return Boolean Returns `true` if all of the tweens were successfully removed.
	 */
	removeTween (...args) {
		let l = args.length;
		if (l === 1) {
			let tweens = this._tweens;
			let i = tweens.length;
			while (i--) {
				if (tweens[i] === tween) {
					tweens.splice(i, 1);
					tween._parent = null;
					if (tween.duration >= this.duration) { this.updateDuration(); }
					return true;
				}
			}
			return false;
		}
		if (l > 1) {
			let good = true;
			for (let i = 0; i < l; i++) { good = good && this.removeTween(args[i]); }
			return good;
		}
		return true;
	}

	/**
	 * Recalculates the duration of the timeline. The duration is automatically updated when tweens are added or removed,
	 * but this method is useful if you modify a tween after it was added to the timeline.
	 * @method updateDuration
	 */
	updateDuration () {
		this.duration = 0;
		for (let i = 0, l = this._tweens.length; i < l; i++) {
			let tween = this._tweens[i];
			let d = tween.duration;
			if (tween.loop > 0) { d *= tween.loop + 1; }
			if (d > this.duration) { this.duration = d; }
		}
	}

	/**
	 * @method clone
	 * @protected
	 */
	clone () {
		throw("Timeline can not be cloned.")
	}

// private methods:
	/**
	 * @method _updatePosition
	 * @override
	 */
	_updatePosition (jump, end) {
		let t = this.position;
		for (let i = 0, l = this._tweens.length; i < l; i++) {
			this._tweens[i].setPosition(t, true, jump); // actions will run after all the tweens update.
		}
	}

	/**
	 * @method _runActionsRange
	 * @override
	 */
	_runActionsRange (startPos, endPos, jump, includeStart) {
		//console.log("	range", startPos, endPos, jump, includeStart);
		let t = this.position;
		for (let i = 0, l = this._tweens.length; i < l; i++) {
			this._tweens[i]._runActions(startPos, endPos, jump, includeStart);
			if (t !== this.position) { return true; } // an action changed this timeline's position.
		}
	}

}

/*
* @license MovieClip
* Visit http://createjs.com/ for documentation, updates and examples.
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
 * @extends Container
 * @module EaselJS
 */
class MovieClip extends Container {

// constructor:
	/**
	 * @constructor
	 * @param {String} [mode=independent] Initial value for the mode property. One of {{#crossLink "MovieClip/INDEPENDENT:property"}}{{/crossLink}},
	 * {{#crossLink "MovieClip/SINGLE_FRAME:property"}}{{/crossLink}}, or {{#crossLink "MovieClip/SYNCHED:property"}}{{/crossLink}}.
	 * The default is {{#crossLink "MovieClip/INDEPENDENT:property"}}{{/crossLink}}.
	 * @param {Number} [startPosition=0] Initial value for the {{#crossLink "MovieClip/startPosition:property"}}{{/crossLink}}
	 * property.
	 * @param {Boolean} [loop=0] Initial value for the {{#crossLink "MovieClip/loop:property"}}{{/crossLink}}
	 * property. The default is `0`.
	 * @param {Object} [labels=null] A hash of labels to pass to the {{#crossLink "MovieClip/timeline:property"}}{{/crossLink}}
	 * instance associated with this MovieClip. Labels only need to be passed if they need to be used.
	 */
	constructor (mode = MovieClip.INDEPENDENT, startPosition = 0, loop = 0, labels = null) {
		super();
		!MovieClip.inited && MovieClip.init();

// public properties:
		/**
		 * Controls how this MovieClip advances its time. Must be one of 0 (INDEPENDENT), 1 (SINGLE_FRAME), or 2 (SYNCHED).
		 * See each constant for a description of the behaviour.
		 * @property mode
		 * @type String
		 * @default null
		 */
		this.mode = mode;

		/**
		 * Specifies what the first frame to play in this movieclip, or the only frame to display if mode is SINGLE_FRAME.
		 * @property startPosition
		 * @type Number
		 * @default 0
		 */
		this.startPosition = startPosition;

		/**
		 * Indicates whether this MovieClip should loop when it reaches the end of its timeline.
		 * @property loop
		 * @type Boolean
		 * @default true
		 */
		this.loop = loop === true ? -1 : loop;

		/**
		 * The current frame of the movieclip.
		 * @property currentFrame
		 * @type Number
		 * @default 0
		 * @readonly
		 */
		this.currentFrame = 0;

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
		this.timeline = new Timeline({ paused: true, useTicks: true, labels });

		/**
		 * If true, the MovieClip's position will not advance when ticked.
		 * @property paused
		 * @type Boolean
		 * @default false
		 */
		this.paused = false;

		/**
		 * If true, actions in this MovieClip's tweens will be run when the playhead advances.
		 * @property actionsEnabled
		 * @type Boolean
		 * @default true
		 */
		this.actionsEnabled = true;

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
		this.autoReset = true;

		/**
		 * An array of bounds for each frame in the MovieClip. This is mainly intended for tool output.
		 * @property frameBounds
		 * @type Array
		 * @default null
		 */
		this.frameBounds = this.frameBounds||null; // TODO: Deprecated. This is for backwards support of Flash/Animate

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
		this.framerate = null;

	// private properties:
		/**
		 * @property _synchOffset
		 * @type Number
		 * @default 0
		 * @private
		 */
		this._synchOffset = 0;

		/**
		 * @property _rawPosition
		 * @type Number
		 * @default -1
		 * @private
		 */
		this._rawPosition = -1; // TODO: evaluate using a ._reset Boolean prop instead of -1.

		/**
		 * The time remaining from the previous tick, only applicable when .framerate is set.
		 * @property _t
		 * @type Number
		 * @private
		 */
		this._t = 0;

		/**
		 * List of display objects that are actively being managed by the MovieClip.
		 * @property _managed
		 * @type Object
		 * @private
		 */
		this._managed = {};
	}

// static methods:
	static init () {
		if (MovieClip.inited) { return; }
		// plugins introduce some overhead to Tween, so we only install this if an MC is instantiated.
		MovieClipPlugin.install();
		MovieClip.inited = true;
	}

// TODO: can we just proxy `get currentFrame` to timeline.position as well? Ditto for `get loop` (or just remove entirely).
// accessor properties:
	/**
	 * Returns an array of objects with label and position (aka frame) properties, sorted by position.
	 * Shortcut to TweenJS: Timeline.getLabels();
	 * @property labels
	 * @type {Array}
	 * @readonly
	 */
	get labels () {
		return this.timeline.labels;
	}

	/**
	 * Returns the name of the label on or immediately before the current frame. See TweenJS: Timeline.getCurrentLabel()
	 * for more information.
	 * @property currentLabel
	 * @type {String}
	 * @readonly
	 */
	get currentLabel () {
		return this.timeline.getCurrentLabel();
	}

	 /**
 	 * Returns the duration of this MovieClip in seconds or ticks.
 	 * @property duration
 	 * @type {Number}
 	 * @readonly
 	 */
 	get duration () {
		return this.timeline.duration;
	}

	/**
	 * Returns the duration of this MovieClip in seconds or ticks. Identical to {{#crossLink "MovieClip/duration:property"}}{{/crossLink}}
	 * and provided for Adobe Flash/Animate API compatibility.
	 * @property totalFrames
	 * @type {Number}
	 * @readonly
	 */
	get totalFrames () {
		return this.duration;
	}

// public methods:
	/**
	 * Returns true or false indicating whether the display object would be visible if drawn to a canvas.
	 * This does not account for whether it would be visible within the boundaries of the stage.
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method isVisible
	 * @return {Boolean} Boolean indicating whether the display object would be visible if drawn to a canvas
	 */
	isVisible () {
		// children are placed in draw, so we can't determine if we have content.
		return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0);
	}

	/**
	 * Draws the display object into the specified context ignoring its visible, alpha, shadow, and transform.
	 * Returns true if the draw was handled (useful for overriding functionality).
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method draw
	 * @param {CanvasRenderingContext2D} ctx The canvas 2D context object to draw into.
	 * @param {Boolean} ignoreCache Indicates whether the draw operation should ignore any current cache.
	 * For example, used for drawing the cache (to prevent it from simply drawing an existing cache back
	 * into itself).
	 */
	draw (ctx, ignoreCache) {
		// draw to cache first:
		if (this.drawCache(ctx, ignoreCache)) { return true; }
		super.draw(ctx, ignoreCache);
		return true;
	}

	/**
	 * Sets paused to false.
	 * @method play
	 */
	play () {
		this.paused = false;
	}

	/**
	 * Sets paused to true.
	 * @method stop
	 */
	stop () {
		this.paused = true;
	}

	/**
	 * Advances this movie clip to the specified position or label and sets paused to false.
	 * @method gotoAndPlay
	 * @param {String|Number} positionOrLabel The animation name or frame number to go to.
	 */
	gotoAndPlay (positionOrLabel) {
		this.paused = false;
		this._goto(positionOrLabel);
	}

	/**
	 * Advances this movie clip to the specified position or label and sets paused to true.
	 * @method gotoAndStop
	 * @param {String|Number} positionOrLabel The animation or frame name to go to.
	 */
	gotoAndStop (positionOrLabel) {
		this.paused = true;
		this._goto(positionOrLabel);
	}

	/**
	 * Advances the playhead. This occurs automatically each tick by default.
	 * @param [time] {Number} The amount of time in ms to advance by. Only applicable if framerate is set.
	 * @method advance
	*/
	advance (time) {
		// TODO: should we worry at all about clips who change their own modes via frame scripts?
		let independent = MovieClip.INDEPENDENT;
		if (this.mode !== independent) { return; }
		// if this MC doesn't have a framerate, hunt ancestors for one:
		let o = this, fps = o.framerate;
		while ((o = o.parent) && fps == null) {
			if (o.mode === independent) { fps = o._framerate; }
		}
		this._framerate = fps;

		if (this.paused) { return; }
		// TODO: strict equality here?
		// calculate how many frames to advance:
		let t = (fps !== null && fps !== -1 && time !== null) ? time / (1000 / fps) + this._t : 1;
		let frames = t | 0;
		this._t = t - frames; // leftover time, save to add to next advance.

		while (frames--) {
			this._updateTimeline(this._rawPosition + 1, false);
		}
	}

	/**
	 * MovieClip instances cannot be cloned.
	 * @method clone
	 */
	clone () {
		// TODO: add support for this? Need to clone the Timeline & retarget tweens - pretty complex.
		throw "MovieClip cannot be cloned.";
	}

// private methods:
	/**
	 * @method _tick
	 * @param {Object} evtObj An event object that will be dispatched to all tick listeners. This object is reused between dispatchers to reduce construction & GC costs.
	 * function.
	 * @protected
	 */
	_tick (evtObj) {
		this.advance(evtObj && evtObj.delta);
		super._tick(evtObj);
	}

	/**
	 * @method _goto
	 * @param {String|Number} positionOrLabel The animation name or frame number to go to.
	 * @protected
	 */
	_goto (positionOrLabel) {
		let pos = this.timeline.resolve(positionOrLabel);
		if (pos == null) { return; }
		this._t = 0;
		this._updateTimeline(pos, true);
	}

	/**
	 * @method _reset
	 * @private
	 */
	_reset () {
		this._rawPosition = -1;
		this._t = this.currentFrame = 0;
		this.paused = false;
	}

	/**
	 * @method _updateTimeline
	 * @param {Number} rawPosition
	 * @param {Boolean} jump Indicates whether this update is due to jumping (via gotoAndXX) to a new position.
	 * @protected
	 */
	_updateTimeline (rawPosition, jump) {
		if (rawPosition < 1) { rawPosition = 0; }
		if (this._rawPosition === rawPosition) { return; }
		this._rawPosition = rawPosition;

		let tl = this.timeline, synced = this.mode !== MovieClip.INDEPENDENT;
		tl.loop = this.loop; // TODO: should we maintain this on MovieClip, or just have it on timeline.
		let pos = synced ? this.startPosition + (this.mode === MovieClip.SINGLE_FRAME ? 0 : this._synchOffset) : (rawPosition === -1 ? 0 : rawPosition);

		tl.setPosition(pos, !this.actionsEnabled || synced, jump, () => this._resolveState());
	}

	/**
	 * Runs via a callback after timeline property updates and before actions.
	 * @method _resolveState
	 * @protected
	 */
	_resolveState () {
		let tl = this.timeline;
		this.currentFrame = tl.position;

		for (let n in this._managed) { this._managed[n] = 1; }

		let tweens = tl._tweens;
		for (let tween of tl._tweens) {
			let target = tween._target;
			if (target === this || tween.passive) { continue; } // TODO: this assumes the actions tween from Animate has `this` as the target. Likely a better approach.
			let offset = tween._stepPosition;

			if (target instanceof DisplayObject) {
				// motion tween.
				this._addManagedChild(target, offset);
			} else {
				// state tween.
				this._setState(target.state, offset);
			}
		}

		let kids = this.children;
		for (let i=kids.length-1; i>=0; i--) {
			let id = kids[i].id;
			if (this._managed[id] === 1) {
				this.removeChildAt(i);
				delete(this._managed[id]);
			}
		}
	}

	/**
	 * @method _setState
	 * @param {Array} state
	 * @param {Number} offset
	 * @protected
	 */
	_setState (state, offset) {
		if (!state) { return; }
		for (let i = state.length - 1; i >= 0; i--) {
			let o = state[i];
			let target = o.t;
			let props = o.p;
			for (let n in props) { target[n] = props[n]; }
			this._addManagedChild(target, offset);
		}
	}

	/**
	 * Adds a child to the timeline, and sets it up as a managed child.
	 * @method _addManagedChild
	 * @param {MovieClip} child The child MovieClip to manage
	 * @param {Number} offset
	 * @private
	 */
	_addManagedChild (child, offset) {
		if (child._off) { return; }
		this.addChildAt(child, 0);

		if (child instanceof MovieClip) {
			child._synchOffset = offset;
			// TODO: this does not precisely match Adobe Flash/Animate, which loses track of the clip if it is renamed or removed from the timeline, which causes it to reset.
			if (child.mode === MovieClip.INDEPENDENT && child.autoReset && !this._managed[child.id]) { child._reset(); }
		}
		this._managed[child.id] = 2;
	}

	/**
	 * @method _getBounds
	 * @param {Matrix2D} matrix
	 * @param {Boolean} ignoreTransform
	 * @return {Rectangle}
	 * @protected
	 */
	_getBounds (matrix, ignoreTransform) {
		let bounds = this.getBounds();
		if (!bounds && this.frameBounds) { bounds = this._rectangle.copy(this.frameBounds[this.currentFrame]); }
		if (bounds) { return this._transformBounds(bounds, matrix, ignoreTransform); }
		return super._getBounds(matrix, ignoreTransform);
	}

}

// static constants:
/**
 * The MovieClip will advance independently of its parent, even if its parent is paused.
 * This is the default mode.
 * @property INDEPENDENT
 * @static
 * @type String
 * @default "independent"
 * @readonly
 */
/**
 * The MovieClip will only display a single frame (as determined by the startPosition property).
 * @property SINGLE_FRAME
 * @static
 * @type String
 * @default "single"
 * @readonly
 */
/**
 * The MovieClip will be advanced only when its parent advances and will be synched to the position of
 * the parent MovieClip.
 * @property SYNCHED
 * @static
 * @type String
 * @default "synched"
 * @readonly
 */
{
	MovieClip.INDEPENDENT = "independent";
	MovieClip.SINGLE_FRAME = "single";
	MovieClip.SYNCHED = "synched";
	MovieClip.inited = false;
}

/**
 * This plugin works with <a href="http://tweenjs.com" target="_blank">TweenJS</a> to prevent the startPosition
 * property from tweening.
 * @class MovieClipPlugin
 * @todo update to new plugin model
 * @static
 * @private
 */
class MovieClipPlugin {

// constructor:
	/**
	 * @constructor
	 */
	constructor () {
		throw "MovieClipPlugin cannot be instantiated.";
	}

	/**
	 * @method install
	 * @private
	 */
	static install () {
		// Tween._installPlugin(MovieClipPlugin);
	}

	/**
	 * @method init
	 * @param {Tween} tween
	 * @param {String} prop
	 * @param {String|Number|Boolean} value
	 * @private
	 */
	static init (tween, prop, value) {
		return value;
	}

	/**
	 * @method tween
	 * @param {Tween} tween
	 * @param {String} prop
	 * @param {String | Number | Boolean} value
	 * @param {Array} startValues
	 * @param {Array} endValues
	 * @param {Number} ratio
	 * @param {Object} wait
	 * @param {Object} end
	 * @return {*}
	 */
	static tween (tween, prop, value, startValues, endValues, ratio, wait, end) {
		if (!(tween.target instanceof MovieClip)) { return value; }
		return (ratio === 1 ? endValues[prop] : startValues[prop]);
	}

}

/**
 * @property priority
 * @static
 */
{
	MovieClipPlugin.priority = 100;
}

/*
* @license Shadow
* Visit http://createjs.com/ for documentation, updates and examples.
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

/**
 * This class encapsulates the properties required to define a shadow to apply to a {{#crossLink "DisplayObject"}}{{/crossLink}}
 * via its <code>shadow</code> property.
 *
 * <h4>Example</h4>
 *
 *      myImage.shadow = new createjs.Shadow("#000000", 5, 5, 10);
 *
 * @class Shadow
 * @module EaselJS
 */
class Shadow$1 {

// constructor:
	/**
	 * @constructor
	 * @param {String} color The color of the shadow. This can be any valid CSS color value.
	 * @param {Number} offsetX The x offset of the shadow in pixels.
	 * @param {Number} offsetY The y offset of the shadow in pixels.
	 * @param {Number} blur The size of the blurring effect.
	 */
	constructor (color = "black", offsetX = 0, offsetY = 0, blur = 0) {
// public properties:
		/**
		 * The color of the shadow. This can be any valid CSS color value.
		 * @property color
		 * @type String
		 * @default black
		 */
		this.color = color;

		/**
		 * The x offset of the shadow.
		 * @property offsetX
		 * @type Number
		 * @default 0
		 */
		this.offsetX = offsetX;

		/**
		 * The y offset of the shadow.
		 * @property offsetY
		 * @type Number
		 * @default 0
		 */
		this.offsetY = offsetY;

		/**
		 * The blur of the shadow.
		 * @property blur
		 * @type Number
		 * @default 0
		 */
		this.blur = blur;
	}

// public methods:
	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 */
	toString () {
		return `[${this.constructor.name}]`;
	}

	/**
	 * Returns a clone of this Shadow instance.
	 * @method clone
	 * @return {Shadow} A clone of the current Shadow instance.
	 */
	clone () {
		return new Shadow$1(this.color, this.offsetX, this.offsetY, this.blur);
	}

}

// static public properties:
/**
 * An identity shadow object (all properties are set to 0).
 * @property identity
 * @type Shadow
 * @static
 * @final
 * @readonly
 */
{
	Shadow$1.identity = new Shadow$1("transparent");
}

/*
* @license Shape
* Visit http://createjs.com/ for documentation, updates and examples.
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
 * @module EaselJS
 */
class Shape extends DisplayObject {

// constructor:
	/**
	 * @constructor
	 * @param {Graphics} [graphics=Graphics] Optional. The graphics instance to display. If null, a new Graphics instance will be created.
	 */
	constructor (graphics = new Graphics()) {
		super();

// public properties:
		/**
		 * The graphics instance to display.
		 * @property graphics
		 * @type Graphics
		 */
		this.graphics = graphics;
	}

// public methods:
	/**
	 * Returns true or false indicating whether the Shape would be visible if drawn to a canvas.
	 * This does not account for whether it would be visible within the boundaries of the stage.
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method isVisible
	 * @return {Boolean} Boolean indicating whether the Shape would be visible if drawn to a canvas
	 */
	isVisible () {
		let hasContent = this.cacheCanvas || (this.graphics && !this.graphics.isEmpty());
		return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent);
	}

	/**
	 * Draws the Shape into the specified context ignoring its visible, alpha, shadow, and transform. Returns true if
	 * the draw was handled (useful for overriding functionality).
	 *
	 * <i>NOTE: This method is mainly for internal use, though it may be useful for advanced uses.</i>
	 * @method draw
	 * @param {CanvasRenderingContext2D} ctx The canvas 2D context object to draw into.
	 * @param {Boolean} [ignoreCache=false] Indicates whether the draw operation should ignore any current cache. For example,
	 * used for drawing the cache (to prevent it from simply drawing an existing cache back into itself).
	 * @return {Boolean}
	 */
	draw (ctx, ignoreCache = false) {
		if (super.draw(ctx, ignoreCache)) { return true; }
		this.graphics.draw(ctx, this);
		return true;
	}

	/**
	 * Returns a clone of this Shape. Some properties that are specific to this instance's current context are reverted to
	 * their defaults (for example .parent).
	 * @method clone
	 * @param {Boolean} recursive If true, this Shape's {{#crossLink "Graphics"}}{{/crossLink}} instance will also be
	 * cloned. If false, the Graphics instance will be shared with the new Shape.
	 */
	clone (recursive = false) {
		let g = (recursive && this.graphics) ? this.graphics.clone() : this.graphics;
		return  this._cloneProps(new Shape(g));
	}

}

/*
 * @license SpriteSheet
 * Visit http://createjs.com/ for documentation, updates and examples.
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
 * EXPRESS OR IMPliED, INCLUDING BUT NOT liMITED TO THE WARRANTIES
 * OF MERCHANTABIliTY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HolDERS BE liABLE FOR ANY CLAIM, DAMAGES OR OTHER liABIliTY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEAliNGS IN THE SOFTWARE.
 */

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
 * @module EaselJS
 */
class SpriteSheet extends EventDispatcher {

// constructor:
	/**
	 * @constructor
   * @param {Object} data An object describing the SpriteSheet data.
	 */
	constructor (data) {
		super();

// public properties:
		/**
		 * Indicates whether all images are finished loading.
		 * @property complete
		 * @type Boolean
		 * @readonly
		 */
		this.complete = true;

		/**
		 * Specifies the framerate to use by default for Sprite instances using the SpriteSheet. See the Sprite class
		 * {{#crossLink "Sprite/framerate:property"}}{{/crossLink}} for more information.
		 * @property framerate
		 * @type Number
		 */
		this.framerate = 0;


		// private properties:
		/**
		 * @property _animations
		 * @protected
		 * @type Array
		 */
		this._animations = null;

		/**
		 * @property _frames
		 * @protected
		 * @type Array
		 */
		this._frames = null;

		/**
		 * @property _images
		 * @protected
		 * @type Array
		 */
		this._images = null;

		/**
		 * @property _data
		 * @protected
		 * @type Object
		 */
		this._data = null;

		/**
		 * @property _loadCount
		 * @protected
		 * @type Number
		 */
		this._loadCount = 0;

		// only used for simple frame defs:
		/**
		 * @property _frameHeight
		 * @protected
		 * @type Number
		 */
		this._frameHeight = 0;

		/**
		 * @property _frameWidth
		 * @protected
		 * @type Number
		 */
		this._frameWidth = 0;

		/**
		 * @property _numFrames
		 * @protected
		 * @type Number
		 */
		this._numFrames = 0;

		/**
		 * @property _regX
		 * @protected
		 * @type Number
		 */
		this._regX = 0;

		/**
		 * @property _regY
		 * @protected
		 * @type Number
		 */
		this._regY = 0;

		/**
		 * @property _spacing
		 * @protected
		 * @type Number
		 */
		this._spacing = 0;

		/**
		 * @property _margin
		 * @protected
		 * @type Number
		 */
		this._margin = 0;

		this._parseData(data);
	}

// accessor properties:
	/**
	 * Returns an array of all available animation names available on this sprite sheet as strings.
	 * @property animations
	 * @type {Array}
	 * @readonly
	 */
	get animations () {
		return this._animations.slice();
	}

// public methods:
	/**
	 * Returns the total number of frames in the specified animation, or in the whole sprite
	 * sheet if the animation param is omitted. Returns 0 if the spritesheet relies on calculated frame counts, and
	 * the images have not been fully loaded.
	 * @method getNumFrames
	 * @param {String} animation The name of the animation to get a frame count for.
	 * @return {Number} The number of frames in the animation, or in the entire sprite sheet if the animation param is omitted.
	 */
	getNumFrames (animation) {
		if (animation == null) {
			return this._frames ? this._frames.length : this._numFrames || 0;
		} else {
			let data = this._data[animation];
			if (data == null) { return 0; }
			else { return data.frames.length; }
		}
	}

	/**
	 * Returns an object defining the specified animation. The returned object contains:<UL>
	 * 	<li>frames: an array of the frame ids in the animation</li>
	 * 	<li>speed: the playback speed for this animation</li>
	 * 	<li>name: the name of the animation</li>
	 * 	<li>next: the default animation to play next. If the animation loops, the name and next property will be the
	 * 	same.</li>
	 * </UL>
	 * @method getAnimation
	 * @param {String} name The name of the animation to get.
	 * @return {Object} a generic object with frames, speed, name, and next properties.
	 */
	getAnimation (name) {
		return this._data[name];
	}

	/**
	 * Returns an object specifying the image and source rect of the specified frame. The returned object has:<UL>
	 * 	<li>an image property holding a reference to the image object in which the frame is found</li>
	 * 	<li>a rect property containing a Rectangle instance which defines the boundaries for the frame within that
	 * 	image.</li>
	 * 	<li> A regX and regY property corresponding to the regX/Y values for the frame.
	 * </UL>
	 * @method getFrame
	 * @param {Number} frameIndex The index of the frame.
	 * @return {Object} a generic object with image and rect properties. Returns null if the frame does not exist.
	 */
	getFrame (frameIndex) {
		let frame;
		if (this._frames && (frame = this._frames[frameIndex])) { return frame; }
		return null;
	}

	/**
	 * Returns a {{#crossLink "Rectangle"}}{{/crossLink}} instance defining the bounds of the specified frame relative
	 * to the origin. For example, a 90 x 70 frame with a regX of 50 and a regY of 40 would return:
	 *
	 * 	[x=-50, y=-40, width=90, height=70]
	 *
	 * @method getFrameBounds
	 * @param {Number} frameIndex The index of the frame.
	 * @param {Rectangle} [rectangle=Rectangle] A Rectangle instance to copy the values into. By default a new instance is created.
	 * @return {Rectangle} A Rectangle instance. Returns null if the frame does not exist, or the image is not fully loaded.
	 */
	getFrameBounds (frameIndex, rectangle = new Rectangle()) {
		let frame = this.getFrame(frameIndex);
		return frame ? rectangle.setValues(-frame.regX, -frame.regY, frame.rect.width, frame.rect.height) : null;
	}

	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 */
	toString () {
		return `[${this.constructor.name}]`;
	}

	/**
	 * SpriteSheet cannot be cloned. A SpriteSheet can be shared by multiple Sprite instances without cloning it.
	 * @method clone
	 */
	clone () {
		// TODO-ES6: Add throw docs
		throw("SpriteSheet cannot be cloned.")
	}

// private methods:
	/**
	 * @method _parseData
	 * @param {Object} data An object describing the SpriteSheet data.
	 * @protected
	 */
	_parseData (data) {
		if (data == null) { return; }
		this.framerate = data.framerate||0;

		// parse images:
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
					img.onload = () => this._handleImageLoad(src);
					img.onerror = () => this._handleImageError(src);
				}
			}
		}

		// parse frames:
		if (data.frames != null) {
			if (Array.isArray(data.frames)) {
				this._frames = [];
				for (let arr of data.frames) {
					this._frames.push({image:this._images[arr[4]?arr[4]:0], rect:new Rectangle(arr[0],arr[1],arr[2],arr[3]), regX:arr[5]||0, regY:arr[6]||0 });
				}
			} else {
				let o = data.frames;
				this._frameWidth = o.width;
				this._frameHeight = o.height;
				this._regX = o.regX||0;
				this._regY = o.regY||0;
				this._spacing = o.spacing||0;
				this._margin = o.margin||0;
				this._numFrames = o.count;
				if (this._loadCount === 0) { this._calculateFrames(); }
			}
		}

		// parse animations:
		this._animations = [];
		if (data.animations != null) {
			this._data = {};
			let o = data.animations;
			for (let name in o) {
				let anim = { name };
				let obj = o[name];
				let a;
				if (typeof obj === "number") { // single frame
					a = anim.frames = [obj];
				} else if (Array.isArray(obj)) { // simple
					if (obj.length === 1) { anim.frames = [obj[0]]; }
					else {
						anim.speed = obj[3];
						anim.next = obj[2];
						a = anim.frames = [];
						for (let i=obj[0];i<=obj[1];i++) {
							a.push(i);
						}
					}
				} else { // complex
					anim.speed = obj.speed;
					anim.next = obj.next;
					let frames = obj.frames;
					a = anim.frames = (typeof frames === "number") ? [frames] : frames.slice(0);
				}
				if (anim.next === true || anim.next === undefined) { anim.next = name; } // loop
				if (anim.next === false || (a.length < 2 && anim.next === name)) { anim.next = null; } // stop
				if (!anim.speed) { anim.speed = 1; }
				this._animations.push(name);
				this._data[name] = anim;
			}
		}
	}

	/**
	 * @method _handleImageLoad
	 * @protected
	 */
	 _handleImageLoad (src) {
		if (--this._loadCount === 0) {
			this._calculateFrames();
			this.complete = true;
			this.dispatchEvent("complete");
		}
	}

	/**
	 * @method _handleImageError
	 * @protected
	 */
	_handleImageError (src) {
		let errorEvent = new Event("error");
		errorEvent.src = src;
		this.dispatchEvent(errorEvent);

		// Complete is still dispatched.
		if (--this._loadCount === 0) {
			this.dispatchEvent("complete");
		}
	}

	/**
	 * @method _calculateFrames
	 * @protected
	 */
	_calculateFrames () {
		if (this._frames || this._frameWidth === 0) { return; }

		this._frames = [];

		let maxFrames = this._numFrames || 100000; // if we go over this, something is wrong.
		let frameCount = 0, frameWidth = this._frameWidth, frameHeight = this._frameHeight;
		let spacing = this._spacing, margin = this._margin;

		imgLoop:
		for (let i=0, imgs=this._images, l=imgs.length; i<l; i++) {
			let img = imgs[i], imgW = img.width, imgH = img.height;

			let y = margin;
			while (y <= imgH-margin-frameHeight) {
				let x = margin;
				while (x <= imgW-margin-frameWidth) {
					if (frameCount >= maxFrames) { break imgLoop; }
					frameCount++;
					this._frames.push({
						image: img,
						rect: new Rectangle(x, y, frameWidth, frameHeight),
						regX: this._regX,
						regY: this._regY
					});
					x += frameWidth+spacing;
				}
				y += frameHeight+spacing;
			}
		}
		this._numFrames = frameCount;
	}

}

// events:
/**
 * Dispatched when all images are loaded.  Note that this only fires if the images
 * were not fully loaded when the sprite sheet was initialized. You should check the complete property
 * to prior to adding a listener. Ex.
 *
 * 	var sheet = new createjs.SpriteSheet(data);
 * 	if (!sheet.complete) {
 * 		// not preloaded, listen for the complete event:
 * 		sheet.addEventListener("complete", handler);
 * 	}
 *
 * @event complete
 * @param {Object} target The object that dispatched the event.
 * @param {String} type The event type.
 * @since 0.6.0
 */

/**
 * Dispatched when getFrame is called with a valid frame index. This is primarily intended for use by {{#crossLink "SpriteSheetBuilder"}}{{/crossLink}}
 * when doing on-demand rendering.
 * @event getframe
 * @param {Number} index The frame index.
 * @param {Object} frame The frame object that getFrame will return.
 */

/**
 * Dispatched when an image encounters an error. A SpriteSheet will dispatch an error event for each image that
 * encounters an error, and will still dispatch a {{#crossLink "SpriteSheet/complete:event"}}{{/crossLink}}
 * event once all images are finished processing, even if an error is encountered.
 * @event error
 * @param {String} src The source of the image that failed to load.
 * @since 0.8.2
 */

/*
* @license Text
* Visit http://createjs.com/ for documentation, updates and examples.
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

const _H_OFFSETS = {start: 0, left: 0, center: -0.5, end: -1, right: -1};
const _V_OFFSETS = {top: 0, hanging: -0.01, middle: -0.4, alphabetic: -0.8, ideographic: -0.85, bottom: -1};

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
 * @module EaselJS
 */
class Text extends DisplayObject {

// constructor:
	/**
	 * @constructor
	 * @param {String} [text] The text to display.
	 * @param {String} [font] The font style to use. Any valid value for the CSS font attribute is acceptable (ex. "bold
	 * 36px Arial").
	 * @param {String} [color] The color to draw the text in. Any valid value for the CSS color attribute is acceptable (ex.
	 * "#F00", "red", or "#FF0000").
	 */
	constructor (text, font, color) {
		super();

// public properties:
		/**
		 * The text to display.
		 * @property text
		 * @type String
		 */
		this.text = text;

		/**
		 * The font style to use. Any valid value for the CSS font attribute is acceptable (ex. "bold 36px Arial").
		 * @property font
		 * @type String
		 */
		this.font = font;

		/**
		 * The color to draw the text in. Any valid value for the CSS color attribute is acceptable (ex. "#F00"). Default is "#000".
		 * It will also accept valid canvas fillStyle values.
		 * @property color
		 * @type String
		 */
		this.color = color;

		/**
		 * The horizontal text alignment. Any of "start", "end", "left", "right", and "center". For detailed
		 * information view the
		 * <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#text-styles">
		 * whatwg spec</a>. Default is "left".
		 * @property textAlign
		 * @type String
		 */
		this.textAlign = "left";

		/**
		 * The vertical alignment point on the font. Any of "top", "hanging", "middle", "alphabetic", "ideographic", or
		 * "bottom". For detailed information view the <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#text-styles">
		 * whatwg spec</a>. Default is "top".
		 * @property textBaseline
		 * @type String
		*/
		this.textBaseline = "top";

		/**
		 * The maximum width to draw the text. If maxWidth is specified (not null), the text will be condensed or
		 * shrunk to make it fit in this width. For detailed information view the
		 * <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#text-styles">
		 * whatwg spec</a>.
		 * @property maxWidth
		 * @type Number
		*/
		this.maxWidth = null;

		/**
		 * If greater than 0, the text will be drawn as a stroke (outline) of the specified width.
		 * @property outline
		 * @type Number
		 */
		this.outline = 0;

		/**
		 * Indicates the line height (vertical distance between baselines) for multi-line text. If null or 0,
		 * the value of getMeasuredLineHeight is used.
		 * @property lineHeight
		 * @type Number
		 */
		this.lineHeight = 0;

		/**
		 * Indicates the maximum width for a line of text before it is wrapped to multiple lines. If null,
		 * the text will not be wrapped.
		 * @property lineWidth
		 * @type Number
		 */
		this.lineWidth = null;
	}

// static constants:
	/**
	 * Lookup table for the ratio to offset bounds x calculations based on the textAlign property.
	 * @property H_OFFSETS
	 * @type Object
	 * @protected
	 * @static
	 */
	 static get H_OFFSETS () { return _H_OFFSETS; }

	/**
	 * Lookup table for the ratio to offset bounds y calculations based on the textBaseline property.
	 * @property H_OFFSETS
	 * @type Object
	 * @protected
	 * @static
	 */
	 static get V_OFFSETS () { return _V_OFFSETS; }

// public methods:
 	/**
 	 * Returns true or false indicating whether the display object would be visible if drawn to a canvas.
 	 * This does not account for whether it would be visible within the boundaries of the stage.
 	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
 	 * @method isVisible
 	 * @return {Boolean} Whether the display object would be visible if drawn to a canvas
 	 */
 	isVisible () {
 		let hasContent = this.cacheCanvas || (this.text != null && this.text !== "");
 		return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent);
 	}

 	/**
 	 * Draws the Text into the specified context ignoring its visible, alpha, shadow, and transform.
 	 * Returns true if the draw was handled (useful for overriding functionality).
 	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
 	 * @method draw
 	 * @param {CanvasRenderingContext2D} ctx The canvas 2D context object to draw into.
 	 * @param {Boolean} ignoreCache Indicates whether the draw operation should ignore any current cache.
 	 * For example, used for drawing the cache (to prevent it from simply drawing an existing cache back
 	 * into itself).
 	 */
 	draw (ctx, ignoreCache) {
 		if (super.draw(ctx, ignoreCache)) { return true; }

 		let col = this.color || "#000";
 		if (this.outline) { ctx.strokeStyle = col; ctx.lineWidth = this.outline*1; }
 		else { ctx.fillStyle = col; }

 		this._drawText(this._prepContext(ctx));
 		return true;
 	}

 	/**
 	 * Returns the measured, untransformed width of the text without wrapping. Use getBounds for a more robust value.
 	 * @method getMeasuredWidth
 	 * @return {Number} The measured, untransformed width of the text.
 	 */
 	getMeasuredWidth () {
 		return this._getMeasuredWidth(this.text);
 	}

 	/**
 	 * Returns an approximate line height of the text, ignoring the lineHeight property. This is based on the measured
 	 * width of a "M" character multiplied by 1.2, which provides an approximate line height for most fonts.
 	 * @method getMeasuredLineHeight
 	 * @return {Number} an approximate line height of the text, ignoring the lineHeight property. This is
 	 * based on the measured width of a "M" character multiplied by 1.2, which approximates em for most fonts.
 	 */
 	getMeasuredLineHeight () {
 		return this._getMeasuredWidth("M")*1.2;
 	}

 	/**
 	 * Returns the approximate height of multi-line text by multiplying the number of lines against either the
 	 * <code>lineHeight</code> (if specified) or {{#crossLink "Text/getMeasuredLineHeight"}}{{/crossLink}}. Note that
 	 * this operation requires the text flowing logic to run, which has an associated CPU cost.
 	 * @method getMeasuredHeight
 	 * @return {Number} The approximate height of the untransformed multi-line text.
 	 */
 	getMeasuredHeight () {
 		return this._drawText(null, {}).height;
 	}

 	/**
 	 * Docced in superclass.
 	 */
 	getBounds () {
 		let rect = super.getBounds();
 		if (rect) { return rect; }
 		if (this.text == null || this.text === "") { return null; }
 		let o = this._drawText(null, {});
 		let w = (this.maxWidth && this.maxWidth < o.width) ? this.maxWidth : o.width;
 		let x = w * Text.H_OFFSETS[this.textAlign||"left"];
 		let lineHeight = this.lineHeight||this.getMeasuredLineHeight();
 		let y = lineHeight * Text.V_OFFSETS[this.textBaseline||"top"];
 		return this._rectangle.setValues(x, y, w, o.height);
 	}

 	/**
 	 * Returns an object with width, height, and lines properties. The width and height are the visual width and height
 	 * of the drawn text. The lines property contains an array of strings, one for
 	 * each line of text that will be drawn, accounting for line breaks and wrapping. These strings have trailing
 	 * whitespace removed.
 	 * @method getMetrics
 	 * @return {Object} An object with width, height, and lines properties.
 	 */
 	getMetrics () {
 		let o = {lines:[]};
 		o.lineHeight = this.lineHeight || this.getMeasuredLineHeight();
 		o.vOffset = o.lineHeight * Text.V_OFFSETS[this.textBaseline||"top"];
 		return this._drawText(null, o, o.lines);
 	}

 	/**
 	 * Returns a clone of the Text instance.
 	 * @method clone
 	 * @return {Text} a clone of the Text instance.
 	 */
 	clone () {
 		return this._cloneProps(new Text(this.text, this.font, this.color));
 	}

 	/**
 	 * Returns a string representation of this object.
 	 * @method toString
 	 * @return {String} a string representation of the instance.
 	 */
 	toString () {
 		return `[${this.constructor.name} (text=${this.text.length > 20 ? `${this.text.substr(0, 17)}...` : this.text})]`;
 	}

// private methods:
 	/**
 	 * @method _cloneProps
 	 * @param {Text} o
 	 * @protected
 	 * @return {Text} o
 	 */
 	_cloneProps (o) {
 		super._cloneProps(o);
 		o.textAlign = this.textAlign;
 		o.textBaseline = this.textBaseline;
 		o.maxWidth = this.maxWidth;
 		o.outline = this.outline;
 		o.lineHeight = this.lineHeight;
 		o.lineWidth = this.lineWidth;
 		return o;
 	}

 	/**
 	 * @method _getWorkingContext
 	 * @param {CanvasRenderingContext2D} ctx
 	 * @return {CanvasRenderingContext2D}
 	 * @protected
 	 */
 	_prepContext (ctx) {
 		ctx.font = this.font||"10px sans-serif";
 		ctx.textAlign = this.textAlign||"left";
 		ctx.textBaseline = this.textBaseline||"top";
 		return ctx;
 	}

 	/**
 	 * Draws multiline text.
 	 * @method _drawText
 	 * @param {CanvasRenderingContext2D} ctx
 	 * @param {Object} o
 	 * @param {Array} lines
 	 * @return {Object}
 	 * @protected
 	 */
 	_drawText (ctx, o, lines) {
 		const paint = !!ctx;
 		if (!paint) {
 			ctx = Text._workingContext;
 			ctx.save();
 			this._prepContext(ctx);
 		}
 		let lineHeight = this.lineHeight||this.getMeasuredLineHeight();

 		let maxW = 0, count = 0;
 		let hardLines = String(this.text).split(/(?:\r\n|\r|\n)/);
 		for (let str of hardLines) {
 			let w = null;

 			if (this.lineWidth != null && (w = ctx.measureText(str).width) > this.lineWidth) {
 				// text wrapping:
 				let words = str.split(/(\s)/);
 				str = words[0];
 				w = ctx.measureText(str).width;

				const l = words.length;
 				for (let i=1; i<l; i+=2) {
 					// Line needs to wrap:
 					let wordW = ctx.measureText(words[i] + words[i+1]).width;
 					if (w + wordW > this.lineWidth) {
 						if (paint) { this._drawTextLine(ctx, str, count*lineHeight); }
 						if (lines) { lines.push(str); }
 						if (w > maxW) { maxW = w; }
 						str = words[i+1];
 						w = ctx.measureText(str).width;
 						count++;
 					} else {
 						str += words[i] + words[i+1];
 						w += wordW;
 					}
 				}
 			}

 			if (paint) { this._drawTextLine(ctx, str, count*lineHeight); }
 			if (lines) { lines.push(str); }
 			if (o && w == null) { w = ctx.measureText(str).width; }
 			if (w > maxW) { maxW = w; }
 			count++;
 		}

 		if (o) {
 			o.width = maxW;
 			o.height = count*lineHeight;
 		}
 		if (!paint) { ctx.restore(); }
 		return o;
 	}

 	/**
 	 * @method _drawTextLine
 	 * @param {CanvasRenderingContext2D} ctx
 	 * @param {String} text
 	 * @param {Number} y
 	 * @protected
 	 */
 	_drawTextLine (ctx, text, y) {
 		// Chrome 17 will fail to draw the text if the last param is included but null, so we feed it a large value instead:
 		if (this.outline) { ctx.strokeText(text, 0, y, this.maxWidth||0xFFFF); }
 		else { ctx.fillText(text, 0, y, this.maxWidth||0xFFFF); }
 	}

 	/**
 	 * @method _getMeasuredWidth
 	 * @param {String} text
 	 * @protected
 	 */
 	_getMeasuredWidth (text) {
 		let ctx = Text._workingContext;
 		ctx.save();
 		let w = this._prepContext(ctx).measureText(text).width;
 		ctx.restore();
 		return w;
 	}

}

{
	/**
	 * @property _workingContext
	 * @type CanvasRenderingContext2D
	 * @private
	 * @static
	 */
	let canvas = createjs && createjs.createCanvas?createjs.createCanvas():document.createElement("canvas");
	if (canvas.getContext) {
		Text._workingContext = canvas.getContext("2d");
		canvas.width = canvas.height = 1;
	}
}

/*
 * @license AlphaMapFilter
 * Visit http://createjs.com/ for documentation, updates and examples.
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
 * @module EaselJS
 */
class AlphaMapFilter extends Filter {

// constructor:
	/**
	 * @constructor
	 * @param {HTMLImageElement|HTMLCanvasElement} alphaMap The greyscale image (or canvas) to use as the alpha value for the
	 * result. This should be exactly the same dimensions as the target.
	 */
	constructor (alphaMap) {
		super();

// public properties:
		/**
		 * The greyscale image (or canvas) to use as the alpha value for the result. This should be exactly the same
		 * dimensions as the target.
		 * @property alphaMap
		 * @type HTMLImageElement|HTMLCanvasElement
		 */
		this.alphaMap = alphaMap;

// private properties:
		/**
		 * @property _alphaMap
		 * @protected
		 * @type HTMLImageElement|HTMLCanvasElement
		 */
		this._alphaMap = null;

		/**
		 * @property _mapData
		 * @protected
		 * @type Uint8ClampedArray
		 */
		this._mapData = null;
		this._mapTexture = null;

		this.FRAG_SHADER_BODY = `
			uniform sampler2D uAlphaSampler;

			void main (void) {
				vec4 color = texture2D(uSampler, vRenderCoord);
				vec4 alphaMap = texture2D(uAlphaSampler, vTextureCoord);

				// some image formats can have transparent white rgba(1,1,1, 0) when put on the GPU, this means we need a slight tweak
				// using ceil ensure that the colour will be used so long as it exists but pure transparency will be treated black
				gl_FragColor = vec4(color.rgb, color.a * (alphaMap.r * ceil(alphaMap.a)));
			}
		`;
	}

	/**
	 * TODO: Docs
	 */
	shaderParamSetup (gl, stage, shaderProgram) {
		if (!this._mapTexture) { this._mapTexture = gl.createTexture(); }

		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, this._mapTexture);
		stage.setTextureParams(gl);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.alphaMap);

		gl.uniform1i(
			gl.getUniformLocation(shaderProgram, "uAlphaSampler"),
			1
		);
	}

// public methods:
	/**
	 * Docced in superclass.
	 */
	clone () {
		let o = new AlphaMapFilter(this.alphaMap);
		o._alphaMap = this._alphaMap;
		o._mapData = this._mapData;
		return o;
	}


// private methods:
	/**
	 * Docced in superclass.
	 */
	_applyFilter (imageData) {
		if (!this.alphaMap) { return true; }
		if (!this._prepAlphaMap()) { return false; }

		// TODO: update to support scenarios where the target has different dimensions.
		let data = imageData.data;
		let map = this._mapData;
		const l = data.length;
		for (let i=0; i<l; i += 4) { data[i + 3] = map[i] || 0; }

		return true;
	}

	/**
	 * @method _prepAlphaMap
	 * @protected
	 */
	_prepAlphaMap () {
		if (!this.alphaMap) { return false; }
		if (this.alphaMap === this._alphaMap && this._mapData) { return true; }
		this._mapData = null;

		let map = this._alphaMap = this.alphaMap;
		let canvas = map;
		let ctx;
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
			//if (!this.suppressCrossDomainErrors) throw new Error("unable to access local image data: " + e);
			return false;
		}
	}

}

/*
 * @license AlphaMaskFilter
 * Visit http://createjs.com/ for documentation, updates and examples.
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
 * @module EaselJS
 */
class AlphaMaskFilter extends Filter {

// constructor:
	/**
	 * @constructor
	 * @param {HTMLImageElement|HTMLCanvasElement} mask
	 */
	constructor (mask) {
		super();

// public properties:
		/**
		 * The image (or canvas) to use as the mask.
		 * @property mask
		 * @type HTMLImageElement|HTMLCanvasElement
		 */
		this.mask = mask;

		this.FRAG_SHADER_BODY = `
			uniform sampler2D uAlphaSampler;

			void main (void) {
				vec4 color = texture2D(uSampler, vRenderCoord);
				vec4 alphaMap = texture2D(uAlphaSampler, vTextureCoord);

				gl_FragColor = vec4(color.rgb, color.a * alphaMap.a);
			}
		`;
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
	applyFilter (ctx, x, y, width, height, targetCtx, targetX, targetY) {
		if (!this.mask) { return true; }
		targetCtx = targetCtx || ctx;
		if (targetX == null) { targetX = x; }
		if (targetY == null) { targetY = y; }

		targetCtx.save();
		if (ctx != targetCtx) {
			// TODO: support targetCtx and targetX/Y
			// clearRect, then draw the ctx in?
			return false;
		}

		targetCtx.globalCompositeOperation = "destination-in";
		targetCtx.drawImage(this.mask, targetX, targetY);
		targetCtx.restore();
		return true;
	}

	/**
	 * Docced in superclass
	 */
	clone () {
		return new AlphaMaskFilter(this.mask);
	}

	/**
	 * TODO: Doc
	 */
	shaderParamSetup (gl, stage, shaderProgram) {
		if(!this._mapTexture) { this._mapTexture = gl.createTexture(); }

		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, this._mapTexture);
		stage.setTextureParams(gl);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.mask);

		gl.uniform1i(
			gl.getUniformLocation(shaderProgram, "uAlphaSampler"),
			1
		);
	}

}

/*
 * @license BlurFilter
 * Visit http://createjs.com/ for documentation, updates and examples.
 *
 * Copyright (c) 2017 gskinner.com, inc.
 *
 * BoxBlur Algorithm by Mario Klingemann, quasimondo.com
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
 * @module EaselJS
 */

const _MUL_TABLE = [1, 171, 205, 293, 57, 373, 79, 137, 241, 27, 391, 357, 41, 19, 283, 265, 497, 469, 443, 421, 25, 191, 365, 349, 335, 161, 155, 149, 9, 278, 269, 261, 505, 245, 475, 231, 449, 437, 213, 415, 405, 395, 193, 377, 369, 361, 353, 345, 169, 331, 325, 319, 313, 307, 301, 37, 145, 285, 281, 69, 271, 267, 263, 259, 509, 501, 493, 243, 479, 118, 465, 459, 113, 446, 55, 435, 429, 423, 209, 413, 51, 403, 199, 393, 97, 3, 379, 375, 371, 367, 363, 359, 355, 351, 347, 43, 85, 337, 333, 165, 327, 323, 5, 317, 157, 311, 77, 305, 303, 75, 297, 294, 73, 289, 287, 71, 141, 279, 277, 275, 68, 135, 67, 133, 33, 262, 260, 129, 511, 507, 503, 499, 495, 491, 61, 121, 481, 477, 237, 235, 467, 232, 115, 457, 227, 451, 7, 445, 221, 439, 218, 433, 215, 427, 425, 211, 419, 417, 207, 411, 409, 203, 202, 401, 399, 396, 197, 49, 389, 387, 385, 383, 95, 189, 47, 187, 93, 185, 23, 183, 91, 181, 45, 179, 89, 177, 11, 175, 87, 173, 345, 343, 341, 339, 337, 21, 167, 83, 331, 329, 327, 163, 81, 323, 321, 319, 159, 79, 315, 313, 39, 155, 309, 307, 153, 305, 303, 151, 75, 299, 149, 37, 295, 147, 73, 291, 145, 289, 287, 143, 285, 71, 141, 281, 35, 279, 139, 69, 275, 137, 273, 17, 271, 135, 269, 267, 133, 265, 33, 263, 131, 261, 130, 259, 129, 257, 1];
const _SHG_TABLE = [0, 9, 10, 11, 9, 12, 10, 11, 12, 9, 13, 13, 10, 9, 13, 13, 14, 14, 14, 14, 10, 13, 14, 14, 14, 13, 13, 13, 9, 14, 14, 14, 15, 14, 15, 14, 15, 15, 14, 15, 15, 15, 14, 15, 15, 15, 15, 15, 14, 15, 15, 15, 15, 15, 15, 12, 14, 15, 15, 13, 15, 15, 15, 15, 16, 16, 16, 15, 16, 14, 16, 16, 14, 16, 13, 16, 16, 16, 15, 16, 13, 16, 15, 16, 14, 9, 16, 16, 16, 16, 16, 16, 16, 16, 16, 13, 14, 16, 16, 15, 16, 16, 10, 16, 15, 16, 14, 16, 16, 14, 16, 16, 14, 16, 16, 14, 15, 16, 16, 16, 14, 15, 14, 15, 13, 16, 16, 15, 17, 17, 17, 17, 17, 17, 14, 15, 17, 17, 16, 16, 17, 16, 15, 17, 16, 17, 11, 17, 16, 17, 16, 17, 16, 17, 17, 16, 17, 17, 16, 17, 17, 16, 16, 17, 17, 17, 16, 14, 17, 17, 17, 17, 15, 16, 14, 16, 15, 16, 13, 16, 15, 16, 14, 16, 15, 16, 12, 16, 15, 16, 17, 17, 17, 17, 17, 13, 16, 15, 17, 17, 17, 16, 15, 17, 17, 17, 16, 15, 17, 17, 14, 16, 17, 17, 16, 17, 17, 16, 15, 17, 16, 14, 17, 16, 15, 17, 16, 17, 17, 16, 17, 15, 16, 17, 14, 17, 16, 15, 17, 16, 17, 13, 17, 16, 17, 17, 16, 17, 14, 17, 16, 17, 16, 17, 16, 17, 9];

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
class BlurFilter extends Filter {

// constructor:
	/**
	 * @constructor
	 * @param {Number} [blurX=0] The horizontal blur radius in pixels.
	 * @param {Number} [blurY=0] The vertical blur radius in pixels.
	 * @param {Number} [quality=1] The number of blur iterations.
	 */
	constructor (blurX = 0, blurY = 0, quality = 1) {
		super();

// public properties:
		/**
		 * Horizontal blur radius in pixels
		 * @property blurX
		 * @default 0
		 * @type Number
		 */
		this._blurX = blurX;
		this._blurXTable = [];

		/**
		 * Vertical blur radius in pixels
		 * @property blurY
		 * @default 0
		 * @type Number
		 */
		this._blurY = blurY;
		this._blurYTable = [];

		/**
		 * Number of blur iterations. For example, a value of 1 will produce a rough blur. A value of 2 will produce a
		 * smoother blur, but take twice as long to run.
		 * @property quality
		 * @default 1
		 * @type Number
		 */
		this._quality;

		/**
		 * This is a template to generate the shader for {{#crossLink FRAG_SHADER_BODY}}{{/crossLink}}
		 */
		this.FRAG_SHADER_TEMPLATE = `
			uniform float xWeight[{{blurX}}];
			uniform float yWeight[{{blurY}}];
			uniform vec2 textureOffset;
			void main (void) {
				vec4 color = vec4(0.0);

				float xAdj = ({{blurX}}.0-1.0)/2.0;
				float yAdj = ({{blurY}}.0-1.0)/2.0;
				vec2 sampleOffset;

				for(int i=0; i<{{blurX}}; i++) {
					for(int j=0; j<{{blurY}}; j++) {
						sampleOffset = vRenderCoord + (textureOffset * vec2(float(i)-xAdj, float(j)-yAdj));
						color += texture2D(uSampler, sampleOffset) * (xWeight[i] * yWeight[j]);
					}
				}

				gl_FragColor = color.rgba;
			}
		`;

		this.quality = isNaN(quality) || quality < 1 ? 1 : quality;
	}

// constants:
	/**
	 * Array of multiply values for blur calculations.
	 * @property MUL_TABLE
	 * @type Array
	 * @protected
	 * @static
	 */
	static get MUL_TABLE () { return _MUL_TABLE; }

	/**
	 * Array of shift values for blur calculations.
	 * @property SHG_TABLE
	 * @type Array
	 * @protected
	 * @static
	 */
	static get SHG_TABLE () { return _SHG_TABLE; }

// accessor properties:
// TODO: Docs for these.
	get blurX () {
		return this._blurX;
	}

	set blurX (blurX) {
		if (isNaN(blurX) || blurX < 0) { blurX = 0; }
		this._blurX = blurX;
		this._blurXTable = this._getTable(blurX * this._quality);
		this.updateShader();
	}

	get blurY () {
		return this._blurY;
	}

	set blurY (blurY) {
		if (isNaN(blurY) || blurY < 0){ blurY = 0; }
		this._blurY = blurY;
		this._blurYTable = this._getTable(blurY * this._quality);
		this.updateShader();
	}

	get quality () {
		return this._quality;
	}

	set quality (quality) {
		this._quality = quality;
		this._blurXTable = this._getTable(this._blurX * this._quality);
		this._blurYTable = this._getTable(this._blurY * this._quality);
		this.updateShader();
	}

// public methods:
	/**
	 *
	 */
	updateShader () {
		let result = this.FRAG_SHADER_TEMPLATE;
		result = result.replace(/{{blurX}}/g, this._blurXTable.length.toFixed(0));
		result = result.replace(/{{blurY}}/g, this._blurYTable.length.toFixed(0));
		this.FRAG_SHADER_BODY = result;
	}

	/**
	 * Docced in superclass
	 */
	shaderParamSetup (gl, stage, shaderProgram) {
		// load the normalized gaussian weight tables
		gl.uniform1fv(
			gl.getUniformLocation(shaderProgram, "xWeight"),
			this._blurXTable
		);
		gl.uniform1fv(
			gl.getUniformLocation(shaderProgram, "yWeight"),
			this._blurYTable
		);

		// what is the size of a single pixel in -1, 1 (webGL) space
		gl.uniform2f(
			gl.getUniformLocation(shaderProgram, "textureOffset"),
			2/(stage._viewportWidth*this._quality), 2/(stage._viewportHeight*this._quality)
		);
	}

	/**
	 * Docced in super class
	 */
	getBounds (rect) {
		let x = this.blurX|0, y = this.blurY| 0;
		if(x <= 0 && y <= 0) { return rect; }
		let q = Math.pow(this.quality, 0.2);
		return (rect || new Rectangle()).pad(x*q+1,y*q+1,x*q+1,y*q+1);
	}

	/**
	 * Docced in super class
	 */
	clone () {
		return new BlurFilter(this.blurX, this.blurY, this.quality);
	}


// private methods:
	/**
	 *
	 */
	_getTable (spread) {
		const EDGE = 4.2;
		if (spread <= 1) { return [1]; }

		let result = [];
		let count = Math.ceil(spread*2);
		count += (count%2)?0:1;
		let adjust = (count/2)|0;
		for (let i = -adjust; i<=adjust; i++) {
			let x = (i/adjust)*EDGE;
			result.push(1/Math.sqrt(2*Math.PI) * Math.pow(Math.E, -(Math.pow(x,2)/4)));
		}
		let factor = result.reduce((a, b) => a + b, 0);
		return result.map(currentValue => currentValue / factor);
	}

	/**
	 * Docced in super class
	 */
	_applyFilter (imageData) {
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
		let x=0, y=0, i=0, p=0, yp=0, yi=0, yw=0, r=0, g=0, b=0, a=0, pr=0, pg=0, pb=0, pa=0;

		let divx = (radiusX + radiusX + 1) | 0;
		let divy = (radiusY + radiusY + 1) | 0;
		let w = imageData.width | 0;
		let h = imageData.height | 0;

		let w1 = (w - 1) | 0;
		let h1 = (h - 1) | 0;
		let rxp1 = (radiusX + 1) | 0;
		let ryp1 = (radiusY + 1) | 0;

		let ssx = {r:0,b:0,g:0,a:0};
		let sx = ssx;
		for ( i = 1; i < divx; i++ )
		{
			sx = sx.n = {r:0,b:0,g:0,a:0};
		}
		sx.n = ssx;

		let ssy = {r:0,b:0,g:0,a:0};
		let sy = ssy;
		for ( i = 1; i < divy; i++ )
		{
			sy = sy.n = {r:0,b:0,g:0,a:0};
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
			for (y = h; --y > -1;) {
				r = rxp1 * (pr = px[(yi) | 0]);
				g = rxp1 * (pg = px[(yi + 1) | 0]);
				b = rxp1 * (pb = px[(yi + 2) | 0]);
				a = rxp1 * (pa = px[(yi + 3) | 0]);

				sx = ssx;

				for( i = rxp1; --i > -1; )
				{
					sx.r = pr;
					sx.g = pg;
					sx.b = pb;
					sx.a = pa;
					sx = sx.n;
				}

				for( i = 1; i < rxp1; i++ )
				{
					p = (yi + ((w1 < i ? w1 : i) << 2)) | 0;
					r += ( sx.r = px[p]);
					g += ( sx.g = px[p+1]);
					b += ( sx.b = px[p+2]);
					a += ( sx.a = px[p+3]);

					sx = sx.n;
				}

				si = ssx;
				for ( x = 0; x < w; x++ )
				{
					px[yi++] = (r * ms) >>> ss;
					px[yi++] = (g * ms) >>> ss;
					px[yi++] = (b * ms) >>> ss;
					px[yi++] = (a * ms) >>> ss;

					p = ((yw + ((p = x + radiusX + 1) < w1 ? p : w1)) << 2);

					r -= si.r - ( si.r = px[p]);
					g -= si.g - ( si.g = px[p+1]);
					b -= si.b - ( si.b = px[p+2]);
					a -= si.a - ( si.a = px[p+3]);

					si = si.n;

				}
				yw += w;
			}

			ms = mty;
			ss = sty;
			for (x = 0; x < w; x++) {
				yi = (x << 2) | 0;

				r = (ryp1 * (pr = px[yi])) | 0;
				g = (ryp1 * (pg = px[(yi + 1) | 0])) | 0;
				b = (ryp1 * (pb = px[(yi + 2) | 0])) | 0;
				a = (ryp1 * (pa = px[(yi + 3) | 0])) | 0;

				sy = ssy;
				for( i = 0; i < ryp1; i++ )
				{
					sy.r = pr;
					sy.g = pg;
					sy.b = pb;
					sy.a = pa;
					sy = sy.n;
				}

				yp = w;

				for( i = 1; i <= radiusY; i++ )
				{
					yi = ( yp + x ) << 2;

					r += ( sy.r = px[yi]);
					g += ( sy.g = px[yi+1]);
					b += ( sy.b = px[yi+2]);
					a += ( sy.a = px[yi+3]);

					sy = sy.n;

					if( i < h1 )
					{
						yp += w;
					}
				}

				yi = x;
				si = ssy;
				if ( iterations > 0 )
				{
					for ( y = 0; y < h; y++ )
					{
						p = yi << 2;
						px[p+3] = pa =(a * ms) >>> ss;
						if ( pa > 0 )
						{
							px[p]   = ((r * ms) >>> ss );
							px[p+1] = ((g * ms) >>> ss );
							px[p+2] = ((b * ms) >>> ss );
						} else {
							px[p] = px[p+1] = px[p+2] = 0;
						}

						p = ( x + (( ( p = y + ryp1) < h1 ? p : h1 ) * w )) << 2;

						r -= si.r - ( si.r = px[p]);
						g -= si.g - ( si.g = px[p+1]);
						b -= si.b - ( si.b = px[p+2]);
						a -= si.a - ( si.a = px[p+3]);

						si = si.n;

						yi += w;
					}
				} else {
					for ( y = 0; y < h; y++ )
					{
						p = yi << 2;
						px[p+3] = pa =(a * ms) >>> ss;
						if ( pa > 0 )
						{
							pa = 255 / pa;
							px[p]   = ((r * ms) >>> ss ) * pa;
							px[p+1] = ((g * ms) >>> ss ) * pa;
							px[p+2] = ((b * ms) >>> ss ) * pa;
						} else {
							px[p] = px[p+1] = px[p+2] = 0;
						}

						p = ( x + (( ( p = y + ryp1) < h1 ? p : h1 ) * w )) << 2;

						r -= si.r - ( si.r = px[p]);
						g -= si.g - ( si.g = px[p+1]);
						b -= si.b - ( si.b = px[p+2]);
						a -= si.a - ( si.a = px[p+3]);

						si = si.n;

						yi += w;
					}
				}
			}

		}
		return true;
	}

}

/*
* @license ColorFilter
* Visit http://createjs.com/ for documentation, updates and examples.
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

/**
 * @module EaselJS
 */

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
class ColorFilter extends Filter {

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
	constructor (redMultiplier = 1, greenMultiplier = 1, blueMultiplier = 1, alphaMultiplier = 1, redOffset = 0, greenOffset = 0, blueOffset = 0, alphaOffset = 0) {
		super();

// public properties:
		/**
		 * Red channel multiplier.
		 * @property redMultiplier
		 * @type Number
		 */
		this.redMultiplier = redMultiplier;

		/**
		 * Green channel multiplier.
		 * @property greenMultiplier
		 * @type Number
		 */
		this.greenMultiplier = greenMultiplier;

		/**
		 * Blue channel multiplier.
		 * @property blueMultiplier
		 * @type Number
		 */
		this.blueMultiplier = blueMultiplier;

		/**
		 * Alpha channel multiplier.
		 * @property alphaMultiplier
		 * @type Number
		 */
		this.alphaMultiplier = alphaMultiplier;

		/**
		 * Red channel offset (added to value).
		 * @property redOffset
		 * @type Number
		 */
		this.redOffset = redOffset;

		/**
		 * Green channel offset (added to value).
		 * @property greenOffset
		 * @type Number
		 */
		this.greenOffset = greenOffset;

		/**
		 * Blue channel offset (added to value).
		 * @property blueOffset
		 * @type Number
		 */
		this.blueOffset = blueOffset;

		/**
		 * Alpha channel offset (added to value).
		 * @property alphaOffset
		 * @type Number
		 */
		this.alphaOffset = alphaOffset;

		this.FRAG_SHADER_BODY = `
			uniform vec4 uColorMultiplier;
			uniform vec4 uColorOffset;

			void main (void) {
				vec4 color = texture2D(uSampler, vRenderCoord);

				gl_FragColor = (color * uColorMultiplier) + uColorOffset;
			}
		`;

	}

// public methods:
	shaderParamSetup (gl, stage, shaderProgram) {
		gl.uniform4f(
			gl.getUniformLocation(shaderProgram, "uColorMultiplier"),
			this.redMultiplier, this.greenMultiplier, this.blueMultiplier, this.alphaMultiplier
		);

		gl.uniform4f(
			gl.getUniformLocation(shaderProgram, "uColorOffset"),
			this.redOffset/255, this.greenOffset/255, this.blueOffset/255, this.alphaOffset/255
		);
	}

	/**
	 * Docced in super class
	 */
	clone () {
		return new ColorFilter(
			this.redMultiplier, this.greenMultiplier, this.blueMultiplier, this.alphaMultiplier,
			this.redOffset, this.greenOffset, this.blueOffset, this.alphaOffset
		);
	}

// private methods:
	/**
	 * Docced in super class
	 */
	_applyFilter (imageData) {
		let data = imageData.data;
		const l = data.length;
		for (let i=0; i<l; i+=4) {
			data[i] = data[i]*this.redMultiplier+this.redOffset;
			data[i+1] = data[i+1]*this.greenMultiplier+this.greenOffset;
			data[i+2] = data[i+2]*this.blueMultiplier+this.blueOffset;
			data[i+3] = data[i+3]*this.alphaMultiplier+this.alphaOffset;
		}
		return true;
	}

}

/*
* @license ColorMatrix
* Visit http://createjs.com/ for documentation, updates and examples.
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

/**
 * @module EaselJS
 */

const _DELTA_INDEX = [
 	0,    0.01, 0.02, 0.04, 0.05, 0.06, 0.07, 0.08, 0.1,  0.11,
 	0.12, 0.14, 0.15, 0.16, 0.17, 0.18, 0.20, 0.21, 0.22, 0.24,
 	0.25, 0.27, 0.28, 0.30, 0.32, 0.34, 0.36, 0.38, 0.40, 0.42,
 	0.44, 0.46, 0.48, 0.5,  0.53, 0.56, 0.59, 0.62, 0.65, 0.68,
 	0.71, 0.74, 0.77, 0.80, 0.83, 0.86, 0.89, 0.92, 0.95, 0.98,
 	1.0,  1.06, 1.12, 1.18, 1.24, 1.30, 1.36, 1.42, 1.48, 1.54,
 	1.60, 1.66, 1.72, 1.78, 1.84, 1.90, 1.96, 2.0,  2.12, 2.25,
 	2.37, 2.50, 2.62, 2.75, 2.87, 3.0,  3.2,  3.4,  3.6,  3.8,
 	4.0,  4.3,  4.7,  4.9,  5.0,  5.5,  6.0,  6.5,  6.8,  7.0,
 	7.3,  7.5,  7.8,  8.0,  8.4,  8.7,  9.0,  9.4,  9.6,  9.8,
 	10.0
];
const _IDENTITY_MATRIX = [
 	1,0,0,0,0,
 	0,1,0,0,0,
 	0,0,1,0,0,
 	0,0,0,1,0,
 	0,0,0,0,1
];
const _LENGTH = 25;

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
class ColorMatrix {

// constructor:
	/**
	 * @constructor
	 * @param {Number} brightness
	 * @param {Number} contrast
	 * @param {Number} saturation
	 * @param {Number} hue
	 */
	constructor (brightness, contrast, saturation, hue) {
		this.setColor(brightness, contrast, saturation, hue);
	}

// constants:
	/**
	 * Array of delta values for contrast calculations.
	 * @property DELTA_INDEX
	 * @type Array
	 * @protected
	 * @static
	 */
	static get DELTA_INDEX () { return _DELTA_INDEX; }

	/**
	 * Identity matrix values.
	 * @property IDENTITY_MATRIX
	 * @type Array
	 * @protected
	 * @static
	 */
	static get IDENTITY_MATRIX () { return _IDENTITY_MATRIX; }

	/**
	 * The constant length of a color matrix.
	 * @property LENGTH
	 * @type Number
	 * @protected
	 * @static
	 */
	static get LENGTH () { return _LENGTH; }

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
	setColor (brightness, contrast, saturation, hue) {
		return this.reset().adjustColor(brightness, contrast, saturation, hue);
	}

	/**
	 * Resets the matrix to identity values.
	 * @method reset
	 * @return {ColorMatrix} The ColorMatrix instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
	reset () {
		return this.copy(ColorMatrix.IDENTITY_MATRIX);
	}

	/**
	 * Shortcut method to adjust brightness, contrast, saturation and hue.
	 * Equivalent to calling adjustHue(hue), adjustContrast(contrast),
	 * adjustBrightness(brightness), adjustSaturation(saturation), in that order.
	 * @method adjustColor
	 * @param {Number} brightness
	 * @param {Number} contrast
	 * @param {Number} saturation
	 * @param {Number} hue
	 * @return {ColorMatrix} The ColorMatrix instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
	adjustColor (brightness, contrast, saturation, hue) {
		this.adjustHue(hue);
		this.adjustContrast(contrast);
		this.adjustBrightness(brightness);
		return this.adjustSaturation(saturation);
	}

	/**
	 * Adjusts the brightness of pixel color by adding the specified value to the red, green and blue channels.
	 * Positive values will make the image brighter, negative values will make it darker.
	 * @method adjustBrightness
	 * @param {Number} value A value between -255 & 255 that will be added to the RGB channels.
	 * @return {ColorMatrix} The ColorMatrix instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
	adjustBrightness (value) {
		if (value === 0 || isNaN(value)) { return this; }
		value = this._cleanValue(value, 255);
		this._multiplyMatrix([
			1,0,0,0,value,
			0,1,0,0,value,
			0,0,1,0,value,
			0,0,0,1,0,
			0,0,0,0,1
		]);
		return this;
	}

	/**
	 * Adjusts the contrast of pixel color.
	 * Positive values will increase contrast, negative values will decrease contrast.
	 * @method adjustContrast
	 * @param {Number} value A value between -100 & 100.
	 * @return {ColorMatrix} The ColorMatrix instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
	adjustContrast (value) {
		if (value === 0 || isNaN(value)) { return this; }
		value = this._cleanValue(value, 100);
		let x;
		if (value<0) {
			x = 127+value/100*127;
		} else {
			x = value%1;
			if (x === 0) {
				x = ColorMatrix.DELTA_INDEX[value];
			} else {
				x = ColorMatrix.DELTA_INDEX[(value<<0)]*(1-x)+ColorMatrix.DELTA_INDEX[(value<<0)+1]*x; // use linear interpolation for more granularity.
			}
			x = x*127+127;
		}
		this._multiplyMatrix([
			x/127,0,0,0,0.5*(127-x),
			0,x/127,0,0,0.5*(127-x),
			0,0,x/127,0,0.5*(127-x),
			0,0,0,1,0,
			0,0,0,0,1
		]);
		return this;
	}

	/**
	 * Adjusts the color saturation of the pixel.
	 * Positive values will increase saturation, negative values will decrease saturation (trend towards greyscale).
	 * @method adjustSaturation
	 * @param {Number} value A value between -100 & 100.
	 * @return {ColorMatrix} The ColorMatrix instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
	adjustSaturation (value) {
		if (value === 0 || isNaN(value)) { return this; }
		value = this._cleanValue(value, 100);
		let x = 1+((value > 0) ? 3*value/100 : value/100);
		let lumR = 0.3086;
		let lumG = 0.6094;
		let lumB = 0.0820;
		this._multiplyMatrix([
			lumR*(1-x)+x,lumG*(1-x),lumB*(1-x),0,0,
			lumR*(1-x),lumG*(1-x)+x,lumB*(1-x),0,0,
			lumR*(1-x),lumG*(1-x),lumB*(1-x)+x,0,0,
			0,0,0,1,0,
			0,0,0,0,1
		]);
		return this;
	}


	/**
	 * Adjusts the hue of the pixel color.
	 * @method adjustHue
	 * @param {Number} value A value between -180 & 180.
	 * @return {ColorMatrix} The ColorMatrix instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
	adjustHue (value) {
		if (value === 0 || isNaN(value)) { return this; }
		value = this._cleanValue(value, 180)/180*Math.PI;
		let cosVal = Math.cos(value);
		let sinVal = Math.sin(value);
		let lumR = 0.213;
		let lumG = 0.715;
		let lumB = 0.072;
		this._multiplyMatrix([
			lumR+cosVal*(1-lumR)+sinVal*(-lumR),lumG+cosVal*(-lumG)+sinVal*(-lumG),lumB+cosVal*(-lumB)+sinVal*(1-lumB),0,0,
			lumR+cosVal*(-lumR)+sinVal*(0.143),lumG+cosVal*(1-lumG)+sinVal*(0.140),lumB+cosVal*(-lumB)+sinVal*(-0.283),0,0,
			lumR+cosVal*(-lumR)+sinVal*(-(1-lumR)),lumG+cosVal*(-lumG)+sinVal*(lumG),lumB+cosVal*(1-lumB)+sinVal*(lumB),0,0,
			0,0,0,1,0,
			0,0,0,0,1
		]);
		return this;
	}

	/**
	 * Concatenates (multiplies) the specified matrix with this one.
	 * @method concat
	 * @param {Array} matrix An array or ColorMatrix instance.
	 * @return {ColorMatrix} The ColorMatrix instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
	concat (matrix) {
		matrix = this._fixMatrix(matrix);
		if (matrix.length != ColorMatrix.LENGTH) { return this; }
		this._multiplyMatrix(matrix);
		return this;
	}

	/**
	 * Returns a clone of this ColorMatrix.
	 * @method clone
	 * @return {ColorMatrix} A clone of this ColorMatrix.
	 */
	clone () {
		return (new ColorMatrix()).copy(this);
	}

	/**
	 * Return a length 25 (5x5) array instance containing this matrix's values.
	 * @method toArray
	 * @return {Array} An array holding this matrix's values.
	 */
	toArray () {
		let arr = [];
		const l = ColorMatrix.LENGTH;
		for (let i=0; i<l; i++) {
			arr[i] = this[i];
		}
		return arr;
	}

	/**
	 * Copy the specified matrix's values to this matrix.
	 * @method copy
	 * @param {Array} matrix An array or ColorMatrix instance.
	 * @return {ColorMatrix} The ColorMatrix instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
	copy (matrix) {
		const l = ColorMatrix.LENGTH;
		for (let i=0;i<l;i++) {
			this[i] = matrix[i];
		}
		return this;
	}

	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 */
	toString () {
		return `[${this.constructor.name}]`;
	}


// private methods:
	/**
	 * @method _multiplyMatrix
	 * @param {Array} matrix
	 * @protected
	 */
	_multiplyMatrix (matrix) {
		let col = [];

		for (let i=0;i<5;i++) {
			for (let j=0;j<5;j++) {
				col[j] = this[j+i*5];
			}
			for (let j=0;j<5;j++) {
				let val=0;
				for (let k=0;k<5;k++) {
					val += matrix[j+k*5]*col[k];
				}
				this[j+i*5] = val;
			}
		}
	}

	/**
	 * Make sure values are within the specified range, hue has a limit of 180, brightness is 255, others are 100.
	 * @method _cleanValue
	 * @param {Number} value The raw number
	 * @param {Number} limit The maximum that the number can be. The minimum is the limit * -1.
	 * @protected
	 */
	_cleanValue (value, limit) {
		return Math.min(limit, Math.max(-limit, value));
	}

	/**
	 * Makes sure matrixes are 5x5 (25 long).
	 * @method _fixMatrix
	 * @param {Array} matrix
	 * @protected
	 */
	_fixMatrix (matrix) {
		if (matrix instanceof ColorMatrix) { matrix = matrix.toArray(); }
		if (matrix.length < ColorMatrix.LENGTH) {
			matrix = matrix.slice(0, matrix.length).concat(ColorMatrix.IDENTITY_MATRIX.slice(matrix.length, ColorMatrix.LENGTH));
		} else if (matrix.length > ColorMatrix.LENGTH) {
			matrix = matrix.slice(0, ColorMatrix.LENGTH);
		}
		return matrix;
	}

}

/*
* @license ColorMatrixFilter
* Visit http://createjs.com/ for documentation, updates and examples.
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

/**
 * @module EaselJS
 */

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
class ColorMatrixFilter extends Filter {

// constructor:
	/**
	 * @constructor
	 * @param {Array | ColorMatrix} matrix A 4x5 matrix describing the color operation to perform. See also the {{#crossLink "ColorMatrix"}}{{/crossLink}}
	 * class.
	 */
	constructor (matrix) {
		super();

// public properties:
		/**
		 * A 4x5 matrix describing the color operation to perform. See also the {{#crossLink "ColorMatrix"}}{{/crossLink}}
		 * @property matrix
		 * @type Array | ColorMatrix
		 */
		this.matrix = matrix;

		this.FRAG_SHADER_BODY = `
			uniform mat4 uColorMatrix;
			uniform vec4 uColorMatrixOffset;

			void main (void) {
				vec4 color = texture2D(uSampler, vRenderCoord);

				mat4 m = uColorMatrix;
				vec4 newColor = vec4(0,0,0,0);
				newColor.r = color.r*m[0][0] + color.g*m[0][1] + color.b*m[0][2] + color.a*m[0][3];
				newColor.g = color.r*m[1][0] + color.g*m[1][1] + color.b*m[1][2] + color.a*m[1][3];
				newColor.b = color.r*m[2][0] + color.g*m[2][1] + color.b*m[2][2] + color.a*m[2][3];
				newColor.a = color.r*m[3][0] + color.g*m[3][1] + color.b*m[3][2] + color.a*m[3][3];

				gl_FragColor = newColor + uColorMatrixOffset;
			}
		`;
	}

// public methods:
	shaderParamSetup (gl, stage, shaderProgram) {
		let mat = this.matrix;
		let colorMatrix = new Float32Array([
			mat[0],mat[1],mat[2],mat[3],
			mat[5],mat[6],mat[7],mat[8],
			mat[10],mat[11],mat[12],mat[13],
			mat[15],mat[16],mat[17],mat[18]
		]);

		gl.uniformMatrix4fv(
			gl.getUniformLocation(shaderProgram, "uColorMatrix"),
			false, colorMatrix
		);
		gl.uniform4f(
			gl.getUniformLocation(shaderProgram, "uColorMatrixOffset"),
			mat[4]/255, mat[9]/255, mat[14]/255, mat[19]/255
		);
	}

	/**
	 * Docced in super class
	 */
	clone () {
		return new ColorMatrixFilter(this.matrix);
	}

// private methods:
	/**
	 * Docced in super class
	 */
	_applyFilter (imageData) {
		let data = imageData.data;
		const l = data.length;
		let r,g,b,a;
		let mtx = this.matrix;
		let m0 =  mtx[0],  m1 =  mtx[1],  m2 =  mtx[2],  m3 =  mtx[3],  m4 =  mtx[4];
		let m5 =  mtx[5],  m6 =  mtx[6],  m7 =  mtx[7],  m8 =  mtx[8],  m9 =  mtx[9];
		let m10 = mtx[10], m11 = mtx[11], m12 = mtx[12], m13 = mtx[13], m14 = mtx[14];
		let m15 = mtx[15], m16 = mtx[16], m17 = mtx[17], m18 = mtx[18], m19 = mtx[19];

		for (let i=0; i<l; i+=4) {
			r = data[i];
			g = data[i+1];
			b = data[i+2];
			a = data[i+3];
			data[i] = r*m0+g*m1+b*m2+a*m3+m4; // red
			data[i+1] = r*m5+g*m6+b*m7+a*m8+m9; // green
			data[i+2] = r*m10+g*m11+b*m12+a*m13+m14; // blue
			data[i+3] = r*m15+g*m16+b*m17+a*m18+m19; // alpha
		}

		return true;
	}

}

/*
* @license ButtonHelper
* Visit http://createjs.com/ for documentation, updates and examples.
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
 * @module EaselJS
 */
class ButtonHelper {

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
	constructor (target, outLabel = "out", overLabel = "over", downLabel = "down", play = false, hitArea, hitLabel) {
		if (!target.addEventListener) { return; }

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
				hitArea.gotoAndStop&&hitArea.gotoAndStop(hitLabel);
			}
			target.hitArea = hitArea;
		}
	}

// accessor properties:
	/**
	 * Enables or disables the button functionality on the target.
	 * @property enabled
	 * @type {Boolean}
	 */
	get enabled () {
		return this._enabled;
	}

	set enabled (enabled) {
		if (enabled === this._enabled) { return; }
		let o = this.target;
		this._enabled = enabled;
		if (enabled) {
			o.cursor = "pointer";
			o.addEventListener("rollover", this);
			o.addEventListener("rollout", this);
			o.addEventListener("mousedown", this);
			o.addEventListener("pressup", this);
			if (o._reset) { o.__reset = o._reset; o._reset = this._reset;}
		} else {
			o.cursor = null;
			o.removeEventListener("rollover", this);
			o.removeEventListener("rollout", this);
			o.removeEventListener("mousedown", this);
			o.removeEventListener("pressup", this);
			if (o.__reset) { o._reset = o.__reset; delete(o.__reset); }
		}
	}

// public methods:
	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 */
	toString () {
		return `[${this.constructor.name}]`;
	}


// private methods:
	/**
	 * @method handleEvent
	 * @param {Object} evt The mouse event to handle.
	 * @protected
	 */
	handleEvent (evt) {
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
		} else { // rollout and default
			this._isOver = false;
			label = this._isPressed ? this.overLabel : this.outLabel;
		}
		if (this.play) {
			t.gotoAndPlay&&t.gotoAndPlay(label);
		} else {
			t.gotoAndStop&&t.gotoAndStop(label);
		}
	}

	/**
	 * Injected into target. Preserves the paused state through a reset.
	 * @method _reset
	 * @protected
	 */
	_reset () {
		// TODO: explore better ways to handle this issue. This is hacky & disrupts object signatures.
		let p = this.paused;
		this.__reset();
		this.paused = p;
	}

}

/*
* @license Touch
* Visit http://createjs.com/ for documentation, updates and examples.
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
 * @module EaselJS
 */
class Touch {

// constructor:
	/**
	 * @constructor
	 */
	constructor () {
		throw "Touch cannot be instantiated";
	}

// public static methods:
	/**
	 * Returns `true` if touch is supported in the current browser.
	 * @method isSupported
	 * @return {Boolean} Indicates whether touch is supported in the current browser.
	 * @static
	 */
	static isSupported () {
		return	!!(('ontouchstart' in window) // iOS & Android
			|| (window.navigator['msPointerEnabled'] && window.navigator['msMaxTouchPoints'] > 0) // IE10
			|| (window.navigator['pointerEnabled'] && window.navigator['maxTouchPoints'] > 0)); // IE11+
	}

	/**
	 * Enables touch interaction for the specified EaselJS {{#crossLink "Stage"}}{{/crossLink}}. Currently supports iOS
	 * (and compatible browsers, such as modern Android browsers), and IE10/11. Supports both single touch and
	 * multi-touch modes. Extends the EaselJS {{#crossLink "MouseEvent"}}{{/crossLink}} model, but without support for
	 * double click or over/out events. See the MouseEvent {{#crossLink "MouseEvent/pointerId:property"}}{{/crossLink}}
	 * for more information.
	 * @method enable
	 * @param {Stage} stage The {{#crossLink "Stage"}}{{/crossLink}} to enable touch on.
	 * @param {Boolean} [singleTouch=false] If `true`, only a single touch will be active at a time.
	 * @param {Boolean} [allowDefault=false] If `true`, then default gesture actions (ex. scrolling, zooming) will be
	 * allowed when the user is interacting with the target canvas.
	 * @return {Boolean} Returns `true` if touch was successfully enabled on the target stage.
	 * @static
	 */
	static enable (stage, singleTouch = false, allowDefault = false) {
		if (!stage || !stage.canvas || !Touch.isSupported()) { return false; }
		if (stage.__touch) { return true; }

		// inject required properties on stage:
		stage.__touch = {pointers:{}, multitouch:!singleTouch, preventDefault:!allowDefault, count:0};

		// note that in the future we may need to disable the standard mouse event model before adding
		// these to prevent duplicate calls. It doesn't seem to be an issue with iOS devices though.
		if ('ontouchstart' in window) { Touch._IOS_enable(stage); }
		else if (window.navigator['msPointerEnabled'] || window.navigator["pointerEnabled"]) { Touch._IE_enable(stage); }
		return true;
	}

	/**
	 * Removes all listeners that were set up when calling `Touch.enable()` on a stage.
	 * @method disable
	 * @param {Stage} stage The {{#crossLink "Stage"}}{{/crossLink}} to disable touch on.
	 * @static
	 */
	static disable (stage) {
		if (!stage) { return; }
		if ('ontouchstart' in window) { Touch._IOS_disable(stage); }
		else if (window.navigator['msPointerEnabled'] || window.navigator["pointerEnabled"]) { Touch._IE_disable(stage); }

		delete stage.__touch;
	}


// private static methods:
	/**
	 * @method _IOS_enable
	 * @protected
	 * @param {Stage} stage
	 * @static
	 */
	static _IOS_enable (stage) {
		let canvas = stage.canvas;
		let f = stage.__touch.f = e => Touch._IOS_handleEvent(stage, e);
		canvas.addEventListener("touchstart", f, false);
		canvas.addEventListener("touchmove", f, false);
		canvas.addEventListener("touchend", f, false);
		canvas.addEventListener("touchcancel", f, false);
	}

	/**
	 * @method _IOS_disable
	 * @protected
	 * @param {Stage} stage
	 * @static
	 */
	static _IOS_disable (stage) {
		let canvas = stage.canvas;
		if (!canvas) { return; }
		let f = stage.__touch.f;
		canvas.removeEventListener("touchstart", f, false);
		canvas.removeEventListener("touchmove", f, false);
		canvas.removeEventListener("touchend", f, false);
		canvas.removeEventListener("touchcancel", f, false);
	}

	/**
	 * @method _IOS_handleEvent
	 * @param {Stage} stage
	 * @param {Object} e The event to handle
	 * @protected
	 * @static
	 */
	static _IOS_handleEvent (stage, e) {
		if (!stage) { return; }
		if (stage.__touch.preventDefault) { e.preventDefault&&e.preventDefault(); }
		let touches = e.changedTouches;
		let type = e.type;
		const l = touches.length;
		for (let touch of touches) {
			let id = touch.identifier;
			if (touch.target != stage.canvas) { continue; }

			if (type === "touchstart") {
				this._handleStart(stage, id, e, touch.pageX, touch.pageY);
			} else if (type === "touchmove") {
				this._handleMove(stage, id, e, touch.pageX, touch.pageY);
			} else if (type === "touchend" || type === "touchcancel") {
				this._handleEnd(stage, id, e);
			}
		}
	}

	/**
	 * @method _IE_enable
	 * @protected
	 * @param {Stage} stage
	 * @static
	 */
	static _IE_enable (stage) {
		let canvas = stage.canvas;
		let f = stage.__touch.f = e => Touch._IE_handleEvent(stage,e);

		if (window.navigator["pointerEnabled"] === undefined) {
			canvas.addEventListener("MSPointerDown", f, false);
			window.addEventListener("MSPointerMove", f, false);
			window.addEventListener("MSPointerUp", f, false);
			window.addEventListener("MSPointerCancel", f, false);
			if (stage.__touch.preventDefault) { canvas.style.msTouchAction = "none"; }
		} else {
			canvas.addEventListener("pointerdown", f, false);
			window.addEventListener("pointermove", f, false);
			window.addEventListener("pointerup", f, false);
			window.addEventListener("pointercancel", f, false);
			if (stage.__touch.preventDefault) { canvas.style.touchAction = "none"; }

		}
		stage.__touch.activeIDs = {};
	}

	/**
	 * @method _IE_disable
	 * @protected
	 * @param {Stage} stage
	 * @static
	 */
	static _IE_disable (stage) {
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

	/**
	 * @method _IE_handleEvent
	 * @param {Stage} stage
	 * @param {Object} e The event to handle.
	 * @protected
	 * @static
	 */
	static _IE_handleEvent (stage, e) {
		if (!stage) { return; }
		if (stage.__touch.preventDefault) { e.preventDefault && e.preventDefault(); }
		let type = e.type;
		let id = e.pointerId;
		let ids = stage.__touch.activeIDs;

		if (type === "MSPointerDown" || type === "pointerdown") {
			if (e.srcElement != stage.canvas) { return; }
			ids[id] = true;
			this._handleStart(stage, id, e, e.pageX, e.pageY);
		} else if (ids[id]) { // it's an id we're watching
			if (type === "MSPointerMove" || type === "pointermove") {
				this._handleMove(stage, id, e, e.pageX, e.pageY);
			} else if (type === "MSPointerUp" || type === "MSPointerCancel"
					|| type === "pointerup" || type === "pointercancel") {
				delete(ids[id]);
				this._handleEnd(stage, id, e);
			}
		}
	}

	/**
	 * @method _handleStart
	 * @param {Stage} stage
	 * @param {String|Number} id
	 * @param {Object} e
	 * @param {Number} x
	 * @param {Number} y
	 * @protected
	 */
	static _handleStart (stage, id, e, x, y) {
		let props = stage.__touch;
		if (!props.multitouch && props.count) { return; }
		let ids = props.pointers;
		if (ids[id]) { return; }
		ids[id] = true;
		props.count++;
		stage._handlePointerDown(id, e, x, y);
	}

	/**
	 * @method _handleMove
	 * @param {Stage} stage
	 * @param {String|Number} id
	 * @param {Object} e
	 * @param {Number} x
	 * @param {Number} y
	 * @protected
	 */
	static _handleMove (stage, id, e, x, y) {
		if (!stage.__touch.pointers[id]) { return; }
		stage._handlePointerMove(id, e, x, y);
	}

	/**
	 * @method _handleEnd
	 * @param {Stage} stage
	 * @param {String|Number} id
	 * @param {Object} e
	 * @protected
	 */
	static _handleEnd (stage, id, e) {
		// TODO: cancel should be handled differently for proper UI (ex. an up would trigger a click, a cancel would more closely resemble an out).
		let props = stage.__touch;
		let ids = props.pointers;
		if (!ids[id]) { return; }
		props.count--;
		stage._handlePointerUp(id, e, true);
		delete(ids[id]);
	}

}

/*
* @license SpriteSheetBuilder
* Visit http://createjs.com/ for documentation, updates and examples.
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

const _ERR_DIMENSIONS = "frame dimensions exceed max spritesheet dimensions";
const _ERR_RUNNING = "a build is already running";

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
 * @module EaselJS
 */
class SpriteSheetBuilder extends EventDispatcher {

// constructor:
	/**
	 * @constructor
	 * @param {Number} [framerate=0] The {{#crossLink "SpriteSheet/framerate:property"}}{{/crossLink}} of
	 * {{#crossLink "SpriteSheet"}}{{/crossLink}} instances that are created.
	 */
	constructor (framerate = 0) {
		super();

// public properties:
		/**
		 * The maximum width for the images (not individual frames) in the generated SpriteSheet. It is recommended to
		 * use a power of 2 for this value (ex. 1024, 2048, 4096). If the frames cannot all fit within the max
		 * dimensions, then additional images will be created as needed.
		 * @property maxWidth
		 * @type Number
		 * @default 2048
		*/
		this.maxWidth = 2048;

		/**
		 * The maximum height for the images (not individual frames) in the generated SpriteSheet. It is recommended to
		 * use a power of 2 for this value (ex. 1024, 2048, 4096). If the frames cannot all fit within the max
		 * dimensions, then additional images will be created as needed.
		 * @property maxHeight
		 * @type Number
		 * @default 2048
		 */
		this.maxHeight = 2048;

		/**
		 * The SpriteSheet that was generated. This will be null before a build is completed successfully.
		 * @property spriteSheet
		 * @type SpriteSheet
		 */
		this.spriteSheet = null;

		/**
		 * The scale to apply when drawing all frames to the SpriteSheet. This is multiplied against any scale specified
		 * in the addFrame call. This can be used, for example, to generate a SpriteSheet at run time that is tailored
		 * to the a specific device resolution (ex. tablet vs mobile).
		 * @property scale
		 * @type Number
		 * @default 1
		 */
		this.scale = 1;

		/**
		* The padding to use between frames. This is helpful to preserve antialiasing on drawn vector content.
		* @property padding
		* @type Number
		* @default 1
		*/
		this.padding = 1;

		/**
		 * A number from 0.01 to 0.99 that indicates what percentage of time the builder can use. This can be
		 * thought of as the number of seconds per second the builder will use. For example, with a timeSlice value of 0.3,
		 * the builder will run 20 times per second, using approximately 15ms per build (30% of available time, or 0.3s per second).
		 * Defaults to 0.3.
		 * @property timeSlice
		 * @type Number
		 * @default 0.3
		 */
		this.timeSlice = 0.3;

		/**
		 * A value between 0 and 1 that indicates the progress of a build, or -1 if a build has not
		 * been initiated.
		 * @property progress
		 * @type Number
		 * @default -1
		 * @readonly
		 */
		this.progress = -1;

		/**
		 * A {{#crossLink "SpriteSheet/framerate:property"}}{{/crossLink}} value that will be passed to new {{#crossLink "SpriteSheet"}}{{/crossLink}} instances that are
		 * created. If no framerate is specified (or it is 0), then SpriteSheets will use the {{#crossLink "Ticker"}}{{/crossLink}}
		 * framerate.
		 * @property framerate
		 * @type Number
		 * @default 0
		 */
		this.framerate = framerate;

// private properties:
		/**
		 * @property _frames
		 * @protected
		 * @type Array
		 */
		this._frames = [];

		/**
		 * @property _animations
		 * @protected
		 * @type Array
		 */
		this._animations = {};

		/**
		 * @property _data
		 * @protected
		 * @type Array
		 */
		this._data = null;

		/**
		 * @property _nextFrameIndex
		 * @protected
		 * @type Number
		 */
		this._nextFrameIndex = 0;

		/**
		 * @property _index
		 * @protected
		 * @type Number
		 */
		this._index = 0;

		/**
		 * @property _timerID
		 * @protected
		 * @type Number
		 */
		this._timerID = null;

		/**
		 * @property _scale
		 * @protected
		 * @type Number
		 */
		this._scale = 1;
	}

// constants:
	static get ERR_DIMENSIONS () { return _ERR_DIMENSIONS; }
	static get ERR_RUNNING () { return _ERR_RUNNING; }

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
	addFrame (source, sourceRect, scale = 1, setupFunction, setupData) {
		if (this._data) { throw SpriteSheetBuilder.ERR_RUNNING; }
		let rect = sourceRect||source.bounds||source.nominalBounds||(source.getBounds&&source.getBounds());
		if (!rect) { return null; }
		return this._frames.push({source, sourceRect:rect, scale, funct:setupFunction, data:setupData, index:this._frames.length, height:rect.height*scale})-1;
	}

	/**
	 * Adds an animation that will be included in the created {{#crossLink "SpriteSheet"}}{{/crossLink}}.
	 * @method addAnimation
	 * @param {String} name The name for the animation.
	 * @param {Array} frames An array of frame indexes that comprise the animation. Ex. [3,6,5] would describe an animation
	 * that played frame indexes 3, 6, and 5 in that order.
	 * @param {String} [next] Specifies the name of the animation to continue to after this animation ends. You can
	 * also pass false to have the animation stop when it ends. By default it will loop to the start of the same animation.
	 * @param {Number} [speed] Specifies a frame advance speed for this animation. For example, a value of 0.5 would
	 * cause the animation to advance every second tick. Note that earlier versions used `frequency` instead, which had
	 * the opposite effect.
	 */
	addAnimation (name, frames, next, speed) {
		if (this._data) { throw SpriteSheetBuilder.ERR_RUNNING; }
		this._animations[name] = {frames, next, speed};
	}

	/**
	 * This will take a {{#crossLink "MovieClip"}}{{/crossLink}} instance, and add its frames and labels to this
	 * builder. Labels will be added as an animation running from the label index to the next label. For example, if
	 * there is a label named "foo" at frame 0 and a label named "bar" at frame 10, in a MovieClip with 15 frames, it
	 * will add an animation named "foo" that runs from frame index 0 to 9, and an animation named "bar" that runs from
	 * frame index 10 to 14.
	 *
	 * Note that this will iterate through the full MovieClip with {{#crossLink "MovieClip/actionsEnabled:property"}}{{/crossLink}}
	 * set to `false`, ending on the last frame.
	 * @method addMovieClip
	 * @param {MovieClip} source The source MovieClip instance to add to the SpriteSheet.
	 * @param {Rectangle} [sourceRect] A {{#crossLink "Rectangle"}}{{/crossLink}} defining the portion of the source to
	 * draw to the frame. If not specified, it will look for a {{#crossLink "DisplayObject/getBounds"}}{{/crossLink}}
	 * method, `frameBounds` Array, `bounds` property, or `nominalBounds` property on the source to use. If one is not
	 * found, the MovieClip will be skipped.
	 * @param {Number} [scale=1] The scale to draw the movie clip at.
	 * @param {Function} [setupFunction] A function to call immediately before drawing each frame. It will be called
	 * with three parameters: the source, setupData, and the frame index.
	 * @param {Object} [setupData] Arbitrary setup data to pass to setupFunction as the second parameter.
	 * @param {Function} [labelFunction] This method will be called for each MovieClip label that is added with four
	 * parameters: the label name, the source MovieClip instance, the starting frame index (in the movieclip timeline)
	 * and the end index. It must return a new name for the label/animation, or `false` to exclude the label.
	 */
	addMovieClip (source, sourceRect, scale = 1, setupFunction, setupData, labelFunction) {
		if (this._data) { throw SpriteSheetBuilder.ERR_RUNNING; }
		let rects = source.frameBounds;
		let rect = sourceRect||source.bounds||source.nominalBounds||(source.getBounds&&source.getBounds());
		if (!rect && !rects) { return; }

		let baseFrameIndex = this._frames.length;
		const duration = source.timeline.duration;
		for (let i=0; i<duration; i++) {
			let r = (rects&&rects[i]) ? rects[i] : rect;
			this.addFrame(source, r, scale, this._setupMovieClipFrame, {i, f:setupFunction, d:setupData});
		}
		const labels = source.timeline._labels;
		let lbls = [];
		for (let n in labels) {
			lbls.push({index:labels[n], label:n});
		}
		if (lbls.length) {
			lbls.sort((a, b) => a.index-b.index);
			for (let i=0,l=lbls.length; i<l; i++) {
				let label = lbls[i].label;
				let start = baseFrameIndex+lbls[i].index;
				let end = baseFrameIndex+((i === l-1) ? duration : lbls[i+1].index);
				let frames = [];
				for (let i=start; i<end; i++) { frames.push(i); }
				if (labelFunction) {
					label = labelFunction(label, source, start, end);
					if (!label) { continue; }
				}
				this.addAnimation(label, frames, true); // for now, this loops all animations.
			}
		}
	}

	/**
	 * Builds a {{#crossLink "SpriteSheet"}}{{/crossLink}} instance based on the current frames.
	 * @method build
	 * @return {SpriteSheet} The created SpriteSheet instance, or null if a build is already running or an error
	 * occurred.
	 */
	build () {
		if (this._data) { throw SpriteSheetBuilder.ERR_RUNNING; }
		this._startBuild();
		while (this._drawNext()) {}
		this._endBuild();
		return this.spriteSheet;
	}

	/**
	 * Asynchronously builds a {{#crossLink "SpriteSheet"}}{{/crossLink}} instance based on the current frames. It will
	 * run 20 times per second, using an amount of time defined by `timeSlice`. When it is complete it will call the
	 * specified callback.
	 * @method buildAsync
	 * @param {Number} [timeSlice] Sets the timeSlice property on this instance.
	 */
	buildAsync (timeSlice) {
		if (this._data) { throw SpriteSheetBuilder.ERR_RUNNING; }
		this.timeSlice = timeSlice;
		this._startBuild();
		this._timerID = setTimeout(() => this._run(), 50-Math.max(0.01, Math.min(0.99, this.timeSlice||0.3))*50);
	}

	/**
	 * Stops the current asynchronous build.
	 * @method stopAsync
	 */
	stopAsync () {
		clearTimeout(this._timerID);
		this._data = null;
	}

	/**
	 * SpriteSheetBuilder instances cannot be cloned.
	 * @method clone
	 */
	clone () {
		throw "SpriteSheetBuilder cannot be cloned.";
	}

	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 */
	toString () {
		return `[${this.constructor.name}]`;
	}


// private methods:
	/**
	 * @method _startBuild
	 * @protected
	 */
	_startBuild () {
		let pad = this.padding||0;
		this.progress = 0;
		this.spriteSheet = null;
		this._index = 0;
		this._scale = this.scale;
		let dataFrames = [];
		this._data = {
			images: [],
			frames: dataFrames,
			framerate: this.framerate,
			animations: this._animations // TODO: should we "clone" _animations in case someone adds more animations after a build?
		};

		let frames = this._frames.slice();
		frames.sort((a, b) => (a.height<=b.height) ? -1 : 1);

		if (frames[frames.length-1].height+pad*2 > this.maxHeight) { throw SpriteSheetBuilder.ERR_DIMENSIONS; }
		let y=0, x=0;
		let img = 0;
		while (frames.length) {
			let o = this._fillRow(frames, y, img, dataFrames, pad);
			if (o.w > x) { x = o.w; }
			y += o.h;
			if (!o.h || !frames.length) {
				let canvas = createjs.createCanvas?createjs.createCanvas():document.createElement("canvas");
				canvas.width = this._getSize(x,this.maxWidth);
				canvas.height = this._getSize(y,this.maxHeight);
				this._data.images[img] = canvas;
				if (!o.h) {
					x=y=0;
					img++;
				}
			}
		}
	};

	/**
	 * @method _setupMovieClipFrame
	 * @protected
	 * @return {Number} The width & height of the row.
	 */
	_setupMovieClipFrame (source, data) {
		let ae = source.actionsEnabled;
		source.actionsEnabled = false;
		source.gotoAndStop(data.i);
		source.actionsEnabled = ae;
		data.f&&data.f(source, data.d, data.i);
	}

	/**
	 * @method _getSize
	 * @protected
	 * @return {Number} The width & height of the row.
	 */
	_getSize (size, max) {
		let pow = 4;
		while (Math.pow(2, ++pow) < size) {}
		return Math.min(max, Math.pow(2, pow));
	};

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
	_fillRow (frames, y, img, dataFrames, pad) {
		let w = this.maxWidth;
		let maxH = this.maxHeight;
		y += pad;
		let h = maxH-y;
		let x = pad;
		let height = 0;
		for (let i=frames.length-1; i>=0; i--) {
			let frame = frames[i];
			let sc = this._scale*frame.scale;
			let rect = frame.sourceRect;
			let source = frame.source;
			let rx = Math.floor(sc*rect.x-pad);
			let ry = Math.floor(sc*rect.y-pad);
			let rh = Math.ceil(sc*rect.height+pad*2);
			let rw = Math.ceil(sc*rect.width+pad*2);
			if (rw > w) { throw SpriteSheetBuilder.ERR_DIMENSIONS; }
			if (rh > h || x+rw > w) { continue; }
			frame.img = img;
			frame.rect = new Rectangle(x,y,rw,rh);
			height = height || rh;
			frames.splice(i,1);
			dataFrames[frame.index] = [x,y,rw,rh,img,Math.round(-rx+sc*source.regX-pad),Math.round(-ry+sc*source.regY-pad)];
			x += rw;
		}
		return {w:x, h:height};
	}

	/**
	 * @method _endBuild
	 * @protected
	 */
	_endBuild () {
		this.spriteSheet = new SpriteSheet(this._data);
		this._data = null;
		this.progress = 1;
		this.dispatchEvent("complete");
	}

	/**
	 * @method _run
	 * @protected
	 */
	_run () {
		let ts = Math.max(0.01, Math.min(0.99, this.timeSlice||0.3))*50;
		let t = (new Date()).getTime()+ts;
		let complete = false;
		while (t > (new Date()).getTime()) {
			if (!this._drawNext()) { complete = true; break; }
		}
		if (complete) {
			this._endBuild();
		} else {
			this._timerID = setTimeout(() => this._run(), 50-ts);
		}
		let p = this.progress = this._index/this._frames.length;
		if (this.hasEventListener("progress")) {
			let evt = new Event("progress");
			evt.progress = p;
			this.dispatchEvent(evt);
		}
	}

	/**
	 * @method _drawNext
	 * @protected
	 * @return Boolean Returns false if this is the last draw.
	 */
	_drawNext () {
		let frame = this._frames[this._index];
		let sc = frame.scale*this._scale;
		let rect = frame.rect;
		let sourceRect = frame.sourceRect;
		let canvas = this._data.images[frame.img];
		let ctx = canvas.getContext("2d");
		frame.funct&&frame.funct(frame.source, frame.data);
		ctx.save();
		ctx.beginPath();
		ctx.rect(rect.x, rect.y, rect.width, rect.height);
		ctx.clip();
		ctx.translate(Math.ceil(rect.x-sourceRect.x*sc), Math.ceil(rect.y-sourceRect.y*sc));
		ctx.scale(sc,sc);
		frame.source.draw(ctx); // display object will draw itself.
		ctx.restore();
		return (++this._index) < this._frames.length;
	}

}

// events:
/**
 * Dispatched when a build completes.
 * @event complete
 * @param {Object} target The object that dispatched the event.
 * @param {String} type The event type.
 * @since 0.6.0
 */

/**
 * Dispatched when an asynchronous build has progress.
 * @event progress
 * @param {Object} target The object that dispatched the event.
 * @param {String} type The event type.
 * @param {Number} progress The current progress value (0-1).
 * @since 0.6.0
 */

/*
* @license SpriteSheetUtils
* Visit http://createjs.com/ for documentation, updates and examples.
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

/**
 * The SpriteSheetUtils class is a collection of static methods for working with {{#crossLink "SpriteSheet"}}{{/crossLink}}s.
 * A sprite sheet is a series of images (usually animation frames) combined into a single image on a regular grid. For
 * example, an animation consisting of 8 100x100 images could be combined into a 400x200 sprite sheet (4 frames across
 * by 2 high). The SpriteSheetUtils class uses a static interface and should not be instantiated.
 * @class SpriteSheetUtils
 * @static
 * @module EaselJS
 */
class SpriteSheetUtils {

// constructor:
	/**
	 * @constructor
	 */
	constructor () {
		throw "SpriteSheetUtils cannot be instantiated";
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
	static extractFrame (spriteSheet, frameOrAnimation) {
		if (isNaN(frameOrAnimation)) {
			frameOrAnimation = spriteSheet.getAnimation(frameOrAnimation).frames[0];
		}
		let data = spriteSheet.getFrame(frameOrAnimation);
		if (!data) { return null; }
		let r = data.rect;
		let canvas = SpriteSheetUtils._workingCanvas;
		canvas.width = r.width;
		canvas.height = r.height;
		SpriteSheetUtils._workingContext.drawImage(data.image, r.x, r.y, r.width, r.height, 0, 0, r.width, r.height);
		let img = document.createElement("img");
		img.src = canvas.toDataURL("image/png");
		return img;
	}

	/**
	 * Merges the rgb channels of one image with the alpha channel of another. This can be used to combine a compressed
	 * JPEG image containing color data with a PNG32 monochromatic image containing alpha data. With certain types of
	 * images (those with detail that lend itself to JPEG compression) this can provide significant file size savings
	 * versus a single RGBA PNG32. This method is very fast (generally on the order of 1-2 ms to run).
	 * @method mergeAlpha
	 * @static
	 * @param {HTMLImageElement} rbgImage The image (or canvas) containing the RGB channels to use.
	 * @param {HTMLImageElement} alphaImage The image (or canvas) containing the alpha channel to use.
	 * @param {HTMLCanvasElement} [canvas] If specified, this canvas will be used and returned. If not, a new canvas will be created.
	 * @return {HTMLCanvasElement} A canvas with the combined image data. This can be used as a source for Bitmap or SpriteSheet.
	 * @deprecated Tools such as ImageAlpha generally provide better results. This will be moved to sandbox in the future.
	*/
	static mergeAlpha (rgbImage, alphaImage, canvas) {
		if (!canvas) { canvas = createjs && createjs.createCanvas?createjs.createCanvas():document.createElement("canvas"); }
		canvas.width = Math.max(alphaImage.width, rgbImage.width);
		canvas.height = Math.max(alphaImage.height, rgbImage.height);
		let ctx = canvas.getContext("2d");
		ctx.save();
		ctx.drawImage(rgbImage,0,0);
		ctx.globalCompositeOperation = "destination-in";
		ctx.drawImage(alphaImage,0,0);
		ctx.restore();
		return canvas;
	}


// private static methods:
	static _flip (spriteSheet, count, h, v) {
		let imgs = spriteSheet._images;
		let canvas = SpriteSheetUtils._workingCanvas;
		let ctx = SpriteSheetUtils._workingContext;
		const il = imgs.length/count;
		for (let i=0; i<il; i++) {
			let src = imgs[i];
			src.__tmp = i; // a bit hacky, but faster than doing indexOf below.
			ctx.setTransform(1,0,0,1,0,0);
			ctx.clearRect(0,0,canvas.width+1,canvas.height+1);
			canvas.width = src.width;
			canvas.height = src.height;
			ctx.setTransform(h?-1:1, 0, 0, v?-1:1, h?src.width:0, v?src.height:0);
			ctx.drawImage(src,0,0);
			let img = document.createElement("img");
			img.src = canvas.toDataURL("image/png");
			// work around a strange bug in Safari:
			img.width = src.width;
			img.height = src.height;
			imgs.push(img);
		}

		let frames = spriteSheet._frames;
		const fl = frames.length/count;
		for (let i=0; i<fl; i++) {
			let src = frames[i];
			let rect = src.rect.clone();
			let img = imgs[src.image.__tmp+il*count];

			let frame = {image:img,rect,regX:src.regX,regY:src.regY};
			if (h) {
				rect.x = img.width-rect.x-rect.width; // update rect
				frame.regX = rect.width-src.regX; // update registration point
			}
			if (v) {
				rect.y = img.height-rect.y-rect.height;  // update rect
				frame.regY = rect.height-src.regY; // update registration point
			}
			frames.push(frame);
		}

		let sfx = `_${h?"h":""}${v?"v":""}`;
		let names = spriteSheet._animations;
		let data = spriteSheet._data;
		const al = names.length/count;
		for (let i=0; i<al; i++) {
			let name = names[i];
			let src = data[name];
			let anim = {name:name+sfx,speed:src.speed,next:src.next,frames:[]};
			if (src.next) { anim.next += sfx; }
			let frames = src.frames;
			for (let i=0,l=frames.length;i<l;i++) {
				anim.frames.push(frames[i]+fl*count);
			}
			data[anim.name] = anim;
			names.push(anim.name);
		}
	}

}

// private static properties:
/**
 * @property _workingCanvas
 * @static
 * @type HTMLCanvasElement | Object
 * @protected
*/
/**
 * @property _workingContext
 * @static
 * @type CanvasRenderingContext2D
 * @protected
*/
{
	let canvas = (createjs && createjs.createCanvas?createjs.createCanvas():document.createElement("canvas"));
	if (canvas.getContext) {
		SpriteSheetUtils._workingCanvas = canvas;
		SpriteSheetUtils._workingContext = canvas.getContext("2d");
		canvas.width = canvas.height = 1;
	}
}

/*
 * @license WebGLInspector
 * Visit http://createjs.com/ for documentation, updates and examples.
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

let _alternateOutput = null;

/**
  * A utility and helper class designed to work with {{#crossLink "StageGL"}}{{/crossLink}} to help investigate and
  * test performance or display problems. It contains logging functions to analyze behaviour and performance testing
  * utilities.
  * @class WebGLInspector
  * @extends EventDispatcher
  * @module EaselJS
  */
class WebGLInspector extends EventDispatcher {

// constructor:
	/**
	 * @constructor
	 * @param {StageGL} stage The default stage to use when none is supplied.
	 */
	constructor (stage) {
		super();

// private properties:
		/**
		 * The internal reference to the default stage this Inspector is for.
		 * @property _stage
		 * @protected
		 * @type {StageGL}
		 */
		this._stage = stage;
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
	static get alternateOutput () { return _alternateOutput; }
	static set alternateOutput (alternateOutput) { _alternateOutput = alternateOutput; }

// static methods:
	/**
	 * Utility function for use with {{#crossLink "logDepth"))((/crossLink}}. Logs an item's position and registration.
	 * Useful to see if something is being forced off screen or has an integer position.
	 * @method dispProps
	 * @param {DisplayObject} item The item we're currently logging about.
	 * @param {String} [prepend=""] The string to show before the item, usually formatting for a tree view.
	 * @static
	 */
	static dispProps (item, prepend = "") {
		let p = `\tP: ${item.x.toFixed(2)}x${item.y.toFixed(2)}\t`;
		let r = `\tR: ${item.regX.toFixed(2)}x${item.regY.toFixed(2)}\t`;
		WebGLInspector._log(prepend, `${item.toString()}\t`, p, r);
	}

// private static methods:
	/**
	 * Log with alternateOutput if available, defaulting to the console.
	 * @method _log
	 * @param {...*} info The info to log.
	 * @static
	 */
	static _log (...info) {
		if (WebGLInspector.alternateOutput) {
			WebGLInspector.alternateOutput.log(...info);
		} else {
			console.log(...info);
		}
	}

// public methods:
	/**
	 * Perform all of the logging reports at once.
	 * @method log
	 * @param {StageGL} [stage=this._stage] The stage to log information for.
	 */
	log (stage) {
		if (!stage) { stage = this._stage; }
		WebGLInspector._log(`Batches Per Draw: ${(stage._batchID/stage._drawID).toFixed(4)}`);
		this.logContextInfo(stage._webGLContext);
		this.logDepth(stage.children, "");
		this.logTextureFill(stage);
	}

	/**
	 * Replace the stage's Draw command with an empty draw command. This is useful for testing performance, and ignoring
	 * rendering.
	 * @method toggleGPUDraw
	 * @param {StageGL} [stage=this._stage] The stage to log information for.
	 * @param {Boolean} [enabled] Force enabled. If left undefined, it will toggle.
	 */
	toggleGPUDraw (stage, enabled) {
		if (!stage) { stage = this._stage; }

		if (enabled === undefined) {
			enabled = !!stage._drawBuffers_;
		}

		if (enabled && stage._drawBuffers_) {
			stage._drawBuffers = stage._drawBuffers_;
			stage._drawBuffers_ = undefined;
		} else {
			stage._drawBuffers_ = stage._drawBuffers;
			stage._drawBuffers = function _inspectorDrawBuffers (gl) {
				if (this.vocalDebug) {
					WebGLInspector._log(`BlankDraw[${this._drawID}:${this._batchID}] : ${this.batchReason}`);
				}
			};
		}
	}

	/**
	 * Recursively walk the entire display tree, log the attached items, and display it in a tree view.
	 * @method logDepth
	 * @param {Array} [children=this._stage.children] The children array to walk through.
	 * @param {String} [prepend=""] What to prepend to this output from this point onwards.
	 * @param {Function} [logFunc=WebGLInspector._log] Custom logging function, mainly for filtering or formatting output.
	 */
	logDepth (children, prepend = "", logFunc = WebGLInspector._log) {
		if (!children) { children = this._stage.children; }
		const l = children.length;
		for (let i=0; i<l; i++) {
			let child = children[i];
			logFunc(`${prepend}-`, child);
			if (child.children && child.children.length) {
				this.logDepth(child.children, `|${prepend}`, logFunc);
			}
		}
	}

	/**
	 * Examine the context and provide information about its capabilities.
	 * @method logContextInfo
	 * @param {WebGLRenderingContext} [gl] The WebGL context to inspect.
	 */
	logContextInfo (gl) {
		if (!gl) { gl = this._stage._webGLContext; }
		let data = `
			== LOG:\n
			Max textures per draw: ${gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS)}\n
			Max textures active: ${gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS)}\n
			\n
			Max texture size: ${gl.getParameter(gl.MAX_TEXTURE_SIZE)/2}\n
			Max cache size: ${gl.getParameter(gl.MAX_RENDERBUFFER_SIZE)/2}\n
			\n
			Max attributes per vertex: ${gl.getParameter(gl.MAX_VERTEX_ATTRIBS)}\n
			WebGL Version string: ${gl.getParameter(gl.VERSION)}\n
			======
		`;
		WebGLInspector._log(data);
	}

	/**
	 * Simulate renders and watch what happens for textures moving around between draw calls. A texture moving between
	 * slots means it was removed and then re-added to draw calls. Performance may be better if it was allowed to stay
	 * in place.
	 * @method logTextureFill
	 * @param {StageGL} [stage=this._stage] The stage to log information for.
	 */
	logTextureFill (stage) {
		if (!stage) { stage = this._stage; }

		let dict = stage._textureDictionary;
		let count = stage._batchTextureCount;
		WebGLInspector._log(`${textureMax}: ${count}`);
		let output = [];
		for (let n in dict) {
			let str = n.replace(window.location.origin, "");
			let tex = dict[n];
			let shifted = tex._lastActiveIndex?tex._lastActiveIndex === tex._activeIndex:false;
			output.push({src, element:tex, shifted});
			tex._lastActiveIndex = tex._activeIndex;
		}

		output.sort((a,b) => {
			if (a.element._drawID === stage._drawID) { return 1; }
			if (a.element._drawID < b.element._drawID) { return -1; }
			return 0;
		});

		const l = output.length;
		for (let i=0; i<l; i++) {
			let out = output[i];
			let active = out.element._drawID === stage._drawID;
			WebGLInspector._log(`[${out.src}] ${active?"ACTIVE":"stale"} ${out.shifted?"steady":"DRIFT"}`, out.element);
		}
	}

}

/**
 * The EaselJS Javascript library provides a retained graphics mode for canvas including a full hierarchical display
 * list, a core interaction model, and helper classes to make working with 2D graphics in Canvas much easier.
 * EaselJS provides straight forward solutions for working with rich graphics and interactivity with HTML5 Canvas...
 *
 * <h4>Getting Started</h4>
 * To get started with Easel, create a {{#crossLink "Stage"}}{{/crossLink}} that wraps a CANVAS element, and add
 * {{#crossLink "DisplayObject"}}{{/crossLink}} instances as children. EaselJS supports:
 * <ul>
 *      <li>Images using {{#crossLink "Bitmap"}}{{/crossLink}}</li>
 *      <li>Vector graphics using {{#crossLink "Shape"}}{{/crossLink}} and {{#crossLink "Graphics"}}{{/crossLink}}</li>
 *      <li>Animated bitmaps using {{#crossLink "SpriteSheet"}}{{/crossLink}} and {{#crossLink "Sprite"}}{{/crossLink}}
 *      <li>Simple text instances using {{#crossLink "Text"}}{{/crossLink}}</li>
 *      <li>Containers that hold other DisplayObjects using {{#crossLink "Container"}}{{/crossLink}}</li>
 *      <li>Control HTML DOM elements using {{#crossLink "DOMElement"}}{{/crossLink}}</li>
 * </ul>
 *
 * All display objects can be added to the stage as children, or drawn to a canvas directly.
 *
 * <b>User Interactions</b><br />
 * All display objects on stage (except DOMElement) will dispatch events when interacted with using a mouse or
 * touch. EaselJS supports hover, press, and release events, as well as an easy-to-use drag-and-drop model. Check out
 * {{#crossLink "MouseEvent"}}{{/crossLink}} for more information.
 *
 * <h4>Simple Example</h4>
 * This example illustrates how to create and position a {{#crossLink "Shape"}}{{/crossLink}} on the {{#crossLink "Stage"}}{{/crossLink}}
 * using EaselJS' drawing API.
 *
 *	    //Create a stage by getting a reference to the canvas
 *	    stage = new createjs.Stage("demoCanvas");
 *	    //Create a Shape DisplayObject.
 *	    circle = new createjs.Shape();
 *	    circle.graphics.beginFill("red").drawCircle(0, 0, 40);
 *	    //Set position of Shape instance.
 *	    circle.x = circle.y = 50;
 *	    //Add Shape instance to stage display list.
 *	    stage.addChild(circle);
 *	    //Update stage will render next frame
 *	    stage.update();
 *
 * <b>Simple Interaction Example</b><br>
 *
 *      displayObject.addEventListener("click", handleClick);
 *      function handleClick(event){
 *          // Click happenened
 *      }
 *
 *      displayObject.addEventListener("mousedown", handlePress);
 *      function handlePress(event) {
 *          // A mouse press happened.
 *          // Listen for mouse move while the mouse is down:
 *          event.addEventListener("mousemove", handleMove);
 *      }
 *      function handleMove(event) {
 *          // Check out the DragAndDrop example in GitHub for more
 *      }
 *
 * <b>Simple Animation Example</b><br />
 * This example moves the shape created in the previous demo across the screen.
 *
 *	    //Update stage will render next frame
 *	    createjs.Ticker.addEventListener("tick", handleTick);
 *
 *	    function handleTick() {
 *          //Circle will move 10 units to the right.
 *	    	circle.x += 10;
 *	    	//Will cause the circle to wrap back
 * 	    	if (circle.x > stage.canvas.width) { circle.x = 0; }
 *	    	stage.update();
 *	    }
 *
 * <h4>Other Features</h4>
 * EaselJS also has built in support for
 * <ul><li>Canvas features such as {{#crossLink "Shadow"}}{{/crossLink}} and CompositeOperation</li>
 *      <li>{{#crossLink "Ticker"}}{{/crossLink}}, a global heartbeat that objects can subscribe to</li>
 *      <li>Filters, including a provided {{#crossLink "ColorMatrixFilter"}}{{/crossLink}}, {{#crossLink "AlphaMaskFilter"}}{{/crossLink}},
 *      {{#crossLink "AlphaMapFilter"}}{{/crossLink}}, and {{#crossLink "BlurFilter"}}{{/crossLink}}. See {{#crossLink "Filter"}}{{/crossLink}}
 *      for more information</li>
 *      <li>A {{#crossLink "ButtonHelper"}}{{/crossLink}} utility, to easily create interactive buttons</li>
 *      <li>{{#crossLink "SpriteSheetUtils"}}{{/crossLink}} and a {{#crossLink "SpriteSheetBuilder"}}{{/crossLink}} to
 *      help build and manage {{#crossLink "SpriteSheet"}}{{/crossLink}} functionality at run-time.</li>
 * </ul>
 *
 * <h4>Browser Support</h4>
 * All modern browsers that support Canvas will support EaselJS (<a href="http://caniuse.com/canvas">http://caniuse.com/canvas</a>).
 * Browser performance may vary between platforms, for example, Android Canvas has poor hardware support, and is much
 * slower on average than most other browsers.
 *
 * @main EaselJS
 */

/**
 * README: Export Order
 *
 * Due to some classes having circular import bindings (whether at the top of the import chain or deeper in),
 * some exports here are in reverse order (such as Container being exported before DisplayObject).
 * This is explained here: https://github.com/rollup/rollup/issues/845#issuecomment-240277194
 */

// re-export shared classes
// TODO: Review this version export.
// version (templated in gulpfile, pulled from package).
const version = "2.0.0";

export { version, EventDispatcher, Event, Ticker, StageGL, Stage, Container, DisplayObject, Bitmap, BitmapText, DOMElement, Graphics, Arc, ArcTo, BeginPath, BezierCurveTo, Circle, ClosePath, Ellipse, Fill, LineTo, MoveTo, PolyStar, QuadraticCurveTo, Rect, RoundRect, Stroke, StrokeDash, StrokeStyle, MovieClip, Shadow$1 as Shadow, Shape, Sprite, SpriteSheet, Text, MouseEvent, AlphaMapFilter, AlphaMaskFilter, BitmapCache, BlurFilter, ColorFilter, ColorMatrix, ColorMatrixFilter, Filter, DisplayProps, Matrix2D, Point, Rectangle, ButtonHelper, Touch, SpriteSheetBuilder, SpriteSheetUtils, UID, WebGLInspector };

//# sourceMappingURL=easeljs-2.0.0.es6.map
