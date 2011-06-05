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

    // constructor:
    /**
		* The AnnimationManager class uses a static interface (ex. AnnimationManager.getList()) and should not be instantiated.
		* Provides a centralized way to animate DisplayObjects
		* @class AnnimationManager
		* @static
		**/
    AnnimationManager = function() {
        throw "AnnimationManager cannot be instantiated.";
    }
    // public static methods:
    /**
		* Adds an annimation
		* @method add
		* @static
		* @param {Annimation} annimation The annimation we have to add
		**/
    AnnimationManager.add = function(annimation) {
        AnnimationManager._annimations.push(annimation);
    }
    // private static properties:
    /** 
	* @property _annimations
	* @type Array[Object]
	* @protected 
	**/
    AnnimationManager._annimations = [];

    /** 
	* @property _easing
	* @type Object[String,function]
	* @protected 
	**/
    AnnimationManager._easing = {
        //t: current time, b: begInnIng value, c: change In value, d: duration
        linear: function(t, b, c, d) {
            return (t / d) * (c - b) + b;
        }
        // TODO : write some goods easing method
    }

    // private static methods:
    /**
	* Event listener for tick : the moment of annimation
	* @method tick
	* @static
	* @protected
	**/
    AnnimationManager.tick = function() {
        var t = (new Date()).getTime();
        var futureArray = [];
        for (var a in AnnimationManager._annimations) {
            var aa = AnnimationManager._annimations[a];
            var tt = t - aa.initialtime;
            if (tt < aa.timing) {
                aa.applyStep(t - aa.initialtime);
                futureArray.push(aa);
            } else {
                aa.applyEnd();
            }
        }
        AnnimationManager._annimations = futureArray;
    };



    ///////////////////////////////////////////
    // very important : add listener for have a tick event listener
    Ticker.addListener(AnnimationManager, false);
    window.AnnimationManager = AnnimationManager;
} (window));