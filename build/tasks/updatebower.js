module.exports = function (grunt) {

	grunt.registerTask('updatebower', function() {
		var file = '../bower.json';
		var version = grunt.config.get('version');

		if (!grunt.file.exists(file)) {
			grunt.log.error(file+' not found.');
			return;
		}
		if (version == "NEXT") {
			grunt.log.error("NEXT versions are not submitted to Bower.");
			return;
		}

		var json = grunt.file.readJSON(file);
		json.version = version;
		json.main = json.main.replace(/\d\.\d\.\d|NEXT/, version);
		grunt.file.write(file, JSON.stringify(json, null, '\t'));
	});

}
