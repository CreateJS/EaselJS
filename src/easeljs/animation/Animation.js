/*
* ColorFilter by Quentin ADAM - waxzce. June 5, 2011
* Visit http://easeljs.com/ for documentation, updates and examples.
*
*
* Copyright (c) 2010 Quentin ADAM
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
* The Easel Javascript library provides a retained graphics mode for canvas 
* including a full, hierarchical display list, a core interaction model, and 
* helper classes to make working with Canvas much easier.
* @module EaselJS
**/

 (function(window) {

    /**
	* Simple way for animate some things
	* @class Animation
	* @constructor
	**/
    Animation = function(target, goals, timing, easing) {
        this.initialize(target, goals, timing, easing);
    }
    var p = Animation.prototype;



    // constructor:
    /** 
	* Initialization method.
	* @method initialize
	* @protected
	* @param target the target element of the annimation
	* @param goals an object with the future values of the element properties
	* @param timing the time for the annimation in millisecond
	* @param easing name of the easing function
	**/
    p.initialize = function(target, goals, timing, easing) {
        this.target = target;
        this.goals = goals;
        this.timing = timing;
        this.easing = easing || 'linear';
        this.origin = {};
        this.initialtime = 0;
        for (var pp in goals) {
            this.origin[pp] = this.target[pp];
        }
    }
    // public methods:
    /**
		* Start the animation
		* @method start
		* @return {Animation} return the animation
		**/
    p.start = function() {
        this.initialtime = (new Date()).getTime();
        AnnimationManager.add(this);
        return this;
    }
    /**
	* Apply the animation step
	* @param t the current time for the annimation
	* @method applyStep
	**/
    p.applyStep = function(t) {
        for (var pp in this.goals) {
            this.target[pp] = AnnimationManager._easing[this.easing](t, this.origin[pp], this.goals[pp], this.timing);
            console.log(pp + ' : ' + this.target[pp]);
        }
    }
    /**
	* Apply the end animation
	* @method applyEnd
	**/
    p.applyEnd = function() {
        for (var pp in this.goals) {
            this.target[pp] = this.goals[pp];
        }
    }

    window.Animation = Animation;
} (window));