/*
* @license SpriteSheetUtils
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

import createCanvas from "./Canvas";

/**
 * The SpriteSheetUtils class is a collection of static methods for working with {{#crossLink "SpriteSheet"}}{{/crossLink}}s.
 * A sprite sheet is a series of images (usually animation frames) combined into a single image on a regular grid. For
 * example, an animation consisting of 8 100x100 images could be combined into a 400x200 sprite sheet (4 frames across
 * by 2 high). The SpriteSheetUtils class uses a static interface and should not be instantiated.
 *
 * @memberof easeljs
 * @name easeljs.SpriteSheetUtils
 */
export default {

	/**
	 * @protected
	 * @type {HTMLCanvasElement | Object}
	 */
	_workingCanvas: createCanvas(),

	/**
	 * @protected
	 * @type {CanvasRenderingContext2D}
	 */
	get _workingContext () { return this._workingCanvas.getContext("2d"); },

	/**
	 * Returns a single frame of the specified sprite sheet as a new PNG image. An example of when this may be useful is
	 * to use a spritesheet frame as the source for a bitmap fill.
	 *
	 * <strong>WARNING:</strong> In almost all cases it is better to display a single frame using a {@link easeljs.Sprite}
	 * with a {@link easeljs.Sprite#gotoAndStop} call than it is to slice out a frame using this
	 * method and display it with a Bitmap instance. You can also crop an image using the {@link easeljs.Bitmap#sourceRect}
	 * property of {@link easeljs.Bitmap}.
	 *
	 * The extractFrame method may cause cross-domain warnings since it accesses pixels directly on the canvas.
	 *
	 * @param {easeljs.SpriteSheet} spriteSheet The SpriteSheet instance to extract a frame from.
	 * @param {Number | String} frameOrAnimation The frame number or animation name to extract. If an animation
	 * name is specified, only the first frame of the animation will be extracted.
	 * @return {HTMLImageElement} a single frame of the specified sprite sheet as a new PNG image.
	 */
	extractFrame (spriteSheet, frameOrAnimation) {
		if (isNaN(frameOrAnimation)) {
			frameOrAnimation = spriteSheet.getAnimation(frameOrAnimation).frames[0];
		}
		let data = spriteSheet.getFrame(frameOrAnimation);
		if (!data) { return null; }
		let r = data.rect;
		let canvas = this._workingCanvas;
		canvas.width = r.width;
		canvas.height = r.height;
		this._workingContext.drawImage(data.image, r.x, r.y, r.width, r.height, 0, 0, r.width, r.height);
		let img = document.createElement("img");
		img.src = canvas.toDataURL("image/png");
		return img;
	},

	/**
	 * @protected
	 * @param {easeljs.SpriteSheet} spriteSheet
	 * @param {Number} count
	 * @param {Number} h
	 * @param {Number} v
	 */
	_flip (spriteSheet, count, h, v) {
		let imgs = spriteSheet._images;
		let canvas = this._workingCanvas;
		let ctx = this._workingContext;
		const il = imgs.length/count;
		for (let i=0; i<il; i++) {
			let src = imgs[i];
			src.__tmp = i; // a bit hacky, but faster than doing indexOf below.
			ctx.setTransform(1,0,0,1,0,0);
			ctx.clearRect(0,0,canvas.width+1,canvas.height+1);
			canvas.width = src.width;
			canvas.height = src.height;
			ctx.setTransform(h?-1:1, 0, 0, v?-1:1, h?src.width:0, v?src.height:0);
			ctx.drawImage(src,0,0);
			let img = document.createElement("img");
			img.src = canvas.toDataURL("image/png");
			// work around a strange bug in Safari:
			img.width = (src.width||src.naturalWidth);
			img.height = (src.height||src.naturalHeight);
			imgs.push(img);
		}

		let frames = spriteSheet._frames;
		const fl = frames.length/count;
		for (let i=0; i<fl; i++) {
			let src = frames[i];
			let rect = src.rect.clone();
			let img = imgs[src.image.__tmp+il*count];

			let frame = {image:img,rect,regX:src.regX,regY:src.regY};
			if (h) {
				rect.x = (img.width||img.naturalWidth)-rect.x-rect.width; // update rect
				frame.regX = rect.width-src.regX; // update registration point
			}
			if (v) {
				rect.y = (img.height||img.naturalHeight)-rect.y-rect.height;  // update rect
				frame.regY = rect.height-src.regY; // update registration point
			}
			frames.push(frame);
		}

		let sfx = `_${h?"h":""}${v?"v":""}`;
		let names = spriteSheet._animations;
		let data = spriteSheet._data;
		const al = names.length/count;
		for (let i=0; i<al; i++) {
			let name = names[i];
			let src = data[name];
			let anim = {name:name+sfx,speed:src.speed,next:src.next,frames:[]};
			if (src.next) { anim.next += sfx; }
			let frames = src.frames;
			for (let i=0,l=frames.length;i<l;i++) {
				anim.frames.push(frames[i]+fl*count);
			}
			data[anim.name] = anim;
			names.push(anim.name);
		}
	}

}
