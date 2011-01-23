/**
* Rectangle by Grant Skinner. Dec 5, 2010
* Visit www.gskinner.com/blog for documentation, updates and more free code.
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
* Constructs a new Rectangle instance.
* @param x X position. Default is 0.
* @param y Y position. Default is 0.
* @param w Width. Default is 0.
* @param h Height. Default is 0.
* @class Represents a rectangle as defined by the points (x,y) and (x+w,y+h).
**/
function Rectangle(x, y, w, h) {
  this.init(x, y, w, h);
}
var p = Rectangle.prototype;
	
// public properties:
	/** X position. **/
	p.x = 0;
	/** Y position. **/
	p.y = 0;
	/** Width. **/
	p.w = 0;
	/** Height. **/
	p.h = 0;
	
// constructor:
	/** @private **/
	p.init = function(x, y, w, h) {
		this.x = (x == null ? 0 : x);
		this.y = (y == null ? 0 : y);
		this.w = (w == null ? 0 : w);
		this.h = (h == null ? 0 : h);
	}
	
// public methods:
	/**
	* Returns a clone of this Rectangle.
	**/
	p.clone = function() {
		return new Rectangle(this.x, this.y, this.w, this.h);
	}

	/**
	* Returns a string representation of this object.
	**/
	p.toString = function() {
		return "[Rectangle (x="+this.x+" y="+this.y+" w="+this.w+" h="+this.h+")]";
	}
	
window.Rectangle = Rectangle;
}(window));