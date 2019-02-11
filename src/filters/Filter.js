/**
 * @license Filter
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
 * Base class that all filters should inherit from.
 *
 * When on a regular Stage apply the Filters and then cache the object using the {@link easeljs.DisplayObject#cache} method.
 * When a cached object changes, please use {@link easeljs.DisplayObject#updateCache}.
 * When on a StageGL simply setting content in the `.filters` array will trigger an automatic and constantly updated cache.
 *
 * Note that each filter can implement a {@link easeljs.Filter#getBounds} method, which returns the
 * margins that need to be applied in order to fully display the filter. For example, the {@link easeljs.BlurFilter}
 * will cause an object to feather outwards, resulting in a margin around the shape.
 *
 * Any filter that consumes an external image stretches the image to cover the cached bounds. If this is an undesired
 * visual result, then use an intermediary cache to properly size and layout your data before passing it to a filter.
 *
 * <h4>EaselJS Filters</h4>
 * EaselJS comes with a number of pre-built filters:
 * <ul>
 *   <li>{@link easeljs.AberrationFilter}: Shift the RGB components separately along a given vector</li>
 *   <li>{@link easeljs.AlphaMapFilter}: Map a greyscale image to the alpha channel of a display object</li>
 *   <li>{@link easeljs.AlphaMaskFilter}: Map an image's alpha channel to the alpha channel of a display object</li>
 *   <li>{@link easeljs.BlurFilter}: Apply vertical and horizontal blur to a display object</li>
 *   <li>{@link easeljs.ColorFilter}: Color transform a display object</li>
 *   <li>{@link easeljs.ColorMatrixFilter}: Transform an image using a {{#crossLink "ColorMatrix"}}{{/crossLink}}</li>
 *   <li>{@link easeljs.DisplacementFilter}: Create localized distortions in supplied display object</li>
 * </ul>
 *
 * @memberof easeljs
 * @example
 * shape.filters = [
 *   new createjs.ColorFilter(0, 0, 0, 1, 255, 0, 0),
 *   new createjs.BlurFilter(5, 5, 10)
 * ];
 * shape.cache(0, 0, 100, 100);
 */
export default class Filter {

	constructor () {
		/**
		 * A flag stating that this filter uses a context draw mode and cannot be batched into imageData processing.
		 * @type {Boolean}
		 * @default false
		 */
		this.usesContext = false;

		/**
		 * Another filter that is required to act as part of this filter and created and managed under the hood.
		 * @private
		 * @type {easeljs.Filter}
		 * @default null
		 */
		this._multiPass = null;

		/**
		 * Pre-processing shader code, will be parsed before being fed in.
		 * This should be based upon StageGL.SHADER_VERTEX_BODY_REGULAR
		 * @virtual
		 * @type {String}
		 * @readonly
		 */
		this.VTX_SHADER_BODY = null;

		/**
		 * Pre-processing shader code, will be parsed before being fed in.
		 * This should be based upon StageGL.SHADER_FRAGMENT_BODY_REGULAR
		 * @virtual
		 * @type {String}
		 * @readonly
		 */
		this.FRAG_SHADER_BODY = null;
	}

	/**
	 * Check to see if an image source being provided is one that is valid.
	 * <h4>Valid Sources:</h4>
	 * <ul>
	 *   <li>Image Object</li>
	 *   <li>HTML Canvas Element</li>
	 *   <li>`.cacheCanvas` on an object with the same stage</li>
	 * </ul>
	 * WebGLTextures CANNOT be shared between multiple WebGL contexts. This means the only safe source for a WebGLTexture
	 * is an object cached using the same StageGL as the object trying to use it in a filter. This function does not
	 * enforce that restriction, as it is difficult or expensive to detect. The render will crash or fail to load the
	 * image data if the rule isn't followed.
	 * @param {HTMLImageElement|HTMLCanvasElement|WebGLTexture} src The element to check for validity
	 * @return {Boolean} Whether the source is valid
	 */
	static isValidImageSource(src) {
		return Boolean(src) && (
			src instanceof Image ||
			src instanceof WebGLTexture ||
			src instanceof HTMLCanvasElement
		);
	}

	/**
	 * Provides padding values for this filter. That is, how much the filter will extend the visual bounds of an object it is applied to.
	 * @abstract
	 * @param {easeljs.Rectangle} [rect] If specified, the provided Rectangle instance will be expanded by the padding amounts and returned.
	 * @return {easeljs.Rectangle} If a `rect` param was provided, it is returned. If not, either a new rectangle with the padding values, or null if no padding is required for this filter.
	 */
	getBounds (rect) { }

	/**
	 * @virtual
	 * @abstract
	 * @param {WebGLContext} gl The context associated with the stage performing the render.
	 * @param {easeljs.StageGL} stage The stage instance that will be rendering.
	 * @param {ShaderProgram} shaderProgram The compiled shader that is going to be sued to perform the render.
	 */
	shaderParamSetup (gl, stage, shaderProgram) { }

	/**
	 * Applies the filter to the specified context.
	 * @param {CanvasRenderingContext2D} ctx The 2D context to use as the source.
	 * @param {Number} x The x position to use for the source rect.
	 * @param {Number} y The y position to use for the source rect.
	 * @param {Number} width The width to use for the source rect.
	 * @param {Number} height The height to use for the source rect.
	 * @param {CanvasRenderingContext2D} [targetCtx] The 2D context to draw the result to. Defaults to the context passed to ctx.
	 * @return {Boolean} If the filter was applied successfully.
	 */
	applyFilter (ctx, x, y, width, height, targetCtx) {
		// this is the default behaviour because most filters access pixel data. It is overridden when not needed.
		targetCtx = targetCtx || ctx;
		try {
			let imageData = ctx.getImageData(x, y, width, height);
			if (this._applyFilter(imageData)) {
				targetCtx.putImageData(imageData, x, y);
				return true;
			}
		} catch (e) {}
		return false;
	}

	/**
	 * Returns a string representation of this object.
	 * @return {String} a string representation of the instance.
	 */
	toString () {
		return `[${this.constructor.name}]`;
	}

	/**
	 * Returns a clone of this Filter instance.
	 * @return {easeljs.Filter} A clone of the current Filter instance.
	 */
	clone () {
		return new Filter();
	}

	/**
	 * @abstract
	 * @param {ImageData} imageData Target ImageData instance.
	 * @return {Boolean}
	 */
	_applyFilter (imageData) { }

}
