/*
* SpriteSheet
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
 * Encapsulates the properties and methods associated with a sprite sheet. A sprite sheet is a series of images (usually animation frames) combined
 * into a larger image (or images). For example, an animation consisting of 8 100x100 images could be combined into a 400x200
 * sprite sheet (4 frames across by 2 high).<br/><br/>
 * The data passed to the SpriteSheet constructor defines three critical pieces of information:<OL>
 *    <LI> The image or images to use.</LI>
 *    <LI> The positions of individual image frames. This data can be represented in one of two ways:
 *    As a regular grid of sequential, equal-sized frames, or as individually defined, variable sized frames arranged in an irregular (non-sequential) fashion.</LI>
 *    <LI> Likewise, animations can be represented in two ways: As a series of sequential frames, defined by a start and end frame [0,3], or as a list of frames [0,1,2,3].
 * </OL>
 * The easiest way to understand the data format is to see an example:
 * <pre><code>data = {
&nbsp;
// DEFINING IMAGES:
&#9;// list of images or image URIs to use. SpriteSheet can handle preloading.
&#9;// the order dictates their index value for frame definition.
&#9;images: [image1, "path/to/image2.png"],
&nbsp;
// DEFINING FRAMES:
&nbsp;
&#9;// the simple way to define frames, only requires frame size because frames are consecutive:
&#9;// define frame width/height, and optionally the frame count and registration point x/y.
&#9;// if count is omitted, it will be calculated automatically based on image dimensions.
&#9;frames: {width:64, height:64, count:20, regX: 32, regY:64},
&nbsp;
&#9;// OR, the complex way that defines individual rects for frames.
&#9;// The 5th value is the image index per the list defined in "images" (defaults to 0).
&#9;frames: [
&#9;	// x, y, width, height, imageIndex, regX, regY
&#9;	[0,0,64,64,0,32,64],
&#9;	[64,0,96,64,0]
&#9;],
&nbsp;
// DEFINING ANIMATIONS:
&nbsp;
&#9;// simple animation definitions. Define a consecutive range of frames.
&#9;// also optionally define a "next" animation name for sequencing.
&#9;// setting next to false makes it pause when it reaches the end.
&#9;animations: {
&#9;	// start, end, next, frequency
&#9;	run: [0,8],
&#9;	jump: [9,12,"run",2],
&#9;	stand: [13]
&#9;}
&nbsp;
&#9;// the complex approach which specifies every frame in the animation by index.
&#9;animations: {
&#9;	run: {
&#9;		frames: [1,2,3,3,2,1]
&#9;	},
&#9;	jump: {
&#9;		frames: [1,4,5,6,1],
&#9;		next: "run",
&#9;		frequency: 2
&#9;	},
&#9;	stand: { frames: [7] }
&#9;}
&nbsp;
&#9;// the above two approaches can be combined, you can also use a single frame definition:
&#9;animations: {
&#9;	run: [0,8,true,2],
&#9;	jump: {
&#9;		frames: [8,9,10,9,8],
&#9;		next: "run",
&#9;		frequency: 2
&#9;	},
&#9;	stand:7
&#9;}
}</code></pre>
 * &nbsp;
 * For example, to define a simple sprite sheet, with a single image "sprites.jpg" arranged in a regular 50x50 grid
 * with two animations, "run" looping from frame 0-4 inclusive, and "jump" playing from frame 5-8 and sequencing back to run:
 * <pre><code>data = {
&#9;images: ["sprites.jpg"],
&#9;frames: {width:50, height:50},
&#9;animations: {run:[0,4], jump:[5,8,"run"]}
}</code></pre>
 
 * @class SpriteSheet
 * @constructor
 * @param data
 **/
var SpriteSheet = function(data) {
  this.initialize(data);
}
var p = SpriteSheet.prototype;

// public properties:
	/**
	 * Read-only property indicating whether all images are finished loading.
	 * @property complete
	 * @type Boolean
	 **/
	p.complete = true;
	
	
	/**
	 * The onComplete callback is called when all images are loaded. Note that this only fires if the images
	 * were not fully loaded when the sprite sheet was initialized. You should check the complete property 
	 * to prior to adding an onComplete handler. Ex.
	 * <pre><code>var sheet = new SpriteSheet(data);
	 * if (!sheet.complete) {
	 *  &nbsp; // not preloaded, listen for onComplete:
	 *  &nbsp; sheet.onComplete = handler;
	 * }</code></pre>
	 * 
	 * @event onComplete
	 **/
	p.onComplete = null;
	
