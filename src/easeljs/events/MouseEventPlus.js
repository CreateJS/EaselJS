/*
* MouseEventPlus by Grant Skinner. Dec 5, 2010
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
 **/

goog.provide('MouseEventPlus');

/**
 * This is passed as the parameter to onPress, onMouseMove, onMouseUp, onMouseDown, and onClick handlers on
 * DisplayObject instances.
 * By default, mouse events are disabled for performance reasons. In order to enabled them for a specified stage
 * set mouseEventsEnabled to true on your stage instance.
 * @class MouseEventPlus
 * @constructor
 * @param {string} type The event type.
 * @param {number} stageX The mouseX position relative to the stage.
 * @param {number} stageY The mouseY position relative to the stage.
 **/
MouseEventPlus = function(type, stageX, stageY) {
  this.initialize(type, stageX, stageY);
};

// public properties:
/**
 * The mouseX position on the stage.
 * @property stageX
 * @type {number}
 */
MouseEventPlus.prototype.stageX = 0;

/**
 * The mouseY position on the stage.
 * @property stageY
 * @type {number}
 **/
MouseEventPlus.prototype.stageY = 0;

/**
 * The type of mouse event. This will be the same as the handler it maps to (onPress,
 * onMouseDown, onMouseUp, onMouseMove, or onClick).
 * @property type
 * @type {string}
 **/
MouseEventPlus.prototype.type = null;

/**
 * For events of type "onPress" and "onMouseDown" only you can assign a handler to the onMouseMove
 * property. This handler will be called every time the mouse is moved until the mouse is released.
 * This is useful for operations such as drag and drop.
 * @event onMouseMove
 * @param {MouseEventPlus} event A MouseEventPlus instance with information about the current mouse event.
 **/
MouseEventPlus.prototype.onMouseMove = null;

/**
 * For events of type "onPress" and "onMouseDown" only you can assign a handler to the onMouseUp
 * property. This handler will be called every time the mouse is moved until the mouse is released.
 * This is useful for operations such as drag and drop.
 * @event onMouseUp
 * @param {MouseEventPlus} event A MouseEventPlus instance with information about the current mouse event.
 */
MouseEventPlus.prototype.onMouseUp = null;

// constructor:
/**
 * Initialization method.
 * @protected
 **/
MouseEventPlus.prototype.initialize = function(type, stageX, stageY) {
  this.type = type;
  this.stageX = stageX;
  this.stageY = stageY;
};

// public methods:
/**
 * Returns a string representation of this object.
 * @return {string} a string representation of the instance.
 **/
MouseEventPlus.prototype.clone = function() {
  return new MouseEventPlus(this.type, this.stageX, this.stageY);
};

/**
 * Returns a string representation of this object.
 **/
MouseEventPlus.prototype.toString = function() {
  return "[MouseEventPlus (type=" + this.type + " stageX=" + this.stageX + " stageY=" + this.stageY + ")]";
};
