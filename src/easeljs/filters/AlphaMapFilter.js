/*
* AlphaMapFilter
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
 * Applies a greyscale alpha map image (or canvas) to the target, such that the alpha channel of the result will
 * be copied from the red channel of the map, and the RGB channels will be copied from the target.
 *
 * Generally, it is recommended that you use {{#crossLink "AlphaMaskFilter"}}{{/crossLink}}, because it has much better
 * performance.
 *
 * See {{#crossLink "Filter"}}{{/crossLink}} for an example of how to apply filters.
 * @class AlphaMapFilter
 * @extends Filter
 * @constructor
 * @param {Image} alphaMap The greyscale image (or canvas) to use as the alpha value for the result. This should be
 * exactly the same dimensions as the target.
 **/
var AlphaMapFilter = function(alphaMap) {
  this.initialize(alphaMap);
}
var p = AlphaMapFilter.prototype = new createjs.Filter();

// constructor:
	/** @ignore */
	p.initialize = function(alphaMap) {
		this.alphaMap = alphaMap;
	}

// public properties:

	/**
	 * The greyscale image (or canvas) to use as the alpha value for the result. This should be exactly the same
	  * dimensions as the target.
	 * @property alphaMap
	 * @type Image
	 **/
	p.alphaMap = null;
	
// private properties:
	p._alphaMap = null;
	p._mapData = null;

// public methods:

	/**
	 * Applies the filter to the specified context.
	 * @method applyFilter
	 * @param {CanvasRenderingContext2D} ctx The 2D context to use as the source.
	 * @param {Number} x The x position to use for the source rect.
	 * @param {Number} y The y position to use for the source rect.
	 * @param {Number} width The width to use for the source rect.
	 * @param {Number} height The height to use for the source rect.
	 * @param {CanvasRenderingContext2D} targetCtx Optional. The 2D context to draw the result to. Defaults to the context passed to ctx.
	 * @param {Number} targetX Optional. The x position to draw the result to. Defaults to the value passed to x.
	 * @param {Number} targetY Optional. The y position to draw the result to. Defaults to the value passed to y.
	 * @return {Boolean}
	 **/
	p.applyFilter = function(ctx, x, y, width, height, targetCtx, targetX, targetY) {
		if (!this.alphaMap) { return true; }
		if (!this._prepAlphaMap()) { return false; }
		targetCtx = targetCtx || ctx;
		if (targetX == null) { targetX = x; }
		if (targetY == null) { targetY = y; }
		
		try {
			var imageData = ctx.getImageData(x, y, width, height);
		} catch(e) {
			//if (!this.suppressCrossDomainErrors) throw new Error("unable to access local image data: " + e);
			return false;
		}
		var data = imageData.data;
		var map = this._mapData;
		var l = data.length;
		for (var i=0; i<l; i+=4) {
			data[i+3] = map[i]||0;
		}
		imageData.data = data;
		targetCtx.putImageData(imageData, targetX, targetY);
		return true;
	}

	/**
	 * Returns a clone of this object.
	 * @return {AlphaMapFilter} A clone of the current AlphaMapFilter instance.
	 **/
	p.clone = function() {
		return new AlphaMapFilter(this.mask);
	}

	/**
	 * Returns a string representation of this object.
	 * @return {String} a string representation of the instance.
	 **/
	p.toString = function() {
		return "[AlphaMapFilter]";
	}

// private methods:
	p._prepAlphaMap = function() {
		if (!this.alphaMap) { return false; }
		if (this.alphaMap == this._alphaMap && this._mapData) { return true; }
		
		this._mapData = null;
		var map = this._alphaMap = this.alphaMap;
		var canvas = map;
		if (map instanceof HTMLCanvasElement) {
			ctx = canvas.getContext("2d");
		} else {
			canvas = createjs.createCanvas?createjs.createCanvas():document.createElement("canvas");
			canvas.width = map.width;
			canvas.height = map.height;
			ctx = canvas.getContext("2d");
			ctx.drawImage(map,0,0);
		}
		
		try {
			var imgData = ctx.getImageData(0, 0, map.width, map.height);
		} catch(e) {
			//if (!this.suppressCrossDomainErrors) throw new Error("unable to access local image data: " + e);
			return false;
		}
		this._mapData = imgData.data;
		return true;
	}


createjs.AlphaMapFilter = AlphaMapFilter;
}());