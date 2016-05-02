/*
* StageGL
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
	 * Vertex Property: a piece of information attached to the vertex like a vector3 containing x,y,z
	 * Index/Indices: used in groups of 3 to define a triangle, points to vertices by their index in an array (some render modes do not use these)
	 * Card: a group of 2 triangles used to display a rectangular image
	 * U/V: common names for the [0-1] texture co-ordinates on an image
	 * Batch: a single call to the renderer, best done as little as possible so multiple cards are put into a single batch
	 * Buffer: WebGL array data
	 * Program/Shader: For every vertex we run the Vertex shader, this information is then passed to a paired Fragment shader. When combined and paired these are a shader "program"
	 * Texture: WebGL representation of image data and associated extra information
	 * Slot: A space on the GPU into which textures can be loaded for use in a batch, using "ActiveTexture" switches texture slot.
	**/

	/**
	 * A Sprite Stage is the root level {{#crossLink "Container"}}{{/crossLink}} for an WebGL optimized display list. Each time its {{#crossLink "Stage/tick"}}{{/crossLink}}
	 * method is called, it will render its display list to its target canvas ignoring non webGL compatible Display Objects.
	 * On devices or browsers that don't support WebGL, content will automatically be rendered via canvas 2D.
	 *
	 * Complications:
	 *     - Shape, Shadow, and Text are not automatically rendered when added to the display list.
	  *    - To display something StageGL cannot normally render, cache the object. A cached object is the same to the renderer as a new image regardless of its contents.
	 *     - Images are wrapped as a webGL texture, graphics cards have a limit to concurrent textures, too many textures will slow performance. Ironically meaning caching may slow WebGL.
	 *     - If new images are continually added and removed from the display list it will leak memory due to WebGL Texture wrappers being made.
	 *     - Clone an image node (DOM/Canvas Element) to re-use it between multiple StageGL instances, the GPU texture loading and tracking is not advanced enough yet.
	 *     - You must call updateViewport if you resize your canvas after making a StageGL, this will properly size the 3D context stored in memory, this won't affect the DOM.
	 *
	 * <h4>How to use Example</h4>
	 * This example creates a sprite stage, adds a child to it, then uses {{#crossLink "Ticker"}}{{/crossLink}} to update the child
	 * and redraw the stage using {{#crossLink "StageGL/update"}}{{/crossLink}}.
	 *
	 *      var stage = new createjs.StageGL("canvasElementId", false, false);
	 *      stage.updateViewport(800, 600);
	 *      var image = new createjs.Bitmap("imagePath.png");
	 *      stage.addChild(image);
	 *      createjs.Ticker.addEventListener("tick", handleTick);
	 *      function handleTick(event) {
	 *          image.x += 10;
	 *          stage.update();
	 *      }
	 *
	 * <strong>Note:</strong> StageGL is not included in the minified version of EaselJS.
	 * <strong>Note:</strong> SpriteContainer was required by previous versions but is deprecated.
	 * <strong>Note:</strong> Previous versions had hard limitations about images per container etc, these have been removed.
	 *
	 * @class StageGL
	 * @extends Stage
	 * @constructor
	 * @param {HTMLCanvasElement | String | Object} canvas A canvas object that the StageGL will render to, or the string id
	 * of a canvas object in the current document.
	 * @param {Boolean|Object} preserveBuffer If true, the canvas is NOT auto-cleared by WebGL (spec discourages true).
	 *  Useful if you want to use p.autoClear = false. If an object, it will be inspected for the other params
	 * @param {Boolean} antialias Specifies whether or not the browser's WebGL implementation should try to perform antialiasing.
	 * @param {Boolean} transparent If true, the canvas is transparent, this is VERY expensive.
	 * @param {Boolean} premultiply Alters colour handling, if true assumes the shader must account for premultiplied alpha, can help avoid visual halo effects with some assets.
	 **/
	function StageGL(canvas, preserveBuffer, antialias, transparent, premultiply) {
		this.Stage_constructor(canvas);

		// see if the first parameter is an object or a boolean to toggle option loading
		if(preserveBuffer !== undefined && preserveBuffer !== !!preserveBuffer) {
			premultiply = preserveBuffer.premultiply;
			transparent = preserveBuffer.transparent;
			antialias = preserveBuffer.antialias;
			preserveBuffer = preserveBuffer.preserveBuffer;
		}

		// public properties:
		/**
		 * Console log potential issues and problems, this is designed to have -minimal- performance impact so
		 * if you're looking for more extensive debugging information this may be inadequate.
		 * @property vocalDebug
		 * @type {Boolean}
		 * @default false
		 */
		this.vocalDebug = false;

		// private properties:
		/**
		 * Used when the canvas context is created, requires context re-creation to update.
		 * Specifies whether or not the canvas is auto-cleared by WebGL. Spec discourages true.
		 * If true, the canvas is NOT auto-cleared by WebGL. WebGL replacement for `autoClear = false`.
		 * @property _preserveBuffer
		 * @protected
		 * @type {Boolean}
		 * @default false
		 **/
		this._preserveBuffer = preserveBuffer||false;

		/**
		 * Specifies whether or not the browser's WebGL implementation should try to perform antialiasing.
		 * @property _antialias
		 * @protected
		 * @type {Boolean}
		 * @default false
		 **/
		this._antialias = antialias||false;

		/**
		 * Specifies whether or not the browser's WebGL implementation should be transparent.
		 * @property _transparent
		 * @protected
		 * @type {Boolean}
		 * @default false
		 **/
		this._transparent = transparent||false;

		/**
		 * Specifies whether or not StageGL is handling colours as premultiplied alpha.
		 * @property _premultiply
		 * @protected
		 * @type {Boolean}
		 * @default false
		 **/
		this._premultiply = premultiply||false;

		/**
		 * The width of the drawing surface used in memory.
		 * @property _viewportWidth
		 * @protected
		 * @type {Number}
		 * @default 0
		 **/
		this._viewportWidth = 0;

		/**
		 * The height of the drawing surface used in memory.
		 * @property _viewportHeight
		 * @protected
		 * @type {Number}
		 * @default 0
		 **/
		this._viewportHeight = 0;

		/**
		 * A 2D projection matrix used to convert WebGL's viewspace into canvas co-ordinates.
		 * Regular canvas display uses a Top-Left = 0,0 where WebGL uses a Center 0,0 Top-Right 1,1 system.
		 * @property _projectionMatrix
		 * @protected
		 * @type {Float32Array}
		 * @default null
		 **/
		this._projectionMatrix = null;

		/**
		 * The current WebGL canvas context. Often shorthanded to just "gl" in many parts of the code.
		 * @property _webGLContext
		 * @protected
		 * @type {WebGLRenderingContext}
		 * @default null
		 **/
		this._webGLContext = null;

		/**
		 * The color to use when the WebGL canvas has been cleared.
		 * @property _clearColor
		 * @protected
		 * @type {Object}
		 * @default black
		 **/
		this._clearColor = {r: 0.00, g: 0.00, b: 0.00, a: 0.00};														//TODO: formalize this approach into regular canvases

		/**
		 * The maximum number of cards (aka a single sprite) that can be drawn in one draw call.
		 * Use getter/setters to modify otherwise internal buffers may be incorrect sizes.
		 * @property _maxCardsPerBatch
		 * @protected
		 * @type {Number}
		 * @default StageGL.DEFAULT_MAX_BATCH_SIZE
		 **/
		this._maxCardsPerBatch = StageGL.DEFAULT_MAX_BATCH_SIZE;														//TODO: write getter/setters for this

		/**
		 * The shader program used to draw the current batch.
		 * @property _activeShader
		 * @protected
		 * @type {WebGLProgram}
		 * @default null
		 **/
		this._activeShader = null;

		/**
		 * The vertex position data for the current draw call.
		 * @property _vertices
		 * @protected
		 * @type {Float32Array}
		 * @default null
		 **/
		this._vertices = null;

		/**
		 * The WebGL buffer attached to _vertices.
		 * @property _vertexPositionBuffer
		 * @protected
		 * @type {WebGLBuffer}
		 * @default null
		 **/
		this._vertexPositionBuffer = null;

		/**
		 * The vertex U/V data for the current draw call.
		 * @property _uvs
		 * @protected
		 * @type {Float32Array}
		 * @default null
		 **/
		this._uvs = null;

		/**
		 * The WebGL buffer attached to _uvs.
		 * @property _uvPositionBuffer
		 * @protected
		 * @type {WebGLBuffer}
		 * @default null
		 **/
		this._uvPositionBuffer = null;

		/**
		 * The vertex indices data for the current draw call.
		 * @property _indices
		 * @protected
		 * @type {Float32Array}
		 * @default null
		 **/
		this._indices = null;

		/**
		 * The WebGL buffer attached to _indices.
		 * @property _textureIndexBuffer
		 * @protected
		 * @type {WebGLBuffer}
		 * @default null
		 **/
		this._textureIndexBuffer = null;

		/**
		 * The vertices data for the current draw call.
		 * @property _alphas
		 * @protected
		 * @type {Float32Array}
		 * @default null
		 **/
		this._alphas = null;

		/**
		 * The WebGL buffer attached to _alphas.
		 * @property _alphaBuffer
		 * @protected
		 * @type {WebGLBuffer}
		 * @default null
		 **/
		this._alphaBuffer = null;

		/**
		 * An index based lookup of every WebGL Texture currently in use.
		 * @property _drawTexture
		 * @protected
		 * @type {Array}
		 * @default null
		 **/
		this._textureDictionary = [];

		/**
		 * A string based lookup hash of what index a texture is stored at in the dictionary.
		 * The lookup string is often the src url.
		 * @property _textureIDs
		 * @protected
		 * @type {Object}
		 * @default null
		 **/
		this._textureIDs = {};

		/**
		 * An array of all the textures currently loaded into the GPU, index in array matches GPU index.
		 * @property _batchTextures
		 * @protected
		 * @type {Array}
		 * @default null
		 */
		this._batchTextures = [];

		/**
		 * An array of all the simple filler textures used to prevent issues with missing textures in a batch.
		 * @property _baseTextures
		 * @protected
		 * @type {Array}
		 * @default null
		 */
		this._baseTextures = [];

		/**
		 * How many concurrent textures the gpu can handle. Dynamically set from WebGL during initialization.
		 * Spec states 8 is lowest guaranteed value but it could be higher.
		 * Do not set higher than the value returned by the GPU, and setting it lower will potentially reduce performance.
		 *      gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS)
		 * Can also act as a length for _batchTextures
		 * @property _batchTextureCount
		 * @protected
		 * @type {Number}
		 * @default 8
		 */
		this._batchTextureCount = 8;

		/**
		 * Location at which the last texture was inserted into a GPU slot in _batchTextures.
		 * Manual control of this variable could yield improvements in performance by intelligently replacing textures inside a batch.
		 * Impossible to write automated general use code for as it requires display list inspection/foreknowledge to attempt due to content knowledge.
		 * @protected
		 * @type {Number}
		 * @default -1
		 */
		this._lastTextureInsert = -1;

		/**
		 * Current batch being drawn, a batch consists of a call to "drawElements" on the GPU. Many may occur per draw.
		 * @protected
		 * @type {Number}
		 * @default 0
		 */
		this._batchID = 0;

		/**
		 * Current draw being performed, may contain multiple batches. Comparing to _batchID can reveal batching efficiency.
		 * @protected
		 * @type {Number}
		 * @default 0
		 */
		this._drawID = 0;

		/**
		 * Used to prevent textures in certain GPU slots from being replaced by an insert.
		 * @protected
		 * @type {Array}
		 */
		this._slotBlacklist = [];

		/**
		 * Used to prevent nested draw calls from accidentally overwriting drawing information by tracking depth.
		 * @protected
		 * @type {Number}
		 * @default 0
		 */
		this._isDrawing = 0;

		/**
		 * Used to ensure every canvas used has a unique ID.
		 * @protected
		 * @type {Number}
		 * @default 0
		 */
		this._lastTrackedCanvas = 0;

		/**
		 * Controls whether final rendering output of a {{#crossLink "cacheDraw"}}{{/crossLink}} is the canvas or a render texture.
		 * See the {{#crossLink "cache"}}{{/crossLink}} function modifications for full implications and discussion.
		 * @protected
		 * @type {Boolean}
		 * @default false
		 */
		this.isCacheControlled = false;

		/**
		 * Used to counter-position the object being cached so it aligns with the cache surface.
		 * @protected
		 * @type {Container}
		 * @default false
		 */
		this._cacheContainer = new createjs.Container();

		// and begin
		this._initializeWebGL();
	}
	var p = createjs.extend(StageGL, createjs.Stage);

	/**
	 * Calculate the U/V co-ordinate based info for sprite frames. Instead of pixel count it uses a 0-1 space.
	 * Also includes the ability to get info back for a specific frame or only calculate that one frame.
	 * @param  {SpriteSheet} spritesheet The spritesheet to find _frames on
	 * @param  {frame} [target=-1] The frame to return
	 * @param  {Boolean} [onlyTarget=false] Whether "target" is the only frame that gets calculated
	 * @method buildUVRects
	 * @return {Object} the target frame if supplied and present or a generic frame {t, l, b, r}
	 */
	StageGL.buildUVRects = function(spritesheet, target, onlyTarget) {
		// handle defaults and error cases
		if(!spritesheet || !spritesheet._frames){ return null; }
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

	/**
	 * Test a context to see if it has WebGL enabled on it.
	 * @method isWebGLActive
	 * @param {CanvasContext} ctx The context to test
	 * @return {Boolean} Whether WebGL is enabled
	 */
	StageGL.isWebGLActive = function(ctx) {
		return ctx &&
			ctx instanceof WebGLRenderingContext &&
			typeof WebGLRenderingContext !== 'undefined';
	};

	// static properties:
	/**
	 * The number of properties defined per vertex.
	 * x, y, textureU, textureV, textureIndex, alpha
	 * @property NUM_VERTEX_PROPERTIES
	 * @static
	 * @final
	 * @type {Number}
	 * @readonly
	 **/
	StageGL.VERTEX_PROPERTY_COUNT = 6;

	/**
	 * The number of triangle indices it takes to form a Card. 3 per triangles, 2 triangles.
	 * @property NUM_VERTEX_PROPERTIES
	 * @static
	 * @final
	 * @type {Number}
	 * @readonly
	 **/
	StageGL.INDICIES_PER_CARD = 6;

	/**
	 * Default value for the maximum number of cards we want to process in a batch.
	 * See WEBGL_MAX_INDEX_NUM for a hard limit.
	 * @property DEFAULT_MAX_BATCH_SIZE
	 * @static
	 * @final
	 * @type {Number}
	 * @readonly
	 **/
	StageGL.DEFAULT_MAX_BATCH_SIZE = 10000;

	/**
	 * The maximum size WebGL allows for element index numbers: 16 bit unsigned integer.
	 * It takes 6 indices to make a unique card.
	 * @property MAX_INDEX_SIZE
	 * @static
	 * @final
	 * @type {Number}
	 * @readonly
	 **/
	StageGL.WEBGL_MAX_INDEX_NUM = Math.pow(2, 16);

	/**
	 * Default U/V rect for dealing with full coverage from an image source.
	 * @property UV_RECT
	 * @static
	 * @final
	 * @type {Object}
	 * @readonly
	 */
	StageGL.UV_RECT = {t:0, l:0, b:1, r:1};

	/**
	 * Vertex positions for a card that covers the entire render. Used with render targets primarily.
	 * @property COVER_VERT
	 * @static
	 * @final
	 * @type {Float32Array}
	 * @readonly
	 */
	StageGL.COVER_VERT = new Float32Array([
		-1,		 1,		//TL
		1,		 1,		//TR
		-1,		-1,		//BL
		1,		 1,		//TR
		1,		-1,		//BR
		-1,		-1		//BL
	]);

	/**
	 * U/V for {{#crossLink "COVER_VERT"}}{{/crossLink}}.
	 * @property COVER_UV
	 * @static
	 * @final
	 * @type {Float32Array}
	 * @readonly
	 */
	StageGL.COVER_UV = new Float32Array([
		 0,		 0,		//TL
		 1,		 0,		//TR
		 0,		 1,		//BL
		 1,		 0,		//TR
		 1,		 1,		//BR
		 0,		 1		//BL
	]);

	/**
	 * Flipped U/V for {{#crossLink "COVER_VERT"}}{{/crossLink}}.
	 * @property COVER_UV_FLIP
	 * @static
	 * @final
	 * @type {Float32Array}
	 * @readonly
	 */
	StageGL.COVER_UV_FLIP = new Float32Array([
		 0,		 1,		//TL
		 1,		 1,		//TR
		 0,		 0,		//BL
		 1,		 1,		//TR
		 1,		 0,		//BR
		 0,		 0		//BL
	]);

	/**
	 * Portion of the shader that contains the "varying" properties required in both vertex and fragment shaders.
	 * The regular shader is designed to render all expected objects.
	 * Shader code may contain templates that are replaced pre compile.
	 * @property REGULAR_VARYING_HEADER
	 * @static
	 * @final
	 * @type {String}
	 * @readonly
	 */
	StageGL.REGULAR_VARYING_HEADER = (
		"precision mediump float;" +

		"varying vec2 vTextureCoord;" +
		"varying lowp float indexPicker;" +
		"varying lowp float alphaValue;"
	);

	/**
	 * Actual full header for the vertex shader. Includes the varying header.
	 * The regular shader is designed to render all expected objects.
	 * Shader code may contain templates that are replaced pre compile.
	 * @property REGULAR_VERTEX_HEADER
	 * @static
	 * @final
	 * @type {String}
	 * @readonly
	 */
	StageGL.REGULAR_VERTEX_HEADER = (
		StageGL.REGULAR_VARYING_HEADER +
		"attribute vec2 vertexPosition;" +
		"attribute vec2 uvPosition;" +
		"attribute lowp float textureIndex;" +
		"attribute lowp float objectAlpha;" +

		"uniform mat4 pMatrix;"
	);

	/**
	 * Actual full header for the fragment shader. Includes the varying header.
	 * The regular shader is designed to render all expected objects.
	 * Shader code may contain templates that are replaced pre compile.
	 * @property REGULAR_FRAGMENT_HEADER
	 * @static
	 * @final
	 * @type {String}
	 * @readonly
	 */
	StageGL.REGULAR_FRAGMENT_HEADER = (
		StageGL.REGULAR_VARYING_HEADER +
		"uniform sampler2D uSampler[{{count}}];"
	);

	/**
	 * Body of the vertex shader.
	 * The regular shader is designed to render all expected objects.
	 * Shader code may contain templates that are replaced pre compile.
	 * @property REGULAR_VERTEX_BODY
	 * @static
	 * @final
	 * @type {String}
	 * @readonly
	 */
	StageGL.REGULAR_VERTEX_BODY  = (
		"void main(void) {" +
			//DHG TODO: why won't this work? Must be something wrong with the hand built matrix see js... bypass for now
			//vertexPosition, round if flag
			//"gl_Position = pMatrix * vec4(vertexPosition.x, vertexPosition.y, 0.0, 1.0);" +
			"gl_Position = vec4("+
				"(vertexPosition.x * pMatrix[0][0]) + pMatrix[3][0]," +
				"(vertexPosition.y * pMatrix[1][1]) + pMatrix[3][1]," +
				"pMatrix[3][2]," +
				"1.0" +
			");" +
			"alphaValue = objectAlpha;" +
			"indexPicker = textureIndex;" +
			"vTextureCoord = uvPosition;" +
		"}"
	);

	/**
	 * Body of the fragment shader.
	 * The regular shader is designed to render all expected objects.
	 * Shader code may contain templates that are replaced pre-compile.
	 * @property REGULAR_FRAGMENT_BODY
	 * @static
	 * @final
	 * @type {String}
	 * @readonly
	 */
	StageGL.REGULAR_FRAGMENT_BODY = (
		"void main(void) {" +
			"int src = int(indexPicker);" +
			"vec4 color = vec4(1.0, 0.0, 0.0, 1.0);" +

			"if(src == 0) {" +
				"color = texture2D(uSampler[0], vTextureCoord);" +
				"{{alternates}}" +
			"}" +

			"gl_FragColor = vec4(color.rgb{{premultiply}}, color.a * alphaValue);" +
		"}"
	);

	//TODO: DHG: a real particle shader
	StageGL.PARTICLE_VERTEX_BODY = (
		StageGL.REGULAR_VERTEX_BODY
	);

	StageGL.PARTICLE_FRAGMENT_BODY = (
		StageGL.REGULAR_FRAGMENT_BODY
	);

	/**
	 * Portion of the shader that contains the "varying" properties required in both vertex and fragment shaders.
	 * The cover shader is designed to be a simple vertex/uv only texture render that covers the render surface.
	 * Shader code may contain templates that are replaced pre-compile.
	 * @property COVER_VARYING_HEADER
	 * @static
	 * @final
	 * @type {String}
	 * @readonly
	 */
	StageGL.COVER_VARYING_HEADER = (
		"precision mediump float;" +

		"varying highp vec2 vRenderCoord;" +
		"varying highp vec2 vTextureCoord;"
	);

	/**
	 * Actual full header for the vertex shader. Includes the varying header.
	 * The cover shader is designed to be a simple vertex/uv only texture render that covers the render surface.
	 * Shader code may contain templates that are replaced pre compile.
	 * @property COVER_VERTEX_HEADER
	 * @static
	 * @final
	 * @type {String}
	 * @readonly
	 */
	StageGL.COVER_VERTEX_HEADER = (
		StageGL.COVER_VARYING_HEADER +
		"attribute vec2 vertexPosition;" +
		"attribute vec2 uvPosition;" +
		"uniform float uUpright;"
	);

	/**
	 * Actual full header for the fragment shader. Includes the varying header.
	 * The cover shader is designed to be a simple vertex/uv only texture render that covers the render surface.
	 * Shader code may contain templates that are replaced pre compile.
	 * @property COVER_FRAGMENT_HEADER
	 * @static
	 * @final
	 * @type {String}
	 * @readonly
	 */
	StageGL.COVER_FRAGMENT_HEADER = (
		StageGL.COVER_VARYING_HEADER +
		"uniform sampler2D uSampler;"
	);

	/**
	 * Body of the vertex shader.
	 * The cover shader is designed to be a simple vertex/uv only texture render that covers the render surface.
	 * Shader code may contain templates that are replaced pre compile.
	 * @property COVER_VERTEX_BODY
	 * @static
	 * @final
	 * @type {String}
	 * @readonly
	 */
	StageGL.COVER_VERTEX_BODY  = (
		"void main(void) {" +
			"gl_Position = vec4(vertexPosition.x, vertexPosition.y, 0.0, 1.0);" +
			"vRenderCoord = uvPosition;" +
			"vTextureCoord = vec2(uvPosition.x, abs(uUpright - uvPosition.y));" +
		"}"
	);

	/**
	 * Body of the fragment shader.
	 * The cover shader is designed to be a simple vertex/uv only texture render that covers the render surface.
	 * Shader code may contain templates that are replaced pre compile.
	 * @property COVER_FRAGMENT_BODY
	 * @static
	 * @final
	 * @type {String}
	 * @readonly
	 */
	StageGL.COVER_FRAGMENT_BODY = (
		"void main(void) {" +
			"vec4 color = texture2D(uSampler, vRenderCoord);" +
			"gl_FragColor = color;" +
		"}"
	);

// events:
	/**
	 * Dispatched each update immediately before the canvas is cleared and the display list is drawn to it.
	 * You can call preventDefault on the event object to cancel the draw.
	 * @event drawstart
	 */

	/**
	 * Dispatched each update immediately after the display list is drawn to the canvas and the canvas context is restored.
	 * @event drawend
	 */

// getter / setters:
	p._get_isWebGL = function() {
		return !!this._webGLContext;
	};

	try {
		Object.defineProperties(p, {
			/**
			 * Indicates whether WebGL is being used for rendering. For example, this would be false if WebGL is not
			 * supported in the browser.
			 * @readonly
			 * @property isWebGL
			 * @type {Boolean}
			 **/
			isWebGL: { get: p._get_isWebGL }
		});
	} catch (e) {} // TODO: use Log


// constructor methods:
	/**
	 * Create and properly initialize the WebGL instance we will be using.
	 * @method _initializeWebGL
	 * @protected
	 */
	p._initializeWebGL = function() {
		if (this.canvas) {
			if (!this._webGLContext || this._webGLContext.canvas !== this.canvas) {
				// A context hasn't been defined yet,
				// OR the defined context belongs to a different canvas, so reinitialize.

				// defaults and options
				var options = {
					depth: false, // Disable the depth buffer as it isn't used.
					alpha: this._transparent, // Make the canvas background transparent.
					stencil: true,
					antialias: this._antialias,
					premultipliedAlpha: this._premultiply, // Assume the drawing buffer contains colors with premultiplied alpha.
					preserveDrawingBuffer: this._preserveBuffer
				};

				var gl = this._webGLContext = this._fetchWebGLContext(this.canvas, options);
				if(!gl) { return null; }

				this.updateSimultaneousTextureCount(gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS));
				this._maxTextureSlots = gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
				this._createBuffers(gl);
				this._initTextures(gl);

				gl.disable(gl.DEPTH_TEST);
				gl.enable(gl.BLEND);
				gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
				gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this._premultiply);
				//gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);

				this.setClearColor();
				this.updateViewport(this._viewportWidth || this.canvas.width, this._viewportHeight || this.canvas.height);
			}
		} else {
			this._webGLContext = null;
		}
		return this._webGLContext;
	};

