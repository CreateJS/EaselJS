/*
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
*/

/**
* The Easel Javascript library provides a retained graphics mode for canvas 
* including a full, hierarchical display list, a core interaction model, and 
* helper classes to make working with Canvas much easier.
* @module EaselJS
**/

// Node.js-ification
if (typeof module !== 'undefined' && module.exports) {
    var DisplayObject = require('./DisplayObject').DisplayObject;
    var Canvas = require('canvas');
    var Image  = Canvas.Image;
    var window = module.exports;
}

(function(window) {

/**
* A Bitmap represents an Image, Canvas, or Video in the display list.
* @class Bitmap
* @extends DisplayObject
* @constructor
* @param {Image | HTMLCanvasElement | HTMLVideoElement | String} imageOrUri The source object or URI to an image to display. This can be either an Image, Canvas, or Video object, or a string URI to an image file to load and use. If it is a URI, a new Image object will be constructed and assigned to the .image property.
**/
var Bitmap = function(imageOrUri) {
  this.initialize(imageOrUri);
}
var p = Bitmap.prototype = new DisplayObject();

// public properties:
	/**
	 * The image to render. This can be an Image, a Canvas, or a Video.
	 * @property image
	 * @type Image | HTMLCanvasElement | HTMLVideoElement
	 **/
	p.image = null;
	
	/**
	 * Whether or not the Bitmap should be draw to the canvas at whole pixel coordinates.
	 * @property snapToPixel
	 * @type Boolean
	 * @default true
	 **/
	p.snapToPixel = true;

    /**
     * X Coordinate from which to draw the image inside the bitmap container
     * @property imageX
     * @type number
     * @default 0
     */
    p.imageX = 0;

    /**
     * Y Coordinate from which to draw the image inside the bitmap container
     * @property imageY
     * @type number
     * @default 0
     */
    p.imageY = 0;

    /**
     * Scale of the image when drawn in the bitmap container
     * @property imageScale
     * @type number
     * @default 1
     */
    p.imageScale = 1;
	
	// constructor:

	/**
	 * @property DisplayObject_initialize
	 * @type Function
    * @private
	 **/
	p.DisplayObject_initialize = p.initialize;

	/** 
	 * Initialization method.
	 * @method initialize
	 * @protected
	 **/
	p.initialize = function(imageOrUri) {
		this.DisplayObject_initialize();
		if (typeof imageOrUri == "string") {
			this.image = new Image();
			this.image.src = imageOrUri;
		} else {
			this.image = imageOrUri;
		}
	}
	
// public methods:

	/**
	 * Returns true or false indicating whether the display object would be visible if drawn to a canvas.
	 * This does not account for whether it would be visible within the boundaries of the stage.
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method isVisible
	 * @return {Boolean} Boolean indicating whether the display object would be visible if drawn to a canvas
	 **/
	p.isVisible = function() {
		return this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && this.image && (this.image.complete || this.image.getContext || this.image.readyState >= 2);
	}

	/**
	 * @property DisplayObject_draw
	 * @type Function
	 * @private
	 **/
	p.DisplayObject_draw = p.draw;
	
	/**
	 * Draws the display object into the specified context ignoring it's visible, alpha, shadow, and transform.
	 * Returns true if the draw was handled (useful for overriding functionality).
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method draw
	 * @param {CanvasRenderingContext2D} ctx The canvas 2D context object to draw into.
	 * @param {Boolean} ignoreCache Indicates whether the draw operation should ignore any current cache. 
	 * For example, used for drawing the cache (to prevent it from simply drawing an existing cache back
	 * into itself).
	 **/
	p.draw = function(ctx, ignoreCache) {
		if (this.DisplayObject_draw(ctx, ignoreCache)) { return true; }
		this.beginClip(ctx);
		ctx.drawImage(this.image, this.imageX, this.imageY, this.image.width * this.imageScale, this.image.height * this.imageScale);
		this.endClip(ctx);
		return true;
	}
	
	//Note, the doc sections below document using the specified APIs (from DisplayObject)  from
	//Bitmap. This is why they have no method implementations.
	
	/**
	 * Because the content of a Bitmap is already in a simple format, cache is unnecessary for Bitmap instances.
	 * You should not cache Bitmap instances as it can degrade performance.
	 * @method cache
	 **/
	
	/**
	 * Because the content of a Bitmap is already in a simple format, cache is unnecessary for Bitmap instances.
	 * You should not cache Bitmap instances as it can degrade performance.
	 * @method updateCache
	 **/
	
	/**
	 * Because the content of a Bitmap is already in a simple format, cache is unnecessary for Bitmap instances.
	 * You should not cache Bitmap instances as it can degrade performance.
	 * @method uncache
	 **/
	
	/**
	 * Returns a clone of the Bitmap instance.
	 * @method clone
	 * @return {Bitmap} a clone of the Bitmap instance.
	 **/
	p.clone = function() {
		var o = new Bitmap(this.image);
		this.cloneProps(o);
		o.imageScale = this.imageScale;
		o.imageX     = this.imageX;
		o.imageY     = this.imageY;
		o.image      = this.image;
		return o;
	}
	
	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 **/
	p.toString = function() {
		return "[Bitmap (name="+  this.name +")]";
	}

// private methods:

window.Bitmap = Bitmap;
}(window));