/*
* Graphics
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

// namespace:
this.createjs = this.createjs||{};

(function() {
	"use strict";


// constructor:
	/**
	 * The Graphics class exposes an easy to use API for generating vector drawing instructions and drawing them to a
	 * specified context. Note that you can use Graphics without any dependency on the EaselJS framework by calling {{#crossLink "Graphics/draw"}}{{/crossLink}}
	 * directly, or it can be used with the {{#crossLink "Shape"}}{{/crossLink}} object to draw vector graphics within the
	 * context of an EaselJS display list.
	 *
	 * There are two approaches to working with Graphics object: calling methods on a Graphics instance (the "Graphics API"), or
	 * instantiating Graphics command objects and adding them to the graphics queue via {{#crossLink "Graphics/append"}}{{/crossLink}}.
	 * The former abstracts the latter, simplifying beginning and ending paths, fills, and strokes.
	 *
	 *      var g = new createjs.Graphics();
	 *      g.setStrokeStyle(1);
	 *      g.beginStroke("#000000");
	 *      g.beginFill("red");
	 *      g.drawCircle(0,0,30);
	 *
	 * All drawing methods in Graphics return the Graphics instance, so they can be chained together. For example,
	 * the following line of code would generate the instructions to draw a rectangle with a red stroke and blue fill:
	 *
	 *      myGraphics.beginStroke("red").beginFill("blue").drawRect(20, 20, 100, 50);
	 *
	 * Each graphics API call generates a command object (see below). The last command to be created can be accessed via
	 * {{#crossLink "Graphics/command:property"}}{{/crossLink}}:
	 *
	 *      var fillCommand = myGraphics.beginFill("red").command;
	 *      // ... later, update the fill style/color:
	 *      fillCommand.style = "blue";
	 *      // or change it to a bitmap fill:
	 *      fillCommand.bitmap(myImage);
	 *
	 * For more direct control of rendering, you can instantiate and append command objects to the graphics queue directly. In this case, you
	 * need to manage path creation manually, and ensure that fill/stroke is applied to a defined path:
	 *
	 *      // start a new path. Graphics.beginCmd is a reusable BeginPath instance:
	 *      myGraphics.append(createjs.Graphics.beginCmd);
	 *      // we need to define the path before applying the fill:
	 *      var circle = new createjs.Graphics.Circle(0,0,30);
	 *      myGraphics.append(circle);
	 *      // fill the path we just defined:
	 *      var fill = new createjs.Graphics.Fill("red");
	 *      myGraphics.append(fill);
	 *
	 * These approaches can be used together, for example to insert a custom command:
	 *
	 *      myGraphics.beginFill("red");
	 *      var customCommand = new CustomSpiralCommand(etc);
	 *      myGraphics.append(customCommand);
	 *      myGraphics.beginFill("blue");
	 *      myGraphics.drawCircle(0, 0, 30);
	 *
	 * See {{#crossLink "Graphics/append"}}{{/crossLink}} for more info on creating custom commands.
	 *
	 * <h4>Tiny API</h4>
	 * The Graphics class also includes a "tiny API", which is one or two-letter methods that are shortcuts for all of the
	 * Graphics methods. These methods are great for creating compact instructions, and is used by the Toolkit for CreateJS
	 * to generate readable code. All tiny methods are marked as protected, so you can view them by enabling protected
	 * descriptions in the docs.
	 *
	 * <table>
	 *     <tr><td><b>Tiny</b></td><td><b>Method</b></td><td><b>Tiny</b></td><td><b>Method</b></td></tr>
	 *     <tr><td>mt</td><td>{{#crossLink "Graphics/moveTo"}}{{/crossLink}} </td>
	 *     <td>lt</td> <td>{{#crossLink "Graphics/lineTo"}}{{/crossLink}}</td></tr>
	 *     <tr><td>a/at</td><td>{{#crossLink "Graphics/arc"}}{{/crossLink}} / {{#crossLink "Graphics/arcTo"}}{{/crossLink}} </td>
	 *     <td>bt</td><td>{{#crossLink "Graphics/bezierCurveTo"}}{{/crossLink}} </td></tr>
	 *     <tr><td>qt</td><td>{{#crossLink "Graphics/quadraticCurveTo"}}{{/crossLink}} (also curveTo)</td>
	 *     <td>r</td><td>{{#crossLink "Graphics/rect"}}{{/crossLink}} </td></tr>
	 *     <tr><td>cp</td><td>{{#crossLink "Graphics/closePath"}}{{/crossLink}} </td>
	 *     <td>c</td><td>{{#crossLink "Graphics/clear"}}{{/crossLink}} </td></tr>
	 *     <tr><td>f</td><td>{{#crossLink "Graphics/beginFill"}}{{/crossLink}} </td>
	 *     <td>lf</td><td>{{#crossLink "Graphics/beginLinearGradientFill"}}{{/crossLink}} </td></tr>
	 *     <tr><td>rf</td><td>{{#crossLink "Graphics/beginRadialGradientFill"}}{{/crossLink}} </td>
	 *     <td>bf</td><td>{{#crossLink "Graphics/beginBitmapFill"}}{{/crossLink}} </td></tr>
	 *     <tr><td>ef</td><td>{{#crossLink "Graphics/endFill"}}{{/crossLink}} </td>
	 *     <td>ss / sd</td><td>{{#crossLink "Graphics/setStrokeStyle"}}{{/crossLink}} / {{#crossLink "Graphics/setStrokeDash"}}{{/crossLink}} </td></tr>
	 *     <tr><td>s</td><td>{{#crossLink "Graphics/beginStroke"}}{{/crossLink}} </td>
	 *     <td>ls</td><td>{{#crossLink "Graphics/beginLinearGradientStroke"}}{{/crossLink}} </td></tr>
	 *     <tr><td>rs</td><td>{{#crossLink "Graphics/beginRadialGradientStroke"}}{{/crossLink}} </td>
	 *     <td>bs</td><td>{{#crossLink "Graphics/beginBitmapStroke"}}{{/crossLink}} </td></tr>
	 *     <tr><td>es</td><td>{{#crossLink "Graphics/endStroke"}}{{/crossLink}} </td>
	 *     <td>dr</td><td>{{#crossLink "Graphics/drawRect"}}{{/crossLink}} </td></tr>
	 *     <tr><td>rr</td><td>{{#crossLink "Graphics/drawRoundRect"}}{{/crossLink}} </td>
	 *     <td>rc</td><td>{{#crossLink "Graphics/drawRoundRectComplex"}}{{/crossLink}} </td></tr>
	 *     <tr><td>dc</td><td>{{#crossLink "Graphics/drawCircle"}}{{/crossLink}} </td>
	 *     <td>de</td><td>{{#crossLink "Graphics/drawEllipse"}}{{/crossLink}} </td></tr>
	 *     <tr><td>dp</td><td>{{#crossLink "Graphics/drawPolyStar"}}{{/crossLink}} </td>
	 *     <td>p</td><td>{{#crossLink "Graphics/decodePath"}}{{/crossLink}} </td></tr>
	 * </table>
	 *
	 * Here is the above example, using the tiny API instead.
	 *
	 *      myGraphics.s("red").f("blue").r(20, 20, 100, 50);
	 *
	 * @class Graphics
	 * @constructor
	 **/
	function Graphics() {


	// public properties
		/**
		 * Holds a reference to the last command that was created or appended. For example, you could retain a reference
		 * to a Fill command in order to dynamically update the color later by using:
		 * 		myFill = myGraphics.beginFill("red").command;
		 * 		// update color later:
		 * 		myFill.style = "yellow";
		 * @property command
		 * @type Object
		 **/
		this.command = null;


	// private properties
		/**
		 * @property _stroke
		 * @protected
		 * @type {Stroke}
		 **/
		this._stroke = null;

		/**
		 * @property _strokeStyle
		 * @protected
		 * @type {StrokeStyle}
		 **/
		this._strokeStyle = null;
		
		/**
		 * @property _oldStrokeStyle
		 * @protected
		 * @type {StrokeStyle}
		 **/
		this._oldStrokeStyle = null;
		
		/**
		 * @property _strokeDash
		 * @protected
		 * @type {StrokeDash}
		 **/
		this._strokeDash = null;
		
		/**
		 * @property _oldStrokeDash
		 * @protected
		 * @type {StrokeDash}
		 **/
		this._oldStrokeDash = null;

		/**
		 * @property _strokeIgnoreScale
		 * @protected
		 * @type Boolean
		 **/
		this._strokeIgnoreScale = false;

		/**
		 * @property _fill
		 * @protected
		 * @type {Fill}
		 **/
		this._fill = null;

		/**
		 * @property _instructions
		 * @protected
		 * @type {Array}
		 **/
		this._instructions = [];

		/**
		 * Indicates the last instruction index that was committed.
		 * @property _commitIndex
		 * @protected
		 * @type {Number}
		 **/
		this._commitIndex = 0;

		/**
		 * Uncommitted instructions.
		 * @property _activeInstructions
		 * @protected
		 * @type {Array}
		 **/
		this._activeInstructions = [];

		/**
		 * This indicates that there have been changes to the activeInstruction list since the last updateInstructions call.
		 * @property _dirty
		 * @protected
		 * @type {Boolean}
		 * @default false
		 **/
		this._dirty = false;

		/**
		 * Index to draw from if a store operation has happened.
		 * @property _storeIndex
		 * @protected
		 * @type {Number}
		 * @default 0
		 **/
		this._storeIndex = 0;

	// setup:
		this.clear();
	}
	var p = Graphics.prototype;
	var G = Graphics; // shortcut

	/**
	 * <strong>REMOVED</strong>. Removed in favor of using `MySuperClass_constructor`.
	 * See {{#crossLink "Utility Methods/extend"}}{{/crossLink}} and {{#crossLink "Utility Methods/promote"}}{{/crossLink}}
	 * for details.
	 *
	 * There is an inheritance tutorial distributed with EaselJS in /tutorials/Inheritance.
	 *
	 * @method initialize
	 * @protected
	 * @deprecated
	 */
	// p.initialize = function() {}; // searchable for devs wondering where it is.


