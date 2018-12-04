/**
 * @license DisplayObject
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

import { EventDispatcher } from "@createjs/core";
import Shadow from "./Shadow";
import uid from "../utils/uid";
import DisplayProps from "../geom/DisplayProps";
import Rectangle from "../geom/Rectangle";
import Point from "../geom/Point";
import Matrix2D from "../geom/Matrix2D";
import BitmapCache from "../filters/BitmapCache";

/**
 * DisplayObject is an abstract class that should not be constructed directly. Instead construct subclasses such as
 * {@link easeljs.Container}, {@link easeljs.Bitmap}, and {@link easeljs.Shape}.
 * DisplayObject is the base class for all display classes in the EaselJS library. It defines the core properties and
 * methods that are shared between all display objects, such as transformation properties (x, y, scaleX, scaleY, etc),
 * caching, and mouse handlers.
 *
 * @memberof easeljs
 * @extends EventDispatcher
 */
export default class DisplayObject extends EventDispatcher {

	constructor () {
		super();

		/**
		 * The alpha (transparency) for this display object. 0 is fully transparent, 1 is fully opaque.
		 * @type {Number}
		 * @default 1
		 */
		this.alpha = 1;

		/**
		 * If a cache is active, this returns the canvas that holds the image of this display object.
		 * Use this to display the result of a cache. This will be a HTMLCanvasElement unless special cache rules have been deliberately enabled for this cache.
		 * @see {@link easeljs.DisplayObject#cache}
		 * @type {HTMLCanvasElement | Object}
		 * @default null
		 * @readonly
		 */
		this.cacheCanvas = null;

		/**
		 * If a cache has been made, this returns the class that is managing the cacheCanvas and its properties.
		 * @see {@link easeljs.BitmapCache}
		 * @type {easeljs.BitmapCache}
		 * @default null
		 * @readonly
		 */
		this.bitmapCache = null;

		/**
		 * Unique ID for this display object. Makes display objects easier for some uses.
		 * @type {Number}
		 */
		this.id = uid();

		/**
		 * Indicates whether to include this object when running mouse interactions. Setting this to `false` for children
		 * of a {@link easeljs.Container} will cause events on the Container to not fire when that child is
		 * clicked. Setting this property to `false` does not prevent the {@link easeljs.Container#getObjectsUnderPoint}
		 * method from returning the child.
		 *
		 * <strong>Note:</strong> In EaselJS 0.7.0, the `mouseEnabled` property will not work properly with nested Containers.
		 *
		 * @type {Boolean}
		 * @default true
		 */
		this.mouseEnabled = true;

		/**
		 * If false, the tick will not run on this display object (or its children). This can provide some performance benefits.
		 * In addition to preventing the {@link core.Ticker#event:tick} event from being dispatched, it will also prevent tick related updates
		 * on some display objects (ex. Sprite & MovieClip frame advancing, DOMElement visibility handling).
		 * @type Boolean
		 * @default true
		 */
		this.tickEnabled = true;

		/**
		 * An optional name for this display object. Included in {@link easeljs.DisplayObject#toString}. Useful for debugging.
		 * @type {String}
		 * @default null
		 */
		this.name = null;

		/**
		 * A reference to the {@link easeljs.Container} or {@link easeljs.Stage} object that
		 * contains this display object, or null if it has not been added to one.
		 * @type {easeljs.Container}
		 * @default null
		 * @readonly
		 */
		this.parent = null;

		/**
		 * The left offset for this display object's registration point. For example, to make a 100x100px Bitmap rotate
		 * around its center, you would set regX and {@link easeljs.DisplayObject#regY} to 50.
		 * @type {Number}
		 * @default 0
		 */
		this.regX = 0;

		/**
		 * The y offset for this display object's registration point. For example, to make a 100x100px Bitmap rotate around
		 * its center, you would set {@link easeljs.DisplayObject#regX} and regY to 50.
		 * @type {Number}
		 * @default 0
		 */
		this.regY = 0;

		/**
		 * The rotation in degrees for this display object.
		 * @type {Number}
		 * @default 0
		 */
		this.rotation = 0;

		/**
		 * The factor to stretch this display object horizontally. For example, setting scaleX to 2 will stretch the display
		 * object to twice its nominal width. To horizontally flip an object, set the scale to a negative number.
		 * @type {Number}
		 * @default 1
		 */
		this.scaleX = 1;

		/**
		 * The factor to stretch this display object vertically. For example, setting scaleY to 0.5 will stretch the display
		 * object to half its nominal height. To vertically flip an object, set the scale to a negative number.
		 * @type {Number}
		 * @default 1
		 */
		this.scaleY = 1;

		/**
		 * The factor to skew this display object horizontally.
		 * @type {Number}
		 * @default 0
		 */
		this.skewX = 0;

		/**
		 * The factor to skew this display object vertically.
		 * @type {Number}
		 * @default 0
		 */
		this.skewY = 0;

		/**
		 * A shadow object that defines the shadow to render on this display object. Set to `null` to remove a shadow. If
		 * null, this property is inherited from the parent container.
		 * @type {easeljs.Shadow}
		 * @default null
		 */
		this.shadow = null;

		/**
		 * Indicates whether this display object should be rendered to the canvas and included when running the Stage
		 * {@link easeljs.Stage#getObjectsUnderPoint} method.
		 * @type {Boolean}
		 * @default true
		 */
		this.visible = true;

		/**
		 * The x (horizontal) position of the display object, relative to its parent.
		 * @type {Number}
		 * @default 0
		 */
		this.x = 0;

		/**
		 * The y (vertical) position of the display object, relative to its parent.
		 * @type {Number}
		 * @default 0
		 */
		this.y = 0;

		/**
		 * If set, defines the transformation for this display object, overriding all other transformation properties
		 * (x, y, rotation, scale, skew).
		 * @type {easeljs.Matrix2D}
		 * @default null
		 */
		this.transformMatrix = null;

		/**
		 * The composite operation indicates how the pixels of this display object will be composited with the elements
		 * behind it. If `null`, this property is inherited from the parent container.
		 * @see {@link http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#compositing "WHATWG spec on compositing"}
		 * @type {String}
		 * @default null
		 */
		this.compositeOperation = null;

		/**
		 * Indicates whether the display object should be drawn to a whole pixel when {@link easeljs.Stage#snapToPixelEnabled} is true.
		 * To enable/disable snapping on whole categories of display objects, set this value on the prototype (Ex. Text.prototype.snapToPixel = true).
		 * @type {Boolean}
		 * @default true
		 */
		this.snapToPixel = true;

		/**
		 * An array of Filter objects to apply to this display object. Filters are only applied / updated when {@link easeljs.DisplayObject#cache}
		 * or {@link easeljs.DisplayObject#updateCache} is called on the display object, and only apply to the area that is cached.
		 * @type {Array<easeljs.Filter>}
		 * @default null
		 */
		this.filters = null;

		/**
		 * A Shape instance that defines a vector mask (clipping path) for this display object.  The shape's transformation
		 * will be applied relative to the display object's parent coordinates (as if it were a child of the parent).
		 * @type {easeljs.Shape}
		 * @default null
		 */
		this.mask = null;

		/**
		 * A display object that will be tested when checking mouse interactions or testing {@link easeljs.Container#getObjectsUnderPoint}.
		 * The hit area will have its transformation applied relative to this display object's coordinate space (as though
		 * the hit test object were a child of this display object and relative to its regX/Y). The hitArea will be tested
		 * using only its own `alpha` value regardless of the alpha value on the target display object, or the target's
		 * ancestors (parents).
		 *
		 * If set on a {@link easeljs.Container}, children of the Container will not receive mouse events.
		 * This is similar to setting {@link easeljs.DisplayObject#mouseChildren} to false.
		 *
		 * Note that hitArea is NOT currently used by the `hitTest()` method, nor is it supported for {@link easeljs.Stage}.
		 *
		 * @type {easeljs.DisplayObject}
		 * @default null
		 */
		this.hitArea = null;

		/**
		 * A CSS cursor (ex. "pointer", "help", "text", etc) that will be displayed when the user hovers over this display
		 * object. You must enable mouseover events using the {@link easeljs.Stage#enableMouseOver} method to
		 * use this property. Setting a non-null cursor on a Container will override the cursor set on its descendants.
		 *
		 * @type {String}
		 * @default null
		 */
		this.cursor = null;

		/**
		 * @protected
		 * @type {easeljs.DisplayProps}
		 */
		this._props = new DisplayProps();

		/**
		 * @protected
		 * @type {easeljs.Rectangle}
		 */
		this._rectangle = new Rectangle();

		/**
		 * @protected
		 * @type {easeljs.Rectangle}
		 * @default null
		 */
		this._bounds = null;

		/**
		 * Where StageGL should look for required display properties, matters only for leaf display objects. Containers
		 * or cached objects won't use this property, it's for native display of terminal elements.
		 * @protected
		 * @type {Number}
		 * @default 0
		 */
		this._webGLRenderStyle = DisplayObject._StageGL_NONE;
	}

