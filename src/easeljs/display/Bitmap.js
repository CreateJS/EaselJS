/**
* Bitmap by Grant Skinner. Dec 5, 2010
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
* Constructs a Bitmap object with the specified source image.
* @param image The Image, Canvas, or Video to render to the display list.
* @class A Bitmap represents an Image, Canvas, or Video in the display list.
* @augments DisplayObject
**/
Bitmap = function(image) {
  this.initialize(image);
}
Bitmap.prototype = new DisplayObject();

// public properties:
	/** The image to render. This can be an Image, a Canvas, or a Video. */
	Bitmap.prototype.image = null;
	Bitmap.prototype.snapToPixel = true;
	
// constructor:
	/** @private */
	Bitmap.prototype.DisplayObject_initialize = Bitmap.prototype.initialize;
	/** @ignore */
	Bitmap.prototype.initialize = function(image) {
		this.DisplayObject_initialize();
		this.image = image;
	}
	
// public methods:

	Bitmap.prototype.isVisible = function() {
		return this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && this.image && (this.image.complete || this.image.getContext);
	}

	/** @borrows DisplayObject#draw as this.draw */
	Bitmap.prototype.DisplayObject_draw = Bitmap.prototype.draw;
	Bitmap.prototype.draw = function(ctx, ignoreCache) {
		if (this.DisplayObject_draw(ctx, ignoreCache)) { return true; }
		ctx.drawImage(this.image, 0, 0);
		return true;
	}
	
	/**
	* Because the content of a Bitmap is already in a simple format, cache is unnecessary for Bitmap instances.
	**/
	Bitmap.prototype.cache = function() {}
	/**
	* Because the content of a Bitmap is already in a simple format, cache is unnecessary for Bitmap instances.
	**/
	Bitmap.prototype.updateCache = function() {}
	/**
	* Because the content of a Bitmap is already in a simple format, cache is unnecessary for Bitmap instances.
	**/
	Bitmap.prototype.uncache = function() {}
	
	Bitmap.prototype.clone = function() {
		var o = new Bitmap(this.image);
		this.cloneProps(o);
		return o;
	}
	
	Bitmap.prototype.toString = function() {
		return "[Bitmap (name="+  this.name +")]";
	}

window.Bitmap = Bitmap;
}(window));