// static public methods:
	/**
	 * Returns a CSS compatible color string based on the specified RGB numeric color values in the format
	 * "rgba(255,255,255,1.0)", or if alpha is null then in the format "rgb(255,255,255)". For example,
	 *
	 *      createjs.Graphics.getRGB(50, 100, 150, 0.5);
	 *      // Returns "rgba(50,100,150,0.5)"
	 *
	 * It also supports passing a single hex color value as the first param, and an optional alpha value as the second
	 * param. For example,
	 *
	 *      createjs.Graphics.getRGB(0xFF00FF, 0.2);
	 *      // Returns "rgba(255,0,255,0.2)"
	 *
	 * @method getRGB
	 * @static
	 * @param {Number} r The red component for the color, between 0 and 0xFF (255).
	 * @param {Number} g The green component for the color, between 0 and 0xFF (255).
	 * @param {Number} b The blue component for the color, between 0 and 0xFF (255).
	 * @param {Number} [alpha] The alpha component for the color where 0 is fully transparent and 1 is fully opaque.
	 * @return {String} A CSS compatible color string based on the specified RGB numeric color values in the format
	 * "rgba(255,255,255,1.0)", or if alpha is null then in the format "rgb(255,255,255)".
	 **/
	Graphics.getRGB = function(r, g, b, alpha) {
		if (r != null && b == null) {
			alpha = g;
			b = r&0xFF;
			g = r>>8&0xFF;
			r = r>>16&0xFF;
		}
		if (alpha == null) {
			return "rgb("+r+","+g+","+b+")";
		} else {
			return "rgba("+r+","+g+","+b+","+alpha+")";
		}
	};

	/**
	 * Returns a CSS compatible color string based on the specified HSL numeric color values in the format "hsla(360,100,100,1.0)",
	 * or if alpha is null then in the format "hsl(360,100,100)".
	 *
	 *      createjs.Graphics.getHSL(150, 100, 70);
	 *      // Returns "hsl(150,100,70)"
	 *
	 * @method getHSL
	 * @static
	 * @param {Number} hue The hue component for the color, between 0 and 360.
	 * @param {Number} saturation The saturation component for the color, between 0 and 100.
	 * @param {Number} lightness The lightness component for the color, between 0 and 100.
	 * @param {Number} [alpha] The alpha component for the color where 0 is fully transparent and 1 is fully opaque.
	 * @return {String} A CSS compatible color string based on the specified HSL numeric color values in the format
	 * "hsla(360,100,100,1.0)", or if alpha is null then in the format "hsl(360,100,100)".
	 **/
	Graphics.getHSL = function(hue, saturation, lightness, alpha) {
		if (alpha == null) {
			return "hsl("+(hue%360)+","+saturation+"%,"+lightness+"%)";
		} else {
			return "hsla("+(hue%360)+","+saturation+"%,"+lightness+"%,"+alpha+")";
		}
	};


// static properties:
	/**
	 * A reusable instance of {{#crossLink "Graphics/BeginPath"}}{{/crossLink}} to avoid
	 * unnecessary instantiation.
	 * @property beginCmd
	 * @type {Graphics.BeginPath}
	 * @static
	 **/
	 // defined at the bottom of this file.

	/**
	 * Map of Base64 characters to values. Used by {{#crossLink "Graphics/decodePath"}}{{/crossLink}}.
	 * @property BASE_64
	 * @static
	 * @final
	 * @readonly
	 * @type {Object}
	 **/
	Graphics.BASE_64 = {"A":0,"B":1,"C":2,"D":3,"E":4,"F":5,"G":6,"H":7,"I":8,"J":9,"K":10,"L":11,"M":12,"N":13,"O":14,"P":15,"Q":16,"R":17,"S":18,"T":19,"U":20,"V":21,"W":22,"X":23,"Y":24,"Z":25,"a":26,"b":27,"c":28,"d":29,"e":30,"f":31,"g":32,"h":33,"i":34,"j":35,"k":36,"l":37,"m":38,"n":39,"o":40,"p":41,"q":42,"r":43,"s":44,"t":45,"u":46,"v":47,"w":48,"x":49,"y":50,"z":51,"0":52,"1":53,"2":54,"3":55,"4":56,"5":57,"6":58,"7":59,"8":60,"9":61,"+":62,"/":63};

	/**
	 * Maps numeric values for the caps parameter of {{#crossLink "Graphics/setStrokeStyle"}}{{/crossLink}} to
	 * corresponding string values. This is primarily for use with the tiny API. The mappings are as follows: 0 to
	 * "butt", 1 to "round", and 2 to "square".
	 * For example, to set the line caps to "square":
	 *
	 *      myGraphics.ss(16, 2);
	 *
	 * @property STROKE_CAPS_MAP
	 * @static
	 * @final
	 * @readonly
	 * @type {Array}
	 **/
	Graphics.STROKE_CAPS_MAP = ["butt", "round", "square"];

	/**
	 * Maps numeric values for the joints parameter of {{#crossLink "Graphics/setStrokeStyle"}}{{/crossLink}} to
	 * corresponding string values. This is primarily for use with the tiny API. The mappings are as follows: 0 to
	 * "miter", 1 to "round", and 2 to "bevel".
	 * For example, to set the line joints to "bevel":
	 *
	 *      myGraphics.ss(16, 0, 2);
	 *
	 * @property STROKE_JOINTS_MAP
	 * @static
	 * @final
	 * @readonly
	 * @type {Array}
	 **/
	Graphics.STROKE_JOINTS_MAP = ["miter", "round", "bevel"];

	/**
	 * @property _ctx
	 * @static
	 * @protected
	 * @type {CanvasRenderingContext2D}
	 **/
	var canvas = (createjs.createCanvas?createjs.createCanvas():document.createElement("canvas"));
	if (canvas.getContext) {
		Graphics._ctx = canvas.getContext("2d");
		canvas.width = canvas.height = 1;
	}


// getter / setters:
	/**
	 * Use the {{#crossLink "Graphics/instructions:property"}}{{/crossLink}} property instead.
	 * @method getInstructions
	 * @return {Array}
	 * @deprecated
	 **/
	p.getInstructions = function() {
		this._updateInstructions();
		return this._instructions;
	};

	/**
	 * Returns the graphics instructions array. Each entry is a graphics command object (ex. Graphics.Fill, Graphics.Rect)
	 * Modifying the returned array directly is not recommended, and is likely to result in unexpected behaviour.
	 *
	 * This property is mainly intended for introspection of the instructions (ex. for graphics export).
	 * @property instructions
	 * @type {Array}
	 * @readonly
	 **/
	try {
		Object.defineProperties(p, {
			instructions: { get: p.getInstructions }
		});
	} catch (e) {}


// public methods:
	/**
	 * Returns true if this Graphics instance has no drawing commands.
	 * @method isEmpty
	 * @return {Boolean} Returns true if this Graphics instance has no drawing commands.
	 **/
	p.isEmpty = function() {
		return !(this._instructions.length || this._activeInstructions.length);
	};

	/**
	 * Draws the display object into the specified context ignoring its visible, alpha, shadow, and transform.
	 * Returns true if the draw was handled (useful for overriding functionality).
	 *
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method draw
	 * @param {CanvasRenderingContext2D} ctx The canvas 2D context object to draw into.
	 * @param {Object} data Optional data that is passed to graphics command exec methods. When called from a Shape instance, the shape passes itself as the data parameter. This can be used by custom graphic commands to insert contextual data.
	 **/
	p.draw = function(ctx, data) {
		this._updateInstructions();
		var instr = this._instructions;
		for (var i=this._storeIndex, l=instr.length; i<l; i++) {
			instr[i].exec(ctx, data);
		}
	};

	/**
	 * Draws only the path described for this Graphics instance, skipping any non-path instructions, including fill and
	 * stroke descriptions. Used for <code>DisplayObject.mask</code> to draw the clipping path, for example.
	 *
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method drawAsPath
	 * @param {CanvasRenderingContext2D} ctx The canvas 2D context object to draw into.
	 **/
	p.drawAsPath = function(ctx) {
		this._updateInstructions();
		var instr, instrs = this._instructions;
		for (var i=this._storeIndex, l=instrs.length; i<l; i++) {
			// the first command is always a beginPath command.
			if ((instr = instrs[i]).path !== false) { instr.exec(ctx); }
		}
	};


// public methods that map directly to context 2D calls:
	/**
	 * Moves the drawing point to the specified position. A tiny API method "mt" also exists.
	 * @method moveTo
	 * @param {Number} x The x coordinate the drawing point should move to.
	 * @param {Number} y The y coordinate the drawing point should move to.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls).
	 * @chainable
	 **/
	p.moveTo = function(x, y) {
		return this.append(new G.MoveTo(x,y), true);
	};

	/**
	 * Draws a line from the current drawing point to the specified position, which become the new current drawing
	 * point. A tiny API method "lt" also exists.
	 *
	 * For detailed information, read the
	 * <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#complex-shapes-(paths)">
	 * whatwg spec</a>.
	 * @method lineTo
	 * @param {Number} x The x coordinate the drawing point should draw to.
	 * @param {Number} y The y coordinate the drawing point should draw to.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 **/
	p.lineTo = function(x, y) {
		return this.append(new G.LineTo(x,y));
	};

	/**
	 * Draws an arc with the specified control points and radius.  For detailed information, read the
	 * <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#dom-context-2d-arcto">
	 * whatwg spec</a>. A tiny API method "at" also exists.
	 * @method arcTo
	 * @param {Number} x1
	 * @param {Number} y1
	 * @param {Number} x2
	 * @param {Number} y2
	 * @param {Number} radius
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 **/
	p.arcTo = function(x1, y1, x2, y2, radius) {
		return this.append(new G.ArcTo(x1, y1, x2, y2, radius));
	};

	/**
	 * Draws an arc defined by the radius, startAngle and endAngle arguments, centered at the position (x, y). For
	 * example, to draw a full circle with a radius of 20 centered at (100, 100):
	 *
	 *      arc(100, 100, 20, 0, Math.PI*2);
	 *
	 * For detailed information, read the
	 * <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#dom-context-2d-arc">whatwg spec</a>.
	 * A tiny API method "a" also exists.
	 * @method arc
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} radius
	 * @param {Number} startAngle Measured in radians.
	 * @param {Number} endAngle Measured in radians.
	 * @param {Boolean} anticlockwise
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 **/
	p.arc = function(x, y, radius, startAngle, endAngle, anticlockwise) {
		return this.append(new G.Arc(x, y, radius, startAngle, endAngle, anticlockwise));
	};

	/**
	 * Draws a quadratic curve from the current drawing point to (x, y) using the control point (cpx, cpy). For detailed
	 * information, read the <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#dom-context-2d-quadraticcurveto">
	 * whatwg spec</a>. A tiny API method "qt" also exists.
	 * @method quadraticCurveTo
	 * @param {Number} cpx
	 * @param {Number} cpy
	 * @param {Number} x
	 * @param {Number} y
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 **/
	p.quadraticCurveTo = function(cpx, cpy, x, y) {
		return this.append(new G.QuadraticCurveTo(cpx, cpy, x, y));
	};

	/**
	 * Draws a bezier curve from the current drawing point to (x, y) using the control points (cp1x, cp1y) and (cp2x,
	 * cp2y). For detailed information, read the
	 * <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#dom-context-2d-beziercurveto">
	 * whatwg spec</a>. A tiny API method "bt" also exists.
	 * @method bezierCurveTo
	 * @param {Number} cp1x
	 * @param {Number} cp1y
	 * @param {Number} cp2x
	 * @param {Number} cp2y
	 * @param {Number} x
	 * @param {Number} y
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 **/
	p.bezierCurveTo = function(cp1x, cp1y, cp2x, cp2y, x, y) {
		return this.append(new G.BezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y));
	};

	/**
	 * Draws a rectangle at (x, y) with the specified width and height using the current fill and/or stroke.
	 * For detailed information, read the
	 * <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#dom-context-2d-rect">
	 * whatwg spec</a>. A tiny API method "r" also exists.
	 * @method rect
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} w Width of the rectangle
	 * @param {Number} h Height of the rectangle
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 **/
	p.rect = function(x, y, w, h) {
		return this.append(new G.Rect(x, y, w, h));
	};

	/**
	 * Closes the current path, effectively drawing a line from the current drawing point to the first drawing point specified
	 * since the fill or stroke was last set. A tiny API method "cp" also exists.
	 * @method closePath
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 **/
	p.closePath = function() {
		return this._activeInstructions.length ? this.append(new G.ClosePath()) : this;
	};


