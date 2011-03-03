/*
* Filter by Grant Skinner. Mar 7, 2011
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

goog.provide('Filter');

(function(window) {

/**
* Base class that all filters should inherit from.
* @class Filter
* @constructor
**/
Filter = function() {
}
var p = Filter.prototype;
	
// public methods:
	/**
	* Returns a generic object with values indicating the margins required to draw the filter.
	* The object will have properties: top, left, right, bottom.
	* @method getMargins
	* @return {Object} a generic object with top, left, right, and bottom properties.
	**/
	p.getMargins = function() {
		return {left:0,top:0,right:0,bottom:0}
	}
	
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
	
window.Filter = Filter;
}(window));