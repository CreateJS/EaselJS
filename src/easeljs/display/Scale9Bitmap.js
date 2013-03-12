/*
* Scale9Bitmap
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

// namespace:
this.createjs = this.createjs||{};

(function() {

/**
 * A Scale9Bitmap represents an Image, Canvas, or Video in the display list and is split into nine separate regions
 * to allow independent scaling of each region. This display object can be used to create scaling UI skins, such as
 * buttons and backgrounds with rounded corners. A Scale9Bitmap can be instantiated using an existing HTML element,
 * or a string, similar to a Bitmap.
 *
 * <h4>Example</h4>
 *      var bitmap = new createjs.Scale9Bitmap("imagePath.jpg", new createjs.Rectangle(14, 14, 3, 3));
 *      bitmap.setDrawSize(100, 100);
 *
 * Note: When a string path or image tag that is not yet loaded is used, the stage may need to be redrawn before it
 * will be displayed.
 *
 * @class Scale9Bitmap
 * @extends DisplayObject
 * @constructor
 * @param {Image | HTMLCanvasElement | HTMLVideoElement | String} imageOrUri The source object or URI to an image to display. This can be either an Image, Canvas, or Video object, or a string URI to an image file to load and use. If it is a URI, a new Image object will be constructed and assigned to the .image property.
 * @param {Rectangle} scale9Grid The inner rectangle of the nine region grid.
 **/
var Scale9Bitmap = function(imageOrUri, scale9Grid) {
  this.initialize(imageOrUri, scale9Grid);
}
var p = Scale9Bitmap.prototype = new createjs.DisplayObject();

// public properties:

	/**
	 * The image to render. This can be an Image, a Canvas, or a Video.
	 * @property image
	 * @type Image | HTMLCanvasElement | HTMLVideoElement
	 **/
	p.image = null;
	
	/**
	 * Whether or not the Scale9Bitmap should be draw to the canvas at whole pixel coordinates.
	 * @property snapToPixel
	 * @type Boolean
	 * @default true
	 **/
	p.snapToPixel = true;

	/**
	 * Specifies the inner rectangle of the nine region scaling grid.
	 * @property scale9Grid
	 * @type Rectangle
	 */
	p.scale9Grid = null;

	/**
	 * Specifies the width of the drawn Scale9Bitmap.
	 * @property drawWidth
	 * @type Number
	 * @default The original width of the image.
	 */
	p.drawWidth = 0;

	/**
	 * Specifies the height of the drawn Scale9Bitmap.
	 * @property drawHeight
	 * @type Number
	 * @default The original height of the image.
	 */
	p.drawHeight = 0;
	
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
	p.initialize = function(imageOrUri, scale9Grid) {
		this.DisplayObject_initialize();
		if (typeof imageOrUri == "string") {
			this.image = new Image();
			this.image.src = imageOrUri;
		} else {
			this.image = imageOrUri;
		}
		this.drawWidth = this.image.width;
		this.drawHeight = this.image.height;
		this.scale9Grid = scale9Grid;
	}
	
// public methods:

	/**
	 * Changes the dimensions used the draw the Scale9Bitmap.
	 * 
	 * @method setDrawSize
	 * @param {Number} newWidth The new width of the drawn Scale9Bitmap.
	 * @param {Number} newHeight The new height of the drawn Scale9Bitmap.
	 */
	p.setDrawSize = function(newWidth, newHeight) {
		this.drawWidth = newWidth;
		this.drawHeight = newHeight;
	}

	/**
	 * Returns true or false indicating whether the display object would be visible if drawn to a canvas.
	 * This does not account for whether it would be visible within the boundaries of the stage.
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method isVisible
	 * @return {Boolean} Boolean indicating whether the display object would be visible if drawn to a canvas
	 **/
	p.isVisible = function() {
		var hasContent = this.cacheCanvas || (this.image && (this.image.complete || this.image.getContext || this.image.readyState >= 2));
		return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent);
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

		var left = this.scale9Grid.x;
		var top = this.scale9Grid.y;
		var centerX = this.scale9Grid.width;
		var centerY = this.scale9Grid.height;
		var right = this.image.width - centerX - left;
		var bottom = this.image.height - centerY - top;
		var scaledCenterX = this.drawWidth - left - right;
		var scaledCenterY = this.drawHeight - top - bottom;

		ctx.drawImage(this.image, 0, 0, left, top, 0, 0, left, top);
		ctx.drawImage(this.image, left, 0, centerX, top, left, 0, scaledCenterX, top);
		ctx.drawImage(this.image, left + centerX, 0, right, top, left + scaledCenterX, 0, right, top);

		ctx.drawImage(this.image, 0, top, left, centerY, 0, top, left, scaledCenterY);
		ctx.drawImage(this.image, left, top, centerX, centerY, left, top, scaledCenterX, scaledCenterY);
		ctx.drawImage(this.image, left + centerX, top, right, centerY, left + scaledCenterX, top, right, scaledCenterY);

		ctx.drawImage(this.image, 0, top + centerY, left, bottom, 0, top + scaledCenterY, left, bottom);
		ctx.drawImage(this.image, left, top + centerY, centerX, bottom, left, top + scaledCenterY, scaledCenterX, bottom);
		ctx.drawImage(this.image, left + centerX, top + centerY, right, bottom, left + scaledCenterX, top + scaledCenterY, right, bottom);

		return true;
	}
	
	/**
	 * Returns a clone of the Scale9Bitmap instance.
	 * @method clone
	 * @return {Scale9Bitmap} a clone of the Scale9Bitmap instance.
	 **/
	p.clone = function() {
		var o = new Scale9Bitmap(this.image, this.scale9Grid.clone());
		if (this.sourceRect) { o.sourceRect = this.sourceRect.clone(); }
		this.cloneProps(o);
		return o;
	}
	
	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 **/
	p.toString = function() {
		return "[Scale9Bitmap (name="+  this.name +")]";
	}

// private methods:

createjs.Scale9Bitmap = Scale9Bitmap;
}());