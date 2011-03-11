/*
* ColorFilter by Grant Skinner. Mar 7, 2011
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
* @module EaselJS
**/

goog.provide('ColorFilter');

goog.require('Filter');

(function(window) {

/**
* Applies color transforms.
* @class ColorFilter
* @constructor
**/
ColorFilter = function(redMultiplier, greenMultiplier, blueMultiplier, alphaMultiplier, redOffset, greenOffset, blueOffset, alphaOffset) {
  Filter.call(this);
	this.redMultiplier = redMultiplier != null ? redMultiplier : 1;
	this.greenMultiplier = greenMultiplier != null ? greenMultiplier : 1;
	this.blueMultiplier = blueMultiplier != null ? blueMultiplier : 1;
	this.alphaMultiplier = alphaMultiplier != null ? alphaMultiplier : 1;
	this.redOffset = redOffset || 0;
	this.greenOffset = greenOffset || 0;
	this.blueOffset = blueOffset || 0;
	this.alphaOffset = alphaOffset || 0;
}
goog.inherits(ColorFilter, Filter);
var p = ColorFilter.prototype;

// public properties:
	// TODO: doc.
	p.redMultiplier = 1;
	p.greenMultiplier = 1;
	p.blueMultiplier = 1;
	p.alphaMultiplier = 1;
	p.redOffset = 0;
	p.greenOffset = 0;
	p.blueOffset = 0;
	p.alphaOffset = 0;
	
// public methods:
	/**
	* Applies the filter to the specified context.
	* @method apply
	* @param ctx The 2D context to use as the source.
	* @param x The x position to use for the source rect.
	* @param y The y position to use for the source rect.
	* @param width The width to use for the source rect.
	* @param height The height to use for the source rect.
	* @param ctx Optional. The 2D context to draw the result to. Defaults to the context passed to ctx.
	* @param x Optional. The x position to draw the result to. Defaults to the value passed to x.
	* @param y Optional. The y position to draw the result to. Defaults to the value passed to y.
	**/
	p.applyFilter = function(ctx, x, y, width, height, targetCtx, targetX, targetY) {
		targetCtx = targetCtx || ctx;
		if (targetX = null) { targetX = x; }
		if (targetY = null) { targetY = y; }
		try {
			var imageData = ctx.getImageData(x, y, width, height);
		} catch(e) {
			//if (!this.suppressCrossDomainErrors) throw new Error("unable to access local image data: " + e);
			return false;
		}
		var data = imageData.data;
		var l = data.length;
		for (var i=0; i<l; i+=4) {
			data[i] = data[i]*this.redMultiplier+this.redOffset;
			data[i+1] = data[i+1]*this.greenMultiplier+this.greenOffset;
			data[i+2] = data[i+2]*this.blueMultiplier+this.blueOffset;
			data[i+3] = data[i+3]*this.alphaMultiplier+this.alphaOffset;
		}
		imageData.data = data;
		targetCtx.putImageData(imageData, targetX, targetY);
		return true;
	}

	/**
	* Returns a string representation of this object.
	* @method toString
	* @return {String} a string representation of the instance.
	**/
	p.toString = function() {
		return "[ColorFilter]";
	}
	
	
	/**
	* Returns a clone of this ColorFilter instance.
	* @method clone
	 @return {ColorFilter} A clone of the current ColorFilter instance.
	**/
	p.clone = function() {
		return new ColorFilter(this.redMultiplier, this.greenMultiplier, this.blueMultiplier, this.alphaMultiplier, this.redOffset, this.greenOffset, this.blueOffset, this.alphaOffset);
	}
	
window.ColorFilter = ColorFilter;
}(window));