/**
 * @license BitmapCache
 * Visit http://createjs.com/ for documentation, updates and examples.
 *
 * Copyright (c) 2017 gskinner.com, inc.
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

import Filter from "./Filter";
import Rectangle from "../geom/Rectangle";
import StageGL from "../display/StageGL";

/**
 * The BitmapCache is an internal representation of all the cache properties and logic required in order to "cache"
 * an object. This information and functionality used to be located on a {@link easeljs.DisplayObject#cache}
 * method in {@link easeljs.DisplayObject}, but was moved to its own class.
 *
 * Caching in this context is purely visual, and will render the DisplayObject out into an image to be used instead
 * of the object. The actual cache itself is still stored on the target with the {@link easeljs.DisplayObject#cacheCanvas}.
 *
 * Working with a singular image like a {@link easeljs.Bitmap}, there is little benefit to performing
 * a cache operation, as it is already a single image. Caching is best done on containers that have multiple complex
 * parts that do not change often, so that rendering the image will improve overall rendering speed. A cached object
 * will not visually update until explicitly told to do so with a call to {@link easeljs.Stage#update},
 * much like a Stage. If a cache is being updated every frame, it is likely not improving rendering performance.
 * Caches are best used when updates will be sparse.
 *
 * Caching is also a co-requisite for applying filters to prevent expensive filters running constantly without need.
 * The BitmapCache is also responsible for applying filters to objects, and reads each {@link easeljs.Filter}.
 * Real-time Filters are not recommended when dealing with a Context2D canvas if performance is a concern. For best
 * performance and to still allow for some visual effects, use a {{#crossLink "DisplayObject/compositeOperation:property"}}{{/crossLink}}
 * when possible.
 *
 * @memberof easeljs
 * @extends easeljs.Filter
 */
export default class BitmapCache extends Filter {

	constructor () {
		super();

		/**
		 * Width of the cache relative to the target object.
		 * @protected
		 * @type {Number}
		 * @default undefined
		 */
		this.width = undefined;

		/**
		 * Height of the cache relative to the target object.
		 * @protected
		 * @type {Number}
		 * @default undefined
		 */
		this.height = undefined;

		/**
		 * Horizontal position of the cache relative to the target's origin.
		 * @protected
		 * @type {Number}
		 * @default undefined
		 */
		this.x = undefined;

		/**
		 * Vertical position of the cache relative to target's origin.
		 * @protected
		 * @type {Number}
		 * @default undefined
		 */
		this.y = undefined;

		/**
		 * The internal scale of the cache image, does not affects display size. This is useful to both increase and
		 * decrease render quality. Objects with increased scales are more likely to look good when scaled up. Objects
		 * with decreased scales can save on rendering performance.
		 * @protected
		 * @type {Number}
		 * @default 1
		 */
		this.scale = 1;

		/**
		 * The relative offset of the {@link easeljs.BitmapCache#x} position, used for drawing
		 * into the cache with the correct offsets. Re-calculated every update call before drawing.
		 * @protected
		 * @type {Number}
		 * @default 0
		 */
		this.offX = 0;

		/**
		 * The relative offset of the {@link easeljs.BitmapCache#y} position, used for drawing
		 * into the cache with the correct offsets. Re-calculated every update call before drawing.
		 * @protected
		 * @type {Number}
		 * @default 0
		 */
		this.offY = 0;

		/**
		 * Track how many times the cache has been updated, mostly used for preventing duplicate cacheURLs. This can be
		 * useful to see if a cache has been updated.
		 * @type {Number}
		 * @default 0
		 */
		this.cacheID = 0;

		/**
		 * Relative offset of the x position, used for drawing the cache into other scenes.
		 * Re-calculated every update call before drawing.
		 * @protected
		 * @type {Number}
		 * @default 0
		 * @todo Is this description right? Its the same as offX.
		 */
		this._filterOffX = 0;

		/**
		 * Relative offset of the y position, used for drawing into the cache into other scenes.
		 * Re-calculated every update call before drawing.
		 * @protected
		 * @type {Number}
		 * @default 0
		 * @todo Is this description right? Its the same as offY.
		 */
		this._filterOffY = 0;

		/**
		 * The cacheID when a DataURL was requested.
		 * @protected
		 * @type {Number}
		 * @default 0
		 */
		this._cacheDataURLID = 0;

		/**
		 * The cache's DataURL, generated on-demand using the getter.
		 * @protected
		 * @type {String}
		 * @default null
		 */
		this._cacheDataURL = null;

		/**
		 * Internal tracking of final bounding width, approximately `width*scale;` however, filters can complicate the actual value.
		 * @protected
		 * @type {Number}
		 * @default 0
		 */
		this._drawWidth = 0;

		/**
		 * Internal tracking of final bounding height, approximately `height*scale;` however, filters can complicate the actual value.
		 * @protected
		 * @type {Number}
		 * @default 0
		 */
		this._drawHeight = 0;

		/**
		 * Internal tracking of the last requested bounds, may happen repeadtedly so stored to avoid object creation.
		 * @protected
		 * @type {easeljs.Rectangle}
		 * @default easeljs.Rectangle
		 */
		this._boundRect = new Rectangle();

	}