// public methods that roughly map to Flash graphics APIs:
	/**
	 * Clears all drawing instructions, effectively resetting this Graphics instance. Any line and fill styles will need
	 * to be redefined to draw shapes following a clear call. A tiny API method "c" also exists.
	 * @method clear
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 **/
	p.clear = function() {
		this._instructions.length = this._activeInstructions.length = this._commitIndex = 0;
		this._strokeStyle = this._oldStrokeStyle = this._stroke = this._fill = this._strokeDash = this._oldStrokeDash = null;
		this._dirty = this._strokeIgnoreScale = false;
		return this;
	};

	/**
	 * Begins a fill with the specified color. This ends the current sub-path. A tiny API method "f" also exists.
	 * @method beginFill
	 * @param {String} color A CSS compatible color value (ex. "red", "#FF0000", or "rgba(255,0,0,0.5)"). Setting to
	 * null will result in no fill.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 **/
	p.beginFill = function(color) {
		return this._setFill(color ? new G.Fill(color) : null);
	};

	/**
	 * Begins a linear gradient fill defined by the line (x0, y0) to (x1, y1). This ends the current sub-path. For
	 * example, the following code defines a black to white vertical gradient ranging from 20px to 120px, and draws a
	 * square to display it:
	 *
	 *      myGraphics.beginLinearGradientFill(["#000","#FFF"], [0, 1], 0, 20, 0, 120).drawRect(20, 20, 120, 120);
	 *
	 * A tiny API method "lf" also exists.
	 * @method beginLinearGradientFill
	 * @param {Array} colors An array of CSS compatible color values. For example, ["#F00","#00F"] would define a gradient
	 * drawing from red to blue.
	 * @param {Array} ratios An array of gradient positions which correspond to the colors. For example, [0.1, 0.9] would draw
	 * the first color to 10% then interpolating to the second color at 90%.
	 * @param {Number} x0 The position of the first point defining the line that defines the gradient direction and size.
	 * @param {Number} y0 The position of the first point defining the line that defines the gradient direction and size.
	 * @param {Number} x1 The position of the second point defining the line that defines the gradient direction and size.
	 * @param {Number} y1 The position of the second point defining the line that defines the gradient direction and size.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 **/
	p.beginLinearGradientFill = function(colors, ratios, x0, y0, x1, y1) {
		return this._setFill(new G.Fill().linearGradient(colors, ratios, x0, y0, x1, y1));
	};

	/**
	 * Begins a radial gradient fill. This ends the current sub-path. For example, the following code defines a red to
	 * blue radial gradient centered at (100, 100), with a radius of 50, and draws a circle to display it:
	 *
	 *      myGraphics.beginRadialGradientFill(["#F00","#00F"], [0, 1], 100, 100, 0, 100, 100, 50).drawCircle(100, 100, 50);
	 *
	 * A tiny API method "rf" also exists.
	 * @method beginRadialGradientFill
	 * @param {Array} colors An array of CSS compatible color values. For example, ["#F00","#00F"] would define
	 * a gradient drawing from red to blue.
	 * @param {Array} ratios An array of gradient positions which correspond to the colors. For example, [0.1,
	 * 0.9] would draw the first color to 10% then interpolating to the second color at 90%.
	 * @param {Number} x0 Center position of the inner circle that defines the gradient.
	 * @param {Number} y0 Center position of the inner circle that defines the gradient.
	 * @param {Number} r0 Radius of the inner circle that defines the gradient.
	 * @param {Number} x1 Center position of the outer circle that defines the gradient.
	 * @param {Number} y1 Center position of the outer circle that defines the gradient.
	 * @param {Number} r1 Radius of the outer circle that defines the gradient.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 **/
	p.beginRadialGradientFill = function(colors, ratios, x0, y0, r0, x1, y1, r1) {
		return this._setFill(new G.Fill().radialGradient(colors, ratios, x0, y0, r0, x1, y1, r1));
	};

	/**
	 * Begins a pattern fill using the specified image. This ends the current sub-path. A tiny API method "bf" also
	 * exists.
	 * @method beginBitmapFill
	 * @param {HTMLImageElement | HTMLCanvasElement | HTMLVideoElement} image The Image, Canvas, or Video object to use
	 * as the pattern. Must be loaded prior to creating a bitmap fill, or the fill will be empty.
	 * @param {String} repetition Optional. Indicates whether to repeat the image in the fill area. One of "repeat",
	 * "repeat-x", "repeat-y", or "no-repeat". Defaults to "repeat". Note that Firefox does not support "repeat-x" or
	 * "repeat-y" (latest tests were in FF 20.0), and will default to "repeat".
	 * @param {Matrix2D} matrix Optional. Specifies a transformation matrix for the bitmap fill. This transformation
	 * will be applied relative to the parent transform.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 **/
	p.beginBitmapFill = function(image, repetition, matrix) {
		return this._setFill(new G.Fill(null,matrix).bitmap(image, repetition));
	};

	/**
	 * Ends the current sub-path, and begins a new one with no fill. Functionally identical to <code>beginFill(null)</code>.
	 * A tiny API method "ef" also exists.
	 * @method endFill
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 **/
	p.endFill = function() {
		return this.beginFill();
	};

	/**
	 * Sets the stroke style. Like all drawing methods, this can be chained, so you can define
	 * the stroke style and color in a single line of code like so:
	 *
	 * 	myGraphics.setStrokeStyle(8,"round").beginStroke("#F00");
	 *
	 * A tiny API method "ss" also exists.
	 * @method setStrokeStyle
	 * @param {Number} thickness The width of the stroke.
	 * @param {String | Number} [caps=0] Indicates the type of caps to use at the end of lines. One of butt,
	 * round, or square. Defaults to "butt". Also accepts the values 0 (butt), 1 (round), and 2 (square) for use with
	 * the tiny API.
	 * @param {String | Number} [joints=0] Specifies the type of joints that should be used where two lines meet.
	 * One of bevel, round, or miter. Defaults to "miter". Also accepts the values 0 (miter), 1 (round), and 2 (bevel)
	 * for use with the tiny API.
	 * @param {Number} [miterLimit=10] If joints is set to "miter", then you can specify a miter limit ratio which
	 * controls at what point a mitered joint will be clipped.
	 * @param {Boolean} [ignoreScale=false] If true, the stroke will be drawn at the specified thickness regardless
	 * of active transformations.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 **/
	p.setStrokeStyle = function(thickness, caps, joints, miterLimit, ignoreScale) {
		this._updateInstructions(true);
		this._strokeStyle = this.command = new G.StrokeStyle(thickness, caps, joints, miterLimit, ignoreScale);

		// ignoreScale lives on Stroke, not StrokeStyle, so we do a little trickery:
		if (this._stroke) { this._stroke.ignoreScale = ignoreScale; }
		this._strokeIgnoreScale = ignoreScale;
		return this;
	};
	
	/**
	 * Sets or clears the stroke dash pattern.
	 *
	 * 	myGraphics.setStrokeDash([20, 10], 0);
	 *
	 * A tiny API method `sd` also exists.
	 * @method setStrokeDash
	 * @param {Array} [segments] An array specifying the dash pattern, alternating between line and gap.
	 * For example, `[20,10]` would create a pattern of 20 pixel lines with 10 pixel gaps between them.
	 * Passing null or an empty array will clear the existing stroke dash.
	 * @param {Number} [offset=0] The offset of the dash pattern. For example, you could increment this value to create a "marching ants" effect.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 **/
	p.setStrokeDash = function(segments, offset) {
		this._updateInstructions(true);
		this._strokeDash = this.command = new G.StrokeDash(segments, offset);
		return this;
	};

	/**
	 * Begins a stroke with the specified color. This ends the current sub-path. A tiny API method "s" also exists.
	 * @method beginStroke
	 * @param {String} color A CSS compatible color value (ex. "#FF0000", "red", or "rgba(255,0,0,0.5)"). Setting to
	 * null will result in no stroke.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 **/
	p.beginStroke = function(color) {
		return this._setStroke(color ? new G.Stroke(color) : null);
	};

	/**
	 * Begins a linear gradient stroke defined by the line (x0, y0) to (x1, y1). This ends the current sub-path. For
	 * example, the following code defines a black to white vertical gradient ranging from 20px to 120px, and draws a
	 * square to display it:
	 *
	 *      myGraphics.setStrokeStyle(10).
	 *          beginLinearGradientStroke(["#000","#FFF"], [0, 1], 0, 20, 0, 120).drawRect(20, 20, 120, 120);
	 *
	 * A tiny API method "ls" also exists.
	 * @method beginLinearGradientStroke
	 * @param {Array} colors An array of CSS compatible color values. For example, ["#F00","#00F"] would define
	 * a gradient drawing from red to blue.
	 * @param {Array} ratios An array of gradient positions which correspond to the colors. For example, [0.1,
	 * 0.9] would draw the first color to 10% then interpolating to the second color at 90%.
	 * @param {Number} x0 The position of the first point defining the line that defines the gradient direction and size.
	 * @param {Number} y0 The position of the first point defining the line that defines the gradient direction and size.
	 * @param {Number} x1 The position of the second point defining the line that defines the gradient direction and size.
	 * @param {Number} y1 The position of the second point defining the line that defines the gradient direction and size.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 **/
	p.beginLinearGradientStroke = function(colors, ratios, x0, y0, x1, y1) {
		return this._setStroke(new G.Stroke().linearGradient(colors, ratios, x0, y0, x1, y1));
	};

	/**
	 * Begins a radial gradient stroke. This ends the current sub-path. For example, the following code defines a red to
	 * blue radial gradient centered at (100, 100), with a radius of 50, and draws a rectangle to display it:
	 *
	 *      myGraphics.setStrokeStyle(10)
	 *          .beginRadialGradientStroke(["#F00","#00F"], [0, 1], 100, 100, 0, 100, 100, 50)
	 *          .drawRect(50, 90, 150, 110);
	 *
	 * A tiny API method "rs" also exists.
	 * @method beginRadialGradientStroke
	 * @param {Array} colors An array of CSS compatible color values. For example, ["#F00","#00F"] would define
	 * a gradient drawing from red to blue.
	 * @param {Array} ratios An array of gradient positions which correspond to the colors. For example, [0.1,
	 * 0.9] would draw the first color to 10% then interpolating to the second color at 90%, then draw the second color
	 * to 100%.
	 * @param {Number} x0 Center position of the inner circle that defines the gradient.
	 * @param {Number} y0 Center position of the inner circle that defines the gradient.
	 * @param {Number} r0 Radius of the inner circle that defines the gradient.
	 * @param {Number} x1 Center position of the outer circle that defines the gradient.
	 * @param {Number} y1 Center position of the outer circle that defines the gradient.
	 * @param {Number} r1 Radius of the outer circle that defines the gradient.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 **/
	p.beginRadialGradientStroke = function(colors, ratios, x0, y0, r0, x1, y1, r1) {
		return this._setStroke(new G.Stroke().radialGradient(colors, ratios, x0, y0, r0, x1, y1, r1));
	};

	/**
	 * Begins a pattern fill using the specified image. This ends the current sub-path. Note that unlike bitmap fills,
	 * strokes do not currently support a matrix parameter due to limitations in the canvas API. A tiny API method "bs"
	 * also exists.
	 * @method beginBitmapStroke
	 * @param {HTMLImageElement | HTMLCanvasElement | HTMLVideoElement} image The Image, Canvas, or Video object to use
	 * as the pattern. Must be loaded prior to creating a bitmap fill, or the fill will be empty.
	 * @param {String} [repetition=repeat] Optional. Indicates whether to repeat the image in the fill area. One of
	 * "repeat", "repeat-x", "repeat-y", or "no-repeat". Defaults to "repeat".
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 **/
	p.beginBitmapStroke = function(image, repetition) {
		// NOTE: matrix is not supported for stroke because transforms on strokes also affect the drawn stroke width.
		return this._setStroke(new G.Stroke().bitmap(image, repetition));
	};

	/**
	 * Ends the current sub-path, and begins a new one with no stroke. Functionally identical to <code>beginStroke(null)</code>.
	 * A tiny API method "es" also exists.
	 * @method endStroke
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 **/
	p.endStroke = function() {
		return this.beginStroke();
	};

	/**
	 * Maps the familiar ActionScript <code>curveTo()</code> method to the functionally similar {{#crossLink "Graphics/quadraticCurveTo"}}{{/crossLink}}
	 * method.
	 * @method quadraticCurveTo
	 * @param {Number} cpx
	 * @param {Number} cpy
	 * @param {Number} x
	 * @param {Number} y
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 **/
	p.curveTo = p.quadraticCurveTo;

	/**
	 *
	 * Maps the familiar ActionScript <code>drawRect()</code> method to the functionally similar {{#crossLink "Graphics/rect"}}{{/crossLink}}
	 * method.
	 * @method drawRect
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} w Width of the rectangle
	 * @param {Number} h Height of the rectangle
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 **/
	p.drawRect = p.rect;

	/**
	 * Draws a rounded rectangle with all corners with the specified radius.
	 * @method drawRoundRect
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} w
	 * @param {Number} h
	 * @param {Number} radius Corner radius.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 **/
	p.drawRoundRect = function(x, y, w, h, radius) {
		return this.drawRoundRectComplex(x, y, w, h, radius, radius, radius, radius);
	};

	/**
	 * Draws a rounded rectangle with different corner radii. Supports positive and negative corner radii. A tiny API
	 * method "rc" also exists.
	 * @method drawRoundRectComplex
	 * @param {Number} x The horizontal coordinate to draw the round rect.
	 * @param {Number} y The vertical coordinate to draw the round rect.
	 * @param {Number} w The width of the round rect.
	 * @param {Number} h The height of the round rect.
	 * @param {Number} radiusTL Top left corner radius.
	 * @param {Number} radiusTR Top right corner radius.
	 * @param {Number} radiusBR Bottom right corner radius.
	 * @param {Number} radiusBL Bottom left corner radius.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 **/
	p.drawRoundRectComplex = function(x, y, w, h, radiusTL, radiusTR, radiusBR, radiusBL) {
		return this.append(new G.RoundRect(x, y, w, h, radiusTL, radiusTR, radiusBR, radiusBL));
	};

	/**
	 * Draws a circle with the specified radius at (x, y).
	 *
	 *      var g = new createjs.Graphics();
	 *	    g.setStrokeStyle(1);
	 *	    g.beginStroke(createjs.Graphics.getRGB(0,0,0));
	 *	    g.beginFill(createjs.Graphics.getRGB(255,0,0));
	 *	    g.drawCircle(0,0,3);
	 *
	 *	    var s = new createjs.Shape(g);
	 *		s.x = 100;
	 *		s.y = 100;
	 *
	 *	    stage.addChild(s);
	 *	    stage.update();
	 *
	 * A tiny API method "dc" also exists.
	 * @method drawCircle
	 * @param {Number} x x coordinate center point of circle.
	 * @param {Number} y y coordinate center point of circle.
	 * @param {Number} radius Radius of circle.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 **/
	p.drawCircle = function(x, y, radius) {
		return this.append(new G.Circle(x, y, radius));
	};

	/**
	 * Draws an ellipse (oval) with a specified width (w) and height (h). Similar to {{#crossLink "Graphics/drawCircle"}}{{/crossLink}},
	 * except the width and height can be different. A tiny API method "de" also exists.
	 * @method drawEllipse
	 * @param {Number} x The left coordinate point of the ellipse. Note that this is different from {{#crossLink "Graphics/drawCircle"}}{{/crossLink}}
	 * which draws from center.
	 * @param {Number} y The top coordinate point of the ellipse. Note that this is different from {{#crossLink "Graphics/drawCircle"}}{{/crossLink}}
	 * which draws from the center.
	 * @param {Number} w The height (horizontal diameter) of the ellipse. The horizontal radius will be half of this
	 * number.
	 * @param {Number} h The width (vertical diameter) of the ellipse. The vertical radius will be half of this number.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 **/
	p.drawEllipse = function(x, y, w, h) {
		return this.append(new G.Ellipse(x, y, w, h));
	};

	/**
	 * Draws a star if pointSize is greater than 0, or a regular polygon if pointSize is 0 with the specified number of
	 * points. For example, the following code will draw a familiar 5 pointed star shape centered at 100, 100 and with a
	 * radius of 50:
	 *
	 *      myGraphics.beginFill("#FF0").drawPolyStar(100, 100, 50, 5, 0.6, -90);
	 *      // Note: -90 makes the first point vertical
	 *
	 * A tiny API method "dp" also exists.
	 *
	 * @method drawPolyStar
	 * @param {Number} x Position of the center of the shape.
	 * @param {Number} y Position of the center of the shape.
	 * @param {Number} radius The outer radius of the shape.
	 * @param {Number} sides The number of points on the star or sides on the polygon.
	 * @param {Number} pointSize The depth or "pointy-ness" of the star points. A pointSize of 0 will draw a regular
	 * polygon (no points), a pointSize of 1 will draw nothing because the points are infinitely pointy.
	 * @param {Number} angle The angle of the first point / corner. For example a value of 0 will draw the first point
	 * directly to the right of the center.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 **/
	p.drawPolyStar = function(x, y, radius, sides, pointSize, angle) {
		return this.append(new G.PolyStar(x, y, radius, sides, pointSize, angle));
	};

	// TODO: deprecated.
	/**
	 * Removed in favour of using custom command objects with {{#crossLink "Graphics/append"}}{{/crossLink}}.
	 * @method inject
	 * @deprecated
	 **/

	/**
	 * Appends a graphics command object to the graphics queue. Command objects expose an "exec" method
	 * that accepts two parameters: the Context2D to operate on, and an arbitrary data object passed into
	 * {{#crossLink "Graphics/draw"}}{{/crossLink}}. The latter will usually be the Shape instance that called draw.
	 *
	 * This method is used internally by Graphics methods, such as drawCircle, but can also be used directly to insert
	 * built-in or custom graphics commands. For example:
	 *
	 * 		// attach data to our shape, so we can access it during the draw:
	 * 		myShape.color = "red";
	 *
	 * 		// append a Circle command object:
	 * 		myShape.graphics.append(new Graphics.Circle(50, 50, 30));
	 *
	 * 		// append a custom command object with an exec method that sets the fill style
	 * 		// based on the shape's data, and then fills the circle.
	 * 		myShape.graphics.append({exec:function(ctx, shape) {
	 * 			ctx.fillStyle = shape.color;
	 * 			ctx.fill();
	 * 		}});
	 *
	 * @method append
	 * @param {Object} command A graphics command object exposing an "exec" method.
	 * @param {boolean} clean The clean param is primarily for internal use. A value of true indicates that a command does not generate a path that should be stroked or filled.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 **/
	p.append = function(command, clean) {
		this._activeInstructions.push(command);
		this.command = command;
		if (!clean) { this._dirty = true; }
		return this;
	};

	/**
	 * Decodes a compact encoded path string into a series of draw instructions.
	 * This format is not intended to be human readable, and is meant for use by authoring tools.
	 * The format uses a base64 character set, with each character representing 6 bits, to define a series of draw
	 * commands.
	 *
	 * Each command is comprised of a single "header" character followed by a variable number of alternating x and y
	 * position values. Reading the header bits from left to right (most to least significant): bits 1 to 3 specify the
	 * type of operation (0-moveTo, 1-lineTo, 2-quadraticCurveTo, 3-bezierCurveTo, 4-closePath, 5-7 unused). Bit 4
	 * indicates whether position values use 12 bits (2 characters) or 18 bits (3 characters), with a one indicating the
	 * latter. Bits 5 and 6 are currently unused.
	 *
	 * Following the header is a series of 0 (closePath), 2 (moveTo, lineTo), 4 (quadraticCurveTo), or 6 (bezierCurveTo)
	 * parameters. These parameters are alternating x/y positions represented by 2 or 3 characters (as indicated by the
	 * 4th bit in the command char). These characters consist of a 1 bit sign (1 is negative, 0 is positive), followed
	 * by an 11 (2 char) or 17 (3 char) bit integer value. All position values are in tenths of a pixel. Except in the
	 * case of move operations which are absolute, this value is a delta from the previous x or y position (as
	 * appropriate).
	 *
	 * For example, the string "A3cAAMAu4AAA" represents a line starting at -150,0 and ending at 150,0.
	 * <br />A - bits 000000. First 3 bits (000) indicate a moveTo operation. 4th bit (0) indicates 2 chars per
	 * parameter.
	 * <br />n0 - 110111011100. Absolute x position of -150.0px. First bit indicates a negative value, remaining bits
	 * indicate 1500 tenths of a pixel.
	 * <br />AA - 000000000000. Absolute y position of 0.
	 * <br />I - 001100. First 3 bits (001) indicate a lineTo operation. 4th bit (1) indicates 3 chars per parameter.
	 * <br />Au4 - 000000101110111000. An x delta of 300.0px, which is added to the previous x value of -150.0px to
	 * provide an absolute position of +150.0px.
	 * <br />AAA - 000000000000000000. A y delta value of 0.
	 *
	 * A tiny API method "p" also exists.
	 * @method decodePath
	 * @param {String} str The path string to decode.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 **/
	p.decodePath = function(str) {
		var instructions = [this.moveTo, this.lineTo, this.quadraticCurveTo, this.bezierCurveTo, this.closePath];
		var paramCount = [2, 2, 4, 6, 0];
		var i=0, l=str.length;
		var params = [];
		var x=0, y=0;
		var base64 = Graphics.BASE_64;

		while (i<l) {
			var c = str.charAt(i);
			var n = base64[c];
			var fi = n>>3; // highest order bits 1-3 code for operation.
			var f = instructions[fi];
			// check that we have a valid instruction & that the unused bits are empty:
			if (!f || (n&3)) { throw("bad path data (@"+i+"): "+c); }
			var pl = paramCount[fi];
			if (!fi) { x=y=0; } // move operations reset the position.
			params.length = 0;
			i++;
			var charCount = (n>>2&1)+2;  // 4th header bit indicates number size for this operation.
			for (var p=0; p<pl; p++) {
				var num = base64[str.charAt(i)];
				var sign = (num>>5) ? -1 : 1;
				num = ((num&31)<<6)|(base64[str.charAt(i+1)]);
				if (charCount == 3) { num = (num<<6)|(base64[str.charAt(i+2)]); }
				num = sign*num/10;
				if (p%2) { x = (num += x); }
				else { y = (num += y); }
				params[p] = num;
				i += charCount;
			}
			f.apply(this,params);
		}
		return this;
	};

	/**
	 * Stores all graphics commands so they won't be executed in future draws. Calling store() a second time adds to
	 * the existing store. This also affects `drawAsPath()`.
	 *
	 * This is useful in cases where you are creating vector graphics in an iterative manner (ex. generative art), so
	 * that only new graphics need to be drawn (which can provide huge performance benefits), but you wish to retain all
	 * of the vector instructions for later use (ex. scaling, modifying, or exporting).
	 *
	 * Note that calling store() will force the active path (if any) to be ended in a manner similar to changing
	 * the fill or stroke.
	 *
	 * For example, consider a application where the user draws lines with the mouse. As each line segment (or collection of
	 * segments) are added to a Shape, it can be rasterized using {{#crossLink "DisplayObject/updateCache"}}{{/crossLink}},
	 * and then stored, so that it can be redrawn at a different scale when the application is resized, or exported to SVG.
	 *
	 * 	// set up cache:
	 * 	myShape.cache(0,0,500,500,scale);
	 *
	 * 	// when the user drags, draw a new line:
	 * 	myShape.graphics.moveTo(oldX,oldY).lineTo(newX,newY);
	 * 	// then draw it into the existing cache:
	 * 	myShape.updateCache("source-over");
	 * 	// store the new line, so it isn't redrawn next time:
	 * 	myShape.store();
	 *
	 * 	// then, when the window resizes, we can re-render at a different scale:
	 * 	// first, unstore all our lines:
	 * 	myShape.unstore();
	 * 	// then cache using the new scale:
	 * 	myShape.cache(0,0,500,500,newScale);
	 * 	// finally, store the existing commands again:
	 * 	myShape.store();
	 *
	 * @method store
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 **/
	p.store = function() {
		this._updateInstructions(true);
		this._storeIndex = this._instructions.length;
		return this;
	};

	/**
	 * Unstores any graphics commands that were previously stored using {{#crossLink "Graphics/store"}}{{/crossLink}}
	 * so that they will be executed in subsequent draw calls.
	 *
	 * @method unstore
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 **/
	p.unstore = function() {
		this._storeIndex = 0;
		return this;
	};

	/**
	 * Returns a clone of this Graphics instance. Note that the individual command objects are not cloned.
	 * @method clone
	 * @return {Graphics} A clone of the current Graphics instance.
	 **/
	p.clone = function() {
		var o = new Graphics();
		o.command = this.command;
		o._stroke = this._stroke;
		o._strokeStyle = this._strokeStyle;
		o._strokeDash = this._strokeDash;
		o._strokeIgnoreScale = this._strokeIgnoreScale;
		o._fill = this._fill;
		o._instructions = this._instructions.slice();
		o._commitIndex = this._commitIndex;
		o._activeInstructions = this._activeInstructions.slice();
		o._dirty = this._dirty;
		o._storeIndex = this._storeIndex;
		return o;
	};

	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 **/
	p.toString = function() {
		return "[Graphics]";
	};


