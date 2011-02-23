/*
* Text by Grant Skinner. Dec 5, 2010
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
	
/**
* Allows you to display one or more lines of dynamic text (not user editable) in the display list.
* Line wrapping support (using the lineWidth is very basic, wrapping on spaces and tabs only. Note
* that as an alternative to Text, you can position HTML text above or below the canvas relative to 
* items in the display list using the localToGlobal() method.
* @class Text
* @extends DisplayObject
* @constructor
* @param {String} text Optional. The text to display.
* @param {String} font Optional. The font style to use. Any valid value for the CSS font attribute is 
* acceptable (ex. "36px bold Arial").
* @param {String} color Optional. The color to draw the text in. Any valid value for the CSS color attribute
* is acceptable (ex. "#F00").
**/
Text = function(text, font, color) {
  this.initialize(text, font, color);
}

var p = Text.prototype = new DisplayObject();


/**
* @property _workingContext
* @type CanvasRenderingContext2D
* @private 
**/
Text._workingContext = document.createElement("canvas").getContext("2d");

// public properties:
	/**
	* The text to display.
	* @property text
	* @type String
	**/
	p.text = "";
	
	/**
	* The font style to use. Any valid value for the CSS font attribute is acceptable (ex. "bold 36px Arial"). 
	* @property font
	* @type String
	**/
	p.font = null;
	
	/**
	* The color to draw the text in. Any valid value for the CSS color attribute is acceptable (ex. "#F00").
	* @property color
	* @type String
	**/
	p.color = null;
	
	/**
	* The horizontal text alignment. Any of "start", "end", "left", "right", and "center". For detailed 
	* information view the 
	* <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#text-0">
	* whatwg spec</a>.
	* @property textAlign
	* @type String
	**/
	p.textAlign = null;
	
	/** The vertical alignment point on the font. Any of "top", "hanging", "middle", "alphabetic", 
	* "ideographic", or "bottom". For detailed information view the 
	* <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#text-0">
	* whatwg spec</a>.
	* @property textBaseline
	* @type String
	*/
	p.textBaseline = null;
	
	/** The maximum width to draw the text. If maxWidth is specified (not null), the text will be condensed or 
	* shrunk to make it fit in this width. For detailed information view the 
	* <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#text-0">
	* whatwg spec</a>.
	* @property maxWidth
	* @type Number
	*/
	p.maxWidth = null;
	
	/** If true, the text will be drawn as a stroke (outline). If false, the text will be drawn as a fill.
	* @property outline
	* @type Boolean
	**/
	p.outline = false;
	
	/** Indicates the line height (vertical distance between baselines) for multi-line text. If null, 
	* the value of getMeasuredLineHeight is used.
	* @property lineHeight
	* @type Number
	**/
	p.lineHeight = null;
	
	/**
	* Indicates the maximum width for a line of text before it is wrapped to multiple lines. If null, 
	* the text will not be wrapped.
	* @property lineWidth
	* @type Number
	**/
	p.lineWidth = null;
	
