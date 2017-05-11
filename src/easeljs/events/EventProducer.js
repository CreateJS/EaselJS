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
	* Abstract class for managing events
	* @class EventProducer
	* @constructor
	**/
    EventProducer = function() {
        this.initialize();
    }
    var p = EventProducer.prototype;



    // constructor:
    /** 
	* Initialization method.
	* @method initialize
	* @protected
	**/
    p.initialize = function() {
        this.events = {};
    }
    // public methods:
    /**
	* Add an event listener
	* @param eventName the name of the event listened
	* @callback the function trigged
	* @method addEventListener
	**/
    p.addEventListener = function(eventName, callback) {
        if (this.events[eventName] == undefined) {
            this.events[eventName] = [callback];
        } else {
            this.events[eventName].push(callback);
        }
    }
    /**
	* Fire an Event
	* @param eventName the name of the event fired
	* @method fireEvent
	**/
    p.fireEvent = function(eventName) {
        if (this.events[eventName] !== undefined) {
            for (ee in this.events[eventName]) {
                this.events[eventName][ee]();
            }
        }
    }

    window.EventProducer = EventProducer;
} (window));