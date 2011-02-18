/**
* Stage by Grant Skinner. Dec 5, 2010
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

/**
* Constructs a Stage object with the specified target canvas.
* @param canvas The canvas the stage will render to.
* @class A stage is the root level Container for a display list. Each time its tick method is called, it will render its display list to its target canvas.
* @augments Container
**/
Stage = function(canvas) {
  this.initialize(canvas);
}
var p = Stage.prototype = new Container();

// static properties:
	/** @private */
	Stage._snapToPixelEnabled = false; // snapToPixelEnabled is temporarily copied here during a draw to provide global access.

// public properties:
	/** Indicates whether the stage should automatically clear the canvas before each render. You can set this to false to manually control clearing (for generative art, or when pointing multiple stages at the same canvas for example). */
	p.autoClear = true;
	/** The canvas the stage will render to. Multiple stages can share a single canvas, but you must disable autoClear for all but the first stage that will be ticked (or they will clear each other's render). */
	p.canvas = null;
	/** READ-ONLY. The current mouse X position on the canvas. If the mouse leaves the canvas, this will indicate the most recent position over the canvas, and mouseInBounds will be set to false. */
	p.mouseX = null;
	/** READ-ONLY. The current mouse Y position on the canvas. If the mouse leaves the canvas, this will indicate the most recent position over the canvas, and mouseInBounds will be set to false. */
	p.mouseY = null;
	/** The onMouseMove callback is called when the user moves the mouse over the canvas.  The handler is passed a single param containing the corresponding MouseEvent instance. */
	p.onMouseMove = null;
	/** The onMouseUp callback is called when the user releases the mouse button anywhere that the page can detect it.  The handler is passed a single param containing the corresponding MouseEvent instance. */
	p.onMouseUp = null;
	/** The onMouseDown callback is called when the user presses the mouse button over the canvas.  The handler is passed a single param containing the corresponding MouseEvent instance. */
	p.onMouseDown = null;
	/** Indicates whether this stage should use the snapToPixel property of display objects when rendering them. */
	p.snapToPixelEnabled = false;
	/** Indicates whether the mouse is currently within the bounds of the canvas. */
	p.mouseInBounds = false;
	
// private properties:
	/** @private */
	p._tmpCanvas = null;
	/** @private */
	p._activeMouseEvent = null;
	/** @private */
	p._activeMouseTarget = null;
	/** @private */
	p._mouseOverIntervalID = null;
	/** @private */
	p._mouseOverX = 0;
	/** @private */
	p._mouseOverY = 0;
	/** @private */
	p._mouseOverTarget = null;
	
// constructor:
	/** @ignore */
	p.Container_initialize = p.initialize;
	/** @ignore */
	p.initialize = function(canvas) {
		this.Container_initialize();
		this.canvas = canvas;
		this.mouseChildren = true;
		
		var o = this;
		if (window.addEventListener) {
			window.addEventListener("mouseup", function(e) { o._handleMouseUp(e); }, false);
			window.addEventListener("mousemove", function(e) { o._handleMouseMove(e); }, false);
		} else if (document.addEventListener) {
			document.addEventListener("mouseup", function(e) { o._handleMouseUp(e); }, false);
			document.addEventListener("mousemove", function(e) { o._handleMouseMove(e); }, false);
		}
		canvas.addEventListener("mousedown", function(e) { o._handleMouseDown(e); }, false);
	}
	
