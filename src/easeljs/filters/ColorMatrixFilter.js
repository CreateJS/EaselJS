/*
* ColorMatrixFilter
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


// constructor:
	/**
	 * Allows you to carry out complex color operations such as modifying saturation, brightness, or inverting. See the
	 * {{#crossLink "ColorMatrix"}}{{/crossLink}} for more information on changing colors. For an easier color transform,
	 * consider the {{#crossLink "ColorFilter"}}{{/crossLink}}.
	 *
	 * <h4>Example</h4>
	 * This example creates a red circle, inverts its hue, and then saturates it to brighten it up.
	 *
	 *      var shape = new createjs.Shape().set({x:100,y:100});
	 *      shape.graphics.beginFill("#ff0000").drawCircle(0,0,50);
	 *
	 *      var matrix = new createjs.ColorMatrix().adjustHue(180).adjustSaturation(100);
	 *      shape.filters = [
	 *          new createjs.ColorMatrixFilter(matrix)
	 *      ];
	 *
	 *      shape.cache(-50, -50, 100, 100);
	 *
	 * <h4>Example</h4>
	 * This example uses a preset to generate a sepia photograph effect
	 *
	 *      var shape = new createjs.Shape().set({x:100,y:100});
	 *      shape.graphics.beginFill("#ff0000").drawCircle(0,0,50);
	 *
	 *      shape.filters = [
	 *          new createjs.ColorMatrixFilter( createjs.ColorMatrix.createSepiaPreset() )
	 *      ];
	 *
	 *      shape.cache(-50, -50, 100, 100);
	 *
	 * See {{#crossLink "Filter"}}{{/crossLink}} for an more information on applying filters.
	 * @class ColorMatrixFilter
	 * @constructor
	 * @extends Filter
	 * @param {Array | ColorMatrix} matrix A 4x5 matrix describing the color operation to perform. See also the {{#crossLink "ColorMatrix"}}{{/crossLink}}
	 * class.
	 **/
	function ColorMatrixFilter(matrix) {
		this.Filter_constructor();

	// public properties:
		/**
		 * A 4x5 matrix describing the color operation to perform. See also the {{#crossLink "ColorMatrix"}}{{/crossLink}}
		 * @property matrix
		 * @type Array | ColorMatrix
		 **/
		this.matrix = matrix;

		this.FRAG_SHADER_BODY = (
			"uniform mat4 uColorMatrix;" +
			"uniform vec4 uColorMatrixOffset;" +

			"void main(void) {" +
				"vec4 color = texture2D(uSampler, vTextureCoord);" +

				"mat4 m = uColorMatrix;" +
				"vec4 newColor = vec4(" +
					"color.r*m[0][0] + color.g*m[0][1] + color.b*m[0][2] + color.a*m[0][3]," +
					"color.r*m[1][0] + color.g*m[1][1] + color.b*m[1][2] + color.a*m[1][3]," +
					"color.r*m[2][0] + color.g*m[2][1] + color.b*m[2][2] + color.a*m[2][3]," +
					"color.r*m[3][0] + color.g*m[3][1] + color.b*m[3][2] + color.a*m[3][3]" +
				");" +

				"gl_FragColor = newColor + uColorMatrixOffset;" +
			"}"
		);
	}
	var p = createjs.extend(ColorMatrixFilter, createjs.Filter);

	// TODO: deprecated
	// p.initialize = function() {}; // searchable for devs wondering where it is. REMOVED. See docs for details.

	// Docced in superclass
	p.shaderParamSetup = function(gl, stage, shaderProgram) {
		var mat = this.matrix;
		var colorMatrix = new Float32Array([
			mat[0],mat[1],mat[2],mat[3],
			mat[5],mat[6],mat[7],mat[8],
			mat[10],mat[11],mat[12],mat[13],
			mat[15],mat[16],mat[17],mat[18]
		]);

		gl.uniformMatrix4fv(
			gl.getUniformLocation(shaderProgram, "uColorMatrix"),
			false, colorMatrix
		);
		gl.uniform4f(
			gl.getUniformLocation(shaderProgram, "uColorMatrixOffset"),
			mat[4]/255, mat[9]/255, mat[14]/255, mat[19]/255
		);
	};

// public methods:
	// Docced in superclass
	p.toString = function() {
		return "[ColorMatrixFilter]";
	};

	// Docced in superclass
	p.clone = function() {
		return new ColorMatrixFilter(this.matrix);
	};

// private methods:
	// Docced in superclass
	p._applyFilter = function(imageData) { 
		var data = imageData.data;
		var l = data.length;
		var r,g,b,a;
		var mtx = this.matrix;
		var m0 =  mtx[0],  m1 =  mtx[1],  m2 =  mtx[2],  m3 =  mtx[3],  m4 =  mtx[4];
		var m5 =  mtx[5],  m6 =  mtx[6],  m7 =  mtx[7],  m8 =  mtx[8],  m9 =  mtx[9];
		var m10 = mtx[10], m11 = mtx[11], m12 = mtx[12], m13 = mtx[13], m14 = mtx[14];
		var m15 = mtx[15], m16 = mtx[16], m17 = mtx[17], m18 = mtx[18], m19 = mtx[19];

		for (var i=0; i<l; i+=4) {
			r = data[i];
			g = data[i+1];
			b = data[i+2];
			a = data[i+3];
			data[i] = r*m0+g*m1+b*m2+a*m3+m4; // red
			data[i+1] = r*m5+g*m6+b*m7+a*m8+m9; // green
			data[i+2] = r*m10+g*m11+b*m12+a*m13+m14; // blue
			data[i+3] = r*m15+g*m16+b*m17+a*m18+m19; // alpha
		}
		return true;
	};

	createjs.ColorMatrixFilter = createjs.promote(ColorMatrixFilter, "Filter");
}());
