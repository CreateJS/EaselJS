/**
 * @license Canvas
 * Visit http://createjs.com/ for documentation, updates and examples.
 *
 * Copyright (c) 2017 gskinner.com, inc.
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
 * Global utility for creating canvases.
 * @memberof easeljs
 * @name easeljs.createCanvas
 * @param {Number} [width=1]
 * @param {Number} [height=1]
 */
export default function createCanvas(width = 1, height = 1) {
	let c;
	if (window.createjs !== undefined && window.createjs.createCanvas !== undefined) {
		c = window.createjs.createCanvas();
	}
	if (window.document !== undefined && window.document.createElement !== undefined) {
		c = document.createElement("canvas");
	}
	if (c !== undefined) {
		c.width = width;
		c.height = height;
		return c;
	}

	throw "Canvas not supported in this environment.";
}
