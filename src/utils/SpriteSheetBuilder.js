/**
 * @license SpriteSheetBuilder
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

import { EventDispatcher, Event } from "@createjs/core";
import Rectangle from "../geom/Rectangle";
import SpriteSheet from "../display/SpriteSheet";

/**
 * The SpriteSheetBuilder allows you to generate {@link easeljs.SpriteSheet} instances at run time
 * from any display object. This can allow you to maintain your assets as vector graphics (for low file size), and
 * render them at run time as SpriteSheets for better performance.
 *
 * SpriteSheets can be built either synchronously, or asynchronously, so that large SpriteSheets can be generated
 * without locking the UI.
 *
 * Note that the "images" used in the generated SpriteSheet are actually canvas elements, and that they will be
 * sized to the nearest power of 2 up to the value of {@link easeljs.SpriteSheetBuilder#maxWidth}
 * or {@link easeljs.SpriteSheetBuilder#maxHeight}.
 *
 * @memberof easeljs
 * @extends core.EventDispatcher
 *
 * @param {Number} [framerate=0] The {{#crossLink "SpriteSheet/framerate:property"}}{{/crossLink}} of
 * {@link easeljs.SpriteSheet} instances that are created.
 */
export default class SpriteSheetBuilder extends EventDispatcher {

	constructor (framerate = 0) {
		super();

		/**
		 * The maximum width for the images (not individual frames) in the generated SpriteSheet. It is recommended to
		 * use a power of 2 for this value (ex. 1024, 2048, 4096). If the frames cannot all fit within the max
		 * dimensions, then additional images will be created as needed.
		 * @type {Number}
		 * @default 2048
		*/
		this.maxWidth = 2048;

		/**
		 * The maximum height for the images (not individual frames) in the generated SpriteSheet. It is recommended to
		 * use a power of 2 for this value (ex. 1024, 2048, 4096). If the frames cannot all fit within the max
		 * dimensions, then additional images will be created as needed.
		 * @type {Number}
		 * @default 2048
		 */
		this.maxHeight = 2048;

		/**
		 * The SpriteSheet that was generated. This will be null before a build is completed successfully.
		 * @type {easeljs.SpriteSheet}
		 */
		this.spriteSheet = null;

		/**
		 * The scale to apply when drawing all frames to the SpriteSheet. This is multiplied against any scale specified
		 * in the addFrame call. This can be used, for example, to generate a SpriteSheet at run time that is tailored
		 * to the a specific device resolution (ex. tablet vs mobile).
		 * @type {Number}
		 * @default 1
		 */
		this.scale = 1;

		/**
		* The padding to use between frames. This is helpful to preserve antialiasing on drawn vector content.
		* @type {Number}
		* @default 1
		*/
		this.padding = 1;

		/**
		 * A number from 0.01 to 0.99 that indicates what percentage of time the builder can use. This can be
		 * thought of as the number of seconds per second the builder will use. For example, with a timeSlice value of 0.3,
		 * the builder will run 20 times per second, using approximately 15ms per build (30% of available time, or 0.3s per second).
		 * Defaults to 0.3.
		 * @type {Number}
		 * @default 0.3
		 */
		this.timeSlice = 0.3;

		/**
		 * A value between 0 and 1 that indicates the progress of a build, or -1 if a build has not
		 * been initiated.
		 * @type {Number}
		 * @default -1
		 * @readonly
		 */
		this.progress = -1;

		/**
		 * A {@link easeljs.SpriteSheet#framerate} value that will be passed to new SpriteSheet instances that are
		 * created. If no framerate is specified (or it is 0), then SpriteSheets will use the {@link core.Ticker} framerate.
		 * @type {Number}
		 * @default 0
		 */
		this.framerate = framerate;

		/**
		 * @protected
		 * @type {Array}
		 */
		this._frames = [];

		/**
		 * @protected
		 * @type {Array}
		 */
		this._animations = {};

		/**
		 * @protected
		 * @type {Array}
		 */
		this._data = null;

		/**
		 * @protected
		 * @type {Number}
		 */
		this._nextFrameIndex = 0;

		/**
		 * @protected
		 * @type {Number}
		 */
		this._index = 0;

		/**
		 * @protected
		 * @type {Number}
		 */
		this._timerID = null;

		/**
		 * @protected
		 * @type {Number}
		 */
		this._scale = 1;
	}

