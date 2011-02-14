/**
* Shape by Grant Skinner. Dec 5, 2010
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
* Constructs a new Shape instance.
* @param graphics Optional. The graphics instance to display. If null, a new Graphics instance will be created.
* @class A Shape allows you to display vector art in the display list. It composites a Graphics instance which exposes all of the vector
* drawing methods. The Graphics instance can be shared between multiple Shape instances to display the same vector graphics with different
* positions or transforms. If the vector art will not change between draws, you may want to use the cache() method to reduce the rendering cost.
* @augments DisplayObject
**/
Shape = function(graphics) {
  this.initialize(graphics);
}
Shape.prototype = new DisplayObject();

// public properties:
	/** The graphics instance to display.  */
	Shape.prototype.graphics = null;
	
// constructor:
	/** @ignore */
	Shape.prototype.DisplayObject_initialize = Shape.prototype.initialize;
	/** @ignore */
	Shape.prototype.initialize = function(graphics) {
		this.DisplayObject_initialize();
		this.graphics = graphics ? graphics : new Graphics();
	}

// public methods:
	Shape.prototype.isVisible = function() {
		return this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && this.graphics;
	}

	Shape.prototype.DisplayObject_draw = Shape.prototype.draw;
	Shape.prototype.draw = function(ctx, ignoreCache) {
		if (this.DisplayObject_draw(ctx, ignoreCache)) { return true; }
		this.graphics.draw(ctx);
		return true;
	}
	
	/**
	* Returns a clone of this Shape. Some properties that are specific to this instance's current context are reverted to their defaults (for example .parent).
	* @param recursive If true, this Shape's Graphics instance will also be cloned. If false, the Graphics instance will be shared with the new Shape.
	**/
	Shape.prototype.clone = function(recursive) {
		var o = new Shape((recursive && this.graphics) ? this.graphics.clone() : this.graphics);
		this.cloneProps(o);
		return o;
	}
		
	Shape.prototype.toString = function() {
		return "[Shape (name="+  this.name +")]";
	}

window.Shape = Shape;
}(window));