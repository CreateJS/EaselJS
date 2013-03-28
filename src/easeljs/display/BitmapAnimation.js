/*
* BitmapAnimation
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

// namespace:
this.createjs = this.createjs||{};

(function() {
	
/**
 * Displays frames or sequences of frames (ie. animations) from a sprite sheet image. A sprite sheet is a series of
 * images (usually animation frames) combined into a single image. For example, an animation consisting of 8 100x100
 * images could be combined into a 400x200 sprite sheet (4 frames across by 2 high). You can display individual frames,
 * play frames as an animation, and even sequence animations together.
 *
 * See the {{#crossLink "SpriteSheet"}}{{/crossLink}} class for more information on setting up frames and animations.
 *
 * <h4>Example</h4>
 *      var instance = new createjs.BitmapAnimation(spriteSheet);
 *      instance.gotoAndStop("frameName");
 *
 * Currently, you <strong>must</strong> call either {{#crossLink "BitmapAnimation/gotoAndStop"}}{{/crossLink}} or
 * {{#crossLink "BitmapAnimation/gotoAndPlay"}}{{/crossLink}}, or nothing will display on stage.
 *
 * @class BitmapAnimation
 * @extends DisplayObject
 * @uses EventDispatcher
 * @constructor
 * @param {SpriteSheet} spriteSheet The SpriteSheet instance to play back. This includes the source image(s), frame
 * dimensions, and frame data. See {{#crossLink "SpriteSheet"}}{{/crossLink}} for more information.
 **/
var BitmapAnimation = function(spriteSheet) {
  this.initialize(spriteSheet);
}
var p = BitmapAnimation.prototype = new createjs.DisplayObject();

// events:
	
	/**
	 * Dispatched when an animation reaches its ends.
	 * @event animationend
	 * @param {Object} target The object that dispatched the event.
	 * @param {String} type The event type.
	 * @param {String} name The name of the animation that just ended.
	 * @param {String} next The name of the next animation that will be played, or null. This will be the same as name if the animation is looping.
	 * @since 0.6.0
	 */

// public properties:
	 
	/**
	 * Specifies a function to call whenever any animation reaches its end. It will be called with three
	 * params: the first will be a reference to this instance, the second will be the name of the animation
	 * that just ended, and the third will be the name of the next animation that will be played.
	 * @property onAnimationEnd
	 * @type {Function}
	 * @deprecated In favour of the "animationend" event. Will be removed in a future version.
	 */
	p.onAnimationEnd = null;

	/**
	 * The frame that will be drawn when draw is called. Note that with some SpriteSheet data, this
	 * will advance non-sequentially. READ-ONLY.
	 * @property currentFrame
	 * @type {Number}
	 * @default -1
	 **/
	p.currentFrame = -1;

	/**
	 * Returns the currently playing animation. READ-ONLY.
	 * @property currentAnimation
	 * @type {String}
	 * @final
	 **/
	p.currentAnimation = null; // READ-ONLY

	/**
	 * Prevents the animation from advancing each tick automatically. For example, you could create a sprite
	 * sheet of icons, set paused to true, and display the appropriate icon by setting <code>currentFrame</code>.
	 * @property paused
	 * @type {Boolean}
	 * @default false
	 **/
	p.paused = true;

	/**
	 * The SpriteSheet instance to play back. This includes the source image, frame dimensions, and frame
	 * data. See {{#crossLink "SpriteSheet"}}{{/crossLink}} for more information.
	 * @property spriteSheet
	 * @type {SpriteSheet}
	 **/
	p.spriteSheet = null;

	/**
	 * Whether or not the image should be draw to the canvas at whole pixel coordinates.
	 * @property snapToPixel
	 * @type {Boolean}
	 * @default true
	 **/
	p.snapToPixel = true;
	
	/** 
	 * When used in conjunction with animations having an frequency greater than 1, this lets you offset which tick the
	 * playhead will advance on. For example, you could create two BitmapAnimations, both playing an animation with a
	 * frequency of 2, but one having offset set to 1. Both instances would advance every second tick, but they would
	 * advance on alternating ticks (effectively, one instance would advance on odd ticks, the other on even ticks).
	 * @property offset
	 * @type {Number}
	 * @default 0
	 */
	p.offset = 0;
	
	
	/**
	 * Specifies the current frame index within the current playing animation. When playing normally, this will increase
	 * successively from 0 to n-1, where n is the number of frames in the current animation.
	 * @property currentAnimationFrame
	 * @type {Number}
	 * @default 0
	 **/
	p.currentAnimationFrame = 0;
	
// mix-ins:
	// EventDispatcher methods:
	p.addEventListener = null;
	p.removeEventListener = null;
	p.removeAllEventListeners = null;
	p.dispatchEvent = null;
	p.hasEventListener = null;
	p._listeners = null;
	createjs.EventDispatcher.initialize(p); // inject EventDispatcher methods.

