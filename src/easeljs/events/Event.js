/*
* Event
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
 * The base class of all events. This is the class you want to extend in order to create your own custom events.
 * @class Event
 * @constructor
 * @param {String} type
 **/
var Event = function(type) {
	this.initialize(type);
}
var p = Event.prototype = new createjs.EventDispatcher();
var s = Event;

// public properties:
	/**
	 * The display object this event relates to.
	 * @property target
	 * @type DisplayObject
	 * @default null
	 **/
	p.target = null;

	/**
	 * The type of mouse event. This will be the same as the handler it maps to.
	 * @property type
	 * @type String
	 **/
	p.type = null;

	/** 
	 * @property ALL
	 * @static
	 * @type String
	 **/
	s.ALL = "all";

	/**
	 * @property ADDED_TO_STAGE
	 * @static
	 * @type String
	 **/
	s.ADDED_TO_STAGE = "addedToStage";

	/**
	 * @property REMOVED_FROM_STAGE
	 * @static
	 * @type String
	 **/
	s.REMOVED_FROM_STAGE = "removedFromStage";

	/**
	 * @property ENTER_FRAME
	 * @static
	 * @type String
	 **/
	s.ENTER_FRAME = "enterFrame";

	/**
	 * @property EXIT_FRAME
	 * @static
	 * @type String
	 **/
	s.EXIT_FRAME = "exitFrame";

// constructor:
	/**
	 * @property EventDispatcher_initialize
	 * @type Function
	 * @private
	 **/
	p.EventDispatcher_initialize = p.initialize;

	/**
	 * Initialization method.
	 * @method initialize
	 * @protected
	 **/
	p.initialize = function(type) {
		this.EventDispatcher_initialize();
		this.type = type;
	}

// public methods:
	/**
	 * @method clone
	 * @return {Event}
	 **/
	p.clone = function() {
		return new createjs.Event(this.type);
	}

	/**
	 * @method toString
	 * @return {String}
	 **/
	p.toString = function() {
		return "[Event (type="+this.type+")]";
	}

createjs.Event = Event;
}());