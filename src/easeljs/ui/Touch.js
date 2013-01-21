/*
* Touch
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

// TODO: support for double tap.
/**
 * Global utility for working with multi-touch enabled devices in EaselJS. Currently supports W3C Touch API (iOS and
 * modern Android browser) and IE10.
 *
 * Ensure that you {{#crossLink "Touch/disable"}}{{/crossLink}} touch when cleaning up your application.
 * Note that you do not have to check if touch is supported to enable it, as it will fail gracefully if it is not
 * supported.
 *
 * <h4>Example</h4>
 *      var stage = new createjs.Stage("canvas");
 *      createjs.Touch.enable(stage);
 *
 * @class Touch
 * @static
 **/
var Touch = function() {
	throw "Touch cannot be instantiated";
};

// Public static methods:
	/**
	 * Returns true if touch is supported in the current browser.
	 * @method isSupported
	 * @return {Boolean} Indicates whether touch is supported in the current browser.
	 * @static
	 **/
	Touch.isSupported = function() {
		return	('ontouchstart' in window) || // iOS
					(window.navigator['msPointerEnabled']); // IE10
	};

	/**
	 * Enables touch interaction for the specified EaselJS stage. Currently supports iOS (and compatible browsers, such
	 * as modern Android browsers), and IE10.
	 * Supports both single touch and multi-touch modes. Extends the EaselJS MouseEvent model, but without support for
	 * double click or over/out events. See MouseEvent.pointerID for more information.
	 * @method enable
	 * @param {Stage} stage The stage to enable touch on.
	 * @param {Boolean} [singleTouch=false] If true, only a single touch will be active at a time.
	 * @param {Boolean} [allowDefault=false] If true, then default gesture actions (ex. scrolling, zooming) will be
	 * allowed when the user is interacting with the target canvas.
	 * @return {Boolean} Returns true if touch was successfully enabled on the target stage.
	 * @static
	 **/
	Touch.enable = function(stage, singleTouch, allowDefault) {
		if (!stage || !stage.canvas || !Touch.isSupported()) { return false; }

		// inject required properties on stage:
		stage.__touch = {pointers:{}, multitouch:!singleTouch, preventDefault:!allowDefault, count:0};
		
		// note that in the future we may need to disable the standard mouse event model before adding
		// these to prevent duplicate calls. It doesn't seem to be an issue with iOS devices though.
		if ('ontouchstart' in window) { Touch._IOS_enable(stage); }
		else if (window.navigator['msPointerEnabled']) { Touch._IE_enable(stage); }
		return true;
	};
	
	/**
	 * Removes all listeners that were set up when calling Touch.enable on a stage.
	 * @method disable
	 * @param {Stage} stage The stage to disable touch on.
	 * @static
	 **/
	Touch.disable = function(stage) {
		if (!stage) { return; }
		if ('ontouchstart' in window) { Touch._IOS_disable(stage); }
		else if (window.navigator['msPointerEnabled']) { Touch._IE_disable(stage); }
	};
	
