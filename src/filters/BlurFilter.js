/**
 * @license BlurFilter
 * Visit http://createjs.com/ for documentation, updates and examples.
 *
 * Copyright (c) 2017 gskinner.com, inc.
 *
 * BoxBlur Algorithm by Mario Klingemann, quasimondo.com
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
import Rectangle from "../geom/Rectangle";

/**
 * Applies a box blur to DisplayObjects. Note that this filter is fairly CPU intensive, particularly if the quality is
 * set higher than 1.
 *
 * @memberof easeljs
 * @extends easeljs.Filter
 * @example
 * let shape = new Shape().set({x:100,y:100});
 * shape.graphics.beginFill("#ff0000").drawCircle(0,0,50);
 * let blurFilter = new BlurFilter(5, 5, 1);
 * shape.filters = [blurFilter];
 * let bounds = blurFilter.getBounds();
 * shape.cache(-50+bounds.x, -50+bounds.y, 100+bounds.width, 100+bounds.height);
 *
 * @param {Number} [blurX=0] The horizontal blur radius in pixels.
 * @param {Number} [blurY=0] The vertical blur radius in pixels.
 * @param {Number} [quality=1] The number of blur iterations.
 */
export default class BlurFilter extends Filter {

	constructor (blurX = 0, blurY = 0, quality = 1) {
		super();

		/**
		 * @protected
		 * @default 0
		 * @type {Number}
		 */
		this._blurX = blurX;
		/**
		 * @protected
		 * @type {Array}
		 */
		this._blurXTable = [];
		/**
		 * @protected
		 * @type {Number}
		 * @default null
		 */
		this._lastBlurX = null;

		/**
		 * @default 0
		 * @type {Number}
		 */
		this._blurY = blurY;
		/**
		 * @protected
		 * @type {Array}
		 */
		this._blurYTable = [];
		/**
		 * @protected
		 * @type {Number}
		 * @default null
		 */
		this._lastBlurY = null;

		/**
		 * Number of blur iterations. For example, a value of 1 will produce a rough blur. A value of 2 will produce a
		 * smoother blur, but take twice as long to run.
		 * @default 1
		 * @type {Number}
		 */
		this._quality = (isNaN(quality) || quality < 1) ? 1 : quality;
		/**
		 * @protected
		 * @type {Number}
		 * @default null
		 */
		this._lastQuality = null;

		this.FRAG_SHADER_TEMPLATE = `
			uniform float xWeight[{{blurX}}];
			uniform float yWeight[{{blurY}}];
			uniform vec2 textureOffset;
			void main (void) {
				vec4 color = vec4(0.0);

				float xAdj = ({{blurX}}.0-1.0)/2.0;
				float yAdj = ({{blurY}}.0-1.0)/2.0;
				vec2 sampleOffset;

				for(int i=0; i<{{blurX}}; i++) {
					for(int j=0; j<{{blurY}}; j++) {
						sampleOffset = vTextureCoord + (textureOffset * vec2(float(i)-xAdj, float(j)-yAdj));
						color += texture2D(uSampler, sampleOffset) * (xWeight[i] * yWeight[j]);
					}
				}

				gl_FragColor = color.rgba;
			}
		`;
	}

	/**
	 * Horizontal blur radius in pixels.
	 * @type {Number}
	 */
	get blurX () { return this._blurX; }
	set blurX (blurX) {
		if (isNaN(blurX) || blurX < 0) { blurX = 0; }
		this._blurX = blurX;
	}

	/**
	 * Vertical blur radius in pixels.
	 * @type {Number}
	 */
	get blurY () { return this._blurY; }
	set blurY (blurY) {
		if (isNaN(blurY) || blurY < 0) { blurY = 0; }
		this._blurY = blurY;
	}

	/**
	 * Number of blur iterations. For example, a value of 1 will produce a rough blur. A value of 2 will produce a
	 * smoother blur, but take twice as long to run.
	 * @type {Number}
	 */
	get quality () { return this._quality | 0; }
	set quality (quality) {
		if (isNaN(quality) || quality < 0) { quality = 0; }
		this._quality = quality;
	}

