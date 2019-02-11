/**
 * @license SpriteSheet
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
 * EXPRESS OR IMPliED, INCLUDING BUT NOT liMITED TO THE WARRANTIES
 * OF MERCHANTABIliTY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HolDERS BE liABLE FOR ANY CLAIM, DAMAGES OR OTHER liABIliTY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEAliNGS IN THE SOFTWARE.
 */

import { EventDispatcher, Event } from "@createjs/core";
import Rectangle from "../geom/Rectangle";

/**
 * Encapsulates the properties and methods associated with a sprite sheet. A sprite sheet is a series of images (usually
 * animation frames) combined into a larger image (or images). For example, an animation consisting of eight 100x100
 * images could be combined into a single 400x200 sprite sheet (4 frames across by 2 high).
 * <br />
 * The data passed to the SpriteSheet constructor defines:
 * <ol>
 * 	<li> The source image or images to use.</li>
 * 	<li> The positions of individual image frames.</li>
 * 	<li> Sequences of frames that form named animations. Optional.</li>
 * 	<li> The target playback framerate. Optional.</li>
 * </ol>
 *
 * <h3>SpriteSheet Format</h3>
 * SpriteSheets are an object with two required properties (`images` and `frames`), and two optional properties
 * (`framerate` and `animations`). This makes them easy to define in javascript code, or in JSON.
 *
 * <h4>images</h4>
 * An array of source images. Images can be either an HTMlimage
 * instance, or a uri to an image. The former is recommended to control preloading.
 *
 * 	images: [image1, "path/to/image2.png"],
 *
 * <h4>frames</h4>
 * Defines the individual frames. There are two supported formats for frame data:
 * When all of the frames are the same size (in a grid), use an object with `width`, `height`, `regX`, `regY`,
 * and `count` properties.
 *
 * <ul>
 *  <li>`width` & `height` are required and specify the dimensions of the frames</li>
 *  <li>`regX` & `regY` indicate the registration point or "origin" of the frames</li>
 *  <li>`spacing` indicate the spacing between frames</li>
 *  <li>`margin` specify the margin around the image(s)</li>
 *  <li>`count` allows you to specify the total number of frames in the spritesheet; if omitted, this will
 *  be calculated based on the dimensions of the source images and the frames. Frames will be assigned
 *  indexes based on their position in the source images (left to right, top to bottom).</li>
 * </ul>
 *
 *  	frames: {width:64, height:64, count:20, regX: 32, regY:64, spacing:0, margin:0}
 *
 * If the frames are of different sizes, use an array of frame definitions. Each definition is itself an array
 * with 4 required and 3 optional entries, in the order:
 *
 * <ul>
 *  <li>The first four, `x`, `y`, `width`, and `height` are required and define the frame rectangle.</li>
 *  <li>The fifth, `imageIndex`, specifies the index of the source image (defaults to 0)</li>
 *  <li>The last two, `regX` and `regY` specify the registration point of the frame</li>
 * </ul>
 *
 * 	frames: [
 * 		// x, y, width, height, imageIndex*, regX*, regY*
 * 		[64, 0, 96, 64],
 * 		[0, 0, 64, 64, 1, 32, 32]
 * 		// etc.
 * 	]
 *
 * <h4>animations</h4>
 * Optional. An object defining sequences of frames to play as named animations. Each property corresponds to an
 * animation of the same name. Each animation must specify the frames to play, and may
 * also include a relative playback `speed` (ex. 2 would playback at double speed, 0.5 at half), and
 * the name of the `next` animation to sequence to after it completes.
 *
 * There are three formats supported for defining the frames in an animation, which can be mixed and matched as appropriate:
 * <ol>
 * 	<li>for a single frame animation, you can simply specify the frame index
 *
 * 		animations: {
 * 			sit: 7
 * 		}
 *
 * </li>
 * <li>
 *      for an animation of consecutive frames, you can use an array with two required, and two optional entries
 * 		in the order: `start`, `end`, `next`, and `speed`. This will play the frames from start to end inclusive.
 *
 * 		animations: {
 * 			// start, end, next*, speed*
 * 			run: [0, 8],
 * 			jump: [9, 12, "run", 2]
 * 		}
 *
 *  </li>
 *  <li>
 *     for non-consecutive frames, you can use an object with a `frames` property defining an array of frame
 *     indexes to play in order. The object can also specify `next` and `speed` properties.
 *
 * 		animations: {
 * 			walk: {
 * 				frames: [1,2,3,3,2,1]
 * 			},
 * 			shoot: {
 * 				frames: [1,4,5,6],
 * 				next: "walk",
 * 				speed: 0.5
 * 			}
 * 		}
 *
 *  </li>
 * </ol>
 * <strong>Note:</strong> the `speed` property was added in EaselJS 0.7.0. Earlier versions had a `frequency`
 * property instead, which was the inverse of `speed`. For example, a value of "4" would be 1/4 normal speed in
 * earlier versions, but is 4x normal speed in EaselJS 0.7.0+.
 *
 * <h4>framerate</h4>
 * Optional. Indicates the default framerate to play this spritesheet at in frames per second. See
 * {{#crossLink "SpriteSheet/framerate:property"}}{{/crossLink}} for more information.
 *
 * 		framerate: 20
 *
 * Note that the Sprite framerate will only work if the stage update method is provided with the {{#crossLink "Ticker/tick:event"}}{{/crossLink}}
 * event generated by the {{#crossLink "Ticker"}}{{/crossLink}}.
 *
 * 		createjs.Ticker.on("tick", handleTick);
 * 		function handleTick(event) {
 *			stage.update(event);
 *		}
 *
 * <h3>Example</h3>
 * To define a simple sprite sheet, with a single image "sprites.jpg" arranged in a regular 50x50 grid with three
 * animations: "stand" showing the first frame, "run" looping frame 1-5 inclusive, and "jump" playing frame 6-8 and
 * sequencing back to run.
 *
 * 		var data = {
 * 			images: ["sprites.jpg"],
 * 			frames: {width:50, height:50},
 * 			animations: {
 * 				stand:0,
 * 				run:[1,5],
 * 				jump:[6,8,"run"]
 * 			}
 * 		};
 * 		var spriteSheet = new createjs.SpriteSheet(data);
 * 		var animation = new createjs.Sprite(spriteSheet, "run");
 *
 * <h3>Generating SpriteSheet Images</h3>
 * Spritesheets can be created manually by combining images in PhotoShop, and specifying the frame size or
 * coordinates manually, however there are a number of tools that facilitate this.
 * <ul>
 *     <li>Exporting SpriteSheets or HTML5 content from Adobe Flash/Animate supports the EaselJS SpriteSheet format.</li>
 *     <li>The popular <a href="https://www.codeandweb.com/texturepacker/easeljs" target="_blank">Texture Packer</a> has
 *     EaselJS support.
 *     <li>SWF animations in Adobe Flash/Animate can be exported to SpriteSheets using <a href="http://createjs.com/zoe" target="_blank"></a></li>
 * </ul>
 *
 * <h3>Cross Origin Issues</h3>
 * <strong>Warning:</strong> Images loaded cross-origin will throw cross-origin security errors when interacted with
 * using:
 * <ul>
 *     <li>a mouse</li>
 *     <li>methods such as {{#crossLink "Container/getObjectUnderPoint"}}{{/crossLink}}</li>
 *     <li>Filters (see {{#crossLink "Filter"}}{{/crossLink}})</li>
 *     <li>caching (see {{#crossLink "DisplayObject/cache"}}{{/crossLink}})</li>
 * </ul>
 * You can get around this by setting `crossOrigin` property on your images before passing them to EaselJS, or
 * setting the `crossOrigin` property on PreloadJS' LoadQueue or LoadItems.
 *
 * 		const img = new Image();
 * 		img.crossOrigin="Anonymous";
 * 		img.src = "http://server-with-CORS-support.com/path/to/image.jpg";
 *
 * If you pass string paths to SpriteSheets, they will not work cross-origin. The server that stores the image must
 * support cross-origin requests, or this will not work. For more information, check out
 * <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS" target="_blank">CORS overview on MDN</a>.
 *
 * @memberof easeljs
 * @extends core.EventDispatcher
 * @param {Object} data An object describing the SpriteSheet data.
 */
