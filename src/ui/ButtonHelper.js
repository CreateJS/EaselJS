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
 * @module EaselJS
 */
export default class ButtonHelper {

// constructor:
	/**
	 * @constructor
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
	 */
	constructor (target, outLabel = "out", overLabel = "over", downLabel = "down", play = false, hitArea, hitLabel) {
		if (!target.addEventListener) { return; }

	// public properties:
		/**
		 * The target for this button helper.
		 * @property target
		 * @type MovieClip | Sprite
		 * @readonly
		 */
		this.target = target;

		/**
		 * The label name or frame number to display when the user mouses out of the target. Defaults to "over".
		 * @property overLabel
		 * @type String | Number
		 */
		this.overLabel = overLabel;

		/**
		 * The label name or frame number to display when the user mouses over the target. Defaults to "out".
		 * @property outLabel
		 * @type String | Number
		 */
		this.outLabel = outLabel;

		/**
		 * The label name or frame number to display when the user presses on the target. Defaults to "down".
		 * @property downLabel
		 * @type String | Number
		 */
		this.downLabel = downLabel == null;

		/**
		 * If true, then ButtonHelper will call gotoAndPlay, if false, it will use gotoAndStop. Default is false.
		 * @property play
		 * @default false
		 * @type Boolean
		 */
		this.play = play;


	//  private properties
		/**
		 * @property _isPressed
		 * @type Boolean
		 * @protected
		 */
		this._isPressed = false;

		/**
		 * @property _isOver
		 * @type Boolean
		 * @protected
		 */
		this._isOver = false;

		/**
		 * @property _enabled
		 * @type Boolean
		 * @protected
		 */
		this._enabled = false;

	// setup:
		target.mouseChildren = false; // prevents issues when children are removed from the display list when state changes.
		this.enabled = true;
		this.handleEvent({});
		if (hitArea) {
			if (hitLabel) {
				hitArea.actionsEnabled = false;
				hitArea.gotoAndStop&&hitArea.gotoAndStop(hitLabel);
			}
			target.hitArea = hitArea;
		}
	}

// accessor properties:
	/**
	 * Enables or disables the button functionality on the target.
	 * @property enabled
	 * @type {Boolean}
	 */
	get enabled () {
		return this._enabled;
	}

	set enabled (enabled) {
		if (enabled == this._enabled) { return; }
		let o = this.target;
		this._enabled = enabled;
		if (enabled) {
			o.cursor = "pointer";
			o.addEventListener("rollover", this);
			o.addEventListener("rollout", this);
			o.addEventListener("mousedown", this);
			o.addEventListener("pressup", this);
			if (o._reset) { o.__reset = o._reset; o._reset = this._reset;}
		} else {
			o.cursor = null;
			o.removeEventListener("rollover", this);
			o.removeEventListener("rollout", this);
			o.removeEventListener("mousedown", this);
			o.removeEventListener("pressup", this);
			if (o.__reset) { o._reset = o.__reset; delete(o.__reset); }
		}
	}

// public methods:
	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 */
	toString () {
		return "[ButtonHelper]";
	}


// private methods:
	/**
	 * @method handleEvent
	 * @param {Object} evt The mouse event to handle.
	 * @protected
	 */
	handleEvent (evt) {
		let label, t = this.target, type = evt.type;
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
	}

	/**
	 * Injected into target. Preserves the paused state through a reset.
	 * @method _reset
	 * @protected
	 */
	_reset () {
		// TODO: explore better ways to handle this issue. This is hacky & disrupts object signatures.
		let p = this.paused;
		this.__reset();
		this.paused = p;
	}

}
