/*
* SpriteSheetBuilder
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
 * The SpriteSheetBuilder allows you to generate sprite sheets at run time from any display object. This can allow
 * you to maintain your assets as vector graphics (for low file size), and render them at run time as sprite sheets
 * for better performance.
 * <br/><br/>
 * Sprite sheets can be built either synchronously, or asynchronously, so that large sprite sheets can be generated
 * without locking the UI.
 * <br/><br/>
 * Note that the "images" used in the generated sprite sheet are actually canvas elements, and that they will be sized
 * to the nearest power of 2 up to the value of maxWidth or maxHeight.
 * @class SpriteSheetBuilder
 * @constructor
 **/
var SpriteSheetBuilder = function() {
  this.initialize();
}
var p = SpriteSheetBuilder.prototype;

// constants:
	SpriteSheetBuilder.ERR_DIMENSIONS = "frame dimensions exceed max spritesheet dimensions";
	SpriteSheetBuilder.ERR_RUNNING = "a build is already running";

// public properties:

	/**
	 * The maximum width for the images (not individual frames) in the generated sprite sheet. It is recommended to use
	 * a power of 2 for this value (ex. 1024, 2048, 4096). If the frames cannot all fit within the max dimensions, then
	 * additional images will be created as needed.
	 * @property maxWidth
	 * @type Number
	 * @default 2048
	*/
	p.maxWidth = 2048;

	/**
	 * The maximum height for the images (not individual frames) in the generated sprite sheet. It is recommended to use
	 * a power of 2 for this value (ex. 1024, 2048, 4096). If the frames cannot all fit within the max dimensions, then
	 * additional images will be created as needed.
	 * @property maxHeight
	 * @type Number
	 * @default 2048
	 **/
	p.maxHeight = 2048;

	/**
	 * The sprite sheet that was generated. This will be null before a build is completed successfully.
	 * @property spriteSheet
	 * @type SpriteSheet
	 **/
	p.spriteSheet = null;
	
	/**
	 * The scale to apply when drawing all frames to the sprite sheet. This is multiplied against any scale specified
	 * in the addFrame call. This can be used, for example, to generate a sprite sheet at run time that is tailored to
	 * the a specific device resolution (ex. tablet vs mobile).
	 * @property defaultScale
	 * @type Number
	 **/
	p.scale = 1;

// private properties:

	/**
	 * @property _frames
	 * @protected
	 * @type Array
	 **/
	p._frames = null;
	
	/**
	 * @property _animations
	 * @protected
	 * @type Array
	 **/
	p._animations = null;
	
	/**
	 * @property _data
	 * @protected
	 * @type Array
	 **/
	p._data = null;
	
	/**
	 * @property _nextFrameIndex
	 * @protected
	 * @type Number
	 **/
	p._nextFrameIndex = 0;
	
	/**
	 * @property _index
	 * @protected
	 * @type Number
	 **/
	p._index = 0;
	
	/**
	 * @property _callback
	 * @protected
	 * @type Function
	 **/
	p._callback = null;
	
	/**
	 * @property _timeSlice
	 * @protected
	 * @type Number
	 **/
	p._timeSlice = null;
	
	/**
	 * @property _timerID
	 * @protected
	 * @type Number
	 **/
	p._timerID = null;
	
	/**
	 * @property _scale
	 * @protected
	 * @type Number
	 **/
	p._scale = 1;

// constructor:
	/**
	 * Initialization method.
	 * @method initialize
	 * @protected
	 **/
	p.initialize = function() {
		this._frames = [];
		this._animations = {};
	}

