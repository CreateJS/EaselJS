/*
* core
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
 * Sets up the prototype chain and constructor property for a new class.
 * 
 * This should be called right after creating the class constructor.
 * 
 * 	function MySubClass() {}
 * 	createjs.extend(MySubClass, MySuperClass); // returns the prototype
 * 	ClassB.prototype.doSomething = function() { }
 * 	
 * 	var foo = new MySubClass();
 * 	console.log(foo instanceof MySuperClass); // true
 * 	console.log(foo.prototype.constructor === MySubClass); // true
 * 
 * @method extends
 * @param {Function} subclass The subclass.
 * @param {Function} superclass The superclass to extend.
 * @return {Function} Returns the subclass's new prototype.
 */
createjs.extend = function(subclass, superclass) {
	function o() { this.constructor = subclass; }
	o.prototype = superclass.prototype;
	return (subclass.prototype = new o());
};

/**
 * Sets up aliases on this class to its super class's constructor and any methods that were overridden.
 * This allows the subclass to call super class methods without using `function.call`, providing better performance.
 * 
 * For example, if MySubClass extends MySuperClass, and both define a `draw` method, then calling `promote(MySubClass)`
 * would: add a `MySuperClass_constructor` method to MySubClass and promote the `draw` method on MySuperClass to the
 * prototype of MySubClass as `MySuperClass_draw`.
 * 
 * This should be called after the class's prototype is fully defined.
 * 
 * 	function ClassA(name) {
 * 		this.name = name;
 * 	}
 * 	ClassA.prototype.greet = function() {
 * 		return "Hello "+this.name;
 * 	}
 * 	
 * 	function ClassB(name, punctuation) {
 * 		this.ClassA_constructor(name);
 * 		this.punctuation = punctuation;	
 * 	}
 * 	createjs.extend(ClassB, ClassA);
 * 	ClassB.prototype.greet = function() {
 * 		return this.ClassA_greet()+this.punctuation;
 * 	}
 * 	createjs.promote(ClassB);
 * 	
 * 	var foo = new ClassB("World", "!?!");
 * 	console.log(foo.greet()); // Hello World!?!
 * 
 * @method extends
 * @param {Function} subclass The subclass to promote super class methods on.
 * @param {String} [superclassName] The name of the superclass. This is only necessary if the constructor is an anonymous function (`MyClass = function()` instead of `function MyClass()`).
 * @return {Function} Returns the subclass for chaining.
 */
createjs.promote = function(subclass, superclassName) {
	var getProto = Object.getPrototypeOf;
	var subP = subclass.prototype, supP = getProto ? getProto(subP) : subP.__proto__;
	superclassName = superclassName || supP.constructor.name || /^function\s+([^\s\(]+)\s*\(/.exec(String(supP.constructor))[1];
	
	subP[superclassName+"_constructor"] = supP.constructor; // constructor is not always innumerable
	for (var n in supP) {
		if (subP[n] && (typeof supP[n] == "function")) { subP[superclassName+"_"+n] = supP[n]; }
	} 
	
	return subclass;
};