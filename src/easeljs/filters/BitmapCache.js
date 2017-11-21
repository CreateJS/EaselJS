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
	 * The BitmapCache is an internal representation of all the cache properties and logic required in order to "cache"
	 * an object. This information and functionality used to be located on a {{#crossLink "DisplayObject/cache"}}{{/crossLink}}
	 * method in {{#crossLink "DisplayObject"}}{{/crossLink}}, but was moved to its own class.
	 *
	 * Caching in this context is purely visual, and will render the DisplayObject out into an image to be used instead
	 * of the object. The actual cache itself is still stored on the target with the {{#crossLink "DisplayObject/cacheCanvas:property"}}{{/crossLink}}.
	 * Working with a singular image like a {{#crossLink "Bitmap"}}{{/crossLink}} there is little benefit to performing
	 * a cache as it is already a single image. Caching is best done on containers containing multiple complex parts that
	 * do not move often, so that rendering the image instead will improve overall rendering speed. A cached object will
	 * not visually update until explicitly told to do so with a call to update, much like a Stage. If a cache is being
	 * updated every frame it is likely not improving rendering performance. Cache are best used when updates will be sparse.
	 *
	 * Caching is also a co-requisite for applying filters to prevent expensive filters running constantly without need,
	 * and to physically enable some effects. The BitmapCache is also responsible for applying filters to objects and
	 * reads each {{#crossLink "Filter"}}{{/crossLink}} due to this relationship. Real-time Filters are not recommended
	 * performance wise when dealing with a Context2D canvas. For best performance and to still allow for some visual
	 * effects use a compositeOperation when possible.
	 * @class BitmapCache
	 * @constructor
	 **/
	function BitmapCache() {

		// public:
		/**
		 * Width of the cache relative to the target object.
		 * @property width
		 * @protected
		 * @type {Number}
		 * @default undefined
		 **/
		this.width = undefined;

		/**
		 * Height of the cache relative to the target object.
		 * @property height
		 * @protected
		 * @type {Number}
		 * @default undefined
		 * @todo Should the width and height be protected?
		 **/
		this.height = undefined;

		/**
		 * Horizontal position of the cache relative to the target's origin.
		 * @property x
		 * @protected
		 * @type {Number}
		 * @default undefined
		 **/
		this.x = undefined;

		/**
		 * Vertical position of the cache relative to target's origin.
		 * @property y
		 * @protected
		 * @type {Number}
		 * @default undefined
		 **/
		this.y = undefined;

		/**
		 * The internal scale of the cache image, does not affects display size. This is useful to both increase and
		 * decrease render quality. Objects with increased scales are more likely to look good when scaled up or rotated.
		 * Objects with decreased scales can save on rendering performance.
		 * @property scale
		 * @protected
		 * @type {Number}
		 * @default 1
		 **/
		this.scale = 1;

		/**
		 * The x offset used for drawing into the cache itself, accounts for both transforms applied.
		 * @property offX
		 * @protected
		 * @type {Number}
		 * @default 0
		 **/
		this.offX = 0;

		/**
		 * The y offset used for drawing into the cache itself, accounts for both transforms applied.
		 * @property offY
		 * @protected
		 * @type {Number}
		 * @default 0
		 **/
		this.offY = 0;

		/**
		 * Track how many times the cache has been updated, mostly used for preventing duplicate cacheURLs.
		 * This can be useful to see if a cache has been updated.
		 * @property cacheID
		 * @type {Number}
		 * @default 0
		 **/
		this.cacheID = 0;

		// protected:
		/**
		 * The relative offset of the filter's x position, used for drawing the cache onto its container.
		 * Re-calculated every update call before drawing.
		 * @property _filterOffY
		 * @protected
		 * @type {Number}
		 * @default 0
		 **/
		this._filterOffX = 0;

		/**
		 * The relative offset of the filter's y position, used for drawing the cache onto its container.
		 * Re-calculated every update call before drawing.
		 * @property _filterOffY
		 * @protected
		 * @type {Number}
		 * @default 0
		 **/
		this._filterOffY = 0;

		/**
		 * The cacheID when a DataURL was requested.
		 * @property _cacheDataURLID
		 * @protected
		 * @type {Number}
		 * @default 0
		 **/
		this._cacheDataURLID = 0;

		/**
		 * The cache's DataURL, generated on-demand using the getter.
		 * @property _cacheDataURL
		 * @protected
		 * @type {String}
		 * @default null
		 **/
		this._cacheDataURL = null;

		/**
		 * Internal tracking of final bounding width, approximately width*scale; however, filters can complicate the actual value.
		 * @property _drawWidth
		 * @protected
		 * @type {Number}
		 * @default 0
		 **/
		this._drawWidth = 0;

		/**
		 * Internal tracking of final bounding height, approximately height*scale; however, filters can complicate the actual value.
		 * @property _drawHeight
		 * @protected
		 * @type {Number}
		 * @default 0
		 **/
		this._drawHeight = 0;

		/**
		 * Internal tracking of the last requested bounds, may happen repeadtedly so stored to avoid object creation
		 * @property _boundRect
		 * @protected
		 * @type {Rectangle}
		 * @default 0
		 **/
		this._boundRect = new createjs.Rectangle();
	}
	var p = BitmapCache.prototype;

	/**
	 * Returns the bounds that surround all applied filters, relies on each filter to describe how it changes bounds.
	 * @method getFilterBounds
	 * @param {DisplayObject} target The object to check the filter bounds for.
	 * @param {Rectangle} [output=null] Optional parameter, if provided then calculated bounds will be applied to that object.
	 * @return {Rectangle} bounds object representing the bounds with filters.
	 * @static
	 **/
	BitmapCache.getFilterBounds = function(target, output) {
		if(!output){ output = new createjs.Rectangle(); }
		var filters = target.filters;
		var filterCount = filters && filters.length;
		if (!!filterCount <= 0) { return output; }

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
	 * Actually create the correct cache surface and properties associated with it. Caching and it's benefits are discussed
	 * by the {{#crossLink "DisplayObject/cache"}}{{/crossLink}} function and this class description. Here are the detailed
	 * specifics of how to use the options object.
	 *
	 * - If options.useGL is set to "new" a StageGL is created and contained on this for use when rendering the cache.
	 * - If options.useGL is set to "stage" if the current stage is a StageGL it will be used. If not then it will default to "new".
	 * - If options.useGL is a StageGL instance it will not create one but use the one provided.
	 * - If options.useGL is undefined a Context 2D cache will be performed.
	 *
	 * This means you can use any combination of StageGL and 2D with either, neither, or both the stage and cache being
	 * WebGL. Using "new" with a StageGL display list is highly unrecommended, but still an option. It should be avoided
	 * due to negative performance reasons and the Image loading limitation noted in the class complications above.
	 *
	 * When "options.useGL" is set to the parent stage of the target and WebGL, performance is increased by using
	 * "RenderTextures" instead of canvas elements. These are internal Textures on the graphics card stored in the GPU.
	 * Because they are no longer canvases you cannot perform operations you could with a regular canvas. The benefit
	 * is that this avoids the slowdown of copying the texture back and forth from the GPU to a Canvas element.
	 * This means "stage" is the recommended option when available.
	 *
	 * A StageGL cache does not infer the ability to draw objects a StageGL cannot currently draw, i.e. do not use a
	 * WebGL context cache when caching a Shape, Text, etc.
	 * <h4>WebGL cache with a 2D context</h4>
	 *
	 *     var stage = new createjs.Stage();
	 *     var bmp = new createjs.Bitmap(src);
	 *     bmp.cache(0, 0, bmp.width, bmp.height, 1, {gl: "new"});          // no StageGL to use, so make one
	 *
	 *     var shape = new createjs.Shape();
	 *     shape.graphics.clear().fill("red").drawRect(0,0,20,20);
	 *     shape.cache(0, 0, 20, 20, 1);                             // cannot use WebGL cache
	 *
	 * <h4>WebGL cache with a WebGL context</h4>
	 *
	 *     var stageGL = new createjs.StageGL();
	 *     var bmp = new createjs.Bitmap(src);
	 *     bmp.cache(0, 0, bmp.width, bmp.height, 1, {gl: "stage"});       // use our StageGL to cache
	 *
	 *     var shape = new createjs.Shape();
	 *     shape.graphics.clear().fill("red").drawRect(0,0,20,20);
	 *     shape.cache(0, 0, 20, 20, 1);                             // cannot use WebGL cache
	 *
	 * You may wish to create your own StageGL instance to control factors like clear color, transparency, AA, and
	 * others. If you do, pass a new instance in instead of "true", the library will automatically set the
	 * {{#crossLink "StageGL/isCacheControlled"}}{{/crossLink}} to true on your instance. This will trigger it to behave
	 * correctly, and not assume your main context is WebGL.
	 *
	 * @public
	 * @method BitmapCache.cache
	 * @param {Number} x The x coordinate origin for the cache region.
	 * @param {Number} y The y coordinate origin for the cache region.
	 * @param {Number} width The width of the cache region.
	 * @param {Number} height The height of the cache region.
	 * @param {Number} [scale=1] The scale at which the cache will be created. For example, if you cache a vector shape
	 * using myShape.cache(0,0,100,100,2) then the resulting cacheCanvas will be 200x200 px. This lets you scale and
	 * rotate cached elements with greater fidelity. Default is 1.
	 * @param {Object} [options=undefined] Specify additional parameters for the cache logic
	 * @param {undefined|"new"|"stage"|StageGL} [options.useGL=undefined] Select whether to use context 2D, or WebGL rendering, and
	 * whether to make a new stage instance or use an existing one. See above for extensive details on use.
	 * @for BitmapCache
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
	 * Directly called via {{#crossLink "DisplayObject/updateCache:method"}}{{/crossLink}}, but also internally. This
	 * has the dual responsibility of making sure the surface is ready to be drawn to, and performing the draw. For
	 * full details of each behaviour, check the protected functions {{#crossLink "BitmapCache/_updateSurface"}}{{/crossLink}}
	 * and {{#crossLink "BitmapCache/_drawToCache"}}{{/crossLink}} respectively.
	 * @method update
	 * @param {String} [compositeOperation=null] The DisplayObject this cache is linked to.
	 **/
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

		this.cacheID = this.cacheID?this.cacheID+1:1;
	};

	/**
	 * Reset and release all the properties and memory associated with this cache.
	 * @method release
	 **/
	p.release = function() {
		if (this._webGLCache) {
			// if it isn't cache controlled clean up after yourself
			if (!this._webGLCache.isCacheControlled) {
				if (this.__lastRT){ this.__lastRT = undefined; }
				if (this.__rtA){ this._webGLCache._killTextureObject(this.__rtA); }
				if (this.__rtB){ this._webGLCache._killTextureObject(this.__rtB); }
				if (this.target && this.target.cacheCanvas){ this._webGLCache._killTextureObject(this.target.cacheCanvas); }
			}
			// set the context to none and let the garbage collector get the rest when the canvas itself gets removed
			this._webGLCache = false;
		} else {
			var stage = this.target.stage;
			if (stage instanceof createjs.StageGL){
				stage.releaseTexture(this.target.cacheCanvas);
			}
		}

		this.target = this.target.cacheCanvas = null;
		this.cacheID = this._cacheDataURLID = this._cacheDataURL = undefined;
		this.width = this.height = this.x = this.y = this.offX = this.offY = 0;
		this.scale = 1;
	};

	/**
	 * Returns a data URL for the cache, or `null` if this display object is not cached.
	 * Uses {{#crossLink "BitmapCache/cacheID:property"}}{{/crossLink}} to ensure a new data URL is not generated if the
	 * cache has not changed.
	 * @method getCacheDataURL
	 * @return {String} The image data url for the cache.
	 **/
	p.getCacheDataURL = function() {
		var cacheCanvas = this.target && this.target.cacheCanvas;
		if (!cacheCanvas) { return null; }
		if (this.cacheID != this._cacheDataURLID) {
			this._cacheDataURLID = this.cacheID;
			this._cacheDataURL = cacheCanvas.toDataURL?cacheCanvas.toDataURL():null;	// incase function is
		}
		return this._cacheDataURL;
	};

	/**
	 * Use context2D drawing commands to display the cache canvas being used.
	 * @method draw
	 * @param {CanvasRenderingContext2D} ctx The context to draw into.
	 * @return {Boolean} Whether the draw was handled successfully.
	 **/
	p.draw = function(ctx) {
		if(!this.target) { return false; }
		ctx.drawImage(this.target.cacheCanvas,
			this.x + (this._filterOffX/this.scale),		this.y + (this._filterOffY/this.scale),
			this._drawWidth/this.scale,					this._drawHeight/this.scale
		);
		return true;
	};

	/**
	 * Determine the bounds of the shape in local space.
	 * @method getBounds
	 * @returns {Rectangle}
	 */
	p.getBounds = function() {
		var scale = this.scale;
		return this._boundRect.setValues(
			this._filterOffX/scale,		this._filterOffY/scale,
			this.width/scale,			this.height/scale
		);
	};

// private methods:
	/**
	 * Create or resize the invisible canvas/surface that is needed for the display object(s) to draw to,
	 * and in turn be used in their stead when drawing. The surface is resized to the size defined
	 * by the width and height, factoring in scaling and filters. Adjust them to adjust the output size.
	 * @method _updateSurface
	 * @protected
	 **/
	p._updateSurface = function() {
		var surface;

		if (!this._options || !this._options.useGL) {
			surface = this.target.cacheCanvas;

			// create it if it's missing
			if(!surface) {
				surface = this.target.cacheCanvas = createjs.createCanvas?createjs.createCanvas():document.createElement("canvas");
			}

			// now size it
			surface.width = this._drawWidth;
			surface.height = this._drawHeight;
			return;
		}

		// create it if it's missing
		if (!this._webGLCache) {
			if (this._options.useGL === "stage") {
				if(!(this.target.stage && this.target.stage.isWebGL)){
					var error = "Cannot use 'stage' for cache because the object's parent stage is ";
					error += this.target.stage ? "non WebGL." : "not set, please addChild to the correct stage.";
					throw error;
				}
				this.target.cacheCanvas = true; // will be replaced with RenderTexture, temporary positive value for old "isCached" checks
				this._webGLCache = this.target.stage;

			} else if(this._options.useGL === "new") {
				this.target.cacheCanvas = document.createElement("canvas"); // we can turn off autopurge because we wont be making textures here
				this._webGLCache = new createjs.StageGL(this.target.cacheCanvas, {antialias: true, transparent: true, autoPurge: -1});
				this._webGLCache.isCacheControlled = true;	// use this flag to control stage sizing and final output

			} else if(this._options.useGL instanceof createjs.StageGL) {
				this.target.cacheCanvas = true; // will be replaced with RenderTexture, temporary positive value for old "isCached" checks
				this._webGLCache = this._options.useGL;
				this._webGLCache.isCacheControlled = true;	// use this flag to control stage sizing and final output

			} else {
				throw "Invalid option provided to useGL, expected ['stage', 'new', StageGL, undefined], got "+ this._options.useGL;
			}
		}

		// now size render surfaces
		surface = this.target.cacheCanvas;
		var stageGL = this._webGLCache;

		// if we have a dedicated stage we've gotta size it
		if (stageGL.isCacheControlled) {
			surface.width = this._drawWidth;
			surface.height = this._drawHeight;
			stageGL.updateViewport(this._drawWidth, this._drawHeight);
		}
		if (this.target.filters) {
			// with filters we can't tell how many we'll need but the most we'll ever need is two, so make them now
			stageGL.getTargetRenderTexture(this.target, this._drawWidth,this._drawHeight);
			stageGL.getTargetRenderTexture(this.target, this._drawWidth,this._drawHeight);
		} else {
			// without filters then we only need one RenderTexture, and that's only if its not a dedicated stage
			if (!stageGL.isCacheControlled) {
				stageGL.getTargetRenderTexture(this.target, this._drawWidth,this._drawHeight);
			}
		}
	};

	/**
	 * Perform the cache draw out for context 2D now that the setup properties have been performed.
	 * @method _drawToCache
	 * @protected
	 **/
	p._drawToCache = function(compositeOperation) {
		var surface = this.target.cacheCanvas;
		var target = this.target;
		var webGL = this._webGLCache;

		if (webGL){
			webGL.cacheDraw(target, target.filters, this);

			// we may of swapped around which element the surface is, so we re-fetch it
			surface = this.target.cacheCanvas;

			surface.width = this._drawWidth;
			surface.height = this._drawHeight;
		} else {
			var ctx = surface.getContext("2d");

			if (!compositeOperation) {
				ctx.clearRect(0, 0, this._drawWidth+1, this._drawHeight+1);
			}

			ctx.save();
			ctx.globalCompositeOperation = compositeOperation;
			ctx.setTransform(this.scale,0,0,this.scale, -this._filterOffX,-this._filterOffY);
			ctx.translate(-this.x, -this.y);
			target.draw(ctx, true);
			ctx.restore();


			if (target.filters && target.filters.length) {
				this._applyFilters(ctx);
			}
		}
		surface._invalid = true;
	};

	/**
	 * Work through every filter and apply its individual visual transformation.
	 * @method _applyFilters
	 * @protected
	 **/
	p._applyFilters = function(ctx) {
		var filters = this.target.filters;

		var w = this._drawWidth;
		var h = this._drawHeight;

		var data;

		var i = 0, filter = filters[i];
		do { // this is safe because we wouldn't be in apply filters without a filter count of at least 1
			if(filter.usesContext){
				if(data) {
					ctx.putImageData(data, 0,0);
					data = null;
				}
				filter.applyFilter(ctx, 0,0, w,h);
			} else {
				if(!data) {
					data = ctx.getImageData(0,0, w,h);
				}
				filter._applyFilter(data);
			}

			// work through the multipass if it's there, otherwise move on
			filter = filter._multiPass !== null ? filter._multiPass : filters[++i];
		} while (filter);

		//done
		if(data) {
			ctx.putImageData(data, 0,0);
		}
	};

	createjs.BitmapCache = BitmapCache;
}());
