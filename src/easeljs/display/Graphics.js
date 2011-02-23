/*
* Graphics by Grant Skinner. Dec 5, 2010
* Visit http://easeljs.com/ for documentation, updates and examples.
*
*
* Copyright (c) 2010 Grant Skinner
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
* The Easel Javascript library provides a retained graphics mode for canvas 
* including a full, hierarchical display list, a core interaction model, and 
* helper classes to make working with Canvas much easier.
* @module EaselJS
**/

(function(window) {

// used to create the instruction lists used in Graphics:


/**
* Inner class used by the Graphics class. Used to create the instruction lists used in Graphics:
* @class Command
* @for Graphics
* @constructor
**/
function Command(f, params) {
	this.f = f;
	this.params = params;
}

/**
* @method exec
* @param {Object} scope
**/
Command.prototype.exec = function(scope) { this.f.apply(scope, this.params); }

/**
* The Graphics class exposes an easy to use API for generating vector drawing instructions and drawing them to a specified context.
* Note that you can use Graphics without any dependency on the Easel framework by calling draw() directly,
* or it can be used with the Shape object to draw vector graphics within the context of an Easel display list.<br/><br/>
* Note that all drawing methods in Graphics return the Graphics instance, so they can be chained together. For example, the following 
* line of code would generate the instructions to draw a rectangle with a red stroke and blue fill, then render it to the specified 
* context2D:<br/>
* myGraphics.beginStroke("#F00").beginFill("#00F").drawRect(20, 20, 100, 50).draw(myContext2D);
* @class Graphics
* @constructor
* @param {String} instructions Optional. This is a string that will be eval'ed in the scope of this Graphics object. 
* This provides a mechanism for generating a vector shape from a serialized string. Ex. 
* "beginFill('#F00');drawRect(0, 0, 10, 10);"
* @for Graphics
**/
Graphics = function(instructions) {
	this.initialize(instructions);
}
var p = Graphics.prototype;

// static public methods:
	
	/**
	* Returns a CSS compatible color string based on the specified RGB numeric color values in the format 
	* "rgba(255,255,255,1.0)", or if alpha is null then in the format "rgb(255,255,255)". For example,
	* Graphics.getRGB(50, 100, 150, 0.5) will return "rgba(50,100,150,0.5)". It also supports passing a single hex color 
	* value as the first param, and an optional alpha value as the second param. For example, Graphics.getRGB(0xFF00FF, 0.2)
	* will return "rgba(255,0,255,0.2)".
	* @method getRGB
	* @static
	* @param {Number} r The red component for the color, between 0 and 0xFF (255).
	* @param {Number} g The green component for the color, between 0 and 0xFF (255).
	* @param {Number} b The blue component for the color, between 0 and 0xFF (255).
	* @param {Number} alpha Optional. The alpha component for the color where 0 is fully transparent and 1 is fully opaque.
	* @return A CSS compatible color string based on the specified RGB numeric color values in the format 
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
	}
	
	/**
	* Returns a CSS compatible color string based on the specified HSL numeric color values in the format "hsla(360,100,100,1.0)", 
	* or if alpha is null then in the format "hsl(360,100,100)". For example, Graphics.getHSL(150, 100, 70) will return 
	* "hsl(150,100,70)".
	* @method getHSL
	* @static
	* @param {Number} hue The hue component for the color, between 0 and 360.
	* @param {Number} saturation The saturation component for the color, between 0 and 100.
	* @param {Number} lightness The lightness component for the color, between 0 and 100.
	* @param {Number} alpha Optional. The alpha component for the color where 0 is fully transparent and 1 is fully opaque.
	* @return a CSS compatible color string based on the specified HSL numeric color values in the format 
	* "hsla(360,100,100,1.0)", or if alpha is null then in the format "hsl(360,100,100)". For example, 
	* Graphics.getHSL(150, 100, 70) will return "hsl(150,100,70)".
	**/
	Graphics.getHSL = function(hue, saturation, lightness, alpha) {
		if (alpha == null) {
			return "hsl("+(hue%360)+","+saturation+"%,"+lightness+"%)";
		} else {
			return "hsla("+(hue%360)+","+saturation+"%,"+lightness+"%,"+alpha+")";
		}
	}
	
	/**
	* Maps numeric values for the caps parameter of setStrokeStyle to corresponding string values.
	* This is primarily for use with the tiny API. The mappings are as follows: 0 to "butt",
	* 1 to "round", and 2 to "square".
	* For example, myGraphics.ss(16, 2) would set the line caps to "square".
	* @property STROKE_CAPS_MAP
	* @static
	* @final
	* @type Array[String]
	**/
	Graphics.STROKE_CAPS_MAP = ["butt", "round", "square"];
	
	/**
	* Maps numeric values for the joints parameter of setStrokeStyle to corresponding string values.
	* This is primarily for use with the tiny API. The mappings are as follows: 0 to "miter",
	* 1 to "round", and 2 to "bevel".
	* For example, myGraphics.ss(16, 0, 2) would set the line joints to "bevel".
	* @property STROKE_JOINTS_MAP
	* @static
	* @final
	* @type Array[String]
	**/
	Graphics.STROKE_JOINTS_MAP = ["miter", "round", "bevel"];
	
	/**
	* @property _ctx
	* @static
	* @protected
	* @type CanvasRenderingContext2D
	**/
	Graphics._ctx = document.createElement("canvas").getContext("2d");
	
	/**
	* @property beginCmd
	* @static
	* @protected
	* @type Command
	**/
	Graphics.beginCmd = new Command(Graphics._ctx.beginPath, []);
	
	/**
	* @property fillCmd
	* @static
	* @protected
	* @type Command
	**/
	Graphics.fillCmd = new Command(Graphics._ctx.fill, []);
	
	/**
	* @property strokeCmd
	* @static
	* @protected
	* @type Command
	**/
	Graphics.strokeCmd = new Command(Graphics._ctx.stroke, []);

	/**
	* @property _strokeInstructions
	* @protected
	* @type Array[Command]
	**/
	p._strokeInstructions = null;

	/**
	* @property _strokeStyleInstructions
	* @protected
	* @type Array[Command]
	**/
	p._strokeStyleInstructions = null;
	
	/**
	* @property _fillInstructions
	* @protected
	* @type Array[Command]
	**/
	p._fillInstructions = null;
	
	/**
	* @property _instructions
	* @protected
	* @type Array[Command]
	**/
	p._instructions = null;
	
	/**
	* @property _oldInstructions
	* @protected
	* @type Array[Command]
	**/
	p._oldInstructions = null;
	
	/**
	* @property _activeInstructions
	* @protected
	* @type Array[Command]
	**/
	p._activeInstructions = null;
	
	/**
	* @property _active
	* @protected
	* @type Boolean
	* @default false
	**/
	p._active = false;
	
	/**
	* @property _dirty
	* @protected
	* @type Boolean
	* @default false
	**/
	p._dirty = false;
	
	/** 
	* Initialization method.
	* @method initialize
	* @protected
	* @param {String} instructions
	**/
	p.initialize = function(instructions) {
		this.clear();
		this._ctx = Graphics._ctx;
		with (this) { eval(instructions); }
	}
	
	/**
	* Draws the display object into the specified context ignoring it's visible, alpha, shadow, and transform.
	* Returns true if the draw was handled (useful for overriding functionality).
	* NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	* @method draw
	* @param {CanvasRenderingContext2D} ctx The canvas 2D context object to draw into.
	**/
	p.draw = function(ctx) {
		if (this._dirty) {
			this._updateInstructions();
		}
		var instr = this._instructions;
		for (var i=0, l=instr.length; i<l; i++) {
			instr[i].exec(ctx);
		}
	}
	
// public methods that map directly to context 2D calls:
	/**
	* Moves the drawing point to the specified position.
	* @method moveTo
	* @param {Number} x The x coordinate the drawing point should move to.
	* @param {Number} y The y coordinate the drawing point should move to.
	* @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	**/
	p.moveTo = function(x, y) {
		this._activeInstructions.push(new Command(this._ctx.moveTo, [x, y]));
		return this;
	}
	
	/**
	* Draws a line from the current drawing point to the specified position, which become the new current drawing point. 
	* For detailed information, read the 
	* <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#complex-shapes-(paths)">
	* whatwg spec</a>.
	* @method lineTo
	* @param {Number} x The x coordinate the drawing point should draw to.
	* @param {Number} y The y coordinate the drawing point should draw to.
	* @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	**/
	p.lineTo = function(x, y) {
		this._dirty = this._active = true;
		this._activeInstructions.push(new Command(this._ctx.lineTo, [x, y]));
		return this;
	}
	
	/**
	* Draws an arc with the specified control points and radius.  For detailed information, read the 
	* <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#dom-context-2d-arcto">
	* whatwg spec</a>.
	* @method arcTo
	* @param {Number} x1
	* @param {Number} y1
	* @param {Number} x2
	* @param {Number} y2
	* @param {Number} radius
	* @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	**/
	p.arcTo = function(x1, y1, x2, y2, radius) {
		this._dirty = this._active = true;
		this._activeInstructions.push(new Command(this._ctx.arcTo, [x1, y1, x2, y2, radius]));
		return this;
	}
	
	/**
	* Draws an arc defined by the radius, startAngle and endAngle arguments, centered at the position (x, y). For example 
	* arc(100, 100, 20, 0, Math.PI*2) would draw a full circle with a radius of 20 centered at (100, 100). For detailed 
	* information, read the 
	* <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#dom-context-2d-arc">whatwg spec</a>.
	* @method arc
	* @param {Number} x
	* @param {Number} y
	* @param {Number} radius
	* @param {Number} startAngle Measured in radians.
	* @param {Number} endAngle Measured in radians.
	* @param {Boolean} anticlockwise
	* @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	**/
	p.arc = function(x, y, radius, startAngle, endAngle, anticlockwise) {
		this._dirty = this._active = true;
		if (anticlockwise == null) { anticlockwise = false; }
		this._activeInstructions.push(new Command(this._ctx.arc, [x, y, radius, startAngle, endAngle, anticlockwise]));
		return this;
	}
	
	/**
	* Draws a quadratic curve from the current drawing point to (x, y) using the control point (cpx, cpy).  For detailed information, 
	* read the <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#dom-context-2d-quadraticcurveto">
	* whatwg spec</a>.
	* @method quadraticCurveTo
	* @param {Number} cpx
	* @param {Number} cpy
	* @param {Number} x
	* @param {Number} y
	* @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	**/
	p.quadraticCurveTo = function(cpx, cpy, x, y) {
		this._dirty = this._active = true;
		this._activeInstructions.push(new Command(this._ctx.quadraticCurveTo, [cpx, cpy, x, y]));
		return this;
	}
	
	/**
	* Draws a bezier curve from the current drawing point to (x, y) using the control points (cp1x, cp1y) and (cp2x, cp2y).  
	* For detailed information, read the 
	* <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#dom-context-2d-beziercurveto">
	* whatwg spec</a>.
	* method @bezierCurveTo
	* @param {Number} cp1x
	* @param {Number} cp1y
	* @param {Number} cp2x
	* @param {Number} cp2y
	* @param {Number} x
	* @param {Number} y
	* @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	**/
	p.bezierCurveTo = function(cp1x, cp1y, cp2x, cp2y, x, y) {
		this._dirty = this._active = true;
		this._activeInstructions.push(new Command(this._ctx.bezierCurveTo, [cp1x, cp1y, cp2x, cp2y, x, y]));
		return this;
	}
	
	/**
	* Draws a rectangle at (x, y) with the specified width and height using the current fill and/or stroke.
	*  For detailed information, read the 
	* <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#dom-context-2d-rect">
	* whatwg spec</a>.
	* @method rect
	* @param {Number} x
	* @param {Number} y
	* @param {Number} w Width of the rectangle
	* @param {Number} h Height of the rectangle
	* @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	**/
	p.rect = function(x, y, w, h) {
		this._dirty = this._active = true;
		this._activeInstructions.push(new Command(this._ctx.rect, [x, y, w-1, h]));
		return this;
	}
	
	/**
	* Closes the current path, effectively drawing a line from the current drawing point to the first drawing point specified
	* since the fill or stroke was last set.
	* @method closePath
	* @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	**/
	p.closePath = function() {
		if (this._active) {
			this._dirty = true;
			this._activeInstructions.push(new Command(this._ctx.closePath, []));
		}
		return this;
	}
	
	
// public methods that roughly map to Flash graphics APIs:
	/**
	* Clears all drawing instructions, effectively reseting this Graphics instance.
	* @method clear
	* @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	**/
	p.clear = function() {
		this._instructions = [];
		this._oldInstructions = [];
		this._activeInstructions = [];
		this._strokeStyleInstructions = this._strokeInstructions = this._fillInstructions = null;
		this._active = this._dirty = false;
		return this;
	}
	
	/**
	* Begins a fill with the specified color. This ends the current subpath.
	* @method beginFill
	* @param {String} color A CSS compatible color value (ex. "#FF0000" or "rgba(255,0,0,0.5)"). Setting to null will 
	* result in no fill.
	* @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	**/
	p.beginFill = function(color) {
		if (this._active) { this._newPath(); }
		this._fillInstructions = color ? [new Command(this._setProp, ["fillStyle", color])] : null;
		return this;
	}
	
	/**
	* Begins a linear gradient fill defined by the line (x0, y0) to (x1, y1). This ends the current subpath. For example, the
	* following code defines a black to white vertical gradient ranging from 20px to 120px, and draws a square to display it:<br/>
	* myGraphics.beginLinearGradientFill(["#000","#FFF"], [0, 1], 0, 20, 0, 120).drawRect(20, 20, 120, 120);
	* @method beginLinearGradientFill
	* @param {Array[String]} colors An array of CSS compatible color values. For example, ["#F00","#00F"] would define a gradient 
	* drawing from red to blue.
	* @param {Array[Number]} ratios An array of gradient positions which correspond to the colors. For example, [0.1, 0.9] would draw 
	* the first color to 10% then interpolating to the second color at 90%.
	* @param {Number} x0 The position of the first point defining the line that defines the gradient direction and size.
	* @param {Number} y0 The position of the first point defining the line that defines the gradient direction and size.
	* @param {Number} x1 The position of the second point defining the line that defines the gradient direction and size.
	* @param {Number} y1 The position of the second point defining the line that defines the gradient direction and size.
	* @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	**/
	p.beginLinearGradientFill = function(colors, ratios, x0, y0, x1, y1) {
		if (this._active) { this._newPath(); }
		var o = this._ctx.createLinearGradient(x0, y0, x1, y1);
		for (var i=0, l=colors.length; i<l; i++) {
			o.addColorStop(ratios[i], colors[i]);
		}
		this._fillInstructions = [new Command(this._setProp, ["fillStyle", o])];
		return this;
	}
	
	/**
	* Begins a radial gradient fill. This ends the current subpath. For example, the following code defines a red to blue radial 
	* gradient centered at (100, 100), with a radius of 50, and draws a circle to display it:<br/>
	* myGraphics.beginRadialGradientFill(["#F00","#00F"], [0, 1], 100, 100, 0, 100, 100, 50).drawCircle(100, 100, 50);
	* @method beginRadialGradientFill
	* @param {Array[String]} colors An array of CSS compatible color values. For example, ["#F00","#00F"] would define a gradient 
	* drawing from red to blue.
	* @param {Array[Number]} ratios An array of gradient positions which correspond to the colors. For example, [0.1, 0.9] would 
	* draw the first color to 10% then interpolating to the second color at 90%.
	* @param {Number} x0 Center position of the inner circle that defines the gradient.
	* @param {Number} y0 Center position of the inner circle that defines the gradient.
	* @param {Number} r0 Radius of the inner circle that defines the gradient.
	* @param {Number} x1 Center position of the outer circle that defines the gradient.
	* @param {Number} y1 Center position of the outer circle that defines the gradient.
	* @param {Number} r1 Radius of the outer circle that defines the gradient.
	* @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	**/
	p.beginRadialGradientFill = function(colors, ratios, x0, y0, r0, x1, y1, r1) {
		if (this._active) { this._newPath(); }
		var o = this._ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
		for (var i=0, l=colors.length; i<l; i++) {
			o.addColorStop(ratios[i], colors[i]);
		}
		this._fillInstructions = [new Command(this._setProp, ["fillStyle", o])];
		return this;
	}
	
	/**
	* Begins a pattern fill using the specified image. This ends the current subpath.
	* @method beginBitmapFill
	* @param image The Image, Canvas, or Video object to use as the pattern.
	* @param {String} repetition Optional. Indicates whether to repeat the image in the fill area. One of "repeat", "repeat-x",
	* "repeat-y", or "no-repeat". Defaults to "repeat".
	* @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	**/
	p.beginBitmapFill = function(image, repetition) {
		if (this._active) { this._newPath(); }
		repetition = repetition || "";
		var o = this._ctx.createPattern(image, repetition);
		this._fillInstructions = [new Command(this._setProp, ["fillStyle", o])];
		return this;
	}
	
	/**
	* Ends the current subpath, and begins a new one with no fill. Functionally identical to beginFill(null).
	* @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	**/
	p.endFill = function() {
		this.beginFill(null);
		return this;
	}
	
	/**
	* Sets the stroke style for the current subpath. Like all drawing methods, this can be chained, so you can define the stroke style and color in a single line of code like so:
	* myGraphics.setStrokeStyle(8,"round").beginStroke("#F00");
	* @param thickness The width of the stroke.
	* @param caps Optional. Indicates the type of caps to use at the end of lines. One of butt, round, or square. Defaults to "butt". Also accepts the values 0 (butt), 1 (round), and 2 (square) for use with the tiny API.
	* @param joints Optional. Specifies the type of joints that should be used where two lines meet. One of bevel, round, or miter. Defaults to "miter". Also accepts the values 0 (miter), 1 (round), and 2 (bevel) for use with the tiny API.
	* @param miter Optional. If joints is set to "miter", then you can specify a miter limit ratio which controls at what point a mitered joint will be clipped.
	* @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	**/
	p.setStrokeStyle = function(thickness, caps, joints, miterLimit) {
		if (this._active) { this._newPath(); }
		this._strokeStyleInstructions = [
			new Command(this._setProp, ["lineWidth", (thickness == null ? "1" : thickness)]),
			new Command(this._setProp, ["lineCap", (caps == null ? "butt" : (isNaN(caps) ? caps : Graphics.STROKE_CAPS_MAP[caps]))]),
			new Command(this._setProp, ["lineJoin", (joints == null ? "miter" : (isNaN(joints) ? joints : Graphics.STROKE_JOINTS_MAP[joints]))]),
			new Command(this._setProp, ["miterLimit", (miterLimit == null ? "10" : miterLimit)])
			];
		return this;
	}
	
	/**
	* Begins a stroke with the specified color. This ends the current subpath.
	* @param color A CSS compatible color value (ex. "#FF0000" or "rgba(255,0,0,0.5)"). Setting to null will result in no stroke.
	* @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	**/
	p.beginStroke = function(color) {
		if (this._active) { this._newPath(); }
		this._strokeInstructions = color ? [new Command(this._setProp, ["strokeStyle", color])] : null;
		return this;
	}
	
	/**
	* Begins a linear gradient stroke defined by the line (x0, y0) to (x1, y1). This ends the current subpath. For example, the following code defines a black to white vertical gradient ranging from 20px to 120px, and draws a square to display it:<br/>
	* myGraphics.setStrokeStyle(10).beginLinearGradientStroke(["#000","#FFF"], [0, 1], 0, 20, 0, 120).drawRect(20, 20, 120, 120);
	* @param colors An array of CSS compatible color values. For example, ["#F00","#00F"] would define a gradient drawing from red to blue.
	* @param ratios An array of gradient positions which correspond to the colors. For example, [0.1, 0.9] would draw the first color to 10% then interpolating to the second color at 90%.
	* @param x0 The position of the first point defining the line that defines the gradient direction and size.
	* @param y0 The position of the first point defining the line that defines the gradient direction and size.
	* @param x1 The position of the second point defining the line that defines the gradient direction and size.
	* @param y1 The position of the second point defining the line that defines the gradient direction and size.
	* @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	**/
	p.beginLinearGradientStroke = function(colors, ratios, x0, y0, x1, y1) {
		if (this._active) { this._newPath(); }
		var o = this._ctx.createLinearGradient(x0, y0, x1, y1);
		for (var i=0, l=colors.length; i<l; i++) {
			o.addColorStop(ratios[i], colors[i]);
		}
		this._strokeInstructions = [new Command(this._setProp, ["strokeStyle", o])];
		return this;
	}
	
	
	/**
	* Begins a radial gradient stroke. This ends the current subpath. For example, the following code defines a red to blue radial gradient centered at (100, 100), with a radius of 50, and draws a rectangle to display it:<br/>
	* myGraphics.setStrokeStyle(10).beginRadialGradientStroke(["#F00","#00F"], [0, 1], 100, 100, 0, 100, 100, 50).drawRect(50, 90, 150, 110);
	* @param colors An array of CSS compatible color values. For example, ["#F00","#00F"] would define a gradient drawing from red to blue.
	* @param ratios An array of gradient positions which correspond to the colors. For example, [0.1, 0.9] would draw the first color to 10% then interpolating to the second color at 90%, then draw the second color to 100%.
	* @param x0 Center position of the inner circle that defines the gradient.
	* @param y0 Center position of the inner circle that defines the gradient.
	* @param r0 Radius of the inner circle that defines the gradient.
	* @param x1 Center position of the outer circle that defines the gradient.
	* @param y1 Center position of the outer circle that defines the gradient.
	* @param r1 Radius of the outer circle that defines the gradient.
	* @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)	
	**/
	p.beginRadialGradientStroke = function(colors, ratios, x0, y0, r0, x1, y1, r1) {
		if (this._active) { this._newPath(); }
		var o = this._ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
		for (var i=0, l=colors.length; i<l; i++) {
			o.addColorStop(ratios[i], colors[i]);
		}
		this._strokeInstructions = [new Command(this._setProp, ["strokeStyle", o])];
		return this;
	}
	
	/**
	* Begins a pattern fill using the specified image. This ends the current subpath.
	* @param {Image | HTMLCanvasElement | HTMLVideoElement} image The Image, Canvas, or Video object to use as the pattern.
	* @param {String} repetition Optional. Indicates whether to repeat the image in the fill area. One of "repeat", "repeat-x",
	* "repeat-y", or "no-repeat". Defaults to "repeat".
	* @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)	
	**/
	p.beginBitmapStroke = function(image, repetition) {
		if (this._active) { this._newPath(); }
		repetition = repetition || "";
		var o = this._ctx.createPattern(image, repetition);
		this._strokeInstructions = [new Command(this._setProp, ["strokeStyle", o])];
		return this;
	}
	
	
	/**
	* Ends the current subpath, and begins a new one with no stroke. Functionally identical to beginStroke(null).
	* @method endStroke
	* @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	**/
	p.endStroke = function() {
		this.beginStroke(null);
		return this;
	}
	
	/**
	* Maps the familiar ActionScript curveTo() method to the functionally similar quatraticCurveTo() method.
	* @property curveTo
	* @type Function
	**/
	p.curveTo = p.quadraticCurveTo;
	
	/**
	* Maps the familiar ActionScript drawRect() method to the functionally similar rect() method.
	* @property drawRect
	* @type Function
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
	**/
	p.drawRoundRect = function(x, y, w, h, radius) {
		this.drawRoundRectComplex(x, y, w, h, radius, radius, radius, radius);
		return this;
	}
	
	/**
	* Draws a rounded rectangle with different corner radiuses.
	* @method drawRoundRectComplex
	* @param {Number} x
	* @param {Number} y
	* @param {Number} w
	* @param {Number} h
	* @param {Number} radiusTL Top left corner radius.
	* @param {Number} radiusTR Top right corner radius.
	* @param {Number} radiusBR Bottom right corner radius.
	* @param {Number} radiusBL Bottom left corner radius.
	* @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	**/
	p.drawRoundRectComplex = function(x, y, w, h, radiusTL, radiusTR, radiusBR, radiusBL) {
		this._dirty = this._active = true;
		this._activeInstructions.push(
			new Command(this._ctx.moveTo, [x+radiusTL, y]),
			new Command(this._ctx.lineTo, [x+w-radiusTR, y]),
			new Command(this._ctx.arc, [x+w-radiusTR, y+radiusTR, radiusTR, (-Math.PI/2), 0, false]),
			new Command(this._ctx.lineTo, [x+w, y+h-radiusBR]),
			new Command(this._ctx.arc, [x+w-radiusBR, y+h-radiusBR, radiusBR, 0, Math.PI/2, false]),
			new Command(this._ctx.lineTo, [x+radiusBL, y+h]),
			new Command(this._ctx.arc, [x+radiusBL, y+h-radiusBL, radiusBL, Math.PI/2, Math.PI, false]),
			new Command(this._ctx.lineTo, [x, y+radiusTL]),
			new Command(this._ctx.arc, [x+radiusTL, y+radiusTL, radiusTL, Math.PI, Math.PI*3/2, false])
		);
		return this;
	} 
	
	/**
	* Draws a circle with the specified radius at (x, y).
	* @method drawCircle
	* @param {Number} x x coordinate center point of circle.
	* @param {Number} y y coordinate center point of circle.
	* @param {Number} radius Radius of circle.
	* @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	**/
	p.drawCircle = function(x, y, radius) {
		this.arc(x, y, radius, 0, Math.PI*2);
		return this;
	}
	
	/**
	* Draws an ellipse (oval).
	* @method drawEllipse
	* @param {Number} x
	* @param {Number} y
	* @param {Number} w
	* @param {Number} h
	* @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	**/
	p.drawEllipse = function(x, y, w, h) {
		this._dirty = this._active = true;
		var k = 0.5522848;
		var ox = (w / 2) * k;
		var oy = (h / 2) * k;
		var xe = x + w;
		var ye = y + h;
		var xm = x + w / 2;
		var ym = y + h / 2;
			
		this._activeInstructions.push(
			new Command(this._ctx.moveTo, [x, ym]),
			new Command(this._ctx.bezierCurveTo, [x, ym-oy, xm-ox, y, xm, y]),
			new Command(this._ctx.bezierCurveTo, [xm+ox, y, xe, ym-oy, xe, ym]),
			new Command(this._ctx.bezierCurveTo, [xe, ym+oy, xm+ox, ye, xm, ye]),
			new Command(this._ctx.bezierCurveTo, [xm-ox, ye, x, ym+oy, x, ym])
		);
		return this;
	}
	
	/**
	* Draws a star if pointSize is greater than 0 or a regular polygon if pointSize is 0 with the specified number of points.
	* For example, the following code will draw a familiar 5 pointed star shape centered at 100, 100 and with a radius of 50:
	* myGraphics.beginFill("#FF0").drawPolyStar(100, 100, 50, 5, 0.6, -90); // -90 makes the first point vertical
	* @method drawPolyStar
	* @param {Number} x Position of the center of the shape.
	* @param {Number} y Position of the center of the shape.
	* @param {Number} radius The outer radius of the shape.
	* @param {Number} sides The number of points on the star or sides on the polygon.
	* @param {Number} pointSize The depth or "pointy-ness" of the star points. A pointSize of 0 will draw a regular polygon (no points), 
	* a pointSize of 1 will draw nothing because the points are infinitely pointy.
	* @param {Number} angle The angle of the first point / corner. For example a value of 0 will draw the first point directly to the 
	* right of the center.
	* @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	**/
	p.drawPolyStar = function(x, y, radius, sides, pointSize, angle) {
		this._dirty = this._active = true;
		if (pointSize == null) { pointSize = 0; }
		pointSize = 1-pointSize;
		if (angle == null) { angle = 0; }
		else { angle /= 180/Math.PI; }
		var a = Math.PI/sides;
		
		this._activeInstructions.push(new Command(this._ctx.moveTo, [x+Math.cos(angle)*radius, y+Math.sin(angle)*radius]));
		for (var i=0; i<sides; i++) {
			angle += a;
			if (pointSize != 1) {
				this._activeInstructions.push(new Command(this._ctx.lineTo, [x+Math.cos(angle)*radius*pointSize, y+Math.sin(angle)*radius*pointSize]));
			}
			angle += a;
			this._activeInstructions.push(new Command(this._ctx.lineTo, [x+Math.cos(angle)*radius, y+Math.sin(angle)*radius]));
		}
		return this;
	}
	
	/**
	* Returns a clone of this Graphics instance.
	* @method clone
	 @return {Graphics} A clone of the current Graphics instance.
	**/
	p.clone = function() {
		var o = new Graphics();
		o._instructions = this._instructions.slice();
		o._activeInstructions = this._activeInstructions.slice();
		o._oldInstructions = this._oldInstructions.slice();
		if (this._fillInstructions) { o._fillInstructions = this._fillInstructions.slice(); }
		if (this._strokeInstructions) { o._strokeInstructions = this._strokeInstructions.slice(); }
		if (this._strokeStyleInstructions) { o._strokeStyleInstructions = this._strokeStyleInstructions.slice(); }
		o._active = this._active;
		o._dirty = this._dirty;
		return o;
	}
		
	/**
	* Returns a string representation of this object.
	* @method toString
	* @return {String} a string representation of the instance.
	**/
	p.toString = function() {
		return "[Graphics]";
	}
	
	
// tiny API:
	/** Shortcut to moveTo.
	* @property mt
	* @protected
	* type Function
	**/
	p.mt = p.moveTo;
	
	/** Shortcut to lineTo.
	* @property lt
	* @protected
	* type Function
	**/
	p.lt = p.lineTo;
	
	/** Shortcut to arcTo.
	* @property at
	* @protected
	* type Function
	**/
	p.at = p.arcTo;
	
	/** Shortcut to bezierCurveTo.
	* @property bt
	* @protected
	* type Function
	**/
	p.bt = p.bezierCurveTo;
	
	/** Shortcut to quadraticCurveTo / curveTo.
	* @property qt
	* @protected
	* type Function
	**/
	p.qt = p.quadraticCurveTo;
	
	/** Shortcut to arc.
	* @property a
	* @protected
	* type Function
	**/
	p.a = p.arc;
	
	/** Shortcut to rect.
	* @property r
	* @protected
	* type Function
	**/
	p.r = p.rect;
	
	/** Shortcut to closePath.
	* @property cp
	* @protected
	* type Function
	**/
	p.cp = p.closePath;
	
	/** Shortcut to clear.
	* @property c
	* @protected
	* type Function
	**/
	p.c = p.clear;
	
	/** Shortcut to beginFill.
	* @property f
	* @protected
	* type Function
	**/
	p.f = p.beginFill;
	
	/** Shortcut to beginLinearGradientFill.
	* @property lf
	* @protected
	* type Function
	**/
	p.lf = p.beginLinearGradientFill;
	
	/** Shortcut to beginRadialGradientFill.
	* @property rf
	* @protected
	* type Function
	**/
	p.rf = p.beginRadialGradientFill;
	
	/** Shortcut to beginBitmapFill.
	* @property bf
	* @protected
	* type Function
	**/
	p.bf = p.beginBitmapFill;
	
	/** Shortcut to endFill.
	* @property ef
	* @protected
	* type Function
	**/
	p.ef = p.endFill;
	
	/** Shortcut to setStrokeStyle.
	* @property ss
	* @protected
	* type Function
	**/
	p.ss = p.setStrokeStyle;
	
	/** Shortcut to beginStroke.
	* @property s
	* @protected
	* type Function
	**/
	p.s = p.beginStroke;
	
	/** Shortcut to beginLinearGradientStroke.
	* @property ls
	* @protected
	* type Function
	**/
	p.ls = p.beginLinearGradientStroke;
	
	/** Shortcut to beginRadialGradientStroke.
	* @property rs
	* @protected
	* type Function
	**/
	p.rs = p.beginRadialGradientStroke;
	
	/** Shortcut to beginBitmapStroke.
	* @property bs
	* @protected
	* type Function
	**/
	p.bs = p.beginBitmapStroke;
	
	/** Shortcut to endStroke.
	* @property es
	* @protected
	* type Function
	**/
	p.es = p.endStroke;
	
	/** Shortcut to drawRect.
	* @property dr
	* @protected
	* type Function
	**/
	p.dr = p.drawRect;
	
	/** Shortcut to drawRoundRect.
	* @property rr
	* @protected
	* type Function
	**/
	p.rr = p.drawRoundRect;
	
	/** Shortcut to drawRoundRectComplex.
	* @property rc
	* @protected
	* type Function
	**/
	p.rc = p.drawRoundRectComplex;
	
	/** Shortcut to drawCircle.
	* @property dc
	* @protected
	* type Function
	**/
	p.dc = p.drawCircle;
	
	/** Shortcut to drawEllipse.
	* @property de
	* @protected
	* type Function
	**/
	p.de = p.drawEllipse;
	
	/** Shortcut to drawPolyStar.
	* @property dp
	* @protected
	* type Function
	**/
	p.dp = p.drawPolyStar;
	
	
// private methods:
	/**
	* @method _updateInstructions
	* @protected
	**/
	p._updateInstructions = function() {
		this._instructions = this._oldInstructions.slice()
		this._instructions.push(Graphics.beginCmd);
		 
		if (this._fillInstructions) { this._instructions.push.apply(this._instructions, this._fillInstructions); }
		if (this._strokeInstructions) {
			this._instructions.push.apply(this._instructions, this._strokeInstructions);
			if (this._strokeStyleInstructions) {
				this._instructions.push.apply(this._instructions, this._strokeStyleInstructions);
			}
		}
		
		this._instructions.push.apply(this._instructions, this._activeInstructions);
		
		if (this._fillInstructions) { this._instructions.push(Graphics.fillCmd); }
		if (this._strokeInstructions) { this._instructions.push(Graphics.strokeCmd); }
	}
	
	/**
	* @method _newPath
	* @protected
	**/
	p._newPath = function() {
		if (this._dirty) { this._updateInstructions(); }
		this._oldInstructions = this._instructions;
		this._activeInstructions = [];
		this._active = this._dirty = false;
	}
	
	// used to create Commands that set properties:
	/**
	* used to create Commands that set properties
	* @method _setProp
	* @param {String} name
	* @param {String} value
	* @protected
	**/
	p._setProp = function(name, value) {
		this[name] = value;
	}

window.Graphics = Graphics;
}(window));