	/**
	 * Returns the {@link easeljs.Stage} instance that this display object will be rendered on, or null if it has not been added to one.
	 * @type {Stage}
	 * @readonly
	 */
	get stage () {
		// uses dynamic access to avoid circular dependencies;
		let o = this;
		while (o.parent) { o = o.parent; }
		if (/^\[Stage(GL)?(\s\(name=\w+\))?\]$/.test(o.toString())) { return o; }
		return null;
	}

	/**
	 * Set both the {@link easeljs.DisplayObject#scaleX} and the {@link easeljs.DisplayObject#scaleY} property to the same value.
	 * Note that when you get the value, if the `scaleX` and `scaleY` are different values, it will return only the `scaleX`.
	 * @type {Number}
	 * @default 1
	 */
	set scale (value) { this.scaleX = this.scaleY = value; }
	get scale () { return this.scaleX; }

	/**
	 * Returns true or false indicating whether the display object would be visible if drawn to a canvas.
	 * This does not account for whether it would be visible within the boundaries of the stage.
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @return {Boolean} Boolean indicating whether the display object would be visible if drawn to a canvas
	 */
	isVisible () {
		return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0);
	}

	/**
	 * Alias for drawCache(). Used by grandchildren (or deeper) in their draw method to directly
	 * call {@link easeljs.DisplayObject#drawCache}, bypassing their parent(s).
	 *
	 * @param {CanvasRenderingContext2D} ctx The canvas 2D context object to draw into.
	 * @param {Boolean} [ignoreCache=false] Indicates whether the draw operation should ignore any current cache. For example,
	 * used for drawing the cache (to prevent it from simply drawing an existing cache back into itself).
	 * @return {Boolean}
	 */
	draw (ctx, ignoreCache = false) {
		return this.drawCache(ctx, ignoreCache);
	}

	/**
	 * Draws the display object into the specified context ignoring its visible, alpha, shadow, and transform.
	 * Returns `true` if the draw was handled (useful for overriding functionality).
	 *
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @param {CanvasRenderingContext2D} ctx The canvas 2D context object to draw into.
	 * @param {Boolean} [ignoreCache=false] Indicates whether the draw operation should ignore any current cache. For example,
	 * used for drawing the cache (to prevent it from simply drawing an existing cache back into itself).
	 * @return {Boolean}
	 */
	drawCache (ctx, ignoreCache = false) {
		let cache = this.bitmapCache;
		if (cache && !ignoreCache) {
			return cache.draw(ctx);
		}
		return false;
	}

	/**
	 * Applies this display object's transformation, alpha, globalCompositeOperation, clipping path (mask), and shadow
	 * to the specified context. This is typically called prior to {@link easeljs.DisplayObject#draw}.
	 * @param {CanvasRenderingContext2D} ctx The canvas 2D to update.
	 */
	updateContext (ctx) {
		let o=this, mask=o.mask, mtx=o._props.matrix;

		if (mask && mask.graphics && !mask.graphics.isEmpty()) {
			mask.getMatrix(mtx);
			ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);

			mask.graphics.drawAsPath(ctx);
			ctx.clip();

			mtx.invert();
			ctx.transform(mtx.a,  mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
		}

		this.getMatrix(mtx);
		let tx = mtx.tx, ty = mtx.ty;
		if (DisplayObject._snapToPixelEnabled && o.snapToPixel) {
			tx = tx + (tx < 0 ? -0.5 : 0.5) | 0;
			ty = ty + (ty < 0 ? -0.5 : 0.5) | 0;
		}
		ctx.transform(mtx.a,  mtx.b, mtx.c, mtx.d, tx, ty);
		ctx.globalAlpha *= o.alpha;
		if (o.compositeOperation) { ctx.globalCompositeOperation = o.compositeOperation; }
		if (o.shadow) { this._applyShadow(ctx, o.shadow); }
	}

	/**
	 * Draws the display object into a new element, which is then used for subsequent draws. Intended for complex content
	 * that does not change frequently (ex. a Container with many children that do not move, or a complex vector Shape),
	 * this can provide for much faster rendering because the content does not need to be re-rendered each tick. The
	 * cached display object can be moved, rotated, faded, etc freely, however if its content changes, you must manually
	 * update the cache by calling `updateCache()` again. You must specify the cached area via the x, y, w,
	 * and h parameters. This defines the rectangle that will be rendered and cached using this display object's coordinates.
	 *
	 * Note that filters need to be defined <em>before</em> the cache is applied or you will have to call updateCache after
	 * application. Check out the {@link easeljs.Filter} class for more information. Some filters
	 * (ex. {@link easeljs.BlurFilter}) may not work as expected in conjunction with the scale param.
	 *
	 * Usually, the resulting cacheCanvas will have the dimensions width*scale by height*scale, however some filters (ex. BlurFilter)
	 * will add padding to the canvas dimensions.
	 *
	 * Actual implementation of the caching mechanism can change with a {@link easeljs.StageGL} and so
	 * all caching and filter behaviour has been moved to the {@link easeljs.BitmapCache}
	 *
	 * @example
	 * // If you defined a Shape that drew a circle at 0, 0 with a radius of 25:
	 * var shape = new createjs.Shape();
	 * shape.graphics.beginFill("#ff0000").drawCircle(0, 0, 25);
	 * shape.cache(-25, -25, 50, 50);
	 *
	 * @param {Number} x The x coordinate origin for the cache region.
	 * @param {Number} y The y coordinate origin for the cache region.
	 * @param {Number} width The width of the cache region.
	 * @param {Number} height The height of the cache region.
	 * @param {Number} [scale=1] The scale at which the cache will be created. For example, if you cache a vector shape using
	 * 	myShape.cache(0,0,100,100,2) then the resulting cacheCanvas will be 200x200 px. This lets you scale and rotate
	 * 	cached elements with greater fidelity. Default is 1.
	 * @param {Object} [options] When using alternate displays there may be extra caching opportunities or needs.
	 */
	cache (x, y, width, height, scale = 1, options) {
		if (!this.bitmapCache) {
			this.bitmapCache = new BitmapCache();
		}
		this.bitmapCache.define(this, x, y, width, height, scale, options);
	}

	/**
	 * Redraws the display object to its cache. Calling updateCache without an active cache will throw an error.
	 * If compositeOperation is null the current cache will be cleared prior to drawing. Otherwise the display object
	 * will be drawn over the existing cache using the specified compositeOperation.
	 *
	 * Actual implementation of the caching mechanism can change with a {@link easeljs.StageGL} and so
	 * all caching and filter behaviour has been moved to the {@link easeljs.BitmapCache}
	 *
	 * @example
	 * // clear current graphics
	 * shapeInstance.clear();
	 * // draw new instructions
	 * shapeInstance.setStrokeStyle(3).beginStroke("#FF0000").moveTo(100, 100).lineTo(200,200);
	 * // update cache, drawing new line on top of old one
	 * shapeInstance.updateCache();
	 *
	 * @see {@link http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#compositing "WHATWG spec on compositing"}
	 * @param {String} compositeOperation The compositeOperation to use, or null to clear the cache and redraw it.
	 */
	updateCache (compositeOperation) {
		if (!this.bitmapCache) {
			throw "No cache found. cache() must be called before updateCache()";
		}
		this.bitmapCache.update(compositeOperation);
	}

	/**
	 * Clears the current cache.
	 * @see {@link easeljs.DisplayObject.#cache}
	 */
	uncache () {
		if (this.bitmapCache) {
			this.bitmapCache.release();
			this.bitmapCache = undefined;
		}
	}

	/**
	 * Returns a data URL for the cache, or null if this display object is not cached.
	 * Only generated if the cache has changed, otherwise returns last result.
	 * @return {String} The image data url for the cache.
	 */
	getCacheDataURL () {
		return this.bitmapCache ? this.bitmapCache.getDataURL() : null;
	}

	/**
	 * Transforms the specified x and y position from the coordinate space of the display object
	 * to the global (stage) coordinate space. For example, this could be used to position an HTML label
	 * over a specific point on a nested display object. Returns a Point instance with x and y properties
	 * correlating to the transformed coordinates on the stage.
	 *
	 * @example
	 * displayObject.x = 300;
	 * displayObject.y = 200;
	 * stage.addChild(displayObject);
	 * let point = displayObject.localToGlobal(100, 100);
	 * // Results in x=400, y=300
	 *
	 * @param {Number} x The x position in the source display object to transform.
	 * @param {Number} y The y position in the source display object to transform.
	 * @param {easeljs.Point | Object} [pt=Point] An object to copy the result into. If omitted a new Point object with x/y properties will be returned.
	 * @return {easeljs.Point} A Point instance with x and y properties correlating to the transformed coordinates
	 * on the stage.
	 */
	localToGlobal (x, y, pt = new Point()) {
		return this.getConcatenatedMatrix(this._props.matrix).transformPoint(x, y, pt);
	}

	/**
	 * Transforms the specified x and y position from the global (stage) coordinate space to the
	 * coordinate space of the display object. For example, this could be used to determine
	 * the current mouse position within the display object. Returns a Point instance with x and y properties
	 * correlating to the transformed position in the display object's coordinate space.
	 *
	 * @example
	 * displayObject.x = 300;
	 * displayObject.y = 200;
	 * stage.addChild(displayObject);
	 * let point = displayObject.globalToLocal(100, 100);
	 * // Results in x=-200, y=-100
	 *
	 * @param {Number} x The x position on the stage to transform.
	 * @param {Number} y The y position on the stage to transform.
	 * @param {easeljs.Point | Object} [pt=Point] An object to copy the result into. If omitted a new Point object with x/y properties will be returned.
	 * @return {easeljs.Point} A Point instance with x and y properties correlating to the transformed position in the
	 * display object's coordinate space.
	 */
	globalToLocal (x, y, pt = new Point()) {
		return this.getConcatenatedMatrix(this._props.matrix).invert().transformPoint(x, y, pt);
	}

	/**
	 * Transforms the specified x and y position from the coordinate space of this display object to the coordinate
	 * space of the target display object. Returns a Point instance with x and y properties correlating to the
	 * transformed position in the target's coordinate space. Effectively the same as using the following code with
	 * {@link easeljs.DisplayObject#localToGlobal} and {@link easeljs.DisplayObject#globalToLocal}.
	 *
	 * @example
	 * // long way
	 * let pt = this.localToGlobal(x, y);
	 * pt = target.globalToLocal(pt.x, pt.y);
	 * // shorthand
	 * let pt = this.localToLocal(x, y, target);
	 *
	 * @param {Number} x The x position in the source display object to transform.
	 * @param {Number} y The y position on the source display object to transform.
	 * @param {easeljs.DisplayObject} target The target display object to which the coordinates will be transformed.
	 * @param {easeljs.Point | Object} [pt] An object to copy the result into. If omitted a new Point object with x/y properties will be returned.
	 * @return {easeljs.Point} Returns a Point instance with x and y properties correlating to the transformed position
	 * in the target's coordinate space.
	 */
	localToLocal (x, y, target, pt) {
		pt = this.localToGlobal(x, y, pt);
		return target.globalToLocal(pt.x, pt.y, pt);
	}

	/**
	 * Shortcut method to quickly set the transform properties on the display object. All parameters are optional.
	 * Omitted parameters will have the default value set.
	 *
	 * @example
	 * displayObject.setTransform(100, 100, 2, 2);
	 *
	 * @param {Number} [x=0] The horizontal translation (x position) in pixels
	 * @param {Number} [y=0] The vertical translation (y position) in pixels
	 * @param {Number} [scaleX=1] The horizontal scale, as a percentage of 1
	 * @param {Number} [scaleY=1] the vertical scale, as a percentage of 1
	 * @param {Number} [rotation=0] The rotation, in degrees
	 * @param {Number} [skewX=0] The horizontal skew factor
	 * @param {Number} [skewY=0] The vertical skew factor
	 * @param {Number} [regX=0] The horizontal registration point in pixels
	 * @param {Number} [regY=0] The vertical registration point in pixels
	 * @return {easeljs.DisplayObject} Returns this instance. Useful for chaining commands.
	*/
	setTransform (x=0, y=0, scaleX=1, scaleY=1, rotation=0, skewX=0, skewY=0, regX=0, regY=0) {
		this.x = x;
		this.y = y;
		this.scaleX = scaleX;
		this.scaleY = scaleY;
		this.rotation = rotation;
		this.skewX = skewX;
		this.skewY = skewY;
		this.regX = regX;
		this.regY = regY;
		return this;
	}

	/**
	 * Returns a matrix based on this object's current transform.
	 * @param {easeljs.Matrix2D} [matrix] A Matrix2D object to populate with the calculated values. If null, a new Matrix object is returned.
	 * @return {easeljs.Matrix2D} A matrix representing this display object's transform.
	 */
	getMatrix (matrix) {
		let o = this, mtx = matrix&&matrix.identity() || new Matrix2D();
		return o.transformMatrix ?  mtx.copy(o.transformMatrix) : mtx.appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY);
	}

	/**
	 * Generates a Matrix2D object representing the combined transform of the display object and all of its
	 * parent Containers up to the highest level ancestor (usually the {@link easeljs.Stage}). This can
	 * be used to transform positions between coordinate spaces, such as with {@link easeljs.DisplayObject#localToGlobal}
	 * and {@link easeljs.DisplayObject#globalToLocal}.
	 *
	 * @param {easeljs.Matrix2D} [matrix] A Matrix2D object to populate with the calculated values. If null, a new Matrix2D object is returned.
	 * @return {easeljs.Matrix2D} The combined matrix.
	 */
	getConcatenatedMatrix (matrix) {
		let o = this, mtx = this.getMatrix(matrix);
		while (o = o.parent) {
			mtx.prependMatrix(o.getMatrix(o._props.matrix));
		}
		return mtx;
	}

	/**
	 * Generates a DisplayProps object representing the combined display properties of the  object and all of its
	 * parent Containers up to the highest level ancestor (usually the {@link easeljs.Stage}).
	 * @param {easeljs.DisplayProps} [props] A DisplayProps object to populate with the calculated values. If null, a new DisplayProps object is returned.
	 * @return {easeljs.DisplayProps} The combined display properties.
	 */
	getConcatenatedDisplayProps (props) {
		props = props ? props.identity() : new DisplayProps();
		let o = this, mtx = o.getMatrix(props.matrix);
		do {
			props.prepend(o.visible, o.alpha, o.shadow, o.compositeOperation);

			// we do this to avoid problems with the matrix being used for both operations when o._props.matrix is passed in as the props param.
			// this could be simplified (ie. just done as part of the prepend above) if we switched to using a pool.
			if (o != this) { mtx.prependMatrix(o.getMatrix(o._props.matrix)); }
		} while (o = o.parent);
		return props;
	}

	/**
	 * Tests whether the display object intersects the specified point in local coordinates (ie. draws a pixel with alpha > 0 at
	 * the specified position). This ignores the alpha, shadow, hitArea, mask, and compositeOperation of the display object.
	 *
	 * Please note that shape-to-shape collision is not currently supported by EaselJS.
	 *
	 * @example
	 * stage.addEventListener("stagemousedown", event => {
	 *   let hit = shape.hitTest(event.stageX, event.stageY);
	 *   // hit == true when shape is clicked
	 * });
	 *
	 * @param {Number} x The x position to check in the display object's local coordinates.
	 * @param {Number} y The y position to check in the display object's local coordinates.
	 * @return {Boolean} A Boolean indicating whether a visible portion of the DisplayObject intersect the specified
	 * local Point.
	*/
	hitTest (x, y) {
		let ctx = DisplayObject._hitTestContext;
		ctx.setTransform(1, 0, 0, 1, -x, -y);
		this.draw(ctx);

		let hit = this._testHit(ctx);
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, 2, 2);
		return hit;
	}

	/**
	 * Provides a chainable shortcut method for setting a number of properties on the instance.
	 *
	 * @example
	 * let graphics = new Graphics().beginFill("#ff0000").drawCircle(0, 0, 25);
	 * let shape = stage.addChild(new Shape()).set({ graphics, x: 100, y: 100, alpha: 0.5 });
	 *
	 * @param {Object} props A generic object containing properties to copy to the DisplayObject instance.
	 * @return {easeljs.DisplayObject} Returns the instance the method is called on (useful for chaining calls.)
	 * @chainable
	*/
	set (props) {
		for (let n in props) { this[n] = props[n]; }
		return this;
	}

	/**
	 * Returns a rectangle representing this object's bounds in its local coordinate system (ie. with no transformation).
	 * Objects that have been cached will return the bounds of the cache.
	 *
	 * Not all display objects can calculate their own bounds (ex. Shape). For these objects, you can use
	 * {@link easeljs.DisplayObject#setBounds} so that they are included when calculating Container bounds.
	 *
	 * <table>
	 * 	<tr><td><b>All</b></td><td>
	 * 		All display objects support setting bounds manually using setBounds(). Likewise, display objects that
	 * 		have been cached using cache() will return the bounds of their cache. Manual and cache bounds will override
	 * 		the automatic calculations listed below.
	 * 	</td></tr>
	 * 	<tr><td><b>Bitmap</b></td><td>
	 * 		Returns the width and height of the sourceRect (if specified) or image, extending from (x=0,y=0).
	 * 	</td></tr>
	 * 	<tr><td><b>Sprite</b></td><td>
	 * 		Returns the bounds of the current frame. May have non-zero x/y if a frame registration point was specified
	 * 		in the spritesheet data. See also {@link easeljs.SpriteSheet#getFrameBounds}
	 * 	</td></tr>
	 * 	<tr><td><b>Container</b></td><td>
	 * 		Returns the aggregate (combined) bounds of all children that return a non-null value from getBounds().
	 * 	</td></tr>
	 * 	<tr><td><b>Shape</b></td><td>
	 * 		Does not currently support automatic bounds calculations. Use setBounds() to manually define bounds.
	 * 	</td></tr>
	 * 	<tr><td><b>Text</b></td><td>
	 * 		Returns approximate bounds. Horizontal values (x/width) are quite accurate, but vertical values (y/height) are
	 * 		not, especially when using textBaseline values other than "top".
	 * 	</td></tr>
	 * 	<tr><td><b>BitmapText</b></td><td>
	 * 		Returns approximate bounds. Values will be more accurate if spritesheet frame registration points are close
	 * 		to (x=0,y=0).
	 * 	</td></tr>
	* </table>
	 *
	 * @example
	 * /* Bounds can be expensive to calculate for some objects (ex. text, or containers with many children), and
	 * are recalculated each time you call getBounds(). You can prevent recalculation on static objects by setting the
	 * bounds explicitly. *\/
	 * let bounds = obj.getBounds();
	 * obj.setBounds(bounds.x, bounds.y, bounds.width, bounds.height);
	 * // getBounds will now use the set values, instead of recalculating
	 *
	 * @example
	 * // To reduce memory impact, the returned Rectangle instance may be reused internally
	 * let bounds = obj.getBounds().clone();
	 * // OR:
	 * rect.copy(obj.getBounds());
	 *
	 * @return {easeljs.Rectangle} A Rectangle instance representing the bounds, or null if bounds are not available for this object.
	 */
	getBounds () {
		if (this._bounds) { return this._rectangle.copy(this._bounds); }
		let cacheCanvas = this.cacheCanvas;
		if (cacheCanvas) {
			let scale = this._cacheScale;
			return this._rectangle.setValues(this._cacheOffsetX, this._cacheOffsetY, cacheCanvas.width/scale, cacheCanvas.height/scale);
		}
		return null;
	}

	/**
	 * Returns a rectangle representing this object's bounds in its parent's coordinate system (ie. with transformations applied).
	 * Objects that have been cached will return the transformed bounds of the cache.
	 *
	 * Not all display objects can calculate their own bounds (ex. Shape). For these objects, you can use
	 * {@link easeljs.DisplayObject#setBounds} so that they are included when calculating Container bounds.
	 *
	 * To reduce memory impact, the returned Rectangle instance may be reused internally; clone the instance or copy its
	 * values if you need to retain it.
	 *
	 * Container instances calculate aggregate bounds for all children that return bounds via getBounds.
	 * @return {easeljs.Rectangle} A Rectangle instance representing the bounds, or null if bounds are not available for this object.
	 */
	getTransformedBounds () {
		return this._getBounds();
	}

	/**
	 * Allows you to manually specify the bounds of an object that either cannot calculate their own bounds (ex. Shape &
	 * Text) for future reference, or so the object can be included in Container bounds. Manually set bounds will always
	 * override calculated bounds.
	 *
	 * The bounds should be specified in the object's local (untransformed) coordinates. For example, a Shape instance
	 * with a 25px radius circle centered at 0,0 would have bounds of (-25, -25, 50, 50).
	 *
	 * @param {Number} x The x origin of the bounds. Pass null to remove the manual bounds.
	 * @param {Number} y The y origin of the bounds.
	 * @param {Number} width The width of the bounds.
	 * @param {Number} height The height of the bounds.
	 */
	setBounds (x, y, width, height) {
		if (x == null) { this._bounds = null; }
		this._bounds = (this._bounds || new Rectangle()).setValues(x, y, width, height);
	}

	/**
	 * Returns a clone of this DisplayObject. Some properties that are specific to this instance's current context are
	 * reverted to their defaults (for example .parent). Caches are not maintained across clones, and some elements
	 * are copied by reference (masks, individual filter instances, hit area)
	 *
	 * @return {easeljs.DisplayObject} A clone of the current DisplayObject instance.
	 */
	clone () {
		return this._cloneProps(new DisplayObject());
	}

	/**
	 * Returns a string representation of this object.
	 * @return {String} a string representation of the instance.
	 */
	toString () {
		return `[${this.constructor.name}${this.name ? ` (name=${this.name})` : ""}]`;
	}

	/**
	 * @protected
	 * @param {easeljs.DisplayObject} o The DisplayObject instance which will have properties from the current DisplayObject
	 * instance copied into.
	 * @return {easeljs.DisplayObject} o
	 */
	_cloneProps (o) {
		o.alpha = this.alpha;
		o.mouseEnabled = this.mouseEnabled;
		o.tickEnabled = this.tickEnabled;
		o.name = this.name;
		o.regX = this.regX;
		o.regY = this.regY;
		o.rotation = this.rotation;
		o.scaleX = this.scaleX;
		o.scaleY = this.scaleY;
		o.shadow = this.shadow;
		o.skewX = this.skewX;
		o.skewY = this.skewY;
		o.visible = this.visible;
		o.x  = this.x;
		o.y = this.y;
		o.compositeOperation = this.compositeOperation;
		o.snapToPixel = this.snapToPixel;
		o.filters = this.filters==null?null:this.filters.slice(0);
		o.mask = this.mask;
		o.hitArea = this.hitArea;
		o.cursor = this.cursor;
		o._bounds = this._bounds;
		return o;
	}

	/**
	 * @protected
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {easeljs.Shadow} [shadow=Shadow]
	 */
	_applyShadow (ctx, shadow = Shadow.identity) {
		shadow = shadow;
		ctx.shadowColor = shadow.color;
		ctx.shadowOffsetX = shadow.offsetX;
		ctx.shadowOffsetY = shadow.offsetY;
		ctx.shadowBlur = shadow.blur;
	}

	/**
	 * @protected
	 * @param {Object} evtObj An event object that will be dispatched to all tick listeners. This object is reused between dispatchers to reduce construction & GC costs.
	 */
	_tick (evtObj) {
		// because tick can be really performance sensitive, check for listeners before calling dispatchEvent.
		let ls = this._listeners;
		if (ls && ls["tick"]) {
			// reset & reuse the event object to avoid construction / GC costs:
			evtObj.target = null;
			evtObj.propagationStopped = evtObj.immediatePropagationStopped = false;
			this.dispatchEvent(evtObj);
		}
	}

	/**
	 * @protected
	 * @param {CanvasRenderingContext2D} ctx
	 * @return {Boolean}
	 */
	_testHit (ctx) {
		try {
			return ctx.getImageData(0, 0, 1, 1).data[3] > 1;
		} catch (e) {
			if (!DisplayObject.suppressCrossDomainErrors) {
				throw "An error has occurred. This is most likely due to security restrictions on reading canvas pixel data with local or cross-domain images.";
			}
			return false;
		}
	}

	/**
	 * @protected
	 * @param {easeljs.Matrix2D} matrix
	 * @param {Boolean} ignoreTransform If true, does not apply this object's transform.
	 * @return {easeljs.Rectangle}
	 */
	_getBounds (matrix, ignoreTransform) {
		return this._transformBounds(this.getBounds(), matrix, ignoreTransform);
	}

	/**
	 * @protected
	 * @param {easeljs.Rectangle} bounds
	 * @param {easeljs.Matrix2D} matrix
	 * @param {Boolean} ignoreTransform
	 * @return {easeljs.Rectangle}
	 */
	_transformBounds (bounds, matrix, ignoreTransform) {
		if (!bounds) { return bounds; }
		let { x, y, width, height } = bounds;
		let mtx = this._props.matrix;
		mtx = ignoreTransform ? mtx.identity() : this.getMatrix(mtx);

		if (x || y) { mtx.appendTransform(0,0,1,1,0,0,0,-x,-y); } // TODO: simplify this.
		if (matrix) { mtx.prependMatrix(matrix); }

		let x_a = width*mtx.a, x_b = width*mtx.b;
		let y_c = height*mtx.c, y_d = height*mtx.d;
		let tx = mtx.tx, ty = mtx.ty;

		let minX = tx, maxX = tx, minY = ty, maxY = ty;

		if ((x = x_a + tx) < minX) { minX = x; } else if (x > maxX) { maxX = x; }
		if ((x = x_a + y_c + tx) < minX) { minX = x; } else if (x > maxX) { maxX = x; }
		if ((x = y_c + tx) < minX) { minX = x; } else if (x > maxX) { maxX = x; }

		if ((y = x_b + ty) < minY) { minY = y; } else if (y > maxY) { maxY = y; }
		if ((y = x_b + y_d + ty) < minY) { minY = y; } else if (y > maxY) { maxY = y; }
		if ((y = y_d + ty) < minY) { minY = y; } else if (y > maxY) { maxY = y; }

		return bounds.setValues(minX, minY, maxX-minX, maxY-minY);
	}

	/**
	 * Indicates whether the display object has any mouse event listeners or a cursor.
	 * @protected
	 * @return {Boolean}
	 */
	_hasMouseEventListener () {
		let evts = DisplayObject._MOUSE_EVENTS;
		for (let i=0, l=evts.length; i<l; i++) {
			if (this.hasEventListener(evts[i])) { return true; }
		}
		return !!this.cursor;
	}

}

