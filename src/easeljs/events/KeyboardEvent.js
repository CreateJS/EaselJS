/*
* KeyboardEvent
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
 * KeyboardEvent is the event type that is passed down to event handlers for keyUp and keyDown event types.
 * @class KeyboardEvent
 * @extends NativeEvent
 * @constructor
 * @param {String} type
 * @param {Number} keyCode
 * @param {Number} charCode
 * @param {KeyboardEvent} nativeEvent The native DOM event related to this keyboard event.
 * @param {Boolean} ctrlKey
 * @param {Boolean} altKey
 * @param {Boolean} shiftKey
 **/
var KeyboardEvent = function(type, keyCode, charCode, nativeEvent, ctrlKey, altKey, shiftKey) {
	this.initialize(type, keyCode, charCode, nativeEvent, ctrlKey, altKey, shiftKey);
}
var p = KeyboardEvent.prototype = new createjs.NativeEvent();
var s = KeyboardEvent;

// public properties:
	/**
	 * @property keyCode
	 * @type {Number}
	 **/
	p.keyCode = 0;

	/**
	 * @property charCode
	 * @type {Number}
	 **/
	p.charCode = 0;

	/**
	 * @property altKey
	 * @type Boolean
	 **/
	p.altKey = false;

	/**
	 * @property ctrlKey
	 * @type Boolean
	 **/
	p.ctrlKey = false;

	/**
	 * @property shiftKey
	 * @type Boolean
	 **/
	p.shiftKey = false;

	/**
	 * @property KEY_DOWN
	 * @static
	 * @type String
	 **/
	s.KEY_DOWN = "keyDown";

	/**
	 * @property KEY_UP
	 * @static
	 * @type String
	 **/
	s.KEY_UP = "keyUp";

// constructor:
	/**
	 * @property NativeEvent_initialize
	 * @type Function
	 * @private
	 **/
	p.NativeEvent_initialize = p.initialize;

	/**
	 * Initialization method.
	 * @method initialize
	 * @protected
	 **/
	p.initialize = function(type, keyCode, charCode, nativeEvent, ctrlKey, altKey, shiftKey) {
		this.NativeEvent_initialize(type, nativeEvent);
		this.keyCode = keyCode;
		this.charCode = charCode;
		this.ctrlKey = ctrlKey;
		this.altKey = altKey;
		this.shiftKey = shiftKey;
	}

// public methods:
	/**
	 * @method clone
	 * @return {KeyboardEvent}
	 **/
	p.clone = function() {
		return new createjs.KeyboardEvent(this.type, this.keyCode, this.charCode, this.nativeEvent, this.ctrlKey, this.altKey, this.shiftKey);
	}

	/**
	 * @method toString
	 * @return {String}
	 **/
	p.toString = function() {
		return "[KeyboardEvent (type="+this.type+" keyCode="+this.keyCode+")]";
	}

createjs.KeyboardEvent = KeyboardEvent;
}());