// public methods:
	/**
	* Each time the update method is called, the stage will tick any descendants exposing a tick method (ex. BitmapSequence) and render its entire display list to the canvas.
	**/
	p.update = function() {
		if (!this.canvas) { return; }
		if (this.autoClear) { this.clear(); }
		Stage._snapToPixelEnabled = this.snapToPixelEnabled;
		this.draw(this.canvas.getContext("2d"), false, this.getConcatenatedMatrix(DisplayObject._workingMatrix));
	}
	
	/**
	* Calls the update method. Useful for adding stage as a listener to Ticker directly.
	**/
	p.tick = p.update;
	
	/**
	* Clears the target canvas. Useful if autoClear is set to false.
	**/
	p.clear = function() {
		if (!this.canvas) { return; }
		var ctx = this.canvas.getContext("2d");
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
	
	/**
	* Returns a data url that contains a Base64 encoded image of the contents of the stage. The returned data url can be 
	* specified as the src value of an image element.
	* @param backgroundColor The background color to be used for the generated image. The value can be any value HTML color
	* value, including HEX colors, rgb and rgba. The default value is a transparent background.
	* @param mimeType The MIME type of the image format to be create. The default is "image/png". If an unknown MIME type
	* is passed in, or if the browser does not support the specified MIME type, the default value will be used.
	* @returns a Base64 encoded image.
	**/
	p.toDataURL = function(backgroundColor, mimeType) {
		if(!mimeType) {
			mimeType = "image/png";
		}

		var ctx = this.canvas.getContext('2d');
		var w = this.canvas.width;
		var h = this.canvas.height;

		var data;

		if(backgroundColor) {

			//get the current ImageData for the canvas.
			data = ctx.getImageData(0, 0, w, h);

			//store the current globalCompositeOperation
			var compositeOperation = ctx.globalCompositeOperation;

			//set to draw behind current content
			ctx.globalCompositeOperation = "destination-over";

			//set background color
			ctx.fillStyle = backgroundColor;

			//draw background on entire canvas
			ctx.fillRect(0, 0, w, h);
		}

		//get the image data from the canvas
		var dataURL = this.canvas.toDataURL(mimeType);

		if(backgroundColor) {
			//clear the canvas
			ctx.clearRect (0, 0, w, h);

			//restore it with original settings
			ctx.putImageData(data, 0, 0);

			//reset the globalCompositeOperation to what it was
			ctx.globalCompositeOperation = compositeOperation;
		}

		return dataURL;
	}

	/**
	 * Enables or disables (by passing a frequency of 0) mouse over handlers (onMouseOver and onMouseOut) for this stage's display
	 * list. These events can be expensive to generate, so they are disabled by default, and the frequency of the events
	 * can be controlled independently of mouse move events via the frequency parameter.
	 * @param frequency The maximum number of times per second to broadcast mouse over/out events. Set to 0 to disable mouse over events completely. Maximum is 50. A lower frequency is less responsive, but uses less CPU.
	 */
	p.enableMouseOver = function(frequency) {
		if (this._mouseOverIntervalID) {
			clearInterval(this._mouseOverIntervalID);
			this._mouseOverIntervalID = null;
		}
		if (frequency <= 0) { return; }
		var o = this;
		this._mouseOverIntervalID = setInterval(function(){ o._testMouseOver(); }, 1000/Math.min(50,frequency));
		this._mouseOverX = NaN;
		this._mouseOverTarget = null;
	}
	
	p.clone = function() {
		var o = new Stage(null);
		this.cloneProps(o);
		return o;
	}
		
	p.toString = function() {
		return "[Stage (name="+  this.name +")]";
	}
	
// private methods:
	/** @private */
	p._handleMouseMove = function(e) {
		if (!this.canvas) {
			this.mouseX = this.mouseY = null;
			return;
		}
		if(!e){ e = window.event; }
		
		function getOffsetX( obj ) {
			var distX = 0;
			if(obj.offsetParent)
				while( 1 ) {
					distX += obj.offsetLeft;
					if(!obj.offsetParent)
						break;
					obj = obj.offsetParent;
				}
			else if( obj.x )
				distX += obj.x;
			return distX;
		}
		
		function getOffsetY( obj ) {
			var distY = 0;
			if(obj.offsetParent)
				while( 1 ) {
					distY += obj.offsetTop;
					if(!obj.offsetParent)
						break;
					obj = obj.offsetParent;
				}
			else if( obj.y )
				distY += obj.y;
			return distY;
		}
		
		var mouseX = e.pageX-getOffsetX( this.canvas );
		var mouseY = e.pageY-getOffsetY( this.canvas );
		
		var inBounds = (mouseX >= 0 && mouseY >= 0 && mouseX < this.canvas.width && mouseY < this.canvas.height);
		if (!inBounds && !this.mouseInBounds) { return; }
		
		if (inBounds) {
			this.mouseX = mouseX;
			this.mouseY = mouseY;
		}
		this.mouseInBounds = inBounds;
		var evt = new MouseEvent("onMouseMove", this.mouseX, this.mouseY);
		if (this.onMouseMove) { this.onMouseMove(evt); }
		if (this._activeMouseEvent && this._activeMouseEvent.onMouseMove) { this._activeMouseEvent.onMouseMove(evt); }
	}

	/** @private */
	p._handleMouseUp = function(e) {
		var evt = new MouseEvent("onMouseUp", this.mouseX, this.mouseY);
		if (this.onMouseUp) { this.onMouseUp(evt); }
		if (this._activeMouseEvent && this._activeMouseEvent.onMouseUp) { this._activeMouseEvent.onMouseUp(evt); }
		if (this._activeMouseTarget && this._activeMouseTarget.onClick && this._getObjectsUnderPoint(this.mouseX, this.mouseY, null, true, (this._mouseOverIntervalID ? 3 : 1)) == this._activeMouseTarget) {
			this._activeMouseTarget.onClick(new MouseEvent("onClick", this.mouseX, this.mouseY));
		}
		this._activeMouseEvent = this.activeMouseTarget = null;
	}

	/** @private */
	p._handleMouseDown = function(e) {
		if (this.onMouseDown) { this.onMouseDown(new MouseEvent("onMouseDown", this.mouseX, this.mouseY)); }
		var target = this._getObjectsUnderPoint(this.mouseX, this.mouseY, null, (this._mouseOverIntervalID ? 3 : 1));
		if (target) {
			if (target.onPress instanceof Function) {
				var evt = new MouseEvent("onPress", this.mouseX, this.mouseY);
				target.onPress(evt);
				if (evt.onMouseMove || evt.onMouseUp) { this._activeMouseEvent = evt; }
			}
			this._activeMouseTarget = target;
		}
	}

	/** @private */
	p._testMouseOver = function() {
		if (this.mouseX == this._mouseOverX && this.mouseY == this._mouseOverY && this.mouseInBounds) { return; }
		var target = null;
		if (this.mouseInBounds) {
			var target = this._getObjectsUnderPoint(this.mouseX, this.mouseY, null, 3);
			this._mouseOverX = this.mouseX;
			this._mouseOverY = this.mouseY;
		}
		if (this._mouseOverTarget != target) {
			if (this._mouseOverTarget && this._mouseOverTarget.onMouseOut) {
				this._mouseOverTarget.onMouseOut(new MouseEvent("onMouseOver", this.mouseX, this.mouseY));
			}
			if (target && target.onMouseOver) {
				target.onMouseOver(new MouseEvent("onMouseOut", this.mouseX, this.mouseY));
			}
			this._mouseOverTarget = target;
		}
	}

window.Stage = Stage;
}(window));