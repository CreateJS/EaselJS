/**
 * BitmapText
 * Visit http://createjs.com/ for documentation, updates and examples.
 *
 * Copyright (c) 2019 gskinner.com, inc.
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
 *
 * @license
 */

import Container from "./Container";
import Sprite from "./Sprite";

/**
 * Displays text using bitmap glyphs defined in a sprite sheet. Multi-line text is supported using new line characters,
 * but automatic wrapping is not supported. See the {@link easeljs.BitmapText#spriteSheet} property for more information on defining glyphs.
 *
 * <strong>Important:</strong> While BitmapText extends Container, it is not designed to be used as one.
 * As such, methods like addChild and removeChild are disabled.
 *
 * @memberof easeljs
 * @extends easeljs.Container
 */
export default class BitmapText extends Container {

	/**
	 * @param {String} [text=""] The text to display.
	 * @param {SpriteSheet} [spriteSheet] The spritesheet that defines the character glyphs.
	 */
	constructor(text="", spriteSheet = null) {
		super();

		/**
		 * The text to display.
		 * @type {String}
		 * @default ""
		 */
		this.text = text;

		/**
		 * A SpriteSheet instance that defines the glyphs for this bitmap text. Each glyph/character
		 * should have a single frame animation defined in the sprite sheet named the same as
		 * corresponding character. For example, the following animation definition:
		 *
		 * @example
		 * // the following animation definition would indicate that the frame at index 0 of the spritesheet should be drawn for the "A" character.
		 * "A": {frames: [0]}
		 * // The short form is also acceptable:
		 * "A": 0
		 *
		 * Note that if a character in the text is not found in the sprite sheet, it will also
		 * try to use the alternate case (upper or lower).
		 *
		 * @see {@link easeljs.SpriteSheet}
		 * @type {easeljs.SpriteSheet}
		 * @default null
		 */
		this.spriteSheet = spriteSheet;

		/**
		 * The height of each line of text. If 0, then it will use a line height calculated
		 * by checking for the height of the "1", "T", or "L" character (in that order). If
		 * those characters are not defined, it will use the height of the first frame of the
		 * sprite sheet.
		 *
		 * @type {Number}
		 * @default 0
		 */
		this.lineHeight = 0;

		/**
		 * This spacing (in pixels) will be added after each character in the output.
		 * @type {Number}
		 * @default 0
		 */
		this.letterSpacing = 0;

		/**
		 * If a space character is not defined in the sprite sheet, then empty pixels equal to
		 * spaceWidth will be inserted instead. If 0, then it will use a value calculated
		 * by checking for the width of the "1", "l", "E", or "A" character (in that order). If
		 * those characters are not defined, it will use the width of the first frame of the
		 * sprite sheet.
		 * @type {Number}
		 * @default 0
		 */
		this.spaceWidth = 0;

	 	/**
		 * @type {Object}
		 * @protected
		 */
		this._oldProps = {text:0,spriteSheet:0,lineHeight:0,letterSpacing:0,spaceWidth:0};

		/**
		 * Used to track the object which this class attached listeners to, helps optimize listener attachment.
		 * @type {easeljs.Stage}
		 * @protected
		 */
		this._oldStage = null;

		/**
		 * The event listener proxy triggered drawing draw for special circumstances.
		 * @type {Function}
		 * @protected
		 */
		this._drawAction = null;
	}

	draw(ctx, ignoreCache = false) {
		if (this.drawCache(ctx, ignoreCache)) { return; }
		this._updateState();
		super.draw(ctx, ignoreCache);
	};

	getBounds() {
		this._updateText();
		return super.getBounds();
	}

	isVisible() {
		const hasContent = this.cacheCanvas || (this.spriteSheet && this.spriteSheet.complete && this.text);
		return !!(this.visible && this.alpha > 0 && this.scaleX !== 0 && this.scaleY !== 0 && hasContent);
	}

	clone() {
		return this._cloneProps(new BitmapText(this.text, this.spriteSheet));
	}

	/** <strong>Disabled in BitmapText.</strong> */
	addChild() {}
	/** <strong>Disabled in BitmapText.</strong> */
	addChildAt() {}
	/** <strong>Disabled in BitmapText.</strong> */
	removeChild() {}
	/** <strong>Disabled in BitmapText.</strong> */
	removeChildAt() {}
	/** <strong>Disabled in BitmapText.</strong> */
	removeAllChildren() {}