export default class SpriteSheet extends EventDispatcher {

	constructor (data) {
		super();

		/**
		 * Indicates whether all images are finished loading.
		 * @type {Boolean}
		 * @readonly
		 */
		this.complete = true;

		/**
		 * Specifies the framerate to use by default for Sprite instances using the SpriteSheet. See the Sprite class
		 * {@link easeljs.Sprite#framerate} for more information.
		 * @type Number
		 */
		this.framerate = 0;

		/**
		 * @protected
		 * @type {Array}
		 */
		this._animations = null;

		/**
		 * @protected
		 * @type {Array}
		 */
		this._frames = null;

		/**
		 * @protected
		 * @type {Array}
		 */
		this._images = null;

		/**
		 * @protected
		 * @type {Object}
		 */
		this._data = null;

		/**
		 * @protected
		 * @type {Number}
		 */
		this._loadCount = 0;

		// only used for simple frame defs:
		/**
		 * @protected
		 * @type {Number}
		 */
		this._frameHeight = 0;

		/**
		 * @protected
		 * @type {Number}
		 */
		this._frameWidth = 0;

		/**
		 * @protected
		 * @type {Number}
		 */
		this._numFrames = 0;

		/**
		 * @protected
		 * @type {Number}
		 */
		this._regX = 0;

		/**
		 * @protected
		 * @type {Number}
		 */
		this._regY = 0;

		/**
		 * @protected
		 * @type {Number}
		 */
		this._spacing = 0;

		/**
		 * @protected
		 * @type {Number}
		 */
		this._margin = 0;

		this._parseData(data);
	}

