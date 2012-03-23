/*
* SpriteSheetUtils by Grant Skinner. Dec 5, 2010
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

// Node.js-ification
if (typeof module !== 'undefined' && module.exports) {
    var Canvas   = require('canvas');
    var Image    = Canvas.Image;
    var window   = module.exports;
        document = require('../node/document');
}

(function(window) {
// constructor:
/**
* The SpriteSheetUtils class is a collection of static methods for working
* with sprite sheets.  A sprite sheet is a series of images (usually animation frames)
* combined into a single image on a regular grid. For example, an animation consisting
* of 8 100x100 images could be combined into a 400x200 sprite sheet (4 frames across by 2 high).
* The SpriteSheetUtils class uses a static interface and should not be instantiated.
* @class SpriteSheetUtils
* @static
**/
var SpriteSheetUtils = function() {
	throw "SpriteSheetUtils cannot be instantiated";
}

	/**
	 * @property _workingCanvas
	 * @static
	 * @type HTMLCanvasElement
	 * @protected
	*/
	SpriteSheetUtils._workingCanvas = document.createElement("canvas");

	/**
	 * @property _workingContext
	 * @static
	 * @type CanvasRenderingContext2D
	 * @protected
	*/
	SpriteSheetUtils._workingContext = SpriteSheetUtils._workingCanvas.getContext("2d");

// public static methods:
	/**
	 * <b>This is an experimental method, and is likely to be buggy. Please report issues.</b><br/><br/>
	 * Extends the existing sprite sheet by flipping the original frames either horizontally, vertically, or both,
	 * and adding appropriate animation & frame data.
	 * @method flip
	 * @static
	 * @param {Image} spriteSheet The sprite sheet to use as the source.
	 * @param {Object} flipData A generic object that specifies which frames will be flipped, what to name the
	 * flipped result, and how to flip the frames (horizontally, vertically, or both). Each property name
	 * indicates the name of a new sequence to create, and should reference an array where the first index is
	 * the name of the original sequence to flip, the second index indicates whether to flip it horizontally,
	 * the third index indicates whether to flip it vertically, and the fourth indicates what the "next" value
	 * for the resulting frame data should be. For example, the following would create a new sequence named
	 * "walk_left" consisting of the frames from the original "walk_right" sequence flipped
	 * horizontally: &#123;walk_left: ["walk_right", true, false]&#125;
	 **/
	SpriteSheetUtils.addFlippedFrames = function(spriteSheet, horizontal, vertical, both) {
		if (!horizontal && !vertical && !both) { return; }
		
		var count = 0;
		if (horizontal) { SpriteSheetUtils._flip(spriteSheet,++count,true,false); }
		if (vertical) { SpriteSheetUtils._flip(spriteSheet,++count,false,true); }
		if (both) { SpriteSheetUtils._flip(spriteSheet,++count,true,true); }
	}

	/**
	 * Returns a single frame of the specified sprite sheet as a new PNG image.
	 * @method extractFrame
	 * @static
	 * @param {Image} spriteSheet The SpriteSheet instance to extract a frame from.
	 * @param {Number} frame The frame number or animation name to extract. If an animation
	 * name is specified, only the first frame of the animation will be extracted.
	 * @param {Function} method to call once frame image is finished loading
	 * @return {Image} a single frame of the specified sprite sheet as a new PNG image.
	*/
	SpriteSheetUtils.extractFrame = function(spriteSheet, frame, loaded) {
		loaded = typeof loaded == 'function' ? loaded : function() {};

		if (isNaN(frame)) {
			frame = spriteSheet.getAnimation(frame).frames[0];
		}
		var data = spriteSheet.getFrame(frame);
		if (!data) { return null; }
		var r = data.rect;
		var canvas = SpriteSheetUtils._workingCanvas;
		canvas.width = r.width;
		canvas.height = r.height;
		SpriteSheetUtils._workingContext.drawImage(data.image, r.x, r.y, r.width, r.height, 0, 0, r.width, r.height);
		var img = new Image();
		img.onload = function() {
			loaded(img);
		};
		img.src = canvas.toDataURL("image/png");
		return img;
	}

	
// private static methods:
	SpriteSheetUtils._flip = function(spriteSheet, count, h, v) {
		var imgs = spriteSheet._images;
		var canvas = SpriteSheetUtils._workingCanvas;
		var ctx = SpriteSheetUtils._workingContext;
		var il = imgs.length/count;
		for (var i=0;i<il;i++) {
			var src = imgs[i];
			src.__tmp = i; // a bit hacky, but faster than doing indexOf below.
			canvas.width = src.width;
			canvas.height = src.height;
			ctx.setTransform(h?-1:1, 0, 0, v?-1:1, h?src.width:0, v?src.height:0);
			ctx.drawImage(src,0,0);
			var img = new Image();
			img.src = canvas.toDataURL("image/png");
			// work around a strange bug in Safari:
			img.width = src.width;
			img.height = src.height;
			imgs.push(img);
		}
		
		var frames = spriteSheet._frames;
		var fl = frames.length/count;
		for (i=0;i<fl;i++) {
			src = frames[i];
			var rect = src.rect.clone();
			img = imgs[src.image.__tmp+il*count];
			
			var frame = {image:img,rect:rect,regX:src.regX,regY:src.regY};
			if (h) {
				rect.x = img.width-rect.x-rect.width; // update rect
				frame.regX = rect.width-src.regX; // update registration point
			}
			if (v) {
				rect.y = img.height-rect.y-rect.height;  // update rect
				frame.regY = rect.height-src.regY; // update registration point
			}
			frames.push(frame);
		}
		
		var sfx = "_"+(h?"h":"")+(v?"v":"");
		var names = spriteSheet._animations;
		var data = spriteSheet._data;
		var al = names.length/count;
		for (i=0;i<al;i++) {
			var name = names[i];
			src = data[name];
			var anim = {name:name+sfx,frequency:src.frequency,next:src.next,frames:[]};
			if (src.next) { anim.next += sfx; }
			frames = src.frames;
			for (var j=0,l=frames.length;j<l;j++) {
				anim.frames.push(frames[j]+fl*count);
			}
			data[anim.name] = anim;
			names.push(anim.name);
		}
	}

window.SpriteSheetUtils = SpriteSheetUtils;
}(window));