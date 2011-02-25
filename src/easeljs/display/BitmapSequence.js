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
BitmapSequence = function(spriteSheet) {
  this.initialize(spriteSheet);
}
var p = BitmapSequence.prototype = new DisplayObject();

// public properties:
	
	/**
	* Specifies a function to call whenever any sequence reaches its end.
	* @property callback
	* @type Function
	**/
	p.callback = null;
	
	/**
	* The frame that will be drawn on the next tick. This can also be set, but it will not update the current
	* sequence, so it may result in unexpected behavior if you are using frameData.
	* @property currentFrame
	* @type {number}
	* @default -1
	**/
	p.currentFrame = -1;
	
	/**
	* Returns the currently playing sequence when using frameData. READ-ONLY.
	* @property currentSequence
	* @type {string}
	* @final
	**/
	p.currentSequence = null; // READ-ONLY

	/**
	* Returns the last frame of the currently playing sequence when using frameData. READ-ONLY.
	* @property currentEndFrame
	* @type {number}
	* @final
	**/
	p.currentEndFrame = null; // READ-ONLY
	
	/**
	* Returns the first frame of the currently playing sequence when using frameData. READ-ONLY.
	* @property currentStartFrame
	* @type {number}
	* @final
	**/
	p.currentStartFrame = null; // READ-ONLY
	
	/**
	* Returns the name of the next sequence that will be played, or null if it will stop playing after the 
	* current sequence. READ-ONLY.
	* @property nextSequence
	* @type {string}
	* @final
	**/
	p.nextSequence = null;
	
	/**
	* Prevents the animation from advancing each tick automatically. For example, you could create a sprite 
	* sheet of icons, set paused to true, and display the appropriate icon by setting currentFrame.
	* @property paused
	* @type {boolean}
	* @default false
	**/
	p.paused = false;
	
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
	* @type {boolean}
	* @default true
	**/
	p.snapToPixel = true;
	
// constructor:
	/**
	* @property DisplayObject_initialize
	* @type Function
	* @private
	**/
	p.DisplayObject_initialize = p.initialize;
	
	/** 
	* Initialization method.
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
	* @return {boolean} Boolean indicating whether the display object would be visible if drawn to a canvas
	**/
	p.isVisible = function() {
		var image = this.spriteSheet ? this.spriteSheet.image : null;
		return this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && image && this.currentFrame >= 0 && (image.complete || image.getContext);
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
	* @param {CanvasRenderingContext2D} ctx The canvas 2D context object to draw into.
	* @param {boolean} ignoreCache Indicates whether the draw operation should ignore any current cache. 
	* For example, used for drawing the cache (to prevent it from simply drawing an existing cache back
	* into itself).
	**/
	p.draw = function(ctx, ignoreCache) {
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
	p.tick = function() {
		if (this.paused) { return; }
		this.currentFrame++;
	}
	
	//Note, the doc sections below document using the specified APIs (from DisplayObject)  from
	//Bitmap. This is why they have no method implementations.
	
	/**
	* Because the content of a Bitmap is already in a simple format, cache is unnecessary for Bitmap instances.
	* You should not cache Bitmap instances as it can degrade performance.
	**/
	
	/**
	* Because the content of a Bitmap is already in a simple format, cache is unnecessary for Bitmap instances.
	* You should not cache Bitmap instances as it can degrade performance.
	**/
	
	/**
	* Because the content of a Bitmap is already in a simple format, cache is unnecessary for Bitmap instances.
	* You should not cache Bitmap instances as it can degrade performance.
	**/
	
	/**
	* Sets paused to false and plays the specified sequence name, named frame, or frame number.
	* @param {String|Number} frameOrSequence The frame number or sequence that the playhead should move to
	* and begin playing.
	**/
	p.gotoAndPlay = function(frameOrSequence) {
		this.paused = false;
		this._goto(frameOrSequence);
	}
	
	/**
	* Sets paused to true and seeks to the specified sequence name, named frame, or frame number.
	* @param {String|Number} frameOrSequence The frame number or sequence that the playhead should move to
	* and stop.
	**/
	p.gotoAndStop = function(frameOrSequence) {
		this.paused = true;
		this._goto(frameOrSequence);
	}
	
	/**
	* Returns a clone of the Point instance.
	* @return {Point} a clone of the Point instance.
	**/
	p.clone = function() {
		var o = new BitmapSequence(this.spriteSheet);
		this.cloneProps(o);
		return o;
	}
		
	/**
	* Returns a string representation of this object.
	* @return {string} a string representation of the instance.
	**/
	p.toString = function() {
		return "[BitmapSequence (name="+  this.name +")]";
	}
	
// private methods:
	/**
	* @property DisplayObject_cloneProps
	* @private
	* @type Function
	**/
	p.DisplayObject_cloneProps = p.cloneProps;
	
	/** 
	* @param {Text} o
	* @protected
	**/
	p.cloneProps = function(o) {
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
	
	/**
	* Moves the playhead to the specified frame number of sequence.
	* @param {String|Number} frameOrSequence The frame number of sequence that the playhead should move to.
	* @protected
	**/
	p._goto = function(frameOrSequence) {
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