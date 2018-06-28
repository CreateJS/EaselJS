/**
 * @license AlphaMapFilter
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
 * Applies a greyscale alpha map image (or canvas) to the target, such that the alpha channel of the result will
 * be copied from the red channel of the map, and the RGB channels will be copied from the target.
 *
 * Generally, it is recommended that you use {@link easeljs.AlphaMaskFilter}, because it has much better performance.
 *
 * @memberof easeljs
 * @extends easeljs.Filter
 * @example *
 * let box = new Shape();
 * box.graphics.beginLinearGradientFill(["#ff0000", "#0000ff"], [0, 1], 0, 0, 0, 100)
 * box.graphics.drawRect(0, 0, 100, 100);
 * box.cache(0, 0, 100, 100);
 * let bmp = new Bitmap("path/to/image.jpg");
 * bmp.filters = [ new AlphaMapFilter(box.cacheCanvas) ];
 * bmp.cache(0, 0, 100, 100);
 *
 * @param {HTMLImageElement | HTMLCanvasElement} alphaMap The greyscale image (or canvas) to use as the alpha value for the
 * result. This should be exactly the same dimensions as the target.
 */
export default class AlphaMapFilter extends Filter {

	constructor (alphaMap) {
		super();

		/**
		 * The greyscale image (or canvas) to use as the alpha value for the result. This should be exactly the same
		 * dimensions as the target.
		 * @type {HTMLImageElement | HTMLCanvasElement}
		 */
		this.alphaMap = alphaMap;

		/**
		 * @protected
		 * @type {HTMLImageElement | HTMLCanvasElement}
		 * @default null
		 */
		this._alphaMap = null;

		/**
		 * @protected
		 * @type {Uint8ClampedArray}
		 * @default null
		 */
		this._mapData = null;

		/**
		 * @protected
		 * @type {*}
		 * @default null
		 */
		this._mapTexture = null;

		this.FRAG_SHADER_BODY = `
			uniform sampler2D uAlphaSampler;

			void main (void) {
				vec4 color = texture2D(uSampler, vRenderCoord);
				vec4 alphaMap = texture2D(uAlphaSampler, vTextureCoord);

				// some image formats can have transparent white rgba(1,1,1, 0) when put on the GPU, this means we need a slight tweak
				// using ceil ensure that the colour will be used so long as it exists but pure transparency will be treated black
				gl_FragColor = vec4(color.rgb, color.a * (alphaMap.r * ceil(alphaMap.a)));
			}
		`;
	}

	/**
	 * @todo docs
	 * @param {*} gl
	 * @param {*} stage
	 * @param {*} shaderProgram
	 */
	shaderParamSetup (gl, stage, shaderProgram) {
		if (!this._mapTexture) { this._mapTexture = gl.createTexture(); }

		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, this._mapTexture);
		stage.setTextureParams(gl);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.alphaMap);

		gl.uniform1i(
			gl.getUniformLocation(shaderProgram, "uAlphaSampler"),
			1
		);
	}

	/**
	 * @return {easeljs.AlphaMapFilter}
	 */
	clone () {
		let o = new AlphaMapFilter(this.alphaMap);
		o._alphaMap = this._alphaMap;
		o._mapData = this._mapData;
		return o;
	}

	_applyFilter (imageData) {
		if (!this.alphaMap) { return true; }
		if (!this._prepAlphaMap()) { return false; }

		// TODO: update to support scenarios where the target has different dimensions.
		let data = imageData.data;
		let map = this._mapData;
		const l = data.length;
		for (let i=0; i<l; i += 4) { data[i + 3] = map[i] || 0; }

		return true;
	}

	/**
	 * @protected
	 */
	_prepAlphaMap () {
		if (!this.alphaMap) { return false; }
		if (this.alphaMap === this._alphaMap && this._mapData) { return true; }
		this._mapData = null;

		let map = this._alphaMap = this.alphaMap;
		let canvas = map;
		let ctx;
		if (map instanceof HTMLCanvasElement) {
			ctx = canvas.getContext("2d");
		} else {
			canvas = window.createjs && createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas");
			canvas.width = map.width;
			canvas.height = map.height;
			ctx = canvas.getContext("2d");
			ctx.drawImage(map, 0, 0);
		}

		try {
			this._mapData = ctx.getImageData(0, 0, map.width, map.height).data
			return true;
		} catch (e) {
			//if (!this.suppressCrossDomainErrors) throw new Error("unable to access local image data: " + e);
			return false;
		}
	}

}
