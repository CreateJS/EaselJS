/**
 * @license Shape
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
import Graphics from "./Graphics";

/**
 * A Shape allows you to display vector art in the display list. It composites a {@link easeljs.Graphics}
 * instance which exposes all of the vector drawing methods. The Graphics instance can be shared between multiple Shape
 * instances to display the same vector graphics with different positions or transforms.
 *
 * If the vector art will not change between draws, you may want to use the {@link easeljs.DisplayObject#cache}
 * method to reduce the rendering cost.
 *
 * @memberof easeljs
 * @example
 * var graphics = new Graphics().beginFill("#ff0000").drawRect(0, 0, 100, 100);
 * var shape = new Shape(graphics);
 * // Alternatively use can also use the graphics property of the Shape class to renderer the same as above.
 * var shape = new Shape();
 * shape.graphics.beginFill("#ff0000").drawRect(0, 0, 100, 100);
 *
 * @extends easeljs.DisplayObject
 * @param {easeljs.Graphics} [graphics] The graphics instance to display. If null, a new Graphics instance will be created.
 */
export default class Shape extends DisplayObject {

	constructor (graphics = new Graphics()) {
		super();

		/**
		 * The graphics instance to display.
		 * @type {easeljs.Graphics}
		 */
		this.graphics = graphics;
	}

	isVisible () {
		let hasContent = this.cacheCanvas || (this.graphics && !this.graphics.isEmpty());
		return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent);
	}

	draw (ctx, ignoreCache = false) {
		if (super.draw(ctx, ignoreCache)) { return true; }
		this.graphics.draw(ctx, this);
		return true;
	}

	/**
	 * Returns a clone of this Shape. Some properties that are specific to this instance's current context are reverted to
	 * their defaults (for example .parent).
	 * @override
	 * @param {Boolean} [recursive=false] If true, this Shape's {@link easeljs.Graphics} instance will also be
	 * cloned. If false, the Graphics instance will be shared with the new Shape.
	 */
	clone (recursive = false) {
		let g = (recursive && this.graphics) ? this.graphics.clone() : this.graphics;
		return this._cloneProps(new Shape(g));
	}

}
