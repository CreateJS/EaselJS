## EaselJS uses [Grunt](http://gruntjs.com/) to manage the build process.

## To use

### Install dependencies

Node (0.10.x or greater is required):

	# check the version
	node -v

If your node is out of date, install the latest from [NodeJS.org](http://nodejs.org/)

After node is setup, install the other dependencies:

	# Install the grunt command line utility
	sudo npm install grunt-cli -g

	# Install all the dependencies for this project.
	npm install

### Setup

You'll need to change the default settings to suit your work environment. We have 2 config files:

* config.json: Meant to be in git and pushed to all developers.
* config.local.json: Added to .gitignore and and only for your local setup (any settings in here will override those in config.json)

Please adjust these settings to match your environment. All paths can either be relative from the build folder, or absolute paths.

* docs_out_path - Location of the created YUIdocs. (Will be in your CreateJS.com/Docs/ folder)

### Building
To export a release build for this library run:

    grunt build

This command will:

* Update the version.js file(s) with the current date and version number
* Create the {PROJECT_NAME}-{VERSION}.min.js file
* Compile the documentation to config.docs_out_path
* Create a zip file of the documentation
* Copy the documentation zip to ../docs
* Copy the generated .js file to ../lib
* Copy All examples from ../examples to config.examples_out_path (part of the overall build process)

**NEXT version**

The same process as above, but uses "NEXT" as the version. This is used to generate minified builds with the latest source between tags.

	grunt next

**Combined File**

The same as the NEXT process, but will not minify the source code. All code formatting and comments are left intact.

	grunt combine


### All commands

* grunt build -  Build everything based on the version in package.json
* grunt next - Build everything using the NEXT version.
* grunt combine - Build a NEXT version, but leave comments and formatting intact.
* grunt docs - Build only the docs
* grunt uglify - Create the Easel and MovieClip min files. (Will use NEXT as the version)
