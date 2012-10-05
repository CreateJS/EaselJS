/*
* DisplayObject
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
* The EaselJS Javascript library provides a retained graphics mode for canvas
* including a full, hierarchical display list, a core interaction model, and
* helper classes to make working with 2D graphics in Canvas much easier.
* @module EaselJS
**/

// namespace:
this.createjs = this.createjs||{};

(function() {

/**
* DisplayObject is an abstract class that should not be constructed directly. Instead construct subclasses such as
* Container, Bitmap, and Shape. DisplayObject is the base class for all display classes in the EaselJS library.
* It defines the core properties and methods that are shared between all display objects.
* @class DisplayObject
* @constructor
**/
var DisplayObject = function() {
  this.initialize();
}
var p = DisplayObject.prototype;

	/**
	 * Suppresses errors generated when using features like hitTest, onPress/onClick, and getObjectsUnderPoint with cross
	 * domain content
	 * @property suppressCrossDomainErrors
	 * @static
	 * @type Boolean
	 * @default false
	 **/
	DisplayObject.suppressCrossDomainErrors = false;

	/**
	 * @property _hitTestCanvas
	 * @type HTMLCanvasElement
	 * @static
	 * @protected
	 **/
	DisplayObject._hitTestCanvas = createjs.createCanvas?createjs.createCanvas():document.createElement("canvas");
	DisplayObject._hitTestCanvas.width = DisplayObject._hitTestCanvas.height = 1;

	/**
	 * @property _hitTestContext
	 * @type CanvasRenderingContext2D
	 * @static
	 * @protected
	 **/
	DisplayObject._hitTestContext = DisplayObject._hitTestCanvas.getContext("2d");

	/**
	 * @property _nextCacheID
	 * @type Number
	 * @static
	 * @protected
	 **/
	DisplayObject._nextCacheID = 1;

	/**
	 * The alpha (transparency) for this display object. 0 is fully transparent, 1 is fully opaque.
	 * @property alpha
	 * @type Number
	 * @default 1
	 **/
	p.alpha = 1;

	/**
	 * If a cache is active, this returns the canvas that holds the cached version of this display object. See cache()
	 * for more information. READ-ONLY.
	 * @property cacheCanvas
	 * @type HTMLCanvasElement
	 * @default null
	 **/
	p.cacheCanvas = null;

	/**
	 * Unique ID for this display object. Makes display objects easier for some uses.
	 * @property id
	 * @type Number
	 * @default -1
	 **/
	p.id = -1;

	/**
	 * Indicates whether to include this object when running Stage.getObjectsUnderPoint(), and thus for mouse
	 * interactions. Setting this to true for
	 * Containers will cause the Container to be returned (not its children) regardless of whether it's mouseChildren property
	 * is true.
	 * @property mouseEnabled
	 * @type Boolean
	 * @default true
	 **/
	p.mouseEnabled = true;

	/**
	 * An optional name for this display object. Included in toString(). Useful for debugging.
	 * @property name
	 * @type String
	 * @default null
	 **/
	p.name = null;

	/**
	 * A reference to the Container or Stage object that contains this display object, or null if it has not been added to
	 * one. READ-ONLY.
	 * @property parent
	 * @final
	 * @type DisplayObject
	 * @default null
	 **/
	p.parent = null;

	/**
	 * The x offset for this display object's registration point. For example, to make a 100x100px Bitmap rotate around
	 * it's center, you would set regX and regY to 50.
	 * @property regX
	 * @type Number
	 * @default 0
	 **/
	p.regX = 0;

	/**
	 * The y offset for this display object's registration point. For example, to make a 100x100px Bitmap rotate around
	 * it's center, you would set regX and regY to 50.
	 * @property regY
	 * @type Number
	 * @default 0
	 **/
	p.regY = 0;

	/**
	 * The rotation in degrees for this display object.
	 * @property rotation
	 * @type Number
	 * @default 0
	 **/
	p.rotation = 0;

	/**
	 * The factor to stretch this display object horizontally. For example, setting scaleX to 2 will stretch the display
	 * object to twice it's nominal width.
	 * @property scaleX
	 * @type Number
	 * @default 1
	 **/
	p.scaleX = 1;

	/**
	 * The factor to stretch this display object vertically. For example, setting scaleY to 0.5 will stretch the display
	 * object to half it's nominal height.
	 * @property scaleY
	 * @type Number
	 * @default 1
	 **/
	p.scaleY = 1;

	/**
	 * The factor to skew this display object horizontally.
	 * @property skewX
	 * @type Number
	 * @default 0
	 **/
	p.skewX = 0;

	/**
	 * The factor to skew this display object vertically.
	 * @property skewY
	 * @type Number
	 * @default 0
	 **/
	p.skewY = 0;

	/**
	 * A shadow object that defines the shadow to render on this display object. Set to null to remove a shadow. If
	 * null, this property is inherited from the parent container.
	 * @property shadow
	 * @type Shadow
	 * @default null
	 **/
	p.shadow = null;

	/**
	 * Indicates whether this display object should be rendered to the canvas and included when running
	 * Stage.getObjectsUnderPoint().
	 * @property visible
	 * @type Boolean
	 * @default true
	 **/
	p.visible = true;

	/**
	 * The x (horizontal) position of the display object, relative to its parent.
	 * @property x
	 * @type Number
	 * @default 0
	 **/
	p.x = 0;

	/** The y (vertical) position of the display object, relative to its parent.
	 * @property y
	 * @type Number
	 * @default 0
	 **/
	p.y = 0;

	/**
	 * The composite operation indicates how the pixels of this display object will be composited with the elements
	 * behind it. If null, this property is inherited from the parent container. For more information, read the
	 * <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#compositing">
	 * whatwg spec on compositing</a>.
	 * @property compositeOperation
	 * @type String
	 * @default null
	 **/
	p.compositeOperation = null;

	/**
	 * Indicates whether the display object should have it's x & y position rounded prior to drawing it to stage.
	 * Snapping to whole pixels can result in a sharper and faster draw for images (ex. Bitmap & cached objects).
	 * This only applies if the enclosing stage has snapPixelsEnabled set to true. The snapToPixel property is true
	 * by default for Bitmap and BitmapAnimation instances, and false for all other display objects.
	 * <br/><br/>
	 * Note that this applies only rounds the display object's local position. You should
	 * ensure that all of the display object's ancestors (parent containers) are also on a whole pixel. You can do this
	 * by setting the ancestors' snapToPixel property to true.
	 * @property snapToPixel
	 * @type Boolean
	 * @default false
	 **/
	p.snapToPixel = false;

	/**
	 * The onPress callback is called when the user presses down on their mouse over this display object. The handler
	 * is passed a single param containing the corresponding MouseEvent instance. You can subscribe to the onMouseMove
	 * and onMouseUp callbacks of the event object to receive these events until the user releases the mouse button.
	 * If an onPress handler is set on a container, it will receive the event if any of its children are clicked.
	 * @event onPress
	 * @param {MouseEvent} event MouseEvent with information about the event.
	 **/
	p.onPress = null;

	/**
	 * The onClick callback is called when the user presses down on and then releases the mouse button over this
	 * display object. The handler is passed a single param containing the corresponding MouseEvent instance. If an
	 * onClick handler is set on a container, it will receive the event if any of its children are clicked.
	 * @event onClick
	 * @param {MouseEvent} event MouseEvent with information about the event.
	 **/
	p.onClick = null;

	/**
	 * The onDoubleClick callback is called when the user double clicks over this display object. The handler is
	 * passed a single param containing the corresponding MouseEvent instance. If an onDoubleClick handler is set
	 * on a container, it will receive the event if any of its children are clicked.
	 * @event onDoubleClick
	 * @param {MouseEvent} event MouseEvent with information about the event.
	 **/
	p.onDoubleClick = null;

	/**
	 * The onMouseOver callback is called when the user rolls over the display object. You must enable this event using
	 * stage.enableMouseOver(). The handler is passed a single param containing the corresponding MouseEvent instance.
	 * @event onMouseOver
	 * @param {MouseEvent} event MouseEvent with information about the event.
	 **/
	p.onMouseOver = null;

	/**
	 * The onMouseOut callback is called when the user rolls off of the display object. You must enable this event using
	 * stage.enableMouseOver(). The handler is passed a single param containing the corresponding MouseEvent instance.
	 * @event onMouseOut
	 * @param {MouseEvent} event MouseEvent with information about the event.
	 **/
	p.onMouseOut = null;

	/**
	 * The onTick callback is called on each display object on a stage whenever the stage updates.
	 * This occurs immediately before the rendering (draw) pass. When stage.update() is called, first all display objects
	 * on the stage have onTick called, then all of the display objects are drawn to stage. Children will have their
	 * onTick called in order of their depth prior to onTick being called on their parent.
	 * <br/><br/>
	 * Any parameters passed in to stage.update() are passed on to the onTick() handlers. For example, if you call
	 * stage.update("hello"), all of the display objects with a handler will have onTick("hello") called.
	 * @event onTick
	 **/
	p.onTick = null;

	/**
	 * An array of Filter objects to apply to this display object. Filters are only applied / updated when cache() or
	 * updateCache() is called on the display object, and only apply to the area that is cached.
	 * @property filters
	 * @type Array[Filter]
	 * @default null
	 **/
	p.filters = null;

	/**
	* Returns an ID number that uniquely identifies the current cache for this display object.
	* This can be used to determine if the cache has changed since a previous check.
	* @property cacheID
	* @type Number
	* @default 0
	*/
	p.cacheID = 0;
	
	/**
	 * A Shape instance that defines a vector mask (clipping path) for this display object.  The shape's transformation
	 * will be applied relative to the display object's parent coordinates (as if it were a child of the parent).
	 * @property mask
	 * @type Shape
	 * @default null
	 */
	p.mask = null;
	
	/**
	 * A display object that will be tested when checking mouse interactions or testing getObjectsUnderPoint. The hit area
	 * will have its transformation applied relative to this display object's coordinate space (as though the hit test object were a child of this
	 * display object and relative to its regX/Y). It is NOT used for hitTest().
	 * @property hitArea
	 * @type DisplayObject
	 * @default null
	 */
	p.hitArea = null;
	

// private properties:

	/**
	 * @property _cacheOffsetX
	 * @protected
	 * @type Number
	 * @default 0
	 **/
	p._cacheOffsetX = 0;

	/**
	 * @property _cacheOffsetY
	 * @protected
	 * @type Number
	 * @default 0
	 **/
	p._cacheOffsetY = 0;
	
	/**
	 * @property _cacheScale
	 * @protected
	 * @type Number
	 * @default 1
	 **/
	p._cacheScale = 1;

	/**
	* @property _cacheDataURLID
	* @protected
	* @type Number
	* @default 0
	*/
	p._cacheDataURLID = 0;
	
	/**
	* @property _cacheDataURL
	* @protected
	* @type String
	* @default null
	*/
	p._cacheDataURL = null;

	/**
	 * @property _matrix
	 * @protected
	 * @type Matrix2D
	 * @default null
	 **/
	p._matrix = null;
	

// constructor:
	// separated so it can be easily addressed in subclasses:

	/**
	 * Initialization method.
	 * @method initialize
	 * @protected
	*/
	p.initialize = function() {
		this.id = createjs.UID.get();
		this._matrix = new createjs.Matrix2D();
	}

// public methods:
	/**
	 * Returns true or false indicating whether the display object would be visible if drawn to a canvas.
	 * This does not account for whether it would be visible within the boundaries of the stage.
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method isVisible
	 * @return {Boolean} Boolean indicating whether the display object would be visible if drawn to a canvas
	 **/
	p.isVisible = function() {
		return this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0;
	}

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
		var cacheCanvas = this.cacheCanvas;
		if (ignoreCache || !cacheCanvas) { return false; }
		var scale = this._cacheScale;
		ctx.drawImage(cacheCanvas, this._cacheOffsetX, this._cacheOffsetY, cacheCanvas.width/scale, cacheCanvas.height/scale);
		return true;
	}
	
	/**
	 * Applies this display object's transformation, alpha, globalCompositeOperation, clipping path (mask), and shadow to the specified
	 * context. This is typically called prior to draw.
	 * @method setupContext
	 * @param {CanvasRenderingContext2D} ctx The canvas 2D to update.
	 **/
	p.updateContext = function(ctx) {
		var mtx, mask=this.mask, o=this;
		
		if (mask && mask.graphics) {
			mtx = mask.getMatrix(mask._matrix);
			ctx.transform(mtx.a,  mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
			
			mask.graphics.drawAsPath(ctx);
			ctx.clip();
			
			mtx.invert();
			ctx.transform(mtx.a,  mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
		}
		
		mtx = o._matrix.identity().appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY);
		// TODO: should be a better way to manage this setting. For now, using dynamic access to avoid circular dependencies:
		if (createjs["Stage"]._snapToPixelEnabled && o.snapToPixel) { ctx.transform(mtx.a,  mtx.b, mtx.c, mtx.d, mtx.tx+0.5|0, mtx.ty+0.5|0); }
		else { ctx.transform(mtx.a,  mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty); }
		ctx.globalAlpha *= o.alpha;
		if (o.compositeOperation) { ctx.globalCompositeOperation = o.compositeOperation; }
		if (o.shadow) { this._applyShadow(ctx, o.shadow); }
	}

	/**
	 * Draws the display object into a new canvas, which is then used for subsequent draws. For complex content
	 * that does not change frequently (ex. a Container with many children that do not move, or a complex vector Shape),
	 * this can provide for much faster rendering because the content does not need to be re-rendered each tick. The
	 * cached display object can be moved, rotated, faded, etc freely, however if it's content changes, you must manually
	 * update the cache by calling updateCache() or cache() again. You must specify the cache area via the x, y, w,
	 * and h parameters. This defines the rectangle that will be rendered and cached using this display object's
	 * coordinates. For example if you defined a Shape that drew a circle at 0, 0 with a radius of 25, you could call
	 * myShape.cache(-25, -25, 50, 50) to cache the full shape.
	 * @method cache
	 * @param {Number} x The x coordinate origin for the cache region.
	 * @param {Number} y The y coordinate origin for the cache region.
	 * @param {Number} width The width of the cache region.
	 * @param {Number} height The height of the cache region.
	 * @param {Number} scale Optional. The scale at which the cache will be created. For example, if you cache a vector shape using
	 * 	myShape.cache(0,0,100,100,2) then the resulting cacheCanvas will be 200x200 px. This lets you scale and rotate
	 * 	cached elements with greater fidelity. Default is 1.
	 **/
	p.cache = function(x, y, width, height, scale) {
		// draw to canvas.
		scale = scale||1;
		if (!this.cacheCanvas) { this.cacheCanvas = createjs.createCanvas?createjs.createCanvas():document.createElement("canvas"); }
		this.cacheCanvas.width = Math.ceil(width*scale);
		this.cacheCanvas.height = Math.ceil(height*scale);
		this._cacheOffsetX = x;
		this._cacheOffsetY = y;
		this._cacheScale = scale||1;
		this.updateCache();
	}

	/**
	 * Redraws the display object to its cache. Calling updateCache without an active cache will throw an error.
	 * If compositeOperation is null the current cache will be cleared prior to drawing. Otherwise the display object
	 * will be drawn over the existing cache using the specified compositeOperation.
	 * @method updateCache
	 * @param {String} compositeOperation The compositeOperation to use, or null to clear the cache and redraw it.
	 * <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#compositing">
	 * whatwg spec on compositing</a>.
	 **/
	p.updateCache = function(compositeOperation) {
		var cacheCanvas = this.cacheCanvas, offX = this._cacheOffsetX, offY = this._cacheOffsetY, scale = this._cacheScale;
		if (!cacheCanvas) { throw "cache() must be called before updateCache()"; }
		var ctx = cacheCanvas.getContext("2d");
		ctx.save();
		if (!compositeOperation) { ctx.clearRect(0, 0, cacheCanvas.width, cacheCanvas.height); }
		ctx.globalCompositeOperation = compositeOperation;
		ctx.setTransform(scale, 0, 0, scale, -offX, -offY);
		this.draw(ctx, true);
		this._applyFilters();
		ctx.restore();
		this.cacheID = DisplayObject._nextCacheID++;
	}

	/**
	 * Clears the current cache. See cache() for more information.
	 * @method uncache
	 **/
	p.uncache = function() {
		this._cacheDataURL = this.cacheCanvas = null;
		this.cacheID = this._cacheOffsetX = this._cacheOffsetY = 0;
		this._cacheScale = 1;
	}
	
	/**
	* Returns a data URL for the cache, or null if this display object is not cached.
	* Uses cacheID to ensure a new data URL is not generated if the cache has not changed.
	* @method getCacheDataURL.
	**/
	p.getCacheDataURL = function() {
		if (!this.cacheCanvas) { return null; }
		if (this.cacheID != this._cacheDataURLID) { this._cacheDataURL = this.cacheCanvas.toDataURL(); }
		return this._cacheDataURL;
	}

	/**
	 * Returns the stage that this display object will be rendered on, or null if it has not been added to one.
	 * @method getStage
	 * @return {Stage} The Stage instance that the display object is a descendent of. null if the DisplayObject has not
	 * been added to a Stage.
	 **/
	p.getStage = function() {
		var o = this;
		while (o.parent) {
			o = o.parent;
		}
		// using dynamic access to avoid circular dependencies;
		if (o instanceof createjs["Stage"]) { return o; }
		return null;
	}

	/**
	 * Transforms the specified x and y position from the coordinate space of the display object
	 * to the global (stage) coordinate space. For example, this could be used to position an HTML label
	 * over a specific point on a nested display object. Returns a Point instance with x and y properties
	 * correlating to the transformed coordinates on the stage.
	 * @method localToGlobal
	 * @param {Number} x The x position in the source display object to transform.
	 * @param {Number} y The y position in the source display object to transform.
	 * @return {Point} A Point instance with x and y properties correlating to the transformed coordinates
	 * on the stage.
	 **/
	p.localToGlobal = function(x, y) {
		var mtx = this.getConcatenatedMatrix(this._matrix);
		if (mtx == null) { return null; }
		mtx.append(1, 0, 0, 1, x, y);
		return new createjs.Point(mtx.tx, mtx.ty);
	}

	/**
	 * Transforms the specified x and y position from the global (stage) coordinate space to the
	 * coordinate space of the display object. For example, this could be used to determine
	 * the current mouse position within the display object. Returns a Point instance with x and y properties
	 * correlating to the transformed position in the display object's coordinate space.
	 * @method globalToLocal
	 * @param {Number} x The x position on the stage to transform.
	 * @param {Number} y The y position on the stage to transform.
	 * @return {Point} A Point instance with x and y properties correlating to the transformed position in the
	 * display object's coordinate space.
	 **/
	p.globalToLocal = function(x, y) {
		var mtx = this.getConcatenatedMatrix(this._matrix);
		if (mtx == null) { return null; }
		mtx.invert();
		mtx.append(1, 0, 0, 1, x, y);
		return new createjs.Point(mtx.tx, mtx.ty);
	}

	/**
	 * Transforms the specified x and y position from the coordinate space of this display object to the
	 * coordinate space of the target display object. Returns a Point instance with x and y properties
	 * correlating to the transformed position in the target's coordinate space. Effectively the same as calling
	 * var pt = this.localToGlobal(x, y); pt = target.globalToLocal(pt.x, pt.y);
	 * @method localToLocal
	 * @param {Number} x The x position in the source display object to transform.
	 * @param {Number} y The y position on the stage to transform.
	 * @param {DisplayObject} target The target display object to which the coordinates will be transformed.
	 * @return {Point} Returns a Point instance with x and y properties correlating to the transformed position
	 * in the target's coordinate space.
	 **/
	p.localToLocal = function(x, y, target) {
		var pt = this.localToGlobal(x, y);
		return target.globalToLocal(pt.x, pt.y);
	}

	/**
	 * Shortcut method to quickly set the transform properties on the display object. All parameters are optional.
	 * Omitted parameters will have the default value set (ex. 0 for x/y, 1 for scaleX/Y).
	 * @method setTransform
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} scaleX
	 * @param {Number} scaleY
	 * @param {Number} rotation
	 * @param {Number} skewX
	 * @param {Number} skewY
	 * @param {Number} regX
	 * @param {Number} regY
	 * @return {DisplayObject} Returns this instance. Useful for chaining commands.
	*/
	p.setTransform = function(x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
		this.x = x || 0;
		this.y = y || 0;
		this.scaleX = scaleX == null ? 1 : scaleX;
		this.scaleY = scaleY == null ? 1 : scaleY;
		this.rotation = rotation || 0;
		this.skewX = skewX || 0;
		this.skewY = skewY || 0;
		this.regX = regX || 0;
		this.regY = regY || 0;
		return this;
	}
	
	/**
	 * Returns a matrix based on this object's transform.
	 * @method getMatrix
	 * @param {Matrix2D} matrix Optional. A Matrix2D object to populate with the calculated values. If null, a new
	 * Matrix object is returned.
	 * @return {Matrix2D} A matrix representing this display object's transform.
	 **/
	p.getMatrix = function(matrix) {
		var o = this;
		return (matrix ? matrix.identity() : new createjs.Matrix2D()).appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY).appendProperties(o.alpha, o.shadow, o.compositeOperation);
	}
	
	/**
	 * Generates a concatenated Matrix2D object representing the combined transform of
	 * the display object and all of its parent Containers up to the highest level ancestor
	 * (usually the stage). This can be used to transform positions between coordinate spaces,
	 * such as with localToGlobal and globalToLocal.
	 * @method getConcatenatedMatrix
	 * @param {Matrix2D} mtx Optional. A Matrix2D object to populate with the calculated values. If null, a new
	 * Matrix object is returned.
	 * @return {Matrix2D} a concatenated Matrix2D object representing the combined transform of
	 * the display object and all of its parent Containers up to the highest level ancestor (usually the stage).
	 **/
	p.getConcatenatedMatrix = function(matrix) {
		if (matrix) { matrix.identity(); }
		else { matrix = new createjs.Matrix2D(); }
		var o = this;
		while (o != null) {
			matrix.prependTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY).prependProperties(o.alpha, o.shadow, o.compositeOperation);
			o = o.parent;
		}
		return matrix;
	}

	/**
	 * Tests whether the display object intersects the specified local point (ie. draws a pixel with alpha > 0 at
	 * the specified position). This ignores the alpha, shadow and compositeOperation of the display object, and all
	 * transform properties including regX/Y.
	 * @method hitTest
	 * @param {Number} x The x position to check in the display object's local coordinates.
	 * @param {Number} y The y position to check in the display object's local coordinates.
	 * @return {Boolean} A Boolean indicting whether a visible portion of the DisplayObject intersect the specified
	 * local Point.
	*/
	p.hitTest = function(x, y) {
		var ctx = DisplayObject._hitTestContext;
		var canvas = DisplayObject._hitTestCanvas;

		ctx.setTransform(1,  0, 0, 1, -x, -y);
		this.draw(ctx);

		var hit = this._testHit(ctx);

		canvas.width = 0;
		canvas.width = 1;
		return hit;
	}

	/**
	 * Returns a clone of this DisplayObject. Some properties that are specific to this instance's current context are
	 * reverted to their defaults (for example .parent).
	 * @method clone
	 * @return {DisplayObject} A clone of the current DisplayObject instance.
	 **/
	p.clone = function() {
		var o = new DisplayObject();
		this.cloneProps(o);
		return o;
	}

	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 **/
	p.toString = function() {
		return "[DisplayObject (name="+  this.name +")]";
	}

