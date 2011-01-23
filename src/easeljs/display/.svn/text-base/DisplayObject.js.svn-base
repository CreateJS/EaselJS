/**
* DisplayObject by Grant Skinner. Dec 5, 2010
* Visit www.gskinner.com/blog for documentation, updates and more free code.
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
**/

(function(window) {

/**
* DisplayObject is an abstract class that should not be constructed directly. Instead construct subclasses such as Sprite, Bitmap, and Shape.
* @class DisplayObject is the base class for all display classes in the CanvasDisplay library. It defines the core properties and methods that are shared between all display objects. It should not be instantiated directly.
**/
function DisplayObject() {
  this.init();
}
var p = DisplayObject.prototype;

// public properties:
	/** The alpha (transparency) for this display object. 0 is fully transparent, 1 is fully opaque. **/
	p.alpha = 1;
	/** If a cache is active, this returns the canvas that holds the cached version of this display object. See cache() for more information. READ-ONLY. **/
	p.cacheCanvas = null;
	/** Unique ID for this display object. Makes display objects easier for some uses. **/
	p.id = -1;
	/** Indicates whether to include this object when running Stage.getObjectsUnderPoint(). Setting this to true for Sprites will cause the Sprite to be returned (not its children) regardless of whether it's mouseChildren property is true. **/
	p.mouseEnabled = false;
	/** An optional name for this display object. Included in toString(). Useful for debugging. **/
	p.name = null;
	/** A reference to the Sprite or Stage object that contains this display object, or null if it has not been added to one. READ-ONLY. **/
	p.parent = null;
	/** The x offset for this display object's registration point. For example, to make a 100x100px Bitmap rotate around it's center, you would set regX and regY to 50. **/
	p.regX = 0;
	/** The y offset for this display object's registration point. For example, to make a 100x100px Bitmap rotate around it's center, you would set regX and regY to 50. **/
	p.regY = 0;
	/** The rotation in degrees for this display object. **/
	p.rotation = 0;
	/** The factor to stretch this display object horizontally. For example, setting scaleX to 2 will stretch the display object to twice it's nominal width. **/
	p.scaleX = 1;
	/** The factor to stretch this display object vertically. For example, setting scaleY to 0.5 will stretch the display object to half it's nominal height. **/
	p.scaleY = 1;
	/** A shadow object that defines the shadow to render on this display object. Set to null to remove a shadow. Note that nested shadows can result in unexpected behaviour (ex. if both a child and a parent have a shadow set). **/
	p.shadow = null;
	/** Indicates whether this display object should be rendered to the canvas and included when running Stage.getObjectsUnderPoint(). **/
	p.visible = true;
	/** The x (horizontal) position of the display object, relative to its parent. **/
	p.x = 0;
	/** The y (vertical) position of the display object, relative to its parent. **/
	p.y = 0;
	
// private properties:
	/** @private **/
	p._cacheOffsetX = 0;
	/** @private **/
	p._cacheOffsetY = 0;
	/** @private **/
	p._cacheDraw = false;
	/** @private **/
	p._activeContext = null;
	/** @private **/
	p._restoreContext = false;
	/** @private **/
	p._revertShadow = false;
	/** @private **/
	p._revertX = 0;
	/** @private **/
	p._revertY = 0;
	/** @private **/
	p._revertAlpha = 1;
	
// constructor:
	// separated so it can be easily addressed in subclasses:
	/** @private **/
	p.init = function() {
		this.id = UID.get();
		this.children = [];
	}
	
// public methods:
	/**
	* NOTE: This method is mainly for internal use, though it may be useful for advanced developers extending the capabilities of the CanvasDisplay library.
	* Updates the specified context based on this display object's properties.
	* @param ctx The canvas 2D context object to update.
	* @param ignoreShadows Indicates whether the shadow property should be applied. Passing false will ignore the shadow, resulting in faster rendering for uses like hit testing.
	**/
	p.updateContext = function(ctx,ignoreShadows) {
		if (this.visible != true || ctx == null || this.alpha <= 0) { return false; }
		// apply context changes:
		this._activeContext = ctx;
		
		if (this._restoreContext = (this.rotation%360 || this.scaleX != 1 || this.scaleY != 1)) {
			ctx.save();
			// GDS: might be worth benchmarking implicit vs explicit boolean tests here:
			if (this.x || this.y) { ctx.translate(this.x, this.y); }
			if (this.rotation%360) { ctx.rotate(this.rotation%360/180*Math.PI); }
			// this 0.00000001 hack is a fix for FF not supporting scales of 0.
			if (this.scaleX != 1 || this.scaleY != 1) { ctx.scale(this.scaleX == 0 ? 0.00000001 : this.scaleX, this.scaleY == 0 ? 0.00000001 : this.scaleY); }
			if (this.regX || this.regY) { ctx.translate(-this.regX, -this.regY); }
		} else {
			ctx.translate(-(this._restoreX = -this.x+this.regX), -(this._restoreY = -this.y+this.regY));
		}
		
		this._revertAlpha = ctx.globalAlpha;
		ctx.globalAlpha *= this.alpha;
		if (this._revertShadow = (this.shadow && !ignoreShadows)) {
			this.applyShadow(ctx, this.shadow);
		}
	}
	
	/**
	* NOTE: This method is mainly for internal use, though it may be useful for advanced developers extending the capabilities of the CanvasDisplay library.
	* Draws the display object into the specified context if it is visible.
	* @param ctx The canvas 2D context object to draw into.
	* @param ignoreCache Indicates whether the draw operation should ignore any current cache. For example, used for drawing the cache (to prevent it from simply drawing an existing cache back into itself).
	**/
	p.draw = function(ctx,ignoreCache) {
		// can't use _activeContext because sometimes we need to draw without an updateContext being called (ex. caching)
		if (this.visible != true || ctx == null || this.alpha <= 0) { return false; }
		if (this.cacheCanvas && !ignoreCache) {
			ctx.translate(this._cacheOffsetX,this._cacheOffsetY);
			ctx.drawImage(this.cacheCanvas,0,0);
			ctx.translate(-this._cacheOffsetX,-this._cacheOffsetY);
			return false;
		}
		return true;
	}
	
	/**
	* NOTE: This method is mainly for internal use, though it may be useful for advanced developers extending the capabilities of the CanvasDisplay library.
	* Reverts the last context that was updated with updateContext(), restoring it to the state it was in prior to the update.
	**/
	p.revertContext = function() {
		if (this._activeContext == null) { return; }
		this._activeContext.globalAlpha = this._revertAlpha;
		if (this._revertShadow) {
			// GDS: instead, we could save out the shadow properties in update, and restore them here.
			this.applyShadow(this._activeContext, Shadow.identity);
		}
		if (this._restoreContext) { this._activeContext.restore(); }
		else { this._activeContext.translate(this._restoreX, this._restoreY); }
		this._activeContext = null
	}
	
	/**
	* Draws the display object into a new canvas, which is then used for subsequent draws. For complex content that does not change frequently (ex. a Sprite with many children that do not move, or a complex vector Shape), this can provide for much faster rendering because the content does not need to be rerendered each tick. The cached display object can be moved, rotated, faded, etc freely, however if it's content changes, you must manually update the cache by calling cache() again. Do not call uncache before the subsequent cache call. You must specify the cache area via the x, y, w, and h parameters. This defines the rectangle that will be rendered and cached using this display object's coordinates. For example if you defined a Shape that drew a circle at 0,0 with a radius of 25, you could call myShape.cache(-25,-25,50,50) to cache the full shape.
	* @param x
	* @param y
	* @param width
	* @param height
	**/
	p.cache = function(x, y, w, h) {
		// draw to canvas.
		var ctx;
		if (this.cacheCanvas == null) {
			this.cacheCanvas = document.createElement("canvas");
			ctx = this.cacheCanvas.getContext("2d");
		} else {
			ctx = this.cacheCanvas.getContext("2d");
		}
		this.cacheCanvas.width = w;
		this.cacheCanvas.height = h;
		ctx.translate(-x,-y);
		this.draw(ctx,true);
		this._cacheOffsetX = x;
		this._cacheOffsetY = y;
	}
	
	/**
	* Clears the current cache. See cache() for more information.
	**/
	p.uncache = function() {
		this.cacheCanvas = null;
		this.cacheOffsetX = this.cacheOffsetY = 0;
	}
	
	/**
	* Returns the stage that this display object will be rendered on, or null if it has not been added to one.
	**/
	p.getStage = function() {
		var o = this;
		while (o.parent) {
			o = o.parent;
		}
		if (o instanceof Stage) { return o; }
		return null;
	}
	
	/**
	* Returns a clone of this DisplayObject. Some properties that are specific to this instance's current context are reverted to their defaults (for example .parent).
	**/
	p.clone = function() {
		var o = new DisplayObject();
		this.cloneProps(o);
		return o;
	}
	
	/**
	* Returns a string representation of this object.
	**/
	p.toString = function() {
		return "[DisplayObject (name="+  this.name +")]";
	}
	
// private methods:
	// separated so it can be used easily in subclasses:
	/** @private **/
	p.cloneProps = function(o) {
		o.alpha = this.alpha;
		o.name = this.name;
		o.regX = this.regX;
		o.regY = this.regY;
		o.rotation = this.rotation;
		o.scaleX = this.scaleX;
		o.scaleY = this.scaleY;
		o.shadow = this.shadow;
		o.visible = this.visible;
		o.x  = this.x;
		o.y = this.y;
		o.mouseEnabled = this.mouseEnabled;
	}
	
	/** @private **/
	p.applyShadow = function(ctx, shadow) {
		ctx.shadowColor = shadow.color;
		ctx.shadowOffsetX = shadow.offsetX;
		ctx.shadowOffsetY = shadow.offsetY;
		ctx.shadowBlur = shadow.blur;
	}

window.DisplayObject = DisplayObject;
}(window));