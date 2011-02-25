/*
* DisplayObject by Grant Skinner. Dec 5, 2010
* Visit http://easeljs.com/ for documentation, updates and examples.
*
*
* Copyright (c) 2010 Grant Skinner
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

goog.require('Matrix2D');
goog.require('Point');
goog.require('UID');
goog.require('MouseEventPlus');

goog.provide('DisplayObject');
goog.provide('Container');
goog.provide('Stage');

/**
 * The Easel Javascript library provides a retained graphics mode for canvas
 * including a full, hierarchical display list, a core interaction model, and
 * helper classes to make working with Canvas much easier.
 **/

/**
 * DisplayObject is an abstract class that should not be constructed directly. Instead construct subclasses such as
 * Sprite, Bitmap, and Shape. DisplayObject is the base class for all display classes in the CanvasDisplay library.
 * It defines the core properties and methods that are shared between all display objects.
 * @constructor
 **/
DisplayObject = function() {
  this.initialize();
};

/**
 * Suppresses errors generated when using features like hitTest, onPress/onClick, and getObjectsUnderPoint with cross
 * domain content
 * @property suppressCrossDomainErrors
 * @static
 * @type {boolean}
 * @default false
 **/
DisplayObject.suppressCrossDomainErrors = false;

/**
 * @property _hitTestCanvas
 * @type HTMLCanvasElement
 * @static
 * @protected
 **/
DisplayObject._hitTestCanvas = document.createElement('canvas');
DisplayObject._hitTestCanvas.width = DisplayObject._hitTestCanvas.height = 1;

/**
 * @property _hitTestContext
 * @type CanvasRenderingContext2D
 * @static
 * @protected
 **/
DisplayObject._hitTestContext = DisplayObject._hitTestCanvas.getContext('2d');

/**
 * @property _workingMatrix
 * @type Matrix2D
 * @static
 * @protected
 **/
DisplayObject._workingMatrix = new Matrix2D();

/**
 * The alpha (transparency) for this display object. 0 is fully transparent, 1 is fully opaque.
 * @property alpha
 * @type {number}
 * @default 1
 **/
DisplayObject.prototype.alpha = 1;

/**
 * If a cache is active, this returns the canvas that holds the cached version of this display object. See cache()
 * for more information. READ-ONLY.
 * @property cacheCanvas
 * @type HTMLCanvasElement
 * @default null
 **/
DisplayObject.prototype.cacheCanvas = null;

/**
 * Unique ID for this display object. Makes display objects easier for some uses.
 * @property id
 * @type {number}
 * @default -1
 **/
DisplayObject.prototype.id = -1;

/**
 * Indicates whether to include this object when running Stage.getObjectsUnderPoint(). Setting this to true for
 * Sprites will cause the Sprite to be returned (not its children) regardless of whether it's mouseChildren property
 * is true.
 * @property mouseEnabled
 * @type {boolean}
 * @default true
 **/
DisplayObject.prototype.mouseEnabled = true;

/**
 * An optional name for this display object. Included in toString(). Useful for debugging.
 * @property name
 * @type {string}
 * @default null
 **/
DisplayObject.prototype.name = null;

/**
 * A reference to the Sprite or Stage object that contains this display object, or null if it has not been added to
 * one. READ-ONLY.
 * @property parent
 * @final
 * @type DisplayObject
 * @default null
 **/
DisplayObject.prototype.parent = null;

/**
 * The x offset for this display object's registration point. For example, to make a 100x100px Bitmap rotate around
 * it's center, you would set regX and regY to 50.
 * @property regX
 * @type {number}
 * @default 0
 **/
DisplayObject.prototype.regX = 0;

/**
 * The y offset for this display object's registration point. For example, to make a 100x100px Bitmap rotate around
 * it's center, you would set regX and regY to 50.
 * @property regY
 * @type {number}
 * @default 0
 **/
DisplayObject.prototype.regY = 0;

/**
 * The rotation in degrees for this display object.
 * @property rotation
 * @type {number}
 * @default 0
 **/
DisplayObject.prototype.rotation = 0;

/**
 * The factor to stretch this display object horizontally. For example, setting scaleX to 2 will stretch the display
 * object to twice it's nominal width.
 * @property scaleX
 * @type {number}
 * @default 1
 **/
DisplayObject.prototype.scaleX = 1;

/**
 * The factor to stretch this display object vertically. For example, setting scaleY to 0.5 will stretch the display
 * object to half it's nominal height.
 * @property scaleY
 * @type {number}
 * @default 1
 **/
DisplayObject.prototype.scaleY = 1;

/**
 * The factor to skew this display object horizontally.
 * @property skewX
 * @type {number}
 * @default 0
 **/
DisplayObject.prototype.skewX = 0;

/**
 * The factor to skew this display object vertically.
 * @property skewY
 * @type {number}
 * @default 0
 **/
DisplayObject.prototype.skewY = 0;

/**
 * A shadow object that defines the shadow to render on this display object. Set to null to remove a shadow. If
 * null, this property is inherited from the parent container.
 * @property shadow
 * @type Shadow
 * @default null
 **/
DisplayObject.prototype.shadow = null;

/**
 * Indicates whether this display object should be rendered to the canvas and included when running
 * Stage.getObjectsUnderPoint().
 * @property visible
 * @type {boolean}
 * @default true
 **/
DisplayObject.prototype.visible = true;

/**
 * The x (horizontal) position of the display object, relative to its parent.
 * @property x
 * @type {number}
 * @default 0
 **/
DisplayObject.prototype.x = 0;

/** The y (vertical) position of the display object, relative to its parent.
 * @property y
 * @type {number}
 * @default 0
 **/
DisplayObject.prototype.y = 0;

/**
 * The composite operation indicates how the pixels of this display object will be composited with the elements
 * behind it. If null, this property is inherited from the parent container. For more information, read the
 * <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#compositing">
 * whatwg spec on compositing</a>.
 * @property compositeOperation
 * @type {?string}
 * @default null
 **/
