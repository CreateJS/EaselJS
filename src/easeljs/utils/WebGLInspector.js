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

	function WebGLInspector(stage) {
		this.EventDispatcher_constructor();

	// public properties:

	// private properties:
		this._stage = stage;

		// and begin
		this._initializeWebGLInspector();
	}
	var p = createjs.extend(WebGLInspector, createjs.EventDispatcher);

// constants:

// getter / setters:

// ctor:
	/**
	 *
	 * @method _initializeWebGL
	 * @protected
	 */
	p._initializeWebGLInspector = function() {
	};

// public methods:
	p.log = function(stage) {
		if(!stage){ stage = this._stage; }

		console.log("Batches Per Draw", (stage._batchID/stage._drawID).toFixed(4));
		this.logContextInfo(stage._webGLContext);
		this.logDepth(stage.children, "");
		this.logTextureFill(stage);
	};

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
					console.log("BlankDraw["+ this._drawID +":"+ this._batchID +"] : "+ this.batchReason);
				}
			};
		}
	};

	p.logDepth = function(children, prepend, customLog) {
		if(!children){ children = this._stage.children; }
		if(!prepend){ prepend = ""; }

		var l = children.length;
		for(var i=0; i<l; i++) {
			var child = children[i];
			if(customLog !== undefined){
				customLog(prepend+"-", child);
			} else {
				console.log(prepend+"-", child);
			}
			if(child.children && child.children.length) {
				p.logDepth(child.children, "|"+prepend, customLog);
			}
		}
	};

	p.logContextInfo = function(gl) {
		if(!gl) { gl = this._stage._webGLContext; }
		var data = "== LOG:\n";
		data += "Max textures: " + gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS) +"\n";
		data += "Max combined: " + gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS) +"\n";
		data += "Max vertex: " + gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS) +"\n";
		data += "\n";
		data += "Max tex size: " + gl.getParameter(gl.MAX_TEXTURE_SIZE) +"\n";
		data += "Vtx atr max: " + gl.getParameter(gl.MAX_VERTEX_ATTRIBS) +"\n";
		console.log(data+"======");
	};

// protected methods:
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
			console.log("["+out.src+"]", active?"ACTIVE":"stale", out.shifted?"steady":"DRIFT", out.element);
		}
	};

	p.dispProps = function(prepend, item){
		if(!prepend){ prepend = ""; }

		console.log(
			prepend,
			item.toString()+"\t",
			"\tP:"+ item.x.toFixed(2)+"x"+item.y.toFixed(2) +"\t",
			"\tR:"+ item.regX.toFixed(2)+"x"+item.regY.toFixed(2) +"\t"
		);
	};

	createjs.WebGLInspector = createjs.promote(WebGLInspector, "EventDispatcher");
}());
