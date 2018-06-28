/**
 * @license Rectangle
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

/**
 * Represents a rectangle as defined by the points (x, y) and (x+width, y+height).
 * Used by {@link easeljs.DisplayObjects#getBounds}.
 *
 * @memberof easeljs
 * @example
 * let rect = new Rectangle(0, 0, 100, 100);
 *
 * @param {Number} [x] X position.
 * @param {Number} [y] Y position.
 * @param {Number} [width] The width of the Rectangle.
 * @param {Number} [height] The height of the Rectangle.
 */
export default class Rectangle {

	constructor (x, y, width, height) {
		this.setValues(x, y, width, height);

		// assigned in the setValues method.
		/**
		 * X position.
		 * @property x
		 * @type {Number}
		 */

		/**
		 * Y position.
		 * @property y
		 * @type {Number}
		 */

		/**
		 * Width.
		 * @property width
		 * @type {Number}
		 */

		/**
		 * Height.
		 * @property height
		 * @type {Number}
		 */
	}

	/**
	 * Sets the specified values on this instance.
	 * @param {Number} [x=0] X position.
	 * @param {Number} [y=0] Y position.
	 * @param {Number} [width=0] The width of the Rectangle.
	 * @param {Number} [height=0] The height of the Rectangle.
	 * @return {easeljs.Rectangle} This instance. Useful for chaining method calls.
	 * @chainable
	*/
	setValues (x = 0, y = 0, width = 0, height = 0) {
		// don't forget to update docs in the constructor if these change:
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		return this;
	}

	/**
	 * Extends the rectangle's bounds to include the described point or rectangle.
	 * @param {Number} x X position of the point or rectangle.
	 * @param {Number} y Y position of the point or rectangle.
	 * @param {Number} [width=0] The width of the rectangle.
	 * @param {Number} [height=0] The height of the rectangle.
	 * @return {easeljs.Rectangle} This instance. Useful for chaining method calls.
	 * @chainable
	*/
	extend (x, y, width = 0, height = 0) {
		if (x+width > this.x+this.width) { this.width = x+width-this.x; }
		if (y+height > this.y+this.height) { this.height = y+height-this.y; }
		if (x < this.x) { this.width += this.x-x; this.x = x; }
		if (y < this.y) { this.height += this.y-y; this.y = y; }
		return this;
	}

	/**
	 * Adds the specified padding to the rectangle's bounds.
	 * @param {Number} top
	 * @param {Number} left
	 * @param {Number} bottom
	 * @param {Number} right
	 * @return {easeljs.Rectangle} This instance. Useful for chaining method calls.
	 * @chainable
	*/
	pad (top, left, bottom, right) {
		this.x -= left;
		this.y -= top;
		this.width += left+right;
		this.height += top+bottom;
		return this;
	}

	/**
	 * Copies all properties from the specified rectangle to this rectangle.
	 * @param {easeljs.Rectangle} rectangle The rectangle to copy properties from.
	 * @return {easeljs.Rectangle} This rectangle. Useful for chaining method calls.
	 * @chainable
	*/
	copy (rect) {
		return this.setValues(rect.x, rect.y, rect.width, rect.height);
	}

	/**
	 * Returns true if this rectangle fully encloses the described point or rectangle.
	 * @param {Number} x X position of the point or rectangle.
	 * @param {Number} y Y position of the point or rectangle.
	 * @param {Number} [width=0] The width of the rectangle.
	 * @param {Number} [height=0] The height of the rectangle.
	 * @return {Boolean} True if the described point or rectangle is contained within this rectangle.
	*/
	contains (x, y, width = 0, height = 0) {
		return (x >= this.x && x+width <= this.x+this.width && y >= this.y && y+height <= this.y+this.height);
	}

	/**
	 * Returns a new rectangle which contains this rectangle and the specified rectangle.
	 * @param {easeljs.Rectangle} rect The rectangle to calculate a union with.
	 * @return {easeljs.Rectangle} A new rectangle describing the union.
	*/
	union (rect) {
		return this.clone().extend(rect.x, rect.y, rect.width, rect.height);
	}

	/**
	 * Returns a new rectangle which describes the intersection (overlap) of this rectangle and the specified rectangle,
	 * or null if they do not intersect.
	 * @param {easeljs.Rectangle} rect The rectangle to calculate an intersection with.
	 * @return {easeljs.Rectangle} A new rectangle describing the intersection or null.
	*/
	intersection (rect) {
		let x1 = rect.x, y1 = rect.y, x2 = x1+rect.width, y2 = y1+rect.height;
		if (this.x > x1) { x1 = this.x; }
		if (this.y > y1) { y1 = this.y; }
		if (this.x + this.width < x2) { x2 = this.x + this.width; }
		if (this.y + this.height < y2) { y2 = this.y + this.height; }
		return (x2 <= x1 || y2 <= y1) ? null : new Rectangle(x1, y1, x2-x1, y2-y1);
	}

	/**
	 * Returns true if the specified rectangle intersects (has any overlap) with this rectangle.
	 * @param {easeljs.Rectangle} rect The rectangle to compare.
	 * @return {Boolean} True if the rectangles intersect.
	*/
	intersects (rect) {
		return (rect.x <= this.x+this.width && this.x <= rect.x+rect.width && rect.y <= this.y+this.height && this.y <= rect.y + rect.height);
	}

	/**
	 * Returns true if the width or height are equal or less than 0.
	 * @return {Boolean} True if the rectangle is empty.
	*/
	isEmpty () {
		return this.width <= 0 || this.height <= 0;
	}

	/**
	 * Returns a clone of the Rectangle instance.
	 * @return {easeljs.Rectangle} a clone of the Rectangle instance.
	 */
	clone () {
		return new Rectangle(this.x, this.y, this.width, this.height);
	}

	/**
	 * Returns a string representation of this object.
	 * @return {String} a string representation of the instance.
	 */
	toString () {
		return `[${this.constructor.name} (x=${this.x} y=${this.y} width=${this.width} height=${this.height})]`;
	}

}