DisplayObject.prototype.compositeOperation = null;

/**
 * Indicates whether the display object should have it's x & y position rounded prior to drawing it to stage.
 * This only applies if the enclosing stage has snapPixelsEnabled set to true, and the display object's composite
 * transform does not include any scaling, rotation, or skewing. The snapToPixel property is true by default for
 * Bitmap and BitmapSequence instances, and false for all other display objects.
 * @property snapToPixel
 * @type {boolean}
 * @default false
 **/
DisplayObject.prototype.snapToPixel = false;

/**
 * The onPress callback is called when the user presses down on their mouse over this display object. The handler
 * is passed a single param containing the corresponding MouseEventPlus instance. You can subscribe to the onMouseMove
 * and onMouseUp callbacks of the event object to receive these events until the user releases the mouse button.
 * If an onPress handler is set on a container, it will receive the event if any of its children are clicked.
 * @event onPress
 * @param {MouseEventPlus} event MouseEventPlus with information about the event.
 **/
DisplayObject.prototype.onPress = null;

/**
 * The onClick callback is called when the user presses down on and then releases the mouse button over this
 * display object. The handler is passed a single param containing the corresponding MouseEventPlus instance. If an
 * onClick handler is set on a container, it will receive the event if any of its children are clicked.
 * @event onClick
 * @param {MouseEventPlus} event MouseEventPlus with information about the event.
 **/
DisplayObject.prototype.onClick = null;

/**
 * The onMouseOver callback is called when the user rolls over the display object. You must enable this event using
 * stage.enableMouseOver(). The handler is passed a single param containing the corresponding MouseEventPlus instance.
 * @event onMouseOver
 * @param {MouseEventPlus} event MouseEventPlus with information about the event.
 **/
DisplayObject.prototype.onMouseOver = null;

/**
 * The onMouseOut callback is called when the user rolls off of the display object. You must enable this event using
 * stage.enableMouseOver(). The handler is passed a single param containing the corresponding MouseEventPlus instance.
 * @event onMouseOut
 * @param {MouseEventPlus} event MouseEventPlus with information about the event.
 **/
DisplayObject.prototype.onMouseOut = null;

// private properties:
/**
 * @property _cacheOffsetX
 * @protected
 * @type {number}
 * @default 0
 **/
DisplayObject.prototype._cacheOffsetX = 0;

/**
 * @property _cacheOffsetY
 * @protected
 * @type {number}
 * @default 0
 **/
DisplayObject.prototype._cacheOffsetY = 0;

/**
 * @property _cacheDraw
 * @protected
 * @type {boolean}
 * @default false
 **/
DisplayObject.prototype._cacheDraw = false;

/**
 * @property _activeContext
 * @protected
 * @type CanvasRenderingContext2D
 * @default null
 **/
DisplayObject.prototype._activeContext = null;

/**
 * @property _restoreContext
 * @protected
 * @type {boolean}
 * @default false
 **/
DisplayObject.prototype._restoreContext = false;

/**
 * @property _revertShadow
 * @protected
 * @type {boolean}
 * @default false
 **/
DisplayObject.prototype._revertShadow = false;

/**
 * @property _revertX
 * @protected
 * @type {number}
 * @default 0
 **/
DisplayObject.prototype._revertX = 0;

/**
 * @property _revertY
 * @protected
 * @type {number}
 * @default 0
 **/
DisplayObject.prototype._revertY = 0;

/**
 * @property _revertAlpha
 * @protected
 * @type {number}
 * @default 1
 **/
DisplayObject.prototype._revertAlpha = 1;

// constructor:
// separated so it can be easily addressed in subclasses:
/**
 * Initialization method.
 * @protected
 */
DisplayObject.prototype.initialize = function() {
  this.id = UID.get();
  this.children = [];
};

// public methods:
/**
 * Returns true or false indicating whether the display object would be visible if drawn to a canvas.
 * This does not account for whether it would be visible within the boundaries of the stage.
 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
 * @return {boolean} Boolean indicating whether the display object would be visible if drawn to a canvas.
 **/
DisplayObject.prototype.isVisible = function() {
  return this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0;
};

/**
 * Draws the display object into the specified context ignoring it's visible, alpha, shadow, and transform.
 * Returns true if the draw was handled (useful for overriding functionality).
 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
 * @param {CanvasRenderingContext2D} ctx The canvas 2D context object to draw into.
 * @param {boolean=} ignoreCache Indicates whether the draw operation should ignore any current cache.
 * For example, used for drawing the cache (to prevent it from simply drawing an existing cache back
 * into itself).
 **/
DisplayObject.prototype.draw = function(ctx, ignoreCache) {
  if (ignoreCache || !this.cacheCanvas) {
    return false;
  }
  ctx.translate(this._cacheOffsetX, this._cacheOffsetY);
  ctx.drawImage(this.cacheCanvas, 0, 0);
  ctx.translate(-this._cacheOffsetX, -this._cacheOffsetY);
  return true;
};

/**
 * Draws the display object into a new canvas, which is then used for subsequent draws. For complex content
 * that does not change frequently (ex. a Sprite with many children that do not move, or a complex vector Shape),
 * this can provide for much faster rendering because the content does not need to be re-rendered each tick. The
 * cached display object can be moved, rotated, faded, etc freely, however if it's content changes, you must manually
 * update the cache by calling updateCache() or cache() again. You must specify the cache area via the x, y, w,
 * and h parameters. This defines the rectangle that will be rendered and cached using this display object's
 * coordinates. For example if you defined a Shape that drew a circle at 0, 0 with a radius of 25, you could call
 * myShape.cache(-25, -25, 50, 50) to cache the full shape.
 * @param {number} x The x coordinate origin for the cache region.
 * @param {number} y The y coordinate origin for the cache region.
 * @param {number} width The width of the cache region.
 * @param {number} height The height of the cache region.
 **/
