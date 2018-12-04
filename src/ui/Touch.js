/**
 * @license Touch
 * Visit http://createjs.com/ for documentation, updates and examples.
 *
 * Copyright (c) 2017 gskinner.com, inc.
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
 * Global utility for working with multi-touch enabled devices in EaselJS. Currently supports W3C Touch API (iOS and
 * modern Android browser) and the Pointer API (IE), including ms-prefixed events in IE10, and unprefixed in IE11.
 *
 * Ensure that you {{#crossLink "Touch/disable"}}{{/crossLink}} touch when cleaning up your application. You do not have
 * to check if touch is supported to enable it, as it will fail gracefully if it is not supported.
 *
 * <strong>Note:</strong> It is important to disable Touch on a stage that you are no longer using:
 *
 * @memberof easeljs
 * @name easeljs.Touch
 * @example
 * let stage = new Stage("canvasId");
 * Touch.enable(stage);
 */
export default {

	/**
	 * Returns `true` if touch is supported in the current browser.
	 * @return {Boolean} Indicates whether touch is supported in the current browser.
	 */
	isSupported () {
		return	!!(('ontouchstart' in window) // iOS & Android
			|| (window.MSPointerEvent && window.navigator.msMaxTouchPoints > 0) // IE10
			|| (window.PointerEvent && window.navigator.maxTouchPoints > 0)); // IE11+
	},

	/**
	 * Enables touch interaction for the specified EaselJS {@link easeljs.Stage}. Currently supports iOS
	 * (and compatible browsers, such as modern Android browsers), and IE10/11. Supports both single touch and
	 * multi-touch modes. Extends the EaselJS {@link easeljs.MouseEvent} model, but without support for
	 * double click or over/out events.
	 * @param {easeljs.Stage} stage The Stage to enable touch on.
	 * @param {Boolean} [singleTouch=false] If `true`, only a single touch will be active at a time.
	 * @param {Boolean} [allowDefault=false] If `true`, then default gesture actions (ex. scrolling, zooming) will be
	 * allowed when the user is interacting with the target canvas.
	 * @return {Boolean} Returns `true` if touch was successfully enabled on the target stage.
	 */
	enable (stage, singleTouch = false, allowDefault = false) {
		if (!stage || !stage.canvas || !this.isSupported()) { return false; }
		if (stage.__touch) { return true; }

		// inject required properties on stage:
		stage.__touch = {pointers:{}, multitouch:!singleTouch, preventDefault:!allowDefault, count:0};

		// note that in the future we may need to disable the standard mouse event model before adding
		// these to prevent duplicate calls. It doesn't seem to be an issue with iOS devices though.
		if ('ontouchstart' in window) { this._IOS_enable(stage); }
		else if (window.PointerEvent || window.MSPointerEvent) { this._IE_enable(stage); }
		return true;
	},

	/**
	 * Removes all listeners that were set up when calling `Touch.enable()` on a stage.
	 * @param {easeljs.Stage} stage The Stage to disable touch on.
	 */
	disable (stage) {
		if (!stage) { return; }
		if ('ontouchstart' in window) { this._IOS_disable(stage); }
		else if (window.PointerEvent || window.MSPointerEvent) { this._IE_disable(stage); }
		delete stage.__touch;
	},

	/**
	 * @private
	 * @param {easeljs.Stage} stage
	 */
	_IOS_enable (stage) {
		let canvas = stage.canvas;
		let f = stage.__touch.f = e => this._IOS_handleEvent(stage, e);
		canvas.addEventListener("touchstart", f, false);
		canvas.addEventListener("touchmove", f, false);
		canvas.addEventListener("touchend", f, false);
		canvas.addEventListener("touchcancel", f, false);
	},

	/**
	 * @private
	 * @param {easeljs.Stage} stage
	 */
	_IOS_disable (stage) {
		let canvas = stage.canvas;
		if (!canvas) { return; }
		let f = stage.__touch.f;
		canvas.removeEventListener("touchstart", f, false);
		canvas.removeEventListener("touchmove", f, false);
		canvas.removeEventListener("touchend", f, false);
		canvas.removeEventListener("touchcancel", f, false);
	},

	/**
	 * @private
	 * @param {easeljs.Stage} stage
	 * @param {Object} e The event to handle
	 */
	_IOS_handleEvent (stage, e) {
		if (!stage) { return; }
		if (stage.__touch.preventDefault) { e.preventDefault&&e.preventDefault(); }
		let touches = e.changedTouches;
		let type = e.type;
		const l = touches.length;
		for (let touch of touches) {
			let id = touch.identifier;
			if (touch.target != stage.canvas) { continue; }

			if (type === "touchstart") {
				this._handleStart(stage, id, e, touch.pageX, touch.pageY);
			} else if (type === "touchmove") {
				this._handleMove(stage, id, e, touch.pageX, touch.pageY);
			} else if (type === "touchend" || type === "touchcancel") {
				this._handleEnd(stage, id, e);
			}
		}
	},

	/**
	 * @private
	 * @param {easeljs.Stage} stage
	 */
	_IE_enable (stage) {
		let canvas = stage.canvas;
		let f = stage.__touch.f = e => this._IE_handleEvent(stage,e);

		if (window.PointerEvent === undefined) {
			canvas.addEventListener("MSPointerDown", f, false);
			window.addEventListener("MSPointerMove", f, false);
			window.addEventListener("MSPointerUp", f, false);
			window.addEventListener("MSPointerCancel", f, false);
			if (stage.__touch.preventDefault) { canvas.style.msTouchAction = "none"; }
		} else {
			canvas.addEventListener("pointerdown", f, false);
			window.addEventListener("pointermove", f, false);
			window.addEventListener("pointerup", f, false);
			window.addEventListener("pointercancel", f, false);
			if (stage.__touch.preventDefault) { canvas.style.touchAction = "none"; }

		}
		stage.__touch.activeIDs = {};
	},

	/**
	 * @private
	 * @param {easeljs.Stage} stage
	 */
	_IE_disable (stage) {
		let f = stage.__touch.f;

		if (window.PointerEvent === undefined) {
			window.removeEventListener("MSPointerMove", f, false);
			window.removeEventListener("MSPointerUp", f, false);
			window.removeEventListener("MSPointerCancel", f, false);
			if (stage.canvas) {
				stage.canvas.removeEventListener("MSPointerDown", f, false);
			}
		} else {
			window.removeEventListener("pointermove", f, false);
			window.removeEventListener("pointerup", f, false);
			window.removeEventListener("pointercancel", f, false);
			if (stage.canvas) {
				stage.canvas.removeEventListener("pointerdown", f, false);
			}
		}
	},

	/**
	 * @private
	 * @param {easeljs.Stage} stage
	 * @param {Object} e The event to handle.
	 */
	_IE_handleEvent (stage, e) {
		if (!stage) { return; }
		if (stage.__touch.preventDefault) { e.preventDefault && e.preventDefault(); }
		let type = e.type;
		let id = e.pointerId;
		let ids = stage.__touch.activeIDs;

		if (type === "MSPointerDown" || type === "pointerdown") {
			if (e.srcElement != stage.canvas) { return; }
			ids[id] = true;
			this._handleStart(stage, id, e, e.pageX, e.pageY);
		} else if (ids[id]) { // it's an id we're watching
			if (type === "MSPointerMove" || type === "pointermove") {
				this._handleMove(stage, id, e, e.pageX, e.pageY);
			} else if (type === "MSPointerUp" || type === "MSPointerCancel"
					|| type === "pointerup" || type === "pointercancel") {
				delete(ids[id]);
				this._handleEnd(stage, id, e);
			}
		}
	},

	/**
	 * @private
	 * @param {easeljs.Stage} stage
	 * @param {String | Number} id
	 * @param {Object} e
	 * @param {Number} x
	 * @param {Number} y
	 */
	_handleStart (stage, id, e, x, y) {
		let props = stage.__touch;
		if (!props.multitouch && props.count) { return; }
		let ids = props.pointers;
		if (ids[id]) { return; }
		ids[id] = true;
		props.count++;
		stage._handlePointerDown(id, e, x, y);
	},

	/**
	 * @private
	 * @param {easeljs.Stage} stage
	 * @param {String | Number} id
	 * @param {Object} e
	 * @param {Number} x
	 * @param {Number} y
	 */
	_handleMove (stage, id, e, x, y) {
		if (!stage.__touch.pointers[id]) { return; }
		stage._handlePointerMove(id, e, x, y);
	},

	/**
	 * @private
	 * @param {easeljs.Stage} stage
	 * @param {String | Number} id
	 * @param {Object} e
	 */
	_handleEnd (stage, id, e) {
		// TODO: cancel should be handled differently for proper UI (ex. an up would trigger a click, a cancel would more closely resemble an out).
		let props = stage.__touch;
		let ids = props.pointers;
		if (!ids[id]) { return; }
		props.count--;
		stage._handlePointerUp(id, e, true);
		delete(ids[id]);
	}

}
