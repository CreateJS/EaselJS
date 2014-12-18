/*
* DOMElement
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
	 * <b>This class is still experimental, and more advanced use is likely to be buggy. Please report bugs.</b>
	 *
	 * A DOMElement allows you to associate a HTMLElement with the display list. It will be transformed
	 * within the DOM as though it is child of the {{#crossLink "Container"}}{{/crossLink}} it is added to. However, it is
	 * not rendered to canvas, and as such will retain whatever z-index it has relative to the canvas (ie. it will be
	 * drawn in front of or behind the canvas).
	 *
	 * The position of a DOMElement is relative to their parent node in the DOM. It is recommended that
	 * the DOM Object be added to a div that also contains the canvas so that they share the same position
	 * on the page.
	 *
	 * DOMElement is useful for positioning HTML elements over top of canvas content, and for elements
	 * that you want to display outside the bounds of the canvas. For example, a tooltip with rich HTML
	 * content.
	 *
	 * <h4>Mouse Interaction</h4>
	 *
	 * DOMElement instances are not full EaselJS display objects, and do not participate in EaselJS mouse
	 * events or support methods like hitTest. To get mouse events from a DOMElement, you must instead add handlers to
	 * the htmlElement (note, this does not support EventDispatcher)
	 *
	 *      var domElement = new createjs.DOMElement(htmlElement);
	 *      domElement.htmlElement.onclick = function() {
	 *          console.log("clicked");
	 *      }
	 *
	 * @class DOMElement
	 * @extends DisplayObject
	 * @constructor
	 * @param {HTMLElement} htmlElement A reference or id for the DOM element to manage.
	 */
	function DOMElement(htmlElement) {
		this.DisplayObject_constructor();
		
		if (typeof(htmlElement)=="string") { htmlElement = document.getElementById(htmlElement); }
		this.mouseEnabled = false;
		
		var style = htmlElement.style;
		style.position = "absolute";
		style.transformOrigin = style.WebkitTransformOrigin = style.msTransformOrigin = style.MozTransformOrigin = style.OTransformOrigin = "0% 0%";
		
		
	// public properties:
		/**
		 * The DOM object to manage.
		 * @property htmlElement
		 * @type HTMLElement
		 */
		this.htmlElement = htmlElement;
	
	
	// private properties:
		/**
		 * @property _oldMtx
		 * @type Matrix2D
		 * @protected
		 */
		this._oldProps = null;
	}
	var p = createjs.extend(DOMElement, createjs.DisplayObject);

	// TODO: deprecated
	// p.initialize = function() {}; // searchable for devs wondering where it is. REMOVED. See docs for details.