DisplayObject.prototype.cache = function(x, y, width, height) {
  // draw to canvas.
  var ctx;
  if (this.cacheCanvas == null) {
    this.cacheCanvas = document.createElement('canvas');
  }
  ctx = this.cacheCanvas.getContext('2d');
  this.cacheCanvas.width = width;
  this.cacheCanvas.height = height;
  ctx.setTransform(1, 0, 0, 1, -x, -y);
  ctx.clearRect(0, 0, width + 1, height + 1); // because some browsers don't correctly clear if the width/height
  //remain the same.
  this.draw(ctx, true);
  this._cacheOffsetX = x;
  this._cacheOffsetY = y;
};

/**
 * Redraws the display object to its cache. Calling updateCache without an active cache will throw an error.
 * If compositeOperation is null the current cache will be cleared prior to drawing. Otherwise the display object
 * will be drawn over the existing cache using the specified compositeOperation.
 * @param {string} compositeOperation The compositeOperation to use, or null to clear the cache and redraw it.
 * <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#compositing">
 * whatwg spec on compositing</a>.
 **/
DisplayObject.prototype.updateCache = function(compositeOperation) {
  if (this.cacheCanvas == null) {
    throw 'cache() must be called before updateCache()';
  }
  var ctx = this.cacheCanvas.getContext('2d');
  ctx.setTransform(1, 0, 0, 1, -this._cacheOffsetX, -this._cacheOffsetY);
  if (!compositeOperation) {
    ctx.clearRect(0, 0, this.cacheCanvas.width + 1, this.cacheCanvas.height + 1);
  } else {
    ctx.globalCompositeOperation = compositeOperation;
  }
  this.draw(ctx, true);
  if (compositeOperation) {
    ctx.globalCompositeOperation = 'source-over';
  }
};

/**
 * Clears the current cache. See cache() for more information.
 **/
DisplayObject.prototype.uncache = function() {
  this.cacheCanvas = null;
  this.cacheOffsetX = this.cacheOffsetY = 0;
};

/**
 * Returns the stage that this display object will be rendered on, or null if it has not been added to one.
 * @return {Stage} The Stage instance that the display object is a descendent of. null if the DisplayObject has not
 * been added to a Stage.
 **/
DisplayObject.prototype.getStage = function() {
  var o = this;
  while (o.parent) {
    o = o.parent;
  }
  if (o instanceof Stage) {
    return o;
  }
  return null;
};

/**
 * Transforms the specified x and y position from the coordinate space of the display object
 * to the global (stage) coordinate space. For example, this could be used to position an HTML label
 * over a specific point on a nested display object. Returns a Point instance with x and y properties
 * correlating to the transformed coordinates on the stage.
 * @param {number} x The x position in the source display object to transform.
 * @param {number} y The y position in the source display object to transform.
 * @return {Point} A Point instance with x and y properties correlating to the transformed coordinates
 * on the stage.
 **/
DisplayObject.prototype.localToGlobal = function(x, y) {
  var mtx = this.getConcatenatedMatrix();
  if (mtx == null) {
    return null;
  }
  mtx.append(1, 0, 0, 1, x, y);
  return new Point(mtx.tx, mtx.ty);
};

/**
 * Transforms the specified x and y position from the global (stage) coordinate space to the
 * coordinate space of the display object. For example, this could be used to determine
 * the current mouse position within the display object. Returns a Point instance with x and y properties
 * correlating to the transformed position in the display object's coordinate space.
 * @param {number} x The x position on the stage to transform.
 * @param {number} y The y position on the stage to transform.
 * @return {Point} A Point instance with x and y properties correlating to the transformed position in the
 * display object's coordinate space.
 **/
DisplayObject.prototype.globalToLocal = function(x, y) {
  var mtx = this.getConcatenatedMatrix();
  if (mtx == null) {
    return null;
  }
  mtx.invert();
  mtx.append(1, 0, 0, 1, x, y);
  return new Point(mtx.tx, mtx.ty);
};

/**
 * Transforms the specified x and y position from the coordinate space of this display object to the
 * coordinate space of the target display object. Returns a Point instance with x and y properties
 * correlating to the transformed position in the target's coordinate space. Effectively the same as calling
 * var pt = this.localToGlobal(x, y); pt = target.globalToLocal(pt.x, pt.y);
 * @param {number} x The x position in the source display object to transform.
 * @param {number} y The y position on the stage to transform.
 * @param {DisplayObject} target The target display object to which the coordinates will be transformed.
 * @return {Point} Returns a Point instance with x and y properties correlating to the transformed position
 * in the target's coordinate space.
 **/
DisplayObject.prototype.localToLocal = function(x, y, target) {
  var pt = this.localToGlobal(x, y);
  return target.globalToLocal(pt.x, pt.y);
};

/**
 * Generates a concatenated Matrix2D object representing the combined transform of
 * the display object and all of its parent Containers up to the highest level ancestor
 * (usually the stage). This can be used to transform positions between coordinate spaces,
 * such as with localToGlobal and globalToLocal.
 * @param {Matrix2D=} mtx Optional. A Matrix2D object to populate with the calculated values. If null, a new
 * Matrix object is returned.
 * @return {Matrix2D} a concatenated Matrix2D object representing the combined transform of
 * the display object and all of its parent Containers up to the highest level ancestor (usually the stage).
 **/
DisplayObject.prototype.getConcatenatedMatrix = function(mtx) {
  if (mtx) {
    mtx.identity();
  } else {
    mtx = new Matrix2D();
  }
  var target = this;
  while (target != null) {
    mtx.prependTransform(target.x, target.y, target.scaleX, target.scaleY, target.rotation, target.skewX, target.skewY, target.regX, target.regY);
    mtx.prependProperties(target.alpha, target.shadow, target.compositeOperation);
    target = target.parent;
  }
  return mtx;
};

/**
 * Tests whether the display object intersects the specified local point (ie. draws a pixel with alpha > 0 at
 * the specified position). This ignores the alpha, shadow and compositeOperation of the display object, and all
 * transform properties including regX/Y.
 * @param {number} x The x position to check in the display object's local coordinates.
 * @param {number} y The y position to check in the display object's local coordinates.
 * @return {boolean} A Boolean indicting whether a visible portion of the DisplayObject intersect the specified
 * local Point.
 */
