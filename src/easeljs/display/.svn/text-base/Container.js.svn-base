/**
* Container by Grant Skinner. Dec 5, 2010
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
* Constructs a new Container instance.
* @class Containers are nestable display lists that allow you to work with compound display elements. For example you could group arm, leg, torso and head Bitmaps together into a Person Container, and transform them as a group, while still being able to move the individual parts relative to each other. Children of containers have their transform and alpha properties concatenated with their parent Container. For example, a Shape with x=100 and alpha=0.5, placed in a Container with x=50 and alpha=0.7 will be rendered to the canvas at x=150 and alpha=0.35. Containers have some overhead, so you generally shouldn't create a Container to hold a single child.
* @augments DisplayObject
**/
function Container() {
  this.init();
}
var p = Container.prototype = new DisplayObject();

// public properties:
	/** The array of children in the display list. You should usually use the child management methods, rather than accessing this directly, but it is included for advanced users. **/
	p.children = null;
	/** Indicates whether the children of this Container should be tested in getObjectsUnderPoint() and getObjectUnderPoint() calls. It is false by default, except on Stage instances where it is true by default. **/
	p.mouseChildren = false;

// constructor:
	/** @private **/
	p._init = p.init;
	/** @private **/
	p.init = function() {
		this._init();
		this.children = [];
	}
	
// public methods:
	/** @private **/
	p._draw = p.draw;
	p.draw = function(ctx,ignoreCache) {
		if (this.children.length == 0) { return false; }
		if (!this._draw(ctx,ignoreCache)) { return false; }
		var l=this.children.length;
		// GDS: this fixes issues with display list changes that occur during a draw, but may have performance implications:
		var list = this.children.slice(0);
		for (var i=0; i<l; i++) {
			var child = list[i];
			if (child == null) { continue; }
			if (child.tick) { child.tick(); }
			child.updateContext(ctx);
			child.draw(ctx);
			child.revertContext();
		}
	}
	
	/**
	* Adds a child to the top of the display list. You can also add multiple children, such as "addChild(child1, child2, ...);". Returns the child that was added, or the last child if multiple children were added.
	* @param child The display object to add.
	**/
	p.addChild = function(child) {
		var l = arguments.length;
		if (l > 1) {
			for (var i=0; i<l; i++) { this.addChild(arguments[i]); }
			return arguments[l-1];
		}
		if (child.parent) { child.parent.removeChild(child); }
		child.parent = this;
		this.children.push(child);
		return child;
	}
	
	/**
	* Adds a child to the display list at the specified index, bumping children at equal or greater indexes up one, and setting its parent to this Container. You can also add multiple children, such as "addChildAt(child1, child2, ..., index);". The index must be between 0 and numChildren. For example, to add myShape under otherShape in the display list, you could use: container.addChildAt(myShape, container.getChildIndex(otherShape)). This would also bump otherShape's index up by one. Returns the last child that was added, or the last child if multiple children were added.
	* @param child The display object to add.
	* @param index The index to add the child at.
	**/
	p.addChildAt = function(child, index) {
		var l = arguments.length;
		if (l > 2) {
			index = arguments[i-1];
			for (var i=0; i<l-1; i++) { this.addChildAt(arguments[i],index+i); }
			return arguments[l-2];
		}
		if (child.parent) { child.parent.removeChild(child); }
		child.parent = this;
		this.children.splice(index, 0, child);
		return child;
	}
	
	/**
	* Removes the specified child from the display list. Note that it is faster to use removeChildAt() if the index is already known. You can also remove multiple children, such as "removeChild(child1, child2, ...);". Returns true if the child (or children) was removed, or false if it was not in the display list.
	* @param child The child to remove.
	**/
	p.removeChild = function(child) {
		var l = arguments.length;
		if (l > 1) {
			var good = true;
			for (var i=0; i<l; i++) { good = good && this.removeChild(arguments[i]); }
			return good;
		}
		return this.removeChildAt(this.children.indexOf(child));
	}
	
	/**
	* Removes the child at the specified index from the display list, and sets its parent to null. You can also remove multiple children, such as "removeChildAt(2, 7, ...);". Returns true if the child (or children) was removed, or false if any index was out of range.
	* @param The index of the child to remove.
	**/
	p.removeChildAt = function(index) {
		var l = arguments.length;
		if (l > 1) {
			var a = [];
			for (var i=0; i<l; i++) { a[i] = arguments[i]; }
			a.sort(function(a,b) { return b-a; })
			var good = true;
			for (var i=0; i<l; i++) { good = good && this.removeChildAt(a[i]); }
			return good;
		}
		if (index < 0 || index > this.children.length-1) { return false; }
		var child = this.children[index];
		if (child != null) { child.parent = null; }
		this.children.splice(index, 1);
		return true;
	}
	
	/**
	* Removes all children from the display list.
	**/
	p.removeAllChildren = function() {
		while (this.children.length) { this.removeChildAt(0); }
	}
	
	/**
	* Returns the child at the specified index.
	* @param index The index of the child to return.
	**/
	p.getChildAt = function(index) {
		return this.children[index];
	}
	
	/**
	* Performs an array sort operation on the child list.
	* @sortFunction the function to use to sort the child list. See javascript's Array.sort documentation for details.
	**/
	p.sortChildren = function(sortFunction) {
		this.children.sort(sortFunction);
	}
	
	/**
	* Returns the index of the specified child in the display list, or -1 if it is not in the display list.
	* @param The child to return the index of.
	**/
	p.getChildIndex = function(child) {
		return this.children.indexOf(child);
	}
	
	/**
	* Returns the number of children in the display list.
	**/
	p.getNumChildren = function() {
		return this.children.length;
	}
	
	p.clone = function() {
		var o = new Container();
		this.cloneProps(o);
		return o;
	}
	
	p.toString = function() {
		return "[Container (name="+  this.name +")]";
	}
	
