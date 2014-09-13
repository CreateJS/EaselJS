/*
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
 * A Container3d is a nestable display list that allows you to work with compound display elements.
 * It extends a {{#crossLink "Container"}}{{/crossLink}} by taking a z-axis on child elements into account
 * and transforming all children on a 2d-plane through a perspectiveProjection Point and a defined field of view
 *
 * <h4>Example</h4>
 *
 *      var container = new createjs.Container3d();
 *      var child = new createjs.Shape();
 *      child.z = 200;
 *      child.graphics.beginFill('#000');
 *      child.graphics.drawCircle(0, 0, 100);
 *      child.graphics.endFill();
 *
 *      container.perspectiveProjection.projectionCenter.x = stage.canvas.width / 2;
 *      container.perspectiveProjection.projectionCenter.y = stage.canvas.height / 2;
 *      container.perspectiveProjection.fieldOfView = 100;
 *      
 *      container.addChild(child);
 *
 * @class Container3d
 * @extends Container
 * @constructor
 **/
var Container3d = function() {
	this.initialize();
};
var p = Container3d.prototype = new createjs.Container();

// public properties:
	/**
	 * Holds a perspectiveProjection Object containing a defined field of view and x- and y-projectionCenters
	 * @property perspectiveProjection
	 * @type Object
	 * @default null
	 **/

	// NOTE: refactor and use createjs.PerspectiveProjection instead?
	p.perspectiveProjection = {
		fieldOfView: 250,
		projectionCenter: {
			x: 0,
			y: 0
		}
	};

// constructor:

	/**
	 * @property Container_initialize
	 * @type Function
	 * @private
	 **/
	p.Container_initialize = p.initialize;

	/**
	 * Initialization method.
	 * @method initialize
	 * @protected
	*/
	p.initialize = function() {
		this.Container_initialize();
		this.children = [];
	};

// public methods:

	/**
	 * @property Container_draw
	 * @type Function
	 * @private
	 **/
	p.Container_draw = p.draw;

	/**
	 * Draws the display object into the specified context ignoring its visible, alpha, shadow, and transform.
	 * Returns true if the draw was handled (useful for overriding functionality).
	 *
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method draw
	 * @param {CanvasRenderingContext2D} ctx The canvas 2D context object to draw into.
	 * @param {Boolean} [ignoreCache=false] Indicates whether the draw operation should ignore any current cache.
	 * For example, used for drawing the cache (to prevent it from simply drawing an existing cache back
	 * into itself).
	 **/

	 // TODO: add rotationX, rotationY, rotationZ, check skew etc.
	p.draw = function(ctx, ignoreCache) {
		var kids = this.children;
		for (var i=0,l=kids.length;i<l;i++) {
			var child = kids[i];

			if (child) {
				// Store values that user changed at runtime
				if (child.x != child._calculatedX) child._storeX = child.x;
				if (child.y != child._calculatedY) child._storeY = child.y;
				if (child.z != child._calculatedZ) child._storeZ = child.z;
				if (child.scaleX != child._calculatedScaleX) child._storeScaleX = child.scaleX;
				if (child.scaleY != child._calculatedScaleY) child._storeScaleY = child.scaleY;

				// calculate scaling
				var scale = this.perspectiveProjection.fieldOfView / (this.perspectiveProjection.fieldOfView + child._storeZ);

				// store newly calculated values
				child._calculatedZ = scale;
				child._calculatedX = (child._storeX + this.perspectiveProjection.projectionCenter.x) * scale;
				child._calculatedY = (child._storeY + this.perspectiveProjection.projectionCenter.y) * scale;
				
				child._calculatedScaleX = child._storeScaleX * scale;
				child._calculatedScaleY = child._storeScaleY * scale;

				child.scaleX = child._calculatedScaleX;
				child.scaleY = child._calculatedScaleY;
				child.x = child._calculatedX;
				child.y = child._calculatedY;
			}
		}

		if (this.Container_draw(ctx, ignoreCache)) { return true; }
	};

createjs.Container3d = Container3d;
}());