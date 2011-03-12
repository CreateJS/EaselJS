/*
* ColorMatrixFilter by Grant Skinner. Mar 7, 2011
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
* Applies color transforms.
* @class ColorMatrixFilter
* @constructor
**/
ColorMatrixFilter = function(matrix) {
  this.initialize(matrix);
}
var p = ColorMatrixFilter.prototype = new Filter();

// public properties:
	p.matrix = null;
	
// constructor:
	// TODO: detailed docs.
	/** 
	* Initialization method.
	* @method initialize
	* @protected
	* @param matrix A 4x5 matrix describing the color operation to perform.
	**/
	p.initialize = function(matrix) {
		this.matrix = matrix;
	}
	
// public methods:
	/**
	* Applies the filter to the specified context.
	* @method applyFilter
	* @param ctx The 2D context to use as the source.
	* @param x The x position to use for the source rect.
	* @param y The y position to use for the source rect.
	* @param width The width to use for the source rect.
	* @param height The height to use for the source rect.
	* @param targetCtx Optional. The 2D context to draw the result to. Defaults to the context passed to ctx.
	* @param targetX Optional. The x position to draw the result to. Defaults to the value passed to x.
	* @param targetY Optional. The y position to draw the result to. Defaults to the value passed to y.
	**/
	p.applyFilter = function(ctx, x, y, width, height, targetCtx, targetX, targetY) {
		targetCtx = targetCtx || ctx;
		if (targetX = null) { targetX = x; }
		if (targetY = null) { targetY = y; }
		try {
			var imageData = ctx.getImageData(x, y, width, height);
		} catch(e) {
			//if (!this.suppressCrossDomainErrors) throw new Error("unable to access local image data: " + e);
			return false;
		}
		var data = imageData.data;
		var l = data.length;
		var r,g,b,a;
		var mtx = this.matrix;
		
		// TODO: this would run 10-20% faster if the matrix was broken out into vars.
		for (var i=0; i<l; i+=4) {
			r = data[i];
			g = data[i+1];
			b = data[i+2];
			a = data[i+3];
			data[i] = r*mtx[0]+g*mtx[1]+b*mtx[2]+a*mtx[3]+mtx[4];
			data[i+1] = r*mtx[5]+g*mtx[6]+b*mtx[7]+a*mtx[8]+mtx[9];
			data[i+2] = r*mtx[10]+g*mtx[11]+b*mtx[12]+a*mtx[13]+mtx[14];
			data[i+3] = r*mtx[15]+g*mtx[16]+b*mtx[17]+a*mtx[18]+mtx[19];
		}
		imageData.data = data;
		targetCtx.putImageData(imageData, targetX, targetY);
		return true;
	}

	/**
	* Returns a string representation of this object.
	* @method toString
	* @return {String} a string representation of the instance.
	**/
	p.toString = function() {
		return "[ColorMatrixFilter]";
	}
	
	
	/**
	* Returns a clone of this ColorMatrixFilter instance.
	* @method clone
	 @return {ColorMatrixFilter} A clone of the current ColorMatrixFilter instance.
	**/
	p.clone = function() {
		return new ColorMatrixFilter(this.matrix);
	}
	
window.ColorMatrixFilter = ColorMatrixFilter;
}(window));