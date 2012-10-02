/*
* NativeEvent
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
 * NativeEvent specifies an event type which has a corresponding DOM alternative. This mostly concerns MouseEvent and KeyboardEvent.
 * @class NativeEvent
 * @extends Event
 * @constructor
 * @param {String} type
 **/
var NativeEvent = function(type, nativeEvent) {
	this.initialize(type, nativeEvent);
}
var p = NativeEvent.prototype = new createjs.Event();

// public properties:
	/**
	 * @property nativeEvent
	 * @type Object
	 **/
	p.nativeEvent = null;

// constructor:
	/**
	 * @property Event_initialize
	 * @type Function
	 * @private
	 **/
	p.Event_initialize = p.initialize;

	/**
	 * Initialization method.
	 * @method initialize
	 * @protected
	 **/
	p.initialize = function(type, nativeEvent) {
		this.Event_initialize(type);
		this.nativeEvent = nativeEvent;
	}

// public methods:
	/**
	 * @method clone
	 * @return {NativeEvent}
	 **/
	p.clone = function() {
		return new createjs.NativeEvent(this.type, this.nativeEvent);
	}

	/**
	 * @method toString
	 * @return {String}
	 **/
	p.toString = function() {
		return "[NativeEvent (type="+this.type+")]";
	}

createjs.NativeEvent = NativeEvent;
}());