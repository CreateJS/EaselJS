/**
* Point by Grant Skinner. Dec 5, 2010
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
**/

(function(window) {

/**
* Constructs a new Point instance.
* @param x X position. Default is 0.
* @param y Y position. Default is 0.
* @class Represents a point with x / y coordinates.
**/
Point = function(x, y) {
  this.initialize(x, y);
}
	
// public properties:
	/** X position. */
	Point.prototype.x = 0;
	/** Y position. */
	Point.prototype.y = 0;
	
// constructor:
	/** @ignore */
	Point.prototype.initialize = function(x, y) {
		this.x = (x == null ? 0 : x);
		this.y = (y == null ? 0 : y);
	}
	
// public methods:
	/**
	* Returns a clone of this Point.
	**/
	Point.prototype.clone = function() {
		return new Point(this.x, this.y);
	}

	/**
	* Returns a string representation of this object.
	**/
	Point.prototype.toString = function() {
		return "[Point (x="+this.x+" y="+this.y+")]";
	}
	
window.Point = Point;
}(window));