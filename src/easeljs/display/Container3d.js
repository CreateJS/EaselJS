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
 *      container.perspectiveProjection.focalLength = 100;
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
	// TODO: use fieldOfView instead (angle between 0 and 180, calculate focalLength dynamically by using stage width and height)
	p.perspectiveProjection = {
		focalLength: 635,
		fieldOfView: 120,
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
	 * Sets the specified focal length.
	 * Calculates Field of view if projectionPlane sizes are passed
	 *
	 * @method setFocalLength
	 **/
	p.setFocalLength = function(value, projectionPlaneWidth, projectionPlaneHeight) {
		this.perspectiveProjection.focalLength = value;

		if (!(projectionPlaneWidth && projectionPlaneHeight)) return;

		var diagonal = Math.sqrt( Math.pow(projectionPlaneWidth, 2) + Math.pow(projectionPlaneHeight, 2) );
		this.perspectiveProjection.fieldOfView = 2 * Math.atan(diagonal / (2 * this.perspectiveProjection.focalLength)) * 180 / Math.PI;
	};

	/**
	 * Sets the specified field of view.
	 * Calculates focal length if projectionPlane sizes are passed
	 *
	 * @method setFieldOfView
	 **/
	p.setFieldOfView = function(value, projectionPlaneWidth, projectionPlaneHeight) {
		if (value <= 0 || value >= 180) throw new Error('field of view hast to be a value 0 and 180');

		this.perspectiveProjection.fieldOfView = value;

		if (!(projectionPlaneWidth && projectionPlaneHeight)) return;

		var diagonal = Math.sqrt( Math.pow(projectionPlaneWidth, 2) + Math.pow(projectionPlaneHeight, 2) );
		this.perspectiveProjection.focalLength = diagonal / (2 * Math.tan(Math.PI * this.perspectiveProjection.fieldOfView / 360));
	};

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
	p.draw = function(ctx, ignoreCache) {
		var kids = this.children;
		for (var i=0,l=kids.length;i<l;i++) {
			var child = kids[i];

			if (child) {
				// Store values that user changed at runtime
				if (child.x != child._calculatedX) { child._storeX = child.x; changed = true; }
				if (child.y != child._calculatedY) { child._storeY = child.y; changed = true; }
				if (child.z != child._calculatedZ) { child._storeZ = child.z; changed = true; }
				if (child.scaleX != child._calculatedScaleX) { child._storeScaleX = child.scaleX; changed = true; }
				if (child.scaleY != child._calculatedScaleY) { child._storeScaleY = child.scaleY; changed = true; }

				if (changed) {
					// calculate scaling
					var scale = this.perspectiveProjection.focalLength / (this.perspectiveProjection.focalLength + child._storeZ);

					// store newly calculated values
					child._calculatedZ = scale;
					child._calculatedX = this.perspectiveProjection.projectionCenter.x - (this.perspectiveProjection.projectionCenter.x - child._storeX) * scale;
					child._calculatedY = this.perspectiveProjection.projectionCenter.y - (this.perspectiveProjection.projectionCenter.y - child._storeY) * scale;
					
					child._calculatedScaleX = child._storeScaleX * scale;
					child._calculatedScaleY = child._storeScaleY * scale;

					child.scaleX = child._calculatedScaleX;
					child.scaleY = child._calculatedScaleY;
					child.x = child._calculatedX;
					child.y = child._calculatedY;
				}
			}
		}

		if (this.Container_draw(ctx, ignoreCache)) { return true; }
	};

createjs.Container3d = Container3d;
}());