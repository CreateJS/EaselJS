/*
* BlurFilter
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

/**
 * @module EaselJS
 */

// namespace:
this.createjs = this.createjs||{};

(function() {
	"use strict";

/**
 * Applies a box blur to DisplayObjects. Note that this filter is fairly CPU intensive, particularly if the quality is
 * set higher than 1.
 *
 * <h4>Example</h4>
 * This example creates a red circle, and then applies a 5 pixel blur to it. It uses the {{#crossLink "Filter/getBounds"}}{{/crossLink}}
 * method to account for the spread that the blur causes.
 *
 *      var shape = new createjs.Shape().set({x:100,y:100});
 *      shape.graphics.beginFill("#ff0000").drawCircle(0,0,50);
 *
 *      var blurFilter = new createjs.BlurFilter(5, 5, 1);
 *      shape.filters = [blurFilter];
 *      var bounds = blurFilter.getBounds();
 *
 *      shape.cache(-50+bounds.x, -50+bounds.y, 100+bounds.width, 100+bounds.height);
 *
 * See {{#crossLink "Filter"}}{{/crossLink}} for an more information on applying filters.
 * @class BlurFilter
 * @extends Filter
 * @constructor
 * @param {Number} [blurX=0] The horizontal blur radius in pixels.
 * @param {Number} [blurY=0] The vertical blur radius in pixels.
 * @param {Number} [quality=1] The number of blur iterations.
 **/
var BlurFilter = function( blurX, blurY, quality ) {
  this.initialize( blurX, blurY, quality );
};
var p = BlurFilter.prototype = new createjs.Filter();

// constructor:
	/** @ignore */
	p.initialize = function( blurX, blurY, quality ) {
		if ( isNaN(blurX) || blurX < 0 ) blurX = 0;
		this.blurX = blurX | 0;
		if ( isNaN(blurY) || blurY < 0 ) blurY = 0;
		this.blurY = blurY | 0;
		if ( isNaN(quality) || quality < 1  ) quality = 1;
		this.quality = quality | 0;
	};

// public properties:

	/**
	 * Horizontal blur radius in pixels
	 * @property blurX
	 * @default 0
	 * @type Number
	 **/
	p.blurX = 0;

	/**
	 * Vertical blur radius in pixels
	 * @property blurY
	 * @default 0
	 * @type Number
	 **/
	p.blurY = 0;

	/**
	 * Number of blur iterations. For example, a value of 1 will produce a rough blur. A value of 2 will produce a
	 * smoother blur, but take twice as long to run.
	 * @property quality
	 * @default 1
	 * @type Number
	 **/
	p.quality = 1;
	
	//TODO: There might be a better better way to place these two lookup tables:
	p.mul_table = [ 1,171,205,293,57,373,79,137,241,27,391,357,41,19,283,265,497,469,443,421,25,191,365,349,335,161,155,149,9,278,269,261,505,245,475,231,449,437,213,415,405,395,193,377,369,361,353,345,169,331,325,319,313,307,301,37,145,285,281,69,271,267,263,259,509,501,493,243,479,118,465,459,113,446,55,435,429,423,209,413,51,403,199,393,97,3,379,375,371,367,363,359,355,351,347,43,85,337,333,165,327,323,5,317,157,311,77,305,303,75,297,294,73,289,287,71,141,279,277,275,68,135,67,133,33,262,260,129,511,507,503,499,495,491,61,121,481,477,237,235,467,232,115,457,227,451,7,445,221,439,218,433,215,427,425,211,419,417,207,411,409,203,202,401,399,396,197,49,389,387,385,383,95,189,47,187,93,185,23,183,91,181,45,179,89,177,11,175,87,173,345,343,341,339,337,21,167,83,331,329,327,163,81,323,321,319,159,79,315,313,39,155,309,307,153,305,303,151,75,299,149,37,295,147,73,291,145,289,287,143,285,71,141,281,35,279,139,69,275,137,273,17,271,135,269,267,133,265,33,263,131,261,130,259,129,257,1];
        
   
	p.shg_table = [0,9,10,11,9,12,10,11,12,9,13,13,10,9,13,13,14,14,14,14,10,13,14,14,14,13,13,13,9,14,14,14,15,14,15,14,15,15,14,15,15,15,14,15,15,15,15,15,14,15,15,15,15,15,15,12,14,15,15,13,15,15,15,15,16,16,16,15,16,14,16,16,14,16,13,16,16,16,15,16,13,16,15,16,14,9,16,16,16,16,16,16,16,16,16,13,14,16,16,15,16,16,10,16,15,16,14,16,16,14,16,16,14,16,16,14,15,16,16,16,14,15,14,15,13,16,16,15,17,17,17,17,17,17,14,15,17,17,16,16,17,16,15,17,16,17,11,17,16,17,16,17,16,17,17,16,17,17,16,17,17,16,16,17,17,17,16,14,17,17,17,17,15,16,14,16,15,16,13,16,15,16,14,16,15,16,12,16,15,16,17,17,17,17,17,13,16,15,17,17,17,16,15,17,17,17,16,15,17,17,14,16,17,17,16,17,17,16,15,17,16,14,17,16,15,17,16,17,17,16,17,15,16,17,14,17,16,15,17,16,17,13,17,16,17,17,16,17,14,17,16,17,16,17,16,17,9];

// public methods:
	/** docced in super class **/
	p.getBounds = function() {
		var q = Math.pow(this.quality, 0.6)*0.5;
		return new createjs.Rectangle(-this.blurX*q,-this.blurY*q,2*this.blurX*q,2*this.blurY*q);
	};

	p.applyFilter = function(ctx, x, y, width, height, targetCtx, targetX, targetY) {
		targetCtx = targetCtx || ctx;
		if (targetX == null) { targetX = x; }
		if (targetY == null) { targetY = y; }
		try {
			var imageData = ctx.getImageData(x, y, width, height);
		} catch(e) {
			//if (!this.suppressCrossDomainErrors) throw new Error("unable to access local image data: " + e);
			return false;
		}

		var radiusX = this.blurX/2;
		if ( isNaN(radiusX) || radiusX < 0 ) return false;
		radiusX |= 0;

		var radiusY = this.blurY/2;
		if ( isNaN(radiusY) || radiusY < 0 ) return false;
		radiusY |= 0;

		if ( radiusX == 0 && radiusY == 0 ) return false;

		var iterations = this.quality;
		if ( isNaN(iterations) || iterations < 1  ) iterations = 1;
		iterations |= 0;
		if ( iterations > 3 ) iterations = 3;
		if ( iterations < 1 ) iterations = 1;

		var pixels = imageData.data;

		var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum, a_sum, 
		r_out_sum, g_out_sum, b_out_sum, a_out_sum,
		r_in_sum, g_in_sum, b_in_sum, a_in_sum, 
		pr, pg, pb, pa, rbs;

		var divx = radiusX + radiusX + 1;
		var divy = radiusY + radiusY + 1;
		var w4 = width << 2;
		var widthMinus1  = width - 1;
		var heightMinus1 = height - 1;
		var rxp1  = radiusX + 1;
		var ryp1  = radiusY + 1;
		var stackStartX = {r:0,b:0,g:0,a:0,next:null};
		var stackx = stackStartX;
		for ( i = 1; i < divx; i++ )
		{
			stackx = stackx.next = {r:0,b:0,g:0,a:0,next:null};
			if ( i == rxp1 ) var stackEndX = stackx;
		}
		stackx.next = stackStartX;
		
		var stackStartY = {r:0,b:0,g:0,a:0,next:null};
		var stacky = stackStartY;
		for ( i = 1; i < divy; i++ )
		{
			stacky = stacky.next = {r:0,b:0,g:0,a:0,next:null};
			if ( i == ryp1 ) var stackEndY = stacky;
		}
		stacky.next = stackStartY;
		
		var stackIn = null;



		
		while ( iterations-- > 0 ) {
			yw = yi = 0;
			var mul_sum = this.mul_table[radiusX];
			var shg_sum = this.shg_table[radiusX];
			for ( y = height; --y > -1; )
			{
				r_sum = rxp1 * ( pr = pixels[yi] );
				g_sum = rxp1 * ( pg = pixels[yi+1] );
				b_sum = rxp1 * ( pb = pixels[yi+2] );
				a_sum = rxp1 * ( pa = pixels[yi+3] );

				stackx = stackStartX;

				for( i = rxp1; --i > -1; )
				{
					stackx.r = pr;
					stackx.g = pg;
					stackx.b = pb;
					stackx.a = pa;
					stackx = stackx.next;
				}

				for( i = 1; i < rxp1; i++ )
				{
					p = yi + (( widthMinus1 < i ? widthMinus1 : i ) << 2 );
					r_sum += ( stackx.r = pixels[p]);
					g_sum += ( stackx.g = pixels[p+1]);
					b_sum += ( stackx.b = pixels[p+2]);
					a_sum += ( stackx.a = pixels[p+3]);

					stackx = stackx.next;
				}

				stackIn = stackStartX;
				for ( x = 0; x < width; x++ )
				{
					pixels[yi++] = (r_sum * mul_sum) >>> shg_sum;
					pixels[yi++] = (g_sum * mul_sum) >>> shg_sum;
					pixels[yi++] = (b_sum * mul_sum) >>> shg_sum;
					pixels[yi++] = (a_sum * mul_sum) >>> shg_sum;

					p =  ( yw + ( ( p = x + radiusX + 1 ) < widthMinus1 ? p : widthMinus1 ) ) << 2;

					r_sum -= stackIn.r - ( stackIn.r = pixels[p]);
					g_sum -= stackIn.g - ( stackIn.g = pixels[p+1]);
					b_sum -= stackIn.b - ( stackIn.b = pixels[p+2]);
					a_sum -= stackIn.a - ( stackIn.a = pixels[p+3]);

					stackIn = stackIn.next;

				}
				yw += width;
			}

			mul_sum = this.mul_table[radiusY];
			shg_sum = this.shg_table[radiusY];
			for ( x = 0; x < width; x++ )
			{
				yi = x << 2;

				r_sum = ryp1 * ( pr = pixels[yi]);
				g_sum = ryp1 * ( pg = pixels[yi+1]);
				b_sum = ryp1 * ( pb = pixels[yi+2]);
				a_sum = ryp1 * ( pa = pixels[yi+3]);

				stacky = stackStartY;

				for( i = 0; i < ryp1; i++ )
				{
					stacky.r = pr;
					stacky.g = pg;
					stacky.b = pb;
					stacky.a = pa;
					stacky = stacky.next;
				}

				yp = width;

				for( i = 1; i <= radiusY; i++ )
				{
					yi = ( yp + x ) << 2;

					r_sum += ( stacky.r = pixels[yi]);
					g_sum += ( stacky.g = pixels[yi+1]);
					b_sum += ( stacky.b = pixels[yi+2]);
					a_sum += ( stacky.a = pixels[yi+3]);

					stacky = stacky.next;

					if( i < heightMinus1 )
					{
						yp += width;
					}
				}

				yi = x;
				stackIn = stackStartY;
				if ( iterations > 0 )
				{
					for ( y = 0; y < height; y++ )
					{
						p = yi << 2;
						pixels[p+3] = pa =(a_sum * mul_sum) >>> shg_sum;
						if ( pa > 0 )
						{
							pixels[p]   = ((r_sum * mul_sum) >>> shg_sum ); 
							pixels[p+1] = ((g_sum * mul_sum) >>> shg_sum );
							pixels[p+2] = ((b_sum * mul_sum) >>> shg_sum );
						} else {
							pixels[p] = pixels[p+1] = pixels[p+2] = 0
						}

						p = ( x + (( ( p = y + ryp1) < heightMinus1 ? p : heightMinus1 ) * width )) << 2;

						r_sum -= stackIn.r - ( stackIn.r = pixels[p]);
						g_sum -= stackIn.g - ( stackIn.g = pixels[p+1]);
						b_sum -= stackIn.b - ( stackIn.b = pixels[p+2]);
						a_sum -= stackIn.a - ( stackIn.a = pixels[p+3]);

						stackIn = stackIn.next;

						yi += width;
					}
				} else {
					for ( y = 0; y < height; y++ )
					{
						p = yi << 2;
						pixels[p+3] = pa =(a_sum * mul_sum) >>> shg_sum;
						if ( pa > 0 )
						{
							pa = 255 / pa;
							pixels[p]   = ((r_sum * mul_sum) >>> shg_sum ) * pa; 
							pixels[p+1] = ((g_sum * mul_sum) >>> shg_sum ) * pa;
							pixels[p+2] = ((b_sum * mul_sum) >>> shg_sum ) * pa;
						} else {
							pixels[p] = pixels[p+1] = pixels[p+2] = 0
						}

						p = ( x + (( ( p = y + ryp1) < heightMinus1 ? p : heightMinus1 ) * width )) << 2;

						r_sum -= stackIn.r - ( stackIn.r = pixels[p]);
						g_sum -= stackIn.g - ( stackIn.g = pixels[p+1]);
						b_sum -= stackIn.b - ( stackIn.b = pixels[p+2]);
						a_sum -= stackIn.a - ( stackIn.a = pixels[p+3]);

						stackIn = stackIn.next;

						yi += width;
					}
				}
			}
		}
		targetCtx.putImageData(imageData, targetX, targetY);
		return true;
	};

	/**
	 * Returns a clone of this object.
	 * @method clone
	 * @return {BlurFilter}
	 **/
	p.clone = function() {
		return new BlurFilter(this.blurX, this.blurY, this.quality);
	};

	p.toString = function() {
		return "[BlurFilter]";
	};

	createjs.BlurFilter = BlurFilter;

}());