// constructor:
	/**
	* @property DisplayObject_initialize
	* @private
	* @type Function
	**/
	p.DisplayObject_initialize = p.initialize;
	
	/** 
	* Initialization method.
	* @method initialize
	* @protected
	*/
	p.initialize = function(text, font, color) {
		this.DisplayObject_initialize();
		this.text = text;
		this.font = font;
		this.color = color ? color : "#000";
	}
	
	/**
	* Returns true or false indicating whether the display object would be visible if drawn to a canvas.
	* This does not account for whether it would be visible within the boundaries of the stage.
	* NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	* @method isVisible
	* @return {Boolean} Boolean indicating whether the display object would be visible if drawn to a canvas
	**/
	p.isVisible = function() {
		return Boolean(this.visible && this.alpha > 0 && 
						this.scaleX != 0 && this.scaleY != 0 && this.text != null && this.text != "");
	}

	/**
	* @property DisplayObject_draw
	* @private
	* @type Function
	**/
	p.DisplayObject_draw = p.draw;
	
	/**
	* Draws the Text into the specified context ignoring it's visible, alpha, shadow, and transform.
	* Returns true if the draw was handled (useful for overriding functionality).
	* NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	* @method draw
	* @param {CanvasRenderingContext2D} ctx The canvas 2D context object to draw into.
	* @param {Boolean} ignoreCache Indicates whether the draw operation should ignore any current cache. 
	* For example, used for drawing the cache (to prevent it from simply drawing an existing cache back
	* into itself).
	**/
	p.draw = function(ctx, ignoreCache) {
		if (this.DisplayObject_draw(ctx, ignoreCache)) { return true; }
		
		if (this.outline) { ctx.strokeStyle = this.color; }
		else { ctx.fillStyle = this.color; }
		ctx.font = this.font;
		ctx.textAlign = this.textAlign ? this.textAlign : "start";
		ctx.textBaseline = this.textBaseline ? this.textBaseline : "alphabetic";

		var lines = String(this.text).split(/(?:\r\n|\r|\n)/);
		var lineHeight = (this.lineHeight == null) ? this.getMeasuredLineHeight() : this.lineHeight;
		var y = 0;
		for (var i=0, l=lines.length; i<l; i++) {
			var w = ctx.measureText(lines[i]).width;
			if (this.lineWidth == null || w < this.lineWidth) {
				this._drawTextLine(ctx, lines[i], y);
				y += lineHeight;
				continue;
			}

			// split up the line
			var words = lines[i].split(/(\s)/);
			var str = words[0];
			for (var j=1, jl=words.length; j<jl; j+=2) {
				// Line needs to wrap:
				if (ctx.measureText(str + words[j] + words[j+1]).width > this.lineWidth) {
					this._drawTextLine(ctx, str, y);
					y += lineHeight;
					str = words[j+1];
				} else {
					str += words[j] + words[j+1];
				}
			}
			this._drawTextLine(ctx, str, y); // Draw remaining text
			y += lineHeight;
		}
		return true;
	}
	
	/**
	* Returns the measured, untransformed width of the text.
	* @method getMeasuredWidth
	* @return {Number} The measured, untransformed width of the text.
	**/
	p.getMeasuredWidth = function() {
		return this._getWorkingContext().measureText(this.text).width;
	}

	/**
	* Returns an approximate line height of the text, ignoring the lineHeight property. This is based 
	* on the measured width of a "M" character multiplied by 1.2, which approximates em for most fonts.
	* @method getMeasuredLineHeight
	* @return {Number} an approximate line height of the text, ignoring the lineHeight property. This is 
	* based on the measured width of a "M" character multiplied by 1.2, which approximates em for most fonts.
	**/
	p.getMeasuredLineHeight = function() {
		return this._getWorkingContext().measureText("M").width*1.2;
	}
	
	/**
	* Returns a clone of the Point instance.
	* @method clone
	* @return {Point} a clone of the Point instance.
	**/
	p.clone = function() {
		var o = new Text(this.text, this.font, this.color);
		this.cloneProps(o);
		return o;
	}
		
	/**
	* Returns a string representation of this object.
	* @method toString
	* @return {String} a string representation of the instance.
	**/
	p.toString = function() {
		return "[Text (text="+  (this.text.length > 20 ? this.text.substr(0, 17)+"..." : this.text) +")]";
	}
	
// private methods:
	
	/**
	* @property DisplayObject_cloneProps
	* @private
	* @type Function
	**/
	p.DisplayObject_cloneProps = p.cloneProps;

	/** 
	 * @method cloneProps
	 * @param {Text} o
	 * @protected 
	 **/
	p.cloneProps = function(o) {
		this.DisplayObject_cloneProps(o);
		o.textAlign = this.textAlign;
		o.textBaseline = this.textBaseline;
		o.maxWidth = this.maxWidth;
		o.outline = this.outline;
		o.lineHeight = this.lineHeight;
		o.lineWidth = this.lineWidth;
	}

	/** 
	 * @method _getWorkingContext
	 * @protected 
	 **/
	p._getWorkingContext = function() {
		var ctx = Text._workingContext;
		ctx.font = this.font;
		ctx.textAlign = this.textAlign ? this.textAlign : "start";
		ctx.textBaseline = this.textBaseline ? this.textBaseline : "alphabetic";
		return ctx;
	}
	
	/** 
	 * @method _drawTextLine
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {Text} text
	 * @param {Number} y
	 * @protected 
	 **/
	p._drawTextLine = function(ctx, text, y) {
		if (this.outline) { ctx.strokeText(text, 0, y, this.maxWidth); }
		else { ctx.fillText(text, 0, y, this.maxWidth); }
	}

window.Text = Text;
}(window));