/**
 * @license Sprite
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
import { Event } from "@createjs/core";

/**
 * Displays a frame or sequence of frames (ie. an animation) from a SpriteSheet instance. A sprite sheet is a series of
 * images (usually animation frames) combined into a single image. For example, an animation consisting of 8 100x100
 * images could be combined into a 400x200 sprite sheet (4 frames across by 2 high). You can display individual frames,
 * play frames as an animation, and even sequence animations together.
 *
 * @memberof easeljs
 * @extends easeljs.DisplayObject
 * @example
 * let sprite = new Sprite(spriteSheet);
 * sprite.gotoAndStop("frameName");
 *
 * Until {@link easeljs.Sprite#gotoAndStop} or {@link easeljs.Sprite#gotoAndPlay} is called,
 * only the first defined frame defined in the sprite sheet will be displayed.
 *
 * @see {@link easeljs.SpriteSheet "More information on setting up frames and animations."}
 * @param {SpriteSheet} spriteSheet The SpriteSheet instance to play back. This includes the source image(s), frame
 * dimensions, and frame data.
 * @param {String | Number} [frameOrAnimation] The frame number or animation to play initially.
 */
export default class Sprite extends DisplayObject {

	constructor (spriteSheet, frameOrAnimation) {
		super();

		/**
		 * The frame index that will be drawn when draw is called. Note that with some {@link easeljs.SpriteSheet}
		 * definitions, this will advance non-sequentially. This will always be an integer value.
		 * @type {Number}
		 * @default 0
		 * @readonly
		 */
		this.currentFrame = 0;

		/**
		 * Returns the name of the currently playing animation.
		 * @type {String}
		 * @readonly
		 */
		this.currentAnimation = null;

		/**
		 * Prevents the animation from advancing each tick automatically. For example, you could create a sprite
		 * sheet of icons, set paused to true, and display the appropriate icon by setting `currentFrame`.
		 * @type {Boolean}
		 * @default true
		 */
		this.paused = true;

		/**
		 * The SpriteSheet instance to play back. This includes the source image, frame dimensions, and frame data.
		 * @type {easeljs.SpriteSheet}
		 * @readonly
		 */
		this.spriteSheet = spriteSheet;

		/**
		 * Specifies the current frame index within the currently playing animation. When playing normally, this will increase
		 * from 0 to n-1, where n is the number of frames in the current animation.
		 * This could be a non-integer value if using time-based playback, or if the animation's speed is not an integer.
		 * @see {@link easeljs.Sprite#framerate}
		 * @type {Number}
		 * @default 0
		 */
		this.currentAnimationFrame = 0;

		/**
		 * By default Sprite instances advance one frame per tick. Specifying a framerate for the Sprite (or its related
		 * SpriteSheet) will cause it to advance based on elapsed time between ticks as appropriate to maintain the target
		 * framerate.
		 *
		 * For example, if a Sprite with a framerate of 10 is placed on a Stage being updated at 40fps, then the Sprite will
		 * advance roughly one frame every 4 ticks. This will not be exact, because the time between each tick will
		 * vary slightly between frames.
		 *
		 * This feature is dependent on the tick event object (or an object with an appropriate "delta" property) being
		 * passed into {@link easeljs.Stage#update}.
		 * @type {Number}
		 * @default 0
		 */
		this.framerate = 0;

		/**
		 * Current animation object.
		 * @protected
		 * @type {Object}
		 * @default null
		 */
		this._animation = null;

		/**
		 * Current frame index.
		 * @protected
		 * @type {Number}
		 * @default null
		 */
		this._currentFrame = null;

		/**
		 * Skips the next auto advance. Used by gotoAndPlay to avoid immediately jumping to the next frame
		 * @protected
		 * @type {Boolean}
		 * @default false
		 */
		this._skipAdvance = false;

		/**
		 * Set as compatible with WebGL.
		 * @protected
		 * @type {Number}
		 * @default 1
		 */
		this._webGLRenderStyle = DisplayObject._StageGL_SPRITE;

		if (frameOrAnimation != null) {
			this.gotoAndPlay(frameOrAnimation);
		}
	}

