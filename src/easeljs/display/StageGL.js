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

/*
 * README IF EDITING:
 *
 * - Terminology for developers:
 * Vertex: a point that help defines a shape, 3 per triangle. Usually has an x,y,z but can have more/less info.
 * Vertex Property: a piece of information attached to the vertex like a vector3 containing x,y,z
 * Index/Indices: used in groups of 3 to define a triangle, points to vertices by their index in an array (some render
 * 		modes do not use these)
 * Card: a group of 2 triangles used to display a rectangular image
 * UV: common names for the [0-1] texture co-ordinates on an image
 * Batch: a single call to the renderer, best done as little as possible. Multiple cards are batched for this reason
 * Program/Shader: For every vertex we run the Vertex shader. The results are used per pixel by the Fragment shader. When
 * 		combined and paired these are a "shader program"
 * Texture: WebGL representation of image data and associated extra information, separate from a DOM Image
 * Slot: A space on the GPU into which textures can be loaded for use in a batch, i.e. using "ActiveTexture" switches texture slot.
 * Render___: actual WebGL draw call
 * Buffer: WebGL array data
 * Cover: A card that covers the entire viewport
 * Dst: The existing drawing surface in the shader
 * Src: The new data being provided in the shader
 *
 * - Notes:
 * WebGL treats 0,0 as the bottom left, as such there's a lot of co-ordinate space flipping to make regular canvas
 * 		numbers make sense to users and WebGL simultaneously. This extends to textures stored in memory too. If writing
 * 		code that deals with x/y, be aware your y may be flipped.
 * Older versions had distinct internal paths for filters and regular draws, these have been merged.
 * Draws are slowly assembled out of found content. Overflowing things like shaders, object/texture count will cause
 * 		an early draw before continuing. Lookout for the things that force a draw. Marked with <------------------------
 */