{
	let canvas = window.createjs && createjs.createCanvas?createjs.createCanvas():document.createElement("canvas"); // prevent errors on load in browsers without canvas.
	if (canvas.getContext) {
		/**
		 * @type {HTMLCanvasElement | Object}
		 * @static
		 */
		DisplayObject._hitTestCanvas = canvas;
		/**
		 * @type {CanvasRenderingContext2D}
		 * @static
		 */
		DisplayObject._hitTestContext = canvas.getContext("2d");
		canvas.width = canvas.height = 1;
	}
}

/**
 * Listing of mouse event names. Used in _hasMouseEventListener.
 * @static
 * @type {Array<String>}
 * @readonly
 */
DisplayObject._MOUSE_EVENTS = ["click","dblclick","mousedown","mouseout","mouseover","pressmove","pressup","rollout","rollover"];

/**
 * Suppresses errors generated when using features like hitTest, mouse events, and {{#crossLink "getObjectsUnderPoint"}}{{/crossLink}}
 * with cross domain content.
 * @static
 * @type {Boolean}
 * @default false
 */
DisplayObject.suppressCrossDomainErrors = false;

/**
 * @static
 * @type {Boolean}
 * @default false
 */
DisplayObject.snapToPixelEnabled = false;

/**
 * Enum like property for determining StageGL render lookup, i.e. where to expect properties.
 * @static
 * @type {Number}
 */
