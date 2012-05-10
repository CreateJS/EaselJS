/*
* 
* ImageMaskFilter
* 
* @author John Bower
* @link http://www.industrialassets.co.uk
* 
*/

(function(window) {

/**
* Applies image mask transforms.
* @class ImageMaskFilter
* @constructor
* @augments Filter
* @param {Image} maskImage
* @param {Number} width
* @param {Number} height
**/
var ImageMaskFilter = function(maskImage, width, height) {
  this.initialize(maskImage, width, height);
}
var p = ImageMaskFilter.prototype = new Filter();

// public properties:
	/**
	 * Mask Image.
	 * @property maskImage
	 * @type Image
	 **/
	p.maskImage = null;
	
	
	/**
	 * Mask Canvas Context.
	 * @property maskCanvas
	 * @type Context
	 **/
	p.maskCanvas = null;
	
	
	/**
	 * Filtered Image Width.
	 * @property imageWidth
	 * @type Number
	 **/
	p.imageWidth = 0;
	
	
	/**
	 * Filtered Image Height.
	 * @property imageHeight
	 * @type Number
	 **/
	p.imageHeight = 0;
	
	

// constructor:
	/**
	 * Initialization method.
	 * @method initialize
	 * @param {Image} maskImage
	 * @param {Number} imageWidth
	 * @param {Number} imageHeight
	 * @protected
	 **/
	p.initialize = function(maskImage, imageWidth, imageHeight) {
		this.maskImage = maskImage;
		this.imageWidth = imageWidth;
		this.imageHeight = imageHeight;
		
		// create an invisible backBuffer canvas
		var c = document.createElement("canvas");
		console.log(this.maskImage);
		c.setAttribute('width',this.maskImage.width);  
      	c.setAttribute('height',this.maskImage.height);
      	this.maskCanvas = c.getContext('2d');
      	
      	// draw mask to the backBuffer Canvas
		this.maskCanvas.drawImage(this.maskImage, 0,0, this.maskImage.width, this.maskImage.height, 0, 0, this.imageWidth, this.imageHeight);   	
      	
	}

// public methods:
	/**
	 * Applies the filter to the specified context.
	 * @method applyFilter
	 * @param ctx The 2D context to use as the source.
	 * @param x The x position to use for the source rect.
	 * @param y The y position to use for the source rect.
	 * @param width The width to use for the source rect.
	 * @param height The height to use for the source rect.
	 * @param targetCtx Optional. The 2D context to draw the result to. Defaults to the context passed to ctx.
	 * @param targetX Optional. The x position to draw the result to. Defaults to the value passed to x.
	 * @param targetY Optional. The y position to draw the result to. Defaults to the value passed to y.
	 **/
	p.applyFilter = function(ctx, x, y, width, height, targetCtx, targetX, targetY) {
		targetCtx = targetCtx || ctx;
		if (targetX == null) { targetX = x; }
		if (targetY == null) { targetY = y; }
		try {
			var imageData = ctx.getImageData(x, y, width, height);
			
			
			var maskImageData = this.maskCanvas.getImageData(x, y, width, height);
		} catch(e) {
			//if (!this.suppressCrossDomainErrors) throw new Error("unable to access local image data: " + e);
			return false;
		}
		var data = imageData.data;
		var maskdata = maskImageData.data;
		var l = data.length;
		for (var i=0; i<l; i+=4) {
			data[i] = data[i];
			data[i+1] = data[i+1];
			data[i+2] = data[i+2];
			data[i+3] = 255 - maskdata[i];
		}
		imageData.data = data;
		targetCtx.putImageData(imageData, targetX, targetY);
		return true;
	}

	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 **/
	p.toString = function() {
		return "[ImageMaskFilter]";
	}


	/**
	 * Returns a clone of this ImageMaskFilter instance.
	 * @method clone
	 @return {ImageMaskFilter} A clone of the current ImageMaskFilter instance.
	 **/
	p.clone = function() {
		return new ImageMaskFilter(maskImage);
	}

window.ImageMaskFilter = ImageMaskFilter;
}(window));