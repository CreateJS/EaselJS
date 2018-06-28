/**
 * @license Bitmap
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

import DisplayObject from "./DisplayObject";
import VideoBuffer from "../utils/VideoBuffer";

/**
 * A Bitmap represents an Image, Canvas, or Video in the display list. A Bitmap can be instantiated using an existing
 * HTML element, or a string.
 *
 * <strong>Notes:</strong>
 * <ol>
 *     <li>When using a video source that may loop or seek, use a {@link easeljs.VideoBuffer} object to
 *      blinking / flashing.
 *     <li>When a string path or image tag that is not yet loaded is used, the stage may need to be redrawn before it
 *      will be displayed.</li>
 *     <li>Bitmaps with an SVG source currently will not respect an alpha value other than 0 or 1. To get around this,
 *     the Bitmap can be cached.</li>
 *     <li>Bitmaps with an SVG source will taint the canvas with cross-origin data, which prevents interactivity. This
 *     happens in all browsers except recent Firefox builds.</li>
 *     <li>Images loaded cross-origin will throw cross-origin security errors when interacted with using a mouse, using
 *     methods such as `getObjectUnderPoint`, or using filters, or caching. You can get around this by setting
 *     `crossOrigin` flags on your images before passing them to EaselJS, eg: `img.crossOrigin="Anonymous";`</li>
 * </ol>
 *
 * @memberof easeljs
 * @extends easeljs.DisplayObject
 * @example
 * const bitmap = new Bitmap("imagePath.jpg");
 *
 * @param {CanvasImageSource | String | Object} imageOrUri The source image to display. This can be a CanvasImageSource
 * (image, video, canvas), an object with a `getImage` method that returns a CanvasImageSource, or a string URL to an image.
 * If the latter, a new Image instance with the URL as its src will be used.
 */
export default class Bitmap extends DisplayObject {

	constructor (imageOrUri) {
		super();

		/**
		 * The source image to display. This can be a CanvasImageSource
		 * (image, video, canvas), an object with a `getImage` method that returns a CanvasImageSource, or a string URL to an image.
		 * If the latter, a new Image instance with the URL as its src will be used.
		 * @property image
		 * @type {CanvasImageSource | Object}
		 */
		if (typeof imageOrUri === "string") {
			this.image = document.createElement("img");
			this.image.src = imageOrUri;
		} else {
			this.image = imageOrUri;
		}

		/**
		 * Specifies an area of the source image to draw. If omitted, the whole image will be drawn.
		 * Note that video sources must have a width / height set to work correctly with `sourceRect`.
		 * @type {easeljs.Rectangle}
		 * @default null
		 */
		this.sourceRect = null;

		/**
		 * Set as compatible with WebGL.
		 * @protected
		 * @type {Number}
		 */
		this._webGLRenderStyle = DisplayObject._StageGL_BITMAP;
	}

	isVisible () {
		let image = this.image;
		let hasContent = this.cacheCanvas || (image && (image.naturalWidth || image.getContext || image.readyState >= 2));
		return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent);
	}

	draw (ctx, ignoreCache = false) {
		if (super.draw(ctx, ignoreCache)) { return true; }
		let img = this.image, rect = this.sourceRect;
		if (img instanceof VideoBuffer) { img = img.getImage(); }
		if (img == null) { return true; }
		if (rect) {
			// some browsers choke on out of bound values, so we'll fix them:
			let x1 = rect.x, y1 = rect.y, x2 = x1 + rect.width, y2 = y1 + rect.height, x = 0, y = 0, w = img.width, h = img.height;
			if (x1 < 0) { x -= x1; x1 = 0; }
			if (x2 > w) { x2 = w; }
			if (y1 < 0) { y -= y1; y1 = 0; }
			if (y2 > h) { y2 = h; }
			ctx.drawImage(img, x1, y1, x2-x1, y2-y1, x, y, x2-x1, y2-y1);
		} else {
			ctx.drawImage(img, 0, 0);
		}
		return true;
	}

	// Note, the doc sections below document using the specified APIs (from DisplayObject) from
	// Bitmap. This is why they have no method implementations.

	/**
	 * Because the content of a Bitmap is already in a simple format, cache is unnecessary for Bitmap instances.
	 * You should <b>not</b> cache Bitmap instances as it can degrade performance.
	 *
	 * <strong>However: If you want to use a filter on a Bitmap, you <em>MUST</em> cache it, or it will not work.</strong>
	 * To see the API for caching, please visit the {@link easeljs.DisplayObject#cache} method.
	 *
	 * @alias easeljs.Bitmap#cache
	 */

	/**
	 * Because the content of a Bitmap is already in a simple format, cache is unnecessary for Bitmap instances.
	 * You should <b>not</b> cache Bitmap instances as it can degrade performance.
	 *
	 * <strong>However: If you want to use a filter on a Bitmap, you <em>MUST</em> cache it, or it will not work.</strong>
	 * To see the API for caching, please visit the {@link easeljs.DisplayObject#cache} method.
	 *
	 * @alias easeljs.Bitmap#updateCache
	 */

	/**
	 * Because the content of a Bitmap is already in a simple format, cache is unnecessary for Bitmap instances.
	 * You should <b>not</b> cache Bitmap instances as it can degrade performance.
	 *
	 * <strong>However: If you want to use a filter on a Bitmap, you <em>MUST</em> cache it, or it will not work.</strong>
	 * To see the API for caching, please visit the {@link easeljs.DisplayObject#cache} method.
	 *
	 * @alias easeljs.Bitmap#uncache
	 */

	getBounds () {
		let rect = super.getBounds();
		if (rect) { return rect; }
		let image = this.image, o = this.sourceRect || image;
		let hasContent = (image && (image.naturalWidth || image.getContext || image.readyState >= 2));
		return hasContent ? this._rectangle.setValues(0, 0, o.width, o.height) : null;
	}

	/**
	 * Returns a clone of the Bitmap instance.
	 * @param {Boolean} [node] Whether the underlying DOM element should be cloned as well.
	 * @return {easeljs.Bitmap} A clone of the Bitmap instance.
	 */
	clone (node) {
		let img = this.image;
		if (img != null && node != null) { img = img.cloneNode(); }
		let bmp = new Bitmap(img);
		if (this.sourceRect) { bmp.sourceRect = this.sourceRect.clone(); }
		this._cloneProps(bmp);
		return bmp;
	}

}