// public methods:
	/** docced in super class **/
	p.update = function(props) {
		if (!this.canvas) { return; }
		if (this.tickOnUpdate) { this.tick(props); }
		this.dispatchEvent("drawstart");
		if (this.autoClear) { this.clear(); }

		if (this._webGLContext) {
			// Use WebGL.
			this._batchDraw(this, this._webGLContext);
		} else {
			// Use 2D.
			var ctx = this.canvas.getContext("2d");
			ctx.save();
			this.updateContext(ctx);
			this.draw(ctx, false);
			ctx.restore();
		}
		this.dispatchEvent("drawend");
	};

	/** docced in super class **/
	p.clear = function() {
		if (!this.canvas) { return; }
		if (StageGL.isWebGLActive(this._webGLContext)) {
			var gl = this._webGLContext;
			// Use WebGL.
			gl.clear(gl.COLOR_BUFFER_BIT);
		} else {
			// Use 2D.
			var ctx = this.canvas.getContext("2d");
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.clearRect(0, 0, this.canvas.width + 1, this.canvas.height + 1);
		}
	};

	/**
	 * Draws the stage into the supplied context be it context2D or using WebGL. Many WebGL properties only exist on their context.
	 * As such you cannot share StageGLs among many contexts and each context requires a unique one.
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method draw
	 * @param {CanvasRenderingContext2D | WebGLRenderingContext} context The context object to draw into.
	 * @param {Boolean} [ignoreCache=false] Indicates whether the draw operation should ignore any current cache. For example,
	 * used for drawing the cache (to prevent it from simply drawing an existing cache back into itself).
	 * @return {Boolean} Was the draw handled by this function
	 **/
	p.draw = function(context, ignoreCache) {
		if (context === this._webGLContext && StageGL.isWebGLActive(this._webGLContext)) {
			var gl = this._webGLContext;
			this._batchDraw(this, gl, ignoreCache);
			return true;
		} else {
			return this.Stage_draw(context, ignoreCache);
		}
	};

	/**
	 * Draws the target into the correct context be it canvas or Render Texture using WebGL.
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method cacheDraw
	 * @param {DisplayObject} target The object we're drawing into cache.
	 * For example, used for drawing the cache (to prevent it from simply drawing an existing cache back
	 * into itself).
	 * @param {Array} filters The filters we're drawing into cache.
	 * @param {CacheManager} manager The CacheManager instance looking after the cache
	 * @return {Boolean} Was the draw handled by this function
	 **/
	p.cacheDraw = function(target, filters, manager) {
		if (StageGL.isWebGLActive(this._webGLContext)) {
			var gl = this._webGLContext;
			this._cacheDraw(gl, target, filters, manager);
			return true;
		} else {
			return false;
		}
	};

	/**
	 * Blocks, or frees a texture "slot" on the GPU. Can be useful if you are overflowing textures.
	 * When overflowing textures they are re-uploaded to the GPU every time they're encountered, this can be expensive with large textures.
	 * By blocking the slot you reduce available slots potentially increasing draw calls, but mostly you prevent a texture being re-uploaded if it would of moved slot due to overflow.
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method protectTextureSlot
	 * @param  {Number} id The slot to be affected
	 * @param  {Boolean} lock Whether this slot is the one being locked.
	 */
	p.protectTextureSlot = function(id, lock) {
		if(id > this._maxTextureSlots || id < 0){
			throw "Slot outside of acceptable range";
		}
		this._slotBlacklist[id] = !!lock;
	};

	/**
	 * Render textures can't draw into themselves so any item being used for renderTextures needs two.
	 * This function creates, gets, and toggles the render surface.
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @param  {DisplayObject} target The object associated with the render textures, usually a cached object.
	 * @param  {Number} w The width to create the texture at.
	 * @param  {Number} h The height to create the texture at.
	 * @method getTargetRenderTexture
	 */
	p.getTargetRenderTexture = function(target, w,h) {
		var result, toggle = false;
		var gl = this._webGLContext;
		if(target.__lastRT !== undefined && target.__lastRT === target.__rtA){ toggle = true; }
		if(!toggle){
			if(target.__rtA === undefined) {
				target.__rtA = this.getRenderBufferTexture(w, h);
			} else {
				if(w != target.__rtA._width || h != target.__rtA._height) {
					this.resizeTexture(target.__rtA, w, h);
				}
				this.setTextureParams(gl);
			}
			result = target.__rtA;
		} else {
			if(target.__rtB === undefined) {
				target.__rtB = this.getRenderBufferTexture(w, h);
			} else {
				if(w != target.__rtB._width || h != target.__rtB._height) {
					this.resizeTexture(target.__rtB, w, h);
				}
				this.setTextureParams(gl);
			}
			result = target.__rtB;
		}
		if(!result){
			throw "Problems creating render textures, known causes include using too much VRAM by not releasing WebGL texture instances";
		}
		target.__lastRT = result;
		return result;
	};

	/**
	 * For every image encountered it is registered and tracked automatically.
	 * When all items using an image are removed from the stage it's recommended to remove it manually to prevent memory leaks.
	 * This function will remove all textures found on the object and its children, cache, etc.
	 * Specifically it will also uncache, cached objects it finds.
	 * This happens instantly so aggressive use could result in performance problems.
	 * If you remove a texture and add it again later(by rendering an object using it for example) the texture will get re-added and need re-removing later.
	 * @method releaseTexture
	 * @param  {DisplayObject | Texture | Image | Canvas} item An object that used the texture you are no longer using.
	 */
	p.releaseTexture = function(item) {
		var i, l;
		if(!item){ return; }

		// this is a container object
		if(item.children) {
			for(i = 0, l = item.children.length; i<l; i++) {
				this.releaseTexture(item.children[i]);
			}
		}

		// this has a cache canvas
		if(item.cacheCanvas) {
			item.uncache();
			if(this.vocalDebug) {
				console.log("Automatic uncache call, potentially unexpected behaviour. Recommend manual uncache calling.");
			}
		}

		var foundImage = undefined;
		if(item._storeID !== undefined){
			// this is a texture itself
			if(item._storeID < 0) {
				this._killTextureObject(item);
				item._storeID = undefined;
				return;
			}

			// this is an image or canvas
			foundImage = item;
		} else if(item._webGLRenderStyle === 2) {
			// this is a Bitmap class
			foundImage = item.image;
		} else if(item._webGLRenderStyle === 1) {
			// this is a SpriteSheet, we can't tell which image we used from the list easily so remove them all!
			for(i = 0, l = item.spriteSheet._images.length; i<l; i++) {
				this.releaseTexture(item.spriteSheet._images[i]);
			}
			return;
		}

		// did we find anything
		if(foundImage === undefined) {
			if(this.vocalDebug) {
				console.log("No associated texture found on release");
			}
			return;
		}

		// remove it
		this._killTextureObject(this._textureDictionary[foundImage._storeID]);
		foundImage._storeID = undefined;
	};

	/**
	 * Akin to {{#crossLink "releaseTexture"}}{{/crossLink}} this function differs by looking for textures to unregister.
	 * It works by assuming that it can purge any texture which is not currently loaded in a texture slot and last used more than "count" draw calls ago.
	 * Because this process is unaware of the objects and whether they may be used on your stage false positives can occur.
	 * It is recommended to manually manage your memory with releaseTexture; however, there are use cases where this may be simpler and error free.
	 * @method updateSimultaneousTextureCount
	 * @param {Number} count How many renders ago the texture was last used
	 */
	p.purgeTextures = function(count) {
		if(count == undefined){ count = 100; }

		for(var i= 0, l=this._textureDictionary.length; i<l; i++) {
			var item = this._textureDictionary[i];
			if(!item){ continue; }
			if(item._drawID + count <= this._drawID) {	// use draw not batch as draw is more indicative of time
				this._killTextureObject(item);
			}
		}
	};

	/**
	 * Try to set the max textures the system can handle, should default to the hardware maximum, lower values may limit performance.
	 * Some devices have been known to mis-report their max textures, or you may need a standard baseline cross devices for testing.
	 * Barring the previous suggestions there is little need to call this function as the library will automatically try to find the best value.
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method updateSimultaneousTextureCount
	 * @param {Number} [count=1] The number of textures intended for simultaneous loading.
	 */
	p.updateSimultaneousTextureCount = function(count) {
		//TODO: DHG: make sure API works in all instances, may be some issues with buffers etc I haven't foreseen
		var gl = this._webGLContext;
		var success = false;

		if(count < 1 || isNaN(count)){ count = 1; }
		this._batchTextureCount = count;

		while(!success) {
			try{
				this._activeShader = this._fetchShaderProgram(gl);
				success = true;
			} catch(e) {
				if(this._batchTextureCount == 1){
					throw "Cannot compile shader " + e;
				}

				this._batchTextureCount -= 4;
				if(this._batchTextureCount < 1){ this._batchTextureCount = 1; }

				if(this.vocalDebug){
					console.log("Reducing desired texture count due to errors: " + this._batchTextureCount);
				}
			}
		}
	};

	/**
	 * Update the WebGL viewport. Note that this does NOT update the canvas element's width/height but the render surface.
	 * @method updateViewport
	 * @param {Number} width Integer pixel size of render surface.
	 * @param {Number} height Integer pixel size of render surface.
	 **/
	p.updateViewport = function (width, height) {
		this._viewportWidth = width|0;
		this._viewportHeight = height|0;
		var gl = this._webGLContext;

		if (gl) {
			gl.viewport(0, 0, this._viewportWidth, this._viewportHeight);

			// WebGL works with a -1,1 space on its screen. It also follows Y-Up
			// we need to flip the y, scale and then translate the co-ordinates to match this
			// additionally we offset into they Y so the polygons are inside the camera's "clipping" plane
			this._projectionMatrix = new Float32Array([
				2 / this._viewportWidth,	0,								0,							0,
				0,							-2 / this._viewportHeight,		1,							0,
				0,							0,								1,							0,
				-1,							1,								0.1,						0
			]);
			// create the flipped version for use with render texture flipping
			// DHG: this would be a slice but some platforms don't offer slice's for Float32Array
			this._projectionMatrixFlip = new Float32Array([0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]);
			this._projectionMatrixFlip.set(this._projectionMatrix);
			this._projectionMatrixFlip[5] *= -1;
			this._projectionMatrixFlip[13] *= -1;
		}
	};

	/**
	 * Fetches the shader compiled and setup to work with the provided filter.
	 * The shader is compiled on first use and returned on subsequent calls.
	 * @method getFilterShader
	 * @param  {WebGLRenderingContext} gl
	 */
	p.getFilterShader = function(gl, filter) {
		if(!filter) { filter = this; }
		var targetShader = this._activeShader;
		if(filter._builtShader) {
			targetShader = filter._builtShader;
			if(targetShader.shaderParamSetup) {
				targetShader.shaderParamSetup(gl, this, targetShader);
			}
		} else {
			try{
				targetShader = this._fetchShaderProgram(
					gl, "filter",
					filter.VTX_SHADER_BODY, filter.FRAG_SHADER_BODY,
					filter.shaderParamSetup && filter.shaderParamSetup.bind(filter)
				);
				filter._builtShader = targetShader;
				targetShader._name = filter.toString();
			} catch (e) {
				console && console.log("SHADER SWITCH FAILURE", e);
			}
		}
		return targetShader;
	};

	/**
	 * See {{#crossLink "releaseTexture"}}{{/crossLink}} for the new API
	 * @deprecated clearImageTexture
	 **/

	/**
	 * Returns a base texture that has no image or data loaded. Not intended for loading images.
	 * May return null in some error cases, trying to use a "null" texture can cause renders to fail.
	 * @method getBaseTexture
	 * @param  {uint} w The width of the texture, defaults to 1
	 * @param  {uint} h The height of the texture, defaults to 1
	 **/
	p.getBaseTexture = function(w, h) {
		var width = Math.ceil(w>0?w:1) || 1;
		var height = Math.ceil(h>0?h:1) || 1;

		var gl = this._webGLContext;
		var texture = gl.createTexture();
		this.resizeTexture(texture, width, height);
		this.setTextureParams(gl, false);
		return texture;
	};

	/**
	 * Resizes a supplied texture element
	 * May return null in some error cases, texture too large, out of texture memory, etc trying to use a "null" texture can cause renders to fail.
	 * NOTE: must have been made with "texImage2D", all default APIs in StageGL use this so this only matters for changes.
	 * @method getBaseTexture
	 * @param  {WebGLTexture} texture The GL Texture to be modified.
	 * @param  {uint} width The width of the texture, defaults to 1
	 * @param  {uint} height The height of the texture, defaults to 1
	 **/
	p.resizeTexture = function(texture, width,height) {
		var gl = this._webGLContext;
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(
			gl.TEXTURE_2D,				// target
			0,							// level of detail
			gl.RGBA,					// internal format
			width, height, 0,			// width, height, border (only for array/null sourced textures)
			gl.RGBA,					// format (match internal format)
			gl.UNSIGNED_BYTE,			// type of texture(pixel color depth)
			null						// image data, we can do null because we're doing array data
		);
		texture.width = width;
		texture.height = height;
	};

	/**
	 * Returns a base texture (see getBaseTexture) with an attached render buffer in texture._frameBuffer
	 * @method getRenderBufferTexture
	 * @param  {Number} w The width of the texture
	 * @param  {Number} h The height of the texture
	 * @return {Texture} the basic texture instance with a render buffer property.
	 **/
	p.getRenderBufferTexture = function(w, h) {
		var gl = this._webGLContext;

		// get the texture
		var renderTexture = this.getBaseTexture(w, h);
		if(!renderTexture){ return null; }

		// get the frame buffer
		var frameBuffer = gl.createFramebuffer();
		if(!renderTexture){ return null; }

		// set its width and height for spoofing as an image
		renderTexture.width = w;
		renderTexture.height = h;

		// attach frame buffer to texture and provide cross links to look up each other
		gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, renderTexture, 0);
		frameBuffer._renderTexture = renderTexture;
		renderTexture._frameBuffer = frameBuffer;

		// flag as an un-stored texture, trying to store and maintain these would be complex due to
		// issues like them being swapped around, plus tracking them in stored textures hold no benefits
		renderTexture._storeID = -1;

		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		return renderTexture;
	};

	/**
	 * Common utility function used to apply the correct texture processing parameters for the bound texture.
	 * @param  {WebGLRenderingContext} gl
	 * @param  {Boolean} [isPOT = false] Marks whether the texture is "Power of Two", this may allow better quality.
	 * @method _fetchWebGLContext
	 * @protected
	 */
	p.setTextureParams = function(gl, isPOT) {
		if(isPOT && this._antialias) {
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		} else {
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		}
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	};

	/**
	 * Changes the webGL clear aka "background" color to the provided value.
	 * A transparent clear is recommended, non transparent colours may create undesired boxes.
	 * The clear color will also be used for filters and other "render textures".
	 * The stage background will ignore the transparency value and display solid color.
	 * For the stage to recognize transparency it must be created with the transparent flag set to true.
	 * Using "transparent white" to demonstrate, the valid data formats are as follows:
	 * <ul>
	 *     <li>"#FFF"</li>
	 *     <li>"#FFFFFF"</li>
	 *     <li>"#FFFFFF00"</li>
	 *     <li>"rgba(255,255,255,0.0)"</li>
	 *     <li>0xFFFFFF00</li>
	 * @method setClearColor
	 * @param {String|uint} [color = 0x00000000] The new colour to use as the background
	 */
	p.setClearColor = function(color) {
		var r, g, b, a, output;

		if(typeof color == "string") {
			if(color.indexOf("#") == 0) {
				if(color.length == 4){
					color = "#" + color.charAt(1)+color.charAt(1) + color.charAt(2)+color.charAt(2) + color.charAt(3)+color.charAt(3)
				}
				r = Number("0x"+color.slice(1, 3))/255;
				g = Number("0x"+color.slice(3, 5))/255;
				b = Number("0x"+color.slice(5, 7))/255;
				a = Number("0x"+color.slice(7, 9))/255;
			} else if(color.indexOf("rgba(") == 0) {
				output = color.slice(5, -1).explode(",");
				r = Number(output[0])/255;
				g = Number(output[1])/255;
				b = Number(output[2])/255;
				a = Number(output[3]);
			}
		} else {	// >>> is an unsigned shift which is what we want as 0x80000000 and up are negative values
			r = ((color & 0xFF000000) >>> 24)/255;
			g = ((color & 0x00FF0000) >>> 16)/255;
			b = ((color & 0x0000FF00) >>> 8)/255;
			a = (color & 0x000000FF)/255;
		}

		this._clearColor.r = r || 0;
		this._clearColor.g = g || 0;
		this._clearColor.b = b || 0;
		this._clearColor.a = a || 0;

		if(!this._webGLContext) { return; }
		this._webGLContext.clearColor(this._clearColor.r, this._clearColor.g, this._clearColor.b, this._clearColor.a);
	};

	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 **/
	p.toString = function() {
		return "[StageGL (name="+  this.name +")]";
	};

