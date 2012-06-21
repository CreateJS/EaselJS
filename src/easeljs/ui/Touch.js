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


(function(ns) {

// TODO: support for double tap.
/**
 * Global utility for working with multi-touch enabled devices in EaselJS. Currently supports W3C Touch API
 * (iOS & modern Android browser) and IE10.
 * @class Touch
 * @static
 **/
var Touch = function() {
	throw "Touch cannot be instantiated";
}

// Public static methods:
	/**
	 * Returns true if touch is supported in the current browser.
	 * @method isSupported
	 * @return {Boolean} A boolean indicating whether touch is supported in the current browser.
	 * @static
	 **/
	Touch.isSupported = function() {
		return	('ontouchstart' in window) || // iOS
					(window.navigator['msPointerEnabled']); // IE10
	}

	/**
	 * Enables touch interaction for the specified EaselJS stage. Currently supports iOS (and compatible browsers, such
	 * as modern Android browsers), and IE10.
	 * Supports both single touch and multi-touch modes. Extends the EaselJS MouseEvent model, but without support for
	 * double click or over/out events. See MouseEvent.pointerID for more information.
	 * @method enable
	 * @param {Stage} stage The stage to enable touch on.
	 * @param {Boolean} singleTouch If true, only a single touch will be active at a time. Default is false.
	 * @param {Boolean} allowDefault If true, then default gesture actions (ex. scrolling, zooming) will be allowed when the user is interacting with the target canvas. Default is false.
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
	}
	
// Private static methods:

	/**
	 * @method _IOS_enable
	 * @protected
	 * @param {Stage} stage
	 **/
	Touch._IOS_enable = function(stage) {
		var canvas = stage.canvas;
		canvas.addEventListener("touchstart", function(e) { Touch._IOS_handleEvent(stage,e); }, false);
		canvas.addEventListener("touchmove", function(e) { Touch._IOS_handleEvent(stage,e); }, false);
		canvas.addEventListener("touchend", function(e) { Touch._IOS_handleEvent(stage,e); }, false);
		canvas.addEventListener("touchcancel", function(e) { Touch._IOS_handleEvent(stage,e); }, false);
	}

	/**
	 * @method _IOS_handleEvent
	 * @protected
	 **/
	Touch._IOS_handleEvent = function(stage, e) {
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
	}
	
	/**
		 * @method _IE_enable
		 * @protected
		 * @param {Stage} stage
		 **/
		Touch._IE_enable = function(stage) {
			var canvas = stage.canvas;
			canvas.addEventListener("MSPointerDown", function(e) { Touch._IE_handleEvent(stage,e); }, false);
			window.addEventListener("MSPointerMove", function(e) { Touch._IE_handleEvent(stage,e); }, false);
			window.addEventListener("MSPointerUp", function(e) { Touch._IE_handleEvent(stage,e); }, false);
			window.addEventListener("MSPointerCancel", function(e) { Touch._IE_handleEvent(stage,e); }, false);
			if (stage.__touch.preventDefault) { canvas.style.msTouchAction = "none"; }
			stage.__touch.activeIDs = {};
		}
	
		/**
		 * @method _IE_handleEvent
		 * @protected
		 **/
		Touch._IE_handleEvent = function(stage, e) {
			if (stage.__touch.preventDefault) {
				e.preventDefault&&e.preventDefault();
			}
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
		}
	
	
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
	}
	
	/**
	 * @method _handleMove
	 * @protected
	 **/
	Touch._handleMove = function(stage, id, e, x, y) {
		if (!stage.__touch.pointers[id]) { return; }
		stage._handlePointerMove(id, e, x, y);
	}
	
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
	}


ns.Touch = Touch;
}(createjs||(createjs={})));
var createjs;