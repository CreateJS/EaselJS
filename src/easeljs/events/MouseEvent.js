/*
* MouseEvent
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
 * This is passed as the parameter to onPress, onMouseMove, onMouseUp, onMouseDown, onMouseOver, onMouseOut and onClick
 * handlers on DisplayObject instances.
 * @class MouseEvent
 * @constructor
 * @param {String} type The event type.
 * @param {Number} stageX The normalized x position relative to the stage.
 * @param {Number} stageY The normalized y position relative to the stage.
 * @param {DisplayObject} target The display object this event relates to.
 * @param {MouseEvent} nativeEvent The native DOM event related to this mouse event.
 * @param {Number} pointerID The unique id for the pointer.
 * @param {Boolean} primary Indicates whether this is the primary pointer in a multitouch environment.
 * @param {Number} rawX The raw x position relative to the stage.
 * @param {Number} rawY The raw y position relative to the stage.
 **/
var MouseEvent = function(type, stageX, stageY, target, nativeEvent, pointerID, primary, rawX, rawY) {
  this.initialize(type, stageX, stageY, target, nativeEvent, pointerID, primary, rawX, rawY);
}
var p = MouseEvent.prototype = new createjs.NativeEvent();

// public properties:
	/**
	 * The normalized x position on the stage. This will always be within the range 0 to stage width.
	 * @property stageX
	 * @type Number
	 **/
	p.stageX = 0;

	/**
	 * The normalized y position on the stage. This will always be within the range 0 to stage height.
	 * @property stageY
	 * @type Number
	 **/
	p.stageY = 0;
	
	/**
	 * The raw x position relative to the stage. Normally this will be the same as the stageX value, unless
	 * stage.mouseMoveOutside is true and the pointer is outside of the stage bounds.
	 * @property rawX
	 * @type Number
	 **/
	p.rawX = 0;

	/**
	 * The raw y position relative to the stage. Normally this will be the same as the stageY value, unless
	 * stage.mouseMoveOutside is true and the pointer is outside of the stage bounds.
	 * @property rawY
	 * @type Number
	 **/
	p.rawY = 0;

	/**
	 * The unique id for the pointer (touch point or cursor). This will be either -1 for the mouse, or the system
	 * supplied id value.
	 * @property pointerID
	 * @type {Number}
	 **/
	p.pointerID = 0;

	/**
	 * Indicates whether this is the primary pointer in a multitouch environment. This will always be true for the mouse.
	 * For touch pointers, the first pointer in the current stack will be considered the primary pointer.
	 * @property primaryPointer
	 * @type {Boolean}
	 **/
	p.primary = false;

	/**
	 * @property CLICK
	 * @static
	 * @type String
	 **/
	s.CLICK = "click";

	/**
	 * @property DOUBLE_CLICK
	 * @static
	 * @type String
	 **/
	s.DOUBLE_CLICK = "doubleClick";

	/**
	 * @property MOUSE_DOWN
	 * @static
	 * @type String
	 **/
	s.MOUSE_DOWN = "mouseDown";

	/**
	 * @property MOUSE_UP
	 * @static
	 * @type String
	 **/
	s.MOUSE_UP = "mouseUp";

	/**
	 * @property MOUSE_MOVE
	 * @static
	 * @type String
	 **/
	s.MOUSE_MOVE = "mouseMove";

	/**
	 * @property ROLL_OVER
	 * @static
	 * @type String
	 **/
	s.ROLL_OVER = "rollOver";

	/**
	 * @property ROLL_OUT
	 * @static
	 * @type String
	 **/
	s.ROLL_OUT = "rollOut";

	/**
	 * @property MOUSE_WHEEL
	 * @static
	 * @type String
	 **/
	s.MOUSE_WHEEL = "mouseWheel";

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
	p.initialize = function(type, stageX, stageY, nativeEvent, pointerID, primary, rawX, rawY) {
		this.NativeEvent_initialize(type, nativeEvent);
		this.stageX = stageX;
		this.stageY = stageY;
		this.pointerID = pointerID;
		this.primary = primary;
		this.rawX = (rawX==null)?stageX:rawX;
		this.rawY = (rawY==null)?stageY:rawY;
	}

// public methods:
	/**
	 * Returns a clone of the MouseEvent instance.
	 * @method clone
	 * @return {MouseEvent} a clone of the MouseEvent instance.
	 **/
	p.clone = function() {
		return new createjs.MouseEvent(this.type, this.stageX, this.stageY, this.nativeEvent, this.pointerID, this.primary, this.rawX, this.rawY);
	}

	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 **/
	p.toString = function() {
		return "[MouseEvent (type="+this.type+" stageX="+this.stageX+" stageY="+this.stageY+")]";
	}

createjs.MouseEvent = MouseEvent;
}());