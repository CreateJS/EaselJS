/**
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
**/

(function(window) {

/**
* Constructs a new MouseEvent instance.
* @param type The event type.
* @param stageX The mouseX position relative to the stage.
* @param stageY The mouseY position relative to the stage.
* @class This is passed as the parameter to onPress, onMouseMove, onMouseUp, onMouseDown, and onClick handlers on 
* DisplayObject instances.
* By default, mouse events are disabled for performance reasons. In order to enabled them for a specified stage
* set mouseEventsEnabled to true on your stage instance.
* @see Stage#mouseEventsEnabled
**/
MouseEvent = function(type, stageX, stageY) {
  this.initialize(type, stageX, stageY);
}
	
// public properties:
	/** The mouseX position on the stage. */
	MouseEvent.prototype.stageX = 0;
	/** The mouseY position on the stage. */
	MouseEvent.prototype.stageY = 0;
	/** The type of mouse event. This will be the same as the handler it maps to (onPress, onMouseDown, 
		onMouseUp, onMouseMove, or onClick). 
	**/
	MouseEvent.prototype.type = null;
	/** For events of type "onPress" and "onMouseDown" only you can assign a handler to the onMouseMove 
		property. This handler will be called every time the mouse is moved until the mouse is released. 
		This is useful for operations like drag and drop. 
	**/
	MouseEvent.prototype.onMouseMove = null;
	/** For events of type "onPress" and "onMouseDown" only you can assign a handler to the onMouseUp property. 
		This handler will be called a single time when the mouse is released anywhere over the page. This is useful for operations 
		like drag and drop. 
	**/
	MouseEvent.prototype.onMouseUp = null;
	
// constructor:
	/** @ignore */
	MouseEvent.prototype.initialize = function(type, stageX, stageY) {
		this.type = type;
		this.stageX = stageX;
		this.stageY = stageY;
	}
	
// public methods:
	/**
	* Returns a clone of the MouseEvent instance.
	**/
	MouseEvent.prototype.clone = function() {
		return new MouseEvent(this.type, this.stageX, this.stageY);
	}

	/**
	* Returns a string representation of this object.
	**/
	MouseEvent.prototype.toString = function() {
		return "[MouseEvent (type="+this.type+" stageX="+this.stageX+" stageY="+this.stageY+")]";
	}
	
window.MouseEvent = MouseEvent;
}(window));