// private properties:
	/** @private **/
	p._getObjectsUnderPoint = function(x,y,ctx,arr) {
		
		if (visible = false || ctx == null || !(this.mouseChildren||this.mouseEnabled) || this.children.length == 0) { return null; }
		
		var canvas = ctx.canvas;
		var w = canvas.width;
		
		// if we have a cache handy, we can use it to do a quick check:
		if (this.cacheCanvas) {
			this._draw(ctx);
			if (this._testHit(x,y,ctx)) {
				canvas.width = 0;
				canvas.width = w;
				if (this.mouseEnabled) {
					if (arr) { arr.push(this); }
					return this;
				}
			} else {
				return null;
			}
		}
		
		// draw children one at a time, and check if we get a hit:
		var a = ctx.globalAlpha;
		var l = this.children.length;
		for (var i=l-1;i>=0;i--) {
			var child = this.children[i];
			if (child == null || !(child.mouseEnabled || this.mouseEnabled || child.mouseChildren)) { continue; }
			
			child.updateContext(ctx,true);
			
			if (child instanceof Container) {
				var result = child._getObjectsUnderPoint(x,y,ctx,this.mouseEnabled ? null : arr);
				child.revertContext();
				if (this.mouseEnabled) {
					result = child;
					if (arr) { arr.push(result); }
				}
				if (result != null && arr == null) { return result; }
				continue;
			}
			
			child.draw(ctx);
			child.revertContext();
			if (!this._testHit(x,y,ctx)) { continue; }
			canvas.width = 0;
			canvas.width = w;
			if (this.mouseEnabled) {
				if (arr) { arr.push(this); }
				return this;
			} else if (arr) { arr.push(child); }
			else {
				return child;
			}
		}
		return null;
	}
	
	/** @private **/
	p._testHit = function(x,y,ctx) {
		try {
			var hit = ctx.getImageData(x,y,1,1).data[3] > 1;
		} catch (e) {
			throw "An error has occured. This is likely due to security restrictions on using getObjectsUnderPoint on a canvas with local or cross-domain images.";
		}
		return hit;
	}
	
	/** @private **/
	p._cloneProps = p.cloneProps;
	/** @private **/
	p.cloneProps = function(o) {
		this._cloneProps(o);
		o.mouseChildren = this.mouseChildren;
	}

window.Container = Container;
}(window));