// public methods:
	/**
	 * Returns true or false indicating whether the display object would be visible if drawn to a canvas.
	 * This does not account for whether it would be visible within the boundaries of the stage.
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method isVisible
	 * @return {Boolean} Boolean indicating whether the display object would be visible if drawn to a canvas
	 */
	p.isVisible = function() {
		return this.htmlElement != null;
	};

	/**
	 * Draws the display object into the specified context ignoring its visible, alpha, shadow, and transform.
	 * Returns true if the draw was handled (useful for overriding functionality).
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method draw
	 * @param {CanvasRenderingContext2D} ctx The canvas 2D context object to draw into.
	 * @param {Boolean} ignoreCache Indicates whether the draw operation should ignore any current cache.
	 * For example, used for drawing the cache (to prevent it from simply drawing an existing cache back
	 * into itself).
	 * @return {Boolean}
	 */
	p.draw = function(ctx, ignoreCache) {
		// this relies on the _tick method because draw isn't called if the parent is not visible.
		// the actual update happens in _handleDrawEnd
		return true;
	};

	/**
	 * Not applicable to DOMElement.
	 * @method cache
	 */
	p.cache = function() {};

	/**
	 * Not applicable to DOMElement.
	 * @method uncache
	 */
	p.uncache = function() {};

	/**
	 * Not applicable to DOMElement.
	 * @method updateCache
	 */
	p.updateCache = function() {};

	/**
	 * Not applicable to DOMElement.
	 * @method hitTest
	 */
	p.hitTest = function() {};

	/**
	 * Not applicable to DOMElement.
	 * @method localToGlobal
	 */
	p.localToGlobal = function() {};

	/**
	 * Not applicable to DOMElement.
	 * @method globalToLocal
	 */
	p.globalToLocal = function() {};

	/**
	 * Not applicable to DOMElement.
	 * @method localToLocal
	 */
	p.localToLocal = function() {};

	/**
	 * DOMElement cannot be cloned. Throws an error.
	 * @method clone
	 */
	p.clone = function() {
		throw("DOMElement cannot be cloned.")
	};

	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 */
	p.toString = function() {
		return "[DOMElement (name="+  this.name +")]";
	};

	/**
     * Interaction events should be added to `htmlElement`, and not the DOMElement instance, since DOMElement instances
	 * are not full EaselJS display objects and do not participate in EaselJS mouse events.
	 * @event click
	 */

     /**
     * Interaction events should be added to `htmlElement`, and not the DOMElement instance, since DOMElement instances
 	 * are not full EaselJS display objects and do not participate in EaselJS mouse events.
	 * @event dblClick
	 */

     /**
      * Interaction events should be added to `htmlElement`, and not the DOMElement instance, since DOMElement instances
 	  * are not full EaselJS display objects and do not participate in EaselJS mouse events.
	  * @event mousedown
	  */

     /**
      * The HTMLElement can listen for the mouseover event, not the DOMElement instance.
      * Since DOMElement instances are not full EaselJS display objects and do not participate in EaselJS mouse events.
      * @event mouseover
	  */

     /**
      * Not applicable to DOMElement.
	  * @event tick
	  */


// private methods:
	/**
	 * @method _tick
	 * @param {Object} evtObj An event object that will be dispatched to all tick listeners. This object is reused between dispatchers to reduce construction & GC costs.
	 * function.
	 * @protected
	 */
	p._tick = function(evtObj) {
		var stage = this.getStage();
		stage&&stage.on("drawend", this._handleDrawEnd, this, true);
		this.DisplayObject__tick(evtObj);
	};
	
	/**
	 * @method _handleDrawEnd
	 * @param {Event} evt
	 * @protected
	 */
	p._handleDrawEnd = function(evt) {
		var o = this.htmlElement;
		if (!o) { return; }
		var style = o.style;
		
		var props = this.getConcatenatedDisplayProps(this._props), mtx = props.matrix;
		
		var visibility = props.visible ? "visible" : "hidden";
		if (visibility != style.visibility) { style.visibility = visibility; }
		if (!props.visible) { return; }
		
		var oldProps = this._oldProps, oldMtx = oldProps&&oldProps.matrix;
		var n = 10000; // precision
		
		if (!oldMtx || !oldMtx.equals(mtx)) {
			var str = "matrix(" + (mtx.a*n|0)/n +","+ (mtx.b*n|0)/n +","+ (mtx.c*n|0)/n +","+ (mtx.d*n|0)/n +","+ (mtx.tx+0.5|0);
			style.transform = style.WebkitTransform = style.OTransform = style.msTransform = str +","+ (mtx.ty+0.5|0) +")";
			style.MozTransform = str +"px,"+ (mtx.ty+0.5|0) +"px)";
			if (!oldProps) { oldProps = this._oldProps = new createjs.DisplayProps(true, NaN); }
			oldProps.matrix.copy(mtx);
		}
		
		if (oldProps.alpha != props.alpha) {
			style.opacity = ""+(props.alpha*n|0)/n;
			oldProps.alpha = props.alpha;
		}
	};


	createjs.DOMElement = createjs.promote(DOMElement, "DisplayObject");
}());
