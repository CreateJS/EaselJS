/*
* DOMElement by Grant Skinner. Jul 8, 2011
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
// TODO: fix problems with rotation.
// TODO: exclude from getObjectsUnderPoint

/**
 * <b>This class is still experimental, and more advanced use is likely to be buggy. Please report bugs.</b><br/><br/>
* A DOMElement allows you to associate a HTMLElement with the display list. It will be transformed
* within the DOM as though it is child of the Container it is added to. However, it is not rendered
* to canvas, and as such will retain whatever z-index it has relative to the canvas (ie. it will be
* drawn in front of or behind the canvas).<br/><br/>
* The position of a DOMElement is relative to their parent node in the DOM. It is recommended that
* the DOM Object be added to a div that also contains the canvas so that they share the same position
* on the page.<br/><br/>
* DOMElement is useful for positioning HTML elements over top of canvas content, and for elements
* that you want to display outside the bounds of the canvas. For example, a tooltip with rich HTML
* content.<br/><br/>
* DOMElement instances are not full EaselJS display objects, and do not participate in EaselJS mouse
* events or support methods like hitTest.
* @class DOMElement
* @extends DisplayObject
* @constructor
* @param {HTMLElement} htmlElement A reference or id for the DOM element to manage.
**/
var DOMElement = function(htmlElement) {
  this.initialize(htmlElement);
}
var p = DOMElement.prototype = new DisplayObject();

// public properties:
	/**
	 * The DOM object to manage.
	 * @property htmlElement
	 * @type HTMLElement
	 **/
	p.htmlElement = null;

// private properties:
	/**
	 * @property _style
	 * @protected
	 **/
	p._style = null;

// constructor:
	/**
	 * @property DisplayObject_initialize
	 * @type Function
   * @private
	 **/
	p.DisplayObject_initialize = p.initialize;

	/**
	 * Initialization method.
	 * @method initialize
	 * @protected
	*/
	p.initialize = function(htmlElement) {
		if (typeof(htmlElement)=="string") { htmlElement = document.getElementById(htmlElement); }
		this.DisplayObject_initialize();
		this.mouseEnabled = false;
		this.htmlElement = htmlElement;
		if (htmlElement) {
			this._style = htmlElement.style;
			this._style.position = "absolute";
			this._style.transformOrigin = this._style.webkitTransformOrigin = this._style.MozTransformOrigin = "0% 0%";
		}
	}

// public methods:
	// TODO: fix this. Right now it's used internally to determine if it should be drawn, but DOMElement always needs to be drawn.
	/**
	 * Returns true or false indicating whether the display object would be visible if drawn to a canvas.
	 * This does not account for whether it would be visible within the boundaries of the stage.
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method isVisible
	 * @return {Boolean} Boolean indicating whether the display object would be visible if drawn to a canvas
	 **/
	p.isVisible = function() {
		return this.htmlElement != null;
	}

	/**
	 * Draws the display object into the specified context ignoring it's visible, alpha, shadow, and transform.
	 * Returns true if the draw was handled (useful for overriding functionality).
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method draw
	 * @param {CanvasRenderingContext2D} ctx The canvas 2D context object to draw into.
	 * @param {Boolean} ignoreCache Indicates whether the draw operation should ignore any current cache.
	 * For example, used for drawing the cache (to prevent it from simply drawing an existing cache back
	 * into itself).
	 **/
	p.draw = function(ctx, ignoreCache) {
		// TODO: possibly save out previous matrix values, to compare against new ones (so layout doesn't need to fire if no change)
		if (this.htmlElement == null) { return; }
		var mtx = this._matrix;
		var o = this.htmlElement;
		o.style.opacity = ""+mtx.alpha;
		// this relies on the _tick method because draw isn't called if a parent is not visible.
		o.style.visibility = this.visible ? "visible" : "hidden";
		o.style.transform = o.style.webkitTransform = o.style.oTransform = ["matrix("+mtx.a,mtx.b,mtx.c,mtx.d,mtx.tx,mtx.ty+")"].join(",");
		o.style.MozTransform = ["matrix("+mtx.a,mtx.b,mtx.c,mtx.d,mtx.tx+"px",mtx.ty+"px)"].join(",");
		return true;
	}

	/**
	 * Not applicable to DOMElement.
	 * @method cache
	 */
	p.cache = function() {}

	/**
	 * Not applicable to DOMElement.
	 * @method uncache
	 */
	p.uncache = function() {}

	/**
	 * Not applicable to DOMElement.
	 * @method updateCache
	 */
	p.updateCache = function() {}

	/**
	 * Not applicable to DOMElement.
	 * @method updateCache
	 */
	p.hitTest = function() {}

	/**
	 * Not applicable to DOMElement.
	 * @method localToGlobal
	 */
	p.localToGlobal = function() {}

	/**
	 * Not applicable to DOMElement.
	 * @method globalToLocal
	 */
	p.globalToLocal = function() {}

	/**
	 * Not applicable to DOMElement.
	 * @method localToLocal
	 */
	p.localToLocal = function() {}

	/**
	 * This presently clones the DOMElement instance, but not the associated HTMLElement.
	 * @method clone
	 * @return {DOMElement} a clone of the DOMElement instance.
	 **/
	p.clone = function() {
		var o = new DOMElement();
		this.cloneProps(o);
		return o;
	}

	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 **/
	p.toString = function() {
		return "[DOMElement (name="+  this.name +")]";
	}

// private methods:
	p._tick = function() {
		if (this.htmlElement == null) { return; }
		this.htmlElement.style.visibility = "hidden";
	}

	/* Not needed with current setup:
	p._calculateVisible = function() {
		var p = this;
		while (p) {
			if (!p.visible) { return false; }
			p = p.parent;
		}
		return true;
	}
	*/
window.DOMElement = DOMElement;
}(window));