DisplayObject.prototype.hitTest = function(x, y) {
  var ctx = DisplayObject._hitTestContext;
  var canvas = DisplayObject._hitTestCanvas;

  ctx.setTransform(1, 0, 0, 1, -x, -y);
  this.draw(ctx);

  var hit = this._testHit(ctx);

  canvas.width = 0;
  canvas.width = 1;
  return hit;
};

/**
 * Returns a clone of this DisplayObject. Some properties that are specific to this instance's current context are
 * reverted to their defaults (for example .parent).
 * @param {boolean=} opt_recursive
 @return {!DisplayObject} A clone of the current DisplayObject instance.
 **/
DisplayObject.prototype.clone = function(opt_recursive) {
  var o = new DisplayObject();
  this.cloneProps(o);
  return o;
};

/**
 * Returns a string representation of this object.
 * @return {string} a string representation of the instance.
 **/
DisplayObject.prototype.toString = function() {
  return '[DisplayObject (name=' + this.name + ')]';
};

// private methods:
// separated so it can be used more easily in subclasses:
/**
 * @protected
 * @param {DisplayObject} o The DisplayObject instance which will have properties from the current DisplayObject
 * instance copied into.
 **/
DisplayObject.prototype.cloneProps = function(o) {
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
  o.x = this.x;
  o.y = this.y;
  o.mouseEnabled = this.mouseEnabled;
  o.compositeOperation = this.compositeOperation;
};

/**
 * @protected
 * @param {CanvasRenderingContext2D} ctx
 * @param {Shadow} shadow
 **/
DisplayObject.prototype.applyShadow = function(ctx, shadow) {
  ctx.shadowColor = shadow.color;
  ctx.shadowOffsetX = shadow.offsetX;
  ctx.shadowOffsetY = shadow.offsetY;
  ctx.shadowBlur = shadow.blur;
};

/**
 * @protected
 * @param {CanvasRenderingContext2D} ctx
 * @return {boolean}
 **/
DisplayObject.prototype._testHit = function(ctx) {
  try {
    var hit = ctx.getImageData(0, 0, 1, 1).data[3] > 1;
  } catch(e) {
    if (!DisplayObject.suppressCrossDomainErrors) {
      throw 'An error has occured. This is most likely due to security restrictions on reading canvas pixel ' + 'data with local or cross-domain images.';
    }
  }
  return hit;
};

/**
 * A Container is a nestable display lists that allows you to work with compound display elements. For
 * example you could group arm, leg, torso and head Bitmaps together into a Person Container, and
 * transform them as a group, while still being able to move the individual parts relative to each
 * other. Children of containers have their transform and alpha properties concatenated with their
 * parent Container. For example, a Shape with x=100 and alpha=0.5, placed in a Container with
 * x=50 and alpha=0.7 will be rendered to the canvas at x=150 and alpha=0.35. Containers have some
 * overhead, so you generally shouldn't create a Container to hold a single child.
 * @class Container
 * @extends {DisplayObject}
 * @constructor
 **/
Container = function() {
  this.initialize();
};
goog.inherits(Container, DisplayObject);

// public properties:
/**
 * The array of children in the display list. You should usually use the child management methods,
 * rather than accessing this directly, but it is included for advanced users.
 * @property children
 * @type {Array.<DisplayObject>}
 * @default null
 **/
Container.prototype.children = null;

// constructor:
/**
 * @property DisplayObject_initialize
 * @type Function
 * @private
 **/
Container.prototype.DisplayObject_initialize = Container.prototype.initialize;

/**
 * Initialization method.
 * @protected
 */
Container.prototype.initialize = function() {
  this.DisplayObject_initialize();
  this.children = [];
};

// public methods:
/**
 * Returns true or false indicating whether the display object would be visible if drawn to a canvas.
 * This does not account for whether it would be visible within the boundaries of the stage.
 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
 * @return {boolean} Boolean indicating whether the display object would be visible if drawn to a canvas.
 **/
Container.prototype.isVisible = function() {
  return this.visible && this.alpha > 0 && this.children.length && this.scaleX != 0 && this.scaleY != 0;
};

/**
 * @property DisplayObject_draw
 * @type Function
 * @private
 **/
Container.prototype.DisplayObject_draw = Container.prototype.draw;

/**
 * Draws the display object into the specified context ignoring it's visible, alpha, shadow, and transform.
 * Returns true if the draw was handled (useful for overriding functionality).
 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
 * @param {CanvasRenderingContext2D} ctx The canvas 2D context object to draw into.
 * @param {boolean} ignoreCache Indicates whether the draw operation should ignore any current cache.
 * For example, used for drawing the cache (to prevent it from simply drawing an existing cache back
 * into itself).
 **/
Container.prototype.draw = function(ctx, ignoreCache, _mtx) {
  var snap = Stage._snapToPixelEnabled;
  if (!_mtx) {
    _mtx = new Matrix2D();
    _mtx.appendProperties(this.alpha, this.shadow, this.compositeOperation);
  }
  if (this.DisplayObject_draw(ctx, ignoreCache)) {
    return true;
  }
  var l = this.children.length;
  // this ensures we don't have issues with display list changes that occur during a draw:
  var list = this.children.slice(0);
  for (var i = 0; i < l; i++) {
    var child = list[i];
    if (child.tick) {
      child.tick();
    }
    if (!child.isVisible()) {
      continue;
    }

    var mtx = _mtx.clone();
    mtx.appendTransform(child.x, child.y, child.scaleX, child.scaleY, child.rotation, child.skewX, child.skewY, child.regX, child.regY);
    mtx.appendProperties(child.alpha, child.shadow, child.compositeOperation);

    if (! (child instanceof Container)) {
      if (snap && child.snapToPixel && mtx.a == 1 && mtx.b == 0 && mtx.c == 0 && mtx.d == 1) {
        ctx.setTransform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx + 0.5 | 0, mtx.ty + 0.5 | 0);
      } else {
        ctx.setTransform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
      }
      ctx.globalAlpha = mtx.alpha;
      ctx.globalCompositeOperation = mtx.compositeOperation || 'source-over';
      if (mtx.shadow) {
        this.applyShadow(ctx, mtx.shadow);
      }
    }
    child.draw(ctx, false, mtx);
  }
  return true;
};

