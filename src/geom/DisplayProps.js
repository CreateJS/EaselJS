/**
 * @license DisplayProps
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

import Matrix2D from "./Matrix2D";

/**
 * Used for calculating and encapsulating display related properties.
 * @memberof easeljs
 * @param {Number} [visible] Visible value.
 * @param {Number} [alpha] Alpha value.
 * @param {Number} [shadow] A Shadow instance or null.
 * @param {Number} [compositeOperation] A compositeOperation value or null.
 * @param {Number} [matrix] A transformation matrix. Defaults to a new identity matrix.
 */
export default class DisplayProps {

	constructor (visible, alpha, shadow, compositeOperation, matrix) {
		this.setValues(visible, alpha, shadow, compositeOperation, matrix);

		// assigned in the setValues method.
		/**
		 * Property representing the alpha that will be applied to a display object.
		 * @property alpha
		 * @type {Number}
		 */

		/**
		 * Property representing the shadow that will be applied to a display object.
		 * @property shadow
		 * @type {easeljs.Shadow}
		 */

		/**
		 * Property representing the compositeOperation that will be applied to a display object.
		 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Compositing}
		 * @property compositeOperation
		 * @type {String}
		 */

		/**
		 * Property representing the value for visible that will be applied to a display object.
		 * @property visible
		 * @type {Boolean}
		 */

		/**
		 * The transformation matrix that will be applied to a display object.
		 * @property matrix
		 * @type {easeljs.Matrix2D}
		 */
	}

	/**
	 * Reinitializes the instance with the specified values.
	 * @param {Number} [visible=true] Visible value.
	 * @param {Number} [alpha=1] Alpha value.
	 * @param {Number} [shadow] A Shadow instance or null.
	 * @param {Number} [compositeOperation] A compositeOperation value or null.
	 * @param {Number} [matrix] A transformation matrix. Defaults to an identity matrix.
	 * @return {easeljs.DisplayProps} This instance. Useful for chaining method calls.
	 * @chainable
	*/
	setValues (visible = true, alpha = 1, shadow, compositeOperation, matrix) {
		this.visible = visible;
		this.alpha = alpha;
		this.shadow = shadow;
		this.compositeOperation = compositeOperation;
		this.matrix = matrix || (this.matrix&&this.matrix.identity()) || new Matrix2D();
		return this;
	}

	/**
	 * Appends the specified display properties. This is generally used to apply a child's properties its parent's.
	 * @param {Boolean} visible desired visible value
	 * @param {Number} alpha desired alpha value
	 * @param {easeljs.Shadow} shadow desired shadow value
	 * @param {String} compositeOperation desired composite operation value
	 * @param {easeljs.Matrix2D} [matrix] a Matrix2D instance
	 * @return {easeljs.DisplayProps} This instance. Useful for chaining method calls.
	 * @chainable
	*/
	append (visible, alpha, shadow, compositeOperation, matrix) {
		this.alpha *= alpha;
		this.shadow = shadow || this.shadow;
		this.compositeOperation = compositeOperation || this.compositeOperation;
		this.visible = this.visible && visible;
		matrix&&this.matrix.appendMatrix(matrix);
		return this;
	}

	/**
	 * Prepends the specified display properties. This is generally used to apply a parent's properties to a child's.
	 * For example, to get the combined display properties that would be applied to a child, you could use:
	 *
	 * @example
	 * let o = displayObject;
	 * let props = new DisplayProps();
	 * do {
	 * 	 // prepend each parent's props in turn:
	 * 	 props.prepend(o.visible, o.alpha, o.shadow, o.compositeOperation, o.getMatrix());
	 * } while (o = o.parent);
	 *
	 * @param {Boolean} visible desired visible value
	 * @param {Number} alpha desired alpha value
	 * @param {easeljs.Shadow} shadow desired shadow value
	 * @param {String} compositeOperation desired composite operation value
	 * @param {easeljs.Matrix2D} [matrix] a Matrix2D instance
	 * @return {easeljs.DisplayProps} This instance. Useful for chaining method calls.
	 * @chainable
	*/
	prepend (visible, alpha, shadow, compositeOperation, matrix) {
		this.alpha *= alpha;
		this.shadow = this.shadow || shadow;
		this.compositeOperation = this.compositeOperation || compositeOperation;
		this.visible = this.visible && visible;
		matrix&&this.matrix.prependMatrix(matrix);
		return this;
	}

	/**
	 * Resets this instance and its matrix to default values.
	 * @return {easeljs.DisplayProps} This instance. Useful for chaining method calls.
	 * @chainable
	*/
	identity () {
		this.visible = true;
		this.alpha = 1;
		this.shadow = this.compositeOperation = null;
		this.matrix.identity();
		return this;
	}

	/**
	 * Returns a clone of the DisplayProps instance. Clones the associated matrix.
	 * @return {easeljs.DisplayProps} a clone of the DisplayProps instance.
	 */
	clone () {
		return new DisplayProps(this.alpha, this.shadow, this.compositeOperation, this.visible, this.matrix.clone());
	}

}