// tiny API:
	/**
	 * Shortcut to moveTo.
	 * @method mt
	 * @param {Number} x The x coordinate the drawing point should move to.
	 * @param {Number} y The y coordinate the drawing point should move to.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls).
	 * @chainable
	 * @protected
	 **/
	p.mt = p.moveTo;

	/**
	 * Shortcut to lineTo.
	 * @method lt
	 * @param {Number} x The x coordinate the drawing point should draw to.
	 * @param {Number} y The y coordinate the drawing point should draw to.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 * @protected
	 **/
	p.lt = p.lineTo;

	/**
	 * Shortcut to arcTo.
	 * @method at
	 * @param {Number} x1
	 * @param {Number} y1
	 * @param {Number} x2
	 * @param {Number} y2
	 * @param {Number} radius
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 * @protected
	 **/
	p.at = p.arcTo;

	/**
	 * Shortcut to bezierCurveTo.
	 * @method bt
	 * @param {Number} cp1x
	 * @param {Number} cp1y
	 * @param {Number} cp2x
	 * @param {Number} cp2y
	 * @param {Number} x
	 * @param {Number} y
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 * @protected
	 **/
	p.bt = p.bezierCurveTo;

	/**
	 * Shortcut to quadraticCurveTo / curveTo.
	 * @method qt
	 * @param {Number} cpx
	 * @param {Number} cpy
	 * @param {Number} x
	 * @param {Number} y
	 * @protected
	 * @chainable
	 **/
	p.qt = p.quadraticCurveTo;

	/**
	 * Shortcut to arc.
	 * @method a
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} radius
	 * @param {Number} startAngle Measured in radians.
	 * @param {Number} endAngle Measured in radians.
	 * @param {Boolean} anticlockwise
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @protected
	 * @chainable
	 **/
	p.a = p.arc;

	/**
	 * Shortcut to rect.
	 * @method r
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} w Width of the rectangle
	 * @param {Number} h Height of the rectangle
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 * @protected
	 **/
	p.r = p.rect;

	/**
	 * Shortcut to closePath.
	 * @method cp
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 * @protected
	 **/
	p.cp = p.closePath;

	/**
	 * Shortcut to clear.
	 * @method c
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 * @protected
	 **/
	p.c = p.clear;

	/**
	 * Shortcut to beginFill.
	 * @method f
	 * @param {String} color A CSS compatible color value (ex. "red", "#FF0000", or "rgba(255,0,0,0.5)"). Setting to
	 * null will result in no fill.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 * @protected
	 **/
	p.f = p.beginFill;

	/**
	 * Shortcut to beginLinearGradientFill.
	 * @method lf
	 * @param {Array} colors An array of CSS compatible color values. For example, ["#F00","#00F"] would define a gradient
	 * drawing from red to blue.
	 * @param {Array} ratios An array of gradient positions which correspond to the colors. For example, [0.1, 0.9] would draw
	 * the first color to 10% then interpolating to the second color at 90%.
	 * @param {Number} x0 The position of the first point defining the line that defines the gradient direction and size.
	 * @param {Number} y0 The position of the first point defining the line that defines the gradient direction and size.
	 * @param {Number} x1 The position of the second point defining the line that defines the gradient direction and size.
	 * @param {Number} y1 The position of the second point defining the line that defines the gradient direction and size.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 * @protected
	 **/
	p.lf = p.beginLinearGradientFill;

	/**
	 * Shortcut to beginRadialGradientFill.
	 * @method rf
	 * @param {Array} colors An array of CSS compatible color values. For example, ["#F00","#00F"] would define
	 * a gradient drawing from red to blue.
	 * @param {Array} ratios An array of gradient positions which correspond to the colors. For example, [0.1,
	 * 0.9] would draw the first color to 10% then interpolating to the second color at 90%.
	 * @param {Number} x0 Center position of the inner circle that defines the gradient.
	 * @param {Number} y0 Center position of the inner circle that defines the gradient.
	 * @param {Number} r0 Radius of the inner circle that defines the gradient.
	 * @param {Number} x1 Center position of the outer circle that defines the gradient.
	 * @param {Number} y1 Center position of the outer circle that defines the gradient.
	 * @param {Number} r1 Radius of the outer circle that defines the gradient.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 * @protected
	 **/
	p.rf = p.beginRadialGradientFill;

	/**
	 * Shortcut to beginBitmapFill.
	 * @method bf
	 * @param {HTMLImageElement | HTMLCanvasElement | HTMLVideoElement} image The Image, Canvas, or Video object to use
	 * as the pattern.
	 * @param {String} repetition Optional. Indicates whether to repeat the image in the fill area. One of "repeat",
	 * "repeat-x", "repeat-y", or "no-repeat". Defaults to "repeat". Note that Firefox does not support "repeat-x" or
	 * "repeat-y" (latest tests were in FF 20.0), and will default to "repeat".
	 * @param {Matrix2D} matrix Optional. Specifies a transformation matrix for the bitmap fill. This transformation
	 * will be applied relative to the parent transform.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 * @protected
	 **/
	p.bf = p.beginBitmapFill;

	/**
	 * Shortcut to endFill.
	 * @method ef
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 * @protected
	 **/
	p.ef = p.endFill;

	/**
	 * Shortcut to setStrokeStyle.
	 * @method ss
	 * @param {Number} thickness The width of the stroke.
	 * @param {String | Number} [caps=0] Indicates the type of caps to use at the end of lines. One of butt,
	 * round, or square. Defaults to "butt". Also accepts the values 0 (butt), 1 (round), and 2 (square) for use with
	 * the tiny API.
	 * @param {String | Number} [joints=0] Specifies the type of joints that should be used where two lines meet.
	 * One of bevel, round, or miter. Defaults to "miter". Also accepts the values 0 (miter), 1 (round), and 2 (bevel)
	 * for use with the tiny API.
	 * @param {Number} [miterLimit=10] If joints is set to "miter", then you can specify a miter limit ratio which
	 * controls at what point a mitered joint will be clipped.
	 * @param {Boolean} [ignoreScale=false] If true, the stroke will be drawn at the specified thickness regardless
	 * of active transformations.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 * @protected
	 **/
	p.ss = p.setStrokeStyle;
	
	/**
	 * Shortcut to setStrokeDash.
	 * @method sd
	 * @param {Array} [segments] An array specifying the dash pattern, alternating between line and gap.
	 * For example, [20,10] would create a pattern of 20 pixel lines with 10 pixel gaps between them.
	 * Passing null or an empty array will clear any existing dash.
	 * @param {Number} [offset=0] The offset of the dash pattern. For example, you could increment this value to create a "marching ants" effect.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 * @protected
	 **/
	p.sd = p.setStrokeDash;

	/**
	 * Shortcut to beginStroke.
	 * @method s
	 * @param {String} color A CSS compatible color value (ex. "#FF0000", "red", or "rgba(255,0,0,0.5)"). Setting to
	 * null will result in no stroke.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 * @protected
	 **/
	p.s = p.beginStroke;

	/**
	 * Shortcut to beginLinearGradientStroke.
	 * @method ls
	 * @param {Array} colors An array of CSS compatible color values. For example, ["#F00","#00F"] would define
	 * a gradient drawing from red to blue.
	 * @param {Array} ratios An array of gradient positions which correspond to the colors. For example, [0.1,
	 * 0.9] would draw the first color to 10% then interpolating to the second color at 90%.
	 * @param {Number} x0 The position of the first point defining the line that defines the gradient direction and size.
	 * @param {Number} y0 The position of the first point defining the line that defines the gradient direction and size.
	 * @param {Number} x1 The position of the second point defining the line that defines the gradient direction and size.
	 * @param {Number} y1 The position of the second point defining the line that defines the gradient direction and size.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 * @protected
	 **/
	p.ls = p.beginLinearGradientStroke;

	/**
	 * Shortcut to beginRadialGradientStroke.
	 * @method rs
	 * @param {Array} colors An array of CSS compatible color values. For example, ["#F00","#00F"] would define
	 * a gradient drawing from red to blue.
	 * @param {Array} ratios An array of gradient positions which correspond to the colors. For example, [0.1,
	 * 0.9] would draw the first color to 10% then interpolating to the second color at 90%, then draw the second color
	 * to 100%.
	 * @param {Number} x0 Center position of the inner circle that defines the gradient.
	 * @param {Number} y0 Center position of the inner circle that defines the gradient.
	 * @param {Number} r0 Radius of the inner circle that defines the gradient.
	 * @param {Number} x1 Center position of the outer circle that defines the gradient.
	 * @param {Number} y1 Center position of the outer circle that defines the gradient.
	 * @param {Number} r1 Radius of the outer circle that defines the gradient.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 * @protected
	 **/
	p.rs = p.beginRadialGradientStroke;

	/**
	 * Shortcut to beginBitmapStroke.
	 * @method bs
	 * @param {HTMLImageElement | HTMLCanvasElement | HTMLVideoElement} image The Image, Canvas, or Video object to use
	 * as the pattern.
	 * @param {String} [repetition=repeat] Optional. Indicates whether to repeat the image in the fill area. One of
	 * "repeat", "repeat-x", "repeat-y", or "no-repeat". Defaults to "repeat".
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 * @protected
	 **/
	p.bs = p.beginBitmapStroke;

	/**
	 * Shortcut to endStroke.
	 * @method es
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 * @protected
	 **/
	p.es = p.endStroke;

	/**
	 * Shortcut to drawRect.
	 * @method dr
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} w Width of the rectangle
	 * @param {Number} h Height of the rectangle
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 * @protected
	 **/
	p.dr = p.drawRect;

	/**
	 * Shortcut to drawRoundRect.
	 * @method rr
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} w
	 * @param {Number} h
	 * @param {Number} radius Corner radius.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 * @protected
	 **/
	p.rr = p.drawRoundRect;

	/**
	 * Shortcut to drawRoundRectComplex.
	 * @method rc
	 * @param {Number} x The horizontal coordinate to draw the round rect.
	 * @param {Number} y The vertical coordinate to draw the round rect.
	 * @param {Number} w The width of the round rect.
	 * @param {Number} h The height of the round rect.
	 * @param {Number} radiusTL Top left corner radius.
	 * @param {Number} radiusTR Top right corner radius.
	 * @param {Number} radiusBR Bottom right corner radius.
	 * @param {Number} radiusBL Bottom left corner radius.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 * @protected
	 **/
	p.rc = p.drawRoundRectComplex;

	/**
	 * Shortcut to drawCircle.
	 * @method dc
	 * @param {Number} x x coordinate center point of circle.
	 * @param {Number} y y coordinate center point of circle.
	 * @param {Number} radius Radius of circle.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 * @protected
	 **/
	p.dc = p.drawCircle;

	/**
	 * Shortcut to drawEllipse.
	 * @method de
	 * @param {Number} x The left coordinate point of the ellipse. Note that this is different from {{#crossLink "Graphics/drawCircle"}}{{/crossLink}}
	 * which draws from center.
	 * @param {Number} y The top coordinate point of the ellipse. Note that this is different from {{#crossLink "Graphics/drawCircle"}}{{/crossLink}}
	 * which draws from the center.
	 * @param {Number} w The height (horizontal diameter) of the ellipse. The horizontal radius will be half of this
	 * number.
	 * @param {Number} h The width (vertical diameter) of the ellipse. The vertical radius will be half of this number.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 * @protected
	 **/
	p.de = p.drawEllipse;

	/**
	 * Shortcut to drawPolyStar.
	 * @method dp
	 * @param {Number} x Position of the center of the shape.
	 * @param {Number} y Position of the center of the shape.
	 * @param {Number} radius The outer radius of the shape.
	 * @param {Number} sides The number of points on the star or sides on the polygon.
	 * @param {Number} pointSize The depth or "pointy-ness" of the star points. A pointSize of 0 will draw a regular
	 * polygon (no points), a pointSize of 1 will draw nothing because the points are infinitely pointy.
	 * @param {Number} angle The angle of the first point / corner. For example a value of 0 will draw the first point
	 * directly to the right of the center.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 * @protected
	 **/
	p.dp = p.drawPolyStar;

	/**
	 * Shortcut to decodePath.
	 * @method p
	 * @param {String} str The path string to decode.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 * @protected
	 **/
	p.p = p.decodePath;


