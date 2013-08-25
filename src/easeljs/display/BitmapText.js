/*
* BitmapText
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

this.createjs = this.createjs || {};

(function () {
	"use strict";

/**
 * Displays text using bitmap glyphs defined in a sprite sheet. Multi-line text is supported
 * using new line characters, but automatic wrapping is not supported. See the 
 * {{#crossLink "BitmapText/spriteSheet:attribute"}}{{/crossLink}}
 * property for more information on defining glyphs.
 * @class BitmapText
 * @extends DisplayObject
 * @param {String} [text=""] The text to display.
 * @param {SpriteSheet} [spriteSheet=null] The spritesheet that defines the character glyphs.
 * @constructor
 **/
function BitmapText(text, spriteSheet) {
	this.initialize(text, spriteSheet);
}
var p = BitmapText.prototype = new createjs.DisplayObject();

// static properties:

// events:

// public properties:
	/**
	 * The text to display.
	 * @property text
	 * @type String
	 * @default ""
	 **/
	p.text = "";
	
	/**
	 * A SpriteSheet instance that defines the glyphs for this bitmap text. Each glyph/character
	 * should have a single frame animation defined in the sprite sheet named the same as
	 * corresponding character. For example, the following animation definition:
	 *
	 * 		"A": {frames: [0]}
	 *
	 * would indicate that the frame at index 0 of the spritesheet should be drawn for the "A" character. The short form
	 * is also acceptable:
	 * 
	 * 		"A": 0
	 *
	 * Note that if a character in the text is not found in the sprite sheet, it will also
	 * try to use the alternate case (upper or lower).
	 *
	 * See SpriteSheet for more information on defining sprite sheet data.
	 * @property spriteSheet
	 * @type String
	 * @default null
	 **/
	p.spriteSheet = null;

	/**
	 * The height of each line of text. If 0, then it will use a line height calculated
	 * by checking for the height of the "1", "T", or "L" character (in that order). If
	 * those characters are not defined, it will use the height of the first frame of the
	 * sprite sheet.
	 * @property lineHeight
	 * @type Number
	 * @default 0
	 **/
	p.lineHeight = 0;

	/**
	 * This spacing (in pixels) will be added after each character in the output.
	 * @property letterSpacing
	 * @type Number
	 * @default 0
	 **/
	p.letterSpacing = 0;

	/**
	 * If a space character is not defined in the sprite sheet, then empty pixels equal to
	 * spaceWidth will be inserted instead. If  0, then it will use a value calculated
	 * by checking for the width of the "1", "E", or "A" character (in that order). If
	 * those characters are not defined, it will use the width of the first frame of the
	 * sprite sheet.
	 * @property spaceWidth
	 * @type Number
	 * @default 0
	 **/
	p.spaceWidth = 0;
	
// private properties:
	
// constructor:
	/**
	 * @property DisplayObject_initialize
	 * @type Function
	 * @protected
	 **/
	p.DisplayObject_initialize = p.initialize;
	
	/**
	 * Initialization method.
	 * @method initialize
	 * @param {String} [text=""] The text to display.
	 * @param {SpriteSheet} [spriteSheet=null] The spritesheet that defines the character glyphs.
	 * @protected
	 **/
	p.initialize = function (text, spriteSheet) {
		this.DisplayObject_initialize();

		this.text = text;
		this.spriteSheet = spriteSheet;
	};
	
// public methods:
	/**
	 * @property DisplayObject_draw
	 * @type Function
	 * @protected
	 **/
	p.DisplayObject_draw = p.draw;
	
	/**
	 * Draws the display object into the specified context ignoring it's visible, alpha, shadow, and transform.
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
		this._drawText(ctx);
	};
	
	/**
	 * Returns true or false indicating whether the display object would be visible if drawn to a canvas.
	 * This does not account for whether it would be visible within the boundaries of the stage.
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method isVisible
	 * @return {Boolean} Boolean indicating whether the display object would be visible if drawn to a canvas
	 **/
	p.isVisible = function() {
		var hasContent = this.cacheCanvas || (this.spriteSheet && this.spriteSheet.complete && this.text);
		return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent);
	};
	
	/**
	 * Docced in superclass.
	 */
	p.getBounds = function() {
		var bounds = this._rectangle;
		this._drawText(null, bounds);
		return bounds.width ? bounds : null;
	};

// private methods:
	/**
	 * @method _getFrame
	 * @param {String} character
	 * @param {SpriteSheet} spriteSheet
	 * @protected
	 **/
	p._getFrame = function(character, spriteSheet) {
		var c, o = spriteSheet.getAnimation(character);
		if (!o) {
			(character != (c = character.toUpperCase())) || (character != (c = character.toLowerCase())) || (c=null);
			if (c) { o = spriteSheet.getAnimation(c); }
		}
		return o && spriteSheet.getFrame(o.frames[0]);
	};
	
	/**
	 * @method _getLineHeight
	 * @param {SpriteSheet} ss
	 * @protected
	 **/
	p._getLineHeight = function(ss) {
		var frame = this._getFrame("1",ss) || this._getFrame("T",ss) || this._getFrame("L",ss) || ss.getFrame(0);
		return frame ? frame.rect.height : 1;
	};
	
	/**
	 * @method _getSpaceWidth
	 * @param {SpriteSheet} ss
	 * @protected
	 **/
	p._getSpaceWidth = function(ss) {
		var frame = this._getFrame("1",ss) || this._getFrame("l",ss) || this._getFrame("e",ss) || this._getFrame("a",ss) || ss.getFrame(0);
		return frame ? frame.rect.width : 1;
	};
	
	/**
	 * @method _drawText
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {Object | Rectangle} bounds
	 * @protected
	 **/
	p._drawText = function(ctx, bounds) {
		var w, h, rx, x=0, y=0, spaceW=this.spaceWidth, lineH=this.lineHeight, ss=this.spriteSheet;
				
		var hasSpace = !!this._getFrame(" ", ss);
		if (!hasSpace && spaceW==0) { spaceW = this._getSpaceWidth(ss); }
		if (lineH==0) { lineH = this._getLineHeight(ss); }
		
		var maxX = 0;
		for(var i=0, l=this.text.length; i<l; i++) {
			var character = this.text.charAt(i);
			if (!hasSpace && character == " ") {
				x += spaceW;
				continue;
			} else if (character=="\n" || character=="\r") {
				if (character=="\r" && this.text.charAt(i+1) == "\n") { i++; } // crlf
				if (x-rx > maxX) { maxX = x-rx; }
				x = 0;
				y += lineH;
				continue;
			}

			var o = this._getFrame(character, ss);
			if (!o) { continue; }
			var rect = o.rect;
			rx = o.regX;
			w = rect.width;
			ctx&&ctx.drawImage(o.image, rect.x, rect.y, w, h=rect.height, x-rx, y-o.regY, w, h);
			
			x += w + this.letterSpacing;
		}
		if (x-rx > maxX) { maxX = x-rx; }
		
		if (bounds) {
			bounds.width = maxX-this.letterSpacing;
			bounds.height = y+lineH;
		}
	};

	createjs.BitmapText = BitmapText;
}());