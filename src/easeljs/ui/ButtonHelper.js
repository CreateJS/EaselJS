/*
* ButtonHelper
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
 * @module EaselJS
 */

// namespace:
this.createjs = this.createjs||{};

(function() {
	"use strict";

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
 * @constructor
 */
var ButtonHelper = function(target, outLabel, overLabel, downLabel, play, hitArea, hitLabel) {
	this.initialize(target, outLabel, overLabel, downLabel, play, hitArea, hitLabel);
};
var p = ButtonHelper.prototype;

// public properties:
	/**
	 * The target for this button helper.
	 * @property target
	 * @type MovieClip | Sprite
	 * @readonly
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
	
// getter / setters:
	
	/**
	 * Enables or disables the button functionality on the target.
	 * @property enabled
	 * @type {Boolean}
	 **/
	/**
	 * Enables or disables the button functionality on the target.
	 * @deprecated in favour of the enabled property.
	 * @method setEnabled
	 * @param {Boolean} value
	 **/
	p.setEnabled = function(value) { // TODO: deprecated.
		var o = this.target;
		this._enabled = value;
		if (value) {
			o.cursor = "pointer";
			o.addEventListener("rollover", this);
			o.addEventListener("rollout", this);
			o.addEventListener("mousedown", this);
			o.addEventListener("pressup", this);
		} else {
			o.cursor = null;
			o.removeEventListener("rollover", this);
			o.removeEventListener("rollout", this);
			o.removeEventListener("mousedown", this);
			o.removeEventListener("pressup", this);
		}
	};
	/**
	 * Returns enabled state of this instance.
	 * @deprecated in favour of the enabled property.
	 * @method getEnabled
	 * @return {Boolean} The last value passed to setEnabled().
	 **/
	p.getEnabled = function() {
		return this._enabled;
	};

	try {
		Object.defineProperties(p, {
			enabled: { get: p.getEnabled, set: p.setEnabled }
		});
	} catch (e) {} // TODO: use Log

//  private properties
	/**
	 * @property _isPressed
	 * @type Boolean
	 * @protected
	 **/
	p._isPressed = false;

	/**
	 * @property _isOver
	 * @type Boolean
	 * @protected
	 **/
	p._isOver = false;

	/**
	 * @property _enabled
	 * @type Boolean
	 * @protected
	 **/
	p._enabled = false;

// constructor:
	/**
	 * Initialization method.
	 * @method initialize
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
	 * null, then the default state of the hitArea will be used.
	 * @protected
	 **/
	p.initialize = function(target, outLabel, overLabel, downLabel, play, hitArea, hitLabel) {
		if (!target.addEventListener) { return; }
		this.target = target;
		target.mouseChildren = false; // prevents issues when children are removed from the display list when state changes.
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
	 * @param {Object} evt The mouse event to handle.
	 * @protected
	 **/
	p.handleEvent = function(evt) {
		var label, t = this.target, type = evt.type;
		if (type == "mousedown") {
			this._isPressed = true;
			label = this.downLabel;
		} else if (type == "pressup") {
			this._isPressed = false;
			label = this._isOver ? this.overLabel : this.outLabel;
		} else if (type == "rollover") {
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
	};

createjs.ButtonHelper = ButtonHelper;
}());