	/**
	 * Returns the bounds that surround all applied filters. This relies on each filter to describe how it changes bounds.
	 * @param {easeljs.DisplayObject} target The object to check the filter bounds for.
	 * @param {easeljs.Rectangle} [output] Calculated bounds will be applied to this rect.
	 * @return {easeljs.Rectangle}
	 * @static
	 */
	static getFilterBounds (target, output = new Rectangle()) {
		let filters = target.filters;
		let filterCount = filters && filters.length;
		if (!!filterCount <= 0) { return output; }

		for (let i=0; i<filterCount; i++) {
			let f = filters[i];
			if (!f || !f.getBounds) { continue; }
			let test = f.getBounds();
			if (!test) { continue; }
			if (i==0) {
				output.setValues(test.x, test.y, test.width, test.height);
			} else {
				output.extend(test.x, test.y, test.width, test.height);
			}
		}

		return output;
	}

	/**
	 * Directly called via {@link easeljs.DisplayObject#cache}. Creates and sets properties needed
	 * for a cache to function, and performs the initial update.
	 * @param {easeljs.DisplayObject} target The DisplayObject this cache is linked to.
	 * @param {Number} [x=0] The x coordinate origin for the cache region.
	 * @param {Number} [y=0] The y coordinate origin for the cache region.
	 * @param {Number} [width=1] The width of the cache region.
	 * @param {Number} [height=1] The height of the cache region.
	 * @param {Number} [scale=1] The scale at which the cache will be created. For example, if you cache a vector shape
	 * using `myShape.cache(0,0,100,100,2)`, then the resulting cacheCanvas will be 200x200 pixels. This lets you scale
	 * and rotate cached elements with greater fidelity.
	 * @param {Object} [options] When using things like {@link easeljs.StageGL} there may be
	 * extra caching opportunities or requirements.
	 */
	define (target, x = 0, y = 0, width = 1, height = 1, scale = 1, options) {
		if (!target) { throw "No symbol to cache"; }
		this._options = options;
		this._useWebGL = options !== undefined;
		this.target = target;

		this.width = width >= 1 ? width : 1;
		this.height = height >= 1 ? height : 1;
		this.x = x;
		this.y = y;
		this.scale = scale;

		this.update();
	}

	/**
	 * Directly called via {@link easeljs.DisplayObject#updateCache}, but also internally. This
	 * has the dual responsibility of making sure the surface is ready to be drawn to, and performing the draw. For
	 * full details of each behaviour, check the protected functions {@link easeljs.BitmapCache#_updateSurface}
	 * and {@link easeljs.BitmapCache#_drawToCache} respectively.
	 * @param {String} [compositeOperation] The DisplayObject this cache is linked to.
	 */
	update (compositeOperation) {
		if (!this.target) { throw "define() must be called before update()"; }

		let filterBounds = BitmapCache.getFilterBounds(this.target);
		let surface = this.target.cacheCanvas;

		this._drawWidth = Math.ceil(this.width*this.scale) + filterBounds.width;
		this._drawHeight = Math.ceil(this.height*this.scale) + filterBounds.height;

		if (!surface || this._drawWidth != surface.width || this._drawHeight != surface.height) {
			this._updateSurface();
		}

		this._filterOffX = filterBounds.x;
		this._filterOffY = filterBounds.y;
		this.offX = this.x*this.scale + this._filterOffX;
		this.offY = this.y*this.scale + this._filterOffY;

		this._drawToCache(compositeOperation);

		this.cacheID = this.cacheID?this.cacheID+1:1;
	}