// private properties:
	/**
	 * @property _advanceCount
	 * @protected
	 * @type {Number}
	 * @default 0
	 **/
	p._advanceCount = 0;
	
	/**
	 * @property _animation
	 * @protected
	 * @type {Object}
	 * @default null
	 **/
	p._animation = null;

// constructor:
	/**
	 * @property DisplayObject_initialize
	 * @type {Function}
	 * @private
	 **/
	p.DisplayObject_initialize = p.initialize;

	/**
	 * Initialization method.
	 * @method initialize
	 * @protected
	*/
	p.initialize = function(spriteSheet) {
		this.DisplayObject_initialize();
		this.spriteSheet = spriteSheet;
	}

	/**
	 * Returns true or false indicating whether the display object would be visible if drawn to a canvas.
	 * This does not account for whether it would be visible within the boundaries of the stage.
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method isVisible
	 * @return {Boolean} Boolean indicating whether the display object would be visible if drawn to a canvas
	 **/
	p.isVisible = function() {
		var hasContent = this.cacheCanvas || (this.spriteSheet.complete && this.currentFrame >= 0);
		return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent);
	}

	/**
	 * @property DisplayObject_draw
	 * @type {Function}
	 * @private
	 **/
	p.DisplayObject_draw = p.draw;

	/**
	 * Draws the display object into the specified context ignoring it's visible, alpha, shadow, and transform.
	 * Returns true if the draw was handled (useful for overriding functionality).
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method draw
	 * @param {CanvasRenderingContext2D} ctx The canvas 2D context object to draw into.
	 * @param {Boolean} ignoreCache Indicates whether the draw operation should ignore any current cache.
	 * For example, used for drawing the cache (to prevent it from simply drawing an existing cache back
	 * into itself).
	 **/
	p.draw = function(ctx, ignoreCache) {
		if (this.DisplayObject_draw(ctx, ignoreCache)) { return true; }
		this._normalizeFrame();
		var o = this.spriteSheet.getFrame(this.currentFrame);
		if (!o) { return; }
		var rect = o.rect;
		ctx.drawImage(o.image, rect.x, rect.y, rect.width, rect.height, -o.regX, -o.regY, rect.width, rect.height);
		return true;
	}

	//Note, the doc sections below document using the specified APIs (from DisplayObject)  from
	//Bitmap. This is why they have no method implementations.

	/**
	 * Because the content of a Bitmap is already in a simple format, cache is unnecessary for Bitmap instances.
	 * You should not cache Bitmap instances as it can degrade performance.
	 * @method cache
	 **/

	/**
	 * Because the content of a Bitmap is already in a simple format, cache is unnecessary for Bitmap instances.
	 * You should not cache Bitmap instances as it can degrade performance.
	 * @method updateCache
	 **/

	/**
	 * Because the content of a Bitmap is already in a simple format, cache is unnecessary for Bitmap instances.
	 * You should not cache Bitmap instances as it can degrade performance.
	 * @method uncache
	 **/
	
	/**
	 * Begin playing a paused animation. The BitmapAnimation will be paused if either {{#crossLink "BitmapAnimation/stop"}}{{/crossLink}}
	 * or {{#crossLink "BitmapAnimation/gotoAndStop"}}{{/crossLink}} is called. Single frame animations will remain
	 * unchanged.
	 * @method play
	 **/
	p.play = function() {
		this.paused = false;
	}
	
	/**
	 * Stop playing a running animation. The BitmapAnimation will be playing if {{#crossLink "BitmapAnimation/gotoAndPlay"}}{{/crossLink}}
	 * is called. Note that calling {{#crossLink "BitmapAnimation/gotoAndPlay"}}{{/crossLink}} or {{#crossLink "BitmapAnimation/play"}}{{/crossLink}}
	 * will resume playback.
	 * @method stop
	 **/
	p.stop = function() {
		this.paused = true;
	}

	/**
	 * Sets paused to false and plays the specified animation name, named frame, or frame number.
	 * @method gotoAndPlay
	 * @param {String|Number} frameOrAnimation The frame number or animation name that the playhead should move to
	 * and begin playing.
	 **/
	p.gotoAndPlay = function(frameOrAnimation) {
		this.paused = false;
		this._goto(frameOrAnimation);
	}

	/**
	 * Sets paused to true and seeks to the specified animation name, named frame, or frame number.
	 * @method gotoAndStop
	 * @param {String|Number} frameOrAnimation The frame number or animation name that the playhead should move to
	 * and stop.
	 **/
	p.gotoAndStop = function(frameOrAnimation) {
		this.paused = true;
		this._goto(frameOrAnimation);
	}

	/**
	 * Advances the playhead. This occurs automatically each tick by default.
	 * @method advance
	*/
	p.advance = function() {
		if (this._animation) { this.currentAnimationFrame++; }
		else { this.currentFrame++; }
		this._normalizeFrame();
	}
	
	/**
	 * Returns a {{#crossLink "Rectangle"}}{{/crossLink}} instance defining the bounds of the current frame relative to
	 * the origin. For example, a 90 x 70 frame with <code>regX=50</code> and <code>regY=40</code> would return a
	 * rectangle with [x=-50, y=-40, width=90, height=70].
	 *
	 * Also see the SpriteSheet {{#crossLink "SpriteSheet/getFrameBounds"}}{{/crossLink}} method.
	 * @method getBounds
	 * @return {Rectangle} A Rectangle instance. Returns null if the frame does not exist, or the image is not fully
	 * loaded.
	 **/
	p.getBounds = function() {
		return this.spriteSheet.getFrameBounds(this.currentFrame);
	}

	/**
	 * Returns a clone of the BitmapAnimation instance. Note that the same SpriteSheet is shared between cloned
	 * instances.
	 * @method clone
	 * @return {BitmapAnimation} a clone of the BitmapAnimation instance.
	 **/
	p.clone = function() {
		var o = new BitmapAnimation(this.spriteSheet);
		this.cloneProps(o);
		return o;
	}

	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 **/
	p.toString = function() {
		return "[BitmapAnimation (name="+  this.name +")]";
	}

