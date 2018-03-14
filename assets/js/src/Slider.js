/**
 * @license
 *
 * Slider
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
 * OF MERCHANTABILITY, FITNESS FOR 3A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
import Shape from "../../../src/display/Shape";
class Slider extends Shape {
	constructor (min = 0, max = 100, width = 100, height = 20) {
		this.min = min;
		this.max = max;
		this.width = width;
		this.height = height;
		this.values = {};
		this.trackColor = "#EEE";
		this.thumbColor = "#666";
		this.cursor = "pointer";
		this.on("mousedown", this._handleInput, this);
		this.on("pressmove", this._handleInput, this);
	}
	isVisible () { return true; }
	draw (ctx, ignoreCache) {
		if (this._checkChange()) {
			const x = (this.width-this.height) * Math.max(0,Math.min(1,(this.value-this.min) / (this.max-this.min)));
			this.graphics.clear()
				.beginFill(this.trackColor).drawRect(0,0,this.width,this.height)
				.beginFill(this.thumbColor).drawRect(x,0,this.height, this.height);
		}
		super.draw(ctx, true);
	}
	_checkChange () {
		const a = this, b = a.values;
		if (a.value !== b.value || a.min !== b.min || a.max !== b.max || a.width !== b.width || a.height !== b.height) {
			b.min = a.min;
			b.max = a.max;
			b.value = a.value;
			b.width = a.width;
			b.height = a.height;
			return true;
		}
		return false;
	}
	_handleInput (evt) {
		const val = Math.max(
			this.min, Math.min(
				this.max,
				(evt.localX-this.height/2)/(this.width-this.height)*(this.max-this.min)+this.min
			)
		);
		if (val === this.value) { return; }
		this.value = val;
		this.dispatchEvent("change");
	}
}
export default Slider;
