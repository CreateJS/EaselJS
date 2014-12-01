module.exports = function (grunt) {
	grunt.initConfig(
		{
			pkg: grunt.file.readJSON('package.json'),

			jasmine: {
				run: {
					src: [
						'../lib/easeljs-NEXT.combined.js',
						'../examples/assets/tweenjs-NEXT.min.js',
						'../lib/movieclip-0.7.1.combined.js',
					],
					options: {
						specs: 'spec/*Spec.js',
						helpers: [
							'spec/Helpers.js',
							'lib/js-imagediff/imagediff.js'
						]
					}
				}
			},

			connect: {
				server: {
					options: {
						keepalive: true,
						base: ['../_assets/', '../lib/', '../', './']
					}
				}
			},

			findopenport: {
				connect: {
					options: {
						ports: [8000, 8888, 9000, 9999, 9001, 8001],
						configName: "connect.server.options.port"
					}
				}
			},

			listips: {
				run: {
					options: {
						port: "<%=connect.server.options.port %>",
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

	grunt.registerTask("default", ["findopenport", "listips", "connect"]);
};