DisplayObject._StageGL_NONE = 0;

/**
 * Enum like property for determining StageGL render lookup, i.e. where to expect properties.
 * @static
 * @type {Number}
 */
DisplayObject._StageGL_SPRITE = 1;

/**
 * Enum like property for determining StageGL render lookup, i.e. where to expect properties.
 * @static
 * @type {Number}
 */
DisplayObject._StageGL_BITMAP = 2;

/**
 * Dispatched when the user presses their left mouse button over the display object.
 * @see {@link easeljs.MouseEvent}
 * @event easeljs.DisplayObject#mousedown
 * @since 0.6.0
 */

/**
 * Dispatched when the user presses their left mouse button and then releases it while over the display object.
 * @see {@link easeljs.MouseEvent}
 * @event easeljs.DisplayObject#click
 * @since 0.6.0
 */

/**
 * Dispatched when the user double clicks their left mouse button over this display object.
 * @see {@link easeljs.MouseEvent}
 * @event easeljs.DisplayObject#dblclick
 * @since 0.6.0
 */

/**
 * Dispatched when the user's mouse enters this display object. This event must be enabled using
 * {@link easeljs.Stage#enableMouseOver}.
 * @see {@link easeljs.DisplayObject#event:rollover}
 * @see {@link easeljs.MouseEvent}
 * @event easeljs.DisplayObject#mouseover
 * @since 0.6.0
 */