// private properties:
	/**
	 * @property _animations
	 * @protected
	 **/
	p._animations = null;
	
	/**
	 * @property _frames
	 * @protected
	 **/
	p._frames = null;
	
	/**
	 * @property _images
	 * @protected
	 **/
	p._images = null;
	
	/**
	 * @property _data
	 * @protected
	 **/
	p._data = null;
	
	/**
	 * @property _loadCount
	 * @protected
	 **/
	p._loadCount = 0;
	
	// only used for simple frame defs:
	/**
	 * @property _frameHeight
	 * @protected
	 **/
	p._frameHeight = 0;
	
	/**
	 * @property _frameWidth
	 * @protected
	 **/
	p._frameWidth = 0;
	
	/**
	 * @property _numFrames
	 * @protected
	 **/
	p._numFrames = 0;
	
	/**
	 * @property _regX
	 * @protected
	 **/
	p._regX = 0;
	
	/**
	 * @property _regY
	 * @protected
	 **/
	p._regY = 0;

// constructor:
	/**
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
				if (typeof img == "string") {
					var src = img;
					img = new Image();
					img.src = src;
				}
				a.push(img);
				if (!img.getContext && !img.complete) {
					this._loadCount++;
					this.complete = false;
					(function(o) { img.onload = function() { o._handleImageLoad(); } })(this);
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
				this._frames.push({image:this._images[arr[4]?arr[4]:0], rect:new createjs.Rectangle(arr[0],arr[1],arr[2],arr[3]), regX:arr[5]||0, regY:arr[6]||0 });
			}
		} else {
			o = data.frames;
			this._frameWidth = o.width;
			this._frameHeight = o.height;
			this._regX = o.regX||0;
			this._regY = o.regY||0;
			this._numFrames = o.count;
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
				} else if (obj instanceof Array) { // simple
					anim.frequency = obj[3];
					anim.next = obj[2];
					a = anim.frames = [];
					for (i=obj[0];i<=obj[1];i++) {
						a.push(i);
					}
				} else { // complex
					anim.frequency = obj.frequency;
					anim.next = obj.next;
					var frames = obj.frames;
					a = anim.frames = !isNaN(frames) ? [frames] : frames.slice(0);
				}
				anim.next = (a.length < 2 || anim.next == false) ? null : (anim.next == null || anim.next == true) ? name : anim.next;
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
	 * @method getAnimation
	 * @param {String} name The name of the animation to get.
	 * @return {Object} a generic object with frames, frequency, name, and next properties.
	 **/
	p.getAnimation = function(name) {
		return this._data[name];
	}
	
	/**
	 * Returns an object specifying the image and source rect of the specified frame. The returned object
	 * has an image property holding a reference to the image object in which the frame is found,
	 * and a rect property containing a Rectangle instance which defines the boundaries for the
	 * frame within that image.
	 * @method getFrame
	 * @param {Number} frameIndex The index of the frame.
	 * @return {Object} a generic object with image and rect properties. Returns null if the frame does not exist, or the image is not fully loaded.
	 **/
	p.getFrame = function(frameIndex) {
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
		// TODO: there isn't really any reason to clone SpriteSheet instances, because they can be reused.
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
	/**
	 * @method _handleImageLoad
	 * @protected
	 **/
	p._handleImageLoad = function() {
		if (--this._loadCount == 0) {
			this._calculateFrames();
			this.complete = true;
			this.onComplete&&this.onComplete();
		}
	}
	
	/**
	 * @method _calculateFrames
	 * @protected
	 **/
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
				this._frames.push({image:img, rect:new createjs.Rectangle(j%cols*fw,(j/cols|0)*fh,fw,fh), regX:this._regX, regY:this._regY });
			}
			ttlFrames += ttl;
		}
		this._numFrames = ttlFrames;
	}

createjs.SpriteSheet = SpriteSheet;
}());
