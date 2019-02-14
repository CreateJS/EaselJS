/**
 * WebGLInspector
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

import { EventDispatcher } from "@createjs/core";
import StageGL from "../display/StageGL";

/**
 * A utility and helper class designed to work with {@link easeljs.StageGL} to help investigate and test performance
 * or display problems. It contains logging functions to analyze behaviour and performance testing utilities.
 * @memberof easeljs
 * @extends core.EventDispatcher
 */
export default class WebGLInspector {

	/**
	 * Utility to call the right logging
	 * @params {...*} args
	 */
	static log(...args) {
		(WebGLInspector.alternateOutput ? WebGLInspector.alternateOutput.log : console.log).apply(this, args);
	}

	/**
	 * Perform all of the logging reports at once.
	 * @param {easeljs.StageGL} [stage] The stage to log information for.
	 */
	static logAll(stage = WebGLInspector.stage) {
		WebGLInspector.log("Average batches Per Draw", (stage._batchID / stage._drawID).toFixed(4));
		WebGLInspector.logContextInfo(stage._webGLContext);
		WebGLInspector.logDepth(stage.children, "");
		WebGLInspector.logTextureFill(stage);
	}

	/**
	 * Replace the stage's Draw command with a new draw command. This is useful for:
	 * <ul>
	 *   <li> Testing performance, with no render cost. See `WebGLInspector.drawEmpty` </li>
	 *   <li> Troubleshooting and tracking loaded textures. See `WebGLInspector.drawTexOnBuffer` </li>
	 *   <li> Misc feature or troubleshooting injection </li>
	 * </ul>
	 * @param {easeljs.StageGL} [stage] The stage to log information for.
	 * @param {Function} newFunc
	 */
	static replaceRenderBatchCall(stage = WebGLInspector.stage, newFunc) {
		if (newFunc === undefined && stage._renderBatch_) {
			stage._renderBatch = stage._renderBatch_;
			stage._renderBatch_ = undefined;
		} else {
			if (stage._renderBatch_ === undefined) {
				stage._renderBatch_ = stage._renderBatch;
			}
			stage._renderBatch = newFunc;
		}
	}

	/**
	 * Identical to replaceRenderBatchCall, but affects the Cover command.
	 * @param {StageGL} [stage] The stage to log information for.
	 * @param {Function} newFunc
	 */
	static replaceRenderCoverCall(stage = WebGLInspector.stage, newFunc) {
		if (newFunc === undefined && stage._renderCover_) {
			stage._renderCover = stage._renderCover_;
			stage._renderCover_ = undefined;
		} else {
			if (stage._renderCover_ === undefined) {
				stage._renderCover_ = stage._renderCover;
			}
			stage._renderCover = newFunc;
		}
	}

	/**
	 * Recursively walk the entire display tree, log the attached items, and display it in a tree view.
	 * @param {Array} [children] The children array to walk through.
	 * @param {String} prepend What to prepend to this output from this point onwards.
	 * @param {Function} customLog Which logging function to use, mainly for filtering or formatting output.
	 * Fallback hierarchy is customLog -> alternateOutput -> console.log.
	 */
	static logDepth(children = WebGLInspector.stage.children, prepend = "", customLog) {
		const l = children.length;
		for (let i = 0; i < l; i++) {
			const child = children[i];
			(customLog !== undefined ? customLog : WebGLInspector.log)(`${prepend}-`, child);
			if (child.children && child.children.length) {
				WebGLInspector.logDepth(child.children, `|${prepend}`, customLog);
			}
		}
	}

	/**
	 * Examine the context and provide information about its capabilities.
	 * @param {WebGLRenderingContext} [gl] The WebGL context to inspect.
	 */
	static logContextInfo(gl = WebGLInspector.stage._webGLContext) {
		WebGLInspector.log(`
			== LOG ==
			Max textures per draw: ${gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS)}
			Max textures active: ${gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS)}

			Max texture size: ${gl.getParameter(gl.MAX_TEXTURE_SIZE) / 2} ^ 2
			Max cache size: ${gl.getParameter(gl.MAX_RENDERBUFFER_SIZE) / 2} ^ 2

			Max attributes per vertex: ${gl.getParameter(gl.MAX_VERTEX_ATTRIBS)}
			WebGL Version string: ${gl.getParameter(gl.VERSION)}
			=========
		`);
	}

