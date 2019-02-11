/**
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

import DisplayObject from "./DisplayObject";

/**
 * A Container is a nestable display list that allows you to work with compound display elements. For  example you could
 * group arm, leg, torso and head {{#crossLink "Bitmap"}}{{/crossLink}} instances together into a Person Container, and
 * transform them as a group, while still being able to move the individual parts relative to each other. Children of
 * containers have their `transform` and `alpha` properties concatenated with their parent
 * Container.
 *
 * For example, a {{#crossLink "Shape"}}{{/crossLink}} with x=100 and alpha=0.5, placed in a Container with `x=50`
 * and `alpha=0.7` will be rendered to the canvas at `x=150` and `alpha=0.35`.
 * Containers have some overhead, so you generally shouldn't create a Container to hold a single child.
 *
 * @memberof easeljs
 * @extends easeljs.DisplayObject
 * @example
 * import { Container } from "@createjs/easeljs";
 * const container = new Container();
 * container.addChild(bitmapInstance, shapeInstance);
 * container.x = 100;
 */
export default class Container extends DisplayObject {

	constructor() {
		super();

		/**
		 * The array of children in the display list. You should usually use the child management methods such as
		 * {@link easeljs.Container#addChild}, {@link easeljs.Container#removeChild}, {@link easeljs.Container#swapChildren},
		 * etc, rather than accessing this directly, but it is included for advanced uses.
		 * @type {Array}
		 * @default []
		 */
		this.children = [];

		/**
		 * Indicates whether the children of this container are independently enabled for mouse/pointer interaction.
		 * If false, the children will be aggregated under the container - for example, a click on a child shape would
		 * trigger a click event on the container.
		 * @type {Boolean}
		 * @default true
		 */
		this.mouseChildren = true;

		/**
		 * If false, the tick will not be propagated to children of this Container. This can provide some performance benefits.
		 * In addition to preventing the {@link core.Ticker#event:tick} event from being dispatched, it will also prevent tick related updates
		 * on some display objects (ex. Sprite & MovieClip frame advancing, DOMElement visibility handling).
		 * @type {Boolean}
		 * @default true
		 */
		this.tickChildren = true;
	}

	/**
	 * Returns the number of children in the container.
	 * @type {Number}
	 * @readonly
	 */
	get numChildren () {
		return this.children.length;
	}

