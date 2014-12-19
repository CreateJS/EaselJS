/*
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
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.
*/

(function() {
	
	/**
	 * Simple slider control for EaselJS examples.
	 **/
	function Slider(min, max, width, height) {
		this.Shape_constructor();
		
	// public properties:
		this.min = this.value = min||0;
		this.max = max||100;
		
		this.width = width||100;
		this.height = height||20;
		
		this.values = {};
		
		this.trackColor = "#EEE";
		this.thumbColor = "#666";
		
		this.cursor = "pointer";
		this.on("mousedown", this._handleInput, this);
		this.on("pressmove", this._handleInput, this);
	}
	var p = createjs.extend(Slider, createjs.Shape);
	
	
// public methods:
	p.isVisible = function() { return true; };

	p.draw = function(ctx, ignoreCache) {
		if (this._checkChange()) {
			var x = (this.width-this.height) * Math.max(0,Math.min(1,(this.value-this.min) / (this.max-this.min)));
			this.graphics.clear()
				.beginFill(this.trackColor).drawRect(0,0,this.width,this.height)
				.beginFill(this.thumbColor).drawRect(x,0,this.height, this.height);
		}
		this.Shape_draw(ctx, true);
	};
	

// private methods:
	p._checkChange = function() {
		var a = this, b = a.values;
		if (a.value !== b.value || a.min !== b.min || a.max !== b.max || a.width !== b.width || a.height !== b.height) {
			b.min = a.min;
			b.max = a.max;
			b.value = a.value;
			b.width = a.width;
			b.height = a.height;
			return true;
		}
		return false;
	};
	
	p._handleInput = function(evt) {
		var val = (evt.localX-this.height/2)/(this.width-this.height)*(this.max-this.min)+this.min;
		val = Math.max(this.min, Math.min(this.max, val));
		if (val == this.value) { return; }
		this.value = val;
		this.dispatchEvent("change");
	};

	
	window.Slider = createjs.promote(Slider, "Shape");
}());