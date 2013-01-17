/*
* Shape
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
 * A Shape allows you to display vector art in the display list. It composites a Graphics instance which exposes all of the vector
 * drawing methods. The Graphics instance can be shared between multiple Shape instances to display the same vector graphics with different
 * positions or transforms. If the vector art will not change between draws, you may want to use the cache() method to reduce the rendering cost.
 * @class ButtonHelper
 * @constructor
 * @param {MovieClip | BitmapAnimation} target The MovieClip or BitmapAnimation to add button functionality to.
 * @param {String | Number} outLabel Optional. The label name or frame number to display when the user mouses over the target. Defaults to "out".
 * @param {String | Number} overLabel Optional. The label name or frame number to display when the user mouses out of the target. Defaults to "over".
 * @param {String | Number} downLabel Optional. The label name or frame number to display when the user presses on the target. Defaults to "down".
 * @param {Boolean} play Optional. If true, then ButtonHelper will call gotoAndPlay, if false, it will use gotoAndStop. Default is false.
 * @param {DisplayObject} hitArea Optional. If specified, this sets the hitArea property on the target.
 * @param {String | Number} hitLabel Optional. If specified, this will set actionsEnabled to false and advance the hitArea to the specified label or frame number. Equivalent to calling hitArea.gotoAndStop(hitLabel).
 **/
var ButtonHelper = function(target, outLabel, overLabel, downLabel, play, hitArea, hitLabel) {
	this.initialize(target, outLabel, overLabel, downLabel, play, hitArea, hitLabel);
}
var p = ButtonHelper.prototype;

// public properties:
	/**
	 * Read-only. The target for this button helper.
	 * @property target
	 * @type MovieClip | BitmapAnimation
	 **/
	p.target = null;
	
	/**
	 * The label name or frame number to display when the user mouses out of the target. Defaults to "over".
	 * @property overLabel
	 * @type String | Number
	 **/
	p.overLabel = null;
	
	/**
	 * The label name or frame number to display when the user mouses over the target. Defaults to "out".
	 * @property outLabel
	 * @type String | Number
	 **/
	p.outLabel = null;
	
	/**
	 * The label name or frame number to display when the user presses on the target. Defaults to "down".
	 * @property downLabel
	 * @type String | Number
	 **/
	p.downLabel = null;
	
	/**
	 * If true, then ButtonHelper will call gotoAndPlay, if false, it will use gotoAndStop. Default is false.
	 * @property play
	 * @default false
	 * @type Boolean
	 **/
	p.play = false;
	
//  private properties
	/**
	 * @property _isPressed
	 * @type Boolean
	 * @protected
	 **/
	p._isPressed = false;
	
// constructor:
	/** 
	 * Initialization method.
	 * @method initialize
	 * @protected
	 **/
	p.initialize = function(target, outLabel, overLabel, downLabel, play, hitArea, hitLabel) {
		if (!target.addEventListener) { return; }
		this.target = target;
		target.cursor = "pointer";
		this.overLabel = overLabel == null ? "over" : overLabel;
		this.outLabel = outLabel == null ? "out" : outLabel;
		this.downLabel = downLabel == null ? "down" : downLabel;
		this.play = play;
		this.setEnabled(true);
		this.handleEvent({});
		if (hitArea) {
			if (hitLabel) {
				hitArea.actionsEnabled = false;
				hitArea.gotoAndStop&&hitArea.gotoAndStop(hitLabel);
			}
			target.hitArea = hitArea;
		}
	};
	
// public methods:
	/** 
	 * Enables or disables the button functionality on the target.
	 * @method setEnabled
	 * @param {Boolean} value
	 **/
	p.setEnabled = function(value) {
		var o = this.target;
		if (value) {
			o.addEventListener("mouseover", this);
			o.addEventListener("mouseout", this);
			o.addEventListener("mousedown", this);
			o.addEventListener("click", this);
		} else {
			o.removeEventListener("mouseover", this);
			o.removeEventListener("mouseout", this);
			o.removeEventListener("mousedown", this);
			o.removeEventListener("click", this);
		}
	};
		
	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 **/
	p.toString = function() {
		return "[ButtonHelper]";
	};
	
	
// protected methods:
	/**
	 * @method handleEvent
	 * @protected
	 **/
	p.handleEvent = function(evt) {
		var label = (evt.type == "mouseover" && !this._isPressed) || evt.type == "click" ? this.overLabel :
				  		(evt.type == "mouseover" && this._isPressed) || evt.type == "mousedown" ? this.downLabel :
						(this._isPressed) ? this.overLabel : this.outLabel;
		
		if (evt.type == "mousedown") {
			this._isPressed = true;
			evt.addEventListener("mouseup", this);
		} else if (evt.type == "mouseup") {
			this._isPressed = false;
			return;
		}
		
		var t = this.target;
		if (this.play) {
			t.gotoAndPlay&&t.gotoAndPlay(label);
		} else {
			t.gotoAndStop&&t.gotoAndStop(label);
		}
	};

createjs.ButtonHelper = ButtonHelper;
}());