// private methods:
	/**
	 * @method _updateInstructions
	 * @param commit
	 * @protected
	 **/
	p._updateInstructions = function(commit) {
		var instr = this._instructions, active = this._activeInstructions, commitIndex = this._commitIndex;

		if (this._dirty && active.length) {
			instr.length = commitIndex; // remove old, uncommitted commands
			instr.push(Graphics.beginCmd);

			var l = active.length, ll = instr.length;
			instr.length = ll+l;
			for (var i=0; i<l; i++) { instr[i+ll] = active[i]; }

			if (this._fill) { instr.push(this._fill); }
			if (this._stroke) {
				// doesn't need to be re-applied if it hasn't changed.
				if (this._strokeDash !== this._oldStrokeDash) {
					this._oldStrokeDash = this._strokeDash;
					instr.push(this._strokeDash);
				}
				if (this._strokeStyle !== this._oldStrokeStyle) {
					this._oldStrokeStyle = this._strokeStyle;
					instr.push(this._strokeStyle);
				}
				instr.push(this._stroke);
			}

			this._dirty = false;
		}

		if (commit) {
			active.length = 0;
			this._commitIndex = instr.length;
		}
	};

	/**
	 * @method _setFill
	 * @param fill
	 * @protected
	 **/
	p._setFill = function(fill) {
		this._updateInstructions(true);
		this.command = this._fill = fill;
		return this;
	};

	/**
	 * @method _setStroke
	 * @param stroke
	 * @protected
	 **/
	p._setStroke = function(stroke) {
		this._updateInstructions(true);
		if (this.command = this._stroke = stroke) {
			stroke.ignoreScale = this._strokeIgnoreScale;
		}
		return this;
	};

