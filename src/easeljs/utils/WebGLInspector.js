/*
 * WebGLInspector
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

this.createjs = this.createjs||{};

(function() {
	"use strict";

	/**
	 * A utility and helper class designed to work with {{#crossLink "StageGL"}}{{/crossLink}} to help investigate and
	 * test performance or display problems. It contains logging functions to analyze behaviour and performance testing
	 * utilities.
	 * @class WebGLInspector
	 * @constructor
	 * @param {StageGL} stage The default stage to use when none is supplied.
	 */
	function WebGLInspector(stage) {
		this.EventDispatcher_constructor();

	// public properties:

	// private properties:
		/**
		 * The internal reference to the default stage this Inspector is for.
		 * @property _stage
		 * @protected
		 * @type {StageGL}
		 */
		this._stage = stage;

		// and begin
		this._initializeWebGLInspector();
	}
	var p = createjs.extend(WebGLInspector, createjs.EventDispatcher);

// static:
	/**
	 * Alternate output for debugging situations where "console" is not available, i.e. Mobile or remote debugging.
	 * Expects object with a "log" function that takes any number of params.
	 * @property alternateOutput
	 * @type {Console}
	 * @default null
	 * @static
	 * @protected
	 */
	p.alternateOutput = undefined;

// getter / setters:

// ctor:
	/**
	 * @method _initializeWebGL
	 * @protected
	 */
	p._initializeWebGLInspector = function() {};

// public methods:
	/**
	 * Perform all of the logging reports at once.
	 * @method log
	 * @param {StageGL} [stage=this._stage] The stage to log information for.
	 */
	p.log = function(stage) {
		if(!stage){ stage = this._stage; }

		console.log("Batches Per Draw", (stage._batchID/stage._drawID).toFixed(4));
		this.logContextInfo(stage._webGLContext);
		this.logDepth(stage.children, "");
		this.logTextureFill(stage);
	};

	/**
	 * Replace the stage's Draw command with an empty draw command. This is useful for testing performance, and ignoring
	 * rendering.
	 * @method toggleGPUDraw
	 * @param {StageGL} [stage=this._stage] The stage to log information for.
	 * @param {Boolean} enabled Force enabled. If left undefined, it will toggle.
	 */
	p.toggleGPUDraw = function(stage, enabled) {
		if(!stage){ stage = this._stage; }

		if(enabled === undefined) {
			enabled = !!stage._drawBuffers_;
		}

		if(enabled) {
			if(stage._drawBuffers_) {
				stage._drawBuffers = stage._drawBuffers_;
				stage._drawBuffers_ = undefined;
			}
		} else {
			stage._drawBuffers_ = stage._drawBuffers;
			stage._drawBuffers = function(gl) {
				if(this.vocalDebug) {
					var output = "BlankDraw["+ this._drawID +":"+ this._batchID +"] : "+ this.batchReason;
					this.alternateOutput?this.alternateOutput.log(output):console.log(output);
				}
			};
		}
	};

	/**
	 * Recursively walk the entire display tree, log the attached items, and display it in a tree view.
	 * @method logDepth
	 * @param {Array} [children=this._stage.children] The children array to walk through.
	 * @param {String} prepend What to prepend to this output from this point onwards.
	 * @param {Function} customLog Which logging function to use, mainly for filtering or formatting output.
	 * Fallback hierarchy is customLog -> alternateOutput -> console.log.
	 */
	p.logDepth = function(children, prepend, customLog) {
		if(!children){ children = this._stage.children; }
		if(!prepend){ prepend = ""; }

		var l = children.length;
		for(var i=0; i<l; i++) {
			var child = children[i];
			if(customLog !== undefined){
				customLog(prepend+"-", child);
			} else {
				this.alternateOutput?this.alternateOutput.log(prepend+"-", child):console.log(prepend+"-", child);
			}
			if(child.children && child.children.length) {
				p.logDepth(child.children, "|"+prepend, customLog);
			}
		}
	};

	/**
	 * Examine the context and provide information about its capabilities.
	 * @method logContextInfo
	 * @param {WebGLRenderingContext} gl The WebGL context to inspect.
	 */
	p.logContextInfo = function(gl) {
		if(!gl) { gl = this._stage._webGLContext; }
		var data = "== LOG:\n";
		data += "Max textures per draw: " + gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS) +"\n";
		data += "Max textures active: " + gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS) +"\n";
		data += "\n";
		data += "Max texture size: " + (gl.getParameter(gl.MAX_TEXTURE_SIZE)/2) +"^2 \n";
		data += "Max cache size: " + (gl.getParameter(gl.MAX_RENDERBUFFER_SIZE)/2) +"^2 \n";
		data += "\n";
		data += "Max attributes per vertex: " + gl.getParameter(gl.MAX_VERTEX_ATTRIBS) +"\n";
		data += "WebGL Version string: " + gl.getParameter(gl.VERSION) +"\n";
		data += "======";
		this.alternateOutput?this.alternateOutput.log(data):console.log(data);
	};

	/**
	 * Simulate renders and watch what happens for textures moving around between draw calls. A texture moving between
	 * slots means it was removed and then re-added to draw calls. Performance may be better if it was allowed to stay
	 * in place.
	 * @method logTextureFill
	 * @param {StageGL} [stage=this._stage] The stage to log information for.
	 */
	p.logTextureFill = function(stage) {
		if(!stage){ stage = this._stage; }

		var dict = stage._textureDictionary;
		var count = stage._batchTextureCount;
		console.log("textureMax:", count);
		var output = [];
		for(var n in dict) {
			var str = n.replace(window.location.origin, "");
			var tex = dict[n];
			var shifted = tex._lastActiveInde?tex._lastActiveIndex == tex._activeIndex:false;
			output.push({src:str, element:tex, shifted:shifted});
			tex._lastActiveIndex = tex._activeIndex;
		}

		output.sort(function(a,b){
			if (a.element._drawID == stage._drawID) { return 1; }
			if (a.element._drawID < b.element._drawID) { return -1; }
			return 0;
		});

		var l = output.length;
		for(var i = 0; i<l; i++) {
			var out = output[i];
			var active = out.element._drawID == stage._drawID;
			var output = "["+out.src+"] "+ (active?"ACTIVE":"stale") +" "+ (out.shifted?"steady":"DRIFT");
			this.alternateOutput?this.alternateOutput.log(output, out.element):console.log(output, out.element);
		}
	};


// protected methods:

// static methods:
	/**
	 * Utility function for use with {{#crossLink "logDepth"))((/crossLink}}. Logs an item's position and registration.
	 * Useful to see if something is being forced off screen or has an integer position.
	 * @method dispProps
	 * @param {String} prepend The string to show before the item, usually formatting for a tree view.
	 * @param {DisplayObject} item The item we're currently logging about.
	 * @static
	 */
	WebGLInspector.dispProps = function(prepend, item){
		if(!prepend){ prepend = ""; }

		var p = "\tP:"+ item.x.toFixed(2)+"x"+item.y.toFixed(2) +"\t";
		var r = "\tR:"+ item.regX.toFixed(2)+"x"+item.regY.toFixed(2) +"\t";

		if(!this.alternateOutput) {
			console.log(prepend, item.toString()+"\t", p,r);
		} else {
			this.alternateOutput.log(prepend, item.toString()+"\t", p,r);
		}
	};

	createjs.WebGLInspector = createjs.promote(WebGLInspector, "EventDispatcher");
}());
