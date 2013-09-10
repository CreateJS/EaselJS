module.exports = function (grunt) {

	grunt.registerMultiTask('updateversion', function() {
		var data = this.data;
		var file = data.file;
		var version = data.version;

		if (!grunt.file.exists(file)) {
			grunt.log.error(file+' not found.');
			return;
		}

		var contents = grunt.file.read(file);
		var pattern = /\/\*version\*\/"([\w.]+)"/g;

		var newValues = {date:new Date().toUTCString(), version:version};
		var newFile = replaceMetaData(contents, newValues);
		grunt.file.write(file, newFile);
	});

	function replaceMetaData(data, values) {
	    var finalResult = "";
	    var newData = data;
	    for(var n in values) {
	        var pattern = new RegExp("(\/\\*"+n+"\\*\/\")(.*)(\";)", "i");
	        var result = pattern.test(data);
	        if (result) {
	            finalResult = newData.replace(pattern, "$1"+values[n]+"$3");
	            newData = finalResult;
	        } else {
	            grunt.log.error("Error -- Unable to resolve value:"+ pattern);
	        }
	    }
	    return finalResult;
	}
}
