/*
* Filter
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

/**
* Base class that all filters should inherit from.
* @class Filter
* @constructor
**/
var Filter = function() {
  this.initialize();
}
var p = Filter.prototype;
	
// constructor:
	/** 
	 * Initialization method.
	 * @method initialize
	 * @protected
	 **/
	p.initialize = function() {}
	
// public methods:
	/**
	 * Returns a rectangle with values indicating the margins required to draw the filter.
	 * For example, a filter that will extend the drawing area 4 pixels to the left, and 7 pixels to the right
	 * (but no pixels up or down) would return a rectangle with (x=-4, y=0, width=11, height=0).
	 * @method getBounds
	 * @return {Rectangle} a rectangle object indicating the margins required to draw the filter.
	 **/
	p.getBounds = function() {
		return new ns.Rectangle(0,0,0,0);
	}
	
	/**
	 * Applies the filter to the specified context.
	 * @method applyFilter
	 * @param ctx The 2D context to use as the source.
	 * @param x The x position to use for the source rect.
	 * @param y The y position to use for the source rect.
	 * @param width The width to use for the source rect.
	 * @param height The height to use for the source rect.
	 * @param targetCtx Optional. The 2D context to draw the result to. Defaults to the context passed to ctx.
	 * @param targetX Optional. The x position to draw the result to. Defaults to the value passed to x.
	 * @param targetY Optional. The y position to draw the result to. Defaults to the value passed to y.
	 **/
	p.applyFilter = function(ctx, x, y, width, height, targetCtx, targetX, targetY) {}

	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 **/
	p.toString = function() {
		return "[Filter]";
	}
	
	
	/**
	 * Returns a clone of this Filter instance.
	 * @method clone
	 @return {Filter} A clone of the current Filter instance.
	 **/
	p.clone = function() {
		return new Filter();
	}
	
ns.Filter = Filter;
}(createjs||(createjs={})));
var createjs;