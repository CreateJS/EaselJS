/*
 * AlphaMapFilter
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
	 * Applies a greyscale alpha map image (or canvas) to the target, such that the alpha channel of the result will
	 * be copied from the red channel of the map, and the RGB channels will be copied from the target.
	 *
	 * Generally, it is recommended that you use {{#crossLink "AlphaMaskFilter"}}{{/crossLink}}, because it has much
	 * better performance.
	 *
	 * <h4>Example</h4>
	 * This example draws a red->blue box, caches it, and then uses the cache canvas as an alpha map on a 100x100 image.
	 *
	 *       var box = new createjs.Shape();
	 *       box.graphics.beginLinearGradientFill(["#ff0000", "#0000ff"], [0, 1], 0, 0, 0, 100)
	 *       box.graphics.drawRect(0, 0, 100, 100);
	 *       box.cache(0, 0, 100, 100);
	 *
	 *       var bmp = new createjs.Bitmap("path/to/image.jpg");
	 *       bmp.filters = [
	 *           new createjs.AlphaMapFilter(box.cacheCanvas)
	 *       ];
	 *       bmp.cache(0, 0, 100, 100);
	 *       stage.addChild(bmp);
	 *
	 * See {{#crossLink "Filter"}}{{/crossLink}} for more information on applying filters.
	 * @class AlphaMapFilter
	 * @extends Filter
	 * @constructor
	 * @param {HTMLImageElement|HTMLCanvasElement|WebGLTexture} alphaMap The greyscale image (or canvas) to use as the alpha value for the
	 * result. This should be exactly the same dimensions as the target.
	 **/
	function AlphaMapFilter(alphaMap) {
		this.Filter_constructor();

		if (!createjs.Filter.isValidImageSource(alphaMap)) {
			throw "Must provide valid image source for alpha map, see Filter.isValidImageSource";
		}

	// public properties:
		/**
		 * The greyscale image (or canvas) to use as the alpha value for the result. This should be exactly the same
		 * dimensions as the target.
		 * @property alphaMap
		 * @type HTMLImageElement|HTMLCanvasElement
		 **/
		this.alphaMap = alphaMap;
		
	// private properties:
		/**
		 * @property _map
		 * @protected
		 * @type HTMLImageElement|HTMLCanvasElement
		 **/
		this._map = null;
		
		/**
		 * @property _mapCtx
		 * @protected
		 * @type CanvasRenderingContext2D
		 **/
		this._mapCtx = null;

		/**
		 * @property _mapTexture
		 * @protected
		 * @type WebGLTexture
		 */
		this._mapTexture = null;

		this.FRAG_SHADER_BODY = (
			"uniform sampler2D uAlphaSampler;"+

			"void main(void) {" +
				"vec4 color = texture2D(uSampler, vTextureCoord);" +
				"vec4 alphaMap = texture2D(uAlphaSampler, vTextureCoord);" +

				// some image formats can have transparent white rgba(1,1,1, 0) when put on the GPU, this means we need a slight tweak
				// using ceil ensure that the colour will be used so long as it exists but pure transparency will be treated black
				"float newAlpha = alphaMap.r * ceil(alphaMap.a);" +
				"gl_FragColor = vec4(clamp(color.rgb/color.a, 0.0, 1.0) * newAlpha, newAlpha);" +
			"}"
		);

		if(alphaMap instanceof WebGLTexture) {
			this._mapTexture = alphaMap;
		}
	}
	var p = createjs.extend(AlphaMapFilter, createjs.Filter);

	// TODO: deprecated
	// p.initialize = function() {}; // searchable for devs wondering where it is. REMOVED. See docs for details.

	// Docced in superclass
	p.shaderParamSetup = function(gl, stage, shaderProgram) {
		if(this._mapTexture === null) { this._mapTexture = gl.createTexture(); }

		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, this._mapTexture);
		stage.setTextureParams(gl);
		if (this.alphaMap !== this._mapTexture) {
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.alphaMap);
		}

		gl.uniform1i(
			gl.getUniformLocation(shaderProgram, "uAlphaSampler"),
			1
		);
	};

// public methods:
	// Docced in superclass
	p.clone = function () {
		var o = new AlphaMapFilter(this.alphaMap);
		return o;
	};

	// Docced in superclass
	p.toString = function () {
		return "[AlphaMapFilter]";
	};


// private methods:
	// Docced in superclass
	p._applyFilter = function (imageData) {
		if (!this._prepAlphaMap()) { return false; }

		var outArray = imageData.data;
		var width = imageData.width;
		var height = imageData.height;
		var rowOffset, pixelStart;

		var sampleData = this._mapCtx.getImageData(0,0, this._map.width,this._map.height);
		var sampleArray = sampleData.data;
		var sampleWidth = sampleData.width;
		var sampleHeight = sampleData.height;
		var sampleRowOffset, samplePixelStart;

		var widthRatio = sampleWidth/width;
		var heightRatio = sampleHeight/height;

		// performance optimizing lookup

		// the x and y need to stretch separately, nesting the for loops simplifies this logic even if the array is flat
		for (var i=0; i<height; i++) {
			rowOffset = i * width;
			sampleRowOffset = ((i*heightRatio) |0) * sampleWidth;

			// the arrays are int arrays, so a single pixel is [r,g,b,a, ...],so calculate the start of the pixel
			for (var j=0; j<width; j++) {
				pixelStart = (rowOffset + j) *4;
				samplePixelStart = (sampleRowOffset + ((j*widthRatio) |0)) *4;

				// modify the pixels
				outArray[pixelStart] =   outArray[pixelStart];
				outArray[pixelStart+1] = outArray[pixelStart+1];
				outArray[pixelStart+2] = outArray[pixelStart+2];
				outArray[pixelStart+3] = sampleArray[samplePixelStart];
			}
		}

		return true;
	};

	/**
	 * @method _prepAlphaMap
	 * @protected
	 **/
	p._prepAlphaMap = function () {
		if (!this.alphaMap) { return false; }
		if (this.alphaMap === this._map && this._mapCtx) { return true; }

		var map = this._map = this.alphaMap;
		var canvas = map;
		var ctx;
		if (map instanceof HTMLCanvasElement) {
			ctx = canvas.getContext("2d");
		} else {
			canvas = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas");
			canvas.width = map.width;
			canvas.height = map.height;
			ctx = canvas.getContext("2d");
			ctx.drawImage(map, 0, 0);
		}

		this._mapCtx = ctx;

		return true;
	};


	createjs.AlphaMapFilter = createjs.promote(AlphaMapFilter, "Filter");
}());
