/*
* SpriteSheet by Grant Skinner. Dec 5, 2010
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
// TODO: update documentation.
// TODO: how to deal with registration points? Should be part of the frame data.
/**
* Encapsulates the properties associated with a sprite sheet. A sprite sheet is a series of images (usually animation frames) combined
* into a single image on a regular grid. For example, an animation consisting of 8 100x100 images could be combined into a 400x200
* sprite sheet (4 frames across by 2 high).
* The simplest form of sprite sheet has values for the image, frameWidth, and frameHeight properties, but does not include frameData.
* It will then play all of the frames in the animation and loop if the loop property is true. In this simple mode, you can also set
* the totalFrames property if you have extraneous frames in your sprite sheet (for example, a 2x4 frame sprite sheet, with only 7
* frames used).<br/><br/>
* More complex sprite sheets include a frameData property, which provides named frames and animations which can be played and sequenced
* together. See frameData for more information.
* @class SpriteSheet
* @constructor
* @param {Image | HTMLCanvasElement | HTMLVideoElement | String} imageOrUri The Image, Canvas, or Video instance or URI to an image to use as a sprite sheet.
* @param {Number} frameWidth The width in pixels of each frame on the sprite sheet.
* @param {Number} frameHeight The height in pixels of each frame on the sprite sheet.
* @param {Object} frameData Defines named frames and frame sequences. See the frameData property for more information.
**/
var SpriteSheet = function(imageOrUri, frameWidth, frameHeight, frameData) {
  this.initialize(imageOrUri, frameWidth, frameHeight, frameData);
}
var p = SpriteSheet.prototype;

// public properties:
	p.complete = true;
	
// private properties:
	p._animations = null;
	p._frames = null;
	p._images = null;
	p._data = null;
	p._frameHeight = 0;
	p._frameWidth = 0;
	p._numFrames = 0;
	p._loadCount = 0;

// constructor:
	/**
	* Initialization method.
	* @method initialize
	* @protected
	**/
	p.initialize = function(data) {
		var i,l,o,a;
		if (data == null) { return; }
		
		// parse images:
		if (data.images && (l=data.images.length) > 0) {
			a = this._images = [];
			for (i=0; i<l; i++) {
				var img = data.images[i];
				if (!(img instanceof Image)) {
					var src = img;
					img = new Image();
					img.src = src;
				}
				a.push(img);
				if (!img.getContext && !img.complete) {
					this._loadCount++;
					this.complete = false;
					img.onload = this._handleImageLoad();
				}
			}
		}
		
		// parse frames:
		if (data.frames == null) { // nothing
		} else if (data.frames instanceof Array) {
			this._frames = [];
			a = data.frames;
			for (i=0,l=a.length;i<l;i++) {
				var arr = a[i];
				this._frames.push({image:this._images[arr[4]?arr[4]:0], rect:new Rectangle(arr[0],arr[1],arr[2],arr[3]) });
			}
		} else {
			o = data.frames;
			this._frameWidth = o.frameWidth;
			this._frameHeight = o.frameHeight;
			this._numFrames = o.numFrames;
			if (this._loadCount == 0) { this._calculateFrames(); }
		}
		
		// parse animations:
		if ((o=data.animations) != null) {
			this._animations = [];
			this._data = {};
			var name;
			for (name in o) {
				var anim = {name:name};
				var obj = o[name];
				if (!isNaN(obj)) { // single frame
					a = anim.frames = [obj];
				} if (obj instanceof Array) { // simple
					anim.frequency = obj[3];
					anim.next = obj[2];
					a = anim.frames = [];
					for (i=obj[0];i<=obj[1];i++) {
						a.push(i);
					}
				} else { // complex
					anim.frequency = obj.frequency;
					anim.next = obj.next;
					a = anim.frames = obj.frames.slice(0);
				}
				anim.next = a.length < 2 ? null : (!anim.next || anim.next == true) ? name : anim.next;
				if (!anim.frequency) { anim.frequency = 1; }
				this._animations.push(name);
				this._data[name] = anim;
			}
		}
		
	}