// private methods:
	/**
	 * Sets up and returns the WebGL context for the canvas.
	 * @param  {Canvas} canvas The DOM canvas element to attach to
	 * @param  {Object} options The options to be handed into the WebGL object, see WebGL spec
	 * @method _fetchWebGLContext
	 * @protected
	 */
	p._fetchWebGLContext = function(canvas, options) {
		var gl;

		try {
			gl = canvas.getContext("webgl", options) || canvas.getContext("experimental-webgl", options);
		} catch (e) {
			// don't do anything in catch, null check will handle it
		}

		if (!gl) {
			var msg = "Could not initialize WebGL";
			console.error?console.error(msg):console.log(msg);
		} else {
			gl.viewportWidth = canvas.width;
			gl.viewportHeight = canvas.height;
		}

		return gl;
	};

	/**
	 * Create the completed Shader Program from the vertex and fragment shaders. Allows building of custom shaders for filters.
	 * Once compiled shaders are saved so if the Shader code is dynamic re-run this function when it needs to change.
	 * @param  {WebGLRenderingContext} gl
	 * @param  {String} [shaderName="regular"] Working values: "regular", "override", and "filter". Which type of shader to build.
	 * Filter and override both accept the custom params. Regular and override have all features. Filter is a special case reduced feature shader meant to be over-ridden.
	 * @param  {String} [customVTX=undefined] Extra vertex shader information to replace a regular draw, see {{#crossLink "COVER_VERTEX_BODY"}}{{/crossLink}} for default and {{#crossLink "Filter"}}{{/crossLink}} for examples.
	 * @param  {String} [customFRAG=undefined] Extra fragment shader information to replace a regular draw, see {{#crossLink "COVER_FRAGMENT_BODY"}}{{/crossLink}} for default and {{#crossLink "Filter"}}{{/crossLink}} for examples.
	 * @param  {Function} [shaderParamSetup=undefined] Function to run so custom shader parameters can get applied for the render.
	 * @method _fetchShaderProgram
	 * @protected
	 */
	p._fetchShaderProgram = function(gl, shaderName, customVTX, customFRAG, shaderParamSetup) {
		gl.useProgram(null);		// safety to avoid collisions

		// build the correct shader string out of the right headers and bodies
		var targetFrag, targetVtx;
		switch(shaderName) {
			case "filter":
				targetVtx = StageGL.COVER_VERTEX_HEADER;
				targetFrag = StageGL.COVER_FRAGMENT_HEADER;
				targetVtx += customVTX || StageGL.COVER_VERTEX_BODY;
				targetFrag += customFRAG || StageGL.COVER_FRAGMENT_BODY;
				break;
			case "particle":
				targetVtx = StageGL.REGULAR_VERTEX_HEADER;
				targetFrag = StageGL.REGULAR_FRAGMENT_HEADER;
				targetVtx += StageGL.PARTICLE_VERTEX_BODY;
				targetFrag += StageGL.PARTICLE_FRAGMENT_BODY;
				break;
			case "override":
				targetVtx = StageGL.REGULAR_VERTEX_HEADER;
				targetFrag = StageGL.REGULAR_FRAGMENT_HEADER;
				targetVtx += customVTX || StageGL.REGULAR_VERTEX_BODY;
				targetFrag += customFRAG || StageGL.REGULAR_FRAGMENT_BODY;
				break;
			case "regular":
			default:
				targetVtx = StageGL.REGULAR_VERTEX_HEADER;
				targetFrag = StageGL.REGULAR_FRAGMENT_HEADER;
				targetVtx += StageGL.REGULAR_VERTEX_BODY;
				targetFrag += StageGL.REGULAR_FRAGMENT_BODY;
				break;
		}

		// create the separate vars
		var vertexShader = this._createShader(gl, gl.VERTEX_SHADER, targetVtx);
		var fragmentShader = this._createShader(gl, gl.FRAGMENT_SHADER, targetFrag);

		// link them together
		var shaderProgram = gl.createProgram();
		gl.attachShader(shaderProgram, vertexShader);
		gl.attachShader(shaderProgram, fragmentShader);
		gl.linkProgram(shaderProgram);
		shaderProgram._type = shaderName;

		// check compile status
		if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
			gl.useProgram(this._activeShader);
			throw gl.getProgramInfoLog(shaderProgram);
		}

		// set up the parameters on the shader
		gl.useProgram(shaderProgram);
		switch(shaderName) {
			case "filter":
				// get the places in memory the shader is stored so we can feed information into them
				// then save it off on the shader because it's so tied to the shader itself
				shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vertexPosition");
				gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

				shaderProgram.uvPositionAttribute = gl.getAttribLocation(shaderProgram, "uvPosition");
				gl.enableVertexAttribArray(shaderProgram.uvPositionAttribute);

				shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
				gl.uniform1i(shaderProgram.samplerUniform, 0);

				shaderProgram.uprightUniform = gl.getUniformLocation(shaderProgram, "uUpright");
				gl.uniform1f(shaderProgram.uprightUniform, 0);

				// if there's some custom attributes be sure to hook them up
				if(shaderParamSetup) {
					shaderParamSetup(gl, this, shaderProgram);
				}
				break;
			case "override":
			case "particle":
			case "regular":
			default:
				// get the places in memory the shader is stored so we can feed information into them
				// then save it off on the shader because it's so tied to the shader itself
				shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vertexPosition");
				gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

				shaderProgram.uvPositionAttribute = gl.getAttribLocation(shaderProgram, "uvPosition");
				gl.enableVertexAttribArray(shaderProgram.uvPositionAttribute);

				shaderProgram.textureIndexAttribute = gl.getAttribLocation(shaderProgram, "textureIndex");
				gl.enableVertexAttribArray(shaderProgram.textureIndexAttribute);

				shaderProgram.alphaAttribute = gl.getAttribLocation(shaderProgram, "objectAlpha");
				gl.enableVertexAttribArray(shaderProgram.alphaAttribute);

				var samplers = [];
				for(var i = 0; i < this._batchTextureCount; i++) {
					samplers[i] = i;
				}

				shaderProgram.samplerData = samplers;
				shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
				gl.uniform1iv(shaderProgram.samplerUniform, samplers);

				shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "pMatrix");
				break;
		}

		gl.useProgram(this._activeShader);
		return shaderProgram;
	};

	/**
	 * Creates a shader from the specified string. Replaces several template items marked with {{name}}.
	 * @method _createShader
	 * @param  {WebGLRenderingContext} gl
	 * @param  {Number} type The type of shader to create. gl.VERTEX_SHADER | gl.FRAGMENT_SHADER
	 * @param  {String} str The definition for the shader.
	 * @return {WebGLShader}
	 * @protected
	 **/
	p._createShader = function(gl, type, str) {
		// inject the static number
		str = str.replace("{{count}}", this._batchTextureCount);

		// resolve issue with no dynamic samplers by creating correct samplers in if else chain
		var insert = "";
		for(var i=1; i<this._batchTextureCount; i++) {
			insert += "} else if(src == "+ i +") { color = texture2D(uSampler["+ i +"], vTextureCoord);";
		}
		str = str.replace("{{alternates}}", insert);

		str = str.replace("{{premultiply}}", this._premultiply?"/color.a":"");

		// actually compile the shader
		var shader = gl.createShader(type);
		gl.shaderSource(shader, str);
		gl.compileShader(shader);

		// check compile status
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			throw gl.getShaderInfoLog(shader);
		}

		return shader;
	};

	/**
	 * Sets up the necessary vertex property buffers including position and u/v.
	 * @method _createBuffers
	 * @param {WebGLRenderingContext} gl
	 * @protected
	 **/
	p._createBuffers = function(gl) {
		var groupCount = this._maxCardsPerBatch * StageGL.INDICIES_PER_CARD;
		var groupSize, i;

		// INFO:
		// all buffers are created using this pattern
		// create a WebGL buffer
		// attach it to context
		// figure out how many parts it has to an entry
		// fill it with empty data to reserve the memory
		// attach the empty data to the GPU
		// track the sizes on the buffer object

		// INFO:
		// a single buffer may be optimal in some situations and would be approached like this
		// currently not implemented due to lack of need and potential complications with drawCover

		// var vertexBuffer = this._vertexBuffer = gl.createBuffer();
		// gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		// groupSize = 2 + 2 + 1 + 1; //x/y, u/v, index, alpha
		// var vertexData = this._vertexData = new Float32Array(groupCount * groupSize);
		// for(i=0; i<vertexData.length; i+=groupSize) {
		// 	vertexData[i+0] = vertexData[i+1] = 0;
		// 	vertexData[i+2] = vertexData[i+3] = 0.5;
		// 	vertexData[i+4] = 0;
		// 	vertexData[i+5] = 1;
		// }
		// vertexBuffer.itemSize = groupSize;
		// vertexBuffer.numItems = groupCount;
		// TODO bechmark and test using unified buffer

		// the actual position information
		var vertexPositionBuffer = this._vertexPositionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
		groupSize = 2;
		var vertices = this._vertices = new Float32Array(groupCount * groupSize);
		for(i=0; i<vertices.length; i+=groupSize) { vertices[i+0] = vertices[i+1] = 0; }
		gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);
		vertexPositionBuffer.itemSize = groupSize;
		vertexPositionBuffer.numItems = groupCount;

		// where on the texture it gets its information
		var uvPositionBuffer = this._uvPositionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, uvPositionBuffer);
		groupSize = 2;
		var uvs = this._uvs = new Float32Array(groupCount * groupSize);
		for(i=0; i<uvs.length; i+=groupSize) { uvs[i+0] = uvs[i+1] = 0; }
		gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.DYNAMIC_DRAW);
		uvPositionBuffer.itemSize = groupSize;
		uvPositionBuffer.numItems = groupCount;

		// what texture it should use
		var textureIndexBuffer = this._textureIndexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, textureIndexBuffer);
		groupSize = 1;
		var indecies = this._indices = new Float32Array(groupCount * groupSize);
		for(i=0; i<indecies.length; i++) { indecies[i] = 0; }
		gl.bufferData(gl.ARRAY_BUFFER, indecies, gl.DYNAMIC_DRAW);
		textureIndexBuffer.itemSize = groupSize;
		textureIndexBuffer.numItems = groupCount;

		// what alpha it should have
		var alphaBuffer = this._alphaBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, alphaBuffer);
		groupSize = 1;
		var alphas = this._alphas = new Float32Array(groupCount * groupSize);
		for(i=0; i<alphas.length; i++) { alphas[i] = 1; }
		gl.bufferData(gl.ARRAY_BUFFER, alphas, gl.DYNAMIC_DRAW);
		alphaBuffer.itemSize = groupSize;
		alphaBuffer.numItems = groupCount;
	};

	/**
	 * Do all the setup work for textures in the system.
	 * @method _initTextures
	 * @protected
	 */
	p._initTextures = function() {
		//TODO: DHG: add a cleanup routine in here in case this happens mid stream

		// reset counters
		this._lastTextureInsert = -1;

		// clear containers
		this._textureDictionary = [];
		this._textureIDs = {};
		this._baseTextures = [];
		this._batchTextures = [];

		// fill in blanks as it helps the renderer be stable while textures are loading and reduces need for safety code
		for(var i=0; i<this._batchTextureCount;i++) {
			this._baseTextures[i] = this.getBaseTexture();
			this._batchTextures[i] = this._baseTextures[i];
			if(!this._batchTextures[i]) {
				throw "Problems creating basic textures, known causes include using too much VRAM by not releasing WebGL texture instances";
			}
		}
	};

	/**
	 * Load a specific texture, accounting for potential delay as it might not be preloaded
	 * @method _loadTextureImage
	 * @param {WebGLRenderingContext} gl
	 * @param {Image} image Actual image to be loaded
	 * @protected
	 */
	p._loadTextureImage = function(gl, image) {
		var src = image.src;

		if(!src){
			// one time canvas property setup
			image._isCanvas = true;
			src = image.src = "canvas_" + this._lastTrackedCanvas++;
		}

		// put the texture into our storage system
		var storeID = this._textureIDs[src];
		if(storeID === undefined) {
			storeID = this._textureIDs[src] = this._textureDictionary.length;
		}
		if(this._textureDictionary[storeID] === undefined){
			this._textureDictionary[storeID] = this.getBaseTexture();
		}

		var texture = this._textureDictionary[storeID];

		if(texture) {
			// get texture params all set up
			texture._batchID = this._batchID;
			texture._storeID = storeID;
			texture._imageData = image;
			this._insertTextureInBatch(gl, texture);
	
			// get the data into the texture or wait for it to load
			image._storeID = storeID;
			if(image.complete || image.naturalWidth || image._isCanvas) {		// is it already loaded
				this._updateTextureImageData(gl, image);
			} else  {
				//image.onload = this._updateTextureImageData.bind(this, gl, image);										//TODO: DHG: EventListener instead of callback
				image.addEventListener("load", this._updateTextureImageData.bind(this, gl, image));
			}
		} else {
			// we really really should have a texture, try to recover the error by using a saved empty texture so we don't crash
			if(console.error) {
				console.error("Problems creating basic textures, known causes include using too much VRAM by not releasing WebGL texture instances");
			} else {
				console.log("Problems creating basic textures, known causes include using too much VRAM by not releasing WebGL texture instances");
			}
			texture = this._baseTextures[0];
			texture._batchID = this._batchID;
			texture._storeID = -1;
			texture._imageData = texture;
			this._insertTextureInBatch(gl, texture);
		}

		return texture;
	};

	/**
	 * Necessary to upload the actual image data to the GPU. Without this the texture will be blank.
	 * @param {WebGLRenderingContext} gl
	 * @param {Image | Canvas} image The image data to be uploaded
	 * @method _updateTextureImageData
	 */
	p._updateTextureImageData = function(gl, image) {
		// the bitwise & is intentional, cheap exponent 2 check
		var isNPOT = (image.width & image.width-1) || (image.height & image.height-1);
		var texture = this._textureDictionary[image._storeID];

		gl.activeTexture(gl.TEXTURE0 + texture._activeIndex);
		gl.bindTexture(gl.TEXTURE_2D, texture);

		texture.isPOT = !isNPOT;
		this.setTextureParams(gl, texture.isPOT);

		try{
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
		} catch(e) {
			var errString = "\nAn error has occurred. This is most likely due to security restrictions on WebGL images with local or cross-domain origins";
			if(console.error) {
				console.error(e, errString);
			} else {
				console && console.log(e, errString);
			}
		}

		image._invalid = false;

		texture._w = image.width;
		texture._h = image.height;

		if(this.vocalDebug) {
			if(isNPOT) {
				console.warn("NPOT(Non Power of Two) Texture: "+ image.src);
			}
			if(image.width > gl.MAX_TEXTURE_SIZE || image.height > gl.MAX_TEXTURE_SIZE){
				console && console.error("Oversized Texture: "+ image.width+"x"+image.height +" vs "+ gl.MAX_TEXTURE_SIZE +"max");
			}
		}
	};

	/**
	 * Adds the texture to a spot in the current batch, forcing a draw if no spots are free.
	 * @method _insertTextureInBatch
	 * @param {WebGLRenderingContext} gl The canvas WebGL context object to draw into.
	 * @param {WebGLTexture} gl The canvas WebGL context object to draw into.
	 * @protected
	 */
	p._insertTextureInBatch = function(gl, texture) {
		// if it wasn't used last batch
		if(this._batchTextures[texture._activeIndex] !== texture) {
			// we've got to find it a a spot.
			var found = -1;
			var start = (this._lastTextureInsert+1) % this._batchTextureCount;
			var look = start;
			do {
				if(this._batchTextures[look]._batchID != this._batchID && !this._slotBlacklist[look]) {
					found = look;
					break;
				}
				look = (look+1) % this._batchTextureCount;
			} while(look !== start);

			// we couldn't find anywhere for it go, meaning we're maxed out
			if(found === -1) {
				this.batchReason = "textureOverflow";
				this._drawBuffers(gl);		// <------------------------------------------------------------------------
				this.batchCardCount = 0;
				found = start;
			}

			// lets put it into that spot
			this._batchTextures[found] = texture;
			texture._activeIndex = found;
			var image = texture._imageData;
			if(image && image._invalid && texture._drawID !== undefined) {
				this._updateTextureImageData(gl, image);
			} else {
				gl.activeTexture(gl.TEXTURE0 + found);
				gl.bindTexture(gl.TEXTURE_2D, texture);
				this.setTextureParams(gl);
			}
			this._lastTextureInsert = found;
		} else {
			var image = texture._imageData;
			if(texture._storeID != -1 && image._invalid) {
				this._updateTextureImageData(gl, image);
			}
		}

		texture._drawID = this._drawID;
		texture._batchID = this._batchID;
	};

	/**
	 * Actually make sure the texture handed into the function is removed and cleaned
	 * @method _killTextureObject
	 * @param {Texture} tex The texture to be cleaned out
	 */
	p._killTextureObject = function(tex) {
		if(!tex){ return; }

		// remove linkage
		if(tex._storeID !== undefined && tex._storeID >= 0) {
			this._textureDictionary[tex._storeID] = undefined;
			for(var n in this._textureIDs) {
				if(this._textureIDs[n] == tex._storeID) { delete this._textureIDs[n]; }
			}
			tex._storeID = undefined;
		}

		// make sure to drop it out of an active slot
		if(tex._activeIndex !== undefined && this._batchTextures[tex._activeIndex] === tex) {
			this._batchTextures[tex._activeIndex] = this._baseTextures[tex._activeIndex];
		}

		// remove buffers if present
		try{
			if(tex._frameBuffer){ gl.deleteFramebuffer(tex._frameBuffer); }
			tex._frameBuffer = undefined;
		} catch(e) { /* suppress delete errors because it's already gone or didn't need deleting probably */ }

		// remove entry
		try{
			gl.deleteTexture(tex);
		} catch(e) { /* suppress delete errors because it's already gone or didn't need deleting probably */ }
	};

	/**
	 * Store or restore current batch textures into a backup array
	 * @param {Boolean} restore Perform a restore instead of a store.
	 * @param {Array} [target=this._backupTextures] Where to perform the back, defaults to internal backup.
	 * @method _backupBatchTextures
	 */
	p._backupBatchTextures = function(restore, target) {
		var gl = this._webGLContext;

		if(!this._backupTextures){ this._backupTextures = []; }
		if(target === undefined) { target = this._backupTextures; }

		for(var j=0; j<this._batchTextureCount;j++) {
			gl.activeTexture(gl.TEXTURE0 + j);
			if(restore) {
				this._batchTextures[j] = target[j];
			} else {
				target[j] = this._batchTextures[j];
				this._batchTextures[j] = this._baseTextures[j];
			}
			gl.bindTexture(gl.TEXTURE_2D, this._batchTextures[j]);
			this.setTextureParams(gl, this._batchTextures[j].isPOT);
		}

		if(restore && target === this._backupTextures){ this._backupTextures = []; }
	};

	/**
	 * Begin the drawing process for a regular render.
	 * @param {WebGLRenderingContext} gl
	 * @param {Stage || Container} sceneGraph {{#crossLink "Container"))((/crossLink}} object with all that needs to rendered, preferably a stage
	 * @param {WebGLRenderingContext} ignoreCache
	 * @method _batchDraw
	 */
	p._batchDraw = function(sceneGraph, gl, ignoreCache) {
		if(this._isDrawing > 0) {
			this._drawBuffers(gl);
		}
		this._isDrawing++;
		this._drawID++;

		this.batchCardCount = 0;
		this.depth = 0;

		var mtx = new createjs.Matrix2D();
		this._appendToBatchGroup(sceneGraph, gl, mtx, this.alpha, ignoreCache);											//TODO: DHG: isn't there a global alpha or something?

		this.batchReason = "drawFinish";
		this._drawBuffers(gl);								// <--------------------------------------------------------
		this._isDrawing--;
	};

	/**
	 * Implicitly there are 4 modes to this function: filteredSameContext, filteredUniqueContext, sameContext, uniqueContext.
	 * Each situation must be handled slightly differently as uniqueContext or sameContext define how the output works,
	 * one drawing directly into the main context and the other drawing into a stored renderTexture respectively.
	 * When the draw is a filtered draw the filters are applied sequentially in order to draw into saved textures repeatedly.
	 * Once the final filter is up the final output is treated depending upon whether it is a same or unique context.
	 * The internal complexity comes from sahring information, and issues like textures needing to be flipped sometimes when written to render textures.
	 * @method _cacheDraw
	 * @param {DisplayObject} target The object we're drawing into cache.
	 * For example, used for drawing the cache (to prevent it from simply drawing an existing cache back
	 * into itself).
	 * @param {Array} filters The filters we're drawing into cache.
	 * @param {CacheManager} manager The CacheManager instance looking after the cache
	 * @return {Boolean} Was the draw handled by this function
	 **/
	p._cacheDraw = function(gl, target, filters, manager) {
		var gl = this._webGLContext;
		var renderTexture;
		var shaderBackup = this._activeShader;
		var blackListBackup = this._slotBlacklist;
		var lastTextureSlot = this._maxTextureSlots-1;
		var wBackup = this._viewportWidth, hBackup = this._viewportHeight;

		// protect the last slot so that we have somewhere to bind the renderTextures so it doesn't get upset
		this.protectTextureSlot(lastTextureSlot, true);

		// create offset container for drawing item
		var mtx = target.getMatrix();
		mtx = mtx.clone();
		mtx.scale(1/manager.scale, 1/manager.scale);
		mtx = mtx.invert();
		mtx.translate(-manager.offX/manager.scale, -manager.offY/manager.scale);
		var container = this._cacheContainer;
		container.children = [target];
		container.transformMatrix = mtx;

		this._backupBatchTextures(false);

		var filterCount = filters && filters.length;
		if(filterCount) {
			//this._backupBatchTextures(false);
			this._drawFilters(target, filters, manager);
			//this._backupBatchTextures(true);
		} else {
			// is this for another stage or mine?
			if(this.isCacheControlled) {
				// draw item to canvas				I -> C
				gl.clear(gl.COLOR_BUFFER_BIT);
				this._batchDraw(container, gl, true);
			} else {
				//this._backupBatchTextures(false);
				gl.activeTexture(gl.TEXTURE0 + lastTextureSlot);
				target.cacheCanvas = this.getTargetRenderTexture(target, manager._drawWidth, manager._drawHeight);
				renderTexture = target.cacheCanvas;

				// draw item to render texture		I -> T
				gl.bindFramebuffer(gl.FRAMEBUFFER, renderTexture._frameBuffer);
				this.updateViewport(manager._drawWidth, manager._drawHeight);
				this._projectionMatrix = this._projectionMatrixFlip;
				gl.clear(gl.COLOR_BUFFER_BIT);
				this._batchDraw(container, gl, true);

				gl.bindFramebuffer(gl.FRAMEBUFFER, null);
				this.updateViewport(wBackup, hBackup);
				//this._backupBatchTextures(true);
			}
		}

		this._backupBatchTextures(true);

		this.protectTextureSlot(lastTextureSlot, false);
		this._activeShader = shaderBackup;
		this._slotBlacklist = blackListBackup;
	};

	p._drawFilters = function(target, filters, manager) {
		var gl = this._webGLContext;
		var renderTexture;
		var lastTextureSlot = this._maxTextureSlots-1;//this._batchTextureCount-1;
		var wBackup = this._viewportWidth, hBackup = this._viewportHeight;

		var container = this._cacheContainer;
		var filterCount = filters && filters.length;

		// we don't know which texture slot we're dealing with previously and we need one out of the way
		// once we're using that slot activate it so when we make and bind our RenderTexture it's safe there
		gl.activeTexture(gl.TEXTURE0 + lastTextureSlot);
		renderTexture = this.getTargetRenderTexture(target, manager._drawWidth, manager._drawHeight);

		// draw item to render texture		I -> T
		gl.bindFramebuffer(gl.FRAMEBUFFER, renderTexture._frameBuffer);
		this.updateViewport(manager._drawWidth, manager._drawHeight);
		gl.clear(gl.COLOR_BUFFER_BIT);
		this._batchDraw(container, gl, true);

		// bind the result texture to slot 0 as all filters and cover draws assume original content is in slot 0
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, renderTexture);
		this.setTextureParams(gl);

		var flipY = false;

		// apply each filter in order, but remember to toggle used texture and render buffer
		for(var i=0; i<filterCount; i++) {
			var filter = filters[i];

			// swap to correct shader
			this._activeShader = this.getFilterShader(gl, filter);
			if(!this._activeShader) { continue; }

			// now the old result is stored in slot 0, make a new render texture
			gl.activeTexture(gl.TEXTURE0 + lastTextureSlot);
			renderTexture = this.getTargetRenderTexture(target, manager._drawWidth, manager._drawHeight);
			gl.bindFramebuffer(gl.FRAMEBUFFER, renderTexture._frameBuffer);

			// draw result to render texture	R -> T
			gl.viewport(0,0, manager._drawWidth, manager._drawHeight);
			gl.clear(gl.COLOR_BUFFER_BIT);
			this._drawCover(gl, flipY);

			// bind the result texture to slot 0 as all filters and cover draws assume original content is in slot 0
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, renderTexture);
			this.setTextureParams(gl);

			// use flipping to keep things upright, things already cancel out on a single filter
			if(filterCount > 1) {
				flipY = !flipY;
			}
		}

		// is this for another stage or mine
		if(this.isCacheControlled) {
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
			this.updateViewport(wBackup, hBackup);

			// draw result to canvas			R -> C
			this._activeShader = this.getFilterShader(gl, this);
			gl.clear(gl.COLOR_BUFFER_BIT);
			this._drawCover(gl, flipY);
		} else {
			//TODO: DHG: this is less than ideal a flipped inital render for this circumstance might help, adjust the perspective matrix?
			if(flipY) {
				gl.activeTexture(gl.TEXTURE0 + lastTextureSlot);
				renderTexture = this.getTargetRenderTexture(target, manager._drawWidth, manager._drawHeight);
				gl.bindFramebuffer(gl.FRAMEBUFFER, renderTexture._frameBuffer);

				this._activeShader = this.getFilterShader(gl, this);
				gl.viewport(0,0, manager._drawWidth, manager._drawHeight);
				gl.clear(gl.COLOR_BUFFER_BIT);
				this._drawCover(gl, !flipY);
			}
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
			this.updateViewport(wBackup, hBackup);

			// make sure the last texture is the active thing to draw
			target.cacheCanvas = renderTexture;
		}
	};

	/**
	 * Add all the contents of a container to the pending buffers, called recursively on each container.
	 * May trigger a draw if a buffer runs out of space.
	 * @param {Container} container The {{#crossLink "Container"))((/crossLink}} that contains everything to be drawn.
	 * @param {WebGLRenderingContext} gl
	 * @param {Matrix2D} concatMtx The effective (concatenated) position when beginning this container
	 * @param {Number} concatAlpha The effective (concatenated) alpha when beginning this container
	 * @param {Boolean} ignoreCache Don't use an element's cache during this draw
	 * @method _appendToBatchGroup
	 */
	p._appendToBatchGroup = function(container, gl, concatMtx, concatAlpha, ignoreCache) {
		// sort out shared properties
		if(!container._glMtx) { container._glMtx = new createjs.Matrix2D(); }
		var cMtx = container._glMtx;
		cMtx.copy(concatMtx);
		if(container.transformMatrix) {
			cMtx.appendMatrix(
				container.transformMatrix
			);
		} else {
			cMtx.appendTransform(
				container.x, container.y,
				container.scaleX, container.scaleY,
				container.rotation, container.skewX, container.skewY,
				container.regX, container.regY
			);
		}

		// sub components of figuring out the position an object holds
		var subL, subT, subR, subB;

		// actually apply its data to the buffers
		for(var i = 0, l = container.children.length; i < l; i++) {
			var item = container.children[i];

			if(!(item.visible && concatAlpha)) { continue; }
			if(!item.cacheCanvas || ignoreCache) {
				if(item.preGLRender) {
					item.preGLRender(this);
				}
				if(item.children) {
					this._appendToBatchGroup(item, gl, cMtx, item.alpha * concatAlpha);
					continue;
				}
			}

			// check for overflowing batch, if yes then force a render
			if(this.batchCardCount+1 > this._maxCardsPerBatch) {														//TODO: DHG: consider making this polygon count dependant for things like vector draws
				this.batchReason = "vertexOverflow";
				this._drawBuffers(gl);					// <------------------------------------------------------------
				this.batchCardCount = 0;
			}

			// keep track of concatenated position
			if(!item._glMtx) { item._glMtx = new createjs.Matrix2D(); }
			var iMtx = item._glMtx;
			iMtx.copy(cMtx);
			if(item.transformMatrix) {
				iMtx.appendMatrix(
					item.transformMatrix
				);
			} else {
				iMtx.appendTransform(
					item.x, item.y,
					item.scaleX, item.scaleY,
					item.rotation, item.skewX, item.skewY,
					item.regX, item.regY
				);
			}

			var uvRect, texIndex, image, frame, texture;

			if(item._webGLRenderStyle === 2 || (item.cacheCanvas && !ignoreCache)) {			// BITMAP / Cached Canvas
				image = (ignoreCache?false:item.cacheCanvas) || item.image;
			} else if(item._webGLRenderStyle === 1) {											// SPRITE
				frame = item.spriteSheet.getFrame(item.currentFrame);	//TODO: Faster way?
				image = frame.image;
			} else {																			// MISC (DOM objects render themselves later)
				continue;
			}

			var uvs = this._uvs;
			var vertices = this._vertices;
			var texI = this._indices;
			var alphas = this._alphas;

			// calculate texture
			if(!image){ continue; }
			if(image._storeID === undefined) {
				// this texture is new to us so load it and add it to the batch
				texture = this._loadTextureImage(gl, image);
				this._insertTextureInBatch(gl, texture);
			} else {
				// fetch the texture
				if(image._storeID < 0) {
					// if it isn't a stored texture it's a render texture so the image object is the texture
					texture = image;
				} else {
					texture = this._textureDictionary[image._storeID];
				}
				// put it in the batch if needed
				if(texture._batchID !== this._batchID) {
					this._insertTextureInBatch(gl, texture);
				}
			}
			texIndex = texture._activeIndex;

			if(item._webGLRenderStyle === 2 || (item.cacheCanvas && !ignoreCache)) {			// BITMAP / Cached Canvas
				if(item.sourceRect) {
					// calculate uvs
					if(!item._uvRect) { item._uvRect = {}; }
					var src = item.sourceRect;
					uvRect = item._uvRect;
					uvRect.t = (src.x)/image.width;
					uvRect.l = (src.y)/image.height;
					uvRect.b = (src.x + src.width)/image.width;
					uvRect.r = (src.y + src.height)/image.height;

					// calculate vertices
					subL = 0;									subT = 0;
					subR = src.width+subL;						subB = src.height+subT;
				} else {
					// calculate uvs
					// calculate vertices
					if(item.cacheCanvas) {
						uvRect = StageGL.UV_RECT;
						subL = item._cacheOffsetX;				subT = item._cacheOffsetY;
					} else {
						uvRect = StageGL.UV_RECT;
						subL = 0;								subT = 0;
					}
					subR = image.width+subL;					subB = image.height+subT;
				}
			} else if(item._webGLRenderStyle === 1) {											// SPRITE
				var rect = frame.rect;

				// calculate uvs
				uvRect = frame.uvRect;
				if(!uvRect) {
					uvRect = StageGL.buildUVRects(item.spriteSheet, item.currentFrame, false);
				}

				// calculate vertices
				subL = -frame.regX;								subT = -frame.regY;
				subR = rect.width-frame.regX;					subB = rect.height-frame.regY;
			}

			// These must be calculated here else a forced draw might happen after they're set
			var offV1 = this.batchCardCount*StageGL.INDICIES_PER_CARD;		// offset for 1 component vectors
			var offV2 = offV1*2;											// offset for 2 component vectors

			//DHG: See Matrix2D.transformPoint for why this math specifically
			// apply vertices
			vertices[offV2] =		subL *iMtx.a + subT *iMtx.c +iMtx.tx;		vertices[offV2+1] =		subL *iMtx.b + subT *iMtx.d +iMtx.ty;
			vertices[offV2+2] =		subL *iMtx.a + subB *iMtx.c +iMtx.tx;		vertices[offV2+3] =		subL *iMtx.b + subB *iMtx.d +iMtx.ty;
			vertices[offV2+4] =		subR *iMtx.a + subT *iMtx.c +iMtx.tx;		vertices[offV2+5] =		subR *iMtx.b + subT *iMtx.d +iMtx.ty;
			vertices[offV2+6] =		vertices[offV2+2];							vertices[offV2+7] =		vertices[offV2+3];
			vertices[offV2+8] =		vertices[offV2+4];							vertices[offV2+9] =		vertices[offV2+5];
			vertices[offV2+10] =	subR *iMtx.a + subB *iMtx.c +iMtx.tx;		vertices[offV2+11] =	subR *iMtx.b + subB *iMtx.d +iMtx.ty;

			// apply uvs
			uvs[offV2] =	uvRect.l;			uvs[offV2+1] =	uvRect.t;
			uvs[offV2+2] =	uvRect.l;			uvs[offV2+3] =	uvRect.b;
			uvs[offV2+4] =	uvRect.r;			uvs[offV2+5] =	uvRect.t;
			uvs[offV2+6] =	uvRect.l;			uvs[offV2+7] =	uvRect.b;
			uvs[offV2+8] =	uvRect.r;			uvs[offV2+9] =	uvRect.t;
			uvs[offV2+10] =	uvRect.r;			uvs[offV2+11] =	uvRect.b;

			// apply texture
			texI[offV1] = texI[offV1+1] = texI[offV1+2] = texI[offV1+3] = texI[offV1+4] = texI[offV1+5] = texIndex;

			// apply alpha
			alphas[offV1] = alphas[offV1+1] = alphas[offV1+2] = alphas[offV1+3] = alphas[offV1+4] = alphas[offV1+5] = item.alpha * concatAlpha;

			this.batchCardCount++;
		}
	};

	/**
	 * Draws all the currently defined cards in the buffer to the render surface.
	 * @method _drawBuffers
	 * @param {WebGLRenderingContext} gl The canvas WebGL context object to draw into.
	 * @protected
	 **/
	p._drawBuffers = function(gl) {
		if(this.batchCardCount <= 0) { return; }	// prevents error spam on stages filled with unrenederable content.

		if(this.vocalDebug) {
			console.log("Draw["+ this._drawID +":"+ this._batchID +"] : "+ this.batchReason);
		}
		var shaderProgram = this._activeShader;
		var vertexPositionBuffer = this._vertexPositionBuffer;
		var textureIndexBuffer = this._textureIndexBuffer;
		var uvPositionBuffer = this._uvPositionBuffer;
		var alphaBuffer = this._alphaBuffer;

		gl.useProgram(shaderProgram);

		gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, this._vertices);

		gl.bindBuffer(gl.ARRAY_BUFFER, textureIndexBuffer);
		gl.vertexAttribPointer(shaderProgram.textureIndexAttribute, textureIndexBuffer.itemSize, gl.FLOAT, false, 0, 0);
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, this._indices);

		gl.bindBuffer(gl.ARRAY_BUFFER, uvPositionBuffer);
		gl.vertexAttribPointer(shaderProgram.uvPositionAttribute, uvPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, this._uvs);

		gl.bindBuffer(gl.ARRAY_BUFFER, alphaBuffer);
		gl.vertexAttribPointer(shaderProgram.alphaAttribute, alphaBuffer.itemSize, gl.FLOAT, false, 0, 0);
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, this._alphas);

		gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, gl.FALSE, this._projectionMatrix);

		for (var j = 0; j < this._batchTextureCount; j++) {
			var texture = this._batchTextures[j];
			gl.activeTexture(gl.TEXTURE0 + j);
			gl.bindTexture(gl.TEXTURE_2D, texture);
			this.setTextureParams(gl, texture.isPOT);
		}

		gl.drawArrays(gl.TRIANGLES, 0, this.batchCardCount*StageGL.INDICIES_PER_CARD);
		this._batchID++;
	};

	/**
	 * Draws a card that covers the entire render surface.
	 * @method _drawBuffers
	 * @param {WebGLRenderingContext} gl The canvas WebGL context object to draw into.
	 * @param {Boolean} flipY Covers are used for things like RenderTextures and because of 3D vs Canvas space this can end up meaning y sometimes requires flipping in the render
	 * @protected
	 **/
	p._drawCover = function(gl, flipY) {
		if(this._isDrawing > 0) {
			this._drawBuffers(gl);
		}

		if(this.vocalDebug) {
			console.log("Draw["+ this._drawID +":"+ this._batchID +"] : "+ "Cover");
		}
		var shaderProgram = this._activeShader;
		var vertexPositionBuffer = this._vertexPositionBuffer;
		var uvPositionBuffer = this._uvPositionBuffer;

		gl.clear(gl.COLOR_BUFFER_BIT);
		gl.useProgram(shaderProgram);

		gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, StageGL.COVER_VERT);
		gl.bindBuffer(gl.ARRAY_BUFFER, uvPositionBuffer);
		gl.vertexAttribPointer(shaderProgram.uvPositionAttribute, uvPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, flipY?StageGL.COVER_UV_FLIP:StageGL.COVER_UV);

		gl.uniform1i(shaderProgram.samplerUniform, 0);
		gl.uniform1f(shaderProgram.uprightUniform, flipY?0:1);

		gl.drawArrays(gl.TRIANGLES, 0, StageGL.INDICIES_PER_CARD);
	};

	// injected properties and methods:
	/*
	 * We need to modify other classes, do this during our class initialization
	 */
	(function _injectWebGLFunctionality() {
		//TODO: maybe re-examine this approach?
		// Set which classes are compatible with StageGL. The order is important!!!
		// Reflect any changes to the drawing loop
		var candidates = [createjs.Sprite, createjs.Bitmap];
		candidates.forEach(function(_class, index) {
			_class.prototype._webGLRenderStyle = index + 1;
		});

		var cm = createjs.CacheManager.prototype;
		/**
		 * Functionality injected to {{#crossLink "CacheManager"}}{{/crossLink}}. Ensure StageGL is loaded after all other
		 * standard EaselJS classes are loaded but before making any DisplayObject instances for injection to take full effect.
		 * Replaces the context2D cache draw with the option for WebGL or context2D drawing.
		 * If options is set to "true" a StageGL is created and contained on the object for use when rendering a cache.
		 * If options is a StageGL instance it will not create an instance but use the one provided.
		 * If possible it is best to provide the StageGL instance that is a parent to this DisplayObject for performance reasons.
		 * A StageGL cache does not infer the ability to draw objects a StageGL cannot currently draw,
		 * i.e. do not use a WebGL context cacge when caching a Shape, Text, etc.
		 * <h4>Example</h4>
		 * Using WebGL cache with a 2d context:
		 *      var stage = new createjs.Stage();
		 *      var bmp = new createjs.Bitmap(src);
		 *      bmp.cache(0, 0, bmp.width, bmp.height, 1, true);        // no StageGL to use, so make one
		 *      var shp = new createjs.Shape();
		 *      shp.graphics.clear().fill("red").drawRect(0,0,20,20);
		 *      shp.cache(0, 0, 20, 20, 1);                             // cannot use WebGL cache
		 * <h4>Example</h4>
		 * Using WebGL cache with a WebGL context:
		 *      var stage = new createjs.StageGL();
		 *      var bmp = new createjs.Bitmap(src);
		 *      bmp.cache(0, 0, bmp.width, bmp.height, 1, stage);       // use our StageGL to cache
		 *      var shp = new createjs.Shape();
		 *      shp.graphics.clear().fill("red").drawRect(0,0,20,20);
		 *      shp.cache(0, 0, 20, 20, 1);                             // cannot use WebGL cache
		 * You can make your own StageGL and have it render to a canvas if you set ".isCacheControlled" to true on your stage.
		 * You may wish to create your own StageGL instance to control factors like background color/transparency, AA, and etc.
		 * You must set "options" to its own stage if you wish to use the fast Render Textures available only to StageGLs.
		 * If you use WebGL cache on a container with Shapes you will have to cache each shape individually before the container,
		 * otherwise the WebGL cache will not render the shapes.
		 * @pubic
		 * @method DisplayObject.cache
		 * @param {Number} x The x coordinate origin for the cache region.
		 * @param {Number} y The y coordinate origin for the cache region.
		 * @param {Number} width The width of the cache region.
		 * @param {Number} height The height of the cache region.
		 * @param {Number} [scale=1] The scale at which the cache will be created. For example, if you cache a vector shape using
		 * 	myShape.cache(0,0,100,100,2) then the resulting cacheCanvas will be 200x200 px. This lets you scale and rotate
		 * 	cached elements with greater fidelity. Default is 1.
		 * @param {Boolean|StageGL} options Select whether to use context 2D, or WebGL rendering, and whether to make a new stage instance or use an existing one.
		 **/
		/** @this CacheManager */
		cm._updateSurfaceBASE = cm._updateSurface;
		cm._updateSurface = function() {
			if(!this._options) {
				this._updateSurfaceBASE();
				return;
			}

			// create it if it's missing
			if(!this._webGLCache) {
				if(this._options === true || this.target.getStage() !== this._options) {
					// a StageGL dedicated to this cache
					this.target.cacheCanvas = this.cacheCanvas = document.createElement("canvas");
					this._webGLCache = new createjs.StageGL(this.cacheCanvas, undefined, undefined, true);
					this._webGLCache.isCacheControlled = true;	// use this flag to control stage sizing and final output
				} else {
					// a StageGL re-used by this cache
					try{
						this.cacheCanvas = true;	// we'll replace this with a render texture during the draw as it changes per draw
						this._webGLCache = this._options;
					} catch(e) {
						throw "Invalid StageGL object used for cache param";
					}
				}
			}

			// now size render surfaces
			var stageGL = this._webGLCache;
			// if we have a dedicated stage we've gotta size it
			if(stageGL.isCacheControlled) {
				this.cacheCanvas.width = this._drawWidth;
				this.cacheCanvas.height = this._drawHeight;
				stageGL.updateViewport(this._drawWidth, this._drawHeight);
			}
			if(this.target.filters) {
				// with filters we can't tell how many we'll need but the most we'll ever need is two, so make them now
				stageGL.getTargetRenderTexture(this.target, this._drawWidth,this._drawHeight);
				stageGL.getTargetRenderTexture(this.target, this._drawWidth,this._drawHeight);
			} else {
				// without filters then we only need one RenderTexture, and that's only if its not a dedicated stage
				if(!stageGL.isCacheControlled) {
					stageGL.getTargetRenderTexture(this.target, this._drawWidth,this._drawHeight);
				}
			}
		};

		cm._drawToCacheBASE = cm._drawToCache;
		cm._drawToCache = function(compositeOperation) {
			var cacheCanvas = this.cacheCanvas;
			var target = this.target;
			var webGL = this._webGLCache;

			if(!webGL){
				this._drawToCacheBASE(compositeOperation);
				cacheCanvas._invalid = true;
				return;
			}

			//TODO: auto split blur into an x/y pass
			this._webGLCache.cacheDraw(target, target.filters, this);

			// we may of swapped around which element the
			cacheCanvas = target.cacheCanvas;
			this.cacheCanvas = cacheCanvas;

			cacheCanvas.width = this.width;
			cacheCanvas.height = this.height;
			cacheCanvas._invalid = true;
		};

		cm.uncacheBASE = cm.uncache;
		cm.uncache = function() {
			if(this._webGLCache) {
				// if it isn't cache controlled clean up after yourself
				if(!this._webGLCache.isCacheControlled) {
					if(this.__lastRT){ this.__lastRT = undefined; }
					if(this.__rtA){ this._webGLCache._killTextureObject(this.__rtA); }
					if(this.__rtB){ this._webGLCache._killTextureObject(this.__rtB); }
					if(this.cacheCanvas){ this._webGLCache._killTextureObject(this.cacheCanvas); }
				}
				// set the context to none and let the garbage collector get the rest
				this._webGLCache = false;
			} else {
				var stage = this.target.getStage();
				if(stage instanceof StageGL){ stage.releaseTexture(this.cacheCanvas); }
			}
			this.uncacheBASE();
		};

		/**
		 * Functionality injected to {{#crossLink "BitmapText"}}{{/crossLink}}. Ensure StageGL is loaded after all other
		 * standard EaselJS classes are loaded but before making any BitmapText instances for injection to take full effect.
		 * Part of a draw call to BitmapText is to re-create the text, without this process there is nothing or stale info to render.
		 * As StageGL does not call distinct draw calls per object we need to simulate that functionality with the preGLRender function.
		 * If you encounter a similar situation with a custom class simply add a preGLRender function to it and it will be detected and called.
		 * It is recommended to not add one if you you would have an empty function simply for optimizations sake.
		 *      (function() {
		 *          "use strict";
		 *          function NewClass() {
		 *              this.DisplayObject_constructor(canvas);
		 *          }
		 *          var p = createjs.extend(NewClass, createjs.DisplayObject);
		 *
		 *          p.preGLRender = function(stage) {
		 *              console.log("draw");
		 *          }
		 *
		 *          scope.NewClass = createjs.promote(NewClass, "DisplayObject");
		 *      }());
		 * @pubic
		 * @param {StageGL} stage The current stage instance that is drawing this object, may be useful.
		 * @method DisplayObject.preGLRender
		 **/
		var bt = createjs.BitmapText.prototype;
		bt.preGLRender = function(stage) {
			this._updateText();
		}
	})();

	createjs.StageGL = createjs.promote(StageGL, "Stage");
}());
