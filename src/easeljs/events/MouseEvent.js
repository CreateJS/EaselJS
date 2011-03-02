/*
* MouseEvent by Grant Skinner. Dec 5, 2010
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

/**
* This is passed as the parameter to onPress, onMouseMove, onMouseUp, onMouseDown, and onClick handlers on 
* DisplayObject instances.
* By default, mouse events are disabled for performance reasons. In order to enabled them for a specified stage
* set mouseEventsEnabled to true on your stage instance.
* @class MouseEvent
* @constructor
* @param {String} type The event type.
* @param {Number} stageX The mouseX position relative to the stage.
* @param {Number} stageY The mouseY position relative to the stage.
**/
MouseEvent = function(type, stageX, stageY) {
  this.initialize(type, stageX, stageY);
}
var p = MouseEvent.prototype;
	
// public properties:

	/**
	* The mouseX position on the stage.
	* @property stageX
	* @type Number
	*/
	p.stageX = 0;
	
	/**
	* The mouseY position on the stage.
	* @property stageY
	* @type Number
	**/
	p.stageY = 0;
	
	/**
	* The type of mouse event. This will be the same as the handler it maps to (onPress, 
	* onMouseDown, onMouseUp, onMouseMove, or onClick).
	* @property type
	* @type String
	**/
	p.type = null;
	
	/**
	* For events of type "onPress" and "onMouseDown" only you can assign a handler to the onMouseMove 
	* property. This handler will be called every time the mouse is moved until the mouse is released. 
	* This is useful for operations such as drag and drop.
	* @event onMouseMove
	* @param {MouseEvent} event A MouseEvent instance with information about the current mouse event.
	**/
	p.onMouseMove = null;
	
	/**
	* For events of type "onPress" and "onMouseDown" only you can assign a handler to the onMouseUp 
	* property. This handler will be called every time the mouse is moved until the mouse is released. 
	* This is useful for operations such as drag and drop.
	* @event onMouseUp
	* @param {MouseEvent} event A MouseEvent instance with information about the current mouse event.
	*/
	p.onMouseUp = null;
	
// constructor:
	/** 
	* Initialization method.
	* @method initialize
	* @protected
	**/
	p.initialize = function(type, stageX, stageY) {
		this.type = type;
		this.stageX = stageX;
		this.stageY = stageY;
	}
	
// public methods:
	/**
	* Returns a clone of the MouseEvent instance.
	* @method clone
	* @return {MouseEvent} a clone of the MouseEvent instance.
	**/
	p.clone = function() {
		return new MouseEvent(this.type, this.stageX, this.stageY);
	}

	/**
	* Returns a string representation of this object.
	* @method toString
	* @return {String} a string representation of the instance.
	**/
	p.toString = function() {
		return "[MouseEvent (type="+this.type+" stageX="+this.stageX+" stageY="+this.stageY+")]";
	}
	
window.MouseEvent = MouseEvent;
}(window));