/**
 * Adds a child to the top of the display list. You can also add multiple children, such as "addChild(child1, child2, ...);".
 * Returns the child that was added, or the last child if multiple children were added.
 * @param {DisplayObject} child The display object to add.
 * @return {DisplayObject} The child that was added, or the last child if multiple children were added.
 **/
Container.prototype.addChild = function(child) {
  var l = arguments.length;
  if (l > 1) {
    for (var i = 0; i < l; i++) {
      this.addChild(arguments[i]);
    }
    return arguments[l - 1];
  }
  if (child.parent) {
    child.parent.removeChild(child);
  }
  child.parent = this;
  this.children.push(child);
  return child;
};

/**
 * Adds a child to the display list at the specified index, bumping children at equal or greater indexes up one, and setting
 * its parent to this Container. You can also add multiple children, such as "addChildAt(child1, child2, ..., index);". The
 * index must be between 0 and numChildren. For example, to add myShape under otherShape in the display list, you could use:
 * container.addChildAt(myShape, container.getChildIndex(otherShape)). This would also bump otherShape's index up by one.
 * Returns the last child that was added, or the last child if multiple children were added.
 * @param {DisplayObject} child The display object to add.
 * @param {number} index The index to add the child at.
 * @return {DisplayObject} The child that was added, or the last child if multiple children were added.
 **/
Container.prototype.addChildAt = function(child, index) {
  var l = arguments.length;
  if (l > 2) {
    index = arguments[i - 1];
    for (var i = 0; i < l - 1; i++) {
      this.addChildAt(arguments[i], index + i);
    }
    return arguments[l - 2];
  }
  if (child.parent) {
    child.parent.removeChild(child);
  }
  child.parent = this;
  this.children.splice(index, 0, child);
  return child;
};

/**
 * Removes the specified child from the display list. Note that it is faster to use removeChildAt() if the index is already
 * known. You can also remove multiple children, such as "removeChild(child1, child2, ...);". Returns true if the child
 * (or children) was removed, or false if it was not in the display list.
 * @param {DisplayObject} child The child to remove.
 * @return {boolean} true if the child (or children) was removed, or false if it was not in the display list.
 **/
Container.prototype.removeChild = function(child) {
  var l = arguments.length;
  if (l > 1) {
    var good = true;
    for (var i = 0; i < l; i++) {
      good = good && this.removeChild(arguments[i]);
    }
    return good;
  }
  return this.removeChildAt(this.children.indexOf(child));
};

/**
 * Removes the child at the specified index from the display list, and sets its parent to null. You can also remove multiple
 * children, such as "removeChildAt(2, 7, ...);". Returns true if the child (or children) was removed, or false if any index
 * was out of range.
 * @param {number} index The index of the child to remove.
 * @return true if the child (or children) was removed, or false if any index was out of range.
 **/
Container.prototype.removeChildAt = function(index) {
  var l = arguments.length;
  if (l > 1) {
    var a = [];
    var i;
    for (i = 0; i < l; i++) {
      a[i] = arguments[i];
    }
    a.sort(function(a, b) {
      return b - a;
    });
    var good = true;
    for (i = 0; i < l; i++) {
      good = good && this.removeChildAt(a[i]);
    }
    return good;
  }
  if (index < 0 || index > this.children.length - 1) {
    return false;
  }
  var child = this.children[index];
  if (child != null) {
    child.parent = null;
  }
  this.children.splice(index, 1);
  return true;
};

/**
 * Removes all children from the display list.
 **/
Container.prototype.removeAllChildren = function() {
  while (this.children.length) {
    this.removeChildAt(0);
  }
};

/**
 * Returns the child at the specified index.
 * @param {number} index The index of the child to return.
 * @return {DisplayObject} The child at the specified index.
 **/
Container.prototype.getChildAt = function(index) {
  return this.children[index];
};

/**
 * Performs an array sort operation on the child list.
 * @param {Function} sortFunction the function to use to sort the child list. See javascript's Array.sort documentation
 * for details.
 **/
Container.prototype.sortChildren = function(sortFunction) {
  this.children.sort(sortFunction);
};

/**
 * Returns the index of the specified child in the display list, or -1 if it is not in the display list.
 * @param {DisplayObject} child The child to return the index of.
 * @return {number} The index of the specified child. -1 if the child is not found.
 **/
Container.prototype.getChildIndex = function(child) {
  return this.children.indexOf(child);
};

/**
 * Returns the number of children in the display list.
 * @return {number} The number of children in the display list.
 **/
Container.prototype.getNumChildren = function() {
  return this.children.length;
};

/**
 * Returns true if the specified display object either is this container or is a descendent.
 * (child, grandchild, etc) of this container.
 * @param {DisplayObject} child The DisplayObject to be checked.
 * @return {boolean} true if the specified display object either is this container or is a descendent.
 **/
Container.prototype.contains = function(child) {
  while (child) {
    if (child == this) {
      return true;
    }
    child = child.parent;
  }
  return false;
};

/**
 * Tests whether the display object intersects the specified local point (ie. draws a pixel with alpha > 0 at the specified
 * position). This ignores the alpha, shadow and compositeOperation of the display object, and all transform properties
 * including regX/Y.
 * @param x The x position to check in the display object's local coordinates.
 * @param y The y position to check in the display object's local coordinates.
 * @return {boolean} A Boolean indicating whether there is a visible section of a DisplayObject that overlaps the specified
 * coordinates.
 **/
Container.prototype.hitTest = function(x, y) {
  // TODO: optimize to use the fast cache check where possible.
  return (this.getObjectUnderPoint(x, y) != null);
};

