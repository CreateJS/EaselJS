/**
* Shadow by Grant Skinner. Dec 5, 2010
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
* Constructs a new Shadow object.
* @param color The color of the shadow.
* @param offsetX The x offset of the shadow.
* @param offsetY The y offset of the shadow.
* @param blur The blur of the shadow.
* @class Encapsulates the properties required to define a shadow to apply to a DisplayObject via it's .shadow property.
**/
function Shadow(color, offsetX, offsetY, blur) {
  this.init(color, offsetX, offsetY, blur);
}
var p = Shadow.prototype;
	
// static public properties:
	/**
	* An identity shadow object (all properties are set to 0). Read-only.
	* @static
	**/
	Shadow.identity = null; // set at bottom of class definition.
	
// public properties:
	/** The blur of the shadow. **/
	p.blur = 0;
	/** The color of the shadow. **/
	p.color = 0;
	/** The x offset of the shadow. **/
	p.offsetX = 0;
	/** The y offset of the shadow. **/
	p.offsetY = 0;
	
// constructor:
	/** @private **/
	p.init = function(color, offsetX, offsetY, blur) {
		this.color = color;
		this.offsetX = offsetX;
		this.offsetY = offsetY;
		this.blur = blur;
	}
	
// public methods:
	/**
	* Returns a string representation of this object.
	**/
	p.toString = function() {
		return "[Shadow]";
	}
	
	
	/**
	* Returns a clone of this object.
	**/
	p.clone = function() {
		return new Shadow(this.color, this.offsetX, this.offsetY, this.blur);
	}
	
	// this has to be populated after the class is defined:
	Shadow.identity = new Shadow(0, 0, 0, 0);
	
window.Shadow = Shadow;
}(window));