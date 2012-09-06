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

// namespace:
this.createjs = this.createjs||{};

(function() {

// used to create the instruction lists used in Graphics:


/**
* Inner class used by the Graphics class. Used to create the instruction lists used in Graphics:
* @class Command
* @for Graphics
* @constructor
**/
function Command(f, params, path) {
	this.f = f;
	this.params = params;
	this.path = path==null ? true : path;
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
* <pre><code>var g = new Graphics();
*	g.setStrokeStyle(1);
*	g.beginStroke(Graphics.getRGB(0,0,0));
*	g.beginFill(Graphics.getRGB(255,0,0));
*	g.drawCircle(0,0,3);
*
*	var s = new Shape(g);
*		s.x = 100;
*		s.y = 100;
*
*	stage.addChild(s);
*	stage.update();</code></pre><br />
* Note that all drawing methods in Graphics return the Graphics instance, so they can be chained together. For example, the following 
* line of code would generate the instructions to draw a rectangle with a red stroke and blue fill, then render it to the specified 
* context2D:<br />
* <pre><code>myGraphics.beginStroke("#F00").beginFill("#00F").drawRect(20, 20, 100, 50).draw(myContext2D);
* @class Graphics
* @constructor
* @for Graphics
**/
var Graphics = function() {
	this.initialize();
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
	 * @return {String} A CSS compatible color string based on the specified HSL numeric color values in the format 
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
	 * Map of Base64 characters to values. Used by decodePath().
	 * @property BASE_64
	 * @static
	 * @final
	 * @type Object
	 **/
	Graphics.BASE_64 = {"A":0,"B":1,"C":2,"D":3,"E":4,"F":5,"G":6,"H":7,"I":8,"J":9,"K":10,"L":11,"M":12,"N":13,"O":14,"P":15,"Q":16,"R":17,"S":18,"T":19,"U":20,"V":21,"W":22,"X":23,"Y":24,"Z":25,"a":26,"b":27,"c":28,"d":29,"e":30,"f":31,"g":32,"h":33,"i":34,"j":35,"k":36,"l":37,"m":38,"n":39,"o":40,"p":41,"q":42,"r":43,"s":44,"t":45,"u":46,"v":47,"w":48,"x":49,"y":50,"z":51,"0":52,"1":53,"2":54,"3":55,"4":56,"5":57,"6":58,"7":59,"8":60,"9":61,"+":62,"/":63};
		
	
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
	Graphics._ctx = (createjs.createCanvas?createjs.createCanvas():document.createElement("canvas")).getContext("2d");
	
	/**
	 * @property beginCmd
	 * @static
	 * @protected
	 * @type Command
	 **/
	Graphics.beginCmd = new Command(Graphics._ctx.beginPath, [], false);
	
	/**
	 * @property fillCmd
	 * @static
	 * @protected
	 * @type Command
	 **/
	Graphics.fillCmd = new Command(Graphics._ctx.fill, [], false);
	
	/**
	 * @property strokeCmd
	 * @static
	 * @protected
	 * @type Command
	 **/
	Graphics.strokeCmd = new Command(Graphics._ctx.stroke, [], false);
	
// public properties

// private properties
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
	 **/
	p.initialize = function() {
		this.clear();
		this._ctx = Graphics._ctx;
	}
	
	/**
	 * Draws the display object into the specified context ignoring it's visible, alpha, shadow, and transform.
	 * Returns true if the draw was handled (useful for overriding functionality).
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method draw
	 * @param {CanvasRenderingContext2D} ctx The canvas 2D context object to draw into.
	 **/
	p.draw = function(ctx) {
		if (this._dirty) { this._updateInstructions(); }
		var instr = this._instructions;
		for (var i=0, l=instr.length; i<l; i++) {
			instr[i].exec(ctx);
		}
	}
	
	/**
	 * Draws only the path described for this Graphics instance, skipping any
	 * non-path instructions, including fill and stroke descriptions.
	 * Used by DisplayObject.clippingPath to draw the clipping path, for example.
	 * @method drawAsPath
	 * @param {CanvasRenderingContext2D} ctx The canvas 2D context object to draw into.
	 **/
	p.drawAsPath = function(ctx) {
		if (this._dirty) { this._updateInstructions(); }
		var instr, instrs = this._instructions;
		for (var i=0, l=instrs.length; i<l; i++) {
			// the first command is always a beginPath command.
			if ((instr = instrs[i]).path || i==0) { instr.exec(ctx); }
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
		this._activeInstructions.push(new Command(this._ctx.rect, [x, y, w, h]));
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
		this._fillInstructions = color ? [new Command(this._setProp, ["fillStyle", color], false)] : null;
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
		this._fillInstructions = [new Command(this._setProp, ["fillStyle", o], false)];
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
		this._fillInstructions = [new Command(this._setProp, ["fillStyle", o], false)];
		return this;
	}
	
	/**
	 * Begins a pattern fill using the specified image. This ends the current subpath.
	 * @method beginBitmapFill
	 * @param {HTMLImageElement | HTMLCanvasElement | HTMLVideoElement} image The Image, Canvas, or Video object to use as the pattern.
	 * @param {String} repetition Optional. Indicates whether to repeat the image in the fill area. One of "repeat", "repeat-x",
	 * "repeat-y", or "no-repeat". Defaults to "repeat".
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 **/
	p.beginBitmapFill = function(image, repetition) {
		if (this._active) { this._newPath(); }
		repetition = repetition || "";
		var o = this._ctx.createPattern(image, repetition);
		this._fillInstructions = [new Command(this._setProp, ["fillStyle", o], false)];
		return this;
	}
	
	/**
	 * Ends the current subpath, and begins a new one with no fill. Functionally identical to beginFill(null).
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 **/
	p.endFill = function() {
		return this.beginFill();
	}
	
	/**
	 * Sets the stroke style for the current subpath. Like all drawing methods, this can be chained, so you can define the stroke style and color in a single line of code like so:
	 * myGraphics.setStrokeStyle(8,"round").beginStroke("#F00");
	 * @method setStrokeStyle
	 * @param {Number} thickness The width of the stroke.
	 * @param {String | Number} caps Optional. Indicates the type of caps to use at the end of lines. One of butt, round, or square. Defaults to "butt". Also accepts the values 0 (butt), 1 (round), and 2 (square) for use with the tiny API.
	 * @param {String | Number} joints Optional. Specifies the type of joints that should be used where two lines meet. One of bevel, round, or miter. Defaults to "miter". Also accepts the values 0 (miter), 1 (round), and 2 (bevel) for use with the tiny API.
	 * @param {Number} miter Optional. If joints is set to "miter", then you can specify a miter limit ratio which controls at what point a mitered joint will be clipped.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 **/
	p.setStrokeStyle = function(thickness, caps, joints, miterLimit) {
		if (this._active) { this._newPath(); }
		this._strokeStyleInstructions = [
			new Command(this._setProp, ["lineWidth", (thickness == null ? "1" : thickness)], false),
			new Command(this._setProp, ["lineCap", (caps == null ? "butt" : (isNaN(caps) ? caps : Graphics.STROKE_CAPS_MAP[caps]))], false),
			new Command(this._setProp, ["lineJoin", (joints == null ? "miter" : (isNaN(joints) ? joints : Graphics.STROKE_JOINTS_MAP[joints]))], false),
			new Command(this._setProp, ["miterLimit", (miterLimit == null ? "10" : miterLimit)], false)
			];
		return this;
	}
	
	/**
	 * Begins a stroke with the specified color. This ends the current subpath.
	 * @method beginStroke
	 * @param {String} color A CSS compatible color value (ex. "#FF0000" or "rgba(255,0,0,0.5)"). Setting to null will result in no stroke.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 **/
	p.beginStroke = function(color) {
		if (this._active) { this._newPath(); }
		this._strokeInstructions = color ? [new Command(this._setProp, ["strokeStyle", color], false)] : null;
		return this;
	}
	
	/**
	 * Begins a linear gradient stroke defined by the line (x0, y0) to (x1, y1). This ends the current subpath. For example, the following code defines a black to white vertical gradient ranging from 20px to 120px, and draws a square to display it:<br/>
	 * myGraphics.setStrokeStyle(10).beginLinearGradientStroke(["#000","#FFF"], [0, 1], 0, 20, 0, 120).drawRect(20, 20, 120, 120);
	 * @method beginLinearGradientStroke
	 * @param {Array[String]} colors An array of CSS compatible color values. For example, ["#F00","#00F"] would define a gradient drawing from red to blue.
	 * @param {Array[Number]} ratios An array of gradient positions which correspond to the colors. For example, [0.1, 0.9] would draw the first color to 10% then interpolating to the second color at 90%.
	 * @param {Number} x0 The position of the first point defining the line that defines the gradient direction and size.
	 * @param {Number} y0 The position of the first point defining the line that defines the gradient direction and size.
	 * @param {Number} x1 The position of the second point defining the line that defines the gradient direction and size.
	 * @param {Number} y1 The position of the second point defining the line that defines the gradient direction and size.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 **/
	p.beginLinearGradientStroke = function(colors, ratios, x0, y0, x1, y1) {
		if (this._active) { this._newPath(); }
		var o = this._ctx.createLinearGradient(x0, y0, x1, y1);
		for (var i=0, l=colors.length; i<l; i++) {
			o.addColorStop(ratios[i], colors[i]);
		}
		this._strokeInstructions = [new Command(this._setProp, ["strokeStyle", o], false)];
		return this;
	}

	
	/**
	 * Begins a radial gradient stroke. This ends the current subpath. For example, the following code defines a red to blue radial gradient centered at (100, 100), with a radius of 50, and draws a rectangle to display it:<br/>
	 * myGraphics.setStrokeStyle(10).beginRadialGradientStroke(["#F00","#00F"], [0, 1], 100, 100, 0, 100, 100, 50).drawRect(50, 90, 150, 110);
	 * @method beginRadialGradientStroke
	 * @param {Array[String]} colors An array of CSS compatible color values. For example, ["#F00","#00F"] would define a gradient drawing from red to blue.
	 * @param {Array[Number]} ratios An array of gradient positions which correspond to the colors. For example, [0.1, 0.9] would draw the first color to 10% then interpolating to the second color at 90%, then draw the second color to 100%.
	 * @param {Number} x0 Center position of the inner circle that defines the gradient.
	 * @param {Number} y0 Center position of the inner circle that defines the gradient.
	 * @param {Number} r0 Radius of the inner circle that defines the gradient.
	 * @param {Number} x1 Center position of the outer circle that defines the gradient.
	 * @param {Number} y1 Center position of the outer circle that defines the gradient.
	 * @param {Number} r1 Radius of the outer circle that defines the gradient.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)	
	 **/
	p.beginRadialGradientStroke = function(colors, ratios, x0, y0, r0, x1, y1, r1) {
		if (this._active) { this._newPath(); }
		var o = this._ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
		for (var i=0, l=colors.length; i<l; i++) {
			o.addColorStop(ratios[i], colors[i]);
		}
		this._strokeInstructions = [new Command(this._setProp, ["strokeStyle", o], false)];
		return this;
	}
	
	/**
	 * Begins a pattern fill using the specified image. This ends the current subpath.
	 * @method beginBitmapStroke
	 * @param {HTMLImageElement | HTMLCanvasElement | HTMLVideoElement} image The Image, Canvas, or Video object to use as the pattern.
	 * @param {String} repetition Optional. Indicates whether to repeat the image in the fill area. One of "repeat", "repeat-x",
	 * "repeat-y", or "no-repeat". Defaults to "repeat".
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)	
	 **/
	p.beginBitmapStroke = function(image, repetition) {
		if (this._active) { this._newPath(); }
		var o = this._ctx.createPattern(image, repetition || "");
		this._strokeInstructions = [new Command(this._setProp, ["strokeStyle", o], false)];
		return this;
	}
	
	
	/**
	 * Ends the current subpath, and begins a new one with no stroke. Functionally identical to beginStroke(null).
	 * @method endStroke
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 **/
	p.endStroke = function() {
		this.beginStroke();
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
	 * Draws a rounded rectangle with different corner radii. Supports positive and negative corner radii.
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
		var max = (w<h?w:h)/2;
		var mTL=0, mTR=0, mBR=0, mBL=0;
		if (radiusTL < 0) { radiusTL *= (mTL=-1); }
		if (radiusTL > max) { radiusTL = max; }
		if (radiusTR < 0) { radiusTR *= (mTR=-1); }
		if (radiusTR > max) { radiusTR = max; }
		if (radiusBR < 0) { radiusBR *= (mBR=-1); }
		if (radiusBR > max) { radiusBR = max; }
		if (radiusBL < 0) { radiusBL *= (mBL=-1); }
		if (radiusBL > max) { radiusBL = max; }
		
		this._dirty = this._active = true;
		var arcTo=this._ctx.arcTo, lineTo=this._ctx.lineTo;
		this._activeInstructions.push(
			new Command(this._ctx.moveTo, [x+w-radiusTR, y]),
			new Command(arcTo, [x+w+radiusTR*mTR, y-radiusTR*mTR, x+w, y+radiusTR, radiusTR]),
			new Command(lineTo, [x+w, y+h-radiusBR]),
			new Command(arcTo, [x+w+radiusBR*mBR, y+h+radiusBR*mBR, x+w-radiusBR, y+h, radiusBR]),
			new Command(lineTo, [x+radiusBL, y+h]),
			new Command(arcTo, [x-radiusBL*mBL, y+h+radiusBL*mBL, x, y+h-radiusBL, radiusBL]),
			new Command(lineTo, [x, y+radiusTL]),
			new Command(arcTo, [x-radiusTL*mTL, y-radiusTL*mTL, x+radiusTL, y, radiusTL]),
			new Command(this._ctx.closePath)
		);
		return this;
	} 
	
	/**
	 * Draws a circle with the specified radius at (x, y).
	*
	 * <pre><code>var g = new Graphics();
	*	g.setStrokeStyle(1);
	*	g.beginStroke(Graphics.getRGB(0,0,0));
	*	g.beginFill(Graphics.getRGB(255,0,0));
	*	g.drawCircle(0,0,3);
	*
	*	var s = new Shape(g);
	*		s.x = 100;
	*		s.y = 100;
	*
	*	stage.addChild(s);
	*	stage.update();</code></pre>
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
	p.drawEllipse = function(x, y, w, h, startAngle, endAngle, innerRadius) {
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
	 * Decodes a compact encoded path string into a series of draw instructions.
	 * This format is not intended to be human readable, and is meant for use by authoring tools.
	 * The format uses a base64 character set, with each character representing 6 bits, to define a series of draw commands.
	 * <br/><br/>
	 * Each command is comprised of a single "header" character followed by a variable number of alternating x and y position values.
	 * Reading the header bits from left to right (most to least significant): bits 1 to 3 specify the type of operation
	 * (0-moveTo, 1-lineTo, 2-quadraticCurveTo, 3-bezierCurveTo, 4-7 unused). Bit 4 indicates whether position values use 12 bits (2 characters) 
	 * or 18 bits (3 characters), with a one indicating the latter. Bits 5 and 6 are currently unused.
	 * <br/><br/>
	 * Following the header is a series of 2 (moveTo, lineTo), 4 (quadraticCurveTo), or 6 (bezierCurveTo) parameters.
	 * These parameters are alternating x/y positions represented by 2 or 3 characters (as indicated by the 4th bit in the command char).
	 * These characters consist of a 1 bit sign (1 is negative, 0 is positive), followed by an 11 (2 char) or 17 (3 char) bit integer value.
	 * All position values are in tenths of a pixel.
	 * Except in the case of move operations, this value is a delta from the previous x or y position (as appropriate).
	 * <br/><br/>
	 * For example, the string "A3cAAMAu4AAA" represents a line starting at -150,0 and ending at 150,0.
	 * A - bits 000000. First 3 bits (000) indicate a moveTo operation. 4th bit (0) indicates 2 chars per parameter.
	 * n0 - 110111011100. Absolute x position of -150.0px. First bit indicates a negative value, remaining bits indicate 1500 tenths of a pixel. 
	 * AA - 000000000000. Absolute y position of 0.
	 * I - 001100. First 3 bits (001) indicate a lineTo operation. 4th bit (1) indicates 3 chars per parameter.
	 * Au4 - 000000101110111000. An x delta of 300.0px, which is added to the previous x value of -150.0px to provide an absolute position of +150.0px.
	 * AAA - 000000000000000000. A y delta value of 0.
	 * 
	 * @method decodePath
	 * @param {String} str The path string to decode.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 **/
	p.decodePath = function(str) {
		var instructions = [this.moveTo, this.lineTo, this.quadraticCurveTo, this.bezierCurveTo];
		var paramCount = [2, 2, 4, 6];
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
			if (!fi) { x=y=0; }
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
	}
	
	/**
	 * Returns a clone of this Graphics instance.
	 * @method clone
	 * @return {Graphics} A clone of the current Graphics instance.
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
		o.drawAsPath = this.drawAsPath;
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
	
	/** Shortcut to decodePath.
	 * @property p
	 * @protected
	 * type Function
	 **/
	p.p = p.decodePath;
	
	
// private methods:
	/**
	 * @method _updateInstructions
	 * @protected
	 **/
	p._updateInstructions = function() {
		this._instructions = this._oldInstructions.slice();
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
	
	p._getEllipseArc = function(x, y, w, h, startAngle, endAngle) {
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

createjs.Graphics = Graphics;
}());
