/*
* Scale3Bitmap
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
 * A Scale3Bitmap represents an Image, Canvas, or Video in the display list and is split into three separate
 * regions to allow independent scaling of each region. This display object can be used to easily display and scale
 * a "pill" shaped UI element, such as a button. A Scale3Bitmap can be instantiated using an existing HTML element,
 * or a string, similar to a Bitmap.
 *
 * <h4>Example</h4>
 *      var bitmap = new createjs.Scale3Bitmap("imagePath.jpg", 14, 3, createjs.Scale3Bitmap.HORIZONTAL);
 *      bitmap.setDrawSize(100, bitmap.image.height);
 *
 * Note: When a string path or image tag that is not yet loaded is used, the stage may need to be redrawn before it
 * will be displayed.
 *
 * @class Scale3Bitmap
 * @extends DisplayObject
 * @constructor
 * @param {Image | HTMLCanvasElement | HTMLVideoElement | String} imageOrUri The source object or URI to an image to display. This can be either an Image, Canvas, or Video object, or a string URI to an image file to load and use. If it is a URI, a new Image object will be constructed and assigned to the .image property.
 * @param {Number} scale3Region1 The first of the three scaling regions.
 * @param {Number} scale3Region2 The second of the three scaling regions.
 * @param {String} direction The layout direction of the regions. One of Scale3Bitmap.HORIZONTAL or Scale3Bitmap.VERTICAL.
 **/
var Scale3Bitmap = function(imageOrUri, scale3Region1, scale3Region2, direction) {
  this.initialize(imageOrUri, scale3Region1, scale3Region2, direction);
}
var p = Scale3Bitmap.prototype = new createjs.DisplayObject();

	/**
	 * Read-only. The layout direction of the three Scale3Bitmap regions will be horizontal, left to right.
	 * This is the default direction.
	 * @property HORIZONTAL
	 * @static
	 * @type String
	 * @default "horizontal"
	 **/
	Scale3Bitmap.HORIZONTAL = "horizontal";

	/**
	 * Read-only. The layout direction of the three Scale3Bitmap regions will be vertical, top to bottom.
	 * @property VERTICAL
	 * @static
	 * @type String
	 * @default "vertical"
	 **/
	Scale3Bitmap.VERTICAL = "vertical";

// public properties:

	/**
	 * The image to render. This can be an Image, a Canvas, or a Video.
	 * @property image
	 * @type Image | HTMLCanvasElement | HTMLVideoElement
	 **/
	p.image = null;
	
	/**
	 * Whether or not the Scale3Bitmap should be draw to the canvas at whole pixel coordinates.
	 * @property snapToPixel
	 * @type Boolean
	 * @default true
	 **/
	p.snapToPixel = true;

	/**
	 * The layout direction of the three scaling regions of the Scale3Bitmap.
	 * @property direction
	 * @type String
	 * @default "horizontal"
	 */
	p.direction = Scale3Bitmap.DIRECTION_HORIZONTAL;

	/**
	 * Specifies the first of the three scaling regions.
	 * @property scale3Region1
	 * @type Number
	 */
	p.scale3Region1 = 0;

	/**
	 * Specifies the second of the three scaling regions.
	 * @property scale3Region2
	 * @type Number
	 */
	p.scale3Region2 = 0;

	/**
	 * Specifies the width of the drawn Scale3Bitmap.
	 * @property drawWidth
	 * @type Number
	 * @default The original width of the image.
	 */
	p.drawWidth = 0;

	/**
	 * Specifies the height of the drawn Scale3Bitmap.
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
	p.initialize = function(imageOrUri, scale3Region1, scale3Region2, direction) {
		this.DisplayObject_initialize();
		if (typeof imageOrUri == "string") {
			this.image = new Image();
			this.image.src = imageOrUri;
		} else {
			this.image = imageOrUri;
		}
		this.drawWidth = this.image.width;
		this.drawHeight = this.image.height;
		this.direction = direction||Scale3Bitmap.HORIZONTAL;
		this.scale3Region1 = scale3Region1;
		this.scale3Region2 = scale3Region2;
	}
	
// public methods:

	/**
	 * Changes the dimensions used the draw the Scale3Bitmap.
	 * 
	 * @method setDrawSize
	 * @param {Number} newWidth The new width of the drawn Scale3Bitmap.
	 * @param {Number} newHeight The new height of the drawn Scale3Bitmap.
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

		if (this.direction == Scale3Bitmap.DIRECTION_VERTICAL) {
			var scaleRegion3 = this.image.height - this.scale3Region1 - this.scale3Region2;
			var oppositeEdgeScale = this.drawWidth / this.image.width;
			var scaledFirstRegion = this.scale3Region1 * oppositeEdgeScale;
			var scaledThirdRegion = scaleRegion3 * oppositeEdgeScale;
			var scaledSecondRegion = this.drawHeight - scaledFirstRegion - scaledThirdRegion;

			ctx.drawImage(this.image, 0, 0, this.image.width, this.scale3Region1, 0, 0, this.drawWidth, scaledFirstRegion);
			ctx.drawImage(this.image, 0, this.scale3Region1, this.image.width, this.scale3Region2, 0, scaledFirstRegion, this.drawWidth, scaledSecondRegion);
			ctx.drawImage(this.image, 0, this.scale3Region1 + this.scale3Region2, this.image.width, scaleRegion3, 0, scaledFirstRegion + scaledSecondRegion, this.drawWidth, scaledThirdRegion);
		}
		else {
			var scaleRegion3 = this.image.width - this.scale3Region1 - this.scale3Region2;
			var oppositeEdgeScale = this.drawHeight / this.image.height;
			var scaledFirstRegion = this.scale3Region1 * oppositeEdgeScale;
			var scaledThirdRegion = scaleRegion3 * oppositeEdgeScale;
			var scaledSecondRegion = this.drawWidth - scaledFirstRegion - scaledThirdRegion;

			ctx.drawImage(this.image, 0, 0, this.scale3Region1, this.image.height, 0, 0, scaledFirstRegion, this.drawHeight);
			ctx.drawImage(this.image, this.scale3Region1, 0, this.scale3Region2, this.image.height, scaledFirstRegion, 0, scaledSecondRegion, this.drawHeight);
			ctx.drawImage(this.image, this.scale3Region1 + this.scale3Region2, 0, scaleRegion3, this.image.height, scaledFirstRegion + scaledSecondRegion, 0, scaledThirdRegion, this.drawHeight);
		}
		
		return true;
	}
	
	/**
	 * Returns a clone of the Scale3Bitmap instance.
	 * @method clone
	 * @return {Scale3Bitmap} a clone of the Scale3Bitmap instance.
	 **/
	p.clone = function() {
		var o = new Scale3Bitmap(this.image, this.scale9Grid.clone());
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
		return "[Scale3Bitmap (name="+  this.name +")]";
	}

// private methods:

createjs.Scale3Bitmap = Scale3Bitmap;
}());