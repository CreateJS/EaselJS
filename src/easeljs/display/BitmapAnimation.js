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

(function(ns) {
	
/**
* Displays frames or sequences of frames (ie. animations) from a sprite sheet image. A sprite sheet is a series of images
* (usually animation frames) combined into a single image. For example, an animation
* consisting of 8 100x100 images could be combined into a 400x200 sprite sheet (4 frames across by 2 high).
* You can display individual frames, play frames as an animation, and even sequence animations
* together. See the SpriteSheet class for more information on setting up frames and animations.
* @class BitmapAnimation
* @extends DisplayObject
* @constructor
* @param {SpriteSheet} spriteSheet The SpriteSheet instance to play back. This includes the source image(s), frame
* dimensions, and frame data. See SpriteSheet for more information.
**/
var BitmapAnimation = function(spriteSheet) {
  this.initialize(spriteSheet);
}
var p = BitmapAnimation.prototype = new ns.DisplayObject();

// public properties:

	/**
	 * Specifies a function to call whenever any animation reaches its end. It will be called with two
	 * params: the first will be a reference to this instance, the second will be the name of the animation
	 * that just ended.
	 * @property onAnimationEnd
	 * @type Function
	 **/
	p.onAnimationEnd = null;

	/**
	 * The frame that will be drawn when draw is called. Note that with some SpriteSheet data, this
	 * will advance non-sequentially. READ-ONLY.
	 * @property currentFrame
	 * @type Number
	 * @default -1
	 **/
	p.currentFrame = -1;

	/**
	 * Returns the currently playing animation. READ-ONLY.
	 * @property currentAnimation
	 * @type String
	 * @final
	 **/
	p.currentAnimation = null; // READ-ONLY

	/**
	 * Prevents the animation from advancing each tick automatically. For example, you could create a sprite
	 * sheet of icons, set paused to true, and display the appropriate icon by setting currentFrame.
	 * @property paused
	 * @type Boolean
	 * @default false
	 **/
	p.paused = true;

	/**
	 * The SpriteSheet instance to play back. This includes the source image, frame dimensions, and frame
	 * data. See SpriteSheet for more information.
	 * @property spriteSheet
	 * @type SpriteSheet
	 **/
	p.spriteSheet = null;

	/**
	 * Whether or not the Bitmap should be draw to the canvas at whole pixel coordinates.
	 * @property snapToPixel
	 * @type Boolean
	 * @default true
	 **/
	p.snapToPixel = true;
	
	/** 
	 * When used in conjunction with animations having an frequency greater than 1, this lets you offset which tick the playhead will
	 * advance on. For example, you could create two BitmapAnimations, both playing an animation with a frequency of 2, but one
	 * having offset set to 1. Both instances would advance every second tick, but they would advance on alternating
	 * ticks (effectively, one instance would advance on odd ticks, the other on even ticks).
	 * @property offset
	 * @type Number
	 * @default 0
	 */
	p.offset = 0;
	
	
	/**
	 * Specifies the current frame index within the current playing animation. When playing normally, this will
	 * increase successively from 0 to n-1, where n is the number of frames in the current animation.
	 * @property currentAnimationFrame
	 * @type Number
	 * @default 0
	 **/
	p.currentAnimationFrame = 0;

// private properties:
	/**
	 * @property _advanceCount
	 * @protected
	 * @type Number
	 * @default 0
	 **/
	p._advanceCount = 0;
	
	/**
	 * @property _animation
	 * @protected
	 * @type Object
	 * @default null
	 **/
	p._animation = null;

// constructor:
	/**
	 * @property DisplayObject_initialize
	 * @type Function
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
		return this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && this.spriteSheet.complete && this.currentFrame >= 0;
	}

	/**
	 * @property DisplayObject_draw
	 * @type Function
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
		if (o == null) { return; }
		var rect = o.rect;
		// TODO: implement snapToPixel on regX/Y?
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
	 * TODO: Doc.
	 * @method play
	 **/
	p.play = function() {
		this.paused = false;
	}
	
	/**
	 * TODO: Doc.
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
	 * Returns a clone of the Point instance.
	 * @method clone
	 * @return {Point} a clone of the Point instance.
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
	 * Advances the currentFrame if paused is not true. This is called automatically when the Stage ticks.
	 * @protected
	 * @method _tick
	 **/
	p._tick = function(data) {
		var f = this._animation ? this._animation.frequency : 1;
		if (!this.paused && ((++this._advanceCount)+this.offset)%f == 0) {
			this.advance();
		}
		if (this.onTick) { this.onTick(data); }
	}
	
	
	/**
	 * Normalizes the current frame, advancing animations and dispatching callbacks as appropriate.
	 * @protected
	 * @method _normalizeCurrentFrame
	 **/
	p._normalizeFrame = function() { 
		var a = this._animation;
		if (a) {
			if (this.currentAnimationFrame >= a.frames.length) {
				if (a.next) {
					this._goto(a.next);
				} else {
					this.paused = true;
					this.currentAnimationFrame = a.frames.length-1;
					this.currentFrame = a.frames[this.currentAnimationFrame];
				}
				if (this.onAnimationEnd) { this.onAnimationEnd(this,a.name); }
			} else {
				this.currentFrame = a.frames[this.currentAnimationFrame];
			}
		} else {
			if (this.currentFrame >= this.spriteSheet.getNumFrames()) {
				this.currentFrame = 0;
				if (this.onAnimationEnd) { this.onAnimationEnd(this,null); }
			}
		}
	}

	/**
	 * @property DisplayObject_cloneProps
	 * @private
	 * @type Function
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

ns.BitmapAnimation = BitmapAnimation;
}(createjs||(createjs={})));
var createjs;