	/**
	 * Returns an array of all available animation names available on this sprite sheet as strings.
	 * @type {Array}
	 * @readonly
	 */
	get animations () {
		return this._animations.slice();
	}

	/**
	 * Returns the total number of frames in the specified animation, or in the whole sprite
	 * sheet if the animation param is omitted. Returns 0 if the spritesheet relies on calculated frame counts, and
	 * the images have not been fully loaded.
	 * @param {String} animation The name of the animation to get a frame count for.
	 * @return {Number} The number of frames in the animation, or in the entire sprite sheet if the animation param is omitted.
	 */
	getNumFrames (animation) {
		if (animation == null) {
			return this._frames ? this._frames.length : this._numFrames || 0;
		} else {
			let data = this._data[animation];
			if (data == null) { return 0; }
			else { return data.frames.length; }
		}
	}

	/**
	 * Returns an object defining the specified animation. The returned object contains:
	 * <ul>
	 * 	<li>frames: an array of the frame ids in the animation</li>
	 * 	<li>speed: the playback speed for this animation</li>
	 * 	<li>name: the name of the animation</li>
	 * 	<li>next: the default animation to play next. If the animation loops, the name and next property will be the same.</li>
	 * </ul>
	 * @param {String} name The name of the animation to get.
	 * @return {Object} a generic object with frames, speed, name, and next properties.
	 */
	getAnimation (name) {
		return this._data[name];
	}

	/**
	 * Returns an object specifying the image and source rect of the specified frame. The returned object has:
	 * <ul>
	 * 	<li>an image property holding a reference to the image object in which the frame is found</li>
	 * 	<li>a rect property containing a Rectangle instance which defines the boundaries for the frame within that image.</li>
	 * 	<li> A regX and regY property corresponding to the regX/Y values for the frame.
	 * </ul>
	 * @param {Number} frameIndex The index of the frame.
	 * @return {Object} a generic object with image and rect properties. Returns null if the frame does not exist.
	 */
	getFrame (frameIndex) {
		let frame;
		if (this._frames && (frame = this._frames[frameIndex])) { return frame; }
		return null;
	}

	/**
	 * Returns a {@link easeljs.Rectangle} instance defining the bounds of the specified frame relative
	 * to the origin.
	 *
	 * @param {Number} frameIndex The index of the frame.
	 * @param {easeljs.Rectangle} [rectangle] A Rectangle instance to copy the values into. By default a new instance is created.
	 * @return {easeljs.Rectangle} A Rectangle instance. Returns null if the frame does not exist, or the image is not fully loaded.
	 */
	getFrameBounds (frameIndex, rectangle = new Rectangle()) {
		let frame = this.getFrame(frameIndex);
		return frame ? rectangle.setValues(-frame.regX, -frame.regY, frame.rect.width, frame.rect.height) : null;
	}

	/**
	 * Returns a string representation of this object.
	 * @return {String} a string representation of the instance.
	 */
	toString () {
		return `[${this.constructor.name}]`;
	}

	/**
	 * SpriteSheet cannot be cloned. A SpriteSheet can be shared by multiple Sprite instances without cloning it.
	 * @override
	 * @throws SpriteSheet cannot be cloned.
	 */
	clone () {
		throw "SpriteSheet cannot be cloned.";
	}