	/**
	 * Reset and release all the properties and memory associated with this cache.
	 */
	release () {
		let stage = this.target.stage;
		if (this._useWebGL && this._webGLCache) {
			// if it isn't cache controlled clean up after yourself
			if (!this._webGLCache.isCacheControlled) {
				if (this.__lastRT) { this.__lastRT = undefined; }
				if (this.__rtA) { this._webGLCache._killTextureObject(this.__rtA); }
				if (this.__rtB) { this._webGLCache._killTextureObject(this.__rtB); }
				if (this.target && this.target.cacheCanvas) { this._webGLCache._killTextureObject(this.target.cacheCanvas); }
			}
			// set the context to none and let the garbage collector get the rest when the canvas itself gets removed
			this._webGLCache = false;
		} else if (stage instanceof StageGL) {
			stage.releaseTexture(this.target.cacheCanvas);
		}
		this.target = this.target.cacheCanvas = null;
		this.cacheID = this._cacheDataURLID = this._cacheDataURL = undefined;
		this.width = this.height = this.x = this.y = this.offX = this.offY = 0;
		this.scale = 1;
	}

	/**
	 * Returns a data URL for the cache, or `null` if this display object is not cached.
	 * Uses {@link easeljs.BitmapCache#cacheID} to ensure a new data URL is not generated if the
	 * cache has not changed.
	 * @return {String} The image data url for the cache.
	 */
	getCacheDataURL () {
		let cacheCanvas = this.target && this.target.cacheCanvas;
		if (!cacheCanvas) { return null; }
		if (this.cacheID != this._cacheDataURLID) {
			this._cacheDataURLID = this.cacheID;
			this._cacheDataURL = cacheCanvas.toDataURL?cacheCanvas.toDataURL():null;	// incase function is
		}
		return this._cacheDataURL;
	}

	/**
	 * Use context2D drawing commands to display the cache canvas being used.
	 * @param {CanvasRenderingContext2D} ctx The context to draw into.
	 * @return {Boolean} Whether the draw was handled successfully.
	 */
	draw (ctx) {
		if (!this.target) { return false; }
		ctx.drawImage(
			this.target.cacheCanvas,
			this.x + (this._filterOffX/this.scale),
			this.y + (this._filterOffY/this.scale),
			this._drawWidth/this.scale,
			this._drawHeight/this.scale
		);
		return true;
	}

	/**
	 * Determine the bounds of the shape in local space.
	 * @returns {easeljs.Rectangle}
	 */
	getBounds () {
		const scale = this.scale;
		return this._boundRect.setValue(
			this._filterOffX/scale,
			this._filterOffY/scale,
			this.width/scale,
			this.height/scale
		);
	}

	/**
	 * Basic context2D caching works by creating a new canvas element and setting its physical size. This function will
	 * create and or size the canvas as needed.
	 * @protected
	 */
	_updateSurface () {
		let surface;
		if (!this._useWebGL) {
			surface = this.target.cacheCanvas;
			// create it if it's missing
			if (!surface) {
				surface = this.target.cacheCanvas = window.createjs&&createjs.createCanvas?createjs.createCanvas():document.createElement("canvas");
			}
			// now size it
			surface.width = this._drawWidth;
			surface.height = this._drawHeight;
			// skip the webgl-only updates
			return;
		}

		// create it if it's missing
		if (!this._webGLCache) {
			if (this._options.useGL === "stage") {
				if(!(this.target.stage != null && this.target.stage.isWebGL)) {
					throw `Cannot use 'stage' for cache because the object's parent stage is ${this.target.stage != null ? "non WebGL." : "not set, please addChild to the correct stage."}`;
				}
				this.target.cacheCanvas = true; // will be replaced with RenderTexture, temporary positive value for old "isCached" checks
				this._webGLCache = this.target.stage;
			} else if (this._options.useGL === "new") {
				this.target.cacheCanvas = document.createElement("canvas"); // we can turn off autopurge because we wont be making textures here
				this._webGLCache = new StageGL(this.target.cacheCanvas, {antialias: true, transparent: true, autoPurge: -1});
				this._webGLCache.isCacheControlled = true;    // use this flag to control stage sizing and final output
			} else {
				throw "Invalid option provided to useGL, expected ['stage', 'new', StageGL, undefined], got "+ this._options.useGL;
			}
		}

		// now size render surfaces
		let stageGL = this._webGLCache;
		surface = this.target.cacheCanvas;

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
		} else if (!stageGL.isCacheControlled) {
			// without filters then we only need one RenderTexture, and that's only if its not a dedicated stage
			stageGL.getTargetRenderTexture(this.target, this._drawWidth,this._drawHeight);
		}
	}

	/**
	 * Perform the cache draw out for context 2D now that the setup properties have been performed.
	 * @protected
	 */
	_drawToCache (compositeOperation) {
		let target = this.target;
		let surface = target.cacheCanvas;
		let webGL = this._webGLCache;

		if (!this._useWebGL || !webGL) {
			let ctx = surface.getContext("2d");

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
				this._applyFilters(target);
			}
			surface._invalid = true;
			return;
		}

		this._webGLCache.cacheDraw(target, target.filters, this);
		// NOTE: we may of swapped around which element the surface is, so we re-fetch it
		surface = this.target.cacheCanvas;
		surface.width = this._drawWidth;
		surface.height = this._drawHeight;
		surface._invalid = true;
	}

	/**
	 * Work through every filter and apply its individual transformation to it.
	 * @protected
	 */
	_applyFilters () {
		let surface = this.target.cacheCanvas;
		let filters = this.target.filters;

		let w = this._drawWidth;
		let h = this._drawHeight;

		// setup
		let data = surface.getContext("2d").getImageData(0,0, w,h);

		// apply
		let l = filters.length;
		for (let i=0; i<l; i++) {
			filters[i]._applyFilter(data);
		}

		//done
		surface.getContext("2d").putImageData(data, 0,0);
	}

}

