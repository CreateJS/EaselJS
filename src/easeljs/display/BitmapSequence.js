/**
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
**/

(function(window) {

/**
* Constructs a BitmapSequence object with the specified sprite sheet.
* @param spriteSheet The SpriteSheet instance to play back. This includes the source image, frame dimensions, and frame data. See SpriteSheet for more information.
* @class Displays frames or sequences of frames from a sprite sheet image. A sprite sheet is a series of images (usually animation frames) combined into a single image on a regular grid. For example, an animation consisting of 8 100x100 images could be combined into a 400x200 sprite sheet (4 frames across by 2 high). You can display individual frames, play sequential frames as an animation, and even sequence animations together. See the SpriteSheet class for more information on setting up frames and animation.
* @augments DisplayObject
**/
BitmapSequence = function(spriteSheet) {
  this.initialize(spriteSheet);
}
BitmapSequence.prototype = new DisplayObject();

// public properties:
	/** Specifies a funciton to call whenever any sequence reaches its end. */
	BitmapSequence.prototype.callback = null;
	/** The frame that will be drawn on the next tick. This can also be set, but it will not update the current sequence, so it may result in unexpected behaviour if you are using frameData. */
	BitmapSequence.prototype.currentFrame = -1;
	/** Returns the currently playing sequence when using frameData. READ-ONLY. */
	BitmapSequence.prototype.currentSequence = null; // READ-ONLY
	/** Returns the last frame of the currently playing sequence when using frameData. READ-ONLY. */
	BitmapSequence.prototype.currentEndFrame = null; // READ-ONLY
	/** Returns the first frame of the currently playing sequence when using frameData. READ-ONLY. */
	BitmapSequence.prototype.currentStartFrame = null; // READ-ONLY
	/** Returns the name of the next sequence that will be played, or null if it will stop playing after the current sequence. READ-ONLY. */
	BitmapSequence.prototype.nextSequence = null;
	/** Prevents the animation from advancing each tick automatically. For example, you could create a sprite sheet of icons, set paused to true, and display the appropriate icon by setting currentFrame. */
	BitmapSequence.prototype.paused = false;
	/** The SpriteSheet instance to play back. This includes the source image, frame dimensions, and frame data. See SpriteSheet for more information. */
	BitmapSequence.prototype.spriteSheet = null;
	BitmapSequence.prototype.snapToPixel = true;
	
// constructor:
	/** @ignore */
	BitmapSequence.prototype.DisplayObject_initialize = BitmapSequence.prototype.initialize;
	/** @ignore */
	BitmapSequence.prototype.initialize = function(spriteSheet) {
		this.DisplayObject_initialize();
		this.spriteSheet = spriteSheet;
	}
	
// public methods:
	BitmapSequence.prototype.isVisible = function() {
		var image = this.spriteSheet ? this.spriteSheet.image : null;
		return this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && image && this.currentFrame >= 0 && (image.complete || image.getContext);
	}

	BitmapSequence.prototype.DisplayObject_draw = BitmapSequence.prototype.draw;
	BitmapSequence.prototype.draw = function(ctx, ignoreCache) {
		if (this.DisplayObject_draw(ctx, ignoreCache)) { return true; }
		
		var image = this.spriteSheet.image;
		var frameWidth = this.spriteSheet.frameWidth;
		var frameHeight = this.spriteSheet.frameHeight;
		var cols = image.width/frameWidth|0;
		var rows = image.height/frameHeight|0;
		
		if (this.currentEndFrame != null) {
			if (this.currentFrame > this.currentEndFrame) {
				if (this.nextSequence) {
					this._goto(this.nextSequence);
				} else {
					this.paused = true;
					this.currentFrame = this.currentEndFrame;
				}
				if (this.callback) { this.callback(this); }
			}
		} else if (this.spriteSheet.frameData) {
			// sequence data is set, but we haven't actually played a sequence yet:
			this.paused = true;
		} else {
			var ttlFrames = this.spriteSheet.totalFrames || cols*rows;
			if (this.currentFrame >= ttlFrames) {
				if (this.spriteSheet.loop) { this.currentFrame = 0; }
				else {
					this.currentFrame = ttlFrames-1;
					this.paused = true;
				}
				if (this.callback) { this.callback(this); }
			}
		}
		if (this.currentFrame >= 0) {
			var col = this.currentFrame%cols;
			var row = this.currentFrame/cols|0;
			ctx.drawImage(image, frameWidth*col, frameHeight*row, frameWidth, frameHeight, 0, 0, frameWidth, frameHeight);
		}
		return true;
	}
	
	/**
	* Advances the currentFrame if paused is not true. This is called automatically when the Stage ticks.
	**/
	BitmapSequence.prototype.tick = function() {
		if (this.paused) { return; }
		this.currentFrame++;
	}
	
	/**
	* Because the content of a Bitmap is already in a simple format, cache is unnecessary for BitmapSequence instances.
	**/
	BitmapSequence.prototype.cache = function() {}
	/**
	* Because the content of a Bitmap is already in a simple format, cache is unnecessary for BitmapSequence instances.
	**/
	BitmapSequence.prototype.updateCache = function() {}
	/**
	* Because the content of a Bitmap is already in a simple format, cache is unnecessary for BitmapSequence instances.
	**/
	BitmapSequence.prototype.uncache = function() {}
	
	/**
	* Sets paused to false and plays the specified sequence name, named frame, or frame number.
	**/
	BitmapSequence.prototype.gotoAndPlay = function(frameOrSequence) {
		this.paused = false;
		this._goto(frameOrSequence);
	}
	
	/**
	* Sets paused to true and seeks to the specified sequence name, named frame, or frame number.
	**/
	BitmapSequence.prototype.gotoAndStop = function(frameOrSequence) {
		this.paused = true;
		this._goto(frameOrSequence);
	}
	
	BitmapSequence.prototype.clone = function() {
		var o = new BitmapSequence(this.spriteSheet);
		this.cloneProps(o);
		return o;
	}
		
	BitmapSequence.prototype.toString = function() {
		return "[BitmapSequence (name="+  this.name +")]";
	}
	
// private methods:
	/** @private */
	BitmapSequence.prototype.DisplayObject_cloneProps = BitmapSequence.prototype.cloneProps;
	/** @private */
	BitmapSequence.prototype.cloneProps = function(o) {
		this.DisplayObject_cloneProps(o);
		o.callback = this.callback;
		o.currentFrame = this.currentFrame;
		o.currentStartFrame = this.currentStartFrame;
		o.currentEndFrame = this.currentEndFrame;
		o.currentSequence = this.currentSequence;
		o.nextSequence = this.nextSequence;
		o.paused = this.paused;
		o.frameData = this.frameData;
	}
	
	/** @private */
	BitmapSequence.prototype._goto = function(frameOrSequence) {
		if (isNaN(frameOrSequence)) {
			if (frameOrSequence == this.currentSequence) {
				this.currentFrame = this.currentStartFrame;
				return;
			}
			var data = this.spriteSheet.frameData[frameOrSequence];
			if (data instanceof Array) {
				this.currentFrame = this.currentStartFrame = data[0];
				this.currentSequence = frameOrSequence;
				this.currentEndFrame = data[1];
				if (this.currentEndFrame == null) { this.currentEndFrame = this.currentStartFrame; }
				if (this.currentEndFrame == null) { this.currentEndFrame = this.currentFrame; }
				this.nextSequence = data[2];
				if (this.nextSequence == null) { this.nextSequence = this.currentSequence; }
				else if (this.nextSequence == false) { this.nextSequence = null; }
			} else {
				this.currentSequence = this.nextSequence = null;
				this.currentEndFrame = this.currentFrame = this.currentStartFrame = data;
			}
		} else {
			this.currentSequence = this.nextSequence = this.currentEndFrame = null;
			this.currentStartFrame = 0;
			this.currentFrame = frameOrSequence;
		}
	}

window.BitmapSequence = BitmapSequence;
}(window));