// public methods:
	/**
	* Returns the total number of frames in the specified animation, or in the whole sprite
	* sheet if the animation param is omitted.
	* @param {String} animation The name of the animation to get a frame count for.
	* @return {Number} The number of frames in the animation, or in the entire sprite sheet if the animation param is omitted.
	*/
	p.getNumFrames = function(animation) {
		if (animation == null) {
			return this._frames ? this._frames.length : this._numFrames;
		} else {
			var data = this._data[animation];
			if (data == null) { return 0; }
			else { return data.frames.length; }
		}
	}
	
	/**
	* Returns an array of all available animation names as strings.
	* @method getAnimations
	* @return {Array} an array of animation names available on this sprite sheet.
	**/
	p.getAnimations = function() {
		return this._animations.slice(0);
	}
	
	/**
	* Returns an object defining the specified animation. The returned object has a
	* frames property containing an array of the frame id's in the animation, a frequency
	* property indicating the advance frequency for this animation, a name property, 
	* and a next property, which specifies the default next animation. If the animation
	* loops, the name and next property will be the same.
	* @method getAnimations
	* @return {Object} a generic object with frames, frequency, name, and next properties.
	**/
	p.getAnimation = function(name) {
		return this._data[name];
	}
	
	/**
	* Returns an object defining the source rect of the specified frame. The returned object
	* has an image property holding a reference to the image object in which the frame frame is found,
	* and a rect property containing a Rectangle instance which defines the boundaries for the
	* frame within that image.
	* @method getFrameRect
	* @param {Number} frameIndex The index of the frame.
	* @return {Object} a generic object with image and rect properties. Returns null if the frame does not exist, or the image is not fully loaded.
	**/
	p.getFrameRect = function(frameIndex) {
		if (this.complete && this._frames && (frame=this._frames[frameIndex])) { return frame; }
		return null;
	}
	
	/**
	* Returns a string representation of this object.
	* @method toString
	* @return {String} a string representation of the instance.
	**/
	p.toString = function() {
		return "[SpriteSheet]";
	}

	/**
	* Returns a clone of the SpriteSheet instance.
	* @method clone
	* @return {SpriteSheet} a clone of the SpriteSheet instance.
	**/
	p.clone = function() {
		// GDS: there isn't really any reason to clone SpriteSheet instances, because they can be reused.
		var o = new SpriteSheet();
		o.complete = this.complete;
		o._animations = this._animations;
		o._frames = this._frames;
		o._images = this._images;
		o._data = this._data;
		o._frameHeight = this._frameHeight;
		o._frameWidth = this._frameWidth;
		o._numFrames = this._numFrames;
		o._loadCount = this._loadCount;
		return o;
	}
	
// private methods:
	p._handleImageLoad = function() {
		if (--this._loadCount == 0) {
			this._calculateFrames();
			this.complete = true;
		}
	}
	
	p._calculateFrames = function() {
		if (this._frames || this._frameWidth == 0) { return; }
		this._frames = [];
		var ttlFrames = 0;
		var fw = this._frameWidth;
		var fh = this._frameHeight;
		for (var i=0,imgs = this._images; i<imgs.length; i++) {
			var img = imgs[i];
			var cols = (img.width+1)/fw|0;
			var rows = (img.height+1)/fh|0;
			var ttl = this._numFrames>0 ? Math.min(this._numFrames-ttlFrames,cols*rows) : cols*rows;
			for (var j=0;j<ttl;j++) {
				this._frames.push({image:img, rect:new Rectangle(j%cols*fw,(j/cols|0)*fh,fw,fh) });
			}
			ttlFrames += ttl;
		}
		this._numFrames = ttlFrames;
	}

window.SpriteSheet = SpriteSheet;
}(window));