/**
* Bitmap by Grant Skinner. Dec 5, 2010
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
* Constructs a Bitmap object with the specified source image.
* @param image The Image, Canvas, or Video to render to the display list.
* @class A Bitmap represents an Image, Canvas, or Video in the display list.
* @augments DisplayObject
**/
function Bitmap(image) {
  this.init(image);
}
var p = Bitmap.prototype = new DisplayObject();

// public properties:
	/** The image to render. This can be an Image, a Canvas, or a Video. **/
	p.image = null;
	
// constructor:
	/** @private **/
	p._init = p.init;
	/** @private **/
	p.init = function(image) {
		this._init();
		this.image = image;
	}
	
// public methods:
	/** @borrows DisplayObject#draw as this.draw **/
	p._draw = p.draw;
	p.draw = function(ctx,ignoreCache) {
		if (this.image == null || !(this.image.complete || this.image.getContext)) { return false; }
		if (!this._draw(ctx,ignoreCache)) { return false; }
		ctx.drawImage(this.image,0,0);
	}
	
	/**
	* Because the content of a Bitmap is already in a simple format, cache is unnecessary for Bitmap instances.
	**/
	p.cache = function() {}
	
	/**
	* Because the content of a Bitmap is already in a simple format, cache is unnecessary for Bitmap instances.
	**/
	p.uncache = function() {}
	
	p.clone = function() {
		var o = new Bitmap(this.image);
		this.cloneProps(o);
		return o;
	}
	
	p.toString = function() {
		return "[Bitmap (name="+  this.name +")]";
	}

window.Bitmap = Bitmap;
}(window));