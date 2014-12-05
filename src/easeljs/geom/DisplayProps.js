/*
* DisplayProps
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
	 * Used for calculating and encapsulating display related properties.
	 * @class DisplayProps
	 * @param {Number} [visible=true] Visible value.
	 * @param {Number} [alpha=0] Alpha value.
	 * @param {Number} [shadow=null] A Shadow instance or null.
	 * @param {Number} [compositeOperation=null] A compositeOperation value or null.
	 * @param {Number} [matrix] A transformation matrix. Defaults to a new identity matrix.
	 * @constructor
	 **/
	function DisplayProps(visible, alpha, shadow, compositeOperation, matrix) {
		this.setValues(visible, alpha, shadow, compositeOperation, matrix);
		
	// public properties:
		// assigned in the setValues method.
		/**
		 * Property representing the alpha that will be applied to a display object.
		 * @property alpha
		 * @type Number
		 **/
	
		/**
		 * Property representing the shadow that will be applied to a display object.
		 * @property shadow
		 * @type Shadow
		 **/
	
		/**
		 * Property representing the compositeOperation that will be applied to a display object.
		 * You can find a list of valid composite operations at:
		 * <a href="https://developer.mozilla.org/en/Canvas_tutorial/Compositing">https://developer.mozilla.org/en/Canvas_tutorial/Compositing</a>
		 * @property compositeOperation
		 * @type String
		 **/
		
		/**
		 * Property representing the value for visible that will be applied to a display object.
		 * @property visible
		 * @type Boolean
		 **/
		
		/**
		 * The transformation matrix that will be applied to a display object.
		 * @property matrix
		 * @type Matrix2D
		 **/
	}
	var p = DisplayProps.prototype;

// initialization:
	/**
	 * Reinitializes the instance with the specified values.
	 * @method setValues
	 * @param {Number} [visible=true] Visible value.
	 * @param {Number} [alpha=1] Alpha value.
	 * @param {Number} [shadow=null] A Shadow instance or null.
	 * @param {Number} [compositeOperation=null] A compositeOperation value or null.
	 * @param {Number} [matrix] A transformation matrix. Defaults to an identity matrix.
	 * @return {DisplayProps} This instance. Useful for chaining method calls.
	 * @chainable
	*/
	p.setValues = function (visible, alpha, shadow, compositeOperation, matrix) {
		this.visible = visible == null ? true : !!visible;
		this.alpha = alpha == null ? 1 : alpha;
		this.shadow = shadow;
		this.compositeOperation = shadow;
		this.matrix = matrix || (this.matrix&&this.matrix.identity()) || new createjs.Matrix2D();
		return this;
	};

// public methods:
	/**
	 * Appends the specified display properties. This is generally used to apply a child's properties its parent's.
	 * @method append
	 * @param {Boolean} visible desired visible value
	 * @param {Number} alpha desired alpha value
	 * @param {Shadow} shadow desired shadow value
	 * @param {String} compositeOperation desired composite operation value
	 * @param {Matrix2D} [matrix] a Matrix2D instance
	 * @return {DisplayProps} This instance. Useful for chaining method calls.
	 * @chainable
	*/
	p.append = function(visible, alpha, shadow, compositeOperation, matrix) {
		this.alpha *= alpha;
		this.shadow = shadow || this.shadow;
		this.compositeOperation = compositeOperation || this.compositeOperation;
		this.visible = this.visible && visible;
		matrix&&this.matrix.appendMatrix(matrix);
		return this;
	};
	
	/**
	 * Prepends the specified display properties. This is generally used to apply a parent's properties to a child's.
	 * For example, to get the combined display properties that would be applied to a child, you could use:
	 * 
	 * 	var o = myDisplayObject;
	 * 	var props = new createjs.DisplayProps();
	 * 	do {
	 * 		// prepend each parent's props in turn:
	 * 		props.prepend(o.visible, o.alpha, o.shadow, o.compositeOperation, o.getMatrix());
	 * 	} while (o = o.parent);
	 * 	
	 * @method prepend
	 * @param {Boolean} visible desired visible value
	 * @param {Number} alpha desired alpha value
	 * @param {Shadow} shadow desired shadow value
	 * @param {String} compositeOperation desired composite operation value
	 * @param {Matrix2D} [matrix] a Matrix2D instance
	 * @return {DisplayProps} This instance. Useful for chaining method calls.
	 * @chainable
	*/
	p.prepend = function(visible, alpha, shadow, compositeOperation, matrix) {
		this.alpha *= alpha;
		this.shadow = this.shadow || shadow;
		this.compositeOperation = this.compositeOperation || compositeOperation;
		this.visible = this.visible && visible;
		matrix&&this.matrix.prependMatrix(matrix);
		return this;
	};
	
	/**
	 * Resets this instance and its matrix to default values.
	 * @method identity
	 * @return {DisplayProps} This instance. Useful for chaining method calls.
	 * @chainable
	*/
	p.identity = function() {
		this.visible = true;
		this.alpha = 1;
		this.shadow = this.compositeOperation = null;
		this.matrix.identity();
		return this;
	};
	
	/**
	 * Returns a clone of the DisplayProps instance. Clones the associated matrix.
	 * @method clone
	 * @return {DisplayProps} a clone of the DisplayProps instance.
	 **/
	p.clone = function() {
		return new DisplayProps(this.alpha, this.shadow, this.compositeOperation, this.visible, this.matrix.clone());
	};

// private methods:

	createjs.DisplayProps = DisplayProps;
})();