	/**
	 * Simulate renders and watch what happens for textures moving around between draw calls. A texture moving between
	 * slots means it was removed and then re-added to draw calls. Performance may be better if it was allowed to stay
	 * on GPU, consider sprite sheeting it with something stable.
	 * @param {easeljs.StageGL} [stage] The stage to log information for.
	 */
	static logTextureFill(stage = WebGLInspector.stage) {
		const dict = stage._textureDictionary;
		WebGLInspector.log("textureMax:", stage._batchTextureCount);
		const output = [];
		for (let n in dict) {
			const str = n.replace(window.location.origin, "");
			const tex = dict[n];
			const shifted = tex._lastActiveIndex ? tex._lastActiveIndex === tex._activeIndex : false;
			output.push({ src, shifted, element: tex });
			tex._lastActiveIndex = tex._activeIndex;
		}

		output.sort((a, b) => {
			if (a.element._drawID === stage._drawID) { return 1; }
			if (a.element._drawID < b.element._drawID) { return -1; }
			return 0;
		});

		const l = output.length;
		for (let i = 0; i < l; i++) {
			const out = output[i];
			const active = out.element._drawID === stage._drawID;
			WebGLInspector.log(`[${out.src}] ${active ? "ACTIVE" : "stage"} ${out.shifted ? "steady" : "DRIFT"}`, out.element);
		}
	}

	/**
	 * Utility function for use with {@link easeljs.WebGLInspector.logDepth}. Logs an item's position and registration.
	 * Useful to see if something is being forced off screen or has an integer position.
	 * @param {easeljs.DisplayObject} [item] The item we're currently logging about.
	 * @param {String} [prepend=""] The string to show before the item, usually formatting for a tree view.
	 */
	static dispProps(item, prepend = "") {
		WebGLInspector.log(prepend, `
			${item.toString()}
			P: ${item.x.toFixed(2)}x${item.y.toFixed(2)}
			R: ${item.regX.toFixed(2)}x${item.regY.toFixed(2)}
		`)
	}

	/**
	 * Utility function for use with {@link easeljs.WebGLInspector#replaceRenderBatchCall}.
	 * Tracks the highest element per batch count any render has achieved, useful for fine tuning max performance.
	 * Use `WebGLInspector.__lastHighest;` to inspect value.
	 * Warning, this will not show values higher than your current batchSize.
	 */
	static trackMaxBatchDraw() {
		var cardCount = this._batchVertexCount / StageGL.INDICIES_PER_CARD;
		// backwards handles NaNs inline
		if (!(cardCount < WebGLInspector.__lastHighest)) {
			WebGLInspector.__lastHighest = cardCount;
		}

		// don't break regular behavior
		stage._renderBatch_();
	}

	/**
	 * Utility function for use with {@link easeljs.WebGLInspector#replaceRenderBatchCall}.
	 * Performs no GL draw command.
	 */
	static drawEmptyBatch() {
		WebGLInspector.log(`BlankBatch[${this._drawID}:${this._batchID}] : ${this.batchReason}`);
		this._batchVertexCount = 0;
		this._batchID++;
	}

	/**
	 * Utility function for use with {@link easeljs.WebGLInspector#replaceRenderBatchCall}.
	 * Performs no GL draw command.
	 */
	static drawEmptyCover() {
		WebGLInspector.log(`BlankCover[${this._drawID}:${this._batchID}] : ${this.batchReason}`);
		this._batchID++;
	}

