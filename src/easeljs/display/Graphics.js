/**
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
**/

(function(window) {

// used to create the instruction lists used in Graphics:
/** @private */
function Command(f, params) {
	this.f = f;
	this.params = params;
}
Command.prototype.exec = function(scope) { this.f.apply(scope, this.params); }

/**
* Constructs a new Graphics instance.
* @param instructions Optional. This is a string that will be eval'ed in the scope of this Graphics object. This provides a mechanism for generating a vector shape from a serialized string. Ex. "beginFill('#F00');drawRect(0, 0, 10, 10);"
* @class The Graphics class exposes an easy to use API for generating vector drawing instructions and drawing them to a specified context.
* Note that you can use Graphics without any dependency on the Easel framework by calling draw() directly,
* or it can be used with the Shape object to draw vector graphics within the context of an Easel display list.<br/><br/>
* Note that all drawing methods in Graphics return the Graphics instance, so they can be chained together. For example, the following line of code would generate the instructions to draw a rectangle with a red stroke and blue fill, then render it to the specified context2D:<br/>
* myGraphics.beginStroke("#F00").beginFill("#00F").drawRect(20, 20, 100, 50).draw(myContext2D);
**/
Graphics = function(instructions) {
	this.initialize(instructions);
}

// static public methods:
	
	/**
	* Returns a CSS compatible color string based on the specified RGB numeric color values in the format "rgba(255,255,255,1.0)", or if alpha is null then in the format "rgb(255,255,255)". For example,
	* Graphics.getRGB(50, 100, 150, 0.5) will return "rgba(50,100,150,0.5)". It also supports passing a single hex color value as the first param, and an optional alpha value as the second param. For example,
	* Graphics.getRGB(0xFF00FF, 0.2) will return "rgba(255,0,255,0.2)".
	* @param r The red component for the color, between 0 and 0xFF (255).
	* @param g The green component for the color, between 0 and 0xFF (255).
	* @param b The blue component for the color, between 0 and 0xFF (255).
	* @param alpha Optional. The alpha component for the color where 0 is fully transparent and 1 is fully opaque.
	* @static
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
	* Returns a CSS compatible color string based on the specified HSL numeric color values in the format "hsla(360,100,100,1.0)", or if alpha is null then in the format "hsl(360,100,100)". For example,
	* Graphics.getHSL(150, 100, 70) will return "hsl(150,100,70)".
	* @param hue The hue component for the color, between 0 and 360.
	* @param saturation The saturation component for the color, between 0 and 100.
	* @param lightness The lightness component for the color, between 0 and 100.
	* @param alpha Optional. The alpha component for the color where 0 is fully transparent and 1 is fully opaque.
	* @static
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
	**/
	Graphics.STROKE_CAPS_MAP = ["butt", "round", "square"];
	
	/**
	* Maps numeric values for the joints parameter of setStrokeStyle to corresponding string values.
	* This is primarily for use with the tiny API. The mappings are as follows: 0 to "miter",
	* 1 to "round", and 2 to "bevel".
	* For example, myGraphics.ss(16, 0, 2) would set the line joints to "bevel".
	**/
	Graphics.STROKE_JOINTS_MAP = ["miter", "round", "bevel"];
	
	Graphics._canvas = document.createElement("canvas");
	Graphics._ctx = Graphics._canvas.getContext("2d");
	
	Graphics.beginCmd = new Command(Graphics._ctx.beginPath, []);
	Graphics.fillCmd = new Command(Graphics._ctx.fill, []);
	Graphics.strokeCmd = new Command(Graphics._ctx.stroke, []);

// public properties:
	/** @private */
	Graphics.prototype._strokeInstructions = null;
	/** @private */
	Graphics.prototype._strokeStyleInstructions = null;
	/** @private */
	Graphics.prototype._fillInstructions = null;
	/** @private */
	Graphics.prototype._instructions = null;
	/** @private */
	Graphics.prototype._oldInstructions = null;
	/** @private */
	Graphics.prototype._activeInstructions = null;
	/** @private */
	Graphics.prototype._active = false;
	/** @private */
	Graphics.prototype._dirty = false;
	
// constructor:
	/** @ignore */
	Graphics.prototype.initialize = function(instructions) {
		this.clear();
		this._ctx = Graphics._ctx;
		with (this) { eval(instructions); }
	}
	
// public methods:
	Graphics.prototype.draw = function(ctx) {
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
	* @param x
	* @param y
	**/
	Graphics.prototype.moveTo = function(x, y) {
		this._activeInstructions.push(new Command(this._ctx.moveTo, [x, y]));
		return this;
	}
	
	/**
	* Draws a line from the current drawing point to the specified position, which become the new current drawing point. For detailed information, read the <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#complex-shapes-(paths)">whatwg spec</a>.
	* @param x
	* @param y
	**/
	Graphics.prototype.lineTo = function(x, y) {
		this._dirty = this._active = true;
		this._activeInstructions.push(new Command(this._ctx.lineTo, [x, y]));
		return this;
	}
	
	/**
	* Draws an arc with the specified control points and radius.  For detailed information, read the <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#complex-shapes-(paths)">whatwg spec</a>.
	* @param x1
	* @param y1
	* @param x2
	* @param y2
	* @param radius
	**/
	Graphics.prototype.arcTo = function(x1, y1, x2, y2, radius) {
		this._dirty = this._active = true;
		this._activeInstructions.push(new Command(this._ctx.arcTo, [x1, y1, x2, y2, radius]));
		return this;
	}
	
	/**
	* Draws an arc defined by the radius, startAngle and endAngle arguments, centered at the position (x, y). For example arc(100, 100, 20, 0, Math.PI*2) would draw a full circle with a radius of 20 centered at (100, 100). For detailed information, read the <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#complex-shapes-(paths)">whatwg spec</a>.
	* @param x
	* @param y
	* @param radius
	* @param startAngle
	* @param endAngle
	* @param anticlockwise
	**/
	Graphics.prototype.arc = function(x, y, radius, startAngle, endAngle, anticlockwise) {
		this._dirty = this._active = true;
		if (anticlockwise == null) { anticlockwise = false; }
		this._activeInstructions.push(new Command(this._ctx.arc, [x, y, radius, startAngle, endAngle, anticlockwise]));
		return this;
	}
	
	/**
	* Draws a quadratic curve from the current drawing point to (x, y) using the control point (cpx, cpy).  For detailed information, read the <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#complex-shapes-(paths)">whatwg spec</a>.
	* @param cpx
	* @param cpy
	* @param x
	* @param y
	**/
	Graphics.prototype.quadraticCurveTo = function(cpx, cpy, x, y) {
		this._dirty = this._active = true;
		this._activeInstructions.push(new Command(this._ctx.quadraticCurveTo, [cpx, cpy, x, y]));
		return this;
	}
	
	/**
	* Draws a bezier curve from the current drawing point to (x, y) using the control points (cp1x, cp1y) and (cp2x, cp2y).  For detailed information, read the <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#complex-shapes-(paths)">whatwg spec</a>.
	* @param cp1x
	* @param cp1y
	* @param cp2x
	* @param cp2y
	* @param x
	* @param y
	**/
	Graphics.prototype.bezierCurveTo = function(cp1x, cp1y, cp2x, cp2y, x, y) {
		this._dirty = this._active = true;
		this._activeInstructions.push(new Command(this._ctx.bezierCurveTo, [cp1x, cp1y, cp2x, cp2y, x, y]));
		return this;
	}
	
	/**
	* Draws a rectangle at (x, y) with the specified width and height using the current fill and/or stroke.
	*  For detailed information, read the 
	* <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#complex-shapes-(paths)">
	* whatwg spec</a>.
	* @param x
	* @param y
	* @param w Width of the rectangle
	* @param h Height of the rectangle
	**/
	Graphics.prototype.rect = function(x, y, w, h) {
		this._dirty = this._active = true;
		this._activeInstructions.push(new Command(this._ctx.rect, [x, y, w-1, h]));
		return this;
	}
	
	/**
	* Closes the current path, effectively drawing a line from the current drawing point to the first drawing point specified since the fill or stroke was last set.
	**/
	Graphics.prototype.closePath = function() {
		if (this._active) {
			this._dirty = true;
			this._activeInstructions.push(new Command(this._ctx.closePath, []));
		}
		return this;
	}
	
	
// public methods that roughly map to Flash graphics APIs:
	/**
	* Clears all drawing instructions, effectively reseting this Graphics instance.
	**/
	Graphics.prototype.clear = function() {
		this._instructions = [];
		this._oldInstructions = [];
		this._activeInstructions = [];
		this._strokeStyleInstructions = null;
		this._strokeInstructions = this._fillInstructions = null;
		this._active = this._dirty = false;
		return this;
	}
	
	/**
	* Begins a fill with the specified color. This ends the current subpath.
	* @param color A CSS compatible color value (ex. "#FF0000" or "rgba(255,0,0,0.5)"). Setting to null will result in no fill.
	**/
	Graphics.prototype.beginFill = function(color) {
		if (this._active) { this._newPath(); }
		this._fillInstructions = color ? [new Command(this._setProp, ["fillStyle", color])] : null;
		return this;
	}
	
	/**
	* Begins a linear gradient fill defined by the line (x0, y0) to (x1, y1). This ends the current subpath. For example, the following code defines a black to white vertical gradient ranging from 20px to 120px, and draws a square to display it:<br/>
	* myGraphics.beginLinearGradientFill(["#000","#FFF"], [0, 1], 0, 20, 0, 120).drawRect(20, 20, 120, 120);
	* @param colors An array of CSS compatible color values. For example, ["#F00","#00F"] would define a gradient drawing from red to blue.
	* @param ratios An array of gradient positions which correspond to the colors. For example, [0.1, 0.9] would draw the first color to 10% then interpolating to the second color at 90%.
	* @param x0 The position of the first point defining the line that defines the gradient direction and size.
	* @param y0 The position of the first point defining the line that defines the gradient direction and size.
	* @param x1 The position of the second point defining the line that defines the gradient direction and size.
	* @param y1 The position of the second point defining the line that defines the gradient direction and size.
	**/
	Graphics.prototype.beginLinearGradientFill = function(colors, ratios, x0, y0, x1, y1) {
		if (this._active) { this._newPath(); }
		var o = this._ctx.createLinearGradient(x0, y0, x1, y1);
		for (var i=0, l=colors.length; i<l; i++) {
			o.addColorStop(ratios[i], colors[i]);
		}
		this._fillInstructions = [new Command(this._setProp, ["fillStyle", o])];
		return this;
	}
	
	/**
	* Begins a radial gradient fill. This ends the current subpath. For example, the following code defines a red to blue radial gradient centered at (100, 100), with a radius of 50, and draws a circle to display it:<br/>
	* myGraphics.beginRadialGradientFill(["#F00","#00F"], [0, 1], 100, 100, 0, 100, 100, 50).drawCircle(100, 100, 50);
	* @param colors An array of CSS compatible color values. For example, ["#F00","#00F"] would define a gradient drawing from red to blue.
	* @param ratios An array of gradient positions which correspond to the colors. For example, [0.1, 0.9] would draw the first color to 10% then interpolating to the second color at 90%.
	* @param x0 Center position of the inner circle that defines the gradient.
	* @param y0 Center position of the inner circle that defines the gradient.
	* @param r0 Radius of the inner circle that defines the gradient.
	* @param x1 Center position of the outer circle that defines the gradient.
	* @param y1 Center position of the outer circle that defines the gradient.
	* @param r1 Radius of the outer circle that defines the gradient.
	**/
	Graphics.prototype.beginRadialGradientFill = function(colors, ratios, x0, y0, r0, x1, y1, r1) {
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
	* @param image The Image, Canvas, or Video object to use as the pattern.
	* @param repetition Optional. Indicates whether to repeat the image in the fill area. One of repeat, repeat-x, repeat-y, or no-repeat. Defaults to "repeat".
	**/
	Graphics.prototype.beginBitmapFill = function(image, repetition) {
		if (this._active) { this._newPath(); }
		repetition = repetition || "";
		var o = this._ctx.createPattern(image, repetition);
		this._fillInstructions = [new Command(this._setProp, ["fillStyle", o])];
		return this;
	}
	
	/**
	* Ends the current subpath, and begins a new one with no fill. Functionally identical to beginFill(null).
	**/
	Graphics.prototype.endFill = function() {
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
	**/
	Graphics.prototype.setStrokeStyle = function(thickness, caps, joints, miterLimit) {
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
	**/
	Graphics.prototype.beginStroke = function(color) {
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
	**/
	Graphics.prototype.beginLinearGradientStroke = function(colors, ratios, x0, y0, x1, y1) {
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
	**/
	Graphics.prototype.beginRadialGradientStroke = function(colors, ratios, x0, y0, r0, x1, y1, r1) {
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
	* @param image The Image, Canvas, or Video object to use as the pattern.
	* @param repetition Optional. Indicates whether to repeat the image in the fill area. One of repeat, repeat-x, repeat-y, or no-repeat. Defaults to "repeat".
	**/
	Graphics.prototype.beginBitmapStroke = function(image, repetition) {
		if (this._active) { this._newPath(); }
		repetition = repetition || "";
		var o = this._ctx.createPattern(image, repetition);
		this._strokeInstructions = [new Command(this._setProp, ["strokeStyle", o])];
		return this;
	}
	
	
	/**
	* Ends the current subpath, and begins a new one with no stroke. Functionally identical to beginStroke(null).
	**/
	Graphics.prototype.endStroke = function() {
		this.beginStroke(null);
		return this;
	}
	
	/**
	* Maps the familiar ActionScript curveTo() method to the functionally similar quatraticCurveTo() method.
	**/
	Graphics.prototype.curveTo = Graphics.prototype.quadraticCurveTo;
	
	/**
	* Maps the familiar ActionScript drawRect() method to the functionally similar rect() method.
	**/
	Graphics.prototype.drawRect = Graphics.prototype.rect;
	
	/**
	* Draws a rounded rectangle with all corners with the specified radius.
	* @param x
	* @param y
	* @param w
	* @param h
	* @param radius Corner radius.
	**/
	Graphics.prototype.drawRoundRect = function(x, y, w, h, radius) {
		this.drawRoundRectComplex(x, y, w, h, radius, radius, radius, radius);
		return this;
	}
	
	/**
	* Draws a rounded rectangle with different corner radiuses.
	* @param x
	* @param y
	* @param w
	* @param h
	* @param radiusTL Top left corner radius.
	* @param radiusTR Top right corner radius.
	* @param radiusBR Bottom right corner radius.
	* @param radiusBL Bottom left corner radius.
	**/
	Graphics.prototype.drawRoundRectComplex = function(x, y, w, h, radiusTL, radiusTR, radiusBR, radiusBL) {
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
	* @param x
	* @param y
	* @param radius
	**/
	Graphics.prototype.drawCircle = function(x, y, radius) {
		this.arc(x, y, radius, 0, Math.PI*2);
		return this;
	}
	
	/**
	* Draws an ellipse (oval).
	* @param x
	* @param y
	* @param w
	* @param h
	**/
	Graphics.prototype.drawEllipse = function(x, y, w, h) {
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
	* @param x Position of the center of the shape.
	* @param y Position of the center of the shape.
	* @param radius The outer radius of the shape.
	* @param sides The number of points on the star or sides on the polygon.
	* @param pointSize The depth or "pointy-ness" of the star points. A pointSize of 0 will draw a regular polygon (no points), a pointSize of 1 will draw nothing because the points are infinitely pointy.
	* @param angle The angle of the first point / corner. For example a value of 0 will draw the first point directly to the right of the center.
	**/
	Graphics.prototype.drawPolyStar = function(x, y, radius, sides, pointSize, angle) {
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
	
	Graphics.prototype.clone = function() {
		var o = new Graphics();
		o._instructions = this._instructions.slice();
		o._activeIntructions = this._activeInstructions.slice();
		o._oldInstructions = this._oldInstructions.slice();
		o._fillInstructions = this._fillInstructions.slice();
		o._strokeInstructions = this._strokeInstructions.slice();
		o._strokeStyleInstructions = this._strokeStyleInstructions.slice();
		o._active = this._active;
		o._dirty = this._dirty;
		o._assets = this._assets;
		return o;
	}
		
	Graphics.prototype.toString = function() {
		return "[Graphics]";
	}
	
	
// tiny API:
	/** Shortcut to moveTo. */
	Graphics.prototype.mt = Graphics.prototype.moveTo;
	/** Shortcut to lineTo. */
	Graphics.prototype.lt = Graphics.prototype.lineTo;
	/** Shortcut to arcTo. */
	Graphics.prototype.at = Graphics.prototype.arcTo;
	/** Shortcut to bezierCurveTo. */
	Graphics.prototype.bt = Graphics.prototype.bezierCurveTo;
	/** Shortcut to quadraticCurveTo / curveTo. */
	Graphics.prototype.qt = Graphics.prototype.quadraticCurveTo;
	/** Shortcut to arc. */
	Graphics.prototype.a = Graphics.prototype.arc;
	/** Shortcut to rect. */
	Graphics.prototype.r = Graphics.prototype.rect;
	/** Shortcut to closePath. */
	Graphics.prototype.cp = Graphics.prototype.closePath;
	/** Shortcut to clear. */
	Graphics.prototype.c = Graphics.prototype.clear;
	/** Shortcut to beginFill. */
	Graphics.prototype.f = Graphics.prototype.beginFill;
	/** Shortcut to beginLinearGradientFill. */
	Graphics.prototype.lf = Graphics.prototype.beginLinearGradientFill;
	/** Shortcut to beginRadialGradientFill. */
	Graphics.prototype.rf = Graphics.prototype.beginRadialGradientFill;
	/** Shortcut to beginBitmapFill. */
	Graphics.prototype.bf = Graphics.prototype.beginBitmapFill;
	/** Shortcut to endFill. */
	Graphics.prototype.ef = Graphics.prototype.endFill;
	/** Shortcut to setStrokeStyle. */
	Graphics.prototype.ss = Graphics.prototype.setStrokeStyle;
	/** Shortcut to beginStroke. */
	Graphics.prototype.s = Graphics.prototype.beginStroke;
	/** Shortcut to beginLinearGradientStroke. */
	Graphics.prototype.ls = Graphics.prototype.beginLinearGradientStroke;
	/** Shortcut to beginRadialGradientStroke. */
	Graphics.prototype.rs = Graphics.prototype.beginRadialGradientStroke;
	/** Shortcut to beginBitmapStroke. */
	Graphics.prototype.bs = Graphics.prototype.beginBitmapStroke;
	/** Shortcut to endStroke. */
	Graphics.prototype.es = Graphics.prototype.endStroke;
	/** Shortcut to drawRect. */
	Graphics.prototype.dr = Graphics.prototype.drawRect;
	/** Shortcut to drawRoundRect. */
	Graphics.prototype.rr = Graphics.prototype.drawRoundRect;
	/** Shortcut to drawRoundRectComplex. */
	Graphics.prototype.rc = Graphics.prototype.drawRoundRectComplex;
	/** Shortcut to drawCircle. */
	Graphics.prototype.dc = Graphics.prototype.drawCircle;
	/** Shortcut to drawEllipse. */
	Graphics.prototype.de = Graphics.prototype.drawEllipse;
	/** Shortcut to drawPolyStar. */
	Graphics.prototype.dp = Graphics.prototype.drawPolyStar;
	
	
// private methods:
	/** @private */
	Graphics.prototype._updateInstructions = function() {
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
	
	/** @private */
	Graphics.prototype._newPath = function() {
		if (this._dirty) { this._updateInstructions(); }
		this._oldInstructions = this._instructions;
		this._activeInstructions = [];
		this._active = this._dirty = false;
	}
	
	// used to create Commands that set properties:
	/** @private */
	Graphics.prototype._setProp = function(name, value) {
		this[name] = value;
	}

window.Graphics = Graphics;
}(window));