	/**
	 * @protected
	 * @type {*}
	 */
	get _buildShader () {
		const xChange = this._lastBlurX !== this._blurX;
		const yChange = this._lastBlurY !== this._blurY;
		const qChange = this._lastQuality !== this._quality;
		if (xChange || yChange || qChange) {
				if (xChange || qChange) { this._blurXTable = this._getTable(this._blurX * this._quality); }
				if (yChange || qChange) { this._blurYTable = this._getTable(this._blurY * this._quality); }
				this._updateShader();
				this._lastBlurX = this._blurX;
				this._lastBlurY = this._blurY;
				this._lastQuality = this._quality;
				return undefined; // force a rebuild
		}
		return this._compiledShader;
	}
	set _builtShader (value) { this._compiledShader = value; }

	shaderParamSetup (gl, stage, shaderProgram) {
		// load the normalized gaussian weight tables
		gl.uniform1fv(
			gl.getUniformLocation(shaderProgram, "xWeight"),
			this._blurXTable
		);
		gl.uniform1fv(
			gl.getUniformLocation(shaderProgram, "yWeight"),
			this._blurYTable
		);

		// what is the size of a single pixel in -1, 1 (webGL) space
		gl.uniform2f(
			gl.getUniformLocation(shaderProgram, "textureOffset"),
			2/(stage._viewportWidth*this._quality), 2/(stage._viewportHeight*this._quality)
		);
	}

	getBounds (rect) {
		let x = this.blurX|0, y = this.blurY| 0;
		if (x <= 0 && y <= 0) { return rect; }
		let q = Math.pow(this.quality, 0.2);
		return (rect || new Rectangle()).pad(y*q+1,x*q+1,y*q+1,x*q+1);
	}

	/**
	 * @return {easeljs.BlurFilter}
	 */
	clone () {
		return new BlurFilter(this.blurX, this.blurY, this.quality);
	}

	_updateShader () {
		let result = this.FRAG_SHADER_TEMPLATE;
		result = result.replace(/{{blurX}}/g, this._blurXTable.length.toFixed(0));
		result = result.replace(/{{blurY}}/g, this._blurYTable.length.toFixed(0));
		this.FRAG_SHADER_BODY = result;
	}

	_getTable (spread) {
		const EDGE = 4.2;
		if (spread <= 1) { return [1]; }

		let result = [];
		let count = Math.ceil(spread*2);
		count += (count%2)?0:1;
		let adjust = (count/2)|0;
		for (let i = -adjust; i<=adjust; i++) {
			let x = (i/adjust)*EDGE;
			result.push(1/Math.sqrt(2*Math.PI) * Math.pow(Math.E, -(Math.pow(x,2)/4)));
		}
		let factor = result.reduce((a, b) => a + b, 0);
		return result.map(currentValue => currentValue / factor);
	}

