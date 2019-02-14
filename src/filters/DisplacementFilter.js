/**
 * DisplacementFilter
 * Visit http://createjs.com/ for documentation, updates and examples.
 *
 * Copyright (c) 2019 gskinner.com, inc.
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
 *
 * @license
 */

import Filter from "./Filter";

/**
 * Distorts portions of the image, creates effects like computer glitches, bulge/pinch, and pond ripples. This filter
 * Uses a reference image/canvas and interprets its r/g channels as a displacement map. A displacement map species
 * how far from the original pixel the output pixel should be taken from.
 *
 * Painting a displacement map means understanding how the r/g channel are interpreted. The red channel changes
 * how far in the x to sample, and the green changes how far in the y to sample. The maximum range is -distance to
 * +distance ('distance' being the distance value on the filter instance). This maps to the 0-255 color space for
 * each channel. This means that for an image to experience no change it should be painted #808000 as that is in the
 * middle for both the x and the y displacements.
 * <ul>
 *     <li>Red values smaller than 0x80 sample from further left, and larger than 0x80 sample form further right.</li>
 *     <li>Green values smaller than 0x80 sample from higher up, and larger than 0x80 sample form lower down.</li>
 * </ul>
 * The output vs input can take some getting used to so experiment! As a tip: when painting to a canvas that
 * will act as displacement map, consider using the blend mode of "overlay" or "softlight". These blend modes
 * will preserve mid tones (no displacement) while still mixing the high and low values as you might need per channel.
 *
 * @memberof easeljs
 * @extends extends.Filter
 */
export default class DisplacementFilter extends Filter {

	/**
	 * @param {HTMLImageElement|HTMLCanvasElement|WebGLTexture} dudvMap The horizontal blur radius in pixels.
   * @param {Number} [distance=0] The absolute value of the maximum possible displacement from the original pixel.
	 */
	constructor(dudvMap, distance = 128) {
		super();

		if (!Filter.isValidImageSource(dudvMap)) {
			throw "Must provide valid image source for displacement map, see Filter.isValidImageSource";
		}

		/**
		 * The visual source to fetch the displacement map from.
		 * @type {Image|HTMLCanvasElement}
		 */
		this.dudvMap = dudvMap;

		/**
		 * The absolute value of the maximum shift in x/y possible.
		 * @type {Number}
		 * @default 128
		 */
		this.distance = Number(distance);
		if (isNaN(this.distance)) { this.distance = 128; }

		this.FRAG_SHADER_BODY = (
			"uniform sampler2D uDudvSampler;"+
			"uniform float fPower;" +
			"uniform vec2 pixelAdjustment;" +

			"void main(void) {" +
				"vec4 dudvValue = texture2D(uDudvSampler, vTextureCoord);" +
				"vec2 sampleOffset = mix(vec2(0.0), dudvValue.rg-0.5, dudvValue.a) * (fPower*pixelAdjustment);" +
				"gl_FragColor = texture2D(uSampler, vTextureCoord + sampleOffset);" +
			"}"
		);

		if (dudvMap instanceof WebGLTexture) {
			this._mapTexture = dudvMap;
		} else if (dudvMap instanceof HTMLCanvasElement) {
			this._dudvCanvas = dudvMap;
			this._dudvCtx = dudvMap.getContext("2d");
		} else {
			const canvas = this._dudvCanvas = createCanvas(dudvMap.width, dudvMap.height);
			(this._dudvCtx = canvas.getContext("2d")).drawImage(dudvMap, 0, 0);
		}
	}

	/**
	 * @param {} gl
	 * @param {} stage
	 * @param {} shaderProgram
	 */
	shaderParamSetup(gl, stage, shaderProgram) {
		if (!this._mapTexture) { this._mapTexture = gl.createTexture(); }

		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, this._mapTexture);
		stage.setTextureParams(gl);
		if (this.dudvMap !== this._mapTexture) {
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.dudvMap);
		}

		gl.uniform1i(
			gl.getUniformLocation(shaderProgram, "uDudvSampler"),
			1
		);

		gl.uniform1f(
			gl.getUniformLocation(shaderProgram, "fPower"),
			this.distance
		);

		gl.uniform2f( //this is correct as the color maps to -0.5,0.5. This compounds the pixel delta, thus 2/size
			gl.getUniformLocation(shaderProgram, "pixelAdjustment"),
			2 / stage._viewportWidth, -2 / stage._viewportHeight
		);
	}

	/**
	 * @param {} imageData
	 * @return {Boolean}
	 */
	_applyFilter(imageData) {
		// as we're reaching across pixels we need an unmodified clone of the source
		// slice/from/map/filter don't work correctly in IE11 and subarray creates a ref
		let refArray, refArraySrc = imageData.data;
		if (refArraySrc.slice !== undefined) {
			refArray = refArraySrc.slice();
		} else {
			refArray = new Uint8ClampedArray(refArraySrc.length);
			refArray.set(refArraySrc);
		}

		const outArray = imageData.data;
		const width = imageData.width;
		const height = imageData.height;
		let rowOffset, pixelStart;

		const sampleData = this._dudvCtx.getImageData(0, 0, this.dudvMap.width, this.dudvMap.height);
		const sampleArray = sampleData.data;
		const sampleWidth = sampleData.width;
		const sampleHeight = sampleData.height;
		let sampleRowOffset, samplePixelStart;

		const widthRatio = sampleWidth/width;
		const heightRatio = sampleHeight/height;
		const pxRange = 1 / 255;

		// performance optimizing lookup
		const distance = this.distance * 2;

		// the x and y need to stretch separately, nesting the for loops simplifies this logic even if the array is flat
		for (let i = 0; i < height; i++) {
			rowOffset = i * width;
			sampleRowOffset = ((i * heightRatio) | 0) * sampleWidth;

			// the arrays are int arrays, so a single pixel is [r,g,b,a, ...],so calculate the start of the pixel
			for (let j = 0; j < width; j++) {
				pixelStart = (rowOffset + j) * 4;
				samplePixelStart = (sampleRowOffset + ((j * widthRatio) | 0)) * 4;

				// modify the pixels
				const deltaPower = sampleArray[samplePixelStart+3] * pxRange * distance;
				let xDelta = ((sampleArray[samplePixelStart] * pxRange - 0.5) * deltaPower) | 0;
				let yDelta = ((sampleArray[samplePixelStart + 1] * pxRange - 0.5) * deltaPower) | 0;

				if (j + xDelta < 0) { xDelta = -j; }
				if (j + xDelta > width) { xDelta = width - j; }
				if (i + yDelta < 0) { yDelta = -i; }
				if (i + yDelta > height) { yDelta = height - i; }

				const targetPixelStart = (pixelStart + xDelta * 4) + yDelta * 4 * width;
				outArray[pixelStart] = refArray[targetPixelStart];
				outArray[pixelStart + 1] = refArray[targetPixelStart + 1];
				outArray[pixelStart + 2] = refArray[targetPixelStart + 2];
				outArray[pixelStart + 3] = refArray[targetPixelStart + 3];
			}
		}

		return true;
	}

}