	/**
	 * Adds a frame to the {@link easeljs.SpriteSheet}. Note that the frame will not be drawn until you
	 * call {@link easeljs.SpriteSheetBuilder#build} method. The optional setup params allow you to have
	 * a function run immediately before the draw occurs. For example, this allows you to add a single source multiple
	 * times, but manipulate it or its children to change it to generate different frames.
	 *
	 * Note that the source's transformations (x, y, scale, rotate, alpha) will be ignored, except for regX/Y. To apply
	 * transforms to a source object and have them captured in the SpriteSheet, simply place it into a {@link easeljs.Container}
	 * and pass in the Container as the source.
	 * @param {easeljs.DisplayObject} source The source {{#crossLink "DisplayObject"}}{{/crossLink}}  to draw as the frame.
	 * @param {easeljs.Rectangle} [sourceRect] A {{#crossLink "Rectangle"}}{{/crossLink}} defining the portion of the
	 * source to draw to the frame. If not specified, it will look for a `getBounds` method, bounds property, or
	 * `nominalBounds` property on the source to use. If one is not found, the frame will be skipped.
	 * @param {Number} [scale=1] Optional. The scale to draw this frame at. Default is 1.
	 * @param {Function} [setupFunction] A function to call immediately before drawing this frame. It will be called with two parameters: the source, and setupData.
	 * @param {Object} [setupData] Arbitrary setup data to pass to setupFunction as the second parameter.
	 * @return {Number} The index of the frame that was just added, or null if a sourceRect could not be determined.
	 */
	addFrame (source, sourceRect, scale = 1, setupFunction, setupData) {
		if (this._data) { throw SpriteSheetBuilder.ERR_RUNNING; }
		let rect = sourceRect||source.bounds||source.nominalBounds||(source.getBounds&&source.getBounds());
		if (!rect) { return null; }
		return this._frames.push({ source, sourceRect: rect, scale, funct: setupFunction, data: setupData, index: this._frames.length, height: rect.height*scale }) - 1;
	}

	/**
	 * Adds an animation that will be included in the created {@link easeljs.SpriteSheet}.
	 * @param {String} name The name for the animation.
	 * @param {Array} frames An array of frame indexes that comprise the animation. Ex. [3,6,5] would describe an animation
	 * that played frame indexes 3, 6, and 5 in that order.
	 * @param {String} [next] Specifies the name of the animation to continue to after this animation ends. You can
	 * also pass false to have the animation stop when it ends. By default it will loop to the start of the same animation.
	 * @param {Number} [speed] Specifies a frame advance speed for this animation. For example, a value of 0.5 would
	 * cause the animation to advance every second tick. Note that earlier versions used `frequency` instead, which had
	 * the opposite effect.
	 */
	addAnimation (name, frames, next, speed) {
		if (this._data) { throw SpriteSheetBuilder.ERR_RUNNING; }
		this._animations[name] = { frames, next, speed };
	}

	/**
	 * This will take a {@link easeljs.MovieClip} instance, and add its frames and labels to this
	 * builder. Labels will be added as an animation running from the label index to the next label. For example, if
	 * there is a label named "foo" at frame 0 and a label named "bar" at frame 10, in a MovieClip with 15 frames, it
	 * will add an animation named "foo" that runs from frame index 0 to 9, and an animation named "bar" that runs from
	 * frame index 10 to 14.
	 *
	 * Note that this will iterate through the full MovieClip with {@link easeljs.MovieClip#actionsEnabled}
	 * set to `false`, ending on the last frame.
	 * @param {easeljs.MovieClip} source The source MovieClip instance to add to the SpriteSheet.
	 * @param {easeljs.Rectangle} [sourceRect] A Rectangle defining the portion of the source to
	 * draw to the frame. If not specified, it will look for a {{#crossLink "DisplayObject/getBounds"}}{{/crossLink}}
	 * method, `frameBounds` Array, `bounds` property, or `nominalBounds` property on the source to use. If one is not
	 * found, the MovieClip will be skipped.
	 * @param {Number} [scale=1] The scale to draw the movie clip at.
	 * @param {Function} [setupFunction] A function to call immediately before drawing each frame. It will be called
	 * with three parameters: the source, setupData, and the frame index.
	 * @param {Object} [setupData] Arbitrary setup data to pass to setupFunction as the second parameter.
	 * @param {Function} [labelFunction] This method will be called for each MovieClip label that is added with four
	 * parameters: the label name, the source MovieClip instance, the starting frame index (in the movieclip timeline)
	 * and the end index. It must return a new name for the label/animation, or `false` to exclude the label.
	 */
	addMovieClip (source, sourceRect, scale = 1, setupFunction, setupData, labelFunction) {
		if (this._data) { throw SpriteSheetBuilder.ERR_RUNNING; }
		let rects = source.frameBounds;
		let rect = sourceRect||source.bounds||source.nominalBounds||(source.getBounds&&source.getBounds());
		if (!rect && !rects) { return; }

		let baseFrameIndex = this._frames.length;
		const duration = source.timeline.duration;
		for (let i=0; i<duration; i++) {
			let r = (rects&&rects[i]) ? rects[i] : rect;
			this.addFrame(source, r, scale, this._setupMovieClipFrame, {i, f:setupFunction, d:setupData});
		}
		const labels = source.timeline._labels;
		let lbls = [];
		for (let n in labels) {
			lbls.push({index:labels[n], label:n});
		}
		if (lbls.length) {
			lbls.sort((a, b) => a.index-b.index);
			for (let i=0,l=lbls.length; i<l; i++) {
				let label = lbls[i].label;
				let start = baseFrameIndex+lbls[i].index;
				let end = baseFrameIndex+((i === l-1) ? duration : lbls[i+1].index);
				let frames = [];
				for (let i=start; i<end; i++) { frames.push(i); }
				if (labelFunction) {
					label = labelFunction(label, source, start, end);
					if (!label) { continue; }
				}
				this.addAnimation(label, frames, true); // for now, this loops all animations.
			}
		}
	}