/**
 * Dispatched when the user's mouse leaves this display object. This event must be enabled using
 * {@link easeljs.Stage#enableMouseOver}.
 * @see {@link easeljs.DisplayObject#event:rollout}
 * @see {@link easeljs.MouseEvent}
 * @event easeljs.DisplayObject#mouseout
 * @since 0.6.0
 */

/**
 * This event is similar to {@link easeljs.DisplayObject#event:mouseover}, with the following
 * differences: it does not bubble, and it considers {@link easeljs.Container} instances as an
 * aggregate of their content.
 *
 * For example, myContainer contains two overlapping children: shapeA and shapeB. The user moves their mouse over
 * shapeA and then directly on to shapeB. With a listener for {@link easeljs.DisplayObject#event:mouseover} on
 * myContainer, two events would be received, each targeting a child element:
 * <ol>
 *   <li>when the mouse enters shapeA (target=shapeA)</li>
 *   <li>when the mouse enters shapeB (target=shapeB)</li>
 * </ol>
 * However, with a listener for "rollover" instead, only a single event is received when the mouse first enters
 * the aggregate myContainer content (target=myContainer).
 *
 * This event must be enabled using {@link easeljs.Stage#enableMouseOver}.
 * @see {@link easeljs.MouseEvent}
 * @event easeljs.DisplayObject#rollover
 * @since 0.7.0
 */

