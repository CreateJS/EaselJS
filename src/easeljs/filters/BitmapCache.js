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
	 * @class BitmapCache
	 * @constructor
	 **/
	function BitmapCache(context) {

		// public:
		/**
		 * Coordinates and dimensions relative to target
		 * @property width
		 * @protected
		 * @type {Number}
		 * @default undefined
		 */
		this.width = undefined;

		/**
		 * Coordinates and dimensions relative to target
		 * @property height
		 * @protected
		 * @type {Number}
		 * @default undefined
		 */
		this.height = undefined;

		/**
		 * Coordinates and dimensions relative to target
		 * @property x
		 * @protected
		 * @type {Number}
		 * @default undefined
		 */
		this.x = undefined;

		/**
		 * Coordinates and dimensions relative to target
		 * @property y
		 * @protected
		 * @type {Number}
		 * @default undefined
		 */
		this.y = undefined;

		/**
		 * Coordinates and dimensions relative to target
		 * @property scale
		 * @protected
		 * @type {Number}
		 * @default 1
		 */
		this.scale = 1;

		/**
		 * Relative offset of the x position, used for drawing into the cache with the correct offsets. every evert update call
		 * @property offX
		 * @protected
		 * @type {Number}
		 * @default 0
		 */
		this.offX = 0;

		/**
		 * Relative offset of the y position, used for drawing into the cache with the correct offsets. Reset every update call
		 * @property offY
		 * @protected
		 * @type {Number}
		 * @default 0
		 */
		this.offY = 0;

		// protected:
		/**
		 * Relative offset of the x position, used for drawing the cache into other scenes. Reset every update call
		 * @property _filterOffY
		 * @protected
		 * @type {Number}
		 * @default 0
		 */
		this._filterOffX = 0;

		/**
		 * Relative offset of the y position, used for drawing into the cache into other scenes. Reset every update call
		 * @property _filterOffY
		 * @protected
		 * @type {Number}
		 * @default 0
		 */
		this._filterOffY = 0;

		/**
		 * Track how many times the cache has been updated, mostly used for preventing duplicate cacheURLs
		 * @property _cacheID
		 * @protected
		 * @type {Number}
		 * @default 0
		 */
		this._cacheID = 0;

		/**
		 * What the _cacheID was when a DataURL was requested
		 * @property _cacheDataURLID
		 * @protected
		 * @type {Number}
		 * @default 0
		 */
		this._cacheDataURLID = 0;

		/**
		 * The cache's DataURL generated on demand using the getter
		 * @property _cacheDataURL
		 * @protected
		 * @type {String}
		 * @default null
		 */
		this._cacheDataURL = null;

		/**
		 * Internal tracking of final bounding width, approximately width*scale; however, filters can complicate the actual value.
		 * @property _drawWidth
		 * @protected
		 * @type {Number}
		 * @default 0
		 */
		this._drawWidth = 0;
		/**
		 * Internal tracking of final bounding height, approximately height*scale; however, filters can complicate the actual value.
		 * @property _drawHeight
		 * @protected
		 * @type {Number}
		 * @default 0
		 */
		this._drawHeight = 0;
	}
	var p = BitmapCache.prototype;

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
	BitmapCache.getFilterBounds = function(target, output) {
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
		return "[BitmapCache]";
	};

	/**
	 * Actual implementation of {{#crossLink "DisplayObject.cache"}}{{/crossLink}}. Creates and sets properties needed
	 * for a cache to function and performs the initial update. See {{#crossLink "_updateSurface"}}{{/crossLink}} for
	 * specific implementation details of the caching object.
	 * @method define
	 * @param {DisplayObject} target The DisplayObject this cache is linked to.
	 * @param {Number} x The x coordinate origin for the cache region.
	 * @param {Number} y The y coordinate origin for the cache region.
	 * @param {Number} width The width of the cache region.
	 * @param {Number} height The height of the cache region.
	 * @param {Number} [scale=1] The scale at which the cache will be created. For example, if you cache a vector shape using
	 * 	myShape.cache(0,0,100,100,2) then the resulting cacheCanvas will be 200x200 px. This lets you scale and rotate
	 * 	cached elements with greater fidelity. Default is 1.
	 * @param {Object} [options=undefined] When using things like a {{#crossLink "StageGL"}}{{/crossLink}} there may be extra caching opportunities or needs.
	 */
	 p.define = function(target, x, y, width, height, scale, options) {
		if(!target){ throw "No symbol to cache"; }
		this._options = options;
		this.target = target;

		this.width =		width >= 1 ? width : 1;
		this.height =		height >= 1 ? height : 1;
		this.x =			x || 0;
		this.y =			y || 0;
		this.scale =		scale || 1;

		 this.update();
	};

	/**
	 * Actual implementation of {{#crossLink "DisplayObject.updateCache"}}{{/crossLink}}. Creates and sets properties needed
	 * @method update
	 * @param {String} [compositeOperation=null] The DisplayObject this cache is linked to.
	 */
	p.update = function(compositeOperation) {
		if(!this.target) { throw "define() must be called before update()"; }

		var filterBounds = BitmapCache.getFilterBounds(this.target);
		var surface = this.target.cacheCanvas;

		this._drawWidth = Math.ceil(this.width*this.scale) + filterBounds.width;
		this._drawHeight = Math.ceil(this.height*this.scale) + filterBounds.height;

		if(!surface || this._drawWidth != surface.width || this._drawHeight != surface.height) {
			this._updateSurface();
		}

		this._filterOffX = filterBounds.x;
		this._filterOffY = filterBounds.y;
		this.offX = this.x*this.scale + this._filterOffX;
		this.offY = this.y*this.scale + this._filterOffY;

		this._drawToCache(compositeOperation);

		this._cacheID = this._cacheID?this._cacheID+1:1;
	};

	/**
	 * Reset and release all the properties and memory associated with this cache.
	 * @method release
	 */
	p.release = function() {
		this.target = this.target.cacheCanvas = null;
		this._cacheID = this._cacheDataURLID = this._cacheDataURL = undefined;
		this.width = this.height = this.x = this.y = this.offX = this.offY = 0;
		this.scale = 1;
	};

	/**
	 * Returns a data URL for the cache, or null if this display object is not cached.
	 * Uses _cacheID to ensure a new data URL is not generated if the cache has not changed.
	 * @method getCacheDataURL
	 * @return {String} The image data url for the cache.
	 **/
	p.getCacheDataURL = function() {
		var cacheCanvas = this.target && this.target.cacheCanvas;
		if (!cacheCanvas) { return null; }
		if (this._cacheID != this._cacheDataURLID) {
			this._cacheDataURLID = this._cacheID;
			this._cacheDataURL = cacheCanvas.toDataURL && cacheCanvas.toDataURL();	// null protection if cacheCanvas isn't a canvas
		}
		return this._cacheDataURL;
	};

	/**
	 * Use context2D drawing commands to display the cache canvas being used
	 * @method draw
	 * @param CanvasRenderingContext2D ctx The context to draw into
	 * @return Boolean Whether the draw was handled successfully
	 */
	p.draw = function(ctx) {
		if(!this.target) { return false; }
		ctx.drawImage(this.target.cacheCanvas,
			this.x + this._filterOffX,		this.y + this._filterOffY,
			this.width,						this.height
		);
		return true;
	};