	isVisible() {
		let hasContent = this.cacheCanvas || this.children.length;
		return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent);
	}

	draw(ctx, ignoreCache = false) {
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
	 * @example
	 * container.addChild(bitmapInstance);
	 * // You can also add multiple children at once:
	 * container.addChild(bitmapInstance, shapeInstance, textInstance);
	 *
	 * @param {...easeljs.DisplayObject} children The display object(s) to add.
	 * @return {easeljs.DisplayObject} The child that was added, or the last child if multiple children were added.
	 */
	addChild(...children) {
		const l = children.length;
		if (l === 0) { return null; }
		let child = children[0];
		if (l > 1) {
			for (let i = 0; i < l; i++) { child = this.addChild(children[i]); }
			return child;
		}
    // Note: a lot of duplication with addChildAt, but push is WAY faster than splice.
    let parent = child.parent, silent = parent === this;
    parent && parent._removeChildAt(parent.children.indexOf(child), silent);
		child.parent = this;
		this.children.push(child);
    if (!silent) { child.dispatchEvent("added"); }
		return child;
	}

	/**
	 * Adds a child to the display list at the specified index, bumping children at equal or greater indexes up one, and
	 * setting its parent to this container.
	 *
	 * @example
	 * container.addChildAt(child1, index);
	 * // You can also add multiple children, such as:
	 * container.addChildAt(child1, child2, ..., index);
	 * // The index must be between 0 and numChildren. For example, to add myShape under otherShape in the display list, you could use:
	 * container.addChildAt(myShape, container.getChildIndex(otherShape));
	 * // This would also bump otherShape's index up by one. Fails silently if the index is out of range.
	 *
	 * @param {...easeljs.DisplayObject} children The display object(s) to add.
	 * @param {Number} index The index to add the child at.
	 * @return {easeljs.DisplayObject} Returns the last child that was added, or the last child if multiple children were added.
	 */
	addChildAt(...children) {
		const l = children.length;
    if (l === 0) { return null; }
    let index = children.pop();
		if (index < 0 || index > this.children.length) { return children[l - 2]; }
		if (l > 2) {
			for (let i = 0; i < l - 1; i++) { this.addChildAt(children[i], index++); }
			return children[l - 2];
		}
		let child = children[0];
    let parent = child.parent, silent = parent === this;
    parent && parent._removeChildAt(parent.children.indexOf(child), silent);
		child.parent = this;
		this.children.splice(index++, 0, child);
    if (!silent) { child.dispatchEvent("added"); }
		return child;
	}

	/**
	 * Removes the specified child from the display list. Note that it is faster to use removeChildAt() if the index is
	 * already known.
	 *
	 * @example
	 * container.removeChild(child);
	 * // You can also remove multiple children:
	 * container.removeChild(child1, child2, ...);
	 *
	 * @param {...easeljs.DisplayObject} children The display object(s) to remove.
	 * @return {Boolean} true if the child (or children) was removed, or false if it was not in the display list.
	 */
	removeChild(...children) {
		const l = children.length;
    if (l === 0) { return true; }
		if (l > 1) {
			let good = true;
			for (let i = 0; i < l; i++) { good = good && this.removeChild(children[i]); }
			return good;
		}
		return this._removeChildAt(this.children.indexOf(children[0]));
	}

	/**
	 * Removes the child at the specified index from the display list, and sets its parent to null.
	 *
	 * @example
	 * container.removeChildAt(2);
	 * // You can also remove multiple children:
	 * container.removeChildAt(2, 7, ...)
	 *
	 * @param {...Number} indexes The indexes of children to remove.
	 * @return {Boolean} true if the child (or children) was removed, or false if any index was out of range.
	 */
	removeChildAt(...indexes) {
		const l = indexes.length;
    if (l === 0) { return true; }
		if (l > 1) {
			indexes.sort((a, b) => b - a);
			let good = true;
			for (let i = 0; i < l; i++) { good = good && this._removeChildAt(indexes[i]); }
			return good;
		}
		return this._removeChildAt(indexes[0]);
	}

	/**
	 * Removes all children from the display list.
	 */
	removeAllChildren() {
		let kids = this.children;
		while (kids.length) { this._removeChildAt(0); }
	}

	/**
	 * Returns the child at the specified index.
	 * @param {Number} index The index of the child to return.
	 * @return {easeljs.DisplayObject} The child at the specified index. Returns null if there is no child at the index.
	 */
	getChildAt(index) {
		return this.children[index];
	}

	/**
	 * Returns the child with the specified name.
	 * @param {String} name The name of the child to return.
	 * @return {easeljs.DisplayObject} The child with the specified name.
	 */
	getChildByName(name) {
		let kids = this.children;
		const l = kids.length;
		for (let i = 0; i < l; i++) {
			if (kids[i].name === name) { return kids[i]; }
		}
		return null;
	}

	/**
	 * Performs an array sort operation on the child list.
	 *
	 * @example
	 * // Display children with a higher y in front.
	 * container.sortChildren((obj1, obj2, options) => {
	 * 	 if (obj1.y > obj2.y) { return 1; }
	 *   if (obj1.y < obj2.y) { return -1; }
	 *   return 0;
	 * });
	 *
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort}
	 * @param {Function} sortFunction the function to use to sort the child list.
	 */
	sortChildren(sortFunction) {
		this.children.sort(sortFunction);
	}

	/**
	 * Returns the index of the specified child in the display list, or -1 if it is not in the display list.
	 * @param {easeljs.DisplayObject} child The child to return the index of.
	 * @return {Number} The index of the specified child. -1 if the child is not found.
	 */
	getChildIndex(child) {
		return this.children.indexOf(child);
	}

	/**
	 * Swaps the children at the specified indexes. Fails silently if either index is out of range.
	 * @param {Number} index1
	 * @param {Number} index2
	 */
	swapChildrenAt(index1, index2) {
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
	 * @param {easeljs.DisplayObject} child1
	 * @param {easeljs.DisplayObject} child2
	 */
	swapChildren(child1, child2) {
		let kids = this.children;
		const l = kids.length;
		let index1,index2;
		for (var i = 0; i < l; i++) {
			if (kids[i] === child1) { index1 = i; }
			if (kids[i] === child2) { index2 = i; }
			if (index1 != null && index2 != null) { break; }
		}
		if (i === l) { return; } // TODO: throw error?
		kids[index1] = child2;
		kids[index2] = child1;
	}

	/**
	 * Changes the depth of the specified child. Fails silently if the child is not a child of this container, or the index is out of range.
	 * @param {easeljs.DisplayObject} child
	 * @param {Number} index
	 */
	setChildIndex(child, index) {
		let kids = this.children;
		const l = kids.length;
		if (child.parent != this || index < 0 || index >= l) { return; }
		for (var i = 0; i < l; i++) {
			if (kids[i] === child) { break; }
		}
		if (i === l || i === index) { return; }
		kids.splice(i, 1);
		kids.splice(index, 0, child);
	}

	/**
	 * Returns true if the specified display object either is this container or is a descendent (child, grandchild, etc)
	 * of this container.
	 * @param {easeljs.DisplayObject} child The DisplayObject to be checked.
	 * @return {Boolean} true if the specified display object either is this container or is a descendent.
	 */
	contains(child) {
		while (child) {
			if (child === this) { return true; }
			child = child.parent;
		}
		return false;
	}

	/**
	 * Tests whether the display object intersects the specified local point (ie. draws a pixel with alpha > 0 at the
	 * specified position). This ignores the alpha, shadow and compositeOperation of the display object, and all
	 * transform properties including regX/Y.
	 * @param {Number} x The x position to check in the display object's local coordinates.
	 * @param {Number} y The y position to check in the display object's local coordinates.
	 * @return {Boolean} A Boolean indicating whether there is a visible section of a DisplayObject that overlaps the specified
	 * coordinates.
	 */
	hitTest(x, y) {
		// TODO: optimize to use the fast cache check where possible.
		return this.getObjectUnderPoint(x, y) != null;
	}

	/**
	 * Returns an array of all display objects under the specified coordinates that are in this container's display
	 * list. This routine ignores any display objects with {@link easeljs.DisplayObject#mouseEnabled} set to `false`.
	 * The array will be sorted in order of visual depth, with the top-most display object at index 0.
	 * This uses shape based hit detection, and can be an expensive operation to run, so it is best to use it carefully.
	 * For example, if testing for objects under the mouse, test on tick (instead of on {@link easeljs.DisplayObject#event:mousemove}),
	 * and only if the mouse's position has changed.
	 *
	 * <ul>
	 *   <li>By default (mode=0) this method evaluates all display objects.</li>
	 *   <li>By setting the `mode` parameter to `1`, the {@link easeljs.DisplayObject#mouseEnabled}
	 *       and {@link easeljs.DisplayObject#mouseChildren} properties will be respected.</li>
	 *   <li>Setting the `mode` to `2` additionally excludes display objects that do not have active mouse event
	 *       listeners or a {@link easeljs.DisplayObject#cursor} property. That is, only objects
	 *       that would normally intercept mouse interaction will be included. This can significantly improve performance
	 *       in some cases by reducing the number of display objects that need to be tested.</li>
	 * </ul>
	 *
	 * This method accounts for both {@link easeljs.DisplayObject#hitArea} and {@link easeljs.DisplayObject#mask}.
	 *
	 * @param {Number} x The x position in the container to test.
	 * @param {Number} y The y position in the container to test.
	 * @param {Number} [mode=0] The mode to use to determine which display objects to include. 0-all, 1-respect mouseEnabled/mouseChildren, 2-only mouse opaque objects.
	 * @return {Array<easeljs.DisplayObject>} An array of DisplayObjects under the specified coordinates.
	 */
	getObjectsUnderPoint(x, y, mode = 0) {
		let arr = [];
		let pt = this.localToGlobal(x, y);
		this._getObjectsUnderPoint(pt.x, pt.y, arr, mode > 0, mode === 1);
		return arr;
	}

	/**
	 * Similar to {@link easeljs.Container#getObjectsUnderPoint}, but returns only the top-most display
	 * object. This runs significantly faster than `getObjectsUnderPoint()`, but is still potentially an expensive
	 * operation.
	 *
	 * @param {Number} x The x position in the container to test.
	 * @param {Number} y The y position in the container to test.
	 * @param {Number} [mode=0] The mode to use to determine which display objects to include.  0-all, 1-respect mouseEnabled/mouseChildren, 2-only mouse opaque objects.
	 * @return {easeljs.DisplayObject} The top-most display object under the specified coordinates.
	 */
	getObjectUnderPoint(x, y, mode = 0) {
		let pt = this.localToGlobal(x, y);
		return this._getObjectsUnderPoint(pt.x, pt.y, null, mode > 0, mode === 1);
	}

	getBounds() {
		return this._getBounds(null, true);
	}

	getTransformedBounds() {
		return this._getBounds();
	}

	/**
	 * Returns a clone of this Container. Some properties that are specific to this instance's current context are
	 * reverted to their defaults (for example `.parent`).
	 * @param {Boolean} [recursive=false] If true, all of the descendants of this container will be cloned recursively. If false, the
	 * properties of the container will be cloned, but the new instance will not have any children.
	 * @return {easeljs.Container} A clone of the current Container instance.
	 */
	clone(recursive = false) {
		let o = this._cloneProps(new Container());
		if (recursive) { this._cloneChildren(o); }
		return o;
	}

	_tick(evtObj) {
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
	 * @protected
	 * @param {easeljs.Container} o The target container.
	 */
	_cloneChildren(o) {
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
   * Removes the child at the specified index from the display list, and sets its parent to null.
   * Used by `removeChildAt`, `addChild`, and `addChildAt`.
   *
   * @protected
   * @param {Number} index The index of the child to remove.
   * @param {Boolean} [silent=false] Prevents dispatch of `removed` event if true.
   * @return {Boolean} true if the child (or children) was removed, or false if any index was out of range.
   */
	_removeChildAt(index, silent = false) {
		if (index < 0 || index > this.children.length - 1) { return false; }
		let child = this.children[index];
		if (child) { child.parent = null; }
		this.children.splice(index, 1);
		if (!silent) { child.dispatchEvent("removed"); }
		return true;
  }

	/**
	 * @protected
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Array} arr
	 * @param {Boolean} mouse If true, it will respect mouse interaction properties like mouseEnabled, mouseChildren, and active listeners.
	 * @param {Boolean} activeListener If true, there is an active mouse event listener on a parent object.
	 * @param {Number} [currentDepth=0] Indicates the current depth of the search.
	 * @return {easeljs.DisplayObject}
	 */
	_getObjectsUnderPoint(x, y, arr, mouse, activeListener, currentDepth = 0) {
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
	 * @protected
	 * @param {easeljs.DisplayObject} target
	 * @param {Number} x
	 * @param {Number} y
	 * @return {Boolean} Indicates whether the x/y is within the masked region.
	 */
	_testMask(target, x, y) {
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
	 * @protected
	 * @param {easeljs.Matrix2D} matrix
	 * @param {Boolean} ignoreTransform If true, does not apply this object's transform.
	 * @return {easeljs.Rectangle}
	 */
	_getBounds(matrix, ignoreTransform) {
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
