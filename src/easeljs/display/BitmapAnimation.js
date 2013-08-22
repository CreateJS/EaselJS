/*
* BitmapAnimation
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
	"use strict";
/**
 * Deprecated in favour of {{#crossLink "Sprite"}}{{/crossLink}}.
 *
 * @class BitmapAnimation
 * @extends DisplayObject
 * @constructor
 * @param {SpriteSheet} spriteSheet The SpriteSheet instance to play back. This includes the source image(s), frame
 * dimensions, and frame data. See {{#crossLink "SpriteSheet"}}{{/crossLink}} for more information.
 * @deprecated Renamed to Sprite. Will be removed in a future version.
 **/

var e = "BitmapAnimation is deprecated in favour of Sprite. See VERSIONS file for info on changes.";
if (!createjs.Sprite) { throw(e); }
(createjs.BitmapAnimation = function(spriteSheet) {
  console.log(e);
  this.initialize(spriteSheet);
}).prototype = new createjs.Sprite();
})();