	/**
	 * @param {Object} data An object describing the SpriteSheet data.
	 * @protected
	 */
	_parseData (data) {
		if (data == null) { return; }
		this.framerate = data.framerate||0;

		// parse images:
		if (data.images) {
			for (let img of data.images) {
				let a = this._images = [];
				let src;
				if (typeof img === "string") {
					src = img;
					img = document.createElement("img");
					img.src = src;
				}
				a.push(img);
				if (!img.getContext && !img.naturalWidth) {
					this._loadCount++;
					this.complete = false;
					img.onload = () => this._handleImageLoad(src);
					img.onerror = () => this._handleImageError(src);
				}
			}
		}

		// parse frames:
		if (data.frames != null) {
			if (Array.isArray(data.frames)) {
				this._frames = [];
				for (let arr of data.frames) {
					this._frames.push({image:this._images[arr[4]?arr[4]:0], rect:new Rectangle(arr[0],arr[1],arr[2],arr[3]), regX:arr[5]||0, regY:arr[6]||0 });
				}
			} else {
				let o = data.frames;
				this._frameWidth = o.width;
				this._frameHeight = o.height;
				this._regX = o.regX||0;
				this._regY = o.regY||0;
				this._spacing = o.spacing||0;
				this._margin = o.margin||0;
				this._numFrames = o.count;
				if (this._loadCount === 0) { this._calculateFrames(); }
			}
		}

		// parse animations:
		this._animations = [];
		if (data.animations != null) {
			this._data = {};
			let o = data.animations;
			for (let name in o) {
				let anim = { name };
				let obj = o[name];
				let a;
				if (typeof obj === "number") { // single frame
					a = anim.frames = [obj];
				} else if (Array.isArray(obj)) { // simple
					if (obj.length === 1) { anim.frames = [obj[0]]; }
					else {
						anim.speed = obj[3];
						anim.next = obj[2];
						a = anim.frames = [];
						for (let i=obj[0];i<=obj[1];i++) {
							a.push(i);
						}
					}
				} else { // complex
					anim.speed = obj.speed;
					anim.next = obj.next;
					let frames = obj.frames;
					a = anim.frames = (typeof frames === "number") ? [frames] : frames.slice(0);
				}
				if (anim.next === true || anim.next === undefined) { anim.next = name; } // loop
				if (anim.next === false || (a.length < 2 && anim.next === name)) { anim.next = null; } // stop
				if (!anim.speed) { anim.speed = 1; }
				this._animations.push(name);
				this._data[name] = anim;
			}
		}
	}

	/**
	 * @emits easeljs.SpriteSheet#event:complete
	 * @protected
	 * @param {Object} src
	 */
	 _handleImageLoad (src) {
		if (--this._loadCount === 0) {
			this._calculateFrames();
			this.complete = true;
			this.dispatchEvent("complete");
		}
	}

	/**
	 * @emits easeljs.SpriteSheet#event:complete
	 * @emits easeljs.SpriteSheet#event:error
	 * @protected
	 * @param {Object} src
	 */
	_handleImageError (src) {
		let errorEvent = new Event("error");
		errorEvent.src = src;
		this.dispatchEvent(errorEvent);

		// Complete is still dispatched.
		if (--this._loadCount === 0) {
			this.dispatchEvent("complete");
		}
	}

	/**
	 * @protected
	 */
	_calculateFrames () {
		if (this._frames || this._frameWidth === 0) { return; }

		this._frames = [];

		let maxFrames = this._numFrames || 100000; // if we go over this, something is wrong.
		let frameCount = 0, frameWidth = this._frameWidth, frameHeight = this._frameHeight;
		let spacing = this._spacing, margin = this._margin;

		imgLoop:
		for (let i=0, imgs=this._images, l=imgs.length; i<l; i++) {
			let img = imgs[i],
				imgW = (img.width||img.naturalWidth),
				imgH = (img.height||img.naturalHeight);

			let y = margin;
			while (y <= imgH-margin-frameHeight) {
				let x = margin;
				while (x <= imgW-margin-frameWidth) {
					if (frameCount >= maxFrames) { break imgLoop; }
					frameCount++;
					this._frames.push({
						image: img,
						rect: new Rectangle(x, y, frameWidth, frameHeight),
						regX: this._regX,
						regY: this._regY
					});
					x += frameWidth+spacing;
				}
				y += frameHeight+spacing;
			}
		}
		this._numFrames = frameCount;
	}

}

/**
 * Dispatched when all images are loaded.  Note that this only fires if the images
 * were not fully loaded when the sprite sheet was initialized. You should check the complete property
 * to prior to adding a listener. Ex.
 *
 * 	var sheet = new createjs.SpriteSheet(data);
 * 	if (!sheet.complete) {
 * 		// not preloaded, listen for the complete event:
 * 		sheet.addEventListener("complete", handler);
 * 	}
 *
 * @event easeljs.SpriteSheet#complete
 * @property {Object} target The object that dispatched the event.
 * @property {String} type The event type.
 * @since 0.6.0
 */

/**
 * Dispatched when getFrame is called with a valid frame index. This is primarily intended for use by {@link easeljs.SpriteSheetBuilder}
 * when doing on-demand rendering.
 * @event easeljs.SpriteSheet#getframe
 * @property {Number} index The frame index.
 * @property {Object} frame The frame object that getFrame will return.
 */

/**
 * Dispatched when an image encounters an error. A SpriteSheet will dispatch an error event for each image that
 * encounters an error, and will still dispatch a {@link easeljs.SpriteSheet#event:complete}
 * event once all images are finished processing, even if an error is encountered.
 * @event easeljs.SpriteSheet#error
 * @property {String} src The source of the image that failed to load.
 * @since 0.8.2
 */
