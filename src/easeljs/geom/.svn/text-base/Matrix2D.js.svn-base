/**
* Matrix2D by Grant Skinner. Dec 5, 2010
* Visit www.gskinner.com/blog for documentation, updates and more free code.
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
* Constructs a new Matrix2D instance.
* @param a Specifies the a property for the new matrix.
* @param b Specifies the b property for the new matrix.
* @param c Specifies the c property for the new matrix.
* @param d Specifies the d property for the new matrix.
* @param tx Specifies the tx property for the new matrix.
* @param ty Specifies the ty property for the new matrix.
* @class Represents an affine tranformation matrix, and provides tools for constructing and concatenating matrixes.
**/
function Matrix2D(a,b,c,d,tx,ty) {
  this.init(a,b,c,d,tx,ty);
}
var p = Matrix2D.prototype;
	
// static public properties:
	/**
	* An identity matrix, representing a null transformation. Read-only.
	* @static
	**/
	Matrix2D.identity = null; // set at bottom of class definition.
	
// public properties:
	/** Position 0,0 in an affine transformation Matrix. Maps roughly to scaleX, but is also involved in rotation. **/
	p.a = 1;
	/** Position 0,1 in an affine transformation Matrix. Used in rotation (also skewing, but not supported in Easel). **/
	p.b = 0;
	/** Position 1,0 in an affine transformation Matrix. Used in rotation (also skewing, but not supported in Easel). **/
	p.c = 0;
	/** Position 1,1 in an affine transformation Matrix. Maps roughly to scaleY, but is also involved in rotation. **/
	p.d = 1;
	/** Position 2,0 in an affine transformation Matrix. Translation along the x axis. **/
	p.tx = 0;
	/** Position 2,1 in an affine transformation Matrix. Translation along the y axis **/
	p.ty = 0;
	
// constructor:
	/** @private **/
	p.init = function(a,b,c,d,tx,ty) {
		if (a != null) { this.a = a; }
		if (b != null) { this.b = b; }
		if (c != null) { this.c = c; }
		if (d != null) { this.d = d; }
		if (tx != null) { this.tx = tx; }
		if (ty != null) { this.ty = ty; }
	}
	
// public methods:
	/**
	* Concatenates the specified matrix properties with this matrix. You must provide values for all of the parameters.
	**/
	p.concat = function(a, b, c, d, tx, ty) {
		var a1 = this.a;
		var c1 = this.c;
		var tx1 = this.tx;
		
		this.a = a1*a+this.b*c;
		this.b = a1*b+this.b*d;
		this.c = c1*a+this.d*c;
		this.d = c1*b+this.d*d;
		this.tx = tx1*a+this.ty*c+tx;
		this.ty = tx1*b+this.ty*d+ty;
	}
	
	/**
	* Concatenates the specified matrix with this matrix.
	**/
	p.concatMatrix = function(matrix) {
		return this.concat(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
	}
	
	/**
	* Generates matrix properties from the specified display object transform properties, and concatenates them with this matrix.
	* For example, you can use this to generate a matrix from a display object: var mtx = new Matrix2D(); mtx.concatTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation);
	* @param x
	* @param y
	* @param scaleX
	* @param scaleY
	* @param rotation
	* @param regX Optional.
	* @param regY Optional.
	**/
	p.concatTransform = function(x, y, scaleX, scaleY, rotation, regX, regY) {
		if (rotation%360) {
			var r = rotation*Math.PI/180;
			var cos = Math.cos(r);
			var sin = Math.sin(r);
		} else {
			cos = 1;
			sin = 0;
		}
		if (regX || regY) { this.tx -= regX; this.ty -= regY; }
		this.concat(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, x, y);
	}
	
	/**
	* Applies a rotation transformation to the matrix.
	**/
	p.rotate = function(angle) {
		var cos = Math.cos(angle);
		var sin = Math.sin(angle);
		
		var a1 = this.a;
		var c1 = this.c;
		var tx1 = this.tx;
		
		this.a = a1*cos-this.b*sin;
		this.b = a1*sin+this.b*cos;
		this.c = c1*cos-this.d*sin;
		this.d = c1*sin+this.d*cos;
		this.tx = tx1*cos-this.ty*sin;
		this.ty = tx1*sin+this.ty*cos;
	}
	
	/**
	* Applies a scale transformation to the matrix.
	**/
	p.scale = function(x, y) {
		this.a *= x;
		this.d *= y;
		this.tx *= x;
		this.ty *= y;
	}
	
	/**
	* Translates the matrix on the x and y axes.
	**/
	p.translate = function(x, y) {
		this.tx += x;
		this.ty += y;
	}
	
	/**
	* Sets the properties of the matrix to those of an identity matrix (one that applies a null transformation).
	**/
	p.identity = function() {
		this.a = this.d = 1;
		this.b = this.c = this.tx = this.ty = 0;
	}
	
	/**
	* Inverts the matrix, causing it to perform the opposite transformation.
	**/
	p.invert = function() {
		var a1 = this.a;
		var b1 = this.b;
		var c1 = this.c;
		var d1 = this.d;
		var tx1 = this.tx;
		var n = a1*d1-b1*c1;
		
		this.a = d1/n;
		this.b = -b1/n;
		this.c = -c1/n;
		this.d = a1/n;
		this.tx = (c1*this.ty-d1*tx1)/n;
		this.ty = -(a1*this.ty-b1*tx1)/n;
	}
	
	/**
	* Returns a clone of this Matrix.
	**/
	p.clone = function() {
		return new Matrix2D(this.a, this.b, this.c, this.d, this.tx, this.ty);
	}

	/**
	* Returns a string representation of this object.
	**/
	p.toString = function() {
		return "[Matrix2D (a="+this.a+" b="+this.b+" c="+this.c+" d="+this.d+" tx="+this.tx+" ty="+this.ty+")]";
	}
	
	// this has to be populated after the class is defined:
	Matrix2D.identity = new Matrix2D(1, 0, 0, 1, 0, 0);
	
window.Matrix2D = Matrix2D;
}(window));