// private methods:
	/**
	 * Basic context2D caching works by creating a new canvas element at setting its physical size
	 * @protected
	 * @method _updateSurface
	 **/
	p._updateSurface = function() {
		var surface = this.target.cacheCanvas;
		// create it if it's missing
		if(!surface) {
			surface = this.target.cacheCanvas = createjs.createCanvas?createjs.createCanvas():document.createElement("canvas");
		}

		// now size it
		surface.width = this._drawWidth;
		surface.height = this._drawHeight;
	};

	/**
	 * Now all the setup properties have been performed, do the actual cache draw out for context 2D.
	 * @protected
	 * @method _drawToCache
	 */
	p._drawToCache = function(compositeOperation) {
		var target = this.target;
		var surface = target.cacheCanvas;
		var ctx = surface.getContext("2d");

		if (!compositeOperation) {
			ctx.clearRect(0, 0, this._drawWidth+1, this._drawHeight+1);
		}

		ctx.save();
		ctx.globalCompositeOperation = compositeOperation;
		ctx.setTransform(this.scale, 0, 0, this.scale, -this.offX, -this.offY);
		target.draw(ctx, true);
		ctx.restore();

		if (target.filters && target.filters.length) {
			this._applyFilters(target);
		}
	};

	/**
	 * Work through every filter and apply its individual transformation to it.
	 * @protected
	 * @method _applyFilters
	 */
	p._applyFilters = function() {
		var surface = this.target.cacheCanvas;
		var filters = this.target.filters;

		var w = surface.width;
		var h = surface.height;

		// setup
		var data = surface.getContext("2d").getImageData(0,0, w,h);

		// apply
		var l = filters.length;
		for (var i=0; i<l; i++) {
			filters[i]._applyFilter(data);
		}

		//done
		surface.getContext("2d").putImageData(data, 0,0);
	};

	createjs.BitmapCache = BitmapCache;
}());
