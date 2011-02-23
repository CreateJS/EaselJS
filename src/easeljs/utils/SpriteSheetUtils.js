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
	SpriteSheetUtils = function() {
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
	* Builds a new extended sprite sheet based on the specified sprite sheet by adding flipped frames
	* (vertical, horizontal, or both). Flipping elements on the display list by using setting scaleX/scaleY
	* to -1 is quite expensive in most browsers, so this method allows you to incur the cost of flipping once,
	* in advance, without increasing the load size of your sprite sheets. Returns a new SpriteSheet instance
	* containing the generated image and frame data.
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
	SpriteSheetUtils.flip = function(spriteSheet, flipData) {
		var image = spriteSheet.image;
		var frameData = spriteSheet.frameData;
		var frameWidth = spriteSheet.frameWidth;
		var frameHeight = spriteSheet.frameHeight;
		
		var cols = image.width/frameWidth|0;
		var rows = image.height/frameHeight|0;
		var ttlFrames = cols*rows;
		
		// clone frameData:
		var frData = {};
		var data;
		for (var n in frameData) {
			data = frameData[n];
			if (data instanceof Array) { data = data.slice(0); }
			frData[n] = data;
		}
		
		// calculate how many new frames we're generating, and build a map:
		var map = [];
		var frCount = 0;
		var i = 0;
		for (n in flipData) {
			var fd = flipData[n];
			data = frameData[fd[0]];
			if (data ==  null) { continue; }
			if (data instanceof Array) {
				var start = data[0];
				var end = data[1];
				if (end == null) { end = start; }
			} else {
				start = end = data;
			}
			map[i] = n;
			map[i+1] = start;
			map[i+2] = end;
			frCount += end-start+1;
			i+=4;
		}
		
		// get the canvas ready:
		var canvas = SpriteSheetUtils._workingCanvas;
		canvas.width = image.width;
		canvas.height = Math.ceil(rows+frCount/cols)*frameHeight;
		var ctx = SpriteSheetUtils._workingContext;
		ctx.drawImage(image, 0, 0, cols*frameWidth, rows*frameHeight, 0, 0, cols*frameWidth, rows*frameHeight);
		
		// draw the new frames, and update the new frameData:
		var frame = ttlFrames-1;
		for (i=0; i<map.length; i+=4) {
			n = map[i];
			start = map[i+1];
			end = map[i+2];
			fd = flipData[n];
			var flipH = fd[1]?-1:1;
			var flipV = fd[2]?-1:1;
			var offH = flipH==-1?frameWidth:0;
			var offV = flipV==-1?frameHeight:0;
			
			for (var j=start; j<=end; j++) {
				frame++;
				ctx.save();
				ctx.translate((frame%cols)*frameWidth+offH, (frame/cols|0)*frameHeight+offV);
				ctx.scale(flipH, flipV);
				ctx.drawImage(image, (j%cols)*frameWidth, (j/cols|0)*frameHeight, frameWidth, frameHeight, 0, 0, frameWidth, frameHeight);
				
				ctx.restore();
			}
			frData[n] = [frame-(end-start), frame, fd[3]];
			
		}
		
		var img = new Image();
		img.src = canvas.toDataURL("image/png");
		return new SpriteSheet((img.width > 0)? img : canvas, frameWidth, frameHeight, frData);
	}
	
	/**
	* Returns a string representing the specified frameData object.
	* @method frameDataToString
	* @static
	* @param {Object} frameData The frame data to output.
	* @return {String} The a String representing the specified frameData object?
	**/
	SpriteSheetUtils.frameDataToString = function(frameData) {
		var str = "";
		var max = 0;
		var min = 0;
		var count = 0;
		var data, next;
		for (var n in frameData) {
			count++;
			data = frameData[n];
			if (data instanceof Array) {
				var start = data[0];
				var end = data[1];
				if (end == null) { end = start; }
				next = data[2];
				if (next == null) { next = n; }
			} else {
				start = end = data;
				next = n;
			}
			str += "\n\t"+n+", start="+start+", end="+end+", next="+next;
			if (next == false) { str += " (stop)"; }
			else if (next == n) { str += " (loop)"; }
			if (end > max) { max = end; }
			if (start < min) { min = start; }
		}
		str = count+" sequences, min="+min+", max="+max+str;
		return str;
	}

	/**
	* Returns a single frame of the specified sprite sheet as a new PNG image.
	* @method extractFrame
	* @static
	* @param {Image} spriteSheet The SpriteSheet instance to extract a frame from.
	* @param {Number} frame The frame number or sequence name to extract. If a sequence 
	* name is specified, only the first frame of the sequence will be extracted.
	* @return {Image} a single frame of the specified sprite sheet as a new PNG image.
	*/
	SpriteSheetUtils.extractFrame = function(spriteSheet, frame) {
		var image = spriteSheet.image;
		var frameWidth = spriteSheet.frameWidth;
		var frameHeight = spriteSheet.frameHeight;
		var cols = image.width/frameWidth|0;
		if (isNaN(frame)) {
			var data = spriteSheet.frameData[frame];
			if (data instanceof Array) { frame = data[0]; }
			else { frame = data; }
		}
		var canvas = SpriteSheetUtils._workingCanvas;
		canvas.width = frameWidth;
		canvas.height = frameHeight;
		SpriteSheetUtils._workingContext.drawImage(image, (frame%cols)*frameWidth, (frame/cols|0)*frameHeight, frameWidth, frameHeight, 0, 0, frameWidth, frameHeight);
		var img = new Image();
		img.src = canvas.toDataURL("image/png");
		return img;
	}

window.SpriteSheetUtils = SpriteSheetUtils;
}(window));