/**
 * This event is similar to {@link easeljs.DisplayObject#event:mouseout}, with the following
 * differences: it does not bubble, and it considers {@link easeljs.Container} instances as an
 * aggregate of their content.
 *
 * For example, myContainer contains two overlapping children: shapeA and shapeB. The user moves their mouse over
 * shapeA, then directly on to shapeB, then off both. With a listener for {@link easeljs.DisplayObject#event:mouseout}
 * on myContainer, two events would be received, each targeting a child element:<OL>
 * <LI>when the mouse leaves shapeA (target=shapeA)</LI>
 * <LI>when the mouse leaves shapeB (target=shapeB)</LI>
 * </OL>
 * However, with a listener for "rollout" instead, only a single event is received when the mouse leaves
 * the aggregate myContainer content (target=myContainer).
 *
 * This event must be enabled using {@link easeljs.Stage#enableMouseOver}.
 * @see {@link easeljs.MouseEvent}
 * @event easeljs.DisplayObject#rollout
 * @since 0.7.0
 */

/**
 * After a {@link easeljs.DisplayObject#event:mousedown} occurs on a display object, a pressmove
 * event will be generated on that object whenever the mouse moves until the mouse press is released. This can be
 * useful for dragging and similar operations.
 * @event easeljs.DisplayObject#pressmove
 * @since 0.7.0
 */

/**
 * After a {@link easeljs.DisplayObject#event:mousedown} occurs on a display object, a pressup event
 * will be generated on that object when that mouse press is released. This can be useful for dragging and similar
 * operations.
 * @event easeljs.DisplayObject#pressup
 * @since 0.7.0
 */

/**
 * Dispatched when the display object is added to a parent container.
 * @event easeljs.DisplayObject#added
 */

/**
 * Dispatched when the display object is removed from its parent container.
 * @event easeljs.DisplayObject#removed
 */

/**
 * Dispatched on each display object on a stage whenever the stage updates. This occurs immediately before the
 * rendering (draw) pass. When {@link easeljs.Stage#update} is called, first all display objects on
 * the stage dispatch the tick event, then all of the display objects are drawn to stage. Children will have their
 * tick event dispatched in order of their depth prior to the event being dispatched on their parent.
 * @event easeljs.DisplayObject#tick
 * @param {Object} target The object that dispatched the event.
 * @param {String} type The event type.
 * @param {Array} params An array containing any arguments that were passed to the Stage.update() method.
 * @since 0.6.0
 */