	/**
	 * Builds a {@link easeljs.SpriteSheet} instance based on the current frames.
	 * @return {easeljs.SpriteSheet} The created SpriteSheet instance, or null if a build is already running or an error
	 * occurred.
	 */
	build () {
		if (this._data) { throw SpriteSheetBuilder.ERR_RUNNING; }
		this._startBuild();
		while (this._drawNext()) {}
		this._endBuild();
		return this.spriteSheet;
	}

	/**
	 * Asynchronously builds a {@link easeljs.SpriteSheet} instance based on the current frames. It will
	 * run 20 times per second, using an amount of time defined by `timeSlice`. When it is complete it will call the
	 * specified callback.
	 * @param {Number} [timeSlice] Sets the timeSlice property on this instance.
	 */
	buildAsync (timeSlice) {
		if (this._data) { throw SpriteSheetBuilder.ERR_RUNNING; }
		this.timeSlice = timeSlice;
		this._startBuild();
		this._timerID = setTimeout(() => this._run(), 50-Math.max(0.01, Math.min(0.99, this.timeSlice||0.3))*50);
	}

	/**
	 * Stops the current asynchronous build.
	 */
	stopAsync () {
		clearTimeout(this._timerID);
		this._data = null;
	}

	/**
	 * Returns a string representation of this object.
	 * @override
	 * @return {String} a string representation of the instance.
	 */
	toString () {
		return `[${this.constructor.name}]`;
	}

	/**
	 * @protected
	 */
	_startBuild () {
		let pad = this.padding||0;
		this.progress = 0;
		this.spriteSheet = null;
		this._index = 0;
		this._scale = this.scale;
		let dataFrames = [];
		this._data = {
			images: [],
			frames: dataFrames,
			framerate: this.framerate,
			animations: this._animations // TODO: should we "clone" _animations in case someone adds more animations after a build?
		};

		let frames = this._frames.slice();
		frames.sort((a, b) => (a.height<=b.height) ? -1 : 1);

		if (frames[frames.length-1].height+pad*2 > this.maxHeight) { throw SpriteSheetBuilder.ERR_DIMENSIONS; }
		let y=0, x=0;
		let img = 0;
		while (frames.length) {
			let o = this._fillRow(frames, y, img, dataFrames, pad);
			if (o.w > x) { x = o.w; }
			y += o.h;
			if (!o.h || !frames.length) {
				let canvas = window.createjs&&createjs.createCanvas?createjs.createCanvas():document.createElement("canvas");
				canvas.width = this._getSize(x,this.maxWidth);
				canvas.height = this._getSize(y,this.maxHeight);
				this._data.images[img] = canvas;
				if (!o.h) {
					x=y=0;
					img++;
				}
			}
		}
	};

	/**
	 * @protected
	 * @return {Number} The width & height of the row.
	 */
	_setupMovieClipFrame (source, data) {
		let ae = source.actionsEnabled;
		source.actionsEnabled = false;
		source.gotoAndStop(data.i);
		source.actionsEnabled = ae;
		data.f&&data.f(source, data.d, data.i);
	}

