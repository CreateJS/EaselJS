/*
* Copyright (c) 2014 gskinner.com, inc.
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

module.exports = function (grunt) {
	var os = require('os');

	grunt.registerMultiTask('listips', 'Prints a list of active ips.', function() {
		var opts = this.options({"port": 80});

		var port = opts.port;
		var label = opts.label?'('+opts.label+') ':'';

		if (port == 80) {
			port = '';
		} else {
			port = ':'+port;
		}

		var interfaces = os.networkInterfaces();
		var addresses = [];
		for (var n in interfaces) {
			for (var n2 in interfaces[n]) {
				var address = interfaces[n][n2];
				if (address.family == 'IPv4' && !address.internal) {
					addresses.push('http://'+address.address+port);
				}
			}
		}

		addresses.push('http://localhost'+port);
		grunt.log.subhead('\n'+label+'Listening on:\n\t', addresses.join('\n\t '));
	});
}
