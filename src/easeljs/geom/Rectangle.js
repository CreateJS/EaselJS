/*
* Rectangle
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
	 * Represents a rectangle as defined by the points (x, y) and (x+width, y+height).
	 *
	 * <h4>Example</h4>
	 *
	 *      var rect = new createjs.Rectangle(0, 0, 100, 100);
	 *
	 * @class Rectangle
	 * @param {Number} [x=0] X position.
	 * @param {Number} [y=0] Y position.
	 * @param {Number} [width=0] The width of the Rectangle.
	 * @param {Number} [height=0] The height of the Rectangle.
	 * @constructor
	 **/
	function Rectangle(x, y, width, height) {
		this.setValues(x, y, width, height);
		
		
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
	
		/**
		 * Width.
		 * @property width
		 * @type Number
		 **/
	
		/**
		 * Height.
		 * @property height
		 * @type Number
		 **/
	}
	var p = Rectangle.prototype;

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
	 * @param {Number} [width=0] The width of the Rectangle.
	 * @param {Number} [height=0] The height of the Rectangle.
	 * @return {Rectangle} This instance. Useful for chaining method calls.
	 * @chainable
	*/
	p.setValues = function(x, y, width, height) {
		// don't forget to update docs in the constructor if these change:
		this.x = x||0;
		this.y = y||0;
		this.width = width||0;
		this.height = height||0;
		return this;
	};
	
	/** 
	 * Extends the rectangle's bounds to include the described point or rectangle.
	 * @method extend
	 * @param {Number} x X position of the point or rectangle.
	 * @param {Number} y Y position of the point or rectangle.
	 * @param {Number} [width=0] The width of the rectangle.
	 * @param {Number} [height=0] The height of the rectangle.
	 * @return {Rectangle} This instance. Useful for chaining method calls.
	 * @chainable
	*/
	p.extend = function(x, y, width, height) {
		width = width||0;
		height = height||0;
		if (x+width > this.x+this.width) { this.width = x+width-this.x; }
		if (y+height > this.y+this.height) { this.height = y+height-this.y; }
		if (x < this.x) { this.width += this.x-x; this.x = x; }
		if (y < this.y) { this.height += this.y-y; this.y = y; }
		return this;
	};
	
	/** 
	 * Adds the specified padding to the rectangle's bounds.
	 * @method extend
	 * @param {Number} [top=0]
	 * @param {Number} [left=0]
	 * @param {Number} [right=0]
	 * @param {Number} [bottom=0]
	 * @return {Rectangle} This instance. Useful for chaining method calls.
	 * @chainable
	*/
	p.pad = function(top, left, bottom, right) {
		this.x -= left;
		this.y -= top;
		this.width += left+right;
		this.height += top+bottom;
		return this;
	};
	
	/**
	 * Copies all properties from the specified rectangle to this rectangle.
	 * @method copy
	 * @param {Rectangle} rectangle The rectangle to copy properties from.
	 * @return {Rectangle} This rectangle. Useful for chaining method calls.
	 * @chainable
	*/
	p.copy = function(rectangle) {
		return this.setValues(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
	};
	
	/** 
	 * Returns true if this rectangle fully encloses the described point or rectangle.
	 * @method contains
	 * @param {Number} x X position of the point or rectangle.
	 * @param {Number} y Y position of the point or rectangle.
	 * @param {Number} [width=0] The width of the rectangle.
	 * @param {Number} [height=0] The height of the rectangle.
	 * @return {Boolean} True if the described point or rectangle is contained within this rectangle.
	*/
	p.contains = function(x, y, width, height) {
		width = width||0;
		height = height||0;
		return (x >= this.x && x+width <= this.x+this.width && y >= this.y && y+height <= this.y+this.height);
	};
	
	/** 
	 * Returns a new rectangle which contains this rectangle and the specified rectangle.
	 * @method union
	 * @param {Rectangle} rect The rectangle to calculate a union with.
	 * @return {Rectangle} A new rectangle describing the union.
	*/
	p.union = function(rect) {
		return this.clone().extend(rect.x, rect.y, rect.width, rect.height);
	};
	
	/** 
	 * Returns a new rectangle which describes the intersection (overlap) of this rectangle and the specified rectangle,
	 * or null if they do not intersect.
	 * @method intersection
	 * @param {Rectangle} rect The rectangle to calculate an intersection with.
	 * @return {Rectangle} A new rectangle describing the intersection or null.
	*/
	p.intersection = function(rect) {
		var x1 = rect.x, y1 = rect.y, x2 = x1+rect.width, y2 = y1+rect.height;
		if (this.x > x1) { x1 = this.x; }
		if (this.y > y1) { y1 = this.y; }
		if (this.x + this.width < x2) { x2 = this.x + this.width; }
		if (this.y + this.height < y2) { y2 = this.y + this.height; }
		return (x2 <= x1 || y2 <= y1) ? null : new Rectangle(x1, y1, x2-x1, y2-y1);
	};
	
	/** 
	 * Returns true if the specified rectangle intersects (has any overlap) with this rectangle.
	 * @method intersects
	 * @param {Rectangle} rect The rectangle to compare.
	 * @return {Boolean} True if the rectangles intersect.
	*/
	p.intersects = function(rect) {
		return (rect.x <= this.x+this.width && this.x <= rect.x+rect.width && rect.y <= this.y+this.height && this.y <= rect.y + rect.height);
	};
	
	/** 
	 * Returns true if the width or height are equal or less than 0.
	 * @method isEmpty
	 * @return {Boolean} True if the rectangle is empty.
	*/
	p.isEmpty = function() {
		return this.width <= 0 || this.height <= 0;
	};
	
	/**
	 * Returns a clone of the Rectangle instance.
	 * @method clone
	 * @return {Rectangle} a clone of the Rectangle instance.
	 **/
	p.clone = function() {
		return new Rectangle(this.x, this.y, this.width, this.height);
	};

	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 **/
	p.toString = function() {
		return "[Rectangle (x="+this.x+" y="+this.y+" width="+this.width+" height="+this.height+")]";
	};
	
	
	createjs.Rectangle = Rectangle;
}());
