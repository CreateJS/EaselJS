/**
 * @license Shadow
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
 * This class encapsulates the properties required to define a shadow to apply to a {@link easeljs.DisplayObject}
 * via its `shadow` property.
 *
 * @memberof easeljs
 * @example
 * img.shadow = new Shadow("#000000", 5, 5, 10);
 *
 * @param {String} [color=black] The color of the shadow. This can be any valid CSS color value.
 * @param {Number} [offsetX=0] The x offset of the shadow in pixels.
 * @param {Number} [offsetY=0] The y offset of the shadow in pixels.
 * @param {Number} [blur=0] The size of the blurring effect.
 */
export default class Shadow {

	constructor (color = "black", offsetX = 0, offsetY = 0, blur = 0) {
		/**
		 * The color of the shadow. This can be any valid CSS color value.
		 * @type {String}
		 * @default black
		 */
		this.color = color;

		/**
		 * The x offset of the shadow.
		 * @type {Number}
		 * @default 0
		 */
		this.offsetX = offsetX;

		/**
		 * The y offset of the shadow.
		 * @type {Number}
		 * @default 0
		 */
		this.offsetY = offsetY;

		/**
		 * The blur of the shadow.
		 * @type {Number}
		 * @default 0
		 */
		this.blur = blur;
	}

	/**
	 * Returns a string representation of this object.
	 * @return {String}
	 */
	toString () {
		return `[${this.constructor.name}]`;
	}

	/**
	 * Returns a clone of this Shadow instance.
	 * @return {Shadow} A clone of the current Shadow instance.
	 */
	clone () {
		return new Shadow(this.color, this.offsetX, this.offsetY, this.blur);
	}

}

/**
 * An identity shadow object (all properties are set to 0).
 * @type {easeljs.Shadow}
 * @static
 * @readonly
 */
Shadow.identity = new Shadow("transparent");
