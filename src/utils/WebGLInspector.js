/**
 * @license WebGLInspector
 * Visit http://createjs.com/ for documentation, updates and examples.
 *
 * Copyright (c) 2017 gskinner.com, inc.
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

import { EventDispatcher } from "@createjs/core";

 /**
  * A utility and helper class designed to work with {{#crossLink "StageGL"}}{{/crossLink}} to help investigate and
  * test performance or display problems. It contains logging functions to analyze behaviour and performance testing
  * utilities.
  *
  * @memberof easeljs
  * @extends core.EventDispatcher
  *
  * @param {StageGL} stage The default stage to use when none is supplied.
  */
export default class WebGLInspector extends EventDispatcher {

	constructor (stage) {
		super();

		/**
		 * The internal reference to the default stage this Inspector is for.
		 * @protected
		 * @type {easeljs.StageGL}
		 */
		this._stage = stage;
	}

	/**
	 * Utility function for use with {@link easeljs.WebGLInspector#logDepth}. Logs an item's position and registration.
	 * Useful to see if something is being forced off screen or has an integer position.
	 * @param {easeljs.DisplayObject} item The item we're currently logging about.
	 * @param {String} [prepend] The string to show before the item, usually formatting for a tree view.
	 * @static
	 */
	static dispProps (item, prepend = "") {
		let p = `\tP: ${item.x.toFixed(2)}x${item.y.toFixed(2)}\t`;
		let r = `\tR: ${item.regX.toFixed(2)}x${item.regY.toFixed(2)}\t`;
		WebGLInspector._log(prepend, `${item.toString()}\t`, p, r);
	}

	/**
	 * Log with alternateOutput if available, defaulting to the console.
	 * @param {...*} info The info to log.
	 * @static
	 */
	static _log (...info) {
		if (WebGLInspector.alternateOutput) {
			WebGLInspector.alternateOutput.log(...info);
		} else {
			console.log(...info);
		}
	}

	/**
	 * Perform all of the logging reports at once.
	 * @param {easeljs.StageGL} [stage] The stage to log information for.
	 */
	log (stage) {
		if (!stage) { stage = this._stage; }
		WebGLInspector._log(`Batches Per Draw: ${(stage._batchID/stage._drawID).toFixed(4)}`);
		this.logContextInfo(stage._webGLContext);
		this.logDepth(stage.children, "");
		this.logTextureFill(stage);
	}

	/**
	 * Replace the stage's Draw command with an empty draw command. This is useful for testing performance, and ignoring rendering.
	 * @param {StageGL} [stage=] The stage to log information for.
	 * @param {Boolean} [enabled] Force enabled. If left undefined, it will toggle.
	 */
	toggleGPUDraw (stage, enabled) {
		if (!stage) { stage = this._stage; }

		if (enabled === undefined) {
			enabled = !!stage._drawBuffers_;
		}

		if (enabled && stage._drawBuffers_) {
			stage._drawBuffers = stage._drawBuffers_;
			stage._drawBuffers_ = undefined;
		} else {
			stage._drawBuffers_ = stage._drawBuffers;
			stage._drawBuffers = function _inspectorDrawBuffers (gl) {
				if (this.vocalDebug) {
					WebGLInspector._log(`BlankDraw[${this._drawID}:${this._batchID}] : ${this.batchReason}`);
				}
			};
		}
	}

	/**
	 * Recursively walk the entire display tree, log the attached items, and display it in a tree view.
	 * @param {Array} [children] The children array to walk through.
	 * @param {String} [prepend] What to prepend to this output from this point onwards.
	 * @param {Function} [logFunc] Custom logging function, mainly for filtering or formatting output.
	 */
	logDepth (children, prepend = "", logFunc = WebGLInspector._log) {
		if (!children) { children = this._stage.children; }
		const l = children.length;
		for (let i=0; i<l; i++) {
			let child = children[i];
			logFunc(`${prepend}-`, child);
			if (child.children && child.children.length) {
				this.logDepth(child.children, `|${prepend}`, logFunc);
			}
		}
	}

	/**
	 * Examine the context and provide information about its capabilities.
	 * @param {WebGLRenderingContext} [gl] The WebGL context to inspect.
	 */
	logContextInfo (gl) {
		if (!gl) { gl = this._stage._webGLContext; }
		let data = `
			== LOG:\n
			Max textures per draw: ${gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS)}\n
			Max textures active: ${gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS)}\n
			\n
			Max texture size: ${gl.getParameter(gl.MAX_TEXTURE_SIZE)/2}\n
			Max cache size: ${gl.getParameter(gl.MAX_RENDERBUFFER_SIZE)/2}\n
			\n
			Max attributes per vertex: ${gl.getParameter(gl.MAX_VERTEX_ATTRIBS)}\n
			WebGL Version string: ${gl.getParameter(gl.VERSION)}\n
			======
		`;
		WebGLInspector._log(data);
	}

	/**
	 * Simulate renders and watch what happens for textures moving around between draw calls. A texture moving between
	 * slots means it was removed and then re-added to draw calls. Performance may be better if it was allowed to stay
	 * in place.
	 * @param {StageGL} [stage] The stage to log information for.
	 */
	logTextureFill (stage) {
		if (!stage) { stage = this._stage; }

		let dict = stage._textureDictionary;
		let count = stage._batchTextureCount;
		WebGLInspector._log(`${textureMax}: ${count}`);
		let output = [];
		for (let n in dict) {
			let str = n.replace(window.location.origin, "");
			let tex = dict[n];
			let shifted = tex._lastActiveIndex?tex._lastActiveIndex === tex._activeIndex:false;
			output.push({src, element:tex, shifted});
			tex._lastActiveIndex = tex._activeIndex;
		}

		output.sort((a,b) => {
			if (a.element._drawID === stage._drawID) { return 1; }
			if (a.element._drawID < b.element._drawID) { return -1; }
			return 0;
		});

		const l = output.length;
		for (let i=0; i<l; i++) {
			let out = output[i];
			let active = out.element._drawID === stage._drawID;
			WebGLInspector._log(`[${out.src}] ${active?"ACTIVE":"stale"} ${out.shifted?"steady":"DRIFT"}`, out.element);
		}
	}

}

/**
 * Alternate output for debugging situations where "console" is not available, i.e. Mobile or remote debugging.
 * Expects object with a "log" function that takes any number of params.
 * @type {Console}
 * @default null
 * @static
 * @protected
 */
WebGLInspector.alternateOutput = null;