// private methods:
	/**
	 * @property DisplayObject__tick
	 * @type {Function}
	 * @private
	 **/
	p.DisplayObject__tick = p._tick;
	
	/**
	 * Advances the <code>currentFrame</code> if paused is not true. This is called automatically when the {{#crossLink "Stage"}}{{/crossLink}}
	 * ticks.
	 * @protected
	 * @method _tick
	 **/
	p._tick = function(params) {
		var f = this._animation ? this._animation.frequency : 1;
		if (!this.paused && ((++this._advanceCount)+this.offset)%f == 0) {
			this.advance();
		}
		this.DisplayObject__tick(params);
	}
	
	
	/**
	 * Normalizes the current frame, advancing animations and dispatching callbacks as appropriate.
	 * @protected
	 * @method _normalizeCurrentFrame
	 **/
	p._normalizeFrame = function() { 
		var animation = this._animation;
		var frame = this.currentFrame;
		var paused = this.paused;
		var l;
		
		if (animation) {
			l = animation.frames.length;
			if (this.currentAnimationFrame >= l) {
				var next = animation.next;
				if (this._dispatchAnimationEnd(animation, frame, paused, next, l-1)) {
					// do nothing, something changed in the event stack.
				} else if (next) {
					this._goto(next);
				} else {
					this.paused = true;
					this.currentAnimationFrame = animation.frames.length-1;
					this.currentFrame = animation.frames[this.currentAnimationFrame];
				}
			} else {
				this.currentFrame = animation.frames[this.currentAnimationFrame];
			}
		} else {
			l = this.spriteSheet.getNumFrames();
			if (frame >= l) {
				if (!this._dispatchAnimationEnd(animation, frame, paused, l-1)) { this.currentFrame = 0; }
			}
		}
	}
	
	/**
	 * Dispatches the "animationend" event. Returns true if a handler changed the animation (ex. calling {{#crossLink "BitmapAnimation/stop"}}{{/crossLink}},
	 * {{#crossLink "BitmapAnimation/gotoAndPlay"}}{{/crossLink}}, etc.)
	 * @property _dispatchAnimationEnd
	 * @private
	 * @type {Function}
	 **/
	p._dispatchAnimationEnd = function(animation, frame, paused, next, end) {
		var name = animation ? animation.name : null;
		this.onAnimationEnd&&this.onAnimationEnd(this, name, next);
		this.dispatchEvent({type:"animationend", name:name, next:next});
		if (!paused && this.paused) { this.currentAnimationFrame = end; }
		return (this.paused != paused || this._animation != animation || this.currentFrame != frame);
	}

	/**
	 * @property DisplayObject_cloneProps
	 * @private
	 * @type {Function}
	 **/
	p.DisplayObject_cloneProps = p.cloneProps;

	/**
	 * @method cloneProps
	 * @param {Text} o
	 * @protected
	 **/
	p.cloneProps = function(o) {
		this.DisplayObject_cloneProps(o);
		o.onAnimationEnd = this.onAnimationEnd;
		o.currentFrame = this.currentFrame;
		o.currentAnimation = this.currentAnimation;
		o.paused = this.paused;
		o.offset = this.offset;
		o._animation = this._animation;
		o.currentAnimationFrame = this.currentAnimationFrame;
	}

	/**
	 * Moves the playhead to the specified frame number or animation.
	 * @method _goto
	 * @param {String|Number} frameOrAnimation The frame number or animation that the playhead should move to.
	 * @protected
	 **/
	p._goto = function(frameOrAnimation) {
		if (isNaN(frameOrAnimation)) {
			var data = this.spriteSheet.getAnimation(frameOrAnimation);
			if (data) {
				this.currentAnimationFrame = 0;
				this._animation = data;
				this.currentAnimation = frameOrAnimation;
				this._normalizeFrame();
			}
		} else {
			this.currentAnimation = this._animation = null;
			this.currentFrame = frameOrAnimation;
		}
	}

createjs.BitmapAnimation = BitmapAnimation;
}());
