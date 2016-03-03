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
	 * A Sprite Stage is the root level {{#crossLink "Container"}}{{/crossLink}} for an webGL optimized display list. Each time its {{#crossLink "Stage/tick"}}{{/crossLink}}
	 * method is called, it will render its display list to its target canvas ignoring non webGL compatible Display Objects.
	 * On devices or browsers that don't support WebGL, content will automatically be rendered via canvas 2D.
	 *
	 * Complications:
	 *     - Only Sprite, Container, BitmapText, Bitmap, and DOMElement are rendered when added to the display list.
	  *    - To display something SpriteStage cannot normally render, cache the object. A cached object is the same to the renderer as a new image regardless of its contents.
	 *     - Images are wrapped as a webGL texture, graphics cards have a limit to concurrent textures, too many textures will slow performance. Ironically meaning caching may slow WebGL.
	 *     - If new images are continually added and removed from the display list it will leak memory due to WebGL Texture wrappers being made.
																														//TODO: add in a hook so that people can easily clear old texture memory
	 *     - Clone an image node (DOM/Canvas Element) to re-use it between multiple SpriteStage instances, the GPU texture loading and tracking is not advanced enough yet.
	 *     - You must call updateViewport if you resize your canvas after making a SpriteStage, this will properly size the 3D context stored in memory, this won't affect the DOM.
	 *
	 * <h4>How to use Example</h4>
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
	 * <strong>Note:</strong> SpriteContainer was required by previous versions but is deprecated.
	 * <strong>Note:</strong> Previous versions had hard limitations about images per container etc, these have been removed.
	 *
	 * @class SpriteStage
	 * @extends Stage
	 * @constructor
	 * @param {HTMLCanvasElement | String | Object} canvas A canvas object that the SpriteStage will render to, or the string id
	 * of a canvas object in the current document.
	 * @param {Boolean} preserveDrawingBuffer If true, the canvas is NOT auto-cleared by WebGL (spec discourages true). Useful if you want to use p.autoClear = false.
	 * @param {Boolean} antialias Specifies whether or not the browser's WebGL implementation should try to perform antialiasing.
	 * @param {Boolean} transparent If true, the canvas is transparent, this is VERY expensive.
	 **/
	function SpriteStage(canvas, preserveDrawingBuffer, antialias, transparent) {
		this.Stage_constructor(canvas);

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
		 * @property _preserveDrawingBuffer
		 * @protected
		 * @type {Boolean}
		 * @default false
		 **/
		this._preserveDrawingBuffer = preserveDrawingBuffer||false;														//TODO: DHG: look at turning this into autoClear directly

		/**
		 * Specifies whether or not the browser's WebGL implementation should try to perform antialiasing.
		 * @property _antialias
		 * @protected
		 * @type {Boolean}
		 * @default false
		 **/
		this._antialias = antialias||false;																				//TODO: DHG: ensure this does something

		/**
		 * Specifies whether or not the browser's WebGL implementation should be transparent.
		 * @property _antialias
		 * @protected
		 * @type {Boolean}
		 * @default false
		 **/
		this._transparent = transparent||false;																				//TODO: DHG: ensure this does something

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
		this._clearColor = { r: 0.0, g: 0.0, b: 0.0, a: 0.0 };															//TODO: formalize this approach into regular canvases

		/**
		 * The maximum number of cards (aka a single sprite) that can be drawn in one draw call.
		 * Use getter/setters to modify otherwise internal buffers may be incorrect sizes.
		 * @property _maxCardsPerBatch
		 * @protected
		 * @type {Number}
		 * @default SpriteStage.DEFAULT_MAX_BATCH_SIZE
		 **/
		this._maxCardsPerBatch = SpriteStage.DEFAULT_MAX_BATCH_SIZE;													//TODO: write getter/setters for this

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
		 * The WebGL buffer attached to _vertecies.
		 * @property _vertexPositionBuffer
		 * @protected
		 * @type {WebGLBuffer}
		 * @default null
		 **/
		this._vertexPositionBuffer = null;

		/**
		 * The vertices data for the current draw call.
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
		 * The vertices data for the current draw call.
		 * @property _indecies
		 * @protected
		 * @type {Float32Array}
		 * @default null
		 **/
		this._indecies = null;

		/**
		 * The WebGL buffer attached to _indecies.
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
		 * How many concurrent textures the gpu can handle. Dynamically Get this value from WebGL during initilization.
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
		 * Location at which the last texture was inserted into the texture dictionary.
		 * Do not confuse with _lastTextureInsert location, this variable is for ensuring unique ids and unrelated.
		 * @protected
		 * @type {Number}
		 * @default -1
		 */
		this._lastTextureID = -1;

		/**
		 * Current batch being drawn, a batch consists of a call to "drawElements" on the GPU. mnay may occur per draw.
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
		 * Used to prevent nested draw calls from accidently overwriting drawing information by tracking depth.
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
		 * @type {Boolean}
		 * @default false
		 */
		this._cacheContainer = new createjs.Container();

		// and begin
		this._initializeWebGL();
	}
	var p = createjs.extend(SpriteStage, createjs.Stage);

	/**
	 * Calculate the U/V co-ordinate based info for sprite frames. Instead of pixel count it uses a 0-1 space.
	 * Also includes the ability to get info back for a specific frame or only calculate that one frame.
	 * @param  {SpriteSheet} spritesheet The spritesheet to find _frames on
	 * @param  {frame} [target=-1] The frame to return
	 * @param  {Boolean} [onlyTarget=false] Whether "target" is the only frame that gets calculated
	 * @method buildUVRects
	 * @return {Object} the target frame if supplied and present or a generic frame {t, l, b, r}
	 */
	SpriteStage.buildUVRects = function(spritesheet, target, onlyTarget) {
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
	 * Test a context to see if it has webgl enabled on it
	 * @method isWebGLActive
	 * @param {CanvasContext} ctx The context to test
	 * @return {Boolean} Whether webgl is enabled
	 */
	SpriteStage.isWebGLActive = function(ctx) {
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
	SpriteStage.DEFAULT_MAX_BATCH_SIZE = 8000;

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
	 * Default U/V rect for dealing with full coverage from an image source.
	 * @property UV_RECT
	 * @static
	 * @final
	 * @type {Object}
	 * @readonly
	 */
	SpriteStage.UV_RECT = {t:0, l:0, b:1, r:1};

	/**
	 * Vertex positions for a card that covers the entire render. Used with render targets primarily.
	 * @property COVER_VERT
	 * @static
	 * @final
	 * @type {Float32Array}
	 * @readonly
	 */
	SpriteStage.COVER_VERT = new Float32Array([
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
	SpriteStage.COVER_UV = new Float32Array([
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
	SpriteStage.COVER_UV_FLIP = new Float32Array([
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
	SpriteStage.REGULAR_VARYING_HEADER = (
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
	SpriteStage.REGULAR_VERTEX_HEADER = (
		SpriteStage.REGULAR_VARYING_HEADER +
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
	SpriteStage.REGULAR_FRAGMENT_HEADER = (
		SpriteStage.REGULAR_VARYING_HEADER +
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
	SpriteStage.REGULAR_VERTEX_BODY  = (
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
	 * Shader code may contain templates that are replaced pre compile.
	 * @property REGULAR_FRAGMENT_BODY
	 * @static
	 * @final
	 * @type {String}
	 * @readonly
	 */
	SpriteStage.REGULAR_FRAGMENT_BODY = (
		"void main(void) {" +
			"int src = int(indexPicker);" +
			"vec4 color = vec4(1.0, 0.0, 0.0, 1.0);" +

			"if(src == 0) {" +
				"color = texture2D(uSampler[0], vTextureCoord);" +
				"{{alternates}}" +
			"}" +

			"gl_FragColor = vec4(color.rgb, color.a * alphaValue);" +
		"}"
	);

	//TODO: DHG: a real particle shader
	SpriteStage.PARTICLE_VERTEX_BODY = (
		SpriteStage.REGULAR_VERTEX_BODY
	);
	SpriteStage.PARTICLE_FRAGMENT_BODY = (
		SpriteStage.REGULAR_FRAGMENT_BODY
	);

	/**
	 * Portion of the shader that contains the "varying" properties required in both vertex and fragment shaders.
	 * The cover shader is designed to be a simple vertex/uv only texture render that covers the render surface.
	 * Shader code may contain templates that are replaced pre compile.
	 * @property COVER_VARYING_HEADER
	 * @static
	 * @final
	 * @type {String}
	 * @readonly
	 */
	SpriteStage.COVER_VARYING_HEADER = (
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
	SpriteStage.COVER_VERTEX_HEADER = (
		SpriteStage.COVER_VARYING_HEADER +
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
	SpriteStage.COVER_FRAGMENT_HEADER = (
		SpriteStage.COVER_VARYING_HEADER +
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
	SpriteStage.COVER_VERTEX_BODY  = (
		"void main(void) {" +
			"gl_Position = vec4(vertexPosition.x, vertexPosition.y, 0.0, 1.0);" +
			"vRenderCoord = uvPosition;" +
			"vTextureCoord = vec2(uvPosition.x, abs(uUpright - uvPosition.y));" +
			//"vTextureCoord = uvPosition;" +
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
	SpriteStage.COVER_FRAGMENT_BODY = (
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

	/**
	 * Indicates whether WebGL is being used for rendering. For example, this would be false if WebGL is not
	 * supported in the browser.
	 * @readonly
	 * @property contextWebGL
	 * @type {WebGLRenderingContext}
	 **/
	p._get_contextWebGL = function() {
		return this._webGLContext;
	};

	try {
		Object.defineProperties(p, {
			isWebGL: { get: p._get_isWebGL }
		});
	} catch (e) {} // TODO: use Log


// constructor methods:
	/**
	 * Create and properly intialize the webGL instance we will be using.
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
					preserveDrawingBuffer: this._preserveDrawingBuffer,
					premultipliedAlpha: true // Assume the drawing buffer contains colors with premultiplied alpha.
				};

				var gl = this._webGLContext = this._fetchWebGLContext(this.canvas, options);

				this.updateSimultaneousTextureCount(gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS));
				this._createBuffers(gl);
				this._initTextures(gl);

				gl.clearColor(0.25, 0.25, 0.25, 0.0);
				gl.disable(gl.DEPTH_TEST);
				gl.enable(gl.BLEND);
				gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
				gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);

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
		//DHG TODO: test context swapping and re-acqusition
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
		if (SpriteStage.isWebGLActive(this._webGLContext)) {
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

	/** docced in super class **/
	/**
	 * Draws the stage into the correct context be it canvas or Render Texture using WebGL.
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method cacheDraw
	 * @param {DisplayObject} target The object we're drawing into cache.
	 * For example, used for drawing the cache (to prevent it from simply drawing an existing cache back
	 * into itself).
	 * @param {Array} filters The filters we're drawing into cache.
	 **/
	p.draw = function(context, ignoreCache) {
		aaaaaaaaaaaaaaaaaaaaaaaaaaaa
		if (SpriteStage.isWebGLActive(this._webGLContext)) {
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
	 **/
	p.cacheDraw = function(target, filters) {
		var gl = this._webGLContext;
		var renderTexture;
		var shaderBackup = this._activeShader;
		var blackListBackup = this._slotBlacklist;
		var lastTextureSlot = this._batchTextureCount-1;

		// protect the last slot so that we have somewhere to bind the renderTextures so it doesn't get upset
		this.protectTextureSlot(lastTextureSlot, true);

		// create offset container for drawing item
		var mtx = target.getMatrix();
		mtx = mtx.clone().invert();
		var container = this._cacheContainer;
		container.children = [target];
		container.transformMatrix = mtx;

		for(var j=0; j<this._batchTextureCount;j++) {
			gl.activeTexture(gl.TEXTURE0 + j);
			this._batchTextures[j] = this.getBaseTexture();
		}

		var filterCount = filters && filters.length;
		if(filterCount) {
			// we don't know which texture slot we're dealing with previously and we need one out of the way
			// once we're using that slot activate it so when we make and bind our RenderTexture it's safe there
			gl.activeTexture(gl.TEXTURE0 + lastTextureSlot);
			renderTexture = this.getTargetRenderTexture(gl, target);

			// draw item to render texture		I -> T
			gl.bindFramebuffer(gl.FRAMEBUFFER, renderTexture._frameBuffer);
			gl.clear(gl.COLOR_BUFFER_BIT);
			this._batchDraw(container, gl, true);

			// bind the result texture to slot 0 as all filters and cover draws assume original content is in slot 0
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, renderTexture);
			this.setTextureParams(gl);

			var flipY = false;

			// apply each filter in order, but remember to toggle used texture and used
			for(var i=0; i<filterCount; i++) {
				var filter = filters[i];

				// now the old result is stored in slot 0, make a new render texture
				gl.activeTexture(gl.TEXTURE0 + lastTextureSlot);
				renderTexture = this.getTargetRenderTexture(gl, target);
				gl.bindFramebuffer(gl.FRAMEBUFFER, renderTexture._frameBuffer);

				// swap to correct shader
				this._activeShader = this.getFilterShader(gl, filter);
				if(!this._activeShader) { continue; }

				// draw result to render texture	R -> T
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

				// draw result to canvas			R -> C
				this._activeShader = this.getFilterShader(gl, this);
				this._drawCover(gl, flipY);
			} else {
				//TODO: DHG: this is less than ideal a flipped inital render for this circumstance might help, adjust the perspective matrix?
				if(flipY) {
					gl.activeTexture(gl.TEXTURE0 + lastTextureSlot);
					renderTexture = this.getTargetRenderTexture(gl, target);
					gl.bindFramebuffer(gl.FRAMEBUFFER, renderTexture._frameBuffer);

					this._activeShader = this.getFilterShader(gl, this);
					this._drawCover(gl, !flipY);

				}
				gl.bindFramebuffer(gl.FRAMEBUFFER, null);

				// make sure the last texture is the active thing to draw
				target.cacheCanvas = renderTexture;
			}
		} else {
			// is this for another stage or mine
			if(this.isCacheControlled) {
				// draw item to canvas				I -> C
				gl.clear(gl.COLOR_BUFFER_BIT);
				this._batchDraw(container, gl, true);
			} else {
				gl.activeTexture(gl.TEXTURE0 + lastTextureSlot);
				target.cacheCanvas = this.getTargetRenderTexture(gl, target);
				renderTexture = target.cacheCanvas;

				// draw item to render texture		I -> T
				gl.bindFramebuffer(gl.FRAMEBUFFER, renderTexture._frameBuffer);

				var backupMTX = this._projectionMatrix;
				this._projectionMatrix = this._projectionMatrixFlip;
				gl.clear(gl.COLOR_BUFFER_BIT);
				this._batchDraw(container, gl, true);
				gl.bindFramebuffer(gl.FRAMEBUFFER, null);
				this._projectionMatrix = backupMTX;
			}
		}

		this.protectTextureSlot(lastTextureSlot, false);
		this._activeShader = shaderBackup;
		this._slotBlacklist = blackListBackup;
	};

	/**
	 * Blocks, or frees a texture "slot" on the GPU. Can be usefull if you are overflowing textures.
	 * When overflowing textures they are re-uploaded to the GPU every time they're encountered, this can be expensive with large textures.
	 * By blocking the slot you reduce available slots potentially increasing draw calls but prevent a texture being re-uploaded if it moved slot due to overflow.
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method protectTextureSlot
	 * @param  {Number} id The slot to be affected
	 * @param  {Boolean} lock Whether this slot is the one being locked.
	 */
	p.protectTextureSlot = function(id, lock) {
		if(id > this._batchTextureCount || id < 0){
			throw("Slot outside of acceptable range");
		}
		this._slotBlacklist[id] = !!lock;
	};

	/**
	 * Render textures can't draw into themselves so any item being used for renderTextures needs two.
	 * This function creates, gets, and toggles the render surface.
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @param  {WebGLRenderingContext} gl
	 * @param  {DisplayObject} target The object associated with the render textures, usually a cached object.
	 * @method getTargetRenderTexture
	 */
	p.getTargetRenderTexture = function(gl, target) {
		var result, toggle = false;
		if(target.__lastRT !== undefined && target.__lastRT === target.__rtA){ toggle = true; }
		if(!toggle){
			if(target.__rtA === undefined) {
				target.__rtA = this.getRenderBufferTexture(target._cacheWidth, target._cacheHeight);
			} else {
				gl.bindTexture(gl.TEXTURE_2D, target.__rtA);
				this.setTextureParams(gl);
			}
			result = target.__rtA;
		} else {
			if(target.__rtB === undefined) {
				target.__rtB = this.getRenderBufferTexture(target._cacheWidth, target._cacheHeight);
			} else {
				gl.bindTexture(gl.TEXTURE_2D, target.__rtB);
				this.setTextureParams(gl);
			}
			result = target.__rtB;
		}
		target.__lastRT = result;
		return result;
	};

	/**
	 * For every image encountered it is registered and tracked automatically.
	 * When all items using an image are removed from the stage its recommended to remove it manually to prevent memory leaks.
	 * If you remove a texture and add it again later the texture will get re added and ne re-removing.
	 * @method unregisterTexture
	 * @param  {DisplayObject} item a display object that used the texture you are no longer using.
	 */
	p.unregisterTexture = function(item) {
		// container
		if(item.children) {
			for(var i= 0, l=item.children.length; i<l; i++) {
				this.unregisterTexture(item.children);
			}
		}

		// render Texture
		if(item._storeID < 0) {
			//TODO: delete calls
			return;
		}

		// sprites bitmaps and caches
		var removeTarget;
		if(item._storeID !== undefined) {
			removeTarget = item;
		} else if(item._webGLRenderStyle === 1) {
			removeTarget = item.spriteSheet.getFrame(item.currentFrame).image;
		} else if(item._webGLRenderStyle === 2) {
			if(item.cacheCanvas) {
				removeTarget = item.cacheCanvas;
			} else {
				removeTarget = item.image;
			}
		}

		if(removeTarget === undefined) {
			if(vocalDebug) {
				console.log("No associated texture found on release");
			}
			return;
		}

		//TODO: delete calls
		this._textureIDs[removeTarget.src] = undefined;
		this._textureDictionary[removeTarget._storeID] = undefined;
	};

	/**
	 * Try to set the max textures the system can handle, should default to the hardware max and lower values may limit performance.
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method updateSimultaneousTextureCount
	 * @param {Number} count
	 */
	p.updateSimultaneousTextureCount = function(count) {
		//TODO: DHG: make sure API works in all instances, may be some issues with buffers etc I haven't forseen
		var gl = this._webGLContext;
		var success = false;

		this._batchTextureCount = count;
		if(this._batchTextureCount < 1){ this._batchTextureCount = 1; }

		while(!success) {
			try{
				this._activeShader = this._fetchShaderProgram(gl);
				success = true;
			} catch(e) {
				if(this._batchTextureCount == 1){
					throw("Cannot compile shader "+ e);
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

			// openGL works with a -1,1 space on its screen. It also follows Y-Up
			// we need to flip the y, scale and then translate the co-ordinates to match this
			// additionally we offset into they Y so the polygons are inside the camera's "clipping" plane
			this._projectionMatrix = new Float32Array([
				2 / this._viewportWidth,	0,								0,							0,
				0,							-2 / this._viewportHeight,		1,							0,
				0,							0,								1,							0,
				-1,							1,								0.1,						0
			]);
			this._projectionMatrixFlip = this._projectionMatrix.slice();
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
					gl, "custom",
					filter.VTX_SHADER_BODY, filter.FRAG_SHADER_BODY,
					filter.shaderParamSetup && filter.shaderParamSetup.bind(filter)
				);
				filter._builtShader = targetShader;
			} catch (e) {
				console.log("SHADER SWITCH FAILURE", e);
			}
		}
		return targetShader;
	};

	/**
	 * See {{#crossLink "unregisterTexture"}}{{/crossLink}} for the new API
	 * @deprecated clearImageTexture
	 **/

	/**
	 * Returns a base texture as either a
	 * @method getBaseTexture
	 * @param  {HTMLImageElement} w The width of the texture, defaults to 1
	 * @param  {HTMLImageElement} h The height of the texture, defaults to 1
	 * @param  {HTMLImageElement} data in a Uint8Array width*height*4(rgba) long, defaults to a single pixel.
	 * @return {Texture} the basic texture instance.
	 **/
	p.getBaseTexture = function(w, h, data) {
		var width = w || 1;
		var height = h || 1;
		if(data === undefined){ data = new Uint8Array([0.1, 0.2, 0.3, 1.0]); }

		var gl = this._webGLContext;
		var texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(
			gl.TEXTURE_2D,			// target
			0,						// level of detail
			gl.RGBA,				// internalformat
			width, height, 0,		// width, height, border (only for array/null sourced textures)
			gl.RGBA,				// format (match internal format)
			gl.UNSIGNED_BYTE,		// type of texture(pixel color depth)
			data					// image data
		);
		this.setTextureParams(gl);
		return texture;
	};

	/**
	 * Returns a base texture (see getBaseTexture) with an attached render buffer in texture._frameBuffer
	 * @method getBaseTexture
	 * @param  {HTMLImageElement} w The width of the texture
	 * @param  {HTMLImageElement} h The height of the texture
	 * @return {Texture} the basic texture instance.
	 **/
	p.getRenderBufferTexture = function(w, h) {
		var gl = this._webGLContext;

		// get the texture and set its width and height for spoofing as an image
		var renderTexture = this.getBaseTexture(w, h, null);
		renderTexture.width = w;
		renderTexture.height = h;

		// get the frame buffer
		var frameBuffer = gl.createFramebuffer();
		gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);

		// attach frame buffer to texture and provide cross links to look up each other
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
		//TODO: hook up isPOT to actual functionality
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	};

	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 **/
	p.toString = function() {
		return "[SpriteStage (name="+  this.name +")]";
	};

// private methods:
	/**
	 * Sets up and returns the webgl context for the canvas.
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
	 * Create the completed Shader Program from the vertex and fragment shaders. Allows building of custom shaders for filters.
	 * Once compiled shaders are saved so if the Shader code is dynamic re-run this function when it needs to change.
	 * @param  {WebGLRenderingContext} gl
	 * @param  {String} [shaderName="regular"] "custom", "regular". Which type of shader to build, only "custom" uses the other 3 fields.
	 * @param  {String} [customVTX=undefined] Extra vertex shader information to replace a regular draw, see {{#crossLink "COVER_VERTEX_BODY"}}{{/crossLink}} for default and {{#crossLink "Filter"}}{{/crossLink}} for examples.
	 * @param  {String} [customFRAG=undefined] Extra fragment shader information to replace a regular draw, see {{#crossLink "COVER_FRAGMENT_BODY"}}{{/crossLink}} for default and {{#crossLink "Filter"}}{{/crossLink}} for examples.
	 * @param  {Function} [shaderParamSetup=undefined] Function to run so custom shader parameters can get applied for the render.
	 * @method _fetchShaderProgram
	 * @protected
	 */
	p._fetchShaderProgram = function(gl, shaderName, customVTX, customFRAG, shaderParamSetup) {
		gl.useProgram(null);		//saftey to avoid collisions

		// build the correct shader string out of the right headers and bodies
		var targetFrag, targetVtx;
		switch(shaderName) {
			case "custom":
				targetVtx = SpriteStage.COVER_VERTEX_HEADER;
				targetFrag = SpriteStage.COVER_FRAGMENT_HEADER;
				targetVtx += customVTX || SpriteStage.COVER_VERTEX_BODY;
				targetFrag += customFRAG || SpriteStage.COVER_FRAGMENT_BODY;
				break;
			case "particle":
				targetVtx = SpriteStage.REGULAR_VERTEX_HEADER;
				targetFrag = SpriteStage.REGULAR_FRAGMENT_HEADER;
				targetVtx += SpriteStage.PARTICLE_VERTEX_BODY;
				targetFrag += SpriteStage.PARTICLE_FRAGMENT_BODY;
				break;
			case "regular":
			default:
				targetVtx = SpriteStage.REGULAR_VERTEX_HEADER;
				targetFrag = SpriteStage.REGULAR_FRAGMENT_HEADER;
				targetVtx += SpriteStage.REGULAR_VERTEX_BODY;
				targetFrag += SpriteStage.REGULAR_FRAGMENT_BODY;
				break;
		}

		// create the seperate pars
		var vertexShader = this._createShader(gl, gl.VERTEX_SHADER, targetVtx);
		var fragmentShader = this._createShader(gl, gl.FRAGMENT_SHADER, targetFrag);

		// link them together
		var shaderProgram = gl.createProgram();
		gl.attachShader(shaderProgram, vertexShader);
		gl.attachShader(shaderProgram, fragmentShader);
		gl.linkProgram(shaderProgram);

		// check compile status
		if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
			gl.useProgram(this._activeShader);
			throw(gl.getProgramInfoLog(shaderProgram));
		}

		// setup the parameters on the shader
		gl.useProgram(shaderProgram);
		switch(shaderName) {
			case "custom":
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

		// actually compile the shader
		var shader = gl.createShader(type);
		gl.shaderSource(shader, str);
		gl.compileShader(shader);

		// check compile status
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			throw(gl.getShaderInfoLog(shader));
			return null;
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
		var groupCount = this._maxCardsPerBatch * SpriteStage.INDICIES_PER_CARD;
		var groupSize, i;

		// INFO:
		// all buffers are created using this pattern
		// create a webGL buffer
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
		var indecies = this._indecies = new Float32Array(groupCount * groupSize);
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
		this._lastTextureID = -1;

		// clear containers
		this._textureDictionary = [];
		this._textureIDs = {};
		this._batchTextures = [];

		// fill in blanks as it helps the renderer be stable while textures are loading and reduces need for saftey code
		for(var i=0; i<this._batchTextureCount;i++) {
			this._batchTextures[i] = this.getBaseTexture();
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
		++this._lastTextureID;
		var src = image.src;

		if(!src){
			// one time canvas property setup
			image._isCanvas = true;
			src = image.src = "canvas_" + this._lastTrackedCanvas++;
		}

		// put the texture into our storage system
		var storeID = this._textureIDs[src];
		if(storeID === undefined) {
			storeID = this._textureDictionary.length;
			this._textureIDs[src] = storeID;
		}
		if(this._textureDictionary[storeID] === undefined){
			this._textureDictionary[storeID] = this.getBaseTexture();
		}

		// get texture params all set up
		var texture = this._textureDictionary[storeID];
		texture._batchID = this._batchID;
		texture._storeID = storeID;
		texture._imageData = image;
		this._insertTextureInBatch(gl, texture);

		// get the data into the texture or wait for it to load
		image._storeID = storeID;
		if(image.complete || image.naturalWidth || image._isCanvas) {		// is it already loaded
			this._updateTextureImageData(gl, image);
		} else  {
			image.onload = this._updateTextureImageData.bind(this, gl, image);											//TODO: DHG: EventListener instead of callback
		}

		return texture;
	};

	/**
	 * Necessary to upload the actual image data to the gpu. Without this the texture will be blank.
	 * @param {WebGLRenderingContext} gl
	 * @param {Image | Canvas} image The image data to be uploaded
	 * @method _updateTextureImageData
	 */
	p._updateTextureImageData = function(gl, image) {
		var texture = this._textureDictionary[image._storeID];

		gl.activeTexture(gl.TEXTURE0 + texture._activeIndex);
		gl.bindTexture(gl.TEXTURE_2D, texture);
		this.setTextureParams(gl);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

		image._invalid = false;

		texture._w = image.width;
		texture._h = image.height;

		if(this.vocalDebug) {
			// the bitwise & is intentional, cheap exponent 2 check
			if((image.width & image.width-1) || (image.height & image.height-1)) {
				console.warn("NPOT(Non Power of Two) Texture: "+ image.src);
			}
			if(image.width > gl.MAX_TEXTURE_SIZE || image.height > gl.MAX_TEXTURE_SIZE){
				console.error("Oversized Texture: "+ image.width+"x"+image.height +" vs "+ gl.MAX_TEXTURE_SIZE +"max");
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
	 * Begin the drawing process for a regular render.
	 * @param {WebGLRenderingContext} gl
	 * @param {Stage || Container} sceneGraph {{#crossLink "Container"))((/crossLink}} object with all that needs to rendered, prefferably a stage
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
	 * Add all the contents of a container to the pending buffers, called recursivley on each container.
	 * May trigger a draw if a buffer runs out of space.
	 * @param {Container} container The {{#crossLink "Container"))((/crossLink}} that contains everything to be drawn.
	 * @param {WebGLRenderingContext} gl
	 * @param {Matrix2D} concatMtx The effective (concatinated) position when begining this container
	 * @param {Number} concatAlpha The effective (concatinated) alpha when begining this container
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
		for(var i = 0, l = container.children.length; i < l; i++) {														//TODO: DHG: store off length
			var item = container.children[i];

			if(!(item.visible && concatAlpha)) { continue; }
			if(!item.cacheCanvas || ignoreCache) {
				if(item._webGLRenderStyle === 3) {							// BITMAP TEXT SETUP
					item._updateText();																					//TODO: DHG: Make this a more generic API like a "pre webgl render" function
				}
				if(item.children) {											// CONTAINER
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

			// keep track of concatanted position
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

			var uvs = this._uvs;
			var vertices = this._vertices;
			var texI = this._indecies;
			var alphas = this._alphas;

			if(item._webGLRenderStyle === 2 || (item.cacheCanvas && !ignoreCache)) {			// BITMAP / Cached Canvas
				image = (ignoreCache?false:item.cacheCanvas) || item.image;
			} else if(item._webGLRenderStyle === 1) {											// SPRITE
				frame = item.spriteSheet.getFrame(item.currentFrame);
				image = frame.image;
			} else {																			// MISC (DOM objects render themselves later)
				continue;
			}

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
					subL = -item.regX;									subT = -item.regY;
					subR = src.width+subL;								subB = src.height+subT;
				} else {
					// calculate uvs
					// calculate vertices
					if(item.cacheCanvas) {
						uvRect = SpriteStage.UV_RECT;
						subL = item._cacheOffsetX;							subT = item._cacheOffsetY;
					} else {
						uvRect = SpriteStage.UV_RECT;
						subL = (-item.regX);								subT = (-item.regY);
					}
					subR = image.width+subL;							subB = image.height+subT;
				}
			} else if(item._webGLRenderStyle === 1) {											// SPRITE
				var rect = frame.rect;

				// calculate uvs
				uvRect = frame.uvRect;
				if(!uvRect) {
					uvRect = SpriteStage.buildUVRects(item.spriteSheet, item.currentFrame, false);
				}

				// calculate vertices
				subL = -frame.regX;								subT = -frame.regY;
				subR = rect.width-frame.regX;					subB = rect.height-frame.regY;
			}

			// These must be calculated here else a forced draw might happen after they're set
			var offset = this.batchCardCount*SpriteStage.INDICIES_PER_CARD*2;											//TODO: DHG: you can do better
			var loc = (offset/2)|0;

			//DHG: See Matrix2D.transformPoint for why this math specifically
			// apply vertices																							//TODO: DHG: optimize?
			vertices[offset] =		subL *iMtx.a + subT *iMtx.c +iMtx.tx;			vertices[offset+1] =	subL *iMtx.b + subT *iMtx.d +iMtx.ty;
			vertices[offset+2] =	subL *iMtx.a + subB *iMtx.c +iMtx.tx;			vertices[offset+3] =	subL *iMtx.b + subB *iMtx.d +iMtx.ty;
			vertices[offset+4] =	subR *iMtx.a + subT *iMtx.c +iMtx.tx;			vertices[offset+5] =	subR *iMtx.b + subT *iMtx.d +iMtx.ty;
			vertices[offset+6] =	vertices[offset+2];								vertices[offset+7] =	vertices[offset+3];
			vertices[offset+8] =	vertices[offset+4];								vertices[offset+9] =	vertices[offset+5];
			vertices[offset+10] =	subR *iMtx.a + subB *iMtx.c +iMtx.tx;			vertices[offset+11] =	subR *iMtx.b + subB *iMtx.d +iMtx.ty;

			// apply uvs
			uvs[offset] =		uvRect.l;			uvs[offset+1] =		uvRect.t;
			uvs[offset+2] =		uvRect.l;			uvs[offset+3] =		uvRect.b;
			uvs[offset+4] =		uvRect.r;			uvs[offset+5] =		uvRect.t;
			uvs[offset+6] =		uvRect.l;			uvs[offset+7] =		uvRect.b;
			uvs[offset+8] =		uvRect.r;			uvs[offset+9] =		uvRect.t;
			uvs[offset+10] =	uvRect.r;			uvs[offset+11] =	uvRect.b;

			// apply texture
			texI[loc] = texI[loc+1] = texI[loc+2] = texI[loc+3] = texI[loc+4] = texI[loc+5] = texIndex;

			// apply alpha
			alphas[loc] = alphas[loc+1] = alphas[loc+2] = alphas[loc+3] = alphas[loc+4] = alphas[loc+5] = item.alpha * concatAlpha;

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
		//return;
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
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, this._indecies);

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
			this.setTextureParams(gl);
		}

		gl.drawArrays(gl.TRIANGLES, 0, this.batchCardCount*SpriteStage.INDICIES_PER_CARD);
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
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, SpriteStage.COVER_VERT);
		gl.bindBuffer(gl.ARRAY_BUFFER, uvPositionBuffer);
		gl.vertexAttribPointer(shaderProgram.uvPositionAttribute, uvPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, flipY?SpriteStage.COVER_UV_FLIP:SpriteStage.COVER_UV);

		gl.uniform1i(shaderProgram.samplerUniform, 0);
		gl.uniform1f(shaderProgram.uprightUniform, flipY?0:1);

		gl.drawArrays(gl.TRIANGLES, 0, SpriteStage.INDICIES_PER_CARD);
	};

	// injected properties and methods:
	/*
	 * We need to modify other classes, do this during our class initialization
	 */
	(function _injectWebGLFunctionality() {
		// Set which classes are compatible with SpriteStage. The order is important!!!
		// Reflect any changes to the drawing loop
		var candidates = [createjs.Sprite, createjs.Bitmap, createjs.BitmapText];
		candidates.forEach(function(_class, index) {
			_class.prototype._webGLRenderStyle = index + 1;
		});

		var cm = createjs.CacheManager.prototype;
		/**
		 * Functionality injected to {{#crossLink "DisplayObject"}}{{/crossLink}}. Ensure SpriteStage is loaded before
		 * making any DisplayObject instances but after all other standard easeljs classes for injection to take full effect.
		 * Replaces the 2D only behaviour with potential WebGL behaviour. If options is set to true a SpriteStage
		 * is created and contained on the object for use when rendering a cache.
		 * If options is a SpriteStage instance it should be the same SpriteStage the target object is on.
		 * When it is a webgl texture will be made this gives a substantial performance boost compared to a canvas.
		 * <h4>Example</h4>
		 * With a 2d context:
		 *      var stage = new createjs.Stage();
		 *      var bmp = new createjs.Bitmap(src);
		 *      bmp.cache(0, 0, bmp.width, bmp.height, 1, true);
		 * <h4>Example</h4>
		 * With a webgl context:
		 *      var stage = new createjs.SpriteStage();
		 *      var bmp = new createjs.Bitmap(src);
		 *      bmp.cache(0, 0, bmp.width, bmp.height, 1, stage);
		 * You can make your own SpriteStage and have it render to a canvas if you set ".isCacheControlled" to true on your stage.
		 * DO NOT set it to true if you wish to use the fast Render Textures available to SpriteStages
		 * @pubic
		 * @method cache
		 **/
		cm._createSurfaceBASE = cm._createSurface;
		cm._createSurface = function(options) {
			if(!options) {
				this._createSurfaceBASE();
				return;
			}

			if(this._webGLCache !== options) {
				if(options === true) {
					this.cacheCanvas = document.createElement("canvas");
					this._webGLCache = new createjs.SpriteStage(this.cacheCanvas);
					// flag so it can tell whether to do a final render texture output
					this._webGLCache.isCacheControlled = true;
				} else {
					this.cacheCanvas = true;
					this._webGLCache = options;
				}
			}
		};

		cm._drawToCacheBASE = cm._drawToCache;
		cm._drawToCache = function(compositeOperation, w, h) {
			var cacheCanvas = this.cacheCanvas;
			var target = this.target;
			var webGL = this._webGLCache;

			if(!webGL){
				this._drawToCacheBASE(compositeOperation, w, h);
				return;
			}

			if(webGL.isCacheControlled) {
				if (w != cacheCanvas.width || h != cacheCanvas.height) {
					cacheCanvas.width = w;
					cacheCanvas.height = h;
					webGL.updateViewport(w, h);
				}
			}
			this._webGLCache.cacheDraw(target, target.filters);
			this.cacheCanvas = target.cacheCanvas;
		};

		cm.uncacheBASE = cm.uncache;
		cm.uncache = function() {
			if(this._webGLCache) {
				if(!this._webGLCache.isCacheControlled) {
					this._webGLCache.unregisterTexture(this.cacheCanvas);
				}
				this._webGLCache = false;
			}
			this.uncacheBASE();
		};
	})();

	createjs.SpriteStage = createjs.promote(SpriteStage, "Stage");
}());
