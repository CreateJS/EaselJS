/*
* Point
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


// constructor:
	/**
	 * Represents a point on a 2 dimensional x / y coordinate system.
	 *
	 * <h4>Example</h4>
	 * 
	 *      var point = new createjs.Point(0, 100);
	 * 
	 * @class Point
	 * @param {Number} [x=0] X position.
	 * @param {Number} [y=0] Y position.
	 * @constructor
	 **/
	function Point(x, y) {
	 	this.setValues(x, y);
	 	
	 	
	// public properties:
		// assigned in the setValues method.
		/**
		 * X position.
		 * @property x
		 * @type Number
		 **/
	
		/**
		 * Y position.
		 * @property y
		 * @type Number
		 **/
	}
	var p = Point.prototype;

	/**
	 * <strong>REMOVED</strong>. Removed in favor of using `MySuperClass_constructor`.
	 * See {{#crossLink "Utility Methods/extend"}}{{/crossLink}} and {{#crossLink "Utility Methods/promote"}}{{/crossLink}}
	 * for details.
	 *
	 * There is an inheritance tutorial distributed with EaselJS in /tutorials/Inheritance.
	 *
	 * @method initialize
	 * @protected
	 * @deprecated
	 */
	// p.initialize = function() {}; // searchable for devs wondering where it is.

	
// public methods:
	/** 
	 * Sets the specified values on this instance.
	 * @method setValues
	 * @param {Number} [x=0] X position.
	 * @param {Number} [y=0] Y position.
	 * @return {Point} This instance. Useful for chaining method calls.
	 * @chainable
	*/
	p.setValues = function(x, y) {
		this.x = x||0;
		this.y = y||0;
		return this;
	};
	
	/** 
	 * Offsets the Point object by the specified amount. The value of dx is added to the original value of x to create the new x value. The value of dy is added to the original value of y to create the new y value.
	 * @method offset
	 * @param {Number} The amount by which to offset the horizontal coordinate, x.
	 * @param {Number} The amount by which to offset the vertical coordinate, y.
	 * @return {Point} This instance. Useful for chaining method calls.
	 * @chainable
	*/
	p.offset = function(dx, dy) {
		this.x += dx;
		this.y += dy;
		return this;
	};

	/** 
	 * Converts a pair of polar coordinates to a Cartesian point coordinate.
	 * @method offset
	 * @param {Number} The length coordinate of the polar pair.
	 * @param {Number} The angle, in radians, of the polar pair.
	 * @param {Point | Object} [pt] An object to copy the result into. If omitted a generic object with x/y properties will be returned.
	 * @return {Point} The new, interpolated point.
	 * @chainable
	*/
	Point.polar = function(len, angle, pt) {
		pt = pt||{};
		pt.x = len * (Math.cos(angle));
		pt.y = len * (Math.sin(angle));
		return pt;
	};

	/** 
	 * Determines a point between two specified points. The parameter `f` determines where the new interpolated point is located relative to the two end points specified by parameters `pt1` and `pt2`. The closer the value of the parameter `f` is to 1.0, the closer the interpolated point is to the first point (parameter `pt1`). The closer the value of the parameter `f` is to 0, the closer the interpolated point is to the second point (parameter `pt2`).
	 * @method offset
	 * @param {Point | Object} The first point as a Point or generic object.
	 * @param {Point | Object} The second point as a Point or generic object.
	 * @param {Number} The level of interpolation between the two points. Indicates where the new point will be, along the line between `pt1` and `pt2`. If `f=1`, `pt1` is returned; if `f=0`, `pt2` is returned.
	 * @param {Point | Object} [pt] An object to copy the result into. If omitted a generic object with x/y properties will be returned.
	 * @return {Point} The new, interpolated point.
	 * @chainable
	*/
	Point.interpolate = function(pt1, pt2, f, pt) {
		pt = pt||{};
		pt.x = pt2.x + (f * (pt1.x - pt2.x));
		pt.y = pt2.y + (f * (pt1.y - pt2.y));
		return pt;
	};
	
	/**
	 * Copies all properties from the specified point to this point.
	 * @method copy
	 * @param {Point} point The point to copy properties from.
	 * @return {Point} This point. Useful for chaining method calls.
	 * @chainable
	*/
	p.copy = function(point) {
		this.x = point.x;
		this.y = point.y;
		return this;
	};
	
	/**
	 * Returns a clone of the Point instance.
	 * @method clone
	 * @return {Point} a clone of the Point instance.
	 **/
	p.clone = function() {
		return new Point(this.x, this.y);
	};

	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 **/
	p.toString = function() {
		return "[Point (x="+this.x+" y="+this.y+")]";
	};
	
	
	createjs.Point = Point;
}());
