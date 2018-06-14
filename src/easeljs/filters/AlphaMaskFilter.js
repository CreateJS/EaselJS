/*
 * AlphaMaskFilter
 * Visit http://createjs.com/ for documentation, updates and examples.
 *
 * Copyright (c) 2010 gskinner.com, inc.
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
 * @module EaselJS
 */

// namespace:
this.createjs = this.createjs || {};

(function () {
	"use strict";


// constructor:
	/**
	 * Applies the alpha from the mask image (or canvas) to the target, such that the alpha channel of the result will
	 * be derived from the mask, and the RGB channels will be copied from the target. This can be used, for example, to
	 * apply an alpha mask to a display object. This can also be used to combine a JPG compressed RGB image with a PNG32
	 * alpha mask, which can result in a much smaller file size than a single PNG32 containing ARGB.
	 *
	 * <b>IMPORTANT NOTE: This filter currently does not support the targetCtx, or targetX/Y parameters correctly.</b>
	 *
	 * <h4>Example</h4>
	 * This example draws a gradient box, then caches it and uses the "cacheCanvas" as the alpha mask on a 100x100 image.
	 *
	 *      var box = new createjs.Shape();
	 *      box.graphics.beginLinearGradientFill(["#000000", "rgba(0, 0, 0, 0)"], [0, 1], 0, 0, 100, 100)
	 *      box.graphics.drawRect(0, 0, 100, 100);
	 *      box.cache(0, 0, 100, 100);
	 *
	 *      var bmp = new createjs.Bitmap("path/to/image.jpg");
	 *      bmp.filters = [
	 *          new createjs.AlphaMaskFilter(box.cacheCanvas)
	 *      ];
	 *      bmp.cache(0, 0, 100, 100);
	 *
	 * See {{#crossLink "Filter"}}{{/crossLink}} for more information on applying filters.
	 * @class AlphaMaskFilter
	 * @extends Filter
	 * @constructor
	 * @param {HTMLImageElement|HTMLCanvasElement|WebGLTexture} mask
	 **/
	function AlphaMaskFilter(mask) {
		this.Filter_constructor();

		if (!createjs.Filter.isValidImageSource(mask)) {
			throw "Must provide valid image source for alpha mask, see Filter.isValidImageSource";
		}

	// public properties:
		/**
		 * The image (or canvas) to use as the mask.
		 * @property mask
		 * @type HTMLImageElement|HTMLCanvasElement
		 **/
		this.mask = mask;

		// Docced in superclass
		this.usesContext = true;

		this.FRAG_SHADER_BODY = (
			"uniform sampler2D uAlphaSampler;"+

			"void main(void) {" +
				"vec4 color = texture2D(uSampler, vTextureCoord);" +
				"vec4 alphaMap = texture2D(uAlphaSampler, vTextureCoord);" +

				"gl_FragColor = vec4(color.rgb * alphaMap.a, color.a * alphaMap.a);" +
			"}"
		);
	}
	var p = createjs.extend(AlphaMaskFilter, createjs.Filter);

	// TODO: deprecated
	// p.initialize = function() {}; // searchable for devs wondering where it is. REMOVED. See docs for details.

	// Docced in superclass
	p.shaderParamSetup = function(gl, stage, shaderProgram) {
		if(!this._mapTexture) { this._mapTexture = gl.createTexture(); }

		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, this._mapTexture);
		stage.setTextureParams(gl);
		if (this.mask !== this._mapTexture) {
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.mask);
		}

		gl.uniform1i(
			gl.getUniformLocation(shaderProgram, "uAlphaSampler"),
			1
		);
	};

// public methods:
	/**
	 * Applies the filter to the specified context.
	 *
	 * <strong>IMPORTANT NOTE: This filter currently does not support the targetCtx, or targetX/Y parameters
	 * correctly.</strong>
	 * @method applyFilter
	 * @param {CanvasRenderingContext2D} ctx The 2D context to use as the source.
	 * @param {Number} x The x position to use for the source rect.
	 * @param {Number} y The y position to use for the source rect.
	 * @param {Number} width The width to use for the source rect.
	 * @param {Number} height The height to use for the source rect.
	 * @param {CanvasRenderingContext2D} [targetCtx] The 2D context to draw the result to. Defaults to the context passed to ctx.
	 * @return {Boolean} If the filter was applied successfully.
	 **/
	p.applyFilter = function (ctx, x, y, width, height, targetCtx) {
		if (!this.mask) { return true; }

		if (targetCtx === undefined) { targetCtx = ctx; }
		if (targetCtx !== ctx) {
			targetCtx.drawImage(ctx.canvas,
				0, 0, ctx.canvas.width, ctx.canvas.height,
				0, 0, targetCtx.canvas.width, targetCtx.canvas.height
			);
		}

		targetCtx.save();

		targetCtx.globalCompositeOperation = "destination-in";
		targetCtx.drawImage(this.mask, 0,0, this.mask.width,this.mask.height, x,y, width,height);

		targetCtx.restore();
		return true;
	};

	// Docced in superclass
	p.clone = function () {
		return new AlphaMaskFilter(this.mask);
	};

	// Docced in superclass
	p.toString = function () {
		return "[AlphaMaskFilter]";
	};

	createjs.AlphaMaskFilter = createjs.promote(AlphaMaskFilter, "Filter");
}());
