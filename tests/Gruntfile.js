let PORT = 8000;

module.exports = function (grunt) {
	grunt.initConfig(
		{
			pkg: grunt.file.readJSON('package.json'),

			jasmine: {
				run: {
					src: [
						'../lib/easeljs-NEXT.js',
						'../src/easeljs/display/DisplayObject.js',
						'../src/easeljs/display/StageGL.js'
					],

					options: {
						styles: 'styles/styles.css',
						specs: 'spec/*Spec.js',
						helpers: [
							'spec/Helpers.js',
							'lib/js-imagediff/imagediff.js'
						],
						vendor: [
							'../_assets/libs/tweenjs-NEXT.min.js',
							'../_assets/libs/preloadjs-NEXT.min.js'
						],
						host: 'http://127.0.0.1:' + PORT
					}
				}
			},

			connect: {
				serve: {
					options: {
						keepalive: true,
						base: [{
							path: __dirname,
							options:{
								index: '_SpecRunner.html'
							}
						}, '..'],
						useAvailablePort: true,
						port: PORT,
						open: true
					}
				},
				chrome: {
					options: {
						base: [{
							path: __dirname,
							options:{
								index: '_SpecRunner.html'
							}
						}, '..'],
						useAvailablePort: true,
						port: PORT
					}
				}
			},

			listips: {
				run: {
					options: {
						label: "Normal"
					}
				}
			}
		}
	);

	// Load all the tasks we need
	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadTasks('tasks/');

	grunt.registerTask("default", "Launches browser-based tests","serve");
	grunt.registerTask("serve", "Launches browser-based tests", ["jasmine:run:build", "listips", "connect"]);
	grunt.registerTask("headless", "Launches chrome headless tests", ["connect:chrome", "jasmine"]);
};