// Private static methods:

	/**
	 * @method _IOS_enable
	 * @protected
	 * @param {Stage} stage
	 * @static
	 **/
	Touch._IOS_enable = function(stage) {
		var canvas = stage.canvas;
		var f = stage.__touch.f = function(e) { Touch._IOS_handleEvent(stage,e); };
		canvas.addEventListener("touchstart", f, false);
		canvas.addEventListener("touchmove", f, false);
		canvas.addEventListener("touchend", f, false);
		canvas.addEventListener("touchcancel", f, false);
	};
	
	/**
	 * @method _IOS_disable
	 * @protected
	 * @param {Stage} stage
	 * @static
	 **/
	Touch._IOS_disable = function(stage) {
		var canvas = stage.canvas;
		if (!canvas) { return; }
		var f = stage.__touch.f;
		canvas.removeEventListener("touchstart", f, false);
		canvas.removeEventListener("touchmove", f, false);
		canvas.removeEventListener("touchend", f, false);
		canvas.removeEventListener("touchcancel", f, false);
	};

	/**
	 * @method _IOS_handleEvent
	 * @protected
	 * @static
	 **/
	Touch._IOS_handleEvent = function(stage, e) {
		if (!stage) { return; }
		if (stage.__touch.preventDefault) { e.preventDefault&&e.preventDefault(); }
		var touches = e.changedTouches;
		var type = e.type;
		for (var i= 0,l=touches.length; i<l; i++) {
			var touch = touches[i];
			var id = touch.identifier;
			if (touch.target != stage.canvas) { continue; }
			
			if (type == "touchstart") {
				this._handleStart(stage, id, e, touch.pageX, touch.pageY);
			} else if (type == "touchmove") {
				this._handleMove(stage, id, e, touch.pageX, touch.pageY);
			} else if (type == "touchend" || type == "touchcancel") {
				this._handleEnd(stage, id, e);
			}
		}
	};
	
	/**
	 * @method _IE_enable
	 * @protected
	 * @param {Stage} stage
	 * @static
	 **/
	Touch._IE_enable = function(stage) {
		var canvas = stage.canvas;
		var f = stage.__touch.f = function(e) { Touch._IE_handleEvent(stage,e); };
		canvas.addEventListener("MSPointerDown", f, false);
		window.addEventListener("MSPointerMove", f, false);
		window.addEventListener("MSPointerUp", f, false);
		window.addEventListener("MSPointerCancel", f, false);
		if (stage.__touch.preventDefault) { canvas.style.msTouchAction = "none"; }
		stage.__touch.activeIDs = {};
	};
	
	/**
	 * @method _IE_enable
	 * @protected
	 * @param {Stage} stage
	 * @static
	 **/
	Touch._IE_disable = function(stage) {
		var f = stage.__touch.f;
		window.removeEventListener("MSPointerMove", f, false);
		window.removeEventListener("MSPointerUp", f, false);
		window.removeEventListener("MSPointerCancel", f, false);
		if (stage.canvas) {
			stage.canvas.removeEventListener("MSPointerDown", f, false);
		}
	};
	
	/**
	 * @method _IE_handleEvent
	 * @protected
	 * @static
	 **/
	Touch._IE_handleEvent = function(stage, e) {
		if (!stage) { return; }
		if (stage.__touch.preventDefault) { e.preventDefault&&e.preventDefault(); }
		var type = e.type;
		var id = e.pointerId;
		var ids = stage.__touch.activeIDs;
		
		if (type == "MSPointerDown") {
			if (e.srcElement != stage.canvas) { return; }
			ids[id] = true;
			this._handleStart(stage, id, e, e.pageX, e.pageY);
		} else if (ids[id]) { // it's an id we're watching
			if (type == "MSPointerMove") {
				this._handleMove(stage, id, e, e.pageX, e.pageY);
			} else if (type == "MSPointerUp" || type == "MSPointerCancel") {
				delete(ids[id]);
				this._handleEnd(stage, id, e);
			}
		}
	};
	
	
	/**
	 * @method _handleStart
	 * @protected
	 **/
	Touch._handleStart = function(stage, id, e, x, y) {
		var props = stage.__touch;
		if (!props.multitouch && props.count) { return; }
		var ids = props.pointers;
		if (ids[id]) { return; }
		ids[id] = true;
		props.count++;
		stage._handlePointerDown(id, e, x, y);
	};
	
	/**
	 * @method _handleMove
	 * @protected
	 **/
	Touch._handleMove = function(stage, id, e, x, y) {
		if (!stage.__touch.pointers[id]) { return; }
		stage._handlePointerMove(id, e, x, y);
	};
	
	/**
	 * @method _handleEnd
	 * @protected
	 **/
	Touch._handleEnd = function(stage, id, e) {
		// TODO: cancel should be handled differently for proper UI (ex. an up would trigger a click, a cancel would more closely resemble an out).
		var props = stage.__touch;
		var ids = props.pointers;
		if (!ids[id]) { return; }
		props.count--;
		stage._handlePointerUp(id, e, true);
		delete(ids[id]);
	};


createjs.Touch = Touch;
}());