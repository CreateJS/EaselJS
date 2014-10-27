/*
* extends
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

/**
 * @module CreateJS
 */
"use strict";

// namespace:
this.createjs = this.createjs||{};

/**
 * @class Utility Methods
 */



/**
 * Takes a newly created class and makes it extend a specified super class. Sets up the prototype chain (so instanceof works),
 * and automatically sets up local aliases for methods that are being overridden. It must always be called after the classes'
 * prototypes are fully populated
 * @method extends
 * @param {Function} sub The subclass.
 * @param {Function} sup The superclass to extend.
 * @param {String} [supName] The name of the superclass. This is only necessary if the constructor is an anonymous function (`MyClass = function()` instead of `function MyClass()`).
 * @return {Function} Returns the subclass for chaining.
 */
createjs.extends = function (sub, sup, supName) {
	var supP = sup.prototype, subP = sub.prototype;
	supName = supName || supP.constructor.name || /^function\s+([^\s\(]+)\s*\(/.exec(String(supP.constructor))[1];
	
	function o() { this.constructor = sub; }
	o.prototype = sup.prototype;
	var p = sub.prototype = new o();
	
	subP[supName+"_constructor"] = supP.constructor; // constructor is not innumerable
	for (var n in supP) { if (subP[n] && (typeof supP[n] == "function")) { subP[supName+"_"+n] = supP[n]; } } 
	for (n in subP) { p[n] = subP[n]; }
	
	return sub;
};