module.exports = function (grunt) {

	grunt.registerMultiTask('updateversion', function() {
		var newValues = {date:new Date().toUTCString(), version:this.data.version};
		replaceMetaData(this.data.file, newValues);
	});

	grunt.registerMultiTask('clearversion', function() {
		// Don't clear the version when building everything (the combined build will run this after its done)
		var buildArgs = grunt.config("buildArgs");
		if (buildArgs && buildArgs[0] == "all") {
			return;
		}
		replaceMetaData(this.data.file, {date:"", version:""});
	});

	function replaceMetaData(file, values) {
		if (!grunt.file.exists(file)) {
			grunt.log.error(file+' not found.');
			return;
		}

		var str = grunt.file.read(file);

	    for(var n in values) {
	        var pattern = new RegExp("(\/\\*="+n+"\\*\/\")(.*)(\";)", "g");
	        var result = pattern.test(str);
	        if (result) {
	            str = str.replace(pattern, "$1"+values[n]+"$3");
	        } else {
	            grunt.log.error("Error -- Unable to resolve value:"+ pattern);
	        }
	    }
		grunt.file.write(file, str);
	}
}
