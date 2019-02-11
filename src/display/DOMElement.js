/**
 * DOMElement
 * Visit http://createjs.com/ for documentation, updates and examples.
 *
 * Copyright (c) 2019 gskinner.com, inc.
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
 *
 * @license
 */

import DisplayObject from "./DisplayObject";
import DisplayProps from "../geom/DisplayProps";

/**
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
 * <strong>Important:</strong> This class needs to be notified it is about to be drawn, this will happen automatically
 * if you call stage.update, calling stage.draw or disabling tickEnabled will miss important steps and it will render
 * stale information.
 *
 * @memberof easeljs
 * @extends easeljs.DisplayObject
 */
export default class DOMElement extends DisplayObject {

	/**
	 * @param {HTMLElement|String} htmlElement A reference or id for the DOM element to manage.
	 */
	constructor(htmlElement) {
		super();

		if (typeof htmlElement === "string") { htmlElement = document.getElementById(htmlElement); }
		this.mouseEnabled = false;

		let style = htmlElement.style;
		style.position = "absolute";
		style.transformOrigin = style.WebkitTransformOrigin = style.msTransformOrigin = style.MozTransformOrigin = style.OTransformOrigin = "0% 0%";

		/**
		 * The DOM object to manage.
		 * @type {HTMLElement}
		 */
		this.htmlElement = htmlElement;

		/**
		 * @type {easeljs.Matrix2D}
		 * @default null
		 * @protected
		 */
		this._oldProps = null;

		/**
		 * Used to track the object which this class attached listeners to, helps optimize listener attachment.
		 * @type {easeljs.Stage}
		 * @default null
		 * @protected
		 */
		this._oldStage = null;
		/**
		 * The event listener proxy triggered drawing draw for special circumstances.
		 * @type {Function}
		 * @default null
		 * @protected
		 */
		this._drawAction = null;
	}

	isVisible() {
		return this.htmlElement != null;
	}

	draw(ctx, ignoreCache) {
		// this relies on the _tick method because draw isn't called if the parent is not visible.
		// the actual update happens in _handleDrawEnd
		return true;
	}

	/** Disabled in DOMElement. */
	cache() {}

	/** Disabled in DOMElement. */
	uncache() {}

	/** Disabled in DOMElement. */
	updateCache() {}

	/** Disabled in DOMElement. */
	hitTest() {}

	/** Disabled in DOMElement. */
	localToGlobal() {}

	/** Disabled in DOMElement. */
	globalToLocal() {}

	/** Disabled in DOMElement. */
	localToLocal() {}

	/**
	 * DOMElement cannot be cloned.
	 * @throws DOMElement cannot be cloned
	 */
	clone() {
		throw "DOMElement cannot be cloned.";
	}

	_tick(evtObj) {
		const stage = this.stage;
		if (stage != null && stage !== this._oldStage) {
			this._drawAction && stage.off("drawend", this._drawAction);
			this._drawAction = stage.on("drawend", this._handleDrawEnd, this);
			this._oldStage = stage;
		}
		super._tick(evtObj);
	}

	/**
	 * @param {core.Event} evt
	 * @protected
	 */
	_handleDrawEnd(evt) {
		const o = this.htmlElement;
		if (!o) { return; }
		const style = o.style;

		const props = this.getConcatenatedDisplayProps(this._props), mtx = props.matrix;

		const visibility = props.visible ? "visible" : "hidden";
		if (visibility !== style.visibility) { style.visibility = visibility; }
		if (!props.visible) { return; }

		let oldProps = this._oldProps;
		const oldMtx = oldProps && oldProps.matrix;
		let n = 10000; // precision

		if (!oldMtx || !oldMtx.equals(mtx)) {
			const str = `matrix(${(mtx.a*n|0)/n},${(mtx.b*n|0)/n},${(mtx.c*n|0)/n},${(mtx.d*n|0)/n},${mtx.tx+0.5|0}`;
			style.transform = style.WebkitTransform = style.OTransform = style.msTransform = `${str},${mtx.ty+0.5|0})`;
			style.MozTransform = `${str}px,${mtx.ty+0.5|0}px)`;
			if (!oldProps) { oldProps = this._oldProps = new DisplayProps(true, null); }
			oldProps.matrix.copy(mtx);
		}

		if (oldProps.alpha != props.alpha) {
			style.opacity = ""+(props.alpha*n|0)/n;
			oldProps.alpha = props.alpha;
		}
	}

}

/**
 * Interaction events should be added to `htmlElement`, and not the DOMElement instance, since DOMElement instances
 * are not full EaselJS display objects and do not participate in EaselJS mouse events.
 * @event easeljs.DOMElement#click
 */

/**
 * Interaction events should be added to `htmlElement`, and not the DOMElement instance, since DOMElement instances
 * are not full EaselJS display objects and do not participate in EaselJS mouse events.
 * @event easeljs.DOMElement#dblClick
 */

/**
 * Interaction events should be added to `htmlElement`, and not the DOMElement instance, since DOMElement instances
 * are not full EaselJS display objects and do not participate in EaselJS mouse events.
 * @event easeljs.DOMElement#mousedown
 */

/**
 * Interaction events should be added to `htmlElement`, and not the DOMElement instance, since DOMElement instances
 * are not full EaselJS display objects and do not participate in EaselJS mouse events.
 * @event easeljs.DOMElement#mouseover
 */

/**
 * Disabled in DOMElement.
 * @event easeljs.DOMElement#tick
 */
