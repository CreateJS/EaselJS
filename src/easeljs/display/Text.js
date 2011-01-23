/**
* Text by Grant Skinner. Dec 5, 2010
* Visit www.gskinner.com/blog for documentation, updates and more free code.
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

/**
* Constructs a new Text instance.
* @param text Optional. The text to display.
* @param font Optional. The font style to use. Any valid value for the CSS font attribute is acceptable (ex. "36px bold Arial").
* @param color Optional. The color to draw the text in. Any valid value for the CSS color attribute is acceptable (ex. "#F00").
* @class Allows you to display a single line of dynamic text (not user editable) in the display list. Note that as an alternative to Text, you can position HTML text above or below the canvas relative to items in the display list using the localToGlobal() method.
* @augments DisplayObject
**/
function Text(text, font, color) {
  this.init(text, font, color);
}
var p = Text.prototype = new DisplayObject();

/** @private **/
var canvas = document.createElement("canvas");
Text._workingContext = canvas.getContext("2d");

// public properties:
	/** The text to display. **/
	p.text = "";
	/** The font style to use. Any valid value for the CSS font attribute is acceptable (ex. "bold 36px Arial"). **/
	p.font = null;
	/** The color to draw the text in. Any valid value for the CSS color attribute is acceptable (ex. "#F00"). **/
	p.color = null;
	/** The horizontal text alignment. Any of start, end, left, right, and center. For detailed information view the <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#text-0">whatwg spec</a>. **/
	p.textAlign = null;
	/** The vertical alignment point on the font. Any of top, hanging, middle, alphabetic, ideographic, or bottom. For detailed information view the <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#text-0">whatwg spec</a>. **/
	p.textBaseline = null;
	/** The maximum width to draw the text. If maxWidth is specifiied (not null), the text will be condensed or shrunk to make it fit in this width. For detailed information view the <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#text-0">whatwg spec</a>. **/
	p.maxWidth = null;
	/** If true, the text will be drawn as a stroke (outline). If false, the text will be drawn as a fill. **/
	p.outline = false;
	
// constructor:
	/** @private **/
	p._init = p.init;
	/** @private **/
	p.init = function(text, font, color) {
		this._init();
		this.text = text;
		this.font = font;
		this.color = color ? color : "#000";
	}
	
// public methods:
	p._draw = p.draw;
	p.draw = function(ctx,ignoreCache) {
		if (!this._draw(ctx,ignoreCache) || this.text == null || this.text.length == 0) { return false; }
		
		if (this.outline) { ctx.strokeStyle = this.color; }
		else { ctx.fillStyle = this.color; }
		ctx.font = this.font;
		ctx.textAlign = this.textAlign ? this.textAlign : "start";
		ctx.textBaseline = this.textBaseline ? this.textBaseline : "alphabetic";
		if (this.outline) { ctx.strokeText(this.text, 0, 0, this.maxWidth); }
		else { ctx.fillText(this.text, 0, 0, this.maxWidth); }
	}
	
	/**
	* Returns the measured, untransformed width of the text.
	**/
	p.getMeasuredWidth = function() {
		var ctx = Text._workingContext;
		ctx.font = this.font;
		ctx.textAlign = this.textAlign ? this.textAlign : "start";
		ctx.textBaseline = this.textBaseline ? this.textBaseline : "alphabetic";
		return ctx.measureText(this.text).width;
	}
	
	p.clone = function() {
		var o = new Text(this.text, this.font, this.color);
		this.cloneProps(o);
		return o;
	}
		
	p.toString = function() {
		return "[Text (text="+  (this.text.length > 20 ? this.text.substr(0,17)+"..." : this.text) +")]";
	}
	
// private methods:
	
	/** @private **/
	p._cloneProps = p.cloneProps;
	/** @private **/
	p.cloneProps = function(o) {
		this._cloneProps(o);
		o.textAlign = this.textAlign;
		o.textBaseline = this.textBaseline;
		o.maxWidth = this.maxWidth;
		o.outline = this.outline;
	}

window.Text = Text;
}(window));