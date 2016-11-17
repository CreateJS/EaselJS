/*
* @license Container
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

import DisplayObject from './DisplayObject';

/**
 * A Container is a nestable display list that allows you to work with compound display elements. For  example you could
 * group arm, leg, torso and head {{#crossLink "Bitmap"}}{{/crossLink}} instances together into a Person Container, and
 * transform them as a group, while still being able to move the individual parts relative to each other. Children of
 * containers have their <code>transform</code> and <code>alpha</code> properties concatenated with their parent
 * Container.
 *
 * For example, a {{#crossLink "Shape"}}{{/crossLink}} with x=100 and alpha=0.5, placed in a Container with <code>x=50</code>
 * and <code>alpha=0.7</code> will be rendered to the canvas at <code>x=150</code> and <code>alpha=0.35</code>.
 * Containers have some overhead, so you generally shouldn't create a Container to hold a single child.
 *
 * <h4>Example</h4>
 *
 *      var container = new createjs.Container();
 *      container.addChild(bitmapInstance, shapeInstance);
 *      container.x = 100;
 *
 * @class Container
 * @extends DisplayObject
 * @module EaselJS
 */
export default class Container extends DisplayObject {

// constructor:
	/**
	 * @constructor
	 */
	constructor () {
		super();

// public properties:
		/**
		 * The array of children in the display list. You should usually use the child management methods such as
		 * {{#crossLink "Container/addChild"}}{{/crossLink}}, {{#crossLink "Container/removeChild"}}{{/crossLink}},
		 * {{#crossLink "Container/swapChildren"}}{{/crossLink}}, etc, rather than accessing this directly, but it is
		 * included for advanced uses.
		 * @property children
		 * @type Array
		 * @default null
		 */
		this.children = [];

		/**
		 * Indicates whether the children of this container are independently enabled for mouse/pointer interaction.
		 * If false, the children will be aggregated under the container - for example, a click on a child shape would
		 * trigger a click event on the container.
		 * @property mouseChildren
		 * @type Boolean
		 * @default true
		 */
		this.mouseChildren = true;

		/**
		 * If false, the tick will not be propagated to children of this Container. This can provide some performance benefits.
		 * In addition to preventing the "tick" event from being dispatched, it will also prevent tick related updates
		 * on some display objects (ex. Sprite & MovieClip frame advancing, DOMElement visibility handling).
		 * @property tickChildren
		 * @type Boolean
		 * @default true
		 */
		this.tickChildren = true;
		}

// accessor properties:
	/**
	 * Returns the number of children in the container.
	 * @property numChildren
	 * @type {Number}
	 * @readonly
	 */
	get numChildren () {
		return this.children.length;
	}

// public methods:
	/**
	 * Returns true or false indicating whether the display object would be visible if drawn to a canvas.
	 * This does not account for whether it would be visible within the boundaries of the stage.
	 *
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method isVisible
	 * @return {Boolean} Boolean indicating whether the display object would be visible if drawn to a canvas
	 */
	isVisible () {
		let hasContent = this.cacheCanvas || this.children.length;
		return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent);
	}

	/**
	 * Draws the display object into the specified context ignoring its visible, alpha, shadow, and transform.
	 * Returns true if the draw was handled (useful for overriding functionality).
	 *
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method draw
	 * @param {CanvasRenderingContext2D} ctx The canvas 2D context object to draw into.
	 * @param {Boolean} [ignoreCache=false] Indicates whether the draw operation should ignore any current cache.
	 * For example, used for drawing the cache (to prevent it from simply drawing an existing cache back
	 * into itself).
	 */
	draw (ctx, ignoreCache = false) {
		if (super.draw(ctx, ignoreCache)) { return true; }

		// this ensures we don't have issues with display list changes that occur during a draw:
		let list = this.children.slice();
		for (let i=0,l=list.length; i<l; i++) {
			let child = list[i];
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
	 * Adds a child to the top of the display list.
	 *
	 * <h4>Example</h4>
	 *
	 * 		container.addChild(bitmapInstance);
	 *
	 * You can also add multiple children at once:
	 *
	 * 		container.addChild(bitmapInstance, shapeInstance, textInstance);
	 *
	 * @method addChild
	 * @param {...DisplayObject} children The display object(s) to add.
	 * @return {DisplayObject} The child that was added, or the last child if multiple children were added.
	 */
	addChild (...children) {
		const l = children.length;
		if (l == 0) { return null; }
		let child = children[0];
		if (l > 1) {
			for (let i = 0; i < l; i++) { child = this.addChild(children[i]); }
			return child;
		}
		if (child.parent) { child.parent.removeChild(child); }
		child.parent = this;
		this.children.push(child);
		child.dispatchEvent("added");
		return child;
	}
	/*
	TODO-ES6: Perf test rest param loops vs arguments.
	addChild (...children) {
		const l = children.length;
		if (l == 0) { return null; }
		let child;
		for (let i = 0; i < l; i++) {
			child = children[0];
			if (child.parent) { child.parent.removeChild(child); }
			child.parent = this;
			this.children.push(child);
			child.dispatchEvent("added");
		}
		return child;
	}*/

	/**
	 * Adds a child to the display list at the specified index, bumping children at equal or greater indexes up one, and
	 * setting its parent to this Container.
	 *
	 * <h4>Example</h4>
	 *
	 *      addChildAt(child1, index);
	 *
	 * You can also add multiple children, such as:
	 *
	 *      addChildAt(child1, child2, ..., index);
	 *
	 * The index must be between 0 and numChildren. For example, to add myShape under otherShape in the display list,
	 * you could use:
	 *
	 *      container.addChildAt(myShape, container.getChildIndex(otherShape));
	 *
	 * This would also bump otherShape's index up by one. Fails silently if the index is out of range.
	 *
	 * @method addChildAt
	 * @param {...DisplayObject} children The display object(s) to add.
	 * @param {Number} index The index to add the child at.
	 * @return {DisplayObject} Returns the last child that was added, or the last child if multiple children were added.
	 */
	addChildAt(...children) {
		let index = children.pop();
		const l = children.length;
		if (index < 0 || index > this.children.length) { return children[l-2]; }
		if (l > 2) {
			for (let i = 0; i < l - 1; i++) { this.addChildAt(children[i], index++); }
			return children[l - 2];
		}
		let child = children[0];
		if (child.parent) { child.parent.removeChild(child); }
		child.parent = this;
		this.children.splice(index++, 0, child);
		child.dispatchEvent("added");
		return child;
	}
	/*
	addChildAt (...children) {
		let index = children.pop();
		const l = children.length;
		if (index < 0 || index > this.children.length) { return children[l-2]; }
		let child;
		for (let i = 0; i < l; i++) {
			child = children[i];
			if (child.parent) { child.parent.removeChild(child); }
			child.parent = this;
			this.children.splice(index++, 0, child);
			child.dispatchEvent("added");
		}
		return child;
	}
	*/

	/**
	 * Removes the specified child from the display list. Note that it is faster to use removeChildAt() if the index is
	 * already known.
	 *
	 * <h4>Example</h4>
	 *
	 *      container.removeChild(child);
	 *
	 * You can also remove multiple children:
	 *
	 *      removeChild(child1, child2, ...);
	 *
	 * Returns true if the child (or children) was removed, or false if it was not in the display list.
	 * @method removeChild
	 * @param {DisplayObject} children The display object(s) to remove.
	 * @return {Boolean} true if the child (or children) was removed, or false if it was not in the display list.
	 */
	removeChild (...children) {
		const l = children.length;
		if (l > 1) {
			let good = true;
			for (let i = 0; i < l; i++) { good = good && this.removeChild(children[i]); }
			return good;
		}
		return this.removeChildAt(this.children.indexOf(children[0]));
	}
  /*
	removeChild(...children) {
		const l = children.length;
		let good = true;
		let child;
		for (let i = 0; i < l; i++) {
			good = good && this.removeChildAt(this.children.indexOf(children[i]));
		}
		return good;
	}
  */

	/**
	 * Removes the child at the specified index from the display list, and sets its parent to null.
	 *
	 * <h4>Example</h4>
	 *
	 *      container.removeChildAt(2);
	 *
	 * You can also remove multiple children:
	 *
	 *      container.removeChild(2, 7, ...)
	 *
	 * Returns true if the child (or children) was removed, or false if any index was out of range.
	 * @method removeChildAt
	 * @param {...Number} index The index of the child to remove.
	 * @return {Boolean} true if the child (or children) was removed, or false if any index was out of range.
	 */
	removeChildAt (...indexes) {
		const l = indexes.length;
		if (l > 1) {
			indexes.sort((a, b) => b - a);
			let good = true;
			for (let i = 0; i < l; i++) { good = good && this.removeChildAt(indexes[i]); }
			return good;
		}
		let index = indexes[0];
		if (index < 0 || index > this.children.length - 1) { return false; }
		let child = this.children[index];
		if (child) { child.parent = null; }
		this.children.splice(index, 1);
		child.dispatchEvent("removed");
		return true;
	}
	/*
	removeChildAt (...indexes) {
		const l = indexes.length;
		if (l > 1) { indexes.sort((a, b) => b - a); }
		let good = true;
		for (let i = 0; i < l; i++) {
			let index = indexes[0];
			if (index < 0 || index > this.children.length - 1) {
				good = false;
				continue;
			}
			let child = this.children[index];
			if (child) { child.parent = null; }
			this.children.splice(index, 1);
			child.dispatchEvent("removed");
		}
		return good;
	}
	*/

	/**
	 * Removes all children from the display list.
	 *
	 * <h4>Example</h4>
	 *
	 * 	container.removeAllChildren();
	 *
	 * @method removeAllChildren
	 */
	removeAllChildren () {
		let kids = this.children;
		while (kids.length) { this.removeChildAt(0); }
	}

	/**
	 * Returns the child at the specified index.
	 *
	 * <h4>Example</h4>
	 *
	 *      container.getChildAt(2);
	 *
	 * @method getChildAt
	 * @param {Number} index The index of the child to return.
	 * @return {DisplayObject} The child at the specified index. Returns null if there is no child at the index.
	 */
	getChildAt (index) {
		return this.children[index];
	}

	/**
	 * Returns the child with the specified name.
	 * @method getChildByName
	 * @param {String} name The name of the child to return.
	 * @return {DisplayObject} The child with the specified name.
	 */
	getChildByName (name) {
		let kids = this.children;
		const l = kids.length;
		for (let i = 0; i < l; i++) {
			if (kids[i].name == name) { return kids[i]; }
		}
		return null;
	}

	/**
	 * Performs an array sort operation on the child list.
	 *
	 * <h4>Example: Display children with a higher y in front.</h4>
	 *
	 *      var sortFunction = function(obj1, obj2, options) {
	 *          if (obj1.y > obj2.y) { return 1; }
	 *          if (obj1.y < obj2.y) { return -1; }
	 *          return 0;
	 *      }
	 *      container.sortChildren(sortFunction);
	 *
	 * @method sortChildren
	 * @param {Function} sortFunction the function to use to sort the child list. See JavaScript's <code>Array.sort</code>
	 * documentation for details.
	 */
	sortChildren (sortFunction) {
		this.children.sort(sortFunction);
	}

	/**
	 * Returns the index of the specified child in the display list, or -1 if it is not in the display list.
	 *
	 * <h4>Example</h4>
	 *
	 *      var index = container.getChildIndex(child);
	 *
	 * @method getChildIndex
	 * @param {DisplayObject} child The child to return the index of.
	 * @return {Number} The index of the specified child. -1 if the child is not found.
	 */
	getChildIndex (child) {
		return this.children.indexOf(child);
	}

	/**
	 * Swaps the children at the specified indexes. Fails silently if either index is out of range.
	 * @method swapChildrenAt
	 * @param {Number} index1
	 * @param {Number} index2
	 */
	swapChildrenAt (index1, index2) {
		let kids = this.children;
		let o1 = kids[index1];
		let o2 = kids[index2];
		if (!o1 || !o2) { return; }
		kids[index1] = o2;
		kids[index2] = o1;
	};

	/**
	 * Swaps the specified children's depth in the display list. Fails silently if either child is not a child of this
	 * Container.
	 * @method swapChildren
	 * @param {DisplayObject} child1
	 * @param {DisplayObject} child2
	 */
	swapChildren (child1, child2) {
		let kids = this.children;
		const l = kids.length;
		let index1,index2;
		for (var i = 0; i < l; i++) {
			if (kids[i] == child1) { index1 = i; }
			if (kids[i] == child2) { index2 = i; }
			if (index1 != null && index2 != null) { break; }
		}
		if (i == l) { return; } // TODO: throw error?
		kids[index1] = child2;
		kids[index2] = child1;
	}

	/**
	 * Changes the depth of the specified child. Fails silently if the child is not a child of this container, or the index is out of range.
	 * @param {DisplayObject} child
	 * @param {Number} index
	 * @method setChildIndex
	 */
	setChildIndex (child, index) {
		let kids = this.children;
		const l = kids.length;
		if (child.parent != this || index < 0 || index >= l) { return; }
		for (var i = 0; i < l; i++) {
			if (kids[i] == child) { break; }
		}
		if (i == l || i == index) { return; }
		kids.splice(i, 1);
		kids.splice(index, 0, child);
	}

	/**
	 * Returns true if the specified display object either is this container or is a descendent (child, grandchild, etc)
	 * of this container.
	 * @method contains
	 * @param {DisplayObject} child The DisplayObject to be checked.
	 * @return {Boolean} true if the specified display object either is this container or is a descendent.
	 */
	contains (child) {
		while (child) {
			if (child == this) { return true; }
			child = child.parent;
		}
		return false;
	}

	/**
	 * Tests whether the display object intersects the specified local point (ie. draws a pixel with alpha > 0 at the
	 * specified position). This ignores the alpha, shadow and compositeOperation of the display object, and all
	 * transform properties including regX/Y.
	 * @method hitTest
	 * @param {Number} x The x position to check in the display object's local coordinates.
	 * @param {Number} y The y position to check in the display object's local coordinates.
	 * @return {Boolean} A Boolean indicating whether there is a visible section of a DisplayObject that overlaps the specified
	 * coordinates.
	 */
	hitTest (x, y) {
		// TODO: optimize to use the fast cache check where possible.
		return this.getObjectUnderPoint(x, y) != null;
	}

	/**
	 * Returns an array of all display objects under the specified coordinates that are in this container's display
	 * list. This routine ignores any display objects with {{#crossLink "DisplayObject/mouseEnabled:property"}}{{/crossLink}}
	 * set to `false`. The array will be sorted in order of visual depth, with the top-most display object at index 0.
	 * This uses shape based hit detection, and can be an expensive operation to run, so it is best to use it carefully.
	 * For example, if testing for objects under the mouse, test on tick (instead of on {{#crossLink "DisplayObject/mousemove:event"}}{{/crossLink}}),
	 * and only if the mouse's position has changed.
	 *
	 * <ul>
	 *     <li>By default (mode=0) this method evaluates all display objects.</li>
	 *     <li>By setting the `mode` parameter to `1`, the {{#crossLink "DisplayObject/mouseEnabled:property"}}{{/crossLink}}
	 * 		and {{#crossLink "mouseChildren:property"}}{{/crossLink}} properties will be respected.</li>
	 * 	   <li>Setting the `mode` to `2` additionally excludes display objects that do not have active mouse event
	 * 	   	listeners or a {{#crossLink "DisplayObject:cursor:property"}}{{/crossLink}} property. That is, only objects
	 * 	   	that would normally intercept mouse interaction will be included. This can significantly improve performance
	 * 	   	in some cases by reducing the number of display objects that need to be tested.</li>
	 * </li>
	 *
	 * This method accounts for both {{#crossLink "DisplayObject/hitArea:property"}}{{/crossLink}} and {{#crossLink "DisplayObject/mask:property"}}{{/crossLink}}.
	 * @method getObjectsUnderPoint
	 * @param {Number} x The x position in the container to test.
	 * @param {Number} y The y position in the container to test.
	 * @param {Number} [mode=0] The mode to use to determine which display objects to include. 0-all, 1-respect mouseEnabled/mouseChildren, 2-only mouse opaque objects.
	 * @return {Array} An Array of DisplayObjects under the specified coordinates.
	 */
	getObjectsUnderPoint (x, y, mode = 0) {
		let arr = [];
		let pt = this.localToGlobal(x, y);
		this._getObjectsUnderPoint(pt.x, pt.y, arr, mode > 0, mode == 1);
		return arr;
	}

	/**
	 * Similar to {{#crossLink "Container/getObjectsUnderPoint"}}{{/crossLink}}, but returns only the top-most display
	 * object. This runs significantly faster than <code>getObjectsUnderPoint()</code>, but is still potentially an expensive
	 * operation. See {{#crossLink "Container/getObjectsUnderPoint"}}{{/crossLink}} for more information.
	 * @method getObjectUnderPoint
	 * @param {Number} x The x position in the container to test.
	 * @param {Number} y The y position in the container to test.
	 * @param {Number} [mode=0] The mode to use to determine which display objects to include.  0-all, 1-respect mouseEnabled/mouseChildren, 2-only mouse opaque objects.
	 * @return {DisplayObject} The top-most display object under the specified coordinates.
	 */
	getObjectUnderPoint (x, y, mode = 0) {
		let pt = this.localToGlobal(x, y);
		return this._getObjectsUnderPoint(pt.x, pt.y, null, mode > 0, mode == 1);
	}

	/**
	 * Docced in superclass.
	 */
	getBounds () {
		return this._getBounds(null, true);
	}


	/**
	 * Docced in superclass.
	 */
	getTransformedBounds () {
		return this._getBounds();
	}

	/**
	 * Returns a clone of this Container. Some properties that are specific to this instance's current context are
	 * reverted to their defaults (for example .parent).
	 * @method clone
	 * @param {Boolean} [recursive=false] If true, all of the descendants of this container will be cloned recursively. If false, the
	 * properties of the container will be cloned, but the new instance will not have any children.
	 * @return {Container} A clone of the current Container instance.
	 */
	clone (recursive = false) {
		let o = this._cloneProps(new Container());
		if (recursive) { this._cloneChildren(o); }
		return o;
	}

// private methods:
	/**
	 * @method _tick
	 * @param {Object} evtObj An event object that will be dispatched to all tick listeners. This object is reused between dispatchers to reduce construction & GC costs.
	 * @protected
	 */
	_tick (evtObj) {
		if (this.tickChildren) {
			for (let i = this.children.length - 1; i >= 0; i--) {
				let child = this.children[i];
				if (child.tickEnabled && child._tick) { child._tick(evtObj); }
			}
		}
		super._tick(evtObj);
	}

	/**
	 * Recursively clones all children of this container, and adds them to the target container.
	 * @method cloneChildren
	 * @protected
	 * @param {Container} o The target container.
	 */
	_cloneChildren (o) {
		if (o.children.length) { o.removeAllChildren(); }
		let arr = o.children;
		const l = this.children.length;
		for (let i = 0; i < l; i++) {
			let clone = this.children[i].clone(true);
			clone.parent = o;
			arr.push(clone);
		}
	}

	/**
	 * @method _getObjectsUnderPoint
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Array} arr
	 * @param {Boolean} mouse If true, it will respect mouse interaction properties like mouseEnabled, mouseChildren, and active listeners.
	 * @param {Boolean} activeListener If true, there is an active mouse event listener on a parent object.
	 * @param {Number} [currentDepth=0] Indicates the current depth of the search.
	 * @return {DisplayObject}
	 * @protected
	 */
	_getObjectsUnderPoint (x, y, arr, mouse, activeListener, currentDepth = 0) {
		if (!currentDepth && !this._testMask(this, x, y)) { return null; }
		let mtx, ctx = DisplayObject._hitTestContext;
		activeListener = activeListener || (mouse && this._hasMouseEventListener());

		// draw children one at a time, and check if we get a hit:
		let children = this.children;
		const l = children.length;
		for (let i = l - 1; i >= 0; i--) {
			let child = children[i];
			let hitArea = child.hitArea;
			if (!child.visible || (!hitArea && !child.isVisible()) || (mouse && !child.mouseEnabled)) { continue; }
			if (!hitArea && !this._testMask(child, x, y)) { continue; }

			// if a child container has a hitArea then we only need to check its hitArea, so we can treat it as a normal DO:
			if (!hitArea && child instanceof Container) {
				let result = child._getObjectsUnderPoint(x, y, arr, mouse, activeListener, currentDepth + 1);
				if (!arr && result) { return (mouse && !this.mouseChildren) ? this : result; }
			} else {
				if (mouse && !activeListener && !child._hasMouseEventListener()) { continue; }

				// TODO: can we pass displayProps forward, to avoid having to calculate this backwards every time? It's kind of a mixed bag. When we're only hunting for DOs with event listeners, it may not make sense.
				let props = child.getConcatenatedDisplayProps(child._props);
				mtx = props.matrix;

				if (hitArea) {
					mtx.appendMatrix(hitArea.getMatrix(hitArea._props.matrix));
					props.alpha = hitArea.alpha;
				}

				ctx.globalAlpha = props.alpha;
				ctx.setTransform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx-x, mtx.ty-y);
				(hitArea || child).draw(ctx);
				if (!this._testHit(ctx)) { continue; }
				ctx.setTransform(1, 0, 0, 1, 0, 0);
				ctx.clearRect(0, 0, 2, 2);
				if (arr) { arr.push(child); }
				else { return (mouse && !this.mouseChildren) ? this : child; }
			}
		}
		return null;
	}

	/**
	 * @method _testMask
	 * @param {DisplayObject} target
	 * @param {Number} x
	 * @param {Number} y
	 * @return {Boolean} Indicates whether the x/y is within the masked region.
	 * @protected
	 */
	_testMask (target, x, y) {
		let mask = target.mask;
		if (!mask || !mask.graphics || mask.graphics.isEmpty()) { return true; }

		let mtx = this._props.matrix, parent = target.parent;
		mtx = parent ? parent.getConcatenatedMatrix(mtx) : mtx.identity();
		mtx = mask.getMatrix(mask._props.matrix).prependMatrix(mtx);

		let ctx = DisplayObject._hitTestContext;
		ctx.setTransform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx-x, mtx.ty-y);

		// draw the mask as a solid fill:
		mask.graphics.drawAsPath(ctx);
		ctx.fillStyle = "#000";
		ctx.fill();

		if (!this._testHit(ctx)) { return false; }
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, 2, 2);

		return true;
	}

	/**
	 * @method _getBounds
	 * @param {Matrix2D} matrix
	 * @param {Boolean} ignoreTransform If true, does not apply this object's transform.
	 * @return {Rectangle}
	 * @protected
	 */
	_getBounds (matrix, ignoreTransform) {
		let bounds = super.getBounds();
		if (bounds) { return this._transformBounds(bounds, matrix, ignoreTransform); }

		let mtx = this._props.matrix;
		mtx = ignoreTransform ? mtx.identity() : this.getMatrix(mtx);
		if (matrix) { mtx.prependMatrix(matrix); }

		const l = this.children.length;
		let rect = null;
		for (let i = 0; i < l; i++) {
			let child = this.children[i];
			if (!child.visible || !(bounds = child._getBounds(mtx))) { continue; }
			if (rect) { rect.extend(bounds.x, bounds.y, bounds.width, bounds.height); }
			else { rect = bounds.clone(); }
		}
		return rect;
	}

}