// Command Objects:
	/**
	 * @namespace Graphics
	 */
	/**
	 * Graphics command object. See {{#crossLink "Graphics/lineTo"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information. See {{#crossLink "Graphics"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
	 * @class LineTo
	 * @constructor
	 * @param {Number} x
	 * @param {Number} y
	 **/
	/**
	 * @property x
	 * @type Number
	 */
	/**
	 * @property y
	 * @type Number
	 */
	/**
	 * @method exec
	 * @param {CanvasRenderingContext2D} ctx
	 */
	(G.LineTo = function(x, y) {
		this.x = x; this.y = y;
	}).prototype.exec = function(ctx) { ctx.lineTo(this.x,this.y); };

	/**
	 * Graphics command object. See {{#crossLink "Graphics/moveTo"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
	 * @class MoveTo
	 * @constructor
	 * @param {Number} x
	 * @param {Number} y
	 **/
	/**
	 * @property x
	 * @type Number
	 */
	/**
	 * @property y
	 * @type Number
	 */
	/**
	 * @method exec
	 * @param {CanvasRenderingContext2D} ctx
	 */
	(G.MoveTo = function(x, y) {
		this.x = x; this.y = y;
	}).prototype.exec = function(ctx) { ctx.moveTo(this.x, this.y); };


	/**
	 * Graphics command object. See {{#crossLink "Graphics/arcTo"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
	 * @class ArcTo
	 * @constructor
	 * @param {Number} x1
	 * @param {Number} y1
	 * @param {Number} x2
	 * @param {Number} y2
	 * @param {Number} radius
	 **/
	/**
	 * @property x1
	 * @type Number
	 */
	/**
	 * @property y1
	 * @type Number
	 */
	/**
	 * @property x2
	 * @type Number
	 */
	/**
	 * @property y2
	 * @type Number
	 */
	/**
	 * @property radius
	 * @type Number
	 */
	/**
	 * @method exec
	 * @param {CanvasRenderingContext2D} ctx
	 */
	(G.ArcTo = function(x1, y1, x2, y2, radius) {
		this.x1 = x1; this.y1 = y1;
		this.x2 = x2; this.y2 = y2;
		this.radius = radius;
	}).prototype.exec = function(ctx) { ctx.arcTo(this.x1, this.y1, this.x2, this.y2, this.radius); };

	/**
	 * Graphics command object. See {{#crossLink "Graphics/arc"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
	 * @class Arc
	 * @constructor
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} radius
	 * @param {Number} startAngle
	 * @param {Number} endAngle
	 * @param {Number} anticlockwise
	 **/
	/**
	 * @property x
	 * @type Number
	 */
	/**
	 * @property y
	 * @type Number
	 */
	/**
	 * @property radius
	 * @type Number
	 */
	/**
	 * @property startAngle
	 * @type Number
	 */
	/**
	 * @property endAngle
	 * @type Number
	 */
	/**
	 * @property anticlockwise
	 * @type Number
	 */
	/**
	 * @method exec
	 * @param {CanvasRenderingContext2D} ctx
	 */
	(G.Arc = function(x, y, radius, startAngle, endAngle, anticlockwise) {
		this.x = x; this.y = y;
		this.radius = radius;
		this.startAngle = startAngle; this.endAngle = endAngle;
		this.anticlockwise = !!anticlockwise;
	}).prototype.exec = function(ctx) { ctx.arc(this.x, this.y, this.radius, this.startAngle, this.endAngle, this.anticlockwise); };

	/**
	 * Graphics command object. See {{#crossLink "Graphics/quadraticCurveTo"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
	 * @class QuadraticCurveTo
	 * @constructor
	 * @param {Number} cpx
	 * @param {Number} cpy
	 * @param {Number} x
	 * @param {Number} y
	 **/
	/**
	 * @property cpx
	 * @type Number
	 */
	/**
	 * @property cpy
	 * @type Number
	 */
	/**
	 * @property x
	 * @type Number
	 */
	/**
	 * @property y
	 * @type Number
	 */
	/**
	 * @method exec
	 * @param {CanvasRenderingContext2D} ctx
	 */
	(G.QuadraticCurveTo = function(cpx, cpy, x, y) {
		this.cpx = cpx; this.cpy = cpy;
		this.x = x; this.y = y;
	}).prototype.exec = function(ctx) { ctx.quadraticCurveTo(this.cpx, this.cpy, this.x, this.y); };

	/**
	 * Graphics command object. See {{#crossLink "Graphics/bezierCurveTo"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
	 * @class BezierCurveTo
	 * @constructor
	 * @param {Number} cp1x
	 * @param {Number} cp1y
	 * @param {Number} cp2x
	 * @param {Number} cp2y
	 * @param {Number} x
	 * @param {Number} y
	 **/
	/**
	 * @property cp1x
	 * @type Number
	 */
	/**
	 * @property cp1y
	 * @type Number
	 */
	/**
	 * @property cp2x
	 * @type Number
	 */
	/**
	 * @property cp2y
	 * @type Number
	 */
	/**
	 * @property x
	 * @type Number
	 */
	/**
	 * @property y
	 * @type Number
	 */
	/**
	 * @method exec
	 * @param {CanvasRenderingContext2D} ctx
	 */
	(G.BezierCurveTo = function(cp1x, cp1y, cp2x, cp2y, x, y) {
		this.cp1x = cp1x; this.cp1y = cp1y;
		this.cp2x = cp2x; this.cp2y = cp2y;
		this.x = x; this.y = y;
	}).prototype.exec = function(ctx) { ctx.bezierCurveTo(this.cp1x, this.cp1y, this.cp2x, this.cp2y, this.x, this.y); };

	/**
	 * Graphics command object. See {{#crossLink "Graphics/rect"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
	 * @class Rect
	 * @constructor
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} w
	 * @param {Number} h
	 **/
	/**
	 * @property x
	 * @type Number
	 */
	/**
	 * @property y
	 * @type Number
	 */
	/**
	 * @property w
	 * @type Number
	 */
	/**
	 * @property h
	 * @type Number
	 */
	/**
	 * @method exec
	 * @param {CanvasRenderingContext2D} ctx
	 */
	(G.Rect = function(x, y, w, h) {
		this.x = x; this.y = y;
		this.w = w; this.h = h;
	}).prototype.exec = function(ctx) { ctx.rect(this.x, this.y, this.w, this.h); };

	/**
	 * Graphics command object. See {{#crossLink "Graphics/closePath"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
	 * @class ClosePath
	 * @constructor
	 **/
	/**
	 * @method exec
	 * @param {CanvasRenderingContext2D} ctx
	 */
	(G.ClosePath = function() {
	}).prototype.exec = function(ctx) { ctx.closePath(); };

	/**
	 * Graphics command object to begin a new path. See {{#crossLink "Graphics"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
	 * @class BeginPath
	 * @constructor
	 **/
	/**
	 * @method exec
	 * @param {CanvasRenderingContext2D} ctx
	 */
	(G.BeginPath = function() {
	}).prototype.exec = function(ctx) { ctx.beginPath(); };

	/**
	 * Graphics command object. See {{#crossLink "Graphics/beginFill"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
	 * @class Fill
	 * @constructor
	 * @param {Object} style A valid Context2D fillStyle.
	 * @param {Matrix2D} matrix
	 **/
	/**
	 * A valid Context2D fillStyle.
	 * @property style
	 * @type Object
	 */
	/**
	 * @property matrix
	 * @type Matrix2D
	 */
	/**
	 * @method exec
	 * @param {CanvasRenderingContext2D} ctx
	 */
	p = (G.Fill = function(style, matrix) {
		this.style = style;
		this.matrix = matrix;
	}).prototype;
	p.exec = function(ctx) {
		if (!this.style) { return; }
		ctx.fillStyle = this.style;
		var mtx = this.matrix;
		if (mtx) { ctx.save(); ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty); }
		ctx.fill();
		if (mtx) { ctx.restore(); }
	};
	/**
	 * Creates a linear gradient style and assigns it to {{#crossLink "Fill/style:property"}}{{/crossLink}}.
	 * See {{#crossLink "Graphics/beginLinearGradientFill"}}{{/crossLink}} for more information.
	 * @method linearGradient
	 * @param {Array} colors
	 * @param {Array} ratios
	 * @param {Number} x0
	 * @param {Number} y0
	 * @param {Number} x1
	 * @param {Number} y1
	 * @return {Fill} Returns this Fill object for chaining or assignment.
	 */
	p.linearGradient = function(colors, ratios, x0, y0, x1, y1) {
		var o = this.style =  Graphics._ctx.createLinearGradient(x0, y0, x1, y1);
		for (var i=0, l=colors.length; i<l; i++) { o.addColorStop(ratios[i], colors[i]); }
		o.props = {colors:colors, ratios:ratios, x0:x0, y0:y0, x1:x1, y1:y1, type:"linear"};
		return this;
	};
	/**
	 * Creates a radial gradient style and assigns it to {{#crossLink "Fill/style:property"}}{{/crossLink}}.
	 * See {{#crossLink "Graphics/beginRadialGradientFill"}}{{/crossLink}} for more information.
	 * @method radialGradient
	 * @param {Array} colors
	 * @param {Array} ratios
	 * @param {Number} x0
	 * @param {Number} y0
	 * @param {Number} r0
	 * @param {Number} x1
	 * @param {Number} y1
	 * @param {Number} r1
	 * @return {Fill} Returns this Fill object for chaining or assignment.
	 */
	p.radialGradient = function(colors, ratios, x0, y0, r0, x1, y1, r1) {
		var o = this.style =  Graphics._ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
		for (var i=0, l=colors.length; i<l; i++) { o.addColorStop(ratios[i], colors[i]); }
		o.props = {colors:colors, ratios:ratios, x0:x0, y0:y0, r0:r0, x1:x1, y1:y1, r1:r1, type:"radial"};
		return this;
	};
	/**
	 * Creates a bitmap fill style and assigns it to the {{#crossLink "Fill/style:property"}}{{/crossLink}}.
	 * See {{#crossLink "Graphics/beginBitmapFill"}}{{/crossLink}} for more information.
	 * @method bitmap
	 * @param {HTMLImageElement | HTMLCanvasElement | HTMLVideoElement} image  Must be loaded prior to creating a bitmap fill, or the fill will be empty.
	 * @param {String} [repetition] One of: repeat, repeat-x, repeat-y, or no-repeat.
	 * @return {Fill} Returns this Fill object for chaining or assignment.
	 */
	p.bitmap = function(image, repetition) {
		if (image.naturalWidth || image.getContext || image.readyState >= 2) {
			var o = this.style = Graphics._ctx.createPattern(image, repetition || "");
			o.props = {image: image, repetition: repetition, type: "bitmap"};
		}
		return this;
	};
	p.path = false;

	/**
	 * Graphics command object. See {{#crossLink "Graphics/beginStroke"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
	 * @class Stroke
	 * @constructor
	 * @param {Object} style A valid Context2D fillStyle.
	 * @param {Boolean} ignoreScale
	 **/
	/**
	 * A valid Context2D strokeStyle.
	 * @property style
	 * @type Object
	 */
	/**
	 * @property ignoreScale
	 * @type Boolean
	 */
	/**
	 * @method exec
	 * @param {CanvasRenderingContext2D} ctx
	 */
	p = (G.Stroke = function(style, ignoreScale) {
		this.style = style;
		this.ignoreScale = ignoreScale;
	}).prototype;
	p.exec = function(ctx) {
		if (!this.style) { return; }
		ctx.strokeStyle = this.style;
		if (this.ignoreScale) { ctx.save(); ctx.setTransform(1,0,0,1,0,0); }
		ctx.stroke();
		if (this.ignoreScale) { ctx.restore(); }
	};
	/**
	 * Creates a linear gradient style and assigns it to {{#crossLink "Stroke/style:property"}}{{/crossLink}}.
	 * See {{#crossLink "Graphics/beginLinearGradientStroke"}}{{/crossLink}} for more information.
	 * @method linearGradient
	 * @param {Array} colors
	 * @param {Array} ratios
	 * @param {Number} x0
	 * @param {Number} y0
	 * @param {Number} x1
	 * @param {Number} y1
	 * @return {Fill} Returns this Stroke object for chaining or assignment.
	 */
	p.linearGradient = G.Fill.prototype.linearGradient;
	/**
	 * Creates a radial gradient style and assigns it to {{#crossLink "Stroke/style:property"}}{{/crossLink}}.
	 * See {{#crossLink "Graphics/beginRadialGradientStroke"}}{{/crossLink}} for more information.
	 * @method radialGradient
	 * @param {Array} colors
	 * @param {Array} ratios
	 * @param {Number} x0
	 * @param {Number} y0
	 * @param {Number} r0
	 * @param {Number} x1
	 * @param {Number} y1
	 * @param {Number} r1
	 * @return {Fill} Returns this Stroke object for chaining or assignment.
	 */
	p.radialGradient = G.Fill.prototype.radialGradient;
	/**
	 * Creates a bitmap fill style and assigns it to {{#crossLink "Stroke/style:property"}}{{/crossLink}}.
	 * See {{#crossLink "Graphics/beginBitmapStroke"}}{{/crossLink}} for more information.
	 * @method bitmap
	 * @param {HTMLImageElement} image
	 * @param {String} [repetition] One of: repeat, repeat-x, repeat-y, or no-repeat.
	 * @return {Fill} Returns this Stroke object for chaining or assignment.
	 */
	p.bitmap = G.Fill.prototype.bitmap;
	p.path = false;

	/**
	 * Graphics command object. See {{#crossLink "Graphics/setStrokeStyle"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
	 * @class StrokeStyle
	 * @constructor
	 * @param {Number} width
	 * @param {String} [caps]
	 * @param {String} [joints]
	 * @param {Number} [miterLimit]
	 **/
	/**
	 * @property width
	 * @type Number
	 */
	/**
	 * One of: butt, round, square
	 * @property caps
	 * @type String
	 */
	/**
	 * One of: round, bevel, miter
	 * @property joints
	 * @type String
	 */
	/**
	 * @property miterLimit
	 * @type Number
	 */
	/**
	 * @method exec
	 * @param {CanvasRenderingContext2D} ctx
	 */
	p = (G.StrokeStyle = function(width, caps, joints, miterLimit) {
		this.width = width;
		this.caps = caps;
		this.joints = joints;
		this.miterLimit = miterLimit;
	}).prototype;
	p.exec = function(ctx) {
		ctx.lineWidth = (this.width == null ? "1" : this.width);
		ctx.lineCap = (this.caps == null ? "butt" : (isNaN(this.caps) ? this.caps : Graphics.STROKE_CAPS_MAP[this.caps]));
		ctx.lineJoin = (this.joints == null ? "miter" : (isNaN(this.joints) ? this.joints : Graphics.STROKE_JOINTS_MAP[this.joints]));
		ctx.miterLimit = (this.miterLimit == null ? "10" : this.miterLimit);
	};
	p.path = false;
	
	/**
	 * Graphics command object. See {{#crossLink "Graphics/setStrokeDash"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
	 * @class StrokeDash
	 * @constructor
	 * @param {Array} [segments]
	 * @param {Number} [offset=0]
	 **/
	/**
	 * @property segments
	 * @type Array
	 */
	/**
	 * @property offset
	 * @type Number
	 */
	/**
	 * @method exec
	 * @param {CanvasRenderingContext2D} ctx
	 */
	(G.StrokeDash = function(segments, offset) {
		this.segments = segments;
		this.offset = offset||0;
	}).prototype.exec = function(ctx) {
		if (ctx.setLineDash) { // feature detection.
			ctx.setLineDash(this.segments|| G.StrokeDash.EMPTY_SEGMENTS); // instead of [] to reduce churn.
			ctx.lineDashOffset = this.offset||0;
		}
	};
	/**
	 * The default value for segments (ie. no dash).
	 * @property EMPTY_SEGMENTS
	 * @static
	 * @final
	 * @readonly
	 * @protected
	 * @type {Array}
	 **/
	G.StrokeDash.EMPTY_SEGMENTS = [];

	/**
	 * Graphics command object. See {{#crossLink "Graphics/drawRoundRectComplex"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
	 * @class RoundRect
	 * @constructor
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} w
	 * @param {Number} h
	 * @param {Number} radiusTL
	 * @param {Number} radiusTR
	 * @param {Number} radiusBR
	 * @param {Number} radiusBL
	 **/
	/**
	 * @property x
	 * @type Number
	 */
	/**
	 * @property y
	 * @type Number
	 */
	/**
	 * @property w
	 * @type Number
	 */
	/**
	 * @property h
	 * @type Number
	 */
	/**
	 * @property radiusTL
	 * @type Number
	 */
	/**
	 * @property radiusTR
	 * @type Number
	 */
	/**
	 * @property radiusBR
	 * @type Number
	 */
	/**
	 * @property radiusBL
	 * @type Number
	 */
	/**
	 * @method exec
	 * @param {CanvasRenderingContext2D} ctx
	 */
	(G.RoundRect = function(x, y, w, h, radiusTL, radiusTR, radiusBR, radiusBL) {
		this.x = x; this.y = y;
		this.w = w; this.h = h;
		this.radiusTL = radiusTL; this.radiusTR = radiusTR;
		this.radiusBR = radiusBR; this.radiusBL = radiusBL;
	}).prototype.exec = function(ctx) {
		var max = (w<h?w:h)/2;
		var mTL=0, mTR=0, mBR=0, mBL=0;
		var x = this.x, y = this.y, w = this.w, h = this.h;
		var rTL = this.radiusTL, rTR = this.radiusTR, rBR = this.radiusBR, rBL = this.radiusBL;

		if (rTL < 0) { rTL *= (mTL=-1); }
		if (rTL > max) { rTL = max; }
		if (rTR < 0) { rTR *= (mTR=-1); }
		if (rTR > max) { rTR = max; }
		if (rBR < 0) { rBR *= (mBR=-1); }
		if (rBR > max) { rBR = max; }
		if (rBL < 0) { rBL *= (mBL=-1); }
		if (rBL > max) { rBL = max; }

		ctx.moveTo(x+w-rTR, y);
		ctx.arcTo(x+w+rTR*mTR, y-rTR*mTR, x+w, y+rTR, rTR);
		ctx.lineTo(x+w, y+h-rBR);
		ctx.arcTo(x+w+rBR*mBR, y+h+rBR*mBR, x+w-rBR, y+h, rBR);
		ctx.lineTo(x+rBL, y+h);
		ctx.arcTo(x-rBL*mBL, y+h+rBL*mBL, x, y+h-rBL, rBL);
		ctx.lineTo(x, y+rTL);
		ctx.arcTo(x-rTL*mTL, y-rTL*mTL, x+rTL, y, rTL);
		ctx.closePath();
	};

	/**
	 * Graphics command object. See {{#crossLink "Graphics/drawCircle"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
	 * @class Circle
	 * @constructor
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} radius
	 **/
	/**
	 * @property x
	 * @type Number
	 */
	/**
	 * @property y
	 * @type Number
	 */
	/**
	 * @property radius
	 * @type Number
	 */
	/**
	 * @method exec
	 * @param {CanvasRenderingContext2D} ctx
	 */
	(G.Circle = function(x, y, radius) {
		this.x = x; this.y = y;
		this.radius = radius;
	}).prototype.exec = function(ctx) { ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2); };

	/**
	 * Graphics command object. See {{#crossLink "Graphics/drawEllipse"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
	 * @class Ellipse
	 * @constructor
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} w
	 * @param {Number} h
	 **/
	/**
	 * @property x
	 * @type Number
	 */
	/**
	 * @property y
	 * @type Number
	 */
	/**
	 * @property w
	 * @type Number
	 */
	/**
	 * @property h
	 * @type Number
	 */
	/**
	 * @method exec
	 * @param {CanvasRenderingContext2D} ctx
	 */
	(G.Ellipse = function(x, y, w, h) {
		this.x = x; this.y = y;
		this.w = w; this.h = h;
	}).prototype.exec = function(ctx) {
		var x = this.x, y = this.y;
		var w = this.w, h = this.h;

		var k = 0.5522848;
		var ox = (w / 2) * k;
		var oy = (h / 2) * k;
		var xe = x + w;
		var ye = y + h;
		var xm = x + w / 2;
		var ym = y + h / 2;

		ctx.moveTo(x, ym);
		ctx.bezierCurveTo(x, ym-oy, xm-ox, y, xm, y);
		ctx.bezierCurveTo(xm+ox, y, xe, ym-oy, xe, ym);
		ctx.bezierCurveTo(xe, ym+oy, xm+ox, ye, xm, ye);
		ctx.bezierCurveTo(xm-ox, ye, x, ym+oy, x, ym);
	};

	/**
	 * Graphics command object. See {{#crossLink "Graphics/drawPolyStar"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
	 * @class PolyStar
	 * @constructor
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} radius
	 * @param {Number} sides
	 * @param {Number} pointSize
	 * @param {Number} angle
	 **/
	/**
	 * @property x
	 * @type Number
	 */
	/**
	 * @property y
	 * @type Number
	 */
	/**
	 * @property radius
	 * @type Number
	 */
	/**
	 * @property sides
	 * @type Number
	 */
	/**
	 * @property pointSize
	 * @type Number
	 */
	/**
	 * @property angle
	 * @type Number
	 */
	/**
	 * @method exec
	 * @param {CanvasRenderingContext2D} ctx
	 */
	(G.PolyStar = function(x, y, radius, sides, pointSize, angle) {
		this.x = x; this.y = y;
		this.radius = radius;
		this.sides = sides;
		this.pointSize = pointSize;
		this.angle = angle;
	}).prototype.exec = function(ctx) {
		var x = this.x, y = this.y;
		var radius = this.radius;
		var angle = (this.angle||0)/180*Math.PI;
		var sides = this.sides;
		var ps = 1-(this.pointSize||0);
		var a = Math.PI/sides;

		ctx.moveTo(x+Math.cos(angle)*radius, y+Math.sin(angle)*radius);
		for (var i=0; i<sides; i++) {
			angle += a;
			if (ps != 1) {
				ctx.lineTo(x+Math.cos(angle)*radius*ps, y+Math.sin(angle)*radius*ps);
			}
			angle += a;
			ctx.lineTo(x+Math.cos(angle)*radius, y+Math.sin(angle)*radius);
		}
		ctx.closePath();
	};

	// docced above.
	Graphics.beginCmd = new G.BeginPath(); // so we don't have to instantiate multiple instances.


	createjs.Graphics = Graphics;
}());
