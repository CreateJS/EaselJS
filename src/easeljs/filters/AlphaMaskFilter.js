/*
* AlphaMaskFilter
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

(function(ns) {

/**
 * Applies the alpha from the mask image (or canvas) to the target, such that the alpha channel of the result will
 * be derived from the mask, and the RGB channels will be copied from the target. This can be used, for example, to apply
 * an alpha mask to a display object. This can also be used to combine a JPG compressed RGB image with a PNG32 alpha mask, which can
 * result in a much smaller file size than a single PNG32 containing ARGB.
 *  IMPORTANT NOTE: This filter currently does not support the targetCtx, or targetX/Y parameters correctly.
 * @class AlphaMaskFilter
 * @augments Filter
 * @constructor
 * @param {Image} mask 
 **/
var AlphaMaskFilter = function(mask) {
  this.initialize(mask);
}
var p = AlphaMaskFilter.prototype = new ns.Filter();

// constructor:
	/** @ignore */
	p.initialize = function(mask) {
		this.mask = mask;
	}

// public properties:

	/**
	 * The image (or canvas) to use as the mask.
	 * @property mask
	 * @type Image
	 **/
	p.mask = null;

// public methods:

	/**
	 * Applies the filter to the specified context. IMPORTANT NOTE: This filter currently does not support the targetCtx,
	 * or targetX/Y parameters correctly.
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
		if (!mask) { return true; }
		targetCtx = targetCtx || ctx;
		if (targetX == null) { targetX = x; }
		if (targetY == null) { targetY = y; }
		
		targetCtx.save();
		if (ctx != targetCtx) {
			// TODO: support targetCtx and targetX/Y
			// clearRect, then draw the ctx in?
		}
		
		targetCtx.globalCompositeOperation = "destination-in";
		targetCtx.drawImage(this.mask, targetX, targetY);
		targetCtx.restore();
		return true;
	}

	/**
	 * Returns a clone of this object.
	 **/
	p.clone = function() {
		return new AlphaMaskFilter(this.mask);
	}

	/**
	 * Returns a string representation of this object.
	 **/
	p.toString = function() {
		return "[AlphaMaskFilter]";
	}

// private methods:



ns.AlphaMaskFilter = AlphaMaskFilter;
}(createjs||(createjs={})));
var createjs;