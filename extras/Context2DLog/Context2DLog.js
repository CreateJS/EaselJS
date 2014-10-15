/*
* Context2DLog
* Visit http://createjs.com/ for documentation, updates and examples.
*
* Copyright (c) 2014 gskinner.com, inc.
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

(function () {
	"use strict";

	/**
	 * Logs all calls and property changes on a target canvas's 2d context. It does this by overriding the getContext
	 * method of the target canvas to return the Context2DLog instance as a proxy object which intercepts and logs all
	 * method calls and property changes. This will have an impact on performance and should not be included in
	 * production code or during performance testing.
	 * 
	 * Overwrite the logMethod and logProperty methods to implement more sophisticated logging.
	 * performance
	 * @class Context2DLog
	 * @param {HTMLCanvasElement} canvas The target canvas.
	 * @constructor
	 **/
	var Context2DLog = function (canvas) {
		this.initialize(canvas);
	};
	var p = Context2DLog.prototype;
	p.constructor = Context2DLog;
	
	Context2DLog.PROPERTIES = [
		// all browsers:
		"canvas","fillStyle","font","globalAlpha","globalCompositeOperation","lineCap","lineDashOffset","lineJoin","lineWidth","miterLimit","shadowBlur","shadowColor","shadowOffsetX","shadowOffsetY","strokeStyle","textAlign","textBaseline",
		// gecko / mozilla:
		"mozCurrentTransform","mozCurrentTransformInverse","mozDash","mozDashOffset","mozFillRule","mozImageSmoothingEnabled","mozTextStyle",
		// webkit:
		"webkitLineDash", "webkitLineDashOffset"
		];
	Context2DLog.METHODS = [
		// all browsers:
		"arc","arcTo","beginPath","bezierCurveTo","clearRect","clip","closePath","createImageData","createLinearGradient","createPattern","createRadialGradient","drawCustomFocusRing","drawImage","drawSystemFocusRing","fill","fillRect","fillText","getImageData","getLineDash","isPointInPath","isPointInStroke","lineTo","measureText","moveTo","putImageData","quadraticCurveTo","rect","restore","rotate","save","scale","scrollPathIntoView","setLineDash","setTransform","stroke","strokeRect","strokeText","transform","translate",
		// gecko / mozilla:
		"asyncDrawXULElement","drawWindow","getFillStyle_multi","getImageData_explicit","getStrokeStyle_multi","mozDrawText","mozMeasureText","mozPathText","mozTextAlongPath","setFillStyle_multi","setStrokeStyle_multi",
		// webkit:
		"clearShadow","drawImageFromRect","setAlpha","setCompositeOperation","setLineWidth","setLineCap","setLineJoin","setMiterLimit","setStrokeColor","setFillColor","setShadow"
		];

// initialization:
	/**
	 * Initialization method.
	 * @method initialize
	 * @protected
	 **/
	p.initialize = function (canvas) {
		this._canvas = canvas;
		this._ctx = canvas.getContext("2d");
		
		var logger = this, ctx = this._ctx;
		
		var methods = Context2DLog.METHODS;
		for (var i= 0, l=methods.length; i<l; i++) {
			(function(method) {
				logger[method] = function() {
					logger._enabled&&logger.logMethod(method, Array.prototype.slice.call(arguments), ctx[method].apply(ctx, arguments));
				}
			})(methods[i]);
		}
		
		var props = Context2DLog.PROPERTIES;
		for (i= 0, l=props.length; i<l; i++) {
			(function(prop) {
				logger.__defineSetter__(prop, function(val) {
					logger._enabled&&logger.logProperty(prop, val, ctx[prop]);
					ctx[prop] = val;
				});
				logger.__defineGetter__(prop, function() {
					return ctx[prop];
				});
			})(props[i]);
		}
		
		this.setEnabled(true);
	};

// public properties:

// private properties:
	/**
	 * The 2d context to log.
	 * @property _ctx
	 * @type {CanvasRenderingContext2D}
	 * @default null
	 * @protected
	 **/
	p._ctx = null;
	
	/**
	 * The target canvas object.
	 * @property _canvas
	 * @type {HTMLCanvasElement}
	 * @default null
	 * @protected
	 **/
	p._canvas = null;
	
	/**
	 * @property _enabled
	 * @type {Boolean}
	 * @default false
	 * @protected
	 **/
	p._enabled = false;

// public methods:
	/**
	 * This method is called whenever a method is called on the context object with three parameters: the method name,
	 * the arguments that were passed, and the return value. By default it just calls console.log with these values, but
	 *  you can overwrite this  method for more sophisticated logging.
	 * @method logMethod
	 * @param {String} method The name of the method that was changed.
	 * @param {Array} args The arguments that were passed to the method.
	 * @param {*} returned The value that was returned by the method.
	 **/
	p.logMethod = function(method, args, returned) {
		console&&console.log(method, args, returned);
	};
	
	/**
	 * This method is called whenever a property is set on the context object with three parameters: the property name,
	 * the previous value of the property, and the new value that was assigned. By default it just calls console.log
	 * with these values, but you can overwrite this method for more sophisticated logging.
	 * @method logProperty
	 * @param {String} prop The name of the property that was changed.
	 * @param {*} oldVal The old value of the property.
	 * @param {*} newVal The new value of the property.
	 **/
	p.logProperty = function(prop, oldVal, newVal) {
		console&&console.log(prop, oldVal, newVal);
	};
	
	/**
	 * Enables or disables logging by overriding (or restoring) the getContext method on the target canvas to return
	 * the Context2DLog instance as a proxy for the "2d" context.
	 * @method setEnabled
	 * @param {Boolean} val True or false.
	 **/
	p.setEnabled = function(val) {
		var logger = this;
		this._enabled = val;
		var getContext = this._canvas.constructor.prototype.getContext;
		if (val) {
			this._canvas.getContext = function(val) {
				if (val == "2d") { return logger; }
				else { return getContext.apply(this._canvas, [val]); }
			}
		} else {
			delete this._canvas.getContext;
		}
	};

// private methods:

	window.Context2DLog = Context2DLog;
})();