(function () {
	"use strict";

	/**
	 * A StageGL instance is the root level {{#crossLink "Container"}}{{/crossLink}} for a WebGL-optimized display list,
	 * which can be used in place of the usual {{#crossLink "Stage"}}{{/crossLink}}. This class should behave identically
	 * to a {{#crossLink "Stage"}}{{/crossLink}} except for WebGL-specific functionality.
	 *
	 * Each time the {{#crossLink "Stage/tick"}}{{/crossLink}} method is called, the display list is rendered to the
	 * target &lt;canvas/&gt; instance, ignoring non-WebGL-compatible display objects. On devices and browsers that don't
	 * support WebGL, content will automatically be rendered to canvas 2D context instead.
	 *
	 * <h4>Limitations</h4>
	 * - {{#crossLink "Shape"}}{{/crossLink}}, {{#crossLink "Shadow"}}{{/crossLink}}, and {{#crossLink "Text"}}{{/crossLink}}
	 * 	are not rendered when added to the display list.
	 * - To display something StageGL cannot render, {{#crossLink "displayObject/cache"}}{{/crossLink}} the object.
	 *	Caches can be rendered regardless of source.
	 * - Images are wrapped as a webGL "Texture". Each graphics card has a limit to its concurrent Textures, too many 
	 * Textures will noticeably slow performance.
	 * - Each cache counts as an individual Texture. As such {{#crossLink "SpriteSheet"}}{{/crossLink}} and 
	 * {{#crossLink "SpriteSheetBuilder"}}{{/crossLink}} are recommended practices to help keep texture counts low.
	 * - To use any image node (DOM Image/Canvas Element) between multiple StageGL instances it must be a 
	 * {{#crossLink "Bitmap/clone"}}{{/crossLink}}, otherwise the GPU texture loading and tracking will get confused.
	 * - to avoid an up/down scaled render you must call {{#crossLink "StageGL/updateViewport"}}{{/crossLink}} if you
	 * resize your canvas after making a StageGL instance, this will properly size the WebGL context stored in memory.
	 * - Best performance in demanding scenarios will come from manual management of texture memory, but it is handled
	 * automatically by default. See {{#crossLink "StageGL/releaseTexture"}}{{/crossLink}} for details.
	 * - Disable `directDraw` to get access to cacheless filters and composite oeprations!
	 *
	 * <h4>Example</h4>
	 * This example creates a StageGL instance, adds a child to it, then uses the EaselJS {{#crossLink "Ticker"}}{{/crossLink}}
	 * to update the child and redraw the stage.
	 *
	 *      var stage = new createjs.StageGL("canvasElementId");
	 *
	 *      var image = new createjs.Bitmap("imagePath.png");
	 *      stage.addChild(image);
	 *
	 *      createjs.Ticker.on("tick", handleTick);
	 *
	 *      function handleTick(event) {
	 *          image.x += 10;
	 *          stage.update();
	 *      }
	 *
	 * @class StageGL
	 * @extends Stage
	 * @constructor
	 * @param {HTMLCanvasElement | String | Object} canvas A canvas object that StageGL will render to, or the string id
	 * of a canvas object in the current DOM.
	 * @param {Object} options All the option parameters in a reference object, some are not supported by some browsers.
	 * @param {Boolean} [options.preserveBuffer=false] If `true`, the canvas is NOT auto-cleared by WebGL (the spec
	 * discourages setting this to `true`). This is useful if you want persistent draw effects and has also fixed device
	 * specific bugs due to mis-timed clear commands.
	 * @param {Boolean} [options.antialias=false] Specifies whether or not the browser's WebGL implementation should try
	 * to perform anti-aliasing. This will also enable linear pixel sampling on power-of-two textures (smoother images).
	 * @param {Boolean} [options.transparent=false] If `true`, the canvas is transparent. This is <strong>very</strong>
	 * expensive, and should be used with caution.
	 * @param {Boolean} [options.directDraw=true] If `true`, this will bypass intermediary render-textures when possible
	 * resulting in reduced memory and increased performance, this disables some features. Cache-less filters and some
	 * {{#crossLink "DisplayObject/compositeOperation:property"}}{{/crossLink}} values rely on this being false.
	 * @param (Boolean} [options.premultiply] @deprecated Upgraded colour & transparency handling have fixed the issue
	 * this flag was trying to solve rendering it unnecessary.
	 * @param {int} [options.autoPurge=1200] How often the system should automatically dump unused textures. Calls
	 * `purgeTextures(autoPurge)` every `autoPurge/2` draws. See {{#crossLink "StageGL/purgeTextures"}}{{/crossLink}}
	 * for more information on texture purging.
	 * @param {String|int} [options.clearColor=undefined] Automatically calls {{#crossLink "StageGL/setClearColor"}}{{/crossLink}}
	 * after init is complete, can be overridden and changed manually later.
	 * @param {String|int} [options.batchSize=DEFAULT_MAX_BATCH_SIZE] The size of the buffer used to retain a batch.
	 * Making it smaller reduces GPU load, but making it too small adds extra GPU calls. Figure out your maximum batch
	 * count and set it to a small buffer above that per-project. Check src/utils/WebGLInspector to track.
	 */
	function StageGL(canvas, options) {
		this.Stage_constructor(canvas);

		var transparent, antialias, preserveBuffer, autoPurge, directDraw, batchSize;
		if (options !== undefined) {
			if (typeof options !== "object"){ throw("Invalid options object"); }
			transparent = options.transparent;
			antialias = options.antialias;
			preserveBuffer = options.preserveBuffer;
			autoPurge = options.autoPurge;
			directDraw = options.directDraw;
			batchSize = options.batchSize;
		}

// public properties:
		/**
		 * Console log potential issues and problems. This is designed to have <em>minimal</em> performance impact, so
		 * if extensive debugging information is required, this may be inadequate. See {{#crossLink "WebGLInspector"}}{{/crossLink}}
		 * @property vocalDebug
		 * @type {Boolean}
		 * @default false
		 */
		this.vocalDebug = false;

		/**
		 * Specifies whether this instance is slaved to a {{#crossLink "BitmapCache"}}{{/crossLink}} or draws independantly.
		 * Necessary to control texture outputs and behaviours when caching. StageGL cache outputs will only render
		 * properly for the StageGL that made them. See the {{#crossLink "cache"}}{{/crossLink}} function documentation
		 * for more information. Enabled by default when BitmapCache's `useGL` is true.
		 * NOTE: This property is mainly for internal use, though it may be useful for advanced uses.
		 * @property isCacheControlled
		 * @type {Boolean}
		 * @default false
		 */
		this.isCacheControlled = false;

// private properties:
		/**
		 * Specifies whether or not the canvas is auto-cleared by WebGL. The WebGL spec discourages `true`.
		 * If true, the canvas is NOT auto-cleared by WebGL. Used when the canvas context is created and requires
		 * context re-creation to update.
		 * @property _preserveBuffer
		 * @protected
		 * @type {Boolean}
		 * @default false
		 */
		this._preserveBuffer = preserveBuffer||false;

		/**
		 * Specifies whether or not the browser's WebGL implementation should try to perform anti-aliasing.
		 * @property _antialias
		 * @protected
		 * @type {Boolean}
		 * @default false
		 */
		this._antialias = antialias||false;

		/**
		 * Specifies whether or not the browser's WebGL implementation should be transparent.
		 * @property _transparent
		 * @protected
		 * @type {Boolean}
		 * @default false
		 */
		this._transparent = transparent||false;

		/**
		 * Internal value of {{#crossLink "StageGL/autoPurge"}}{{/crossLink}}
		 * @property _autoPurge
		 * @protected
		 * @type {int}
		 * @default null
		 */
		this._autoPurge = undefined;
		this.autoPurge = autoPurge;	//getter/setter handles setting the real value and validating and documentation

		/**
		 * See directDraw
		 * @property _directDraw
		 * @protected
		 * @type {Boolean}
		 * @default false
		 */
		this._directDraw = directDraw === undefined ? true : (!!directDraw);

		/**
		 * The width in px of the drawing surface saved in memory.
		 * @property _viewportWidth
		 * @protected
		 * @type {Number}
		 * @default 0
		 */
		this._viewportWidth = 0;

		/**
		 * The height in px of the drawing surface saved in memory.
		 * @property _viewportHeight
		 * @protected
		 * @type {Number}
		 * @default 0
		 */
		this._viewportHeight = 0;

		/**
		 * A 2D projection matrix used to convert WebGL's viewspace into canvas co-ordinates. Regular canvas display
		 * uses Top-Left values of [0,0] where WebGL uses a Center [0,0] Top-Right [1,1] (euclidean) system.
		 * @property _projectionMatrix
		 * @protected
		 * @type {Float32Array}
		 * @default null
		 */
		this._projectionMatrix = null;

		/**
		 * The current WebGL canvas context. Often shorthanded to just "gl" in many parts of the code.
		 * @property _webGLContext
		 * @protected
		 * @type {WebGLRenderingContext}
		 * @default null
		 */
		this._webGLContext = null;

		/**
		 * Reduce API logic by allowing stage to behave as a renderTexture target, should always be null as null is canvas.
		 * @type {null}
		 * @protected
		 */
		this._frameBuffer = null;

		/**
		 * The color to use when the WebGL canvas has been cleared. May appear as a background color. Defaults to grey.
		 * @property _clearColor
		 * @protected
		 * @type {Object}
		 * @default {r: 0.50, g: 0.50, b: 0.50, a: 0.00}
		 */
		this._clearColor = {r: 0.50, g: 0.50, b: 0.50, a: 0.00};

		/**
		 * The maximum number of verticies (6 make a single sprite) that can be drawn in one draw call. Use constructor props
		 * to modify otherwise internal buffers may be invalid sizes.
		 * @property _maxBatchVertexCount
		 * @protected
		 * @type {Number}
		 * @default StageGL.DEFAULT_MAX_BATCH_SIZE * StageGL.INDICIES_PER_CARD
		 */
		this._maxBatchVertexCount = Math.max(
			Math.min(
				Number(batchSize) || StageGL.DEFAULT_MAX_BATCH_SIZE,
				StageGL.DEFAULT_MAX_BATCH_SIZE)
			, StageGL.DEFAULT_MIN_BATCH_SIZE) * StageGL.INDICIES_PER_CARD;

		/**
		 * The shader program used to draw the current batch.
		 * @property _activeShader
		 * @protected
		 * @type {WebGLProgram}
		 * @default null
		 */
		this._activeShader = null;

		/**
		 * The non cover, per object shader used for most rendering actions.
		 * @type {WebGLProgram}
		 * @protected
		 */
		this._mainShader = null;

		/**
		 * All the different vertex attribute sets that can be used with the render buffer. Currently only internal,
		 * if/when alternate main shaders are possible, they'll register themselves here.
		 * @property _attributeConfig
		 * @protected
		 * @type {Object}
		 */
		this._attributeConfig = {};

		/**
		 * Which of the configs in {{#crossLink "StageGL/_attributeConfig:property"}}{{/crossLink}} is currently active.
		 * @property _activeConfig
		 * @protected
		 * @type {Object}
		 */
		this._activeConfig = null;

		/**
		 * One of the major render buffers used in composite blending drawing. Do not expect this to always be the same object.
		 * "What you're drawing to", object occasionally swaps with concat.
		 * @property _bufferTextureOutput
		 * @protected
		 * @type {WebGLTexture}
		 */
		this._bufferTextureOutput = null;

		/**
		 * One of the major render buffers used in composite blending drawing. Do not expect this to always be the same object.
		 * "What you've draw before now", object occasionally swaps with output.
		 * @property _bufferTextureConcat
		 * @protected
		 * @type {WebGLTexture}
		 */
		this._bufferTextureConcat = null;

		/**
		 * One of the major render buffers used in composite blending drawing.
		 * "Temporary mixing surface"
		 * @property _bufferTextureTemp
		 * @protected
		 * @type {WebGLTexture}
		 */
		this._bufferTextureTemp = null;

		/**
		 * The current render buffer being targeted, usually targets internal buffers, but may be set to cache's buffer during a cache render.
		 * @property _batchTextureOutput
		 * @protected
		 * @type {WebGLTexture | StageGL}
		 */
		this._batchTextureOutput = this;

		/**
		 * The current render buffer being targeted, usually targets internal buffers, but may be set to cache's buffer during a cache render.
		 * @property _batchTextureConcat
		 * @protected
		 * @type {WebGLTexture}
		 */
		this._batchTextureConcat = null;

		/**
		 * The current render buffer being targeted, usually targets internal buffers, but may be set to cache's buffer during a cache render.
		 * @property _batchTextureTemp
		 * @protected
		 * @type {WebGLTexture}
		 */
		this._batchTextureTemp = null;

		/**
		 * Internal library of the shaders that have been compiled and created along with their parameters. Should contain
		 * compiled `gl.ShaderProgram` and settings for `gl.blendFunc` and `gl.blendEquation`. Populated as requested.
		 *
		 * See {{#crossLink "StageGL/_updateRenderMode:method"}}{{/crossLink}} for exact details.
		 * @type {Object}
		 * @private
		 */
		this._builtShaders = {};

		/**
		 * An index based lookup of every WebGL Texture currently in use.
		 * @property _drawTexture
		 * @protected
		 * @type {Array}
		 */
		this._textureDictionary = [];

		/**
		 * A string based lookup hash of which index a texture is stored at in the dictionary. The lookup string is
		 * often the src url.
		 * @property _textureIDs
		 * @protected
		 * @type {Object}
		 */
		this._textureIDs = {};

		/**
		 * An array of all the textures currently loaded into the GPU. The index in the array matches the GPU index.
		 * @property _batchTextures
		 * @protected
		 * @type {Array}
		 */
		this._batchTextures = [];

		/**
		 * An array of all the simple filler textures used to prevent issues with missing textures in a batch.
		 * @property _baseTextures
		 * @protected
		 * @type {Array}
		 */
		this._baseTextures = [];

		/**
		 * Texture slots for a draw
		 * @property _gpuTextureCount
		 * @protected
		 * @type {uint}
		 */
		this._gpuTextureCount = 8;

		/**
		 * Texture slots on the hardware
		 * @property _gpuTextureMax
		 * @protected
		 * @type {uint}
		 */
		this._gpuTextureMax = 8;

		/**
		 * Texture slots in a batch for User textures
		 * @property _batchTextureCount
		 * @protected
		 * @type {uint}
		 */
		this._batchTextureCount = 0;

		/**
		 * The location at which the last texture was inserted into a GPU slot
		 */
		this._lastTextureInsert = -1;

		/**
		 * The current string name of the render mode being employed per Context2D spec.
		 * Must start invalid to trigger default shader into being built during init.
		 * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
		 * @type {string}
		 * @private
		 */
		this._renderMode = "";

		/**
		 * Flag indicating that the content being batched in `appendToBatch` must be drawn now and not follow batch logic.
		 * Used for effects that are compounding in nature and cannot be applied in a single pass.
		 * Should be enabled with extreme care due to massive performance implications.
		 * @type {boolean}
		 * @private
		 */
		this._immediateRender = false;

		/**
		 * Vertices drawn into the batch so far.
		 * @type {number}
		 * @private
		 */
		this._batchVertexCount = 0;

		/**
		 * The current batch being drawn, A batch consists of a call to `drawElements` on the GPU. Many of these calls
		 * can occur per draw.
		 * @property _batchId
		 * @protected
		 * @type {Number}
		 * @default 0
		 */
		this._batchID = 0;

		/**
		 * The current draw being performed, may contain multiple batches. Comparing to {{#crossLink "StageGL/_batchID:property"}}{{/crossLink}}
		 * can reveal batching efficiency.
		 * @property _drawID
		 * @protected
		 * @type {Number}
		 * @default 0
		 */
		this._drawID = 0;

		/**
		 * Tracks how many renders have occurred this draw, used for performance monitoring and empty draw avoidance.
		 * @property _renderPerDraw
		 * @protected
		 * @type {Number}
		 * @default 0
		 */
		this._renderPerDraw = 0;

		/**
		 * Used to prevent textures in certain GPU slots from being replaced by an insert.
		 * @property _slotBlackList
		 * @protected
		 * @type {Array}
		 */
		this._slotBlacklist = [];

		/**
		 * Used to ensure every canvas used as a texture source has a unique ID.
		 * @property _lastTrackedCanvas
		 * @protected
		 * @type {Number}
		 * @default 0
		 */
		this._lastTrackedCanvas = -1;

		/**
		 * Used to counter-position the object being cached so it aligns with the cache surface. Additionally ensures
		 * that all rendering starts with a top level container.
		 * @property _cacheContainer
		 * @protected
		 * @type {Container}
		 * @default An instance of an EaselJS Container.
		 */
		this._cacheContainer = new createjs.Container();

		// and begin
		this._initializeWebGL();

		// these settings require everything to be ready
		if (options !== undefined) {
			options.clearColor !== undefined && this.setClearColor(options.clearColor);
			options.premultiply !== undefined && (createjs.deprecate(null, "options.premultiply")());
		}
	}
	var p = createjs.extend(StageGL, createjs.Stage);

// static methods:
	/**
	 * Calculate the UV co-ordinate based info for sprite frames. Instead of pixel count it uses a 0-1 space. Also includes
	 * the ability to get info back for a specific frame, or only calculate that one frame.
	 *
	 *     //generate UV rects for all entries
	 *     StageGL.buildUVRects( spriteSheetA );
	 *     //generate all, fetch the first
	 *     var firstFrame = StageGL.buildUVRects( spriteSheetB, 0 );
	 *     //generate the rect for just a single frame for performance's sake
	 *     var newFrame = StageGL.buildUVRects( dynamicSpriteSheet, newFrameIndex, true );
	 *
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method buildUVRects
	 * @param  {SpriteSheet} spritesheet The spritesheet to find the frames on
	 * @param  {int} [target=-1] The index of the frame to return
	 * @param  {Boolean} [onlyTarget=false] Whether "target" is the only frame that gets calculated
	 * @static
	 * @return {Object} the target frame if supplied and present or a generic frame {t, l, b, r}
	 */
	StageGL.buildUVRects = function (spritesheet, target, onlyTarget) {
		if (!spritesheet || !spritesheet._frames) { return null; }
		if (target === undefined) { target = -1; }
		if (onlyTarget === undefined) { onlyTarget = false; }

		var start = (target !== -1 && onlyTarget)?(target):(0);
		var end = (target !== -1 && onlyTarget)?(target+1):(spritesheet._frames.length);
		for (var i=start; i<end; i++) {
			var f = spritesheet._frames[i];
			if (f.uvRect || f.image.width <= 0 || f.image.height <= 0) { continue; }

			var r = f.rect;
			f.uvRect = {
				t: 1 - (r.y / f.image.height),
				l: r.x / f.image.width,
				b: 1 - ((r.y + r.height) / f.image.height),
				r: (r.x + r.width) / f.image.width
			};
		}

		return spritesheet._frames[(target !== -1) ? target : 0].uvRect || {t:0, l:0, b:1, r:1};
	};

	/**
	 * Test a context to see if it has WebGL enabled on it.
	 * @method isWebGLActive
	 * @param {CanvasRenderingContext2D | WebGLRenderingContext} ctx The context to test
	 * @static
	 * @return {Boolean} Whether WebGL is enabled
	 */
	StageGL.isWebGLActive = function (ctx) {
		return ctx &&
			ctx instanceof WebGLRenderingContext &&
			typeof WebGLRenderingContext !== 'undefined';
	};

	/**
	 * Utility used to convert the colour values the Context2D API accepts into WebGL color values.
	 * @param {String | Number} color
	 * @static
	 * @return {Object} Object with r, g, b, a in 0-1 values of the color.
	 */
	StageGL.colorToObj = function (color) {
		var r, g, b, a;

		if (typeof color === "string") {
			if (color.indexOf("#") === 0) {
				if (color.length === 4) {
					color = "#" + color.charAt(1)+color.charAt(1) + color.charAt(2)+color.charAt(2) + color.charAt(3)+color.charAt(3)
				}
				r = Number("0x"+color.slice(1, 3))/255;
				g = Number("0x"+color.slice(3, 5))/255;
				b = Number("0x"+color.slice(5, 7))/255;
				a = color.length > 7 ? Number("0x"+color.slice(7, 9))/255 : 1;
			} else if (color.indexOf("rgba(") === 0) {
				var output = color.slice(5, -1).split(",");
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

		return {
			r: Math.min(Math.max(0, r), 1),
			g: Math.min(Math.max(0, g), 1),
			b: Math.min(Math.max(0, b), 1),
			a: Math.min(Math.max(0, a), 1)
		}
	};

// static properties:
	/**
	 * The number of properties defined per vertex (x, y, textureU, textureV, textureIndex, alpha)
	 * @property VERTEX_PROPERTY_COUNT
	 * @protected
	 * @static
	 * @final
	 * @type {Number}
	 * @default 6
	 * @readonly
	 */
	StageGL.VERTEX_PROPERTY_COUNT = 6;

	/**
	 * The number of triangle indices it takes to form a Card. 3 per triangle, 2 triangles.
	 * @property INDICIES_PER_CARD
	 * @protected
	 * @static
	 * @final
	 * @type {Number}
	 * @default 6
	 * @readonly
	 */
	StageGL.INDICIES_PER_CARD = 6;

	/**
	 * The default value for the maximum number of cards we want to process in a batch. See
	 * {{#crossLink "StageGL/WEBGL_MAX_INDEX_NUM:property"}}{{/crossLink}} for a hard limit.
	 * this value comes is designed to sneak under that limit.
	 * @property DEFAULT_MAX_BATCH_SIZE
	 * @static
	 * @final
	 * @type {Number}
	 * @default 10920
	 * @readonly
	 */
	StageGL.DEFAULT_MAX_BATCH_SIZE = 10920;

	/**
	 * The default value for the minimum number of cards we want to process in a batch. Less
	 * max cards can mean better performance, but anything below this is probably not worth it.
	 * @property DEFAULT_MIN_BATCH_SIZE
	 * @static
	 * @final
	 * @type {Number}
	 * @default 170
	 * @readonly
	 */
	StageGL.DEFAULT_MIN_BATCH_SIZE = 170;

	/**
	 * The maximum size WebGL allows for element index numbers. Uses a 16 bit unsigned integer. It takes 6 indices to
	 * make a unique card.
	 * @property WEBGL_MAX_INDEX_NUM
	 * @static
	 * @final
	 * @type {Number}
	 * @default 65536
	 * @readonly
	 */
	StageGL.WEBGL_MAX_INDEX_NUM = Math.pow(2, 16);

	/**
	 * Default UV rect for dealing with full coverage from an image source.
	 * @property UV_RECT
	 * @protected
	 * @static
	 * @final
	 * @type {Object}
	 * @default {t:0, l:0, b:1, r:1}
	 * @readonly
	 */
	StageGL.UV_RECT = {t:1, l:0, b:0, r:1};

	try {
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
		 * UV for {{#crossLink "StageGL/COVER_VERT:property"}}{{/crossLink}}.
		 * @property COVER_UV
		 * @static
		 * @final
		 * @type {Float32Array}
		 * @readonly
		 */
		StageGL.COVER_UV = new Float32Array([
			 0,		 1,		//TL
			 1,		 1,		//TR
			 0,		 0,		//BL
			 1,		 1,		//TR
			 1,		 0,		//BR
			 0,		 0		//BL
		]);
	} catch(e) { /* Breaking in older browsers, but those browsers wont run StageGL so no recovery or warning needed */ }

	/**
	 * Portion of the shader that contains the "varying" properties required in both vertex and fragment shaders. The
	 * regular shader is designed to render all expected objects. Shader code may contain templates that are replaced
	 * pre-compile.
	 * @property REGULAR_VARYING_HEADER
	 * @protected
	 * @static
	 * @final
	 * @type {String}
	 * @readonly
	 */
	StageGL.REGULAR_VARYING_HEADER = (
		"#ifdef GL_FRAGMENT_PRECISION_HIGH \n"+
		"precision highp float; \n"+
		"#else \n"+
		"precision mediump float; \n"+
		"#endif \n"+

		"varying vec2 vTextureCoord;" +
		"varying lowp float indexPicker;" +
		"varying lowp float alphaValue;"
	);

	/**
	 * Actual full header for the vertex shader. Includes the varying header. The regular shader is designed to render
	 * all expected objects. Shader code may contain templates that are replaced pre-compile.
	 * @property REGULAR_VERTEX_HEADER
	 * @protected
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
	 * Actual full header for the fragment shader. Includes the varying header. The regular shader is designed to render
	 * all expected objects. Shader code may contain templates that are replaced pre-compile.
	 * @property REGULAR_FRAGMENT_HEADER
	 * @protected
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
	 * Body of the vertex shader. The regular shader is designed to render all expected objects. Shader code may contain
	 * templates that are replaced pre-compile.
	 * @property REGULAR_VERTEX_BODY
	 * @protected
	 * @static
	 * @final
	 * @type {String}
	 * @readonly
	 */
	StageGL.REGULAR_VERTEX_BODY  = (
		"void main(void) {" +
			"gl_Position = pMatrix * vec4(vertexPosition.x, vertexPosition.y, 0.0, 1.0);" +
			"alphaValue = objectAlpha;" +
			"indexPicker = textureIndex;" +
			"vTextureCoord = uvPosition;" +
		"}"
	);

	/**
	 * Body of the fragment shader. The regular shader is designed to render all expected objects. Shader code may
	 * contain templates that are replaced pre-compile.
	 * @property REGULAR_FRAGMENT_BODY
	 * @protected
	 * @static
	 * @final
	 * @type {String}
	 * @readonly
	 */
	StageGL.REGULAR_FRAGMENT_BODY = (
		"void main(void) {" +
			"vec4 color = vec4(1.0, 0.0, 0.0, 1.0);" +

			"if (indexPicker <= 0.5) {" +
				"color = texture2D(uSampler[0], vTextureCoord);" +
				"{{alternates}}" +
			"}" +

			"gl_FragColor = vec4(color.rgb * alphaValue, color.a * alphaValue);" +
		"}"
	);

	/**
	 * Portion of the shader that contains the "varying" properties required in both vertex and fragment shaders. The
	 * cover shader is designed to be a simple vertex/uv only texture render that covers the render surface. Shader
	 * code may contain templates that are replaced pre-compile.
	 * @property COVER_VARYING_HEADER
	 * @protected
	 * @static
	 * @final
	 * @type {String}
	 * @readonly
	 */
	StageGL.COVER_VARYING_HEADER = (
		"#ifdef GL_FRAGMENT_PRECISION_HIGH \n"+
		"precision highp float; \n"+
		"#else \n"+
		"precision mediump float; \n"+
		"#endif \n"+

		"varying vec2 vTextureCoord;"
	);

	/**
	 * Actual full header for the vertex shader. Includes the varying header. The cover shader is designed to be a
	 * simple vertex/uv only texture render that covers the render surface. Shader code may contain templates that are
	 * replaced pre-compile.
	 * @property COVER_VERTEX_HEADER
	 * @protected
	 * @static
	 * @final
	 * @type {String}
	 * @readonly
	 */
	StageGL.COVER_VERTEX_HEADER = (
		StageGL.COVER_VARYING_HEADER +
		"attribute vec2 vertexPosition;" +
		"attribute vec2 uvPosition;"
	);

	/**
	 * Actual full header for the fragment shader. Includes the varying header. The cover shader is designed to be a
	 * simple vertex/uv only texture render that covers the render surface. Shader code may contain templates that are
	 * replaced pre-compile.
	 * @property COVER_FRAGMENT_HEADER
	 * @protected
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
	 * Body of the vertex shader. The cover shader is designed to be a simple vertex/uv only texture render that covers
	 * the render surface. Shader code may contain templates that are replaced pre-compile.
	 * @property COVER_VERTEX_BODY
	 * @protected
	 * @static
	 * @final
	 * @type {String}
	 * @readonly
	 */
	StageGL.COVER_VERTEX_BODY  = (
		"void main(void) {" +
			"gl_Position = vec4(vertexPosition.x, vertexPosition.y, 0.0, 1.0);" +
			"vTextureCoord = uvPosition;" +
		"}"
	);

	/**
	 * Body of the fragment shader. The cover shader is designed to be a simple vertex/uv only texture render that
	 * covers the render surface. Shader code may contain templates that are replaced pre-compile.
	 * @property COVER_FRAGMENT_BODY
	 * @protected
	 * @static
	 * @final
	 * @type {String}
	 * @readonly
	 */
	StageGL.COVER_FRAGMENT_BODY = (
		"void main(void) {" +
			"gl_FragColor = texture2D(uSampler, vTextureCoord);" +
		"}"
	);

	/**
	 * The starting template of a cover fragment shader with simple blending equations
	 * @property BLEND_FRAGMENT_SIMPLE
	 * @protected
	 * @static
	 * @final
	 * @type {String}
	 * @readonly
	 */
	StageGL.BLEND_FRAGMENT_SIMPLE = (
		"uniform sampler2D uMixSampler;"+
		"void main(void) {" +
			"vec4 src = texture2D(uMixSampler, vTextureCoord);" +
			"vec4 dst = texture2D(uSampler, vTextureCoord);"
		// note this is an open bracket on main!
	);

	/**
	 * The starting template of a cover fragment shader which has complex blending equations
	 * @property BLEND_FRAGMENT_COMPLEX
	 * @protected
	 * @static
	 * @final
	 * @type {String}
	 * @readonly
	 */
	StageGL.BLEND_FRAGMENT_COMPLEX = (
		StageGL.BLEND_FRAGMENT_SIMPLE +
			"vec3 srcClr = min(src.rgb/src.a, 1.0);" +
			"vec3 dstClr = min(dst.rgb/dst.a, 1.0);" +

			"float totalAlpha = min(1.0 - (1.0-dst.a) * (1.0-src.a), 1.0);" +
			"float srcFactor = min(max(src.a - dst.a, 0.0) / totalAlpha, 1.0);" +
			"float dstFactor = min(max(dst.a - src.a, 0.0) / totalAlpha, 1.0);" +
			"float mixFactor = max(max(1.0 - srcFactor, 0.0) - dstFactor, 0.0);" +

			"gl_FragColor = vec4(" +
				"(" +
					"srcFactor * srcClr +" +
					"dstFactor * dstClr +" +
					"mixFactor * vec3("
		// this should be closed with the cap!
	);

	/**
	 * The closing portion of a template for a cover fragment shader which has complex blending equations
	 * @property BLEND_FRAGMENT_COMPLEX_CAP
	 * @protected
	 * @static
	 * @final
	 * @type {String}
	 * @readonly
	 */
	StageGL.BLEND_FRAGMENT_COMPLEX_CAP = (
					")" +
				") * totalAlpha, totalAlpha" +
			");" +
		"}"
	);

	/**
	 * A shader utility function, used to calculate the "overlay" blend of two elements
	 * @property BLEND_FRAGMENT_OVERLAY_UTIL
	 * @protected
	 * @static
	 * @final
	 * @type {String}
	 * @readonly
	 */
	StageGL.BLEND_FRAGMENT_OVERLAY_UTIL = (
		"float overlay(float a, float b) {" +
			"if(a < 0.5) { return 2.0 * a * b; }" +
			"return 1.0 - 2.0 * (1.0-a) * (1.0-b);" +
		"}"
	);

	/**
	 * A collection of shader utility functions, used to calculate HSL math. Taken from W3C spec
	 * https://www.w3.org/TR/compositing-1/#blendingnonseparable
	 * @property BLEND_FRAGMENT_HSL_UTIL
	 * @protected
	 * @static
	 * @final
	 * @type {String}
	 * @readonly
	 */
	StageGL.BLEND_FRAGMENT_HSL_UTIL = (
		"float getLum(vec3 c) { return 0.299*c.r + 0.589*c.g + 0.109*c.b; }" +
		"float getSat(vec3 c) { return max(max(c.r, c.g), c.b) - min(min(c.r, c.g), c.b); }" +
		"vec3 clipHSL(vec3 c) {" +
			"float lum = getLum(c);" +
			"float n = min(min(c.r, c.g), c.b);" +
			"float x = max(max(c.r, c.g), c.b);" +
			"if(n < 0.0){ c = lum + (((c - lum) * lum) / (lum - n)); }" +
			"if(x > 1.0){ c = lum + (((c - lum) * (1.0 - lum)) / (x - lum)); }" +
			"return clamp(c, 0.0, 1.0);" +
		"}" +
		"vec3 setLum(vec3 c, float lum) {" +
			"return clipHSL(c + (lum - getLum(c)));" +
		"}" +
		"vec3 setSat(vec3 c, float val) {" +
			"vec3 result = vec3(0.0);" +
			"float minVal = min(min(c.r, c.g), c.b);" +
			"float maxVal = max(max(c.r, c.g), c.b);" +
			"vec3 minMask = vec3(c.r == minVal, c.g == minVal, c.b == minVal);" +
			"vec3 maxMask = vec3(c.r == maxVal, c.g == maxVal, c.b == maxVal);" +
			"vec3 midMask = 1.0 - min(minMask+maxMask, 1.0);" +
			"float midVal = (c*midMask).r + (c*midMask).g + (c*midMask).b;" +
			"if(maxVal > minVal) {" +
				"result = midMask * min( ((midVal - minVal) * val) / (maxVal - minVal), 1.0);" +
				"result += maxMask * val;" +
			"}" +
			"return result;" +
		"}"
	);

	/**
	 * The hash of supported blend modes and their properties
	 * @property BLEND_SOURCES
	 * @static
	 * @final
	 * @type {Object}
	 * @readonly
	 */
	StageGL.BLEND_SOURCES = {
		"source-over": { // empty object verifies it as a blend mode, but default values handle actual settings
			//eqRGB: "FUNC_ADD",						eqA: "FUNC_ADD"
			//srcRGB: "ONE",							srcA: "ONE"
			//dstRGB: "ONE_MINUS_SRC_ALPHA",			dstA: "ONE_MINUS_SRC_ALPHA"
		},
		"source-in": {
			shader: (StageGL.BLEND_FRAGMENT_SIMPLE +
				"gl_FragColor = vec4(src.rgb * dst.a, src.a * dst.a);" +
			"}")
		},
		"source-in_cheap": {
			srcRGB: "DST_ALPHA",					srcA: "ZERO",
			dstRGB: "ZERO",							dstA: "SRC_ALPHA"
		},
		"source-out": {
			shader: (StageGL.BLEND_FRAGMENT_SIMPLE +
				"gl_FragColor = vec4(src.rgb * (1.0 - dst.a), src.a - dst.a);" +
			"}")
		},
		"source-out_cheap": {
			eqA: "FUNC_SUBTRACT",
			srcRGB: "ONE_MINUS_DST_ALPHA",			srcA: "ONE",
			dstRGB: "ZERO",							dstA: "SRC_ALPHA"
		},
		"source-atop": {
			srcRGB: "DST_ALPHA",					srcA: "ZERO",
			dstRGB: "ONE_MINUS_SRC_ALPHA",			dstA: "ONE"
		},
		"destination-over": {
			srcRGB: "ONE_MINUS_DST_ALPHA",			srcA: "ONE_MINUS_DST_ALPHA",
			dstRGB: "ONE",							dstA: "ONE"
		},
		"destination-in": {
			shader: (StageGL.BLEND_FRAGMENT_SIMPLE +
				"gl_FragColor = vec4(dst.rgb * src.a, src.a * dst.a);" +
			"}")
		},
		"destination-in_cheap": {
			srcRGB: "ZERO",							srcA: "DST_ALPHA",
			dstRGB: "SRC_ALPHA",					dstA: "ZERO"
		},
		"destination-out": {
			eqA: "FUNC_REVERSE_SUBTRACT",
			srcRGB: "ZERO",							srcA: "DST_ALPHA",
			dstRGB: "ONE_MINUS_SRC_ALPHA",			dstA: "ONE"
		},
		"destination-atop": {
			shader: (StageGL.BLEND_FRAGMENT_SIMPLE +
				"gl_FragColor = vec4(dst.rgb * src.a + src.rgb * (1.0 - dst.a), src.a);" +
			"}")
		},
		"destination-atop_cheap": {
			srcRGB: "ONE_MINUS_DST_ALPHA",			srcA: "ONE",
			dstRGB: "SRC_ALPHA",					dstA: "ZERO"
		},
		"copy": {
			shader: (StageGL.BLEND_FRAGMENT_SIMPLE +
				"gl_FragColor = vec4(src.rgb, src.a);" +
			"}")
		},
		"copy_cheap": {
			dstRGB: "ZERO",							dstA: "ZERO"
		},
		"xor": {
			shader: (StageGL.BLEND_FRAGMENT_SIMPLE +
				"float omSRC = (1.0 - src.a);" +
				"float omDST = (1.0 - dst.a);" +
				"gl_FragColor = vec4(src.rgb * omDST + dst.rgb * omSRC, src.a * omDST + dst.a * omSRC);"
			+ "}")
		},

		"multiply": { // this has to be complex to handle retention of both dst and src in non mixed scenarios
			shader: (StageGL.BLEND_FRAGMENT_COMPLEX +
				"srcClr * dstClr"
			+ StageGL.BLEND_FRAGMENT_COMPLEX_CAP)
		},
		"multiply_cheap": { // NEW, handles retention of src data incorrectly when no dst data present
			srcRGB: "ONE_MINUS_DST_ALPHA",			srcA: "ONE",
			dstRGB: "SRC_COLOR",					dstA: "ONE"
		},
		"screen": {
			srcRGB: "ONE",							srcA: "ONE",
			dstRGB: "ONE_MINUS_SRC_COLOR",			dstA: "ONE_MINUS_SRC_ALPHA"
		},
		"lighter": {
			dstRGB: "ONE",							dstA:"ONE"
		},
		"lighten": { //WebGL 2.0 can optimize this
			shader: (StageGL.BLEND_FRAGMENT_COMPLEX +
				"max(srcClr, dstClr)"
			+ StageGL.BLEND_FRAGMENT_COMPLEX_CAP)
		},
		"darken": { //WebGL 2.0 can optimize this
			shader: (StageGL.BLEND_FRAGMENT_COMPLEX +
				"min(srcClr, dstClr)"
			+ StageGL.BLEND_FRAGMENT_COMPLEX_CAP)
		},

		"overlay": {
			shader: (StageGL.BLEND_FRAGMENT_OVERLAY_UTIL + StageGL.BLEND_FRAGMENT_COMPLEX +
				"overlay(dstClr.r,srcClr.r), overlay(dstClr.g,srcClr.g), overlay(dstClr.b,srcClr.b)"
			+ StageGL.BLEND_FRAGMENT_COMPLEX_CAP)
		},
		"hard-light": {
			shader: (StageGL.BLEND_FRAGMENT_OVERLAY_UTIL + StageGL.BLEND_FRAGMENT_COMPLEX +
				"overlay(srcClr.r,dstClr.r), overlay(srcClr.g,dstClr.g), overlay(srcClr.b,dstClr.b)"
			+ StageGL.BLEND_FRAGMENT_COMPLEX_CAP)
		},
		"soft-light": {
			shader: (
				"float softcurve(float a) {" +
					"if(a > 0.25) { return sqrt(a); }" +
					"return ((16.0 * a - 12.0) * a + 4.0) * a;" +
				"}" +
				"float softmix(float a, float b) {" +
					"if(b <= 0.5) { return a - (1.0 - 2.0*b) * a * (1.0 - a); }" +
					"return a + (2.0 * b - 1.0) * (softcurve(a) - a);" +
				"}" + StageGL.BLEND_FRAGMENT_COMPLEX +
				"softmix(dstClr.r,srcClr.r), softmix(dstClr.g,srcClr.g), softmix(dstClr.b,srcClr.b)"
			+ StageGL.BLEND_FRAGMENT_COMPLEX_CAP)
		},
		"color-dodge": {
			shader: (StageGL.BLEND_FRAGMENT_COMPLEX +
				"clamp(dstClr / (1.0 - srcClr), 0.0, 1.0)"
			+ StageGL.BLEND_FRAGMENT_COMPLEX_CAP)
		},
		"color-burn": {
			shader: (StageGL.BLEND_FRAGMENT_COMPLEX +
				"1.0 - clamp((1.0 - smoothstep(0.0035, 0.9955, dstClr)) / smoothstep(0.0035, 0.9955, srcClr), 0.0, 1.0)"
			+ StageGL.BLEND_FRAGMENT_COMPLEX_CAP)
		},
		"difference": { // do this to match visible results in browsers
			shader: (StageGL.BLEND_FRAGMENT_COMPLEX +
				"abs(src.rgb - dstClr)"
			+ StageGL.BLEND_FRAGMENT_COMPLEX_CAP)
		},
		"exclusion": { // do this to match visible results in browsers
			shader: (StageGL.BLEND_FRAGMENT_COMPLEX +
				"dstClr + src.rgb - 2.0 * src.rgb * dstClr"
			+ StageGL.BLEND_FRAGMENT_COMPLEX_CAP)
		},

		"hue": {
			shader: (StageGL.BLEND_FRAGMENT_HSL_UTIL + StageGL.BLEND_FRAGMENT_COMPLEX +
				"setLum(setSat(srcClr, getSat(dstClr)), getLum(dstClr))"
			+ StageGL.BLEND_FRAGMENT_COMPLEX_CAP)
		},
		"saturation": {
			shader: (StageGL.BLEND_FRAGMENT_HSL_UTIL + StageGL.BLEND_FRAGMENT_COMPLEX +
				"setLum(setSat(dstClr, getSat(srcClr)), getLum(dstClr))"
			+ StageGL.BLEND_FRAGMENT_COMPLEX_CAP)
		},
		"color": {
			shader: (StageGL.BLEND_FRAGMENT_HSL_UTIL + StageGL.BLEND_FRAGMENT_COMPLEX +
				"setLum(srcClr, getLum(dstClr))"
			+ StageGL.BLEND_FRAGMENT_COMPLEX_CAP)
		},
		"luminosity": {
			shader: (StageGL.BLEND_FRAGMENT_HSL_UTIL + StageGL.BLEND_FRAGMENT_COMPLEX +
				"setLum(dstClr, getLum(srcClr))"
			+ StageGL.BLEND_FRAGMENT_COMPLEX_CAP)
		}
	};

// events:
	/**
	 * Dispatched each update immediately before the canvas is cleared and the display list is drawn to it. You can call
	 * {{#crossLink "Event/preventDefault"}}{{/crossLink}} on the event to cancel the draw.
	 * @event drawstart
	 */

	/**
	 * Dispatched each update immediately after the display list is drawn to the canvas and the canvas context is restored.
	 * @event drawend
	 */

// getter / setters:
	p._get_isWebGL = function () {
		return !!this._webGLContext;
	};

	p._set_autoPurge = function (value) {
		value = isNaN(value)?1200:value;
		if (value !== -1) {
			value = value<10?10:value;
		}
		this._autoPurge = value;
	};
	p._get_autoPurge = function () {
		return Number(this._autoPurge);
	};

	try {
		Object.defineProperties(p, {
			/**
			 * Indicates whether WebGL is being used for rendering. For example, this would be `false` if WebGL is not
			 * supported in the browser.
			 * @property isWebGL
			 * @type {Boolean}
			 * @readonly
			 */
			isWebGL: { get: p._get_isWebGL },

			/**
			 * Specifies whether or not StageGL is automatically purging unused textures. Higher numbers purge less
			 * often. Values below 10 are upgraded to 10, and -1 disables this feature. If you are not dynamically adding
			 * and removing new images this can be se9000t to -1, and should be for performance reasons. If you only add images,
			 * or add and remove the same images for the entire application, it is safe to turn off this feature. Alternately,
			 * manually manage removing textures yourself with {{#crossLink "StageGL/releaseTexture"}}{{/crossLink}}
			 * @property autoPurge
			 * @type {int}
			 * @default 1000
			 */
			autoPurge: { get: p._get_autoPurge, set: p._set_autoPurge }
		});
	} catch (e) {} // TODO: use Log


// constructor methods:
	/**
	 * Create and properly initialize the WebGL instance.
	 * @method _initializeWebGL
	 * @protected
	 * @return {WebGLRenderingContext}
	 */
	p._initializeWebGL = function () {
		if (this.canvas) {
			if (!this._webGLContext || this._webGLContext.canvas !== this.canvas) {
				// A context hasn't been defined yet,
				// OR the defined context belongs to a different canvas, so reinitialize.

				// defaults and options
				var options = {
					depth: false, // nothing has depth
					stencil: false, // while there's uses for this, we're not using any yet
					premultipliedAlpha: this._transparent, // this is complicated, trust it

					alpha: this._transparent,
					antialias: this._antialias,
					preserveDrawingBuffer: this._preserveBuffer
				};

				var gl = this._webGLContext = this._fetchWebGLContext(this.canvas, options);
				if (!gl) { return null; }

				gl.disable(gl.DEPTH_TEST);
				gl.depthMask(false);
				gl.enable(gl.BLEND);
				gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
				gl.clearColor(0.0, 0.0, 0.0, 0);
				gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
				gl.blendFuncSeparate(gl.ONE, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

				this._createBuffers();
				this._initMaterials();
				this._updateRenderMode("source-over");

				this.updateViewport(this.canvas.width, this.canvas.height);
				if (!this._directDraw) {
					this._bufferTextureOutput = this.getRenderBufferTexture(this._viewportWidth, this._viewportHeight);
				}

				this.canvas._invalid = true;
			}
		} else {
			this._webGLContext = null;
		}
		return this._webGLContext;
	};

// public methods:
	// Docced in superclass
	p.update = function (props) {
		if (!this.canvas) { return; }
		if (this.tickOnUpdate) { this.tick(props); }
		this.dispatchEvent("drawstart");

		if (this._webGLContext) {
			this.draw(this._webGLContext, false);
		} else {
			// Use 2D.
			if (this.autoClear) { this.clear(); }
			var ctx = this.canvas.getContext("2d");
			ctx.save();
			this.updateContext(ctx);
			this.draw(ctx, false);
			ctx.restore();
		}
		this.dispatchEvent("drawend");
	};

	// Docced in superclass
	p.clear = function () {
		if (!this.canvas) { return; }

		var gl = this._webGLContext;
		if (!StageGL.isWebGLActive(gl)) { // Use 2D.
			this.Stage_clear();
			return;
		}

		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		this._clearFrameBuffer(this._transparent ? this._clearColor.a : 1);
	};

	/**
	 * Draws the stage into the supplied context if possible. Many WebGL properties only exist on their context. As such
	 * you cannot share contexts among many StageGLs and each context requires a unique StageGL instance. Contexts that
	 * don't match the context managed by this StageGL will be treated as a 2D context.
	 *
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method draw
	 * @param {CanvasRenderingContext2D | WebGLRenderingContext} context The context object to draw into.
	 * @param {Boolean} [ignoreCache=false] Indicates whether the draw operation should ignore any current cache. For
	 *  example, used for drawing the cache (to prevent it from simply drawing an existing cache back into itself).
	 * @return {Boolean} If the draw was handled by this function
	 */
	p.draw = function (context, ignoreCache) {
		var gl = this._webGLContext;
		// 2D context fallback
		if (!(context === this._webGLContext && StageGL.isWebGLActive(gl))) {
			return this.Stage_draw(context, ignoreCache);
		}

		var storeBatchOutput = this._batchTextureOutput;
		var storeBatchConcat = this._batchTextureConcat;
		var storeBatchTemp = this._batchTextureTemp;

		// Use WebGL
		this._renderPerDraw = 0;
		this._batchVertexCount = 0;
		this._drawID++;

		if (this._directDraw) {
			this._batchTextureOutput = this;
			if (this.autoClear) { this.clear(); }
		} else {
			this._batchTextureOutput = this._bufferTextureOutput;
			this._batchTextureConcat = this._bufferTextureConcat;
			this._batchTextureTemp = this._bufferTextureTemp;
		}

		this._updateRenderMode("source-over");
		this._drawContent(this, ignoreCache);

		if (!this._directDraw) {
			if (this.autoClear) { this.clear(); }
			this.batchReason = "finalOutput";
			if(this._renderPerDraw) {
				this._drawCover(null, this._batchTextureOutput);
			}
		}

		// batches may generate or swap around textures. To be sure we capture them, store them back into buffer
		this._bufferTextureOutput = this._batchTextureOutput;
		this._bufferTextureConcat = this._batchTextureConcat;
		this._bufferTextureTemp = this._batchTextureTemp;

		this._batchTextureOutput = storeBatchOutput;
		this._batchTextureConcat = storeBatchConcat;
		this._batchTextureTemp = storeBatchTemp;

		if (this._autoPurge !== -1 && !(this._drawID%((this._autoPurge/2)|0))) {
			this.purgeTextures(this._autoPurge);
		}

		return true;
	};

	/**
	 * Draws the target into the correct context, be it a canvas or Render Texture using WebGL.
	 *
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method cacheDraw
	 * @param {DisplayObject} target The object we're drawing into cache.
	 * For example, used for drawing the cache (to prevent it from simply drawing an existing cache back into itself).
	 * @param {BitmapCache} manager The BitmapCache instance looking after the cache
	 * @return {Boolean} If the draw was handled by this function
	 */
	p.cacheDraw = function (target, manager) {
		// 2D context fallback
		if (!StageGL.isWebGLActive(this._webGLContext)) {
			return false;
		}

		for (var i = 0; i < this._gpuTextureCount; i++) {
			if(this._batchTextures[i]._frameBuffer) {
				this._batchTextures[i] = this._baseTextures[i];
			}
		}

		var storeBatchOutput = this._batchTextureOutput;
		var storeBatchConcat = this._batchTextureConcat;
		var storeBatchTemp = this._batchTextureTemp;

		var filterCount = manager._filterCount, filtersLeft = filterCount;
		var backupWidth = this._viewportWidth, backupHeight = this._viewportHeight;
		this._updateDrawingSurface(manager._drawWidth, manager._drawHeight);

		this._batchTextureOutput = (manager._filterCount%2) ? manager._bufferTextureConcat : manager._bufferTextureOutput;
		this._batchTextureConcat = (manager._filterCount%2) ? manager._bufferTextureOutput : manager._bufferTextureConcat;
		this._batchTextureTemp = manager._bufferTextureTemp;

		var container = this._cacheContainer;
		container.children = [target];
		container.transformMatrix = this._alignTargetToCache(target, manager);

		this._updateRenderMode("source-over");
		this._drawContent(container, true);

		// re-align buffers with fake filter passes to solve certain error cases
		if (this.isCacheControlled) {
			// post filter pass to place content into output buffer
			//TODO: add in directDraw support for cache controlled StageGLs
			filterCount++;
			filtersLeft++;
		} else if (manager._cacheCanvas !== ((manager._filterCount%2) ? this._batchTextureConcat : this._batchTextureOutput)) {
			// pre filter pass to align output, may of become misaligned due to composite operations
			filtersLeft++;
		}

		while (filtersLeft) { //warning: pay attention to where filtersLeft is modified, this is a micro-optimization
			var filter = manager._getGLFilter(filterCount - (filtersLeft--));
			var swap = this._batchTextureConcat;
			this._batchTextureConcat = this._batchTextureOutput;
			this._batchTextureOutput = (this.isCacheControlled && filtersLeft === 0) ? this : swap;
			this.batchReason = "filterPass";
			this._drawCover(this._batchTextureOutput._frameBuffer, this._batchTextureConcat, filter);
		}

		manager._bufferTextureOutput = this._batchTextureOutput;
		manager._bufferTextureConcat = this._batchTextureConcat;
		manager._bufferTextureTemp = this._batchTextureTemp;

		this._batchTextureOutput = storeBatchOutput;
		this._batchTextureConcat = storeBatchConcat;
		this._batchTextureTemp = storeBatchTemp;

		this._updateDrawingSurface(backupWidth, backupHeight);
		return true;
	};

	/**
	 * For every image encountered StageGL registers and tracks it automatically. This tracking can cause memory leaks 
	 * if not purged. StageGL, by default, automatically purges them. This does have a cost and may unfortunately find
	 * false positives. This function is for manual management of this memory instead of the automatic system controlled
	 * by the {{#crossLink "StageGL/autoPurge:property"}}{{/crossLink}} property.
	 *
	 * This function will recursively remove all textures found on the object, its children, cache, etc. It will uncache 
	 * objects and remove any texture it finds REGARDLESS of whether it is currently in use elsewhere. It is up to the
	 * developer to ensure that a texture in use is not removed.
	 *
	 * Textures in use, or to be used again shortly, should not be removed. This is simply for performance reasons.
	 * Removing a texture in use will cause the texture to end up being re-uploaded slowing rendering.
	 * @method releaseTexture
	 * @param {DisplayObject | WebGLTexture | Image | Canvas} item An object that used the texture to be discarded.
	 * @param {Boolean} [safe=false] Should the release attempt to be "safe" and only delete this usage.
	 */
	p.releaseTexture = function (item, safe) {
		var i, l;
		if (!item) { return; }

		// this is a container object
		if (item.children) {
			for (i = 0, l = item.children.length; i < l; i++) {
				this.releaseTexture(item.children[i], safe);
			}
		}

		// this has a cache canvas
		if (item.cacheCanvas) {
			item.uncache();
		}

		var foundImage = undefined;
		if (item._storeID !== undefined) {
			// this is a texture itself
			if (item === this._textureDictionary[item._storeID]) {
				this._killTextureObject(item);
				item._storeID = undefined;
				return;
			}

			// this is an image or canvas
			foundImage = item;
		} else if (item._webGLRenderStyle === 2) {
			// this is a Bitmap class
			foundImage = item.image;
			if (foundImage.getImage) { foundImage = foundImage.getImage(); }
		} else if (item._webGLRenderStyle === 1) {
			// this is a SpriteSheet, we can't tell which image we used from the list easily so remove them all!
			for (i = 0, l = item.spriteSheet._images.length; i < l; i++) {
				this.releaseTexture(item.spriteSheet._images[i], safe);
			}
			return;
		}

		// did we find anything
		if (foundImage === undefined) {
			if (this.vocalDebug) {
				console.log("No associated texture found on release");
			}
			return;
		}

		// remove it
		var texture = this._textureDictionary[foundImage._storeID];
		if (safe) {
			var data = texture._imageData;
			var index = data.indexOf(foundImage);
			if (index >= 0) { data.splice(index, 1); }
			foundImage._storeID = undefined;
			if (data.length === 0) { this._killTextureObject(texture); }
		} else {
			this._killTextureObject(texture);
		}
	};

	/**
	 * Similar to {{#crossLink "releaseTexture"}}{{/crossLink}}, but this function differs by searching for textures to
	 * release. It works by assuming that it can purge any texture which was last used more than "count" draw calls ago.
	 * Because this process is unaware of the objects and whether they may be used later on your stage, false positives can
	 * occur. It is recommended to manually manage your memory with {{#crossLink "StageGL/releaseTexture"}}{{/crossLink}},
	 * however, there are many use cases where this is simpler and error-free. This process is also run by default under
	 * the hood to prevent leaks. To disable it see the {{#crossLink "StageGL/autoPurge:property"}}{{/crossLink}} property.
	 * @method purgeTextures
	 * @param {Number} [count=100] How many renders ago the texture was last used
	 */
	p.purgeTextures = function (count) {
		if (!(count >= 0)){ count = 100; }

		var dict = this._textureDictionary;
		var l = dict.length;
		for (var i = 0; i<l; i++) {
			var data, texture = dict[i];
			if (!texture || !(data = texture._imageData)) { continue; }

			for (var j = 0; j<data.length; j++) {
				var item = data[j];
				if (item._drawID + count <= this._drawID) {
					item._storeID = undefined;
					data.splice(j, 1);
					j--;
				}
			}

			if (!data.length) { this._killTextureObject(texture); }
		}
	};

	/**
	 * Update the WebGL viewport. Note that this does <strong>not</strong> update the canvas element's width/height, but
	 * the render surface's instead. This is necessary after manually resizing the canvas element on the DOM to avoid a
	 * up/down scaled render.
	 * @method updateViewport
	 * @param {int} width The width of the render surface in pixels.
	 * @param {int} height The height of the render surface in pixels.
	 */
	p.updateViewport = function (width, height) {
		width = Math.abs(width|0) || 1;
		height = Math.abs(height|0) || 1;

		this._updateDrawingSurface(width, height);

		if (this._bufferTextureOutput !== this && this._bufferTextureOutput !== null) {
			this.resizeTexture(this._bufferTextureOutput, this._viewportWidth, this._viewportHeight);
		}
		if (this._bufferTextureConcat !== null) {
			this.resizeTexture(this._bufferTextureConcat, this._viewportWidth, this._viewportHeight);
		}
		if (this._bufferTextureTemp !== null) {
			this.resizeTexture(this._bufferTextureTemp, this._viewportWidth, this._viewportHeight);
		}
	};

	/**
	 * Fetches the shader compiled and set up to work with the provided filter/object. The shader is compiled on first
	 * use and returned on subsequent calls.
	 * @method getFilterShader
	 * @param  {Filter|Object} filter The object which will provide the information needed to construct the filter shader.
	 * @return {WebGLProgram}
	 */
	p.getFilterShader = function (filter) {
		if (!filter) { filter = this; }

		var gl = this._webGLContext;
		var targetShader = this._activeShader;

		if (filter._builtShader) {
			targetShader = filter._builtShader;
			if (filter.shaderParamSetup) {
				gl.useProgram(targetShader);
				filter.shaderParamSetup(gl, this, targetShader);
			}
		} else {
			try {
				targetShader = this._fetchShaderProgram(
					true, filter.VTX_SHADER_BODY, filter.FRAG_SHADER_BODY,
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
	 * Returns a base texture that has no image or data loaded. Not intended for loading images. It may return `null`
	 * in some error cases, and trying to use a "null" texture can cause renders to fail.
	 * @method getBaseTexture
	 * @param  {uint} [w=1] The width of the texture in pixels, defaults to 1
	 * @param  {uint} [h=1] The height of the texture in pixels, defaults to 1
	 */
	p.getBaseTexture = function (w, h) {
		var width = Math.ceil(w > 0 ? w : 1) || 1;
		var height = Math.ceil(h > 0 ? h : 1) || 1;

		var gl = this._webGLContext;
		var texture = gl.createTexture();
		this.resizeTexture(texture, width, height);
		this.setTextureParams(gl, false);

		return texture;
	};

	/**
	 * Resizes a supplied texture element. May generate invalid textures in some error cases such as; when the texture
	 * is too large, when an out of texture memory error occurs, or other error scenarios. Trying to use an invalid texture
	 * can cause renders to hard stop on some devices. Check the WebGL bound texture after running this function.
	 *
	 * NOTE: The supplied texture must have been made with the WebGL "texImage2D" function, all default APIs in StageGL
	 * use this, so this note only matters for library developers and plugins.
	 *
	 * @protected
	 * @method resizeTexture
	 * @param  {WebGLTexture} texture The GL Texture to be modified.
	 * @param  {uint} width The width of the texture in pixels
	 * @param  {uint} height The height of the texture in pixels
	 */
	p.resizeTexture = function (texture, width,height) {
		if (texture.width === width && texture.height === height){ return; }

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

		// set its width and height for spoofing as an image and tracking
		texture.width = width;
		texture.height = height;
	};

	/**
	 * Returns a base texture (see {{#crossLink "StageGL/getBaseTexture"}}{{/crossLink}}) for details. Also includes an
	 * attached and linked render buffer in `texture._frameBuffer`. RenderTextures can be thought of as an internal
	 * canvas on the GPU that can be drawn to. Being internal to the GPU they are much faster than "offscreen canvases".
	 * @method getRenderBufferTexture
	 * @param  {Number} w The width of the texture in pixels.
	 * @param  {Number} h The height of the texture in pixels.
	 * @return {WebGLTexture} the basic texture instance with a render buffer property.
	 */
	p.getRenderBufferTexture = function (w, h) {
		var gl = this._webGLContext;

		var renderTexture = this.getBaseTexture(w, h);
		if (!renderTexture) { return null; }

		var frameBuffer = gl.createFramebuffer();
		if (!frameBuffer) { return null; }

		// set its width and height for spoofing as an image and tracking
		renderTexture.width = w;
		renderTexture.height = h;

		// attach frame buffer to texture and provide cross links to look up each other
		gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, renderTexture, 0);
		frameBuffer._renderTexture = renderTexture;
		renderTexture._frameBuffer = frameBuffer;

		// these keep track of themselves simply to reduce complexity of some lookup code
		renderTexture._storeID = this._textureDictionary.length;
		this._textureDictionary[renderTexture._storeID] = renderTexture;

		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		return renderTexture;
	};

	/**
	 * Common utility function used to apply the correct texture processing parameters for the bound texture.
	 * @method setTextureParams
	 * @param  {WebGLRenderingContext} gl The canvas WebGL context object to draw into.
	 * @param  {Boolean} [isPOT=false] Marks whether the texture is "Power of Two", this may allow better quality AA.
	 */
	p.setTextureParams = function (gl, isPOT) {
		if (isPOT && this._antialias) {
			//non POT linear works in some devices, but performance is NOT good, investigate
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
	 * Changes the webGL clear, aka "background" color to the provided value. A transparent clear is recommended, as
	 * non-transparent colours may create undesired boxes around some visuals.
	 *
	 * The clear color will also be used for filters and other "render textures". The stage background will ignore the
	 * transparency value and display a solid color normally. For the stage to recognize and use transparency it must be
	 * created with the transparent flag set to `true` (see {{#crossLink "StageGL/constructor"}}{{/crossLink}})).
	 *
	 * Using "transparent white" to demonstrate, the valid data formats are as follows:
	 * <ul>
	 *     <li>"#FFF"</li>
	 *     <li>"#FFFFFF"</li>
	 *     <li>"#FFFFFF00"</li>
	 *     <li>"rgba(255,255,255,0.0)"</li>
	 * </ul>
	 * @method setClearColor
	 * @param {String|int} [color=0x00000000] The new color to use as the background
	 */
	p.setClearColor = function (color) {
		this._clearColor = StageGL.colorToObj(color);
	};

	/**
	 * Returns a data url that contains a Base64-encoded image of the contents of the stage. The returned data url can
	 * be specified as the src value of an image element. StageGL renders differently than Context2D and the information
	 * of the last render is harder to get. For best results turn directDraw to false, or preserveBuffer to true and no
	 * backgorund color.
	 * @method toDataURL
	 * @param {String} [backgroundColor=undefined] The background color to be used for the generated image. See setClearColor
	 * for valid values. A value of undefined will make no adjustments to the existing background which may be significantly faster.
	 * @param {String} [mimeType="image/png"] The MIME type of the image format to be create. The default is "image/png". If an unknown MIME type
	 * is passed in, or if the browser does not support the specified MIME type, the default value will be used.
	 * @param {Number} [encoderOptions=0.92] A Number between 0 and 1 indicating the image quality to use for image
	 * formats that use lossy  compression such as image/jpeg and image/webp.
	 * @return {String} a Base64 encoded image.
	 **/
	p.toDataURL = function(backgroundColor, mimeType, encoderOptions) {
		var dataURL, gl = this._webGLContext;
		this.batchReason = "dataURL";
		var clearBackup = this._clearColor;

		if (!this.canvas) { return; }
		if (!StageGL.isWebGLActive(gl)) {
			return this.Stage_toDataURL(backgroundColor, mimeType, encoderOptions);
		}

		// if the buffer is preserved and we don't want a background we can just output what we have, otherwise we'll have to render it
		if(!this._preserveBuffer || backgroundColor !== undefined) {
			// render it onto the right background
			if(backgroundColor !== undefined) {
				this._clearColor = StageGL.colorToObj(backgroundColor);
			}
			this.clear();
			// if we're not using directDraw then we can just trust the last buffer content
			if(!this._directDraw) {
				this._drawCover(null, this._bufferTextureOutput);
			} else {
				console.log("No stored/useable gl render info, result may be incorrect if content was changed since render");
				this.draw(gl);
			}
		}

		// create the dataurl
		dataURL = this.canvas.toDataURL(mimeType||"image/png", encoderOptions);

		// reset the picture in the canvas
		if(!this._preserveBuffer || backgroundColor !== undefined) {
			if(backgroundColor !== undefined) {
				this._clearColor = clearBackup;
			}
			this.clear();
			if(!this._directDraw) {
				this._drawCover(null, this._bufferTextureOutput);
			} else {
				this.draw(gl);
			}
		}

		return dataURL;
	};

	// Docced in subclass
	p.toString = function () {
		return "[StageGL (name="+  this.name +")]";
	};

// private methods:
	/**
	 * Changes the active drawing surface and view matrix to the correct parameters without polluting the concept
	 * of the current stage size
	 * @param  {uint} w The width of the surface in pixels, defaults to _viewportWidth
	 * @param  {uint} h The height of the surface in pixels, defaults to _viewportHeight
	 */
	p._updateDrawingSurface = function(w, h) {
		this._viewportWidth = w;
		this._viewportHeight = h;

		this._webGLContext.viewport(0, 0, this._viewportWidth, this._viewportHeight);

		// WebGL works with a -1,1 space on its screen. It also follows Y-Up
		// we need to flip the y, scale and then translate the co-ordinates to match this
		// additionally we offset into they Y so the polygons are inside the camera's "clipping" plane
		this._projectionMatrix = new Float32Array([
			2 / w,		0,			0,			0,
			0,			-2 / h,		0,			0,
			0,			0,			1,			0,
			-1,			1,			0,			1
		]);
	};

	/**
	 * Returns a base texture that has no image or data loaded. Not intended for loading images. In some error cases,
	 * the texture creation will fail. This function differs from {{#crossLink "StageGL/getBaseTexture"}}{{/crossLink}}
	 * in that the failed textures will be replaced with a safe to render "nothing" texture.
	 * @method _getSafeTexture
	 * @param  {uint} [w=1] The width of the texture in pixels, defaults to 1
	 * @param  {uint} [h=1] The height of the texture in pixels, defaults to 1
	 * @protected
	 */
	p._getSafeTexture = function (w, h) {
		var texture = this.getBaseTexture(w, h);

		if (!texture) {
			var msg = "Problem creating texture, possible cause: using too much VRAM, please try releasing texture memory";
			(console.error && console.error(msg)) || console.log(msg);

			texture = this._baseTextures[0];
		}

		return texture;
	};

	/**
	 * Visually clear out the currently active FrameBuffer, does not rebind or adjust the frameBuffer in use.
	 * @method _getSafeTexture
	 * @param alpha
	 * @protected
	 */
	p._clearFrameBuffer = function (alpha) {
		var gl = this._webGLContext;
		var cc = this._clearColor;

		if (alpha > 0) { alpha = 1; }
		if (alpha < 0) { alpha = 0; }

		// Use WebGL settings; adjust for pre multiplied alpha appropriate to scenario
		gl.clearColor(cc.r * alpha, cc.g * alpha, cc.b * alpha, alpha);
		gl.clear(gl.COLOR_BUFFER_BIT);
		gl.clearColor(0, 0, 0, 0);
	};

	/**
	 * Sets up and returns the WebGL context for the canvas. May return undefined in error scenarios. These can include 
	 * situations where the canvas element already has a context, 2D or GL.
	 * @param  {Canvas} canvas The DOM canvas element to attach to
	 * @param  {Object} options The options to be handed into the WebGL object, see WebGL spec
	 * @method _fetchWebGLContext
	 * @protected
	 * @return {WebGLRenderingContext} The WebGL context, may return undefined in error scenarios
	 */
	p._fetchWebGLContext = function (canvas, options) {
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
	 * Create the completed Shader Program from the vertex and fragment shaders. Allows building of custom shaders for
	 * filters. Once compiled, shaders are saved so. If the Shader code requires dynamic alterations re-run this function
	 * to generate a new shader.
	 * @method _fetchShaderProgram
	 * @param  {Boolean} coverShader Is this a per object shader or a cover shader
	 * Filter and override both accept the custom params. Regular and override have all features. Filter is a special case reduced feature shader meant to be over-ridden.
	 * @param  {String | undefined} [customVTX=undefined] Extra vertex shader information to replace a regular draw, see
	 * {{#crossLink "StageGL/COVER_VERTEX_BODY"}}{{/crossLink}} for default and {{#crossLink "Filter"}}{{/crossLink}} for examples.
	 * @param  {String | undefined} [customFRAG=undefined] Extra fragment shader information to replace a regular draw, see
	 * {{#crossLink "StageGL/COVER_FRAGMENT_BODY"}}{{/crossLink}} for default and {{#crossLink "Filter"}}{{/crossLink}} for examples.
	 * @param  {Function | undefined} [shaderParamSetup=undefined] Function to run so custom shader parameters can get applied for the render.
	 * @protected
	 * @return {WebGLProgram} The compiled and linked shader
	 */
	p._fetchShaderProgram = function (coverShader, customVTX, customFRAG, shaderParamSetup) {
		var gl = this._webGLContext;

		gl.useProgram(null);		// safety to avoid collisions

		// build the correct shader string out of the right headers and bodies
		var targetFrag, targetVtx;
		if (coverShader) {
			targetVtx = StageGL.COVER_VERTEX_HEADER + (customVTX || StageGL.COVER_VERTEX_BODY);
			targetFrag = StageGL.COVER_FRAGMENT_HEADER + (customFRAG || StageGL.COVER_FRAGMENT_BODY);
		} else {
			targetVtx = StageGL.REGULAR_VERTEX_HEADER + (customVTX || StageGL.REGULAR_VERTEX_BODY);
			targetFrag = StageGL.REGULAR_FRAGMENT_HEADER + (customFRAG || StageGL.REGULAR_FRAGMENT_BODY);
		}

		// create the separate vars
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
			throw gl.getProgramInfoLog(shaderProgram);
		}

		// set up the parameters on the shader
		gl.useProgram(shaderProgram);

		// get the places in memory the shader is stored so we can feed information into them
		// then save it off on the shader because it's so tied to the shader itself
		shaderProgram.positionAttribute = gl.getAttribLocation(shaderProgram, "vertexPosition");
		gl.enableVertexAttribArray(shaderProgram.positionAttribute);

		shaderProgram.uvPositionAttribute = gl.getAttribLocation(shaderProgram, "uvPosition");
		gl.enableVertexAttribArray(shaderProgram.uvPositionAttribute);

		if (coverShader) {
			shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
			gl.uniform1i(shaderProgram.samplerUniform, 0);

			// if there's some custom attributes be sure to hook them up
			if (shaderParamSetup) {
				shaderParamSetup(gl, this, shaderProgram);
			}
		} else {
			shaderProgram.textureIndexAttribute = gl.getAttribLocation(shaderProgram, "textureIndex");
			gl.enableVertexAttribArray(shaderProgram.textureIndexAttribute);

			shaderProgram.alphaAttribute = gl.getAttribLocation(shaderProgram, "objectAlpha");
			gl.enableVertexAttribArray(shaderProgram.alphaAttribute);

			var samplers = [];
			for (var i = 0; i < this._gpuTextureCount; i++) {
				samplers[i] = i;
			}
			shaderProgram.samplerData = samplers;

			shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
			gl.uniform1iv(shaderProgram.samplerUniform, shaderProgram.samplerData);

			shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "pMatrix");
		}

		shaderProgram._type = coverShader ? "cover" : "batch";

		gl.useProgram(this._activeShader);
		return shaderProgram;
	};

	/**
	 * Creates a shader from the specified string replacing templates. Template items are defined via `{{` `key` `}}``.
	 * @method _createShader
	 * @param  {WebGLRenderingContext} gl The canvas WebGL context object to draw into.
	 * @param  {Number} type The type of shader to create. gl.VERTEX_SHADER | gl.FRAGMENT_SHADER
	 * @param  {String} str The definition for the shader.
	 * @return {WebGLShader}
	 * @protected
	 */
	p._createShader = function (gl, type, str) {
		var textureCount = this._batchTextureCount;

		// inject the static number
		str = str.replace(/\{\{count}}/g, textureCount);

		if (type === gl.FRAGMENT_SHADER) {
			// resolve issue with no dynamic samplers by creating correct samplers in if else chain
			// TODO: WebGL 2.0 does not need this support
			var insert = "";
			for (var i = 1; i<textureCount; i++) {
				insert += "} else if (indexPicker <= "+ i +".5) { color = texture2D(uSampler["+ i +"], vTextureCoord);";
			}
			str = str.replace(/\{\{alternates}}/g, insert);
		}

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
	 * Sets up the necessary vertex property buffers, including position and UV.
	 * @method _createBuffers
	 * @protected
	 */
	p._createBuffers = function () {
		var gl = this._webGLContext;
		var groupCount = this._maxBatchVertexCount;
		var groupSize, i, l, config, atrBuffer;

		// TODO benchmark and test using unified main buffer

		// regular
		config = this._attributeConfig["default"] = {};

		groupSize = 2;
		var vertices = new Float32Array(groupCount * groupSize);
		for (i=0, l=vertices.length; i<l; i+=groupSize) { vertices[i] = vertices[i+1] = 0.0; }
		atrBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, atrBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);
		config["position"] = { array: vertices,
			buffer: atrBuffer, type: gl.FLOAT, spacing: groupSize, stride: 0, offset: 0, offB: 0, size: groupSize
		};

		groupSize = 2;
		var uvs = new Float32Array(groupCount * groupSize);
		for (i=0, l=uvs.length; i<l; i+=groupSize) { uvs[i] = uvs[i+1] = 0.0; }
		atrBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, atrBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.DYNAMIC_DRAW);
		config["uv"] = { array: uvs,
			buffer: atrBuffer, type: gl.FLOAT, spacing: groupSize, stride: 0, offset: 0, offB: 0, size: groupSize
		};

		groupSize = 1;
		var indices = new Float32Array(groupCount * groupSize);
		for (i=0, l=indices.length; i<l; i++) { indices[i] = 0.0; }
		atrBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, atrBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, indices, gl.DYNAMIC_DRAW);
		config["texture"] = { array: indices,
			buffer: atrBuffer, type: gl.FLOAT, spacing: groupSize, stride: 0, offset: 0, offB: 0, size: groupSize
		};

		groupSize = 1;
		var alphas = new Float32Array(groupCount * groupSize);
		for (i=0, l=alphas.length; i<l; i++) { alphas[i] = 1.0; }
		atrBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, atrBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, alphas, gl.DYNAMIC_DRAW);
		config["alpha"] = { array: alphas,
			buffer: atrBuffer, type: gl.FLOAT, spacing: groupSize, stride: 0, offset: 0, offB: 0, size: groupSize
		};

		// micro
		config = this._attributeConfig["micro"] = {};
		groupCount = 5; // we probably do not need this much space, but it's safer and barely more expensive
		groupSize = 2 + 2 + 1 + 1;
		var stride = groupSize * 4; // they're all floats, so 4 bytes each

		var microArray = new Float32Array(groupCount * groupSize);
		for (i=0, l=microArray.length; i<l; i+=groupSize) {
			microArray[i]   = microArray[i+1] = 0.0; // vertex
			microArray[i+1] = microArray[i+2] = 0.0; // uv
			microArray[i+3] = 0.0;                   // texture
			microArray[i+4] = 1.0;                   // alpha
		}
		atrBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, atrBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, microArray, gl.DYNAMIC_DRAW);

		config["position"] = {
			array: microArray, buffer: atrBuffer, type: gl.FLOAT, spacing: groupSize, stride: stride,
			offset: 0, offB: 0, size: 2
		};
		config["uv"] = {
			array: microArray, buffer: atrBuffer, type: gl.FLOAT, spacing: groupSize, stride: stride,
			offset: 2, offB: 2*4, size: 2
		};
		config["texture"] = {
			array: microArray, buffer: atrBuffer, type: gl.FLOAT, spacing: groupSize, stride: stride,
			offset: 4, offB: 4*4, size: 1
		};
		config["alpha"] = {
			array: microArray, buffer: atrBuffer, type: gl.FLOAT, spacing: groupSize, stride: stride,
			offset: 5, offB: 5*4, size: 1
		};

		// defaults
		this._activeConfig = this._attributeConfig["default"];
	};

	/**
	 * Do all the setup steps for standard textures & shaders.
	 * @method _initMaterials
	 * @protected
	 */
	p._initMaterials = function () {
		var gl = this._webGLContext;

		// reset counters
		this._lastTextureInsert = -1;

		// clear containers
		this._textureDictionary = [];
		this._textureIDs = {};
		this._baseTextures = [];
		this._batchTextures = [];

		this._gpuTextureCount = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS); // this is what we can draw with
		this._gpuTextureMax = gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS); // this could be higher

		this._batchTextureCount = this._gpuTextureCount;
		var success = false;
		while (!success) {
			try {
				this._activeShader = this._fetchShaderProgram(false);
				success = true;
			} catch(e) {
				if (this._batchTextureCount <= 1) { throw "Cannot compile shader " + e; }
				this._batchTextureCount = (this._batchTextureCount / 2)|0;

				if (this.vocalDebug) {
					console.log("Reducing possible texture count due to errors: " + this._batchTextureCount);
				}
			}
		}

		this._mainShader = this._activeShader;
		this._mainShader._name = "main";

		// fill in blanks as it helps the renderer be stable while textures are loading and reduces need for safety code
		var texture = this.getBaseTexture();
		if (!texture) {
			throw "Problems creating basic textures, known causes include using too much VRAM by not releasing WebGL texture instances";
		} else {
			texture._storeID = -1;
		}
		for (var i=0; i<this._batchTextureCount; i++) {
			this._baseTextures[i] = this._batchTextures[i] = texture;
		}
	};

	/**
	 * Load a specific texture, accounting for potential delay, as it might not be preloaded.
	 * @method _loadTextureImage
	 * @param {WebGLRenderingContext} gl
	 * @param {Image | Canvas} image Actual image to be loaded
	 * @return {WebGLTexture} The resulting Texture object
	 * @protected
	 */
	p._loadTextureImage = function (gl, image) {
		var srcPath, texture, msg;
		if ((image instanceof Image || image instanceof HTMLImageElement) && image.src) {
			srcPath = image.src;
		} else if (image instanceof HTMLCanvasElement) {
			image._isCanvas = true; //canvases are already loaded and assumed unique so note that
			srcPath = "canvas_" + (++this._lastTrackedCanvas);
		} else {
			msg = "Invalid image provided as source. Please ensure source is a correct DOM element.";
			(console.error && console.error(msg, image)) || console.log(msg, image);
			return;
		}

		// create the texture lookup and texture
		var storeID = this._textureIDs[srcPath];
		if (storeID === undefined) {
			this._textureIDs[srcPath] = storeID = this._textureDictionary.length;
			image._storeID = storeID;
			image._invalid = true;
			texture = this._getSafeTexture();
			this._textureDictionary[storeID] = texture;
		} else {
			image._storeID = storeID;
			texture = this._textureDictionary[storeID];
		}

		// allow the texture to track its references for cleanup, if it's not an error ref
		if (texture._storeID !== -1) {
			texture._storeID = storeID;
			if (texture._imageData) {
				texture._imageData.push(image);
			} else {
				texture._imageData = [image];
			}
		}

		// insert texture into batch
		this._insertTextureInBatch(gl, texture);

		return texture;
	};

	/**
	 * Necessary to upload the actual image data to the GPU. Without this the texture will be blank. Called automatically
	 * in most cases due to loading and caching APIs. Flagging an image source with `_invalid = true` will trigger this
	 * next time the image is rendered.
	 * @method _updateTextureImageData
	 * @param {WebGLRenderingContext} gl
	 * @param {Image | Canvas} image The image data to be uploaded
	 * @protected
	 */
	p._updateTextureImageData = function (gl, image) {
		// the image isn't loaded and isn't ready to be updated, because we don't set the invalid flag we should try again later
		if (!(image.complete || image._isCanvas || image.naturalWidth)) {
			return;
		}

		// the bitwise & is intentional, cheap exponent 2 check
		var isNPOT = (image.width & image.width-1) || (image.height & image.height-1);
		var texture = this._textureDictionary[image._storeID];

		gl.activeTexture(gl.TEXTURE0 + texture._activeIndex);
		gl.bindTexture(gl.TEXTURE_2D, texture);

		texture.isPOT = !isNPOT;
		this.setTextureParams(gl, texture.isPOT);

		try {
			gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
		} catch(e) {
			var errString = "\nAn error has occurred. This is most likely due to security restrictions on WebGL images with local or cross-domain origins";
			if (console.error) {
				//TODO: LM: I recommend putting this into a log function internally, since you do it so often, and each is implemented differently.
				console.error(errString);
				console.error(e);
			} else if (console) {
				console.log(errString);
				console.log(e);
			}
		}
		gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);

		if (image._invalid !== undefined) { image._invalid = false; } // only adjust what is tracking this data

		texture.width = image.width;
		texture.height = image.height;

		if (this.vocalDebug) {
			if (isNPOT && this._antialias) {
				console.warn("NPOT(Non Power of Two) Texture with context.antialias true: "+ image.src);
			}
			if (image.width > gl.MAX_TEXTURE_SIZE || image.height > gl.MAX_TEXTURE_SIZE){
				console && console.error("Oversized Texture: "+ image.width+"x"+image.height +" vs "+ gl.MAX_TEXTURE_SIZE +"max");
			}
		}
	};

	/**
	 * Adds the texture to a spot in the current batch, forcing a draw if no spots are free.
	 * @method _insertTextureInBatch
	 * @param {WebGLRenderingContext} gl The canvas WebGL context object to draw into.
	 * @param {WebGLTexture} texture The texture to be inserted.
	 * @protected
	 */
	p._insertTextureInBatch = function (gl, texture) {
		var image;
		if (this._batchTextures[texture._activeIndex] !== texture) {	// if it wasn't used last batch
			// we've got to find it a a spot.
			var found = -1;
			var start = (this._lastTextureInsert+1) % this._batchTextureCount;
			var look = start;
			do {
				if (this._batchTextures[look]._batchID !== this._batchID && !this._slotBlacklist[look]) {
					found = look;
					break;
				}
				look = (look+1) % this._batchTextureCount;
			} while (look !== start);

			// we couldn't find anywhere for it go, meaning we're maxed out
			if (found === -1) {
				this.batchReason = "textureOverflow";
				this._renderBatch();		// <------------------------------------------------------------------------
				found = start; //TODO: how do we optimize this to be smarter?
			}

			// lets put it into that spot
			this._batchTextures[found] = texture;
			texture._activeIndex = found;
			image = texture._imageData && texture._imageData[0]; // first come first served, potentially problematic
			if (image && ((image._invalid === undefined && image._isCanvas) || image._invalid)) {
				this._updateTextureImageData(gl, image);
			} else {
				// probably redundant, confirm functionality then remove from codebase
				//gl.activeTexture(gl.TEXTURE0 + found);
				//gl.bindTexture(gl.TEXTURE_2D, texture);
				//this.setTextureParams(gl);
			}
			this._lastTextureInsert = found;

		} else if (texture._drawID !== this._drawID) {	// being active from previous draws doesn't mean up to date
			image = texture._imageData && texture._imageData[0];
			if (image && ((image._invalid === undefined && image._isCanvas) || image._invalid)) {
				this._updateTextureImageData(gl, image);
			}
		}

		texture._drawID = this._drawID;
		texture._batchID = this._batchID;
	};

	/**
	 * Remove and clean the texture, expects a texture and is inflexible. Mostly for internal use, recommended to call 
	 * {{#crossLink "StageGL/releaseTexture"}}{{/crossLink}} instead as it will call this with the correct texture object(s).
	 * Note: Testing shows this may not happen immediately, have to wait frames for WebGL to have actually adjust memory.
	 * @method _killTextureObject
	 * @param {WebGLTexture} texture The texture to be cleaned out
	 * @protected
	 */
	p._killTextureObject = function (texture) {
		if (!texture) { return; }
		var gl = this._webGLContext;

		// remove linkage
		if (texture._storeID !== undefined && texture._storeID >= 0) {
			this._textureDictionary[texture._storeID] = undefined;
			for (var n in this._textureIDs) {
				if (this._textureIDs[n] === texture._storeID) { delete this._textureIDs[n]; }
			}
			var data = texture._imageData;
			if (data) {
				for (var i=data.length-1; i>=0; i--) { data[i]._storeID = undefined; }
			}
			texture._imageData = texture._storeID = undefined;
		}

		// make sure to drop it out of an active slot
		if (texture._activeIndex !== undefined && this._batchTextures[texture._activeIndex] === texture) {
			this._batchTextures[texture._activeIndex] = this._baseTextures[texture._activeIndex];
		}

		// remove buffers if present
		try {
			if (texture._frameBuffer) { gl.deleteFramebuffer(texture._frameBuffer); }
			texture._frameBuffer = undefined;
		} catch(e) {
			/* suppress delete errors because it's already gone or didn't need deleting probably */
			if (this.vocalDebug) { console.log(e); }
		}

		// remove entry
		try {
			gl.deleteTexture(texture);
		} catch(e) {
			/* suppress delete errors because it's already gone or didn't need deleting probably */
			if (this.vocalDebug) { console.log(e); }
		}
	};

	/**
	 * Small utility function to keep internal API consistent and set the uniforms for a dual texture cover render
	 * @method _setCoverMixShaderParams
	 * @param {WebGLRenderingContext} gl The context where the drawing takes place
	 * @param stage unused
	 * @param shaderProgram unused
	 * @protected
	 */
	p._setCoverMixShaderParams = function (gl, stage, shaderProgram) {
		gl.uniform1i(
			gl.getUniformLocation(shaderProgram, "uMixSampler"),
			1
		);
	};

	/**
	 * Change the respective render settings and filters to the correct settings. Will build the shader on first use.
	 * @method _updateRenderMode
	 * @param {String} newMode Composite operation name
	 * @protected
	 */
	p._updateRenderMode = function (newMode) {
		if ( newMode === null || newMode === undefined){ newMode = "source-over"; }

		var blendSrc = StageGL.BLEND_SOURCES[newMode];
		if (blendSrc === undefined) {
			if (this.vocalDebug){ console.log("Unknown compositeOperation ["+ newMode +"], reverting to default"); }
			blendSrc = StageGL.BLEND_SOURCES[newMode = "source-over"];
		}

		if (this._renderMode === newMode) { return; }

		var gl = this._webGLContext;
		var shaderData = this._builtShaders[newMode];
		if (shaderData === undefined) {
			try {
				shaderData = this._builtShaders[newMode] = {
					eqRGB: gl[blendSrc.eqRGB || "FUNC_ADD"],
					srcRGB: gl[blendSrc.srcRGB || "ONE"],
					dstRGB: gl[blendSrc.dstRGB || "ONE_MINUS_SRC_ALPHA"],
					eqA: gl[blendSrc.eqA || "FUNC_ADD"],
					srcA: gl[blendSrc.srcA || "ONE"],
					dstA: gl[blendSrc.dstA || "ONE_MINUS_SRC_ALPHA"],
					immediate: blendSrc.shader !== undefined,
					shader: (blendSrc.shader || this._builtShaders["source-over"] === undefined) ?
						this._fetchShaderProgram(
							true, undefined, blendSrc.shader,
							this._setCoverMixShaderParams
						) : this._builtShaders["source-over"].shader // re-use source-over when we don't need a new shader
				};
				if (blendSrc.shader) { shaderData.shader._name = newMode; }
			} catch (e) {
				this._builtShaders[newMode] = undefined;
				console && console.log("SHADER SWITCH FAILURE", e);
				return;
			}
		}

		if (shaderData.immediate) {
			if (this._directDraw) {
				if (this.vocalDebug) { console.log("Illegal compositeOperation ["+ newMode +"] due to StageGL.directDraw = true, reverting to default"); }
				return;
			}
			this._activeConfig = this._attributeConfig["micro"];
		}

		gl.bindFramebuffer(gl.FRAMEBUFFER, this._batchTextureOutput._frameBuffer);

		this.batchReason = "shaderSwap";
		this._renderBatch();		// <--------------------------------------------------------------------------------

		this._renderMode = newMode;
		this._immediateRender = shaderData.immediate;
		gl.blendEquationSeparate(shaderData.eqRGB, shaderData.eqA);
		gl.blendFuncSeparate(shaderData.srcRGB, shaderData.dstRGB, shaderData.srcA, shaderData.dstA);
	};

	/**
	 * Helper function for the standard content draw
	 * @method _drawContent
	 * @param {Stage | Container} content
	 * @param {Boolean} ignoreCache
	 * @protected
	 */
	p._drawContent = function (content, ignoreCache) {
		var gl = this._webGLContext;

		this._activeShader = this._mainShader;

		gl.bindFramebuffer(gl.FRAMEBUFFER, this._batchTextureOutput._frameBuffer);
		if(this._batchTextureOutput._frameBuffer !== null) { gl.clear(gl.COLOR_BUFFER_BIT); }

		this._appendToBatch(content, new createjs.Matrix2D(), this.alpha, ignoreCache);

		this.batchReason = "contentEnd";
		this._renderBatch();
	};

	/**
	 * Used to draw one or more textures potentially using a filter into the supplied buffer.
	 * Mostly used for caches, filters, and outputting final render frames.
	 * Draws `dst` into `out` after applying `srcFilter` depending on its current value.
	 * @method _drawCover
	 * @param {WebGLFramebuffer} out Buffer to draw the results into (null is the canvas element)
	 * @param {WebGLTexture} dst Base texture layer aka "destination" in image blending terminology
	 * @param {WebGLTexture | Filter} [srcFilter = undefined] Modification parameter for the draw. If a texture, the
	 * current _renderMode applies it as a "source" image. If a Filter, the filter is applied to the dst with its params.
	 * @protected
	 */
	p._drawCover = function (out, dst, srcFilter) {
		var gl = this._webGLContext;

		gl.bindFramebuffer(gl.FRAMEBUFFER, out);
		if (out !== null){ gl.clear(gl.COLOR_BUFFER_BIT); }

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, dst);
		this.setTextureParams(gl);

		if (srcFilter instanceof createjs.Filter) {
			this._activeShader = this.getFilterShader(srcFilter);
		} else {
			if (srcFilter instanceof WebGLTexture) {
				gl.activeTexture(gl.TEXTURE1);
				gl.bindTexture(gl.TEXTURE_2D, srcFilter);
				this.setTextureParams(gl);
			} else if (srcFilter !== undefined && this.vocalDebug) {
				console.log("Unknown data handed to function: ", srcFilter);
			}
			this._activeShader = this._builtShaders[this._renderMode].shader;
		}

		this._renderCover();
	};

	/**
	 * Returns a matrix that can be used to counter position the `target` so that it fits and scales to the `manager`
	 * @param {DisplayObject} target The object to be counter positioned
	 * @param {BitmapCache} manager The cache manager to be aligned to
	 * @returns {Matrix2D} The matrix that can be used used to counter position the container
	 * @method _alignTargetToCache
	 * @private
	 */
	p._alignTargetToCache = function(target, manager) {
		if (manager._counterMatrix === null) {
			manager._counterMatrix = target.getMatrix();
		} else {
			target.getMatrix(manager._counterMatrix)
		}

		var mtx = manager._counterMatrix;
		mtx.scale(1/manager.scale, 1/manager.scale);
		mtx = mtx.invert();
		mtx.translate(-manager.offX/manager.scale*target.scaleX, -manager.offY/manager.scale*target.scaleY);

		return mtx;
	};

	/**
	 * Add all the contents of a container to the pending buffers, called recursively on each container. This may
	 * trigger a draw if a buffer runs out of space. This is the main workforce of the render loop.
	 * @method _appendToBatch
	 * @param {Container} container The {{#crossLink "Container"}}{{/crossLink}} that contains everything to be drawn.
	 * @param {Matrix2D} concatMtx The effective (concatenated) transformation matrix when beginning this container
	 * @param {Number} concatAlpha The effective (concatenated) alpha when beginning this container
	 * @param {Boolean} [ignoreCache=false] Don't use an element's cache during this draw
	 * @protected
	 */
	p._appendToBatch = function (container, concatMtx, concatAlpha, ignoreCache) {
		var gl = this._webGLContext;

		// sort out shared properties
		var cMtx = container._glMtx;
		cMtx.copy(concatMtx);
		if (container.transformMatrix !== null) {
			cMtx.appendMatrix(container.transformMatrix);
		} else {
			cMtx.appendTransform(
				container.x, container.y,
				container.scaleX, container.scaleY,
				container.rotation, container.skewX, container.skewY,
				container.regX, container.regY
			);
		}

		var previousRenderMode = this._renderMode;
		if (container.compositeOperation) {
			this._updateRenderMode(container.compositeOperation);
		}

		// sub components of figuring out the position an object holds
		var subL, subT, subR, subB;

		// actually apply its data to the buffers
		var l = container.children.length;
		for (var i = 0; i < l; i++) {
			var item = container.children[i];
			var useCache = (!ignoreCache && item.cacheCanvas) || false;

			if (!(item.visible && concatAlpha > 0.0035)) { continue; }
			var itemAlpha = item.alpha;

			if (useCache === false) {
				if (item._updateState){
					item._updateState();
				}

				if(!this._directDraw && (!ignoreCache && item.cacheCanvas === null && item.filters !== null && item.filters.length)) {
					var bounds;
					if (item.bitmapCache === null) {
						bounds = item.getBounds();
						item.bitmapCache = new createjs.BitmapCache();
						item.bitmapCache._autoGenerated = true;
					}
					if (item.bitmapCache._autoGenerated) {
						this.batchReason = "cachelessFilterInterupt";
						this._renderBatch();					// <----------------------------------------------------

						item.alpha = 1;
						var shaderBackup = this._activeShader;
						bounds = bounds || item.getBounds();
						item.bitmapCache.define(item, bounds.x, bounds.y, bounds.width, bounds.height, 1, {useGL:this});
						useCache = item.bitmapCache._cacheCanvas;

						item.alpha = itemAlpha;
						this._activeShader = shaderBackup;
						gl.bindFramebuffer(gl.FRAMEBUFFER, this._batchTextureOutput._frameBuffer);
					}
				}
			}

			if (useCache === false && item.children) {
				this._appendToBatch(item, cMtx, itemAlpha * concatAlpha);
				continue;
			}

			var containerRenderMode = this._renderMode;
			if (item.compositeOperation) {
				this._updateRenderMode(item.compositeOperation);
			}

			// check for overflowing batch, if yes then force a render
			if (this._batchVertexCount + StageGL.INDICIES_PER_CARD > this._maxBatchVertexCount) {
				this.batchReason = "vertexOverflow";
				this._renderBatch();					// <------------------------------------------------------------
			}

			// keep track of concatenated position
			var iMtx = item._glMtx;
			iMtx.copy(cMtx);
			if (item.transformMatrix) {
				iMtx.appendMatrix(item.transformMatrix);
			} else {
				iMtx.appendTransform(
					item.x, item.y,
					item.scaleX, item.scaleY,
					item.rotation, item.skewX, item.skewY,
					item.regX, item.regY
				);
			}

			var uvRect, texIndex, image, frame, texture, src;

			// get the image data, or abort if not present
			// BITMAP / Cached Canvas
			if (item._webGLRenderStyle === 2 || useCache !== false) {
				image = useCache === false ? item.image : useCache;

			// SPRITE
			} else if (item._webGLRenderStyle === 1) {
				frame = item.spriteSheet.getFrame(item.currentFrame);
				if (frame === null) { continue; }
				image = frame.image;

			// MISC (DOM objects render themselves later)
			} else {
				continue;
			}
			if (!image) { continue; }

			// calculate texture
			if (image._storeID === undefined) {
				// this texture is new to us so load it and add it to the batch
				texture = this._loadTextureImage(gl, image);
			} else {
				// fetch the texture (render textures know how to look themselves up to simplify this logic)
				texture = this._textureDictionary[image._storeID];

				if (!texture){ //TODO: this should really not occur but has due to bugs, hopefully this can be removed eventually
					if (this.vocalDebug){ console.log("Image source should not be lookup a non existent texture, please report a bug."); }
					continue;
				}

				// put it in the batch if needed
				if (texture._batchID !== this._batchID) {
					this._insertTextureInBatch(gl, texture);
				}
			}
			texIndex = texture._activeIndex;
			image._drawID = this._drawID;

			// BITMAP / Cached Canvas
			if (item._webGLRenderStyle === 2 || useCache !== false) {
				if (useCache === false && item.sourceRect) {
					// calculate uvs
					if (!item._uvRect) { item._uvRect = {}; }
					src = item.sourceRect;
					uvRect = item._uvRect;
					uvRect.t = 1 - ((src.y)/image.height);
					uvRect.l = (src.x)/image.width;
					uvRect.b = 1 - ((src.y + src.height)/image.height);
					uvRect.r = (src.x + src.width)/image.width;

					// calculate vertices
					subL = 0;							subT = 0;
					subR = src.width+subL;				subB = src.height+subT;
				} else {
					// calculate uvs
					uvRect = StageGL.UV_RECT;
					// calculate vertices
					if (useCache === false) {
						subL = 0;						subT = 0;
						subR = image.width+subL;		subB = image.height+subT;
					} else {
						src = item.bitmapCache;
						subL = src.x+(src._filterOffX/src.scale);	subT = src.y+(src._filterOffY/src.scale);
						subR = (src._drawWidth/src.scale)+subL;		subB = (src._drawHeight/src.scale)+subT;
					}
				}

			// SPRITE
			} else if (item._webGLRenderStyle === 1) {
				var rect = frame.rect;

				// calculate uvs
				uvRect = frame.uvRect;
				if (!uvRect) {
					uvRect = StageGL.buildUVRects(item.spriteSheet, item.currentFrame, false);
				}

				// calculate vertices
				subL = -frame.regX;								subT = -frame.regY;
				subR = rect.width-frame.regX;					subB = rect.height-frame.regY;
			}

			var spacing = 0;
			var cfg =  this._activeConfig;
			var vpos = cfg.position.array;
			var uvs = cfg.uv.array;
			var texI = cfg.texture.array;
			var alphas = cfg.alpha.array;

			// apply vertices
			spacing = cfg.position.spacing;
			var vtxOff = this._batchVertexCount * spacing + cfg.position.offset;
			vpos[vtxOff] = subL*iMtx.a + subT*iMtx.c + iMtx.tx;    vpos[vtxOff+1] = subL*iMtx.b + subT*iMtx.d + iMtx.ty;
			vtxOff += spacing;
			vpos[vtxOff] = subL*iMtx.a + subB*iMtx.c + iMtx.tx;    vpos[vtxOff+1] = subL*iMtx.b + subB*iMtx.d + iMtx.ty;
			vtxOff += spacing;
			vpos[vtxOff] = subR*iMtx.a + subT*iMtx.c + iMtx.tx;    vpos[vtxOff+1] = subR*iMtx.b + subT*iMtx.d + iMtx.ty;
			vtxOff += spacing;
			vpos[vtxOff] = subL*iMtx.a + subB*iMtx.c + iMtx.tx;    vpos[vtxOff+1] = subL*iMtx.b + subB*iMtx.d + iMtx.ty;
			vtxOff += spacing;
			vpos[vtxOff] = subR*iMtx.a + subT*iMtx.c + iMtx.tx;    vpos[vtxOff+1] = subR*iMtx.b + subT*iMtx.d + iMtx.ty;
			vtxOff += spacing;
			vpos[vtxOff] = subR*iMtx.a + subB*iMtx.c + iMtx.tx;    vpos[vtxOff+1] = subR*iMtx.b + subB*iMtx.d + iMtx.ty;

			// apply uvs
			spacing = cfg.uv.spacing;
			var uvOff = this._batchVertexCount * spacing + cfg.uv.offset;
			uvs[uvOff] = uvRect.l;        uvs[uvOff+1] = uvRect.t;
			uvOff += spacing;
			uvs[uvOff] = uvRect.l;        uvs[uvOff+1] = uvRect.b;
			uvOff += spacing;
			uvs[uvOff] = uvRect.r;        uvs[uvOff+1] = uvRect.t;
			uvOff += spacing;
			uvs[uvOff] = uvRect.l;        uvs[uvOff+1] = uvRect.b;
			uvOff += spacing;
			uvs[uvOff] = uvRect.r;        uvs[uvOff+1] = uvRect.t;
			uvOff += spacing;
			uvs[uvOff] = uvRect.r;        uvs[uvOff+1] = uvRect.b;

			// apply texture
			spacing = cfg.texture.spacing;
			var texOff = this._batchVertexCount * spacing + cfg.texture.offset;
			texI[texOff] = texIndex;
			texOff += spacing;
			texI[texOff] = texIndex;
			texOff += spacing;
			texI[texOff] = texIndex;
			texOff += spacing;
			texI[texOff] = texIndex;
			texOff += spacing;
			texI[texOff] = texIndex;
			texOff += spacing;
			texI[texOff] = texIndex;

			// apply alpha
			spacing = cfg.alpha.spacing;
			var aOff = this._batchVertexCount * spacing + cfg.alpha.offset;
			alphas[aOff] = itemAlpha * concatAlpha;
			aOff += spacing;
			alphas[aOff] = itemAlpha * concatAlpha;
			aOff += spacing;
			alphas[aOff] = itemAlpha * concatAlpha;
			aOff += spacing;
			alphas[aOff] = itemAlpha * concatAlpha;
			aOff += spacing;
			alphas[aOff] = itemAlpha * concatAlpha;
			aOff += spacing;
			alphas[aOff] = itemAlpha * concatAlpha;

			this._batchVertexCount += StageGL.INDICIES_PER_CARD;

			if (this._immediateRender) {
				this._activeConfig = this._attributeConfig["default"];
				this._immediateBatchRender();
			}

			if (this._renderMode !== containerRenderMode) {
				this._updateRenderMode(containerRenderMode);
			}
		}

		if (this._renderMode !== previousRenderMode) {
			this._updateRenderMode(previousRenderMode);
		}
	};

	/**
	 * The shader or effect needs to be drawn immediately, sub function of `_appendToBatch`
	 * @method _immediateBatchRender
	 * @protected
	 */
	p._immediateBatchRender = function() {
		var gl = this._webGLContext;

		if (this._batchTextureConcat === null){
			this._batchTextureConcat = this.getRenderBufferTexture(this._viewportWidth, this._viewportHeight);
		} else {
			this.resizeTexture(this._batchTextureConcat, this._viewportWidth, this._viewportHeight);
			gl.bindFramebuffer(gl.FRAMEBUFFER, this._batchTextureConcat._frameBuffer);
			gl.clear(gl.COLOR_BUFFER_BIT);
		}
		if (this._batchTextureTemp === null){
			this._batchTextureTemp = this.getRenderBufferTexture(this._viewportWidth, this._viewportHeight);
			gl.bindFramebuffer(gl.FRAMEBUFFER, this._batchTextureTemp._frameBuffer);
		} else {
			this.resizeTexture(this._batchTextureTemp, this._viewportWidth, this._viewportHeight);
			gl.bindFramebuffer(gl.FRAMEBUFFER, this._batchTextureTemp._frameBuffer);
			gl.clear(gl.COLOR_BUFFER_BIT);
		}

		var swap = this._batchTextureOutput;
		this._batchTextureOutput = this._batchTextureConcat;
		this._batchTextureConcat = swap;

		this._activeShader = this._mainShader;
		this.batchReason = "immediatePrep";
		this._renderBatch();//<-----------------------------------------------------------------------------------------

		this.batchReason = "immediateResults";
		this._drawCover(this._batchTextureOutput._frameBuffer, this._batchTextureConcat, this._batchTextureTemp);

		gl.bindFramebuffer(gl.FRAMEBUFFER, this._batchTextureOutput._frameBuffer);
	};

	/**
	 * Draws all the currently defined cards in the buffer to the render surface.
	 * @method _renderBatch
	 * @protected
	 */
	p._renderBatch = function () {
		if (this._batchVertexCount <= 0) { return; }	// prevents error logs on stages filled with un-renederable content.
		var gl = this._webGLContext;
		this._renderPerDraw++;

		if (this.vocalDebug) {
			console.log("Batch["+ this._drawID +":"+ this._batchID +"] : "+ this.batchReason);
		}
		var shaderProgram = this._activeShader;
		var pc, config = this._activeConfig;

		gl.useProgram(shaderProgram);

		pc = config.position;
		gl.bindBuffer(gl.ARRAY_BUFFER, pc.buffer);
		gl.vertexAttribPointer(shaderProgram.positionAttribute, pc.size, pc.type, false, pc.stride, pc.offB);
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, pc.array);

		pc = config.texture;
		gl.bindBuffer(gl.ARRAY_BUFFER, pc.buffer);
		gl.vertexAttribPointer(shaderProgram.textureIndexAttribute, pc.size, pc.type, false, pc.stride, pc.offB);
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, pc.array);

		pc = config.uv;
		gl.bindBuffer(gl.ARRAY_BUFFER, pc.buffer);
		gl.vertexAttribPointer(shaderProgram.uvPositionAttribute, pc.size, pc.type, false, pc.stride, pc.offB);
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, pc.array);

		pc = config.alpha;
		gl.bindBuffer(gl.ARRAY_BUFFER, pc.buffer);
		gl.vertexAttribPointer(shaderProgram.alphaAttribute, pc.size, pc.type, false, pc.stride, pc.offB);
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, pc.array);

		gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, gl.FALSE, this._projectionMatrix);

		for (var i = 0; i < this._batchTextureCount; i++) {
			gl.activeTexture(gl.TEXTURE0 + i);
			gl.bindTexture(gl.TEXTURE_2D, this._batchTextures[i]);
		}

		gl.drawArrays(gl.TRIANGLES, 0, this._batchVertexCount);

		this._batchVertexCount = 0;
		this._batchID++;
	};

	/**
	 * Draws a card that covers the entire render surface. Mainly used for filters and composite operations.
	 * @method _renderCover
	 * @protected
	 */
	p._renderCover = function () {
		var gl = this._webGLContext;
		this._renderPerDraw++;

		if (this.vocalDebug) {
			console.log("Cover["+ this._drawID +":"+ this._batchID +"] : "+ this.batchReason);
		}
		var shaderProgram = this._activeShader;
		var pc, config = this._attributeConfig.default;

		gl.useProgram(shaderProgram);

		pc = config.position;
		gl.bindBuffer(gl.ARRAY_BUFFER, pc.buffer);
		gl.vertexAttribPointer(shaderProgram.positionAttribute, pc.size, pc.type, false, pc.stride, pc.offB);
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, StageGL.COVER_VERT);

		pc = config.uv;
		gl.bindBuffer(gl.ARRAY_BUFFER, pc.buffer);
		gl.vertexAttribPointer(shaderProgram.uvPositionAttribute, pc.size, pc.type, false, pc.stride, pc.offB);
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, StageGL.COVER_UV);

		gl.uniform1i(shaderProgram.samplerUniform, 0);

		gl.drawArrays(gl.TRIANGLES, 0, StageGL.INDICIES_PER_CARD);
		this._batchID++; // while this isn't a batch, this fixes issues with expected textures in expected places
	};

	createjs.StageGL = createjs.promote(StageGL, "Stage");
}());
