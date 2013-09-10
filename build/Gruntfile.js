var path = require('path');
var _ = require('lodash');

module.exports = function (grunt) {
	grunt.initConfig(
			{
				pkg: grunt.file.readJSON('package.json'),

				// Default values
				version: 'NEXT',
				name: 'easeljs',
				docsZip: "<%= pkg.name %>_docs-<%= version %>.zip",

				// Setup doc names / paths.
				docsName: '<%= pkg.name %>_docs-<%= version %>',
				docsZip: "<%= docsName %>.zip",
				docsFolder: "./output/<%= docsName %>/",

				// Setup Uglify for JS minification.
				uglify: {
					options: {
						banner: grunt.file.read('LICENSE'),
						preserveComments: "some",
						compress: {
							global_defs: {
								"DEBUG": false
							}
						}
					},
					build: {
						files: {
							'output/<%= pkg.name.toLowerCase() %>-<%= version %>.min.js': getConfigValue('easel_source'),
							'output/movieclip-<%= version %>.min.js': getConfigValue('movieclip_source')
						}
					}
				},

				// Build docs using yuidoc
				yuidoc: {
					compile: {
						name: '<%= pkg.name %>',
						version: '<%= version %>',
						description: '<%= pkg.description %>',
						url: '<%= pkg.url %>',
						logo: '<%= pkg.logo %>',
						options: {
							paths: ['../src/'],
							outdir: '<%= docsFolder %>',
							linkNatives: true,
							attributesEmit: true,
							selleck: true,
							helpers: ["./path.js"],
							themedir: "createjsTheme/"
						}
					}
				},

				compress: {
					build: {
						options: {
							mode:'zip',
							archive:'output/<%= docsZip %>'
						},
						files: [
							{expand:true, src:'**', cwd:'<%= docsFolder %>'}
						]
					}
				},

				copy: {
					docsZip: {
						files: [
							{expand: true, cwd:'output/', src:'<%= docsZip %>', dest:'../docs/'}
						]
					},
					docsSite: {
						files: [
							{expand:true, cwd:'<%= docsFolder %>', src:'**', dest:getConfigValue('docs_out_path')}
						]
					},
					src: {
						files: [
							{expand: true, cwd:'./output/', src: '*.js', dest: '../lib/'}
						]
					}
				},

				updateversion: {
					easel: {
						file: '../src/easeljs/version.js',
						version: '<%= version %>'
					},
					movieclip: {
						file: '../src/easeljs/version_movieclip.js',
						version: '<%= version %>'
					}
				},
			}
	);
	function getHubTasks() {
		var arr = [
			getConfigValue('preload_path')+'build/Gruntfile.js',
			getConfigValue('tween_path')+'build/Gruntfile.js',
			getConfigValue('sound_path')+'build/Gruntfile.js'
		];
		return arr;
	}

	function getBuildConfig() {
		// Read the global settings file first.
		var config = grunt.file.readJSON('config.json');

		// If we have a config.local.json .. prefer its values.
		if (grunt.file.exists('config.local.json')) {
			var config2 = grunt.file.readJSON('config.local.json');
			_.extend(config, config2);
		}

		return config;
	}

	function getConfigValue(name) {
		var config = grunt.config.get('buildConfig');

		if (config == null) {
			config = getBuildConfig();
			grunt.config.set('buildConfig', config);
		}

		return config[name];
	}

	// Load all the tasks we need
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-yuidoc');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadTasks('tasks/');

	/**
	 * Build the docs using YUIdocs.
	 */
	grunt.registerTask('docs', [
		"yuidoc", "compress", "copy:docsZip"
	]);

	/**
	 * Sets out version to the version in package.json (defaults to NEXT)
	 */
	grunt.registerTask('setVersion', function () {
		grunt.config.set('version', grunt.config.get('pkg').version);
	});

	/**
	 * Task for exporting a next build.
	 *
	 */
	grunt.registerTask('next', [
		"coreBuild"
	]);

	/**
	 * Task for exporting a release build (version based on package.json)
	 *
	 */
	grunt.registerTask('build', [
		"setVersion", "coreBuild", "copy:docsSite"
	]);

	/**
	 * Main build task, always runs after next or build.
	 *
	 */
	grunt.registerTask('coreBuild', [
		"updateversion", "uglify", "docs", "copy:src"
	]);
};
