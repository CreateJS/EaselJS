/**
* Container by Grant Skinner. Dec 5, 2010
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
**/

(function(window) {

/**
* Constructs a new Container instance.
* @class Container are nestable display lists that allow you to work with compound display elements. For example you could group arm, leg, torso and head Bitmaps together into a Person Container, and transform them as a group, while still being able to move the individual parts relative to each other. Children of containers have their transform and alpha properties concatenated with their parent Container. For example, a Shape with x=100 and alpha=0.5, placed in a Container with x=50 and alpha=0.7 will be rendered to the canvas at x=150 and alpha=0.35. Containers have some overhead, so you generally shouldn't create a Container to hold a single child.
* @augments DisplayObject
**/
Container = function() {
  this.initialize();
}
Container.prototype = new DisplayObject();

// public properties:
	/** The array of children in the display list. You should usually use the child management methods, rather than accessing this directly, but it is included for advanced users. */
	Container.prototype.children = null;

// constructor:
	/** @ignore */
	Container.prototype.DisplayObject_initialize = Container.prototype.initialize;
	/** @ignore */
	Container.prototype.initialize = function() {
		this.DisplayObject_initialize();
		this.children = [];
	}
	
// public methods:

	Container.prototype.isVisible = function() {
		return this.visible && this.alpha > 0 && this.children.length && this.scaleX != 0 && this.scaleY != 0;
	}

	/** @private */
	Container.prototype.DisplayObject_draw = Container.prototype.draw;
	Container.prototype.draw = function(ctx, ignoreCache, _mtx) {
		var snap = Stage._snapToPixelEnabled;
		if (!_mtx) {
			_mtx = new Matrix2D();
			_mtx.appendProperties(this.alpha, this.shadow, this.compositeOperation);
		}
		if (this.DisplayObject_draw(ctx, ignoreCache)) { return true; }
		var l = this.children.length;
		// this ensures we don't have issues with display list changes that occur during a draw:
		var list = this.children.slice(0);
		for (var i=0; i<l; i++) {
			var child = list[i];
			if (child.tick) { child.tick(); }
			if (!child.isVisible()) { continue; }

			var mtx = _mtx.clone();
			mtx.appendTransform(child.x, child.y, child.scaleX, child.scaleY, child.rotation, child.skewX, child.skewY, child.regX, child.regY);
			mtx.appendProperties(child.alpha, child.shadow, child.compositeOperation);

			if (!(child instanceof Container)) {
				if (snap && child.snapToPixel && mtx.a == 1 && mtx.b == 0 && mtx.c == 0 && mtx.d == 1) {
					ctx.setTransform(mtx.a,  mtx.b, mtx.c, mtx.d, mtx.tx+0.5|0, mtx.ty+0.5|0);
				} else {
					ctx.setTransform(mtx.a,  mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
				}
				ctx.globalAlpha = mtx.alpha;
				ctx.globalCompositeOperation = mtx.compositeOperation || "source-over";
				if (mtx.shadow) { this.applyShadow(ctx, mtx.shadow); }
			}
			child.draw(ctx, false, mtx);
		}
		return true;
	}
	
	/**
	* Adds a child to the top of the display list. You can also add multiple children, such as "addChild(child1, child2, ...);". Returns the child that was added, or the last child if multiple children were added.
	* @param child The display object to add.
	**/
	Container.prototype.addChild = function(child) {
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
	* Adds a child to the display list at the specified index, bumping children at equal or greater indexes up one, and setting its parent to this Container. You can also add multiple children, such as "addChildAt(child1, child2, ..., index);". The index must be between 0 and numChildren. For example, to add myShape under otherShape in the display list, you could use: container.addChildAt(myShape, container.getChildIndex(otherShape)). This would also bump otherShape's index up by one. Returns the last child that was added, or the last child if multiple children were added.
	* @param child The display object to add.
	* @param index The index to add the child at.
	**/
	Container.prototype.addChildAt = function(child, index) {
		var l = arguments.length;
		if (l > 2) {
			index = arguments[i-1];
			for (var i=0; i<l-1; i++) { this.addChildAt(arguments[i], index+i); }
			return arguments[l-2];
		}
		if (child.parent) { child.parent.removeChild(child); }
		child.parent = this;
		this.children.splice(index, 0, child);
		return child;
	}
	
	/**
	* Removes the specified child from the display list. Note that it is faster to use removeChildAt() if the index is already known. You can also remove multiple children, such as "removeChild(child1, child2, ...);". Returns true if the child (or children) was removed, or false if it was not in the display list.
	* @param child The child to remove.
	**/
	Container.prototype.removeChild = function(child) {
		var l = arguments.length;
		if (l > 1) {
			var good = true;
			for (var i=0; i<l; i++) { good = good && this.removeChild(arguments[i]); }
			return good;
		}
		return this.removeChildAt(this.children.indexOf(child));
	}
	
	/**
	* Removes the child at the specified index from the display list, and sets its parent to null. You can also remove multiple children, such as "removeChildAt(2, 7, ...);". Returns true if the child (or children) was removed, or false if any index was out of range.
	* @param The index of the child to remove.
	**/
	Container.prototype.removeChildAt = function(index) {
		var l = arguments.length;
		if (l > 1) {
			var a = [];
			for (var i=0; i<l; i++) { a[i] = arguments[i]; }
			a.sort(function(a, b) { return b-a; })
			var good = true;
			for (var i=0; i<l; i++) { good = good && this.removeChildAt(a[i]); }
			return good;
		}
		if (index < 0 || index > this.children.length-1) { return false; }
		var child = this.children[index];
		if (child != null) { child.parent = null; }
		this.children.splice(index, 1);
		return true;
	}
	
	/**
	* Removes all children from the display list.
	**/
	Container.prototype.removeAllChildren = function() {
		while (this.children.length) { this.removeChildAt(0); }
	}
	
	/**
	* Returns the child at the specified index.
	* @param index The index of the child to return.
	**/
	Container.prototype.getChildAt = function(index) {
		return this.children[index];
	}
	
	/**
	* Performs an array sort operation on the child list.
	* @sortFunction the function to use to sort the child list. See javascript's Array.sort documentation for details.
	**/
	Container.prototype.sortChildren = function(sortFunction) {
		this.children.sort(sortFunction);
	}
	
	/**
	* Returns the index of the specified child in the display list, or -1 if it is not in the display list.
	* @param The child to return the index of.
	**/
	Container.prototype.getChildIndex = function(child) {
		return this.children.indexOf(child);
	}
	
	/**
	* Returns the number of children in the display list.
	**/
	Container.prototype.getNumChildren = function() {
		return this.children.length;
	}
	
	/**
	* Returns true if the specified display object either is this container or is a descendent
	* (child, grandchild, etc) of this container.
	**/
	Container.prototype.contains = function(child) {
		while (child) {
			if (child == this) { return true; }
			child = child.parent;
		}
		return false;
	}
	
	Container.prototype.hitTest = function(x, y) {
		// TODO: optimize to use the fast cache check where possible.
		return (this.getObjectUnderPoint(x, y) != null);
	}

	/**
	* Returns an array of all display objects under the specified coordinates that are in this container's display list. This routine ignores any display objects with mouseEnabled set to false. The array will be sorted in order of visual depth, with the top-most display object at index 0. This uses shape based hit detection, and can be an expensive operation to run, so it is best to use it carefully. For example, if testing for objects under the mouse, test on tick (instead of on mousemove), and only if the mouse's position has changed.
	* @param x The x position in the container to test.
	* @param y The y position in the container to test.
	**/
	Container.prototype.getObjectsUnderPoint = function(x, y) {
		var arr = [];
		var pt = this.localToGlobal(x, y);
		this._getObjectsUnderPoint(pt.x, pt.y, arr);
		return arr;
	}

	/**
	* Similar to getObjectsUnderPoint(), but returns only the top-most display object. This runs significantly faster than getObjectsUnderPoint(), but is still an expensive operation. See getObjectsUnderPoint() for more information.
	* @param x The x position in the container to test.
	* @param y The y position in the container to test.
	**/
	Container.prototype.getObjectUnderPoint = function(x, y) {
		var pt = this.localToGlobal(x, y);
		return this._getObjectsUnderPoint(pt.x, pt.y);
	}
	
	/**
	* Returns a clone of this Container. Some properties that are specific to this instance's current context are reverted to their defaults (for example .parent).
	* @param recursive If true, all of the descendants of this container will be cloned recursively. If false, the properties of the container will be cloned, but the new instance will not have any children.
	**/
	Container.prototype.clone = function(recursive) {
		var o = new Container();
		this.cloneProps(o);
		if (recursive) {
			var arr = o.children = [];
			for (var i=0, l=this.children.length; i<l; i++) {
				arr.push(this.children[i].clone(recursive));
			}
		}
		return o;
	}
	
	Container.prototype.toString = function() {
		return "[Container (name="+  this.name +")]";
	}
	
// private properties:
	/** @private */
	Container.prototype._getObjectsUnderPoint = function(x, y, arr, mouseEvents) {

		var ctx = DisplayObject._hitTestContext;
		var canvas = DisplayObject._hitTestCanvas;
		var mtx = DisplayObject._workingMatrix;
		var hasHandler = mouseEvents && (this.onPress || this.onClick);

		// if we have a cache handy, we can use it to do a quick check:
		if (this.cacheCanvas) {
			this.getConcatenatedMatrix(mtx);
			ctx.setTransform(mtx.a,  mtx.b, mtx.c, mtx.d, mtx.tx-x, mtx.ty-y);
			ctx.globalAlpha = mtx.alpha;
			this.draw(ctx);
			if (this._testHit(ctx)) {
				canvas.width = 0;
				canvas.width = 1;
				if (hasHandler) { return this; }
			} else {
				return null;
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
			} else if (!mouseEvents || (mouseEvents && (child.onPress || child.onClick || hasHandler))) {
				child.getConcatenatedMatrix(mtx);
				ctx.setTransform(mtx.a,  mtx.b, mtx.c, mtx.d, mtx.tx-x, mtx.ty-y);
				ctx.globalAlpha = mtx.alpha;
				child.draw(ctx);
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

window.Container = Container;
}(window));