/**
 * Functionality injected to {@link easeljs.BitmapCache}. Ensure StageGL is loaded after all other
 * standard EaselJS classes are loaded but before making any DisplayObject instances for injection to take full effect.
 * Replaces the context2D cache draw with the option for WebGL or context2D drawing.
 * If options is set to "true" a StageGL is created and contained on the object for use when rendering a cache.
 * If options is a StageGL instance it will not create an instance but use the one provided.
 * If possible it is best to provide the StageGL instance that is a parent to this DisplayObject for performance reasons.
 * A StageGL cache does not infer the ability to draw objects a StageGL cannot currently draw,
 * i.e. do not use a WebGL context cache when caching a Shape, Text, etc.
 *
 * You can make your own StageGL and have it render to a canvas if you set ".isCacheControlled" to true on your stage.
 * You may wish to create your own StageGL instance to control factors like background color/transparency, AA, and etc.
 * You must set "options" to its own stage if you wish to use the fast Render Textures available only to StageGLs.
 * If you use WebGL cache on a container with Shapes you will have to cache each shape individually before the container,
 * otherwise the WebGL cache will not render the shapes.
 *
 * @name easeljs.BitmapCache#cache
 *
 * @example <caption>WebGL cache with 2d context</caption>
 * let stage = new Stage();
 * let bmp = new Bitmap(src);
 * bmp.cache(0, 0, bmp.width, bmp.height, 1, true); // no StageGL to use, so make one
 * let shape = new Shape();
 * shape.graphics.clear().fill("red").drawRect(0,0,20,20);
 * shape.cache(0, 0, 20, 20, 1); // cannot use WebGL cache
 *
 * @example <caption>WebGL cache with WebGL context</caption>
 * let stageGL = new StageGL();
 * let bmp = new Bitmap(src);
 * bmp.cache(0, 0, bmp.width, bmp.height, 1, stageGL); // use our StageGL to cache
 * let shape = new Shape();
 * shape.graphics.clear().fill("red").drawRect(0,0,20,20);
 * shape.cache(0, 0, 20, 20, 1); // cannot use WebGL cache
 *
 * @param {Number} x The x coordinate origin for the cache region.
 * @param {Number} y The y coordinate origin for the cache region.
 * @param {Number} width The width of the cache region.
 * @param {Number} height The height of the cache region.
 * @param {Number} [scale=1] The scale at which the cache will be created. For example, if you cache a vector shape using
 * 	myShape.cache(0,0,100,100,2) then the resulting cacheCanvas will be 200x200 px. This lets you scale and rotate
 * 	cached elements with greater fidelity.
 * @param {Boolean | easeljs.StageGL} [options] Select whether to use context 2D, or WebGL rendering, and whether to make a new stage instance or use an existing one.
 */
