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
 * @param {String | Number} overLabel Optional. The label name or frame number to display when the user mouses out of the target. Defaults to "over".
 * @param {String | Number} outLabel Optional. The label name or frame number to display when the user mouses over the target. Defaults to "out".
 * @param {Boolean} play Optional. If true, then ButtonHelper will call gotoAndPlay, if false, it will use gotoAndStop. Default is false.
 * @param {DisplayObject} hitArea Optional. If specified, this sets the hitArea property on the target.
 * @param {String | Number} hitLabel Optional. If specified, this will set actionsEnabled to false and advance the hitArea to the specified label or frame number. Equivalent to calling hitArea.gotoAndStop(hitLabel).
 **/
var ButtonHelper = function(target, overLabel, outLabel, play, hitArea, hitLabel) {
	this.initialize(target, overLabel, outLabel, play, hitArea, hitLabel);
}
var p = ButtonHelper.prototype;

// public properties:
	/**
	 * TODO
	 * @property target
	 * @type MovieClip | BitmapAnimation
	 **/
	p.target = null;
	
	/**
	 * TODO
	 * @property overLabel
	 * @type String | Number
	 **/
	p.overLabel = null;
	
	/**
	 * TODO
	 * @property play
	 * @type Boolean
	 **/
	p.play = false;
	
	/**
	 * TODO
	 * @property outLabel
	 * @type String | Number
	 **/
	p.outLabel = null;
	
// constructor:
	/** 
	 * Initialization method.
	 * @method initialize
	 * @protected
	 **/
	p.initialize = function(target, overLabel, outLabel, play, hitArea, hitLabel) {
		this.target = target;
		this.overLabel = overLabel == null ? "over" : overLabel;
		this.outLabel = outLabel == null ? "out" : outLabel;
		this.play = play;
		target.cursor = "pointer";
		this.setEnabled(true);
		this._handleEvt({});
		if (hitArea) {
			if (hitLabel) {
				hitArea.actionsEnabled = false;
				hitArea.gotoAndStop(hitLabel);
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
		var _this = this;
		if (o.addEventListener) {
			var f = _this._handleEvt;
			if (value) {
				o.addEventListener("mouseOver", f, _this);
				o.addEventListener("mouseOut", f, _this);
			} else {
				o.removeEventListener("mouseOver", f, _this);
				o.removeEventListener("mouseOut", f, _this);
			}
		} else {
			o.onMouseOver = o.onMouseOut = value ? function(e) { _this._handleEvt(e); } : null;
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
	 * @method _handleEvt
	 * @protected
	 **/
	p._handleEvt = function(evt) {
		var label = evt.type == "mouseOver" ? this.overLabel : this.outLabel;
		if (this.play) {
			this.target.gotoAndPlay(label);
		} else {
			this.target.gotoAndStop(label);
		}
	};

createjs.ButtonHelper = ButtonHelper;
}());