/**
 * Returns an array of all display objects under the specified coordinates that are in this container's display list.
 * This routine ignores any display objects with mouseEnabled set to false. The array will be sorted in order of visual
 * depth, with the top-most display object at index 0. This uses shape based hit detection, and can be an expensive operation
 * to run, so it is best to use it carefully. For example, if testing for objects under the mouse, test on tick (instead of on
 * mousemove), and only if the mouse's position has changed.
 * @param {number} x The x position in the container to test.
 * @param {number} y The y position in the container to test.
 * @return {Array.<DisplayObject>} An Array of DisplayObjects under the specified coordinates.
 **/
Container.prototype.getObjectsUnderPoint = function(x, y) {
  var arr = [];
  var pt = this.localToGlobal(x, y);
  this._getObjectsUnderPoint(pt.x, pt.y, arr);
  return arr;
};

/**
 * Similar to getObjectsUnderPoint(), but returns only the top-most display object. This runs significantly faster than
 * getObjectsUnderPoint(), but is still an expensive operation. See getObjectsUnderPoint() for more information.
 * @param {number} x The x position in the container to test.
 * @param {number} y The y position in the container to test.
 * @return {DisplayObject} The top-most display object under the specified coordinates.
 **/
Container.prototype.getObjectUnderPoint = function(x, y) {
  var pt = this.localToGlobal(x, y);
  return this._getObjectsUnderPoint(pt.x, pt.y);
};

/**
 * Returns a clone of this Container. Some properties that are specific to this instance's current context are reverted to
 * their defaults (for example .parent).
 * @param {boolean} recursive If true, all of the descendants of this container will be cloned recursively. If false, the
 * properties of the container will be cloned, but the new instance will not have any children.
 * @return {Container} A clone of the current Container instance.
 **/
Container.prototype.clone = function(recursive) {
  var o = new Container();
  this.cloneProps(o);
  if (recursive) {
    var arr = o.children = [];
    for (var i = 0, l = this.children.length; i < l; i++) {
      arr.push(this.children[i].clone(recursive));
    }
  }
  return o;
};

/**
 * Returns a string representation of this object.
 * @return {string} a string representation of the instance.
 **/
Container.prototype.toString = function() {
  return '[Container (name=' + this.name + ')]';
};

// private properties:
/**
 * @param {number} x
 * @param {number} y
 * @param {Array=} arr
 * @param {number=} mouseEvents A bitmask indicating which mouseEvent types to look for. Bit 1 specifies onPress &
 * onClick, bit 2 specifies it should look for onMouseOver and onMouseOut. This implementation may change.
 * @return {Array.<DisplayObject>}
 * @protected
 **/
Container.prototype._getObjectsUnderPoint = function(x, y, arr, mouseEvents) {
  var ctx = DisplayObject._hitTestContext;
  var canvas = DisplayObject._hitTestCanvas;
  var mtx = DisplayObject._workingMatrix;
  var hasHandler = (mouseEvents & 1 && (this.onPress || this.onClick)) || (mouseEvents & 2 && (this.onMouseOver || this.onMouseOut));

  // if we have a cache handy, we can use it to do a quick check:
  if (this.cacheCanvas) {
    this.getConcatenatedMatrix(mtx);
    ctx.setTransform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx - x, mtx.ty - y);
    ctx.globalAlpha = mtx.alpha;
    this.draw(ctx);
    if (this._testHit(ctx)) {
      canvas.width = 0;
      canvas.width = 1;
      if (hasHandler) {
        return this;
      }
    } else {
      return null;
    }
  }

  // draw children one at a time, and check if we get a hit:
  var l = this.children.length;
  for (var i = l - 1; i >= 0; i--) {
    var child = this.children[i];
    if (!child.isVisible() || !child.mouseEnabled) {
      continue;
    }

    if (child instanceof Container) {
      var result;
      if (hasHandler) {
        // only concerned about the first hit, because this container is going to claim it anyway:
        result = child._getObjectsUnderPoint(x, y);
        if (result) {
          return this;
        }
      } else {
        result = child._getObjectsUnderPoint(x, y, arr, mouseEvents);
        if (!arr && result) {
          return result;
        }
      }
    } else if (!mouseEvents || hasHandler || (mouseEvents & 1 && (child.onPress || child.onClick)) || (mouseEvents & 2 && (child.onMouseOver || child.onMouseOut))) {
      child.getConcatenatedMatrix(mtx);
      ctx.setTransform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx - x, mtx.ty - y);
      ctx.globalAlpha = mtx.alpha;
      child.draw(ctx);
      if (!this._testHit(ctx)) {
        continue;
      }
      canvas.width = 0;
      canvas.width = 1;
      if (hasHandler) {
        return this;
      } else if (arr) {
        arr.push(child);
      } else {
        return child;
      }
    }
  }
  return null;
};

/**
 * A stage is the root level Container for a display list. Each time its tick method is called, it will render its display
 * list to its target canvas.
 * @class Stage
 * @extends {Container}
 * @constructor
 * @param {HTMLCanvasElement} canvas The canvas the stage will render to.
 **/
Stage = function(canvas) {
  this.initialize(canvas);
};
goog.inherits(Stage, Container);

// static properties:
/**
 * @property _snapToPixelEnabled
 * @protected
 * @type {boolean}
 * @default false
 **/
Stage._snapToPixelEnabled = false; // snapToPixelEnabled is temporarily copied here during a draw to provide global access.
// public properties:
/** 
 * Indicates whether the stage should automatically clear the canvas before each render. You can set this to false to manually
 * control clearing (for generative art, or when pointing multiple stages at the same canvas for example).
 * @property autoClear
 * @type {boolean}
 * @default true
 **/
Stage.prototype.autoClear = true;

/** The canvas the stage will render to. Multiple stages can share a single canvas, but you must disable autoClear for all but the
 * first stage that will be ticked (or they will clear each other's render).
 * @property canvas
 * @type {HTMLCanvasElement}
 **/