// public methods:
	
	/**
	 * Adds a frame to the sprite sheet. Note that the frame will not be drawn until you call build. The optional
	 * setup params allow you to have a function run immediately before the draw occurs. For example, this allows you to
	 * add a single source multiple times, but manipulate it or it's children to change it to generate different frames.
	 * <br/><br/>
	 * Note that the source's transformations (x,y,scale,rotate,alpha) will be ignored, except for regX/Y. To apply
	 * transforms to a source object and have them captured in the sprite sheet, simply place it into a Container
	 * and pass in the Container as the source.
	 * @method addFrame
	 * @param {DisplayObject} source The source display object to draw as the frame.
	 * @param {Rectangle} sourceRect Optional. A rectangle defining the portion of the source to draw to the frame. If
	 * not specified, it will look for a getBounds method, bounds property, or nominalBounds property on the source to use.
	 * If one is not found, the frame will be skipped.
	 * @param {Number} scale Optional. The scale to draw this frame at. Default is 1.
	 * @param {Function} setupFunction Optional. A function to call immediately before drawing this frame.
	 * @param {Array} setupParams Optional. Parameters to pass to the setup function.
	 * @param {Object} setupScope Optional. The scope to call the setupFunction in.
	 * @return {Number} The index of the frame that was just added, or null if a sourceRect could not be determined.
	 **/
	p.addFrame = function(source, sourceRect, scale, setupFunction, setupParams, setupScope) {
		if (this._data) { throw SpriteSheetBuilder.ERR_RUNNING; }
		var rect = sourceRect||source.bounds||source.nominalBounds;
		if (!rect&&source.getBounds) { rect = source.getBounds(); }
		if (!rect) { return null; }
		scale = scale||1;
		return this._frames.push({source:source, sourceRect:rect, scale:scale, funct:setupFunction, params:setupParams, scope:setupScope, index:this._frames.length, height:rect.height*scale})-1;
	}
	
	/**
	 * Adds an animation that will be included in the created sprite sheet.
	 * @method addFrame
	 * @param {String} name The name for the animation.
	 * @param {Array} frames An array of frame indexes that comprise the animation. Ex. [3,6,5] would describe an animation
	 * that played frame indexes 3, 6, and 5 in that order.
	 * @param {String} next Optional. Specifies the name of the animation to continue to after this animation ends. You can
	 * also pass false to have the animation stop when it ends. By default it will loop to the start of the same animation.
	 * @param {Number} frequency Optional. Specifies a frame advance frequency for this animation. For example, a value
	 * of 2 would cause the animation to advance every second tick.
	 **/
	p.addAnimation = function(name, frames, next, frequency) {
		if (this._data) { throw SpriteSheetBuilder.ERR_RUNNING; }
		this._animations[name] = {frames:frames, next:next, frequency:frequency};
	}
	
	/**
	 * This will take a MovieClip, and add its frames and labels to this builder. Labels will be added as an animation
	 * running from the label index to the next label. For example, if there is a label named "foo" at frame 0 and a label
	 * named "bar" at frame 10, in a MovieClip with 15 frames, it will add an animation named "foo" that runs from frame
	 * index 0 to 9, and an animation named "bar" that runs from frame index 10 to 14.
	 * <br/><br/>
	 * Note that this will iterate through the full MovieClip with actionsEnabled set to false, ending on the last frame.
	 * @method addMovieClip
	 * @param {MovieClip} source The source MovieClip to add to the sprite sheet.
	 * @param {Rectangle} sourceRect Optional. A rectangle defining the portion of the source to draw to the frame. If
	 * not specified, it will look for a getBounds method, frameBounds array, bounds property, or nominalBounds property
	 * on the source to use. If one is not found, the MovieClip will be skipped.
	 * @param {Number} scale Optional. The scale to draw the movie clip at. Default is 1.
	 **/
	p.addMovieClip = function(source, sourceRect, scale) {
		if (this._data) { throw SpriteSheetBuilder.ERR_RUNNING; }
		var rects = source.frameBounds;
		var rect = sourceRect||source.bounds||source.nominalBounds;
		if (!rect&&source.getBounds) { rect = source.getBounds(); }
		if (!rect && !rects) { return null; }
		
		var l = source.timeline.duration;
		for (var i=0; i<l; i++) {
			var r = (rects&&rects[i]) ? rects[i] : rect;
			this.addFrame(source, r, scale, function(frame) {
				var ae = this.actionsEnabled;
				this.actionsEnabled = false;
				this.gotoAndStop(frame);
				this.actionsEnabled = ae;
			}, [i], source);
		}
		var labels = source.timeline._labels;
		for (var n in labels) {
			this.addAnimation(n, labels[n], true); // for now, this loops all animations.
		}
	}
	
	/**
	 * Builds a SpriteSheet instance based on the current frames.
	 * @method build
	 * @return SpriteSheet The created SpriteSheet instance, or null if a build is already running or an error occurred.
	 **/
	p.build = function() {
		if (this._data) { throw SpriteSheetBuilder.ERR_RUNNING; }
		this._callback = null;
		this._startBuild();
		while (this._drawNext()) {}
		this._endBuild();
		return this.spriteSheet;
	}
	
	/**
	 * Asynchronously builds a SpriteSheet instance based on the current frames. It will run 20 times per second, using
	 * an amount of time defined by timeSlice. When it is complete it will call the specified callback.
	 * @method buildAsync
	 * @param {Function} callback Optional. The function to call when the build operation completes. It will be called
	 * with a single parameter providing a reference back to the builder.
	 * @param {Number} timeSlice Optional. A number from 0.01 to 1 that indicates what percentage of time the builder can use. This can be
	 * thought of as the number of seconds per second the builder will use. For example, with a timeSlice value of 0.3,
	 * the builder will run 20 times per second, using approximately 15ms per build (30% of available time, or 0.3s per second).
	 * Defaults to 0.3.
	 **/
	p.buildAsync = function(callback, timeSlice) {
		if (this._data) { throw SpriteSheetBuilder.ERR_RUNNING; }
		this._callback = callback;
		this._startBuild();
		this._timeSlice = Math.max(0.01, Math.min(0.99, timeSlice||0.3))*50;
		var _this = this;
		this._timerID = setTimeout(function() { _this._run(); }, 50-this._timeSlice);
	}
	
	/**
	 * Stops the current asynchronous build.
	 * @method stopAsync
	 **/
	p.stopAsync = function() {
		clearTimeout(this._timerID);
		this._data = null;
	}
	
	/**
	 * SpriteSheetBuilder instances cannot be cloned.
	 * @method clone
	 **/
	p.clone = function() {
		throw("SpriteSheetBuilder cannot be cloned.");
	}

	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 **/
	p.toString = function() {
		return "[SpriteSheetBuilder]";
	}

