/*
* Container
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
* A Container is a nestable display lists that allows you to work with compound display elements. For
* example you could group arm, leg, torso and head Bitmaps together into a Person Container, and
* transform them as a group, while still being able to move the individual parts relative to each
* other. Children of containers have their transform and alpha properties concatenated with their
* parent Container. For example, a Shape with x=100 and alpha=0.5, placed in a Container with
* x=50 and alpha=0.7 will be rendered to the canvas at x=150 and alpha=0.35. Containers have some
* overhead, so you generally shouldn't create a Container to hold a single child.
* @class Container
* @extends DisplayObject
* @constructor
**/
var Container = function() {
  this.initialize();
}
var p = Container.prototype = new createjs.DisplayObject();

// public properties:
	/**
	 * The array of children in the display list. You should usually use the child management methods,
	 * rather than accessing this directly, but it is included for advanced users.
	 * @property children
	 * @type Array[DisplayObject]
	 * @default null
	 **/
	p.children = null;

// constructor:

	/**
	 * @property DisplayObject_initialize
	 * @type Function
	 * @private
	 **/
	p.DisplayObject_initialize = p.initialize;

	/**
	 * Initialization method.
	 * @method initialize
	 * @protected
	*/
	p.initialize = function() {
		this.DisplayObject_initialize();
		this.children = [];
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
		return this.visible && this.alpha > 0 && this.children.length && this.scaleX != 0 && this.scaleY != 0;
	}

	/**
	 * @property DisplayObject_draw
	 * @type Function
	 * @private
	 **/
	p.DisplayObject_draw = p.draw;

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
		if (this.DisplayObject_draw(ctx, ignoreCache)) { return true; }
		
		// this ensures we don't have issues with display list changes that occur during a draw:
		var list = this.children.slice(0);
		for (var i=0,l=list.length; i<l; i++) {
			var child = list[i];
			if (!child.isVisible()) { continue; }
			
			// draw the child:
			ctx.save();
			child.updateContext(ctx);
			child.draw(ctx);
			ctx.restore();
		}
		return true;
	}
	
	/**
	 * Adds a child to the top of the display list. You can also add multiple children, such as "addChild(child1, child2, ...);".
	 * Returns the child that was added, or the last child if multiple children were added.
	 * @method addChild
	 * @param {DisplayObject} child The display object to add.
	 * @return {DisplayObject} The child that was added, or the last child if multiple children were added.
	 **/
	p.addChild = function(child) {
		if (child == null) { return child; }
		var l = arguments.length;
		if (l > 1) {
			for (var i=0; i<l; i++) { this.addChild(arguments[i]); }
			return arguments[l-1];
		}
		if (child.parent) { child.parent.removeChild(child); }
		child.parent = this;
		this.children.push(child);
		return child;
	}

	/**
	 * Adds a child to the display list at the specified index, bumping children at equal or greater indexes up one, and setting
	 * its parent to this Container. You can also add multiple children, such as "addChildAt(child1, child2, ..., index);". The
	 * index must be between 0 and numChildren. For example, to add myShape under otherShape in the display list, you could use:
	 * container.addChildAt(myShape, container.getChildIndex(otherShape)). This would also bump otherShape's index up by one.
	 * Returns the last child that was added, or the last child if multiple children were added. Fails silently if the index 
	 * is out of range.
	 * @method addChildAt
	 * @param {DisplayObject} child The display object to add.
	 * @param {Number} index The index to add the child at.
	 * @return {DisplayObject} The child that was added, or the last child if multiple children were added.
	 **/
	p.addChildAt = function(child, index) {
		var l = arguments.length;
		var indx = arguments[l-1]; // can't use the same name as the index param or it replaces arguments[1]
		if (indx < 0 || indx > this.children.length) { return arguments[l-2]; }
		if (l > 2) {
			for (var i=0; i<l-1; i++) { this.addChildAt(arguments[i], indx+i); }
			return arguments[l-2];
		}
		if (child.parent) { child.parent.removeChild(child); }
		child.parent = this;
		this.children.splice(index, 0, child);
		return child;
	}

	/**
	 * Removes the specified child from the display list. Note that it is faster to use removeChildAt() if the index is already
	 * known. You can also remove multiple children, such as "removeChild(child1, child2, ...);". Returns true if the child
	 * (or children) was removed, or false if it was not in the display list.
	 * @method removeChild
	 * @param {DisplayObject} child The child to remove.
	 * @return {Boolean} true if the child (or children) was removed, or false if it was not in the display list.
	 **/
	p.removeChild = function(child) {
		var l = arguments.length;
		if (l > 1) {
			var good = true;
			for (var i=0; i<l; i++) { good = good && this.removeChild(arguments[i]); }
			return good;
		}
		return this.removeChildAt(this.children.indexOf(child));
	}

	/**
	 * Removes the child at the specified index from the display list, and sets its parent to null. You can also remove multiple
	 * children, such as "removeChildAt(2, 7, ...);". Returns true if the child (or children) was removed, or false if any index
	 * was out of range.
	 * @param {Number} index The index of the child to remove.
	 * @return {Boolean} true if the child (or children) was removed, or false if any index was out of range.
	 **/
	p.removeChildAt = function(index) {
		var l = arguments.length;
		if (l > 1) {
			var a = [];
			for (var i=0; i<l; i++) { a[i] = arguments[i]; }
			a.sort(function(a, b) { return b-a; });
			var good = true;
			for (var i=0; i<l; i++) { good = good && this.removeChildAt(a[i]); }
			return good;
		}
		if (index < 0 || index > this.children.length-1) { return false; }
		var child = this.children[index];
		if (child) { child.parent = null; }
		this.children.splice(index, 1);
		return true;
	}

	/**
	 * Removes all children from the display list.
	 * @method removeAllChildren
	 **/
	p.removeAllChildren = function() {
		var kids = this.children;
		while (kids.length) { kids.pop().parent = null; }
	}

	/**
	 * Returns the child at the specified index.
	 * @method getChildAt
	 * @param {Number} index The index of the child to return.
	 * @return {DisplayObject} The child at the specified index.
	 **/
	p.getChildAt = function(index) {
		return this.children[index];
	}

	/**
	 * Performs an array sort operation on the child list.
	 * @method sortChildren
	 * @param {Function} sortFunction the function to use to sort the child list. See javascript's Array.sort documentation
	 * for details.
	 **/
	p.sortChildren = function(sortFunction) {
		this.children.sort(sortFunction);
	}

	/**
	 * Returns the index of the specified child in the display list, or -1 if it is not in the display list.
	 * @method getChildIndex
	 * @param {DisplayObject} child The child to return the index of.
	 * @return {Number} The index of the specified child. -1 if the child is not found.
	 **/
	p.getChildIndex = function(child) {
		return this.children.indexOf(child);
	}

	/**
	 * Returns the number of children in the display list.
	 * @method getNumChildren
	 * @return {Number} The number of children in the display list.
	 **/
	p.getNumChildren = function() {
		return this.children.length;
	}
	
	/**
	 * Swaps the children at the specified indexes. Fails silently if either index is out of range.
	 * @param {Number} index1
	 * @param {Number} index2
	 * @method swapChildrenAt
	 **/
	p.swapChildrenAt = function(index1, index2) {
		var kids = this.children;
		var o1 = kids[index1];
		var o2 = kids[index2];
		if (!o1 || !o2) { return; }
		kids[index1] = o2;
		kids[index2] = o1;
	}
	
	/**
	 * Swaps the specified children's depth in the display list. Fails silently if either child is not a child of this Container.
	 * @param {DisplayObject} child1
	 * @param {DisplayObject} child2
	 * @method swapChildren
	 **/
	p.swapChildren = function(child1, child2) {
		var kids = this.children;
		var index1,index2;
		for (var i=0,l=kids.length;i<l;i++) {
			if (kids[i] == child1) { index1 = i; }
			if (kids[i] == child2) { index2 = i; }
			if (index1 != null && index2 != null) { break; }
		}
		if (i==l) { return; } // TODO: throw error?
		kids[index1] = child2;
		kids[index2] = child1;
	}
	
	/**
	 * Changes the depth of the specified child. Fails silently if the child is not a child of this container, or the index is out of range.
	 * @param {DisplayObject} child
	 * @param {Number} index  
	 * @method setChildIndex
	 **/
	p.setChildIndex = function(child, index) {
		var kids = this.children, l=kids.length;
		if (child.parent != this || index < 0 || index >= l) { return; }
		for (var i=0;i<l;i++) {
			if (kids[i] == child) { break; }
		}
		if (i==l || i == index) { return; }
		kids.splice(i,1);
		if (index<i) { index--; }
		kids.splice(index,0,child);
	}

	/**
	 * Returns true if the specified display object either is this container or is a descendent.
	 * (child, grandchild, etc) of this container.
	 * @method contains
	 * @param {DisplayObject} child The DisplayObject to be checked.
	 * @return {Boolean} true if the specified display object either is this container or is a descendent.
	 **/
	p.contains = function(child) {
		while (child) {
			if (child == this) { return true; }
			child = child.parent;
		}
		return false;
	}

	/**
	 * Tests whether the display object intersects the specified local point (ie. draws a pixel with alpha > 0 at the specified
	 * position). This ignores the alpha, shadow and compositeOperation of the display object, and all transform properties
	 * including regX/Y.
	 * @method hitTest
	 * @param {Number} x The x position to check in the display object's local coordinates.
	 * @param {Number} y The y position to check in the display object's local coordinates.
	 * @return {Boolean} A Boolean indicating whether there is a visible section of a DisplayObject that overlaps the specified
	 * coordinates.
	 **/
	p.hitTest = function(x, y) {
		// TODO: optimize to use the fast cache check where possible.
		return (this.getObjectUnderPoint(x, y) != null);
	}

	/**
	 * Returns an array of all display objects under the specified coordinates that are in this container's display list.
	 * This routine ignores any display objects with mouseEnabled set to false. The array will be sorted in order of visual
	 * depth, with the top-most display object at index 0. This uses shape based hit detection, and can be an expensive operation
	 * to run, so it is best to use it carefully. For example, if testing for objects under the mouse, test on tick (instead of on
	 * mousemove), and only if the mouse's position has changed.
	 * @method getObjectsUnderPoint
	 * @param {Number} x The x position in the container to test.
	 * @param {Number} y The y position in the container to test.
	 * @return {Array[DisplayObject]} An Array of DisplayObjects under the specified coordinates.
	 **/
	p.getObjectsUnderPoint = function(x, y) {
		var arr = [];
		var pt = this.localToGlobal(x, y);
		this._getObjectsUnderPoint(pt.x, pt.y, arr);
		return arr;
	}

	/**
	 * Similar to getObjectsUnderPoint(), but returns only the top-most display object. This runs significantly faster than
	 * getObjectsUnderPoint(), but is still an expensive operation. See getObjectsUnderPoint() for more information.
	 * @method getObjectUnderPoint
	 * @param {Number} x The x position in the container to test.
	 * @param {Number} y The y position in the container to test.
	 * @return {DisplayObject} The top-most display object under the specified coordinates.
	 **/
	p.getObjectUnderPoint = function(x, y) {
		var pt = this.localToGlobal(x, y);
		return this._getObjectsUnderPoint(pt.x, pt.y);
	}

	/**
	 * Returns a clone of this Container. Some properties that are specific to this instance's current context are reverted to
	 * their defaults (for example .parent).
	 * @param {Boolean} recursive If true, all of the descendants of this container will be cloned recursively. If false, the
	 * properties of the container will be cloned, but the new instance will not have any children.
	 * @return {Container} A clone of the current Container instance.
	 **/
	p.clone = function(recursive) {
		var o = new Container();
		this.cloneProps(o);
		if (recursive) {
			var arr = o.children = [];
			for (var i=0, l=this.children.length; i<l; i++) {
				var clone = this.children[i].clone(recursive);
				clone.parent = o;
				arr.push(clone);
			}
		}
		return o;
	}

	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 **/
	p.toString = function() {
		return "[Container (name="+  this.name +")]";
	}