	_updateState() {
		this._updateText();
	}

 	/**
	 * @param {easeljs.BitmapText} o
	 * @return {easeljs.BitmapText}
	 * @protected
	 */
	_cloneProps(o) {
		super._cloneProps(o);
		o.lineHeight = this.lineHeight;
		o.letterSpacing = this.letterSpacing;
		o.spaceWidth = this.spaceWidth;
		return o;
	}

	/**
	 * @param {String} character
	 * @param {easeljs.SpriteSheet} spriteSheet
	 * @return {Number}
	 * @protected
	 */
	_getFrameIndex(character, spriteSheet) {
		let c, o = spriteSheet.getAnimation(character);
		if (!o) {
			(character != (c = character.toUpperCase())) || (character != (c = character.toLowerCase())) || (c=null);
			if (c) { o = spriteSheet.getAnimation(c); }
		}
		return o && o.frames[0];
	}

	/**
	 * @param {String} character
	 * @param {easeljs.SpriteSheet} spriteSheet
	 * @return {Object}
	 * @protected
	 */
	_getFrame(character, spriteSheet) {
		const index = this._getFrameIndex(character, spriteSheet);
		return index == null ? index : spriteSheet.getFrame(index);
	}

	/**
	 * @param {easeljs.SpriteSheet} ss
	 * @return {Number}
	 * @protected
	 */
	_getLineHeight(ss) {
		const frame = this._getFrame("1",ss) || this._getFrame("T",ss) || this._getFrame("L",ss) || ss.getFrame(0);
		return frame ? frame.rect.height : 1;
	}

	/**
	 * @param {easeljs.SpriteSheet} ss
	 * @return {Number}
	 * @protected
	 */
	_getSpaceWidth(ss) {
		const frame = this._getFrame("1",ss) || this._getFrame("l",ss) || this._getFrame("e",ss) || this._getFrame("a",ss) || ss.getFrame(0);
		return frame ? frame.rect.width : 1;
	}

	/**
	 * @protected
	 */
	_updateText() {
		let x = 0,
				y = 0,
				childIndex = 0,
				numKids = kids.length,
				o = this._oldProps,
				change = false,
				spaceW = this.spaceWidth,
				lineH = this.lineHeight,
				ss = this.spriteSheet,
				sprite;

		const pool = BitmapText._spritePool,
					kids = this.children;

		for (let n in o) {
			if (o[n] != this[n]) {
				o[n] = this[n];
				change = true;
			}
		}
		if (!change) { return; }

		const hasSpace = !!this._getFrame(" ", ss);
		if (!hasSpace && !spaceW) { spaceW = this._getSpaceWidth(ss); }
		if (!lineH) { lineH = this._getLineHeight(ss); }

		for (let i = 0, l = this.text.length; i < l; i++) {
			const character = this.text.charAt(i);
			if (character == " " && !hasSpace) {
				x += spaceW;
				continue;
			} else if (character=="\n" || character=="\r") {
				if (character=="\r" && this.text.charAt(i+1) == "\n") { i++; } // crlf
				x = 0;
				y += lineH;
				continue;
			}

			const index = this._getFrameIndex(character, ss);
			if (index == null) { continue; }

			if (childIndex < numKids) {
				sprite = kids[childIndex];
			} else {
				kids.push(sprite = pool.length ? pool.pop() : new Sprite());
				sprite.parent = this;
				numKids++;
			}
			sprite.spriteSheet = ss;
			sprite.gotoAndStop(index);
			sprite.x = x;
			sprite.y = y;
			childIndex++;

			x += sprite.getBounds().width + this.letterSpacing;
		}

		while (numKids > childIndex) {
			 // faster than removeChild.
			pool.push(sprite = kids.pop());
			sprite.parent = null;
			numKids--;
		}

		if (pool.length > BitmapText.maxPoolSize) { pool.length = BitmapText.maxPoolSize; }
	}

}

/**
 * BitmapText uses Sprite instances to draw text. To reduce the creation and destruction of instances (and thus garbage collection), it maintains
 * an internal object pool of sprite instances to reuse. Increasing this value can cause more sprites to be
 * retained, slightly increasing memory use, but reducing instantiation.
 * @type {Number}
 * @static
 * @default 100
 */
BitmapText.maxPoolSize = 100;

/**
 * Sprite object pool.
 * @type {Array}
 * @static
 * @private
 */
BitmapText._spritePool = [];