	_applyFilter (imageData) {
		let radiusX = this._blurX >> 1;
		if (isNaN(radiusX) || radiusX < 0) return false;
		let radiusY = this._blurY >> 1;
		if (isNaN(radiusY) || radiusY < 0) return false;
		if (radiusX === 0 && radiusY === 0) return false;

		let iterations = this.quality;
		if (isNaN(iterations) || iterations < 1) iterations = 1;
		iterations |= 0;
		if (iterations > 3) iterations = 3;
		if (iterations < 1) iterations = 1;

		let px = imageData.data;
		let x=0, y=0, i=0, p=0, yp=0, yi=0, yw=0, r=0, g=0, b=0, a=0, pr=0, pg=0, pb=0, pa=0;

		let divx = (radiusX + radiusX + 1) | 0;
		let divy = (radiusY + radiusY + 1) | 0;
		let w = imageData.width | 0;
		let h = imageData.height | 0;

		let w1 = (w - 1) | 0;
		let h1 = (h - 1) | 0;
		let rxp1 = (radiusX + 1) | 0;
		let ryp1 = (radiusY + 1) | 0;

		let ssx = {r:0,b:0,g:0,a:0};
		let sx = ssx;
		for ( i = 1; i < divx; i++ )
		{
			sx = sx.n = {r:0,b:0,g:0,a:0};
		}
		sx.n = ssx;

		let ssy = {r:0,b:0,g:0,a:0};
		let sy = ssy;
		for ( i = 1; i < divy; i++ )
		{
			sy = sy.n = {r:0,b:0,g:0,a:0};
		}
		sy.n = ssy;

		let si = null;


		let mtx = BlurFilter.MUL_TABLE[radiusX] | 0;
		let stx = BlurFilter.SHG_TABLE[radiusX] | 0;
		let mty = BlurFilter.MUL_TABLE[radiusY] | 0;
		let sty = BlurFilter.SHG_TABLE[radiusY] | 0;

		while (iterations-- > 0) {

			yw = yi = 0;
			let ms = mtx;
			let ss = stx;
			for (y = h; --y > -1;) {
				r = rxp1 * (pr = px[(yi) | 0]);
				g = rxp1 * (pg = px[(yi + 1) | 0]);
				b = rxp1 * (pb = px[(yi + 2) | 0]);
				a = rxp1 * (pa = px[(yi + 3) | 0]);

				sx = ssx;

				for( i = rxp1; --i > -1; )
				{
					sx.r = pr;
					sx.g = pg;
					sx.b = pb;
					sx.a = pa;
					sx = sx.n;
				}

				for( i = 1; i < rxp1; i++ )
				{
					p = (yi + ((w1 < i ? w1 : i) << 2)) | 0;
					r += ( sx.r = px[p]);
					g += ( sx.g = px[p+1]);
					b += ( sx.b = px[p+2]);
					a += ( sx.a = px[p+3]);

					sx = sx.n;
				}

				si = ssx;
				for ( x = 0; x < w; x++ )
				{
					px[yi++] = (r * ms) >>> ss;
					px[yi++] = (g * ms) >>> ss;
					px[yi++] = (b * ms) >>> ss;
					px[yi++] = (a * ms) >>> ss;

					p = ((yw + ((p = x + radiusX + 1) < w1 ? p : w1)) << 2);

					r -= si.r - ( si.r = px[p]);
					g -= si.g - ( si.g = px[p+1]);
					b -= si.b - ( si.b = px[p+2]);
					a -= si.a - ( si.a = px[p+3]);

					si = si.n;

				}
				yw += w;
			}

			ms = mty;
			ss = sty;
			for (x = 0; x < w; x++) {
				yi = (x << 2) | 0;

				r = (ryp1 * (pr = px[yi])) | 0;
				g = (ryp1 * (pg = px[(yi + 1) | 0])) | 0;
				b = (ryp1 * (pb = px[(yi + 2) | 0])) | 0;
				a = (ryp1 * (pa = px[(yi + 3) | 0])) | 0;

				sy = ssy;
				for( i = 0; i < ryp1; i++ )
				{
					sy.r = pr;
					sy.g = pg;
					sy.b = pb;
					sy.a = pa;
					sy = sy.n;
				}

				yp = w;

				for( i = 1; i <= radiusY; i++ )
				{
					yi = ( yp + x ) << 2;

					r += ( sy.r = px[yi]);
					g += ( sy.g = px[yi+1]);
					b += ( sy.b = px[yi+2]);
					a += ( sy.a = px[yi+3]);

					sy = sy.n;

					if( i < h1 )
					{
						yp += w;
					}
				}

				yi = x;
				si = ssy;
				if ( iterations > 0 )
				{
					for ( y = 0; y < h; y++ )
					{
						p = yi << 2;
						px[p+3] = pa =(a * ms) >>> ss;
						if ( pa > 0 )
						{
							px[p]   = ((r * ms) >>> ss );
							px[p+1] = ((g * ms) >>> ss );
							px[p+2] = ((b * ms) >>> ss );
						} else {
							px[p] = px[p+1] = px[p+2] = 0
						}

						p = ( x + (( ( p = y + ryp1) < h1 ? p : h1 ) * w )) << 2;

						r -= si.r - ( si.r = px[p]);
						g -= si.g - ( si.g = px[p+1]);
						b -= si.b - ( si.b = px[p+2]);
						a -= si.a - ( si.a = px[p+3]);

						si = si.n;

						yi += w;
					}
				} else {
					for ( y = 0; y < h; y++ )
					{
						p = yi << 2;
						px[p+3] = pa =(a * ms) >>> ss;
						if ( pa > 0 )
						{
							pa = 255 / pa;
							px[p]   = ((r * ms) >>> ss ) * pa;
							px[p+1] = ((g * ms) >>> ss ) * pa;
							px[p+2] = ((b * ms) >>> ss ) * pa;
						} else {
							px[p] = px[p+1] = px[p+2] = 0
						}

						p = ( x + (( ( p = y + ryp1) < h1 ? p : h1 ) * w )) << 2;

						r -= si.r - ( si.r = px[p]);
						g -= si.g - ( si.g = px[p+1]);
						b -= si.b - ( si.b = px[p+2]);
						a -= si.a - ( si.a = px[p+3]);

						si = si.n;

						yi += w;
					}
				}
			}

		}
		return true;
	}

}

