/**
* CoordTransform by Grant Skinner. Dec 5, 2010
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

// GDS: revisit optimizing these methods.
(function(window) {
	
// constructor:
	/**
	* The CoordTransform class uses a static interface and should not be instantiated.
	* @class CoordTransform class is a collection of methods used to transform coordinates between different display object's coordinate spaces.
	**/
	function CoordTransform() {
		throw "CoordTransform cannot be instantiated"; 
	}
	
// public static methods:
	/**
	* Transforms the specified x and y position from the coordinate space of the source display object
	* to the global (stage) coordinate space. For example, this could be used to position an HTML label
	* over a specific point on a nested display object. Returns a Point instance with x and y properties
	* correlating to the tranformed coordinates on the stage.
	* @param x The x position in the source display object to transform.
	* @param y The y position in the source display object to transform.
	* @param source The source display object.
	* @static
	**/
	CoordTransform.localToGlobal = function(x, y, source) {
		var mtx = CoordTransform.getConcatenatedMatrix(source);
		if (mtx == null) { return null; }
		var mtx2 = new Matrix2D(1,0,0,1,x,y);
		mtx2.appendMatrix(mtx);
		return new Point(mtx2.tx, mtx2.ty);
	}
	
	/**
	* Transforms the specified x and y position from the global (stage) coordinate space to the
	* coordinate space of the target display object. For example, this could be used to determine
	* the current mouse position within a specific display object. Returns a Point instance with x and y properties
	* correlating to the tranformed position in the target's coordinate space.
	* @param x The x position on the stage to transform.
	* @param y The y position on the stage to transform.
	* @param target The target display object.
	* @static
	**/
	CoordTransform.globalToLocal = function(x, y, target) {
		var mtx = CoordTransform.getConcatenatedMatrix(target);
		if (mtx == null) { return null; }
		mtx.invert();
		var mtx2 = new Matrix2D(1,0,0,1,x,y);
		mtx2.appendMatrix(mtx);
		return new Point(mtx2.tx, mtx2.ty);
	}
	
	/**
	* Transforms the specified x and y position from the coordinate space of the source display object to the
	* coordinate space of the target display object. Returns a Point instance with x and y properties
	* correlating to the tranformed position in the target's coordinate space. Effectively the same as calling
	* var pt = localToGlobal(x, y, source); pt = globalToLocal(pt.x, pt.y, target);
	* @param x The x position in the source display object to transform.
	* @param y The y position on the stage to transform.
	* @param source The display object that the original position is relative to.
	* @param target The target display object to which the coordinates will be transformed.
	* @static
	**/
	CoordTransform.localToLocal = function(x, y, source, target) {
		// TODO: this could be optimized to find the nearest shared parent, and pass it in as the goal.
		var pt = CoordTransform.localToGlobal(x, y, source);
		return CoordTransform.globalToLocal(pt.x, pt.y, target);
	}
	
	/**
	* Generates a concatenated Matrix2D object representing the combined transform of
	* the target display object and all of its parent Containers. This can be used to transform
	* positions between coordinate spaces, as with localToGlobal and globalToLocal.
	 * Returns null if the target is not on stage.
	* @param target The target display object to which the coordinates will be transformed.
	* @static
	**/
	CoordTransform.getConcatenatedMatrix = function(target) {
		mtx = new Matrix2D();
		while (true) {
			mtx.appendTransform(target.x, target.y, target.scaleX, target.scaleY, target.rotation, target.regX, target.regY);
			if ((p = target.parent) == null) { break; }
			target = p;
		}
		if (!target instanceof Stage) { return null; }
		return mtx;
	}
	
	
window.CoordTransform = CoordTransform;
}(window));