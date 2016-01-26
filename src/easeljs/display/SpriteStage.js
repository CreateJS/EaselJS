/*
* SpriteStage
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
	 * README IF EDITING:
	 * Terminology for developers:
	 * 
	 * Vertex: a point that help defines a shape, 3 per triangle. Usually has an x,y,z but can have more/less info.
	 * Vertex Property: a piece of information attached to the vertex like x,y,z
	 * Index/Indecies: used in groups of 3 to define a triangle, points to vertecies by their index in an array (some render modes do not use these)
	 * Card: a group of 2 triangles used to display a rectangular image
	 * U/V: common names for the [0-1] texture co-ordinates on an image
	 * Batch: a single call to the renderer, best done as little as possible so multiple cards are put into a single batch
	 * Buffer: WebGL array data
	 * Program/Shader: For every vertex we run the Vertex shader, this information is then passed to a paired Fragment shader. When combined and paired these are a shader "program"
	 * Texture: WebGL representation of image data and associated extra information
	 * 
	**/

	/**
	 * A sprite stage is the root level {{#crossLink "Container"}}{{/crossLink}} for an aggressively optimized display list. Each time its {{#crossLink "Stage/tick"}}{{/crossLink}}
	 * method is called, it will render its display list to its target canvas. WebGL content is fully compatible with the existing Context2D renderer.
	 * On devices or browsers that don't support WebGL, content will automatically be rendered via canvas 2D.
	 *
	 * Restrictions:
	 *     - only Sprite, SpriteContainer, BitmapText, Bitmap and DOMElement are allowed to be added to the display list.
	 *     - a child being added (with the exception of DOMElement) MUST have an image or spriteSheet defined on it.
	 *     - a child's image/spriteSheet MUST never change while being on the display list.
	 *
	 * <h4>Example</h4>
	 * This example creates a sprite stage, adds a child to it, then uses {{#crossLink "Ticker"}}{{/crossLink}} to update the child
	 * and redraw the stage using {{#crossLink "SpriteStage/update"}}{{/crossLink}}.
	 *
	 *      var stage = new createjs.SpriteStage("canvasElementId", false, false);
	 *      stage.updateViewport(800, 600);
	 *      var image = new createjs.Bitmap("imagePath.png");
	 *      stage.addChild(image);
	 *      createjs.Ticker.addEventListener("tick", handleTick);
	 *      function handleTick(event) {
	 *          image.x += 10;
	 *          stage.update();
	 *      }
	 *
	 * <strong>Note:</strong> SpriteStage is not included in the minified version of EaselJS.
	 *
	 * @class SpriteStage
	 * @extends Stage
	 * @constructor
	 * @param {HTMLCanvasElement | String | Object} canvas A canvas object that the SpriteStage will render to, or the string id
	 * of a canvas object in the current document.
	 * @param {Boolean} preserveDrawingBuffer If true, the canvas is NOT auto-cleared by WebGL (spec discourages true). Useful if you want to use p.autoClear = false.
	 * @param {Boolean} antialias Specifies whether or not the browser's WebGL implementation should try to perform antialiasing.
	 **/
	function SpriteStage(canvas, preserveDrawingBuffer, antialias) {
		this.Stage_constructor(canvas);

		// private properties:
		///////////////////////////////////////////////////////
		/**
		 * Specifies whether or not the canvas is auto-cleared by WebGL. Spec discourages true.
		 * If true, the canvas is NOT auto-cleared by WebGL. Value is ignored if `_alphaEnabled` is false.
		 * Useful if you want to use `autoClear = false`.
		 * @property _preserveDrawingBuffer
		 * @protected
		 * @type {Boolean}
		 * @default false
		 **/
		this._preserveDrawingBuffer = preserveDrawingBuffer||false;

		/**
		 * Specifies whether or not the browser's WebGL implementation should try to perform antialiasing.
		 * @property _antialias
		 * @protected
		 * @type {Boolean}
		 * @default false
		 **/
		this._antialias = antialias||false;

		/**
		 * The width of the canvas element.
		 * @property _viewportWidth
		 * @protected
		 * @type {Number}
		 * @default 0
		 **/
		this._viewportWidth = 0;

		/**
		 * The height of the canvas element.
		 * @property _viewportHeight
		 * @protected
		 * @type {Number}
		 * @default 0
		 **/
		this._viewportHeight = 0;

		/**
		 * A 2D projection matrix used to convert WebGL's clipspace into normal pixels.
		 * @property _projectionMatrix
		 * @protected
		 * @type {Float32Array}
		 * @default null
		 **/
		this._projectionMatrix = null;

		/**
		 * The current WebGL canvas context.
		 * @property _webGLContext
		 * @protected
		 * @type {WebGLRenderingContext}
		 * @default null
		 **/
		this._webGLContext = null;

		/**
		 * Indicates whether or not an error has been detected when dealing with WebGL.
		 * If the is true, the behavior should be to use Canvas 2D rendering instead.
		 * @property _webGLErrorDetected
		 * @protected
		 * @type {Boolean}
		 * @default false
		 **/
		this._webGLErrorDetected = false;

		/**
		 * The color to use when the WebGL canvas has been cleared.
		 * @property _clearColor
		 * @protected
		 * @type {Object}
		 * @default null
		 **/
		this._clearColor = { r: 0.0, g: 0.0, b: 0.0, a: 1.0 };

		/**
		 * The maximum total number of boxes points that can be defined per draw call.
		 * @property _maxBoxesPointsPerDraw
		 * @protected
		 * @type {Number}
		 * @default null
		 **/
		this._maxBoxesPointsPerDraw = null;

		/**
		 * The maximum number of cards (sprites) that can be drawn in one draw call.
		 * Use getter/setters to modify otherwise buffers may be incorrect sizes.
		 * @property _maxCardsPerBatch
		 * @protected
		 * @type {Number}
		 * @default null
		 **/
		this._maxCardsPerBatch = SpriteStage.DEFAULT_MAX_BATCH_SIZE;

		/**
		 * The shader program used to draw everything.
		 * @property _shaderProgram
		 * @protected
		 * @type {WebGLProgram}
		 * @default null
		 **/
		this._shaderProgram = null;

		/**
		 * The vertices data for the current draw call.
		 * @property _vertices
		 * @protected
		 * @type {Float32Array}
		 * @default null
		 **/
		this._vertices = null;

		/**
		 * The buffer that contains all the vertices data.
		 * @property _verticesBuffer
		 * @protected
		 * @type {WebGLBuffer}
		 * @default null
		 **/
		this._verticesBuffer = null;

		/**
		 * The indices to the vertices defined in this._vertices.
		 * @property _indices
		 * @protected
		 * @type {Uint16Array}
		 * @default null
		 **/
		this._indices = null;

		/**
		 * The buffer that contains all the indices data.
		 * @property _indicesBuffer
		 * @protected
		 * @type {WebGLBuffer}
		 * @default null
		 **/
		this._indicesBuffer = null;

		/**
		 * The current card being processed for drawing.
		 * @property _currentCardIndex
		 * @protected
		 * @type {Number}
		 * @default -1
		 **/
		this._currentCardIndex = -1;

		/**
		 * The current texture that will be used to draw into the GPU.
		 * @property _drawTexture
		 * @protected
		 * @type {WebGLTexture}
		 * @default null
		 **/
		this._textureDictionary = {};

		this._batchTextures = [];

		this._batchTextureCount = 16;

		this.lookTexture = 0;

		this.batchIndex = 0;

		// and begin
		this._initializeWebGL();
	}
	var p = createjs.extend(SpriteStage, createjs.Stage);


	// constants:
	///////////////////////////////////////////////////////
	/**
	 * The number of properties defined per vertex.
	 * x, y, textureU, textureV, textureIndex, alpha
	 * @property NUM_VERTEX_PROPERTIES
	 * @static
	 * @final
	 * @type {Number}
	 * @readonly
	 **/
	SpriteStage.VERTEX_PROPERTY_COUNT = 6;

	/**
	 * The number of traingle indicies it takes to form a Card. 3 per triangles, 2 triangles.
	 * @property NUM_VERTEX_PROPERTIES
	 * @static
	 * @final
	 * @type {Number}
	 * @readonly
	 **/
	SpriteStage.INDICIES_PER_CARD = 6;

	/**
	 * Default value for the maximum number of cards we want to process in a batch.
	 * See WEBGL_MAX_INDEX_NUM for a hard limit.
	 * @property DEFAULT_MAX_BATCH_SIZE
	 * @static
	 * @final
	 * @type {Number}
	 * @readonly
	 **/
	SpriteStage.DEFAULT_MAX_BATCH_SIZE = 6000;

	/**
	 * The maximum size WebGL allows for element index numbers: 16 bit unsigned integer.
	 * It takes 6 indcies to make a unique card
	 * @property MAX_INDEX_SIZE
	 * @static
	 * @final
	 * @type {Number}
	 * @readonly
	 **/
	SpriteStage.WEBGL_MAX_INDEX_NUM = Math.pow(2, 16);

	/**
	 *
	 */
	SpriteStage.VTX_SHADER = (
		"attribute vec2 vertexPosition;" +
		"attribute vec2 uvPosition;" +
		"attribute float textureIndex;" +

		"uniform mat4 pMatrix;" +
		//"uniform int flagData;" +

		"varying highp vec2 vTextureCoord;" +
		"varying lowp float indexPicker;" +

		"void main(void) {" +
			//DHG TODO: why won't this work? Must be something wrong with the hand built matrix... bypass for now
			//vertexPosition, round if flag
			//"gl_Position = pMatrix * vec4(vertexPosition.x, vertexPosition.y, 0.0, 1.0);" +
			"gl_Position = vec4("+
				"(vertexPosition.x * pMatrix[0][0]) + pMatrix[3][0]," +
				"(vertexPosition.y * pMatrix[1][1]) + pMatrix[3][1]," +
				"pMatrix[3][2]," +
				"1.0" +
			");" +
			"indexPicker = textureIndex;" +
			"vTextureCoord = uvPosition;" +
		"}"
	);

	/**
	 *
	 */
	SpriteStage.FRAG_SHADER = (
		"precision mediump float;" +

		"varying highp vec2 vTextureCoord;" +
		"varying lowp float indexPicker;" +

		"uniform sampler2D uSampler[{{count}}];" +
		//"uniform int flagData;" +

		"void main(void) {" +
			"int src = int(indexPicker);" +
			"vec4 color = vec4(1.0, 0.0, 0.0, 1.0);" +

			"if(src == 0) {" +
				"color = texture2D(uSampler[0], vTextureCoord);" +
			"{{alternates}}" +
			"}" +

			"gl_FragColor = color;" +
			//"gl_FragColor = vec4(color.rgb, color.a * vTextureData.a);" +
		"}"
	);

	// getter / setters:
	///////////////////////////////////////////////////////
	/**
	 * Indicates whether WebGL is being used for rendering. For example, this would be false if WebGL is not
	 * supported in the browser.
	 * @readonly
	 * @property isWebGL
	 * @type {Boolean}
	 **/
	p._get_isWebGL = function() {
		return !!this._webGLContext;
	};

	try {
		Object.defineProperties(p, {
			isWebGL: { get: p._get_isWebGL }
		});
	} catch (e) {} // TODO: use Log

	// ctor:
	///////////////////////////////////////////////////////
	/**
	 *
	 * @method _initializeWebGL
	 * @protected
	 */
	p._initializeWebGL = function() {
		if (this.canvas) {
			if (!this._webGLContext || this._webGLContext.canvas !== this.canvas) {
				// A context hasn't been defined yet,
				// OR the defined context belongs to a different canvas, so reinitialize.
				this._createWebGL();
			}
		} else {
			this._webGLContext = null;
		}
		return this._webGLContext;
	};

	/**
	 *
	 * @method _createWebGL
	 * @protected
	 */
	p._createWebGL = function() {
		// defaults and options
		var options = {
			//depth: false, // Disable the depth buffer as it isn't used.
			alpha: false, // Make the canvas background transparent.
			stencil: true,
			antialias: this._antialias,
			preserveDrawingBuffer: this._preserveDrawingBuffer,
			premultipliedAlpha: true // Assume the drawing buffer contains colors with premultiplied alpha.
		};

		var gl = this._webGLContext = this._fetchWebGLContext(this.canvas, options);

		this._shaderProgram = this._fetchShaderProgram(gl);
		this._createBuffers(gl);
		this._initTextures(gl);

		//gl.clearColor(0.25, 0.25, 0.25, 1.0);
		//gl.disable(gl.DEPTH_TEST);
		gl.enable(gl.BLEND);
		gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
		gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);

		this.updateViewport(this._viewportWidth || this.canvas.width, this._viewportHeight || this.canvas.height);
	};

	// public methods:
	///////////////////////////////////////////////////////
	/** docced in super class **/
	p.update = function(props) {
		//DHG TODO: test context swapping and re-acqusition
		if (!this.canvas) { return; }
		if (this.tickOnUpdate) { this.tick(props); }
		//this.dispatchEvent("drawstart"); // TODO: make cancellable?
		//if (this.autoClear) { this.clear(); }
		if (this._webGLContext) {
			// Use WebGL.
			this._batchDraw(this, this._webGLContext);
		} else {
			// Use 2D.
			//var ctx = this.canvas.getContext("2d");
			//ctx.save();
			//this.updateContext(ctx);
			//this.draw(ctx, false);
			//ctx.restore();
		}
		//this.dispatchEvent("drawend");
	};

	/**
	 * Clears the target canvas. Useful if {{#crossLink "Stage/autoClear:property"}}{{/crossLink}} is set to `false`.
	 * @method clear
	 **/
	p.clear = function() {
		if (!this.canvas) { return; }
		if (this.isWebGLActive(this._webGLContext)) {
			var gl = this._webGLContext;
			// Use WebGL.
			//gl.clear(gl.COLOR_BUFFER_BIT);
		} else {
			// Use 2D.
			//var ctx = this.canvas.getContext("2d");
			//ctx.setTransform(1, 0, 0, 1, 0, 0);
			//ctx.clearRect(0, 0, this.canvas.width + 1, this.canvas.height + 1);
		}
	};

	p.isWebGLActive = function(ctx) {
		return ctx &&
			ctx instanceof WebGLRenderingContext &&
			typeof WebGLRenderingContext !== 'undefined';
	};

	/**
	 * Draws the stage into the specified context (using WebGL) ignoring its visible, alpha, shadow, and transform.
	 * If WebGL is not supported in the browser, it will default to a 2D context.
	 * Returns true if the draw was handled (useful for overriding functionality).
	 *
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method draw
	 * @param {CanvasRenderingContext2D} gl The canvas 2D context object to draw into.
	 * @param {Boolean} [ignoreCache=false] Indicates whether the draw operation should ignore any current cache.
	 * For example, used for drawing the cache (to prevent it from simply drawing an existing cache back
	 * into itself).
	 **/
	p.draw = function(gl, ignoreCache) {
		if (this.isWebGLActive(gl)) {
			this._batchDraw(this, gl);
			return true;
		} else {
			return this.Stage_draw(gl, ignoreCache);
		}
	};

	/**
	 * Update the WebGL viewport. Note that this does NOT update the canvas element's width/height.
	 * @method updateViewport
	 * @param {Number} width
	 * @param {Number} height
	 **/
	p.updateViewport = function (width, height) {
		this._viewportWidth = width;
		this._viewportHeight = height;
		var gl = this._webGLContext;

		if (gl) {
			gl.viewport(0, 0, this._viewportWidth, this._viewportHeight);

			// openGL works with a -1,1 space on its screen. It also follows Y-Up
			// we need to flip the y, scale and then translate the co-ordinates to match this
			// additionally we offset into they Y so the polygons are inside the camera's "clipping" plane
			this._projectionMatrix = new Float32Array([
				2 / width,		0,					0,				0,
				0,				-2 / height,		1,				0,
				0,				0,					1,				0,
				-1,				1,					0.1,			0
			]);
		}
	};

	/**
	 * Clears an image's texture to free it up for garbage collection.
	 * @method clearImageTexture
	 * @param  {HTMLImageElement} image
	 **/
	p.clearImageTexture = function(image) {
		image.__easeljs_texture = null;
	};

	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 **/
	p.toString = function() {
		return "[SpriteStage (name="+  this.name +")]";
	};

	p.getBaseTexture = function() {
		var gl = this._webGLContext;
		var texture = gl.createTexture();
		gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(
			gl.TEXTURE_2D,		// target
			0,					// level of detail
			gl.RGBA,			// internalformat
			1,	1,	0,			// width, height, border (only for array sourced textures)
			gl.RGBA,			// format (match internal format)
			gl.UNSIGNED_BYTE,	// type of texture(pixel color depth)
			new Uint8Array([0.1, 0.2, 0.3, 1.0]	// image data
		));
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		return texture;
	};

	p.buildUVRects = function(spritesheet, target, onlyTarget) {
		if(!spritesheet || !spritesheet._frames){ return result; }
		if(target === undefined) { target = -1; }
		if(onlyTarget === undefined) { onlyTarget = false; }

		var start = (target != -1 && onlyTarget)?(target):(0);
		var end = (target != -1 && onlyTarget)?(target+1):(spritesheet._frames.length);
		for(var i=start; i<end; i++) {
			var f = spritesheet._frames[i];
			if(f.uvRect) { continue; }
			if(f.image.width <= 0 || f.image.height <= 0) { continue; }

			var r = f.rect;
			f.uvRect = {
				t: r.y / f.image.height,					l: r.x / f.image.width,
				b: (r.y + r.height) / f.image.height,		r: (r.x + r.width) / f.image.width
			};
		}

		return spritesheet._frames[(target != -1)?(target):(0)].uvRect || {t:0, l:0, b:1, r:1};
	};

	// private methods:
	///////////////////////////////////////////////////////
	/**
	 *
	 * @method _fetchWebGLContext
	 * @protected
	 */
	p._fetchWebGLContext = function(canvas, options) {
		var gl;

		try {
			gl = canvas.getContext("webgl", options) || canvas.getContext("experimental-webgl", options);
		} catch (e) {
			// don't do anything in catch null will handle it and we may get false positives given the || operation
		}

		if (!gl) {
			alert("Could not initialize WebGL");
		} else {
			gl.viewportWidth = canvas.width;
			gl.viewportHeight = canvas.height;
		}

		return gl;
	};

	/**
	 *
	 * @method _fetchShaderProgram
	 * @protected
	 */
	p._fetchShaderProgram = function(gl) {
		//DHG might need to pre-process shader code
		var vertexShader = this._createShader(gl, 0, SpriteStage.VTX_SHADER);
		var fragmentShader = this._createShader(gl, 1, SpriteStage.FRAG_SHADER);

		var shaderProgram = gl.createProgram();
		gl.attachShader(shaderProgram, vertexShader);
		gl.attachShader(shaderProgram, fragmentShader);
		gl.linkProgram(shaderProgram);

		if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
			throw("Could not initialise shaders");
		}

		gl.useProgram(shaderProgram);

		// get the places in memory the shader is stored so we can feed information into them
		// then save it off on the shader because it's so tied to the shader itself
		shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vertexPosition");
		gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

		shaderProgram.textureIndexAttribute = gl.getAttribLocation(shaderProgram, "textureIndex");
		gl.enableVertexAttribArray(shaderProgram.textureIndexAttribute);

		shaderProgram.uvPositionAttribute = gl.getAttribLocation(shaderProgram, "uvPosition");
		gl.enableVertexAttribArray(shaderProgram.uvPositionAttribute);

		shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "pMatrix");
		//shaderProgram.flagUniform = gl.getUniformLocation(shaderProgram, "flagData");

		var samplers = [];
		for(var i = 0; i < this._batchTextureCount; i++) {
			samplers[i] = i;
		}

		shaderProgram.samplerData = samplers;
		shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
		gl.uniform1iv(shaderProgram.samplerUniform, samplers);

		return shaderProgram;
	};

	/**
	 * Creates a shader from the specified string.
	 * @method _createShader
	 * @param  {WebGLRenderingContext} gl
	 * @param  {Number} type               The type of shader to create.
	 * @param  {String} str                The definition for the shader.
	 * @return {WebGLShader}
	 * @protected
	 **/
	p._createShader = function(gl, type, str) {
		var shader;
		switch (type) {
			case 0:
				shader = gl.createShader(gl.VERTEX_SHADER);
				break;
			case 1:
				shader = gl.createShader(gl.FRAGMENT_SHADER);
				break;
			default:
				throw(type + " : Invalid");
				return null;
		}

		str = str.replace("{{count}}", this._batchTextureCount);

		var insert = "";
		for(var i=1; i<this._batchTextureCount; i++) {
			insert += "} else if(src == "+ i +") { color = texture2D(uSampler["+ i +"], vTextureCoord);";
		}
		str = str.replace("{{alternates}}", insert);

		gl.shaderSource(shader, str);
		gl.compileShader(shader);

		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			throw(gl.getShaderInfoLog(shader));
			return null;
		}

		return shader;
	};

	/**
	 * Sets up the necessary vertices and indices buffers.
	 * @method _createBuffers
	 * @param {WebGLRenderingContext} gl
	 * @protected
	 **/
	p._createBuffers = function(gl) {
		var groupCount = this._maxCardsPerBatch * SpriteStage.INDICIES_PER_CARD;
		var groupSize, i;

		var triangleVertexPositionBuffer = this._triangleVertexPositionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
		groupSize = 2;
		var vertices = this.vertices = new Float32Array(groupCount * groupSize);
		for(i=0; i<vertices.length; i+=groupSize) { vertices[i+0] = vertices[i+1] = 0; }
		gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);
		triangleVertexPositionBuffer.itemSize = groupSize;
		triangleVertexPositionBuffer.numItems = groupCount;

		var triangleTextureIndexBuffer = this._triangleTextureIndexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, triangleTextureIndexBuffer);
		groupSize = 1;
		var indecies = this.indecies = new Float32Array(groupCount);
		for(i=0; i<indecies.length; i++) { indecies[i] = 0; }
		gl.bufferData(gl.ARRAY_BUFFER, indecies, gl.DYNAMIC_DRAW);
		triangleTextureIndexBuffer.itemSize = groupSize;
		triangleTextureIndexBuffer.numItems = groupCount;

		var triangleUVPositionBuffer = this._triangleUVPositionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, triangleUVPositionBuffer);
		groupSize = 2;
		var uvs = this.uvs = new Float32Array(groupCount * groupSize);
		for(i=0; i<vertices.length; i+=groupSize) { uvs[i+0] = uvs[i+1] = 0; }
		gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.DYNAMIC_DRAW);
		triangleUVPositionBuffer.itemSize = groupSize;
		triangleUVPositionBuffer.numItems = groupCount;
	};

	p._initTextures = function(gl) {
		this.lastTexture = 0;

		for(var i=0; i<this._batchTextureCount;i++) {
			this._batchTextures[i] = this.getBaseTexture();
		}
	};

	p._loadTextureImage = function(gl, index, src) {
		this._textureDictionary[src] = this._batchTextures[index];
		var texture = this._batchTextures[index];
		var image = texture._image = new Image();
		image.onload = this._handleImageLoaded.bind(this, gl, image);
		image._batchIndex = index;
		image.src = src;

		return texture;
	};

	p._handleImageLoaded = function(gl, image) {
		var texture = this._batchTextures[image._batchIndex];

		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

		texture._w = image.width;
		texture._h = image.height;
	};

	p._batchDraw = function(sceneGraph, gl) {
		//console.log("startBatch");
		this.batchCardCount = 0;
		this.lookTexture = 0;
		this.depth = 0;

		var mtx = new createjs.Matrix2D();
		this._appendToBatchGroup(sceneGraph, gl, mtx);

		//console.log("endBatch");
		this._drawToGPU(gl);
		//console.log("=================================");
	};

	p._appendToBatchGroup = function(container, gl, concatMtx) {
		// sort out shared properties
		if(!container._glMtx) { container._glMtx = new createjs.Matrix2D(); }
		var cMtx = container._glMtx;
		cMtx.copy(concatMtx);
		cMtx.appendTransform(
			container.x, container.y,
			container.scaleX, container.scaleY,
			container.rotation, container.skewX, container.skewY,
			container.regX, container.regY
		);

		var tlX, tlY, trX, trY, blX, blY, brX, brY;
		//var tl = {x:0, y:0};
		//var tr = {x:0, y:0};
		//var bl = {x:0, y:0};
		//var br = {x:0, y:0};

		// actually apply its data to the buffers
		for (var i = 0, l = container.children.length; i < l; i++) {
			var item = container.children[i];
			if (!item.visible) { continue; }

			if (item.children) {
				this._appendToBatchGroup(item, gl, cMtx);
			} else {
				// check to see if we can render this
				if(this.batchCardCount+1 > this._maxCardsPerBatch) {
					this._drawToGPU(gl);
					this.batchCardCount = 0;
				}

				// check for overflowing batch, if yes then force a render

				// actually apply its data to the buffers
				if(!item._glMtx) { item._glMtx = new createjs.Matrix2D(); }
				var iMtx = item._glMtx;
				iMtx.copy(cMtx);
				iMtx.appendTransform(
					item.x, item.y,
					item.scaleX, item.scaleY,
					item.rotation, item.skewX, item.skewY,
					item.regX, item.regY
				);

				var uvRect, texIndex;

				var uvs = this.uvs;
				var vertices = this.vertices;
				var texI = this.indecies;
				var offset = this.batchCardCount*SpriteStage.INDICIES_PER_CARD*2;
				var loc = (offset/2)|0;

				switch(item._webGLRenderStyle) {
					case 1 : // Sprite
						var spr = item.spriteSheet;
						var frame = spr.getFrame(item.currentFrame);
						var rect = frame.rect;
						uvRect = frame.uvRect;
						var image = frame.image;
						if(!uvRect) {
							uvRect = this.buildUVRects(item.spriteSheet, item.currentFrame, false);
						}
						//this.lookTexture
						//this.batchTextures
						var texture = this._textureDictionary[image.src];
						if(!texture) {
							texture = this._loadTextureImage(gl, this.lastTexture++, image.src);
						}

						texIndex = 0;

						//iMtx.transformPoint(0,					0,					tl);
						//iMtx.transformPoint(rect.width,			0,					tr);
						//iMtx.transformPoint(0,					rect.height,		bl);
						//iMtx.transformPoint(rect.width,			rect.height,		br);

						//tl.x = /*0 *iMtx.a				+ 0 *iMtx.c					+*/iMtx.tx;
						//tl.y = /*0 *iMtx.b				+ 0 *iMtx.d					+*/iMtx.ty;
						//tr.x = rect.width *iMtx.a		/*+ 0 *iMtx.c*/				+iMtx.tx;
						//tr.y = rect.width *iMtx.b		/*+ 0 *iMtx.d*/				+iMtx.ty;
						//bl.x = /*0 *iMtx.a				+*/ rect.height *iMtx.c		+iMtx.tx;
						//bl.y = /*0 *iMtx.b				+*/ rect.height *iMtx.d		+iMtx.ty;
						//br.x = rect.width *iMtx.a		+ rect.height *iMtx.c		+iMtx.tx;
						//br.y = rect.width *iMtx.b		+ rect.height *iMtx.d		+iMtx.ty;
						tlX = /*0 *iMtx.a				+ 0 *iMtx.c					+*/iMtx.tx;
						tlY = /*0 *iMtx.b				+ 0 *iMtx.d					+*/iMtx.ty;
						trX = rect.width *iMtx.a		/*+ 0 *iMtx.c*/				+iMtx.tx;
						trY = rect.width *iMtx.b		/*+ 0 *iMtx.d*/				+iMtx.ty;
						blX = /*0 *iMtx.a				+*/ rect.height *iMtx.c		+iMtx.tx;
						blY = /*0 *iMtx.b				+*/ rect.height *iMtx.d		+iMtx.ty;
						brX = rect.width *iMtx.a		+ rect.height *iMtx.c		+iMtx.tx;
						brY = rect.width *iMtx.b		+ rect.height *iMtx.d		+iMtx.ty;

						break;
					case 2 : // BitmapText
						console.log("todo");
						continue;
						break;
					case 3 : // Bitmap
						console.log("todo");
						continue;
						break;
					case 4 : // DOMElement
						continue;
						break;
				}

				vertices[offset] = tlX;			vertices[offset+1] = tlY;
				vertices[offset+2] = blX;			vertices[offset+3] = blY;
				vertices[offset+4] = trX;			vertices[offset+5] = trY;
				vertices[offset+6] = blX;			vertices[offset+7] = blY;
				//vertices[offset+8] = tr.x;			vertices[offset+9] = tr.y;
				//vertices[offset+10] = br.x;			vertices[offset+11] = br.y;

				uvs[offset] = uvRect.l;				uvs[offset+1] = uvRect.t;
				uvs[offset+2] = uvRect.l;			uvs[offset+3] = uvRect.b;
				uvs[offset+4] = uvRect.r;			uvs[offset+5] = uvRect.t;
				uvs[offset+6] = uvRect.l;			uvs[offset+7] = uvRect.b;
				//uvs[offset+8] = uvRect.r;			uvs[offset+9] = uvRect.t;
				//uvs[offset+10] = uvRect.r;			uvs[offset+11] = uvRect.b;

				texI[loc] = texI[loc+1] = texI[loc+2] = texI[loc+3] = /*texI[loc+4] = texI[loc+5] =*/ texIndex;

				this.batchCardCount++;
			}
		}
	};

	/**
	 * Draws all the currently defined boxes to the GPU.
	 * @method _drawToGPU
	 * @param {WebGLRenderingContext} gl The canvas WebGL context object to draw into.
	 * @protected
	 **/
	p._drawToGPU = function(gl) {
		//console.log("DRAW batch:", this.batchCardCount*SpriteStage.INDICIES_PER_CARD);
		var shaderProgram = this._shaderProgram;
		var triangleVertexPositionBuffer = this._triangleVertexPositionBuffer;
		var triangleTextureIndexBuffer = this._triangleTextureIndexBuffer;
		var triangleUVPositionBuffer = this._triangleUVPositionBuffer;

		gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertices);
		gl.bindBuffer(gl.ARRAY_BUFFER, triangleTextureIndexBuffer);
		gl.vertexAttribPointer(shaderProgram.textureIndexAttribute, triangleTextureIndexBuffer.itemSize, gl.FLOAT, false, 0, 0);
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.indecies);
		gl.bindBuffer(gl.ARRAY_BUFFER, triangleUVPositionBuffer);
		gl.vertexAttribPointer(shaderProgram.uvPositionAttribute, triangleUVPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.uvs);

		gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, gl.FALSE, this._projectionMatrix);
		//gl.uniformMatrix1i(shaderProgram.flagUniform, gl.FALSE, this.flags);

		//DHG: sometimes this was needed. Apparently not all the time
		/*for (var j = 0; j < 16; j++) {
			var texture = this._batchTextures[j];
			gl.activeTexture(gl.TEXTURE0 + j);
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		}*/

		gl.drawArrays(gl.TRIANGLES, 0, this.batchCardCount*SpriteStage.INDICIES_PER_CARD);
		this.batchIndex++;
		//drawElements
	};

	// Injections
	///////////////////////////////////////////////////////
	/**
	 * We need to modify other classes, do this during our class initialization
	 */
	(function _injectProperties() {
		// Set which classes are compatible with SpriteStage. The order is important!!!
		// Reflect any changes to the drawing loop
		var candidates = [createjs.Sprite, createjs.BitmapText, createjs.Bitmap, createjs.DOMElement];
		candidates.forEach(function(_class, index) {
			_class.prototype._webGLRenderStyle = index + 1;
		});
		createjs.Container.prototype._webGLRenderStyle = createjs.SpriteContainer.prototype._webGLRenderStyle;
	})();

	createjs.SpriteStage = createjs.promote(SpriteStage, "Stage");
}());
