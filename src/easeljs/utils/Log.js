/*
* Log
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

// namespace:
this.createjs = this.createjs||{};

(function() {

/**
 * Log provides a centralized system for outputting errors. By default it will attempt to use console.log
 * to output messages, but this can be changed by setting the out property.
 * @class Log
 * @constructor
 **/
var Log = {};

/**
 * Read-only. Output no messages.
 * @type Number
 * @property NONE
 * @default 0
 * @static
 **/
Log.NONE = 0;

/**
 * Read-only. Error messages.
 * @type Number
 * @property ERROR
 * @default 1
 * @static
 **/
Log.ERROR = 1;

/**
 * Read-only. Warning messages.
 * @type Number
 * @property WARNING
 * @default 2
 * @static
 **/
Log.WARNING = 2;

/**
 * Read-only. Trace messages.
 * @type Number
 * @property TRACE
 * @default 3
 * @static
 **/
Log.TRACE = 3;

/**
 * Read-only. Output all messages.
 * @type Number
 * @property ALL
 * @default 255
 * @static
 **/
Log.ALL = 255;

/**
 * Defines the function that will be used to handle any logged messages. By default it will use console.log. The
 * specified function will be passed the same three parameters as Log.log, but the message will
 * be expanded if a matching key was found.<br/><br/>
 * For example, you could use this to log any messages to a server, or output it to a TextArea. You can disable all
 * logging by setting this to null.<br/><br/>
 * All messages are passed to the out function regardless of level settings, and the function must handle the level
 * appropriately. This is to allow, for example, functions that log all messages to a server, but only display
 * messages under the current level in the UI.
 * @type Function
 * @property out
 * @static
 **/
Log.out = function(message, details, level) {
	if (level<=Log.level && window.console) {
		if (details === undefined) { console.log(message); }
		else { console.log(message, details); }
	}
};

/**
 * Specifies the level of messages to output. For example, if you set <code>Log.level = Log.WARNING</code>, then any 
 * messages with a level of 2 (Log.WARNING) or less (ex. Log.ERROR) will be output. Defaults to Log.ALL.
 * @type Function
 * @property out
 * @default 255
 * @static
 **/
Log.level = 255;

/**
 * @property _keys
 * @static
 * @type Array
 * @protected
 **/
Log._keys = [];

/**
 * Adds a definition object that associates one or more keys with longer messages. 
 * These messages can optionally include "%DETAILS%" which will be replaced by any details passed
 * with the error. For example:<br/>
 * Log.addKeys( {MY_ERROR:"This is a description of my error [%DETAILS%]"} );
 * Log.error( "MY_ERROR" , 5 ); // outputs "This is a description of my error [5]"
 * @param {Object} keys The generic object defining the keys and messages.
 * @static
 * @method addKeys
 **/
Log.addKeys = function(keys) {
	Log._keys.unshift(keys);
};

/**
 * Outputs the specified error via the method assigned to the "out" property. If the error matches a key in any of the
 * loaded def objects, it will substitute that message.
 * @param {String} message The error message or key to output.
 * @param {Object} details Any details associated with this message.
 * @param {Number} level A number between 1 and 254 specifying the severity of this message. See Log.level for details.
 * @static
 * @method error
 **/
Log.log = function(message, details, level) {
	var out = Log.out;
	if (!out) { return; }
	var keys = Log._keys;
	if (level == null) { level = 3; }
	
	for (var i=0; i<keys.length; i++) {
		if (keys[i][message]) {
			message = keys[i][message];
			break;
		}
	}
	
	out(message, details, level);
}

createjs.Log = Log;
}());