// private methods:
	/**
	 * @method _startBuild
	 * @protected
	 **/
	p._startBuild = function() {
		this.spriteSheet = null;
		this._index = 0;
		this._scale = this.scale;
		var dataFrames = [];
		this._data = {
			images: [],
			frames: dataFrames,
			animations: this._animations // TODO: should we "clone" _animations in case someone adds more animations after a build?
		};
		
		var frames = this._frames.slice();
		frames.sort(function(a,b) { return (a.height<=b.height) ? -1 : 1; });
		
		if (frames[frames.length-1].height > this.maxHeight) { throw SpriteSheetBuilder.ERR_DIMENSIONS; }
		var y = 1, x=1;
		var img = 0;
		while (frames.length) {
			var o = this._fillRow(frames, y, img, dataFrames);
			if (o.w > x) { x = o.w; }
			y += o.h+2;
			if (!o.h || !frames.length) {
				var canvas = document.createElement("canvas");
				canvas.width = this._getSize(x,this.maxWidth);
				canvas.height = this._getSize(y,this.maxHeight);
				this._data.images[img] = canvas;
				if (!o.h) {
					x=y=1;
					img++;
				}
			}
		}
	}
	
	/**
	 * @method _fillRow
	 * @protected
	 * @return {Number} The width & height of the row.
	 **/
	p._getSize = function(size,max) {
		var pow = 4;
		while (Math.pow(2,++pow) < size){}
		return Math.min(max,Math.pow(2,pow));
	}
	
	/**
	 * @method _fillRow
	 * @protected
	 * @return {Number} The width & height of the row.
	 **/
	p._fillRow = function(frames, y, img, dataFrames) {
		var w = this.maxWidth;
		var maxH = this.maxHeight;
		var h = maxH-y;
		var x = 1;
		var height = 0;
		for (var i=frames.length-1; i>=0; i--) {
			var frame = frames[i];
			var sc = this._scale*frame.scale;
			var rect = frame.sourceRect;
			var source = frame.source;
			var rx = Math.floor(sc*rect.x-1);
			var ry = Math.floor(sc*rect.y-1);
			var rh = Math.ceil(sc*rect.height);
			var rw = Math.ceil(sc*rect.width);
			if (rw > w) { throw SpriteSheetBuilder.ERR_DIMENSIONS; }
			if (rh > h || x+rw > w) { continue; }
			frame.img = img;
			frame.rect = new ns.Rectangle(x,y,rw,rh);
			height = height || rh;
			frames.splice(i,1);
			dataFrames[frame.index] = [x-1,y-1,rw+2,rh+2,img,Math.round(-rx+sc*source.regX),Math.round(-ry+sc*source.regY)];
			x += rw+2;
		}
		return {w:x, h:height};
	}
	
	/**
	 * @method _endBuild
	 * @protected
	 **/
	p._endBuild = function() {
		this.spriteSheet = new ns.SpriteSheet(this._data);
		this._data = null;
		if (this._callback) { this._callback(this); }
	}
	
	/**
	 * @method _run
	 * @protected
	 **/
	p._run = function() {
		var t = (new Date()).getTime()+this._timeSlice;
		var complete = false;
		while (t > (new Date()).getTime()) {
			if (!this._drawNext()) { complete = true; break; }
		}
		if (complete) {
			this._endBuild();
		} else {
			var _this = this;
			this._timerID = setTimeout(function() { _this._run(); }, 50-this._timeSlice);
		}
	}
	
	/**
	 * @method _drawNext
	 * @protected
	 * @return Boolean Returns false if this is the last draw.
	 **/
	p._drawNext = function() {
		var frame = this._frames[this._index];
		var sc = frame.scale*this._scale;
		var rect = frame.rect;
		var sourceRect = frame.sourceRect;
		var canvas = this._data.images[frame.img];
		var ctx = canvas.getContext("2d");
		frame.funct&&frame.funct.apply(frame.scope, frame.params);
		ctx.save();
		ctx.beginPath();
		ctx.rect(rect.x-1, rect.y-1, rect.width+2, rect.height+2);
		ctx.clip();
		ctx.translate(rect.x-sourceRect.x*sc+0.5|0, rect.y-sourceRect.y*sc+0.5|0); // we know these are positive
		ctx.scale(sc,sc);
		frame.source.draw(ctx); // display object will draw itself.
		ctx.restore();
		return (++this._index) < this._frames.length;
	}

ns.SpriteSheetBuilder = SpriteSheetBuilder;
}(createjs||(createjs={})));
var createjs;