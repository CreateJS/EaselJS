/*
* Rectangle by Grant Skinner. Dec 5, 2010
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
**/

(function(window) {

/**
* Represents a rectangle as defined by the points (x, y) and (x+width, y+height).
* @class Rectangle
* @constructor
* @param {number} x X position. Default is 0.
* @param {number} y Y position. Default is 0.
* @param {number} width Width. Default is 0.
* @param {number} height Height. Default is 0.
**/
Rectangle = function(x, y, width, height) {
  this.initialize(x, y, width, height);
}
var p = Rectangle.prototype;
	
// public properties:
	/** 
	* X position. 
	* @property x
	* @type {number}
	**/
	p.x = 0;
	
	/** 
	* Y position. 
	* @property y
	* @type {number}
	**/
	p.y = 0;
	
	/** 
	* Width.
	* @property width
	* @type {number}
	**/
	p.width = 0;
	
	/** 
	* Height.
	* @property height
	* @type {number}
	**/
	p.height = 0;
	
// constructor:
	/** 
	* Initialization method.
	* @protected
	*/
	p.initialize = function(x, y, width, height) {
		this.x = (x == null ? 0 : x);
		this.y = (y == null ? 0 : y);
		this.width = (width == null ? 0 : width);
		this.height = (height == null ? 0 : height);
	}
	
// public methods:
	/**
	* Returns a clone of the Rectangle instance.
	* @return {Rectangle} a clone of the Rectangle instance.
	**/
	p.clone = function() {
		return new Rectangle(this.x, this.y, this.width, this.height);
	}

	/**
	* Returns a string representation of this object.
	* @return {string} a string representation of the instance.
	**/
	p.toString = function() {
		return "[Rectangle (x="+this.x+" y="+this.y+" width="+this.width+" height="+this.height+")]";
	}
	
window.Rectangle = Rectangle;
}(window));