	/**
	 * @protected
	 * @return {Number} The width & height of the row.
	 */
	_getSize (size, max) {
		let pow = 4;
		while (Math.pow(2, ++pow) < size) {}
		return Math.min(max, Math.pow(2, pow));
	};

	/**
	 * @protected
	 * @param {Array} frames
	 * @param {Number} y
	 * @param {HTMLImageElement} img
	 * @param {Object} dataFrames
	 * @param {Number} pad
	 * @return {Number} The width & height of the row.
	 */
	_fillRow (frames, y, img, dataFrames, pad) {
		let w = this.maxWidth;
		let maxH = this.maxHeight;
		y += pad;
		let h = maxH-y;
		let x = pad;
		let height = 0;
		for (let i=frames.length-1; i>=0; i--) {
			let frame = frames[i];
			let sc = this._scale*frame.scale;
			let rect = frame.sourceRect;
			let source = frame.source;
			let rx = Math.floor(sc*rect.x-pad);
			let ry = Math.floor(sc*rect.y-pad);
			let rh = Math.ceil(sc*rect.height+pad*2);
			let rw = Math.ceil(sc*rect.width+pad*2);
			if (rw > w) { throw SpriteSheetBuilder.ERR_DIMENSIONS; }
			if (rh > h || x+rw > w) { continue; }
			frame.img = img;
			frame.rect = new Rectangle(x,y,rw,rh);
			height = height || rh;
			frames.splice(i,1);
			dataFrames[frame.index] = [x,y,rw,rh,img,Math.round(-rx+sc*source.regX-pad),Math.round(-ry+sc*source.regY-pad)];
			x += rw;
		}
		return {w:x, h:height};
	}

	/**
	 * @protected
	 */
	_endBuild () {
		this.spriteSheet = new SpriteSheet(this._data);
		this._data = null;
		this.progress = 1;
		this.dispatchEvent("complete");
	}

	/**
	 * @protected
	 */
	_run () {
		let ts = Math.max(0.01, Math.min(0.99, this.timeSlice||0.3))*50;
		let t = (new Date()).getTime()+ts;
		let complete = false;
		while (t > (new Date()).getTime()) {
			if (!this._drawNext()) { complete = true; break; }
		}
		if (complete) {
			this._endBuild();
		} else {
			this._timerID = setTimeout(() => this._run(), 50-ts);
		}
		let p = this.progress = this._index/this._frames.length;
		if (this.hasEventListener("progress")) {
			let evt = new Event("progress");
			evt.progress = p;
			this.dispatchEvent(evt);
		}
	}

	/**
	 * @protected
	 * @return {Boolean} Returns false if this is the last draw.
	 */
	_drawNext () {
		let frame = this._frames[this._index];
		let sc = frame.scale*this._scale;
		let rect = frame.rect;
		let sourceRect = frame.sourceRect;
		let canvas = this._data.images[frame.img];
		let ctx = canvas.getContext("2d");
		frame.funct&&frame.funct(frame.source, frame.data);
		ctx.save();
		ctx.beginPath();
		ctx.rect(rect.x, rect.y, rect.width, rect.height);
		ctx.clip();
		ctx.translate(Math.ceil(rect.x-sourceRect.x*sc), Math.ceil(rect.y-sourceRect.y*sc));
		ctx.scale(sc,sc);
		frame.source.draw(ctx); // display object will draw itself.
		ctx.restore();
		return (++this._index) < this._frames.length;
	}

}

/**
 * @static
 * @readonly
 * @protected
 * @type {String}
 */
SpriteSheetBuilder.ERR_DIMENSIONS = "frame dimensions exceed max spritesheet dimensions";
/**
 * @static
 * @readonly
 * @protected
 * @type {String}
 */
SpriteSheetBuilder.ERR_RUNNING = "a build is already running";

/**
 * Dispatched when a build completes.
 * @event easeljs.SpriteSheetBuilder#complete
 * @property {Object} target The object that dispatched the event.
 * @property {String} type The event type.
 * @since 0.6.0
 */

/**
 * Dispatched when an asynchronous build has progress.
 * @event easeljs.SpriteSheetBuilder#progress
 * @property {Object} target The object that dispatched the event.
 * @property {String} type The event type.
 * @property {Number} progress The current progress value (0-1).
 * @since 0.6.0
 */
