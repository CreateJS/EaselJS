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
	var net = require('net');
	var _callback;
	var _ports;
	var _opts;
	var _done;

	grunt.registerMultiTask('findopenport', 'Prints a list of active ips.', function() {
		_opts = this.options();

		_done = this.async();
		_ports = _opts['ports'] || [80, 8888, 9000, 9999, 9001];
		checkNext();
	});

	function checkNext() {
		if (!_ports.length) {
			grunt.option(_portName, -1);
			_done();
			return;
		}

		check(_ports.shift(), function(success, port) {
			if (!success) {
				checkNext();
			} else {
				//grunt.option(_portName, port);
				var configNames = Array.isArray(_opts.configName)?_opts.configName:[_opts.configName];

				configNames.forEach(function(item) {
					grunt.config.set(item, port);
				});
				_done();
			}
		});
	}

	function check(port, callback) {
		var server = net.createServer();
		server.on('error', function(e) {
			callback(false, port);
		});

		server.listen(port, function() {
			callback(true, port);
			server.close();
		});
	}
};