/**
 * Array of multiply values for blur calculations.
 * @type {Array}
 * @protected
 * @readonly
 * @static
 */
BlurFilter.MUL_TABLE = [1, 171, 205, 293, 57, 373, 79, 137, 241, 27, 391, 357, 41, 19, 283, 265, 497, 469, 443, 421, 25, 191, 365, 349, 335, 161, 155, 149, 9, 278, 269, 261, 505, 245, 475, 231, 449, 437, 213, 415, 405, 395, 193, 377, 369, 361, 353, 345, 169, 331, 325, 319, 313, 307, 301, 37, 145, 285, 281, 69, 271, 267, 263, 259, 509, 501, 493, 243, 479, 118, 465, 459, 113, 446, 55, 435, 429, 423, 209, 413, 51, 403, 199, 393, 97, 3, 379, 375, 371, 367, 363, 359, 355, 351, 347, 43, 85, 337, 333, 165, 327, 323, 5, 317, 157, 311, 77, 305, 303, 75, 297, 294, 73, 289, 287, 71, 141, 279, 277, 275, 68, 135, 67, 133, 33, 262, 260, 129, 511, 507, 503, 499, 495, 491, 61, 121, 481, 477, 237, 235, 467, 232, 115, 457, 227, 451, 7, 445, 221, 439, 218, 433, 215, 427, 425, 211, 419, 417, 207, 411, 409, 203, 202, 401, 399, 396, 197, 49, 389, 387, 385, 383, 95, 189, 47, 187, 93, 185, 23, 183, 91, 181, 45, 179, 89, 177, 11, 175, 87, 173, 345, 343, 341, 339, 337, 21, 167, 83, 331, 329, 327, 163, 81, 323, 321, 319, 159, 79, 315, 313, 39, 155, 309, 307, 153, 305, 303, 151, 75, 299, 149, 37, 295, 147, 73, 291, 145, 289, 287, 143, 285, 71, 141, 281, 35, 279, 139, 69, 275, 137, 273, 17, 271, 135, 269, 267, 133, 265, 33, 263, 131, 261, 130, 259, 129, 257, 1];
/**
 * Array of shift values for blur calculations.
 * @type {Array}
 * @protected
 * @static
 */
BlurFilter.SHG_TABLE = [0, 9, 10, 11, 9, 12, 10, 11, 12, 9, 13, 13, 10, 9, 13, 13, 14, 14, 14, 14, 10, 13, 14, 14, 14, 13, 13, 13, 9, 14, 14, 14, 15, 14, 15, 14, 15, 15, 14, 15, 15, 15, 14, 15, 15, 15, 15, 15, 14, 15, 15, 15, 15, 15, 15, 12, 14, 15, 15, 13, 15, 15, 15, 15, 16, 16, 16, 15, 16, 14, 16, 16, 14, 16, 13, 16, 16, 16, 15, 16, 13, 16, 15, 16, 14, 9, 16, 16, 16, 16, 16, 16, 16, 16, 16, 13, 14, 16, 16, 15, 16, 16, 10, 16, 15, 16, 14, 16, 16, 14, 16, 16, 14, 16, 16, 14, 15, 16, 16, 16, 14, 15, 14, 15, 13, 16, 16, 15, 17, 17, 17, 17, 17, 17, 14, 15, 17, 17, 16, 16, 17, 16, 15, 17, 16, 17, 11, 17, 16, 17, 16, 17, 16, 17, 17, 16, 17, 17, 16, 17, 17, 16, 16, 17, 17, 17, 16, 14, 17, 17, 17, 17, 15, 16, 14, 16, 15, 16, 13, 16, 15, 16, 14, 16, 15, 16, 12, 16, 15, 16, 17, 17, 17, 17, 17, 13, 16, 15, 17, 17, 17, 16, 15, 17, 17, 17, 16, 15, 17, 17, 14, 16, 17, 17, 16, 17, 17, 16, 15, 17, 16, 14, 17, 16, 15, 17, 16, 17, 17, 16, 17, 15, 16, 17, 14, 17, 16, 15, 17, 16, 17, 13, 17, 16, 17, 17, 16, 17, 14, 17, 16, 17, 16, 17, 16, 17, 9];
