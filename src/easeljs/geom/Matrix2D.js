/**
* Matrix2D by Grant Skinner. Dec 5, 2010
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
Matrix2D = function(a, b, c, d, tx, ty) {
  this.initialize(a, b, c, d, tx, ty);
}
	
// static public properties:
	/**
	* An identity matrix, representing a null transformation. Read-only.
	* @static
	**/
	Matrix2D.identity = null; // set at bottom of class definition.

	/** Multiplier for converting degrees to radians. Used internally by Matrix2D. */
	Matrix2D.DEG_TO_RAD = Math.PI/180;

	
// public properties:
	/** Position (0, 0) in a 3x3 affine transformation matrix. */
	Matrix2D.prototype.a = 1;
	/** Position (0, 1) in a 3x3 affine transformation matrix. */
	Matrix2D.prototype.b = 0;
	/** Position (1, 0) in a 3x3 affine transformation matrix. */
	Matrix2D.prototype.c = 0;
	/** Position (1, 1) in a 3x3 affine transformation matrix. */
	Matrix2D.prototype.d = 1;
	/** Position (2, 0) in a 3x3 affine transformation matrix. */
	Matrix2D.prototype.tx = 0;
	/** Position (2, 1) in a 3x3 affine transformation matrix. */
	Matrix2D.prototype.ty = 0;
	/** Property representing the alpha that will be applied to a display object. This is not part of matrix operations, but is used for operations like getConcatenatedMatrix to provide concatenated alpha values. */
	Matrix2D.prototype.alpha = 1;
	/** Property representing the shadow that will be applied to a display object. This is not part of matrix operations, but is used for operations like getConcatenatedMatrix to provide concatenated shadow values. */
	Matrix2D.prototype.shadow  = null;
	/** Property representing the compositeOperation that will be applied to a display object. This is not part of matrix operations, but is used for operations like getConcatenatedMatrix to provide concatenated compositeOperation values. */
	Matrix2D.prototype.compositeOperation  = null;
	