	/**
	 * Utility function for use with {@link easeljs.WebGLInspector#replaceRenderBatchCall}.
	 */
	static drawTexBuffer() {
		const gl = this._webGLContext;
		const texSize = 2048;

		// backup
		const batchVertexCount = this._batchVertexCount;
		const projectionMatrix = this._projectionMatrix;
		const shader = this._activeShader;
		const vertices = this._vertices;
		const indices = this._indices;
		const uvs = this._uvs;
		const alphas = this._alphas;
		const reason = this.batchReason;

		// create
		if (this._inspectorFrame === undefined) {
			this._inspectorFrame = this.getRenderBufferTexture(texSize, texSize);
		} else {
			gl.bindFramebuffer(gl.FRAMEBUFFER, this._inspectorFrame._frameBuffer);
			gl.clear(gl.COLOR_BUFFER_BIT);
		}

		// configure
		this._activeShader = this._mainShader;
		gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
		gl.blendFuncSeparate(gl.ONE, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
		gl.viewport(0, 0, texSize, texSize);

		this._projectionMatrix = new Float32Array([2 / texSize, 0, 0, 0, 0, -2 / texSize, 0, 0, 0, 0, 1, 0, -1, 1, 0, 1]);
		this._vertices = new Float32Array(this._batchTextureCount * 2 * createjs.StageGL.INDICIES_PER_CARD);
		this._indices = new Float32Array(this._batchTextureCount * 1 * createjs.StageGL.INDICIES_PER_CARD);
		this._uvs = new Float32Array(this._batchTextureCount * 2 * createjs.StageGL.INDICIES_PER_CARD);
		this._alphas = new Float32Array(this._batchTextureCount * 1 * createjs.StageGL.INDICIES_PER_CARD);
		this.batchReason = "LoadedTextureDebug";

		const squareBase = Math.ceil(Math.sqrt(this._batchTextureCount));
		for (let i = 0; i < this._batchTextureCount; i++) {
			const i1 = i * 6,
						i2 = i1 * 2,
						row = i % squareBase,
						col = Math.floor(i / squareBase),
						size = (1 / squareBase) * texSize;

			this._vertices[i2] = row * size;
			this._vertices[i2 + 1] = col * size;

			this._vertices[i2 + 2] = row * size;
			this._vertices[i2 + 3] = (col + 1) * size;

			this._vertices[i2 + 4] = (row + 1) * size;
			this._vertices[i2 + 5] = col * size;

			this._vertices[i2 + 6] = this._vertices[i2 + 2];
			this._vertices[i2 + 7] = this._vertices[i2 + 3];
			this._vertices[i2 + 8] = this._vertices[i2 + 4];
			this._vertices[i2 + 9] = this._vertices[i2 + 5];

			this._vertices[i2 + 10] =	(row + 1) * size;
			this._vertices[i2 + 11] =	(col + 1) * size;

			this._uvs[i2] =	0;
			this._uvs[i2 + 1] =	1;

			this._uvs[i2 + 2] =	0;
			this._uvs[i2 + 3] =	0;

			this._uvs[i2 + 4] =	1;
			this._uvs[i2 + 5] =	1;

			this._uvs[i2 + 6] =	0;
			this._uvs[i2 + 7] =	0;

			this._uvs[i2 + 8] =	1;
			this._uvs[i2 + 9] =	1;

			this._uvs[i2 + 10] = 1;
			this._uvs[i2+11] =0;

			this._indices[i1] = this._indices[i1 + 1] = this._indices[i1 + 2] = this._indices[i1 + 3] = this._indices[i1 + 4] = this._indices[i1 + 5] = i;
			this._alphas[i1] = this._alphas[i1 + 1] = this._alphas[i1 + 2] = this._alphas[i1 + 3] = this._alphas[i1 + 4] = this._alphas[i1 + 5] = 1;
		}

		// output
		this._batchVertexCount = this._batchTextureCount * StageGL.INDICIES_PER_CARD;
		this._renderBatch_();
		this._batchID--;

		// reset and perform
		gl.bindFramebuffer(gl.FRAMEBUFFER, this._batchTextureOutput._frameBuffer);

		const shaderData = this._builtShaders[this._renderMode];
		gl.blendEquationSeparate(shaderData.eqRGB, shaderData.eqA);
		gl.blendFuncSeparate(shaderData.srcRGB, shaderData.dstRGB, shaderData.srcA, shaderData.dstA);
		gl.viewport(0, 0, this._viewportWidth, this._viewportHeight);

		this._activeShader = shader;
		this._batchVertexCount = batchVertexCount;
		this._projectionMatrix = projectionMatrix;
		this._vertices = vertices;
		this._indices = indices;
		this._uvs = uvs;
		this._alphas = alphas;
		this.batchReason = reason;

		this._renderBatch_();
	}

}

/**
 * Alternate output for debugging situations where "console" is not available, i.e. Mobile or remote debugging.
 * Expects object with a "log" function that takes any number of params.
 * @type {Console}
 * @default null
 */
WebGLInspector.alternateOutput = null;

/**
 * Default stage to assume when non provided
 * @type {easeljs.StageGL}
 * @default null
 */
WebGLInspector.stage = null;

// initialize static inspector with EventDispatcher
EventDispatcher.initialize(WebGLInspector);
