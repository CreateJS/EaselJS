/**
 * @license ColorFilter
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

import Filter from "./Filter";

/**
 * Applies a color transform to DisplayObjects.
 *
 * @memberof easeljs
 * @extends easeljs.Filter
 * @example
 * let shape = new Shape().set({ x: 100, y: 100 });
 * shape.graphics.beginFill("#ff0000").drawCircle(0,0,50);
 * shape.filters = [ new ColorFilter(0,0,0,1, 0,0,255,0) ];
 * shape.cache(-50, -50, 100, 100);
 *
 * @param {Number} [redMultiplier=1] The amount to multiply against the red channel. This is a range between 0 and 1.
 * @param {Number} [greenMultiplier=1] The amount to multiply against the green channel. This is a range between 0 and 1.
 * @param {Number} [blueMultiplier=1] The amount to multiply against the blue channel. This is a range between 0 and 1.
 * @param {Number} [alphaMultiplier=1] The amount to multiply against the alpha channel. This is a range between 0 and 1.
 * @param {Number} [redOffset=0] The amount to add to the red channel after it has been multiplied. This is a range
 * between -255 and 255.
 * @param {Number} [greenOffset=0] The amount to add to the green channel after it has been multiplied. This is a range
 * between -255 and 255.
 * @param {Number} [blueOffset=0] The amount to add to the blue channel after it has been multiplied. This is a range
 * between -255 and 255.
 * @param {Number} [alphaOffset=0] The amount to add to the alpha channel after it has been multiplied. This is a range
 * between -255 and 255.
 */
export default class ColorFilter extends Filter {

	constructor (redMultiplier = 1, greenMultiplier = 1, blueMultiplier = 1, alphaMultiplier = 1, redOffset = 0, greenOffset = 0, blueOffset = 0, alphaOffset = 0) {
		super();

		/**
		 * Red channel multiplier.
		 * @type {Number}
		 */
		this.redMultiplier = redMultiplier;

		/**
		 * Green channel multiplier.
		 * @type {Number}
		 */
		this.greenMultiplier = greenMultiplier;

		/**
		 * Blue channel multiplier.
		 * @type {Number}
		 */
		this.blueMultiplier = blueMultiplier;

		/**
		 * Alpha channel multiplier.
		 * @type {Number}
		 */
		this.alphaMultiplier = alphaMultiplier;

		/**
		 * Red channel offset (added to value).
		 * @type {Number}
		 */
		this.redOffset = redOffset;

		/**
		 * Green channel offset (added to value).
		 * @type {Number}
		 */
		this.greenOffset = greenOffset;

		/**
		 * Blue channel offset (added to value).
		 * @type {Number}
		 */
		this.blueOffset = blueOffset;

		/**
		 * Alpha channel offset (added to value).
		 * @type {Number}
		 */
		this.alphaOffset = alphaOffset;

		this.FRAG_SHADER_BODY = `
			uniform vec4 uColorMultiplier;
			uniform vec4 uColorOffset;

			void main (void) {
				vec4 color = texture2D(uSampler, vTextureCoord);

				color = clamp(vec4(0.0), vec4(1.0), vec4(vec3(color.rgb / color.a), color.a));
				color = clamp(vec4(0.0), vec4(1.0), color * uColorMultiplier + uColorOffset);
				gl_FragColor = vec4(color.rgb * color.a, color.a);
			}
		`;

	}

	shaderParamSetup (gl, stage, shaderProgram) {
		gl.uniform4f(
			gl.getUniformLocation(shaderProgram, "uColorMultiplier"),
			this.redMultiplier, this.greenMultiplier, this.blueMultiplier, this.alphaMultiplier
		);

		gl.uniform4f(
			gl.getUniformLocation(shaderProgram, "uColorOffset"),
			this.redOffset/255, this.greenOffset/255, this.blueOffset/255, this.alphaOffset/255
		);
	}

	/**
	 * @return {easeljs.ColorFilter}
	 */
	clone () {
		return new ColorFilter(
			this.redMultiplier, this.greenMultiplier, this.blueMultiplier, this.alphaMultiplier,
			this.redOffset, this.greenOffset, this.blueOffset, this.alphaOffset
		);
	}

	_applyFilter (imageData) {
		let data = imageData.data;
		const l = data.length;
		for (let i=0; i<l; i+=4) {
			data[i] = data[i]*this.redMultiplier+this.redOffset;
			data[i+1] = data[i+1]*this.greenMultiplier+this.greenOffset;
			data[i+2] = data[i+2]*this.blueMultiplier+this.blueOffset;
			data[i+3] = data[i+3]*this.alphaMultiplier+this.alphaOffset;
		}
		return true;
	}

}