// constructor:
	/** @ignore */
	Matrix2D.prototype.initialize = function(a, b, c, d, tx, ty) {
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
	Matrix2D.prototype.prepend = function(a, b, c, d, tx, ty) {
		var tx1 = this.tx;
		if (a != 1 || b != 0 || c != 0 || d != 1) {
			var a1 = this.a;
			var c1 = this.c;
			this.a  = a1*a+this.b*c;
			this.b  = a1*b+this.b*d;
			this.c  = c1*a+this.d*c;
			this.d  = c1*b+this.d*d;
		}
		this.tx = tx1*a+this.ty*c+tx;
		this.ty = tx1*b+this.ty*d+ty;
	}

	Matrix2D.prototype.append = function(a, b, c, d, tx, ty) {
		var a1 = this.a;
		var b1 = this.b;
		var c1 = this.c;
		var d1 = this.d;
		
		this.a  = a*a1+b*c1;
		this.b  = a*b1+b*d1;
		this.c  = c*a1+d*c1;
		this.d  = c*b1+d*d1;
		this.tx = tx*a1+ty*c1+this.tx;
		this.ty = tx*b1+ty*d1+this.ty;
	}
	
	/**
	* Prepends the specified matrix with this matrix.
	**/
	Matrix2D.prototype.prependMatrix = function(matrix) {
		this.prepend(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
		this.prependProperties(matrix.alpha, matrix.shadow,  matrix.compositeOperation);
	}
	
	/**
	* Appends the specified matrix with this matrix.
	**/
	Matrix2D.prototype.appendMatrix = function(matrix) {
		this.append(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
		this.appendProperties(matrix.alpha, matrix.shadow,  matrix.compositeOperation);
	}
	
	/**
	 * Generates matrix properties from the specified display object transform properties, and prepends them with this matrix.
	 * For example, you can use this to generate a matrix from a display object: var mtx = new Matrix2D(); mtx.prependTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation);
	 * @param x
	 * @param y
	 * @param scaleX
	 * @param scaleY
	 * @param rotation
	 * @param skewX
	 * @param skewY
	 * @param regX Optional.
	 * @param regY Optional.
	**/
	Matrix2D.prototype.prependTransform = function(x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
		if (rotation%360) {
			var r = rotation*Matrix2D.DEG_TO_RAD;
			var cos = Math.cos(r);
			var sin = Math.sin(r);
		} else {
			cos = 1;
			sin = 0;
		}
		
		if (regX || regY) {
			// append the registration offset:
			this.tx -= regX; this.ty -= regY;
		}
		if (skewX || skewY) {
			// TODO: can this be combined into a single prepend operation?
			skewX *= Matrix2D.DEG_TO_RAD;
			skewY *= Matrix2D.DEG_TO_RAD;
			this.prepend(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, 0, 0);
			this.prepend(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
		} else {
			this.prepend(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, x, y);
		}

	}

	/**
	 * Generates matrix properties from the specified display object transform properties, and appends them with this matrix.
	 * For example, you can use this to generate a matrix from a display object: var mtx = new Matrix2D(); mtx.appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation);
	 * @param x
	 * @param y
	 * @param scaleX
	 * @param scaleY
	 * @param rotation
	 * @param skewX
	 * @param skewY
	 * @param regX Optional.
	 * @param regY Optional.
	**/
	Matrix2D.prototype.appendTransform = function(x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
		if (rotation%360) {
			var r = rotation*Matrix2D.DEG_TO_RAD;
			var cos = Math.cos(r);
			var sin = Math.sin(r);
		} else {
			cos = 1;
			sin = 0;
		}

		if (skewX || skewY) {
			// TODO: can this be combined into a single append?
			skewX *= Matrix2D.DEG_TO_RAD;
			skewY *= Matrix2D.DEG_TO_RAD;
			this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
			this.append(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, 0, 0);
		} else {
			this.append(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, x, y);
		}

		if (regX || regY) {
			// prepend the registration offset:
			this.tx -= regX*this.a+regY*this.c;
			this.ty -= regX*this.b+regY*this.d;
		}
	}

	/**
	 * Applies a rotation transformation to the matrix.
	 * @param angle The angle in degrees.
	 **/
	Matrix2D.prototype.rotate = function(angle) {
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
	 * Applies a skew transformation to the matrix.
	 * @param skewX The amount to skew horizontally in degrees.
	 * @param skewY The amount to skew vertically in degrees.
	 */
	Matrix2D.prototype.skew = function(skewX, skewY) {
		skewX = skewX*Matrix2D.DEG_TO_RAD;
		skewY = skewY*Matrix2D.DEG_TO_RAD;
		this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), 0, 0);
	}
	
	/**
	* Applies a scale transformation to the matrix.
	**/
	Matrix2D.prototype.scale = function(x, y) {
		this.a *= x;
		this.d *= y;
		this.tx *= x;
		this.ty *= y;
	}
	
	/**
	* Translates the matrix on the x and y axes.
	**/
	Matrix2D.prototype.translate = function(x, y) {
		this.tx += x;
		this.ty += y;
	}
	
	/**
	* Sets the properties of the matrix to those of an identity matrix (one that applies a null transformation).
	**/
	Matrix2D.prototype.identity = function() {
		this.alpha = this.a = this.d = 1;
		this.b = this.c = this.tx = this.ty = 0;
		this.shadow = this.compositeOperation = null;
	}
	
	/**
	* Inverts the matrix, causing it to perform the opposite transformation.
	**/
	Matrix2D.prototype.invert = function() {
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
	 * Decomposes the matrix into transform properties (x, y, scaleX, scaleY, and rotation). Note that this these values
	 * may not match the transform properties you used to generate the matrix, though they will produce the same visual
	 * results.
	 * @param target The object to apply the transform properties to. If null, then a new object will be returned.
	 */
	Matrix2D.prototype.decompose = function(target) {
		// TODO: it would be nice to be able to solve for whether the matrix can be decomposed into only scale/rotation even when scale is negative
		if (target == null) { target = {}; }
		target.x = this.tx;
		target.y = this.ty;
		target.scaleX = Math.sqrt(this.a * this.a + this.b * this.b);
		target.scaleY = Math.sqrt(this.c * this.c + this.d * this.d);

		var skewX = Math.atan2(-this.c, this.d);
		var skewY = Math.atan2(this.b, this.a);

		if (skewX == skewY) {
			target.rotation = skewY/Matrix2D.DEG_TO_RAD;
			if (this.a < 0 && this.d >= 0) {
				target.rotation += (target.rotation <= 0) ? 180 : -180;
			}
			target.skewX = target.skewY = 0;
		} else {
			target.skewX = skewX/Matrix2D.DEG_TO_RAD;
			target.skewY = skewY/Matrix2D.DEG_TO_RAD;
		}
		return target;
	}

	/**
	 * Appends the specified visual properties to the current matrix.
	 * @param alpha desired alpha value
	 * @param shadow desired shadow value
	 * @param compositeOperation desired composite operation value
	 */
	Matrix2D.prototype.appendProperties = function(alpha, shadow, compositeOperation) {
		this.alpha *= alpha;
		this.shadow = shadow || this.shadow;
		this.compositeOperation = compositeOperation || this.compositeOperation;
	}

	/**
	 * Prepends the specified visual properties to the current matrix.
	 * @param alpha desired alpha value
	 * @param shadow desired shadow value
	 * @param compositeOperation desired composite operation value
	 */
	Matrix2D.prototype.prependProperties = function(alpha, shadow, compositeOperation) {
		this.alpha *= alpha;
		this.shadow = this.shadow || shadow;
		this.compositeOperation = this.compositeOperation || compositeOperation;
	}
	
	/**
	* Returns a clone of this Matrix.
	**/
	Matrix2D.prototype.clone = function() {
		var mtx = new Matrix2D(this.a, this.b, this.c, this.d, this.tx, this.ty);
		mtx.shadow = this.shadow;
		mtx.alpha = this.alpha;
		mtx.compositeOperation = this.compositeOperation;
		return mtx;
	}

	/**
	* Returns a string representation of this object.
	**/
	Matrix2D.prototype.toString = function() {
		return "[Matrix2D (a="+this.a+" b="+this.b+" c="+this.c+" d="+this.d+" tx="+this.tx+" ty="+this.ty+")]";
	}

	// this has to be populated after the class is defined:
	Matrix2D.identity = new Matrix2D(1, 0, 0, 1, 0, 0);
	
window.Matrix2D = Matrix2D;
}(window));