/*
* Touch by Grant Skinner. Jul 4, 2011
* Visit http://easeljs.com/ for documentation, updates and examples.
*
*
* Copyright (c) 2011 Grant Skinner
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
* Global utility for working with touch enabled devices in EaselJS.
* @class Touch
* @static
**/
var Touch = function() {
	throw "Touch cannot be instantiated";
}

	/**
	 * Enables touch interaction for the specified EaselJS stage. This
	 * currently only supports iOS, and simply maps single touch events
	 * to the existing EaselJS mouse events.
	 * @method isSupported
	 * @return {Boolean} A boolean indicating whether touch is supported in the current environment.
	 * @static
	 **/
	Touch.isSupported = function() {
		return ('ontouchstart' in window);
	}

	/**
	 * Enables touch interaction for the specified EaselJS stage. This
	 * currently only supports iOS, and simply maps single touch events
	 * to the existing EaselJS mouse events.
	 * @method enable
	 * @param {Stage} stage The stage to enable touch on.
	 * @static
	 **/
	Touch.enable = function(stage) {
		if (stage == null || !Touch.isSupported()) { return; }
		var o = stage;

		// inject required properties on stage:
		o._primaryTouchId = -1;
		o._handleTouchMoveListener = null;

		// note that in the future we may need to disable the standard mouse event model before adding
		// these to prevent duplicate calls. It doesn't seem to be an issue with iOS devices though.
		o.canvas.addEventListener("touchstart", function(e) {
			Touch._handleTouchStart(o,e);
		}, false);

		document.addEventListener("touchend", function(e) {
			Touch._handleTouchEnd(o,e);
		}, false);
	}

	/**
	 * @method _handleTouchStart
	 * @protected
	 * @param {Stage} stage
	 * @param {TouchEvent} e
	 **/
	Touch._handleTouchStart = function(stage,e) {
		e.preventDefault();

		if(stage._primaryTouchId != -1) {
			//we are already tracking an id
			return;
		}

		stage._handleTouchMoveListener = stage._handleTouchMoveListener || function(e){
			Touch._handleTouchMove(stage,e);
		}

		//for touch we only need to listen to move events once a touch has started
		//on the canvas
		document.addEventListener("touchmove", stage._handleTouchMoveListener, false);

		var touch = e.changedTouches[0];
		stage._primaryTouchId = touch.identifier;
		stage._updateMousePosition(touch.pageX, touch.pageY);
		stage._handleMouseDown(touch);
	}

	/**
	 * @method _handleTouchMove
	 * @protected
	 * @param {Stage} stage
	 * @param {TouchEvent} e
	 **/
	Touch._handleTouchMove = function(stage,e) {
		var touch = Touch._findPrimaryTouch(stage,e.changedTouches);
		if(touch) {
			stage._handleMouseMove(touch);
		}
	}

	/**
	 * @method _handleTouchEnd
	 * @protected
	 * @param {Stage} stage
	 * @param {TouchEvent} e
	 **/
	Touch._handleTouchEnd = function(stage,e) {
		var touch = Touch._findPrimaryTouch(stage,e.changedTouches);

		if(touch) {
			stage._primaryTouchId = -1;
			stage._handleMouseUp(touch);
			//stop listening for move events, until another new touch starts on the canvas
			document.removeEventListener("touchmove", stage._handleTouchMoveListener);
			stage._handleTouchMoveListener = null;
		}
	}

	/**
	 * @method _findPrimaryTouch
	 * @protected
	 * @param {Stage} stage
	 * @param {Array[Touch]} touches
	 **/
	Touch._findPrimaryTouch = function(stage,touches) {
		var l = touches.length;
		for(var i = 0; i < l; i++){
			var touch = touches[i];

			//find the primary touchPoint by id
			if(touch.identifier == stage._primaryTouchId) {
				return touch;
			}
		}
		return null;
	}

window.Touch = Touch;
}(window));