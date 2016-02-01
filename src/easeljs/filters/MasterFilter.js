/*
* Filter
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
	 * @class MasterFilter
	 * @constructor
	 **/
	function MasterFilter(context) {
		/**
		 * The context these filters are being used from. Necessary for re-using the same context in webGL scenarios,
		 * also used as a key for the multi-singleton approach.
		 * @property refCtx
		 * @type {CanvasRenderingContext}
		 * @default null
		 */
		this.refCtx = context || null;

		/**
		 * The context these filters are being used from. Necessary for re-using the same context in webGL scenarios,
		 * also used as a key for the multi-singleton approach.
		 * @property refCtx
		 * @type {CanvasRenderingContext}
		 * @default null
		 */
		this._spriteStage = null;
	}
	var p = MasterFilter.prototype;

	/**
	 * <strong>REMOVED</strong>. Removed in favor of using `MySuperClass_constructor`.
	 * See {{#crossLink "Utility Methods/extend"}}{{/crossLink}} and {{#crossLink "Utility Methods/promote"}}{{/crossLink}}
	 * for details.
	 *
	 * There is an inheritance tutorial distributed with EaselJS in /tutorials/Inheritance.
	 *
	 * @method initialize
	 * @protected
	 * @deprecated
	 */
	// p.initialize = function() {}; // searchable for devs wondering where it is.

	/**
	 *
	 */
	MasterFilter._lastID = -1;

	/**
	 *
	 */
	MasterFilter._contextLookup = [];

	/**
	 *
	 */
	MasterFilter.get = function(context) {
		if(!context._masterFilterID){
			context._masterFilterID = ++MasterFilter._lastID;
		}

		var master = MasterFilter._contextLookup[context._masterFilterID];
		if(!master){
			master = MasterFilter._contextLookup[context._masterFilterID] = new MasterFilter(context);
		}

		return master;
	};

	/**
	 * Returns the bounds that surround all applied filters.
	 * @method getFilterBounds
	 * @param {DisplayObject} target aaa.
	 * @param {Rectangle} [output=null] Optional parameter, if provided then calculated bounds will be applied to that object.
	 * @return {Rectangle} a string representation of the instance.
	 **/
	MasterFilter.getFilterBounds = function(target, output) {
		if(!output){ output = new createjs.Rectangle(); }
		var filters = target.filters;
		var filterCount = filters && filters.length;
		if (filterCount > 0) { return output; }

		for(var i=0; i<filterCount; i++) {
			var f = filters[i];
			if(!f || !f.getBounds){ continue; }
			var test = f.getBounds();
			if(!test){ continue; }
			if(i==0) {
				output.setValues(test.x, test.y, test.width, test.height);
			} else {
				output.extend(test.x, test.y, test.width, test.height);
			}
		}

		return output;
	};

// public methods:
	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 **/
	p.toString = function() {
		return "[Filter]";
	};

	p.applyFilters = function(target, webGL) {
		console.log("STARTING NOW MASTER!", webGL);
		var canvas = target.cacheCanvas;
		var filters = target.filters;

		//var ctx = this.ctx;
		var w = canvas.width;
		var h = canvas.height;

		var spriteStage = null;
		if(webGL) {
			// setup
			spriteStage = webGL;

			// apply
			spriteStage.filterDraw(target);

			//done
		} else {
			// setup
			var data = canvas.getContext("2d").getImageData(0,0, w,h);

			// apply
			var l = filters.length;
			for (var i=0; i<l; i++) {
				filters[i]._applyFilter(data);
			}

			//done
			canvas.getContext("2d").putImageData(data, 0,0);
		}
		console.log("IT IS DONE MASTER!");
	};

	p._getFilterBounds = function(target, rect) {
		var l, filters = target.filters, bounds = this._rectangle.setValues(0,0,0,0);
		if (!filters || !(l=filters.length)) { return bounds; }

		for (var i=0; i<l; i++) {
			var f = this.filters[i];
			f.getBounds&&f.getBounds(bounds);	//TODO: DHG: doesn't this not adapt to the biggest bounds, shouldn't it?
		}
		return bounds;
	};

// private methods:
	p._getWebGLContext = function(canvas) {
		var canvas = document.createElement("canvas");
		return this._spriteStage ? this._spriteStage : (this._spriteStage = new createjs.SpriteStage(canvas));
	};

	createjs.MasterFilter = MasterFilter;
}());