Stage.prototype.canvas = null;

/**
 * READ-ONLY. The current mouse X position on the canvas. If the mouse leaves the canvas, this will indicate the most recent 
 * position over the canvas, and mouseInBounds will be set to false.
 * @property mouseX
 * @type {number}
 * @final
 **/
Stage.prototype.mouseX = NaN;

/** READ-ONLY. The current mouse Y position on the canvas. If the mouse leaves the canvas, this will indicate the most recent 
 * position over the canvas, and mouseInBounds will be set to false.
 * @property mouseY
 * @type {number}
 * @final
 **/
Stage.prototype.mouseY = NaN;

/** The onMouseMove callback is called when the user moves the mouse over the canvas.  The handler is passed a single param
 * containing the corresponding MouseEventPlus instance.
 * @event onMouseMove
 * @param {MouseEventPlus} event A MouseEventPlus instance with information about the current mouse event.
 **/
Stage.prototype.onMouseMove = null;

/**
 * The onMouseUp callback is called when the user releases the mouse button anywhere that the page can detect it.  The handler 
 * is passed a single param containing the corresponding MouseEventPlus instance.
 * @event onMouseUp
 * @param {MouseEventPlus} event A MouseEventPlus instance with information about the current mouse event.
 **/
Stage.prototype.onMouseUp = null;

/**
 * The onMouseDown callback is called when the user presses the mouse button over the canvas.  The handler is passed a single 
 * param containing the corresponding MouseEventPlus instance.
 * @event onMouseDown
 * @param {MouseEventPlus} event A MouseEventPlus instance with information about the current mouse event.
 **/
Stage.prototype.onMouseDown = null;

/**
 * Indicates whether this stage should use the snapToPixel property of display objects when rendering them.
 * @property snapToPixelEnabled
 * @type {boolean}
 * @default false
 **/
Stage.prototype.snapToPixelEnabled = false;

/** Indicates whether the mouse is currently within the bounds of the canvas.
 * @property mouseInBounds
 * @type {boolean}
 * @default false
 **/
Stage.prototype.mouseInBounds = false;

// private properties:
/**
 * @property _tmpCanvas
 * @protected
 * @type HTMLCanvasElement
 **/
Stage.prototype._tmpCanvas = null;

/**
 * @property _activeMouseEventPlus
 * @protected
 * @type MouseEventPlus
 **/
Stage.prototype._activeMouseEventPlus = null;

/**
 * @property _activeMouseTarget
 * @protected
 * @type DisplayObject
 **/
Stage.prototype._activeMouseTarget = null;

/**
 * @property _mouseOverIntervalID
 * @protected
 * @type {?number}
 **/
Stage.prototype._mouseOverIntervalID = null;

/**
 * @property _mouseOverX
 * @protected
 * @type {?number}
 **/
Stage.prototype._mouseOverX = 0;

/**
 * @property _mouseOverY
 * @protected
 * @type {?number}
 **/
Stage.prototype._mouseOverY = 0;

/**
 * @property _mouseOverTarget
 * @protected
 * @type DisplayObject
 **/
Stage.prototype._mouseOverTarget = null;

// constructor:
/**
 * @property DisplayObject_initialize
 * @type Function
 * @private
 **/
Stage.prototype.Container_initialize = Stage.prototype.initialize;

/** 
 * Initialization method.
 * param {HTMLCanvasElement} canvas
 * @protected
 **/
Stage.prototype.initialize = function(canvas) {
  this.Container_initialize();
  this.canvas = canvas;
  this.mouseChildren = true;

  var o = this;
  if (window.addEventListener) {
    window.addEventListener("mouseup", function(e) {
      o._handleMouseUp(e);
    },
    false);
    window.addEventListener("mousemove", function(e) {
      o._handleMouseMove(e);
    },
    false);
  } else if (document.addEventListener) {
    document.addEventListener("mouseup", function(e) {
      o._handleMouseUp(e);
    },
    false);
    document.addEventListener("mousemove", function(e) {
      o._handleMouseMove(e);
    },
    false);
  }
  canvas.addEventListener("mousedown", function(e) {
    o._handleMouseDown(e);
  },
  false);
};

// public methods:
/**
 * @event tick
 * Broadcast to children when the stage is updated.
 **/

/**
 * Each time the update method is called, the stage will tick any descendants exposing a tick method (ex. BitmapSequence) 
 * and render its entire display list to the canvas.
 **/
Stage.prototype.update = function() {
  if (!this.canvas) {
    return;
  }
  if (this.autoClear) {
    this.clear();
  }
  Stage._snapToPixelEnabled = this.snapToPixelEnabled;
  this.draw(this.canvas.getContext("2d"), false, this.getConcatenatedMatrix(DisplayObject._workingMatrix));
};

/**
 * Calls the update method. Useful for adding stage as a listener to Ticker directly.
 * @property tick
 * @private
 * @type Function
 **/
Stage.prototype.tick = Stage.prototype.update;

/**
 * Clears the target canvas. Useful if autoClear is set to false.
 **/
