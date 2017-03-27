/*
* Sprite
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
this.createjs = this.createjs||{};

(function() {
	"use strict";


// constructor:
	/**
	 * Displays a frame or sequence of frames (ie. an animation) from a SpriteSheet instance. A sprite sheet is a series of
	 * images (usually animation frames) combined into a single image. For example, an animation consisting of 8 100x100
	 * images could be combined into a 400x200 sprite sheet (4 frames across by 2 high). You can display individual frames,
	 * play frames as an animation, and even sequence animations together.
	 *
	 * See the {{#crossLink "SpriteSheet"}}{{/crossLink}} class for more information on setting up frames and animations.
	 *
	 * <h4>Example</h4>
	 *
	 *      var instance = new createjs.Sprite(spriteSheet);
	 *      instance.gotoAndStop("frameName");
	 *
	 * Until {{#crossLink "Sprite/gotoAndStop"}}{{/crossLink}} or {{#crossLink "Sprite/gotoAndPlay"}}{{/crossLink}} is called,
	 * only the first defined frame defined in the sprite sheet will be displayed.
	 *
	 * @class Sprite
	 * @extends DisplayObject
	 * @constructor
	 * @param {SpriteSheet} spriteSheet The SpriteSheet instance to play back. This includes the source image(s), frame
	 * dimensions, and frame data. See {{#crossLink "SpriteSheet"}}{{/crossLink}} for more information.
	 * @param {String|Number} [frameOrAnimation] The frame number or animation to play initially.
	 **/
	function Sprite(spriteSheet, frameOrAnimation) {
		this.DisplayObject_constructor();
		
		
	// public properties:
		/**
		 * The frame index that will be drawn when draw is called. Note that with some {{#crossLink "SpriteSheet"}}{{/crossLink}}
		 * definitions, this will advance non-sequentially. This will always be an integer value.
		 * @property currentFrame
		 * @type {Number}
		 * @default 0
		 * @readonly
		 **/
		this.currentFrame = 0;
	
		/**
		 * Returns the name of the currently playing animation.
		 * @property currentAnimation
		 * @type {String}
		 * @final
		 * @readonly
		 **/
		this.currentAnimation = null;
	
		/**
		 * Prevents the animation from advancing each tick automatically. For example, you could create a sprite
		 * sheet of icons, set paused to true, and display the appropriate icon by setting <code>currentFrame</code>.
		 * @property paused
		 * @type {Boolean}
		 * @default false
		 **/
		this.paused = true;
	
		/**
		 * The SpriteSheet instance to play back. This includes the source image, frame dimensions, and frame
		 * data. See {{#crossLink "SpriteSheet"}}{{/crossLink}} for more information.
		 * @property spriteSheet
		 * @type {SpriteSheet}
		 * @readonly
		 **/
		this.spriteSheet = spriteSheet;
	
		/**
		 * Specifies the current frame index within the currently playing animation. When playing normally, this will increase
		 * from 0 to n-1, where n is the number of frames in the current animation.
		 *
		 * This could be a non-integer value if
		 * using time-based playback (see {{#crossLink "Sprite/framerate"}}{{/crossLink}}, or if the animation's speed is
		 * not an integer.
		 * @property currentAnimationFrame
		 * @type {Number}
		 * @default 0
		 **/
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
		 * passed into {{#crossLink "Stage/update"}}{{/crossLink}}.
		 * @property framerate
		 * @type {Number}
		 * @default 0
		 **/
		this.framerate = 0;
	
	
	// private properties:
		/**
		 * Current animation object.
		 * @property _animation
		 * @protected
		 * @type {Object}
		 * @default null
		 **/
		this._animation = null;
	
		/**
		 * Current frame index.
		 * @property _currentFrame
		 * @protected
		 * @type {Number}
		 * @default null
		 **/
		this._currentFrame = null;
		
		/**
		 * Skips the next auto advance. Used by gotoAndPlay to avoid immediately jumping to the next frame
		 * @property _skipAdvance
		 * @protected
		 * @type {Boolean}
		 * @default false
		 **/
		this._skipAdvance = false;

		/**
		 * Docced in superclass.
		 */
		this._webGLRenderStyle = createjs.DisplayObject._StageGL_SPRITE;

		if (frameOrAnimation != null) { this.gotoAndPlay(frameOrAnimation); }
	}
	var p = createjs.extend(Sprite, createjs.DisplayObject);

	/**
	 * Constructor alias for backwards compatibility. This method will be removed in future versions.
	 * Subclasses should be updated to use {{#crossLink "Utility Methods/extends"}}{{/crossLink}}.
	 * @method initialize
	 * @deprecated in favour of `createjs.promote()`
	 **/
	p.initialize = Sprite; // TODO: Deprecated. This is for backwards support of Flash/Animate spritesheet export.


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
	 
	/**
	 * Dispatched any time the current frame changes. For example, this could be due to automatic advancement on a tick,
	 * or calling gotoAndPlay() or gotoAndStop().
	 * @event change
	 * @param {Object} target The object that dispatched the event.
	 * @param {String} type The event type.
	 */


// public methods:
	/**
	 * Returns true or false indicating whether the display object would be visible if drawn to a canvas.
	 * This does not account for whether it would be visible within the boundaries of the stage.
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method isVisible
	 * @return {Boolean} Boolean indicating whether the display object would be visible if drawn to a canvas
	 **/
	p.isVisible = function() {
		var hasContent = this.cacheCanvas || this.spriteSheet.complete;
		return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent);
	};

	/**
	 * Draws the display object into the specified context ignoring its visible, alpha, shadow, and transform.
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
		var o = this.spriteSheet.getFrame(this._currentFrame|0);
		if (!o) { return false; }
		var rect = o.rect;
		if (rect.width && rect.height) { ctx.drawImage(o.image, rect.x, rect.y, rect.width, rect.height, -o.regX, -o.regY, rect.width, rect.height); }
		return true;
	};

	//Note, the doc sections below document using the specified APIs (from DisplayObject)  from
	//Bitmap. This is why they have no method implementations.

	/**
	 * Because the content of a Sprite is already in a raster format, cache is unnecessary for Sprite instances.
	 * You should not cache Sprite instances as it can degrade performance.
	 * @method cache
	 **/

	/**
	 * Because the content of a Sprite is already in a raster format, cache is unnecessary for Sprite instances.
	 * You should not cache Sprite instances as it can degrade performance.
	 * @method updateCache
	 **/

	/**
	 * Because the content of a Sprite is already in a raster format, cache is unnecessary for Sprite instances.
	 * You should not cache Sprite instances as it can degrade performance.
	 * @method uncache
	 **/

	/**
	 * Play (unpause) the current animation. The Sprite will be paused if either {{#crossLink "Sprite/stop"}}{{/crossLink}}
	 * or {{#crossLink "Sprite/gotoAndStop"}}{{/crossLink}} is called. Single frame animations will remain
	 * unchanged.
	 * @method play
	 **/
	p.play = function() {
		this.paused = false;
	};

	/**
	 * Stop playing a running animation. The Sprite will be playing if {{#crossLink "Sprite/gotoAndPlay"}}{{/crossLink}}
	 * is called. Note that calling {{#crossLink "Sprite/gotoAndPlay"}}{{/crossLink}} or {{#crossLink "Sprite/play"}}{{/crossLink}}
	 * will resume playback.
	 * @method stop
	 **/
	p.stop = function() {
		this.paused = true;
	};

	/**
	 * Sets paused to false and plays the specified animation name, named frame, or frame number.
	 * @method gotoAndPlay
	 * @param {String|Number} frameOrAnimation The frame number or animation name that the playhead should move to
	 * and begin playing.
	 **/
	p.gotoAndPlay = function(frameOrAnimation) {
		this.paused = false;
		this._skipAdvance = true;
		this._goto(frameOrAnimation);
	};

	/**
	 * Sets paused to true and seeks to the specified animation name, named frame, or frame number.
	 * @method gotoAndStop
	 * @param {String|Number} frameOrAnimation The frame number or animation name that the playhead should move to
	 * and stop.
	 **/
	p.gotoAndStop = function(frameOrAnimation) {
		this.paused = true;
		this._goto(frameOrAnimation);
	};

	/**
	 * Advances the playhead. This occurs automatically each tick by default.
	 * @param [time] {Number} The amount of time in ms to advance by. Only applicable if framerate is set on the Sprite
	 * or its SpriteSheet.
	 * @method advance
	*/
	p.advance = function(time) {
		var fps = this.framerate || this.spriteSheet.framerate;
		var t = (fps && time != null) ? time/(1000/fps) : 1;
		this._normalizeFrame(t);
	};
	
	/**
	 * Returns a {{#crossLink "Rectangle"}}{{/crossLink}} instance defining the bounds of the current frame relative to
	 * the origin. For example, a 90 x 70 frame with <code>regX=50</code> and <code>regY=40</code> would return a
	 * rectangle with [x=-50, y=-40, width=90, height=70]. This ignores transformations on the display object.
	 *
	 * Also see the SpriteSheet {{#crossLink "SpriteSheet/getFrameBounds"}}{{/crossLink}} method.
	 * @method getBounds
	 * @return {Rectangle} A Rectangle instance. Returns null if the frame does not exist, or the image is not fully
	 * loaded.
	 **/
	p.getBounds = function() {
		// TODO: should this normalizeFrame?
		return this.DisplayObject_getBounds() || this.spriteSheet.getFrameBounds(this.currentFrame, this._rectangle);
	};

	/**
	 * Returns a clone of the Sprite instance. Note that the same SpriteSheet is shared between cloned
	 * instances.
	 * @method clone
	 * @return {Sprite} a clone of the Sprite instance.
	 **/
	p.clone = function() {
		return this._cloneProps(new Sprite(this.spriteSheet));
	};

	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 **/
	p.toString = function() {
		return "[Sprite (name="+  this.name +")]";
	};

// private methods:
	/**
	 * @method _cloneProps
	 * @param {Sprite} o
	 * @return {Sprite} o
	 * @protected
	 **/
	p._cloneProps = function(o) {
		this.DisplayObject__cloneProps(o);
		o.currentFrame = this.currentFrame;
		o.currentAnimation = this.currentAnimation;
		o.paused = this.paused;
		o.currentAnimationFrame = this.currentAnimationFrame;
		o.framerate = this.framerate;
		
		o._animation = this._animation;
		o._currentFrame = this._currentFrame;
		o._skipAdvance = this._skipAdvance;
		return o;
	};
	
	/**
	 * Advances the <code>currentFrame</code> if paused is not true. This is called automatically when the {{#crossLink "Stage"}}{{/crossLink}}
	 * ticks.
	 * @param {Object} evtObj An event object that will be dispatched to all tick listeners. This object is reused between dispatchers to reduce construction & GC costs.
	 * @protected
	 * @method _tick
	 **/
	p._tick = function(evtObj) {
		if (!this.paused) {
			if (!this._skipAdvance) { this.advance(evtObj&&evtObj.delta); }
			this._skipAdvance = false;
		}
		this.DisplayObject__tick(evtObj);
	};


	/**
	 * Normalizes the current frame, advancing animations and dispatching callbacks as appropriate.
	 * @protected
	 * @method _normalizeFrame
	 **/
	p._normalizeFrame = function(frameDelta) {
		frameDelta = frameDelta || 0;
		var animation = this._animation;
		var paused = this.paused;
		var frame = this._currentFrame;
		var l;
		
		if (animation) {
			var speed = animation.speed || 1;
			var animFrame = this.currentAnimationFrame;
			l = animation.frames.length;
			if (animFrame + frameDelta * speed >= l) {
				var next = animation.next;
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
			l = this.spriteSheet.getNumFrames();
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
	 * Dispatches the "animationend" event. Returns true if a handler changed the animation (ex. calling {{#crossLink "Sprite/stop"}}{{/crossLink}},
	 * {{#crossLink "Sprite/gotoAndPlay"}}{{/crossLink}}, etc.)
	 * @property _dispatchAnimationEnd
	 * @private
	 * @type {Function}
	 **/
	p._dispatchAnimationEnd = function(animation, frame, paused, next, end) {
		var name = animation ? animation.name : null;
		if (this.hasEventListener("animationend")) {
			var evt = new createjs.Event("animationend");
			evt.name = name;
			evt.next = next;
			this.dispatchEvent(evt);
		}
		// did the animation get changed in the event stack?:
		var changed = (this._animation != animation || this._currentFrame != frame);
		// if the animation hasn't changed, but the sprite was paused, then we want to stick to the last frame:
		if (!changed && !paused && this.paused) { this.currentAnimationFrame = end; changed = true; }
		return changed;
	};

	/**
	 * Moves the playhead to the specified frame number or animation.
	 * @method _goto
	 * @param {String|Number} frameOrAnimation The frame number or animation that the playhead should move to.
	 * @param {Boolean} [frame] The frame of the animation to go to. Defaults to 0.
	 * @protected
	 **/
	p._goto = function(frameOrAnimation, frame) {
		this.currentAnimationFrame = 0;
		if (isNaN(frameOrAnimation)) {
			var data = this.spriteSheet.getAnimation(frameOrAnimation);
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
	};


	createjs.Sprite = createjs.promote(Sprite, "DisplayObject");
}());