// private properties:
	/**
	 * @property DisplayObject__tick
	 * @type Function
	 * @private
	 **/
	p.DisplayObject__tick = p._tick;
	
	/**
	 * @method _tick
	 * @protected
	 **/
	p._tick = function(params) {
		for (var i=this.children.length-1; i>=0; i--) {
			var child = this.children[i];
			if (child._tick) { child._tick(params); }
		}
		this.DisplayObject__tick(params);
	}

	/**
	 * @method _getObjectsUnderPoint
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Array} arr
	 * @param {Number} mouseEvents A bitmask indicating which mouseEvent types to look for. Bit 1 specifies onPress &
	 * onClick & onDoubleClick, bit 2 specifies it should look for onMouseOver and onMouseOut. This implementation may change.
	 * @return {Array[DisplayObject]}
	 * @protected
	 **/
	p._getObjectsUnderPoint = function(x, y, arr, mouseEvents) {
		var ctx = createjs.DisplayObject._hitTestContext;
		var canvas = createjs.DisplayObject._hitTestCanvas;
		var mtx = this._matrix;
		var hasHandler = (mouseEvents&1 && (this.onPress || this.onClick || this.onDoubleClick)) || (mouseEvents&2 &&
																(this.onMouseOver || this.onMouseOut));

		// if we have a cache handy & this has a handler, we can use it to do a quick check.
		// we can't use the cache for screening children, because they might have hitArea set.
		if (this.cacheCanvas && hasHandler) {
			this.getConcatenatedMatrix(mtx);
			ctx.setTransform(mtx.a,  mtx.b, mtx.c, mtx.d, mtx.tx-x, mtx.ty-y);
			ctx.globalAlpha = mtx.alpha;
			this.draw(ctx);
			if (this._testHit(ctx)) {
				canvas.width = 0;
				canvas.width = 1;
				return this;
			}
		}

		// draw children one at a time, and check if we get a hit:
		var l = this.children.length;
		for (var i=l-1; i>=0; i--) {
			var child = this.children[i];
			if (!child.isVisible() || !child.mouseEnabled) { continue; }

			if (child instanceof Container) {
				var result;
				if (hasHandler) {
					// only concerned about the first hit, because this container is going to claim it anyway:
					result = child._getObjectsUnderPoint(x, y);
					if (result) { return this; }
				} else {
					result = child._getObjectsUnderPoint(x, y, arr, mouseEvents);
					if (!arr && result) { return result; }
				}
			} else if (!mouseEvents || hasHandler || (mouseEvents&1 && (child.onPress || child.onClick || child.onDoubleClick)) || (mouseEvents&2 && (child.onMouseOver || child.onMouseOut))) {
				var hitArea = child.hitArea;
				child.getConcatenatedMatrix(mtx);
				
				if (hitArea) {
					mtx.appendTransform(hitArea.x+child.regX, hitArea.y+child.regY, hitArea.scaleX, hitArea.scaleY, hitArea.rotation, hitArea.skewX, hitArea.skewY, hitArea.regX, hitArea.regY);
					mtx.alpha *= hitArea.alpha/child.alpha;
				}
				
				ctx.globalAlpha = mtx.alpha;
				ctx.setTransform(mtx.a,  mtx.b, mtx.c, mtx.d, mtx.tx-x, mtx.ty-y);
				(hitArea||child).draw(ctx);
				if (!this._testHit(ctx)) { continue; }
				canvas.width = 0;
				canvas.width = 1;
				if (hasHandler) { return this; }
				else if (arr) { arr.push(child); }
				else { return child; }
			}
		}
		return null;
	}

createjs.Container = Container;
}());