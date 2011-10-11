/*
* BitmapSequence by Grant Skinner. Dec 5, 2010
* Visit http://easeljs.com/ for documentation, updates and examples.
*
*
* Copyright (c) 2010 Grant Skinner
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
* The Easel Javascript library provides a retained graphics mode for canvas
* including a full, hierarchical display list, a core interaction model, and
* helper classes to make working with Canvas much easier.
* @module EaselJS
**/

(function(window) {
// TODO: update docs.
/**
* Displays frames or sequences of frames from a sprite sheet image. A sprite sheet is a series of images
* (usually animation frames) combined into a single image on a regular grid. For example, an animation
* consisting of 8 100x100 images could be combined into a 400x200 sprite sheet (4 frames across by 2 high).
* You can display individual frames, play sequential frames as an animation, and even sequence animations
* together. See the SpriteSheet class for more information on setting up frames and animation.
* @class BitmapSequence
* @extends DisplayObject
* @constructor
* @param {SpriteSheet} spriteSheet The SpriteSheet instance to play back. This includes the source image, frame
* dimensions, and frame data. See SpriteSheet for more information.
**/
var BitmapSequence = function(spriteSheet) {
  this.initialize(spriteSheet);
}
var p = BitmapSequence.prototype = new DisplayObject();

// public properties:

	/**
	* Specifies a function to call whenever any sequence reaches its end.
	* @property callback
	* @type Function
	**/
	// TODO: rename.
	p.callback = null;

	/**
	* The frame that will be drawn on the next tick. This can also be set, but it will not update the current
	* sequence, so it may result in unexpected behavior if you are using frameData.
	* @property currentFrame
	* @type Number
	* @default -1
	**/
	p.currentFrame = -1;

	/**
	* Returns the currently playing sequence when using frameData. READ-ONLY.
	* @property currentSequence
	* @type String
	* @final
	**/
	p.currentSequence = null; // READ-ONLY

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
	 * advance on. For example, you could create two BitmapSequences, both playing an animation with a frequency of 2, but one
	 * having offset set to 1. Both instances would advance every second tick, but they would advance on alternating
	 * ticks (effectively, one instance would advance on odd ticks, the other on even ticks).
	 * @property offset
	 * @type Number
	 * @default 0
	 */
	p.offset = 0;

// private properties:
		/**
	* @property _advanceCount
	* @protected
	* @type Number
	* @default 0
	**/
	p._advanceCount = 0;
	
	// TODO: doc.
	p._animation = null;
	p._curAnimFrame = 0;

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
		this._normalizeCurrentFrame();
		var o = spriteSheet.getFrameRect(this.currentFrame);
		if (o == null) { return; }
		var rect = o.rect;
		// TODO: implement pixel snapping.
		ctx.drawImage(o.image, rect.x, rect.y, rect.width, rect.height, 0, 0, rect.width, rect.height);
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
	* Sets paused to false and plays the specified sequence name, named frame, or frame number.
	* @method gotoAndPlay
	* @param {String|Number} frameOrSequence The frame number or sequence that the playhead should move to
	* and begin playing.
	**/
	p.gotoAndPlay = function(frameOrSequence) {
		this.paused = false;
		this._goto(frameOrSequence);
	}

	/**
	* Sets paused to true and seeks to the specified sequence name, named frame, or frame number.
	* @method gotoAndStop
	* @param {String|Number} frameOrSequence The frame number or sequence that the playhead should move to
	* and stop.
	**/
	p.gotoAndStop = function(frameOrSequence) {
		this.paused = true;
		this._goto(frameOrSequence);
	}

	/**
	* Advances the playhead. This occurs automatically each tick by default.
	* @method advance
	*/
	p.advance = function() {
		if (this._animation) { this._curAnimFrame++; }
		else { this.currentFrame++; }
		this._normalizeFrame();
	}

	/**
	* Returns a clone of the Point instance.
	* @method clone
	* @return {Point} a clone of the Point instance.
	**/
	p.clone = function() {
		var o = new BitmapSequence(this.spriteSheet);
		this.cloneProps(o);
		return o;
	}

	/**
	* Returns a string representation of this object.
	* @method toString
	* @return {String} a string representation of the instance.
	**/
	p.toString = function() {
		return "[BitmapSequence (name="+  this.name +")]";
	}

// private methods:
	/**
	* Advances the currentFrame if paused is not true. This is called automatically when the Stage ticks.
	* @protected
	* @method _tick
	**/
	p._tick = function() {
		var f = this._animation ? this._animation.frequency : 1;
		if (!this.paused && ((++this._advanceCount)+this.advanceOffset)%f == 0) {
			this.advance();
		}
	}
	
	
	/**
	* Normalizes the current frame, advancing sequences and dispatching callbacks as appropriate.
	* @protected
	* @method _normalizeCurrentFrame
	**/
	p._normalizeFrame = function() { 
		var a = this._animation;
		if (a) {
			if (this._curAnimFrame >= a.frames.length) {
				if (a.next) {
					this._goto(a.next);
					return;
				} else {
					this.paused = true;
					this._curAnimFrame = a.frames.length;
				}
				this.currentFrame = a.frames[this._curAnimFrame];
				if (this.callback) { this.callback(this); }
			}
		} else {
			if (this.currentFrame >= this.spriteSheet.getNumFrames()) {
				this.currentFrame = 0;
				if (this.callback) { this.callback(this); }
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
		o.callback = this.callback;
		o.currentFrame = this.currentFrame;
		o.currentSequence = this.currentSequence;
		o.paused = this.paused;
		o.offset = this.offset;
		o._animation = this._animation;
		o._curAnimFrame = this._curAnimFrame;
	}

	/**
	* Moves the playhead to the specified frame number of sequence.
	* @method _goto
	* @param {String|Number} frameOrSequence The frame number of sequence that the playhead should move to.
	* @protected
	**/
	p._goto = function(frameOrSequence) {
		if (isNaN(frameOrSequence)) {
			var data = this.spriteSheet.getAnimation(frameOrSequence);
			if (data) {
				this._curAnimFrame = 0;
				this._animation = data;
				this.currentSequence = frameOrSequence;
				this._normalizeFrame();
			}
		} else {
			this.currentSequence = this._animation = null;
			this.currentFrame = frameOrSequence;
		}
	}

window.BitmapSequence = BitmapSequence;
}(window));