// private methods:

	// separated so it can be used more easily in subclasses:
	/**
	 * @method cloneProps
	 * @protected
	 * @param {DisplayObject} o The DisplayObject instance which will have properties from the current DisplayObject
	 * instance copied into.
	 **/
	p.cloneProps = function(o) {
		o.alpha = this.alpha;
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
		o.mouseEnabled = this.mouseEnabled;
		o.compositeOperation = this.compositeOperation;
		if (this.cacheCanvas) {
			o.cacheCanvas = this.cacheCanvas.cloneNode(true);
			o.cacheCanvas.getContext("2d").putImageData(this.cacheCanvas.getContext("2d").getImageData(0,0,this.cacheCanvas.width,this.cacheCanvas.height),0,0);
		}
	}

	/**
	 * @method _applyShadow
	 * @protected
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {Shadow} shadow
	 **/
	p._applyShadow = function(ctx, shadow) {
		shadow = shadow || Shadow.identity;
		ctx.shadowColor = shadow.color;
		ctx.shadowOffsetX = shadow.offsetX;
		ctx.shadowOffsetY = shadow.offsetY;
		ctx.shadowBlur = shadow.blur;
	}
	
	
	/**
	 * @method _tick
	 * @protected
	 **/
	p._tick = function(params) {
		if (!this.onTick) { return; }
		if (params) { this.onTick.apply(this, params); }
		else { this.onTick(); }
	}

	/**
	 * @method _testHit
	 * @protected
	 * @param {CanvasRenderingContext2D} ctx
	 * @return {Boolean}
	 **/
	p._testHit = function(ctx) {
		try {
			var hit = ctx.getImageData(0, 0, 1, 1).data[3] > 1;
		} catch (e) {
			if (!DisplayObject.suppressCrossDomainErrors) {
				throw "An error has occurred. This is most likely due to security restrictions on reading canvas pixel data with local or cross-domain images.";
			}
		}
		return hit;
	}

	/**
	 * @method _applyFilters
	 * @protected
	 **/
	p._applyFilters = function() {
		if (!this.filters || this.filters.length == 0 || !this.cacheCanvas) { return; }
		var l = this.filters.length;
		var ctx = this.cacheCanvas.getContext("2d");
		var w = this.cacheCanvas.width;
		var h = this.cacheCanvas.height;
		for (var i=0; i<l; i++) {
			this.filters[i].applyFilter(ctx, 0, 0, w, h);
		}
	}
	 

createjs.DisplayObject = DisplayObject;
}());