	isVisible () {
		let hasContent = this.cacheCanvas || this.spriteSheet.complete;
		return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent);
	}

	draw (ctx, ignoreCache) {
		if (super.draw(ctx, ignoreCache)) { return true; }
		this._normalizeFrame();
		let o = this.spriteSheet.getFrame(this._currentFrame|0);
		if (!o) { return false; }
		let rect = o.rect;
		if (rect.width && rect.height) { ctx.drawImage(o.image, rect.x, rect.y, rect.width, rect.height, -o.regX, -o.regY, rect.width, rect.height); }
		return true;
	}

	// Note, the doc sections below document using the specified APIs (from DisplayObject) from
	// Bitmap. This is why they have no method implementations.

	/**
	 * Because the content of a Sprite is already in a raster format, cache is unnecessary for Sprite instances.
	 * You should not cache Sprite instances as it can degrade performance.
	 * @name easeljs.Sprite#cache
	 */

	/**
	 * Because the content of a Sprite is already in a raster format, cache is unnecessary for Sprite instances.
	 * You should not cache Sprite instances as it can degrade performance.
	 * @name easeljs.Sprite#updateCache
	 */

	/**
	 * Because the content of a Sprite is already in a raster format, cache is unnecessary for Sprite instances.
	 * You should not cache Sprite instances as it can degrade performance.
	 * @name easeljs.Sprite#uncache
	 */

	/**
	 * Play (unpause) the current animation. The Sprite will be paused if either {@link easeljs.Sprite#stop}
	 * or {@link easeljs.Sprite#gotoAndStop} is called. Single frame animations will remain unchanged.
	 */
	play () {
		this.paused = false;
	}

	/**
	 * Stop playing a running animation. The Sprite will be playing if {@link easeljs.Sprite#gotoAndPlay} is called.
	 * Note that calling `gotoAndPlay()` or {@link easeljs.Sprite#play} will resume playback.
	 */
	stop () {
		this.paused = true;
	}

	/**
	 * Sets paused to false and plays the specified animation name, named frame, or frame number.
	 * @param {String | Number} frameOrAnimation The frame number or animation name that the playhead should move to
	 * and begin playing.
	 */
	gotoAndPlay (frameOrAnimation) {
		this.paused = false;
		this._skipAdvance = true;
		this._goto(frameOrAnimation);
	}

	/**
	 * Sets paused to true and seeks to the specified animation name, named frame, or frame number.
	 * @param {String | Number} frameOrAnimation The frame number or animation name that the playhead should move to
	 * and stop.
	 */
	gotoAndStop (frameOrAnimation) {
		this.paused = true;
		this._goto(frameOrAnimation);
	}

	/**
	 * Advances the playhead. This occurs automatically each tick by default.
	 * @param {Number} [time] The amount of time in ms to advance by. Only applicable if framerate is set on the Sprite
	 * or its SpriteSheet.
	*/
	advance (time) {
		let fps = this.framerate || this.spriteSheet.framerate;
		let t = (fps && time != null) ? time/(1000/fps) : 1;
		this._normalizeFrame(t);
	}

	/**
	 * Returns a {@link easeljs.Rectangle} instance defining the bounds of the current frame relative to
	 * the origin. For example, a 90 x 70 frame with `regX=50` and `regY=40` would return a
	 * rectangle with [x=-50, y=-40, width=90, height=70]. This ignores transformations on the display object.
	 *
	 * @see {@link easeljs.SpriteSheet#frameBounds}
	 * @return {easeljs.Rectangle} A Rectangle instance. Returns null if the frame does not exist, or the image is not fully loaded.
	 */
	getBounds () {
		// TODO: should this normalizeFrame?
		return super.getBounds() || this.spriteSheet.getFrameBounds(this.currentFrame, this._rectangle);
	}

	/**
	 * Returns a clone of the Sprite instance. Note that the same SpriteSheet is shared between cloned instances.
	 * @return {easeljs.Sprite} a clone of the Sprite instance.
	 */
	clone () {
		return this._cloneProps(new Sprite(this.spriteSheet));
	}

	/**
	 * @param {easeljs.Sprite} o
	 * @return {easeljs.Sprite} o
	 * @protected
	 */
	_cloneProps (o) {
		super._cloneProps(o);
		o.currentFrame = this.currentFrame;
		o.currentAnimation = this.currentAnimation;
		o.paused = this.paused;
		o.currentAnimationFrame = this.currentAnimationFrame;
		o.framerate = this.framerate;

		o._animation = this._animation;
		o._currentFrame = this._currentFrame;
		o._skipAdvance = this._skipAdvance;
		return o;
	}

	_tick (evtObj) {
		if (!this.paused) {
			if (!this._skipAdvance) { this.advance(evtObj&&evtObj.delta); }
			this._skipAdvance = false;
		}
		super._tick(evtObj);
	}

	/**
	 * Normalizes the current frame, advancing animations and dispatching callbacks as appropriate.
	 * @protected
	 * @param {Number} [frameDelta=0]
	 */
	_normalizeFrame (frameDelta = 0) {
		let animation = this._animation;
		let paused = this.paused;
		let frame = this._currentFrame;

		if (animation) {
			let speed = animation.speed || 1;
			let animFrame = this.currentAnimationFrame;
			let l = animation.frames.length;
			if (animFrame + frameDelta * speed >= l) {
				let next = animation.next;
				if (this._dispatchAnimationEnd(animation, frame, paused, next, l - 1)) {
					// something changed in the event stack, so we shouldn't make any more changes here.
					return;
				} else if (next) {
					// sequence. Automatically calls _normalizeFrame again with the remaining frames.
					return this._goto(next, frameDelta - (l - animFrame) / speed);
				} else {
					// end.
					this.paused = true;
					animFrame = animation.frames.length - 1;
				}
			} else {
				animFrame += frameDelta * speed;
			}
			this.currentAnimationFrame = animFrame;
			this._currentFrame = animation.frames[animFrame | 0]
		} else {
			frame = (this._currentFrame += frameDelta);
			let l = this.spriteSheet.getNumFrames();
			if (frame >= l && l > 0) {
				if (!this._dispatchAnimationEnd(animation, frame, paused, l - 1)) {
					// looped.
					if ((this._currentFrame -= l) >= l) { return this._normalizeFrame(); }
				}
			}
		}
		frame = this._currentFrame | 0;
		if (this.currentFrame != frame) {
			this.currentFrame = frame;
			this.dispatchEvent("change");
		}
	};

	/**
	 * Dispatches the "animationend" event. Returns true if a handler changed the animation (ex. calling {@link easlejs.Sprite#stop},
	 * {@link easeljs.Sprite#gotoAndPlay}, etc.)
	 * @param animation
	 * @param frame
	 * @param paused
	 * @param next
	 * @param end
	 * @private
	 */
	_dispatchAnimationEnd (animation, frame, paused, next, end) {
		let name = animation ? animation.name : null;
		if (this.hasEventListener("animationend")) {
			let evt = new Event("animationend");
			evt.name = name;
			evt.next = next;
			this.dispatchEvent(evt);
		}
		// did the animation get changed in the event stack?:
		let changed = (this._animation != animation || this._currentFrame != frame);
		// if the animation hasn't changed, but the sprite was paused, then we want to stick to the last frame:
		if (!changed && !paused && this.paused) { this.currentAnimationFrame = end; changed = true; }
		return changed;
	}

	/**
	 * Moves the playhead to the specified frame number or animation.
	 * @param {String | Number} frameOrAnimation The frame number or animation that the playhead should move to.
	 * @param {Number} [frame=0] The frame of the animation to go to. Defaults to 0.
	 * @protected
	 */
	_goto (frameOrAnimation, frame = 0) {
		this.currentAnimationFrame = 0;
		if (isNaN(frameOrAnimation)) {
			let data = this.spriteSheet.getAnimation(frameOrAnimation);
			if (data) {
				this._animation = data;
				this.currentAnimation = frameOrAnimation;
				this._normalizeFrame(frame);
			}
		} else {
			this.currentAnimation = this._animation = null;
			this._currentFrame = frameOrAnimation;
			this._normalizeFrame();
		}
	}

}

/**
 * Dispatched when an animation reaches its ends.
 * @event easeljs.Sprite#animationend
 * @property {Object} target The object that dispatched the event.
 * @property {String} type The event type.
 * @property {String} name The name of the animation that just ended.
 * @property {String} next The name of the next animation that will be played, or null. This will be the same as name if the animation is looping.
 * @since 0.6.0
 */

/**
 * Dispatched any time the current frame changes. For example, this could be due to automatic advancement on a tick,
 * or calling gotoAndPlay() or gotoAndStop().
 * @event easeljs.Sprite#change
 * @property {Object} target The object that dispatched the event.
 * @property {String} type The event type.
 */
