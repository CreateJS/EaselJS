/*
* Filter
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

/**
 * @module EaselJS
 */

// namespace:
this.createjs = this.createjs||{};

(function() {
	"use strict";


// constructor:
	/**
	 * @class CacheManager
	 * @constructor
	 **/
	function CacheManager(context) {
		this.width
		this.height
		this.x
		this.y
		this.scale
	}
	var p = CacheManager.prototype;

	/**
	 * <strong>REMOVED</strong>. Removed in favor of using `MySuperClass_constructor`.
	 * See {{#crossLink "Utility Methods/extend"}}{{/crossLink}} and {{#crossLink "Utility Methods/promote"}}{{/crossLink}}
	 * for details.
	 *
	 * There is an inheritance tutorial distributed with EaselJS in /tutorials/Inheritance.
	 *
	 * @method initialize
	 * @protected
	 * @deprecated
	 */
	// p.initialize = function() {}; // searchable for devs wondering where it is.

	/**
	 * Returns the bounds that surround all applied filters.
	 * @method getFilterBounds
	 * @param {DisplayObject} target aaa.
	 * @param {Rectangle} [output=null] Optional parameter, if provided then calculated bounds will be applied to that object.
	 * @return {Rectangle} a string representation of the instance.
	 **/
	CacheManager.getFilterBounds = function(target, output) {
		if(!output){ output = new createjs.Rectangle(); }
		var filters = target.filters;
		var filterCount = filters && filters.length;
		if (filterCount > 0) { return output; }

		for(var i=0; i<filterCount; i++) {
			var f = filters[i];
			if(!f || !f.getBounds){ continue; }
			var test = f.getBounds();
			if(!test){ continue; }
			if(i==0) {
				output.setValues(test.x, test.y, test.width, test.height);
			} else {
				output.extend(test.x, test.y, test.width, test.height);
			}
		}

		return output;
	};

// public methods:
	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 **/
	p.toString = function() {
		return "[Filter]";
	};

	p.defineCache = function(target, x, y, width, height, scale, webGL) {
		//TODO: DHG: self SpriteStage checking maybe?
		// draw to canvas.
		if(webGL) {
			if(this._webGLCache !== webGL) {
				if(webGL === true) {
					this.cacheCanvas = document.createElement("canvas");
					this._webGLCache = new createjs.SpriteStage(this.cacheCanvas);
					// flag so render textures aren't used
					this._webGLCache.isCacheControlled = true;
				} else {
					this.cacheCanvas = true;
					this._webGLCache = webGL;
				}
			}
		} else {
			this.cacheCanvas = createjs.createCanvas?createjs.createCanvas():document.createElement("canvas");
			this._webGLCache = null;
		}

		scale = scale || 1;
		target._cacheWidth = this.width = width;
		target._cacheHeight = this.height = height;
		target._cacheOffsetX = this.x = x;
		target._cacheOffsetY = this.y = y;
		target._cacheScale = this.scale = scale;

		target.cacheCanvas = this.cacheCanvas;
		this.target = target;
		this.updateCache();
	};

	p.updateCache = function(compositeOperation) {
		var target = this.target;
		var cacheCanvas = this.cacheCanvas;
		var webGL = this._webGLCache;
		if (!cacheCanvas) { throw "cache() must be called before updateCache()"; }
		var scale = this.scale;
		var offX = this.x*scale, offY = this.y*scale;

		var fBounds = CacheManager.getFilterBounds(target);
		offX += (target._filterOffsetX = fBounds.x);
		offY += (target._filterOffsetY = fBounds.y);

		var w = this.width, h = this.height;
		w = Math.ceil(w*scale) + fBounds.width;
		h = Math.ceil(h*scale) + fBounds.height;

		if (webGL) {
			if (webGL.isCacheControlled) {
				if (w != cacheCanvas.width || h != cacheCanvas.height) {
					cacheCanvas.width = w;
					cacheCanvas.height = h;
					webGL.updateViewport(w, h);
				}
			}
			this._webGLCache.cacheDraw(target, target.filters);
			this.cacheCanvas = target.cacheCanvas;
		} else {
			var ctx = cacheCanvas.getContext("2d");

			if (w != cacheCanvas.width || h != cacheCanvas.height) {
				cacheCanvas.width = w;
				cacheCanvas.height = h;
			} else if (!compositeOperation) {
				ctx.clearRect(0, 0, w+1, h+1);
			}

			ctx.save();
			ctx.globalCompositeOperation = compositeOperation;
			ctx.setTransform(scale, 0, 0, scale, -offX, -offY);
			target.draw(ctx, true);
			ctx.restore();
			if (target.filters && target.filters.length) {
				this.applyFilters(target);																				//TODO: DHG: had grander plans for master, probably should remove the current master though
			}
		}

		// the actual cacheCanvas element could of changed during the cache process of a webGL texture
		this.cacheCanvas._invalid = true;
		this.cacheID = createjs.DisplayObject._nextCacheID++;
	};

	p.applyFilters = function(target, webGL) {
		var canvas = target.cacheCanvas;
		var filters = target.filters;

		//var ctx = this.ctx;
		var w = canvas.width;
		var h = canvas.height;

		var spriteStage = null;
		if(webGL) {
			// setup
			spriteStage = webGL;

			// apply
			spriteStage.filterDraw(target);

			//done
		} else {
			// setup
			var data = canvas.getContext("2d").getImageData(0,0, w,h);

			// apply
			var l = filters.length;
			for (var i=0; i<l; i++) {
				filters[i]._applyFilter(data);
			}

			//done
			canvas.getContext("2d").putImageData(data, 0,0);
		}
	};

// private methods:

	createjs.CacheManager = CacheManager;
}());