Stage.prototype.clear = function() {
  if (!this.canvas) {
    return;
  }
  var ctx = this.canvas.getContext("2d");
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

/**
 * Returns a data url that contains a Base64 encoded image of the contents of the stage. The returned data url can be 
 * specified as the src value of an image element.
 * @param {string} backgroundColor The background color to be used for the generated image. The value can be any value HTML color
 * value, including HEX colors, rgb and rgba. The default value is a transparent background.
 * @param {string} mimeType The MIME type of the image format to be create. The default is "image/png". If an unknown MIME type
 * is passed in, or if the browser does not support the specified MIME type, the default value will be used.
 * @return {string} a Base64 encoded image.
 **/
Stage.prototype.toDataURL = function(backgroundColor, mimeType) {
  if (!mimeType) {
    mimeType = "image/png";
  }

  var ctx = this.canvas.getContext('2d');
  var w = this.canvas.width;
  var h = this.canvas.height;

  var data;

  if (backgroundColor) {

    //get the current ImageData for the canvas.
    data = ctx.getImageData(0, 0, w, h);

    //store the current globalCompositeOperation
    var compositeOperation = ctx.globalCompositeOperation;

    //set to draw behind current content
    ctx.globalCompositeOperation = "destination-over";

    //set background color
    ctx.fillStyle = backgroundColor;

    //draw background on entire canvas
    ctx.fillRect(0, 0, w, h);
  }

  //get the image data from the canvas
  var dataURL = this.canvas.toDataURL(mimeType);

  if (backgroundColor) {
    //clear the canvas
    ctx.clearRect(0, 0, w, h);

    //restore it with original settings
    ctx.putImageData(data, 0, 0);

    //reset the globalCompositeOperation to what it was
    ctx.globalCompositeOperation = compositeOperation;
  }

  return dataURL;
};

/**
 * Enables or disables (by passing a frequency of 0) mouse over handlers (onMouseOver and onMouseOut) for this stage's display
 * list. These events can be expensive to generate, so they are disabled by default, and the frequency of the events
 * can be controlled independently of mouse move events via the frequency parameter.
 * @param {number} frequency The maximum number of times per second to broadcast mouse over/out events. Set to 0 to disable mouse
 * over events completely. Maximum is 50. A lower frequency is less responsive, but uses less CPU.
 **/
Stage.prototype.enableMouseOver = function(frequency) {
  if (this._mouseOverIntervalID) {
    clearInterval(this._mouseOverIntervalID);
    this._mouseOverIntervalID = null;
  }
  if (frequency <= 0) {
    return;
  }
  var o = this;
  this._mouseOverIntervalID = setInterval(function() {
    o._testMouseOver();
  },
  1000 / Math.min(50, frequency));
  this._mouseOverX = NaN;
  this._mouseOverTarget = null;
};

/**
 * Returns a clone of this Stage.
 * @return {Stage} A clone of the current Container instance.
 **/
Stage.prototype.clone = function() {
  var o = new Stage(null);
  this.cloneProps(o);
  return o;
};

/**
 * Returns a string representation of this object.
 * @return {string} a string representation of the instance.
 **/
Stage.prototype.toString = function() {
  return "[Stage (name=" + this.name + ")]";
};

// private methods:
/**
 * @protected
 * @param {MouseEventPlus} e
 **/
Stage.prototype._handleMouseMove = function(e) {
  if (!this.canvas) {
    this.mouseX = this.mouseY = NaN;
    return;
  }
  if (!e) {
    e = window.event;
  }

  var mouseX = e.pageX - this.canvas.offsetLeft;
  var mouseY = e.pageY - this.canvas.offsetTop;
  var inBounds = (mouseX >= 0 && mouseY >= 0 && mouseX < this.canvas.width && mouseY < this.canvas.height);
  if (!inBounds && !this.mouseInBounds) {
    return;
  }

  if (inBounds) {
    this.mouseX = mouseX;
    this.mouseY = mouseY;
  }
  this.mouseInBounds = inBounds;
  var evt = new MouseEventPlus("onMouseMove", this.mouseX, this.mouseY);
  if (this.onMouseMove) {
    this.onMouseMove(evt);
  }
  if (this._activeMouseEventPlus && this._activeMouseEventPlus.onMouseMove) {
    this._activeMouseEventPlus.onMouseMove(evt);
  }
};

/**
 * @protected
 * @param {MouseEventPlus} e
 **/
Stage.prototype._handleMouseUp = function(e) {
  var evt = new MouseEventPlus("onMouseUp", this.mouseX, this.mouseY);
  if (this.onMouseUp) {
    this.onMouseUp(evt);
  }
  if (this._activeMouseEventPlus && this._activeMouseEventPlus.onMouseUp) {
    this._activeMouseEventPlus.onMouseUp(evt);
  }
  if (this._activeMouseTarget && this._activeMouseTarget.onClick && this._getObjectsUnderPoint(this.mouseX, this.mouseY, null, true, (this._mouseOverIntervalID ? 3 : 1)) == this._activeMouseTarget) {
    this._activeMouseTarget.onClick(new MouseEventPlus("onClick", this.mouseX, this.mouseY));
  }
  this._activeMouseEventPlus = this.activeMouseTarget = null;
};

/**
 * @protected
 * @param {MouseEventPlus} e
 **/
Stage.prototype._handleMouseDown = function(e) {
  if (this.onMouseDown) {
    this.onMouseDown(new MouseEventPlus("onMouseDown", this.mouseX, this.mouseY));
  }
  var target = this._getObjectsUnderPoint(this.mouseX, this.mouseY, null, (this._mouseOverIntervalID ? 3 : 1));
  if (target) {
    if (target.onPress instanceof Function) {
      var evt = new MouseEventPlus("onPress", this.mouseX, this.mouseY);
      target.onPress(evt);
      if (evt.onMouseMove || evt.onMouseUp) {
        this._activeMouseEventPlus = evt;
      }
    }
    this._activeMouseTarget = target;
  }
};

/**
 * @protected
 **/
Stage.prototype._testMouseOver = function() {
  if (this.mouseX == this._mouseOverX && this.mouseY == this._mouseOverY && this.mouseInBounds) {
    return;
  }
  var target = null;
  if (this.mouseInBounds) {
    target = this._getObjectsUnderPoint(this.mouseX, this.mouseY, null, 3);
    this._mouseOverX = this.mouseX;
    this._mouseOverY = this.mouseY;
  }
  if (this._mouseOverTarget != target) {
    if (this._mouseOverTarget && this._mouseOverTarget.onMouseOut) {
      this._mouseOverTarget.onMouseOut(new MouseEventPlus("onMouseOver", this.mouseX, this.mouseY));
    }
    if (target && target.onMouseOver) {
      target.onMouseOver(new MouseEventPlus("onMouseOut", this.mouseX, this.mouseY));
    }
    this._mouseOverTarget = target;
  }
};
